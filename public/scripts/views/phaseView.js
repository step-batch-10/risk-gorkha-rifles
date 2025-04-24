export default class PhaseView {
  #eventBus;

  constructor(eventBus) {
    this.#eventBus = eventBus;
  }

  #clearPhaseButtons(id) {
    const phaseButtonsContainer = document.getElementById(id);
    phaseButtonsContainer.style.display = "none";
  }

  #startAttack() {
    this.#eventBus.emit('attackPhaseStarted');
    Toastify({
      text: `Select the attacking terrirory`,
      duration: 3000,
      gravity: "top",
      position: "left",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #303824, #874637)",
      },
    }).showToast();
  }

  #showAttackPhase() {
    this.#clearPhaseButtons("draft-phase");
    const attack = document.getElementById("attack-phase");
    attack.style.display = "block";

    const requestAction = document.getElementById("attack-action");
    requestAction.addEventListener("click", this.#startAttack.bind(this));

    const skip = document.getElementById("skip");
    skip.style.display = "flex";
    requestAction.style.display = "flex";
  }

  #stopReinforcement() {
    this.#eventBus.emit('stopReinforcement');
  }

  #displayNextPhaseButton() {
    this.#clearPhaseButtons("draft-action");
    const nextPhaseButton = document.getElementById("nextPhaseBtn");
    nextPhaseButton.style.display = "flex";

    nextPhaseButton.addEventListener("click", this.#showAttackPhase.bind(this));
    nextPhaseButton.addEventListener("click", this.#stopReinforcement.bind(this));

  }

  #handleReinforcementRequestClick() {
    this.#displayNextPhaseButton();
    this.#eventBus.emit('requestReinforcement');
  }

  showDraftPhaseUI() {
    this.#clearPhaseButtons("attack-phase");

    const draftPhaseContainer = document.getElementById("phaseDetails-box");
    draftPhaseContainer.style.display = "block";

    const reinforcementRequestButton =
      draftPhaseContainer.querySelector("#draft-action");

    reinforcementRequestButton.addEventListener(
      "click",
      this.#handleReinforcementRequestClick.bind(this),
      {
        once: true,
      }
    );
  }
}
