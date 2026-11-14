# Voyara — Tailor-Made Luxury Travel & Journeys

A fullstack luxury travel platform inspired by **Voyara**, crafted with **Next.js (App Router)** for the frontend and **Node.js / Express (TypeScript)** for the backend REST API.

---

## 🌟 Highlights & Key Features

### 🎨 Frontend (Next.js 15 / React 19)
- **Faithful Luxury Design System**: Custom Vanilla CSS tokens with ecru/cream palette (`#faf9f6`), warm dark charcoal typography (`#1e262a`), frosted glassmorphism pills, slate blue accents (`#5b8291`), and terracotta highlights (`#ff4f00`).
- **Floating Luxury Navbar**: Frosted glass capsule logo mark (`V`), brand typography, navigation links, and mobile drawer.
- **Interactive Hero Search Capsule**:
  - **Where**: Live destination search & quick selector (Santorini, Kyoto, Maldives, Swiss Alps, Patagonia, Amalfi Coast, Lake Como, Marrakech).
  - **When**: Season & travel timing windows.
  - **Who**: Interactive adults & children guest counter.
- **Animated Categories**: Trending, Islands, Nature, Culture, Romantic, Adventure, Wellness, Luxury with active underline indicators.
- **Destination Cards**:
  - Hover zoom transitions with curved border radius (`22px`).
  - Region badges (Europe, Asia, Indian Ocean, South America, Africa).
  - Save to wishlist toggle with animated heart icon.
  - Quick Inquire modal trigger.
- **Why Book With Us Perks**: 4 luxury guarantees ("Free changes", "Pay in 3", "Price promise", "24/7 concierge") with slate blue circular badges.
- **Atmospheric Immersive Slider**: Auto-cycling alpine showcase (Zermatt, Above the clouds, Glacier Express, Alpine lakes) with linear progress bar indicators and manual tabs.
- **Dual Mountain Story Showcase**: Split narrative ("Mornings above the clouds" & "Evenings by the fire").
- **Breathe Parallax Banner**: "Slow down. The world will wait." with ambient vignette lighting.
- **Platform Numbers & Testimonials**: 250+ destinations, 50K+ travellers, 1,200+ experiences, 4.9/5 verified reviews rating badge and traveler quote from Claire & Tom.
- **Interactive Booking Modal**: Real-time total price calculator, suite tier selector, dates, and direct API submission.
- **Pages Included**:
  - `/` (Home landing page)
  - `/destinations` (Searchable catalog with region, theme, and price filters)
  - `/destinations/[slug]` (Deep-dive itinerary, highlights, and sticky booking card)
  - `/experiences` (Curated travel style collections)
  - `/about` (Voyara studio manifesto, founding history in Lisbon)
  - `/contact` (Bespoke journey inquiry concierge form)

### 🚀 Backend (Node.js & Express in TypeScript)
- Standalone TypeScript REST API server in `backend/` with structured routes and data stores.
- **REST API Endpoints**:
  - `GET /api/destinations` — Search, filter by category/region/price, and sort.
  - `GET /api/destinations/:slug` — Full destination details, day-by-day itinerary, and inclusions.
  - `GET /api/destinations/meta/categories` — Travel themes and count.
  - `GET /api/destinations/meta/stories` — Traveler reviews and quotes.
  - `GET /api/destinations/meta/stats` — Live platform stats.
  - `POST /api/bookings` — Create and store new journey reservations.
  - `GET /api/bookings` — Retrieve current reservations.
  - `POST /api/newsletter/subscribe` — Newsletter email subscriptions.
  - `POST /api/contact` — Bespoke journey inquiry submissions.
  - `GET /api/health` — API health check.
- **Hybrid Redundancy**: Frontend includes built-in Next.js App Router API Route Handlers (`/api/...`) and automatic fallback seed data, meaning the frontend works both standalone and connected to the Express backend!

---

## 📁 Repository Structure

```
Travel/
├── package.json                 # Root script coordinator
├── README.md                    # Documentation
├── backend/                     # Node.js + Express TypeScript API
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── server.ts            # Express server entry point
│       ├── data/                # JSON database stores
│       │   ├── destinations.json
│       │   ├── categories.json
│       │   ├── stories.json
│       │   └── bookings.json
│       ├── routes/              # Express API route handlers
│       │   ├── destinations.ts
│       │   ├── bookings.ts
│       │   ├── newsletter.ts
│       │   └── contact.ts
│       └── types/               # TypeScript interfaces
│           └── index.ts
└── frontend/                    # Next.js App Router Frontend
    ├── package.json
    ├── tsconfig.json
    ├── next.config.js
    └── src/
        ├── app/
        │   ├── globals.css      # Luxury design tokens & animations
        │   ├── layout.tsx       # Root layout, fonts & navigation
        │   ├── page.tsx         # Main Voyara homepage
        │   ├── destinations/
        │   │   ├── page.tsx     # Destination catalog
        │   │   └── [slug]/
        │   │       └── page.tsx # Destination detail with itinerary
        │   ├── experiences/
        │   │   └── page.tsx     # Curated experience collections
        │   ├── about/
        │   │   └── page.tsx     # Voyara story & philosophy
        │   ├── contact/
        │   │   └── page.tsx     # Concierge inquiry form
        │   └── api/             # Built-in Next.js route handlers
        ├── components/
        │   ├── Navbar.tsx
        │   ├── HeroSearch.tsx
        │   ├── CategoryBar.tsx
        │   ├── DestinationCard.tsx
        │   ├── PerksSection.tsx
        │   ├── ImmersiveSlider.tsx
        │   ├── StorySection.tsx
        │   ├── StatsSection.tsx
        │   ├── TestimonialsSection.tsx
        │   ├── NewsletterSection.tsx
        │   ├── Footer.tsx
        │   └── BookingModal.tsx
        ├── lib/
        │   ├── api.ts           # Unified API client
        │   └── data.ts          # Static seed data
        └── types/
            └── index.ts
```

---

## ⚡ Quick Start

### 1. Install All Dependencies

From the root project directory:
```bash
npm run install:all
```
*(Or navigate into `frontend` and `backend` separately and run `npm install`)*

### 2. Run Both Frontend and Backend Concurrently

```bash
npm run dev
```

- **Frontend**: Runs on [http://localhost:3000](http://localhost:3000)
- **Backend API**: Runs on [http://localhost:5000](http://localhost:5000)

### 3. Or Run Individually

**Frontend only:**
```bash
cd frontend
npm install
npm run dev
```
*(Opens on `http://localhost:3000` with instant local fallback data)*

**Backend only:**
```bash
cd backend
npm install
npm run dev
```
*(Runs on `http://localhost:5000/api`)*

---

## 🧪 Testing the API

- **Health Check**: `GET http://localhost:5000/api/health`
- **Search Destinations**: `GET http://localhost:5000/api/destinations?search=Alps`
- **Filter by Category**: `GET http://localhost:5000/api/destinations?category=romantic`
- **Reserve a Journey**:
  ```bash
  POST http://localhost:5000/api/bookings
  Content-Type: application/json

  {
    "destinationId": "dest-1",
    "destinationTitle": "Santorini",
    "travelerName": "Julian Vance",
    "travelerEmail": "julian@voyara.travel",
    "startDate": "2026-07-10",
    "guests": 2,
    "roomType": "Caldera Sunset Cave Suite"
  }
  ```

---

## 💎 Design Credits & Inspiration
Inspired by the **Voyara Luxury Travel Studio** aesthetic (Est. 2014 — Lisbon).
