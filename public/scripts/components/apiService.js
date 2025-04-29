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

  static async troopsToAttack(troops) {
    const response = await fetch("/game/troops-to-attack", {
      method: "POST",
      body: JSON.stringify({ troops }),
    });
    return response;
  }

  static async connectedTerritories(territoryId) {
    const response = await fetch(
      `/game/connected-territories?territoryId=${territoryId}`
    );

    return await response.json();
  }

  static async troopsToDefend(troops) {

    const response = await fetch("/game/troops-to-defend", {
      method: "POST",
      body: JSON.stringify({ troops }),
    });
    return response;
  }

  static async fortification(fortificationDetails) {
    await fetch("/game/fortification", {
      method: "POST",
      body: JSON.stringify(fortificationDetails),
    });
  }

  static async startFortification() {
    await fetch("/game/start-fortification");
  }

  static async getGamePlayers() {
    try {
      const response = await fetch("/game/players");

      return await response.json();
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  static async fetchMessages(since) {
    try {
      const response = await fetch(`/game/messages?since=${since}`);

      return await response.json();
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  static async sendMessages(message, recipientId) {
    await fetch("/game/messages", {
      method: "POST",
      body: JSON.stringify({ message, recipientId }),
    });
  }
}
