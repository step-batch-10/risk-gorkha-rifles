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

  #removeDice() {
    const diceCenter = document.getElementById("dice-center");
    const diceRight = document.getElementById("dice-right");
    diceCenter.innerHTML = "";
    diceRight.innerHTML = "";
  }

  #displayDice(numbers, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    numbers.forEach((num) => {
      if (num >= 1 && num <= 6) {
        const dice = this.createDice(num);
        container.appendChild(dice);
      }
    });
  }

  #createToastHTML() {
    const html = `<div id='result-popup'>
     <div id='win-message'></div>
     <div id='attacker-troops-lost'></div>
     <div id='defender-troops-lost'></div>
    </div>`;

    return html;
  }

  renderCombatResult(attackerTroops, defenderTroops, winner) {
    const body = this.#createToastHTML();
    Toastify({
      text: body,
      duration: 3000,
      escapeMarkup: false,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #3e2514, #c99147)",
      },
    }).showToast();

    const winnerMessage = `${winner} won`;
    const attackerTroopsMessage = `attacker lost ${attackerTroops}`;
    const defenderTroopsMessage = `defender lost ${defenderTroops}`;

    document.getElementById("win-message").textContent = winnerMessage;
    document.getElementById("attacker-troops-lost").textContent =
      attackerTroopsMessage;
    document.getElementById("defender-troops-lost").textContent =
      defenderTroopsMessage;
  }

  startDice(attackerDice, defenderDice) {
    this.#displayDice(attackerDice, "dice-center");
    this.#displayDice(defenderDice, "dice-right");
  }

  removeDice() {
    this.#removeDice();
  }

  troopsToDefendWith() {
    return this.#troopsSelection.showTroopsToDefend();
  }

  troopsToAttackWith() {
    return this.#troopsSelection.showTroopsToAttack();
  }
  troopsForFortification(attackerTerritory, defenderTerritory) {
    return this.#troopsSelection.showTroopsToFortification(
      attackerTerritory,
      defenderTerritory
    );
  }
}
