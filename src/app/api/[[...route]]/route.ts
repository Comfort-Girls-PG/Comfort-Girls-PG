import { NextResponse } from "next/server";
import { dbStore, getDbStatus } from "../../../lib/db";
import { getAuthenticatedUser, generateToken } from "../../../lib/auth";
import {
  generateOtp,
  verifyOtp,
  sendOtpEmail,
  generateVerificationToken,
  verifyVerificationToken,
  sendVerificationEmail,
  sendNotificationEmail
} from "../../../lib/email";
import bcrypt from "bcryptjs";

// Custom helper to run role assertions on the authenticated user
function authorize(user: any, allowedRoles: string[]) {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}

async function addNotification(userId: string, title: string, message: string) {
  try {
    const user = await dbStore.users.findById(userId);
    if (!user) return;

    // 1. Add to database notification array
    const activeNotifs = user.notifications || [];
    activeNotifs.unshift({
      id: `not-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title,
      message,
      date: new Date().toISOString().split("T")[0],
      read: false
    });
    await dbStore.users.findByIdAndUpdate(userId, {
      notifications: activeNotifs
    });

    // 2. Send email notification
    const emailTarget = user.status === "Admin" ? "contact@comfortgirlspg.live" : user.email;
    await sendNotificationEmail(emailTarget, title, title, message);
  } catch (err) {
    console.error("Error dispatching notification:", err);
  }
}

// -------------------------------------------------------------
// GET METHOD ROUTER
// -------------------------------------------------------------
export async function GET(request: Request, props: { params: Promise<{ route?: string[] }> }) {
  try {
    const params = await props.params;
    const route = params.route || [];
    const path = route.join("/");

    if (path === "") {
      return NextResponse.json({
        success: true,
        message: "Comfort Girls PG Secure API Engine is live and operational.",
        ...getDbStatus()
      });
    }

    // 1. Database Status
    if (path === "db-status") {
      return NextResponse.json({
        success: true,
        ...getDbStatus()
      });
    }

    // 2. Email verification click
    if (path === "auth/verify") {
      const { searchParams } = new URL(request.url);
      const token = searchParams.get("token");

      if (!token) {
        return new NextResponse(
          `<html>
            <body style="font-family: 'Segoe UI', system-ui, sans-serif; text-align: center; padding: 100px 24px; background-color: #f8fafc; color: #0f172a;">
              <div style="max-width: 450px; margin: 0 auto; background: white; padding: 40px; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                <p style="font-size: 48px; margin: 0 0 10px 0;">🛡️</p>
                <h1 style="color: #ef4444; font-size: 24px; font-weight: 700; margin: 0 0 15px 0;">Verification Key Missing</h1>
                <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">The verification parameters provided are invalid or absent. Please make sure you copied the correct link from your email.</p>
                <a href="/" style="display: inline-block; padding: 12px 24px; background: #db2777; color: white; text-decoration: none; font-weight: 600; border-radius: 12px; font-size: 14px;">Return Home</a>
              </div>
            </body>
          </html>`,
          { headers: { "Content-Type": "text/html" } }
        );
      }

      const email = verifyVerificationToken(token);
      if (!email) {
        return new NextResponse(
          `<html>
            <body style="font-family: 'Segoe UI', system-ui, sans-serif; text-align: center; padding: 100px 24px; background-color: #f8fafc; color: #0f172a;">
              <div style="max-width: 450px; margin: 0 auto; background: white; padding: 40px; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                <p style="font-size: 48px; margin: 0 0 10px 0;">⏰</p>
                <h1 style="color: #f59e0b; font-size: 24px; font-weight: 700; margin: 0 0 15px 0;">Verification Link Expired</h1>
                <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">This email verification link is expired, invalid, or has already been verified.</p>
                <a href="/" style="display: inline-block; padding: 12px 24px; background: #db2777; color: white; text-decoration: none; font-weight: 600; border-radius: 12px; font-size: 14px;">Return Home</a>
              </div>
            </body>
          </html>`,
          { headers: { "Content-Type": "text/html" } }
        );
      }

      const user = await dbStore.users.findOne({ email });
      if (!user) {
        return new NextResponse(
          `<html>
            <body style="font-family: 'Segoe UI', system-ui, sans-serif; text-align: center; padding: 100px 24px; background-color: #f8fafc; color: #0f172a;">
              <div style="max-width: 450px; margin: 0 auto; background: white; padding: 40px; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                <p style="font-size: 48px; margin: 0 0 10px 0;">❓</p>
                <h1 style="color: #ef4444; font-size: 24px; font-weight: 700; margin: 0 0 15px 0;">Profile Not Found</h1>
                <p style="color: #475569; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">Could not find any student profile matched with: <strong>${email}</strong>.</p>
                <a href="/" style="display: inline-block; padding: 12px 24px; background: #db2777; color: white; text-decoration: none; font-weight: 600; border-radius: 12px; font-size: 14px;">Return Home</a>
              </div>
            </body>
          </html>`,
          { headers: { "Content-Type": "text/html" } }
        );
      }

      await dbStore.users.findByIdAndUpdate(user.id, { emailVerified: true });

      // Admin notification & email
      await addNotification(
        "usr-admin",
        "New User Registered",
        `${user.name} (${user.email}) has verified their email address and registered.`
      );

      return NextResponse.redirect(new URL("/?verified=success", request.url));
    }

    // 3. Authenticated User Profile (auth/me)
    if (path === "auth/me") {
      const activeUser = getAuthenticatedUser(request);
      if (!activeUser) {
        return NextResponse.json({ success: false, message: "User session expired or unauthorized." }, { status: 401 });
      }
      const user = await dbStore.users.findById(activeUser.id);
      if (!user) {
        return NextResponse.json({ success: false, message: "User session expired or unauthorized." }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          college: user.college,
          avatar: user.avatar,
          documentVerified: user.documentVerified,
          status: user.status,
          bookedRoomId: user.bookedRoomId,
          notifications: user.notifications
        }
      });
    }

    // 4. Retrieve rooms
    if (path === "rooms") {
      const rooms = await dbStore.rooms.find();
      return NextResponse.json({ success: true, data: rooms });
    }

    // 5. Retrieve bookings
    if (path === "bookings") {
      const activeUser = getAuthenticatedUser(request);
      if (!activeUser) {
        return NextResponse.json({ success: false, message: "Access token missing or malformed." }, { status: 401 });
      }
      let bookings;
      if (activeUser.role === "Admin") {
        bookings = await dbStore.bookings.find();
      } else {
        bookings = await dbStore.bookings.find({ userId: activeUser.id });
      }
      return NextResponse.json({ success: true, data: bookings });
    }

    // 6. Retrieve complaints
    if (path === "complaints") {
      const activeUser = getAuthenticatedUser(request);
      if (!activeUser) {
        return NextResponse.json({ success: false, message: "Access token missing or malformed." }, { status: 401 });
      }
      let complaints;
      if (activeUser.role === "Admin") {
        complaints = await dbStore.complaints.find();
      } else {
        complaints = await dbStore.complaints.find({ userId: activeUser.id });
      }
      return NextResponse.json({ success: true, data: complaints });
    }

    // 7. Food menu
    if (path === "food-menu") {
      const menu = await dbStore.foodMenus.find();
      return NextResponse.json({ success: true, data: menu });
    }

    // 8. Physical visits scheduling
    if (path === "visits") {
      const activeUser = getAuthenticatedUser(request);
      if (!activeUser) {
        return NextResponse.json({ success: false, message: "Access token missing or malformed." }, { status: 401 });
      }
      let list;
      if (activeUser.role === "Admin") {
        const rawList = await dbStore.visits.find();
        const enriched = [];
        for (const v of rawList) {
          const u = await dbStore.users.findById(v.userId);
          enriched.push({
            ...v,
            userName: u ? u.name : "Unknown Visitor",
            userEmail: u ? u.email : "",
            userPhone: u ? u.phone : ""
          });
        }
        list = enriched;
      } else {
        list = await dbStore.visits.find({ userId: activeUser.id });
      }
      return NextResponse.json({ success: true, data: list });
    }

    return NextResponse.json({ success: false, message: "API Route Not Found" }, { status: 404 });
  } catch (error: any) {
    console.error("API error in GET catch-all handler:", error);
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

// -------------------------------------------------------------
// POST METHOD ROUTER
// -------------------------------------------------------------
export async function POST(request: Request, props: { params: Promise<{ route?: string[] }> }) {
  try {
    const params = await props.params;
    const route = params.route || [];
    const path = route.join("/");
    const body = await request.json().catch(() => ({}));

    // 1. Send OTP Pin
    if (path === "auth/send-otp") {
      const { email, name, purpose } = body;
      if (!email) {
        return NextResponse.json({ success: false, message: "Recipient email address is required." }, { status: 400 });
      }

      const existingUser = await dbStore.users.findOne({ email });
      if (purpose === "forgot") {
        if (!existingUser) {
          return NextResponse.json({ success: false, message: "No profile registered with this email address." }, { status: 400 });
        }
      } else {
        if (existingUser) {
          return NextResponse.json({ success: false, message: "An account with this email already exists." }, { status: 400 });
        }
      }

      const otp = generateOtp(email);
      const sent = await sendOtpEmail(email, otp, name || (existingUser ? existingUser.name : "Student"));

      if (!sent) {
        return NextResponse.json({
          success: true,
          message: "OTP Pin simulated successfully. SMTP is not configured.",
          data: {
            success: true,
            message: "OTP Pin simulated successfully. SMTP is not configured.",
            debugOtp: otp,
          },
          debugOtp: otp,
        });
      }

      return NextResponse.json({
        success: true,
        message: "Security verification PIN sent to your email successfully.",
        data: {
          success: true,
          message: "Security verification PIN sent to your email successfully.",
        }
      });
    }

    // 2. Reset Password
    if (path === "auth/reset-password") {
      const { email, otp, newPassword } = body;
      if (!email || !otp || !newPassword) {
        return NextResponse.json({ success: false, message: "Email address, recovery PIN, and new password are required." }, { status: 400 });
      }

      const isOtpValid = verifyOtp(email, otp);
      if (!isOtpValid) {
        return NextResponse.json({ success: false, message: "Verification failed. The security PIN is invalid or has expired." }, { status: 400 });
      }

      const user = await dbStore.users.findOne({ email });
      if (!user) {
        return NextResponse.json({ success: false, message: "User profile not found." }, { status: 404 });
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);
      const updatedUser = await dbStore.users.findByIdAndUpdate(user.id, { passwordHash });

      if (!updatedUser) {
        return NextResponse.json({ success: false, message: "Failed to update profile secure passcode." }, { status: 500 });
      }

      const token = generateToken({ id: updatedUser.id, email: updatedUser.email, role: updatedUser.status });

      return NextResponse.json({
        success: true,
        message: "Passcode updated successfully.",
        data: {
          token,
          user: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            college: updatedUser.college,
            avatar: updatedUser.avatar,
            documentVerified: updatedUser.documentVerified,
            status: updatedUser.status,
            bookedRoomId: updatedUser.bookedRoomId,
            notifications: updatedUser.notifications
          }
        }
      });
    }

    // 3. User Register
    if (path === "auth/register") {
      const { name, email, password, phone, college } = body;
      if (!name || !email || !password || !phone) {
        return NextResponse.json({ success: false, message: "Please fill in all required registration fields." }, { status: 400 });
      }

      if (password.length < 4) {
        return NextResponse.json({ success: false, message: "Passcode must contain at least 4 characters." }, { status: 400 });
      }

      const cleanPhone = phone.replace(/[^0-9]/g, "");
      if (cleanPhone.length !== 10) {
        return NextResponse.json({ success: false, message: "Mobile number must be a valid 10-digit number." }, { status: 400 });
      }

      const existingUser = await dbStore.users.findOne({ email });
      if (existingUser) {
        if (existingUser.emailVerified === false) {
          const token = generateVerificationToken(email);
          const requestUrl = new URL(request.url);
          const protocol = requestUrl.protocol.replace(":", "") || "http";
          const host = requestUrl.host || "localhost:3000";
          const { sent, verificationLink } = await sendVerificationEmail(email, token, existingUser.name, host, protocol);

          return NextResponse.json({
            success: true,
            message: "An unverified account with this email already exists. A fresh verification link has been sent to your email inbox.",
            debugLink: !sent ? verificationLink : undefined
          });
        }
        return NextResponse.json({ success: false, message: "An account with this email already exists." }, { status: 400 });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      await dbStore.users.create({
        name,
        email,
        phone,
        college: college || "None",
        passwordHash,
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
        documentVerified: false,
        status: "Visitor",
        bookedRoomId: null,
        emailVerified: false,
        notifications: [
          { id: `not-${Date.now()}`, title: "Account Active", message: "Onboarding complete. Welcome to Comfort Girls PG portal!", date: new Date().toISOString().split("T")[0], read: false }
        ]
      });

      const token = generateVerificationToken(email);
      const requestUrl = new URL(request.url);
      const protocol = requestUrl.protocol.replace(":", "") || "http";
      const host = requestUrl.host || "localhost:3000";
      const { sent, verificationLink } = await sendVerificationEmail(email, token, name, host, protocol);

      return NextResponse.json({
        success: true,
        message: "Onboarding initiated! A secure confirmation link has been sent to your email address. Please click on the verification link inside your email to verify and unlock your account.",
        debugLink: !sent ? verificationLink : undefined
      }, { status: 201 });
    }

    // 4. User Login
    if (path === "auth/login") {
      const { email, password } = body;
      if (!email || !password) {
        return NextResponse.json({ success: false, message: "Please provide both email and password." }, { status: 400 });
      }

      const user = await dbStore.users.findOne({ email });
      if (!user) {
        return NextResponse.json({ success: false, message: "Authentication failed. User not registered." }, { status: 401 });
      }

      if (user.emailVerified === false) {
        return NextResponse.json({ success: false, message: "Login failed. Please click on the verification link inside the email we sent you before logging in." }, { status: 403 });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return NextResponse.json({ success: false, message: "Authentication failed. Incorrect password credentials." }, { status: 401 });
      }

      const token = generateToken({ id: user.id, email: user.email, role: user.status });

      return NextResponse.json({
        success: true,
        message: "Access privileges authorized successfully.",
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            college: user.college,
            avatar: user.avatar,
            documentVerified: user.documentVerified,
            status: user.status,
            bookedRoomId: user.bookedRoomId,
            notifications: user.notifications
          }
        }
      });
    }

    // 5. Add Room (Admin)
    if (path === "rooms") {
      const activeUser = getAuthenticatedUser(request);
      if (!activeUser || !authorize(activeUser, ["Admin"])) {
        return NextResponse.json({ success: false, message: "Forbidden: You don't have permission to access this resource." }, { status: 403 });
      }

      const { name, type, price, deposit, size, availability, images, amenities, rules, description } = body;
      if (!name || !type || !price || !deposit) {
        return NextResponse.json({ success: false, message: "Missing core listing inputs." }, { status: 400 });
      }

      const newRoom = await dbStore.rooms.create({
        name,
        type,
        price: Number(price),
        deposit: Number(deposit),
        size: size || "200 sq ft",
        availability: Number(availability) || 1,
        images: images && images.length ? images : ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800"],
        amenities: amenities || ["WiFi", "AC"],
        rules: rules || ["No smoking"],
        description: description || "Fresh luxury residential wing.",
        rating: 4.8,
        roommates: [],
        nearbyColleges: [
          { collegeId: "symbiosis", distance: "1.0 km" }
        ]
      });

      return NextResponse.json({
        success: true,
        message: "New residential room added to global pool successfully.",
        data: newRoom
      }, { status: 201 });
    }

    // 6. Create Booking
    if (path === "bookings") {
      const activeUser = getAuthenticatedUser(request);
      if (!activeUser) {
        return NextResponse.json({ success: false, message: "Access token missing or malformed." }, { status: 401 });
      }

      const { roomId, sharingType, scheduleVisitDate, documentType, documentUrl, paidAmount, couponCode } = body;
      if (!roomId || !sharingType) {
        return NextResponse.json({ success: false, message: "Incomplete selection properties." }, { status: 400 });
      }

      const bookingId = `BKG-${Math.floor(1000 + Math.random() * 9000)}`;
      const newBooking = await dbStore.bookings.create({
        id: bookingId,
        userId: activeUser.id,
        roomId,
        sharingType,
        scheduleVisitDate: scheduleVisitDate || null,
        documentType: documentType || "College ID",
        documentUrl: documentUrl || "https://example.com/uploaded-id.jpg",
        paidAmount: paidAmount ? Number(paidAmount) : 10000,
        couponCode: couponCode || "WELCOMESHIP",
        paymentMethod: "UPI",
        status: scheduleVisitDate ? "Visit Scheduled" : "Pending Approval",
        invoiceNo: `INV-${Math.floor(10000 + Math.random() * 89999)}`,
        createdAt: new Date().toISOString().split("T")[0]
      });

      const userObj = await dbStore.users.findById(activeUser.id);
      
      // User notification & email
      await addNotification(
        activeUser.id,
        "Booking Requested",
        `Your booking request reference is registered: ${bookingId}. Standard vetting pending.`
      );
      
      await dbStore.users.findByIdAndUpdate(activeUser.id, {
        status: "Resident",
        bookedRoomId: roomId,
        documentVerified: true
      });

      // Add notification to Admin & email
      await addNotification(
        "usr-admin",
        "New Booking Request",
        `${userObj?.name || 'A user'} requested a room booking. Reference: ${bookingId}`
      );

      return NextResponse.json({
        success: true,
        message: "Booking request logged. Admin clearance initiated.",
        data: newBooking
      }, { status: 201 });
    }

    // 7. Log Complaint
    if (path === "complaints") {
      const activeUser = getAuthenticatedUser(request);
      if (!activeUser) {
        return NextResponse.json({ success: false, message: "Access token missing or malformed." }, { status: 401 });
      }

      const { type, subject, details, urgency } = body;
      if (!type || !subject || !details) {
        return NextResponse.json({ success: false, message: "Mandatory text arguments absent." }, { status: 400 });
      }

      const newComplaint = await dbStore.complaints.create({
        id: `CMP-${Math.floor(100 + Math.random() * 900)}`,
        userId: activeUser.id,
        type,
        subject,
        details,
        status: "Logged",
        urgency: urgency || "Medium",
        createdAt: new Date().toISOString().split("T")[0]
      });

      const userObj = await dbStore.users.findById(activeUser.id);
      // Add notification to Admin & email
      await addNotification(
        "usr-admin",
        "New Maintenance Complaint",
        `${userObj?.name || 'A resident'} logged a complaint: "${subject}". Urgency: ${urgency || 'Medium'}`
      );

      return NextResponse.json({
        success: true,
        message: "Complaint registered in roster. Handed to support team.",
        data: newComplaint
      }, { status: 201 });
    }

    // 8. Update Food Menu (Admin)
    if (path === "food-menu") {
      const activeUser = getAuthenticatedUser(request);
      if (!activeUser || !authorize(activeUser, ["Admin"])) {
        return NextResponse.json({ success: false, message: "Forbidden: You don't have permission to access this resource." }, { status: 403 });
      }

      const { day, breakfast, lunch, snacks, dinner } = body;
      const existing = await dbStore.foodMenus.findOne({ day });
      let doc;
      if (existing) {
        doc = await dbStore.foodMenus.findByIdAndUpdate(existing.id, { breakfast, lunch, snacks, dinner });
      } else {
        doc = await dbStore.foodMenus.create({ day, breakfast, lunch, snacks, dinner });
      }

      return NextResponse.json({
        success: true,
        message: "Gourmet nutrition database updated.",
        data: doc
      });
    }

    // 9. Schedule Physical Visit
    if (path === "visits") {
      const activeUser = getAuthenticatedUser(request);
      if (!activeUser) {
        return NextResponse.json({ success: false, message: "Access token missing or malformed." }, { status: 401 });
      }

      const { date, time, reason } = body;
      const newVisit = await dbStore.visits.create({
        userId: activeUser.id,
        date,
        time,
        reason: reason || "Standard room inspection",
        status: "Upcoming"
      });

      const userObj = await dbStore.users.findById(activeUser.id);
      // Add notification to Admin & email
      await addNotification(
        "usr-admin",
        "New Visit Request",
        `${userObj?.name || 'A user'} scheduled a PG site visit on ${date} at ${time}. Reason: "${reason || 'Standard room inspection'}"`
      );

      return NextResponse.json({
        success: true,
        message: "Physical visit scheduled.",
        data: newVisit
      }, { status: 201 });
    }

    return NextResponse.json({ success: false, message: "API Route Not Found" }, { status: 404 });
  } catch (error: any) {
    console.error("API error in POST catch-all handler:", error);
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

// -------------------------------------------------------------
// PUT METHOD ROUTER
// -------------------------------------------------------------
export async function PUT(request: Request, props: { params: Promise<{ route?: string[] }> }) {
  try {
    const params = await props.params;
    const route = params.route || [];
    const path = route.join("/");
    const body = await request.json().catch(() => ({}));

    // 1. Update Profile (auth/profile)
    if (path === "auth/profile") {
      const activeUser = getAuthenticatedUser(request);
      if (!activeUser) {
        return NextResponse.json({ success: false, message: "Access token missing or malformed." }, { status: 401 });
      }

      const { name, phone, college, avatar } = body;
      const user = await dbStore.users.findById(activeUser.id);
      if (!user) {
        return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (phone !== undefined) updateData.phone = phone;
      if (college !== undefined) updateData.college = college;
      if (avatar !== undefined) updateData.avatar = avatar;

      const updatedUser = await dbStore.users.findByIdAndUpdate(activeUser.id, updateData);
      if (!updatedUser) {
        return NextResponse.json({ success: false, message: "Could not update profile information." }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Profile updated successfully.",
        data: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          college: updatedUser.college,
          avatar: updatedUser.avatar,
          documentVerified: updatedUser.documentVerified,
          status: updatedUser.status,
          bookedRoomId: updatedUser.bookedRoomId,
          notifications: updatedUser.notifications
        }
      });
    }

    // 2. Edit Room Details (rooms/:id)
    if (route[0] === "rooms" && route.length === 2) {
      const activeUser = getAuthenticatedUser(request);
      if (!activeUser || !authorize(activeUser, ["Admin"])) {
        return NextResponse.json({ success: false, message: "Forbidden: You don't have permission to access this resource." }, { status: 403 });
      }

      const roomId = route[1];
      const updated = await dbStore.rooms.findByIdAndUpdate(roomId, body);
      if (!updated) {
        return NextResponse.json({ success: false, message: "Room listing not found." }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: "Room list settings updated.",
        data: updated
      });
    }

    // 3. Edit Booking Status (bookings/:id/status)
    if (route[0] === "bookings" && route.length === 3 && route[2] === "status") {
      const activeUser = getAuthenticatedUser(request);
      if (!activeUser) {
        return NextResponse.json({ success: false, message: "Access token missing or malformed." }, { status: 401 });
      }

      const bookingId = route[1];
      const { status } = body;

      const bkg = await dbStore.bookings.findById(bookingId);
      if (!bkg) {
        return NextResponse.json({ success: false, message: "Booking ref not discovered." }, { status: 404 });
      }

      const updated = await dbStore.bookings.findByIdAndUpdate(bookingId, { status });

      await addNotification(
        bkg.userId,
        "Booking Status Update",
        `Your booking ${bookingId} status is updated to: ${status}.`
      );

      return NextResponse.json({
        success: true,
        message: "Booking authority updated successfully.",
        data: updated
      });
    }

    // 4. Update Complaint Status (complaints/:id/status)
    if (route[0] === "complaints" && route.length === 3 && route[2] === "status") {
      const activeUser = getAuthenticatedUser(request);
      if (!activeUser || !authorize(activeUser, ["Admin"])) {
        return NextResponse.json({ success: false, message: "Forbidden: You don't have permission to access this resource." }, { status: 403 });
      }

      const complaintId = route[1];
      const { status } = body;

      const updated = await dbStore.complaints.findByIdAndUpdate(complaintId, {
        status,
        resolvedAt: status === "Resolved" ? new Date().toISOString().split("T")[0] : undefined
      });

      if (!updated) {
        return NextResponse.json({ success: false, message: "Complaint ticket not found." }, { status: 404 });
      }

      await addNotification(
        updated.userId,
        "Complaint Status Update",
        `Your complaint regarding "${updated.subject}" status is updated to: ${status}.`
      );

      return NextResponse.json({
        success: true,
        message: "Warden updated ticket disposition successfully.",
        data: updated
      });
    }

    // 4. Update Visit Status / Response message (Admin)
    if (route[0] === "visits" && route.length === 2) {
      const activeUser = getAuthenticatedUser(request);
      if (!activeUser || !authorize(activeUser, ["Admin"])) {
        return NextResponse.json({ success: false, message: "Forbidden: You don't have permission to access this resource." }, { status: 403 });
      }

      const visitId = route[1];
      const { status, adminMessage } = body;

      const updated = await dbStore.visits.findByIdAndUpdate(visitId, {
        status,
        adminMessage: adminMessage || ""
      });

      if (!updated) {
        return NextResponse.json({ success: false, message: "Visit request not found." }, { status: 404 });
      }

      await addNotification(
        updated.userId,
        `Visit Request ${status}`,
        `Your physical visit scheduled on ${updated.date} has been ${status.toLowerCase()}. Message: "${adminMessage || 'No warden remarks.'}"`
      );

      return NextResponse.json({
        success: true,
        message: "Visit status updated successfully.",
        data: updated
      });
    }

    // 5. Mark Notifications as Read
    if (route[0] === "notifications" && route[1] === "read") {
      const activeUser = getAuthenticatedUser(request);
      if (!activeUser) {
        return NextResponse.json({ success: false, message: "Access token missing or malformed." }, { status: 401 });
      }

      const userObj = await dbStore.users.findById(activeUser.id);
      if (!userObj) {
        return NextResponse.json({ success: false, message: "User account not found." }, { status: 404 });
      }

      const updatedNotifs = (userObj.notifications || []).map((n: any) => ({
        ...n,
        read: true
      }));

      const updated = await dbStore.users.findByIdAndUpdate(activeUser.id, {
        notifications: updatedNotifs
      });

      return NextResponse.json({
        success: true,
        message: "All notifications marked as read successfully.",
        data: updated
      });
    }

    return NextResponse.json({ success: false, message: "API Route Not Found" }, { status: 404 });
  } catch (error: any) {
    console.error("API error in PUT catch-all handler:", error);
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
  }
}

// -------------------------------------------------------------
// DELETE METHOD ROUTER
// -------------------------------------------------------------
export async function DELETE(request: Request, props: { params: Promise<{ route?: string[] }> }) {
  try {
    const params = await props.params;
    const route = params.route || [];

    // 1. Delete Room (rooms/:id)
    if (route[0] === "rooms" && route.length === 2) {
      const activeUser = getAuthenticatedUser(request);
      if (!activeUser || !authorize(activeUser, ["Admin"])) {
        return NextResponse.json({ success: false, message: "Forbidden: You don't have permission to access this resource." }, { status: 403 });
      }

      const roomId = route[1];
      const ok = await dbStore.rooms.findByIdAndDelete(roomId);
      if (!ok) {
        return NextResponse.json({ success: false, message: "Listing not found." }, { status: 404 });
      }

      return NextResponse.json({ success: true, message: "Room reference permanently sunsetted." });
    }

    return NextResponse.json({ success: false, message: "API Route Not Found" }, { status: 404 });
  } catch (error: any) {
    console.error("API error in DELETE catch-all handler:", error);
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
