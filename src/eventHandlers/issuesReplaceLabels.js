/**
 * @description Replace ALL labels of an Issue with a list of new Labels
 * @param data[]: Array of Labels
 * 
 */

const util = require('util')
const Command = require('./common/command.js')
let instance = null

class issuesReplaceLabels extends Command {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super()
  }

  /**
   * Singleton pattern
   */
  static getInstance() {
    if (!instance) {
      instance = new issuesReplaceLabels()
    }

    return instance
  }

  /**
   * 
   * @param {*} context 
   * @param {*} data 
   */
  async execute(context, data) {
    context.log('issuesReplaceLabels.execute()')
    let issueLabels
    if (typeof data == 'undefined') {
      data = []
    }

    issueLabels = context.issue(
      {
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        issue_number: context.payload.issue.number
      }
    )
    await context.github.issues.removeAllLabels(issueLabels)

    issueLabels = context.issue(
      {
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        issue_number: context.payload.issue.number,
        labels: data
      }
    )

    return context.github.issues.addLabels(issueLabels)
  }
}

module.exports = issuesReplaceLabels