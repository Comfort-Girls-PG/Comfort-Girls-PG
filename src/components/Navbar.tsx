"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Menu, X, User, LogOut, LayoutDashboard, Compass, Bell, Check } from "lucide-react";
import { useApp } from "../context/AppContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { apiClient } from "../utils/apiClient";

export default function Navbar() {
 const {
 currentUser: user,
 setCurrentUser,
 logout,
 setIsAuthOpen,
 refreshUserData
 } = useApp();

 const pathname = usePathname();
 const router = useRouter();

 const [isOpen, setIsOpen] = useState(false);
 const [profileOpen, setProfileOpen] = useState(false);
 const [notifOpen, setNotifOpen] = useState(false);

 const notifications = user?.notifications || [];
 const unreadCount = notifications.filter((n: any) => !n.read).length;

 // Refresh notifications when panel opens
 useEffect(() => {
 if (notifOpen && refreshUserData) {
 refreshUserData();
 }
 }, [notifOpen]);

 const handleMarkAllRead = () => {
 apiClient.put<any>("/api/notifications/read", {})
 .then((updatedUser) => {
 if (updatedUser) {
 setCurrentUser(updatedUser);
 }
 })
 .catch((err) => console.warn("Failed to mark notifications as read:", err));
 };

 const navItems = [
 { label: "Home", href: "/", id: "home" },
 { label: "Rooms", href: "/rooms", id: "rooms" },
 { label: "Amenities", href: "/#amenities", id: "amenities" },
 { label: "Gallery", href: "/#gallery", id: "gallery" },
 { label: "FAQs", href: "/#faq-section", id: "faq-section" },
 { label: "About", href: "/#contact", id: "about" },
 ];

 const handleNavClick = (item: { href: string; id: string }) => {
 setIsOpen(false);
 
 if (pathname === "/" && item.href.startsWith("/#")) {
 const id = item.href.substring(2);
 const targetElement = document.getElementById(id);
 if (targetElement) {
 targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
 }
 } else if (item.href === "/") {
 router.push("/");
 if (typeof window !== "undefined") {
 window.scrollTo({ top: 0, behavior: "smooth" });
 }
 } else {
 router.push(item.href);
 }
 };

 const openAuth = () => {
 setIsAuthOpen(true);
 };

 return (
 <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#FFFCF9]/95 via-[#FDF3EA]/95 to-[#EBD1BA]/95 backdrop-blur-md border-b border-[#F5E2D3]">
 <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
 <div className="flex items-center justify-between h-20">
 
 {/* Logo */}
 <div 
 onClick={() => handleNavClick({ href: "/", id: "home" })} 
 className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
 id="logo-brand"
 >
 <div className="w-10 h-10 flex items-center justify-center text-[#D96B27] group-hover:scale-105 transition-transform shrink-0">
 <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M20 40C31.0457 40 40 31.0457 40 20C40 15 38 10.5 34.8 7.2L28.5 13.5C30.1 15.1 31 17.5 31 20C31 26.0751 26.0751 31 20 31C13.9249 31 9 26.0751 9 20C9 13.9249 13.9249 9 20 9C22.5 9 24.9 9.9 26.5 11.5L32.8 5.2C29.5 2 25 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z" fill="#D96B27"/>
 <circle cx="20" cy="20" r="6" fill="#D96B27"/>
 </svg>
 </div>
 <div className="flex items-center gap-1.5">
 <span className="font-sans font-bold text-xl sm:text-2xl text-[#4A3728] tracking-tight">
 Comfort
 </span>
 <span className="font-sans font-bold text-xl sm:text-2xl text-[#D96B27] tracking-tight">
 Girls PG
 </span>
 </div>
 </div>

 {/* Desktop Navigation */}
 <div className="hidden md:flex items-center gap-2">
 {navItems.map((item) => {
 const isActive = pathname === item.href || (pathname === "/" && item.href === "/");
 return (
 <button
 key={item.id}
 onClick={() => handleNavClick(item)}
 className={`relative px-5 py-2 font-sans text-[15px] transition-colors rounded-full cursor-pointer ${
 isActive 
 ? "text-[#D96B27] font-bold bg-[#F9E6D9]" 
 : "text-[#4A3728] font-bold hover:text-[#D96B27]"
 }`}
 id={`nav-${item.id}`}
 >
 {item.label}
 </button>
 );
 })}
 </div>

 {/* Action Items */}
 <div className="hidden md:flex items-center gap-5">
 

 {/* Profile Dropdown or Login */}
 {user ? (
 <div className="flex items-center gap-4">
 
 {/* Notification Bell */}
 <div className="relative">
 <button
 onClick={() => setNotifOpen(!notifOpen)}
 className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-605 transition-colors cursor-pointer relative animate-fade-in"
 aria-label="Notifications"
 >
 <Bell className="w-4 h-4" />
 {unreadCount > 0 && (
 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white " />
 )}
 </button>

 <AnimatePresence>
 {notifOpen && (
 <>
 <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 10 }}
 transition={{ duration: 0.15 }}
 className="absolute right-0 mt-3 w-80 rounded-2xl bg-white border border-slate-150 shadow-2xl z-20 overflow-hidden text-left"
 >
 <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
 <div>
 <h4 className="text-sm font-bold text-slate-900 font-display">Notifications</h4>
 <p className="text-[10px] text-slate-500 font-light font-sans">{unreadCount} unread notices</p>
 </div>
 {unreadCount > 0 && (
 <button
 onClick={handleMarkAllRead}
 className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline font-mono cursor-pointer"
 >
 <Check className="w-3 h-3" /> Mark all read
 </button>
 )}
 </div>

 <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 ">
 {notifications.length === 0 ? (
 <div className="p-6 text-center text-slate-400 font-light text-xs space-y-1">
 <Bell className="w-6 h-6 mx-auto text-slate-300 mb-1" />
 <p className="font-medium">All caught up!</p>
 <p className="text-[10px]">No new updates to show right now.</p>
 </div>
 ) : (
 notifications.map((notif: any) => (
 <div
 key={notif.id}
 className={`p-4 transition-colors text-xs font-sans space-y-1 ${
 !notif.read 
 ? "bg-primary/3 border-l-2 border-primary" 
 : "hover:bg-slate-50/50 "
 }`}
 >
 <div className="flex justify-between items-start gap-2">
 <span className="font-bold text-slate-850 leading-tight">
 {notif.title}
 </span>
 <span className="text-[9px] font-mono text-slate-400 shrink-0">
 {notif.date}
 </span>
 </div>
 <p className="text-slate-500 font-light leading-relaxed">
 {notif.message}
 </p>
 </div>
 ))
 )}
 </div>
 </motion.div>
 </>
 )}
 </AnimatePresence>
 </div>

 {/* Profile dropdown */}
 <div className="relative">
 <button
 onClick={() => setProfileOpen(!profileOpen)}
 className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
 id="profile-dropdown-btn"
 >
 <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
 {user.name.charAt(0).toUpperCase()}
 </div>
 <div className="text-left leading-tight hidden lg:block">
 <p className="text-xs font-semibold text-slate-800 ">{user.name}</p>
 <p className="text-[9px] font-mono text-slate-505">{user.status}</p>
 </div>
 </button>

 <AnimatePresence>
 {profileOpen && (
 <>
 <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 transition={{ duration: 0.1 }}
 className="absolute right-0 mt-2 w-54 rounded-2xl bg-white border border-slate-150 shadow-xl z-20 overflow-hidden"
 >
 <div className="p-4 border-b border-slate-100 bg-slate-50/50 ">
 <p className="text-sm font-semibold text-slate-900 leading-none mb-1">{user.name}</p>
 <p className="text-xs text-slate-500 truncate">{user.email}</p>
 </div>
 <div className="p-2">
 {user.status !== "Admin" ? (
 <Link
 href="/dashboard"
 onClick={() => setProfileOpen(false)}
 className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left font-display cursor-pointer"
 >
 <LayoutDashboard className="w-4 h-4 text-primary" />
 My Dashboard
 </Link>
 ) : (
 <Link
 href="/admin"
 onClick={() => setProfileOpen(false)}
 className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left font-display cursor-pointer"
 >
 <Compass className="w-4 h-4 text-emerald-500" />
 Warden Admin view
 </Link>
 )}

 <button
 onClick={() => {
 setProfileOpen(false);
 logout();
 router.push("/");
 }}
 className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left font-display cursor-pointer"
 >
 <LogOut className="w-4 h-4" />
 Sign Out
 </button>
 </div>
 </motion.div>
 </>
 )}
 </AnimatePresence>
 </div>
 </div>
 ) : (
 <div className="flex items-center gap-4">
 <button
 onClick={openAuth}
 className="font-display text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
 id="nav-login-btn"
 >
 Login
 </button>
 <Link
 href="/rooms"
 className="px-6 py-2.5 bg-[#D96B27] hover:bg-[#C65D21] transition-all rounded-full font-sans text-sm font-semibold text-white cursor-pointer shadow-sm hover:shadow-md"
 id="nav-book-now"
 >
 Book Now
 </Link>
 </div>
 )}
 </div>

 {/* Mobile hamburger menu */}
 <div className="flex md:hidden items-center gap-3">
 {user && (
 <div className="relative">
 <button
 onClick={() => setNotifOpen(!notifOpen)}
 className="p-2.5 rounded-xl border border-slate-200 text-slate-650 hover:bg-slate-105 transition-colors cursor-pointer relative"
 aria-label="Notifications"
 >
 <Bell className="w-4 h-4" />
 {unreadCount > 0 && (
 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white " />
 )}
 </button>

 {/* Notifications Dropdown Panel for mobile */}
 <AnimatePresence>
 {notifOpen && (
 <>
 <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 5 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 5 }}
 transition={{ duration: 0.15 }}
 className="absolute right-[-48px] mt-3 w-76 rounded-2xl bg-white border border-slate-150 shadow-2xl z-20 overflow-hidden text-left"
 >
 <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
 <div>
 <h4 className="text-sm font-bold text-slate-900 font-display">Notifications</h4>
 <p className="text-[10px] text-slate-500 font-light font-sans">{unreadCount} unread notices</p>
 </div>
 {unreadCount > 0 && (
 <button
 onClick={handleMarkAllRead}
 className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline font-mono cursor-pointer"
 >
 <Check className="w-3 h-3" /> Mark all read
 </button>
 )}
 </div>

 <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 ">
 {notifications.length === 0 ? (
 <div className="p-6 text-center text-slate-400 font-light text-xs space-y-1">
 <Bell className="w-5 h-5 mx-auto text-slate-300 mb-1" />
 <p className="font-medium">All caught up!</p>
 <p className="text-[10px]">No new updates to show right now.</p>
 </div>
 ) : (
 notifications.map((notif: any) => (
 <div
 key={notif.id}
 className={`p-4 transition-colors text-xs font-sans space-y-1 ${
 !notif.read 
 ? "bg-primary/3 border-l-2 border-primary" 
 : "hover:bg-slate-50/50 "
 }`}
 >
 <div className="flex justify-between items-start gap-2">
 <span className="font-bold text-slate-850 leading-tight">
 {notif.title}
 </span>
 <span className="text-[9px] font-mono text-slate-400 shrink-0">
 {notif.date}
 </span>
 </div>
 <p className="text-slate-500 font-light leading-relaxed">
 {notif.message}
 </p>
 </div>
 ))
 )}
 </div>
 </motion.div>
 </>
 )}
 </AnimatePresence>
 </div>
 )}

 <button
 onClick={() => setIsOpen(!isOpen)}
 className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
 aria-label="Toggle navigation drawer"
 id="mobile-menu-btn"
 >
 {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
 </button>
 </div>

 </div>
 </div>

 {/* Mobile Drawer */}
 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: "auto" }}
 exit={{ opacity: 0, height: 0 }}
 transition={{ duration: 0.2 }}
 className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3"
 >
 {navItems.map((item) => {
 const isActive = pathname === item.href || (pathname === "/" && item.href === "/");
 return (
 <button
 key={item.id}
 onClick={() => handleNavClick(item)}
 className={`block w-full text-left px-4 py-3 font-display font-medium rounded-xl text-base cursor-pointer ${
 isActive
 ? "bg-[#6366f1]/5 text-[#6366f1] font-bold"
 : "text-slate-600 hover:bg-slate-50 "
 }`}
 >
 {item.label}
 </button>
 );
 })}

 <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
 <Link
 href="/rooms"
 onClick={() => setIsOpen(false)}
 className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-display font-semibold transition-colors text-center block shadow-lg shadow-primary/15"
 >
 Book Now
 </Link>

 {user ? (
 <div className="space-y-2">
 <div className="flex items-center gap-3 px-4 py-2">
 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border-2 border-primary/20">
 {user.name.charAt(0).toUpperCase()}
 </div>
 <div>
 <p className="font-semibold text-slate-800 leading-none">{user.name}</p>
 <p className="text-xs text-slate-500">{user.status}</p>
 </div>
 </div>
 {user.status !== "Admin" ? (
 <Link
 href="/dashboard"
 onClick={() => setIsOpen(false)}
 className="flex items-center gap-3 w-full px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl font-display cursor-pointer"
 >
 <LayoutDashboard className="w-5 h-5 text-primary" />
 My Dashboard
 </Link>
 ) : (
 <Link
 href="/admin"
 onClick={() => setIsOpen(false)}
 className="flex items-center gap-3 w-full px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl font-display cursor-pointer"
 >
 <Compass className="w-5 h-5 text-emerald-500" />
 Warden Panel
 </Link>
 )}
 <button
 onClick={() => {
 logout();
 router.push("/");
 setIsOpen(false);
 }}
 className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-display cursor-pointer"
 >
 <LogOut className="w-5 h-5" />
 Sign Out
 </button>
 </div>
 ) : (
 <button
 onClick={() => {
 setIsOpen(false);
 openAuth();
 }}
 className="w-full py-3.5 border border-slate-200 text-slate-800 hover:bg-slate-50 rounded-xl font-display font-semibold transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
 >
 <User className="w-4 h-4" />
 Account Login
 </button>
 )}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </nav>
 );
}
