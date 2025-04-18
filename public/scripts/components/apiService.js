export default class ApiService {
  static getGameDetails() {
    // const response = await fetch('/game/game-board');

    // return await response.json();

    return {
      status: "running",
      state: {
        players: {
          "1": {
            id: "1",
            name: "siya",
            color: "#fff"
          },
          "2": {
            id: "2",
            name: "shikha",
            color: "#000"
          }
        },
        territories: {
          "india": {
            troops: 23,
            owner: "1"
          },
          "china": {
            troops: 99,
            owner: "2"
          }
        }
      }
    };
  }
}