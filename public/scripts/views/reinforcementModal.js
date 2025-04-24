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
    const { newTroops } = actionData;
    this.#totalTroops = newTroops;
    this.#remainingTroops = newTroops;

    this.#currentPlayer = currentPlayer;
    this.#territories = territories;
    console.log(territories);

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
          <button id="decrement">-</button>
          <input type="number" id="number-input" disabled value="0" min="0" max="100" />
          <button id="increment">+</button>
        </div>
        <button id="place-troops-btn">Place</button>
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
        height: "20%",
        width: "40%",
        background: "rgba(200,170,140,0.5)",
        color: "#000",
        padding: "26px",
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

    console.log("Troops placed:", inputField.value, territoryName);
    toast.hideToast();
    this.#removeTerritoryHighlight();
  }

  #handleIncrementButtonClick(inputField) {
    if (this.#remainingTroops <= 0) return;

    this.#remainingTroops--;
    console.log("Remaining troops:", this.#remainingTroops);
    inputField.stepUp();
  }

  #handleDecrementButtonClick(inputField) {
    if (this.#remainingTroops >= this.#totalTroops) return;

    this.#remainingTroops++;
    console.log("Remaining troops:", this.#remainingTroops);
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
