const handlers = new Map();

const emitter = {
  on(type, handler) {
    const listeners = handlers.get(type) ?? [];
    listeners.push(handler);
    handlers.set(type, listeners);
  },

  off(type, handler) {
    const listeners = handlers.get(type);
    if (!listeners) return;

    if (!handler) {
      handlers.delete(type);
      return;
    }

    const remaining = listeners.filter((listener) => listener !== handler);
    if (remaining.length) handlers.set(type, remaining);
    else handlers.delete(type);
  },

  emit(type, event) {
    handlers.get(type)?.slice().forEach((handler) => handler(event));
    handlers.get("*")?.slice().forEach((handler) => handler(type, event));
  },

  all: handlers,
};

export default emitter;
