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
    this.#eventBus.emit("attackPhaseStarted");
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

  #startFortificationPhase() {
    this.#eventBus.emit("startFortification");
    this.#eventBus.emit("stopAttackPhase")
  }

  #showAttackPhase() {
    this.closeAllPhases();
    this.#showPhaseDetailBox();

    const attack = document.getElementById("attack-phase");
    attack.style.display = "block";

    const requestAction = document.getElementById("attack-action");
    requestAction.addEventListener("click", this.#startAttack.bind(this), {
      once: true,
    });

    const skip = document.getElementById("skip");
    skip.style.display = "flex";
    requestAction.style.display = "flex";
    skip.addEventListener("click", this.#startFortificationPhase.bind(this), {
      once: true,
    });
  }

  #stopReinforcement() {
    this.#eventBus.emit("stopReinforcement");
  }

  #displayNextPhaseButton() {
    const nextPhaseButton = document.getElementById("nextPhaseBtn");

    nextPhaseButton.addEventListener("click", this.#showAttackPhase.bind(this));
    nextPhaseButton.addEventListener(
      "click",
      this.#stopReinforcement.bind(this),
      {
        once: true,
      }
    );
  }

  #handleReinforcementRequestClick() {
    this.#displayNextPhaseButton();
    this.#eventBus.emit("requestReinforcement");
  }

  closeAllPhases() {
    console.log("inside close all phases");

    this.#closePhaseDetailBox();
    this.#clearPhaseButtons("draft-phase");
    this.#clearPhaseButtons("attack-phase");
    this.#clearPhaseButtons("fortify-phase");
  }

  showFortificationPhase() {
    this.closeAllPhases();
    this.#showPhaseDetailBox();

    const fortify = document.getElementById("fortify-phase");
    fortify.style.display = "block";
  }

  showDraftPhaseUI() {
    this.closeAllPhases();
    const draftPhaseContainer = this.#showPhaseDetailBox();
    const draftPhase = document.getElementById("draft-phase");
    draftPhase.style.display = "block";

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

  #closePhaseDetailBox() {
    const draftPhaseContainer = document.getElementById("phaseDetails-box");
    draftPhaseContainer.style.display = "none";
    return draftPhaseContainer;
  }

  #showPhaseDetailBox() {
    const draftPhaseContainer = document.getElementById("phaseDetails-box");
    draftPhaseContainer.style.display = "block";
    return draftPhaseContainer;
  }
}
