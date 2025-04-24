export default class MapView {
  #attackPhaseDetails = {
    attackingTerritory: "",
    defendingTerritory: "",
    troopsCount: ""
  };
  #eventBus;
  #listeners = {};

  constructor(eventBus) {
    this.#eventBus = eventBus;
  }

  #showToast(message) {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "left",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #303824, #874637)",
      },
    }).showToast();
  }

  #findPlayerColor(playerId, players) {
    const player = players.find(player => player.id === playerId);
    return player?.colour || "#000";
  }

  #toggleTerritoryHighlight(territoryId, highlight = true) {
    const territory = document.getElementById(territoryId);
    const path = territory.querySelector("path");
    path.classList.toggle("highlight-territory", highlight);
  }

  #removeClickListeners(territories) {
    territories.forEach(territoryId => {
      const territory = document.getElementById(territoryId);
      this.#toggleTerritoryHighlight(territoryId, false);
      territory.removeEventListener('click', this.#listeners[territoryId]);
      delete this.#listeners[territoryId];
    });
  }

  #handleTerritoryClick(territoryId, callback, relatedTerritories = []) {
    return () => {
      callback(territoryId);
      this.#removeClickListeners(relatedTerritories);
      this.#toggleTerritoryHighlight(territoryId, true);
    };
  }

  #handleDefendTerritoryClick(territoryId) {
    this.#attackPhaseDetails.attackingTerritory = territoryId;
    this.#showToast("Select the number of troops to attack with");
    setTimeout(() => {
      const troopsCount = prompt("Troops count");
    }, 2000);
  }

  async #selectDefendingTerritory(attackingTerritoryId) {
    this.#showToast('Selecting defending territory');
    const [response] = this.#eventBus.emit('getDefendingTerritories', attackingTerritoryId);
    const defendingTerritories = await response;

    defendingTerritories.forEach(territoryId => {
      const territory = document.getElementById(territoryId);
      this.#toggleTerritoryHighlight(territoryId, true);
      const listener = this.#handleTerritoryClick(
        territoryId,
        () => this.#handleDefendTerritoryClick(territoryId),
        defendingTerritories
      );
      this.#listeners[territoryId] = listener;
      territory.addEventListener('click', listener);
    });
  }

  #handleAttackTerritoryClick(territoryId) {
    this.#attackPhaseDetails.attackingTerritory = territoryId;
    this.#selectDefendingTerritory(territoryId);
  }

  handleAttackPhase(attackingTerritories) {
    attackingTerritories.forEach(territoryId => {
      const territory = document.getElementById(territoryId);
      this.#toggleTerritoryHighlight(territoryId, true);
      const listener = this.#handleTerritoryClick(
        territoryId,
        () => this.#handleAttackTerritoryClick(territoryId, attackingTerritories),
        attackingTerritories
      );
      this.#listeners[territoryId] = listener;
      territory.addEventListener('click', listener);
    });
  }

  updateTerritory({ territory, troopsCount }) {
    const domTerritory = document.getElementById(territory);
    const troopsCountDOM = domTerritory.querySelector('tspan');
    const existingTroops = parseInt(troopsCountDOM.textContent, 10);

    troopsCountDOM.textContent = existingTroops + troopsCount;
  }

  #renderTerritories(territories, players) {
    Object.entries(territories).forEach(([territoryId, { troops, owner }]) => {
      const domTerritory = document.getElementById(territoryId);
      const troopsCountDOM = domTerritory.querySelector('tspan');
      troopsCountDOM.textContent = troops;
      troopsCountDOM.style.fill = this.#findPlayerColor(owner, players);
    });
  }

  render(territories, players) {
    this.#renderTerritories(territories, players);
  }
}
