export default class ReinforcementModal {
  #container;
  #currentPlayer;
  #territories = [];

  constructor(containerId) {
    this.#container = document.getElementById(containerId);
  }

  #verifyTerritory(territoryId) {
    return (_e) => {
      if (
        this.#territories[territoryId].owner === this.#currentPlayer &&
        state === 'reinforcement'
      ) {
        showTroopToast();
      }
    };
  }

  addTerritoryListners(currentPlayer, territories) {
    this.#currentPlayer = currentPlayer;
    this.#territories = territories;

    Object.keys(territories).forEach((territory) => {
      const region = document.getElementById(territory);
      region.addEventListener('click', this.#verifyTerritory(territory).bind(this));
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
  `
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

  showTroopToast() {
    const input = container.querySelector('#number-input');
    const placeBtn = container.querySelector('#place-troops-btn');
    const incBtn = container.querySelector('#increment');
    const decBtn = container.querySelector('#decrement');

    const toastHTML = this.#getToastHtml();
    const toast = this.#getToast(toastHTML);
    toast.showToast();

    placeBtn?.addEventListener('click', () => {
      console.log('Troops placed:', input.value);
      toast.hideToast();
    });

    incBtn?.addEventListener('click', () => input.stepUp());
    decBtn?.addEventListener('click', () => input.stepDown());
  }
}