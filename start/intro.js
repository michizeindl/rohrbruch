/* Intro der Startseite „Rohrbruch“ – „Das Rohr gibt nach“ (Phase 4, Ablauf nach Vorbild „Akten & Action“, MZ 24.10.2026).
   ca. 3s Code-Animation beim ersten Öffnen je Sitzung, ohne Ton, Tippen überspringt:
   App-Icon mittig auf der Kundenfläche → Kachel löst sich auf → Firmenzeichen hebt sich aus dem gebrochenen o und schwebt
   an seine Stelle im Logo, der Logo-Schriftzug blendet ein (Logo am Ende vollständig und unverändert) → das gebrochene o
   fliegt an seinen Platz im Titel, schließt sich im Flug und ruckt beim Aufsetzen auseinander („Rohr gibt nach“) →
   übrige Buchstaben, „!“ und die Linie erscheinen → Verteiler und Stufen-Kacheln gleiten nacheinander herein.
   Weniger Bewegung (prefers-reduced-motion): Icon kurz still, dann sanfte Einblendung.
   Testhilfe: #intro (immer abspielen), #intro=1.4 (Standbild bei 1,4s).
   Passt sich an: Kundenfarbe (Fläche, Kachel), Firmenzeichen (aus dem eingebetteten Logo, Gruppe #zeichen). Hat ein
   Kundenlogo keine Gruppe #zeichen, fliegt das Zeichen zum Logo und das ganze Logo blendet dort ein. */
(function () {
  'use strict';
  const wurzel = document.documentElement;
  if (!wurzel.classList.contains('intro') || !window.RBStart || !window.Schriftzug) { wurzel.classList.remove('intro'); return; }
  const S = window.RBStart, SZ = window.Schriftzug, K = window.KUNDE || {};
  const IC = SZ.icon, M = SZ.masse;
  const test = /(?:^#|&)intro(?:=([\d.]+))?(?:&|$)/.exec(location.hash);
  const stand = test && test[1] != null ? parseFloat(test[1]) : null;
  const ruhig = S.ruhig;

  // ---------- Hilfen ----------
  const klemme = (v, a, b) => Math.min(b, Math.max(a, v));
  const anteil = (t, a, b) => klemme((t - a) / (b - a), 0, 1);
  const weich = p => p * p * (3 - 2 * p);
  const inOut = p => p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  const raus = p => 1 - Math.pow(1 - p, 3);
  const zurueck = p => { const c = 1.7; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };   // mit Überschwingen
  const misch = (a, b, p) => a + (b - a) * p;
  const NS = 'http://www.w3.org/2000/svg';

  // Zeitplan in Sekunden
  const Z = {
    icon: [0, 0.35], kachelAus: [0.35, 0.65], heben: [0.45, 0.78], zFlug: [0.78, 1.36], logo: [1.3, 1.72],
    oFlug: [1.0, 1.76], schliessen: [1.0, 1.45], ruck: [1.76, 2.04], R: [1.8, 2.08], rest: 1.86, abc: 0.045,
    ausruf: [2.06, 2.38], linie: [2.1, 2.56], gesamt: 2.18, kacheln: 2.26, unten: 2.62, ende: 3.0,
  };
  const ZR = { icon: [0, 0.25], aus: [0.7, 1.05], zeigen: 0.6, ende: 1.05 };   // weniger Bewegung

  // ---------- Bühne ----------
  const buehne = document.createElement('div');
  buehne.id = 'intro'; buehne.setAttribute('aria-hidden', 'true');
  const kachel = document.createElement('div'); kachel.className = 'flug kachel';
  const ringSvg = document.createElementNS(NS, 'svg'); ringSvg.setAttribute('class', 'flug'); ringSvg.setAttribute('viewBox', '-130 -130 260 260');
  ringSvg.style.width = ringSvg.style.height = '260px'; ringSvg.style.overflow = 'visible';
  const pL = document.createElementNS(NS, 'path'), pR = document.createElementNS(NS, 'path');
  pL.setAttribute('fill', '#fff'); pR.setAttribute('fill', '#fff'); ringSvg.append(pL, pR);
  let zeichen = null, zSeiten = [123.8, 100];
  buehne.append(kachel, ringSvg);

  // Ringform (Radius außen 100): Icon → Titel
  const RING_ICON = { r: IC.RI / IC.RA * 100, v: [IC.versatz[0] / IC.RA * 100, IC.versatz[1] / IC.RA * 100], s: IC.spalt / IC.RA * 100 };
  const RING_TITEL = { r: M.RI / M.RA * 100, v: [M.versatz[0] / M.RA * 100, M.versatz[1] / M.RA * 100], s: M.spalt / M.RA * 100 };
  function ringForm(p, vFaktor, wackeln) {   // p: 0 = Icon-Form, 1 = Titel-Form
    const r = misch(RING_ICON.r, RING_TITEL.r, p), sp = misch(RING_ICON.s, RING_TITEL.s, p);
    const v = [misch(RING_ICON.v[0], RING_TITEL.v[0], p) * vFaktor, misch(RING_ICON.v[1], RING_TITEL.v[1], p) * vFaktor];
    const o = SZ.ring(100, r, v, sp);
    pL.setAttribute('d', o.links);
    pR.setAttribute('d', o.rechts);
    pR.setAttribute('transform', `translate(${(v[0] + (wackeln || 0)).toFixed(2)} ${v[1].toFixed(2)}) rotate(${((wackeln || 0) * 0.6).toFixed(2)})`);
  }
  const setze = (el, x, y, k, a) => { el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${k.toFixed(4)})`; el.style.opacity = a; };

  // ---------- Ziele auf der Seite ----------
  const titelSvg = S.titel.querySelector('svg');
  const teil = sel => titelSvg.querySelector(sel);
  const oTitel = teil('.sz-o'), R_ = teil('.sz-R'), rest = [...titelSvg.querySelectorAll('.sz-rest > g')], ausruf = teil('.sz-ausruf'), linie = teil('.sz-linie');
  let logoZ = null, logoS = null;
  function ziele() {
    const vw = innerWidth, vh = innerHeight;
    const N = klemme(Math.min(vw, vh) * 0.42, 132, 230), u = N / IC.N;
    const C = [vw / 2, vh * 0.47];
    const tr = titelSvg.getBoundingClientRect(), vb = M.viewBox, st = tr.width / vb[2];
    const oZiel = [tr.left + (M.oMitte[0] - vb[0]) * st, tr.top + (M.oMitte[1] - vb[1]) * st, M.RA * st];
    const ziel = { N, u, C, oZiel };
    // Zeichen im Icon: größtes Rechteck im Innenkreis (wie icons-bauen.js)
    const diag = Math.hypot(zSeiten[0], zSeiten[1]) / 2, zs = IC.RI * IC.zeichenPlatz / diag * u;
    ziel.zStart = [C[0] - zSeiten[0] * zs / 2, C[1] - zSeiten[1] * zs / 2, zSeiten[0] * zs];
    const lz = (logoZ || S.logoBox).getBoundingClientRect();
    ziel.zZiel = logoZ ? [lz.left, lz.top, lz.width] : [lz.left, lz.top + (lz.height - lz.height * 0.8) / 2, lz.height * 0.8 * zSeiten[0] / zSeiten[1]];
    return ziel;
  }

  // ---------- ein Bild zum Zeitpunkt t ----------
  let gezeigt = { gesamt: false, kacheln: false, unten: false };
  function bild(t) {
    const g = ziele(), { N, u, C, oZiel } = g;
    if (ruhig) {   // weniger Bewegung: Icon still, dann blendet alles weich über
      const a = raus(anteil(t, ZR.icon[0], ZR.icon[1])) * (1 - anteil(t, ZR.aus[0], ZR.aus[1]));
      setze(kachel, C[0] - N / 2, C[1] - N / 2, N / 100, a);
      const k = IC.RA * u / 100; ringForm(0, 1, 0);
      setze(ringSvg, C[0] - 130 * k, C[1] - 130 * k, k, a);
      if (zeichen) setze(zeichen, g.zStart[0], g.zStart[1], g.zStart[2] / 100, a);
      if (t >= ZR.zeigen && !gezeigt.kacheln) { gezeigt.kacheln = true; endeSeite(); }
      return;
    }
    // App-Kachel: erscheint, löst sich auf
    const ein = raus(anteil(t, Z.icon[0], Z.icon[1])), aus = anteil(t, Z.kachelAus[0], Z.kachelAus[1]);
    const kk = misch(0.82, 1, ein) * misch(1, 1.1, weich(aus));
    setze(kachel, C[0] - N * kk / 2, C[1] - N * kk / 2, N * kk / 100, (ein * (1 - weich(aus))).toFixed(3));
    const iconK = misch(0.82, 1, ein);   // Ring und Zeichen wachsen mit der Kachel

    // Firmenzeichen: hebt sich, fliegt ins Logo
    if (zeichen) {
      const h = weich(anteil(t, Z.heben[0], Z.heben[1])), f = inOut(anteil(t, Z.zFlug[0], Z.zFlug[1]));
      const w0 = g.zStart[2] * iconK * misch(1, 1.14, h);
      const x0 = C[0] - w0 / 2, y0 = C[1] - w0 * zSeiten[1] / zSeiten[0] / 2 - h * N * 0.05;
      const [x1, y1, w1] = g.zZiel;
      const bogen = Math.sin(f * Math.PI) * -N * 0.12;   // leichter Bogen nach oben
      const w = misch(w0, w1, f);
      const da = t < Z.zFlug[1];
      setze(zeichen, misch(x0, x1, f), misch(y0, y1, f) + bogen, w / 100, da ? ein.toFixed(3) : 0);
      if (logoZ) logoZ.style.opacity = da ? 0 : 1;
      const ls = weich(anteil(t, Z.logo[0], Z.logo[1]));
      if (logoS) logoS.style.opacity = ls; else if (!logoZ) S.logoBox.style.opacity = ls;
    }

    // gebrochenes o: schließt sich im Flug, fliegt in den Titel, ruckt beim Aufsetzen auseinander
    const fo = inOut(anteil(t, Z.oFlug[0], Z.oFlug[1]));
    const zu = weich(anteil(t, Z.schliessen[0], Z.schliessen[1]));
    const rk = anteil(t, Z.ruck[0], Z.ruck[1]);
    let vF = misch(1, 0.2, zu), wack = 0;
    if (rk > 0) {
      vF = rk < 0.3 ? misch(0.2, 1.55, raus(rk / 0.3)) : misch(1.55, 1, zurueck((rk - 0.3) / 0.7) );
      wack = Math.sin(rk * Math.PI * 5) * (1 - rk) * 3.5;
    }
    ringForm(weich(fo), vF, wack);
    const R0 = IC.RA * u * iconK, R1 = oZiel[2];
    const rad = misch(R0, R1, fo), cx = misch(C[0], oZiel[0], fo), cy = misch(C[1], oZiel[1], fo) + Math.sin(fo * Math.PI) * -N * 0.18;
    // beim Aufsetzen kurz gestaucht
    const stauch = rk > 0 ? 1 - Math.sin(Math.min(1, rk / 0.35) * Math.PI) * 0.06 : 1;
    const k = rad / 100 * stauch;
    const imTitel = t >= Z.ruck[1];
    setze(ringSvg, cx - 130 * k, cy - 130 * k, k, imTitel ? 0 : ein.toFixed(3));
    oTitel.style.opacity = imTitel ? 1 : 0;

    // übrige Buchstaben, „!“, Linie
    const pop = (el, p, hoch) => {
      el.style.opacity = klemme(p * 1.6, 0, 1).toFixed(3);
      el.style.transform = p >= 1 ? '' : `translateY(${((1 - raus(p)) * hoch).toFixed(1)}%) scale(${misch(0.7, 1, zurueck(p)).toFixed(3)})`;
    };
    pop(R_, anteil(t, Z.R[0], Z.R[1]), 18);
    rest.forEach((el, i) => pop(el, anteil(t, Z.rest + i * Z.abc, Z.rest + i * Z.abc + 0.26), 22));
    pop(ausruf, anteil(t, Z.ausruf[0], Z.ausruf[1]), 30);
    const lp = raus(anteil(t, Z.linie[0], Z.linie[1]));
    linie.style.opacity = lp > 0 ? 1 : 0;
    linie.style.clipPath = lp >= 1 ? '' : `inset(0 ${((1 - lp) * 100).toFixed(1)}% 0 0)`;

    // Seite: gestaffelt herein
    if (t >= Z.gesamt && !gezeigt.gesamt) { gezeigt.gesamt = true; S.zeigen(S.TITEL.slice(1), 0, 0); }
    if (t >= Z.kacheln && !gezeigt.kacheln) { gezeigt.kacheln = true; S.zeigen([S.rohre, ...S.kacheln()], 0.12, 0); S.nadeln(500); }
    if (t >= Z.unten && !gezeigt.unten) { gezeigt.unten = true; S.zeigen([S.KOPF[1], ...S.UNTEN], 0.08, 0); }
  }

  // Seite für reduzierte Bewegung bzw. Überspringen
  function endeSeite() {
    const alle = [S.KOPF[1], S.TITEL[1], S.rohre, ...S.kacheln(), ...S.UNTEN].filter(el => el && !el.classList.contains('da'));
    S.zeigen(alle, ruhig ? 0.04 : 0.05, 0);
    if (!gezeigt.kacheln || ruhig) S.nadeln(ruhig ? 0 : 300);
    gezeigt = { gesamt: true, kacheln: true, unten: true };
  }

  let laeuft = true, t0 = 0, rafId = 0;
  function beenden() {
    if (!laeuft) return;
    laeuft = false; cancelAnimationFrame(rafId);
    endeSeite();
    [oTitel, R_, ...rest, ausruf, linie].forEach(el => { el.style.opacity = ''; el.style.transform = ''; el.style.clipPath = ''; });
    if (logoZ) logoZ.style.opacity = ''; if (logoS) logoS.style.opacity = ''; S.logoBox.style.opacity = '';
    wurzel.classList.remove('intro'); wurzel.classList.add('nachIntro');
    buehne.style.transition = 'opacity .25s'; buehne.style.opacity = 0;
    setTimeout(() => buehne.remove(), 300);
    try { sessionStorage.setItem('mg:intro:rohrbruch:' + (K.firma || ''), '1'); } catch (e) { /* privat */ }
    S.rohreZeichnen();
  }
  function schritt(jetzt) {
    if (!laeuft) return;
    if (!t0) t0 = jetzt;
    const t = stand != null ? stand : (jetzt - t0) / 1000;
    bild(t);
    if (stand == null && t >= (ruhig ? ZR.ende : Z.ende)) { beenden(); return; }
    rafId = requestAnimationFrame(schritt);
  }

  function los() {
    // Logo und Titel selbst sichtbar, ihre Teile steuert das Intro
    [S.logoBox, S.titel].forEach(el => { el.classList.remove('ein'); el.style.opacity = ''; });
    const logoSvg = S.logoBox.querySelector('svg');
    logoZ = logoSvg && logoSvg.querySelector('#zeichen');
    logoS = logoSvg && logoSvg.querySelector('#schriftzug');
    if (!logoZ) { logoS = null; S.logoBox.style.opacity = 0; }
    // fliegendes Zeichen: Kopie der Zeichen-Gruppe aus dem Logo (weiß); ohne Gruppe: Datei zeichenWeiss
    if (logoZ) {
      const bb = logoZ.getBBox(); zSeiten = [bb.width, bb.height];
      zeichen = document.createElementNS(NS, 'svg');
      zeichen.setAttribute('viewBox', `${bb.x} ${bb.y} ${bb.width} ${bb.height}`);
      zeichen.setAttribute('class', 'flug'); zeichen.style.width = '100px'; zeichen.style.height = (100 * bb.height / bb.width) + 'px';
      zeichen.style.overflow = 'visible'; zeichen.style.fill = '#fff';
      const kopie = logoZ.cloneNode(true); kopie.removeAttribute('id'); kopie.style.opacity = 1; kopie.style.fill = '#fff';
      zeichen.append(kopie);
    } else if (K.zeichenWeiss) {
      zeichen = new Image(); zeichen.src = K.zeichenWeiss; zeichen.className = 'flug'; zeichen.style.width = '100px';
    }
    if (zeichen) buehne.append(zeichen);
    document.body.append(buehne);
    if (stand == null) {
      buehne.addEventListener('pointerdown', beenden);
      addEventListener('keydown', beenden, { once: true });
    }
    rafId = requestAnimationFrame(schritt);
  }
  // auf das eingebettete Logo warten (lokal, schnell), höchstens 0,6s
  let gestartet = false;
  const start = () => { if (!gestartet) { gestartet = true; los(); } };
  S.logoBereit.then(start, start);
  setTimeout(start, 600);
  window.RBIntro = { beenden, bild };
})();
