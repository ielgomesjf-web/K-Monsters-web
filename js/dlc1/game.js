// dlc1/game.js — K-Monsters: A Far Planet (DLC1)
// Adds KMGames.dlc1()

KMGames.dlc1 = async function() {
  const E = KMEngine;
  const S = KMSave;
  KMMusic.play('exploration');

  // ============================================================
  // INTRO
  // ============================================================
  E.clear();
  E.print('═'.repeat(50), 'bold');
  E.print('  K-MONSTERS: A FAR PLANET', 'bold');
  E.print('  Um Planeta Distante', 'bold');
  E.print('═'.repeat(50), 'bold');
  await E.sleep(3000);

  E.clear();
  E.print('Meses se passaram desde que você se tornou K-Master.');
  await E.sleep(2000);
  E.print('Tudo estava em paz.');
  await E.sleep(2000);
  E.print('Até o dia em que a corrupção começou.');
  await E.sleep(3000);

  E.print('\nKreatures selvagens ficaram agressivos.');
  await E.sleep(2000);
  E.print('Os cristais da K-Cave começaram a pulsar.');
  await E.sleep(2000);
  E.print('E algo emergiu da escuridão.');
  await E.sleep(3000);

  E.print('\nK-Darkrats. K-Sombras. K-Corruptos.', 'danger');
  await E.sleep(2000);
  E.print('Criaturas que nunca existiram antes.', 'danger');
  await E.sleep(3000);

  E.print('\nVocê e seus Kreatures fugiram.');
  await E.sleep(2000);
  E.print('Para K-Far. Um planeta distante.');
  await E.sleep(3000);
  await E.anyKey();

  E.clear();
  E.print('K-Far é diferente de tudo que você conhece.');
  await E.sleep(2000);
  E.print('Vulcões. Glaciares. Zonas sombrias. Tempestades.');
  await E.sleep(2000);
  E.print('E Kreatures que você nunca viu.');
  await E.sleep(3000);

  E.print('\nNa Base dos Sobreviventes, outros treinadores contam:');
  await E.sleep(2000);
  E.print('"Algo chamado K-Void está por trás de tudo."');
  await E.sleep(2000);
  E.print('"Ele está no Portal do Vazio, ao sudeste."');
  await E.sleep(3000);

  E.print('\nK-Crystals: cristais encontrados em cavernas deste planeta.');
  await E.sleep(1500);
  E.print('Dão poder aos K-Far Kreatures (1.5x por cristal, max 3).');
  await E.sleep(2000);
  E.print('Evolução: com cristais suficientes, K-Far Kreatures evoluem!');
  await E.sleep(2000);
  await E.anyKey();

  // ============================================================
  // MAPA 10x10
  // ============================================================
  const map = KMData.dlc1Map;
  const areaNames = KMData.dlc1AreaNames;
  let px = 5, py = 5; // Start at Base (B)

  let explorar = true;
  while (explorar) {
    let kreatures = S.getDlc1Kreatures();
    const medalhas = S.getBaseMedalhas();
    const cristais = S.getDlc1Cristais();
    const evo = S.getDlc1Evolucao();

    const totalCristais = Object.values(cristais).reduce((a, b) => a + b, 0);
    const info = `<span>Time: ${kreatures.slice(0, 4).join(', ')}${kreatures.length > 4 ? '...' : ''}</span>` +
      `<span>Cristais: ${totalCristais}</span>`;
    E.showMap(map, px, py, areaNames, info);

    const extras = [
      {label: 'T=Trocar', value: 't'},
      {label: 'Q=Sair', value: 'q'},
    ];
    const mov = await E.mapInput(extras);
    E.hideMap();

    if (mov === 'q') { explorar = false; break; }

    if (mov === 't') {
      E.clear();
      E.print('═══ KREATURES ═══', 'bold');
      kreatures = S.getDlc1Kreatures();
      kreatures.forEach((k, i) => {
        const c = cristais[k] || 0;
        const m = medalhas[k] || 0;
        const isPlaneta = KMData.KREATURES_PLANETA.has(k);
        const boost = isPlaneta ? `cristais: ${c}` : `medalhas: ${m}`;
        E.print(`  ${i + 1} - ${k} (${boost})`);
      });
      await E.anyKey();
      continue;
    }

    let nx = px, ny = py;
    if (mov === 'w') ny--;
    else if (mov === 's') ny++;
    else if (mov === 'a') nx--;
    else if (mov === 'd') nx++;
    else continue;

    if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[0].length) continue;
    const tile = map[ny][nx];
    px = nx; py = ny;

    // Base — evolution check
    if (tile === 'B') {
      kreatures = S.getDlc1Kreatures();
      const cr = S.getDlc1Cristais();
      const ev = S.getDlc1Evolucao();
      for (const k of [...kreatures]) {
        const evoInfo = KMData.dlc1Evolucoes[k];
        if (evoInfo && (cr[k] || 0) >= evoInfo.cristais_necessarios && !ev[k]) {
          E.clear();
          E.print(`\n!!! ${k} está EVOLUINDO !!!`, 'bold');
          await E.sleep(2000);
          E.print(`>>> ${k} → ${evoInfo.evolui_para}! <<<`, 'bold');
          await E.sleep(2000);
          const idx = kreatures.indexOf(k);
          kreatures[idx] = evoInfo.evolui_para;
          ev[k] = evoInfo.evolui_para;
          cr[evoInfo.evolui_para] = cr[k] || 0;
          S.addKdexEntry(evoInfo.evolui_para);
          KMConquista.desbloquear('primeira_evolucao');
        }
      }
      S.setDlc1Kreatures(kreatures);
      S.setDlc1Cristais(cr);
      S.setDlc1Evolucao(ev);
      continue;
    }

    // Portal do Vazio — boss trigger
    if (tile === 'F') {
      E.clear();
      E.print('O Portal do Vazio se abre diante de você.', 'boss-text');
      await E.sleep(2000);
      E.print('Dentro, escuridão absoluta.');
      await E.sleep(2000);
      const entrar = await E.choice([
        {label: 'Entrar no Portal', value: 'enter', primary: true},
        {label: 'Voltar', value: 'back'},
      ]);
      if (entrar === 'enter') {
        explorar = false;
        break;
      }
      continue;
    }

    // Cave painting (1% chance in caves)
    if (tile === 'C' && Math.random() < 0.01) {
      E.clear();
      E.print('Você encontra uma pintura na parede da caverna...');
      await E.sleep(2000);
      E.print('Ela mostra 10 símbolos em círculo.');
      await E.sleep(1500);
      E.print('Fogo. Gelo. Pedra. Sombra. Cristal. Água. Vento. Luz. Terra. Relâmpago.');
      await E.sleep(2000);
      E.print('\nSão os K-Far Kreatures originais.');
      await E.sleep(2000);
      await E.anyKey();
    }

    // Random encounter
    const spawnTable = KMData.dlc1Spawns[tile];
    if (spawnTable && Math.random() < 0.30) {
      const enemy = KMData.weightedChoice(spawnTable);
      E.clear();
      E.print(`Um ${enemy} aparece!`, 'bold');
      await E.sleep(1000);
      S.addKdexEntry(enemy);

      const act = await E.choice([
        {label: 'Lutar!', value: 'fight', primary: true},
        {label: 'Ignorar', value: 'ignore'},
      ]);

      if (act === 'fight') {
        kreatures = S.getDlc1Kreatures();
        const md = S.getBaseMedalhas();
        const cr = S.getDlc1Cristais();
        const won = await KMCombat.combateDlc1(kreatures[0], enemy, kreatures, md, cr);
        KMMusic.play('exploration');

        if (won) {
          // Crystal chance (18% in caves, 5% elsewhere)
          const crystalChance = tile === 'C' ? 0.18 : 0.05;
          if (Math.random() < crystalChance && KMData.KREATURES_PLANETA.has(enemy)) {
            cr[enemy] = (cr[enemy] || 0) + 1;
            if (cr[enemy] > 3) cr[enemy] = 3;
            S.setDlc1Cristais(cr);
            E.print(`\n★ Cristal de ${enemy}! (${cr[enemy]}/3) ★`, 'bold');
            await E.sleep(1500);
          }

          // Capture chance
          const captChance = KMData.dlc1CapturaChances[enemy] || 20;
          if (Math.random() * 100 < captChance) {
            if (!kreatures.includes(enemy)) {
              kreatures.push(enemy);
              S.setDlc1Kreatures(kreatures);
              S.addKdexEntry(enemy);
              KMConquista.desbloquear('primeira_captura_far');
              E.print(`\n[ ${enemy} capturado! ]`, 'success');
            } else {
              cr[enemy] = (cr[enemy] || 0) + 1;
              if (cr[enemy] > 3) cr[enemy] = 3;
              S.setDlc1Cristais(cr);
              E.print(`\n[ ${enemy} ganhou um cristal! (${cr[enemy]}/3) ]`, 'info');
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
  // BOSS — K-VOID
  // ============================================================
  E.clear();
  E.print('Você entra no Portal do Vazio.', 'boss-text');
  await E.sleep(2000);
  E.print('A escuridão te consome por um instante.');
  await E.sleep(3000);

  E.print('\nE então você vê.');
  await E.sleep(2000);
  E.print('K-Void.', 'boss-text');
  await E.sleep(2000);
  E.print('A origem da corrupção.', 'boss-text');
  await E.sleep(3000);

  E.print('\nK-Void: "Vocês não deveriam ter vindo."');
  await E.sleep(3000);
  await E.anyKey('Enfrentar K-Void!');

  let kreatures = S.getDlc1Kreatures();
  const md = S.getBaseMedalhas();
  const cr = S.getDlc1Cristais();

  S.addKdexEntry('K-Void');

  E.clear();
  let bossWon = await KMCombat.combateDlc1(kreatures[0], 'K-Void', kreatures, md, cr);

  // Check for extra endings
  const temEvoluido = kreatures.some(k => KMData.EVOLUIDOS_FAR.has(k));
  const totalCr = Object.values(cr).reduce((a, b) => a + b, 0);

  if (bossWon && temEvoluido && totalCr >= 6) {
    // Extra ending — K-Void Renascido
    E.clear();
    E.print('O K-Void cai... mas a escuridão não para.', 'danger');
    await E.sleep(3000);
    E.print('\nK-Void: "Vocês acham que acabou?"');
    await E.sleep(2000);
    E.print('\nK-VOID RENASCIDO!', 'boss-text');
    await E.sleep(2000);
    await E.anyKey();

    S.addKdexEntry('K-Void Renascido');

    E.clear();
    bossWon = await KMCombat.combateDlc1(kreatures[0], 'K-Void Renascido', kreatures, md, cr);
  }

  // ============================================================
  // ENDINGS
  // ============================================================
  E.clear();

  if (bossWon) {
    E.print('O K-Void cai. A corrupção começa a dissipar.');
    await E.sleep(3000);
    E.print('\nOs cristais de K-Far brilham uma última vez.');
    await E.sleep(2000);
    E.print('A escuridão se desfaz.');
    await E.sleep(3000);

    E.print('\nVocê fez isso. Você salvou K-Far.');
    await E.sleep(2000);

    KMConquista.desbloquear('vencer_kvoid');

    if (temEvoluido && totalCr >= 6) {
      E.print('\n' + '═'.repeat(40), 'bold');
      E.print('  HERÓI DE K-FAR', 'bold');
      E.print('  Você derrotou até o K-Void Renascido!', 'bold');
      E.print('═'.repeat(40), 'bold');
    } else {
      E.print('\n' + '═'.repeat(40), 'bold');
      E.print('  SALVADOR DE K-FAR', 'bold');
      E.print('═'.repeat(40), 'bold');
    }
  } else {
    E.print('Seus Kreatures foram derrotados...');
    await E.sleep(2000);
    E.print('O K-Void permanece.');
    await E.sleep(2000);
    await E.anyKey();
    return;
  }

  await E.sleep(3000);
  E.print('\nSeus Kreatures olham para o céu de K-Far.');
  await E.sleep(2000);
  E.print('Pela primeira vez, as duas luas brilham juntas.');
  await E.sleep(3000);
  await E.anyKey();

  // ============================================================
  // CRÉDITOS
  // ============================================================
  KMMusic.stop();
  E.clear();
  E.print('═'.repeat(42), 'bold');
  E.print('  K-MONSTERS: A FAR PLANET', 'bold');
  E.print('  C R É D I T O S', 'bold');
  E.print('═'.repeat(42), 'bold');
  await E.sleep(3000);

  E.clear();
  E.print('Direção e Roteiro');
  await E.sleep(1000);
  E.print('  Gomes, The Coder - GTC');
  await E.sleep(3000);

  E.clear();
  E.print('Criado com Python (original) e JavaScript (web)');
  await E.sleep(3000);

  E.clear();
  E.print('Obrigado por jogar K-Monsters: A Far Planet!');
  await E.sleep(3000);
};
