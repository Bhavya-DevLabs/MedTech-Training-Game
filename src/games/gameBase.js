// Base class for all games - mandatory interface
// Every game extends this and implements: init(), render(), destroy()

export class GameBase {
  constructor() {
    if (new.target === GameBase) {
      throw new Error('GameBase is abstract and cannot be instantiated directly');
    }
  }
  
  init(config, callbacks) {
    throw new Error('init() must be implemented by game subclass');
  }
  
  render(container) {
    throw new Error('render() must be implemented by game subclass');
  }
  
  destroy() {
    throw new Error('destroy() must be implemented by game subclass');
  }
}
