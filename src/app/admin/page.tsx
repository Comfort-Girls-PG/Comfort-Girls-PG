"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import AdminDashboard from "../../components/AdminDashboard";
import { Booking, Room, Visit } from "../../types";
import { apiClient } from "../../utils/apiClient";

export default function AdminPage() {
  const router = useRouter();
  const { currentUser, activeRooms, activeBookings, setActiveBookings, activeVisits, setActiveVisits } = useApp();

  useEffect(() => {
    if (!currentUser || currentUser.status !== "Admin") {
      router.push("/");
      return;
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.status !== "Admin") {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4 px-4">
        <div className="p-4 bg-amber-500/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-amber-600 text-xl">
          ⚠️
        </div>
        <h2 className="font-display font-black text-xl text-slate-900 ">
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

  const handleApproveVisit = (id: string, adminMessage: string) => {
    apiClient.put<Visit>(`/api/visits/${id}/status`, { status: "Approved", message: adminMessage })
      .then((updatedVisit) => {
        const updated = activeVisits.map((v) => {
          if (v.id === id) {
            return { ...v, ...updatedVisit };
          }
          return v;
        });
        setActiveVisits(updated);
        alert(`Visit request approved and notification sent.`);
      })
      .catch((err) => {
        alert("Failed to update visit status: " + err.message);
      });
  };

  return (
    <div className="min-h-screen bg-slate-50/10 ">
      <AdminDashboard
        rooms={activeRooms}
        visits={activeVisits}
        onApproveVisit={handleApproveVisit}
      />
    </div>
  );
}
