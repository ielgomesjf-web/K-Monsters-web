// dlc2/game.js — K-Monsters: Ecos do Vazio (DLC2)
// Adds KMGames.dlc2()

KMGames.dlc2 = async function() {
  const E = KMEngine;
  const S = KMSave;
  KMMusic.play('exploration');

  // ============================================================
  // INTRO
  // ============================================================
  E.clear();
  E.print('═'.repeat(50), 'bold');
  E.print('  K-MONSTERS: ECOS DO VAZIO', 'bold');
  E.print('═'.repeat(50), 'bold');
  await E.sleep(3000);

  E.clear();
  E.print('A nave de resgate chega.');
  await E.sleep(2000);
  E.print('Você embarca com seus Kreatures.');
  await E.sleep(2000);
  E.print('Destino: casa.');
  await E.sleep(3000);

  E.print('\nMas no meio do caminho —');
  await E.sleep(2000);
  E.print('Uma explosão.', 'danger');
  await E.sleep(2000);
  E.print('A nave se despedaça.');
  await E.sleep(3000);

  E.print('\nVocê cai.');
  await E.sleep(2000);
  E.print('De volta para K-Far.');
  await E.sleep(3000);
  await E.anyKey();

  E.clear();
  E.print('Você se levanta da areia.');
  await E.sleep(2000);
  E.print('K-Far. De novo.');
  await E.sleep(2000);

  // Check if K-Void is present (purified from DLC1)
  const kreatures = S.getDlc1Kreatures();
  const kvoidPresente = kreatures.length > 3;

  if (kvoidPresente) {
    E.print('\nO K-Void Purificado está ao seu lado.');
    await E.sleep(2000);
    E.print('Ele sobreviveu à queda.');
    await E.sleep(2000);
    E.print('Silencioso como sempre.');
    await E.sleep(2000);
  }

  E.print('\nK-Capsule: "Transmissor de emergência danificado."');
  await E.sleep(2000);
  E.print('K-Capsule: "3 fragmentos necessários para reparo."');
  await E.sleep(2000);
  E.print('K-Capsule: "Localizando fragmentos no mapa..."');
  await E.sleep(2000);
  await E.anyKey();

  // ============================================================
  // MAPA 6x6
  // ============================================================
  const map = KMData.dlc2Map;
  const areaNames = KMData.dlc2AreaNames;
  const eventos = KMData.dlc2Eventos;
  const fragmentos = KMData.dlc2Fragmentos;

  let prog = S.getDlc2Progresso();
  let px = 0, py = 5; // Start at bottom-left (Floresta)

  const equipes = KMData.dlc2Equipes;

  let explorar = true;
  while (explorar) {
    const medalhas = S.getBaseMedalhas();
    const cristais = S.getDlc1Cristais();
    const krs = S.getDlc1Kreatures();

    const fragCount = prog.fragmentos.length;
    let infoHtml = `<span>Kreatures: ${krs.length}</span>`;
    infoHtml += `<span>Fragmentos: ${fragCount}/3</span>`;
    if (kvoidPresente) infoHtml += `<span>K-Void: presente</span>`;
    if (fragCount === 3) infoHtml += `<span style="color:var(--gold)">R=Resgatar!</span>`;

    E.showMap(map, px, py, areaNames, infoHtml);

    const extras = [{label: 'T=Trocar', value: 't'}, {label: 'Q=Sair', value: 'q'}];
    if (fragCount === 3) extras.push({label: 'R=Resgatar', value: 'r'});
    const mov = await E.mapInput(extras);
    E.hideMap();

    if (mov === 'q') { explorar = false; break; }

    if (mov === 'r' && fragCount === 3) {
      explorar = false;
      break;
    }

    if (mov === 't') {
      E.clear();
      E.print('═══ KREATURES ═══', 'bold');
      const kList = S.getDlc1Kreatures();
      kList.forEach((k, i) => E.print(`  ${i + 1} - ${k}`));
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
    px = nx; py = ny;
    const tile = map[py][px];

    // Fragmento check
    const fragKey = `${px},${py}`;
    const fragData = fragmentos[fragKey];
    if (fragData && !prog.fragmentos.includes(fragData.id)) {
      E.clear();
      E.print(fragData.desc, 'success');
      await E.sleep(2000);
      prog.fragmentos.push(fragData.id);
      S.setDlc2Progresso(prog);
      E.print(`\nFragmentos: ${prog.fragmentos.length}/3`);
      if (prog.fragmentos.length === 3) {
        await E.sleep(1000);
        E.print('\nK-Capsule: "Todos os fragmentos recuperados."', 'info');
        E.print('K-Capsule: "Transmissor montado. Aperte R no mapa para resgatar."');
      }
      await E.sleep(2000);
      await E.anyKey();
    }

    // Evento narrativo
    const evKey = `${px},${py}`;
    const evId = eventos[evKey];
    if (evId && !prog.visitados.includes(evKey)) {
      prog.visitados.push(evKey);
      S.setDlc2Progresso(prog);
      await this._dlc2Evento(E, evId, kvoidPresente);
    }

    // Encontro de equipe (25% chance)
    if (equipes[tile] && Math.random() < 0.25) {
      const equipeInimiga = equipes[tile][Math.floor(Math.random() * equipes[tile].length)];
      equipeInimiga.forEach(k => S.addKdexEntry(k));
      E.clear();
      E.print(`Uma equipe aparece: ${equipeInimiga.join(', ')}!`, 'bold');
      await E.sleep(1000);

      const act = await E.choice([
        {label: 'Lutar!', value: 'fight', primary: true},
        {label: 'Fugir', value: 'flee'},
      ]);

      if (act === 'fight') {
        const krs2 = S.getDlc1Kreatures();
        const md = S.getBaseMedalhas();
        const cr = S.getDlc1Cristais();
        await KMCombat.combateEquipeDlc2(krs2, equipeInimiga, md, cr, kvoidPresente);
        KMMusic.play('exploration');
      }
      await E.sleep(1000);
      await E.anyKey();
    }
  }

  // ============================================================
  // FINALE — RESGATE
  // ============================================================
  E.clear();
  E.print('Você ativa o transmissor.');
  await E.sleep(2000);
  E.print('K-Capsule: "Transmitindo sinal de resgate..."');
  await E.sleep(3000);
  E.print('K-Capsule: "Sinal recebido. Nave a caminho."');
  await E.sleep(3000);

  E.print('\nVocê olha para o céu.');
  await E.sleep(2000);
  E.print('Pela primeira vez em dias, você vai sair daqui.');
  await E.sleep(3000);

  let ending = 'normal';

  if (kvoidPresente) {
    E.print('\nO K-Void está parado ao seu lado.');
    await E.sleep(2000);
    E.print('Ele olha para o horizonte.');
    await E.sleep(2000);
    E.print('Depois para o chão de K-Far.');
    await E.sleep(2000);
    E.print('Depois para você.');
    await E.sleep(3000);

    const resp = await E.choice([
      {label: 'Pedir que venha', value: 'sim'},
      {label: 'Deixar em K-Far', value: 'nao'},
    ]);

    E.clear();

    if (resp === 'sim') {
      ending = 'guardiao';
      E.print('O K-Void olha para K-Far uma última vez.');
      await E.sleep(3000);
      E.print('Ele acena — quase imperceptível.');
      await E.sleep(2000);
      E.print('E fica ao seu lado enquanto a nave pousa.');
      await E.sleep(3000);
      E.print('\nA rampa se abre. Vocês entram.');
      await E.sleep(2000);
      E.print('Lá fora, K-Far vai ficando cada vez menor.');
      await E.sleep(3000);
      E.print('O K-Void olha pela janela. Sem expressão.');
      await E.sleep(2000);
      E.print('Mas ele está ali.');
      await E.sleep(3000);

      E.print('\n' + '═'.repeat(40), 'bold');
      E.print('  GUARDIÃO. AINDA.', 'bold');
      E.print('═'.repeat(40), 'bold');
    } else {
      ending = 'pertence';
      E.print('O K-Void olha para a nave que se aproxima.');
      await E.sleep(3000);
      E.print('Depois vira as costas.');
      await E.sleep(2000);
      E.print('Ele caminha na direção do local do selamento.');
      await E.sleep(3000);
      E.print('Devagar. Sem pressa.');
      await E.sleep(3000);
      E.print('\nVocê chama.');
      await E.sleep(2000);
      E.print('Ele não para.');
      await E.sleep(3000);
      E.print('\nA nave pousa. Você embarca.');
      await E.sleep(2000);
      E.print('A última coisa que você vê é a silhueta dele,');
      await E.sleep(2000);
      E.print('parado no centro da marca circular,');
      await E.sleep(2000);
      E.print('olhando para cima.');
      await E.sleep(3000);

      E.print('\n' + '═'.repeat(40), 'bold');
      E.print('  ELE PERTENCE A ESSE LUGAR.', 'bold');
      E.print('═'.repeat(40), 'bold');
    }
  } else {
    E.print('\nA nave pousa. Você embarca.');
    await E.sleep(2000);
    E.print('K-Far vai ficando para trás.');
    await E.sleep(3000);
    E.print('\n' + '═'.repeat(40), 'bold');
    E.print('  FIM', 'bold');
    E.print('═'.repeat(40), 'bold');
  }

  await E.sleep(3000);
  await E.anyKey();

  // ============================================================
  // CRÉDITOS
  // ============================================================
  E.clear();
  E.print('═'.repeat(50), 'bold');
  E.print('  K-MONSTERS: ECOS DO VAZIO', 'bold');
  E.print('  C R É D I T O S', 'bold');
  E.print('═'.repeat(50), 'bold');
  await E.sleep(3000);

  E.clear();
  E.print('Criador: Gomes, The Coder - GTC');
  await E.sleep(1000);
  E.print('Linguagem: Python (original), JavaScript (web)');
  await E.sleep(2000);
  E.print('\nObrigado por jogar K-Monsters: Ecos do Vazio!');
  await E.sleep(3000);
};

// DLC2 event handler
KMGames._dlc2Evento = async function(E, evId, kvoidPresente) {
  E.clear();

  if (evId === 'praia_norte') {
    E.print('Você chega à beira do mar cristalino.');
    await E.sleep(2000);
    E.print('O horizonte se abre. O céu tem duas luas.');
    await E.sleep(2000);
    if (kvoidPresente) {
      E.print('\nO K-Void para. Ele olha para cima.');
      await E.sleep(2000);
      E.print('Não para as luas. Para um ponto específico entre elas.');
      await E.sleep(3000);
      E.print('\nK-Void: "KO ?"');
      await E.sleep(3000);
      E.print('Ele abaixa a cabeça. Não diz mais nada.');
      await E.sleep(2000);
    }
  } else if (evId === 'cratera') {
    E.print('Uma cratera enorme se abre à sua frente.');
    await E.sleep(2000);
    E.print('Quilômetros de profundidade. Seca. Antiga.');
    await E.sleep(2000);
    if (kvoidPresente) {
      E.print('\nK-Void: "Isso era um oceano."');
      await E.sleep(3000);
    }
  } else if (evId === 'ruinas') {
    E.print('As ruínas são antigas. Mais antigas que qualquer coisa.');
    await E.sleep(2000);
    E.print('As paredes têm marcas. Dez símbolos repetidos, em círculo.');
    await E.sleep(2000);
    E.print('Fogo. Gelo. Pedra. Sombra. Cristal. Água. Vento. Luz. Terra. Relâmpago.');
    await E.sleep(3000);
    if (kvoidPresente) {
      E.print('\nK-Void: "Eu me lembro de cada um."');
      await E.sleep(3000);
    }
  } else if (evId === 'floresta_carbonizada') {
    E.print('As árvores cristalinas aqui estão diferentes.');
    await E.sleep(2000);
    E.print('Carbonizadas. Negras.');
    await E.sleep(2000);
    if (kvoidPresente) {
      E.print('\nK-Void: "Passei por aqui."');
      await E.sleep(2000);
    }
  } else if (evId === 'selamento') {
    E.print('O terreno aqui é diferente. Plano. Perfeitamente plano.');
    await E.sleep(2000);
    E.print('No centro, uma marca circular gravada fundo na pedra.');
    await E.sleep(3000);
    if (kvoidPresente) {
      E.print('\nO K-Void para no centro da marca.');
      await E.sleep(2000);
      E.print('K-Void: "Aqui."');
      await E.sleep(4000);
    }
  } else if (evId === 'encosta_estrelas') {
    E.print('Da encosta cristalina, o céu noturno de K-Far se abre.');
    await E.sleep(2000);
    E.print('Centenas de estrelas.');
    await E.sleep(2000);
    if (kvoidPresente) {
      E.print('\nO K-Void olha para o céu. Por um longo tempo.');
      await E.sleep(3000);
      E.print('K-Void: "Três daquelas não existem mais."');
      await E.sleep(3000);
      E.print('K-Void: "Fui eu."');
      await E.sleep(3000);
    }
  }

  await E.anyKey();
};
