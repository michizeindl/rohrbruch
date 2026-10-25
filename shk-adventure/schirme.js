// Rohrbruch – Start- und Endbild im Stil „Heizungs-Display“ (MZ, 24.10.2026, Variante B), sammlungs-eigen:
// Der Rahmen baut Start- und Endbild wie immer (Texte, Bestwert, Knöpfe); dieses Skript ordnet seine Teile neu an.
// Start: gestaltete Therme (bilder/startbild.webp, Blende #00FF00 → Hausfarbe), Display mit „Rohrbruch“ in Punktschrift,
// Frage, Stufe und Bestwert im Display, kleines Manometer (Bestwert) im runden Feld, Logo quer oben links.
// Ende: Karte wie ein Gerätedeckel, großes Manometer – Zeiger dreht auf die Punkte –, Bewertung in Markenfarbe,
// Zeit als Plakette, Aufschlüsselung, Einsätze, Ausbildungs-Hinweis.
(function () {
  'use strict';
  const R_ = window.Rahmen, F = R_.farben, K = R_.kunde, RB = window.RB, SP = RB.spiel;
  const $ = s => document.querySelector(s);
  function el(tag, klasse, text) { const e = document.createElement(tag); if (klasse) e.className = klasse; if (text != null) e.textContent = text; return e; }
  document.documentElement.classList.add('stil-rohrbruch');

  // ---------- Startbild ----------
  const start = $('#startSchirm'), karte = start.querySelector('.karte');
  const geraet = el('canvas', 'rb-geraet');
  const logo = el('img', 'rb-logoquer'); logo.src = K.logoQuer || K.logoAufHell || K.logo; logo.alt = K.firma || '';
  const display = el('div', 'rb-display'), punkte = el('canvas', 'rb-punkte');
  const dzeile = el('div', 'rb-dzeile'), dstufe = el('span', 'rb-dstufe');
  const mano = el('canvas', 'rb-startmano');
  const unten = el('div', 'rb-unten'), stufentext = el('p', 'rb-stufentext');
  const titel = karte.querySelector('.titel'), unter = karte.querySelector('.unter'), anleitung = karte.querySelector('.anleitung');
  const tafel = karte.querySelector('.besttafel'), los = karte.querySelector('#losKnopf'), menue = karte.querySelector('a.knopf'), quellen = karte.querySelector('.quellen');
  titel.classList.add('rb-unsichtbar');
  dzeile.append(dstufe, tafel);
  tafel.querySelector('.name').textContent = 'Bestwert';   // im Display kurz
  // MZ (nach dem Release, 25.10.2026): Frage „Findest du den Fehler im System?“ im Display ersatzlos gestrichen (am Handy
  // abgeschnitten) – Schriftzug größer, darunter Stufe und Bestwert. Die Frage bleibt nur unsichtbar im Dokument (Rahmen schreibt sie).
  unter.style.setProperty('display', 'none', 'important');
  display.append(titel, punkte, dzeile, unter);
  unten.append(anleitung, stufentext, los);
  if (menue) unten.append(menue);
  unten.append(quellen);
  start.append(geraet, logo, display, mano, unten);
  karte.hidden = true;

  const bild = RB.bild('bilder/startbild.webp');
  let therme = null;
  bild.fertig.then(i => { if (i) { therme = R_.umfaerben(i); startLayout(); } });
  // Maße im Startbild (1024×1024, am Bild gemessen): Display innen, rundes Feld, Gerätefront
  const DISP = [214, 366, 809, 575], RUND = [715, 708, 60], FRONT = [115, 905], UNTEN_Y = 868;   // UNTEN_Y: unter der Gehäusefuge

  function stufeSchreiben() {
    const st = SP.STUFEN[SP.stufe];
    dstufe.textContent = 'Stufe ' + st.name;
    const t = (window.ROHRBRUCH.rahmen.stufen || {})[SP.stufe];
    // „Stufe Azubi: …“ wie im Wortlaut von MZ (24.10.2026)
    stufentext.textContent = t ? 'Stufe ' + st.name + ': ' + t : '';
  }
  function bestwert() { try { return +localStorage.getItem('mg:best:' + SP.def.id + ':' + (K.firma || '')) || 0; } catch (e) { return 0; } }

  let L = null;
  function startLayout() {
    if (start.hidden) return;
    const W = innerWidth, H = innerHeight, quer = W > H * 1.15;
    const logoH = Math.round(Math.min(46, Math.max(30, H * 0.06)));
    let s, ix, iy;
    if (!quer) {
      const blockH = 250;
      s = Math.min(W * 0.92 / 595, (H - logoH - 40 - blockH) / (UNTEN_Y - DISP[1]), 1.05);
      const gesamt = logoH + 18 + (UNTEN_Y - DISP[1]) * s + blockH;
      const oben = Math.max(12, (H - gesamt) / 2 * 0.8);
      const dispTop = oben + logoH + 18;
      ix = W / 2 - 511.5 * s; iy = dispTop - DISP[1] * s;
      Object.assign(logo.style, { left: Math.max(12, ix + FRONT[0] * s) + 'px', top: oben + 'px', height: logoH + 'px' });
      const bx = Math.max(14, ix + FRONT[0] * s + 10), bw = Math.min(W - 28, (FRONT[1] - FRONT[0]) * s - 20);
      Object.assign(unten.style, { left: (W - bw) / 2 + 'px', width: bw + 'px', top: iy + UNTEN_Y * s + 'px', bottom: '' });
      unten.classList.remove('seite');
      void bx;
    } else {
      s = Math.min((H - 40) / (404 + 70), W * 0.55 / (FRONT[1] - FRONT[0]), 1);
      const dispTop = Math.max(14, (H - (404 + 70) * s) / 2);
      ix = W * 0.38 - 511.5 * s; iy = dispTop - DISP[1] * s;
      Object.assign(logo.style, { left: '14px', top: '12px', height: logoH + 'px' });
      const x0 = ix + FRONT[1] * s + 18;
      const bw = Math.min(360, Math.max(180, W - x0 - 16));
      Object.assign(unten.style, { left: x0 + Math.max(0, (W - x0 - bw) / 2 - 8) * 0.5 + 'px', width: bw + 'px', top: '', bottom: '' });
      unten.classList.add('seite');
      unten.style.top = Math.max(12, (H - unten.offsetHeight) / 2) + 'px';
    }
    L = { s, ix, iy, W, H };
    Object.assign(display.style, { left: ix + DISP[0] * s + 'px', top: iy + DISP[1] * s + 'px', width: (DISP[2] - DISP[0]) * s + 'px', height: (DISP[3] - DISP[1]) * s + 'px' });
    display.style.setProperty('--dw', (DISP[2] - DISP[0]) * s + 'px');
    const r = RUND[2] * s;
    Object.assign(mano.style, { left: ix + RUND[0] * s - r + 'px', top: iy + RUND[1] * s - r + 'px', width: 2 * r + 'px', height: 2 * r + 'px' });
    zeichneGeraet();
    zeichnePunkte();
    zeichneMano(bestwert());
  }
  function zeichneGeraet() {
    const { g, w, h } = RB.leinwand(geraet);
    g.fillStyle = '#e4e0d8'; g.fillRect(0, 0, w, h);
    if (!therme || !L) return;
    const { s, ix, iy } = L, b = 1024 * s;
    // Wand: einfarbig in der Wandfarbe des Bildes, das Bild läuft an den Seiten weich in die Wand aus.
    // Gehäuse unten: untere Bildzeilen nach unten fortgesetzt (Gerät reicht bis zum Bildschirmrand)
    g.fillStyle = wandFarbe(); g.fillRect(0, 0, w, h);
    if (iy + b < h) g.drawImage(therme, 0, 990, 1024, 34, ix, iy + b - 1, b, h - iy - b + 1);
    if (iy > 0) g.drawImage(therme, 0, 0, 1024, 24, ix, 0, b, iy + 1);
    g.drawImage(therme, ix, iy, b, b);
    const rand = Math.min(90, 100 * s);
    [[ix, ix + rand], [ix + b, ix + b - rand]].forEach(([a, z]) => {
      if (a <= 0 && z <= 0 || a >= w && z >= w) return;
      const v = g.createLinearGradient(a, 0, z, 0); v.addColorStop(0, wandFarbe()); v.addColorStop(1, wandFarbe(0));
      g.fillStyle = v; g.fillRect(Math.min(a, z), 0, Math.abs(z - a), h);
    });
  }
  let wand = null;
  function wandFarbe(a) {   // mittlere Farbe der Wand links neben der Therme
    if (!wand && RB.geladen(bild)) {
      const k = document.createElement('canvas'); k.width = 60; k.height = 400;
      const kg = k.getContext('2d'); kg.drawImage(bild, 20, 300, 60, 400, 0, 0, 60, 400);
      const d = kg.getImageData(0, 0, 60, 400).data; let r = 0, gg = 0, bb = 0, n = 0;
      for (let i = 0; i < d.length; i += 16) { r += d[i]; gg += d[i + 1]; bb += d[i + 2]; n++; }
      wand = [r / n, gg / n, bb / n].map(Math.round);
    }
    const c = wand || [228, 224, 216];
    return `rgba(${c[0]},${c[1]},${c[2]},${a == null ? 1 : a})`;
  }
  function zeichnePunkte() {
    const { g, w, h } = RB.leinwand(punkte);
    g.clearRect(0, 0, w, h);
    const farbe = R_.toenen(F.haupt, 0.62);   // helle Display-Farbe wie bisher die Punktschrift
    // Schriftzug „Rohrbruch!“ (Developer A, ../schrift/schriftzug.js) mit leichtem Leuchten wie ein Display; ohne Datei die Punktschrift
    if (window.Schriftzug && Schriftzug.zeichne) {
      const sv = Schriftzug.seitenverhaeltnis || 5.76, b = Math.min(w * 0.92, h * sv * 0.96), hb = b / sv;
      g.save(); g.shadowColor = R_.mitAlpha(F.haupt, 0.9); g.shadowBlur = Math.max(4, hb * 0.12);
      Schriftzug.zeichne(g, (w - b) / 2, (h - hb) / 2, b, farbe, { linie: true });
      g.restore();
    } else RB.punktschrift(g, 'Rohrbruch', 0, 0, w, h, farbe, 'rgba(255,255,255,.05)');
  }
  // Hausschrift Barlow für die Leinwand-Zahlen (Manometer): nach dem Laden neu zeichnen
  if (document.fonts && document.fonts.load) document.fonts.load('700 20px Barlow').then(() => { if (!start.hidden) startLayout(); }).catch(() => {});
  function zeichneMano(best) {
    const { g, w, h } = RB.leinwand(mano);
    g.clearRect(0, 0, w, h);
    const r = Math.min(w, h) / 2;
    RB.manometer(g, w / 2, h / 2, r * 0.92, { wert: best, max: 1000, schritt: 200, flaeche: true, ohneZahlen: true });
    g.fillStyle = '#555'; g.font = `700 ${Math.max(7, r * 0.2)}px Barlow, system-ui, sans-serif`; g.textAlign = 'center';
    g.fillText(best.toLocaleString('de-DE'), w / 2, h / 2 + r * 0.55);
  }
  new MutationObserver(() => { if (!start.hidden) { stufeSchreiben(); requestAnimationFrame(startLayout); } }).observe(start, { attributes: true, attributeFilter: ['hidden'] });
  addEventListener('resize', () => { startLayout(); endLayout(); });
  stufeSchreiben();
  requestAnimationFrame(startLayout);

  // ---------- Endbild ----------
  const ende = $('#endSchirm'), ek = ende.querySelector('.karte');
  const endkarte = el('div', 'rb-endkarte');
  const elogo = el('img', 'rb-logoquer'); elogo.src = logo.src; elogo.alt = K.firma || '';
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
  const ausbildung = el('div', 'rb-ausbildung');
  const A = K.ausbildung;
  if (A && A.text) {
    // kleines Bild „Azubi und Meister“ neben dem Satz (MZ, 24.10.2026), für Kunden ein eigenes Team-Foto (kunde.js)
    if (A.bild) {
      const ab = el('img', 'rb-ausbildungbild'); ab.alt = ''; ab.decoding = 'async';
      if (A.umfaerben) RB.bild(A.bild).fertig.then(i => { if (i) ab.src = R_.umfaerben(i).toDataURL('image/webp', 0.85); });
      else ab.src = A.bild;
      ausbildung.append(ab);
      ausbildung.classList.add('mitbild');
    }
    const at = el('div', 'rb-ausbildungtext');
    at.append(el('p', '', String(A.text).replace(/ – /g, ' – ')));
    // Knopf gefüllt in Hausfarbe mit weißer Schrift (MZ, 24.10.2026); Klasse „zweit“, damit er nicht wie der Hauptknopf leuchtet
    const ak = el('a', 'knopf zweit rb-webknopf', A.knopf || 'Zur Website');
    if (A.link) { ak.href = A.link; ak.target = '_blank'; ak.rel = 'noopener'; } else ak.setAttribute('aria-disabled', 'true');
    at.append(ak);
    ausbildung.append(at);
  }
  // Knöpfe nebeneinander in einer flachen Leiste (vorher untereinander, ca. 150 px hoch – verdeckte den Ausbildungs-Hinweis)
  const knoepfe = el('div', 'rb-endknoepfe'); knoepfe.append(nk); if (em) knoepfe.append(em); knoepfe.append(kk);
  rechts.append(text, ausw, bw);
  if (A && A.text) rechts.append(ausbildung);
  rechts.append(knoepfe);
  endkarte.append(kopfzeile, links, rechts);
  ende.append(endkarte);
  ek.hidden = true;

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
  function endLayout() { ende.classList.toggle('quer', innerWidth > innerHeight * 1.15 && innerHeight < 700 || innerWidth > 900); einpassen(); knoepfeFest(); }
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
