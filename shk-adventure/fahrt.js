// Rohrbruch – Übergang zwischen den Einsätzen (Phase 3, Entscheidung MZ 25.10.2026: statt Karte): der Transporter der Firma
// (Seitenansicht, #00FF00 in Hausfarbe umgefärbt, Logo als eigene Ebene auf der Seitenwand) fährt ca. 2s seitlich durchs
// Bild, darunter der Funkspruch des Meisters. Uhr steht, Tippen überspringt; bei „Bewegung reduzieren“ steht er still.
// Hintergrund: ein Firmenbild aus kunde.js, weichgezeichnet und aufgehellt (MZ, 25.10.2026). Musik kommt in Phase 4.
(function () {
  'use strict';
  const RB = window.RB, R_ = window.Rahmen, K = R_.kunde;
  const nb = t => String(t).replace(/ – /g, ' – ');
  function el(tag, klasse, text) { const e = document.createElement(tag); if (klasse) e.className = klasse; if (text != null) e.textContent = nb(text); return e; }

  // Transporter einmal umfärben (Kunde kann eigenes Bild in kunde.js angeben: transporterSeite)
  let bildUrl = null;
  RB.transporterSeite = function () {
    if (!bildUrl) bildUrl = RB.bild(K.transporterSeite || 'bilder/transporter-seite.webp').fertig.then(i => {
      if (!i) return '';
      try { return K.transporterSeite ? i.src : R_.umfaerben(i).toDataURL('image/webp', 0.9); } catch (e) { return i.src; }
    });
    return bildUrl;
  };
  // Firmenbild als Hintergrund (MZ, 25.10.2026): je Übergang ein anderes aus kunde.js firmenbilder (Musterfirma: Platzhalter
  // 01–08, #00FF00 in Hausfarbe umgefärbt – firmenbilderUmfaerben). Weichzeichnen und Aufhellen macht das CSS (.rb-fahrthg),
  // damit eigene Fotos des Kunden ohne Bearbeitung passen. Reihenfolge gemischt, keine Wiederholung, bis alle dran waren.
  const FIRMENBILDER = Array.isArray(K.firmenbilder) ? K.firmenbilder.filter(Boolean) : [];
  let firmaReihe = [];
  const firmaUrls = {};
  function firmenbildUrl(adresse) {
    if (!firmaUrls[adresse]) firmaUrls[adresse] = RB.bild(adresse).fertig.then(i => {
      if (!i) return '';
      if (!K.firmenbilderUmfaerben) return i.src;
      try { return R_.umfaerben(i).toDataURL('image/webp', 0.8); } catch (e) { return i.src; }
    });
    return firmaUrls[adresse];
  }
  function reiheFuellen() {
    if (firmaReihe.length || !FIRMENBILDER.length) return;
    firmaReihe = FIRMENBILDER.slice();
    for (let i = firmaReihe.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [firmaReihe[i], firmaReihe[j]] = [firmaReihe[j], firmaReihe[i]]; }
    // nie zweimal dasselbe direkt hintereinander (Übergang von einer Reihe zur nächsten)
    if (firmaReihe.length > 1 && firmaReihe[0] === RB.fahrtFirmenbild) firmaReihe.push(firmaReihe.shift());
  }
  // Ohne Verbindung (QA Handgriff-Runde, S3): nur Firmenbilder, die schon abgelegt bzw. geladen sind – sonst kein Abruf
  // (vorher: Vorladen des nächsten Bilds einer neu gemischten Reihe → Konsolenfehler)
  const offline = () => navigator.onLine === false;
  const vorhanden = a => !!firmaUrls[a] || (RB.abgelegt || []).includes(new URL(a, location.href).href);
  function naechstesFirmenbild() {
    reiheFuellen();
    let a = firmaReihe.shift() || null;
    if (a && offline() && !vorhanden(a)) {
      const da = FIRMENBILDER.filter(vorhanden), ohne = da.filter(x => x !== RB.fahrtFirmenbild);
      a = (ohne.length ? ohne : da)[Math.floor(Math.random() * (ohne.length || da.length))] || null;   // abwechselnd, nie zweimal gleich
    }
    RB.fahrtFirmenbild = a;
    // das folgende schon vorbereiten (klein, ca. 15–40 KB), damit es beim nächsten Übergang sofort da ist
    reiheFuellen();
    if (firmaReihe.length && (!offline() || vorhanden(firmaReihe[0]))) firmenbildUrl(firmaReihe[0]);
    return a;
  }
  // die nächsten n Firmenbilder (offline ablegen, spiel.js durchgangDateien) – reicht die Reihe nicht, alle
  RB.fahrtNaechste = function (n) {
    reiheFuellen();
    return firmaReihe.length >= n ? firmaReihe.slice(0, n) : FIRMENBILDER.slice();
  };
  // Testhilfe (und Vergleich in reiheFuellen): welches Firmenbild zuletzt gezeigt wurde
  RB.fahrtFirmenbild = null;
  // erstes Bild der Reihe schon beim Laden vorbereiten (der erste Übergang kommt gleich nach dem Startbild)
  reiheFuellen();
  if (firmaReihe.length) firmenbildUrl(firmaReihe[0]);

  // Logofläche auf der Seitenwand (Anteile des Bilds, rohrbruch-bilder.py transporter)
  const LOGO = [0.47, 0.24, 0.92, 0.46];
  const DAUER = 2.2;   // Sekunden durchs Bild

  // o = { saetze: [Text], meister: { name, bild (Promise<url>) }, ziel: 'Frau Huber – Bad' }
  // → { el, hg (Hintergrund-Ebene, vor el in die Szene), start(fertig), ueberspringen() }
  RB.fahrtBauen = function (o) {
    const hg = el('div', 'rb-fahrthg');
    const fb = naechstesFirmenbild();
    if (fb) firmenbildUrl(fb).then(u => { if (u) { hg.style.setProperty('--bild', `url("${u}")`); hg.classList.add('da'); } });
    const box = el('div', 'rb-fahrtbox');
    const strasse = el('div', 'rb-strasse');
    const wagen = el('div', 'rb-transporter'), bild = el('img', 'rb-transporterbild'); bild.alt = '';
    RB.transporterSeite().then(u => { if (u) bild.src = u; });
    const logo = el('img', 'rb-transporterlogo'); logo.alt = ''; logo.src = K.logo || K.logoAufHell || '';
    Object.assign(logo.style, { left: LOGO[0] * 100 + '%', top: LOGO[1] * 100 + '%', width: (LOGO[2] - LOGO[0]) * 100 + '%', height: (LOGO[3] - LOGO[1]) * 100 + '%' });
    wagen.append(bild, logo);
    wagen.style.setProperty('--dauer', DAUER + 's');
    strasse.append(wagen);
    const ziel = el('div', 'rb-fahrtziel', o.ziel || '');
    const funk = el('div', 'rb-funk rb-fahrtfunk');
    const kopf = el('div', 'rb-funkkopf'), mb = el('img', 'rb-funkbild'); mb.alt = '';
    if (o.meister && o.meister.bild) o.meister.bild.then(u => { if (u) mb.src = u; });
    kopf.append(mb, el('div', 'rb-funkname', (o.meister && o.meister.name) || ''));
    funk.append(kopf);
    (o.saetze || []).forEach((s, i) => { const p = el('p', 'rb-funktext', s); p.style.animationDelay = (0.3 + i * 0.5) + 's'; funk.append(p); });
    box.append(strasse, ziel, funk);
    // nach der Durchfahrt so lange stehen bleiben, dass der Funkspruch lesbar ist (ca. 16 Zeichen je Sekunde, höchstens 7s)
    const zeichen = (o.saetze || []).join(' ').length;
    const gesamt = Math.max(RB.ruhig ? 1.6 : DAUER + 0.4, Math.min(7, 1.2 + zeichen / 16));
    let uhr = null, fertigFn = null, vorbei = false;
    const ende = () => { if (vorbei) return; vorbei = true; clearTimeout(uhr); const f = fertigFn; fertigFn = null; if (f) f(); };
    return {
      el: box, hg,
      start(fertig) { fertigFn = fertig; if (!RB.ruhig) wagen.classList.add('faehrt'); uhr = setTimeout(ende, gesamt * 1000); },
      ueberspringen: ende,
    };
  };
})();
