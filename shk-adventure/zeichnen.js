// Rohrbruch – gemeinsame Zeichen-Hilfen: Bilder laden, Bauteile/Werkzeug aus Blättern, Manometer, Display-Schrift,
// Punktschrift (5×7 wie ein Geräte-Display), Zustände (Tropfen, Schlamm, Pfütze…). Wird von Lupe, Handgriffen,
// Start- und Endbild benutzt.
(function () {
  'use strict';
  const RB = window.RB = window.RB || {};
  const R_ = window.Rahmen, F = R_.farben;
  RB.ruhig = /(^|[#&])ruhig\b/.test(location.hash) || matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Bilder ----------
  const bilder = new Map();
  RB.bild = function (adresse) {
    // „…webp#gruen“: Bild mit #00FF00-Flächen, einmal nach dem Laden in die Hausfarbe umgefärbt (z. B. Visitenkarten)
    if (!bilder.has(adresse) && /#gruen$/.test(adresse)) {
      const i = new Image();
      i.decoding = 'async';
      i.fertig = RB.bild(adresse.replace(/#gruen$/, '')).fertig.then(roh => new Promise(ok => {
        if (!roh) return ok(null);
        try { i.onload = () => ok(i); i.onerror = () => ok(null); i.src = R_.umfaerben(roh).toDataURL('image/webp', 0.9); } catch (e) { ok(null); }
      }));
      bilder.set(adresse, i);
    }
    if (!bilder.has(adresse)) {
      const i = new Image();
      i.decoding = 'async';
      i.src = adresse;
      i.fertig = new Promise(ok => { i.onload = () => ok(i); i.onerror = () => ok(null); });
      bilder.set(adresse, i);
    }
    return bilder.get(adresse);
  };
  RB.geladen = i => i && i.complete && i.naturalWidth > 0;

  // ---------- Weiche Trennstellen nur für die Anzeige (MZ: „bitte an Umbruch denken“, 25.10.2026) ----------
  // daten.js trennen = { 'Rohrreinigungsspirale': 'Rohr­reinigungs­spirale', … } (rohrbruch-trennstellen.md). Greift am
  // Wortanfang, auch mit Endung („Thermostatventile“). Namen in den Daten bleiben unverändert (Schlüssel, Vergleiche).
  const TRENN = (window.ROHRBRUCH || {}).trennen || {};
  const trennWoerter = Object.keys(TRENN).filter(w => /^[\p{L}-]+$/u.test(w)).sort((a, b) => b.length - a.length);
  const trennMuster = trennWoerter.length ? new RegExp('(?<![\\p{L}\\u00AD])(' + trennWoerter.join('|') + ')', 'gu') : null;
  RB.trenn = t => (trennMuster && t != null ? String(t).replace(trennMuster, w => TRENN[w] || w) : t);

  // Zelle eines Blatts (spalten × zeilen) in ein Rechteck zeichnen, Seitenverhältnis bleibt („contain“)
  RB.zelle = function (g, blatt, nr, spalten, zeilen, x, y, w, h, fuellen) {
    const i = RB.bild(blatt);
    if (!RB.geladen(i)) return null;
    const cw = i.naturalWidth / spalten, ch = i.naturalHeight / zeilen;
    const sx = (nr % spalten) * cw, sy = Math.floor(nr / spalten) * ch;
    const f = fuellen ? Math.max(w / cw, h / ch) : Math.min(w / cw, h / ch);
    const dw = cw * f, dh = ch * f, dx = x + (w - dw) / 2, dy = y + (h - dh) / 2;
    g.drawImage(i, sx, sy, cw, ch, dx, dy, dw, dh);
    // Umrechnung Zell-Koordinaten (Original 512 bzw. 384) → Leinwand; blatt/nr/spalten/zeilen für Masken (Beläge nur auf dem Bauteil)
    const orig = 1536 / spalten;
    return { f: dw / orig, x: dx, y: dy, w: dw, h: dh, p: (px, py) => [dx + px * dw / orig, dy + py * dw / orig], blatt, nr, spalten, zeilen };
  };

  // ---------- Gestaltete Motive (Handgriff-Runde 25.10.2026, Graphic Artist) ----------
  // sprites.js (erzeugt mit Material/Bilder/rohrbruch-handgriff-bilder.py): je Blatt Bild + Rechteck jedes Motivs.
  // „Der Graphic Artist gestaltet, der Code bewegt nur“: Wasser, Beläge, Bedienteile kommen als Bild, der Code setzt,
  // dreht, streckt und blendet sie. Fehlt ein Bild (noch nicht geladen), zeichnet der Code den alten Ersatz.
  const SP = window.RB_SPRITES || {};
  RB.motiv = function (blatt, name) {
    const b = SP[blatt], r = b && b.teile[name];
    if (!r) return null;
    const i = RB.bild(b.bild);
    return RB.geladen(i) ? { i, r } : null;
  };
  RB.motivDaten = (blatt, name) => (SP[blatt] && SP[blatt].teile[name]) || null;
  RB.motivLoch = (blatt, name) => (SP[blatt] && SP[blatt].loecher && SP[blatt].loecher[name]) || null;
  RB.motivBlaetter = () => Object.values(SP).map(b => b.bild);
  // Motiv mit Ankerpunkt (ax, ay: 0–1 im Motiv) auf (x, y), Breite w (Höhe h, sonst nach Seitenverhältnis), Drehung (Bogenmaß)
  RB.motivZeichnen = function (g, blatt, name, x, y, w, h, o) {
    const m = RB.motiv(blatt, name);
    if (!m) return false;
    o = o || {};
    const [sx, sy, sw, sh] = m.r;
    if (h == null) h = w * sh / sw;
    const ax = o.ax == null ? 0.5 : o.ax, ay = o.ay == null ? 0.5 : o.ay;
    g.save();
    g.translate(x, y);
    if (o.drehung) g.rotate(o.drehung);
    if (o.alpha != null) g.globalAlpha *= o.alpha;
    if (o.schatten) { g.shadowColor = 'rgba(0,0,0,' + (o.schatten.a || 0.3) + ')'; g.shadowBlur = o.schatten.blur || 8; g.shadowOffsetY = o.schatten.y || 3; }
    // Unterlage: Umriss des Motivs leicht eingefärbt darunter – durchsichtiges Wasser bleibt so auch auf hellem Grund sichtbar
    if (o.unterlage) { const u = motivKopie(blatt, name, o.unterlage[0]); if (u) { const a0 = g.globalAlpha; g.globalAlpha = a0 * o.unterlage[1]; g.drawImage(u, -w * ax, -h * ay, w, h); g.globalAlpha = a0; } }
    g.drawImage(m.i, sx, sy, sw, sh, -w * ax, -h * ay, w, h);
    g.restore();
    return true;
  };
  // Motiv als eigene kleine Leinwand (für Masken), zwischengespeichert
  const motivLeinwand = new Map();
  function motivKopie(blatt, name, faerben) {
    const k = blatt + '|' + name + '|' + (faerben || '');
    if (motivLeinwand.has(k)) return motivLeinwand.get(k);
    const m = RB.motiv(blatt, name);
    if (!m) return null;
    const c = document.createElement('canvas'); c.width = m.r[2]; c.height = m.r[3];
    const g = c.getContext('2d');
    g.drawImage(m.i, m.r[0], m.r[1], m.r[2], m.r[3], 0, 0, m.r[2], m.r[3]);
    if (faerben) { g.globalCompositeOperation = 'source-in'; g.fillStyle = faerben; g.fillRect(0, 0, c.width, c.height); }
    motivLeinwand.set(k, c);
    return c;
  }

  // ---------- Wasser (rohrbruch-wasser.png, durchsichtig freigestellt) ----------
  const glatt = q => q * q * (3 - 2 * q);
  // leicht bläulich-dunkler Körper unter dem Wasser (auf hellem Grund sichtbar); QA S2: Tropfen auf dem Handy kaum erkennbar → kräftiger
  const WASSER_UNTERLAGE = ['rgb(28,56,90)', 0.42];
  // Tropfen-Kreislauf an einer Quelle (x, y): hängt und wächst – löst sich – fällt bis yBoden – Spritzer beim Aufprall.
  // s = Breite des fertigen Tropfens (px), t = Zeit (s). o: { takt, versatz, spritzer (false = keiner), ruhig }
  RB.wasserTropfen = function (g, x, y, yBoden, s, t, o) {
    o = o || {};
    const takt = o.takt || 2.6, ph = (((t + (o.versatz || 0)) / takt) % 1 + 1) % 1;
    const hd = RB.motivDaten('wasser', 'haengend'), hAsp = hd ? hd[3] / hd[2] * 0.78 : 1.6;
    const fall = Math.max(0, yBoden - y - s * hAsp * 0.8);
    if (!RB.motiv('wasser', 'haengend')) {   // Ersatz: alter gezeichneter Tropfen
      if (o.ruhig || RB.ruhig) { RB.tropfen(g, x, y + s * 0.6, s * 0.35); return; }
      RB.tropfen(g, x, y + s * 0.6 + glatt(ph) * Math.max(0, yBoden - y - s), s * 0.35);
      return;
    }
    const U = WASSER_UNTERLAGE;
    const zeigeHaengend = (gr, a) => RB.motivZeichnen(g, 'wasser', 'haengend', x, y, s * gr, s * gr * hAsp, { ax: 0.5, ay: 0.02, alpha: a, unterlage: U });
    if (o.ruhig || RB.ruhig) { zeigeHaengend(0.9, 1); return; }
    const W = 0.6, F = fall > s * 0.6 ? 0.82 : 0.6;   // hängen bis W, fallen bis F, dann Spritzer
    if (ph < W) {
      const u = ph / W;
      zeigeHaengend(0.55 + 0.45 * glatt(Math.min(1, u * 1.15)), Math.min(1, u * 4));   // nie winzig (QA S2)
      return;
    }
    // es hängt immer schon ein kleiner neuer Tropfen nach
    zeigeHaengend(0.45, 0.7);
    if (ph < F) {
      const u = (ph - W) / (F - W), yy = y + s * hAsp * 0.62 + u * u * fall;
      const strecken = 1 + Math.min(0.5, u * 0.6);
      RB.motivZeichnen(g, 'wasser', 'fallend', x, yy, s * 0.62 / Math.sqrt(strecken), s * 0.62 * strecken, { ax: 0.5, ay: 0.5, unterlage: U });
      return;
    }
    if (o.spritzer === false || fall <= s * 0.6) return;
    const u = (ph - F) / (1 - F);
    if (u < 0.55) {
      const v = u / 0.55, b = s * (1.2 + 1.3 * glatt(v));
      RB.motivZeichnen(g, 'wasser', 'spritzer', x, yBoden, b, b * 0.646 * (0.6 + 0.4 * v), { ax: 0.5, ay: 0.86, alpha: 1 - v * v, unterlage: U });
    }
  };
  // Pfütze am Boden: (x, y) = Mitte, b = Breite; flach in Perspektive, dunkelt den Boden leicht ab (nass), Glanz wandert langsam
  RB.pfuetze = function (g, x, y, b, t, o) {
    o = o || {};
    const name = o.klein ? 'pfuetzeKlein' : 'pfuetzeGross', d = RB.motivDaten('wasser', name);
    if (!d || !RB.motiv('wasser', name)) {   // Ersatz: alte Ellipse
      g.save(); g.globalAlpha = 0.55;
      const v = g.createRadialGradient(x, y, 0, x, y, b * 0.5);
      v.addColorStop(0, 'rgba(120,170,215,.8)'); v.addColorStop(1, 'rgba(120,170,215,0)');
      g.fillStyle = v; g.beginPath(); g.ellipse(x, y, b * 0.5, b * 0.15, 0, 0, Math.PI * 2); g.fill(); g.restore();
      return;
    }
    const h = b * d[3] / d[2] * (o.flach || 0.62);
    const schatten = motivKopie('wasser', name, 'rgb(28,34,40)');
    g.save();
    if (o.spiegeln) { g.translate(x, y); g.scale(-1, 1); g.translate(-x, -y); }
    if (schatten) { g.globalAlpha = o.dunkel == null ? 0.2 : o.dunkel; g.drawImage(schatten, x - b * 0.51, y - h * 0.47, b * 1.02, h * 1.02); g.globalAlpha = 1; }
    RB.motivZeichnen(g, 'wasser', name, x, y, b, h, { alpha: 0.95 });
    if (!RB.ruhig && !o.ruhig) {   // Schimmern: Glanz zusätzlich, leicht versetzt und pulsierend
      g.globalCompositeOperation = 'lighter';
      RB.motivZeichnen(g, 'wasser', name, x + Math.sin(t * 0.9) * b * 0.012, y + Math.cos(t * 0.7) * h * 0.02, b, h, { alpha: 0.1 + 0.08 * Math.sin(t * 1.7) });
    }
    g.restore();
  };
  // Rinnsal an einer Fläche (Wand, Rohr): von y0 bis y1, Breite b; Licht läuft langsam nach unten
  RB.rinnsal = function (g, x, y0, y1, b, t) {
    const d = RB.motivDaten('wasser', 'rinnsal');
    if (!d || !RB.motiv('wasser', 'rinnsal')) { g.save(); g.strokeStyle = 'rgba(120,170,215,.5)'; g.lineWidth = b * 0.25; g.beginPath(); g.moveTo(x, y0); g.lineTo(x, y1); g.stroke(); g.restore(); return; }
    const h = Math.max(4, y1 - y0);
    RB.motivZeichnen(g, 'wasser', 'rinnsal', x, y0, b, h, { ax: 0.5, ay: 0, alpha: 0.95, unterlage: WASSER_UNTERLAGE });
    if (RB.ruhig) return;
    g.save();
    g.beginPath(); g.rect(x - b, y0, b * 2, h); g.clip();
    g.globalCompositeOperation = 'lighter';
    const ph = (t * 0.35) % 1;
    RB.motivZeichnen(g, 'wasser', 'rinnsal', x, y0 + (ph - 1) * h, b, h, { ax: 0.5, ay: 0, alpha: 0.18 });
    RB.motivZeichnen(g, 'wasser', 'rinnsal', x, y0 + ph * h, b, h, { ax: 0.5, ay: 0, alpha: 0.18 });
    g.restore();
  };

  // ---------- Beläge als Textur (rohrbruch-texturen.png) ----------
  // Zustand → Textur und Deckkraft. Weich maskiert (rund auslaufend) und, wenn das Bauteil bekannt ist (form = Rückgabe von
  // RB.zelle), nur dort, wo das Bauteil ist (Alpha des freigestellten Lupenbilds).
  const BELAG = { verschmutzt: ['schlamm', 0.88], verkalkt: ['kalk', 0.9], korrodiert: ['rost', 0.85], verschlissen: ['kratzer', 0.95],
    vereist: ['raureif', 0.88], russ: ['staub', 0.85] };
  RB.BELAG = BELAG;
  const belagSpeicher = new Map();
  // Beläge-Leinwand: Seite S (CSS-Pixel) um (mx, my), d = Gerätepixel je CSS-Pixel
  function belagLeinwand(art, S, d, form, mx, my, o) {
    const [tex] = BELAG[art] || [];
    const m = tex && RB.motiv('texturen', tex);
    if (!m) return null;
    const formOk = form && RB.geladen(RB.bild(form.blatt));
    const k = [art, Math.round(S), d, formOk ? [form.blatt, form.nr, Math.round(form.x - mx), Math.round(form.y - my), Math.round(form.w)].join(',') : '', o.weich || ''].join('|');
    if (belagSpeicher.has(k)) return belagSpeicher.get(k);
    const N = Math.max(8, Math.round(S * d)), c = document.createElement('canvas'); c.width = c.height = N;
    const g = c.getContext('2d');
    // Textur leicht gedreht je Art, damit nicht alle gleich liegen
    const dreh = { verschmutzt: 0.4, verkalkt: -0.3, korrodiert: 0.9, verschlissen: 0, vereist: 0.2, russ: -0.6 }[art] || 0;
    const malen = (gg, a) => { gg.save(); gg.globalAlpha = a; gg.translate(N / 2, N / 2); gg.rotate(dreh); gg.drawImage(m.i, m.r[0], m.r[1], m.r[2], m.r[3], -N * 0.6, -N * 0.6, N * 1.2, N * 1.2); gg.restore(); };
    if (art === 'verschlissen') {   // Kratzer sind hell – dunkler Schatten darunter macht sie auch auf hellem Bauteil sichtbar
      const d2 = document.createElement('canvas'); d2.width = d2.height = N; const g2 = d2.getContext('2d');
      malen(g2, 1); g2.globalCompositeOperation = 'source-in'; g2.fillStyle = 'rgb(55,52,48)'; g2.fillRect(0, 0, N, N);
      g.globalAlpha = 0.55; g.drawImage(d2, 1, 1); g.globalAlpha = 1;
    }
    malen(g, 1);
    // weich auslaufend
    g.globalCompositeOperation = 'destination-in';
    const v = g.createRadialGradient(N / 2, N / 2, N * (o.weich ? 0.18 : 0.3), N / 2, N / 2, N / 2);
    v.addColorStop(0, 'rgba(0,0,0,1)'); v.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = v; g.fillRect(0, 0, N, N);
    if (formOk) {   // nur auf dem Bauteil
      const f = N / S;
      RB.zelle(g, form.blatt, form.nr, form.spalten, form.zeilen, (form.x - (mx - S / 2)) * f, (form.y - (my - S / 2)) * f, form.w * f, form.h * f, false);
    }
    if (belagSpeicher.size > 40) belagSpeicher.clear();
    belagSpeicher.set(k, c);
    return c;
  }
  // Belag zeichnen; gibt false zurück, wenn die Textur noch fehlt (dann zeichnet der Aufrufer den Ersatz)
  RB.belag = function (g, art, mx, my, S, form, o) {
    o = o || {};
    const d = Math.max(1, Math.min(3, (g.getTransform ? g.getTransform().a : 1) || 1));
    const c = belagLeinwand(art, S, d, form, mx, my, o);
    if (!c) return false;
    g.save();
    g.globalAlpha *= (o.alpha != null ? o.alpha : (BELAG[art] || [0, 0.85])[1]);
    g.drawImage(c, mx - S / 2, my - S / 2, S, S);
    g.restore();
    return true;
  };

  // Wo liegt das Bild eines Gegenstands? Erst das Werkzeugblatt, dann weitere Blätter (W.weitere: neue Hilfsmittel,
  // Ablenker – je { blatt, spalten, zeilen, liste }), sonst null (Platzhalter)
  // QA Spielertest-Runde (Ladegröße): Gegenstände als Einzelbild (teile.js, Material/Skripte/rohrbruch-teile.py) – je Einsatz laden
  // nur die gezeigten Gegenstände, nicht ganze Blätter. Rückgabe wie bei einer Blatt-Zelle (1 × 1), Aufrufer bleiben gleich.
  const TEILE = window.ROHRBRUCH_TEILE || {};
  RB.werkzeugZelle = function (name) {
    if (TEILE[name]) return { b: { blatt: TEILE[name], spalten: 1, zeilen: 1, liste: [name] }, nr: 0 };
    const W = window.ROHRBRUCH_WERKZEUG;
    const blaetter = [{ blatt: W.blatt, spalten: W.spalten, zeilen: W.zeilen, liste: W.liste }].concat(W.weitere || []);
    for (const b of blaetter) { const nr = b.liste.indexOf(name); if (nr >= 0) return { b, nr }; }
    return null;
  };
  // Werkzeug/Teil/Ablenker als Kachel-Bild (Leinwand) – für DOM-Elemente
  // Gegenstände mit eigenem Einzelbild statt Blatt-Zelle (Hundekekse im Transporter: bilder/keks.webp von Developer A)
  RB.EINZELBILDER = { Hundekekse: 'bilder/keks.webp', Hundekeks: 'bilder/keks.webp' };
  RB.werkzeugBild = function (name, groesse) {
    const c = document.createElement('canvas'), dpr = Math.min(2, devicePixelRatio || 1);
    c.width = c.height = Math.round(groesse * dpr);
    c.style.width = c.style.height = groesse + 'px';
    const g = c.getContext('2d');
    if (RB.EINZELBILDER[name]) {
      const i = RB.bild(RB.EINZELBILDER[name]);
      const malen = ok => {
        g.clearRect(0, 0, c.width, c.height);
        if (!ok) { c.classList.add('platzhalter'); platzhalter(g, c.width); return; }
        const f = Math.min(c.width / i.naturalWidth, c.height / i.naturalHeight) * 0.92, w = i.naturalWidth * f, h = i.naturalHeight * f;
        g.drawImage(i, (c.width - w) / 2, (c.height - h) / 2, w, h);
      };
      if (RB.geladen(i)) malen(true); else i.fertig.then(x => malen(!!x));
      return c;
    }
    const z = RB.werkzeugZelle(name);
    if (!z) c.classList.add('platzhalter');
    const malen = () => {
      g.clearRect(0, 0, c.width, c.height);
      if (z) RB.zelle(g, z.b.blatt, z.nr, z.b.spalten, z.b.zeilen, 0, 0, c.width, c.height, false);
      else platzhalter(g, c.width);
    };
    if (!z) { malen(); return c; }
    const i = RB.bild(z.b.blatt);
    if (RB.geladen(i)) malen(); else i.fertig.then(malen);
    return c;
  };
  // Platzhalter, bis der Graphic Artist das Bild liefert: graue Kiste mit gestricheltem Rand (Name steht darunter)
  function platzhalter(g, s) {
    g.save();
    g.setLineDash([s * 0.05, s * 0.04]); g.lineWidth = Math.max(1, s * 0.025); g.strokeStyle = '#9aa1a8';
    RB.rund(g, s * 0.06, s * 0.06, s * 0.88, s * 0.88, s * 0.12); g.stroke();
    g.setLineDash([]);
    g.fillStyle = '#b8bec4';
    g.beginPath(); g.moveTo(s * 0.22, s * 0.4); g.lineTo(s * 0.5, s * 0.28); g.lineTo(s * 0.78, s * 0.4); g.lineTo(s * 0.5, s * 0.52); g.closePath(); g.fill();
    g.fillStyle = '#a3aab1';
    g.beginPath(); g.moveTo(s * 0.22, s * 0.4); g.lineTo(s * 0.5, s * 0.52); g.lineTo(s * 0.5, s * 0.76); g.lineTo(s * 0.22, s * 0.64); g.closePath(); g.fill();
    g.fillStyle = '#8e969e';
    g.beginPath(); g.moveTo(s * 0.78, s * 0.4); g.lineTo(s * 0.5, s * 0.52); g.lineTo(s * 0.5, s * 0.76); g.lineTo(s * 0.78, s * 0.64); g.closePath(); g.fill();
    g.restore();
  }

  // ---------- Zahlen ----------
  RB.komma = (v, st) => (typeof v === 'number' ? v.toFixed(st == null ? 1 : st) : String(v)).replace('.', ',');
  RB.bereich = function (t) {   // '1–2' → [1, 2], '1,2' → [1.2, 1.2]
    if (t == null) return null;
    const z = String(t).replace(/,/g, '.').split(/[–-]/).map(Number).filter(n => !isNaN(n));
    return z.length ? [z[0], z[z.length - 1]] : null;
  };
  RB.zahl = v => typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.'));

  // ---------- Manometer ----------
  // a = { wert, max, einheit, bereich: [a, b], ziel, flaeche (Zifferblatt zeichnen), schritt (Beschriftung), klein, ohneZahlen }
  const WINKEL0 = Math.PI * 0.75, BOGEN = Math.PI * 1.5;
  RB.winkel = (v, max) => WINKEL0 + Math.max(0, Math.min(1.03, v / max)) * BOGEN;
  RB.manometer = function (g, cx, cy, r, a) {
    const max = a.max || 4;
    g.save();
    if (a.flaeche) {
      g.beginPath(); g.arc(cx, cy, r * 1.08, 0, Math.PI * 2);
      const v = g.createLinearGradient(cx, cy - r, cx, cy + r); v.addColorStop(0, '#d9dde2'); v.addColorStop(1, '#8b939b');
      g.fillStyle = v; g.fill();
      g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fillStyle = '#fbfbf8'; g.fill();
    }
    // äußerer, blasser Bereich (z. B. Druck auffüllen: „ungenau“ = 30 Punkte), darüber der markierte Bereich
    if (a.bereichAussen) {
      g.beginPath();
      g.arc(cx, cy, r * 0.8, RB.winkel(a.bereichAussen[0], max), RB.winkel(a.bereichAussen[1], max));
      g.lineWidth = r * 0.13; g.strokeStyle = R_.mitAlpha(F.haupt, 0.18); g.stroke();
    }
    // markierter Bereich als Band
    if (a.bereich) {
      g.beginPath();
      g.arc(cx, cy, r * 0.8, RB.winkel(a.bereich[0], max), RB.winkel(a.bereich[1], max));
      g.lineWidth = r * 0.13; g.strokeStyle = R_.mitAlpha(F.haupt, 0.55); g.stroke();
    }
    // Teilstriche
    const schritt = a.schritt || (max <= 4 ? 0.5 : max <= 10 ? 1 : max <= 150 ? 20 : 100);
    const fein = schritt / (max <= 10 ? 5 : 2);
    g.strokeStyle = '#222'; g.fillStyle = '#222'; g.textAlign = 'center'; g.textBaseline = 'middle';
    for (let v = 0; v <= max + 1e-6; v += fein) {
      const w = RB.winkel(v, max), gross = Math.abs(v / schritt - Math.round(v / schritt)) < 1e-6;
      const r1 = r * (gross ? 0.84 : 0.88), r2 = r * 0.95;
      g.lineWidth = gross ? Math.max(1.2, r * 0.025) : Math.max(0.7, r * 0.012);
      g.beginPath(); g.moveTo(cx + Math.cos(w) * r1, cy + Math.sin(w) * r1); g.lineTo(cx + Math.cos(w) * r2, cy + Math.sin(w) * r2); g.stroke();
      // ohneZahlen: nur Striche (Startbild-Bestwert, S2: Zahlen 200–800 drängten sich, der Wert steht darunter)
      if (gross && !a.ohneZahlen && (a.alleZahlen || Math.abs(v % (schritt * (max <= 4 ? 2 : 1))) < 1e-6 || max <= 4)) {
        const rt = r * 0.68;
        g.font = `600 ${Math.max(8, r * (max >= 100 ? 0.12 : 0.15))}px Barlow, system-ui, sans-serif`;
        if (max <= 4 && Math.abs(v - Math.round(v)) > 1e-6) continue;
        g.fillText(RB.komma(v, 0), cx + Math.cos(w) * rt, cy + Math.sin(w) * rt);
      }
    }
    if (a.ziel != null) {   // Zielmarke
      const w = RB.winkel(a.ziel, max);
      g.beginPath(); g.moveTo(cx + Math.cos(w) * r * 0.97, cy + Math.sin(w) * r * 0.97);
      g.lineTo(cx + Math.cos(w) * r * 0.72, cy + Math.sin(w) * r * 0.72);
      g.lineWidth = Math.max(2, r * 0.035); g.strokeStyle = F.haupt; g.stroke();
    }
    if (a.einheit) {
      g.font = `600 ${Math.max(8, r * 0.13)}px Barlow, system-ui, sans-serif`; g.fillStyle = '#444';
      g.fillText(a.einheit, cx, cy + r * 0.42);
    }
    if (a.wert != null) RB.nadel(g, cx, cy, r, RB.winkel(a.wert, max));
    g.restore();
  };
  RB.nadel = function (g, cx, cy, r, w) {
    g.save();
    g.translate(cx, cy); g.rotate(w);
    g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = r * 0.05; g.shadowOffsetY = r * 0.02;
    g.beginPath(); g.moveTo(-r * 0.16, -r * 0.035); g.lineTo(r * 0.86, 0); g.lineTo(-r * 0.16, r * 0.035); g.closePath();
    g.fillStyle = '#c62828'; g.fill();
    g.shadowColor = 'transparent';
    g.beginPath(); g.arc(0, 0, r * 0.08, 0, Math.PI * 2); g.fillStyle = '#333'; g.fill();
    g.restore();
  };

  // ---------- Geräte-Display ----------
  RB.lcd = function (g, x, y, w, h, text, a) {
    a = a || {};
    g.save();
    if (a.flaeche !== false) {
      g.fillStyle = '#0d1418'; g.fillRect(x, y, w, h);
    }
    const zeilen = String(text).split('\n');
    let fs = Math.min(h / (zeilen.length * 1.25), w * 0.2);
    g.font = `700 ${fs}px ui-monospace, "Cascadia Mono", Consolas, monospace`;
    const breit = Math.max(...zeilen.map(z => g.measureText(z).width));
    if (breit > w * 0.9) { fs *= w * 0.9 / breit; g.font = `700 ${fs}px ui-monospace, "Cascadia Mono", Consolas, monospace`; }
    g.fillStyle = a.farbe || '#9fe8ff'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.shadowColor = a.farbe || '#9fe8ff'; g.shadowBlur = fs * 0.35;
    zeilen.forEach((z, i) => g.fillText(z, x + w / 2, y + h / 2 + (i - (zeilen.length - 1) / 2) * fs * 1.2));
    g.restore();
  };

  // ---------- Punktschrift 5×7 ----------
  const GLYPHEN = { 'A': '0e11111f111111', 'B': '1e11111e11111e', 'C': '0e11101010110e', 'D': '1e11111111111e', 'E': '1f10101e10101f',
    'F': '1f10101e101010', 'G': '0e11101711110f', 'H': '1111111f111111', 'I': '0e04040404040e', 'J': '0702020202120c',
    'K': '11121418141211', 'L': '1010101010101f', 'M': '111b1515111111', 'N': '11111915131111', 'O': '0e11111111110e',
    'P': '1e11111e101010', 'Q': '0e11111115120d', 'R': '1e11111e141211', 'S': '0f10100e01011e', 'T': '1f040404040404',
    'U': '1111111111110e', 'V': '11111111110a04', 'W': '1111111515150a', 'X': '11110a040a1111', 'Y': '11110a04040404',
    'Z': '1f01020408101f', 'Ä': '0a000e111f1111', 'Ö': '0a000e1111110e', 'Ü': '0a00111111110e', '0': '0e11131519110e',
    '1': '040c040404040e', '2': '0e11010204081f', '3': '1f02040201110e', '4': '02060a121f0202', '5': '1f101e0101110e',
    '6': '0608101e11110e', '7': '1f010204080808', '8': '0e11110e11110e', '9': '0e11110f01020c', '-': '0000001f000000',
    '–': '0000001f000000', '.': '00000000000c0c', '/': '01020204080810', ':': '000c0c000c0c00', ' ': '00000000000000' };
  // Text als Punktmatrix in ein Rechteck einpassen; an = Farbe der leuchtenden Punkte. Gibt die Punktgröße zurück.
  RB.punktschrift = function (g, text, x, y, w, h, an, aus) {
    text = String(text).toUpperCase();
    const spalten = text.length * 6 - 1, zeilen = 7;
    const p = Math.min(w / spalten, h / zeilen), ox = x + (w - p * spalten) / 2, oy = y + (h - p * zeilen) / 2;
    g.save();
    for (let k = 0; k < text.length; k++) {
      const gl = GLYPHEN[text[k]] || GLYPHEN[' '];
      for (let r = 0; r < 7; r++) {
        const bits = parseInt(gl.substr(r * 2, 2), 16);
        for (let c = 0; c < 5; c++) {
          const leuchtet = bits & (16 >> c);
          if (!leuchtet && !aus) continue;
          g.beginPath();
          g.arc(ox + (k * 6 + c + 0.5) * p, oy + (r + 0.5) * p, p * 0.4, 0, Math.PI * 2);
          if (leuchtet) { g.fillStyle = an; g.shadowColor = an; g.shadowBlur = p * 0.9; }
          else { g.fillStyle = aus; g.shadowBlur = 0; }
          g.fill();
        }
      }
    }
    g.restore();
    return p;
  };

  // ---------- Zustände über einem Bauteil (Lupe) ----------
  // t = Zeit in Sekunden (für Tropfen, Flimmern); m = Mitte, s = Größe
  // form = Rückgabe von RB.zelle (Lupenbild des Bauteils): Beläge nur auf dem Bauteil
  RB.zustand = function (g, art, mx, my, s, t, form) {
    g.save();
    // Beläge als gestaltete Textur (Handgriff-Runde, MZ 25.10.2026), Fläche etwas größer als früher die Flecken
    if (BELAG[art] && RB.belag(g, art, mx, my, s * (art === 'vereist' ? 1.0 : 0.82), form)) { g.restore(); return; }
    switch (art) {
      case 'tropft': {   // gestaltete Tropfen: hängen, wachsen, fallen, Spritzer (zwei Quellen leicht versetzt)
        // Lupe: Tropfen lösen sich unten am Bauteil und fallen bis zum unteren Rand (dort ist Hintergrund – gut sichtbar)
        RB.wasserTropfen(g, mx - s * 0.03, my + s * 0.08, my + s * 0.88, s * 0.15, t, { takt: 2.4 });
        RB.wasserTropfen(g, mx + s * 0.07, my + s * 0.12, my + s * 0.9, s * 0.11, t, { takt: 3.1, versatz: 1.3 });
        break;
      }
      case 'nass': {   // Pfütze unten, etwas Wasser läuft herab
        RB.pfuetze(g, mx, my + s * 0.22, s * 0.95, t);
        break;
      }
      case 'verschlissen': {   // Abnutzung: helle Kratzer und abgeschliffene Kanten
        g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineCap = 'round';
        let z = 3;
        for (let k = 0; k < 14; k++) {
          z = (z * 9301 + 49297) % 233280; const a = z / 233280; z = (z * 9301 + 49297) % 233280; const b = z / 233280;
          g.lineWidth = s * (0.006 + a * 0.008);
          g.beginPath(); g.moveTo(mx + (a - 0.5) * s * 0.5, my + (b - 0.5) * s * 0.5); g.lineTo(mx + (a - 0.5) * s * 0.5 + s * 0.08, my + (b - 0.5) * s * 0.5 - s * 0.03); g.stroke();
        }
        break;
      }
      case 'verschmutzt': case 'verkalkt': case 'korrodiert': {
        const farbe = art === 'verkalkt' ? 'rgba(240,236,220,' : art === 'korrodiert' ? 'rgba(150,72,30,' : 'rgba(85,78,64,';
        let z = 7;
        g.filter = 'blur(' + Math.max(1, s * 0.012) + 'px)';   // weicher Belag statt einzelner Flecken
        for (let k = 0; k < 40; k++) {
          z = (z * 9301 + 49297) % 233280; const a = z / 233280;
          z = (z * 9301 + 49297) % 233280; const b = z / 233280;
          z = (z * 9301 + 49297) % 233280; const c = z / 233280;
          g.fillStyle = farbe + (0.35 + c * 0.35) + ')';
          g.beginPath(); g.ellipse(mx + (a - 0.5) * s * 0.55, my + (b - 0.5) * s * 0.55, s * (0.03 + c * 0.06), s * (0.02 + a * 0.04), b * 3, 0, Math.PI * 2); g.fill();
        }
        break;
      }
      case 'brummt': case 'läuft': {
        g.strokeStyle = art === 'brummt' ? 'rgba(200,60,40,.85)' : 'rgba(40,140,90,.85)';
        g.lineWidth = s * 0.025; g.lineCap = 'round';
        const zitter = art === 'brummt' ? Math.sin(t * 40) * s * 0.01 : 0;
        for (let k = 1; k <= 3; k++) {
          g.globalAlpha = 0.35 + 0.65 * ((Math.sin(t * 4 - k) + 1) / 2);
          g.beginPath(); g.arc(mx + zitter, my, s * (0.12 + k * 0.09), -0.6, 0.6); g.stroke();
          g.beginPath(); g.arc(mx + zitter, my, s * (0.12 + k * 0.09), Math.PI - 0.6, Math.PI + 0.6); g.stroke();
        }
        break;
      }
      case 'warm': {
        g.strokeStyle = 'rgba(255,140,60,.6)'; g.lineWidth = s * 0.02; g.lineCap = 'round';
        for (let k = -1; k <= 1; k++) {
          g.beginPath();
          for (let i = 0; i <= 12; i++) {
            const yy = my - i * s * 0.03, xx = mx + k * s * 0.12 + Math.sin(i * 0.8 + t * 3 + k) * s * 0.025;
            i ? g.lineTo(xx, yy) : g.moveTo(xx, yy);
          }
          g.stroke();
        }
        break;
      }
      case 'kalt': {
        g.fillStyle = 'rgba(170,215,255,.28)'; g.beginPath(); g.arc(mx, my, s * 0.45, 0, Math.PI * 2); g.fill();
        break;
      }
      case 'steht': {
        g.fillStyle = 'rgba(30,30,30,.75)'; g.beginPath(); g.arc(mx + s * 0.32, my - s * 0.32, s * 0.08, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#fff'; g.fillRect(mx + s * 0.29, my - s * 0.35, s * 0.022, s * 0.06); g.fillRect(mx + s * 0.33, my - s * 0.35, s * 0.022, s * 0.06);
        break;
      }
      // ---------- Zustände der übrigen Orte (Phase 3, Format Abschnitt 4) ----------
      case 'lau': case 'unten warm': {   // lau: schwaches Flimmern; unten warm: unten warm, oben kühl
        if (art === 'unten warm') { g.fillStyle = 'rgba(170,215,255,.22)'; g.fillRect(mx - s * 0.45, my - s * 0.45, s * 0.9, s * 0.4); }
        g.strokeStyle = art === 'lau' ? 'rgba(255,160,90,.35)' : 'rgba(255,140,60,.6)'; g.lineWidth = s * 0.018; g.lineCap = 'round';
        const y0 = art === 'lau' ? my : my + s * 0.3;
        for (let k = -1; k <= 1; k++) {
          g.beginPath();
          for (let i = 0; i <= (art === 'lau' ? 6 : 8); i++) { const yy = y0 - i * s * 0.03, xx = mx + k * s * 0.12 + Math.sin(i * 0.8 + t * 2 + k) * s * 0.02; i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); }
          g.stroke();
        }
        break;
      }
      case 'zischt': case 'pfeift': {   // Luft entweicht: Bögen wandern nach außen; pfeift zusätzlich feine Wellenlinie
        g.strokeStyle = 'rgba(70,80,90,.6)'; g.lineWidth = s * 0.012; g.lineCap = 'round';
        for (let k = 0; k < 4; k++) { const ph = (t * (art === 'pfeift' ? 1.6 : 1.1) + k / 4) % 1; g.globalAlpha = 1 - ph; g.beginPath(); g.arc(mx, my, s * (0.08 + ph * 0.3), -0.55, 0.55); g.stroke(); }
        if (art === 'pfeift') {
          g.globalAlpha = 0.8; g.beginPath();
          for (let i = 0; i <= 20; i++) { const xx = mx + s * 0.1 + i * s * 0.012, yy = my - s * 0.22 + Math.sin(i * 1.4 + t * 12) * s * 0.02; i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); }
          g.stroke();
        }
        break;
      }
      case 'gluckert': {   // Luftblasen steigen auf
        for (let k = 0; k < 6; k++) {
          const ph = (t * 0.5 + k / 6) % 1, xx = mx + Math.sin(k * 2.1 + t) * s * 0.12, yy = my + s * 0.25 - ph * s * 0.5, r = s * (0.015 + (k % 3) * 0.008);
          g.globalAlpha = 0.8 * (1 - ph); g.strokeStyle = 'rgba(120,170,220,1)'; g.lineWidth = Math.max(1, s * 0.006);
          g.beginPath(); g.arc(xx, yy, r, 0, Math.PI * 2); g.stroke();
        }
        break;
      }
      case 'vereist': {   // Eis/Raureif: weißer Schleier mit Eiskristallen
        const v = g.createRadialGradient(mx, my, 0, mx, my, s * 0.5);
        v.addColorStop(0, 'rgba(235,245,255,.55)'); v.addColorStop(1, 'rgba(235,245,255,0)');
        g.fillStyle = v; g.beginPath(); g.arc(mx, my, s * 0.5, 0, Math.PI * 2); g.fill();
        g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = Math.max(1, s * 0.006);
        let z = 5;
        for (let k = 0; k < 9; k++) {
          z = (z * 9301 + 49297) % 233280; const a = z / 233280; z = (z * 9301 + 49297) % 233280; const b = z / 233280;
          const cx = mx + (a - 0.5) * s * 0.7, cy = my + (b - 0.5) * s * 0.7, r = s * 0.03;
          for (let i = 0; i < 3; i++) { const w = i * Math.PI / 3; g.beginPath(); g.moveTo(cx - Math.cos(w) * r, cy - Math.sin(w) * r); g.lineTo(cx + Math.cos(w) * r, cy + Math.sin(w) * r); g.stroke(); }
        }
        break;
      }
      case 'schleift': {   // Schleifgeräusch: kurze Funken/Kratzspuren
        g.strokeStyle = 'rgba(230,120,40,.85)'; g.lineWidth = Math.max(1, s * 0.01); g.lineCap = 'round';
        for (let k = 0; k < 5; k++) {
          const ph = (t * 2 + k / 5) % 1, w = -0.6 + k * 0.3;
          g.globalAlpha = 1 - ph;
          g.beginPath(); g.moveTo(mx + Math.cos(w) * s * 0.18, my + Math.sin(w) * s * 0.18 + s * 0.1); g.lineTo(mx + Math.cos(w) * s * (0.22 + ph * 0.12), my + Math.sin(w) * s * (0.22 + ph * 0.12) + s * 0.1); g.stroke();
        }
        break;
      }
      case 'warnung': {   // Warnmarkierung (z. B. im Sichtfenster): Dreieck mit Ausrufezeichen
        const r = s * 0.12, x = mx + s * 0.3, y = my - s * 0.3;
        g.fillStyle = '#f2b632'; g.strokeStyle = '#222'; g.lineWidth = Math.max(1.5, s * 0.01);
        g.beginPath(); g.moveTo(x, y - r); g.lineTo(x + r * 1.1, y + r * 0.8); g.lineTo(x - r * 1.1, y + r * 0.8); g.closePath(); g.fill(); g.stroke();
        g.fillStyle = '#222'; g.font = `900 ${r * 1.1}px Barlow, system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('!', x, y + r * 0.15);
        break;
      }
      default: break;   // trocken, sauber: nichts darüberlegen
    }
    g.restore();
  };
  // einzelner Tropfen (Entlüften, Ersatz); mit Bild: fallender Tropfen aus rohrbruch-wasser.png
  RB.tropfen = function (g, x, y, r) {
    if (RB.motivZeichnen(g, 'wasser', 'fallend', x, y, r * 2.3, r * 2.8)) return;
    g.beginPath();
    g.moveTo(x, y - r * 1.8);
    g.bezierCurveTo(x + r * 0.2, y - r, x + r, y - r * 0.2, x + r, y + r * 0.3);
    g.arc(x, y + r * 0.3, r, 0, Math.PI);
    g.bezierCurveTo(x - r, y - r * 0.2, x - r * 0.2, y - r, x, y - r * 1.8);
    g.fillStyle = 'rgba(110,170,230,.9)'; g.fill();
    g.fillStyle = 'rgba(255,255,255,.7)'; g.beginPath(); g.arc(x - r * 0.35, y + r * 0.1, r * 0.25, 0, Math.PI * 2); g.fill();
  };

  // Schild mit Wert (z. B. „55 °C“) – für Anzeigen ohne eigenes Zifferblatt
  RB.schild = function (g, x, y, text, s) {
    g.save();
    g.font = `700 ${s}px Barlow, system-ui, sans-serif`;
    const w = g.measureText(text).width + s * 1.1, h = s * 1.6;
    g.fillStyle = 'rgba(13,20,24,.88)';
    RB.rund(g, x - w / 2, y - h / 2, w, h, h * 0.3); g.fill();
    g.fillStyle = '#9fe8ff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, x, y + s * 0.05);
    g.restore();
  };
  RB.rund = function (g, x, y, w, h, r) {
    g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  };

  // Leinwand an ein Element anpassen (Gerätepixel), gibt Kontext mit CSS-Pixel-Maßstab zurück
  RB.leinwand = function (c) {
    const dpr = Math.min(2.5, devicePixelRatio || 1), w = c.clientWidth, h = c.clientHeight;
    if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    const g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { g, w, h };
  };
})();
