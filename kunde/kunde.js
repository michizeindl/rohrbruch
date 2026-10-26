// Kundendaten – nur diese Datei und die Logos ändern sich pro Kunde (Baukasten A1 SHK, „Rohrbruch“).
// Fehlt ein Eintrag, nimmt das Spiel den Standard. Musterfirma: „Muster Haustechnik“ (alles erfunden).
window.KUNDE = {
  firma: 'Muster Haustechnik',

  // Logos (SVG): logo = für dunkle Flächen (weiß), logoAufHell = Original in Hausfarbe für helle Flächen.
  // logoQuer = Logo quer oben links im Start- und Endbild (MZ, 24.10.2026), zeichen = kleines Zeichen in der Ecke der
  // Werkzeugleiste, zeichenWeiss = Zeichen auf Flächen in Hausfarbe (z. B. Weste des Meisters)
  logo: 'kunde/logo-quer-weiss.svg',
  logoAufHell: 'kunde/logo-quer.svg',
  logoQuer: 'kunde/logo-quer.svg',
  zeichen: 'kunde/zeichen.svg',
  zeichenWeiss: 'kunde/zeichen-weiss.svg',

  // Farben: haupt = Markenfarbe (#00FF00-Flächen in den Bildern werden darin umgefärbt), dunkel = dunkle Abstufung
  // (Überschriften auf Hell), akzent = Hervorhebung, hell = Schrift auf Dunkel
  farben: { haupt: '#1E63B5', hauptText: '#ffffff', akzent: '#f2b632', dunkel: '#0f2f57', hell: '#ffffff' },

  // Texte überschreiben (alle optional): titel, untertitel, anleitung
  texte: {},

  // Start- und Endbild im Stil „Heizungs-Display“ (eigene Optik der Sammlung, MZ 24.10.2026) – macht spiel.js
  stil: 'display',

  // Startseite der Sammlung (Haus-Knopf oben links und „Zum Menü“)
  // Startseite: das ist sie selbst
  startseite: '',

  // Ausbildungs-Hinweis im Endbild (MZ, 24.10.2026) – für Kunden tausch- und ausblendbar (ausbildung: null = aus).
  // link leer = Knopf nur sichtbar, aber ohne Ziel (Musterfirma)
  ausbildung: { text: 'Lust auf echte Einsätze? Mach deine Ausbildung bei Muster Haustechnik.', knopf: 'Zur Ausbildung', link: '' },

  // Helfer-Figur „der Chef“ (für Kunden tauschbar; rolle 'Chef' oder 'Chefin' – das Spiel passt die Wendungen an)
  meister: { name: 'Georg Lehner', nachname: 'Lehner', rolle: 'Chef' },

  // Kontaktdaten im Footer (Startseite, MZ 24.10.2026). Datenschutz/Impressum nur unterstrichen, nichts verlinkt.
  // vor jedem „–“ ein geschütztes Leerzeichen (\u00a0), damit der Strich nie am Zeilenanfang steht (die Startseite ergänzt es sonst selbst)
  kontakt: 'Muster Haustechnik\u00a0– Am Mühlbach 12\u00a0– 94999 Musterstadt\u00a0– Tel. 089 99998 120',
  web: 'www.muster-shk.de',
  rechtliches: [{ text: 'Datenschutz', link: '' }, { text: 'Impressum', link: '' }],
};
