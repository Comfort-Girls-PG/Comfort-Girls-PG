"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "../../context/AppContext";
import BookingFlow from "../../components/BookingFlow";
import { Booking, UserSession } from "../../types";

function BookingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeRooms, currentUser, setCurrentUser, activeBookings, setActiveBookings, setActiveRooms, setIsAuthOpen } = useApp();

  const roomId = searchParams.get("roomId");
  const directBook = searchParams.get("direct") !== "false"; // default is true

  const room = activeRooms.find((r) => r.id === roomId);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-6 px-4">
        <div className="p-4 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-primary">
          🔑
        </div>
        <h2 className="font-display font-black text-xl text-slate-900 dark:text-white">
          Authentication Clearance Required
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Please login or register for a resident account to initiate the security clearance and onboarding document workflow.
        </p>
        <button
          onClick={() => setIsAuthOpen(true)}
          className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md"
        >
          Sign In / Register Now
        </button>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4 px-4">
        <h2 className="font-display font-black text-xl text-slate-900 dark:text-white">
          Please Select a Suite First
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          To initiate an onboarding flow, please select one of our premium single, double, or triple sharing suites.
        </p>
        <button
          onClick={() => router.push("/rooms")}
          className="w-full py-3 bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
        >
          Browse Suites Catalog
        </button>
      </div>
    );
  }

  const handleBookingComplete = (newBooking: Booking) => {
    // Add to bookings index
    setActiveBookings([newBooking, ...activeBookings]);
    
    // Update local user context status
    if (currentUser) {
      const updatedUser: UserSession = {
        ...currentUser,
        status: "Resident",
        bookedRoomId: newBooking.roomId,
        documentVerified: true
      };
      setCurrentUser(updatedUser);
    }

    // Update room vacant units
    const updatedRooms = activeRooms.map((r) => {
      if (r.id === newBooking.roomId) {
        return {
          ...r,
          availability: Math.max(0, r.availability - 1),
          roommates: [
            ...r.roommates,
            {
              name: currentUser.name,
              avatar: currentUser.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
              college: currentUser.college || "Technology & Design Institute",
              hobbies: ["Photography", "Academics", "Music"]
            }
          ]
        };
      }
      return r;
    });
    setActiveRooms(updatedRooms);

    // Swap to user dashboard automatically
    router.push("/dashboard");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCancel = () => {
    router.push(`/rooms/${room.id}`);
  };

  return (
    <div className="min-h-screen py-10 bg-slate-50/30 dark:bg-slate-950/20">
      <BookingFlow
        room={room}
        directBook={directBook}
        currentUser={currentUser}
        onBookingComplete={handleBookingComplete}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default function BookingsPage() {
  return (
    <Suspense fallback={
      <div className="py-24 text-center text-slate-500 font-sans text-xs">
        Loading biometric clearance onboarding systems...
      </div>
    }>
      <BookingsContent />
    </Suspense>
  );
}
