const BookingRequestSchema = require('../models/Hotel.booking_request');
const HotelUser = require('../models/Hotel.user');
const SendWhatsAppMessage = require('../utils/whatsapp_send');
const HotelListing = require("../models/Hotels.model");

const Crypto = require('crypto');

exports.makeBookingOffline = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID is required" });
        }

        const userId = req.user.id;
        const bookingPrefix = "ROB";
        const bookingId = `${bookingPrefix}${Crypto.randomInt(100000, 999999)}`;
        const bookingOtp = Crypto.randomInt(100000, 999999); // Generate 6-digit OTP
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

        const {
            guestInformation,
            checkInDate,
            checkOutDate,
            listing_id,
            numberOfGuests,
            booking_payment_done,
            modeOfBooking = "Offline",
            bookingAmount,
            paymentMode
        } = req.body || {};

        // Validate Required Fields
        const emptyFields = [];
        if (!guestInformation || guestInformation.length === 0) emptyFields.push('guestInformation');
        if (!checkInDate) emptyFields.push('checkInDate');
        if (!checkOutDate) emptyFields.push('checkOutDate');
        if (!listing_id) emptyFields.push('listing_id');

        if (emptyFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
                fields: emptyFields
            });
        }

        // Date Validations
        const today = new Date();
        if (new Date(checkInDate) < today) {
            return res.status(400).json({ success: false, message: "Check-in date cannot be in the past." });
        }
        if (new Date(checkOutDate) <= new Date(checkInDate)) {
            return res.status(400).json({ success: false, message: "Check-out date must be after check-in date." });
        }

        // Create New Booking
        const newBooking = new BookingRequestSchema({
            guestInformation,
            checkInDate,
            checkOutDate,
            listing_id,
            numberOfGuests: guestInformation.length || 0,
            booking_payment_done,
            modeOfBooking,
            bookingAmount,
            paymentMode,
            HotelUserId: userId,
            Booking_id: bookingId,
            BookingOtp: bookingOtp,
            BookingOtpExpiry: otpExpiry
        });

        await newBooking.save();

        // Send OTP via WhatsApp
        const guestPhone = guestInformation[0]?.guestPhone;
        if (guestPhone) {
            const message = `Your booking OTP: ${bookingOtp}. Please share it with the receptionist to confirm your booking. This OTP expires in 5 minutes.`;
            await SendWhatsAppMessage(message, guestPhone);
        }

        return res.status(201).json({
            success: true,
            message: "Booking created successfully! OTP sent for confirmation.",
            booking: newBooking,
            bookingId: bookingId
        });

    } catch (error) {
        console.error("Error creating booking:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Verify OTP and Confirm Booking
exports.verifyOtpForBooking = async (req, res) => {
    try {
        const { bookingId, otp } = req.body;

        if (!bookingId || !otp) {
            return res.status(400).json({ success: false, message: "Booking ID and OTP are required." });
        }

        const booking = await BookingRequestSchema.findOne({ Booking_id: bookingId });

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found." });
        }

        if (booking.isBookingDone) {
            return res.status(400).json({ success: false, message: "Booking is already confirmed." });
        }

        if (booking.BookingOtpExpiry < new Date()) {
            return res.status(400).json({ success: false, message: "OTP has expired. Please request a new OTP." });
        }

        if (booking.BookingOtp !== Number(otp)) {
            return res.status(400).json({ success: false, message: "Invalid OTP. Please try again." });
        }

        // Update booking status
        booking.isBookingDone = true;
        booking.status = "Confirmed";
        await booking.save();

        // Send confirmation message
        const guestPhone = booking.guestInformation[0]?.guestPhone;
        if (guestPhone) {
            const message = `Your booking has been confirmed! Check-in: ${booking.checkInDate}, Check-out: ${booking.checkOutDate}. Thank you for choosing us!`;
            await SendWhatsAppMessage(message, guestPhone);
        }

        return res.status(200).json({ success: true, message: "Booking confirmed successfully!", booking });

    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Resend OTP for Booking Confirmation
exports.resendOtpForBookingConfirm = async (req, res) => {
    try {
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.status(400).json({ success: false, message: "Booking ID is required." });
        }

        const booking = await BookingRequestSchema.findOne({ Booking_id: bookingId });

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found." });
        }

        if (booking.isBookingDone) {
            return res.status(400).json({ success: false, message: "Booking is already confirmed." });
        }

        // Generate new OTP and expiry
        const newOtp = Crypto.randomInt(100000, 999999);
        const newExpiry = new Date(Date.now() + 5 * 60 * 1000);

        booking.BookingOtp = newOtp;
        booking.BookingOtpExpiry = newExpiry;
        await booking.save();

        // Send new OTP via WhatsApp
        const guestPhone = booking.guestInformation[0]?.guestPhone;
        if (guestPhone) {
            const message = `Your new booking OTP: ${newOtp}. Please share it with the receptionist to confirm your booking. This OTP expires in 5 minutes.`;
            await SendWhatsAppMessage(message, guestPhone);
        }

        return res.status(200).json({ success: true, message: "New OTP sent successfully!", bookingId });

    } catch (error) {
        console.error("Error resending OTP:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.UpdateBooking = async (req, res) => {
    try {
        const { BookingId } = req.query;
        const { status } = req.body;


        const allowedStatuses = ["Cancelled", "Checkout"];

        if (!BookingId) {
            return res.status(400).json({ success: false, message: "Booking ID is required." });
        }

        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: `Invalid status. Allowed statuses: ${allowedStatuses.join(", ")}` });
        }

        const booking = await BookingRequestSchema.findOne({ Booking_id: BookingId });

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found." });
        }


        const updatedBooking = await BookingRequestSchema.findOneAndUpdate(
            { Booking_id: BookingId },
            { status }, // Only update status
            { new: true } // Return updated document
        );

        return res.status(200).json({
            success: true,
            message: "Booking status updated successfully.",
            data: updatedBooking
        });

    } catch (error) {
        console.error("Error updating booking status:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};


exports.getMyBookingAll = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID is required" });
        }
        console.log(req.query)
        const { status, Booking_id, userCheckOutStatus, isUserCheckedIn, booking_payment_done, paymentMode, guestPhone } = req.query;

        // Base filter with HotelUserId
        let filter = { HotelUserId: req.user.id };

        // Add filters only if they are present in the query
        if (status) filter.status = status;
        if (Booking_id) filter.Booking_id = Booking_id;
        if (userCheckOutStatus !== undefined) filter.userCheckOutStatus = userCheckOutStatus === "true";
        if (isUserCheckedIn !== undefined) filter.isUserCheckedIn = isUserCheckedIn === "true";
        if (booking_payment_done !== undefined) filter.booking_payment_done = booking_payment_done === "true";
        if (paymentMode) filter.paymentMode = paymentMode;
        if (guestPhone) filter["guestInformation.guestPhone"] = guestPhone;

        // Fetch bookings
        const bookings = await BookingRequestSchema.find(filter).sort({
            "checkInDate": -1
        });

        if (!bookings.length) {
            return res.status(404).json({ success: false, message: "No bookings found matching the criteria." });
        }

        return res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully.",
            totalBookings: bookings.length,
            data: bookings
        });

    } catch (error) {
        console.error("Error fetching bookings:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};


exports.markCheckIn = async (req, res) => {
    try {
        const { BookingId } = req.query;
        console.log(req.query)
        if (!BookingId) {
            return res.status(400).json({ success: false, message: "BookingId is required." });
        }

        const booking = await BookingRequestSchema.findOne({ Booking_id: BookingId }).populate("HotelUserId");
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found." });
        }

        if (booking.isUserCheckedIn) {
            return res.status(400).json({ success: false, message: "User is already checked in." });
        }

        booking.isUserCheckedIn = true;
        booking.status = "CheckIn"
        booking.useCheckAt = new Date();
        await booking.save();

        const guestPhone = booking?.guestInformation?.[0]?.guestPhone;
        if (guestPhone) {
            const message = `✨ Welcome ${booking?.guestInformation?.[0]?.guestName} to ${booking?.HotelUserId?.hotel_name}! ✨\n\n🎉 We are delighted to have you here!\n\nEnjoy your stay and let us know if you need any assistance.\n\n🛎️ Your checkout date is: ${booking?.checkOutDate}\n\n🙏 Thank you for choosing us! Have a great time!`;
            await SendWhatsAppMessage(message, guestPhone);
        }

        return res.status(200).json({ success: true, message: "User checked in successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Something went wrong. Please try again later." });
    }
}
exports.markCheckOut = async (req, res) => {
    try {
        const { BookingId } = req.query;
        if (!BookingId) {
            return res.status(400).json({ success: false, message: "BookingId is required." });
        }

        const booking = await BookingRequestSchema.findOne({ Booking_id: BookingId }).populate("HotelUserId");
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found." });
        }

        if (!booking.isUserCheckedIn) {
            return res.status(400).json({ success: false, message: "User has not checked in yet." });
        }

        booking.userCheckOutStatus = true;
        booking.status = "Checkout";
        booking.userCheckOut = new Date();
        await booking.save();

        const guestPhone = booking?.guestInformation?.[0]?.guestPhone;
        const checkoutDate = booking?.userCheckOut ? new Date(booking.userCheckOut).toLocaleDateString() : "not specified";
        if (guestPhone) {
            const message = `✨ Thank you, ${booking?.guestInformation?.[0]?.guestName}, for staying at ${booking?.HotelUserId?.hotel_name}! ✨\n\n💼 We hope you had a wonderful experience.\n\n🛎️ Your checkout date was: ${checkoutDate}\n\n🙏 Safe travels, and we hope to see you again soon!`;
            await SendWhatsAppMessage(message, guestPhone);
        }

        return res.status(200).json({ success: true, message: "User checked out successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Something went wrong. Please try again later." });
    }
}

exports.getAllUniqueGuestAndBookingAndHerAmount = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID is required" });
        }
        const userId = req.user.id;
        const bookings = await BookingRequestSchema.find({ HotelUserId: userId });
        if (!bookings.length) {
            return res.status(404).json({ success: false, message: "No bookings found." });
        }

        const guestData = new Map();

        bookings.forEach(booking => {
            booking.guestInformation.forEach(guest => {
                const key = guest.guestPhone;
                const checkIn = new Date(booking.checkInDate);
                const checkOut = new Date(booking.checkOutDate);
                const numberOfDays = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

                if (!guestData.has(key)) {
                    guestData.set(key, {
                        guestName: guest.guestName,
                        guestPhone: guest.guestPhone,
                        totalExpense: booking.bookingAmount,
                        totalDays: numberOfDays
                    });
                } else {
                    const existingGuest = guestData.get(key);
                    existingGuest.totalExpense += booking.bookingAmount;
                    existingGuest.totalDays += numberOfDays;
                }
            });
        });

        return res.status(200).json({ success: true, data: Array.from(guestData.values()) });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Something went wrong. Please try again later." });
    }
}


exports.UserMakesBooking = async (req, res) => {
    try {
        console.log(req.body)
        console.log(req.user)
        // Validate User Authentication
        if (!req.user || !req.user?.user?._id) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID is required" });
        }

        const userId = req.user?.user?._id
        const bookingPrefix = "ROB";
        const bookingId = `${bookingPrefix}${Crypto.randomInt(100000, 999999)}`;
        const bookingOtp = Crypto.randomInt(100000, 999999);
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

        const {
            guestInformation,
            checkInDate,
            checkOutDate,
            listing_id,
            hotel_id,
            paymentMethod,
            booking_payment_done,
            modeOfBooking = "Online",
            bookingAmount,
            paymentMode
        } = req.body || {};

        // Validate Required Fields
        const missingFields = [];
        if (!guestInformation || !guestInformation.length) missingFields.push("guestInformation");
        if (!checkInDate) missingFields.push("checkInDate");
        if (!checkOutDate) missingFields.push("checkOutDate");
        if (!listing_id) missingFields.push("listing_id");

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
                fields: missingFields
            });
        }

        // Validate Dates
        const today = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        console.log(today);
        
        if (new Date(checkInDate) < today) {
            return res.status(400).json({ success: false, message: "Check-in date cannot be in the past." });
        }
        if (new Date(checkOutDate) <= new Date(checkInDate)) {
            return res.status(400).json({ success: false, message: "Check-out date must be after check-in date." });
        }

        // Determine Payment Mode
        const mode = paymentMethod === "hotel"
            ? "Pay at Hotel"
            : paymentMethod === "online"
                ? "Online"
                : "Offline";

        // Check Hotel & Listing Availability
        const hotelExists = await HotelUser.findById(hotel_id);
        if (!hotelExists) {
            return res.status(404).json({ success: false, message: "Hotel not found." });
        }

        const listingAvailable = await HotelListing.findById({
            _id: listing_id,
            HotelUserId: hotel_id,

        });

        if (!listingAvailable.isRoomAvailable) {
            return res.status(400).json({
                success: false,
                message: "Room in not available For Booking",
            })
        }

        if (!listingAvailable) {
            return res.status(404).json({ success: false, message: "No available rooms in this listing." });
        }

        if (listingAvailable.allowed_person < guestInformation.length) {
            return res.status(400).json({ success: false, message: "Number of guests exceeds the maximum allowed." });
        }

        // Create Booking
        const newBooking = new BookingRequestSchema({
            guestInformation,
            checkInDate,
            checkOutDate,
            listing_id,
            numberOfGuests: guestInformation.length || 0,
            booking_payment_done,
            modeOfBooking,
            bookingAmount,
            paymentMode: mode,
            guest_id: userId,
            HotelUserId: hotel_id,
            Booking_id: bookingId,
            BookingOtp: bookingOtp,
            BookingOtpExpiry: otpExpiry,
            isBookingDone: true,
            status: "Confirmed"
        });

        await newBooking.save();

        // Send Confirmation via WhatsApp to Guest
        const guestPhone = guestInformation[0]?.guestPhone;
        if (guestPhone) {
            const guestMessage = `🌟 *Booking Confirmation* 🌟
                                                
                                    🆔 Booking ID: *${bookingId}*
                                    🔑 OTP: *${bookingOtp}*
                                    🏨 Hotel Name: *${hotelExists.hotel_name}*
                                    📍 Location: *${hotelExists.hotel_address}*
                                    📅 Check-in: *${checkInDate}*
                                    📅 Check-out: *${checkOutDate}*
                                    👥 Guests: *${guestInformation.length}*
                                    💰 Amount Paid: *${bookingAmount || "Pending"}*
                                    💳 Payment Mode: *${mode}*

                                    📌 *Please provide this OTP at check-in to confirm your booking.*`;

            await SendWhatsAppMessage(guestMessage, guestPhone);
        }

        // Send Booking Notification to Hotel
        const hotelPhone = hotelExists?.hotel_phone;
        if (hotelPhone) {
            const hotelMessage = `📢 *New Booking Alert!* 📢
            
🆔 Booking ID: *${bookingId}*
🏨 Hotel Name: *${hotelExists.hotel_name}*
📅 Check-in: *${checkInDate}*
📅 Check-out: *${checkOutDate}*
👥 Guests: *${guestInformation.length}*
💰 Amount: *${bookingAmount || "Pending"}*
💳 Payment Mode: *${mode}*

👤 *Guest Details:*
${guestInformation.map(
                (guest, index) => `#${index + 1} - *${guest.guestName}*, 📞 ${guest.guestPhone}`
            ).join("\n")}

⚡ *Please prepare for their arrival!*`;

            await SendWhatsAppMessage(hotelMessage, hotelPhone);
        }

        return res.status(201).json({
            success: true,
            message: "Booking created successfully! OTP sent for confirmation.",
            booking: newBooking,
            bookingId
        });

    } catch (error) {
        console.error("Error creating booking:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
