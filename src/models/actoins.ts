import { Action, OutgoingActionDetails } from "../types/gameTypes.ts";

export class Actions {
  private actions: Action[] = [];
  private uniqueId: () => string;
  private timeStamp: () => number;

  constructor(uniqueId: () => string, timestamp: () => number) {
    this.uniqueId = uniqueId;
    this.timeStamp = timestamp;
  }

  private generateAction(actionDetails: OutgoingActionDetails): Action {
    return {
      id: this.uniqueId(),
      name: actionDetails.action,
      playerId: actionDetails.playerId,
      to: actionDetails.to,
      currentPlayer: actionDetails.currentPlayerId,
      data: actionDetails.data,
      timeStamp: this.timeStamp(),
      playerStates: actionDetails.playerStates,
      territoryState: actionDetails.territoryState,
    };
  }

  saveAction(actionDetails: OutgoingActionDetails) {
    const latestAction = this.generateAction(actionDetails);
    this.actions.push(latestAction);
    return this.actions.at(-1);
  }

  getRecentActions(timeStamp: number, playerId: string) {
    return this.actions.filter(
      (action) =>
        action.timeStamp > timeStamp &&
        (action.to === null || action.to === playerId)
    );
  }

  get lastAction() {
    return this.actions.at(-1);
  }
}
