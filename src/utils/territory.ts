import { Territory } from "../types/game.ts";
import lodash from "lodash";

export const divideTerritories = (
  continents: Record<string, string[]>,
  players: string[]
): Record<string, Territory> => {
  const territories: Record<string, Territory> = {};
  const totalPlayers = players.length;

  const territoriesList = Object.values(continents).flatMap((x) => x);
  const shuffled: string[] = lodash.shuffle(territoriesList);

  shuffled.forEach((territory, i) => {
    territories[territory] = { owner: players[i % totalPlayers], troops: 1 };
  });

  return territories;
};

export const getContinents = () => {
  return {
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
};
