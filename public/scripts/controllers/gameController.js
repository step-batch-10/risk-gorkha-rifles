export default class GameController {
  #modalManager;
  #apiService;
  #viewManager;
  #audio;
  #eventBus;

  #actionMap = {
    intialDeploymentStart: this.#handleIntialDeploymentStart.bind(this),
    troopDeployment: this.#handleTroopDeployment.bind(this),
    intialDeploymentStop: this.#intialDeploymentStop.bind(this),
    startGame: this.#startGame.bind(this),
    reinforcementPhase: this.#handleReinforcementPhase.bind(this),
  };

  #gameMetaData = {
    status: "running",
    userId: "1",
    players: [],
  };

  #actionsLog = [];

  constructor(modalManager, viewManager, apiService, audio, eventBus) {
    this.#modalManager = modalManager;
    this.#viewManager = viewManager;
    this.#apiService = apiService;
    this.#audio = audio;
    this.#eventBus = eventBus;
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
      this.#viewManager.renderPlayerSidebar(gameData.players);
    // }, 1000);
  }

  #handleTroopDeployment(gameDetails) {
    const {
      action: { data, playerId },
      players,
    } = gameDetails;
    this.#viewManager.updateTerritoryDetails(data);

    const player = players.find((player) => player.id === playerId);
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

    this.#modalManager.startReinforcementPhase(
      userId,
      action.territoryState,
      action.data
    );
    this.#updateUI(gameDetails);
  }

  #isValidAction(action) {
    return action in this.#actionMap;
  }

  #handleGameData(gameData) {
    const { status, actions, userId, players } = gameData;

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

  #handleReinforcementPhase() {
    this.#viewManager.startPlayerTurn();
  }

  async #requestReinforcement() {
    const troopsCount = await this.#apiService.requestReinforcement();
    Toastify({
      text: `You received ${troopsCount} troops.`,
      duration: 3000,
      gravity: "top",
      position: "left",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #303824, #874637)",
      },
    }).showToast();

    const userId = this.#gameMetaData.userId;
    const lastAction = this.#actionsLog.at(-1);
    const territoryState = lastAction.territoryState;

    this.#modalManager.startReinforcementPhase(userId, territoryState, {
      troopsCount,
    });
  }

  init() {
    this.#pollGameData();
    this.#eventBus.on('requestReinforcement', this.#requestReinforcement.bind(this));
    this.#audio.play();
  }
}
