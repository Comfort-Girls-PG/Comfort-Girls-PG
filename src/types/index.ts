export enum RoomType {
  Single = "Single Sharing",
  Double = "Double Sharing",
  Triple = "Triple Sharing"
}

export interface Roommate {
  name: string;
  avatar: string;
  college: string;
  hobbies: string[];
}

export interface RoomReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  price: number; // monthly base
  deposit: number; // security deposit
  priceRange?: string;
  depositRange?: string;
  size: string; // e.g. "220 sq ft"
  availability: number; // how many slots left
  images: string[];
  amenities: string[];
  rules: string[];
  description: string;
  roommates: Roommate[];
  reviews?: RoomReview[];
  rating: number;
  nearbyColleges: { collegeId: string; distance: string }[];
}

export interface AmenityItem {
  id: string;
  name: string;
  iconName: string;
  category: "Safety" | "Living" | "Utilities" | "Wellness";
  description: string;
}

export interface WhyChooseUsTimeline {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

export interface Testimonial {
  id: string;
  residentName: string;
  residentImage: string;
  review: string;
  rating: number;
  college: string;
  roomType: string;
}

export interface NearbyCollege {
  id: string;
  name: string;
  distance: string;
  timeByCab: string;
}

export interface DetailedNearbyPlace {
  name: string;
  category: "Colleges / Universities" | "Malls" | "Companies";
  distance: string;
  timeByCab: string;
}

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  sharingType: RoomType;
  scheduleVisitDate: string | null; // null if direct booking
  documentType: string;
  documentUrl: string;
  paidAmount: number;
  couponCode: string;
  paymentMethod: "UPI" | "Card" | "Net Banking";
  status: "Pending Approval" | "Visit Scheduled" | "Approved" | "Completed" | "Active";
  invoiceNo: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  userId: string;
  type: "Plumbing" | "Electrical" | "WiFi" | "Housekeeping" | "Food" | "Others";
  subject: string;
  details: string;
  status: "Logged" | "In Progress" | "Resolved";
  urgency: "Medium" | "High";
  createdAt: string;
  resolvedAt?: string;
}

export interface FoodMenuDay {
  day: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}

export interface VisitorPass {
  id: string;
  visitorName: string;
  relation: string;
  date: string;
  timeIn: string;
  timeOut: string;
  purpose: string;
  status: "Active" | "Expired" | "Pending";
  tokenCode: string;
}

export interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  parentApprovalStatus: "Pending" | "Approved" | "Rejected";
  status: "Pending" | "Approved" | "Rejected";
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  avatar: string;
  documentVerified: boolean;
  status: "Resident" | "Visitor" | "None" | "Admin";
  bookedRoomId: string | null;
  notifications: { id: string; title: string; message: string; date: string; read: boolean }[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Booking & Payments" | "Amenities & Security" | "Rules & Food";
}
