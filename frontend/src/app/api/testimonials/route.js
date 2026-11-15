import { NextResponse } from 'next/server';

let serverTestimonialsSettings = {
  sectionTag: "Traveller stories",
  ratingScore: "4.9",
  ratingStars: 5,
  verifiedReviewsText: "2,400+ verified reviews",
  testimonials: [
    {
      id: "testimonial-1",
      quote: "Slow trains, quiet villages and the best fondue of our lives. We didn’t want to come home.",
      authorName: "Claire & Tom",
      authorLocation: "Swiss Alps · 2026",
      authorAvatar: "https://framerusercontent.com/images/cwjju4oQ9SWH1nkXN95LfTNt94.jpg",
      photoUrl: "https://framerusercontent.com/images/OQDgLum0GfExeAWydcWtw46xVGk.jpg"
    },
    {
      id: "testimonial-2",
      quote: "Waking up to the morning bells of Gion and drinking matcha in a 300-year-old teahouse changed how we see time.",
      authorName: "Elena & Marcus",
      authorLocation: "Kyoto · 2026",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      photoUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "testimonial-3",
      quote: "Sailing the Caldera at dusk with local wine and no rush in the world. Travelyn created pure poetry for us.",
      authorName: "Sofia & Liam",
      authorLocation: "Santorini · 2026",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      photoUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80"
    }
  ]
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: serverTestimonialsSettings
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    serverTestimonialsSettings = {
      ...serverTestimonialsSettings,
      ...body
    };

    return NextResponse.json({
      success: true,
      message: 'Testimonials settings updated successfully',
      data: serverTestimonialsSettings
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid payload', error: error.message },
      { status: 400 }
    );
  }
}
