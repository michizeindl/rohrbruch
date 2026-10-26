// Rohrbruch – Übergang zwischen den Einsätzen (Phase 3, Entscheidung MZ 25.10.2026: statt Karte): der Transporter der Firma
// (Seitenansicht, #00FF00 in Hausfarbe umgefärbt, Logo und Kontakt als eigene Ebenen auf der Seitenwand) fährt ca. 3s seitlich
// durchs Bild (hält ca. 1s in der Mitte), darunter der Funkspruch des Meisters. Uhr steht, Tippen überspringt; bei „Bewegung reduzieren“ steht er still.
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

  // Beschriftung der Seitenwand (MZ, Variante B, 25.10.2026), Anteile des Bilds bilder/transporter-seite.webp (640×308),
  // eingemessen: Schiebetür von x 0,398 bis 0,656 (Türkanten), Seitenwand dahinter bis 0,955; grüne Fläche y 0,12 bis 0,70.
  //   LOGO_TUER: ganzes Logo im Hochformat (Zeichen über Schrift, weiß) mittig auf der Schiebetür, schneidet keine Türkante
  //   KONTAKT: Telefon und Internetadresse (weiß, Barlow) mittig auf der Seitenwand hinter der Schiebetür
  // Eigenes Transporter-Foto des Kunden (kunde.js transporterSeite): Beschriftung standardmäßig aus (das Foto hat eigene
  // Beschriftung bzw. andere Türkanten); kunde.js transporterBeschriftung: true/false schaltet sie ausdrücklich an oder aus.
  const LOGO_TUER = [0.428, 0.175, 0.626, 0.655];
  const KONTAKT = [0.664, 0.24, 0.948, 0.56];
  const BESCHRIFTEN = K.transporterBeschriftung != null ? K.transporterBeschriftung !== false : !K.transporterSeite;
  // Telefon: kunde.js telefon, sonst aus kontakt („… – Tel. 089 99998 120“); Internetadresse: kunde.js web
  // Nummer ohne „Tel.“ – davor steht ein Telefonhörer-Symbol (MZ, 25.10.2026; SVG im Code, weiß, in Schrifthöhe)
  const TELEFON = (K.telefon || ((/Tel\.?\s*[+\d][\d\s/-]*\d/.exec(K.kontakt || '') || [])[0] || '')).replace(/^\s*(Tel(efon)?\.?:?)\s*/i, '').trim();
  const HOERER = '<svg class="rb-hoerer" viewBox="2.8 2.3 18.9 19.4" aria-hidden="true"><path fill="currentColor" d="M6.2 2.5c.7-.4 1.6-.2 2 .5l2.1 3.6c.4.7.2 1.5-.4 2L8.4 9.8c1.2 2.5 3.3 4.6 5.8 5.8l1.2-1.5c.5-.6 1.3-.8 2-.4l3.6 2.1c.7.4.9 1.3.5 2l-1.1 1.9c-.6 1.1-1.9 1.7-3.1 1.4C10.5 19.6 4.4 13.5 2.9 6.7c-.3-1.2.3-2.5 1.4-3.1z"/></svg>';
  // ohne führendes „www.“ (MZ, 25.10.2026: mehr Platz auf der Seitenwand; die Adresse selbst bleibt)
  const WEB = String(K.web || '').replace(/^\s*(https?:\/\/)?www\./i, '').replace(/^https?:\/\//i, '').replace(/\/$/, '');
  // Logo im Hochformat weiß: kunde.js logoHochWeiss, sonst logoHoch bzw. kunde/logo-hoch.svg mit weißen Flächen (die SVGs der
  // Musterfirma färben über var(--mf-zeichen/--mf-schrift, Farbe)); ohne solche Angaben weiß per CSS-Filter (einfarbige Logos)
  let logoHochUrl = null;
  function logoHoch() {
    if (!logoHochUrl) {
      const a = K.logoHochWeiss || K.logoHoch || 'kunde/logo-hoch.svg';
      logoHochUrl = K.logoHochWeiss ? Promise.resolve({ url: a, filter: false })
        : fetch(a).then(r => r.ok ? r.text() : Promise.reject(r.status)).then(t => {
          if (!/var\(--mf-(zeichen|schrift)\s*,/.test(t)) return { url: a, filter: true };
          const w = t.replace(/var\(--mf-(zeichen|schrift)\s*,\s*[^)]*\)/g, '#ffffff');
          return { url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(w), filter: false };
        }).catch(() => ({ url: a, filter: true }));
    }
    return logoHochUrl;
  }
  if (BESCHRIFTEN) logoHoch();   // schon beim Laden vorbereiten
  const flaeche = (e, f) => Object.assign(e.style, { left: f[0] * 100 + '%', top: f[1] * 100 + '%', width: (f[2] - f[0]) * 100 + '%', height: (f[3] - f[1]) * 100 + '%' });
  // 3,2s (MZ, Variante B: 1s länger als bisher 2,2s): hereinfahren, ca. 1s in der Mitte stehen, hinausfahren (CSS rbFahrenHalt)
  const DAUER = 3.2;

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
    wagen.append(bild);
    if (BESCHRIFTEN) {
      const logo = el('img', 'rb-transporterlogo'); logo.alt = '';
      flaeche(logo, LOGO_TUER);
      logoHoch().then(l => { logo.src = l.url; logo.classList.toggle('weiss', l.filter); });
      wagen.append(logo);
      if (TELEFON || WEB) {
        const k = el('div', 'rb-transporterkontakt');
        flaeche(k, KONTAKT);
        if (TELEFON) {
          const t = el('span', 'rb-tel');
          t.innerHTML = HOERER;
          t.append(document.createTextNode(TELEFON.replace(/ /g, '\u00a0')));
          t.setAttribute('aria-label', 'Telefon ' + TELEFON);
          k.append(t);
        }
        if (WEB) k.append(el('span', '', WEB));
        wagen.append(k);
      }
    }
    wagen.style.setProperty('--dauer', DAUER + 's');
    strasse.append(wagen);
    const ziel = el('div', 'rb-fahrtziel', o.ziel || '');
    const funk = el('div', 'rb-funk rb-fahrtfunk');
    const kopf = el('div', 'rb-funkkopf'), mb = el('img', 'rb-funkbild'); mb.alt = '';
    if (o.meister && o.meister.bild) o.meister.bild.then(u => { if (u) mb.src = u; });
    kopf.append(mb, el('div', 'rb-funkname', (o.meister && o.meister.name) || ''));
    funk.append(kopf);
    (o.saetze || []).forEach((s, i) => { const p = el('p', 'rb-funktext', s); p.style.animationDelay = (0.3 + i * 0.5) + 's'; funk.append(p); });
    // Spalte für Ortszeile + Funkspruch (hochkant unsichtbar: display contents; quer flach rechts neben dem Transporter)
    const spalte = el('div', 'rb-fahrtspalte'); spalte.append(ziel, funk);
    box.append(strasse, spalte);
    // nach der Durchfahrt so lange stehen bleiben, dass der Funkspruch lesbar ist (ca. 16 Zeichen je Sekunde); seit Variante B
    // insgesamt 1s länger (Transporter als Werbefläche): mindestens 3,6s (ruhig 2,6s), Lesezeit +1s, höchstens 8s
    const zeichen = (o.saetze || []).join(' ').length;
    const gesamt = Math.max(RB.ruhig ? 2.6 : DAUER + 0.4, Math.min(8, 2.2 + zeichen / 16));
    RB.fahrtGesamt = gesamt;   // Testhilfe
    let uhr = null, fertigFn = null, vorbei = false;
    const ende = () => { if (vorbei) return; vorbei = true; clearTimeout(uhr); const f = fertigFn; fertigFn = null; if (f) f(); };
    return {
      el: box, hg,
      start(fertig) { fertigFn = fertig; if (!RB.ruhig) wagen.classList.add('faehrt'); uhr = setTimeout(ende, gesamt * 1000); },
      ueberspringen: ende,
    };
  };
})();
