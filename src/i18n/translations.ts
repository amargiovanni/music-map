import type { Language } from '../types';

const translations = {
  it: {
    // Top bar
    'search.placeholder': 'Cerca canzoni, artisti, luoghi...',
    'search.nearMe': 'Vicino a me',

    // FAB
    'fab.pinSong': 'Pinna una canzone',

    // Pin form
    'pinForm.title': 'Pinna una canzone',
    'pinForm.songUrl': 'Link Spotify o YouTube',
    'pinForm.songUrlPlaceholder': 'Incolla un link Spotify o YouTube...',
    'pinForm.memory': 'Un ricordo',
    'pinForm.memoryPlaceholder': 'Perché questa canzone appartiene a questo posto?',
    'pinForm.displayName': 'Il tuo nome',
    'pinForm.displayNamePlaceholder': 'Anonimo',
    'pinForm.pinHere': 'Pinna qui',
    'pinForm.chooseOnMap': 'Scegli sulla mappa',
    'pinForm.useMyLocation': 'Usa la mia posizione',
    'pinForm.confirm': 'Pinna!',
    'pinForm.cancel': 'Annulla',
    'pinForm.loading': 'Caricamento info canzone...',
    'pinForm.charCount': '{count}/280',
    'pinForm.success': 'Canzone pinnata!',

    // Song card
    'songCard.pinnedBy': 'Pinnata da {name}',
    'songCard.listenOnSpotify': 'Ascolta su Spotify',
    'songCard.watchOnYouTube': 'Guarda su YouTube',
    'songCard.share': 'Condividi',
    'songCard.report': 'Segnala',

    // Discovery
    'discovery.nearMe': 'Vicino a me',
    'discovery.random': 'Pin casuale',
    'discovery.trending': 'Più pinnate',
    'discovery.whatsPlaying': 'Cosa si ascolta qui vicino?',

    // Share
    'share.title': 'Condividi questo pin',
    'share.copyLink': 'Copia link',
    'share.copied': 'Link copiato!',

    // Empty states
    'empty.noPins': 'Questo posto è silenzioso... sii il primo a pinnare una canzone qui',
    'empty.noResults': 'Nessun risultato trovato',

    // Errors
    'error.invalidUrl': 'Oops, quel link non sembra essere una canzone. Prova con un link Spotify o YouTube!',
    'error.generic': 'Qualcosa è andato storto. Riprova!',
    'error.rateLimit': 'Piano piano! Hai pinnato troppe canzoni. Riprova tra poco.',
    'error.locationDenied': 'Accesso alla posizione negato. Puoi scegliere un punto sulla mappa.',

    // Counter
    'counter.songs': '{count} canzoni pinnate nel mondo',

    // Misc
    'misc.anonymous': 'Anonimo',
    'misc.justNow': 'Adesso',
    'misc.minutesAgo': '{n} minuti fa',
    'misc.hoursAgo': '{n} ore fa',
    'misc.daysAgo': '{n} giorni fa',
    'misc.language': 'Lingua',
  },

  en: {
    // Top bar
    'search.placeholder': 'Search songs, artists, places...',
    'search.nearMe': 'Near me',

    // FAB
    'fab.pinSong': 'Pin a song',

    // Pin form
    'pinForm.title': 'Pin a song',
    'pinForm.songUrl': 'Spotify or YouTube link',
    'pinForm.songUrlPlaceholder': 'Paste a Spotify or YouTube link...',
    'pinForm.memory': 'A memory',
    'pinForm.memoryPlaceholder': 'Why does this song belong here?',
    'pinForm.displayName': 'Your name',
    'pinForm.displayNamePlaceholder': 'Anonymous',
    'pinForm.pinHere': 'Pin here',
    'pinForm.chooseOnMap': 'Choose on map',
    'pinForm.useMyLocation': 'Use my location',
    'pinForm.confirm': 'Pin it!',
    'pinForm.cancel': 'Cancel',
    'pinForm.loading': 'Loading song info...',
    'pinForm.charCount': '{count}/280',
    'pinForm.success': 'Song pinned!',

    // Song card
    'songCard.pinnedBy': 'Pinned by {name}',
    'songCard.listenOnSpotify': 'Listen on Spotify',
    'songCard.watchOnYouTube': 'Watch on YouTube',
    'songCard.share': 'Share',
    'songCard.report': 'Report',

    // Discovery
    'discovery.nearMe': 'Near me',
    'discovery.random': 'Random pin',
    'discovery.trending': 'Most pinned',
    'discovery.whatsPlaying': "What's playing nearby?",

    // Share
    'share.title': 'Share this pin',
    'share.copyLink': 'Copy link',
    'share.copied': 'Link copied!',

    // Empty states
    'empty.noPins': 'This place is silent... be the first to pin a song here',
    'empty.noResults': 'No results found',

    // Errors
    'error.invalidUrl': "Oops, that link doesn't seem to be a song. Try a Spotify or YouTube link!",
    'error.generic': 'Something went wrong. Please try again!',
    'error.rateLimit': 'Slow down! Too many pins. Try again in a bit.',
    'error.locationDenied': 'Location access denied. You can pick a spot on the map instead.',

    // Counter
    'counter.songs': '{count} songs pinned worldwide',

    // Misc
    'misc.anonymous': 'Anonymous',
    'misc.justNow': 'Just now',
    'misc.minutesAgo': '{n} minutes ago',
    'misc.hoursAgo': '{n} hours ago',
    'misc.daysAgo': '{n} days ago',
    'misc.language': 'Language',
  },
} as const;

export type TranslationKey = keyof (typeof translations)['en'];

export function t(lang: Language, key: TranslationKey, params?: Record<string, string | number>): string {
  let text = translations[lang]?.[key] ?? translations.en[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}

export default translations;
