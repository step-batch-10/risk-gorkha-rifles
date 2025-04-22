export default class PhaseView {
  #onReinforcementRequestCallback;

  onReinforcementRequest(callback) {
    this.#onReinforcementRequestCallback = callback;
  }

  #clearPhaseButtons() {
    const phaseButtonsContainer = document.getElementById("phaseBtnsHolder");
    Array.from(phaseButtonsContainer.children).forEach(child => {
      child.style.display = "none";
    });
  }

  #displayNextPhaseButton() {
    this.#clearPhaseButtons();
    const nextPhaseButton = document.getElementById("nextPhaseBtn");
    nextPhaseButton.style.display = "flex";
  }

  #handleReinforcementRequestClick() {
    this.#onReinforcementRequestCallback();
    this.#displayNextPhaseButton();
  }

  showDraftPhaseUI() {
    const draftPhaseContainer = document.getElementById("phaseDetails-box");
    draftPhaseContainer.style.display = "block";

    const reinforcementRequestButton = draftPhaseContainer.querySelector("#requestReinforcement");    
    reinforcementRequestButton.addEventListener('click', this.#handleReinforcementRequestClick.bind(this), {
      once: true
    });
  }
};