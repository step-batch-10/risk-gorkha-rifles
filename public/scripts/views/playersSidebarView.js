export default class PlayerSidebarView {
  #sidebar;
  #currentPlayer;
  #template = `<div class="player-card {{classname}}"><div class="avatar"><img style="border-color: {{colour}}" src="{{avatar}}"></div><div class="player-details"><p>{{username}}</p> </div></div>`;

  constructor(sidebarId) {
    this.#sidebar = document.getElementById(sidebarId);
  }

  #generatePlayerDetails(player, currentPlayer) {
    if (currentPlayer && currentPlayer !== "") {
      this.#currentPlayer = currentPlayer;
    }

    const isPlayerCurrent = this.#currentPlayer === player.id;
    player.classname = isPlayerCurrent ? "current-player" : "";
    const output = Mustache.render(this.#template, player);

    const ele = document.createElement("div");
    ele.id = player.id;
    ele.innerHTML = output;

    return ele;
  }

  #clear() {
    this.#sidebar.innerHTML = "";
  }

  render(players, currentPlayer) {
    if (this.#currentPlayer || this.#currentPlayer === currentPlayer) {
      return;
    }

    this.#clear();

    Object.values(players).forEach((player) => {
      const playerObj = this.#generatePlayerDetails(player, currentPlayer);
      this.#sidebar.appendChild(playerObj);
    });
  }
}
