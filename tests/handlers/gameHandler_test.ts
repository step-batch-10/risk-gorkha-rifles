import { assertEquals } from 'assert';
import { beforeEach, describe, it } from 'testing';
import Server from '../../src/server.ts';
import Users from '../../src/models/users.ts';
import Session from '../../src/models/session.ts';
import { gameManagerInstanceBuilder } from '../models/gameManager_test.ts';
import { AllotStatus } from '../../src/types/gameTypes.ts';

let uniqueId = () => {
  let i = 1;
  return () => (i++).toString();
};

export const createServerWithLoggedInUser = (
  username: string,
  uniqueIdGenerator = uniqueId
) => {
  const session = new Session(uniqueIdGenerator());
  const users = new Users(uniqueIdGenerator());
  const gameManager = gameManagerInstanceBuilder();
  const sessionId = '1';

  session.createSession(sessionId);
  users.createUser(username, 'url');

  const server = new Server(users, session, gameManager, uniqueIdGenerator());
  server.serve();

  return {
    app: server.getApp,
    sessionId,
    gameManager,
    users,
    session,
  };
};

describe('getGameActions', () => {
  beforeEach(() => {
    uniqueId = () => {
      let i = 1;
      return () => (i++).toString();
    };
  });
  it('should return all the actions that happened after the timeStamp', async () => {
    const { app, sessionId, gameManager, users } =
      createServerWithLoggedInUser('Jack');
    users.createUser('2', 'url');
    users.createUser('3', 'url');

    gameManager.allotPlayer('1', '3');
    gameManager.allotPlayer('2', '3');
    gameManager.allotPlayer('3', '3');

    const response = await app.request('/game/actions?since=0', {
      method: 'GET',
      headers: {
        Cookie: `sessionId=${sessionId}`,
      },
    });

    const players = [
      {
        avatar: 'url',
        username: 'Jack',
      },
      {
        avatar: 'url',
        username: '2',
      },
      {
        avatar: 'url',
        username: '3',
      },
    ];

    const expected = {
      actions: [
        {
          currentPlayer: '',
          data: {
            initialState: {
              '1': {
                availableTroops: 21,
                cards: [],
                continents: [],
                territories: ['India'],
              },
              '2': {
                availableTroops: 21,
                cards: [],
                continents: [],
                territories: [],
              },
              '3': {
                availableTroops: 21,
                cards: [],
                continents: [],
                territories: [],
              },
            },
          },
          id: '1',
          name: 'startInitialDeployment',
          playerId: null,
          playerStates: {
            '1': {
              availableTroops: 21,
              cards: [],
              continents: [],
              territories: ['India'],
            },
            '2': {
              availableTroops: 21,
              cards: [],
              continents: [],
              territories: [],
            },
            '3': {
              availableTroops: 21,
              cards: [],
              continents: [],
              territories: [],
            },
          },
          territoryState: {
            India: {
              owner: '1',
              troops: 1,
            },
          },
          timeStamp: 1,
        },
      ],
      currentPlayer: '1',
      players,
      status: 'running',
    };
    const actual = await response.json();

    assertEquals(response.status, 200);
    assertEquals(actual, expected);
  });
});

describe('tests for joinGame Handler', () => {
  beforeEach(() => {
    uniqueId = () => {
      let i = 1;
      return () => (i++).toString();
    };
  });
  it('should not allot the game for unauthorized user', async () => {
    const { app } = createServerWithLoggedInUser('Rose');
    const response = await app.request('/game/join-game', {
      method: 'POST',
    });

    assertEquals(response.status, 302);
  });

  it('should allot the game to the user', async () => {
    const { app, sessionId } = createServerWithLoggedInUser('Jack');

    const response = await app.request('/game/join-game', {
      method: 'POST',
      headers: {
        Cookie: `sessionId=${sessionId}`,
      },
    });

    assertEquals(response.status, 302);
    assertEquals(response.headers.get('location'), '/game/waiting.html');
  });
});

describe('lobbyHandler test', () => {
  beforeEach(() => {
    uniqueId = () => {
      let i = 1;
      return () => (i++).toString();
    };
  });
  it('should return waiting status and player when player is in waiting lobby', async () => {
    const { app, gameManager } = createServerWithLoggedInUser('gour');
    gameManager.allotPlayer('1', '3');

    const response = await app.request('/game/lobby-status', {
      method: 'GET',
      headers: {
        Cookie: `sessionId=1`,
      },
    });

    const expected = {
      status: AllotStatus.waitingLobby,
      players: [{ username: 'gour', avatar: 'url' }],
    };

    assertEquals(await response.json(), expected);
  });

  it('should return running status and player when player is not in waiting lobby', async () => {
    const { app, gameManager, users } = createServerWithLoggedInUser('gour');
    gameManager.allotPlayer('1', '3');
    users.createUser('pirate', 'url2');
    users.createUser('cowboy', 'url3');
    gameManager.allotPlayer('2', '3');
    gameManager.allotPlayer('3', '3');

    const response = await app.request('/game/lobby-status', {
      method: 'GET',
      headers: {
        Cookie: `sessionId=1`,
      },
    });
    const expected = {
      status: AllotStatus.gameRoom,
      players: [],
    };

    assertEquals(await response.json(), expected);
  });

  it('should return waiting status and player when player is  in waiting lobby', async () => {
    const { app, gameManager, users, session } =
      createServerWithLoggedInUser('gour');
    gameManager.allotPlayer('1', '3');
    users.createUser('pirate', 'url2');
    users.createUser('cowboy', 'url3');
    users.createUser('dinesh', 'url4');
    session.createSession('4');
    gameManager.allotPlayer('2', '3');
    gameManager.allotPlayer('3', '3');
    gameManager.allotPlayer('4', '3');

    const response = await app.request('/game/lobby-status', {
      method: 'GET',
      headers: {
        Cookie: `sessionId=2`,
      },
    });
    const expected = {
      status: AllotStatus.waitingLobby,
      players: [{ username: 'dinesh', avatar: 'url4' }],
    };

    assertEquals(await response.json(), expected);
  });
});

describe('fullProfileDetailsHandler', () => {
  it('should return full profile details', async () => {
    const { app } = createServerWithLoggedInUser('Jack');

    const response = await app.request('/game/player-full-profile', {
      method: 'GET',
      headers: {
        Cookie: `sessionId=1`,
      },
    });

    const actual = await response.json();

    const expected = {
      username: 'Jack',
      avatar: 'url',
      matchesPlayed: 0,
      matchesWon: 0,
    };

    assertEquals(actual, expected);
  });
});

describe('profileDetailsHandler', () => {
  it('should return full profile details', async () => {
    const { app } = createServerWithLoggedInUser('Jack');

    const response = await app.request('/game/profile-details', {
      method: 'GET',
      headers: {
        Cookie: `sessionId=1`,
      },
    });

    const actual = await response.json();

    const expected = {
      username: 'Jack',
      avatar: 'url',
    };

    assertEquals(actual, expected);
  });
});

describe('update troop handler', () => {
  it('should return the updated territory details and player state', async () => {
    const { app, gameManager, sessionId } =
      createServerWithLoggedInUser('Jack');
    gameManager.allotPlayer('1', '3');
    gameManager.allotPlayer('2', '3');
    gameManager.allotPlayer('3', '3');

    const response = await app.request('/game/update-troops', {
      method: 'POST',
      headers: {
        Cookie: `sessionId=${sessionId}`,
      },
      body: JSON.stringify({ territoryId: 'India', troopCount: 10 }),
    });

    const actual = await response.json();

    const expected = {
      territory: { owner: '1', troops: 11 },
      player: {
        territories: ['India'],
        continents: [],
        availableTroops: 11,
        cards: [],
      },
    };

    assertEquals(actual, expected);
  });
});

describe('requestReinforcementHandler', () => {
  it('should return the player territories', async () => {
    const { app, gameManager } = createServerWithLoggedInUser("Jack");
    gameManager.allotPlayer("1", "3");
    gameManager.allotPlayer("2", "3");
    gameManager.allotPlayer("3", "3");

    const response = await app.request("/game/request-reinforcement", {
      method: "GET",
      headers: {
        Cookie: `sessionId=1`,
      },
    });

    assertEquals(await response.json(), ["India"]);
  });
});
