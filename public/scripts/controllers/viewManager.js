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
      help: ['m', 'M', 'h', 'H'],
      playerCards: ['1', '2', '3'],
      shortcuts: ['i', 'I', '?'],
    },
    keyup: {
      help: ['m', 'M', 'h', 'H'],
      playerCards: ['1', '2', '3'],
      shortcuts: ['i', 'I', '?'],
    },
  };

  constructor(territoryRenderer, playerSidebarRenderer, phaseView, cardsView, cavalryView ) {
    this.#territoryRenderer = territoryRenderer;
    this.#playerSidebarRenderer = playerSidebarRenderer;
    this.#phaseView = phaseView;
    this.#cardsView = cardsView;
    this.#registerKeyboardEvents();
    this.#cavalryView = cavalryView;
  }

  updatePlayerStats(players, playerStates) {
    this.#players = players;
    this.#playerStates = playerStates;
  }

  renderCalvalryPosition(currentCavalryPos, bonusTroops) {
    this.#cavalryView.render(currentCavalryPos, bonusTroops);
  }

  #showPlayerCard(playerIndex) {
    const playerStatsElem = document.getElementById('player-stats');
    const playerDetailsElem = document.getElementById('player-stats-details');

    if (!playerStatsElem || !playerDetailsElem) {
      console.error('Player stats elements not found in the DOM.');
      return;
    }

    const player = this.#players?.[playerIndex];
    const playerStats = this.#playerStates?.[player?.id];

    if (!player || !playerStats) {
      console.error('Invalid player or player stats data.');
      return;
    }

    playerStatsElem.classList.add('player-stats-opened');
    playerStatsElem.querySelector('h3').textContent = player.username;
    playerStatsElem.querySelector('img').src = player.avatar;

    playerDetailsElem.innerHTML = `
      <ul>
        <li>Continents: ${playerStats.continents.length}</li>
        <li>Territories: ${playerStats.territories.length}</li>
        <li>Territory Cards: ${playerStats.cards.length}</li>
      </ul>
    `;
  }

  #removePlayerCard() {
    const playerStatsElem = document.getElementById('player-stats');
    playerStatsElem.classList.remove('player-stats-opened');
  }

  #togglePlayerCard = (playerIndex, isOpen) => {
    if (isOpen) {
      this.#showPlayerCard(playerIndex);
    } else {
      this.#removePlayerCard();
    }
  };

  #toggleHelpModal = (isOpen) => {
    const helpModal = document.getElementById('help-modal');

    helpModal.classList.toggle('help-modal-opened', isOpen);
  };

  #toggleShortcutsModal = (isOpen) => {
    const shortcutsModal = document.getElementById('shortcuts-modal');

    shortcutsModal.classList.toggle('help-modal-opened', isOpen);
  };

  #registerKeyboardEvents() {
    const handleKeyEvent = (eventType, e) => {
      if (this.#keyActions[eventType].help.includes(e.key)) {
        return this.#toggleHelpModal(eventType === 'keydown');
      }

      if (this.#keyActions[eventType].shortcuts.includes(e.key)) {
        return this.#toggleShortcutsModal(eventType === 'keydown');
      }

      if (this.#keyActions[eventType].playerCards.includes(e.key)) {
        const playerIndex = parseInt(e.key) - 1;
        return this.#togglePlayerCard(playerIndex, eventType === 'keydown');
      }
    };

    globalThis.document.addEventListener('keydown', (e) =>
      handleKeyEvent('keydown', e)
    );

    globalThis.document.addEventListener('keyup', (e) =>
      handleKeyEvent('keyup', e)
    );
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
}
