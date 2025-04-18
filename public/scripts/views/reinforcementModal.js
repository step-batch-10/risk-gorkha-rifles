import ApiService from "../components/apiService.js";

export default class ReinforcementModal {
  #currentPlayer;
  #territories = {};
  #clickListners = {};
  #troopsToDeploy = 13;

  #verifyTerritory(territoryId) {
    return (_e) => {
      if (
        this.#territories[territoryId].owner === this.#currentPlayer) {
        this.showTroopToast(territoryId);
      }
    };
  }

  removeListners() {
    Object.keys(this.#territories).forEach((territory) => {
      const region = document.getElementById(territory);
      const listner = this.#clickListners[territory];
      region.removeEventListener("click", listner);
    });
  }

  addTerritoryListeners(currentPlayer, territories) {
    this.#currentPlayer = currentPlayer;
    this.#territories = territories;

    Object.keys(territories).forEach((territory) => {
      const region = document.getElementById(territory);
      const listner = this.#verifyTerritory(territory).bind(this);
      this.#clickListners[territory] = listner;
      region.addEventListener('click', listner);
    });
  }

  #getToastHtml() {
    return `
    <div id="troop-toast-box">
      <div class="custom-number-input">
        <button id="decrement">-</button>
        <input type="number" id="number-input" value="0" min="0" max="100" />
        <button id="increment">+</button>
      </div>
      <button id="place-troops-btn">Place</button>
    </div>
  `;
  }

  #getToast(toastHTML) {
    return Toastify({
      text: toastHTML,
      duration: 10000,
      escapeMarkup: false,
      close: false,
      gravity: 'bottom',
      position: 'right',
      style: {
        height: '20%',
        width: '40%',
        background: 'rgba(200,170,140,0.5)',
        color: '#000',
        padding: '26px',
      },
    });
  }

  showTroopToast(territoryId) {
    const toastPopUp = document.getElementById("troop-toast-box");

    if (toastPopUp) document.removeChild(toastPopUp);

    const toastHTML = this.#getToastHtml();
    const toast = this.#getToast(toastHTML);
    toast.showToast();

    const input = document.querySelector('#number-input');
    const placeBtn = document.querySelector('#place-troops-btn');
    const incBtn = document.querySelector('#increment');
    const decBtn = document.querySelector('#decrement');

    placeBtn?.addEventListener('click', () => {
      if (!input.value) return;
      ApiService.saveTroopsDeployment(territoryId, input.value);

      console.log('Troops placed:', input.value, territoryId);
      toast.hideToast();
    });

    setTimeout(() => {
      incBtn?.addEventListener('click', () => {
        if (this.#troopsToDeploy <= 0) {
          return;
        }
          
        this.#troopsToDeploy--;
        console.log(this.#troopsToDeploy);

        return input.stepUp();
      });
      decBtn?.addEventListener('click', () => {
        if (this.#troopsToDeploy >= 13) {
          return;
        }

        this.#troopsToDeploy++;
        console.log(this.#troopsToDeploy);

        return input.stepDown();
      });
    });
  }
}