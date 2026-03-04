// engine.js — K-Monsters: Game engine + global KM controller
// Globals: KMEngine, KM

const KMEngine = {
  _output: null,
  _input: null,
  _abortCtrl: null,

  init() {
    this._output = document.getElementById('game-output');
    this._input = document.getElementById('game-input-area');
  },

  // Check abort signal
  _checkAbort() {
    if (this._abortCtrl && this._abortCtrl.signal.aborted) {
      throw new DOMException('Game stopped', 'AbortError');
    }
  },

  // Print a line of text
  print(text, cssClass) {
    this._checkAbort();
    const div = document.createElement('div');
    div.className = 'line' + (cssClass ? ' ' + cssClass : '');
    div.textContent = text;
    this._output.appendChild(div);
    this._output.scrollTop = this._output.scrollHeight;
  },

  // Print separator
  separator() {
    this.print('─'.repeat(70), 'separator');
  },

  // Clear output
  clear() {
    this._checkAbort();
    if (this._output) this._output.innerHTML = '';
  },

  // Sleep with abort support
  sleep(ms) {
    this._checkAbort();
    return new Promise((resolve, reject) => {
      const signal = this._abortCtrl ? this._abortCtrl.signal : null;
      if (signal && signal.aborted) {
        reject(new DOMException('Game stopped', 'AbortError'));
        return;
      }
      const timer = setTimeout(resolve, ms);
      if (signal) {
        const onAbort = () => {
          clearTimeout(timer);
          reject(new DOMException('Game stopped', 'AbortError'));
        };
        signal.addEventListener('abort', onAbort, { once: true });
      }
    });
  },

  // Show buttons and return the chosen value
  choice(options) {
    // options: [{label, value, primary?}]
    this._checkAbort();
    return new Promise((resolve, reject) => {
      const signal = this._abortCtrl ? this._abortCtrl.signal : null;
      if (signal && signal.aborted) {
        reject(new DOMException('Game stopped', 'AbortError'));
        return;
      }
      this._input.classList.remove('hidden');
      this._input.innerHTML = '';
      const wrap = document.createElement('div');
      wrap.className = 'input-buttons';

      const cleanup = () => {
        this._input.innerHTML = '';
        this._input.classList.add('hidden');
        if (signal) signal.removeEventListener('abort', onAbort);
      };

      const onAbort = () => {
        cleanup();
        reject(new DOMException('Game stopped', 'AbortError'));
      };

      if (signal) signal.addEventListener('abort', onAbort, { once: true });

      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'input-btn' + (opt.primary ? ' primary' : '');
        btn.textContent = opt.label;
        btn.addEventListener('click', () => {
          cleanup();
          resolve(opt.value);
        });
        wrap.appendChild(btn);
      });

      this._input.appendChild(wrap);
      this._output.scrollTop = this._output.scrollHeight;
    });
  },

  // Show text input and return the entered text
  textInput(prompt) {
    this._checkAbort();
    return new Promise((resolve, reject) => {
      const signal = this._abortCtrl ? this._abortCtrl.signal : null;
      if (signal && signal.aborted) {
        reject(new DOMException('Game stopped', 'AbortError'));
        return;
      }
      this._input.classList.remove('hidden');
      this._input.innerHTML = '';

      if (prompt) {
        const lbl = document.createElement('div');
        lbl.textContent = prompt;
        lbl.style.marginBottom = '6px';
        lbl.style.fontSize = '.85rem';
        this._input.appendChild(lbl);
      }

      const wrap = document.createElement('div');
      wrap.className = 'input-text-wrap';
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.autocomplete = 'off';
      const btn = document.createElement('button');
      btn.textContent = 'OK';
      wrap.appendChild(inp);
      wrap.appendChild(btn);
      this._input.appendChild(wrap);
      inp.focus();

      const cleanup = () => {
        this._input.innerHTML = '';
        this._input.classList.add('hidden');
        if (signal) signal.removeEventListener('abort', onAbort);
      };

      const onAbort = () => {
        cleanup();
        reject(new DOMException('Game stopped', 'AbortError'));
      };

      if (signal) signal.addEventListener('abort', onAbort, { once: true });

      const submit = () => {
        const val = inp.value;
        cleanup();
        resolve(val);
      };

      btn.addEventListener('click', submit);
      inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') submit();
      });

      this._output.scrollTop = this._output.scrollHeight;
    });
  },

  // Show map overlay with grid
  showMap(mapData, px, py, areaNames, extraInfo) {
    this._checkAbort();
    // Remove existing map overlay
    const existing = document.querySelector('.map-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'map-overlay';

    // Legend
    const legend = document.createElement('div');
    legend.className = 'map-legend';
    const legendParts = [];
    for (const [k, v] of Object.entries(areaNames)) {
      if (k !== '.') legendParts.push(`${k}=${v}`);
    }
    legend.textContent = legendParts.join('  ');
    overlay.appendChild(legend);

    // Grid
    const grid = document.createElement('div');
    grid.className = 'map-grid';
    const cols = mapData[0].length;
    grid.style.gridTemplateColumns = `repeat(${cols}, 42px)`;

    for (let y = 0; y < mapData.length; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = document.createElement('div');
        const tile = mapData[y][x];
        if (x === px && y === py) {
          cell.className = 'map-cell player';
          cell.textContent = '@';
        } else if (tile === '.' || tile === ' ') {
          cell.className = 'map-cell empty';
        } else {
          cell.className = `map-cell ${tile}`;
          cell.textContent = tile;
        }
        grid.appendChild(cell);
      }
    }
    overlay.appendChild(grid);

    // Info
    if (extraInfo) {
      const info = document.createElement('div');
      info.className = 'map-info';
      info.innerHTML = extraInfo;
      overlay.appendChild(info);
    }

    this._output.parentElement.appendChild(overlay);
    this._output.scrollTop = this._output.scrollHeight;
  },

  // Hide map overlay
  hideMap() {
    const existing = document.querySelector('.map-overlay');
    if (existing) existing.remove();
  },

  // D-pad choice layout for map navigation
  _choiceDpad(dirOpts, extraOpts) {
    this._checkAbort();
    return new Promise((resolve, reject) => {
      const signal = this._abortCtrl ? this._abortCtrl.signal : null;
      if (signal && signal.aborted) {
        reject(new DOMException('Game stopped', 'AbortError'));
        return;
      }
      this._input.classList.remove('hidden');
      this._input.innerHTML = '';

      const wrap = document.createElement('div');
      wrap.className = 'dpad-layout';

      const cleanup = () => {
        this._input.innerHTML = '';
        this._input.classList.add('hidden');
        if (signal) signal.removeEventListener('abort', onAbort);
      };

      const onAbort = () => {
        cleanup();
        reject(new DOMException('Game stopped', 'AbortError'));
      };

      if (signal) signal.addEventListener('abort', onAbort, { once: true });

      const makeBtn = (opt) => {
        const btn = document.createElement('button');
        btn.className = 'input-btn dpad-btn';
        btn.textContent = opt.label;
        btn.addEventListener('click', () => { cleanup(); resolve(opt.value); });
        return btn;
      };

      // D-pad grid: [empty][up][empty] / [left][empty][right] / [empty][down][empty]
      const grid = document.createElement('div');
      grid.className = 'dpad-grid';
      const cells = ['', 'w', '', 'a', '', 'd', '', 's', ''];
      const dirMap = {};
      dirOpts.forEach(o => dirMap[o.value] = o);
      cells.forEach(c => {
        if (c && dirMap[c]) {
          grid.appendChild(makeBtn(dirMap[c]));
        } else {
          const empty = document.createElement('div');
          grid.appendChild(empty);
        }
      });
      wrap.appendChild(grid);

      // Extra buttons below the D-pad
      if (extraOpts && extraOpts.length) {
        const extraWrap = document.createElement('div');
        extraWrap.className = 'dpad-extras';
        extraOpts.forEach(opt => extraWrap.appendChild(makeBtn(opt)));
        wrap.appendChild(extraWrap);
      }

      this._input.appendChild(wrap);
      this._output.scrollTop = this._output.scrollHeight;
    });
  },

  // Map navigation input (D-pad + extra buttons + swipe on mobile)
  mapInput(extras) {
    // extras: [{label, value}] — additional buttons like T=Trocar, Q=Sair
    this._checkAbort();
    const dirOpts = [
      { label: '▲', value: 'w' },
      { label: '◀', value: 'a' },
      { label: '▼', value: 's' },
      { label: '▶', value: 'd' },
    ];

    // Use D-pad layout
    const dpadPromise = this._choiceDpad(dirOpts, extras || []);

    // Add swipe detection on mobile
    return new Promise((resolve, reject) => {
      const signal = this._abortCtrl ? this._abortCtrl.signal : null;
      if (signal && signal.aborted) {
        reject(new DOMException('Game stopped', 'AbortError'));
        return;
      }

      let swipeStartX = 0, swipeStartY = 0;
      let resolved = false;
      const output = this._output;

      const onTouchStart = (e) => {
        swipeStartX = e.touches[0].clientX;
        swipeStartY = e.touches[0].clientY;
      };

      const onTouchEnd = (e) => {
        if (resolved) return;
        const dx = e.changedTouches[0].clientX - swipeStartX;
        const dy = e.changedTouches[0].clientY - swipeStartY;
        const minSwipe = 40;
        let dir = null;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipe) {
          dir = dx > 0 ? 'd' : 'a';
        } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > minSwipe) {
          dir = dy > 0 ? 's' : 'w';
        }
        if (dir) {
          resolved = true;
          cleanup();
          resolve(dir);
        }
      };

      const cleanup = () => {
        output.removeEventListener('touchstart', onTouchStart);
        output.removeEventListener('touchend', onTouchEnd);
        if (signal) signal.removeEventListener('abort', onAbort);
      };

      const onAbort = () => {
        if (!resolved) {
          resolved = true;
          cleanup();
          reject(new DOMException('Game stopped', 'AbortError'));
        }
      };

      if (signal) signal.addEventListener('abort', onAbort, { once: true });
      output.addEventListener('touchstart', onTouchStart, { passive: true });
      output.addEventListener('touchend', onTouchEnd, { passive: true });

      dpadPromise.then(val => {
        if (!resolved) { resolved = true; cleanup(); resolve(val); }
      }).catch(err => {
        if (!resolved) { resolved = true; cleanup(); reject(err); }
      });
    });
  },

  // Wait for any keypress (shows "continue" button)
  anyKey(label) {
    return this.choice([{ label: label || 'Continuar...', value: 'ok', primary: true }]);
  },

  // Enter key (shows "ENTER" button)
  enterKey() {
    return this.choice([{ label: 'ENTER', value: 'ok', primary: true }]);
  },
};

// ============================================================
// Save/Load via localStorage
// ============================================================

const KMSave = {
  _prefix: 'km_',

  get(key) {
    try {
      const raw = localStorage.getItem(this._prefix + key);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  set(key, value) {
    localStorage.setItem(this._prefix + key, JSON.stringify(value));
  },

  remove(key) {
    localStorage.removeItem(this._prefix + key);
  },

  clearAll() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.startsWith(this._prefix)) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
  },

  // Base game save
  getBaseKreatures() { return this.get('kreatures') || []; },
  setBaseKreatures(v) { this.set('kreatures', v); },
  getBaseMedalhas() { return this.get('medalhas') || {}; },
  setBaseMedalhas(v) { this.set('medalhas', v); },
  getBaseEvolucao() { return this.get('evolucao') || {}; },
  setBaseEvolucao(v) { this.set('evolucao', v); },
  getBaseNomes() { return this.get('nomes') || {}; },
  setBaseNomes(v) { this.set('nomes', v); },

  // DLC1 save
  getDlc1Kreatures() { return this.get('dlc1_kreatures') || this.getBaseKreatures(); },
  setDlc1Kreatures(v) { this.set('dlc1_kreatures', v); },
  getDlc1Cristais() { return this.get('dlc1_cristais') || {}; },
  setDlc1Cristais(v) { this.set('dlc1_cristais', v); },
  getDlc1Evolucao() { return this.get('dlc1_evolucao') || {}; },
  setDlc1Evolucao(v) { this.set('dlc1_evolucao', v); },

  // DLC2 save
  getDlc2Progresso() { return this.get('dlc2_progresso') || { visitados: [], fragmentos: [] }; },
  setDlc2Progresso(v) { this.set('dlc2_progresso', v); },

  // DLC3 save
  getDlc3Komega() {
    return this.get('dlc3_komega') || {
      vida_max: 80, dano: 12,
      kskills: ['Rugido'],
      absorcoes: [],
      visitados: [],
    };
  },
  setDlc3Komega(v) { this.set('dlc3_komega', v); },

  // KM2 save
  getKm2Save() {
    return this.get('km2_save') || {
      kreatures: {},
      time: [],
      moedas: 0,
      area_exotica: false,
      competicao_fase: 0,
      visitados: [],
      historia: {},
    };
  },
  setKm2Save(v) { this.set('km2_save', v); },
};

// ============================================================
// Global KM controller
// ============================================================

const KM = {
  _currentGame: null,

  // Checa se o gameId está liberado
  _isUnlocked(gameId) {
    if (gameId === 'base') return true;
    return KMConfig.isUnlocked();
  },

  // Aplica classe .locked nos botões de DLC bloqueados
  applyLockedButtons() {
    const btns = document.querySelectorAll('.menu-btn');
    const gameIds = ['base', 'dlc1', 'dlc2', 'dlc3', 'km2', 'pack'];
    btns.forEach((btn, i) => {
      const gid = gameIds[i];
      if (!gid) return;
      if (!this._isUnlocked(gid)) {
        btn.classList.add('locked');
      } else {
        btn.classList.remove('locked');
      }
    });
  },

  // Prompt para ativar chave
  async activateKey() {
    KMEngine.init();
    KMEngine.clear();
    KMEngine.print('=== ATIVAR CHAVE ===', 'bold');
    KMEngine.print('');
    KMEngine.print('Digite sua chave de 25 dígitos:', 'info');
    const key = await KMEngine.textInput('XXXXX-XXXXX-XXXXX-XXXXX-XXXXX');
    if (await KMConfig.activate(key)) {
      KMEngine.print('');
      KMEngine.print('Chave válida! Todos os DLCs foram liberados!', 'success');
      this.applyLockedButtons();
    } else {
      KMEngine.print('');
      KMEngine.print('Chave inválida.', 'danger');
    }
  },

  async startGame(gameId) {
    // Checar permissão de DLC
    if (!this._isUnlocked(gameId)) {
      KMEngine.init();
      KMEngine.clear();
      KMEngine.print('🔒 DLC bloqueado!', 'danger');
      KMEngine.print('Este conteúdo não está liberado.', 'info');
      return;
    }

    // Stop any running game
    if (KMEngine._abortCtrl) {
      KMEngine._abortCtrl.abort();
    }

    KMEngine.init();
    KMEngine.clear();
    KMEngine._input.classList.add('hidden');
    KMEngine._input.innerHTML = '';
    KMEngine.hideMap();

    // Create new abort controller
    KMEngine._abortCtrl = new AbortController();
    this._currentGame = gameId;

    // Close mobile menu if open
    const menu = document.getElementById('game-menu');
    if (menu) menu.classList.remove('open');

    // Highlight active menu button
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    const btns = document.querySelectorAll('.menu-btn');
    const gameIndex = { base: 0, dlc1: 1, dlc2: 2, dlc3: 3, km2: 4, pack: 5 };
    if (gameIndex[gameId] !== undefined && btns[gameIndex[gameId]]) {
      btns[gameIndex[gameId]].classList.add('active');
    }

    try {
      switch (gameId) {
        case 'base': await KMGames.base(); break;
        case 'dlc1':  await KMGames.dlc1(); break;
        case 'dlc2':  await KMGames.dlc2(); break;
        case 'dlc3':  await KMGames.dlc3(); break;
        case 'km2':   await KMGames.km2(); break;
        case 'pack':  await KMGames.pacoteCompleto(); break;
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error(e);
        KMEngine.print(`\n[ERRO: ${e.message}]`, 'danger');
      }
    }
  },

  resetSave() {
    if (confirm('Tem certeza? Todo o progresso será apagado!')) {
      KMSave.clearAll();
      KMEngine.init();
      KMEngine.clear();
      KMEngine.print('Save resetado!', 'success');
    }
  },
};

// Aplicar .locked nos botões ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
  await KMConfig.checkSaved();
  KM.applyLockedButtons();
});
