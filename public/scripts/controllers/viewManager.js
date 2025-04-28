export default class ViewManager {
  #territoryRenderer;
  #playerSidebarRenderer;
  #phaseView;
  #cardsView;

  constructor(territoryRenderer, playerSidebarRenderer, phaseView, cardsView) {
    this.#territoryRenderer = territoryRenderer;
    this.#playerSidebarRenderer = playerSidebarRenderer;
    this.#phaseView = phaseView;
    this.#cardsView = cardsView;
    this.#registerKeyboardEvents();
  }

  #registerKeyboardEvents() {
    const helpModal = document.getElementById('help-modal');

    globalThis.document.addEventListener('keydown', (e) => {
      if (e.key === 'i' || e.key === 'I' || e.key === '?') {
        helpModal.classList.add('help-modal-opened');
      }
    });

    globalThis.document.addEventListener('keyup', (e) => {
      if (e.key === 'i' || e.key === 'I' || e.key === '?') {
        helpModal.classList.remove('help-modal-opened');
      }
    });
  }

  highlightTerritory(territoryId) {
    this.#territoryRenderer.highlightTerritory(territoryId);
  }

  handleAttackView(territories) {
    this.#territoryRenderer.handleAttackPhase(territories);
  }

  unhighlightTerritory(territoryId) {
    this.#territoryRenderer.highlightTerritory(territoryId);
  }

  updateTerritoryDetails(territoryDetails) {
    this.#territoryRenderer.updateTerritory(territoryDetails);
  }

  renderAllTerritories(territories, players) {
    this.#territoryRenderer.render(territories, players);
  }

  renderPlayerSidebar(players, currentPlayer) {
    this.#playerSidebarRenderer.render(players, currentPlayer);
  }

  renderCards(cards) {
    this.#cardsView.render(cards);
  }

  startPlayerTurn() {
    this.#phaseView.showDraftPhaseUI();
  }

  showFortificationPhase(actionData) {
    this.#phaseView.showFortificationPhase();
    this.#territoryRenderer.startFortificationPhase(
      actionData.activeTerritories
    );
  }
}
