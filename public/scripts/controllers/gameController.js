export default class GameController {
  #waitingModal;
  #apiService;
  #mapModal;
  #reinforcementModal;
  #playerSidebarView;
  #gameStartModal;
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

  constructor(
    waitingModal,
    mapModal,
    apiService,
    reinforcementModal,
    playerSidebarView,
    gameStartModal
  ) {
    this.#waitingModal = waitingModal;
    this.#apiService = apiService;
    this.#mapModal = mapModal;
    this.#reinforcementModal = reinforcementModal;
    this.#playerSidebarView = playerSidebarView;
    this.#gameStartModal = gameStartModal;

    this.#playMusic();
  }

  #startGame() {
    this.#gameStartModal.show();
    

    setTimeout(() => {
      this.#gameStartModal.hide();
    }, 4500);
  }

  #playMusic() {
    const audio = new Audio("../../assets/risk_music.mp3");
    audio.play();
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
    this.#mapModal.updateTerritory(data);

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
    this.#reinforcementModal.removeListeners();
  }

  #handleIntialDeploymentStart(gameDetails) {
    const { action, userId } = gameDetails;

    this.#reinforcementModal.addTerritoryListeners(userId, action.territoryState, action.data);
    this.#updateUI(gameDetails);
  }

  #isValidAction(action) {
    return action in this.#actionMap;
  }

  #handleGameData(gameData) {
    const { status, actions, userId, players } = gameData;
    if (status === "waiting") return this.#waitingModal.render(players);
    this.#waitingModal.hide();

    for (const action of actions) {
      const gameDetails = { action, status, userId, players };
      if (!this.#isValidAction(action.name)) continue;

      this.#actionMap[action.name](gameDetails);
    }
  }

  #updateUI({ action, players }) {
    this.#mapModal.render(action.territoryState, players);
    this.#playerSidebarView.render(players);
  }

  init() {
    this.#pollGameData();
  }
}
