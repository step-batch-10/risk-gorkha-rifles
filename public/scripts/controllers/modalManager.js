export default class ModalManager {
  #waitingPlayersModal;
  #gameStartNotificationModal;
  #reinforcementPhaseModal;

  constructor(waitingPlayersModal, gameStartNotificationModal, reinforcementPhaseModal) {
    this.#waitingPlayersModal = waitingPlayersModal;
    this.#gameStartNotificationModal = gameStartNotificationModal;
    this.#reinforcementPhaseModal = reinforcementPhaseModal;
  }

  renderWaitingPlayers(players) {
    return this.#waitingPlayersModal.render(players);
  }

  hideWaitingPlayersModal() {
    this.#waitingPlayersModal.hide();
  }

  showGameStartNotificationModal() {
    this.#gameStartNotificationModal.show();

    setTimeout(() => {
      this.#gameStartNotificationModal.hide();
    }, 4500);
  }

  startReinforcementPhase(userId, territoryState, data) {
    this.#reinforcementPhaseModal.addTerritoryListeners(userId, territoryState, data);
  }

  endReinforcementPhase() {
    this.#reinforcementPhaseModal.removeListeners();
  }
}