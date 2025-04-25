export default class GameController {
  #modalManager;
  #apiService;
  #viewManager;
  #audio;
  #eventBus;

  #actionMap = {
    startInitialDeployment: this.#handleIntialDeploymentStart.bind(this),
    updateTroops: this.#handleTroopDeployment.bind(this),
    stopInitialDeployment: this.#intialDeploymentStop.bind(this),
    startGame: this.#startGame.bind(this),
    reinforcementPhase: this.#handleReinforcementPhase.bind(this),
    attackPhaseStart: this.#handleAttackPhase.bind(this),
    foritfication: this.#handleForitificationPhase.bind(this),
    troopsToDefendWith: this.#handleDefenderTroops.bind(this)
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
  }

  #getLastTimestamp() {
    return this.#actionsLog.length ? this.#actionsLog.at(-1).timeStamp : 0;
  }

  #pollGameData() {
    setInterval(async () => {
      const lastTimestamp = this.#getLastTimestamp();

      const gameData = await this.#apiService.getGameDetails(lastTimestamp);
      this.#updateLocalState(gameData);
      this.#handleGameData(gameData);
      this.#viewManager.renderPlayerSidebar(gameData.players);
    }, 1000);
  }

  #handleTroopDeployment(gameDetails) {
    const {
      action: { playerId, data },
      players,
    } = gameDetails;
    this.#viewManager.updateTerritoryDetails(data);
    const player = players.find((player) => player.id === playerId);
    const actionerName = player ? player.username : "Unknown Player";

    const { troopDeployed, territory } = data;

    Toastify({
      text: `${actionerName} placed ${troopDeployed} in ${territory}`,
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
    Toastify({
      text: `Initial deployment is over`,
      duration: 3000,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #3e2514, #c99147)",
      },
    }).showToast();
    this.#modalManager.endReinforcementPhase();
  }

  #handleIntialDeploymentStart(gameDetails) {
    const { action, userId } = gameDetails;

    this.#modalManager.startReinforcementPhase(
      userId,
      action.territoryState,
      action.data
    );
  }

  #isValidAction(action) {
    return action in this.#actionMap;
  }

  #handleGameData(gameData) {
    const { status, actions, userId, players } = gameData;
    for (const action of actions) {
      const { currentPlayer } = action;
      const gameDetails = { action, status, userId, players };
      if (!this.#isValidAction(action.name)) continue;
      this.#updateUI(gameDetails, currentPlayer);
      this.#actionMap[action.name](gameDetails);
    }
  }

  #updateUI({ action, players }, currentPlayer) {
    this.#viewManager.renderAllTerritories(action.territoryState, players);
    this.#viewManager.renderPlayerSidebar(players, currentPlayer);
  }

  #handleReinforcementPhase() {
    setTimeout(() => {
      console.log;
      this.#viewManager.startPlayerTurn();
    }, 5000);
  }

  async #requestReinforcement() {
    const { territories, newTroops } =
      await this.#apiService.requestReinforcement();
    Toastify({
      text: `You received ${newTroops} troops.`,
      duration: 3000,
      gravity: "top",
      position: "left",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #303824, #874637)",
      },
    }).showToast();

    territories.forEach((territoryName) => {
      this.#viewManager.highlightTerritory(territoryName);
    });

    const userId = this.#gameMetaData.userId;
    const lastAction = this.#actionsLog.at(-1);
    const territoryState = lastAction.territoryState;

    this.#modalManager.startReinforcementPhase(userId, territoryState, {
      newTroops,
      territories,
    });
  }

  async #handleAttackPhase() {
    const territories = await this.#apiService.requestAttack();

    this.#viewManager.handleAttackView(territories);
  }

  #stopReinforcementPhase() {
    this.#modalManager.endReinforcementPhase();
  }

  async #getDefendingTerritories(attackingTerritoryId) {
    const defendingTerritories = await this.#apiService.defendingTerritories(
      attackingTerritoryId
    );

    return defendingTerritories;
  }

  async #renderCards() {
    const cards = await this.#apiService.getCards();
    this.#viewManager.renderCards(cards);
  }

  async #getDefendingPlayer(defendingTerritory) {
    const defenderId = await this.#apiService.defendingPlayer(
      defendingTerritory
    );

    const message = await this.#apiService.sendRequestToDefender(defenderId);

    if (message === "opponent found") {
      prompt("select no of troops to defend with");
    }
  }

  #handleForitificationPhase(gameDetails) {
    const { action } = gameDetails;
    this.#viewManager.showFortificationPhase(action.data.activeTerritories);
  }

  async #getConnectedTerritories(territoryId) {
    return await this.#apiService.connectedTerritories(territoryId);
  }

  async #troopsToAttack(troops) {
    await this.#apiService.troopsToAttack(troops);
  }

  #handleDefenderTroops() {

    Toastify({
      text: `Attacker select your territory to attack`,
      duration: 3000,
      gravity: "top",
      position: "left",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #303824, #874637)",
      },
    }).showToast();

    const troopsToDefend = prompt("select the troops to defend with");
    this.#apiService.troopsToDefend(parseInt(troopsToDefend));
  }

  init() {
    this.#pollGameData();
    this.#eventBus.on(
      "requestReinforcement",
      this.#requestReinforcement.bind(this)
    );
    this.#eventBus.on("attackPhaseStarted", this.#handleAttackPhase.bind(this));
    this.#eventBus.on(
      "stopReinforcement",
      this.#stopReinforcementPhase.bind(this)
    );
    this.#eventBus.on(
      "getDefendingTerritories",
      this.#getDefendingTerritories.bind(this)
    );
    this.#eventBus.on("renderCards", this.#renderCards.bind(this));
    this.#eventBus.on("defendingPlayer", this.#getDefendingPlayer.bind(this));
    this.#eventBus.on("getConnectedTerritories", this.#getConnectedTerritories.bind(this));
    this.#eventBus.on("troopsToAttack", this.#troopsToAttack.bind(this));
    this.#audio.play();
  }
}
