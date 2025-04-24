export default class MapView {
  #findPlayerColor(playerId, players) {
    const player = players.find(player => player.id === playerId);
    return player.colour;
  }

  updateTerritory({ territory, troopsCount }) {
    const domTrr = document.getElementById(territory);
    const troopsCountDOM = domTrr.querySelector('tspan');
    const existingTroops = parseInt(troopsCountDOM.textContent);

    troopsCountDOM.textContent = existingTroops + troopsCount;
  }

  #renderTerritories(territories, players) {
    Object.keys(territories).forEach((territory) => {
      const domTrr = document.getElementById(territory);
      const troopsCount = domTrr.querySelector('tspan');
      troopsCount.textContent = territories[territory].troops;

      const owner = territories[territory].owner;
      troopsCount.style.fill = this.#findPlayerColor(owner, players);
    });
  }

  render(territories, players) {
    this.#renderTerritories(territories, players);
  }
}