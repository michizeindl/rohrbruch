// Rohrbruch – lebender Hintergrund in den Räumen (Phase 3, Baustein 10, MZ 24.10.2026; Spieltest Phase 3, MZ 25.10.2026): dezent, nie hektisch.
// - Kaninchen Eleonore bei Herrn Brandl (nur WP, Kaninchen-Runde 25.10.2026): sitzt von Anfang an im Freigehege (V.gehege),
//   wechselt die Haltung wie die anderen; ZF-26 „Ausgebüxt“ über RB.leben.ausgebuext(true|false).
// - Katze Mimi bei Frau Huber, Hund Gustl bei Herrn Wimmer: kommen einmal ruhig ins Bild und BLEIBEN den Einsatz über; alle
//   20–40s wechseln sie ruhig die Haltung (Überblendung, Platz höchstens leicht, nie unter Stellen-Marken oder Hand-Zeichen).
//   Beim ersten Auftritt ein kurzer Zwischenruf der Kundin bzw. des Kunden (Figuren-Entwurf „Hund und Katze“, nie Kessel-Sätze).
// - Streicheln (MZ: ohne jeden Hinweis): Antippen des Tiers → Mimi schnurrt (Augen zu, leichtes Wippen), Gustl freut sich (wedelt).
// - Reaktionen über RB.leben.signal('gut'|'fehl'|'dunkel'|'hell'|'erledigt') und RB.leben.lappen(true|false) (Developer B ruft auf).
// - Licht, Dampf, Tropfen je Ort (orte.js varianten.X.leben, sonst Standard je Ort unten); ziehende Wolken in den Fenstern (FENSTER).
// - Tageszeit-Tönung: Einsatz 1 Morgen, 2 Mittag, 3 Nachmittag.
// Bei „Bewegung reduzieren“ (RB.ruhig): Tier steht still (keine Einblend-/Wipp-Bewegung), Haltung wechselt selten und hart,
// Reaktionen nur als Posenwechsel, leuchtende Augen ohne Blinzeln; Wolken, Dampf, Tropfen, Flackern aus; Tönung bleibt.
// Notizen für spätere Developer: Material/Uebergabe-Leben.md
(function () {
  'use strict';
  const RB = window.RB, R_ = window.Rahmen;
  const nb = t => String(t).replace(/ – /g, ' – ');
  const zufall = l => l[Math.floor(Math.random() * l.length)];
  const zwischen = (a, b) => a + Math.random() * (b - a);

  // Tiere: wer gehört zu wem, Posen (Höhe im Raum als Anteil an 1024). Alte Posen aus rohrbruch-tiere.png (rohrbruch-bilder.py
  // tiere), neue aus rohrbruch-tiere-2-*.png (Material/Bilder/rohrbruch-tiere2.py). posen bleibt { pose: Höhe } wie bisher.
  // POSEN: ar = Breite/Höhe des Bilds, augen = Augenmitten (Anteile des Bilds) für 'dunkel', r = Augenradius (Anteil der Höhe).
  const POSEN = {
    mimi: {
      sitzt: { h: 0.15, ar: 0.603, augen: [[0.33, 0.21], [0.555, 0.23]], r: 0.032 },
      schlaeft: { h: 0.085, ar: 1.597 },
      schnurrt: { h: 0.15, ar: 0.71 },
      putzt: { h: 0.149, ar: 0.757 },
      streckt: { h: 0.153, ar: 1.1 },
      springt: { h: 0.144, ar: 0.997, augen: [[0.775, 0.37], [0.905, 0.375]], r: 0.028 },
      liegtwach: { h: 0.102, ar: 1.14, augen: [[0.31, 0.345], [0.52, 0.355]], r: 0.036 },
      seitlich: { h: 0.15, ar: 0.9, augen: [[0.885, 0.185]], r: 0.022 },
    },
    gustl: {
      sitzt: { h: 0.24, ar: 0.57 },
      liegt: { h: 0.14, ar: 2.093 },
      gerade: { h: 0.24, ar: 0.567 },
      schief: { h: 0.236, ar: 0.607 },
      freudig: { h: 0.223, ar: 1.09 },
      lappen: { h: 0.225, ar: 1.137 },
      liegtwach: { h: 0.181, ar: 1.457 },
    },
    // Kaninchen Eleonore (Herr Brandl, nur WP, Kaninchen-Runde 25.10.2026), rohrbruch-tiere-3-kaninchen.png – h gilt für ein
    // Gehege von GEHEGE.ref Breite und wird mit der echten Gehegebreite (orte.js V.gehege.breite) umgerechnet
    eleonore: {
      sitzt: { h: 0.075, ar: 0.878 }, mummelt: { h: 0.07, ar: 1.194 }, liegt: { h: 0.041, ar: 2.583 },
      flackt: { h: 0.042, ar: 2.539 }, maennchen: { h: 0.085, ar: 0.578 }, duckt: { h: 0.049, ar: 1.678 },
    },
  };
  // Ruhe-Haltungen (für den Wechsel alle 20–40s) und Reaktionen je Tier
  const RUHE = { mimi: ['sitzt', 'schlaeft', 'putzt', 'liegtwach', 'seitlich'], gustl: ['gerade', 'sitzt', 'liegt', 'liegtwach'],
    eleonore: ['sitzt', 'mummelt', 'liegt', 'maennchen'] };
  const REAKTION = {
    mimi: { streicheln: ['schnurrt', 'schnurr', 2.8], gut: ['springt', 'hopser', 1.5], fehl: ['seitlich', '', 2.6], erledigt: ['schnurrt', 'schnurr', 2.6] },
    gustl: { streicheln: ['freudig', 'wedeln', 2.6], gut: ['freudig', 'wedeln', 2.2], fehl: ['schief', 'neigen', 2.6], erledigt: ['freudig', 'wedeln', 2.6] },
    // Eleonore (MZ): Streicheln = Ohren anlegen, Augen zu, entspannt auf die Seite „flacken“ (sanftes Atmen); gut = Männchen,
    // fehl = duckt sich kurz
    eleonore: { streicheln: ['flackt', 'atmen', 4.2], gut: ['maennchen', '', 2.0], fehl: ['duckt', '', 2.0], erledigt: ['maennchen', '', 2.2] },
  };
  // Tonhaken (Phase 4): Klänge dieses Namens in Rahmen.spiel({ klaenge }) eintragen – ohne Aufnahme bleibt es still
  // (Rahmen.ton spielt für unbekannte Namen nichts)
  const TON = { mimi: { streicheln: 'tier-schnurren', gut: 'tier-maunzen' }, gustl: { streicheln: 'tier-hecheln', gut: 'tier-bellen' } };   // Eleonore: still
  const TIERE = {
    mimi: { figur: 'huber', posen: Object.fromEntries(Object.entries(POSEN.mimi).map(([p, v]) => [p, v.h])) },
    gustl: { figur: 'wimmer', posen: Object.fromEntries(Object.entries(POSEN.gustl).map(([p, v]) => [p, v.h])) },
    // Eleonore wohnt im Freigehege: nur in Raumbildern mit Gehege (orte.js V.gehege = WP-A/B), sonst ist Herr Brandl ohne Tier
    eleonore: { figur: 'brandl', gehege: true, posen: Object.fromEntries(Object.entries(POSEN.eleonore).map(([p, v]) => [p, v.h])) },
  };
  // Freigehege (rohrbruch-gehege.png → Material/Bilder/rohrbruch-gehege.py): ar = Breite/Höhe der WebP, plaetze = Fußpunkte
  // Eleonores im geschlossenen Gehege (Anteile des Bilds: vor der Hütte, links, Mitte, vor dem Napf); vorn = vordere Gitterteile,
  // liegen über Eleonore
  const GEHEGE = { ar: 1.1864, ref: 420, zu: 'bilder/gehege-zu.webp', offen: 'bilder/gehege-offen.webp', vorn: 'bilder/gehege-zu-vorn.webp',
    plaetze: [[0.525, 0.476], [0.306, 0.622], [0.443, 0.655], [0.600, 0.590]] };
  RB.tierFuer = (figur, V) => {
    const t = Object.keys(TIERE).find(k => TIERE[k].figur === figur) || null;
    return t && TIERE[t].gehege && V && !V.gehege ? null : t;
  };
  // Bilder des Tiers im Einsatz (Offline-Liste in spiel.js durchgangDateien): alle Posen, bei Eleonore dazu das Gehege
  RB.tierDateien = (figur, V) => {
    const t = RB.tierFuer(figur, V);
    if (!t) return [];
    const l = Object.keys(TIERE[t].posen).map(p => RB.tierBild(t, p));
    return TIERE[t].gehege ? l.concat([GEHEGE.zu, GEHEGE.offen, GEHEGE.vorn]) : l;
  };
  RB.tierBild = (tier, pose) => `bilder/tier-${tier}-${pose}.webp`;
  RB.TIERE = TIERE;
  // Standard, solange ein Ort in orte.js noch keine eigenen Maße hat (Platzhalter-Räume)
  const STANDARD = { BA: { dampf: [[300, 560]] }, KU: { dampf: [[640, 500]] }, GW: { tropfen: [[520, 620]] }, DB: { lampe: [[512, 40, 140]] },
    HA: { tropfen: [[700, 600]] }, AT: { dampf: [[420, 300]] } };
  const ZEITEN = ['morgen', 'mittag', 'nachmittag'];

  // Fensterflächen je Raumbild (1024er Bildpunkte), nur Himmel: r = Rechteck [x0, y0, x1, y1] oder p = Vieleck; je Scheibe ein
  // Eintrag (Fensterkreuze bleiben frei). f = [y0, y1]: dort blendet die Wolkenschicht zum Horizont hin aus (Landschaft bleibt frei).
  // Ohne Fenster mit Himmel: HK-A/B (Lichtschacht, Milchglas), GW-A, WP-A/B (draußen, kaum Himmel).
  const FENSTER = {
    'BA-A': [{ r: [964, 0, 1024, 152], f: [118, 150] }],
    'BA-B': [{ r: [437, 61, 619, 122], f: [96, 120] }],
    'KU-A': [{ r: [335, 94, 680, 178], f: [150, 176] }],
    'KU-B': [{ r: [445, 0, 660, 60], f: [36, 58] }, { r: [691, 0, 877, 60], f: [36, 58] }],
    'GW-B': [{ r: [856, 19, 976, 200], f: [165, 198] }],
    'DB-A': [{ p: [[874, 85], [1017, 85], [1024, 98], [1024, 146], [810, 146], [783, 120]], f: [116, 144] }],
    'DB-B': [{ p: [[845, 40], [998, 40], [1024, 86], [1024, 99], [897, 99]], f: [80, 98] }],
    'AT-A': [{ r: [701, 129, 786, 219] }, { r: [796, 129, 887, 219] }, { r: [701, 254, 778, 317], f: [290, 315] }, { r: [803, 254, 887, 317], f: [290, 315] }],
    'AT-B': [{ r: [675, 114, 850, 244], f: [205, 242] }],
    'HA-A': [{ r: [691, 96, 828, 128], f: [110, 127] }],
    'HA-B': [{ p: [[755, 101], [933, 101], [933, 138], [860, 145], [755, 150]], f: [122, 148] }],
    'WZ-A': [{ r: [229, 89, 391, 154] }, { r: [229, 160, 391, 202], f: [180, 200] }, { r: [574, 85, 739, 150] }, { r: [574, 156, 739, 194], f: [172, 192] }],
    'WZ-B': [{ p: [[464, 87], [821, 106], [821, 236], [464, 236]], f: [205, 236] }],
    'BU-A': [{ p: [[760, 112], [821, 100], [821, 233], [760, 233]], f: [205, 233] }, { p: [[890, 100], [1024, 82], [1024, 243], [890, 243]], f: [215, 243] }],
    'BU-B': [{ p: [[463, 93], [777, 84], [777, 205], [463, 205]], f: [180, 205] }],
  };
  RB.FENSTER = FENSTER;

  let L = null;   // aktueller Raum
  RB.leben = {
    // ctx = { raum, ebene (Element für Tiere), ort, V, figur, nr, tiere: D.tiere, sichtbar() }
    start(ctx) {
      this.stop();
      L = Object.assign({ uhren: [], box: null, span: null, pose: null, ruhePose: null, blase: null, flacker: 0, naechstesFlackern: 4 + Math.random() * 8,
        gesagt: false, reaktion: null, reaktionUhr: 0, wechselUhr: 0, dunkel: false, lappen: false, weg: false }, ctx);
      ctx.raum.classList.remove(...ZEITEN.map(z => 'zeit-' + z), 'leben-dunkel');
      L.zeit = ZEITEN[Math.max(0, Math.min(2, (ctx.nr || 1) - 1))];
      ctx.raum.classList.add('zeit-' + L.zeit);
      L.cfg = ctx.V.leben || (ctx.V.platzhalter ? STANDARD[ctx.ort] : null) || {};
      const m = /raum-(\w+)-([ab])\./i.exec(ctx.V.bild || '');
      L.fenster = (m && FENSTER[m[1].toUpperCase() + '-' + m[2].toUpperCase()]) || null;
      L.wolken = null;
      L.tier = RB.tierFuer(ctx.figur, ctx.V);
      const testTier = /[#&]tier\b/.test(location.hash);   // Testhilfe #tier: gleich
      if (L.tier === 'eleonore') {
        // Eleonore sitzt von Anfang an im Gehege; der Zwischenruf kommt später, wenn der Raum zu sehen ist
        gehegeAufbauen();
        kommen(true, true);
        planen(rufen, testTier ? 1 : zwischen(6, 13));
      } else if (L.tier) planen(kommen, testTier ? 1 : zwischen(6, 13));
      L.klick = streichelnKlick;
      ctx.raum.addEventListener('click', L.klick);
      // Marken ändern sich (Untersuchen → Verstecke nach „Im Raum suchen“): liegt das Tier dann darunter, rückt es ruhig weiter
      const mk = ctx.raum.querySelector('.rb-marken');
      if (mk && window.MutationObserver) {
        L.beobachter = new MutationObserver(() => { clearTimeout(L.markenUhr); L.markenUhr = setTimeout(platzPruefen, 900); });
        L.beobachter.observe(mk, { childList: true });
      }
    },
    stop() {
      if (!L) return;
      L.uhren.forEach(clearTimeout);
      clearTimeout(L.reaktionUhr); clearTimeout(L.wechselUhr); clearTimeout(L.markenUhr);
      if (L.beobachter) L.beobachter.disconnect();
      L.raum.removeEventListener('click', L.klick);
      L.raum.classList.remove('leben-dunkel');
      if (L.box) L.box.remove();
      if (L.blase) L.blase.remove();
      if (L.gehege) { L.gehege.img.remove(); L.gehege.vorn.remove(); }
      L = null;
    },
    // ZF-26 „Ausgebüxt“ (Eleonore): an = Gehege offen und leer (wo sie sich versteckt, zeigt spiel.js), aus = Eleonore ist zurück
    // im geschlossenen Gehege. false, wenn es hier kein Gehege gibt (dann fällt der Zwischenfall aus)
    ausgebuext(an) {
      if (!L || !L.gehege) return false;
      if (an) {
        if (L.box) { L.box.remove(); L.box = null; L.span = null; L.pose = null; }
        if (L.blase) { L.blase.remove(); L.blase = null; }
        clearTimeout(L.wechselUhr); clearTimeout(L.reaktionUhr); L.reaktion = null;
        L.weg = true;
        L.gehege.img.src = GEHEGE.offen; L.gehege.vorn.hidden = true;
      } else {
        L.gehege.img.src = GEHEGE.zu; L.gehege.vorn.hidden = false;
        L.weg = false;
        kommen(true);
      }
      return true;
    },
    // Zwischenfall „wegtragen“ mit dem Tier: das Tier des lebenden Hintergrunds geht so lange; nach 45–70s kommt es ruhig wieder
    tierWeg() {
      if (!L) return;
      if (L.box) { L.box.remove(); L.box = null; L.span = null; L.pose = null; }
      if (L.blase) { L.blase.remove(); L.blase = null; }
      clearTimeout(L.wechselUhr); clearTimeout(L.reaktionUhr); L.reaktion = null; L.lappen = false;
      if (L.tier && !L.weg) { L.weg = true; planen(() => { L.weg = false; kommen(); }, zwischen(45, 70)); }
    },
    // welches Tier gerade im Raum sitzt: 'mimi' | 'gustl' | 'eleonore' | null
    tierDa() { return L && L.box ? L.tier : null; },
    // Reaktionen (nur, wenn das Tier im Raum ist); unbekannte Namen still ignorieren
    signal(name) {
      if (!L) return;
      if (name === 'dunkel' || name === 'hell') { dunkel(name === 'dunkel'); return; }
      if (!REAKTION.mimi[name] || name === 'streicheln' || !L.box) return;
      reagieren(name);
    },
    // Zwischenfall ZF-25 „Gustl klaut den Lappen“: Gustl zeigt die Pose mit dem Lappen im Maul (kommt dafür sofort) bis lappen(false)
    lappen(an) {
      if (!L) return false;
      if (an) {
        if (L.tier !== 'gustl') { if (L.box) return false; L.tier = 'gustl'; }
        L.lappen = true;
        clearTimeout(L.reaktionUhr); L.reaktion = null;
        if (!L.box) { L.gesagt = true; kommen(true); }
        else zeigen('lappen');
        return true;
      }
      if (!L.lappen) return false;
      L.lappen = false;
      if (L.box) zeigen(L.ruhePose && L.ruhePose !== 'lappen' ? L.ruhePose : 'gerade');
      wechselPlanen();
      return true;
    },
    // auf die Effekte-Leinwand (f = Maßstab Raumbild 1024 → Leinwand), t in Sekunden
    zeichnen(g, f, t, dt) {
      if (!L || RB.ruhig) return;
      const c = L.cfg;
      if (L.fenster) wolken(g, f, t);
      (c.lampe || []).forEach(([x, y, r]) => lampe(g, x * f, y * f, r * f, t, dt));
      (c.dampf || []).forEach(([x, y]) => dampf(g, x * f, y * f, 150 * f, t));
      (c.tropfen || []).forEach(([x, y], i) => tropfen(g, x * f, y * f, 70 * f, t + i * 1.3));
    },
  };

  function planen(fn, sek) { if (L) L.uhren.push(setTimeout(fn, sek * 1000)); }

  // ---------- Tier ----------
  RB.ELEONORE_GROESSE = 1.22;
  const P = (pose, tier) => {
    const t = tier || L.tier, p = POSEN[t][pose];
    // Eleonore: Größe folgt der Gehegebreite im Raumbild
    // QA Handgriff-Runde (S3): Eleonore war auf dem Handy sehr klein – 22 % größer (passt noch ins Gehege, RB.ELEONORE_GROESSE)
    return p && t === 'eleonore' && L && L.gs ? Object.assign({}, p, { h: p.h * L.gs * RB.ELEONORE_GROESSE }) : p;
  };
  // Gehege als Raum-Ebene (.rb-overlays: wird mit dem Raumbild getönt und im „Ausschnitt“ mitgezeichnet), die vorderen
  // Gitterteile in der Tier-Ebene über Eleonore
  function gehegeAufbauen() {
    const g = L.V.gehege, hoch = g.breite / GEHEGE.ar;
    L.gs = g.breite / GEHEGE.ref;
    const lage = el => Object.assign(el.style, { left: g.x / 10.24 + '%', top: g.y / 10.24 + '%', width: g.breite / 10.24 + '%', height: hoch / 10.24 + '%' });
    const img = document.createElement('img');
    img.className = 'rb-overlay rb-gehege'; img.alt = ''; img.draggable = false; img.src = GEHEGE.zu;
    lage(img);
    (L.raum.querySelector('.rb-overlays') || L.ebene).append(img);
    const vorn = document.createElement('img');
    vorn.className = 'rb-gehegevorn'; vorn.alt = ''; vorn.draggable = false; vorn.src = GEHEGE.vorn;
    lage(vorn);
    L.ebene.append(vorn);
    new Image().src = GEHEGE.offen;   // für den Zwischenfall schon laden
    L.gehege = { img, vorn, plaetze: GEHEGE.plaetze.map(([fx, fy]) => [Math.round(g.x + fx * g.breite), Math.round(g.y + fy * hoch)]) };
  }
  // Raum-Rechtecke der Marken (Stellen und Verstecke) in 1024er Bildpunkten
  function markenRechtecke() {
    const R0 = L.raum.getBoundingClientRect(), k = 1024 / (L.raum.clientWidth || 1024);
    return [...L.raum.querySelectorAll('.rb-marken .rb-marke')].map(m => {
      const q = m.getBoundingClientRect();
      return [(q.left - R0.left - 6) * k, (q.top - R0.top - 6) * k, (q.right - R0.left + 6) * k, (q.bottom - R0.top + 6) * k];
    }).filter(r => r[2] > r[0]);
  }
  const ueberlapp = (a, b) => Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
  const tierRechteck = (x, y, pose) => { const p = P(pose), h = p.h * 1024, w = h * p.ar * 0.86; return [x - w / 2, y - h * 0.92, x + w / 2, y]; };
  // Platz für eine Pose: Plätze aus orte.js (tierPlatz), notfalls leicht seitlich verschoben – der ohne Überschneidung mit Marken
  // gewinnt (sonst die kleinste Überschneidung); nahe am bisherigen Platz bevorzugt
  function platzWaehlen(pose, nahBei) {
    // Eleonore bleibt im Gehege (feste Plätze, nicht seitlich verschieben)
    const plaetze = L.gehege ? L.gehege.plaetze : L.V.tierPlatz || [[300, 940], [720, 940]], marken = markenRechtecke();
    const p = P(pose), halb = p.h * 1024 * p.ar / 2 + 8;
    let beste = null, bw = Infinity;
    plaetze.forEach(([x, y], i) => (L.gehege ? [0] : [0, -70, 70, -140, 140]).forEach(dx => {
      const xx = L.gehege ? x : Math.max(halb, Math.min(1024 - halb, x + dx));
      const r = tierRechteck(xx, y, pose);
      const ue = marken.reduce((a, m) => a + ueberlapp(r, m), 0);
      const weg = nahBei ? Math.hypot(xx - nahBei[0], y - nahBei[1]) : 0;
      const w = ue * 10 + Math.abs(dx) * 2 + (nahBei ? weg * 0.5 : Math.random() * 120) + i;
      if (w < bw) { bw = w; beste = [xx, y]; }
    }));
    return beste;
  }
  // sofort: ohne auf den sichtbaren Raum zu warten (Lappen, Eleonore); still: ohne Einblend-Bewegung (Eleonore sitzt schon da)
  function kommen(sofort, still) {
    if (!L || L.box) return;
    if (!sofort && !L.sichtbar()) { planen(kommen, 4); return; }
    const pose = L.lappen ? 'lappen' : (L.dunkel && L.tier === 'mimi' ? 'sitzt' : zufall(RUHE[L.tier]));
    const [x, y] = platzWaehlen(pose);
    const box = document.createElement('div');
    box.className = 'rb-tierbox ' + L.tier + (RB.ruhig || still ? '' : ' rein');
    box.style.left = x / 10.24 + '%'; box.style.top = y / 10.24 + '%';
    L.gespiegelt = Math.random() < 0.5;
    box.classList.toggle('gespiegelt', L.gespiegelt);
    // Eleonore sitzt hinter den vorderen Gitterteilen
    if (L.gehege && L.gehege.vorn.parentNode === L.ebene) L.ebene.insertBefore(box, L.gehege.vorn); else L.ebene.append(box);
    L.box = box; L.platz = [x, y];
    if (!L.lappen) L.ruhePose = pose;
    zeigen(pose, true);
    if (L.tier !== 'eleonore') rufen();
    wechselPlanen();
  }
  // beim ersten Auftritt je Einsatz: Zwischenruf der Kundin bzw. des Kunden. Sätze mit „Kessel“ nie – das Tier sitzt im
  // lebenden Hintergrund immer auf dem Boden, nie auf dem Kessel (QA Phase 3; „Mimi auf dem Kessel“ gibt es nur als Zwischenfall)
  // Seit das Tier bleibt (MZ 25.10.2026), passen Sätze, die das Hinaustragen ankündigen („Ich trag sie kurz raus.“), nicht mehr.
  // Eleonore: eigener Zeitpunkt (sie sitzt schon beim Betreten im Gehege), erst wenn der Raum zu sehen ist.
  function rufen() {
    if (!L || L.gesagt) return;
    if (!L.box || !L.sichtbar()) { planen(rufen, 4); return; }
    const rufe = ((L.tiere || {})[L.tier] || []).filter(r => !/Kessel|\braus\b/.test(r));
    if (!rufe.length) return;
    L.gesagt = true;
    const [x, y] = L.platz, pose = L.pose, box = L.box;
    const b = document.createElement('div');
    b.className = 'rb-tierblase'; b.textContent = nb(zufall(rufe));
    L.ebene.append(b); L.blase = b;
    const zeigenBlase = () => { if (L && L.blase === b) blasePlatz(b, x / 10.24, y / 10.24, P(pose).h * 100); };
    zeigenBlase();
    // Bild evtl. noch nicht geladen: nach dem Laden die Lage noch einmal prüfen
    const img = box.querySelector('img'); if (img && !img.complete) img.addEventListener('load', zeigenBlase, { once: true });
    L.uhren.push(setTimeout(() => { b.classList.add('weg'); L && L.uhren.push(setTimeout(() => { b.remove(); if (L && L.blase === b) L.blase = null; }, 600)); }, 4200));
  }
  // Pose zeigen: neue Bild-Ebene über der alten, alte blendet aus (ruhig: harter Wechsel). Augen-Ebene gehört zur Pose.
  function zeigen(pose, erstes, anim) {
    if (!L || !L.box) return;
    const p = P(pose);
    if (!p) return;
    if (pose === L.pose && L.span) { animation(anim); augenSetzen(); return; }
    const span = document.createElement('span');
    span.className = 'rb-tierpose';
    span.style.setProperty('--h', p.h);
    const img = document.createElement('img');
    img.alt = ''; img.draggable = false; img.src = RB.tierBild(L.tier, pose);
    span.append(img);
    const alt = L.span;
    L.box.append(span);
    L.span = span; L.pose = pose;
    if (alt) {
      if (RB.ruhig) alt.remove();
      else {
        span.classList.add('neu');
        requestAnimationFrame(() => requestAnimationFrame(() => { span.classList.remove('neu'); alt.classList.add('weg'); }));
        setTimeout(() => alt.remove(), 700);
      }
    }
    animation(anim);
    augenSetzen();
    hitVorbereiten(pose);
  }
  function animation(anim) {
    if (!L || !L.span) return;
    const img = L.span.querySelector('img');
    img.className = '';
    if (anim && !RB.ruhig) { void img.offsetWidth; img.className = 'anim-' + anim; }
  }
  // Haltung wechseln alle 20–40s (ruhig: alle 60–90s, hart); Mimi wacht über „streckt“ auf
  function wechselPlanen() {
    if (!L) return;
    clearTimeout(L.wechselUhr);
    L.wechselUhr = setTimeout(wechseln, (RB.ruhig ? zwischen(60, 90) : zwischen(20, 40)) * 1000);
  }
  function wechseln() {
    if (!L || !L.box) return;
    if (L.reaktion || L.lappen) { L.wechselUhr = setTimeout(wechseln, 5000); return; }
    let liste = RUHE[L.tier].filter(p => p !== L.ruhePose);
    if (L.dunkel && L.tier === 'mimi') liste = liste.filter(p => P(p).augen);
    const neu = zufall(liste.length ? liste : RUHE[L.tier]);
    const vorher = L.ruhePose;
    L.ruhePose = neu;
    // Platz leicht wechseln (selten, nie über Marken): ausblenden, am neuen Platz einblenden
    const umziehen = !RB.ruhig && Math.random() < 0.3;
    if (umziehen) {
      const ziel = platzWaehlen(neu, L.platz);
      if (ziel && Math.hypot(ziel[0] - L.platz[0], ziel[1] - L.platz[1]) > 30) { umsetzen(ziel, neu); wechselPlanen(); return; }
    }
    if (L.tier === 'mimi' && vorher === 'schlaeft' && !RB.ruhig && !L.dunkel) {
      zeigen('streckt');
      L.reaktion = 'aufwachen';
      L.reaktionUhr = setTimeout(() => { if (!L) return; L.reaktion = null; zeigen(L.ruhePose); platzPruefen(); }, 2600);
    } else { zeigen(neu); platzPruefen(); }
    wechselPlanen();
  }
  // Tier ruhig an einen anderen Platz setzen (Überblendung, kein Laufen über den Raum)
  function umsetzen(ziel, pose) {
    const box = L.box;
    box.classList.add('weg');
    setTimeout(() => {
      if (!L || L.box !== box) return;
      box.style.left = ziel[0] / 10.24 + '%'; box.style.top = ziel[1] / 10.24 + '%';
      L.platz = ziel;
      zeigen(pose);
      box.classList.remove('weg');
    }, RB.ruhig ? 0 : 750);
  }
  // nach Marken-Änderung oder Posenwechsel: liegt das Tier unter einer Marke, ruhig an einen freien Platz
  function platzPruefen() {
    if (!L || !L.box || !L.pose) return;
    const marken = markenRechtecke(), r = tierRechteck(L.platz[0], L.platz[1], L.pose);
    if (!marken.some(m => ueberlapp(r, m) > 0)) return;
    const ziel = platzWaehlen(L.pose, L.platz);
    if (!ziel || (ziel[0] === L.platz[0] && ziel[1] === L.platz[1])) return;
    if (marken.reduce((a, m) => a + ueberlapp(tierRechteck(ziel[0], ziel[1], L.pose), m), 0) >= marken.reduce((a, m) => a + ueberlapp(r, m), 0)) return;
    umsetzen(ziel, L.pose);
  }
  // Reaktion: kurze Pose (mit kleiner Bewegung), danach zurück zur Ruhe-Haltung; Lappen im Maul bleibt (nur Bewegung)
  function reagieren(art) {
    if (!L || !L.box) return;
    const [pose, anim, dauer] = REAKTION[L.tier][art];
    const ton = TON[L.tier] && TON[L.tier][art];
    if (ton && R_ && R_.ton) R_.ton(ton);
    if (L.lappen) { animation(L.tier === 'gustl' ? 'wedeln' : anim); return; }
    clearTimeout(L.reaktionUhr);
    L.reaktion = art;
    zeigen(pose, false, anim);
    L.reaktionUhr = setTimeout(() => {
      if (!L) return;
      L.reaktion = null;
      if (L.box && !L.lappen) { zeigen(L.ruhePose); platzPruefen(); }
    }, dauer * 1000);
  }
  // Licht aus (ZF-07/ZF-17): Tier dunkel, Mimis Augen leuchten (Pose mit offenen Augen); Licht an: wieder normal
  function dunkel(an) {
    L.dunkel = an;
    L.raum.classList.toggle('leben-dunkel', an);
    if (an && L.box && L.tier === 'mimi' && !L.reaktion && !P(L.pose).augen) {
      L.ruhePose = /schlaeft|liegtwach/.test(L.pose) ? 'liegtwach' : 'sitzt';
      zeigen(L.ruhePose);
    }
    augenSetzen();
  }
  function augenSetzen() {
    if (!L || !L.span) return;
    L.box.querySelectorAll('.rb-tieraugen').forEach(a => a.remove());
    const p = P(L.pose);
    if (!L.dunkel || L.tier !== 'mimi' || !p.augen) return;
    const a = document.createElement('span');
    a.className = 'rb-tieraugen';
    p.augen.forEach(([x, y], i) => {
      const d = document.createElement('i');
      d.style.left = x * 100 + '%'; d.style.top = y * 100 + '%';
      d.style.width = d.style.height = `calc(var(--h) * ${(p.r * 2 * 100).toFixed(2)}cqh)`;
      d.style.animationDelay = (i * 0.04) + 's';
      a.append(d);
    });
    L.span.append(a);
  }

  // ---------- Streicheln: Antippen des Tiers (ohne Hinweis, kein Punkteinfluss) ----------
  // Klick am Raum: Marken, Knöpfe, Nahansicht und Zwischenfall-Dinge haben Vorrang; getroffen zählt nur das Tier selbst
  // (Alpha-Test im Bild, über file:// ohne Alpha: Rechteck etwas kleiner)
  const hitDaten = {};
  function hitVorbereiten(pose) {
    const key = L.tier + '-' + pose;
    if (hitDaten[key] !== undefined) return;
    hitDaten[key] = null;
    const img = new Image();
    img.onload = () => {
      try {
        const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
        const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0);
        hitDaten[key] = { w: c.width, h: c.height, d: g.getImageData(0, 0, c.width, c.height).data };
      } catch (e) { hitDaten[key] = false; }
    };
    img.src = RB.tierBild(L.tier, pose);
  }
  function getroffen(e) {
    const img = L.span && L.span.querySelector('img');
    if (!img) return false;
    const q = img.getBoundingClientRect();
    if (!q.width) return false;
    // Eleonore ist klein: ein Fingerbreit um das Bild herum zählt mit (kein Alpha-Test)
    if (L.tier === 'eleonore') {
      const r = Math.max(12, q.height * 0.35);
      return e.clientX >= q.left - r && e.clientX <= q.right + r && e.clientY >= q.top - r && e.clientY <= q.bottom + r * 0.5;
    }
    let u = (e.clientX - q.left) / q.width, v = (e.clientY - q.top) / q.height;
    if (u < 0 || u > 1 || v < 0 || v > 1) return false;
    if (L.gespiegelt) u = 1 - u;
    const hd = hitDaten[L.tier + '-' + L.pose];
    if (!hd) return u > 0.1 && u < 0.9 && v > 0.08;
    // Finger ist dicker als ein Bildpunkt: in einem kleinen Umkreis nach deckenden Bildpunkten suchen
    const px = Math.round(u * (hd.w - 1)), py = Math.round(v * (hd.h - 1)), rad = Math.max(2, Math.round(hd.h * 0.03));
    for (let dy = -rad; dy <= rad; dy += 2) for (let dx = -rad; dx <= rad; dx += 2) {
      const x = px + dx, y = py + dy;
      if (x >= 0 && y >= 0 && x < hd.w && y < hd.h && hd.d[(y * hd.w + x) * 4 + 3] > 100) return true;
    }
    return false;
  }
  function streichelnKlick(e) {
    if (!L || !L.box) return;
    if (e.target.closest && e.target.closest('button, a, input, .rb-nah, .rb-zwraum, .rb-zwding, .rb-tierblase')) return;
    if (!getroffen(e)) return;
    reagieren('streicheln');
  }

  // Sprechblase nie über Stellen-Marken (QA Phase 3): erst über dem Tier, sonst daneben, darunter, oben oder unten im Raum –
  // die erste Lage ohne Überschneidung mit einer Marke gewinnt (sonst die mit der kleinsten Überschneidung)
  function blasePlatz(b, x, y, hoehe) {
    const R0 = L.raum.getBoundingClientRect();
    const marken = [...L.raum.querySelectorAll('.rb-marken .rb-marke')].map(m => { const q = m.getBoundingClientRect(), c = [q.left + q.width / 2 - R0.left, q.top + q.height / 2 - R0.top], h = m.offsetWidth / 2;
      return { left: c[0] - h, right: c[0] + h, top: c[1] - h, bottom: c[1] + h }; });
    // das Tier selbst nicht verdecken (Rechteck der Pose; Bild evtl. noch nicht geladen: aus den Maßen geschätzt)
    if (L.box && L.pose) {
      const k = (L.raum.clientWidth || 1) / 1024, r = tierRechteck(L.platz[0], L.platz[1], L.pose);
      marken.push({ left: r[0] * k, right: r[2] * k, top: r[1] * k, bottom: r[3] * k });
    }
    // Kandidaten nach Nähe zum Kopf des Tiers sortiert: die nächste Lage ohne Überschneidung gewinnt
    const kopf = [x, Math.max(8, y - hoehe - 4)], lagen = [];
    // feines Raster (alle 4 %), damit sich auch in vollen Räumen eine freie Lage findet
    for (let top = 14; top <= 98; top += 4) for (let left = 18; left <= 82; left += 4) lagen.push([left, top]);
    lagen.push([x, kopf[1]]);
    lagen.sort((a, c) => Math.hypot(a[0] - kopf[0], a[1] - kopf[1]) - Math.hypot(c[0] - kopf[0], c[1] - kopf[1]));
    let beste = null, bw = Infinity;
    const W = L.raum.clientWidth || 1;
    for (let [left, top] of lagen) {
      // Blase ganz im Raum: Mitte mindestens eine halbe Blasenbreite vom Rand (Breite hängt am Text, max. 62 %)
      b.style.left = '50%'; b.style.top = top + '%';
      const halb = b.offsetWidth / 2 / W * 100 + 1.5;
      left = Math.max(halb, Math.min(100 - halb, left));
      b.style.left = left + '%';
      // Lage ohne Transform/Animation: Blase hängt mit translate(-50%, -100%) an ihrem Punkt (Ebene = Raum)
      const r = { left: b.offsetLeft - b.offsetWidth / 2, right: b.offsetLeft + b.offsetWidth / 2, top: b.offsetTop - b.offsetHeight, bottom: b.offsetTop };
      const raus = r.top < 2 || r.bottom > L.raum.clientHeight - 2 || r.left < 0 || r.right > W ? 1e6 : 0;
      const ueber = marken.reduce((a, m) => a + Math.max(0, Math.min(r.right, m.right + 4) - Math.max(r.left, m.left - 4)) * Math.max(0, Math.min(r.bottom, m.bottom + 4) - Math.max(r.top, m.top - 4)), 0) + raus;
      if (ueber < bw) { bw = ueber; beste = [left, top]; }
      if (!ueber) break;
    }
    b.style.left = beste[0] + '%'; b.style.top = beste[1] + '%';
  }

  // ---------- Wolken in den Fenstern ----------
  // Weiche Wolken (vorgerechnete Sprites) ziehen sehr langsam von links nach rechts (ein Durchlauf 70–85s), nur innerhalb der
  // Scheiben (Clip je Scheibe), zum Horizont hin ausgeblendet, leicht nach Tageszeit getönt. Scheiben unter einem Raum-Overlay
  // (WZ-A Vorhang) bleiben frei.
  const TOENUNG = { morgen: [236, 243, 255], mittag: [255, 255, 255], nachmittag: [255, 236, 214] };
  function wolkenSprite(seed, farbe) {
    let s = seed;
    const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    const c = document.createElement('canvas'); c.width = 240; c.height = 110;
    const g = c.getContext('2d');
    const n = 6 + Math.floor(rnd() * 3);
    for (let i = 0; i < n; i++) {
      const x = 40 + rnd() * 160, y = 52 + (rnd() - 0.4) * 30 - Math.sin((x - 40) / 160 * Math.PI) * 14, r = 24 + rnd() * 22;
      const v = g.createRadialGradient(x, y, 0, x, y, r);
      v.addColorStop(0, `rgba(${farbe},0.55)`); v.addColorStop(0.55, `rgba(${farbe},0.35)`); v.addColorStop(1, `rgba(${farbe},0)`);
      g.fillStyle = v; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    }
    return c;
  }
  function wolkenAnlegen() {
    const farbe = (TOENUNG[L.zeit] || TOENUNG.mittag).join(',');
    const sprites = [11, 47, 83].map(s => wolkenSprite(s, farbe));
    // Scheiben als Vielecke, Scheiben unter Overlays weglassen
    const ov = [...L.raum.querySelectorAll('.rb-overlays img')].map(i => {
      const l = parseFloat(i.style.left) * 10.24, t = parseFloat(i.style.top) * 10.24;
      return [l, t, l + parseFloat(i.style.width) * 10.24, t + parseFloat(i.style.height) * 10.24];
    });
    const scheiben = L.fenster.map(s => {
      const p = s.p || [[s.r[0], s.r[1]], [s.r[2], s.r[1]], [s.r[2], s.r[3]], [s.r[0], s.r[3]]];
      const xs = p.map(q => q[0]), ys = p.map(q => q[1]);
      return { p, f: s.f, box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] };
    }).filter(s => !ov.some(o => ueberlapp(o, s.box) > 0));
    if (!scheiben.length) return { scheiben };
    const x0 = Math.min(...scheiben.map(s => s.box[0])), x1 = Math.max(...scheiben.map(s => s.box[2]));
    const y0 = Math.min(...scheiben.map(s => s.box[1]));
    const unten = Math.min(...scheiben.map(s => (s.f ? s.f[0] : s.box[3])));
    const hoch = Math.max(20, unten - y0);
    const breite = Math.max(36, Math.min(170, hoch * 1.3));
    const anzahl = Math.max(3, Math.min(7, Math.round((x1 - x0) / breite) + 2));
    const wolken = [];
    for (let i = 0; i < anzahl; i++) {
      const w = breite * zwischen(0.75, 1.2);
      wolken.push({ sprite: sprites[i % 3], w, h: w * 110 / 240, y: y0 + hoch * zwischen(0.05, 0.6),
        phase: (i + Math.random() * 0.6) / anzahl, periode: zwischen(70, 85), alpha: zwischen(0.65, 0.95) });
    }
    return { scheiben, wolken, x0, x1, puffer: document.createElement('canvas') };
  }
  function wolken(g, f, t) {
    if (!L.wolken) L.wolken = wolkenAnlegen();
    const W = L.wolken;
    if (!W.wolken) return;
    const pb = W.puffer;
    W.scheiben.forEach(s => {
      const [bx0, by0, bx1, by1] = s.box;
      const pw = Math.max(1, Math.ceil((bx1 - bx0) * f)), ph = Math.max(1, Math.ceil((by1 - by0) * f));
      if (pb.width < pw || pb.height < ph) { pb.width = Math.max(pb.width, pw); pb.height = Math.max(pb.height, ph); }
      const q = pb.getContext('2d');
      q.clearRect(0, 0, pw, ph);
      q.globalCompositeOperation = 'source-over';
      W.wolken.forEach(w => {
        const spanne = W.x1 - W.x0 + w.w * 2;
        const x = W.x0 - w.w + ((w.phase + t / w.periode) % 1) * spanne;
        if (x + w.w < bx0 || x > bx1 || w.y + w.h / 2 < by0 || w.y - w.h / 2 > by1) return;
        q.globalAlpha = w.alpha;
        q.drawImage(w.sprite, (x - bx0) * f, (w.y - w.h / 2 - by0) * f, w.w * f, w.h * f);
      });
      q.globalAlpha = 1;
      if (s.f) {   // zum Horizont hin ausblenden
        q.globalCompositeOperation = 'destination-in';
        const v = q.createLinearGradient(0, (s.f[0] - by0) * f, 0, (s.f[1] - by0) * f);
        v.addColorStop(0, 'rgba(0,0,0,1)'); v.addColorStop(1, 'rgba(0,0,0,0)');
        q.fillStyle = v; q.fillRect(0, 0, pw, ph);
        q.globalCompositeOperation = 'source-over';
      }
      g.save();
      g.beginPath();
      s.p.forEach(([x, y], i) => (i ? g.lineTo(x * f, y * f) : g.moveTo(x * f, y * f)));
      g.closePath(); g.clip();
      g.drawImage(pb, 0, 0, pw, ph, bx0 * f, by0 * f, pw, ph);
      g.restore();
    });
  }

  // Deckenlampe: weicher Lichtschein, ab und zu ein kurzes, ruhiges Flackern (nie stroboskopisch)
  function lampe(g, x, y, r, t, dt) {
    L.naechstesFlackern -= dt || 0;
    if (L.naechstesFlackern <= 0) { L.flacker = 0.5; L.naechstesFlackern = 7 + Math.random() * 9; }
    let a = 0.16;
    if (L.flacker > 0) { L.flacker -= dt || 0.016; a *= 0.55 + 0.45 * Math.abs(Math.sin(L.flacker * 19)); }
    g.save(); g.globalCompositeOperation = 'lighter';
    const v = g.createRadialGradient(x, y, 0, x, y, r * 2.2);
    v.addColorStop(0, `rgba(255,236,190,${a})`); v.addColorStop(1, 'rgba(255,236,190,0)');
    g.fillStyle = v; g.beginPath(); g.arc(x, y, r * 2.2, 0, Math.PI * 2); g.fill();
    g.restore();
  }
  // Dampf: weiche Schwaden steigen langsam auf (Handgriff-Runde R4: etwas sichtbarer – kräftiger, größer, vier Schwaden)
  function dampf(g, x, y, h, t) {
    g.save();
    for (let k = 0; k < 4; k++) {
      const ph = (t * 0.16 + k / 4) % 1, yy = y - ph * h * 1.15, r = h * (0.14 + ph * 0.3);
      const xx = x + Math.sin(t * 0.6 + k * 1.7) * h * 0.14 + ph * h * 0.08;
      const v = g.createRadialGradient(xx, yy, 0, xx, yy, r);
      const a = 0.4 * Math.sin(ph * Math.PI);
      // QA (S3): weiß auf heller Wand kaum sichtbar – zarter grauer Saum außen gibt Kontrast, bleibt dezent
      v.addColorStop(0, `rgba(255,255,255,${a})`); v.addColorStop(0.5, `rgba(250,252,255,${a * 0.5})`); v.addColorStop(0.78, `rgba(120,128,138,${a * 0.22})`); v.addColorStop(1, 'rgba(120,128,138,0)');
      g.fillStyle = v; g.beginPath(); g.arc(xx, yy, r, 0, Math.PI * 2); g.fill();
    }
    g.restore();
  }
  // Tropfen: gestalteter Tropfen hängt, wächst, fällt und spritzt (Handgriff-Runde 25.10.2026)
  function tropfen(g, x, y, h, t) {
    RB.wasserTropfen(g, x, y, y + h, Math.max(5, h * 0.2), t, { takt: 3.4 });
  }
})();
