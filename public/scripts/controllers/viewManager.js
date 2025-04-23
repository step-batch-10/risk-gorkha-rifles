export default class ViewManager {
  #territoryRenderer;
  #playerSidebarRenderer;

  constructor(territoryRenderer, playerSidebarRenderer) {
    this.#territoryRenderer = territoryRenderer;
    this.#playerSidebarRenderer = playerSidebarRenderer;
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

  registerReinforcementClick(callback) {
    this.#phaseView.onReinforcementRequest(callback);
  }

  startPlayerTurn() {
    this.#phaseView.showDraftPhaseUI();
  }
}
