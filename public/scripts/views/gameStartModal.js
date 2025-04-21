export default class GameStartModal {
  #modal;

  constructor(modelId) {
    this.#modal = document.getElementById(modelId);
  }

  show() {
    this.#modal.style.display = "flex";
    const startGameImage = document.getElementById("startGame-image");
    startGameImage.style.animation = 'blink 4s linear';
  }

  hide() {
    this.#modal.style.display = "none";
  }
}