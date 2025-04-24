const mockedData = {
  initialDeploymentStart: {
    status: "running",
    userId: "1",
    players: [
      {
        id: "1",
        username: "siya",
        colour: "red",
        avatar:
          "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
      },
      {
        id: "2",
        username: "shikha",
        colour: "green",
        avatar:
          "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
      },
    ],
    actions: [
      {
        id: "1",
        name: "intialDeploymentStart",
        playerId: null,
        currentPlayerTurn: null,
        data: {
          troopsCount: 11
        },
        timestamp: Date.now(),
        territoryState: {
          india: {
            troops: 23,
            owner: "1",
          },
          china: {
            troops: 99,
            owner: "2",
          },
        },
      },
    ],
  },
  waiting: {
    status: "waiting",
    userId: "1",
    players: [
      {
        id: "1",
        username: "siya",
        colour: "red",
        avatar:
          "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
      },
      {
        id: "2",
        username: "shikha",
        colour: "green",
        avatar:
          "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
      },
    ],
    actions: [
      {
        id: "1",
        name: "intialDeploymentStart",
        playerId: null,
        currentPlayerTurn: "2",
        data: {
          troopsCount: 11
        },
        timestamp: Date.now(),
        territoryState: {
          india: {
            troops: 23,
            owner: "1",
          },
          china: {
            troops: 99,
            owner: "1",
          },
        },
      },
    ],
  },
  troopDeployment: {
    status: "running",
    userId: "1",
    players: [
      {
        id: "1",
        username: "siya",
        colour: "red",
        avatar:
          "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
      },
      {
        id: "2",
        username: "shikha",
        colour: "green",
        avatar:
          "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
      },
    ],
    actions: [
      {
        id: "1",
        name: "intialDeploymentStart",
        playerId: null,
        currentPlayerTurn: null,
        data: {
          troopsCount: 11
        },
        timestamp: Date.now(),
        territoryState: {
          india: {
            troops: 23,
            owner: "1",
          },
          china: {
            troops: 99,
            owner: "2",
          },
        },
      },
      {
        id: "2",
        name: "troopDeployment",
        playerId: "1",
        currentPlayerTurn: null,
        data: {
          territory: "india",
          troopsCount: 5
        },
        timestamp: Date.now(),
        territoryState: {
          india: {
            troops: 23,
            owner: "1",
          },
          china: {
            troops: 99,
            owner: "2",
          },
        },
      },
      {
        id: "3",
        name: "troopDeployment",
        playerId: "2",
        currentPlayerTurn: null,
        data: {
          territory: "china",
          troopsCount: 10
        },
        timestamp: Date.now(),
        territoryState: {
          india: {
            troops: 23,
            owner: "1",
          },
          china: {
            troops: 99,
            owner: "2",
          },
        },
      },
    ],
  },
  initialDeploymentStop: {
    status: "running",
    userId: "1",
    players: [
      {
        id: "1",
        username: "siya",
        colour: "red",
        avatar:
          "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
      },
      {
        id: "2",
        username: "shikha",
        colour: "green",
        avatar:
          "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
      },
    ],
    actions: [
      {
        id: "1",
        name: "intialDeploymentStart",
        playerId: null,
        currentPlayerTurn: null,
        data: {
          troopsCount: 11
        },
        timestamp: Date.now(),
        territoryState: {
          india: {
            troops: 23,
            owner: "1",
          },
          china: {
            troops: 99,
            owner: "2",
          },
        },
      },
      {
        id: "2",
        name: "troopDeployment",
        playerId: "1",
        currentPlayerTurn: null,
        data: {
          territory: "india",
          troopsCount: 5
        },
        timestamp: Date.now(),
        territoryState: {
          india: {
            troops: 23,
            owner: "1",
          },
          china: {
            troops: 99,
            owner: "2",
          },
        },
      },
      {
        id: "3",
        name: "troopDeployment",
        playerId: "2",
        currentPlayerTurn: null,
        data: {
          territory: "china",
          troopsCount: 10
        },
        timestamp: Date.now(),
        territoryState: {
          india: {
            troops: 23,
            owner: "1",
          },
          china: {
            troops: 99,
            owner: "2",
          },
        },
      },
      {
        id: "4",
        name: "intialDeploymentStop",
        playerId: null,
        currentPlayerTurn: null,
        data: null,
        timestamp: Date.now(),
        territoryState: {
          india: {
            troops: 23,
            owner: "1",
          },
          china: {
            troops: 99,
            owner: "2",
          },
        },
      },
    ],
  },
  startGame: {
    status: "running",
    userId: "1",
    players: [
      {
        id: "1",
        username: "siya",
        colour: "red",
        avatar:
          "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
      },
      {
        id: "2",
        username: "shikha",
        colour: "green",
        avatar:
          "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
      },
    ],
    actions: [
      {
        id: "1",
        name: "intialDeploymentStart",
        playerId: null,
        currentPlayerTurn: null,
        data: {
          troopsCount: 11
        },
        timestamp: Date.now(),
        territoryState: {
          india: {
            troops: 23,
            owner: "1",
          },
          china: {
            troops: 99,
            owner: "2",
          },
        },
      },
      {
        id: "2",
        name: "troopDeployment",
        playerId: "1",
        currentPlayerTurn: null,
        data: {
          territory: "india",
          troopsCount: 5
        },
        timestamp: Date.now(),
        territoryState: {
          india: {
            troops: 23,
            owner: "1",
          },
          china: {
            troops: 99,
            owner: "2",
          },
        },
      },
      {
        id: "3",
        name: "troopDeployment",
        playerId: "2",
        currentPlayerTurn: null,
        data: {
          territory: "china",
          troopsCount: 10
        },
        timestamp: Date.now(),
        territoryState: {
          india: {
            troops: 23,
            owner: "1",
          },
          china: {
            troops: 99,
            owner: "2",
          },
        },
      },
      {
        id: "4",
        name: "intialDeploymentStop",
        playerId: null,
        currentPlayerTurn: null,
        data: null,
        timestamp: Date.now(),
        territoryState: {
          india: {
            troops: 23,
            owner: "1",
          },
          china: {
            troops: 99,
            owner: "2",
          },
        },
      },
      {
        id: "5",
        name: "startGame",
        playerId: null,
        currentPlayerTurn: null,
        data: null,
        timestamp: Date.now(),
        territoryState: {
          india: {
            troops: 23,
            owner: "1",
          },
          china: {
            troops: 99,
            owner: "2",
          },
        },
      },
    ],
  },
  reinforcementPhase: {
    status: "running",
    userId: "1",
    players: [
      {
        id: "1",
        username: "siya",
        colour: "red",
        avatar:
          "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
      },
      {
        id: "2",
        username: "shikha",
        colour: "green",
        avatar:
          "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
      },
    ],
    actions: [
      {
        id: "6",
        name: "reinforcementPhase",
        playerId: null,
        currentPlayerTurn: "2",
        data: null,
        timestamp: Date.now(),
        territoryState: {
          india: {
            troops: 23,
            owner: "1",
          },
          china: {
            troops: 99,
            owner: "2",
          },
        },
      },
    ],
  },
  attackPhaseStart: {
    status: "running",
    userId: "1",
    players: [
      {
        id: "1",
        username: "siya",
        colour: "red",
        avatar:
          "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
      },
      {
        id: "2",
        username: "shikha",
        colour: "green",
        avatar:
          "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740",
      },
    ],
    actions: [
      {
        id: "1",
        name: "attackPhaseStart",
        playerId: "2",
        currentPlayerTurn: "2",
        timestamp: Date.now(),
        territoryState: {
          china: {
            troops: 99,
            owner: "2",
          },
          india: {
            troops: 23,
            owner: "1",
          },
          siam: {
            troops: 1,
            owner: "2"
          }
        },
      }
    ],
  }
};

export default class ApiService {
  static async getGameDetails() {
    // return mockedData.reinforcementPhase;
    const response = await fetch("/game/actions?since=");
    return await response.json();
  }

  static async saveTroopsDeployment(territoryId, troopsCount) {
    await fetch("/game/update-troops", {
      method: "POST",
      body: JSON.stringify({
        territory: territoryId,
        troops: parseInt(troopsCount),
      }),
    });
  }

  static requestReinforcement() {
    return 20;
    // const reinforcementResponse = await fetch('/game/request-reinforcement');
    // const responseData = await reinforcementResponse.json();

    // return responseData.troopsCount;
  }

  static requestAttack() {

    // const attackResponse = await fetch('/game/request-attack');
    // const responseData = await attackResponse.json();

    return [
      "china",
      "siam", "india"
    ];
  }

  static defendingTerritories(attackingTerritoryId) {
    return ['mongolia', 'afghanistan', 'japan', 'peru', 'argentina'];
  }
}
