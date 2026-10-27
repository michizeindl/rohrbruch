// Rohrbruch – Handgriffe als kurze Mini-Interaktionen (12 Arten laut Katalog, MZ 24.10.2026). Bedienbar mit Finger
// und Maus, ruhig, eindeutig. Jede Art baut sich in o.flaeche auf und meldet genau einmal o.fertig(guete):
//   'genau' (60 Punkte) – 'ungenau' (30) – 'anlauf2' (erst im 2. Anlauf geschafft, 10).
// o = { flaeche, param, werkzeug, bauteil: { blatt, zelle, masse } | null, notiz, code, meldung(text, art), fertig }
(function () {
  'use strict';
  const RB = window.RB, R_ = window.Rahmen, F = R_.farben;
  const HG = RB.HANDGRIFFE = {};

  // ---------- Bausteine ----------
  function el(tag, klasse, text) { const e = document.createElement(tag); if (klasse) e.className = klasse; if (text != null) e.textContent = String(RB.trenn(text)).replace(/ – /g, '\u00a0– '); return e; }
  function knopf(text, klasse) { const b = el('button', 'hg-knopf ' + (klasse || ''), text); b.type = 'button'; return b; }
  function geruest(o, mitBild) {
    o.flaeche.textContent = '';
    const kopf = el('div', 'hg-notiz', o.notiz || ''); kopf.hidden = !o.notiz;
    const c = mitBild === false ? null : el('canvas', 'hg-bild');
    const k = el('div', 'hg-knoepfe');
    o.flaeche.append(kopf);
    if (c) o.flaeche.append(c);
    o.flaeche.append(k);
    return { c, k, kopf };
  }
  // Knopf gedrückt halten (Maus, Finger, Leertaste)
  function halten(b, an, aus) {
    let drin = false;
    const los = e => { if (drin) return; drin = true; b.classList.add('gedrueckt'); try { b.setPointerCapture(e.pointerId); } catch (x) { /* egal */ } an(); e.preventDefault(); };
    const ende = () => { if (!drin) return; drin = false; b.classList.remove('gedrueckt'); aus(); };
    b.addEventListener('pointerdown', los);
    b.addEventListener('pointerup', ende); b.addEventListener('pointercancel', ende); b.addEventListener('lostpointercapture', ende);
    b.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { drin = false; los({ pointerId: 0, preventDefault() {} }); } });
    b.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') ende(); });
    b.addEventListener('contextmenu', e => e.preventDefault());
  }
  // Zeichenschleife bis stop()
  function schleife(fn) {
    let lauf = true, alt = performance.now(), t = 0;
    const f = jetzt => {
      if (!lauf) return;
      const dt = Math.min(0.05, (jetzt - alt) / 1000); alt = jetzt; t += dt;
      fn(dt, t);
      requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
    return () => { lauf = false; };
  }
  function zeiger(c, fn) {   // fn(art, x, y) mit art = 'runter' | 'zug' | 'hoch'
    let aktiv = null;
    const p = e => { const r = c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    c.addEventListener('pointerdown', e => { if (aktiv !== null && e.pointerId !== aktiv && !e.isPrimary) return; aktiv = e.pointerId; try { c.setPointerCapture(e.pointerId); } catch (x) { /* egal */ } fn('runter', ...p(e)); e.preventDefault(); });
    c.addEventListener('pointermove', e => { if (e.pointerId === aktiv) fn('zug', ...p(e)); });
    const hoch = e => { if (e.pointerId !== aktiv) return; aktiv = null; fn('hoch', ...p(e)); };
    c.addEventListener('pointerup', hoch); c.addEventListener('pointercancel', hoch);
  }
  // Bauteil (Lupenbild) in ein Rechteck zeichnen; gibt Umrechnung zurück
  function bauteil(g, o, x, y, w, h) {
    const b = o.bauteil;
    if (!b) return null;
    return RB.zelle(g, b.blatt, b.zelle, 3, 2, x, y, w, h, false);
  }
  function mischen(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  // Rückmeldung aus dem Rahmen-Entwurf („Rückmeldungen im Spiel“), zufällige Variante; {platzhalter} aus werte
  RB.rueck = function (k, ersatz, werte) {
    const l = ((window.ROHRBRUCH || {}).rahmen || {}).rueckmeldungen || {}, v = l[k] && l[k].length ? l[k] : [ersatz || ''];
    let t = v[Math.floor(Math.random() * v.length)];
    Object.entries(werte || {}).forEach(([n, w]) => { t = t.split('{' + n + '}').join(w); });
    return t.charAt(0).toUpperCase() + t.slice(1);
  };
  // feste Anweisungen in Befehlsform mit -e (Rahmen-Entwurf „Anweisungen im Code“, Phase 3), sonst Ersatztext
  RB.anw = (k, ersatz) => ((((window.ROHRBRUCH || {}).rahmen || {}).anweisungen || {})[k]) || ersatz;
  // Abschluss-Satz nach Güte (genau / sonst ungenau), optional mit einem Satz davor, der das Ergebnis beschreibt
  // QA Phase 3: Text passt zu den Punkten – genau 60, ungenau 30, erst im zweiten Anlauf 10 (eigener Schlüssel
  // „geschafftAnlauf2“; „anlauf2“ ist die Meldung beim Fehlversuch). Ersatztext, bis der Text Writer ihn liefert.
  const guteText = (g, vorne) => (vorne ? vorne + ' ' : '') + (g === 'genau' ? RB.rueck('genau')
    : g === 'anlauf2' ? RB.rueck('geschafftAnlauf2', 'Im zweiten Anlauf geschafft – beim nächsten Mal klappt es gleich.') : RB.rueck('ungenau'));
  // Ton (klang.js, Phase 4): Effekt bzw. gehaltener Klang; still, wenn klang.js fehlt
  const ton = (n, o) => { try { return RB.klang ? RB.klang.ton(n, o) : null; } catch (e) { return null; } };
  const haltenTon = (n, anfang, o) => { try { return RB.klang ? RB.klang.halten(n, anfang, o) : null; } catch (e) { return null; } };
  // gehaltene Klänge enden mit dem Handgriff (fertig, Schließen der Nahansicht)
  function tonAufraeumen(o, fn) { const alt = o.stop; o.stop = () => { if (alt) alt(); fn(); }; }
  // Klang je Arbeitsschritt (Teil austauschen, Dichtung tauschen): Ventil/Hahn – Schrauben – Teil/Dichtung – Reinigen – sonst Klick
  function schrittKlang(t) {
    t = String(t);
    if (/absperr|öffn|schließ|aufdreh|zudreh|\b(zu|auf)$/i.test(t)) return ['einrasten', { faktor: 0.8 }];
    if (/schraub|festzieh|lösen|mutter/i.test(t)) return ['nachziehen', {}];
    if (/dichtung|einsetz|einleg|einbau|ausbau|steck|einschieb|zieh|abnehm|aufsetz|herausnehm|kappe|\brein\b|\braus\b|\bheraus\b|teil/i.test(t)) return ['einpacken', {}];
    if (/strom|sicherung|schalt|\b(an|aus|ein)$/i.test(t)) return ['licht', { faktor: 0.8 }];
    if (/reinig|wisch|putz|säuber|bürst/i.test(t)) return ['reinigen', {}];
    if (/entlüft/i.test(t)) return ['zischen', {}];
    if (/füll|spül|probelauf/i.test(t)) return ['wasser', { dauer: 1.0 }];   // Probelauf (KU-03): Wasser läuft
    return ['klick', {}];
  }
  // ---------- Geschick je Stufe (MZ freigegeben, Handgriff-Runde 25.10.2026) ----------
  // Azubi leichter, Geselle wie bisher (wo MZ keinen Wert vorgibt), Meister schwerer. Punkte 60/30/10 bleiben, nie scheitern.
  //   nachziehen.zone  markierter Bereich des Kraftbalkens; tempo [bis kurz vor dem Bereich, im Bereich] Balken je Sekunde
  //   druck            markierter Bereich ± bar um den Zielwert (genau = innere Hälfte)
  //   entlueften       Reaktionszeit (s): so lange nach „Wasser kommt“ darf man loslassen, um „genau“ zu bekommen
  //   abfluss          fenster = Anteil des Takts, der als „im Takt“ zählt; takt = Ringe je Sekunde
  //   grob             „zu grob“ beim Gängig machen ab Ausschlag × 40° (spät – mittel – früh)
  //   einstellen       marke = Zielmarke an der Skala; genau = Toleranz in Rasten; ungefaehr = Anteil der Skala (30 Punkte);
  //                    zeit = [genau, ungefähr] Minuten; bereich = Zuschlag je Seite (Anteil der Bereichsbreite) [genau, ungefähr];
  //                    nachbar = Nachbarstufe zählt als „ungenau“
  //   einsetzen        'umriss' (Umriss des Teils in richtiger Lage am Platz) – 'hinweis' (Kerbe + Pfeil) – 'ohne'
  const GESCHICK = RB.GESCHICK = {
    azubi: { nachziehen: { zone: [0.6, 0.92], tempo: [0.26, 0.17] }, druck: 0.3, entlueften: 1.8, abfluss: { fenster: 0.5, takt: 0.7 },
      grob: 1.6, einstellen: { marke: true, genau: 2, ungefaehr: 0.14, zeit: [20, 45], bereich: [0.25, 0.9], nachbar: true }, einsetzen: 'umriss' },
    geselle: { nachziehen: { zone: [0.68, 0.9], tempo: [0.32, 0.2] }, druck: 0.2, entlueften: 1.4, abfluss: { fenster: 0.4, takt: 0.75 },
      grob: 1.25, einstellen: { marke: true, genau: 0.5, ungefaehr: 0.08, zeit: [10, 30], bereich: [0, 0.5], nachbar: false }, einsetzen: 'hinweis' },
    meister: { nachziehen: { zone: [0.74, 0.86], tempo: [0.38, 0.26] }, druck: 0.1, entlueften: 0.9, abfluss: { fenster: 0.3, takt: 0.9 },
      grob: 1.05, einstellen: { marke: false, genau: 0.5, ungefaehr: 0.05, zeit: [5, 20], bereich: [0, 0.25], nachbar: false }, einsetzen: 'ohne' },
  };
  const geschick = o => GESCHICK[o.stufe] || GESCHICK[RB.stufeTest] || GESCHICK.geselle;
  const SCHATTEN = { a: 0.28, blur: 10, y: 4 };

  function einmal(o) {   // fertig nur einmal melden
    let gemeldet = false;
    return g => { if (gemeldet) return; gemeldet = true; o.stop && o.stop(); setTimeout(() => o.fertig(g), RB.ruhig ? 150 : 650); };
  }

  // ---------- Druck auffüllen (auch Ablassen, wenn der Druck zu hoch ist) ----------
  HG['Druck auffüllen'] = function (o) {
    const p = o.param || {}, ziel = RB.zahl(p.ziel != null ? p.ziel : 1.5);
    // markierter Bereich je Stufe: Ziel ± 0,3/0,2/0,1 bar (Geschick, MZ 25.10.2026) – ersetzt den Bereich aus den Daten
    const tolS = geschick(o).druck, ber = [+(ziel - tolS).toFixed(2), +(ziel + tolS).toFixed(2)];
    // Nachtest 25.10.2026 (GPT Player): der markierte Bereich auf dem Manometer = Bereich für „genau“ (60 Punkte); der Rest bis
    // ±Stufen-Toleranz zählt „ungenau“ (30) und ist als blasser äußerer Rand zu sehen – Anzeige und Wertung passen zusammen
    const tolG = Math.max(0.05, (ber[1] - ber[0]) / 4), genauBer = [+(ziel - tolG).toFixed(2), +(ziel + tolG).toFixed(2)];
    let soll = RB.zahl(p.start != null ? p.start : 0.3), wert = soll, richtung = 0, nachlauf = 0, versuch = 0;
    RB.druckTest = () => ({ soll, ziel, ber, genauBer });   // Testhilfe
    const max = ber[1] <= 3 ? 4 : 6, pumpe = /pumpe/i.test(o.werkzeug || '');
    // Ton: Wasser beim Füllen/Ablassen, Luftpumpe zischt, Druckminderer (höher/niedriger stellen) rastet wie eine Ratsche
    const stellenArt = /stellen/.test(String(p.richtung || ''));
    let laut = null, rastZeit = 0;
    const lautAus = () => { if (laut) laut.aus(); laut = null; };
    const lautAn = r => {
      lautAus();
      if (stellenArt) return;
      laut = pumpe ? haltenTon('zischen-schleife', 'zischen', { faktor: 0.8, rate: r > 0 ? 1 : 0.9 })
        : r > 0 ? haltenTon('wasser-schleife', 'wasser') : haltenTon('wasser-schleife', null, { rate: 0.88, faktor: 0.8 });
    };
    const { c, k } = geruest(o);
    const auf = knopf(pumpe ? 'Pumpen' : 'Füllen', 'haupt halten'), ab = knopf('Ablassen', 'halten'), ok = knopf('Fertig', 'fertig');
    if (soll > ziel) { auf.textContent = pumpe ? 'Pumpen' : 'Nachfüllen'; ab.classList.add('haupt'); auf.classList.remove('haupt'); }
    // Druckminderer (HA-01/02): Stellschraube höher bzw. niedriger stellen statt Füllen/Ablassen
    if (/stellen/.test(String(p.richtung || ''))) { auf.textContent = 'Höher stellen'; ab.textContent = 'Niedriger stellen'; }
    k.append(ab, auf, ok);
    // Bedienung als feste Zeile (Spielertest 25.10.2026: Text und Bedienung eindeutig): welchen Knopf halten, dann „Fertig“
    const haupt = auf.classList.contains('haupt') ? auf : ab;
    const bedienung = () => RB.anw('druckBedienung', 'Halte „{knopf}“ gedrückt, bis der Zeiger im markierten Bereich steht – dann tippe auf „Fertig“.').replace('{knopf}', haupt.textContent);
    // Vorarbeit (z. B. „Kollektor abdecken, alte Flüssigkeit ablassen, spülen“): erst bestätigen, dann füllen
    if (p.davor) {
      [ab, auf, ok].forEach(b => { b.hidden = true; });
      const vor = knopf(String(p.davor), 'haupt'); k.prepend(vor);
      vor.addEventListener('click', () => { vor.remove(); [ab, auf, ok].forEach(b => { b.hidden = false; }); R_.ton('klick'); o.meldung(bedienung(), 'anweisung'); o.meldung(''); });
      setTimeout(() => o.meldung('Zuerst: ' + p.davor + '.', 'anweisung'), 0);
    } else setTimeout(() => o.meldung(bedienung(), 'anweisung'), 0);
    const tempo = 0.32;   // bar pro Sekunde
    halten(auf, () => { richtung = 1; lautAn(1); }, () => { richtung = 0; nachlauf = 0.05; lautAus(); });
    halten(ab, () => { richtung = -1; lautAn(-1); }, () => { richtung = 0; nachlauf = -0.05; lautAus(); });
    const fertig = einmal(o);
    ok.addEventListener('click', () => {
      if (soll >= ber[0] - 1e-6 && soll <= ber[1] + 1e-6) {
        const genau = soll >= genauBer[0] - 1e-6 && soll <= genauBer[1] + 1e-6;
        const g = versuch ? 'anlauf2' : genau ? 'genau' : 'ungenau';
        ton('gut');
        o.meldung(guteText(g), 'gut');
        fertig(g);
      } else {
        versuch++; ton('fehler');
        const stellen = /stellen/.test(String(p.richtung || ''));   // Druckminderer: höher/niedriger stellen statt füllen/ablassen
        o.meldung(soll < ber[0] ? (stellen ? 'Noch zu niedrig – stelle höher, bis der Zeiger im markierten Bereich steht.' : 'Noch zu wenig – der Zeiger muss in den markierten Bereich.')
          : (stellen ? 'Zu hoch – stelle niedriger, bis der Zeiger im markierten Bereich steht.' : 'Zu viel – lasse etwas ab, bis der Zeiger im markierten Bereich steht.'), 'falsch');
      }
    });
    o.stop = schleife(dt => {
      if (richtung && stellenArt) { rastZeit -= dt; if (rastZeit <= 0) { ton('nachziehen', { faktor: 0.7, rate: richtung > 0 ? 1.05 : 0.95 }); rastZeit = 0.55; } } else rastZeit = 0;
      if (richtung) soll = Math.max(0, Math.min(max * 0.98, soll + richtung * tempo * dt));
      else if (nachlauf) { const s = Math.sign(nachlauf) * Math.min(Math.abs(nachlauf), dt * 0.25); soll = Math.max(0, soll + s); nachlauf -= s; if (Math.abs(nachlauf) < 1e-4) nachlauf = 0; }
      wert += (soll - wert) * Math.min(1, dt * 7);
      const { g, w, h } = RB.leinwand(c);
      g.clearRect(0, 0, w, h);
      const r = Math.min(w, h * 0.92) * 0.42;
      RB.manometer(g, w / 2, h * 0.47, r, { wert, max, einheit: 'bar', bereich: genauBer, bereichAussen: ber, ziel, flaeche: true });
      RB.schild(g, w / 2, h * 0.47 + r * 0.72, RB.komma(soll, 1) + ' bar', Math.max(11, r * 0.15));
    });
    tonAufraeumen(o, lautAus);
  };

  // ---------- Reinigen ----------
  // Handgriff-Runde (MZ, 25.10.2026): verschmutzte Fassung des Bauteils liegt deckungsgleich über dem sauberen Bild
  // (rohrbruch-schmutz-n.png, Zuordnung schmutz.js → RB.SCHMUTZ); Wischen radiert den Schmutz mit weicher Pinselkante frei.
  // Fehlt die Schmutz-Fassung: Textur aus rohrbruch-texturen.png passend zum Belag, nur auf dem Bauteil (Alpha des Lupenbilds).
  // Eine echte Bürste (bzw. das passende Reinigungswerkzeug) folgt dem Finger. Fortschritt und Punkte wie bisher.
  RB.SCHMUTZ = window.ROHRBRUCH_SCHMUTZ || {};
  const belagTextur = b => /kalk|salz/i.test(b) ? 'kalk' : /rost/i.test(b) ? 'rost' : /staub|flusen|laub|flaum/i.test(b) ? 'staub' : 'schlamm';
  // Nachtest 25.10.2026 (GPT Player): die Anweisung passt zum Werkzeug, das am Finger hängt (vorher immer „wisch …“, auch beim
  // Sauger). Ersatztexte im Code; Schlüssel für den Text Writer: reinigenSauger, reinigenHolzstab, reinigenTuch, reinigenMittel, reinigenBuerste
  function reinigenText(werkzeug) {
    const w = String(werkzeug || '');
    if (/sauger/i.test(w)) return RB.anw('reinigenSauger', 'Fahre mit dem Sauger über den Staub, bis alles sauber ist.');
    if (/holzstab/i.test(w)) return RB.anw('reinigenHolzstab', 'Fahre mit dem Holzstab über die Kruste, bis alles frei ist.');
    if (/lappen|schwamm/i.test(w)) return RB.anw('reinigenTuch', 'Wisch mit dem {werkzeug} über den Schmutz, bis alles sauber ist.').replace('{werkzeug}', /schwamm/i.test(w) ? 'Schwamm' : 'Lappen');
    if (/entkalker|reinigungsmittel/i.test(w)) return RB.anw('reinigenMittel', 'Reibe den Belag mit dem Finger ab, bis alles sauber ist.');
    return RB.anw('reinigenBuerste', 'Bürste den Schmutz weg – fahre dazu mit dem Finger darüber, bis alles sauber ist.');
  }
  HG['Reinigen'] = function (o) {
    const reinigenAnw = () => reinigenText(o.werkzeug);
    const p = o.param || {};
    const { c, k } = geruest(o);
    const belag = String(p.belag || '');
    const tex = belagTextur(belag);
    const N = 200, schmutz = document.createElement('canvas'); schmutz.width = schmutz.height = N;
    const sg = schmutz.getContext('2d', { willReadFrequently: true });
    let anfang = 0, bereit = false;
    function deckung() { const d = sg.getImageData(0, 0, N, N).data; let s = 0; for (let i = 3; i < d.length; i += 16) s += d[i]; return s; }
    // Schmutzschicht einmal aufbauen, sobald Bauteil und Bild geladen sind (u = Rückgabe von RB.zelle)
    // Offline (QA Release 5): liegt ein Bild nicht im Zwischenspeicher, schlägt es fehl (complete, aber ohne Breite) – dann die
    // nächste Fassung nehmen statt ewig zu warten (sonst ließ sich nicht wischen und der Einsatz hing fest)
    const kaputt = adr => { const i = RB.bild(adr); return i.complete && !i.naturalWidth; };
    const ERSATZ_BELAG = { kalk: '#d9d3c1', rost: '#8a4b25', staub: '#9b958b', schlamm: '#5b4a32' };
    function aufbauen(u) {
      const sm = u && RB.SCHMUTZ && RB.SCHMUTZ[u.blatt + '|' + u.nr];
      sg.clearRect(0, 0, N, N);
      if (sm && !kaputt(sm[0])) {   // gestaltete Schmutz-Fassung, deckungsgleich
        const i = RB.bild(sm[0]);
        if (!RB.geladen(i)) return false;
        RB.zelle(sg, sm[0], sm[1], sm[2] || 3, sm[3] || 2, 0, 0, N, N, false);
      } else {
        const m = RB.motiv('texturen', tex), tb = ((window.RB_SPRITES || {}).texturen || {}).bild;
        if (!m && !(tb && kaputt(tb))) return false;   // Textur lädt noch
        if (u && !RB.geladen(RB.bild(u.blatt))) return false;
        // Textur zweimal leicht versetzt/gedreht: deckt das ganze Bauteil, ohne als Kachel aufzufallen; ohne Textur (offline,
        // Blatt fehlt) eine schlichte Fläche in der Farbe des Belags
        if (m) [[0.5, 0.5, 1.25, 0.3], [0.38, 0.62, 0.9, -0.9]].forEach(([x, y, f, d]) => {
          sg.save(); sg.translate(N * x, N * y); sg.rotate(d); sg.drawImage(m.i, m.r[0], m.r[1], m.r[2], m.r[3], -N * f / 2, -N * f / 2, N * f, N * f); sg.restore();
        });
        else { sg.globalAlpha = 0.8; sg.fillStyle = ERSATZ_BELAG[tex] || ERSATZ_BELAG.schlamm; sg.fillRect(0, 0, N, N); sg.globalAlpha = 1; }
        sg.globalCompositeOperation = 'destination-in';
        if (u) RB.zelle(sg, u.blatt, u.nr, u.spalten, u.zeilen, 0, 0, N, N, false);   // nur auf dem Bauteil
        else { const v = sg.createRadialGradient(N / 2, N / 2, N * 0.2, N / 2, N / 2, N * 0.5); v.addColorStop(0, '#000'); v.addColorStop(1, 'rgba(0,0,0,0)'); sg.fillStyle = v; sg.fillRect(0, 0, N, N); }
        sg.globalCompositeOperation = 'source-over';
      }
      anfang = deckung();
      return anfang > 0;
    }
    let sauber = 0, schritt = p.davor ? 'davor' : 'putzen', pos = null, frueh = false;
    const ok = knopf('Fertig', 'fertig'); ok.hidden = true;
    const vorher = p.davor ? knopf(String(p.davor), 'haupt') : null, nachher = p.danach ? knopf(String(p.danach), 'haupt') : null;
    if (vorher) { k.append(vorher); vorher.addEventListener('click', () => { schritt = 'putzen'; vorher.remove(); o.meldung(reinigenAnw(), 'anweisung'); o.meldung(''); }); o.meldung('Zuerst: ' + p.davor + '.', 'anweisung'); }
    k.append(ok);
    const fertig = einmal(o);
    // Spielertest 25.10.2026: nach „Fertig“ bzw. beim Erreichen des Ziels blendet der Restschmutz weich ganz aus (0,6s) – das
    // Bild ist sauber, wenn „Sauber“ dasteht. Erst danach meldet der Handgriff fertig (einmal() hält die Zeichenschleife an).
    const AUSBLENDEN = 0.6, SAUBER = 0.85;   // ab SAUBER gilt das Bauteil als sauber (genau)
    let ausblenden = null, nachAusblenden = null;   // ausblenden = { ab: Startzeit (setzt die Zeichenschleife), fertig }
    const danachMelden = f => { nachAusblenden = f; if (ausblenden && ausblenden.fertig) f(); };
    function geputzt(ungenau) {
      schritt = 'danach'; ok.hidden = true; pos = null;
      ausblenden = { ab: null, fertig: false };
      o.meldung('', 'anweisung');   // Wisch-Anweisung erledigt; was jetzt kommt, steht in der Rückmeldung
      ton('gut');
      const g = ungenau ? 'ungenau' : 'genau';
      if (nachher) { k.append(nachher); o.meldung('Sauber. Und jetzt: ' + p.danach + '.', 'gut'); nachher.addEventListener('click', () => { nachher.disabled = true; o.meldung(guteText(g), 'gut'); danachMelden(() => fertig(g)); }); }
      else { o.meldung(guteText(g), 'gut'); danachMelden(() => fertig(g)); }
    }
    ok.addEventListener('click', () => { frueh = true; geputzt(true); });
    // Werkzeug am Finger: Reinigungswerkzeug mit eigenem Bild (Handstaubsauger, Entkalker …), sonst die gestaltete Bürste
    const eigenes = /staubsauger|entkalker|reinigungsmittel|holzstab|schwamm|lappen/i.test(o.werkzeug || '') ? RB.werkzeugZelle(o.werkzeug) : null;
    let rahmenBild = null, letzteMessung = 0, wischZeit = 0, zug = 0;
    RB.reinigenTest = () => ({ sauber, bereit, rahmenBild, schritt, tex, schmutzBild: !!(rahmenBild && RB.SCHMUTZ && rahmenBild.u && RB.SCHMUTZ[rahmenBild.u.blatt + '|' + rahmenBild.u.nr]) });   // Testhilfe
    zeiger(c, (art, x, y) => {
      if (art === 'hoch') { pos = null; return; }
      if (schritt !== 'putzen' || !rahmenBild || !bereit) { if (schritt === 'davor') o.meldung('Zuerst: ' + p.davor + '.', 'falsch'); return; }
      const nx = (x - rahmenBild.x) / rahmenBild.w * N, ny = (y - rahmenBild.y) / rahmenBild.h * N;
      const jetztMs = performance.now();
      if (jetztMs - wischZeit > 620) { wischZeit = jetztMs; ton('reinigen'); }   // Wisch-Geräusch, höchstens alle 0,6s
      sg.globalCompositeOperation = 'destination-out';
      const r = N * 0.085;
      // weiche Pinselkante: Mitte trägt viel ab, Rand wenig
      const strich = (ax, ay) => { const v = sg.createRadialGradient(ax, ay, 0, ax, ay, r); v.addColorStop(0, 'rgba(0,0,0,.5)'); v.addColorStop(0.6, 'rgba(0,0,0,.22)'); v.addColorStop(1, 'rgba(0,0,0,0)'); sg.fillStyle = v; sg.beginPath(); sg.arc(ax, ay, r, 0, Math.PI * 2); sg.fill(); };
      if (pos) { const st = Math.ceil(Math.hypot(nx - pos[0], ny - pos[1]) / 2.5); for (let i = 1; i <= st; i++) strich(pos[0] + (nx - pos[0]) * i / st, pos[1] + (ny - pos[1]) * i / st); zug = Math.atan2(y - pos[3], x - pos[2]); }
      else strich(nx, ny);
      sg.globalCompositeOperation = 'source-over';
      pos = [nx, ny, x, y];
    });
    o.stop = schleife((dt, t) => {
      const { g, w, h } = RB.leinwand(c);
      g.clearRect(0, 0, w, h);
      const s = Math.min(w, h - 16) * 0.98, bx = (w - s) / 2, by = (h - 16 - s) / 2;
      const u = bauteil(g, o, bx, by, s, s);
      rahmenBild = u ? { x: u.x, y: u.y, w: u.w, h: u.h, u } : { x: bx, y: by, w: s, h: s };
      if (!u) { g.fillStyle = '#ddd'; g.fillRect(bx, by, s, s); }
      if (!bereit) bereit = aufbauen(u);
      let deck = 1;   // Deckkraft des Restschmutzes (blendet nach „Sauber“ aus)
      if (ausblenden) {
        if (ausblenden.ab == null) ausblenden.ab = t;
        deck = RB.ruhig ? 0 : Math.max(0, 1 - (t - ausblenden.ab) / AUSBLENDEN);
        deck = deck * deck * (3 - 2 * deck);   // weich
        if (deck <= 0 && !ausblenden.fertig) { ausblenden.fertig = true; sg.clearRect(0, 0, N, N); if (nachAusblenden) nachAusblenden(); }
      }
      if (bereit && deck > 0) { g.imageSmoothingEnabled = true; g.globalAlpha = deck; g.drawImage(schmutz, rahmenBild.x, rahmenBild.y, rahmenBild.w, rahmenBild.h); g.globalAlpha = 1; }
      if (pos && schritt === 'putzen') {   // Bürste am Finger: Borsten unten am Finger, wackelt beim Wischen
        const wack = Math.sin(t * 22) * 0.12, gr = s * 0.36;
        if (eigenes && RB.geladen(RB.bild(eigenes.b.blatt))) {
          g.save(); g.translate(pos[2], pos[3]); g.rotate(-0.35 + wack); g.shadowColor = 'rgba(0,0,0,.3)'; g.shadowBlur = 8; g.shadowOffsetY = 3;
          RB.zelle(g, eigenes.b.blatt, eigenes.nr, eigenes.b.spalten, eigenes.b.zeilen, -gr * 0.3, -gr * 0.85, gr, gr, false); g.restore();
        } else if (!RB.motivZeichnen(g, 'bedienteile-2', 'buerste', pos[2], pos[3], gr, null, { ax: 0.3, ay: 0.82, drehung: -0.25 + wack, schatten: SCHATTEN })) {
          g.save(); g.translate(pos[2], pos[3]); g.rotate(wack);
          g.fillStyle = '#c9a36a'; g.fillRect(-s * 0.05, -s * 0.02, s * 0.1, s * 0.04);
          g.fillStyle = '#7a5a2c'; g.fillRect(-s * 0.012, -s * 0.12, s * 0.024, s * 0.1);
          g.restore();
        }
      }
      if (bereit && t - letzteMessung > 0.15 && schritt === 'putzen') {
        letzteMessung = t;
        sauber = 1 - deckung() / Math.max(1, anfang);
        if (sauber > 0.55 && !frueh) ok.hidden = false;
        // QA Spielertest-Runde (S3): bei ca. 85 % sieht das Bauteil sauber aus (BA-01) – dann gleich fertig („genau“), der feine
        // Rest blendet weich aus; vorher blieb die Wisch-Anweisung bis 93 % stehen
        if (sauber >= SAUBER) geputzt(false);
      }
      if (schritt === 'putzen') {   // Fortschritt
        g.fillStyle = 'rgba(0,0,0,.18)'; RB.rund(g, w * 0.2, h - 12, w * 0.6, 7, 3.5); g.fill();
        g.fillStyle = F.haupt; RB.rund(g, w * 0.2, h - 12, w * 0.6 * Math.min(1, sauber / SAUBER), 7, 3.5); g.fill();
      }
    });
    if (!vorher) o.meldung(reinigenAnw(), 'anweisung');
  };

  // ---------- Gängig machen ----------
  HG['Gängig machen'] = function (o) {
    const p = o.param || {}, noetig = Math.max(2, (+p.versuche || 3) * 2);
    const { c, k } = geruest(o);
    let winkel = 0, start = null, schwung = 0, seite = 0, grob = 0, zuGrob = false, frei = false, dreh = 0;
    const fertig = einmal(o);
    RB.gaengigTest = () => ({ winkel, schwung, noetig, grob, GROB });   // Testhilfe
    // SCHWELLE: ab diesem Ausschlag zählt ein Schwung (vorher 18° ≈ 34 px, QA 24.10.2026: zu kleine Bewegungen still ignoriert).
    // Bleibt eine Bewegung darunter, kommt der Hinweis „etwas weiter wackeln“ (ab KLEIN, damit Zittern nichts auslöst).
    const MAX = 40, SCHWELLE = 10, KLEIN = 3, GROB = geschick(o).grob;   // „zu grob“ ab GROB × MAX (Stufe: spät/mittel/früh)
    let halb = { s: 0, spitze: 0, gezaehlt: false }, hinweisZeit = 0;
    function halbPruefen() {   // eine Halbbewegung (eine Seite) ist zu Ende: war sie zu klein?
      if (halb.s && !halb.gezaehlt && !zuGrob && halb.spitze >= KLEIN && halb.spitze < SCHWELLE && performance.now() - hinweisZeit > 1200) {
        hinweisZeit = performance.now();
        o.meldung(RB.rueck('wackelnKlein', 'Wackle etwas weiter – ein kleines Stück mehr nach links und rechts.'), 'info');
      }
    }
    zeiger(c, (art, x) => {
      if (frei) return;
      if (art === 'runter') { start = x - winkel / MAX * c.clientWidth * 0.22; halb = { s: Math.sign(winkel), spitze: Math.abs(winkel), gezaehlt: true }; return; }
      if (art === 'hoch') { halbPruefen(); halb = { s: 0, spitze: 0, gezaehlt: false }; start = null; winkel *= 0.3; zuGrob = false; return; }
      if (start == null) return;
      let a = (x - start) / (c.clientWidth * 0.22) * MAX;
      if (Math.abs(a) > MAX * GROB) {
        if (!zuGrob) { zuGrob = true; grob++; ton('fehler', { faktor: 0.7 }); o.meldung('Vorsichtig – nur kleine Bewegungen hin und her.', 'falsch'); R_.vibrieren(40); }
        a = Math.sign(a) * MAX * GROB;
      } else if (Math.abs(a) < MAX) zuGrob = false;
      winkel = a;
      const sa = Math.sign(a);
      if (sa && sa !== halb.s) { halbPruefen(); halb = { s: sa, spitze: Math.abs(a), gezaehlt: false }; }
      else halb.spitze = Math.max(halb.spitze, Math.abs(a));
      const s = a > SCHWELLE ? 1 : a < -SCHWELLE ? -1 : 0;
      if (s) halb.gezaehlt = true;   // weit genug (auch wenn dieselbe Seite nicht nochmal zählt)
      if (s && s !== seite) {
        seite = s; schwung++; ton('einrasten', { faktor: 0.45, rate: 1.2 + schwung * 0.02 });
        if (schwung >= noetig) { frei = true; ton('gut'); o.meldung(guteText(grob === 0 ? 'genau' : 'ungenau', 'Sie dreht wieder frei.'), 'gut'); fertig(grob === 0 ? 'genau' : 'ungenau'); }
      }
    });
    o.meldung('Wackle mit dem Finger kurz nach links und rechts – nicht zu weit.', 'anweisung');
    o.stop = schleife(dt => {
      if (frei) dreh += dt * 9;
      const { g, w, h } = RB.leinwand(c);
      g.clearRect(0, 0, w, h);
      const s = Math.min(w, h), bx = (w - s) / 2, by = (h - s) / 2;
      const u = bauteil(g, o, bx, by, s, s * 0.92);
      const m = u && o.bauteil.masse && o.bauteil.masse.mitte ? u.p(...o.bauteil.masse.mitte) : [w / 2, h * 0.45];
      const r = s * 0.11;
      g.save(); g.translate(m[0], m[1]); g.rotate((frei ? dreh : winkel * Math.PI / 180));
      g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fillStyle = '#b9bec3'; g.fill(); g.lineWidth = 2; g.strokeStyle = '#555'; g.stroke();
      g.fillStyle = '#333'; g.fillRect(-r * 0.8, -r * 0.14, r * 1.6, r * 0.28);
      g.restore();
      // erlaubter Bereich als Bogen – mit hellem Rand und Schatten, damit er auch auf dem dunklen Pumpengehäuse
      // deutlich zu sehen ist (MZ, 24.10.2026)
      const bg = MAX * GROB * Math.PI / 180, von = -Math.PI / 2 - bg, bis = -Math.PI / 2 + bg, rb = r * 1.7;
      g.save(); g.lineCap = 'round';
      g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 6;
      g.lineWidth = 11; g.strokeStyle = 'rgba(255,255,255,.92)'; g.beginPath(); g.arc(m[0], m[1], rb, von, bis); g.stroke();
      g.shadowBlur = 0;
      g.lineWidth = 6; g.strokeStyle = 'rgba(40,46,54,.45)'; g.beginPath(); g.arc(m[0], m[1], rb, von, bis); g.stroke();
      g.lineWidth = 7; g.strokeStyle = zuGrob ? '#d9483b' : F.haupt;
      g.beginPath(); g.arc(m[0], m[1], rb, -Math.PI / 2 + Math.min(0, winkel) * Math.PI / 180, -Math.PI / 2 + Math.max(0, winkel) * Math.PI / 180); g.stroke();
      // Striche: so weit muss ein Schwung mindestens gehen (dicker dunkler Rand, weißer Kern – auf hell und dunkel sichtbar)
      [[7, 'rgba(0,0,0,.75)'], [3.5, '#fff']].forEach(([lw, farbe]) => {
        g.lineWidth = lw; g.strokeStyle = farbe;
        [-1, 1].forEach(v => { const a = -Math.PI / 2 + v * SCHWELLE * Math.PI / 180; g.beginPath(); g.moveTo(m[0] + Math.cos(a) * r * 1.38, m[1] + Math.sin(a) * r * 1.38); g.lineTo(m[0] + Math.cos(a) * r * 2.05, m[1] + Math.sin(a) * r * 2.05); g.stroke(); });
      });
      g.restore();
      // Fortschritt: Punkte
      for (let i = 0; i < noetig; i++) {
        g.beginPath(); g.arc(w / 2 + (i - (noetig - 1) / 2) * 16, h - 10, 5, 0, Math.PI * 2);
        g.fillStyle = i < schwung ? F.haupt : 'rgba(0,0,0,.2)'; g.fill();
      }
    });
  };

  // ---------- Einstellen (Stellrad, Stufenschalter, Drehknopf) ----------
  HG['Einstellen'] = function (o) {
    const p = o.param || {}, zielText = String(p.ziel != null ? p.ziel : '');
    const zeit = /^\d{1,2}:\d{2}$/.test(zielText);
    const minuten = t => { const [a, b] = String(t).split(':').map(Number); return a * 60 + b; };
    let stufen = null, woerter = false;
    // Zahl mit Einheit („6 °dH“, „2,5 l/min“, 50 + einheit=°C) oder Wort-Stellung („auf“, „Betrieb“, „ganz offen“)
    const zahlZiel = /^[+−-]?\d+(,\d+)?(\s*\S.*)?$/.test(zielText) ? RB.zahl(zielText) : NaN;
    const einheit = p.einheit || (zielText.match(/^[+−-]?\d+(?:,\d+)?\s*(\S.*)$/) || [])[1] || '';
    if (!zeit && p.stufen) {
      const s = String(p.stufen);
      if (/[–-]/.test(s) && !/;/.test(s)) { const [a, b] = RB.bereich(s); stufen = []; for (let i = a; i <= b; i++) stufen.push(String(i)); }
      else stufen = s.split(/[;,]/).map(x => x.trim()).filter(Boolean);
    } else if (!zeit && einheit === 'Stufe') {   // Thermostatkopf: Stufen 1 bis 5
      stufen = []; for (let i = 1; i <= Math.max(5, RB.zahl(p.start) || 0, zahlZiel || 0); i++) stufen.push(String(i));
    } else if (!zeit && isNaN(zahlZiel)) {
      // Wort-Stellungen: Start → (Zwischenschritt aus „…, dann …“) → Ziel; Schild unter dem Schalter zeigt die Stellung
      woerter = true;
      const teil = zielText.split(/,\s*dann\s*/i);
      stufen = [...new Set([String(p.start != null ? p.start : 'zu')].concat(teil.length > 1 ? [teil[0]] : [], [zielText]))];
    }
    const bereich = !stufen && !zeit && p.bereich ? RB.bereich(p.bereich) : null;
    const ziel = zeit ? minuten(zielText) : stufen ? Math.max(0, stufen.indexOf(zielText)) : (isNaN(zahlZiel) ? 5 : zahlZiel);
    const startZahl = RB.zahl(p.start || 0) || 0;
    const max = zeit ? 1440 : stufen ? stufen.length - 1 : Math.max(10, Math.ceil(Math.max(ziel, startZahl, bereich ? bereich[1] : 0) * 1.35));
    // Rastung: kleine Werte feiner (2,5 l/min), große gröber (°C)
    const raste = max <= 6 ? 0.1 : max <= 30 ? 0.5 : 1;
    let wert = zeit ? minuten(p.start || '0:00') : stufen ? Math.max(0, stufen.indexOf(String(p.start != null ? p.start : stufen[0]))) : startZahl;
    let versuch = 0, griff = null, tickZeit = 0;
    const { c, k } = geruest(o);
    const ok = knopf('Fertig', 'fertig'); k.append(ok);
    const fertig = einmal(o);
    const bogen = stufen ? 120 : 360;  // Stufenschalter: 120° von links nach rechts
    function wertZuWinkel(v) { return stufen ? (-bogen / 2 + (stufen.length > 1 ? v / max * bogen : 0)) : v / max * 360; }
    let m = [0, 0];
    zeiger(c, (art, x, y) => {
      if (art === 'hoch') { griff = null; return; }
      const a = Math.atan2(y - m[1], x - m[0]) * 180 / Math.PI + 90;   // 0° = oben
      if (art === 'runter') { griff = { a, wert }; return; }
      if (!griff) return;
      let d = a - griff.a; if (d > 180) d -= 360; if (d < -180) d += 360;
      griff.a = a;
      if (stufen) {
        griff.wert = Math.max(-0.4, Math.min(max + 0.4, griff.wert + d / bogen * max));
        const neu = Math.max(0, Math.min(max, Math.round(griff.wert)));
        if (neu !== wert) { wert = neu; ton('einrasten', { faktor: 0.55 }); }   // Stufenschalter rastet
      } else {
        griff.wert = griff.wert + d / 360 * max;
        const vorher = wert;
        wert = zeit ? ((Math.round(griff.wert / 5) * 5) % 1440 + 1440) % 1440 : Math.max(0, Math.min(max, +(Math.round(griff.wert / raste) * raste).toFixed(2)));
        // feines Ticken je Raste (höchstens alle 45 ms)
        if (wert !== vorher && performance.now() - tickZeit > 45) { tickZeit = performance.now(); ton('klick', { faktor: 0.35, rate: 1.4 }); }
      }
    });
    const G = geschick(o).einstellen;
    ok.addEventListener('click', () => {
      let d = Math.abs(wert - ziel);
      if (zeit) d = Math.min(d, 1440 - d);
      // Toleranz je Stufe (GESCHICK.einstellen): mit Bereich (z. B. 45–55 °C) zählt der Bereich (+ Zuschlag), sonst Rasten
      const breite = bereich ? bereich[1] - bereich[0] : 0;
      const imBereich = z => wert >= bereich[0] - breite * z - 1e-6 && wert <= bereich[1] + breite * z + 1e-6;
      const genau = zeit ? d <= G.zeit[0] : bereich ? imBereich(G.bereich[0]) : stufen ? d === 0 : d <= raste * G.genau + 1e-6;
      const ungefaehr = zeit ? d <= G.zeit[1] : stufen ? (G.nachbar && !woerter && d <= 1) : bereich ? imBereich(G.bereich[1]) : d <= max * G.ungefaehr;
      if (genau || ungefaehr) {
        const g = versuch ? 'anlauf2' : genau ? 'genau' : 'ungenau';
        ton('gut');
        o.meldung(guteText(g), 'gut');
        fertig(g);
      } else { versuch++; ton('fehler'); o.meldung(zeit ? 'Die Zeit stimmt noch nicht – drehe weiter.' : RB.rueck('anlauf2', 'Noch nicht die richtige Stellung.'), 'falsch'); }
    });
    if (o.param && o.param.von_hand === 'ja') o.werkzeug = '';   // DB-09: von Hand, ohne Werkzeug am Griff
    o.meldung(zeit ? RB.anw('einstellenUhr', 'Drehe das Stellrad mit dem Finger im Kreis.') : stufen && !woerter ? RB.anw('einstellenStufen', 'Drehe den Schalter auf die richtige Stufe.') : RB.anw('einstellen', 'Drehe den Knopf auf die richtige Markierung.'), 'anweisung');
    // Gestaltete Bedienteile (Handgriff-Runde, MZ 25.10.2026): Zahl = Drehknopf im Skalenring (Zahlen schreibt der Code),
    // Stufen = Thermostatkopf, Wort-Stellung = Drehknopf, Uhrzeit = Zeitschaltuhr (Scheibe dreht, Gehäuse mit Zeiger fest).
    // Zielmarke in Hausfarbe nur Azubi/Geselle (GESCHICK.einstellen.marke).
    const art = zeit ? 'uhr' : stufen ? (woerter ? 'wort' : 'stufen') : 'zahl';
    RB.einstellTest = () => ({ art, wert, ziel, max, m, marke: G.marke, stufen });   // Testhilfe
    const BL = 'bedienteile-1';
    o.stop = schleife(() => {
      const { g, w, h } = RB.leinwand(c);
      g.clearRect(0, 0, w, h);
      const fs = 14, unten = fs * 1.6 + 10, h2 = h - unten - 6;
      const rad = v => (wertZuWinkel(v) - 90) * Math.PI / 180;
      const zm = fh => { g.font = `700 ${fh}px Barlow, system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; };
      let schildY;
      g.save();
      if (art === 'uhr') {
        const gd = RB.motivDaten(BL, 'uhrGehaeuse'), loch = RB.motivLoch(BL, 'uhrGehaeuse');
        const asp = gd ? gd[3] / gd[2] : 1.41;
        const gh = Math.min(h2 * 0.98, w * 0.72 * asp), gw = gh / asp, gx = w / 2 - gw / 2, gy = Math.max(3, (h2 - gh) / 2);
        const k = gw / (gd ? gd[2] : 258);
        const lx = gd && loch ? gx + (loch[0] - gd[0]) * k : w / 2, ly = gd && loch ? gy + (loch[1] - gd[1]) * k : gy + gh * 0.4;
        const lr = (loch ? loch[2] : 96) * k;
        m = [lx, ly];
        const sr = lr / 0.8;   // Scheibe: Schaltreiter liegen am Fensterrand
        const dreh = -wertZuWinkel(wert) * Math.PI / 180;
        if (RB.motivZeichnen(g, BL, 'uhrScheibe', lx, ly, sr * 2, sr * 2, { drehung: dreh })) {
          // Stundenzahlen drehen mit der Scheibe
          // QA (S3): Zahlen waren ca. 7 px – jetzt nur 0, 6, 12, 18 und größer (mindestens 12 px)
          g.fillStyle = '#222'; zm(Math.max(12, lr * 0.28));
          [0, 6, 12, 18].forEach(x => { const a = rad(x * 60) + dreh; g.fillText(String(x), lx + Math.cos(a) * lr * 0.52, ly + Math.sin(a) * lr * 0.52); });
          if (G.marke) {   // Zielmarke: Reiter in Hausfarbe an der Zielzeit
            const a = rad(ziel) + dreh;
            g.fillStyle = F.haupt; g.strokeStyle = '#fff'; g.lineWidth = 1.5;
            g.beginPath(); g.arc(lx + Math.cos(a) * lr * 0.78, ly + Math.sin(a) * lr * 0.78, Math.max(4, lr * 0.07), 0, Math.PI * 2); g.fill(); g.stroke();
          }
          RB.motivZeichnen(g, BL, 'uhrGehaeuse', gx + gw / 2, gy + gh / 2, gw, gh, { schatten: SCHATTEN });
        } else {   // Ersatz, bis das Bild geladen ist
          g.beginPath(); g.arc(lx, ly, lr, 0, Math.PI * 2); g.fillStyle = '#f4f4f1'; g.fill(); g.strokeStyle = '#999'; g.stroke();
        }
        schildY = gy + gh + 6 + fs * 0.8;
        const hh = Math.floor(wert / 60), mm = wert % 60;
        RB.schild(g, w / 2, Math.min(h - fs, schildY), `${hh}:${String(mm).padStart(2, '0')} Uhr`, fs);
      } else if (art === 'zahl') {
        const R = Math.max(24, Math.min(w * 0.36, h2 / 2.6)), y0 = 3 + R * 1.3 + Math.max(0, (h2 - R * 2.6) / 2);
        m = [w / 2, y0];
        const rd = RB.motivDaten(BL, 'skalenring'), loch = RB.motivLoch(BL, 'skalenring');
        const lochR = loch && rd ? R * loch[2] / (rd[2] / 2) : R * 0.7;
        if (!RB.motivZeichnen(g, BL, 'skalenring', m[0], m[1], R * 2, R * 2, { schatten: SCHATTEN })) { g.beginPath(); g.arc(m[0], m[1], R, 0, Math.PI * 2); g.fillStyle = '#f4f4f1'; g.fill(); }
        // Zielbereich bzw. Zielmarke am Ring (Hausfarbe)
        if (G.marke) {
          g.lineCap = 'butt';
          if (bereich) { g.lineWidth = R * 0.08; g.strokeStyle = R_.mitAlpha(F.haupt, 0.7); g.beginPath(); g.arc(m[0], m[1], R * 1.04, rad(bereich[0]), rad(Math.max(bereich[1], bereich[0] + max * 0.004))); g.stroke(); }
          const a = rad(ziel);
          g.fillStyle = F.haupt; g.strokeStyle = '#fff'; g.lineWidth = 1.5;
          g.beginPath(); g.moveTo(m[0] + Math.cos(a) * R * 0.99, m[1] + Math.sin(a) * R * 0.99);
          g.lineTo(m[0] + Math.cos(a + 0.09) * R * 1.13, m[1] + Math.sin(a + 0.09) * R * 1.13);
          g.lineTo(m[0] + Math.cos(a - 0.09) * R * 1.13, m[1] + Math.sin(a - 0.09) * R * 1.13); g.closePath(); g.fill(); g.stroke();
        }
        g.fillStyle = '#333'; zm(Math.max(10, R * 0.13));
        [0, max / 4, max / 2, max * 3 / 4].forEach(v => { const a = rad(v); g.fillText(RB.komma(v, Number.isInteger(v) ? 0 : 1), m[0] + Math.cos(a) * R * 1.2, m[1] + Math.sin(a) * R * 1.2); });
        if (!RB.motivZeichnen(g, BL, 'drehknopf', m[0], m[1], lochR * 1.94, lochR * 1.94, { drehung: wertZuWinkel(wert) * Math.PI / 180, schatten: SCHATTEN })) {
          g.beginPath(); g.arc(m[0], m[1], lochR, 0, Math.PI * 2); g.fillStyle = '#e6e8ea'; g.fill();
          const a = rad(wert); g.lineWidth = 4; g.strokeStyle = '#333'; g.beginPath(); g.moveTo(m[0], m[1]); g.lineTo(m[0] + Math.cos(a) * lochR * 0.8, m[1] + Math.sin(a) * lochR * 0.8); g.stroke();
        }
        schildY = m[1] + R * 1.3 + 6 + fs * 0.8;
        RB.schild(g, m[0], Math.min(h - fs, schildY), RB.komma(wert, raste < 1 && !Number.isInteger(wert) ? 1 : 0) + (einheit ? ' ' + einheit : ''), fs);
      } else {
        // Stufen (Thermostatkopf) bzw. Wort-Stellung (Drehknopf): Beschriftung auf einem Bogen von 120° oben
        // Wort-Stellung (QA S3: Skala wirkte leer): kleinerer Knopf, die Wörter stehen lesbar an ihren Stellungen (Anschläge),
        // Zielmarke nur Azubi/Geselle; Meister liest dieselben Wörter, aber ohne Hervorhebung
        const R = woerter ? Math.max(22, Math.min(w * 0.24, h2 / 2.5)) : Math.max(22, Math.min(w * 0.34, h2 / 2.4));
        const y0 = 3 + R * (woerter ? 1.5 : 1.38) + Math.max(0, (h2 - R * (woerter ? 2.5 : 2.4)) / 2);
        m = [w / 2, y0];
        const fh = Math.max(10, Math.min(15, R * 0.17));
        if (woerter) {
          const fw = Math.max(11, Math.min(13, w * 0.034)), breit = Math.max(60, w / 2 - R * 1.15 - 6);
          const umbrechen = (t, maxW) => { const zl = []; let z = ''; String(t).split(' ').forEach(wd => { const v = z ? z + ' ' + wd : wd; g.font = `600 ${fw}px Barlow, system-ui, sans-serif`; if (g.measureText(v).width > maxW && z) { zl.push(z); z = wd; } else z = v; }); if (z) zl.push(z); return zl.slice(0, 3); };
          // Skala: Bogen mit Strichen an jeder Stellung
          g.lineWidth = 2; g.strokeStyle = '#9aa1a8'; g.beginPath(); g.arc(m[0], m[1], R * 1.08, rad(0), rad(max)); g.stroke();
          stufen.forEach((st, i) => {
            const a = rad(i), ca = Math.cos(a), sa = Math.sin(a), zielHier = G.marke && i === ziel;
            g.lineWidth = 3; g.strokeStyle = zielHier ? F.haupt : '#555';
            g.beginPath(); g.moveTo(m[0] + ca * R * 1.0, m[1] + sa * R * 1.0); g.lineTo(m[0] + ca * R * 1.16, m[1] + sa * R * 1.16); g.stroke();
            const mitte = Math.abs(ca) < 0.3, x = m[0] + ca * R * 1.24, y = m[1] + sa * R * 1.24;
            const maxW = mitte ? R * 2 : breit, zl = umbrechen(st, maxW);
            g.textAlign = mitte ? 'center' : ca > 0 ? 'left' : 'right'; g.textBaseline = 'middle';
            // ein einzelnes langes Wort (z. B. „Anlagenaufkleber“) passt nicht: Schrift für dieses Schild etwas kleiner
            g.font = `700 ${fw}px Barlow, system-ui, sans-serif`;
            const fwi = Math.max(9, fw * Math.min(1, maxW / Math.max(...zl.map(z => g.measureText(z).width))));
            g.font = `${zielHier || i === wert ? 700 : 600} ${fwi}px Barlow, system-ui, sans-serif`;
            g.fillStyle = zielHier ? F.dunkel || F.haupt : i === wert ? '#111' : '#555';
            const y1 = mitte ? y - (zl.length - 0.5) * fwi * 1.15 : y - (zl.length - 1) * fwi * 0.575;
            zl.forEach((z, k) => g.fillText(z, x, y1 + k * fwi * 1.15));
            if (zielHier) { const bw = Math.max(...zl.map(z => g.measureText(z).width)), bx = mitte ? x - bw / 2 : ca > 0 ? x : x - bw; g.fillStyle = F.haupt; g.fillRect(bx, y1 + (zl.length - 0.5) * fwi * 1.15 + 1, bw, 2.5); }
          });
        }
        if (!woerter) stufen.forEach((st, i) => {
          const a = rad(i), t = woerter && st.length > 5 ? '•' : st, x = m[0] + Math.cos(a) * R * 1.2, y = m[1] + Math.sin(a) * R * 1.2;
          if (G.marke && i === ziel) { g.beginPath(); g.arc(x, y, fh * (t.length > 2 ? 1.25 : 0.9), 0, Math.PI * 2); g.fillStyle = R_.mitAlpha(F.haupt, 0.22); g.fill(); g.lineWidth = 2; g.strokeStyle = F.haupt; g.stroke(); }
          g.fillStyle = i === wert ? '#111' : '#555'; zm(t.length > 6 ? fh * 0.8 : fh); g.fillText(t, x, y);
        });
        const name = art === 'stufen' ? 'thermostatkopf' : 'drehknopf';
        if (!RB.motivZeichnen(g, BL, name, m[0], m[1], R * 2, R * 2, { drehung: wertZuWinkel(wert) * Math.PI / 180, schatten: SCHATTEN })) {
          g.beginPath(); g.arc(m[0], m[1], R * 0.9, 0, Math.PI * 2); g.fillStyle = '#e6e8ea'; g.fill();
          const a = rad(wert); g.lineWidth = 4; g.strokeStyle = '#333'; g.beginPath(); g.moveTo(m[0], m[1]); g.lineTo(m[0] + Math.cos(a) * R * 0.7, m[1] + Math.sin(a) * R * 0.7); g.stroke();
        }
        schildY = m[1] + R + 6 + fs * 0.8;
        RB.schild(g, m[0], Math.min(h - fs, schildY), (/^\d+$/.test(stufen[wert]) ? 'Stufe ' : '') + stufen[wert], fs);
      }
      g.restore();
    });
  };

  // ---------- Im Menü einstellen ----------
  // Phase 3: beliebig tiefe Pfade („Solar>Speichermaximum>60 °C“), Zielwert aus ziel= („Heizstab>Freigabe unter
  // Außentemperatur“ + ziel=−6 °C), Startwert aus start=, zweite Einstellung menue2= (BU-07: Temperatur, dann Lüfter).
  const MENUE_VORRAT = {
    'Betriebsart': ['Sommer – nur Warmwasser', 'Heizen und Warmwasser', 'Nur Heizen', 'Aus'],
    'Heizzeiten': ['06:00–22:00', '05:00–21:00', 'Dauernd Tag'],
    'Warmwasser': ['50 °C', '55 °C', '60 °C'],
    'Heizkurve': ['0,8', '1,0', '1,2', '1,4'],
    'Urlaub': ['Aus', 'An'],
    'Info': ['Außentemperatur', 'Vorlauf', 'Fehlerliste'],
    // Klimagerät (Fernbedienung)
    'Modus': ['Kühlen', 'Heizen', 'Entfeuchten', 'Lüften', 'Automatik'],
    'Lüfter': ['1', '2', '3', 'Automatik'],
    'Timer': ['Aus', '1 h', '2 h'],
  };
  const KLIMA = ['Modus', 'Temperatur', 'Lüfter', 'Luftrichtung', 'Timer'];
  const MINUS = '−';
  // „−6 °C“ → { z: -6, einheit: '°C', plus: false, stellen: 0 }; „1,3“ → { z: 1.3 }; sonst null
  function zahlWert(t) {
    const m = String(t == null ? '' : t).trim().match(/^([+−-]?)(\d+(?:[,.]\d+)?)\s*(.*)$/);
    if (!m || /[:]/.test(t)) return null;
    const z = parseFloat(m[2].replace(',', '.')) * (m[1] === '-' || m[1] === MINUS ? -1 : 1);
    return { z, einheit: m[3], plus: m[1] === '+', stellen: (m[2].split(/[,.]/)[1] || '').length };
  }
  function zahlText(z, v) {
    const t = Math.abs(z).toFixed(v.stellen).replace('.', ',');
    return (z < 0 ? MINUS : v.plus && z > 0 ? '+' : '') + t + (v.einheit ? ' ' + v.einheit : '');
  }
  // Auswahl für eine Einstellung: Zielwert, Startwert und ein paar Nachbarn (Zahlen), sonst feste Listen
  function werteFuer(name, ziel, start) {
    const zv = zahlWert(ziel), sv = zahlWert(start);
    let l;
    if (/^\d{1,2}:\d{2}$/.test(String(ziel))) {   // Uhrzeit: im Abstand von 4 Stunden
      const [h, m] = String(ziel).split(':').map(Number);
      l = [-8, -4, 0, 4, 8].map(d => ((h + d + 24) % 24) + ':' + String(m).padStart(2, '0'));
      if (start && !l.includes(String(start))) l.push(String(start));
      l.sort((a, b) => parseInt(a) - parseInt(b));
    } else if (zv) {
      const spanne = sv ? Math.abs(zv.z - sv.z) : Math.max(1, Math.abs(zv.z) * 0.3);
      const schritte = [0.1, 0.2, 0.5, 1, 2, 3, 5, 10, 20];
      const d = schritte.reduce((b, s) => Math.abs(s - spanne / 3) < Math.abs(b - spanne / 3) ? s : b, schritte[0]);
      const z = [-2, -1, 0, 1, 2].map(k => +(zv.z + k * d).toFixed(3));
      if (sv && !z.some(x => Math.abs(x - sv.z) < 1e-6)) z.push(sv.z);
      const vorlage = Object.assign({}, zv, { plus: zv.plus || (sv && sv.plus) });
      l = z.sort((a, b) => a - b).map(x => zahlText(x, vorlage));
    } else if (/^(Ein|Aus|An)$/.test(String(ziel))) l = ['Ein', 'Aus'];
    else if (name === 'Betriebsart' && ziel === 'Automatik') l = ['Automatik', 'Handbetrieb', 'Aus'];
    else l = (MENUE_VORRAT[name] || ['Stufe 1', 'Stufe 2', 'Stufe 3']).slice();
    if (ziel != null && !l.includes(String(ziel))) l.splice(1, 0, String(ziel));
    return l;
  }
  HG['Im Menü einstellen'] = function (o) {
    const p = o.param || {};
    // Ziele lesen
    const ziele = [p.menue || 'Betriebsart>Heizen und Warmwasser'].concat(p.menue2 ? [p.menue2] : []).map((m, i) => {
      const teile = String(m).split('>').map(s => s.trim()).filter(Boolean);
      const mitZiel = i === 0 && p.ziel != null && !p.menue2 && !teile.includes(String(p.ziel));   // WP-05: Zielwert aus ziel=
      return mitZiel ? { pfad: teile, wert: String(p.ziel) } : { pfad: teile.slice(0, -1), wert: teile[teile.length - 1] };
    });
    // Startwerte: „16 °C, Lüfter 1“ → je Ziel einer (Name der Einstellung vorne weg)
    const startText = p.start == null ? null : String(p.start).replace(/^(\d+)\.(\d+)$/, '$1,$2');
    const starts = startText == null ? [] : ziele.length > 1 ? startText.split(/,\s*/) : [startText];
    ziele.forEach((z, i) => {
      const name = z.pfad[z.pfad.length - 1];
      let s = starts[i] != null ? String(starts[i]).trim() : null;
      if (s && s.startsWith(name + ' ')) s = s.slice(name.length + 1);
      if (s && zahlWert(s) && zahlWert(z.wert) && zahlWert(s).einheit === '' && zahlWert(z.wert).einheit) s = s + ' ' + zahlWert(z.wert).einheit;
      z.start = s;
    });
    // Baum: Ordner { name, kinder } und Einstellungen { name, werte, stand }
    const klima = ziele.some(z => KLIMA.includes(z.pfad[0]));
    const wurzel = { name: 'Menü', kinder: [] };
    const finde = (ordner, name) => ordner.kinder.find(k => k.name === name);
    ziele.forEach(z => {
      let o2 = wurzel;
      z.pfad.forEach((teil, i) => {
        const letzte = i === z.pfad.length - 1;
        let k = finde(o2, teil);
        if (!k) { k = letzte ? { name: teil } : { name: teil, kinder: [] }; o2.kinder.push(k); }
        else if (!letzte && !k.kinder) { k.kinder = []; delete k.werte; }
        if (letzte) {
          k.werte = werteFuer(teil, z.wert, z.start);
          if (z.start && !k.werte.includes(z.start)) k.werte.push(z.start);
          k.stand = z.start || k.werte.find(v => v !== z.wert) || k.werte[0];
          z.knoten = k;
        }
        o2 = k;
      });
    });
    // Ordner auf tieferer Ebene bekommen „Info“ (nur Anzeige) dazu, die oberste Ebene die üblichen Menüs
    (function auffuellen(ordner, tiefe) {
      ordner.kinder.forEach(k => { if (k.kinder) auffuellen(k, tiefe + 1); });
      if (tiefe > 0 && !finde(ordner, 'Info')) ordner.kinder.push({ name: 'Info', werte: MENUE_VORRAT.Info.slice(), stand: '' });
    })(wurzel, 0);
    (klima ? KLIMA : ['Betriebsart', 'Heizzeiten', 'Warmwasser', 'Info']).forEach((n, i) => {
      if (finde(wurzel, n)) return;
      const w = werteFuer(n, null, null);
      wurzel.kinder.splice(Math.min(i, wurzel.kinder.length), 0, { name: n, werte: w, stand: n === 'Info' ? '' : w[0] });
    });
    let pfad = [wurzel], auswahl = 0, fehler = 0;
    const offen = () => ziele.filter(z => z.knoten.stand !== z.wert);
    const { k } = geruest(o, false);
    const schirm = el('div', 'hg-lcd'); o.flaeche.insertBefore(schirm, k);
    const hoch = knopf('▲'), runter = knopf('▼'), zurueck = knopf('Zurück'), ok = knopf('OK', 'haupt');
    hoch.setAttribute('aria-label', 'nach oben'); runter.setAttribute('aria-label', 'nach unten');
    k.append(zurueck, hoch, runter, ok);
    const fertig = einmal(o);
    const jetzt = () => pfad[pfad.length - 1];
    const eintraege = () => { const n = jetzt(); return n.kinder ? n.kinder.map(x => x.name) : n.werte; };
    function malen() {
      schirm.textContent = '';
      const n = jetzt();
      schirm.append(el('div', 'kopf', n.name));
      eintraege().forEach((t, i) => {
        const z = el('div', 'zeile' + (i === auswahl ? ' aktiv' : ''));
        z.append(el('span', '', t));
        if (n.kinder) { const kind = n.kinder[i]; if (kind.werte && kind.name !== 'Info') z.append(el('small', '', kind.stand)); else if (kind.kinder) z.append(el('small', '', '›')); }
        else if (t === n.stand) z.append(el('small', '', '✓'));
        // Antippen (QA Phase 4: Antippen + OK war uneindeutig): Ordner öffnen sofort, Werte werden nur markiert – eingestellt
        // wird immer erst mit OK (der OK-Knopf leuchtet dann)
        z.addEventListener('click', () => { auswahl = i; if (n.kinder) { malen(); waehlen(); } else { ton('piep-kurz'); malen(); hinweisZurueck(); } });
        schirm.append(z);
      });
      // Wert markiert, aber noch nicht eingestellt: OK leuchtet
      ok.classList.toggle('bereit', !n.kinder && n.name !== 'Info' && n.werte[auswahl] !== n.stand);
    }
    function waehlen() {
      const n = jetzt();
      if (n.kinder) {
        const kind = n.kinder[auswahl];
        pfad.push(kind);
        auswahl = kind.kinder ? 0 : Math.max(0, kind.werte.indexOf(kind.stand));
        ton('piep-kurz'); malen(); return;
      }
      if (n.name === 'Info') { o.meldung('Nur zur Anzeige – hier lässt sich nichts einstellen.', 'info'); return; }
      const v = n.werte[auswahl];
      if (v === n.stand && !ziele.some(z => z.knoten === n && z.wert === v)) { o.meldung(RB.anw('menueSchonEingestellt', 'Das ist schon eingestellt. Wähle einen anderen Wert und bestätige mit OK.'), 'info'); schonGesagt = true; return; }
      n.stand = v; malen();
      const ziel = ziele.find(z => z.knoten === n);
      if (ziel && v === ziel.wert) {
        if (!offen().length) {
          const g = fehler === 0 ? 'genau' : fehler === 1 ? 'ungenau' : 'anlauf2';
          ton('piep'); ton('gut', { verzoegerung: 0.22 });
          o.meldung(guteText(g, 'Eingestellt: ' + ziele.map(z => z.wert).join(', ') + '.'), 'gut');
          fertig(g);
        } else { ton('piep'); R_.ton('gut'); o.meldung('Eingestellt: ' + v + '. Eine Einstellung fehlt noch.', 'info'); }
      } else { fehler++; R_.ton('fehler'); o.meldung('Eingestellt: ' + v + ' – das ist es noch nicht.', 'falsch'); }
    }
    // nach „Das ist schon eingestellt.“ wieder die Bedienhilfe zeigen, sobald ein anderer Wert markiert ist
    let schonGesagt = false;
    const HILFE = RB.anw('menueHinweis', 'Wähle mit ▲ ▼ oder durch Antippen aus und bestätige mit OK.');
    function hinweisZurueck() { if (schonGesagt) { schonGesagt = false; o.meldung(''); } }
    hoch.addEventListener('click', () => { const n = eintraege().length; auswahl = (auswahl + n - 1) % n; ton('piep-kurz'); malen(); hinweisZurueck(); });
    runter.addEventListener('click', () => { const n = eintraege().length; auswahl = (auswahl + 1) % n; ton('piep-kurz'); malen(); hinweisZurueck(); });
    ok.addEventListener('click', waehlen);
    zurueck.addEventListener('click', () => { ton('piep-kurz'); if (pfad.length > 1) { const alt = pfad.pop(); auswahl = Math.max(0, jetzt().kinder.indexOf(alt)); malen(); } });
    malen();
    o.meldung(HILFE, 'anweisung');
    o.menueZiele = RB.menueZiele = ziele.map(z => ({ pfad: z.pfad, wert: z.wert }));   // Testhilfe (Playwright)
  };

  // ---------- Schrittfolgen: Teil austauschen, Dichtung tauschen ----------
  function schrittfolge(o, standard) {
    const p = o.param || {}, schritte = (p.schritte && p.schritte.length ? p.schritte : standard).map(s => s.charAt(0).toUpperCase() + s.slice(1));
    const { c, k } = geruest(o);
    c.classList.add('klein');
    const liste = el('ol', 'hg-schritte'); o.flaeche.insertBefore(liste, k);
    k.classList.add('wahl');
    let n = 0, fehler = 0;
    const fertig = einmal(o);
    mischen(schritte.map((s, i) => [s, i])).forEach(([s, i]) => {
      const b = knopf(s);
      b.addEventListener('click', () => {
        if (i === n) {
          b.disabled = true; b.classList.add('erledigt'); liste.append(el('li', '', s)); liste.scrollTop = liste.scrollHeight; n++;
          const [kl, ko] = schrittKlang(s); ton(kl, ko);
          if (n === schritte.length) { ton('gut', { verzoegerung: 0.35 }); const g = fehler === 0 ? 'genau' : fehler === 1 ? 'ungenau' : 'anlauf2'; o.meldung(guteText(g), 'gut'); fertig(g); }
          else o.meldung('Gut. Was kommt als Nächstes?', 'info');
        } else {
          fehler++; R_.ton('fehler'); b.classList.remove('wackeln'); void b.offsetWidth; b.classList.add('wackeln');
          o.meldung(RB.rueck('reihenfolge', n === 0 ? 'Noch nicht – womit fängst du an?' : 'Noch nicht – was kommt vorher?'), 'falsch');
        }
      });
      k.append(b);
    });
    o.meldung(RB.anw('schritte', 'Tippe die Arbeitsschritte in der richtigen Reihenfolge an.'), 'anweisung');
    o.stop = schleife(() => {
      const { g, w, h } = RB.leinwand(c);
      g.clearRect(0, 0, w, h);
      const s = Math.min(h, w * 0.45);
      bauteil(g, o, w / 2 - s - 6, (h - s) / 2, s, s);
      if (o.werkzeug) {
        const z = RB.werkzeugZelle(o.werkzeug);   // alle Werkzeugblätter, nicht nur das Keller-Blatt
        if (z) RB.zelle(g, z.b.blatt, z.nr, z.b.spalten, z.b.zeilen, w / 2 + 6, (h - s) / 2, s, s, false);
      }
      if (n === schritte.length) { g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(0, 0, w, h); }
    });
  }
  HG['Teil austauschen'] = o => schrittfolge(o, ['Absperren', 'Altes Teil abschrauben', 'Neues Teil einschrauben', 'Wieder öffnen']);
  HG['Dichtung tauschen'] = o => schrittfolge(o, ['Absperren', 'Verschraubung lösen', 'Alte Dichtung raus', 'Neue Dichtung rein', 'Festziehen', 'Wieder öffnen']);

  // ---------- Teil einsetzen (Steck-/Klickteil in richtiger Lage) ----------
  // QA Phase 3: die Arbeitsschritte aus den Daten stehen als Liste darüber (z. B. „neue Kette am Drücker einhängen“). Die
  // Schritte vor dem Einsetzen gelten als erledigt, der Einsetz-Schritt ist der Handgriff (drehen + auf den Platz ziehen),
  // danach haken sich die übrigen Schritte ab. Das Teil zeigt sein Bild aus den Werkzeugblättern (RB.werkzeugZelle).
  const EINSETZ = /(setzen|schieben|stecken|einhängen|legen|aufhängen|aufklicken|einrasten|montieren|einbauen)\b/i;
  HG['Teil einsetzen'] = function (o) {
    const p = o.param || {}, schritte = (p.schritte || []).map(s => s.charAt(0).toUpperCase() + s.slice(1));
    const { c, k } = geruest(o);
    let liste = null, lis = [], jetzt = 0;
    if (schritte.length) {
      jetzt = schritte.findIndex(s => /\bneu/i.test(s) && EINSETZ.test(s));
      if (jetzt < 0) jetzt = schritte.findIndex(s => EINSETZ.test(s));
      if (jetzt < 0) jetzt = Math.floor((schritte.length - 1) / 2);
      liste = el('ol', 'hg-schritte hg-teilschritte');
      lis = schritte.map((s, i) => { const li = el('li', i < jetzt ? 'erledigt' : i === jetzt ? 'jetzt' : 'offen', s); liste.append(li); return li; });
      o.flaeche.insertBefore(liste, c);
    }
    const drehen = knopf('Drehen ↻'); k.append(drehen);
    const hilfe = geschick(o).einsetzen;
    let lage = [90, 180, 270][Math.floor(Math.random() * 3)], teil = null, zug = null, fehler = 0, drin = false;
    const fertig = einmal(o);
    drehen.addEventListener('click', () => { if (!drin) { lage = (lage + 90) % 360; ton('klick', { rate: 0.8 }); } });
    let ziel = [0, 0, 0];
    RB.teilTest = () => ({ lage, teil, ziel, hilfe });   // Testhilfe (Playwright): Lage und Plätze in Leinwand-Pixeln
    // nach dem Einsetzen: restliche Schritte nacheinander abhaken, dann fertig
    function abschliessen(g) {
      drehen.disabled = true;
      if (lis[jetzt]) lis[jetzt].className = 'erledigt';
      let i = jetzt + 1;
      const weiter = () => {
        if (i < lis.length) { lis[i].className = 'erledigt'; i++; R_.ton('klick'); setTimeout(weiter, RB.ruhig ? 60 : 380); return; }
        fertig(g);
      };
      setTimeout(weiter, RB.ruhig ? 60 : 420);
    }
    zeiger(c, (art, x, y) => {
      if (drin) return;
      if (art === 'runter') { if (teil && Math.hypot(x - teil[0], y - teil[1]) < teil[2] * 1.2) zug = [x - teil[0], y - teil[1]]; return; }
      if (art === 'zug' && zug) { teil[0] = x - zug[0]; teil[1] = y - zug[1]; return; }
      if (art === 'hoch' && zug) {
        zug = null;
        if (Math.hypot(teil[0] - ziel[0], teil[1] - ziel[1]) < ziel[2] * 0.8) {
          if (lage === 0) { drin = true; teil[0] = ziel[0]; teil[1] = ziel[1]; ton('einrasten'); ton('gut', { verzoegerung: 0.15 }); const g = fehler === 0 ? 'genau' : fehler === 1 ? 'ungenau' : 'anlauf2'; o.meldung(guteText(g, 'Klick – sitzt.'), 'gut'); abschliessen(g); }
          else { fehler++; R_.ton('fehler'); o.meldung('So herum passt es nicht – drehe es zuerst.', 'falsch'); teil = null; }
        } else teil = null;
      }
    });
    o.meldung(RB.anw('teilEinsetzen', 'Drehe das neue Teil in die richtige Lage und ziehe es auf den markierten Platz.'), 'anweisung');
    const zelle = RB.werkzeugZelle(o.werkzeug || '');
    let groesse = null;
    o.stop = schleife((dt, t) => {
      const { g, w, h } = RB.leinwand(c);
      g.clearRect(0, 0, w, h);
      // Ausgangsplatz neu, wenn sich die Leinwand ändert (Drehen des Handys) – sonst bleibt das Teil, wo es ist
      if (!groesse || groesse[0] !== w || groesse[1] !== h) { groesse = [w, h]; if (!drin) teil = null; }
      const s = Math.min(w * 0.75, h);
      // QA (S3): auf 320 war das Teil nur ca. 25 px – Teil und Platz größer (mindestens 26 px Radius, wenn die Höhe reicht)
      const tr = Math.max(Math.min(s * 0.18, h * 0.2), Math.min(26, h * 0.2));
      const u = bauteil(g, o, (w - s) / 2, 0, s, s * 0.8);
      ziel = [w / 2, (u ? u.y + u.h * 0.45 : h * 0.35), tr * 1.12];
      g.save(); g.setLineDash([6, 5]); g.lineWidth = 2.5; g.strokeStyle = F.haupt;
      g.fillStyle = 'rgba(255,255,255,.35)';
      g.beginPath(); g.arc(ziel[0], ziel[1], ziel[2], 0, Math.PI * 2); g.fill(); g.stroke();
      // Hilfe je Stufe (GESCHICK.einsetzen): Azubi Umriss des Teils in richtiger Lage, Azubi/Geselle Lage-Kerbe, Meister ohne
      if (hilfe === 'umriss' && !drin && zelle && RB.geladen(RB.bild(zelle.b.blatt))) {
        g.setLineDash([]); g.globalAlpha = 0.32;
        RB.zelle(g, zelle.b.blatt, zelle.nr, zelle.b.spalten, zelle.b.zeilen, ziel[0] - ziel[2] * 1.05, ziel[1] - ziel[2] * 1.05, ziel[2] * 2.1, ziel[2] * 2.1, false);
        g.globalAlpha = 1;
      }
      if (hilfe !== 'ohne') { g.setLineDash([]); g.fillStyle = F.haupt; g.beginPath(); g.moveTo(ziel[0], ziel[1] - ziel[2] - 8); g.lineTo(ziel[0] - 6, ziel[1] - ziel[2] + 2); g.lineTo(ziel[0] + 6, ziel[1] - ziel[2] + 2); g.fill(); }
      g.restore();
      if (!teil) teil = [w / 2, h - tr * 1.25, tr];
      g.save(); g.translate(teil[0], teil[1]); g.rotate(lage * Math.PI / 180);
      const r = teil[2];
      if (zelle && RB.geladen(RB.bild(zelle.b.blatt))) {
        // freigestelltes Teil-Bild mit leichtem Schatten, keine Scheibe dahinter
        g.save(); g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 6; g.shadowOffsetY = 2;
        RB.zelle(g, zelle.b.blatt, zelle.nr, zelle.b.spalten, zelle.b.zeilen, -r * 1.15, -r * 1.15, r * 2.3, r * 2.3, false);
        g.restore();
      } else {
        g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fillStyle = '#f2f2f2'; g.fill(); g.strokeStyle = '#888'; g.lineWidth = 2; g.stroke();
      }
      if (hilfe !== 'ohne') {   // Lage-Pfeil am Teil (Meister: ohne – die richtige Lage erkennt er am Teil selbst)
        g.fillStyle = '#c62828'; g.strokeStyle = '#fff'; g.lineWidth = 1.5;
        g.beginPath(); g.moveTo(0, -r - 9); g.lineTo(-7, -r + 3); g.lineTo(7, -r + 3); g.closePath(); g.fill(); g.stroke();
      }
      g.restore();
      if (!drin && !zug) { g.globalAlpha = 0.5 + 0.5 * Math.sin(t * 4); g.strokeStyle = F.haupt; g.lineWidth = 2; g.beginPath(); g.arc(teil[0], teil[1], r + 6, 0, Math.PI * 2); g.stroke(); g.globalAlpha = 1; }
    });
  };

  // ---------- Entlüften (halten, bis Wasser statt Luft kommt) ----------
  HG['Entlüften'] = function (o) {
    const { c, k } = geruest(o);
    const b = knopf('Ventil öffnen (halten)', 'haupt halten'); k.append(b);
    let offen = false, zeit = 0, wasserAb = 1.6 + Math.random() * 1.6, fehler = 0, fertigGemeldet = false;
    let zisch = null, tropfZeit = 0;   // Ton: erst zischt Luft, dann tropft Wasser
    RB.entlueftenTest = () => ({ offen, zeit, wasserAb, fenster: geschick(o).entlueften });   // Testhilfe
    const zischAus = () => { if (zisch) zisch.aus(0.1); zisch = null; };
    const fertig = einmal(o);
    halten(b, () => { if (!fertigGemeldet) { offen = true; zeit = 0; tropfZeit = 0; zischAus(); zisch = haltenTon('zischen-schleife', 'zischen'); } }, () => {
      zischAus();
      if (!offen || fertigGemeldet) return;
      offen = false;
      // Reaktionszeit je Stufe 1,8/1,4/0,9s (GESCHICK.entlueften; Geselle = vorher, Supervisor 25.10.2026)
      if (zeit < wasserAb) { fehler++; ton('fehler', { faktor: 0.7 }); o.meldung(RB.rueck('entlueftenFrueh', 'Da kam noch Luft – nochmal öffnen und warten, bis Wasser kommt.'), 'falsch'); wasserAb = Math.max(0.6, wasserAb - zeit) ; }
      else if (zeit - wasserAb <= geschick(o).entlueften) { fertigGemeldet = true; ton('gut'); o.meldung(guteText(fehler === 0 ? 'genau' : 'ungenau', 'Luft raus, Wasser kommt – zu.'), 'gut'); fertig(fehler === 0 ? 'genau' : 'ungenau'); }
      else { fertigGemeldet = true; ton('fehler', { faktor: 0.6 }); o.meldung(RB.rueck('entlueftenSpaet', 'Etwas spät zugedreht – aber die Luft ist raus.'), 'falsch'); fertig('ungenau'); }
    });
    o.meldung(RB.anw('entlueften', 'Halte das Ventil offen, bis statt Luft Wasser kommt – dann loslassen.'), 'anweisung');
    o.stop = schleife((dt, t) => {
      if (offen) zeit += dt;
      if (offen && zeit >= wasserAb) {   // Wasser kommt: Zischen weg, Tropfen
        zischAus();
        tropfZeit -= dt;
        if (tropfZeit <= 0) { ton('tropfen'); tropfZeit = 0.3 + Math.random() * 0.12; }
      }
      const { g, w, h } = RB.leinwand(c);
      g.clearRect(0, 0, w, h);
      const s = Math.min(w, h);
      bauteil(g, o, (w - s) / 2, 0, s, s);
      const m = [w / 2, h * 0.42];
      if (offen) {
        if (zeit < wasserAb) {   // Luft: Zischen als Bogen und Bläschen
          g.strokeStyle = 'rgba(80,80,80,.55)'; g.lineWidth = 2;
          for (let i = 0; i < 4; i++) { const ph = (t * 2 + i / 4) % 1; g.globalAlpha = 1 - ph; g.beginPath(); g.arc(m[0] + ph * s * 0.25, m[1], 6 + ph * s * 0.1, -0.7, 0.7); g.stroke(); }
          g.globalAlpha = 1; RB.schild(g, w / 2, h - 18, 'zischt…', 13);
        } else {
          for (let i = 0; i < 4; i++) { const ph = (t * 1.6 + i / 4) % 1; RB.tropfen(g, m[0] + s * 0.05, m[1] + ph * s * 0.4, s * 0.025); }
          // „bis=“ aus der Ort-Datei (WP-10, DB-01 …): woran man erkennt, dass es reicht
          RB.schild(g, w / 2, h - 18, o.param && o.param.bis ? String(o.param.bis).charAt(0).toUpperCase() + String(o.param.bis).slice(1) : 'Wasser kommt', 13);
        }
      }
    });
    tonAufraeumen(o, zischAus);
  };

  // ---------- Abfluss frei machen (im Takt drücken) ----------
  HG['Abfluss frei machen'] = function (o) {
    const { c, k } = geruest(o);
    const b = knopf('Drücken', 'haupt'); k.append(b);
    let treffer = 0, daneben = 0, druck = 0, dreh = 0;
    // Takt je Stufe (GESCHICK.abfluss): Fenster um den größten Ring – vorher 0,28 davor + 0,12 danach (= 0,40 beim Gesellen);
    // Azubi großzügiger, Meister enger und etwas schneller
    const NOETIG = 5, fertig = einmal(o), GA = geschick(o).abfluss, VOR = GA.fenster * 0.7, NACH = GA.fenster * 0.3;
    // gestaltete Teile (Handgriff-Runde 25.10.2026): Spirale → Wandstutzen frontal + Spiralkopf; Saugglocke → Bauteil + Glocke
    const saugglocke = /saugglocke/i.test(o.werkzeug || '');
    const glocke = saugglocke ? RB.werkzeugZelle(o.werkzeug) : null;
    let t0 = 0, jetzt = 0;
    RB.abflussTest = () => ({ ph: ((jetzt - t0) * GA.takt) % 1, VOR, NACH, takt: GA.takt, treffer, gesperrt: jetzt < sperreBis });   // Testhilfe
    // Nachtest 25.10.2026 (Claude Player: wildes Dauertippen schaffte den Auftrag): je Ring zählt nur ein Tipp; ein Tipp außerhalb
    // des Fensters (oder ein zweiter im selben Ring) nimmt einen Treffer zurück und sperrt den Knopf kurz (0,5s). So bringt
    // Dauertippen nichts, ruhiges Tippen im Takt (Fenster je Stufe aus GESCHICK.abfluss) bleibt so leicht wie bisher.
    let letzterRing = -1, sperreBis = 0;
    const SPERRE = 0.5;
    b.addEventListener('pointerdown', () => {
      if (treffer >= NOETIG || jetzt < sperreBis) return;
      const lauf = (jetzt - t0) * GA.takt, ph = lauf % 1, ring = Math.floor(lauf + VOR);   // Ring, dessen Fenster gerade offen ist
      const gut = (ph > 1 - VOR || ph < NACH) && ring !== letzterRing;
      druck = 1;
      if (gut) { treffer++; letzterRing = ring; if (treffer >= NOETIG) { ton('abfluss'); ton('gut', { verzoegerung: 0.3 }); } else ton('gluckern', { ab: Math.random() * 2.2, dauer: 0.45, faktor: 4.5 }); o.meldung(treffer < NOETIG ? 'Gut im Takt.' : guteText(daneben <= 2 ? 'genau' : 'ungenau', 'Es gluckert – das Wasser läuft ab.'), 'gut'); if (treffer >= NOETIG) fertig(daneben <= 2 ? 'genau' : 'ungenau'); }
      else {
        daneben++; treffer = Math.max(0, treffer - 1); sperreBis = jetzt + SPERRE;
        b.classList.add('gesperrt'); setTimeout(() => b.classList.remove('gesperrt'), SPERRE * 1000);
        ton('fehler', { faktor: 0.5 });
        o.meldung(RB.anw('abflussDaneben', 'Nicht im Takt – tippe, wenn der Ring den gestrichelten Kreis erreicht.'), 'falsch');
      }
    });
    // Spielertest 25.10.2026 (GPT Player): Die Anweisung erklärt die echte Bedienung (Takt-Knopf) und bleibt stehen; „Gut im
    // Takt“ u. a. stehen als Rückmeldung in einer eigenen Zeile. Die handwerkliche Beschreibung („Schiebe die Spirale …“) bleibt darüber.
    o.meldung(RB.anw('abflussTakt', 'Tippe auf „Drücken“, wenn der Ring den gestrichelten Kreis erreicht.'), 'anweisung');
    o.stop = schleife((dt, t) => {
      jetzt = t; druck = Math.max(0, druck - dt * 4); dreh += dt * (1.5 + druck * 9);
      const { g, w, h } = RB.leinwand(c);
      g.clearRect(0, 0, w, h);
      const s = Math.min(w, h - 22), m = [w / 2, (h - 22) / 2 + 2];
      const rest = 1 - treffer / NOETIG;
      const sd = RB.motivDaten('bedienteile-2', 'stutzen');
      if (!saugglocke && sd && RB.motiv('bedienteile-2', 'stutzen')) {
        // Wandstutzen frontal, Öffnung genau in der Mitte; darin steht Wasser, das mit jedem Treffer sinkt
        const sb = s * 0.66, sh = sb * sd[3] / sd[2], lr = sb * 0.29;
        RB.motivZeichnen(g, 'bedienteile-2', 'stutzen', m[0], m[1], sb, sh, { ax: 0.473, ay: 0.509, schatten: SCHATTEN });
        if (rest > 0) {
          g.save(); g.beginPath(); g.arc(m[0], m[1], lr, 0, Math.PI * 2); g.clip();
          g.fillStyle = `rgba(70,62,48,${0.5 * rest})`; g.fillRect(m[0] - lr, m[1] - lr, lr * 2, lr * 2);   // trübes Wasser
          const gl = g.createRadialGradient(m[0] - lr * 0.35, m[1] - lr * 0.4, 0, m[0] - lr * 0.35, m[1] - lr * 0.4, lr * 0.9);   // Glanz auf der Oberfläche
          gl.addColorStop(0, `rgba(255,255,255,${(0.35 + 0.08 * Math.sin(t * 2)) * rest})`); gl.addColorStop(1, 'rgba(255,255,255,0)');
          g.fillStyle = gl; g.fillRect(m[0] - lr, m[1] - lr, lr * 2, lr * 2);
          g.restore();
        }
        // Spiralkopf: Kopf in der Öffnung, dreht und schiebt beim Drücken ein Stück hinein
        const kd = RB.motivDaten('bedienteile-2', 'spiralkopf'), kl = s * 0.55 * (1 - druck * 0.1) * (1 - treffer * 0.03);
        if (kd) RB.motivZeichnen(g, 'bedienteile-2', 'spiralkopf', m[0] + Math.sin(dreh) * s * 0.008, m[1] + Math.cos(dreh) * s * 0.008, kl, kl * kd[3] / kd[2],
          { ax: 0.15, ay: 0.7, drehung: Math.sin(dreh * 0.7) * 0.06, schatten: SCHATTEN });
      } else {
        bauteil(g, o, (w - s) / 2, 0, s, s);
        if (rest > 0) RB.pfuetze(g, m[0], m[1] + s * 0.15, s * 0.7 * (0.5 + 0.5 * rest), t, { klein: true, dunkel: 0.12 });
        if (glocke && RB.geladen(RB.bild(glocke.b.blatt))) {   // Saugglocke drückt beim Drücken nach unten
          const gs = s * 0.42;
          g.save(); g.shadowColor = 'rgba(0,0,0,.3)'; g.shadowBlur = 8; g.shadowOffsetY = 3;
          RB.zelle(g, glocke.b.blatt, glocke.nr, glocke.b.spalten, glocke.b.zeilen, m[0] - gs / 2, m[1] - gs * 0.75 + druck * s * 0.05, gs, gs * (1 - druck * 0.08), false);
          g.restore();
        } else { g.fillStyle = '#7a3b2e'; g.beginPath(); g.ellipse(m[0], m[1] + druck * 8, s * 0.07, s * 0.045, 0, 0, Math.PI * 2); g.fill(); }
      }
      // Takt-Ring und Zielkreis bleiben Code
      const ph = ((t - t0) * GA.takt) % 1, r = s * (0.08 + 0.22 * ph);
      g.strokeStyle = F.haupt; g.lineWidth = 3; g.globalAlpha = 0.4 + ph * 0.6;
      g.beginPath(); g.arc(m[0], m[1], r, 0, Math.PI * 2); g.stroke(); g.globalAlpha = 1;
      g.setLineDash([4, 4]); g.strokeStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.arc(m[0], m[1], s * 0.28, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
      for (let i = 0; i < NOETIG; i++) { g.beginPath(); g.arc(w / 2 + (i - 2) * 16, h - 10, 5, 0, Math.PI * 2); g.fillStyle = i < treffer ? F.haupt : 'rgba(0,0,0,.2)'; g.fill(); }
    });
  };

  // ---------- Nachziehen (mit Gefühl, nicht überdrehen) ----------
  HG['Nachziehen'] = function (o) {
    const { c, k } = geruest(o);
    const b = knopf('Anziehen (halten)', 'haupt halten'), ok = knopf('Fertig', 'fertig'); k.append(b, ok);
    let kraft = 0, an = false, versuch = 0, kaputt = false, rastZeit = 0;
    // Zielfenster großzügiger (QA Phase 4): markierter Bereich 0,68–0,9, kurz davor zieht der Balken langsamer
    // (0,32/s → 0,2/s) – Dauerhalten trifft den Bereich gut 1s lang statt 0,6s; „zu fest“ erst nach ca. 3,8s
    // Geschick je Stufe (GESCHICK.nachziehen): Bereich breit/mittel/schmal, Balken langsam/mittel/schnell
    const GN = geschick(o).nachziehen, ZONE = GN.zone, LANGSAM_AB = ZONE[0] - 0.06, fertig = einmal(o);
    // Werkzeug, das sich mit dreht: Drehmomentschlüssel, sonst Maulschlüssel an der Mutter
    const schluessel = /drehmoment/i.test(o.werkzeug || '') ? 'drehmoment' : 'maulschluessel';
    halten(b, () => { an = true; }, () => { an = false; });
    RB.nachziehTest = () => ({ kraft, zone: ZONE, tempo: GN.tempo, langsamAb: LANGSAM_AB });   // Testhilfe
    ok.addEventListener('click', () => {
      if (kraft < ZONE[0]) { ton('fehler', { faktor: 0.6 }); o.meldung(RB.rueck('nachziehenLocker', 'Noch zu locker – etwas weiter ziehen.'), 'falsch'); return; }
      const g = versuch ? 'anlauf2' : kraft <= ZONE[1] ? 'genau' : 'ungenau';
      ton('gut');
      o.meldung(guteText(g, 'Sitzt fest und dicht.'), 'gut');
      fertig(g);
    });
    o.meldung(RB.anw('nachziehen', 'Ziehe die Verschraubung an, bis der Balken im markierten Bereich steht.'), 'anweisung');
    o.stop = schleife(dt => {
      if (an && !kaputt) kraft += dt * (kraft < LANGSAM_AB ? GN.tempo[0] : GN.tempo[1]);
      // Ratsche beim Anziehen, etwas höher, je fester es sitzt
      if (an && !kaputt) { rastZeit -= dt; if (rastZeit <= 0) { ton('nachziehen', { rate: 0.94 + Math.min(1, kraft) * 0.16 }); rastZeit = 0.5; } } else rastZeit = 0;
      if (kraft > 1) { kaputt = true; an = false; versuch++; kraft = 0.45; ton('fehler'); o.meldung(RB.rueck('nachziehenFest', 'Zu fest – das hätte die Dichtung zerquetscht. Nochmal mit Gefühl.'), 'falsch'); setTimeout(() => { kaputt = false; }, 400); }
      const { g, w, h } = RB.leinwand(c);
      g.clearRect(0, 0, w, h);
      const s = Math.min(w, h * 0.8);
      const u = bauteil(g, o, (w - s) / 2, 0, s, s * 0.8);
      // Schlüssel an der Mutter (Mitte des Bauteils bzw. masse.mitte), dreht beim Anziehen mit (bis ca. 45°)
      const mu = u && o.bauteil.masse && o.bauteil.masse.mitte ? u.p(...o.bauteil.masse.mitte) : [w / 2, s * 0.4];
      const sd = RB.motivDaten('bedienteile-2', schluessel), lang = Math.min(w * 0.62, s * 0.75);
      const wackeln = kaputt ? Math.sin(performance.now() / 30) * 0.03 : 0;
      if (sd) RB.motivZeichnen(g, 'bedienteile-2', schluessel, mu[0], mu[1], lang, lang * sd[3] / sd[2],
        { ax: schluessel === 'drehmoment' ? 0.07 : 0.075, ay: 0.5, drehung: -0.55 + Math.min(1, kraft) * 0.8 + wackeln, schatten: SCHATTEN });
      const bx = w * 0.15, bw = w * 0.7, by = h - 26;
      g.fillStyle = 'rgba(0,0,0,.15)'; RB.rund(g, bx, by, bw, 14, 7); g.fill();
      g.fillStyle = R_.mitAlpha(F.haupt, 0.35); g.fillRect(bx + bw * ZONE[0], by, bw * (ZONE[1] - ZONE[0]), 14);
      g.fillStyle = kraft > ZONE[1] ? '#d9483b' : F.haupt; RB.rund(g, bx, by, bw * Math.min(1, kraft), 14, 7); g.fill();
    });
  };

  // ---------- Entstören / Neustart (Taste halten) ----------
  HG['Entstören/Neustart'] = function (o) {
    const { c, k } = geruest(o);
    // eigene Taste und Nacharbeit aus den Daten (HA-08: taste=Reset halten; danach=Uhrzeit prüfen) – sonst die Entstör-Taste
    const p = o.param || {}, taste = p.taste ? String(p.taste) : '';
    const b = knopf(taste || 'Entstör-Taste (halten)', 'haupt halten'); k.append(b);
    let an = false, stand = 0, fertigt = false;
    const fertig = einmal(o);
    const lassen = () => { an = false; if (!fertigt && stand > 0) o.meldung('Halte länger – bis der Ring voll ist.', 'info'); };
    const druecken = () => { if (!an && !fertigt) ton('piep-kurz'); an = true; };   // Taste piept beim Drücken
    halten(b, druecken, lassen);
    halten(c, druecken, lassen);   // auch die gezeichnete Taste lässt sich halten
    c.style.touchAction = 'none';
    // mit eigener Taste steht die Anweisung schon im Hinweis darüber (Text aus der Ort-Datei)
    if (!taste) o.meldung(RB.anw('entstoeren', 'Halte die Entstör-Taste gedrückt, bis der Ring voll ist.'), 'anweisung');
    o.stop = schleife(dt => {
      if (an && !fertigt) stand = Math.min(1, stand + dt / 1.4); else if (!fertigt) stand = Math.max(0, stand - dt);
      if (stand >= 1 && !fertigt) {
        fertigt = true; ton('piep'); ton('gut', { verzoegerung: 0.25 }); b.disabled = true;
        if (p.danach) {   // Nacharbeit als eigener Knopf (wie beim Reinigen), dann erst fertig
          const nachher = knopf(String(p.danach), 'haupt'); k.append(nachher);
          o.meldung('Neustart – das Gerät läuft wieder. Und jetzt: ' + p.danach + '.', 'gut');
          nachher.addEventListener('click', () => { nachher.disabled = true; o.meldung(RB.rueck('genau'), 'gut'); fertig('genau'); });
        } else { o.meldung('Neustart – das Gerät läuft wieder.', 'gut'); fertig('genau'); }
      }
      const { g, w, h } = RB.leinwand(c);
      g.clearRect(0, 0, w, h);
      // Display oben, Taste darunter – Taste samt Ring passt immer in die Leinwand (quer flach: kleiner)
      const dw = Math.min(w * 0.8, h * 1.1), dh = dw * 0.32, oben = h * 0.06;
      RB.lcd(g, (w - dw) / 2, oben, dw, dh, fertigt ? 'Betrieb' : (o.code || 'Störung'), { farbe: fertigt ? '#9fffb8' : '#ffb3a8' });
      const r = Math.max(14, Math.min(Math.min(w, h) * 0.17, (h - oben - dh - 14) / 2.75)), m = [w / 2, oben + dh + 6 + r * 1.05 + 9];
      // gestaltete Reset-Taste (normal/gedrückt, Handgriff-Runde 25.10.2026); Display und Ring bleiben Code
      const gedrueckt = an && !fertigt;
      const taste = RB.motivZeichnen(g, gedrueckt ? 'bedienteile-2' : 'bedienteile-1', gedrueckt ? 'resetGedrueckt' : 'resetTaste', m[0], m[1] + (gedrueckt ? 1 : 0), r * 2.1, r * 2.1,
        { schatten: gedrueckt ? { a: 0.2, blur: 4, y: 1 } : SCHATTEN });
      if (!taste) { g.beginPath(); g.arc(m[0], m[1], r, 0, Math.PI * 2); g.fillStyle = an ? '#cfd3d6' : '#e3e6e8'; g.fill(); g.strokeStyle = '#999'; g.lineWidth = 2; g.stroke(); }
      g.lineWidth = 6; g.strokeStyle = F.haupt; g.lineCap = 'round';
      g.beginPath(); g.arc(m[0], m[1], r * 1.05 + 9, -Math.PI / 2, -Math.PI / 2 + stand * Math.PI * 2); g.stroke();
      g.fillStyle = taste ? 'rgba(40,44,48,.75)' : '#444'; g.font = `700 ${r * 0.5}px Barlow, system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('↺', m[0], m[1] + (gedrueckt ? 1 : 0));
    });
  };
})();
