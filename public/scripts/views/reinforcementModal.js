import ApiService from "../components/apiService.js";

export default class ReinforcementModal {
  #currentPlayer;
  #territories = {};
  #clickListeners = {};
  #remainingTroops = null;
  #totalTroops = null;

  #isOwnedByCurrentPlayer(territoryId) {
    return this.#territories[territoryId].owner === this.#currentPlayer;
  }

  #removeTerritoryHighlight() {
    Object.keys(this.#territories).forEach((territoryId) => {
      const territoryElement = document.getElementById(territoryId);
      const path = territoryElement.querySelector("path");

      path.classList.remove("highlight-territory");
    });
  }

  #handleTerritoryClick(territoryId) {
    return (_event) => {
      if (this.#isOwnedByCurrentPlayer(territoryId)) {
        const territory = document.getElementById(territoryId);
        const path = territory.querySelector("path");
        path.classList.add("highlight-territory");

        this.#showTroopDeploymentToast(territoryId);
      }
    };
  }

  removeListeners() {
    Object.keys(this.#territories).forEach((territoryId) => {
      const territoryElement = document.getElementById(territoryId);
      const listener = this.#clickListeners[territoryId];
      territoryElement.removeEventListener("click", listener);
    });
  }

  addTerritoryListeners(currentPlayer, territories, actionData, actionPlayerStates) {
    const { newTroops } = actionData;
    this.#totalTroops = newTroops;
    this.#remainingTroops = actionPlayerStates[currentPlayer].availableTroops;
    
    this.#currentPlayer = currentPlayer;
    this.#territories = territories;

    Object.keys(territories).forEach((territoryName) => {
      const territoryElement = document.getElementById(territoryName);
      const listener = this.#handleTerritoryClick(territoryName).bind(this);
      this.#clickListeners[territoryName] = listener;
      territoryElement.addEventListener("click", listener);
    });
  }

  #createToastHtml() {
    return `
      <div id="troop-toast-box">
        <div class="custom-number-input">
          <input type="number" id="number-input" value="1" min="1" max="${this.#remainingTroops}" />
        </div>
        <div class="troop-info">Available: ${this.#remainingTroops} troops</div>
        <div id="place-troops-btn">Place</div>
      </div>
    `;
  }

  #createToast(toastHTML) {
    return Toastify({
      text: toastHTML,
      duration: 10000,
      escapeMarkup: false,
      close: false,
      gravity: "bottom",
      position: "center",
      style: {
        padding: "0px",
        background: "transparent",
      },
    });
  }

  #showToast(message) {
    Toastify({
      text: message,
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background:
          "linear-gradient(to right,rgb(251, 196, 85),rgb(255, 166, 0))",
      },
      onClick: function () {},
    }).showToast();
  }

  #attachToastEventListeners(territoryId, toast) {
    const inputField = document.querySelector("#number-input");
    const placeButton = document.querySelector("#place-troops-btn");

    placeButton?.addEventListener("click", () =>
      this.#handlePlaceButtonClick(territoryId, inputField, toast)
    );
  }

  #handlePlaceButtonClick(territoryName, inputField, toast) {
    const troopCount = parseInt(inputField.value);
    
    if (
      !inputField.value ||
      isNaN(troopCount) ||
      troopCount <= 0 ||
      troopCount > this.#remainingTroops
    ) {
      return this.#showToast(`Invalid troops count. You have ${this.#remainingTroops} troops available.`);
    }

    this.#remainingTroops -= troopCount;

    ApiService.saveTroopsDeployment(territoryName, troopCount);

    toast.hideToast();
    this.#removeTerritoryHighlight();
    
    if (this.#remainingTroops > 0) {
      this.#showToast(`${troopCount} troops deployed. ${this.#remainingTroops} troops remaining.`);
    } else {
      this.#showToast(`All troops deployed!`);
    }
  }

  #showTroopDeploymentToast(territoryId) {
    const existingToast = document.getElementById("troop-toast-box");
    if (existingToast) return;

    const toastHTML = this.#createToastHtml();
    const toast = this.#createToast(toastHTML);
    toast.showToast();

    setTimeout(() => {
      this.#attachToastEventListeners(territoryId, toast);
    });
  }
}
