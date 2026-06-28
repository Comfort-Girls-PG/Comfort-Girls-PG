"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles, ShieldCheck, Fingerprint, UserCheck, HeartPulse, Wifi, Zap, Shirt,
  Dumbbell, BookOpen, ChefHat, Utensils, Droplet, Caravan, Trees, Gamepad2,
  HeartHandshake, Gem, MapPin, Smartphone, Salad, Award, Users, FileText,
  Star, ChevronRight, ChevronLeft, ArrowRight, Play, X, Compass, HelpCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp } from "../context/AppContext";
import { MOCK_AMENITIES, WHY_CHOOSE_US_TIMELINE, DETAILED_NEARBY_PLACES, MOCK_TESTIMONIALS, MOCK_GALLERY, MOCK_FAQ } from "../lib/staticData";

export default function Home() {
  const router = useRouter();
  const { activeRooms, currentUser, setIsAuthOpen } = useApp();

  // Search filters on Hero
  const [filterType, setFilterType] = useState<string>("");
  const [filterBudget, setFilterBudget] = useState<number>(30000);

  // Gallery dynamic states
  const [galleryTab, setGalleryTab] = useState<string>("All");
  const [isGalleryExpanded, setIsGalleryExpanded] = useState<boolean>(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  // FAQ Accordion states
  const [faqTab, setFaqTab] = useState<string>("General");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  // Testimonials slide carousel index
  const [testiIndex, setTestiIndex] = useState<number>(0);

  // Rooms showcase carousel state
  const [roomsCarouselIndex, setRoomsCarouselIndex] = useState<number>(0);
  const [windowWidth, setWindowWidth] = useState<number>(1200);
  const [isRoomsHovered, setIsRoomsHovered] = useState<boolean>(false);

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
  const [nearbyCarouselIndex, setNearbyCarouselIndex] = useState<number>(0);
  const [isNearbyHovered, setIsNearbyHovered] = useState<boolean>(false);

  const filteredNearbyPlaces = DETAILED_NEARBY_PLACES.filter(
    (place) => place.category === nearbyActiveTab
  );
  
  const visibleNearbyCards = windowWidth >= 1280 ? 4 : windowWidth >= 1024 ? 3 : windowWidth >= 640 ? 2 : 1;
  const maxNearbyCarouselIndex = Math.max(0, filteredNearbyPlaces.length - visibleNearbyCards);

  const handleNextNearby = () => {
    setNearbyCarouselIndex((prev) => (prev >= maxNearbyCarouselIndex ? 0 : prev + 1));
  };

  const handlePrevNearby = () => {
    setNearbyCarouselIndex((prev) => (prev <= 0 ? maxNearbyCarouselIndex : prev - 1));
  };

  useEffect(() => {
    setNearbyCarouselIndex(0);
  }, [nearbyActiveTab]);

  // Automatic slide mechanism for Nearby Places carousel
  useEffect(() => {
    if (maxNearbyCarouselIndex <= 0 || isNearbyHovered) return;
    const interval = setInterval(() => {
      setNearbyCarouselIndex((prev) => (prev >= maxNearbyCarouselIndex ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [maxNearbyCarouselIndex, isNearbyHovered]);

  // Dynamic visible cards calculations for rooms carousel
  const visibleCards = windowWidth >= 1024 ? 3 : windowWidth >= 768 ? 2 : 1;
  const maxCarouselIndex = Math.max(0, activeRooms.length - visibleCards);

  // Automatic slide mechanism for Rooms carousel (every 5 seconds, pausing on hover)
  useEffect(() => {
    if (maxCarouselIndex <= 0 || isRoomsHovered) return;
    const interval = setInterval(() => {
      setRoomsCarouselIndex((prev) => (prev >= maxCarouselIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [maxCarouselIndex, isRoomsHovered]);

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

  const handleSearchTrigger = () => {
    router.push(`/rooms?type=${filterType}&budget=${filterBudget}`);
  };

  const handleNextRoom = () => {
    setRoomsCarouselIndex((prev) => (prev >= maxCarouselIndex ? 0 : prev + 1));
  };

  const handlePrevRoom = () => {
    setRoomsCarouselIndex((prev) => (prev <= 0 ? maxCarouselIndex : prev - 1));
  };

  const renderAmenityIcon = (iconName: string) => {
    const props = { className: "w-5 h-5 text-primary shrink-0 transition-transform group-hover:scale-110" };
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

  const renderChooseIcon = (iconName: string) => {
    const props = { className: "w-5 h-5 text-white shrink-0" };
    switch (iconName) {
      case "HeartHandshake": return <HeartHandshake {...props} />;
      case "Gem": return <Gem {...props} />;
      case "MapPin": return <MapPin {...props} />;
      case "Smartphone": return <Smartphone {...props} />;
      case "Salad": return <Salad {...props} />;
      case "Award": return <Award {...props} />;
      case "Users": return <Users {...props} />;
      case "FileText": return <FileText {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/30 pt-16 pb-12 lg:pt-20 lg:pb-14 transition-colors">
        <div className="absolute top-0 right-0 w-[40%] h-[50%] bg-primary/5 rounded-bl-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-12 w-80 h-80 bg-secondary/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Information */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light rounded-full text-[10px] font-black uppercase tracking-wider w-fit"
              >
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                Verified Premium Female Housing
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.12] tracking-tight font-display"
              >
                Find Your Perfect <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-black">
                  Home Away
                </span>{" "}
                From Home
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-slate-500 dark:text-slate-400 text-base md:text-lg max-w-xl font-medium leading-relaxed"
              >
                Safe, comfortable and affordable Girls PG with premium facilities, organic meals, and 24/7 security near your favorite colleges.
              </motion.p>

              {/* SEARCH FILTERS CONTAINER CARD */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="p-5 bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-xl max-w-2xl relative"
                id="search-filter-card"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  
                  {/* sharing category option selection */}
                  <div className="sm:col-span-5 space-y-1 text-left">
                    <label className="block text-[9px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                      Sharing Category
                    </label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full text-xs font-semibold py-2 bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-xl outline-hidden focus:border-primary text-slate-800 dark:text-white cursor-pointer"
                    >
                      <option value="">All Categories</option>
                      <option value="Single Sharing">Single Seater</option>
                      <option value="Double Sharing">Double Seater</option>
                      <option value="Triple Sharing">Triple Seater</option>
                    </select>
                  </div>

                  {/* budget scale selector slider */}
                  <div className="sm:col-span-5 space-y-1 text-left">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                        Max Budget
                      </label>
                      <span className="text-xs font-bold text-primary dark:text-primary-light font-mono leading-none">
                        ₹{filterBudget.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={6000}
                      max={30000}
                      step={1000}
                      value={filterBudget}
                      onChange={(e) => setFilterBudget(Number(e.target.value))}
                      className="w-full accent-primary h-1 bg-slate-100 dark:bg-slate-850 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* search CTA button */}
                  <div className="sm:col-span-2 pt-2 sm:pt-0">
                    <button
                      onClick={handleSearchTrigger}
                      className="w-full py-3.5 sm:py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md shadow-primary/15"
                      id="search-trigger-btn"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-4"
              >
                <button
                  onClick={() => router.push("/rooms")}
                  className="px-8 py-3.5 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary transition-all rounded-2xl font-display font-extrabold text-white flex items-center gap-2 shadow-[0_12px_24px_-6px_rgba(139,92,246,0.3)] cursor-pointer"
                  id="hero-explore-btn"
                >
                  Explore Rooms
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById("faq-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-8 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all rounded-2xl font-display font-extrabold text-slate-800 dark:text-slate-200 shadow-sm cursor-pointer"
                >
                  Book Visit
                </button>
              </motion.div>
            </div>

            {/* Right Column: 3D Bedroom Mockup */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end py-6">
              <div className="absolute top-4 left-4 lg:left-14 w-[280px] h-[360px] sm:w-[320px] sm:h-[420px] bg-gradient-to-br from-primary/15 via-secondary/10 to-transparent rounded-[32px] -rotate-3 -z-10 blur-xs" />

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
                className="bg-white dark:bg-slate-900 p-3 rounded-[32px] shadow-[0_30px_70px_rgba(139,92,246,0.08)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-slate-800 w-[280px] h-[360px] sm:w-[320px] sm:h-[420px] flex flex-col relative overflow-hidden group"
              >
                <div className="w-full h-full rounded-[24px] overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800"
                    alt="Girls PG Luxury Room Showcase"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                </div>

                <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-5 py-4 rounded-2xl shadow-xl border border-white/40 dark:border-slate-800 space-y-1.5 z-10 transition-all group-hover:translate-y-[-2px]">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono font-black uppercase text-slate-400 tracking-wider">
                      Luxury Suite • Premium
                    </span>
                    <span className="bg-primary/12 text-primary dark:bg-primary/30 dark:text-primary-light text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                      Available
                    </span>
                  </div>
                  <h4 className="font-display font-extrabold text-sm text-slate-900 dark:text-white">
                    Single Sharing Room
                  </h4>
                  
                  <div className="flex items-center gap-3 pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[9px] text-slate-500 dark:text-slate-400 font-bold font-sans">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary"></span> AC
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary"></span> Attached Bath
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span> WiFi
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>

          {/* Stats Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-14 text-center">
            <div className="px-4 py-3 bg-primary/4 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-850">
              <h3 className="text-xl md:text-2xl font-black text-primary">{animatedRoomsCount}+</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pt-0.5">Luxury Suites</p>
            </div>
            <div className="px-4 py-3 bg-secondary/4 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-850">
              <h3 className="text-xl md:text-2xl font-black text-secondary">{animatedHappyCount}+</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pt-0.5">Happy Students</p>
            </div>
            <div className="px-4 py-3 bg-amber-500/4 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-850">
              <h3 className="text-xl md:text-2xl font-black text-amber-500">24x7</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-0.5">CCTV & Wardens</p>
            </div>
            <div className="px-4 py-3 bg-emerald-500/4 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-850">
              <h3 className="text-xl md:text-2xl font-black text-emerald-500">4.9 ★</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-0.5">Warden Rating</p>
            </div>
          </div>

        </div>
      </section>

      {/* AMENITIES SECTION */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 text-center" id="amenities">
        <div className="space-y-3.5 mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-secondary font-bold">Unmatched Campus Vibe</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-850 dark:text-white">Premium amenities built for luxury living</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto font-light leading-relaxed">Enjoy modern co-working study capsules, full backup power, and professional daily cleanups.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {MOCK_AMENITIES.slice(0, 8).map((am) => (
            <div
              key={am.id}
              className="group p-5.5 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-3xl text-left hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-2xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                {renderAmenityIcon(am.iconName)}
              </div>
              <h4 className="font-display font-semibold text-sm text-slate-850 dark:text-white group-hover:text-primary transition-colors">{am.name}</h4>
              <p className="text-xs text-slate-450 mt-1.5 font-light leading-relaxed font-sans">{am.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED ROOMS CAROUSEL */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10" id="rooms">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">Allocated Suites</span>
            <h2 className="font-display font-bold text-3xl text-slate-855 dark:text-white">Discover Living Suites</h2>
            <p className="text-sm text-slate-500 font-light max-w-md">Explore Single, Double and Triple Seater options with high safety biometrics.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => router.push("/rooms")}
              className="flex items-center gap-2 text-xs font-bold font-display text-primary hover:text-primary-dark transition-colors group cursor-pointer"
            >
              Browse all options
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevRoom}
                className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-400 cursor-pointer shadow-xs transition-transform"
                aria-label="Previous Suite"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextRoom}
                className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-400 cursor-pointer shadow-xs transition-transform"
                aria-label="Next Suite"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* OVERFLOW TRACK CAROUSEL */}
        <div 
          className="relative overflow-hidden -mx-4 px-4 py-2"
          onMouseEnter={() => setIsRoomsHovered(true)}
          onMouseLeave={() => setIsRoomsHovered(false)}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out gap-6"
            style={{
              transform: `translateX(-${roomsCarouselIndex * (100 / visibleCards)}%)`
            }}
          >
            {activeRooms.map((room) => (
              <div
                key={room.id}
                className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <div className="group bg-white dark:bg-slate-950 border border-slate-250/50 dark:border-slate-800 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all h-full flex flex-col">
                  <div className="relative h-56 overflow-hidden flex-shrink-0">
                    <img src={room.images[0]} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute top-3 left-3 py-1 px-3.5 bg-white/95 dark:bg-slate-900/95 shadow-xs text-[10px] uppercase font-mono font-bold rounded-lg text-primary">
                      {room.type}
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-display font-semibold text-base text-slate-850 dark:text-white leading-snug">{room.name}</h4>
                        <div className="flex items-center text-xs font-mono text-amber-500 shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                          {room.rating}
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs text-slate-500 border-b border-slate-100 dark:border-slate-850 pb-3">
                        <span>Dimension: <strong className="text-slate-800 dark:text-slate-200">{room.size}</strong></span>
                        <span className="text-emerald-500 font-bold">{room.availability} Beds Left</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block leading-none">Rent package</span>
                        <span className="text-lg font-display font-bold text-slate-855 dark:text-white">{room.priceRange || `₹${room.price.toLocaleString("en-IN")}`}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/rooms/${room.id}`)}
                          className="p-2 px-4 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 cursor-pointer transition-colors"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => {
                            if (!currentUser) {
                              setIsAuthOpen(true);
                              return;
                            }
                            router.push(`/bookings?roomId=${room.id}&direct=true`);
                          }}
                          className="p-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-colors"
                        >
                          Book Bed
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US - STARTUP TIMELINE */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-6" id="about">
        <div className="text-center mb-16 space-y-3.5">
          <span className="text-xs font-mono uppercase tracking-widest text-[#f59e0b] font-bold">Proven Performance</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-855 dark:text-white">Why students endorse Comfort PG</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto font-light leading-relaxed">A strategic milestone-timeline demonstrating our administration standard operations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WHY_CHOOSE_US_TIMELINE.slice(0, 6).map((item, index) => (
            <div
              key={item.id}
              className="p-6 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/80 rounded-3xl relative overflow-hidden transition-all hover:scale-[1.01]"
            >
              <div className="absolute top-4 right-4 text-slate-300 dark:text-slate-800/50 font-display font-extrabold text-5xl select-none">
                0{index + 1}
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center mb-4 shadow-md shadow-primary/25">
                {renderChooseIcon(item.iconName)}
              </div>
              <h4 className="font-display font-semibold text-sm text-slate-850 dark:text-white pr-8">{item.title}</h4>
              <p className="text-xs text-slate-455 mt-2.5 font-sans font-light leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VIRTUAL TOUR BANNER SECTION */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="relative rounded-[32px] overflow-hidden bg-slate-950 text-white min-h-[380px] flex items-center p-8 md:p-12 shadow-2xl border border-slate-800">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
              alt="Virtual lobby tour"
              className="w-full h-full object-cover opacity-15 pointer-events-none"
            />
          </div>

          <div className="relative z-10 max-w-xl space-y-6 text-left">
            <span className="py-1 px-3 text-[10px] font-mono tracking-widest bg-emerald-500 text-white rounded-md font-bold uppercase">
              360° IMMERSIVE INTERACTIVE VR
            </span>
            <div className="space-y-2">
              <h3 className="font-display font-bold text-3xl leading-tight">Take a virtual walking tour through Comfort PG</h3>
              <p className="text-sm text-slate-350 leading-relaxed font-light">Explore bedrooms, organic mess cafeterias, silent study lounges, and biometric lobbies right from your mobile screens.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => alert("Loading WebGL virtual walkthrough module... please open in new tab if requested.")}
                className="p-3 px-5 bg-primary hover:bg-primary-dark transition-all text-sm font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-primary/15"
              >
                <Play className="w-4 h-4 fill-white" />
                Start 3D Tour
              </button>
              <button
                onClick={() => router.push("/rooms")}
                className="p-3 px-5 border border-slate-700 hover:bg-slate-800 transition-all text-sm font-semibold rounded-xl cursor-pointer"
              >
                Reserve Visit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MASONRY GALLERY */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10" id="gallery">
        <div className="text-center mb-10 space-y-3.5">
          <span className="text-xs font-mono uppercase tracking-widest text-secondary font-bold font-sans">Campus Portfolio</span>
          <h2 className="font-display font-bold text-3xl text-slate-855 dark:text-white">Living rooms & common areas gallery</h2>
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
              className={`px-4 py-2 text-xs font-medium font-sans rounded-xl border transition-all cursor-pointer ${
                galleryTab === category
                  ? "bg-primary border-primary text-white shadow-md shadow-primary/15"
                  : "border-slate-250 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850"
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
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/40 dark:border-slate-800 shadow-xs h-40 md:h-52"
              >
                <img src={item.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="text-left leading-none text-white space-y-1">
                    <span className="text-[9px] font-mono tracking-wider uppercase text-primary-light font-bold">{item.category}</span>
                    <h5 className="font-display font-medium text-xs leading-none">{item.title}</h5>
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
              className="px-6 py-2.5 bg-primary hover:bg-primary-dark hover:scale-105 active:scale-95 text-white text-xs font-semibold font-sans rounded-xl cursor-pointer shadow-md shadow-primary/10 transition-all duration-200 flex items-center gap-1.5"
            >
              {isGalleryExpanded ? "Show Less" : "Show More"}
            </button>
          </div>
        )}

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
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-3xl">
        <div className="text-center mb-12 space-y-3.5">
          <span className="text-xs font-mono uppercase tracking-widest text-[#ec4899] font-bold">Resident Vocals</span>
          <h2 className="font-display font-bold text-3xl text-slate-855 dark:text-white">Loved by parents and residents</h2>
        </div>

        <div className="relative max-w-4xl mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={testiIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-8 rounded-3xl shadow-sm text-center space-y-6"
            >
              <div className="flex justify-center text-amber-500 gap-1 text-sm">
                {Array.from({ length: MOCK_TESTIMONIALS[testiIndex].rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-sm md:text-base text-slate-650 dark:text-slate-300 italic font-light leading-relaxed">
                "{MOCK_TESTIMONIALS[testiIndex].review}"
              </p>
              <div className="flex flex-col items-center gap-2">
                <img src={MOCK_TESTIMONIALS[testiIndex].residentImage} className="w-12 h-12 rounded-full object-cover border-2 border-primary-light" />
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-850 dark:text-white leading-none">{MOCK_TESTIMONIALS[testiIndex].residentName}</h4>
                  <p className="text-[10px] text-slate-500 pt-1 font-mono">{MOCK_TESTIMONIALS[testiIndex].college} | {MOCK_TESTIMONIALS[testiIndex].roomType}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Testimonial Navs */}
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => setTestiIndex((prev) => (prev <= 0 ? MOCK_TESTIMONIALS.length - 1 : prev - 1))}
              className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer text-slate-500"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTestiIndex((prev) => (prev >= MOCK_TESTIMONIALS.length - 1 ? 0 : prev + 1))}
              className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer text-slate-500"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* PROXIMITY LOCATOR CARD CHANNELS */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10" id="proximity">
        <div className="text-center mb-10 space-y-3.5">
          <span className="text-xs font-mono uppercase tracking-widest text-[#10b981] font-bold">Proximity Channels</span>
          <h2 className="font-display font-bold text-3xl text-slate-855 dark:text-white">Nearby landmarks & transit corridors</h2>
        </div>

        <div className="flex justify-center gap-2.5 mb-8">
          {["Colleges / Universities", "Malls", "Companies"].map((tab) => (
            <button
              key={tab}
              onClick={() => setNearbyActiveTab(tab as any)}
              className={`px-4 py-2 text-xs font-medium font-sans rounded-xl border transition-all cursor-pointer ${
                nearbyActiveTab === tab
                  ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/15"
                  : "border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div 
          className="relative overflow-hidden -mx-4 px-4 py-2"
          onMouseEnter={() => setIsNearbyHovered(true)}
          onMouseLeave={() => setIsNearbyHovered(false)}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out gap-4"
            style={{
              transform: `translateX(-${nearbyCarouselIndex * (100 / visibleNearbyCards)}%)`
            }}
          >
            {filteredNearbyPlaces.map((place, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-12px)] xl:w-[calc(25%-12px)]"
              >
                <div className="p-5 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-3xl shadow-xs text-left space-y-3 h-full flex flex-col justify-between">
                  <div>
                    <h5 className="font-display font-semibold text-sm text-slate-800 dark:text-slate-200 leading-snug">{place.name}</h5>
                    <p className="text-xs text-slate-450 pt-0.5">{place.timeByCab} by cab/scooter</p>
                  </div>
                  <span className="py-1 px-2.5 rounded-lg text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit">
                    {place.distance} away
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-6 sm:px-8" id="faq-section">
        <div className="text-center mb-10 space-y-3.5">
          <span className="text-xs font-mono uppercase tracking-widest text-[#8b5cf6] font-bold">Warden's Desk Help</span>
          <h2 className="font-display font-bold text-3xl text-slate-855 dark:text-white">Frequently Asked Questions</h2>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {["General", "Safety", "Mess", "Booking & Deposit"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setFaqTab(tab);
                setExpandedFaqId(null);
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                faqTab === tab
                  ? "bg-primary border-primary text-white shadow-sm"
                  : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {MOCK_FAQ.filter(faq => faq.category === faqTab).map((faq) => {
            const isExp = expandedFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="p-4 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-2xl text-left transition-colors cursor-pointer"
                onClick={() => setExpandedFaqId(isExp ? null : faq.id)}
              >
                <div className="flex justify-between items-center gap-3">
                  <h4 className="font-display font-semibold text-sm text-slate-850 dark:text-white">{faq.question}</h4>
                  <ChevronRight className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isExp ? "rotate-90" : ""}`} />
                </div>
                <AnimatePresence>
                  {isExp && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-3.5 border-t border-slate-100 dark:border-slate-850/50 mt-2 font-sans font-light">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* CONTACT CHANNELS & MAPS SECTIONS */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-6" id="contact">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          <div className="lg:col-span-4 bg-primary/5 dark:bg-slate-950 p-6 rounded-3xl border border-slate-150 dark:border-slate-800 flex flex-col justify-between space-y-6 text-left">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">Campus Location</span>
              <h3 className="font-display font-bold text-2xl text-slate-850 dark:text-white leading-tight">Comfort Girls PG Headquarters</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light font-sans">
                Plot No. 12, Knowledge Park III, Greater Noida, Uttar Pradesh, 201308
              </p>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400 font-sans">
              <p>📞 Admission Desk: <strong className="text-slate-850 dark:text-white">+91 99001 12233</strong></p>
              <p>✉️ Support Helpline: <strong className="text-slate-850 dark:text-white">admissions@comfortpg.in</strong></p>
              <p>🕒 Warden Check In: <strong className="text-slate-850 dark:text-white">9:00 AM - 8:00 PM Daily</strong></p>
            </div>
          </div>

          <div className="lg:col-span-8 rounded-3xl overflow-hidden border border-slate-250/50 dark:border-slate-800 min-h-[300px] relative">
            {/* Mocked Leaflet/Google Map canvas view */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.6063687355177!2d77.48154101508085!3d28.491334182475453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cc22129532db3%3A0x6b13b41d08e9d3b1!2sKnowledge%20Park%20III%2C%20Greater%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1655974000000!5m2!1sen!2sin"
              className="w-full h-full border-none pointer-events-auto"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>
      </section>

    </div>
  );
}
