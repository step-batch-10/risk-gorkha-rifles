import { assertEquals } from 'assert';
import { describe, it } from 'testing';
import Session from '../../src/models/session.ts';

describe('tests for session model', () => {
  it('should create sessions', () => {
    const session = new Session();
    const actual = session.createSession("john");
    const expected = new Map();
    expected.set('1', 'john');

    assertEquals(actual, "1");
    assertEquals(session.sessions, expected);
  });

  it('should delete session', () => {
    const session = new Session();
    session.createSession("john");
    const actual = session.deleteSession("1");

    const expected = new Map();

    assertEquals(actual, true);
    assertEquals(session.sessions, expected);
  });

  it('should delete all the sessions of user', () => {
    const uniqueId = () => {
      let i = 0;

      return () => (i++).toString();
    };

    const session = new Session(uniqueId());
    session.createSession("ankita");
    session.createSession("john");
    const sessions = session.deleteUsersSession("ankita");

    const expected = new Map();
    expected.set('1', 'john');

    assertEquals(sessions, expected);
  });

  it('should find the user by id', () => {
    const uniqueId = () => {
      let i = 0;

      return () => (i++).toString();
    };

    const session = new Session(uniqueId());
    session.createSession("ankita");
    session.createSession("john");

    const actual = session.findById("1");
    assertEquals(actual, "john");
  });

  it('should return undefined if session is not valid', () => {
    const uniqueId = () => {
      let i = 0;

      return () => (i++).toString();
    };

    const session = new Session(uniqueId());

    const actual = session.findById("1");
    assertEquals(actual, undefined);
  });
});
