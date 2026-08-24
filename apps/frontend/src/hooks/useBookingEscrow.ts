/**
 * useBookingEscrow Hook
 * Custom hook for managing event booking escrow creation logic
 */

import { useMemo, useCallback } from 'react';
import { useWallet } from '@/components/auth/wallet/hooks/wallet.hook';
import {
  BookingData,
  EventData,
  EscrowType,
  EscrowFormData,
  EscrowMilestone,
  UseBookingEscrowOptions,
  UseBookingEscrowReturn,
} from '@/interfaces/booking-escrow.interface';
import { trustlineOptions } from '@/components/tw-blocks/wallet-kit/trustlines';

// Constants
const STROOPS_MULTIPLIER = 10000000; // 1 XLM = 10,000,000 stroops
const PLATFORM_NAME = 'TrueStub';
const VERSION = '1.0.0';

// Milestone split percentages
const MILESTONE_SPLITS = {
  checkIn: 0.7, // 70% on check-in
  checkOut: 0.3, // 30% on check-out
};

/**
 * Converts a regular amount to stroops (Stellar's smallest unit)
 */
const toStroops = (amount: number): string => {
  return Math.round(amount * STROOPS_MULTIPLIER).toString();
};

/**
 * Validates Stellar wallet address format
 */
const isValidStellarAddress = (address: string): boolean => {
  return /^G[A-Z0-9]{55}$/.test(address);
};

/**
 * Validates booking data completeness
 */
const validateBookingData = (booking: BookingData): string[] => {
  const errors: string[] = [];

  if (!booking.id) errors.push('Booking ID is required');
  if (!booking.eventId) errors.push('Hotel ID is required');
  if (!booking.roomId) errors.push('Room ID is required');
  if (!booking.totalAmount || booking.totalAmount <= 0) {
    errors.push('Valid booking amount is required');
  }
  if (!booking.checkInDate) errors.push('Check-in date is required');
  if (!booking.checkOutDate) errors.push('Check-out date is required');
  if (!booking.guestEmail) errors.push('Guest email is required');

  // Validate dates
  const checkIn = new Date(booking.checkInDate);
  const checkOut = new Date(booking.checkOutDate);
  if (checkOut <= checkIn) {
    errors.push('Check-out date must be after check-in date');
  }

  return errors;
};

/**
 * Validates event data completeness
 */
const validateEventData = (event: EventData): string[] => {
  const errors: string[] = [];

  if (!event.id) errors.push('Hotel ID is required');
  if (!event.name) errors.push('Hotel name is required');
  if (!event.walletAddress) {
    errors.push('Hotel wallet address is required');
  } else if (!isValidStellarAddress(event.walletAddress)) {
    errors.push('Invalid event wallet address format');
  }

  return errors;
};

/**
 * Custom hook for event booking escrow management
 */
export function useBookingEscrow({
  bookingData,
  eventData,
  escrowType,
}: UseBookingEscrowOptions): UseBookingEscrowReturn {
  const { address: guestWallet } = useWallet();

  // Memoize validation errors
  const validationErrors = useMemo(() => {
    const errors: string[] = [];

    if (!guestWallet) {
      errors.push('Wallet not connected');
    } else if (!isValidStellarAddress(guestWallet)) {
      errors.push('Invalid guest wallet address');
    }

    errors.push(...validateBookingData(bookingData));
    errors.push(...validateEventData(eventData));

    return errors;
  }, [bookingData, eventData, guestWallet]);

  // Calculate milestone amounts based on escrow type
  const calculateMilestoneAmounts = useCallback(
    (total: number): EscrowMilestone[] => {
      if (escrowType === 'single_release') {
        return [
          {
            description: 'Hotel booking payment - Released after successful stay completion',
            amount: toStroops(total),
            dueDate: bookingData.checkOutDate,
            status: 'pending',
            metadata: {
              type: 'check_out',
              percentage: 100,
            },
          },
        ];
      }

      // Multi-release milestones
      return [
        {
          description: 'Check-in milestone - Room access and initial payment',
          amount: toStroops(total * MILESTONE_SPLITS.checkIn),
          dueDate: bookingData.checkInDate,
          status: 'pending',
          metadata: {
            type: 'check_in',
            percentage: MILESTONE_SPLITS.checkIn * 100,
          },
        },
        {
          description: 'Check-out milestone - Successful stay completion',
          amount: toStroops(total * MILESTONE_SPLITS.checkOut),
          dueDate: bookingData.checkOutDate,
          status: 'pending',
          metadata: {
            type: 'check_out',
            percentage: MILESTONE_SPLITS.checkOut * 100,
          },
        },
      ];
    },
    [escrowType, bookingData.checkInDate, bookingData.checkOutDate]
  );

  // Generate milestones
  const milestones = useMemo(
    () => calculateMilestoneAmounts(bookingData.totalAmount),
    [bookingData.totalAmount, calculateMilestoneAmounts]
  );

  // Amount in stroops
  const amountInStroops = useMemo(
    () => toStroops(bookingData.totalAmount),
    [bookingData.totalAmount]
  );

  // Get USDC trustline
  const usdcTrustline = useMemo(() => {
    const usdc = trustlineOptions.find((t) => t.label === 'USDC');
    return {
      address: usdc?.value || process.env.NEXT_PUBLIC_USDC_ISSUER || '',
      decimals: STROOPS_MULTIPLIER,
    };
  }, []);

  // Build escrow form data
  const escrowFormData = useMemo((): EscrowFormData => {
    const platformWallet = process.env.NEXT_PUBLIC_PLATFORM_WALLET_ADDRESS || '';
    const disputeResolver = process.env.NEXT_PUBLIC_DISPUTE_RESOLVER_ADDRESS || platformWallet;

    return {
      title: `Hotel Booking - ${eventData.name}`,
      engagementId: bookingData.id,
      description: `Secure escrow payment for event booking at ${eventData.name}. Check-in: ${new Date(bookingData.checkInDate).toLocaleDateString()}, Check-out: ${new Date(bookingData.checkOutDate).toLocaleDateString()}`,
      amount: bookingData.totalAmount,
      platformFee: 2.5, // 2.5% platform fee
      roles: {
        approver: guestWallet || '', // Guest approves the release
        serviceProvider: eventData.walletAddress, // Hotel receives funds
        platformAddress: platformWallet, // TrueStub platform
        releaseSigner: platformWallet, // Platform controls release
        disputeResolver: disputeResolver, // Handles disputes
        receiver: eventData.walletAddress, // Hotel receives payment
      },
      trustline: usdcTrustline,
      milestones: milestones.map((m) => ({
        description: m.description,
        amount: m.amount,
      })),
      receiverMemo: bookingData.id.slice(0, 28), // Stellar memo limit
      metadata: {
        bookingId: bookingData.id,
        roomId: bookingData.roomId,
        eventId: bookingData.eventId,
        hotelName: eventData.name,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        guestEmail: bookingData.guestEmail,
        platform: PLATFORM_NAME,
        version: VERSION,
        roomType: bookingData.roomType,
        cancellationPolicy: bookingData.cancellationPolicy,
        milestones: milestones,
      },
    };
  }, [
    bookingData,
    eventData,
    guestWallet,
    usdcTrustline,
    milestones,
  ]);

  return {
    escrowFormData,
    milestones,
    totalAmount: bookingData.totalAmount,
    amountInStroops,
    isValid: validationErrors.length === 0,
    validationErrors,
    calculateMilestoneAmounts,
  };
}

/**
 * Hook for validating escrow form data specific to event bookings
 */
export function useEscrowValidation() {
  const validateEscrowData = useCallback((data: Partial<EscrowFormData>): { 
    isValid: boolean; 
    errors: string[] 
  } => {
    const errors: string[] = [];

    if (!data.amount || Number(data.amount) <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!data.roles?.approver) {
      errors.push('Approver address is required');
    }

    if (!data.roles?.serviceProvider) {
      errors.push('Service provider address is required');
    }

    if (!data.metadata?.bookingId) {
      errors.push('Booking ID is required in metadata');
    }

    if (!data.milestones || data.milestones.length === 0) {
      errors.push('At least one milestone is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, []);

  return { validateEscrowData };
}

export default useBookingEscrow;
