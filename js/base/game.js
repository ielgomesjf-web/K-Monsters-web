// base/game.js — K-Monsters (Base Game)
// Adds KMGames.base()

KMGames.base = async function() {
  const E = KMEngine;
  const S = KMSave;

  // ============================================================
  // CAPÍTULO 1 — COMEÇO
  // ============================================================
  E.clear();
  E.print('═'.repeat(50), 'bold');
  E.print('  K-MONSTERS', 'bold');
  E.print('═'.repeat(50), 'bold');
  await E.sleep(2000);

  E.clear();
  E.print('Você acorda.');
  await E.sleep(1500);
  E.print('Mais um dia normal na K-Village.');
  await E.sleep(1500);
  E.print('Mas hoje é diferente.');
  await E.sleep(2000);

  E.print('\nMãe: "Filho! Chegou uma encomenda pra você!"');
  await E.sleep(2000);
  E.print('Mãe: "É do laboratório K-Tech!"');
  await E.sleep(2000);

  E.print('\nVocê desce correndo.');
  await E.sleep(1500);
  E.print('Uma caixa. Com o símbolo K.');
  await E.sleep(2000);
  await E.anyKey();
  E.clear();

  E.print('Dentro da caixa:');
  await E.sleep(1000);
  E.print('  - 3 K-Capsules (vazias)');
  await E.sleep(800);
  E.print('  - 1 K-Digitalizador');
  await E.sleep(800);
  E.print('  - E algo se mexendo...');
  await E.sleep(2000);

  E.print('\n!!! Um Kreature salta da caixa !!!', 'bold');
  await E.sleep(1500);
  E.print('É um Piki!', 'bold');
  await E.sleep(1000);
  E.print('Pequeno. Dourado. Te olhando com curiosidade.');
  await E.sleep(2000);

  E.print('\nMãe: "Que bonit— O QUE É ISSO?!"');
  await E.sleep(2000);
  E.print('\nUm K-Bat entra pela janela!', 'danger');
  await E.sleep(1500);
  E.print('Ele parece hostil!');
  await E.sleep(1500);
  E.print('\nMãe: "Não se preocupa! Eu te ensino a lutar!"');
  await E.sleep(2000);
  E.print('Piki se posiciona para lutar!');
  await E.sleep(1500);

  await E.anyKey('Lutar!');
  E.clear();

  // Tutorial guiado: Piki vs K-Bat (Mãe ensina passo-a-passo)
  const ganhou = await KMCombat.combateComeco();

  let kreatures = S.getBaseKreatures();
  if (!kreatures.includes('Piki')) kreatures.push('Piki');

  if (ganhou) {
    E.print('\nMãe: "Muito bem! Você pegou o jeito!"', 'success');
    await E.sleep(2000);
    E.print('O K-Bat cai no chão, derrotado.');
    await E.sleep(2000);
    E.print('Rápido! Você usa o K-Digitalizador!');
    await E.sleep(1500);
    E.print('\n[ K-Bat capturado! ]', 'success');
    if (!kreatures.includes('K-Bat')) kreatures.push('K-Bat');
  } else {
    E.print('\nMãe: "Não se preocupe, você vai melhorar!"');
    await E.sleep(2000);
    E.print('O K-Bat recua. Você está seguro.');
    await E.sleep(2000);
    E.print('Piki se recupera ao seu lado.');
  }
  S.setBaseKreatures(kreatures);
  await E.sleep(2000);
  await E.anyKey();

  // ============================================================
  // CAPÍTULO 2 — A VILA E O TREINAMENTO
  // ============================================================
  E.clear();
  E.print('═══ CAPÍTULO 2 — TREINAMENTO ═══', 'bold');
  await E.sleep(1500);

  E.print('\nVocê sai de casa. A K-Village se abre diante de você.');
  await E.sleep(2000);
  E.print('Moradores andam pelas ruas. Alguns com Kreatures ao lado.');
  await E.sleep(2000);

  E.print('\nVendedor: "Hey, garoto! Quer comprar K-Capsules extras?"');
  await E.sleep(2000);
  E.print('Vendedor: "São grátis hoje! Promoção de inauguração!"');
  await E.sleep(2000);
  E.print('\n[ Você recebeu K-Capsules extras! ]', 'success');
  await E.sleep(1500);

  E.print('\nUm treinador te aborda.');
  await E.sleep(1500);
  E.print('Treinador: "Quer treinar? A K-Forest tem Kreatures selvagens."');
  await E.sleep(2000);
  E.print('Treinador: "Capture-os com o K-Digitalizador depois de vencê-los!"');
  await E.sleep(2000);
  await E.anyKey();
  E.clear();

  // Training encounter
  E.print('Você entra na K-Forest para treinar...');
  await E.sleep(1500);

  const treinoSpawn = KMData.weightedChoice(KMData.baseSpawns['F']);
  E.print(`\nUm ${treinoSpawn} aparece!`, 'bold');
  await E.sleep(1000);

  kreatures = S.getBaseKreatures();
  const treinoWon = await KMCombat.combateBase(kreatures[0], treinoSpawn, kreatures, S.getBaseMedalhas());

  if (treinoWon) {
    E.print('\nVitória!', 'success');
    const chance = KMData.baseCapturaChances[treinoSpawn] || 30;
    if (Math.random() * 100 < chance) {
      if (!kreatures.includes(treinoSpawn)) {
        kreatures.push(treinoSpawn);
        S.setBaseKreatures(kreatures);
        E.print(`[ ${treinoSpawn} capturado! ]`, 'success');
      } else {
        E.print(`[ Você já tem um ${treinoSpawn}. ]`);
      }
    } else {
      E.print(`[ ${treinoSpawn} escapou da captura! ]`);
    }
  }
  await E.sleep(2000);
  await E.anyKey();

  // ============================================================
  // CAPÍTULO 3 — K-STADIUM (DERROTA)
  // ============================================================
  E.clear();
  E.print('═══ CAPÍTULO 3 — K-STADIUM ═══', 'bold');
  await E.sleep(1500);

  E.print('\nVocê chega ao K-Stadium. A arena é enorme.');
  await E.sleep(2000);
  E.print('No centro, alguém te espera.');
  await E.sleep(2000);

  E.print('\nK-Master: "Outro desafiante?"');
  await E.sleep(2000);
  E.print('K-Master: "Mostre o que tem."');
  await E.sleep(2000);
  await E.anyKey('Batalhar!');
  E.clear();

  kreatures = S.getBaseKreatures();
  const cap3Won = await KMCombat.combateBase(kreatures[0], 'K-Mega', kreatures, S.getBaseMedalhas());

  E.clear();
  if (cap3Won) {
    E.print('K-Master: "Impressionante... mas isso foi só um teste."');
    await E.sleep(2000);
    E.print('K-Master: "Volte quando estiver ainda mais forte."');
  } else {
    E.print('K-Master: "Fraco demais."');
    await E.sleep(2000);
    E.print('K-Master: "Volte quando estiver pronto de verdade."');
  }
  await E.sleep(2000);
  E.print('\nVocê sai do K-Stadium... Precisa ficar mais forte.');
  await E.sleep(2000);
  await E.anyKey();

  // ============================================================
  // CAPÍTULO 4 — NOMEAR KREATURES
  // ============================================================
  E.clear();
  E.print('═══ CAPÍTULO 4 — SEUS KREATURES ═══', 'bold');
  await E.sleep(1500);

  kreatures = S.getBaseKreatures();
  const nomes = S.getBaseNomes();

  E.print('\nDê nomes aos seus Kreatures!');
  E.print('(Deixe em branco para manter o nome original)\n');

  for (const k of kreatures) {
    const nome = await E.textInput(`Nome para ${k}:`);
    if (nome && nome.trim()) {
      nomes[k] = nome.trim();
      E.print(`${k} agora se chama "${nome.trim()}"!`, 'success');
    } else {
      E.print(`${k} mantém o nome original.`);
    }
    await E.sleep(500);
  }
  S.setBaseNomes(nomes);
  await E.sleep(1000);
  await E.anyKey();

  // ============================================================
  // CAPÍTULO 5 — MUNDO ABERTO (MAPA 5x5)
  // ============================================================
  E.clear();
  E.print('═══ CAPÍTULO 5 — EXPLORAÇÃO ═══', 'bold');
  await E.sleep(1000);
  E.print('\nO mundo K-Map se abre para você!');
  await E.sleep(1000);
  E.print('Explore, capture Kreatures, ganhe medalhas e evolua!');
  await E.sleep(1000);
  E.print('Quando estiver pronto, entre no K-Stadium (K).');
  await E.sleep(1500);
  await E.anyKey();

  const map = KMData.baseMap;
  const areaNames = KMData.baseAreaNames;
  let px = 2, py = 2; // Start at Village

  let explorar = true;
  while (explorar) {
    kreatures = S.getBaseKreatures();
    const mData = S.getBaseMedalhas();
    const evo = S.getBaseEvolucao();

    const info = `<span>Time: ${kreatures.join(', ')}</span>` +
      `<span>Medalhas: ${Object.values(mData).reduce((a,b)=>a+b,0)}</span>`;
    E.showMap(map, px, py, areaNames, info);

    const extras = [{label:'T=Trocar', value:'t'}, {label:'Q=Sair', value:'q'}];
    const mov = await E.mapInput(extras);
    E.hideMap();

    if (mov === 'q') {
      explorar = false;
      break;
    }

    if (mov === 't') {
      // Team management
      E.clear();
      E.print('═══ GERENCIAR TIME ═══', 'bold');
      kreatures = S.getBaseKreatures();
      if (kreatures.length === 0) {
        E.print('Nenhum Kreature capturado!');
        await E.anyKey();
        continue;
      }
      E.print('Seus Kreatures:');
      kreatures.forEach((k, i) => {
        const m = mData[k] || 0;
        E.print(`  ${i + 1} - ${k} (medalhas: ${m})`);
      });
      E.print('\n(Todos os Kreatures participam das batalhas)');
      await E.anyKey();
      continue;
    }

    // Move
    let nx = px, ny = py;
    if (mov === 'w') ny--;
    else if (mov === 's') ny++;
    else if (mov === 'a') nx--;
    else if (mov === 'd') nx++;
    else continue;

    if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[0].length) continue;

    const tile = map[ny][nx];
    px = nx;
    py = ny;

    // K-Stadium entry
    if (tile === 'K') {
      E.clear();
      E.print('Você chega ao K-Stadium.', 'bold');
      await E.sleep(1000);
      const entrar = await E.choice([
        {label: 'Entrar no K-Stadium', value: 'enter', primary: true},
        {label: 'Voltar ao mapa', value: 'back'},
      ]);
      if (entrar === 'enter') {
        explorar = false;
        break;
      }
      continue;
    }

    // Village — check evolution
    if (tile === 'V') {
      kreatures = S.getBaseKreatures();
      const md = S.getBaseMedalhas();
      const ev = S.getBaseEvolucao();
      let evolved = false;
      for (const k of [...kreatures]) {
        const evoInfo = KMData.baseEvolucoes[k];
        if (evoInfo && (md[k] || 0) >= evoInfo.medalhas_necessarias && !ev[k]) {
          E.clear();
          E.print(`\n!!! ${k} está EVOLUINDO !!!`, 'bold');
          await E.sleep(2000);
          E.print(`>>> ${k} → ${evoInfo.evolui_para}! <<<`, 'bold');
          await E.sleep(2000);

          const idx = kreatures.indexOf(k);
          kreatures[idx] = evoInfo.evolui_para;
          ev[k] = evoInfo.evolui_para;
          md[evoInfo.evolui_para] = md[k] || 0;
          evolved = true;
        }
      }
      if (evolved) {
        S.setBaseKreatures(kreatures);
        S.setBaseMedalhas(md);
        S.setBaseEvolucao(ev);
        await E.anyKey();
      }
      continue;
    }

    // Random encounter
    const spawnTable = KMData.baseSpawns[tile];
    if (spawnTable && Math.random() < 0.35) {
      const enemy = KMData.weightedChoice(spawnTable);
      E.clear();
      E.print(`Um ${enemy} selvagem aparece!`, 'bold');
      await E.sleep(1000);

      const act = await E.choice([
        {label: 'Lutar!', value: 'fight', primary: true},
        {label: 'Ignorar', value: 'ignore'},
      ]);

      if (act === 'fight') {
        kreatures = S.getBaseKreatures();
        const md = S.getBaseMedalhas();
        const won = await KMCombat.combateBase(kreatures[0], enemy, kreatures, md);

        if (won) {
          // Medal chance (3% in caves, 1% elsewhere)
          const medalChance = tile === 'C' ? 0.03 : 0.01;
          if (Math.random() < medalChance && kreatures.length > 0) {
            const lucky = kreatures[Math.floor(Math.random() * kreatures.length)];
            md[lucky] = (md[lucky] || 0) + 1;
            if (md[lucky] > 3) md[lucky] = 3;
            S.setBaseMedalhas(md);
            E.print(`\n★ ${lucky} ganhou uma MEDALHA! (${md[lucky]}/3) ★`, 'bold');
            await E.sleep(2000);
          }

          // Capture chance
          const captChance = KMData.baseCapturaChances[enemy] || 20;
          const bonus = (KMData.baseCapturaBonus[tile] || {})[enemy] || 0;
          if (Math.random() * 100 < captChance + bonus) {
            if (!kreatures.includes(enemy)) {
              kreatures.push(enemy);
              S.setBaseKreatures(kreatures);
              E.print(`\n[ ${enemy} capturado! ]`, 'success');
            } else {
              // Already have — earn medal
              md[enemy] = (md[enemy] || 0) + 1;
              if (md[enemy] > 3) md[enemy] = 3;
              S.setBaseMedalhas(md);
              E.print(`\n[ ${enemy} ganhou uma medalha! (${md[enemy]}/3) ]`, 'info');
            }
          } else {
            E.print(`\n[ ${enemy} escapou! ]`);
          }
        }
        await E.sleep(1500);
        await E.anyKey();
      }
    }
  }

  // ============================================================
  // CAPÍTULO 6 — BOSS FIGHT
  // ============================================================
  E.clear();
  E.print('═══ CAPÍTULO 6 — O DESAFIO FINAL ═══', 'bold');
  await E.sleep(2000);

  E.print('\nVocê entra no K-Stadium.');
  await E.sleep(1500);
  E.print('A arena está cheia. Todos olham para você.');
  await E.sleep(2000);

  E.print('\nK-Master: "Você voltou."');
  await E.sleep(2000);
  E.print('K-Master: "Desta vez, não vou pegar leve."');
  await E.sleep(2000);
  await E.anyKey('Enfrentar o K-Master!');

  kreatures = S.getBaseKreatures();
  const finalMedalhas = S.getBaseMedalhas();

  // Determine ending type
  const temMegaron = kreatures.includes('K-Megaron');
  const kMegas = kreatures.filter(k => k === 'K-Mega').length;
  const totalMedalhas = Object.values(finalMedalhas).reduce((a, b) => a + b, 0);
  const finalSecreto = temMegaron;
  const finalAlternativo = !finalSecreto && kreatures.length >= 4 && totalMedalhas >= 4;

  // Boss fight — K-Master's K-Mega (Campeão)
  E.clear();
  E.print('K-Master: "Vai, K-Mega!"', 'bold');
  await E.sleep(1500);
  let bossWon = await KMCombat.combateBase(kreatures[0], 'K-Mega', kreatures, finalMedalhas);

  if (bossWon && finalAlternativo) {
    // Alternative ending — extra fights
    E.clear();
    E.print('K-Master: "Impressionante... Mas eu ainda tenho mais Kreatures!"');
    await E.sleep(2000);
    E.print('\nK-Master: "Vai, K-Waterlim!"');
    await E.sleep(1500);
    bossWon = await KMCombat.combateBase(kreatures[0], 'K-Waterlim', kreatures, finalMedalhas);

    if (bossWon) {
      E.clear();
      E.print('K-Master: "Vai, K-Mag!"');
      await E.sleep(1500);
      bossWon = await KMCombat.combateBase(kreatures[0], 'K-Mag', kreatures, finalMedalhas);
    }
  }

  if (bossWon && finalSecreto) {
    // Secret ending — K-Omega appears
    E.clear();
    E.print('\n...', 'danger');
    await E.sleep(3000);
    E.print('O chão treme.', 'danger');
    await E.sleep(2000);
    E.print('K-Master: "O que... O que é isso?"');
    await E.sleep(3000);

    E.print('\nAlgo emerge do centro da arena.', 'boss-text');
    await E.sleep(2000);
    E.print('Grande. Escuro. Antigo.', 'boss-text');
    await E.sleep(2000);
    E.print('\nK-OMEGA', 'boss-text');
    await E.sleep(3000);

    E.print('\nK-Master: "Impossível... o Kreature Original..."');
    await E.sleep(3000);
    await E.anyKey('Enfrentar K-Omega!');

    E.clear();
    bossWon = await KMCombat.combateBase(kreatures[0], 'K-Omega', kreatures, finalMedalhas);
  }

  // ============================================================
  // ENDINGS
  // ============================================================
  E.clear();

  if (bossWon && finalSecreto) {
    E.print('\n...', 'bold');
    await E.sleep(3000);
    E.print('O K-Omega cai. O chão para de tremer.');
    await E.sleep(3000);
    E.print('\nK-Master: "..."');
    await E.sleep(2000);
    E.print('K-Master: "Eu não acredito."');
    await E.sleep(2000);
    E.print('K-Master: "O K-Omega... o criador de todos os Kreatures... foi derrotado."');
    await E.sleep(3000);
    E.print('K-Master: "Você não é um K-Master. Você não é uma lenda."');
    await E.sleep(3000);
    E.print('K-Master: "Você é um DEUS."', 'bold');
    await E.sleep(3000);

    S.set('base_ending', 'secreto');
    E.print('\n' + '═'.repeat(40), 'bold');
    E.print('    FINAL SECRETO DESBLOQUEADO', 'bold');
    E.print('', 'bold');
    E.print('    VOCÊ DERROTOU O K-OMEGA', 'bold');
    E.print('    O KREATURE ORIGINAL', 'bold');
    E.print('', 'bold');
    E.print('    Você é o DEUS dos K-Monsters.', 'bold');
    E.print('═'.repeat(40), 'bold');

  } else if (bossWon && finalAlternativo) {
    E.print('\n...', 'bold');
    await E.sleep(3000);
    E.print('K-Master: "..."');
    await E.sleep(2000);
    E.print('K-Master: "Você derrotou TODO o meu time."');
    await E.sleep(2000);
    E.print('K-Master: "Você não é apenas o novo K-Master."');
    await E.sleep(3000);
    E.print('K-Master: "Você é uma LENDA."', 'bold');
    await E.sleep(2000);

    S.set('base_ending', 'alternativo');
    E.print('\n' + '═'.repeat(40), 'bold');
    E.print('  VOCÊ É O K-MASTER LENDÁRIO !!!', 'bold');
    E.print('  Poucos jogadores chegam até aqui.', 'bold');
    E.print('═'.repeat(40), 'bold');

  } else if (bossWon) {
    E.print('O K-Mega cai no chão!');
    await E.sleep(2000);
    E.print('\nK-Master: "... Impossível."');
    await E.sleep(2000);
    E.print('K-Master: "Você... me derrotou."');
    await E.sleep(2000);
    E.print('K-Master: "Você é o novo K-Master !!!"', 'bold');
    await E.sleep(2000);

    S.set('base_ending', 'normal');
    E.print('\n' + '═'.repeat(40), 'bold');
    E.print('   PARABÉNS ! VOCÊ É O NOVO K-MASTER !', 'bold');
    E.print('═'.repeat(40), 'bold');

  } else {
    E.print('Todos os seus Kreatures foram derrotados...');
    await E.sleep(2000);
    E.print('\nK-Master: "Fraco demais. Volte quando estiver mais forte."');
    await E.sleep(2000);
    E.print('Você sai do K-Stadium derrotado...');
    await E.sleep(2000);
    await E.anyKey();
    return;
  }

  // Show final team
  E.print('\nTime vencedor:');
  for (const k of kreatures) {
    const m = finalMedalhas[k] || 0;
    E.print(`  ${k} (medalhas: ${m})`);
  }
  await E.sleep(3000);
  await E.anyKey();

  // ============================================================
  // CRÉDITOS
  // ============================================================
  E.clear();
  E.print('═'.repeat(40), 'bold');
  E.print('  K-MONSTERS', 'bold');
  E.print('  C R É D I T O S', 'bold');
  E.print('═'.repeat(40), 'bold');
  await E.sleep(3000);

  E.clear();
  E.print('DEV: Gomes, The Coder - GTC');
  await E.sleep(1000);
  E.print('Tester: Gomes, The Coder - GTC, Fábio Souza Costa');
  await E.sleep(1000);
  E.print('Tester: Joãobloxstars, Léo Evaristo');
  await E.sleep(1000);
  E.print('Agradecimentos: GugaCoder, BDG - Bruna Dias Gomes, AzuosPy - Lucas Gomes S.');
  await E.sleep(1000);
  E.print('Inspiração: Nintendo - Pokémon');
  await E.sleep(3000);

  E.clear();
  E.print('Obrigado por jogar K-Monsters!');
  await E.sleep(3000);
};
