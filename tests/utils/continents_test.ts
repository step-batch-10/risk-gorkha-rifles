import { assertEquals } from "assert";
import { describe, it } from "testing";
import { getContinents } from "../../src/utils/continents.ts";

describe("test getContinents()", () => {
  it("should return all continents with their territories", () => {
    const actual = getContinents();
    const expected = {
      NorthAmerica: [
        "alaska",
        "alberta",
        "central-america",
        "eastern-us",
        "greenland",
        "northwest-territory",
        "ontario",
        "quebec",
        "western-us",
      ],
      SouthAmerica: ["argentina", "brazil", "peru", "venezuela"],
      Europe: [
        "great-britain",
        "iceland",
        "northern-europe",
        "scandinavia",
        "southern-europe",
        "ukraine",
        "western-europe",
      ],
      Africa: [
        "congo",
        "east-africa",
        "egypt",
        "madagascar",
        "north-africa",
        "south-africa",
      ],
      Asia: [
        "afghanistan",
        "china",
        "india",
        "irkutsk",
        "japan",
        "kamchatka",
        "middle-east",
        "mongolia",
        "siam",
        "siberia",
        "ural",
        "yakutsk",
      ],
      Australia: [
        "eastern-australia",
        "indonesia",
        "new-guinea",
        "western-australia",
      ],
    };

    assertEquals(actual, expected);
  });
});
