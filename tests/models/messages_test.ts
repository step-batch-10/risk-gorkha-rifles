import { describe, it } from "testing";
import { assertEquals } from "assert";
import Messages from "../../src/models/messages.ts";

const createMessagesInstance = () => {
  let id = 1;
  let time = 1000;
  const idGen = () => (id++).toString();
  const timeGen = () => time++;
  return new Messages(timeGen, idGen);
};

describe('saveMessage', () => {
  it('should save a message to a new game', () => {
    const messages = createMessagesInstance();

    const count = messages.saveMessage("game1", "Hello, World!", "player1");

    assertEquals(count, 1);
  });

  it('should save a message with a recipient', () => {
    const messages = createMessagesInstance();

    messages.saveMessage("game1", "Personal message", "player1", "player2");

    assertEquals(messages.getGameMessages("game1")[0], {
      id: "1",
      message: "Personal message",
      playerId: "player1",
      recipientId: "player2",
      timestamp: 1000
    });
  });

  it('should save multiple messages to an existing game', () => {
    const messages = createMessagesInstance();

    messages.saveMessage("game1", "Hello, World!", "player1");
    const count = messages.saveMessage("game1", "Another message", "player2");

    assertEquals(count, 2);
  });
});

describe('getGameMessages', () => {
  it('should return all messages for a game if no timestamp is given', () => {
    const messages = createMessagesInstance();

    messages.saveMessage("game1", "Message 1", "player1");
    messages.saveMessage("game1", "Message 2", "player2");

    const result = messages.getGameMessages("game1");

    assertEquals(result.length, 2);
    assertEquals(result[0].message, "Message 1");
    assertEquals(result[1].message, "Message 2");
  });

  it('should return only messages after a given timestamp', () => {
    const messages = createMessagesInstance();

    messages.saveMessage("game1", "Message 1", "player1");
    messages.saveMessage("game1", "Message 2", "player2");
    messages.saveMessage("game1", "Message 3", "player3");

    const result = messages.getGameMessages("game1", 1000);

    assertEquals(result.length, 2);
    assertEquals(result[0].message, "Message 2");
    assertEquals(result[1].message, "Message 3");
  });

  it('should return empty array if no message is newer than the given timestamp', () => {
    const messages = createMessagesInstance();

    messages.saveMessage("game1", "Message 1", "player1");
    messages.saveMessage("game1", "Message 2", "player2");

    const result = messages.getGameMessages("game1", 2000);

    assertEquals(result, []);
  });

  it('should return empty array if game does not exists', () => {
    const messages = createMessagesInstance();

    const result = messages.getGameMessages("game1", 2000);

    assertEquals(result, []);
  });
});

describe('getPersonalMessages', () => {
  it('should return only the public and perosonal messages for a specific recipient', () => {
    const messages = createMessagesInstance();

    messages.saveMessage("game1", "Public message", "player1");
    messages.saveMessage("game1", "Private message to player2", "player1", "player2");
    messages.saveMessage("game1", "Private message to player3", "player1", "player3");

    const result = messages.getPersonalMessages("game1", "player2");

    assertEquals(result.length, 1);
    assertEquals(result[0].message, "Private message to player2");
  });

  it('should return only messages for the particular recipient', () => {
    const messages = createMessagesInstance();

    messages.saveMessage("game1", "Public message", "player1");
    messages.saveMessage("game1", "Private message to player2", "player1", "player2");
    messages.saveMessage("game1", "Private message to player3", "player1", "player3");

    const result = messages.getPersonalMessages("game1", "player2", 1000);

    assertEquals(result.length, 1);
    assertEquals(result[0].message, "Private message to player2");
  });

  it('should return empty if no message has recipient', () => {
    const messages = createMessagesInstance();

    messages.saveMessage("game1", "Public message", "player1");
    messages.saveMessage("game1", "Private message to player2", "player1", "player2");

    const result = messages.getPersonalMessages("game1", "player3", 1001);

    assertEquals(result, []);
  });

  it('should return all the personal and public messages if timestamp not given', () => {
    const messages = createMessagesInstance();

    messages.saveMessage("game1", "Public message", "player1");
    messages.saveMessage("game1", "Private message to player2", "player1", "player2");
    messages.saveMessage("game1", "Private message to player2", "player4", "player2");

    const result = messages.getPersonalMessages("game1", "player2");

    assertEquals(result.length, 2);
  });

  it('should return empty array if game does not exists', () => {
    const messages = createMessagesInstance();

    const result = messages.getPersonalMessages("game1", "1");

    assertEquals(result, []);
  });
});
