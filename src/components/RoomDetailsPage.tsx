import React, { useState } from "react";
import { Room, NearbyCollege, UserSession } from "../types";
import { motion } from "motion/react";
import { ArrowLeft, Star, Ruler, Users, BadgeAlert, Wifi, Bed, ShieldAlert, CheckCircle, Calendar, MessageSquare, Compass, ArrowRight, HeartHandshake } from "lucide-react";
import { useToast } from "../context/ToastContext";

interface RoomDetailsPageProps {
 room: Room;
 colleges: NearbyCollege[];
 currentUser: UserSession | null;
 onBack: () => void;
 onScheduleVisit: (room: Room) => void;
 onOpenAuth: () => void;
}

export default function RoomDetailsPage({
 room,
 colleges,
 currentUser,
 onBack,
 onScheduleVisit,
 onOpenAuth,
}: RoomDetailsPageProps) {
 const [activeTab, setActiveTab] = useState<"about" | "roommates" | "reviews">("about");
 const [selectedImg, setSelectedImg] = useState(room.images[0]);
 const [visitDate, setVisitDate] = useState("");
 const toast = useToast();

 const matchingColleges = colleges.filter(col => 
 room.nearbyColleges.some(nc => nc.collegeId === col.id)
 );

 return (
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 transition-all">
 {/* Back button */}
 <button
 onClick={onBack}
 className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors mb-8 cursor-pointer border border-slate-100 rounded-xl bg-white w-fit"
 id="room-details-back"
 >
 <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
 Back to luxury list
 </button>

 {/* Main Layout Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
 
 {/* Left Side: Images and Tabs (7 Cols) */}
 <div className="lg:col-span-7 space-y-8">
 
 {/* Multi Image Section */}
 <div className="space-y-4">
 <motion.div 
 layoutId={`room-image-hero-${room.id}`}
 className="relative w-full h-[320px] md:h-[450px] rounded-3xl overflow-hidden shadow-lg border border-slate-200/40 "
 >
 <img
 src={selectedImg}
 alt={room.name}
 className="w-full h-full object-cover select-none transition-zoom hover:scale-105 duration-700"
 referrerPolicy="no-referrer"
 />
 <div className="absolute top-4 left-4 p-2 px-4 rounded-xl text-xs font-semibold bg-white/95 shadow-sm text-primary flex items-center gap-1.5 backdrop-blur-xs">
 <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
 {room.rating} Rating
 </div>
 </motion.div>

 {/* Image Thumbnails */}
 <div className="flex gap-4 overflow-x-auto pb-1">
 {room.images.map((imgUrl, i) => (
 <button
 key={i}
 onClick={() => setSelectedImg(imgUrl)}
 className={`relative shrink-0 w-24 h-18 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
 selectedImg === imgUrl ? "border-primary scale-98 shadow-sm" : "border-transparent opacity-85 hover:opacity-100"
 }`}
 >
 <img src={imgUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
 </button>
 ))}
 </div>
 </div>

 {/* Tab Selector Segment */}
 <div className="border-b border-slate-200 flex gap-6 text-sm font-display font-medium">
 <button
 onClick={() => setActiveTab("about")}
 className={`pb-4 border-b-2 transition-all cursor-pointer ${
 activeTab === "about" ? "border-primary text-primary font-bold" : "border-transparent text-slate-500"
 }`}
 >
 Details & Rules
 </button>
 <button
 onClick={() => setActiveTab("roommates")}
 className={`pb-4 border-b-2 transition-all cursor-pointer ${
 activeTab === "roommates" ? "border-primary text-primary font-bold" : "border-transparent text-slate-500"
 }`}
 >
 Roommates ({room.roommates.length})
 </button>
 <button
 onClick={() => setActiveTab("reviews")}
 className={`pb-4 border-b-2 transition-all cursor-pointer ${
 activeTab === "reviews" ? "border-primary text-primary font-bold" : "border-transparent text-slate-500"
 }`}
 >
 Verified Reviews ({room.reviews?.length || 0})
 </button>
 </div>

 {/* Tab content screens */}
 <div className="min-h-[250px]">
 {activeTab === "about" && (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="space-y-8"
 >
 {/* Description */}
 <div>
 <h3 className="font-display font-semibold text-lg text-slate-900 mb-3">About this accommodation</h3>
 <p className="text-sm leading-relaxed text-slate-600 font-light font-sans">{room.description}</p>
 </div>

 {/* Key Room Amenities */}
 <div>
 <h3 className="font-display font-semibold text-base text-slate-900 mb-4">Room Specific Amenities</h3>
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
 {room.amenities.map((item, idx) => (
 <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 ">
 <CheckCircle className="w-4 h-4 text-primary shrink-0" />
 <span className="font-medium">{item}</span>
 </div>
 ))}
 </div>
 </div>

 {/* Living Rules section container */}
 <div className="p-5.5 rounded-3xl bg-amber-500/5 border border-amber-500/10 space-y-4">
 <div className="flex items-center gap-2.5 text-amber-600 ">
 <ShieldAlert className="w-5 h-5 shrink-0" />
 <h4 className="font-display font-semibold text-sm">Rules & Cooperative Agreements</h4>
 </div>
 <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed text-slate-600 font-light">
 {room.rules.map((rule, idx) => (
 <li key={idx} className="flex items-start gap-2">
 <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
 <span>{rule}</span>
 </li>
 ))}
 </ul>
 </div>
 </motion.div>
 )}

 {activeTab === "roommates" && (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="space-y-6"
 >
 <div className="flex items-center justify-between">
 <h3 className="font-display font-semibold text-lg text-slate-900 ">Active Roommates</h3>
 <span className="text-xs font-mono text-slate-500">{room.roommates.length} occupant(s) active</span>
 </div>

 {room.roommates.length === 0 ? (
 <div className="flex flex-col items-center justify-center p-12 rounded-3xl bg-slate-50 border border-slate-100 text-center">
 <Users className="w-8 h-8 text-slate-400 mb-3" />
 <p className="text-sm font-medium text-slate-800 ">Room is completely empty</p>
 <p className="text-xs text-slate-500 font-light max-w-xs mt-1">Book early to secure selective layout features first and choose bedding placement.</p>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {room.roommates.map((mate, index) => (
 <div key={index} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 ">
 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0 border-2 border-primary-light">
 {mate.name.charAt(0).toUpperCase()}
 </div>
 <div className="space-y-1.5">
 <p className="font-semibold text-sm text-slate-900 leading-none">{mate.name}</p>
 <p className="text-xs text-slate-500">{mate.college}</p>
 <div className="flex flex-wrap gap-1 pt-1">
 {mate.hobbies.map((hb, i) => (
 <span key={i} className="text-[9px] font-medium p-1 px-2 rounded-md bg-primary/10 text-primary font-mono capitalize">
 {hb}
 </span>
 ))}
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </motion.div>
 )}

 {activeTab === "reviews" && (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="space-y-4"
 >
 <div className="flex items-center gap-2">
 <h3 className="font-display font-semibold text-lg text-slate-900 ">Resident Reviews</h3>
 <div className="flex items-center text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
 <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 rounded-sm mr-1" />
 {room.rating} Rating
 </div>
 </div>

 {room.reviews && room.reviews.length > 0 ? (
 <div className="space-y-3.5 pt-2">
 {room.reviews.map((rev) => (
 <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
 <div className="flex justify-between items-start">
 <div className="flex gap-3 items-center">
 <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
 {rev.author.charAt(0).toUpperCase()}
 </div>
 <div>
 <p className="text-xs font-semibold text-slate-800 ">{rev.author}</p>
 <p className="text-[10px] text-slate-500">{rev.date}</p>
 </div>
 </div>
 <div className="flex items-center gap-0.5 text-xs text-amber-500">
 {[...Array(5)].map((_, i) => (
 <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-amber-500" : "opacity-30"}`} />
 ))}
 </div>
 </div>
 <p className="text-xs text-slate-600 leading-relaxed font-light">{rev.comment}</p>
 </div>
 ))}
 </div>
 ) : (
 <div className="flex flex-col items-center justify-center p-12 rounded-3xl bg-slate-50 border border-slate-100 text-center">
 <MessageSquare className="w-8 h-8 text-slate-400 mb-3" />
 <p className="text-sm font-medium text-slate-800 ">No written reviews yet</p>
 <p className="text-xs text-slate-500 mt-1 max-w-xs font-light">Be the first to leave a review after completing your digital booking confirmation!</p>
 </div>
 )}
 </motion.div>
 )}
 </div>

 </div>

 {/* Right Side: Proximity & Sticky Booking (5 Cols) */}
 <div className="lg:col-span-5 space-y-6">
 
 {/* Quick Metrics overview box */}
 <div className="p-6 rounded-3xl bg-white border border-slate-250/50 shadow-lg space-y-5">
 <div className="pb-4 border-b border-slate-100 ">
 <span className="text-xs font-mono uppercase tracking-widest text-slate-450 block mb-1 font-semibold">
 Monthly Package
 </span>
 <div className="flex items-baseline gap-2">
 <span className="text-3xl font-display font-semibold text-slate-850 ">
 {room.priceRange || `₹${room.price.toLocaleString("en-IN")}`}
 </span>
 <span className="text-xs text-slate-500">/ resident</span>
 </div>
 <div className="flex items-center justify-between text-xs text-slate-500 pt-3">
 <span>Security Deposit:</span>
 <strong className="text-slate-850 font-mono">{room.depositRange || `₹${room.deposit.toLocaleString("en-IN")}`}</strong>
 </div>
 <div className="flex items-center justify-between text-xs text-slate-500">
 <span>Room Dimension:</span>
 <strong className="text-slate-850 font-mono">{room.size}</strong>
 </div>
 </div>

 {/* Availability Indicator */}
 <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 ">
 <div className="space-y-0.5">
 <p className="text-xs font-semibold text-slate-800 ">Active Allocations Left</p>
 <p className="text-xs text-slate-500 font-light">Includes meals and laundry services</p>
 </div>
 <span className="py-1 px-3 text-xs rounded-lg font-mono font-bold bg-primary/10 text-primary animate-pulse whitespace-nowrap">
 {room.availability} Beds left
 </span>
 </div>

 {/* Visitation scheduler block */}
 <div className="space-y-3.5 pt-2">
 <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 ">
 <Calendar className="w-4 h-4 text-primary" />
 Want to check in person?
 </h4>
 <div className="relative">
 <input
 type="date"
 value={visitDate}
 onChange={(e) => setVisitDate(e.target.value)}
 className="w-full p-3 pl-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-850 outline-hidden cursor-pointer"
 />
 </div>

 {/* Booking Buttons */}
 <div className="flex flex-col sm:flex-row gap-3 pt-2">
 <button
 onClick={() => {
 if (!currentUser) {
 onOpenAuth();
 return;
 }
 if (!visitDate) {
 toast.error("Please choose a validation visitation date from the widget.");
 return;
 }
 // Simulate booking visit
 onScheduleVisit(room);
 }}
 className="flex-1 py-3.5 border border-primary/20 hover:border-primary/40 bg-primary hover:bg-primary-dark text-white rounded-xl font-display text-xs font-semibold transition-all cursor-pointer"
 id="btn-schedule-visit"
 >
 Schedule Free Visit
 </button>
 </div>
 </div>
 </div>

 {/* College Connect list */}
 <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/50 space-y-4">
 <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 ">
 <Compass className="w-4 h-4 text-emerald-500" />
 Proximity to standard universities
 </h4>
 <div className="space-y-3">
 {matchingColleges.map((col) => {
 const mapRef = room.nearbyColleges.find(nc => nc.collegeId === col.id);
 return (
 <div key={col.id} className="flex justify-between items-center p-3 rounded-2xl bg-white border border-slate-200/40 ">
 <div className="space-y-0.5">
 <p className="text-xs font-semibold text-slate-800 ">{col.name}</p>
 <p className="text-[10px] text-slate-500 font-light">{col.timeByCab} by scooter/cab</p>
 </div>
 <span className="py-1 px-2.5 rounded-lg text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-600 whitespace-nowrap">
 {mapRef?.distance || col.distance} away
 </span>
 </div>
 );
 })}
 </div>
 </div>

 </div>

 </div>
 </div>
 );
}
