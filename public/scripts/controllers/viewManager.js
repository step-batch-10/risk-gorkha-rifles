export default class ViewManager {
  #territoryRenderer;
  #playerSidebarRenderer;
  #phaseView;

  constructor(territoryRenderer, playerSidebarRenderer, phaseView) {
    this.#territoryRenderer = territoryRenderer;
    this.#playerSidebarRenderer = playerSidebarRenderer;
    this.#phaseView = phaseView;
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