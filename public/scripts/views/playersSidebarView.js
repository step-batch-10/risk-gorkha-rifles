export default class PlayerSidebarView {
  #sidebar;
  #template = `<div class="avatar"><img style="border-color: {{colour}}" src="{{avatar}}"></div><div class="player-details"><p>{{username}}</p> </div>`;

  constructor(sidebarId) {
    this.#sidebar = document.getElementById(sidebarId);
  }

  #generatePlayerDetails(player) {
    const output = Mustache.render(this.#template, player);
    const ele = document.createElement('div');
    ele.innerHTML = output;

    return ele;
  };

  #clear() {
    this.#sidebar.innerHTML = "";
  }

  render(players) {
    this.#clear();
    Object.values(players).forEach((player) => {
      const playerObj = this.#generatePlayerDetails(player);
      this.#sidebar.appendChild(playerObj);
    });
  }
}