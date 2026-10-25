// Rohrbruch (Baukasten A1 SHK, Spielordner shk-adventure): Mini-Adventure im Stil eines Escape-Rooms.
// Ein Durchgang = 3 Einsätze. Je Einsatz: Level-Titel → Funkspruch/Fahrt → Kundin schildert → Raum untersuchen (Lupe) →
// Ursache wählen → Werkzeug/Teil holen (Koffer, Transporter, Versteck im Raum) → Sicherheit → Handgriff → ggf. Entstören →
// Dank → Einsatzbuch. Stufen Azubi/Geselle/Meister mit eigenem Bestwert. Konzept MZ 24.10.2026, Auftrag Supervisor Phase 2.
// Texte: daten.js (erzeugt aus Material/Texte/*.md), Bilder/Maße: orte.js, Handgriffe: handgriffe.js, Start/Ende: schirme.js.
(function () {
  'use strict';
  const R_ = window.Rahmen, F = R_.farben, K = R_.kunde, RB = window.RB;
  const D = window.ROHRBRUCH, O = window.ROHRBRUCH_ORTE, W = window.ROHRBRUCH_WERKZEUG, FIG = window.ROHRBRUCH_FIGUREN || {};
  const NBSP = ' ';

  // ---------- Texte für den Kunden anpassen (Phase 3 Korrektur, MZ 25.10.2026) ----------
  // 1. regional: true (kunde.js) – ganze Texteinheiten durch die regionale Fassung ersetzen (D.regional, erzeugt aus
  //    rohrbruch-regional-entwurf.md); 2. danach Platzhalter {firma} (Firmenname) und {meister} (Nachname des Meisters).
  // Läuft einmal für daten.js und für jede nachgeladene Ort-Datei; nur Werte, nie Schlüssel.
  const MEISTER_NACHNAME = (K.meister && (K.meister.nachname || String(K.meister.name || '').trim().split(/\s+/).pop())) || 'Lehner';
  function texteAnpassen(o) {
    const reg = K.regional && D.regional ? D.regional : null;
    const text = t => {
      if (reg && Object.prototype.hasOwnProperty.call(reg, t)) t = reg[t];
      return t.indexOf('{') < 0 ? t : t.split('{firma}').join(K.firma || '').split('{meister}').join(MEISTER_NACHNAME);
    };
    const gehen = x => {
      if (Array.isArray(x)) { for (let i = 0; i < x.length; i++) { if (typeof x[i] === 'string') x[i] = text(x[i]); else if (x[i] && typeof x[i] === 'object') gehen(x[i]); } }
      else if (x && typeof x === 'object') Object.keys(x).forEach(k => { if (k === 'regional') return; if (typeof x[k] === 'string') x[k] = text(x[k]); else if (x[k] && typeof x[k] === 'object') gehen(x[k]); });
    };
    gehen(o);
  }
  texteAnpassen(D);
  // Ausbildungs-Hinweis im Endbild: kunde.js text leer = Satz aus dem Spiel (mit {firma})
  if (K.ausbildung && !K.ausbildung.text && D.rahmen.ausbildung) K.ausbildung.text = D.rahmen.ausbildung;

  // ---------- Test-Haken (Adresse) ----------
  // #stufe=meister  #einsatz=HK-03 (auch HK-03,HK-05,HK-10)  #variante=A  #figur=huber  #ende=856  #ruhig
  // #phase=diagnose|werkzeug|handgriff  #handgriff=Reinigen  #raster (alle Stellen/Verstecke beschriftet)  #los (Startbild überspringen)
  // Phase 3: #orte=HK,BA (nur diese Orte ziehen) bzw. #orte=fertig (nur Orte mit eingemessenen Raumbildern)
  // #zwischenfall (sicher einer, nach 3s Uhr) bzw. #zwischenfall=Z-02 (genau dieser) – #keinzwischenfall
  // #buch (Einsatzbuch-Ansicht, Zurück zum Menü)  #tier (Katze/Hund kommt nach 1s)
  const HASH = {};
  const hashLesen = (ziel) => { decodeURIComponent(location.hash.slice(1)).split(/[&#]/).forEach(t => { if (!t) return; const [k, v] = t.split('='); ziel[k.trim()] = v == null ? true : v.trim(); }); return ziel; };
  hashLesen(HASH);
  // Spielertest 25.10.2026: Wechsel nur im „#“ (z. B. von #buch zu #stufe=meister) lädt keine neue Seite – das Einsatzbuch blieb
  // offen und verdeckte „Los geht's“. Ändern sich Stufe oder Einsatzbuch, die Seite neu laden (Stufe/Bestwert hängen daran).
  addEventListener('hashchange', () => { const neu = hashLesen({}); if (neu.stufe !== HASH.stufe || !!neu.buch !== !!HASH.buch) location.reload(); });

  // ---------- Regeln ----------
  const STUFEN = {
    // ganzeListe: Geselle und Meister packen Hauptwerkzeug + „Dazu packen“, der Azubi nur das Hauptwerkzeug (MZ, 24.10.2026).
    // anzahl: das Spiel nennt die Zahl der Dinge (Geselle). rueckmeldung: sofort sagen, ob ein Teil passt (nicht beim Meister).
    // tempo: [voll bis, 0 ab] Sekunden – beim Meister großzügiger, weil er die ganze Liste selbst zusammenstellt (Vorschlag Supervisor)
    azubi: { name: 'Azubi', optionen: 3, tipp: true, m2: false, ganzeListe: false, anzahl: false, rueckmeldung: true, tempo: [60, 180] },
    geselle: { name: 'Geselle', optionen: 4, tipp: false, m2: false, ganzeListe: true, anzahl: true, rueckmeldung: true, tempo: [60, 180] },
    meister: { name: 'Meister', optionen: 5, tipp: false, m2: true, ganzeListe: true, anzahl: false, rueckmeldung: false, tempo: [90, 240] },
  };
  // Punkte (MZ, 24.10.2026): je Einsatz 333 = Ursache 150/75/25/0 + Werkzeug 60 (−20 je Fehlgriff) + Reparieren 60/30/10
  // + Tempo 63 (voll bis 60s, 0 ab 180s; Meister 90s/240s); Tipp −30; mindestens 1 Punkt.
  // Werkzeug (Spieltest MZ, 24.10.2026): je unnötig eingepacktes Teil −20, Meister zusätzlich je fehlendes Teil −20, nie unter 0;
  // Azubi wählt ein Teil der Packliste, das nicht das Hauptwerkzeug ist: Hinweis ohne Abzug.
  // Gesamt = Summe der Einsatz-Karten (QA 24.10.2026: nachrechenbar, kein Rundungsunterschied). Damit 1.000 erreichbar
  // ist, zählt der letzte Einsatz 334 (Tempo bis 64): 333 + 333 + 334 = 1.000.
  const P = { ursache: [150, 75, 25, 0], werkzeug: 60, fehlgriff: 20, reparieren: { genau: 60, ungenau: 30, anlauf2: 10 },
    tempo: 63, tempoVoll: 60, tempoNull: 180, tipp: 30, einsatz: 333 };
  const EINSAETZE = 3, STELLEN = [7, 9];   // antippbare Stellen je Einsatz (feste + aufgefüllt), höchstens 10
  const REST = 1000 - P.einsatz * EINSAETZE;   // 1 Punkt, den der letzte Einsatz mehr hat
  const einsatzMax = nr => P.einsatz + (nr === EINSAETZE ? REST : 0);
  const tempoMax = nr => P.tempo + (nr === EINSAETZE ? REST : 0);
  const BEWERTUNG = [[900, 0], [800, 1], [700, 2], [550, 3], [0, 4]];
  const firma = K.firma || '';
  const BUCH_KEY = 'mg:buch:rohrbruch:' + firma, STUFE_KEY = 'mg:stufe:rohrbruch:' + firma;
  const lesen = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const schreiben = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* privat */ } };
  let stufe = STUFEN[HASH.stufe] ? HASH.stufe : (STUFEN[lesen(STUFE_KEY)] ? lesen(STUFE_KEY) : 'azubi');
  schreiben(STUFE_KEY, stufe);
  const ST = () => STUFEN[stufe];

  // ---------- Hilfen ----------
  // Signale an das Tier im lebenden Hintergrund (leben.js, Developer A): 'gut', 'fehl', 'dunkel', 'hell', 'erledigt'
  const signal = n => { try { if (RB.leben && RB.leben.signal) RB.leben.signal(n); } catch (e) { /* Tier ist Beiwerk */ } };
  // Ton (klang.js, Phase 4): Effekt bzw. Szene (Musik/Raumgeräusche) – Ton ist Beiwerk, nie ein Fehler
  const ton = (n, o) => { try { return RB.klang ? RB.klang.ton(n, o) : null; } catch (e) { return null; } };
  const klangSzene = (n, o) => { try { if (RB.klang) RB.klang.szene(n, o); } catch (e) { /* egal */ } };
  const zufall = a => a[Math.floor(Math.random() * a.length)];
  function mischen(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  // Gedankenstrich immer mit geschütztem Leerzeichen davor (Textregel)
  const nb = t => String(t).replace(/ – /g, NBSP + '– ');
  function el(tag, klasse, text) { const e = document.createElement(tag); if (klasse) e.className = klasse; if (text != null) e.textContent = nb(RB.trenn(text)); return e; }
  function knopf(text, klasse, klick) { const b = el('button', 'rb-knopf ' + (klasse || ''), text); b.type = 'button'; if (klick) b.addEventListener('click', klick); return b; }
  // ---------- Fachbegriffe (Spielertest-Runde 25.10.2026, Abschnitt B; MZ „top so!“) ----------
  // MZ-Regel: Fachbegriffe werden nie ersetzt, nur erklärt. In Notizen, Lupe, Ursachen-Knöpfen und Packliste sind Begriffe aus
  // dem Glossar (glossar.js, erzeugt aus rohrbruch-glossar-entwurf.md) dezent gepunktet unterstrichen; Antippen öffnet ein kleines
  // Fenster mit Bauteil- bzw. Gegenstandsbild und einem Satz Alltagssprache. Erkennung: längster Treffer zuerst, ganze Wörter,
  // je Text jeder Begriff nur einmal; Begriffe bis 3 Zeichen (z. B. „CO“) nur in genauer Schreibweise.
  const GL = window.ROHRBRUCH_GLOSSAR || [];
  const glMap = new Map(), glKurz = new Set();
  let glRegex = null;
  (function () {
    const woerter = [];
    GL.forEach((g, i) => [g.b].concat(g.v || []).forEach(w => {
      w = String(w).replace(/\u00a0/g, ' ').trim();
      if (!w) return;
      glMap.set(w.toLowerCase(), i); woerter.push(w);
      if (w.length <= 3) glKurz.add(w);
    }));
    woerter.sort((a, b) => b.length - a.length);
    const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '[ \\u00a0]');
    // ohne Lookbehind (ältere iPhones): Zeichen davor als eigene Gruppe
    if (woerter.length) glRegex = new RegExp('(^|[^\\p{L}\\p{N}])(' + woerter.map(esc).join('|') + ')(?![\\p{L}\\p{N}])', 'giu');
  })();
  // Text → Fragment mit unterstrichenen Begriffen (Silbentrennung und geschütztes Leerzeichen wie el()); benutzt = Set je Text
  function fach(text, benutzt) {
    text = String(text == null ? '' : text);
    benutzt = benutzt || new Set();
    const frag = document.createDocumentFragment();
    const plain = t => { if (t) frag.append(document.createTextNode(nb(RB.trenn(t)))); };
    if (!glRegex) { plain(text); return frag; }
    let pos = 0, m;
    glRegex.lastIndex = 0;
    while ((m = glRegex.exec(text))) {
      const start = m.index + m[1].length, wort = m[2];
      if (!wort) { glRegex.lastIndex++; continue; }
      const i = glMap.get(wort.replace(/\u00a0/g, ' ').toLowerCase());
      // „Unterstreichen: nein“ (u: false, z. B. „bar“): bleibt normaler Text – der Treffer verhindert nur Teiltreffer
      if (i == null || benutzt.has(i) || GL[i].u === false || (wort.length <= 3 && !glKurz.has(wort))) continue;
      benutzt.add(i);
      plain(text.slice(pos, start));
      const sp = document.createElement('span');
      sp.className = 'rb-fachwort'; sp.dataset.gl = i; sp.tabIndex = 0; sp.setAttribute('role', 'button');
      sp.setAttribute('aria-label', wort + ' – Erklärung');
      sp.textContent = nb(RB.trenn(wort));
      frag.append(sp);
      pos = start + wort.length;
    }
    plain(text.slice(pos));
    return frag;
  }
  function fachEl(tag, klasse, text, benutzt) { const e = el(tag, klasse); e.append(fach(text, benutzt)); return e; }
  RB.fach = fach;   // Testhilfe
  // Erklärfenster am angetippten Wort (Uhr steht, solange es offen ist)
  let erklaerPop = null;
  function erklaerZu() { if (!erklaerPop) return; erklaerPop.remove(); erklaerPop = null; document.querySelectorAll('.rb-fachwort.offen').forEach(f => f.classList.remove('offen')); }
  function glossarBild(name) {
    if (!name) return null;
    const orte = [E && E.ort].concat(Object.keys(O)).filter(Boolean);
    for (const o of orte) {
      const b = O[o] && O[o].bauteile, z = b && b.stellen && b.stellen[name];
      if (!z) continue;
      const c = el('canvas', 'rb-erklaerbild'), blatt = b.blaetter[z[0]];
      const malen = () => { if (!c.isConnected) return; const { g, w, h } = RB.leinwand(c); g.clearRect(0, 0, w, h); RB.zelle(g, blatt, z[1], 3, 2, 0, 0, w, h, false); };
      requestAnimationFrame(malen); RB.bild(blatt).fertig.then(() => requestAnimationFrame(malen));
      return c;
    }
    if (RB.werkzeugZelle(name)) { const c = RB.werkzeugBild(name, 72); c.classList.add('rb-erklaerbild'); return c; }
    return null;
  }
  function erklaeren(f) {
    const g = GL[+f.dataset.gl];
    if (!g) return;
    const war = f.classList.contains('offen');
    erklaerZu();
    if (war) return;   // zweites Antippen schließt
    R_.ton('klick');
    erklaerPop = el('div', 'rb-erklaerpop'); erklaerPop.setAttribute('role', 'dialog'); erklaerPop.setAttribute('aria-label', g.b);
    const bild = glossarBild(g.bild);
    const txt = el('div', 'rb-erklaertext');
    txt.append(el('b', '', g.b), el('p', '', g.e));
    if (bild) erklaerPop.append(bild);
    erklaerPop.append(txt);
    erklaerPop.addEventListener('click', erklaerZu);
    document.body.append(erklaerPop);
    f.classList.add('offen');
    // Nachtest 25.10.2026: die Karte verdeckt den angetippten Knopf bzw. die Notiz nicht – unter dem ganzen Knopf, sonst darüber,
    // sonst (kein Platz) unter dem Wort; waagerecht am Wort, immer ganz im Bild
    const anker = f.closest('button, li, .rb-lupentext') || f;
    const r = f.getBoundingClientRect(), a = anker.getBoundingClientRect(), p = erklaerPop.getBoundingClientRect();
    const x = Math.max(8, Math.min(innerWidth - p.width - 8, r.left + r.width / 2 - p.width / 2));
    let y;
    if (a.bottom + 6 + p.height <= innerHeight - 8) y = a.bottom + 6;
    else if (a.top - 6 - p.height >= 8) y = a.top - 6 - p.height;
    else { y = r.bottom + 8; if (y + p.height > innerHeight - 8) y = Math.max(8, r.top - p.height - 8); }
    erklaerPop.style.left = x + 'px'; erklaerPop.style.top = y + 'px';
  }
  // Antippen eines Begriffs: nur erklären – der Knopf bzw. die Notiz darunter (Ursache wählen, Lupe öffnen) reagiert nicht
  document.addEventListener('click', e => {
    const f = e.target.closest && e.target.closest('.rb-fachwort');
    if (!f) return;
    e.preventDefault(); e.stopPropagation();
    erklaeren(f);
  }, true);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') return erklaerZu();
    const f = (e.key === 'Enter' || e.key === ' ') && e.target.closest && e.target.closest('.rb-fachwort');
    if (f) { e.preventDefault(); e.stopPropagation(); erklaeren(f); }
  }, true);
  // Nachtest 25.10.2026 (Claude Player: beim Schließen versehentlich eine Antwort gewählt): ist die Karte offen, schließt der erste
  // Tipp daneben NUR die Karte – Drücken und Klick dieses Tipps erreichen nichts darunter
  let erklaerSchlucken = 0;
  document.addEventListener('pointerdown', e => {
    if (!erklaerPop || erklaerPop.contains(e.target) || (e.target.closest && e.target.closest('.rb-fachwort'))) return;
    erklaerZu();
    e.preventDefault(); e.stopPropagation();
    erklaerSchlucken = performance.now() + 1500;
  }, true);
  ['pointerup', 'click'].forEach(typ => document.addEventListener(typ, e => {
    if (!erklaerSchlucken) return;
    if (performance.now() > erklaerSchlucken) { erklaerSchlucken = 0; return; }
    e.preventDefault(); e.stopPropagation();
    if (typ === 'click') erklaerSchlucken = 0;
  }, true));
  addEventListener('resize', erklaerZu);
  const minuten = s => { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') + NBSP + 'min'; };
  // normales Leerzeichen: der Rahmen trennt daran Zahl und Einheit („854“ groß, „Punkte“ klein)
  const punkteText = p => p.toLocaleString('de-DE') + ' Punkte';
  const buch = () => { try { return JSON.parse(lesen(BUCH_KEY) || '[]'); } catch (e) { return []; } };
  const BUCH_GESAMT = 100;   // Einsatzbuch: 100 Störungen insgesamt (10 Orte × 10)
  const figurBild = (name, nr) => `bilder/figur-${name}-${nr}.webp`;

  // Meister-Figur: Weste (#00FF00) in Hausfarbe umfärben, Logo als eigene Ebene auf der Brustfläche (figuren.js: logo)
  const meisterBilder = {};
  function meisterBild(nr) {
    if (meisterBilder[nr]) return meisterBilder[nr];
    meisterBilder[nr] = RB.bild(figurBild('meister', nr)).fertig.then(i => {
      if (!i) return figurBild('meister', nr);
      try { return R_.umfaerben(i).toDataURL('image/webp', 0.9); } catch (e) { return figurBild('meister', nr); }
    });
    return meisterBilder[nr];
  }

  // ---------- Seite aufbauen ----------
  document.body.insertAdjacentHTML('beforeend', `
    <div id="rb" hidden>
      <div class="rb-buehne">
        <div class="rb-raum">
          <img class="rb-raumbild" alt="">
          <div class="rb-overlays"></div>
          <canvas class="rb-effekte"></canvas>
          <div class="rb-tageszeit"></div>
          <div class="rb-aufkleber" hidden><img alt=""></div>
          <div class="rb-leben"></div>
          <div class="rb-marken"></div>
          <div class="rb-nah" hidden></div>
        </div>
        <div class="rb-leiste">
          <div class="rb-leistenkopf"><img class="rb-zeichen" alt=""><div><b class="rb-ortname"></b><span class="rb-kundename"></span></div></div>
          <p class="rb-aufgabe"></p>
          <div class="rb-aktionen"></div>
          <p class="rb-meldung" aria-live="polite"></p>
          <div class="rb-notizen" hidden><h3>Notizen</h3><ul></ul></div>
        </div>
      </div>
      <div class="rb-szene" hidden></div>
      <div class="rb-frage" hidden></div>
    </div>`);
  const $ = s => document.querySelector(s);
  const rb = $('#rb'), raum = $('.rb-raum'), raumbild = $('.rb-raumbild'), effekte = $('.rb-effekte'), marken = $('.rb-marken'),
    nah = $('.rb-nah'), szene = $('.rb-szene'), aufgabe = $('.rb-aufgabe'), aktionen = $('.rb-aktionen'), meldungEl = $('.rb-meldung'),
    notizen = $('.rb-notizen'), frage = $('.rb-frage'), leisteEl = $('.rb-leiste'),
    overlayEbene = $('.rb-overlays'), lebenEbene = $('.rb-leben');
  $('.rb-zeichen').src = K.zeichen || K.logoAufHell || '';
  $('.rb-zeichen').alt = firma;
  if (RB.ruhig) document.documentElement.classList.add('rb-ruhig');

  // Raumgröße: Handy hochkant Leiste darunter, quer/Rechner Leiste daneben
  function layout() {
    const Bw = innerWidth, Hh = innerHeight - 52, quer = Bw > Hh * 1.05;
    rb.classList.toggle('quer', quer);
    const s = quer ? Math.min(Hh - 8, Bw - 270) : Math.min(Bw - 12, Hh - 200);
    rb.style.setProperty('--raum', Math.max(200, Math.floor(s)) + 'px');
    nahPlatz();
  }
  // Kopfzeile neu wählen (Kurzform auf schmalen Bildschirmen) – lauf/E existieren erst nach dem Laden
  // Marken neu setzen (Gruppen hängen von der Raumgröße ab); eine offene Gruppen-Ansicht schließt
  addEventListener('resize', () => { layout(); if (lauf && E) { kopfzeile(); if (nah.classList.contains('gruppe')) nahWeg(); markenSetzen(); } });
  layout();

  // ---------- Durchgang ----------
  let lauf = null, E = null;   // E = aktueller Einsatz
  // Ortsname je Raum-Variante: Level-Titel „Büro | Praxis“ = A | B (Schlussrunde Texte, 24.10.2026)
  const ortName = (ort, variante) => { const n = String(D.orte[ort].name).split(' | '); return (variante === 'B' && n[1]) || n[0]; };
  // Orte für diesen Durchgang: #orte=HK,BA bzw. #orte=fertig (nur Orte mit echten Raumbildern in orte.js)
  function ortErlaubt(o) {
    if (!HASH.orte) return true;
    const l = String(HASH.orte).toUpperCase().split(',').map(x => x.trim());
    return l.includes('FERTIG') ? !!(O[o] && !O[o].platzhalter) : l.includes(o);
  }
  // Ort-Daten (daten-<ort>.js) nur bei Bedarf laden (Phase 3: daten.js je Ort aufgeteilt)
  const ortLaden = {};
  function ortHolen(o) {
    if (D.orte[o] && D.orte[o].vorrat) return Promise.resolve(true);
    if (ortLaden[o]) return ortLaden[o];
    return (ortLaden[o] = new Promise(ok => {
      const s = document.createElement('script');
      s.src = 'daten-' + o.toLowerCase() + '.js';
      s.onload = () => {
        const x = (window.ROHRBRUCH_ORT || {})[o];
        if (!x) return ok(false);
        texteAnpassen(x);
        const teil = Object.assign({}, x); delete teil.stoerungen;
        Object.assign(D.orte[o], teil);
        x.stoerungen.forEach(st => { if (!D.stoerungen.some(y => y.id === st.id)) D.stoerungen.push(st); });
        // noch kein Raumbild eingemessen: Platzhalter-Raum mit allen Stellen und Verstecken (platzhalter.js)
        if (!O[o]) O[o] = RB.platzhalterOrt(o, D.orte[o], x.stoerungen);
        ok(true);
      };
      s.onerror = () => ok(false);
      document.head.append(s);
    }));
  }
  // drei Einsätze aus drei verschiedenen Orten, Störung passend zur Stufe (Katalog in daten.js); nur wenn weniger als drei
  // Orte erlaubt sind (#orte=HK), kommt ein Ort mehrfach dran. nurOrte: offline nur diese Orte (Daten liegen schon vor)
  function idsZiehen(nurOrte) {
    const kat = D.katalog.filter(k => k.stufen.includes(stufe) && ortErlaubt(k.ort) && (!nurOrte || nurOrte.includes(k.ort)));
    const ids = [];
    if (HASH.einsatz) String(HASH.einsatz).split(',').map(x => x.trim().toUpperCase()).forEach(id => { if (D.katalog.some(k => k.id === id) && ids.length < EINSAETZE) ids.push(id); });
    const frei = mischen([...new Set(kat.map(k => k.ort))]).filter(o => !ids.some(id => id.slice(0, 2) === o));
    while (ids.length < EINSAETZE) {
      const o = frei.length ? frei.shift() : zufall([...new Set(kat.filter(k => !ids.includes(k.id)).map(k => k.ort))]);
      const wahl = kat.filter(k => k.ort === o && !ids.includes(k.id));
      if (!o || !wahl.length) break;
      ids.push(zufall(wahl).id);
    }
    return ids;
  }
  // Ohne Verbindung (navigator.onLine false) nur Einsätze, deren Dateien schon im Zwischenspeicher liegen (Service Worker):
  // Orte mit geladenen bzw. abgelegten Daten, bis zu 25 Würfe, bis alle Dateien da sind – sonst der letzte Wurf
  const imSpeicher = u => (window.caches ? caches.match(new URL(u, location.href).href, { ignoreSearch: true }) : Promise.resolve(null)).catch(() => null);
  async function offlineOrte() {
    const alle = Object.keys(D.orte);
    const da = await Promise.all(alle.map(o => (D.orte[o].vorrat ? Promise.resolve(true) : imSpeicher('daten-' + o.toLowerCase() + '.js'))));
    return alle.filter((o, i) => da[i]);
  }
  // Einsätze (Variante, Figur, Verstecke, Zwischenfall) gleich mit anlegen – so steht fest, welche Dateien der Durchgang
  // braucht, und sie können schon abgelegt werden (offline, QA Phase 4)
  function planen() {
    const plan = { stufe, abgelegt: false };
    plan.fertig = (async () => {
      const offline = navigator.onLine === false && !!window.caches && location.protocol !== 'file:';
      const nurOrte = offline ? await offlineOrte() : null;
      let einsaetze = [], bester = null;
      for (let versuch = 0; versuch < (offline ? 40 : 1); versuch++) {
        const ids = idsZiehen(nurOrte && nurOrte.length ? nurOrte : null);
        await Promise.all([...new Set(ids.map(id => id.slice(0, 2)))].map(ortHolen));
        const liste = ids.map(id => D.stoerungen.find(s => s.id === id)).filter(Boolean);
        const benutzt = [];   // dieselbe Figur möglichst nicht zweimal in einem Durchgang
        einsaetze = liste.map((st, i) => { const e = einsatzAnlegen(st, i, benutzt); benutzt.push(e.figur); return e; });
        zwischenfallPlanen(einsaetze);
        plan.ids = ids;
        if (!offline) break;
        // fehlende Dateien zählen; ein fehlendes Raumbild wiegt schwer (Raum ohne Bild), Figur oder Lupenblatt weniger
        const dateien = durchgangDateien(einsaetze), da = await Promise.all(dateien.map(imSpeicher));
        const fehlt = dateien.reduce((n, u, i) => n + (da[i] ? 0 : /\/raum-|daten-/.test(u) ? 100 : 1), 0);
        if (!bester || fehlt < bester.fehlt) bester = { fehlt, einsaetze, ids };
        if (!fehlt) break;
      }
      if (bester) { einsaetze = bester.einsaetze; plan.ids = bester.ids; }
      plan.einsaetze = einsaetze;
      return einsaetze;
    })();
    return plan;
  }
  // Offline (QA Phase 4, S2): alles, was die drei Einsätze brauchen, im Service Worker ablegen – Raumbild der gezogenen Variante,
  // Overlays, Lupen-Blätter der Stellen, Gegenstands-Blätter (Packliste, Koffer, Transporter, Ablenker, Zwischenfall), Figuren,
  // Tier-Posen, gemeinsame Bilder, Raumgeräusche inkl. seltener Ereignisse, Effekte, Musik. Der Service Worker lädt nur, was
  // noch fehlt. Ohne Service Worker (file://, alter Browser) passiert nichts.
  function durchgangAblegen(plan) {
    if (plan.abgelegt) return;
    plan.abgelegt = true;
    plan.fertig.then(einsaetze => {
      const sw = navigator.serviceWorker;
      if (!sw || location.protocol === 'file:') return;
      const liste = durchgangDateien(einsaetze);
      sw.ready.then(reg => { if (reg.active) reg.active.postMessage({ typ: 'ablegen', dateien: liste }); }).catch(() => {});
      RB.abgelegt = liste;   // Testhilfe
    }).catch(() => {});
  }
  function durchgangDateien(einsaetze) {
    const d = new Set(), dazu = u => { if (u) d.add(new URL(String(u).replace(/#gruen$/, ''), location.href).href); };
    const namen = new Set(['Hundekekse']);
    const tierPosen = t => { if (t && RB.TIERE && RB.TIERE[t]) Object.keys(RB.TIERE[t].posen).forEach(p => dazu(RB.tierBild(t, p))); };
    einsaetze.forEach(e => {
      dazu('daten-' + e.ort.toLowerCase() + '.js');
      dazu(e.V.bild);
      Object.values(e.V.overlays || {}).forEach(o => dazu(o && o.bild));
      const b = O[e.ort].bauteile;
      if (b && b.stellen) e.stellen.forEach(s => {
        const z = b.stellen[s.name], z2 = b.zweite && b.zweite[s.name];
        if (z) dazu(b.blaetter[z[0]]);
        if (z2 && s.anzeige && +s.anzeige.bild === 2) dazu(b.blaetter[z2[0]]);
      });
      [1, 2, 3].forEach(n => dazu(figurBild(e.figur, n)));
      if (RB.tierDateien) RB.tierDateien(e.figur, e.V).forEach(dazu); else tierPosen(RB.tierFuer && RB.tierFuer(e.figur, e.V));
      // Gegenstände: Packliste, Inhalt von Koffer und Transporter (hier schon gewürfelt), Funde in den Verstecken
      e.packliste.forEach(p => namen.add(p.name));
      ['koffer', 'transporter'].forEach(wo => lagerInhalt(wo, e).forEach(n => namen.add(n)));
      Object.values(e.verstecke).forEach(v => { if (v) namen.add(v.name); });
      if (e.zwischenfall) {
        const g = zwName(e.zwischenfall.gegenstand);
        dazu('bilder/zwischenfall.webp');
        namen.add(ZW_MOTIV[g] || g);
        tierPosen(zwTier(e.zwischenfall.gegenstand));
        if (e.zwischenfall.figur && D.figuren[e.zwischenfall.figur]) [1, 2, 3].forEach(n => dazu(figurBild(e.zwischenfall.figur, n)));
      }
    });
    // gestaltete Motive (Handgriff-Runde 25.10.2026): Wasser, Beläge, Bedienteile – nur, was die drei Einsätze brauchen
    const SPB = window.RB_SPRITES || {}, blatt = n => SPB[n] && dazu(SPB[n].bild);
    einsaetze.forEach(e => {
      const zust = e.stellen.map(s => (s.anzeige || {}).zustand);
      const arten = [e.st.handgriff && e.st.handgriff.art].concat(e.m2 && e.st.m2 && e.st.m2.handgriff ? [e.st.m2.handgriff.art] : []);
      const leben = e.V.leben || {};   // Tropfen des lebenden Hintergrunds (GW, HA: Standard aus leben.js)
      if (zust.some(z => z === 'nass' || z === 'tropft') || arten.some(a => /Entlüften|Abfluss/.test(a)) || /^(GW|HA)$/.test(e.ort) || (leben.tropfen || []).length) blatt('wasser');
      let reinigenOhneBild = false;
      blatt('bedienteile-1');   // Entstör-Taste (fast jeder Einsatz), Drehknöpfe, Zeitschaltuhr
      if (arten.some(a => /Abfluss|Nachziehen|Reinigen/.test(a)) || e.st.entstoeren || arten.some(a => /Entstören/.test(a || ''))) blatt('bedienteile-2');
      if (arten.includes('Reinigen')) {   // nur die Schmutz-Blätter der Bauteile dieses Einsatzes (schmutz.js ROHRBRUCH_SCHMUTZ)
        const B = O[e.ort].bauteile, SM = window.ROHRBRUCH_SCHMUTZ || {};
        let gefunden = false;
        Object.keys(B.stellen).filter(n => e.stellen.some(s => s.name === n) || String((e.st.handgriff.param || {}).objekt || '').includes(n))
          .forEach(n => { const z = B.stellen[n], sm = SM[B.blaetter[z[0]] + '|' + z[1]]; if (sm) { dazu(sm[0]); gefunden = true; } });
        reinigenOhneBild = !gefunden;
      }
      // Beläge-Texturen: Zustände in der Lupe, Reinigen ohne gestaltete Schmutz-Fassung (Ersatz)
      if (zust.some(z => RB.BELAG && RB.BELAG[z]) || reinigenOhneBild) blatt('texturen');
    });
    namen.forEach(n => {
      if (RB.EINZELBILDER && RB.EINZELBILDER[n]) return dazu(RB.EINZELBILDER[n]);
      const z = RB.werkzeugZelle(n); if (z) dazu(z.b.blatt);
    });
    // gemeinsam (Kundendaten können andere Dateien nennen)
    ['bilder/startbild.webp', 'bilder/koffer.webp', 'bilder/transporter.webp', K.transporterSeite || 'bilder/transporter-seite.webp',
      K.logo, K.logoAufHell, K.logoQuer, K.zeichen, K.zeichenWeiss, K.ausbildung && K.ausbildung.bild].forEach(dazu);
    (RB.fahrtNaechste ? RB.fahrtNaechste(einsaetze.length) : K.firmenbilder || []).forEach(dazu);   // Übergänge: die nächsten Firmenbilder
    [1, 2, 3].forEach(n => dazu(figurBild('meister', n)));
    if (RB.klang && RB.klang.dateien) RB.klang.dateien(einsaetze.map(e => e.ort)).forEach(dazu);
    return [...d];
  }
  let vorplan = null;   // schon beim Startbild planen und laden, damit „Los geht's“ sofort startet
  function neuerLauf() {
    const plan = vorplan && vorplan.stufe === stufe ? vorplan : planen();
    vorplan = null;
    durchgangAblegen(plan);
    return plan.fertig.then(einsaetze => {
      try { if (RB.klang) RB.klang.orteVorladen(einsaetze.map(e => e.ort)); } catch (e) { /* egal */ }
      return { einsaetze, nr: -1, ergebnisse: [], start: performance.now() };
    });
  }
  function einsatzAnlegen(st, i, benutzt) {
    const ort = O[st.ort], oT = D.orte[st.ort];
    const varianten = st.varianten.filter(v => ort.varianten[v]);
    const variante = HASH.variante && varianten.includes(HASH.variante.toUpperCase()) ? HASH.variante.toUpperCase() : zufall(varianten);
    const V = ort.varianten[variante];
    // Figur, die zu Ort und Variante passt
    const passend = Object.keys(D.figuren).filter(k => (D.figuren[k].orte[st.ort] || []).includes(variante));
    const frisch = passend.filter(k => !(benutzt || []).includes(k));
    const figur = HASH.figur && D.figuren[HASH.figur] ? HASH.figur : zufall(frisch.length ? frisch : passend.length ? passend : Object.keys(D.figuren));
    const m2 = ST().m2 && !!st.m2;
    // Stellen: feste Stellen der Störung (M2 nur im Meister-Modus) + aus dem Vorrat aufgefüllt
    const stellen = [];
    const hinzu = (s, quelle) => { if (!V.stellen[s.name] || stellen.some(x => x.name === s.name)) return; stellen.push(Object.assign({ quelle, untersucht: false }, s)); };
    st.stellen.forEach(s => hinzu(s, 'fest'));
    if (m2) st.m2.stellen.forEach(s => hinzu(s, 'm2'));
    const ziel = Math.min(10, Math.max(stellen.length + 1, STELLEN[0] + Math.floor(Math.random() * (STELLEN[1] - STELLEN[0] + 1))));
    // Was in dieser Störung gesucht und eingepackt wird, kommt nie als Untersuchungs-Stelle aus dem Vorrat (BU-08: Fernbedienung)
    const gesucht = [st.werkzeug].concat(st.dazu || [], m2 ? [st.m2.werkzeug].concat(st.m2.dazu || []) : []).filter(Boolean).map(w => w.name);
    mischen(oT.vorrat.filter(v => (!v.nur || v.nur === variante) && V.stellen[v.name] && !gesucht.includes(v.name))).forEach(v => {
      if (stellen.length >= ziel) return;
      hinzu({ name: v.name, text: zufall(v.texte), anzeige: v.anzeige, befund: false }, 'vorrat');
    });
    // Packliste (MZ, 24.10.2026): Hauptwerkzeug + „Dazu packen“ (1–5 Dinge), bei zwei Ursachen (Meister) auch die der zweiten
    const packliste = [];
    const aufListe = (w, haupt, fuer) => {
      if (!w || !w.name) return;
      const da = packliste.find(x => x.name === w.name);
      if (da) { da.haupt = da.haupt || haupt; return; }
      packliste.push({ name: w.name, herkunft: w.herkunft || 'koffer', haupt, fuer });
    };
    aufListe(st.werkzeug, true, 'haupt');
    (st.dazu || []).forEach(w => aufListe(w, false, 'haupt'));
    if (m2) { aufListe(st.m2.werkzeug, true, 'm2'); (st.m2.dazu || []).forEach(w => aufListe(w, false, 'm2')); }
    // was mit muss: Azubi nur das Hauptwerkzeug, Geselle und Meister die ganze Liste
    const brauche = ST().ganzeListe ? packliste.slice() : packliste.filter(p => p.haupt);
    // Verstecke im Raum, je Einsatz neu gewürfelt: Dinge der Packliste mit Herkunft „Raum“ + 1–2 Ablenker des Orts (passend
    // zur Variante), Rest leer. Mindestens ein Versteck bleibt leer, mindestens eins enthält etwas (MZ, 24.10.2026).
    const versteckNamen = oT.verstecke.filter(v => v.varianten.includes(variante) && V.verstecke[v.name]).map(v => v.name);
    const verstecke = {};   // Versteck → null | { name, art: 'pack' | 'ablenker', witzig, genommen }
    versteckNamen.forEach(n => { verstecke[n] = null; });
    const frei = mischen(versteckNamen);
    // Heißt ein Versteck nach einem Gegenstand der Packliste („Eimer in der Ecke“ + Eimer), liegt genau dieser dort (QA 24.10.2026)
    const woerter = n => n.toLowerCase().split(/[\s,–-]+/);
    packliste.filter(p => p.herkunft === 'raum').forEach(p => {
      const v = frei.find(n => woerter(n).includes(p.name.toLowerCase()));
      if (v && frei.length > 1) { verstecke[v] = { name: p.name, art: 'pack' }; frei.splice(frei.indexOf(v), 1); p.platziert = true; }
    });
    packliste.filter(p => p.herkunft === 'raum' && !p.platziert).forEach(p => {
      if (frei.length > 1) verstecke[frei.shift()] = { name: p.name, art: 'pack' };
      else p.herkunft = 'koffer';   // zu wenig Verstecke: liegt dann im Koffer
    });
    const belegt = Object.values(verstecke).filter(Boolean).length;
    // Ablenker; die übrigen bleiben als Ersatz, falls der Zwischenfall des Durchgangs denselben Gegenstand braucht (zwAblenkerWeg)
    const ablenker = mischen((oT.ablenker || []).filter(a => (a.varianten || ['A', 'B']).includes(variante) && !packliste.some(p => p.name === a.name)));
    const nAbl = Math.min(Math.random() < 0.5 ? 1 : 2, Math.max(belegt ? 0 : 1, frei.length - 1));
    ablenker.slice(0, nAbl).forEach(a => { const v = frei.shift(); if (v) verstecke[v] = { name: a.name, art: 'ablenker', witzig: a.witzig || '' }; });
    return { nr: i + 1, st, ort: st.ort, variante, V, figur, m2, stellen, packliste, brauche, verstecke, eingepackt: [], falschGenommen: [],
      ablenkerRest: ablenker.slice(nAbl),
      zwischenfall: null, zwAb: HASH.zwischenfall ? 3 : 10 + Math.random() * 30, ortName: ortName(st.ort, variante),
      nebenbei: [], besucht: [], raumSuche: false, phase: 'titel',
      zeit: 0, fehlDiag: 0, loesungGezeigt: false, fehlWerk: 0, tipp: false, rep: {}, leereVerstecke: 0, fehlgriffGesagt: false, richtigGefunden: [] };
  }

  // ---------- Uhr (steht bei Titel, Fahrt, Zwischenfall und beim Lesen von Dialogen) ----------
  const UHR_PHASEN = ['untersuchen', 'diagnose', 'werkzeug', 'handgriff'];
  function uhrLaeuft() { return E && UHR_PHASEN.includes(E.phase) && szene.hidden && frage.hidden && !erklaerPop; }

  // ---------- Anzeige oben ----------
  function kopfzeile() {
    if (!lauf || !E) return R_.anzeige('', '');
    const summe = lauf.ergebnisse.reduce((s, e) => s + e.summe, 0);
    const links = `Einsatz ${E.nr}/${EINSAETZE}`, mitPunkten = lauf.ergebnisse.length > 0;
    // Schmale Handys (320 px): passt „Einsatz 1/3“ neben „313 Punkte“ nicht, steht rechts die Kurzform „313 Pkt.“
    // (geprüft mit dem längsten Stand „1.000“, damit die Kopfzeile nicht mitten im Spiel umspringt; gemeinsam/ bleibt unverändert)
    let rechts = mitPunkten ? punkteText(summe) : ST().name;
    if (mitPunkten) {
      R_.anzeige(links, punkteText(1000));
      const l = document.querySelector('#anzeige .links');
      if (l && l.scrollWidth > l.clientWidth + 1) rechts = summe.toLocaleString('de-DE') + NBSP + 'Pkt.';
    }
    R_.anzeige(links, rechts);
  }

  // ---------- Szene (ganzer Bildschirm): Titel, Funk, Kundin, Meister, Einsatzbuch ----------
  let szeneWeiter = null;
  function szeneZeigen(klasse, inhalt, weiter) {
    szene.className = 'rb-szene ' + klasse;
    szene.textContent = '';
    inhalt.forEach(x => szene.append(x));
    // Einblendungen (Level-Titel, Werkzeug-Frage, Zwischenfall-Titel): sichtbarer „Weiter“-Knopf darunter – man sieht sofort,
    // dass Tippen weiterführt, statt 2–3s zu warten (Spielertest 25.10.2026)
    if (weiter && /^titel/.test(klasse)) szene.append(knopf('Weiter', 'rb-szeneweiter', () => { if (szeneWeiter === weiter) weiter(); }));
    szene.hidden = false;
    szeneWeiter = weiter || null;
  }
  function szeneWeg() { szene.hidden = true; szene.textContent = ''; szeneWeiter = null; }
  szene.addEventListener('click', e => { if (szeneWeiter && !e.target.closest('button, a')) { const f = szeneWeiter; f(); } });

  // Level-Titel 2,5s, Tippen überspringt (MZ, 22.10.2026)
  function levelTitel(weiter) {
    E.phase = 'titel';
    klangSzene('titel');
    const t = el('div', 'rb-titel');
    t.append(el('small', '', ST().name), el('strong', '', D.rahmen.levelTitel.replace('{n}', E.nr).replace('{ort}', E.ortName)));
    let fertig = false;
    const los = () => { if (fertig) return; fertig = true; clearTimeout(uhr); szeneWeg(); weiter(); };
    const uhr = setTimeout(los, RB.ruhig ? 1200 : 2600);
    szeneZeigen('titel', [t], los);
  }

  // Übergang (Phase 3, MZ 25.10.2026 statt Karte): Transporter fährt seitlich durchs Bild, darunter der Funkspruch des
  // Meisters; Uhr steht, Tippen überspringt (fahrt.js)
  function funkspruch(weiter) {
    E.phase = 'fahrt';
    klangSzene('fahrt');
    const f = D.figuren[E.figur];
    const saetze = [];
    if (E.nr > 1 && D.meister.fahrt.length) saetze.push(zufall(D.meister.fahrt));
    saetze.push(zufall(D.orte[E.ort].funk).replace('{figur}', f.name));
    const fahrt = RB.fahrtBauen({ saetze, ziel: f.name + ' – ' + E.ortName,
      meister: { name: (K.meister && K.meister.name) || D.meister.name, bild: meisterBild(2) } });
    let fertig = false;
    const los = () => { if (fertig) return; fertig = true; szeneWeg(); weiter(); };
    szeneZeigen('fahrt', [fahrt.hg, fahrt.el].filter(Boolean), () => fahrt.ueberspringen());
    // „Weiter“ gleich sichtbar (Spielertest 25.10.2026) – Tippen irgendwo geht weiterhin
    const funkBox = fahrt.el.querySelector('.rb-fahrtfunk');
    if (funkBox) funkBox.append(knopf('Weiter', 'haupt rb-fahrtweiter', () => fahrt.ueberspringen()));
    fahrt.start(los);
    ton('funk', { verzoegerung: RB.ruhig ? 0 : 0.3 });   // Funk-Piep, wenn der Funkspruch erscheint
  }

  // Kundin/Kunde oder Meister mit Sprechblasen. saetze = [{ text, stimmung (1–3) }]; fertigText = Knopf am Ende
  function gespraech(wer, saetze, fertigText, weiter) {
    const meister = wer === 'meister';
    const name = meister ? ((K.meister && K.meister.name) || D.meister.name) : D.figuren[wer].name;
    const hg = el('div', 'rb-hg'); hg.style.backgroundImage = `url("${E.V.bild}")`;
    const platz = el('div', 'rb-figurplatz' + (meister ? ' meister' : ''));
    const fig = el('img', 'rb-figur'); fig.alt = name;
    platz.append(fig);
    let logo = null;
    if (meister && FIG.meister) {
      logo = el('img', 'rb-westenlogo'); logo.alt = ''; logo.src = K.zeichenWeiss || K.logo; platz.append(logo);
    }
    const spalte = el('div', 'rb-blasen'), liste = el('div', 'rb-blasenliste');
    spalte.append(el('div', 'rb-name', name), liste);
    const b = knopf('Weiter', 'haupt rb-weiter');
    spalte.append(b);
    let i = -1;
    function stimmung(nr) {
      if (meister) {
        meisterBild(nr).then(u => { fig.src = u; });
        const m = FIG.meister && FIG.meister[nr - 1];
        if (m && m.logo && logo) {   // Logo-Ebene auf der Brustfläche (Anteile der Figurgröße)
          const [x, y, w, h] = m.logo;
          Object.assign(logo.style, { left: x * 100 + '%', top: y * 100 + '%', width: w * 100 + '%', height: h * 100 + '%' });
          platz.style.setProperty('--seite', m.w / m.h);
        }
      } else fig.src = figurBild(wer, nr);
      const m = FIG[meister ? 'meister' : wer]; if (m && m[nr - 1]) platz.style.setProperty('--seite', m[nr - 1].w / m[nr - 1].h);
    }
    function naechste() {
      i++;
      if (i >= saetze.length) { szeneWeg(); weiter(); return; }
      const s = saetze[i];
      stimmung(s.stimmung || 2);
      const blase = el('div', 'blase', s.text);
      liste.append(blase);
      while (liste.children.length > 3) liste.firstChild.remove();
      b.textContent = i === saetze.length - 1 ? fertigText : 'Weiter';
      b.focus({ preventScroll: true });
    }
    b.addEventListener('click', naechste);
    szeneZeigen('gespraech' + (meister ? ' meister' : ''), [hg, platz, spalte], naechste);
    naechste();
  }

  function kundinBegruesst() {
    E.phase = 'kunde';
    klangSzene('raum', E.ort);
    const f = D.figuren[E.figur], st = E.st;
    // Kaninchen-Runde (MZ 25.10.2026): bei Herrn Brandl mit Eleonore im Garten eigene falsche Vermutungen (WP-06, WP-09)
    const falsch = st.vermutungFalschEleonore && RB.tierFuer && RB.tierFuer(E.figur, E.V) === 'eleonore' ? st.vermutungFalschEleonore : st.vermutungFalsch;
    const verm = zufall([st.vermutungRichtig].concat(falsch));
    const saetze = [{ text: zufall(f.begruessung), stimmung: 2 }]
      .concat(st.schilderung.map(t => ({ text: t, stimmung: 1 })))
      .concat([{ text: verm, stimmung: 2 }]);
    gespraech(E.figur, saetze, 'Ich schau mir das an', untersuchen);
  }

  // ---------- Raum ----------
  function raumAufbauen() {
    raumbild.src = E.V.bild;
    raum.querySelectorAll('.rb-zwraum, .rb-zwzone, .rb-zwverdeck').forEach(x => x.remove());   // Reste eines abgebrochenen Zwischenfalls
    $('.rb-ortname').textContent = E.ortName;
    // Raum-Overlays (bild=2 an einer Raumstelle, z. B. WZ-03 bodenlanger Vorhang): eigenes Bild über dem Raumbild
    overlayEbene.textContent = '';
    E.stellen.filter(s => s.anzeige && +s.anzeige.bild === 2).forEach(s => {
      const ov = E.V.overlays && E.V.overlays[s.name];
      if (!ov || !ov.bild) return;
      const i = el('img', 'rb-overlay'); i.alt = ''; i.src = ov.bild;
      const [x0, y0, x1, y1] = ov.rechteck || [0, 0, 1024, 1024];
      Object.assign(i.style, { left: x0 / 10.24 + '%', top: y0 / 10.24 + '%', width: (x1 - x0) / 10.24 + '%', height: (y1 - y0) / 10.24 + '%' });
      overlayEbene.append(i);
    });
    // lebender Hintergrund: Tageszeit-Tönung, Licht/Dampf/Tropfen, Katze bzw. Hund (leben.js)
    RB.leben.start({ raum, ebene: lebenEbene, ort: E.ort, V: E.V, figur: E.figur, nr: E.nr, tiere: D.tiere,
      sichtbar: () => !rb.hidden && szene.hidden && nah.hidden && E && E.phase !== 'zwischenfall' });
    $('.rb-kundename').textContent = D.figuren[E.figur].name;
    // Kundendienst-Aufkleber mit Logo am Kessel (eigene Ebene, nicht eingebrannt)
    const a = O[E.ort].aufkleber && O[E.ort].aufkleber[E.variante], auf = $('.rb-aufkleber');
    auf.hidden = !a;
    if (a) {
      const xs = a.map(p => p[0]), ys = a.map(p => p[1]);
      Object.assign(auf.style, { left: Math.min(...xs) / 10.24 + '%', top: Math.min(...ys) / 10.24 + '%',
        width: (Math.max(...xs) - Math.min(...xs)) / 10.24 + '%', height: (Math.max(...ys) - Math.min(...ys)) / 10.24 + '%' });
      auf.querySelector('img').src = K.logoAufHell || K.logo;
    }
    notizen.querySelector('ul').textContent = '';
    notizBenutzt = new Set();
    notizen.hidden = true;
    markenSetzen();
  }
  // Marken (QA Phase 3): liegen Marken so eng, dass sie sich berühren würden (Abstand < 1,05 × Markengröße – auf Handys
  // ca. 34 px), zeigt der Raum eine Gruppen-Marke (zwei versetzte Lupen- bzw. Hand-Zeichen, ohne Ziffer – MZ 25.10.2026;
  // Zeichen und Ring: rohrbruch.css „Marken im Raum“). Antippen öffnet einen vergrößerten Bildausschnitt, in dem
  // die Marken einzeln und getrennt liegen. Marken bleiben ganz im Raum (S3.8). Bei Überlappung gewinnt die nächste Marke.
  function markenSetzen() {
    marken.textContent = '';
    const phase = E.phase;
    if (HASH.raster) {
      Object.entries(E.V.stellen).forEach(([n, p]) => marke(n, p, 'stelle raster', () => {}));
      Object.entries(E.V.verstecke).forEach(([n, p]) => marke(n, p, 'versteck raster', () => {}));
      return;
    }
    let liste = [], art = '';
    if (phase === 'untersuchen' || phase === 'diagnose') {
      art = 'stelle';
      liste = E.stellen.filter(s => E.V.stellen[s.name]).map(s => ({ name: s.name, p: E.V.stellen[s.name], erledigt: !!s.untersucht, klick: () => lupe(s) }));
    } else if (phase === 'werkzeug' && E.raumSuche) {
      // Verstecke erst nach „Im Raum suchen“ und mit eigenem Zeichen (Hand im abgerundeten Quadrat), damit sie nicht wie die
      // Untersuchungs-Stellen aussehen (MZ, 24.10.2026)
      art = 'versteck';
      liste = Object.keys(E.verstecke).filter(n => E.V.verstecke[n]).map(n => ({ name: n, p: E.V.verstecke[n], erledigt: E.besucht.includes(n), klick: () => versteck(n) }));
    }
    if (!liste.length) return;
    const S = raum.clientWidth || 300, ms = markenGroesse();
    const halb = ms / 2 + 3, px = v => Math.max(halb, Math.min(S - halb, v / 1024 * S));
    liste.forEach(m => { m.x = px(m.p[0]); m.y = px(m.p[1]); });
    if (art === 'stelle') effekteFreihalten(liste, S, halb);
    // Gruppen: alle Marken, die über eine Kette zu enger Nachbarn verbunden sind
    const gruppe = liste.map((_, i) => i);
    const wurzel = i => { while (gruppe[i] !== i) i = gruppe[i] = gruppe[gruppe[i]]; return i; };
    const ENG = ms * 1.05;   // Marken dürfen sich nicht berühren
    for (let i = 0; i < liste.length; i++) for (let j = i + 1; j < liste.length; j++) {
      if (Math.hypot(liste[i].x - liste[j].x, liste[i].y - liste[j].y) < ENG) gruppe[wurzel(i)] = wurzel(j);
    }
    // Gruppen-Marke sitzt in der Mitte ihrer Gruppe – liegt sie dadurch zu nah an einer anderen Marke, Gruppen zusammenlegen
    let gruppen;
    for (let runde = 0; runde < 10; runde++) {
      gruppen = {};
      liste.forEach((m, i) => (gruppen[wurzel(i)] = gruppen[wurzel(i)] || []).push(m));
      const p = Object.entries(gruppen).map(([w, g]) => [+w, g.reduce((a, m) => a + m.x, 0) / g.length, g.reduce((a, m) => a + m.y, 0) / g.length]);
      let neu = false;
      for (let i = 0; i < p.length; i++) for (let j = i + 1; j < p.length; j++) {
        if (Math.hypot(p[i][1] - p[j][1], p[i][2] - p[j][2]) < ENG && wurzel(p[i][0]) !== wurzel(p[j][0])) { gruppe[wurzel(p[i][0])] = wurzel(p[j][0]); neu = true; }
      }
      if (!neu) break;
    }
    gruppen = {};
    liste.forEach((m, i) => (gruppen[wurzel(i)] = gruppen[wurzel(i)] || []).push(m));
    Object.values(gruppen).forEach((g, i) => {
      let b;
      if (g.length === 1) b = marke(g[0].name, null, art + (g[0].erledigt ? ' erledigt' : ''), g[0].klick, [g[0].x, g[0].y]);
      else {
        const x = g.reduce((a, m) => a + m.x, 0) / g.length, y = g.reduce((a, m) => a + m.y, 0) / g.length;
        const fertig = g.filter(m => m.erledigt).length;
        b = marke(g.map(m => m.name).join(', '), null, art + ' gruppe' + (fertig === g.length ? ' erledigt' : fertig ? ' teil' : ''), () => gruppeOeffnen(g, art), [x, y]);
        // ohne Ziffer: zwei leicht versetzte Zeichen (MZ, 25.10.2026, Variante 2)
        b.append(el('span', 'kachel hinten'), el('span', 'kachel vorn'));
        b.setAttribute('aria-label', g.length + ' Stellen: ' + g.map(m => m.name).join(', '));
      }
      b.style.animationDelay = (RB.ruhig ? 0 : (art === 'stelle' ? 0.08 : 0.06) * i) + 's';
    });
  }
  // Fehlercode im Geräte-Display und Tropfen-Quellen bleiben sichtbar (Handgriff-Runde, R1/R3): liegt eine Lupen-Marke darauf,
  // rückt sie senkrecht daneben – nach oben, wenn die Stelle über der Mitte des Hinweises liegt, sonst nach unten.
  function effekteFreihalten(liste, S, halb) {
    const k = S / 1024, frei = [];
    E.stellen.forEach(s => {
      const p = E.V.stellen[s.name], a = s.anzeige || {};
      if (!p) return;
      const dr = (E.V.displays && E.V.displays[s.name]) || (s.name === 'Kessel-Display' && E.V.display);
      if (dr && typeof a.display === 'string') frei.push(dr);
      // Tropfen: Quelle und erstes Stück der Fallstrecke frei (QA S2: GW-09 teils verdeckt)
      if (a.zustand === 'tropft') { const [x, y, yb] = wasserOrt(s.name, 'tropft', p).tropfen; frei.push([x - 18, y - 6, x + 18, Math.min(yb || y + 70, y + 70)]); }
    });
    if (!frei.length) return;
    liste.forEach(m => {
      frei.forEach(([x0, y0, x1, y1]) => {
        const r = [x0 * k - 3, y0 * k - 3, x1 * k + 3, y1 * k + 3];
        const nx = Math.max(r[0], Math.min(m.x, r[2])), ny = Math.max(r[1], Math.min(m.y, r[3]));
        if (Math.hypot(m.x - nx, m.y - ny) >= halb) return;   // berührt nicht
        const oben = r[1] - halb + 2, unten = r[3] + halb - 2;
        m.y = (m.y < (r[1] + r[3]) / 2 && oben > halb) || unten > S - halb ? oben : unten;
      });
    });
  }
  const markenGroesse = () => Math.max(32, (raum.clientWidth || 300) * 0.072);
  // p = Bildpunkt (0–1024), sonst xy = Pixel im Raum
  function marke(name, p, klasse, klick, xy) {
    const b = el('button', 'rb-marke ' + klasse);
    b.type = 'button';
    if (xy) { b.style.left = xy[0] + 'px'; b.style.top = xy[1] + 'px'; }
    else { const rand = v => Math.max(4.5, Math.min(95.5, v / 10.24)); b.style.left = rand(p[0]) + '%'; b.style.top = rand(p[1]) + '%'; }
    b.setAttribute('aria-label', name);
    b.title = name.length > 60 ? '' : name;
    if (HASH.raster) b.append(el('span', '', name));
    b.append(el('i', 'treffer'));   // Trefferfläche mindestens 44 px (Spielertest 25.10.2026), Zeichen bleibt kleiner
    b._klick = klick;
    marken.append(b);
    return b;
  }
  // Treffer: bei sich überlappenden Marken zählt die, deren Mitte dem Finger am nächsten ist (Tastatur: die fokussierte)
  function markeTreffen(behaelter, e) {
    const ziel = e.target.closest && e.target.closest('.rb-marke');
    if (ziel && !behaelter.contains(ziel)) return null;
    if (!e.detail) return ziel;   // Tastatur: die fokussierte Marke
    // Gefundene Ursache der Fehltreffer (QA S3, 6): Beim Drücken schrumpft die Marke (:active scale .9) – liegt der Finger am Rand
    // der Trefferfläche, endet der Klick auf dem Behälter statt auf der Marke. Deshalb immer nach Lage auswerten.
    // QA S3 (6): alle Marken, deren Trefferfläche (≥ 48 px) den Finger enthält – die mit der nächsten Mitte gewinnt
    let best = ziel, bd = Infinity;
    behaelter.querySelectorAll('.rb-marke').forEach(m => {
      const t = (m.querySelector('.treffer') || m).getBoundingClientRect(), r = m.getBoundingClientRect();
      if (e.clientX < t.left || e.clientX > t.right || e.clientY < t.top || e.clientY > t.bottom) return;
      const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      if (d < bd) { bd = d; best = m; }
    });
    return best;
  }
  marken.addEventListener('click', e => { const m = markeTreffen(marken, e); if (m && m._klick) { zurueckGruppe = null; if (m.classList.contains('gruppe')) R_.ton('klick'); m._klick(); } });
  // „Genauer hinschauen“ bleibt offen (Spielertest 25.10.2026): Lupe bzw. Versteck aus der Gruppe heraus – nach dem Schließen
  // kommt die Gruppe wieder, bis alle ihre Stellen angesehen sind oder der Spieler den Ausschnitt mit ✕ schließt.
  let zurueckGruppe = null;
  const gruppeErledigt = (m, art) => art === 'versteck' ? E.besucht.includes(m.name) : !!(E.stellen.find(s => s.name === m.name) || {}).untersucht;
  function gruppeNehmen() { const z = zurueckGruppe; zurueckGruppe = null; return z; }
  // Lupe/Fund schließen: zurück in den Ausschnitt, solange die Gruppe offene Stellen hat und die Phase noch passt
  function nahZuGruppe(z) {
    nahWeg();
    if (!z || !E) return;
    const passt = z.art === 'versteck' ? E.phase === 'werkzeug' && E.raumSuche : E.phase === 'untersuchen' || E.phase === 'diagnose';
    if (passt && z.g.some(m => !gruppeErledigt(m, z.art))) gruppeOeffnen(z.g, z.art);
  }
  // vergrößerter Ausschnitt einer Gruppe: Raumbild + Overlays + Effekte (Displays, Pfützen) in einer Leinwand, darüber die
  // Marken einzeln; Vergrößerung so, dass die Marken mindestens 1,5 Markengrößen auseinander liegen (sonst so groß wie
  // möglich und dann sanft auseinandergeschoben)
  function gruppeOeffnen(g, art) {
    const feld = el('div', 'rb-gruppe'), c = el('canvas', 'rb-gruppenbild'), ebene = el('div', 'rb-gruppenmarken');
    feld.append(c, ebene);
    nahZeigen('gruppe', T('ausschnittTitel', 'Genauer hinschauen'), [feld]);
    const Wz = feld.clientWidth, Hz = feld.clientHeight, ms = markenGroesse(), S = raum.clientWidth;
    const xs = g.map(m => m.p[0]), ys = g.map(m => m.p[1]);
    const bx0 = Math.min(...xs), bx1 = Math.max(...xs), by0 = Math.min(...ys), by1 = Math.max(...ys);
    let dmin = Infinity;
    g.forEach((a, i) => g.slice(i + 1).forEach(b => { dmin = Math.min(dmin, Math.hypot(a.p[0] - b.p[0], a.p[1] - b.p[1])); }));
    const k0 = S / 1024, kFit = Math.min((Wz - 2.4 * ms) / Math.max(1, bx1 - bx0), (Hz - 2.4 * ms) / Math.max(1, by1 - by0));
    const kNoetig = 1.5 * ms / Math.max(1, dmin);
    const k = Math.max(k0 * 1.3, Math.min(kFit, Math.max(kNoetig, k0 * 1.8), k0 * 4.5));
    // Ausschnitt (Bildpunkte), mittig um die Gruppe, im Bild gehalten
    const cw = Wz / k, ch = Hz / k;
    const cx0 = Math.max(0, Math.min(1024 - cw, (bx0 + bx1) / 2 - cw / 2)), cy0 = Math.max(0, Math.min(1024 - ch, (by0 + by1) / 2 - ch / 2));
    const pos = g.map(m => [(m.p[0] - cx0) * k, (m.p[1] - cy0) * k]);
    const rand = ms / 2 + 4;
    for (let n = 0; n < 40; n++) {   // zu eng: sanft auseinanderschieben
      let bewegt = false;
      for (let i = 0; i < pos.length; i++) for (let j = i + 1; j < pos.length; j++) {
        const dx = pos[j][0] - pos[i][0], dy = pos[j][1] - pos[i][1], d = Math.hypot(dx, dy) || 0.01, soll = ms * 1.25;
        if (d < soll) { const s = (soll - d) / 2, ux = dx / d, uy = dy / d; pos[i][0] -= ux * s; pos[i][1] -= uy * s; pos[j][0] += ux * s; pos[j][1] += uy * s; bewegt = true; }
      }
      pos.forEach(q => { q[0] = Math.max(rand, Math.min(Wz - rand, q[0])); q[1] = Math.max(rand, Math.min(Hz - rand, q[1])); });
      if (!bewegt) break;
    }
    g.forEach((m, i) => {
      const b = el('button', 'rb-marke ' + art + (gruppeErledigt(m, art) ? ' erledigt' : ''));
      b.type = 'button'; b.setAttribute('aria-label', m.name); b.title = m.name;
      b.style.left = pos[i][0] + 'px'; b.style.top = pos[i][1] + 'px';
      b.style.animationDelay = (RB.ruhig ? 0 : 0.12 + 0.06 * i) + 's';
      b.append(el('i', 'treffer'));
      b._klick = () => { nahWeg(); zurueckGruppe = { g, art }; m.klick(); };
      ebene.append(b);
    });
    ebene.addEventListener('click', e => { const m = markeTreffen(ebene, e); if (m && m._klick) m._klick(); });
    let laeuft = true;
    nahStopp = () => { laeuft = false; };
    const malen = () => {
      if (!laeuft) return;
      const { g: gg, w, h } = RB.leinwand(c);
      gg.clearRect(0, 0, w, h);
      const quelle = nw => [cx0 * nw / 1024, cy0 * nw / 1024, cw * nw / 1024, ch * nw / 1024];
      if (RB.geladen(raumbild)) gg.drawImage(raumbild, ...quelle(raumbild.naturalWidth), 0, 0, w, h);
      overlayEbene.querySelectorAll('img').forEach(i => {   // Overlays (Vorhang): eigenes Rechteck in Bildpunkten
        if (!RB.geladen(i)) return;
        const l = parseFloat(i.style.left) * 10.24, t = parseFloat(i.style.top) * 10.24, bw = parseFloat(i.style.width) * 10.24, bh = parseFloat(i.style.height) * 10.24;
        gg.drawImage(i, (l - cx0) * k, (t - cy0) * k, bw * k, bh * k);
      });
      if (effekte.width) gg.drawImage(effekte, ...quelle(effekte.width), 0, 0, w, h);
      requestAnimationFrame(malen);
    };
    requestAnimationFrame(malen);
  }
  // veränderliche Hinweise im Raumbild: Fehlercode am Kessel-Display, Pfütze, Tropfen
  let effektZeit = 0;
  function effekteZeichnen(t) {
    if (!E || rb.hidden) return;
    const { g, w, h } = RB.leinwand(effekte);
    g.clearRect(0, 0, w, h);
    const f = w / 1024, dt = Math.min(0.05, Math.max(0, t - (effektZeit || t))); effektZeit = t;
    RB.leben.zeichnen(g, f, t, dt);
    E.stellen.forEach(s => {
      const p = E.V.stellen[s.name], a = s.anzeige || {};
      if (!p) return;
      // Raum-Overlay noch ohne Bild (bild=2 an einer Raumstelle): gestrichelter Platzhalter an der Stelle
      if (+a.bild === 2 && !bauteilVon(s.name) && !(E.V.overlays && E.V.overlays[s.name] && E.V.overlays[s.name].bild) && E.phase !== 'fertig') {
        const r = 70 * f;
        g.save(); g.setLineDash([6, 5]); g.lineWidth = 2; g.strokeStyle = 'rgba(160,40,30,.8)'; g.fillStyle = 'rgba(160,40,30,.12)';
        RB.rund(g, p[0] * f - r, p[1] * f - r * 1.3, r * 2, r * 2.6, 8); g.fill(); g.stroke(); g.restore();
      }
      // Fehlercode bzw. Text im Display eines Geräts im Raumbild: V.display (Kessel-Display) oder V.displays { Stelle: Rechteck }
      const dr = (E.V.displays && E.V.displays[s.name]) || (s.name === 'Kessel-Display' && E.V.display);
      if (dr && typeof a.display === 'string' && E.phase !== 'fertig') {
        const [x0, y0, x1, y1] = dr;
        const code = /^M[TLK]-/.test(a.display);
        if (!(code && Math.sin(t * 5) < -0.2)) RB.lcd(g, x0 * f, y0 * f, (x1 - x0) * f, (y1 - y0) * f, a.display.slice(0, 8), { farbe: code ? '#ff8a7a' : '#9fe8ff' });
      }
      if ((a.zustand === 'nass' || a.zustand === 'tropft') && E.phase !== 'fertig') wasserImRaum(g, f, t, s.name, a.zustand, p);
    });
  }
  // Wasser im Raumbild (Handgriff-Runde, MZ 25.10.2026): gestaltete Tropfen, Pfützen, Rinnsale. Lage je Raum-Variante in
  // orte.js V.wasser { Stelle: { tropfen: [x, y Quelle, y Aufprall, Pfütze-Breite, Spritzer], pfuetze: [x, y, Breite],
  // rinnsal: [x, y oben, y unten] } } (Bildpunkte 1024) – Pfützen immer am Boden (BA-07 schwebte auf Waschtisch-Höhe).
  // Ohne Eintrag: Pfütze knapp unter der Stelle, Tropfen fallen 120 Bildpunkte.
  function wasserOrt(name, zustand, p) {
    const w = (E.V.wasser && E.V.wasser[name]) || {};
    if (zustand === 'tropft') return { tropfen: w.tropfen || [p[0], p[1] + 20, p[1] + 140, 0] };
    return w.pfuetze || w.rinnsal ? w : { pfuetze: [p[0], p[1] + 10, 150] };
  }
  function wasserImRaum(g, f, t, name, zustand, p) {
    const w = wasserOrt(name, zustand, p);
    // Größe der Tropfen nach Raumtiefe: weiter oben im Bild (hinten) kleiner
    if (w.tropfen) {
      const [x, y, yb, pb, spr] = w.tropfen, gr = Math.max(11, (12 + 7 * Math.min(1, Math.max(0, (yb - 300) / 600))) * f);   // auf dem Handy mindestens 11 px (QA S2)
      if (pb) RB.pfuetze(g, x * f, yb * f + 2 * f, pb * f, t, { klein: true, dunkel: 0.14 });
      RB.wasserTropfen(g, x * f, y * f, yb * f, gr, t, { takt: 2.8, spritzer: spr !== false });
    }
    if (w.rinnsal) { const [x, y0, y1, b] = w.rinnsal; RB.rinnsal(g, x * f, y0 * f, y1 * f, (b || 16) * f, t); }
    if (w.pfuetze) { const [x, y, b, klein] = w.pfuetze; RB.pfuetze(g, x * f, y * f, b * f, t, { klein: !!klein }); }
  }
  RB.wasserOrt = (name, zustand, p) => wasserOrt(name, zustand, p);   // Testhilfe

  // ---------- Leiste ----------
  function meldung(text, art) {
    meldungEl.textContent = nb(text || '');
    meldungEl.className = 'rb-meldung ' + (art || '');
    if (text) { meldungEl.classList.remove('neu'); void meldungEl.offsetWidth; meldungEl.classList.add('neu'); }
    // neue Meldung ganz in den sichtbaren Teil der Leiste holen (sonst unten abgeschnitten)
    if (text) requestAnimationFrame(() => {
      const l = leisteEl.getBoundingClientRect(), m = meldungEl.getBoundingClientRect();
      // so weit, dass das Ende sichtbar ist – aber nie über den Anfang der Meldung hinaus
      const weg = Math.min(m.bottom + 10 - l.bottom, m.top - (l.top + 8));
      if (weg > 0) leisteEl.scrollTo({ top: leisteEl.scrollTop + weg, behavior: RB.ruhig ? 'auto' : 'smooth' });
    });
    leisteMehr();
  }
  // Leiste länger als sichtbar: unten sanft ausblenden als Hinweis zum Scrollen
  function leisteMehr() {
    requestAnimationFrame(() => leisteEl.classList.toggle('mehr', leisteEl.scrollTop + leisteEl.clientHeight < leisteEl.scrollHeight - 4));
  }
  leisteEl.addEventListener('scroll', leisteMehr, { passive: true });
  function leiste() {
    aktionen.textContent = '';
    const ph = E.phase;
    if (ph === 'untersuchen' || ph === 'diagnose') {
      // MZ (Spieltest Phase 3): ohne Gesamtzahl, Einzahl/Mehrzahl; Knopf „Ursache wählen“ frei ab der ersten Stelle
      const n = E.stellen.filter(s => s.untersucht).length;
      aufgabe.textContent = nb(n === 1 ? RB.anw('leisteUntersuchtEins', 'Untersucht: 1 Stelle – wenn du die Ursache kennst, wähle sie aus.')
        : n ? RB.anw('leisteUntersucht', 'Untersucht: {n} Stellen – wenn du die Ursache kennst, wähle sie aus.').replace('{n}', n)
        : RB.anw('leisteUntersuchen', 'Tippe die markierten Stellen an und schau sie dir mit der Lupe an.'));
      const d = knopf('Ursache wählen', 'haupt', diagnose);
      d.disabled = n === 0;
      aktionen.append(d);
      if (ST().tipp) {
        const t = knopf(E.tipp ? 'Tipp vom Meister' : RB.anw('knopfTipp', 'Frag den Meister (−{tipp})').replace('{tipp}', P.tipp), 'zweit', meisterTipp);
        aktionen.append(t);
      }
    } else if (ph === 'werkzeug') {
      const offen = E.brauche.filter(b => !E.eingepackt.includes(b.name));
      aufgabe.textContent = nb((E.werkzeugText || '') + (ST().anzahl ? ' ' + anzahlText() : ''));
      // drei gleichwertige Knöpfe ohne Unterzeilen (MZ, 24.10.2026)
      const wahl = el('div', 'rb-wahl'), [k1, k2, k3] = knoepfeWerkzeug();
      wahl.append(wahlKnopf(k1, 'koffer', () => lager('koffer')), wahlKnopf(k2, 'transporter', () => lager('transporter')), wahlKnopf(k3, 'raum', raumSuchen));
      aktionen.append(wahl);
      if (E.herkunftHinweis && offen.length) {
        const h = el('p', 'rb-hinweis', [...new Set(offen.map(b => D.rahmen.herkunft[b.herkunft]).filter(Boolean))].join(' '));
        aktionen.append(h);
      }
      if (ST().ganzeListe) aktionen.append(packstand());
    } else aufgabe.textContent = '';
    leisteMehr();
  }
  let notizBenutzt = new Set();   // Fachbegriffe, die in den Notizen dieses Einsatzes schon unterstrichen sind
  function notiz(s) {
    // QA S3 (8): in der Notizliste jeden Begriff nur einmal unterstreichen (z. B. „Speicher“), nicht in jeder Notiz
    const li = el('li'), benutzt = notizBenutzt;
    const name = fachEl('b', '', s.name, benutzt); name.append(': ');
    li.append(name, fach(s.text, benutzt));
    li.addEventListener('click', () => lupe(s));
    notizen.querySelector('ul').append(li);
    notizen.hidden = false;
    leisteMehr();
  }
  // erkannte Ursache oben in den Notizen, hervorgehoben (MZ, 24.10.2026); bei zwei Ursachen jede, sobald gefunden
  function ursacheNotiz(label) {
    const ul = notizen.querySelector('ul');
    const li = fachEl('li', 'ursache', RB.rueck('ursacheNotiz', 'Ursache: {ursache}', { ursache: label }), notizBenutzt);
    const letzte = [...ul.querySelectorAll('li.ursache')].pop();
    if (letzte) letzte.after(li); else ul.prepend(li);
    notizen.hidden = false;
    leisteMehr();
  }

  // ---------- Untersuchen ----------
  function untersuchen() {
    E.phase = 'untersuchen';
    klangSzene('raum', E.ort);
    kopfzeile();
    leiste();
    markenSetzen();
    meldung('');
    if (HASH.phase && E.nr === 1 && !E.sprungErledigt) phasenSprung();
  }

  // ---------- Lupe ----------
  function nahZeigen(klasse, kopfText, inhalt, schliessen) {
    nah.className = 'rb-nah ' + klasse;
    nah.textContent = '';
    const kopf = el('div', 'rb-nahkopf');
    kopf.append(el('b', '', kopfText));
    if (schliessen !== false) {
      const x = knopf('✕', 'rb-zu', () => { nahWeg(); if (typeof schliessen === 'function') schliessen(); });
      x.setAttribute('aria-label', 'Schließen');
      kopf.append(x);
    }
    nah.append(kopf);
    inhalt.forEach(i => nah.append(i));
    nah.hidden = false;
    nahPlatz();
  }
  // Platz der Nahansicht: normal genau über dem Raum. Ursache-Auswahl hochkant: wächst bei Bedarf nach unten über die
  // Leiste (Rückmeldung ohne Scrollen sichtbar). Flach quer (Handy): Ursache und Handgriff über Raum + Leiste, zweispaltig.
  function nahPlatz() {
    nahPlatzInnen();
    // Reiter „Notizen (n)“ im Handgriff nur, wenn das Fenster die Leiste (mit den Notizen) abdeckt
    const rt = nah.querySelector('.rb-hgreiter');
    if (rt) { rt.hidden = !(nah.classList.contains('lang') || nah.classList.contains('breit')); if (rt.hidden) { const f = nah.querySelector('.rb-hgnotizen'); if (f) f.hidden = true; } }
  }
  function nahPlatzInnen() {
    nah.classList.remove('breit', 'lang', 'eng', 'voll');
    nah.style.width = nah.style.height = nah.style.maxHeight = nah.style.minHeight = '';
    if (nah.hidden) return;
    if (nah.classList.contains('versteckfund')) return fundEinpassen();
    if (nah.classList.contains('lager')) return lagerEinpassen();
    const art =['diagnose', 'handgriff', 'packpruefung'].find(a => nah.classList.contains(a));
    if (!art) return;
    if (art === 'packpruefung') nah.classList.remove('knapp');
    const r = raum.getBoundingClientRect(), l = leisteEl.getBoundingClientRect();
    if (rb.classList.contains('quer')) {
      if (r.height >= 520 || l.width < 160) return packEinpassen();   // Rechner/Tablet: Raum ist groß genug
      nah.classList.add('breit');
      nah.style.width = Math.floor(l.right - r.left) + 'px';
      nah.style.height = Math.floor(Math.max(r.height, l.bottom - r.top)) + 'px';
      nah.classList.toggle('eng', l.right - r.left < 700);
      packEinpassen();
    } else if (art === 'diagnose') {
      nah.classList.add('lang');
      nah.style.maxHeight = Math.floor(l.bottom - r.top) + 'px';
      kopfDecken(r, l);
    } else if (innerHeight <= 700 && art === 'handgriff') {
      // kleinstes Handy (Spielertest 25.10.2026, 320×640): Fenster immer bis zum Ende der Leiste – Bedienknöpfe fest am unteren
      // Rand, darüber Rückmeldung und Anweisung, das Bauteilbild füllt den Rest (Mindestmaß in rohrbruch.css); Notizen als Reiter
      nah.classList.add('lang', 'voll');
      nah.style.height = Math.floor(l.bottom - r.top) + 'px';
    } else {   // Handgriff hochkant: nur wenn er nicht in den Raum passt, so weit wie nötig über die Leiste (+ Platz für 2-zeilige Meldung)
      const ueber = nah.scrollHeight - nah.clientHeight;
      if (ueber > 0) { nah.classList.add('lang'); nah.style.height = Math.min(Math.floor(l.bottom - r.top), Math.ceil(r.height + ueber + 30)) + 'px'; kopfDecken(r, l); }
      packEinpassen();
    }
  }
  // Koffer/Transporter (QA Phase 4, S1): alle Fächer ganz sichtbar und antippbar. 1. im Raum die größte Bildgröße (96 → 48 px)
  // mit passender Spaltenzahl suchen; 2. hochkant darf das Fenster nach unten über den Leisten-Kopf wachsen, aber nie über die
  // Knöpfe Werkzeugkoffer/Transporter/Im Raum suchen (die bleiben antippbar, auch „Fertig gepackt“ darunter), Bilder bis 44 px;
  // 3. Bilder bis 40 px; 4. erst dann scrollt das Raster (Schatten unten als Hinweis).
  const LAGER_BILD = [96, 84, 72, 66, 60, 56, 52, 48, 44, 40];
  function lagerEinpassen() {
    const box = nah.querySelector('.rb-lager'), raster = box && box.querySelector('.rb-fach');
    if (!raster) return;
    const n = raster.children.length;
    // passt = alle Fächer in der Höhe und jede Beschriftung mit mindestens 9,5 px lesbar (sonst lieber weniger Spalten)
    const passt = () => beschriftungEinpassen(raster) >= 9.5 && raster.scrollHeight <= raster.clientHeight + 1;
    const versuche = (minBild) => {   // größtes Bild zuerst, bei gleicher Größe wenige Spalten (weniger Umbruch)
      const innen = raster.clientWidth - 16;
      for (const bild of LAGER_BILD) {
        if (bild < minBild) break;
        for (let sp = 2; sp <= Math.min(6, n); sp++) {
          const breite = (innen - 7 * (sp - 1)) / sp;
          if (breite < bild + 10 || breite < 60) break;
          if (breite > Math.max(bild * 2.3, 120) && sp < Math.min(6, n)) continue;   // keine überbreiten Fächer (Rechner)
          raster.style.setProperty('--spalten', sp); raster.style.setProperty('--bild', bild + 'px');
          if (passt()) return true;
        }
      }
      return false;
    };
    const kleinstes = (minBild) => {   // Notlösung: kleinste erlaubte Bilder, so viele Spalten wie sinnvoll
      const innen = raster.clientWidth - 16;
      let sp = 2;
      while (sp < Math.min(6, n) && (innen - 7 * sp) / (sp + 1) >= Math.max(60, minBild + 10)) sp++;
      raster.style.setProperty('--spalten', sp); raster.style.setProperty('--bild', minBild + 'px');
    };
    const hinweis = () => {
      beschriftungEinpassen(raster);
      const mehr = () => box.classList.toggle('mehr', raster.scrollTop + raster.clientHeight < raster.scrollHeight - 4);
      mehr(); raster.onscroll = mehr;
    };
    box.classList.remove('mehr');
    nah.classList.remove('knapp');
    raster.scrollTop = 0;
    if (versuche(48)) return hinweis();
    const r = raum.getBoundingClientRect(), wahl = leisteEl.querySelector('.rb-aktionen');
    if (!rb.classList.contains('quer') && wahl && !wahl.hidden && wahl.offsetHeight) {
      const grenze = Math.floor(wahl.getBoundingClientRect().top - 6 - r.top);   // Unterkante: knapp über den Wahl-Knöpfen
      if (grenze > r.height + 24) {   // bis knapp über die Knöpfe: Leisten-Kopf und Aufgabe ganz verdeckt, nie halb
        nah.classList.add('lang');
        nah.style.height = grenze + 'px';
        if (versuche(44)) return hinweis();
      }
    }
    if (versuche(40)) return hinweis();
    nah.classList.add('knapp');   // enger: Kopf, Abstände, Schrift der Fächer (v. a. quer flach mit 9–10 Teilen)
    if (!versuche(40)) kleinstes(40);
    hinweis();
  }
  // Beschriftungen der Fächer laufen nie über die Kachel (Abnahme Supervisor): ist ein Wortstück trotz Trennstellen zu breit,
  // wird nur diese Beschriftung kleiner (in 0,5-px-Schritten, höchstens bis 8 px)
  function beschriftungEinpassen(raster) {
    let kleinste = 99;
    raster.querySelectorAll('.rb-teil span').forEach(sp => {
      sp.style.fontSize = ''; sp.style.overflowWrap = 'normal';   // messen ohne Notumbruch mitten im Wort
      let gr = parseFloat(getComputedStyle(sp).fontSize) || 11;
      while (sp.scrollWidth > sp.clientWidth + 0.5 && gr > 8) { gr -= 0.5; sp.style.fontSize = gr + 'px'; }
      kleinste = Math.min(kleinste, gr);
      if (sp.scrollWidth <= sp.clientWidth + 0.5) return;
      kleinste = 0;
      sp.style.overflowWrap = '';   // passt selbst mit 8 px nicht: Notumbruch im Wort, aber nie über die Kachel
    });
    return kleinste;
  }
  // Packliste (Meister): viele Zeilen auf flachen Bildschirmen – dann kompakter (Klasse knapp: Eingepacktes als Reihe kleiner
  // Marken, Abzugszeilen enger), damit alle Abzüge und die Summe ohne Scrollen sichtbar sind
  function packEinpassen() {
    if (!nah.classList.contains('packpruefung')) return;
    nah.classList.remove('knapp');
    if (nah.scrollHeight > nah.clientHeight) nah.classList.add('knapp');
  }
  // Ragt die Nahansicht in die Leiste, deckt sie den Leisten-Kopf (Ort, Kunde, Zeichen) ganz ab – nie nur halb (QA 24.10.2026)
  function kopfDecken(r, l) {
    const unten = nah.getBoundingClientRect().bottom;
    if (unten <= r.bottom + 1) return;
    const k = $('.rb-leistenkopf').getBoundingClientRect();
    const ziel = Math.min(l.bottom, Math.max(l.top, k.bottom) + 10);
    if (unten < ziel) nah.style.minHeight = Math.ceil(ziel - r.top) + 'px';
  }
  // Handgriff: nach jeder neuen Meldung (und wenn Knöpfe dazukommen) Platz neu messen und die Meldung sichtbar halten
  function nahNachMessen(info) {
    if (nah.hidden || !nah.contains(info)) return;
    nahPlatz();
    const n = nah.getBoundingClientRect(), m = info.getBoundingClientRect();
    if (m.bottom > n.bottom - 6) nah.scrollTop += m.bottom - n.bottom + 10;
  }
  function beobachten(info, teile) {   // Größe von Meldung, Hinweis, Knöpfen, Schritten beobachten (nicht das Bild – das wächst mit)
    if (!window.ResizeObserver) return () => {};
    let wartet = false;
    const ro = new ResizeObserver(() => { if (wartet) return; wartet = true; requestAnimationFrame(() => { wartet = false; nahNachMessen(info); }); });
    teile.forEach(t => t && ro.observe(t));
    return () => ro.disconnect();
  }
  let nahStopp = null;
  function nahWeg() {
    if (nahStopp) { nahStopp(); nahStopp = null; }
    nah.hidden = true; nah.textContent = '';
    // Klassen und Maße zurücksetzen: eine versteckte breite Ursache-Ansicht lag sonst quer unsichtbar über der Leiste
    nah.className = 'rb-nah'; nah.style.width = nah.style.height = nah.style.maxHeight = nah.style.minHeight = '';
  }

  // Lupenbild eines Bauteils; zweite = zweite Fassung (Anzeige bild=2, orte.js bauteile.zweite) – fehlt sie noch, das normale Bild
  function bauteilVon(name, zweite) {
    const b = O[E.ort].bauteile, z2 = zweite && b.zweite && b.zweite[name], z = z2 || b.stellen[name];
    if (!z) return null;
    const masse = (z2 && b.masse2 && b.masse2[name]) || b.masse[name] || {};
    const tropfen = !z2 && b.tropfen && b.tropfen[name];   // Lupe „tropft“: Stelle, an der der Tropfen hängt (orte.js)
    return { blatt: b.blaetter[z[0]], zelle: z[1], masse: tropfen ? Object.assign({ tropfen }, masse) : masse, zweiteFehlt: !!zweite && !z2 };
  }
  function lupe(s) {
    const zg = gruppeNehmen();   // aus dem Ausschnitt geöffnet: danach dorthin zurück
    const benutzt = new Set();
    const c = el('canvas', 'rb-lupenbild'), text = el('p', 'rb-lupentext');
    const ok = knopf('Notiert', 'haupt', () => nahZuGruppe(zg));
    nahZeigen('lupe', s.name, [c, text, ok], zg ? () => nahZuGruppe(zg) : undefined);
    // Fachbegriffe im Namen der Stelle und im Befund (je Begriff einmal)
    const kopfB = nah.querySelector('.rb-nahkopf b'); kopfB.textContent = ''; kopfB.append(fach(s.name, benutzt));
    text.append(fach(s.text, benutzt));
    ton('lupe');
    if (!s.untersucht) { s.untersucht = true; notiz(s); leiste(); markenSetzen(); }
    const bt = bauteilVon(s.name, s.anzeige && +s.anzeige.bild === 2), raumstelle = !bt;
    let lauf2 = true;
    nahStopp = () => { lauf2 = false; };
    const t0 = performance.now();
    const malen = () => {
      if (!lauf2) return;
      lupeZeichnen(c, s, bt, raumstelle, (performance.now() - t0) / 1000);
      requestAnimationFrame(malen);
    };
    requestAnimationFrame(malen);
  }
  function lupeZeichnen(c, s, bt, raumstelle, t) {
    const { g, w, h } = RB.leinwand(c);
    g.clearRect(0, 0, w, h);
    if (w < 20 || h < 20) return;   // noch nicht angeordnet
    const a = s.anzeige || {}, gr = Math.min(w, h);
    g.save();
    g.beginPath(); g.arc(w / 2, h / 2, gr / 2 - 2, 0, Math.PI * 2); g.clip();
    g.fillStyle = '#e9eaeb'; g.fillRect(0, 0, w, h);
    let u = null;
    if (raumstelle) {   // Ausschnitt aus dem Raumbild
      const p = E.V.stellen[s.name], i = RB.bild(E.V.bild);
      const q = 260;
      if (RB.geladen(i)) g.drawImage(i, p[0] - q / 2, p[1] - q / 2, q, q, (w - gr) / 2, (h - gr) / 2, gr, gr);
      // Raum-Overlay (z. B. bodenlanger Vorhang) auch im Ausschnitt
      const ov = +a.bild === 2 && E.V.overlays && E.V.overlays[s.name];
      const oi = ov && ov.bild && RB.bild(ov.bild);
      if (oi && RB.geladen(oi)) {
        const [x0, y0, x1, y1] = ov.rechteck || [0, 0, 1024, 1024];
        g.save(); g.translate((w - gr) / 2, (h - gr) / 2); g.scale(gr / q, gr / q); g.translate(q / 2 - p[0], q / 2 - p[1]);
        g.drawImage(oi, x0, y0, x1 - x0, y1 - y0); g.restore();
      }
      // Wasser im Ausschnitt genau dort, wo es im Raum ist (gleiche Lage wie im Raumbild); übrige Zustände in der Mitte
      if (a.zustand === 'nass' || a.zustand === 'tropft') {
        g.save(); g.translate((w - gr) / 2, (h - gr) / 2); g.scale(gr / q, gr / q); g.translate(q / 2 - p[0], q / 2 - p[1]);
        wasserImRaum(g, 1, t, s.name, a.zustand, p); g.restore();
      } else if (a.zustand) RB.zustand(g, a.zustand, w / 2, h / 2 + gr * 0.12, gr * 0.9, t);
      // übrige Werte (Display, Manometer, Wasserstand …) auch an Raumstellen ohne eigenes Lupenbild
      const x0 = (w - gr) / 2, y0 = (h - gr) / 2;
      const ersatz = { f: gr / 512, x: x0, y: y0, w: gr, h: gr, p: (px, py) => [x0 + px * gr / 512, y0 + py * gr / 512] };
      werteZeichnen(g, ersatz, {}, Object.assign({}, a, { zustand: null }), gr, t, s, { x: w / 2, y: h / 2, r: gr / 2 - 2 });
    } else {
      // kleines Display im Lupenbild (z. B. MK-Code am Innengerät, „WW 37°C“ an der Therme): Lupe zoomt auf das Display,
      // damit der Text eindeutig lesbar ist (QA Phase 3) – nur, wenn an der Stelle sonst nichts angezeigt wird
      const d = bt.masse.display, nurDisplay = a.display != null && !['manometer', 'thermometer', 'lampe', 'haerte', 'pegel', 'durchfluss', 'hebel', 'stellung'].some(k => a[k] != null);
      const z = d && nurDisplay ? Math.max(1, Math.min(3.2, 230 / d[2])) : 1;
      if (z > 1.15) {
        const G = gr * z, x0 = (w - gr) / 2, y0 = (h - gr) / 2;
        const X = Math.min(x0, Math.max(x0 + gr - G, w / 2 - (d[0] + d[2] / 2) * G / 512));
        const Y = Math.min(y0, Math.max(y0 + gr - G, h / 2 - gr * 0.04 - (d[1] + d[3] / 2) * G / 512));
        u = RB.zelle(g, bt.blatt, bt.zelle, 3, 2, X, Y, G, G, false);
      } else u = RB.zelle(g, bt.blatt, bt.zelle, 3, 2, (w - gr) / 2, (h - gr) / 2, gr, gr, false);
      if (u) werteZeichnen(g, u, bt.masse, a, gr, t, s, { x: w / 2, y: h / 2, r: gr / 2 - 2 });
    }
    g.restore();
    g.beginPath(); g.arc(w / 2, h / 2, gr / 2 - 2, 0, Math.PI * 2); g.lineWidth = 4; g.strokeStyle = '#2b2f33'; g.stroke();
    // zweites Lupenbild (bild=2) fehlt noch: gestrichelter Innenring als Platzhalter-Zeichen
    if (bt && bt.zweiteFehlt) { g.save(); g.setLineDash([7, 6]); g.lineWidth = 3; g.strokeStyle = 'rgba(192,57,43,.8)'; g.beginPath(); g.arc(w / 2, h / 2, gr / 2 - 10, 0, Math.PI * 2); g.stroke(); g.restore(); }
  }
  // Werte auf das Bauteil legen (Manometer-Zeiger, Display-Text, Thermometer, Uhr, Zustände)
  // Schild ganz im Lupenkreis k = { x, y, r }: rückt zur Mitte, wird notfalls kleiner, sonst zweizeilig (QA Phase 3:
  // „Wasserstand: über Überlauf“, „Durchfluss 0,0 l/min“ ragten aus dem Kreis). richtung −1 = von unten nach oben stapeln.
  // Gibt die belegte Höhe zurück.
  function schildKreis(g, k, y, text, fs, lcd, richtung) {
    const FONT = n => `700 ${n}px ` + (lcd ? 'ui-monospace, "Cascadia Mono", Consolas, monospace' : 'system-ui, sans-serif');
    const breite = (zeilen, n) => { g.save(); g.font = FONT(n); const b = Math.max(...zeilen.map(z => g.measureText(z).width)); g.restore(); return b + n * (lcd ? 1.4 : 1.1); };
    const hoehe = (zeilen, n) => n * (zeilen.length === 1 ? 1.6 : 0.4 + 1.25 * zeilen.length);
    const passt = (zeilen, n, ym) => { const hh = hoehe(zeilen, n), fern = Math.abs(ym - k.y) + hh / 2; if (fern >= k.r) return false;
      return breite(zeilen, n) / 2 <= Math.sqrt(k.r * k.r - fern * fern) - 5; };
    const teile = String(text).split(' ');
    let zeilen = [String(text)], n = fs;
    // Mitte des Schilds, ausgehend von der Ankerkante (y) in Stapelrichtung
    const mitte = (z, nn, yy) => yy - richtung * hoehe(z, nn) / 2;
    let yy = y, ok = passt(zeilen, n, mitte(zeilen, n, yy));
    for (let i = 0; !ok && i < 12; i++) { yy -= richtung * k.r * 0.025; ok = passt(zeilen, n, mitte(zeilen, n, yy)); }   // zur Mitte rücken
    while (!ok && n > fs * 0.9) { n -= 0.5; ok = passt(zeilen, n, mitte(zeilen, n, yy)); }   // etwas kleiner
    if (!ok && teile.length > 1) {   // zweizeilig, Umbruch möglichst in der Mitte
      let best = 1, bw = Infinity;
      for (let i = 1; i < teile.length; i++) { const b = breite([teile.slice(0, i).join(' '), teile.slice(i).join(' ')], fs); if (b < bw) { bw = b; best = i; } }
      zeilen = [teile.slice(0, best).join(' '), teile.slice(best).join(' ')]; n = fs; yy = y;
      ok = passt(zeilen, n, mitte(zeilen, n, yy));
      for (let i = 0; !ok && i < 12; i++) { yy -= richtung * k.r * 0.025; ok = passt(zeilen, n, mitte(zeilen, n, yy)); }
      while (!ok && n > fs * 0.7) { n -= 0.5; ok = passt(zeilen, n, mitte(zeilen, n, yy)); }
    }
    const hh = hoehe(zeilen, n), bw = breite(zeilen, n), ym = mitte(zeilen, n, yy);
    if (lcd) RB.lcd(g, k.x - bw / 2, ym - hh / 2, bw, hh, zeilen.join('\n'), { farbe: lcd });
    else {
      g.save(); g.fillStyle = 'rgba(13,20,24,.88)'; RB.rund(g, k.x - bw / 2, ym - hh / 2, bw, hh, Math.min(hh, n * 1.6) * 0.3); g.fill();
      g.font = FONT(n); g.fillStyle = '#9fe8ff'; g.textAlign = 'center'; g.textBaseline = 'middle';
      zeilen.forEach((z, i) => g.fillText(z, k.x, ym + (i - (zeilen.length - 1) / 2) * n * 1.25 + n * 0.05));
      g.restore();
    }
    return Math.abs(yy - y) + hh;
  }
  function werteZeichnen(g, u, m, a, gr, t, s, k) {
    k = k || { x: u.x + u.w / 2, y: u.y + u.h / 2, r: gr / 2 - 2 };
    const fs = Math.max(11, gr * 0.055);
    // mehrere Anzeige-Schlüssel an einer Stelle (Format 4, „;“): Schilder ohne eigenen Platz stapeln sich unten bzw. oben,
    // statt sich zu überdecken
    const unten = [], oben = [];
    if (a.manometer != null) {
      // „manometer=4,0>1,0“: Zeiger steht in Ruhe auf 4 und fällt (z. B. beim Zapfen) auf 1 – im Wechsel, damit beide Werte lesbar sind
      const [von, nach] = String(a.manometer).split('>').map(RB.zahl);
      let wert = von;
      if (nach != null && !isNaN(nach)) {
        const z = t % 5, weich = q => q * q * (3 - 2 * q);
        wert = z < 1.5 ? von : z < 2.5 ? von + (nach - von) * weich(z - 1.5) : z < 4.5 ? nach : nach + (von - nach) * weich((z - 4.5) / 0.5);
      }
      const soll = RB.bereich(a.soll), max = Math.max(von, nach || 0, soll ? soll[1] : 0) > 3.2 ? 6 : 4;
      if (m.skala) { const [x, y] = u.p(m.skala[0], m.skala[1]); RB.manometer(g, x, y, m.skala[2] * u.f, { wert, max, einheit: 'bar', bereich: soll && soll[0] !== soll[1] ? soll : null }); }
      else {   // Prüfgerät (z. B. am Ausdehnungsgefäß): eigenes kleines Manometer
        const r = gr * 0.17, x = u.x + u.w * 0.78, y = u.y + u.h * 0.24;
        RB.manometer(g, x, y, r, { wert, max, einheit: 'bar', flaeche: true, ziel: soll && soll[0] === soll[1] ? soll[0] : null });
        if (soll && soll[0] === soll[1]) RB.schild(g, x, y + r * 1.45, 'Typenschild ' + RB.komma(soll[0], 1) + ' bar', fs * 0.8);
      }
    }
    if (a.display != null) {
      // passend zum Befundtext (QA Phase 3, HA-08): „… blinkt“ = Anzeige blinkt ruhig; „die Uhr steht auf 0:00“ = zweite Zeile
      const st = (s && s.text) || '', uhr = /Uhr steht auf (\d{1,2}:\d{2})/.exec(st);
      const blinkAus = /blinkt/.test(st) && Math.sin(t * 4) < -0.35;
      const dText = blinkAus ? ' ' : String(a.display) + (uhr ? '\n' + uhr[1] : '');
      const d = m.display;
      if (d) { const [x, y] = u.p(d[0], d[1]); RB.lcd(g, x, y, d[2] * u.f, d[3] * u.f, dText, { farbe: /^M[TLK]-/.test(a.display) ? '#ff8a7a' : '#9fe8ff' }); }
      else unten.push({ text: dText, lcd: /^M[TLK]-/.test(a.display) ? '#ff8a7a' : '#9fe8ff' });
    }
    if (a.thermometer != null) {
      const werte = String(a.thermometer).split('/').map(v => RB.zahl(v));
      if (m.skala) {
        const [x, y] = u.p(m.skala[0], m.skala[1]), r = m.skala[2] * u.f;
        RB.manometer(g, x, y, r, { wert: werte[0], max: m.max || 120, einheit: '°C', schritt: m.schritt || 40 });   // Raumthermometer: 0–40
        // Vorlauf und Rücklauf untereinander (nebeneinander überlagerten sie sich, QA Phase 3 HK-04)
        if (werte.length > 1) unten.push({ text: 'Rücklauf ' + werte[1] + NBSP + '°C' }, { text: 'Vorlauf ' + werte[0] + NBSP + '°C' });
      } else if (m.saeule) {
        const [x, y0, y1] = m.saeule, min = -30, max = 50, v = Math.max(min, Math.min(max, werte[0]));
        const p0 = u.p(x, y1), p1 = u.p(x, y1 - (y1 - y0) * (v - min) / (max - min));
        g.save(); g.strokeStyle = '#d32f2f'; g.lineWidth = Math.max(3, 9 * u.f); g.lineCap = 'round';
        g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1]); g.stroke(); g.restore();
        RB.schild(g, p0[0] + u.w * 0.28, p1[1], werte[0] + NBSP + '°C', fs);
      } else oben.push({ text: werte.map(v => RB.komma(v, Number.isInteger(v) ? 0 : 1)).join(' / ') + NBSP + '°C' });
    }
    if (a.stellung != null && m.uhr) {
      const z = /^\d{1,2}:\d{2}$/.test(String(a.stellung)) ? String(a.stellung) : new Date().toTimeString().slice(0, 5);
      const [hh, mm] = z.split(':').map(Number), [x, y] = u.p(m.uhr[0], m.uhr[1]), r = m.uhr[2] * u.f;
      g.save(); g.lineCap = 'round'; g.strokeStyle = '#222';
      const a1 = ((hh % 12) + mm / 60) / 12 * Math.PI * 2 - Math.PI / 2, a2 = mm / 60 * Math.PI * 2 - Math.PI / 2;
      g.lineWidth = r * 0.09; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a1) * r * 0.5, y + Math.sin(a1) * r * 0.5); g.stroke();
      g.lineWidth = r * 0.06; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a2) * r * 0.78, y + Math.sin(a2) * r * 0.78); g.stroke();
      g.fillStyle = '#222'; g.beginPath(); g.arc(x, y, r * 0.07, 0, Math.PI * 2); g.fill();
      g.restore();
      RB.schild(g, x, y + r * 1.75, z + ' Uhr', fs);
    } else if (a.stellung != null) {
      // freie Stellung (Format 4): offen/zu (Verschraubung, Spindel), Stufe, Bruchteil, Wort („Frostschutz“, „schräg“, „max“)
      const st = String(typeof a.stellung === 'number' ? RB.komma(a.stellung, Number.isInteger(a.stellung) ? 0 : 1) : a.stellung);
      unten.push({ text: (/^(offen|zu)$/.test(st) ? 'Verschraubung ' : 'Stellung ') + st });
    }
    // Wasserstand (Becken, Wanne, Spülkasten, Siphon): Wasserlinie + Schild, bei „sinkt“ ein Pfeil nach unten
    if (a.pegel) {
      const P_ = { 'über Überlauf': 0.16, voll: 0.24, hoch: 0.3, 'unter Überlauf': 0.4, halb: 0.55, steht: 0.42, sinkt: 0.5 + 0.1 * ((t * 0.25) % 1), leer: null };
      const hy = P_[a.pegel];
      if (hy != null) {
        g.save(); g.strokeStyle = 'rgba(80,150,215,.85)'; g.lineWidth = Math.max(2, gr * 0.012); g.beginPath();
        for (let i = 0; i <= 24; i++) { const x = u.x + u.w * (0.18 + 0.64 * i / 24), y = u.y + u.h * hy + Math.sin(i * 0.9 + t * 2) * gr * 0.006; i ? g.lineTo(x, y) : g.moveTo(x, y); }
        g.stroke(); g.restore();
      }
      oben.push({ text: 'Wasserstand: ' + a.pegel + (a.pegel === 'sinkt' ? ' ↓' : '') });
    }
    if (a.hebel) unten.push({ text: a.hebel === 'zu' ? 'Hebel quer' + NBSP + '– zu' : 'Hebel längs' + NBSP + '– offen' });
    // Kontrolllampe: leuchtet bzw. ist dunkel
    if (a.lampe) {
      const an = a.lampe === 'an', [x, y] = [u.x + u.w * 0.84, u.y + u.h * 0.16], r = gr * 0.045;
      g.save();
      if (an) { g.shadowColor = '#7dff9a'; g.shadowBlur = r * (2 + Math.sin(t * 3)); }
      g.fillStyle = an ? '#5fe07c' : '#3a4046'; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
      g.shadowBlur = 0; g.lineWidth = 2; g.strokeStyle = '#222'; g.stroke(); g.restore();
      unten.push({ text: 'Kontrolllampe ' + (an ? 'an' : 'aus') });
    }
    // Durchfluss (l/min) und Wasserhärte (°dH am Teststreifen)
    if (a.durchfluss != null) unten.push({ text: 'Durchfluss ' + RB.komma(RB.zahl(a.durchfluss), 1) + NBSP + 'l/min', lcd: '#9fe8ff' });
    if (a.haerte != null) {
      const v = RB.zahl(a.haerte), x0 = u.x + u.w * 0.2, y0 = u.y + u.h * 0.06, bw = u.w * 0.6, bh = gr * 0.07;
      g.save(); g.fillStyle = '#f7f7f2'; RB.rund(g, x0, y0, bw, bh, 4); g.fill(); g.strokeStyle = '#999'; g.stroke();
      // vier Felder, die je nach Härte umschlagen (grün → violett)
      [3, 7, 14, 21].forEach((grenze, i) => {
        g.fillStyle = v >= grenze ? '#8e44ad' : '#7cb342';
        g.fillRect(x0 + bw * (0.1 + i * 0.22), y0 + bh * 0.2, bw * 0.16, bh * 0.6);
      });
      g.restore();
      unten.push({ text: 'Teststreifen: ' + RB.komma(v, 0) + NBSP + '°dH' });
    }
    if (a.zustand) {
      const mi = m.mitte ? u.p(m.mitte[0], m.mitte[1]) : [u.x + u.w / 2, u.y + u.h / 2];
      if (a.zustand === 'tropft' && m.tropfen) {   // Tropfen hängt an der undichten Stelle und fällt bis zum unteren Lupenrand
        const q = u.p(m.tropfen[0], m.tropfen[1]), boden = k.y + k.r * 0.9;
        RB.wasserTropfen(g, q[0], q[1], Math.max(q[1] + gr * 0.08, boden), Math.max(14, gr * 0.1), t, { takt: 2.4, spritzer: boden > q[1] + gr * 0.12 });
      } else RB.zustand(g, a.zustand, mi[0], mi[1], gr * 0.5, t, u);   // u: Beläge nur auf dem Bauteil (Alpha des Lupenbilds)
    }
    // Schilder im Lupenkreis stapeln: unten von der Unterkante nach oben, oben von der Oberkante nach unten
    const luft = fs * 0.25;
    let yu = k.y + k.r * 0.86;
    unten.forEach(x => { yu -= schildKreis(g, k, yu, x.text, fs, x.lcd, 1) + luft; });
    let yo = k.y - k.r * (a.haerte != null ? 0.6 : 0.86);
    oben.forEach(x => { yo += schildKreis(g, k, yo, x.text, fs, x.lcd, -1) + luft; });
  }

  // ---------- Meister-Tipp (nur Azubi, −30) und Lösung ----------
  function meisterTipp() {
    if (!ST().tipp) return;
    E.tipp = true;
    leiste();
    const tipps = [E.st.tipp].concat(E.m2 && E.st.m2.tipp ? [E.st.m2.tipp] : []).filter(Boolean);
    const vorher = E.phase;
    E.phase = 'tipp';
    // Einleitung und Tipp in einer Sprechblase; bei zwei Ursachen (Meister-Modus gibt es keinen Tipp) je eine
    const saetze = tipps.map((t, i) => ({ text: (i ? '' : zufall(D.meister.tippEinleitung) + ' ') + t, stimmung: 1 }));
    gespraech('meister', saetze, 'Danke', () => { E.phase = vorher; leiste(); });
  }

  // ---------- Diagnose ----------
  function diagnose() {
    E.phase = 'diagnose';
    const st = E.st, n = ST().optionen;
    let optionen;
    if (E.m2) {
      const falsch = mischen(st.diagnose.falsch.concat(st.m2.diagnose.falsch)).slice(0, n - 2);
      optionen = [{ text: st.diagnose.richtig, richtig: 'haupt', alltag: st.diagnose.richtigAlltag }, { text: st.m2.diagnose.richtig, richtig: 'm2', alltag: st.m2.diagnose.richtigAlltag }].concat(falsch);
    } else optionen = [{ text: st.diagnose.richtig, richtig: 'haupt', alltag: st.diagnose.richtigAlltag }].concat(mischen(st.diagnose.falsch).slice(0, n - 1));
    optionen = E.optionen || (E.optionen = mischen(optionen));
    const liste = el('div', 'rb-optionen'), rueck = el('p', 'rb-rueck');
    const kopf = el('p', 'rb-diagfrage', E.m2 ? 'Hier stecken zwei Ursachen dahinter – finde beide.' : zufall(D.rahmen.diagnoseFrage));
    const optBenutzt = new Set();   // QA S3 (8): auf dem Ursachen-Bildschirm jeden Begriff nur einmal unterstreichen
    optionen.forEach(o => {
      const b = knopf('', 'option');
      // Azubi (Schicht 2): oben die Alltagsfassung, darunter der Fachbegriff-Text – vollständig und gut lesbar (MZ: Fachbegriffe
      // werden nie ersetzt, nur erklärt). Alle Stufen: Fachbegriffe unterstrichen, antippbar.
      if (stufe === 'azubi' && o.alltag) {
        b.classList.add('zweizeilig');
        b.append(el('span', 'rb-alltag', o.alltag), fachEl('span', 'rb-fachtext', o.text, optBenutzt));
      } else b.append(fach(o.text, optBenutzt));
      b.setAttribute('aria-label', o.alltag && stufe === 'azubi' ? o.alltag + ' – ' + o.text : o.text);
      if (o.erledigt) { b.disabled = true; b.classList.add(o.richtig ? 'richtig' : 'falsch'); }
      b.addEventListener('click', () => {
        if (o.erledigt) return;
        o.erledigt = true; b.disabled = true;
        if (o.richtig) {
          b.classList.add('richtig'); R_.ton('gut');
          E.richtigGefunden.push(o.richtig);
          ursacheNotiz(o.text);
          const alle = E.m2 ? 2 : 1;
          if (E.richtigGefunden.length >= alle) {
            // Spielertest 25.10.2026: statt Warten gleich ein „Weiter“-Knopf (Tippen ins Fenster geht auch); Uhr steht solange
            E.phase = 'erkannt';
            liste.querySelectorAll('button').forEach(x => { x.disabled = true; });
            rueck.textContent = 'Richtig erkannt.'; rueck.className = 'rb-rueck gut mitweiter';
            let weg = false;
            const weiter = () => { if (weg) return; weg = true; nah.removeEventListener('click', tippen); nahWeg(); werkzeugPhase(); };
            const tippen = e => {
              if (weg || !E || E.phase !== 'erkannt') { nah.removeEventListener('click', tippen); return; }   // schon weiter (auch über ✕)
              if (!e.target.closest('button') && !e.target.closest('.rb-diagnotizen')) weiter();
            };
            const w = knopf('Weiter', 'haupt rb-diagweiter', weiter);
            rueck.append(w);
            setTimeout(() => { nah.addEventListener('click', tippen); w.focus({ preventScroll: true }); nahPlatz(); const n = nah.getBoundingClientRect(), r = w.getBoundingClientRect(); if (r.bottom > n.bottom - 4) nah.scrollTop += r.bottom - n.bottom + 10; }, 0);
          } else { rueck.textContent = nb('Eine Ursache gefunden – es gibt noch eine zweite.'); rueck.className = 'rb-rueck gut'; }
        } else {
          b.classList.add('falsch'); R_.ton('fehler'); R_.vibrieren(60); signal('fehl');
          E.fehlDiag++;
          rueck.textContent = nb(o.rueck || 'Das passt nicht zu dem, was du gefunden hast.'); rueck.className = 'rb-rueck falsch';
          if (!E.fehlgriffGesagt) { E.fehlgriffGesagt = true; meldung(D.figuren[E.figur].name + ': „' + zufall(D.figuren[E.figur].fehlgriff) + '“', 'kunde'); }
          if (E.fehlDiag >= 3) loesungZeigen();
        }
      });
      liste.append(b);
    });
    // Notizen als Kopie daneben – nur sichtbar, wenn die Auswahl quer die Leiste überdeckt
    const notizKopie = el('div', 'rb-diagnotizen');
    notizKopie.append(el('h3', '', 'Notizen'), notizen.querySelector('ul').cloneNode(true));
    // ✕ nach „Richtig erkannt“ = Weiter (sonst bliebe der Einsatz ohne offene Ursache stehen)
    nahZeigen('diagnose', 'Ursache', [kopf, liste, rueck, notizKopie], () => { if (E.phase === 'erkannt') return werkzeugPhase(); E.phase = 'untersuchen'; leiste(); });
  }
  function loesungZeigen() {
    E.loesungGezeigt = true;
    const fehlt = [];
    if (!E.richtigGefunden.includes('haupt')) fehlt.push(E.st.diagnose.richtig);
    if (E.m2 && !E.richtigGefunden.includes('m2')) fehlt.push(E.st.m2.diagnose.richtig);
    E.richtigGefunden = E.m2 ? ['haupt', 'm2'] : ['haupt'];
    fehlt.forEach(ursacheNotiz);
    nahWeg();
    // Meister zeigt die Lösung (Rahmen-Entwurf „Rückmeldungen im Spiel“); zwei Ursachen im Meister-Modus mit „und“
    gespraech('meister', [{ text: RB.rueck('loesung', 'Ich zeig’s dir: {ursache}.', { ursache: fehlt.join(' und ') }), stimmung: 2 }], 'Verstanden', werkzeugPhase);
  }

  // ---------- Werkzeug packen (Spieltest MZ, 24.10.2026) ----------
  // Einblendung „Welches Werkzeug brauchst du?“, dann drei gleichwertige Knöpfe Werkzeugkoffer – Transporter – Im Raum suchen.
  // Azubi: nur das Hauptwerkzeug; ein anderes Teil der Packliste = Hinweis ohne Abzug. Geselle: ganze Packliste, das Spiel
  // nennt die Anzahl und sagt sofort, ob ein Teil passt. Meister: ganze Packliste ohne Anzahl und ohne Rückmeldung, packt
  // ein und aus, bis er „Fertig gepackt“ tippt – dann kosten Fehlendes und Unnötiges je −20.
  const T = (k, ersatz, werte) => RB.rueck(k, ersatz, werte);
  const knoepfeWerkzeug = () => { const k = D.rahmen.knoepfeWerkzeug; return k && k.length === 3 ? k : ['Werkzeugkoffer', 'Transporter', 'Im Raum suchen']; };
  const anzahlText = () => E.brauche.length === 1 ? T('anzahlPackenEins', 'Du brauchst nur 1 Ding.') : T('anzahlPacken', 'Du brauchst {n} Dinge.', { n: E.brauche.length });
  const istNoetig = name => E.brauche.some(b => b.name === name);
  // Azubi wählt ein Teil der Packliste, das nicht das Hauptwerkzeug ist: immer genau MZs Satz, keine Varianten (MZ, 24.10.2026)
  const NICHT_WICHTIGSTE = 'Stimmt, aber du brauchst etwas anderes mehr.';
  let transporterBild = null;   // umgefärbt, einmal
  function transporterUrl() {
    if (!transporterBild) transporterBild = RB.bild('bilder/transporter.webp').fertig.then(i => i ? R_.umfaerben(i).toDataURL('image/webp', 0.85) : '');
    return transporterBild;
  }
  function wahlKnopf(text, art, klick) {
    const b = el('button', 'rb-wahlknopf ' + art + (E.wahl === art ? ' aktiv' : ''));
    b.type = 'button';
    const bild = el('span', 'rb-wahlbild');
    if (art === 'koffer') bild.style.backgroundImage = 'url("bilder/koffer.webp")';
    if (art === 'transporter') transporterUrl().then(u => { if (u) bild.style.backgroundImage = `url("${u}")`; });
    // „Werkzeugkoffer“ darf auf sehr schmalen Handys trennen (weiches Trennzeichen)
    b.append(bild, el('span', 'rb-wahltext', String(text).replace(/^Werkzeug(?=\S)/, 'Werkzeug­')));
    b.addEventListener('click', () => { if (art === 'raum') R_.ton('klick'); klick(); });
    return b;
  }
  function werkzeugPhase() {
    E.phase = 'werkzeug';
    E.werkzeugText = zufall(D.rahmen.werkzeugsuche);
    E.herkunftHinweis = stufe === 'azubi';
    E.raumSuche = false; E.wahl = null;
    leiste(); markenSetzen();
    meldung('');
    if (HASH.phase === 'handgriff' && E.nr === 1 && E.sprungHandgriff) { E.eingepackt = E.brauche.map(b => b.name); setTimeout(sicherheit, 50); return; }
    werkzeugFrage();
  }
  // kurze Einblendung beim Wechsel zur Werkzeugsuche (Uhr steht), Tippen überspringt
  // MZ-Wortlaut (Spieltest Phase 3): Azubi „Welches Werkzeug brauchst du? Schau dich auch im Raum um.“, Geselle/Meister
  // „Welche Werkzeuge …“. Frage groß, der Satz danach als Zeile darunter (Geselle: Anzahl als dritte Zeile).
  function werkzeugFrage() {
    const t = el('div', 'rb-titel rb-wzfrage');
    const text = stufe === 'azubi' ? T('werkzeugFrage', 'Welches Werkzeug brauchst du? Schau dich auch im Raum um.')
      : T('werkzeugFragePacken', 'Welche Werkzeuge brauchst du? Schau dich auch im Raum um.');
    const teil = /^(.+?\?)\s+(.+)$/.exec(text);
    t.append(el('strong', '', teil ? teil[1] : text));
    if (teil) t.append(el('span', 'rb-wzzusatz', teil[2]));
    if (ST().anzahl) t.append(el('small', '', anzahlText()));
    let fertig = false;
    const los = () => { if (fertig) return; fertig = true; clearTimeout(uhr); szeneWeg(); };
    const uhr = setTimeout(los, RB.ruhig ? 1200 : 2900);
    szeneZeigen('titel wzfrage', [t], los);
  }
  function raumSuchen() {
    nahWeg();
    E.raumSuche = true; E.wahl = 'raum';
    leiste(); markenSetzen();
    meldung('Tippe die Verstecke im Raum an.', '');
  }
  // Packstand in der Leiste (Geselle: „Eingepackt 2/3“, Meister: ohne Gesamtzahl, Teile antippen = wieder auspacken)
  function packstand() {
    const box = el('div', 'rb-packstand'), n = E.eingepackt.length, meister = !ST().rueckmeldung;
    box.append(el('div', 'rb-packkopf', ST().anzahl ? `Eingepackt ${n}/${E.brauche.length}` : `Eingepackt: ${n}`));
    const liste = el('div', 'rb-packliste');
    if (!n) liste.append(el('span', 'rb-packleer', 'Noch nichts eingepackt.'));
    E.eingepackt.forEach(name => {
      const chip = el(meister ? 'button' : 'span', 'rb-packteil');
      chip.append(RB.werkzeugBild(name, 28), el('span', '', name));
      if (meister) {
        chip.type = 'button'; chip.title = 'Wieder auspacken'; chip.setAttribute('aria-label', name + ' wieder auspacken');
        chip.append(el('i', '', '✕'));
        chip.addEventListener('click', () => { R_.ton('klick'); auspacken(name); });
      }
      liste.append(chip);
    });
    box.append(liste);
    if (meister) { const f = knopf('Fertig gepackt', 'haupt rb-packfertig', packenFertig); f.disabled = !n; box.append(f); }
    return box;
  }
  // alle Gegenstände einer Herkunft aus den Störungen dieses Orts (Ablenkung in Koffer bzw. Transporter)
  function herkunftPool(wo, ort) {
    const s = new Set();
    D.stoerungen.filter(x => x.ort === (ort || E.ort)).forEach(x => [x.werkzeug].concat(x.dazu || [], x.m2 ? [x.m2.werkzeug].concat(x.m2.dazu || []) : [])
      .forEach(w => { if (w && w.name && w.herkunft === wo) s.add(w.name); }));
    return [...s];
  }
  // Inhalt von Koffer bzw. Transporter (je Einsatz einmal gewürfelt): was gebraucht wird, immer; dazu mindestens 4 andere
  // Dinge (8–9 Fächer). Im Transporter liegen außerdem immer die Hundekekse (MZ, 25.10.2026) – an fester Stelle je Einsatz.
  // e: Einsatz (Standard: der laufende) – durchgangDateien legt den Inhalt schon beim Planen fest (offline ablegen)
  function lagerInhalt(wo, e) {
    e = e || E;
    if (!e['inhalt_' + wo]) {
      const hier = e.packliste.filter(b => b.herkunft === wo).map(b => b.name);
      const pool = [...new Set((W[wo] || []).concat(herkunftPool(wo, e.ort)))].filter(n => !e.packliste.some(p => p.name === n));
      e['inhalt_' + wo] = mischen(hier.concat(mischen(pool).slice(0, Math.max(4, 8 - hier.length))));
      if (wo === 'transporter') e.keksPlatz = Math.floor(Math.random() * (e['inhalt_' + wo].length + 1));
    }
    return e['inhalt_' + wo];
  }
  // zk = Zwischenfall ZF-25 (Aktion keks): nur die Hundekekse sind antippbar, sonst wie gewohnt
  function lager(wo, zk) {
    if (!zk) { E.wahl = wo; leiste(); }
    const inhalt = lagerInhalt(wo);
    const box = el('div', 'rb-lager ' + wo), raster = el('div', 'rb-fach');
    const bild = el('img', 'rb-lagerbild'); bild.alt = '';
    if (wo === 'transporter') transporterUrl().then(u => { if (u) bild.src = u; });
    else bild.src = 'bilder/koffer.webp';
    box.append(bild, raster);
    inhalt.forEach(name => {
      const b = el('button', 'rb-teil'); b.type = 'button'; b.dataset.name = name;
      b.append(RB.werkzeugBild(name, 96), el('span', '', name));
      if (zk) { b.disabled = true; b.classList.add('ruht'); }
      else { teilStatus(b); b.addEventListener('click', () => { packen(name); teilStatus(b); }); }
      raster.append(b);
    });
    if (wo === 'transporter') {
      const k = el('button', 'rb-teil keks'); k.type = 'button'; k.dataset.keks = '1';
      k.append(RB.werkzeugBild(KEKSE, 96), el('span', '', KEKSE));
      k.addEventListener('click', () => { R_.ton('klick'); if (zk) zk(); else keksOhneAuftrag(); });
      raster.insertBefore(k, raster.children[Math.min(E.keksPlatz || 0, raster.children.length)] || null);
    }
    nahZeigen('lager', wo === 'koffer' ? knoepfeWerkzeug()[0] : knoepfeWerkzeug()[1], [box], zk ? null : () => { E.wahl = null; leiste(); });
    // Koffer aufklappen bzw. Schiebetür auf – beim Schließen (auch automatisch) Tür zu
    ton(wo === 'koffer' ? 'koffer' : 'tuer-auf');
    const vorher = nahStopp;
    nahStopp = () => { if (vorher) vorher(); if (wo === 'transporter') ton('tuer-zu'); };
  }
  // Hundekekse ohne Auftrag (MZ, 25.10.2026): kein Abzug, kein Fehlgriff, sie bleiben im Transporter. Mit Gustl im Einsatz
  // (Herr Wimmer) „Die muss sich Gustl erst verdienen.“, sonst „Die brauchst du hier nicht.“
  const KEKSE = 'Hundekekse';
  function keksOhneAuftrag() {
    meldung(E.figur === 'wimmer' ? T('keksOhneAuftrag', 'Die muss sich Gustl erst verdienen.') : T('keksOhneHund', 'Die brauchst du hier nicht.'), 'info');
  }
  function teilStatus(b) {
    const name = b.dataset.name, meister = !ST().rueckmeldung;
    b.classList.remove('genommen', 'falsch', 'nebenbei');
    const st = E.eingepackt.includes(name) ? 'genommen' : E.falschGenommen.includes(name) ? 'falsch' : E.nebenbei.includes(name) ? 'nebenbei' : '';
    if (st) b.classList.add(st);
    b.disabled = !!st && !(meister && st === 'genommen');
    b.setAttribute('aria-pressed', st === 'genommen' ? 'true' : 'false');
  }
  function teileAuffrischen() { nah.querySelectorAll('.rb-teil').forEach(teilStatus); }
  // Ein Griff (Koffer, Transporter oder Fund im Raum mit „Ja“). Ergebnis: 'gepackt' | 'aus' | 'nebenbei' | 'falsch'
  function packen(name) {
    if (!ST().rueckmeldung) {   // Meister: einpacken bzw. wieder auspacken, ohne Rückmeldung
      if (E.eingepackt.includes(name)) { auspacken(name); return 'aus'; }
      E.eingepackt.push(name); ton('einpacken');
      meldung(name + ' eingepackt.', '');
      leiste(); return 'gepackt';
    }
    if (istNoetig(name)) {
      if (!E.eingepackt.includes(name)) E.eingepackt.push(name);
      ton('einpacken'); ton('gut', { verzoegerung: 0.15 });
      const rest = E.brauche.filter(b => !E.eingepackt.includes(b.name)).length;
      meldung(name + ' eingepackt.' + (rest && ST().anzahl ? ' ' + T('nochNichtAlles', 'Noch {rest} offen.', { rest }) : ''), 'gut');
      leiste(); gefundenPruefen(); return 'gepackt';
    }
    if (stufe === 'azubi' && E.packliste.some(p => p.name === name)) {   // steht auf der Packliste, ist aber nicht das Wichtigste
      if (!E.nebenbei.includes(name)) E.nebenbei.push(name);
      R_.ton('klick');
      meldung(NICHT_WICHTIGSTE, '');
      return 'nebenbei';
    }
    if (!E.falschGenommen.includes(name)) {   // unnötig: −20 (einmal je Teil)
      E.fehlWerk++; E.falschGenommen.push(name);
      R_.ton('fehler'); R_.vibrieren(60); signal('fehl');
    }
    meldung(unnoetigText(name), 'falsch');
    E.herkunftHinweis = true; leiste();
    return 'falsch';
  }
  function unnoetigText(name) {
    const t = T('unnoetig', '{werkzeug} brauchst du hier nicht.', { werkzeug: name });
    return t.includes(name) ? t : name + ': ' + t;
  }
  function auspacken(name) {
    E.eingepackt = E.eingepackt.filter(n => n !== name);
    R_.ton('klick');
    Object.values(E.verstecke).forEach(f => { if (f && f.name === name) f.genommen = false; });   // Fund kommt zurück ins Versteck
    meldung(name + ' wieder ausgepackt.', '');
    leiste(); teileAuffrischen();
  }
  function gefundenPruefen() {
    leiste();
    if (ST().rueckmeldung && E.brauche.every(b => E.eingepackt.includes(b.name))) {
      E.phase = 'gepackt';   // Uhr steht
      leiste(); markenSetzen();
      setTimeout(() => { nahWeg(); sicherheit(); }, RB.ruhig ? 200 : 800);
    }
  }
  // Wo ein Teil der Packliste lag: „im Werkzeugkoffer“, „im Transporter“, „im Raum (Versteck)“
  function fundort(name) {
    const p = E.packliste.find(x => x.name === name) || {}, kn = knoepfeWerkzeug();
    if (p.herkunft === 'raum') {
      const v = Object.keys(E.verstecke).find(n => E.verstecke[n] && E.verstecke[n].name === name);
      return 'im Raum' + (v ? ' (' + v + ')' : '');
    }
    return 'im ' + (p.herkunft === 'transporter' ? kn[1] : kn[0]);
  }
  // Meister: „Fertig gepackt“ – Fehlendes und Unnötiges zählen je −20, dann geht es weiter (nie scheitern)
  function packenFertig() {
    const fehlt = E.brauche.filter(b => !E.eingepackt.includes(b.name)).map(b => b.name);
    const unnoetig = E.eingepackt.filter(n => !istNoetig(n));
    // witzige Ablenker mit „Ja“ haben schon beim Fund −20 gekostet (eigene Reaktion) – sie stehen trotzdem als eigene Zeile
    // in der Packliste, damit die Summe der Zeilen genau die Werkzeug-Punkte ergibt (QA Spieltest-Runde, 25.10.2026)
    const schonAbgezogen = E.falschGenommen.filter(n => !E.eingepackt.includes(n));
    E.fehlWerk += fehlt.length + unnoetig.length;
    E.packFehlt = fehlt; E.packUnnoetig = unnoetig.concat(schonAbgezogen);
    E.phase = 'packpruefung';
    nahWeg(); leiste(); markenSetzen();
    if (!fehlt.length && !unnoetig.length && !schonAbgezogen.length) {
      R_.ton('gut'); meldung('Alles dabei.', 'gut');
      setTimeout(sicherheit, RB.ruhig ? 200 : 900);
      return;
    }
    R_.ton('fehler'); signal('fehl');
    const box = el('div', 'rb-packpruefung'), ul = el('ul');
    const packBenutzt = new Set();
    E.brauche.filter(b => E.eingepackt.includes(b.name)).forEach(b => ul.append(fachEl('li', 'gut', '✓ ' + b.name, packBenutzt)));
    const zeile = (klasse, vorne, n) => { const li = el('li', klasse); li.append(fachEl('span', '', vorne + ' ' + n, packBenutzt), el('b', '', '−' + P.fehlgriff)); ul.append(li); };
    // Spielertest 25.10.2026: „Fehlt: Schüssel“ nennt den Fundort (Werkzeugkoffer, Transporter, Raum mit Versteck)
    fehlt.forEach(n => zeile('fehlt', 'Fehlt:', n + NBSP + '– ' + fundort(n)));
    unnoetig.concat(schonAbgezogen).forEach(n => zeile('unnoetig', 'Unnötig:', n));
    // Summe = Werkzeug-Punkte dieses Einsatzes (wie auf der Einsatzbuch-Karte, nie unter 0)
    const summe = el('li', 'summe');
    summe.append(el('span', '', 'Werkzeug'), el('b', '', Math.max(0, P.werkzeug - P.fehlgriff * E.fehlWerk) + '/' + P.werkzeug));
    ul.append(summe);
    // je ein Satz aus dem Rahmen-Entwurf („Fehlt noch“, „Unnötig eingepackt“)
    const saetze = (fehlt.length ? [T('fehltNoch', 'Da fehlt noch etwas.')] : []).concat(unnoetig.length || schonAbgezogen.length ? [T('unnoetig', 'Das brauchst du hier nicht.')] : []);
    box.append(el('p', 'rb-packsatz', saetze.join(' ')), ul, knopf('Weiter', 'haupt', () => { nahWeg(); sicherheit(); }));
    nahZeigen('packpruefung', 'Packliste', [box], false);
  }
  // Fund im Raum: leer oder ein Gegenstand (richtiges Teil oder Ablenker) mit Frage Ja/Nein
  function versteck(n) {
    const zg = gruppeNehmen();   // aus dem Ausschnitt geöffnet: danach dorthin zurück
    const zu = () => nahZuGruppe(zg);
    if (!E.besucht.includes(n)) E.besucht.push(n);
    const fund = E.verstecke[n], box = el('div', 'rb-versteck');
    const titel = n.charAt(0).toUpperCase() + n.slice(1);
    if (!fund || fund.genommen) {
      ton('nichts');
      box.append(el('p', '', T('versteckLeer', 'Hier liegt nichts.')), knopf('Weiter suchen', 'zweit', zu));
      // Herkunfts-Hinweis (Geselle): erst nach 3 verschiedenen leeren Verstecken (oder einem Fehlgriff); Meister nie
      if (!E.leerBesucht) E.leerBesucht = [];
      if (!E.leerBesucht.includes(n)) E.leerBesucht.push(n);
      E.leereVerstecke = E.leerBesucht.length;
      if (E.leereVerstecke >= 3 && stufe === 'geselle') { E.herkunftHinweis = true; leiste(); }
      nahZeigen('versteckfund', titel, [box], zg ? zu : undefined);
      markenSetzen();
      return;
    }
    ton('kramen');
    const frageText = stufe === 'azubi' ? T('fundFrageAzubi', 'Brauchst du das am meisten, um das Problem zu lösen?') : T('fundFragePacken', 'Kommt das mit?');
    const antwort = el('p', 'rb-fundantwort'), knoepfe = el('div', 'rb-fundknoepfe');
    const weiter = () => { knoepfe.textContent = ''; knoepfe.append(knopf('Weiter suchen', 'zweit', zu)); fundEinpassen(); };
    knoepfe.append(knopf('Ja', 'haupt', () => {
      if (fund.art === 'ablenker' && fund.witzig) {   // witziger Ablenker: eigene Reaktion, zählt als unnötig (−20)
        if (!E.falschGenommen.includes(fund.name)) { E.fehlWerk++; E.falschGenommen.push(fund.name); }
        R_.ton('fehler'); signal('fehl');
        if (stufe === 'geselle') E.herkunftHinweis = true;   // Fehlgriff (Azubi hat ihn schon, Meister nie)
        leiste();
        antwort.textContent = nb(fund.witzig); antwort.className = 'rb-fundantwort witzig';
        return weiter();
      }
      const r = packen(fund.name);
      if (r === 'gepackt') { fund.genommen = true; markenSetzen(); zu(); return; }
      antwort.textContent = nb(r === 'nebenbei' ? NICHT_WICHTIGSTE : unnoetigText(fund.name));
      antwort.className = 'rb-fundantwort ' + (r === 'nebenbei' ? 'info' : 'falsch');
      weiter();
    }), knopf('Nein', 'zweit', () => {
      // Nein: der Fund bleibt im Versteck (kann später wieder gefunden werden). Kurze Meldung in der Leiste – bei jedem
      // Nein, damit sie beim Meister nicht verrät, ob es das Richtige war (Ersatztext, Schlüssel bleibtLiegen für den Text Writer)
      zu();
      meldung(T('bleibtLiegen', 'Bleibt liegen.'), '');
    }));
    box.append(RB.werkzeugBild(fund.name, FUNDBILD), el('p', 'rb-fundname', T('gefunden', '{werkzeug} gefunden – {versteck}.', { werkzeug: fund.name, versteck: n })), el('p', 'rb-fundfrage', frageText), antwort, knoepfe);
    nahZeigen('versteckfund', titel, [box], zg ? zu : undefined);
    markenSetzen();
  }
  // Fund-Fenster: passt der Inhalt nicht (flache Handys, lange witzige Reaktion), wird zuerst das Bild kleiner, dann
  // Abstände und Schrift (Klasse knapp) – alles bleibt ohne Scrollen sichtbar (QA Spieltest-Runde, 25.10.2026)
  const FUNDBILD = 110, FUNDBILD_MIN = 40;
  function fundEinpassen() {
    const c = nah.querySelector('.rb-versteck canvas');
    if (nah.hidden || !nah.classList.contains('versteckfund')) return;
    nah.classList.remove('knapp');
    const setzen = s => { if (c) c.style.width = c.style.height = Math.round(s) + 'px'; };
    setzen(FUNDBILD);
    const ueber = () => nah.scrollHeight - nah.clientHeight;
    if (ueber() <= 0) return;
    if (c) setzen(Math.max(FUNDBILD_MIN, FUNDBILD - ueber()));
    if (ueber() <= 0) return;
    nah.classList.add('knapp');
    if (c) { setzen(FUNDBILD); setzen(Math.max(FUNDBILD_MIN, FUNDBILD - ueber())); }
  }

  // ---------- Zwischenfälle (Phase 3, Baustein 5; Texte rohrbruch-zwischenfaelle-entwurf.md) ----------
  // Höchstens einer je Durchgang (in etwa jedem zweiten, MZ 25.10.2026), irgendwann beim Untersuchen oder bei der Werkzeugsuche. Uhr steht,
  // kein Abzug, jede Antwort führt ohne Nachteil zurück. Aktionen: tippen – suchen – ja-nein – wegtragen – warten.
  // MZ (25.10.2026, nach dem Spieltest Phase 3): seltener – höchstens ein Zwischenfall je Durchgang, in etwa jedem zweiten
  // Durchgang (50 %). Beim Start des Durchgangs gewürfelt: ob, und in welchem der 3 Einsätze (auch Einsatz 1); passt dort keiner
  // (Ort, Variante, Figur), weicht er auf einen anderen Einsatz aus. Test: #zwischenfall = sicher einer (im ersten passenden
  // Einsatz, nach 3s Uhr), #zwischenfall=ZF-08 = genau dieser (erster Einsatz, in dem er passt), #keinzwischenfall = keiner.
  const ZW_CHANCE = 0.5;
  function zwischenfallPassend(e) {
    const alle = D.zwischenfaelle || [];
    const fest = typeof HASH.zwischenfall === 'string' && alle.find(z => z.id === HASH.zwischenfall.toUpperCase());
    // ZF-26 (Eleonore) nur, wo sie lebt: Raumbild mit Gehege (MZ 25.10.2026: nur WP-A)
    const tierOk = z => zwTier(z.gegenstand) !== 'eleonore' || !!(RB.tierFuer && RB.tierFuer(e.figur, e.V) === 'eleonore');
    const pool = (fest ? [fest] : alle).filter(z => (!z.orte.length || z.orte.includes(e.ort)) && z.varianten.includes(e.variante) && (!z.figur || z.figur === e.figur) && tierOk(z));
    if (!pool.length) return null;
    // an eine Figur gebundene Szenen (Mimi, Gustl, Kind) bevorzugt, wenn die Figur den Einsatz hat
    const eigen = pool.filter(z => z.figur);
    return eigen.length && Math.random() < 0.6 ? zufall(eigen) : zufall(pool);
  }
  function zwischenfallPlanen(einsaetze) {
    if (HASH.keinzwischenfall || !(D.zwischenfaelle || []).length) return;
    if (!HASH.zwischenfall && Math.random() >= ZW_CHANCE) return;
    const idx = einsaetze.map((_, i) => i);
    const reihe = HASH.zwischenfall ? idx : (() => { const w = Math.floor(Math.random() * idx.length); return [w].concat(mischen(idx.filter(i => i !== w))); })();
    for (const i of reihe) {
      const z = zwischenfallPassend(einsaetze[i]);
      if (z) { einsaetze[i].zwischenfall = z; zwAblenkerWeg(einsaetze[i], z); return; }
    }
  }
  // Ist der Gegenstand des Zwischenfalls zugleich Ablenker in einem Versteck (z. B. Stressball), liegt dort ein anderer Ablenker
  // des Orts – sonst bleibt das Versteck leer, solange noch etwas anderes im Raum liegt (Text Writer, 25.10.2026)
  function zwAblenkerWeg(e, z) {
    const ding = zwName(z.gegenstand);
    Object.keys(e.verstecke).forEach(v => {
      const f = e.verstecke[v];
      if (!f || f.art !== 'ablenker' || f.name !== ding) return;
      const ersatz = (e.ablenkerRest || []).find(a => a.name !== ding && !Object.values(e.verstecke).some(x => x && x.name === a.name));
      if (ersatz) e.verstecke[v] = { name: ersatz.name, art: 'ablenker', witzig: ersatz.witzig || '' };
      else if (Object.values(e.verstecke).filter(Boolean).length > 1) e.verstecke[v] = null;
    });
  }
  const zwName = g => String(g || '').replace(/\s*\(.*\)\s*$/, '').trim();   // „Werkzeugkoffer (Visitenkarten im Deckel)“ → „Werkzeugkoffer“
  const zwTier = g => /Mimi/.test(g) ? 'mimi' : /Gustl/.test(g) ? 'gustl' : /Eleonore/.test(g) ? 'eleonore' : null;
  function zwischenfallPruefen() {
    if (!E || !E.zwischenfall || E.zwFertig || !uhrLaeuft() || E.uhrStopp || !nah.hidden) return;
    if (!['untersuchen', 'werkzeug'].includes(E.phase) || E.zeit < E.zwAb) return;
    zwischenfallStart();
  }
  // Bild eines Gegenstands: Tier, Koffer, Werkzeug/Ablenker – sonst Platzhalter (neue Motive wie Lichtschalter folgen)
  // Teile des Raumbilds bzw. neue Motive (rohrbruch-zwischenfall.png): Dachfenster mit Taube → Taube
  // ZF-05 (Texte 25.10.2026): „Visitenkarten im Kofferdeckel“ → Motiv Visitenkarten
  const ZW_MOTIV = { Dachfenster: 'Taube', 'Visitenkarten im Kofferdeckel': 'Visitenkarten' };
  function zwBild(gegenstand, groesse) {
    const tier = zwTier(gegenstand), name = zwName(gegenstand);
    if (tier) { const i = el('img', 'rb-zwbild tier'); i.alt = name; i.src = RB.tierBild(tier, tier === 'eleonore' ? 'duckt' : 'sitzt'); i.style.height = groesse + 'px'; return i; }
    if (name === 'Werkzeugkoffer') { const i = el('img', 'rb-zwbild'); i.alt = name; i.src = 'bilder/koffer.webp'; i.style.height = groesse + 'px'; return i; }
    return RB.werkzeugBild(ZW_MOTIV[name] || name, groesse);
  }
  // Licht aus bzw. Strom weg (ZF-07, ZF-12, ZF-17): Raum während des Zwischenfalls abdunkeln (kein Einfluss auf Befunde)
  const zwDunkel = z => /Licht|Strom|Sicherung|Glühbirne/.test(z.ausloeser || '');
  // Klang zu Licht aus/an: Zeitschalter bzw. Lichtschalter klickt, Sicherung klackt dumpf (Glühbirne: still beim Ausgehen)
  const zwLichtTon = (z, an) => {
    const t = (z.ausloeser || '') + ' ' + (z.gegenstand || '');
    if (/Strom|Sicherung/.test(t)) ton('einrasten', { rate: 0.82, faktor: an ? 0.9 : 0.6 });
    else if (an || /Licht/.test(z.ausloeser || '')) ton('licht', { faktor: an ? 1 : 0.6 });
  };
  // Lichtschalter im dunklen Raum nur, wo er eingemessen ist (orte.js V.schalter: HK, HA) und nicht bei Strom/Sicherung
  const zwSchalterImRaum = z => z.aktion === 'tippen' && zwDunkel(z) && !!(E && E.V.schalter) && !/Strom|Sicherung/.test((z.ausloeser || '') + ' ' + (z.gegenstand || ''));
  // ZF-25 (Aktion keks): Gustl nimmt den Lappen schon vor dem Dialog ins Maul (Kundensatz „Gustl hat Ihren Lappen im Maul“).
  // RB.leben.lappen(true) gibt false zurück, wenn gerade Mimi im Raum sitzt (oder kein lebender Hintergrund da ist) – dann fällt
  // der Zwischenfall in diesem Einsatz aus.
  const lappenSetzen = an => { try { return !!(RB.leben && RB.leben.lappen && RB.leben.lappen(an)); } catch (e) { return false; } };
  function zwischenfallStart() {
    const z = E.zwischenfall, vorher = E.phase;
    E.zwFertig = true;
    if (z.aktion === 'keks' && !lappenSetzen(true)) return;
    // ZF-26 „Ausgebüxt“: Gehege steht offen und leer (leben.js); ohne Gehege (kein lebender Hintergrund) fällt er aus
    const kaninchen = zwTier(z.gegenstand) === 'eleonore';
    if (kaninchen && !(RB.leben.ausgebuext && RB.leben.ausgebuext(true))) return;
    E.phase = 'zwischenfall';
    nahWeg(); markenSetzen();
    raum.classList.toggle('dunkel', zwDunkel(z));
    if (zwDunkel(z)) { signal('dunkel'); zwLichtTon(z, false); }
    if (zwTier(z.gegenstand) && !kaninchen) RB.leben.tierWeg();
    const t = el('div', 'rb-titel rb-zwtitel');
    t.append(el('small', '', zufall((D.rahmen.rueckmeldungen || {}).zwischenfallTitel || []) || 'Kurze Unterbrechung'), el('strong', '', z.titel));
    let fertig = false;
    const los = () => { if (fertig) return; fertig = true; clearTimeout(uhr); szeneWeg(); zwDialog(z, vorher); };
    const uhr = setTimeout(los, RB.ruhig ? 900 : 1800);
    szeneZeigen('titel zwischenfall', [t], los);
  }
  // Gespräch: Kunde (Figur des Einsatzes), Meister (Funk/Telefon) – Nachbarin und Kind ohne Bild, Sprechblase vom Bildrand
  function zwDialog(z, vorher) {
    const sp = z.sprecher, kunde = sp === 'Kunde', meister = sp === 'Meister';
    const hg = el('div', 'rb-hg'); hg.style.backgroundImage = `url("${E.V.bild}")`;
    const teile = [hg];
    let name = sp;
    if (kunde || meister || (sp === 'Kind' && z.figur)) {
      const platz = el('div', 'rb-figurplatz' + (meister ? ' meister' : '')), fig = el('img', 'rb-figur');
      const wer = meister ? 'meister' : E.figur, nr = sp === 'Kind' ? 3 : 2;
      if (meister) meisterBild(nr).then(u => { fig.src = u; }); else fig.src = figurBild(wer, nr);
      const m = FIG[wer]; if (m && m[nr - 1]) platz.style.setProperty('--seite', m[nr - 1].w / m[nr - 1].h);
      platz.append(fig); teile.push(platz);
      if (kunde) name = D.figuren[E.figur].name;
      if (meister) name = ((K.meister && K.meister.name) || D.meister.name) + NBSP + '– Telefon';
    }
    const spalte = el('div', 'rb-blasen' + (kunde || meister ? '' : ' rand')), liste = el('div', 'rb-blasenliste');
    spalte.append(el('div', 'rb-name', name), liste);
    z.text.forEach((s, i) => { const b = el('div', 'blase', s); b.style.animationDelay = (i * 0.35) + 's'; liste.append(b); });
    const aufgabeT = el('p', 'rb-zwaufgabe', z.aktionText);
    const knoepfe = el('div', 'rb-zwknoepfe');
    spalte.append(aufgabeT, knoepfe);
    teile.push(spalte);
    const weiterKnopf = (text, f) => knopf(text || 'Weiter', 'haupt', f);
    const schluss = () => { szeneWeg(); zwEnde(z, vorher); };
    if (z.aktion === 'ja-nein') {
      const antwort = (a, ja) => {
        knoepfe.textContent = ''; aufgabeT.remove();
        const b = el('div', 'blase', a); liste.append(b);
        // Kaffee angenommen: die Tasse steht da (Motiv aus rohrbruch-zwischenfall.png)
        if (ja && /Kaffee/.test(z.ausloeser + z.titel)) { const t = RB.werkzeugBild('Tasse Kaffee', 72); t.classList.add('rb-zwtasse'); b.append(t); }
        while (liste.children.length > 2) liste.firstChild.remove();
        knoepfe.append(weiterKnopf('Weiter', schluss));
      };
      knoepfe.append(knopf('Ja', 'haupt', () => { R_.ton('klick'); antwort(z.ja, true); }), knopf('Nein', 'zweit', () => { R_.ton('klick'); antwort(z.nein, false); }));
    } else if (z.aktion === 'warten') {
      // kurz abwarten (Ring füllt sich in 3s), dann schließt ein Tippen
      const ring = el('div', 'rb-zwring'); ring.style.setProperty('--dauer', (RB.ruhig ? 0.6 : 3) + 's');
      const w = weiterKnopf('Weiter', schluss); w.disabled = true;
      knoepfe.append(ring, w);
      setTimeout(() => { w.disabled = false; ring.classList.add('voll'); }, RB.ruhig ? 600 : 3000);
    } else if (zwSchalterImRaum(z)) {
      // Licht aus (ZF-07; MZ 25.10.2026): nach dem Dialog bleibt der Raum dunkel, der Spieler tippt den sanft leuchtenden
      // Lichtschalter im Raum an – so sieht man im Dunkeln das Tier (Mimis Augen leuchten). ZF-12 (Sicherung im Flur) bleibt
      // beim Antippen im Dialog (Supervisor, 25.10.2026).
      knoepfe.append(weiterKnopf('Los', () => { szeneWeg(); zwImRaum(z, vorher); }));
    } else if (z.aktion === 'tippen') {
      const b = el('button', 'rb-zwding'); b.type = 'button';
      b.append(zwBild(z.gegenstand, 84), el('span', '', zwName(z.gegenstand)));
      b.addEventListener('click', () => {
        if (raum.classList.contains('dunkel')) zwLichtTon(z, true);
        R_.ton('gut'); b.disabled = true; b.classList.add('erledigt');
        let warte = 450;
        // Koffer: im Deckel stecken die Visitenkarten – kurz zeigen; Licht/Sicherung: Raum wird wieder hell
        if (zwName(z.gegenstand) === 'Werkzeugkoffer') { b.firstChild.replaceWith(RB.werkzeugBild('Visitenkarten', 84)); warte = 1100; }
        if (raum.classList.contains('dunkel')) { raum.classList.remove('dunkel'); signal('hell'); }
        setTimeout(schluss, RB.ruhig ? 100 : warte);
      });
      knoepfe.append(b);
    } else if (z.aktion === 'keks') {   // ZF-25: Hundekeks aus dem Transporter holen und Gustl geben
      knoepfe.append(weiterKnopf('Los', () => { szeneWeg(); zwKeks(z, vorher); }));
    } else {   // suchen, wegtragen: im Raum
      knoepfe.append(weiterKnopf('Los', () => { szeneWeg(); zwImRaum(z, vorher); }));
    }
    // Tippen zeigt alle Sprechblasen sofort ganz (sonst erscheinen sie nacheinander)
    szeneZeigen('gespraech zwischenfall', teile, () => liste.querySelectorAll('.blase').forEach(b => { b.style.animationDelay = '0s'; b.style.animationDuration = '.12s'; }));
  }
  // suchen: Gegenstand klein irgendwo im Raum (an einem Versteck- oder Stellenplatz) – antippen; nach 8s ein sanfter Ring als Hilfe.
  // wegtragen: Tier/Gegenstand an die Seite ziehen (markierter Streifen am Rand).
  function zwImRaum(z, vorher) {
    if (zwTier(z.gegenstand) === 'eleonore') { zwKaninchen(z, vorher); return; }
    aufgabe.textContent = nb(z.aktionText || ''); aktionen.textContent = ''; meldung('');
    const plaetze = Object.values(E.V.verstecke).concat(Object.values(E.V.stellen));
    const tier = zwTier(z.gegenstand), schalter = z.aktion === 'tippen';
    let p = zufall(plaetze);
    // Schalter/Sicherung an der Wand: Platz in Wandhöhe, bevorzugt nahe am Bildrand (wie neben einer Tür)
    if (schalter) p = E.V.schalter;   // eingemessen (orte.js, HK/HA: neben der Tür bzw. an der Wand)
    if (tier && /Kessel/.test(z.text.join(' ') + z.aktionText) && E.V.stellen['Kessel-Display']) { const k = E.V.stellen['Kessel-Display']; p = [k[0], Math.max(120, k[1] - 220)]; }
    else if (tier && E.V.tierPlatz) p = zufall(E.V.tierPlatz);
    const ding = el('button', 'rb-zwraum ' + (schalter ? 'suchen schalter' : z.aktion) + (tier ? ' tier' : '')); ding.type = 'button';
    ding.setAttribute('aria-label', zwName(z.gegenstand));
    const gross = tier ? Math.round(raum.clientWidth * (tier === 'gustl' ? 0.24 : 0.16)) : Math.max(schalter ? 40 : 34, Math.round(raum.clientWidth * (schalter ? 0.1 : z.aktion === 'suchen' ? 0.075 : 0.13)));
    ding.append(zwBild(z.gegenstand, gross));
    ding.style.left = Math.max(8, Math.min(92, p[0] / 10.24)) + '%'; ding.style.top = Math.max(8, Math.min(92, p[1] / 10.24)) + '%';
    raum.append(ding);
    let fertig = false;
    const gefunden = () => {
      if (fertig) return; fertig = true;
      if (schalter) zwLichtTon(z, true);
      R_.ton('gut');
      ding.classList.add('weg'); if (zone) zone.classList.add('weg');
      setTimeout(() => { ding.remove(); if (zone) zone.remove(); zwEnde(z, vorher); }, RB.ruhig ? 50 : 500);
    };
    let zone = null;
    if (schalter) ding.addEventListener('click', gefunden);   // leuchtet von Anfang an (CSS .schalter), keine Hilfe nötig
    else if (z.aktion === 'suchen') {
      ding.addEventListener('click', gefunden);
      setTimeout(() => { if (!fertig) ding.classList.add('hilfe'); }, 8000);
    } else {
      const links = p[0] > 512;
      zone = el('div', 'rb-zwzone ' + (links ? 'links' : 'rechts')); zone.append(el('span', '', links ? '⇠' : '⇢'));
      raum.append(zone);
      let zug = null;
      ding.addEventListener('pointerdown', e => {
        const r = raum.getBoundingClientRect(), d = ding.getBoundingClientRect();
        zug = { dx: e.clientX - (d.left + d.width / 2), dy: e.clientY - (d.top + d.height / 2), r };
        try { ding.setPointerCapture(e.pointerId); } catch (x) { /* egal */ }
        ding.classList.add('zieht'); e.preventDefault();
      });
      ding.addEventListener('pointermove', e => {
        if (!zug) return;
        const x = (e.clientX - zug.dx - zug.r.left) / zug.r.width * 100, y = (e.clientY - zug.dy - zug.r.top) / zug.r.height * 100;
        ding.style.left = Math.max(2, Math.min(98, x)) + '%'; ding.style.top = Math.max(4, Math.min(96, y)) + '%';
      });
      const los = () => {
        if (!zug) return; zug = null; ding.classList.remove('zieht');
        const d = ding.getBoundingClientRect(), zr = zone.getBoundingClientRect(), mx = d.left + d.width / 2;
        if (mx >= zr.left && mx <= zr.right) gefunden();
      };
      ding.addEventListener('pointerup', los); ding.addEventListener('pointercancel', los);
    }
  }
  // ZF-26 „Ausgebüxt“ (Kaninchen-Runde, MZ 25.10.2026): Eleonore (Pose „duckt“) sitzt halb versteckt an einem der eingemessenen
  // Plätze im Garten (orte.js V.kaninchen: hinter Gießkanne, Schlauchwagen, Pflanzkübel …). Was vor ihr steht, wird als Ausschnitt
  // des Raumbilds über sie gelegt (.rb-zwverdeck, Vielecke aus V.kaninchen[].verdeck) – sie sitzt dahinter. Antippen → sie ist
  // zurück im Gehege (RB.leben.ausgebuext(false)), Abschluss-Satz. Nach 8s pulsiert ein Ring als Hilfe. Uhr steht, kein Abzug.
  function zwKaninchen(z, vorher) {
    aufgabe.textContent = nb(z.aktionText || ''); aktionen.textContent = ''; meldung('');
    const v = zufall(E.V.kaninchen && E.V.kaninchen.length ? E.V.kaninchen : [{ fuss: [512, 900], h: 54 }]);
    const ding = el('button', 'rb-zwraum suchen kaninchen'); ding.type = 'button';
    ding.setAttribute('aria-label', zwName(z.gegenstand));
    const bild = el('img', 'rb-zwbild'); bild.alt = ''; bild.draggable = false; bild.src = RB.tierBild('eleonore', 'duckt');
    bild.style.height = Math.max(22, Math.round(v.h * (RB.ELEONORE_GROESSE || 1) * raum.clientHeight / 1024)) + 'px';
    if (v.spiegeln) bild.style.transform = 'scaleX(-1)';
    ding.append(bild);
    ding.style.left = v.fuss[0] / 10.24 + '%'; ding.style.top = v.fuss[1] / 10.24 + '%';
    raum.append(ding);
    const deck = (v.verdeck || []).map(poly => {
      const d = el('div', 'rb-zwverdeck');
      d.style.backgroundImage = `url("${E.V.bild}")`;
      d.style.clipPath = 'polygon(' + poly.map(([x, y]) => `${(x / 10.24).toFixed(2)}% ${(y / 10.24).toFixed(2)}%`).join(', ') + ')';
      raum.append(d);
      return d;
    });
    let fertig = false;
    ding.addEventListener('click', () => {
      if (fertig) return; fertig = true;
      R_.ton('gut');
      ding.classList.add('weg'); deck.forEach(d => d.classList.add('weg'));
      setTimeout(() => {
        ding.remove(); deck.forEach(d => d.remove());
        try { RB.leben.ausgebuext(false); } catch (e) { /* Tier ist Beiwerk */ }
        zwEnde(z, vorher);
      }, RB.ruhig ? 50 : 500);
    });
    setTimeout(() => { if (!fertig) ding.classList.add('hilfe'); }, 8000);
  }
  // ZF-25 „Gustl klaut den Lappen“ (Aktion keks): Gustl sitzt mit dem Lappen im Maul im Raum (RB.leben.lappen, Developer A).
  // Leiste: Aktion-Text + Knopf Transporter → dort ist nur der Hundekeks antippbar → Keks „in der Hand“ (Knopf in der Leiste)
  // → Gustl antippen oder den Knopf → Gustl legt den Lappen ab → Abschluss. Uhr steht, kein Abzug, kein Fehlversuch.
  function zwKeks(z, vorher) {
    // Gustl hat den Lappen seit dem Start des Zwischenfalls im Maul (zwischenfallStart)
    const name = zwName(z.gegenstand) || 'Hundekeks';
    aufgabe.textContent = nb(z.aktionText || ''); meldung('');
    let fertig = false;
    const holen = () => {
      aktionen.textContent = '';
      aktionen.append(wahlKnopf(knoepfeWerkzeug()[1], 'transporter', () => lager('transporter', genommen)));
      leisteMehr();
    };
    const genommen = () => {
      nahWeg(); R_.ton('gut');
      aktionen.textContent = '';
      const k = el('button', 'rb-knopf haupt rb-keksdabei'); k.type = 'button';
      k.append(RB.werkzeugBild(name, 30), el('span', '', name));
      k.addEventListener('click', geben);
      aktionen.append(k);
      E.keksInDerHand = true;
      leisteMehr();
    };
    const geben = () => {
      if (fertig || !E.keksInDerHand) return; fertig = true;
      E.keksInDerHand = false;
      raum.removeEventListener('click', tierTreffer, true);
      ton('keks'); ton('gut', { verzoegerung: 0.45 }); lappenSetzen(false);
      aktionen.textContent = '';
      setTimeout(() => zwEnde(z, vorher), RB.ruhig ? 100 : 700);
    };
    // Gustl antippen: Treffer über die Lage des Tier-Bilds (die Ebene des lebenden Hintergrunds darf pointer-events: none haben)
    const tierTreffer = e => {
      if (!E || !E.keksInDerHand) return;
      // Bild der Pose (leben.js: .rb-tierbox > .rb-tierpose > img), mit etwas Rand für den Finger
      const treffer = [...lebenEbene.querySelectorAll('.rb-tierpose:not(.weg) img')].some(t => {
        const r = t.getBoundingClientRect();
        return r.width && e.clientX >= r.left - 8 && e.clientX <= r.right + 8 && e.clientY >= r.top - 8 && e.clientY <= r.bottom + 8;
      });
      if (treffer) { e.stopPropagation(); e.preventDefault(); geben(); }
    };
    raum.addEventListener('click', tierTreffer, true);
    holen();
  }
  function zwEnde(z, vorher) {
    if (raum.classList.contains('dunkel')) { raum.classList.remove('dunkel'); signal('hell'); }
    E.phase = vorher;
    leiste(); markenSetzen();
    meldung(z.abschluss, 'info');
    // Abschluss-Satz nur kurz zeigen, dann wieder die normale Leiste (QA-Nachprüfung: blieb sonst stehen, z. B. ZF-25)
    const text = meldungEl.textContent;
    setTimeout(() => { if (meldungEl.textContent === text) meldung(''); }, RB.ruhig ? 5000 : 4500);
  }

  // ---------- Sicherheit und Handgriff ----------
  function reparaturen() {
    const r = [{ fuer: 'haupt', hg: E.st.handgriff, sicherheit: E.st.sicherheit, werkzeug: E.st.werkzeug.name }];
    if (E.m2) r.push({ fuer: 'm2', hg: E.st.m2.handgriff, sicherheit: E.st.m2.sicherheit, werkzeug: E.st.m2.werkzeug.name });
    return r;
  }
  function sicherheit(k) {
    k = k || 0;
    const r = reparaturen()[k];
    if (!r) return entstoeren();
    E.phase = 'sicherheit'; markenSetzen(); leiste();
    if (r.sicherheit) gespraech('meister', [{ text: T('sicherheitVorsatz', 'Zur Sicherheit:') + ' ' + r.sicherheit, stimmung: 2 }], 'Verstanden', () => handgriff(k));
    else handgriff(k);
  }
  function handgriff(k) {
    const r = reparaturen()[k];
    E.phase = 'handgriff'; leiste(); meldung('');
    let art = r.hg.art;
    if (HASH.handgriff && E.nr === 1 && k === 0) art = String(HASH.handgriff);
    const HG = RB.HANDGRIFFE[art] || RB.HANDGRIFFE['Entstören/Neustart'];
    const flaeche = el('div', 'rb-hgflaeche'), hinweis = el('p', 'rb-hghinweis', r.hg.hinweis || ''), z = hgZeilen(flaeche), info = z.info;
    nahZeigen('handgriff', 'Reparieren – ' + art, [hinweis, flaeche], false);
    hgNotizReiter();
    // Bauteil fürs Bild: Teil selbst (falls Lupenbild), Objekt aus den Parametern, sonst erste Befund-Stelle
    const B = O[E.ort].bauteile.stellen;
    const p = r.hg.param || {};
    let bt = B[r.werkzeug] ? r.werkzeug : null;
    // Objekt → Bauteil (Handgriff-Runde): genauer Name vor Teilwort – vorher gewann der erste Treffer („Schwimmer Hebeanlage“
    // → „Hebeanlage“, „Sieb Sensorarmatur“ → „Sensorarmatur“); ohne Treffer gemeinsames Wort ab 5 Buchstaben
    // nur beim Reinigen („Anschlussstutzen am Siphon“ → „Siphon Spüle“ statt der ersten Befund-Stelle)
    if (!bt && p.objekt) {
      const ob = String(p.objekt), worte = s => s.toLowerCase().split(/[^a-zäöüß]+/).filter(w => w.length >= 5);
      const wert = n => n === ob ? 1000 : ob.includes(n) ? n.length : n.includes(ob) ? ob.length : r.hg.art === 'Reinigen' ? 5 * worte(n).filter(w => worte(ob).includes(w)).length : 0;
      bt = Object.keys(B).map(n => [n, wert(n)]).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]).map(x => x[0])[0] || null;
    }
    if (!bt) bt = (r.fuer === 'm2' ? E.st.m2.stellen : E.st.stellen).filter(s => s.befund).map(s => s.name).find(n => B[n]);
    let notizText = '';
    // Anleitung nennt den Wert: Stufe (Zahl ohne Einheit), Wert mit Einheit (z. B. 50 °C) oder Stellung als Wort (z. B. Betrieb)
    if (r.werkzeug === 'Bedienungsanleitung' && p.ziel != null && r.hg.art === 'Einstellen') {
      const z = String(p.ziel).replace(/\s*bar$/, '').replace('.', ',');
      notizText = 'Laut Anleitung: ' + (/^\d+(,\d+)?$/.test(z) ? (p.einheit && p.einheit !== 'Stufe' ? z + NBSP + p.einheit : 'Stufe ' + z) : z) + '.';
    }
    if (/^\d{1,2}:\d{2}$/.test(String(p.ziel || ''))) notizText = 'Es ist jetzt ' + p.ziel + ' Uhr.';
    const o = {
      flaeche, param: p, werkzeug: r.werkzeug, bauteil: bt ? bauteilVon(bt) : null, notiz: notizText, stufe,   // stufe: Geschick je Stufe (handgriffe.js GESCHICK)
      // Fehlercode; ohne Code die Anzeige der Befund-Stelle (HA-08: „Regeneration“ statt „Störung“ vor dem Neustart)
      code: (E.stellen.find(s => s.anzeige && /^M[TLK]-/.test(s.anzeige.display || ''))
        || E.stellen.find(s => s.befund && s.anzeige && typeof s.anzeige.display === 'string') || { anzeige: {} }).anzeige.display,
      meldung(text, a) { hgMeldung(z, text, a); },
      fertig(guete) {
        E.rep[r.fuer] = guete;
        if (guete === 'genau') signal('gut');
        los();
        nahStopp = null;
        if (k + 1 < reparaturen().length) sicherheit(k + 1); else entstoeren();
      },
    };
    let los = () => {};
    nahStopp = () => { if (o.stop) o.stop(); los(); };
    HG(o);
    z.einsetzen();
    los = beobachten(info, [hinweis].concat([...flaeche.children].filter(x => !x.matches('canvas, .hg-lcd'))));
    nahPlatz();   // erst jetzt steht der Inhalt fest
  }
  // Spielertest 25.10.2026: Anweisung (Bedienung, bleibt stehen) und Rückmeldung („Gut im Takt“, „Zu fest …“) sind zwei
  // eigene Zeilen direkt über den Bedienknöpfen; die Knöpfe stehen am unteren Rand des Fensters, das Bild füllt den Rest.
  function hgZeilen(flaeche) {
    const anw = el('p', 'rb-hganweisung'), info = el('p', 'rb-hgmeldung');
    anw.setAttribute('aria-live', 'polite'); info.setAttribute('aria-live', 'polite');
    return { anw, info, einsetzen() { const k = flaeche.querySelector('.hg-knoepfe'); flaeche.insertBefore(anw, k); flaeche.insertBefore(info, k); } };
  }
  // art 'anweisung' = feste Bedienzeile; sonst Rückmeldung ('gut', 'falsch', 'info'; leerer Text = Zeile leeren)
  function hgMeldung(z, text, art) {
    const ziel = art === 'anweisung' ? z.anw : z.info;
    ziel.textContent = nb(text || '');
    if (ziel === z.info) { ziel.className = 'rb-hgmeldung ' + (art || ''); if (text) { ziel.classList.remove('neu'); void ziel.offsetWidth; ziel.classList.add('neu'); } }
    nahNachMessen(ziel);
  }
  // Notizen während des Handgriffs (Spielertest 25.10.2026): Deckt das Fenster die Leiste ab (Handy hochkant, quer flach),
  // gibt es oben rechts den Reiter „Notizen (n)“; Antippen klappt die Notizen über dem Fenster auf und wieder zu.
  function hgNotizReiter() {
    const quelle = notizen.querySelector('ul'), n = quelle.children.length;
    if (!n) return;
    const kopf = nah.querySelector('.rb-nahkopf');
    const reiter = knopf('Notizen (' + n + ')', 'zweit rb-hgreiter');
    reiter.setAttribute('aria-expanded', 'false');
    const feld = el('div', 'rb-hgnotizen'); feld.hidden = true;
    const ul = quelle.cloneNode(true);
    ul.querySelectorAll('li').forEach(li => { li.style.cursor = 'default'; });
    feld.append(el('h3', '', 'Notizen'), ul);
    const umschalten = auf => { feld.hidden = !auf; reiter.setAttribute('aria-expanded', String(auf)); reiter.classList.toggle('aktiv', auf); };
    reiter.addEventListener('click', () => { R_.ton('klick'); umschalten(feld.hidden); });
    feld.addEventListener('click', () => umschalten(false));
    kopf.append(reiter);
    nah.append(feld);
  }
  // automatischer Entstör-Schritt bei Fehlercode (zählt nicht zu den Punkten)
  function entstoeren() {
    E.uhrStopp = true;
    if (!E.st.entstoeren) return erledigt();
    E.phase = 'entstoeren';
    const flaeche = el('div', 'rb-hgflaeche'), z = hgZeilen(flaeche), info = z.info;
    const code = (E.stellen.find(s => s.anzeige && /^M[TLK]-/.test(s.anzeige.display || '')) || { anzeige: {} }).anzeige.display;
    // Kessel (HK, Mustertherm) – Therme (Altbau-Therme) – Gerät (Wärmepumpe Musterluft, Klima Musterklima)
    const geraet = /^M[LK]-/.test(code || '') ? 'das Gerät' : E.ort === 'AT' ? 'die Therme' : 'den Kessel';
    nahZeigen('handgriff', 'Entstören', [el('p', 'rb-hghinweis', 'Ursache behoben – jetzt ' + geraet + ' entstören.'), flaeche], false);
    hgNotizReiter();
    let los = () => {};
    const o = { flaeche, param: {}, code, stufe, meldung(t, a) { hgMeldung(z, t, a); }, fertig() { los(); nahStopp = null; erledigt(); } };
    nahStopp = () => { if (o.stop) o.stop(); los(); };
    RB.HANDGRIFFE['Entstören/Neustart'](o);
    z.einsetzen();
    los = beobachten(info, [...flaeche.children].filter(x => !x.matches('canvas, .hg-lcd')));
    nahPlatz();
  }

  // ---------- Abschluss ----------
  // Stempel „Auftrag erledigt“ (MZ bestätigt, Spieltest Phase 3): nach dem gelungenen Handgriff, bevor der Kunde dankt.
  // Ca. 1,5s inkl. Ausblenden, Stempel in Hausfarbe leicht schräg auf das Raumbild „gedrückt“, kurzer Erfolgsklang (Rahmen-Klang „gut“,
  // eigener Klang folgt in Phase 4). Uhr steht (E.uhrStopp), Tippen überspringt, bei reduced-motion nur eingeblendet.
  function erledigt() {
    nahWeg();
    E.phase = 'fertig'; E.uhrStopp = true;
    markenSetzen(); leiste(); meldung('');
    const st = el('div', 'rb-stempel');
    const innen = el('div', 'rb-stempelinnen');
    // MZ-Regel „Logo immer getrennt“: kein Logo-Zeichen im Stempel – nur Text mit neutralem Haken
    innen.append(el('i', 'rb-stempelhaken', '✓'), el('span', '', T('stempel', 'Auftrag erledigt')));
    st.append(innen);
    raum.append(st);
    const deckel = el('div', 'rb-stempeldeckel');   // fängt das Tippen zum Überspringen ab
    rb.append(deckel);
    signal('erledigt');
    ton('stempel', { verzoegerung: RB.ruhig ? 0 : 0.26 });   // Klang, wenn der Stempel aufsetzt (Stempel + Akzent, klang.js)
    let fertig = false;
    const weiter = () => {
      if (fertig) return; fertig = true; clearTimeout(uhr);
      deckel.remove(); st.classList.add('weg');
      setTimeout(() => st.remove(), 400);
      dank();
    };
    // insgesamt ca. 1,5s inkl. Ausblenden (0,35s) – QA-Nachprüfung
    const uhr = setTimeout(weiter, RB.ruhig ? 1000 : 1150);
    deckel.addEventListener('click', weiter);
  }
  function dank() {
    nahWeg();
    E.phase = 'fertig';
    const f = D.figuren[E.figur];
    gespraech(E.figur, [{ text: E.st.abschluss, stimmung: 3 }, { text: zufall(f.dank), stimmung: 3 }], 'Gern geschehen', einsatzbuch);
  }
  function einsatzPunkte() {
    const ursache = E.loesungGezeigt ? 0 : P.ursache[Math.min(3, E.fehlDiag)];
    const werkzeug = Math.max(0, P.werkzeug - P.fehlgriff * E.fehlWerk);
    const q = reparaturen().map(r => P.reparieren[E.rep[r.fuer]] || 0);
    const reparieren = Math.round(q.reduce((a, b) => a + b, 0) / q.length);
    const t = E.zeit, [voll, null0] = ST().tempo || [P.tempoVoll, P.tempoNull];
    const tm = tempoMax(E.nr);
    const tempo = t <= voll ? tm : t >= null0 ? 0 : Math.round(tm * (null0 - t) / (null0 - voll));
    const tipp = E.tipp ? -P.tipp : 0;
    return { ursache, werkzeug, reparieren, tempo, tempoMax: tm, max: einsatzMax(E.nr), tipp, summe: Math.max(0, ursache + werkzeug + reparieren + tempo + tipp), zeit: t,
      sofort: E.fehlDiag === 0 && !E.loesungGezeigt, fehlgriffe: E.fehlDiag + E.fehlWerk, titel: E.st.titel, ort: E.ortName };
  }
  function einsatzbuch() {
    const erg = einsatzPunkte();
    lauf.ergebnisse.push(erg);
    const b = buch(), neu = !b.includes(E.st.id);
    if (neu) { b.push(E.st.id); schreiben(BUCH_KEY, JSON.stringify(b)); }
    kopfzeile();
    const karte = el('div', 'rb-buchkarte');
    const c = el('canvas', 'rb-buchbild');
    const kopf = el('div', 'rb-buchkopf');
    kopf.append(el('small', '', E.ortName + ' – Nr. ' + Number(E.st.id.slice(3))), el('span', 'rb-buchstand' + (neu ? ' neu' : ''), (neu ? 'Neu – ' : '') + b.length + '/' + BUCH_GESAMT));
    karte.append(kopf, c, el('h2', '', E.st.titel), el('p', 'rb-erklaer', E.st.erklaer));
    if (E.m2 && E.st.m2.erklaer) karte.append(el('p', 'rb-erklaer', E.st.m2.erklaer));
    const tab = el('div', 'rb-einsatzpunkte');
    [['Ursache', erg.ursache, 150], ['Werkzeug', erg.werkzeug, 60], ['Reparieren', erg.reparieren, 60], ['Tempo (' + minuten(erg.zeit) + ')', erg.tempo, erg.tempoMax]]
      .concat(erg.tipp ? [['Tipp vom Meister', erg.tipp, null]] : [])
      .forEach(([n, w, m]) => { const z = el('div', 'zeile'); z.append(el('span', '', n), el('b', '', (w < 0 ? '−' + Math.abs(w) : String(w)) + (m ? '/' + m : ''))); tab.append(z); });
    const sum = el('div', 'zeile summe'); sum.append(el('span', '', 'Einsatz ' + E.nr), el('b', '', erg.summe + '/' + erg.max)); tab.append(sum);
    karte.append(tab);
    if (erg.sofort && E.rep.haupt === 'genau' && D.meister.lob.length) karte.append(el('p', 'rb-lob', (K.meister && K.meister.name || D.meister.name) + ': „' + zufall(D.meister.lob) + '“'));
    const letzter = E.nr >= EINSAETZE;
    karte.append(knopf(letzter ? 'Zum Ergebnis' : 'Nächster Einsatz', 'haupt', () => { szeneWeg(); naechsterEinsatz(); }));
    szeneZeigen('buch', [karte]);
    const bt = bauteilVon((E.st.stellen.find(s => s.befund && bauteilVon(s.name)) || {}).name);
    const malen = () => {
      if (!c.isConnected) return;
      const { g, w, h } = RB.leinwand(c);
      g.clearRect(0, 0, w, h);
      if (bt) RB.zelle(g, bt.blatt, bt.zelle, 3, 2, 0, 0, w, h, false);
    };
    requestAnimationFrame(malen);
    if (bt) RB.bild(bt.blatt).fertig.then(() => requestAnimationFrame(malen));
  }

  function naechsterEinsatz() {
    lauf.nr++;
    RB.leben.stop();
    if (lauf.nr >= lauf.einsaetze.length) return durchgangEnde();
    E = lauf.einsaetze[lauf.nr];
    vorladen(E);
    nahWeg();
    raumAufbauen();
    kopfzeile();
    leiste();
    if (HASH.phase && E.nr === 1) { E.phase = 'untersuchen'; untersuchen(); return; }
    levelTitel(() => funkspruch(kundinBegruesst));
  }
  function vorladen(e) {
    // nur die Lupen-Blätter, die dieser Einsatz wirklich braucht (QA Phase 3, Größe je Durchgang) – alles andere lädt bei Bedarf
    const b = O[e.ort].bauteile, blaetter = new Set();
    (e.stellen || []).forEach(s => { const z = (s.anzeige && +s.anzeige.bild === 2 && b.zweite && b.zweite[s.name]) || b.stellen[s.name]; if (z) blaetter.add(b.blaetter[z[0]]); });
    [e.V.bild, figurBild(e.figur, 1), figurBild(e.figur, 2), figurBild(e.figur, 3)].concat([...blaetter]).forEach(RB.bild);
  }

  // Test-Haken #phase=…: vorige Schritte automatisch erledigen (nur erster Einsatz)
  function phasenSprung() {
    E.sprungErledigt = true;
    E.stellen.forEach(s => { s.untersucht = true; notiz(s); });
    leiste(); markenSetzen();
    if (HASH.phase === 'diagnose') return diagnose();
    if (HASH.phase === 'werkzeug' || HASH.phase === 'handgriff') {
      E.richtigGefunden = E.m2 ? ['haupt', 'm2'] : ['haupt'];
      ursacheNotiz(E.st.diagnose.richtig);
      if (E.m2) ursacheNotiz(E.st.m2.diagnose.richtig);
      E.sprungHandgriff = HASH.phase === 'handgriff';
      werkzeugPhase();
    }
  }

  function bewertung(p) { return D.rahmen.bewertungen[BEWERTUNG.find(([g]) => p >= g)[1]]; }
  function durchgangEnde() {
    E = null;
    vorplan = planen();   // für „Nochmal“ schon die nächsten Orte laden
    const erg = lauf.ergebnisse, summe = erg.reduce((s, e) => s + e.summe, 0);
    const punkte = Math.max(1, Math.min(1000, summe));   // = Summe der Einsatz-Karten (Kopfzeile zeigt dieselbe Zahl)
    // Zeit-Plakette = Summe der Tempo-Uhr (die für die Punkte zählt), damit Plakette und „Ø … pro Einsatz“ zusammenpassen
    const zeit = erg.reduce((s, e) => s + e.zeit, 0);
    endeMelden(punkte, erg, zeit);
  }
  function endeMelden(punkte, erg, zeit) {
    const sofort = erg.filter(e => e.sofort).length, fehl = erg.reduce((s, e) => s + e.fehlgriffe, 0);
    const vorlage = D.rahmen.aufschluesselung[fehl === 0 ? 'keiner' : fehl === 1 ? 'eins' : 'viele'] || D.rahmen.aufschluesselung.viele;
    const schnitt = erg.reduce((s, e) => s + e.zeit, 0) / Math.max(1, erg.length);
    // „Ø“ bleibt mit dem Wert zusammen (geschütztes Leerzeichen), Gedankenstrich mit geschütztem Leerzeichen davor
    const text = nb(vorlage.replace('{n}', sofort).replace('{f}', fehl).replace('{zeit}', minuten(schnitt))).replace(/Ø\s+/g, 'Ø' + NBSP);
    rb.hidden = true;
    klangSzene('ende');   // Endbild ohne Musik (MZ, 24.10.2026)
    R_.ende(punkte, {
      ueberschrift: bewertung(punkte), zusatz: minuten(zeit), text, verzoegerung: RB.ruhig ? 100 : 500,
      // Name darf umbrechen (schmale Handys): „Einsatz 1 –“ bleibt zusammen, der Ort kommt ggf. in die nächste Zeile
      auswertung: { kopf: 'Deine Einsätze', zeilen: erg.map((e, i) => ({ name: 'Einsatz' + NBSP + (i + 1) + NBSP + '– ' + e.ort, zusatz: '', anteil: e.summe / (e.max || P.einsatz), wert: String(e.summe), max: '/' + (e.max || P.einsatz) })) },
    });
    RB.endbild && RB.endbild(punkte, { stufe: ST().name, ergebnisse: erg, bewertung: bewertung(punkte), stufen: BEWERTUNG.map(([g, i]) => [g, D.rahmen.bewertungen[i]]) });
  }

  // ---------- Abbruch über „Zum Menü“ während des Spiels ----------
  document.addEventListener('click', e => {
    const a = e.target.closest('#heimKnopf');
    if (!a || R_.zustand !== 'spiel' || !lauf) return;
    e.preventDefault();
    frage.textContent = '';
    const box = el('div', 'rb-fragebox');
    box.append(el('p', '', D.rahmen.abbruch),
      knopf(T('knopfWeiterarbeiten', 'Weiterarbeiten'), 'haupt', () => { frage.hidden = true; }),
      knopf(T('knopfAbbruch', 'Feierabend'), 'zweit', () => { location.href = a.getAttribute('href'); }));
    frage.hidden = false;
    frage.append(box);
  }, true);

  // ---------- Anmeldung beim Rahmen ----------
  let laufNummer = 0;
  const def = {
    id: 'rohrbruch-' + stufe,
    wertung: 'hoch',
    format: punkteText,
    hoechst: 1000,
    texte: { titel: 'Rohrbruch', untertitel: D.rahmen.frage, anleitung: D.rahmen.anleitung },
    neu() {
      if (R_.zustand !== 'spiel') return;   // Rahmen ruft neu() auch beim Laden
      lauf = null; E = null;
      rb.hidden = false;
      layout();
      // Orte des Durchgangs laden (meist schon beim Startbild vorgeladen), dann geht es los
      const nummer = ++laufNummer;
      neuerLauf().then(l => {
        if (nummer !== laufNummer || R_.zustand !== 'spiel') return;
        lauf = l;
        naechsterEinsatz();
      });
    },
    schritt(dt) {
      if (uhrLaeuft() && !E.uhrStopp) E.zeit += dt;
      zwischenfallPruefen();
    },
    zeichne(g, B, Hh, zustand) {
      g.fillStyle = '#e7e3dc'; g.fillRect(0, 0, B, Hh);
      if (zustand === 'spiel') effekteZeichnen(performance.now() / 1000);
    },
    groesse() { layout(); },
  };
  // für schirme.js (Startbild-Display: Stufe, Bestwerte)
  // einsatz: Testhilfe (nur lesen) – aktueller Einsatz mit Störung, Stellen, Verstecken, Punkten
  // lupe, zwischenfall: Testhilfen (Playwright-Durchlauf aller Störungen bzw. Zwischenfälle)
  RB.spiel = { def, STUFEN, get stufe() { return stufe; }, bewertung, BUCH_GESAMT, buch, endeMelden, HASH, get einsatz() { return E; },
    lupe: s => lupe(s), zwischenfall: z => { if (E) { E.zwischenfall = z; E.zwFertig = false; E.zwAb = 0; } } };
  R_.spiel(def);
  vorplan = planen();
  durchgangAblegen(vorplan);   // schon beim Startbild ablegen: reißt die Verbindung danach ab, ist der Durchgang trotzdem da
  // Einsatzbuch-Ansicht (aus dem vorläufigen Menü: #buch) – Zurück führt zum Menü
  function buchOeffnen(vomMenue) {
    klangSzene('buch');
    const orte = {}; Object.keys(D.orte).forEach(o => { orte[o] = D.orte[o].name; });
    RB.buchZeigen({ katalog: D.katalog, orte, gefunden: buch(), zurueckText: vomMenue ? 'Zum Menü' : 'Zurück',
      zurueck: () => { if (vomMenue) location.href = K.startseite || '../'; } });
  }
  RB.buchOeffnen = buchOeffnen;
  if (HASH.buch) setTimeout(() => buchOeffnen(true), 30);
  if (HASH.los && !HASH.ende) setTimeout(() => document.querySelector('#losKnopf').click(), 50);
  // #ende=856: Beispiel-Endbild mit ausgedachten Werten
  if (HASH.ende) {
    setTimeout(() => {
      document.querySelector('#losKnopf').click();
      const p = Math.max(1, Math.min(1000, +HASH.ende || 856));
      // Einsatz-Summen so verteilt, dass ihre Summe genau p ergibt (wie im echten Spiel)
      const erg = [0.95, 0.8, 0.82].map((a, i) => ({ summe: Math.min(einsatzMax(i + 1), Math.round(einsatzMax(i + 1) * a * p / 856 * 0.98)), max: einsatzMax(i + 1), zeit: 70 + i * 25, sofort: i !== 1, fehlgriffe: i === 1 ? 1 : 0, ort: 'Heizungskeller' }));
      erg[0].summe = Math.max(0, Math.min(erg[0].max, p - erg[1].summe - erg[2].summe));
      // Aufschlüsselung je Einsatz (ausgedacht, geht genau auf die Summe auf)
      erg.forEach((e, i) => {
        e.tempoMax = tempoMax(i + 1); e.tipp = 0;
        e.werkzeug = Math.min(60, Math.round(e.summe * 0.18 / 20) * 20); e.reparieren = Math.min(60, e.summe > 250 ? 60 : 30);
        e.tempo = Math.max(0, Math.min(e.tempoMax, e.summe - 150 - e.werkzeug - e.reparieren));
        e.ursache = e.summe - e.werkzeug - e.reparieren - e.tempo;
      });
      setTimeout(() => endeMelden(p, erg, 271), 80);
    }, 80);
  }
})();
