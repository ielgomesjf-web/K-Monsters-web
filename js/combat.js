// combat.js — K-Monsters: All combat systems
// Global object: KMCombat

const KMCombat = {

// ============================================================
// COMBAT 1 — Começo.py (simplified Piki vs K-Bat)
// ============================================================
async combateComeco() {
  const E = KMEngine;
  let vidaPIKI = 15, vidaKBAT = 10;
  let bonus = 0, bloqueio = 0;
  let KSKusada = false, KSKKusada = false;
  let bloqueioKBAT = 0, bonusKB = 0, debuff = 0, turnostravado = 0;

  E.print("O combate começa !");
  E.separator();

  while (vidaPIKI > 0 && vidaKBAT > 0) {
    E.print(`Vida Piki: ${vidaPIKI} | Vida K-Bat: ${vidaKBAT}`);

    const opts = [
      {label: '1 - Atacar', value: '1'},
      {label: '2 - Defender', value: '2'},
    ];
    if (!KSKusada) opts.push({label: '3 - Trava Dourada (1 uso)', value: '3'});
    const escolha = await E.choice(opts);

    if (escolha === '1') {
      E.print("Piki ataca !");
      let dano = 3;
      let danocausado = dano + bonus - bloqueioKBAT - debuff;
      if (danocausado < 0) danocausado = 0;
      vidaKBAT -= danocausado;
      E.print(`incrível ! Piki causou ${danocausado} de dano !`);
      await E.sleep(2000);
      bonus = 0; bloqueioKBAT = 0; debuff = 0;
      turnostravado -= 1;
    } else if (escolha === '2') {
      E.print("Piki defende !");
      bloqueio += 3; bonus += 1;
      turnostravado -= 1;
    } else if (escolha === '3' && !KSKusada) {
      E.print("Piki usa Trava Dourada !");
      turnostravado = 1; KSKusada = true;
    }

    if (vidaKBAT <= 0) break;

    // Turno do K-Bat
    const ataqueKB = Math.floor(Math.random() * 3) + 1;
    if (ataqueKB === 1) {
      if (turnostravado <= 0) {
        E.print("O K-Bat ataca !");
        let danoKB = 3 - 2 + bonusKB - bloqueio;
        if (danoKB < 0) danoKB = 0;
        vidaPIKI -= danoKB;
        E.print(`Piki tomou ${danoKB} !`);
        bloqueio = 0;
      } else {
        E.print("O K-Bat fica mais preso ainda !");
        turnostravado += 1;
      }
    } else if (ataqueKB === 3 && !KSKKusada) {
      E.print("Oh não ! K-Bat usou Empurrão de vento !");
      debuff = 3; KSKKusada = true;
    } else {
      E.print("K-Bat se protege !");
      bloqueioKBAT += 1; bonusKB += 1;
    }
    await E.sleep(1000);
  }

  if (vidaKBAT <= 0) {
    E.print("Piki venceu o K-Bat !");
    return true;
  } else {
    E.print("Piki foi derrotada...");
    return false;
  }
},

// ============================================================
// COMBAT 2 — combate.py (base game, team combat with medals)
// ============================================================
async combateBase(nomeJogador, nomeInimigo, timeJogador, medalhaData) {
  const E = KMEngine;
  const stats = KMData.baseStats;
  if (!stats[nomeJogador] || !stats[nomeInimigo]) {
    E.print("Kreature não reconhecido !");
    return false;
  }
  if (!timeJogador) timeJogador = [nomeJogador];
  if (!medalhaData) medalhaData = KMSave.getBaseMedalhas();

  // Build player team
  const timeVidas = {};
  for (const nome of timeJogador) {
    if (!stats[nome]) continue;
    const s = stats[nome];
    let vida = s.vida, dano = s.dano;
    const qtd = medalhaData[nome] || 0;
    if (qtd > 0) {
      const mult = Math.pow(1.8, qtd);
      vida = Math.floor(vida * mult);
      dano = Math.floor(dano * mult);
    }
    timeVidas[nome] = {
      vida, vida_max: vida, dano, kskill: s.kskill,
      kskill_efeito: s.kskill_efeito, kskill_usada: false,
      bonus: 0, bloqueio: 0, medalhas: qtd,
    };
  }

  let atual = nomeJogador;
  const statsI = stats[nomeInimigo];
  let vidaI = statsI.vida, danoI = statsI.dano;
  let bloqueioI = 0, bonusI = 0, debuff = 0, turnostravado = 0;
  let KSKIusada = false;

  E.print("O combate começa !");
  E.separator();

  while (vidaI > 0) {
    let kj = timeVidas[atual];

    // Auto-switch if current dead
    if (kj.vida <= 0) {
      E.print(`${atual} foi derrotado !`);
      const vivos = Object.keys(timeVidas).filter(n => timeVidas[n].vida > 0);
      if (vivos.length === 0) break;
      atual = vivos[0]; kj = timeVidas[atual];
      E.print(`${atual} entra na batalha !`);
    }

    // Show team
    if (Object.keys(timeVidas).length > 1) {
      let teamTxt = 'Time: ';
      for (const [nome, s] of Object.entries(timeVidas)) {
        const m = nome === atual ? '>>>' : '   ';
        const st = s.vida > 0 ? `${s.vida}/${s.vida_max}` : 'FORA';
        teamTxt += `${m} ${nome}: ${st}  `;
      }
      E.print(teamTxt);
    }

    E.print(`\nVida ${atual}: ${kj.vida}/${kj.vida_max} | Vida ${nomeInimigo}: ${vidaI}`);

    const usos = kj.kskill_usada ? '0 uso(s)' : '1 uso';
    const opts = [
      {label: '1 - Atacar', value: '1'},
      {label: '2 - Defender', value: '2'},
      {label: `3 - ${kj.kskill} (${usos})`, value: '3'},
    ];
    if (Object.keys(timeVidas).length > 1) opts.push({label: '4 - Trocar Kreature', value: '4'});
    const escolha = await E.choice(opts);

    if (escolha === '1') {
      E.print(`${atual} ataca !`);
      let danocausado = kj.dano + kj.bonus - bloqueioI - debuff;
      if (danocausado < 0) danocausado = 0;
      vidaI -= danocausado;
      E.print(`Incrível ! ${atual} causou ${danocausado} de dano !`);
      await E.sleep(2000);
      kj.bonus = 0; bloqueioI = 0; debuff = 0;
      if (turnostravado > 0) turnostravado--;
    } else if (escolha === '2') {
      E.print(`${atual} defende !`);
      kj.bloqueio += 3; kj.bonus += 1;
      if (turnostravado > 0) turnostravado--;
    } else if (escolha === '3' && !kj.kskill_usada) {
      const efeito = kj.kskill_efeito;
      E.print(`${atual} usa ${kj.kskill} !`);
      kj.kskill_usada = true;
      if (efeito === 'trava') turnostravado = 2;
      else if (efeito === 'debuff') debuff = 3;
      else if (efeito === 'dano_extra') {
        const d = kj.dano + 2; vidaI -= d;
        E.print(`Causou ${d} de dano extra !`);
      } else if (efeito === 'bonus_forte') kj.bonus += 4;
      else if (efeito === 'cura') {
        kj.vida = Math.min(kj.vida + 5, kj.vida_max);
        E.print(`${atual} recuperou vida ! Vida: ${kj.vida}`);
      }
      if (turnostravado > 0) turnostravado--;
    } else if (escolha === '4' && Object.keys(timeVidas).length > 1) {
      const vivos = Object.keys(timeVidas).filter(n => n !== atual && timeVidas[n].vida > 0);
      if (vivos.length === 0) { E.print("Não há outros Kreatures disponíveis !"); continue; }
      const opts2 = vivos.map((n, i) => ({
        label: `${i + 1} - ${n} (${timeVidas[n].vida}/${timeVidas[n].vida_max} HP)`, value: String(i)
      }));
      const idx = parseInt(await E.choice(opts2));
      if (idx >= 0 && idx < vivos.length) {
        E.print(`${atual}, volte !`);
        atual = vivos[idx]; kj = timeVidas[atual];
        E.print(`Vai, ${atual} !`);
      }
    } else {
      E.print("Escolha inválida ou K-Skill já usada !");
      continue;
    }

    if (vidaI <= 0) break;

    // Enemy turn
    const ataqueI = Math.floor(Math.random() * 3) + 1;
    if (ataqueI === 1) {
      if (turnostravado <= 0) {
        E.print(`O ${nomeInimigo} ataca !`);
        let danoR = danoI + bonusI - kj.bloqueio;
        if (danoR < 0) danoR = 0;
        kj.vida -= danoR;
        E.print(`${atual} tomou ${danoR} de dano !`);
        kj.bloqueio = 0; bonusI = 0;
      } else {
        E.print(`O ${nomeInimigo} está travado e não consegue agir !`);
      }
    } else if (ataqueI === 3 && !KSKIusada) {
      const ef = statsI.kskill_efeito;
      E.print(`Oh não ! ${nomeInimigo} usou ${statsI.kskill} !`);
      KSKIusada = true;
      if (ef === 'trava') { kj.bonus = 0; kj.bloqueio = 0; E.print(`${atual} perdeu seus bônus !`); }
      else if (ef === 'debuff') debuff = 2;
      else if (ef === 'dano_extra') { const d = danoI + 2; kj.vida -= d; E.print(`${atual} tomou ${d} de dano extra !`); }
      else if (ef === 'bonus_forte') bonusI += 4;
      else if (ef === 'cura') { vidaI = Math.min(vidaI + 5, statsI.vida); E.print(`${nomeInimigo} recuperou vida !`); }
    } else {
      if (turnostravado <= 0) {
        E.print(`${nomeInimigo} se protege !`);
        bloqueioI += 1; bonusI += 1;
      } else {
        E.print(`O ${nomeInimigo} está travado e não consegue agir !`);
      }
    }
    await E.sleep(1000);
  }

  E.separator();
  if (vidaI <= 0) {
    E.print(`${atual} venceu o ${nomeInimigo} !`);
    return true;
  } else {
    E.print("Todos os seus Kreatures foram derrotados...");
    return false;
  }
},

// ============================================================
// Helper: DLC1 K-Skill player effects
// ============================================================
_aplicarKSkillDlc1(efeito, kj, vidaI, turnostravado, debuff) {
  const E = KMEngine;
  if (efeito === 'trava') turnostravado = 2;
  else if (efeito === 'debuff') debuff = 3;
  else if (efeito === 'dano_extra') { const d = kj.dano + 2; vidaI -= d; E.print(`Causou ${d} de dano extra!`); }
  else if (efeito === 'bonus_forte') kj.bonus += 4;
  else if (efeito === 'cura') { kj.vida = Math.min(kj.vida + 5, kj.vida_max); E.print(`Recuperou vida! Vida: ${kj.vida}`); }
  else if (efeito === 'dano_extra_forte') { const d = kj.dano * 2; vidaI -= d; E.print(`DEVASTADOR! Causou ${d} de dano!`); }
  else if (efeito === 'debuff_cura') { debuff = 4; kj.vida = Math.min(kj.vida + 8, kj.vida_max); E.print(`Debuff aplicado! Recuperou 8 de vida!`); }
  else if (efeito === 'cura_forte') { kj.vida = Math.min(kj.vida + 15, kj.vida_max); E.print(`Drenou a alma! Recuperou 15 de vida! Vida: ${kj.vida}`); }
  else if (efeito === 'trava_dano') { turnostravado = 2; const d = kj.dano + 4; vidaI -= d; E.print(`Terremoto! Inimigo travado e tomou ${d} de dano!`); }
  else if (efeito === 'bloqueio_forte') { kj.bloqueio += 10; kj.bonus += 3; E.print("Bloqueio +10 e Bônus +3!"); }
  else if (efeito === 'cura_gelada') { kj.vida = Math.min(kj.vida + 10, kj.vida_max); debuff = 2; E.print(`Maré Gelada! Recuperou 10 de vida e debuffou o inimigo!`); }
  else if (efeito === 'rajada_draconica') { kj.bonus += 3; const d = Math.floor(kj.dano / 2); vidaI -= d; E.print(`Rajada Dracônica! Bônus +3 e causou ${d} de dano imediato!`); }
  else if (efeito === 'debuff_total') { debuff = 5; E.print("Toque do Vazio! Inimigo fica extremamente fraco!"); }
  return { vidaI, turnostravado, debuff };
},

// ============================================================
// COMBAT 3 — combate_dlc.py (DLC1 combat with crystals)
// ============================================================
async combateDlc1(nomeJogador, nomeInimigo, timeJogadorNomes, medalhaData, cristalData) {
  const E = KMEngine;
  const stats = KMData.dlc1Stats;
  if (!stats[nomeJogador] || !stats[nomeInimigo]) { E.print("Kreature não reconhecido!"); return false; }
  if (!timeJogadorNomes) timeJogadorNomes = [nomeJogador];
  if (!medalhaData) medalhaData = {};
  if (!cristalData) cristalData = KMSave.getDlc1Cristais();

  const KFAR = KMData.KREATURES_PLANETA;

  function getBoost(nome) {
    const s = stats[nome]; if (!s) return {vida:0,dano:0};
    let vida = s.vida, dano = s.dano;
    if (KFAR.has(nome)) { const q = cristalData[nome] || 0; if (q > 0) { const m = Math.pow(1.5, q); vida = Math.floor(vida * m); dano = Math.floor(dano * m); } }
    else { const q = medalhaData[nome] || 0; if (q > 0) { const m = Math.pow(1.8, q); vida = Math.floor(vida * m); dano = Math.floor(dano * m); } }
    return { vida, dano };
  }

  const timeVidas = {};
  for (const nome of timeJogadorNomes) {
    if (!stats[nome]) continue;
    const s = stats[nome];
    const { vida, dano } = getBoost(nome);
    timeVidas[nome] = {
      vida, vida_max: vida, dano, kskill: s.kskill,
      kskill_efeito: s.kskill_efeito, kskill_usada: false,
      bonus: 0, bloqueio: 0,
    };
  }

  let atual = nomeJogador;
  const statsI = stats[nomeInimigo];
  let vidaI = statsI.vida, danoI = statsI.dano;
  let bloqueioI = 0, bonusI = 0, debuff = 0, turnostravado = 0, KSKIusada = false;

  E.print("O combate começa!"); E.separator();

  while (vidaI > 0) {
    let kj = timeVidas[atual];
    if (kj.vida <= 0) {
      E.print(`${atual} foi derrotado!`);
      const vivos = Object.keys(timeVidas).filter(n => timeVidas[n].vida > 0);
      if (!vivos.length) break;
      atual = vivos[0]; kj = timeVidas[atual];
      E.print(`${atual} entra na batalha!`);
    }

    if (Object.keys(timeVidas).length > 1) {
      let t = '\nTime: ';
      for (const [n, s] of Object.entries(timeVidas)) {
        t += `${n === atual ? '>>>' : '   '} ${n}: ${s.vida > 0 ? s.vida + '/' + s.vida_max : 'FORA'}  `;
      }
      E.print(t);
    }

    E.print(`\nVida ${atual}: ${kj.vida}/${kj.vida_max} | Vida ${nomeInimigo}: ${vidaI}`);
    const usos = kj.kskill_usada ? '0 uso(s)' : '1 uso';
    const opts = [
      {label: '1 - Atacar', value: '1'}, {label: '2 - Defender', value: '2'},
      {label: `3 - ${kj.kskill} (${usos})`, value: '3'},
    ];
    if (Object.keys(timeVidas).length > 1) opts.push({label: '4 - Trocar Kreature', value: '4'});
    const escolha = await E.choice(opts);

    if (escolha === '1') {
      let d = Math.max(0, kj.dano + kj.bonus - bloqueioI - debuff);
      vidaI -= d;
      E.print(`${atual} ataca! Causou ${d} de dano!`);
      await E.sleep(1000);
      kj.bonus = 0; bloqueioI = 0; debuff = 0;
      if (turnostravado > 0) turnostravado--;
    } else if (escolha === '2') {
      E.print(`${atual} defende!`); kj.bloqueio += 3; kj.bonus += 1;
      if (turnostravado > 0) turnostravado--;
    } else if (escolha === '3' && !kj.kskill_usada) {
      E.print(`${atual} usa ${kj.kskill}!`); kj.kskill_usada = true;
      const r = this._aplicarKSkillDlc1(kj.kskill_efeito, kj, vidaI, turnostravado, debuff);
      vidaI = r.vidaI; turnostravado = r.turnostravado; debuff = r.debuff;
      if (turnostravado > 0) turnostravado--;
    } else if (escolha === '4' && Object.keys(timeVidas).length > 1) {
      const vivos = Object.keys(timeVidas).filter(n => n !== atual && timeVidas[n].vida > 0);
      if (!vivos.length) { E.print("Não há outros Kreatures disponíveis!"); continue; }
      const o2 = vivos.map((n, i) => ({label: `${i+1} - ${n} (${timeVidas[n].vida}/${timeVidas[n].vida_max} HP)`, value: String(i)}));
      const idx = parseInt(await E.choice(o2));
      if (idx >= 0 && idx < vivos.length) { E.print(`${atual}, volte!`); atual = vivos[idx]; E.print(`Vai, ${atual}!`); }
    } else { E.print("Escolha inválida ou K-Skill já usada!"); continue; }

    if (vidaI <= 0) break;

    // Enemy turn
    const a = Math.floor(Math.random() * 3) + 1;
    kj = timeVidas[atual];
    if (a === 1) {
      if (turnostravado <= 0) {
        const d = Math.max(0, danoI + bonusI - kj.bloqueio);
        kj.vida -= d;
        E.print(`O ${nomeInimigo} ataca! ${atual} tomou ${d} de dano!`);
        kj.bloqueio = 0; bonusI = 0;
      } else { E.print(`O ${nomeInimigo} está travado!`); turnostravado--; }
    } else if (a === 3 && !KSKIusada) {
      const ef = statsI.kskill_efeito;
      E.print(`Oh não! ${nomeInimigo} usou ${statsI.kskill}!`); KSKIusada = true;
      if (ef === 'dano_extra' || ef === 'dano_extra_forte') {
        const m = ef === 'dano_extra_forte' ? 2 : 1; const d = danoI + 2 * m; kj.vida -= d; E.print(`${atual} tomou ${d} de dano extra!`);
      } else if (ef === 'debuff' || ef === 'debuff_cura') debuff = 2;
      else if (ef === 'debuff_total') debuff = 4;
      else if (ef === 'trava') { kj.bonus = 0; kj.bloqueio = 0; E.print(`${atual} perdeu seus bônus!`); }
      else if (ef === 'trava_dano') { const d = danoI + 3; kj.vida -= d; E.print(`${atual} tomou ${d} de dano extra!`); }
      else if (ef === 'cura' || ef === 'cura_forte' || ef === 'cura_gelada') {
        const c = {cura:5, cura_forte:10, cura_gelada:8}[ef] || 5;
        vidaI = Math.min(vidaI + c, statsI.vida); E.print(`${nomeInimigo} recuperou ${c} de vida!`);
      } else if (ef === 'bonus_forte' || ef === 'rajada_draconica') bonusI += 4;
      else if (ef === 'bloqueio_forte') bloqueioI += 6;
    } else {
      if (turnostravado <= 0) { E.print(`${nomeInimigo} se protege!`); bloqueioI += 1; bonusI += 1; }
      else { E.print(`${nomeInimigo} está travado!`); turnostravado--; }
    }
    await E.sleep(1000);
  }

  E.separator();
  if (vidaI <= 0) { E.print(`${atual} venceu o ${nomeInimigo}!`); return true; }
  else { E.print("Todos os seus Kreatures foram derrotados..."); return false; }
},

// ============================================================
// COMBAT 4 — DLC2 team vs team (combate_equipe)
// ============================================================
async combateEquipeDlc2(timeNomes, inimigosNomes, medalhas, cristais, kvoidPresente) {
  const E = KMEngine;
  const stats = KMData.dlc1Stats;
  const KFAR = KMData.KREATURES_PLANETA;

  function getBoost(nome) {
    const s = stats[nome]; if (!s) return {vida:0,dano:0};
    let vida = s.vida, dano = s.dano;
    if (KFAR.has(nome)) { const q = (cristais||{})[nome]||0; if(q>0){const m=Math.pow(1.5,q);vida=Math.floor(vida*m);dano=Math.floor(dano*m);}}
    else { const q = (medalhas||{})[nome]||0; if(q>0){const m=Math.pow(1.8,q);vida=Math.floor(vida*m);dano=Math.floor(dano*m);}}
    return {vida,dano};
  }

  // Build player team
  const timeJogador = {};
  for (const nome of timeNomes) {
    if (!stats[nome]) continue;
    const s = stats[nome];
    const {vida,dano} = getBoost(nome);
    timeJogador[nome] = {
      vida, vida_max:vida, dano, kskill:s.kskill, kskill_efeito:s.kskill_efeito,
      kskill_usada:false, bonus:0, bloqueio:0,
    };
  }
  if (!Object.keys(timeJogador).length) return false;

  // Build enemy team (with suffixes for duplicates)
  const inimigos = {};
  const contagem = {};
  for (const nome of inimigosNomes) {
    if (!stats[nome]) continue;
    contagem[nome] = (contagem[nome]||0) + 1;
    const dupes = inimigosNomes.filter(n => n === nome).length;
    const chave = dupes > 1 ? `${nome} #${contagem[nome]}` : nome;
    const s = stats[nome];
    inimigos[chave] = {
      nome_display:nome, vida:s.vida, vida_max:s.vida, dano:s.dano,
      kskill:s.kskill, kskill_efeito:s.kskill_efeito,
      kskill_usada:false, bonus:0, bloqueio:0,
    };
  }
  if (!Object.keys(inimigos).length) return false;

  let atual = Object.keys(timeJogador)[0];
  let kvoidEntrou = false;

  const KVOID_JOGAVEL = {
    vida:150, vida_max:150, dano:40, kskill:"Eco do Vazio",
    kskill_efeito:"eco_do_vazio", kskill_usada:false, bonus:0, bloqueio:0,
  };

  E.print(`\nVocê encontra uma equipe: ${inimigosNomes.join(', ')}`);
  E.print("O combate começa!");
  E.separator();

  while (true) {
    const inVivos = Object.fromEntries(Object.entries(inimigos).filter(([,v])=>v.vida>0));
    const tVivos = Object.keys(timeJogador).filter(n=>timeJogador[n].vida>0);
    if (!Object.keys(inVivos).length || !tVivos.length) break;

    let kj = timeJogador[atual];
    if (kj.vida <= 0) {
      E.print(`\n${atual} foi derrotado!`);
      // Check K-Void
      if (kvoidPresente && !kvoidEntrou && tVivos.length <= 3 && Math.random() < 0.01) {
        kvoidEntrou = true;
        E.print("\n..."); await E.sleep(2000);
        E.print("O K-Void Purificado para de andar."); await E.sleep(2000);
        E.print("Ele olha para a batalha."); await E.sleep(3000);
        E.print("'...'"); await E.sleep(2000);
        E.print("\n!!! O K-VOID ENTRA NA BATALHA !!!", 'boss-text'); await E.sleep(2000);
        timeJogador["K-Void Purificado"] = {...KVOID_JOGAVEL};
        atual = "K-Void Purificado"; kj = timeJogador[atual];
        E.separator(); continue;
      }
      const vivos2 = Object.keys(timeJogador).filter(n=>timeJogador[n].vida>0);
      if (!vivos2.length) break;
      atual = vivos2[0]; kj = timeJogador[atual];
      E.print(`${atual} entra na batalha!`);
    }

    // HUD
    E.print("\n--- SEU TIME ---");
    for (const [n, s] of Object.entries(timeJogador)) {
      const m = n === atual ? ' >>>' : '    ';
      E.print(`${m} ${n}: ${s.vida > 0 ? s.vida + '/' + s.vida_max + ' HP' : 'FORA'}`);
    }
    E.print("\n--- INIMIGOS ---");
    for (const [ch, e] of Object.entries(inimigos)) {
      if (e.vida > 0) E.print(`  [${ch}] ${e.nome_display}: ${e.vida}/${e.vida_max} HP`);
    }

    const usos = kj.kskill_usada ? '0 uso(s)' : '1 uso';
    const opts = [
      {label:'1 - Atacar',value:'1'},{label:'2 - Defender',value:'2'},
      {label:`3 - ${kj.kskill} (${usos})`,value:'3'},
      {label:'4 - Trocar Kreature',value:'4'},
    ];
    const escolha = await E.choice(opts);

    const inVivos2 = Object.fromEntries(Object.entries(inimigos).filter(([,v])=>v.vida>0));
    const alvosKeys = Object.keys(inVivos2);

    if (escolha === '1') {
      let alvoKey;
      if (alvosKeys.length === 1) alvoKey = alvosKeys[0];
      else {
        const ao = alvosKeys.map((k,i) => ({label:`${i+1} - ${inimigos[k].nome_display} (${inimigos[k].vida}/${inimigos[k].vida_max} HP)`,value:String(i)}));
        const ai = parseInt(await E.choice(ao));
        alvoKey = alvosKeys[ai] || alvosKeys[0];
      }
      const e = inimigos[alvoKey];
      const d = Math.max(0, kj.dano + kj.bonus - e.bloqueio);
      e.vida -= d;
      E.print(`${atual} ataca ${e.nome_display}! Causou ${d} de dano!`);
      await E.sleep(1000); kj.bonus = 0; e.bloqueio = 0;
    } else if (escolha === '2') {
      E.print(`${atual} defende!`); kj.bloqueio += 4; kj.bonus += 1;
    } else if (escolha === '3' && !kj.kskill_usada) {
      E.print(`${atual} usa ${kj.kskill}!`); kj.kskill_usada = true;
      if (kj.kskill_efeito === 'eco_do_vazio') {
        E.print("\nO K-Void fecha os olhos."); await E.sleep(1000);
        E.print("O ar fica frio."); await E.sleep(2000);
        for (const e of Object.values(inVivos2)) {
          const d = Math.floor(kj.dano / 2);
          e.vida -= d; E.print(`  ${e.nome_display} tomou ${d} de dano!`);
        }
      } else {
        // Damage effects target first enemy
        const efDano = ['dano_extra','dano_extra_forte','trava_dano','rajada_draconica'];
        if (efDano.includes(kj.kskill_efeito) && alvosKeys.length) {
          let fakeVida = inVivos2[alvosKeys[0]].vida;
          const r = this._aplicarKSkillDlc1(kj.kskill_efeito, kj, fakeVida, 0, 0);
          inVivos2[alvosKeys[0]].vida = r.vidaI;
        } else {
          this._aplicarKSkillDlc1(kj.kskill_efeito, kj, 0, 0, 0);
        }
      }
    } else if (escolha === '4') {
      const disp = Object.keys(timeJogador).filter(n => n !== atual && timeJogador[n].vida > 0);
      if (!disp.length) { E.print("Não há outros Kreatures disponíveis!"); continue; }
      const o2 = disp.map((n,i)=>({label:`${i+1} - ${n} (${timeJogador[n].vida}/${timeJogador[n].vida_max} HP)`,value:String(i)}));
      const idx = parseInt(await E.choice(o2));
      if (idx >= 0 && idx < disp.length) { atual = disp[idx]; E.print(`Vai, ${atual}!`); }
    } else { E.print("Escolha inválida ou K-Skill já usada!"); continue; }

    if (!Object.values(inimigos).some(v => v.vida > 0)) break;

    // Enemy turns
    await E.sleep(500);
    const inVivos3 = Object.values(inimigos).filter(v => v.vida > 0);
    for (const e of inVivos3) {
      const tv = Object.keys(timeJogador).filter(n => timeJogador[n].vida > 0);
      if (!tv.length) break;
      const alvoNome = tv[Math.floor(Math.random() * tv.length)];
      const alvo = timeJogador[alvoNome];
      const acao = KMData.weightedChoice([1,2,3],[60,20,20]);
      if (acao === 1) {
        const d = Math.max(0, e.dano + e.bonus - alvo.bloqueio);
        alvo.vida -= d;
        E.print(`${e.nome_display} ataca ${alvoNome}! Tomou ${d} de dano!`);
        alvo.bloqueio = 0; e.bonus = 0;
      } else if (acao === 2) {
        E.print(`${e.nome_display} se prepara...`); e.bonus += 2; e.bloqueio += 1;
      } else if (acao === 3 && !e.kskill_usada) {
        const ef = e.kskill_efeito;
        E.print(`!!! ${e.nome_display} usa ${e.kskill}!`); e.kskill_usada = true;
        if (ef === 'dano_extra' || ef === 'dano_extra_forte') {
          const m = ef === 'dano_extra_forte' ? 2 : 1;
          const d = e.dano + 2 * m; alvo.vida -= d; E.print(`${alvoNome} tomou ${d} de dano extra!`);
        } else if (ef === 'cura' || ef === 'cura_forte' || ef === 'cura_gelada') {
          const c = {cura:5,cura_forte:12,cura_gelada:8}[ef]||5;
          e.vida = Math.min(e.vida + c, e.vida_max); E.print(`${e.nome_display} recuperou ${c} de vida!`);
        } else if (ef === 'bloqueio_forte') { e.bloqueio += 8; E.print(`${e.nome_display} forma uma barreira!`); }
        else if (ef === 'trava_dano') { const d = e.dano + 3; alvo.vida -= d; E.print(`${alvoNome} tomou ${d} de dano extra!`); }
        else { const d = Math.max(0, e.dano - alvo.bloqueio); alvo.vida -= d; E.print(`${e.nome_display} ataca com força! ${alvoNome} tomou ${d}!`); alvo.bloqueio = 0; }
      } else {
        E.print(`${e.nome_display} se protege!`); e.bloqueio += 1; e.bonus += 1;
      }
      await E.sleep(800);
    }

    // Check K-Void after enemy turns
    const tvAfter = Object.keys(timeJogador).filter(n => timeJogador[n].vida > 0);
    if (kvoidPresente && !kvoidEntrou && tvAfter.length <= 3 && Math.random() < 0.01) {
      kvoidEntrou = true;
      E.print("\n..."); await E.sleep(2000);
      E.print("!!! O K-VOID ENTRA NA BATALHA !!!", 'boss-text');
      timeJogador["K-Void Purificado"] = {...KVOID_JOGAVEL};
      if (timeJogador[atual].vida <= 0) atual = "K-Void Purificado";
    }

    E.separator();
  }

  if (!Object.values(inimigos).some(v => v.vida > 0)) {
    E.print("\nVocê venceu a batalha!"); return true;
  } else {
    E.print("\nTodos os seus Kreatures foram derrotados..."); return false;
  }
},

// ============================================================
// COMBAT 5 — DLC3 K-Omega combat
// ============================================================
async combateKOmega(komega, inimigosNomes) {
  const E = KMEngine;
  const STATS = KMData.dlc3InimigoStats;
  const KSKILLS = KMData.dlc3KSkills;
  const ABSORCAO = KMData.dlc3AbsorcaoSkills;

  // Build enemy team
  const inimigos = {};
  const cnt = {};
  for (const nome of inimigosNomes) {
    if (!STATS[nome]) continue;
    cnt[nome] = (cnt[nome]||0) + 1;
    const dupes = inimigosNomes.filter(n => n === nome).length;
    const chave = dupes > 1 ? `${nome} #${cnt[nome]}` : nome;
    const s = STATS[nome];
    inimigos[chave] = {
      nome_display:nome, vida:s.vida, vida_max:s.vida, dano:s.dano,
      kskill:s.kskill, kskill_usada:false, bonus:0, bloqueio:0,
    };
  }
  if (!Object.keys(inimigos).length) return { venceu:true, komega, absorvido:null };

  const kskillsUsadas = new Set();
  let koVida = komega.vida_max;
  let koBloqueio = 0, koBonus = 0;

  E.print("\nO combate começa!"); E.print('─'.repeat(70), 'separator');

  while (true) {
    const vivos = Object.fromEntries(Object.entries(inimigos).filter(([,v])=>v.vida>0));
    if (!Object.keys(vivos).length || koVida <= 0) break;

    E.print(`\nK-OMEGA: ${koVida}/${komega.vida_max} HP`);
    E.print("Inimigos:");
    for (const e of Object.values(vivos)) E.print(`  ${e.nome_display}: ${e.vida}/${e.vida_max} HP`);

    const skillsDisp = komega.kskills.filter(s => !kskillsUsadas.has(s));
    const opts = [{label:'1 - Atacar',value:'1'},{label:'2 - Defender',value:'2'}];
    if (skillsDisp.length) opts.push({label:'3 - K-Skill',value:'3'});
    const escolha = await E.choice(opts);

    const alvosKeys = Object.keys(vivos);

    if (escolha === '1') {
      let alvoKey;
      if (alvosKeys.length === 1) alvoKey = alvosKeys[0];
      else {
        const ao = alvosKeys.map((k,i)=>({label:`${i+1} - ${vivos[k].nome_display} (${vivos[k].vida}/${vivos[k].vida_max} HP)`,value:String(i)}));
        const ai = parseInt(await E.choice(ao));
        alvoKey = alvosKeys[ai] || alvosKeys[0];
      }
      const e = inimigos[alvoKey];
      const d = Math.max(0, komega.dano + koBonus - e.bloqueio);
      e.vida -= d;
      E.print(`K-Omega ataca ${e.nome_display}! Causou ${d} de dano!`);
      await E.sleep(1000); koBonus = 0; e.bloqueio = 0;
    } else if (escolha === '2') {
      E.print("K-Omega se prepara..."); koBloqueio += 5; koBonus += 2;
    } else if (escolha === '3' && skillsDisp.length) {
      const so = skillsDisp.map((s,i) => ({label:`${i+1} - ${s}: ${KSKILLS[s].desc}`, value:String(i)}));
      so.push({label:'0 - Cancelar', value:'-1'});
      const si = parseInt(await E.choice(so));
      if (si < 0 || si >= skillsDisp.length) continue;
      const sk = skillsDisp[si];
      kskillsUsadas.add(sk);
      const tipo = KSKILLS[sk].tipo;
      E.print(`\nK-Omega usa ${sk}!`); await E.sleep(1000);
      const vivos2 = Object.fromEntries(Object.entries(inimigos).filter(([,v])=>v.vida>0));

      if (tipo === 'dano_forte') {
        let ak; const aks = Object.keys(vivos2);
        if (aks.length===1) ak=aks[0];
        else { const ao=aks.map((k,i)=>({label:`${i+1}-${vivos2[k].nome_display}`,value:String(i)})); const ai=parseInt(await E.choice(ao)); ak=aks[ai]||aks[0]; }
        const e=inimigos[ak]; const d=Math.floor(komega.dano*1.5); e.vida-=d;
        E.print(`RUGIDO! ${e.nome_display} tomou ${d} de dano!`);
      } else if (tipo === 'drenar') {
        let ak; const aks=Object.keys(vivos2);
        if(aks.length===1) ak=aks[0];
        else{const ao=aks.map((k,i)=>({label:`${i+1}-${vivos2[k].nome_display}`,value:String(i)}));const ai=parseInt(await E.choice(ao));ak=aks[ai]||aks[0];}
        const e=inimigos[ak]; const d=komega.dano; e.vida-=d;
        const c=Math.floor(d/2); koVida=Math.min(koVida+c,komega.vida_max);
        E.print(`K-Omega drena ${d} de ${e.nome_display}! Recuperou ${c} HP!`);
      } else if (tipo === 'destruir_bonus') {
        const dl = Math.max(1, Math.floor(komega.dano/3));
        for (const e of Object.values(vivos2)) { e.bonus=0; e.bloqueio=0; e.vida-=dl; E.print(`  ${e.nome_display} perdeu os bônus e tomou ${dl}!`); }
      } else if (tipo === 'aoe') {
        for (const e of Object.values(vivos2)) { e.vida -= komega.dano; E.print(`  ${e.nome_display} tomou ${komega.dano} de dano!`); }
      } else if (tipo === 'cura') {
        koVida = Math.min(koVida + 40, komega.vida_max);
        E.print(`K-Omega se recupera! +40 HP. (${koVida}/${komega.vida_max})`);
      }
      await E.sleep(1000);
    } else continue;

    if (!Object.values(inimigos).some(v => v.vida > 0)) break;

    // Enemy turns
    await E.sleep(500);
    for (const e of Object.values(inimigos).filter(v => v.vida > 0)) {
      if (koVida <= 0) break;
      const acao = KMData.weightedChoice([1,2,3],[60,20,20]);
      if (acao === 1) {
        const d = Math.max(0, e.dano + e.bonus - koBloqueio);
        koVida -= d; E.print(`${e.nome_display} ataca! K-Omega tomou ${d} de dano!`);
        koBloqueio = 0; e.bonus = 0;
      } else if (acao === 2) {
        E.print(`${e.nome_display} se prepara...`); e.bonus += 2; e.bloqueio += 1;
      } else if (acao === 3 && !e.kskill_usada) {
        E.print(`!!! ${e.nome_display} usa ${e.kskill}!`); e.kskill_usada = true;
        const d = e.dano + 2; koVida -= d; E.print(`K-Omega tomou ${d} de dano!`);
      } else E.print(`${e.nome_display} aguarda.`);
      await E.sleep(700);
    }
    E.print('─'.repeat(70), 'separator');
  }

  const venceu = koVida > 0 && !Object.values(inimigos).some(v => v.vida > 0);
  if (!venceu) { E.print("\nK-Omega foi derrotado..."); return { venceu:false, komega, absorvido:null }; }

  E.print("\nK-Omega venceu!");

  // Absorption offer
  const absorvivel = [...new Set(
    Object.values(inimigos).map(v => v.nome_display)
      .filter(n => ABSORCAO[n] && !komega.absorcoes.includes(n))
  )];

  let absorvido = null;
  if (absorvivel.length) {
    E.print("\nAbsorver um Kreature derrotado ?");
    const ao = absorvivel.map((n,i)=>({label:`${i+1} - ${n}  →  aprende '${ABSORCAO[n]}'`,value:String(i)}));
    ao.push({label:'0 - Não absorver',value:'-1'});
    const ai = parseInt(await E.choice(ao));
    if (ai >= 0 && ai < absorvivel.length) absorvido = absorvivel[ai];
  }

  return { venceu:true, komega, absorvido };
},

// ============================================================
// COMBAT 6 — KM2 3v3 combat
// ============================================================
async combateKM2(timeJNomes, inimigosNomes, save, wild) {
  const E = KMEngine;
  const STATS = KMData.km2Stats;
  const EFEITOS = KMData.km2KSkillEfeitos;

  function montar(nome, sv, inimigo) {
    if (!STATS[nome]) return null;
    const s = STATS[nome];
    let vida = s.vida, dano = s.dano;
    if (sv && !inimigo) {
      const med = (sv.kreatures||{})[nome]?.medalhas || 0;
      if (med > 0) { const m = 1.0 + 0.2 * med; vida = Math.floor(vida * m); dano = Math.floor(dano * m); }
    }
    return {
      nome, vida, vida_max:vida, dano, kskill:s.kskill, kskill_usada:false,
      tipo: s.tipo||'fighter', suporte_tipo:s.suporte_tipo||null, suporte_val:s.suporte_val||0,
      status:{manipulado:0,iludido:0,silenciado:0,ancorado:0,travado:0},
      round_bonus_atk:0, round_bonus_def:0,
    };
  }

  const timeJ = timeJNomes.map(n => montar(n, save)).filter(Boolean);
  const timeI = inimigosNomes.map(n => montar(n, null, true)).filter(Boolean);
  if (!timeJ.length) { E.print("Nenhum Kreature no time!"); return {venceu:false, save}; }
  if (!timeI.length) return {venceu:true, save};

  E.print(`\n${inimigosNomes.join('  e  ')} aparecem!`);
  E.print("[ COMBATE! ]"); await E.sleep(1000);

  while (true) {
    const vivosJ = timeJ.filter(k => k.vida > 0);
    const vivosI = timeI.filter(e => e.vida > 0);
    if (!vivosJ.length || !vivosI.length) break;

    // Reset round bonuses
    for (const k of vivosJ) { k.round_bonus_atk = 0; k.round_bonus_def = 0; }
    for (const e of vivosI) { e.round_bonus_atk = 0; e.round_bonus_def = 0; }
    // Support passives
    for (const k of vivosJ) {
      if (k.tipo !== 'suporte' || !k.suporte_tipo) continue;
      const val = k.suporte_val;
      if (k.suporte_tipo === 'regen') {
        const alvo = vivosJ.reduce((a, b) => a.vida < b.vida ? a : b);
        const c = Math.min(val, alvo.vida_max - alvo.vida);
        alvo.vida += c;
        if (c > 0) E.print(`  ♥ ${k.nome} regenera ${alvo.nome} em ${c} HP!`);
      } else if (k.suporte_tipo === 'defesa') {
        for (const a of vivosJ) a.round_bonus_def += val;
        E.print(`  ♦ ${k.nome} protege o time! +${val} defesa este turno.`);
      } else if (k.suporte_tipo === 'ataque') {
        for (const a of vivosJ) a.round_bonus_atk += val;
        E.print(`  ★ ${k.nome} amplifica o time! +${val} ataque este turno.`);
      }
    }

    if (!timeI.filter(e => e.vida > 0).length) break;

    // HUD
    E.print('\n' + '='.repeat(62));
    E.print('  ' + timeJ.map(k => k.vida > 0 ? `${k.nome} ${k.vida}/${k.vida_max}` : `${k.nome} [KO]`).join('  |  '));
    E.print('  ' + '─'.repeat(58));
    E.print('  Inimigos:');
    timeI.forEach((e, i) => {
      let st = '';
      for (const [s, v] of Object.entries(e.status)) if (v > 0) st += ` [${s.toUpperCase()}:${v}]`;
      E.print(`    ${i+1}. ${e.nome}  ${e.vida > 0 ? e.vida + '/' + e.vida_max + ' HP' : '[KO]'}${st}`);
    });
    E.print('='.repeat(62));

    // Player turns (fighters and exotics, not supports)
    for (const k of timeJ) {
      if (k.vida <= 0 || k.tipo === 'suporte') continue;
      const vi = timeI.filter(e => e.vida > 0);
      if (!vi.length) break;

      E.print(`\n--- ${k.nome} (${k.vida}/${k.vida_max} HP) ---`);
      const opts = [{label:'1-Atacar',value:'1'},{label:'3-Defender',value:'3'}];
      if (!k.kskill_usada) opts.splice(1, 0, {label:`2-K-Skill: ${k.kskill}`,value:'2'});
      const esc = await E.choice(opts);

      if (esc === '1') {
        let alvo;
        if (vi.length === 1) alvo = vi[0];
        else {
          const ao = vi.map((e,i)=>({label:`${i+1} - ${e.nome} (${e.vida}/${e.vida_max} HP)`,value:String(i)}));
          const ai = parseInt(await E.choice(ao));
          alvo = vi[ai] || vi[0];
        }
        const d = Math.max(0, k.dano + k.round_bonus_atk - alvo.round_bonus_def);
        alvo.vida -= d;
        E.print(`  ${k.nome} ataca ${alvo.nome}! ${d} de dano!`);
        await E.sleep(600);
      } else if (esc === '2' && !k.kskill_usada) {
        k.kskill_usada = true;
        await this._aplicarKSkillKM2(k, timeJ, timeI, EFEITOS, E);
      } else if (esc === '3') {
        k.round_bonus_def += 5;
        E.print(`  ${k.nome} se defende! (+5 defesa)`);
        await E.sleep(500);
      }
    }

    // Check mid-round
    if (!timeI.filter(e => e.vida > 0).length || !timeJ.filter(k => k.vida > 0).length) break;

    // Enemy turns
    for (const inimigo of timeI.filter(e => e.vida > 0)) {
      const vj = timeJ.filter(k => k.vida > 0);
      if (!vj.length) break;

      // Status effects
      if (inimigo.status.iludido > 0) {
        E.print(`  ${inimigo.nome} ataca... mas erra! (Ilusão)`);
        inimigo.status.iludido = Math.max(0, inimigo.status.iludido - 1);
        await E.sleep(500); continue;
      }
      if (inimigo.status.travado > 0) {
        inimigo.status.travado--;
        E.print(`  ${inimigo.nome} está travado e não pode agir!`);
        await E.sleep(500); continue;
      }
      if (inimigo.status.manipulado > 0) {
        inimigo.status.manipulado--;
        const outros = timeI.filter(e => e !== inimigo && e.vida > 0);
        if (outros.length) {
          const alvo = outros[Math.floor(Math.random() * outros.length)];
          const d = Math.max(1, inimigo.dano);
          alvo.vida -= d;
          E.print(`  !!! ${inimigo.nome} ATACA O PRÓPRIO TIME! ${alvo.nome} tomou ${d}!`);
        } else {
          const d = Math.max(1, Math.floor(inimigo.dano / 2));
          inimigo.vida -= d;
          E.print(`  !!! ${inimigo.nome} ataca a si mesmo na confusão! ${d} de dano!`);
        }
        await E.sleep(700); continue;
      }
      if (inimigo.status.ancorado > 0) {
        inimigo.status.ancorado--;
        const alvo = vj[Math.floor(Math.random() * vj.length)];
        const d = Math.max(0, inimigo.dano - alvo.round_bonus_def);
        alvo.vida -= d;
        E.print(`  ${inimigo.nome} é forçado a atacar ${alvo.nome}! ${d} de dano! (Âncora)`);
        await E.sleep(700); continue;
      }

      const podeKsk = !inimigo.kskill_usada && inimigo.status.silenciado === 0;
      if (inimigo.status.silenciado > 0) inimigo.status.silenciado--;
      const pesos = [60, 20, podeKsk ? 20 : 0];
      const acao = KMData.weightedChoice([1,2,3], pesos);
      const alvo = vj[Math.floor(Math.random() * vj.length)];

      if (acao === 1) {
        const d = Math.max(0, inimigo.dano + (inimigo.round_bonus_atk||0) - alvo.round_bonus_def);
        alvo.vida -= d;
        E.print(`  ${inimigo.nome} ataca ${alvo.nome}! ${d} de dano!`);
      } else if (acao === 2) {
        inimigo.round_bonus_atk = (inimigo.round_bonus_atk||0) + 2;
        E.print(`  ${inimigo.nome} se prepara...`);
      } else if (acao === 3 && podeKsk) {
        inimigo.kskill_usada = true;
        const sk = inimigo.kskill;
        const ef = EFEITOS[sk] || {};
        const tipo = ef.tipo || '', val = ef.valor || 0;
        E.print(`  !!! ${inimigo.nome} usa ${sk}!!!`);

        if (tipo === 'dano_extra' || tipo === 'dano_extra_forte') {
          const d = inimigo.dano + val; alvo.vida -= d; E.print(`  ${alvo.nome} tomou ${d} de dano!`);
        } else if (tipo === 'cura') {
          const c = Math.min(val, inimigo.vida_max - inimigo.vida);
          inimigo.vida += c; E.print(`  ${inimigo.nome} curou ${c} HP!`);
        } else if (tipo === 'drenar') {
          const d = Math.min(val, alvo.vida); alvo.vida -= d;
          inimigo.vida = Math.min(inimigo.vida + Math.floor(d/2), inimigo.vida_max);
          E.print(`  ${inimigo.nome} drenou ${d} de ${alvo.nome}!`);
        } else if (tipo === 'bonus_forte') {
          inimigo.round_bonus_atk = (inimigo.round_bonus_atk||0) + val;
          E.print(`  ${inimigo.nome} carregou!`);
        } else if (tipo === 'bloqueio') {
          inimigo.round_bonus_def = (inimigo.round_bonus_def||0) + val;
          E.print(`  ${inimigo.nome} se protege!`);
        } else if (tipo === 'aoe') {
          for (const a of vj) a.vida -= val;
          E.print(`  Todos os aliados tomaram ${val} de dano!`);
        } else if (tipo === 'trava') {
          alvo.status.travado = 1; E.print(`  ${alvo.nome} está travado!`);
        } else if (tipo === 'debuff' || tipo === 'debuff_cura' || tipo === 'debuff_total') {
          alvo.dano = Math.max(1, alvo.dano - Math.max(1, Math.floor(val/2)));
          E.print(`  ${alvo.nome} perdeu ataque!`);
        }
      }
      await E.sleep(700);
    }

    E.print('─'.repeat(62), 'separator');
    await E.sleep(300);
  }

  const venceu = timeJ.some(k => k.vida > 0);
  if (venceu) {
    E.print("\nVitória!");
    if (wild) save = await this._oferecerCapturaKM2(timeI, save, E);
  } else {
    E.print("\nClark foi derrotado...");
  }
  await E.sleep(1000);
  return { venceu, save };
},

// Helper: apply KM2 player K-Skill
async _aplicarKSkillKM2(k, timeJ, timeI, EFEITOS, E) {
  const vivosI = timeI.filter(e => e.vida > 0);
  const vivosJ = timeJ.filter(a => a.vida > 0);
  const sk = k.kskill;
  const ef = EFEITOS[sk] || {};
  const tipo = ef.tipo || '', val = ef.valor || 0;

  E.print(`\n  !!! ${k.nome} usa ${sk} !!!`);
  await E.sleep(500);

  async function escolherAlvo() {
    if (vivosI.length === 1) return vivosI[0];
    const ao = vivosI.map((e,i)=>({label:`${i+1} - ${e.nome} (${e.vida}/${e.vida_max} HP)`,value:String(i)}));
    const ai = parseInt(await E.choice(ao));
    return vivosI[ai] || vivosI[0];
  }

  if (tipo === 'exotico') {
    if (sk === 'Manipulação') {
      const alvo = await escolherAlvo();
      alvo.status.manipulado = 3;
      E.print(`  ${alvo.nome} foi manipulado! Atacará o próprio time por 3 turnos!`);
    } else if (sk === 'Espelho') {
      const alvo = await escolherAlvo();
      const d = k.dano * 2; alvo.vida -= d;
      E.print(`  K-Miroir reflete a força de ${alvo.nome}! ${d} de dano!`);
    } else if (sk === 'Âncora') {
      const alvo = await escolherAlvo();
      alvo.status.ancorado = 3;
      E.print(`  ${alvo.nome} está ancorado! Só pode atacar por 3 turnos!`);
    } else if (sk === 'Silêncio') {
      const alvo = await escolherAlvo();
      alvo.status.silenciado = 2;
      E.print(`  ${alvo.nome} foi silenciado! Sem K-Skills por 2 turnos!`);
    } else if (sk === 'Ilusão') {
      for (const e of vivosI) e.status.iludido = 1;
      E.print(`  Ilusão! Todos os inimigos errarão seus ataques neste turno!`);
    } else if (sk === 'Drenar Força') {
      const alvo = await escolherAlvo();
      const d = Math.max(1, k.dano); alvo.vida -= d;
      if (vivosJ.length) {
        const mf = vivosJ.reduce((a,b) => a.vida < b.vida ? a : b);
        mf.vida = Math.min(mf.vida + d, mf.vida_max);
        E.print(`  ${alvo.nome} drena ${d} HP e cede a ${mf.nome}!`);
      }
    }
  } else if (tipo === 'dano_extra') {
    const alvo = await escolherAlvo();
    const d = k.dano + val; alvo.vida -= d;
    E.print(`  ${alvo.nome} tomou ${d} de dano!`);
  } else if (tipo === 'debuff') {
    const alvo = await escolherAlvo();
    alvo.dano = Math.max(1, alvo.dano - val);
    E.print(`  ${alvo.nome} perdeu ${val} de ataque!`);
  } else if (tipo === 'trava') {
    const alvo = await escolherAlvo();
    alvo.status.travado = 1 + val;
    E.print(`  ${alvo.nome} está travado!`);
  } else if (tipo === 'bonus_forte') {
    k.round_bonus_atk += val;
    E.print(`  ${k.nome} carregou! +${val} de ataque este turno!`);
  } else if (tipo === 'cura') {
    const c = Math.min(val, k.vida_max - k.vida);
    k.vida += c;
    E.print(`  ${k.nome} se recupera! +${c} HP! (${k.vida}/${k.vida_max})`);
  } else if (tipo === 'drenar') {
    const alvo = await escolherAlvo();
    const d = Math.min(val, alvo.vida); alvo.vida -= d;
    const c = Math.floor(d/2);
    k.vida = Math.min(k.vida + c, k.vida_max);
    E.print(`  ${k.nome} drena ${d} de ${alvo.nome}! Recuperou ${c} HP!`);
  } else if (tipo === 'aoe') {
    for (const e of vivosI) e.vida -= val;
    E.print(`  Todos os inimigos tomaram ${val} de dano!`);
  } else if (tipo === 'bloqueio') {
    k.round_bonus_def += val;
    E.print(`  ${k.nome} se protege! +${val} defesa este turno!`);
  } else if (tipo === 'debuff_cura') {
    const alvo = await escolherAlvo();
    alvo.dano = Math.max(1, alvo.dano - Math.floor(val/2));
    const c = Math.min(val, k.vida_max - k.vida); k.vida += c;
    E.print(`  ${alvo.nome} debuffado! ${k.nome} curou ${c} HP!`);
  } else if (tipo === 'debuff_total') {
    for (const e of vivosI) {
      e.dano = Math.max(1, e.dano - Math.floor(val/2));
      e.round_bonus_def = Math.max(0, e.round_bonus_def - Math.floor(val/2));
    }
    E.print(`  Todos os inimigos foram enfraquecidos!`);
  }
  await E.sleep(800);
},

// Helper: KM2 capture offer
async _oferecerCapturaKM2(timeI, save, E) {
  const CAPTURAVEL = KMData.km2Capturavel;
  const EVOLUCOES = KMData.km2Evolucoes;
  const capturaveil = [...new Set(timeI.map(k => k.nome).filter(n => CAPTURAVEL.has(n)))];
  if (!capturaveil.length) return save;

  E.print("\nK-Digitalizador detecta Kreatures capturáveis:");
  const opts = [];
  for (let i = 0; i < capturaveil.length; i++) {
    const nome = capturaveil[i];
    const med = save.kreatures?.[nome]?.medalhas || 0;
    const status = save.kreatures?.[nome] ? `(+medalha, ${med}/3)` : '(novo!)';
    opts.push({label:`${i+1} - ${nome} ${status}`, value:String(i)});
  }
  opts.push({label:'0 - Não capturar', value:'-1'});
  const idx = parseInt(await E.choice(opts));

  if (idx >= 0 && idx < capturaveil.length) {
    const nome = capturaveil[idx];
    if (Math.random() <= 0.70) {
      if (!save.kreatures) save.kreatures = {};
      if (save.kreatures[nome]) {
        const med = save.kreatures[nome].medalhas || 0;
        if (med < 3) {
          save.kreatures[nome].medalhas = med + 1;
          E.print(`\n${nome} ganhou uma medalha! (${med + 1}/3)`);
          if (med + 1 >= 3 && EVOLUCOES[nome]) {
            const evolved = EVOLUCOES[nome];
            await E.sleep(1000);
            E.print(`\n!!! ${nome} está EVOLUINDO !!!`, 'bold');
            await E.sleep(1000);
            E.print(`>>> ${nome} → ${evolved}! <<<`, 'bold');
            save.kreatures[evolved] = { medalhas: 0 };
            delete save.kreatures[nome];
            if (save.time && save.time.includes(nome)) {
              save.time[save.time.indexOf(nome)] = evolved;
              E.print(`Time: ${evolved} entrou no lugar de ${nome}.`);
            }
          }
        } else E.print(`\n${nome} já tem 3 medalhas. Nada acontece.`);
      } else {
        save.kreatures[nome] = { medalhas: 0 };
        E.print(`\n${nome} capturado!`);
      }
    } else {
      E.print(`\n${capturaveil[idx]} escapou!`);
    }
  }
  return save;
},

}; // end KMCombat
