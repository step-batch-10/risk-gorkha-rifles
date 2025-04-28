import { assertEquals, } from "assert";
import { describe, it } from "testing";
import GoldenCalvalry from "../../src/models/goldenCavalry.ts"

describe('test for Golden Cavalry class', () => {

  it('should return the next position as 1', () => {
    const gc = new GoldenCalvalry(0);
    const nextPosition = gc.nextPosition();

    assertEquals(nextPosition, 1);
  });

  it('should return the next position as 6', () => {
    const gc = new GoldenCalvalry(5);
    const nextPosition = gc.nextPosition();

    assertEquals(nextPosition, 6);
  });

  it('should return the bonus troops as 0 initially', () => {
    const gc = new GoldenCalvalry(0);
    const bonusTroops = gc.getBonusTroops();

    assertEquals(bonusTroops, 0);
  });

  it('should return the bonus troops as 60 for last position', () => {
    const gc = new GoldenCalvalry(6);
    const bonusTroops = gc.getBonusTroops();

    assertEquals(bonusTroops, 60);
  });
});
