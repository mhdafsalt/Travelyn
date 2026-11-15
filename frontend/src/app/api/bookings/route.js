import { NextResponse } from 'next/server';

let serverBookings = [
  {
    id: 'bk-1731600100',
    destinationId: 'dest-1',
    destinationTitle: 'Santorini Caldera Retreat',
    travelerName: 'Eleanor Vance',
    travelerEmail: 'eleanor.vance@luxury.travel',
    phone: '+1 (555) 234-5678',
    startDate: '2026-06-15',
    guests: 2,
    roomType: 'Caldera Sunset Cave Suite',
    specialRequests: 'Champagne on arrival & sunset catamaran booking',
    totalEstimatedPrice: 570000,
    status: 'confirmed',
    createdAt: '2026-11-12T14:32:00.000Z'
  },
  {
    id: 'bk-1731600200',
    destinationId: 'dest-2',
    destinationTitle: 'Kyoto Ancient Gardens & Ryokan',
    travelerName: 'Julian Sterling',
    travelerEmail: 'sterling@vanguard.co',
    phone: '+44 20 7946 0912',
    startDate: '2026-04-10',
    guests: 2,
    roomType: 'Imperial Garden Pavilion',
    specialRequests: 'Private tea master ceremony in Gion',
    totalEstimatedPrice: 250000,
    status: 'pending',
    createdAt: '2026-11-13T09:15:00.000Z'
  },
  {
    id: 'bk-1731600300',
    destinationId: 'dest-3',
    destinationTitle: 'Maldives Overwater Haven',
    travelerName: 'Clara Delacroix',
    travelerEmail: 'clara.delacroix@artemis.fr',
    phone: '+33 1 42 68 55 00',
    startDate: '2026-08-20',
    guests: 2,
    roomType: 'Sunset Pool Villa Overwater',
    specialRequests: 'Private sandbank dinner on Day 3',
    totalEstimatedPrice: 990000,
    status: 'confirmed',
    createdAt: '2026-11-14T11:45:00.000Z'
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    total: serverBookings.length,
    data: serverBookings,
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.destinationId || !body.travelerName || !body.travelerEmail || !body.startDate) {
      return NextResponse.json(
        { success: false, message: 'Missing required booking fields' },
        { status: 400 }
      );
    }

    const newBooking = {
      id: `bk-${Date.now()}`,
      destinationId: body.destinationId,
      destinationTitle: body.destinationTitle || 'Custom Journey',
      travelerName: body.travelerName,
      travelerEmail: body.travelerEmail,
      phone: body.phone || '',
      startDate: body.startDate,
      guests: Number(body.guests) || 2,
      roomType: body.roomType || 'Signature Luxury Suite',
      specialRequests: body.specialRequests || '',
      totalEstimatedPrice: Number(body.totalEstimatedPrice) || 3500,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    serverBookings.unshift(newBooking);

    return NextResponse.json({
      success: true,
      message: 'Booking request received successfully! A Travelyn travel designer will contact you within 24 hours.',
      data: newBooking,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create booking', error: error.message },
      { status: 500 }
    );
  }
}

