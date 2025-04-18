export default class GameController {
  #waitingModal;
  #apiService;

  constructor(waitingModal, dataService) {
    this.#waitingModal = waitingModal;
    this.#apiService = dataService;
  }

  #startPolling() {
    setInterval(async () => {
      const gameData = await this.#apiService.getGameDetails();
      const { status, state } = gameData;
      this.#waitingModal.render(status, state.players);

    }, 1000);
  }

  init() {
    this.#startPolling();
  }
}