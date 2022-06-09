/**
 * This code maps the 'eventHandler' classes 
 * 
 * 
 */

const fs = require('fs')
const yaml = require('js-yaml')
const path_module = require('path');

/**
 * 
 * Implement a simple 'command pattern'
 * | @param app
 */
exports.registerEventHandlers = app => {
  app.log('registerEventHandlers')

  try {
    const fileContents = fs.readFileSync('./src/eventHandlers.yml', 'utf8')
    const events = yaml.safeLoad(fileContents)
    let handlers = []
    let eventRegistry = {}

    Object.keys(events).forEach(event => {
      events[event].forEach(handler => {
        // instantiate the 'eventHandler' class
        const Cmd = require(process.cwd() + '/src/eventHandlers/' + handler + '.js')
        const action = Cmd.getInstance()
        // create a list of handler names for logging
        handlers.push(handler);
        // register the WebHook event and map it to an 'eventHandler' class
        app.on(event, async (context, data) => action.execute(context, data))
      })

      // create a map of event names to handler names
      if (handlers.length) {
        eventRegistry[event] = handlers
        handlers = []
      }
    })

    // write the event registry to the log
    if (eventRegistry) {
      Object.keys(eventRegistry).forEach(event => {
        app.log.info( event +', '+ JSON.stringify(eventRegistry[`${event}`])
      )})
    }
  } catch (handler) {
    app.log.error(handler)
  }
}
