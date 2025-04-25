import { assertEquals } from "assert";
import { describe, it } from "testing";
import { getTypeCounts } from "../../src/handler/gameHandler.ts";
import { CardType } from "../../src/types/gameTypes.ts";

describe("getTypeCounts", () => {
  it("should return player card details", () => {
    const cards: CardType[] = ["infantry", "cavalry", "infantry"];
    const playerCards = getTypeCounts(cards);
    assertEquals(playerCards, {
      infantry: 2,
      cavalry: 1,
      artillery: 0,
      hybrid: 0,
    });
  });

  it("should return 0 for all types in case of empty array", () => {
    const cards: CardType[] = [];
    const playerCards = getTypeCounts(cards);
    assertEquals(playerCards, {
      infantry: 0,
      cavalry: 0,
      artillery: 0,
      hybrid: 0,
    });
  });

  it("should count for only similar cards", () => {
    const cards: CardType[] = ["infantry", "infantry"];
    const playerCards = getTypeCounts(cards);
    assertEquals(playerCards, {
      infantry: 2,
      cavalry: 0,
      artillery: 0,
      hybrid: 0,
    });
  });

  it("should count the cards for all types", () => {
    const cards: CardType[] = ["infantry", "hybrid", "cavalry", "artillery"];
    const playerCards = getTypeCounts(cards);
    assertEquals(playerCards, {
      infantry: 1,
      cavalry: 1,
      artillery: 1,
      hybrid: 1,
    });
  });
});
