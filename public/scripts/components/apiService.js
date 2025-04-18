export default class ApiService {
  static async getGameDetails() {
    const response = await fetch('/game/game-board');

    return await response.json();
  }
}