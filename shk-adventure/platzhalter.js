// Rohrbruch – Platzhalter, bis der Graphic Artist die Bilder liefert (Phase 3, 25.10.2026):
// - Raum eines Orts ohne Eintrag in orte.js: gezeichneter Raum mit allen Stellen und Verstecken beschriftet, damit jeder Ort
//   schon spielbar ist. Sobald Raumbilder da sind, bekommt der Ort in orte.js einen echten Eintrag – dann gilt dieser.
(function () {
  'use strict';
  const RB = window.RB = window.RB || {};
  const R_ = window.Rahmen, F = R_.farben;

  // Farbton je Ort, damit sich die Platzhalter-Räume unterscheiden
  const TON = { HK: '#cdbfa8', BA: '#bcd3dc', KU: '#d9cdb3', GW: '#c9d2c4', WP: '#b9cfb2', DB: '#d6c3a5', AT: '#cfc0b8', HA: '#bfc3c7', WZ: '#d9c9b4', BU: '#c4ccd8' };

  function umbrechen(g, text, max) {
    const w = String(text).split(' '), z = [];
    let a = '';
    w.forEach(x => { const t = a ? a + ' ' + x : x; if (g.measureText(t).width > max && a) { z.push(a); a = x; } else a = t; });
    if (a) z.push(a);
    return z;
  }
  // Positionen im Raster (Raum 1024×1024): Stellen oben/mitte, Verstecke in zwei Reihen unten
  function raster(n, x0, y0, x1, y1) {
    if (!n) return [];
    const sp = Math.max(1, Math.ceil(Math.sqrt(n * (x1 - x0) / (y1 - y0))));
    const zl = Math.ceil(n / sp), out = [];
    for (let i = 0; i < n; i++) {
      const r = Math.floor(i / sp), c = i % sp, inZeile = Math.min(sp, n - r * sp);
      const dx = (x1 - x0) / inZeile, dy = zl > 1 ? (y1 - y0) / (zl - 1) : 0;
      out.push([Math.round(x0 + dx * (c + 0.5)), Math.round(zl > 1 ? y0 + dy * r : (y0 + y1) / 2)]);
    }
    return out;
  }

  RB.platzhalterOrt = function (kz, od, stoerungen) {
    const varianten = {};
    ['A', 'B'].forEach(v => {
      const namen = [];
      (od.vorrat || []).forEach(s => { if ((!s.nur || s.nur === v) && !namen.includes(s.name)) namen.push(s.name); });
      (stoerungen || []).forEach(st => {
        if (!st.varianten.includes(v)) return;
        st.stellen.concat(st.m2 ? st.m2.stellen : []).forEach(s => { if (!namen.includes(s.name)) namen.push(s.name); });
      });
      const vs = (od.verstecke || []).filter(x => x.varianten.includes(v)).map(x => x.name);
      const stellen = {}, verstecke = {};
      raster(namen.length, 90, 120, 934, 640).forEach((p, i) => { stellen[namen[i]] = p; });
      raster(vs.length, 90, 790, 934, 930).forEach((p, i) => { verstecke[vs[i]] = p; });
      varianten[v] = { bild: raumBild(kz, od, v, stellen, verstecke), stellen, verstecke, platzhalter: true };
    });
    return { varianten, bauteile: { blaetter: [], stellen: {}, masse: {} }, raumstellen: [], platzhalter: true };
  };

  function raumBild(kz, od, v, stellen, verstecke) {
    const c = document.createElement('canvas'); c.width = c.height = 1024;
    const g = c.getContext('2d'), ton = TON[kz] || '#cfc8bc';
    const wand = g.createLinearGradient(0, 0, 0, 740);
    wand.addColorStop(0, R_.toenen(ton, 0.12)); wand.addColorStop(1, ton);
    g.fillStyle = wand; g.fillRect(0, 0, 1024, 740);
    const boden = g.createLinearGradient(0, 740, 0, 1024);
    boden.addColorStop(0, R_.toenen(ton, -0.28)); boden.addColorStop(1, R_.toenen(ton, -0.42));
    g.fillStyle = boden; g.fillRect(0, 740, 1024, 284);
    g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, 736, 1024, 6);
    // Name des Orts groß und blass
    const name = String(od.name || kz).split(' | ')[v === 'B' ? 1 : 0] || od.name;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = 'rgba(0,0,0,.08)'; g.font = '800 120px Barlow, system-ui, sans-serif';
    umbrechen(g, name, 940).forEach((z, i, a) => g.fillText(z, 512, 400 + (i - (a.length - 1) / 2) * 130));
    g.fillStyle = 'rgba(0,0,0,.45)'; g.font = '600 26px Barlow, system-ui, sans-serif';
    g.fillText('Platzhalter – ' + name + ' (Variante ' + v + ')', 512, 46);
    // Stellen: helles Kärtchen unter der Marke
    g.font = '600 19px Barlow, system-ui, sans-serif';
    Object.entries(stellen).forEach(([n, [x, y]]) => {
      g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.arc(x, y, 34, 0, Math.PI * 2); g.fill();
      const z = umbrechen(g, n, 170);
      const h = z.length * 22 + 8, w = Math.max(...z.map(t => g.measureText(t).width)) + 16;
      g.fillStyle = 'rgba(255,255,255,.82)'; RB.rund(g, x - w / 2, y + 40, w, h, 7); g.fill();
      g.fillStyle = '#333'; z.forEach((t, i) => g.fillText(t, x, y + 40 + 15 + i * 22));
    });
    // Verstecke: dunkles Kärtchen
    Object.entries(verstecke).forEach(([n, [x, y]]) => {
      const z = umbrechen(g, n, 170);
      const h = z.length * 22 + 8, w = Math.max(...z.map(t => g.measureText(t).width)) + 16;
      g.fillStyle = 'rgba(30,34,40,.55)'; RB.rund(g, x - w / 2, y + 38, w, h, 7); g.fill();
      g.fillStyle = '#fff'; z.forEach((t, i) => g.fillText(t, x, y + 38 + 15 + i * 22));
    });
    return c.toDataURL('image/jpeg', 0.8);
  }

})();
