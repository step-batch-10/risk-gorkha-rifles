export default class ModalManager {
  #gameStartNotificationModal;
  #reinforcementPhaseModal;

  constructor(gameStartNotificationModal, reinforcementPhaseModal) {
    this.#gameStartNotificationModal = gameStartNotificationModal;
    this.#reinforcementPhaseModal = reinforcementPhaseModal;
  }

  showGameStartNotificationModal() {
    this.#gameStartNotificationModal.show();

    setTimeout(() => {
      this.#gameStartNotificationModal.hide();
    }, 4500);
  }

  startReinforcementPhase(userId, territoryState, data) {
    this.#reinforcementPhaseModal.addTerritoryListeners(
      userId,
      territoryState,
      data
    );
  }

  endReinforcementPhase() {
    alert("deployment phase over");
    this.#reinforcementPhaseModal.removeListeners();
  }
}
