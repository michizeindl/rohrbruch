// Rohrbruch – Einsatzbuch-Ansicht (Phase 3, Baustein 7): Raster aller 100 Karten. Gefundene mit Bild, Titel und Erklärsatz,
// nicht gefundene abgegraut (ohne „demnächst“). Fortschritt „x/100“, Filter je Ort, sanfte Animationen.
// Aufruf aus dem vorläufigen Menü über shk-adventure/#buch (Zurück führt zum Menü).
(function () {
  'use strict';
  const RB = window.RB, R_ = window.Rahmen;
  const NBSP = ' ';
  const nb = t => String(t).replace(/ – /g, NBSP + '– ');
  function el(tag, klasse, text) { const e = document.createElement(tag); if (klasse) e.className = klasse; if (text != null) e.textContent = nb(RB.trenn ? RB.trenn(text) : text); return e; }

  // Bild einer Karte: Lupenbild der ersten Befund-Stelle (orte.js), sonst ein ruhiges Zeichen mit dem Ort-Kürzel
  function kartenBild(c, k) {
    const O = window.ROHRBRUCH_ORTE || {}, b = O[k.ort] && O[k.ort].bauteile;
    const name = b && (k.befund || []).find(n => b.stellen[n]);
    const malen = () => {
      if (!c.isConnected) return;
      const { g, w, h } = RB.leinwand(c);
      g.clearRect(0, 0, w, h);
      if (name) { const z = b.stellen[name]; RB.zelle(g, b.blaetter[z[0]], z[1], 3, 2, 0, 0, w, h, false); return; }
      const r = Math.min(w, h) * 0.36;
      g.fillStyle = R_.mitAlpha(R_.farben.haupt, 0.12); g.beginPath(); g.arc(w / 2, h / 2, r, 0, Math.PI * 2); g.fill();
      g.fillStyle = R_.farben.haupt; g.font = `800 ${r * 0.62}px Barlow, system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(k.ort, w / 2, h / 2);
    };
    requestAnimationFrame(malen);
    if (name) { const z = b.stellen[name]; RB.bild(b.blaetter[z[0]]).fertig.then(() => requestAnimationFrame(malen)); }
  }

  // o = { katalog, orte: { HK: 'Heizungskeller', … }, gefunden: [ids], zurueck(), zurueckText }
  RB.buchZeigen = function (o) {
    const alt = document.querySelector('.rb-buchansicht'); if (alt) alt.remove();
    const gef = new Set(o.gefunden || []), alle = o.katalog || [];
    const box = el('div', 'rb-buchansicht'); box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Einsatzbuch');
    const kopf = el('div', 'rb-buchansichtkopf');
    const zu = el('button', 'rb-knopf zweit rb-buchzurueck', o.zurueckText || 'Zurück'); zu.type = 'button';
    zu.addEventListener('click', () => { R_.ton('klick'); box.classList.add('weg'); setTimeout(() => { box.remove(); o.zurueck && o.zurueck(); }, RB.ruhig ? 0 : 220); });
    const titel = el('div', 'rb-buchtitel');
    titel.append(el('h2', '', 'Einsatzbuch'), el('span', 'rb-buchzahl', alle.filter(k => gef.has(k.id)).length + '/' + alle.length));
    const balken = el('div', 'rb-buchbalken'), fuell = el('i'); balken.append(fuell);
    kopf.append(titel, zu);
    const filter = el('div', 'rb-buchfilter'); filter.setAttribute('role', 'tablist');
    // Spielertest 25.10.2026: Reiter laufen auf dem Handy rechts aus dem Bild – waagerecht scrollbar mit sichtbarem Hinweis
    // (Rand blendet aus, Pfeil-Knopf scrollt weiter); der gewählte Reiter rückt ganz ins Bild
    const filterBox = el('div', 'rb-buchfilterbox');
    const pfeil = (seite, zeichen) => { const b = el('button', 'rb-buchpfeil ' + seite, zeichen); b.type = 'button'; b.tabIndex = -1; b.setAttribute('aria-hidden', 'true');
      b.addEventListener('click', () => filter.scrollBy({ left: (seite === 'rechts' ? 1 : -1) * filter.clientWidth * 0.7, behavior: RB.ruhig ? 'auto' : 'smooth' })); return b; };
    filterBox.append(filter, pfeil('links', '‹'), pfeil('rechts', '›'));
    const filterRand = () => {
      const mehrL = filter.scrollLeft > 4, mehrR = filter.scrollLeft + filter.clientWidth < filter.scrollWidth - 4;
      filterBox.classList.toggle('mehr-links', mehrL); filterBox.classList.toggle('mehr-rechts', mehrR);
    };
    filter.addEventListener('scroll', filterRand, { passive: true });
    addEventListener('resize', filterRand);
    const raster = el('div', 'rb-buchraster');
    box.append(kopf, balken, filterBox, raster);
    const orte = Object.keys(o.orte);
    let aktiv = null;
    function chip(ort, text) {
      const n = alle.filter(k => (!ort || k.ort === ort)).length, f = alle.filter(k => (!ort || k.ort === ort) && gef.has(k.id)).length;
      const b = el('button', 'rb-buchchip'); b.type = 'button'; b.setAttribute('role', 'tab');
      b.append(el('span', '', text), el('small', '', f + '/' + n));
      b.addEventListener('click', () => { R_.ton('klick'); zeigen(ort); });
      b.dataset.ort = ort || '';
      return b;
    }
    filter.append(chip(null, 'Alle'));
    orte.forEach(ort => filter.append(chip(ort, o.orte[ort].replace(' | ', '/'))));
    function zeigen(ort) {
      aktiv = ort;
      filter.querySelectorAll('.rb-buchchip').forEach(b => { const an = b.dataset.ort === (ort || ''); b.classList.toggle('aktiv', an); b.setAttribute('aria-selected', an); });
      raster.textContent = '';
      const an = filter.querySelector('.rb-buchchip.aktiv');
      if (an && an.scrollIntoView) an.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: RB.ruhig ? 'auto' : 'smooth' });
      // gefundene Karten zuerst (Spielertest 25.10.2026), Reihenfolge sonst wie im Katalog
      const liste = alle.filter(k => (!ort || k.ort === ort) && gef.has(k.id)).concat(alle.filter(k => (!ort || k.ort === ort) && !gef.has(k.id)));
      liste.forEach((k, i) => {
        const da = gef.has(k.id);
        const karte = el(da ? 'button' : 'div', 'rb-buchfeld' + (da ? '' : ' offen'));
        karte.style.animationDelay = (RB.ruhig ? 0 : Math.min(i, 24) * 0.025) + 's';
        const nr = el('small', 'rb-buchnr', o.orte[k.ort].replace(' | ', '/') + ' – ' + Number(k.id.slice(3)));
        if (da) {
          karte.type = 'button';
          const c = el('canvas', 'rb-buchfeldbild');
          karte.append(c, nr, el('b', '', k.titel), el('p', '', k.erklaer));
          kartenBild(c, k);
          karte.addEventListener('click', () => { R_.ton('klick'); gross(k); });
        } else {
          karte.setAttribute('aria-label', 'Noch nicht gefunden');
          karte.append(el('span', 'rb-buchfrage', '?'), nr);
        }
        raster.append(karte);
      });
      raster.scrollTop = 0;
    }
    // große Karte (ganzer Erklärsatz, Meister-Ursache ggf. dazu)
    function gross(k) {
      const hg = el('div', 'rb-buchgross'), karte = el('div', 'rb-buchkarte');
      const c = el('canvas', 'rb-buchbild');
      const k2 = el('div', 'rb-buchkopf'); // Kopf: Ortsname und Nummer statt interner Kennung (QA Phase 3: „Bad – Nr. 4“ statt „Einsatzbuch – BA-04“)
      k2.append(el('small', '', o.orte[k.ort].replace(' | ', '/') + ' – Nr. ' + Number(k.id.slice(3))), el('span', 'rb-buchstand', 'Einsatzbuch'));
      karte.append(k2, c, el('h2', '', k.titel), el('p', 'rb-erklaer', k.erklaer));
      if (k.m2erklaer) karte.append(el('p', 'rb-erklaer', k.m2erklaer));
      const b = el('button', 'rb-knopf haupt', 'Schließen'); b.type = 'button';
      const weg = () => { hg.remove(); };
      b.addEventListener('click', weg); hg.addEventListener('click', e => { if (e.target === hg) weg(); });
      karte.append(b); hg.append(karte); box.append(hg);
      kartenBild(c, k);
      b.focus({ preventScroll: true });
    }
    document.body.append(box);
    requestAnimationFrame(() => { fuell.style.width = (alle.length ? gef.size / alle.length * 100 : 0) + '%'; });
    zeigen(null);
    requestAnimationFrame(filterRand);
    zu.focus({ preventScroll: true });
    return box;
  };
})();
