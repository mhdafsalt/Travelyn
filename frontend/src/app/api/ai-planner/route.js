import { NextResponse } from 'next/server';

// Curated Destination Knowledge Base for Travelyn slow-travel aesthetic
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
    name: 'Kyoto Ancient Sanctuaries',
    country: 'Japan',
    region: 'Kansai',
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85',
    tagline: 'Moss-covered stone pathways, cedar teahouses, and morning temple bells.',
    bestSeason: 'March – May for cherry blossoms; October – November for crimson maples',
    highlights: [
      'Private after-hours entry to a Zen rock garden before tourist hours',
      'Traditional tea ceremony with a 15th-generation Urasenke tea master',
      'Stay in a 200-year-old machiya residence with private hinoki bath',
      'Dawn stroll through the Arashiyama bamboo grove in solitary silence'
    ],
    staySuggestions: [
      {
        name: 'Aman Kyoto',
        type: 'Hidden Forest Sanctuary',
        features: 'Secret moss gardens, natural mineral onsen, pavilions nestled in ancient cedars',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Hoshinoya Kyoto',
        type: 'Historic River Ryokan',
        features: 'Accessible only by wooden boat down Oi River, sliding shoji screens, kaiseki feasts',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
      }
    ],
    dailyThemes: [
      {
        theme: 'Arrival into Gion & Twilight Lanterns',
        morning: '10:00 — Arrival by Shinkansen; private transfer to historic Higashiyama ryokan.',
        afternoon: '14:30 — Unwind with ceremonial matcha and seasonal wagashi on tatami overlooking private moss garden.',
        evening: '18:30 — Quiet twilight walk along Shirakawa canal with paper lanterns glowing across cobblestone lanes.',
        slowMoment: 'Hearing wooden geta sandals click softly against paving stones in the quiet of dusk.'
      },
      {
        theme: 'Morning Mist & Zen Calligraphy',
        morning: '06:30 — Dawn visit to Tenryu-ji garden before temple doors open to public. Morning chanting resonance.',
        afternoon: '13:00 — Private masterclass in washi paper making and sumi ink calligraphy with a local craftsman.',
        evening: '19:00 — Multi-course seasonal kaiseki dinner featuring Kyoto heirloom vegetables and fresh yuba.',
        slowMoment: 'The scent of cedar wood rising from the steaming hinoki bathtub.'
      },
      {
        theme: 'Philosopher’s Path & Pottery Atelier',
        morning: '09:00 — Meandering stroll along the stone path following the canal shaded by weeping cherry trees.',
        afternoon: '14:00 — Tea bowl pottery atelier in Kiyomizu neighborhood. Molding raw clay under a master docent.',
        evening: '19:30 — Soba noodle degustation paired with regional Junmai Daiginjo sake.',
        slowMoment: 'Watching a single fallen maple leaf drift gently along the garden pond.'
      },
      {
        theme: 'Uji Tea Terraces & Quiet Waters',
        morning: '09:30 — Excursion to Uji riverbanks. Walk through terraced green tea fields cultivated for centuries.',
        afternoon: '14:00 — Whisking ceremonial tencha leaves with a bamboo chasen.',
        evening: '19:00 — Charcoal-grilled wagyu and cedar-smoked wild mountain trout.',
        slowMoment: 'Closing your eyes while drinking deep, savory Gyokuro tea drop by drop.'
      },
      {
        theme: 'Temple Bells & Quiet Reflection',
        morning: '08:00 — Meditation session with an Abbot at Daitoku-ji temple sub-monastery.',
        afternoon: '13:00 — Slow Bento lunch in an open cedar pavilion.',
        evening: '18:30 — Parting tea ceremony and evening stroll through bamboo grove under moonlight.',
        slowMoment: 'Feeling the absolute stillness of a 500-year-old rock garden with no sound but water drips.'
      }
    ]
  },

  'santorini': {
    name: 'Santorini Caldera Poetry',
    country: 'Greece',
    region: 'Cyclades Islands',
    heroImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=85',
    tagline: 'Whitewashed cliffside terraces, Aegean blues, and slow caldera sails.',
    bestSeason: 'May – June & September – October for golden light and tranquil evenings',
    highlights: [
      'Private vintage catamaran sail across volcanic hot springs at twilight',
      'Assyrtiko wine tasting in an ancient volcanic vineyard pruned in woven baskets',
      'Sunset cave pool swim in private suites 300 meters above the Aegean',
      'Cliffside cliff walk between Imerovigli and Oia at first dawn'
    ],
    staySuggestions: [
      {
        name: 'Mystique Luxury Collection Hotel',
        type: 'Caldera Cliff Cave Suite',
        features: 'Sculpted out of volcanic rock, private infinity pool, wine cave cellar',
        image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Canaves Oia Epitome',
        type: 'Bespoke Sunset Villa',
        features: 'Panoramic Aegean sea views, private butler service, sea-facing plunge pool',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80'
      }
    ],
    dailyThemes: [
      {
        theme: 'Arrival at the Cliff Edge',
        morning: '10:00 — Arrival into Thira airport; private Mercedes transfer along caldera ridgeline.',
        afternoon: '14:00 — Check-in to cliffside cave villa. Cold bottle of Assyrtiko wine and wild caper berries on the terrace.',
        evening: '19:00 — Sunset dinner on a secluded private balcony as the caldera lights shimmer like gold dust.',
        slowMoment: 'Dipping bare feet in the cool cave pool while watching the Aegean sea turn deep indigo.'
      },
      {
        theme: 'Volcanic Soil & Ancient Vines',
        morning: '09:30 — Morning Greek yogurt with wild thyme honey and ripe figs overlooking the sea.',
        afternoon: '13:30 — Visit to a 150-year-old ungrafted vineyard pruned in traditional kouloura rings to resist Aegean winds.',
        evening: '19:30 — Fresh grilled red mullet and fava puree in an authentic seaside taverna in Ammoudi Bay.',
        slowMoment: 'Feeling the warm volcanic stone underfoot as the evening breeze cools the cliffside.'
      },
      {
        theme: 'Private Aegean Sailing',
        morning: '10:00 — Leisurely breakfast on the sun terrace with warm bougatsa pastry.',
        afternoon: '14:00 — Boarding a private 45-foot catamaran sail past Red Beach and the volcanic caldera crater.',
        evening: '19:00 — Anchored off Oia lighthouse for the world’s most celebrated sunset from the sea.',
        slowMoment: 'The silent glide of sails cutting through glassy Mediterranean waters at dusk.'
      },
      {
        theme: 'Cliffside Trail & Akrotiri Discovery',
        morning: '07:30 — Early morning walk along the cliff edge from Imerovigli to Oia before the heat rises.',
        afternoon: '13:00 — Private archaeological tour of prehistoric Akrotiri frescoes and 3,600-year-old villas.',
        evening: '19:30 — Rooftop dinner with slow-braised lamb, oregano, and aged Vinsanto dessert wine.',
        slowMoment: 'Watching distant ferry wakes draw white trails across the silent blue expanse.'
      },
      {
        theme: 'Golden Light & Farewell',
        morning: '09:00 — Relaxed farewell breakfast with fresh pomegranate juice.',
        afternoon: '12:30 — Final swim in the cliff plunge pool.',
        evening: '17:00 — Private transfer with artisanal olive oil and Greek mountain tea gift box.',
        slowMoment: 'Memorizing the infinite horizon where blue water meets cloudless sky.'
      }
    ]
  }
};

// Generic Generator for custom destinations
function generateCustomItinerary({ destination, days = 7, pace = 'Balanced', vibe = [], travelers = 'Couple', budgetTier = 'Boutique Luxury' }) {
  const destName = destination || 'Bespoke World Destination';
  const highlights = [
    `Private slow-curated exploration of ${destName}'s most secluded spots`,
    'Hand-selected boutique heritage stay focused on architectural charm',
    'Private culinary encounters with local chefs and regional winemakers',
    'Unrushed rhythm avoiding tourist crowds and scheduled congestion'
  ];

  const staySuggestions = [
    {
      name: `${destName} Heritage Sanctuary`,
      type: 'Boutique Luxury Residence',
      features: 'Panoramic views, customized concierge service, organic estate dining',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'The Secret Atelier Retreat',
      type: 'Private Country Villa',
      features: 'Exclusive grounds, private plunge pool, daily artisanal farm breakfasts',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const dailyThemes = [];
  const count = Math.min(Math.max(Number(days) || 5, 3), 14);

  const themePool = [
    {
      title: 'Arrival, Slow Settling & First Welcome',
      morning: 'Private arrival transfer into your sanctuary; refreshing welcome herbal tonic and local seasonal fruit.',
      afternoon: 'Unpacking and orientation walk through the private gardens and nearby cobbled village streets.',
      evening: 'Intimate multi-course welcome dinner highlighting regional terroir and organic wines.',
      slowMoment: 'Watching the twilight settle over the landscape with quiet acoustic music and unhurried conversation.'
    },
    {
      title: 'Heritage Roots & The Hidden Quarter',
      morning: 'Early morning coffee on the veranda followed by a private docent walk through historic quarters before crowds awaken.',
      afternoon: 'Private lunch in a shaded courtyard accompanied by regional bread and olive oil tastings.',
      evening: 'Boutique wine or spirit pairing session guided by a family cellar master.',
      slowMoment: 'Pausing under ancient arches to watch the sunlight filter through stone windows.'
    },
    {
      title: 'Sublime Nature & Open Horizons',
      morning: 'Gentle sunrise stroll along panoramic viewpoints and quiet woodland trails.',
      afternoon: 'Private picnic prepared by our culinary team with artisanal cheeses, crusty loaf, and chilled vintage wine.',
      evening: 'Fireside dining with locally sourced seafood or roasted mountain dishes.',
      slowMoment: 'Deep restorative thermal soak with expansive views across the valleys.'
    },
    {
      title: 'Artisanal Craft & Culinary Atelier',
      morning: 'Hands-on morning masterclass with a master craftsman or local ceramicist.',
      afternoon: 'Leisurely terrace lunch and afternoon free for reading, journaling, or quiet contemplation.',
      evening: 'Candlelit dinner in a secluded alcove with bespoke degustation menu.',
      slowMoment: 'Feeling the smooth glaze of handmade pottery under your fingertips.'
    },
    {
      title: 'The Secret Waterways & Coastal Drift',
      morning: 'Private wooden boat charter skimming quiet bays or serene lake waters.',
      afternoon: 'Swimming in secluded coves, sun-warmed rocks, and fresh citrus refreshments.',
      evening: 'Fresh catch dinner prepared directly over olive-wood coals.',
      slowMoment: 'The rhythmic lap of gentle water against the hull with no engine sound.'
    },
    {
      title: 'Hidden Valleys & Sunset Rhythms',
      morning: 'Scenic backroad drive past wild orchards and stone farmhouses.',
      afternoon: 'Afternoon tea in a historic conservatory surrounded by botanical rarities.',
      evening: 'Private jazz or classical chamber performance arranged exclusively for your party.',
      slowMoment: 'The golden hour light bathing ancient stonework in amber warmth.'
    },
    {
      title: 'Integration, Reflection & Parting Calm',
      morning: 'Long, slow breakfast overlooking the landscape with freshly pressed juices.',
      afternoon: 'Gentle packing, final memory gathering, and farewell stroll.',
      evening: 'Private departure transfer with handcrafted bespoke memento from the atelier.',
      slowMoment: 'Carrying the peaceful internal rhythm of the journey back into everyday life.'
    }
  ];

  for (let i = 0; i < count; i++) {
    const template = themePool[i % themePool.length];
    dailyThemes.push({
      theme: `Day ${i + 1}: ${template.title}`,
      morning: template.morning.replace(/your sanctuary/g, `your ${destName} retreat`),
      afternoon: template.afternoon,
      evening: template.evening,
      slowMoment: template.slowMoment
    });
  }

  return {
    name: destName,
    country: 'Curated World',
    region: 'Atelier Slow Travel',
    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=85',
    tagline: `Slow luxury, quiet moments, and bespoke discovery across ${destName}.`,
    bestSeason: 'Spring and Autumn for temperate weather and solitude',
    highlights,
    staySuggestions,
    dailyThemes
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      prompt = '',
      destination = '',
      days = 7,
      pace = 'Relaxed & Slow',
      vibes = [],
      travelers = 'Couple',
      budgetTier = 'Ultra Luxury'
    } = body;

    // Determine destination key
    let matchedDest = null;
    const cleanDest = destination.trim().toLowerCase();
    const cleanPrompt = prompt.trim().toLowerCase();

    if (cleanDest.includes('swiss') || cleanDest.includes('alps') || cleanDest.includes('zermatt') || cleanPrompt.includes('swiss') || cleanPrompt.includes('alps') || cleanPrompt.includes('switzerland')) {
      matchedDest = DESTINATION_KNOWLEDGE['swiss-alps'];
    } else if (cleanDest.includes('kyoto') || cleanDest.includes('japan') || cleanPrompt.includes('kyoto') || cleanPrompt.includes('japan') || cleanPrompt.includes('tokyo')) {
      matchedDest = DESTINATION_KNOWLEDGE['kyoto'];
    } else if (cleanDest.includes('santorini') || cleanDest.includes('greece') || cleanPrompt.includes('santorini') || cleanPrompt.includes('greece') || cleanPrompt.includes('aegean')) {
      matchedDest = DESTINATION_KNOWLEDGE['santorini'];
    }

    if (!matchedDest) {
      // Generate custom bespoke itinerary
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

    // Calculate realistic estimate in INR ₹
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
      pace: pace,
      travelers: travelers,
      budgetTier: budgetTier,
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

    return NextResponse.json({
      success: true,
      itinerary: generatedItinerary
    });
  } catch (error) {
    console.error('AI Planner error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate itinerary. Please try again.' },
      { status: 500 }
    );
  }
}
