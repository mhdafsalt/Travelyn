const { Router } = require('express');

const router = Router();

const DESTINATION_KNOWLEDGE = {
  'swiss-alps': {
    name: 'Swiss Alps & Zermatt',
    country: 'Switzerland',
    region: 'Valais & Bernese Oberland',
    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=85',
    tagline: 'Granite peaks, wood-smoke chimneys, and slow panoramic rails.',
    bestSeason: 'December – April for snow & fireside; June – September for wildflower meadows',
    highlights: [
      'First-class panoramic car on the Glacier Express through snowbound gorges',
      'Private raclette & fondue dinner in a 200-year-old alpine hay barn',
      'Dawn stroll in car-free Zermatt with unobstructed Matterhorn reflection',
      'Cedar hot tub soak while pine needles gather fresh snow'
    ],
    staySuggestions: [
      {
        name: 'The Chedi Andermatt',
        type: 'Alpine Luxury Pavilion',
        features: 'Fireplaces in every suite, 2,400m² Tibetan-inspired spa, private ski butler',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Chalet Zermatt Peak',
        type: 'Private Mountain Penthouse',
        features: 'Floor-to-ceiling glass, private Michelin-trained chef, outdoor Jacuzzi',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
      }
    ],
    dailyThemes: [
      {
        theme: 'Arrival & Lakeside Stillness',
        morning: '09:30 — Arrival into Zurich, private vintage saloon transfer to Lake Lucerne. Espresso & warm brioche overlooking misty waters.',
        afternoon: '14:00 — Board the panoramic cogwheel rail ascending to your alpine haven. Unpack among pine and cedar scents.',
        evening: '19:30 — Welcome fireside dinner with roasted Valais squash and local crisp Fendant wine.',
        slowMoment: 'Sitting quietly on the cedar balcony as church bells ring softly through the valley at dusk.'
      },
      {
        theme: 'Glacier Car & The Quiet Summit',
        morning: '08:30 — First light over the Matterhorn. Hand-dripped mountain coffee and fresh sourdough with alpine honey.',
        afternoon: '13:00 — Glacier Express first-class carriage. Panoramic glass roof view of frozen viaducts with private sommelier tasting.',
        evening: '19:00 — Candlelit cheese fondue in an intimate 18th-century stübli with wood-fired hearth.',
        slowMoment: 'Watching fresh snowflakes tumble onto hot steaming herbal tea in the outdoor mineral pool.'
      },
      {
        theme: 'High Altitude Snowshoe & Hearth',
        morning: '09:00 — Guided snowshoe excursion with a local botanist through undisturbed larch forests.',
        afternoon: '14:00 — Afternoon resting in the library with wool blankets and alpine herb infusion.',
        evening: '20:00 — Four-course foraging dinner spotlighting cured meats, mountain truffles, and poached pears.',
        slowMoment: 'Stargazing at 2,200 meters where the Milky Way illuminates the snow peaks.'
      },
      {
        theme: 'Artisanal Village & Ancient Waterways',
        morning: '10:00 — Slow stroll through weather-beaten timber barns preserved from 1650.',
        afternoon: '15:00 — Private visit to an artisanal cheese cave to taste 36-month aged Gruyère reserve.',
        evening: '19:30 — Intimate fireside wine tasting led by a family vintner from the terraced vineyards of Lavaux.',
        slowMoment: 'Listening to the crackle of birch logs while writing post-journey letters.'
      },
      {
        theme: 'Thermal Waters & Departure Calm',
        morning: '09:00 — Early morning thermal soak surrounded by snowdrifts.',
        afternoon: '13:30 — Slow lunch on the veranda overlooking the sun-drenched valley.',
        evening: '18:00 — First-class scenic return rail to the atelier terminal with memories etched in slow time.',
        slowMoment: 'Taking one last deep breath of crisp sub-zero pine air before descent.'
      }
    ]
  },
  'kyoto': {
    name: 'Kyoto & The Inland Sea',
    country: 'Japan',
    region: 'Kansai & Seto Inland Sea',
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85',
    tagline: 'Moss temples, bamboo groves, and cedar-scented hot springs.',
    bestSeason: 'March – May for cherry blossoms; October – November for fiery maples',
    highlights: [
      'Private dawn entrance to Tenryu-ji zen rock garden before public opening',
      'Tea ceremony with a 15th-generation Urasenke master in an authentic teahouse',
      'Art island cruise to Naoshima on a private mahogany wooden cruiser',
      'Night kaiseki feast overlooking the Kamo River'
    ],
    staySuggestions: [
      {
        name: 'Aman Kyoto',
        type: 'Hidden Forest Sanctuary',
        features: 'Surrounded by secret moss gardens and onsen natural hot spring pavilions',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
      }
    ],
    dailyThemes: [
      {
        theme: 'Temple Arrival & Bamboo Whispers',
        morning: '09:00 — Bullet train arrival in Kyoto. Private tea greeting with ceremonial matcha.',
        afternoon: '14:30 — Guided contemplative walk through Arashiyama bamboo grove.',
        evening: '19:00 — Nine-course Kaiseki dinner celebrating seasonal bamboo shoots.',
        slowMoment: 'Listening to rain droplets bounce off traditional cedar shingles in the courtyard.'
      }
    ]
  },
  'santorini': {
    name: 'Santorini Caldera & Cyclades',
    country: 'Greece',
    region: 'Cyclades Islands',
    heroImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=85',
    tagline: 'Whitewashed cliff retreats and infinite Aegean blues.',
    bestSeason: 'May – June & September – October for golden light and calm seas',
    highlights: [
      'Private sunset catamaran cruise around Thirassia and active volcanic springs',
      'Vineyard tour through ancient indigenous Assyrtiko vines woven into baskets',
      'Cliffside cliff-carved plunge pool overlooking the volcanic caldera'
    ],
    staySuggestions: [
      {
        name: 'Canaves Oia Epitome',
        type: 'Cliffside Luxury Villa',
        features: 'Sunset views, volcanic stone architecture, infinity plunge pool',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80'
      }
    ],
    dailyThemes: [
      {
        theme: 'Caldera Light & Aegean Breeze',
        morning: '09:30 — Arrival at the cliffside villa. Fresh figs, Greek yogurt, and thyme honey on the terrace.',
        afternoon: '14:00 — Stroll through quiet marble paths of Megalochori village away from crowds.',
        evening: '19:45 — Sunset dining atop the caldera with grilled Aegean sea bass and Assyrtiko wine.',
        slowMoment: 'Watching sailboats trace faint white lines across the deep blue Aegean sea below.'
      }
    ]
  }
};

function generateCustomItinerary({ destination, days, pace, vibe, travelers, budgetTier }) {
  const destName = destination || 'Curated Escape';
  return {
    name: destName,
    country: 'Global Signature',
    region: 'Curated Atelier Journey',
    heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=85',
    tagline: `Slow luxury, quiet moments, and bespoke discovery across ${destName}.`,
    bestSeason: 'Spring and Autumn for temperate weather and tranquility',
    highlights: [
      `Private atelier welcome and personalized concierge briefing in ${destName}`,
      'Curated private tasting with local heritage artisans and culinary masters',
      'Exclusive sunset journey away from mainstream tourist trails',
      'Private wellness and restorative retreat day in signature surroundings'
    ],
    staySuggestions: [
      {
        name: `${destName} Signature Grand Residence`,
        type: 'Five-Star Boutique Estate',
        features: 'Private butler, bespoke interior architecture, private panoramic pool',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
      }
    ],
    dailyThemes: Array.from({ length: Math.min(days, 14) }, (_, i) => ({
      theme: `Day ${i + 1} — Curated Immersion & Discovery`,
      morning: '09:00 — Slow breakfast with artisanal regional selections and freshly pressed botanicals.',
      afternoon: '14:00 — Private tailored expedition with your dedicated local cultural specialist.',
      evening: '19:30 — Candlelit dining experience celebrating indigenous gastronomic roots.',
      slowMoment: 'Unwinding with local tea or vintage wine while taking in the twilight horizon.'
    }))
  };
}

// POST /api/ai-planner
router.post('/', async (req, res) => {
  try {
    const {
      prompt = '',
      destination = '',
      days = 7,
      pace = 'Relaxed & Slow',
      vibes = [],
      travelers = 'Couple',
      budgetTier = 'Ultra Luxury'
    } = req.body;

    let matchedDest = null;
    const cleanDest = (destination || '').trim().toLowerCase();
    const cleanPrompt = (prompt || '').trim().toLowerCase();

    if (cleanDest.includes('swiss') || cleanDest.includes('alps') || cleanDest.includes('zermatt') || cleanPrompt.includes('swiss') || cleanPrompt.includes('alps') || cleanPrompt.includes('switzerland')) {
      matchedDest = DESTINATION_KNOWLEDGE['swiss-alps'];
    } else if (cleanDest.includes('kyoto') || cleanDest.includes('japan') || cleanPrompt.includes('kyoto') || cleanPrompt.includes('japan') || cleanPrompt.includes('tokyo')) {
      matchedDest = DESTINATION_KNOWLEDGE['kyoto'];
    } else if (cleanDest.includes('santorini') || cleanDest.includes('greece') || cleanPrompt.includes('santorini') || cleanPrompt.includes('greece') || cleanPrompt.includes('aegean')) {
      matchedDest = DESTINATION_KNOWLEDGE['santorini'];
    }

    if (!matchedDest) {
      const extractedName = destination.trim() || (prompt ? prompt.split(' ')[0] : 'Alpine Haven');
      matchedDest = generateCustomItinerary({
        destination: extractedName,
        days: Number(days) || 7,
        pace,
        vibe: vibes,
        travelers,
        budgetTier
      });
    }

    const dayCount = Math.min(Math.max(Number(days) || 7, 3), 14);
    const slicedSchedule = matchedDest.dailyThemes.slice(0, dayCount);

    const baseDailyRate = budgetTier.includes('Ultra') ? 45000 : (budgetTier.includes('Atelier') ? 75000 : 28000);
    const estimatedTotal = Math.round(baseDailyRate * dayCount);

    const generatedItinerary = {
      id: `ai-itin-${Date.now()}`,
      destinationTitle: matchedDest.name,
      country: matchedDest.country,
      region: matchedDest.region,
      heroImage: matchedDest.heroImage,
      tagline: matchedDest.tagline,
      bestSeason: matchedDest.bestSeason,
      durationDays: dayCount,
      pace,
      travelers,
      budgetTier,
      estimatedPriceINR: estimatedTotal,
      highlights: matchedDest.highlights,
      staySuggestions: matchedDest.staySuggestions,
      schedule: slicedSchedule.map((day, idx) => ({
        dayNumber: idx + 1,
        theme: day.theme,
        morning: day.morning,
        afternoon: day.afternoon,
        evening: day.evening,
        slowMoment: day.slowMoment
      })),
      luggageAdvice: 'Bring layers of natural fibers (cashmere, merino wool, linen). Comfortable leather walking shoes for stone streets and quiet trails.',
      createdAt: new Date().toISOString()
    };

    return res.json({
      success: true,
      itinerary: generatedItinerary
    });
  } catch (err) {
    console.error('AI Planner error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate itinerary. Please try again.',
      details: err.message
    });
  }
});

module.exports = router;
