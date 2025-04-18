export default class GameController {
  #waitingModal;
  #apiService;
  #mapModal;

  constructor(waitingModal, mapModal, dataService) {
    this.#waitingModal = waitingModal;
    this.#apiService = dataService;
    this.#mapModal = mapModal;
  }

  #startPolling() {
    setInterval(async () => {
      const gameData = await this.#apiService.getGameDetails();
      const { status, state } = gameData;
      this.#waitingModal.render(status, state.players);
      this.#mapModal.render(state);

    }, 1000);
  }

  init() {
    this.#startPolling();
  }
}