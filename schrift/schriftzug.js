/* Schriftzug „Rohrbruch!“ (Phase 4, MZ 25.10.2026: Variante C – gebrochenes o ohne Tropfen, dazu „!“).
   Barlow fett; das o ist ein Ring aus zwei Hälften mit gezacktem Bruch (Rohr-Querschnitt), die rechte Hälfte leicht
   nach rechts oben versetzt; darunter eine leicht geschwungene Linie, die einfach ausläuft.
   Farbe: currentColor (SVG) bzw. frei (Leinwand) – weiß auf Kundenfarbe, Markenfarbe auf hellem Grund.

   Benutzung
     <script src="../schrift/schriftzug.js"></script>
     const svg = Schriftzug.svg({ linie: true });       // <svg> mit fill="currentColor", Breite per CSS setzen
     Schriftzug.zeichne(g, x, y, breite, '#fff');        // Leinwand: links oben bei x/y, Höhe = breite / Schriftzug.seitenverhaeltnis
     Schriftzug.ring(R, r)                               // { links, rechts, versatz } – Ringhälften als SVG-Pfad (Mitte 0/0)
   Teile im SVG (für Animationen): .sz-R, .sz-rest (h r b r u c h), .sz-o > .sz-o-l / .sz-o-r, .sz-ausruf, .sz-linie
   Die Buchstaben-Umrisse trägt Material/Skripte/schriftzug-bauen.js aus der TTF ein (nicht von Hand ändern). */
(function (wurzel) {
  'use strict';
  /*GLYPHEN-ANFANG*/
  const G = {"quelle":"Barlow-Bold.ttf","upm":1000,"xHoehe":514,"versal":700,"o":{"w":557,"box":[39,-8,518,522],"strichSeite":142,"strichOben":121},"glyphen":{"R":{"d":"M431 -9L306 -286Q304 -290 300 -290L207 -290Q202 -290 202 -285L202 -12Q202 -7 198.5 -3.5Q195 0 190 0L73 0Q68 0 64.5 -3.5Q61 -7 61 -12L61 -688Q61 -693 64.5 -696.5Q68 -700 73 -700L359 -700Q423 -700 471.5 -674Q520 -648 546.5 -600Q573 -552 573 -489Q573 -421 539 -372.5Q505 -324 444 -304Q439 -302 441 -297L577 -14Q579 -10 579 -8Q579 0 568 0L445 0Q435 0 431 -9ZM202 -574L202 -403Q202 -398 207 -398L338 -398Q380 -398 406.5 -423Q433 -448 433 -488Q433 -528 406.5 -553.5Q380 -579 338 -579L207 -579Q202 -579 202 -574Z","w":614,"box":[61,0,579,700]},"h":{"d":"M498 -340L498 -12Q498 -7 494.5 -3.5Q491 0 486 0L369 0Q364 0 360.5 -3.5Q357 -7 357 -12L357 -311Q357 -351 334.5 -376Q312 -401 275 -401Q238 -401 215.5 -376Q193 -351 193 -311L193 -12Q193 -7 189.5 -3.5Q186 0 181 0L64 0Q59 0 55.5 -3.5Q52 -7 52 -12L52 -688Q52 -693 55.5 -696.5Q59 -700 64 -700L181 -700Q186 -700 189.5 -696.5Q193 -693 193 -688L193 -467Q193 -464 195 -463Q197 -462 198 -464Q239 -522 320 -522Q400 -522 449 -473Q498 -424 498 -340Z","w":547,"box":[52,0,498,700]},"r":{"d":"M365 -507Q373 -503 371 -492L350 -378Q349 -366 336 -371Q321 -376 301 -376Q293 -376 279 -374Q243 -371 218 -347.5Q193 -324 193 -285L193 -12Q193 -7 189.5 -3.5Q186 0 181 0L64 0Q59 0 55.5 -3.5Q52 -7 52 -12L52 -502Q52 -507 55.5 -510.5Q59 -514 64 -514L181 -514Q186 -514 189.5 -510.5Q193 -507 193 -502L193 -464Q193 -461 195 -460Q197 -459 198 -461Q239 -521 308 -521Q344 -521 365 -507Z","w":383,"box":[52,0,373,521]},"b":{"d":"M526 -259Q526 -190 509 -138Q486 -70 435.5 -31Q385 8 316 8Q243 8 201 -47Q199 -49 197 -48.5Q195 -48 195 -45L195 -12Q195 -7 191.5 -3.5Q188 0 183 0L66 0Q61 0 57.5 -3.5Q54 -7 54 -12L54 -688Q54 -693 57.5 -696.5Q61 -700 66 -700L183 -700Q188 -700 191.5 -696.5Q195 -693 195 -688L195 -474Q195 -471 197 -470Q199 -469 201 -472Q240 -522 312 -522Q385 -522 434.5 -484.5Q484 -447 507 -383Q526 -331 526 -259ZM380 -256Q380 -325 356 -362Q332 -401 285 -401Q241 -401 218 -362Q196 -324 196 -257Q196 -190 216 -156Q240 -113 286 -113Q335 -113 359 -156Q380 -194 380 -256Z","w":566,"box":[54,-8,526,700]},"u":{"d":"M364 -514L481 -514Q486 -514 489.5 -510.5Q493 -507 493 -502L493 -12Q493 -7 489.5 -3.5Q486 0 481 0L364 0Q359 0 355.5 -3.5Q352 -7 352 -12L352 -46Q352 -49 350 -49.5Q348 -50 346 -47Q306 7 222 7Q146 7 97 -39Q48 -85 48 -168L48 -502Q48 -507 51.5 -510.5Q55 -514 60 -514L176 -514Q181 -514 184.5 -510.5Q188 -507 188 -502L188 -203Q188 -163 209.5 -138Q231 -113 269 -113Q303 -113 325 -133.5Q347 -154 352 -187L352 -502Q352 -507 355.5 -510.5Q359 -514 364 -514Z","w":545,"box":[48,-7,493,514]},"c":{"d":"M56 -142Q39 -192 39 -260Q39 -327 56 -376Q80 -444 139 -483Q198 -522 278 -522Q358 -522 418.5 -482Q479 -442 499 -381Q507 -357 507 -345L507 -343Q507 -334 497 -332L382 -315L380 -315Q371 -315 368 -325L365 -341Q358 -367 334 -384Q310 -401 277 -401Q245 -401 223 -385Q201 -369 192 -341Q181 -311 181 -259Q181 -207 191 -177Q200 -147 222.5 -130Q245 -113 277 -113Q308 -113 331.5 -129.5Q355 -146 364 -175Q365 -177 365 -181Q366 -182 366 -184Q367 -196 380 -194L495 -176Q505 -174 505 -165Q505 -157 499 -135Q478 -68 417.5 -30Q357 8 278 8Q198 8 139.5 -32Q81 -72 56 -142Z","w":537,"box":[39,-8,507,522]},"!":{"d":"M116 -252L103 -688Q103 -693 106.5 -696.5Q110 -700 115 -700L232 -700Q237 -700 240.5 -696.5Q244 -693 244 -688L229 -252Q229 -247 225.5 -243.5Q222 -240 217 -240L128 -240Q123 -240 119.5 -243.5Q116 -247 116 -252ZM88 -80Q88 -115 110 -137Q132 -159 167 -159Q202 -159 223.5 -137Q245 -115 245 -80Q245 -46 223 -23.5Q201 -1 167 -1Q133 -1 110.5 -23.5Q88 -46 88 -80Z","w":344,"box":[88,1,245,700]}}};
  /*GLYPHEN-ENDE*/

  const r1 = n => Math.round(n * 10) / 10;

  // ---------- gebrochener Ring ----------
  // Zickzack des Bruchs je Band (außen → innen), x als Anteil von R; oben und unten verschieden, damit es echt wirkt
  const ZACK_OBEN = [0.02, -0.05, 0.045, -0.035];
  const ZACK_UNTEN = [-0.025, 0.05, -0.04, 0.03];
  // Punkte des Bruchs in einem Band (außen → innen); dx verschiebt die Bruchkante (halbe Spaltbreite)
  function band(R, r, xs, unten, dx) {
    const s = unten ? 1 : -1, n = xs.length - 1;
    const yA = x => s * Math.sqrt(Math.max(0, R * R - x * x)), yI = x => s * Math.sqrt(Math.max(0, r * r - x * x));
    const xa = xs[0] * R + dx, xi = xs[n] * R + dx;
    return xs.map((f, i) => [f * R + dx, yA(xa) * (1 - i / n) + yI(xi) * i / n]);
  }
  const winkel = p => Math.atan2(p[1], p[0]);
  const spanne = (a, b, steigend) => { let d = steigend ? b - a : a - b; while (d < 0) d += 2 * Math.PI; return d; };
  // Ring mit Mitte 0/0 aus zwei Hälften: Bruch als Zickzack mit gleichmäßigem Spalt (spalt = Spaltbreite),
  // versatz = Verschiebung der rechten Hälfte (Standard ca. 5 % des Durchmessers nach rechts oben)
  function ring(R, r, versatz, spalt) {
    const h = (spalt != null ? spalt : 0.035 * R) / 2;
    const P = p => r1(p[0]) + ' ' + r1(p[1]);
    const bogen = (rad, von, nach, steigend) => `A${r1(rad)} ${r1(rad)} 0 ${spanne(winkel(von), winkel(nach), steigend) > Math.PI ? 1 : 0} ${steigend ? 1 : 0} ${P(nach)}`;
    const linie = pts => pts.map(p => 'L' + P(p)).join('');
    // links: außen von oben über links nach unten, Bruch unten nach innen, innen zurück nach oben, Bruch oben nach außen
    let oben = band(R, r, ZACK_OBEN, false, -h), unten = band(R, r, ZACK_UNTEN, true, -h);
    let To = oben[0], Ti = oben[oben.length - 1], Bo = unten[0], Bi = unten[unten.length - 1];
    const links = 'M' + P(To) + bogen(R, To, Bo, false) + linie(unten.slice(1)) + bogen(r, Bi, Ti, true) +
      linie(oben.slice(0, -1).reverse()) + 'Z';
    oben = band(R, r, ZACK_OBEN, false, h); unten = band(R, r, ZACK_UNTEN, true, h);
    To = oben[0]; Ti = oben[oben.length - 1]; Bo = unten[0]; Bi = unten[unten.length - 1];
    const rechts = 'M' + P(To) + linie(oben.slice(1)) + bogen(r, Ti, Bi, true) + linie(unten.slice(0, -1).reverse()) +
      bogen(R, Bo, To, false) + 'Z';
    const v = versatz || [0.08 * R, -0.05 * R];
    return { links, rechts, versatz: v };
  }

  // ---------- Aufbau des Schriftzugs (Schrifteinheiten, Grundlinie y = 0, y nach unten) ----------
  const RA = 272, RI = 140;                          // Ring: außen etwas größer als das echte o (Blickfang), Strich ≈ o
  const OMY = -G.xHoehe / 2;                         // Ringmitte auf halber x-Höhe
  // Bruch deutlicher (MZ, 25.10.2026: „wirkt groß nur wie zwei feine Kerben“): rechte Hälfte ca. 8 % nach rechts oben,
  // Spalt breiter. Das App-Icon behält seine eigenen Maße (icon unten) und bleibt unverändert.
  const VERSATZ = [44, -30];                         // rechte Hälfte ca. 8 % nach rechts oben (vorher [24, -16])
  const LINKS = [0, 0];                              // linke Hälfte bleibt (Schalter, falls der Bruch klein mehr Luft braucht)
  const SPALT = 26;                                  // Spaltbreite im Bruch (vorher 16)
  const LUFT = 40;                                   // Vor- und Nachbreite des Rings
  const teile = []; let x = 0;
  const buchstabe = (ch, klasse) => { teile.push({ k: klasse, ch, x, d: G.glyphen[ch].d }); x += G.glyphen[ch].w; };
  buchstabe('R', 'sz-R');
  const oX = x + LUFT + RA; x += 2 * LUFT + 2 * RA + VERSATZ[0];
  for (const ch of 'hrbruch') buchstabe(ch, 'sz-rest');
  const wortEnde = x;
  x -= 10; buchstabe('!', 'sz-ausruf');
  const BREITE = x;
  const O = ring(RA, RI, VERSATZ, SPALT);

  // Linie unter dem Wort: Mittellinie als Kurve, Stärke läuft von voll auf 0 aus (kein Tropfen)
  function linienPfad() {
    const x0 = 100, x1 = wortEnde - 20, y0 = 110;
    const kurve = t => {   // kubische Bézierkurve, leicht geschwungen
      const p = [[x0, y0], [x0 + (x1 - x0) * 0.3, y0 + 140], [x0 + (x1 - x0) * 0.62, y0 - 100], [x1, y0 + 10]], u = 1 - t;
      return [0, 1].map(i => u * u * u * p[0][i] + 3 * u * u * t * p[1][i] + 3 * u * t * t * p[2][i] + t * t * t * p[3][i]);
    };
    const N = 56, D0 = 100, oben = [], unten = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N, a = kurve(Math.max(0, t - 0.01)), b = kurve(Math.min(1, t + 0.01)), m = kurve(t);
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, nx = -(b[1] - a[1]) / l, ny = (b[0] - a[0]) / l;
      const d = D0 / 2 * Math.pow(1 - t, 0.6);
      oben.push([m[0] + nx * d, m[1] + ny * d]); unten.push([m[0] - nx * d, m[1] - ny * d]);
    }
    const P = p => r1(p[0]) + ' ' + r1(p[1]);
    return 'M' + P(unten[0]) + `A${D0 / 2} ${D0 / 2} 0 0 0 ` + P(oben[0]) + oben.slice(1).map(p => 'L' + P(p)).join('') +
      unten.slice(0, -1).reverse().map(p => 'L' + P(p)).join('') + 'Z';
  }
  const LINIE = linienPfad();
  const OBEN = -750, UNTEN = 200;                    // Oberkante (Versalhöhe 700 + Luft), Unterkante mit Linie
  const VB = [-6, OBEN, BREITE + 12, UNTEN - OBEN];
  const VB_OHNE = [-6, OBEN, BREITE + 12, 40 - OBEN];

  const NS = 'http://www.w3.org/2000/svg';
  function svgText(opt) {
    opt = opt || {};
    const linie = opt.linie !== false, vb = linie ? VB : VB_OHNE;
    let s = `<svg xmlns="${NS}" viewBox="${vb.join(' ')}" fill="currentColor" role="img" aria-label="Rohrbruch!"` +
      (opt.klasse ? ` class="${opt.klasse}"` : '') + '><title>Rohrbruch!</title>';
    let rest = '';
    for (const t of teile) {
      const p = `<path transform="translate(${t.x} 0)" d="${t.d}"/>`;
      if (t.k === 'sz-rest') rest += `<g>${p}</g>`; else s += `<g class="${t.k}">${p}</g>`;   // eigene <g> je Buchstabe: CSS-Bewegung ohne die Lage zu überschreiben
    }
    s += `<g class="sz-rest">${rest}</g>`;
    s += `<g class="sz-o" transform="translate(${oX} ${OMY})"><path class="sz-o-l" transform="translate(${LINKS[0]} ${LINKS[1]})" d="${O.links}"/>` +
      `<path class="sz-o-r" transform="translate(${O.versatz[0]} ${O.versatz[1]})" d="${O.rechts}"/></g>`;
    if (linie) s += `<path class="sz-linie" d="${LINIE}"/>`;
    return s + '</svg>';
  }
  function svg(opt) {
    const t = document.createElement('template'); t.innerHTML = svgText(opt);
    return t.content.firstChild;
  }
  // Leinwand: links oben bei (x, y), Breite b; Höhe = b * vb[3] / vb[2]
  let p2d = null;
  function zeichne(g, x0, y0, b, farbe, opt) {
    opt = opt || {};
    const vb = opt.linie === false ? VB_OHNE : VB, s = b / vb[2];
    if (!p2d) p2d = { teile: teile.map(t => ({ x: t.x, p: new Path2D(t.d) })), l: new Path2D(O.links), r: new Path2D(O.rechts), linie: new Path2D(LINIE) };
    g.save(); g.fillStyle = farbe || '#fff';
    g.translate(x0 - vb[0] * s, y0 - vb[1] * s); g.scale(s, s);
    for (const t of p2d.teile) { g.save(); g.translate(t.x, 0); g.fill(t.p); g.restore(); }
    g.save(); g.translate(oX, OMY); g.translate(LINKS[0], LINKS[1]); g.fill(p2d.l); g.translate(O.versatz[0] - LINKS[0], O.versatz[1] - LINKS[1]); g.fill(p2d.r); g.restore();
    if (opt.linie !== false) g.fill(p2d.linie);
    g.restore();
  }

  const api = {
    svg, svgText, zeichne, ring,
    // Maße in Schrifteinheiten (für Animationen): Ringmitte, Radien, viewBox
    masse: { viewBox: VB, viewBoxOhneLinie: VB_OHNE, oMitte: [oX, OMY], RA, RI, versatz: VERSATZ, links: LINKS, spalt: SPALT, breite: BREITE },
    seitenverhaeltnis: VB[2] / VB[3],
    // App-Icon (Variante 2) im 512er Raster: Ring und Platz des Firmenzeichens – gilt für icons-bauen.js und das Intro
    icon: { N: 512, RA: 186, RI: 122, versatz: [15, -10], spalt: 11, zeichenPlatz: 0.86 },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else wurzel.Schriftzug = api;
})(typeof window !== 'undefined' ? window : this);
