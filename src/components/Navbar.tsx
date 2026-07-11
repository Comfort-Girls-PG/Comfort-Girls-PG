"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Menu, X, Sun, Moon, User, LogOut, LayoutDashboard, Compass, Bell, Check } from "lucide-react";
import { useApp } from "../context/AppContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { apiClient } from "../utils/apiClient";

export default function Navbar() {
  const {
    currentUser: user,
    setCurrentUser,
    logout,
    isDark,
    setIsDark,
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
    <nav className="sticky top-0 z-50 w-full bg-[#FAFAFD]/90 backdrop-blur-md border-b border-slate-100 dark:bg-slate-900/90 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => handleNavClick({ href: "/", id: "home" })} 
            className="flex items-center gap-3 cursor-pointer group"
            id="logo-brand"
          >
            <img 
              src="/favicon.svg" 
              alt="Comfort Girls PG Logo" 
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" 
              referrerPolicy="no-referrer"
            />
            <div className="flex items-center font-display font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white leading-none">
              <span>Comfort</span>
              <span className="text-[#8B5CF6] font-bold ml-1">Girls PG</span>
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
                  className={`relative px-4 py-2 font-display text-sm font-medium transition-colors rounded-full cursor-pointer ${
                    isActive 
                      ? "text-[#8B5CF6] font-semibold" 
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  }`}
                  id={`nav-${item.id}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-[#8B5CF6]/5 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Action Items */}
          <div className="hidden md:flex items-center gap-5">
            
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-slate-150 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer"
              aria-label="Toggle theme"
              id="theme-toggler"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-violet-600" />}
            </button>

            {/* Profile Dropdown or Login */}
            {user ? (
              <div className="flex items-center gap-4">
                
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-605 dark:text-slate-300 transition-colors cursor-pointer relative animate-fade-in"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-900" />
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
                          className="absolute right-0 mt-3 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 shadow-2xl z-20 overflow-hidden text-left"
                        >
                          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">Notifications</h4>
                              <p className="text-[10px] text-slate-500 font-light font-sans">{unreadCount} unread notices</p>
                            </div>
                            {unreadCount > 0 && (
                              <button
                                onClick={handleMarkAllRead}
                                className="flex items-center gap-1 text-[10px] font-bold text-primary dark:text-primary-light hover:underline font-mono cursor-pointer"
                              >
                                <Check className="w-3 h-3" /> Mark all read
                              </button>
                            )}
                          </div>

                          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
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
                                      ? "bg-primary/3 dark:bg-primary/5 border-l-2 border-primary" 
                                      : "hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                                  }`}
                                >
                                  <div className="flex justify-between items-start gap-2">
                                    <span className="font-bold text-slate-850 dark:text-white leading-tight">
                                      {notif.title}
                                    </span>
                                    <span className="text-[9px] font-mono text-slate-400 shrink-0">
                                      {notif.date}
                                    </span>
                                  </div>
                                  <p className="text-slate-500 dark:text-slate-400 font-light leading-relaxed">
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
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    id="profile-dropdown-btn"
                  >
                    <img
                      src={user.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover border border-primary/20"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-left leading-tight hidden lg:block">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{user.name}</p>
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
                          className="absolute right-0 mt-2 w-54 rounded-2xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 shadow-xl z-20 overflow-hidden"
                        >
                          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none mb-1">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                          </div>
                          <div className="p-2">
                            {user.status !== "Admin" ? (
                              <Link
                                href="/dashboard"
                                onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left font-display cursor-pointer"
                              >
                                <LayoutDashboard className="w-4 h-4 text-primary" />
                                My Dashboard
                              </Link>
                            ) : (
                              <Link
                                href="/admin"
                                onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left font-display cursor-pointer"
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
                              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors text-left font-display cursor-pointer"
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
                  className="font-display text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
                  id="nav-login-btn"
                >
                  Login
                </button>
                <Link
                  href="/rooms"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] hover:shadow-[0_8px_20px_rgba(139,92,246,0.3)] transition-all rounded-full font-display text-sm font-semibold text-white cursor-pointer"
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
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-300 hover:bg-slate-105 transition-colors cursor-pointer relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-900" />
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
                        className="absolute right-[-48px] mt-3 w-76 rounded-2xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 shadow-2xl z-20 overflow-hidden text-left"
                      >
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">Notifications</h4>
                            <p className="text-[10px] text-slate-500 font-light font-sans">{unreadCount} unread notices</p>
                          </div>
                          {unreadCount > 0 && (
                            <button
                              onClick={handleMarkAllRead}
                              className="flex items-center gap-1 text-[10px] font-bold text-primary dark:text-primary-light hover:underline font-mono cursor-pointer"
                            >
                              <Check className="w-3 h-3" /> Mark all read
                            </button>
                          )}
                        </div>

                        <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
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
                                    ? "bg-primary/3 dark:bg-primary/5 border-l-2 border-primary" 
                                    : "hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                                }`}
                              >
                                <div className="flex justify-between items-start gap-2">
                                  <span className="font-bold text-slate-850 dark:text-white leading-tight">
                                    {notif.title}
                                  </span>
                                  <span className="text-[9px] font-mono text-slate-400 shrink-0">
                                    {notif.date}
                                  </span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 font-light leading-relaxed">
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
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-violet-600" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
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
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-3"
          >
             {navItems.map((item) => {
               const isActive = pathname === item.href || (pathname === "/" && item.href === "/");
               return (
                 <button
                   key={item.id}
                   onClick={() => handleNavClick(item)}
                   className={`block w-full text-left px-4 py-3 font-display font-medium rounded-xl text-base cursor-pointer ${
                     isActive
                       ? "bg-[#6366f1]/5 text-[#6366f1] dark:bg-[#6366f1]/10 font-bold"
                       : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                   }`}
                 >
                   {item.label}
                 </button>
               );
             })}

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
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
                    <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white leading-none">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.status}</p>
                    </div>
                  </div>
                  {user.status !== "Admin" ? (
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 w-full px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-display cursor-pointer"
                    >
                      <LayoutDashboard className="w-5 h-5 text-primary" />
                      My Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 w-full px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-display cursor-pointer"
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
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl font-display cursor-pointer"
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
                  className="w-full py-3.5 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 rounded-xl font-display font-semibold transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
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
