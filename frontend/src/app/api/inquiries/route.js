import { NextResponse } from 'next/server';

let serverInquiries = [
  {
    id: 'inq-1731600101',
    fullName: 'Sophia Montgomery',
    email: 'sophia.montgomery@alumni.harvard.edu',
    phone: '+1 (555) 987-6543',
    destinationPreference: 'Lake Como & Amalfi Coast',
    travelDates: 'September 2026',
    budgetRange: '₹8,00,000 – ₹20,00,000',
    guestCount: 2,
    message: 'We are planning our 10th anniversary journey. We want private vintage Riva boat charters on Como and a cliffside villa in Positano.',
    status: 'new',
    createdAt: '2026-11-13T18:10:00.000Z'
  },
  {
    id: 'inq-1731600202',
    fullName: 'Henri de La Tour',
    email: 'h.delatour@banque-privee.ch',
    phone: '+41 22 555 0199',
    destinationPreference: 'Kyoto & Naoshima Art Island',
    travelDates: 'October 2026',
    budgetRange: '₹20,00,000+',
    guestCount: 3,
    message: 'Looking for access to private historic machiya residences and private architectural docents for modern art museums.',
    status: 'contacted',
    createdAt: '2026-11-14T08:30:00.000Z'
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    total: serverInquiries.length,
    data: serverInquiries,
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.fullName || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const newInquiry = {
      id: `inq-${Date.now()}`,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone || '',
      destinationPreference: body.destinationPreference || 'Open to recommendations',
      travelDates: body.travelDates || 'Flexible',
      budgetRange: body.budgetRange || '₹8,00,000 – ₹20,00,000',
      guestCount: Number(body.guestCount) || 2,
      message: body.message,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    serverInquiries.unshift(newInquiry);

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out to Travelyn. A personal travel designer will tailor an itinerary and respond within 24 hours.',
      data: newInquiry,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to submit inquiry', error: error.message },
      { status: 500 }
    );
  }
}

