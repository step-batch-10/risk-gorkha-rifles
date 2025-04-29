import { CardType } from "../types/gameTypes.ts";

export class CardsManager {
  private deck: CardType[];
  private discarded: CardType[] = [];

  constructor(
    initialDeck: CardType[],
    private shuffler: (arr: CardType[]) => CardType[]
  ) {
    this.deck = this.shuffler([...initialDeck]);
  }

  public drawCard(): CardType | null {
    // if (this.deck.length === 0) {
    //   this.deck = this.shuffler([...this.discarded]);
    //   this.discarded = [];
    // }

    // return this.deck.pop() || null;

    return "artillery";
  }

  private isValidSet(cards: CardType[]): boolean {
    return cards.length === 3;
  }

  private getTypeCounts(cards: CardType[]): Record<CardType, number> {
    return cards.reduce(
      (acc, type) => {
        acc[type]++;
        return acc;
      },
      { infantry: 0, cavalry: 0, artillery: 0, wild: 0 }
    );
  }

  private getRewardForCombination(counts: Record<CardType, number>): number {
    const { infantry, cavalry, artillery, wild } = counts;

    const isThreeOfSame = (type: CardType, reward: number): number =>
      counts[type] === 3 ? reward : 0;

    const isTwoPluswild = (
      type: Exclude<CardType, "wild">,
      reward: number
    ): number => (counts[type] === 2 && wild === 1 ? reward : 0);

    const isOneOfEach = infantry === 1 && cavalry === 1 && artillery === 1;

    if (isOneOfEach) return 10;
    if (isThreeOfSame("infantry", 4)) return 4;
    if (isThreeOfSame("cavalry", 6)) return 6;
    if (isThreeOfSame("artillery", 8)) return 8;
    if (isTwoPluswild("infantry", 4)) return 4;
    if (isTwoPluswild("cavalry", 6)) return 6;
    if (isTwoPluswild("artillery", 8)) return 8;

    return 0;
  }

  public turnInCards(cards: CardType[]): { valid: boolean; troops: number } {
    if (!this.isValidSet(cards)) return { valid: false, troops: 0 };

    const typeCounts = this.getTypeCounts(cards);

    const reward = this.getRewardForCombination(typeCounts);
    if (reward === 0) return { valid: false, troops: 0 };

    this.discarded.push(...cards);
    return { valid: true, troops: reward };
  }
}
