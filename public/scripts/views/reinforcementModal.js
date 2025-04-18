export default class ReinforcementModal {
  #currentPlayer;
  #territories = [];

  #verifyTerritory(territoryId) {
    return (_e) => {
      if (
        this.#territories[territoryId].owner === this.#currentPlayer) {
        this.showTroopToast();
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

  showTroopToast() {
    const toastPopUp = document.getElementById("troop-toast-box");
    console.log(toastPopUp);
    
    if (toastPopUp) document.removeChild(toastPopUp);

    const toastHTML = this.#getToastHtml();
    const toast = this.#getToast(toastHTML);
    toast.showToast();

    const input = document.querySelector('#number-input');
    const placeBtn = document.querySelector('#place-troops-btn');
    const incBtn = document.querySelector('#increment');
    const decBtn = document.querySelector('#decrement');

    placeBtn?.addEventListener('click', () => {
      console.log('Troops placed:', input.value);
      toast.hideToast();
    });

    setTimeout(() => {
      incBtn?.addEventListener('click', () => input.stepUp());
      decBtn?.addEventListener('click', () => input.stepDown());
    });
  }
}