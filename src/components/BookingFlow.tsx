import React, { useState } from "react";
import { Room, Booking, UserSession } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, ChevronRight, FileUp, ArrowLeft, ArrowRight } from "lucide-react";
import { apiClient } from "../utils/apiClient";

interface BookingFlowProps {
  room: Room;
  currentUser: UserSession;
  onBookingComplete: (newBooking: Booking) => void;
  onCancel: () => void;
}

export default function BookingFlow({
  room,
  currentUser,
  onBookingComplete,
  onCancel,
}: BookingFlowProps) {
  const [step, setStep] = useState<2 | 3 | 4>(2); // 1 = Room Selected (Done), 2 = Date, 3 = KYC, 4 = Success

  // Visit states
  const [scheduleDate, setScheduleDate] = useState<string>("");
  const [docType, setDocType] = useState<string>("Aadhaar Card");
  const [docFile, setDocFile] = useState<string>("");
  const [docName, setDocName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState<Booking | null>(null);

  const stepsList = [
    { num: 1, name: "Selected Unit" },
    { num: 2, name: "Schedule Visit" },
    { num: 3, name: "KYC Documents" },
    { num: 4, name: "Confirmed" },
  ];

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
      if (!scheduleDate) {
        alert("Please set a convenient visitation date to schedule properly.");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!docFile) {
        alert("Please upload your KYC credentials to proceed safely.");
        return;
      }
      
      setIsLoading(true);
      apiClient.post<Booking>("/api/bookings", {
        roomId: room.id,
        sharingType: room.type,
        scheduleVisitDate: scheduleDate,
        documentType: docType,
        documentUrl: docFile
      })
      .then((bResult) => {
        setIsLoading(false);
        setBookingResult(bResult);
        setStep(4);
      })
      .catch((err) => {
        setIsLoading(false);
        alert(err.message || "Failed to schedule visit. Please try again.");
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 transition-all">
      
      {/* Return to Details trigger */}
      {step < 4 && (
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
          
          <div className="absolute left-[30px] right-[30px] h-0.5 bg-slate-200 -z-10 top-1/2 transform -translate-y-1/2" />
          
          {stepsList.map((st) => {
            const isCompleted = step > st.num || (step === 4 && st.num === 4);
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

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        <div className="md:col-span-8 bg-white rounded-3xl border border-slate-200/50 p-6 md:p-8 shadow-md">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-sm font-medium text-slate-800 ">Scheduling your visit...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              
              {/* Step 2: Visitation Date Schedule */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
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
                      Comfort Girls PG ensures safety by vetting credentials before a visit.
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
                            <p className="text-[10px] text-slate-500 font-light">Supports JPEG, PDF, PNG files - Max size 5MB</p>
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
                      Authenticate and Schedule Visit
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === 4 && bookingResult && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="font-display font-bold text-2xl text-slate-850 ">Visit Scheduled!</h2>
                    <p className="text-xs text-slate-500 font-light mt-1 md:max-w-md">
                      Congratulations {currentUser.name}! Your visit reference <strong className="text-primary">{bookingResult.id}</strong> has been logged.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={() => onBookingComplete(bookingResult)}
                      className="flex-1 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-display text-xs font-semibold transition-all shadow-md shadow-primary/10 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Return to Dashboard
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          )}
        </div>

        {/* Right Side: Price Breakdowns Summary Desk */}
        {step < 4 && (
          <div className="md:col-span-4 bg-slate-50 rounded-3xl border border-slate-250/50 p-6 space-y-5 shadow-sm sticky top-24">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 ">
                Visit Target Suite
              </h4>
              
              <div className="flex gap-3 pb-3 border-b border-slate-200/50 ">
                <img src={room.images[0]} className="w-16 h-12 rounded-xl object-cover" />
                <div>
                  <h5 className="text-xs font-bold text-slate-850 leading-tight">{room.name}</h5>
                  <p className="text-[10px] text-slate-500 pt-0.5">{room.type}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Status:</span>
                <span className="font-mono text-emerald-600 font-bold">Free Tour Request</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 leading-tight pt-2">
                <span>The management team will verify your KYC documents before approving your campus visit.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
