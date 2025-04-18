export default class GameController {
  #waitingModal;
  #apiService;
  #mapModal;
  #reinforceModal;

  constructor(waitingModal, mapModal, dataService, reinforcementModal) {
    this.#waitingModal = waitingModal;
    this.#apiService = dataService;
    this.#mapModal = mapModal;
    this.#reinforceModal = reinforcementModal;
  }

  #startPolling() {
    setInterval(async () => {
      const gameData = await this.#apiService.getGameDetails();      
      const { status, state } = gameData;
      this.#waitingModal.render(status, state.players);
      this.#mapModal.render(state);
      this.#reinforceModal.addTerritoryListners(state.currentPlayer, state.territories);

    }, 1000);
  }

  init() {
    this.#startPolling();
  }
}