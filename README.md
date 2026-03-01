# Music Map

**What does this place sound like?**

Music Map is a collaborative, emotional atlas of the world where people pin songs to places. Walk through the streets of Naples and discover someone pinned *Napule e'* by Pino Daniele on the lungomare. Find the lo-fi track a stranger left on that tiny cafe in Trastevere where you had the best espresso of your life.

Every pin is a memory. Every place has a soundtrack.

<p align="center">
  <strong>
    <a href="https://music-map.uk">Live App</a> &bull;
    <a href="#getting-started">Getting Started</a> &bull;
    <a href="#privacy-architecture">Privacy</a> &bull;
    <a href="#contributing">Contributing</a>
  </strong>
</p>

---

## How It Works

1. **Explore** -- open the map and browse thousands of songs pinned around the world. No account needed.
2. **Sign in** -- log in with Google or Apple to unlock personal features. We store zero personal data (see [Privacy Architecture](#privacy-architecture)).
3. **Pin a Song** -- paste a Spotify, YouTube, or Apple Music link, drop a pin on the map, and leave a short memory about why that song belongs there.
4. **Your Map** -- see all your pins in one place. Your soundtrack, your memories.
5. **Share** -- every pin has a unique link with a beautiful social preview. Send it anywhere.

## Features

- Full-viewport interactive map with CartoDB tiles (light and dark)
- GeoJSON clustering that scales from 10 to 100,000 pins
- Spotify, YouTube, and Apple Music metadata parsing (no API keys needed)
- **Google and Apple Sign-In** with zero-knowledge authentication
- **Privacy by design** -- admins cannot link pins to real people
- Personal listening map ("My Pins") for authenticated users
- Landing page with value props for new visitors
- Glassmorphism UI with smooth animations and micro-interactions
- Mobile-first bottom sheets, touch-friendly pin placement
- Dark mode with system preference detection and manual toggle
- Italian and English localization
- Server-side rendered pin pages with Open Graph meta tags
- Reverse geocoding via OpenStreetMap Nominatim
- Full-text search across songs, artists, and cities
- Rate limiting and content moderation
- Complete privacy policy (IT/EN)
- Random pin with cinematic fly-to animation

## Privacy Architecture

Music Map is designed so that **even the project operators cannot link pins to real people**. Here's how:

### Zero-Knowledge Authentication

1. OAuth with Google/Apple requests **only the `openid` scope** -- no email, no name, no profile photo.
2. The provider returns a technical `sub` (subject identifier).
3. This `sub` is immediately **hashed with SHA-256 + a secret pepper** before storage.
4. The pepper is a Cloudflare Worker Secret -- not in the database, not in the source code, not in any logs.

### What's in the database

| Table | Contains | Does NOT contain |
|-------|----------|------------------|
| `users` | Random UUID, hashed auth subject, creation date | Email, name, profile, OAuth tokens |
| `pins` | Coordinates, song link, optional display name, optional user UUID | IP address, real name, email |

### The guarantee

A full database dump reveals only random UUIDs and hex hashes. Without the pepper (which exists only as an ephemeral Worker Secret), the hashes cannot be reversed. An administrator with complete infrastructure access **cannot determine which real person created which pins**.

The entire codebase is open source -- verify these claims yourself by reading `src/lib/auth.ts` and `schema-v2.sql`.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Astro](https://astro.build) 4 with hybrid rendering |
| UI | [React](https://react.dev) 18 (islands architecture) |
| Map | [MapLibre GL JS](https://maplibre.org) + [react-map-gl](https://visgl.github.io/react-map-gl/) |
| Tiles | [CartoDB](https://carto.com/basemaps/) Positron (light) / Dark Matter (dark) |
| Styling | [Tailwind CSS](https://tailwindcss.com) 3 |
| Database | [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) with FTS5 |
| Cache / Sessions | [Cloudflare KV](https://developers.cloudflare.com/kv/) |
| Storage | [Cloudflare R2](https://developers.cloudflare.com/r2/) |
| Auth | OAuth 2.0 (Google, Apple) with Web Crypto API |
| Deployment | [Cloudflare Pages](https://pages.cloudflare.com) + Workers |

## Project Structure

```
src/
  components/
    map/              Map engine (MapView, markers, clustering, animations)
    ui/               Reusable primitives (GlassPanel, BottomSheet, VinylSpinner)
    MusicMapApp.tsx    Main orchestrator -- owns all application state
    TopBar.tsx         Search, theme/language toggles, auth menu
    SongCard.tsx       Pin detail view with embedded player
    PinForm.tsx        Multi-step pin creation flow
    FAB.tsx            Floating action button
    LandingOverlay.tsx Scroll-based landing page for new visitors
    LoginPrompt.tsx    Auth modal when unauthenticated user tries to pin
    MyPinsPanel.tsx    Personal pin collection panel
    PrivacyContent.tsx Privacy policy page content (IT/EN)
    ShareButtons.tsx   Social sharing (WhatsApp, Telegram, X, copy link)
    SearchPanel.tsx    Search results dropdown
    PinCounter.tsx     Animated global pin counter
    EmptyState.tsx     Friendly empty state message
  hooks/
    useTheme.ts        Dark/light mode with localStorage
    useLanguage.ts     IT/EN with localStorage
    useGeolocation.ts  Browser geolocation API
    useAuth.ts         Authentication state + login/logout
  pages/
    api/auth/         OAuth routes (Google, Apple, logout, session check)
    api/pins/         CRUD endpoints (list, create, search, random, trending, mine)
    api/song-info.ts  Spotify/YouTube/Apple Music metadata parser
    api/count.ts      Global pin count
    pin/[slug].astro  Shared pin page with OG tags (SSR)
    privacy.astro     Privacy policy page
    index.astro       Home page (SSR, auth-aware)
  lib/
    auth.ts           Auth: hashing, sessions, cookies, user management
    db.ts             D1 database queries
    api.ts            Client-side API helpers
    song-parser.ts    Song URL parsing + metadata fetching
    geocode.ts        Reverse geocoding
    rate-limit.ts     IP-based rate limiting
    profanity.ts      Content moderation
    constants.ts      Shared constants
  i18n/
    translations.ts   UI translations (IT/EN)
    privacy.ts        Privacy policy full text (IT/EN)
  middleware.ts       Session resolution on every request
  types/              Shared TypeScript interfaces
  styles/             Global CSS with glassmorphism utilities
schema.sql            D1 database schema v1
schema-v2.sql         Schema migration: users table + user_id on pins
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
npm run db:migrate:v2
```

### Configure secrets for local development

Create a `.dev.vars` file (gitignored) with:

```
AUTH_PEPPER=your-random-64-char-hex-string-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
APPLE_CLIENT_ID=your-apple-service-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY=your-apple-private-key-pem
```

### Start the dev server

```bash
npm run dev
```

Open **http://localhost:4321** in your browser.

### Build for production

```bash
npm run build
```

## Deployment

### 1. Create Cloudflare resources

```bash
npx wrangler d1 create music-map-db
npx wrangler kv namespace create KV
npx wrangler r2 bucket create music-map-r2
```

### 2. Update `wrangler.toml`

Replace the placeholder IDs with the real ones from the commands above.

### 3. Initialize the remote database

```bash
npx wrangler d1 execute music-map-db --remote --file=schema.sql
npx wrangler d1 execute music-map-db --remote --file=schema-v2.sql
```

### 4. Set production secrets

```bash
npx wrangler secret put AUTH_PEPPER
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
npx wrangler secret put APPLE_CLIENT_ID
npx wrangler secret put APPLE_TEAM_ID
npx wrangler secret put APPLE_KEY_ID
npx wrangler secret put APPLE_PRIVATE_KEY
```

### 5. Configure OAuth redirect URIs

**Google Cloud Console:**
- Authorized redirect URI: `https://your-domain.com/api/auth/google/callback`

**Apple Developer Portal:**
- Return URL: `https://your-domain.com/api/auth/apple/callback`

### 6. Deploy

Push to GitHub for automatic deployment via Cloudflare Pages, or:

```bash
npx wrangler pages deploy dist/
```

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/pins?bounds=s,w,n,e` | No | Pins within a bounding box |
| `GET` | `/api/pins?near=lat,lng&radius=5km` | No | Pins near a location |
| `GET` | `/api/pins/:slug` | No | Single pin by slug |
| `GET` | `/api/pins/search?q=query` | No | Search by song, artist, or city |
| `GET` | `/api/pins/random` | No | Random pin |
| `GET` | `/api/pins/trending` | No | Most recent pins |
| `POST` | `/api/pins` | Optional | Create a new pin (user_id linked if authenticated) |
| `GET` | `/api/pins/mine` | Yes | All pins by the authenticated user |
| `GET` | `/api/song-info?url=...` | No | Parse Spotify/YouTube/Apple Music metadata |
| `GET` | `/api/count` | No | Total pin count |
| `GET` | `/api/auth/google/login` | No | Start Google OAuth flow |
| `GET` | `/api/auth/apple/login` | No | Start Apple OAuth flow |
| `POST` | `/api/auth/logout` | Yes | End session |
| `GET` | `/api/auth/me` | No | Check authentication status |

## Design Philosophy

- **The map IS the app.** Everything floats over it. No chrome, no sidebar navigation, no page transitions.
- **Mobile first.** Touch targets are large, gestures are natural, bottom sheets feel native.
- **Emotionally warm.** Glassmorphism with warm amber accents, DM Sans typography, subtle animations.
- **Privacy is not optional.** Zero-knowledge auth by default. No email, no tracking, no analytics. Open source for full verifiability.
- **Low friction.** The map is always visible. Signing in unlocks personal features but is never required to explore.

## Roadmap

- [x] Apple Music integration
- [x] User authentication (Google + Apple)
- [x] Personal pin collections ("My Pins")
- [x] Privacy policy
- [x] Landing page
- [ ] Playlist mode -- play all songs pinned in a neighborhood
- [ ] Heatmap layer showing music density
- [ ] Genre filter on the map
- [ ] Time travel slider -- see pins from different months/years
- [ ] Musical walk -- generate a route through nearby pins
- [ ] PWA with offline support

## Contributing

Contributions are welcome! Please read the [Contributing Guide](CONTRIBUTING.md) before submitting a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  <em>Every place has a soundtrack. What does yours sound like?</em>
</p>
