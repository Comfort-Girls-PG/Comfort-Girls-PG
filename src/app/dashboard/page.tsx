"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../../context/AppContext";
import UserDashboard from "../../components/UserDashboard";
import { UserSession } from "../../types";

export default function DashboardPage() {
 const router = useRouter();
 const { currentUser, setCurrentUser, activeRooms, activeBookings, logout, setIsAuthOpen } = useApp();

 useEffect(() => {
 if (!currentUser) {
 setIsAuthOpen(true);
 }
 }, [currentUser, setIsAuthOpen]);

 if (!currentUser) {
 return (
 <div className="max-w-md mx-auto py-24 text-center space-y-6 px-4">
 <div className="p-4 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-primary text-xl">
 🔒
 </div>
 <h2 className="font-display font-black text-xl text-slate-900 ">
 Secure Resident Console Locked
 </h2>
 <p className="text-xs text-slate-500 leading-relaxed">
 The dashboard is restricted to verified residents. Please log in or register to check complaints, digital keys, and payments.
 </p>
 <button
 onClick={() => setIsAuthOpen(true)}
 className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md"
 >
 Sign In Now
 </button>
 </div>
 );
 }

 // Find user's active booking
 const activeBooking = activeBookings.find(b => b.status === "Active" || b.status === "Approved") || activeBookings[0] || null;

 const handleLogout = () => {
 logout();
 router.push("/");
 };

 const handleGoHome = () => {
 router.push("/");
 };

 const handleUpdateUser = (updated: UserSession) => {
 setCurrentUser(updated);
 };

 return (
 <div className="min-h-screen bg-slate-50/20 ">
 <UserDashboard
 currentUser={currentUser}
 rooms={activeRooms}
 activeBookings={activeBookings}
 onLogout={handleLogout}
 onGoHome={handleGoHome}
 onUpdateUser={handleUpdateUser}
 />
 </div>
 );
}
