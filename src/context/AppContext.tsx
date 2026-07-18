"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Room, Booking, Complaint, UserSession } from "../types";
import { apiClient } from "../utils/apiClient";
import { MOCK_ROOMS } from "../lib/staticData";

interface AppContextType {
  currentUser: UserSession | null;
  setCurrentUser: (user: UserSession | null) => void;

  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room | null) => void;
  activeRooms: Room[];
  setActiveRooms: (rooms: Room[]) => void;
  activeBookings: Booking[];
  setActiveBookings: (bookings: Booking[]) => void;
  globalComplaints: Complaint[];
  setGlobalComplaints: (complaints: Complaint[]) => void;
  logout: () => void;
  refreshUserData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [activeRooms, setActiveRooms] = useState<Room[]>(MOCK_ROOMS);
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [globalComplaints, setGlobalComplaints] = useState<Complaint[]>([]);



  // Sync token and load initial lists
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load active listing catalog
    apiClient.get<Room[]>("/api/rooms")
      .then((data) => {
        if (data && data.length) {
          setActiveRooms(data);
        }
      })
      .catch((err) => console.warn("Could not fetch active listing rooms:", err));

    const token = localStorage.getItem("comfort_pg_token");
    if (token) {
      apiClient.get<UserSession>("/api/auth/me")
        .then((user) => {
          setCurrentUser(user);
        })
        .catch((err) => {
          console.warn("Token expired or invalid:", err);
          localStorage.removeItem("comfort_pg_token");
        });
    }
  }, []);

  // Sync bookings & complaints when user changes
  useEffect(() => {
    if (!currentUser) {
      setActiveBookings([]);
      setGlobalComplaints([]);
      return;
    }

    apiClient.get<Booking[]>("/api/bookings")
      .then((data) => {
        if (data) {
          setActiveBookings(data);
        }
      })
      .catch((err) => console.warn("Could not retrieve active bookings:", err));

    apiClient.get<Complaint[]>("/api/complaints")
      .then((data) => {
        if (data) {
          setGlobalComplaints(data);
        }
      })
      .catch((err) => console.warn("Could not retrieve complaints:", err));
  }, [currentUser]);

  const logout = () => {
    localStorage.removeItem("comfort_pg_token");
    setCurrentUser(null);
    setActiveBookings([]);
    setGlobalComplaints([]);
  };

  const refreshUserData = async () => {
    try {
      const user = await apiClient.get<UserSession>("/api/auth/me");
      if (user) {
        setCurrentUser(user);
      }
    } catch (err) {
      console.warn("Failed to refresh user data:", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthOpen,
        setIsAuthOpen,
        selectedRoom,
        setSelectedRoom,
        activeRooms,
        setActiveRooms,
        activeBookings,
        setActiveBookings,
        globalComplaints,
        setGlobalComplaints,
        logout,
        refreshUserData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
