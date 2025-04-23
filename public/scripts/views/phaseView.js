export default class PhaseView {
  #onReinforcementRequestCallback;

  onReinforcementRequest(callback) {
    this.#onReinforcementRequestCallback = callback;
  }

  #clearPhaseButtons(id) {
    const phaseButtonsContainer = document.getElementById(id);
    phaseButtonsContainer.style.display = "none";
  }

  #showAttackPhase() {
    this.#clearPhaseButtons("draft-phase");
    const attack = document.getElementById("attack-phase");
    attack.style.display = "block";

    const requestAction = document.getElementById("attack-action");
    const skip = document.getElementById("skip");
    skip.style.display = "flex";
    requestAction.style.display = "flex";
  }

  #displayNextPhaseButton() {
    this.#clearPhaseButtons("draft-action");
    const nextPhaseButton = document.getElementById("nextPhaseBtn");
    nextPhaseButton.style.display = "flex";
    nextPhaseButton.addEventListener("click", this.#showAttackPhase.bind(this));
  }

  #handleReinforcementRequestClick() {
    this.#onReinforcementRequestCallback();
    this.#displayNextPhaseButton();
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
