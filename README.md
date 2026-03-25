# 🌊 KustVåg – Surfprognos Halland & Skåne

A premium, Surfline-inspired PWA for surfers and beachgoers in Halland and Skåne, Sweden. Built with Next.js 15, TypeScript, Tailwind CSS, Recharts, and Leaflet.

![KustVåg Preview](./docs/preview.png)

## ✨ Features

- **Real-time surf conditions** – wave height, direction, period, swell, wind
- **8 surf spots** – Apelviken, Skrea Strand, Ringenäs, Tylösand, Skäret, Mölle, Kåseberga, Baskemölla
- **Smart surf rating engine** – 0–5 stars with spot-specific offshore/onshore wind logic
- **Beautiful compass roses** – animated SVG for wind and swell direction
- **7-day forecast grid** + 48h wave/swell charts (Recharts)
- **Tide chart** – real extremes via Stormglass or synthetic fallback
- **Interactive Leaflet map** – all spots with live rating pins
- **Dark ocean theme** – deep blue/teal aesthetic, mobile-first
- **PWA ready** – installable on Android/iOS, offline support
- **No API key required** to start – Open-Meteo is free and keyless

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/kustvag.git
cd kustvag

# 2. Install dependencies
npm install

# 3. Set up environment (optional – app works without any keys)
cp .env.example .env.local
# Edit .env.local if you have a Stormglass API key

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000
```

## 🌐 Deploy to Vercel (one click)

```bash
npm install -g vercel
vercel deploy
```

Or push to GitHub and connect your repo at [vercel.com](https://vercel.com).

Add your `STORMGLASS_API_KEY` as an environment variable in Vercel dashboard.

## 📱 Publish as Android App (PWA → Play Store)

1. Deploy to Vercel and get your URL (e.g. `https://kustvag.vercel.app`)
2. Visit [pwabuilder.com](https://www.pwabuilder.com)
3. Enter your URL → click **Start** → **Package for Stores** → **Android**
4. Download the `.aab` file
5. Upload to [Google Play Console](https://play.google.com/console)
6. Fill in store listing → submit for review

## 🗂️ Project Structure

```
kustvag/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── forecast/route.ts    # Proxies all API calls
│   │   ├── page.tsx                 # Main dashboard
│   │   ├── layout.tsx               # Root layout + fonts
│   │   └── globals.css              # Ocean theme CSS
│   ├── components/
│   │   ├── compass/
│   │   │   └── CompassRose.tsx      # Animated SVG compass
│   │   ├── charts/
│   │   │   ├── WaveChart.tsx        # Recharts wave/swell area chart
│   │   │   └── TideChart.tsx        # Tide height chart
│   │   ├── forecast/
│   │   │   ├── HeroConditions.tsx   # Current conditions hero
│   │   │   ├── DailyGrid.tsx        # 7-day card row
│   │   │   └── HourlyTable.tsx      # 24h table
│   │   ├── map/
│   │   │   └── SpotMap.tsx          # Leaflet map with rating pins
│   │   └── ui/
│   │       ├── Navbar.tsx           # Top nav + spot selector
│   │       ├── SpotSelector.tsx     # Dropdown with region filter
│   │       ├── RatingDisplay.tsx    # Stars + label
│   │       └── Skeleton.tsx         # Loading states
│   ├── hooks/
│   │   └── useForecast.ts           # SWR data fetching hook
│   ├── lib/
│   │   ├── spots.ts                 # All 8 spots with lat/lng
│   │   ├── api.ts                   # Open-Meteo + Stormglass fetcher
│   │   └── rating.ts                # Surf scoring engine + utils
│   └── types/
│       └── index.ts                 # TypeScript types
├── public/
│   ├── manifest.json                # PWA manifest
│   └── icons/                       # App icons
├── scripts/
│   └── generate-icons.js            # Icon generator
├── .env.example
├── next.config.js                   # PWA + Next.js config
├── tailwind.config.js               # Ocean color system
└── README.md
```

## 🌊 Surf Spots

| Spot | Region | Lat | Lng | Difficulty |
|------|--------|-----|-----|------------|
| Apelviken | Halland | 57.1167 | 12.2667 | Nybörjare |
| Skrea Strand | Halland | 56.9000 | 12.5000 | Nybörjare |
| Ringenäs | Halland | 56.8000 | 12.5500 | Medel |
| Tylösand | Halland | 56.6667 | 12.5000 | Nybörjare |
| Skäret | Halland | 56.5500 | 12.5500 | Medel |
| Mölle | Skåne | 56.2833 | 12.4833 | Avancerad |
| Kåseberga | Skåne | 55.3833 | 14.0500 | Medel |
| Baskemölla | Skåne | 55.5833 | 14.2167 | Nybörjare |

## 📡 Data Sources

| Source | What it provides | Key needed |
|--------|-----------------|------------|
| **Open-Meteo Marine** | Wave height, direction, period, swell | ❌ Free |
| **Open-Meteo Weather** | Wind, temp, precipitation, cloud cover | ❌ Free |
| **Stormglass** | Real water temp, tide extremes | ✅ Optional (10 req/day free) |

Data is cached for **30 minutes** server-side. The app auto-refreshes every 30 minutes.

## 🎯 Surf Rating System

```
0 – FLAT    < 0.2m waves, no surfing
1 – DÅLIG   Poor conditions (onshore wind, small waves)
2 – OKEJ    Surfable for beginners  
3 – BRA     Good conditions
4 – TOPPEN  Excellent conditions
5 – EPISK   Epic – perfect swell, offshore wind
```

Rating is calculated per spot using:
- Wave height (0–35 pts)
- Swell period (0–20 pts)  
- Wind speed + direction (offshore/onshore per spot, 0–25 pts)
- Swell direction (spot-specific optimal angles, 0–20 pts)

## 🎨 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (custom ocean color system)
- **Charts**: Recharts
- **Map**: Leaflet + React-Leaflet
- **Data fetching**: SWR
- **Fonts**: Barlow Condensed (display) + Inter (body)
- **Icons**: Lucide React
- **Date handling**: date-fns (sv locale)
- **PWA**: next-pwa

## 📄 License

MIT – free to use, modify, and deploy.

---

Built with ❤️ for surfers in Halland och Skåne 🤙
