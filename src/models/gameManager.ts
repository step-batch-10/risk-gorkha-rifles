import Game, { ActionDetails } from "./game.ts";
import { Continent, GameStatus, LobbyStatus } from "../types/gameTypes.ts";
import lodash from "npm:lodash";
import { Action } from "./game.ts";
import { ActionTypes } from "../types/gameTypes.ts";

export default class GameManager {
  private shuffler: (ar: string[]) => string[];
  private gameSessions: Record<string, string> = {};
  private games: Game[] = [];
  private waitingLobbies: Record<string, Set<string>> = { "3": new Set() };
  private uniqueId: () => string;
  private getContinents: () => Continent;
  private timeStamp: () => number = Date.now;
  private connectedTerritories: Continent;

  constructor(
    uniqueId: () => string,
    getContinents: () => Continent,
    timeStamp: () => number,
    shuffler: (ar: string[]) => string[] = lodash.shuffle,
    connectedTerritories: Continent
  ) {
    this.uniqueId = uniqueId;
    this.getContinents = getContinents;
    this.timeStamp = timeStamp;
    this.shuffler = shuffler;
    this.connectedTerritories = connectedTerritories;
  }

  private createGame(players: Set<string>) {
    const gameId = this.uniqueId();
    const continents = this.getContinents();
    const game = new Game(
      players,
      continents,
      this.uniqueId,
      this.shuffler,
      this.timeStamp,
      this.connectedTerritories
    );
    game.init();
    this.games.push(game);

    players.forEach((playerId) => (this.gameSessions[playerId] = gameId));

    return gameId;
  }

  private getRecentActions(actions: Action[] = [], timeStamp: number) {
    return actions.filter((action) => action.timeStamp > timeStamp);
  }

  public allotPlayer(playerId: string, noOfPlayers: string) {
    const currentLobby = this.waitingLobbies[noOfPlayers];
    currentLobby.add(playerId);

    if (currentLobby.size === parseInt(noOfPlayers)) {
      this.createGame(currentLobby);
      this.waitingLobbies[noOfPlayers] = new Set();
    }

    return this.waitingLobbies[noOfPlayers];
  }

  public getGameActions(playerId: string, lastActionat: number) {
    const activeGame = this.findPlayerActiveGame(playerId);
    const allActions = activeGame?.gameActions;
    const recentActions = this.getRecentActions(allActions, lastActionat);

    return {
      status: activeGame?.status,
      userId: playerId,
      players: activeGame?.playersData,
      actions: recentActions,
    };
  }

  public waitingStatus(playerId: string): LobbyStatus {
    const waitingLobbies = Object.values(this.waitingLobbies);
    const waitingLobby = waitingLobbies.find((waitingLobby) =>
      waitingLobby.has(playerId)
    );

    if (waitingLobby) return { status: true, players: [...waitingLobby] };

    return { status: false, players: [] };
  }

  public findPlayerActiveGame(playerId: string) {
    return this.games.find(
      (game) => game.hasPlayer(playerId) && game.status === GameStatus.running
    );
  }

  public handleGameActions(actionDetails: ActionDetails) {
    const requiredGame = this.findPlayerActiveGame(actionDetails.playerId);
    if (!requiredGame) throw "Game not found";
    const actionMap: Record<ActionTypes, () => any> = {
      updateTroops: () => requiredGame.updateTroops(actionDetails),
      isDeploymentOver: () => requiredGame.isDeploymentOver(),
      reinforceRequest: () =>
        requiredGame.fetchReinforcementData(actionDetails),
      getCards: () => requiredGame.getPlayerCards(actionDetails.playerId),
      requestAttack: () =>
        requiredGame.playerTerritories(actionDetails.playerId),
      requestNeighbouringTerritories: () =>
        requiredGame.neighbouringTerritories(
          actionDetails.playerId,
          actionDetails.data.territoryId
        ),
      requestDefendingPlayer: () =>
        requiredGame.gameDefender(actionDetails.data.territoryId),
    };

    return actionMap[actionDetails.name as ActionTypes]();
  }
}
