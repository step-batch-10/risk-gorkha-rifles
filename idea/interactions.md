```typescript
interface Game {
  gameId: number;
  state: RiskObject;
  status: enum ('waiting', 'running', 'over', 'terminated');
  createdAt: Date;
  createdBy?: number; // user id
}

interface AttackObject {
  attackerId: number // user id,
  defenderId: number // user id,
  attackTerritory: Territory,
  defendTerritory: Territory,
  data: {
    troopsUsedForAttack: number,
    trropsUsedForDefense: number,
    attackResult: [number, number, number],
    defenseResult: [number, number]
  }
}

interface ReinforcementObject {
  defaultTroops: number,
  cardCombination: number,
  continentTroops: number
}

interface FortifiedObject {
  fromTerritory: Territory,
  toTerritory: Territory,
  troopsCount: number
}

interface TerritoryState {
    india: {
      owner: number; // user id
      troopsCount: 123;
    }, ...
}

interface playerCards {
  'playerId': ['card_1', 'card_2']
}

interface Risk {
  players: Record<number, string>;
  winner: number; // user id
  goldenCavalryPiecePosition: number;
  logs: [
    {
      data: {
        attack: AttackObject[],
        reinforcement: ReinforcementObject,
        fortifies: FortifiedObject,
        state: {
          territoryState: TerritoryState // should be deep copied,
          goldenCavalryPiecePosition: number;
        }
      },
    }
  ];
  territoryState: TerritoryState
}
```

| Method | Path          | Request                 | Response                              | Purpose                                                   |
| ------ | ------------- | ----------------------- | ------------------------------------- | --------------------------------------------------------- |
| POST   | /login        | {username}              | {session cookie}                      | should login the user                                     |
| GET    | /user-details | {cookies}               | {avatar, username}                    | should give the logged in user details                    |
| POST   | /join-game    | {cookies} {noOfPlayers} | redirection (game page) & Game Object | should join the player in the game and return game object |
