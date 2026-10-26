/* Startseite „Rohrbruch“ (Phase 4): Logo, Schriftzug, Stufen-Kacheln mit Manometer, Verteilerrohr, Einsatzbuch, Footer,
   Musik der Sammlung. Das Intro (start/intro.js) nutzt window.RBStart. */
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
  // Startseite mit wenig Text (MZ, nach dem Release): je Stufe nur Name + Schwierigkeit + Bestwert;
  // die langen Stufentexte stehen nur noch im Startbild des Spiels (rahmen.stufen in daten.js)
  const STUFEN = [
    ['azubi', 'Azubi', 'Leicht'],
    ['geselle', 'Geselle', 'Mittel'],
    ['meister', 'Meister', 'Schwer'],
  ];
  const zahl = n => n.toLocaleString('de-DE');
  const winkel = w => -135 + 270 * Math.max(0, Math.min(1000, w)) / 1000;
  // gemeinsame Verläufe für Manometer und Rohre
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  defs.setAttribute('aria-hidden', 'true'); defs.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  defs.innerHTML = '<defs>' +
    '<linearGradient id="rb-chrom" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f7fa"/><stop offset=".45" stop-color="#aeb9c4"/><stop offset=".7" stop-color="#e3e9ef"/><stop offset="1" stop-color="#7d8a98"/></linearGradient>' +
    '<radialGradient id="rb-blatt" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#eef1f4"/></radialGradient>' +
    '<linearGradient id="rb-rohr-v" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7c8997"/><stop offset=".32" stop-color="#eef3f7"/><stop offset=".55" stop-color="#cfd8e1"/><stop offset="1" stop-color="#66737f"/></linearGradient>' +
    '<linearGradient id="rb-rohr-h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7c8997"/><stop offset=".32" stop-color="#eef3f7"/><stop offset=".55" stop-color="#cfd8e1"/><stop offset="1" stop-color="#66737f"/></linearGradient>' +
    '<radialGradient id="rb-rad" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#ef5a4c"/><stop offset="1" stop-color="#a91f17"/></radialGradient>' +
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

  let summe = 0;
  const box = $('stufen'), werte = [];
  STUFEN.forEach(([id, name, grad], i) => {
    const b = +lesen('mg:best:rohrbruch-' + id + ':' + firma) || 0;
    summe += b; werte.push(b);
    const a = document.createElement('a');
    a.className = 'stufe ein'; a.href = 'shk-adventure/#stufe=' + id; a.dataset.k = i;
    a.innerHTML = manometer() + '<span class="stufe-kopf"><b class="stufe-name"></b><span class="stufe-grad"></span>' +
      '<span class="stufe-best">Dein Bestwert: <span class="wert"><b></b>/1.000 Punkte</span></span></span>';
    a.querySelector('.stufe-name').textContent = name;
    a.querySelector('.stufe-grad').textContent = grad;
    a.querySelector('.stufe-best b').textContent = zahl(b);
    a.setAttribute('aria-label', `${name} – ${grad} – Dein Bestwert: ${zahl(b)}/1.000 Punkte`);
    box.append(a);
  });
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

  // ---------- Verteilerrohr mit drei Heizkreisen (im Code gezeichnet, folgt dem Layout) ----------
  const vt = $('verteiler'), rohre = $('rohre');
  function rohreZeichnen() {
    const C = vt.getBoundingClientRect(), W = C.width, H = C.height;
    if (!W || !H) return;
    // Lage ohne die Erscheinen-Bewegung messen (offsetLeft/-Top ignorieren transform)
    const bx = box.offsetLeft, by = box.offsetTop;
    const kacheln = [...box.children].map(a => {
      const r = a.getBoundingClientRect(), m = a.querySelector('.mano').getBoundingClientRect();
      const l = bx + a.offsetLeft, t = by + a.offsetTop, k = a.offsetWidth / (r.width || 1);
      return { l, t, r: l + a.offsetWidth, b: t + a.offsetHeight,
        mx: l + (m.left + m.width / 2 - r.left) * k, my: t + (m.top + m.height / 2 - r.top) * k };
    });
    const neben = kacheln[1].t < kacheln[0].b - 4;   // Kacheln nebeneinander → Verteiler waagrecht oben
    const D = neben ? 18 : 14, d = neben ? 11 : 9;   // Rohrstärken: Verteiler, Heizkreis
    let s = '';
    const rohr = (x0, y0, x1, y1, st) => {
      const senk = Math.abs(x1 - x0) < Math.abs(y1 - y0);
      const x = Math.min(x0, x1) - (senk ? st / 2 : 0), y = Math.min(y0, y1) - (senk ? 0 : st / 2);
      const w = senk ? st : Math.abs(x1 - x0), h = senk ? Math.abs(y1 - y0) : st;
      return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="url(#rb-rohr-${senk ? 'v' : 'h'})"/>`;
    };
    const muffe = (x, y, senk, st) => {   // Verbindungsstück: etwas dicker als das Rohr
      const L = st * 0.9, B = st + 6;
      return senk ? `<rect x="${(x - B / 2).toFixed(1)}" y="${(y - L / 2).toFixed(1)}" width="${B}" height="${L.toFixed(1)}" rx="2" fill="url(#rb-rohr-v)"/>`
        : `<rect x="${(x - L / 2).toFixed(1)}" y="${(y - B / 2).toFixed(1)}" width="${L.toFixed(1)}" height="${B}" rx="2" fill="url(#rb-rohr-h)"/>`;
    };
    const ventil = (x, y, k) => {   // Handrad von vorn: rotes Rad mit Griffmulden, dreht sich beim Darüberfahren
      const R = neben ? 11 : 9;
      let mulden = '';
      for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; mulden += `<circle cx="${(x + Math.cos(a) * R * 0.93).toFixed(1)}" cy="${(y + Math.sin(a) * R * 0.93).toFixed(1)}" r="${(R * 0.2).toFixed(1)}" fill="#8c1a13"/>`; }
      return `<circle cx="${x}" cy="${y}" r="${R + 3}" fill="rgba(0,0,0,.18)"/><g class="ventil" data-k="${k}"><circle cx="${x}" cy="${y}" r="${R}" fill="url(#rb-rad)"/>${mulden}` +
        `<rect x="${(x - R * 0.12).toFixed(1)}" y="${(y - R * 0.75).toFixed(1)}" width="${(R * 0.24).toFixed(1)}" height="${(R * 1.5).toFixed(1)}" rx="1" fill="#fff" opacity=".85"/>` +
        `<circle cx="${x}" cy="${y}" r="${(R * 0.32).toFixed(1)}" fill="url(#rb-chrom)"/></g>`;
    };
    let fluss = '';
    if (neben) {
      const y = 18, x0 = kacheln[0].mx - 46, x1 = kacheln[2].mx + 46;
      kacheln.forEach(k => { s += rohr(k.mx, y, k.mx, k.t + 10, d); s += muffe(k.mx, k.t - 4, true, d); });
      s += rohr(x0, y, x1, y, D);
      s += `<rect x="${x0 - 7}" y="${y - D / 2 - 3}" width="9" height="${D + 6}" rx="3" fill="url(#rb-rohr-h)"/><rect x="${x1 - 2}" y="${y - D / 2 - 3}" width="9" height="${D + 6}" rx="3" fill="url(#rb-rohr-h)"/>`;
      kacheln.forEach((k, i) => { s += ventil(k.mx, y, i); fluss += `<path class="fluss" data-k="${i}" d="M${x0} ${y} H${k.mx} V${k.t + 6}"/>`; });
    } else {
      const x = Math.max(10, kacheln[0].l / 2 - 1), y0 = kacheln[0].my - 30, y1 = kacheln[2].my + 30;
      kacheln.forEach(k => { s += rohr(x, k.my, k.l + 10, k.my, d); s += muffe(k.l - 4, k.my, false, d); });
      s += rohr(x, y0, x, y1, D);
      s += `<rect x="${x - D / 2 - 3}" y="${y0 - 7}" width="${D + 6}" height="9" rx="3" fill="url(#rb-rohr-v)"/><rect x="${x - D / 2 - 3}" y="${y1 - 2}" width="${D + 6}" height="9" rx="3" fill="url(#rb-rohr-v)"/>`;
      kacheln.forEach((k, i) => { s += ventil(x, k.my, i); fluss += `<path class="fluss" data-k="${i}" d="M${x} ${y0} V${k.my} H${k.l + 6}"/>`; });
    }
    rohre.setAttribute('viewBox', `0 0 ${W.toFixed(1)} ${H.toFixed(1)}`);
    rohre.innerHTML = s +
      `<g fill="none" stroke="#e0412f" stroke-width="${neben ? 4 : 3.5}" stroke-linecap="round">${fluss}</g>`;   // warmes Wasser im Vorlauf
  }
  // Kacheln verschieben sich beim Erscheinen (transform) – gemessen wird trotzdem richtig, weil die Animation erst danach läuft;
  // zur Sicherheit nach dem Erscheinen und bei jeder Größenänderung neu zeichnen
  const neu = () => requestAnimationFrame(rohreZeichnen);
  if (window.ResizeObserver) new ResizeObserver(neu).observe(vt); else addEventListener('resize', neu);
  document.fonts && document.fonts.ready.then(neu);
  box.addEventListener('animationend', neu);

  // Heizkreis „aufdrehen“, solange eine Kachel berührt/überfahren wird
  box.addEventListener('pointerover', e => { const a = e.target.closest('a.stufe'); if (a) vt.dataset.aktiv = a.dataset.k; });
  box.addEventListener('pointerout', e => { const a = e.target.closest('a.stufe'); if (a && !a.contains(e.relatedTarget)) delete vt.dataset.aktiv; });
  box.addEventListener('focusin', e => { const a = e.target.closest('a.stufe'); if (a) vt.dataset.aktiv = a.dataset.k; });
  box.addEventListener('focusout', () => { delete vt.dataset.aktiv; });

  // ---------- Erscheinen (gestaffelt) ----------
  function nadeln(start) {
    [...box.children].forEach((a, i) => {
      const n = a.querySelector('.nadel');
      setTimeout(() => { n.style.transform = `rotate(${winkel(werte[i])}deg)`; }, ruhig ? 0 : start + i * 140);
    });
  }
  function zeigen(teile, abstand, start) {   // teile: Elemente, die nacheinander erscheinen
    teile.forEach((el, i) => { el.style.setProperty('--v', ((start || 0) + i * (abstand || 0.08)).toFixed(2) + 's'); el.classList.add('da'); });
  }
  const KOPF = [logoBox, $('tonKnopf')], TITEL = [titel];   // Gesamt-Bestwert entfällt (MZ, 25.10.2026)
  const UNTEN = [$('buchKnopf'), fuss];
  function allesZeigen() {
    zeigen([...KOPF, ...TITEL, rohre, ...box.children, ...UNTEN], 0.07);
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
  // Seite verlassen (Kachel antippen): Musik sanft ausblenden; zurück aus dem Verlauf: wieder an
  addEventListener('pagehide', aus);
  addEventListener('pageshow', e => { if (e.persisted) { neu(); } });

  window.RBStart = { logoBereit, zeigen, allesZeigen, nadeln, rohreZeichnen, KOPF, TITEL, UNTEN, kacheln: () => [...box.children], rohre, titel, logoBox, ruhig };
  if (!document.documentElement.classList.contains('intro')) allesZeigen();
})();
