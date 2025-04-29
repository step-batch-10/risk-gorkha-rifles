export default class GoldenCavalry {
  #container;

  constructor() {
    this.#container = document.querySelector(".golden-cavalry");
  }

  render(currentCavalryPos, bonusTroops) {
    this.#container.innerHTML = "";

    const cavalryTable = document.createElement("table");

    const tbody = document.createElement("tbody");

    const row1 = document.createElement("tr");
    for (let i = 0; i < bonusTroops.length; i++) {
      const bonus = document.createElement("td");
      if (i === currentCavalryPos) {
        const gc = document.createElement("img");
        gc.src = "../images/goldenCavalry.png"
        bonus.appendChild(gc);
      }
      row1.appendChild(bonus);
    }

    const row2 = document.createElement("tr");
    for (let i = 0; i < bonusTroops.length; i++) {
      const bonus = document.createElement("td");
      bonus.textContent = bonusTroops[i];
      row2.appendChild(bonus);
    }

    tbody.appendChild(row1);
    tbody.appendChild(row2);
    cavalryTable.appendChild(tbody);

    this.#container.appendChild(cavalryTable);
  }
}
