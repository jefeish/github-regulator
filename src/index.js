/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
const init = require('./init.js')
const ui = require('./ui/policyUI.js')

/**
 * This is the main entrypoint to your Probot app 
 * @param {import('probot').Application} app
 */
module.exports = (app, { getRouter }) => {

  app.log('Starting the Policy - App!')
  init.registerEventHandlers(app)
  
  webUI = new ui(getRouter('/policy-app'))
  webUI.start()
}
