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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#F5E2D3] pb-8 text-left">
        <div className="space-y-2">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A3728]/60 hover:text-[#D96B27] transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#4A3728]">
            Available PG Rooms
          </h1>
          <p className="text-sm text-[#4A3728]/70 max-w-xl font-medium">
            Each suite features biometric secure entry locks, private wardrobes, high-velocity cooling systems, and full organic nutritional meal subscriptions.
          </p>
        </div>
        <div className="bg-[#F5E2D3] text-[#D96B27] text-xs font-bold font-mono px-4 py-2.5 rounded-2xl border border-[#D96B27]/20">
          Showing {filteredRooms.length} of {activeRooms.length} available layouts
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="p-6 bg-[#FFFCF9] rounded-3xl border border-[#F5E2D3] shadow-sm text-left">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          
          {/* Search Term input */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="block text-[10px] font-mono font-bold uppercase text-[#4A3728]/50 tracking-wider">
              Search features
            </label>
            <input
              type="text"
              placeholder="e.g. AC, Attached Bath, study"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs font-semibold px-4 py-3 bg-[#FAF8F5] border border-[#F5E2D3] rounded-xl outline-hidden focus:border-[#D96B27] text-[#4A3728]"
            />
          </div>

          {/* Sharing configuration */}
          <div className="md:col-span-4 space-y-1.5">
            <label className="block text-[10px] font-mono font-bold uppercase text-[#4A3728]/50 tracking-wider">
              Sharing Preference
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full text-xs font-semibold px-4 py-3 bg-[#FAF8F5] border border-[#F5E2D3] rounded-xl outline-hidden focus:border-[#D96B27] text-[#4A3728] cursor-pointer"
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
              <label className="text-[10px] font-mono font-bold uppercase text-[#4A3728]/50 tracking-wider">
                Max Monthly Budget
              </label>
              <span className="text-xs font-bold text-[#D96B27] font-mono">
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
              className="w-full accent-[#D96B27] h-1 bg-[#F5E2D3] rounded-lg cursor-pointer"
            />
          </div>

        </div>
      </div>

      {/* SUITES DISPLAY GRID */}
      {filteredRooms.length === 0 ? (
        <div className="py-20 bg-[#FDF6F0] rounded-3xl border border-dashed border-[#D96B27]/30 text-center space-y-4">
          <SlidersHorizontal className="w-12 h-12 text-[#D96B27]/50 mx-auto animate-pulse" />
          <h3 className="font-serif font-bold text-lg text-[#4A3728]">
            No suites match your exact search criteria
          </h3>
          <p className="text-xs text-[#4A3728]/70 max-w-sm mx-auto">
            Try resetting sharing layouts, searching for more generic terms like "Meal", or shifting your budget threshold.
          </p>
          <button
            onClick={() => {
              setFilterType("");
              setFilterBudget(30000);
              setSearchTerm("");
            }}
            className="px-5 py-2 bg-[#D96B27] hover:bg-[#C65D21] text-white text-xs font-semibold rounded-xl cursor-pointer"
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
              className="group bg-[#FFFCF9] border border-[#F5E2D3] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between h-full"
            >
              {/* Image Header */}
              <div className="relative h-60 overflow-hidden flex-shrink-0">
                <img
                  src={room.images[0]}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-[#FAF8F5] py-1.5 px-3 text-[10px] font-sans font-bold rounded-lg text-[#D96B27] shadow-sm uppercase tracking-wider">
                  {room.type}
                </div>
                {room.availability <= 2 && (
                  <div className="absolute top-4 right-4 bg-rose-500 text-white py-1 px-3 text-[10px] font-bold rounded-lg shadow-xs animate-pulse">
                    Selling out fast!
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div className="space-y-4 text-left">
                  <div className="flex justify-between items-center gap-2">
                    <h3 className="font-sans font-bold text-lg text-[#4A3728] leading-snug group-hover:text-[#D96B27] transition-colors">
                      {room.name}
                    </h3>
                    <div className="flex items-center text-sm font-bold text-[#D96B27] shrink-0">
                      <Star className="w-4 h-4 fill-[#D96B27] mr-1.5" />
                      {room.rating}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs font-sans">
                    <div className="text-[#4A3728]/60 font-semibold">
                      Dimension: <strong className="text-[#4A3728]">{room.size}</strong>
                    </div>
                    <div className="text-[#2F7E41] font-bold">
                      {room.availability} Beds Left
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-5 border-t border-[#F5E2D3]/70">
                  <div className="text-left mb-4">
                    <span className="text-[9px] text-[#4A3728]/60 font-bold uppercase tracking-widest block mb-1">Rent Package</span>
                    <strong className="text-xl font-sans font-bold text-[#4A3728]">
                      ₹{room.price.toLocaleString("en-IN")}
                    </strong>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => router.push(`/rooms/${room.id}`)}
                      className="px-6 py-2 bg-transparent border border-[#D96B27] rounded-xl text-sm font-bold hover:bg-[#F9E8DC] text-[#4A3728] transition-colors cursor-pointer"
                    >
                      Details
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
