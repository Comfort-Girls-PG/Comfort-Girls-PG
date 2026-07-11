"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User, Phone, GraduationCap, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import { useApp } from "../context/AppContext";
import { apiClient } from "../utils/apiClient";
import { UserSession } from "../types";

type AuthTab = "login" | "register" | "forgot" | "otp" | "link-sent";

export default function AuthPages() {
  const {
    isAuthOpen: isOpen,
    setIsAuthOpen,
    setCurrentUser,
  } = useApp();

  const onClose = () => setIsAuthOpen(false);

  const [tab, setTab] = useState<AuthTab>("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [college, setCollege] = useState("");
  const [otpCode, setOtpCode] = useState(["", "", "", ""]);
  const [errorMsg, setErrorMsg] = useState("");
  const [otpTimer, setOtpTimer] = useState(59);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [debugOtp, setDebugOtp] = useState<string | null>(null);
  const [debugLink, setDebugLink] = useState<string | null>(null);
  const [otpMode, setOtpMode] = useState<"register" | "forgot">("register");
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [diagResult, setDiagResult] = useState<{
    backendOk: boolean;
    dbConnected: boolean;
    dbMode: string;
    dbConfigured: boolean;
    checking: boolean;
    error: string | null;
  } | null>(null);

  const runDiagnostics = async () => {
    setDiagResult({
      backendOk: false,
      dbConnected: false,
      dbMode: "None",
      dbConfigured: false,
      checking: true,
      error: null
    });
    try {
      const res = await fetch("/api/db-status");
      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }
      const data = await res.json();
      setDiagResult({
        backendOk: true,
        dbConnected: !!data.connected,
        dbMode: data.mode || "PostgreSQL",
        dbConfigured: !!data.configured,
        checking: false,
        error: null
      });
    } catch (err: any) {
      setDiagResult({
        backendOk: false,
        dbConnected: false,
        dbMode: "None",
        dbConfigured: false,
        checking: false,
        error: err.message || "Failed to reach backend."
      });
    }
  };

  const handleAutofillDebugOtp = () => {
    if (debugOtp && debugOtp.length === 4) {
      setOtpCode([debugOtp[0], debugOtp[1], debugOtp[2], debugOtp[3]]);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (tab === "otp" && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [tab, otpTimer]);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (tab === "login") {
      if (!email.includes("@")) {
        setErrorMsg("Please provide a valid student or institutional email.");
        return;
      }
      if (password.length < 4) {
        setErrorMsg("Passcodes must contain at least 4 characters.");
        return;
      }

      try {
        const result = await apiClient.post<{ token: string; user: UserSession }>("/api/auth/login", {
          email,
          password
        });
        localStorage.setItem("comfort_pg_token", result.token);
        setCurrentUser(result.user);
        onClose();
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to authenticate credentials.");
      }
    } else if (tab === "register") {
      if (!email || !name || !phone || !college || !password) {
        setErrorMsg("All registration fields including password are required.");
        return;
      }

      if (password.length < 4) {
        setErrorMsg("Passcode must contain at least 4 characters.");
        return;
      }

      const cleanPhone = phone.replace(/[^0-9]/g, "");
      if (cleanPhone.length !== 10) {
        setErrorMsg("Mobile number must be a valid 10-digit number.");
        return;
      }

      setIsSendingOtp(true);
      setDebugLink(null);
      setErrorMsg("");

      try {
        const res = await apiClient.post<{ success: boolean; message: string; debugLink?: string }>("/api/auth/register", {
          name,
          email,
          password,
          phone,
          college
        });
        if (res && res.debugLink) {
          setDebugLink(res.debugLink);
        }
        setTab("link-sent");
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to submit registration request.");
      } finally {
        setIsSendingOtp(false);
      }
    } else if (tab === "forgot") {
      if (!email) {
        setErrorMsg("Please key in your registered email Address.");
        return;
      }

      setIsSendingOtp(true);
      setDebugOtp(null);
      setErrorMsg("");

      try {
        const res = await apiClient.post<{ success: boolean; message: string; debugOtp?: string }>("/api/auth/send-otp", {
          email,
          name: "Resident",
          purpose: "forgot"
        });
        if (res && res.debugOtp) {
          setDebugOtp(res.debugOtp);
        }
        setOtpCode(["", "", "", ""]);
        setOtpTimer(59);
        setOtpMode("forgot");
        setTab("otp");
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to dispatch recovery PIN.");
      } finally {
        setIsSendingOtp(false);
      }
    }
  };

  const handleResendOtp = async () => {
    setErrorMsg("");
    setDebugOtp(null);
    setIsSendingOtp(true);
    try {
      const res = await apiClient.post<{ success: boolean; message: string; debugOtp?: string }>("/api/auth/send-otp", {
        email,
        name: name || "Student",
        purpose: otpMode
      });
      if (res && res.debugOtp) {
        setDebugOtp(res.debugOtp);
      }
      setOtpCode(["", "", "", ""]);
      setOtpTimer(59);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to resend validation PIN.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtpSubmit = async () => {
    const fullCode = otpCode.join("");
    if (fullCode.length < 4) {
      setErrorMsg("Please feed in the full 4 digit validation pin.");
      return;
    }

    try {
      if (otpMode === "forgot") {
        if (!password || password.length < 4) {
          setErrorMsg("Please choose a passcode with at least 4 characters.");
          return;
        }

        const result = await apiClient.post<{ token: string; user: UserSession }>("/api/auth/reset-password", {
          email,
          otp: fullCode,
          newPassword: password
        });
        localStorage.setItem("comfort_pg_token", result.token);
        setCurrentUser(result.user);
        onClose();
      } else {
        const result = await apiClient.post<{ token: string; user: UserSession }>("/api/auth/register", {
          name,
          email,
          password,
          phone,
          college,
          otp: fullCode
        });
        localStorage.setItem("comfort_pg_token", result.token);
        setCurrentUser(result.user);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Could not authenticate verification PIN.");
    }
  };

  const handleOtpInput = (index: number, val: string) => {
    if (isNaN(Number(val))) return;
    const nextOtp = [...otpCode];
    nextOtp[index] = val.slice(-1);
    setOtpCode(nextOtp);

    if (val && index < 3) {
      const nextEl = document.getElementById(`otp-${index + 1}`);
      nextEl?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
      />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="relative w-full max-w-md overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-10"
      >
        {/* Banner with logo & close */}
        <div className="relative p-6 bg-gradient-to-r from-primary/10 via-secondary/5 to-transparent flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-slate-800 dark:text-white leading-tight">
                {tab === "login" && "Login Gateway"}
                {tab === "register" && "Student Portal Onboarding"}
                {tab === "forgot" && "Recover Credentials"}
                {tab === "otp" && "Identity Authentication"}
                {tab === "link-sent" && "Verify Your Email"}
              </h2>
              <p className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold font-mono">
                Comfort Girls PG secure layer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            id="auth-close-btn"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/35 rounded-xl text-xs font-medium text-red-600 dark:text-red-400">
              {errorMsg}
            </div>
          )}

          {/* Tab switches for Login / Register */}
          {(tab === "login" || tab === "register") && (
            <div className="flex p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 mb-6 font-display text-sm">
              <button
                onClick={() => { setTab("login"); setErrorMsg(""); }}
                className={`flex-1 py-1.5 rounded-lg text-center font-medium transition-all cursor-pointer ${
                  tab === "login"
                    ? "bg-white dark:bg-slate-900 text-primary dark:text-primary-light shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setTab("register"); setErrorMsg(""); }}
                className={`flex-1 py-1.5 rounded-lg text-center font-medium transition-all cursor-pointer ${
                  tab === "register"
                    ? "bg-white dark:bg-slate-900 text-primary dark:text-primary-light shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {tab === "otp" ? (
              <motion.div
                key="otp"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-center"
              >
                <div className="text-sm text-slate-500 leading-relaxed font-light">
                  {otpMode === "forgot" ? (
                    <span>We sent a 4-digit passcode recovery PIN to <strong className="text-slate-800 dark:text-slate-200">{email || "your email address"}</strong>. Fill it in below to set your new passcode.</span>
                  ) : (
                    <span>We have dispatched a 4-digit validation pin to <strong className="text-slate-800 dark:text-slate-200">{email || "your email address"}</strong>. Please input the security passcode to complete registration.</span>
                  )}
                </div>

                {debugOtp && (
                  <div className="p-3 bg-pink-50/80 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-900 rounded-2xl text-xs text-pink-700 dark:text-pink-400 font-medium text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="flex items-center gap-1.5 font-semibold text-rose-800 dark:text-rose-300">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                        </span>
                        <span>Interactive Gateway Simulator</span>
                      </p>
                      <button
                        type="button"
                        onClick={handleAutofillDebugOtp}
                        className="text-[10px] font-bold px-2 py-1 bg-pink-100 hover:bg-pink-200 dark:bg-pink-900/40 dark:hover:bg-pink-900/60 rounded-lg text-pink-700 dark:text-pink-300 transition-all cursor-pointer border border-pink-200 dark:border-pink-800 flex items-center gap-1"
                      >
                        ⚡ Autofill
                      </button>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                      As requested, custom SMTP configuration is bypassed. Your live delivery security code is: <span className="font-mono text-base font-bold bg-white dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-pink-300 dark:border-pink-800 ml-1 select-all">{debugOtp}</span>
                    </p>
                  </div>
                )}

                {otpMode === "forgot" && (
                  <div className="text-left py-2 border-y border-slate-100 dark:border-slate-800 space-y-2">
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Choose New Passcode
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Choose at least 4 characters"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-hidden text-sm text-slate-800 dark:text-slate-100 transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-center gap-3">
                  {otpCode.map((char, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={char}
                      onChange={(e) => handleOtpInput(index, e.target.value)}
                      className="w-14 h-14 text-center font-display font-bold text-2xl text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-2xl outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    Otp ticker: <strong className="text-slate-800 dark:text-slate-200">{otpTimer > 0 ? `00:${otpTimer < 10 ? '0' + otpTimer : otpTimer}` : "Expired"}</strong>
                  </span>
                  <button
                    disabled={otpTimer > 0 || isSendingOtp}
                    onClick={handleResendOtp}
                    className="flex items-center gap-1 text-primary disabled:text-slate-400 font-medium hover:underline cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {isSendingOtp ? "Resending..." : "Resend Code"}
                  </button>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    disabled={isSendingOtp}
                    onClick={() => setTab("login")}
                    className="flex-1 py-3.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-all font-display text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    disabled={isSendingOtp}
                    onClick={verifyOtpSubmit}
                    className="flex-1 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all font-display text-sm font-semibold shadow-md shadow-primary/10 disabled:bg-slate-400 cursor-pointer"
                    id="otp-verify-submit"
                  >
                    {otpMode === "forgot" ? "Reset & Unlock" : "Authenticate PIN"}
                  </button>
                </div>
              </motion.div>
            ) : tab === "link-sent" ? (
              <motion.div
                key="link-sent"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-center"
              >
                <div className="flex justify-center">
                  <div className="p-4.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                    <Mail className="w-10 h-10 animate-bounce" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-semibold text-lg text-slate-800 dark:text-white">Verify Your Email</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    A secure authentication link was sent to <strong className="text-slate-800 dark:text-slate-200">{email}</strong>. Please check your inbox and click the verification link to confirm your email and activate your account.
                  </p>
                </div>

                {debugLink && (
                  <div className="p-3 bg-pink-50/80 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-900 rounded-2xl text-xs text-pink-700 dark:text-pink-400 font-medium text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="flex items-center gap-1.5 font-semibold text-rose-800 dark:text-rose-300">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                        </span>
                        <span>Interactive Gateway Simulator</span>
                      </p>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                      As requested, SMTP mail delivery is bypassed. Securely confirm registration via local development simulation by tapping the link below:
                    </p>
                    <a
                      href={debugLink}
                      className="block text-center font-bold px-3 py-2 bg-pink-100 hover:bg-pink-200 dark:bg-pink-900/40 dark:hover:bg-pink-900/60 rounded-xl text-pink-700 dark:text-pink-300 transition-all border border-pink-200 dark:border-pink-800 break-all select-all mt-1"
                    >
                      Verify via simulated link &rarr;
                    </a>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="w-full py-3.5 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-white rounded-xl transition-all font-display text-xs font-semibold cursor-pointer"
                >
                  Back to Sign In
                </button>
              </motion.div>
            ) : (
              <motion.form
                key={tab}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleAuthSubmit}
                className="space-y-4"
              >
                {tab === "register" && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Priyal Sen"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-hidden text-sm text-slate-800 dark:text-slate-100 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        WhatsApp Contact
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 XXXXX"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-hidden text-sm text-slate-800 dark:text-slate-100 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        College / University
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                          placeholder="e.g. Technology Institute / College"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-hidden text-sm text-slate-800 dark:text-slate-100 transition-colors"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. student@symbiosis.edu"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-hidden text-sm text-slate-800 dark:text-slate-100 transition-colors"
                    />
                  </div>
                </div>

                {tab !== "forgot" && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Passcode
                      </label>
                      {tab === "login" && (
                        <button
                          type="button"
                          onClick={() => setTab("forgot")}
                          className="text-xs font-medium text-primary hover:text-primary-dark transition-colors cursor-pointer"
                        >
                          Forgot Code?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-hidden text-sm text-slate-800 dark:text-slate-100 transition-colors"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full py-4.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-display font-semibold transition-all text-sm flex items-center justify-center gap-2 shadow-md shadow-primary/10 hover:shadow-lg focus:ring-2 focus:ring-primary disabled:bg-slate-400 disabled:shadow-none cursor-pointer mt-2"
                >
                  {tab === "login" && "Unlock Dashboard"}
                  {tab === "register" && (isSendingOtp ? "Submitting Registration..." : "Onboard Account")}
                  {tab === "forgot" && (isSendingOtp ? "Sending Recovery OTP..." : "Send Recovery PIN")}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Connection Diagnostics Footer */}
          <div className="mt-6 pt-4 border-t border-slate-150 dark:border-slate-800 text-center">
            <button
              type="button"
              onClick={() => {
                setShowDiagnostics(!showDiagnostics);
                if (!showDiagnostics) runDiagnostics();
              }}
              className="text-[11px] font-mono font-semibold text-slate-500 hover:text-primary dark:text-slate-400 transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <span>🔧</span>
              <span>{showDiagnostics ? "Hide Connection Status" : "Check Connection & Supabase Diagnostics"}</span>
            </button>

            {showDiagnostics && (
              <div className="mt-4 p-4 text-left bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs space-y-3">
                <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                  <span>SYSTEM STATUS CHECK</span>
                  {diagResult?.checking ? (
                    <span className="flex items-center gap-1 text-primary animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" /> checking...
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={runDiagnostics}
                      className="text-primary hover:underline font-bold cursor-pointer"
                    >
                      Refresh
                    </button>
                  )}
                </div>

                {diagResult && !diagResult.checking && (
                  <div className="space-y-2 font-mono">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                      <span className="text-slate-600 dark:text-slate-400 font-sans">Backend Server:</span>
                      <span className={`font-semibold flex items-center gap-1 ${diagResult.backendOk ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"}`}>
                        {diagResult.backendOk ? "● Online & Connected" : "○ Unreachable (Offline)"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                      <span className="text-slate-600 dark:text-slate-400 font-sans">Supabase DB:</span>
                      <span className={`font-semibold flex items-center gap-1 ${diagResult.dbConnected ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"}`}>
                        {diagResult.dbConnected ? "● Connected (Active)" : "○ Offline / Not Connected"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                      <span className="text-slate-600 dark:text-slate-400 font-sans">Storage Mode:</span>
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">
                        {diagResult.dbMode}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400 font-sans">Credentials host config:</span>
                      <span className={`font-semibold ${diagResult.dbConfigured ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600"}`}>
                        {diagResult.dbConfigured ? "Configured" : "Missing host config"}
                      </span>
                    </div>

                    {diagResult.error && (
                      <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[10px] leading-relaxed break-words">
                        Error detail: {diagResult.error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
