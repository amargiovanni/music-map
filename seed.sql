-- Music Map — Seed Data for Local Development
-- Run with: npm run db:seed
-- Prerequisites: npm run db:init && npm run db:migrate:v2

-- ── Dev user ──────────────────────────────────────────────────────────
INSERT OR IGNORE INTO users (id, auth_hash) VALUES ('dev-user-001', 'dev-local-hash-for-testing-only');

-- ── Sample pins across Italy ──────────────────────────────────────────
-- Pins 1-10 belong to the dev user; pins 11-25 are anonymous.
-- Thumbnail is a brand-colored SVG placeholder (works offline).

INSERT INTO pins (slug, latitude, longitude, song_title, artist_name, song_url, song_source, thumbnail_url, embed_url, memory_text, display_name, city, country, created_at, locale, user_id) VALUES
-- ── Dev user pins ─────────────────────────────────────────────────────
('seed000001', 41.8902, 12.4922,
 'Roma nun fa'' la stupida stasera', 'Lando Fiorini',
 'https://open.spotify.com/track/6nGeLlakfzlBcFdZXteDq8', 'spotify',
 'https://i.scdn.co/image/ab67616d0000b273c9b3b3c4e4f4e4a4b4c4d4e4', 'https://open.spotify.com/embed/track/6nGeLlakfzlBcFdZXteDq8',
 'Al Colosseo di notte, con questa canzone nelle orecchie. Magia pura.', 'Andrea',
 'Roma', 'Italia', datetime('now', '-30 days'), 'it', 'dev-user-001'),

('seed000002', 40.8359, 14.2488,
 'Napule è', 'Pino Daniele',
 'https://open.spotify.com/track/0qRR9d89hIS0MlMfsepBSR', 'spotify',
 'https://i.scdn.co/image/ab67616d0000b273a1b2c3d4e5f6a7b8c9d0e1f2', 'https://open.spotify.com/embed/track/0qRR9d89hIS0MlMfsepBSR',
 'Camminando sul lungomare al tramonto. Napoli è questa canzone.', 'Andrea',
 'Napoli', 'Italia', datetime('now', '-25 days'), 'it', 'dev-user-001'),

('seed000003', 45.4641, 9.1919,
 'Ragazzo fortunato', 'Jovanotti',
 'https://open.spotify.com/track/2bgTY4UwhfBYhGT4HUYStN', 'spotify',
 'https://i.scdn.co/image/ab67616d0000b273b1c2d3e4f5a6b7c8d9e0f1a2', 'https://open.spotify.com/embed/track/2bgTY4UwhfBYhGT4HUYStN',
 'Piazza Duomo sotto il sole. Mi sento un ragazzo fortunato.', 'Andrea',
 'Milano', 'Italia', datetime('now', '-20 days'), 'it', 'dev-user-001'),

('seed000004', 43.7680, 11.2531,
 'Firenze (canzone triste)', 'Ivan Graziani',
 'https://open.spotify.com/track/3FGd0WJN2pk2vJz7MH0a3a', 'spotify',
 'https://i.scdn.co/image/ab67616d0000b273c2d3e4f5a6b7c8d9e0f1a2b3', 'https://open.spotify.com/embed/track/3FGd0WJN2pk2vJz7MH0a3a',
 'Ponte Vecchio al crepuscolo. Il riflesso dell''Arno è oro.', 'Andrea',
 'Firenze', 'Italia', datetime('now', '-18 days'), 'it', 'dev-user-001'),

('seed000005', 45.4338, 12.3380,
 'Caruso', 'Lucio Dalla',
 'https://open.spotify.com/track/2SLwbpExuoBDZBpY4YG9Qh', 'spotify',
 'https://i.scdn.co/image/ab67616d0000b273d3e4f5a6b7c8d9e0f1a2b3c4', 'https://open.spotify.com/embed/track/2SLwbpExuoBDZBpY4YG9Qh',
 'Gondola, acqua alta, e la voce di Dalla. Venezia perfetta.', 'Andrea',
 'Venezia', 'Italia', datetime('now', '-15 days'), 'it', 'dev-user-001'),

('seed000006', 45.0703, 7.6869,
 'Il cielo in una stanza', 'Gino Paoli',
 'https://open.spotify.com/track/5HNCy40Ni5BZJFw1TKzRsC', 'spotify',
 'https://i.scdn.co/image/ab67616d0000b273e4f5a6b7c8d9e0f1a2b3c4d5', 'https://open.spotify.com/embed/track/5HNCy40Ni5BZJFw1TKzRsC',
 'Dalla Mole si vede tutta Torino. Il cielo in una stanza, davvero.', 'Andrea',
 'Torino', 'Italia', datetime('now', '-12 days'), 'it', 'dev-user-001'),

('seed000007', 44.4949, 11.3426,
 'Piazza Grande', 'Lucio Dalla',
 'https://open.spotify.com/track/3HnrHGLE9u2MjHtdobdHLe', 'spotify',
 'https://i.scdn.co/image/ab67616d0000b273f5a6b7c8d9e0f1a2b3c4d5e6', 'https://open.spotify.com/embed/track/3HnrHGLE9u2MjHtdobdHLe',
 'Piazza Maggiore, una sera d''estate con gli amici. Dalla aveva ragione.', 'Andrea',
 'Bologna', 'Italia', datetime('now', '-10 days'), 'it', 'dev-user-001'),

('seed000008', 44.4056, 8.9463,
 'Crêuza de mä', 'Fabrizio De André',
 'https://open.spotify.com/track/1rCIjnVqwHqNJNEqRbOLHR', 'spotify',
 'https://i.scdn.co/image/ab67616d0000b273a6b7c8d9e0f1a2b3c4d5e6f7', 'https://open.spotify.com/embed/track/1rCIjnVqwHqNJNEqRbOLHR',
 'Porto Antico, profumo di focaccia e mare. De André in cuffia.', 'Andrea',
 'Genova', 'Italia', datetime('now', '-8 days'), 'it', 'dev-user-001'),

('seed000009', 40.6340, 13.5738,
 'Con te partirò', 'Andrea Bocelli',
 'https://open.spotify.com/track/5NB4e8gMTsDsEbnRkafzJ5', 'spotify',
 'https://i.scdn.co/image/ab67616d0000b273b7c8d9e0f1a2b3c4d5e6f7a8', 'https://open.spotify.com/embed/track/5NB4e8gMTsDsEbnRkafzJ5',
 'Costiera Amalfitana al tramonto. Non servono parole.', 'Andrea',
 'Amalfi', 'Italia', datetime('now', '-5 days'), 'it', 'dev-user-001'),

('seed000010', 40.6664, 16.6041,
 'Volare', 'Domenico Modugno',
 'https://open.spotify.com/track/2jRGVl69u4tlhBPOYRFo7S', 'spotify',
 'https://i.scdn.co/image/ab67616d0000b273c8d9e0f1a2b3c4d5e6f7a8b9', 'https://open.spotify.com/embed/track/2jRGVl69u4tlhBPOYRFo7S',
 'I Sassi di Matera illuminati di sera. Volaaaare, oh oh!', 'Andrea',
 'Matera', 'Italia', datetime('now', '-3 days'), 'it', 'dev-user-001'),

-- ── Anonymous pins ────────────────────────────────────────────────────
('seed000011', 38.1157, 13.3615,
 'Ci vuole un fiore', 'Sergio Endrigo',
 'https://open.spotify.com/track/0HP6jPOVFDuXMXqGBmizJr', 'spotify',
 'https://i.scdn.co/image/ab67616d0000b273d9e0f1a2b3c4d5e6f7a8b9c0', 'https://open.spotify.com/embed/track/0HP6jPOVFDuXMXqGBmizJr',
 'Teatro Massimo, Palermo. Una canzone semplice per un posto magnifico.', 'Giulia',
 'Palermo', 'Italia', datetime('now', '-28 days'), 'it', NULL),

('seed000012', 41.1171, 16.8719,
 'La donna cannone', 'Francesco De Gregori',
 'https://open.spotify.com/track/5FVBNnHBfKfGBA4aMMUiJA', 'spotify',
 'https://i.scdn.co/image/ab67616d0000b273e0f1a2b3c4d5e6f7a8b9c0d1', 'https://open.spotify.com/embed/track/5FVBNnHBfKfGBA4aMMUiJA',
 'Lungomare di Bari, brezza e De Gregori. Perfetto.', 'Marco',
 'Bari', 'Italia', datetime('now', '-26 days'), 'it', NULL),

('seed000013', 37.5079, 15.0830,
 'Vieni via con me', 'Paolo Conte',
 'https://open.spotify.com/track/4h3qPOjkGjGY0PFDFNJkLR', 'spotify',
 'https://i.scdn.co/image/ab67616d0000b273f1a2b3c4d5e6f7a8b9c0d1e2', 'https://open.spotify.com/embed/track/4h3qPOjkGjGY0PFDFNJkLR',
 'Piazza Duomo, Catania. L''Etna sullo sfondo e Conte nelle orecchie.', 'Sofia',
 'Catania', 'Italia', datetime('now', '-24 days'), 'it', NULL),

('seed000014', 45.4384, 10.9916,
 'Nessun dorma', 'Luciano Pavarotti',
 'https://open.spotify.com/track/6oFMfReM5rKhQO3raNosTD', 'spotify',
 'https://i.scdn.co/image/ab67616d0000b273a2b3c4d5e6f7a8b9c0d1e2f3', 'https://open.spotify.com/embed/track/6oFMfReM5rKhQO3raNosTD',
 'L''Arena di Verona. Nessun dorma! Brividi.', 'Luca',
 'Verona', 'Italia', datetime('now', '-22 days'), 'it', NULL),

('seed000015', 45.6495, 13.7768,
 'La canzone di Marinella', 'Fabrizio De André',
 'https://open.spotify.com/track/1bfGREqvnKhTQJGT2xmQLH', 'spotify',
 'https://i.scdn.co/image/ab67616d0000b273b3c4d5e6f7a8b9c0d1e2f3a4', 'https://open.spotify.com/embed/track/1bfGREqvnKhTQJGT2xmQLH',
 'Piazza Unità d''Italia, il mare davanti. De André è poesia.', 'Elena',
 'Trieste', 'Italia', datetime('now', '-19 days'), 'it', NULL),

('seed000016', 39.2238, 9.1217,
 'Meraviglioso', 'Domenico Modugno',
 'https://open.spotify.com/track/7I8E3MH0JFJHnNsNPHIk7c', 'spotify',
 'https://i.scdn.co/image/ab67616d0000b273c4d5e6f7a8b9c0d1e2f3a4b5', 'https://open.spotify.com/embed/track/7I8E3MH0JFJHnNsNPHIk7c',
 'Bastione di Saint Remy, Cagliari. Vista meravigliosa, canzone meravigliosa.', 'Francesca',
 'Cagliari', 'Italia', datetime('now', '-17 days'), 'it', NULL),

('seed000017', 40.3516, 18.1750,
 'Azzurro', 'Adriano Celentano',
 'https://open.spotify.com/track/1F3yM4sOHB4GkBEDhNSq9G', 'spotify',
 'https://i.scdn.co/image/ab67616d0000b273d5e6f7a8b9c0d1e2f3a4b5c6', 'https://open.spotify.com/embed/track/1F3yM4sOHB4GkBEDhNSq9G',
 'Lecce barocca, sole a picco. Cerco un po'' d''azzurro...', 'Paolo',
 'Lecce', 'Italia', datetime('now', '-14 days'), 'it', NULL),

('seed000018', 43.1107, 12.3908,
 'L''anno che verrà', 'Lucio Dalla',
 'https://open.spotify.com/track/2gaRbBciyFnLzBU7xh4UEM', 'spotify',
 'https://i.scdn.co/image/ab67616d0000b273e6f7a8b9c0d1e2f3a4b5c6d7', 'https://open.spotify.com/embed/track/2gaRbBciyFnLzBU7xh4UEM',
 'Capodanno a Perugia. Quest''anno andrà tutto bene.', 'Chiara',
 'Perugia', 'Italia', datetime('now', '-11 days'), 'it', NULL),

('seed000019', 40.6263, 14.3756,
 'Torna a Surriento', 'Luciano Pavarotti',
 'https://open.spotify.com/track/55fhBAWOOFRCMGn2DVyRzN', 'spotify',
 'https://i.scdn.co/image/ab67616d0000b273f7a8b9c0d1e2f3a4b5c6d7e8', 'https://open.spotify.com/embed/track/55fhBAWOOFRCMGn2DVyRzN',
 'Marina Grande, Sorrento. Il profumo dei limoni nell''aria.', 'Roberto',
 'Sorrento', 'Italia', datetime('now', '-9 days'), 'it', NULL),

('seed000020', 37.8516, 15.2880,
 'Generale', 'Francesco De Gregori',
 'https://open.spotify.com/track/6V6GBmC7gqBP3WjT3K7RSR', 'spotify',
 'https://i.scdn.co/image/ab67616d0000b273a8b9c0d1e2f3a4b5c6d7e8f9', 'https://open.spotify.com/embed/track/6V6GBmC7gqBP3WjT3K7RSR',
 'Teatro Greco di Taormina. Qui la musica ha un suono diverso.', 'Alessia',
 'Taormina', 'Italia', datetime('now', '-7 days'), 'it', NULL),

('seed000021', 43.3188, 11.3308,
 'La cura', 'Franco Battiato',
 'https://open.spotify.com/track/6D25JNMS6yUj3FfIngoVPY', 'spotify',
 'https://i.scdn.co/image/ab67616d0000b273b9c0d1e2f3a4b5c6d7e8f9a0', 'https://open.spotify.com/embed/track/6D25JNMS6yUj3FfIngoVPY',
 'Piazza del Campo, Siena. Ti proteggerò dalle paure.', 'Valentina',
 'Siena', 'Italia', datetime('now', '-6 days'), 'it', NULL),

('seed000022', 44.4184, 12.2035,
 '4 marzo 1943', 'Lucio Dalla',
 'https://open.spotify.com/track/5e0RD9TBnPnNVJhQf6gU5k', 'spotify',
 'https://i.scdn.co/image/ab67616d0000b273c0d1e2f3a4b5c6d7e8f9a0b1', 'https://open.spotify.com/embed/track/5e0RD9TBnPnNVJhQf6gU5k',
 'Ravenna, mosaici e poesia. Dalla ci manca.', 'Giovanni',
 'Ravenna', 'Italia', datetime('now', '-4 days'), 'it', NULL),

('seed000023', 45.6983, 9.6773,
 'Ma il cielo è sempre più blu', 'Rino Gaetano',
 'https://open.spotify.com/track/6XpgywxU8W3urIpuSLjxVp', 'spotify',
 'https://i.scdn.co/image/ab67616d0000b273d1e2f3a4b5c6d7e8f9a0b1c2', 'https://open.spotify.com/embed/track/6XpgywxU8W3urIpuSLjxVp',
 'Bergamo Alta, nebbia e magia. Ma il cielo è sempre più blu!', 'Matteo',
 'Bergamo', 'Italia', datetime('now', '-2 days'), 'it', NULL),

('seed000024', 40.6280, 14.4849,
 'Estate', 'Bruno Martino',
 'https://open.spotify.com/track/4NpOrVqBfOoMHlpSCdRN6r', 'spotify',
 'https://i.scdn.co/image/ab67616d0000b273e2f3a4b5c6d7e8f9a0b1c2d3', 'https://open.spotify.com/embed/track/4NpOrVqBfOoMHlpSCdRN6r',
 'Positano, spiaggia e limoncello. Odio l''estate? No, la amo.', 'Sara',
 'Positano', 'Italia', datetime('now', '-1 days'), 'it', NULL),

('seed000025', 38.6729, 15.8988,
 'Splendido splendente', 'Donatella Rettore',
 'https://open.spotify.com/track/5F8fA5WjTKQNmBmblPsBml', 'spotify',
 'https://i.scdn.co/image/ab67616d0000b273f3a4b5c6d7e8f9a0b1c2d3e4', 'https://open.spotify.com/embed/track/5F8fA5WjTKQNmBmblPsBml',
 'Tropea, mare cristallino. Splendido splendente come questo posto.', 'Anna',
 'Tropea', 'Italia', datetime('now'), 'it', NULL);
