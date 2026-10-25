// Rohrbruch – Bilder und Maße je Ort (von Hand gepflegt; die Texte kommen aus daten.js).
// Koordinaten in Pixeln der Originalbilder: Raumbilder 1024×1024, Bauteil- und Werkzeugblätter 1536×1024
// (Zellen 512×512 bzw. 384×341). Neuer Ort = neuer Eintrag hier + Bilder + Texte (rohrbruch-<ort>-entwurf.md).
window.ROHRBRUCH_ORTE = {
  HK: {
    // Raum-Varianten (Bilder gestaltet vom Graphic Artist, 24.10.2026): A Altbau-Keller, B Neubau-Technikraum
    varianten: {
      A: {
        bild: 'bilder/raum-hk-a.webp',
        // Stelle: [x, y] – Mitte der antippbaren Stelle (am Bild abgemessen, 24.10.2026)
        stellen: {
          'Kessel-Display': [295, 548], 'Regler-Bedienteil': [300, 395], 'Zündelektrode': [352, 600],
          'Manometer Heizung': [538, 167], 'Thermometer Vor-/Rücklauf': [440, 226], 'Ausdehnungsgefäß': [567, 300],
          'Sicherheitsventil': [606, 140], 'Kondensatsiphon': [323, 683], 'Boden unter dem Kessel': [235, 770],
          'Gashahn': [182, 278], 'Heizungspumpe': [456, 362], 'Warmwasserspeicher': [672, 610],
          'Speicherfühler': [726, 488], 'Zeitschaltuhr Zirkulation': [760, 182], 'Zirkulationspumpe': [790, 276],
          'Schmutzfänger': [508, 487], 'Abgasrohr': [310, 140],
          'Außenthermometer am Kellerfenster': [970, 135],   // am Fensterrahmen rechts (Supervisor 24.10.2026: in beiden Varianten)
        },
        // Verstecke (Namen wie in rohrbruch-hk-entwurf.md)
        // Wasser im Raum (Handgriff-Runde 25.10.2026): tropfen [x, y Quelle, y Aufprall, Pfütze, Spritzer] – pfuetze [x, y, Breite] am Boden – rinnsal [x, y oben, y unten, Breite]
        wasser: { 'Sicherheitsventil': { tropfen: [606, 152, 338] }, 'Boden unter dem Kessel': { pfuetze: [285, 765, 280] } },
        verstecke: {
          'Holzregal an der Bruchsteinwand': [42, 165], 'Werkbank-Schublade': [905, 560], 'Eimer in der Ecke': [962, 725],
          'auf dem Sicherungskasten': [955, 252], 'hinter dem Warmwasserspeicher': [792, 625],
          'neben dem Kessel auf dem Boden': [165, 712],
        },
        // Display des Kessels im Raumbild (Fehlercode blinkt dort): [x0, y0, x1, y1]
        display: [262, 491, 329, 516],
        // Lebender Hintergrund (Phase 3): Deckenlampe [x, y, Radius des Lichtscheins], Plätze für Katze/Hund auf dem Boden
        leben: { lampe: [[494, 26, 120]] },
        tierPlatz: [[430, 930], [690, 900], [250, 960]],
        // Lichtschalter für Zwischenfall „Licht aus“ (ZF-07), neben der Tür bzw. an der Wand – Runde Spieltest 3
        schalter: [125, 460],
      },
      B: {
        bild: 'bilder/raum-hk-b.webp',
        stellen: {
          'Kessel-Display': [440, 392], 'Regler-Bedienteil': [782, 297], 'Zündelektrode': [408, 232],
          'Manometer Heizung': [476, 517], 'Thermometer Vor-/Rücklauf': [544, 257], 'Ausdehnungsgefäß': [642, 330],
          'Sicherheitsventil': [614, 132], 'Kondensatsiphon': [385, 500], 'Boden unter dem Kessel': [415, 690],
          'Gashahn': [312, 270], 'Heizungspumpe': [545, 368], 'Warmwasserspeicher': [790, 610],
          'Speicherfühler': [812, 530], 'Zirkulationspumpe': [912, 507], 'Schmutzfänger': [538, 478],
          'Abgasrohr': [405, 70], 'Außenthermometer am Kellerfenster': [888, 168],
        },
        wasser: { 'Sicherheitsventil': { tropfen: [614, 146, 262] }, 'Boden unter dem Kessel': { pfuetze: [430, 730, 250] } },
        verstecke: {
          'obere Box im Metallregal': [40, 200], 'untere Box im Metallregal': [42, 725], 'schmaler Wandschrank': [185, 430],
          'Wäschekorb': [972, 770], 'auf dem Sicherungskasten': [990, 205], 'hinter dem Warmwasserspeicher': [890, 640],
          'neben dem Kessel auf dem Boden': [318, 700],
        },
        display: [388, 336, 429, 361],
        leben: { lampe: [[535, 14, 110]] },
        tierPlatz: [[420, 930], [640, 900], [250, 950]],
        // Lichtschalter für Zwischenfall „Licht aus“ (ZF-07), neben der Tür bzw. an der Wand – Runde Spieltest 3
        schalter: [278, 460],
      },
    },
    // Lupe: Bauteil-Nahaufnahmen, je Blatt 3×2 Zellen (512×512). [blatt, zelle]
    bauteile: {
      blaetter: ['bilder/bauteile-hk-1.webp', 'bilder/bauteile-hk-2.webp', 'bilder/bauteile-hk-3.webp'],
      stellen: {
        'Kessel-Display': [0, 0], 'Regler-Bedienteil': [0, 1], 'Manometer Heizung': [0, 2], 'Ausdehnungsgefäß': [0, 3],
        'Sicherheitsventil': [0, 4], 'Kondensatsiphon': [0, 5], 'Gashahn': [1, 0], 'Heizungspumpe': [1, 1],
        'Thermometer Vor-/Rücklauf': [1, 2], 'Warmwasserspeicher': [1, 3], 'Speicherfühler': [1, 4],
        'Zeitschaltuhr Zirkulation': [1, 5], 'Zirkulationspumpe': [2, 0], 'Schmutzfänger': [2, 1], 'Zündelektrode': [2, 2],
        'Abgasrohr': [2, 3], 'Außenthermometer am Kellerfenster': [2, 4], 'Außenfühler': [2, 5],
      },
      // Wo der Code Werte auf das Bauteil legt (Zell-Koordinaten 0–512, am Bild gemessen):
      // display: [x, y, b, h] schwarzes Display – skala: [mx, my, r] leeres Zifferblatt – uhr: [mx, my, r] Stellrad –
      // saeule: [x, y0, y1] Thermometersäule – mitte: [x, y] wo Zustände (Tropfen, Schlamm…) liegen
      masse: {
        'Kessel-Display': { display: [181, 180, 152, 66] },
        'Regler-Bedienteil': { display: [134, 129, 240, 127] },
        'Manometer Heizung': { skala: [259, 190, 132] },
        'Thermometer Vor-/Rücklauf': { skala: [286, 263, 78] },
        'Zeitschaltuhr Zirkulation': { uhr: [254, 130, 84] },
        'Außenthermometer am Kellerfenster': { saeule: [196, 60, 322] },
        'Kondensatsiphon': { mitte: [165, 270] },
        'Sicherheitsventil': { mitte: [348, 420] },
        'Ausdehnungsgefäß': { mitte: [200, 260] },
        'Warmwasserspeicher': { mitte: [256, 250] },
        'Schmutzfänger': { mitte: [200, 370] },
        'Heizungspumpe': { mitte: [238, 290] },
        'Speicherfühler': { mitte: [300, 200] }, 'Zündelektrode': { mitte: [250, 120] }, 'Zirkulationspumpe': { mitte: [240, 240] },
      },
    },
    // Zweite Lupenbilder (Anzeige bild=2, z. B. Verschlusskappe im Stutzen): Stelle: [blatt, zelle] – kommen mit den
    // Bauteil-Bildern der übrigen Orte. Raum-Overlays (z. B. WZ-03 bodenlanger Vorhang) je Variante unter
    // varianten.X.overlays: { Stelle: { bild: 'bilder/….webp', rechteck: [x0, y0, x1, y1] } } – ohne Bild zeigt das Spiel
    // einen gestrichelten Platzhalter an der Stelle.
    // Raumstellen ohne eigenes Lupenbild: Lupe zeigt einen vergrößerten Ausschnitt des Raumbilds
    raumstellen: ['Boden unter dem Kessel'],
    // Kundendienst-Aufkleber mit Logo am Kessel (MZ, 24.10.2026): Ecken [oben-links, oben-rechts, unten-rechts, unten-links]
    aufkleber: { A: [[220, 320], [290, 320], [290, 350], [220, 350]], B: [[350, 160], [400, 160], [400, 185], [350, 185]] },
  },
  // ===== Phase 3: übrige 9 Orte (erzeugt aus den Maßen, scratchpad orte_gen.py) =====
  BA: {
    // Bad – Raumbilder Graphic Artist 25.10.2026 (rohrbruch-raum-ba-a/b.png), eingemessen am Raster 25.10.2026
    varianten: {
      A: {
        bild: 'bilder/raum-ba-a.webp',
        stellen: {"Waschbecken": [520, 380], "Waschtischarmatur": [533, 320], "Siphon Waschbecken": [533, 500], "Ablaufrohr Wand": [615, 490], "Eckventile Waschtisch": [473, 473], "Duschkopf": [247, 47], "Brauseschlauch": [230, 345], "Thermostat-Brausebatterie": [300, 250], "Anschlusssiebe Brausebatterie": [225, 250], "Silikonfuge Dusche": [290, 470], "Fliesen neben der Dusche": [373, 400], "Badewanne": [150, 790], "Badewannen-Ablauf": [104, 656], "Drehgriff Wannen-Ablauf": [131, 529], "WC-Becken": [780, 560], "Spülkasten Aufputz (innen)": [790, 340], "Füllventil (Aufputz-Spülkasten)": [700, 315], "Eckventil Spülkasten": [847, 320], "Thermostatkopf Bad": [987, 440]},
        wasser: { 'Waschtischarmatur': { tropfen: [545, 312, 366] }, 'Fliesen neben der Dusche': { rinnsal: [373, 418, 592, 14], pfuetze: [376, 612, 150, 1] } },
        verstecke: {"Spiegelschrank über dem Waschbecken": [540, 147], "Waschtisch-Unterschrank": [445, 580], "Wäschekorb neben der Tür": [947, 747], "Badewannenrand zwischen den Shampooflaschen": [67, 467], "Hocker neben der Badewanne": [247, 720], "Deckel des Aufputz-Spülkastens": [767, 260]},
        leben: {"dampf": [[250, 330]]},
        tierPlatz: [[420, 930], [640, 900], [520, 970]],
      },
      B: {
        bild: 'bilder/raum-ba-b.webp',
        stellen: {"Waschbecken": [195, 420], "Waschtischarmatur": [264, 368], "Siphon Waschbecken": [275, 540], "Ablaufrohr Wand": [345, 520], "Eckventile Waschtisch": [225, 490], "Duschkopf": [900, 96], "Brauseschlauch": [890, 480], "Thermostat-Brausebatterie": [935, 352], "Anschlusssiebe Brausebatterie": [853, 353], "Duschrinne": [907, 660], "Silikonfuge Dusche": [975, 600], "Fliesen neben der Dusche": [840, 560], "WC-Becken": [545, 575], "Unterputz-Spülkasten (Revisionsöffnung)": [470, 383], "Ablaufventil (Unterputz-Spülkasten)": [560, 352], "Drückerplatte": [587, 262], "Eckventil Spülkasten": [500, 318], "Handtuchheizkörper": [740, 200], "Rücklaufverschraubung Handtuchheizkörper": [780, 593], "Thermostatkopf Bad": [703, 600]},
        wasser: { 'Waschtischarmatur': { tropfen: [266, 382, 410] }, 'Fliesen neben der Dusche': { rinnsal: [840, 575, 662, 14], pfuetze: [838, 680, 160, 1] } },
        verstecke: {"Spiegelschrank über dem Waschbecken": [267, 173], "Waschtisch-Unterschrank": [187, 593], "Wäschekorb neben der Tür": [73, 747], "Ablage auf der Vorwand über dem WC": [430, 275], "unter dem Handtuch am Handtuchheizkörper": [737, 367], "Nische in der Duschwand": [949, 247], "Hochschrank neben dem Waschtisch": [73, 307]},
        leben: {"dampf": [[900, 420]]},
        tierPlatz: [[420, 900], [640, 880], [300, 960]],
      },
    },
    bauteile: {
      blaetter: ["bilder/bauteile-ba-1.webp", "bilder/bauteile-ba-2.webp", "bilder/bauteile-ba-3.webp", "bilder/bauteile-ba-4.webp"],
      stellen: {"Waschtischarmatur": [0, 0], "Siphon Waschbecken": [0, 1], "Ablaufrohr Wand": [0, 2], "Eckventile Waschtisch": [0, 3], "Duschkopf": [0, 4], "Brauseschlauch": [0, 5], "Thermostat-Brausebatterie": [1, 0], "Anschlusssiebe Brausebatterie": [1, 1], "Duschrinne": [1, 2], "Silikonfuge Dusche": [1, 3], "Badewannen-Ablauf": [1, 4], "Drehgriff Wannen-Ablauf": [1, 5], "WC-Becken": [2, 0], "Spülkasten Aufputz (innen)": [2, 1], "Füllventil (Aufputz-Spülkasten)": [2, 2], "Unterputz-Spülkasten (Revisionsöffnung)": [2, 3], "Ablaufventil (Unterputz-Spülkasten)": [2, 4], "Drückerplatte": [2, 5], "Eckventil Spülkasten": [0, 3], "Handtuchheizkörper": [3, 0], "Rücklaufverschraubung Handtuchheizkörper": [3, 1], "Thermostatkopf Bad": [3, 2]},
      masse: {},
    },
    raumstellen: ["Badewanne", "Fliesen neben der Dusche", "Waschbecken"],
  },
  KU: {
    // Küche – Raumbilder Graphic Artist 25.10.2026 (rohrbruch-raum-ku-a/b.png), eingemessen am Raster 25.10.2026
    varianten: {
      A: {
        bild: 'bilder/raum-ku-a.webp',
        stellen: {"Spültischarmatur": [440, 368], "Strahlregler": [505, 335], "Ablaufsieb Spüle": [535, 405], "Siphon Spüle": [500, 565], "Ablaufrohr Wand": [555, 545], "Eckventil kalt": [424, 497], "Kaltwasserleitung unter Spüle": [415, 590], "Unterschrank-Boden": [520, 670], "Kleinspeicher unter der Spüle": [610, 610], "Rohrbelüfter": [545, 478]},
        wasser: { 'Kaltwasserleitung unter Spüle': { tropfen: [413, 610, 690, 90] }, 'Eckventil kalt': { tropfen: [424, 512, 690] }, 'Unterschrank-Boden': { pfuetze: [520, 655, 200] } },
        verstecke: {"Besteckschublade neben der Spüle": [260, 473], "Putzeimer neben dem Spülschrank": [780, 687], "Fensterbank hinter dem Kräutertopf": [360, 318], "oben auf dem Kühlschrank": [120, 93], "Brotkasten auf der Arbeitsplatte": [760, 340], "Truhe unter der Eckbank": [873, 607]},
        tierPlatz: [[420, 900], [640, 880], [300, 960]],
      },
      B: {
        bild: 'bilder/raum-ku-b.webp',
        stellen: {"Spültischarmatur": [580, 233], "Strahlregler": [500, 205], "Ablaufsieb Spüle": [520, 283], "Siphon Spüle": [547, 440], "Ablaufrohr Wand": [640, 433], "Eckventil kalt": [480, 405], "Eckventil warm": [415, 420], "Kaltwasserleitung unter Spüle": [410, 540], "Unterschrank-Boden": [587, 560], "Ausziehbrause-Schlauch": [581, 380], "Geschirrspüler": [800, 387], "Geschirrspüler-Sieb": [793, 513], "Geschirrspüler-Ablaufschlauch": [496, 517], "Geschirrspüler-Zulaufschlauch": [450, 462], "Rohrbelüfter": [584, 487]},
        wasser: { 'Kaltwasserleitung unter Spüle': { tropfen: [410, 548, 566, 70] }, 'Eckventil kalt': { tropfen: [480, 415, 566] }, 'Ausziehbrause-Schlauch': { tropfen: [585, 490, 566] }, 'Unterschrank-Boden': { pfuetze: [530, 566, 200] } },
        verstecke: {"Besteckschublade neben der Spüle": [260, 340], "Putzeimer neben dem Spülschrank": [227, 573], "Fensterbank hinter dem Kräutertopf": [430, 150], "Schublade in der Kochinsel": [827, 813], "Obstschale auf der Kochinsel": [953, 580], "Vorratsfach im Hochschrank": [60, 213], "Ablage neben der Kaffeemaschine": [267, 200]},
        tierPlatz: [[350, 900], [600, 880], [450, 970]],
      },
    },
    bauteile: {
      blaetter: ["bilder/bauteile-ku-1.webp", "bilder/bauteile-ba-1.webp", "bilder/bauteile-ku-2.webp", "bilder/lupe2-1.webp", "bilder/lupe2-4.webp"],
      stellen: {"Spültischarmatur": [0, 0], "Strahlregler": [0, 1], "Ablaufsieb Spüle": [0, 2], "Siphon Spüle": [0, 3], "Ablaufrohr Wand": [1, 2], "Eckventil kalt": [1, 3], "Eckventil warm": [1, 3], "Kaltwasserleitung unter Spüle": [0, 4], "Ausziehbrause-Schlauch": [0, 5], "Geschirrspüler": [2, 0], "Geschirrspüler-Sieb": [2, 1], "Geschirrspüler-Ablaufschlauch": [2, 2], "Geschirrspüler-Zulaufschlauch": [2, 3], "Kleinspeicher unter der Spüle": [2, 4], "Rohrbelüfter": [2, 5]},
      masse: {},
      zweite: {"Siphon Spüle": [4, 2]},
    },
    raumstellen: ["Unterschrank-Boden"],
  },
  GW: {
    // Gäste-WC – Raumbilder Graphic Artist 25.10.2026 (rohrbruch-raum-gw-a/b.png), eingemessen am Raster 25.10.2026
    varianten: {
      A: {
        bild: 'bilder/raum-gw-a.webp',
        stellen: {"WC-Becken": [573, 627], "Spülkasten Aufputz (innen)": [560, 300], "Spülkasten-Kette": [650, 255], "Eckventil Spülkasten": [400, 247], "WC-Anschlussmanschette": [460, 527], "Fußboden hinter WC": [460, 613], "Handwaschbecken": [110, 520], "Armatur Handwaschbecken": [167, 407], "Ablaufstopfen": [237, 511], "Zugstange Ablaufgarnitur": [230, 588], "Siphon Handwaschbecken": [237, 653], "Wandanschluss Siphon": [253, 727], "Eckventil Handwaschbecken": [100, 620], "Kleinspeicher Gäste-WC": [147, 773], "Lüftungsgitter": [640, 40]},
        wasser: { 'Armatur Handwaschbecken': { tropfen: [178, 412, 470] }, 'WC-Becken': { tropfen: [576, 540, 572, 0, false] }, 'Fußboden hinter WC': { pfuetze: [455, 655, 170] } },
        verstecke: {"Ablage unter dem Spiegel": [147, 313], "Korb mit Ersatzrollen neben dem WC": [833, 693], "Stoffbeutel am Türhaken": [953, 427], "auf dem Spülkastendeckel": [740, 440], "Holzregal mit Handtüchern": [867, 347], "unter dem Handwaschbecken neben dem Kleinspeicher": [220, 827]},
        tierPlatz: [[420, 900], [650, 900]],
      },
      B: {
        bild: 'bilder/raum-gw-b.webp',
        stellen: {"WC-Becken": [587, 560], "Unterputz-Spülkasten (Revisionsöffnung)": [500, 145], "Füllventil-Sieb": [462, 240], "Ablaufventil (Unterputz-Spülkasten)": [524, 213], "Drückerplatte": [633, 247], "Eckventil Spülkasten": [400, 213], "WC-Anschlussmanschette": [487, 533], "Fußboden hinter WC": [587, 640], "Handwaschbecken": [100, 540], "Armatur Handwaschbecken": [147, 400], "Ablaufstopfen": [183, 500], "Zugstange Ablaufgarnitur": [190, 575], "Siphon Handwaschbecken": [200, 707], "Wandanschluss Siphon": [133, 680], "Eckventil Handwaschbecken": [260, 615], "Heizkörper Gäste-WC": [813, 587], "Heizkörperventil": [873, 507], "Entlüftungsventil Heizkörper": [760, 453], "Lüftungsgitter": [633, 51], "Fenster": [907, 173]},
        wasser: { 'Armatur Handwaschbecken': { tropfen: [185, 378, 462] }, 'WC-Becken': { tropfen: [590, 528, 556, 0, false] }, 'Fußboden hinter WC': { pfuetze: [590, 670, 190] } },
        verstecke: {"Ablage unter dem Spiegel": [107, 307], "Korb mit Ersatzrollen neben dem WC": [413, 627], "Stoffbeutel am Türhaken": [967, 693], "Unterschrank unter dem Handwaschbecken": [200, 827], "Fensterbank": [853, 400], "unter dem Heizkörper": [813, 747]},
        tierPlatz: [[450, 900], [650, 880]],
      },
    },
    bauteile: {
      blaetter: ["bilder/bauteile-ba-3.webp", "bilder/bauteile-gw-1.webp", "bilder/bauteile-ba-1.webp", "bilder/bauteile-ku-2.webp", "bilder/bauteile-gw-2.webp", "bilder/lupe2-1.webp", "bilder/lupe2-4.webp"],
      stellen: {"WC-Becken": [0, 0], "Spülkasten Aufputz (innen)": [0, 1], "Spülkasten-Kette": [1, 0], "Eckventil Spülkasten": [2, 3], "WC-Anschlussmanschette": [1, 2], "Armatur Handwaschbecken": [2, 0], "Ablaufstopfen": [1, 3], "Zugstange Ablaufgarnitur": [1, 4], "Siphon Handwaschbecken": [2, 1], "Wandanschluss Siphon": [1, 5], "Eckventil Handwaschbecken": [2, 3], "Kleinspeicher Gäste-WC": [3, 4], "Lüftungsgitter": [4, 3], "Unterputz-Spülkasten (Revisionsöffnung)": [0, 3], "Füllventil-Sieb": [1, 1], "Ablaufventil (Unterputz-Spülkasten)": [0, 4], "Drückerplatte": [0, 5], "Heizkörper Gäste-WC": [4, 0], "Heizkörperventil": [4, 1], "Entlüftungsventil Heizkörper": [4, 2]},
      masse: {},
      zweite: {"Wandanschluss Siphon": [5, 1], "Zugstange Ablaufgarnitur": [5, 2], "Heizkörperventil": [5, 3], "Drückerplatte": [6, 1]},
    },
    raumstellen: ["Fenster", "Fußboden hinter WC", "Handwaschbecken"],
  },
  WP: {
    // Garten/Wärmepumpe – Raumbilder Graphic Artist 25.10.2026 (rohrbruch-raum-wp-a/b.png), eingemessen am Raster 25.10.2026
    varianten: {
      A: {
        bild: 'bilder/raum-wp-a.webp',
        stellen: {"Lamellen Außengerät": [240, 480], "Ventilator Außengerät": [387, 480], "Kondensatwanne": [300, 600], "Kondensatablauf": [512, 645], "Schwingungsdämpfer": [453, 607], "Hauswand": [520, 267], "Umgebung Außengerät": [80, 453], "Bedienteil Wärmepumpe": [643, 296], "Heizstab (Inneneinheit)": [695, 430], "Manometer Heizkreis": [730, 250], "Schmutzfänger Rücklauf": [775, 515], "Kugelhahn Rücklauf": [840, 525], "Umschaltventil": [805, 440], "Heizkreisverteiler": [860, 345], "Schnellentlüfter Inneneinheit": [790, 195], "Außenwasserhahn": [544, 420], "Absperrventil Außenwasserhahn": [629, 400]},
        wasser: { 'Außenwasserhahn': { tropfen: [535, 440, 690, 70] }, 'Hauswand': { rinnsal: [518, 280, 410, 18] } },
        verstecke: {"Regal hinter der Kellertür": [893, 420], "Schubkarre am Rasenrand": [253, 667], "neben der Gießkanne am Betonsockel": [540, 707], "Fensterbank am Kellerfenster": [387, 229], "oben auf der Inneneinheit": [700, 357], "unter der Fußmatte vor der offenen Tür": [727, 713], "Schlauchwagen an der Hauswand": [913, 680]},
        displays: {"Bedienteil Wärmepumpe": [632, 282, 656, 306]},
        leben: {"lampe": [[783, 150, 60]]},
        tierPlatz: [[600, 880], [450, 960], [760, 930]],
        // Kaninchen Eleonore (nur mit Herrn Brandl, Kaninchen-Runde 25.10.2026): Freigehege auf dem Rasen – linke obere Ecke [x, y] und
        // Breite des Bilds gehege-zu.webp im Raum (Höhe = Breite / 1,1864), unten/links etwas über den Rand
        gehege: { x: -40, y: 728, breite: 430 },
        // ZF-26 „Ausgebüxt“: Verstecke im Garten – fuss = Fußpunkt, h = Höhe der Pose „duckt“, spiegeln = Kopf nach links,
        // verdeck = Vielecke aus dem Raumbild, die über Eleonore gemalt werden (sie sitzt dahinter, halb sichtbar)
        kaninchen: [
          { name: 'hinter der Gießkanne', fuss: [505, 726], h: 46, verdeck: [[[458, 690], [468, 680], [490, 676], [512, 682], [514, 700], [512, 738], [495, 743], [468, 743], [458, 735]]] },
          { name: 'hinter dem Schlauchwagen', fuss: [830, 748], h: 54, spiegeln: true, verdeck: [
            [[832, 712], [845, 702], [860, 706], [867, 725], [867, 780], [857, 796], [840, 796], [830, 780]],
            [[848, 590], [863, 590], [863, 792], [848, 792]], [[862, 600], [966, 598], [968, 742], [862, 742]]] },
          { name: 'unter der Hecke', fuss: [72, 694], h: 50, verdeck: [[[0, 560], [175, 560], [175, 638], [112, 640], [104, 648], [96, 652], [86, 660], [76, 664], [66, 672], [54, 676], [42, 682], [30, 686], [16, 688], [0, 690]]] },
        ],
      },
      B: {
        bild: 'bilder/raum-wp-b.webp',
        stellen: {"Lamellen Außengerät": [320, 267], "Ventilator Außengerät": [163, 280], "Kondensatwanne": [240, 393], "Kondensatablauf": [296, 560], "Schwingungsdämpfer": [133, 403], "Hauswand": [440, 267], "Umgebung Außengerät": [53, 507], "Fallrohr": [391, 420], "Bedienteil Wärmepumpe": [630, 228], "Heizstab (Inneneinheit)": [740, 400], "Manometer Heizkreis": [645, 295], "Schmutzfänger Rücklauf": [595, 390], "Kugelhahn Rücklauf": [565, 445], "Umschaltventil": [672, 368], "Heizkreisverteiler": [627, 587], "Schnellentlüfter Inneneinheit": [763, 187], "Außenwasserhahn": [971, 493], "Absperrventil Außenwasserhahn": [843, 407]},
        wasser: { 'Außenwasserhahn': { tropfen: [952, 512, 600, 0, false] }, 'Hauswand': { rinnsal: [439, 280, 410, 18] }, 'Fallrohr': { tropfen: [400, 428, 760, 90] } },
        verstecke: {"Auflagenbox auf der Terrasse": [133, 747], "Regal über der Waschmaschine": [891, 320], "Pflanzkübel neben der Terrassentür": [460, 707], "oben auf der Inneneinheit": [715, 250], "unter der Fußmatte vor der offenen Tür": [680, 833], "Schlauchwagen an der Hauswand": [960, 800]},
        displays: {"Bedienteil Wärmepumpe": [607, 222, 644, 252]},
        leben: {"lampe": [[907, 133, 70]]},
        tierPlatz: [[450, 880], [560, 960], [300, 930]],
        // kein Gehege/Kaninchen in WP-B (MZ 25.10.2026: Eleonore nur in Variante A mit Rasen)
      },
    },
    bauteile: {
      blaetter: ["bilder/bauteile-wp-1.webp", "bilder/bauteile-wp-2.webp", "bilder/bauteile-hk-1.webp", "bilder/bauteile-hk-3.webp", "bilder/bauteile-wp-3.webp"],
      stellen: {"Lamellen Außengerät": [0, 0], "Ventilator Außengerät": [0, 1], "Kondensatwanne": [0, 2], "Kondensatablauf": [0, 3], "Schwingungsdämpfer": [0, 4], "Fallrohr": [0, 5], "Bedienteil Wärmepumpe": [1, 0], "Heizstab (Inneneinheit)": [1, 1], "Manometer Heizkreis": [2, 2], "Schmutzfänger Rücklauf": [3, 1], "Kugelhahn Rücklauf": [1, 2], "Umschaltventil": [1, 3], "Heizkreisverteiler": [1, 4], "Schnellentlüfter Inneneinheit": [1, 5], "Außenwasserhahn": [4, 0], "Absperrventil Außenwasserhahn": [4, 1]},
      masse: {"Bedienteil Wärmepumpe": {"display": [168, 128, 250, 132]}, "Manometer Heizkreis": {"skala": [259, 190, 132]}, "Schmutzfänger Rücklauf": {"mitte": [200, 370]}},
    },
    raumstellen: ["Hauswand", "Umgebung Außengerät"],
  },
  DB: {
    // Dachboden/Solar – Raumbilder Graphic Artist 25.10.2026 (rohrbruch-raum-db-a/b.png), eingemessen am Raster 25.10.2026
    varianten: {
      A: {
        bild: 'bilder/raum-db-a.webp',
        stellen: {"Solarregler": [283, 344], "Solarpumpe": [340, 355], "Durchflussmesser Solar": [400, 390], "Solarstation-Manometer": [387, 291], "Luftabscheider Solar": [377, 229], "Schwerkraftbremse": [353, 447], "Ausdehnungsgefäß Solar": [480, 273], "Sicherheitsventil Solar": [524, 173], "Auffangbehälter": [477, 407], "Probeglas Solarflüssigkeit": [897, 453], "Solarleitungen mit Dämmung": [433, 527], "Kollektorfeld (Dachfenster)": [880, 230], "Fühlerleitung am Kollektor (Dachfenster)": [940, 327], "Solarspeicher": [640, 440], "Dielenboden": [400, 800], "Dachfenster": [800, 345]},
        wasser: { 'Sicherheitsventil Solar': { rinnsal: [527, 188, 275, 12] }, 'Kollektorfeld (Dachfenster)': { rinnsal: [880, 215, 300, 14] }, 'Dielenboden': { pfuetze: [400, 805, 260] } },
        verstecke: {"hinter dem Solarspeicher": [753, 560], "auf dem Boden neben der Solarstation": [413, 627], "Fensterbrett unter dem Dachfenster": [800, 470], "Querbalken zwischen den Dachsparren": [533, 47], "alte Truhe unter der Dachschräge": [120, 587], "Kartonstapel neben der Bodentreppe": [967, 667]},
        displays: {"Solarregler": [262, 318, 312, 342]},
        tierPlatz: [[300, 880], [560, 900], [450, 960]],
      },
      B: {
        bild: 'bilder/raum-db-b.webp',
        stellen: {"Solarregler": [440, 229], "Solarpumpe": [425, 330], "Durchflussmesser Solar": [478, 365], "Solarstation-Manometer": [533, 229], "Luftabscheider Solar": [545, 330], "Schwerkraftbremse": [420, 405], "Ausdehnungsgefäß Solar": [400, 507], "Sicherheitsventil Solar": [517, 467], "Auffangbehälter": [536, 616], "Probeglas Solarflüssigkeit": [357, 267], "Solarleitungen mit Dämmung": [513, 107], "Kollektorfeld (Dachfenster)": [915, 100], "Fühlerleitung am Kollektor (Dachfenster)": [867, 173], "Solarspeicher": [680, 440], "Dielenboden": [400, 867], "Dachfenster": [787, 200], "Therme-Display": [200, 367], "Manometer Heizung": [328, 371], "Ausdehnungsgefäß Heizung": [273, 567], "Schnellentlüfter": [316, 157], "Kondensatschlauch Therme": [200, 540]},
        wasser: { 'Sicherheitsventil Solar': { rinnsal: [518, 475, 545, 12] }, 'Ausdehnungsgefäß Heizung': { tropfen: [273, 628, 668, 80] }, 'Schnellentlüfter': { tropfen: [316, 165, 286] }, 'Kollektorfeld (Dachfenster)': { rinnsal: [914, 90, 170, 12] }, 'Dielenboden': { pfuetze: [400, 870, 260] } },
        verstecke: {"hinter dem Solarspeicher": [787, 600], "auf dem Boden neben der Solarstation": [453, 653], "Fensterbrett unter dem Dachfenster": [867, 267], "Wandschrank neben der Therme": [47, 253], "Regal mit Anlagenordnern": [953, 327], "Werkzeugbrett an der Wand": [960, 460], "Schublade im Rollcontainer": [927, 680]},
        displays: {"Solarregler": [417, 213, 464, 244], "Therme-Display": [171, 357, 231, 380]},
        tierPlatz: [[300, 880], [600, 900], [450, 960]],
      },
    },
    bauteile: {
      blaetter: ["bilder/bauteile-db-1.webp", "bilder/bauteile-db-2.webp", "bilder/bauteile-hk-1.webp", "bilder/bauteile-wp-2.webp", "bilder/lupe2-1.webp", "bilder/lupe2-2.webp"],
      stellen: {"Solarregler": [0, 0], "Solarpumpe": [0, 1], "Durchflussmesser Solar": [0, 2], "Luftabscheider Solar": [0, 3], "Auffangbehälter": [0, 4], "Probeglas Solarflüssigkeit": [0, 5], "Solarleitungen mit Dämmung": [1, 0], "Kollektorfeld (Dachfenster)": [1, 1], "Fühlerleitung am Kollektor (Dachfenster)": [1, 2], "Solarspeicher": [1, 3], "Kondensatschlauch Therme": [1, 4], "Solarstation-Manometer": [2, 2], "Manometer Heizung": [2, 2], "Schwerkraftbremse": [3, 2], "Ausdehnungsgefäß Solar": [2, 3], "Ausdehnungsgefäß Heizung": [2, 3], "Sicherheitsventil Solar": [2, 4], "Therme-Display": [2, 0], "Schnellentlüfter": [3, 5]},
      masse: {"Solarregler": {"display": [176, 103, 227, 113]}, "Solarstation-Manometer": {"skala": [259, 190, 132]}, "Manometer Heizung": {"skala": [259, 190, 132]}, "Ausdehnungsgefäß Solar": {"mitte": [200, 260]}, "Ausdehnungsgefäß Heizung": {"mitte": [200, 260]}, "Sicherheitsventil Solar": {"mitte": [348, 420]}, "Therme-Display": {"display": [181, 180, 152, 66]}},
      zweite: {"Solarleitungen mit Dämmung": [4, 5], "Probeglas Solarflüssigkeit": [5, 0]},
    },
    raumstellen: ["Dachfenster", "Dielenboden"],
  },
  AT: {
    // Altbau-Therme – Raumbilder Graphic Artist 25.10.2026 (rohrbruch-raum-at-a/b.png), eingemessen am Raster 25.10.2026
    varianten: {
      A: {
        bild: 'bilder/raum-at-a.webp',
        stellen: {"Therme-Display": [365, 270], "Bedienknöpfe Therme": [330, 345], "Manometer Therme": [410, 330], "Füllhahn": [353, 433], "Ablauftrichter": [351, 553], "Gashahn Therme": [287, 464], "Kaltwasser-Eingangssieb": [405, 395], "Kondensatschlauch": [387, 493], "Luft-Abgas-Rohr": [287, 120], "Spülenarmatur Warmwasser": [513, 473], "Strahlregler Spüle": [565, 435], "Heizkörper Küche": [840, 560], "Heizkörperventil Küche": [909, 511], "Raumthermostat": [640, 317], "Fenster": [793, 267]},
        wasser: { 'Ablauftrichter': { tropfen: [352, 540, 575, 0, false] }, 'Heizkörperventil Küche': { tropfen: [905, 522, 668, 90] }, 'Heizkörper Küche': { pfuetze: [835, 670, 170] } },
        verstecke: {"Spülenunterschrank": [493, 600], "Krimskrams-Schublade neben dem Herd": [740, 533], "Fensterbank": [800, 469], "oben auf dem Kühlschrank": [173, 267], "altes Küchenbuffet mit Glastüren": [53, 333], "Stoffbeutel an der Hakenleiste neben der Tür": [987, 413], "Korb unter dem Holztisch": [933, 793]},
        displays: {"Therme-Display": [344, 288, 389, 308]},
        leben: {"lampe": [[533, 50, 110]]},
        tierPlatz: [[450, 880], [650, 900], [300, 960]],
      },
      B: {
        bild: 'bilder/raum-at-b.webp',
        stellen: {"Therme-Display": [355, 160], "Bedienknöpfe Therme": [331, 243], "Manometer Therme": [399, 241], "Füllhahn": [360, 320], "Ablauftrichter": [440, 296], "Gashahn Therme": [300, 300], "Kaltwasser-Eingangssieb": [412, 355], "Abgasrohr": [340, 40], "Spülenarmatur Warmwasser": [410, 425], "Strahlregler Spüle": [340, 445], "Heizkörper Küche": [753, 527], "Heizkörperventil Küche": [837, 451], "Raumthermostat": [37, 264], "Dunstabzugshaube": [560, 247], "Fenster": [760, 267]},
        wasser: { 'Ablauftrichter': { tropfen: [440, 282, 306, 0, false] }, 'Heizkörperventil Küche': { tropfen: [838, 462, 602, 80] }, 'Heizkörper Küche': { pfuetze: [755, 607, 170] } },
        verstecke: {"Spülenunterschrank": [380, 573], "Krimskrams-Schublade neben dem Herd": [669, 491], "Fensterbank": [760, 400], "oben auf dem Kühlschrank": [93, 473], "Besenschrank neben der Tür": [213, 400], "Schublade im Küchentisch": [887, 753], "Wandregal über der Eckbank": [953, 253]},
        displays: {"Therme-Display": [344, 207, 387, 224]},
        leben: {"lampe": [[551, 55, 110]]},
        tierPlatz: [[450, 860], [650, 880], [300, 950]],
      },
    },
    bauteile: {
      blaetter: ["bilder/bauteile-hk-1.webp", "bilder/bauteile-at-1.webp", "bilder/bauteile-hk-2.webp", "bilder/bauteile-db-2.webp", "bilder/bauteile-hk-3.webp", "bilder/bauteile-ku-1.webp", "bilder/bauteile-gw-2.webp", "bilder/bauteile-at-2.webp", "bilder/lupe2-2.webp"],
      stellen: {"Therme-Display": [0, 0], "Bedienknöpfe Therme": [1, 0], "Manometer Therme": [0, 2], "Füllhahn": [1, 1], "Ablauftrichter": [1, 2], "Gashahn Therme": [2, 0], "Kaltwasser-Eingangssieb": [1, 3], "Kondensatschlauch": [3, 4], "Luft-Abgas-Rohr": [1, 4], "Abgasrohr": [4, 3], "Spülenarmatur Warmwasser": [5, 0], "Strahlregler Spüle": [5, 1], "Heizkörper Küche": [6, 0], "Heizkörperventil Küche": [6, 1], "Raumthermostat": [1, 5], "Dunstabzugshaube": [7, 0]},
      masse: {"Therme-Display": {"display": [181, 180, 152, 66]}, "Manometer Therme": {"skala": [259, 190, 132]}, "Raumthermostat": {"display": [96, 120, 305, 140]}},
      zweite: {"Dunstabzugshaube": [8, 1], "Kondensatschlauch": [8, 2], "Raumthermostat": [8, 3]},
      masse2: {"Raumthermostat": {"display": [96, 120, 305, 140]}},
    },
    raumstellen: ["Fenster"],
  },
  HA: {
    // Hausanschlussraum – Raumbilder Graphic Artist 25.10.2026 (rohrbruch-raum-ha-a/b.png), eingemessen am Raster 25.10.2026
    varianten: {
      A: {
        bild: 'bilder/raum-ha-a.webp',
        stellen: {"Hauptabsperrventil": [229, 307], "Wasserzähler": [358, 330], "Wasserzähler-Verschraubungen": [290, 345], "Manometer vor dem Filter": [449, 263], "Rückspülfilter": [513, 400], "Druckminderer": [575, 320], "Druckminderer-Manometer": [657, 288], "Verschraubung nach Druckminderer": [645, 350], "Boden unter den Rohren": [330, 670], "Bodenablauf": [484, 703], "Rückstauverschluss": [413, 603], "Kellerwand": [533, 93], "Hebeanlage": [727, 587], "Schwimmer Hebeanlage": [663, 611], "Hauswasserwerk": [800, 473], "Druckkessel": [860, 320]},
        wasser: { 'Verschraubung nach Druckminderer': { tropfen: [644, 356, 540] }, 'Boden unter den Rohren': { pfuetze: [350, 690, 260] } },
        verstecke: {"Holzregal mit Einmachgläsern": [40, 400], "Kartoffelkiste in der Ecke": [53, 800], "Mauernische in der Bruchsteinwand": [200, 147], "Gummistiefel neben der Kellertreppe": [907, 720], "Hocker neben der Tür": [913, 573], "Brett über der Hauswasserstation": [480, 180], "Gartenschlauch-Trommel in der Ecke": [160, 573]},
        leben: {"lampe": [[493, 27, 110]]},
        tierPlatz: [[600, 900], [400, 950], [750, 960]],
        // Lichtschalter für Zwischenfall „Licht aus“ (ZF-07), neben der Tür bzw. an der Wand – Runde Spieltest 3
        schalter: [930, 400],
      },
      B: {
        bild: 'bilder/raum-ha-b.webp',
        stellen: {"Hauptabsperrventil": [270, 275], "Wasserzähler": [370, 315], "Wasserzähler-Verschraubungen": [300, 340], "Manometer vor dem Filter": [417, 267], "Rückspülfilter": [467, 373], "Druckminderer": [515, 325], "Druckminderer-Manometer": [585, 268], "Verschraubung nach Druckminderer": [590, 335], "Boden unter den Rohren": [400, 693], "Enthärtungsanlage (Display)": [620, 410], "Salzbehälter": [720, 587], "Verschneideventil": [555, 470], "Probierhahn nach Enthärtung": [665, 295], "Spülwasserschlauch Enthärtung": [513, 600], "Bodenablauf": [509, 687], "Gas-Hauptabsperreinrichtung": [891, 315]},
        wasser: { 'Verschraubung nach Druckminderer': { tropfen: [589, 346, 384] }, 'Boden unter den Rohren': { pfuetze: [400, 705, 260] } },
        verstecke: {"Metallregal mit Kartons": [147, 347], "Salzsäcke neben der Enthärtung": [833, 627], "Getränkekisten an der Wand": [967, 707], "Hocker neben der Tür": [80, 693], "Brett über der Hauswasserstation": [360, 185], "Gartenschlauch-Trommel in der Ecke": [953, 520]},
        leben: {"lampe": [[503, 27, 110]]},
        tierPlatz: [[600, 880], [400, 930], [750, 960]],
        // Lichtschalter für Zwischenfall „Licht aus“ (ZF-07), neben der Tür bzw. an der Wand – Runde Spieltest 3
        schalter: [92, 400],
      },
    },
    bauteile: {
      blaetter: ["bilder/bauteile-ha-1.webp", "bilder/bauteile-hk-1.webp", "bilder/bauteile-ha-2.webp", "bilder/bauteile-ha-3.webp", "bilder/lupe2-2.webp", "bilder/lupe2-3.webp"],
      stellen: {"Hauptabsperrventil": [0, 0], "Wasserzähler": [0, 1], "Wasserzähler-Verschraubungen": [0, 2], "Manometer vor dem Filter": [1, 2], "Rückspülfilter": [0, 3], "Druckminderer": [0, 4], "Druckminderer-Manometer": [1, 2], "Verschraubung nach Druckminderer": [0, 5], "Enthärtungsanlage (Display)": [2, 0], "Salzbehälter": [2, 1], "Verschneideventil": [2, 2], "Probierhahn nach Enthärtung": [2, 3], "Spülwasserschlauch Enthärtung": [2, 4], "Bodenablauf": [2, 5], "Rückstauverschluss": [3, 0], "Hebeanlage": [3, 1], "Schwimmer Hebeanlage": [3, 2], "Hauswasserwerk": [3, 3], "Gas-Hauptabsperreinrichtung": [3, 4], "Druckkessel": [1, 3]},
      masse: {"Manometer vor dem Filter": {"skala": [259, 190, 132]}, "Druckminderer-Manometer": {"skala": [259, 190, 132]}, "Enthärtungsanlage (Display)": {"display": [170, 118, 215, 72]}, "Druckkessel": {"mitte": [200, 260]}},
      zweite: {"Salzbehälter": [4, 4], "Rückstauverschluss": [4, 5], "Schwimmer Hebeanlage": [5, 0]},
    },
    raumstellen: ["Boden unter den Rohren", "Kellerwand"],
  },
  WZ: {
    // Wohnzimmer/Heizkörper – Raumbilder Graphic Artist 25.10.2026 (rohrbruch-raum-wz-a/b.png), eingemessen am Raster 25.10.2026
    varianten: {
      A: {
        bild: 'bilder/raum-wz-a.webp',
        stellen: {"Heizkörper": [653, 420], "Thermostatkopf": [795, 370], "Ventilstift": [720, 360], "Voreinstellring Ventil": [750, 420], "Entlüftungsventil Heizkörper": [563, 376], "Rücklaufverschraubung": [557, 477], "Fußboden": [650, 548], "Vorhang": [780, 200], "Raumthermometer": [925, 175], "Fensterbank": [653, 340], "Raumbedienteil Heizung": [853, 192]},
        wasser: { 'Rücklaufverschraubung': { tropfen: [557, 490, 517] }, 'Fußboden': { pfuetze: [600, 540, 200] } },   // Stelle Fußboden unter die Verschraubung gerückt („Fleck genau unter der Verschraubung“)
        verstecke: {"Schublade der Kommode": [133, 400], "Zeitungskorb neben dem Ohrensessel": [967, 680], "unteres Fach im Bücherregal": [40, 400], "Blumenständer in der Ecke": [960, 320], "unter dem Sofakissen": [120, 600], "Ablage unter dem Couchtisch": [400, 747], "neben der Stehlampe": [980, 790]},
        overlays: {"Vorhang": {"bild": "bilder/overlay-wz-a-vorhang.webp", "rechteck": [471, 29, 852, 518]}},
        tierPlatz: [[620, 900], [820, 860], [500, 960]],
      },
      B: {
        bild: 'bilder/raum-wz-b.webp',
        stellen: {"Fußboden": [533, 800], "Raumthermometer": [263, 196], "Raumbedienteil Heizung": [173, 191], "Raumthermostat": [91, 184], "Stellantriebe": [187, 413], "Durchflussmesser FBH": [187, 320], "Entlüfter FBH-Verteiler": [256, 296], "Kugelhähne Verteiler": [73, 380]},
        wasser: { 'Fußboden': { pfuetze: [534, 812, 220] } },
        verstecke: {"unten im Verteilerschrank": [160, 540], "Lowboard unter dem Fernseher": [893, 453], "Spielzeugkiste": [953, 600], "unter dem Sofakissen": [707, 387], "Ablage unter dem Couchtisch": [640, 547], "neben der Stehlampe": [360, 480]},
        tierPlatz: [[450, 760], [700, 720], [300, 900]],
      },
    },
    bauteile: {
      blaetter: ["bilder/bauteile-gw-2.webp", "bilder/bauteile-ba-4.webp", "bilder/bauteile-wz-1.webp", "bilder/bauteile-hk-3.webp", "bilder/bauteile-hk-1.webp", "bilder/bauteile-at-1.webp", "bilder/bauteile-wp-2.webp", "bilder/lupe2-3.webp", "bilder/lupe2-4.webp"],
      stellen: {"Heizkörper": [0, 0], "Thermostatkopf": [1, 2], "Ventilstift": [0, 1], "Voreinstellring Ventil": [2, 0], "Entlüftungsventil Heizkörper": [0, 2], "Rücklaufverschraubung": [1, 1], "Raumthermometer": [8, 0], "Raumbedienteil Heizung": [4, 1], "Raumthermostat": [5, 5], "Stellantriebe": [2, 1], "Durchflussmesser FBH": [2, 2], "Entlüfter FBH-Verteiler": [2, 3], "Kugelhähne Verteiler": [6, 2]},
      masse: {"Raumthermometer": {"skala": [251, 245, 128], "max": 40, "schritt": 10}, "Raumbedienteil Heizung": {"display": [134, 129, 240, 127]}, "Raumthermostat": {"display": [96, 120, 305, 140]}},
      zweite: {"Vorhang": [7, 1]},
    },
    raumstellen: ["Fensterbank", "Fußboden", "Vorhang"],
  },
  BU: {
    // Büro/Split-Klima – Raumbilder Graphic Artist 25.10.2026 (rohrbruch-raum-bu-a/b.png), eingemessen am Raster 25.10.2026
    varianten: {
      A: {
        bild: 'bilder/raum-bu-a.webp',
        stellen: {"Innengerät-Anzeige": [460, 113], "Luftfilter Innengerät": [230, 85], "Wärmetauscher Innengerät": [330, 120], "Lüfterwalze Innengerät": [275, 175], "Kondensatwanne Innengerät": [400, 211], "Luftleitlamelle": [227, 220], "Kondensatschlauch": [624, 400], "Kondensatpumpe": [540, 135], "Fernbedienung": [200, 513], "Außengerät": [947, 500], "Heizkörper Büro": [727, 587], "Thermostatkopf Büro": [809, 527]},
        verstecke: {"Aktenregal an der Wand": [47, 213], "Ablage in der Kaffeeecke": [53, 493], "Rollcontainer unter dem Schreibtisch": [247, 667], "Fensterbank über dem Heizkörper": [747, 467], "Druckerschrank mit Papierfach": [953, 760], "Blumenkasten auf dem Balkon neben dem Außengerät": [980, 400]},
        displays: {"Innengerät-Anzeige": [467, 91, 500, 107]},
        tierPlatz: [[500, 860], [700, 800]],
      },
      B: {
        bild: 'bilder/raum-bu-b.webp',
        stellen: {"Innengerät-Anzeige": [320, 93], "Luftfilter Innengerät": [133, 87], "Wärmetauscher Innengerät": [240, 80], "Lüfterwalze Innengerät": [187, 127], "Kondensatwanne Innengerät": [267, 133], "Luftleitlamelle": [80, 133], "Kondensatschlauch": [380, 267], "Kondensatpumpe": [384, 93], "Fernbedienung": [127, 473], "Außengerät": [613, 320], "Handwaschbecken": [907, 533], "Sensorarmatur": [987, 473], "Sieb Sensorarmatur": [978, 600], "Eckventil Handwaschbecken": [880, 613], "Siphon Handwaschbecken": [947, 667]},
        verstecke: {"Aktenregal an der Wand": [53, 333], "Ablage in der Kaffeeecke": [280, 380], "Schublade im Empfangstresen": [207, 660], "Handtuchregal mit Therapiebändern": [933, 293], "Zeitschriftenständer im Wartebereich": [753, 533], "Unterschrank am Handwaschbecken": [907, 747]},
        displays: {"Innengerät-Anzeige": [311, 83, 331, 107]},
        tierPlatz: [[500, 860], [700, 900]],
      },
    },
    bauteile: {
      blaetter: ["bilder/bauteile-bu-1.webp", "bilder/bauteile-bu-2.webp", "bilder/bauteile-db-2.webp", "bilder/bauteile-gw-2.webp", "bilder/bauteile-ba-4.webp", "bilder/bauteile-ba-1.webp", "bilder/lupe2-3.webp", "bilder/lupe2-4.webp"],
      stellen: {"Innengerät-Anzeige": [0, 0], "Luftfilter Innengerät": [0, 1], "Wärmetauscher Innengerät": [0, 2], "Lüfterwalze Innengerät": [0, 3], "Kondensatwanne Innengerät": [0, 4], "Luftleitlamelle": [0, 5], "Kondensatpumpe": [1, 0], "Fernbedienung": [1, 1], "Außengerät": [1, 2], "Sensorarmatur": [1, 3], "Sieb Sensorarmatur": [1, 4], "Kondensatschlauch": [2, 4], "Heizkörper Büro": [3, 0], "Thermostatkopf Büro": [4, 2], "Eckventil Handwaschbecken": [5, 3], "Siphon Handwaschbecken": [5, 1]},
      masse: {"Innengerät-Anzeige": {"display": [205, 318, 68, 36]}, "Fernbedienung": {"display": [196, 70, 112, 88]}},
      zweite: {"Kondensatschlauch": [6, 2], "Lüfterwalze Innengerät": [7, 3], "Außengerät": [6, 4]},
    },
    raumstellen: ["Handwaschbecken"],
  },
  // ===== Ende Phase 3 =====
};

// Werkzeug und Teile mit Bild (Blatt 4×3, Zellen 384×341): Name wie in der Schlussliste 2 des Katalogs.
// Alle Blätter mit Gegenständen und Bauteilen sind freigestellt (WebP mit Alpha, rohrbruch-bilder.py blaetter, 25.10.2026).
// Zweite Lupenbilder Fassung 4 (lupe2-4.webp, QA Phase 3, 25.10.2026): KU-03 Siphon mit Kappe, GW-10 Drückerplatte schief,
// BU-03 Lüfterwalze stark verschmutzt; Raumthermometer Wohnraum (WZ) als Normalbild mit leerem Zifferblatt (skala, 0–40 °C)
window.ROHRBRUCH_WERKZEUG = {
  blatt: 'bilder/werkzeug-hk.webp', spalten: 4, zeilen: 3,
  liste: ['Füllschlauch', 'Reinigungsbürste', 'Luftpumpe mit Manometer', 'Schraubendreher', 'Bedienungsanleitung',
    'Speicherfühler', 'Taschenlampe', 'Zündelektrode', 'Außenfühler', 'Wasserpumpenzange', 'Eimer', 'Schutzhandschuhe'],
  // Grundausstattung (Ablenkung, wenn nicht gebraucht): was im Koffer bzw. im Transporter liegt. Dazu kommen im Spiel alle
  // Gegenstände derselben Herkunft aus den Störungen des Orts. Herkunftsregel (Spieltest 24.10.2026): Taschenlampe und
  // Eimer sind Sachen des Kunden (Raum), Füllschlauch liegt im Transporter.
  koffer: ['Reinigungsbürste', 'Schraubendreher', 'Wasserpumpenzange', 'Schutzhandschuhe'],
  transporter: ['Speicherfühler', 'Zündelektrode', 'Außenfühler', 'Luftpumpe mit Manometer', 'Füllschlauch'],
  // Weitere Bildblätter (neue Hilfsmittel, Ablenker), sobald der Graphic Artist sie liefert – je
  // { blatt: 'bilder/….webp', spalten, zeilen, liste: [Namen in Zellen-Reihenfolge] }. Ohne Bild zeigt das Spiel einen Platzhalter.
  // Gestaltet vom Graphic Artist (Spieltest-Runde 24.10.2026), Originale Material/Bilder/rohrbruch-hilfsmittel-*.png und -ablenker-*.png
  weitere: [
    // Häufige Werkzeuge (Graphic Artist, 25.10.2026, Original rohrbruch-werkzeug-2.png) – ersetzt u. a. die Platzhalter im Keller
    { blatt: 'bilder/werkzeug-2.webp', spalten: 4, zeilen: 3, liste: ['Maulschlüssel', 'Dichtungssortiment', 'Entlüftungsschlüssel',
      'Rohrreinigungsspirale', 'Servicetablet', 'Sechskantschlüssel', 'Cuttermesser', 'Lamellenbürste', 'Handstaubsauger', 'Saugglocke',
      'Strahlregler-Schlüssel', 'Voreinstellschlüssel'] },
    // Teile und Hilfsmittel der übrigen Orte (Graphic Artist, 25.10.2026, Originale rohrbruch-werkzeug-3..6.png, je 5×2,
    // Belegung Material/Bilder/rohrbruch-blaetter-belegung.md; Blatt 4–6 mit leerer letzter Zelle)
    { blatt: 'bilder/werkzeug-3.webp', spalten: 5, zeilen: 2, liste: ['Befüllpumpe Solar', 'Entkalker', 'Fernbedienung', 'Holzstab',
      'Klima-Reinigungsmittel', 'Verstellschlüssel Thermostatkopf', 'Wasserhärte-Teststreifen', 'Abgleichprotokoll', 'Thermostatkopf', 'Armaturen-Kartusche'] },
    { blatt: 'bilder/werkzeug-4.webp', spalten: 5, zeilen: 2, liste: ['Ausdehnungsgefäß', 'Batterien', 'Ersatzkette Spülkasten', 'Fallrohr-Muffe',
      'Fensterkontaktschalter', 'Frostsicherer Außenwasserhahn', 'Funk-Raumthermostat', 'Füllhahn', 'Füllventil'] },
    { blatt: 'bilder/werkzeug-5.webp', spalten: 5, zeilen: 2, liste: ['Hochtemperatur-Dämmung', 'Kollektorfühler', 'Kondensatpumpe', 'Kondensatschlauch',
      'Plattenwärmetauscher', 'Rohrbelüfter', 'Rohrdämmung', 'Rohrschellen', 'Sanitärsilikon'] },
    { blatt: 'bilder/werkzeug-6.webp', spalten: 5, zeilen: 2, liste: ['Schnellentlüfter', 'Schwingungsdämpfer', 'Zulaufschlauch', 'Solarflüssigkeit',
      'Stellantrieb', 'Stellmotor Umschaltventil', 'Thermostatkartusche', 'Thermostatkopf mit Fernfühler', 'WC-Anschlussmanschette'] },
    { blatt: 'bilder/hilfsmittel-1.webp', spalten: 5, zeilen: 2, liste: ['Lappen', 'Dichtband', 'Spannungsprüfer', 'Kartuschenpresse', 'Fugenglätter',
      'Leiter', 'Schwamm', 'Gießkanne', 'Schutzbrille', 'Auffangsack Klimagerät'] },
    { blatt: 'bilder/hilfsmittel-2.webp', spalten: 5, zeilen: 2, liste: ['Staubmaske', 'Müllsack', 'Absturzsicherung', 'Leerkanister', 'Lecksuchspray',
      'Abgasmessgerät', 'Schüssel', 'Dämmklebeband', 'Hebehilfe', 'Ventiladapter'] },
    { blatt: 'bilder/ablenker-1.webp', spalten: 4, zeilen: 3, liste: ['Einmachglas', 'Schlitten', '(alt) Fahrradpumpe', 'Christbaumkugeln',
      'Waschmittel', 'Farbrolle', '(alt) Föhn', 'Nagelschere', 'Badebombe', 'Lockenwickler', 'Duschabzieher', 'Rasierer'] },
    { blatt: 'bilder/ablenker-2.webp', spalten: 4, zeilen: 3, liste: ['Kochlöffel', 'Topflappen', 'Schneebesen', 'Eierschneider',
      '(alt) Küchenschere', 'Kaffeefilter', 'Duftspray', 'Toilettenpapier-Rolle', 'Gästehandtuch', 'Seifenflasche', 'Duftkerze', 'Gummiente'] },
    { blatt: 'bilder/ablenker-3.webp', spalten: 4, zeilen: 3, liste: ['Gartenschere', 'Rasensprenger', 'Grillzange', 'Windlicht',
      'Sack Blumenerde', 'Gartenzwerg', 'Federballschläger', 'Mausefalle', 'Tischventilator', 'Ordner mit Rechnungen', 'Wäscheständer', 'Schaukelpferd'] },
    { blatt: 'bilder/ablenker-4.webp', spalten: 4, zeilen: 3, liste: ['Salzstreuer', 'Klebeband', 'Nudelholz', 'Kaffeedose',
      '(alt) Kerze', 'Kochbuch', 'Glas Essiggurken', 'Fahrradschlauch', 'Paketklebeband', 'Nordic-Walking-Stöcke', 'Wäscheklammern', '(alt) Alter Malerpinsel'] },
    { blatt: 'bilder/ablenker-5.webp', spalten: 4, zeilen: 3, liste: ['Kuscheldecke', 'Fernseh-Fernbedienung', 'Fernsehzeitschrift', 'Orchideendünger',
      'Spielzeugauto', 'Handy-Ladekabel', 'Stressball', 'Notizblock', 'Locher', 'Klebefilm-Abroller', 'Massageöl', 'Handdesinfektionsmittel'] },
    // Ersatz nach der QA (24.10.2026); die mit „(alt)“ markierten Zellen oben werden nicht mehr verwendet
    { blatt: 'bilder/ablenker-6.webp', spalten: 3, zeilen: 2, liste: ['Kiste Leergut', 'Pfannenwender', 'Bademantel', 'Brotkorb', 'Wollmütze', 'Abdeckplane'] },
    // Motive der Zwischenfälle (Phase 3, Original rohrbruch-zwischenfall.png); Visitenkarten-Streifen #00FF00 → Hausfarbe („#gruen“)
    { blatt: 'bilder/zwischenfall.webp#gruen', spalten: 3, zeilen: 2, liste: ['Lichtschalter', 'Sicherungskasten', 'Taube', 'Visitenkarten',
      'Taschenlampe eingeschaltet', 'Tasse Kaffee'] },
  ],
};

// Lupe „tropft“ (Handgriff-Runde 25.10.2026): Stelle im Lupenbild, an der der Tropfen hängt (Zell-Koordinaten 0–512).
// Ohne Eintrag hängt er knapp unter der Mitte des Bauteils.
(function (O) {
  const T = {
    HK: { 'Sicherheitsventil': [355, 470] },
    BA: { 'Waschtischarmatur': [423, 311] },
    KU: { 'Kaltwasserleitung unter Spüle': [200, 285], 'Eckventil kalt': [330, 260], 'Ausziehbrause-Schlauch': [256, 455] },
    GW: { 'Armatur Handwaschbecken': [418, 276], 'WC-Becken': [273, 235] },
    WP: { 'Außenwasserhahn': [461, 485], 'Fallrohr': [300, 230] },
    DB: { 'Ausdehnungsgefäß Heizung': [256, 440], 'Schnellentlüfter': [250, 95] },
    AT: { 'Ablauftrichter': [230, 30], 'Heizkörperventil Küche': [458, 152] },
    HA: { 'Verschraubung nach Druckminderer': [230, 318] },
    WZ: { 'Rücklaufverschraubung': [307, 352] },
  };
  Object.keys(T).forEach(o => { if (O[o] && O[o].bauteile) O[o].bauteile.tropfen = T[o]; });
})(window.ROHRBRUCH_ORTE);

