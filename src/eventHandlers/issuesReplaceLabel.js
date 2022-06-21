/**
 * @description Override an issue label with another one, keep other all labels
 * @param 
 * oldLabel: old_label
 * newLabel: new_label
 * 
 */

const util = require('util')
const Command = require('./common/command.js')
let instance = null

class issuesReplaceLabel extends Command {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super()
  }

  /**
   * Singleton pattern
   */
  static getInstance() {
    if (!instance) {
      instance = new issuesReplaceLabel()
    }

    return instance
  }

  /**
   * Utility function
   * @param {*} Conext 
   * @retunr {Promise<Array>}
   */
  async getAllIssueLabels(context, issueNumber) {

    const labels = await context.octokit.issues.listLabelsOnIssue({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      issue_number: issueNumber
    })

    let labelNames = []
    labels.data.forEach(label => {
      labelNames.push(label.name)
    })

    return labelNames
  }

  /**
   * 
   * @param {*} context 
   * @param {*} params 
   */
  async execute(context, params) {
    context.log.info('issuesReplaceLabel.execute()')
    let ctx = {}

    // Check if the event is an Issue-Event
    if (!context.payload.issue) {
      context.log.error('issuesAddAssignees.execute() - Incorrect Event')
      context.log.error('This Event Handler can only be used with an Issue-Event [issue.created, issue.updated, issue.closed, etc]')
      return Promise.resolve()
    }
    try {
      if (typeof params.newLabel !== 'undefined') {
        const labels = await this.getAllIssueLabels(context, context.payload.issue.number)
        context.log.debug('labels: >' + labels + '<')

        // Only remove the label if it exists
        if (labels.includes(params.oldLabel)) {
          context.octokit.issues.removeLabel({
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            issue_number: context.payload.issue.number,
            name: params.oldLabel
          })
        }

        // Only add the label if it does not exist
        if (!labels.includes(params.newLabel)) {
          await context.octokit.issues.addLabels({
            owner: context.payload.repository.owner.login,
            issue_number: context.payload.issue.number,
            labels: [params.newLabel],
            repo: context.payload.repository.name
          })
        }
        return 200
      }
    } catch (err) {
      context.log.error('issuesReplaceLabel.execute() failed')
      context.log.error('err: ' + util.inspect(err))
      return 500
    }
  }
}

module.exports = issuesReplaceLabel