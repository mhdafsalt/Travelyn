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

const SAMPLE_TRAVEL_PHOTOS = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80'
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  // New gallery image URL input state
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Form State for Destination (Add / Edit)
  const [destForm, setDestForm] = useState({
    title: '',
    country: '',
    region: 'Europe',
    price: 145000,
    durationDays: 7,
    rating: 4.9,
    tagline: '',
    description: '',
    imageUrl: '',
    gallery: [],
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
    setNewGalleryUrl('');
    const defaultCover = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';
    setDestForm({
      title: '',
      country: '',
      region: 'Europe',
      price: 145000,
      durationDays: 7,
      rating: 4.9,
      tagline: '',
      description: '',
      imageUrl: defaultCover,
      gallery: [
        defaultCover,
        'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1200&q=80'
      ],
      category: ['luxury', 'nature'],
      featured: true,
    });
    setIsDestModalOpen(true);
  };

  // Open Edit Destination Modal
  const handleOpenEditModal = (dest) => {
    setEditingDest(dest);
    setNewGalleryUrl('');
    const existingGallery = Array.isArray(dest.gallery) && dest.gallery.length > 0
      ? dest.gallery
      : (dest.imageUrl ? [dest.imageUrl] : []);

    setDestForm({
      title: dest.title || '',
      country: dest.country || '',
      region: dest.region || 'Europe',
      price: dest.price || 145000,
      durationDays: dest.durationDays || 7,
      rating: dest.rating || 4.9,
      tagline: dest.tagline || '',
      description: dest.description || '',
      imageUrl: dest.imageUrl || existingGallery[0] || '',
      gallery: [...existingGallery],
      category: dest.category || ['luxury'],
      featured: Boolean(dest.featured),
    });
    setIsDestModalOpen(true);
  };

  // Add an image (or multiple comma-separated images) to gallery
  const handleAddGalleryImage = (customUrl = null) => {
    const raw = (customUrl || newGalleryUrl).trim();
    if (!raw) return;

    const splitUrls = raw
      .split(/[\n,]+/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0 && (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('/')));

    if (splitUrls.length === 0) {
      alert('Please enter a valid image URL starting with http://, https://, or /');
      return;
    }

    setDestForm((prev) => {
      const current = prev.gallery || [];
      const updatedGallery = [...current];
      splitUrls.forEach((u) => {
        if (!updatedGallery.includes(u)) {
          updatedGallery.push(u);
        }
      });

      const updatedCover = prev.imageUrl || updatedGallery[0] || '';
      return {
        ...prev,
        imageUrl: updatedCover,
        gallery: updatedGallery,
      };
    });

    setNewGalleryUrl('');
    showToast(`Added ${splitUrls.length} image${splitUrls.length > 1 ? 's' : ''} to gallery`);
  };

  // Remove image from gallery
  const handleRemoveGalleryImage = (indexToRemove) => {
    setDestForm((prev) => {
      const itemToRemove = prev.gallery[indexToRemove];
      const updatedGallery = prev.gallery.filter((_, idx) => idx !== indexToRemove);
      let updatedCover = prev.imageUrl;
      if (prev.imageUrl === itemToRemove) {
        updatedCover = updatedGallery[0] || '';
      }
      return {
        ...prev,
        imageUrl: updatedCover,
        gallery: updatedGallery,
      };
    });
  };

  // Set an image from gallery as primary thumbnail/cover
  const handleSetCoverImage = (imgUrl) => {
    setDestForm((prev) => ({
      ...prev,
      imageUrl: imgUrl,
    }));
    showToast('Updated primary card thumbnail');
  };

  // Add sample travel photo from presets
  const handleAddSamplePhoto = () => {
    const unused = SAMPLE_TRAVEL_PHOTOS.filter(
      (p) => !destForm.gallery.includes(p) && destForm.imageUrl !== p
    );
    const photoToAdd = unused.length > 0
      ? unused[Math.floor(Math.random() * unused.length)]
      : SAMPLE_TRAVEL_PHOTOS[Math.floor(Math.random() * SAMPLE_TRAVEL_PHOTOS.length)];
    handleAddGalleryImage(photoToAdd);
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

    const finalGallery = Array.isArray(destForm.gallery) && destForm.gallery.length > 0
      ? destForm.gallery
      : (destForm.imageUrl ? [destForm.imageUrl] : []);
    const finalCover = destForm.imageUrl || finalGallery[0] || '';

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
      imageUrl: finalCover,
      gallery: finalGallery,
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
      grossRevenue: `₹${grossRevenue.toLocaleString('en-IN')}`,
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

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'destinations': return 'Destinations Portfolio';
      case 'bookings': return 'Reservations & Bookings';
      case 'inquiries': return 'Concierge Inquiries';
      case 'subscribers': return 'Newsletter Audience';
      default: return 'Overview & Analytics';
    }
  };

  return (
    <div className="admin-shell" suppressHydrationWarning>
      {/* Mobile Drawer Backdrop */}
      <div
        className={`admin-mobile-backdrop ${isSidebarOpen ? 'is-open' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* ============================================================== */}
      {/* 1. MODERN FIXED SIDEBAR */}
      {/* ============================================================== */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'is-open' : ''}`}>
        <div className="admin-sidebar-top">
          {/* Brand & Badge */}
          <div className="admin-sidebar-brand">
            <Link href="/admin" className="admin-brand-link" onClick={() => setIsSidebarOpen(false)}>
              <span className="admin-brand-title">
                travelyn<span className="admin-brand-dot">.</span>
              </span>
              <span className="admin-brand-badge">
                <span className="admin-live-dot" /> Studio Console
              </span>
            </Link>

            <button
              type="button"
              className="admin-sidebar-close-btn"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>

          {/* Navigation Section: Core Management */}
          <div className="admin-nav-section">
            <div className="admin-nav-header">Platform</div>

            {/* Tab: Overview */}
            <button
              type="button"
              onClick={() => { setActiveTab('overview'); setSearchQuery(''); setIsSidebarOpen(false); }}
              className={`admin-nav-button ${activeTab === 'overview' ? 'is-active' : ''}`}
            >
              <div className="admin-nav-left">
                <span className="admin-nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </span>
                <span>Overview</span>
              </div>
            </button>

            {/* Tab: Destinations */}
            <button
              type="button"
              onClick={() => { setActiveTab('destinations'); setSearchQuery(''); setIsSidebarOpen(false); }}
              className={`admin-nav-button ${activeTab === 'destinations' ? 'is-active' : ''}`}
            >
              <div className="admin-nav-left">
                <span className="admin-nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                    <line x1="9" y1="3" x2="9" y2="18" />
                    <line x1="15" y1="6" x2="15" y2="21" />
                  </svg>
                </span>
                <span>Destinations</span>
              </div>
              <span className="admin-nav-pill">{destinations.length}</span>
            </button>
          </div>

          {/* Navigation Section: Operations */}
          <div className="admin-nav-section">
            <div className="admin-nav-header">Guest Operations</div>

            {/* Tab: Bookings */}
            <button
              type="button"
              onClick={() => { setActiveTab('bookings'); setSearchQuery(''); setIsSidebarOpen(false); }}
              className={`admin-nav-button ${activeTab === 'bookings' ? 'is-active' : ''}`}
            >
              <div className="admin-nav-left">
                <span className="admin-nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </span>
                <span>Bookings</span>
              </div>
              <span className="admin-nav-pill">{bookings.length}</span>
            </button>

            {/* Tab: Inquiries */}
            <button
              type="button"
              onClick={() => { setActiveTab('inquiries'); setSearchQuery(''); setIsSidebarOpen(false); }}
              className={`admin-nav-button ${activeTab === 'inquiries' ? 'is-active' : ''}`}
            >
              <div className="admin-nav-left">
                <span className="admin-nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </span>
                <span>Inquiries</span>
              </div>
              <span className="admin-nav-pill">
                {inquiries.filter((i) => i.status === 'new').length || inquiries.length}
              </span>
            </button>

            {/* Tab: Subscribers */}
            <button
              type="button"
              onClick={() => { setActiveTab('subscribers'); setSearchQuery(''); setIsSidebarOpen(false); }}
              className={`admin-nav-button ${activeTab === 'subscribers' ? 'is-active' : ''}`}
            >
              <div className="admin-nav-left">
                <span className="admin-nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </span>
                <span>Subscribers</span>
              </div>
              <span className="admin-nav-pill">{subscribers.length}</span>
            </button>
          </div>
        </div>

        {/* Sidebar Bottom / Profile & Quick Links */}
        <div className="admin-sidebar-bottom">
          <div className="admin-user-card">
            <div className="admin-user-avatar">TS</div>
            <div className="admin-user-info">
              <span className="admin-user-name">Travelyn Lead</span>
              <span className="admin-user-role">Chiado Studio · Lisbon</span>
            </div>
          </div>

          <div className="admin-sidebar-actions">
            <Link href="/" target="_blank" className="admin-sidebar-link-btn">
              <span>View Public Site</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </Link>

            <button
              type="button"
              onClick={handleResetDemoData}
              className="admin-sidebar-link-btn"
              style={{ background: 'transparent', cursor: 'pointer', textAlign: 'left', width: '100%' }}
            >
              <span>Reset Sample Data</span>
              <span>↻</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. MAIN APPLICATION WORKSPACE */}
      {/* ============================================================== */}
      <div className="admin-main-wrap">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            {/* Hamburger Button for Mobile */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="admin-mobile-menu-btn"
              aria-label="Open sidebar menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* Breadcrumbs */}
            <div className="admin-breadcrumbs">
              <span className="admin-breadcrumb-root">Console</span>
              <span className="admin-breadcrumb-divider">/</span>
              <span className="admin-breadcrumb-current">{getBreadcrumbTitle()}</span>
            </div>
          </div>

          <div className="admin-topbar-right">
            {/* Quick Search */}
            <div className="admin-topbar-search">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="admin-topbar-search-icon">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Quick search records..."
                className="admin-topbar-search-input"
              />
            </div>

            {/* Quick Add Destination CTA */}
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="admin-topbar-cta"
            >
              <span>+ New Destination</span>
            </button>
          </div>
        </header>

        {/* Toast Notification */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#17191c',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            zIndex: 2000,
            fontSize: '13.5px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ color: '#10b981' }}>✓</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Viewport Content */}
        <main className="admin-viewport">

          {/* ============================================================== */}
          {/* TAB 1: OVERVIEW METRICS & ACTIVITY */}
          {/* ============================================================== */}
          {activeTab === 'overview' && (
            <>
              {/* Metric Cards Row */}
              <div className="admin-metrics-grid">
                <div className="admin-metric-card">
                  <div className="admin-metric-header">
                    <span>Pipeline Value</span>
                    <div className="admin-metric-icon-wrap">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                  </div>
                  <div className="admin-metric-value">{metrics.grossRevenue}</div>
                  <div className="admin-metric-footer">
                    <span>↑ Estimated across {metrics.totalBookings} guest reservations</span>
                  </div>
                </div>

                <div className="admin-metric-card">
                  <div className="admin-metric-header">
                    <span>Reservations</span>
                    <div className="admin-metric-icon-wrap">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                  </div>
                  <div className="admin-metric-value">{metrics.totalBookings}</div>
                  <div className="admin-metric-footer">
                    <span>Active & pending guest journeys</span>
                  </div>
                </div>

                <div className="admin-metric-card">
                  <div className="admin-metric-header">
                    <span>Concierge Inquiries</span>
                    <div className="admin-metric-icon-wrap">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="admin-metric-value">{metrics.activeInquiries}</div>
                  <div className="admin-metric-footer">
                    <span>Awaiting tailor-made itineraries</span>
                  </div>
                </div>

                <div className="admin-metric-card">
                  <div className="admin-metric-header">
                    <span>Destinations</span>
                    <div className="admin-metric-icon-wrap">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    </div>
                  </div>
                  <div className="admin-metric-value">{metrics.totalDestinations}</div>
                  <div className="admin-metric-footer">
                    <span>Live journeys in collection</span>
                  </div>
                </div>
              </div>

              {/* Recent Bookings & Quick Actions Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
                {/* Recent Bookings Card */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <div>
                      <h3 className="admin-card-title">Recent Guest Reservations</h3>
                      <p className="admin-card-subtitle">Real-time requests submitted through Travelyn</p>
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
                            <td style={{ fontWeight: 600 }}>₹{(b.totalEstimatedPrice || 0).toLocaleString('en-IN')}</td>
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

                {/* Quick Actions & Studio Notes Card */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <div>
                      <h3 className="admin-card-title">Studio Shortcuts</h3>
                      <p className="admin-card-subtitle">Quick administration actions</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={handleOpenAddModal}
                      className="admin-btn admin-btn-primary"
                      style={{ width: '100%', justifyContent: 'center', height: '42px' }}
                    >
                      <span>+ Create New Luxury Journey</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('inquiries')}
                      className="admin-btn admin-btn-secondary"
                      style={{ width: '100%', justifyContent: 'center', height: '42px' }}
                    >
                      <span>✉ Review {inquiries.filter((i) => i.status === 'new').length} New Bespoke Inquiries</span>
                    </button>

                    <div style={{
                      marginTop: '6px',
                      padding: '16px',
                      borderRadius: '16px',
                      backgroundColor: '#faf9f6',
                      border: '1px solid rgba(13, 13, 13, 0.06)'
                    }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#17191c', marginBottom: '4px' }}>
                        Newsletter Community
                      </div>
                      <div style={{ fontSize: '13.5px', color: '#718096', lineHeight: 1.5 }}>
                        {subscribers.length} curious travellers subscribed to slow travel releases and journal essays.
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
                  <p className="admin-card-subtitle">Manage journeys, featured highlights, pricing, and itineraries</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                      <th>Price (₹)</th>
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
                        <td style={{ fontWeight: 600 }}>₹{dest.price.toLocaleString('en-IN')}</td>
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
                              View ↗
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
                  <p className="admin-card-subtitle">Review incoming reservations and update journey statuses</p>
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
                        <td style={{ fontWeight: 700 }}>₹{(b.totalEstimatedPrice || 0).toLocaleString('en-IN')}</td>
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
                  <h3 className="admin-card-title">Tailor-Made Concierge Inquiries</h3>
                  <p className="admin-card-subtitle">Custom itinerary requests submitted through the Plan Journey form</p>
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
                  <p className="admin-card-subtitle">Travellers subscribed to Travelyn monthly journeys and insights</p>
                </div>

                <div style={{ fontSize: '14px', fontWeight: 600, color: '#718096' }}>
                  Total: {subscribers.length} subscribers
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
      </div>

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

            <form onSubmit={handleSaveDestination} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
                  <label className="admin-form-label">Price (₹ INR per person)</label>
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

              {/* Image Management: Primary Thumbnail & Detailed Gallery */}
              <div className="admin-image-box">
                <div className="admin-image-box-header">
                  <div className="admin-image-box-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <span>Thumbnail & Detailed Images</span>
                  </div>
                  <span className="admin-image-count-pill">
                    {(destForm.gallery || []).length} detailed {(destForm.gallery || []).length === 1 ? 'photo' : 'photos'}
                  </span>
                </div>

                {/* 1. Primary Card Thumbnail */}
                <div className="admin-form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="admin-form-label" style={{ margin: 0 }}>
                      Primary Thumbnail / Cover Image *
                    </label>
                    <span style={{ fontSize: '11px', color: '#718096' }}>
                      Used for Homepage Cards & Search
                    </span>
                  </div>
                  <div className="admin-thumb-preview-container">
                    <div className="admin-thumb-preview">
                      {destForm.imageUrl ? (
                        <img src={destForm.imageUrl} alt="Thumbnail preview" onError={(e) => { e.target.style.opacity = '0.3'; }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#94a3b8' }}>
                          No image
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <input
                        type="url"
                        required
                        value={destForm.imageUrl}
                        onChange={(e) => setDestForm({ ...destForm, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="admin-form-input"
                      />
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                        Tip: You can also select any photo from the Detailed Gallery below to set as the primary thumbnail.
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Detailed Gallery Images */}
                <div className="admin-form-group" style={{ marginTop: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label className="admin-form-label" style={{ margin: 0 }}>
                      Detailed Gallery Images (Multiple Photos)
                    </label>
                    <span style={{ fontSize: '11px', color: '#718096' }}>
                      Used for Journey Detail Page & Photo Carousel
                    </span>
                  </div>

                  {/* Add Image Input Bar */}
                  <div className="admin-gallery-add-row">
                    <input
                      type="text"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddGalleryImage();
                        }
                      }}
                      placeholder="Paste image URL (or multiple comma-separated URLs)..."
                      className="admin-form-input"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddGalleryImage()}
                      className="admin-gallery-add-btn"
                    >
                      + Add Image
                    </button>
                    <button
                      type="button"
                      onClick={handleAddSamplePhoto}
                      className="admin-gallery-sample-btn"
                      title="Quickly add a sample travel photo"
                    >
                      + Sample Photo
                    </button>
                  </div>

                  {/* Gallery Grid Preview */}
                  {destForm.gallery && destForm.gallery.length > 0 ? (
                    <div className="admin-gallery-grid">
                      {destForm.gallery.map((url, idx) => {
                        const isCover = destForm.imageUrl === url;
                        return (
                          <div key={idx} className={`admin-gallery-card ${isCover ? 'is-cover' : ''}`}>
                            <div className="admin-gallery-card-img-wrap">
                              <img src={url} alt={`Gallery detail ${idx + 1}`} onError={(e) => { e.target.style.opacity = '0.3'; }} />
                              {isCover && (
                                <span className="admin-gallery-cover-badge">
                                  ★ Thumbnail
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryImage(idx)}
                                className="admin-gallery-delete-btn"
                                title="Remove from gallery"
                              >
                                ✕
                              </button>
                            </div>
                            <div className="admin-gallery-card-footer">
                              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
                                #{idx + 1}
                              </span>
                              {!isCover ? (
                                <button
                                  type="button"
                                  onClick={() => handleSetCoverImage(url)}
                                  className="admin-gallery-set-cover-btn"
                                >
                                  Set Thumbnail
                                </button>
                              ) : (
                                <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600 }}>Active</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="admin-gallery-empty">
                      No detailed gallery photos added yet. Paste image URLs above or click <strong>+ Sample Photo</strong> to build the destination's photo story.
                    </div>
                  )}
                </div>
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
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
                    ₹{(selectedBookingDetails.totalEstimatedPrice || 0).toLocaleString('en-IN')}
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
