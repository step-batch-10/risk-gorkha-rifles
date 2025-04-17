const players = {
  1: {
    name: "Commander Red",
    powerCards: ["card_1", "card_3"],
    avatar:
      "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
  },
  2: {
    name: "General Blue",
    powerCards: ["card_2", "card_5"],
    avatar:
      "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
  },
  3: {
    name: "Captain Green",
    powerCards: ["card_4", "card_1"],
    avatar:
      "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
  },
};

const colors = {
  1: "blue",
  2: "black",
  3: "red",
};


export const generatePlayerDetails = (player) => {
  const template = `
  <div class="avatar">
  <img src="{{url}}">
  </div>
  <div class="player-details">
    <p>{{playerName}}</p>
  </div>
`;

  const data = { playerName: player.name, url: player.avatar };
  const output = Mustache.render(template, data);
  const ele = document.createElement("div");
  ele.innerHTML = output;

  return ele;
};

const allocatePlayers = (sideBar) => {
  Object.values(players).forEach((player) => {
    const playerObj = generatePlayerDetails(player);
    sideBar.appendChild(playerObj);
  });
};

const allocateTerritories = (territories) => {
  Object.keys(territories).forEach((territory) => {
    const domTrr = document.getElementById(territory);
    const troops = domTrr.querySelector("tspan");
    troops.innerHTML = territories[territory].troops;
    troops.style.fill = colors[territories[territory].owner];
  });
};

const continentAnimation = () => {
  let attacker = null;
  let defender = null;

  const territories = Array.from(document.getElementsByClassName("territory"));
  territories.forEach((territory) => {
    territory.addEventListener("click", (_e) => {
      const _map = document.getElementById("map");
      const fight = document.getElementById("fight");
      if (attacker === null) {
        fight.appendChild(territory);
        territory.classList.add("path-click");
        attacker = territory.id;
        return;
      }

      if (defender === null) {
        fight.appendChild(territory);
        territory.classList.add("path-click");
        defender = territory.id;
        document
          .getElementById("main-svg")
          .setAttribute("filter", "url(#blurMe)");
        return;
      }
    });
  });
};

const handleWaiting = (state) => {
  const popup = document.querySelector("#waiting-popup");
  popup.style.display = "block";
  const ul = document.querySelector("#players");
  ul.innerHTML = "";

  Object.values(state.players).map((playername) => {
    const list = document.createElement("li");
    list.textContent = playername;
    ul.appendChild(list);
  });
};

const getData = async () => {
  const response = await fetch("/game/game-board");

  return await response.json();
};

globalThis.onload = () => {
  setInterval(async () => {
    const resp = await getData();
    if (resp.status === "waiting") {
      handleWaiting(resp.state);
      return;
    }
    
    const popup = document.querySelector("#waiting-popup");
    popup.style.display = "none";
    allocateTerritories(resp.state.territories);

  }, 1000);

  const sideBar = document.getElementById("side-bar-left");

  allocatePlayers(sideBar);
  // allocateTerritories(territories);
  continentAnimation(); //extra
};
