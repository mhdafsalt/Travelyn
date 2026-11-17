const { Router } = require('express');
const mongoose = require('mongoose');
const Destination = require('../models/Destination');
const destinationsData = require('../data/destinations.json');
const categoriesData = require('../data/categories.json');
const storiesData = require('../data/stories.json');

const router = Router();

// GET all destinations with filtering, search, and sorting
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      region,
      minPrice,
      maxPrice,
      sort,
      featured
    } = req.query;

    let items;
    if (mongoose.connection.readyState === 1) {
      items = await Destination.find().lean();
      if (!items || items.length === 0) {
        items = [...destinationsData];
      }
    } else {
      items = [...destinationsData];
    }

    let filtered = [...items];

    // Search query across title, country, region, tagline, description
    if (search && typeof search === 'string') {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(d =>
        (d.title && d.title.toLowerCase().includes(q)) ||
        (d.country && d.country.toLowerCase().includes(q)) ||
        (d.region && d.region.toLowerCase().includes(q)) ||
        (d.tagline && d.tagline.toLowerCase().includes(q)) ||
        (d.description && d.description.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (category && typeof category === 'string' && category !== 'all') {
      const cat = category.toLowerCase();
      filtered = filtered.filter(d =>
        Array.isArray(d.category) && d.category.some(c => c.toLowerCase() === cat)
      );
    }

    // Region filter
    if (region && typeof region === 'string') {
      filtered = filtered.filter(d => d.region && d.region.toLowerCase() === region.toLowerCase());
    }

    // Price range filters
    if (minPrice) {
      const min = Number(minPrice);
      if (!isNaN(min)) {
        filtered = filtered.filter(d => d.price >= min);
      }
    }
    if (maxPrice) {
      const max = Number(maxPrice);
      if (!isNaN(max)) {
        filtered = filtered.filter(d => d.price <= max);
      }
    }

    // Featured only
    if (featured === 'true') {
      filtered = filtered.filter(d => d.featured);
    }

    // Sorting
    if (sort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'duration') {
      filtered.sort((a, b) => a.durationDays - b.durationDays);
    }

    res.json({
      success: true,
      total: filtered.length,
      data: filtered
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving destinations', error: error.message });
  }
});

// GET categories
router.get('/meta/categories', (_req, res) => {
  res.json({ success: true, data: categoriesData });
});

// GET stories and reviews
router.get('/meta/stories', (_req, res) => {
  res.json({ success: true, data: storiesData });
});

// GET platform statistics
router.get('/meta/stats', (_req, res) => {
  res.json({
    success: true,
    data: {
      destinationsCount: "250+",
      happyTravellers: "50K+",
      curatedExperiences: "1,200+",
      averageRating: "4.9/5",
      totalReviews: "2,400+",
      inspiredThisMonth: "12K+"
    }
  });
});

// GET destination by slug or ID
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const idStr = Array.isArray(identifier) ? identifier[0] : identifier;

    let match = null;
    if (mongoose.connection.readyState === 1) {
      match = await Destination.findOne({
        $or: [
          { slug: idStr.toLowerCase() },
          { id: idStr }
        ]
      }).lean();
    }

    if (!match) {
      match = destinationsData.find(
        d => d.slug.toLowerCase() === idStr.toLowerCase() || d.id === idStr
      );
    }

    if (!match) {
      res.status(404).json({ success: false, message: `Destination not found for "${identifier}"` });
      return;
    }

    res.json({ success: true, data: match });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving destination', error: error.message });
  }
});

// DELETE destination by slug or ID
router.delete('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const idStr = Array.isArray(identifier) ? identifier[0] : identifier;

    if (mongoose.connection.readyState === 1) {
      await Destination.deleteOne({
        $or: [
          { slug: idStr.toLowerCase() },
          { id: idStr }
        ]
      });
    }

    res.json({ success: true, message: `Destination "${identifier}" removed.` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting destination', error: error.message });
  }
});

module.exports = router;
