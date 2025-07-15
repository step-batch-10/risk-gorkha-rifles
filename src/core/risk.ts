import TerritoryManager, { Continents, TerritoryState } from "./territoryManager.ts";

export interface RiskDependencies {
  territoryManager: TerritoryManager;
}

export interface RiskFactoryConfig {
  getContinents: () => Continents;
  shuffler: (elements: string[]) => string[];
}

export class RiskGame {
  private readonly players: Set<string>;
  private readonly dependencies: RiskDependencies;

  private constructor(playerIds: string[], dependencies: RiskDependencies) {
    this.players = new Set(playerIds);
    this.dependencies = dependencies;
  }

  public territoryState(): TerritoryState {
    return this.dependencies.territoryManager.getTerritoryState();
  }

  public initialize() {
    this.dependencies.territoryManager.initialize(this.players);
  }

  public static createFactory(factoryConfig: RiskFactoryConfig) {
    return (playerIds: string[]) => {
      const dependencies: RiskDependencies = {
        territoryManager: new TerritoryManager(factoryConfig.getContinents(), factoryConfig.shuffler),
      };

      return new RiskGame(playerIds, dependencies);
    };
  }
}