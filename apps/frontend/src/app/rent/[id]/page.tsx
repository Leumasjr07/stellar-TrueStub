"use client";

import {
  TicketListingDetail,
  EventHeader,
  EventSuggestionsList,
} from "@/components/events";
import { getEventById, getSuggestedEvents } from "@/lib/mockData/events";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const listing = getEventById(resolvedParams.id);
  const suggestions = getSuggestedEvents(listing.id);

  return (
    <div className="min-h-screen bg-white">
      <EventHeader />

      <div className="mx-auto flex max-w-[1180px] flex-col lg:flex-row">
        <EventSuggestionsList
          listings={suggestions}
          onSelect={(id) => router.push(`/rent/${id}`)}
        />
        <TicketListingDetail
          listing={listing}
          onBook={() => router.push(`/rent/${listing.id}/escrow/create`)}
        />
      </div>
    </div>
  );
}
