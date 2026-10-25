// Service Worker der Sammlung „Rohrbruch“ (Phase 4): macht die Sammlung auf Android als App installierbar (ohne
// Chrome-Zeichen) und hält die Dateien für den Fall ohne Netz bereit.
// Strategie „zuerst Netz“: jede Anfrage geht ans Netz (neue Veröffentlichungen kommen sofort an); nur wenn das Netz fehlt,
// antwortet die Kopie aus dem Zwischenspeicher. Nur eigene Dateien, keine fremden Server, kein Tracking.
// Vorab abgelegt (Korrektur Phase 4, QA S2):
//  1. beim ersten Besuch (install): Startseite + Spielgerüst (GERUEST) – ohne Raumbilder, Lupen, Raumgeräusche;
//  2. je Durchgang: das Spiel schickt die Liste dessen, was die drei gezogenen Einsätze brauchen (Nachricht „ablegen“,
//     spiel.js durchgangAblegen) – Raumbild der gezogenen Variante, Lupen- und Gegenstandsblätter, Figuren, Tiere,
//     Raumgeräusche inkl. seltener Ereignisse. Was schon im Zwischenspeicher liegt, wird nicht noch einmal geladen.
// Kein Komplett-Download der ganzen Sammlung.
// Bei Änderungen an dieser Datei VERSION erhöhen – alte Zwischenspeicher dieser Sammlung werden dann gelöscht.
const PREFIX = 'rohrbruch-';
const VERSION = PREFIX + 'v15';   // v15: Manifest-id „rohrbruch“ (Publish); v14: Nachtest (Erklärkarte schließt nur, Abfluss-Takt, Druck-Anzeige = Wertung, Reinigen-Hinweis je Werkzeug, Glossar neu); v13: QA-S3 (Einzelbilder bilder/teile + teile.js, Schrittfolgen quer, Reinigen 85 %, Trefferfläche, Glossar u:false, Texte neu); v12: Fachbegriffe (glossar.js, Alltagsfassung Azubi); v11: Spielertest-Runde A (Reinigen, Marken, Weiter, Handgriff-Zeilen, Endbild, Einsatzbuch); v10: KU-03 objekt=Siphon Spüle; v9: QA-Nachbesserung (Tropfen, Dampf, Eleonore, Wort-Knöpfe, Uhr, Teil einsetzen, Offline-Firmenbild, kleinere Bilder, daten.js); v8: KU-03 Teil austauschen (daten neu); v7: Handgriff-Runde (Wasser, Beläge, Bedienteile, sprites.js, schmutz.js; Entlüften 1,8/1,4/0,9s)

const FX = ['stempel', 'akzent', 'lupe', 'gut', 'fehler', 'klick', 'koffer', 'tuer-auf', 'tuer-zu', 'einpacken', 'nichts', 'kramen',
  'ratsche', 'nachziehen', 'wasser', 'wasser-schleife', 'zischen', 'zischen-schleife', 'tropfen', 'abfluss', 'reinigen', 'piep',
  'piep-kurz', 'einrasten', 'licht', 'funk', 'tier-schnurren', 'tier-maunzen', 'tier-hecheln', 'tier-bellen', 'keks', 'gluckern', 'fahrt'];
const GERUEST = [
  // Startseite
  './', 'index.html', 'manifest.webmanifest', 'start/start.css', 'start/start.js', 'start/intro.js', 'kunde/kunde.js',
  'kunde/logo-quer-weiss.svg', 'kunde/logo-quer.svg', 'kunde/zeichen.svg', 'kunde/zeichen-weiss.svg', 'kunde/logo-hoch.svg',
  'schrift/barlow.css', 'schrift/schriftzug.js', 'schrift/barlow-regular.woff2', 'schrift/barlow-medium.woff2',
  'schrift/barlow-semibold.woff2', 'schrift/barlow-bold.woff2', 'schrift/barlow-extrabold.woff2',
  'icons/icon.svg', 'icons/favicon.png', 'icons/apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-maskable-192.png',
  'klaenge/musik.mp3',
  // Spielgerüst (Code, Startbild, Gegenstände, die jeder Durchgang braucht, Effekte)
  'shk-adventure/', 'shk-adventure/index.html', 'shk-adventure/rahmen.css', 'shk-adventure/rohrbruch.css', 'shk-adventure/leben.css',
  'shk-adventure/kunde/kunde.js', 'shk-adventure/kunde/logo-quer-weiss.svg', 'shk-adventure/kunde/logo-quer.svg',
  'shk-adventure/kunde/zeichen.svg', 'shk-adventure/kunde/zeichen-weiss.svg',
  'shk-adventure/rahmen.js', 'shk-adventure/daten.js', 'shk-adventure/glossar.js', 'shk-adventure/orte.js', 'shk-adventure/teile.js', 'shk-adventure/schmutz.js', 'shk-adventure/figuren.js', 'shk-adventure/sprites.js', 'shk-adventure/zeichnen.js',
  'shk-adventure/klang.js', 'shk-adventure/handgriffe.js', 'shk-adventure/platzhalter.js', 'shk-adventure/fahrt.js',
  'shk-adventure/leben.js', 'shk-adventure/buch.js', 'shk-adventure/spiel.js', 'shk-adventure/schirme.js',
  'shk-adventure/bilder/startbild.webp', 'shk-adventure/bilder/koffer.webp', 'shk-adventure/bilder/transporter.webp',
  'shk-adventure/bilder/transporter-seite.webp', 'shk-adventure/bilder/keks.webp', 'shk-adventure/bilder/ausbildung.webp',
  'shk-adventure/bilder/figur-meister-1.webp', 'shk-adventure/bilder/figur-meister-2.webp', 'shk-adventure/bilder/figur-meister-3.webp',
].concat(FX.map(n => 'shk-adventure/klaenge/' + n + '.mp3'));

// einzeln ablegen: fehlt eine Datei (z. B. anderes Kundenlogo), bricht nicht alles ab; Vorhandenes wird nicht neu geladen
function ablegen(adressen) {
  return caches.open(VERSION).then(c => {
    const liste = adressen.map(a => new URL(a, self.location.href).href).filter(a => a.startsWith(self.location.origin + '/'));
    let i = 0;
    const naechste = () => {
      if (i >= liste.length) return Promise.resolve();
      const a = liste[i++];
      return c.match(a, { ignoreSearch: true })
        .then(da => da || fetch(a).then(r => (r.status === 200 && r.type === 'basic') ? c.put(a, r) : null))
        .catch(() => null)
        .then(naechste);
    };
    return Promise.all([naechste(), naechste(), naechste(), naechste()]);   // 4 gleichzeitig
  });
}

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(ablegen(GERUEST).catch(() => {}));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(namen => Promise.all(namen.filter(n => n.startsWith(PREFIX) && n !== VERSION).map(n => caches.delete(n))))
    .then(() => self.clients.claim()));
});

// Spiel: { typ: 'ablegen', dateien: [Adressen] } – Antwort über den Port: { fertig: true, zahl }
self.addEventListener('message', e => {
  const d = e.data || {};
  if (d.typ !== 'ablegen' || !Array.isArray(d.dateien)) return;
  const arbeit = ablegen(d.dateien).then(() => { if (e.ports && e.ports[0]) e.ports[0].postMessage({ fertig: true, zahl: d.dateien.length }); });
  if (e.waitUntil) e.waitUntil(arbeit.catch(() => {}));
});

// Klänge (MP3) zuerst aus dem Zwischenspeicher: Musik (780 KB) und Effekte werden so je Seitenaufruf nicht erneut übers Netz
// geholt (QA Phase 4: musik.mp3 lief doppelt durchs Protokoll). Neue oder geänderte Klänge erreichen die Geräte erst mit
// einer neuen VERSION – beim Austausch eines Klangs VERSION erhöhen (Testen: Strg+Umschalt+R umgeht den Service Worker).
const ZUERST_SPEICHER = /\.mp3$/i;

self.addEventListener('fetch', e => {
  const anfrage = e.request, adresse = new URL(anfrage.url);
  if (anfrage.method !== 'GET' || adresse.origin !== self.location.origin) return;
  if (ZUERST_SPEICHER.test(adresse.pathname) && !anfrage.headers.has('range')) {
    e.respondWith(caches.open(VERSION).then(c => c.match(anfrage, { ignoreSearch: true })).then(t => t || netz(e, anfrage)));
    return;
  }
  e.respondWith(netz(e, anfrage));
});

function netz(e, anfrage) {
  return fetch(anfrage).then(antwort => {
    // nur vollständige eigene Antworten merken (keine Teilantworten von Musik/Klängen, keine Fehlerseiten)
    if (antwort.status === 200 && antwort.type === 'basic' && !anfrage.headers.has('range')) {
      const kopie = antwort.clone();
      e.waitUntil(caches.open(VERSION).then(c => c.put(anfrage, kopie)).catch(() => {}));
    }
    return antwort;
  }).catch(() => caches.open(VERSION).then(c => c.match(anfrage, { ignoreSearch: true })).then(treffer => treffer || Response.error()));
}
