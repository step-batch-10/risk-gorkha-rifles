export default class MapModal {
  #findPlayerColor(playerId, players) {
    const player = players.find(player => player.id === playerId);
    return player.colour;
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