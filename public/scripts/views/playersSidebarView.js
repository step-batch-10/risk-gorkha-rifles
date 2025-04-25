export default class PlayerSidebarView {
  #sidebar;
  #currentPlayer;
  #template = `<div class="avatar {{classname}}"><img style="border-color: {{colour}}" src="{{avatar}}"></div><div class="player-details"><p>{{username}}</p> </div>`;

  constructor(sidebarId) {
    this.#sidebar = document.getElementById(sidebarId);
  }

  #generatePlayerDetails(player, currentPlayer) {
    if (currentPlayer && currentPlayer !== "") {
      this.#currentPlayer = currentPlayer;
    }

    player.classname =
      this.#currentPlayer === player.id ? "current-player" : "";

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
    ele.style.background = "red !important";
    console.log(ele);
    ele.classList.add("current-player");
  }

  render(players, currentPlayer) {
    this.#clear();

    Object.values(players).forEach((player) => {
      const playerObj = this.#generatePlayerDetails(player, currentPlayer);
      this.#sidebar.appendChild(playerObj);
    });

    // if (currentPlayer) {
    //   this.#highlightCurrentPlayer(currentPlayer);
    // }
  }
}
