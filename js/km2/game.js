// km2/game.js — K-Monsters 2: De Volta ao Lar
// Adds KMGames.km2()

KMGames.km2 = async function() {
  const E = KMEngine;
  const S = KMSave;

  // ============================================================
  // TÍTULO
  // ============================================================
  E.clear();
  E.print('═'.repeat(44), 'bold');
  E.print('  K-MONSTERS 2', 'bold');
  E.print('  De Volta ao Lar', 'bold');
  E.print('═'.repeat(44), 'bold');
  await E.sleep(3000);

  // ============================================================
  // VERIFICAR SAVE BASE (se já jogou KM1)
  // ============================================================
  const temSaveBase = S.getBaseKreatures().length > 0;

  // ============================================================
  // INTRO — Clark
  // ============================================================
  E.clear();
  E.print('Clark tem dezessete anos.');
  await E.sleep(2000);
  E.print('Nunca teve um Kreature.');
  await E.sleep(2000);
  E.print('Cresceu ouvindo histórias sobre K-Masters,');
  await E.sleep(2000);
  E.print('sobre K-Maps e sobre batalhas que mudaram o mundo.');
  await E.sleep(3000);

  E.clear();
  E.print('Hoje ele sai de casa.');
  await E.sleep(3000);
  E.print('Com uma mochila e nenhum plano.');
  await E.sleep(4000);

  E.clear();
  if (temSaveBase) {
    E.print('Na estrada, ele encontra alguém.');
    await E.sleep(2000);
    E.print('Um treinador. Mais velho. Com um olhar de quem já viu muito.');
    await E.sleep(3000);
    E.print('Ao lado dele — uma equipe enorme.');
    await E.sleep(2000);
    E.print('Kreatures que Clark nunca viu antes.');
    await E.sleep(2000);
    E.print('Evoluídos. Poderosos. Quietos.');
    await E.sleep(3000);
    E.print('\nO treinador olha para Clark.');
    await E.sleep(2000);
    E.print('"Você está indo para onde ?"');
    await E.sleep(2000);
    E.print('"K-Stadium."');
    await E.sleep(2000);
    E.print('O treinador para.');
    await E.sleep(3000);
    E.print('"...Tem algo lá. Não sei explicar."');
    await E.sleep(3000);
    E.print('"Mas não é perigoso. Vai lá."');
    await E.sleep(5000);
  } else {
    E.print('Na estrada, Clark ouve rumores.');
    await E.sleep(2000);
    E.print('O K-Stadium.');
    await E.sleep(2000);
    E.print('Abandonado há anos.');
    await E.sleep(2000);
    E.print('Mas alguém jurou ter visto uma luz lá dentro.');
    await E.sleep(4000);
  }

  E.clear();
  E.print('O K-Stadium fica no sul do mapa.');
  await E.sleep(2000);
  E.print('Clark chega quando o céu já está escuro.');
  await E.sleep(3000);
  E.print('\nAs portas estão abertas.');
  await E.sleep(2000);
  E.print('Ou melhor —');
  await E.sleep(2000);
  E.print('estão quebradas.');
  await E.sleep(4000);
  await E.anyKey();

  // ============================================================
  // K-STADIUM — ENCONTRANDO A CÁPSULA
  // ============================================================
  E.clear();
  E.print('A arena é grande.');
  await E.sleep(2000);
  E.print('E completamente vazia.');
  await E.sleep(3000);
  E.print('As arquibancadas quebradas.');
  await E.sleep(2000);
  E.print('O chão rachado.');
  await E.sleep(2000);
  E.print('Como se algo tivesse acontecido aqui.');
  await E.sleep(4000);

  E.print('\nClark vai até o centro.');
  await E.sleep(3000);

  E.clear();
  E.print('E então ele vê.');
  await E.sleep(4000);
  E.print('No meio da arena —');
  await E.sleep(2000);
  E.print('uma cápsula.');
  await E.sleep(4000);

  E.print('\nGrande. Antiga.');
  await E.sleep(2000);
  E.print('Com marcas de batalha ao redor.');
  await E.sleep(3000);
  E.print('Como se algo dentro dela tivesse tentado sair.');
  await E.sleep(3000);
  E.print('Por muito tempo.');
  await E.sleep(5000);
  await E.anyKey();

  E.clear();
  E.print('Clark se aproxima.');
  await E.sleep(3000);
  E.print('A cápsula pulsa, fraca.');
  await E.sleep(2000);
  E.print('Ainda está ativa.');
  await E.sleep(3000);

  E.print('\nEle olha para o painel.');
  await E.sleep(2000);
  E.print('Lê a única palavra que aparece na tela:');
  await E.sleep(3000);
  E.print('[ SELADO ]');
  await E.sleep(5000);

  E.clear();
  E.print('Clark não pensa muito.');
  await E.sleep(3000);
  E.print('Aperta o botão de liberação.');
  await E.sleep(4000);
  await E.anyKey();

  // ============================================================
  // K-OMEGA É LIBERTADO
  // ============================================================
  E.clear();
  E.print('A cápsula abre.');
  await E.sleep(3000);
  E.print('Uma luz.');
  await E.sleep(2000);
  E.print('Depois nada.');
  await E.sleep(4000);

  E.print('\nE então —');
  await E.sleep(3000);
  E.print('algo emerge.');
  await E.sleep(5000);

  E.clear();
  E.print('Grande.');
  await E.sleep(2000);
  E.print('Escuro.');
  await E.sleep(2000);
  E.print('Imponente.');
  await E.sleep(3000);
  E.print('\nUm Kreature.');
  await E.sleep(3000);
  E.print('Mas não como qualquer outro que Clark já ouviu falar.');
  await E.sleep(4000);

  E.clear();
  E.print('Ele olha para Clark.');
  await E.sleep(3000);
  E.print('Clark não recua.');
  await E.sleep(3000);

  E.print('\nSegundos passam.');
  await E.sleep(4000);

  E.print('\nK-Omega: "...Você não tem medo ?"');
  await E.sleep(6000);

  E.clear();
  E.print('Clark não sabe o que dizer.');
  await E.sleep(3000);
  E.print('Então não diz nada.');
  await E.sleep(3000);
  E.print('Só fica parado.');
  await E.sleep(4000);

  E.print('\nK-Omega olha para ele por mais um momento.');
  await E.sleep(3000);
  E.print('Depois olha para frente.');
  await E.sleep(2000);
  E.print('Para o horizonte além das ruínas.');
  await E.sleep(3000);

  E.print('\nE grita:');
  await E.sleep(2000);
  E.print('K-Omega: "VOID !!!"', 'boss-text');
  await E.sleep(6000);

  E.clear();
  E.print('Antes que Clark possa reagir —');
  await E.sleep(2000);
  E.print('K-Omega foi.');
  await E.sleep(4000);

  E.print('\nDesapareceu na noite.');
  await E.sleep(3000);
  E.print('Como se o mundo inteiro fosse pequeno demais para ele.');
  await E.sleep(5000);

  E.clear();
  E.print('Clark olha para o espaço onde K-Omega estava.');
  await E.sleep(3000);
  E.print('Depois olha para o caminho à frente.');
  await E.sleep(4000);

  E.print('\nEle não entende nada do que acabou de acontecer.');
  await E.sleep(3000);
  E.print('Mas entende uma coisa:');
  await E.sleep(3000);
  E.print('ele vai seguir.');
  await E.sleep(5000);
  await E.anyKey();

  E.clear();
  E.print('[ Explore o mundo. Capture Kreatures. ]');
  await E.sleep(1000);
  E.print('[ Construa um time de até 3 Kreatures. ]');
  await E.sleep(1000);
  E.print('[ Participe da K-Competition na Arena para ganhar moedas. ]');
  await E.sleep(1000);
  E.print('[ Use moedas para acessar a Área Exótica. ]');
  await E.sleep(2000);
  await E.anyKey('Começar');

  // ============================================================
  // SAVE INICIAL — dar K-Rat se vazio
  // ============================================================
  let save = S.getKm2Save();

  if (!save.time || save.time.length === 0) {
    E.clear();
    E.print('Perto da cápsula aberta, algo se mexe no chão.');
    await E.sleep(2000);
    E.print('Um K-Rat.');
    await E.sleep(2000);
    E.print('Pequeno. Assustado. Te olhando.');
    await E.sleep(3000);
    E.print('\nVocê abre o K-Digitalizador.');
    await E.sleep(2000);
    E.print('Sem pensar muito.');
    await E.sleep(3000);
    E.print('\n[ K-Rat capturado! ]', 'success');
    await E.sleep(2000);
    E.print('Parece um começo.');
    await E.sleep(3000);
    await E.anyKey();

    save.kreatures['K-Rat'] = { medalhas: 0 };
    save.time = ['K-Rat'];
    S.setKm2Save(save);
  }

  // Stadium event on first entry
  const hist = save.historia || {};
  if (!hist.ev_stadium) {
    E.clear();
    E.print('As ruínas do K-Stadium.');
    await E.sleep(2000);
    E.print('Foi aqui que tudo começou.');
    await E.sleep(3000);
    E.print('A cápsula já foi aberta.');
    await E.sleep(3000);
    E.print('O que estava dentro está em algum lugar neste mundo.');
    await E.sleep(4000);
    await E.anyKey();
    save.historia = save.historia || {};
    save.historia.ev_stadium = true;
    S.setKm2Save(save);
  }

  // ============================================================
  // MAPA 7x7
  // ============================================================
  const map = KMData.km2Map;
  const areaNames = KMData.km2AreaNames;
  const areaKreatures = KMData.km2AreaKreatures;

  let px = 2, py = 6; // Start at K-Stadium (Ruínas)

  let explorar = true;
  while (explorar) {
    save = S.getKm2Save();
    const timeTxt = save.time.length ? save.time.join(' | ') : 'vazio';
    let infoHtml = `<span>Time: ${timeTxt}</span>`;
    infoHtml += `<span>Kreatures: ${Object.keys(save.kreatures).length}  |  Moedas: ${save.moedas}</span>`;

    const area = map[py][px];
    E.showMap(map, px, py, areaNames, infoHtml);

    const extras = [
      {label: 'T=Time', value: 't'},
      {label: 'Q=Sair', value: 'q'},
    ];
    if (area === 'A') extras.push({label: 'K=Competition', value: 'k'});
    const mov = await E.mapInput(extras);
    E.hideMap();

    if (mov === 'q') { explorar = false; break; }

    if (mov === 't') {
      await this._km2GerenciarTime(E, save);
      continue;
    }

    if (mov === 'k' && area === 'A') {
      save = await this._km2Competition(E, save);
      S.setKm2Save(save);
      continue;
    }

    let nx = px, ny = py;
    if (mov === 'w') ny--;
    else if (mov === 's') ny++;
    else if (mov === 'a') nx--;
    else if (mov === 'd') nx++;
    else continue;

    if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[0].length) continue;

    const novaArea = map[ny][nx];
    if (novaArea === '.' || novaArea === ' ') continue;

    // Block Exotic Area until paid
    if (novaArea === 'E' && !save.area_exotica) {
      E.clear();
      E.print('A entrada está bloqueada por uma barreira energética.');
      await E.sleep(2000);
      E.print('Mas você sente algo do outro lado.');
      await E.sleep(3000);

      if (save.moedas >= 350) {
        E.print(`\nVocê tem ${save.moedas} moedas.`);
        E.print('Custo para desbloquear: 350 moedas.');

        const resp = await E.choice([
          {label: 'Desbloquear (350)', value: 'sim', primary: true},
          {label: 'Não agora', value: 'nao'},
        ]);

        if (resp === 'sim') {
          save.moedas -= 350;
          save.area_exotica = true;
          S.setKm2Save(save);
          E.clear();
          E.print('A barreira cede.');
          await E.sleep(2000);
          E.print('Área Exótica desbloqueada.', 'success');
          await E.sleep(2000);
          await E.anyKey();
        } else {
          await E.anyKey();
          continue;
        }
      } else {
        E.print(`\nVocê precisa de 350 moedas. (Você tem: ${save.moedas})`);
        E.print('Participe da K-Competition na Arena.');
        await E.sleep(3000);
        await E.anyKey();
        continue;
      }
    }

    px = nx; py = ny;

    // Story events
    if (novaArea === 'V' && !save.historia?.ev_village) {
      await this._km2EventoVillage(E);
      save.historia = save.historia || {};
      save.historia.ev_village = true;
      S.setKm2Save(save);
    } else if (novaArea === 'P' && !save.historia?.ev_fp) {
      await this._km2EventoFP(E);
      save.historia = save.historia || {};
      save.historia.ev_fp = true;
      S.setKm2Save(save);
    }

    // Finale check
    if (novaArea === 'E' && save.area_exotica &&
        save.historia?.ev_village && save.historia?.ev_fp &&
        !save.historia?.finale_visto) {
      save.historia.finale_visto = true;
      S.setKm2Save(save);
      explorar = false;
      break;
    }

    // Wild encounter (35%)
    if (areaKreatures[novaArea] && Math.random() < 0.35) {
      if (!save.time || save.time.length === 0) {
        E.clear();
        if (Object.keys(save.kreatures).length > 0) {
          E.print('Você tem Kreatures capturados mas nenhum no time!');
          await E.sleep(1000);
          E.print('Aperte T no mapa para montar seu time.');
        } else {
          E.print('Sem Kreatures no time — você foge!');
        }
        await E.sleep(2000);
        await E.anyKey();
        continue;
      }

      const equipe = areaKreatures[novaArea][Math.floor(Math.random() * areaKreatures[novaArea].length)];
      E.clear();
      E.print(`${equipe.join('  e  ')} aparecem!`, 'bold');
      await E.sleep(500);

      const act = await E.choice([
        {label: 'Lutar!', value: 'fight', primary: true},
        {label: 'Ignorar', value: 'ignore'},
      ]);

      if (act === 'fight') {
        const result = await KMCombat.combateKM2(save.time, equipe, save, true);
        save = result.save;
        S.setKm2Save(save);
      }
      await E.anyKey();
    }
  }

  // ============================================================
  // FINALE — K-Omega e K-Void
  // ============================================================
  E.clear();
  E.print('A Área Exótica é diferente.');
  await E.sleep(2000);
  E.print('Silenciosa.');
  await E.sleep(2000);
  E.print('Como se algo aqui não pertencesse a este mundo.');
  await E.sleep(4000);

  E.clear();
  E.print('Você ouve passos.');
  await E.sleep(2000);
  E.print('Pesados. Lentos.');
  await E.sleep(2000);
  E.print('K-Omega aparece à sua frente.');
  await E.sleep(4000);

  E.print('\nEle para.');
  await E.sleep(2000);
  E.print('Olha para você.');
  await E.sleep(3000);
  E.print('K-Omega: "...Você me seguiu até aqui."');
  await E.sleep(4000);

  E.print('\n"Sim."');
  await E.sleep(3000);
  E.print('K-Omega: "..."');
  await E.sleep(3000);
  E.print('K-Omega: "Por quê ?"');
  await E.sleep(4000);
  await E.anyKey();

  E.clear();
  E.print('Você não tem uma resposta pronta.');
  await E.sleep(3000);
  E.print('Mas K-Omega não espera uma.');
  await E.sleep(3000);
  E.print('Ele apenas olha para o fundo da área.');
  await E.sleep(4000);

  E.print('\nE então —');
  await E.sleep(3000);

  E.clear();
  E.print('Uma presença.');
  await E.sleep(3000);
  E.print('Enorme.');
  await E.sleep(2000);
  E.print('Antiga.');
  await E.sleep(2000);
  E.print('Você a sente antes de vê-la.');
  await E.sleep(5000);

  E.clear();
  E.print('K-Void.', 'boss-text');
  await E.sleep(4000);
  E.print('Aqui.');
  await E.sleep(3000);
  E.print('Neste lugar isolado do mundo.');
  await E.sleep(4000);

  E.print('\nK-Omega não se move por um longo tempo.');
  await E.sleep(5000);
  await E.anyKey();

  E.clear();
  E.print('E então, pela primeira vez desde que foi libertado —');
  await E.sleep(3000);
  E.print('ele fala baixo.');
  await E.sleep(4000);

  E.print('\nK-Omega: "...Você ainda estava aqui."');
  await E.sleep(6000);

  E.clear();
  E.print('Silêncio.');
  await E.sleep(5000);
  E.print('Um silêncio diferente de todos os outros.');
  await E.sleep(4000);
  E.print('Este tem peso.');
  await E.sleep(3000);
  E.print('Este tem forma.');
  await E.sleep(5000);
  await E.anyKey();

  E.clear();
  E.print('K-Void:');
  await E.sleep(5000);

  E.print('\n"KO."', 'boss-text');
  await E.sleep(8000);

  E.clear();
  E.print('Só isso.');
  await E.sleep(3000);
  E.print('Uma sílaba.');
  await E.sleep(3000);
  E.print('A mesma que ele repetia por milênios.');
  await E.sleep(4000);
  E.print('Mas desta vez —');
  await E.sleep(3000);
  E.print('uma resposta.');
  await E.sleep(6000);
  await E.anyKey();

  E.clear();
  E.print('K-Omega não diz mais nada.');
  await E.sleep(3000);
  E.print('K-Void também não.');
  await E.sleep(3000);
  E.print('Eles ficam parados.');
  await E.sleep(3000);
  E.print('Juntos.');
  await E.sleep(6000);

  E.clear();
  E.print('Você entende que não há mais nada a fazer aqui.');
  await E.sleep(3000);
  E.print('Que este momento não é seu.');
  await E.sleep(4000);

  E.print('\nVocê se vira.');
  await E.sleep(3000);
  E.print('E vai embora.');
  await E.sleep(4000);

  E.clear();
  E.print('Lá atrás —');
  await E.sleep(2000);
  E.print('dois seres que existem há mais tempo do que qualquer coisa');
  await E.sleep(3000);
  E.print('finalmente estão no mesmo lugar.');
  await E.sleep(6000);
  await E.anyKey();

  E.clear();
  E.print('\n' + '═'.repeat(44), 'bold');
  E.print('  K-MONSTERS 2: DE VOLTA AO LAR', 'bold');
  E.print('', 'bold');
  E.print('         F  I  M', 'bold');
  E.print('', 'bold');
  E.print('  "KO."', 'bold');
  E.print('       — K-Void.', 'bold');
  E.print('═'.repeat(44), 'bold');
  await E.sleep(5000);
  await E.anyKey();

  // ============================================================
  // CRÉDITOS
  // ============================================================
  E.clear();
  E.print('═'.repeat(44), 'bold');
  E.print('  K-MONSTERS 2: DE VOLTA AO LAR', 'bold');
  E.print('         C R É D I T O S', 'bold');
  E.print('═'.repeat(44), 'bold');
  await E.sleep(3000);

  E.clear();
  E.print('Direção e Roteiro');
  await E.sleep(1000);
  E.print('  Gomes, The Coder - GTC');
  await E.sleep(3000);

  E.clear();
  E.print('Personagens');
  await E.sleep(1000);
  E.print('  Clark');
  await E.sleep(1000);
  E.print('  K-Omega');
  await E.sleep(1000);
  E.print('  K-Void');
  await E.sleep(1000);
  E.print('  O Protagonista');
  await E.sleep(3000);

  E.clear();
  E.print('Kreatures Originais');
  await E.sleep(1000);
  E.print('  K-Rat  K-Bat  Piki  K-Mag  K-Mega');
  await E.sleep(1000);
  E.print('  K-Volkan  Pikstorm  K-Shadowbat');
  await E.sleep(1000);
  E.print('  K-Manipuler  K-Miroir  K-Phantom');
  await E.sleep(1000);
  E.print('  e muitos outros.');
  await E.sleep(3000);

  E.clear();
  E.print('Criado com Python (original) e JavaScript (web)');
  await E.sleep(3000);

  E.clear();
  E.print('Agradecimentos');
  await E.sleep(2000);
  E.print('  A quem jogou todos os jogos.');
  await E.sleep(2000);
  E.print('  A quem entendeu que K-Omega');
  await E.sleep(1000);
  E.print('  só queria existir.');
  await E.sleep(3000);
  E.print('  E que K-Void só queria');
  await E.sleep(1000);
  E.print('  não estar sozinho.');
  await E.sleep(5000);

  E.clear();
  E.print('═'.repeat(44), 'bold');
  E.print('  K-MONSTERS: COMPANHIA ESQUECIDA', 'bold');
  E.print('  K-MONSTERS: ECOS DO VAZIO', 'bold');
  E.print('  K-MONSTERS: A FAR PLANET', 'bold');
  E.print('  K-MONSTERS', 'bold');
  E.print('  K-MONSTERS 2: DE VOLTA AO LAR', 'bold');
  E.print('');
  E.print('  Obrigado por jogar.');
  E.print('═'.repeat(44), 'bold');
  await E.sleep(6000);
};

// ============================================================
// KM2 — Team management
// ============================================================
KMGames._km2GerenciarTime = async function(E, save) {
  E.clear();
  E.print('═══ GERENCIAR TIME ═══', 'bold');
  const timeAtual = save.time || [];
  const kreatures = save.kreatures || {};

  E.print(`Time atual: ${timeAtual.length ? timeAtual.join(' | ') : 'vazio'}\n`);

  const lista = Object.keys(kreatures);
  if (!lista.length) {
    E.print('Nenhum Kreature capturado ainda.');
    await E.sleep(2000);
    return;
  }

  const options = [];
  for (let i = 0; i < lista.length; i++) {
    const nome = lista[i];
    const medalhas = kreatures[nome]?.medalhas || 0;
    const noTime = timeAtual.includes(nome) ? ' *' : '';
    const tipo = KMData.km2Stats[nome]?.tipo || '?';
    options.push({label: `${nome} (med:${medalhas}) [${tipo}]${noTime}`, value: String(i)});
  }
  options.push({label: 'Cancelar', value: 'cancel'});

  // Select up to 3
  const novoTime = [];
  for (let slot = 0; slot < 3; slot++) {
    E.print(`\nSlot ${slot + 1}/3 (time atual: ${novoTime.join(', ') || 'vazio'})`);
    const filtered = options.filter(o => o.value === 'cancel' || !novoTime.includes(lista[parseInt(o.value)]));
    const resp = await E.choice(filtered);
    if (resp === 'cancel') break;
    const idx = parseInt(resp);
    if (idx >= 0 && idx < lista.length) {
      novoTime.push(lista[idx]);
    }
  }

  if (novoTime.length > 0) {
    save.time = novoTime;
    const S = KMSave;
    S.setKm2Save(save);
    E.print(`\nTime: ${novoTime.join(' | ')}`, 'success');
  }
  await E.sleep(1000);
  await E.anyKey();
};

// ============================================================
// KM2 — K-Competition
// ============================================================
KMGames._km2Competition = async function(E, save) {
  const fases = KMData.km2CompeticaoFases;
  const faseAtual = save.competicao_fase || 0;

  if (!save.time || save.time.length === 0) {
    E.clear();
    E.print('Você precisa de pelo menos 1 Kreature no time!');
    await E.sleep(2000);
    await E.anyKey();
    return save;
  }

  E.clear();
  E.print('═════ K-COMPETITION ═════', 'bold');
  await E.sleep(1000);

  if (faseAtual >= fases.length) {
    E.print('Você já completou todas as fases da K-Competition!');
    E.print(`Moedas: ${save.moedas}`);
    await E.sleep(2000);
    await E.anyKey();
    return save;
  }

  const fase = fases[faseAtual];
  E.print(`\n${fase.nome}`);
  E.print(`Recompensa: ${fase.moedas} moedas`);
  await E.sleep(1000);

  // K-Omega observa na primeira fase
  if (faseAtual === 0 && !save.historia?.ev_arena) {
    E.print('\n...');
    await E.sleep(2000);
    E.print('Você sente um olhar.');
    await E.sleep(2000);
    E.print('Nas arquibancadas quebradas — uma silhueta.');
    await E.sleep(3000);
    E.print('Grande. Imóvel.');
    await E.sleep(2000);
    E.print('Antes que você possa ver direito, ela some.');
    await E.sleep(3000);
    save.historia = save.historia || {};
    save.historia.ev_arena = true;
  }

  await E.anyKey('Começar');

  let venceuTudo = true;

  for (const treinador of fase.treinadores) {
    E.clear();
    E.print(`${treinador.nome} quer batalhar!`, 'bold');
    E.print(`Time: ${treinador.time.join(', ')}`);
    await E.sleep(1000);
    await E.anyKey('Batalhar');

    const result = await KMCombat.combateKM2(save.time, treinador.time, save, false);
    save = result.save;

    if (!result.venceu) {
      E.clear();
      E.print(`${treinador.nome} venceu.`);
      await E.sleep(2000);
      E.print('Tente de novo mais tarde.');
      await E.sleep(2000);
      venceuTudo = false;
      break;
    }

    E.clear();
    E.print(`${treinador.nome} foi derrotado!`, 'success');
    await E.sleep(2000);
  }

  if (venceuTudo) {
    save.moedas = (save.moedas || 0) + fase.moedas;
    save.competicao_fase = faseAtual + 1;

    E.clear();
    E.print(`═══ ${fase.nome} concluída! ═══`, 'bold');
    await E.sleep(1000);
    E.print(`+${fase.moedas} moedas!`, 'success');
    E.print(`Total: ${save.moedas} moedas`);
    await E.sleep(2000);

    if (faseAtual === fases.length - 1) {
      E.print('\nVocê é o Campeão da K-Competition!', 'bold');
      await E.sleep(2000);
    } else if (!save.area_exotica && save.moedas >= 350) {
      E.print('\n[ Moedas suficientes para acessar a Área Exótica! ]', 'info');
      E.print('[ Use 350 moedas na entrada da área E no mapa. ]');
      await E.sleep(3000);
    }
  }

  KMSave.setKm2Save(save);
  await E.anyKey('Voltar ao mapa');
  return save;
};

// ============================================================
// KM2 — Story events
// ============================================================
KMGames._km2EventoVillage = async function(E) {
  E.clear();
  E.print('K-Village.');
  await E.sleep(2000);
  E.print('Os moradores falam de algo.');
  await E.sleep(2000);
  E.print('Uma lenda.');
  await E.sleep(3000);

  E.print('\nMorador: "Dizem que havia uma criatura no K-Stadium."');
  await E.sleep(3000);
  E.print('Morador: "Presa numa cápsula. Por anos."');
  await E.sleep(3000);
  E.print('Morador: "Ninguém sabia de onde veio."');
  await E.sleep(3000);
  E.print('Morador: "Só que ela ficava chamando algo."');
  await E.sleep(3000);
  E.print('Morador: "Sempre o mesmo som. Sempre."');
  await E.sleep(4000);

  E.print('\n...');
  await E.sleep(3000);
  E.print('Você lembra do que K-Omega disse ao ser libertado.');
  await E.sleep(3000);
  E.print('"VOID."');
  await E.sleep(4000);

  E.print('\nUm vulto aparece no canto da rua.');
  await E.sleep(2000);
  E.print('Grande. Escuro. Te observando.');
  await E.sleep(3000);
  E.print('Antes que você pise na direção dele —');
  await E.sleep(2000);
  E.print('ele foi embora.');
  await E.sleep(4000);

  await E.anyKey();
};

KMGames._km2EventoFP = async function(E) {
  E.clear();
  E.print('K-Far Planet.');
  await E.sleep(2000);
  E.print('Kreatures que não são daqui.');
  await E.sleep(2000);
  E.print('Trazidos de outro mundo.');
  await E.sleep(3000);

  E.print('\nVocê olha para o céu.');
  await E.sleep(3000);
  E.print('E ouve uma voz baixa.');
  await E.sleep(3000);
  E.print('Muito baixa.');
  await E.sleep(3000);

  E.print('\nK-Omega: "...Era daqui que ele me falava sobre o universo."');
  await E.sleep(5000);
  E.print('K-Omega: "Descrevia as estrelas."');
  await E.sleep(3000);
  E.print('K-Omega: "Eu nunca tinha visto uma."');
  await E.sleep(4000);

  E.print('\nVocê se vira.');
  await E.sleep(2000);
  E.print('K-Omega está parado, olhando para o céu.');
  await E.sleep(3000);
  E.print('Ele não fala mais nada.');
  await E.sleep(3000);
  E.print('Depois de um tempo, ele vai embora.');
  await E.sleep(4000);

  await E.anyKey();
};
