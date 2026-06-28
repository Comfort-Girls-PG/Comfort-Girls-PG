"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion } from "motion/react";
import { Star, Eye, ShieldCheck, Zap, HeartPulse, Sparkles, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "../../context/AppContext";
import { Room } from "../../types";

function RoomsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeRooms, currentUser, setIsAuthOpen } = useApp();

  // Load parameters
  const initialType = searchParams.get("type") || "";
  const initialBudget = searchParams.get("budget") ? Number(searchParams.get("budget")) : 30000;

  const [filterType, setFilterType] = useState<string>(initialType);
  const [filterBudget, setFilterBudget] = useState<number>(initialBudget);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (searchParams.get("type")) {
      setFilterType(searchParams.get("type") || "");
    }
    if (searchParams.get("budget")) {
      setFilterBudget(Number(searchParams.get("budget")));
    }
  }, [searchParams]);

  // Filter logic
  const filteredRooms = activeRooms.filter((room) => {
    const matchesType = filterType ? room.type === filterType : true;
    const matchesBudget = room.price <= filterBudget;
    const matchesSearch = searchTerm
      ? room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.amenities.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    return matchesType && matchesBudget && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10 space-y-12">
      
      {/* Header and Back link */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-8 text-left">
        <div className="space-y-2">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white">
            Available PG Suites
          </h1>
          <p className="text-sm text-slate-500 max-w-xl font-light">
            Each suite features biometric secure entry locks, private wardrobes, high-velocity cooling systems, and full organic nutritional meal subscriptions.
          </p>
        </div>
        <div className="bg-primary/5 text-primary text-xs font-bold font-mono px-4 py-2.5 rounded-2xl border border-primary/10">
          Showing {filteredRooms.length} of {activeRooms.length} available layouts
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="p-6 bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/50 dark:border-slate-800 shadow-sm text-left">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          
          {/* Search Term input */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
              Search features
            </label>
            <input
              type="text"
              placeholder="e.g. AC, Attached Bath, study"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs font-semibold px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-xl outline-hidden focus:border-primary text-slate-800 dark:text-white"
            />
          </div>

          {/* Sharing configuration */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
              Sharing Preference
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full text-xs font-semibold px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-xl outline-hidden focus:border-primary text-slate-800 dark:text-white cursor-pointer"
            >
              <option value="">All sharing layouts</option>
              <option value="Single Sharing">Single Seater</option>
              <option value="Double Sharing">Double Seater</option>
              <option value="Triple Sharing">Triple Seater</option>
            </select>
          </div>

          {/* Budget filter slider */}
          <div className="md:col-span-4 space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                Max Monthly Budget
              </label>
              <span className="text-xs font-bold text-primary font-mono">
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

        </div>
      </div>

      {/* SUITES DISPLAY GRID */}
      {filteredRooms.length === 0 ? (
        <div className="py-20 bg-slate-50/50 dark:bg-slate-950/20 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-4">
          <SlidersHorizontal className="w-12 h-12 text-slate-350 mx-auto animate-pulse" />
          <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">
            No suites match your exact search criteria
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting sharing layouts, searching for more generic terms like "Meal", or shifting your budget threshold.
          </p>
          <button
            onClick={() => {
              setFilterType("");
              setFilterBudget(30000);
              setSearchTerm("");
            }}
            className="px-5 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <motion.div
              layout
              key={room.id}
              className="group bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between h-full"
            >
              {/* Image Header */}
              <div className="relative h-60 overflow-hidden flex-shrink-0">
                <img
                  src={room.images[0]}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/95 py-1 px-3 text-[10px] font-mono font-bold rounded-lg text-primary shadow-xs uppercase">
                  {room.type}
                </div>
                {room.availability <= 2 && (
                  <div className="absolute top-4 right-4 bg-rose-500 text-white py-1 px-3 text-[10px] font-bold rounded-lg shadow-xs animate-pulse">
                    Selling out fast!
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-5">
                <div className="space-y-3.5 text-left">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-display font-bold text-base text-slate-850 dark:text-white leading-snug group-hover:text-primary transition-colors">
                      {room.name}
                    </h3>
                    <div className="flex items-center text-xs font-mono text-amber-500 shrink-0 bg-amber-500/5 dark:bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/10">
                      <Star className="w-3.5 h-3.5 fill-amber-500 mr-1 text-amber-500" />
                      {room.rating}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light line-clamp-2 leading-relaxed">
                    {room.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-slate-100 dark:border-slate-850 text-xs text-slate-500 font-light">
                    <div>
                      Size: <strong className="text-slate-700 dark:text-slate-200 font-semibold">{room.size}</strong>
                    </div>
                    <div className="text-right">
                      Availability: <strong className="text-emerald-500 font-bold">{room.availability} Beds left</strong>
                    </div>
                  </div>

                  {/* Amenities Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {room.amenities.slice(0, 4).map((am, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-mono font-medium px-2 py-0.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-md"
                      >
                        {am}
                      </span>
                    ))}
                    {room.amenities.length > 4 && (
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-primary/5 text-primary dark:text-primary-light rounded-md">
                        +{room.amenities.length - 4} More
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer pricing */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-900">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Rent Package</span>
                    <strong className="text-lg font-display font-extrabold text-slate-850 dark:text-white">
                      ₹{room.price.toLocaleString("en-IN")}
                      <span className="text-xs text-slate-400 font-light"> / mo</span>
                    </strong>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/rooms/${room.id}`)}
                      className="p-2.5 px-3.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (!currentUser) {
                          setIsAuthOpen(true);
                          return;
                        }
                        router.push(`/bookings?roomId=${room.id}&direct=true`);
                      }}
                      className="p-2.5 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                    >
                      Book Bed
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}

export default function RoomsPage() {
  return (
    <Suspense fallback={
      <div className="py-24 text-center text-slate-500 font-sans text-xs">
        Preparing available suites catalog and real-time vacancies...
      </div>
    }>
      <RoomsContent />
    </Suspense>
  );
}
