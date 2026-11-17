const { Router } = require('express');

const router = Router();

const DESTINATION_KNOWLEDGE = {
  'kashmir': {
    name: 'Kashmir — Floating Sanctuaries & Alpine Valleys',
    country: 'India',
    region: 'Jammu & Kashmir (Himalayas)',
    heroImage: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1600&q=85',
    tagline: 'Private carved cedar houseboats on Dal Lake, saffron meadows, and snow-capped pine valleys.',
    bestSeason: 'April – October for blooming tulip gardens & shikara rides; December – March for Gulmarg snow',
    highlights: [
      'Private dawn shikara glide through Dal Lake floating flower and spice markets',
      'Artisanal Kashmiri Kahwa tea ceremony with saffron, crushed almonds, and cardamom',
      'Heritage walnut woodcarving and Pashmina weaving studio masterclass in Old Srinagar',
      'High-altitude alpine meadow picnic overlooking snow-clad Pir Panjal peaks'
    ],
    places: [
      {
        name: 'Dal Lake & Nigeen Lake',
        type: 'Sacred Waterways',
        icon: '🛶',
        description: 'Silent dawn shikara glides through floating flower and vegetable bazaars, lotus water canals, and quiet cedarwood houseboats.'
      },
      {
        name: 'Gulmarg & Apharwat Peak',
        type: 'Alpine Wilderness',
        icon: '🏔️',
        description: 'World-famous Gulmarg Gondola ascent to 4,200m powdery snowfields, pine forest nature trails, and panoramic Himalayan vistas.'
      },
      {
        name: 'Pahalgam & Betaab Valley',
        type: 'Glacial River Valley',
        icon: '🌲',
        description: 'Rushing turquoise Lidder River trails, pristine pine-wood glens, and pastoral Himalayan meadows under snow peaks.'
      },
      {
        name: 'Mughal Gardens (Nishat & Shalimar Bagh)',
        type: 'Historic Royal Terraces',
        icon: '🌸',
        description: 'Centuries-old terraced Persian water cascades, stone fountains, and giant Chinar trees planted by Emperor Jahangir.'
      },
      {
        name: 'Old Srinagar & Shah-e-Hamdan',
        type: 'Cultural Heritage Quarter',
        icon: '🏛️',
        description: 'Intricate 14th-century carved walnut architecture, aromatic saffron lanes, copper craftsmen, and Pashmina handlooms.'
      }
    ],
    gastronomy: [
      {
        name: 'The Royal 36-Course Wazwan Banquet',
        type: 'Iconic Feast',
        highlight: 'Slow-cooked over wood fires',
        description: 'The pinnacle of Kashmiri culinary artistry: Rogan Josh, yogurt-simmered Gushtaba, tender Rista, and caramelized Tabak Maaz ribs.'
      },
      {
        name: 'Saffron Kashmiri Kahwa',
        type: 'Signature Warm Beverage',
        highlight: 'Pure Pampore Saffron',
        description: 'Steaming green tea brewed in brass samovars with pure saffron strands, green cardamom, cinnamon, and slivered roasted almonds.'
      },
      {
        name: 'Nadru Yakhni & Kashmiri Dum Aloo',
        type: 'Valley Vegetarian Delicacy',
        highlight: 'Lotus Root & Fennel',
        description: 'Crisp lotus root stems from Dal Lake simmered in velvety spiced yogurt gravy, served with slow-cooked spiced baby potatoes.'
      },
      {
        name: 'Morning Breads (Sheermal & Bakarkhani)',
        type: 'Traditional Bakery & Tea',
        highlight: 'Salted Pink Noon Chai',
        description: 'Freshly baked saffron-brushed puff pastry and flaky sesame breads baked in clay tandoors, paired with traditional pink salted tea.'
      }
    ],
    staySuggestions: [
      {
        name: 'The Khyber Himalayan Resort & Spa',
        type: '5-Star Alpine Sanctuary (Gulmarg)',
        features: 'Heated indoor glass pool overlooking snowy pine canopies, luxury L’Occitane spa, and direct ski access',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Sukoon Luxury Cedar Houseboat',
        type: 'Eco-Heritage Floating Residence (Nigeen Lake)',
        features: 'Hand-carved walnut wood interiors, private shikara boatman, and starlit rooftop sundeck dining',
        image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'The Lalit Grand Palace Srinagar',
        type: 'Royal Heritage Palace (Gupkar Road)',
        features: 'Former residence of the Maharaja of Jammu & Kashmir, set in rolling Chinar orchards overlooking Dal Lake',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
      }
    ],
    dailyThemes: [
      {
        theme: 'Arrival & Dal Lake Floating Sanctuary',
        morning: '10:00 — Srinagar airport arrival, private transfer to Nigeen Lake. Warm welcome with steamed Kashmiri Kahwa and saffron honey.',
        afternoon: '14:30 — Slow shikara glide through silent lotus channels and heritage wooden water bridges.',
        evening: '19:30 — Private candlelit dinner on the cedar deck: slow-simmered Rogan Josh, Nadru Yakhni, and fragrant saffron rice.',
        slowMoment: 'Watching evening mist settle over Dal Lake as the call to prayer echoes across the water.'
      },
      {
        theme: 'Saffron Terraces & Mughal Terraced Gardens',
        morning: '08:30 — Sunrise walk through Nishat and Shalimar gardens with a Kashmiri horticulturist.',
        afternoon: '13:30 — Scenic drive to Pampore saffron fields with a private tasting of pure Kashmir saffron infusions.',
        evening: '19:00 — Stroll through Old Srinagar’s carved wooden balconies and copper bazaar.',
        slowMoment: 'Sipping steaming samovar tea with fresh sheermal bread in an ancient wooden courtyard.'
      },
      {
        theme: 'High Meadows of Gulmarg & Pine Stillness',
        morning: '09:00 — Ascend into Gulmarg pine forests. Panoramic Gondola ride over snow-draped alpine ridges.',
        afternoon: '14:00 — Slow nature trek through quiet meadows lined with wild alpine flowers.',
        evening: '20:00 — Fireside Himalayan dinner with roasted trout and local wild morel mushrooms.',
        slowMoment: 'Sitting beside a crackling bukhari hearth while watching moonlight bathe the snow-covered slopes.'
      },
      {
        theme: 'Pahalgam River Valleys & Betaab Meadows',
        morning: '08:30 — Gentle morning journey following the rushing turquoise Lidder River to Pahalgam.',
        afternoon: '13:00 — Riverside artisan lunch with fresh organic trout and freshly baked Kashmiri bread.',
        evening: '19:30 — Private poetry and acoustic Santoor musical evening under starlit Himalayan skies.',
        slowMoment: 'Dipping fingers in crystal-clear glacial streams beneath towering Himalayan pines.'
      },
      {
        theme: 'Departure Calm & Final Lake Reflection',
        morning: '07:30 — Dawn shikara to the floating vegetable market where boatmen barter amid morning mist.',
        afternoon: '12:00 — Handpicked souvenir curation: pure Pashmina shawls and hand-painted papier-mâché.',
        evening: '17:00 — Transfer to Srinagar departure terminal carrying the timeless serenity of the valley.',
        slowMoment: 'One last long look at the Pir Panjal mountains mirrored on the still surface of the lake.'
      }
    ]
  },
  'rajasthan': {
    name: 'Rajasthan — Regal Palaces & Desert Twilight',
    country: 'India',
    region: 'Rajasthan & Thar Desert',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=85',
    tagline: 'Ochre sandstone fortresses, private palace courtyards, and starlit dune encampments.',
    bestSeason: 'October – March for crisp pleasant days and cool desert evenings',
    highlights: [
      'Private sunset champagne on the rooftop ramparts of an 18th-century royal palace',
      'Contemplative camel safari across serene golden dunes far beyond tourist caravans',
      'Artisanal block printing and indigo dyeing workshop with 6th-generation royal craftsmen',
      'Private candlelit dinner in a mirror-worked palace courtyard with classical sitar'
    ],
    places: [
      {
        name: 'Lake Pichola & City Palace (Udaipur)',
        type: 'Royal Waterfront',
        icon: '🏰',
        description: 'Shimmering lake reflecting centuries of Mewar royal architecture, jharokha balconies, and the island water palace of Jag Mandir.'
      },
      {
        name: 'Amber Fort & Hawa Mahal (Jaipur)',
        type: 'Heritage Fortress',
        icon: '👑',
        description: 'Magnificent honey-hued fort atop the Aravalli hills with mirrored Sheesh Mahal, paired with the iconic Palace of Winds.'
      },
      {
        name: 'Mehrangarh Fort & Blue City (Jodhpur)',
        type: 'Cliffside Fortress',
        icon: '🛡️',
        description: 'Colossal fortress towering 400 feet above the ocean of indigo-blue homes, housing royal palanquins and weapons.'
      },
      {
        name: 'Sam Sand Dunes (Jaisalmer)',
        type: 'Thar Desert Encampment',
        icon: '🐪',
        description: 'Untouched sweeping golden desert dunes, tranquil camel rides, and fireside folk storytelling under celestial desert skies.'
      },
      {
        name: 'Pushkar Sacred Lake & Ghats',
        type: 'Spiritual Sanctuary',
        icon: '✨',
        description: 'Fifty-two sacred bathing ghats surrounded by desert hills, morning chants, and aromatic rose plantations.'
      }
    ],
    gastronomy: [
      {
        name: 'Authentic Dal Baati Churma',
        type: 'Signature Royal Dish',
        highlight: 'Pure Desi Ghee & Panchmel Dal',
        description: 'Golden baked wheat dumplings dipped in pure clarified butter, served with five-lentil dal and sweet powdered jaggery churma.'
      },
      {
        name: 'Royal Rajput Laal Maas',
        type: 'Historic Game Meat Recipe',
        highlight: 'Mathania Red Chilies',
        description: 'Tender mutton slow-braised for hours with fiery Mathania red chilies, mustard oil, garlic, and whole royal spices.'
      },
      {
        name: 'Ker Sangri & Gatte ki Sabzi',
        type: 'Desert Heritage Delicacy',
        highlight: 'Wild Desert Berries',
        description: 'Wild desert berries and tender dried beans tossed with dry spices, alongside steamed gram flour dumplings in curd gravy.'
      },
      {
        name: 'Classic Ghevar & Pyaaz Kachori',
        type: 'Iconic Confectionery',
        highlight: 'Saffron Rabri Topping',
        description: 'Crisp honeycomb disc pastry soaked in saffron sugar syrup topped with malai, alongside flaky spiced onion kachoris.'
      }
    ],
    staySuggestions: [
      {
        name: 'Taj Lake Palace, Udaipur',
        type: 'Floating Marble Palace',
        features: 'Private heritage suites on Lake Pichola, 24-hour royal butler, heritage water taxi, and sunset palace cruises',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'The Oberoi Udaivilas',
        type: 'Grand Rajasthani Estate',
        features: 'Intricate dome corridors, semi-private pool access, views of the City Palace, and traditional spa therapies',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Rambagh Palace, Jaipur',
        type: 'Former Royal Residence',
        features: '47 acres of tranquil gardens with wandering peacocks, vintage Rolls-Royce transfers, and royal polo lounge',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80'
      }
    ],
    dailyThemes: [
      {
        theme: 'Royal Arrival & Pichola Lake Reflections',
        morning: '10:00 — Arrival in Udaipur. Private boat crossing to your floating marble palace.',
        afternoon: '14:30 — Unpack in royal suite adorned with hand-painted murals and carved jharokha balconies.',
        evening: '19:30 — Welcome dinner on the palace terrace with Mewari royal delicacies and local aged wines.',
        slowMoment: 'Watching the City Palace illuminate in amber gold across the darkened waters of Lake Pichola.'
      },
      {
        theme: 'Artisans, Courtyards & Old Haveli Secrets',
        morning: '09:00 — Private access to the City Palace museum before general gates open.',
        afternoon: '14:00 — Stroll through Bagore Ki Haveli and meet master miniature painters in their heritage studio.',
        evening: '19:45 — Candlelit rooftop dinner serenaded by classical sarangi melodies.',
        slowMoment: 'Listening to the gentle lapping of lake water against ancient stone steps as temple bells chime.'
      },
      {
        theme: 'Golden Sandstone & Thar Desert Stillness',
        morning: '08:30 — Journey into the golden desert scrub. Arrival at a private luxury tented oasis.',
        afternoon: '16:00 — Gentle sunset ride across untouched dunes with private tea and dates setup.',
        evening: '20:00 — Fireside Rajasthani feast under an expanse of infinite desert stars.',
        slowMoment: 'The profound silence of the desert when the wind drops at twilight.'
      }
    ]
  },
  'delhi': {
    name: 'Delhi — Mughal Splendour & Lutyens Avenues',
    country: 'India',
    region: 'National Capital Region',
    heroImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=85',
    tagline: 'Ancient Mughal sandstone domes, quiet stepwells, and leafy colonial avenues.',
    bestSeason: 'October – March for cool mornings, lush gardens, and outdoor café culture',
    highlights: [
      'Private sunrise walk through Lodhi Gardens before the city awakes',
      'Curated Old Delhi spice and culinary walk through historic Chandni Chowk lanes',
      'Architectural tour of Humayun’s Tomb and Agrasen Ki Baoli stepwell with a historian',
      'Evening classical music recital in an intimate Nizamuddin Sufi sanctuary'
    ],
    places: [
      {
        name: 'Humayun’s Tomb & Sunder Nursery',
        type: 'Mughal Architecture',
        icon: '🕌',
        description: '16th-century red sandstone Mughal masterpiece that inspired the Taj Mahal, surrounded by 90 acres of restored Persian paradise gardens.'
      },
      {
        name: 'Old Delhi & Chandni Chowk',
        type: 'Historic Walled City',
        icon: '🏮',
        description: 'Atmospheric 17th-century Shahjahanabad, Asia’s largest spice market (Khari Baoli), and the towering minarets of Jama Masjid.'
      },
      {
        name: 'Lodhi Gardens & Agrasen Ki Baoli',
        type: 'Heritage Monuments',
        icon: '🌿',
        description: 'Centuries-old 15th-century Sayyid and Lodhi dynasty garden tombs alongside an ancient 108-step stone stepwell.'
      },
      {
        name: 'Qutub Minar Complex',
        type: 'UNESCO Victory Monument',
        icon: '🏛️',
        description: 'World’s tallest brick minaret at 72.5 meters, surrounded by ancient ruins dating back to the 12th century.'
      },
      {
        name: 'India Gate & Lutyens’ Avenues',
        type: 'Ceremonial Boulevards',
        icon: '🌳',
        description: 'Tree-lined imperial avenues framed by Rashtrapati Bhavan, banyan trees, and grand colonial architecture.'
      }
    ],
    gastronomy: [
      {
        name: 'Purani Dilli Slow-Cooked Nihari',
        type: 'Old Delhi Classic',
        highlight: 'Overnight Braised Shank',
        description: 'Overnight slow-simmered bone shank stew infused with 50 spices, served with tender seekh kebabs and hot khameeri roti.'
      },
      {
        name: 'Original Butter Chicken & Dal Makhani',
        type: 'Iconic North Indian',
        highlight: 'Smoked Tandoori & Tomato Cream',
        description: 'Tandoori chicken simmered in rich velvety tomato, fresh butter, and fragrant fenugreek gravy, with 24-hour black lentils.'
      },
      {
        name: 'Paranthe Wali Gali Delicacies',
        type: 'Historic Street Breads',
        highlight: 'Clay Tandoor & Fillings',
        description: 'Crisp layered stuffed flatbreads filled with spiced paneer, peas, and rabri, served with sweet-and-sour pumpkin dip.'
      },
      {
        name: 'Daulat Ki Chaat & Rabri Kulfi',
        type: 'Ethereal Winter Dessert',
        highlight: 'Morning Dew Foam & Saffron',
        description: 'Ethereal winter foam dessert made from churned milk kissed by dew and saffron, alongside pistacio-studded rabri kulfi.'
      }
    ],
    staySuggestions: [
      {
        name: 'The Imperial New Delhi',
        type: '1930s Art Deco Landmark',
        features: 'Museum-grade British-India art collection, royal palm gardens, Italian marble colonnades, and heritage dining',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'The Leela Palace New Delhi',
        type: 'Modern Luxury Palace (Chanakyapuri)',
        features: 'Lutyens-inspired palace architecture, rooftop infinity pool, and French Michelin-inspired dining',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
      }
    ],
    dailyThemes: [
      {
        theme: 'Sandstone Heritage & Garden Tombs',
        morning: '08:00 — Peaceful morning stroll through Humayun’s Tomb gardens as sunlight filters through jali screens.',
        afternoon: '13:00 — Private heritage lunch featuring slow-braised Awadhi cuisine and rose sherbet.',
        evening: '19:00 — Classical sitar and dinner in an open-air courtyard beneath banyan trees.',
        slowMoment: 'Watching green parakeets dart between 16th-century stone arches at dusk.'
      }
    ]
  },
  'mumbai': {
    name: 'Mumbai — Arabian Sea Coasts & Art Deco Mansions',
    country: 'India',
    region: 'Maharashtra Coast',
    heroImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=85',
    tagline: 'Art Deco sea promenades, vintage heritage lanes, and Arabian Sea breeze.',
    bestSeason: 'November – February for breezy coastal evenings and pleasant outdoor dining',
    highlights: [
      'Private sunrise yacht cruise from the Gateway of India past historic lighthouses',
      'Walking tour of Oval Maidan and Marine Drive Art Deco district with an architect',
      'Curated private tasting at Mumbai’s most celebrated coastal seafood institutions',
      'Evening cocktails on a heritage rooftop gazing over the illuminated Queen’s Necklace'
    ],
    places: [
      {
        name: 'Gateway of India & Harbour',
        type: 'Maritime Landmark',
        icon: '⛵',
        description: 'Grand Indo-Saracenic basalt arch overlooking the Arabian Sea, private departure jetty for morning sails and harbor cruises.'
      },
      {
        name: 'Marine Drive & Queen’s Necklace',
        type: 'Art Deco Coastal Boulevard',
        icon: '🌊',
        description: 'Sweeping 3.6-kilometer seaside promenade renowned for the world’s second-largest collection of UNESCO Art Deco heritage.'
      },
      {
        name: 'Kala Ghoda & Fort Arts Precinct',
        type: 'Art & Design District',
        icon: '🎨',
        description: 'Tree-shaded cobbled lanes filled with contemporary art galleries, indie fashion houses, and Victorian Gothic edifices.'
      },
      {
        name: 'Elephanta Rock-Cut Caves',
        type: 'UNESCO Ancient Island Temple',
        icon: '🗿',
        description: '5th-century rock-cut temple caves dedicated to Lord Shiva, accessible by private cruiser across Mumbai Harbour.'
      },
      {
        name: 'Bandra Seaside & Ranwar Village',
        type: 'Portuguese Heritage & Cafes',
        icon: '🏘️',
        description: 'Charming Portuguese heritage bungalows, seaside Bandstand promenade, and views of the Bandra-Worli Sea Link.'
      }
    ],
    gastronomy: [
      {
        name: 'Coastal Malvani Butter Garlic Crab',
        type: 'Seafood Masterpiece',
        highlight: 'Fresh Arabian Sea Catch',
        description: 'Succulent mud crab in rich butter-garlic emulsion, alongside crispy spiced Bombay Duck fry and coconut Surmai curry.'
      },
      {
        name: 'Irani Café Bun Maska & Chai',
        type: 'Colonial Nostalgia',
        highlight: 'Soft Crust Buns & Berry Pulao',
        description: 'Warm crusty bun smothered in salted churned butter dipped in cardamom tea, followed by fragrant Parsi mutton berry pulao.'
      },
      {
        name: 'Iconic Bombay Street Chaat & Vada Pav',
        type: 'City Street Classics',
        highlight: 'Golden Potato & Garlic Chutney',
        description: 'Golden spiced potato fritter in pillowy pav with dry garlic peanut chutney, followed by tangy seaside sev puri at Chowpatty.'
      },
      {
        name: 'Parsi Salli Boti & Patra Ni Machhi',
        type: 'Heritage Parsi Cuisine',
        highlight: 'Steamed in Banana Leaves',
        description: 'Tender meat simmered in sweet-and-sour gravy topped with crisp potato matchsticks, and pomfret coated in green chutney.'
      }
    ],
    staySuggestions: [
      {
        name: 'The Taj Mahal Palace (Colaba)',
        type: '1903 Maritime Heritage Palace',
        features: 'Overlooking the Gateway of India, sea-facing luxury suites, private yacht charters, and heritage docent walks',
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'The Oberoi, Mumbai',
        type: 'Seaside Luxury (Marine Drive)',
        features: 'Floor-to-ceiling Arabian Sea vistas, luxury spa, and award-winning oceanfront dining on the Queen’s Necklace',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
      }
    ],
    dailyThemes: [
      {
        theme: 'Harbor Dawn & Historic Colaba Strolls',
        morning: '07:00 — Private sailboat into Mumbai Harbor as morning mist lifts over the Arabian Sea.',
        afternoon: '13:30 — Slow lunch at a classic heritage café followed by art gallery visits in Kala Ghoda.',
        evening: '19:30 — Sunset stroll along Marine Drive with sea breeze, followed by coastal Konkan delicacies.',
        slowMoment: 'Sitting quietly on the stone seawall listening to waves crash rhythmically against the rocks.'
      }
    ]
  },
  'meghalaya': {
    name: 'Meghalaya — Living Root Bridges & Cloud Sanctuaries',
    country: 'India',
    region: 'Northeast India (Abode of Clouds)',
    heroImage: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1600&q=85',
    tagline: 'Bio-engineered root bridges, emerald natural plunge pools, and sacred misty pine groves.',
    bestSeason: 'September – May for crystal clear rivers; June – August for dramatic waterfalls',
    highlights: [
      'Private descent through Khasi cloud forests to sacred double-decker living root bridges',
      'Boat glide on crystal-clear Umngot river in Dawki with boats appearing to float on glass',
      'Traditional Khasi village homestay with wild botanical foraging and bamboo cooking',
      'Private cave meditation exploration inside ancient limestone caverns of Mawsmai'
    ],
    places: [
      {
        name: 'Double Decker Living Root Bridge',
        type: 'Bio-Engineering Wonder',
        icon: '🌿',
        description: '250-year-old living bridge grown by Khasi tribes from aerial rubber tree roots crossing cascading jungle torrents.'
      },
      {
        name: 'Umngot River Glass Waters (Dawki)',
        type: 'Crystal Emerald River',
        icon: '🛶',
        description: 'River waters so pristine and transparent that country wooden boats appear to float in mid-air above smooth river pebbles.'
      },
      {
        name: 'Nohkalikai Falls (Cherrapunji)',
        type: 'Plunge Waterfall',
        icon: '💧',
        description: 'India’s tallest plunge waterfall cascading 1,115 feet into an emerald pool amid dramatic swirling cloud gorges.'
      },
      {
        name: 'Mawphlang Sacred Grove',
        type: 'Ancient Cloud Rainforest',
        icon: '🌲',
        description: 'Pristine rainforest sanctuary protected by Khasi clans for over 800 years, home to sacred monoliths and rare orchids.'
      },
      {
        name: 'Umiam Lake & Laitlum Canyons',
        type: 'Highland Vistas',
        icon: '🌄',
        description: 'Serene highland lake framed by pine forests, leading to the dizzying knife-edge gorges of Laitlum.'
      }
    ],
    gastronomy: [
      {
        name: 'Traditional Khasi Jadoh & Dohneiiong',
        type: 'Tribal Specialty',
        highlight: 'Hill Rice & Black Sesame',
        description: 'Aromatic short-grain hill rice simmered with subtle spices and meat, accompanied by pork braised in rich black sesame paste.'
      },
      {
        name: 'Tungrymbai & Fluffy Pumaloi',
        type: 'Fermented Delicacy',
        highlight: 'Fermented Soya & Rice Cakes',
        description: 'Fermented indigenous soybeans sautéed with ginger, garlic, and wild herbs, served with steamed rice cakes in banana leaves.'
      },
      {
        name: 'Smoked Bamboo Shoot Hill Curry',
        type: 'Forest Foraging',
        highlight: 'Smoked Mountain Herbs',
        description: 'Slow-smoked hill meats and mountain mushrooms stewed with tender bamboo shoots and indigenous green herbs.'
      },
      {
        name: 'Wild Berry Tea & Khasi Honey',
        type: 'Highland Infusion',
        highlight: 'Wild Forest Honeycomb',
        description: 'High-altitude organic green and black tea flavored with wild Himalayan berries and pure indigenous forest honey.'
      }
    ],
    staySuggestions: [
      {
        name: 'Ri Kynjai — Serenity by the Lake',
        type: 'Lakeside Boutique Retreat (Umiam)',
        features: 'Traditional Khasi thatch architecture, pine spa overlooking Umiam Lake, and lakeside organic dining',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Polo Orchid Resort (Cherrapunji)',
        type: 'Cliffside Cloud Resort',
        features: 'Perched on cliff edges with private balconies offering panoramic views of Seven Sisters waterfall and deep mist gorges',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
      }
    ],
    dailyThemes: [
      {
        theme: 'Umiam Lake Waters & Pine Aromas',
        morning: '10:00 — Arrival in Shillong, transfer to serene lake resort. Welcome with local wild berry tea.',
        afternoon: '14:30 — Slow walk through Mawphlang Sacred Forest with a local Khasi elder guide.',
        evening: '19:30 — Fireside organic dinner featuring smoked bamboo shoots and wild mountain rice.',
        slowMoment: 'Watching rolling white clouds descend gently over emerald pine ridges.'
      }
    ]
  },
  'maldives': {
    name: 'Maldives — Private Atolls & Turquoise Lagoon Silence',
    country: 'Maldives',
    region: 'Indian Ocean Atolls',
    heroImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1600&q=85',
    tagline: 'Overwater wooden villas, bioluminescent night lagoons, and secluded sandbank dinners.',
    bestSeason: 'November – April for glass-calm seas, blue skies, and optimal manta ray visibility',
    highlights: [
      'Private wooden dhoni catamaran cruise to an uninhabited desert sandbank for sunset',
      'Night snorkeling guided by a marine biologist over fluorescent coral gardens',
      'Overwater hammock lounging suspended over crystalline turquoise waters',
      'Floating champagne breakfast served in your private overwater plunge pool'
    ],
    places: [
      {
        name: 'Baa Atoll Biosphere Reserve',
        type: 'Marine Sanctuary',
        icon: '🦈',
        description: 'Hanifaru Bay gathering site where hundreds of gentle manta rays and harmless whale sharks congregate in sapphire waters.'
      },
      {
        name: 'Virgin Desert Sandbanks',
        type: 'Secluded Sandbar',
        icon: '🏝️',
        description: 'Blindingly white coral sandbars encircled by turquoise lagoons, accessible only by private wooden catamaran.'
      },
      {
        name: 'Vaadhoo Island "Sea of Stars"',
        type: 'Bioluminescent Shore',
        icon: '✨',
        description: 'Magical nighttime shoreline glowing with electric-blue bioluminescent phytoplankton as gentle waves break on the sand.'
      },
      {
        name: 'Protected Coral House Reefs',
        type: 'Underwater Gardens',
        icon: '🤿',
        description: 'Direct access from overwater villa ladders to kaleidoscopic coral formations teeming with sea turtles and reef fish.'
      },
      {
        name: 'North & South Malé Atolls',
        type: 'Lagoon Archipelago',
        icon: '🌊',
        description: 'Idyllic turquoise lagoons connected by glass-bottom boats, private seaplane channels, and sunset dolphin routes.'
      }
    ],
    gastronomy: [
      {
        name: 'Traditional Mas Huni & Roshi',
        type: 'Signature Island Breakfast',
        highlight: 'Fresh Yellowfin Tuna & Coconut',
        description: 'Fresh shredded yellowfin tuna gently mixed with fresh grated coconut, red onion, lime, and chili wrapped in warm flatbread.'
      },
      {
        name: 'Fragrant Garudhiya Broth',
        type: 'National Dish',
        highlight: 'Curry Leaves & Lime',
        description: 'Clear comforting tuna broth simmered with fresh curry leaves, lime, and chilies, served with jasmine rice and shallots.'
      },
      {
        name: 'Bis Keemiya & Kulhi Boakibaa',
        type: 'Traditional Hedhikaa Pastries',
        highlight: 'Smoked Fish & Spices',
        description: 'Crispy golden pastries stuffed with spiced tuna and cabbage, alongside savory smoked-tuna coconut fish cakes.'
      },
      {
        name: 'Private Sandbank Seafood Barbecue',
        type: 'Sunset Dining',
        highlight: 'Grilled Lobster & Champagne',
        description: 'Freshly caught grilled Maldivian lobster, king prawns, and yellowfin tuna served with chilled champagne on an isolated sandbank.'
      }
    ],
    staySuggestions: [
      {
        name: 'Soneva Jani / Soneva Fushi',
        type: 'Barefoot Luxury Atoll Estate',
        features: 'Retractable roofs for bedroom stargazing, private ocean slide, dedicated barefoot butler, and overwater cinema',
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'The Ritz-Carlton Maldives (Fari Islands)',
        type: 'Minimalist Overwater Sanctuary',
        features: 'Iconic circular overwater villas designed by Kerry Hill, private infinity pools, and ocean-perched spa pavilions',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80'
      }
    ],
    dailyThemes: [
      {
        theme: 'Lagoon Arrival & Overwater Sanctuary',
        morning: '11:00 — Scenic seaplane descent over jewel-like atolls. Barefoot welcome at the arrival jetty.',
        afternoon: '15:00 — Settle into your overwater villa; listen to gentle waves lap against the wooden stilts.',
        evening: '19:30 — Sandbank dinner under the equatorial stars with fresh grilled yellowfin tuna and chilled vintage champagne.',
        slowMoment: 'Floating peacefully on the still turquoise lagoon as baby reef sharks drift harmlessly by.'
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
    places: [
      {
        name: `${destName} Historic Quarter`,
        type: 'Architectural Landmark',
        icon: '🏛️',
        description: `Explore the celebrated historic monuments, heritage alleys, and cultural viewpoints of ${destName}.`
      },
      {
        name: `${destName} Scenic Sanctuary`,
        type: 'Natural Wonder',
        icon: '🌄',
        description: `Unspoiled nature reserves, serene waterfronts, and secret viewpoints off the beaten path in ${destName}.`
      }
    ],
    gastronomy: [
      {
        name: `${destName} Signature Tasting Experience`,
        type: 'Heritage Gastronomy',
        highlight: 'Artisanal Preparation',
        description: `Traditional dishes and local delicacies slow-crafted by master culinary artisans in ${destName}.`
      }
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

// Helper to look up or generate itinerary
function getItineraryForDestination({ destination, days = 7, pace = 'Relaxed & Slow', vibes = [], travelers = 'Couple', budgetTier = 'Ultra Luxury' }) {
  let matchedDest = null;
  const cleanDest = (destination || '').trim().toLowerCase();

  if (cleanDest.includes('kashmir') || cleanDest.includes('srinagar')) {
    matchedDest = DESTINATION_KNOWLEDGE['kashmir'];
  } else if (cleanDest.includes('rajasthan') || cleanDest.includes('jaipur') || cleanDest.includes('udaipur')) {
    matchedDest = DESTINATION_KNOWLEDGE['rajasthan'];
  } else if (cleanDest.includes('delhi')) {
    matchedDest = DESTINATION_KNOWLEDGE['delhi'];
  } else if (cleanDest.includes('mumbai') || cleanDest.includes('bombay')) {
    matchedDest = DESTINATION_KNOWLEDGE['mumbai'];
  } else if (cleanDest.includes('meghalaya') || cleanDest.includes('shillong')) {
    matchedDest = DESTINATION_KNOWLEDGE['meghalaya'];
  } else if (cleanDest.includes('maldives') || cleanDest.includes('male')) {
    matchedDest = DESTINATION_KNOWLEDGE['maldives'];
  }

  if (!matchedDest) {
    const extractedName = destination.trim() || 'Kashmir';
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

  // If requested more days than defined dailyThemes, repeat gracefully
  while (slicedSchedule.length < dayCount) {
    const baseTheme = matchedDest.dailyThemes[slicedSchedule.length % matchedDest.dailyThemes.length];
    slicedSchedule.push({
      ...baseTheme,
      theme: `Day ${slicedSchedule.length + 1} — ${baseTheme.theme}`
    });
  }

  const baseDailyRate = budgetTier.includes('Ultra') ? 45000 : (budgetTier.includes('Atelier') ? 75000 : 28000);
  const estimatedTotal = Math.round(baseDailyRate * dayCount);

  return {
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
    highlights: matchedDest.highlights || [],
    places: matchedDest.places || [],
    gastronomy: matchedDest.gastronomy || [],
    staySuggestions: matchedDest.staySuggestions || [],
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
}

// GET /api/ai-planner
router.get('/', (req, res) => {
  try {
    const destination = req.query.destination || 'Kashmir';
    const days = Number(req.query.days) || 7;
    const itinerary = getItineraryForDestination({ destination, days });
    return res.json({ success: true, itinerary });
  } catch (err) {
    console.error('AI Planner GET error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

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

    const targetDest = destination.trim() || (prompt ? prompt.split(' ')[0] : 'Kashmir');
    const itinerary = getItineraryForDestination({
      destination: targetDest,
      days,
      pace,
      vibes,
      travelers,
      budgetTier
    });

    return res.json({
      success: true,
      itinerary
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
