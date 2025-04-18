export default class GameController {
  #waitingModal;
  #apiService;
  #mapModal;
  #reinforceModal;
  #actions;

  constructor(waitingModal, mapModal, dataService, reinforcementModal) {
    this.#waitingModal = waitingModal;
    this.#apiService = dataService;
    this.#mapModal = mapModal;
    this.#reinforceModal = reinforcementModal;
  }



  #startPolling() {
    setInterval(async () => {
      const gameData = await this.#apiService.getGameDetails();
      const { status, state, currentPlayer } = gameData;

      if (state?.action?.name === "initialDeployment") {
        this.#reinforceModal.addTerritoryListners(currentPlayer, state.territories);
      } else {
        this.#reinforceModal.removeListners();
      }

      if (state.action.name === "startGame") {
        Toastify({
          text: "Game has been started now",
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

      this.#waitingModal.render(status, state.players);
      this.#mapModal.render(state);

    }, 1000);
  }

  init() {
    this.#startPolling();
  }
}