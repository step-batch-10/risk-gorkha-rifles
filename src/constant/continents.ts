import { Continents } from "../core/territoryManager.ts";

export const getContinents = (): Continents => {
  return {
    "North America": {
      bonusPoints: 5,
      territories: {
        "Alaska": { neighbourTerritories: ["Northwest Territory", "Alberta", "Kamchatka"] },
        "Northwest Territory": { neighbourTerritories: ["Alaska", "Alberta", "Ontario", "Greenland"] },
        "Greenland": { neighbourTerritories: ["Northwest Territory", "Ontario", "Quebec", "Iceland"] },
        "Alberta": { neighbourTerritories: ["Alaska", "Northwest Territory", "Ontario", "Western United States"] },
        "Ontario": { neighbourTerritories: ["Northwest Territory", "Greenland", "Quebec", "Eastern United States", "Western United States", "Alberta"] },
        "Quebec": { neighbourTerritories: ["Ontario", "Greenland", "Eastern United States"] },
        "Western United States": { neighbourTerritories: ["Alberta", "Ontario", "Eastern United States", "Central America"] },
        "Eastern United States": { neighbourTerritories: ["Western United States", "Ontario", "Quebec", "Central America"] },
        "Central America": { neighbourTerritories: ["Western United States", "Eastern United States", "Venezuela"] }
      }
    },
    "South America": {
      bonusPoints: 2,
      territories: {
        "Venezuela": { neighbourTerritories: ["Central America", "Peru", "Brazil"] },
        "Peru": { neighbourTerritories: ["Venezuela", "Brazil", "Argentina"] },
        "Brazil": { neighbourTerritories: ["Venezuela", "Peru", "Argentina", "North Africa"] },
        "Argentina": { neighbourTerritories: ["Peru", "Brazil"] }
      }
    },
    "Europe": {
      bonusPoints: 5,
      territories: {
        "Iceland": { neighbourTerritories: ["Greenland", "Scandinavia", "Great Britain"] },
        "Scandinavia": { neighbourTerritories: ["Iceland", "Great Britain", "Northern Europe", "Ukraine"] },
        "Great Britain": { neighbourTerritories: ["Iceland", "Scandinavia", "Northern Europe", "Western Europe"] },
        "Northern Europe": { neighbourTerritories: ["Scandinavia", "Great Britain", "Western Europe", "Southern Europe", "Ukraine"] },
        "Western Europe": { neighbourTerritories: ["Great Britain", "Northern Europe", "Southern Europe", "North Africa"] },
        "Southern Europe": { neighbourTerritories: ["Western Europe", "Northern Europe", "Ukraine", "Middle East", "Egypt", "North Africa"] },
        "Ukraine": { neighbourTerritories: ["Scandinavia", "Northern Europe", "Southern Europe", "Ural", "Afghanistan", "Middle East"] }
      }
    },
    "Africa": {
      bonusPoints: 3,
      territories: {
        "North Africa": { neighbourTerritories: ["Brazil", "Western Europe", "Southern Europe", "Egypt", "East Africa", "Congo"] },
        "Egypt": { neighbourTerritories: ["Southern Europe", "North Africa", "East Africa", "Middle East"] },
        "East Africa": { neighbourTerritories: ["Egypt", "North Africa", "Congo", "South Africa", "Madagascar", "Middle East"] },
        "Congo": { neighbourTerritories: ["North Africa", "East Africa", "South Africa"] },
        "South Africa": { neighbourTerritories: ["Congo", "East Africa", "Madagascar"] },
        "Madagascar": { neighbourTerritories: ["South Africa", "East Africa"] }
      }
    },
    "Asia": {
      bonusPoints: 7,
      territories: {
        "Ural": { neighbourTerritories: ["Ukraine", "Siberia", "Afghanistan", "China"] },
        "Siberia": { neighbourTerritories: ["Ural", "Yakutsk", "Irkutsk", "Mongolia", "China"] },
        "Yakutsk": { neighbourTerritories: ["Siberia", "Kamchatka", "Irkutsk"] },
        "Kamchatka": { neighbourTerritories: ["Yakutsk", "Irkutsk", "Mongolia", "Japan", "Alaska"] },
        "Irkutsk": { neighbourTerritories: ["Siberia", "Yakutsk", "Kamchatka", "Mongolia"] },
        "Mongolia": { neighbourTerritories: ["Siberia", "Irkutsk", "Kamchatka", "Japan", "China"] },
        "Japan": { neighbourTerritories: ["Kamchatka", "Mongolia"] },
        "Afghanistan": { neighbourTerritories: ["Ural", "China", "India", "Middle East", "Ukraine"] },
        "China": { neighbourTerritories: ["Afghanistan", "Ural", "Siberia", "Mongolia", "Siam", "India"] },
        "Middle East": { neighbourTerritories: ["Egypt", "Southern Europe", "Ukraine", "Afghanistan", "India", "East Africa"] },
        "India": { neighbourTerritories: ["Middle East", "Afghanistan", "China", "Siam"] },
        "Siam": { neighbourTerritories: ["India", "China", "Indonesia"] }
      }
    },
    "Australia": {
      bonusPoints: 2,
      territories: {
        "Indonesia": { neighbourTerritories: ["Siam", "New Guinea", "Western Australia"] },
        "New Guinea": { neighbourTerritories: ["Indonesia", "Western Australia", "Eastern Australia"] },
        "Western Australia": { neighbourTerritories: ["Indonesia", "New Guinea", "Eastern Australia"] },
        "Eastern Australia": { neighbourTerritories: ["Western Australia", "New Guinea"] }
      }
    }
  };
};
