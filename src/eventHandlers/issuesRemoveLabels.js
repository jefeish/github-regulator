/**
 * @description Remove specified Labels from an Issue
 * @param 
 * labels: 
 *   - label_1
 *   - label_2
 */

const util = require('util')
const Command = require('./common/command.js')
let instance = null

class issuesRemoveLabels extends Command {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super()
  }

  /**
   * Singleton pattern
   */
  static getInstance() {
    if (!instance) {
      instance = new issuesRemoveLabels()
    }

    return instance
  }

  /**
   * @description Utility function
   * @param {*} Conext 
   * @return {Promise<Array>}
   */
  async getAllIssueLabels(context, issueNumber) {
    let names = []
    const labels = await context.octokit.issues.listLabelsOnIssue({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      issue_number: issueNumber
    })

    labels.data.forEach(label => {
      names.push(label.name)
    })

    return names
  }

  /**
   * @description 
   * @param {*} context 
   * @param {*} data 
   */
  async execute(context, params) {
    const labelNames = params.labels
    context.log.info('issuesRemoveLabels.execute()')
    context.log.debug('labels: ' + util.inspect(labelNames))

    // Check if the event is an Issue-Event
    if (!context.payload.issue) {
      context.log.error('issuesRemoveLabels.execute() - Incorrect Event')
      context.log.error('This Event Handler can only be used with an Issue-Event [issue.created, issue.updated, issue.closed, etc]')
      return Promise.resolve()
    }

    try {
      if (typeof labelNames !== 'undefined') {

        const labels = await this.getAllIssueLabels(context, context.payload.issue.number)

        labelNames.forEach(label => {
          if (labels.includes(label)) {
            context.octokit.issues.removeLabel({
              owner: context.payload.repository.owner.login,
              repo: context.payload.repository.name,
              issue_number: context.payload.issue.number,
              name: label
            })
          }
        })

        return 200
      }
    } catch (err) {
      context.log.error('issuesRemoveLabels.execute() failed')
      context.log.error('err: ' + util.inspect(err))
      return 500
    }
  }
}

module.exports = issuesRemoveLabels
