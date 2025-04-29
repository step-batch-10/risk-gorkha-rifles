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
          <input type="number" id="number-input" value="0" min="0" max="100" />
        </div>
        </div>
        <div id="place-troops-btn">Place</div>
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
    if (
      !inputField.value ||
      (inputField.value <= 0) | (inputField.value > this.#remainingTroops)
    ) {
      return this.#showToast("Invalid troops count");
    }

    ApiService.saveTroopsDeployment(territoryName, inputField.value);

    toast.hideToast();
    this.#removeTerritoryHighlight();
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
