export default class GameController {
  #waitingModal;
  #apiService;
  #mapModal;
  #reinforcementModal;
  #playerSidebarView;

  constructor(waitingModal, mapModal, apiService, reinforcementModal, playerSidebarView) {
    this.#waitingModal = waitingModal;
    this.#apiService = apiService;
    this.#mapModal = mapModal;
    this.#reinforcementModal = reinforcementModal;
    this.#playerSidebarView = playerSidebarView;
  }

  #pollGameData() {
    setInterval(async () => {
      const gameData = await this.#apiService.getGameDetails();
      this.#handleGameData(gameData);
    }, 1000);
  }

  #handleGameData(gameData) {
    const { status, state, currentPlayer } = gameData;

    this.#handleReinforcementPhase(state, currentPlayer);
    this.#handleGameStartNotification(state);
    this.#updateUI(status, state);
  }

  #handleReinforcementPhase(state, currentPlayer) {
    if (state?.action?.name === "initialDeployment") {
      this.#reinforcementModal.addTerritoryListeners(currentPlayer, state.territories);
    } else {
      this.#reinforcementModal.removeListeners();
    }
  }

  #handleGameStartNotification(state) {
    if (state?.action?.name === "startGame") {
      this.#showToast("Game has been started now");
    }
  }

  #showToast(message) {
    Toastify({
      text: message,
      duration: 3000,
      escapeMarkup: false,
      close: false,
      gravity: 'top',
      position: 'center',
      style: {
        background: "linear-gradient(to right, #3e2514, #c99147)",
      },
    }).showToast();
  }

  #updateUI(status, state) {
    this.#waitingModal.render(status, state.players);
    this.#mapModal.render(state);
    this.#playerSidebarView.render(state?.players);
  }

  init() {
    this.#pollGameData();
  }
}