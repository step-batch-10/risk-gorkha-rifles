export default class CardsViewModal {
  #modal;
  #container;
  #eventBus;
  #cardsOption;
  #cardImages = {
    infantry: "../../images/infantry.png",
    cavalry: "../../images/cavalry.png",
    artillery: "../../images/artillery.png",
    wild: "../../images/card-back(2).png",
  };

  constructor(modelId, cardsOptionId, eventBus) {
    this.#modal = document.getElementById(modelId);
    this.#cardsOption = document.getElementById(cardsOptionId);
    this.#container = this.#modal.querySelector("#cards-container");
    this.#eventBus = eventBus;
  }

  show() {
    this.#eventBus.emit("renderCards");
    this.#modal.style.display = "flex";
  }

  hide() {
    this.#modal.style.display = "none";
  }

  isVisible() {
    return (
      this.#modal.style.display !== "none" && this.#modal.style.display !== ""
    );
  }

  init() {
    this.#cardsOption.addEventListener("click", () => {
      if (!this.isVisible()) {
        this.show();
      } else {
        this.hide();
      }
    });
  }

  render(cards) {
    this.#container.innerHTML = "";

    Object.entries(cards).forEach(([type, count]) => {
      const cardElement = document.createElement("div");
      cardElement.className = "card-container";

      cardElement.innerHTML = `
        <div class="card"><img src="${this.#cardImages[type]}"/></div>
        <div class="card-count">${count}</div>
      `;

      this.#container.appendChild(cardElement);
    });
  }
}
