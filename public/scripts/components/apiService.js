export default class ApiService {
  static async getGameDetails(timestamp) {
    const response = await fetch(`/game/actions?since=${timestamp}`);
    return await response.json();
  }

  static async saveTroopsDeployment(territoryId, troopsCount) {
    await fetch("/game/update-troops", {
      method: "POST",
      body: JSON.stringify({
        territory: territoryId,
        troopCount: parseInt(troopsCount),
      }),
    });

    await fetch("/game/start-game");
  }

  static async requestReinforcement() {
    const reinforcementResponse = await fetch("/game/request-reinforcement");
    const responseData = await reinforcementResponse.json();

    return responseData;
  }

  static async getCards() {
    const response = await fetch("/game/cards");

    return await response.json();
  }

  static async requestAttack() {
    const attackResponse = await fetch("/game/request-attack");
    const responseData = await attackResponse.json();

    return responseData.attackingTerritories;
  }

  static async defendingTerritories(attackingTerritoryId) {
    const attackResponse = await fetch("/game/request-defendTerritories", {
      method: "POST",
      body: JSON.stringify({ attackingTerritoryId }),
    });

    const responseData = await attackResponse.json();

    return responseData.defendingTerritories;
  }

  static async defendingPlayer(defendingTerritory) {
    const response = await fetch("/game/request-defendingPlayer", {
      method: "POST",
      body: JSON.stringify({ defendingTerritory }),
    });

    const responseData = await response.json();

    return responseData.defendingPlayer;
  }

  static async sendRequestToDefender(defenderId) {
    document.cookie = `sessionId=${defenderId}; path=/`;

    const response = await fetch("/game/request-opponentRequest", {
      method: "POST",
      body: JSON.stringify({ defenderId, isOpponent: true }),
    });

    return response.message;
  }

  static async connectedTerritories(territoryId) {
    const response = await fetch(`/game/connected-territories?territoryId=${territoryId}`)

    return await response.json();
  }
}
