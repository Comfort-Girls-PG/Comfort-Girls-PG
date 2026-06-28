import React, { useState, useEffect } from "react";
import { UserSession, Room, Booking, Complaint, VisitorPass, LeaveRequest } from "../types";
import { WEEKLY_FOOD_MENU } from "../lib/staticData";
import { motion, AnimatePresence } from "motion/react";
import { User, CreditCard, Clock, MapPin, Wrench, ShieldAlert, Sparkles, Bell, FileText, CheckCircle2, ChevronRight, Play, Calendar, Coffee, Plus, Info, Trash2 } from "lucide-react";
import { apiClient } from "../utils/apiClient";

interface UserDashboardProps {
  currentUser: UserSession;
  rooms: Room[];
  activeBooking: Booking | null;
  onLogout: () => void;
  onGoHome: () => void;
  onUpdateUser?: (updated: UserSession) => void;
}

type ResidentTab = "profile" | "room" | "payments" | "messes" | "complaints" | "visitors" | "leaves";

export default function UserDashboard({
  currentUser,
  rooms,
  activeBooking,
  onLogout,
  onGoHome,
  onUpdateUser,
}: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<ResidentTab>("profile");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>(WEEKLY_FOOD_MENU);

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

  // Load live support items on workspace mount
  useEffect(() => {
    // 1. Load active complaints
    apiClient.get<Complaint[]>("/api/complaints")
      .then((data) => {
        if (data && data.length) {
          setComplaints(data);
        }
      })
      .catch((err) => console.warn("Could not retrieve complaints database:", err));

    // 2. Load gourmet list
    apiClient.get<any[]>("/api/food-menu")
      .then((data) => {
        if (data && data.length) {
          setMenuItems(data);
        }
      })
      .catch((err) => console.warn("Could not retrieve food directory:", err));
  }, [activeTab]);

  const [newCompType, setNewCompType] = useState<any>("WiFi");
  const [newCompSub, setNewCompSub] = useState("");
  const [newCompDet, setNewCompDet] = useState("");
  const [newCompUrg, setNewCompUrg] = useState<"Medium" | "High">("Medium");

  // Mock leave state
  const [leaves, setLeaves] = useState<LeaveRequest[]>([
    { id: "LV-11", startDate: "2026-06-25", endDate: "2026-06-28", reason: "Savitri Puja celebration with family at Nagpur.", parentApprovalStatus: "Approved", status: "Approved" }
  ]);
  const [leaveStart, setLeaveStart] = useState("");
  const [leaveEnd, setLeaveEnd] = useState("");
  const [leaveReason, setLeaveReason] = useState("");

  // Mock visitor passes
  const [passes, setPasses] = useState<VisitorPass[]>([
    { id: "PAS-99", visitorName: "Sanjay Ranade", relation: "Father", date: "2026-06-20", timeIn: "10:00 AM", timeOut: "04:00 PM", purpose: "Deliver seasonal mangoes and help clean balcony lockers.", status: "Active", tokenCode: "7721-PAS" }
  ]);
  const [passName, setPassName] = useState("");
  const [passRel, setPassRel] = useState("");
  const [passDate, setPassDate] = useState("");
  const [passIn, setPassIn] = useState("11:00 AM");
  const [passOut, setPassOut] = useState("05:00 PM");
  const [passPurp, setPassPurp] = useState("");

  const currentRoom = rooms.find(r => r.id === activeBooking?.roomId) || rooms[0];

  const handleRaiseComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompSub || !newCompDet) {
      alert("Please key in the subject and detailed error breakdown.");
      return;
    }

    apiClient.post<Complaint>("/api/complaints", {
      type: newCompType,
      subject: newCompSub,
      details: newCompDet,
      urgency: newCompUrg
    })
    .then((ticket) => {
      setComplaints([ticket, ...complaints]);
      setNewCompSub("");
      setNewCompDet("");
      alert("Support ticket logged in server successfully! Technical warden will address this within 4 hours.");
    })
    .catch((err) => {
      alert("Ticket could not be uploaded: " + err.message);
    });
  };

  const handleRaiseLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveStart || !leaveEnd || !leaveReason) {
      alert("All leave parameters are mandatory.");
      return;
    }
    const lv: LeaveRequest = {
      id: "LV-" + Math.floor(10 + Math.random() * 90),
      startDate: leaveStart,
      endDate: leaveEnd,
      reason: leaveReason,
      parentApprovalStatus: "Pending",
      status: "Pending"
    };
    setLeaves([lv, ...leaves]);
    setLeaveStart("");
    setLeaveEnd("");
    setLeaveReason("");
    alert("Hometown leave request completed! SMS auto-pushed to your parent/guardian for simple click approval.");
  };

  const handleRaisePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passName || !passRel || !passDate) {
      alert("Visitor details are mandatory.");
      return;
    }
    const p: VisitorPass = {
      id: "PAS-" + Math.floor(10 + Math.random() * 90),
      visitorName: passName,
      relation: passRel,
      date: passDate,
      timeIn: passIn,
      timeOut: passOut,
      purpose: passPurp,
      status: "Pending",
      tokenCode: Math.floor(1000 + Math.random() * 9000) + "-PAS"
    };
    setPasses([p, ...passes]);
    setPassName("");
    setPassRel("");
    setPassDate("");
    setPassPurp("");
    alert("Visitor Pass token initiated. Share code/pass with visitor to scan at biometric portal gates.");
  };

  // Sidebar link details
  const links = [
    { label: "My Digital ID & Profile", tab: "profile" as const, icon: User },
    { label: "Allocated Suite Details", tab: "room" as const, icon: Info },
    { label: "Rent & Billing invoices", tab: "payments" as const, icon: CreditCard },
    { label: "Weekly Gourmet Mess", tab: "messes" as const, icon: Coffee },
    { label: "Maintenance Tickets", tab: "complaints" as const, icon: Wrench },
    { label: "Guardian Gate Passes", tab: "visitors" as const, icon: Calendar },
    { label: "Outstation Leaves", tab: "leaves" as const, icon: Clock },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 transition-all">
      
      {/* Upper resident greet bars */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-primary/5 via-secondary/5 to-transparent border border-slate-100 dark:border-slate-800 p-6 rounded-3xl mb-10 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={currentUser.avatar} className="w-14 h-14 rounded-full object-cover border-2 border-primary" referrerPolicy="no-referrer" />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg md:text-xl text-slate-850 dark:text-white leading-tight">
              Hello, {currentUser.name}!
            </h1>
            <p className="text-xs text-slate-500 pt-0.5">
              Active Suite occupant at <strong className="text-slate-700 dark:text-slate-300">Comfort Girls PG - Room 103</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onGoHome}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            Explore Public Hub
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:text-red-400 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Sidebar control panel (3 Cols) */}
        <div className="lg:col-span-3 space-y-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
          {links.map((link) => {
            const Icon = link.icon;
            const isSel = activeTab === link.tab;
            return (
              <button
                key={link.tab}
                onClick={() => setActiveTab(link.tab)}
                className={`flex items-center gap-3.5 w-full text-left px-4 py-3 rounded-xl transition-all font-display text-xs font-semibold cursor-pointer ${
                  isSel
                    ? "bg-primary text-white shadow-md shadow-primary/15"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-850 dark:hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {link.label}
              </button>
            );
          })}
        </div>

        {/* Right Side: Tab display panel (9 Cols) */}
        <div className="lg:col-span-9 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 p-6 md:p-8 min-h-[500px] shadow-md">
          
          <AnimatePresence mode="wait">
            
            {/* View 1: Student Digital ID Card & Profile */}
            {activeTab === "profile" && (
              <motion.div
                key="tab-profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg text-slate-850 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                    My Resident Profile Desk
                  </h3>
                  <p className="text-xs text-slate-500 font-light font-sans">View your verified enrollment credentials and digital badge keys.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  
                  {/* BEAUTIFUL 3D DIGITAL RESIDENT ID CARD */}
                  <div className="relative w-full max-w-[340px] h-[480px] rounded-3xl bg-gradient-to-tr from-slate-950 via-slate-900 to-primary/80 p-5.5 text-white flex flex-col justify-between shadow-2xl border border-white/15 overflow-hidden group mx-auto">
                    {/* Glowing effect inside ID card */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary/35 rounded-full blur-2xl group-hover:bg-secondary/45 transition-colors" />

                    {/* ID Top Brand Header */}
                    <div className="flex justify-between items-start border-b border-white/10 pb-4">
                      <div>
                        <span className="text-[12px] font-display font-bold text-white tracking-wide block">Comfort Co-Living</span>
                        <span className="text-[8px] font-mono tracking-widest text-slate-400 uppercase font-bold">Resident ID badge</span>
                      </div>
                      <span className="py-0.5 px-2.5 rounded-md text-[9px] font-bold font-mono bg-emerald-500 text-white animate-pulse">
                        Verified
                      </span>
                    </div>

                    {/* Resident Card Details Portrait Area */}
                    <div className="flex flex-col items-center justify-center text-center space-y-2 py-4">
                      <img
                        src={currentUser.avatar}
                        className="w-24 h-24 rounded-full object-cover border-3 border-primary shadow-lg"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-0.5">
                        <h4 className="font-display font-bold text-base tracking-wide">{currentUser.name}</h4>
                        <p className="text-[11px] font-mono text-primary-light font-bold">Suite #{currentRoom.id.toUpperCase()}</p>
                      </div>
                    </div>

                    {/* Meta ID statistics info */}
                    <div className="grid grid-cols-2 gap-x-2 gap-y-3 p-3.5 rounded-2xl bg-white/5 border border-white/5 text-[9px] font-mono mb-4 text-slate-300">
                      <div>
                        <span className="text-slate-450 block text-[7px] uppercase font-bold tracking-wider">Institution</span>
                        <span className="font-sans font-medium truncate max-w-[120px] block">{currentUser.college}</span>
                      </div>
                      <div>
                        <span className="text-slate-450 block text-[7px] uppercase font-bold tracking-wider">Contact No</span>
                        <span>{currentUser.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-450 block text-[7px] uppercase font-bold tracking-wider">Join Date</span>
                        <span>Jun 15, 2026</span>
                      </div>
                      <div>
                        <span className="text-slate-450 block text-[7px] uppercase font-bold tracking-wider">Safety Role</span>
                        <span className="text-emerald-400">Regular Resident</span>
                      </div>
                    </div>

                    {/* ID Footer Barcode area */}
                    <div className="flex justify-between items-center border-t border-white/10 pt-4">
                      <div className="space-y-0.5">
                        <span className="text-[8px] text-slate-400 block font-mono">ISSUED BY WARDEN</span>
                        <span className="text-[9px] font-bold text-slate-200">Mrs. Savita Deshpande</span>
                      </div>
                      {/* Barcode SVG Mockup */}
                      <svg className="w-20 h-6 shrink-0 opacity-80" viewBox="0 0 100 24">
                        <rect width="2" height="24" fill="white" />
                        <rect x="5" width="4" height="24" fill="white" />
                        <rect x="11" width="1" height="24" fill="white" />
                        <rect x="15" width="2" height="24" fill="white" />
                        <rect x="20" width="3" height="24" fill="white" />
                        <rect x="25" width="1" height="24" fill="white" />
                        <rect x="30" width="5" height="24" fill="white" />
                        <rect x="38" width="2" height="24" fill="white" />
                        <rect x="42" width="1" height="24" fill="white" />
                        <rect x="45" width="4" height="24" fill="white" />
                        <rect x="52" width="2" height="24" fill="white" />
                        <rect x="58" width="1" height="24" fill="white" />
                        <rect x="62" width="3" height="24" fill="white" />
                        <rect x="68" width="5" height="24" fill="white" />
                        <rect x="75" width="2" height="24" fill="white" />
                        <rect x="80" width="4" height="24" fill="white" />
                        <rect x="86" width="1" height="24" fill="white" />
                        <rect x="90" width="3" height="24" fill="white" />
                      </svg>
                    </div>
                  </div>

                  {/* Standard details form overview or collapsible Edit Profile Form */}
                  <div className="space-y-4 text-xs">
                    {!editMode ? (
                      <>
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/50 border border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] text-slate-500 tracking-wider block uppercase mb-1">Onboarding Identity documentation</span>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">Aadhaar Card: Verified on cloud database ✓</p>
                          <p className="text-slate-550 pt-1 font-light leading-relaxed">Your Aadhaar verification audit completed on Jun 15, 2026. This qualifies you for instant digital leave approvals.</p>
                        </div>

                        <div className="space-y-2 pt-2">
                          <p className="font-bold text-slate-800 dark:text-slate-300">Permanent Registration Parameters</p>
                          <div className="grid grid-cols-2 gap-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                            <div>
                              <span>Bed Allocated:</span>
                              <p className="font-sans font-semibold text-slate-850 dark:text-white">Bed #103-B (Duo)</p>
                            </div>
                            <div>
                              <span>Lock Key Code:</span>
                              <p className="font-sans font-semibold text-slate-850 dark:text-white">7702 (Biometric backup)</p>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setEditMode(true)}
                          className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary/95 text-white font-semibold rounded-xl text-xs shadow-md shadow-primary/10 transition-all cursor-pointer"
                        >
                          <User className="w-4 h-4" />
                          Edit Profile Details
                        </button>
                      </>
                    ) : (
                      <form onSubmit={handleUpdateProfile} className="space-y-4 bg-slate-50 dark:bg-slate-850/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <p className="font-bold text-slate-855 dark:text-white text-xs uppercase tracking-wider font-mono">Update Resident Credentials</p>
                        
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 font-mono uppercase tracking-widest block font-bold">Full Student Name</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full text-xs font-semibold p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl outline-hidden focus:border-primary text-slate-800 dark:text-white"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 font-mono uppercase tracking-widest block font-bold">Contact Phone Number</label>
                          <input
                            type="tel"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            className="w-full text-xs font-semibold p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl outline-hidden focus:border-primary text-slate-800 dark:text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-400 font-mono uppercase tracking-widest block font-bold">Enrolled College / University</label>
                          <input
                            type="text"
                            value={editCollege}
                            onChange={(e) => setEditCollege(e.target.value)}
                            className="w-full text-xs font-semibold p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl outline-hidden focus:border-primary text-slate-800 dark:text-white"
                          />
                        </div>

                        {/* Preset avatar selector */}
                        <div className="space-y-2">
                          <label className="text-[9px] text-slate-400 font-mono uppercase tracking-widest block font-bold">Select Digital Avatar Badge</label>
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

                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setEditMode(false)}
                            className="flex-1 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-center text-[11px] cursor-pointer"
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
              </motion.div>
            )}

            {/* View 2: Allocated Suite details */}
            {activeTab === "room" && (
              <motion.div
                key="tab-room"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg text-slate-850 dark:text-white">Allocated living space details</h3>
                  <p className="text-xs text-slate-500 font-light font-sans">Check your active bedding allocation and roommate indices.</p>
                </div>

                <div className="p-5.5 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800 flex flex-col md:flex-row gap-5">
                  <img src={currentRoom.images[0]} className="w-full md:w-44 h-32 rounded-2xl object-cover shrink-0" />
                  <div className="space-y-2">
                    <span className="py-1 px-2.5 rounded-md bg-primary/10 text-primary dark:text-primary-light text-[9px] font-mono font-bold uppercase">
                      {currentRoom.type}
                    </span>
                    <h4 className="font-display font-semibold text-base text-slate-850 dark:text-white">{currentRoom.name}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-light leading-relaxed">{currentRoom.description}</p>
                  </div>
                </div>

                {/* Occupants cards listing */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-755 dark:text-slate-350">Active roommates inside room 103</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentRoom.roommates.map((mate, i) => (
                      <div key={i} className="flex gap-3 p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-150/80 dark:border-slate-850">
                        <img src={mate.avatar} className="w-10 h-10 rounded-full object-cover border-2 border-primary-light" />
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-slate-805 dark:text-white">{mate.name}</p>
                          <p className="text-[10px] text-slate-500 leading-none">{mate.college}</p>
                          <div className="flex gap-1 pt-1">
                            {mate.hobbies.slice(0, 2).map((hb, idx) => (
                              <span key={idx} className="text-[8px] font-mono bg-slate-100 dark:bg-slate-800 p-1 px-1.5 rounded text-slate-500">
                                {hb}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* View 3: Rent Billing invoices */}
            {activeTab === "payments" && (
              <motion.div
                key="tab-payments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg text-slate-850 dark:text-white">Rent invoices & tax desk</h3>
                  <p className="text-xs text-slate-500 font-light font-sans">Pay monthly statements and download certificates.</p>
                </div>

                {/* Rent status banner cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[9px] font-mono tracking-widest uppercase block text-slate-500 font-bold">Outstanding dues</span>
                    <h4 className="text-xl font-display font-bold text-emerald-600 dark:text-emerald-400">₹0.00</h4>
                    <span className="text-[10px] text-emerald-600">Paid up to Jul 15, 2026 ✓</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800">
                    <span className="text-[9px] font-mono tracking-widest uppercase block text-slate-500 font-bold">Security deposit escrow</span>
                    <h4 className="text-xl font-display font-bold text-slate-800 dark:text-white">₹30,000</h4>
                    <span className="text-[10px] text-slate-500 font-light">Withheld in secure bank</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800">
                    <span className="text-[9px] font-mono tracking-widest uppercase block text-slate-500 font-bold">Billing cycle frequency</span>
                    <h4 className="text-xl font-display font-bold text-slate-800 dark:text-white">15th Monthly</h4>
                    <span className="text-[10px] text-slate-500 font-light font-mono">Invoice auto emails active</span>
                  </div>
                </div>

                {/* Printable receipt logs */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-755 dark:text-slate-350">Transaction receipts</h4>
                  
                  <div className="space-y-2.5">
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 flex items-center justify-between font-mono text-[11px] text-slate-500">
                      <div className="space-y-0.5 text-left">
                        <p className="font-sans font-semibold text-xs text-slate-850 dark:text-white">REF: Rent Cycle Jun 15 - Jul 15</p>
                        <p className="text-[10px]">TXN CODE: 9811029210-CFG - Paid via UPI</p>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <span className="font-bold text-slate-850 dark:text-white">₹12,500</span>
                        <button
                          onClick={() => window.print()}
                          className="p-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-primary dark:text-primary-light font-sans text-[10px] font-medium cursor-pointer"
                        >
                          Print receipt
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 flex items-center justify-between font-mono text-[11px] text-slate-500">
                      <div className="space-y-0.5 text-left">
                        <p className="font-sans font-semibold text-xs text-slate-850 dark:text-white">REF: Admitting holding Security Deposit</p>
                        <p className="text-[10px]">TXN CODE: 3302192083-CFG - Paid via Net Bank</p>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <span className="font-bold text-slate-850 dark:text-white">₹30,000</span>
                        <button
                          onClick={() => window.print()}
                          className="p-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-primary dark:text-primary-light font-sans text-[10px] font-medium cursor-pointer"
                        >
                          Print receipt
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* View 4: Food weekly Mess schedule */}
            {activeTab === "messes" && (
              <motion.div
                key="tab-mess"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg text-slate-850 dark:text-white">Weekly Gourmet Mess agenda</h3>
                  <p className="text-xs text-slate-500 font-light font-sans">Check today's meal schedule and request box carry-overs.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuItems.map((item, idx) => {
                    const isToday = idx === 0; // Simulate today is Monday
                    return (
                      <div key={item.day} className={`p-5 rounded-2xl border transition-all ${
                        isToday 
                          ? "bg-primary/5 border-primary shadow-sm"
                          : "bg-slate-50/50 dark:bg-slate-900 border-slate-150 dark:border-slate-850"
                      }`}>
                        <div className="flex justify-between items-center mb-3">
                          <p className="font-display font-bold text-sm text-slate-850 dark:text-white">{item.day}</p>
                          {isToday && (
                            <span className="py-0.5 px-2.5 rounded bg-primary text-white font-mono text-[9px] font-bold">
                              Today's Plate
                            </span>
                          )}
                        </div>

                        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-sans">
                          <div>
                            <strong className="text-primary dark:text-primary-light font-mono text-[10px] block uppercase tracking-wider">Breakfast (7:30 AM - 9:30 AM)</strong>
                            <p className="font-light">{item.breakfast}</p>
                          </div>
                          <div>
                            <strong className="text-secondary block font-mono text-[10px] uppercase tracking-wider">Lunch (12:30 PM - 2:30 PM)</strong>
                            <p className="font-light">{item.lunch}</p>
                          </div>
                          <div>
                            <strong className="text-amber-500 block font-mono text-[10px] uppercase tracking-wider">Savor High Tea (4:30 PM - 5:30 PM)</strong>
                            <p className="font-light">{item.snacks}</p>
                          </div>
                          <div>
                            <strong className="text-emerald-500 block font-mono text-[10px] uppercase tracking-wider">Gourmet Dinner (8:00 PM - 10:00 PM)</strong>
                            <p className="font-light">{item.dinner}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* View 5: Maintenance Ticket logging */}
            {activeTab === "complaints" && (
              <motion.div
                key="tab-complaints"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg text-slate-850 dark:text-white">Active Room Maintenance Desk</h3>
                  <p className="text-xs text-slate-500 font-light font-sans">Raise tech compliance tickets or water pump failures.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Raise Ticket form */}
                  <form onSubmit={handleRaiseComplaint} className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">Log standard Ticket</h4>
                    
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</label>
                      <select
                        value={newCompType}
                        onChange={(e) => setNewCompType(e.target.value as any)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs rounded-xl outline-hidden text-slate-800 dark:text-white"
                      >
                        <option className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">WiFi</option>
                        <option className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Plumbing</option>
                        <option className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Electrical</option>
                        <option className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Housekeeping</option>
                        <option className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Food</option>
                        <option className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Others</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Urgency</label>
                      <select
                        value={newCompUrg}
                        onChange={(e) => setNewCompUrg(e.target.value as any)}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs rounded-xl outline-hidden text-slate-800 dark:text-white"
                      >
                        <option className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Medium</option>
                        <option className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">High</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Brief Subject</label>
                      <input
                        type="text"
                        required
                        value={newCompSub}
                        onChange={(e) => setNewCompSub(e.target.value)}
                        placeholder="e.g. Toilet tap leak"
                        className="w-full p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs rounded-xl outline-hidden text-slate-800 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Detailed breakdown</label>
                      <textarea
                        required
                        rows={3}
                        value={newCompDet}
                        onChange={(e) => setNewCompDet(e.target.value)}
                        placeholder="Please include room coordinates or appliance ID..."
                        className="w-full p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs rounded-xl outline-hidden text-slate-800 dark:text-white resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-display text-xs font-semibold transition-all cursor-pointer"
                    >
                      Log active ticket
                    </button>
                  </form>

                  {/* Tracking list */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-755 dark:text-slate-400">Logged Ticket stream</h4>
                    
                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                      {complaints.map((c) => (
                        <div key={c.id} className="p-4 rounded-xl border border-slate-150 dark:border-slate-800 text-xs leading-relaxed space-y-2 font-light">
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-[10px] text-slate-550 block">{c.id}</span>
                            <span className={`py-0.5 px-2.5 rounded font-mono font-bold text-[9px] uppercase ${
                              c.status === "Resolved" 
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                                : "bg-primary/10 text-primary animate-pulse"
                            }`}>
                              {c.status}
                            </span>
                          </div>
                          <p className="font-semibold text-slate-850 dark:text-white font-sans">{c.subject}</p>
                          <p className="text-slate-500 text-[11px] font-light">{c.details}</p>
                          <p className="text-[9px] font-mono text-slate-400">Urgency: {c.urgency} | Logged: {c.createdAt}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* View 6: Guardian Visitor pass issuer */}
            {activeTab === "visitors" && (
              <motion.div
                key="tab-visitors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg text-slate-850 dark:text-white">Resident visitor gate pass tracker</h3>
                  <p className="text-xs text-slate-500 font-light">Issue high safety OTP entry passes to family coming inside campus.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Pass generator */}
                  <form onSubmit={handleRaisePass} className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-400">Create digital Pass</h4>
                    
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Visitor's Full Name</label>
                      <input
                        type="text"
                        required
                        value={passName}
                        onChange={(e) => setPassName(e.target.value)}
                        placeholder="e.g. Shashi Ranade"
                        className="w-full p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl outline-hidden text-slate-800 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Relation</label>
                        <input
                          type="text"
                          required
                          value={passRel}
                          onChange={(e) => setPassRel(e.target.value)}
                          placeholder="e.g. Father"
                          className="w-full p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl outline-hidden text-slate-800 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Visit Date</label>
                        <input
                          type="date"
                          required
                          value={passDate}
                          onChange={(e) => setPassDate(e.target.value)}
                          className="w-full p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl outline-hidden text-slate-800 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Purpose of visit</label>
                      <input
                        type="text"
                        value={passPurp}
                        onChange={(e) => setPassPurp(e.target.value)}
                        placeholder="e.g. Handing books/luggage"
                        className="w-full p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl outline-hidden text-slate-800 dark:text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-display text-xs font-semibold cursor-pointer"
                    >
                      Issue digital Pass
                    </button>
                  </form>

                  {/* Issued Active lists */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-755 dark:text-slate-400 flex items-center justify-between">
                      Active issued tokens
                      <span className="text-[10px] font-mono text-slate-400 font-normal">Show at gate kiosk</span>
                    </h4>

                    {passes.map((p) => (
                      <div key={p.id} className="p-4 rounded-xl border border-slate-150 dark:border-slate-850 space-y-4 shadow-xs">
                        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-850 pb-3">
                          <div>
                            <span className="text-[9px] font-mono text-slate-450 block">VISITOR PASS ENTRY</span>
                            <span className="font-semibold text-slate-850 dark:text-white text-xs block">{p.visitorName}</span>
                            <span className="text-[10px] text-slate-500">Cabin Relation: {p.relation}</span>
                          </div>
                          <span className={`py-0.5 px-2 rounded font-mono text-[8px] font-bold uppercase ${
                            p.status === "Active" 
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 animate-pulse" 
                              : "bg-amber-500/10 text-amber-600"
                          }`}>
                            {p.status}
                          </span>
                        </div>

                        {/* Barcode / QR Section */}
                        <div className="flex items-center justify-between">
                          <div className="text-left space-y-1 text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                            <p>DATE: {p.date}</p>
                            <p>TIME: {p.timeIn} - {p.timeOut}</p>
                            <p className="text-primary font-bold">CODE: {p.tokenCode}</p>
                          </div>
                          
                          <div className="p-2.5 bg-white rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
                            {/* Visual QR Code Representation */}
                            <svg className="w-12 h-12 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M2 2h8v8H2V2zM4 4v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm2 2h2v4h-2v-4zm-4 2h2v2h-2v-2zm0-4h2v2h-2v-2zm2 4h2v2h-2v-2zm-6 2h2v2h-2v-2zm-2-4h2v2h-2v-2z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </motion.div>
            )}

            {/* View 7: Outstation leaves */}
            {activeTab === "leaves" && (
              <motion.div
                key="tab-leaves"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg text-slate-850 dark:text-white">Hometown outstation leaves planner</h3>
                  <p className="text-xs text-slate-500 font-light">Coordinated leave tracking with biometric temporary bypasses.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Form */}
                  <form onSubmit={handleRaiseLeave} className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-400">Request hometown leave</h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Leave Start</label>
                        <input
                          type="date"
                          required
                          value={leaveStart}
                          onChange={(e) => setLeaveStart(e.target.value)}
                          className="w-full p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl outline-hidden text-slate-800 dark:text-white cursor-pointer"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Leave End</label>
                        <input
                          type="date"
                          required
                          value={leaveEnd}
                          onChange={(e) => setLeaveEnd(e.target.value)}
                          className="w-full p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl outline-hidden text-slate-800 dark:text-white cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Reason details</label>
                      <textarea
                        required
                        rows={3}
                        value={leaveReason}
                        onChange={(e) => setLeaveReason(e.target.value)}
                        placeholder="Include parent confirmation details..."
                        className="w-full p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl outline-hidden text-slate-800 dark:text-white resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-display text-xs font-semibold cursor-pointer"
                    >
                      Authorize leave request
                    </button>
                    <p className="text-[10px] text-slate-550 leading-relaxed font-light">Submitting will register this into your parent SMS link. Upon their single touch agreement, exit bio gates auto-initialize.</p>
                  </form>

                  {/* Registry leaves list */}
                  <div className="space-y-3 font-sans text-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-400">Leave history records</h4>

                    {leaves.map((l) => (
                      <div key={l.id} className="p-4 rounded-xl border border-slate-150 dark:border-slate-850 text-slate-600 dark:text-slate-400 leading-relaxed font-light space-y-2">
                        <div className="flex justify-between items-center font-mono text-[9px]">
                          <span>ID: {l.id}</span>
                          <span className="text-emerald-500 bg-emerald-500/10 py-0.5 px-2 rounded font-bold uppercase">
                            Approved ✓
                          </span>
                        </div>
                        <p className="font-semibold text-slate-850 dark:text-white text-xs font-sans"> Nagpur hometown vacation</p>
                        <p className="text-slate-500 text-[11px] font-sans">Reason: {l.reason}</p>
                        <p className="text-[10px] font-mono">DATES: {l.startDate} to {l.endDate} | Parent Status: <span className="text-emerald-500 font-bold">{l.parentApprovalStatus}</span></p>
                      </div>
                    ))}
                  </div>

                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
