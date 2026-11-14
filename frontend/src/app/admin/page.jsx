'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import './admin.css';
import {
  getStoredDestinations,
  saveDestination,
  deleteStoredDestination,
  getStoredBookings,
  updateStoredBookingStatus,
  deleteStoredBooking,
  getStoredInquiries,
  updateStoredInquiryStatus,
  deleteStoredInquiry,
  getStoredSubscribers,
} from '@/lib/store';
import { INITIAL_DESTINATIONS } from '@/lib/data';

const AVAILABLE_CATEGORIES = [
  'trending',
  'islands',
  'nature',
  'culture',
  'romantic',
  'adventure',
  'wellness',
  'luxury'
];

const REGIONS = ['Europe', 'Asia', 'South America', 'Africa', 'Indian Ocean', 'North America'];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [destinations, setDestinations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Modals
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState(null);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  const [selectedInquiryDetails, setSelectedInquiryDetails] = useState(null);

  // Form State for Destination (Add / Edit)
  const [destForm, setDestForm] = useState({
    title: '',
    country: '',
    region: 'Europe',
    price: 1850,
    durationDays: 7,
    rating: 4.9,
    tagline: '',
    description: '',
    imageUrl: '',
    category: ['luxury', 'nature'],
    featured: true,
  });

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    setDestinations(getStoredDestinations());
    setBookings(getStoredBookings());
    setInquiries(getStoredInquiries());
    setSubscribers(getStoredSubscribers());
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Open Add Destination Modal
  const handleOpenAddModal = () => {
    setEditingDest(null);
    setDestForm({
      title: '',
      country: '',
      region: 'Europe',
      price: 1850,
      durationDays: 7,
      rating: 4.9,
      tagline: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      category: ['luxury', 'nature'],
      featured: true,
    });
    setIsDestModalOpen(true);
  };

  // Open Edit Destination Modal
  const handleOpenEditModal = (dest) => {
    setEditingDest(dest);
    setDestForm({
      title: dest.title || '',
      country: dest.country || '',
      region: dest.region || 'Europe',
      price: dest.price || 1500,
      durationDays: dest.durationDays || 7,
      rating: dest.rating || 4.9,
      tagline: dest.tagline || '',
      description: dest.description || '',
      imageUrl: dest.imageUrl || '',
      category: dest.category || ['luxury'],
      featured: Boolean(dest.featured),
    });
    setIsDestModalOpen(true);
  };

  // Save Destination Submit
  const handleSaveDestination = (e) => {
    e.preventDefault();
    if (!destForm.title || !destForm.country) {
      alert('Please enter Title and Country');
      return;
    }

    const slug = destForm.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newOrUpdated = {
      ...(editingDest || {}),
      id: editingDest?.id || `dest-${Date.now()}`,
      slug: editingDest?.slug || slug,
      title: destForm.title,
      country: destForm.country,
      region: destForm.region,
      price: Number(destForm.price),
      durationDays: Number(destForm.durationDays),
      rating: Number(destForm.rating),
      tagline: destForm.tagline || 'Bespoke journey through extraordinary landscapes.',
      description: destForm.description || 'Curated journey designed for slow contemplation and luxury.',
      imageUrl: destForm.imageUrl,
      gallery: editingDest?.gallery?.length ? editingDest.gallery : [destForm.imageUrl],
      category: destForm.category,
      featured: destForm.featured,
    };

    saveDestination(newOrUpdated);
    loadAllData();
    setIsDestModalOpen(false);
    showToast(editingDest ? 'Destination updated successfully!' : 'New destination added to portfolio!');
  };

  // Delete Destination
  const handleDeleteDestination = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the portfolio?`)) {
      deleteStoredDestination(id);
      loadAllData();
      showToast('Destination removed');
    }
  };

  // Toggle Featured status
  const handleToggleFeatured = (dest) => {
    const updated = { ...dest, featured: !dest.featured };
    saveDestination(updated);
    loadAllData();
    showToast(`${dest.title} ${updated.featured ? 'marked as Featured' : 'removed from Featured'}`);
  };

  // Update Booking Status
  const handleBookingStatusChange = (id, status) => {
    updateStoredBookingStatus(id, status);
    loadAllData();
    showToast(`Booking marked as ${status}`);
  };

  // Delete Booking
  const handleDeleteBooking = (id) => {
    if (window.confirm('Delete this reservation record?')) {
      deleteStoredBooking(id);
      loadAllData();
      showToast('Booking record deleted');
    }
  };

  // Update Inquiry Status
  const handleInquiryStatusChange = (id, status) => {
    updateStoredInquiryStatus(id, status);
    loadAllData();
    showToast(`Inquiry marked as ${status}`);
  };

  // Delete Inquiry
  const handleDeleteInquiry = (id) => {
    if (window.confirm('Delete this inquiry?')) {
      deleteStoredInquiry(id);
      loadAllData();
      showToast('Inquiry deleted');
    }
  };

  // Reset demo store
  const handleResetDemoData = () => {
    if (window.confirm('Reset portfolio destinations back to original initial defaults?')) {
      window.localStorage.removeItem('travelyn_destinations');
      loadAllData();
      showToast('Restored default portfolio');
    }
  };

  // Category selection toggle
  const toggleCategory = (cat) => {
    if (destForm.category.includes(cat)) {
      setDestForm({
        ...destForm,
        category: destForm.category.filter((c) => c !== cat)
      });
    } else {
      setDestForm({
        ...destForm,
        category: [...destForm.category, cat]
      });
    }
  };

  // Analytics Metrics
  const metrics = useMemo(() => {
    const totalBookings = bookings.length;
    const grossRevenue = bookings.reduce((sum, b) => sum + (Number(b.totalEstimatedPrice) || 0), 0);
    const activeInquiries = inquiries.filter((i) => i.status === 'new' || i.status === 'contacted').length;
    const totalDestinations = destinations.length;
    const subscriberCount = subscribers.length;

    return {
      totalBookings,
      grossRevenue: `$${grossRevenue.toLocaleString()}`,
      activeInquiries,
      totalDestinations,
      subscriberCount
    };
  }, [bookings, inquiries, destinations, subscribers]);

  // Filtered lists based on search bar
  const filteredDestinations = useMemo(() => {
    if (!searchQuery.trim()) return destinations;
    const q = searchQuery.toLowerCase();
    return destinations.filter(
      (d) =>
        d.title?.toLowerCase().includes(q) ||
        d.country?.toLowerCase().includes(q) ||
        d.region?.toLowerCase().includes(q)
    );
  }, [destinations, searchQuery]);

  const filteredBookings = useMemo(() => {
    if (!searchQuery.trim()) return bookings;
    const q = searchQuery.toLowerCase();
    return bookings.filter(
      (b) =>
        b.travelerName?.toLowerCase().includes(q) ||
        b.destinationTitle?.toLowerCase().includes(q) ||
        b.travelerEmail?.toLowerCase().includes(q)
    );
  }, [bookings, searchQuery]);

  const filteredInquiries = useMemo(() => {
    if (!searchQuery.trim()) return inquiries;
    const q = searchQuery.toLowerCase();
    return inquiries.filter(
      (i) =>
        i.fullName?.toLowerCase().includes(q) ||
        i.email?.toLowerCase().includes(q) ||
        i.destinationPreference?.toLowerCase().includes(q)
    );
  }, [inquiries, searchQuery]);

  return (
    <div className="admin-layout" suppressHydrationWarning>
      {/* 1. Header Bar */}
      <header className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/admin" className="admin-header-brand">
            <span className="admin-brand-logo">travelyn.</span>
            <span className="admin-badge">Admin Studio</span>
          </Link>
        </div>

        <div className="admin-header-actions">
          <button
            type="button"
            onClick={handleResetDemoData}
            title="Reset to sample data"
            className="admin-btn admin-btn-secondary"
            style={{ height: '36px', fontSize: '12.5px', padding: '0 12px' }}
          >
            ↻ Reset Sample
          </button>

          <Link href="/" className="admin-public-link" target="_blank">
            <span>View Public Site</span>
            <span style={{ fontSize: '14px' }}>↗</span>
          </Link>
        </div>
      </header>

      {/* 2. Navigation Tabs */}
      <nav className="admin-nav-bar">
        <button
          type="button"
          onClick={() => { setActiveTab('overview'); setSearchQuery(''); }}
          className={`admin-nav-tab ${activeTab === 'overview' ? 'is-active' : ''}`}
        >
          <span>📊 Overview</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('destinations'); setSearchQuery(''); }}
          className={`admin-nav-tab ${activeTab === 'destinations' ? 'is-active' : ''}`}
        >
          <span>🗺️ Destinations</span>
          <span className="admin-nav-count">{destinations.length}</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('bookings'); setSearchQuery(''); }}
          className={`admin-nav-tab ${activeTab === 'bookings' ? 'is-active' : ''}`}
        >
          <span>📅 Bookings</span>
          <span className="admin-nav-count">{bookings.length}</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('inquiries'); setSearchQuery(''); }}
          className={`admin-nav-tab ${activeTab === 'inquiries' ? 'is-active' : ''}`}
        >
          <span>✉️ Concierge Inquiries</span>
          <span className="admin-nav-count">{inquiries.length}</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('subscribers'); setSearchQuery(''); }}
          className={`admin-nav-tab ${activeTab === 'subscribers' ? 'is-active' : ''}`}
        >
          <span>📰 Subscribers</span>
          <span className="admin-nav-count">{subscribers.length}</span>
        </button>
      </nav>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#17191c',
          color: '#ffffff',
          padding: '12px 22px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          zIndex: 2000,
          fontSize: '14px',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. Main Dashboard Content */}
      <main className="admin-container">

        {/* ============================================================== */}
        {/* TAB 1: OVERVIEW METRICS & ACTIVITY */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <>
            {/* Metric Cards Row */}
            <div className="admin-metrics-grid">
              <div className="admin-metric-card">
                <div className="admin-metric-header">
                  <span>Gross Pipeline</span>
                  <div className="admin-metric-icon">💵</div>
                </div>
                <div className="admin-metric-value">{metrics.grossRevenue}</div>
                <div className="admin-metric-sub">
                  <span>↑ Across {metrics.totalBookings} reservation requests</span>
                </div>
              </div>

              <div className="admin-metric-card">
                <div className="admin-metric-header">
                  <span>Reservations</span>
                  <div className="admin-metric-icon">📅</div>
                </div>
                <div className="admin-metric-value">{metrics.totalBookings}</div>
                <div className="admin-metric-sub">
                  <span>Active & pending guest journeys</span>
                </div>
              </div>

              <div className="admin-metric-card">
                <div className="admin-metric-header">
                  <span>Concierge Inquiries</span>
                  <div className="admin-metric-icon">💬</div>
                </div>
                <div className="admin-metric-value">{metrics.activeInquiries}</div>
                <div className="admin-metric-sub">
                  <span>Awaiting bespoke itineraries</span>
                </div>
              </div>

              <div className="admin-metric-card">
                <div className="admin-metric-header">
                  <span>Destinations</span>
                  <div className="admin-metric-icon">🌍</div>
                </div>
                <div className="admin-metric-value">{metrics.totalDestinations}</div>
                <div className="admin-metric-sub">
                  <span>Live destinations in portfolio</span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
              {/* Recent Bookings Card */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <h3 className="admin-card-title">Recent Reservations</h3>
                    <p className="admin-card-desc">Latest requests from travellers worldwide</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('bookings')}
                    className="admin-btn admin-btn-secondary"
                    style={{ height: '34px', fontSize: '13px' }}
                  >
                    View All →
                  </button>
                </div>

                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Traveler</th>
                        <th>Journey</th>
                        <th>Estimated</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 4).map((b) => (
                        <tr key={b.id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{b.travelerName}</div>
                            <div style={{ fontSize: '12px', color: '#718096' }}>{b.travelerEmail}</div>
                          </td>
                          <td>{b.destinationTitle}</td>
                          <td style={{ fontWeight: 600 }}>${(b.totalEstimatedPrice || 0).toLocaleString()}</td>
                          <td>
                            <span className={`status-pill is-${b.status}`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Actions & Portfolio Highlight */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <h3 className="admin-card-title">Portfolio Actions</h3>
                    <p className="admin-card-desc">Quick management shortcuts</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="admin-btn admin-btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <span>+ Add New Luxury Destination</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('inquiries')}
                    className="admin-btn admin-btn-secondary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <span>✉ Review {inquiries.filter(i => i.status === 'new').length} New Guest Inquiries</span>
                  </button>

                  <div style={{
                    marginTop: '8px',
                    padding: '16px',
                    borderRadius: '16px',
                    backgroundColor: '#faf9f6',
                    border: '1px solid rgba(13, 13, 13, 0.06)'
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#17191c', marginBottom: '6px' }}>
                      Newsletter Subscribers
                    </div>
                    <div style={{ fontSize: '14px', color: '#718096' }}>
                      {subscribers.length} luxury travellers have opted in for monthly storytelling.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ============================================================== */}
        {/* TAB 2: DESTINATIONS MANAGER */}
        {/* ============================================================== */}
        {activeTab === 'destinations' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">Destinations Portfolio</h3>
                <p className="admin-card-desc">Add, edit, and organize all journeys displayed on Travelyn</p>
              </div>

              <div className="admin-toolbar">
                <div className="admin-search-wrap">
                  <span className="admin-search-icon">🔍</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search destination, country..."
                    className="admin-search-input"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="admin-btn admin-btn-primary"
                >
                  <span>+ Add Destination</span>
                </button>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Destination</th>
                    <th>Region</th>
                    <th>Price</th>
                    <th>Duration</th>
                    <th>Rating</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDestinations.map((dest) => (
                    <tr key={dest.id}>
                      <td>
                        <div className="admin-dest-cell">
                          <img
                            src={dest.imageUrl}
                            alt={dest.title}
                            className="admin-dest-thumb"
                          />
                          <div>
                            <div className="admin-dest-name">{dest.title}</div>
                            <div className="admin-dest-sub">{dest.country} · /{dest.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td>{dest.region}</td>
                      <td style={{ fontWeight: 600 }}>${dest.price.toLocaleString()}</td>
                      <td>{dest.durationDays} days</td>
                      <td>★ {dest.rating}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(dest)}
                          style={{
                            background: dest.featured ? '#d1fae5' : '#f1f5f9',
                            color: dest.featured ? '#065f46' : '#64748b',
                            border: 'none',
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          {dest.featured ? '★ Featured' : 'Standard'}
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(dest)}
                            className="admin-btn admin-btn-secondary"
                            style={{ height: '32px', padding: '0 10px', fontSize: '12px' }}
                          >
                            Edit
                          </button>
                          <Link
                            href={`/destinations/${dest.slug}`}
                            target="_blank"
                            className="admin-btn admin-btn-secondary"
                            style={{ height: '32px', padding: '0 10px', fontSize: '12px' }}
                          >
                            View
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteDestination(dest.id, dest.title)}
                            className="admin-btn admin-btn-danger"
                            style={{ height: '32px', padding: '0 10px', fontSize: '12px' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredDestinations.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
                        No destinations found matching "{searchQuery}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: BOOKINGS & RESERVATIONS */}
        {/* ============================================================== */}
        {activeTab === 'bookings' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">Bookings & Reservations</h3>
                <p className="admin-card-desc">Review traveler reservations and manage journey statuses</p>
              </div>

              <div className="admin-toolbar">
                <div className="admin-search-wrap">
                  <span className="admin-search-icon">🔍</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search traveler, journey..."
                    className="admin-search-input"
                  />
                </div>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Traveler</th>
                    <th>Destination</th>
                    <th>Start Date</th>
                    <th>Guests</th>
                    <th>Estimated Value</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.travelerName}</div>
                        <div style={{ fontSize: '12px', color: '#718096' }}>{b.travelerEmail}</div>
                        {b.phone && <div style={{ fontSize: '11px', color: '#a0aec0' }}>{b.phone}</div>}
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{b.destinationTitle}</div>
                        <div style={{ fontSize: '12px', color: '#718096' }}>{b.roomType || 'Luxury Suite'}</div>
                      </td>
                      <td>{b.startDate}</td>
                      <td>{b.guests} guests</td>
                      <td style={{ fontWeight: 700 }}>${(b.totalEstimatedPrice || 0).toLocaleString()}</td>
                      <td>
                        <select
                          value={b.status}
                          onChange={(e) => handleBookingStatusChange(b.id, e.target.value)}
                          className={`status-pill is-${b.status}`}
                          style={{ border: 'none', outline: 'none', cursor: 'pointer' }}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => setSelectedBookingDetails(b)}
                            className="admin-btn admin-btn-secondary"
                            style={{ height: '32px', padding: '0 10px', fontSize: '12px' }}
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBooking(b.id)}
                            className="admin-btn admin-btn-danger"
                            style={{ height: '32px', padding: '0 10px', fontSize: '12px' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredBookings.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
                        No reservations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: CONCIERGE INQUIRIES */}
        {/* ============================================================== */}
        {activeTab === 'inquiries' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">Tailor-Made Inquiries</h3>
                <p className="admin-card-desc">Messages submitted through the Plan Your Journey contact form</p>
              </div>

              <div className="admin-toolbar">
                <div className="admin-search-wrap">
                  <span className="admin-search-icon">🔍</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search guest or destination..."
                    className="admin-search-input"
                  />
                </div>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Preference</th>
                    <th>Dates / Budget</th>
                    <th>Message Excerpt</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.map((inq) => (
                    <tr key={inq.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{inq.fullName}</div>
                        <div style={{ fontSize: '12px', color: '#718096' }}>{inq.email}</div>
                        {inq.phone && <div style={{ fontSize: '11px', color: '#a0aec0' }}>{inq.phone}</div>}
                      </td>
                      <td style={{ fontWeight: 500 }}>{inq.destinationPreference}</td>
                      <td>
                        <div>{inq.travelDates || 'Flexible'}</div>
                        <div style={{ fontSize: '12px', color: '#718096' }}>{inq.budgetRange}</div>
                      </td>
                      <td style={{ maxWidth: '300px' }}>
                        <p style={{ margin: 0, fontSize: '13px', color: '#4a5568', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {inq.message}
                        </p>
                      </td>
                      <td>
                        <select
                          value={inq.status}
                          onChange={(e) => handleInquiryStatusChange(inq.id, e.target.value)}
                          className={`status-pill is-${inq.status}`}
                          style={{ border: 'none', outline: 'none', cursor: 'pointer' }}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => setSelectedInquiryDetails(inq)}
                            className="admin-btn admin-btn-secondary"
                            style={{ height: '32px', padding: '0 10px', fontSize: '12px' }}
                          >
                            Read Full
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="admin-btn admin-btn-danger"
                            style={{ height: '32px', padding: '0 10px', fontSize: '12px' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredInquiries.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
                        No guest inquiries found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: NEWSLETTER SUBSCRIBERS */}
        {/* ============================================================== */}
        {activeTab === 'subscribers' && (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">Newsletter Audience</h3>
                <p className="admin-card-desc">Travelers subscribed to Travelyn journal and early access</p>
              </div>

              <div className="admin-toolbar">
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#718096' }}>
                  Total: {subscribers.length} subscribers
                </span>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Email Address</th>
                    <th>Subscribed On</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((s) => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 600 }}>{s.email}</td>
                      <td>{new Date(s.subscribedAt).toLocaleDateString()}</td>
                      <td>
                        <span className="status-pill is-confirmed">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* ============================================================== */}
      {/* MODAL 1: ADD / EDIT DESTINATION */}
      {/* ============================================================== */}
      {isDestModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsDestModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingDest ? 'Edit Destination' : 'Add New Destination'}
              </h3>
              <button
                type="button"
                onClick={() => setIsDestModalOpen(false)}
                className="admin-modal-close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDestination} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-form-label">Destination Title *</label>
                  <input
                    type="text"
                    required
                    value={destForm.title}
                    onChange={(e) => setDestForm({ ...destForm, title: e.target.value })}
                    placeholder="e.g. Swiss Alps"
                    className="admin-form-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Country *</label>
                  <input
                    type="text"
                    required
                    value={destForm.country}
                    onChange={(e) => setDestForm({ ...destForm, country: e.target.value })}
                    placeholder="e.g. Switzerland"
                    className="admin-form-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Region</label>
                  <select
                    value={destForm.region}
                    onChange={(e) => setDestForm({ ...destForm, region: e.target.value })}
                    className="admin-form-select"
                  >
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Price ($ USD per person)</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={destForm.price}
                    onChange={(e) => setDestForm({ ...destForm, price: e.target.value })}
                    className="admin-form-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Duration (Days)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={destForm.durationDays}
                    onChange={(e) => setDestForm({ ...destForm, durationDays: e.target.value })}
                    className="admin-form-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min={1}
                    max={5}
                    value={destForm.rating}
                    onChange={(e) => setDestForm({ ...destForm, rating: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Cover Image URL</label>
                <input
                  type="url"
                  required
                  value={destForm.imageUrl}
                  onChange={(e) => setDestForm({ ...destForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="admin-form-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Tagline</label>
                <input
                  type="text"
                  value={destForm.tagline}
                  onChange={(e) => setDestForm({ ...destForm, tagline: e.target.value })}
                  placeholder="e.g. Evenings in a village of lights"
                  className="admin-form-input"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Description / Manifesto</label>
                <textarea
                  value={destForm.description}
                  onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}
                  placeholder="Write a slow narrative description of this journey..."
                  className="admin-form-textarea"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Categories / Vibe</label>
                <div className="admin-checkbox-group">
                  {AVAILABLE_CATEGORIES.map((cat) => (
                    <span
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`admin-checkbox-chip ${destForm.category.includes(cat) ? 'is-selected' : ''}`}
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={destForm.featured}
                  onChange={(e) => setDestForm({ ...destForm, featured: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="featuredToggle" style={{ fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  Mark as Featured on Homepage & Hero Slider
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsDestModalOpen(false)}
                  className="admin-btn admin-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                >
                  {editingDest ? 'Update Journey' : 'Create Journey'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: BOOKING DETAILS */}
      {/* ============================================================== */}
      {selectedBookingDetails && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedBookingDetails(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Reservation Details</h3>
              <button
                type="button"
                onClick={() => setSelectedBookingDetails(null)}
                className="admin-modal-close"
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                <div>
                  <strong style={{ color: '#718096', fontSize: '12px', textTransform: 'uppercase' }}>Traveler</strong>
                  <div style={{ fontSize: '16px', fontWeight: 600, marginTop: '2px' }}>{selectedBookingDetails.travelerName}</div>
                  <div>{selectedBookingDetails.travelerEmail}</div>
                  <div>{selectedBookingDetails.phone || 'No phone provided'}</div>
                </div>

                <div>
                  <strong style={{ color: '#718096', fontSize: '12px', textTransform: 'uppercase' }}>Journey</strong>
                  <div style={{ fontSize: '16px', fontWeight: 600, marginTop: '2px' }}>{selectedBookingDetails.destinationTitle}</div>
                  <div>Starts: {selectedBookingDetails.startDate}</div>
                  <div>Guests: {selectedBookingDetails.guests}</div>
                </div>
              </div>

              <div style={{ padding: '14px', backgroundColor: '#faf9f6', borderRadius: '14px', border: '1px solid rgba(13, 13, 13, 0.08)' }}>
                <strong style={{ color: '#718096', fontSize: '12px', textTransform: 'uppercase' }}>Special Requests & Preferences</strong>
                <p style={{ margin: '6px 0 0 0', lineHeight: 1.6 }}>
                  {selectedBookingDetails.specialRequests || 'No special requests submitted.'}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#718096' }}>Estimated Total Value</div>
                  <div style={{ fontSize: '24px', fontWeight: 700 }}>
                    ${(selectedBookingDetails.totalEstimatedPrice || 0).toLocaleString()}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      handleBookingStatusChange(selectedBookingDetails.id, 'confirmed');
                      setSelectedBookingDetails({ ...selectedBookingDetails, status: 'confirmed' });
                    }}
                    className="admin-btn"
                    style={{ backgroundColor: '#d1fae5', color: '#065f46' }}
                  >
                    Confirm Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleBookingStatusChange(selectedBookingDetails.id, 'cancelled');
                      setSelectedBookingDetails({ ...selectedBookingDetails, status: 'cancelled' });
                    }}
                    className="admin-btn admin-btn-danger"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: INQUIRY DETAILS */}
      {/* ============================================================== */}
      {selectedInquiryDetails && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedInquiryDetails(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Guest Concierge Inquiry</h3>
              <button
                type="button"
                onClick={() => setSelectedInquiryDetails(null)}
                className="admin-modal-close"
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                <div>
                  <strong style={{ color: '#718096', fontSize: '12px', textTransform: 'uppercase' }}>Guest Name</strong>
                  <div style={{ fontSize: '16px', fontWeight: 600, marginTop: '2px' }}>{selectedInquiryDetails.fullName}</div>
                  <div><a href={`mailto:${selectedInquiryDetails.email}`}>{selectedInquiryDetails.email}</a></div>
                  <div>{selectedInquiryDetails.phone || 'No phone'}</div>
                </div>

                <div>
                  <strong style={{ color: '#718096', fontSize: '12px', textTransform: 'uppercase' }}>Travel Desires</strong>
                  <div style={{ fontSize: '16px', fontWeight: 600, marginTop: '2px' }}>{selectedInquiryDetails.destinationPreference}</div>
                  <div>Dates: {selectedInquiryDetails.travelDates || 'Flexible'}</div>
                  <div>Budget: {selectedInquiryDetails.budgetRange}</div>
                </div>
              </div>

              <div style={{ padding: '16px', backgroundColor: '#faf9f6', borderRadius: '16px', border: '1px solid rgba(13, 13, 13, 0.08)' }}>
                <strong style={{ color: '#718096', fontSize: '12px', textTransform: 'uppercase' }}>Full Inquiry Message</strong>
                <p style={{ margin: '8px 0 0 0', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {selectedInquiryDetails.message}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <a
                  href={`mailto:${selectedInquiryDetails.email}?subject=Travelyn Concierge: Your Tailor-Made Journey`}
                  className="admin-btn admin-btn-primary"
                >
                  ✉ Reply via Email
                </a>
                <button
                  type="button"
                  onClick={() => {
                    handleInquiryStatusChange(selectedInquiryDetails.id, 'contacted');
                    setSelectedInquiryDetails({ ...selectedInquiryDetails, status: 'contacted' });
                  }}
                  className="admin-btn admin-btn-secondary"
                >
                  Mark as Contacted
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
