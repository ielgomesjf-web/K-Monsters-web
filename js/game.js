// game.js — K-Monsters: Main game dispatcher
// Creates KMGames shell. Per-game files add their methods.

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
