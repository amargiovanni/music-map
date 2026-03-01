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
    'songCard.listenOnAppleMusic': 'Ascolta su Apple Music',
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
    'error.invalidUrl': 'Oops, quel link non sembra essere una canzone. Prova con un link Spotify, YouTube o Apple Music!',
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

    // Landing
    'landing.tagline': 'Che suono ha questo posto?',
    'landing.subtitle': 'Ogni luogo ha una colonna sonora. Pinna canzoni sui posti, scopri l\'atlante musicale del mondo.',
    'landing.scrollHint': 'Scorri per esplorare',
    'landing.privacy.title': 'Privacy first',
    'landing.privacy.desc': 'Nessuna email salvata. Nessun tracciamento. La tua identit\u00e0 \u00e8 crittograficamente separata dai tuoi pin. Neanche noi possiamo collegarli.',
    'landing.opensource.title': 'Open source',
    'landing.opensource.desc': 'Ogni riga di codice \u00e8 pubblica. Verifica le nostre promesse sulla privacy, contribuisci o forka il progetto.',
    'landing.personal.title': 'La tua mappa musicale',
    'landing.personal.desc': 'Accedi per costruire il tuo atlante personale di canzoni e luoghi. Tutti i tuoi pin in una mappa. La tua colonna sonora, i tuoi ricordi.',
    'landing.howItWorks': 'Come funziona',
    'landing.step1.title': 'Esplora',
    'landing.step1.desc': 'Naviga migliaia di canzoni pinnate in tutto il mondo. Nessun account necessario.',
    'landing.step2.title': 'Pinna una canzone',
    'landing.step2.desc': 'Incolla un link Spotify, YouTube o Apple Music. Piazza un pin. Lascia un ricordo.',
    'landing.step3.title': 'Condividi',
    'landing.step3.desc': 'Ogni pin ha un link unico con anteprime social. Condividi su qualsiasi piattaforma.',
    'landing.cta': 'Inizia il tuo atlante musicale',
    'landing.signInGoogle': 'Accedi con Google',
    'landing.signInApple': 'Accedi con Apple',
    'landing.exploreAnonymously': 'Oppure esplora la mappa',
    'landing.loginRequired': 'Accedi per pinnare',
    'landing.loginPrompt': 'Crea un account gratuito per pinnare canzoni sui luoghi.',

    // Auth
    'auth.myPins': 'I miei pin',
    'auth.signOut': 'Esci',
    'auth.signIn': 'Accedi',
    'auth.privacy': 'Privacy',
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
    'songCard.listenOnAppleMusic': 'Listen on Apple Music',
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
    'error.invalidUrl': "Oops, that link doesn't seem to be a song. Try a Spotify, YouTube, or Apple Music link!",
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

    // Landing
    'landing.tagline': 'What does this place sound like?',
    'landing.subtitle': 'Every place has a soundtrack. Pin songs to places, discover the musical atlas of the world.',
    'landing.scrollHint': 'Scroll to explore',
    'landing.privacy.title': 'Privacy first',
    'landing.privacy.desc': 'No email stored. No tracking. Your identity is cryptographically separated from your pins. Even we can\'t link them.',
    'landing.opensource.title': 'Open source',
    'landing.opensource.desc': 'Every line of code is public. Verify our privacy claims, contribute features, or fork the entire project.',
    'landing.personal.title': 'Your listening map',
    'landing.personal.desc': 'Sign in to build a personal atlas of songs and places. See all your pins on one map. Your soundtrack, your memories.',
    'landing.howItWorks': 'How it works',
    'landing.step1.title': 'Explore',
    'landing.step1.desc': 'Browse thousands of songs pinned around the world. No account needed.',
    'landing.step2.title': 'Pin a song',
    'landing.step2.desc': 'Paste a Spotify, YouTube, or Apple Music link. Drop a pin. Leave a memory.',
    'landing.step3.title': 'Share',
    'landing.step3.desc': 'Every pin has a unique link with beautiful social previews. Share on any platform.',
    'landing.cta': 'Start your musical atlas',
    'landing.signInGoogle': 'Sign in with Google',
    'landing.signInApple': 'Sign in with Apple',
    'landing.exploreAnonymously': 'Or explore the map',
    'landing.loginRequired': 'Sign in to pin a song',
    'landing.loginPrompt': 'Create a free account to start pinning songs to places.',

    // Auth
    'auth.myPins': 'My Pins',
    'auth.signOut': 'Sign out',
    'auth.signIn': 'Sign in',
    'auth.privacy': 'Privacy',
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
