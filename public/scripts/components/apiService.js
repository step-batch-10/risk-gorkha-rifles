export default class ApiService {
  static async getGameDetails() {
    const response = await fetch('/game/game-board');

    return await response.json();

    // return {
    //   status: "running",
    //   currentPlayer: "1",
    //   state: {
    //     action: {
    //       name: "initialDeployment",
    //     },
    //     players: {
    //       "1": {
    //         id: "1",
    //         name: "siya",
    //         colour: "red",
    //         avatar: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740"
    //       },
    //       "2": {
    //         id: "2",
    //         name: "shikha",
    //         colour: "green",
    //         avatar: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740"
    //       }
    //     },
    //     territories: {
    //       "india": {
    //         troops: 23,
    //         owner: "1"
    //       },
    //       "china": {
    //         troops: 99,
    //         owner: "2"
    //       }
    //     }
    //   }
    // };
  }

  static async saveTroopsDeployment(territoryId, troopsCount) {
    await fetch("/game/update-troops", {
      method: 'POST',
      body: JSON.stringify({ territory: territoryId, troops: parseInt(troopsCount) })
    });
  }
}