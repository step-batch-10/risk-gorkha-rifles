export default class ApiService {
  static async getGameDetails() {
    // return mockedData.reinforcementPhase;
    const response = await fetch("/game/game-board?since=");

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
}
