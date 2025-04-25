export default class PlayerSidebarView {
  #sidebar;
  #template = `<div class="avatar"><img style="border-color: {{colour}}" src="{{avatar}}"></div><div class="player-details"><p>{{username}}</p> </div>`;

  constructor(sidebarId) {
    this.#sidebar = document.getElementById(sidebarId);
  }

  #generatePlayerDetails(player) {
    const output = Mustache.render(this.#template, player);
    const ele = document.createElement("div");
    ele.id = player.id;
    ele.innerHTML = output;

    return ele;
  }

  #clear() {
    this.#sidebar.innerHTML = "";
  }

  #highlightCurrentPlayer(currentPlayer) {
    const ele = document.getElementById(currentPlayer);
    ele.style.backgroundColor = "red";
  }

  render(players, currentPlayer) {
    this.#clear();
    this.#highlightCurrentPlayer(currentPlayer);

    Object.values(players).forEach((player) => {
      const playerObj = this.#generatePlayerDetails(player);
      this.#sidebar.appendChild(playerObj);
    });
  }
}
