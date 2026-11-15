import { NextResponse } from 'next/server';

let serverSubscribers = [
  { id: 'sub-1', email: 'julian.vance@voyager.com', subscribedAt: '2026-10-15T12:00:00.000Z', status: 'active' },
  { id: 'sub-2', email: 'elena.rostova@artisan.ch', subscribedAt: '2026-11-01T09:30:00.000Z', status: 'active' },
  { id: 'sub-3', email: 'adrian.cross@designstudio.nyc', subscribedAt: '2026-11-10T15:20:00.000Z', status: 'active' },
  { id: 'sub-4', email: 'claire.dubois@maison.paris', subscribedAt: '2026-11-14T07:10:00.000Z', status: 'active' }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    total: serverSubscribers.length,
    data: serverSubscribers,
  });
}

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Valid email address is required.' },
        { status: 400 }
      );
    }

    const normalized = email.trim().toLowerCase();
    const exists = serverSubscribers.find((s) => s.email.toLowerCase() === normalized);

    if (exists) {
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed to Travelyn inspiration!',
      });
    }

    const newSub = {
      id: `sub-${Date.now()}`,
      email: normalized,
      subscribedAt: new Date().toISOString(),
      status: 'active',
    };

    serverSubscribers.unshift(newSub);

    return NextResponse.json({
      success: true,
      message: 'Welcome to the Travelyn community. Your first journey inspiration is on its way.',
      data: newSub,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to subscribe', error: error.message },
      { status: 500 }
    );
  }
}

