export default class ViewManager {
  #territoryRenderer;
  #playerSidebarRenderer;
  #phaseView;
  #cardsView;
  #players;
  #playerStates;
  #cavalryView;

  #keyActions = {
    keydown: {
      help: ["?", "/"], // Option+m, Option+h
      playerCards: ["*", "(", ")"], // Option+1, Option+2, Option+3
      shortcuts: ["!", "#"], // Option+i, Option+/
      cards: ["~"], // Option+c
    },
    keyup: {
      help: ["?", "/"], // Option+m, Option+h
      playerCards: ["*", "(", ")"], // Option+1, Option+2, Option+3
      shortcuts: ["!", "#"], // Option+i, Option+/
      cards: ["~"], // Option+c
    },
  };
  constructor(
    territoryRenderer,
    playerSidebarRenderer,
    phaseView,
    cardsView,
    cavalryView
  ) {
    this.#territoryRenderer = territoryRenderer;
    this.#playerSidebarRenderer = playerSidebarRenderer;
    this.#phaseView = phaseView;
    this.#cardsView = cardsView;
    this.#registerKeyboardEvents();
    this.#cavalryView = cavalryView;
    this.#registerSettings();
  }

  #registerKeyboardEvents() {
    const handleKeyEvent = (eventType, e) => {
      if (this.#keyActions[eventType].cards.includes(e.key)) {
        return this.#toggleCardsView();
      }

      if (this.#keyActions[eventType].help.includes(e.key)) {
        return this.#toggleHelpModal();
      }

      if (this.#keyActions[eventType].shortcuts.includes(e.key)) {
        return this.#toggleShortcutsModal();
      }

      if (this.#keyActions[eventType].playerCards.includes(e.key)) {
        const playerIndex = this.#keyActions.keydown.playerCards.indexOf(e.key);
        return this.#togglePlayerCard(playerIndex);
      }
    };

    globalThis.document.addEventListener("keydown", (e) =>
      handleKeyEvent("keydown", e)
    );
  }

  #changeTrack(audio, audios, index) {
    const songIndex = Math.abs(index) % audios.length;
    const path = audios.at(songIndex);

    audio.pause(audio, audios, index);
    audio.src = `../../assets/${path}`;
    audio.play();
  }

  #registerSettings() {
    let currentAudio = 0;
    const audios = ["risk_music1.mp3", "risk_music2.mp3"];
    const audio = new Audio(`../../assets/${audios.at(0)}`);
    audio.play();
    const settings = document.getElementById("settings");
    const soundToggle = document.getElementById("toggle");
    const previosTrack = document.getElementById("prevTrack");
    const nextTrack = document.getElementById("nextTrack");
    settings.addEventListener("click", () => {
      settings.addEventListener("click", () => {
        const settingsPopUp = document.getElementById("settingsPopUp");
        settingsPopUp.style.display = "flex";
        const close = settingsPopUp.querySelector(".close");

        close.onclick = () => {
          settingsPopUp.style.display = "none";
        };
      });
    });
    soundToggle.addEventListener("click", this.#handleSound(audio));

    previosTrack.addEventListener("click", () => {
      currentAudio -= 1;
      if (soundToggle.checked) this.#changeTrack(audio, audios, currentAudio);
    });

    nextTrack.addEventListener("click", () => {
      currentAudio += 1;
      if (soundToggle.checked) this.#changeTrack(audio, audios, currentAudio);
    });
  }

  #handleSound(audio) {
    return (e) => {
      if (e.target.checked) {
        audio.play();
      } else {
        audio.pause();
      }
    };
  }

  updatePlayerStats(players, playerStates) {
    this.#players = players;
    this.#playerStates = playerStates;
  }

  renderCalvalryPosition(currentCavalryPos, bonusTroops) {
    this.#cavalryView.render(currentCavalryPos, bonusTroops);
  }

  #showPlayerCard(playerIndex) {
    const playerStatsElem = document.getElementById("player-stats");
    const playerDetailsElem = document.getElementById("player-stats-details");

    if (!playerStatsElem || !playerDetailsElem) {
      console.error("Player stats elements not found in the DOM.");
      return;
    }

    const player = this.#players?.[playerIndex];
    const playerStats = this.#playerStates?.[player?.id];

    if (!player || !playerStats) {
      console.error("Invalid player or player stats data.");
      return;
    }

    playerStatsElem.classList.add("player-stats-opened");
    playerStatsElem.querySelector("h3").textContent = player.username;
    playerStatsElem.querySelector("img").src = player.avatar;

    playerDetailsElem.innerHTML = `
      <ul>
        <li>Continents: ${playerStats.continents.length}</li>
        <li>Territories: ${playerStats.territories.length}</li>
        <li>Territory Cards: ${playerStats.cards.length}</li>
      </ul>
    `;
  }

  #removePlayerCard() {
    const playerStatsElem = document.getElementById("player-stats");
    playerStatsElem.classList.remove("player-stats-opened");
  }

  #togglePlayerCard = (playerIndex) => {
    const playerStatsElem = document.getElementById("player-stats");
    if (!playerStatsElem.classList.contains("player-stats-opened")) {
      this.#showPlayerCard(playerIndex);
    } else {
      this.#removePlayerCard();
    }
  };

  #toggleHelpModal = (isOpen) => {
    const helpModal = document.getElementById("help-modal");

    helpModal.classList.toggle("help-modal-opened", isOpen);
  };

  #toggleShortcutsModal = (isOpen) => {
    const shortcutsModal = document.getElementById("shortcuts-modal");

    shortcutsModal.classList.toggle("help-modal-opened", isOpen);
  };

  #toggleCardsView() {
    if (this.#cardsView.isVisible()) {
      return this.#cardsView.hide();
    }

    this.#cardsView.show();
  }

  highlightTerritory(territoryId) {
    this.#territoryRenderer.highlightTerritory(territoryId);
  }

  handleAttackView(territories) {
    this.#territoryRenderer.handleAttackPhase(territories);
  }

  unhighlightTerritory(territoryId) {
    this.#territoryRenderer.highlightTerritory(territoryId);
  }

  updateTerritoryDetails(territoryDetails) {
    this.#territoryRenderer.updateTerritory(territoryDetails);
  }

  renderAllTerritories(territories, players) {
    this.#territoryRenderer.render(territories, players);
  }

  renderPlayerSidebar(players, currentPlayer) {
    this.#playerSidebarRenderer.render(players, currentPlayer);
  }

  renderCards(cards) {
    this.#cardsView.render(cards);
  }

  startPlayerTurn() {
    this.#phaseView.showDraftPhaseUI();
  }

  showFortificationPhase(actionData) {
    this.#phaseView.showFortificationPhase();
    this.#territoryRenderer.startFortificationPhase(
      actionData.activeTerritories
    );
  }

  stopAttackPhase() {
    this.#territoryRenderer.stopAttackPhase();
  }

  closeAllPhases() {
    this.#phaseView.closeAllPhases();
  }

  resetMapEffects() {
    this.#territoryRenderer.resetMapEffects();
  }

  hideTradeButton() {
    this.#cardsView.hideTradeButton();
  }

  showTradeButton() {
    this.#cardsView.showTradeButton();
  }

  popUpTerritory(territoryId) {
    const territory = document.getElementById(territoryId);
    territory.classList.add("fly");
  }

  focusAttack(attckingTerritory, defendingTerritory) {
    const atkId = document.getElementById(attckingTerritory);
    const dfdId = document.getElementById(defendingTerritory);
    const fight = document.getElementById("fight");
    fight.appendChild(atkId);
    fight.appendChild(dfdId);
    const main = document.getElementById("main-svg");
    main.setAttribute("filter", "url(#blurMe)");
  }

  blurOut(attckingTerritory, defendingTerritory) {
    console.log(attckingTerritory, defendingTerritory);
    const atkId = document.getElementById(attckingTerritory);
    const dfdId = document.getElementById(defendingTerritory);
    console.log("*".repeat(50));
    const main = document.getElementById("main-svg");
    main.appendChild(atkId);
    main.appendChild(dfdId);
    main.removeAttribute("filter");
    atkId.classList.remove("fly");
    dfdId.classList.remove("fly");
    // atkId.setAttribute("filter", "url(#filter_texture)");
    // dfdId.setAttribute("filter", "url(#filter_texture)");
  }
}
