'use client';
import React from 'react';
export default function ExperiencesPage() {
    const experiences = [
        {
            title: 'Island Sanctuaries & Caldera Vistas',
            theme: 'Islands',
            description: 'Private catamarans across volcanic calderas, overwater villas suspended above turquoise lagoons, and secret sea caves accessible only by wooden Riva launches.',
            imageUrl: 'https://framerusercontent.com/images/mYmxqjoJu3hOllz5QuhpEbhRR4U.jpg',
            destinations: ['Santorini, Greece', 'Maldives, Indian Ocean'],
            tag: 'Islands & Marine',
        },
        {
            title: 'Alpine Chalets & Mountain Solitude',
            theme: 'Nature',
            description: 'Car-free villages waking to pristine snow, vintage Glacier Express glass-domed railcars, and candlelit raclette firesides beneath the Matterhorn.',
            imageUrl: 'https://framerusercontent.com/images/HbTOVJISnVAQs0gVsETpyusySQ.jpg',
            destinations: ['Swiss Alps, Switzerland', 'Patagonia, Chile'],
            tag: 'High Altitude',
        },
        {
            title: 'Cultural Sanctuaries & Ancient Living Crafts',
            theme: 'Culture',
            description: 'Centuries-old wooden Zen shrines, private matcha ceremonies with 15th-generation tea masters, and private sunrise strolls through Majorelle Gardens.',
            imageUrl: 'https://framerusercontent.com/images/1i1SYez5flXAysor3K8yCCzcuo0.jpg',
            destinations: ['Kyoto, Japan', 'Marrakech, Morocco'],
            tag: 'Living Heritage',
        },
        {
            title: 'Wild Horizons & Glacial Frontiers',
            theme: 'Adventure',
            description: 'Ice trekking with crampons on ancient blue glaciers, horseback riding with gauchos across golden steppes, and midnight stargazing under untarnished southern skies.',
            imageUrl: 'https://framerusercontent.com/images/7EoyIkj4WCYIrr9nOccQVnJMI.jpg',
            destinations: ['Patagonia, Chile', 'Swiss Alps, Switzerland'],
            tag: 'Expedition',
        },
    ];
    return (<div style={{ backgroundColor: '#faf9f6', minHeight: '100vh', padding: '140px 24px 90px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '56px' }}>
        {/* Header */}
        <div>
          <div className="voyara-tag" style={{ marginBottom: '16px' }}>
            <div className="voyara-dot"/>
            <span>Curated Collections</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 5.5vw, 68px)',
            fontWeight: 500,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            color: '#1e262a',
            margin: '0 0 16px 0',
        }}>
            Curated Experiences
          </h1>
          <p style={{ fontSize: '19px', color: 'rgba(30, 38, 42, 0.7)', maxWidth: '640px', lineHeight: 1.6, margin: 0 }}>
            Every Travelyn journey is designed around feelings, not checklists. Explore our curated collections tailored for slow contemplation, culinary discovery, and sublime nature.
          </p>
        </div>

        {/* Experience Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {experiences.map((exp, i) => (<div key={i} style={{
                backgroundColor: '#ffffff',
                borderRadius: '32px',
                border: '1px solid rgba(13, 13, 13, 0.08)',
                overflow: 'hidden',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.04)',
            }}>
              {/* Image Frame */}
              <div style={{ height: '380px', position: 'relative', overflow: 'hidden' }}>
                <img src={exp.imageUrl} alt={exp.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(10px)',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#17191c',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
            }}>
                  {exp.tag}
                </div>
              </div>

              {/* Text Info */}
              <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
                <div>
                  <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 3.2vw, 36px)',
                fontWeight: 600,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                color: '#17191c',
                margin: '0 0 14px 0',
            }}>
                    {exp.title}
                  </h2>
                  <p style={{ fontSize: '16px', lineHeight: 1.65, color: 'rgba(30, 38, 42, 0.72)', margin: '0 0 24px 0' }}>
                    {exp.description}
                  </p>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5b8291' }}>
                      Featured Destinations:
                    </span>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                      {exp.destinations.map((d, di) => (<span key={di} style={{
                    padding: '6px 12px',
                    backgroundColor: '#f2efe9',
                    borderRadius: '999px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#1e262a',
                }}>
                          {d}
                        </span>))}
                    </div>
                  </div>
                </div>

                <div>
                  <a href="/destinations" className="voyara-btn voyara-btn-dark">
                    <span>Explore Collection</span>
                    <span className="voyara-arrow-circle">→</span>
                  </a>
                </div>
              </div>
            </div>))}
        </div>
      </div>
    </div>);
}
