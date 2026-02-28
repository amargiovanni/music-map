# 🎵 Music Map — Project Spec for Claude Code

## What is this?

A beautiful, interactive web app called **"Music Map"**. Users pin songs to specific places on a map — answering the question: **"What does this place sound like?"**

Imagine walking through the streets of Naples and seeing that someone pinned "Napule è" by Pino Daniele right on the lungomare, or discovering that a stranger left a lo-fi track on that tiny café in Trastevere where you had the best espresso of your life. It's a collaborative, emotional, musical atlas of the world.

The vibe is **intimate, nostalgic, and beautifully designed** — like a love letter to places and music.

## Tech Stack

- **Astro** with TypeScript — static where possible, islands architecture for interactive parts
- **Tailwind CSS** — clean, modern, emotional design
- **Deployment target: Cloudflare Pages** with Workers for the backend/API
- Use Astro's Cloudflare adapter
- All API calls and data operations go through Cloudflare Workers (never expose keys client-side)
- Use a free/open map provider — Mapbox GL JS, MapLibre GL, or Leaflet with nice tiles. You decide what works best, but the map MUST look gorgeous (no ugly default OpenStreetMap tiles — use a beautiful style, something like CartoDB Positron/Dark Matter or Stadia Maps or similar)

## Core User Flow

### Exploring (No Account Needed)
1. User lands on the app — the entire screen IS the map, with a subtle UI overlay
2. The map shows pins/markers scattered around, each representing a song pinned to that location
3. Clusters appear when zoomed out, individual pins when zoomed in
4. Clicking a pin opens a card showing: song name, artist, a Spotify/YouTube embed or link, who pinned it, when, and an optional short note ("memory") from the user
5. User can browse, listen, and explore freely — no login needed

### Pinning a Song
1. User taps/clicks "Pin a song 🎵" floating action button
2. They either:
   - Drop a pin on the map manually (tap/click a location), OR
   - Use "Pin here 📍" to use their current GPS location
3. A form appears asking for:
   - **Song link** — paste a Spotify or YouTube URL (we extract title/artist/thumbnail automatically)
   - **Memory** (optional) — a short text (max 280 chars) explaining why this song belongs here. Examples: "Prima canzone che ho sentito in macchina con lei", "Questo bar mette sempre questa canzone il venerdì sera", "The song that was playing when I first saw the Colosseum"
   - **Display name** (optional) — defaults to "Anonymous"
4. Pin appears on the map immediately

### Discovering
- **"What's playing near me?"** — shows pins within a radius of the user's location, sorted by distance
- **Search by city/place** — jump to any location and see what's been pinned there
- **Search by song/artist** — find where a specific song has been pinned around the world
- **"Random pin 🎲"** — fly to a random pin somewhere in the world (delightful!)
- **"Most pinned"** — trending/popular songs and locations

## Design & UI

### General Vibe
- The map IS the app — full viewport, immersive
- UI elements float over the map: semi-transparent, glassmorphism, blurred backgrounds
- Warm, emotional, slightly dreamy feeling
- Think: if Spotify and Google Maps had a baby designed by someone who cries at sunsets
- Micro-animations everywhere — pins dropping, cards sliding in, smooth map transitions
- Typography should feel personal — not corporate

### Layout
- **The map takes 100% of the viewport** — always
- **Top bar** (floating, transparent): Logo/name on the left, search bar in the center, dark/light toggle + "Near me" button on the right
- **Bottom bar or side panel** (floating): shows info when a pin is selected — slides up on mobile, appears as a side panel on desktop
- **FAB (Floating Action Button)**: "Pin a song" button — always visible, bottom-right
- **Subtle pin counter**: "🎵 12,847 songs pinned worldwide" — small, in a corner

### Pin/Marker Design
- Custom map markers — not default boring pins
- Each marker should be a small music note icon or a mini vinyl record or a subtle colored dot
- When selected, the pin should "pulse" or glow
- Cluster markers should show the count and maybe a gradient based on density
- Pins could be subtly color-coded by genre (if detectable from Spotify metadata) or by recency

### Song Card (When Pin is Selected)
- Slides up from the bottom on mobile, appears as a floating card on desktop
- Shows:
  - Album art / thumbnail (from Spotify or YouTube)
  - Song title + artist name
  - Embedded player or prominent "Listen on Spotify / Watch on YouTube" button
  - The "memory" text if provided
  - Pinned by (display name) + date
  - Location name (reverse geocoded — e.g., "Via del Corso, Roma" or "Shibuya, Tokyo")
- Swipeable if multiple pins are stacked at the same location
- Dismiss by swiping down or clicking outside

### Pin a Song Modal/Sheet
- Clean form, not overwhelming
- Smart URL parsing: paste Spotify/YouTube link → auto-populate song info + thumbnail
- Map in the background should be interactive for placing the pin
- Character counter for the memory field
- Preview of how the pin will look before confirming
- Satisfying animation on successful pin (confetti? music notes floating up?)

### Light & Dark Mode
- **Automatic** based on system preference (`prefers-color-scheme`)
- Manual toggle in the top bar
- **Dark mode**: Dark map tiles, warm accent colors, glowing pins — should feel like a city at night with music playing
- **Light mode**: Light/watercolor map tiles, clean and airy — should feel like a sunny afternoon with headphones on
- The MAP TILES themselves should change between light and dark variants
- Smooth transition between modes
- Persist user preference

### Responsive Design
- Mobile-first — this app will be used mainly on phones while people are OUT in the world
- Touch-friendly: big tap targets, swipe gestures for cards
- The pin placement should work perfectly with touch — long press or tap-to-place
- Bottom sheet pattern on mobile for all panels (native app feeling)
- Desktop gets a wider side panel instead of bottom sheet
- Map controls should be accessible but not cluttering

## Data Architecture

### D1 Database

**pins** table:
- id (primary key)
- slug (unique, for sharing)
- latitude, longitude
- song_title, artist_name
- song_url (original Spotify/YouTube link)
- song_source (spotify | youtube)
- thumbnail_url
- spotify_embed_url or youtube_embed_id (for embeds)
- memory_text (nullable, max 280 chars)
- display_name (default: "Anonymous")
- city, country (reverse geocoded, for search/filtering)
- created_at
- locale (it | en)

**Location index** for geospatial queries — figure out the best approach for D1/Workers to efficiently query pins within a bounding box or radius.

### KV
- Cache for reverse geocoding results
- Cache for Spotify/YouTube metadata lookups
- Rate limiting counters

### R2
- Store generated OG images for shared pins

## API Endpoints (Workers)

- `GET /api/pins?bounds=lat1,lng1,lat2,lng2` — get pins within map viewport (bounding box)
- `GET /api/pins?near=lat,lng&radius=5km` — get pins near a location
- `GET /api/pins/:slug` — get a single pin by slug
- `GET /api/pins/search?q=query` — search by song, artist, or city
- `GET /api/pins/random` — get a random pin
- `GET /api/pins/trending` — most recent or popular pins
- `POST /api/pins` — create a new pin
- `GET /api/song-info?url=...` — parse a Spotify/YouTube URL and return metadata (title, artist, thumbnail, embed info)

## Song URL Parsing

When a user pastes a URL, the Worker should:

1. Detect if it's **Spotify** or **YouTube**
2. **Spotify**: Extract track ID, use Spotify Web API (or oEmbed endpoint) to get: track name, artist, album art URL, embed URL
3. **YouTube**: Extract video ID, use YouTube oEmbed or noembed.com to get: title, thumbnail, embed ID
4. Return structured metadata to the frontend for preview
5. Handle errors gracefully — invalid URLs, private content, etc.

## Sharing & Virality

Every pin should be shareable:

- Unique URL: `musicmap.app/pin/abc123` (or whatever the domain will be)
- **Dynamic OG image** for each pin: a card showing album art, song title, artist, the memory text, and a mini map snippet. This is ESSENTIAL for WhatsApp/Twitter/Telegram sharing previews
- Share buttons: Copy Link, WhatsApp, Telegram, X/Twitter, Instagram Stories (if possible)
- When someone opens a shared link, the map should fly to that pin's location with the card already open
- A CTA: "Discover more songs in [city name]" or "Pin your own song here"

## Internationalization

- Two languages: **Italian** (default) and **English**
- All UI strings should be translatable
- Language toggle in the UI
- The memory text stays in whatever language the user writes it in
- Reverse geocoded place names should match the selected language where possible

## Rate Limiting & Moderation

- Rate limit pin creation per IP (e.g., 10 pins per hour)
- Basic profanity filter on memory text and display names
- Report button on each pin for community moderation
- No explicit content in memories — keep it wholesome
- CORS properly configured

## Performance Goals

- Map should load fast — lazy load pins as the viewport moves
- Don't load all pins at once — load by viewport bounding box with debounce on map move
- Skeleton loaders for song cards
- Images (album art, thumbnails) lazy loaded
- The app should feel as smooth as a native app on mobile
- Target: Lighthouse 90+ on all metrics (yes, even with a full map library)

## Emotional Details (These Matter!)

- When you pin a song, a subtle music note animation floats up from the pin
- The "Random pin" button should trigger a smooth, cinematic map fly-to animation
- When browsing pins in a city, there should be a sense of discovery — like flipping through someone's mixtape
- Empty states should be inviting: "This place is silent... be the first to pin a song here 🎵"
- Error messages should be friendly: "Oops, that link doesn't seem to be a song. Try a Spotify or YouTube link!"
- The loading state for song URL parsing should show a vinyl record spinning

## Nice to Have (Future Iterations)

- "Playlist mode" — play all songs pinned in a neighborhood/city sequentially
- Heatmap layer showing music density
- Genre filter on the map
- Time travel slider — see what was pinned in different months/years
- User profiles — see all pins from one person
- "Musical walk" — generate a walking route that passes through nearby pins
- Collaborative playlists auto-generated from city pins
- Integration with Apple Music
- PWA with offline support for saved/favorited pins

## Project Structure Preferences

- Clean, well-organized Astro project structure
- Components should be small and reusable
- TypeScript strict mode
- Proper error handling with user-friendly, on-brand error messages
- Environment variables for all secrets and API keys
- README with clear setup and deployment instructions
- Wrangler configuration ready for Cloudflare deployment

## Important Notes

- This should be deployable to **Cloudflare Pages + Workers + D1** with minimal friction
- Keep dependencies lean — don't add bloat
- The map experience is EVERYTHING — if the map doesn't feel smooth and beautiful, nothing else matters
- Mobile experience is the priority — people will use this while walking around cities
- The emotional connection between music and places is the core value — every design decision should reinforce this

---

**Let's build this. Start with project scaffolding and the map experience (homepage with beautiful map, markers, and pin interaction). Then add the API layer and pin creation. Then sharing and discovery features. Ship it section by section.**
