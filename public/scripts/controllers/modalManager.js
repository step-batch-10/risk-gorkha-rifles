export default class ModalManager {
  #gameStartNotificationModal;
  #reinforcementPhaseModal;
  #troopsSelection;

  #diceDotMap = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
  };

  constructor(
    gameStartNotificationModal,
    reinforcementPhaseModal,
    troopsSelection
  ) {
    this.#gameStartNotificationModal = gameStartNotificationModal;
    this.#reinforcementPhaseModal = reinforcementPhaseModal;
    this.#troopsSelection = troopsSelection;
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
    this.#reinforcementPhaseModal.removeListeners();
  }

  createDice(faceValue) {
    const die = document.createElement("div");
    die.classList.add("die");

    for (let i = 0; i < 9; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (!this.#diceDotMap[faceValue].includes(i)) {
        dot.classList.add("hidden");
      }
      die.appendChild(dot);
    }

    return die;
  }

  #displayDice(numbers, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    numbers.forEach((num) => {
      if (num >= 1 && num <= 6) {
        const die = this.createDice(num);
        container.appendChild(die);
      }
    });
  }

  startDice(attackerDice, defenderDice) {
    this.#displayDice(attackerDice, "dice-center");
    this.#displayDice(defenderDice, "dice-right");
  }

  troopsToDefendWith() {
    return this.#troopsSelection.showTroopsToDefend();
  }

  troopsToAttackWith() {
    return this.#troopsSelection.showTroopsToAttack();
  }
}
