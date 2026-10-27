/* Startseite „Rohrbruch“: Logo, Schriftzug, Stufenwahl „Figur im Lichtkreis“ (MZ, 27.10.2026; vorher Heizungsverteiler),
   Einsatzbuch, Footer, Musik der Sammlung. Das Intro (start/intro.js) nutzt window.RBStart. */
(function () {
  'use strict';
  const K = window.KUNDE || {}, F = K.farben || {}, firma = K.firma || '';
  const HAUPT = F.haupt || '#1E63B5';
  const $ = id => document.getElementById(id);
  const lesen = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Logo (weiß, oben links, frei) – als SVG eingebettet, damit das Intro Zeichen und Schriftzug trennen kann ----------
  const logoBox = $('logo');
  logoBox.setAttribute('aria-label', firma);
  function logoAlsBild() { const i = new Image(); i.src = K.logo || ''; i.alt = firma; logoBox.replaceChildren(i); }
  const logoBereit = (location.protocol === 'file:' || !K.logo ? Promise.reject() : fetch(K.logo).then(r => r.ok ? r.text() : Promise.reject()))
    .then(t => {
      if (!/^\s*(<\?xml[^>]*>\s*)?<svg[\s>]/i.test(t) || /<script/i.test(t)) throw new Error('kein SVG');
      logoBox.innerHTML = t;
      const s = logoBox.querySelector('svg'); s.removeAttribute('width'); s.removeAttribute('height'); s.setAttribute('aria-hidden', 'true');
    })
    .catch(logoAlsBild);

  // ---------- Schriftzug „Rohrbruch!“ ----------
  const titel = $('schriftzug');
  titel.append(window.Schriftzug.svg());

  // ---------- Stufen ----------
  // Stufenwahl „Figur im Lichtkreis“ (MZ, 27.10.2026, Skizze B): immer nur eine Stufe sichtbar – Name, Grad-Pille links
  // neben der Figur (MZ: B1), Figur der Stufe (neutral, wie im Zwischenbild des Spiels), Manometer-Plakette mit dem
  // Bestwert, „An die Arbeit“. Pfeile, Wischen und Pfeiltasten blättern (nicht im Kreis). Die langen Stufentexte stehen
  // nur im Startbild des Spiels (rahmen.stufen in daten.js).
  const STUFEN = [
    ['azubi', 'Azubi', 'Leicht'],
    ['geselle', 'Geselle', 'Mittel'],
    ['meister', 'Meister', 'Schwer'],
  ];
  const STUFE_KEY = 'mg:stufe:rohrbruch:' + firma;   // derselbe Schlüssel wie im Spiel (spiel.js): zuletzt gespielte Stufe
  const SF = window.ROHRBRUCH_STUFENFIGUREN || {};
  const zahl = n => n.toLocaleString('de-DE');
  const winkel = w => -135 + 270 * Math.max(0, Math.min(1000, w)) / 1000;
  const el = (tag, klasse, text) => { const e = document.createElement(tag); if (klasse) e.className = klasse; if (text != null) e.textContent = text; return e; };
  // gemeinsame Verläufe für das Manometer
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  defs.setAttribute('aria-hidden', 'true'); defs.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  defs.innerHTML = '<defs>' +
    '<linearGradient id="rb-chrom" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f7fa"/><stop offset=".45" stop-color="#aeb9c4"/><stop offset=".7" stop-color="#e3e9ef"/><stop offset="1" stop-color="#7d8a98"/></linearGradient>' +
    '<radialGradient id="rb-blatt" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#eef1f4"/></radialGradient>' +
    '</defs>';
  document.body.prepend(defs);

  function manometer() {
    let striche = '';
    for (let i = 0; i <= 20; i++) {
      const a = (winkel(i * 50) - 90) * Math.PI / 180, gross = i % 2 === 0, r0 = gross ? 31 : 34;
      striche += `<line x1="${(Math.cos(a) * r0).toFixed(2)}" y1="${(Math.sin(a) * r0).toFixed(2)}" x2="${(Math.cos(a) * 39).toFixed(2)}" y2="${(Math.sin(a) * 39).toFixed(2)}" stroke-width="${gross ? 2.4 : 1.2}"/>`;
    }
    // Bereich der Bestwert-Stufe „Meisterleistung“ (ab 900) als feiner Bogen in Markenfarbe
    const bog = w => { const a = (winkel(w) - 90) * Math.PI / 180; return `${(Math.cos(a) * 41).toFixed(2)} ${(Math.sin(a) * 41).toFixed(2)}`; };
    return '<svg class="mano" viewBox="-50 -50 100 100" aria-hidden="true">' +
      '<circle r="48" fill="url(#rb-chrom)"/><circle r="43.5" fill="url(#rb-blatt)" stroke="#9aa6b2" stroke-width="1"/>' +
      `<path d="M${bog(900)} A41 41 0 0 1 ${bog(1000)}" fill="none" stroke="${HAUPT}" stroke-width="3"/>` +
      `<g stroke="#2b3440" stroke-linecap="round">${striche}</g>` +
      '<text y="21" text-anchor="middle" font-size="9" font-weight="700" fill="#7b8590" font-family="Barlow, sans-serif">Pkt.</text>' +
      '<g class="nadel" style="transform:rotate(-135deg)"><path d="M-2.6 6 L0 -35 L2.6 6 Z" fill="#c62828"/></g>' +
      '<circle r="5.5" fill="#2b3440"/><circle r="2" fill="#8b96a2"/>' +
      '<ellipse cx="-8" cy="-22" rx="22" ry="10" fill="#fff" opacity=".35" transform="rotate(-20)"/></svg>';
  }

  // Grünflächen (#00FF00) in die Kundenfarbe umfärben – gleiche Rechnung wie Rahmen.umfaerben (shk-adventure/rahmen.js,
  // Quelle gemeinsam/rahmen.js); rahmen.js selbst baut beim Laden die Spielfläche auf und passt deshalb nicht auf die Startseite
  function umfaerben(img, farbe) {
    const c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const g = c.getContext('2d');
    g.drawImage(img, 0, 0);
    const n = parseInt(String(farbe).replace('#', ''), 16) || 0, ziel = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    const bild = g.getImageData(0, 0, c.width, c.height), d = bild.data;
    for (let i = 0; i < d.length; i += 4) {
      const gruen = d[i + 1] - Math.max(d[i], d[i + 2]);
      if (gruen < 16) continue;
      const t = Math.min(1, (gruen - 16) / 36);
      const hell = Math.min(1.3, d[i + 1] / 210);
      for (let k = 0; k < 3; k++) d[i + k] += (Math.min(255, ziel[k] * hell) - d[i + k]) * t;
    }
    g.putImageData(bild, 0, 0);
    return c;
  }

  const buehne = $('buehne'), folienBox = $('folien'), namen = $('wahlName'), grade = $('gradStapel'), besten = $('wahlBest');
  const los = $('losKnopf'), zurueck = $('pfeilZurueck'), vor = $('pfeilVor'), punkte = [...$('punkte').children], ansage = $('ansage');
  const werte = [], folien = [], plaketten = [];
  STUFEN.forEach(([id, name, grad], i) => {
    const b = +lesen('mg:best:rohrbruch-' + id + ':' + firma) || 0;
    werte.push(b);
    // Name (mittig über der Figur)
    const h = el('h2', 'wahl-name-text', name); h.dataset.k = i; namen.append(h);
    // Grad-Pille (links oben neben der Figur, MZ B1) – Lage zentral in start.css (.grad-stapel)
    const p = el('span', 'grad', grad); p.dataset.k = i; grade.append(p);
    // Figur mit Firmenzeichen auf der Brust und Manometer-Plakette
    const folie = el('div', 'folie'); folie.dataset.k = i;
    const f = SF[id] || {}, figur = el('div', 'figur');
    if (f.w && f.h) figur.style.setProperty('--seite', f.w / f.h);
    if (f.logo && (K.zeichenWeiss || K.logo)) {   // wie stufenBild im Spiel (spiel.js): Zeichen weiß auf der Brustfläche
      const lg = el('img', 'westenlogo'); lg.alt = ''; lg.draggable = false; lg.src = K.zeichenWeiss || K.logo;
      const [x, y, w, hh] = f.logo;
      Object.assign(lg.style, { left: x * 100 + '%', top: y * 100 + '%', width: w * 100 + '%', height: hh * 100 + '%' });
      figur.append(lg);
    }
    const plakette = el('div', 'plakette ein'); plakette.innerHTML = manometer();
    figur.append(plakette); plaketten.push(plakette);
    folie.append(figur); folienBox.append(folie);
    folien.push({ id, name, grad, folie, figur, nadel: plakette.querySelector('.nadel'), bild: f.bild ? 'shk-adventure/' + f.bild : '' });
    // Bestwert-Zeile
    const z = el('p', 'wahl-best-text'); z.dataset.k = i;
    z.append('Dein Bestwert: ', el('b', '', zahl(b)), '/1.000 Punkte');
    besten.append(z);
  });

  // Figuren laden und umfärben: zuerst die angezeigte, dann die übrigen (je ca. 35 KB)
  function figurLaden(k) {
    const F = folien[k];
    if (!F || F.geladen || !F.bild) return Promise.resolve();
    F.geladen = true;
    return new Promise(fertig => {
      const i = new Image();
      i.onload = () => {
        let bild = i;
        try { bild = umfaerben(i, HAUPT); } catch (e) { /* file:// – Bild ohne Umfärben */ }
        bild.className = 'figur-bild'; bild.setAttribute('aria-hidden', 'true'); if (bild === i) { i.alt = ''; i.draggable = false; }
        F.figur.prepend(bild);
        requestAnimationFrame(() => F.figur.classList.add('bereit'));
        fertig();
      };
      i.onerror = () => fertig();
      i.src = F.bild;
    });
  }

  // ---------- Blättern ----------
  const hashStufe = (/(?:^#|&)stufe=(\w+)/.exec(location.hash) || [])[1];   // Testhilfe #stufe=geselle
  let aktiv = Math.max(0, STUFEN.findIndex(s => s[0] === (hashStufe || lesen(STUFE_KEY))));
  let sichtbar = false;   // Nadeln drehen erst, wenn die Stufenwahl zu sehen ist (nach dem Intro)
  const schreiben = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* privat */ } };
  const wurzelIntro = () => document.documentElement.classList.contains('intro');
  function nadelZu(k, verz) {
    const n = folien[k].nadel, ziel = `rotate(${winkel(werte[k])}deg)`;
    if (ruhig) { n.style.transform = ziel; return; }
    n.style.transition = 'none'; n.style.transform = 'rotate(-135deg)';
    void n.getBoundingClientRect();
    n.style.transition = '';
    setTimeout(() => { n.style.transform = ziel; }, verz || 0);
  }
  function anzeigen(ansagen) {
    const F = folien[aktiv];
    const lage = (c, k) => {
      c.classList.toggle('aktiv', k === aktiv); c.classList.toggle('vorher', k < aktiv); c.classList.toggle('nachher', k > aktiv);
    };
    [namen, grade, besten].forEach(st => [...st.children].forEach(c => { const k = +c.dataset.k; lage(c, k); c.setAttribute('aria-hidden', k === aktiv ? 'false' : 'true'); }));
    // Figur ist Schmuck – Name, Pille und Bestwert-Zeile tragen die Angaben
    folien.forEach((G, k) => { lage(G.folie, k); G.folie.setAttribute('aria-hidden', 'true'); });
    punkte.forEach((p, k) => p.classList.toggle('an', k === aktiv));
    zurueck.setAttribute('aria-disabled', aktiv === 0 ? 'true' : 'false');
    vor.setAttribute('aria-disabled', aktiv === STUFEN.length - 1 ? 'true' : 'false');
    los.href = 'shk-adventure/#stufe=' + F.id;
    los.setAttribute('aria-label', 'An die Arbeit – Stufe ' + F.name);
    if (ansagen) ansage.textContent = `${F.name} – ${F.grad} – Dein Bestwert: ${zahl(werte[aktiv])}/1.000 Punkte`;
    figurLaden(aktiv).then(() => folien.forEach((G, k) => figurLaden(k)));
  }
  function wechseln(r) {
    const neu = aktiv + r;
    if (neu < 0 || neu >= STUFEN.length) return;
    aktiv = neu;
    schreiben(STUFE_KEY, folien[aktiv].id);
    anzeigen(true);
    if (sichtbar) nadelZu(aktiv, 180);
  }
  function starten() { schreiben(STUFE_KEY, folien[aktiv].id); location.href = los.href; }
  zurueck.addEventListener('click', () => wechseln(-1));
  vor.addEventListener('click', () => wechseln(1));
  los.addEventListener('click', () => schreiben(STUFE_KEY, folien[aktiv].id));
  addEventListener('keydown', e => {
    if (wurzelIntro() || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); wechseln(e.key === 'ArrowLeft' ? -1 : 1); }
  });
  // Wischen (Handy) und Ziehen mit der Maus; kurzes Antippen der Figur startet die Stufe
  let wisch = null, gewischt = false;
  buehne.addEventListener('pointerdown', e => {
    if (!e.isPrimary || e.target.closest('.pfeil')) return;
    wisch = { x: e.clientX, y: e.clientY };
  });
  buehne.addEventListener('pointerup', e => {
    if (!wisch || !e.isPrimary) return;
    const dx = e.clientX - wisch.x, dy = e.clientY - wisch.y;
    wisch = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      gewischt = true; setTimeout(() => { gewischt = false; }, 350);
      wechseln(dx < 0 ? 1 : -1);
    }
  });
  buehne.addEventListener('pointercancel', () => { wisch = null; });
  folienBox.addEventListener('click', e => { if (!gewischt && e.target.closest('.folie.aktiv .figur')) starten(); });
  anzeigen(false);

  let buch = [];
  try { buch = JSON.parse(lesen('mg:buch:rohrbruch:' + firma) || '[]'); } catch (e) { /* leer */ }
  $('buch').textContent = Array.isArray(buch) ? buch.length : 0;

  // Footer: Kontaktdaten, Datenschutz/Impressum nur unterstrichen, nichts verlinkt (MZ, 24.10.2026)
  const fuss = $('fuss');
  // Umbruch nur zwischen den Angaben (nie mitten in Adresse/Telefon), Gedankenstrich nie am Zeilenanfang
  const angaben = String((K.kontakt || '') + (K.web ? ' – ' + K.web : '')).split(/[\s ]+–\s+/).filter(Boolean);
  angaben.forEach((t, i) => {
    const s = document.createElement('span'); s.className = 'am-stueck';
    s.textContent = t + (i < angaben.length - 1 ? ' –' : '');
    fuss.append(s); if (i < angaben.length - 1) fuss.append(' ');
  });
  fuss.append(document.createElement('br'));
  (K.rechtliches || []).forEach((r, i) => { if (i) fuss.append(' – '); const u = document.createElement('u'); u.textContent = r.text; fuss.append(u); });

  // ---------- Erscheinen (gestaffelt) ----------
  function nadeln(start) {
    sichtbar = true;
    nadelZu(aktiv, ruhig ? 0 : start);
    folien.forEach((G, k) => { if (k !== aktiv) G.nadel.style.transform = `rotate(${winkel(werte[k])}deg)`; });
  }
  function zeigen(teile, abstand, start) {   // teile: Elemente, die nacheinander erscheinen
    teile.forEach((el, i) => { el.style.setProperty('--v', ((start || 0) + i * (abstand || 0.08)).toFixed(2) + 's'); el.classList.add('da'); });
  }
  const KOPF = [logoBox, $('tonKnopf')], TITEL = [titel];   // Gesamt-Bestwert entfällt (MZ, 25.10.2026)
  // Stufenwahl (ersetzt die Kacheln, auch fürs Intro): Name, Bühne (Figur, Pille, Pfeile), Plakette der angezeigten Stufe;
  // die Plaketten der übrigen Stufen liegen unsichtbar dahinter und erscheinen gleich mit
  const kacheln = () => [namen, buehne, plaketten[aktiv], ...plaketten.filter((p, k) => k !== aktiv)];
  const UNTEN = [besten, los, $('punkte'), $('buchKnopf'), fuss];
  function allesZeigen() {
    const k = kacheln();
    zeigen([...KOPF, ...TITEL, ...k.slice(0, 3), ...UNTEN], 0.07);
    zeigen(k.slice(3), 0, 0.3);
    nadeln(650);
  }

  // ---------- Musik der Sammlung (nach dem ersten Tippen, Schleife ohne Lücke über Web Audio) ----------
  // Pixabay „Upbeat Funky Groove“ (AlexGuz, 279019), Schleife 0,02–131,7s, Ende 2s in den Anfang überblendet
  // (Material/Sounds/quellen.txt). Ton an/aus gilt auch für das Spiel (mg:ton).
  const MUSIK = { datei: 'klaenge/musik.mp3', proben: 2859443, pegel: 0.22 };
  const SYM_AN = '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>';
  const SYM_AUS = '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';
  let tonAn = true;
  try { tonAn = localStorage.getItem('mg:ton') !== 'aus'; } catch (e) { /* privat */ }
  const knopf = $('tonKnopf');
  const symbol = () => { knopf.innerHTML = tonAn ? SYM_AN : SYM_AUS; knopf.setAttribute('aria-pressed', tonAn ? 'true' : 'false'); };
  symbol();
  const AC = window.AudioContext || window.webkitAudioContext;
  let ac = null, puffer = null, laeuft = null;
  // MP3 bringt vorn 1105 Proben Stille mit (bei 22,05 kHz) – mit der echten Länge genau zuschneiden (wie rahmen.js)
  function zuschneiden(b) {
    const RATE = 22050, VORLAUF = 1105, ueber = b.duration * RATE - MUSIK.proben;
    if (ueber < 2) return b;
    const ab = Math.round((ueber >= VORLAUF - 4 ? VORLAUF : 0) / RATE * b.sampleRate);
    const laenge = Math.min(b.length - ab, Math.round(MUSIK.proben / RATE * b.sampleRate));
    const n = ac.createBuffer(b.numberOfChannels, laenge, b.sampleRate);
    for (let k = 0; k < b.numberOfChannels; k++) n.getChannelData(k).set(b.getChannelData(k).subarray(ab, ab + laenge));
    return n;
  }
  function an() {
    if (!tonAn || laeuft || !AC) return;
    if (!ac) {
      ac = new AC();
      fetch(MUSIK.datei).then(r => r.arrayBuffer()).then(b => new Promise((ok, nein) => ac.decodeAudioData(b, ok, nein)))
        .then(b => { puffer = zuschneiden(b); an(); }).catch(() => {});
    }
    if (ac.state !== 'running') ac.resume().then(() => { if (ac.state === 'running') an(); }).catch(() => {});
    if (!puffer || ac.state !== 'running') return;
    const q = ac.createBufferSource(), v = ac.createGain();
    q.buffer = puffer; q.loop = true;
    v.gain.setValueAtTime(0.0001, ac.currentTime);
    v.gain.exponentialRampToValueAtTime(MUSIK.pegel, ac.currentTime + 1.2);
    q.connect(v).connect(ac.destination);
    q.start();
    laeuft = { q, v };
  }
  function aus() {
    if (!laeuft) return;
    const { q, v } = laeuft;
    laeuft = null;
    try { v.gain.setTargetAtTime(0.0001, ac.currentTime, 0.15); q.stop(ac.currentTime + 1); } catch (e) { /* egal */ }
  }
  // Browser erlauben Ton erst nach dem ersten Tippen; der Ton-Knopf selbst schaltet nur um
  const ersterTipp = e => { if (e && e.target && e.target.closest && e.target.closest('#tonKnopf')) return; an(); };
  ['pointerup', 'touchend', 'keydown'].forEach(e => addEventListener(e, ersterTipp, { passive: true }));
  knopf.addEventListener('click', () => {
    tonAn = !tonAn;
    try { localStorage.setItem('mg:ton', tonAn ? 'an' : 'aus'); } catch (e) { /* privat */ }
    symbol();
    if (tonAn) an(); else aus();
  });
  // Seite verlassen (Stufe starten): Musik sanft ausblenden
  addEventListener('pagehide', aus);

  window.RBStart = { logoBereit, zeigen, allesZeigen, nadeln, KOPF, TITEL, UNTEN, kacheln, titel, logoBox, ruhig, wechseln,
    get stufe() { return folien[aktiv].id; } };
  if (!document.documentElement.classList.contains('intro')) allesZeigen();
})();
