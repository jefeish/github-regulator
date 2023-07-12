/**
 * @description Event Handler Class to send Email notes
 * @param
 * sender: <aBot>
 * recipients:
 *   - <user-1>
 *   - <user-2>
 * subject: a test message
 * message: Hello from your messenger
 */

const Command = require('./common/command.js')
const sendmail = require('sendmail')();
const util = require('util')
let instance = null

class emailToRequester extends Command {

  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super()
  }

  /**
   * Singleton pattern
   */
  static getInstance() {
    if (!instance) {
      instance = new emailToRequester()
    }

    return instance
  }

  /**
   * @description Main entry point for invocation from client
   * 
   * @param {*} context 
   * @param {*} params 
   */
  execute(context, params) {
    context.log.debug('execute emailToRequester')

    try {

      if (typeof params == 'undefined') {
        params = 'NA'
        context.log.error('Missing Parameters for emailToRequester')
      }
      
      // use the 'sender' parameter, if provided, otherwise use the Requester
      const sender = params.sender || context.payload.sender.login + '@no-reply.com'

      for (let i = 0; i < params.recipients.length; i++) {
        sendmail({
          from: sender,
          to: params.recipients[i],
          subject: params.subject,
          html: params.message,
        }, function (err, reply) {
          context.log.error(err && err.stack);
          context.log.error(reply);
        })
      }
      return 0
    } catch (err) {
      context.log(err)
      return -1
    }
  }
}

module.exports = emailToRequester