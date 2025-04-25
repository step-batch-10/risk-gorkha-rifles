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

  renderPlayerSidebar(players) {
    this.#playerSidebarRenderer.render(players);
  }

  renderCards(cards) {
    this.#cardsView.render(cards);
  }

  startPlayerTurn() {
    this.#phaseView.showDraftPhaseUI();
  }
}
