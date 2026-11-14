'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { INITIAL_DESTINATIONS } from '@/lib/data';
import { getStoredDestinations } from '@/lib/store';
import BookingModal from '@/components/BookingModal';
import HikeBookingCard from '@/components/HikeBookingCard';

export default function DestinationDetailPage() {
    const params = useParams();
    const slug = params?.slug;
    const [destinations, setDestinations] = useState(INITIAL_DESTINATIONS);

    useEffect(() => {
        setDestinations(getStoredDestinations());
    }, []);

    const destination = destinations.find((d) => 
      d.slug.toLowerCase() === slug?.toLowerCase() || 
      d.id === slug ||
      (slug?.toLowerCase() === 'switzerland' && d.slug === 'swiss-alps') ||
      d.title.toLowerCase() === slug?.toLowerCase()
    ) || destinations[0] || INITIAL_DESTINATIONS[0];
    const [activeImage, setActiveImage] = useState(destination.imageUrl);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [activeDay, setActiveDay] = useState(1);
    return (<div suppressHydrationWarning style={{ backgroundColor: '#faf9f6', minHeight: '100vh', paddingBottom: '90px' }}>
      {/* 1. Hero Image Header */}
      <section style={{
            position: 'relative',
            height: '640px',
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '0 40px 60px',
        }}>
        <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${activeImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'background-image 0.4s ease',
        }}/>
        <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(13,18,22,0.3) 0%, rgba(13,18,22,0.2) 40%, rgba(13,18,22,0.85) 100%)',
        }}/>

        {/* Content Container */}
        <div style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: '1100px',
            margin: '0 auto',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
        }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', opacity: 0.8 }}>
            <a href="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</a>
            <span>/</span>
            <a href="/destinations" style={{ color: '#fff', textDecoration: 'none' }}>Destinations</a>
            <span>/</span>
            <span>{destination.title}</span>
          </div>

          <div className="voyara-tag voyara-tag-dark">
            <div className="voyara-dot"/>
            <span>{destination.country} · {destination.region}</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(42px, 6vw, 76px)',
            fontWeight: 500,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            margin: 0,
            textShadow: '0 2px 20px rgba(0, 0, 0, 0.4)',
        }}>
            {destination.title}
          </h1>

          <p style={{ fontSize: '20px', maxWidth: '680px', margin: 0, opacity: 0.95, textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
            {destination.tagline}
          </p>
        </div>
      </section>

      {/* 2. Main Content Split */}
      <div style={{
            width: '100%',
            maxWidth: '1100px',
            margin: '40px auto 0',
            padding: '0 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'start',
        }}>
        {/* Left Column: Story, Highlights, Itinerary, Inclusions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {/* Key Facts Pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '18px 24px',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid rgba(13, 13, 13, 0.08)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingRight: '20px', borderRight: '1px solid rgba(13, 13, 13, 0.08)' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(13, 13, 13, 0.5)', fontWeight: 600 }}>
                Duration
              </span>
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#17191c' }}>
                {destination.durationDays} Days
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingRight: '20px', borderRight: '1px solid rgba(13, 13, 13, 0.08)' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(13, 13, 13, 0.5)', fontWeight: 600 }}>
                Best Season
              </span>
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#17191c' }}>
                {destination.season}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingRight: '20px', borderRight: '1px solid rgba(13, 13, 13, 0.08)' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(13, 13, 13, 0.5)', fontWeight: 600 }}>
                Group Size
              </span>
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#17191c' }}>
                {destination.groupSize}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(13, 13, 13, 0.5)', fontWeight: 600 }}>
                Guest Rating
              </span>
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#17191c', display: 'flex', alignItems: 'center', gap: '4px' }}>
                ★ {destination.rating} ({destination.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Narrative Overview */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 600, color: '#17191c', marginBottom: '14px' }}>
              The Travelyn Perspective
            </h2>
            <p style={{ fontSize: '17px', lineHeight: 1.7, color: 'rgba(30, 38, 42, 0.75)', margin: 0 }}>
              {destination.description}
            </p>
          </div>

          {/* Photo Gallery Grid */}
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#17191c', marginBottom: '16px' }}>
              Journey Gallery
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
              {destination.gallery.map((img, i) => (<div key={i} onClick={() => setActiveImage(img)} style={{
                height: '110px',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: activeImage === img ? '2px solid #17191c' : '2px solid transparent',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                transition: 'transform 0.2s, border 0.2s',
            }}>
                  <img src={img} alt={`Gallery ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                </div>))}
            </div>
          </div>

          {/* Signature Highlights */}
          <div>
            <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#17191c', marginBottom: '18px' }}>
              Signature Highlights
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              {destination.highlights.map((h, i) => (<div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px 20px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid rgba(13, 13, 13, 0.08)',
            }}>
                  <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '999px',
                backgroundColor: 'rgba(91, 130, 145, 0.15)',
                color: '#5b8291',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 700,
                flexShrink: 0,
            }}>
                    ✓
                  </div>
                  <span style={{ fontSize: '15.5px', fontWeight: 500, color: '#1e262a' }}>{h}</span>
                </div>))}
            </div>
          </div>

          {/* Day-by-Day Itinerary */}
          <div>
            <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#17191c', marginBottom: '18px' }}>
              Day-by-Day Itinerary
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {destination.itinerary.map((item) => {
            const isOpen = activeDay === item.day;
            return (<div key={item.day} style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '18px',
                    border: '1px solid rgba(13, 13, 13, 0.08)',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                }}>
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={() => setActiveDay(isOpen ? null : item.day)}
                      style={{
                        width: '100%',
                        padding: '18px 22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{
                    padding: '4px 10px',
                    borderRadius: '999px',
                    backgroundColor: '#f2efe9',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#17191c',
                }}>
                          Day {item.day}
                        </span>
                        <span style={{ fontSize: '16px', fontWeight: 600, color: '#1e262a' }}>
                          {item.title}
                        </span>
                      </div>
                      <span style={{ fontSize: '18px', color: '#5b8291', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                        ▾
                      </span>
                    </button>
                    {isOpen && (<div style={{ padding: '0 22px 20px 22px', fontSize: '15px', lineHeight: 1.6, color: 'rgba(30, 38, 42, 0.72)' }}>
                        {item.description}
                      </div>)}
                  </div>);
        })}
            </div>
          </div>

          {/* Inclusions */}
          <div style={{
            padding: '28px',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid rgba(13, 13, 13, 0.08)',
        }}>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#17191c', marginBottom: '16px' }}>
              What’s Included in This Journey
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {destination.included.map((inc, i) => (<div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '15px', color: '#1e262a' }}>
                  <span style={{ color: '#5b8291', fontWeight: 700 }}>•</span>
                  <span>{inc}</span>
                </div>))}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Hike & Expedition Booking Card (Nomia Style) */}
        <div style={{ position: 'sticky', top: '100px' }}>
          <HikeBookingCard
            destination={destination}
            onBookClick={() => setIsBookingOpen(true)}
          />
        </div>
      </div>

      <BookingModal destination={destination} isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)}/>
    </div>);
}
