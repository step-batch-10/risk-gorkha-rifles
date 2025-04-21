export default class GameController {
  #modalManager;
  #apiService;
  #viewManager;
  #audio;

  #actionMap = {
    intialDeploymentStart: this.#handleIntialDeploymentStart.bind(this),
    troopDeployment: this.#handleTroopDeployment.bind(this),
    intialDeploymentStop: this.#intialDeploymentStop.bind(this),
    startGame: this.#startGame.bind(this)
  };

  #gameMetaData = {
    status: "waiting",
    userId: "1",
    players: []
  };

  #actionsLog = [];

  constructor(modalManager, viewManager, apiService, audio) {
    this.#modalManager = modalManager;
    this.#viewManager = viewManager;
    this.#apiService = apiService;
    this.#audio = audio;
  }

  #startGame() {
    this.#modalManager.showGameStartNotificationModal();
  }

  #updateLocalState(gameDetails) {
    const { players, status, userId, actions } = gameDetails;
    this.#gameMetaData = { players, status, userId };
    this.#actionsLog = [...this.#actionsLog, ...actions];

    console.log(this.#actionsLog);
  }

  #getLastTimestamp() {
    return this.#actionsLog.length ? this.#actionsLog.at(-1).timestamp : 0;
  }

  async #pollGameData() {
    // setInterval(async () => {
    const lastTimestamp = this.#getLastTimestamp();

    const gameData = await this.#apiService.getGameDetails(lastTimestamp);
    this.#updateLocalState(gameData);
    this.#handleGameData(gameData);
    // }, 1000);
  }

  #handleTroopDeployment(gameDetails) {
    const { action: { data, playerId }, players } = gameDetails;
    this.#viewManager.updateTerritoryDetails(data);

    const player = players.find(player => player.id === playerId);
    const actionerName = player ? player.name : "Unknown Player";

    Toastify({
      text: `${actionerName} placed ${data.troopsCount} in ${data.territory}`,
      duration: 3000,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #3e2514, #c99147)",
      },
    }).showToast();
  }

  #intialDeploymentStop() {
    this.#modalManager.endReinforcementPhase();
  }

  #handleIntialDeploymentStart(gameDetails) {
    const { action, userId } = gameDetails;

    this.#modalManager.startReinforcementPhase(userId, action.territoryState, action.data);
    this.#updateUI(gameDetails);
  }

  #isValidAction(action) {
    return action in this.#actionMap;
  }

  #handleGameData(gameData) {
    const { status, actions, userId, players } = gameData;
    if (status === "waiting") return this.#modalManager.renderWaitingPlayers(players);
    this.#modalManager.hideWaitingPlayersModal();

    for (const action of actions) {
      const gameDetails = { action, status, userId, players };
      if (!this.#isValidAction(action.name)) continue;

      this.#actionMap[action.name](gameDetails);
    }
  }

  #updateUI({ action, players }) {
    this.#viewManager.renderAllTerritories(action.territoryState, players);
    this.#viewManager.renderPlayerSidebar(players);
  }

  init() {
    this.#pollGameData();
    this.#audio.play();
  }
}