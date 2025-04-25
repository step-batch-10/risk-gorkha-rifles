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

  addTerritoryListeners(currentPlayer, territories, actionData) {
    const { troopCount } = actionData;
    this.#totalTroops = troopCount;
    this.#remainingTroops = troopCount;

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
          <div class="decrement-button" id="decrement">-</div>
          <input type="number" id="number-input" disabled value="0" min="0" max="100" />
          <div class="decrement-button" id="increment">+</div>
        </div>
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
      position: "right",
      style: {
        padding: "0px",
        background: "transparent",
      },
    });
  }

  #attachToastEventListeners(territoryId, toast) {
    const inputField = document.querySelector("#number-input");
    const placeButton = document.querySelector("#place-troops-btn");
    const incrementButton = document.querySelector("#increment");
    const decrementButton = document.querySelector("#decrement");

    placeButton?.addEventListener("click", () =>
      this.#handlePlaceButtonClick(territoryId, inputField, toast)
    );
    incrementButton?.addEventListener("click", () =>
      this.#handleIncrementButtonClick(inputField)
    );
    decrementButton?.addEventListener("click", () =>
      this.#handleDecrementButtonClick(inputField)
    );
  }

  #handlePlaceButtonClick(territoryName, inputField, toast) {
    if (!inputField.value) return;
    ApiService.saveTroopsDeployment(territoryName, inputField.value);

    toast.hideToast();
    this.#removeTerritoryHighlight();
  }

  #handleIncrementButtonClick(inputField) {
    if (this.#remainingTroops <= 0) return;

    this.#remainingTroops--;
    inputField.stepUp();
  }

  #handleDecrementButtonClick(inputField) {
    if (this.#remainingTroops >= this.#totalTroops) return;

    this.#remainingTroops++;
    inputField.stepDown();
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
