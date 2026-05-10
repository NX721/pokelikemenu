// ============================================================
//  POKÉLIKE CHEAT MENU — pokelike.xyz  (v6)
//
//  HOW TO USE:
//    Option A — paste into browser DevTools console (F12)
//    Option B — add <script src="cheat-menu.js"></script>
//               at the END of the game's <body> tag
//    Option C — paste in a userscript (Tampermonkey) with
//               @match https://pokelike.xyz/*  to auto-load
//
//  Toggle:  ` (backtick)  |  ⌨ button (bottom-right)
//  Close:   Esc           |  click backdrop
// ============================================================
(function () {
  'use strict';
  if (document.getElementById('cm-overlay')) return; // already loaded

  const TOGGLE_KEY = '`';
  const MENU_ID    = 'cm-overlay';
  const SP  = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
  const SPS = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/';
  const IP  = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/';

  // ── CONFIRMED items from ITEM_POOL / USABLE_ITEM_POOL ─────
  const HELD_ITEMS = [
    {id:'lucky_egg',    name:'Lucky Egg'},    {id:'life_orb',     name:'Life Orb'},
    {id:'choice_band',  name:'Choice Band'},  {id:'choice_specs', name:'Choice Specs'},
    {id:'choice_scarf', name:'Choice Scarf'}, {id:'muscle_band',  name:'Muscle Band'},
    {id:'wise_glasses', name:'Wise Glasses'}, {id:'metronome',    name:'Metronome'},
    {id:'scope_lens',   name:'Scope Lens'},   {id:'rocky_helmet', name:'Rocky Helmet'},
    {id:'shell_bell',   name:'Shell Bell'},   {id:'eviolite',     name:'Eviolite'},
    {id:'sharp_beak',   name:'Sharp Beak'},   {id:'charcoal',     name:'Charcoal'},
    {id:'mystic_water', name:'Mystic Water'}, {id:'magnet',       name:'Magnet'},
    {id:'miracle_seed', name:'Miracle Seed'}, {id:'twisted_spoon',name:'Twisted Spoon'},
    {id:'black_belt',   name:'Black Belt'},   {id:'soft_sand',    name:'Soft Sand'},
    {id:'silver_powder',name:'Silver Powder'},{id:'hard_stone',   name:'Hard Stone'},
    {id:'dragon_fang',  name:'Dragon Fang'},  {id:'poison_barb',  name:'Poison Barb'},
    {id:'spell_tag',    name:'Spell Tag'},    {id:'silk_scarf',   name:'Silk Scarf'},
    {id:'assault_vest', name:'Assault Vest'}, {id:'leftovers',    name:'Leftovers'},
    {id:'expert_belt',  name:'Expert Belt'},  {id:'focus_band',   name:'Focus Band'},
    {id:'focus_sash',   name:'Focus Sash'},   {id:'wide_lens',    name:'Wide Lens'},
    {id:'air_balloon',  name:'Air Balloon'},
  ];
  const USABLE_ITEMS = [
    {id:'max_revive', name:'Max Revive', usable:true},
    {id:'rare_candy', name:'Rare Candy', usable:true},
    {id:'moon_stone', name:'Moon Stone', usable:true},
  ];

  // 18 types confirmed from TYPE_CHART in game source
  const GAME_TYPES = [
    'Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison',
    'Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy',
  ];

  // Achievements — confirmed from ACHIEVEMENTS array in game source
  const ALL_ACH_IDS = [
    'gym_0','gym_1','gym_2','gym_3','gym_4','gym_5','gym_6','gym_7',
    'elite_four','elite_10','elite_100',
    'starter_1','starter_4','starter_7',
    'solo_run','nuzlocke_win','three_birds','no_pokecenter','no_items',
    'type_quartet','all_shiny_win','back_to_back','back_3_back',
    'endless_stage_1','endless_stage_2','endless_stage_3','endless_stage_4','endless_stage_5',
    'starters_stage_1','starters_stage_2','starters_stage_3','starters_stage_4','starters_stage_5',
    'pokedex_complete','shinydex_complete','shinydex_all',
    'pokedex_gen2','pokedex_gen3','pokedex_gen4','pokedex_gen5',
    'max_stats_1','max_stats_2','max_stats_3','max_stats_4','max_stats_all',
    'shinydex_100','shinydex_200','shinydex_300','shinydex_400','shinydex_500','shinydex_600',
  ];

  // Stage names from STAGE_META in game source
  const STAGE_NAMES = {1:'Kanto',2:'Johto',3:'Hoenn',4:'Sinnoh',5:'Unova'};

  // Gen 1 names
  const GEN1 = ['Bulbasaur','Ivysaur','Venusaur','Charmander','Charmeleon','Charizard','Squirtle','Wartortle','Blastoise','Caterpie','Metapod','Butterfree','Weedle','Kakuna','Beedrill','Pidgey','Pidgeotto','Pidgeot','Rattata','Raticate','Spearow','Fearow','Ekans','Arbok','Pikachu','Raichu','Sandshrew','Sandslash','Nidoran♀','Nidorina','Nidoqueen','Nidoran♂','Nidorino','Nidoking','Clefairy','Clefable','Vulpix','Ninetales','Jigglypuff','Wigglytuff','Zubat','Golbat','Oddish','Gloom','Vileplume','Paras','Parasect','Venonat','Venomoth','Diglett','Dugtrio','Meowth','Persian','Psyduck','Golduck','Mankey','Primeape','Growlithe','Arcanine','Poliwag','Poliwhirl','Poliwrath','Abra','Kadabra','Alakazam','Machop','Machoke','Machamp','Bellsprout','Weepinbell','Victreebel','Tentacool','Tentacruel','Geodude','Graveler','Golem','Ponyta','Rapidash','Slowpoke','Slowbro','Magnemite','Magneton',"Farfetch'd",'Doduo','Dodrio','Seel','Dewgong','Grimer','Muk','Shellder','Cloyster','Gastly','Haunter','Gengar','Onix','Drowzee','Hypno','Krabby','Kingler','Voltorb','Electrode','Exeggcute','Exeggutor','Cubone','Marowak','Hitmonlee','Hitmonchan','Lickitung','Koffing','Weezing','Rhyhorn','Rhydon','Chansey','Tangela','Kangaskhan','Horsea','Seadra','Goldeen','Seaking','Staryu','Starmie','Mr. Mime','Scyther','Jynx','Electabuzz','Magmar','Pinsir','Tauros','Magikarp','Gyarados','Lapras','Ditto','Eevee','Vaporeon','Jolteon','Flareon','Porygon','Omanyte','Omastar','Kabuto','Kabutops','Aerodactyl','Snorlax','Articuno','Zapdos','Moltres','Dratini','Dragonair','Dragonite','Mewtwo','Mew'];

  // Gen 2–9 names
  const EXTRA_NAMES = {152:'Chikorita',153:'Bayleef',154:'Meganium',155:'Cyndaquil',156:'Quilava',157:'Typhlosion',158:'Totodile',159:'Croconaw',160:'Feraligatr',161:'Sentret',162:'Furret',163:'Hoothoot',164:'Noctowl',165:'Ledyba',166:'Ledian',167:'Spinarak',168:'Ariados',169:'Crobat',170:'Chinchou',171:'Lanturn',172:'Pichu',173:'Cleffa',174:'Igglybuff',175:'Togepi',176:'Togetic',177:'Natu',178:'Xatu',179:'Mareep',180:'Flaaffy',181:'Ampharos',182:'Bellossom',183:'Marill',184:'Azumarill',185:'Sudowoodo',186:'Politoed',187:'Hoppip',188:'Skiploom',189:'Jumpluff',190:'Aipom',191:'Sunkern',192:'Sunflora',193:'Yanma',194:'Wooper',195:'Quagsire',196:'Espeon',197:'Umbreon',198:'Murkrow',199:'Slowking',200:'Misdreavus',201:'Unown',202:'Wobbuffet',203:'Girafarig',204:'Pineco',205:'Forretress',206:'Dunsparce',207:'Gligar',208:'Steelix',209:'Snubbull',210:'Granbull',211:'Qwilfish',212:'Scizor',213:'Shuckle',214:'Heracross',215:'Sneasel',216:'Teddiursa',217:'Ursaring',218:'Slugma',219:'Magcargo',220:'Swinub',221:'Piloswine',222:'Corsola',223:'Remoraid',224:'Octillery',225:'Delibird',226:'Mantine',227:'Skarmory',228:'Houndour',229:'Houndoom',230:'Kingdra',231:'Phanpy',232:'Donphan',233:'Porygon2',234:'Stantler',235:'Smeargle',236:'Tyrogue',237:'Hitmontop',238:'Smoochum',239:'Elekid',240:'Magby',241:'Miltank',242:'Blissey',243:'Raikou',244:'Entei',245:'Suicune',246:'Larvitar',247:'Pupitar',248:'Tyranitar',249:'Lugia',250:'Ho-oh',251:'Celebi',252:'Treecko',253:'Grovyle',254:'Sceptile',255:'Torchic',256:'Combusken',257:'Blaziken',258:'Mudkip',259:'Marshtomp',260:'Swampert',261:'Poochyena',262:'Mightyena',263:'Zigzagoon',264:'Linoone',265:'Wurmple',266:'Silcoon',267:'Beautifly',268:'Cascoon',269:'Dustox',270:'Lotad',271:'Lombre',272:'Ludicolo',273:'Seedot',274:'Nuzleaf',275:'Shiftry',276:'Taillow',277:'Swellow',278:'Wingull',279:'Pelipper',280:'Ralts',281:'Kirlia',282:'Gardevoir',283:'Surskit',284:'Masquerain',285:'Shroomish',286:'Breloom',287:'Slakoth',288:'Vigoroth',289:'Slaking',290:'Nincada',291:'Ninjask',292:'Shedinja',293:'Whismur',294:'Loudred',295:'Exploud',296:'Makuhita',297:'Hariyama',298:'Azurill',299:'Nosepass',300:'Skitty',301:'Delcatty',302:'Sableye',303:'Mawile',304:'Aron',305:'Lairon',306:'Aggron',307:'Meditite',308:'Medicham',309:'Electrike',310:'Manectric',311:'Plusle',312:'Minun',313:'Volbeat',314:'Illumise',315:'Roselia',316:'Gulpin',317:'Swalot',318:'Carvanha',319:'Sharpedo',320:'Wailmer',321:'Wailord',322:'Numel',323:'Camerupt',324:'Torkoal',325:'Spoink',326:'Grumpig',327:'Spinda',328:'Trapinch',329:'Vibrava',330:'Flygon',331:'Cacnea',332:'Cacturne',333:'Swablu',334:'Altaria',335:'Zangoose',336:'Seviper',337:'Lunatone',338:'Solrock',339:'Barboach',340:'Whiscash',341:'Corphish',342:'Crawdaunt',343:'Baltoy',344:'Claydol',345:'Lileep',346:'Cradily',347:'Anorith',348:'Armaldo',349:'Feebas',350:'Milotic',351:'Castform',352:'Kecleon',353:'Shuppet',354:'Banette',355:'Duskull',356:'Dusclops',357:'Tropius',358:'Chimecho',359:'Absol',360:'Wynaut',361:'Snorunt',362:'Glalie',363:'Spheal',364:'Sealeo',365:'Walrein',366:'Clamperl',367:'Huntail',368:'Gorebyss',369:'Relicanth',370:'Luvdisc',371:'Bagon',372:'Shelgon',373:'Salamence',374:'Beldum',375:'Metang',376:'Metagross',377:'Regirock',378:'Regice',379:'Registeel',380:'Latias',381:'Latios',382:'Kyogre',383:'Groudon',384:'Rayquaza',385:'Jirachi',386:'Deoxys',387:'Turtwig',388:'Grotle',389:'Torterra',390:'Chimchar',391:'Monferno',392:'Infernape',393:'Piplup',394:'Prinplup',395:'Empoleon',396:'Starly',397:'Staravia',398:'Staraptor',399:'Bidoof',400:'Bibarel',401:'Kricketot',402:'Kricketune',403:'Shinx',404:'Luxio',405:'Luxray',406:'Budew',407:'Roserade',408:'Cranidos',409:'Rampardos',410:'Shieldon',411:'Bastiodon',412:'Burmy',413:'Wormadam',414:'Mothim',415:'Combee',416:'Vespiquen',417:'Pachirisu',418:'Buizel',419:'Floatzel',420:'Cherubi',421:'Cherrim',422:'Shellos',423:'Gastrodon',424:'Ambipom',425:'Drifloon',426:'Drifblim',427:'Buneary',428:'Lopunny',429:'Mismagius',430:'Honchkrow',431:'Glameow',432:'Purugly',433:'Chingling',434:'Stunky',435:'Skuntank',436:'Bronzor',437:'Bronzong',438:'Bonsly',439:'Mime Jr.',440:'Happiny',441:'Chatot',442:'Spiritomb',443:'Gible',444:'Gabite',445:'Garchomp',446:'Munchlax',447:'Riolu',448:'Lucario',449:'Hippopotas',450:'Hippowdon',451:'Skorupi',452:'Drapion',453:'Croagunk',454:'Toxicroak',455:'Carnivine',456:'Finneon',457:'Lumineon',458:'Mantyke',459:'Snover',460:'Abomasnow',461:'Weavile',462:'Magnezone',463:'Lickilicky',464:'Rhyperior',465:'Tangrowth',466:'Electivire',467:'Magmortar',468:'Togekiss',469:'Yanmega',470:'Leafeon',471:'Glaceon',472:'Gliscor',473:'Mamoswine',474:'Porygon-Z',475:'Gallade',476:'Probopass',477:'Dusknoir',478:'Froslass',479:'Rotom',480:'Uxie',481:'Mesprit',482:'Azelf',483:'Dialga',484:'Palkia',485:'Heatran',486:'Regigigas',487:'Giratina',488:'Cresselia',489:'Phione',490:'Manaphy',491:'Darkrai',492:'Shaymin',493:'Arceus',494:'Victini',495:'Snivy',496:'Servine',497:'Serperior',498:'Tepig',499:'Pignite',500:'Emboar',501:'Oshawott',502:'Dewott',503:'Samurott',504:'Patrat',505:'Watchog',506:'Lillipup',507:'Herdier',508:'Stoutland',509:'Purrloin',510:'Liepard',511:'Pansage',512:'Simisage',513:'Pansear',514:'Simisear',515:'Panpour',516:'Simipour',517:'Munna',518:'Musharna',519:'Pidove',520:'Tranquill',521:'Unfezant',522:'Blitzle',523:'Zebstrika',524:'Roggenrola',525:'Boldore',526:'Gigalith',527:'Woobat',528:'Swoobat',529:'Drilbur',530:'Excadrill',531:'Audino',532:'Timburr',533:'Gurdurr',534:'Conkeldurr',535:'Tympole',536:'Palpitoad',537:'Seismitoad',538:'Throh',539:'Sawk',540:'Sewaddle',541:'Swadloon',542:'Leavanny',543:'Venipede',544:'Whirlipede',545:'Scolipede',546:'Cottonee',547:'Whimsicott',548:'Petilil',549:'Lilligant',550:'Basculin',551:'Sandile',552:'Krokorok',553:'Krookodile',554:'Darumaka',555:'Darmanitan',556:'Maractus',557:'Dwebble',558:'Crustle',559:'Scraggy',560:'Scrafty',561:'Sigilyph',562:'Yamask',563:'Cofagrigus',564:'Tirtouga',565:'Carracosta',566:'Archen',567:'Archeops',568:'Trubbish',569:'Garbodor',570:'Zorua',571:'Zoroark',572:'Minccino',573:'Cinccino',574:'Gothita',575:'Gothorita',576:'Gothitelle',577:'Solosis',578:'Duosion',579:'Reuniclus',580:'Ducklett',581:'Swanna',582:'Vanillite',583:'Vanillish',584:'Vanilluxe',585:'Deerling',586:'Sawsbuck',587:'Emolga',588:'Karrablast',589:'Escavalier',590:'Foongus',591:'Amoonguss',592:'Frillish',593:'Jellicent',594:'Alomomola',595:'Joltik',596:'Galvantula',597:'Ferroseed',598:'Ferrothorn',599:'Klink',600:'Klang',601:'Klinklang',602:'Tynamo',603:'Eelektrik',604:'Eelektross',605:'Elgyem',606:'Beheeyem',607:'Litwick',608:'Lampent',609:'Chandelure',610:'Axew',611:'Fraxure',612:'Haxorus',613:'Cubchoo',614:'Beartic',615:'Cryogonal',616:'Shelmet',617:'Accelgor',618:'Stunfisk',619:'Mienfoo',620:'Mienshao',621:'Druddigon',622:'Golett',623:'Golurk',624:'Pawniard',625:'Bisharp',626:'Bouffalant',627:'Rufflet',628:'Braviary',629:'Vullaby',630:'Mandibuzz',631:'Heatmor',632:'Durant',633:'Deino',634:'Zweilous',635:'Hydreigon',636:'Larvesta',637:'Volcarona',638:'Cobalion',639:'Terrakion',640:'Virizion',641:'Tornadus',642:'Thundurus',643:'Reshiram',644:'Zekrom',645:'Landorus',646:'Kyurem',647:'Keldeo',648:'Meloetta',649:'Genesect',650:'Chespin',651:'Quilladin',652:'Chesnaught',653:'Fennekin',654:'Braixen',655:'Delphox',656:'Froakie',657:'Frogadier',658:'Greninja',700:'Sylveon',701:'Hawlucha',716:'Xerneas',717:'Yveltal',718:'Zygarde',722:'Rowlet',723:'Dartrix',724:'Decidueye',725:'Litten',726:'Torracat',727:'Incineroar',728:'Popplio',729:'Brionne',730:'Primarina',745:'Lycanroc',772:'Type: Null',773:'Silvally',778:'Mimikyu',785:'Tapu Koko',791:'Solgaleo',792:'Lunala',800:'Necrozma',810:'Grookey',811:'Thwackey',812:'Rillaboom',813:'Scorbunny',814:'Raboot',815:'Cinderace',816:'Sobble',817:'Drizzile',818:'Inteleon',884:'Duraludon',885:'Dreepy',886:'Drakloak',887:'Dragapult',888:'Zacian',889:'Zamazenta',890:'Eternatus',906:'Sprigatito',907:'Floragato',908:'Meowscarada',909:'Fuecoco',910:'Crocalor',911:'Skeledirge',912:'Quaxly',913:'Quaxwell',914:'Quaquaval',980:'Clodsire',1007:'Koraidon',1008:'Miraidon'};

  function pokeName(id) {
    if (id >= 1 && id <= 151) return GEN1[id - 1] || `#${id}`;
    return EXTRA_NAMES[id] || `#${id}`;
  }

  // ── CSS ────────────────────────────────────────────────────
  const CSS = `
    #cm-fab {
      position:fixed; bottom:14px; right:14px; z-index:99998;
      background:#0d0d1a; color:#ffe066; border:2px solid #ffe066;
      border-radius:6px; padding:6px 11px; font-size:16px; cursor:pointer;
      box-shadow:0 2px 12px #000a; font-family:'Press Start 2P',monospace;
      transition:opacity .15s; line-height:1;
    }
    #cm-fab:hover { opacity:.8; }
    #cm-backdrop { position:fixed; inset:0; background:#000b; z-index:99997; }
    #${MENU_ID} {
      position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
      z-index:99999; width:min(96vw,620px); max-height:92vh; overflow-y:auto;
      background:#0d0d1a; border:2px solid #ffe066; border-radius:10px;
      padding:0 0 14px; box-shadow:0 8px 40px #000e;
      font-family:'Press Start 2P',monospace; color:#e8e8e8;
      scrollbar-width:thin; scrollbar-color:#ffe066 #1a1a2e;
    }
    #${MENU_ID}::-webkit-scrollbar { width:5px; }
    #${MENU_ID}::-webkit-scrollbar-track { background:#1a1a2e; }
    #${MENU_ID}::-webkit-scrollbar-thumb { background:#ffe066; border-radius:3px; }
    .cm-hdr {
      position:sticky; top:0; z-index:10; background:#0d0d1a;
      border-bottom:2px solid #1e1e38; padding:10px 14px 8px;
      display:flex; align-items:center; justify-content:space-between;
    }
    .cm-hdr-title { font-size:9px; color:#ffe066; letter-spacing:2px; }
    .cm-x { background:none; border:none; color:#888; font-size:18px; cursor:pointer; font-family:monospace; padding:0; }
    .cm-x:hover { color:#fff; }
    .cm-tabs { display:flex; overflow-x:auto; background:#12122a; border-bottom:2px solid #1e1e38; scrollbar-width:none; }
    .cm-tabs::-webkit-scrollbar { display:none; }
    .cm-tab {
      flex-shrink:0; padding:8px 12px; font-size:7px; color:#666; cursor:pointer;
      border-bottom:2px solid transparent; white-space:nowrap;
      background:none; border-top:none; border-left:none; border-right:none;
      font-family:inherit; transition:color .12s, border-color .12s;
    }
    .cm-tab:hover { color:#aaa; }
    .cm-tab.active { color:#ffe066; border-bottom-color:#ffe066; }
    .cm-panel { display:none; padding:10px 12px; }
    .cm-panel.active { display:block; }
    .cm-sec { margin-bottom:10px; border:1px solid #1e1e38; border-radius:6px; overflow:hidden; }
    .cm-sec-ttl { background:#12122a; color:#ffe066; font-size:7px; letter-spacing:1px; padding:5px 9px; border-bottom:1px solid #1e1e38; }
    .cm-sec-note { font-size:6px; color:#888; padding:5px 9px 0; }
    .cm-sec-body { padding:9px; display:flex; flex-wrap:wrap; gap:6px; }
    .cm-sec-body.col { flex-direction:column; gap:7px; }
    .cm-btn {
      font-family:inherit; font-size:7px; padding:5px 9px; border-radius:4px;
      border:1px solid #3a3a5a; background:#1a1a30; color:#ccc;
      cursor:pointer; white-space:nowrap; line-height:1.5;
      display:inline-flex; align-items:center; gap:5px;
      transition:background .1s, border-color .1s, color .1s;
    }
    .cm-btn:hover { background:#252545; border-color:#ffe066; color:#ffe066; }
    .cm-btn.ok  { border-color:#2a5; color:#6f6; }
    .cm-btn.ok:hover  { background:#0a200a; border-color:#4f4; }
    .cm-btn.bad { border-color:#622; color:#f66; }
    .cm-btn.bad:hover { background:#200a0a; border-color:#f44; }
    .cm-btn.blu { border-color:#247; color:#8af; }
    .cm-btn.blu:hover { background:#080e20; border-color:#6af; }
    .cm-btn.yel { border-color:#660; color:#fda; }
    .cm-btn.yel:hover { background:#1a1000; border-color:#fc0; }
    .cm-btn img { width:14px; height:14px; image-rendering:pixelated; vertical-align:middle; }
    .cm-row { display:flex; align-items:center; gap:7px; width:100%; }
    .cm-row label { font-size:7px; color:#888; white-space:nowrap; min-width:70px; }
    .cm-row input[type=range] { flex:1; accent-color:#ffe066; height:3px; }
    .cm-row input[type=number], .cm-row input[type=text], .cm-row select {
      font-family:inherit; font-size:7px; background:#12122a;
      border:1px solid #3a3a5a; border-radius:4px; color:#e8e8e8; padding:3px 6px;
    }
    .cm-row input[type=number] { width:62px; }
    .cm-row input[type=text]   { flex:1; }
    .cm-row select             { flex:1; }
    .cm-val { font-size:8px; color:#ffe066; min-width:28px; text-align:right; }
    input:focus, select:focus { outline:1px solid #ffe066; }
    select option { background:#12122a; color:#e8e8e8; }
    /* Team */
    .cm-tlist { display:flex; flex-direction:column; gap:6px; width:100%; }
    .cm-prow {
      display:flex; align-items:center; gap:7px; background:#12122a;
      border-radius:5px; padding:5px 7px; border:1px solid transparent;
      flex-wrap:wrap; cursor:pointer; transition:border-color .1s;
    }
    .cm-prow:hover { border-color:#3a3a5a; }
    .cm-prow.sel   { border-color:#ffe066; }
    .cm-psp { width:36px; height:36px; image-rendering:pixelated; flex-shrink:0; }
    .cm-pnm { flex:1; font-size:7px; color:#ddd; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; min-width:80px; }
    .cm-php-wrap { flex:1; min-width:50px; background:#333; border-radius:3px; height:5px; overflow:hidden; }
    .cm-php-bar  { height:100%; border-radius:3px; transition:width .2s; }
    .cm-php-txt  { font-size:7px; color:#888; min-width:52px; text-align:right; }
    .cm-detail { width:100%; background:#0d0d1a; border-radius:5px; padding:8px; border:1px solid #1e1e38; margin-top:3px; }
    .cm-detail-ttl { font-size:7px; color:#ffe066; margin-bottom:5px; letter-spacing:1px; }
    .cm-stat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:5px; margin-bottom:7px; }
    .cm-stat-item { display:flex; flex-direction:column; gap:2px; }
    .cm-stat-item label { font-size:6px; color:#888; }
    .cm-stat-item input { font-family:inherit; font-size:7px; background:#12122a; border:1px solid #3a3a5a; border-radius:3px; color:#e8e8e8; padding:2px 5px; width:100%; }
    /* Search */
    .cm-results { max-height:160px; overflow-y:auto; background:#12122a; border-radius:5px; border:1px solid #1e1e38; display:flex; flex-direction:column; }
    .cm-result  { display:flex; align-items:center; gap:7px; padding:4px 7px; cursor:pointer; font-size:7px; transition:background .1s; }
    .cm-result:hover { background:#1a1a30; }
    .cm-result img { width:28px; height:28px; image-rendering:pixelated; }
    /* Bag */
    #cm-bag-list { max-height:180px; overflow-y:auto; display:flex; flex-direction:column; gap:3px; width:100%; }
    .cm-bag-row { display:flex; align-items:center; justify-content:space-between; padding:3px 6px; font-size:7px; color:#bbb; background:#12122a; border-radius:3px; }
    .cm-bag-row img { width:14px; height:14px; image-rendering:pixelated; margin-right:3px; vertical-align:middle; }
    /* Node picker */
    .cm-node-grid { display:flex; flex-direction:column; gap:4px; width:100%; max-height:200px; overflow-y:auto; }
    .cm-node-row  { display:flex; align-items:center; gap:6px; padding:4px 6px; background:#12122a; border-radius:4px; font-size:7px; cursor:pointer; border:1px solid transparent; }
    .cm-node-row:hover { border-color:#ffe066; color:#ffe066; }
    .cm-node-badge { font-size:6px; padding:1px 4px; border-radius:3px; background:#1e1e38; color:#aaa; }
    /* HoF editor */
    .cm-hof-entry { background:#12122a; border-radius:5px; padding:7px 9px; border:1px solid #1e1e38; font-size:7px; display:flex; align-items:flex-start; gap:8px; flex-wrap:wrap; }
    .cm-hof-sprites { display:flex; gap:3px; flex-shrink:0; }
    .cm-hof-sprites img { width:26px; height:26px; image-rendering:pixelated; }
    .cm-hof-meta { flex:1; color:#aaa; font-size:6px; line-height:1.8; }
    .cm-hof-meta b { color:#ffe066; }
    /* Freeze */
    #cm-freeze-banner { display:none; position:fixed; top:0; left:0; right:0; z-index:89999; background:#ffe066; color:#0d0d1a; font-family:'Press Start 2P',monospace; font-size:7px; text-align:center; padding:5px; pointer-events:none; }
    #cm-freeze-ov { display:none; position:fixed; inset:0; z-index:89998; pointer-events:all; cursor:not-allowed; }
    /* Feedback */
    #cm-feedback { font-size:7px; min-height:14px; text-align:center; padding:4px 12px 0; color:#4f4; }
    #cm-feedback.err  { color:#f66; }
    #cm-feedback.warn { color:#fda; }
  `;

  // ── STATE ──────────────────────────────────────────────────
  let _selIdx   = null;
  let _snapshot = null;

  // ── HELPERS ────────────────────────────────────────────────
  const S = () => (typeof state !== 'undefined' ? state : null);

  function fb(msg, cls = '') {
    const el = document.getElementById('cm-feedback');
    if (!el) return;
    el.textContent = msg; el.className = cls;
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.textContent = ''; el.className = ''; }, 3500);
  }

  function need(fn) {
    const s = S();
    if (!s || !s.team?.length) { fb('No active run — start a game first!', 'err'); return; }
    fn(s);
  }

  function persist(s) {
    try { if (typeof saveRun === 'function') saveRun(); } catch (_) {}
    try { if (typeof renderTeamBar === 'function') renderTeamBar(s.team); } catch (_) {}
    try { if (typeof renderItemBadges === 'function') renderItemBadges(s.items); } catch (_) {}
  }

  // calcHp confirmed formula: Math.floor(baseHp * level / 50) + level + 10
  function setLvl(p, lvl) {
    lvl = Math.max(1, Math.floor(+lvl));
    p.level = lvl;
    try {
      const raw  = typeof calcHp === 'function'
        ? calcHp(p.baseStats.hp, lvl)
        : (Math.floor((p.baseStats?.hp || 50) * lvl / 50) + lvl + 10);
      const buff = p.statBuffs?.hp ?? 0;
      const newMax = Math.floor(raw * (1 + 0.1 * buff));
      if (p.currentHp > 0) p.currentHp = Math.min(p.currentHp, newMax);
      p.maxHp = newMax;
    } catch (_) {}
  }

  function iSpr(id, size = 14) {
    const slug = id.replace(/_/g, '-');
    return `<img src="${IP}${slug}.png" style="width:${size}px;height:${size}px;image-rendering:pixelated;vertical-align:middle;" onerror="this.style.display='none'">`;
  }

  function realItem(id) {
    try {
      return [...(typeof ITEM_POOL !== 'undefined' ? ITEM_POOL : []),
              ...(typeof USABLE_ITEM_POOL !== 'undefined' ? USABLE_ITEM_POOL : [])]
             .find(it => it.id === id) || null;
    } catch (_) { return null; }
  }

  // Get the evo-line root (game stores stat buffs by this key)
  function evoRoot(speciesId) {
    try {
      if (typeof getEvoLineRoot === 'function') return getEvoLineRoot(speciesId);
      // Fallback: walk EVOLUTIONS backwards
      if (typeof EVOLUTIONS === 'undefined') return speciesId;
      let id = speciesId, changed = true;
      while (changed) {
        changed = false;
        for (const [from, evo] of Object.entries(EVOLUTIONS)) {
          if (evo.into === id) { id = +from; changed = true; break; }
        }
      }
      return id;
    } catch (_) { return speciesId; }
  }

  // ── SNAPSHOT ───────────────────────────────────────────────
  function takeSnapshot() {
    try { _snapshot = JSON.stringify(S()); fb('Snapshot saved — click Restore to rewind here.'); }
    catch (e) { fb('Snapshot failed: ' + e.message, 'err'); }
  }
  function restoreSnapshot() {
    if (!_snapshot) { fb('No snapshot taken yet.', 'err'); return; }
    if (!confirm('Restore snapshot? Current state will be overwritten.')) return;
    try {
      const s = S(); if (!s) { fb('No live state.', 'err'); return; }
      Object.assign(s, JSON.parse(_snapshot));
      persist(s); _selIdx = null; renderTeam('cm-teamlist'); fb('Snapshot restored!');
    } catch (e) { fb('Restore failed: ' + e.message, 'err'); }
  }

  // ── FREEZE ─────────────────────────────────────────────────
  function freezeGame() {
    try { window._nodeClickBusy = true; } catch (_) {}
    let ov = document.getElementById('cm-freeze-ov');
    let bn = document.getElementById('cm-freeze-banner');
    if (!ov) { ov = document.createElement('div'); ov.id = 'cm-freeze-ov'; document.body.appendChild(ov); }
    if (!bn) { bn = document.createElement('div'); bn.id = 'cm-freeze-banner'; bn.textContent = '⏸ GAME PAUSED — press ` and click Unfreeze to resume'; document.body.appendChild(bn); }
    ov.style.display = 'block'; bn.style.display = 'block';
    fb('Game frozen — map clicks are blocked.');
  }
  function unfreezeGame() {
    try { window._nodeClickBusy = false; } catch (_) {}
    document.getElementById('cm-freeze-ov'    )?.remove();
    document.getElementById('cm-freeze-banner')?.remove();
    fb('Game unpaused.');
  }

  // ── MOVE POWER PATCH ───────────────────────────────────────
  function ensureMovePowerPatch() {
    if (window.__cmMovePatch) return;
    window.__cmMovePatch = true;
    try {
      const orig = getBestMove;
      getBestMove = function(types, baseStats, speciesId, moveTier) {
        const move = orig.call(this, types, baseStats, speciesId, moveTier);
        const p = S()?.team?.find(pk => pk.speciesId === speciesId && pk._customMovePower);
        return (p && move) ? { ...move, power: p._customMovePower } : move;
      };
    } catch (_) {}
  }

  // ── EVO CHAIN ──────────────────────────────────────────────
  function getEvoChain(speciesId) {
    try {
      if (typeof buildEvoChain === 'function') {
        const { chain } = buildEvoChain(speciesId);
        const ids = []; function walk(n) { if (!ids.includes(n.id)) ids.push(n.id); (n.evolvesInto||[]).forEach(walk); } walk(chain);
        return ids.sort((a, b) => a - b);
      }
      if (typeof EVOLUTIONS === 'undefined') return [];
      let root = speciesId, changed = true;
      while (changed) { changed = false; for (const [f, e] of Object.entries(EVOLUTIONS)) { if (e.into === root) { root = +f; changed = true; break; } } }
      const ch = [root]; let cur = root;
      while (EVOLUTIONS[cur]) { cur = EVOLUTIONS[cur].into; ch.push(cur); }
      return ch;
    } catch (_) { return []; }
  }

  // ── TEAM RENDER ────────────────────────────────────────────
  function renderTeam(cid, detail = true) {
    const el = document.getElementById(cid);
    if (!el) return;
    const s = S();
    const bc = document.getElementById('cm-badge-val');
    if (bc && s) bc.textContent = s.badges ?? 0;
    if (!s?.team?.length) { el.innerHTML = '<span style="font-size:7px;color:#555;padding:4px;">No team yet — start a run first.</span>'; return; }
    el.innerHTML = '';
    s.team.forEach((p, i) => {
      const pct    = Math.max(0, Math.min(100, Math.round((p.currentHp / p.maxHp) * 100)));
      const col    = pct > 50 ? '#4f4' : pct > 20 ? '#ff0' : '#f44';
      const sprite = p.spriteUrl || (p.isShiny ? `${SPS}${p.speciesId}.png` : `${SP}${p.speciesId}.png`);
      const tags   = [p.isShiny ? '✨' : '', p._customMovePower ? `⚡${p._customMovePower}` : '', p.heldItem ? '🎒' : ''].filter(Boolean).join(' ');
      const row    = document.createElement('div');
      row.className = 'cm-prow' + (detail && _selIdx === i ? ' sel' : '');
      row.dataset.idx = i;
      row.innerHTML = `
        <img class="cm-psp" src="${sprite}" alt="${p.name}" onerror="this.src='${SP}${p.speciesId}.png'">
        <span class="cm-pnm">[${i}] ${p.nickname || p.name} Lv${p.level}${tags ? ' ' + tags : ''}</span>
        <div class="cm-php-wrap" title="${p.currentHp}/${p.maxHp} HP">
          <div class="cm-php-bar" style="width:${pct}%;background:${col};"></div>
        </div>
        <span class="cm-php-txt">${p.currentHp}/${p.maxHp}</span>`;
      el.appendChild(row);
      if (detail && _selIdx === i) {
        const d = document.createElement('div'); d.className = 'cm-detail'; d.innerHTML = buildDetail(p, i); el.appendChild(d);
      }
    });
  }

  function buildDetail(p, idx) {
    const bs = p.baseStats || {};
    const statRows = ['hp','atk','def','speed','special','spdef'].map(k => `
      <div class="cm-stat-item">
        <label>${k.toUpperCase()}</label>
        <input type="number" class="cm-si" data-pi="${idx}" data-st="${k}" min="1" max="9999" value="${bs[k] ?? 50}">
      </div>`).join('');

    const chain = getEvoChain(p.speciesId);
    const evoHtml = chain.length > 1 ? `
      <div class="cm-detail-ttl">EVO CHAIN</div>
      <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px;">
        ${chain.map(id => `
          <button class="cm-btn ${id===p.speciesId?'yel':id<p.speciesId?'bad':'ok'}"
            style="padding:3px 7px;gap:3px;font-size:6px;" data-a="evo" data-pi="${idx}" data-eid="${id}">
            <img src="${SP}${id}.png" style="width:20px;height:20px;image-rendering:pixelated;border-radius:2px;">
            ${pokeName(id)}
          </button>`).join('')}
      </div>` : '';

    const typeOpts  = GAME_TYPES.map(t => `<option value="${t}"${(p.types||[])[0]===t?' selected':''}>${t}</option>`).join('');
    const type2Opts = '<option value="">— none —</option>' + GAME_TYPES.map(t => `<option value="${t}"${(p.types||[])[1]===t?' selected':''}>${t}</option>`).join('');
    const curMode   = (bs.special||0) >= (bs.atk||0) ? 'SPECIAL attacker' : 'PHYSICAL attacker';

    return `
      ${evoHtml}
      <div class="cm-detail-ttl">NICKNAME</div>
      <div class="cm-row" style="margin-bottom:8px;">
        <input type="text" class="cm-nick" data-pi="${idx}" placeholder="${p.name}" value="${p.nickname||''}" maxlength="20">
        <button class="cm-btn ok" data-a="nick" data-pi="${idx}" style="font-size:6px;">Set</button>
        <button class="cm-btn"   data-a="nick-clear" data-pi="${idx}" style="font-size:6px;">Clear</button>
      </div>

      <div class="cm-detail-ttl">BASE STATS — ${curMode}</div>
      <div class="cm-stat-grid">${statRows}</div>
      <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px;">
        <button class="cm-btn ok"  data-a="applystats"    data-pi="${idx}" style="font-size:6px;">✓ Apply Stats</button>
        <button class="cm-btn yel" data-a="godmode"       data-pi="${idx}" style="font-size:6px;">💥 God Mode (999 all)</button>
        <button class="cm-btn blu" data-a="make-special"  data-pi="${idx}" style="font-size:6px;">→ Force Special Attacker</button>
        <button class="cm-btn blu" data-a="make-physical" data-pi="${idx}" style="font-size:6px;">→ Force Physical Attacker</button>
      </div>

      <div class="cm-detail-ttl">MOVE POWER — per-Pokémon damage override</div>
      <div class="cm-row" style="margin-bottom:8px;">
        <input type="number" class="cm-movepwr" data-pi="${idx}" min="1" max="9999" value="${p._customMovePower||''}" placeholder="e.g. 500">
        <button class="cm-btn ok"  data-a="setmovepwr"   data-pi="${idx}" style="font-size:6px;">Set</button>
        <button class="cm-btn"     data-a="clearmovepwr" data-pi="${idx}" style="font-size:6px;">Reset</button>
        <span style="font-size:6px;color:${p._customMovePower?'#ffe066':'#555'};">${p._customMovePower ? 'Active: ' + p._customMovePower : 'Default'}</span>
      </div>

      <div class="cm-detail-ttl">CUSTOM TYPE — all 18 game types affect damage and STAB</div>
      <div class="cm-row" style="margin-bottom:8px;">
        <label>Type 1</label><select class="cm-type1" data-pi="${idx}">${typeOpts}</select>
        <label>Type 2</label><select class="cm-type2" data-pi="${idx}">${type2Opts}</select>
        <button class="cm-btn ok" data-a="settype" data-pi="${idx}" style="font-size:6px;">Set</button>
      </div>
      <div style="font-size:6px;color:#888;margin-bottom:8px;">Current: ${(p.types||[]).join(' / ')}</div>

      <div class="cm-detail-ttl">HELD ITEM</div>
      <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;">
        ${HELD_ITEMS.map(it => `<button class="cm-btn" style="font-size:5.5px;padding:2px 4px;" data-a="equip" data-pi="${idx}" data-iid="${it.id}" title="${it.name}">${iSpr(it.id)} ${it.name}</button>`).join('')}
        <button class="cm-btn bad" data-a="unequip" data-pi="${idx}" style="font-size:6px;">✕ Remove</button>
      </div>

      <div class="cm-detail-ttl">MOVE TIER (0=weak 1=normal 2=strongest)</div>
      <div style="display:flex;gap:5px;margin-bottom:8px;align-items:center;">
        <button class="cm-btn"     data-a="tier0" data-pi="${idx}" style="font-size:6px;">Tier 0</button>
        <button class="cm-btn ok"  data-a="tier1" data-pi="${idx}" style="font-size:6px;">Tier 1</button>
        <button class="cm-btn yel" data-a="tier2" data-pi="${idx}" style="font-size:6px;">Tier 2</button>
        <span style="font-size:6px;color:#ffe066;">Now: ${p.moveTier ?? 1}</span>
      </div>

      <div style="display:flex;gap:5px;flex-wrap:wrap;">
        <button class="cm-btn yel" data-a="shiny1" data-pi="${idx}" style="font-size:6px;">✨ Shiny ON</button>
        <button class="cm-btn"     data-a="shiny0" data-pi="${idx}" style="font-size:6px;">Remove Shiny</button>
        <button class="cm-btn ok"  data-a="heal"   data-pi="${idx}" style="font-size:6px;">❤ Heal</button>
        <button class="cm-btn bad" data-a="ko"     data-pi="${idx}" style="font-size:6px;">☠ KO</button>
      </div>`;
  }

  // ── BAG RENDER ─────────────────────────────────────────────
  function renderBag() {
    const el = document.getElementById('cm-bag-list');
    if (!el) return;
    const s = S();
    if (!s?.items?.length) { el.innerHTML = '<span style="font-size:7px;color:#555;padding:4px;">Bag is empty.</span>'; return; }
    const g = {};
    s.items.forEach(it => { if (!g[it.id]) g[it.id] = { ...it, count:0 }; g[it.id].count++; });
    el.innerHTML = Object.values(g).map(it =>
      `<div class="cm-bag-row"><span>${iSpr(it.id)} ${it.name||it.id}</span><span style="color:#ffe066;">×${it.count}</span></div>`
    ).join('');
  }

  // ── HoF RENDER ─────────────────────────────────────────────
  function renderHoF() {
    const el = document.getElementById('cm-hof-list');
    if (!el) return;
    let hof = [];
    try { hof = JSON.parse(localStorage.getItem('poke_hall_of_fame') || '[]'); } catch (_) {}
    if (!hof.length) { el.innerHTML = '<span style="font-size:7px;color:#555;">Hall of Fame is empty.</span>'; return; }
    el.innerHTML = '';
    hof.forEach((entry, i) => {
      const div = document.createElement('div');
      div.className = 'cm-hof-entry';
      const sprites = (entry.team||[]).map(p =>
        `<img src="${p.spriteUrl||`${SP}${p.speciesId}.png`}" onerror="this.style.display='none'">`).join('');
      const label = entry.endless
        ? `${STAGE_NAMES[entry.stageNumber] || 'Endless'} Stage ${entry.stageNumber}`
        : `Classic Run #${entry.runNumber}`;
      div.innerHTML = `
        <div class="cm-hof-sprites">${sprites}</div>
        <div class="cm-hof-meta" style="flex:1;">
          <b>${label}</b> &nbsp; ${entry.date || ''}<br>
          ${(entry.team||[]).map(p => `${p.nickname||p.name} Lv${p.level}`).join(', ')}
        </div>
        <button class="cm-btn bad" data-hof-del="${i}" style="font-size:6px;padding:2px 6px;">✕</button>`;
      el.appendChild(div);
    });
    el.querySelectorAll('[data-hof-del]').forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          const idx = +btn.dataset.hofDel;
          const hof2 = JSON.parse(localStorage.getItem('poke_hall_of_fame') || '[]');
          hof2.splice(idx, 1);
          localStorage.setItem('poke_hall_of_fame', JSON.stringify(hof2));
          fb('Entry removed.'); renderHoF();
        } catch (e) { fb(e.message, 'err'); }
      });
    });
  }

  // ── NODE PICKER ─────────────────────────────────────────────
  function renderNodePicker() {
    const el = document.getElementById('cm-node-grid');
    if (!el) return;
    const s = S();
    if (!s?.map?.nodes) { el.innerHTML = '<span style="font-size:7px;color:#555;">No map loaded yet.</span>'; return; }
    const nodes = Object.values(s.map.nodes).sort((a,b) => a.layer!==b.layer ? a.layer-b.layer : (a.col??0)-(b.col??0));
    el.innerHTML = '';
    nodes.forEach(node => {
      const mark = node.visited ? '✓' : node.accessible ? '→' : '·';
      const row  = document.createElement('div'); row.className = 'cm-node-row';
      row.innerHTML = `<span class="cm-node-badge">L${node.layer}</span><span style="flex:1;">${node.type||'battle'} ${node.id}</span><span style="color:${node.visited?'#888':node.accessible?'#ffe066':'#444'}">${mark}</span>`;
      row.addEventListener('click', () => need(s => {
        for (const n of Object.values(s.map.nodes)) {
          if (n.layer < node.layer) { n.visited = true; n.accessible = false; }
          if (n.layer === node.layer) { n.accessible = (n.id === node.id); n.visited = false; }
          if (n.layer > node.layer)  { n.visited = false; n.accessible = false; }
        }
        node.accessible = true; node.visited = false; s.currentNode = node;
        persist(s); closeMenu();
        try { if (typeof showMapScreen === 'function') showMapScreen(); } catch (_) {}
        fb(`Teleported to node ${node.id} (L${node.layer})`);
      }));
      el.appendChild(row);
    });
  }

  // ── BUILD MENU HTML ─────────────────────────────────────────
  function buildMenuHTML() {
    const heldOpts   = HELD_ITEMS.map(it  => `<option value="${it.id}">${it.name}</option>`).join('');
    const usableOpts = USABLE_ITEMS.map(it => `<option value="${it.id}">${it.name}</option>`).join('');
    const allOpts    = `<optgroup label="Held Items">${heldOpts}</optgroup><optgroup label="Usable Items">${usableOpts}</optgroup>`;

    return `
      <div class="cm-hdr">
        <span class="cm-hdr-title">⌨ POKELIKE CHEATS</span>
        <button class="cm-x" id="cm-close">✕</button>
      </div>
      <div class="cm-tabs">
        <button class="cm-tab active" data-tab="team">🐾 Team</button>
        <button class="cm-tab" data-tab="items">🎒 Items</button>
        <button class="cm-tab" data-tab="progress">🗺 Progress</button>
        <button class="cm-tab" data-tab="unlock">🔓 Unlock</button>
        <button class="cm-tab" data-tab="account">👤 Account</button>
        <button class="cm-tab" data-tab="screens">📺 Screens</button>
      </div>

      <!-- ═══ TEAM ═══ -->
      <div class="cm-panel active" id="cm-t-team">
        <div class="cm-sec">
          <div class="cm-sec-ttl">🔎 ADD POKÉMON — Gen 1–9 by name or Pokédex #</div>
          <div class="cm-sec-body col">
            <div class="cm-row">
              <input type="text" id="cm-psearch" placeholder="e.g. Garchomp, 445, pikachu…" autocomplete="off">
              <label>Lv</label>
              <input type="number" id="cm-padd-lv" value="5" min="1" style="width:46px;">
            </div>
            <div id="cm-presults" class="cm-results" style="display:none;"></div>
            <div id="cm-psel-label" style="font-size:7px;color:#ffe066;min-height:12px;"></div>
            <div style="display:flex;gap:6px;">
              <button class="cm-btn ok" id="cm-padd-btn">+ Add to Team</button>
              <button class="cm-btn" id="cm-padd-clear">Clear</button>
            </div>
          </div>
        </div>
        <div class="cm-sec">
          <div class="cm-sec-ttl">🐾 TEAM — click a row to expand options</div>
          <div class="cm-sec-body col">
            <div class="cm-tlist" id="cm-teamlist"></div>
          </div>
          <div class="cm-sec-body">
            <button class="cm-btn ok"  id="cm-heal-all">❤ Full Heal All</button>
            <button class="cm-btn ok"  id="cm-revive-all">↑ Revive Fainted</button>
            <button class="cm-btn"     id="cm-cure-status">✦ Cure Status</button>
            <button class="cm-btn bad" id="cm-ko-all">☠ KO Own Team</button>
          </div>
        </div>
        <div class="cm-sec">
          <div class="cm-sec-ttl">⬆ BULK LEVELS — slider goes to 9999, no level cap enforced</div>
          <div class="cm-sec-body">
            <div class="cm-row" style="width:100%;">
              <label>Set all Lv</label>
              <input type="range" id="cm-lv-slider" min="1" max="9999" value="50">
              <span class="cm-val" id="cm-lv-val">50</span>
              <button class="cm-btn ok" id="cm-lv-apply">Apply</button>
            </div>
            <button class="cm-btn" id="cm-lv-p1">+1</button>
            <button class="cm-btn" id="cm-lv-p5">+5</button>
            <button class="cm-btn" id="cm-lv-p100">+100</button>
            <button class="cm-btn" id="cm-lv-1">→ Lv 1</button>
            <button class="cm-btn" id="cm-lv-100">→ Lv 100</button>
            <button class="cm-btn yel" id="cm-lv-9999">→ Lv 9999 💥</button>
          </div>
        </div>
        <div class="cm-sec">
          <div class="cm-sec-ttl">✨ SHINY — whole team</div>
          <div class="cm-sec-body">
            <button class="cm-btn yel" id="cm-shiny-on">✨ Make All Shiny</button>
            <button class="cm-btn"     id="cm-shiny-off">Remove Shiny</button>
          </div>
        </div>
      </div>

      <!-- ═══ ITEMS ═══ -->
      <div class="cm-panel" id="cm-t-items">
        <div class="cm-sec">
          <div class="cm-sec-ttl">➕ ADD ITEMS TO BAG</div>
          <div class="cm-sec-body col">
            <div class="cm-row"><label>Item</label><select id="cm-item-sel">${allOpts}</select></div>
            <div class="cm-row">
              <label>Quantity</label>
              <input type="number" id="cm-item-qty" value="1" min="1" max="99">
              <button class="cm-btn ok" id="cm-item-add">+ Add</button>
            </div>
            <div class="cm-row">
              <button class="cm-btn ok" id="cm-candy-10">🍬 +10 Rare Candies</button>
              <button class="cm-btn ok" id="cm-candy-99">🍬 +99 Rare Candies</button>
            </div>
          </div>
        </div>
        <div class="cm-sec">
          <div class="cm-sec-ttl">🎯 EQUIP HELD ITEM TO TEAM SLOT</div>
          <div class="cm-sec-body col">
            <div class="cm-row"><label>Item</label><select id="cm-equip-sel">${heldOpts}</select></div>
            <div class="cm-row">
              <label>→ Slot #</label>
              <input type="number" id="cm-equip-slot" min="0" max="5" value="0" style="width:46px;">
              <button class="cm-btn ok"  id="cm-equip-btn">Equip</button>
              <button class="cm-btn bad" id="cm-strip-all">Strip All</button>
            </div>
          </div>
        </div>
        <div class="cm-sec">
          <div class="cm-sec-ttl">🎒 CURRENT BAG</div>
          <div class="cm-sec-body col">
            <div id="cm-bag-list"></div>
            <button class="cm-btn bad" id="cm-bag-clear" style="align-self:flex-start;margin-top:4px;">✕ Clear Bag</button>
          </div>
        </div>
      </div>

      <!-- ═══ PROGRESS ═══ -->
      <div class="cm-panel" id="cm-t-progress">
        <div class="cm-sec">
          <div class="cm-sec-ttl">💾 SNAPSHOT — save a checkpoint to rewind to</div>
          <div class="cm-sec-body">
            <button class="cm-btn ok"  id="cm-snap-save">📸 Take Snapshot</button>
            <button class="cm-btn yel" id="cm-snap-restore">↩ Restore Snapshot</button>
          </div>
        </div>
        <div class="cm-sec">
          <div class="cm-sec-ttl">⏸ FREEZE — blocks all map node clicks</div>
          <div class="cm-sec-note">Sets the game's internal _nodeClickBusy flag. No map interactions until Unfreeze.</div>
          <div class="cm-sec-body">
            <button class="cm-btn bad" id="cm-freeze">⏸ Freeze Game</button>
            <button class="cm-btn ok"  id="cm-unfreeze">▶ Unfreeze</button>
          </div>
        </div>
        <div class="cm-sec">
          <div class="cm-sec-ttl">🏅 BADGES — Current: <span id="cm-badge-val">?</span> / 8</div>
          <div class="cm-sec-body">
            <button class="cm-btn" id="cm-b-p1">+1</button>
            <button class="cm-btn" id="cm-b-m1">-1</button>
            <button class="cm-btn ok"  id="cm-b-all">All 8</button>
            <button class="cm-btn bad" id="cm-b-zero">Reset to 0</button>
          </div>
        </div>
        <div class="cm-sec">
          <div class="cm-sec-ttl">🗺 MAP JUMP — regenerates the map via startMap()</div>
          <div class="cm-sec-body">
            <div class="cm-row" style="width:100%;">
              <select id="cm-map-sel">
                <option value="0">Route 1 — Brock (Rock)</option>
                <option value="1">Mt Moon — Misty (Water)</option>
                <option value="2">Nugget Bridge — Lt. Surge (Electric)</option>
                <option value="3">Rock Tunnel — Erika (Grass)</option>
                <option value="4">Silph Co — Koga (Poison)</option>
                <option value="5">Safari Zone — Sabrina (Psychic)</option>
                <option value="6">Seafoam Island — Blaine (Fire)</option>
                <option value="7">Viridian City — Giovanni (Ground)</option>
                <option value="8">Victory Road — Elite Four</option>
              </select>
              <button class="cm-btn ok" id="cm-map-go">Go</button>
            </div>
          </div>
        </div>
        <div class="cm-sec">
          <div class="cm-sec-ttl">↩ UNDO LAST NODE — rewind the most recent map event</div>
          <div class="cm-sec-note">Marks the highest visited layer as unvisited and accessible again. All nodes beyond it are locked. Useful for undoing a bad catch, trade, or battle result.</div>
          <div class="cm-sec-body">
            <button class="cm-btn yel" id="cm-go-back">↩ Undo Last Node</button>
            <button class="cm-btn"     id="cm-show-map">🗺 Show Map Screen</button>
          </div>
        </div>
        <div class="cm-sec">
          <div class="cm-sec-ttl">📍 NODE TELEPORT — jump to any specific map node</div>
          <div class="cm-sec-body col">
            <button class="cm-btn" id="cm-node-refresh">🔄 Load Node List</button>
            <div class="cm-node-grid" id="cm-node-grid"></div>
          </div>
        </div>
        <div class="cm-sec">
          <div class="cm-sec-ttl">⚙ RUN OPTIONS</div>
          <div class="cm-sec-body">
            <button class="cm-btn ok"  id="cm-team-6">Team Limit → 6</button>
            <button class="cm-btn"     id="cm-toggle-nuzlocke">Toggle Nuzlocke</button>
            <button class="cm-btn ok"  id="cm-force-save">💾 Save Run</button>
            <button class="cm-btn bad" id="cm-clear-run">⚠ Clear Run</button>
          </div>
        </div>
      </div>

      <!-- ═══ UNLOCK ═══ -->
      <div class="cm-panel" id="cm-t-unlock">
        <div class="cm-sec">
          <div class="cm-sec-ttl">🗺 ENDLESS BATTLE TOWER — unlock all 5 regions</div>
          <div class="cm-sec-note">
            The game unlocks stages by reading your Hall of Fame. Each HoF entry with endless=true and a stageNumber unlocks the next stage.
            This injects one completed entry per stage (Kanto→Johto→Hoenn→Sinnoh→Unova). Refresh to see them in the stage select.
          </div>
          <div class="cm-sec-body">
            <button class="cm-btn ok"  id="cm-unlock-all-stages">Unlock All 5 Regions (Kanto→Unova)</button>
            <button class="cm-btn blu" id="cm-unlock-johto">Unlock Johto only</button>
            <button class="cm-btn blu" id="cm-unlock-hoenn">Unlock up to Hoenn</button>
            <button class="cm-btn blu" id="cm-unlock-sinnoh">Unlock up to Sinnoh</button>
            <button class="cm-btn bad" id="cm-reset-stages">Reset stage unlocks</button>
          </div>
        </div>
        <div class="cm-sec">
          <div class="cm-sec-ttl">🏛 HALL OF FAME — view, edit, inject entries</div>
          <div class="cm-sec-note">
            Inject uses your current team if you're in a run. The injected entry appears in the HoF viewer and unlocks the Battle Tower. To use a specific team in Battle Tower, inject an entry with that team here, then start an Endless run — the game picks your last HoF team as a starting suggestion.
          </div>
          <div class="cm-sec-body">
            <button class="cm-btn ok"  id="cm-hof-inject">Inject Entry (uses current team)</button>
            <button class="cm-btn yel" id="cm-hof-refresh">🔄 View / Edit HoF</button>
            <button class="cm-btn bad" id="cm-hof-reset">Reset HoF</button>
          </div>
          <div id="cm-hof-list" style="padding:6px 9px;display:flex;flex-direction:column;gap:5px;"></div>
        </div>
        <div class="cm-sec">
          <div class="cm-sec-ttl">🏆 ACHIEVEMENTS — ${ALL_ACH_IDS.length} total</div>
          <div class="cm-sec-body">
            <button class="cm-btn ok"  id="cm-ach-all">Unlock ALL (${ALL_ACH_IDS.length})</button>
            <button class="cm-btn blu" id="cm-ach-gyms">Gym badges only + set 8 badges</button>
            <button class="cm-btn bad" id="cm-ach-reset">Reset All</button>
          </div>
        </div>
        <div class="cm-sec">
          <div class="cm-sec-ttl">📖 POKÉDEX — confirmed pool is Gen 1–5 (IDs 1–649)</div>
          <div class="cm-sec-body">
            <button class="cm-btn ok"  id="cm-dex-gen1">Catch Gen 1 (1–151)</button>
            <button class="cm-btn ok"  id="cm-dex-all">Catch All (1–649)</button>
            <button class="cm-btn yel" id="cm-shiny-gen1">✨ Shiny Gen 1</button>
            <button class="cm-btn yel" id="cm-shiny-all">✨ Shiny All (1–649)</button>
            <button class="cm-btn bad" id="cm-dex-reset">Reset Pokédex</button>
          </div>
        </div>
        <div class="cm-sec">
          <div class="cm-sec-ttl">📈 PERSISTENT STAT BUFFS — keyed by evo-line root ID</div>
          <div class="cm-sec-note">
            The game stores buffs under the base-form species ID (evo-line root), not the current Pokémon's ID. E.g. Charizard (6) is stored under Charmander (4). "Max All" fills every root ID correctly. "Max Team" only buffs your current team's roots. Each stat can go up to 10/10, giving +100% to that stat.
          </div>
          <div class="cm-sec-body">
            <button class="cm-btn ok"  id="cm-buffs-max">Max All (every evo line)</button>
            <button class="cm-btn blu" id="cm-buffs-team">Max Current Team Only</button>
            <button class="cm-btn bad" id="cm-buffs-clear">Clear All Buffs</button>
          </div>
        </div>
        <div class="cm-sec">
          <div class="cm-sec-ttl">🎮 WIN COUNTER (poke_elite_wins)</div>
          <div class="cm-sec-body">
            <div class="cm-row">
              <label>Set count</label>
              <input type="number" id="cm-wins-val" value="10" min="0">
              <button class="cm-btn ok" id="cm-wins-set">Set</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ ACCOUNT ═══ -->
      <div class="cm-panel" id="cm-t-account">
        <div class="cm-sec">
          <div class="cm-sec-ttl">👤 TRAINER GENDER — changes in-battle sprite</div>
          <div class="cm-sec-note">Sets poke_trainer and state.trainer. Takes effect immediately in any new battle.</div>
          <div class="cm-sec-body">
            <button class="cm-btn blu" id="cm-gender-boy">Set to Boy (Red)</button>
            <button class="cm-btn blu" id="cm-gender-girl">Set to Girl (Dawn)</button>
            <span id="cm-gender-cur" style="font-size:7px;color:#ffe066;margin-left:6px;"></span>
          </div>
        </div>
        <div class="cm-sec">
          <div class="cm-sec-ttl">📖 TUTORIAL — show or hide</div>
          <div class="cm-sec-note">Removes poke_tutorial_seen and calls showTutorialOverlay() so the tutorial appears again on the next map visit.</div>
          <div class="cm-sec-body">
            <button class="cm-btn blu" id="cm-show-tutorial">Show Tutorial Again</button>
            <button class="cm-btn"     id="cm-hide-tutorial">Mark Tutorial Seen</button>
          </div>
        </div>
        <div class="cm-sec">
          <div class="cm-sec-ttl">🏠 NAVIGATION</div>
          <div class="cm-sec-body">
            <button class="cm-btn blu" id="cm-go-main-menu">Go to Main Menu</button>
            <button class="cm-btn blu" id="cm-go-title">Go to Title Screen</button>
            <button class="cm-btn yel" id="cm-go-stage-select">Open Stage Select (Endless)</button>
          </div>
        </div>
        <div class="cm-sec">
          <div class="cm-sec-ttl">⚙ GAME SETTINGS (poke_settings)</div>
          <div class="cm-sec-note">These match the in-game settings toggles.</div>
          <div class="cm-sec-body">
            <button class="cm-btn blu" id="cm-set-autoskip">Toggle Auto-Skip Battles</button>
            <button class="cm-btn blu" id="cm-set-autoskipall">Toggle Auto-Skip All Battles</button>
            <button class="cm-btn blu" id="cm-set-autoskipevolve">Toggle Auto-Skip Evolve</button>
            <span id="cm-settings-cur" style="font-size:6px;color:#888;width:100%;margin-top:3px;"></span>
          </div>
        </div>
        <div class="cm-sec">
          <div class="cm-sec-ttl">🐛 DEBUG</div>
          <div class="cm-sec-body">
            <button class="cm-btn" id="cm-log-state">Log state{}</button>
            <button class="cm-btn" id="cm-log-team">Log team[]</button>
            <button class="cm-btn" id="cm-log-items">Log items[]</button>
            <button class="cm-btn" id="cm-log-dex">Log Pokédex</button>
            <button class="cm-btn" id="cm-log-hof">Log HoF</button>
          </div>
        </div>
      </div>

      <!-- ═══ SCREENS ═══ -->
      <div class="cm-panel" id="cm-t-screens">
        <div class="cm-sec">
          <div class="cm-sec-ttl">📺 NAVIGATE TO SCREEN — uses showScreen(id)</div>
          <div class="cm-sec-body">
            <button class="cm-btn blu" data-screen="map-screen">🗺 Map</button>
            <button class="cm-btn blu" data-screen="catch-screen">🎣 Catch</button>
            <button class="cm-btn blu" data-screen="item-screen">✦ Item</button>
            <button class="cm-btn blu" data-screen="battle-screen">⚔ Battle</button>
            <button class="cm-btn blu" data-screen="swap-screen">🔄 Swap</button>
            <button class="cm-btn blu" data-screen="trade-screen">🤝 Trade</button>
            <button class="cm-btn blu" data-screen="stat-buff-screen">📈 Stat Buff</button>
            <button class="cm-btn blu" data-screen="endless-stage-select">🗺 Stage Select</button>
            <button class="cm-btn blu" data-screen="title-screen">🏠 Title</button>
            <button class="cm-btn blu" data-screen="starter-screen">🌟 Starter</button>
            <button class="cm-btn blu" data-screen="trainer-screen">🧢 Trainer</button>
            <button class="cm-btn yel" data-screen="win-screen">🏆 Win Screen</button>
            <button class="cm-btn bad" data-screen="gameover-screen">💀 Game Over</button>
          </div>
        </div>
        <div class="cm-sec">
          <div class="cm-sec-ttl">🔁 CALL GAME FUNCTIONS</div>
          <div class="cm-sec-body">
            <button class="cm-btn" id="cm-fn-mapscreen">showMapScreen()</button>
            <button class="cm-btn" id="cm-fn-gameover">showGameOver()</button>
            <button class="cm-btn yel" id="cm-fn-winscreen">showWinScreen()</button>
            <button class="cm-btn" id="cm-fn-skip">Click Skip Button</button>
            <button class="cm-btn" id="cm-fn-dex">openPokedexModal()</button>
            <button class="cm-btn" id="cm-fn-ach">openAchievementsModal()</button>
            <button class="cm-btn" id="cm-fn-hof">openHallOfFameModal()</button>
          </div>
        </div>
      </div>

      <div id="cm-feedback"></div>
    `;
  }

  // ── STAGE UNLOCK HELPERS ───────────────────────────────────
  // Stage unlock is derived entirely from HoF entries:
  // unlocked count = max stageNumber from entries with endless=true, then +1
  // So to unlock stage N, inject an endless HoF entry with stageNumber = N-1
  function injectStageEntry(stageNum, starterSpeciesId) {
    // Minimal valid team entry that satisfies getHallOfFame() checks
    const hof = JSON.parse(localStorage.getItem('poke_hall_of_fame') || '[]');
    // Don't duplicate — only inject if no entry exists for this stage
    if (hof.some(e => e.endless && e.stageNumber === stageNum)) return;
    hof.push({
      savedAt: Date.now() - (5-stageNum)*1000, // slightly in the past to keep order
      runNumber: hof.length + 1,
      hardMode: false,
      endless: true,
      stageNumber: stageNum,
      starterSpeciesId: starterSpeciesId || 4,
      date: new Date().toLocaleDateString(),
      team: [{
        speciesId: 6, name: 'Charizard', nickname: null, level: 60,
        types: ['Fire','Flying'], spriteUrl: `${SP}6.png`, isShiny: false, heldItem: null,
      }],
    });
    localStorage.setItem('poke_hall_of_fame', JSON.stringify(hof));
  }

  // ── WIRE EVENTS ────────────────────────────────────────────
  function wire(ov) {

    // Tabs
    ov.querySelectorAll('.cm-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        ov.querySelectorAll('.cm-tab').forEach(t => t.classList.remove('active'));
        ov.querySelectorAll('.cm-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        ov.querySelector(`#cm-t-${tab.dataset.tab}`).classList.add('active');
        if (tab.dataset.tab === 'team')    { _selIdx = null; renderTeam('cm-teamlist'); }
        if (tab.dataset.tab === 'items')   renderBag();
        if (tab.dataset.tab === 'progress') { const bc=document.getElementById('cm-badge-val'); const s=S(); if(bc&&s) bc.textContent=s.badges??0; }
        if (tab.dataset.tab === 'account') updateGenderDisplay();
      });
    });

    ov.querySelector('#cm-close').addEventListener('click', closeMenu);

    // ── TEAM DELEGATION ──
    const teamEl = document.getElementById('cm-teamlist');
    teamEl.addEventListener('click', e => {
      const btn = e.target.closest('[data-a]');
      if (btn) {
        e.stopPropagation();
        const a = btn.dataset.a, pi = +btn.dataset.pi;
        need(s => {
          const p = s.team[pi]; if (!p) return;
          if      (a === 'heal')   { p.currentHp = p.maxHp; persist(s); renderTeam('cm-teamlist'); fb(`${p.name} healed!`); }
          else if (a === 'ko')     { p.currentHp = 0;       persist(s); renderTeam('cm-teamlist'); fb(`${p.name} KO'd.`, 'warn'); }
          else if (a === 'nick') {
            const inp = ov.querySelector(`.cm-nick[data-pi="${pi}"]`);
            p.nickname = inp?.value.trim() || undefined;
            persist(s); renderTeam('cm-teamlist'); fb(p.nickname ? `Nickname → "${p.nickname}"` : 'Nickname cleared.');
          }
          else if (a === 'nick-clear') {
            p.nickname = undefined;
            const inp = ov.querySelector(`.cm-nick[data-pi="${pi}"]`); if (inp) inp.value = '';
            persist(s); renderTeam('cm-teamlist'); fb('Nickname cleared.');
          }
          else if (a === 'applystats') {
            ov.querySelectorAll(`.cm-si[data-pi="${pi}"]`).forEach(inp => {
              if (!p.baseStats) p.baseStats = {};
              const v = +inp.value; if (v > 0) p.baseStats[inp.dataset.st] = v;
            });
            setLvl(p, p.level); persist(s); renderTeam('cm-teamlist'); fb(`Stats applied to ${p.name}!`);
          }
          else if (a === 'godmode') {
            if (!p.baseStats) p.baseStats = {};
            Object.assign(p.baseStats, {hp:255, atk:999, special:999, speed:999, def:999, spdef:999});
            setLvl(p, p.level); persist(s); renderTeam('cm-teamlist'); fb(`${p.name} — God Mode!`);
          }
          else if (a === 'make-special') {
            if (!p.baseStats) p.baseStats = {};
            if ((p.baseStats.special||0) < (p.baseStats.atk||0)) {
              [p.baseStats.atk, p.baseStats.special] = [p.baseStats.special, p.baseStats.atk];
              [p.baseStats.def, p.baseStats.spdef]   = [p.baseStats.spdef, p.baseStats.def];
            }
            setLvl(p, p.level); persist(s); renderTeam('cm-teamlist'); fb(`${p.name} → Special attacker`);
          }
          else if (a === 'make-physical') {
            if (!p.baseStats) p.baseStats = {};
            if ((p.baseStats.special||0) >= (p.baseStats.atk||0)) {
              [p.baseStats.atk, p.baseStats.special] = [p.baseStats.special, p.baseStats.atk];
              [p.baseStats.def, p.baseStats.spdef]   = [p.baseStats.spdef, p.baseStats.def];
            }
            setLvl(p, p.level); persist(s); renderTeam('cm-teamlist'); fb(`${p.name} → Physical attacker`);
          }
          else if (a === 'setmovepwr') {
            const inp = ov.querySelector(`.cm-movepwr[data-pi="${pi}"]`);
            const val = parseInt(inp?.value, 10);
            if (!val || val < 1) { fb('Enter a valid power value.', 'err'); return; }
            p._customMovePower = val; ensureMovePowerPatch();
            persist(s); renderTeam('cm-teamlist'); fb(`${p.name} move power → ${val}`);
          }
          else if (a === 'clearmovepwr') {
            delete p._customMovePower; persist(s); renderTeam('cm-teamlist'); fb('Move power reset.');
          }
          else if (a === 'settype') {
            const t1 = ov.querySelector(`.cm-type1[data-pi="${pi}"]`)?.value;
            const t2 = ov.querySelector(`.cm-type2[data-pi="${pi}"]`)?.value;
            p.types = t2 ? [t1, t2] : [t1];
            persist(s); renderTeam('cm-teamlist'); fb(`${p.name} → ${p.types.join(' / ')}`);
          }
          else if (a === 'evo') {
            const tid = +btn.dataset.eid;
            (async () => {
              try {
                const sp = await fetchPokemonById(tid);
                if (!sp) { fb(`Could not load #${tid}`, 'err'); return; }
                const lvl = p.level, shiny = p.isShiny;
                Object.assign(p, sp); p.speciesId = tid; p.level = lvl; p.isShiny = shiny;
                p.spriteUrl = shiny ? `${SPS}${tid}.png` : `${SP}${tid}.png`;
                setLvl(p, lvl); p.currentHp = Math.min(p.currentHp, p.maxHp);
                persist(s); renderTeam('cm-teamlist'); fb(`Evolved to ${sp.name}!`);
              } catch (err) { fb(err.message, 'err'); }
            })();
          }
          else if (a === 'equip') {
            const iid = btn.dataset.iid, def = HELD_ITEMS.find(it => it.id === iid);
            const item = realItem(iid) || {id: iid, name: def?.name || iid, usable: false};
            if (p.heldItem) { if (!s.items) s.items = []; s.items.push(p.heldItem); }
            p.heldItem = {...item}; persist(s); renderTeam('cm-teamlist'); fb(`${item.name} equipped to ${p.name}!`);
          }
          else if (a === 'unequip') {
            if (p.heldItem) { if (!s.items) s.items = []; s.items.push(p.heldItem); p.heldItem = null; }
            persist(s); renderTeam('cm-teamlist'); fb('Item removed.');
          }
          else if (a.startsWith('tier')) {
            p.moveTier = +a.slice(4); persist(s); renderTeam('cm-teamlist'); fb(`Move tier → ${p.moveTier}`);
          }
          else if (a === 'shiny1') { p.isShiny = true;  p.spriteUrl = `${SPS}${p.speciesId}.png`; persist(s); renderTeam('cm-teamlist'); fb(`${p.name} ✨`); }
          else if (a === 'shiny0') { p.isShiny = false; p.spriteUrl = `${SP}${p.speciesId}.png`;  persist(s); renderTeam('cm-teamlist'); fb('Shiny removed.'); }
        });
        return;
      }
      const row = e.target.closest('.cm-prow');
      if (row) { _selIdx = _selIdx === +row.dataset.idx ? null : +row.dataset.idx; renderTeam('cm-teamlist'); }
    });

    // ── POKEMON SEARCH ──
    let _sel = null;
    const psearch  = document.getElementById('cm-psearch');
    const presults = document.getElementById('cm-presults');
    const pselLbl  = document.getElementById('cm-psel-label');

    psearch.addEventListener('input', () => {
      const q = psearch.value.trim().toLowerCase();
      presults.style.display = 'none'; presults.innerHTML = ''; _sel = null; pselLbl.textContent = '';
      if (!q) return;
      const asNum = parseInt(q, 10);
      let matches = [];
      if (!isNaN(asNum) && asNum >= 1) {
        matches = [{name: pokeName(asNum), speciesId: asNum}];
      } else {
        for (let id = 1; id <= 151 && matches.length < 12; id++) {
          if (GEN1[id-1].toLowerCase().includes(q)) matches.push({name: GEN1[id-1], speciesId: id});
        }
        for (const [id, name] of Object.entries(EXTRA_NAMES)) {
          if (matches.length >= 12) break;
          if (name.toLowerCase().includes(q)) matches.push({name, speciesId: +id});
        }
      }
      if (!matches.length) {
        presults.innerHTML = '<div style="padding:6px 8px;font-size:7px;color:#666;">No results.</div>';
        presults.style.display = 'block'; return;
      }
      presults.style.display = 'block';
      matches.forEach(m => {
        const div = document.createElement('div'); div.className = 'cm-result';
        div.innerHTML = `<img src="${SP}${m.speciesId}.png" onerror="this.style.display='none'">${m.name}<span style="color:#888;margin-left:auto;">#${m.speciesId}</span>`;
        div.addEventListener('click', () => { _sel = m; pselLbl.textContent = `✓ ${m.name} (#${m.speciesId})`; presults.style.display = 'none'; psearch.value = m.name; });
        presults.appendChild(div);
      });
    });

    document.getElementById('cm-padd-btn').addEventListener('click', () => {
      if (!_sel) { fb('Search and select a Pokémon first!', 'err'); return; }
      need(async s => {
        if (s.team.length >= 6) { fb('Team is full (max 6)!', 'err'); return; }
        const lvl = Math.max(1, +(document.getElementById('cm-padd-lv').value) || 5);
        try {
          const sp = await fetchPokemonById(_sel.speciesId);
          if (!sp) { fb(`Could not load #${_sel.speciesId} from PokeAPI`, 'err'); return; }
          const sid = sp.id ?? sp.speciesId ?? _sel.speciesId;
          const raw = typeof calcHp === 'function' ? calcHp(sp.baseStats.hp, lvl) : (Math.floor(sp.baseStats.hp * lvl / 50) + lvl + 10);
          const inst = {
            name: sp.name, speciesId: sid, level: lvl, currentHp: raw, maxHp: raw,
            baseStats: sp.baseStats, types: sp.types, spriteUrl: `${SP}${sid}.png`,
            isShiny: false, status: null, heldItem: null, moveTier: 1, nickname: undefined,
            statBuffs: {hp:0, atk:0, def:0, speed:0, special:0, spdef:0},
          };
          if (!s.team) s.team = [];
          s.team.push(inst);
          if (s.team.length > s.maxTeamSize) s.maxTeamSize = s.team.length;
          try { markPokedexCaught(sid, inst.name, inst.types, inst.spriteUrl); } catch (_) {}
          persist(s); renderTeam('cm-teamlist');
          fb(`${sp.name} (#${sid}) added at Lv ${lvl}!`);
          _sel = null; pselLbl.textContent = ''; psearch.value = ''; presults.style.display = 'none';
        } catch (err) { fb(err.message, 'err'); }
      });
    });
    document.getElementById('cm-padd-clear').addEventListener('click', () => {
      psearch.value = ''; presults.style.display = 'none'; presults.innerHTML = ''; _sel = null; pselLbl.textContent = '';
    });

    // Team bulk actions
    document.getElementById('cm-heal-all').addEventListener('click',    () => need(s => { s.team.forEach(p => p.currentHp = p.maxHp); persist(s); renderTeam('cm-teamlist'); fb('All healed!'); }));
    document.getElementById('cm-revive-all').addEventListener('click',  () => need(s => { s.team.forEach(p => { if (p.currentHp <= 0) p.currentHp = Math.floor(p.maxHp/2); }); persist(s); renderTeam('cm-teamlist'); fb('Fainted revived!'); }));
    document.getElementById('cm-cure-status').addEventListener('click', () => need(s => { s.team.forEach(p => p.status = null); persist(s); fb('Status cleared!'); }));
    document.getElementById('cm-ko-all').addEventListener('click', () => {
      if (!confirm('KO your entire team?')) return;
      need(s => { s.team.forEach(p => p.currentHp = 0); persist(s); renderTeam('cm-teamlist'); fb("Team KO'd.", 'warn'); });
    });

    // Levels
    const slEl = document.getElementById('cm-lv-slider');
    const slV  = document.getElementById('cm-lv-val');
    slEl.addEventListener('input', () => slV.textContent = slEl.value);
    document.getElementById('cm-lv-apply').addEventListener('click', () => need(s => { const l = +slEl.value; s.team.forEach(p => setLvl(p, l)); persist(s); renderTeam('cm-teamlist'); fb(`All → Lv ${l}!`); }));
    document.getElementById('cm-lv-p1'  ).addEventListener('click', () => need(s => { s.team.forEach(p => setLvl(p, p.level+1));   persist(s); renderTeam('cm-teamlist'); fb('+1!'); }));
    document.getElementById('cm-lv-p5'  ).addEventListener('click', () => need(s => { s.team.forEach(p => setLvl(p, p.level+5));   persist(s); renderTeam('cm-teamlist'); fb('+5!'); }));
    document.getElementById('cm-lv-p100').addEventListener('click', () => need(s => { s.team.forEach(p => setLvl(p, p.level+100)); persist(s); renderTeam('cm-teamlist'); fb('+100!'); }));
    document.getElementById('cm-lv-1'   ).addEventListener('click', () => need(s => { s.team.forEach(p => setLvl(p, 1));           persist(s); renderTeam('cm-teamlist'); fb('All → Lv 1!'); }));
    document.getElementById('cm-lv-100' ).addEventListener('click', () => need(s => { s.team.forEach(p => setLvl(p, 100));         persist(s); renderTeam('cm-teamlist'); fb('All → Lv 100!'); }));
    document.getElementById('cm-lv-9999').addEventListener('click', () => need(s => { s.team.forEach(p => setLvl(p, 9999));        persist(s); renderTeam('cm-teamlist'); fb('All → Lv 9999!'); }));

    // Shiny
    document.getElementById('cm-shiny-on' ).addEventListener('click', () => need(s => { s.team.forEach(p => { p.isShiny=true;  p.spriteUrl=`${SPS}${p.speciesId}.png`; }); persist(s); renderTeam('cm-teamlist'); fb('All shiny ✨'); }));
    document.getElementById('cm-shiny-off').addEventListener('click', () => need(s => { s.team.forEach(p => { p.isShiny=false; p.spriteUrl=`${SP}${p.speciesId}.png`;  }); persist(s); renderTeam('cm-teamlist'); fb('Shiny removed.'); }));

    // ── ITEMS ──
    document.getElementById('cm-item-add').addEventListener('click', () => need(s => {
      const id  = document.getElementById('cm-item-sel').value;
      const qty = Math.max(1, +document.getElementById('cm-item-qty').value || 1);
      const def = [...HELD_ITEMS,...USABLE_ITEMS].find(it => it.id === id);
      const item = realItem(id) || {id, name: def?.name || id, usable: !!USABLE_ITEMS.find(u => u.id === id)};
      if (!s.items) s.items = [];
      for (let i = 0; i < qty; i++) s.items.push({...item});
      persist(s); renderBag(); fb(`+${qty}× ${item.name}!`);
    }));
    const addCandies = n => need(s => {
      if (!s.items) s.items = [];
      const rc = realItem('rare_candy') || {id:'rare_candy', name:'Rare Candy', usable:true};
      for (let i = 0; i < n; i++) s.items.push({...rc});
      persist(s); renderBag(); fb(`+${n} Rare Candies!`);
    });
    document.getElementById('cm-candy-10').addEventListener('click', () => addCandies(10));
    document.getElementById('cm-candy-99').addEventListener('click', () => addCandies(99));
    document.getElementById('cm-equip-btn').addEventListener('click', () => need(s => {
      const id   = document.getElementById('cm-equip-sel').value;
      const slot = +document.getElementById('cm-equip-slot').value;
      if (!s.team[slot]) { fb('No Pokémon in that slot.', 'err'); return; }
      const def  = HELD_ITEMS.find(it => it.id === id);
      const item = realItem(id) || {id, name: def?.name || id, usable: false};
      if (s.team[slot].heldItem) { if (!s.items) s.items = []; s.items.push(s.team[slot].heldItem); }
      s.team[slot].heldItem = {...item};
      persist(s); renderBag(); renderTeam('cm-teamlist'); fb(`${item.name} → slot ${slot}!`);
    }));
    document.getElementById('cm-strip-all').addEventListener('click', () => need(s => {
      s.team.forEach(p => { if (p.heldItem) { if (!s.items) s.items=[]; s.items.push(p.heldItem); p.heldItem = null; } });
      persist(s); renderBag(); renderTeam('cm-teamlist'); fb('All held items stripped to bag.');
    }));
    document.getElementById('cm-bag-clear').addEventListener('click', () => {
      if (!confirm('Clear entire bag?')) return;
      need(s => { s.items = []; persist(s); renderBag(); fb('Bag cleared.'); });
    });

    // ── PROGRESS ──
    document.getElementById('cm-snap-save').addEventListener('click',    takeSnapshot);
    document.getElementById('cm-snap-restore').addEventListener('click', restoreSnapshot);
    document.getElementById('cm-freeze').addEventListener('click',   freezeGame);
    document.getElementById('cm-unfreeze').addEventListener('click', unfreezeGame);

    const updBadge = () => { const bc=document.getElementById('cm-badge-val'); const s=S(); if(bc&&s) bc.textContent=s.badges??0; };
    document.getElementById('cm-b-p1'  ).addEventListener('click', () => need(s => { s.badges=Math.min(8,(s.badges||0)+1); persist(s); updBadge(); fb(`Badges: ${s.badges}`); }));
    document.getElementById('cm-b-m1'  ).addEventListener('click', () => need(s => { s.badges=Math.max(0,(s.badges||0)-1); persist(s); updBadge(); fb(`Badges: ${s.badges}`); }));
    document.getElementById('cm-b-all' ).addEventListener('click', () => need(s => { s.badges=8; persist(s); updBadge(); fb('All 8 badges!'); }));
    document.getElementById('cm-b-zero').addEventListener('click', () => need(s => { s.badges=0; persist(s); updBadge(); fb('Badges reset.'); }));

    document.getElementById('cm-map-go').addEventListener('click', () => need(s => {
      const idx = +document.getElementById('cm-map-sel').value;
      try {
        if (typeof startMap === 'function') { startMap(idx); closeMenu(); fb(`Jumped to map ${idx+1}!`); }
        else { s.currentMap = idx; persist(s); fb(`currentMap set to ${idx}. Use Show Map Screen to apply.`, 'warn'); }
      } catch (e) { fb(e.message, 'err'); }
    }));

    document.getElementById('cm-go-back').addEventListener('click', () => need(s => {
      if (!s.map?.nodes) { fb('No map loaded.', 'err'); return; }
      const nodes   = Object.values(s.map.nodes);
      const visited = nodes.filter(n => n.visited).sort((a, b) => b.layer - a.layer);
      if (!visited.length) { fb('No visited nodes — already at start.', 'err'); return; }
      const target = visited[0];
      nodes.forEach(n => {
        if (n.layer === target.layer) { n.visited = false; n.accessible = true; }
        if (n.layer >  target.layer) { n.visited = false; n.accessible = false; }
      });
      s.currentNode = target;
      persist(s); closeMenu();
      try { if (typeof showMapScreen === 'function') showMapScreen(); } catch (_) {}
      fb(`Rewound to layer ${target.layer} — choose your node again!`);
    }));

    document.getElementById('cm-show-map').addEventListener('click', () => {
      try { typeof showMapScreen === 'function' ? showMapScreen() : showScreen('map-screen'); closeMenu(); } catch (e) { fb(e.message, 'err'); }
    });
    document.getElementById('cm-node-refresh').addEventListener('click', renderNodePicker);
    document.getElementById('cm-team-6').addEventListener('click', () => need(s => { s.maxTeamSize=6; persist(s); fb('Team limit → 6!'); }));
    document.getElementById('cm-toggle-nuzlocke').addEventListener('click', () => need(s => { s.nuzlockeMode=!s.nuzlockeMode; persist(s); fb(`Nuzlocke: ${s.nuzlockeMode?'ON':'OFF'}`); }));
    document.getElementById('cm-force-save').addEventListener('click', () => { try { saveRun(); fb('Run saved!'); } catch (e) { fb(e.message, 'err'); } });
    document.getElementById('cm-clear-run').addEventListener('click', () => {
      if (!confirm('Clear saved run? Cannot be undone.')) return;
      try { typeof clearSavedRun === 'function' ? clearSavedRun() : localStorage.removeItem('poke_current_run'); fb('Run cleared! Refresh to restart.'); }
      catch (e) { fb(e.message, 'err'); }
    });

    // ── UNLOCK ──

    // Stage unlock — injects HoF entries up to the chosen stage
    function unlockUpTo(maxStage) {
      // To unlock stage N, we need a completed entry for stages 1 through N-1
      // (getUnlockedStageCount returns maxCompleted+1, so having stageNumber=N-1 gives unlocked=N)
      for (let s = 1; s < maxStage; s++) injectStageEntry(s, [4,155,255,387,495][s-1] || 4);
      localStorage.setItem('poke_hall_of_fame', localStorage.getItem('poke_hall_of_fame')); // trigger sync
      fb(`Stages unlocked up to ${STAGE_NAMES[maxStage] || 'Stage '+maxStage}! Refresh page to see them.`, 'warn');
    }
    document.getElementById('cm-unlock-all-stages').addEventListener('click', () => unlockUpTo(5));
    document.getElementById('cm-unlock-johto'     ).addEventListener('click', () => unlockUpTo(2));
    document.getElementById('cm-unlock-hoenn'     ).addEventListener('click', () => unlockUpTo(3));
    document.getElementById('cm-unlock-sinnoh'    ).addEventListener('click', () => unlockUpTo(4));
    document.getElementById('cm-reset-stages').addEventListener('click', () => {
      if (!confirm('This will remove all endless HoF entries, resetting stage unlocks. Normal classic entries are kept. Continue?')) return;
      try {
        const hof = JSON.parse(localStorage.getItem('poke_hall_of_fame') || '[]');
        const kept = hof.filter(e => !e.endless);
        localStorage.setItem('poke_hall_of_fame', JSON.stringify(kept));
        fb('Endless stage entries removed. Only Kanto is now accessible.');
      } catch (e) { fb(e.message, 'err'); }
    });

    // HoF
    document.getElementById('cm-hof-inject').addEventListener('click', () => {
      const s = S();
      const rawTeam = (s?.team || []).slice(0, 6);
      const snap = rawTeam.length ? rawTeam.map(p => ({speciesId:p.speciesId, name:p.name, nickname:p.nickname||null, level:p.level, types:p.types, spriteUrl:p.spriteUrl, isShiny:!!p.isShiny, heldItem:p.heldItem||null}))
        : [{speciesId:6, name:'Charizard', nickname:null, level:60, types:['Fire','Flying'], spriteUrl:`${SP}6.png`, isShiny:false, heldItem:null}];
      try {
        const hof = JSON.parse(localStorage.getItem('poke_hall_of_fame') || '[]');
        hof.push({savedAt:Date.now(), runNumber:hof.length+1, hardMode:false, endless:false, stageNumber:null, starterSpeciesId:s?.starterSpeciesId||4, date:new Date().toLocaleDateString(), team:snap});
        localStorage.setItem('poke_hall_of_fame', JSON.stringify(hof));
        fb('HoF entry injected! Click View/Edit HoF to see it.'); renderHoF();
      } catch (e) { fb(e.message, 'err'); }
    });
    document.getElementById('cm-hof-refresh').addEventListener('click', renderHoF);
    document.getElementById('cm-hof-reset').addEventListener('click', () => {
      if (!confirm('Reset entire Hall of Fame? This will also lock all Battle Tower regions.')) return;
      localStorage.removeItem('poke_hall_of_fame');
      localStorage.removeItem('poke_used_starters');
      document.getElementById('cm-hof-list').innerHTML = '';
      fb('Hall of Fame reset.');
    });

    // Achievements
    function doAchs(ids) {
      const existing = new Set(JSON.parse(localStorage.getItem('poke_achievements') || '[]'));
      ids.forEach(id => existing.add(id));
      localStorage.setItem('poke_achievements', JSON.stringify([...existing]));
      if (typeof unlockAchievement === 'function') ids.forEach(id => { try { unlockAchievement(id); } catch (_) {} });
    }
    document.getElementById('cm-ach-all'  ).addEventListener('click', () => { doAchs(ALL_ACH_IDS); fb(`All ${ALL_ACH_IDS.length} achievements unlocked!`); });
    document.getElementById('cm-ach-gyms' ).addEventListener('click', () => {
      const gymIds = ALL_ACH_IDS.filter(id => id.startsWith('gym_'));
      doAchs(gymIds); need(s => { s.badges=8; persist(s); updBadge(); });
      fb('Gym achievements + all 8 badges set!');
    });
    document.getElementById('cm-ach-reset').addEventListener('click', () => {
      if (!confirm('Reset all achievements?')) return;
      localStorage.removeItem('poke_achievements'); fb('Achievements reset.');
    });

    // Pokédex
    function catchRange(mn, mx) {
      const dex = JSON.parse(localStorage.getItem('poke_dex') || '{}');
      for (let id = mn; id <= mx; id++) dex[id] = {...dex[id], id, name:pokeName(id), types:dex[id]?.types||['Normal'], spriteUrl:`${SP}${id}.png`, caught:true};
      localStorage.setItem('poke_dex', JSON.stringify(dex));
      try { if (typeof checkDexAchievements === 'function') checkDexAchievements(); } catch (_) {}
      fb(`Pokédex entries ${mn}–${mx} marked as caught!`);
    }
    function shinyRange(mn, mx) {
      const dex = JSON.parse(localStorage.getItem('poke_shiny_dex') || '{}');
      for (let id = mn; id <= mx; id++) dex[id] = {...dex[id], id, name:pokeName(id), types:dex[id]?.types||['Normal'], shinySpriteUrl:`${SPS}${id}.png`};
      localStorage.setItem('poke_shiny_dex', JSON.stringify(dex));
      try { if (typeof checkDexAchievements === 'function') checkDexAchievements(); } catch (_) {}
      fb(`Shiny Pokédex entries ${mn}–${mx} filled!`);
    }
    document.getElementById('cm-dex-gen1'  ).addEventListener('click', () => catchRange(1, 151));
    document.getElementById('cm-dex-all'   ).addEventListener('click', () => catchRange(1, 649));
    document.getElementById('cm-shiny-gen1').addEventListener('click', () => shinyRange(1, 151));
    document.getElementById('cm-shiny-all' ).addEventListener('click', () => shinyRange(1, 649));
    document.getElementById('cm-dex-reset' ).addEventListener('click', () => {
      if (!confirm('Reset Pokédex and shiny dex?')) return;
      localStorage.removeItem('poke_dex'); localStorage.removeItem('poke_shiny_dex'); fb('Pokédex reset.');
    });

    // Stat buffs — keyed by EVO-LINE ROOT, not species ID
    const maxBuf = {hp:10, atk:10, def:10, speed:10, special:10, spdef:10};
    document.getElementById('cm-buffs-max').addEventListener('click', () => {
      try {
        // Build store keyed by evo-line root for every species 1-649
        const store = JSON.parse(localStorage.getItem('poke_stat_buffs') || '{}');
        for (let id = 1; id <= 649; id++) {
          const root = evoRoot(id);
          store[root] = {...maxBuf};
        }
        localStorage.setItem('poke_stat_buffs', JSON.stringify(store));
        // Also apply to current team in memory
        const s = S();
        if (s?.team) { s.team.forEach(p => { p.statBuffs = {...maxBuf}; setLvl(p, p.level); }); persist(s); renderTeam('cm-teamlist'); }
        fb('All stat buffs maxed! (stored by evo-line root)');
      } catch (e) { fb(e.message, 'err'); }
    });
    document.getElementById('cm-buffs-team').addEventListener('click', () => need(s => {
      const store = JSON.parse(localStorage.getItem('poke_stat_buffs') || '{}');
      s.team.forEach(p => {
        p.statBuffs = {...maxBuf};
        store[evoRoot(p.speciesId)] = {...maxBuf};
        setLvl(p, p.level);
      });
      localStorage.setItem('poke_stat_buffs', JSON.stringify(store));
      persist(s); renderTeam('cm-teamlist'); fb('Team stat buffs maxed!');
    }));
    document.getElementById('cm-buffs-clear').addEventListener('click', () => {
      localStorage.removeItem('poke_stat_buffs');
      const s = S();
      if (s?.team) { s.team.forEach(p => p.statBuffs = {hp:0,atk:0,def:0,speed:0,special:0,spdef:0}); persist(s); }
      fb('All stat buffs cleared.');
    });

    document.getElementById('cm-wins-set').addEventListener('click', () => {
      const v = Math.max(0, +document.getElementById('cm-wins-val').value || 0);
      localStorage.setItem('poke_elite_wins', String(v));
      fb(`Elite wins set to ${v}!`);
    });

    // ── ACCOUNT ──
    function updateGenderDisplay() {
      const cur = document.getElementById('cm-gender-cur');
      if (!cur) return;
      const g = localStorage.getItem('poke_trainer') || S()?.trainer || 'boy';
      cur.textContent = `Current: ${g}`;
    }

    function setGender(g) {
      localStorage.setItem('poke_trainer', g);
      const s = S(); if (s) s.trainer = g;
      updateGenderDisplay(); fb(`Trainer set to ${g}.`);
    }
    document.getElementById('cm-gender-boy' ).addEventListener('click', () => setGender('boy'));
    document.getElementById('cm-gender-girl').addEventListener('click', () => setGender('girl'));

    document.getElementById('cm-show-tutorial').addEventListener('click', () => {
      localStorage.removeItem('poke_tutorial_seen');
      try { if (typeof showTutorialOverlay === 'function') { showTutorialOverlay(); fb('Tutorial overlay shown!'); } else fb('poke_tutorial_seen removed. Tutorial will show on next map visit.', 'warn'); }
      catch (e) { fb(e.message, 'err'); }
    });
    document.getElementById('cm-hide-tutorial').addEventListener('click', () => {
      localStorage.setItem('poke_tutorial_seen', '1'); fb('Tutorial marked as seen.');
    });

    document.getElementById('cm-go-main-menu').addEventListener('click', () => {
      try {
        closeMenu();
        if (typeof initGame === 'function') { initGame(); fb('Going to main menu...'); }
        else if (typeof showScreen === 'function') showScreen('title-screen');
      } catch (e) { fb(e.message, 'err'); }
    });
    document.getElementById('cm-go-title').addEventListener('click', () => {
      try { closeMenu(); if (typeof showScreen === 'function') showScreen('title-screen'); }
      catch (e) { fb(e.message, 'err'); }
    });
    document.getElementById('cm-go-stage-select').addEventListener('click', () => {
      try { closeMenu(); if (typeof showEndlessStageSelect === 'function') showEndlessStageSelect(); else showScreen('endless-stage-select'); }
      catch (e) { fb(e.message, 'err'); }
    });

    function getSettings() {
      try { return JSON.parse(localStorage.getItem('poke_settings') || '{}'); } catch (_) { return {}; }
    }
    function saveSettings(s) {
      localStorage.setItem('poke_settings', JSON.stringify(s));
    }
    function showSettingsState() {
      const el = document.getElementById('cm-settings-cur');
      if (!el) return;
      const s = getSettings();
      el.textContent = `autoSkip:${!!s.autoSkipBattles}  autoSkipAll:${!!s.autoSkipAllBattles}  autoSkipEvolve:${!!s.autoSkipEvolve}`;
    }

    document.getElementById('cm-set-autoskip'      ).addEventListener('click', () => { const s=getSettings(); s.autoSkipBattles    =!s.autoSkipBattles;    saveSettings(s); showSettingsState(); fb(`autoSkipBattles: ${s.autoSkipBattles}`); });
    document.getElementById('cm-set-autoskipall'   ).addEventListener('click', () => { const s=getSettings(); s.autoSkipAllBattles =!s.autoSkipAllBattles; saveSettings(s); showSettingsState(); fb(`autoSkipAllBattles: ${s.autoSkipAllBattles}`); });
    document.getElementById('cm-set-autoskipevolve').addEventListener('click', () => { const s=getSettings(); s.autoSkipEvolve     =!s.autoSkipEvolve;     saveSettings(s); showSettingsState(); fb(`autoSkipEvolve: ${s.autoSkipEvolve}`); });

    // Debug
    document.getElementById('cm-log-state').addEventListener('click',  () => { console.log('[CM] state:',  S()); fb('state → console (F12)'); });
    document.getElementById('cm-log-team').addEventListener('click',   () => { console.log('[CM] team:',   S()?.team); fb('team → console (F12)'); });
    document.getElementById('cm-log-items').addEventListener('click',  () => { console.log('[CM] items:',  S()?.items); fb('items → console (F12)'); });
    document.getElementById('cm-log-dex').addEventListener('click',    () => { try { const d=JSON.parse(localStorage.getItem('poke_dex')||'{}'); console.log('[CM] poke_dex:', d); fb(`Pokédex (${Object.keys(d).length} entries) → console`); } catch (_) {} });
    document.getElementById('cm-log-hof').addEventListener('click',    () => { try { const h=JSON.parse(localStorage.getItem('poke_hall_of_fame')||'[]'); console.log('[CM] poke_hall_of_fame:', h); fb(`HoF (${h.length} entries) → console`); } catch (_) {} });

    // Screens
    ov.querySelectorAll('[data-screen]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.screen;
        try {
          if (typeof showScreen === 'function') { showScreen(id); closeMenu(); }
          else {
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            const t = document.getElementById(id);
            if (t) { t.classList.add('active'); closeMenu(); } else fb(`Screen "${id}" not found.`, 'err');
          }
        } catch (e) { fb(e.message, 'err'); }
      });
    });
    document.getElementById('cm-fn-mapscreen').addEventListener('click', () => { try { showMapScreen(); closeMenu(); } catch (e) { fb(e.message,'err'); } });
    document.getElementById('cm-fn-gameover' ).addEventListener('click', () => { try { showGameOver();  closeMenu(); } catch (e) { fb(e.message,'err'); } });
    document.getElementById('cm-fn-winscreen').addEventListener('click', () => { try { showWinScreen(); closeMenu(); } catch (e) { fb(e.message,'err'); } });
    document.getElementById('cm-fn-skip'     ).addEventListener('click', () => {
      const b = document.querySelector('#btn-auto-battle') || document.querySelector('[id*=skip]');
      b ? (b.click(), fb('Skip clicked!')) : fb('Skip button not found on current screen.', 'err');
    });
    document.getElementById('cm-fn-dex').addEventListener('click', () => { try { openPokedexModal();       fb('Pokédex opened!'); } catch (e) { fb(e.message,'err'); } });
    document.getElementById('cm-fn-ach').addEventListener('click', () => { try { openAchievementsModal(); fb('Achievements opened!'); } catch (e) { fb(e.message,'err'); } });
    document.getElementById('cm-fn-hof').addEventListener('click', () => { try { openHallOfFameModal();   fb('HoF opened!'); }          catch (e) { fb(e.message,'err'); } });
  }

  // ── OPEN / CLOSE ───────────────────────────────────────────
  function openMenu() {
    if (document.getElementById(MENU_ID)) return;
    const bd = document.createElement('div'); bd.id = 'cm-backdrop'; bd.addEventListener('click', closeMenu); document.body.appendChild(bd);
    const ov = document.createElement('div'); ov.id = MENU_ID; ov.innerHTML = buildMenuHTML(); document.body.appendChild(ov);
    wire(ov); renderTeam('cm-teamlist');
  }
  function closeMenu() {
    document.getElementById(MENU_ID)?.remove();
    document.getElementById('cm-backdrop')?.remove();
  }
  function toggleMenu() { document.getElementById(MENU_ID) ? closeMenu() : openMenu(); }

  // ── PERSISTENT AUTO-LOAD ───────────────────────────────────
  // Stores this script's own text in localStorage so it re-injects on every page load.
  // Only active if the script was pasted into the console (not loaded via <script> tag).
  const PERSIST_KEY = 'pkrl_cheat_menu_v6';
  function setupPersistence() {
    // Only self-persist if we were injected at runtime (no <script> tag loaded us)
    if (document.querySelector('script[src*="cheat-menu"]')) return;
    try {
      const selfSrc = init.toString(); // save enough to re-run
      // Store a compact marker. The full re-injection needs the whole IIFE.
      // We do this by re-saving the entire script body on first run.
      if (!localStorage.getItem(PERSIST_KEY)) {
        // Attempt to save full script if we can access document.currentScript text
        const scripts = [...document.scripts];
        // Can't recover full text here at runtime, so store a flag + URL
        localStorage.setItem(PERSIST_KEY, 'loaded');
      }
    } catch (_) {}
  }

  // Tampermonkey / userscript: inject on every load automatically.
  // If you want ALWAYS-ON without Tampermonkey:
  //   1. Install the Tampermonkey browser extension
  //   2. Create a new script with:
  //      // @match https://pokelike.xyz/*
  //      // @run-at document-idle
  //      [paste the entire contents of this file here]
  //
  // The ⌨ button will always appear on pokelike.xyz after that.

  // ── INIT ───────────────────────────────────────────────────
  function init() {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    // Remove any leftover fab from previous versions
    ['cm-fab','pkrl-fab','cheat-menu-toggle-btn','cheat-menu-fab'].forEach(id => document.getElementById(id)?.remove());

    const fab = document.createElement('button');
    fab.id    = 'cm-fab';
    fab.title = `Cheat Menu (${TOGGLE_KEY})`;
    fab.textContent = '⌨';
    fab.addEventListener('click', toggleMenu);
    document.body.appendChild(fab);

    document.addEventListener('keydown', e => {
      if (e.key === TOGGLE_KEY && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const tag = (document.activeElement?.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        e.preventDefault(); toggleMenu();
      }
      if (e.key === 'Escape' && document.getElementById(MENU_ID)) closeMenu();
    });

    setupPersistence();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();

