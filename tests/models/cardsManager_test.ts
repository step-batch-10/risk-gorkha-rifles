import { assertEquals } from "assert";
import { describe, it } from "testing";
import { CardsManager } from "../../src/models/cardsManager.ts";
import { CardType } from "../../src/types/gameTypes.ts";

const mockedDeck: CardType[] = [
  "infantry",
  "infantry",
  "infantry",
  "cavalry",
  "cavalry",
  "cavalry",
  "artillery",
  "artillery",
  "artillery",
  "wild",
  "wild",
];

const mockedShuffler = (deck: CardType[]): CardType[] => [...deck];

const getCardManager = (deck: CardType[] = mockedDeck): CardsManager => {
  return new CardsManager(deck, mockedShuffler);
};

describe("turnInCards - valid combinations", () => {
  it("should reward 4 troops for 3 infantry cards", () => {
    const cardManager = getCardManager();
    const result = cardManager.turnInCards([
      "infantry",
      "infantry",
      "infantry",
    ]);

    assertEquals(result, { valid: true, troops: 4 });
  });

  it("should reward 6 troops for 3 cavalry cards", () => {
    const cardManager = getCardManager();
    const result = cardManager.turnInCards(["cavalry", "cavalry", "cavalry"]);

    assertEquals(result, { valid: true, troops: 6 });
  });

  it("should reward 8 troops for 3 artillery cards", () => {
    const cardManager = getCardManager();
    const result = cardManager.turnInCards([
      "artillery",
      "artillery",
      "artillery",
    ]);

    assertEquals(result, { valid: true, troops: 8 });
  });

  it("should reward 10 troops for 1 of each type", () => {
    const cardManager = getCardManager();
    const result = cardManager.turnInCards([
      "infantry",
      "cavalry",
      "artillery",
    ]);
    assertEquals(result, { valid: true, troops: 10 });
  });

  it("should reward 4 troops for 2 infantry + 1 wild", () => {
    const cardManager = getCardManager();
    const result = cardManager.turnInCards(["infantry", "infantry", "wild"]);
    assertEquals(result, { valid: true, troops: 4 });
  });

  it("should reward 6 troops for 2 cavalry + 1 wild", () => {
    const cardManager = getCardManager();
    const result = cardManager.turnInCards(["cavalry", "cavalry", "wild"]);
    assertEquals(result, { valid: true, troops: 6 });
  });

  it("should reward 8 troops for 2 artillery + 1 wild", () => {
    const cardManager = getCardManager();
    const result = cardManager.turnInCards(["artillery", "artillery", "wild"]);
    assertEquals(result, { valid: true, troops: 8 });
  });
});

describe("turnInCards - invalid combinations", () => {
  it("should return invalid for only 2 cards", () => {
    const cardManager = getCardManager();
    const result = cardManager.turnInCards(["infantry", "infantry"]);
    assertEquals(result, { valid: false, troops: 0 });
  });

  it("should return invalid for 4 cards", () => {
    const cardManager = getCardManager();
    const result = cardManager.turnInCards([
      "infantry",
      "infantry",
      "infantry",
      "infantry",
    ]);
    assertEquals(result, { valid: false, troops: 0 });
  });

  it("should return invalid for mismatched 3 cards", () => {
    const cardManager = getCardManager();
    const result = cardManager.turnInCards(["infantry", "infantry", "cavalry"]);
    assertEquals(result, { valid: false, troops: 0 });
  });

  it("should return invalid for 2 wilds and 1 other", () => {
    const cardManager = getCardManager();
    const result = cardManager.turnInCards(["infantry", "wild", "wild"]);
    assertEquals(result, { valid: false, troops: 0 });
  });

  it("should return invalid for 3 wilds", () => {
    const cardManager = getCardManager();
    const result = cardManager.turnInCards(["wild", "wild", "wild"]);
    assertEquals(result, { valid: false, troops: 0 });
  });
});

describe("drawCard", () => {
  it("should draw cards in the correct order", () => {
    const mockedDeck: CardType[] = [
      "infantry",
      "infantry",
      "cavalry",
      "artillery",
      "wild",
    ];
    const cm = getCardManager(mockedDeck);
    assertEquals(cm.drawCard(), "wild");
    assertEquals(cm.drawCard(), "artillery");
    assertEquals(cm.drawCard(), "cavalry");
    assertEquals(cm.drawCard(), "infantry");
    assertEquals(cm.drawCard(), "infantry");
  });

  it("should return undefined when deck is empty and discard is empty", () => {
    const mockedDeck: CardType[] = [
      "infantry",
      "infantry",
      "cavalry",
      "artillery",
      "wild",
    ];
    const cm = getCardManager(mockedDeck);

    for (let i = 0; i < 5; i++) cm.drawCard();
    assertEquals(cm.drawCard(), null);
  });
});
