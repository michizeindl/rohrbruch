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
  startseite: '../',

  // Ausbildungs-Hinweis im Endbild (MZ, 24.10.2026) – für Kunden tausch- und ausblendbar (ausbildung: null = aus).
  // link leer = Knopf nur sichtbar, aber ohne Ziel (Musterfirma). Knopf „Zur Website“ gefüllt in Hausfarbe (MZ, 24.10.2026).
  // bild = kleines Bild „Azubi und Meister“ (MZ, 24.10.2026), beim Kunden ein eigenes Team-Foto (Querformat 3:2, z. B. 600×400);
  // umfaerben: true nur für gestaltete Bilder mit #00FF00-Flächen (Platzhalter), nie für echte Fotos. bild: '' = ohne Bild.
  // text leer = Satz aus dem Spiel („Lust auf echte Einsätze? Mach deine Ausbildung bei {firma}.“, {firma} = firma oben)
  // Abschlussbild (MZ, 25.10.2026): ab 700 Punkten ausbildung, darunter praktikum; an: false blendet einen aus (dann kommt der
  // andere), beide aus = kein Kasten. text leer = Satz aus dem Spiel (Praktikum: „Lust aufs Handwerk? Mach dein Praktikum bei {firma}.“)
  ausbildung: { an: true, text: '', knopf: 'Zur Website', link: '',
    bild: 'bilder/ausbildung.webp', umfaerben: true },
  praktikum: { an: true, text: '', knopf: 'Zur Website', link: '',
    bild: 'bilder/praktikum.webp', umfaerben: true },
  // Abschlussbild: Gedankenwolke der Figur (Satz in Ich-Form) an/aus
  abschlussGedanke: true,

  // Helfer-Figur „der Chef“ (für Kunden tauschbar: eigenes freigestelltes Foto, eigener Name; MZ 26.10.2026 Chef statt Meister)
  // nachname = {meister} in den Spieltexten („Lehner hier.“); fehlt er, nimmt das Spiel das letzte Wort von name
  // rolle: 'Chef' oder 'Chefin' – bei 'Chefin' passt das Spiel die Wendungen an („der Chef“ → „die Chefin“, „den Chef“ → „die Chefin“ …)
  meister: { name: 'Georg Lehner', nachname: 'Lehner', rolle: 'Chef' },

  // Regionale Fassungen (MZ, 25.10.2026): Spieltexte sind Hochdeutsch; true = einzelne Sätze bairisch
  // (Liste Material/Texte/rohrbruch-regional-entwurf.md). Musterfirma: an.
  regional: true,

  // Transporter im Übergang zwischen den Einsätzen (Phase 3): Seitenansicht, fährt nach links; Logo kommt als eigene Ebene
  // auf die Seitenwand. Eigenes Bild des Kunden: transporterSeite: 'kunde/transporter.webp' (wird dann nicht umgefärbt).

  // Firmenbilder als Hintergrund des Transporter-Übergangs (MZ, 25.10.2026): je Übergang ein anderes, im Spiel weichgezeichnet
  // und aufgehellt. Beim Kunden eigene Fotos (Querformat, ca. 640×427 reicht, z. B. 'kunde/firma-1.webp'); Liste leer = ohne Bild.
  // firmenbilderUmfaerben: true nur für gestaltete Bilder mit #00FF00-Flächen (Platzhalter der Musterfirma), nie für echte Fotos.
  firmenbilder: ['bilder/firma-1.webp', 'bilder/firma-2.webp', 'bilder/firma-3.webp', 'bilder/firma-4.webp',
    'bilder/firma-5.webp', 'bilder/firma-6.webp', 'bilder/firma-7.webp', 'bilder/firma-8.webp'],
  firmenbilderUmfaerben: true,

  // Kontaktdaten im Footer (Startseite, MZ 24.10.2026). Datenschutz/Impressum nur unterstrichen, nichts verlinkt.
  // vor jedem „–“ ein geschütztes Leerzeichen (\u00a0), damit der Strich nie am Zeilenanfang steht (die Startseite ergänzt es sonst selbst)
  kontakt: 'Muster Haustechnik\u00a0– Am Mühlbach 12\u00a0– 94999 Musterstadt\u00a0– Tel. 089 99998 120',
  web: 'www.muster-shk.de',
  rechtliches: [{ text: 'Datenschutz', link: '' }, { text: 'Impressum', link: '' }],
};
