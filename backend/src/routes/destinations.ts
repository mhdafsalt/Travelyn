import { Router, Request, Response } from 'express';
import destinationsData from '../data/destinations.json';
import categoriesData from '../data/categories.json';
import storiesData from '../data/stories.json';
import { Destination } from '../types';

const router = Router();
const destinations: Destination[] = destinationsData as Destination[];

// GET all destinations with filtering, search, and sorting
router.get('/', (req: Request, res: Response) => {
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

    let filtered = [...destinations];

    // Search query across title, country, region, tagline, description
    if (search && typeof search === 'string') {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        d.tagline.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (category && typeof category === 'string' && category !== 'all') {
      const cat = category.toLowerCase();
      filtered = filtered.filter(d =>
        d.category.some(c => c.toLowerCase() === cat)
      );
    }

    // Region filter
    if (region && typeof region === 'string') {
      filtered = filtered.filter(d => d.region.toLowerCase() === region.toLowerCase());
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
    res.status(500).json({ success: false, message: 'Error retrieving destinations', error });
  }
});

// GET categories
router.get('/meta/categories', (_req: Request, res: Response) => {
  res.json({ success: true, data: categoriesData });
});

// GET stories and reviews
router.get('/meta/stories', (_req: Request, res: Response) => {
  res.json({ success: true, data: storiesData });
});

// GET platform statistics
router.get('/meta/stats', (_req: Request, res: Response) => {
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
router.get('/:identifier', (req: Request, res: Response) => {
  const { identifier } = req.params;
  const match = destinations.find(
    d => d.slug.toLowerCase() === identifier.toLowerCase() || d.id === identifier
  );

  if (!match) {
    res.status(404).json({ success: false, message: `Destination not found for "${identifier}"` });
    return;
  }

  res.json({ success: true, data: match });
});

export default router;
