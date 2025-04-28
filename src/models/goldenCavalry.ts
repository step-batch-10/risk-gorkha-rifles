export default class GoldenCavalry {
  private position;
  private bonus: number[] = [0, 10, 20, 30, 40, 50, 60];

  constructor(initialPosition: number) {
    this.position = initialPosition;
  }

  nextPosition() {
    this.position = this.position + 1;
    console.log(`Golden Cavalry has moved to ${this.position}.`);
    return this.position;
  }

  getBonusTroops() {
    const bonusTroops = this.bonus[this.position];
    return bonusTroops;
  }
}
