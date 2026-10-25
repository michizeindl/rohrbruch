// Rohrbruch – Ton (Phase 4, 25.10.2026): Musik, Raumgeräusche je Ort und Effekte.
// Eigene Ton-Steuerung neben dem Rahmen (gemeinsam/ bleibt unverändert), weil das Spiel mehr braucht als Rahmen.ton:
// Musik im Startbild, bei Fahrt und Einsatz (dort leiser), nicht im Endbild – Raumgeräusche in Schichten mit Kreuzblende,
// seltene Ereignisse (Knarzen, Spülkasten, Gluckern) – Effekte mit leichter Tonhöhen-Variation und Seltenheit (Hund).
// Rahmen.ton wird umgeleitet: Namen aus FX spielt diese Datei, alle anderen (erzeugte Töne) weiter der Rahmen.
// Ton an/aus: Rahmen-Knopf (#tonKnopf, Speicher mg:ton). Ton erst nach dem ersten Tippen (Browser-Regel).
// Klänge: shk-adventure/klaenge/*.mp3 (Mono 22,05 kHz, lameenc), Musik = Sammlungs-Musik ../klaenge/musik.mp3
// (dieselbe Datei wie die Startseite, kommt also meist aus dem Zwischenspeicher). Quellen: Material/Sounds/quellen.txt.
// Testhilfen: RB.klang.zustand(), RB.klang.protokoll (zuletzt gespielte Klänge), #tonprotokoll (Konsole).
(function () {
  'use strict';
  const RB = window.RB = window.RB || {}, R_ = window.Rahmen;
  const PROTO_KONSOLE = /(^|[#&])tonprotokoll\b/.test(location.hash);

  // Name: [Proben (echte Länge, MP3-Stille wird weggeschnitten), Pegel]. Pegel aus dem Bau-Skript: alle Dateien auf Spitze
  // 0,89 normalisiert, Pegel bringt sie auf eine Ziel-Lautheit (lauteste 50 ms bzw. Durchschnitt bei Schleifen):
  // Stempel −13, Richtig/Abschluss −16, Falsch −21, Handgriffe −19…−23, Tiere −23…−25, Klicks −22…−26 dBFS;
  // Raum-Grundschicht −37…−38 dBFS RMS, zweite Schicht −43…−46, Fahrt −36.
  const FX = {
    'stempel': [14553, 0.817],
    'akzent': [7717, 0.478],
    'lupe': [3528, 0.304],
    'gut': [5953, 0.48],
    'fehler': [10143, 0.152],
    'klick': [3684, 0.708],
    'koffer': [29767, 0.532],
    'tuer-auf': [48510, 0.484],
    'tuer-zu': [44100, 0.452],
    'einpacken': [10804, 0.179],
    'nichts': [44100, 0.591],
    'kramen': [17640, 0.591],
    'ratsche': [32193, 1.0],
    'nachziehen': [11907, 1.0],
    'wasser': [76955, 0.749],
    'wasser-schleife': [48510, 0.618],
    'zischen': [15435, 0.359],
    'zischen-schleife': [5512, 0.229],
    'tropfen': [5292, 0.622],
    'abfluss': [55125, 0.418],
    'reinigen': [21829, 0.648],
    'piep': [5733, 0.869],
    'piep-kurz': [1984, 0.719],
    'einrasten': [3528, 0.767],
    'licht': [3307, 0.992],
    'funk': [6395, 0.179],
    'tier-schnurren': [66150, 0.449],
    'tier-maunzen': [40131, 0.206],
    'tier-hecheln': [66150, 0.301],
    'tier-bellen': [14554, 0.203],
    'keks': [14332, 0.982],
    'knarzen': [143325, 0.075],
    'spuelkasten': [87671, 0.062],
    'gluckern': [66150, 0.049],
  };
  const SCHLEIFEN = {
    'hk-pumpe': [352800, 0.064], 'brenner': [264600, 0.028], 'ba-luefter': [352800, 0.064], 'ba-tropfen': [308700, 0.106],
    'ku-kuehlschrank': [352800, 0.067], 'ku-uhr': [220500, 0.079], 'gw-luefter': [352800, 0.058], 'wp-garten': [441000, 0.087],
    'wp-ventilator': [220500, 0.035], 'db-wind': [352800, 0.085], 'at-luft': [352800, 0.069], 'ha-leitung': [441000, 0.087],
    'wz-uhr': [220500, 0.145], 'bu-klima': [352800, 0.06], 'fahrt': [308700, 0.089],
  };
  // Musik der Sammlung (Developer A, Startseite): Pegel 0,22 wie auf der Startseite; im Einsatz × 0,22 ≈ −13 dB
  const MUSIK = { datei: '../klaenge/musik.mp3', proben: 2859443, pegel: 0.22 };
  const MUSIK_EINSATZ = 0.22;
  // leichte Tonhöhen-Variation (±), damit Wiederholungen nicht nerven
  const VARI = { klick: 0.07, lupe: 0.05, einpacken: 0.06, 'piep-kurz': 0.03, tropfen: 0.08, ratsche: 0.03, nachziehen: 0.04,
    einrasten: 0.05, reinigen: 0.06, kramen: 0.05, nichts: 0.03, gut: 0.02, fehler: 0.02, gluckern: 0.06 };
  // Seltenheit: [Mindestabstand in s, Chance] – Hund freundlich und selten, Katze nicht bei jedem Handgriff
  const SELTEN = { 'tier-bellen': [45, 0.5], 'tier-hecheln': [8, 1], 'tier-maunzen': [25, 0.7], 'tier-schnurren': [2.5, 1] };
  // Raumgeräusche je Ort (Auswahl Material/Klaenge-Auswahl.md): Schichten (Schleifen) + seltenes Ereignis [Name, ab s, bis s]
  const ORTE = {
    HK: { schichten: ['hk-pumpe', 'brenner'] },
    BA: { schichten: ['ba-luefter', 'ba-tropfen'] },
    KU: { schichten: ['ku-kuehlschrank', 'ku-uhr'] },
    GW: { schichten: ['gw-luefter'], ereignis: ['spuelkasten', 40, 80] },
    WP: { schichten: ['wp-garten', 'wp-ventilator'] },
    DB: { schichten: ['db-wind'], ereignis: ['knarzen', 25, 60] },
    AT: { schichten: ['at-luft', 'brenner'] },
    HA: { schichten: ['ha-leitung'] },
    WZ: { schichten: ['wz-uhr'], ereignis: ['gluckern', 30, 60] },
    BU: { schichten: ['bu-klima'] },
  };
  // Ereignis-Klänge erst beim Betreten des Orts laden – außer gluckern (12 KB), das auch der Handgriff „Abfluss frei machen“ braucht
  const EREIGNISSE = Object.keys(ORTE).map(o => ORTE[o].ereignis && ORTE[o].ereignis[0]).filter(n => n && n !== 'gluckern');
  const info = n => n === 'musik' ? [MUSIK.proben, MUSIK.pegel] : FX[n] || SCHLEIFEN[n];
  const url = n => n === 'musik' ? MUSIK.datei : 'klaenge/' + n + '.mp3';

  // ---------- Grundlagen ----------
  let ac = null, haupt = null, busFx = null, busAtmo = null, busMusik = null;
  let speicherGeht = true;
  const tonGespeichert = () => { try { return localStorage.getItem('mg:ton') !== 'aus'; } catch (e) { speicherGeht = false; return true; } };
  let tonAn = tonGespeichert();
  const bytes = {}, puffer = {}, laedt = {}, zuletzt = {};
  const protokoll = [];
  function merken(name, art) {
    const e = { t: +(performance.now() / 1000).toFixed(2), name, art };
    protokoll.push(e); if (protokoll.length > 200) protokoll.shift();
    if (PROTO_KONSOLE) console.debug('[Ton]', art, name);   // eslint-disable-line no-console
  }
  function holen(n) {
    // fehlgeschlagen (z. B. Verbindung abgebrochen): nicht merken, beim nächsten Anlass neu versuchen
    if (!bytes[n]) bytes[n] = fetch(url(n)).then(r => r.ok ? r.arrayBuffer() : null).catch(() => null).then(b => { if (!b) delete bytes[n]; return b; });
    return bytes[n];
  }
  // MP3 bringt vorn 1105 Proben Stille (22,05 kHz) und hinten Füllstille mit – wie im Rahmen genau auf die echte Länge schneiden
  function zuschneiden(b, proben) {
    const RATE = 22050, VORLAUF = 1105, ueber = b.duration * RATE - proben;
    if (ueber < 2) return b;
    const ab = Math.round((ueber >= VORLAUF - 4 ? VORLAUF : 0) / RATE * b.sampleRate);
    const laenge = Math.min(b.length - ab, Math.round(proben / RATE * b.sampleRate));
    const neu = ac.createBuffer(b.numberOfChannels, laenge, b.sampleRate);
    for (let k = 0; k < b.numberOfChannels; k++) neu.getChannelData(k).set(b.getChannelData(k).subarray(ab, ab + laenge));
    return neu;
  }
  function laden(n) {
    if (puffer[n]) return Promise.resolve(puffer[n]);
    if (!ac) return Promise.resolve(null);
    if (!laedt[n]) {
      laedt[n] = holen(n)
        .then(b => b ? new Promise(ok => ac.decodeAudioData(b.slice(0), ok, () => ok(null))) : null)
        .then(b => { b = b ? zuschneiden(b, info(n)[0]) : null; puffer[n] = b; if (!b) delete laedt[n]; return b; })
        .catch(() => { delete laedt[n]; return null; });
    }
    return laedt[n];
  }
  function aufbauen() {
    haupt = ac.createGain(); haupt.gain.value = tonAn ? 1 : 0.0001;
    // sanfter Begrenzer, falls einmal mehrere Klänge zusammenfallen
    const grenze = ac.createDynamicsCompressor();
    grenze.threshold.value = -6; grenze.knee.value = 6; grenze.ratio.value = 12; grenze.attack.value = 0.003; grenze.release.value = 0.25;
    haupt.connect(grenze).connect(ac.destination);
    busFx = ac.createGain(); busAtmo = ac.createGain(); busMusik = ac.createGain();
    [busFx, busAtmo, busMusik].forEach(b => b.connect(haupt));
  }
  // Browser geben Ton erst nach einem Tippen frei: dann Ton-Umgebung anlegen und alle Effekte dekodieren
  function wecken() {
    if (!tonAn) return;
    const ua = navigator.userActivation;
    if (ua && !ua.hasBeenActive) return;
    if (!ac) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try { ac = new AC(); } catch (e) { return; }
      aufbauen();
      Object.keys(FX).filter(n => !EREIGNISSE.includes(n)).forEach(laden);
      ac.onstatechange = () => { if (ac.state === 'running') anwenden(); };
    }
    if (ac.state === 'suspended' && !document.hidden) ac.resume().catch(() => {});
    anwenden();
  }
  ['pointerup', 'touchend', 'click', 'keydown'].forEach(e => addEventListener(e, wecken, { passive: true, capture: true }));
  // Tab im Hintergrund: Ton anhalten (Musik soll nicht weiterlaufen)
  document.addEventListener('visibilitychange', () => {
    if (!ac) return;
    if (document.hidden) ac.suspend().catch(() => {});
    else if (tonAn) ac.resume().catch(() => {});
  });
  // Ton-Knopf des Rahmens: sein Klick-Handler läuft zuerst und schreibt mg:ton – danach hier lesen
  const knopf = document.querySelector('#tonKnopf');
  if (knopf) knopf.addEventListener('click', () => {
    tonAn = speicherGeht ? tonGespeichert() : !tonAn;
    if (!ac) { wecken(); return; }
    const t = ac.currentTime;
    haupt.gain.cancelScheduledValues(t); haupt.gain.setValueAtTime(Math.max(0.0001, haupt.gain.value), t);
    if (tonAn) { haupt.gain.linearRampToValueAtTime(1, t + 0.3); ac.resume().catch(() => {}); anwenden(); }
    else { haupt.gain.linearRampToValueAtTime(0.0001, t + 0.25); setTimeout(() => { if (!tonAn) { allesAus(); ac.suspend().catch(() => {}); } }, 350); }
    merken(tonAn ? 'an' : 'aus', 'schalter');
  });
  const laeuft = () => tonAn && ac && ac.state === 'running';

  // ---------- Effekte ----------
  // o: { faktor (Pegel ×), rate, vari, ab (s), dauer (s), verzoegerung (s), schleife, ein (Einblenden s) }
  function spielen(name, o) {
    o = o || {};
    const f = FX[name];
    if (!f) return null;
    if (!laeuft()) { merken(name, 'still'); return null; }
    const b = puffer[name];
    if (!b) { laden(name); merken(name, 'laedt'); return null; }
    const jetzt = ac.currentTime, vorher = zuletzt[name] != null ? jetzt - zuletzt[name] : 1e9;
    const s = SELTEN[name];
    if (s && (vorher < s[0] || Math.random() > s[1])) { merken(name, 'selten'); return null; }
    if (vorher < 0.04) return null;   // gleicher Klang doppelt im selben Augenblick
    zuletzt[name] = jetzt;
    const q = ac.createBufferSource(), v = ac.createGain();
    q.buffer = b; q.loop = !!o.schleife;
    const vari = o.vari != null ? o.vari : (VARI[name] || 0);
    q.playbackRate.value = (o.rate || 1) * (1 + (Math.random() * 2 - 1) * vari);
    const pegel = f[1] * (o.faktor || 1), t = jetzt + (o.verzoegerung || 0);
    if (o.ein) { v.gain.setValueAtTime(0.0001, t); v.gain.linearRampToValueAtTime(pegel, t + o.ein); } else v.gain.value = pegel;
    q.connect(v).connect(busFx);
    const ab = Math.max(0, Math.min(o.ab || 0, b.duration - 0.02));
    if (o.dauer) {
      const ende = t + o.dauer;
      v.gain.setValueAtTime(pegel, Math.max(t, ende - 0.08)); v.gain.linearRampToValueAtTime(0.0001, ende);
      q.start(t, ab); q.stop(ende + 0.02);
    } else q.start(t, ab);
    merken(name, 'spielt');
    let weg = false;
    return {
      aus(dauer) {
        if (weg) return; weg = true;
        const d = dauer != null ? dauer : 0.12, a = ac.currentTime;
        try { v.gain.cancelScheduledValues(a); v.gain.setValueAtTime(Math.max(0.0001, v.gain.value), a); v.gain.linearRampToValueAtTime(0.0001, a + d); q.stop(a + d + 0.03); } catch (e) { /* schon zu Ende */ }
      },
      rate(r) { try { q.playbackRate.setTargetAtTime(r, ac.currentTime, 0.05); } catch (e) { /* egal */ } },
    };
  }
  // gehaltener Klang (z. B. Wasser beim Füllen): optional Anfangsstück, dann Schleife; aus() blendet alles aus
  function halten(schleife, anfang, o) {
    o = o || {};
    const teile = [];
    let uhr = null, weg = false;
    const a = anfang ? spielen(anfang, o) : null;
    if (a) teile.push(a);
    const startSchleife = () => { if (weg) return; const s = spielen(schleife, Object.assign({}, o, { schleife: true, ein: 0.35, vari: 0 })); if (s) teile.push(s); };
    if (a && anfang && FX[anfang]) uhr = setTimeout(startSchleife, Math.max(0, FX[anfang][0] / 22050 - 0.6) * 1000);
    else startSchleife();
    return {
      aus(d) { weg = true; clearTimeout(uhr); teile.forEach(t => t.aus(d != null ? d : 0.18)); },
      rate(r) { teile.forEach(t => t.rate(r)); },
    };
  }

  // ---------- Szenen: Musik und Raumgeräusche ----------
  // start (Startbild) – titel – fahrt – raum (Einsatz, mit Ort) – buch (Einsatzbuch-Ansicht) – ende (Endbild: keine Musik)
  let szene = 'start', ort = null;
  let musik = null, musikWartet = false, musikVersuche = 0;
  const atmo = {};   // Name → { q, v } bzw. 'laedt'
  let ereignisUhr = null;
  const MUSIKFAKTOR = { start: 1, titel: 1, fahrt: 1, buch: 1, raum: MUSIK_EINSATZ };

  function musikSetzen() {
    const ziel = MUSIKFAKTOR[szene] || 0;
    if (!ziel) { if (musik) { const m = musik; musik = null; const t = ac.currentTime; m.v.gain.cancelScheduledValues(t); m.v.gain.setValueAtTime(Math.max(0.0001, m.v.gain.value), t); m.v.gain.linearRampToValueAtTime(0.0001, t + 1.0); try { m.q.stop(t + 1.1); } catch (e) { /* egal */ } merken('musik', 'aus'); } return; }
    const pegel = MUSIK.pegel * ziel;
    if (musik) {
      const t = ac.currentTime;
      musik.v.gain.cancelScheduledValues(t); musik.v.gain.setValueAtTime(Math.max(0.0001, musik.v.gain.value), t);
      musik.v.gain.linearRampToValueAtTime(pegel, t + 1.2);
      musik.ziel = pegel;
      return;
    }
    if (musikWartet) return;
    musikWartet = true;
    laden('musik').then(b => {
      musikWartet = false;
      // Abruf abgebrochen (Verbindung): nach kurzer Pause noch einmal versuchen, sonst bliebe das Startbild bis zum nächsten
      // Szenenwechsel still (Korrektur QA Phase 4)
      if (!b) { if (musikVersuche++ < 4) setTimeout(() => { if (laeuft()) musikSetzen(); }, 1500); return; }
      musikVersuche = 0;
      if (!laeuft() || musik || !MUSIKFAKTOR[szene]) return;
      const q = ac.createBufferSource(), v = ac.createGain(), t = ac.currentTime, p = MUSIK.pegel * MUSIKFAKTOR[szene];
      q.buffer = b; q.loop = true;   // Datei ist schon als Schleife geschnitten (Ende in den Anfang überblendet)
      v.gain.setValueAtTime(0.0001, t); v.gain.linearRampToValueAtTime(p, t + 1.2);
      q.connect(v).connect(busMusik); q.start();
      musik = { q, v, ziel: p };
      merken('musik', 'an');
    });
  }
  function atmoSetzen() {
    const soll = szene === 'fahrt' ? ['fahrt'] : szene === 'raum' && ORTE[ort] ? ORTE[ort].schichten : [];
    Object.keys(atmo).forEach(n => {
      if (soll.includes(n) || atmo[n] === 'laedt') return;
      const a = atmo[n]; delete atmo[n];
      const t = ac.currentTime;
      a.v.gain.cancelScheduledValues(t); a.v.gain.setValueAtTime(Math.max(0.0001, a.v.gain.value), t);
      a.v.gain.linearRampToValueAtTime(0.0001, t + 1.0);
      try { a.q.stop(t + 1.1); } catch (e) { /* egal */ }
      merken(n, 'aus');
    });
    soll.forEach(n => {
      if (atmo[n]) return;
      atmo[n] = 'laedt';
      laden(n).then(b => {
        const nochSoll = (szene === 'fahrt' ? ['fahrt'] : szene === 'raum' && ORTE[ort] ? ORTE[ort].schichten : []).includes(n);
        if (!b || !laeuft() || !nochSoll) { delete atmo[n]; if (nochSoll && laeuft()) setTimeout(atmoSetzen, 0); return; }
        const q = ac.createBufferSource(), v = ac.createGain(), t = ac.currentTime;
        q.buffer = b; q.loop = true;
        v.gain.setValueAtTime(0.0001, t); v.gain.linearRampToValueAtTime(SCHLEIFEN[n][1], t + 1.5);
        q.connect(v).connect(busAtmo); q.start(t, Math.random() * b.duration);
        atmo[n] = { q, v };
        merken(n, 'an');
      });
    });
  }
  // seltenes Einzelereignis im Raum (Dachboden knarzt, Spülkasten läuft nach, Heizkörper gluckert)
  function ereignisPlanen() {
    clearTimeout(ereignisUhr); ereignisUhr = null;
    const e = szene === 'raum' && ORTE[ort] && ORTE[ort].ereignis;
    if (!e) return;
    laden(e[0]);
    const fuer = ort;
    ereignisUhr = setTimeout(() => {
      if (szene !== 'raum' || ort !== fuer) return;
      if (!document.hidden) spielen(e[0]);
      ereignisPlanen();
    }, (e[1] + Math.random() * (e[2] - e[1])) * 1000);
  }
  function anwenden() {
    if (!laeuft()) return;
    musikSetzen();
    atmoSetzen();
  }
  function allesAus() {
    if (!ac) return;
    const t = ac.currentTime;
    if (musik) { try { musik.q.stop(t + 0.05); } catch (e) { /* egal */ } musik = null; }
    Object.keys(atmo).forEach(n => { const a = atmo[n]; delete atmo[n]; if (a !== 'laedt') try { a.q.stop(t + 0.05); } catch (e) { /* egal */ } });
  }

  RB.klang = {
    // Szene wechseln: 'start' | 'titel' | 'fahrt' | 'raum' (mit Ort-Kürzel) | 'buch' | 'ende'
    szene(name, o) {
      if (name === szene && (o || null) === ort) return;
      szene = name; ort = name === 'raum' ? (o || null) : null;
      merken(name + (ort ? ' ' + ort : ''), 'szene');
      ereignisPlanen();
      if (ac) anwenden();
    },
    // Raumgeräusche der gezogenen Orte schon laden (nur die Bytes; dekodiert wird beim Einsatz)
    orteVorladen(orte) { orte.forEach(o => (ORTE[o] ? ORTE[o].schichten : []).concat(ORTE[o] && ORTE[o].ereignis ? [ORTE[o].ereignis[0]] : []).forEach(holen)); },
    // Dateien eines Durchgangs (für den Service Worker, offline): Musik, alle Effekte, Fahrt, Raumgeräusche + Ereignis der Orte
    dateien(orte) {
      const n = ['musik', 'fahrt'].concat(Object.keys(FX).filter(x => !EREIGNISSE.includes(x)));
      orte.forEach(o => { if (ORTE[o]) n.push(...ORTE[o].schichten, ...(ORTE[o].ereignis ? [ORTE[o].ereignis[0]] : [])); });
      return [...new Set(n)].map(url);
    },
    ton: spielen,
    halten,
    get an() { return !!laeuft(); },
    protokoll,
    zustand() {
      return { szene, ort, ton: tonAn, kontext: ac ? ac.state : 'keiner',
        musik: musik ? +musik.v.gain.value.toFixed(4) : 0, musikZiel: musik ? +musik.ziel.toFixed(4) : 0,
        atmo: Object.keys(atmo).map(n => atmo[n] === 'laedt' ? n + ' (lädt)' : n + ' ' + atmo[n].v.gain.value.toFixed(3)),
        dekodiert: Object.keys(puffer).filter(n => puffer[n]).length };
    },
  };
  // Effekte und Musik schon laden (Bytes), dekodiert wird nach dem ersten Tippen
  holen('musik');
  Object.keys(FX).filter(n => !EREIGNISSE.includes(n)).forEach(holen);

  // Rahmen.ton umleiten: eigene Aufnahmen hier (mit Variation/Seltenheit), erzeugte Töne (dreh, wisch …) weiter im Rahmen
  if (R_ && R_.ton) {
    const rahmenTon = R_.ton;
    R_.ton = function (name, ab) {
      if (FX[name]) { const h = spielen(name, ab ? { ab } : null); return { aus() { if (h) h.aus(); } }; }
      return rahmenTon(name, ab);
    };
  }
})();
