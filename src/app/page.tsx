"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
 Sparkles, ShieldCheck, Fingerprint, UserCheck, HeartPulse, Wifi, Zap, Shirt,
 Dumbbell, BookOpen, ChefHat, Utensils, Droplet, Caravan, Trees, Gamepad2,
 HeartHandshake, Gem, MapPin, Smartphone, Salad, Award, Users, FileText,
 Star, ChevronRight, ChevronLeft, ArrowRight, Play, X, Compass, HelpCircle,
 Phone, Mail, Clock
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp } from "../context/AppContext";
import { MOCK_AMENITIES, DETAILED_NEARBY_PLACES, MOCK_TESTIMONIALS, MOCK_GALLERY, MOCK_FAQ } from "../lib/staticData";
import { apiClient } from "../utils/apiClient";

export default function Home() {
 const router = useRouter();
 const { activeRooms, currentUser, setIsAuthOpen } = useApp();


 // Visit Booking Modal State
 const [isVisitModalOpen, setIsVisitModalOpen] = useState<boolean>(false);
 const [visitDate, setVisitDate] = useState<string>("");
 const [visitTime, setVisitTime] = useState<string>("09:30 AM - 11:30 AM");
 const [visitReason, setVisitReason] = useState<string>("");
 const [isSubmittingVisit, setIsSubmittingVisit] = useState<boolean>(false);

 const handleVisitSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (!visitDate || !visitTime || !visitReason.trim()) {
 alert("Please fill in all the visit booking details.");
 return;
 }

 setIsSubmittingVisit(true);
 apiClient.post("/api/visits", {
 date: visitDate,
 time: visitTime,
 reason: visitReason
 })
 .then((res) => {
 setIsSubmittingVisit(false);
 setIsVisitModalOpen(false);
 setVisitDate("");
 setVisitTime("09:30 AM - 11:30 AM");
 setVisitReason("");
 alert("Your physical PG visit has been requested successfully! You can monitor the status on your Resident Dashboard.");
 })
 .catch((err) => {
 setIsSubmittingVisit(false);
 alert("Failed to schedule visit: " + err.message);
 });
 };

 // Gallery dynamic states
 const [galleryTab, setGalleryTab] = useState<string>("All");
 const [isGalleryExpanded, setIsGalleryExpanded] = useState<boolean>(false);
 const [lightboxImg, setLightboxImg] = useState<string | null>(null);

 // FAQ Accordion states
 const [faqTab, setFaqTab] = useState<string>("General");
 const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

 // Testimonials slide carousel index
 const [testiIndex, setTestiIndex] = useState<number>(0);

 const [windowWidth, setWindowWidth] = useState<number>(1200);

 useEffect(() => {
 if (typeof window === "undefined") return;
 setWindowWidth(window.innerWidth);
 const handleResize = () => setWindowWidth(window.innerWidth);
 window.addEventListener("resize", handleResize);
 return () => window.removeEventListener("resize", handleResize);
 }, []);

 // Multi Image Counter stats
 const [animatedRoomsCount, setAnimatedRoomsCount] = useState<number>(5);
 const [animatedHappyCount, setAnimatedHappyCount] = useState<number>(100);
 const [nearbyActiveTab, setNearbyActiveTab] = useState<"Colleges / Universities" | "Malls" | "Companies">("Colleges / Universities");

 const filteredNearbyPlaces = DETAILED_NEARBY_PLACES.filter(
 (place) => place.category === nearbyActiveTab
 );

 const nearbyContainerRef = useRef<HTMLDivElement>(null);
 const nearbyInnerRef = useRef<HTMLDivElement>(null);
 const [nearbyDragConstraints, setNearbyDragConstraints] = useState({ left: 0, right: 0 });

 useEffect(() => {
 const updateConstraints = () => {
 if (nearbyContainerRef.current && nearbyInnerRef.current) {
 const containerWidth = nearbyContainerRef.current.offsetWidth;
 const innerWidth = nearbyInnerRef.current.scrollWidth;
 const maxDrag = Math.min(0, containerWidth - innerWidth - 32);
 setNearbyDragConstraints({ left: maxDrag, right: 0 });
 }
 };

 updateConstraints();
 const timer = setTimeout(updateConstraints, 100);

 window.addEventListener("resize", updateConstraints);
 return () => {
 window.removeEventListener("resize", updateConstraints);
 clearTimeout(timer);
 };
 }, [nearbyActiveTab, filteredNearbyPlaces.length]);

 const roomsContainerRef = useRef<HTMLDivElement>(null);
 const roomsInnerRef = useRef<HTMLDivElement>(null);
 const [roomsDragConstraints, setRoomsDragConstraints] = useState({ left: 0, right: 0 });

 useEffect(() => {
 const updateRoomsConstraints = () => {
 if (roomsContainerRef.current && roomsInnerRef.current) {
 const containerWidth = roomsContainerRef.current.offsetWidth;
 const innerWidth = roomsInnerRef.current.scrollWidth;
 const maxDrag = Math.min(0, containerWidth - innerWidth - 32);
 setRoomsDragConstraints({ left: maxDrag, right: 0 });
 }
 };

 updateRoomsConstraints();
 const timer = setTimeout(updateRoomsConstraints, 100);

 window.addEventListener("resize", updateRoomsConstraints);
 return () => {
 window.removeEventListener("resize", updateRoomsConstraints);
 clearTimeout(timer);
 };
 }, [activeRooms.length]);

 // Counting micro stats on landing page
 useEffect(() => {
 const intervalRooms = setInterval(() => {
 setAnimatedRoomsCount((prev) => (prev < 100 ? prev + 5 : 100));
 }, 45);
 const intervalHappy = setInterval(() => {
 setAnimatedHappyCount((prev) => (prev < 500 ? prev + 20 : 500));
 }, 35);
 return () => {
 clearInterval(intervalRooms);
 clearInterval(intervalHappy);
 };
 }, []);


 const renderAmenityIcon = (iconName: string) => {
 const props = { className: "w-6 h-6 text-[#D96B27] shrink-0 transition-transform group-hover:scale-110" };
 switch (iconName) {
 case "ShieldCheck": return <ShieldCheck {...props} />;
 case "Fingerprint": return <Fingerprint {...props} />;
 case "UserRoundCheck": return <UserCheck {...props} />;
 case "HeartPulse": return <HeartPulse {...props} />;
 case "Wifi": return <Wifi {...props} />;
 case "Zap": return <Zap {...props} />;
 case "Shirt": return <Shirt {...props} />;
 case "Dumbbell": return <Dumbbell {...props} />;
 case "BookOpen": return <BookOpen {...props} />;
 case "ChefHat": return <ChefHat {...props} />;
 case "Utensils": return <Utensils {...props} />;
 case "Droplet": return <Droplet {...props} />;
 case "ParkingSquare": return <Caravan {...props} />;
 case "Trees": return <Trees {...props} />;
 case "Gamepad2": return <Gamepad2 {...props} />;
 default: return <ShieldCheck {...props} />;
 }
 };


 return (
 <div className="pb-16 flex flex-col">

 {/* HERO SECTION */}
 <section className="relative overflow-hidden bg-[#FAF8F5] pt-10 pb-6 lg:pt-12 lg:pb-8 transition-colors">
 <div className="absolute top-0 right-0 w-[40%] h-[50%] bg-primary/5 rounded-bl-full filter blur-3xl pointer-events-none" />
 <div className="absolute bottom-10 left-12 w-80 h-80 bg-secondary/5 rounded-full filter blur-3xl pointer-events-none" />
 
 {/* Background Image with precise fading */}
 <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
 <img 
 src="/bg-home.png" 
 alt="Hero Background" 
 className="absolute inset-0 w-full h-full object-cover object-[70%_center] md:object-right" 
 />
 {/* Left horizontal fade - stronger solid background behind text */}
 <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5] to-transparent w-full md:w-[70%] lg:w-[60%]" />
 <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/90 to-transparent w-full md:w-[85%] lg:w-[75%]" />
 
 {/* Bottom vertical fade to solid background color */}
 <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/80 to-transparent" />
 </div>

 <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

 {/* Left Column Information */}
 <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
 <motion.div
 initial={{ opacity: 0, y: -10 }}
 animate={{ opacity: 1, y: 0 }}
 className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FDF4EB] text-[#D96B27] rounded-full text-[10px] font-black uppercase tracking-wider w-fit border border-[#F4E1CE]"
 >
 <span className="flex h-2 w-2 rounded-full bg-[#D96B27] animate-pulse"></span>
 Verified Premium Female Housing
 </motion.div>

 <motion.h1
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 }}
 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-extrabold text-[#4A3728] leading-[1.1] tracking-tight font-serif"
 >
 Find Your Perfect <br />
 <span className="text-[#D96B27] font-serif">
 Home Away
 </span> <br />
 From Home
 </motion.h1>

 <motion.p
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.15 }}
 className="text-[#4A3728] text-base md:text-lg max-w-xl font-medium leading-relaxed"
 >
 Safe, comfortable and affordable Girls PG with premium facilities, organic meals, and 24/7 security near your favorite colleges.
 </motion.p>

 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.2 }}
 className="flex flex-wrap items-center gap-4"
 >
 <button
 onClick={() => router.push("/rooms")}
 className="px-8 py-3.5 bg-[#C65D21] hover:bg-[#a84d1a] transition-all rounded-2xl font-display font-bold text-white flex items-center gap-2 shadow-[0_8px_16px_-4px_rgba(198,93,33,0.3)] cursor-pointer"
 id="hero-explore-btn"
 >
 Explore Rooms
 <ArrowRight className="w-4 h-4" />
 </button>
 <button
 onClick={() => {
 if (!currentUser) {
 setIsAuthOpen(true);
 } else {
 setIsVisitModalOpen(true);
 }
 }}
 className="px-8 py-3.5 bg-[#FAF8F5] border border-[#D9CDBF] hover:bg-[#F2EAE0] transition-all rounded-2xl font-display font-bold text-[#4A3728] shadow-sm cursor-pointer"
 >
 Book Visit
 </button>
 </motion.div>
 </div>



 </div>

 {/* Stats Ribbon */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-14">
 
 {/* Card 1 */}
 <div className="flex items-center gap-4 px-5 py-4 bg-[#FDF6F0] rounded-2xl border border-[#F5E2D3] shadow-sm">
 <div className="w-12 h-12 rounded-full bg-[#F4DECD] flex items-center justify-center shrink-0">
 <svg className="w-6 h-6 text-[#C65D21]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
 </svg>
 </div>
 <div className="text-left">
 <h3 className="text-2xl font-black text-[#C65D21] leading-none">{animatedRoomsCount}+</h3>
 <p className="text-[10px] text-[#4A3728] font-bold uppercase tracking-wider mt-1.5">Luxury Suites</p>
 </div>
 </div>

 {/* Card 2 */}
 <div className="flex items-center gap-4 px-5 py-4 bg-[#FDF0F2] rounded-2xl border border-[#F5D8DD] shadow-sm">
 <div className="w-12 h-12 rounded-full bg-[#F4D2D8] flex items-center justify-center shrink-0">
 <Users className="w-6 h-6 text-[#D14F67]" />
 </div>
 <div className="text-left">
 <h3 className="text-2xl font-black text-[#D14F67] leading-none">{animatedHappyCount}+</h3>
 <p className="text-[10px] text-[#4A3728] font-bold uppercase tracking-wider mt-1.5">Happy Students</p>
 </div>
 </div>

 {/* Card 3 */}
 <div className="flex items-center gap-4 px-5 py-4 bg-[#FDF8EE] rounded-2xl border border-[#F5EAD3] shadow-sm">
 <div className="w-12 h-12 rounded-full bg-[#F3E2C4] flex items-center justify-center shrink-0">
 <ShieldCheck className="w-6 h-6 text-[#D98727]" />
 </div>
 <div className="text-left">
 <h3 className="text-2xl font-black text-[#D98727] leading-none">24x7</h3>
 <p className="text-[10px] text-[#4A3728] font-bold uppercase tracking-wider mt-1.5">CCTV & Wardens</p>
 </div>
 </div>

 {/* Card 4 */}
 <div className="flex items-center gap-4 px-5 py-4 bg-[#F3F9F2] rounded-2xl border border-[#DDECDA] shadow-sm">
 <div className="w-12 h-12 rounded-full bg-[#D4EAD0] flex items-center justify-center shrink-0">
 <Star className="w-6 h-6 text-[#5C894B] fill-[#5C894B]" />
 </div>
 <div className="text-left">
 <h3 className="text-2xl font-black text-[#5C894B] leading-none">4.9 ★</h3>
 <p className="text-[10px] text-[#4A3728] font-bold uppercase tracking-wider mt-1.5">Warden Rating</p>
 </div>
 </div>

 </div>

 </div>
 </section>

 {/* AMENITIES SECTION */}
 <section className="bg-[#FAF8F5] py-8 relative overflow-hidden" id="amenities">
 
 {/* Left Floral Border */}
 <div className="absolute left-0 top-16 h-[250px] w-24 md:w-32 text-[#EBD3C0] pointer-events-none transform -translate-x-1/4 opacity-70">
 <svg viewBox="0 0 200 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
 <path d="M-20,500 Q80,300 150,0" stroke="currentColor" strokeWidth="2" fill="none" />
 <path d="M10,430 C40,430 60,400 70,360 C40,360 10,390 10,430" fill="currentColor" opacity="0.8"/>
 <path d="M30,350 C70,350 90,310 100,260 C60,260 20,300 30,350" fill="currentColor" />
 <path d="M60,250 C100,250 120,200 130,150 C90,150 50,200 60,250" fill="currentColor" opacity="0.9"/>
 <path d="M100,150 C140,150 150,100 150,50 C110,60 80,110 100,150" fill="currentColor" opacity="0.8"/>
 <path d="M10,380 C-20,360 -30,320 -10,290 C10,320 20,350 10,380" fill="currentColor" opacity="0.7"/>
 <path d="M40,280 C0,260 -10,210 10,180 C30,220 50,250 40,280" fill="currentColor" />
 <path d="M70,180 C40,150 30,100 60,70 C80,110 90,150 70,180" fill="currentColor" opacity="0.9"/>
 </svg>
 </div>

 {/* Right Floral Border */}
 <div className="absolute right-0 top-16 h-[250px] w-24 md:w-32 text-[#EBD3C0] pointer-events-none transform translate-x-1/4 scale-x-[-1] opacity-70">
 <svg viewBox="0 0 200 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
 <path d="M-20,500 Q80,300 150,0" stroke="currentColor" strokeWidth="2" fill="none" />
 <path d="M10,430 C40,430 60,400 70,360 C40,360 10,390 10,430" fill="currentColor" opacity="0.8"/>
 <path d="M30,350 C70,350 90,310 100,260 C60,260 20,300 30,350" fill="currentColor" />
 <path d="M60,250 C100,250 120,200 130,150 C90,150 50,200 60,250" fill="currentColor" opacity="0.9"/>
 <path d="M100,150 C140,150 150,100 150,50 C110,60 80,110 100,150" fill="currentColor" opacity="0.8"/>
 <path d="M10,380 C-20,360 -30,320 -10,290 C10,320 20,350 10,380" fill="currentColor" opacity="0.7"/>
 <path d="M40,280 C0,260 -10,210 10,180 C30,220 50,250 40,280" fill="currentColor" />
 <path d="M70,180 C40,150 30,100 60,70 C80,110 90,150 70,180" fill="currentColor" opacity="0.9"/>
 </svg>
 </div>

 <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 text-center relative z-10">
 <div className="space-y-3.5 mb-12">
 <span className="text-xs font-mono uppercase tracking-widest text-[#D96B27] font-bold">Unmatched Campus Vibe</span>
 <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#4A3728]">Premium amenities built for luxury living</h2>
 <p className="text-sm text-[#4A3728]/80 max-w-xl mx-auto font-light leading-relaxed">Enjoy modern co-working study capsules, full backup power, and professional daily cleanups.</p>
 <div className="flex items-center justify-center gap-2 mt-4 pt-2">
 <div className="h-px w-12 bg-[#D96B27]/30"></div>
 <Star className="w-3 h-3 text-[#D96B27] fill-[#D96B27]" />
 <div className="h-px w-12 bg-[#D96B27]/30"></div>
 </div>
 </div>

 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
 {MOCK_AMENITIES.slice(0, 8).map((am) => (
 <div
 key={am.id}
 className="group p-5.5 bg-[#FFFCF9] border border-[#F5E2D3] rounded-3xl text-left hover:shadow-xl transition-all hover:-translate-y-1 shadow-sm"
 >
 <div className="w-12 h-12 rounded-2xl bg-[#FDF4EB] flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
 {renderAmenityIcon(am.iconName)}
 </div>
 <h4 className="font-sans font-bold text-base text-[#4A3728] transition-colors">{am.name}</h4>
 <p className="text-xs text-[#4A3728]/70 mt-1.5 font-light leading-relaxed font-sans">{am.description}</p>
 </div>
 ))}
 </div>

 {/* Bottom Banner */}
 <div className="mt-8 p-6 bg-[#FDF6F0] rounded-3xl border border-[#F5E2D3] flex flex-col md:flex-row items-center justify-between gap-6 text-left w-full shadow-sm">
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 rounded-full bg-[#F4DECD] flex items-center justify-center shrink-0">
 <ShieldCheck className="w-7 h-7 text-[#D96B27]" />
 </div>
 <div>
 <h4 className="font-bold text-lg text-[#4A3728]">Safe. Secure. Comfortable.</h4>
 <p className="text-sm text-[#4A3728]/70 mt-0.5">Because every girl deserves a place she can call her second home.</p>
 </div>
 </div>
 <button
 onClick={() => {
 if (!currentUser) setIsAuthOpen(true);
 else setIsVisitModalOpen(true);
 }}
 className="px-6 py-3 bg-[#C65D21] hover:bg-[#a84d1a] transition-all rounded-xl font-bold text-white flex items-center gap-2 shadow-sm whitespace-nowrap cursor-pointer"
 >
 Book Your Visit Today
 <ArrowRight className="w-4 h-4" />
 </button>
 </div>
 </div>
 </section>

 {/* FEATURED ROOMS CAROUSEL */}
 <section className="bg-[#FAF8F5] pb-6" id="rooms">
 <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
 <div className="space-y-3">
 <span className="text-xs font-mono uppercase tracking-widest text-[#D96B27] font-bold">Allocated Suites</span>
 <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#4A3728]">Discover Rooms</h2>
 <p className="text-sm text-[#4A3728]/80 font-light max-w-md">Explore Single, Double and Triple Seater options with high safety biometrics.</p>
 </div>

 <div className="flex flex-wrap items-center gap-4">
 <button
 onClick={() => router.push("/rooms")}
 className="flex items-center gap-2 text-sm font-bold font-sans text-[#D96B27] hover:text-[#a84d1a] transition-colors group cursor-pointer"
 >
 Browse all options
 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
 </button>
 <div className="hidden sm:flex gap-2 ml-2">
 <div className="w-10 h-10 rounded-full border border-[#D9CDBF] flex items-center justify-center text-[#D96B27] cursor-pointer hover:bg-[#F2EAE0] transition-colors">
 <ChevronLeft className="w-5 h-5" />
 </div>
 <div className="w-10 h-10 rounded-full border border-[#D9CDBF] flex items-center justify-center text-[#D96B27] cursor-pointer hover:bg-[#F2EAE0] transition-colors">
 <ChevronRight className="w-5 h-5" />
 </div>
 </div>
 </div>
 </div>

 {/* OVERFLOW TRACK CAROUSEL */}
 <div
 ref={roomsContainerRef}
 className="relative overflow-hidden -mx-4 px-4 py-2 cursor-grab active:cursor-grabbing select-none"
 >
 <motion.div
 ref={roomsInnerRef}
 drag="x"
 dragConstraints={roomsDragConstraints}
 dragElastic={0.1}
 className="flex gap-6 w-max"
 >
 {activeRooms.map((room) => (
 <div
 key={room.id}
 className="flex-shrink-0 w-[300px] sm:w-[350px]"
 >
 <div className="group bg-[#FFFCF9] border border-[#F5E2D3] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all h-full flex flex-col">
 <div className="relative h-56 overflow-hidden flex-shrink-0">
 <img src={room.images[0]} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" referrerPolicy="no-referrer" />
 <div className="absolute top-4 left-4 py-1.5 px-3 bg-[#FFFCF9] shadow-sm text-[10px] uppercase font-bold rounded-lg text-[#D96B27]">
 {room.type}
 </div>
 </div>
 <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
 <div className="space-y-4">
 <div className="flex justify-between items-start gap-2">
 <h4 className="font-sans font-bold text-lg text-[#4A3728] leading-snug">{room.name}</h4>
 <div className="flex items-center text-sm font-bold text-[#D96B27] shrink-0">
 <Star className="w-4 h-4 fill-[#D96B27] text-[#D96B27] mr-1.5" />
 {room.rating}
 </div>
 </div>

 <div className="flex justify-between items-center text-xs text-[#4A3728]/70 border-b border-[#F5E2D3] pb-4">
 <span>Dimension: <strong className="text-[#4A3728]">{room.size}</strong></span>
 <span className="text-[#5C894B] font-bold">{room.availability} Beds Left</span>
 </div>
 </div>

 <div className="flex items-center justify-between pt-2">
 <div>
 <span className="text-[9px] text-[#4A3728]/60 font-bold uppercase tracking-wider block leading-none mb-1">Rent package</span>
 <span className="text-xl font-bold text-[#4A3728]">{room.priceRange || `₹${room.price.toLocaleString("en-IN")}`}</span>
 </div>
 <div className="flex gap-2">
 <button
 onClick={() => router.push(`/rooms/${room.id}`)}
 className="p-2 px-4 bg-white border border-[#D9CDBF] rounded-xl text-xs font-bold hover:bg-[#F2EAE0] text-[#4A3728] cursor-pointer transition-colors"
 >
 Details
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 ))}
 </motion.div>
 </div>
 </div>
 </section>

 {/* VIRTUAL TOUR BANNER SECTION */}
 <section className="bg-[#FAF8F5] pb-6">
 <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
 <div className="relative rounded-[32px] overflow-hidden bg-[#3B2F2F] text-white min-h-[380px] flex items-center p-8 md:p-12 shadow-2xl">
 <div className="absolute inset-0 z-0">
 <img
 src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
 alt="Virtual lobby tour"
 className="w-full h-full object-cover opacity-20 pointer-events-none"
 />
 </div>

 <div className="relative z-10 max-w-xl space-y-6 text-left">
 <span className="py-1 px-3 text-[10px] font-mono tracking-widest bg-[#C65D21] text-white rounded-md font-bold uppercase">
 360° IMMERSIVE INTERACTIVE VR
 </span>
 <div className="space-y-2">
 <h3 className="font-serif font-bold text-3xl leading-tight text-white">Take a virtual walking tour through Comfort PG</h3>
 <p className="text-sm text-white/80 leading-relaxed font-light">Explore bedrooms, organic mess cafeterias, silent study lounges, and biometric lobbies right from your mobile screens.</p>
 </div>
 <div className="flex gap-3">
 <button
 onClick={() => alert("Loading WebGL virtual walkthrough module... please open in new tab if requested.")}
 className="p-3 px-5 bg-[#C65D21] hover:bg-[#a84d1a] transition-all text-sm font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
 >
 <Play className="w-4 h-4 fill-white" />
 Start 3D Tour
 </button>
 <button
 onClick={() => router.push("/rooms")}
 className="p-3 px-5 border border-white/30 hover:bg-white/10 transition-all text-sm font-bold rounded-xl cursor-pointer text-white"
 >
 Reserve Visit
 </button>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* MASONRY GALLERY */}
 <section className="bg-[#FAF8F5] pb-6" id="gallery">
 <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
 <div className="text-center mb-10 space-y-3.5">
 <span className="text-xs font-mono uppercase tracking-widest text-[#D96B27] font-bold font-sans">Campus Portfolio</span>
 <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#4A3728]">Living rooms & common areas gallery</h2>
 </div>

 {/* Gallery category buttons */}
 <div className="flex flex-wrap justify-center gap-2.5 mb-8">
 {["All", "Rooms", "Balcony", "Lobby & Entrance", "Kitchen", "Washroom", "Amenities", "Food Menu"].map((category) => (
 <button
 key={category}
 onClick={() => {
 setGalleryTab(category);
 setIsGalleryExpanded(false);
 }}
 className={`px-5 py-2 text-xs font-bold font-sans rounded-full border transition-all cursor-pointer ${galleryTab === category
 ? "bg-[#C65D21] border-[#C65D21] text-white shadow-sm"
 : "border-[#D9CDBF] text-[#4A3728] hover:bg-[#F2EAE0]"
 }`}
 >
 {category}
 </button>
 ))}
 </div>

 {/* Grid portfolio visual masonry */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 {MOCK_GALLERY.filter(item => galleryTab === "All" ? true : item.category === galleryTab)
 .slice(0, galleryTab === "All" && !isGalleryExpanded ? 8 : undefined)
 .map((item) => (
 <div
 key={item.id}
 onClick={() => setLightboxImg(item.imageUrl)}
 className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#F5E2D3] shadow-sm h-40 md:h-52"
 >
 <img src={item.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" referrerPolicy="no-referrer" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
 <div className="text-left leading-none text-white space-y-1">
 <span className="text-[9px] font-mono tracking-wider uppercase text-[#D96B27] font-bold">{item.category}</span>
 <h5 className="font-sans font-bold text-xs leading-none">{item.title}</h5>
 </div>
 </div>
 </div>
 ))}
 </div>

 {/* Show More Button */}
 {galleryTab === "All" && MOCK_GALLERY.length > 8 && (
 <div className="flex justify-center mt-8">
 <button
 onClick={() => setIsGalleryExpanded(!isGalleryExpanded)}
 className="px-6 py-2.5 bg-[#C65D21] hover:bg-[#a84d1a] hover:scale-105 active:scale-95 text-white text-xs font-bold font-sans rounded-full cursor-pointer shadow-sm transition-all duration-200 flex items-center gap-1.5"
 >
 {isGalleryExpanded ? "Show Less" : "Show More"}
 <ChevronRight className={`w-4 h-4 transition-transform ${isGalleryExpanded ? '-rotate-90' : 'rotate-90'}`} />
 </button>
 </div>
 )}
 </div>

 {/* Lightbox full visual image Popup */}
 <AnimatePresence>
 {lightboxImg && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={() => setLightboxImg(null)}
 className="fixed inset-0 bg-slate-950/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
 id="gallery-lightbox"
 >
 <button onClick={() => setLightboxImg(null)} className="absolute top-4 right-4 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors">
 <X className="w-5 h-5" />
 </button>
 <motion.img
 initial={{ scale: 0.95 }}
 animate={{ scale: 1 }}
 exit={{ scale: 0.95 }}
 src={lightboxImg}
 className="max-w-full max-h-[85vh] rounded-2xl object-contain border border-white/10"
 referrerPolicy="no-referrer"
 />
 </motion.div>
 )}
 </AnimatePresence>
 </section>

 {/* TESTIMONIALS */}
 <section className="bg-[#FAF8F5] pb-6 pt-4 relative overflow-hidden">
        {/* Left Floral Border */}
        <div className="absolute left-0 top-10 h-[150px] w-16 md:w-24 text-[#EBD3C0] pointer-events-none transform -translate-x-1/4 opacity-70">
          <svg viewBox="0 0 200 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M-20,500 Q80,300 150,0" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M10,430 C40,430 60,400 70,360 C40,360 10,390 10,430" fill="currentColor" opacity="0.8"/>
            <path d="M30,350 C70,350 90,310 100,260 C60,260 20,300 30,350" fill="currentColor" />
            <path d="M60,250 C100,250 120,200 130,150 C90,150 50,200 60,250" fill="currentColor" opacity="0.9"/>
            <path d="M100,150 C140,150 150,100 150,50 C110,60 80,110 100,150" fill="currentColor" opacity="0.8"/>
            <path d="M10,380 C-20,360 -30,320 -10,290 C10,320 20,350 10,380" fill="currentColor" opacity="0.7"/>
            <path d="M40,280 C0,260 -10,210 10,180 C30,220 50,250 40,280" fill="currentColor" />
            <path d="M70,180 C40,150 30,100 60,70 C80,110 90,150 70,180" fill="currentColor" opacity="0.9"/>
          </svg>
        </div>
 <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
 <div className="text-center mb-12 space-y-3.5">
 <span className="text-xs font-mono uppercase tracking-widest text-[#D96B27] font-bold">What people say</span>
 <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#4A3728]">Loved by parents and residents</h2>
 </div>

 <div className="relative max-w-4xl mx-auto px-4">
 <AnimatePresence mode="wait">
 <motion.div
 key={testiIndex}
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="bg-[#FFFCF9] border border-[#F5E2D3] p-10 md:p-14 rounded-[32px] shadow-sm text-center space-y-8"
 >
 <div className="flex justify-center text-[#D96B27] gap-1.5 text-lg">
 {Array.from({ length: MOCK_TESTIMONIALS[testiIndex].rating }).map((_, i) => (
 <Star key={i} className="w-5 h-5 fill-[#D96B27]" />
 ))}
 </div>
 <p className="text-base md:text-lg text-[#4A3728]/80 italic font-medium leading-relaxed font-sans">
 "{MOCK_TESTIMONIALS[testiIndex].review}"
 </p>
 <div className="flex flex-col items-center gap-3 pt-2">
 <div>
 <h4 className="font-sans font-bold text-base text-[#4A3728] leading-none">{MOCK_TESTIMONIALS[testiIndex].residentName}</h4>
 <p className="text-[11px] text-[#4A3728]/60 pt-2 font-mono uppercase tracking-wide">Resident, {MOCK_TESTIMONIALS[testiIndex].roomType} ({MOCK_TESTIMONIALS[testiIndex].college})</p>
 </div>
 </div>
 </motion.div>
 </AnimatePresence>

 {/* Testimonial Navs */}
 <div className="flex justify-center gap-4 mt-8">
 <button
 onClick={() => setTestiIndex((prev) => (prev <= 0 ? MOCK_TESTIMONIALS.length - 1 : prev - 1))}
 className="w-10 h-10 rounded-full border border-[#D9CDBF] bg-[#FAF8F5] flex items-center justify-center hover:bg-[#F2EAE0] cursor-pointer text-[#D96B27] transition-colors"
 >
 <ChevronLeft className="w-5 h-5" />
 </button>
 <button
 onClick={() => setTestiIndex((prev) => (prev >= MOCK_TESTIMONIALS.length - 1 ? 0 : prev + 1))}
 className="w-10 h-10 rounded-full border border-[#D9CDBF] bg-[#FAF8F5] flex items-center justify-center hover:bg-[#F2EAE0] cursor-pointer text-[#D96B27] transition-colors"
 >
 <ChevronRight className="w-5 h-5" />
 </button>
 </div>
 </div>
 </div>
 </section>

 {/* PROXIMITY LOCATOR CARD CHANNELS */}
 <section className="bg-[#FAF8F5] pb-6" id="proximity">
 <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
 <div className="text-center mb-10 space-y-3.5">
 <span className="text-xs font-mono uppercase tracking-widest text-[#D96B27] font-bold">Premium Connect</span>
 <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#4A3728]">Nearby landmarks & transit corridors</h2>
 </div>

 <div className="flex justify-center gap-3 mb-10">
 {["Colleges / Universities", "Malls", "Companies"].map((tab) => (
 <button
 key={tab}
 onClick={() => setNearbyActiveTab(tab as any)}
 className={`px-5 py-2.5 text-xs font-bold font-sans rounded-full border transition-all cursor-pointer ${nearbyActiveTab === tab
 ? "bg-[#C65D21] border-[#C65D21] text-white shadow-sm"
 : "border-[#D9CDBF] text-[#4A3728] hover:bg-[#F2EAE0]"
 }`}
 >
 {tab}
 </button>
 ))}
 </div>

 <div className="flex items-center gap-4">
 <div className="hidden md:flex w-10 h-10 shrink-0 rounded-full border border-[#D9CDBF] flex items-center justify-center text-[#D96B27] cursor-pointer hover:bg-[#F2EAE0] transition-colors">
 <ChevronLeft className="w-5 h-5" />
 </div>
 <div
 ref={nearbyContainerRef}
 className="relative overflow-hidden w-full cursor-grab active:cursor-grabbing select-none"
 >
 <motion.div
 ref={nearbyInnerRef}
 drag="x"
 dragConstraints={nearbyDragConstraints}
 dragElastic={0.1}
 className="flex gap-6 w-max"
 >
 {filteredNearbyPlaces.map((place, idx) => (
 <div
 key={idx}
 className="flex-shrink-0 w-[280px] sm:w-[320px]"
 >
 <div className="p-6 bg-[#FFFCF9] border border-[#F5E2D3] rounded-3xl shadow-sm text-left space-y-4 h-full flex flex-col justify-between">
 <div className="space-y-4">
 <div className="w-12 h-12 rounded-xl bg-[#FDF4EB] flex items-center justify-center border border-[#F4E1CE]">
 <Compass className="w-6 h-6 text-[#D96B27]" />
 </div>
 <div>
 <h5 className="font-sans font-bold text-base text-[#4A3728] leading-snug">{place.name}</h5>
 <p className="text-xs text-[#4A3728]/70 pt-1 font-medium">{place.timeByCab} by auto/vehicle</p>
 </div>
 </div>
 <span className="py-1.5 px-3 rounded-full text-[10px] font-bold font-mono bg-[#FDF4EB] text-[#D96B27] w-fit flex items-center gap-1.5 border border-[#F4E1CE]">
 <MapPin className="w-3 h-3" />
 {place.distance} AWAY
 </span>
 </div>
 </div>
 ))}
 </motion.div>
 </div>
 <div className="hidden md:flex w-10 h-10 shrink-0 rounded-full border border-[#D9CDBF] flex items-center justify-center text-[#D96B27] cursor-pointer hover:bg-[#F2EAE0] transition-colors">
 <ChevronRight className="w-5 h-5" />
 </div>
 </div>
 </div>
 </section>

 {/* FAQ SECTION */}
 <section className="bg-[#FAF8F5] pb-6 relative overflow-hidden" id="faq-section">
        {/* Right Floral Border */}
        <div className="absolute right-0 top-10 h-[150px] w-16 md:w-24 text-[#EBD3C0] pointer-events-none transform translate-x-1/4 scale-x-[-1] opacity-70">
          <svg viewBox="0 0 200 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M-20,500 Q80,300 150,0" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M10,430 C40,430 60,400 70,360 C40,360 10,390 10,430" fill="currentColor" opacity="0.8"/>
            <path d="M30,350 C70,350 90,310 100,260 C60,260 20,300 30,350" fill="currentColor" />
            <path d="M60,250 C100,250 120,200 130,150 C90,150 50,200 60,250" fill="currentColor" opacity="0.9"/>
            <path d="M100,150 C140,150 150,100 150,50 C110,60 80,110 100,150" fill="currentColor" opacity="0.8"/>
            <path d="M10,380 C-20,360 -30,320 -10,290 C10,320 20,350 10,380" fill="currentColor" opacity="0.7"/>
            <path d="M40,280 C0,260 -10,210 10,180 C30,220 50,250 40,280" fill="currentColor" />
            <path d="M70,180 C40,150 30,100 60,70 C80,110 90,150 70,180" fill="currentColor" opacity="0.9"/>
          </svg>
        </div>
 <div className="max-w-4xl mx-auto px-6 sm:px-8">
 <div className="text-center mb-10 space-y-3.5">
 <span className="text-xs font-mono uppercase tracking-widest text-[#D96B27] font-bold">We've got you covered</span>
 <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#4A3728]">Frequently Asked Questions</h2>
 </div>

 <div className="flex flex-wrap justify-center gap-3 mb-10">
 {["General", "Safety", "Mess", "Deposit & Rules"].map((tab) => (
 <button
 key={tab}
 onClick={() => {
 setFaqTab(tab);
 setExpandedFaqId(null);
 }}
 className={`px-5 py-2.5 text-xs font-bold font-sans rounded-full border transition-all cursor-pointer ${faqTab === tab
 ? "bg-[#C65D21] border-[#C65D21] text-white shadow-sm"
 : "border-[#D9CDBF] text-[#4A3728] hover:bg-[#F2EAE0]"
 }`}
 >
 {tab === "Mess" ? "Room" : tab === "Deposit & Rules" ? "Deposit & Rules" : tab}
 </button>
 ))}
 </div>

 <div className="space-y-4">
 {MOCK_FAQ.filter(faq => faq.category === faqTab).map((faq) => {
 const isExp = expandedFaqId === faq.id;
 return (
 <div
 key={faq.id}
 className="p-5 bg-[#FFFCF9] border border-[#F5E2D3] rounded-2xl text-left transition-colors cursor-pointer shadow-sm hover:shadow-md"
 onClick={() => setExpandedFaqId(isExp ? null : faq.id)}
 >
 <div className="flex justify-between items-center gap-3">
 <h4 className="font-sans font-bold text-sm text-[#4A3728]">{faq.question}</h4>
 <ChevronRight className={`w-4 h-4 text-[#4A3728]/50 shrink-0 transition-transform duration-300 ${isExp ? "rotate-90" : ""}`} />
 </div>
 <AnimatePresence>
 {isExp && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: "auto" }}
 exit={{ opacity: 0, height: 0 }}
 className="overflow-hidden"
 >
 <p className="text-sm text-[#4A3728]/80 leading-relaxed pt-4 border-t border-[#F5E2D3] mt-4 font-sans font-medium">
 {faq.answer}
 </p>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
 })}
 </div>
 </div>
 </section>

 {/* CONTACT CHANNELS & MAPS SECTIONS */}
 <section className="bg-[#FAF8F5] pb-8" id="contact">
 <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
 <div className="lg:col-span-4 bg-[#FDF6F0] p-8 md:p-10 rounded-[32px] border border-[#F5E2D3] flex flex-col justify-between space-y-8 text-left shadow-sm">
 <div className="space-y-4">
 <span className="text-xs font-mono uppercase tracking-widest text-[#D96B27] font-bold">Campus Location</span>
 <h3 className="font-serif font-bold text-2xl text-[#4A3728] leading-tight">Comfort Girls PG Headquarters</h3>
 </div>

 <div className="space-y-6 font-sans">
 <div className="flex gap-4 items-start">
 <MapPin className="w-5 h-5 text-[#D96B27] shrink-0 mt-0.5" />
 <p className="text-sm text-[#4A3728]/80 leading-relaxed font-medium">
 <a
 href="https://maps.app.goo.gl/QgRkaw7NVeJrFe1YA"
 target="_blank"
 rel="noopener noreferrer"
 className="hover:underline transition-colors"
 >
 A-33, 7th Cross St, Block A, Alpha I, Greater Noida, Uttar Pradesh 201310
 </a>
 </p>
 </div>
 
 <div className="flex gap-4 items-center">
 <Phone className="w-5 h-5 text-[#D96B27] shrink-0" />
 <div className="flex flex-col">
 <span className="text-[10px] font-bold text-[#D96B27] uppercase tracking-wider">Admission Desk</span>
 <span className="text-sm text-[#4A3728] font-bold">+91 7303962274</span>
 </div>
 </div>
 
 <div className="flex gap-4 items-center">
 <Mail className="w-5 h-5 text-[#D96B27] shrink-0" />
 <div className="flex flex-col">
 <span className="text-[10px] font-bold text-[#D96B27] uppercase tracking-wider">Support Helpline</span>
 <span className="text-sm text-[#4A3728] font-bold">contact@comfortgirlspg.live</span>
 </div>
 </div>

 <div className="flex gap-4 items-center">
 <Clock className="w-5 h-5 text-[#D96B27] shrink-0" />
 <div className="flex flex-col">
 <span className="text-[10px] font-bold text-[#D96B27] uppercase tracking-wider">Warden Check In</span>
 <span className="text-sm text-[#4A3728] font-bold">9:00 AM - 8:00 PM Daily</span>
 </div>
 </div>
 </div>
 </div>

 <div className="lg:col-span-8 rounded-[32px] overflow-hidden border border-[#F5E2D3] min-h-[400px] relative shadow-sm">
 <iframe
 src="https://maps.google.com/maps?q=A-33,%207th%20Cross%20St,%20Block%20A,%20Alpha%20I,%20Greater%20Noida,%20Uttar%20Pradesh%20201310&t=&z=15&ie=UTF8&iwloc=&output=embed"
 className="w-full h-full border-none pointer-events-auto"
 allowFullScreen={true}
 loading="lazy"
 referrerPolicy="no-referrer-when-downgrade"
 />
 </div>
 </div>
 </div>
 </section>

 {/* VISIT BOOKING MODAL */}
 <AnimatePresence>
 {isVisitModalOpen && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
 onClick={() => setIsVisitModalOpen(false)}
 />
 
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 20 }}
 className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-2xl z-10 text-left"
 >
 <button
 onClick={() => setIsVisitModalOpen(false)}
 className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
 >
 <X className="w-4 h-4" />
 </button>

 <div className="space-y-4 font-sans">
 <div className="space-y-1">
 <span className="py-1 px-2.5 rounded bg-primary/10 text-primary text-[9px] font-mono font-bold uppercase tracking-wider block w-fit">
 Biometric Safe Visit
 </span>
 <h3 className="font-display font-black text-xl text-slate-900 ">
 Book a Physical PG Visit
 </h3>
 <p className="text-xs text-slate-500 font-light">
 Schedule a site visit to tour our premium girls' paying guest facility.
 </p>
 </div>

 <form onSubmit={handleVisitSubmit} className="space-y-4 text-xs text-slate-700 ">
 <div className="space-y-1">
 <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Visit Date</label>
 <input
 type="date"
 required
 value={visitDate}
 onChange={(e) => setVisitDate(e.target.value)}
 className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-hidden text-slate-800 cursor-pointer"
 />
 </div>

 <div className="space-y-1">
 <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Preferred Time Slot</label>
 <select
 value={visitTime}
 onChange={(e) => setVisitTime(e.target.value)}
 className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-hidden text-slate-800 cursor-pointer"
 >
 <option>09:30 AM - 11:30 AM</option>
 <option>11:30 AM - 01:30 PM</option>
 <option>02:30 PM - 04:30 PM</option>
 <option>04:30 PM - 06:30 PM</option>
 </select>
 </div>

 <div className="space-y-1">
 <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider">Reason for Visit</label>
 <textarea
 required
 rows={3}
 value={visitReason}
 onChange={(e) => setVisitReason(e.target.value)}
 placeholder="e.g. Inspecting single AC suite and checking dining mess hygiene..."
 className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-hidden text-slate-800 resize-none"
 />
 </div>

 <button
 type="submit"
 disabled={isSubmittingVisit}
 className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-display text-xs font-semibold cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20"
 >
 {isSubmittingVisit ? "Scheduling..." : "Schedule Physical Visit"}
 </button>
 </form>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>

 </div>
 );
}
