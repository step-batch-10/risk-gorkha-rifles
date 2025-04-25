import { assertEquals, } from "assert";
import { describe, it } from "testing";
import { CardsManager } from "../../src/models/cardsManager.ts";
import { CardType } from "../../src/types/gameTypes.ts";

const mockedDeck: CardType[] = [
  "infantry", "infantry", "infantry",
  "cavalry", "cavalry", "cavalry",
  "artillery", "artillery", "artillery",
  "hybrid", "hybrid"
];

const mockedShuffler = (deck: CardType[]): CardType[] => [...deck];

const getCardManager = (deck: CardType[] = mockedDeck): CardsManager => {
  return new CardsManager(deck, mockedShuffler);
};

describe("turnInCards - valid combinations", () => {
  it("should reward 4 troops for 3 infantry cards", () => {
    const cardManager = getCardManager();
    const result = cardManager.turnInCards(["infantry", "infantry", "infantry"]);

    assertEquals(result, { valid: true, troops: 4 });
  });

  it("should reward 6 troops for 3 cavalry cards", () => {
    const cardManager = getCardManager();
    const result = cardManager.turnInCards(["cavalry", "cavalry", "cavalry"]);

    assertEquals(result, { valid: true, troops: 6 });
  });

  it("should reward 8 troops for 3 artillery cards", () => {
    const cardManager = getCardManager();
    const result = cardManager.turnInCards(["artillery", "artillery", "artillery"]);

    assertEquals(result, { valid: true, troops: 8 });
  });

  it("should reward 10 troops for 1 of each type", () => {
    const cardManager = getCardManager();
    const result = cardManager.turnInCards(["infantry", "cavalry", "artillery"]);
    assertEquals(result, { valid: true, troops: 10 });
  });

  it("should reward 4 troops for 2 infantry + 1 hybrid", () => {
    const cardManager = getCardManager();
    const result = cardManager.turnInCards(["infantry", "infantry", "hybrid"]);
    assertEquals(result, { valid: true, troops: 4 });
  });

  it("should reward 6 troops for 2 cavalry + 1 hybrid", () => {
    const cardManager = getCardManager();
    const result = cardManager.turnInCards(["cavalry", "cavalry", "hybrid"]);
    assertEquals(result, { valid: true, troops: 6 });
  });

  it("should reward 8 troops for 2 artillery + 1 hybrid", () => {
    const cardManager = getCardManager();
    const result = cardManager.turnInCards(["artillery", "artillery", "hybrid"]);
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
    const result = cardManager.turnInCards(["infantry", "infantry", "infantry", "infantry"]);
    assertEquals(result, { valid: false, troops: 0 });
  });

  it("should return invalid for mismatched 3 cards", () => {
    const cardManager = getCardManager();
    const result = cardManager.turnInCards(["infantry", "infantry", "cavalry"]);
    assertEquals(result, { valid: false, troops: 0 });
  });

  it("should return invalid for 2 hybrids and 1 other", () => {
    const cardManager = getCardManager();
    const result = cardManager.turnInCards(["infantry", "hybrid", "hybrid"]);
    assertEquals(result, { valid: false, troops: 0 });
  });

  it("should return invalid for 3 hybrids", () => {
    const cardManager = getCardManager();
    const result = cardManager.turnInCards(["hybrid", "hybrid", "hybrid"]);
    assertEquals(result, { valid: false, troops: 0 });
  });
});

describe("drawCard", () => {
  it("should draw cards in the correct order", () => {
    const mockedDeck: CardType[] = ["infantry", "infantry", "cavalry", "artillery", "hybrid"];
    const cm = getCardManager(mockedDeck);
    assertEquals(cm.drawCard(), "hybrid");
    assertEquals(cm.drawCard(), "artillery");
    assertEquals(cm.drawCard(), "cavalry");
    assertEquals(cm.drawCard(), "infantry");
    assertEquals(cm.drawCard(), "infantry");
  });

  it("should return undefined when deck is empty and discard is empty", () => {
    const mockedDeck: CardType[] = ["infantry", "infantry", "cavalry", "artillery", "hybrid"];
    const cm = getCardManager(mockedDeck);

    for (let i = 0; i < 5; i++) cm.drawCard();
    assertEquals(cm.drawCard(), null);
  });
});