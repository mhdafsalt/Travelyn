import { NextResponse } from 'next/server';

let serverAboutStatsSettings = {
  showBreatheBanner: true,
  breatheTag: "Breathe",
  breatheHeading: "Slow down.",
  breatheSubtext: "The world will wait.",
  breatheBgUrl: "https://framerusercontent.com/images/PMSlK6mTGdx9DcWYaJZiAMBFv4.jpg",

  aboutTag: "About Travelyn",
  aboutEst: "Est. 2014 — Lisbon",
  statementPrefix: "A boutique travel studio crafting ",
  statementHighlight: "tailor-made journeys",
  statementSuffix: " for curious travellers who would rather feel a place than simply see it.",
  buttonText: "Our Story",
  buttonLink: "/about",

  stats: [
    { id: "stat-1", number: "250+", label: "Unique destinations" },
    { id: "stat-2", number: "50K+", label: "Happy travellers" },
    { id: "stat-3", number: "1,200+", label: "Curated experiences" },
    { id: "stat-4", number: "4.9/5", label: "Average rating" },
  ]
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: serverAboutStatsSettings
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    serverAboutStatsSettings = {
      ...serverAboutStatsSettings,
      ...body
    };

    return NextResponse.json({
      success: true,
      message: 'About Studio & Stats settings updated successfully',
      data: serverAboutStatsSettings
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid payload', error: error.message },
      { status: 400 }
    );
  }
}
