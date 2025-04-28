export class AttackDefenceModal {
  #eventbus;
  constructor(eventBus) {
    this.#eventbus = eventBus;
  }
  #createDefenderTroopsHtml() {
    return `<div id="troops-to-defend">
              <input id="troops-input" type="text" placeholder="Troops to Defend with" style="width: 200px;" min="1" max="2"/>
              <button id="submit-button" style="margin-left: 5px;">Submit</button>
            </div>
          `;
  }

  #createAttackerTroopsHtml() {
    return `<div id="troops-to-attack">
              <input id="troops-input" type="text" placeholder="Troops to attack With" style="width: 200px;" min="1" max="3"/>
              <button id="submit-button" style="margin-left: 5px;">Submit</button>
            </div>
          `;
  }

  #createToast(createToastHTML) {
    const toastHTML = createToastHTML();
    console.log(toastHTML, createToastHTML);
    const myToast = Toastify({
      text: toastHTML,
      duration: -1,
      escapeMarkup: false,
      close: false,
      gravity: "bottom",
      position: "right",
      style: {
        background: "transparent",
        padding: "10px",
      },
    });
    myToast.showToast();
    return myToast;
  }

  showTroopsToDefend() {
    const myToast = this.#createToast(
      this.#createDefenderTroopsHtml.bind(this)
    );
    console.log("inside the troops to defend");
    const input = document.getElementById("troops-input");
    console.log("troops to defend", input);

    const button = document.getElementById("submit-button");

    button.addEventListener("click", () => {
      myToast.hideToast();
      this.#eventbus.emit("sendDefenderTroops", parseInt(input.value));
    });
  }

  showTroopsToAttack() {
    const myToast = this.#createToast(
      this.#createAttackerTroopsHtml.bind(this)
    );
    const input = document.getElementById("troops-input");
    const button = document.getElementById("submit-button");

    button.addEventListener("click", () => {
      myToast.hideToast();
      this.#eventbus.emit("sendAttckerTroops", parseInt(input.value));
    });
  }
}
