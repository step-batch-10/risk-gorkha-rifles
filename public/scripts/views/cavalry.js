export default class GoldenCavalry {
  #container;

  constructor() {
    this.#container = document.querySelector(".golden-cavalry");
  }

  render(currentCavalryPos, bonusTroops) {
    console.log(currentCavalryPos,bonusTroops);
    
    this.#container.innerHTML = "";

    const cavalryTable = document.createElement("table");

    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>Position</th>
        <th>Troops</th>
      </tr>
    `;

    const tbody = document.createElement("tbody");
    for (let i = 0; i < bonusTroops.length; i++) {
      const row = document.createElement("tr");

      const positionCell = document.createElement("td");
      positionCell.textContent = i + 1;

      const troopsCell = document.createElement("td");
      troopsCell.textContent = bonusTroops[i];

      row.appendChild(positionCell);
      row.appendChild(troopsCell);
      tbody.appendChild(row);
    }

    cavalryTable.appendChild(thead);
    cavalryTable.appendChild(tbody);

    this.#container.appendChild(cavalryTable);
  }
}
