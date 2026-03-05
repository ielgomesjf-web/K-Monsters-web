// game.js — K-Monsters: Main game dispatcher
// Creates KMGames shell. Per-game files add their methods.

// ============================================================
// Profile overlay
// ============================================================
const KMProfile = {
  show(username) {
    if (!username) username = KMSave.getUser();
    if (!username) return;

    // Remove existing overlay
    this.close();

    const overlay = document.createElement('div');
    overlay.className = 'km-overlay';
    overlay.id = 'km-profile-overlay';

    // Header
    const header = document.createElement('div');
    header.className = 'km-overlay-header';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'km-overlay-close';
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', () => this.close());
    header.appendChild(closeBtn);

    const headerTitle = document.createElement('span');
    headerTitle.textContent = 'PERFIL';
    header.appendChild(headerTitle);
    overlay.appendChild(header);

    // Profile info
    const info = document.createElement('div');
    info.className = 'profile-info';

    const avatar = KMSave.getUserAvatar(username) || '👾';
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'profile-avatar';
    avatarDiv.textContent = avatar;
    info.appendChild(avatarDiv);

    const nameDiv = document.createElement('div');
    nameDiv.className = 'profile-name';
    nameDiv.textContent = username;
    info.appendChild(nameDiv);

    const badge = kmCreditBadge(username);
    if (badge) {
      const badgeDiv = document.createElement('div');
      badgeDiv.className = 'credit-badge credit-badge-lg';
      badgeDiv.textContent = '👑 (' + badge + ')';
      badgeDiv.title = 'Nos créditos do jogo!';
      info.appendChild(badgeDiv);
    }

    const created = KMSave.getUserCreated(username);
    if (created) {
      const dateDiv = document.createElement('div');
      dateDiv.className = 'profile-date';
      dateDiv.textContent = 'Desde ' + new Date(created).toLocaleDateString('pt-BR');
      info.appendChild(dateDiv);
    }
    overlay.appendChild(info);

    // Save/restore prefix to read this user's data
    const origPrefix = KMSave._prefix;
    KMSave._prefix = 'km_' + username + '_';

    const content = document.createElement('div');
    content.className = 'profile-content';

    // K-Monsters (base)
    const baseKreatures = KMSave.getBaseKreatures();
    const baseMedalhas = KMSave.getBaseMedalhas();
    const baseEnding = KMSave.get('base_ending');
    content.appendChild(this._statBlock('K-Monsters', [
      'Kreatures: ' + (baseKreatures.length > 0 ? baseKreatures.join(', ') : 'Nenhum'),
      'Medalhas: ' + Object.values(baseMedalhas).reduce((a,b)=>a+b, 0),
      'Final: ' + (baseEnding ? this._endingLabel(baseEnding) : 'Não concluído'),
    ]));

    // A Far Planet (DLC1) — only show if has DLC1 data
    const dlc1Raw = KMSave.get('dlc1_kreatures');
    if (dlc1Raw !== null) {
      const dlc1Kreatures = Array.isArray(dlc1Raw) ? dlc1Raw : [];
      const dlc1Cristais = KMSave.getDlc1Cristais();
      const totalCristais = Object.values(dlc1Cristais).reduce((a,b)=>a+b, 0);
      content.appendChild(this._statBlock('A Far Planet', [
        'Kreatures: ' + (dlc1Kreatures.length > 0 ? dlc1Kreatures.join(', ') : 'Nenhum'),
        'Cristais: ' + totalCristais,
      ]));
    }

    // Ecos do Vazio (DLC2)
    const dlc2 = KMSave.getDlc2Progresso();
    if (dlc2.fragmentos.length > 0 || dlc2.visitados.length > 0) {
      content.appendChild(this._statBlock('Ecos do Vazio', [
        'Fragmentos: ' + dlc2.fragmentos.length + '/3',
        'Áreas visitadas: ' + dlc2.visitados.length,
      ]));
    }

    // Companhia Esquecida (DLC3)
    const dlc3Raw = KMSave.get('dlc3_komega');
    if (dlc3Raw !== null) {
      const dlc3 = KMSave.getDlc3Komega();
      content.appendChild(this._statBlock('Companhia Esquecida', [
        'K-Skills: ' + dlc3.kskills.join(', '),
        'Áreas visitadas: ' + dlc3.visitados.length,
      ]));
    }

    // K-Monsters 2
    const km2Raw = KMSave.get('km2_save');
    if (km2Raw !== null) {
      const km2 = KMSave.getKm2Save();
      const km2Kreatures = Object.keys(km2.kreatures);
      content.appendChild(this._statBlock('K-Monsters 2', [
        'Kreatures: ' + (km2Kreatures.length > 0 ? km2Kreatures.join(', ') : 'Nenhum'),
        'Moedas: ' + km2.moedas,
        'Competição: Fase ' + km2.competicao_fase,
      ]));
    }

    overlay.appendChild(content);

    // Conquistas section
    const conquistas = KMSave.getConquistas();
    const allConq = KMData.conquistas;
    const conquistaBlock = document.createElement('div');
    conquistaBlock.className = 'stat-block';
    const cTitle = document.createElement('div');
    cTitle.className = 'stat-title';
    cTitle.textContent = `CONQUISTAS (${conquistas.length}/${Object.keys(allConq).length})`;
    conquistaBlock.appendChild(cTitle);

    const cGrid = document.createElement('div');
    cGrid.className = 'conquistas-grid';
    for (const [id, def] of Object.entries(allConq)) {
      const card = document.createElement('div');
      const unlocked = conquistas.includes(id);
      card.className = 'conquista-card' + (unlocked ? '' : ' locked-conq');
      const iconEl = document.createElement('div');
      iconEl.className = 'conquista-icon-sm';
      iconEl.textContent = unlocked ? def.icone : '🔒';
      card.appendChild(iconEl);
      const infoEl = document.createElement('div');
      infoEl.className = 'conquista-info';
      const nomeEl = document.createElement('div');
      nomeEl.className = 'conquista-nome';
      nomeEl.textContent = unlocked ? def.nome : '???';
      infoEl.appendChild(nomeEl);
      const descEl = document.createElement('div');
      descEl.className = 'conquista-desc-sm';
      descEl.textContent = unlocked ? def.desc : 'Conquista bloqueada';
      infoEl.appendChild(descEl);
      card.appendChild(infoEl);
      cGrid.appendChild(card);
    }
    conquistaBlock.appendChild(cGrid);
    overlay.appendChild(conquistaBlock);

    // Summary
    const totalK = baseKreatures.length +
      (dlc1Raw ? (Array.isArray(dlc1Raw) ? dlc1Raw.length : 0) : 0) +
      (km2Raw ? Object.keys(KMSave.getKm2Save().kreatures).length : 0);
    const totalMed = Object.values(baseMedalhas).reduce((a,b)=>a+b, 0);

    const summary = document.createElement('div');
    summary.className = 'stat-block';
    summary.innerHTML = '<div class="stat-title">RESUMO TOTAL</div>' +
      '<div class="stat-line">Total Kreatures: ' + totalK + '</div>' +
      '<div class="stat-line">Total Medalhas: ' + totalMed + '</div>';
    overlay.appendChild(summary);

    // Restore prefix
    KMSave._prefix = origPrefix;

    document.body.appendChild(overlay);
  },

  _statBlock(title, lines) {
    const block = document.createElement('div');
    block.className = 'stat-block';
    const t = document.createElement('div');
    t.className = 'stat-title';
    t.textContent = title;
    block.appendChild(t);
    lines.forEach(l => {
      const line = document.createElement('div');
      line.className = 'stat-line';
      line.textContent = l;
      block.appendChild(line);
    });
    return block;
  },

  _endingLabel(type) {
    const labels = { secreto: 'Secreto (K-Omega)', alternativo: 'Alternativo (Lendário)', normal: 'Normal (K-Master)' };
    return labels[type] || type;
  },

  close() {
    const el = document.getElementById('km-profile-overlay');
    if (el) el.remove();
  },
};

// ============================================================
// Hall of Players
// ============================================================
const KMHall = {
  show() {
    this.close();

    const overlay = document.createElement('div');
    overlay.className = 'km-overlay';
    overlay.id = 'km-hall-overlay';

    // Header
    const header = document.createElement('div');
    header.className = 'km-overlay-header';
    const closeBtn = document.createElement('button');
    closeBtn.className = 'km-overlay-close';
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', () => this.close());
    header.appendChild(closeBtn);
    const headerTitle = document.createElement('span');
    headerTitle.textContent = 'JOGADORES';
    header.appendChild(headerTitle);
    overlay.appendChild(header);

    const users = KMSave.listUsers();
    const origPrefix = KMSave._prefix;

    if (users.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'stat-line';
      empty.textContent = 'Nenhum jogador cadastrado.';
      overlay.appendChild(empty);
    } else {
      users.forEach(u => {
        KMSave._prefix = 'km_' + u + '_';

        const card = document.createElement('div');
        card.className = 'hall-card';
        card.addEventListener('click', () => { this.close(); KMProfile.show(u); });

        const avatar = KMSave.getUserAvatar(u) || '👾';
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'hall-avatar';
        avatarDiv.textContent = avatar;
        card.appendChild(avatarDiv);

        const infoDiv = document.createElement('div');
        infoDiv.style.flex = '1';

        const nameDiv = document.createElement('div');
        nameDiv.className = 'hall-name';
        const hallBadge = kmCreditBadge(u);
        nameDiv.textContent = u + (hallBadge ? ' 👑 (' + hallBadge + ')' : '');
        infoDiv.appendChild(nameDiv);

        const lastLogin = KMSave.getUserLastLogin(u);
        if (lastLogin) {
          const detailDiv = document.createElement('div');
          detailDiv.className = 'hall-detail';
          detailDiv.textContent = 'Último login: ' + new Date(lastLogin).toLocaleDateString('pt-BR');
          infoDiv.appendChild(detailDiv);
        }

        // Total kreatures across games
        const baseK = KMSave.getBaseKreatures().length;
        const km2Raw = KMSave.get('km2_save');
        const km2K = km2Raw ? Object.keys(KMSave.getKm2Save().kreatures).length : 0;
        const dlc1Raw = KMSave.get('dlc1_kreatures');
        const dlc1K = dlc1Raw && Array.isArray(dlc1Raw) ? dlc1Raw.length : 0;
        const totalK = baseK + km2K + dlc1K;

        const kreatDiv = document.createElement('div');
        kreatDiv.className = 'hall-detail';
        kreatDiv.textContent = 'Kreatures: ' + totalK;
        infoDiv.appendChild(kreatDiv);

        card.appendChild(infoDiv);
        overlay.appendChild(card);
      });
    }

    KMSave._prefix = origPrefix;
    document.body.appendChild(overlay);
  },

  close() {
    const el = document.getElementById('km-hall-overlay');
    if (el) el.remove();
  },
};

// ============================================================
// K-Dex (Encyclopedia)
// ============================================================
const KMKdex = {
  show() {
    this.close();
    const overlay = document.createElement('div');
    overlay.className = 'km-overlay';
    overlay.id = 'km-kdex-overlay';

    const header = document.createElement('div');
    header.className = 'km-overlay-header';
    const closeBtn = document.createElement('button');
    closeBtn.className = 'km-overlay-close';
    closeBtn.textContent = '\u2715';
    closeBtn.addEventListener('click', () => this.close());
    header.appendChild(closeBtn);
    const title = document.createElement('span');
    title.textContent = 'K-DEX';
    header.appendChild(title);
    overlay.appendChild(header);

    const discovered = KMSave.getKdex();
    const allEntries = KMData.kdexEntries;
    const allNames = Object.keys(allEntries);

    const counter = document.createElement('div');
    counter.className = 'kdex-counter';
    counter.textContent = `Descobertos: ${discovered.length} / ${allNames.length}`;
    overlay.appendChild(counter);

    const grid = document.createElement('div');
    grid.className = 'kdex-grid';

    for (const nome of allNames) {
      const card = document.createElement('div');
      const found = discovered.includes(nome);
      card.className = 'kdex-card' + (found ? '' : ' locked');

      if (found) {
        const entry = allEntries[nome];
        const tipo = KMData.getTipoKreature(nome);
        const stats = KMData.baseStats[nome] || KMData.dlc1Stats[nome] || KMData.km2Stats[nome] || {};

        const nameDiv = document.createElement('div');
        nameDiv.className = 'kdex-name';
        nameDiv.textContent = nome;
        card.appendChild(nameDiv);

        const badge = document.createElement('span');
        badge.className = 'type-badge type-' + tipo;
        badge.textContent = tipo;
        card.appendChild(badge);

        if (stats.vida) {
          const statDiv = document.createElement('div');
          statDiv.className = 'kdex-stats';
          statDiv.textContent = `HP: ${stats.vida} | DMG: ${stats.dano}`;
          card.appendChild(statDiv);
        }

        if (stats.kskill) {
          const skillDiv = document.createElement('div');
          skillDiv.className = 'kdex-skill';
          skillDiv.textContent = `K-Skill: ${stats.kskill}`;
          card.appendChild(skillDiv);
        }

        const infoDiv = document.createElement('div');
        infoDiv.className = 'kdex-stats';
        let infoText = entry.regiao;
        if (entry.evolui_para) infoText += ` | Evolui: ${entry.evolui_para}`;
        if (entry.evolui_de) infoText += ` | De: ${entry.evolui_de}`;
        infoDiv.textContent = infoText;
        card.appendChild(infoDiv);
      } else {
        const nameDiv = document.createElement('div');
        nameDiv.className = 'kdex-name';
        nameDiv.textContent = '???';
        card.appendChild(nameDiv);
        const descDiv = document.createElement('div');
        descDiv.className = 'kdex-stats';
        descDiv.textContent = 'Kreature desconhecido';
        card.appendChild(descDiv);
      }

      grid.appendChild(card);
    }

    overlay.appendChild(grid);
    document.body.appendChild(overlay);
  },

  close() {
    const el = document.getElementById('km-kdex-overlay');
    if (el) el.remove();
  },
};

// ============================================================
// Conquistas (Achievements)
// ============================================================
const KMConquista = {
  desbloquear(id) {
    const def = KMData.conquistas[id];
    if (!def) return;
    const list = KMSave.getConquistas();
    if (list.includes(id)) return;
    list.push(id);
    KMSave.setConquistas(list);
    this._showToast(def);
  },

  _showToast(def) {
    const toast = document.createElement('div');
    toast.className = 'conquista-toast';

    const icon = document.createElement('div');
    icon.className = 'conquista-icon';
    icon.textContent = def.icone;
    toast.appendChild(icon);

    const text = document.createElement('div');
    text.className = 'conquista-text';
    const title = document.createElement('div');
    title.className = 'conquista-title';
    title.textContent = def.nome;
    text.appendChild(title);
    const desc = document.createElement('div');
    desc.className = 'conquista-desc';
    desc.textContent = def.desc;
    text.appendChild(desc);
    toast.appendChild(text);

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'opacity .4s, transform .4s';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(120%)';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  },
};

// ============================================================
// 8-bit Music (Web Audio API)
// ============================================================
const KMMusic = {
  _ctx: null,
  _nodes: [],
  _current: null,
  _muted: false,
  _interval: null,

  _init() {
    if (this._ctx) return;
    this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    this._muted = localStorage.getItem('km_music_muted') === '1';
  },

  _noteFreq(note) {
    const notes = {C:261.63,D:293.66,E:329.63,G:392.00,A:440.00,C2:523.25,D2:587.33,E2:659.25,G2:783.99,A2:880.00};
    return notes[note] || 261.63;
  },

  play(trackName) {
    this._init();
    if (this._current === trackName) return;
    this.stop();
    this._current = trackName;
    if (this._muted) return;

    const tracks = {
      exploration: {bpm:120, wave:'triangle', melody:['C','E','G','A','G','E','D','C','E','G','A','G','E','D','C','G'], bass:['C','C','G','G','A','A','E','E']},
      combat:      {bpm:160, wave:'square',   melody:['E','G','A','G','E','D','E','G','A','C2','A','G','E','D','C','E'], bass:['C','E','C','E','A','G','A','G']},
      boss:        {bpm:140, wave:'sawtooth', melody:['A','C2','E2','C2','A','G','E','D','A','C2','E2','G2','E2','C2','A','E'], bass:['A','A','E','E','D','D','G','G']},
    };

    const t = tracks[trackName];
    if (!t) return;

    const ctx = this._ctx;
    const gain = ctx.createGain();
    gain.gain.value = 0.08;
    gain.connect(ctx.destination);

    const bassGain = ctx.createGain();
    bassGain.gain.value = 0.05;
    bassGain.connect(ctx.destination);

    let step = 0;
    const beatTime = 60 / t.bpm;

    this._interval = setInterval(() => {
      if (this._muted) return;
      const now = ctx.currentTime;

      // Melody
      const osc = ctx.createOscillator();
      osc.type = t.wave;
      osc.frequency.value = this._noteFreq(t.melody[step % t.melody.length]);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + beatTime * 0.8);

      // Bass
      const bassOsc = ctx.createOscillator();
      bassOsc.type = 'square';
      bassOsc.frequency.value = this._noteFreq(t.bass[step % t.bass.length]) / 2;
      bassOsc.connect(bassGain);
      bassOsc.start(now);
      bassOsc.stop(now + beatTime * 0.9);

      step++;
    }, beatTime * 1000);
  },

  stop() {
    if (this._interval) { clearInterval(this._interval); this._interval = null; }
    this._current = null;
  },

  toggleMute() {
    this._init();
    this._muted = !this._muted;
    localStorage.setItem('km_music_muted', this._muted ? '1' : '0');
    const btn = document.getElementById('music-toggle-btn');
    if (btn) btn.textContent = this._muted ? '\uD83D\uDD07' : '\uD83D\uDD0A';
    if (this._muted) {
      this.stop();
    } else if (this._current) {
      const track = this._current;
      this._current = null;
      this.play(track);
    }
  },

  updateBtn() {
    const btn = document.getElementById('music-toggle-btn');
    if (btn) btn.textContent = this._muted ? '\uD83D\uDD07' : '\uD83D\uDD0A';
  },
};

// ============================================================
// PvP Local (2 players)
// ============================================================
const KMPvP = {
  async start() {
    const E = KMEngine;
    const users = KMSave.listUsers();

    if (users.length < 2) {
      E.clear();
      E.print('PvP Local precisa de pelo menos 2 jogadores cadastrados!', 'danger');
      await E.sleep(2000);
      await E.anyKey();
      return;
    }

    E.clear();
    E.print('═══ PvP LOCAL ═══', 'bold');
    E.print('\nSelecione os 2 jogadores:\n');

    // Player 1
    const p1Options = users.map((u, i) => ({label: u, value: String(i)}));
    E.print('Jogador 1:');
    const p1idx = await E.choice(p1Options);
    const p1name = users[parseInt(p1idx)];

    // Player 2
    const p2Options = users.filter(u => u !== p1name).map((u, i) => ({label: u, value: u}));
    E.print('\nJogador 2:');
    const p2pick = await E.choice(p2Options);
    const p2name = p2pick;

    // Get kreatures for each player
    const p1k = this._getAvailableKreatures(p1name);
    const p2k = this._getAvailableKreatures(p2name);

    if (p1k.length === 0 || p2k.length === 0) {
      E.clear();
      E.print('Ambos os jogadores precisam ter Kreatures!', 'danger');
      await E.sleep(2000);
      await E.anyKey();
      return;
    }

    // Select teams
    E.clear();
    E.print(`═══ ${p1name}: Escolha seu time (max 3) ═══`, 'bold');
    const p1team = await this._selectTeam(E, p1k);

    E.clear();
    E.print(`═══ ${p2name}: Escolha seu time (max 3) ═══`, 'bold');
    const p2team = await this._selectTeam(E, p2k);

    // Combat
    await this._pvpCombat(E, p1name, p1team, p2name, p2team);
  },

  _getAvailableKreatures(username) {
    const origPrefix = KMSave._prefix;
    KMSave._prefix = 'km_' + username + '_';

    const kreatures = new Set();
    // Base
    const baseK = KMSave.getBaseKreatures();
    baseK.forEach(k => kreatures.add(k));
    // DLC1
    const dlc1K = KMSave.get('dlc1_kreatures');
    if (Array.isArray(dlc1K)) dlc1K.forEach(k => kreatures.add(k));
    // KM2
    const km2Raw = KMSave.get('km2_save');
    if (km2Raw) {
      const km2 = typeof km2Raw === 'string' ? JSON.parse(km2Raw) : km2Raw;
      if (km2.kreatures) Object.keys(km2.kreatures).forEach(k => kreatures.add(k));
    }

    KMSave._prefix = origPrefix;
    return [...kreatures];
  },

  async _selectTeam(E, available) {
    const team = [];
    for (let slot = 0; slot < 3 && slot < available.length; slot++) {
      const opts = available
        .filter(k => !team.includes(k))
        .map(k => {
          const tipo = KMData.getTipoKreature(k);
          const stats = KMData.baseStats[k] || KMData.dlc1Stats[k] || KMData.km2Stats[k] || {};
          return {label: `${k} [${tipo}] HP:${stats.vida||'?'} DMG:${stats.dano||'?'}`, value: k};
        });
      opts.push({label: 'Pronto', value: '_done'});

      E.print(`\nSlot ${slot + 1}/3 (time: ${team.join(', ') || 'vazio'})`);
      const pick = await E.choice(opts);
      if (pick === '_done') break;
      team.push(pick);
    }
    return team.length > 0 ? team : [available[0]];
  },

  async _pvpCombat(E, p1name, p1team, p2name, p2team) {
    // Build HP/stats arrays (BASE stats only, no boost)
    const makeState = (team) => team.map(k => {
      const stats = KMData.baseStats[k] || KMData.dlc1Stats[k] || KMData.km2Stats[k] || {vida:100, dano:15};
      return {nome: k, hp: stats.vida, hpMax: stats.vida, dano: stats.dano, kskillUsed: false, kskill: stats.kskill || null, defending: false};
    });

    let s1 = makeState(p1team);
    let s2 = makeState(p2team);
    let idx1 = 0, idx2 = 0;

    E.clear();
    E.print('═══ PvP BATTLE ═══', 'bold');
    E.print(`${p1name}: ${p1team.join(', ')}`);
    E.print(`${p2name}: ${p2team.join(', ')}`);
    await E.sleep(2000);
    await E.anyKey('Começar!');

    while (idx1 < s1.length && idx2 < s2.length) {
      const k1 = s1[idx1], k2 = s2[idx2];
      const tipo1 = KMData.getTipoKreature(k1.nome);
      const tipo2 = KMData.getTipoKreature(k2.nome);

      // P1 turn
      E.clear();
      E.print(`--- Turno de ${p1name} ---`, 'bold');
      E.print(`${k1.nome} [${tipo1}] HP: ${k1.hp}/${k1.hpMax}`);
      E.print(`vs ${k2.nome} [${tipo2}] HP: ${k2.hp}/${k2.hpMax}\n`);

      const p1acts = [{label:'Atacar', value:'atk'}, {label:'Defender', value:'def'}];
      if (k1.kskill && !k1.kskillUsed) p1acts.push({label:`K-Skill: ${k1.kskill}`, value:'kskill'});
      if (s1.filter((k,i) => i > idx1 && k.hp > 0).length > 0) p1acts.push({label:'Trocar', value:'swap'});
      const a1 = await E.choice(p1acts);

      // P2 turn (clear screen for privacy)
      E.clear();
      E.print(`--- Turno de ${p2name} ---`, 'bold');
      E.print(`${k2.nome} [${tipo2}] HP: ${k2.hp}/${k2.hpMax}`);
      E.print(`vs ${k1.nome} [${tipo1}] HP: ${k1.hp}/${k1.hpMax}\n`);

      const p2acts = [{label:'Atacar', value:'atk'}, {label:'Defender', value:'def'}];
      if (k2.kskill && !k2.kskillUsed) p2acts.push({label:`K-Skill: ${k2.kskill}`, value:'kskill'});
      if (s2.filter((k,i) => i > idx2 && k.hp > 0).length > 0) p2acts.push({label:'Trocar', value:'swap'});
      const a2 = await E.choice(p2acts);

      // Resolve simultaneously
      E.clear();
      k1.defending = (a1 === 'def');
      k2.defending = (a2 === 'def');

      // P1 action
      if (a1 === 'atk' || a1 === 'kskill') {
        let d = k1.dano + (a1 === 'kskill' ? Math.floor(k1.dano * 0.5) : 0);
        if (a1 === 'kskill') k1.kskillUsed = true;
        const mult = KMData.getEfetividade(tipo1, tipo2);
        d = Math.floor(d * mult);
        if (k2.defending) d = Math.floor(d * 0.5);
        k2.hp -= d;
        E.print(`${k1.nome} ataca ${k2.nome}: -${d} HP`);
        if (mult > 1) E.print('Super eficaz!', 'super-effective');
        else if (mult < 1) E.print('Pouco eficaz...', 'not-effective');
      } else if (a1 === 'swap') {
        const next = s1.findIndex((k, i) => i > idx1 && k.hp > 0);
        if (next >= 0) { const tmp = s1[idx1]; s1[idx1] = s1[next]; s1[next] = tmp; }
        E.print(`${p1name} trocou para ${s1[idx1].nome}!`);
      } else {
        E.print(`${k1.nome} defende!`);
      }

      // P2 action
      if (a2 === 'atk' || a2 === 'kskill') {
        let d = k2.dano + (a2 === 'kskill' ? Math.floor(k2.dano * 0.5) : 0);
        if (a2 === 'kskill') k2.kskillUsed = true;
        const mult = KMData.getEfetividade(tipo2, tipo1);
        d = Math.floor(d * mult);
        if (k1.defending) d = Math.floor(d * 0.5);
        k1.hp -= d;
        E.print(`${k2.nome} ataca ${k1.nome}: -${d} HP`);
        if (mult > 1) E.print('Super eficaz!', 'super-effective');
        else if (mult < 1) E.print('Pouco eficaz...', 'not-effective');
      } else if (a2 === 'swap') {
        const next = s2.findIndex((k, i) => i > idx2 && k.hp > 0);
        if (next >= 0) { const tmp = s2[idx2]; s2[idx2] = s2[next]; s2[next] = tmp; }
        E.print(`${p2name} trocou para ${s2[idx2].nome}!`);
      } else {
        E.print(`${k2.nome} defende!`);
      }

      // Check KOs
      if (s1[idx1].hp <= 0) {
        s1[idx1].hp = 0;
        E.print(`\n${s1[idx1].nome} de ${p1name} foi derrotado!`, 'danger');
        idx1++;
        while (idx1 < s1.length && s1[idx1].hp <= 0) idx1++;
      }
      if (s2[idx2].hp <= 0) {
        s2[idx2].hp = 0;
        E.print(`\n${s2[idx2].nome} de ${p2name} foi derrotado!`, 'danger');
        idx2++;
        while (idx2 < s2.length && s2[idx2].hp <= 0) idx2++;
      }

      await E.sleep(1500);
      await E.anyKey();
    }

    // Result
    E.clear();
    if (idx1 >= s1.length && idx2 >= s2.length) {
      E.print('EMPATE!', 'bold');
    } else if (idx2 >= s2.length) {
      E.print(`${p1name} VENCEU!`, 'bold');
    } else {
      E.print(`${p2name} VENCEU!`, 'bold');
    }
    KMConquista.desbloquear('pvp_primeira');
    await E.sleep(3000);
    await E.anyKey();
  },
};

// ============================================================
// Game dispatcher
// ============================================================
const KMGames = {

  // Pacote Completo — plays all 5 games in sequence
  async pacoteCompleto() {
    const E = KMEngine;
    E.clear();
    E.print('═'.repeat(50), 'bold');
    E.print('  PACOTE COMPLETO — K-MONSTERS', 'bold');
    E.print('═'.repeat(50), 'bold');
    E.print('\nTodos os 5 jogos serão jogados em sequência.');
    E.print('Seu progresso é salvo entre cada jogo.');
    await E.anyKey('Começar');

    await this.base();
    await E.sleep(2000);
    E.clear();
    E.print('\n[ Próximo: DLC — A Far Planet ]', 'info');
    await E.anyKey();

    await this.dlc1();
    await E.sleep(2000);
    E.clear();
    E.print('\n[ Próximo: DLC — Ecos do Vazio ]', 'info');
    await E.anyKey();

    await this.dlc2();
    await E.sleep(2000);
    E.clear();
    E.print('\n[ Próximo: DLC — Companhia Esquecida ]', 'info');
    await E.anyKey();

    await this.dlc3();
    await E.sleep(2000);
    E.clear();
    E.print('\n[ Próximo: K-Monsters 2 — De Volta ao Lar ]', 'info');
    await E.anyKey();

    await this.km2();

    E.clear();
    E.print('═'.repeat(50), 'bold');
    E.print('  PACOTE COMPLETO — FINALIZADO', 'bold');
    E.print('═'.repeat(50), 'bold');
    E.print('\nObrigado por jogar todos os jogos!');
  },

};
