export default class MapView {
  #attackPhaseDetails = {
    attackingTerritory: "",
    defendingTerritory: "",
    troopsCount: "",
  };

  #fortificationDetails = {
    fromTerritory: "",
    toTerritory: "",
    troopCount: "",
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
    const player = players.find((player) => player.id === playerId);
    return player?.colour || "#000";
  }

  #toggleTerritoryHighlight(territoryId, highlight = true) {
    const territory = document.getElementById(territoryId);
    const path = territory.querySelector("path");
    path.classList.toggle("highlight-territory", highlight);
  }

  highlightTerritory(territoryId) {
    this.#toggleTerritoryHighlight(territoryId);
  }

  unHighlightTerritory(territoryId) {
    this.#toggleTerritoryHighlight(territoryId, false);
  }

  #removeClickListeners(territories) {
    territories.forEach((territoryId) => {
      const territory = document.getElementById(territoryId);
      this.#toggleTerritoryHighlight(territoryId, false);
      territory.removeEventListener("click", this.#listeners[territoryId]);
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
    this.#eventBus.emit("defendingPlayer", territoryId);
    this.#showToast("Select the number of troops to attack with");

    setTimeout(() => {
      const troops = prompt("no of troops to Attack with..");
      this.#eventBus.emit("troopsToAttack", parseInt(troops));
    }, 2000);
  }

  async #selectDefendingTerritory(attackingTerritoryId) {
    this.#showToast("Selecting defending territory");
    const [response] = this.#eventBus.emit(
      "getDefendingTerritories",
      attackingTerritoryId
    );
    const defendingTerritories = await response;

    defendingTerritories.forEach((territoryId) => {
      const territory = document.getElementById(territoryId);
      this.#toggleTerritoryHighlight(territoryId, true);
      const listener = this.#handleTerritoryClick(
        territoryId,
        () => this.#handleDefendTerritoryClick(territoryId),
        defendingTerritories
      );
      this.#listeners[territoryId] = listener;
      territory.addEventListener("click", listener);
    });
  }

  #handleAttackTerritoryClick(territoryId) {
    this.#attackPhaseDetails.attackingTerritory = territoryId;
    this.#selectDefendingTerritory(territoryId);
  }

  handleAttackPhase(attackingTerritories) {
    attackingTerritories.forEach((territoryId) => {
      const territory = document.getElementById(territoryId);
      this.#toggleTerritoryHighlight(territoryId, true);
      const listener = this.#handleTerritoryClick(
        territoryId,
        () =>
          this.#handleAttackTerritoryClick(territoryId, attackingTerritories),
        attackingTerritories
      );
      this.#listeners[territoryId] = listener;
      territory.addEventListener("click", listener);
    });
  }

  updateTerritory({ territory, troopCount }) {
    const domTerritory = document.getElementById(territory);
    const troopsCountDOM = domTerritory.querySelector("tspan");

    troopsCountDOM.textContent = troopCount;
  }

  #renderTerritories(territories, players) {
    Object.entries(territories).forEach(
      ([territoryName, { troops, owner }]) => {
        const playerColor = this.#findPlayerColor(owner, players);
        const domTerritory = document.getElementById(territoryName);
        const troopsCountDOM = domTerritory.querySelector("tspan");
        troopsCountDOM.textContent = troops;
        troopsCountDOM.style.fill = playerColor;
        troopsCountDOM.classList.add("troops-bg");
      }
    );
  }

  render(territories, players) {
    this.#renderTerritories(territories, players);
  }

  #unHighlightTerritories(territories) {
    territories.forEach((territoryId) => {
      this.unHighlightTerritory(territoryId);
    });
  }

  #selectToTerritoryClick(territoryId, territories) {
    return () => {
      this.#fortificationDetails.toTerritory = territoryId;
      this.#removeClickListeners(territories);
      this.#toggleBlinkTerritories(territories, false);
      this.highlightTerritory(territoryId);

      setTimeout(() => {
        const troopsCount = prompt("Enter number of toops to select");
        this.#fortificationDetails.troopCount = troopsCount;
        this.#eventBus.emit("fortification", this.#fortificationDetails);
      }, 2000);
    };
  }

  #toggleBlinkTerritories(territories, status = true) {
    territories.forEach((territoryId) => {
      const territory = document.getElementById(territoryId);
      const path = territory.querySelector("path");
      if (status) return path.classList.add("blink-territory");

      return path.classList.remove("blink-territory");
    });
  }

  #handleToTerritoryClick(territories) {
    this.#toggleBlinkTerritories(territories);
    territories.forEach((territoryId) => {
      const territory = document.getElementById(territoryId);

      const listner = this.#selectToTerritoryClick(territoryId, territories);
      this.#handleConnectedTerritories(territoryId);
      this.#listeners[territoryId] = listner;

      territory.addEventListener("click", listner);
    });
  }

  async #handleConnectedTerritories(territoryId) {
    const [emitResponse] = this.#eventBus.emit(
      "getConnectedTerritories",
      territoryId
    );
    const connectedTerritories = await emitResponse;

    this.#showToast("Select to territory for fortification");
    this.#handleToTerritoryClick(connectedTerritories);
  }

  #selectFromTerritoryClick(territoryId, territories) {
    return () => {
      this.#fortificationDetails.fromTerritory = territoryId;
      this.#removeClickListeners(territories);
      this.#unHighlightTerritories(territories);
      this.highlightTerritory(territoryId);
      this.#handleConnectedTerritories(territoryId);
    };
  }

  startFortificationPhase(territories) {
    this.#removeClickListeners(territories);
    this.#showToast("Select from territory for fortification");

    territories.forEach((territoryId) => {
      this.highlightTerritory(territoryId);
      const territory = document.getElementById(territoryId);
      const listner = this.#selectFromTerritoryClick(territoryId, territories);
      this.#listeners[territoryId] = listner;

      territory.addEventListener("click", listner);
    });
  }
}
