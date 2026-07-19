"use client";

import React from "react";
import { Mail, Phone, MapPin, Instagram, Facebook, ShieldCheck, Heart } from "lucide-react";
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
    <footer className="w-full bg-[#2C1E16] text-white/70 font-sans pt-16 pb-8 transition-colors border-t-0">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        
        {/* Upper footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Logo Brand / Tagline */}
          <div className="space-y-6">
            <div 
              onClick={() => handleNavClick("/")}
              className="flex items-center gap-3 cursor-pointer group w-fit"
            >
              <div className="w-10 h-10 rounded-full bg-transparent border-2 border-[#D96B27] flex items-center justify-center text-[#D96B27]">
                <span className="font-serif text-xl font-bold">C</span>
              </div>
              <div>
                <span className="font-sans font-bold text-lg text-white leading-tight block">
                  Comfort
                </span>
                <span className="block text-sm text-white font-medium">
                  Girls PG
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/70 font-medium">
              Providing a safe, secure and comfortable home away from home for girls students. High-quality living with modern amenities and tasty meals for a better experience.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white transition-colors" aria-label="WhatsApp">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Navigations */}
          <div>
            <h3 className="font-sans font-bold text-[#D96B27] uppercase text-xs mb-6 tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><button onClick={() => handleNavClick("/")} className="hover:text-white transition-colors cursor-pointer text-left">Home</button></li>
              <li><button onClick={() => handleNavClick("/rooms")} className="hover:text-white transition-colors cursor-pointer text-left">Rooms</button></li>
              <li><button onClick={() => handleNavClick("/#amenities")} className="hover:text-white transition-colors cursor-pointer text-left">Amenities</button></li>
              <li><button onClick={() => handleNavClick("/#gallery")} className="hover:text-white transition-colors cursor-pointer text-left">Gallery</button></li>
              <li><button onClick={() => handleNavClick("/#faq-section")} className="hover:text-white transition-colors cursor-pointer text-left">FAQs</button></li>
              <li><button onClick={() => handleNavClick("/#about")} className="hover:text-white transition-colors cursor-pointer text-left">About</button></li>
            </ul>
          </div>

          {/* Guidelines & Policies */}
          <div>
            <h3 className="font-sans font-bold text-[#D96B27] uppercase text-xs mb-6 tracking-wide">
              Policies & Support
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><span className="hover:text-white transition-colors cursor-pointer">Rules & Regulations</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Refund & Cancellation</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Terms & Conditions</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Grievance Redressal</span></li>
            </ul>
          </div>

          {/* Direct Address & Help */}
          <div className="space-y-5">
            <h3 className="font-sans font-bold text-[#D96B27] uppercase text-xs mb-6 tracking-wide">
              Contact Info
            </h3>
            <div className="flex items-start gap-3 text-sm font-medium">
              <MapPin className="w-5 h-5 text-[#D96B27] shrink-0 mt-0.5" />
              <span>
                Comfort Girls PG, A-33, 7th Cross St, Block A, Alpha I, Greater Noida, Uttar Pradesh 201310
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium">
              <Phone className="w-5 h-5 text-[#D96B27] shrink-0" />
              <span>+91 7303962274</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium">
              <svg className="w-5 h-5 fill-[#D96B27] shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              <span>+91 7303962274</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium">
              <Mail className="w-5 h-5 text-[#D96B27] shrink-0" />
              <span>contact@comfortgirlspg.live</span>
            </div>
          </div>

        </div>

        {/* Lower footer section */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-white/50">
          <div>
            &copy; 2025 Comfort Girls PG. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 hover:text-white transition-colors">
              <Heart className="w-4 h-4 text-[#D96B27]" />
              Site by Comfort PG
            </span>
            <span className="flex items-center gap-2 hover:text-white transition-colors">
              <ShieldCheck className="w-4 h-4 text-[#D96B27]" />
              Secure. Hygienic. Home.
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
