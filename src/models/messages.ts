interface Message {
  id: string;
  message: string;
  playerId: string;
  timestamp: number;
  recipientId?: string;
}

type GameMessages = Record<string, Message[]>;

type IdGenerator = () => string;

export default class Messages {
  private messages: GameMessages;
  private timestamp: () => number;
  private uniqueId: IdGenerator;

  constructor(timestamp: () => number, uniqueId: IdGenerator) {
    this.messages = {};
    this.timestamp = timestamp;
    this.uniqueId = uniqueId;
  }

  private ensureGameExists(gameId: string) {
    if (!(gameId in this.messages)) {
      this.messages[gameId] = [];
    }
  }

  public saveMessage(gameId: string, message: string, senderId: string, recipientId?: string): number {
    this.ensureGameExists(gameId);

    const newMessage: Message = {
      id: this.uniqueId(),
      message,
      playerId: senderId,
      recipientId,
      timestamp: this.timestamp(),
    };

    return this.messages[gameId].push(newMessage);
  }

  public getGameMessages(gameId: string, since?: number): Message[] {
    if (!(gameId in this.messages)) return [];

    const allMessages = this.messages[gameId];
    if (since === undefined) return allMessages;

    return allMessages.filter(msg => msg.timestamp > since && !msg.recipientId);
  }

  public getPersonalMessages(gameId: string, recipientId: string, since?: number): Message[] {
    if (!(gameId in this.messages)) return [];

    return this.messages[gameId]
      .filter(message => message.recipientId === recipientId)
      .filter(message => since === undefined || message.timestamp > since);
  }
}
