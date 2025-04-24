export default class ViewManager {
  #territoryRenderer;
  #playerSidebarRenderer;
  #phaseView;

  constructor(territoryRenderer, playerSidebarRenderer, phaseView) {
    this.#territoryRenderer = territoryRenderer;
    this.#playerSidebarRenderer = playerSidebarRenderer;
    this.#phaseView = phaseView;
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

  startPlayerTurn() {
    this.#phaseView.showDraftPhaseUI();
  }
}
