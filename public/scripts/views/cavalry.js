export default class GoldenCavalry {
  #container;
  // #previousPosition;

  constructor() {
    this.#container = document.querySelector(".golden-cavalry");
  }

  #bonusTroopsRow(bonusTroops) {
    const row2 = document.createElement("tr");
    for (let i = 0; i < bonusTroops.length; i++) {
      const bonus = document.createElement("td");
      bonus.textContent = bonusTroops[i];
      row2.appendChild(bonus);
    }
    return row2;
  }

  #cavalryRow(bonusTroops, currentCavalryPos) {
    const row1 = document.createElement("tr");
    for (let i = 0; i < bonusTroops.length; i++) {
      const bonus = document.createElement("td");

      if (i === currentCavalryPos) {
        const cavalry = document.createElement("img");
        cavalry.src = "../images/goldenCavalry.png";
        bonus.appendChild(cavalry);
      }
      row1.appendChild(bonus);
    }
    return row1;
  }

  render(currentCavalryPos, bonusTroops) {
    this.#container.innerHTML = "";

    const cavalryTable = document.createElement("table");
    const tbody = document.createElement("tbody");

    const row1 = this.#cavalryRow(bonusTroops, currentCavalryPos);
    const row2 = this.#bonusTroopsRow(bonusTroops);

    tbody.appendChild(row1);
    tbody.appendChild(row2);
    cavalryTable.appendChild(tbody);

    this.#container.appendChild(cavalryTable);
  }
}
