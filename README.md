# Music Map

**What does this place sound like?**

Music Map is a collaborative, emotional atlas of the world where people pin songs to places. Walk through the streets of Naples and discover someone pinned *Napule e'* by Pino Daniele on the lungomare. Find the lo-fi track a stranger left on that tiny cafe in Trastevere where you had the best espresso of your life.

Every pin is a memory. Every place has a soundtrack.

<p align="center">
  <strong>
    <a href="https://musicmap.app">Live App</a> &bull;
    <a href="#getting-started">Getting Started</a> &bull;
    <a href="#contributing">Contributing</a>
  </strong>
</p>

---

## How It Works

1. **Explore** -- open the map and browse thousands of songs pinned around the world. No account needed.
2. **Pin a Song** -- paste a Spotify or YouTube link, drop a pin on the map, and leave a short memory about why that song belongs there.
3. **Discover** -- search by city, artist, or song. Tap "Random Pin" and fly to a surprise somewhere on the planet. See what's playing near you.
4. **Share** -- every pin has a unique link with a beautiful social preview. Send it on WhatsApp, Telegram, or X and let others feel the music.

## Features

- Full-viewport interactive map with gorgeous CartoDB tiles (light and dark)
- GeoJSON clustering that scales from 10 to 100,000 pins
- Spotify and YouTube metadata parsing via oEmbed (no API keys needed)
- Glassmorphism UI with smooth animations and micro-interactions
- Mobile-first bottom sheets, touch-friendly pin placement, swipe gestures
- Dark mode with automatic system preference detection and manual toggle
- Italian and English localization with one-tap language switch
- Server-side rendered pin pages with Open Graph meta tags for rich link previews
- Reverse geocoding via OpenStreetMap Nominatim
- Full-text search across songs, artists, and cities
- Rate limiting and basic content moderation
- Random pin with cinematic fly-to animation

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Astro](https://astro.build) 4 with hybrid rendering |
| UI | [React](https://react.dev) 18 (islands architecture) |
| Map | [MapLibre GL JS](https://maplibre.org) + [react-map-gl](https://visgl.github.io/react-map-gl/) |
| Tiles | [CartoDB](https://carto.com/basemaps/) Positron (light) / Dark Matter (dark) |
| Styling | [Tailwind CSS](https://tailwindcss.com) 3 |
| Database | [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) with FTS5 |
| Cache | [Cloudflare KV](https://developers.cloudflare.com/kv/) |
| Storage | [Cloudflare R2](https://developers.cloudflare.com/r2/) |
| Deployment | [Cloudflare Pages](https://pages.cloudflare.com) + Workers |

## Project Structure

```
src/
  components/
    map/              Map engine (MapView, markers, clustering, animations)
    ui/               Reusable primitives (GlassPanel, BottomSheet, VinylSpinner)
    MusicMapApp.tsx    Main orchestrator -- owns all application state
    TopBar.tsx         Search, theme/language toggles, navigation
    SongCard.tsx       Pin detail view with embedded player
    PinForm.tsx        Multi-step pin creation flow
    FAB.tsx            Floating action button
    ShareButtons.tsx   Social sharing (WhatsApp, Telegram, X, copy link)
    SearchPanel.tsx    Search results dropdown
    PinCounter.tsx     Animated global pin counter
    EmptyState.tsx     Friendly empty state message
  hooks/              useTheme, useLanguage, useGeolocation
  pages/
    api/pins/         CRUD endpoints (list, create, search, random, trending)
    api/song-info.ts  Spotify/YouTube metadata parser
    api/count.ts      Global pin count
    pin/[slug].astro  Shared pin page with OG tags (SSR)
    index.astro       Home page (static)
  lib/                API client, DB helpers, geocoding, rate limiting, profanity filter
  i18n/               Italian and English translations
  types/              Shared TypeScript interfaces
  styles/             Global CSS with glassmorphism utilities
schema.sql            D1 database schema with FTS5
wrangler.toml         Cloudflare deployment configuration
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [npm](https://www.npmjs.com) 9+
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (for local D1)

### Install

```bash
git clone https://github.com/amargiovanni/music-map.git
cd music-map
npm install
```

### Initialize the local database

```bash
npm run db:init
```

This creates a local D1 database and runs `schema.sql` to set up the `pins` table with indexes and full-text search.

### Start the dev server

```bash
npm run dev
```

Open **http://localhost:4321** in your browser. The map loads immediately. Try pinning a song!

### Build for production

```bash
npm run build
```

The output goes to `dist/` and is ready for Cloudflare Pages.

## Deployment

### 1. Create Cloudflare resources

```bash
# D1 database
npx wrangler d1 create music-map-db

# KV namespace
npx wrangler kv namespace create KV

# R2 bucket (optional, for OG images)
npx wrangler r2 bucket create music-map-r2
```

### 2. Update `wrangler.toml`

Replace the placeholder IDs with the real ones from the commands above.

### 3. Initialize the remote database

```bash
npx wrangler d1 execute music-map-db --remote --file=schema.sql
```

### 4. Deploy

```bash
npx wrangler pages deploy dist/
```

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/pins?bounds=s,w,n,e` | Pins within a bounding box |
| `GET` | `/api/pins?near=lat,lng&radius=5km` | Pins near a location |
| `GET` | `/api/pins/:slug` | Single pin by slug |
| `GET` | `/api/pins/search?q=query` | Search by song, artist, or city |
| `GET` | `/api/pins/random` | Random pin |
| `GET` | `/api/pins/trending` | Most recent pins |
| `POST` | `/api/pins` | Create a new pin |
| `GET` | `/api/song-info?url=...` | Parse Spotify/YouTube metadata |
| `GET` | `/api/count` | Total pin count |

### Create a Pin

```bash
curl -X POST http://localhost:4321/api/pins \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 40.8518,
    "longitude": 14.2681,
    "song_url": "https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp",
    "memory_text": "The song that was playing when I first saw Vesuvius",
    "display_name": "Andrea",
    "locale": "en"
  }'
```

## Design Philosophy

- **The map IS the app.** Everything floats over it. No chrome, no sidebar navigation, no page transitions. Just music and places.
- **Mobile first.** People use this while walking through cities. Touch targets are large, gestures are natural, bottom sheets feel native.
- **Emotionally warm.** Glassmorphism with warm amber accents, DM Sans typography, subtle animations. Like a love letter to places and music.
- **No friction.** No sign-up, no login, no paywall. Paste a link, drop a pin, write a memory. Done.

## Roadmap

- [ ] Playlist mode -- play all songs pinned in a neighborhood
- [ ] Heatmap layer showing music density
- [ ] Genre filter on the map
- [ ] Time travel slider -- see pins from different months/years
- [ ] User profiles -- see all pins from one person
- [ ] Musical walk -- generate a route through nearby pins
- [ ] PWA with offline support
- [ ] Apple Music integration

## Contributing

Contributions are welcome! Please read the [Contributing Guide](CONTRIBUTING.md) before submitting a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  <em>Every place has a soundtrack. What does yours sound like?</em>
</p>
