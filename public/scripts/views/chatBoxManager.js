const getUserIdFromCookies = () => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === 'userId') {
      return decodeURIComponent(value);
    }
  }
  return null;
};

export default class ChatBox {
  constructor({ players, fetchMessagesApi, sendMessageApi, pollInterval = 3000 }) {
    this.fetchMessagesApi = fetchMessagesApi;
    this.sendMessageApi = sendMessageApi;
    this.pollInterval = pollInterval;
    this.currentTab = 'global';
    this.messages = { global: [], personal: {} };
    this.lastTimestamp = 0;
    this.players = players;
    this.myPlayerId = getUserIdFromCookies();    
  }

  init() {
    this.renderChatBox();
    this.registerEvents();
    this.startPolling();
  }

  renderChatBox() {
    const container = document.createElement('div');
    container.classList.add('chat-container');

    container.innerHTML = `
          <div class="chat-tabs">
              <button class="tab-btn active" data-tab="global">Global Chat</button>
              ${this.players.filter(player => player.userId !== this.myPlayerId).map(player => `
                  <button class="tab-btn" data-tab="${player.userId}">
                      <img src="${player.avatar}" class="avatar"> ${player.username}
                  </button>
              `).join('')}
          </div>
          <div class="chat-messages"></div>
          <div class="chat-input">
              <input type="text" placeholder="Type a message..." />
              <button class="send-btn">Send</button>
          </div>
      `;
    document.body.appendChild(container);

    this.container = container;
    this.messagesContainer = container.querySelector('.chat-messages');
    this.inputField = container.querySelector('.chat-input input');
    this.sendButton = container.querySelector('.send-btn');
  }

  registerEvents() {
    this.container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchTab(e.currentTarget.dataset.tab);
      });
    });

    this.sendButton.addEventListener('click', () => {
      this.sendMessage();
    });

    this.inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  switchTab(tabId) {
    this.currentTab = tabId;

    this.container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    const activeBtn = this.container.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }

    this.renderMessages();
  }


  renderMessages() {
    let messages = [];
    if (this.currentTab === 'global') {
      messages = this.messages.global;
    } else {
      messages = this.messages.personal[this.currentTab] || [];
    }

    this.messagesContainer.innerHTML = messages.map(msg => {
      return `<div class="chat-message">
              <strong>${msg.playerName}:</strong> ${msg.message}
          </div>
      `;
    }).join('');

    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  async sendMessage() {
    const messageText = this.inputField.value.trim();
    if (!messageText) return;

    if (this.currentTab === 'global') {
      await this.sendMessageApi(messageText);
    } else {
      await this.sendMessageApi(messageText, this.currentTab);
    }

    this.inputField.value = '';
    await this.fetchMessages();
  }

  async fetchMessages() {
    try {
      const res = await this.fetchMessagesApi(this.lastTimestamp);
      const { gameMessages, personalMessages } = res;
      console.log(personalMessages);

      gameMessages.forEach(msg => {
        this.messages.global.push({
          playerName: this.getPlayerName(msg.playerId),
          message: msg.message,
          timestamp: msg.timestamp
        });
        this.lastTimestamp = Math.max(this.lastTimestamp, msg.timestamp);
      });

      personalMessages.forEach(msg => {
        const chatId = (msg.playerId === this.myPlayerId) ? msg.recipientId : msg.playerId;
        if (!this.messages.personal[chatId]) {
          this.messages.personal[chatId] = [];
        }
        this.messages.personal[chatId].push({
          playerName: this.getPlayerName(msg.playerId),
          message: msg.message,
          timestamp: msg.timestamp
        });
        this.lastTimestamp = Math.max(this.lastTimestamp, msg.timestamp);
      });

      this.renderMessages();
    } catch (error) {
      console.error('Error fetching messages', error);
    }
  }

  startPolling() {
    setInterval(() => {
      this.fetchMessages();
    }, this.pollInterval);
  }

  getPlayerName(playerId) {
    const player = this.players.find(p => p.userId === playerId);
    return player ? player.username : 'Unknown';
  }
}
