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
