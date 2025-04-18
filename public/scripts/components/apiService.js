export default class ApiService {
  static getGameDetails() {
    // const response = await fetch('/game/game-board');

    // return await response.json();

    return {
      status: "running",
      state: {
        players: []
      }
    }
  }
}