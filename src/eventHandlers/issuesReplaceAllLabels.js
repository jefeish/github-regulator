/**
 * @description Replace ALL labels of an Issue with a list of new Labels
 * @param 
 * labels:
 *   - label
 * 
 */

const util = require('util')
const Command = require('./common/command.js')
let instance = null

class issuesReplaceAllLabels extends Command {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super()
  }

  /**
   * Singleton pattern
   */
  static getInstance() {
    if (!instance) {
      instance = new issuesReplaceAllLabels()
    }

    return instance
  }

  /**
   * 
   * @param {*} context 
   * @param {*} params 
   */
  async execute(context, params) {
    context.log.info('issuesReplaceAllLabels.execute()')
    const labels = params.labels

    // Check if the event is an Issue-Event
    if (!context.payload.issue) {
      context.log.error('issuesReplaceAllLabels.execute() - Incorrect Event')
      context.log.error('This Event Handler can only be used with an Issue-Event [issue.created, issue.updated, issue.closed, etc]')
      return Promise.resolve()
    }

    try {
      if (typeof params !== 'undefined') {

        await context.octokit.issues.removeAllLabels({
          owner: context.payload.repository.owner.login,
          repo: context.payload.repository.name,
          issue_number: context.payload.issue.number
        })

        await context.github.issues.addLabels({
          owner: context.payload.repository.owner.login,
          repo: context.payload.repository.name,
          issue_number: context.payload.issue.number,
          labels: labels
        })
        return 200
      }
    } catch (err) {
      context.log.error('issuesReplaceAllLabels.execute() failed')
      context.log.error('err: ' + util.inspect(err))
      return 500
    }
  }
}

module.exports = issuesReplaceAllLabels