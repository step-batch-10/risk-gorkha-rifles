import { Territory } from '../types/game.ts';
import lodash from 'lodash';

export const divideTerritories = (
  continents: Record<string, string[]>,
  players: string[]
): Map<string, Territory> => {
  const territories = new Map<string, Territory>();

  Object.values(continents).forEach((group) => {
    const shuffled: string[] = lodash.shuffle([...group]);
    shuffled.forEach((territory, i) => {
      territories.set(territory, { owner: players[i % 6], troops: 1 });
    });
  });

  return territories;
};

export const getContinents = () => {
  return {
    NorthAmerica: [
      'alaska',
      'alberta',
      'central-america',
      'eastern-us',
      'greenland',
      'northwest-territory',
      'ontario',
      'quebec',
      'western-us',
    ],
    SouthAmerica: [
      'argentina',
      'brazil',
      'peru',
      'venezuela',
    ],
    Europe: [
      'great-britain',
      'iceland',
      'northern-europe',
      'scandinavia',
      'southern-europe',
      'ukraine',
      'western-europe',
    ],
    Africa: [
      'congo',
      'east-africa',
      'egypt',
      'madagascar',
      'north-africa',
      'south-africa',
    ],
    Asia: [
      'afghanistan',
      'china',
      'india',
      'irkutsk',
      'japan',
      'kamchatka',
      'middle-east',
      'mongolia',
      'siam',
      'siberia',
      'ural',
      'yakutsk',
    ],
    Australia: [
      'eastern-australia',
      'indonesia',
      'new-guinea',
      'western-australia',
    ],
  };
};
