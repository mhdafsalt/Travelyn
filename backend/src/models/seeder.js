const Destination = require('./Destination');
const Booking = require('./Booking');
const Inquiry = require('./Inquiry');
const Subscriber = require('./Subscriber');
const AuthShowcase = require('./AuthShowcase');
const destinationsData = require('../data/destinations.json');
const bookingsData = require('../data/bookings.json');

async function seedDatabaseIfEmpty() {
  try {
    const destCount = await Destination.countDocuments();
    if (destCount === 0) {
      console.log('📦 Seeding luxury destinations into MongoDB Atlas...');
      await Destination.insertMany(destinationsData);
      console.log(`✅ Seeded ${destinationsData.length} destinations into MongoDB Atlas collection 'destinations'!`);
    }

    const bookingCount = await Booking.countDocuments();
    if (bookingCount === 0) {
      console.log('📦 Seeding bookings into MongoDB Atlas...');
      await Booking.insertMany(bookingsData);
      console.log(`✅ Seeded ${bookingsData.length} booking records into MongoDB Atlas collection 'bookings'!`);
    }

    const subCount = await Subscriber.countDocuments();
    if (subCount === 0) {
      await Subscriber.create({
        id: 'sub-1',
        email: 'traveler@travelyn.com',
        status: 'active'
      });
      console.log(`✅ Seeded subscriber into MongoDB Atlas collection 'subscribers'!`);
    }

    const inqCount = await Inquiry.countDocuments();
    if (inqCount === 0) {
      await Inquiry.create({
        id: 'inq-1',
        fullName: 'Julian Sterling',
        email: 'sterling@vanguard.co',
        phone: '+44 20 7946 0912',
        destinationPreference: 'Swiss Alps & Zermatt',
        travelDates: 'Winter 2026',
        budgetRange: '₹3,00,000 - ₹5,00,000',
        guestCount: 2,
        message: 'Looking for a private chalet retreat with a private ski instructor and fireside dining.',
        status: 'new'
      });
      console.log(`✅ Seeded concierge inquiry into MongoDB Atlas collection 'inquiries'!`);
    }

    const authCount = await AuthShowcase.countDocuments();
    if (authCount === 0) {
      await AuthShowcase.create([
        {
          page: 'login',
          backdropImageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=85',
          tagText: 'Bespoke Journeys',
          quote: 'Slow trains, quiet mountain villages, and the best fondue of our lives. We didn’t want to come home.',
          authorName: 'Claire & Tom',
          authorTrip: 'Swiss Alps · 2026 Journey',
          authorAvatarUrl: 'https://framerusercontent.com/images/cwjju4oQ9SWH1nkXN95LfTNt94.jpg',
          rating: '4.9',
          footerLeft: 'EST. 2014 — LISBON ATELIER',
          footerRight: 'PRIVATE MEMBER ACCESS'
        },
        {
          page: 'signup',
          backdropImageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=85',
          tagText: 'Private Collective',
          quote: 'Travelyn doesn’t just book luxury rooms. They curate the quiet, irreplaceable memories of our lives.',
          authorName: 'Marcus Lindqvist',
          authorTrip: 'Stockholm · Patron Member',
          authorAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          rating: '4.9',
          footerLeft: 'EST. 2014 — LISBON ATELIER',
          footerRight: 'FOUNDING PATRON PASS'
        }
      ]);
      console.log(`✅ Seeded Auth Showcase settings into MongoDB Atlas collection 'authshowcases'!`);
    }
  } catch (err) {
    console.warn('⚠️ Seeding note:', err.message);
  }
}

module.exports = { seedDatabaseIfEmpty };
