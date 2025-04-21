export default class WaitingModal {
  #modal;

  constructor(modelId) {
    this.#modal = document.getElementById(modelId);
  }

  show() {
    this.#modal.style.display = "block";
  }

  hide() {
    this.#modal.style.display = "none";
  }

  #clear(elem) {
    return elem.innerHTML = "";
  }

  #renderPlayers(players = [], playersElem) {
    players.map(({ name }) => {
      const list = document.createElement('li');
      list.textContent = name;
      playersElem.appendChild(list);
    });
  }

  render(players) {
    this.show();
    const playersElem = this.#modal.querySelector("#players");
    this.#clear(playersElem);
    this.#renderPlayers(players, playersElem);
  }
}