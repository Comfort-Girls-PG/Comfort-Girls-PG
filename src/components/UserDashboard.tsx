import React, { useState, useEffect } from "react";
import { UserSession, Room, Booking, Visit } from "../types";
import { User, Sparkles } from "lucide-react";
import { apiClient } from "../utils/apiClient";
import { useToast } from "../context/ToastContext";

interface UserDashboardProps {
 currentUser: UserSession;
 rooms: Room[];
 activeBookings: Booking[];
 activeVisits: Visit[];
 onLogout: () => void;
 onGoHome: () => void;
 onUpdateUser?: (updated: UserSession) => void;
}

export default function UserDashboard({
 currentUser,
 rooms,
 activeBookings,
 activeVisits,
 onLogout,
 onGoHome,
 onUpdateUser,
}: UserDashboardProps) {
 const toast = useToast();
 const [activeTab, setActiveTab] = useState<"profile" | "visit">("profile");
 // Profile editing states
 const [editMode, setEditMode] = useState(false);
 const [editName, setEditName] = useState(currentUser.name || "");
 const [editPhone, setEditPhone] = useState(currentUser.phone || "");
 const [editCollege, setEditCollege] = useState(currentUser.college || "");
 const [isSaving, setIsSaving] = useState(false);

 useEffect(() => {
 setEditName(currentUser.name || "");
 setEditPhone(currentUser.phone || "");
 setEditCollege(currentUser.college || "");
 }, [currentUser]);

 const handleUpdateProfile = (e: React.FormEvent) => {
 e.preventDefault();
 if (!editName.trim()) {
 toast.error("Please specify a valid student name.");
 return;
 }
 setIsSaving(true);
 apiClient.put<{ success: boolean; data: UserSession }>("/api/auth/profile", {
  name: editName,
  phone: editPhone,
  college: editCollege
  })
 .then((res) => {
 setIsSaving(false);
 if (res && res.data) {
 if (onUpdateUser) {
 onUpdateUser(res.data);
 }
 setEditMode(false);
 toast.success("Your resident profile credentials updated successfully!");
 } else {
 toast.error("Received invalid reply from server.");
 }
 })
 .catch((err) => {
 setIsSaving(false);
 toast.error("Could not update profile information: " + err.message);
 });
 };

 const currentRoom = rooms.find(r => r.id === activeBookings[0]?.roomId) || rooms[0];

 return (
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 transition-all">
 
 {/* Upper resident greet bars */}
 <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-primary/5 via-secondary/5 to-transparent border border-slate-100 p-6 rounded-3xl mb-10 shadow-xs">
 <div className="flex items-center gap-4">
 <div className="relative">
 <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border-2 border-primary">
 {currentUser.name.charAt(0).toUpperCase()}
 </div>
 <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white " />
 </div>
 <div>
 <h1 className="font-display font-bold text-lg md:text-xl text-slate-850 leading-tight">
 Hello, {currentUser.name}!
 </h1>
 <p className="text-xs text-slate-500 pt-0.5">
 Active Suite occupant at <strong className="text-slate-700 ">Comfort Girls PG - Room 103</strong>
 </p>
 </div>
 </div>

 <div className="flex items-center gap-3">
 <button
 onClick={onGoHome}
 className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
 >
 Explore Public Hub
 </button>
 <button
 onClick={onLogout}
 className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
 >
 Sign Out
 </button>
 </div>
 </div>

 {/* Sidebar layout container */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
 {/* LEFT COLUMN: SIDEBAR */}
 <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/50 p-5 shadow-md flex flex-row lg:flex-col gap-2 w-full select-none">
 <button
 onClick={() => {
 setActiveTab("profile");
 setEditMode(false);
 }}
 className={`flex-1 lg:flex-initial flex items-center justify-center lg:justify-start gap-2.5 px-4.5 py-3.5 text-xs font-semibold rounded-2xl transition-all cursor-pointer ${
 activeTab === "profile"
 ? "bg-primary text-white shadow-md shadow-primary/20"
 : "text-slate-650 hover:bg-slate-50 "
 }`}
 >
 <User className="w-4 h-4" />
 <span>My Profile</span>
 </button>
 <button
 onClick={() => setActiveTab("visit")}
 className={`flex-1 lg:flex-initial flex items-center justify-center lg:justify-start gap-2.5 px-4.5 py-3.5 text-xs font-semibold rounded-2xl transition-all cursor-pointer ${
 activeTab === "visit"
 ? "bg-primary text-white shadow-md shadow-primary/20"
 : "text-slate-650 hover:bg-slate-50 "
 }`}
 >
 <Sparkles className="w-4 h-4" />
 <span>Physical Visit</span>
 </button>
 </div>

 {/* RIGHT COLUMN: MAIN CONTENT WINDOW */}
 <div className="lg:col-span-9 w-full min-h-[500px]">
 {activeTab === "profile" ? (
 <div className="bg-white rounded-3xl border border-slate-200/50 p-6 md:p-8 shadow-md text-left space-y-8">
 <div className="space-y-1">
 <h3 className="font-display font-bold text-lg text-slate-850 flex items-center gap-2">
 <User className="w-5 h-5 text-primary" />
 My Resident Profile Desk
 </h3>
 <p className="text-xs text-slate-500 font-light font-sans">View and manage your registered student details.</p>
 </div>

 <div className="max-w-xl mx-auto w-full">
 <div className="space-y-6 text-xs">
 {!editMode ? (
 <>
 {/* Clean, simple profile metadata fields */}
 <div className="space-y-5 p-6 bg-slate-50 border border-slate-100 rounded-3xl text-left">
 <span className="text-[10px] text-slate-500 tracking-wider block uppercase font-mono font-bold">Resident Details</span>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-sans text-slate-650 ">
 <div>
 <span className="block text-[10px] text-slate-400 font-mono uppercase font-bold">Name</span>
 <strong className="text-slate-850 text-sm">{currentUser.name}</strong>
 </div>
 <div>
 <span className="block text-[10px] text-slate-400 font-mono uppercase font-bold">Email Address</span>
 <strong className="text-slate-850 text-sm">{currentUser.email}</strong>
 </div>
 <div>
 <span className="block text-[10px] text-slate-400 font-mono uppercase font-bold">Contact No</span>
 <strong className="text-slate-855 text-sm">{currentUser.phone}</strong>
 </div>
 <div>
 <span className="block text-[10px] text-slate-400 font-mono uppercase font-bold">College / University</span>
 <strong className="text-slate-850 text-sm">{currentUser.college}</strong>
 </div>
 </div>
 </div>

 <button
 onClick={() => setEditMode(true)}
 className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl text-xs shadow-md shadow-primary/10 transition-all cursor-pointer"
 >
 <User className="w-4 h-4" />
 Edit Profile Details
 </button>
 </>
 ) : (
 <form onSubmit={handleUpdateProfile} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 ">
 <p className="font-bold text-slate-855 text-xs uppercase tracking-wider font-mono">Update Resident Credentials</p>
 
 <div className="space-y-1">
 <label className="text-[9px] text-slate-400 font-mono uppercase tracking-widest block font-bold">Full Student Name</label>
 <input
 type="text"
 value={editName}
 onChange={(e) => setEditName(e.target.value)}
 className="w-full text-xs font-semibold p-2 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-primary text-slate-800 "
 required
 />
 </div>

 <div className="space-y-1">
 <label className="text-[9px] text-slate-400 font-mono uppercase tracking-widest block font-bold">Contact Phone Number</label>
 <input
 type="tel"
 value={editPhone}
 onChange={(e) => setEditPhone(e.target.value)}
 className="w-full text-xs font-semibold p-2 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-primary text-slate-800 "
 />
 </div>

 <div className="space-y-1">
 <label className="text-[9px] text-slate-400 font-mono uppercase tracking-widest block font-bold">Enrolled College / University</label>
 <input
 type="text"
 value={editCollege}
 onChange={(e) => setEditCollege(e.target.value)}
 className="w-full text-xs font-semibold p-2 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-primary text-slate-800 "
 />
 </div>

 <div className="flex gap-2 pt-2">
 <button
 type="button"
 onClick={() => setEditMode(false)}
 className="flex-1 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-center text-[11px] cursor-pointer"
 >
 Cancel
 </button>
 <button
 type="submit"
 disabled={isSaving}
 className="flex-1 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl font-bold text-center text-[11px] cursor-pointer disabled:opacity-50"
 >
 {isSaving ? "Saving..." : "Save Profile"}
 </button>
 </div>
 </form>
 )}
 </div>
 </div>
 </div>
 ) : (
 <div className="bg-white rounded-3xl border border-slate-200/50 p-6 md:p-8 shadow-md text-left space-y-8">
 <div className="space-y-1">
 <h3 className="font-display font-bold text-lg text-slate-850 flex items-center gap-2">
 <Sparkles className="w-5 h-5 text-primary" />
 My Physical Visit Requests
 </h3>
 <p className="text-xs text-slate-500 font-light font-sans">
 Track the status of your physical site visits and responses from PG wardens.
 </p>
 </div>

 {activeVisits.length === 0 ? (
 <p className="text-xs text-slate-500 font-light italic p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
 No physical visits scheduled yet. Click "Schedule Free Visit" on the home page to request a tour.
 </p>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {activeVisits.map((visit: Visit) => {
 return (
 <div 
 key={visit.id} 
 className="p-5 rounded-2xl border border-slate-150 bg-slate-50/50 space-y-3 font-sans text-xs flex flex-col justify-between"
 >
 <div className="flex justify-between items-start">
 <div>
 <span className="text-[9px] font-mono text-slate-400 block">VISIT REQUEST REF: {visit.id}</span>
 <strong className="text-slate-800 block text-xs">{visit.date} {visit.time}</strong>
 <span className="text-[10px] text-slate-500 font-mono pt-0.5 block">Requested On: {visit.createdAt || visit.date}</span>
 </div>
 <span className={`py-0.5 px-2.5 rounded font-mono text-[9px] font-bold uppercase ${
 visit.status === "Approved"
 ? "bg-emerald-500/10 text-emerald-600 "
 : visit.status === "Rejected"
 ? "bg-rose-500/10 text-rose-500"
 : "bg-amber-500/10 text-amber-600 animate-pulse"
 }`}>
 {visit.status || "Upcoming"}
 </span>
 </div>

 <div className="space-y-1 pb-1 text-slate-650 ">
 <p className="font-semibold text-slate-700 ">Reason:</p>
 <p className="font-light italic">{visit.reason}</p>
 </div>
 
 {visit.adminMessage && (
 <div className="mt-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
 <p className="text-[10px] font-bold text-amber-800 mb-1">Message from Warden:</p>
 <p className="text-xs text-amber-900">{visit.adminMessage}</p>
 </div>
 )}
 </div>
 )
 })}
 </div>
 )}
 </div>
 )}
 </div>
 </div>

 </div>
 );
}
