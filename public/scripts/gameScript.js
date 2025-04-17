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

const territories = {
  alaska: {
    owner: 2,
    troopsCount: 7,
    borders: ["kamchatka", "northwestTerritory", "alberta"],
  },
  "north-west-territory": {
    owner: 2,
    troopsCount: 6,
    borders: ["alaska", "alberta", "ontario", "greenland"],
  },
  greenland: {
    owner: 1,
    troopsCount: 3,
    borders: ["northwestTerritory", "ontario", "quebec", "iceland"],
  },
  alberta: {
    owner: 3,
    troopsCount: 4,
    borders: ["alaska", "northwestTerritory", "ontario", "westernUS"],
  },
  ontario: {
    owner: 1,
    troopsCount: 4,
    borders: [
      "northwestTerritory",
      "alberta",
      "westernUS",
      "easternUS",
      "quebec",
      "greenland",
    ],
  },
  quebec: {
    owner: 2,
    troopsCount: 10,
    borders: ["ontario", "greenland", "easternUS"],
  },
  "western-us": {
    owner: 1,
    troopsCount: 9,
    borders: ["alberta", "ontario", "easternUS", "centralAmerica"],
  },
  "eastern-us": {
    owner: 1,
    troopsCount: 1,
    borders: ["westernUS", "ontario", "quebec", "centralAmerica"],
  },
  "central-america": {
    owner: 3,
    troopsCount: 10,
    borders: ["westernUS", "easternUS", "venezuela"],
  },
  venezuela: {
    owner: 2,
    troopsCount: 7,
    borders: ["centralAmerica", "brazil", "peru"],
  },
  brazil: {
    owner: 2,
    troopsCount: 1,
    borders: ["venezuela", "peru", "argentina", "northAfrica"],
  },
  peru: {
    owner: 2,
    troopsCount: 5,
    borders: ["venezuela", "brazil", "argentina"],
  },
  argentina: { owner: 3, troopsCount: 6, borders: ["peru", "brazil"] },
  iceland: {
    owner: 1,
    troopsCount: 7,
    borders: ["greenland", "greatBritain", "scandinavia"],
  },
  scandinavia: {
    owner: 2,
    troopsCount: 5,
    borders: ["iceland", "ukraine", "northernEurope"],
  },
  ukraine: {
    owner: 1,
    troopsCount: 9,
    borders: [
      "scandinavia",
      "ural",
      "afghanistan",
      "middleEast",
      "southernEurope",
      "northernEurope",
    ],
  },
  "great-britain": {
    owner: 1,
    troopsCount: 5,
    borders: ["iceland", "northernEurope", "westernEurope", "scandinavia"],
  },
  "northern-europe": {
    owner: 1,
    troopsCount: 5,
    borders: [
      "greatBritain",
      "scandinavia",
      "ukraine",
      "southernEurope",
      "westernEurope",
    ],
  },
  "western-europe": {
    owner: 3,
    troopsCount: 9,
    borders: [
      "northernEurope",
      "southernEurope",
      "northAfrica",
      "greatBritain",
    ],
  },
  "southern-europe": {
    owner: 2,
    troopsCount: 1,
    borders: [
      "westernEurope",
      "northernEurope",
      "ukraine",
      "middleEast",
      "egypt",
      "northAfrica",
    ],
  },
  "north-africa": {
    owner: 3,
    troopsCount: 4,
    borders: [
      "brazil",
      "westernEurope",
      "southernEurope",
      "egypt",
      "eastAfrica",
      "congo",
    ],
  },
  egypt: {
    owner: 2,
    troopsCount: 3,
    borders: ["southernEurope", "northAfrica", "eastAfrica", "middleEast"],
  },
  "east-africa": {
    owner: 2,
    troopsCount: 3,
    borders: [
      "egypt",
      "northAfrica",
      "congo",
      "southAfrica",
      "madagascar",
      "middleEast",
    ],
  },
  congo: {
    owner: 3,
    troopsCount: 6,
    borders: ["northAfrica", "eastAfrica", "southAfrica"],
  },
  "south-africa": {
    owner: 1,
    troopsCount: 1,
    borders: ["congo", "eastAfrica", "madagascar"],
  },
  madagascar: {
    owner: 3,
    troopsCount: 5,
    borders: ["eastAfrica", "southAfrica"],
  },
  "middle-east": {
    owner: 2,
    troopsCount: 5,
    borders: [
      "ukraine",
      "afghanistan",
      "india",
      "eastAfrica",
      "egypt",
      "southernEurope",
    ],
  },
  afghanistan: {
    owner: 3,
    troopsCount: 1,
    borders: ["ural", "ukraine", "middleEast", "india", "china"],
  },
  ural: {
    owner: 3,
    troopsCount: 2,
    borders: ["ukraine", "siberia", "china", "afghanistan"],
  },
  siberia: {
    owner: 1,
    troopsCount: 9,
    borders: ["ural", "yakutsk", "irkutsk", "mongolia", "china"],
  },
  yakutsk: {
    owner: 2,
    troopsCount: 7,
    borders: ["siberia", "kamchatka", "irkutsk"],
  },
  kamchatka: {
    owner: 1,
    troopsCount: 1,
    borders: ["yakutsk", "irkutsk", "mongolia", "japan", "alaska"],
  },
  irkutsk: {
    owner: 2,
    troopsCount: 5,
    borders: ["siberia", "yakutsk", "kamchatka", "mongolia"],
  },
  mongolia: {
    owner: 1,
    troopsCount: 9,
    borders: ["irkutsk", "kamchatka", "china", "japan", "siberia"],
  },
  china: {
    owner: 2,
    troopsCount: 6,
    borders: ["mongolia", "siberia", "ural", "afghanistan", "india", "siam"],
  },
  india: {
    owner: 3,
    troopsCount: 6,
    borders: ["middleEast", "china", "afghanistan", "siam"],
  },
  siam: { owner: 2, troopsCount: 7, borders: ["india", "china", "indonesia"] },
  indonesia: {
    owner: 1,
    troopsCount: 6,
    borders: ["siam", "newGuinea", "westernAustralia"],
  },
  "new-guinea": {
    owner: 1,
    troopsCount: 9,
    borders: ["indonesia", "easternAustralia", "westernAustralia"],
  },
  "western-australia": {
    owner: 1,
    troopsCount: 4,
    borders: ["indonesia", "newGuinea", "easternAustralia"],
  },
  "eastern-australia": {
    owner: 1,
    troopsCount: 4,
    borders: ["newGuinea", "westernAustralia"],
  },
  japan: { owner: 3, troopsCount: 10, borders: ["mongolia", "kamchatka"] },
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
    troops.innerHTML = territories[territory].troopsCount;
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

const handleWaiting = (resp) => {
  const popup = document.querySelector("#waiting-popup");
  popup.style.display = "block";
  const ul = document.querySelector("#players");

  resp.players.forEach((player) => {
    const list = document.createElement("li");
    list.textContent = player;
    ul.appendChild(list);
  });
};

globalThis.onload = () => {
  const resp = {
    status: "running",
    players: ["Ankita", "Sujoy", "Priyankush"],
  };

  if (resp.status === "waiting") {
    handleWaiting(resp);
  }

  const sideBar = document.getElementById("side-bar-left");

  allocatePlayers(sideBar);
  allocateTerritories(territories);
  continentAnimation(); //extra
};
