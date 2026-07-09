import React, { useState } from "react";
import { Room, Booking } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { ClipboardList, Users, BarChart3, Contact, BookOpenCheck } from "lucide-react";

interface AdminDashboardProps {
  rooms: Room[];
  bookings: Booking[];
  visits: any[];
  onApproveBooking: (id: string) => void;
  onApproveVisit: (id: string, message: string) => void;
}

type AdminTab = "overview" | "residents" | "bookings" | "visits" | "staff";

export default function AdminDashboard({
  rooms,
  bookings,
  visits,
  onApproveBooking,
  onApproveVisit,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [visitMessages, setVisitMessages] = useState<{ [key: string]: string }>({});
  
  // Manage Warden states
  const [residents, setResidents] = useState([
    { id: "res-1", name: "Ananya Iyer", email: "ananya@student.edu", room: "103", college: "Business & Arts", docStatus: "Verified" },
    { id: "res-2", name: "Priya Sharma", email: "priya.sharma@student.edu", room: "305", college: "Medical & Allied", docStatus: "Verified" },
    { id: "res-3", name: "Meera Deshmukh", email: "meera@student.edu", room: "204", college: "Engineering", docStatus: "Verified" },
    { id: "res-4", name: "Sneha Sen", email: "sneha_sen@student.edu", room: "305", college: "Computer Science", docStatus: "Verified" },
    { id: "res-5", name: "Sanya Roy", email: "sanya@student.edu", room: "306", college: "Management & Law", docStatus: "Verification Pending" }
  ]);

  const [staff, setStaff] = useState([
    { id: "st-1", name: "Mrs. Savita Deshpande", role: "Chief Warden", contact: "+91 99001 12233", shift: "General 24x7" },
    { id: "st-2", name: "Meenakshi Bhat", role: "Head Chef", contact: "+91 99011 22334", shift: "Morning / Evening" },
    { id: "st-3", name: "Lata Kamble", role: "Housekeeping Lead", contact: "+91 99022 33445", shift: "Day Shift (8AM - 4PM)" },
    { id: "st-4", name: "Kiran Patil", role: "Security Ward Officer", contact: "+91 99033 44556", shift: "Night Guard (8PM - 8AM)" },
  ]);

  const removeResident = (id: string, name: string) => {
    if (confirm(`Are you sure you want to perform a structural Checkout Auditing for resident ${name}? All cloud keys will expire.`)) {
      setResidents(residents.filter((r) => r.id !== id));
    }
  };

  // KPIs
  const totalBeds = rooms.reduce((acc, r) => acc + (r.availability + r.roommates.length), 0);
  const occupiedBeds = rooms.reduce((acc, r) => acc + r.roommates.length, 0);
  const occupancyPercentage = Math.round((occupiedBeds / totalBeds) * 100);
  
  // Total pending room bookings approvals
  const pendingBookingsCount = bookings.filter((b) => b.status === "Visit Scheduled" || b.status === "Pending Approval").length;

  // Total pending physical visits approvals
  const pendingVisitsCount = visits.filter((v) => v.status === "Pending" || v.status === "Upcoming" || !v.status).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 transition-colors">
      
      {/* Admin Title Greet Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="py-1 px-2.5 rounded bg-amber-500 text-white font-mono text-[9px] font-bold uppercase">
              Warden Administration Mode
            </span>
            <span className="text-xs text-slate-400 font-mono">Terminal Node Active</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-850 dark:text-white pt-1.5 flex items-center gap-2">
            Comfort Girls PG - Central Console
          </h1>
          <p className="text-sm text-slate-500 font-light font-sans">Comprehensive security, telemetry billing, and room slots coordinator.</p>
        </div>

        {/* Dynamic occupancy counter */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-2xl shadow-xs shrink-0">
          <div className="text-left font-mono">
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-widest">Occupancy Tracker</span>
            <h4 className="text-lg font-sans font-bold text-primary">{occupiedBeds} / {totalBeds} Beds taken</h4>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-800 flex items-center justify-center font-bold text-xs font-mono relative overflow-hidden text-slate-700 dark:text-slate-300">
            {occupancyPercentage}%
            <div className="absolute bottom-0 left-0 right-0 bg-primary/20" style={{ height: `${occupancyPercentage}%` }} />
          </div>
        </div>
      </div>

      {/* Grid Layout containing sidebar & widgets channels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left sidebar nav list (3 Cols) */}
        <div className="lg:col-span-3 space-y-2 bg-white dark:bg-slate-900 border border-slate-250/50 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
          {[
            { label: "Executive Analytics", tab: "overview" as const, icon: BarChart3 },
            { label: "Resident Directory", tab: "residents" as const, icon: Users },
            { label: " visitation Approvings", tab: "bookings" as const, icon: BookOpenCheck },
            { label: "Physical Visit Requests", tab: "visits" as const, icon: ClipboardList },
            { label: "On Site Staff registry", tab: "staff" as const, icon: Contact },
          ].map((item) => {
            const Icon = item.icon;
            const isSel = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all font-display text-xs font-semibold cursor-pointer ${
                  isSel
                    ? "bg-primary text-white shadow-md shadow-primary/15"
                    : "text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-850"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right dashboard workspace panels (9 Cols) */}
        <div className="lg:col-span-9 bg-white dark:bg-slate-900 rounded-3xl border border-slate-150 dark:border-slate-800 p-6 md:p-8 shadow-md">
          
          <AnimatePresence mode="wait">
            
            {/* View 1: Overview Analytics and occupancy bar chart */}
            {activeTab === "overview" && (
              <motion.div
                key="tab-overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Metrics top widget boxes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/80 border border-slate-150 dark:border-slate-800">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-slate-550 block">Occupied Bed Slots</span>
                    <h3 className="text-xl font-display font-bold text-slate-850 dark:text-white pt-1">{occupiedBeds} Beds</h3>
                    <span className="text-[10px] text-slate-500">{totalBeds - occupiedBeds} units vacant</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/80 border border-slate-150 dark:border-slate-800">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-slate-550 block">Suite Bookings</span>
                    <h3 className="text-xl font-display font-bold text-slate-850 dark:text-white pt-1">{pendingBookingsCount} Pending</h3>
                    <span className="text-[10px] text-primary animate-pulse">Needs clearance attention</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/80 border border-slate-150 dark:border-slate-800">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-slate-550 block">Physical visit requests</span>
                    <h3 className="text-xl font-display font-bold text-slate-850 dark:text-white pt-1">{pendingVisitsCount} Pending</h3>
                    <span className="text-[10px] text-emerald-505 animate-pulse">Tour clearances</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  
                  {/* Occupancy Level Bar Chart */}
                  <div className="p-5 rounded-2xl border border-slate-150 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/50">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-755 dark:text-slate-350 mb-4 flex justify-between items-center">
                      Occupancy configuration levels
                      <span className="text-[9px] font-mono text-primary font-normal">Active capacity</span>
                    </h4>

                    {/* Custom vertical Bars */}
                    <div className="relative h-44 w-full flex items-end justify-around pt-6">
                      {/* Bar 1: Single Sharing */}
                      <div className="flex flex-col items-center gap-1.5 w-1/4">
                        <span className="text-[9px] font-bold text-slate-800 dark:text-slate-200">92%</span>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 110 }}
                          transition={{ delay: 0.2 }}
                          className="w-8 rounded-t-lg bg-primary"
                        />
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">Single</span>
                      </div>

                      {/* Bar 2: Double Sharing */}
                      <div className="flex flex-col items-center gap-1.5 w-1/4">
                        <span className="text-[9px] font-bold text-slate-800 dark:text-slate-200">81%</span>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 95 }}
                          transition={{ delay: 0.3 }}
                          className="w-8 rounded-t-lg bg-secondary"
                        />
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">Double</span>
                      </div>

                      {/* Bar 3: Triple Sharing */}
                      <div className="flex flex-col items-center gap-1.5 w-1/4">
                        <span className="text-[9px] font-bold text-slate-800 dark:text-slate-200">65%</span>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 75 }}
                          transition={{ delay: 0.4 }}
                          className="w-8 rounded-t-lg bg-amber-500"
                        />
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider">Triple</span>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* View 2: Student Directory */}
            {activeTab === "residents" && (
              <motion.div
                key="tab-residents"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-bold text-lg text-slate-850 dark:text-white">Active Resident Registry</h3>
                  <button
                    onClick={() => {
                      const name = prompt("Enter new resident full name:");
                      const room = prompt("Enter room allocation:");
                      const college = prompt("Enter college reference:");
                      if (name && room && college) {
                        setResidents([...residents, {
                          id: "res-" + Math.random().toString(36).substring(4),
                          name, room, college, email: `${name.toLowerCase().replace(/\s/g, '')}@student.edu`,
                          docStatus: "Verified"
                        }]);
                      }
                    }}
                    className="p-2 py-1 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition-all cursor-pointer"
                  >
                    Add resident
                  </button>
                </div>

                <div className="space-y-3.5 pt-2">
                  {residents.map((r) => (
                    <div key={r.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-150 dark:border-slate-855 font-sans text-xs">
                      <div>
                        <h4 className="font-semibold text-slate-855 dark:text-white text-sm">{r.name}</h4>
                        <p className="text-slate-500 pt-0.5">{r.email} | university: <strong className="text-slate-700 dark:text-slate-350">{r.college}</strong></p>
                        <p className="text-[10px] font-mono text-slate-400">ALLOCATED WINDOW: Room Suite #{r.room} (Bed-B)</p>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <span className="py-0.5 px-2 rounded-md font-mono text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                          {r.docStatus}
                        </span>
                        <button
                          onClick={() => removeResident(r.id, r.name)}
                          className="p-1.5 rounded-lg border border-red-250 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold cursor-pointer"
                        >
                          Checkout
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* View 3: Visitation Approvings */}
            {activeTab === "bookings" && (
              <motion.div
                key="tab-bookings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg text-slate-850 dark:text-white">Active visitation list approvals</h3>
                  <p className="text-xs text-slate-500 font-light font-sans font-mono text-[11px]">Approve scheduled host visits and secure digital escrows.</p>
                </div>

                {bookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400 font-light bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-2xl">
                    <ClipboardList className="w-8 h-8 text-slate-350 mb-3" />
                    <p className="text-sm font-medium">No active approvals pending</p>
                    <p className="text-xs">All scheduled slot walk-throughs are completely green!</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {bookings.map((b) => (
                      <div key={b.id} className="p-4 rounded-xl border border-slate-150 dark:border-slate-850 space-y-3 font-mono text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-500">REF: {b.id}</span>
                          <span className={`py-0.5 px-2.5 rounded font-bold text-[9px] uppercase ${
                            b.status === "Approved" || b.status === "Completed"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-amber-500/10 text-amber-600 animate-pulse"
                          }`}>
                            {b.status}
                          </span>
                        </div>

                        <div className="text-left font-sans text-xs text-slate-650 dark:text-slate-400 space-y-1">
                          <p>Occupant Category: <strong className="text-slate-850 dark:text-white">{b.sharingType} suite</strong></p>
                          <p>Paid Holding reservation fee: <strong className="text-emerald-500">₹{b.paidAmount.toLocaleString("en-IN")}</strong></p>
                          <p>Documents categorization: {b.documentType}</p>
                          {b.scheduleVisitDate && (
                            <p className="text-amber-500 font-semibold font-mono text-[10px]">Visitations Slot schedule: {b.scheduleVisitDate}</p>
                          )}
                        </div>

                        {b.status !== "Approved" && b.status !== "Completed" && (
                          <div className="flex gap-2.5 pt-1.5">
                            <button
                              onClick={() => onApproveBooking(b.id)}
                              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-sans text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                            >
                              Approve & Notify
                            </button>
                            <button
                              onClick={() => alert("Visitations re-dispatched into local parent verification check chains.")}
                              className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-sans text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                            >
                              Reschedule Room Code
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* View 4: Physical Visit Requests */}
            {activeTab === "visits" && (
              <motion.div
                key="tab-visits"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg text-slate-850 dark:text-white">Physical Visit Requests</h3>
                  <p className="text-xs text-slate-500 font-light font-sans">Review physical tours, approve slots, and send messages back to residents.</p>
                </div>

                {visits.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400 font-light bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-2xl">
                    <ClipboardList className="w-8 h-8 text-slate-350 mb-3" />
                    <p className="text-sm font-medium">No physical visit requests logged</p>
                    <p className="text-xs">No upcoming site visit tours scheduled currently.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5 pt-2">
                    {visits.map((v) => (
                      <div key={v.id} className="p-4 rounded-xl border border-slate-150 dark:border-slate-850 space-y-3 font-sans text-xs flex flex-col justify-between">
                        <div className="flex justify-between items-center font-mono">
                          <span className="font-bold text-slate-500">REF: VISIT-{v.id}</span>
                          <span className={`py-0.5 px-2.5 rounded font-bold text-[9px] uppercase ${
                            v.status === "Approved"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-amber-500/10 text-amber-600 animate-pulse"
                          }`}>
                            {v.status || "Pending"}
                          </span>
                        </div>

                        <div className="text-left space-y-1 text-slate-650 dark:text-slate-400">
                          <h4 className="font-semibold text-slate-850 dark:text-white text-sm leading-snug">{v.userName}</h4>
                          <p className="font-mono text-[10px] text-slate-500">{v.userEmail} | {v.userPhone}</p>
                          <div className="grid grid-cols-2 gap-2 pt-1 pb-1 font-mono text-[10px] text-slate-700 dark:text-slate-300">
                            <p>Date: <strong className="text-slate-900 dark:text-white">{v.date}</strong></p>
                            <p>Time Slot: <strong className="text-slate-900 dark:text-white">{v.time}</strong></p>
                          </div>
                          <p className="pt-1 font-light italic">Reason for visit: "{v.reason}"</p>
                          {v.adminMessage && (
                            <p className="text-[10px] text-emerald-500 dark:text-emerald-400 font-semibold pt-1 font-sans">Response sent: "{v.adminMessage}"</p>
                          )}
                        </div>

                        {v.status !== "Approved" && (
                          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-850">
                            <label className="block text-[9px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                              Response message / Warden notes
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="e.g. Sure, see you at 2 PM! - Warden"
                                value={visitMessages[v.id] || ""}
                                onChange={(e) => setVisitMessages({ ...visitMessages, [v.id]: e.target.value })}
                                className="flex-grow text-xs font-semibold px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-hidden focus:border-primary text-slate-800 dark:text-white"
                              />
                              <button
                                onClick={() => {
                                  onApproveVisit(v.id, visitMessages[v.id] || "");
                                  setVisitMessages({ ...visitMessages, [v.id]: "" });
                                }}
                                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-sans text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
                              >
                                Approve & Message
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* View 5: On Site Staff registry */}
            {activeTab === "staff" && (
              <motion.div
                key="tab-staff"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg text-slate-850 dark:text-white">Active campus staff registry</h3>
                  <p className="text-xs text-slate-500 font-light font-sans font-mono text-[11px]">Contact parameters of kitchen leads and security ward officers.</p>
                </div>

                <div className="space-y-3.5 pt-2">
                  {staff.map((s) => (
                    <div key={s.id} className="p-4 rounded-xl border border-slate-150 dark:border-slate-855 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 font-sans text-xs">
                      <div>
                        <h4 className="font-semibold text-slate-855 dark:text-white text-sm">{s.name}</h4>
                        <p className="text-slate-500 pt-0.5">Campus Role: <strong className="text-primary">{s.role}</strong></p>
                        <p className="text-[10px] text-slate-455 font-mono">SHIFT WORKER WINDOW: {s.shift}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono">{s.contact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
