import React, { useState } from "react";
import { Room, RoomType, Booking, UserSession } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, ShieldAlert, CreditCard, ChevronRight, FileUp, Sparkles, Receipt, Download, Star, Ticket, Building, ArrowLeft, ArrowRight, QrCode } from "lucide-react";
import { apiClient } from "../utils/apiClient";

interface BookingFlowProps {
 room: Room;
 directBook: boolean;
 currentUser: UserSession;
 onBookingComplete: (newBooking: Booking) => void;
 onCancel: () => void;
}

export default function BookingFlow({
 room,
 directBook,
 currentUser,
 onBookingComplete,
 onCancel,
}: BookingFlowProps) {
 const [step, setStep] = useState<2 | 3 | 4 | 5>(2); // Step 1 is "Choose Room" which is already done

 // Booking states
 const [scheduleDate, setScheduleDate] = useState<string>("");
 const [docType, setDocType] = useState<string>("Aadhaar Card");
 const [docFile, setDocFile] = useState<string>("");
 const [docName, setDocName] = useState<string>("");
 const [isDragging, setIsDragging] = useState(false);
 
 // Coupons & Pricing
 const [coupon, setCoupon] = useState("");
 const [discount, setDiscount] = useState(0);
 const [couponApplied, setCouponApplied] = useState(false);
 const [couponMsg, setCouponMsg] = useState("");
 
 // Payment states
 const [payMethod, setPayMethod] = useState<"UPI" | "Card" | "Net Banking">("UPI");
 const [upiId, setUpiId] = useState("");
 const [cardNumber, setCardNumber] = useState("");
 const [cardHolder, setCardHolder] = useState("");
 const [cardExpiry, setCardExpiry] = useState("");
 const [cardCvv, setCardCvv] = useState("");
 const [bankName, setBankName] = useState("State Bank of India");

 const [isLoading, setIsLoading] = useState(false);
 const [bookingResult, setBookingResult] = useState<Booking | null>(null);

 // Pricing calculations
 const baseRent = room.price;
 const securityDeposit = room.deposit;
 const initialAmount = directBook ? (securityDeposit + baseRent) : 2500; // 2500 is holding deposit for visitation
 const totalPayable = initialAmount - discount;

 const stepsList = [
 { num: 1, name: "Selected Unit" },
 { num: 2, name: directBook ? "Onboarding Config" : "Schedule Visit" },
 { num: 3, name: "KYC Documents" },
 { num: 4, name: "Reserve Payment" },
 { num: 5, name: "Receipt & Keys" },
 ];

 // Try apply coupon
 const handleApplyCoupon = () => {
 const raw = coupon.trim().toUpperCase();
 if (raw === "COMFORT2000") {
 setDiscount(2000);
 setCouponApplied(true);
 setCouponMsg("Success! ₹2,000 deducted from your booking package.");
 } else if (raw === "WELCOME500") {
 setDiscount(500);
 setCouponApplied(true);
 setCouponMsg("Success! ₹500 discount coupon applied.");
 } else {
 setCouponMsg("Oops, coupon invalid. Use 'COMFORT2000' or 'WELCOME500'.");
 }
 };

 // Drag & drop mocks
 const handleDragOver = (e: React.DragEvent) => {
 e.preventDefault();
 setIsDragging(true);
 };

 const handleDragLeave = () => {
 setIsDragging(false);
 };

 const handleDrop = (e: React.DragEvent) => {
 e.preventDefault();
 setIsDragging(false);
 if (e.dataTransfer.files && e.dataTransfer.files[0]) {
 const file = e.dataTransfer.files[0];
 setDocName(file.name);
 setDocFile("mock_uploaded_" + file.name);
 }
 };

 const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
 if (e.target.files && e.target.files[0]) {
 const file = e.target.files[0];
 setDocName(file.name);
 setDocFile("mock_uploaded_" + file.name);
 }
 };

 // Submit flow
 const handleStepCompletion = () => {
 if (step === 2) {
 if (!directBook && !scheduleDate) {
 alert("Please set a convenient visitation date to schedule properly.");
 return;
 }
 setStep(3);
 } else if (step === 3) {
 if (!docFile) {
 alert("Please upload your KYC credentials to proceed safely.");
 return;
 }
 setStep(4);
 } else if (step === 4) {
 // Trigger loader skeleton
 setIsLoading(true);
 apiClient.post<Booking>("/api/bookings", {
 roomId: room.id,
 sharingType: room.type,
 scheduleVisitDate: directBook ? null : scheduleDate,
 documentType: docType,
 documentUrl: docFile,
 paidAmount: totalPayable,
 couponCode: couponApplied ? coupon : ""
 })
 .then((bResult) => {
 setIsLoading(false);
 setBookingResult(bResult);
 setStep(5);
 })
 .catch((err) => {
 setIsLoading(false);
 alert(err.message || "Failed to finalize booking. Please try again.");
 });
 }
 };

 const printInvoice = () => {
 window.print();
 };

 return (
 <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 transition-all">
 
 {/* Return to Details trigger */}
 {step < 5 && (
 <button
 onClick={onCancel}
 className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-primary mb-8 cursor-pointer"
 >
 <ArrowLeft className="w-3.5 h-3.5" />
 Cancel and go back
 </button>
 )}

 {/* Horizontal Multi-Step Stepper Component */}
 <div className="mb-10 block">
 <div className="flex justify-between items-center relative">
 
 {/* Timeline background connectors */}
 <div className="absolute left-[30px] right-[30px] h-0.5 bg-slate-200 -z-10 top-1/2 transform -translate-y-1/2" />
 
 {stepsList.map((st) => {
 const isCompleted = step > st.num || (step === 5 && st.num === 5);
 const isCurrent = step === st.num;
 return (
 <div key={st.num} className="flex flex-col items-center shrink-0">
 <div
 className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-xs transition-colors ${
 isCompleted 
 ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/10" 
 : isCurrent 
 ? "bg-primary text-white shadow-md shadow-primary/20 scale-110" 
 : "bg-slate-100 text-slate-400 "
 }`}
 >
 {isCompleted ? "✓" : st.num}
 </div>
 <span className="hidden md:block text-[11px] font-display font-medium text-slate-500 pt-2 text-center max-w-[80px]">
 {st.name}
 </span>
 </div>
 );
 })}
 </div>
 </div>

 {/* Flow Cards */}
 <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
 
 {/* Left Side: Step Wizard Inputs (7 Cols) */}
 <div className="md:col-span-8 bg-white rounded-3xl border border-slate-200/50 p-6 md:p-8 shadow-md">
 {isLoading ? (
 <div className="flex flex-col items-center justify-center py-16 space-y-4">
 <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
 <p className="text-sm font-medium text-slate-800 ">Processing secure reserve reservation...</p>
 <p className="text-xs text-slate-500 font-light font-mono">Securing gateway handshake with local banks</p>
 </div>
 ) : (
 <AnimatePresence mode="wait">
 
 {/* Step 2: Visitation Date Schedule or direct configuration */}
 {step === 2 && (
 <motion.div
 key="step2"
 initial={{ opacity: 0, x: -10 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: 10 }}
 className="space-y-6"
 >
 {directBook ? (
 <div className="space-y-5">
 <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
 <h3 className="font-display font-bold text-sm text-primary mb-1">Guaranteed Instant Reservation</h3>
 <p className="text-xs text-slate-600 leading-relaxed font-light">
 You are booking your bed directly. We will lock current monthly tariff prices immediately and reserve roommates configuration.
 </p>
 </div>
 
 <div className="space-y-1">
 <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
 Move In Target Window
 </label>
 <input
 type="date"
 value={scheduleDate}
 onChange={(e) => setScheduleDate(e.target.value)}
 className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden text-xs text-slate-800 "
 />
 <p className="text-[10px] text-slate-500 font-light pt-1">Typically, reservations permit check-ins up to 15 days out from payment.</p>
 </div>
 </div>
 ) : (
 <div className="space-y-5">
 <div className="space-y-2">
 <h3 className="font-display font-bold text-base text-slate-800 ">Coordinate your visitation slot</h3>
 <p className="text-xs text-slate-500 font-light leading-relaxed">
 Choose a comfortable date for your parents and yourself to tour Comfort Girls PG. Our dedicated female warden will guide you through the layouts.
 </p>
 </div>

 <div className="space-y-2">
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 ">
 Visit Date Choice
 </label>
 <input
 type="date"
 required
 value={scheduleDate}
 onChange={(e) => setScheduleDate(e.target.value)}
 className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-850 outline-hidden font-display cursor-pointer"
 />
 </div>
 </div>
 )}

 <div className="pt-4">
 <button
 onClick={handleStepCompletion}
 className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-display text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10 cursor-pointer"
 >
 Verify and Continue KYC
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 </motion.div>
 )}

 {/* Step 3: Document Upload (KYC verify) */}
 {step === 3 && (
 <motion.div
 key="step3"
 initial={{ opacity: 0, x: -10 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: 10 }}
 className="space-y-6"
 >
 <div className="space-y-2">
 <h3 className="font-display font-bold text-base text-slate-850 ">Secure KYC Onboarding</h3>
 <p className="text-xs text-slate-500 font-light leading-relaxed">
 Comfort Girls PG ensures safety by vetting credentials. None of your documents are stored in third-party trackers.
 </p>
 </div>

 <div className="space-y-4">
 <div className="space-y-1.5">
 <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
 Document Credentials Category
 </label>
 <select
 value={docType}
 onChange={(e) => setDocType(e.target.value)}
 className="w-full p-3.5 bg-slate-50 border border-slate-250 rounded-xl text-xs text-slate-850 outline-hidden cursor-pointer"
 >
 <option>Aadhaar Card (Double-sided)</option>
 <option>Passport Booklet</option>
 <option>College Admission Letter</option>
 <option>Company Offer Letter / ID Card</option>
 </select>
 </div>

 {/* Drag and Drop Zone */}
 <div className="space-y-1">
 <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
 File Attachment
 </label>
 <div
 onDragOver={handleDragOver}
 onDragLeave={handleDragLeave}
 onDrop={handleDrop}
 className={`border-2 border-dashed rounded-2xl p-6.5 text-center flex flex-col items-center justify-center cursor-pointer transition-colors ${
 isDragging
 ? "border-primary bg-primary/5 text-primary"
 : docFile
 ? "border-emerald-500 bg-emerald-500/5 text-emerald-600"
 : "border-slate-300 hover:border-slate-400 bg-slate-50 text-slate-550"
 }`}
 onClick={() => document.getElementById("hidden-file-input")?.click()}
 >
 <FileUp className={`w-8 h-8 mb-2.5 ${docFile ? "text-emerald-500" : "text-slate-400"}`} />
 {docFile ? (
 <div className="space-y-1">
 <p className="text-xs font-bold text-slate-800 ">Uploaded successfully!</p>
 <p className="text-[10px] font-mono text-slate-500 truncate max-w-xs">{docName}</p>
 </div>
 ) : (
 <div className="space-y-1">
 <p className="text-xs font-medium text-slate-800 ">Drag and drop file here or click to browse</p>
 <p className="text-[10px] text-slate-500 font-light">Supports JPEG, JPEG2000, PDF, PNG files - Max size 5MB</p>
 </div>
 )}
 <input
 id="hidden-file-input"
 type="file"
 accept=".pdf,.png,.jpg,.jpeg"
 className="hidden"
 onChange={handleFileSelect}
 />
 </div>
 </div>
 </div>

 <div className="pt-2">
 <button
 onClick={handleStepCompletion}
 className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-display text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10 cursor-pointer"
 >
 Authenticate KYC
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 </motion.div>
 )}

 {/* Step 4: Reserve Payment Screen */}
 {step === 4 && (
 <motion.div
 key="step4"
 initial={{ opacity: 0, x: -10 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: 10 }}
 className="space-y-6"
 >
 <div className="space-y-2">
 <h3 className="font-display font-bold text-base text-slate-850 ">Secure reserve holding payment</h3>
 <p className="text-xs text-slate-500 leading-relaxed font-light">
 Comfort PG deploys digital authorization tokens so payments are secured and immediately routed into escrow.
 </p>
 </div>

 {/* Payment Selection Toggles */}
 <div className="flex gap-3 mb-4">
 {["UPI", "Card", "Net Banking"].map((mode) => (
 <button
 key={mode}
 onClick={() => setPayMethod(mode as any)}
 className={`flex-1 py-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
 payMethod === mode
 ? "bg-primary/5 border-primary text-primary "
 : "border-slate-200 text-slate-600 hover:bg-slate-50 "
 }`}
 >
 {mode}
 </button>
 ))}
 </div>

 {/* Payment Forms Content */}
 <div className="p-5.5 rounded-2xl bg-slate-50 border border-slate-200/50 min-h-[160px]">
 {payMethod === "UPI" && (
 <div className="space-y-4 text-center">
 <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-100 w-36 mx-auto">
 <QrCode className="w-24 h-24 text-slate-800 " />
 <span className="text-[9px] font-mono text-slate-500 pt-1 font-bold">SCAN WITH ANY UPI APP</span>
 </div>
 
 <div className="space-y-1 text-left">
 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
 Or Enter UPI ID Address
 </label>
 <input
 type="text"
 value={upiId}
 onChange={(e) => setUpiId(e.target.value)}
 placeholder="e.g. prisha@oksbi"
 className="w-full p-3 bg-white border border-slate-200 text-xs rounded-xl outline-hidden text-slate-850 font-mono"
 />
 </div>
 </div>
 )}

 {payMethod === "Card" && (
 <div className="space-y-3">
 <div className="space-y-1">
 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
 Credit/Debit Card Number
 </label>
 <input
 type="text"
 maxLength={19}
 value={cardNumber}
 onChange={(e) => setCardNumber(e.target.value)}
 placeholder="4111 2222 3333 4444"
 className="w-full p-3 bg-white border border-slate-200 text-xs rounded-xl outline-hidden text-slate-850 font-mono"
 />
 </div>
 <div className="grid grid-cols-2 gap-3">
 <div className="space-y-1">
 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
 Expiry Date
 </label>
 <input
 type="text"
 maxLength={5}
 value={cardExpiry}
 onChange={(e) => setCardExpiry(e.target.value)}
 placeholder="MM/YY"
 className="w-full p-3 bg-white border border-slate-200 text-xs rounded-xl outline-hidden text-slate-850 font-mono text-center"
 />
 </div>
 <div className="space-y-1">
 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
 Security CVV Code
 </label>
 <input
 type="password"
 maxLength={3}
 value={cardCvv}
 onChange={(e) => setCardCvv(e.target.value)}
 placeholder="•••"
 className="w-full p-3 bg-white border border-slate-200 text-xs rounded-xl outline-hidden text-slate-850 font-mono text-center"
 />
 </div>
 </div>
 </div>
 )}

 {payMethod === "Net Banking" && (
 <div className="space-y-3">
 <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
 Select Banking Institution
 </label>
 <select
 value={bankName}
 onChange={(e) => setBankName(e.target.value)}
 className="w-full p-3.5 bg-white border border-slate-200 text-xs rounded-xl text-slate-850 outline-hidden cursor-pointer"
 >
 <option>State Bank of India</option>
 <option>HDFC Bank Private</option>
 <option>ICICI Commercial Bank</option>
 <option>Axis National Bank</option>
 <option>Kotak Mahindra Bank</option>
 </select>
 </div>
 )}
 </div>

 <div className="pt-2">
 <button
 onClick={handleStepCompletion}
 className="w-full py-4.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-display text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
 id="booking-flow-reserve-btn"
 >
 <CreditCard className="w-4 h-4" />
 Authorize Secure Payment: ₹{totalPayable.toLocaleString("en-IN")}
 </button>
 </div>
 </motion.div>
 )}

 {/* Step 5: Success Receipt Confirmation & Keys */}
 {step === 5 && bookingResult && (
 <motion.div
 key="step5"
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="space-y-8 text-center"
 >
 <div className="flex flex-col items-center justify-center">
 <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-4">
 <CheckCircle2 className="w-10 h-10" />
 </div>
 <h2 className="font-display font-bold text-2xl text-slate-850 ">Unit Reserved Successfully!</h2>
 <p className="text-xs text-slate-500 font-light mt-1 md:max-w-md">
 Congratulations {currentUser.name}! Your reservation reference <strong className="text-primary">{bookingResult.id}</strong> has been logged inside Comfort Girls PG digital logs.
 </p>
 </div>

 {/* PRINTABLE INVOICE RECEIPT CONTAINER */}
 <div className="text-left bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-3xl space-y-6 printable-invoice-area shadow-sm">
 
 {/* Header receipt info */}
 <div className="flex justify-between items-start border-b border-slate-200/50 pb-4">
 <div>
 <span className="text-[10px] font-mono text-slate-400 font-bold tracking-widest block">SECURE ESCROW RECEIPT</span>
 <h4 className="font-display font-medium text-lg text-slate-850 ">Comfort Girls PG</h4>
 <p className="text-[11px] text-slate-500">Central Campus Corridor, Pune</p>
 </div>
 <div className="text-right">
 <span className="py-1 px-2 text-[10px] font-mono font-bold uppercase rounded-lg bg-emerald-500/10 text-emerald-600 ">
 Transaction Settled
 </span>
 <p className="text-xs font-mono font-semibold text-slate-650 pt-1.5">{bookingResult.invoiceNo}</p>
 </div>
 </div>

 {/* Meta info grid */}
 <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200/50 ">
 <div>
 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Resident Allocations</span>
 <p className="text-xs font-semibold text-slate-800 ">{currentUser.name}</p>
 <p className="text-xs text-slate-500">{currentUser.email}</p>
 </div>
 <div>
 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Reserved Suite Unit</span>
 <p className="text-xs font-semibold text-slate-800 ">{room.name}</p>
 <p className="text-xs text-slate-500">{room.type}</p>
 </div>
 </div>

 {/* Transaction logs list */}
 <div className="space-y-2">
 <div className="flex justify-between text-xs text-slate-500">
 <span>Original Booking Package Fee:</span>
 <span className="font-mono text-slate-800 ">₹{(initialAmount).toLocaleString("en-IN")}</span>
 </div>
 {couponApplied && (
 <div className="flex justify-between text-xs text-emerald-500">
 <span>Applied Promo Discount ({bookingResult.couponCode}):</span>
 <span>-₹{discount.toLocaleString("en-IN")}</span>
 </div>
 )}
 <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-dashed border-slate-200 ">
 <span>Settlement Method:</span>
 <span className="font-mono font-semibold text-slate-800 ">{bookingResult.paymentMethod} Payment</span>
 </div>
 <div className="flex justify-between font-display text-sm font-bold text-slate-850 pt-2">
 <span>Paid Holding escrows:</span>
 <span className="font-mono text-emerald-500 text-lg">₹{bookingResult.paidAmount.toLocaleString("en-IN")}</span>
 </div>
 </div>
 </div>

 {/* Lower helper controls */}
 <div className="flex flex-col sm:flex-row gap-3 pt-4">
 <button
 onClick={printInvoice}
 className="flex-1 py-3.5 border border-slate-200 text-slate-700 rounded-xl transition-all font-display text-xs font-semibold hover:bg-slate-50 flex items-center justify-center gap-1 cursor-pointer"
 >
 <Download className="w-3.5 h-3.5" />
 Print Receipt
 </button>
 <button
 onClick={() => onBookingComplete(bookingResult)}
 className="flex-1 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-display text-xs font-semibold transition-all shadow-md shadow-primary/10 flex items-center justify-center gap-1 cursor-pointer"
 >
 Enter Resident Dashboard
 <ArrowRight className="w-3.5 h-3.5" />
 </button>
 </div>
 </motion.div>
 )}

 </AnimatePresence>
 )}
 </div>

 {/* Right Side: Price Breakdowns Summary Desk (4 Cols) */}
 {step < 5 && (
 <div className="md:col-span-4 bg-slate-50 rounded-3xl border border-slate-250/50 p-6 space-y-5 shadow-sm sticky top-24">
 <div className="space-y-4">
 <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 ">
 Selected Package Summary
 </h4>
 
 <div className="flex gap-3 pb-3 border-b border-slate-200/50 ">
 <img src={room.images[0]} className="w-16 h-12 rounded-xl object-cover" />
 <div>
 <h5 className="text-xs font-bold text-slate-850 leading-tight">{room.name}</h5>
 <p className="text-[10px] text-slate-500 pt-0.5">{room.type}</p>
 </div>
 </div>
 </div>

 {/* Calculations metrics catalog */}
 <div className="space-y-2.5 pb-4 border-b border-slate-200/50 ">
 <div className="flex justify-between text-xs text-slate-500">
 <span>Monthly Rent Package:</span>
 <span className="font-mono font-semibold text-slate-800 ">₹{baseRent.toLocaleString("en-IN")}</span>
 </div>
 <div className="flex justify-between text-xs text-slate-500">
 <span>Security Deposit Guard:</span>
 <span className="font-mono font-semibold text-slate-800 ">₹{securityDeposit.toLocaleString("en-IN")}</span>
 </div>
 <div className="flex justify-between text-xs text-slate-500">
 <span>Booking Category:</span>
 <span className="font-mono text-[11px] text-slate-800 ">
 {directBook ? "Full Unit reservation" : "Holding visit token"}
 </span>
 </div>
 </div>

 {/* Promo Codes */}
 <div className="space-y-2">
 <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
 Promo Code Coupon
 </span>
 <div className="flex gap-2">
 <input
 type="text"
 value={coupon}
 onChange={(e) => setCoupon(e.target.value)}
 placeholder="e.g. COMFORT2000"
 className="flex-1 p-2 bg-white border border-slate-200 text-xs rounded-xl outline-hidden font-mono uppercase"
 />
 <button
 onClick={handleApplyCoupon}
 className="px-3.5 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold cursor-pointer"
 >
 Apply
 </button>
 </div>
 {couponMsg && (
 <p className={`text-[10px] font-medium leading-none ${couponApplied ? "text-emerald-500" : "text-amber-500"}`}>
 {couponMsg}
 </p>
 )}
 </div>

 {/* Final Total calculations */}
 <div className="pt-2">
 <div className="flex justify-between font-display text-xs text-slate-500 mb-1">
 <span>Total Escrow Payable:</span>
 {discount > 0 && <span className="line-through font-mono">₹{initialAmount.toLocaleString("en-IN")}</span>}
 </div>
 <div className="flex justify-between font-display font-bold text-slate-850 ">
 <span className="text-sm">Escrow Charge:</span>
 <span className="font-mono text-primary text-xl">₹{totalPayable.toLocaleString("en-IN")}</span>
 </div>
 </div>

 </div>
 )}

 </div>
 </div>
 );
}
