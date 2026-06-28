import React from "react";
import "../index.css";
import { AppProvider } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthPages from "../components/AuthPages";

export const metadata = {
  title: "Comfort Girls PG - Luxury Female Co-living Engine",
  description: "Secure, high-fidelity co-living ecosystem designed with 5-tier safety, premium nutritional organic meals, and instant online support portal.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300 antialiased min-h-screen flex flex-col">
        <AppProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <AuthPages />
        </AppProvider>
      </body>
    </html>
  );
}
