// data.js — K-Monsters: All game data
// Global object: KMData

// ============================================================
// Sistema de chave de ativação — hash SHA-256
// ============================================================
const KMConfig = {
  _keyHash: '11b0353e0f6bc9af894fa7ebc67de827198766a56cc53f1c12f1e7436ad58876',
  _activated: false,

  async validateKey(raw) {
    const clean = raw.replace(/[\-\s]/g, '').toUpperCase();
    if (clean.length !== 25) return false;
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(clean));
    const hex = [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
    return hex === this._keyHash;
  },

  async activate(raw) {
    if (await this.validateKey(raw)) {
      this._activated = true;
      localStorage.setItem('km_activation_key', raw.replace(/[\-\s]/g, '').toUpperCase());
      return true;
    }
    return false;
  },

  async checkSaved() {
    const saved = localStorage.getItem('km_activation_key');
    if (saved && await this.validateKey(saved)) {
      this._activated = true;
    }
  },

  isUnlocked() {
    return this._activated;
  },
};

// Checar chave salva ao carregar
KMConfig.checkSaved();

const KMData = {

// ============================================================
// BASE GAME — Kreature Stats
// ============================================================
baseStats: {
  "Piki":       {vida:15, dano:3, kskill:"Trava Dourada",     kskill_efeito:"trava"},
  "K-Bat":      {vida:10, dano:3, kskill:"Empurrão de Vento", kskill_efeito:"debuff"},
  "K-Rat":      {vida:10, dano:2, kskill:"Mordida Rápida",    kskill_efeito:"dano_extra"},
  "K-Mega":     {vida:20, dano:5, kskill:"Ultra Carga",       kskill_efeito:"bonus_forte"},
  "K-Mag":      {vida:12, dano:4, kskill:"Explosão de Lava",  kskill_efeito:"dano_extra"},
  "K-Waterlim": {vida:14, dano:3, kskill:"Maré",              kskill_efeito:"cura"},
  "K-Megaron":  {vida:30, dano:7, kskill:"Impacto Omega",     kskill_efeito:"dano_extra"},
  "Pikron":     {vida:22, dano:5, kskill:"Prisao Dourada",    kskill_efeito:"trava"},
  "K-Vampire":  {vida:16, dano:5, kskill:"Drenar Vida",       kskill_efeito:"cura"},
  "K-Ratron":   {vida:16, dano:4, kskill:"Furia de Mordidas", kskill_efeito:"dano_extra"},
  "K-Magron":   {vida:20, dano:6, kskill:"Erupcao Total",     kskill_efeito:"dano_extra"},
  "K-Tidalim":  {vida:22, dano:5, kskill:"Tsunami",           kskill_efeito:"cura"},
  // Boss
  "K-Omega":    {vida:300,dano:18, kskill:"Colapso Universal", kskill_efeito:"dano_extra"},
},

baseEvolucoes: {
  "K-Mega":     {evolui_para:"K-Megaron",  medalhas_necessarias:3},
  "Piki":       {evolui_para:"Pikron",      medalhas_necessarias:2},
  "K-Bat":      {evolui_para:"K-Vampire",   medalhas_necessarias:2},
  "K-Rat":      {evolui_para:"K-Ratron",    medalhas_necessarias:2},
  "K-Mag":      {evolui_para:"K-Magron",    medalhas_necessarias:2},
  "K-Waterlim": {evolui_para:"K-Tidalim",   medalhas_necessarias:2},
},

baseCapturaChances: {
  "K-Rat":65, "K-Bat":60, "K-Mag":40, "K-Waterlim":55, "Piki":20, "K-Mega":5,
},

baseCapturaBonus: {
  "C":{"K-Mega":5}, "P":{"K-Waterlim":10}, "F":{"Piki":5}, "L":{"K-Mag":5},
},

baseSpawns: {
  "C":{"K-Rat":30,"K-Bat":30,"K-Mega":40},
  "P":{"K-Rat":20,"K-Waterlim":60,"K-Bat":20},
  "F":{"Piki":50,"K-Rat":25,"K-Bat":25},
  "L":{"K-Mag":55,"K-Rat":25,"K-Mega":20},
},

baseMap: [
  ["L","L","C","C","C"],
  ["L","F","F","C","C"],
  ["F","F","V","F","P"],
  ["L","F","F","P","P"],
  ["L","L","P","K","P"],
],

baseAreaNames: {
  "V":"Vila","C":"Cavernas","P":"Praia","F":"Floresta","L":"Lava","K":"K-Stadium"
},

// ============================================================
// DLC1 — A Far Planet
// ============================================================
dlc1Stats: {
  // Originais
  "Piki":        {vida:15,  dano:3,  kskill:"Trava Dourada",       kskill_efeito:"trava"},
  "K-Bat":       {vida:10,  dano:3,  kskill:"Empurrão de Vento",   kskill_efeito:"debuff"},
  "K-Rat":       {vida:10,  dano:2,  kskill:"Mordida Rápida",      kskill_efeito:"dano_extra"},
  "K-Mega":      {vida:20,  dano:5,  kskill:"Ultra Carga",         kskill_efeito:"bonus_forte"},
  "K-Mag":       {vida:12,  dano:4,  kskill:"Explosão de Lava",    kskill_efeito:"dano_extra"},
  "K-Waterlim":  {vida:14,  dano:3,  kskill:"Maré",                kskill_efeito:"cura"},
  "K-Megaron":   {vida:30,  dano:7,  kskill:"Impacto Omega",       kskill_efeito:"dano_extra"},
  "Pikron":      {vida:22,  dano:5,  kskill:"Prisão Dourada",      kskill_efeito:"trava"},
  "K-Vampire":   {vida:16,  dano:5,  kskill:"Drenar Vida",         kskill_efeito:"cura"},
  "K-Ratron":    {vida:16,  dano:4,  kskill:"Fúria de Mordidas",   kskill_efeito:"dano_extra"},
  "K-Magron":    {vida:20,  dano:6,  kskill:"Erupção Total",       kskill_efeito:"dano_extra"},
  "K-Tidalim":   {vida:22,  dano:5,  kskill:"Tsunami",             kskill_efeito:"cura"},
  // K-Far base
  "K-Volkan":    {vida:80,  dano:18, kskill:"Erupção Planetária",  kskill_efeito:"dano_extra_forte"},
  "Pikstorm":    {vida:70,  dano:15, kskill:"Furacão Glacial",     kskill_efeito:"debuff_cura"},
  "K-Shadowbat": {vida:65,  dano:20, kskill:"Drenar Alma",         kskill_efeito:"cura_forte"},
  "K-Terron":    {vida:90,  dano:16, kskill:"Terremoto",           kskill_efeito:"trava_dano"},
  "K-Crystallis":{vida:95,  dano:17, kskill:"Escudo de Cristal",   kskill_efeito:"bloqueio_forte"},
  "K-Aquaris":   {vida:75,  dano:14, kskill:"Maré Gelada",         kskill_efeito:"cura_gelada"},
  "K-Spectral":  {vida:60,  dano:22, kskill:"Explosão Espectral",  kskill_efeito:"dano_extra_forte"},
  "K-Dracovol":  {vida:70,  dano:19, kskill:"Rajada Dracônica",    kskill_efeito:"rajada_draconica"},
  "K-Stoneback": {vida:100, dano:12, kskill:"Muro de Pedra",       kskill_efeito:"bloqueio_forte"},
  "K-Umbra":     {vida:65,  dano:21, kskill:"Toque do Vazio",      kskill_efeito:"debuff_total"},
  // K-Far evoluídos
  "K-Volcatron": {vida:165, dano:40, kskill:"Mega Erupção",        kskill_efeito:"dano_extra_forte"},
  "Pikstorm-X":  {vida:148, dano:33, kskill:"Tempestade Polar",    kskill_efeito:"debuff_cura"},
  "K-Nightlord": {vida:138, dano:44, kskill:"Absorção Sombria",    kskill_efeito:"cura_forte"},
  "K-Terradon":  {vida:190, dano:36, kskill:"Apocalipse Sísmico",  kskill_efeito:"trava_dano"},
  "K-Prism":     {vida:200, dano:38, kskill:"Fortaleza de Cristal",kskill_efeito:"bloqueio_forte"},
  "K-Abyssus":   {vida:160, dano:30, kskill:"Abismo Polar",        kskill_efeito:"cura_gelada"},
  "K-Radiantis": {vida:140, dano:46, kskill:"Pulso Radiant",       kskill_efeito:"dano_extra_forte"},
  "K-Dracovon":  {vida:155, dano:42, kskill:"Tempestade Dracônica",kskill_efeito:"rajada_draconica"},
  "K-Golemtron": {vida:210, dano:28, kskill:"Fortaleza Absoluta",  kskill_efeito:"bloqueio_forte"},
  "K-Voidling":  {vida:145, dano:45, kskill:"Corrupção Inversa",   kskill_efeito:"debuff_total"},
  // Corruptos
  "K-Darkrat":   {vida:50,  dano:14, kskill:"Mordida Sombria",     kskill_efeito:"dano_extra"},
  "K-Sombra":    {vida:45,  dano:12, kskill:"Garra das Trevas",    kskill_efeito:"debuff"},
  "K-Corrupto":  {vida:70,  dano:18, kskill:"Corrupção",           kskill_efeito:"dano_extra"},
  // Bosses
  "K-Void":          {vida:450, dano:25, kskill:"Pulso Nulo",        kskill_efeito:"dano_extra_forte"},
  "K-Void Renascido":{vida:300, dano:45, kskill:"Corrupção Massiva", kskill_efeito:"debuff_total"},
},

KREATURES_PLANETA: new Set([
  "K-Volkan","Pikstorm","K-Shadowbat","K-Terron","K-Crystallis",
  "K-Aquaris","K-Spectral","K-Dracovol","K-Stoneback","K-Umbra",
  "K-Volcatron","Pikstorm-X","K-Nightlord","K-Terradon","K-Prism",
  "K-Abyssus","K-Radiantis","K-Dracovon","K-Golemtron","K-Voidling",
]),

EVOLUIDOS_FAR: new Set([
  "K-Volcatron","Pikstorm-X","K-Nightlord","K-Terradon","K-Prism",
  "K-Abyssus","K-Radiantis","K-Dracovon","K-Golemtron","K-Voidling",
]),

dlc1Evolucoes: {
  "K-Volkan":    {evolui_para:"K-Volcatron",  cristais_necessarios:2},
  "Pikstorm":    {evolui_para:"Pikstorm-X",   cristais_necessarios:2},
  "K-Shadowbat": {evolui_para:"K-Nightlord",  cristais_necessarios:2},
  "K-Terron":    {evolui_para:"K-Terradon",   cristais_necessarios:2},
  "K-Crystallis":{evolui_para:"K-Prism",      cristais_necessarios:3},
  "K-Aquaris":   {evolui_para:"K-Abyssus",    cristais_necessarios:2},
  "K-Spectral":  {evolui_para:"K-Radiantis",  cristais_necessarios:2},
  "K-Dracovol":  {evolui_para:"K-Dracovon",   cristais_necessarios:3},
  "K-Stoneback": {evolui_para:"K-Golemtron",  cristais_necessarios:3},
  "K-Umbra":     {evolui_para:"K-Voidling",   cristais_necessarios:3},
},

dlc1CapturaChances: {
  "K-Volkan":35,"Pikstorm":40,"K-Shadowbat":30,"K-Terron":45,"K-Crystallis":25,
  "K-Aquaris":40,"K-Spectral":35,"K-Dracovol":30,"K-Stoneback":45,"K-Umbra":25,
  "K-Volcatron":10,"Pikstorm-X":12,"K-Nightlord":10,"K-Terradon":12,"K-Prism":8,
  "K-Abyssus":12,"K-Radiantis":10,"K-Dracovon":10,"K-Golemtron":8,"K-Voidling":8,
},

dlc1Spawns: {
  "V":{"K-Volkan":45,"K-Dracovol":28,"K-Volcatron":6,"K-Dracovon":6,"K-Darkrat":15},
  "G":{"K-Aquaris":42,"Pikstorm":30,"K-Abyssus":7,"Pikstorm-X":6,"K-Darkrat":15},
  "S":{"K-Shadowbat":38,"K-Umbra":32,"K-Nightlord":8,"K-Voidling":5,"K-Sombra":12,"K-Darkrat":5},
  "C":{"K-Crystallis":35,"K-Stoneback":32,"K-Terron":15,"K-Prism":6,"K-Golemtron":5,"K-Terradon":5,"K-Darkrat":2},
  "T":{"K-Spectral":32,"K-Dracovol":22,"K-Terron":18,"K-Radiantis":8,"K-Corrupto":20},
},

dlc1Map: [
  ["S","S","S","S","C","C","C","T","T","T"],
  ["S","S","S","C","C","C","T","T","T","G"],
  ["S","S","C","C","C","T","T","T","G","G"],
  ["S","S","C","C","T","T","T","G","G","G"],
  ["V","V","C","T","T","T","G","G","G","G"],
  ["V","V","V","T","T","B","G","G","G","F"],
  ["V","V","V","V","T","T","T","G","G","F"],
  ["V","V","V","V","V","T","T","T","G","F"],
  ["V","V","V","V","V","V","T","G","G","F"],
  ["V","V","V","V","V","T","T","G","F","F"],
],

dlc1AreaNames: {
  "B":"Base dos Sobreviventes","V":"Vulcão","G":"Glacial",
  "S":"Zona Sombria","C":"Cavernas Cristalinas","T":"Tempestade","F":"Portal do Vazio",
},

// ============================================================
// DLC2 — Ecos do Vazio
// ============================================================
dlc2Map: [
  ["R","R","E","E","P","P"],
  ["R","F","F","F","P","P"],
  ["F","F","F","C","P","E"],
  ["F","F","C","C","F","E"],
  ["F","F","F","F","S","E"],
  ["F","F","F","S","S","E"],
],

dlc2AreaNames: {
  "P":"Praia","F":"Floresta","C":"Cratera","R":"Ruínas dos Antigos",
  "S":"Local do Selamento","E":"Encosta Cristalina",
},

dlc2Equipes: {
  "P":[["K-Aquaris","K-Aquaris"],["Pikstorm","K-Aquaris"],["K-Aquaris","K-Aquaris","Pikstorm"],["K-Abyssus"]],
  "F":[["K-Terron","K-Stoneback"],["K-Spectral","K-Spectral"],["K-Terron","K-Terron","K-Stoneback"],["K-Terradon"]],
  "C":[["K-Volkan","K-Umbra"],["K-Volkan","K-Volkan"],["K-Umbra","K-Umbra","K-Volkan"],["K-Volcatron"]],
  "R":[["K-Crystallis","K-Shadowbat"],["K-Shadowbat","K-Shadowbat","K-Crystallis"],["K-Prism"]],
  "S":[["K-Voidling","K-Umbra"],["K-Voidling","K-Voidling"],["K-Nightlord"]],
  "E":[["K-Dracovol","K-Spectral"],["K-Dracovol","K-Dracovol"],["K-Radiantis","K-Dracovol"],["K-Dracovon"]],
},

dlc2Eventos: {
  "4,0":"praia_norte","3,2":"cratera","0,1":"ruinas",
  "2,1":"floresta_carbonizada","4,4":"selamento","5,2":"encosta_estrelas",
},

dlc2Fragmentos: {
  "5,0":{id:"antena",  desc:"Preso numa rocha à beira-mar: a ANTENA do transmissor de emergência."},
  "0,3":{id:"bateria", desc:"Entre as ruínas, algo brilha no chão. A BATERIA de emergência."},
  "3,5":{id:"placa",   desc:"Semi-enterrada perto do local de selamento: a PLACA de circuito."},
},

// ============================================================
// DLC3 — Companhia Esquecida
// ============================================================
dlc3KSkills: {
  "Rugido":         {desc:"Ataca com força bruta. 150% do dano normal em um alvo.",       tipo:"dano_forte"},
  "Absorver Vida":  {desc:"Drena HP de um inimigo. Recupera metade do dano causado.",     tipo:"drenar"},
  "Rugido do Fim":  {desc:"Remove bônus de todos os inimigos e causa dano leve em cada um.", tipo:"destruir_bonus"},
  "Pulso Cósmico":  {desc:"Causa dano igual ao seu dano base em TODOS os inimigos.",      tipo:"aoe"},
  "Renascimento":   {desc:"K-Omega se recupera. Restaura 40 de vida.",                    tipo:"cura"},
},

dlc3AbsorcaoSkills: {
  "K-Rat":"Absorver Vida","K-Bat":"Rugido do Fim","K-Mag":"Pulso Cósmico","Piki":"Renascimento",
},

dlc3InimigoStats: {
  "K-Rat":   {vida:10, dano:2,  kskill:"Mordida Rápida"},
  "K-Bat":   {vida:10, dano:3,  kskill:"Empurrão de Vento"},
  "Piki":    {vida:15, dano:3,  kskill:"Trava Dourada"},
  "K-Mag":   {vida:12, dano:4,  kskill:"Explosão de Lava"},
  "K-Mega":  {vida:20, dano:5,  kskill:"Ultra Carga"},
  "K-Master":{vida:45, dano:9,  kskill:"Rugido Devastador"},
},

dlc3Map: [
  ["F","F","S","F","F"],
  ["C","C","F","F","F"],
  ["C","F","V","F","O"],
  ["F","F","F","F","O"],
  ["F","F","G","F","F"],
],

dlc3AreaNames: {
  "G":"K-Grassland","V":"K-Village","O":"K-Forest","C":"K-Cave","S":"K-Stadium","F":"Campo",
},

dlc3Equipes: {
  "G":[["K-Rat"],["K-Rat","K-Rat"],["K-Bat","K-Rat"]],
  "V":[["K-Rat","K-Bat"],["Piki"],["K-Bat","K-Bat"]],
  "O":[["K-Bat","Piki"],["K-Bat","K-Bat","K-Rat"],["Piki","Piki"]],
  "C":[["K-Mag"],["K-Mag","K-Bat"],["K-Mag","K-Rat"]],
  "F":[["K-Rat"],["K-Bat"],["K-Rat","K-Bat"]],
},

// ============================================================
// KM2 — K-Monsters 2: De Volta ao Lar
// ============================================================
km2Stats: {
  // Base
  "K-Rat":       {vida:10, dano:2,  kskill:"Mordida Rápida",     tipo:"fighter"},
  "K-Bat":       {vida:10, dano:3,  kskill:"Empurrão de Vento",  tipo:"fighter"},
  "Piki":        {vida:15, dano:3,  kskill:"Trava Dourada",      tipo:"fighter"},
  "K-Mag":       {vida:12, dano:4,  kskill:"Explosão de Lava",   tipo:"fighter"},
  "K-Mega":      {vida:20, dano:5,  kskill:"Ultra Carga",        tipo:"fighter"},
  "K-Waterlim":  {vida:14, dano:3,  kskill:"Maré",               tipo:"fighter"},
  "Pikron":      {vida:22, dano:5,  kskill:"Prisão Dourada",     tipo:"fighter"},
  "K-Vampire":   {vida:16, dano:5,  kskill:"Drenar Vida",        tipo:"fighter"},
  "K-Ratron":    {vida:16, dano:4,  kskill:"Fúria de Mordidas",  tipo:"fighter"},
  "K-Magron":    {vida:20, dano:6,  kskill:"Erupção Total",      tipo:"fighter"},
  "K-Tidalim":   {vida:22, dano:5,  kskill:"Tsunami",            tipo:"fighter"},
  "K-Megaron":   {vida:30, dano:7,  kskill:"Impacto Omega",      tipo:"fighter"},
  // K-Far
  "K-Volkan":    {vida:80,  dano:18, kskill:"Erupção Planetária", tipo:"fighter"},
  "Pikstorm":    {vida:70,  dano:15, kskill:"Furacão Glacial",    tipo:"fighter"},
  "K-Shadowbat": {vida:65,  dano:20, kskill:"Drenar Alma",        tipo:"fighter"},
  "K-Terron":    {vida:90,  dano:16, kskill:"Terremoto",          tipo:"fighter"},
  "K-Crystallis":{vida:95,  dano:17, kskill:"Escudo de Cristal",  tipo:"fighter"},
  "K-Aquaris":   {vida:75,  dano:14, kskill:"Maré Gelada",        tipo:"fighter"},
  "K-Spectral":  {vida:60,  dano:22, kskill:"Explosão Espectral", tipo:"fighter"},
  "K-Dracovol":  {vida:70,  dano:19, kskill:"Rajada Dracônica",   tipo:"fighter"},
  "K-Stoneback": {vida:100, dano:12, kskill:"Muro de Pedra",      tipo:"fighter"},
  "K-Umbra":     {vida:65,  dano:21, kskill:"Toque do Vazio",     tipo:"fighter"},
  // Suporte
  "K-Healer":  {vida:22, dano:1, kskill:"Cura Profunda", tipo:"suporte", suporte_tipo:"regen",  suporte_val:10},
  "K-Shield":  {vida:28, dano:1, kskill:"Barreira",      tipo:"suporte", suporte_tipo:"defesa", suporte_val:5},
  "K-Booster": {vida:20, dano:1, kskill:"Amplificar",    tipo:"suporte", suporte_tipo:"ataque", suporte_val:4},
  // Exóticos
  "K-Manipuler":{vida:18, dano:2, kskill:"Manipulação",  tipo:"exotico"},
  "K-Miroir":   {vida:14, dano:2, kskill:"Espelho",      tipo:"exotico"},
  "K-Ancora":   {vida:20, dano:2, kskill:"Âncora",       tipo:"exotico"},
  "K-Silencer": {vida:16, dano:2, kskill:"Silêncio",     tipo:"exotico"},
  "K-Phantom":  {vida:12, dano:2, kskill:"Ilusão",       tipo:"exotico"},
  "K-Drain":    {vida:18, dano:2, kskill:"Drenar Força",  tipo:"exotico"},
  // K-Far evoluídos
  "K-Volcatron": {vida:165, dano:40, kskill:"Mega Erupção",         tipo:"fighter"},
  "Pikstorm-X":  {vida:148, dano:33, kskill:"Tempestade Polar",     tipo:"fighter"},
  "K-Nightlord": {vida:138, dano:44, kskill:"Absorção Sombria",     tipo:"fighter"},
  "K-Terradon":  {vida:190, dano:36, kskill:"Apocalipse Sísmico",   tipo:"fighter"},
  "K-Prism":     {vida:200, dano:38, kskill:"Fortaleza de Cristal", tipo:"fighter"},
  "K-Abyssus":   {vida:160, dano:30, kskill:"Abismo Polar",         tipo:"fighter"},
  "K-Radiantis": {vida:140, dano:46, kskill:"Pulso Radiant",        tipo:"fighter"},
  "K-Dracovon":  {vida:155, dano:42, kskill:"Tempestade Dracônica", tipo:"fighter"},
  "K-Golemtron": {vida:210, dano:28, kskill:"Fortaleza Absoluta",   tipo:"fighter"},
  "K-Voidling":  {vida:145, dano:45, kskill:"Corrupção Inversa",    tipo:"fighter"},
},

km2KSkillEfeitos: {
  "Mordida Rápida":    {tipo:"dano_extra",   valor:3},
  "Empurrão de Vento": {tipo:"debuff",       valor:2},
  "Trava Dourada":     {tipo:"trava",        valor:1},
  "Explosão de Lava":  {tipo:"dano_extra",   valor:5},
  "Ultra Carga":       {tipo:"bonus_forte",  valor:4},
  "Maré":              {tipo:"cura",         valor:10},
  "Prisão Dourada":    {tipo:"trava",        valor:2},
  "Drenar Vida":       {tipo:"drenar",       valor:6},
  "Fúria de Mordidas": {tipo:"dano_extra",   valor:6},
  "Erupção Total":     {tipo:"dano_extra",   valor:7},
  "Tsunami":           {tipo:"cura",         valor:14},
  "Impacto Omega":     {tipo:"dano_extra",   valor:10},
  "Erupção Planetária":{tipo:"dano_extra",   valor:16},
  "Furacão Glacial":   {tipo:"debuff_cura",  valor:12},
  "Drenar Alma":       {tipo:"drenar",       valor:18},
  "Terremoto":         {tipo:"aoe",          valor:10},
  "Escudo de Cristal": {tipo:"bloqueio",     valor:20},
  "Maré Gelada":       {tipo:"cura",         valor:16},
  "Explosão Espectral":{tipo:"dano_extra",   valor:18},
  "Rajada Dracônica":  {tipo:"aoe",          valor:12},
  "Muro de Pedra":     {tipo:"bloqueio",     valor:28},
  "Toque do Vazio":    {tipo:"debuff_total", valor:8},
  "Cura Profunda":     {tipo:"cura",         valor:22},
  "Barreira":          {tipo:"bloqueio",     valor:18},
  "Amplificar":        {tipo:"bonus_forte",  valor:6},
  "Mega Erupção":         {tipo:"dano_extra",  valor:22},
  "Tempestade Polar":     {tipo:"debuff_cura", valor:18},
  "Absorção Sombria":     {tipo:"drenar",      valor:28},
  "Apocalipse Sísmico":   {tipo:"aoe",         valor:18},
  "Fortaleza de Cristal": {tipo:"bloqueio",    valor:35},
  "Abismo Polar":         {tipo:"cura",        valor:24},
  "Pulso Radiant":        {tipo:"dano_extra",  valor:24},
  "Tempestade Dracônica": {tipo:"aoe",         valor:20},
  "Fortaleza Absoluta":   {tipo:"bloqueio",    valor:40},
  "Corrupção Inversa":    {tipo:"debuff_total",valor:14},
  "Manipulação":   {tipo:"exotico",valor:0},
  "Espelho":       {tipo:"exotico",valor:0},
  "Âncora":        {tipo:"exotico",valor:0},
  "Silêncio":      {tipo:"exotico",valor:0},
  "Ilusão":        {tipo:"exotico",valor:0},
  "Drenar Força":  {tipo:"exotico",valor:0},
},

km2Evolucoes: {
  "K-Rat":"K-Ratron","K-Bat":"K-Vampire","Piki":"Pikron",
  "K-Mag":"K-Magron","K-Waterlim":"K-Tidalim","K-Mega":"K-Megaron",
  "K-Volkan":"K-Volcatron","Pikstorm":"Pikstorm-X","K-Shadowbat":"K-Nightlord",
  "K-Terron":"K-Terradon","K-Crystallis":"K-Prism","K-Aquaris":"K-Abyssus",
  "K-Spectral":"K-Radiantis","K-Dracovol":"K-Dracovon","K-Stoneback":"K-Golemtron",
  "K-Umbra":"K-Voidling",
},

km2AreaKreatures: {
  "G":[["K-Rat"],["K-Bat"],["Piki"],["K-Rat","K-Bat"],["K-Bat","Piki"],["K-Rat","K-Bat","Piki"]],
  "C":[["K-Mag"],["K-Mega"],["K-Waterlim"],["K-Mag","K-Bat"],["K-Mega","K-Rat"],
       ["K-Mag","K-Mega"],["K-Megaron"],["Pikron","K-Vampire"],["K-Ratron","K-Magron","K-Tidalim"]],
  "P":[["K-Volkan"],["Pikstorm"],["K-Shadowbat"],["K-Terron"],["K-Crystallis"],
       ["K-Aquaris"],["K-Spectral"],["K-Dracovol"],["K-Stoneback"],["K-Umbra"],
       ["K-Volkan","Pikstorm"],["K-Shadowbat","K-Terron"],["K-Spectral","K-Umbra"],
       ["K-Crystallis","K-Aquaris","K-Dracovol"]],
  "E":[["K-Healer"],["K-Shield"],["K-Booster"],["K-Manipuler"],["K-Miroir"],
       ["K-Ancora"],["K-Silencer"],["K-Phantom"],["K-Drain"],
       ["K-Healer","K-Shield"],["K-Manipuler","K-Phantom"],["K-Ancora","K-Silencer"]],
},

km2Map: [
  ["E","E",".",".","P","P","."],
  ["E","E",".",".","P","P","."],
  ["G","G","G","G","G","G","G"],
  ["G","G","G","G","G","G","G"],
  ["G","A","V","G","G","G","G"],
  ["G","G","C","C","G","G","G"],
  ["G","G","S","G","G","G","G"],
],

km2AreaNames: {
  "G":"K-Grassland","C":"K-Cave","V":"K-Village","A":"K-Arena",
  "P":"K-Far Planet","E":"Área Exótica","S":"K-Stadium (Ruínas)",".":"---",
},

km2CompeticaoFases: [
  {fase:1, nome:"Fase Inicial", moedas:80, treinadores:[
    {nome:"Trainer Lou",  time:["K-Rat","K-Bat"]},
    {nome:"Trainer Maya", time:["K-Mega","Piki"]},
  ]},
  {fase:2, nome:"Fase Avançada", moedas:150, treinadores:[
    {nome:"Trainer Rex",  time:["K-Waterlim","K-Rat","K-Bat"]},
    {nome:"Trainer Nora", time:["K-Megaron","Pikron","K-Vampire"]},
  ]},
  {fase:3, nome:"Fase Elite", moedas:250, treinadores:[
    {nome:"Trainer Voss",  time:["K-Volkan","Pikstorm","K-Aquaris"]},
    {nome:"Trainer Sable", time:["K-Crystallis","K-Terron","K-Shadowbat"]},
  ]},
  {fase:4, nome:"Grande Final", moedas:500, treinadores:[
    {nome:"Campeão Drix", time:["K-Spectral","K-Umbra","K-Dracovol"]},
  ]},
],

km2Capturavel: new Set([
  "K-Rat","K-Bat","Piki","K-Mag","K-Mega","K-Waterlim",
  "K-Megaron","Pikron","K-Vampire","K-Ratron","K-Magron","K-Tidalim",
  "K-Volkan","Pikstorm","K-Shadowbat","K-Terron","K-Crystallis",
  "K-Aquaris","K-Spectral","K-Dracovol","K-Stoneback","K-Umbra",
  "K-Healer","K-Shield","K-Booster",
  "K-Manipuler","K-Miroir","K-Ancora","K-Silencer","K-Phantom","K-Drain",
]),

// ============================================================
// Utility: Weighted random choice
// ============================================================
// ============================================================
// Sistema de Tipos/Elementos
// ============================================================
tipoChart: {
  // Fogo > Planta > Agua > Fogo (triangulo)
  // Sombra <> Luz (double weakness)
  // Normal = neutro contra todos
  "Fogo":   { forte: ["Planta"], fraco: ["Agua"] },
  "Agua":   { forte: ["Fogo"],   fraco: ["Planta"] },
  "Planta": { forte: ["Agua"],   fraco: ["Fogo"] },
  "Sombra": { forte: ["Luz"],    fraco: ["Luz"] },
  "Luz":    { forte: ["Sombra"], fraco: ["Sombra"] },
  "Normal": { forte: [],         fraco: [] },
},

kreatureTipos: {
  // Base
  "Piki":        "Luz",
  "Pikron":      "Luz",
  "K-Bat":       "Sombra",
  "K-Vampire":   "Sombra",
  "K-Rat":       "Normal",
  "K-Ratron":    "Normal",
  "K-Mega":      "Normal",
  "K-Megaron":   "Normal",
  "K-Mag":       "Fogo",
  "K-Magron":    "Fogo",
  "K-Waterlim":  "Agua",
  "K-Tidalim":   "Agua",
  // Boss base
  "K-Omega":     "Sombra",
  // DLC1 — K-Far base
  "K-Volkan":    "Fogo",
  "K-Volcatron": "Fogo",
  "Pikstorm":    "Agua",
  "Pikstorm-X":  "Agua",
  "K-Shadowbat": "Sombra",
  "K-Nightlord": "Sombra",
  "K-Terron":    "Planta",
  "K-Terradon":  "Planta",
  "K-Crystallis":"Luz",
  "K-Prism":     "Luz",
  "K-Aquaris":   "Agua",
  "K-Abyssus":   "Agua",
  "K-Spectral":  "Luz",
  "K-Radiantis": "Luz",
  "K-Dracovol":  "Fogo",
  "K-Dracovon":  "Fogo",
  "K-Stoneback": "Planta",
  "K-Golemtron": "Planta",
  "K-Umbra":     "Sombra",
  "K-Voidling":  "Sombra",
  // DLC1 — Corruptos
  "K-Darkrat":   "Sombra",
  "K-Sombra":    "Sombra",
  "K-Corrupto":  "Sombra",
  // DLC1 — Bosses
  "K-Void":          "Sombra",
  "K-Void Renascido":"Sombra",
  // DLC3 — inimigos
  "K-Master":    "Normal",
  // KM2 — Suporte
  "K-Healer":    "Luz",
  "K-Shield":    "Normal",
  "K-Booster":   "Fogo",
  // KM2 — Exoticos
  "K-Manipuler": "Sombra",
  "K-Miroir":    "Luz",
  "K-Ancora":    "Planta",
  "K-Silencer":  "Sombra",
  "K-Phantom":   "Sombra",
  "K-Drain":     "Sombra",
},

getEfetividade(tipoAtk, tipoDef) {
  const chart = this.tipoChart[tipoAtk];
  if (!chart) return 1.0;
  if (chart.forte.includes(tipoDef)) return 1.5;
  if (chart.fraco.includes(tipoDef)) return 0.5;
  return 1.0;
},

getTipoKreature(nome) {
  return this.kreatureTipos[nome] || "Normal";
},

// ============================================================
// K-Dex — Enciclopedia de Kreatures
// ============================================================
kdexEntries: {
  // Base
  "Piki":        {game:"Base",regiao:"K-Village",evolui_de:null,evolui_para:"Pikron"},
  "Pikron":      {game:"Base",regiao:"K-Village",evolui_de:"Piki",evolui_para:null},
  "K-Bat":       {game:"Base",regiao:"Cavernas",evolui_de:null,evolui_para:"K-Vampire"},
  "K-Vampire":   {game:"Base",regiao:"Cavernas",evolui_de:"K-Bat",evolui_para:null},
  "K-Rat":       {game:"Base",regiao:"Floresta",evolui_de:null,evolui_para:"K-Ratron"},
  "K-Ratron":    {game:"Base",regiao:"Floresta",evolui_de:"K-Rat",evolui_para:null},
  "K-Mega":      {game:"Base",regiao:"Cavernas",evolui_de:null,evolui_para:"K-Megaron"},
  "K-Megaron":   {game:"Base",regiao:"Cavernas",evolui_de:"K-Mega",evolui_para:null},
  "K-Mag":       {game:"Base",regiao:"Lava",evolui_de:null,evolui_para:"K-Magron"},
  "K-Magron":    {game:"Base",regiao:"Lava",evolui_de:"K-Mag",evolui_para:null},
  "K-Waterlim":  {game:"Base",regiao:"Praia",evolui_de:null,evolui_para:"K-Tidalim"},
  "K-Tidalim":   {game:"Base",regiao:"Praia",evolui_de:"K-Waterlim",evolui_para:null},
  "K-Omega":     {game:"Base",regiao:"K-Stadium",evolui_de:null,evolui_para:null},
  // DLC1 — K-Far
  "K-Volkan":    {game:"A Far Planet",regiao:"Vulcão",evolui_de:null,evolui_para:"K-Volcatron"},
  "K-Volcatron": {game:"A Far Planet",regiao:"Vulcão",evolui_de:"K-Volkan",evolui_para:null},
  "Pikstorm":    {game:"A Far Planet",regiao:"Glacial",evolui_de:null,evolui_para:"Pikstorm-X"},
  "Pikstorm-X":  {game:"A Far Planet",regiao:"Glacial",evolui_de:"Pikstorm",evolui_para:null},
  "K-Shadowbat": {game:"A Far Planet",regiao:"Zona Sombria",evolui_de:null,evolui_para:"K-Nightlord"},
  "K-Nightlord": {game:"A Far Planet",regiao:"Zona Sombria",evolui_de:"K-Shadowbat",evolui_para:null},
  "K-Terron":    {game:"A Far Planet",regiao:"Tempestade",evolui_de:null,evolui_para:"K-Terradon"},
  "K-Terradon":  {game:"A Far Planet",regiao:"Tempestade",evolui_de:"K-Terron",evolui_para:null},
  "K-Crystallis":{game:"A Far Planet",regiao:"Cavernas Cristalinas",evolui_de:null,evolui_para:"K-Prism"},
  "K-Prism":     {game:"A Far Planet",regiao:"Cavernas Cristalinas",evolui_de:"K-Crystallis",evolui_para:null},
  "K-Aquaris":   {game:"A Far Planet",regiao:"Glacial",evolui_de:null,evolui_para:"K-Abyssus"},
  "K-Abyssus":   {game:"A Far Planet",regiao:"Glacial",evolui_de:"K-Aquaris",evolui_para:null},
  "K-Spectral":  {game:"A Far Planet",regiao:"Tempestade",evolui_de:null,evolui_para:"K-Radiantis"},
  "K-Radiantis": {game:"A Far Planet",regiao:"Tempestade",evolui_de:"K-Spectral",evolui_para:null},
  "K-Dracovol":  {game:"A Far Planet",regiao:"Vulcão",evolui_de:null,evolui_para:"K-Dracovon"},
  "K-Dracovon":  {game:"A Far Planet",regiao:"Vulcão",evolui_de:"K-Dracovol",evolui_para:null},
  "K-Stoneback": {game:"A Far Planet",regiao:"Cavernas Cristalinas",evolui_de:null,evolui_para:"K-Golemtron"},
  "K-Golemtron": {game:"A Far Planet",regiao:"Cavernas Cristalinas",evolui_de:"K-Stoneback",evolui_para:null},
  "K-Umbra":     {game:"A Far Planet",regiao:"Zona Sombria",evolui_de:null,evolui_para:"K-Voidling"},
  "K-Voidling":  {game:"A Far Planet",regiao:"Zona Sombria",evolui_de:"K-Umbra",evolui_para:null},
  "K-Darkrat":   {game:"A Far Planet",regiao:"Zona Sombria",evolui_de:null,evolui_para:null},
  "K-Sombra":    {game:"A Far Planet",regiao:"Zona Sombria",evolui_de:null,evolui_para:null},
  "K-Corrupto":  {game:"A Far Planet",regiao:"Tempestade",evolui_de:null,evolui_para:null},
  "K-Void":      {game:"A Far Planet",regiao:"Portal do Vazio",evolui_de:null,evolui_para:null},
  "K-Void Renascido":{game:"A Far Planet",regiao:"Portal do Vazio",evolui_de:null,evolui_para:null},
  // KM2 — Suporte
  "K-Healer":    {game:"KM2",regiao:"Área Exótica",evolui_de:null,evolui_para:null},
  "K-Shield":    {game:"KM2",regiao:"Área Exótica",evolui_de:null,evolui_para:null},
  "K-Booster":   {game:"KM2",regiao:"Área Exótica",evolui_de:null,evolui_para:null},
  // KM2 — Exoticos
  "K-Manipuler": {game:"KM2",regiao:"Área Exótica",evolui_de:null,evolui_para:null},
  "K-Miroir":    {game:"KM2",regiao:"Área Exótica",evolui_de:null,evolui_para:null},
  "K-Ancora":    {game:"KM2",regiao:"Área Exótica",evolui_de:null,evolui_para:null},
  "K-Silencer":  {game:"KM2",regiao:"Área Exótica",evolui_de:null,evolui_para:null},
  "K-Phantom":   {game:"KM2",regiao:"Área Exótica",evolui_de:null,evolui_para:null},
  "K-Drain":     {game:"KM2",regiao:"Área Exótica",evolui_de:null,evolui_para:null},
},

// ============================================================
// Conquistas
// ============================================================
conquistas: {
  primeiro_kreature:    {nome:"Primeiro Kreature",       desc:"Capture seu primeiro Kreature",           icone:"🥚"},
  primeira_evolucao:    {nome:"Evolução!",               desc:"Evolua um Kreature pela primeira vez",    icone:"⬆️"},
  primeira_medalha:     {nome:"Medalha de Honra",        desc:"Ganhe sua primeira medalha",              icone:"🏅"},
  vencer_kmaster:       {nome:"Novo K-Master",           desc:"Derrote o K-Master",                      icone:"👑"},
  vencer_komega:        {nome:"Deus dos Kreatures",      desc:"Derrote o K-Omega",                       icone:"💀"},
  todas_base:           {nome:"Colecionador",            desc:"Capture todos os Kreatures base",         icone:"📦"},
  final_secreto:        {nome:"Final Secreto",           desc:"Desbloqueie o final secreto",             icone:"🔮"},
  final_alternativo:    {nome:"Lenda Alternativa",       desc:"Desbloqueie o final alternativo",         icone:"⭐"},
  vencer_kvoid:         {nome:"Caçador do Vazio",        desc:"Derrote o K-Void",                        icone:"🕳️"},
  dez_kreatures:        {nome:"Time Completo",           desc:"Tenha 10 Kreatures diferentes",           icone:"🎯"},
  explorar_tudo_base:   {nome:"Explorador",              desc:"Visite todas as áreas do mapa base",      icone:"🗺️"},
  primeira_captura_far: {nome:"Turista Espacial",        desc:"Capture um Kreature em K-Far",            icone:"🚀"},
  competicao_km2:       {nome:"Campeão da Competition",  desc:"Complete todas as fases da K-Competition", icone:"🏆"},
  pvp_primeira:         {nome:"Rival",                   desc:"Vença sua primeira batalha PvP",          icone:"⚔️"},
},

weightedChoice(tableOrItems, weights) {
  // Supports two formats:
  // 1. weightedChoice({name: weight, ...})  → returns key
  // 2. weightedChoice([item1, ...], [w1, ...]) → returns item
  if (Array.isArray(tableOrItems)) {
    const items = tableOrItems;
    const total = weights.reduce((s, w) => s + w, 0);
    let r = Math.random() * total;
    for (let i = 0; i < items.length; i++) {
      r -= weights[i];
      if (r <= 0) return items[i];
    }
    return items[items.length - 1];
  }
  const entries = Object.entries(tableOrItems);
  const total = entries.reduce((s,[,w])=>s+w,0);
  let r = Math.random()*total;
  for(const [name,weight] of entries) {
    r -= weight;
    if(r <= 0) return name;
  }
  return entries[entries.length-1][0];
},

};
