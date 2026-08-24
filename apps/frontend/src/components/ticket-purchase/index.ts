/**
 * Booking Components Exports
 * 
 * This module exports all booking-related components for event escrow integration.
 */

// Main Escrow Creation Form
export { EscrowCreationForm } from "./EscrowCreationForm";
export type { EscrowCreationFormProps } from "./EscrowCreationForm";

// Booking Escrow Wrapper (full integration)
export { TicketEscrowWrapper } from "./TicketEscrowWrapper";
export type { TicketEscrowWrapperProps } from "./TicketEscrowWrapper";

// Escrow Confirmation
export { EscrowConfirmation } from "./EscrowConfirmation";

// Re-export types from interfaces
export type {
  BookingData,
  EventData,
  RoomData,
  EscrowType,
  EscrowResponse,
  EscrowMilestone,
  EscrowMetadata,
  EscrowConfirmationProps,
} from "@/interfaces/booking-escrow.interface";
