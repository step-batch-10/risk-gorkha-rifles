export default class ApiService {
  static async getGameDetails() {
    const response = await fetch('/game/game-board');

    return await response.json();
  }

  static async saveTroopsDeployment(territoryId, troopsCount) {    
    await fetch("/game/update-troops", {
      method: 'POST',
      body: JSON.stringify({ territory: territoryId, troops: troopsCount })
    });
  }
}