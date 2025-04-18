export default class MapModal {
  #findPlayerColor(playerId, players) {
    return players[playerId].colour;
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

  render(gameDetails) {
    const { players, territories } = gameDetails;
    this.#renderTerritories(territories, players);
  }
}