import { Room, RoomType, AmenityItem, WhyChooseUsTimeline, GalleryItem, Testimonial, NearbyCollege, FAQItem, FoodMenuDay, DetailedNearbyPlace } from "../types";

export const MOCK_COLLEGES: NearbyCollege[] = [
  { id: "colleges", name: "Top Academic Colleges & Institutes", distance: "0.5 - 1.5 km", timeByCab: "3 mins" },
  { id: "companies", name: "Major IT Parks & Corporate Offices", distance: "1.2 - 2.5 km", timeByCab: "6 mins" },
  { id: "malls", name: "Premium Shopping Malls & Arcades", distance: "0.8 - 1.8 km", timeByCab: "4 mins" },
  { id: "transit", name: "Metro Station & Key Transit Terminals", distance: "0.3 km", timeByCab: "2 mins" },
  { id: "healthcare", name: "Multi-specialty Diagnostic Center", distance: "1.0 - 2.0 km", timeByCab: "5 mins" },
];

export const DETAILED_NEARBY_PLACES: DetailedNearbyPlace[] = [
  // Colleges / Universities
  { name: "Sharda University", category: "Colleges / Universities", distance: "1.2 km", timeByCab: "4 mins" },
  { name: "GNIOT Group of Institutions", category: "Colleges / Universities", distance: "0.8 km", timeByCab: "3 mins" },
  { name: "Galgotias University", category: "Colleges / Universities", distance: "4.5 km", timeByCab: "10 mins" },
  { name: "Galgotias College of Engineering and Technology", category: "Colleges / Universities", distance: "0.9 km", timeByCab: "3 mins" },
  { name: "Gautam Buddha University", category: "Colleges / Universities", distance: "5.2 km", timeByCab: "12 mins" },
  { name: "Bennett University", category: "Colleges / Universities", distance: "8.5 km", timeByCab: "15 mins" },
  { name: "ITS Engineering College", category: "Colleges / Universities", distance: "1.1 km", timeByCab: "4 mins" },
  { name: "Lloyd Institute of Engineering & Technology", category: "Colleges / Universities", distance: "1.5 km", timeByCab: "5 mins" },
  { name: "Dronacharya Group of Institutions", category: "Colleges / Universities", distance: "1.8 km", timeByCab: "6 mins" },
  { name: "IIMT College of Engineering", category: "Colleges / Universities", distance: "1.4 km", timeByCab: "5 mins" },

  // Malls
  { name: "The Grand Venice Mall", category: "Malls", distance: "2.1 km", timeByCab: "7 mins" },
  { name: "Gaur City Mall", category: "Malls", distance: "12.0 km", timeByCab: "25 mins" },
  { name: "OMAXE Connaught Place Mall", category: "Malls", distance: "2.5 km", timeByCab: "8 mins" },
  { name: "MSX Mall", category: "Malls", distance: "3.5 km", timeByCab: "10 mins" },
  { name: "Ansal Plaza", category: "Malls", distance: "1.8 km", timeByCab: "6 mins" },

  // Companies
  { name: "Technanzia Infotech Private Limited", category: "Companies", distance: "1.5 km", timeByCab: "5 mins" },
  { name: "JOYATRES TECHNOLOGY", category: "Companies", distance: "1.2 km", timeByCab: "4 mins" },
  { name: "Softgains Tech Solutions Private Limited", category: "Companies", distance: "1.7 km", timeByCab: "5 mins" },
  { name: "HCL Technologies", category: "Companies", distance: "6.0 km", timeByCab: "12 mins" },
  { name: "Infosys", category: "Companies", distance: "6.5 km", timeByCab: "13 mins" },
  { name: "Tata Consultancy Services", category: "Companies", distance: "7.0 km", timeByCab: "14 mins" },
  { name: "Wipro", category: "Companies", distance: "5.8 km", timeByCab: "11 mins" },
  { name: "Tech Mahindra", category: "Companies", distance: "6.2 km", timeByCab: "12 mins" },
];

export const MOCK_AMENITIES: AmenityItem[] = [
  { id: "meal", name: "four times Meal", iconName: "Utensils", category: "Living", description: "Preparation of home-cooked premium balanced nutritional diet, served 4 times a day." },
  { id: "tea", name: "Two times Tea", iconName: "HeartPulse", category: "Living", description: "Refreshing hot milk tea or herbal tea served twice daily during active study durations." },
  { id: "wifi", name: "Free WIFI", iconName: "Wifi", category: "Utilities", description: "Unlimited symmetrical fiber-optic net access with multi-node access nodes." },
  { id: "washing", name: "Washing Machine", iconName: "Shirt", category: "Utilities", description: "Premium laundry lounge with commercial heavy-duty washing setup for self laundry." },
  { id: "kitchen", name: "Common kitchen", iconName: "ChefHat", category: "Living", description: "Spacious integrated self-cooking setup complete with inductions, microwave, and utensils." },
  { id: "fridge", name: "Common Fridge", iconName: "Gem", category: "Living", description: "Access to double-door heavy cooling storage systems to store juices, milk, and snacks." },
  { id: "ro", name: "Common RO", iconName: "Droplet", category: "Utilities", description: "5-stage industrial RO filtration water system assuring safe mineral drinking water access." },
  { id: "cleaning", name: "Daily room cleaning", iconName: "Sparkles", category: "Utilities", description: "Professional daily housekeeping cycle for floor sweeping, wiping, and trash sorting." },
  { id: "washroom", name: "Washroom cleaning", iconName: "ShieldCheck", category: "Utilities", description: "Systematic deep-cleaning, high-pressure scrubbing, and sanitary washing cycles weekly." }
];

export const WHY_CHOOSE_US_TIMELINE: WhyChooseUsTimeline[] = [
  { id: "1", title: "Uncompromised Safe Haven", description: "Our 5-tier safety shield (Biometrics, CCTV, Wardens, Medical assist, Locked hours) guarantees a bulletproof layer of security for absolute peace of mind.", iconName: "HeartHandshake" },
  { id: "2", title: "Luxury Redefined, Budget Maintained", description: "Get the features of high-end startup co-living at straightforward, fully-inclusive PG price tags with zero hidden registration items.", iconName: "Gem" },
  { id: "3", title: "Strategic Prime Connectivity", description: "Located right in major educational and IT corridors, within walking distance from key colleges, companies, and popular malls, keeping your daily transit under 10 minutes.", iconName: "MapPin" },
  { id: "4", title: "No Hustle Digital Management", description: "Book rooms, coordinate leaves, log complaints, check food menus, and pay deposits right from our online resident engine.", iconName: "Smartphone" },
  { id: "5", title: "Nutrition-First Gourmet Kitchen", description: "Our custom menu provides home-cooked, certified high-protein, hygienic meals prepared with cold-pressed oils and high hygiene protocols.", iconName: "Salad" },
  { id: "6", title: "Flourishing Academic Atmosphere", description: "Individual high-speed internet capsules and silent study lounges ensure you have an ecosystem that inspires performance and high research focus.", iconName: "Award" },
  { id: "7", title: "Hyper-Hygienic Maintenance", description: "Trained housekeeping specialists operate daily on professional cycles, maintaining premium sanitation values.", iconName: "CheckCircle" },
  { id: "8", title: "Interactive Community Evenings", description: "Monthly stress-buster movie nights, soft skill development workshops, and festive community meals that make you feel truly connected.", iconName: "Users" },
  { id: "9", title: "Transparent 100% Document Portal", description: "Digital rent receipts, verified digital tenancy license contracts, and lightning-fast deposit returns upon successful notice cycle.", iconName: "FileText" }
];

export const MOCK_ROOMS: Room[] = [
  {
    id: "suite-single-ac",
    name: "Single Seater (AC)",
    type: RoomType.Single,
    price: 20000,
    deposit: 30000,
    priceRange: "₹20,000 - ₹28,000",
    depositRange: "₹30,000 - ₹40,000",
    size: "160 - 180 sq ft",
    availability: 3,
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800"
    ],
    amenities: ["four times Meal", "Two times Tea", "Free WIFI", "Washing Machine", "Common kitchen", "Common Fridge", "Common RO", "Daily room cleaning", "Washroom cleaning", "AC"],
    rules: ["No loud music after 10PM", "Pre-approve outside guests", "Smoking is strictly prohibited"],
    description: "Super-premium private single AC room loaded with deluxe ergonomic layout, soft display light panel, and full personal study space.",
    rating: 4.9,
    nearbyColleges: [
      { collegeId: "colleges", distance: "0.8 km" }
    ],
    roommates: []
  },
  {
    id: "suite-double-ac",
    name: "Double Seater (AC)",
    type: RoomType.Double,
    price: 11000,
    deposit: 18000,
    priceRange: "₹11,000 - ₹15,000",
    depositRange: "₹18,005 - ₹22,000",
    size: "220 - 240 sq ft",
    availability: 4,
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1560185127-6a2806647f81?auto=format&fit=crop&q=80&w=800"
    ],
    amenities: ["four times Meal", "Two times Tea", "Free WIFI", "Washing Machine", "Common kitchen", "Common Fridge", "Common RO", "Daily room cleaning", "Washroom cleaning", "AC"],
    rules: ["No loud video calls inside after 11PM", "Share cleanup responsibilities fairly", "No heating appliances inside"],
    description: "Aesthetic spacious double sharing AC room with personalized drawers, dual study workspaces, and shared balcony access.",
    rating: 4.7,
    nearbyColleges: [
      { collegeId: "colleges", distance: "0.8 km" }
    ],
    roommates: []
  },
  {
    id: "suite-triple-ac",
    name: "Triple Seater (AC)",
    type: RoomType.Triple,
    price: 9000,
    deposit: 12000,
    priceRange: "₹9,000 - ₹11,000",
    depositRange: "₹12,000 - ₹15,000",
    size: "280 - 300 sq ft",
    availability: 6,
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800"
    ],
    amenities: ["four times Meal", "Two times Tea", "Free WIFI", "Washing Machine", "Common kitchen", "Common Fridge", "Common RO", "Daily room cleaning", "Washroom cleaning", "AC"],
    rules: ["Lights out by 11:30 PM", "No visitors allowed overnight"],
    description: "High-comfort economic triple sharing AC room with daily deep sweep cleaning, high-speed internet, and dedicated study tables.",
    rating: 4.5,
    nearbyColleges: [
      { collegeId: "colleges", distance: "0.8 km" }
    ],
    roommates: []
  },
  {
    id: "suite-triple-cooler",
    name: "Triple Seater (Cooler)",
    type: RoomType.Triple,
    price: 8500,
    deposit: 10000,
    priceRange: "₹8,500",
    depositRange: "₹10,000",
    size: "280 sq ft",
    availability: 8,
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1560185127-6a2806647f81?auto=format&fit=crop&q=80&w=800"
    ],
    amenities: ["four times Meal", "Two times Tea", "Free WIFI", "Washing Machine", "Common kitchen", "Common Fridge", "Common RO", "Daily room cleaning", "Washroom cleaning", "Cooler/Fan"],
    rules: ["Regular housekeeping cooperation", "Warden permission for room assembly"],
    description: "Economical and extremely spacious non-AC room equipped with high-delivery desert cooler, direct air circulation, and spacious private Closets.",
    rating: 4.3,
    nearbyColleges: [
      { collegeId: "colleges", distance: "0.8 km" }
    ],
    roommates: []
  }
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    residentName: "Aishwarya Ranade",
    residentImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    review: "I have lived at Comfort Girls PG for 2 years while doing my MBA. The security is outstanding - the biometric entrance and female security guards really give me and my parents 100% peace of mind. The study room has been a savior during late-night projects!",
    rating: 5,
    college: "Management Graduate",
    roomType: "Single Seater (AC)"
  },
  {
    id: "test-2",
    residentName: "Riya Kapoor",
    residentImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    review: "The food here is simply the best. Unlike other PG mess where food is oily and heavy, Comfort PG serves delicious, high-protein organic food. Housekeeping does deep cleaning daily, and the staff feels like an extended family.",
    rating: 5,
    college: "Engineering Student",
    roomType: "Double Seater (AC)"
  },
  {
    id: "test-3",
    residentName: "Tanvi Saxena",
    residentImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
    review: "The reservation flow is exceptionally fast. I did my room mapping and booked physical visitation online. Moving in was smooth, completed all layout checks on-board and paid electronically. Highly suggest to any student!",
    rating: 4.8,
    college: "Computer Science Graduate",
    roomType: "Single Seater (AC)"
  },
  {
    id: "test-4",
    residentName: "Devika Nair",
    residentImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    review: "I loved the community celebrations and movies we assemble over in the central courtyard! Living here is a breeze, the generators cope up seamlessly and fast laundry turnaround is a massive relief.",
    rating: 5,
    college: "Design & Arts Student",
    roomType: "Triple Seater (AC)"
  },
  {
    id: "test-5",
    residentName: "Kriti Jaiswal",
    residentImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150",
    review: "Affordable and truly upscale living space. Having comfortable roommate indexing on dashboard made matching with Ananya so perfect. We became solid friends!",
    rating: 4.9,
    college: "Law Graduate",
    roomType: "Double Seater (AC)"
  }
];

export const MOCK_GALLERY: GalleryItem[] = [
  // --- ROOMS ---
  { id: "g-r-1", title: "Premium Master Bed Unit", category: "Rooms", imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600" },
  { id: "g-r-2", title: "Cozy Double Sharing Setup", category: "Rooms", imageUrl: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600" },
  { id: "g-r-3", title: "Classic Triple Sharing Suite", category: "Rooms", imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600" },
  { id: "g-r-4", title: "Luxury Study Corner Unit", category: "Rooms", imageUrl: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=600" },
  { id: "g-r-5", title: "Under-Bed Slide Storage Beds", category: "Rooms", imageUrl: "https://images.unsplash.com/photo-1560185127-6a2806647f81?auto=format&fit=crop&q=80&w=600" },

  // --- BALCONY ---
  { id: "g-b-1", title: "Lush Green Balcony Views", category: "Balcony", imageUrl: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=600" },
  { id: "g-b-2", title: "Attached Balcony Sitout Area", category: "Balcony", imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600" },

  // --- WASHROOM ---
  { id: "g-ws-1", title: "Clean Sanitary Fittings", category: "Washroom", imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600" },
  { id: "g-ws-2", title: "Modern Ceramic Vanity Basin", category: "Washroom", imageUrl: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=600" },

  // --- KITCHEN ---
  { id: "g-k-1", title: "Modular Self-Cooking Kitchen", category: "Kitchen", imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600" },

  // --- LOBBY & ENTRANCE ---
  { id: "g-le-1", title: "Entrance Foyer Gates", category: "Lobby & Entrance", imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600" },
  { id: "g-le-2", title: "Visitor Meeting Reception Bay", category: "Lobby & Entrance", imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600" },

  // --- AMENITIES ---
  { id: "g-a-1", title: "High-Focus Quiet Library Lounge", category: "Amenities", imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600" },
  { id: "g-a-2", title: "Modern Multi-Gym Activity Zone", category: "Amenities", imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600" }
];

export const WEEKLY_FOOD_MENU: FoodMenuDay[] = [
  {
    day: "Monday",
    breakfast: "Poha + Roti + Sabji (8:00 – 9:30 AM)",
    lunch: "Rice & Roti, Soyabean Aloo Sabzi (1:00 – 2:30 PM)",
    snacks: "Tea & Bread Pakauda (5:00 – 6:00 PM)",
    dinner: "Rice & Roti, Arhar Dal & Sabzi (8:00 – 9:30 PM)"
  },
  {
    day: "Tuesday",
    breakfast: "Aloo Paratha + Dahi (8:00 – 9:30 AM)",
    lunch: "Rice & Roti, Dal Sabji (1:00 – 2:30 PM)",
    snacks: "Macaroni & Tea (5:00 – 6:00 PM)",
    dinner: "Rice & Roti, White Chhole, Halwa (2) + Kheer (2) (8:00 – 9:30 PM)"
  },
  {
    day: "Wednesday",
    breakfast: "Semayi + Sabji + Roti (8:00 – 9:30 AM)",
    lunch: "Rice & Roti, Aloo Matar (1:00 – 2:30 PM)",
    snacks: "Butter Bread & Tea (5:00 – 6:00 PM)",
    dinner: "Rice & Roti, Dal Sabji (8:00 – 9:30 PM)"
  },
  {
    day: "Thursday",
    breakfast: "Paratha + Sabji (8:00 – 9:30 AM)",
    lunch: "Rice & Roti, Dal & Sabzi (1:00 – 2:30 PM)",
    snacks: "Poha & Tea (5:00 – 6:00 PM)",
    dinner: "Rice & Roti, Kadhi Pakoda & Kadhi Bundi (8:00 – 9:30 PM)"
  },
  {
    day: "Friday",
    breakfast: "Macaroni + Sabji + Roti (8:00 – 9:30 AM)",
    lunch: "Rice & Roti, Rajma (1:00 – 2:30 PM)",
    snacks: "Samosa & Tea (5:00 – 6:00 PM)",
    dinner: "Rice & Roti, Dal Makhani + Sabji (8:00 – 9:30 PM)"
  },
  {
    day: "Saturday",
    breakfast: "Matar Paratha, Aloo Puri (8:00 – 9:30 AM)",
    lunch: "Chowmein (2), Taheri + Rayta, Dal + Rice & Roti (1:00 – 2:30 PM)",
    snacks: "Namkeen + Biscuit & Tea (5:00 – 6:00 PM)",
    dinner: "Rice & Roti, Kale Chane (8:00 – 9:30 PM)"
  },
  {
    day: "Sunday",
    breakfast: "Paneer Paratha (2), Chhole Bhature (2) (8:00 – 9:30 AM)",
    lunch: "Chowmein (2), Taheri + Rayta, Dal + Rice & Roti (1:00 – 2:30 PM)",
    snacks: "Ginger Tea (5:00 – 6:00 PM)",
    dinner: "Idli Sambhar, Palak, Matar (Paneer), Kheer Puri + Aloo Sabji (8:00 – 9:30 PM)"
  }
];

export const MOCK_FAQ: FAQItem[] = [
  {
    id: "fq-1",
    question: "What is the guest gate closing time at Comfort Girls PG?",
    answer: "For resident security, our entry biometric gates shut at 10:30 PM. Residents requiring late returns due to classes or night shifts can easily pre-approve entry via the Resident Portal dashboard, which issues a secure entry check to the warden and guard.",
    category: "General"
  },
  {
    id: "fq-2",
    question: "Do you allow parental or guardian stay overs?",
    answer: "Mothers are welcome to stay in our dedicated guest room for up to 3 nights with advance booking on the dashboard. Male guardians are not permitted to visit rooms or stay overnight, and must meet in the visitor reception lounge.",
    category: "General"
  },
  {
    id: "fq-3",
    question: "How does security document verification work?",
    answer: "We mandate Government ID verification (Aadhaar/Passport) and College ID or Employment allocation documentation. You can upload digital copies inside our clean digital onboarding flow or complete it on site. Digital approvals finish within 12 hours.",
    category: "Booking & Payments"
  },
  {
    id: "fq-4",
    question: "Is there an advance notification required before moving out?",
    answer: "Yes, we require a strict 30-day notice period submitted easily on your student dashboard. This allows our accounting module to process your full security deposit refunded in max 7 bank days from exit date.",
    category: "Booking & Payments"
  },
  {
    id: "fq-5",
    question: "Are daily balanced meals included in the monthly rent price?",
    answer: "Absolutely! Our monthly PG rent includes four gourmet balanced meals (Breakfast, Lunch, High Tea snacks, and Dinner) completely free. Feeding menus are updated weekly in your dashboard and certified by nutritional experts.",
    category: "Rules & Food"
  },
  {
    id: "fq-6",
    question: "How do security deposits compare, and is there any registration surcharge?",
    answer: "Our security deposit is totally transparent, roughly 1.5 months of your monthly rent, totally refundable. We protect our residents by charging 0 extra administration fees and zero brokerage.",
    category: "Booking & Payments"
  },
  {
    id: "fq-7",
    question: "Can I choose my roommates?",
    answer: "When booking a Duo or Trio room, you can view the educational background and general hobbies of active residents inside that room before conforming. You can also send them an introduction request!",
    category: "General"
  },
  {
    id: "fq-8",
    question: "What items do I need to bring at move-in?",
    answer: "Your premium room comes key-ready with high quality foam mattresses, a study desk, custom wardrobe, attached curtains and television. You only need to bring personal linens, books, laptops and personal vanity items.",
    category: "General"
  }
];
