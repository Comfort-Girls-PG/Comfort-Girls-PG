"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import AdminDashboard from "../../components/AdminDashboard";
import { Booking, Room } from "../../types";
import { apiClient } from "../../utils/apiClient";

export default function AdminPage() {
  const router = useRouter();
  const { currentUser, activeRooms, activeBookings, setActiveBookings } = useApp();

  const [visits, setVisits] = useState<any[]>([]);

  useEffect(() => {
    if (!currentUser || currentUser.status !== "Admin") {
      router.push("/");
      return;
    }

    apiClient.get<any[]>("/api/visits")
      .then((data) => {
        if (data) {
          setVisits(data);
        }
      })
      .catch((err) => console.warn("Failed to load visits logs:", err));
  }, [currentUser, router]);

  if (!currentUser || currentUser.status !== "Admin") {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4 px-4">
        <div className="p-4 bg-amber-500/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-amber-600 text-xl">
          ⚠️
        </div>
        <h2 className="font-display font-black text-xl text-slate-900 dark:text-white">
          Warden Access Restrained
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Access to this area is strictly reserved for authenticated Wardens and platform Administrators.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-5 py-2.5 bg-slate-950 text-white font-semibold rounded-xl text-xs cursor-pointer"
        >
          Return to Portal Home
        </button>
      </div>
    );
  }

  const handleApproveBooking = (id: string) => {
    apiClient.put<Booking>(`/api/bookings/${id}/status`, { status: "Approved" })
      .then((updatedBooking) => {
        const updated = activeBookings.map((b) => {
          if (b.id === id) {
            return { ...b, ...updatedBooking };
          }
          return b;
        });
        setActiveBookings(updated);
        alert(`Booking reference ${id} marked APPROVED. Digital keys generated.`);
      })
      .catch((err) => {
        alert("Failed to approve booking: " + err.message);
      });
  };

  const handleApproveVisit = (id: string, adminMessage: string) => {
    apiClient.put<any>(`/api/visits/${id}`, { status: "Approved", adminMessage })
      .then((updatedVisit) => {
        const updated = visits.map((v) => {
          if (v.id === id) {
            return { ...v, ...updatedVisit };
          }
          return v;
        });
        setVisits(updated);
        alert(`Physical visit request approved and notification sent.`);
      })
      .catch((err) => {
        alert("Failed to update visit status: " + err.message);
      });
  };

  return (
    <div className="min-h-screen bg-slate-50/10 dark:bg-slate-955/10">
      <AdminDashboard
        rooms={activeRooms}
        bookings={activeBookings}
        visits={visits}
        onApproveBooking={handleApproveBooking}
        onApproveVisit={handleApproveVisit}
      />
    </div>
  );
}
