'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BookingModal from '@/components/BookingModal';
import { 
  getStoredSavedItineraries, 
  saveStoredItinerary, 
  deleteStoredItinerary,
  getStoredHeroSettings,
  DEFAULT_HERO_SETTINGS,
  getStoredDestinations
} from '@/lib/store';
import { apiFetch } from '@/lib/api';
import './ai-planner.css';

const PRESET_PROMPTS = [
  {
    label: '7 Days Kashmir Valley',
    destination: 'Kashmir',
    days: 7,
    pace: 'Relaxed & Slow',
    vibes: ['Alpine Chalets', 'Quiet Nature', 'Wellness & Thermal'],
    prompt: 'Private cedar houseboat on Nigeen Lake, dawn floating market glide on silent shikaras, artisanal saffron harvesting, and snow-draped pine meadows of Gulmarg.'
  },
  {
    label: '6 Days Royal Rajasthan',
    destination: 'Rajasthan',
    days: 6,
    pace: 'Balanced Exploration',
    vibes: ['Historic Culture', 'Fine Dining & Wine'],
    prompt: 'Floating marble palace on Lake Pichola in Udaipur, private sunset terrace champagne, miniature art masters in Old Haveli courtyards, and silent golden Thar desert dunes.'
  },
  {
    label: '5 Days Meghalaya Sanctuaries',
    destination: 'Meghalaya',
    days: 5,
    pace: 'Relaxed & Slow',
    vibes: ['Quiet Nature', 'Scenic Rails'],
    prompt: 'Descending through misty Khasi cloud forests to sacred living root bridges, floating on glass-clear waters of Umngot river, and quiet pine cottage stays overlooking Umiam Lake.'
  },
  {
    label: '5 Days Maldives Overwater Haven',
    destination: 'Maldives',
    days: 5,
    pace: 'Relaxed & Slow',
    vibes: ['Coastal Romance', 'Private Yachting', 'Wellness & Thermal'],
    prompt: 'Overwater wooden villa suspended above turquoise lagoons, private sandbank sunset champagne dinners, and night snorkeling with marine biologists over glowing reefs.'
  },
  {
    label: '4 Days Mumbai Heritage Coast',
    destination: 'Mumbai',
    days: 4,
    pace: 'Balanced Exploration',
    vibes: ['Coastal Romance', 'Historic Culture', 'Fine Dining & Wine'],
    prompt: 'Sunrise private yacht sail past historic lighthouses, Art Deco promenades along Marine Drive, and private tastings at legendary coastal seafood institutions.'
  },
  {
    label: '5 Days Delhi Mughal Splendour',
    destination: 'Delhi',
    days: 5,
    pace: 'Balanced Exploration',
    vibes: ['Historic Culture', 'Fine Dining & Wine'],
    prompt: 'Sunrise walks through Lodhi Gardens, private architectural historian tours of Humayun’s Tomb and Agrasen Ki Baoli stepwell, and intimate Sufi acoustic evenings.'
  }
];

const POPULAR_DESTINATIONS = [
  'Kashmir',
  'Rajasthan',
  'Meghalaya',
  'Maldives',
  'Mumbai',
  'Delhi',
  'Swiss Alps',
  'Kyoto',
  'Santorini'
];

const AVAILABLE_VIBES = [
  'Alpine Chalets',
  'Quiet Nature',
  'Fine Dining & Wine',
  'Historic Culture',
  'Coastal Romance',
  'Wellness & Thermal',
  'Scenic Rails',
  'Private Yachting'
];

export default function AIPlannerPage() {
  const router = useRouter();
  // Input form state
  const [prompt, setPrompt] = useState('');
  const [destination, setDestination] = useState('Kashmir');
  const [days, setDays] = useState(7);
  const [pace, setPace] = useState('Relaxed & Slow');
  const [selectedVibes, setSelectedVibes] = useState(['Alpine Chalets', 'Quiet Nature']);
  const [travelers, setTravelers] = useState('Couple / Romance');
  const [budgetTier, setBudgetTier] = useState('Ultra Luxury');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [loaderStep, setLoaderStep] = useState(0);
  const [itinerary, setItinerary] = useState(null);
  const [savedItineraries, setSavedItineraries] = useState([]);
  const [saveToast, setSaveToast] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [backdropUrl, setBackdropUrl] = useState(DEFAULT_HERO_SETTINGS.backdropImageUrl);
  const [availableDestinations, setAvailableDestinations] = useState([]);
  const [isCustomDest, setIsCustomDest] = useState(false);
  const [customDestText, setCustomDestText] = useState('');
  const resultRef = useRef(null);

  // Mount guard & load saved itineraries + hero settings + dynamic destinations
  useEffect(() => {
    setIsMounted(true);
    setSavedItineraries(getStoredSavedItineraries());

    try {
      const heroConfig = getStoredHeroSettings();
      if (heroConfig?.backdropImageUrl) {
        setBackdropUrl(heroConfig.backdropImageUrl);
      }
    } catch {}

    const loadDestinations = () => {
      try {
        const stored = getStoredDestinations();
        if (stored && Array.isArray(stored) && stored.length > 0) {
          setAvailableDestinations(stored);
        }
      } catch (err) {
        console.error('Failed to load destinations:', err);
      }
    };

    loadDestinations();

    const handleUpdate = (e) => {
      setSavedItineraries(e.detail || []);
    };
    const handleHeroUpdate = (e) => {
      if (e.detail?.backdropImageUrl) {
        setBackdropUrl(e.detail.backdropImageUrl);
      }
    };
    const handleDestsUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setAvailableDestinations(e.detail);
      } else {
        loadDestinations();
      }
    };

    window.addEventListener('travelyn_itineraries_updated', handleUpdate);
    window.addEventListener('travelyn_hero_updated', handleHeroUpdate);
    window.addEventListener('travelyn_destinations_updated', handleDestsUpdate);
    window.addEventListener('storage', loadDestinations);
    return () => {
      window.removeEventListener('travelyn_itineraries_updated', handleUpdate);
      window.removeEventListener('travelyn_hero_updated', handleHeroUpdate);
      window.removeEventListener('travelyn_destinations_updated', handleDestsUpdate);
      window.removeEventListener('storage', loadDestinations);
    };
  }, []);

  const handleDestinationSelectChange = (val) => {
    if (val === '__custom__') {
      setIsCustomDest(true);
      setDestination(customDestText || '');
      return;
    }

    setIsCustomDest(false);
    setDestination(val);

    // Dynamic smart matching for vibes/days based on destination
    const lower = val.toLowerCase();
    if (lower.includes('kashmir') || lower.includes('srinagar')) {
      setDays(7);
      setPace('Relaxed & Slow');
      setSelectedVibes(['Alpine Chalets', 'Quiet Nature', 'Wellness & Thermal']);
    } else if (lower.includes('rajasthan') || lower.includes('jaipur') || lower.includes('udaipur')) {
      setDays(6);
      setPace('Balanced Exploration');
      setSelectedVibes(['Historic Culture', 'Fine Dining & Wine']);
    } else if (lower.includes('meghalaya') || lower.includes('shillong')) {
      setDays(5);
      setPace('Relaxed & Slow');
      setSelectedVibes(['Quiet Nature', 'Scenic Rails']);
    } else if (lower.includes('maldives')) {
      setDays(5);
      setPace('Relaxed & Slow');
      setSelectedVibes(['Coastal Romance', 'Private Yachting', 'Wellness & Thermal']);
    } else if (lower.includes('mumbai') || lower.includes('bombay')) {
      setDays(4);
      setPace('Balanced Exploration');
      setSelectedVibes(['Coastal Romance', 'Historic Culture', 'Fine Dining & Wine']);
    } else if (lower.includes('delhi')) {
      setDays(5);
      setPace('Balanced Exploration');
      setSelectedVibes(['Historic Culture', 'Fine Dining & Wine']);
    } else if (lower.includes('swiss') || lower.includes('alps') || lower.includes('switzerland')) {
      setDays(7);
      setPace('Relaxed & Slow');
      setSelectedVibes(['Alpine Chalets', 'Quiet Nature', 'Fine Dining & Wine']);
    } else if (lower.includes('kyoto') || lower.includes('japan')) {
      setDays(5);
      setPace('Slow & Contemplative');
      setSelectedVibes(['Historic Culture', 'Quiet Nature', 'Wellness & Thermal']);
    } else if (lower.includes('santorini') || lower.includes('greece')) {
      setDays(6);
      setPace('Coastal Romance'); 
      setSelectedVibes(['Coastal Romance', 'Fine Dining & Wine']);
    }
  };

  const handleApplyPreset = (preset) => {
    setIsCustomDest(false);
    setDestination(preset.destination);
    setDays(preset.days);
    setPace(preset.pace);
    setSelectedVibes(preset.vibes);
    setPrompt(preset.prompt);
  };

  const toggleVibe = (vibe) => {
    if (selectedVibes.includes(vibe)) {
      setSelectedVibes(selectedVibes.filter((v) => v !== vibe));
    } else {
      setSelectedVibes([...selectedVibes, vibe]);
    }
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setIsGenerating(true);
    setLoaderStep(0);

    const stepInterval = setInterval(() => {
      setLoaderStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 600);

    try {
      const response = await apiFetch('/ai-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          destination,
          days,
          pace,
          vibes: selectedVibes,
          travelers,
          budgetTier
        })
      });

      const data = response ? await response.json() : null;
      clearInterval(stepInterval);
      setLoaderStep(4);

      setTimeout(() => {
        setIsGenerating(false);
        if (data && data.success && data.itinerary) {
          setItinerary(data.itinerary);
          setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }, 500);
    } catch (err) {
      clearInterval(stepInterval);
      setIsGenerating(false);
      console.error('Failed to generate journey:', err);
    }
  };

  const handleSaveItinerary = () => {
    if (!itinerary) return;
    saveStoredItinerary(itinerary);
    setSaveToast('Bespoke itinerary saved to your Atelier collection!');
    setTimeout(() => setSaveToast(''), 3000);
  };

  const handleSelectSaved = (saved) => {
    setItinerary(saved);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <div className="ai-planner-page" suppressHydrationWarning>
      {/* 1. Hero Header matching Nomia / HeroSection layers */}
      <section className="ai-planner-hero" suppressHydrationWarning>
        {/* Full-Bleed Atmospheric Background Image */}
        <div
          className="ai-planner-hero-backdrop"
          style={backdropUrl ? { backgroundImage: `url(${backdropUrl})` } : {}}
        />

        {/* Ambient lighting overlays */}
        <div className="ai-planner-hero-overlay-radial" />
        <div className="ai-planner-hero-overlay-top" />
        <div className="ai-planner-hero-overlay-bottom" />

        {/* Ambient Framing Wireframe Box */}
        <div className="ai-planner-hero-wireframe-box" />

        <div className="ai-planner-hero-inner" suppressHydrationWarning>
          <div className="ai-planner-hero-tag">
            <span className="ai-planner-sparkle">✦</span>
            <span>AI Atelier Concierge · Bespoke Planner</span>
          </div>

          <h1 className="ai-planner-headline">
            Say where your heart wants to go.{' '}
            <span className="ai-planner-headline-italic">The AI crafts the journey.</span>
          </h1>

          <p className="ai-planner-subhead">
            Slow, tailor-made itineraries shaped around rhythm, seasonal daylight, private chalets, and authentic local culture in seconds.
          </p>

          {/* Quick Presets */}
          <div className="ai-planner-presets-wrap" suppressHydrationWarning>
            <span className="ai-planner-presets-label">Curated Inspirations</span>
            <div className="ai-planner-presets-list" suppressHydrationWarning>
              {PRESET_PROMPTS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  suppressHydrationWarning
                  onClick={() => handleApplyPreset(preset)}
                  className="ai-preset-chip"
                >
                  <span>✦</span>
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Generator Console */}
      <section className="ai-planner-console-container" suppressHydrationWarning>
        <form onSubmit={handleGenerate} className="ai-planner-card" suppressHydrationWarning>
          {/* Natural Language Prompt */}
          <div className="ai-prompt-box-wrap">
            <div className="ai-prompt-label">
              <span>Tell Us Your Dream Journey (Optional Free-Form Details)</span>
              <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'none' }}>
                AI understands specific vibes, desires &amp; rhythms
              </span>
            </div>
            <div className="ai-prompt-textarea-wrapper">
              <textarea
                suppressHydrationWarning
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. We want a 7-day slow romantic journey through Switzerland in winter with fireside fondue, first-class panoramic trains, and quiet timber chalets overlooking snowy peaks..."
                className="ai-prompt-textarea"
                rows={3}
              />
            </div>
          </div>

          {/* Curated Controls Grid */}
          <div className="ai-controls-grid" suppressHydrationWarning>
            {/* Destination Selection Dropdown */}
            <div className="ai-control-unit">
              <div className="ai-control-title-row">
                <label className="ai-control-title">Destination or Region</label>
                {availableDestinations.length > 0 && (
                  <span className="ai-dest-live-tag">
                    <span className="ai-dest-live-dot" />
                    {availableDestinations.length} Curated Live
                  </span>
                )}
              </div>

              <select
                suppressHydrationWarning
                value={isCustomDest ? '__custom__' : destination}
                onChange={(e) => handleDestinationSelectChange(e.target.value)}
                className="ai-control-select"
                required
              >
                <option value="" disabled>Select a Destination or Region...</option>

                {availableDestinations.length > 0 && (
                  <optgroup label="✨ Curated Atelier Destinations">
                    {availableDestinations.map((d) => (
                      <option key={d.id || d.slug} value={d.title || d.name}>
                        {d.title || d.name} ({d.country || d.region || 'Curated'})
                      </option>
                    ))}
                  </optgroup>
                )}

                <optgroup label="🏔️ Europe & Mediterranean">
                  <option value="Swiss Alps">Swiss Alps (Switzerland)</option>
                  <option value="Santorini">Santorini & Cyclades (Greece)</option>
                  <option value="Amalfi Coast">Amalfi Coast & Capri (Italy)</option>
                  <option value="Lake Como">Lake Como & Bellagio (Italy)</option>
                  <option value="Tuscany">Tuscany & Val d'Orcia (Italy)</option>
                  <option value="Provence">Provence & Côte d'Azur (France)</option>
                  <option value="Lapland & Northern Lights">Lapland & Northern Lights (Finland)</option>
                  <option value="Iceland Ring Road">Iceland Ring Road & Glaciers (Iceland)</option>
                  <option value="Norwegian Fjords">Norwegian Fjords (Norway)</option>
                  <option value="Scottish Highlands">Scottish Highlands & Skye (Scotland)</option>
                  <option value="Dolomites">Dolomites & South Tyrol (Italy)</option>
                </optgroup>

                <optgroup label="🌸 Asia & Indian Ocean">
                  <option value="Kyoto">Kyoto Ancient Gardens (Japan)</option>
                  <option value="Tokyo & Mount Fuji">Tokyo & Mount Fuji (Japan)</option>
                  <option value="Bali">Bali Sacred Valleys & Uluwatu (Indonesia)</option>
                  <option value="Maldives">Maldives Private Atolls (Maldives)</option>
                  <option value="Bhutan">Bhutan Kingdom & Himalayas (Bhutan)</option>
                  <option value="Sri Lanka">Sri Lanka Hill Country & Galle (Sri Lanka)</option>
                  <option value="Vietnam">Vietnam Halong Bay & Hoi An (Vietnam)</option>
                </optgroup>

                <optgroup label="🌊 Americas, Africa & Oceania">
                  <option value="Patagonia">Patagonia Fjords & Peaks (Chile & Argentina)</option>
                  <option value="Marrakech">Marrakech & Atlas Mountains (Morocco)</option>
                  <option value="Banff & Canadian Rockies">Banff & Canadian Rockies (Canada)</option>
                  <option value="New Zealand South Island">New Zealand South Island (New Zealand)</option>
                  <option value="Bora Bora & Tahiti">Bora Bora & French Polynesia</option>
                  <option value="Cape Town & Winelands">Cape Town & Winelands (South Africa)</option>
                  <option value="Costa Rica Rainforest">Costa Rica Cloud Forest & Coast</option>
                </optgroup>

                <optgroup label="✦ Custom Region">
                  <option value="__custom__">✦ Other / Custom Destination (Type Below)...</option>
                </optgroup>
              </select>

              {/* Custom Destination input when user selects 'Other / Custom Destination' */}
              {isCustomDest && (
                <div style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    suppressHydrationWarning
                    value={customDestText}
                    onChange={(e) => {
                      setCustomDestText(e.target.value);
                      setDestination(e.target.value);
                    }}
                    placeholder="Type any city, island, or region (e.g. Vienna, Azores, Queenstown)..."
                    className="ai-control-input"
                    autoFocus
                    required
                  />
                </div>
              )}
            </div>

            {/* Duration Pills */}
            <div className="ai-control-unit" suppressHydrationWarning>
              <label className="ai-control-title">Trip Duration: {days} Days</label>
              <div className="ai-pills-row" suppressHydrationWarning>
                {[3, 5, 7, 10, 14].map((d) => (
                  <button
                    key={d}
                    type="button"
                    suppressHydrationWarning
                    onClick={() => setDays(d)}
                    className={`ai-select-pill ${days === d ? 'is-selected' : ''}`}
                  >
                    {d} Days
                  </button>
                ))}
              </div>
            </div>

            {/* Pace / Rhythm */}
            <div className="ai-control-unit">
              <label className="ai-control-title">Travel Rhythm / Pace</label>
              <select
                suppressHydrationWarning
                value={pace}
                onChange={(e) => setPace(e.target.value)}
                className="ai-control-select"
              >
                <option value="Relaxed & Slow">Relaxed &amp; Slow (1–2 places, lingering mornings)</option>
                <option value="Balanced Exploration">Balanced Exploration (Curated visits with free time)</option>
                <option value="Immersive Expedition">Immersive Expedition (Active trails &amp; excursions)</option>
              </select>
            </div>

            {/* Traveling Party */}
            <div className="ai-control-unit">
              <label className="ai-control-title">Traveling Party</label>
              <select
                suppressHydrationWarning
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                className="ai-control-select"
              >
                <option value="Couple / Romance">Couple / Romance</option>
                <option value="Solo Explorer">Solo Explorer</option>
                <option value="Family & Children">Family &amp; Children</option>
                <option value="Friends Group">Friends Group</option>
              </select>
            </div>
          </div>

          {/* Vibe Tags Cloud */}
          <div className="ai-control-unit" suppressHydrationWarning>
            <label className="ai-control-title">Curated Atmosphere &amp; Vibe Desires</label>
            <div className="ai-vibes-cloud" suppressHydrationWarning>
              {AVAILABLE_VIBES.map((v) => {
                const isChecked = selectedVibes.includes(v);
                return (
                  <button
                    key={v}
                    type="button"
                    suppressHydrationWarning
                    onClick={() => toggleVibe(v)}
                    className={`ai-vibe-tag ${isChecked ? 'is-checked' : ''}`}
                  >
                    <span>{isChecked ? '✓' : '+'}</span>
                    <span>{v}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row */}
          <div className="ai-generate-btn-row">
            <div className="ai-generate-status-hint">
              <span>✦</span>
              <span>Generates real-time custom schedule, stays, packing tips &amp; price estimate</span>
            </div>

            <button
              type="submit"
              suppressHydrationWarning
              disabled={isGenerating}
              className="ai-generate-submit-btn"
            >
              <span>{isGenerating ? 'Composing Your Journey...' : 'Generate Bespoke Itinerary'}</span>
              <span>→</span>
            </button>
          </div>
        </form>
      </section>

      {/* 3. Concierge Thinking Loader */}
      {isGenerating && (
        <div className="ai-planner-console-container">
          <div className="ai-planner-loader-card">
            <div className="ai-loader-spinner-orbit" />
            <div className="ai-loader-title">Crafting Your Tailor-Made Itinerary</div>
            <div className="ai-loader-steps">
              <div className="ai-loader-step-item">
                <span>{loaderStep >= 0 ? '✓' : '○'}</span>
                <span>Consulting seasonal daylight and mountain microclimates...</span>
              </div>
              <div className="ai-loader-step-item">
                <span>{loaderStep >= 1 ? '✓' : '○'}</span>
                <span>Curating boutique heritage chalets and private hosts...</span>
              </div>
              <div className="ai-loader-step-item">
                <span>{loaderStep >= 2 ? '✓' : '○'}</span>
                <span>Pacing daily rhythm to bypass crowded tourist windows...</span>
              </div>
              <div className="ai-loader-step-item">
                <span>{loaderStep >= 3 ? '✓' : '○'}</span>
                <span>Composing your slow-travel day-by-day dispatch...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Generated Itinerary Result */}
      {itinerary && !isGenerating && (
        <section ref={resultRef} className="ai-itinerary-result-wrap">
          {/* Top Hero Banner */}
          <div className="ai-result-hero-card">
            <img
              src={itinerary.heroImage}
              alt={itinerary.destinationTitle}
              className="ai-result-hero-img"
            />
            <div className="ai-result-hero-overlay" />

            <div className="ai-result-hero-content">
              <div className="ai-result-badges-row">
                <span className="voyara-tag voyara-tag-dark" style={{ width: 'fit-content' }}>
                  <span className="voyara-dot" />
                  <span>{itinerary.country} · {itinerary.region}</span>
                </span>
                <span className="voyara-tag voyara-tag-dark" style={{ width: 'fit-content' }}>
                  <span>{itinerary.durationDays} Days</span>
                </span>
                <span className="voyara-tag voyara-tag-dark" style={{ width: 'fit-content' }}>
                  <span>{itinerary.pace}</span>
                </span>
              </div>

              <h2 className="ai-result-title">{itinerary.destinationTitle}</h2>
              <p className="ai-result-tagline">{itinerary.tagline}</p>

              <div className="ai-result-meta-bar">
                <div className="ai-result-meta-item">
                  <span className="ai-result-meta-label">Optimal Season</span>
                  <span className="ai-result-meta-val">{itinerary.bestSeason}</span>
                </div>
                <div className="ai-result-meta-item">
                  <span className="ai-result-meta-label">Party Setup</span>
                  <span className="ai-result-meta-val">{itinerary.travelers}</span>
                </div>
                <div className="ai-result-meta-item">
                  <span className="ai-result-meta-label">Estimated Value (Per Person)</span>
                  <span className="ai-result-meta-val">₹{itinerary.estimatedPriceINR.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Highlights */}
          <div>
            <h3 className="ai-section-title" style={{ marginBottom: '16px' }}>
              Bespoke Journey Highlights
            </h3>
            <div className="ai-highlights-grid">
              {itinerary.highlights?.map((hl, i) => (
                <div key={i} className="ai-highlight-card">
                  <div className="ai-highlight-icon-box">✦</div>
                  <div className="ai-highlight-text">{hl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Day-by-Day Schedule */}
          <div className="ai-schedule-section">
            <div className="ai-section-title-row">
              <h3 className="ai-section-title">Day-by-Day Slow Itinerary</h3>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                {itinerary.schedule?.length} Detailed Days Curated
              </span>
            </div>

            <div className="ai-schedule-cards-list">
              {itinerary.schedule?.map((day) => (
                <div key={day.dayNumber} className="ai-day-card">
                  <div className="ai-day-header">
                    <span className="ai-day-badge">Day {day.dayNumber}</span>
                    <span className="ai-day-theme-title">{day.theme}</span>
                  </div>

                  <div className="ai-day-body">
                    {/* Morning */}
                    <div className="ai-segment-unit">
                      <span className="ai-segment-tag">Morning</span>
                      <p className="ai-segment-desc">{day.morning}</p>
                    </div>

                    {/* Afternoon */}
                    <div className="ai-segment-unit">
                      <span className="ai-segment-tag">Afternoon</span>
                      <p className="ai-segment-desc">{day.afternoon}</p>
                    </div>

                    {/* Evening */}
                    <div className="ai-segment-unit">
                      <span className="ai-segment-tag">Evening</span>
                      <p className="ai-segment-desc">{day.evening}</p>
                    </div>

                    {/* Slow Moment */}
                    {day.slowMoment && (
                      <div className="ai-slow-moment-box">
                        <span className="ai-slow-moment-icon">✧</span>
                        <p className="ai-slow-moment-text">
                          <strong>Slow Moment:</strong> {day.slowMoment}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stays & Accommodations */}
          <div>
            <h3 className="ai-section-title" style={{ marginBottom: '16px' }}>
              Where You&rsquo;ll Stay
            </h3>
            <div className="ai-stays-grid">
              {itinerary.staySuggestions?.map((stay, idx) => (
                <div key={idx} className="ai-stay-card">
                  <img src={stay.image} alt={stay.name} className="ai-stay-img" />
                  <div className="ai-stay-content">
                    <span className="ai-stay-type">{stay.type}</span>
                    <h4 className="ai-stay-name">{stay.name}</h4>
                    <p className="ai-stay-features">{stay.features}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Luggage & Advice */}
          <div className="ai-advice-card">
            <span className="ai-advice-label">
              Concierge Packing &amp; Climate Dispatch
            </span>
            <p className="ai-advice-desc">
              {itinerary.luggageAdvice}
            </p>
          </div>

          {/* Sticky Actions Bar */}
          <div className="ai-action-bar-card">
            <div className="ai-action-bar-left">
              <span className="ai-action-bar-price">
                ₹{itinerary.estimatedPriceINR.toLocaleString('en-IN')}{' '}
                <span className="ai-action-bar-price-sub">/ traveller</span>
              </span>
              <span className="ai-action-bar-sub">Includes private transfers, curated docents &amp; luxury suites</span>
            </div>

            <div className="ai-action-bar-btns" suppressHydrationWarning>
              <button
                type="button"
                suppressHydrationWarning
                onClick={handleSaveItinerary}
                className="ai-action-btn-save"
              >
                <span>💾</span>
                <span>Save Itinerary</span>
              </button>

              <button
                type="button"
                suppressHydrationWarning
                onClick={() => window.print()}
                className="ai-action-btn-print"
              >
                <span>⎙</span>
                <span>Print Dispatch</span>
              </button>

              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setIsBookingOpen(true)}
                className="ai-action-btn-book"
              >
                <span>Book This Journey</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {saveToast && (
            <div className="ai-saved-toast">
              {saveToast}
            </div>
          )}
        </section>
      )}

      {/* 5. Saved Itineraries Gallery (Client Only) */}
      {isMounted && savedItineraries.length > 0 && (
        <section className="ai-saved-itineraries-wrap" suppressHydrationWarning>
          <div className="ai-saved-header-row">
            <h3 className="ai-section-title">Your Saved Atelier Itineraries ({savedItineraries.length})</h3>
          </div>
          <div className="ai-saved-grid" suppressHydrationWarning>
            {savedItineraries.map((saved) => (
              <div
                key={saved.id}
                className="ai-saved-card"
                onClick={() => handleSelectSaved(saved)}
              >
                <div className="ai-saved-card-top">
                  <span className="ai-saved-badge">
                    {saved.durationDays} Days · {saved.country}
                  </span>
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteStoredItinerary(saved.id);
                    }}
                    className="ai-saved-delete-btn"
                    title="Remove saved itinerary"
                  >
                    ✕
                  </button>
                </div>
                <h4 className="ai-saved-card-title">
                  {saved.destinationTitle}
                </h4>
                <span className="ai-saved-card-price">
                  ₹{saved.estimatedPriceINR?.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Booking Modal Integration */}
      {itinerary && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          destination={{
            id: itinerary.id,
            title: itinerary.destinationTitle,
            price: Math.round(itinerary.estimatedPriceINR / (itinerary.travelers.includes('Couple') ? 2 : 1))
          }}
        />
      )}
    </div>
  );
}
