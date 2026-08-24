"use client";

import React from "react";
import EventDetails from "@/components/ticket-events/payment/EventDetails";
import ReservationSummary from "@/components/ticket-events/payment/ReservationSummary";

const EventPage = () => {
  const eventData = {
    hotelName: "Shikara Hotel",
    description: "King bed stylish Apartment",
    details:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    goodToKnow:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    location: "329 Calle santos, paseo colón, San José",
    coordinates: [9.9281, -84.0907] as [number, number],
    rating: 5.0,
    beds: 2,
    baths: 1,
    price: 40.18,
    tax: 10.5,
    checkIn: new Date("2025-07-14"),
    checkOut: new Date("2025-08-02"),
    imageUrl: "/img/room2.png",
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="w-full px-4 md:px-10 py-8 mt-10">
        <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
          <div className="flex-grow">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <EventDetails
                hotelName={eventData.hotelName}
                description={eventData.description}
                details={eventData.details}
                goodToKnow={eventData.goodToKnow}
                location={eventData.location}
                coordinates={eventData.coordinates}
                rating={eventData.rating}
                beds={eventData.beds}
                baths={eventData.baths}
                imageUrl={eventData.imageUrl}
              />
            </div>
          </div>
          <div className="w-full md:w-[400px] shrink-0">
            <ReservationSummary
              hotelName={eventData.hotelName}
              description={eventData.description}
              price={eventData.price}
              tax={eventData.tax}
              checkIn={eventData.checkIn}
              checkOut={eventData.checkOut}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
