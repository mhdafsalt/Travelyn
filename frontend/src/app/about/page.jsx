'use client';
import React from 'react';
export default function AboutPage() {
    return (<div style={{ backgroundColor: '#faf9f6', minHeight: '100vh', padding: '140px 24px 90px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '64px' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="voyara-tag">
            <div className="voyara-dot"/>
            <span>About Travelyn Studio</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(38px, 6vw, 76px)',
            fontWeight: 500,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            color: '#1e262a',
            margin: 0,
        }}>
            Crafting journeys
            <br />
            <span style={{ color: 'rgba(30, 38, 42, 0.45)' }}>you can feel</span>
          </h1>
          <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5b8291' }}>
            Est. 2014 — Lisbon & New York
          </div>
        </div>

        {/* Hero Narrative Image */}
        <div style={{ height: '480px', borderRadius: '32px', overflow: 'hidden', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.08)' }}>
          <img src="https://framerusercontent.com/images/PMSlK6mTGdx9DcWYaJZiAMBFv4.jpg" alt="Travelyn travel philosophy" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        </div>

        {/* Studio Manifesto */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '820px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 500, color: '#17191c' }}>
            We started with a simple belief: travel should leave you grounded, not exhausted.
          </h2>
          <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'rgba(30, 38, 42, 0.75)' }}>
            Founded in Lisbon in 2014, Travelyn began as a small collective of architects, writers, and cultural historians who longed for travel that prioritized atmosphere over bucket lists. Instead of rushing between landmarks, we wanted mornings where you linger on a wooden balcony above the clouds, afternoons spent learning the rhythm of an ancient tea ritual, and evenings by the fire sharing fondue with local vintners.
          </p>
          <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'rgba(30, 38, 42, 0.75)' }}>
            Today, our travel designers work intimately with just a handful of travellers each month. We maintain deep personal friendships with private boat captains, family vineyard owners, and mountain guides across Europe, Asia, South America, and Africa.
          </p>
        </div>

        {/* 3 Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
          {[
            {
                number: '01',
                title: 'Slowness as Luxury',
                text: 'We curate fewer destinations per trip, giving you the rare luxury of settling in, waking without alarms, and noticing the subtle beauty of a place.',
            },
            {
                number: '02',
                title: 'Personal Relationships',
                text: 'We do not book from catalogs. Every villa, chalet, chef, and guide in our black book is a trusted partner we have visited and loved ourselves.',
            },
            {
                number: '03',
                title: 'Total Peace of Mind',
                text: 'From private airport customs escorts to 24/7 concierge assistance on WhatsApp, your journey flows seamlessly without logistical friction.',
            },
        ].map((pillar, i) => (<div key={i} style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                padding: '36px 30px',
                border: '1px solid rgba(13, 13, 13, 0.08)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
            }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#5b8291', letterSpacing: '0.08em' }}>
                {pillar.number}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#17191c', margin: 0 }}>
                {pillar.title}
              </h3>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'rgba(30, 38, 42, 0.65)', margin: 0 }}>
                {pillar.text}
              </p>
            </div>))}
        </div>

        {/* CTA Banner */}
        <div style={{
            backgroundColor: '#17191c',
            borderRadius: '32px',
            padding: '60px 40px',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '24px',
        }}>
          <div className="voyara-tag voyara-tag-dark">
            <div className="voyara-dot"/>
            <span>Begin the Dialogue</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 500, margin: 0 }}>
            Ready to design your bespoke journey?
          </h2>
          <p style={{ fontSize: '17px', color: 'rgba(255, 255, 255, 0.75)', maxWidth: '520px', margin: 0 }}>
            Tell our Lisbon studio where your heart wants to wake up. We will handle every detail.
          </p>
          <a href="/contact" className="voyara-btn voyara-btn-light">
            <span>Speak with a Travel Designer</span>
            <span className="voyara-arrow-circle">→</span>
          </a>
        </div>
      </div>
    </div>);
}
