/**
 * Trying to implement the 'command pattern' in NodeJS
 * A poor man's interface
 */
class Command {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    if (!this.execute) {
      throw new Error("This is not a valid 'EventHandler' class. The class must implement an 'execute()' method!");
    }
  }
}

module.exports = Command
