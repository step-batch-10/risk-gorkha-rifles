export default class GameController {
  #modalManager;
  #apiService;
  #viewManager;
  #eventBus;
  #ChatBox;

  #actionMap = {
    startInitialDeployment: this.#handleIntialDeploymentStart.bind(this),
    updateTroops: this.#handleTroopDeployment.bind(this),
    stopInitialDeployment: this.#intialDeploymentStop.bind(this),
    startGame: this.#startGame.bind(this),
    reinforcementPhase: this.#handleReinforcementPhase.bind(this),
    attackPhaseStart: this.#handleAttackPhase.bind(this),
    fortification: this.#handleForitificationPhase.bind(this),
    troopsToDefendWith: this.#handleDefenderTroops.bind(this),
    diceRoll: this.#handleDiceRoll.bind(this),
    combatResult: this.#handleCombatResult.bind(this),
    conqueredTerritory: this.#handleConqueredTerritory.bind(this),
    turnChange: this.#switchTurn.bind(this),
    gameOver: this.#gameOver.bind(this),
  };

  #gameMetaData = {
    status: "running",
    userId: "1",
    players: [],
  };

  #actionsLog = [];

  constructor(modalManager, viewManager, apiService, eventBus, ChatBox) {
    this.#modalManager = modalManager;
    this.#viewManager = viewManager;
    this.#apiService = apiService;
    this.#eventBus = eventBus;
    this.#ChatBox = ChatBox;
  }

  #startGame() {
    this.#modalManager.showGameStartNotificationModal();
  }

  #switchTurn() {
    this.#viewManager.closeAllPhases();
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
      position: "center",
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
      position: "center",
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
    const newActions = actions.slice(-4);

    for (const action of newActions) {
      const { currentPlayer } = action;

      const gameDetails = { action, status, userId, players };
      if (!this.#isValidAction(action.name)) continue;

      this.#updateUI(gameDetails, currentPlayer);
      this.#actionMap[action.name](gameDetails);
    }
  }

  #updateUI({ action, players }, currentPlayer) {
    this.#viewManager.renderCalvalryPosition(
      action.currentCavalryPos,
      action.bonusTroops
    );
    this.#viewManager.updatePlayerStats(players, action.playerStates);
    this.#viewManager.renderAllTerritories(action.territoryState, players);
    this.#viewManager.renderPlayerSidebar(players, currentPlayer);
  }

  #handleReinforcementPhase() {
    setTimeout(() => {
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
    await this.#apiService.defendingPlayer(defendingTerritory);
  }

  #handleForitificationPhase(gameDetails) {
    const { action } = gameDetails;

    this.#viewManager.showFortificationPhase(action.data);
  }

  async #getConnectedTerritories(territoryId) {
    return await this.#apiService.connectedTerritories(territoryId);
  }

  #handleDefenderTroops() {
    Toastify({
      text: `Attacker selected your territory to attack`,
      duration: 3000,
      gravity: "top",
      position: "left",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #303824, #874637)",
      },
    }).showToast();
    this.#modalManager.troopsToDefendWith();
  }

  #handleDiceRoll({ action }) {
    const { dices } = action.data;
    Toastify({
      text: `Dice are rolling`,
      duration: 3000,
      gravity: "top",
      position: "left",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #303824, #874637)",
      },
    }).showToast();

    this.#modalManager.startDice([1, 1, 1], [1, 1]);
    const [attackerDice, defenderDice] = dices;
    setTimeout(() => {
      this.#modalManager.startDice(attackerDice, defenderDice);
    }, 3000);
  }

  async #initChatBox() {
    const players = await this.#apiService.getGamePlayers();

    const chatBox = new this.#ChatBox({
      fetchMessagesApi: this.#apiService.fetchMessages,
      sendMessageApi: this.#apiService.sendMessages,
      players,
      pollInterval: 3000,
    });
    chatBox.init();
  }

  #sendDefenderTroops(troops) {
    this.#apiService.troopsToDefend(troops);
  }

  #handleAttackerTroops() {
    this.#modalManager.troopsToAttackWith();
  }

  #sendAttackerTroops(troops) {
    this.#apiService.troopsToAttack(troops);
  }

  #handleCombatResult({ action }) {
    const { attackerTroops, defenderTroops, winner } = action.data;
    setTimeout(() => {
      this.#modalManager.renderCombatResult(
        attackerTroops,
        defenderTroops,
        winner
      );

      this.#modalManager.removeDice();
    }, 4000);
  }

  #handleConqueredTerritory({ action }) {
    const { attackerTerritory, defenderTerritory } = action.data;

    setTimeout(() => {
      Toastify({
        text: `attacker conquered the defender territory`,
        duration: 3000,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #3e2514, #c99147)",
        },
      }).showToast();
      const territoryState = Object.entries(action.territoryState).filter(
        ([territory]) => {
          return territory === attackerTerritory;
        }
      );
      const maxTroops = territoryState[0][1].troops;

      this.#modalManager.troopsForFortification(
        attackerTerritory,
        defenderTerritory,
        maxTroops
      );
    }, 5000);
  }

  #troopsForFortificationInAttack(
    attackerTerritory,
    defenderTerritory,
    troops
  ) {
    const fortificationDetails = {
      fromTerritory: attackerTerritory,
      toTerritory: defenderTerritory,
      troopCount: troops,
    };

    this.#apiService.fortification(fortificationDetails);
  }

  #stopAttackPhase() {
    this.#viewManager.stopAttackPhase();
  }

  #resetMapEffects() {
    this.#viewManager.resetMapEffects();
  }

  #gameOver() {
    globalThis.location.href = "/login";
  }

  init() {
    this.#pollGameData();
    this.#initChatBox();

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
    this.#eventBus.on(
      "getConnectedTerritories",
      this.#getConnectedTerritories.bind(this)
    );
    this.#eventBus.on("troopsToAttack", this.#handleAttackerTroops.bind(this));
    this.#eventBus.on("sendAttckerTroops", this.#sendAttackerTroops.bind(this));
    this.#eventBus.on(
      "fortification",
      this.#apiService.fortification.bind(this)
    );
    this.#eventBus.on(
      "startFortification",
      this.#apiService.startFortification.bind(this)
    );
    this.#eventBus.on(
      "sendDefenderTroops",
      this.#sendDefenderTroops.bind(this)
    );

    this.#eventBus.on(
      "TroopsForFortificationInAttack",
      this.#troopsForFortificationInAttack.bind(this)
    );

    this.#eventBus.on("stopAttackPhase", this.#stopAttackPhase.bind(this));
    this.#eventBus.on("switchTurn", this.#switchTurn.bind(this));
    this.#eventBus.on("resetMap", this.#resetMapEffects.bind(this));
  }
}
