import { Territory } from "../types/game.ts";
import lodash from "lodash";

export const divideTerritories =
  (continents: Record<string, string[]>, players: string[]) => {
    const territories: Record<string, Territory> = {};

    Object.values(continents).forEach(group => {
      const shuffled: string[]  = lodash.shuffle([...group]);
      shuffled.forEach((territory, i) => {
        territories[territory] = { owner: players[i % 6], troops: 1 };
      });
    });

    return territories;
  };

export const getContinents = () => {
  return {
    NorthAmerica: ["Alaska", "Alberta", "Central America", "Eastern United States", "Greenland", "Northwest Territory", "Ontario", "Quebec", "Western United States"],
    SouthAmerica: ["Argentina", "Brazil", "Peru", "Venezuela"],
    Europe: ["Great Britain", "Iceland", "Northern Europe", "Scandinavia", "Southern Europe", "Ukraine", "Western Europe"],
    Africa: ["Congo", "East Africa", "Egypt", "Madagascar", "North Africa", "South Africa"],
    Asia: ["Afghanistan", "China", "India", "Irkutsk", "Japan", "Kamchatka", "Middle East", "Mongolia", "Siam", "Siberia", "Ural", "Yakutsk"],
    Australia: ["Eastern Australia", "Indonesia", "New Guinea", "Western Australia"]
  };
};