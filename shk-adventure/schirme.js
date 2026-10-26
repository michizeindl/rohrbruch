// Rohrbruch – Start- und Endbild im Stil „Heizungs-Display“ (MZ, 24.10.2026, Variante B), sammlungs-eigen:
// Der Rahmen baut Start- und Endbild wie immer (Texte, Bestwert, Knöpfe); dieses Skript ordnet seine Teile neu an.
// Start (Variante A, MZ 25.10.2026): Fläche in Hausfarbe, Logo weiß oben links, kleines Bedienteil mit Display (Schriftzug,
// Stufe, Bestwert) und drei Knöpfen, weiße Karte mit der Anleitung, „An die Arbeit!“/„Zum Menü“.
// Ende: Karte wie ein Gerätedeckel, großes Manometer – Zeiger dreht auf die Punkte –, Bewertung in Markenfarbe,
// Zeit als Plakette, Aufschlüsselung, Einsätze, Ausbildungs-Hinweis.
(function () {
  'use strict';
  const R_ = window.Rahmen, F = R_.farben, K = R_.kunde, RB = window.RB, SP = RB.spiel;
  const $ = s => document.querySelector(s);
  function el(tag, klasse, text) { const e = document.createElement(tag); if (klasse) e.className = klasse; if (text != null) e.textContent = text; return e; }
  document.documentElement.classList.add('stil-rohrbruch');

  // ---------- Startbild (Variante A, MZ 25.10.2026) ----------
  // Fläche in Hausfarbe wie die Startseite, Logo (weiß) frei oben links, kleines Bedienteil (hellgrau, abgerundet) mit dem
  // Display (Schriftzug „Rohrbruch!“, Stufe, Bestwert) und drei grauen Knöpfen, darunter eine weiße Karte nur mit der Anleitung,
  // Knöpfe „An die Arbeit!“ (weiß, Schrift in Hausfarbe) und „Zum Menü“ (Umriss). Kein Thermen-Bild, kein Manometer, kein Stufentext
  // (der steht im Zwischenbild nach „An die Arbeit!“, spiel.js stufenBild).
  const start = $('#startSchirm'), karte = start.querySelector('.karte');
  const logo = el('img', 'rb-logoquer'); logo.src = K.logo || K.logoQuer || K.logoAufHell; logo.alt = K.firma || '';
  const display = el('div', 'rb-display'), punkte = el('canvas', 'rb-punkte');
  const dzeile = el('div', 'rb-dzeile'), dstufe = el('span', 'rb-dstufe');
  const titel = karte.querySelector('.titel'), unter = karte.querySelector('.unter'), anleitung = karte.querySelector('.anleitung');
  const tafel = karte.querySelector('.besttafel'), los = karte.querySelector('#losKnopf'), menue = karte.querySelector('a.knopf'), quellen = karte.querySelector('.quellen');
  // Startknopf heißt „An die Arbeit!“ (MZ, 25.10.2026) statt „Los geht's“ des Rahmens; Rahmen-Schlüssel losKnopf möglich
  los.textContent = ((window.ROHRBRUCH || {}).rahmen || {}).losKnopf || 'An die Arbeit!';
  titel.classList.add('rb-unsichtbar');
  dzeile.append(dstufe, tafel);
  tafel.querySelector('.name').textContent = 'Bestwert';   // im Display kurz
  // MZ (nach dem Release, 25.10.2026): Frage im Display ersatzlos gestrichen (Rahmen schreibt sie, bleibt unsichtbar)
  unter.style.setProperty('display', 'none', 'important');
  display.append(titel, punkte, dzeile, unter);
  const bedienteil = el('div', 'rb-bedienteil'), knoepfchen = el('div', 'rb-knoepfchen');
  for (let i = 0; i < 3; i++) knoepfchen.append(el('span'));
  bedienteil.append(display, knoepfchen);
  const startkarte = el('div', 'rb-startkarte'); startkarte.append(anleitung);
  const startknoepfe = el('div', 'rb-startknoepfe'); startknoepfe.append(los); if (menue) startknoepfe.append(menue);
  const startInhalt = el('div', 'rb-startinhalt'), linksS = el('div', 'rb-startlinks'), rechtsS = el('div', 'rb-startrechts');
  linksS.append(bedienteil);
  rechtsS.append(startkarte, startknoepfe, quellen);
  startInhalt.append(logo, linksS, rechtsS);
  start.append(startInhalt);
  karte.hidden = true;

  function stufeSchreiben() { dstufe.textContent = 'Stufe ' + SP.STUFEN[SP.stufe].name; }

  function startLayout() {
    if (start.hidden) return;
    start.classList.toggle('quer', innerWidth > innerHeight * 1.15 && innerHeight < 620);
    const dw = display.getBoundingClientRect().width;
    if (dw) display.style.setProperty('--dw', dw + 'px');
    zeichnePunkte();
  }
  function zeichnePunkte() {
    const { g, w, h } = RB.leinwand(punkte);
    g.clearRect(0, 0, w, h);
    const farbe = R_.toenen(F.haupt, 0.62);   // helle Display-Farbe
    // Schriftzug „Rohrbruch!“ (../schrift/schriftzug.js) mit leichtem Leuchten wie ein Display; ohne Datei die Punktschrift
    if (window.Schriftzug && Schriftzug.zeichne) {
      const sv = Schriftzug.seitenverhaeltnis || 5.76, b = Math.min(w * 0.92, h * sv * 0.96), hb = b / sv;
      g.save(); g.shadowColor = R_.mitAlpha(F.haupt, 0.9); g.shadowBlur = Math.max(4, hb * 0.12);
      Schriftzug.zeichne(g, (w - b) / 2, (h - hb) / 2, b, farbe, { linie: true });
      g.restore();
    } else RB.punktschrift(g, 'Rohrbruch', 0, 0, w, h, farbe, 'rgba(255,255,255,.05)');
  }
  if (window.ResizeObserver) new ResizeObserver(() => { if (!start.hidden) startLayout(); }).observe(display);
  new MutationObserver(() => { if (!start.hidden) { stufeSchreiben(); requestAnimationFrame(startLayout); } }).observe(start, { attributes: true, attributeFilter: ['hidden'] });
  addEventListener('resize', () => { startLayout(); endLayout(); });
  stufeSchreiben();
  requestAnimationFrame(startLayout);

  // ---------- Endbild ----------
  const ende = $('#endSchirm'), ek = ende.querySelector('.karte');
  const endkarte = el('div', 'rb-endkarte');
  const elogo = el('img', 'rb-logoquer'); elogo.src = K.logoQuer || K.logoAufHell || K.logo;   // Endbild-Karte hell: Logo in Hausfarbe
  elogo.alt = K.firma || '';
  const links = el('div', 'rb-endlinks'), rechts = el('div', 'rb-endrechts');
  const ue = ek.querySelector('.ueberschrift'), wert = ek.querySelector('.wert'), zeit = ek.querySelector('.zeit'),
    ausw = ek.querySelector('.auswertung'), bw = ek.querySelector('.bestwert'), text = ek.querySelector('.text');
  const kk = ek.querySelector('#kundeKnopf'), nk = ek.querySelector('#nochmalKnopf'), em = ek.querySelector('a.knopf.zweit:not(#kundeKnopf)');
  const kopfzeile = el('div', 'rb-endkopf'), stufeEnde = el('span', 'rb-endstufe');
  kopfzeile.append(elogo, stufeEnde);
  // großes Manometer (SVG): 0–1.000 Punkte, Stufengrenzen 550/700/800/900 als Bänder
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 200 200'); svg.setAttribute('class', 'rb-mano'); svg.setAttribute('aria-hidden', 'true');
  const pt = (v, r) => { const a = (-135 + v / 1000 * 270 - 90) * Math.PI / 180; return [100 + Math.cos(a) * r, 100 + Math.sin(a) * r]; };
  const bogen = (a, b, r) => { const [x0, y0] = pt(a, r), [x1, y1] = pt(b, r); return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${b - a > 666 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`; };
  let inhalt = `<circle cx="100" cy="100" r="97" class="rand"/><circle cx="100" cy="100" r="89" class="blatt"/>`;
  [[0, 550, 0.12], [550, 700, 0.3], [700, 800, 0.5], [800, 900, 0.72], [900, 1000, 1]].forEach(([a, b, d]) => {
    inhalt += `<path d="${bogen(a + 2, b - 2, 74)}" class="band" style="opacity:${d}"/>`;
  });
  for (let v = 0; v <= 1000; v += 50) {
    const [x0, y0] = pt(v, v % 100 ? 82 : 79), [x1, y1] = pt(v, 86);
    inhalt += `<line x1="${x0.toFixed(2)}" y1="${y0.toFixed(2)}" x2="${x1.toFixed(2)}" y2="${y1.toFixed(2)}" class="${v % 100 ? 'fein' : 'grob'}"/>`;
    if (v % 200 === 0) { const [x, y] = pt(v, 61); inhalt += `<text x="${x.toFixed(1)}" y="${(y + 3.5).toFixed(1)}">${v.toLocaleString('de-DE')}</text>`; }
  }
  inhalt += `<text x="100" y="168" class="einheit">Punkte</text>
    <g class="nadel"><path d="M100 104 L 96.5 100 L 100 22 L 103.5 100 Z"/><circle cx="100" cy="100" r="8"/></g>`;
  svg.innerHTML = inhalt;
  const nadel = svg.querySelector('.nadel');
  const manoBox = el('div', 'rb-manobox'); manoBox.append(svg, wert);
  // Spielertest 25.10.2026: Aufschlüsselung über alle 3 Einsätze (Ursache – Werkzeug – Reparatur – Tempo) und eine Zeile mit den
  // fünf Bewertungsstufen; beides unter Bewertung und Zeit (quer: linke Spalte, hochkant: vor der Einsatz-Liste)
  const teile = el('div', 'rb-endteile'), stufenZeile = el('p', 'rb-endstufen');
  // Bewertung und Zeit-Plakette in einer Zeile (bricht auf schmalen Handys um) – spart Höhe
  const bewZeile = el('div', 'rb-endbewertung'); bewZeile.append(ue, zeit);
  links.append(manoBox, bewZeile, teile, stufenZeile);
  // Punkte-Bild (MZ, 25.10.2026): nur noch ein Knopf „Weiter“ – er führt zum Abschlussbild (Figur, Sprechblase, Ausbildung bzw.
  // Praktikum, „Nochmal spielen“/„Zum Menü“). Der Bestwert wird wie bisher beim Erreichen des Punkte-Bilds gespeichert (Rahmen).
  const weiterKnopf = el('button', 'knopf rb-endweiter', 'Weiter'); weiterKnopf.type = 'button';
  const knoepfe = el('div', 'rb-endknoepfe'); knoepfe.append(weiterKnopf);
  rechts.append(text, ausw, bw, knoepfe);
  endkarte.append(kopfzeile, links, rechts);
  ende.append(endkarte);
  ek.hidden = true;

  // ---------- Abschlussbild (MZ, 25.10.2026) ----------
  // Fläche in Hausfarbe wie das Startbild, Figur der Stufe in der Stimmung nach den Gesamtpunkten (ab 900 begeistert – ab 800
  // glücklich – ab 700 neutral – ab 550 skeptisch – darunter sauer bzw. beschämt beim Azubi), Sprechblase mit einem zufälligen
  // Satz, darunter ab 700 der Ausbildungs-, unter 700 der Praktikums-Hinweis (kunde.js ausbildung/praktikum, je an/aus; ist einer
  // aus, kommt der andere; beide aus = kein Kasten), unten „Nochmal spielen“ und „Zum Menü“. Bleibt stehen (kein Zeittakt).
  const abschluss = el('div', 'rb-abschluss'); abschluss.hidden = true; abschluss.setAttribute('role', 'dialog');
  const abInhalt = el('div', 'rb-abschlussinhalt');
  const abLogo = el('img', 'rb-logoquer'); abLogo.src = K.logo || K.logoQuer; abLogo.alt = K.firma || '';
  const abBuehne = el('div', 'rb-abbuehne'), abFigur = el('div', 'rb-abfigur'), abFigurBild = el('img', 'rb-figur');
  const abFigurLogo = el('img', 'rb-westenlogo'); abFigurLogo.alt = ''; abFigurLogo.src = K.zeichenWeiss || K.logo;
  abFigurBild.alt = ''; abFigur.append(abFigurBild, abFigurLogo);
  // Gedankenwolke (MZ, 25.10.2026: die Figur ist der Spieler, Satz in Ich-Form) mit drei kleinen Kreisen zur Figur hin;
  // kunde.js abschlussGedanke: false blendet sie aus
  const abBlase = el('div', 'rb-abblase rb-gedanke'), abSatz = el('p');
  const abPunkte = el('div', 'rb-gedankenpunkte'); for (let i = 0; i < 3; i++) abPunkte.append(el('i'));
  abBlase.append(abSatz, abPunkte); abBuehne.append(abFigur, abBlase);
  if (K.abschlussGedanke === false) abBlase.hidden = true;
  const abKasten = el('div', 'rb-abkasten');
  const abKnoepfe = el('div', 'rb-abknoepfe'); abKnoepfe.append(nk); if (em) abKnoepfe.append(em); abKnoepfe.append(kk);
  const abRechts = el('div', 'rb-abrechts'); abRechts.append(abKasten, abKnoepfe);
  abBuehne.append(abRechts);
  abInhalt.append(abLogo, abBuehne);
  abschluss.append(abInhalt);
  document.body.append(abschluss);

  const stimmungFuer = p => p >= 900 ? 'begeistert' : p >= 800 ? 'gut' : p >= 700 ? 'neutral' : p >= 550 ? 'skeptisch' : 'schlecht';
  // Hinweis-Kasten aus kunde.js (ausbildung bzw. praktikum): Bild (Platzhalter umgefärbt), Satz, Knopf „Zur Website“
  const hinweisAn = h => !!(h && h.an !== false && h.text);
  function kastenBauen(h) {
    abKasten.textContent = '';
    abKasten.hidden = !h;
    if (!h) return;
    const box = el('div', 'rb-ausbildung');
    if (h.bild) {
      const ab = el('img', 'rb-ausbildungbild'); ab.alt = ''; ab.decoding = 'async';
      if (h.umfaerben) RB.bild(h.bild).fertig.then(i => { if (i) ab.src = R_.umfaerben(i).toDataURL('image/webp', 0.85); });
      else ab.src = h.bild;
      box.append(ab); box.classList.add('mitbild');
    }
    const at = el('div', 'rb-ausbildungtext');
    at.append(el('p', '', String(h.text).replace(/ – /g, ' – ')));
    // Knopf gefüllt in Hausfarbe (MZ, 24.10.2026); ohne Link nur sichtbar (Musterfirma)
    const ak = el('a', 'knopf zweit rb-webknopf', h.knopf || 'Zur Website');
    if (h.link) { ak.href = h.link; ak.target = '_blank'; ak.rel = 'noopener'; } else ak.setAttribute('aria-disabled', 'true');
    at.append(ak); box.append(at);
    abKasten.append(box);
  }
  // Satz der Gedankenwolke: rahmen.abschlussbild.<stufe>.<stimmung> (Text Writer, 3 Sätze, Zufall); fehlt er, die Bewertung
  const TEXT_STIMMUNG = { begeistert: 'begeistert', gut: 'gluecklich', neutral: 'neutral', skeptisch: 'skeptisch', schlecht: 'sauer' };
  function satzFuer(stimmung, bewertungText, ausgeschieden) {
    const A = ((window.ROHRBRUCH && window.ROHRBRUCH.rahmen && window.ROHRBRUCH.rahmen.abschlussbild) || {})[SP.stufe] || {};
    const liste = (ausgeschieden && A.ausgeschieden) || A[TEXT_STIMMUNG[stimmung]] || (stimmung === 'schlecht' && A.beschaemt) || [];
    const s = Array.isArray(liste) ? liste[Math.floor(Math.random() * liste.length)] : liste;
    return s || bewertungText || '';
  }
  let abschlussDaten = null;
  function abschlussVorbereiten(p, info) {
    info = info || {};
    const stimmung = info.ausgeschieden ? 'schlecht' : stimmungFuer(p);
    abschlussDaten = { p, stimmung };
    const f = RB.stufenFigur && RB.stufenFigur(stimmung);
    abFigur.hidden = !(f && f.info);
    if (!abFigur.hidden) {
      abFigur.style.setProperty('--seite', f.info.w / f.info.h);
      abFigurBild.removeAttribute('src');
      if (f.info.logo) {
        const [x, y, w, h] = f.info.logo;
        Object.assign(abFigurLogo.style, { display: '', left: x * 100 + '%', top: y * 100 + '%', width: w * 100 + '%', height: h * 100 + '%' });
      } else abFigurLogo.style.display = 'none';
      f.url.then(u => { if (u) abFigurBild.src = u; });
    }
    abSatz.textContent = satzFuer(stimmung, info.bewertung, info.ausgeschieden);
    const aus = K.ausbildung, prak = K.praktikum;
    const zuerst = p >= 700 ? [aus, prak] : [prak, aus];
    kastenBauen(zuerst.find(hinweisAn) || null);
  }
  function abschlussLayout() { abschluss.classList.toggle('quer', innerWidth > innerHeight * 1.1); }
  function abschlussZeigen() {
    abschlussLayout();
    abschluss.classList.remove('da');
    abschluss.hidden = false;
    abschluss.scrollTop = 0;
    requestAnimationFrame(() => requestAnimationFrame(() => abschluss.classList.add('da')));
    (nk || abschluss).focus && nk.focus({ preventScroll: true });
  }
  weiterKnopf.addEventListener('click', abschlussZeigen);
  // „Nochmal spielen“ startet über den Rahmen neu (Endbild verschwindet) – dann auch das Abschlussbild schließen
  new MutationObserver(() => { if (ende.hidden) abschluss.hidden = true; }).observe(ende, { attributes: true, attributeFilter: ['hidden'] });
  addEventListener('resize', abschlussLayout);
  RB.abschlussZeigen = abschlussZeigen;   // Testhilfe
  // „Nochmal spielen“ schließt das Abschlussbild auch, wenn kein Punkte-Bild davor war (ausgeschieden)
  if (nk) nk.addEventListener('click', () => { abschluss.hidden = true; });
  // Schnittstelle für spiel.js (Verlierer-Logik, Developer B):
  //   RB.schirme.abschluss({ ausgeschieden: true })  – direkt das Abschlussbild ohne Punkte-Bild: Figur unglücklich (Azubi
  //     beschämt, Geselle/Meister sauer), Gedanke aus rahmen.abschlussbild.<stufe>.ausgeschieden (sonst wie „sauer/beschämt“),
  //     Praktikums-Kasten (aus: Ausbildung), Knöpfe „Nochmal spielen“/„Zum Menü“
  //   RB.schirme.abschluss({ punkte: 850, bewertung: 'Sauber gearbeitet' })  – normales Abschlussbild (sonst über „Weiter“)
  RB.schirme = Object.assign(RB.schirme || {}, {
    abschluss(opt) {
      opt = opt || {};
      abschlussVorbereiten(opt.ausgeschieden ? 0 : (opt.punkte != null ? opt.punkte : zielWert), opt);
      abschlussZeigen();
    },
  });

  let zielWert = 0, lauf = 0;
  function nadelStellen(v) {
    nadel.style.transform = `rotate(${-135 + Math.max(0, Math.min(1000, v)) / 1000 * 270}deg)`;
  }
  // Zahl im Manometer (Rahmen schreibt sie in .wert; „Punkte“ steht klein im Zifferblatt)
  function zahlSchreiben(v) {
    const t = Math.round(v).toLocaleString('de-DE');
    const n = [...wert.childNodes].find(k => k.nodeType === 3);
    if (n) n.nodeValue = t; else wert.prepend(document.createTextNode(t));
  }
  // Zeiger und Zahl zählen gemeinsam von 0 hoch (MZ, 24.10.2026), 2,4s mit leichtem Überschwingen wie ein echter Zeiger;
  // die Zahl bleibt dabei nie über dem Endwert. Weniger Bewegung: sofort der Endwert.
  const bezier = (x1, y1, x2, y2) => t => {   // CSS cubic-bezier als Funktion
    const f = (a, b, u) => 3 * a * u * (1 - u) * (1 - u) + 3 * b * u * u * (1 - u) + u * u * u;
    let lo = 0, hi = 1, u = t;
    for (let i = 0; i < 24; i++) { u = (lo + hi) / 2; if (f(x1, x2, u) < t) lo = u; else hi = u; }
    return f(y1, y2, u);
  };
  const schwung = bezier(0.28, 1.1, 0.36, 1);
  function hochzaehlen(p) {
    const nr = ++lauf;
    // Ton (klang.js, Phase 4): Manometer tickt beim Hochzählen (ca. 16 Ticks, Tonhöhe leicht steigend), am Ende ein Akzent
    const ton = (n, o) => { try { if (RB.klang) RB.klang.ton(n, o); } catch (e) { /* Ton ist Beiwerk */ } };
    if (RB.ruhig) { nadelStellen(p); zahlSchreiben(p); ton('akzent', { verzoegerung: 0.3 }); return; }
    nadelStellen(0); zahlSchreiben(0);
    const t0 = performance.now() + 250, dauer = 2400;
    const TICKS = 16, stufe = Math.max(1, p / TICKS);
    let naechster = stufe, tickZeit = 0, akzent = false;
    const schritt = jetzt => {
      if (nr !== lauf || ende.hidden) return;
      const q = Math.max(0, Math.min(1, (jetzt - t0) / dauer)), v = p * schwung(q);
      nadelStellen(v); zahlSchreiben(Math.min(p, Math.max(0, v)));
      if (v >= naechster && naechster < p - stufe / 2 && jetzt - tickZeit > 55) {
        tickZeit = jetzt; ton('klick', { faktor: 0.55, vari: 0.02, rate: 0.9 + 0.35 * Math.min(1, v / Math.max(1, p)) });
        while (naechster <= v) naechster += stufe;
      }
      if (!akzent && v >= p * 0.995) { akzent = true; ton('akzent'); }
      if (q < 1) requestAnimationFrame(schritt); else { zahlSchreiben(p); if (!akzent) { akzent = true; ton('akzent'); } }
    };
    requestAnimationFrame(schritt);
  }
  nadelStellen(0);
  RB.endbild = function (p, info) {
    zielWert = p;
    abschlussVorbereiten(p, info);
    stufeEnde.textContent = 'Stufe ' + info.stufe;
    // Der Rahmen markiert die schwächste Zeile – sind alle Einsätze gleich gut, gibt es keine schwächste
    const erg = info.ergebnisse || [];
    // (Anteil vergleichen: der letzte Einsatz zählt 334 statt 333)
    const anteil = e => e.summe / (e.max || 333);
    if (erg.length > 1 && erg.every(e => anteil(e) === anteil(erg[0])))ende.querySelectorAll('.auswertung .zeile.schlecht').forEach(z => z.classList.remove('schlecht'));
    nadelStellen(0); zahlSchreiben(0);
    // Aufschlüsselung: Summen über die Einsätze (Tipp vom Meister als eigener Abzug)
    teile.textContent = '';
    const summe = k => erg.reduce((a, e) => a + (+e[k] || 0), 0);
    if (erg.length && erg.every(e => e.ursache != null)) {
      const max = { ursache: 150 * erg.length, werkzeug: 60 * erg.length, reparieren: 60 * erg.length, tempo: erg.reduce((a, e) => a + (e.tempoMax || 63), 0) };
      [['Ursache', 'ursache'], ['Werkzeug', 'werkzeug'], ['Reparatur', 'reparieren'], ['Tempo', 'tempo']].forEach(([n, k], i) => {
        const t = el('div', 'rb-endteil'); t.style.animationDelay = (1.5 + i * 0.08) + 's';
        const w = summe(k);
        t.append(el('span', '', n), el('b', '', w.toLocaleString('de-DE')), el('small', '', '/' + max[k].toLocaleString('de-DE')));
        if (w < max[k] * 0.6) t.classList.add('schwach');
        teile.append(t);
      });
      const tipp = summe('tipp');
      if (tipp) { const t = el('div', 'rb-endteil tipp'); t.style.animationDelay = '1.82s'; t.append(el('span', '', 'Tipp'), el('b', '', '−' + Math.abs(tipp))); teile.append(t); }
    }
    teile.hidden = !teile.children.length;
    // fünf Bewertungsstufen in einer Zeile, die erreichte hervorgehoben
    stufenZeile.textContent = '';
    (info.stufen || []).forEach(([grenze, name], i) => {
      if (i) stufenZeile.append(document.createTextNode(' – '));
      const sp = el('span', name === info.bewertung ? 'jetzt' : '', (grenze ? 'ab ' + grenze.toLocaleString('de-DE') + ' ' : '') + name);
      stufenZeile.append(sp);
    });
    stufenZeile.hidden = !stufenZeile.childNodes.length;
    hatStufen = !stufenZeile.hidden;
  };
  let hatStufen = false;
  function endLayout() { ende.classList.toggle('quer', innerWidth > innerHeight * 1.15 && innerHeight < 700 || innerWidth > 900); bewertungEinpassen(); einpassen(); knoepfeFest(); }
  // Bewertung neben Manometer + Figur (quer flach): ein langes Wort („Meisterleistung“) bekommt die Schrift, die es braucht (bis 15 px)
  function bewertungEinpassen() {
    ue.style.fontSize = '';
    if (ende.hidden) return;
    let px = parseFloat(getComputedStyle(ue).fontSize);
    // Textbreite über einen Range messen (der Rahmen kürzt mit „…“, scrollWidth rundet)
    const breite = () => { const r = document.createRange(); r.selectNodeContents(ue); return r.getBoundingClientRect().width; };
    const platz = ue.parentElement.clientWidth;
    while (breite() > platz - 1 && px > 15) { px -= 1; ue.style.fontSize = px + 'px'; }
  }
  // Spielertest 25.10.2026: nichts liegt unter der festen Knopfleiste. Passt die Karte nicht auf den Bildschirm, wird zuerst das
  // Manometer kleiner (hochkant bis 150 px, quer bis 140 px); reicht das nicht, steht die Knopfleiste ganz normal am Ende der Karte
  // (Klasse lang, nicht mehr fest) – dann wird nur gescrollt, verdeckt wird nichts.
  // Reihenfolge: 1. Manometer etwas kleiner (bis 220 bzw. quer 170 px) mit Stufen-Zeile; 2. ohne die (optionale) Stufen-Zeile,
  // Manometer bis 150/140 px; 3. passt es nicht: volles Manometer, Knopfleiste am Ende (lang) – gescrollt wird, verdeckt nichts.
  function einpassen() {
    if (ende.hidden) return;
    const quer = ende.classList.contains('quer');
    ende.classList.remove('lang');
    const zuHoch = () => ende.scrollHeight > ende.clientHeight + 1;
    const versuch = min => {
      endkarte.style.removeProperty('--mano');
      let m = manoBox.getBoundingClientRect().width;
      while (zuHoch() && m > min) { m = Math.max(min, m - 6); endkarte.style.setProperty('--mano', m + 'px'); }
      return !zuHoch();
    };
    stufenZeile.hidden = !hatStufen;
    if (versuch(quer ? 170 : 220)) return;
    stufenZeile.hidden = true;
    if (versuch(quer ? 140 : 150)) return;
    endkarte.style.removeProperty('--mano');
    stufenZeile.hidden = !hatStufen;
    ende.classList.add('lang');
  }
  // Knopfleiste „fest“ (Schatten), solange die Karte unter dem sichtbaren Rand weitergeht
  function knoepfeFest() {
    if (ende.hidden) return;
    knoepfe.classList.toggle('fest', !ende.classList.contains('lang') && rechts.getBoundingClientRect().bottom > ende.getBoundingClientRect().bottom - 4);
  }
  ende.addEventListener('scroll', knoepfeFest, { passive: true });
  new MutationObserver(() => {
    if (ende.hidden) return;
    endLayout();
    hochzaehlen(zielWert);
    requestAnimationFrame(() => { einpassen(); knoepfeFest(); });
    setTimeout(einpassen, 400);   // Ausbildungs-Bild, Bestwert-Zeile
    setTimeout(knoepfeFest, 1600);   // nach den Einblend-Animationen
  }).observe(ende, { attributes: true, attributeFilter: ['hidden'] });
  endLayout();
})();
