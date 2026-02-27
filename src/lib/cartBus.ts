const bus = new EventTarget();

export const cartBus = {
  on: (type: string, handler: EventListenerOrEventListenerObject) => {
    bus.addEventListener(type, handler as EventListener);
  },
  off: (type: string, handler: EventListenerOrEventListenerObject) => {
    bus.removeEventListener(type, handler as EventListener);
  },
  emit: (type: string, detail?: any) => {
    bus.dispatchEvent(new CustomEvent(type, { detail }));
  },
};

export default cartBus;
