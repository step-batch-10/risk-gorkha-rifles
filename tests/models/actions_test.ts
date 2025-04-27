import { Actions } from "../../src/models/actoins.ts";
import { assertEquals } from "assert";
import { describe, it } from "testing";
import { OutgoingActionDetails } from "../../src/types/gameTypes.ts";

const uniqueId = () => "1";

const timeStamp = () => {
  let i = 1;
  return () => i++;
};

const dummyActionDetails1: OutgoingActionDetails = {
  playerId: "1",
  data: {
    territory: "India",
    Troops: 21,
  },
  currentPlayerId: "1",
  action: "updateTroops",
  to: null,
  playerStates: {
    "1": {
      territories: ["india"],
      continents: [{ asia: ["India"] }],
      availableTroops: 22,
      cards: [],
    },
  },
  territoryState: {},
};

describe("save ation", () => {
  it("should push the action and return the action", () => {
    const actions = new Actions(uniqueId, timeStamp());

    const actual = actions.saveAction(dummyActionDetails1);
    const expected = {
      id: "1",
      name: "updateTroops",
      playerId: "1",
      to: null,
      currentPlayer: "1",
      data: { territory: "India", Troops: 21 },
      timeStamp: 1,
      playerStates: {
        "1": {
          territories: ["india"],
          continents: [{ asia: ["India"] }],
          availableTroops: 22,
          cards: [],
        },
      },
      territoryState: {},
    };

    assertEquals(actual, expected);
  });
});

describe("getRecentActions", () => {
  it("should return all actions after the time stamp", () => {
    const actions = new Actions(uniqueId, timeStamp());
    actions.saveAction(dummyActionDetails1);
    actions.saveAction(dummyActionDetails1);
    actions.saveAction(dummyActionDetails1);

    const actual = actions.getRecentActions(1, "1");
    const expected = [
      {
        id: "1",
        name: "updateTroops",
        playerId: "1",
        to: null,
        currentPlayer: "1",
        data: { territory: "India", Troops: 21 },
        timeStamp: 2,
        playerStates: {
          "1": {
            territories: ["india"],
            continents: [{ asia: ["India"] }],
            availableTroops: 22,
            cards: [],
          },
        },
        territoryState: {},
      },
      {
        id: "1",
        name: "updateTroops",
        playerId: "1",
        to: null,
        currentPlayer: "1",
        data: { territory: "India", Troops: 21 },
        timeStamp: 3,
        playerStates: {
          "1": {
            territories: ["india"],
            continents: [{ asia: ["India"] }],
            availableTroops: 22,
            cards: [],
          },
        },
        territoryState: {},
      },
    ];
    assertEquals(actual, expected);
  });

  it("should return empty array when no ations present after the timeStamp", () => {
    const actions = new Actions(uniqueId, timeStamp());
    actions.saveAction(dummyActionDetails1);
    actions.saveAction(dummyActionDetails1);
    actions.saveAction(dummyActionDetails1);

    const actual = actions.getRecentActions(3, "1");

    assertEquals(actual, []);
  });

  it("should return all action after the time stamp with to null", () => {
    const actions = new Actions(uniqueId, timeStamp());
    const actionDetails1 = { ...dummyActionDetails1 };
    actionDetails1.to = "1";
    const actionDetails2 = { ...dummyActionDetails1 };
    actionDetails2.to = "1";
    actions.saveAction(actionDetails1);
    actions.saveAction(actionDetails2);
    actions.saveAction(dummyActionDetails1);

    const actual = actions.getRecentActions(0, "2");
    const expected = [
      {
        id: "1",
        name: "updateTroops",
        playerId: "1",
        to: null,
        currentPlayer: "1",
        data: { territory: "India", Troops: 21 },
        timeStamp: 3,
        playerStates: {
          "1": {
            territories: ["india"],
            continents: [{ asia: ["India"] }],
            availableTroops: 22,
            cards: [],
          },
        },
        territoryState: {},
      },
    ];

    assertEquals(actual, expected);
  });

  it("should return all the actions if player id is matched", () => {
    const actions = new Actions(uniqueId, timeStamp());
    const actionDetails1 = { ...dummyActionDetails1 };
    actionDetails1.to = "4";
    const actionDetails2 = { ...dummyActionDetails1 };
    actionDetails2.to = "4";
    const actionDetails3 = { ...dummyActionDetails1 };
    actionDetails3.to = "3";

    actions.saveAction(actionDetails1);
    actions.saveAction(actionDetails2);
    actions.saveAction(actionDetails3);

    const expected = [
      {
        id: "1",
        name: "updateTroops",
        playerId: "1",
        to: "4",
        currentPlayer: "1",
        data: { territory: "India", Troops: 21 },
        timeStamp: 1,
        playerStates: {
          "1": {
            territories: ["india"],
            continents: [{ asia: ["India"] }],
            availableTroops: 22,
            cards: [],
          },
        },
        territoryState: {},
      },
      {
        id: "1",
        name: "updateTroops",
        playerId: "1",
        to: "4",
        currentPlayer: "1",
        data: { territory: "India", Troops: 21 },
        timeStamp: 2,
        playerStates: {
          "1": {
            territories: ["india"],
            continents: [{ asia: ["India"] }],
            availableTroops: 22,
            cards: [],
          },
        },
        territoryState: {},
      },
    ];
    const actual = actions.getRecentActions(0, "4");
    assertEquals(actual, expected);
  });
});

describe("getLastAction", () => {
  it("should return last action of the actions", () => {
    const actions = new Actions(uniqueId, timeStamp());
    actions.saveAction(dummyActionDetails1);
    const expected = {
      id: "1",
      name: "updateTroops",
      playerId: "1",
      to: null,
      currentPlayer: "1",
      data: { territory: "India", Troops: 21 },
      timeStamp: 1,
      playerStates: {
        "1": {
          territories: ["india"],
          continents: [{ asia: ["India"] }],
          availableTroops: 22,
          cards: [],
        },
      },
      territoryState: {},
    };

    const actual = actions.lastAction;
    assertEquals(actual, expected);
  });
});
