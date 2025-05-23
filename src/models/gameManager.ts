import Game, { ActionDetails } from "./game.ts";
import {
  CardType,
  Continent,
  GameStatus,
  LobbyStatus,
} from "../types/gameTypes.ts";
import lodash from "lodash";
import { Action } from "./game.ts";
import { ActionTypes } from "../types/gameTypes.ts";
import Messages from "./messages.ts";
import GoldenCavalry from "./goldenCavalry.ts";
import { CardsManager } from "./cardsManager.ts";
import { getCards } from "../utils/cards.ts";

export default class GameManager {
  private shuffler: (ar: string[]) => string[];
  private gameSessions: Record<string, string> = {};
  private games: Game[] = [];
  private waitingLobbies: Record<string, Set<string>> = { "3": new Set() };
  private uniqueId: () => string;
  private getContinents: () => Continent;
  private timeStamp: () => number = Date.now;
  private connectedTerritories: Continent;
  private messages: Messages;

  constructor(
    uniqueId: () => string,
    getContinents: () => Continent,
    timeStamp: () => number,
    shuffler: (ar: string[]) => string[] = lodash.shuffle,
    connectedTerritories: Continent,
    messages: Messages = new Messages(
      () => 1,
      () => "1"
    )
  ) {
    this.uniqueId = uniqueId;
    this.getContinents = getContinents;
    this.timeStamp = timeStamp;
    this.shuffler = shuffler;
    this.connectedTerritories = connectedTerritories;
    this.messages = messages;
  }

  public saveMessage(playerId: string, message: string, recipientId?: string) {
    const gameId = this.gameSessions[playerId];

    return this.messages.saveMessage(gameId, message, playerId, recipientId);
  }

  public getMessages(playerId: string, since: number = 0) {
    const gameId = this.gameSessions[playerId];

    return this.messages.getGameMessages(gameId, since);
  }

  public getPersonalMessages(playerId: string, since: number) {
    const gameId = this.gameSessions[playerId];

    return this.messages.getPersonalMessages(gameId, playerId, since);
  }

  private createGame(players: Set<string>) {
    const gameId = this.uniqueId();
    const continents = this.getContinents();
    const goldenCavalry: GoldenCavalry = new GoldenCavalry();
    const cards: CardType[] = getCards();
    const cardsManager = new CardsManager(
      cards,
      (deck: CardType[]): CardType[] => [...deck]
    );
    const game = new Game(
      players,
      continents,
      this.uniqueId,
      this.shuffler,
      this.timeStamp,
      this.connectedTerritories,
      () => Math.ceil(Math.random() * 6),
      goldenCavalry,
      cardsManager
    );
    game.init();
    this.games.push(game);

    players.forEach((playerId) => (this.gameSessions[playerId] = gameId));

    return gameId;
  }

  private getRecentActions(
    actions: Action[] = [],
    timeStamp: number,
    playerId: string
  ) {
    return actions.filter(
      (action) =>
        action.timeStamp > timeStamp &&
        (action.to === null || action.to === playerId)
    );
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

    const recentActions = this.getRecentActions(
      allActions,
      lastActionat,
      playerId
    );

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
      startGame: () => requiredGame.startGame(),
      reinforceRequest: () =>
        requiredGame.fetchReinforcementData(actionDetails),
      getCards: () => requiredGame.getPlayerCards(actionDetails.playerId),
      requestAttack: () => requiredGame.validPlayerTerritories(actionDetails),
      requestNeighbouringTerritories: () =>
        requiredGame.getNeighbouringTerritories(
          actionDetails.playerId,
          actionDetails.data.territoryId
        ),
      requestDefendingPlayer: () =>
        requiredGame.extractDefenderId(actionDetails),

      storeTroops: () => requiredGame.storeTroops(actionDetails),
      fortification: () => requiredGame.fortification(actionDetails),
      connectedTerritories: () =>
        requiredGame.getConnectedTerritories(actionDetails),
      startFortification: () => requiredGame.startFortification(actionDetails),
      getGamePlayers: () => requiredGame.getGamePlayers(),
    };

    return actionMap[actionDetails.name as ActionTypes]();
  }
}
