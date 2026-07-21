import React, { useState, useEffect } from "react";
import { UserSession, Room, Booking } from "../types";
import { User, Sparkles } from "lucide-react";
import { apiClient } from "../utils/apiClient";

interface UserDashboardProps {
 currentUser: UserSession;
 rooms: Room[];
 activeBookings: Booking[];
 onLogout: () => void;
 onGoHome: () => void;
 onUpdateUser?: (updated: UserSession) => void;
}

export default function UserDashboard({
 currentUser,
 rooms,
 activeBookings,
 onLogout,
 onGoHome,
 onUpdateUser,
}: UserDashboardProps) {
 const [activeTab, setActiveTab] = useState<"profile" | "visit">("profile");
 // Profile editing states
 const [editMode, setEditMode] = useState(false);
 const [editName, setEditName] = useState(currentUser.name || "");
 const [editPhone, setEditPhone] = useState(currentUser.phone || "");
 const [editCollege, setEditCollege] = useState(currentUser.college || "");
 const [editAvatar, setEditAvatar] = useState(currentUser.avatar || "");
 const [isSaving, setIsSaving] = useState(false);

 useEffect(() => {
 setEditName(currentUser.name || "");
 setEditPhone(currentUser.phone || "");
 setEditCollege(currentUser.college || "");
 setEditAvatar(currentUser.avatar || "");
 }, [currentUser]);

 const handleUpdateProfile = (e: React.FormEvent) => {
 e.preventDefault();
 if (!editName.trim()) {
 alert("Please specify a valid student name.");
 return;
 }
 setIsSaving(true);
 apiClient.put<{ success: boolean; data: UserSession }>("/api/auth/profile", {
 name: editName,
 phone: editPhone,
 college: editCollege,
 avatar: editAvatar
 })
 .then((res) => {
 setIsSaving(false);
 if (res && res.data) {
 if (onUpdateUser) {
 onUpdateUser(res.data);
 }
 setEditMode(false);
 alert("Your resident profile credentials updated successfully!");
 } else {
 alert("Received invalid reply from server.");
 }
 })
 .catch((err) => {
 setIsSaving(false);
 alert("Could not update profile information: " + err.message);
 });
 };

 const currentRoom = rooms.find(r => r.id === activeBookings[0]?.roomId) || rooms[0];

 return (
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 transition-all">
 
 {/* Upper resident greet bars */}
 <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-primary/5 via-secondary/5 to-transparent border border-slate-100 p-6 rounded-3xl mb-10 shadow-xs">
 <div className="flex items-center gap-4">
 <div className="relative">
 <img src={currentUser.avatar} className="w-14 h-14 rounded-full object-cover border-2 border-primary" referrerPolicy="no-referrer" />
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

 {/* Preset avatar selector */}
 <div className="space-y-3">
 <label className="text-[9px] text-slate-400 font-mono uppercase tracking-widest block font-bold">Digital Avatar / Profile Picture</label>
 
 <div className="flex items-center gap-4 p-3.5 bg-white border border-slate-200 rounded-2xl">
 <img 
 src={editAvatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"} 
 className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-inner" 
 referrerPolicy="no-referrer"
 />
 <div className="flex flex-col gap-1.5 text-left">
 <label className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-750 font-semibold rounded-xl text-[10px] cursor-pointer transition-colors border border-slate-200 w-fit">
 Choose Image File
 <input
 type="file"
 accept="image/*"
 className="hidden"
 onChange={(e) => {
 const file = e.target.files?.[0];
 if (file) {
 if (file.size > 2 * 1024 * 1024) {
 alert("Please select an image smaller than 2MB to ensure fast profile syncing.");
 return;
 }
 const reader = new FileReader();
 reader.onloadend = () => {
 setEditAvatar(reader.result as string);
 };
 reader.readAsDataURL(file);
 }
 }}
 />
 </label>
 <span className="text-[8px] text-slate-400 font-light font-sans">Supports PNG, JPG, GIF up to 2MB</span>
 </div>
 </div>

 <div className="space-y-1.5">
 <span className="text-[8px] text-slate-455 font-mono uppercase tracking-wider block font-bold">Or select a preset badge:</span>
 <div className="flex gap-2">
 {[
 "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
 "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
 "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
 "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150"
 ].map((url) => (
 <button
 key={url}
 type="button"
 onClick={() => setEditAvatar(url)}
 className={`relative rounded-full p-0.5 border-2 transition ${editAvatar === url ? "border-primary" : "border-transparent"}`}
 >
 <img src={url} className="w-8 h-8 rounded-full object-cover" />
 {editAvatar === url && (
 <div className="absolute -bottom-0.5 -right-0.5 bg-primary text-white rounded-full p-0.5 text-[6px]">✓</div>
 )}
 </button>
 ))}
 </div>
 </div>
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

 {activeBookings.length === 0 ? (
 <p className="text-xs text-slate-500 font-light italic p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
 No physical visits scheduled yet. Click "Schedule Free Visit" on the home page to request a tour.
 </p>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {activeBookings.map((visit: Booking) => {
    const roomInfo = rooms.find(r => r.id === visit.roomId);
    return (
  <div 
  key={visit.id} 
  className="p-5 rounded-2xl border border-slate-150 bg-slate-50/50 space-y-3 font-sans text-xs flex flex-col justify-between"
  >
  <div className="flex justify-between items-start">
  <div>
  <span className="text-[9px] font-mono text-slate-400 block">VISIT REQUEST REF: {visit.id}</span>
  <strong className="text-slate-800 block text-xs">{visit.scheduleVisitDate || "Pending"}</strong>
  <span className="text-[10px] text-slate-500 font-mono pt-0.5 block">Requested On: {visit.createdAt}</span>
  </div>
  <span className={`py-0.5 px-2.5 rounded font-mono text-[9px] font-bold uppercase ${
  visit.status === "Visit Scheduled"
  ? "bg-emerald-500/10 text-emerald-600 "
  : visit.status === "Rejected"
  ? "bg-rose-500/10 text-rose-500"
  : "bg-amber-500/10 text-amber-600 animate-pulse"
  }`}>
  {visit.status || "Pending Approval"}
  </span>
  </div>

  <div className="space-y-1 pb-1 text-slate-650 ">
  <p className="font-semibold text-slate-700 ">Requested Suite:</p>
  <p className="font-light italic">{roomInfo?.name || visit.roomId} ({visit.sharingType})</p>
  </div>
  </div>
  )})}
  </div>
 )}
 </div>
 )}
 </div>
 </div>

 </div>
 );
}
