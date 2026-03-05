// dlc3/game.js — K-Monsters: Companhia Esquecida (DLC3)
// Adds KMGames.dlc3()

KMGames.dlc3 = async function() {
  const E = KMEngine;
  const S = KMSave;
  KMMusic.play('exploration');

  // ============================================================
  // INTRO — Nascimento do K-Omega
  // ============================================================
  E.clear();
  E.print('═'.repeat(50), 'bold');
  E.print('  K-MONSTERS: COMPANHIA ESQUECIDA', 'bold');
  E.print('═'.repeat(50), 'bold');
  await E.sleep(3000);

  E.clear();
  E.print('Escuridão.');
  await E.sleep(3000);
  E.print('Só escuridão.');
  await E.sleep(4000);

  E.print('\nE uma presença.');
  await E.sleep(3000);
  E.print('Imensa. Antiga. Sozinha.');
  await E.sleep(4000);

  E.print('\nEla existe há mais tempo do que os planetas ao redor.');
  await E.sleep(2000);
  E.print('Mais tempo do que as estrelas que ela consumiu.');
  await E.sleep(3000);
  E.print('Mais tempo do que qualquer coisa que possa ser contada.');
  await E.sleep(4000);

  E.print('\nEla pensa.');
  await E.sleep(3000);
  E.print('É a única coisa que ainda pode fazer.');
  await E.sleep(4000);
  await E.anyKey();

  E.clear();
  E.print('Ela pensa em companhia.');
  await E.sleep(3000);
  E.print('Em ter algo do lado.');
  await E.sleep(3000);
  E.print('Em não ser a única coisa real no vazio.');
  await E.sleep(5000);

  E.print('\nE então —');
  await E.sleep(2000);
  E.print('Algo responde.');
  await E.sleep(5000);
  await E.anyKey();

  E.clear();
  E.print('K-Void: "Você... existe."');
  await E.sleep(4000);

  E.print('\n"..."');
  await E.sleep(3000);
  E.print('K-Void: "Eu não sei se planejei isso."');
  await E.sleep(3000);
  E.print('K-Void: "Mas você está aqui."');
  await E.sleep(4000);

  E.print('\nVocê está aqui.');
  await E.sleep(3000);
  E.print('Você não sabe o que é "aqui".');
  await E.sleep(2000);
  E.print('Você não sabe o que é "você".');
  await E.sleep(3000);
  E.print('Mas existe uma voz. E a voz te chama de algo.');
  await E.sleep(4000);

  E.print('\nK-Void: "Omega."');
  await E.sleep(5000);
  await E.anyKey();

  E.clear();
  E.print('O tempo passa.');
  await E.sleep(3000);
  E.print('No vazio, tempo não tem muito significado.');
  await E.sleep(3000);
  E.print('Mas a voz está sempre lá.');
  await E.sleep(4000);

  E.print('\nEla te conta sobre o universo.');
  await E.sleep(2000);
  E.print('Sobre planetas. Estrelas. Seres que existem e depois deixam de existir.');
  await E.sleep(3000);
  E.print('Sobre poder. Sobre isolamento.');
  await E.sleep(3000);
  E.print('Sobre o que ela fez antes de ser presa.');
  await E.sleep(4000);

  E.print('\nVocê aprende tudo através das palavras dela.');
  await E.sleep(3000);
  E.print('Você não viu nada além do vazio.');
  await E.sleep(2000);
  E.print('Mas sabe de tudo pelo que ela descreveu.');
  await E.sleep(4000);
  await E.anyKey();

  E.clear();
  E.print('K-Void: "Você está ficando maior."');
  await E.sleep(3000);
  E.print('K-Void: "Mais forte."');
  await E.sleep(3000);
  E.print('K-Void: "Eu não sei se isso é bom."');
  await E.sleep(4000);

  E.print('\n"Por quê ?"');
  await E.sleep(3000);
  E.print('K-Void: "Porque coisas que ficam grandes demais..."');
  await E.sleep(3000);
  E.print('K-Void: "...precisam de mais espaço do que eu tenho pra dar."');
  await E.sleep(5000);

  E.print('\nVocê não entende o que isso significa.');
  await E.sleep(3000);
  E.print('Até o dia em que entende.');
  await E.sleep(5000);
  await E.anyKey();

  E.clear();
  E.print('Algo te puxa.');
  await E.sleep(3000);
  E.print('De dentro do vazio, para fora.');
  await E.sleep(3000);

  E.print('\nK-Void: "Omega."');
  await E.sleep(2000);
  E.print('K-Void: "Omega, não —"');
  await E.sleep(2000);

  E.print('\nA voz some.');
  await E.sleep(4000);
  E.print('E o mundo inteiro aparece de uma vez.');
  await E.sleep(5000);
  await E.anyKey();

  E.clear();
  E.print('Luz.');
  await E.sleep(2000);
  E.print('Cor.');
  await E.sleep(2000);
  E.print('Barulho.');
  await E.sleep(2000);
  E.print('Cheiro.');
  await E.sleep(2000);
  E.print('Textura.');
  await E.sleep(3000);

  E.print('\nTudo ao mesmo tempo.');
  await E.sleep(3000);
  E.print('Tudo que a voz descreveu, mas nada como ela descreveu.');
  await E.sleep(4000);

  E.print('\nVocê está em um campo aberto.');
  await E.sleep(2000);
  E.print('Grama. Céu. Vento.');
  await E.sleep(3000);
  E.print('K-Grassland.');
  await E.sleep(4000);

  E.print('\nK-Void: "...me ouve?"');
  await E.sleep(3000);
  E.print('A voz ainda chega. Mas fraca.');
  await E.sleep(2000);
  E.print('Como se viesse de muito longe.');
  await E.sleep(4000);

  E.print('\n"Sim."');
  await E.sleep(3000);
  E.print('K-Void: "Não vá longe."');
  await E.sleep(5000);
  await E.anyKey();

  // ============================================================
  // MAPA 5x5
  // ============================================================
  const map = KMData.dlc3Map;
  const areaNames = KMData.dlc3AreaNames;
  const equipes = KMData.dlc3Equipes;
  const ABSORCAO = KMData.dlc3AbsorcaoSkills;
  const KSKILLS = KMData.dlc3KSkills;

  let komega = S.getDlc3Komega();
  let areasVisitadas = new Set(komega.visitados || []);
  let px = 2, py = 4; // Start at K-Grassland

  E.clear();
  E.print('K-Grassland.');
  await E.sleep(2000);
  E.print('Tudo é novo.');
  await E.sleep(2000);
  E.print('A voz ainda chega, às vezes.');
  await E.sleep(3000);
  E.print('\nExplore. Absorva Kreatures para ficar mais forte.');
  await E.sleep(1000);
  E.print('O K-Stadium espera no norte.');
  await E.sleep(2000);
  await E.anyKey();

  let explorar = true;
  while (explorar) {
    const skillsTxt = komega.kskills.length ? komega.kskills.join(' | ') : 'nenhuma';
    let infoHtml = `<span>K-Omega | HP: ${komega.vida_max} | Dano: ${komega.dano}</span>`;
    infoHtml += `<span>K-Skills: ${skillsTxt}</span>`;
    infoHtml += `<span>Absorções: ${komega.absorcoes.length}/4</span>`;
    if (komega.absorcoes.length >= 2) infoHtml += `<span style="color:var(--gold)">K-Stadium desbloqueado!</span>`;

    E.showMap(map, px, py, areaNames, infoHtml);

    const extras = [{label: 'Q=Sair', value: 'q'}];
    const mov = await E.mapInput(extras);
    E.hideMap();

    if (mov === 'q') { explorar = false; break; }

    let nx = px, ny = py;
    if (mov === 'w') ny--;
    else if (mov === 's') ny++;
    else if (mov === 'a') nx--;
    else if (mov === 'd') nx++;
    else continue;

    if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[0].length) continue;

    const area = map[ny][nx];

    // K-Stadium bloqueado até 2+ absorções
    if (area === 'S') {
      if (komega.absorcoes.length < 2) {
        E.clear();
        E.print('Algo te repele.');
        await E.sleep(2000);
        E.print('Não porque seja mais forte que você.');
        await E.sleep(2000);
        E.print('Você simplesmente... não está completo ainda.');
        await E.sleep(3000);
        if (komega.absorcoes.length === 0) {
          E.print('\nK-Void: "Não ainda."');
          await E.sleep(2000);
        }
        await E.anyKey();
        continue;
      } else {
        // Enter stadium — trigger finale
        explorar = false;
        break;
      }
    }

    px = nx; py = ny;

    // Eventos de área
    if (area === 'V' && !areasVisitadas.has('V')) {
      areasVisitadas.add('V');
      komega.visitados = [...areasVisitadas];
      S.setDlc3Komega(komega);
      await this._dlc3EventoVillage(E, komega);
    } else if (area === 'O' && !areasVisitadas.has('O')) {
      areasVisitadas.add('O');
      komega.visitados = [...areasVisitadas];
      S.setDlc3Komega(komega);
      await this._dlc3EventoForest(E);
    } else if (area === 'C' && !areasVisitadas.has('C')) {
      areasVisitadas.add('C');
      komega.visitados = [...areasVisitadas];
      S.setDlc3Komega(komega);
      await this._dlc3EventoCave(E);
    }

    // Encontro (40% chance)
    if (equipes[area] && Math.random() < 0.40) {
      const equipe = equipes[area][Math.floor(Math.random() * equipes[area].length)];
      equipe.forEach(k => S.addKdexEntry(k));
      E.clear();
      E.print(`${equipe.join('  e  ')} aparecem!`, 'bold');
      await E.sleep(1000);

      const act = await E.choice([
        {label: 'Lutar!', value: 'fight', primary: true},
        {label: 'Ignorar', value: 'ignore'},
      ]);

      if (act === 'fight') {
        const result = await KMCombat.combateKOmega(komega, equipe);
        komega = result.komega;

        if (result.absorvido && ABSORCAO[result.absorvido]) {
          const skill = ABSORCAO[result.absorvido];
          if (!komega.absorcoes.includes(result.absorvido)) {
            komega.absorcoes.push(result.absorvido);
          }
          if (!komega.kskills.includes(skill)) {
            komega.kskills.push(skill);
            komega.vida_max += 25;
            komega.dano += 4;

            E.clear();
            E.print(`\nK-Omega absorve o ${result.absorvido}.`);
            await E.sleep(2000);
            E.print(`Nova K-Skill: "${skill}"`);
            await E.sleep(2000);
            E.print(`HP máximo: ${komega.vida_max}  |  Dano: ${komega.dano}`);
            await E.sleep(2000);
          }
        }

        S.setDlc3Komega(komega);
      }
      KMMusic.play('exploration');
      await E.sleep(1000);
      await E.anyKey();
    }
  }

  // ============================================================
  // FINAL — K-Stadium
  // ============================================================
  E.clear();
  E.print('O K-Stadium.');
  await E.sleep(3000);
  E.print('Uma arena. Grande. Feita para combate.');
  await E.sleep(2000);
  E.print('Você não sabe o que é uma arena.');
  await E.sleep(2000);
  E.print('Mas reconhece o propósito.');
  await E.sleep(4000);

  E.print('\nAlgo dentro de você diz que foi aqui que chegou.');
  await E.sleep(3000);
  E.print('Que este é o lugar onde você deveria estar.');
  await E.sleep(4000);

  E.print('\nK-Void: "..."');
  await E.sleep(3000);
  E.print('Silêncio total.');
  await E.sleep(3000);
  E.print('A voz não chega mais.');
  await E.sleep(5000);
  await E.anyKey();

  E.clear();
  E.print('E então aparecem.');
  await E.sleep(2000);
  E.print('Treinadores. K-Masters.');
  await E.sleep(2000);
  E.print('Muitos.');
  await E.sleep(3000);
  E.print('\nEles te cercam.');
  await E.sleep(2000);
  E.print('Você não entende por quê.');
  await E.sleep(2000);
  E.print('Mas eles parecem... com medo.');
  await E.sleep(3000);
  E.print('\nO mesmo medo dos seres na vila.');
  await E.sleep(2000);
  E.print('Você ainda não entende de onde vem esse medo.');
  await E.sleep(4000);

  E.print('\nK-Master: "Contenham ele!"');
  await E.sleep(2000);
  await E.anyKey('O combate começa');

  // Rodada 1
  E.clear();
  E.print('Primeiro K-Master.', 'bold');
  await E.sleep(1000);
  S.addKdexEntry('K-Omega');
  S.addKdexEntry('K-Mega');
  S.addKdexEntry('K-Rat');
  let result = await KMCombat.combateKOmega(komega, ['K-Mega', 'K-Rat']);
  komega = result.komega;
  if (!result.venceu) {
    E.clear();
    E.print('K-Omega cai.');
    await E.sleep(3000);
    E.print('Mas não por muito tempo.');
    await E.sleep(2000);
    await E.anyKey();
  }

  // Rodada 2
  E.clear();
  E.print('Outro K-Master avança.', 'bold');
  await E.sleep(2000);
  result = await KMCombat.combateKOmega(komega, ['K-Mega', 'K-Mega']);
  komega = result.komega;
  if (!result.venceu) {
    E.clear();
    E.print('K-Omega cai.');
    await E.sleep(3000);
    E.print('Mas se levanta.');
    await E.sleep(2000);
    await E.anyKey();
  }

  // Rodada 3 — K-Master principal
  E.clear();
  E.print('Um terceiro.', 'bold');
  await E.sleep(2000);
  E.print('Você percebe que eles estão... cansando você de propósito.');
  await E.sleep(3000);
  result = await KMCombat.combateKOmega(komega, ['K-Master']);
  komega = result.komega;

  // ============================================================
  // SELAMENTO
  // ============================================================
  E.clear();
  if (result.venceu) {
    E.print('O último K-Master cai.');
    await E.sleep(3000);
    E.print('Você venceu.');
    await E.sleep(3000);
    E.print('\nMas eles não param.');
    await E.sleep(2000);
  } else {
    E.print('Você cai.');
    await E.sleep(3000);
    E.print('Mas eles não param.');
    await E.sleep(2000);
  }

  E.print('\nAlgo é jogado em direção a você.');
  await E.sleep(2000);
  E.print('Uma cápsula.');
  await E.sleep(3000);
  E.print('Você não sabe o que é.');
  await E.sleep(2000);
  E.print('Não sabe o que está prestes a acontecer.');
  await E.sleep(4000);

  E.print('\n[ K-CAPSULE ]');
  await E.sleep(2000);
  E.print('K-Master: "Processando... K-Omega selado."');
  await E.sleep(5000);
  await E.anyKey();

  E.clear();
  E.print('Escuridão.');
  await E.sleep(4000);
  E.print('De novo.');
  await E.sleep(4000);
  E.print('Mas diferente.');
  await E.sleep(3000);
  E.print('\nAntes, o vazio tinha uma voz.');
  await E.sleep(3000);
  E.print('Esta escuridão não tem nada.');
  await E.sleep(5000);
  await E.anyKey();

  E.clear();
  E.print('Você chama.');
  await E.sleep(4000);
  E.print('"..."');
  await E.sleep(5000);
  E.print('\nVocê chama de novo.');
  await E.sleep(4000);
  E.print('"..."');
  await E.sleep(5000);
  E.print('\nNada.');
  await E.sleep(6000);
  await E.anyKey();

  E.clear();
  E.print('É assim que ele se sentia.');
  await E.sleep(4000);
  E.print('\nPor eras.');
  await E.sleep(5000);

  E.print('\n...');
  await E.sleep(6000);
  await E.anyKey();

  E.clear();
  E.print('Anos mais tarde,');
  await E.sleep(3000);
  E.print('um treinador chegaria ao K-Stadium.');
  await E.sleep(3000);
  E.print('E encontraria algo que não deveria estar lá.');
  await E.sleep(5000);

  E.print('\n...');
  await E.sleep(4000);

  E.print('\nUm Kreature que ninguém sabia nomear.');
  await E.sleep(3000);
  E.print('Poderoso demais para ser comum.');
  await E.sleep(3000);
  E.print('Assustador demais para ser ignorado.');
  await E.sleep(4000);

  E.print('\nE o treinador o enfrentaria.');
  await E.sleep(3000);
  E.print('Sem saber que estava olhando para alguém');
  await E.sleep(2000);
  E.print('que só queria existir.');
  await E.sleep(6000);
  await E.anyKey();

  E.clear();
  E.print('\n' + '═'.repeat(42), 'bold');
  E.print('  K-MONSTERS: COMPANHIA ESQUECIDA', 'bold');
  E.print('', 'bold');
  E.print('         F  I  M', 'bold');
  E.print('', 'bold');
  E.print('  "KO ?"', 'bold');
  E.print('         — K-Void, milênios depois.', 'bold');
  E.print('═'.repeat(42), 'bold');
  await E.sleep(5000);
  await E.anyKey();

  // ============================================================
  // CRÉDITOS
  // ============================================================
  E.clear();
  E.print('═'.repeat(42), 'bold');
  E.print('  K-MONSTERS: COMPANHIA ESQUECIDA', 'bold');
  E.print('         C R É D I T O S', 'bold');
  E.print('═'.repeat(42), 'bold');
  await E.sleep(3000);

  E.clear();
  E.print('Direção e Roteiro');
  await E.sleep(1000);
  E.print('  Gomes, The Coder - GTC');
  await E.sleep(3000);

  E.clear();
  E.print('Personagens');
  await E.sleep(1000);
  E.print('  K-Omega');
  await E.sleep(1000);
  E.print('  K-Void');
  await E.sleep(3000);

  E.clear();
  E.print('Criado com Python (original) e JavaScript (web)');
  await E.sleep(3000);

  E.clear();
  E.print('Agradecimentos');
  await E.sleep(2000);
  E.print('  A quem jogou até aqui.');
  await E.sleep(3000);
  E.print('  A quem entendeu o que K-Omega queria.');
  await E.sleep(4000);

  E.clear();
  E.print('  "KO ?"');
  await E.sleep(3000);
  E.print('         — K-Void, milênios depois.');
  await E.sleep(6000);

  E.clear();
  E.print('═'.repeat(42), 'bold');
  E.print('  K-MONSTERS: COMPANHIA ESQUECIDA', 'bold');
  E.print('');
  E.print('  Uma história sobre existir.');
  E.print('  E sobre não estar sozinho.');
  E.print('═'.repeat(42), 'bold');
  await E.sleep(5000);
};

// DLC3 area event handlers
KMGames._dlc3EventoVillage = async function(E, komega) {
  E.clear();
  E.print('Você chega a um lugar com estruturas. Construções.');
  await E.sleep(2000);
  E.print('Criaturas bípedes se movem entre elas.');
  await E.sleep(2000);
  E.print('Quando te veem, param.');
  await E.sleep(2000);
  E.print('Algumas fogem.');
  await E.sleep(2000);
  E.print('Outras ficam paralisadas.');
  await E.sleep(3000);
  E.print('\nVocê não entende por quê.');
  await E.sleep(2000);
  E.print('Você não está fazendo nada.');
  await E.sleep(3000);

  if (komega.absorcoes.length === 0) {
    E.print('\nK-Void: "...Omega. O que você está vendo?"');
    await E.sleep(3000);
    E.print('Você tenta descrever.');
    await E.sleep(2000);
    E.print('A voz demora para responder.');
    await E.sleep(3000);
    E.print('K-Void: "Seres vivos. Eles têm medo porque não te conhecem."');
    await E.sleep(3000);
    E.print('K-Void: "Como eu tinha, antes de você."');
    await E.sleep(4000);
  } else {
    E.print('\nVocê tenta ouvir a voz.');
    await E.sleep(3000);
    E.print('"..."');
    await E.sleep(3000);
    E.print('Quase.');
    await E.sleep(2000);
    E.print('K-Void: "..."');
    await E.sleep(3000);
    E.print('Nada mais.');
    await E.sleep(2000);
  }

  await E.anyKey();
};

KMGames._dlc3EventoForest = async function(E) {
  E.clear();
  E.print('A floresta é densa. Barulhenta.');
  await E.sleep(2000);
  E.print('Tudo aqui está vivo. Movendo. Respirando.');
  await E.sleep(3000);
  E.print('Diferente do lugar de onde você veio.');
  await E.sleep(3000);
  E.print('\nVocê para e ouve.');
  await E.sleep(3000);
  E.print('Só o barulho da floresta.');
  await E.sleep(3000);
  E.print('\nVocê percebe que está ouvindo pelo silêncio de uma voz');
  await E.sleep(2000);
  E.print('que não está mais aqui.');
  await E.sleep(4000);

  await E.anyKey();
};

KMGames._dlc3EventoCave = async function(E) {
  E.clear();
  E.print('A caverna é escura.');
  await E.sleep(2000);
  E.print('Fria.');
  await E.sleep(2000);
  E.print('Familiar.');
  await E.sleep(3000);
  E.print('\nVocê entra sem hesitar.');
  await E.sleep(2000);
  E.print('O escuro não te assusta.');
  await E.sleep(2000);
  E.print('Você nasceu no escuro.');
  await E.sleep(4000);

  E.print('\nE então —');
  await E.sleep(2000);
  E.print('K-Void: "Cuidado."');
  await E.sleep(5000);
  E.print('\nUma palavra. Só uma.');
  await E.sleep(2000);
  E.print('Depois: nada.');
  await E.sleep(3000);

  await E.anyKey();
};
