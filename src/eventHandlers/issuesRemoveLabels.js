/**
 * @description Event Handler Class to remove a Lable from an Issue
 * @param 
 *   name
 */

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
    context.log('issuesRemoveLabels.execute()')

    if (typeof data == 'undefined') {
      data = []
    }

    const labels = await this.getAllIssueLabels(context, context.payload.issue.number)

    data.forEach(label => {
      if (labels.includes(label)) {
        const issueLabel = context.issue(
          {
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            issue_number: context.payload.issue.number,
            name: label
          }
        )
        context.github.issues.removeLabel(issueLabel)
      }
    })

    return 200
  }
}

module.exports = issuesRemoveLabels
