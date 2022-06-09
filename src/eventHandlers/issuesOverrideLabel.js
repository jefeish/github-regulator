/**
 * @description Override an issue label with another one, keep any other label
 * @param 
 *   data[0]: old label
 *   data[1]: new label
 * 
 */

const util = require('util')
const Command = require('./common/command.js')
let instance = null

class issuesOverrideLabel extends Command {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super()
  }

  /**
   * Singleton pattern
   */
  static getInstance() {
    if (!instance) {
      instance = new issuesOverrideLabel()
    }

    return instance
  }

  /**
   * Utility function
   * @param {*} Conext 
   */
  async getAllIssueLabels(context, issueNumber) {
    const listLabels = context.issue(
      {
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        issue_number: issueNumber
      }
    )

    const labels = await context.github.issues.listLabelsOnIssue(listLabels)
    let names = []
    labels.data.forEach(label => {
      names.push(label.name)
    })

    return names
  }

  /**
   * 
   * @param {*} context 
   * @param {*} data 
   */
  async execute(context, data) {
    context.log('issuesOverrideLabel.execute()')
    let ctx = {}

    if (typeof data == 'undefined') {
      data = []
    }

    const labels = await this.getAllIssueLabels(context, context.payload.issue.number)
    console.log('labels: >' + labels + '<')

    // Only remove the label if it exists
    if (labels.includes(data[0])) {
      ctx = {
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        issue_number: context.payload.issue.number,
        name: data[0]
      }
      context.github.issues.removeLabel(ctx)
    }

    // Only add the label if it does not exist
    if (!labels.includes(data[1])) {
      ctx = {
        owner: context.payload.repository.owner.login,
        issue_number: context.payload.issue.number,
        labels: [data[1]],
        repo: context.payload.repository.name
      }
      await context.github.issues.addLabels(ctx)
    }
    return 200
  }
}

module.exports = issuesOverrideLabel