import { Continents } from "../core/territoryManager.ts";

export const getContinents = (): Continents => {
  return {
    NorthAmerica: {
      bonusPoints: 5,
      territories: {
        "alaska": { neighbourTerritories: ["northwest-territory", "alberta", "kamchatka"] },
        "northwest-territory": { neighbourTerritories: ["alaska", "alberta", "ontario", "greenland"] },
        "greenland": { neighbourTerritories: ["northwest-territory", "ontario", "quebec", "iceland"] },
        "alberta": { neighbourTerritories: ["alaska", "northwest-territory", "ontario", "western-united-states"] },
        "ontario": { neighbourTerritories: ["northwest-territory", "greenland", "quebec", "eastern-united-states", "western-united-states", "alberta"] },
        "quebec": { neighbourTerritories: ["ontario", "greenland", "eastern-united-states"] },
        "western-united-states": { neighbourTerritories: ["alberta", "ontario", "eastern-united-states", "central-america"] },
        "eastern-united-states": { neighbourTerritories: ["western-united-states", "ontario", "quebec", "central-america"] },
        "central-america": { neighbourTerritories: ["western-united-states", "eastern-united-states", "venezuela"] },
      },
    },
    SouthAmerica: {
      bonusPoints: 2,
      territories: {
        "venezuela": { neighbourTerritories: ["central-america", "peru", "brazil"] },
        "peru": { neighbourTerritories: ["venezuela", "brazil", "argentina"] },
        "brazil": { neighbourTerritories: ["venezuela", "peru", "argentina", "north-africa"] },
        "argentina": { neighbourTerritories: ["peru", "brazil"] },
      },
    },
    Europe: {
      bonusPoints: 5,
      territories: {
        "iceland": { neighbourTerritories: ["greenland", "scandinavia", "great-britain"] },
        "scandinavia": { neighbourTerritories: ["iceland", "great-britain", "northern-europe", "ukraine"] },
        "great-britain": { neighbourTerritories: ["iceland", "scandinavia", "northern-europe", "western-europe"] },
        "northern-europe": { neighbourTerritories: ["scandinavia", "great-britain", "western-europe", "southern-europe", "ukraine"] },
        "western-europe": { neighbourTerritories: ["great-britain", "northern-europe", "southern-europe", "north-africa"] },
        "southern-europe": { neighbourTerritories: ["western-europe", "northern-europe", "ukraine", "middle-east", "egypt", "north-africa"] },
        "ukraine": { neighbourTerritories: ["scandinavia", "northern-europe", "southern-europe", "ural", "afghanistan", "middle-east"] },
      },
    },
    Africa: {
      bonusPoints: 3,
      territories: {
        "north-africa": { neighbourTerritories: ["brazil", "western-europe", "southern-europe", "egypt", "east-africa", "congo"] },
        "egypt": { neighbourTerritories: ["southern-europe", "north-africa", "east-africa", "middle-east"] },
        "east-africa": { neighbourTerritories: ["egypt", "north-africa", "congo", "south-africa", "madagascar", "middle-east"] },
        "congo": { neighbourTerritories: ["north-africa", "east-africa", "south-africa"] },
        "south-africa": { neighbourTerritories: ["congo", "east-africa", "madagascar"] },
        "madagascar": { neighbourTerritories: ["south-africa", "east-africa"] },
      },
    },
    Asia: {
      bonusPoints: 7,
      territories: {
        "ural": { neighbourTerritories: ["ukraine", "siberia", "afghanistan", "china"] },
        "siberia": { neighbourTerritories: ["ural", "yakutsk", "irkutsk", "mongolia", "china"] },
        "yakutsk": { neighbourTerritories: ["siberia", "kamchatka", "irkutsk"] },
        "kamchatka": { neighbourTerritories: ["yakutsk", "irkutsk", "mongolia", "japan", "alaska"] },
        "irkutsk": { neighbourTerritories: ["siberia", "yakutsk", "kamchatka", "mongolia"] },
        "mongolia": { neighbourTerritories: ["siberia", "irkutsk", "kamchatka", "japan", "china"] },
        "japan": { neighbourTerritories: ["kamchatka", "mongolia"] },
        "afghanistan": { neighbourTerritories: ["ural", "china", "india", "middle-east", "ukraine"] },
        "china": { neighbourTerritories: ["afghanistan", "ural", "siberia", "mongolia", "siam", "india"] },
        "middle-east": { neighbourTerritories: ["egypt", "southern-europe", "ukraine", "afghanistan", "india", "east-africa"] },
        "india": { neighbourTerritories: ["middle-east", "afghanistan", "china", "siam"] },
        "siam": { neighbourTerritories: ["india", "china", "indonesia"] },
      },
    },
    Australia: {
      bonusPoints: 2,
      territories: {
        "indonesia": { neighbourTerritories: ["siam", "new-guinea", "western-australia"] },
        "new-guinea": { neighbourTerritories: ["indonesia", "western-australia", "eastern-australia"] },
        "western-australia": { neighbourTerritories: ["indonesia", "new-guinea", "eastern-australia"] },
        "eastern-australia": { neighbourTerritories: ["western-australia", "new-guinea"] },
      },
    },
  };
};
