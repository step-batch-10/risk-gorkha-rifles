export default class EventBus {
  constructor() {
    this.listeners = {};
  }

  #isValidEvent(event) {
    return event in this.listeners;
  }

  on(event, callback) {
    if (!this.#isValidEvent(event)) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  emit(event, ...data) {
    return (this.listeners[event] || []).map(cb => cb(...data));
  }
}