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
  getStoredHeroSettings,
  saveStoredHeroSettings,
  resetStoredHeroSettings,
  DEFAULT_HERO_SETTINGS,
  getStoredStorySettings,
  saveStoredStorySettings,
  resetStoredStorySettings,
  DEFAULT_STORY_SETTINGS,
  getStoredAboutStatsSettings,
  saveStoredAboutStatsSettings,
  resetStoredAboutStatsSettings,
  DEFAULT_ABOUT_STATS_SETTINGS,
  getStoredTestimonialsSettings,
  saveStoredTestimonialsSettings,
  resetStoredTestimonialsSettings,
  DEFAULT_TESTIMONIALS_SETTINGS,
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

const HERO_BACKDROP_PRESETS = [
  { label: 'Lisbon Twilight (Original)', url: 'https://framerusercontent.com/images/TSiGMGJHmapQIwKIzHneadv3LM.png' },
  { label: 'Swiss Alps Tent', url: '/hero-tent-wide.jpg' },
  { label: 'Santorini Sunset', url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1920&q=80' },
  { label: 'Kyoto Mist & Bamboo', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1920&q=80' },
  { label: 'Maldives Overwater Lagoon', url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1920&q=80' },
  { label: 'Patagonia Mountains', url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1920&q=80' },
];

const SAMPLE_TRAVEL_PHOTOS = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80'
];

const STORY_THEME_PRESETS = [
  {
    label: 'Swiss Alps (Classic)',
    sectionTag: 'Swiss Alps',
    titlePrimary: 'Feel the mountains',
    titleMuted: 'before you go',
    stories: [
      {
        id: 'story-1',
        tag: 'Swiss Alps',
        title: 'Mornings above the clouds',
        description: 'Coffee on a wooden balcony, the valley still asleep below and snowy peaks catching the first light.',
        imageUrl: 'https://framerusercontent.com/images/8guYiCRSdUDmndFojnqAvFpGNk.jpg',
        buttonText: 'Discover Swiss Alps',
        link: '/destinations/swiss-alps',
        reversed: false
      },
      {
        id: 'story-2',
        tag: 'Swiss Alps',
        title: 'Evenings by the fire',
        description: 'Wool blankets, crackling logs and fondue shared slowly while the snow falls outside the window.',
        imageUrl: 'https://framerusercontent.com/images/Y5iOG5ie06PAZjqXQFJGD5em94.jpg',
        buttonText: 'Discover Swiss Alps',
        link: '/destinations/swiss-alps',
        reversed: true
      }
    ]
  },
  {
    label: 'Kyoto Mist & Zen',
    sectionTag: 'Kyoto, Japan',
    titlePrimary: 'Feel the silence',
    titleMuted: 'before you step in',
    stories: [
      {
        id: 'story-kyoto-1',
        tag: 'Kyoto',
        title: 'Dawn through the bamboo',
        description: 'Stone paths damp with dew, quiet bamboo towering above, and the gentle chime of wooden wind chimes in the distance.',
        imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
        buttonText: 'Discover Kyoto',
        link: '/destinations/kyoto',
        reversed: false
      },
      {
        id: 'story-kyoto-2',
        tag: 'Kyoto',
        title: 'Matcha by the garden',
        description: 'Warm ceramic bowls, handcrafted wagashi sweets, and moss gardens untouched by the frantic pace of the modern world.',
        imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
        buttonText: 'Discover Kyoto',
        link: '/destinations/kyoto',
        reversed: true
      }
    ]
  },
  {
    label: 'Santorini Sunset',
    sectionTag: 'Santorini, Greece',
    titlePrimary: 'Feel the warmth',
    titleMuted: 'before the sun sets',
    stories: [
      {
        id: 'story-santorini-1',
        tag: 'Santorini',
        title: 'Whitewashed rooftops',
        description: 'Salt-scented breeze over cobalt caldera waters, bougainvillea hanging from stone arches bathed in pure Mediterranean sun.',
        imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
        buttonText: 'Discover Santorini',
        link: '/destinations/santorini',
        reversed: false
      },
      {
        id: 'story-santorini-2',
        tag: 'Santorini',
        title: 'Golden hour sailing',
        description: 'Chilled Assyrtiko wine, fresh olives, and the silent glide of a catamaran as the sky turns into velvet gold.',
        imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
        buttonText: 'Discover Santorini',
        link: '/destinations/santorini',
        reversed: true
      }
    ]
  }
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

  // Hero Section Dynamic Customizer State
  const [heroSettings, setHeroSettings] = useState(DEFAULT_HERO_SETTINGS);
  const [newPhraseInput, setNewPhraseInput] = useState('');
  const [newChipTime, setNewChipTime] = useState('');
  const [newChipTitle, setNewChipTitle] = useState('');
  const [newChipQuery, setNewChipQuery] = useState('');

  // Stories Showcase Dynamic Customizer State
  const [storySettings, setStorySettings] = useState(DEFAULT_STORY_SETTINGS);

  // About Studio & Stats Dynamic Customizer State
  const [aboutStatsSettings, setAboutStatsSettings] = useState(DEFAULT_ABOUT_STATS_SETTINGS);

  // Testimonials Dynamic Customizer State
  const [testimonialsSettings, setTestimonialsSettings] = useState(DEFAULT_TESTIMONIALS_SETTINGS);
  const [previewTestimonialIdx, setPreviewTestimonialIdx] = useState(0);

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
    setHeroSettings(getStoredHeroSettings());
    setStorySettings(getStoredStorySettings());
    setAboutStatsSettings(getStoredAboutStatsSettings());
    setTestimonialsSettings(getStoredTestimonialsSettings());
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Hero Section Handlers
  const handleSaveHeroSettings = (e) => {
    if (e) e.preventDefault();
    saveStoredHeroSettings(heroSettings);
    showToast('Hero Section updated & live across homepage!');
  };

  const handleResetHeroSettings = () => {
    if (window.confirm('Reset Hero Section to original Travelyn default content?')) {
      const def = resetStoredHeroSettings();
      setHeroSettings(def);
      showToast('Hero Section reset to original defaults');
    }
  };

  const handleAddPhrase = () => {
    const raw = newPhraseInput.trim();
    if (!raw) return;
    const current = heroSettings.typewriterPhrases || [];
    if (!current.includes(raw)) {
      setHeroSettings({
        ...heroSettings,
        typewriterPhrases: [...current, raw]
      });
      setNewPhraseInput('');
      showToast('Added typewriter phrase');
    }
  };

  const handleRemovePhrase = (idx) => {
    const current = heroSettings.typewriterPhrases || [];
    setHeroSettings({
      ...heroSettings,
      typewriterPhrases: current.filter((_, i) => i !== idx)
    });
  };

  const handleAddChip = () => {
    if (!newChipTitle.trim() || !newChipQuery.trim()) {
      alert('Please enter a Chip Title and Search Query');
      return;
    }
    const current = heroSettings.stopChips || [];
    setHeroSettings({
      ...heroSettings,
      stopChips: [
        ...current,
        {
          time: newChipTime.trim(),
          title: newChipTitle.trim(),
          query: newChipQuery.trim()
        }
      ]
    });
    setNewChipTime('');
    setNewChipTitle('');
    setNewChipQuery('');
    showToast('Added itinerary stop chip');
  };

  const handleRemoveChip = (idx) => {
    const current = heroSettings.stopChips || [];
    setHeroSettings({
      ...heroSettings,
      stopChips: current.filter((_, i) => i !== idx)
    });
  };

  // Stories Section Handlers
  const handleSaveStorySettings = (e) => {
    if (e) e.preventDefault();
    saveStoredStorySettings(storySettings);
    showToast('Stories Showcase updated & live across homepage!');
  };

  const handleResetStorySettings = () => {
    if (window.confirm('Reset Stories section to original default content?')) {
      const def = resetStoredStorySettings();
      setStorySettings(def);
      showToast('Stories showcase reset to original defaults');
    }
  };

  const handleAddStoryCard = () => {
    const currentStories = storySettings.stories || [];
    const newCard = {
      id: 'story-' + Date.now(),
      tag: storySettings.sectionTag || 'Featured Journey',
      title: 'Slow Mornings & Quiet Wonders',
      description: 'Capture the mood and feeling of this destination experience with a short, sensory narrative.',
      imageUrl: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80',
      buttonText: `Discover ${storySettings.sectionTag || 'Destination'}`,
      link: '/destinations',
      reversed: currentStories.length % 2 !== 0,
    };
    setStorySettings({
      ...storySettings,
      stories: [...currentStories, newCard]
    });
    showToast('Added new story card');
  };

  const handleUpdateStoryCard = (index, field, value) => {
    const list = [...(storySettings.stories || [])];
    list[index] = { ...list[index], [field]: value };
    setStorySettings({
      ...storySettings,
      stories: list
    });
  };

  const handleRemoveStoryCard = (index) => {
    const currentStories = storySettings.stories || [];
    if (currentStories.length <= 1) {
      alert('You must keep at least one story card in the showcase.');
      return;
    }
    const list = currentStories.filter((_, i) => i !== index);
    setStorySettings({
      ...storySettings,
      stories: list
    });
    showToast('Story card removed');
  };

  const handleApplyStoryPreset = (preset) => {
    setStorySettings({
      ...storySettings,
      sectionTag: preset.sectionTag,
      titlePrimary: preset.titlePrimary,
      titleMuted: preset.titleMuted,
      stories: preset.stories
    });
    showToast(`Applied preset: ${preset.label}`);
  };

  // About & Stats Section Handlers
  const handleSaveAboutStatsSettings = (e) => {
    if (e) e.preventDefault();
    saveStoredAboutStatsSettings(aboutStatsSettings);
    showToast('About Studio & Stats updated & live across homepage!');
  };

  const handleResetAboutStatsSettings = () => {
    if (window.confirm('Reset About Studio & Stats to original default content?')) {
      const def = resetStoredAboutStatsSettings();
      setAboutStatsSettings(def);
      showToast('About Studio & Stats reset to original defaults');
    }
  };

  const handleAddStatItem = () => {
    const current = aboutStatsSettings.stats || [];
    const newStat = {
      id: 'stat-' + Date.now(),
      number: '100+',
      label: 'Unique Experiences'
    };
    setAboutStatsSettings({
      ...aboutStatsSettings,
      stats: [...current, newStat]
    });
    showToast('Added new stat counter');
  };

  const handleUpdateStatItem = (index, field, value) => {
    const list = [...(aboutStatsSettings.stats || [])];
    list[index] = { ...list[index], [field]: value };
    setAboutStatsSettings({
      ...aboutStatsSettings,
      stats: list
    });
  };

  const handleRemoveStatItem = (index) => {
    const current = aboutStatsSettings.stats || [];
    if (current.length <= 1) {
      alert('You must keep at least one stat counter.');
      return;
    }
    const list = current.filter((_, i) => i !== index);
    setAboutStatsSettings({
      ...aboutStatsSettings,
      stats: list
    });
    showToast('Stat counter removed');
  };

  // Testimonials Section Handlers
  const handleSaveTestimonialsSettings = (e) => {
    if (e) e.preventDefault();
    saveStoredTestimonialsSettings(testimonialsSettings);
    showToast('Traveller Stories & Reviews updated & live across homepage!');
  };

  const handleResetTestimonialsSettings = () => {
    if (window.confirm('Reset Testimonials section to original default content?')) {
      const def = resetStoredTestimonialsSettings();
      setTestimonialsSettings(def);
      setPreviewTestimonialIdx(0);
      showToast('Testimonials reset to original defaults');
    }
  };

  const handleAddTestimonial = () => {
    const current = testimonialsSettings.testimonials || [];
    const newItem = {
      id: 'testimonial-' + Date.now(),
      quote: 'A magnificent journey designed with meticulous slowness and soul. We felt completely immersed in every moment.',
      authorName: 'Alex & Jordan',
      authorLocation: 'Dolomites · 2026',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      photoUrl: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80'
    };
    setTestimonialsSettings({
      ...testimonialsSettings,
      testimonials: [...current, newItem]
    });
    setPreviewTestimonialIdx(current.length);
    showToast('Added new traveller story');
  };

  const handleUpdateTestimonial = (index, field, value) => {
    const list = [...(testimonialsSettings.testimonials || [])];
    list[index] = { ...list[index], [field]: value };
    setTestimonialsSettings({
      ...testimonialsSettings,
      testimonials: list
    });
  };

  const handleRemoveTestimonial = (index) => {
    const current = testimonialsSettings.testimonials || [];
    if (current.length <= 1) {
      alert('You must keep at least one traveller review.');
      return;
    }
    const list = current.filter((_, i) => i !== index);
    setTestimonialsSettings({
      ...testimonialsSettings,
      testimonials: list
    });
    setPreviewTestimonialIdx(0);
    showToast('Traveller review removed');
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
      case 'hero': return 'Hero Section Studio';
      case 'stories': return 'Stories Showcase Studio';
      case 'about-stats': return 'About Studio & Metrics';
      case 'testimonials': return 'Traveller Stories & Reviews';
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

            {/* Tab: Hero Section */}
            <button
              type="button"
              onClick={() => { setActiveTab('hero'); setSearchQuery(''); setIsSidebarOpen(false); }}
              className={`admin-nav-button ${activeTab === 'hero' ? 'is-active' : ''}`}
            >
              <div className="admin-nav-left">
                <span className="admin-nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </span>
                <span>Hero Section</span>
              </div>
              <span className="admin-nav-pill" style={{ background: '#3b82f6', color: '#ffffff', fontSize: '10px', padding: '2px 7px' }}>LIVE</span>
            </button>

            {/* Tab: Stories Showcase */}
            <button
              type="button"
              onClick={() => { setActiveTab('stories'); setSearchQuery(''); setIsSidebarOpen(false); }}
              className={`admin-nav-button ${activeTab === 'stories' ? 'is-active' : ''}`}
            >
              <div className="admin-nav-left">
                <span className="admin-nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </span>
                <span>Stories Showcase</span>
              </div>
              <span className="admin-nav-pill" style={{ background: '#10b981', color: '#ffffff', fontSize: '10px', padding: '2px 7px' }}>LIVE</span>
            </button>

            {/* Tab: About & Stats */}
            <button
              type="button"
              onClick={() => { setActiveTab('about-stats'); setSearchQuery(''); setIsSidebarOpen(false); }}
              className={`admin-nav-button ${activeTab === 'about-stats' ? 'is-active' : ''}`}
            >
              <div className="admin-nav-left">
                <span className="admin-nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </span>
                <span>About & Stats</span>
              </div>
              <span className="admin-nav-pill" style={{ background: '#8b5cf6', color: '#ffffff', fontSize: '10px', padding: '2px 7px' }}>LIVE</span>
            </button>

            {/* Tab: Testimonials */}
            <button
              type="button"
              onClick={() => { setActiveTab('testimonials'); setSearchQuery(''); setIsSidebarOpen(false); }}
              className={`admin-nav-button ${activeTab === 'testimonials' ? 'is-active' : ''}`}
            >
              <div className="admin-nav-left">
                <span className="admin-nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </span>
                <span>Testimonials</span>
              </div>
              <span className="admin-nav-pill" style={{ background: '#ec4899', color: '#ffffff', fontSize: '10px', padding: '2px 7px' }}>LIVE</span>
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

          {/* ============================================================== */}
          {/* TAB 6: HERO SECTION STUDIO */}
          {/* ============================================================== */}
          {activeTab === 'hero' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Studio Header Card */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <h3 className="admin-card-title">Homepage Hero Studio</h3>
                    <p className="admin-card-subtitle">
                      Dynamically customize the homepage hero typography, atmospheric background, interactive glass card, typewriter phrases, and chips.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={handleResetHeroSettings}
                      className="admin-btn admin-btn-secondary"
                    >
                      Reset Defaults
                    </button>
                    <a
                      href="/"
                      target="_blank"
                      className="admin-btn admin-btn-secondary"
                      style={{ textDecoration: 'none' }}
                    >
                      View Live ↗
                    </a>
                    <button
                      type="button"
                      onClick={handleSaveHeroSettings}
                      className="admin-btn admin-btn-primary"
                    >
                      Save Hero Section
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid: Left Live Preview + Right Customizer Form */}
              <div className="admin-hero-studio-grid">
                {/* Left: Interactive Live Mockup Preview */}
                <div className="admin-hero-preview-card">
                  <div
                    className="admin-hero-preview-screen"
                    style={{
                      backgroundImage: `url(${heroSettings.backdropImageUrl || 'https://framerusercontent.com/images/TSiGMGJHmapQIwKIzHneadv3LM.png'})`
                    }}
                  >
                    <div className="admin-hero-preview-overlay" />

                    {/* Preview Top Row */}
                    <div className="admin-hero-preview-top">
                      <div className="admin-hero-preview-clock">
                        20:19
                      </div>

                      {heroSettings.showGlassCard !== false && (
                        <div className="admin-hero-preview-glass">
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '10px', opacity: 0.85, marginBottom: '4px' }}>
                            <span>{heroSettings.glassCardCity || 'LISBON'}</span>
                            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '1px 5px', borderRadius: '4px' }}>
                              {heroSettings.glassCardBadge || 'TODAY'}
                            </span>
                          </div>
                          <div style={{ fontWeight: 600 }}>{heroSettings.glassCardMuseum || '4:00 PM · Azulejo Museum'}</div>
                          <div style={{ fontSize: '10px', opacity: 0.75 }}>{heroSettings.glassCardStatus || 'rerouted · dry'}</div>
                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', marginTop: '4px', paddingTop: '4px', fontSize: '9.5px', opacity: 0.9 }}>
                            {heroSettings.glassCardPace || 'evening: easy pace'}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Preview Content */}
                    <div className="admin-hero-preview-content">
                      <h4 className="admin-hero-preview-title">
                        {(heroSettings.title || DEFAULT_HERO_SETTINGS.title).split('\n').map((line, idx) => (
                          <React.Fragment key={idx}>
                            {line}
                            {idx < (heroSettings.title || '').split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </h4>

                      <p className="admin-hero-preview-sub">
                        {heroSettings.subtitle || DEFAULT_HERO_SETTINGS.subtitle}
                      </p>

                      {/* Mockup Floating Search Bar */}
                      <div className="admin-hero-preview-prompt">
                        <span style={{ opacity: 0.85 }}>
                          ✨ {heroSettings.typewriterPhrases?.[0] || 'a week in Lisbon...'}
                        </span>
                        <span className="admin-hero-preview-btn">
                          {heroSettings.buildButtonText || 'Build it'} →
                        </span>
                      </div>

                      {/* Mockup Beacon */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', opacity: 0.9 }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                        <span style={{ color: '#a0aec0' }}>{heroSettings.beaconLabel || 'Nomia right now:'}</span>
                        <span>{heroSettings.beaconValue || 'watching the weather shift'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="admin-hero-preview-footer">
                    <span style={{ color: '#a0aec0' }}>Live Interactive Preview</span>
                    <span style={{ color: '#22c55e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                      Homepage Synced
                    </span>
                  </div>
                </div>

                {/* Right: Detailed Configuration Panels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Panel 1: Main Typography & Narrative */}
                  <div className="admin-card">
                    <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px', color: '#17191c' }}>
                      1. Headline & Narrative Statement
                    </h4>
                    <p style={{ fontSize: '13px', color: '#718096', margin: '0 0 16px' }}>
                      The centerpiece typography and core brand messaging on the first screen fold.
                    </p>

                    <div className="admin-form-group">
                      <label className="admin-form-label">
                        Main Hero Title (Use Enter/Return for line breaks)
                      </label>
                      <textarea
                        rows={2}
                        value={heroSettings.title}
                        onChange={(e) => setHeroSettings({ ...heroSettings, title: e.target.value })}
                        className="admin-form-textarea"
                        placeholder="Say it once.&#10;We build the trip."
                        style={{ fontFamily: 'var(--font-display, serif)', fontSize: '16px', fontWeight: 600 }}
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">
                        Subtitle / Value Proposition
                      </label>
                      <textarea
                        rows={3}
                        value={heroSettings.subtitle}
                        onChange={(e) => setHeroSettings({ ...heroSettings, subtitle: e.target.value })}
                        className="admin-form-textarea"
                        placeholder="One phrase, and a living itinerary builds itself around the city..."
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">
                        Action Button Label
                      </label>
                      <input
                        type="text"
                        value={heroSettings.buildButtonText}
                        onChange={(e) => setHeroSettings({ ...heroSettings, buildButtonText: e.target.value })}
                        className="admin-form-input"
                        placeholder="Build it"
                      />
                    </div>
                  </div>

                  {/* Panel 2: Background Atmosphere & Cutout Imagery */}
                  <div className="admin-card">
                    <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px', color: '#17191c' }}>
                      2. Background Imagery & Visual Assets
                    </h4>
                    <p style={{ fontSize: '13px', color: '#718096', margin: '0 0 16px' }}>
                      Control the immersive full-bleed atmospheric backdrop and transparent foreground subject.
                    </p>

                    <div className="admin-form-group">
                      <label className="admin-form-label">
                        Atmospheric Backdrop Image URL
                      </label>
                      <input
                        type="url"
                        value={heroSettings.backdropImageUrl}
                        onChange={(e) => setHeroSettings({ ...heroSettings, backdropImageUrl: e.target.value })}
                        className="admin-form-input"
                        placeholder="https://..."
                      />
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                        <span style={{ fontSize: '12px', color: '#718096', alignSelf: 'center' }}>Presets:</span>
                        {HERO_BACKDROP_PRESETS.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setHeroSettings({ ...heroSettings, backdropImageUrl: p.url })}
                            className="admin-hero-preset-btn"
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="admin-form-group" style={{ marginTop: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className="admin-form-label" style={{ margin: 0 }}>
                          Foreground Cutout Model Image
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={heroSettings.showCutout !== false}
                            onChange={(e) => setHeroSettings({ ...heroSettings, showCutout: e.target.checked })}
                          />
                          <span>Show Foreground Cutout</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        value={heroSettings.cutoutImageUrl}
                        onChange={(e) => setHeroSettings({ ...heroSettings, cutoutImageUrl: e.target.value })}
                        className="admin-form-input"
                        placeholder="/images/hero.png"
                      />
                    </div>
                  </div>

                  {/* Panel 3: Live Glass Widget Card */}
                  <div className="admin-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px', color: '#17191c' }}>
                          3. Live Glass Widget Card
                        </h4>
                        <p style={{ fontSize: '13px', color: '#718096', margin: 0 }}>
                          The floating translucent card on the top right illustrating real-time itinerary intelligence.
                        </p>
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
                        <input
                          type="checkbox"
                          checked={heroSettings.showGlassCard !== false}
                          onChange={(e) => setHeroSettings({ ...heroSettings, showGlassCard: e.target.checked })}
                        />
                        <span>Enable Card</span>
                      </label>
                    </div>

                    <div className="admin-form-grid">
                      <div className="admin-form-group">
                        <label className="admin-form-label">City Name</label>
                        <input
                          type="text"
                          value={heroSettings.glassCardCity}
                          onChange={(e) => setHeroSettings({ ...heroSettings, glassCardCity: e.target.value })}
                          className="admin-form-input"
                          placeholder="LISBON"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-form-label">Badge Tag</label>
                        <input
                          type="text"
                          value={heroSettings.glassCardBadge}
                          onChange={(e) => setHeroSettings({ ...heroSettings, glassCardBadge: e.target.value })}
                          className="admin-form-input"
                          placeholder="TODAY"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-form-label">Activity / Scheduled Stop</label>
                        <input
                          type="text"
                          value={heroSettings.glassCardMuseum}
                          onChange={(e) => setHeroSettings({ ...heroSettings, glassCardMuseum: e.target.value })}
                          className="admin-form-input"
                          placeholder="4:00 PM · Azulejo Museum"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-form-label">Dynamic Routing Status</label>
                        <input
                          type="text"
                          value={heroSettings.glassCardStatus}
                          onChange={(e) => setHeroSettings({ ...heroSettings, glassCardStatus: e.target.value })}
                          className="admin-form-input"
                          placeholder="rerouted · dry and on the way"
                        />
                      </div>
                    </div>

                    <div className="admin-form-group" style={{ marginTop: '12px' }}>
                      <label className="admin-form-label">Pace & Evening Mood</label>
                      <input
                        type="text"
                        value={heroSettings.glassCardPace}
                        onChange={(e) => setHeroSettings({ ...heroSettings, glassCardPace: e.target.value })}
                        className="admin-form-input"
                        placeholder="evening: easy pace"
                      />
                    </div>
                  </div>

                  {/* Panel 4: Typewriter Search Phrases */}
                  <div className="admin-card">
                    <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px', color: '#17191c' }}>
                      4. Typewriter Search Phrases
                    </h4>
                    <p style={{ fontSize: '13px', color: '#718096', margin: '0 0 14px' }}>
                      Rotating inspiration phrases that type out inside the floating prompt bar.
                    </p>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                      <input
                        type="text"
                        value={newPhraseInput}
                        onChange={(e) => setNewPhraseInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddPhrase(); } }}
                        placeholder="e.g. 5 days in Santorini cave suites..."
                        className="admin-form-input"
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={handleAddPhrase}
                        className="admin-gallery-add-btn"
                      >
                        + Add Phrase
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(heroSettings.typewriterPhrases || []).map((ph, idx) => (
                        <span
                          key={idx}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            padding: '6px 12px',
                            borderRadius: '999px',
                            fontSize: '13px',
                            fontWeight: 500,
                          }}
                        >
                          <span>{ph}</span>
                          <button
                            type="button"
                            onClick={() => handleRemovePhrase(idx)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '12px', padding: 0 }}
                            title="Remove phrase"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Panel 5: Stop Chips (Quick Itinerary Filters) */}
                  <div className="admin-card">
                    <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px', color: '#17191c' }}>
                      5. Quick Stop Chips
                    </h4>
                    <p style={{ fontSize: '13px', color: '#718096', margin: '0 0 14px' }}>
                      Clickable itinerary tags positioned directly above the floating prompt bar.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 140px auto', gap: '8px', marginBottom: '14px' }}>
                      <input
                        type="text"
                        value={newChipTime}
                        onChange={(e) => setNewChipTime(e.target.value)}
                        placeholder="Time (e.g. 1:00 PM)"
                        className="admin-form-input"
                      />
                      <input
                        type="text"
                        value={newChipTitle}
                        onChange={(e) => setNewChipTitle(e.target.value)}
                        placeholder="Title (e.g. Time Out Market)"
                        className="admin-form-input"
                      />
                      <input
                        type="text"
                        value={newChipQuery}
                        onChange={(e) => setNewChipQuery(e.target.value)}
                        placeholder="Search Query"
                        className="admin-form-input"
                      />
                      <button
                        type="button"
                        onClick={handleAddChip}
                        className="admin-gallery-add-btn"
                      >
                        + Add Chip
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {(heroSettings.stopChips || []).map((chip, idx) => (
                        <span key={idx} className="admin-hero-chip-pill">
                          {chip.time && <strong style={{ color: '#0f172a' }}>{chip.time} ·</strong>}
                          <span>{chip.title}</span>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>({chip.query})</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveChip(idx)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '12px', padding: 0 }}
                            title="Remove chip"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Panel 6: Live Status Beacon */}
                  <div className="admin-card">
                    <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px', color: '#17191c' }}>
                      6. Real-time Concierge Beacon
                    </h4>
                    <p style={{ fontSize: '13px', color: '#718096', margin: '0 0 14px' }}>
                      The pulsing indicator at the bottom of the hero showing real-time concierge intelligence.
                    </p>

                    <div className="admin-form-grid">
                      <div className="admin-form-group">
                        <label className="admin-form-label">Concierge Label</label>
                        <input
                          type="text"
                          value={heroSettings.beaconLabel}
                          onChange={(e) => setHeroSettings({ ...heroSettings, beaconLabel: e.target.value })}
                          className="admin-form-input"
                          placeholder="Nomia right now:"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label className="admin-form-label">Status Message</label>
                        <input
                          type="text"
                          value={heroSettings.beaconValue}
                          onChange={(e) => setHeroSettings({ ...heroSettings, beaconValue: e.target.value })}
                          className="admin-form-input"
                          placeholder="watching the weather shift"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Save Bar */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '10px 0 30px' }}>
                    <button
                      type="button"
                      onClick={handleResetHeroSettings}
                      className="admin-btn admin-btn-secondary"
                    >
                      Reset Defaults
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveHeroSettings}
                      className="admin-btn admin-btn-primary"
                      style={{ padding: '12px 28px', fontSize: '14.5px' }}
                    >
                      Save & Apply to Homepage
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 7: STORIES & MOMENTS SHOWCASE STUDIO */}
          {/* ============================================================== */}
          {activeTab === 'stories' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Studio Header Card */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <h3 className="admin-card-title">Stories & Moments Showcase Studio</h3>
                    <p className="admin-card-subtitle">
                      Dynamically manage the dual-staggered editorial stories section (&quot;Feel the mountains before you go&quot;) displayed on the homepage.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handleResetStorySettings}
                      className="admin-btn admin-btn-secondary"
                    >
                      Reset Defaults
                    </button>
                    <a
                      href="/#stories-section"
                      target="_blank"
                      className="admin-btn admin-btn-secondary"
                      style={{ textDecoration: 'none' }}
                    >
                      View Live ↗
                    </a>
                    <button
                      type="button"
                      onClick={handleSaveStorySettings}
                      className="admin-btn admin-btn-primary"
                    >
                      Save Stories Showcase
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid: Left Sticky Live Preview + Right Customizer Form */}
              <div className="admin-hero-studio-grid">
                {/* Left: Interactive Live Mockup Preview */}
                <div className="admin-hero-preview-card" style={{ background: '#ffffff', color: '#111827', border: '1px solid #e2e8f0' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#64748b', textTransform: 'uppercase' }}>
                      Live Storefront Preview
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#10b981', fontWeight: 600 }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                      Reactive Sync
                    </span>
                  </div>

                  {/* Preview Container mimicking homepage StorySection */}
                  <div style={{ padding: '20px', overflowY: 'auto', maxHeight: '720px', display: 'flex', flexDirection: 'column', gap: '20px', background: '#faf9f6' }}>
                    {/* Header preview */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '999px', padding: '3px 10px', width: 'fit-content', fontSize: '11px', fontWeight: 600, color: '#374151' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#111' }} />
                        <span>{storySettings.sectionTag || 'Swiss Alps'}</span>
                      </div>
                      <h4 style={{ fontSize: '20px', fontWeight: 600, lineHeight: 1.25, color: '#111827', margin: 0 }}>
                        {storySettings.titlePrimary || 'Feel the mountains'}{' '}
                        <span style={{ color: '#9ca3af', fontWeight: 400 }}>{storySettings.titleMuted || 'before you go'}</span>
                      </h4>
                    </div>

                    {/* Cards preview list */}
                    {(storySettings.stories || []).map((card, idx) => {
                      const isRev = card.reversed !== undefined ? card.reversed : (idx % 2 !== 0);
                      return (
                        <div
                          key={card.id || idx}
                          style={{
                            background: '#ffffff',
                            borderRadius: '16px',
                            border: '1px solid #e5e7eb',
                            overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                          }}
                        >
                          <div style={{ position: 'relative', width: '100%', height: '160px', background: '#e2e8f0' }}>
                            <img
                              src={card.imageUrl || 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80'}
                              alt={card.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', backdropFilter: 'blur(4px)' }}>
                              #{idx + 1} {isRev ? '• Inverted Layout' : '• Standard Layout'}
                            </div>
                          </div>

                          <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '10.5px', color: '#6b7280', fontWeight: 600 }}>
                              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#6b7280' }} />
                              <span>{card.tag || storySettings.sectionTag || 'Swiss Alps'}</span>
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
                              {card.title || 'Untitled Story'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#4b5563', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {card.description || 'No narrative text provided.'}
                            </div>
                            <div style={{ paddingTop: '4px' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f3f4f6', border: '1px solid #e5e7eb', padding: '5px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 600, color: '#111827' }}>
                                <span>{card.buttonText || 'Discover Journey'}</span>
                                <span>→</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ padding: '12px 18px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', color: '#64748b' }}>
                    <span>{(storySettings.stories || []).length} cards in carousel</span>
                    <a href="/#stories-section" target="_blank" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                      Open full view ↗
                    </a>
                  </div>
                </div>

                {/* Right: Customizer Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Card: Section Header & Themes */}
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <div>
                        <h4 className="admin-card-title">Section Header & Narrative Theme</h4>
                        <p className="admin-card-subtitle">
                          Define the headline text, section badge, and select curated presets.
                        </p>
                      </div>
                    </div>

                    {/* Presets Row */}
                    <div style={{ marginBottom: '20px', padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                        Quick Destination Presets:
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {STORY_THEME_PRESETS.map((preset, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => handleApplyStoryPreset(preset)}
                            className="admin-hero-preset-btn"
                          >
                            ✦ {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="admin-form-grid">
                      <div className="admin-form-group">
                        <label className="admin-label">
                          Section Tag Pill <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={storySettings.sectionTag || ''}
                          onChange={(e) => setStorySettings({ ...storySettings, sectionTag: e.target.value })}
                          className="admin-input"
                          placeholder="e.g. Swiss Alps, Kyoto, Patagonia..."
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">
                          Primary Headline <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={storySettings.titlePrimary || ''}
                          onChange={(e) => setStorySettings({ ...storySettings, titlePrimary: e.target.value })}
                          className="admin-input"
                          placeholder="e.g. Feel the mountains"
                        />
                      </div>

                      <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                        <label className="admin-label">
                          Muted Secondary Headline <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={storySettings.titleMuted || ''}
                          onChange={(e) => setStorySettings({ ...storySettings, titleMuted: e.target.value })}
                          className="admin-input"
                          placeholder="e.g. before you go"
                        />
                        <span style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                          Rendered in soft muted grey right beneath the primary title for luxury editorial pacing.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card: Story Cards Manager */}
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <div>
                        <h4 className="admin-card-title">
                          Editorial Story Cards ({(storySettings.stories || []).length})
                        </h4>
                        <p className="admin-card-subtitle">
                          Add, edit, or reorder the staggered story moments. Each card has its own photo, title, narrative, button, and destination link.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddStoryCard}
                        className="admin-btn admin-btn-secondary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <span>Add Story Card</span>
                      </button>
                    </div>

                    {/* Cards List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {(storySettings.stories || []).map((card, index) => {
                        const isReversed = card.reversed !== undefined ? card.reversed : (index % 2 !== 0);

                        return (
                          <div key={card.id || index} className="admin-story-card-item">
                            {/* Card Top Bar */}
                            <div className="admin-story-card-header">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span className="admin-story-card-badge">
                                  Card #{index + 1}
                                </span>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                                  {card.title || 'Untitled Card'}
                                </span>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569', cursor: 'pointer', userSelect: 'none' }}>
                                  <input
                                    type="checkbox"
                                    checked={isReversed}
                                    onChange={(e) => handleUpdateStoryCard(index, 'reversed', e.target.checked)}
                                    style={{ cursor: 'pointer' }}
                                  />
                                  <span>Invert Layout (Photo on Right)</span>
                                </label>

                                <button
                                  type="button"
                                  onClick={() => handleRemoveStoryCard(index)}
                                  className="admin-icon-btn admin-icon-btn-danger"
                                  title="Delete this story card"
                                  style={{ padding: '6px 8px', borderRadius: '8px' }}
                                >
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {/* Card Fields */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                              <div className="admin-form-grid">
                                <div className="admin-form-group">
                                  <label className="admin-label">Tag Pill Text</label>
                                  <input
                                    type="text"
                                    value={card.tag || ''}
                                    onChange={(e) => handleUpdateStoryCard(index, 'tag', e.target.value)}
                                    className="admin-input"
                                    placeholder="e.g. Swiss Alps"
                                  />
                                </div>

                                <div className="admin-form-group">
                                  <label className="admin-label">Card Title</label>
                                  <input
                                    type="text"
                                    value={card.title || ''}
                                    onChange={(e) => handleUpdateStoryCard(index, 'title', e.target.value)}
                                    className="admin-input"
                                    placeholder="e.g. Mornings above the clouds"
                                  />
                                </div>
                              </div>

                              <div className="admin-form-group">
                                <label className="admin-label">Narrative Description</label>
                                <textarea
                                  value={card.description || ''}
                                  onChange={(e) => handleUpdateStoryCard(index, 'description', e.target.value)}
                                  className="admin-input"
                                  rows={2}
                                  placeholder="Write a calm, slow-paced narrative snippet..."
                                  style={{ resize: 'vertical' }}
                                />
                              </div>

                              {/* Photo URL & Quick Presets */}
                              <div className="admin-form-group">
                                <label className="admin-label">Photo Image URL</label>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                  <div
                                    style={{
                                      width: '80px',
                                      height: '56px',
                                      borderRadius: '10px',
                                      overflow: 'hidden',
                                      border: '1px solid #cbd5e1',
                                      flexShrink: 0,
                                      background: '#f1f5f9',
                                    }}
                                  >
                                    <img
                                      src={card.imageUrl || 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=400&q=80'}
                                      alt="Thumbnail"
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                      onError={(e) => { e.target.style.opacity = '0.3'; }}
                                    />
                                  </div>
                                  <input
                                    type="text"
                                    value={card.imageUrl || ''}
                                    onChange={(e) => handleUpdateStoryCard(index, 'imageUrl', e.target.value)}
                                    className="admin-input"
                                    placeholder="https://..."
                                    style={{ flex: 1, minWidth: 0 }}
                                  />
                                </div>

                                {/* Quick Sample Photo chips */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                                  <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500 }}>Quick sample images:</span>
                                  {SAMPLE_TRAVEL_PHOTOS.slice(0, 4).map((sampleUrl, sIdx) => (
                                    <button
                                      key={sIdx}
                                      type="button"
                                      onClick={() => handleUpdateStoryCard(index, 'imageUrl', sampleUrl)}
                                      className="admin-hero-preset-btn"
                                      style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '999px' }}
                                    >
                                      Sample #{sIdx + 1}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="admin-form-grid">
                                <div className="admin-form-group">
                                  <label className="admin-label">Button Text</label>
                                  <input
                                    type="text"
                                    value={card.buttonText || ''}
                                    onChange={(e) => handleUpdateStoryCard(index, 'buttonText', e.target.value)}
                                    className="admin-input"
                                    placeholder="e.g. Discover Swiss Alps"
                                  />
                                </div>

                                <div className="admin-form-group">
                                  <label className="admin-label">Destination Link URL</label>
                                  <input
                                    type="text"
                                    value={card.link || ''}
                                    onChange={(e) => handleUpdateStoryCard(index, 'link', e.target.value)}
                                    className="admin-input"
                                    placeholder="/destinations/swiss-alps"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Add Card Button */}
                    <button
                      type="button"
                      onClick={handleAddStoryCard}
                      className="admin-btn admin-btn-secondary"
                      style={{ marginTop: '16px', width: '100%', padding: '12px', borderStyle: 'dashed' }}
                    >
                      + Add Another Story Card
                    </button>
                  </div>

                  {/* Save Banner Card */}
                  <div className="admin-card" style={{ background: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b' }}>
                          Ready to publish your stories section?
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          Saved changes update live across the homepage immediately.
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={handleResetStorySettings}
                          className="admin-btn admin-btn-secondary"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveStorySettings}
                          className="admin-btn admin-btn-primary"
                          style={{ padding: '12px 28px', fontSize: '14.5px' }}
                        >
                          Save Stories Showcase
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 8: ABOUT STUDIO & METRICS (STATS SECTION) */}
          {/* ============================================================== */}
          {activeTab === 'about-stats' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Studio Header Card */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <h3 className="admin-card-title">About Studio & Metrics Customizer</h3>
                    <p className="admin-card-subtitle">
                      Dynamically customize the About Travelyn manifesto (&quot;A boutique travel studio crafting tailor-made journeys...&quot;), key stats counters, and atmospheric Breathe banner.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handleResetAboutStatsSettings}
                      className="admin-btn admin-btn-secondary"
                    >
                      Reset Defaults
                    </button>
                    <a
                      href="/#about-stats-section"
                      target="_blank"
                      className="admin-btn admin-btn-secondary"
                      style={{ textDecoration: 'none' }}
                    >
                      View Live ↗
                    </a>
                    <button
                      type="button"
                      onClick={handleSaveAboutStatsSettings}
                      className="admin-btn admin-btn-primary"
                    >
                      Save About & Stats
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid: Left Sticky Live Preview + Right Customizer Form */}
              <div className="admin-hero-studio-grid">
                {/* Left: Interactive Live Mockup Preview */}
                <div className="admin-hero-preview-card" style={{ background: '#ffffff', color: '#111827', border: '1px solid #e2e8f0' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#64748b', textTransform: 'uppercase' }}>
                      Live Storefront Preview
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#10b981', fontWeight: 600 }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                      Reactive Sync
                    </span>
                  </div>

                  {/* Preview Container mimicking exact homepage section */}
                  <div style={{ padding: '20px', overflowY: 'auto', maxHeight: '760px', display: 'flex', flexDirection: 'column', gap: '24px', background: '#faf9f6' }}>
                    {/* Atmospheric Breathe Banner Mini Preview (if enabled) */}
                    {aboutStatsSettings.showBreatheBanner !== false && (
                      <div
                        style={{
                          position: 'relative',
                          borderRadius: '14px',
                          overflow: 'hidden',
                          height: '140px',
                          backgroundImage: `url(${aboutStatsSettings.breatheBgUrl || 'https://framerusercontent.com/images/PMSlK6mTGdx9DcWYaJZiAMBFv4.jpg'})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          color: '#ffffff',
                          padding: '12px'
                        }}
                      >
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
                        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <span style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 600 }}>
                            {aboutStatsSettings.breatheTag || 'Breathe'}
                          </span>
                          <span style={{ fontSize: '15px', fontWeight: 600 }}>{aboutStatsSettings.breatheHeading || 'Slow down.'}</span>
                          <span style={{ fontSize: '11px', opacity: 0.8 }}>{aboutStatsSettings.breatheSubtext || 'The world will wait.'}</span>
                        </div>
                      </div>
                    )}

                    {/* About Travelyn Statement Area */}
                    <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '999px', padding: '3px 10px', fontSize: '11px', fontWeight: 600, color: '#374151' }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#111' }} />
                          <span>{aboutStatsSettings.aboutTag || 'About Travelyn'}</span>
                        </div>
                        <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {aboutStatsSettings.aboutEst || 'Est. 2014 — Lisbon'}
                        </span>
                      </div>

                      <p style={{ fontSize: '14px', lineHeight: 1.5, color: '#17191c', margin: 0, fontWeight: 500 }}>
                        {aboutStatsSettings.statementPrefix || 'A boutique travel studio crafting '}
                        <span style={{ color: 'rgba(13, 13, 13, 0.38)', fontWeight: 600 }}>
                          {aboutStatsSettings.statementHighlight || 'tailor-made journeys'}
                        </span>
                        {aboutStatsSettings.statementSuffix || ' for curious travellers who would rather feel a place than simply see it.'}
                      </p>

                      <div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#111827', color: '#ffffff', padding: '6px 14px', borderRadius: '999px', fontSize: '11px', fontWeight: 600 }}>
                          <span>{aboutStatsSettings.buttonText || 'Our Story'}</span>
                          <span style={{ fontSize: '10px' }}>↗</span>
                        </span>
                      </div>
                    </div>

                    {/* Stats Counters Grid Preview */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                      {(aboutStatsSettings.stats || []).map((s, idx) => (
                        <div
                          key={s.id || idx}
                          style={{
                            background: '#ffffff',
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                            padding: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px'
                          }}
                        >
                          <div style={{ width: '100%', height: '2px', background: 'rgba(0,0,0,0.08)', marginBottom: '4px' }} />
                          <div style={{ fontSize: '20px', fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>
                            {s.number || '0'}
                          </div>
                          <div style={{ fontSize: '10px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {s.label || 'Counter Label'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: '12px 18px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', color: '#64748b' }}>
                    <span>{(aboutStatsSettings.stats || []).length} stats active</span>
                    <a href="/#about-stats-section" target="_blank" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                      Open full view ↗
                    </a>
                  </div>
                </div>

                {/* Right: Customizer Forms */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Card 1: About Travelyn Studio Manifesto */}
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <div>
                        <h4 className="admin-card-title">Studio Manifesto & Tagline</h4>
                        <p className="admin-card-subtitle">
                          Customize the brand statement text, highlighting, and the call-to-action button.
                        </p>
                      </div>
                    </div>

                    <div className="admin-form-grid">
                      <div className="admin-form-group">
                        <label className="admin-label">Section Tag Pill</label>
                        <input
                          type="text"
                          value={aboutStatsSettings.aboutTag || ''}
                          onChange={(e) => setAboutStatsSettings({ ...aboutStatsSettings, aboutTag: e.target.value })}
                          className="admin-input"
                          placeholder="e.g. About Travelyn"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Established Subtitle</label>
                        <input
                          type="text"
                          value={aboutStatsSettings.aboutEst || ''}
                          onChange={(e) => setAboutStatsSettings({ ...aboutStatsSettings, aboutEst: e.target.value })}
                          className="admin-input"
                          placeholder="e.g. Est. 2014 — Lisbon"
                        />
                      </div>
                    </div>

                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div className="admin-form-group">
                        <label className="admin-label">
                          Statement Prefix Text
                        </label>
                        <input
                          type="text"
                          value={aboutStatsSettings.statementPrefix || ''}
                          onChange={(e) => setAboutStatsSettings({ ...aboutStatsSettings, statementPrefix: e.target.value })}
                          className="admin-input"
                          placeholder="e.g. A boutique travel studio crafting "
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">
                          Highlighted / Accent Phrase <span style={{ color: '#8b5cf6', fontSize: '11px', fontWeight: 400 }}>(rendered in elegant muted contrast)</span>
                        </label>
                        <input
                          type="text"
                          value={aboutStatsSettings.statementHighlight || ''}
                          onChange={(e) => setAboutStatsSettings({ ...aboutStatsSettings, statementHighlight: e.target.value })}
                          className="admin-input"
                          placeholder="e.g. tailor-made journeys"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">
                          Statement Suffix Text
                        </label>
                        <textarea
                          value={aboutStatsSettings.statementSuffix || ''}
                          onChange={(e) => setAboutStatsSettings({ ...aboutStatsSettings, statementSuffix: e.target.value })}
                          className="admin-input"
                          rows={2}
                          placeholder="e.g.  for curious travellers who would rather feel a place than simply see it."
                          style={{ resize: 'vertical' }}
                        />
                      </div>

                      <div className="admin-form-grid">
                        <div className="admin-form-group">
                          <label className="admin-label">Button Text</label>
                          <input
                            type="text"
                            value={aboutStatsSettings.buttonText || ''}
                            onChange={(e) => setAboutStatsSettings({ ...aboutStatsSettings, buttonText: e.target.value })}
                            className="admin-input"
                            placeholder="e.g. Our Story"
                          />
                        </div>

                        <div className="admin-form-group">
                          <label className="admin-label">Button Link URL</label>
                          <input
                            type="text"
                            value={aboutStatsSettings.buttonLink || ''}
                            onChange={(e) => setAboutStatsSettings({ ...aboutStatsSettings, buttonLink: e.target.value })}
                            className="admin-input"
                            placeholder="/about"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Key Metric Stats Counters */}
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <div>
                        <h4 className="admin-card-title">
                          Key Metric Counters ({(aboutStatsSettings.stats || []).length})
                        </h4>
                        <p className="admin-card-subtitle">
                          Control the dynamic metric numbers and descriptive labels displayed below the manifesto.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddStatItem}
                        className="admin-btn admin-btn-secondary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <span>Add Counter</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {(aboutStatsSettings.stats || []).map((stat, idx) => (
                        <div
                          key={stat.id || idx}
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}
                        >
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#475569', flexShrink: 0 }}>
                            {idx + 1}
                          </div>

                          <div style={{ flex: '1 1 120px' }}>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '3px' }}>
                              Number / Metric
                            </label>
                            <input
                              type="text"
                              value={stat.number || ''}
                              onChange={(e) => handleUpdateStatItem(idx, 'number', e.target.value)}
                              className="admin-input"
                              placeholder="e.g. 250+"
                              style={{ fontWeight: 700 }}
                            />
                          </div>

                          <div style={{ flex: '2 1 200px' }}>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '3px' }}>
                              Label Description
                            </label>
                            <input
                              type="text"
                              value={stat.label || ''}
                              onChange={(e) => handleUpdateStatItem(idx, 'label', e.target.value)}
                              className="admin-input"
                              placeholder="e.g. UNIQUE DESTINATIONS"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveStatItem(idx)}
                            className="admin-icon-btn admin-icon-btn-danger"
                            title="Delete this counter"
                            style={{ alignSelf: 'flex-end', marginBottom: '3px' }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleAddStatItem}
                      className="admin-btn admin-btn-secondary"
                      style={{ marginTop: '14px', width: '100%', padding: '10px', borderStyle: 'dashed' }}
                    >
                      + Add Another Metric Counter
                    </button>
                  </div>

                  {/* Card 3: Atmospheric Breathe Banner (Optional Ambient Section) */}
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <div>
                        <h4 className="admin-card-title">Atmospheric &quot;Breathe&quot; Banner</h4>
                        <p className="admin-card-subtitle">
                          Full-width atmospheric image banner displayed right above the About section.
                        </p>
                      </div>

                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer', userSelect: 'none' }}>
                        <input
                          type="checkbox"
                          checked={aboutStatsSettings.showBreatheBanner !== false}
                          onChange={(e) => setAboutStatsSettings({ ...aboutStatsSettings, showBreatheBanner: e.target.checked })}
                          style={{ cursor: 'pointer' }}
                        />
                        <span>Show Banner</span>
                      </label>
                    </div>

                    {aboutStatsSettings.showBreatheBanner !== false && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div className="admin-form-grid">
                          <div className="admin-form-group">
                            <label className="admin-label">Banner Tag Pill</label>
                            <input
                              type="text"
                              value={aboutStatsSettings.breatheTag || ''}
                              onChange={(e) => setAboutStatsSettings({ ...aboutStatsSettings, breatheTag: e.target.value })}
                              className="admin-input"
                              placeholder="e.g. Breathe"
                            />
                          </div>

                          <div className="admin-form-group">
                            <label className="admin-label">Heading Line 1</label>
                            <input
                              type="text"
                              value={aboutStatsSettings.breatheHeading || ''}
                              onChange={(e) => setAboutStatsSettings({ ...aboutStatsSettings, breatheHeading: e.target.value })}
                              className="admin-input"
                              placeholder="e.g. Slow down."
                            />
                          </div>
                        </div>

                        <div className="admin-form-group">
                          <label className="admin-label">Subtext Line 2</label>
                          <input
                            type="text"
                            value={aboutStatsSettings.breatheSubtext || ''}
                            onChange={(e) => setAboutStatsSettings({ ...aboutStatsSettings, breatheSubtext: e.target.value })}
                            className="admin-input"
                            placeholder="e.g. The world will wait."
                          />
                        </div>

                        <div className="admin-form-group">
                          <label className="admin-label">Background Image URL</label>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div
                              style={{
                                width: '80px',
                                height: '54px',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                border: '1px solid #cbd5e1',
                                flexShrink: 0,
                                background: '#f1f5f9',
                              }}
                            >
                              <img
                                src={aboutStatsSettings.breatheBgUrl || 'https://framerusercontent.com/images/PMSlK6mTGdx9DcWYaJZiAMBFv4.jpg'}
                                alt="Banner backdrop"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { e.target.style.opacity = '0.3'; }}
                              />
                            </div>
                            <input
                              type="text"
                              value={aboutStatsSettings.breatheBgUrl || ''}
                              onChange={(e) => setAboutStatsSettings({ ...aboutStatsSettings, breatheBgUrl: e.target.value })}
                              className="admin-input"
                              placeholder="https://..."
                              style={{ flex: 1, minWidth: 0 }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card 4: Save Banner Card */}
                  <div className="admin-card" style={{ background: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b' }}>
                          Ready to publish About Studio &amp; Stats changes?
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          Saved changes apply dynamically to the homepage right away.
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={handleResetAboutStatsSettings}
                          className="admin-btn admin-btn-secondary"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveAboutStatsSettings}
                          className="admin-btn admin-btn-primary"
                          style={{ padding: '12px 28px', fontSize: '14.5px' }}
                        >
                          Save About &amp; Stats
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 9: TESTIMONIALS & TRAVELLER STORIES STUDIO */}
          {/* ============================================================== */}
          {activeTab === 'testimonials' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Studio Header Card */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <h3 className="admin-card-title">Traveller Stories &amp; Testimonials Studio</h3>
                    <p className="admin-card-subtitle">
                      Dynamically manage the traveller quote cards, floating review scorecard (&quot;4.9 / 2,400+ verified reviews&quot;), journey photos, and author credentials displayed on the homepage.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handleResetTestimonialsSettings}
                      className="admin-btn admin-btn-secondary"
                    >
                      Reset Defaults
                    </button>
                    <a
                      href="/#testimonials-section"
                      target="_blank"
                      className="admin-btn admin-btn-secondary"
                      style={{ textDecoration: 'none' }}
                    >
                      View Live ↗
                    </a>
                    <button
                      type="button"
                      onClick={handleSaveTestimonialsSettings}
                      className="admin-btn admin-btn-primary"
                    >
                      Save Testimonials
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid: Left Sticky Live Preview + Right Customizer Form */}
              <div className="admin-hero-studio-grid">
                {/* Left: Interactive Live Mockup Preview */}
                <div className="admin-hero-preview-card" style={{ background: '#ffffff', color: '#111827', border: '1px solid #e2e8f0' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#64748b', textTransform: 'uppercase' }}>
                      Live Storefront Preview
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#10b981', fontWeight: 600 }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                      Reactive Sync
                    </span>
                  </div>

                  {/* Preview Container mimicking exact TestimonialsSection */}
                  {(() => {
                    const list = testimonialsSettings.testimonials || [];
                    const activeCard = list[previewTestimonialIdx] || list[0] || {};
                    const starsNum = Math.max(1, Math.min(5, parseInt(testimonialsSettings.ratingStars || 5, 10)));

                    return (
                      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px', background: '#faf9f6' }}>
                        {/* Photo Box with Floating Scorecard */}
                        <div
                          style={{
                            position: 'relative',
                            width: '100%',
                            height: '240px',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            background: '#e2e8f0',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
                          }}
                        >
                          <img
                            src={activeCard.photoUrl || 'https://framerusercontent.com/images/OQDgLum0GfExeAWydcWtw46xVGk.jpg'}
                            alt={activeCard.authorName || 'Traveller photo'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />

                          {/* Floating Scorecard */}
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '12px',
                              left: '12px',
                              background: 'rgba(255, 255, 255, 0.92)',
                              backdropFilter: 'blur(12px)',
                              borderRadius: '14px',
                              padding: '10px 14px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px',
                              boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                            }}
                          >
                            <div style={{ fontSize: '26px', fontWeight: 700, color: '#1e262a', lineHeight: 1 }}>
                              {testimonialsSettings.ratingScore || '4.9'}
                            </div>
                            <div style={{ display: 'flex', gap: '2px', color: '#5b8291' }}>
                              {[...Array(starsNum)].map((_, sIdx) => (
                                <svg key={sIdx} width="11" height="11" viewBox="0 0 24 24" fill="#5b8291" stroke="#5b8291">
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                              ))}
                            </div>
                            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 500 }}>
                              {testimonialsSettings.verifiedReviewsText || '2,400+ verified reviews'}
                            </div>
                          </div>
                        </div>

                        {/* Text & Quote Area */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '999px', padding: '3px 10px', width: 'fit-content', fontSize: '11px', fontWeight: 600, color: '#374151' }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#5b8291' }} />
                            <span>{testimonialsSettings.sectionTag || 'Traveller stories'}</span>
                          </div>

                          <div style={{ color: '#5b8291' }}>
                            <svg width="22" height="16" viewBox="0 0 24 18" fill="currentColor">
                              <path d="M0 18L0 9L4.5 0L9 0L6 7.5L9 7.5L9 18ZM15 18L15 9L19.5 0L24 0L21 7.5L24 7.5L24 18Z" />
                            </svg>
                          </div>

                          <p style={{ fontSize: '14.5px', fontWeight: 500, lineHeight: 1.4, color: '#17191c', margin: 0 }}>
                            &ldquo;{activeCard.quote || 'Slow trains, quiet villages and the best fondue of our lives. We didn’t want to come home.'}&rdquo;
                          </p>

                          {/* Author row */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                            <img
                              src={activeCard.authorAvatar || 'https://framerusercontent.com/images/cwjju4oQ9SWH1nkXN95LfTNt94.jpg'}
                              alt={activeCard.authorName || 'Author avatar'}
                              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e262a' }}>
                                {activeCard.authorName || 'Claire & Tom'}
                              </div>
                              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                {activeCard.authorLocation || 'Swiss Alps · 2026'}
                              </div>
                            </div>
                          </div>

                          {/* Story Dots Switcher */}
                          {list.length > 1 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                              <span style={{ fontSize: '11px', color: '#64748b', marginRight: '4px' }}>Preview Story:</span>
                              {list.map((_, dotIdx) => (
                                <button
                                  key={dotIdx}
                                  type="button"
                                  onClick={() => setPreviewTestimonialIdx(dotIdx)}
                                  style={{
                                    width: dotIdx === previewTestimonialIdx ? '20px' : '7px',
                                    height: '7px',
                                    borderRadius: '999px',
                                    background: dotIdx === previewTestimonialIdx ? '#17191c' : '#cbd5e1',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    padding: 0
                                  }}
                                  title={`View Story #${dotIdx + 1}`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  <div style={{ padding: '12px 18px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', color: '#64748b' }}>
                    <span>{(testimonialsSettings.testimonials || []).length} traveller stories</span>
                    <a href="/#testimonials-section" target="_blank" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
                      Open full view ↗
                    </a>
                  </div>
                </div>

                {/* Right: Customizer Forms */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Card 1: Scorecard & Section Tag */}
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <div>
                        <h4 className="admin-card-title">Scorecard &amp; Badge Metadata</h4>
                        <p className="admin-card-subtitle">
                          Configure the floating glass review score card and section header pill.
                        </p>
                      </div>
                    </div>

                    <div className="admin-form-grid">
                      <div className="admin-form-group">
                        <label className="admin-label">Section Tag Pill</label>
                        <input
                          type="text"
                          value={testimonialsSettings.sectionTag || ''}
                          onChange={(e) => setTestimonialsSettings({ ...testimonialsSettings, sectionTag: e.target.value })}
                          className="admin-input"
                          placeholder="e.g. Traveller stories"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Overall Rating Score</label>
                        <input
                          type="text"
                          value={testimonialsSettings.ratingScore || ''}
                          onChange={(e) => setTestimonialsSettings({ ...testimonialsSettings, ratingScore: e.target.value })}
                          className="admin-input"
                          placeholder="e.g. 4.9"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Rating Stars Count (1-5)</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={testimonialsSettings.ratingStars || 5}
                          onChange={(e) => setTestimonialsSettings({ ...testimonialsSettings, ratingStars: parseInt(e.target.value, 10) || 5 })}
                          className="admin-input"
                        />
                      </div>

                      <div className="admin-form-group">
                        <label className="admin-label">Verified Reviews Text</label>
                        <input
                          type="text"
                          value={testimonialsSettings.verifiedReviewsText || ''}
                          onChange={(e) => setTestimonialsSettings({ ...testimonialsSettings, verifiedReviewsText: e.target.value })}
                          className="admin-input"
                          placeholder="e.g. 2,400+ verified reviews"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Traveller Stories Cards Manager */}
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <div>
                        <h4 className="admin-card-title">
                          Traveller Stories ({(testimonialsSettings.testimonials || []).length})
                        </h4>
                        <p className="admin-card-subtitle">
                          Each story features a quote, author name, location tag, avatar, and background journey photo.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddTestimonial}
                        className="admin-btn admin-btn-secondary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <span>Add Story</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {(testimonialsSettings.testimonials || []).map((item, index) => (
                        <div
                          key={item.id || index}
                          className="admin-story-card-item"
                          style={{
                            borderLeft: index === previewTestimonialIdx ? '4px solid #ec4899' : '1px solid #e2e8f0'
                          }}
                        >
                          <div className="admin-story-card-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span
                                className="admin-story-card-badge"
                                style={{ background: '#fdf2f8', color: '#db2777' }}
                              >
                                Story #{index + 1}
                              </span>
                              <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                                {item.authorName || 'Untitled Traveller'}
                              </span>
                              {index === previewTestimonialIdx && (
                                <span style={{ fontSize: '10.5px', background: '#ec4899', color: '#fff', padding: '1px 7px', borderRadius: '999px', fontWeight: 600 }}>
                                  Active in Preview
                                </span>
                              )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <button
                                type="button"
                                onClick={() => setPreviewTestimonialIdx(index)}
                                className="admin-btn admin-btn-secondary"
                                style={{ fontSize: '11px', padding: '4px 10px' }}
                              >
                                Preview 👁
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveTestimonial(index)}
                                className="admin-icon-btn admin-icon-btn-danger"
                                title="Delete this story"
                              >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div className="admin-form-group">
                              <label className="admin-label">Quote Headline</label>
                              <textarea
                                value={item.quote || ''}
                                onChange={(e) => handleUpdateTestimonial(index, 'quote', e.target.value)}
                                className="admin-input"
                                rows={2}
                                placeholder="Slow trains, quiet villages and the best fondue..."
                                style={{ resize: 'vertical' }}
                              />
                            </div>

                            <div className="admin-form-grid">
                              <div className="admin-form-group">
                                <label className="admin-label">Author Name(s)</label>
                                <input
                                  type="text"
                                  value={item.authorName || ''}
                                  onChange={(e) => handleUpdateTestimonial(index, 'authorName', e.target.value)}
                                  className="admin-input"
                                  placeholder="e.g. Claire & Tom"
                                />
                              </div>

                              <div className="admin-form-group">
                                <label className="admin-label">Trip Location &amp; Year</label>
                                <input
                                  type="text"
                                  value={item.authorLocation || ''}
                                  onChange={(e) => handleUpdateTestimonial(index, 'authorLocation', e.target.value)}
                                  className="admin-input"
                                  placeholder="e.g. Swiss Alps · 2026"
                                />
                              </div>
                            </div>

                            <div className="admin-form-grid">
                              {/* Author Avatar URL */}
                              <div className="admin-form-group">
                                <label className="admin-label">Author Avatar URL</label>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%' }}>
                                  <img
                                    src={item.authorAvatar || 'https://framerusercontent.com/images/cwjju4oQ9SWH1nkXN95LfTNt94.jpg'}
                                    alt="Avatar"
                                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #cbd5e1', flexShrink: 0 }}
                                    onError={(e) => { e.target.style.opacity = '0.3'; }}
                                  />
                                  <input
                                    type="text"
                                    value={item.authorAvatar || ''}
                                    onChange={(e) => handleUpdateTestimonial(index, 'authorAvatar', e.target.value)}
                                    className="admin-input"
                                    placeholder="https://..."
                                    style={{ flex: 1, minWidth: 0 }}
                                  />
                                </div>
                              </div>

                              {/* Main Traveller Journey Photo URL */}
                              <div className="admin-form-group">
                                <label className="admin-label">Journey Photo URL</label>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%' }}>
                                  <img
                                    src={item.photoUrl || 'https://framerusercontent.com/images/OQDgLum0GfExeAWydcWtw46xVGk.jpg'}
                                    alt="Journey photo"
                                    style={{ width: '56px', height: '42px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #cbd5e1', flexShrink: 0 }}
                                    onError={(e) => { e.target.style.opacity = '0.3'; }}
                                  />
                                  <input
                                    type="text"
                                    value={item.photoUrl || ''}
                                    onChange={(e) => handleUpdateTestimonial(index, 'photoUrl', e.target.value)}
                                    className="admin-input"
                                    placeholder="https://..."
                                    style={{ flex: 1, minWidth: 0 }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Sample Photos chips */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                              <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 500 }}>Quick sample photos:</span>
                              {SAMPLE_TRAVEL_PHOTOS.slice(0, 4).map((sample, sIdx) => (
                                <button
                                  key={sIdx}
                                  type="button"
                                  onClick={() => handleUpdateTestimonial(index, 'photoUrl', sample)}
                                  className="admin-hero-preset-btn"
                                  style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '999px' }}
                                >
                                  Photo #{sIdx + 1}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleAddTestimonial}
                      className="admin-btn admin-btn-secondary"
                      style={{ marginTop: '16px', width: '100%', padding: '12px', borderStyle: 'dashed' }}
                    >
                      + Add Another Traveller Story
                    </button>
                  </div>

                  {/* Card 3: Save Banner Card */}
                  <div className="admin-card" style={{ background: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1e293b' }}>
                          Ready to publish Traveller Stories?
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          Saved updates take effect immediately on the homepage.
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={handleResetTestimonialsSettings}
                          className="admin-btn admin-btn-secondary"
                        >
                          Reset Defaults
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveTestimonialsSettings}
                          className="admin-btn admin-btn-primary"
                          style={{ padding: '12px 28px', fontSize: '14.5px' }}
                        >
                          Save Testimonials
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
