const privacyContent = {
  it: {
    title: 'Privacy Policy',
    lastUpdated: 'Ultimo aggiornamento: 1 marzo 2026',
    sections: [
      {
        title: '1. Introduzione',
        body: `Music Map ("noi", "nostro") è un progetto open source che permette di pinnare canzoni su una mappa del mondo. Questa privacy policy spiega come raccogliamo, utilizziamo e proteggiamo i tuoi dati. La nostra filosofia è semplice: raccogliamo il minimo indispensabile e rendiamo impossibile, anche per noi stessi, collegare i dati a persone reali.`,
      },
      {
        title: '2. Quali dati raccogliamo',
        body: `Quando pinni una canzone, raccogliamo:
• La posizione scelta sulla mappa (coordinate)
• Il link alla canzone (Spotify, YouTube o Apple Music)
• Un nome visualizzato volontario (opzionale)
• Un breve testo di ricordo (opzionale, max 280 caratteri)
• La città e il paese (derivati automaticamente dalle coordinate)

Quando effettui l'accesso con Google o Apple, riceviamo esclusivamente un identificativo tecnico anonimo ("subject ID") dal provider. Non richiediamo e non riceviamo il tuo nome, indirizzo email, foto profilo o qualsiasi altra informazione personale.`,
      },
      {
        title: '3. Cosa NON raccogliamo',
        body: `• Nessun indirizzo email
• Nessun nome reale
• Nessuna foto profilo
• Nessun dato di navigazione
• Nessun cookie di tracciamento
• Nessun pixel o script di terze parti (analytics, ads, social)
• Nessun dato biometrico o di localizzazione continua`,
      },
      {
        title: '4. Come funziona l\'autenticazione',
        body: `Utilizziamo OAuth 2.0 con Google e Apple, richiedendo esclusivamente lo scope "openid" — il livello minimo che non include email né profilo. Il provider ci fornisce solo un identificativo tecnico (subject ID).

Questo identificativo viene immediatamente hashato con SHA-256 utilizzando un "pepper" segreto prima di essere salvato. L'hash risultante è una stringa di caratteri esadecimali che non può essere invertita senza il pepper.

Il pepper è conservato come Cloudflare Worker Secret — non si trova nel database, non nel codice sorgente, non nei log, non nella dashboard. È accessibile solo durante l'esecuzione del codice e non è visualizzabile da nessuna interfaccia.`,
      },
      {
        title: '5. Come sono conservati i dati',
        body: `I dati sono conservati su Cloudflare D1 (SQLite), KV e R2.

La tabella utenti contiene esclusivamente:
• Un ID casuale (UUID v4)
• L'hash dell'identificativo di autenticazione
• La data di creazione

I pin contengono un riferimento opzionale all'ID utente (l'UUID casuale). Anche con accesso completo al database, un amministratore vede solo identificativi casuali — UUID e hash esadecimali. Non c'è alcun modo di risalire a una persona reale.`,
      },
      {
        title: '6. Garanzia di non-collegabilità per gli amministratori',
        body: `Abbiamo progettato il sistema in modo che neanche noi possiamo collegare i pin a persone reali:

• Il pepper usato per l'hashing è conservato come Cloudflare Worker Secret
• Non è nel database, non nel codice sorgente, non nei log
• Senza il pepper, l'hash non può essere invertito o forzato con brute-force
• Gli UUID degli utenti sono casuali e non contengono informazioni personali
• Non registriamo indirizzi IP nelle tabelle utenti o pin
• Non salviamo email o nomi reali in nessuna tabella

Questo significa che anche con accesso completo all'infrastruttura (database, storage, log), un amministratore non può determinare quale persona reale ha creato quali pin.`,
      },
      {
        title: '7. Verifica open source',
        body: `L'intero codice sorgente di Music Map è pubblico su GitHub. Chiunque può:
• Verificare che non raccogliamo email o dati personali
• Ispezionare la funzione di hashing e il meccanismo di autenticazione
• Controllare lo schema del database
• Verificare che non ci siano tracker o analytics nascosti

L'apertura del codice è la nostra garanzia più forte: non devi fidarti delle nostre parole, puoi verificare tu stesso.`,
      },
      {
        title: '8. I tuoi diritti',
        body: `Hai il diritto di:
• Cancellazione: puoi richiedere la cancellazione del tuo account e di tutti i pin associati
• Esportazione: puoi richiedere un export JSON di tutti i tuoi pin
• Disconnessione: puoi effettuare il logout in qualsiasi momento, e la sessione viene eliminata immediatamente
• Revoca OAuth: puoi revocare l'accesso dalla pagina di sicurezza del tuo account Google o Apple

Per esercitare questi diritti, apri una issue su GitHub o contattaci.`,
      },
      {
        title: '9. Cookie',
        body: `Utilizziamo un solo cookie tecnico ("mm_session") per mantenere la sessione di accesso. È:
• HttpOnly (non accessibile da JavaScript)
• Secure (trasmesso solo via HTTPS)
• SameSite=Lax (protezione CSRF)
• Durata: 30 giorni

Non utilizziamo cookie di tracciamento, profilazione o marketing.`,
      },
      {
        title: '10. Modifiche a questa policy',
        body: `Qualsiasi modifica a questa privacy policy sarà tracciabile nella cronologia dei commit del repository GitHub, essendo il file parte del codice sorgente. Ti invitiamo a controllare periodicamente questa pagina.`,
      },
    ],
  },

  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: March 1, 2026',
    sections: [
      {
        title: '1. Introduction',
        body: `Music Map ("we", "our") is an open source project that lets you pin songs to places on a world map. This privacy policy explains how we collect, use, and protect your data. Our philosophy is simple: we collect the bare minimum and make it impossible, even for ourselves, to link data to real people.`,
      },
      {
        title: '2. What data we collect',
        body: `When you pin a song, we collect:
• The position you chose on the map (coordinates)
• The song link (Spotify, YouTube, or Apple Music)
• A voluntary display name (optional)
• A short memory text (optional, max 280 characters)
• The city and country (derived automatically from coordinates)

When you sign in with Google or Apple, we receive only an anonymous technical identifier ("subject ID") from the provider. We do not request and do not receive your name, email address, profile photo, or any other personal information.`,
      },
      {
        title: '3. What we do NOT collect',
        body: `• No email addresses
• No real names
• No profile photos
• No browsing data
• No tracking cookies
• No third-party pixels or scripts (analytics, ads, social)
• No biometric or continuous location data`,
      },
      {
        title: '4. How authentication works',
        body: `We use OAuth 2.0 with Google and Apple, requesting only the "openid" scope — the minimum level that includes neither email nor profile. The provider gives us only a technical identifier (subject ID).

This identifier is immediately hashed with SHA-256 using a secret "pepper" before being stored. The resulting hash is a string of hexadecimal characters that cannot be reversed without the pepper.

The pepper is stored as a Cloudflare Worker Secret — it is not in the database, not in the source code, not in the logs, not in the dashboard. It is accessible only during code execution and cannot be viewed through any interface.`,
      },
      {
        title: '5. How data is stored',
        body: `Data is stored on Cloudflare D1 (SQLite), KV, and R2.

The users table contains only:
• A random ID (UUID v4)
• The hashed authentication identifier
• The creation date

Pins contain an optional reference to the user ID (the random UUID). Even with full database access, an administrator sees only random identifiers — UUIDs and hexadecimal hashes. There is no way to trace back to a real person.`,
      },
      {
        title: '6. Admin unlinkability guarantee',
        body: `We designed the system so that even we cannot link pins to real people:

• The pepper used for hashing is stored as a Cloudflare Worker Secret
• It is not in the database, not in the source code, not in the logs
• Without the pepper, the hash cannot be reversed or brute-forced
• User UUIDs are random and contain no personal information
• We do not log IP addresses in user or pin tables
• We do not store emails or real names in any table

This means that even with complete access to the infrastructure (database, storage, logs), an administrator cannot determine which real person created which pins.`,
      },
      {
        title: '7. Open source verification',
        body: `The entire Music Map source code is public on GitHub. Anyone can:
• Verify that we don't collect emails or personal data
• Inspect the hashing function and authentication mechanism
• Check the database schema
• Verify that there are no hidden trackers or analytics

Code openness is our strongest guarantee: you don't have to trust our words, you can verify for yourself.`,
      },
      {
        title: '8. Your rights',
        body: `You have the right to:
• Deletion: you can request deletion of your account and all associated pins
• Export: you can request a JSON export of all your pins
• Disconnection: you can sign out at any time, and the session is deleted immediately
• OAuth revocation: you can revoke access from your Google or Apple account security page

To exercise these rights, open a GitHub issue or contact us.`,
      },
      {
        title: '9. Cookies',
        body: `We use a single technical cookie ("mm_session") to maintain the login session. It is:
• HttpOnly (not accessible from JavaScript)
• Secure (transmitted only via HTTPS)
• SameSite=Lax (CSRF protection)
• Duration: 30 days

We do not use tracking, profiling, or marketing cookies.`,
      },
      {
        title: '10. Changes to this policy',
        body: `Any changes to this privacy policy will be trackable in the commit history of the GitHub repository, as this file is part of the source code. We encourage you to check this page periodically.`,
      },
    ],
  },
} as const;

export default privacyContent;
