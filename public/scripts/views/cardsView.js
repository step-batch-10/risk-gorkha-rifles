export default class CardsViewModal {
  #selectedCards = new Set();
  #modal;
  #container;
  #eventBus;
  #cardsOption;
  #isReinforcementPhase = false;
  #cardImages = {
    infantry: "../../images/infantry.png",
    cavalry: "../../images/cavalry.png",
    artillery: "../../images/artillery.png",
    wild: "../../images/combinedArms.png",
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

  #showToast(message) {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "center",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #3e2514, #c99147)",
      },
    }).showToast();
  }

  #getCardNames() {
    globalThis.document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("click", () => {
        if (card.dataset.count < 3) {
          this.#showToast("Cards cannot be traded");
          return;
        }
        card.classList.toggle("select-card");
        this.#selectedCards = new Set();
        this.#selectedCards.add(card.dataset.card);
        return;
      });
    });
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

  showTradeButton() {
    this.#isReinforcementPhase = true;
  }

  hideTradeButton() {
    this.#isReinforcementPhase = false;
  }

  render(cards) {
    this.#container.innerHTML = "";
    const tradeButton = document.createElement("div");
    tradeButton.textContent = "TRADE";
    tradeButton.setAttribute("id", "trade-button");
    if (!this.#isReinforcementPhase) {
      tradeButton.style.display = "none";
    } else {
      tradeButton.style.display = "flex";
    }

    const input = document.createElement("input");
    input.type = "hidden";
    input.setAttribute("id", "cards-selected");

    Object.entries(cards).forEach(([type, count]) => {
      const cardElement = document.createElement("div");
      cardElement.className = "card-container";

      cardElement.innerHTML = `
        <div data-count="${count}" data-card="${type}" class="card"><img src="${
        this.#cardImages[type]
      }"/></div>
        <div class="card-count">${count}</div>
      `;

      this.#getCardNames();
      this.#container.appendChild(cardElement);
      this.#container.appendChild(tradeButton);
    });

    tradeButton.addEventListener("click", () => {
      const cards = this.#selectedCards;
      this.#eventBus.emit("requestReinforcement", cards);
    });
  }
}
