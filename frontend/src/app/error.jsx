'use client';

import React, { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Captured by App Error Boundary:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        textAlign: 'center',
        color: '#ffffff',
        backgroundColor: '#0c0d10',
      }}
    >
      <h2 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '12px' }}>
        Unable to load page
      </h2>
      <p
        style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '15px',
          lineHeight: 1.5,
          maxWidth: '460px',
          marginBottom: '28px',
        }}
      >
        {error?.message || 'A client navigation error occurred.'}
      </p>
      <button
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
  );
}

