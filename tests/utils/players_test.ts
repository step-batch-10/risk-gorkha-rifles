import { assertEquals } from "assert";
import { describe, it } from "testing";
import { playersAndTroops } from "../../src/utils/players.ts";

describe("playersAndTroops", () => {
  it("should return the object with playercount and no of total troops", () => {
    const actual = playersAndTroops();
    const expected = {
      6: { noOfPlayers: 6, totalNumberOfTroops: 120 },
      5: { noOfPlayers: 5, totalNumberOfTroops: 125 },
      4: { noOfPlayers: 4, totalNumberOfTroops: 120 },
      3: { noOfPlayers: 3, totalNumberOfTroops: 105 },
    };

    assertEquals(actual, expected);
  });
});
