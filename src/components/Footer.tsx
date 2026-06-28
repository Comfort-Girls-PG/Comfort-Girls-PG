"use client";

import React from "react";
import { Sparkles, Mail, Phone, MapPin, MessageSquare, Instagram, Facebook, Linkedin, CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = (href: string) => {
    if (pathname === "/" && href.startsWith("/#")) {
      const id = href.substring(2);
      const targetElement = document.getElementById(id);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else if (href === "/") {
      router.push("/");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      router.push(href);
    }
  };

  return (
    <footer className="w-full bg-slate-900 text-slate-400 font-sans border-t border-slate-800 pt-16 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Logo Brand / Tagline */}
          <div className="space-y-4">
            <div 
              onClick={() => handleNavClick("/")}
              className="flex items-center gap-2 cursor-pointer group w-fit"
            >
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-primary to-secondary text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-display font-bold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-primary-light via-white to-secondary-light bg-clip-text text-transparent">
                  Comfort
                </span>
                <span className="block text-[9px] font-mono tracking-widest text-slate-500 uppercase font-bold">
                  Girls PG & Luxury Living
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 pt-2 font-light">
              Redefining girls student accommodation with cutting-edge 5-tier safety protocols, high-protein organic chefs, and smart co-living spaces for ambitious minds.
            </p>
            <div className="flex items-center gap-3 pt-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-secondary hover:bg-slate-700/55 transition-colors border border-slate-700/50" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-primary-light hover:bg-slate-700/55 transition-colors border border-slate-700/50" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-slate-700/55 transition-colors border border-slate-700/50" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigations */}
          <div>
            <h3 className="font-display font-semibold text-white tracking-wider uppercase text-xs mb-6 pb-2 border-b border-slate-800">
              Quick Links
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <button onClick={() => handleNavClick("/")} className="hover:text-white transition-colors cursor-pointer text-left">
                  Home Landing
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("/rooms")} className="hover:text-white transition-colors cursor-pointer text-left">
                  Explore Luxury Suites
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("/#amenities")} className="hover:text-white transition-colors cursor-pointer text-left">
                  Premium Facilities
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("/#gallery")} className="hover:text-white transition-colors cursor-pointer text-left">
                  Campus Photo Gallery
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("/#faq-section")} className="hover:text-white transition-colors cursor-pointer text-left">
                  FAQs & Assistance
                </button>
              </li>
            </ul>
          </div>

          {/* Guidelines & Policies */}
          <div>
            <h3 className="font-display font-semibold text-white tracking-wider uppercase text-xs mb-6 pb-2 border-b border-slate-800">
              Policies & Support
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Code of Living Conduct
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Fair Refund Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Privacy Guard Protocol
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Tenant Terms & License
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Warden Emergency Handbook
                </span>
              </li>
            </ul>
          </div>

          {/* Direct Address & Help */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-white tracking-wider uppercase text-xs mb-6 pb-2 border-b border-slate-800">
              Contact Desk
            </h3>
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <span>
                Comfort Girls PG, A-33, Block A, Alpha I, Greater Noida, Uttar Pradesh 201310
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-primary-light shrink-0" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-mono text-[13px] text-emerald-400">
              <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>WhatsApp: +91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-accent shrink-0" />
              <span>contact@comfortgirlspg.live</span>
            </div>
          </div>

        </div>

        {/* Lower footer section */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Comfort Girls PG. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              SSL Encrypted Portal
            </span>
            <span className="flex items-center gap-1.5 hover:text-primary-light transition-colors">
              <CreditCard className="w-3.5 h-3.5 text-primary-light" />
              Secure Digital UPI Active
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
