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
      "/Single.png"
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
    price: 10000,
    deposit: 18000,
    priceRange: "₹10,000",
    depositRange: "₹18,000",
    size: "220 - 240 sq ft",
    availability: 4,
    images: [
      "/Double.png"
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
    id: "suite-double-cooler",
    name: "Double Seater (Cooler)",
    type: RoomType.Double,
    price: 9500,
    deposit: 15000,
    priceRange: "₹9,500",
    depositRange: "₹15,000",
    size: "220 - 240 sq ft",
    availability: 5,
    images: [
      "/Double.png"
    ],
    amenities: ["four times Meal", "Two times Tea", "Free WIFI", "Washing Machine", "Common kitchen", "Common Fridge", "Common RO", "Daily room cleaning", "Washroom cleaning", "Cooler/Fan"],
    rules: ["No loud video calls inside after 11PM", "Share cleanup responsibilities fairly", "No heating appliances inside"],
    description: "Aesthetic spacious double sharing cooler room with personalized drawers, dual study workspaces, and shared balcony access.",
    rating: 4.6,
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
      "/Triple.png"
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
      "/Triple.png"
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
    residentName: "Ananya Sharma",
    residentImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    review: "I have lived at Comfort Girls PG for 2 years while doing my MBA. The security is outstanding - the biometric entrance and female security guards really give me and my parents 100% peace of mind. The study room has been a savior during late-night projects!",
    rating: 5,
    college: "Management Graduate",
    roomType: "Single Seater (AC)"
  },
  {
    id: "test-2",
    residentName: "Priya Singh",
    residentImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    review: "The food here is simply the best. Unlike other PG mess where food is oily and heavy, Comfort PG serves delicious, high-protein organic food. Housekeeping does deep cleaning daily, and the staff feels like an extended family.",
    rating: 5,
    college: "Engineering Student",
    roomType: "Double Seater (AC)"
  },
  {
    id: "test-3",
    residentName: "Neha Gupta",
    residentImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
    review: "The reservation flow is exceptionally fast. I did my room mapping and booked physical visitation online. Moving in was smooth, completed all layout checks on-board and paid electronically. Highly suggest to any student!",
    rating: 4.8,
    college: "Computer Science Graduate",
    roomType: "Single Seater (AC)"
  },
  {
    id: "test-4",
    residentName: "Pooja Verma",
    residentImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    review: "I loved the community celebrations and movies we assemble over in the central courtyard! Living here is a breeze, the generators cope up seamlessly and fast laundry turnaround is a massive relief.",
    rating: 5,
    college: "Design & Arts Student",
    roomType: "Triple Seater (AC)"
  },
  {
    id: "test-5",
    residentName: "Riya Mehta",
    residentImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150",
    review: "Affordable and truly upscale living space. Having comfortable roommate indexing on dashboard made matching with Ananya so perfect. We became solid friends!",
    rating: 4.9,
    college: "Law Graduate",
    roomType: "Double Seater (AC)"
  }
];

export const MOCK_GALLERY: GalleryItem[] = [
  { id: "g-1", title: "Premium Double Sharing Room", category: "Rooms", imageUrl: "https://lh3.googleusercontent.com/d/1zse7mJuhjmUzMr1wgNc74k1wZXpc34rg" },
  { id: "g-2", title: "Scenic Balcony Area", category: "Balcony", imageUrl: "https://lh3.googleusercontent.com/d/1ylk-KbkSXE6MFVqhw3url208fNmvPxxR" },
  { id: "g-3", title: "Cozy Bedroom Layout", category: "Rooms", imageUrl: "https://lh3.googleusercontent.com/d/1y2vETxeM1JrPpKqpL9bILVrxHkLnlg7k" },
  { id: "g-4", title: "Comfort Single Bed Setup", category: "Rooms", imageUrl: "https://lh3.googleusercontent.com/d/1uZ6AY4vGpbpyJqpTxudWbmXi_oVWJfLp" },
  { id: "g-5", title: "Premium Room Interior", category: "Rooms", imageUrl: "https://lh3.googleusercontent.com/d/1tfgK68mlYYR20SzMhtOnUqI1xv7KorTo" },
  { id: "g-6", title: "Neat Triple Sharing Layout", category: "Rooms", imageUrl: "https://lh3.googleusercontent.com/d/1tFLBhC7JFrk_G7VRb6rMlO5KdSu2bCA0" },
  { id: "g-7", title: "Personal Wooden Wardrobes", category: "Rooms", imageUrl: "https://lh3.googleusercontent.com/d/1srqpkUyBAU0QQ0HKpC8h_AKmMso_gjTT" },
  { id: "g-8", title: "Bright Triple Sharing Room", category: "Rooms", imageUrl: "https://lh3.googleusercontent.com/d/1sJ0pZmItqqP27Ae5etAqS4jGaSr76EUz" },
  { id: "g-9", title: "High-Efficiency Split AC", category: "Amenities", imageUrl: "https://lh3.googleusercontent.com/d/1r86Va5JgoWe8r7nBmeXnPHxqk2EDRPG2" },
  { id: "g-10", title: "Spacious Student Room View", category: "Rooms", imageUrl: "https://lh3.googleusercontent.com/d/1qMg1Rql1q9mew7PD9JZNJXcHCSGd4Ezr" },
  { id: "g-11", title: "Clean Shared Kitchen Space", category: "Kitchen", imageUrl: "https://lh3.googleusercontent.com/d/1q3wvVe0j1EgkmPWHGq0OIof8f72k0-gw" },
  { id: "g-12", title: "Attached Balcony Sitout", category: "Balcony", imageUrl: "https://lh3.googleusercontent.com/d/1ozszK3nUlN6wcWn84INJ3hCYu6vj2iJQ" },
  { id: "g-13", title: "Premium Double Bed Suite", category: "Rooms", imageUrl: "https://lh3.googleusercontent.com/d/1naYixYQBaVanreE0kMVh2ElAObwjVKsH" },
  { id: "g-14", title: "Ventilated Balcony View", category: "Balcony", imageUrl: "https://lh3.googleusercontent.com/d/1lYvjpA_OSovPxIK0Hj9MnxkYcmWqSydG" },
  { id: "g-15", title: "Welcome Foyer Entrance", category: "Lobby & Entrance", imageUrl: "https://lh3.googleusercontent.com/d/1fF1-YNPoX5IPU5IHGDUPkAg22oaN4KlJ" },
  { id: "g-16", title: "Neat Room Bed Setting", category: "Rooms", imageUrl: "https://lh3.googleusercontent.com/d/1d-vB6fouXibNRuXPghgXmPkP5xUeJ-QH" },
  { id: "g-17", title: "Modern Tiled Washroom", category: "Washroom", imageUrl: "https://lh3.googleusercontent.com/d/1Xy2HbfpZXtD7OIZxhx90WxE6zVvlFLJH" },
  { id: "g-18", title: "Spacious Clothes Wardrobe", category: "Rooms", imageUrl: "https://lh3.googleusercontent.com/d/1Xmj2E-PXR-tTNJFjLv46Gdpsdugjk66H" },
  { id: "g-19", title: "Polished Reception Lobby", category: "Lobby & Entrance", imageUrl: "https://lh3.googleusercontent.com/d/1XlpFkpBV95qKFvlbv-UqaeVg1f-BKr4q" },
  { id: "g-20", title: "Attached Sanitary Bathroom", category: "Washroom", imageUrl: "https://lh3.googleusercontent.com/d/1WQbsAASaU7Wz7PQQjsxYpzxd8aSk-50I" },
  { id: "g-21", title: "Spacious Well-lit Corridor", category: "Lobby & Entrance", imageUrl: "https://lh3.googleusercontent.com/d/1W612SVUwL_CfZiwXd8Upj3-dbHBggi8O" },
  { id: "g-22", title: "Modern Single Occupancy Room", category: "Rooms", imageUrl: "https://lh3.googleusercontent.com/d/1SvL6EkJ-WlNVHSFnnlb-mpo9P5_281P-" },
  { id: "g-23", title: "Hygienic Bathroom Fittings", category: "Washroom", imageUrl: "https://lh3.googleusercontent.com/d/1OJY-6mv6J0K8gF2r-waUGMpT89PnwhNN" },
  { id: "g-24", title: "Comfortable Sitting Lobby", category: "Lobby & Entrance", imageUrl: "https://lh3.googleusercontent.com/d/1O3wZuTjTpd0FglJYHYLWdPMuh7bYQBd0" },
  { id: "g-25", title: "Visitor Meeting Lounge", category: "Lobby & Entrance", imageUrl: "https://lh3.googleusercontent.com/d/1NJxDbVA3HaODqBCWm4z85hWRuhiq0HYQ" },
  { id: "g-26", title: "Safety Security Corridor", category: "Lobby & Entrance", imageUrl: "https://lh3.googleusercontent.com/d/1KzEYDGgEbMlLk_dLVwFZVc89p8p1oqL6" },
  { id: "g-27", title: "Deluxe Balcony Room Option", category: "Rooms", imageUrl: "https://lh3.googleusercontent.com/d/1IbS1dtGPJg-Gokjr2ad03JWp2T9qPGJk" },
  { id: "g-28", title: "Modular Common Kitchen", category: "Kitchen", imageUrl: "https://lh3.googleusercontent.com/d/1C4FLQ4OxnQGJ_VU91qVinmx4fuIDtj8i" },
  { id: "g-29", title: "Polished Ground Floor Lobby", category: "Lobby & Entrance", imageUrl: "https://lh3.googleusercontent.com/d/1B8C7XJLE23MReTbiNCT6A_63QYs450E8" },
  { id: "g-30", title: "Individual Room AC Control", category: "Amenities", imageUrl: "https://lh3.googleusercontent.com/d/1AkMGoD0m17dB85fpUjKhe6bRp1gHEHI3" },
  { id: "g-31", title: "First Floor Security Corridor", category: "Lobby & Entrance", imageUrl: "https://lh3.googleusercontent.com/d/1AXYdDmknJZz7DoYebiqFnlYNrCcG2sd2" },
  { id: "g-32", title: "High-Focus Quiet Study Lounge", category: "Amenities", imageUrl: "https://lh3.googleusercontent.com/d/18FmWMnxYUV9mfL0GzY83KJyU_e_Ccs3L" },
  { id: "g-33", title: "Standard Triple Room Unit", category: "Rooms", imageUrl: "https://lh3.googleusercontent.com/d/17zZcbmOdlQcHh9Igcvc0EH35eKmfKPWc" },
  { id: "g-34", title: "Deluxe Single Bed Layout", category: "Rooms", imageUrl: "https://lh3.googleusercontent.com/d/17IOrhN9BmH4wv6wPRn_Es9JZnN8jFyzy" },
  { id: "g-35", title: "Main Biometric Entrance Gate", category: "Lobby & Entrance", imageUrl: "https://lh3.googleusercontent.com/d/171mt5ujsqsMbUbKAJLrNmyU8Yz01-2jm" },
  { id: "g-36", title: "Cozy Double Sharing Bed View", category: "Rooms", imageUrl: "https://lh3.googleusercontent.com/d/16Gcpays0hMG8v58pshwSH4O7yCB8_xFl" },
  { id: "g-37", title: "Room Interior and Lighting", category: "Rooms", imageUrl: "https://lh3.googleusercontent.com/d/16AiZv9MOb9TxOuw0DSUGOjDcpmJBeHM-" },
  { id: "g-38", title: "Modern Clean Washroom Suite", category: "Washroom", imageUrl: "https://lh3.googleusercontent.com/d/11C1uIkG-L0QxUgYqQg_PUhWYh34a9hMa" },
  { id: "g-39", title: "Main Gate Foyer Entrance", category: "Lobby & Entrance", imageUrl: "https://lh3.googleusercontent.com/d/100cenSVTNM-DZwlbZo3_VWB73Etpfqtj" },
  { id: "g-40", title: "Common RO Water Purifier", category: "Amenities", imageUrl: "https://lh3.googleusercontent.com/d/1-pUP2tWfLYc5xFYZZAiCZhscxVVi3ms2" },
  { id: "g-41", title: "Weekly Balanced Food Menu", category: "Food Menu", imageUrl: "https://lh3.googleusercontent.com/d/1AdO9E13LslfAxWBfqPMaj8Hy3OW-rBWs" }
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
  // --- GENERAL ---
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
  },

  // --- SAFETY ---
  {
    id: "fq-s1",
    question: "What security measures are in place at Comfort Girls PG?",
    answer: "We have 24/7 CCTV surveillance across all corridors and common spaces, biometric access gates, professional female security guards, and a resident warden present at all times to ensure maximum safety.",
    category: "Safety"
  },
  {
    id: "fq-s2",
    question: "Can guests or visitors visit my room?",
    answer: "For security and privacy reasons, male visitors are strictly restricted to the lobby reception area. Female visitors and mothers can visit rooms only with pre-authorization and entry logs from the warden.",
    category: "Safety"
  },
  {
    id: "fq-s3",
    question: "How do you handle medical emergencies?",
    answer: "We have a first-aid station on site, tie-ups with nearby multi-specialty hospitals, and a 24/7 on-call vehicle for medical transit. The warden is trained to coordinate emergencies immediately.",
    category: "Safety"
  },
  {
    id: "fq-s4",
    question: "Are there fire safety systems installed?",
    answer: "Yes, the building is fully equipped with fire extinguishers on every floor, smoke detectors in rooms, clear emergency exit pathways, and we conduct regular evacuation drills.",
    category: "Safety"
  },

  // --- MESS ---
  {
    id: "fq-5",
    question: "Are daily balanced meals included in the monthly rent price?",
    answer: "Absolutely! Our monthly PG rent includes four gourmet balanced meals (Breakfast, Lunch, High Tea snacks, and Dinner) completely free. Feeding menus are updated weekly in your dashboard and certified by nutritional experts.",
    category: "Mess"
  },
  {
    id: "fq-m1",
    question: "Can I get special meals if I am sick?",
    answer: "Yes, if you are unwell, you can inform the kitchen staff or log a request in the app to receive light, non-spicy meals like khichdi, porridge, or warm soup.",
    category: "Mess"
  },
  {
    id: "fq-m2",
    question: "What are the timings for the mess?",
    answer: "Timings are: Breakfast (8:00 AM – 9:30 AM), Lunch (1:00 PM – 2:30 PM), Snacks & Tea (5:00 PM – 6:00 PM), and Dinner (8:00 PM – 9:30 PM).",
    category: "Mess"
  },
  {
    id: "fq-m3",
    question: "Is the kitchen staff trained in hygiene standards?",
    answer: "Yes, our kitchen staff undergoes periodic health checkups and adheres strictly to hygiene guidelines, including wearing gloves, hairnets, and daily sanitization of the cooking area.",
    category: "Mess"
  },

  // --- BOOKING & DEPOSIT ---
  {
    id: "fq-3",
    question: "How does security document verification work?",
    answer: "We mandate Government ID verification (Aadhaar/Passport) and College ID or Employment allocation documentation. You can upload digital copies inside our clean digital onboarding flow or complete it on site. Digital approvals finish within 12 hours.",
    category: "Deposit & Rules"
  },
  {
    id: "fq-4",
    question: "Is there an advance notification required before moving out?",
    answer: "Yes, we require a strict 30-day notice period submitted easily on your student dashboard. This allows our accounting module to process your full security deposit refunded in max 7 bank days from exit date.",
    category: "Deposit & Rules"
  },
  {
    id: "fq-6",
    question: "How do security deposits compare, and is there any registration surcharge?",
    answer: "Our security deposit is totally transparent, roughly 1.5 months of your monthly rent, totally refundable. We protect our residents by charging 0 extra administration fees and zero brokerage.",
    category: "Deposit & Rules"
  },
  {
    id: "fq-bd1",
    question: "Are there any extra maintenance or electricity charges?",
    answer: "No, there are no hidden maintenance fees. Room cleaning and high-speed wifi are included. Electricity charges are calculated transparently based on individual sub-meter readings for AC usage.",
    category: "Deposit & Rules"
  }
];
