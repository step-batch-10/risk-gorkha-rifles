const players = {
  1: {
    name: 'Commander Red',
    powerCards: ['card_1', 'card_3'],
    avatar:
      'https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740',
  },
  2: {
    name: 'General Blue',
    powerCards: ['card_2', 'card_5'],
    avatar:
      'https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740',
  },
  3: {
    name: 'Captain Green',
    powerCards: ['card_4', 'card_1'],
    avatar:
      'https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740',
  },
};

const colors = {
  1: 'blue',
  2: 'black',
  3: 'red',
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
  const ele = document.createElement('div');
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
    const troops = domTrr.querySelector('tspan');
    troops.innerHTML = territories[territory].troops;
    troops.style.fill = colors[territories[territory].owner];
  });
};

const continentAnimation = () => {
  let attacker = null;
  let defender = null;

  const territories = Array.from(document.getElementsByClassName('territory'));
  territories.forEach((territory) => {
    territory.addEventListener('click', (_e) => {
      const _map = document.getElementById('map');
      const fight = document.getElementById('fight');
      if (attacker === null) {
        fight.appendChild(territory);
        territory.classList.add('path-click');
        attacker = territory.id;
        return;
      }

      if (defender === null) {
        fight.appendChild(territory);
        territory.classList.add('path-click');
        defender = territory.id;
        document
          .getElementById('main-svg')
          .setAttribute('filter', 'url(#blurMe)');
        return;
      }
    });
  });
};

const handleWaiting = (state) => {
  const popup = document.querySelector('#waiting-popup');
  popup.style.display = 'block';
  const ul = document.querySelector('#players');
  ul.innerHTML = '';

  Object.values(state.players).map((playername) => {
    const list = document.createElement('li');
    list.textContent = playername;
    ul.appendChild(list);
  });
};

const getData = async () => {
  const response = await fetch('/game/game-board');

  return await response.json();
};

globalThis.onload = () => {
  setInterval(async () => {
    const resp = await getData();
    if (resp.status === 'waiting') {
      handleWaiting(resp.state);
      return;
    }

    const popup = document.querySelector('#waiting-popup');
    popup.style.display = 'none';
    allocateTerritories(resp.state.territories);
    reinforceTroops(resp.state.territories);
  }, 1000);

  const sideBar = document.getElementById('side-bar-left');

  allocatePlayers(sideBar);
  allocateTerritories(territories);
  continentAnimation(); //extra
};

const turn = { currentPlayer: 1, state: 'reinforcement' };

const showTroopToast = () => {
  const input = document.getElementById('number-input');
  const placeBtn = document.getElementById('place-troops-btn');
  const incBtn = document.getElementById('increment');
  const decBtn = document.getElementById('decrement');
  
  const playerColors = {
    1: '#e63946',
    2: '#457b9d',
    3: '#6a4c93',
    4: '#2a9d8f',
  };
  const toastHTML = `
    <div id="troop-toast-box">
      <div class="custom-number-input">
        <button id="decrement">-</button>
        <input type="number" id="number-input" value="0" min="0" max="100" />
        <button id="increment">+</button>
      </div>
      <button id="place-troops-btn">Place</button>
    </div>
  `;

  const toast = Toastify({
    text: toastHTML,
    duration: 10000,
    escapeMarkup: false,
    close: false,
    gravity: 'bottom',
    position: 'right',
    style: {
      height: '20%',
      width: '40%',
      background: 'rgba(200,170,140,0.5)',
      color: '#000',
      padding: '26px',
    },
  });

  toast.showToast();

  setTimeout(() => {

    const color = playerColors[turn.currentPlayer];
    placeBtn.style.backgroundColor = color;
    placeBtn.style.color = '#fff';

    placeBtn?.addEventListener('click', () => {
      console.log('Troops placed:', input.value);
      toast.hideToast();
    });

    incBtn?.addEventListener('click', () => input.stepUp());
    decBtn?.addEventListener('click', () => input.stepDown());
  }, 100);
};

const verifyOwnerAndState = (territories, territoryId) => {
  return (e) => {
    // const territoryId = e.target.parentElement.id;
    // const { currentPlayer, state } = turn;

    if (
      territories[territoryId].owner === currentPlayer &&
      state === 'reinforcement'
    ) {
      showTroopToast();
    }
  };
};

function reinforceTroops(territories) {
  Object.keys(territories).forEach((territory) => {
    const region = document.getElementById(territory);
    region.addEventListener('click', verifyOwnerAndState(territories, territory));
  });
}
