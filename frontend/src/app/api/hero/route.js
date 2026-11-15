import { NextResponse } from 'next/server';

let serverHeroSettings = {
  title: "Say it once.\nWe build the trip.",
  subtitle: "One phrase, and a living itinerary builds itself around the city: weather, pace, your mood.",
  backdropImageUrl: "https://framerusercontent.com/images/TSiGMGJHmapQIwKIzHneadv3LM.png",
  cutoutImageUrl: "/images/hero.png",
  showCutout: true,
  showGlassCard: true,
  glassCardCity: "LISBON",
  glassCardBadge: "TODAY",
  glassCardMuseum: "4:00 PM · Azulejo Museum",
  glassCardStatus: "rerouted · dry and on the way",
  glassCardPace: "evening: easy pace",
  typewriterPhrases: [
    "a week in Lisbon...",
    "4 days in Kyoto cherry blossoms...",
    "weekend on the Amalfi coast...",
    "Swiss Alps alpine retreat...",
    "hidden coves in Santorini..."
  ],
  stopChips: [
    { time: "Thu 9:30", title: "Alfama on foot", query: "Lisbon" },
    { time: "1:00 PM", title: "Time Out Market", query: "Lisbon" },
    { time: "6:40 PM", title: "sunset over the river", query: "Lisbon" },
    { time: "", title: "9 more places", query: "Europe" }
  ],
  beaconLabel: "Nomia right now:",
  beaconValue: "watching the weather shift",
  buildButtonText: "Build it"
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: serverHeroSettings
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    serverHeroSettings = {
      ...serverHeroSettings,
      ...body
    };

    return NextResponse.json({
      success: true,
      message: 'Hero section settings updated successfully',
      data: serverHeroSettings
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update hero settings', error: error.message },
      { status: 500 }
    );
  }
}
