// Automatisch erzeugt mit Material/Texte/rohrbruch-erzeugen.py aus den Markdown-Entwürfen – nicht von Hand ändern.
window.ROHRBRUCH = {
 "stand": "25.10.2026",
 "orte": {
  "HK": {
   "name": "Heizungskeller",
   "funk": [
    "Ab in den Heizungskeller, {figur} wartet schon. Erst schauen, dann schrauben.",
    "{figur} hat angerufen, der Heizungskeller macht Ärger. Fahr bitte mal hin.",
    "{figur} braucht dich im Keller. Nimm die Lupe mit, nicht nur den Schlüssel."
   ]
  },
  "BA": {
   "name": "Bad",
   "funk": [
    "{figur} hat angerufen, im Bad stimmt etwas nicht. Schau dir erst alles an.",
    "Badeinsatz: {figur} wartet schon. Handtuch brauchst du keins, die Lupe schon.",
    "{figur} braucht dich im Bad. Ob es tropft, rinnt oder steht – finde es heraus."
   ]
  },
  "KU": {
   "name": "Küche",
   "funk": [
    "{figur} hat Ärger mit dem Wasser in der Küche. Erst unter die Spüle schauen.",
    "Nächster Einsatz: {figur}, Küche. Kaffee gibt es dort sicher, Ersatzteile nicht.",
    "{figur} ruft aus der Küche an. Es tropft, spritzt oder stinkt – fahr bitte hin."
   ]
  },
  "GW": {
   "name": "Gäste-WC",
   "funk": [
    "Nächster Einsatz: {figur}, Gäste-WC. Wenig Platz – erst schauen, dann auspacken.",
    "{figur} meldet Ärger im Gäste-WC. Kleiner Raum, aber da steckt viel Technik drin.",
    "Das Gäste-WC streikt, sagt {figur}. Fahr bitte hin, und vergiss die Lupe nicht."
   ]
  },
  "WP": {
   "name": "Wärmepumpe",
   "funk": [
    "Nächster Einsatz: {figur}, Wärmepumpe. Erst draußen schauen, dann drinnen.",
    "{figur} hat Ärger mit der Wärmepumpe. Schau draußen und drinnen hinter der Tür.",
    "{figur} braucht dich am Außengerät. Kältekreis ist tabu, der Rest gehört dir."
   ]
  },
  "DB": {
   "name": "Dachboden",
   "funk": [
    "Nächster Einsatz: {figur}, Dachboden. Die Solaranlage will nicht so recht.",
    "{figur} ruft vom Dachboden an. Erst die Solarstation ansehen, dann aufdrehen.",
    "Ab unters Dach, {figur} wartet. Denk dran: Solarflüssigkeit kann richtig heiß sein."
   ]
  },
  "AT": {
   "name": "Altbauwohnung",
   "funk": [
    "Nächster Einsatz: {figur}, Altbauwohnung. Die Therme hängt dort in der Küche.",
    "{figur} ruft an: Ärger mit der Gastherme. Erst genau hinschauen, dann schrauben.",
    "Die Altbau-Therme zickt, sagt {figur}. Fahr bitte hin und schau sie dir an."
   ]
  },
  "HA": {
   "name": "Hausanschlussraum",
   "funk": [
    "Nächster Einsatz: {figur}, Hausanschlussraum. Da, wo das Wasser ins Haus kommt.",
    "{figur} hat Ärger mit dem Wasser im ganzen Haus. Fang dort an, wo es reinkommt.",
    "Ab zum Hausanschluss, {figur} wartet. Zähler und Plomben gehören dem Versorger."
   ]
  },
  "WZ": {
   "name": "Wohnzimmer",
   "funk": [
    "Nächster Einsatz: {figur}, Wohnzimmer. Da will es einfach nicht gemütlich werden.",
    "{figur} friert im eigenen Wohnzimmer. Erst fühlen und schauen, dann drehen.",
    "Ab ins Wohnzimmer, {figur} wartet. Schuhe gut abtreten, das ist die gute Stube."
   ]
  },
  "BU": {
   "name": "Büro | Praxis",
   "funk": [
    "Nächster Einsatz: {figur}, diesmal nicht daheim, sondern am Arbeitsplatz.",
    "{figur} ruft aus der Arbeit an. Dort hängt ein Klimagerät – und irgendwas hakt.",
    "{figur} hat zwischen zwei Terminen kurz Zeit. Schau dir das bitte vor Ort an."
   ]
  }
 },
 "katalog": [
  {
   "id": "HK-01",
   "ort": "HK",
   "titel": "Alle Heizkörper kalt – Druck weg",
   "erklaer": "Fehlt Wasser im Heizkreis, fällt der Druck und der Kessel sperrt zum Schutz. Nachfüllen über den Systemtrenner bis ca. 1,5 bar – fällt er wieder, sucht der Fachbetrieb das Leck.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Manometer Heizung",
    "Kessel-Display"
   ]
  },
  {
   "id": "HK-02",
   "ort": "HK",
   "titel": "Störung und Pfütze – Kondensatsiphon",
   "erklaer": "Ein Brennwertkessel erzeugt Kondenswasser, das über einen Siphon abläuft. Ist der verschlammt, staut es sich, und der Kessel schaltet ab. Reinigen macht der Fachbetrieb.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Kessel-Display",
    "Kondensatsiphon",
    "Boden unter dem Kessel"
   ]
  },
  {
   "id": "HK-03",
   "ort": "HK",
   "titel": "Druck schwankt – Ausdehnungsgefäß ohne Vordruck",
   "erklaer": "Warmes Wasser dehnt sich aus, das Ausdehnungsgefäß fängt das mit einem Luftpolster ab. Fehlt der Vordruck, schwankt der Druck stark und das Sicherheitsventil tropft.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Manometer Heizung",
    "Sicherheitsventil",
    "Ausdehnungsgefäß"
   ]
  },
  {
   "id": "HK-04",
   "ort": "HK",
   "titel": "Brenner läuft, Heizkörper kalt – Pumpe sitzt fest",
   "erklaer": "Nach langer Pause kann sich die Welle der Heizungspumpe festsetzen. Sie brummt, dreht aber nicht, und das Wasser bleibt stehen. Lösen oder tauschen macht der Fachbetrieb.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "A"
   ],
   "befund": [
    "Heizungspumpe",
    "Thermometer Vor-/Rücklauf",
    "Kessel-Display"
   ],
   "m2erklaer": "Über den Sommer kann eine Anlage Druck verlieren. Liegt er unter dem Sollbereich, kann oben Luft in die Heizkörper kommen. Fällt er nach dem Nachfüllen wieder, sucht der Fachbetrieb das Leck."
  },
  {
   "id": "HK-05",
   "ort": "HK",
   "titel": "Warmwasser ja, Heizung nein – Sommerbetrieb",
   "erklaer": "Im Sommerbetrieb macht der Kessel nur Warmwasser, die Heizung bleibt aus. Im Herbst die Betriebsart umstellen – kein Defekt, nur ein Menüpunkt.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Regler-Bedienteil",
    "Kessel-Display",
    "Warmwasserspeicher"
   ]
  },
  {
   "id": "HK-06",
   "ort": "HK",
   "titel": "Dusche kalt – Speicherfühler",
   "erklaer": "Der Speicherfühler meldet dem Regler die Wassertemperatur. Meldet er zu viel, lädt der Kessel nicht nach, und das Wasser bleibt kalt. Den Tausch macht der Fachbetrieb.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Regler-Bedienteil",
    "Warmwasserspeicher",
    "Speicherfühler"
   ]
  },
  {
   "id": "HK-07",
   "ort": "HK",
   "titel": "Warmwasser kommt spät – Zeitschaltuhr Zirkulation",
   "erklaer": "Die Zirkulationspumpe hält warmes Wasser in der Leitung bereit, gesteuert von einer Zeitschaltuhr. Nach einem Stromausfall geht die Uhr oft falsch und muss neu gestellt werden.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A"
   ],
   "befund": [
    "Zeitschaltuhr Zirkulation",
    "Zirkulationspumpe",
    "Warmwasserspeicher"
   ]
  },
  {
   "id": "HK-08",
   "ort": "HK",
   "titel": "Kessel klickt und gibt auf – Zündelektrode",
   "erklaer": "Die Zündelektrode erzeugt den Funken, der das Gas entzündet. Ist sie abgebrannt, zündet der Kessel unsicher und geht auf Störung. Tauschen darf nur der Fachbetrieb.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Kessel-Display",
    "Regler-Bedienteil",
    "Zündelektrode"
   ]
  },
  {
   "id": "HK-09",
   "ort": "HK",
   "titel": "Bei Frost nur lauwarm – Außenfühler",
   "erklaer": "Der Außenfühler sagt dem Regler, wie kalt es ist; danach richtet sich die Vorlauftemperatur. Fällt er aus, heizt der Regler mit einem festen Ersatzwert – bei Frost zu wenig.",
   "stufen": [
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Kessel-Display",
    "Regler-Bedienteil",
    "Außenthermometer am Kellerfenster"
   ]
  },
  {
   "id": "HK-10",
   "ort": "HK",
   "titel": "Kessel taktet, oben kühl – Schmutzfänger",
   "erklaer": "In alten Anlagen löst sich Schlamm aus den Rohren und sammelt sich im Schmutzfänger. Ist das Sieb dicht, fließt zu wenig Wasser, und der Kessel taktet. Reinigen macht der Fachbetrieb.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "A"
   ],
   "befund": [
    "Schmutzfänger",
    "Thermometer Vor-/Rücklauf",
    "Kessel-Display"
   ],
   "m2erklaer": "Die Pumpenstufe bestimmt, wie viel Wasser umläuft. Auf der kleinsten Stufe reicht es für die oberen Zimmer nicht – die passende Stufe steht in den Anlagenunterlagen."
  },
  {
   "id": "BA-01",
   "ort": "BA",
   "titel": "Dusche spritzt kreuz und quer – Duschkopf verkalkt",
   "erklaer": "Hartes Wasser lagert Kalk in den Düsen des Duschkopfs ab. Werden sie eng, spritzt der Strahl in alle Richtungen. Entkalken hilft – das geht auch ohne Fachbetrieb.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Duschkopf",
    "Waschtischarmatur"
   ]
  },
  {
   "id": "BA-02",
   "ort": "BA",
   "titel": "Waschbecken läuft nicht ab – Verstopfung in der Wand",
   "erklaer": "Hinter dem Siphon setzen sich Seife, Haare und Zahnpasta im Rohr fest. Dann hilft kein Siphonputzen mehr, sondern nur die Spirale im Wandrohr.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Siphon Waschbecken",
    "Waschbecken",
    "Ablaufrohr Wand"
   ]
  },
  {
   "id": "BA-03",
   "ort": "BA",
   "titel": "WC läuft nach – Füllventil im Aufputz-Spülkasten",
   "erklaer": "Das Füllventil lässt Wasser in den Spülkasten, bis der Schwimmer es schließt. Klemmt er, steigt das Wasser über den Überlauf und rinnt ständig in die Schüssel.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "A"
   ],
   "befund": [
    "Spülkasten Aufputz (innen)",
    "Füllventil (Aufputz-Spülkasten)",
    "WC-Becken"
   ]
  },
  {
   "id": "BA-04",
   "ort": "BA",
   "titel": "Spülkasten füllt immer wieder nach – Ablaufventil",
   "erklaer": "Das Ablaufventil hält das Wasser im Spülkasten, bis gespült wird. Ist seine Dichtung hart, sickert ständig Wasser in die Schüssel, und der Kasten füllt immer wieder nach.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Unterputz-Spülkasten (Revisionsöffnung)",
    "Ablaufventil (Unterputz-Spülkasten)",
    "WC-Becken"
   ]
  },
  {
   "id": "BA-05",
   "ort": "BA",
   "titel": "Dusche nur lauwarm – Thermostatkartusche",
   "erklaer": "Die Thermostatkartusche mischt heißes und kaltes Wasser auf die gewählte Temperatur. Verkalkt sie, mischt sie zu viel Kaltes bei. Den Tausch macht der Fachbetrieb.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Thermostat-Brausebatterie",
    "Waschtischarmatur"
   ],
   "m2erklaer": "In den Anschlüssen der Brausebatterie sitzen Siebe gegen Schmutz. Ist das Sieb auf der Warmseite zugesetzt, kommt zu wenig heißes Wasser an, und die Dusche bleibt lauwarm."
  },
  {
   "id": "BA-06",
   "ort": "BA",
   "titel": "Handtuchheizkörper kalt – Rücklauf zu",
   "erklaer": "Für Arbeiten im Bad sperrt man den Heizkörper an der Rücklaufverschraubung ab. Wird sie danach nicht wieder geöffnet, fließt kein Heizungswasser hindurch.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Handtuchheizkörper",
    "Rücklaufverschraubung Handtuchheizkörper"
   ]
  },
  {
   "id": "BA-07",
   "ort": "BA",
   "titel": "Fleck an der Decke darunter – Silikonfuge",
   "erklaer": "Silikonfugen altern und reißen. Dann läuft beim Duschen Wasser hinter die Wanne und kommt erst unten an der Decke heraus. Ob die Decke durchfeuchtet ist, misst der Fachbetrieb.",
   "stufen": [
    "meister"
   ],
   "varianten": [
    "A"
   ],
   "befund": [
    "Silikonfuge Dusche",
    "Fliesen neben der Dusche"
   ]
  },
  {
   "id": "BA-08",
   "ort": "BA",
   "titel": "Badewanne läuft leer – Wannenventil verschmutzt",
   "erklaer": "Der Stöpsel der Wanne dichtet mit einem Ventilteller ab. Sammeln sich Haare und Kalk daran, schließt er nicht mehr, und das Badewasser sickert langsam in den Abfluss.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A"
   ],
   "befund": [
    "Badewannen-Ablauf",
    "Badewanne"
   ]
  },
  {
   "id": "BA-09",
   "ort": "BA",
   "titel": "Wasserhahn tropft – Kartusche",
   "erklaer": "In einer Einhebel-Armatur sperrt eine Kartusche mit Keramikscheiben das Wasser ab. Sind die Scheiben abgenutzt, tropft der Hahn auch bei geschlossenem Hebel.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Waschtischarmatur",
    "Waschbecken"
   ]
  },
  {
   "id": "BA-10",
   "ort": "BA",
   "titel": "Wasser steht in der Dusche – Duschrinne",
   "erklaer": "Unter der Abdeckung einer Duschrinne sitzt ein Geruchsverschluss. Haare und Seife setzen ihn mit der Zeit zu – regelmäßig reinigen, dann läuft das Wasser wieder ab.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Duschrinne",
    "Silikonfuge Dusche"
   ]
  },
  {
   "id": "KU-01",
   "ort": "KU",
   "titel": "Hahn spritzt – Strahlregler verkalkt",
   "erklaer": "Der Strahlregler am Auslauf mischt Luft ins Wasser und formt einen weichen Strahl. Setzt sich Kalk in sein Sieb, spritzt es, und es kommt weniger heraus.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Strahlregler",
    "Spültischarmatur"
   ]
  },
  {
   "id": "KU-02",
   "ort": "KU",
   "titel": "Spüle läuft kaum ab – Fett im Rohr",
   "erklaer": "Fett ist warm flüssig, im kalten Rohr wird es fest und lagert sich ab. Mit der Zeit wächst das Rohr zu. Bratfett deshalb in den Restmüll, nicht in die Spüle.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Ablaufrohr Wand",
    "Siphon Spüle"
   ]
  },
  {
   "id": "KU-03",
   "ort": "KU",
   "titel": "Spülmaschine pumpt nicht ab – Stopfen im neuen Siphon",
   "erklaer": "Neue Siphons haben am Geräteanschluss oft eine Verschlusskappe. Wird sie beim Anschließen nicht entfernt, kann die Maschine nicht abpumpen – ein Klassiker nach dem Küchentausch.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Geschirrspüler",
    "Siphon Spüle",
    "Geschirrspüler-Ablaufschlauch"
   ],
   "m2erklaer": "Das Sieb im Geschirrspüler fängt Essensreste ab, bevor sie zur Pumpe kommen. Ist es dicht, bleibt Wasser im Boden stehen – deshalb regelmäßig herausnehmen und ausspülen."
  },
  {
   "id": "KU-04",
   "ort": "KU",
   "titel": "Schrank immer nass – Kondenswasser",
   "erklaer": "Feuchte Küchenluft schlägt sich am kalten Wasserrohr nieder, wie an einer kalten Flasche. Eine dichte Dämmung hält die Rohroberfläche wärmer – der Schrank bleibt trocken.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Kaltwasserleitung unter Spüle",
    "Unterschrank-Boden"
   ]
  },
  {
   "id": "KU-05",
   "ort": "KU",
   "titel": "Tropft beim Auf- und Zudrehen – Spindel locker",
   "erklaer": "Die Spindel eines Eckventils ist mit einer kleinen Mutter abgedichtet. Lockert sie sich, drückt beim Drehen Wasser heraus. Tropft es nach dem Nachziehen weiter, wird das Ventil getauscht.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "A"
   ],
   "befund": [
    "Eckventil kalt",
    "Unterschrank-Boden"
   ]
  },
  {
   "id": "KU-06",
   "ort": "KU",
   "titel": "Nur kaltes Wasser – Kleinspeicher auf Frostschutz",
   "erklaer": "Auf Frostschutz hält der Kleinspeicher das Wasser nur wenige Grad über null. Beim Putzen ist der Regler schnell verdreht – laut Anleitung einstellen, meist reichen etwa 55 °C.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A"
   ],
   "befund": [
    "Kleinspeicher unter der Spüle",
    "Spültischarmatur"
   ]
  },
  {
   "id": "KU-07",
   "ort": "KU",
   "titel": "Schrank nass beim Ausziehen der Brause – Schlauchdichtung",
   "erklaer": "Beim Ausziehen der Brause bewegt sich der Schlauch unter der Spüle mit. Das walkt die Dichtung an seiner Verschraubung, bis sie nachgibt – dann wird sie getauscht.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Ausziehbrause-Schlauch",
    "Unterschrank-Boden"
   ]
  },
  {
   "id": "KU-08",
   "ort": "KU",
   "titel": "Warm nur ein dünner Strahl – Eckventil halb zu",
   "erklaer": "Eckventile sperren das Wasser unter der Spüle ab, etwa zum Anschließen von Geräten. Bleibt eins fast zu, kommt nur ein dünner Strahl – danach immer ganz öffnen.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Eckventil warm",
    "Spültischarmatur"
   ]
  },
  {
   "id": "KU-09",
   "ort": "KU",
   "titel": "Kanalgeruch aus der Spüle – Rohrbelüfter",
   "erklaer": "Läuft oben viel Wasser durchs Fallrohr, entsteht ein Sog. Der Rohrbelüfter lässt dann Luft nach. Klemmt er, wird der Siphon leergesaugt, und Kanalgeruch kommt durch.",
   "stufen": [
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Siphon Spüle",
    "Rohrbelüfter"
   ]
  },
  {
   "id": "KU-10",
   "ort": "KU",
   "titel": "Spülmaschine zieht kein Wasser – Zulaufschlauch",
   "erklaer": "Viele Zulaufschläuche haben einen eingebauten Wasserstopp. Wird der innere Schlauch undicht, sperrt er das Wasser und zeigt es im Sichtfenster – dann wird der ganze Schlauch getauscht.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Geschirrspüler-Zulaufschlauch",
    "Geschirrspüler"
   ]
  },
  {
   "id": "GW-01",
   "ort": "GW",
   "titel": "Toilette verstopft – zu viel Papier",
   "erklaer": "Feuchttücher zerfallen nicht wie Toilettenpapier und bilden mit viel Papier schnell einen Pfropfen. Die Saugglocke löst ihn – Feuchttücher gehören in den Müll.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "WC-Becken",
    "Handwaschbecken"
   ]
  },
  {
   "id": "GW-02",
   "ort": "GW",
   "titel": "Kanalgeruch – Siphon-Dichtung verrutscht",
   "erklaer": "Der Siphon sperrt Kanalgase mit Wasser ab. Sitzt die Dichtung am Wandrohr schief, ziehen die Gase einfach am Bogen vorbei – eine neue Dichtung schließt den Spalt.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Siphon Handwaschbecken",
    "Wandanschluss Siphon"
   ]
  },
  {
   "id": "GW-03",
   "ort": "GW",
   "titel": "Spülkasten füllt sich kaum – Sieb im Füllventil",
   "erklaer": "Nach Arbeiten an der Leitung lösen sich oft Sand und Rost. Das Sieb im Füllventil hält sie zurück, setzt sich dabei aber zu – dann füllt sich der Spülkasten nur noch tröpfchenweise.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Unterputz-Spülkasten (Revisionsöffnung)",
    "Füllventil-Sieb"
   ],
   "m2erklaer": "Das Eckventil vor dem Spülkasten steht im Normalbetrieb ganz offen. Ist es nur halb offen, füllt sich der Kasten auch mit sauberem Sieb zu langsam."
  },
  {
   "id": "GW-04",
   "ort": "GW",
   "titel": "Spülung zu schwach – Spülmenge",
   "erklaer": "Unterputz-Spülkästen lassen sich auf verschiedene Spülmengen einstellen, die große Taste meist auf etwa 6 Liter. Steht sie auf der kleinsten Menge, reicht die Spülung oft nicht.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Unterputz-Spülkasten (Revisionsöffnung)",
    "Ablaufventil (Unterputz-Spülkasten)"
   ]
  },
  {
   "id": "GW-05",
   "ort": "GW",
   "titel": "Drücken, und nichts passiert – Kette gerissen",
   "erklaer": "Im Aufputz-Spülkasten hebt eine Kette das Ablaufventil an, wenn man drückt. Reißt sie, bleibt das Ventil zu – das Wasser ist da, kommt aber nicht ins Becken.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A"
   ],
   "befund": [
    "Spülkasten Aufputz (innen)",
    "Spülkasten-Kette"
   ]
  },
  {
   "id": "GW-06",
   "ort": "GW",
   "titel": "Stöpsel geht nicht hoch – Zugstange ausgehängt",
   "erklaer": "Der Zugknopf bewegt den Stopfen über eine Stange unter dem Becken. Rutscht sie aus dem Gelenk, bleibt der Stopfen unten – einhängen und festschrauben reicht.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Ablaufstopfen",
    "Zugstange Ablaufgarnitur"
   ]
  },
  {
   "id": "GW-07",
   "ort": "GW",
   "titel": "Pfütze nach dem Spülen – WC-Anschluss",
   "erklaer": "Die Manschette verbindet das WC mit dem Abflussrohr. Ist das Gummi rissig, drückt jede Spülung etwas Abwasser heraus. Den Tausch macht der Fachbetrieb.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Fußboden hinter WC",
    "WC-Anschlussmanschette"
   ]
  },
  {
   "id": "GW-08",
   "ort": "GW",
   "titel": "Immer eiskalt – Bauschutzkappe statt Thermostat",
   "erklaer": "Auf neuen Heizkörpern sitzt bis zur Montage oft eine Bauschutzkappe. Zugedreht sperrt sie das Ventil ganz – erst der Thermostatkopf regelt den Raum wie gedacht.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Heizkörper Gäste-WC",
    "Heizkörperventil"
   ]
  },
  {
   "id": "GW-09",
   "ort": "GW",
   "titel": "Hahn tropft ständig – Dichtung, nicht Ausdehnung",
   "erklaer": "Bei Kleinspeichern ohne Druck tropft es beim Aufheizen, weil sich das Wasser ausdehnt – das ist normal. Tropft es auch kalt, ist die Dichtung in der Armatur hin.",
   "stufen": [
    "meister"
   ],
   "varianten": [
    "A"
   ],
   "befund": [
    "Armatur Handwaschbecken",
    "Kleinspeicher Gäste-WC"
   ]
  },
  {
   "id": "GW-10",
   "ort": "GW",
   "titel": "WC rinnt seit dem Fliesenlegen – Stößel zu lang",
   "erklaer": "Zwischen Drückerplatte und Ablaufventil sitzt ein Stößel, der zur Wandstärke passen muss. Ist er zu lang, hält er das Ventil einen Spalt offen, und das WC rinnt.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Drückerplatte",
    "Ablaufventil (Unterputz-Spülkasten)"
   ]
  },
  {
   "id": "WP-01",
   "ort": "WP",
   "titel": "Läuft pausenlos – Lamellen zugesetzt",
   "erklaer": "Eine Luft-Wärmepumpe holt die Wärme aus der Außenluft. Sind die Lamellen zugesetzt, strömt zu wenig Luft hindurch, und sie läuft lange ohne genug Wärme. Reinigen macht der Fachbetrieb.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Lamellen Außengerät",
    "Umgebung Außengerät"
   ]
  },
  {
   "id": "WP-02",
   "ort": "WP",
   "titel": "Eisberg unter dem Gerät – Kondensatablauf",
   "erklaer": "Beim Abtauen läuft Wasser von den Lamellen in eine Wanne und von dort ins Freie. Ist der Ablauf verstopft, gefriert es in der Wanne, und das Gerät meldet eine Störung.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Kondensatwanne",
    "Kondensatablauf",
    "Bedienteil Wärmepumpe"
   ]
  },
  {
   "id": "WP-03",
   "ort": "WP",
   "titel": "Störung seit der Wartung – Kugelhahn halb zu",
   "erklaer": "Zur Wartung sperrt man den Heizkreis an Kugelhähnen ab. Bleibt einer halb zu, fließt zu wenig Wasser durch die Wärmepumpe, und sie schaltet mit einem Durchfluss-Fehler ab.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Bedienteil Wärmepumpe",
    "Kugelhahn Rücklauf"
   ],
   "m2erklaer": "Der Schmutzfänger im Rücklauf hält Schlamm von der Wärmepumpe fern und gehört bei jeder Wartung ausgespült. Ist sein Sieb voll, bleibt der Durchfluss zu gering."
  },
  {
   "id": "WP-04",
   "ort": "WP",
   "titel": "Brummen im Schlafzimmer – Schwingungsdämpfer",
   "erklaer": "Schwingungsdämpfer entkoppeln das Außengerät von der Wand. Sind sie verschlissen, leitet die Konsole jede Vibration ins Mauerwerk, und drinnen brummt es. Den Tausch macht der Fachbetrieb.",
   "stufen": [
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Schwingungsdämpfer",
    "Hauswand"
   ]
  },
  {
   "id": "WP-05",
   "ort": "WP",
   "titel": "Stromrechnung verdoppelt – Heizstab zu früh frei",
   "erklaer": "Der Heizstab hilft nur bei strengem Frost aus und braucht viel Strom. Ist er schon bei mildem Wetter frei, heizt er fast den ganzen Winter mit. Einstellen macht der Fachbetrieb.",
   "stufen": [
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Bedienteil Wärmepumpe",
    "Heizstab (Inneneinheit)"
   ]
  },
  {
   "id": "WP-06",
   "ort": "WP",
   "titel": "Spritzt aus dem Gartenhahn – Frostschaden",
   "erklaer": "Bleibt eine Außenleitung im Winter offen und voll, friert das Wasser und sprengt den Hahn. Ein frostsicherer Hahn entleert sich selbst – den Schlauch im Herbst trotzdem abnehmen.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Außenwasserhahn",
    "Absperrventil Außenwasserhahn"
   ]
  },
  {
   "id": "WP-07",
   "ort": "WP",
   "titel": "Oben vereist, Ventilator schleift – Fallrohr undicht",
   "erklaer": "Tropft Regenwasser auf das Außengerät, gefriert es auf Gehäuse und Lamellen, und der Ventilator schleift am Eis. Erst die Muffe abdichten, dann das Eis von selbst abtauen lassen.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Fallrohr",
    "Ventilator Außengerät",
    "Lamellen Außengerät"
   ]
  },
  {
   "id": "WP-08",
   "ort": "WP",
   "titel": "Heizung warm, Dusche kalt – Umschaltventil",
   "erklaer": "Ein Umschaltventil schickt die Wärme entweder in die Heizung oder in den Speicher. Klemmt sein Stellmotor auf Heizung, bleibt das Duschwasser kalt. Den Tausch macht der Fachbetrieb.",
   "stufen": [
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Umschaltventil",
    "Bedienteil Wärmepumpe"
   ]
  },
  {
   "id": "WP-09",
   "ort": "WP",
   "titel": "Schaltet ständig ab – alle Heizkreise zu",
   "erklaer": "Schließen alle Raumthermostate zugleich, fließt kein Wasser mehr. Ohne Durchfluss staut sich die Wärme, und die Wärmepumpe schaltet auf Hochdruck ab. Ein Überströmventil hält einen Weg offen.",
   "stufen": [
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Bedienteil Wärmepumpe",
    "Heizkreisverteiler"
   ]
  },
  {
   "id": "WP-10",
   "ort": "WP",
   "titel": "Gluckern nach dem Befüllen – Schnellentlüfter zu",
   "erklaer": "Beim Befüllen gelangt Luft in den Heizkreis. Der Schnellentlüfter lässt sie selbst hinaus – aber nur, wenn seine Kappe 1–2 Umdrehungen offen ist. Danach den Druck prüfen.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "A"
   ],
   "befund": [
    "Schnellentlüfter Inneneinheit",
    "Bedienteil Wärmepumpe"
   ]
  },
  {
   "id": "DB-01",
   "ort": "DB",
   "titel": "Sonne scheint, Speicher kalt – Luft im Solarkreis",
   "erklaer": "Luft im Solarkreis bremst den Umlauf: Die Pumpe läuft, aber die Flüssigkeit steht, und die Wärme bleibt auf dem Dach. Entlüften bei abgedecktem Kollektor macht der Fachbetrieb.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Durchflussmesser Solar",
    "Solarpumpe",
    "Solarregler"
   ],
   "m2erklaer": "Bei zu wenig Druck zieht der Solarkreis leichter Luft, und bei Hitze verdampft die Flüssigkeit früher. Nachgefüllt wird mit Solarflüssigkeit bis zum Wert auf dem Typenschild."
  },
  {
   "id": "DB-02",
   "ort": "DB",
   "titel": "Fehler und Pumpe steht – Kollektorfühler",
   "erklaer": "Der Kollektorfühler meldet dem Regler die Temperatur auf dem Dach. Fehlt der Wert, lässt der Regler die Pumpe zur Sicherheit aus. Den Tausch am Dach macht der Fachbetrieb.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Solarregler",
    "Fühlerleitung am Kollektor (Dachfenster)"
   ]
  },
  {
   "id": "DB-03",
   "ort": "DB",
   "titel": "Krümel auf dem Boden – Marder in der Dämmung",
   "erklaer": "Marder zerbeißen gern die weiche Dämmung von Solarleitungen, dann geht viel Wärme verloren. Neu gedämmt wird mit hitzefester Dämmung; ein fester Schutzmantel schützt die Dämmung vor Bissen.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A"
   ],
   "befund": [
    "Solarleitungen mit Dämmung",
    "Dielenboden"
   ]
  },
  {
   "id": "DB-04",
   "ort": "DB",
   "titel": "Warmwasser im Sommer nie richtig heiß – Speichermaximum",
   "erklaer": "Der Solarregler lädt den Speicher nur bis zum eingestellten Maximum. Steht das zu niedrig, bleibt die Sonnenwärme auf dem Dach. Höhere Werte gibt es nur mit Verbrühschutz.",
   "stufen": [
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Solarregler",
    "Kollektorfeld (Dachfenster)"
   ]
  },
  {
   "id": "DB-05",
   "ort": "DB",
   "titel": "Braune Brühe – Solarflüssigkeit überaltert",
   "erklaer": "Viele Überhitzungen lassen Solarflüssigkeit altern: Sie wird braun und sauer, der Frostschutz lässt nach. Dann wird gespült und neu befüllt, die alte Flüssigkeit fachgerecht entsorgt.",
   "stufen": [
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Auffangbehälter",
    "Probeglas Solarflüssigkeit",
    "Durchflussmesser Solar"
   ]
  },
  {
   "id": "DB-06",
   "ort": "DB",
   "titel": "Nach dem Urlaub kaum Druck – Sicherheitsventil hat abgeblasen",
   "erklaer": "Braucht im Urlaub niemand Warmwasser, wird die Anlage sehr heiß, und das Sicherheitsventil kann Flüssigkeit abblasen. Warum es öffnen musste, prüft der Fachbetrieb.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Solarstation-Manometer",
    "Auffangbehälter",
    "Sicherheitsventil Solar"
   ]
  },
  {
   "id": "DB-07",
   "ort": "DB",
   "titel": "Druck springt, Ventil tropft – Membran gerissen",
   "erklaer": "Im Ausdehnungsgefäß trennt eine Membran das Wasser vom Luftpolster. Reißt sie, läuft das Gefäß voll, der Druck springt beim Heizen, und das Sicherheitsventil tropft.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Manometer Heizung",
    "Ausdehnungsgefäß Heizung"
   ]
  },
  {
   "id": "DB-08",
   "ort": "DB",
   "titel": "Nasser Fleck auf den Dielen – Schnellentlüfter",
   "erklaer": "Der Schnellentlüfter lässt Luft aus der Heizung, aber kein Wasser. Setzen sich Schmutz oder Kalk in sein Ventil, tropft er. Dann wird er getauscht und der Druck geprüft.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Schnellentlüfter",
    "Dielenboden"
   ]
  },
  {
   "id": "DB-09",
   "ort": "DB",
   "titel": "Solarpumpe läuft nachts – Fühler vertauscht",
   "erklaer": "Der Solarregler vergleicht Kollektor und Speicher. Sind die Fühler vertauscht, hält er den kalten Kollektor für warm und pumpt nachts die Wärme aus dem Speicher aufs Dach.",
   "stufen": [
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Solarregler",
    "Kollektorfeld (Dachfenster)"
   ],
   "m2erklaer": "Die Schwerkraftbremse verhindert, dass warme Flüssigkeit nachts von selbst zum Dach steigt. Zum Befüllen wird sie geöffnet und muss danach zurück in Betriebsstellung."
  },
  {
   "id": "DB-10",
   "ort": "DB",
   "titel": "Seit der Wartung tot – Regler auf Handbetrieb",
   "erklaer": "Bei der Wartung wird der Regler oft auf Handbetrieb gestellt, um die Pumpe zu testen. Bleibt er auf „Aus“, steht die Anlage. In Automatik schaltet er wieder nach Temperatur.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Solarregler",
    "Solarpumpe"
   ]
  },
  {
   "id": "AT-01",
   "ort": "AT",
   "titel": "Zeiger klettert – Füllhahn tropft durch",
   "erklaer": "Über den Füllhahn kommt Leitungswasser in die Heizung. Schließt er nicht mehr dicht, drückt Wasser nach, und der Druck steigt Tag für Tag. Den Tausch macht der Fachbetrieb.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Manometer Therme",
    "Füllhahn"
   ],
   "m2erklaer": "Steigt der Druck bis 3 bar, öffnet das Sicherheitsventil und tropft in den Trichter. Ablassen bis ca. 1,5 bar – tropft es danach weiter, prüft der Fachbetrieb das Ventil."
  },
  {
   "id": "AT-02",
   "ort": "AT",
   "titel": "Warm nur bei voll aufgedrehtem Hahn – Eingangssieb",
   "erklaer": "Die Therme zündet erst, wenn genug Wasser durchfließt. Ist das Sieb am Eingang zugesetzt, reicht ein halb offener Hahn dafür nicht. Reinigen macht der Fachbetrieb.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Spülenarmatur Warmwasser",
    "Therme-Display",
    "Kaltwasser-Eingangssieb"
   ]
  },
  {
   "id": "AT-03",
   "ort": "AT",
   "titel": "Dusche nur lauwarm, Heizung mollig – Plattenwärmetauscher",
   "erklaer": "Ein kleiner Plattenwärmetauscher gibt die Wärme der Therme ans Duschwasser ab. Setzt sich Kalk darin fest, kommt nur noch lauwarmes Wasser an. Tauschen macht der Fachbetrieb.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Bedienknöpfe Therme",
    "Spülenarmatur Warmwasser",
    "Therme-Display"
   ]
  },
  {
   "id": "AT-04",
   "ort": "AT",
   "titel": "Therme geht beim Kochen aus – Abluft-Dunstabzug",
   "erklaer": "Diese Therme holt ihre Luft aus der Küche. Saugt eine Abluft-Haube sie weg, kann Abgas zurückströmen – lebensgefährlich. Der Kontaktschalter lässt die Haube nur bei offenem Fenster laufen.",
   "stufen": [
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Therme-Display",
    "Dunstabzugshaube",
    "Fenster"
   ]
  },
  {
   "id": "AT-05",
   "ort": "AT",
   "titel": "Störung seit den neuen Schränken – Kondensatschlauch geknickt",
   "erklaer": "Eine Brennwerttherme bildet Kondenswasser, das über einen Schlauch abläuft. Ist er abgeknickt, staut es sich zurück, und die Therme schaltet ab. Neu verlegen macht der Fachbetrieb.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A"
   ],
   "befund": [
    "Therme-Display",
    "Kondensatschlauch"
   ]
  },
  {
   "id": "AT-06",
   "ort": "AT",
   "titel": "Wohnung kalt, kein Fehler – Batterien im Raumthermostat",
   "erklaer": "Das Raumthermostat meldet der Therme, wann die Wohnung Wärme braucht. Sind die Batterien leer, schweigt es, und die Heizung bleibt aus – ein Fall ganz ohne Schraubenschlüssel.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Raumthermostat",
    "Spülenarmatur Warmwasser"
   ]
  },
  {
   "id": "AT-07",
   "ort": "AT",
   "titel": "Fast verbrüht – Warmwasser auf Maximum",
   "erklaer": "Die Kombitherme heizt das Wasser so stark auf, wie der Knopf es vorgibt. Am Anschlag sind das über 60 °C – zu heiß für die Hände, und es bildet sich mehr Kalk.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Bedienknöpfe Therme",
    "Spülenarmatur Warmwasser"
   ]
  },
  {
   "id": "AT-08",
   "ort": "AT",
   "titel": "Kochen macht das Wohnzimmer kalt – Raumthermostat am Herd",
   "erklaer": "Das Raumthermostat schaltet die Therme für die ganze Wohnung. Neben dem Herd meldet es beim Kochen „warm genug“. Ein Funk-Thermostat im Wohnzimmer misst dort, wo es zählt.",
   "stufen": [
    "meister"
   ],
   "varianten": [
    "A"
   ],
   "befund": [
    "Raumthermostat",
    "Therme-Display"
   ]
  },
  {
   "id": "AT-09",
   "ort": "AT",
   "titel": "Warmwasser kommt spät – Komfortfunktion aus",
   "erklaer": "Mit der Komfortfunktion hält die Therme ihren Wärmetauscher warm, damit das Wasser schnell warm kommt. Ausgeschaltet spart sie etwas Gas, aber man wartet länger.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Therme-Display",
    "Bedienknöpfe Therme",
    "Spülenarmatur Warmwasser"
   ]
  },
  {
   "id": "AT-10",
   "ort": "AT",
   "titel": "Wasserfleck unter dem Heizkörper – Ventilstift undicht",
   "erklaer": "Unter dem Thermostatkopf sitzt ein kleiner Ventilstift mit Dichtung. Wird sie alt, sickert Heizungswasser heraus und hinterlässt Kalkspuren. Den Tausch macht der Fachbetrieb.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Heizkörperventil Küche",
    "Heizkörper Küche"
   ],
   "m2erklaer": "Wochenlanges Tropfen kostet Heizungswasser, bis der Druck zu weit fällt und die Therme sperrt. Nach dem Abdichten auf ca. 1,5 bar nachfüllen."
  },
  {
   "id": "HA-01",
   "ort": "HA",
   "titel": "Überall wenig Wasser – Rückspülfilter zu",
   "erklaer": "Der Rückspülfilter hält Sand und Rost aus der Leitung zurück. Wird er nicht mindestens halbjährlich gespült, setzt er sich zu, und im ganzen Haus kommt wenig Wasser an.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Rückspülfilter",
    "Druckminderer-Manometer"
   ],
   "m2erklaer": "Der Druckminderer senkt den Leitungsdruck auf einen festen Wert, meist etwa 4 bar. Steht er viel zu niedrig, kommt auch mit sauberem Filter oben kaum Wasser an."
  },
  {
   "id": "HA-02",
   "ort": "HA",
   "titel": "Hähne schlagen – Druck zu hoch",
   "erklaer": "Ein neuer Druckminderer muss auf den Hausdruck eingestellt werden, meist etwa 4 bar. Bleibt er zu hoch, schlagen die Leitungen, und Armaturen und Schläuche leiden.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Druckminderer-Manometer",
    "Druckminderer"
   ]
  },
  {
   "id": "HA-03",
   "ort": "HA",
   "titel": "Nach dem Urlaub nur ein Plätschern – Hauptabsperrventil",
   "erklaer": "Das Hauptabsperrventil lässt das Wasser ins Haus. Ist es nur einen Spalt offen, steht in Ruhe voller Druck an, beim Zapfen bricht er aber ein. Ganz aufdrehen, dann meist eine Vierteldrehung zurück.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Hauptabsperrventil",
    "Druckminderer-Manometer"
   ]
  },
  {
   "id": "HA-04",
   "ort": "HA",
   "titel": "Kalkflecken trotz Enthärtung – Salzbrücke",
   "erklaer": "Die Enthärtung regeneriert ihr Harz mit Salzlösung (Sole) aus Salz und Wasser. Verbackt das Salz oben zu einer Brücke, entsteht darunter keine Salzlösung (Sole), und das Wasser bleibt hart.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Salzbehälter",
    "Enthärtungsanlage (Display)",
    "Probierhahn nach Enthärtung"
   ]
  },
  {
   "id": "HA-05",
   "ort": "HA",
   "titel": "Kalkränder zurück – Verschneideventil verdreht",
   "erklaer": "Das Verschneideventil mischt dem enthärteten Wasser etwas hartes bei, damit eine kleine Resthärte bleibt. Steht es auf „hart“, fließt fast alles am Harz vorbei.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Verschneideventil",
    "Probierhahn nach Enthärtung"
   ]
  },
  {
   "id": "HA-06",
   "ort": "HA",
   "titel": "Wasser drückt aus dem Bodenablauf – Rückstauverschluss",
   "erklaer": "Bei Starkregen kann der Kanal ins Haus zurückdrücken. Der Rückstauverschluss schließt dann mit einer Klappe – aber nur, wenn sie sauber ist. Regelmäßig warten lassen.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "A"
   ],
   "befund": [
    "Rückstauverschluss",
    "Bodenablauf"
   ]
  },
  {
   "id": "HA-07",
   "ort": "HA",
   "titel": "Pumpe piept, Waschwasser steht – Schwimmer verklemmt",
   "erklaer": "Eine Hebeanlage pumpt Abwasser aus dem Keller hoch zum Kanal. Ein Schwimmer schaltet die Pumpe ein – klemmt er, bleibt sie aus, und es gibt Alarm. Wartung macht der Fachbetrieb.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A"
   ],
   "befund": [
    "Hebeanlage",
    "Schwimmer Hebeanlage"
   ]
  },
  {
   "id": "HA-08",
   "ort": "HA",
   "titel": "Zähler dreht, es rauscht – Enthärtung hängt",
   "erklaer": "Eine Enthärtung spült sich regelmäßig mit Wasser frei. Nach einem Stromausfall kann die Steuerung dabei hängen bleiben, dann läuft ständig Wasser in den Abfluss.",
   "stufen": [
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Wasserzähler",
    "Enthärtungsanlage (Display)",
    "Spülwasserschlauch Enthärtung"
   ]
  },
  {
   "id": "HA-09",
   "ort": "HA",
   "titel": "Pfütze und Zähler steht nie – Dichtung nach dem Druckminderer",
   "erklaer": "Flachdichtungen in Verschraubungen werden mit den Jahren hart. Dann tropft es leise, der Zähler läuft mit, und übers Jahr geht so viel Wasser verloren.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Verschraubung nach Druckminderer",
    "Wasserzähler",
    "Boden unter den Rohren"
   ]
  },
  {
   "id": "HA-10",
   "ort": "HA",
   "titel": "Brunnenpumpe taktet – Druckkessel ohne Vordruck",
   "erklaer": "Der Druckkessel hält Wasser unter einem Luftpolster bereit, damit die Pumpe nicht bei jedem Schluck anspringt. Fehlt der Vordruck, taktet sie – das verschleißt Pumpe und Schalter.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "A"
   ],
   "befund": [
    "Hauswasserwerk",
    "Druckkessel"
   ]
  },
  {
   "id": "WZ-01",
   "ort": "WZ",
   "titel": "Ein Heizkörper eiskalt nach dem Sommer – Ventilstift",
   "erklaer": "Unter dem Thermostatkopf sitzt ein kleiner Ventilstift. Bleibt das Ventil den Sommer über zu, sitzt er oft fest, der Heizkörper bleibt kalt. Hilft Lösen nicht, tauscht der Fachbetrieb das Oberteil.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A"
   ],
   "befund": [
    "Heizkörper",
    "Ventilstift"
   ],
   "m2erklaer": "Der Thermostatkopf schiebt mit seinem Stößel den Ventilstift auf und zu. Klemmt der Fühler im Kopf, bleibt der Stift gedrückt, und das Ventil öffnet nie – dann hilft nur ein neuer Kopf."
  },
  {
   "id": "WZ-02",
   "ort": "WZ",
   "titel": "Gluckert und oben kalt – Luft",
   "erklaer": "Luft sammelt sich oben im Heizkörper, dort kommt kein heißes Wasser hin, und es gluckert. Entlüften, bis Wasser kommt – danach am Kessel den Druck prüfen und bei Bedarf nachfüllen.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A"
   ],
   "befund": [
    "Heizkörper",
    "Entlüftungsventil Heizkörper"
   ]
  },
  {
   "id": "WZ-03",
   "ort": "WZ",
   "titel": "Nie richtig warm – Vorhang über dem Thermostat",
   "erklaer": "Der Thermostatkopf misst die Luft an seinem Platz. Hinter einem langen Vorhang staut sich Wärme, und er drosselt zu früh. Ein Fernfühler misst dort, wo man sitzt – oder der Vorhang wird kürzer.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "A"
   ],
   "befund": [
    "Vorhang",
    "Raumthermometer"
   ]
  },
  {
   "id": "WZ-04",
   "ort": "WZ",
   "titel": "Heizkörper pfeift – Voreinstellung zu klein",
   "erklaer": "Die Voreinstellung legt fest, wie viel Wasser ein Heizkörper höchstens bekommt. Sie wird je Heizkörper berechnet. Steht sie zu klein, zischt das Wasser durch den engen Spalt.",
   "stufen": [
    "meister"
   ],
   "varianten": [
    "A"
   ],
   "befund": [
    "Voreinstellring Ventil",
    "Heizkörper"
   ]
  },
  {
   "id": "WZ-05",
   "ort": "WZ",
   "titel": "Dunkler Fleck im Parkett – Verschraubung locker",
   "erklaer": "Durch das ständige Warm- und Kaltwerden kann sich eine Verschraubung lockern, dann sickert Heizungswasser heraus. Nachziehen, danach den Druck prüfen. Der Fleck im Holz kann zurückbleiben.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A"
   ],
   "befund": [
    "Rücklaufverschraubung",
    "Fußboden"
   ]
  },
  {
   "id": "WZ-06",
   "ort": "WZ",
   "titel": "Nur das Wohnzimmer kalt – Stellantrieb",
   "erklaer": "Der Stellantrieb öffnet am Verteiler das Ventil eines Heizkreises, wenn das Raumthermostat Wärme anfordert. Ist er defekt, bleibt der Kreis zu. Den Tausch macht der Fachbetrieb.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Stellantriebe",
    "Durchflussmesser FBH",
    "Raumthermostat"
   ]
  },
  {
   "id": "WZ-07",
   "ort": "WZ",
   "titel": "Nach dem Urlaub nicht warm – Urlaubsmodus",
   "erklaer": "Im Urlaubsmodus hält das Raumthermostat nur eine niedrige Temperatur, damit Energie gespart wird. Endet er nicht von selbst, bleibt es kühl – ein Menüpunkt, kein Defekt.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Raumthermostat",
    "Stellantriebe"
   ]
  },
  {
   "id": "WZ-08",
   "ort": "WZ",
   "titel": "Kaum lauwarm seit dem Herumdrehen – Durchflussmesser zu",
   "erklaer": "Am Verteiler ist jeder Heizkreis auf eine bestimmte Wassermenge eingestellt (hydraulischer Abgleich). Wird ein Ring zugedreht, kommt kaum Wärme an. Die Werte stehen im Abgleichprotokoll.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Durchflussmesser FBH",
    "Stellantriebe"
   ]
  },
  {
   "id": "WZ-09",
   "ort": "WZ",
   "titel": "Gluckern im Verteilerschrank – Luft im Verteiler",
   "erklaer": "Luft im Verteiler bremst den Durchfluss einzelner Heizkreise, die Räume bleiben lau. Oben am Verteiler wird entlüftet, danach der Anlagendruck geprüft.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Entlüfter FBH-Verteiler",
    "Durchflussmesser FBH"
   ]
  },
  {
   "id": "WZ-10",
   "ort": "WZ",
   "titel": "Bei Frost nicht über 18 Grad – Heizkurve zu flach",
   "erklaer": "Die Heizkurve legt fest, wie heiß das Heizwasser bei welcher Außentemperatur wird. Ist sie zu flach, reicht es bei mildem Wetter, bei Frost aber nicht. Den Wert stellt der Fachbetrieb ein.",
   "stufen": [
    "meister"
   ],
   "varianten": [
    "A"
   ],
   "befund": [
    "Raumbedienteil Heizung",
    "Raumthermometer"
   ],
   "m2erklaer": "Seit einem Stromausfall geht die Uhr am Bedienteil zwölf Stunden falsch: Tagsüber senkt es ab, nachts heizt es. Uhrzeit stellen, dann stimmt das Zeitprogramm wieder."
  },
  {
   "id": "BU-01",
   "ort": "BU",
   "titel": "Nur ein laues Lüftchen – Filter verstaubt",
   "erklaer": "Im Innengerät strömt die Luft zuerst durch feine Filter. Sind sie voller Staub, kommt kaum noch Luft hindurch, und der Raum kühlt nicht ab. Filter alle paar Wochen reinigen.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Luftfilter Innengerät",
    "Luftleitlamelle"
   ]
  },
  {
   "id": "BU-02",
   "ort": "BU",
   "titel": "Tropft auf den Schreibtisch – Kondensatablauf verschleimt",
   "erklaer": "Beim Kühlen entsteht Kondenswasser, das aus einer Wanne über einen Schlauch abläuft. Setzt Schleim den Ablauf zu, läuft die Wanne über und tropft aus dem Gerät.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Kondensatwanne Innengerät",
    "Kondensatschlauch"
   ],
   "m2erklaer": "Bis zur Pumpe läuft Kondenswasser nur mit stetigem Gefälle. In einem Durchhänger bleibt es stehen, Schleim setzt sich ab, und bald staut es sich wieder bis in die Wanne zurück."
  },
  {
   "id": "BU-03",
   "ort": "BU",
   "titel": "Riecht wie im feuchten Keller – Innengerät verkeimt",
   "erklaer": "Am kalten Wärmetauscher ist es feucht und dunkel – ideal für Keime. Mit der Zeit wächst ein muffiger Belag. Gründliche Reinigung samt Desinfektion macht der Fachbetrieb.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Wärmetauscher Innengerät",
    "Lüfterwalze Innengerät"
   ]
  },
  {
   "id": "BU-04",
   "ort": "BU",
   "titel": "Warme Luft bei 30 Grad – Modus Heizen",
   "erklaer": "Viele Split-Geräte können kühlen und heizen. Steht die Fernbedienung noch vom Winter auf Heizen, bläst das Gerät auch im Sommer warme Luft – ganz ohne Defekt.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Fernbedienung",
    "Innengerät-Anzeige",
    "Luftleitlamelle"
   ]
  },
  {
   "id": "BU-05",
   "ort": "BU",
   "titel": "Schaltet nach zehn Minuten ab – Kondensatpumpe",
   "erklaer": "Wo kein Gefälle möglich ist, pumpt eine kleine Kondensatpumpe das Wasser weg. Steht sie still, steigt der Schwimmer, und das Gerät schaltet ab, bevor es überläuft. Tausch: Fachbetrieb.",
   "stufen": [
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Innengerät-Anzeige",
    "Kondensatpumpe",
    "Kondensatschlauch"
   ]
  },
  {
   "id": "BU-06",
   "ort": "BU",
   "titel": "Am ersten heißen Tag nach Minuten Schluss – Winterabdeckung",
   "erklaer": "Beim Kühlen gibt das Außengerät die Wärme aus dem Raum an die Luft ab. Ist es abgedeckt, staut sich die Hitze, der Druck steigt, und das Gerät schaltet zum Schutz ab.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "A"
   ],
   "befund": [
    "Außengerät",
    "Innengerät-Anzeige"
   ]
  },
  {
   "id": "BU-07",
   "ort": "BU",
   "titel": "Eis am Innengerät – Einstellung zu kalt",
   "erklaer": "Bei 16 °C und kleinster Lüfterstufe streicht zu wenig warme Luft über den eiskalten Wärmetauscher – er vereist. Mit mehr Luft und vernünftiger Temperatur bleibt er frei.",
   "stufen": [
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Fernbedienung",
    "Wärmetauscher Innengerät",
    "Innengerät-Anzeige"
   ],
   "m2erklaer": "Verstaubte Filter bremsen die Luft zusätzlich. Je weniger Luft über den Wärmetauscher streicht, desto leichter vereist er. Deshalb Filter regelmäßig reinigen."
  },
  {
   "id": "BU-08",
   "ort": "BU",
   "titel": "Kalt in den Nacken – Lamelle falsch",
   "erklaer": "Die Luftleitlamelle lenkt den kalten Strahl. Zeigt sie fest nach unten, trifft er immer dieselbe Stelle. Besser schwenken lassen oder waagrecht stellen – kalte Luft sinkt von selbst.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "befund": [
    "Luftleitlamelle",
    "Innengerät-Anzeige"
   ]
  },
  {
   "id": "BU-09",
   "ort": "BU",
   "titel": "Sensorhahn tröpfelt – Sieb verstopft",
   "erklaer": "Vor dem Magnetventil eines Sensorhahns sitzt ein feines Sieb. Es fängt Kalk und Sand aus der Leitung ab und setzt sich mit der Zeit zu. Dann kommt nur noch ein Tröpfeln.",
   "stufen": [
    "geselle",
    "meister"
   ],
   "varianten": [
    "B"
   ],
   "befund": [
    "Sensorarmatur",
    "Sieb Sensorarmatur"
   ]
  },
  {
   "id": "BU-10",
   "ort": "BU",
   "titel": "Klima läuft, Büro bleibt warm – Heizkörper heizt mit",
   "erklaer": "Büro-Thermostatköpfe lassen sich nur mit einem Schlüssel verstellen. Steht einer auf 5, heizt der Heizkörper bis etwa 28 °C – und die Klima kämpft dagegen an.",
   "stufen": [
    "azubi",
    "geselle",
    "meister"
   ],
   "varianten": [
    "A"
   ],
   "befund": [
    "Heizkörper Büro",
    "Thermostatkopf Büro"
   ]
  }
 ],
 "stoerungen": [],
 "figuren": {
  "huber": {
   "name": "Frau Huber",
   "orte": {
    "HK": [
     "A",
     "B"
    ],
    "BA": [
     "A",
     "B"
    ],
    "GW": [
     "A",
     "B"
    ],
    "HA": [
     "A",
     "B"
    ],
    "WZ": [
     "A",
     "B"
    ]
   },
   "begruessung": [
    "Guten Tag, schön, dass Sie da sind. Ich hab mir alles aufgeschrieben, mit Uhrzeit.",
    "Schönen guten Tag. Kommen Sie nur rein, der Kaffee ist gleich fertig.",
    "Ah, von {firma}. Mein Mann hat das früher alles selber gemacht.",
    "Guten Tag. Ich zeig Ihnen gleich, wo es ist – die Treppe ist ein bisschen steil."
   ],
   "dank": [
    "Vielen Dank. Jetzt trinken Sie aber noch einen Kaffee mit mir.",
    "Wunderbar. Das schreib ich mir gleich ins Buch, mit Datum.",
    "So ordentlich, wie Sie das machen – da schau ich gern zu. Danke schön.",
    "Ich danke Ihnen. Und nehmen Sie ein Stück Kuchen mit, ja?"
   ],
   "fehlgriff": [
    "Hm, ich glaub, das war's noch nicht ganz. Schauen Sie ruhig noch mal.",
    "Lassen Sie sich Zeit. Aber der Kaffee wird langsam ein bisschen kalt."
   ]
  },
  "brandl": {
   "name": "Herr Brandl",
   "orte": {
    "BA": [
     "A",
     "B"
    ],
    "KU": [
     "A",
     "B"
    ],
    "WP": [
     "A",
     "B"
    ],
    "WZ": [
     "B"
    ]
   },
   "begruessung": [
    "Hallo, kommen Sie rein – Vorsicht, Bauklötze. Ich weiß leider nur die Hälfte.",
    "Hi, gut, dass Sie da sind. Moment – nein, nicht das Kabel. So, wo waren wir?",
    "Hallo. Ich hab's ehrlich gesagt erst heute früh bemerkt. Oder gestern?",
    "Kommen Sie rein. Das Baby schläft gerade, also bitte leise – danke."
   ],
   "dank": [
    "Wahnsinn, danke. Meine Frau wird denken, ich hätte das selbst hingekriegt.",
    "Super, vielen Dank. Ein Problem weniger auf meiner Liste.",
    "Danke. Jetzt muss ich nur noch die Wäsche aufhängen. Und kochen. Und…",
    "Top, danke. Ich schreib Ihnen eine gute Bewertung, sobald ich ans Handy komme."
   ],
   "fehlgriff": [
    "Äh, war's das jetzt? Sorry, ich frag nur, weil gleich das Baby aufwacht.",
    "Hm, sieht noch nicht so aus. Aber ich versteh davon ja sowieso nur die Hälfte."
   ]
  },
  "kaya": {
   "name": "Frau Kaya",
   "orte": {
    "HK": [
     "A",
     "B"
    ],
    "GW": [
     "A",
     "B"
    ],
    "HA": [
     "A",
     "B"
    ],
    "BU": [
     "B"
    ]
   },
   "begruessung": [
    "Guten Tag. Ich habe zehn Minuten bis zum nächsten Termin – was brauchen Sie von mir?",
    "Guten Tag. Die Werte habe ich notiert, die Liste liegt beim Gerät.",
    "Hallo. Was ich gesehen habe, sage ich Ihnen. Den Rest finden Sie.",
    "Guten Tag, danke für den schnellen Termin. Ich zeige Ihnen den Weg."
   ],
   "dank": [
    "Danke. Das war effizient – genau so mag ich das.",
    "Sehr gut. Die Rechnung bitte an die Praxisadresse.",
    "Danke schön. Die Mieter oben werden sich freuen.",
    "Perfekt. Dann schaffe ich sogar noch meinen nächsten Termin."
   ],
   "fehlgriff": [
    "Hm. Das klingt noch nicht nach erledigt. Brauchen Sie etwas von mir?",
    "Mein nächster Patient wartet. Aber lieber richtig als schnell."
   ]
  },
  "wimmer": {
   "name": "Herr Wimmer",
   "orte": {
    "HK": [
     "A",
     "B"
    ],
    "WP": [
     "A",
     "B"
    ],
    "DB": [
     "A",
     "B"
    ],
    "HA": [
     "A"
    ]
   },
   "begruessung": [
    "Hallo. Ist wahrscheinlich nichts Großes – schauen Sie einfach mal.",
    "Hallo. Gustl tut nichts, der will nur schauen.",
    "Ich hätt's ja noch laufen lassen. Aber meine Frau hat dann doch angerufen.",
    "Guten Tag. Kommen Sie rein, die Schuhe können Sie anlassen."
   ],
   "dank": [
    "Passt schon. Hätt ich auch selber… na ja, eher nicht. Danke.",
    "Danke schön. Belegte Brote stehen in der Küche, wenn Sie mögen.",
    "Passt. Hat ja gar nicht lang gedauert.",
    "Vielen Dank. Gustl mag Sie übrigens."
   ],
   "fehlgriff": [
    "Hm. Ist noch nichts. Eilt ja nicht – oder doch ein bisschen.",
    "Probieren Sie es ruhig noch mal. Ich hab Zeit, die Kühe sind sowieso verkauft."
   ]
  },
  "seidl": {
   "name": "Herr Seidl",
   "orte": {
    "BA": [
     "A",
     "B"
    ],
    "KU": [
     "A",
     "B"
    ],
    "AT": [
     "A",
     "B"
    ],
    "WZ": [
     "A"
    ]
   },
   "begruessung": [
    "Hi, äh, guten Tag. Die Hausverwaltung hat gesagt, Sie kommen. Kaffee?",
    "Hi, äh, hallo. Sorry für die Unordnung, wir hatten gestern WG-Abend.",
    "Guten Tag. Ich weiß nicht, was kaputt ist, aber irgendwas ist kaputt.",
    "Hallo. Darf ich zuschauen? Ich will irgendwie verstehen, wie das funktioniert."
   ],
   "dank": [
    "Krass, danke. Das erzähl ich dem Tim, der meinte, das wär voll kompliziert.",
    "Danke. Ich hab echt was gelernt.",
    "Cool, vielen Dank. Noch einen Kaffee? Der ist… ziemlich stark.",
    "Danke schön. Die Rechnung geht an die Hausverwaltung, oder?"
   ],
   "fehlgriff": [
    "Äh, ist das jetzt so richtig? Ich frag nur, ich hab ja keine Ahnung.",
    "Hm, irgendwie sieht's noch genauso aus wie vorher."
   ]
  },
  "obermaier": {
   "name": "Frau Obermaier",
   "orte": {
    "BA": [
     "A",
     "B"
    ],
    "KU": [
     "A",
     "B"
    ],
    "GW": [
     "A",
     "B"
    ],
    "HA": [
     "A",
     "B"
    ],
    "WZ": [
     "A",
     "B"
    ],
    "BU": [
     "B"
    ]
   },
   "begruessung": [
    "Gut, dass Sie da sind – bei uns steht quasi das ganze Haus unter Wasser.",
    "Hallo, kommen Sie rein. Ich komm gerade von der Nacht, also nicht wundern.",
    "Endlich. Ich sag Ihnen, das ist eine Katastrophe – na ja, fast.",
    "Hallo. Ich hab genau eine Stunde, dann muss ich schlafen. Legen wir los."
   ],
   "dank": [
    "Sie sind meine Rettung. Jetzt kann ich endlich schlafen gehen.",
    "Danke. Ich hatte schon den Weltuntergang befürchtet.",
    "Wunderbar. Das erzähl ich morgen der ganzen Station.",
    "Na also. Halb so wild – sag ich doch immer."
   ],
   "fehlgriff": [
    "Oh je. Wenn das so weitergeht, schwimmen wir hier bald.",
    "Nicht? Na, dann noch mal. Ich drück so lange die Daumen."
   ]
  },
  "kirchmair": {
   "name": "Herr Kirchmair",
   "orte": {
    "HK": [
     "A",
     "B"
    ],
    "DB": [
     "A",
     "B"
    ],
    "HA": [
     "A",
     "B"
    ],
    "WZ": [
     "A",
     "B"
    ]
   },
   "begruessung": [
    "Guten Tag. Ich habe schon gemessen – es ist eindeutig der Druck. Aber sehen Sie selbst.",
    "Guten Tag. Ich habe Ihnen eine kleine Messreihe vorbereitet. Interessiert Sie das?",
    "Ah, Sie sind da. Physikalisch ist die Sache eigentlich klar, aber bitte.",
    "Guten Tag. Ich hätte es selbst gemacht, aber ich kenne meine Grenzen."
   ],
   "dank": [
    "Danke. Interessant – das hätte ich so nicht erwartet.",
    "Sehr gut. Erklären Sie mir das kurz? Ich schreibe mit.",
    "Ich danke Ihnen. Ganz falsch war meine Theorie aber nicht, oder?",
    "Hervorragend. So ein sauberer Messwert freut den alten Lehrer."
   ],
   "fehlgriff": [
    "Hm. Das hätte ich jetzt nicht gemacht. Aber Sie sind vom Fach.",
    "Darf ich anmerken: Mein Messgerät sagt etwas anderes."
   ]
  },
  "lindner": {
   "name": "Frau Lindner",
   "orte": {
    "BA": [
     "A",
     "B"
    ],
    "KU": [
     "A",
     "B"
    ],
    "AT": [
     "A",
     "B"
    ],
    "BU": [
     "A"
    ]
   },
   "begruessung": [
    "Hallo, danke fürs Kommen. Ich kann Ihnen genau sagen, wie es klingt.",
    "Hallo. Hören Sie? Genau so klingt es, schon seit dem Frühstück.",
    "Guten Tag. Ich hab mir notiert, wann es anfängt und wie lange es dauert.",
    "Hallo, kommen Sie rein. Ich mach die Musik aus, dann hört man es besser."
   ],
   "dank": [
    "Danke. Jetzt ist es so still wie sonst. Das ist schön.",
    "Vielen Dank. Und jetzt weiß ich sogar, was das Geräusch war.",
    "Danke schön. Ich kann endlich wieder in Ruhe arbeiten.",
    "Danke. Das klingt jetzt genau richtig – wie früher."
   ],
   "fehlgriff": [
    "Hm, ich höre es immer noch. Ganz leise, aber es ist noch da.",
    "Entschuldigung, aber das klingt noch genauso wie vorher."
   ]
  },
  "nguyen": {
   "name": "Herr Nguyen",
   "orte": {
    "WP": [
     "A",
     "B"
    ],
    "DB": [
     "A",
     "B"
    ],
    "WZ": [
     "A",
     "B"
    ],
    "BU": [
     "A"
    ]
   },
   "begruessung": [
    "Hallo. Ich hab's selbst probiert, aber jetzt lass ich lieber den Profi ran.",
    "Hi. Ich hab schon reingeschaut, aber da hört mein Werkzeug auf.",
    "Hallo. Ehrlich gesagt: Ich hab schon dran rumgedreht. Sorry.",
    "Hallo, schön, dass Sie Zeit haben. Rad oder Heizung – irgendwas klemmt immer."
   ],
   "dank": [
    "Top. Das merk ich mir fürs nächste Mal – aber ich ruf trotzdem an.",
    "Danke. Wenn Ihr Fahrrad mal klemmt: Sie wissen, wo ich bin.",
    "Sauber gemacht. Das sag ich als Werkstattmensch nicht oft.",
    "Danke. Gut, dass ich's nicht weiter selbst probiert hab."
   ],
   "fehlgriff": [
    "Hm, das hatte ich auch schon probiert. Hat bei mir auch nicht geklappt.",
    "Nicht schlimm. In meiner Werkstatt klappt auch nicht alles beim ersten Mal."
   ]
  },
  "stadler": {
   "name": "Frau Stadler",
   "orte": {
    "BA": [
     "A",
     "B"
    ],
    "KU": [
     "A",
     "B"
    ],
    "GW": [
     "A",
     "B"
    ],
    "DB": [
     "A",
     "B"
    ],
    "AT": [
     "A",
     "B"
    ]
   },
   "begruessung": [
    "Guten Tag, ach, gut, dass Sie so schnell da sind. Die Gäste kommen um drei.",
    "Gut, dass Sie da sind. Die Gäste haben sich beschwert – also, eine hat. Oder zwei.",
    "Guten Tag. Was die Gäste gesagt haben, ist allerdings nicht ganz dasselbe.",
    "Ach, da sind Sie ja. Die Wohnung muss bis drei fertig sein, sonst…"
   ],
   "dank": [
    "Ein Glück. Die Gäste werden gar nicht merken, dass was war.",
    "Danke schön. Nehmen Sie ein paar Plätzchen mit, die sind selbst gebacken.",
    "Wunderbar, gerade rechtzeitig. Da kommt schon das Auto mit den Gästen.",
    "Danke. Ich schreib Sie gleich in mein Büchlein für Notfälle."
   ],
   "fehlgriff": [
    "Ach je, geht's immer noch nicht? Die Gäste kommen doch gleich.",
    "Hm. Der Gast hat aber gesagt… ach, ich weiß es auch nicht mehr genau."
   ]
  }
 },
 "meister": {
  "name": "Meister Lehner",
  "tippEinleitung": [
   "{meister} hier. Kleiner Schubs in die richtige Richtung:",
   "Die Lösung sag ich dir nicht. Aber ich sag dir, wo ich hinschauen würde.",
   "Moment, nicht raten. Ein Tipp aus dreißig Jahren Kundendienst:",
   "Atme kurz durch und hör mir zu."
  ],
  "lob": [
   "Sauber. So macht man das.",
   "Gut gemacht. Den Kaffee hast du dir verdient.",
   "Erst geschaut, dann geschraubt. Genau richtig.",
   "Na also. Aus dir wird noch was.",
   "Das war Handwerk. Weiter so.",
   "Schnell und richtig – das sieht man gern.",
   "Kunde zufrieden, Anlage läuft. Mehr will ich nicht.",
   "Ich hätte es nicht besser gemacht. Na ja, fast nicht."
  ],
  "fahrt": [
   "Fahr vorsichtig. Der nächste Kunde wartet, aber er läuft nicht weg.",
   "Zwischen zwei Einsätzen: kurz durchatmen, Koffer zählen.",
   "Tank ist voll, Kaffee ist alle. Man kann nicht alles haben.",
   "Die Umleitung am Mühlbach ist wieder weg. Gute Fahrt.",
   "Hast du alles eingepackt? Der Transporter merkt sich nichts.",
   "Im Radio sagen sie Frost an. Da klingelt morgen das Telefon.",
   "Nächster Halt. Gleiches Prinzip: schauen, denken, schrauben.",
   "Wenn du am Bäcker vorbeikommst: Für mich eine Brezel, bitte."
  ]
 },
 "tiere": {
  "gustl": [
   "Gustl, lass die Leute arbeiten. Zuschauen darf er, mehr nicht.",
   "Gustl ist neugierig. Er schaut Ihnen gern bei der Arbeit zu.",
   "Gustl, rück ein Stück. Hier wird gearbeitet.",
   "Der tut nichts, der gehört einfach dazu. Auf dem Hof ist er immer dabei.",
   "Wenn Gustl so schaut, will er nur wissen, was Sie da machen."
  ],
  "mimi": [
   "Mimi schaut gern zu. Sie ist die Neugier in Person.",
   "Mimi, lass die Leute in Ruhe arbeiten. Zuschauen ist erlaubt.",
   "Keine Sorge, Mimi tut nichts. Sie gehört einfach zum Haus.",
   "Mimi sitzt immer dort, wo etwas los ist. Das ist ihr Stammplatz.",
   "Wenn Mimi blinzelt, ist sie zufrieden. Sie mag Besuch."
  ],
  "eleonore": [
   "Eleonore schaut zu. Sie passt auf, dass alles richtig gemacht wird.",
   "Der Name ist von meinem Sohn. Eleonore findet ihn bestimmt auch zu lang.",
   "Keine Sorge, Eleonore tut nichts. Sie knabbert höchstens am Gras.",
   "Eleonore ist neugierig. Alles Neue am Gehege muss sie erst beschnuppern.",
   "Wenn ihre Nase wackelt, findet sie Sie interessant."
  ]
 },
 "werkzeuge": {
  "Bedienungsanleitung": "werkzeug",
  "Reinigungsbürste": "werkzeug",
  "Schraubendreher": "werkzeug",
  "Dichtungssortiment": "werkzeug",
  "Entlüftungsschlüssel": "werkzeug",
  "Rohrreinigungsspirale": "werkzeug",
  "Füllschlauch": "werkzeug",
  "Maulschlüssel": "werkzeug",
  "Taschenlampe": "werkzeug",
  "Servicetablet": "werkzeug",
  "Eimer": "werkzeug",
  "Handstaubsauger": "werkzeug",
  "Lamellenbürste": "werkzeug",
  "Luftpumpe mit Manometer": "werkzeug",
  "Sechskantschlüssel": "werkzeug",
  "Befüllpumpe Solar": "werkzeug",
  "Cuttermesser": "werkzeug",
  "Entkalker": "werkzeug",
  "Fernbedienung": "werkzeug",
  "Holzstab": "werkzeug",
  "Klima-Reinigungsmittel": "werkzeug",
  "Saugglocke": "werkzeug",
  "Schutzhandschuhe": "werkzeug",
  "Strahlregler-Schlüssel": "werkzeug",
  "Verstellschlüssel Thermostatkopf": "werkzeug",
  "Voreinstellschlüssel": "werkzeug",
  "Wasserhärte-Teststreifen": "werkzeug",
  "Wasserpumpenzange": "werkzeug",
  "Abgleichprotokoll": "werkzeug",
  "Thermostatkopf": "teil",
  "Armaturen-Kartusche": "teil",
  "Ausdehnungsgefäß": "teil",
  "Außenfühler": "teil",
  "Batterien": "teil",
  "Ersatzkette Spülkasten": "teil",
  "Fallrohr-Muffe": "teil",
  "Fensterkontaktschalter": "teil",
  "Frostsicherer Außenwasserhahn": "teil",
  "Funk-Raumthermostat": "teil",
  "Füllhahn": "teil",
  "Füllventil": "teil",
  "Hochtemperatur-Dämmung": "teil",
  "Kollektorfühler": "teil",
  "Kondensatpumpe": "teil",
  "Kondensatschlauch": "teil",
  "Plattenwärmetauscher": "teil",
  "Rohrbelüfter": "teil",
  "Rohrdämmung": "teil",
  "Rohrschellen": "teil",
  "Sanitärsilikon": "teil",
  "Schnellentlüfter": "teil",
  "Schwingungsdämpfer": "teil",
  "Zulaufschlauch": "teil",
  "Solarflüssigkeit": "teil",
  "Speicherfühler": "teil",
  "Stellantrieb": "teil",
  "Stellmotor Umschaltventil": "teil",
  "Thermostatkartusche": "teil",
  "Thermostatkopf mit Fernfühler": "teil",
  "WC-Anschlussmanschette": "teil",
  "Zündelektrode": "teil",
  "Lappen": "neu",
  "Spannungsprüfer": "neu",
  "Lecksuchspray": "neu",
  "Abgasmessgerät": "neu",
  "Leiter": "neu",
  "Kartuschenpresse": "neu",
  "Fugenglätter": "neu",
  "Schüssel": "neu",
  "Dämmklebeband": "neu",
  "Gießkanne": "neu",
  "Dichtband": "neu",
  "Hebehilfe": "neu",
  "Staubmaske": "neu",
  "Müllsack": "neu",
  "Absturzsicherung": "neu",
  "Leerkanister": "neu",
  "Abdeckplane": "neu",
  "Ventiladapter": "neu",
  "Schwamm": "neu",
  "Schutzbrille": "neu",
  "Auffangsack Klimagerät": "neu"
 },
 "rahmen": {
  "frage": "Findest du den Fehler im System?",
  "anleitung": "Drei Einsätze warten auf dich. Tippe im Raum alles an, was verdächtig ist, finde die Ursache und dann das passende Werkzeug. Sauber reparieren zählt mehr als schnell sein.",
  "stufen": {
   "azubi": "Drei Möglichkeiten zur Wahl und du brauchst nur das wichtigste Werkzeug. Außerdem hilft dir je einmal der Meister.",
   "geselle": "Vier Lösungen zur Wahl und du packst alles, was du brauchst. Wie viele Dinge es sind, verrät dir das Spiel.",
   "meister": "Fünf Optionen, kein Tipp, und manchmal musst du gleich zwei Fehler finden. Was in den Koffer soll, weißt du selbst."
  },
  "levelTitel": "Einsatz {n} – {ort}",
  "diagnoseFrage": [
   "Was ist die Ursache?",
   "Woran liegt es?",
   "Was steckt dahinter?"
  ],
  "werkzeugsuche": [
   "Was brauchst du für die Reparatur?",
   "Stell dir zusammen, was du für die Reparatur brauchst.",
   "Koffer, Transporter oder hier im Raum – wo liegt, was du brauchst?"
  ],
  "herkunft": {
   "koffer": "Liegt im Werkzeugkoffer.",
   "transporter": "Liegt im Transporter – kurz rausgehen.",
   "raum": "Muss hier irgendwo im Raum liegen."
  },
  "aufschluesselung": {
   "viele": "Ursache {n}/3 sofort – {f} Fehlgriffe – Ø {zeit} pro Einsatz",
   "eins": "Ursache {n}/3 sofort – 1 Fehlgriff – Ø {zeit} pro Einsatz",
   "keiner": "Ursache {n}/3 sofort – kein Fehlgriff – Ø {zeit} pro Einsatz"
  },
  "ausbildung": "Lust auf echte Einsätze? Mach deine Ausbildung bei {firma}.",
  "ausbildungKnopf": "Zur Website",
  "bewertungen": [
   "Meisterleistung",
   "Sauber gearbeitet",
   "Läuft wieder",
   "Tropft noch etwas",
   "Nochmal zum Meister"
  ],
  "abbruch": "Einsatz abbrechen? Dieser Durchgang zählt dann 0 Punkte.",
  "rueckmeldungen": {
   "loesung": [
    "Ich zeig’s dir: {ursache}. Schau dir die Befunde noch mal an.",
    "Lass gut sein, es ist: {ursache}. Merk dir, welcher Befund das verrät.",
    "Pass auf, es ist: {ursache}. Nächstes Mal liest du das selbst.",
    "Die Lösung: {ursache}. Geh die Befunde noch einmal in Ruhe durch."
   ],
   "versteckLeer": [
    "Hier liegt nichts.",
    "Leer – such woanders weiter.",
    "Nichts zu finden. Schau dich weiter im Raum um.",
    "Fehlanzeige, hier ist nichts."
   ],
   "gefunden": [
    "{werkzeug} gefunden – {versteck}.",
    "Da liegt etwas: {werkzeug}. Fundort: {versteck}.",
    "{versteck}: {werkzeug}.",
    "Fund: {werkzeug} – {versteck}."
   ],
   "genau": [
    "Sauber getroffen.",
    "Genau richtig – so soll es sein.",
    "Passt auf den Punkt.",
    "Exakt. Das hält."
   ],
   "ungenau": [
    "Fast. Ein bisschen genauer wäre besser gewesen.",
    "Geht so – knapp daneben, aber es läuft.",
    "Nicht ganz getroffen, aber im Rahmen.",
    "Das reicht gerade noch. Genauer geht’s beim nächsten Mal."
   ],
   "anlauf2": [
    "Das war nichts. Noch mal von vorn.",
    "Daneben – versuch es gleich noch einmal.",
    "So hält das nicht. Zweiter Anlauf.",
    "Nicht ganz. Setz noch einmal an."
   ],
   "entlueftenFrueh": [
    "Zu früh zu – da kommt noch Luft.",
    "Noch nicht. Erst wenn Wasser kommt, ist die Luft raus.",
    "Zu früh geschlossen, es zischt noch."
   ],
   "entlueftenSpaet": [
    "Zu spät zu – jetzt ist Wasser auf dem Boden.",
    "Da kam schon eine Weile Wasser. Früher zudrehen.",
    "Zu lange offen, der Lappen ist nass."
   ],
   "nachziehenLocker": [
    "Zu locker – da tropft es gleich wieder.",
    "Noch nicht fest genug. Ein Stück weiter.",
    "Das sitzt noch nicht, da kommt Wasser."
   ],
   "nachziehenFest": [
    "Zu fest – Vorsicht, sonst reißt die Dichtung.",
    "Nicht mit Gewalt. Nach fest kommt ab.",
    "Zu fest angezogen, das schadet dem Gewinde."
   ],
   "reihenfolge": [
    "Moment, erst der andere Schritt.",
    "Falsche Reihenfolge – überleg, was zuerst kommt.",
    "Halt, das kommt später. Was muss vorher passieren?",
    "So herum geht das nicht. Schritt für Schritt, bitte."
   ],
   "werkzeugFrage": [
    "Welches Werkzeug brauchst du? Schau dich auch im Raum um."
   ],
   "nichtWichtigste": [
    "Stimmt, aber du brauchst etwas anderes mehr.",
    "Brauchbar, nur nicht das Wichtigste für diese Reparatur.",
    "Das kommt später auch dran – zuerst brauchst du etwas anderes.",
    "Nicht verkehrt, aber das Entscheidende fehlt dir noch."
   ],
   "fundFrageAzubi": [
    "Brauchst du das am meisten, um das Problem zu lösen?"
   ],
   "fundFragePacken": [
    "Kommt das mit?"
   ],
   "anzahlPacken": [
    "Du brauchst {n} Dinge.",
    "Pack {n} Dinge ein.",
    "Für diese Reparatur brauchst du {n} Dinge."
   ],
   "anzahlPackenEins": [
    "Du brauchst nur 1 Ding."
   ],
   "nochNichtAlles": [
    "Kommt mit. Noch offen: {rest}.",
    "Eingepackt – noch offen: {rest}.",
    "Gut. Auf der Liste offen: {rest}."
   ],
   "fehltNoch": [
    "Halt – für diese Reparatur fehlt dir noch etwas.",
    "Nicht alles dabei. Was brauchst du noch?",
    "Unvollständig gepackt, da fehlt noch ein Teil."
   ],
   "unnoetig": [
    "Das brauchst du hier nicht.",
    "Unnötig eingepackt – das bleibt hier.",
    "Für diese Reparatur schleppst du das umsonst mit."
   ],
   "wackelnKlein": [
    "Etwas mehr Schwung, da sitzt noch alles fest.",
    "Zu zaghaft. Bewege es weiter hin und her.",
    "Noch zu wenig Bewegung, so löst sich nichts."
   ],
   "ursacheNotiz": [
    "Ursache: {ursache}"
   ],
   "bleibtLiegen": [
    "Bleibt liegen.",
    "Das bleibt erst mal hier.",
    "Zurückgelegt.",
    "Du lässt es, wo es ist."
   ],
   "zwischenfallTitel": [
    "Kurze Unterbrechung",
    "Moment mal…",
    "Kleine Zwischenpause"
   ],
   "geschafftAnlauf2": [
    "Beim zweiten Anlauf hat es geklappt.",
    "Jetzt sitzt es – gut, dass du drangeblieben bist.",
    "Geschafft, auch wenn es einen Anlauf mehr gebraucht hat.",
    "Diesmal passt es. Das reicht, damit es wieder läuft."
   ],
   "werkzeugFragePacken": [
    "Welche Werkzeuge brauchst du? Schau dich auch im Raum um."
   ],
   "stempel": [
    "Auftrag erledigt"
   ],
   "knopfAbbruch": [
    "Feierabend"
   ],
   "knopfWeiterarbeiten": [
    "Weiterarbeiten"
   ],
   "sicherheitVorsatz": [
    "Zur Sicherheit:"
   ],
   "ausschnittTitel": [
    "Genauer hinschauen"
   ],
   "keksOhneAuftrag": [
    "Die muss sich Gustl erst verdienen."
   ],
   "keksOhneHund": [
    "Die brauchst du hier nicht."
   ]
  },
  "knoepfeWerkzeug": [
   "Werkzeugkoffer",
   "Transporter",
   "Im Raum suchen"
  ],
  "anweisungen": {
   "leisteUntersuchen": "Tippe die markierten Stellen an und schau sie dir mit der Lupe an.",
   "leisteUntersucht": "Untersucht: {n} Stellen – wenn du die Ursache kennst, wähle sie aus.",
   "leisteUntersuchtEins": "Untersucht: 1 Stelle – wenn du die Ursache kennst, wähle sie aus.",
   "knopfTipp": "Frag den Meister (−{tipp})",
   "reinigen": "Wisch mit dem Finger über den Schmutz, bis alles sauber ist.",
   "reinigenNachVorarbeit": "Jetzt sauber machen – wisch über den Schmutz.",
   "einstellenUhr": "Drehe das Stellrad mit dem Finger im Kreis.",
   "einstellenStufen": "Drehe den Schalter auf die richtige Stufe.",
   "einstellen": "Drehe den Knopf auf die richtige Markierung.",
   "schritte": "Tippe die Arbeitsschritte in der richtigen Reihenfolge an.",
   "teilEinsetzen": "Drehe das neue Teil in die richtige Lage und ziehe es auf den markierten Platz.",
   "entlueften": "Halte das Ventil offen, bis statt Luft Wasser kommt – dann loslassen.",
   "abfluss": "Drücke im Takt, immer wenn der Ring ganz groß ist.",
   "nachziehen": "Ziehe die Verschraubung an, bis der Balken im markierten Bereich steht.",
   "entstoeren": "Halte die Entstör-Taste gedrückt, bis der Ring voll ist.",
   "menueHinweis": "Wähle mit ▲ ▼ oder durch Antippen aus und bestätige mit OK.",
   "menueSchonEingestellt": "Das ist schon eingestellt. Wähle einen anderen Wert und bestätige mit OK."
  }
 },
 "zwischenfaelle": [
  {
   "id": "ZF-01",
   "titel": "Termin vom Büro",
   "orte": [],
   "varianten": [
    "A",
    "B"
   ],
   "figur": "",
   "ausloeser": "Telefon (Büro über den Meister)",
   "sprecher": "Meister",
   "text": [
    "{meister} hier, kurz fürs Büro. Kannst du morgen früh eine Wartung übernehmen?",
    "Ganz in Ruhe, der Einsatz hier geht vor. Ich brauch nur ein Ja oder Nein."
   ],
   "aktion": "ja-nein",
   "gegenstand": "",
   "aktionText": "Entscheide selbst – beide Antworten sind in Ordnung.",
   "ja": "Prima, ich trag dich ein. Sieben Uhr, die Brezeln bring ich mit.",
   "nein": "Kein Problem, dann übernimmt das ein Kollege.",
   "abschluss": "Telefon weggesteckt, der Blick geht zurück zur Anlage."
  },
  {
   "id": "ZF-02",
   "titel": "Frischer Kaffee",
   "orte": [],
   "varianten": [
    "A",
    "B"
   ],
   "figur": "",
   "ausloeser": "Kaffee-Angebot",
   "sprecher": "Kunde",
   "text": [
    "Möchten Sie einen Kaffee? Er ist gerade frisch durchgelaufen."
   ],
   "aktion": "ja-nein",
   "gegenstand": "",
   "aktionText": "Antworte mit Ja oder Nein – hier gibt es kein Falsch.",
   "ja": "Gern. Ich stell ihn Ihnen hierher, lassen Sie ihn nicht kalt werden.",
   "nein": "Auch recht. Ein Glas Wasser steht da, falls Sie Durst bekommen.",
   "abschluss": "Kurz durchgeatmet – weiter geht es mit dem Einsatz."
  },
  {
   "id": "ZF-03",
   "titel": "Schraubendreher weggerollt",
   "orte": [],
   "varianten": [
    "A",
    "B"
   ],
   "figur": "",
   "ausloeser": "Werkzeug fällt herunter",
   "sprecher": "Kunde",
   "text": [
    "Da ist Ihnen etwas heruntergefallen. Ich hab es nur noch rollen hören."
   ],
   "aktion": "suchen",
   "gegenstand": "Schraubendreher",
   "aktionText": "Suche den Schraubendreher im Raum und tippe ihn an.",
   "ja": "",
   "nein": "",
   "abschluss": "Gefunden – der Schraubendreher liegt wieder im Koffer."
  },
  {
   "id": "ZF-04",
   "titel": "Es klingelt",
   "orte": [],
   "varianten": [
    "A",
    "B"
   ],
   "figur": "",
   "ausloeser": "Türklingel (Paketdienst)",
   "sprecher": "Kunde",
   "text": [
    "Oh, es klingelt. Das ist bestimmt der Paketdienst.",
    "Ich bin gleich wieder da. Machen Sie ruhig eine kleine Pause."
   ],
   "aktion": "warten",
   "gegenstand": "",
   "aktionText": "Warte kurz und tippe, wenn es weitergeht.",
   "ja": "",
   "nein": "",
   "abschluss": "Das Paket war für die Nachbarn – jetzt geht es weiter."
  },
  {
   "id": "ZF-05",
   "titel": "Visitenkarte",
   "orte": [],
   "varianten": [
    "A",
    "B"
   ],
   "figur": "",
   "ausloeser": "Frage nach der Telefonnummer",
   "sprecher": "Kunde",
   "text": [
    "Haben Sie eine Visitenkarte dabei? Dann hab ich die Nummer beim nächsten Mal gleich."
   ],
   "aktion": "tippen",
   "gegenstand": "Visitenkarten im Kofferdeckel",
   "aktionText": "Tippe die Visitenkarten im Deckel des Werkzeugkoffers an.",
   "ja": "",
   "nein": "",
   "abschluss": "Die Karte ist übergeben, die Nummer liegt jetzt griffbereit."
  },
  {
   "id": "ZF-06",
   "titel": "Der Meister in der Warteschleife",
   "orte": [],
   "varianten": [
    "A",
    "B"
   ],
   "figur": "",
   "ausloeser": "Telefon (Meister)",
   "sprecher": "Meister",
   "text": [
    "{meister} hier. Moment, der Großhandel ist auf der anderen Leitung.",
    "Bleib kurz dran, ich bin gleich wieder bei dir."
   ],
   "aktion": "warten",
   "gegenstand": "",
   "aktionText": "Warte, bis der Meister zurück ist, und tippe dann.",
   "ja": "",
   "nein": "",
   "abschluss": "Der Meister ist zurück: Die Teile für morgen sind bestellt."
  },
  {
   "id": "ZF-07",
   "titel": "Licht geht aus",
   "orte": [
    "HK",
    "HA"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "figur": "",
   "ausloeser": "Licht im Keller geht von selbst aus (Zeitschalter)",
   "sprecher": "Kunde",
   "text": [
    "Ach, das Licht hier unten geht nach ein paar Minuten von selbst aus.",
    "Der Schalter ist gleich neben der Tür."
   ],
   "aktion": "tippen",
   "gegenstand": "Lichtschalter (neu, neben der Tür)",
   "aktionText": "Tippe den Lichtschalter neben der Tür an.",
   "ja": "",
   "nein": "",
   "abschluss": "Das Licht ist wieder an und bleibt jetzt eine Weile."
  },
  {
   "id": "ZF-08",
   "titel": "Mimi auf dem Kessel",
   "orte": [
    "HK"
   ],
   "varianten": [
    "A"
   ],
   "figur": "huber",
   "ausloeser": "Katze Mimi",
   "sprecher": "Kunde",
   "text": [
    "Ach Mimi, ausgerechnet auf dem Kessel. Sie liegt eben gern da, wo’s warm ist.",
    "Heben Sie sie ruhig herunter, sie ist ganz zahm."
   ],
   "aktion": "wegtragen",
   "gegenstand": "Katze Mimi",
   "aktionText": "Ziehe Mimi vorsichtig vom Kessel herunter auf den Boden.",
   "ja": "",
   "nein": "",
   "abschluss": "Mimi schaut beleidigt und legt sich gleich neben den Kessel."
  },
  {
   "id": "ZF-09",
   "titel": "Gustl auf dem Koffer",
   "orte": [
    "HK",
    "WP",
    "DB",
    "HA"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "figur": "wimmer",
   "ausloeser": "Hund Gustl",
   "sprecher": "Kunde",
   "text": [
    "Jetzt hat sich Gustl auf Ihren Koffer gelegt. Er mag den Geruch von Werkzeug.",
    "Schieben Sie ihn ruhig weg, er beißt nicht."
   ],
   "aktion": "wegtragen",
   "gegenstand": "Hund Gustl",
   "aktionText": "Schiebe Gustl sanft zur Seite, damit du an den Koffer kommst.",
   "ja": "",
   "nein": "",
   "abschluss": "Gustl legt sich zwei Schritte weiter hin und schaut zu."
  },
  {
   "id": "ZF-10",
   "titel": "Das Fenster klappert",
   "orte": [
    "BA"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "figur": "",
   "ausloeser": "Wind am Badfenster",
   "sprecher": "Kunde",
   "text": [
    "Hören Sie das Klappern? Das Fenster geht auf, sobald Wind kommt.",
    "Machen Sie es ruhig zu, dann zieht es nicht so."
   ],
   "aktion": "tippen",
   "gegenstand": "Badfenster (Teil des Raumbilds)",
   "aktionText": "Tippe das Fenster an, um es zu schließen.",
   "ja": "",
   "nein": "",
   "abschluss": "Fenster zu, Ruhe im Bad."
  },
  {
   "id": "ZF-11",
   "titel": "Frische Handtücher",
   "orte": [
    "BA",
    "GW"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "figur": "",
   "ausloeser": "Kundschaft möchte kurz in den Raum",
   "sprecher": "Kunde",
   "text": [
    "Entschuldigung, darf ich kurz frische Handtücher hinlegen?"
   ],
   "aktion": "ja-nein",
   "gegenstand": "",
   "aktionText": "Antworte, wie du magst – beides ist richtig.",
   "ja": "Danke, geht ganz schnell. Und schon bin ich wieder draußen.",
   "nein": "Kein Problem, ich leg sie hin, wenn Sie fertig sind.",
   "abschluss": "Ob mit oder ohne Handtücher – zurück an die Arbeit."
  },
  {
   "id": "ZF-12",
   "titel": "Sicherung raus",
   "orte": [
    "KU",
    "AT",
    "BU"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "figur": "",
   "ausloeser": "Strom weg, Sicherung ist herausgesprungen (Wasserkocher und Kaffeemaschine zugleich)",
   "sprecher": "Kunde",
   "text": [
    "Oh, jetzt ist der Strom weg. Wasserkocher und Kaffeemaschine waren gleichzeitig an.",
    "Die Kaffeemaschine hab ich schon ausgeschaltet. Der Sicherungskasten ist im Flur."
   ],
   "aktion": "tippen",
   "gegenstand": "Sicherungskasten (neu, ein Schalter steht unten)",
   "aktionText": "Tippe im Sicherungskasten den Schalter an, der als einziger unten steht.",
   "ja": "",
   "nein": "",
   "abschluss": "Der Strom ist wieder da – Wasserkocher und Kaffee lieber nacheinander."
  },
  {
   "id": "ZF-13",
   "titel": "Frische Brötchen",
   "orte": [
    "KU",
    "AT"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "figur": "",
   "ausloeser": "Angebot einer kleinen Stärkung",
   "sprecher": "Kunde",
   "text": [
    "Ich hab gerade frische Brötchen vom Bäcker geholt. Mögen Sie eins mit Butter?"
   ],
   "aktion": "ja-nein",
   "gegenstand": "",
   "aktionText": "Entscheide frei – keine Antwort kostet etwas.",
   "ja": "Bitte schön. Die Krümel kehre ich nachher selbst weg.",
   "nein": "Dann pack ich Ihnen eins für unterwegs in eine Tüte.",
   "abschluss": "Ob gestärkt oder nicht – die Anlage wartet."
  },
  {
   "id": "ZF-14",
   "titel": "Die Ersatzrolle",
   "orte": [
    "GW"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "figur": "",
   "ausloeser": "Rolle fällt herunter",
   "sprecher": "Kunde",
   "text": [
    "Jetzt ist mir die Ersatzrolle aus der Hand gefallen. Wo ist die denn hingerollt?"
   ],
   "aktion": "suchen",
   "gegenstand": "Toilettenpapier-Rolle",
   "aktionText": "Finde die Rolle im Gäste-WC und tippe sie an.",
   "ja": "",
   "nein": "",
   "abschluss": "Die Rolle liegt wieder im Korb – alles an seinem Platz."
  },
  {
   "id": "ZF-15",
   "titel": "Äpfel über den Zaun",
   "orte": [
    "WP"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "figur": "",
   "ausloeser": "Nachbarin am Gartenzaun",
   "sprecher": "Nachbarin",
   "text": [
    "Hallo über den Zaun. Unser Apfelbaum hängt so voll. Mögen Sie ein paar mitnehmen?"
   ],
   "aktion": "ja-nein",
   "gegenstand": "",
   "aktionText": "Antworte mit Ja oder Nein – beides ist freundlich.",
   "ja": "Ich stell Ihnen eine Tüte an den Transporter. Die sind schön süß.",
   "nein": "Macht nichts, dann freut sich die Nachbarschaft darüber.",
   "abschluss": "Die Nachbarin winkt und geht zurück in ihren Garten."
  },
  {
   "id": "ZF-16",
   "titel": "Der Rasensprenger",
   "orte": [
    "WP"
   ],
   "varianten": [
    "A"
   ],
   "figur": "",
   "ausloeser": "Rasensprenger springt an (Zeitschaltung)",
   "sprecher": "Kunde",
   "text": [
    "Huch, der Rasensprenger. Der hat eine Zeitschaltung, die hab ich ganz vergessen."
   ],
   "aktion": "wegtragen",
   "gegenstand": "Rasensprenger",
   "aktionText": "Ziehe den Rasensprenger ein Stück weg, damit du trocken bleibst.",
   "ja": "",
   "nein": "",
   "abschluss": "Jetzt bekommt der Rasen das Wasser – und nicht mehr du."
  },
  {
   "id": "ZF-17",
   "titel": "Taschenlampe gesucht",
   "orte": [
    "DB"
   ],
   "varianten": [
    "A"
   ],
   "figur": "",
   "ausloeser": "Glühbirne auf dem Dachboden ist durchgebrannt",
   "sprecher": "Kunde",
   "text": [
    "Die Glühbirne hier oben ist schon wieder durch. Nehmen Sie meine Taschenlampe.",
    "Die liegt irgendwo hier herum, ich hab sie letzte Woche noch gebraucht."
   ],
   "aktion": "suchen",
   "gegenstand": "Taschenlampe",
   "aktionText": "Suche die Taschenlampe auf dem Dachboden und tippe sie an.",
   "ja": "",
   "nein": "",
   "abschluss": "Mit Licht arbeitet es sich gleich viel besser."
  },
  {
   "id": "ZF-18",
   "titel": "Die Taube",
   "orte": [
    "DB"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "figur": "",
   "ausloeser": "Taube auf dem Dachfenster",
   "sprecher": "Kunde",
   "text": [
    "Hören Sie das Gurren? Da sitzt wieder die Taube auf dem Dachfenster."
   ],
   "aktion": "tippen",
   "gegenstand": "Dachfenster (Teil des Raumbilds, Taube neu)",
   "aktionText": "Tippe ans Dachfenster, damit die Taube weiterfliegt.",
   "ja": "",
   "nein": "",
   "abschluss": "Weg ist sie – morgen sitzt sie bestimmt wieder da."
  },
  {
   "id": "ZF-19",
   "titel": "Die Waschmaschine schleudert",
   "orte": [
    "HA"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "figur": "",
   "ausloeser": "Waschmaschine nebenan",
   "sprecher": "Kunde",
   "text": [
    "Achtung, gleich schleudert die Waschmaschine nebenan. Dann versteht man kurz nichts."
   ],
   "aktion": "warten",
   "gegenstand": "",
   "aktionText": "Warte, bis die Maschine leiser wird, und tippe dann.",
   "ja": "",
   "nein": "",
   "abschluss": "Schleudern vorbei – jetzt hört man die Anlage wieder."
  },
  {
   "id": "ZF-20",
   "titel": "Mimi und der Lappen",
   "orte": [
    "WZ"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "figur": "huber",
   "ausloeser": "Katze Mimi",
   "sprecher": "Kunde",
   "text": [
    "Mimi hat Ihren Lappen gemopst. Das macht sie mit allem, was weich ist.",
    "Der liegt bestimmt irgendwo versteckt, die kleine Diebin."
   ],
   "aktion": "suchen",
   "gegenstand": "Lappen",
   "aktionText": "Finde den Lappen im Wohnzimmer und tippe ihn an.",
   "ja": "",
   "nein": "",
   "abschluss": "Lappen zurück, und Mimi schaut ganz unschuldig aus dem Fenster."
  },
  {
   "id": "ZF-21",
   "titel": "Das Spielzeugauto",
   "orte": [
    "WZ"
   ],
   "varianten": [
    "B"
   ],
   "figur": "brandl",
   "ausloeser": "Kleinkind kommt ins Wohnzimmer",
   "sprecher": "Kind",
   "text": [
    "Schau mal, mein Auto.",
    "Ist das so schnell wie dein Transporter?"
   ],
   "aktion": "ja-nein",
   "gegenstand": "",
   "aktionText": "Antworte, was du willst – hier gewinnt jede Antwort.",
   "ja": "Brumm. Dann fahren wir mal um die Wette.",
   "nein": "Hab ich mir gedacht. Meins ist nämlich das schnellste.",
   "abschluss": "Herr Brandl trägt sein Kind lachend zurück ins Spielzimmer."
  },
  {
   "id": "ZF-22",
   "titel": "Wo ist die Fernbedienung?",
   "orte": [
    "WZ"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "figur": "",
   "ausloeser": "Fernseher läuft",
   "sprecher": "Kunde",
   "text": [
    "Darf ich kurz den Fernseher leiser machen? Ach, wo ist denn die Fernbedienung wieder?"
   ],
   "aktion": "suchen",
   "gegenstand": "Fernseh-Fernbedienung",
   "aktionText": "Hilf suchen: Tippe die Fernbedienung an, sobald du sie entdeckst.",
   "ja": "",
   "nein": "",
   "abschluss": "Fernseher leise, die Fernbedienung liegt wieder auf dem Couchtisch."
  },
  {
   "id": "ZF-23",
   "titel": "Telefon am Empfang",
   "orte": [
    "BU"
   ],
   "varianten": [
    "B"
   ],
   "figur": "",
   "ausloeser": "Telefon in der Praxis",
   "sprecher": "Kunde",
   "text": [
    "Entschuldigung, das Telefon am Empfang. Ich bin gleich wieder bei Ihnen."
   ],
   "aktion": "warten",
   "gegenstand": "",
   "aktionText": "Warte kurz, bis das Gespräch vorbei ist, und tippe dann.",
   "ja": "",
   "nein": "",
   "abschluss": "Termin vergeben, der Empfang ist wieder frei."
  },
  {
   "id": "ZF-24",
   "titel": "Der Stressball",
   "orte": [
    "BU"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "figur": "",
   "ausloeser": "Stressball fällt vom Tisch",
   "sprecher": "Kunde",
   "text": [
    "Mein Stressball ist mir heruntergefallen. Den brauche ich heute bestimmt noch."
   ],
   "aktion": "suchen",
   "gegenstand": "Stressball",
   "aktionText": "Suche den Stressball und tippe ihn an.",
   "ja": "",
   "nein": "",
   "abschluss": "Ball gefunden – die Laune im Raum steigt sofort."
  },
  {
   "id": "ZF-25",
   "titel": "Gustl klaut den Lappen",
   "orte": [
    "HK",
    "WP",
    "DB",
    "HA"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "figur": "wimmer",
   "ausloeser": "Hund Gustl",
   "sprecher": "Kunde",
   "text": [
    "Gustl hat Ihren Lappen im Maul. Er hält ihn für sein neues Spielzeug.",
    "Gegen einen Hundekeks aus dem Transporter gibt er ihn bestimmt her."
   ],
   "aktion": "keks",
   "gegenstand": "Hundekeks (neu, aus dem Transporter)",
   "aktionText": "Hol den Hundekeks aus dem Transporter und gib ihn Gustl.",
   "ja": "",
   "nein": "",
   "abschluss": "Tausch gelungen: Gustl kaut zufrieden, und der Lappen liegt wieder bereit."
  },
  {
   "id": "ZF-26",
   "titel": "Ausgebüxt",
   "orte": [
    "WP"
   ],
   "varianten": [
    "A",
    "B"
   ],
   "figur": "brandl",
   "ausloeser": "Kaninchen Eleonore",
   "sprecher": "Kunde",
   "text": [
    "Oje, das Gehege steht offen. Eleonore ist ausgebüxt und sitzt irgendwo im Garten.",
    "Sie versteckt sich gern, am liebsten da, wo man sie nicht sofort sieht."
   ],
   "aktion": "suchen",
   "gegenstand": "Eleonore (Kaninchen)",
   "aktionText": "Suche Eleonore im Garten und tippe sie an.",
   "ja": "",
   "nein": "",
   "abschluss": "Herr Brandl setzt Eleonore zurück ins Gehege und macht es sorgfältig zu."
  }
 ],
 "regional": {
  "Guten Tag, schön, dass Sie da sind. Ich hab mir alles aufgeschrieben, mit Uhrzeit.": "Grüß Gott, schön, dass Sie da sind. Ich hab mir alles aufgeschrieben, mit Uhrzeit.",
  "Schönen guten Tag. Kommen Sie nur rein, der Kaffee ist gleich fertig.": "Grüß Gott. Kommen Sie nur rein, der Kaffee ist gleich fertig.",
  "Ah, von {firma}. Mein Mann hat das früher alles selber gemacht.": "Ah, von {firma}. Mei, mein Mann hat das früher alles selber gemacht.",
  "Guten Tag. Ich zeig Ihnen gleich, wo es ist – die Treppe ist ein bisschen steil.": "Grüß Gott. Ich zeig Ihnen gleich, wo es ist – die Treppe ist a bisserl steil.",
  "Vielen Dank. Jetzt trinken Sie aber noch einen Kaffee mit mir.": "Vergelt's Gott. Jetzt trinken Sie aber noch einen Kaffee mit mir.",
  "Wunderbar. Das schreib ich mir gleich ins Buch, mit Datum.": "Wunderbar. Das schreib ich mir fei gleich ins Buch, mit Datum.",
  "Hm, ich glaub, das war's noch nicht ganz. Schauen Sie ruhig noch mal.": "Hm, ich glaub, das war's noch nicht ganz. Schauen S' ruhig noch mal.",
  "Lassen Sie sich Zeit. Aber der Kaffee wird langsam ein bisschen kalt.": "Lassen Sie sich Zeit. Aber der Kaffee wird halt a bisserl kalt.",
  "Hallo. Ist wahrscheinlich nichts Großes – schauen Sie einfach mal.": "Servus. Ist wahrscheinlich eh nix Großes – schauen Sie halt mal.",
  "Hallo. Gustl tut nichts, der will nur schauen.": "Servus. Der Gustl tut nix, der will bloß schauen.",
  "Ich hätt's ja noch laufen lassen. Aber meine Frau hat dann doch angerufen.": "Ich hätt's ja noch laufen lassen. Aber meine Frau hat fei angerufen.",
  "Guten Tag. Kommen Sie rein, die Schuhe können Sie anlassen.": "Grüß Gott. Kommen S' rein, die Schuhe können S' anlassen.",
  "Passt schon. Hätt ich auch selber… na ja, eher nicht. Danke.": "Passt scho. Hätt ich auch selber… na ja, eher nicht. Danke.",
  "Danke schön. Belegte Brote stehen in der Küche, wenn Sie mögen.": "Servus und danke. Brotzeit steht in der Küche, wenn S' mögen.",
  "Passt. Hat ja gar nicht lang gedauert.": "Passt scho. Hat ja gar nicht lang gedauert.",
  "Vielen Dank. Gustl mag Sie übrigens.": "Vergelt's Gott. Der Gustl mag Sie übrigens.",
  "Hm. Ist noch nichts. Eilt ja nicht – oder doch ein bisschen.": "Hm. Is noch nix. Eilt ja nicht – oder schon a bisserl.",
  "Probieren Sie es ruhig noch mal. Ich hab Zeit, die Kühe sind sowieso verkauft.": "Probieren S' halt noch mal. Ich hab Zeit, die Kühe sind eh verkauft.",
  "Gustl, lass die Leute arbeiten. Zuschauen darf er, mehr nicht.": "Gustl, lass die Leut arbeiten. Zuschauen darf er, mehr nicht.",
  "Der tut nichts, der gehört einfach dazu. Auf dem Hof ist er immer dabei.": "Der tut nix, der gehört einfach dazu. Auf dem Hof ist er fei immer dabei.",
  "Keine Sorge, Mimi tut nichts. Sie gehört einfach zum Haus.": "Keine Sorge, die Mimi tut nix. Die gehört einfach zum Haus.",
  "Guten Tag, ach, gut, dass Sie so schnell da sind. Die Gäste kommen um drei.": "Grüß Gott, mei, gut, dass Sie so schnell da sind. Die Gäste kommen um drei.",
  "Guten Tag. Was die Gäste gesagt haben, ist allerdings nicht ganz dasselbe.": "Grüß Gott. Was die Gäste gesagt haben, ist fei nicht ganz dasselbe.",
  "Ach, da sind Sie ja. Die Wohnung muss bis drei fertig sein, sonst…": "Mei, da sind Sie ja. Die Wohnung muss bis drei fertig sein, sonst…",
  "Ein Glück. Die Gäste werden gar nicht merken, dass was war.": "Mei, ein Glück. Die Gäste werden fei gar nicht merken, dass was war.",
  "Danke schön. Nehmen Sie ein paar Plätzchen mit, die sind selbst gebacken.": "Danke schön. Nehmen S' ein paar Plätzchen mit, die sind selbst gebacken.",
  "Ach je, geht's immer noch nicht? Die Gäste kommen doch gleich.": "Mei, geht's immer noch nicht? Die Gäste kommen doch gleich.",
  "Hm, sieht noch nicht so aus. Aber ich versteh davon ja sowieso nur die Hälfte.": "Hm, sieht noch nicht so aus. Aber ich versteh davon ja eh nur die Hälfte.",
  "Nicht? Na, dann noch mal. Ich drück so lange die Daumen.": "Nicht? Na, dann noch mal. Ich halt so lange die Daumen.",
  "Wenn du am Bäcker vorbeikommst: Für mich eine Brezel, bitte.": "Wenn du am Bäcker vorbeikommst: Für mich eine Breze, bitte.",
  "Prima, ich trag dich ein. Sieben Uhr, die Brezeln bring ich mit.": "Prima, ich trag dich ein. Sieben Uhr, die Brezen bring ich mit.",
  "Ach Mimi, ausgerechnet auf dem Kessel. Sie liegt eben gern da, wo’s warm ist.": "Ach Mimi, ausgerechnet auf dem Kessel. Die liegt halt gern da, wo’s warm ist.",
  "Heben Sie sie ruhig herunter, sie ist ganz zahm.": "Heben S’ sie ruhig runter, die ist ganz zahm.",
  "Jetzt hat sich Gustl auf Ihren Koffer gelegt. Er mag den Geruch von Werkzeug.": "Jetzt hat sich der Gustl auf Ihren Koffer gelegt. Der mag den Geruch von Werkzeug.",
  "Schieben Sie ihn ruhig weg, er beißt nicht.": "Schieben S’ ihn ruhig weg, der beißt fei nicht.",
  "Ich hab gerade frische Brötchen vom Bäcker geholt. Mögen Sie eins mit Butter?": "Ich hab gerade frische Semmeln vom Bäcker geholt. Mögen Sie eine mit Butter?",
  "Dann pack ich Ihnen eins für unterwegs in eine Tüte.": "Dann pack ich Ihnen eine für unterwegs in ein Sackerl.",
  "Hallo über den Zaun. Unser Apfelbaum hängt so voll. Mögen Sie ein paar mitnehmen?": "Grüß Gott über den Zaun. Unser Apfelbaum hängt so voll. Mögen Sie ein paar mitnehmen?",
  "Ich stell Ihnen eine Tüte an den Transporter. Die sind schön süß.": "Ich stell Ihnen ein Sackerl an den Transporter. Die sind schön süß.",
  "Gustl hat Ihren Lappen im Maul. Er hält ihn für sein neues Spielzeug.": "Der Gustl hat Ihren Lappen im Maul. Der hält ihn für sein neues Spielzeug.",
  "Mimi hat Ihren Lappen gemopst. Das macht sie mit allem, was weich ist.": "Die Mimi hat Ihren Lappen gemopst. Das macht sie mit allem, was weich ist.",
  "Ich glaube, die Leitung zur Spüle ist einfach zu lang, das ist im Altbau eben so.": "Ich glaube, die Leitung zur Spüle ist einfach zu lang, das ist im Altbau halt so.",
  "Der Heizkörper wird warm. Und ich dachte, das Gäste-WC ist eben so.": "Der Heizkörper wird warm. Und ich dachte, das Gäste-WC ist halt so.",
  "Ich glaube, im Wohnzimmer ist der Estrich dicker. Da braucht die Wärme eben länger.": "Ich glaube, im Wohnzimmer ist der Estrich dicker. Da braucht die Wärme halt länger.",
  "Fußbodenheizung ist nun mal träge. Nach zwei Wochen Kälte braucht die ewig, oder?": "Fußbodenheizung ist halt träge. Nach zwei Wochen Kälte braucht die ewig, oder?",
  "Bei der Kälte kommt der Kessel einfach nicht hinterher. Der ist eben zu klein.": "Bei der Kälte kommt der Kessel einfach nicht hinterher. Der ist halt zu klein."
 },
 "trennen": {
  "Abgasmessgerät": "Abgas­mess­gerät",
  "Abgleichprotokoll": "Abgleich­protokoll",
  "Absturzsicherung": "Absturz­sicherung",
  "Bedienungsanleitung": "Bedienungs­anleitung",
  "Dichtungssortiment": "Dichtungs­sortiment",
  "Entlüftungsschlüssel": "Entlüftungs­schlüssel",
  "Entlüftungsschraube": "Entlüftungs­schraube",
  "Fensterkontaktschalter": "Fenster­kontakt­schalter",
  "Handstaubsauger": "Hand­staubsauger",
  "Kartuschenpresse": "Kartuschen­presse",
  "Kollektorfühler": "Kollektor­fühler",
  "Kondensatpumpe": "Kondensat­pumpe",
  "Kondensatschlauch": "Kondensat­schlauch",
  "Lamellenbürste": "Lamellen­bürste",
  "Plattenwärmetauscher": "Platten­wärme­tauscher",
  "Raumthermostat": "Raum­thermostat",
  "Reinigungsbürste": "Reinigungs­bürste",
  "Reinigungsmittel": "Reinigungs­mittel",
  "Rohrreinigungsspirale": "Rohr­reinigungs­spirale",
  "Sanitärsilikon": "Sanitär­silikon",
  "Schnellentlüfter": "Schnell­entlüfter",
  "Schraubendreher": "Schrauben­dreher",
  "Schutzhandschuhe": "Schutz­handschuhe",
  "Schwingungsdämpfer": "Schwingungs­dämpfer",
  "Sechskantschlüssel": "Sechskant­schlüssel",
  "Solarflüssigkeit": "Solar­flüssigkeit",
  "Spannungsprüfer": "Spannungs­prüfer",
  "Speicherfühler": "Speicher­fühler",
  "Thermostatkartusche": "Thermostat­kartusche",
  "Thermostatkopf": "Thermostat­kopf",
  "Umschaltventil": "Umschalt­ventil",
  "Verstellschlüssel": "Verstell­schlüssel",
  "Voreinstellschlüssel": "Voreinstell­schlüssel",
  "Wasserpumpenzange": "Wasser­pumpen­zange",
  "Zulaufschlauch": "Zulauf­schlauch",
  "Überwurfmutter": "Überwurf­mutter",
  "Christbaumkugeln": "Christbaum­kugeln",
  "Fahrradschlauch": "Fahrrad­schlauch",
  "Federballschläger": "Federball­schläger",
  "Fernsehzeitschrift": "Fernseh­zeitschrift",
  "Handdesinfektionsmittel": "Hand­desinfektions­mittel",
  "Orchideendünger": "Orchideen­dünger",
  "Paketklebeband": "Paket­klebeband",
  "Shampooflaschen": "Shampoo­flaschen",
  "Spezialwerkzeug": "Spezial­werkzeug",
  "Tischventilator": "Tisch­ventilator",
  "Toilettenpapier": "Toiletten­papier",
  "Wäscheklammern": "Wäsche­klammern",
  "Ablaufgarnitur": "Ablauf­garnitur",
  "Ablaufschlauch": "Ablauf­schlauch",
  "Ablauftrichter": "Ablauf­trichter",
  "Anschlussmanschette": "Anschluss­manschette",
  "Auffangbehälter": "Auffang­behälter",
  "Ausdehnungsgefäß": "Aus­dehnungs­gefäß",
  "Außenthermometer": "Außen­thermometer",
  "Außenwasserhahn": "Außen­wasser­hahn",
  "Brausebatterie": "Brause­batterie",
  "Brauseschlauch": "Brause­schlauch",
  "Dunstabzugshaube": "Dunstabzugs­haube",
  "Durchflussmesser": "Durchfluss­messer",
  "Enthärtungsanlage": "Enthärtungs­anlage",
  "Entlüftungsventil": "Entlüftungs­ventil",
  "Geschirrspüler": "Geschirr­spüler",
  "Handtuchheizkörper": "Handtuch­heizkörper",
  "Handwaschbecken": "Hand­wasch­becken",
  "Hauptabsperrventil": "Haupt­absperr­ventil",
  "Hauswasserwerk": "Hauswasser­werk",
  "Heizkreisverteiler": "Heizkreis­verteiler",
  "Heizkörperventil": "Heizkörper­ventil",
  "Kondensatablauf": "Kondensat­ablauf",
  "Kondensatsiphon": "Kondensat­siphon",
  "Kondensatwanne": "Kondensat­wanne",
  "Luftleitlamelle": "Luft­leit­lamelle",
  "Lüftungsgitter": "Lüftungs­gitter",
  "Raumbedienteil": "Raum­bedienteil",
  "Raumthermometer": "Raum­thermometer",
  "Revisionsöffnung": "Revisions­öffnung",
  "Rücklaufverschraubung": "Rücklauf­verschraubung",
  "Rückspülfilter": "Rück­spül­filter",
  "Rückstauverschluss": "Rück­stau­verschluss",
  "Sicherheitsventil": "Sicherheits­ventil",
  "Solarleitungen": "Solar­leitungen",
  "Spülwasserschlauch": "Spül­wasser­schlauch",
  "Spültischarmatur": "Spültisch­armatur",
  "Verschneideventil": "Verschneide­ventil",
  "Voreinstellring": "Voreinstell­ring",
  "Waschtischarmatur": "Waschtisch­armatur",
  "Zirkulationspumpe": "Zirkulations­pumpe",
  "Abblaseleitung": "Abblase­leitung",
  "Abtauautomatik": "Abtau­automatik",
  "Anschlussschlauch": "Anschluss­schlauch",
  "Anschlusssiebe": "Anschluss­siebe",
  "Ausdehnungswasser": "Aus­dehnungs­wasser",
  "Außentemperatur": "Außen­temperatur",
  "Bauschutzkappe": "Bau­schutz­kappe",
  "Betätigungsstößel": "Betätigungs­stößel",
  "Betriebsstellung": "Betriebs­stellung",
  "Erinnerungsring": "Erinnerungs­ring",
  "Fehlerspeicher": "Fehler­speicher",
  "Fußbodenheizung": "Fußboden­heizung",
  "Gartenschlauch": "Garten­schlauch",
  "Geruchsverschluss": "Geruchs­verschluss",
  "Hauptabsperreinrichtung": "Haupt­absperr­einrichtung",
  "Hauptabwasserleitung": "Haupt­abwasser­leitung",
  "Hauswasserdruck": "Hauswasser­druck",
  "Heizungswasser": "Heizungs­wasser",
  "Kaltwassereingang": "Kaltwasser­eingang",
  "Kaltwasserleitung": "Kaltwasser­leitung",
  "Kaltwasserrohr": "Kaltwasser­rohr",
  "Komfortfunktion": "Komfort­funktion",
  "Kontrollanzeige": "Kontroll­anzeige",
  "Luftabscheider": "Luft­abscheider",
  "Raumtemperatur": "Raum­temperatur",
  "Rückstauklappe": "Rück­stau­klappe",
  "Schornsteinanschluss": "Schornstein­anschluss",
  "Schwerkraftbremse": "Schwerkraft­bremse",
  "Schwimmerschalter": "Schwimmer­schalter",
  "Speichermaximum": "Speicher­maximum",
  "Spülmaschinensalz": "Spül­maschinen­salz",
  "Stellungsanzeige": "Stellungs­anzeige",
  "Thermostatventile": "Thermostat­ventile",
  "Verbrennungsluft": "Verbrennungs­luft",
  "Warmwasserleitung": "Warmwasser­leitung",
  "Warmwasserspeicher": "Warmwasser­speicher",
  "Wartungsaufkleber": "Wartungs­aufkleber",
  "Wohnzimmertemperatur": "Wohnzimmer­temperatur",
  "Cuttermesser": "Cutter­messer",
  "Duschabzieher": "Dusch­abzieher",
  "Dämmklebeband": "Dämm­klebe­band",
  "Eierschneider": "Eier­schneider",
  "Fernbedienung": "Fern­bedienung",
  "Fugenglätter": "Fugen­glätter",
  "Füllschlauch": "Füll­schlauch",
  "Gartenschere": "Garten­schere",
  "Gästehandtuch": "Gäste­hand­tuch",
  "Hochtemperatur": "Hoch­temperatur",
  "Kaffeefilter": "Kaffee­filter",
  "Kuscheldecke": "Kuschel­decke",
  "Lecksuchspray": "Leck­such­spray",
  "Leerkanister": "Leer­kanister",
  "Lockenwickler": "Locken­wickler",
  "Maulschlüssel": "Maul­schlüssel",
  "Pfannenwender": "Pfannen­wender",
  "Rasensprenger": "Rasen­sprenger",
  "Rohrbelüfter": "Rohr­belüfter",
  "Rohrschellen": "Rohr­schellen",
  "Schaukelpferd": "Schaukel­pferd",
  "Schutzbrille": "Schutz­brille",
  "Seifenflasche": "Seifen­flasche",
  "Servicetablet": "Service­tablet",
  "Spielzeugauto": "Spielzeug­auto",
  "Stellantrieb": "Stell­antrieb",
  "Strahlregler": "Strahl­regler",
  "Taschenlampe": "Taschen­lampe",
  "Teststreifen": "Test­streifen",
  "Ventiladapter": "Ventil­adapter",
  "Wäscheständer": "Wäsche­ständer",
  "Zündelektrode": "Zünd­elektrode",
  "Rohrdämmung": "Rohr­dämmung",
  "Wasserhärte": "Wasser­härte"
 }
};
