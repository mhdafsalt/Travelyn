'use client';

import React from 'react';

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: '#0c0d10',
          color: '#ffffff',
          fontFamily: 'Inter, system-ui, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <div style={{ textAlign: 'center', padding: '32px', maxWidth: '520px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '12px' }}>
            Something went wrong
          </h2>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '15px',
              lineHeight: 1.5,
              marginBottom: '24px',
            }}
          >
            {error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => reset()}
            style={{
              padding: '12px 28px',
              backgroundColor: '#ffffff',
              color: '#0c0d10',
              border: 'none',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}

