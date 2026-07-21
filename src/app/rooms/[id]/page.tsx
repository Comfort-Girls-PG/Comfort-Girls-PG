"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "../../../context/AppContext";
import { MOCK_COLLEGES } from "../../../lib/staticData";
import RoomDetailsPage from "../../../components/RoomDetailsPage";

export default function RoomDetailsPageWrapper() {
 const router = useRouter();
 const params = useParams();
 const roomId = params.id as string;
 const { activeRooms, currentUser, setIsAuthOpen } = useApp();

 const room = activeRooms.find((r) => r.id === roomId);

 if (!room) {
 return (
 <div className="max-w-4xl mx-auto py-24 text-center space-y-4">
 <h2 className="font-display font-black text-2xl text-slate-900 ">
 Suite Not Found
 </h2>
 <p className="text-sm text-slate-500">
 The requested premium accommodation layout ID does not exist or has been modified.
 </p>
 <button
 onClick={() => router.push("/rooms")}
 className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl text-xs cursor-pointer"
 >
 Return to Suites List
 </button>
 </div>
 );
 }

 const handleBack = () => {
 router.push("/rooms");
 };

 const handleScheduleVisit = (r: typeof room) => {
 router.push(`/bookings?roomId=${r.id}`);
 };

 return (
 <RoomDetailsPage
 room={room}
 colleges={MOCK_COLLEGES}
 currentUser={currentUser}
 onBack={handleBack}
 onScheduleVisit={handleScheduleVisit}
 onOpenAuth={() => setIsAuthOpen(true)}
 />
 );
}
