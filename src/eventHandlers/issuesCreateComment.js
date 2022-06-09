/**
 * @description Event Handler Class to create an Issue comment in an Issue that triggered the event
 * @param
 *  body: data
 */

const util = require('util')
const Command = require('./common/command.js')
let instance = null

class issuesCreateComment extends Command {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super()
  }

  /**
   * Singleton pattern
   */
  static getInstance() {
    if (!instance) {
      instance = new issuesCreateComment()
    }

    return instance
  }

  /**
   * 
   * @param {*} context 
   * @param {*} data 
   */
  execute(context, params) {
    context.log('createIssueComment.execute()')
    let comment = params.comment

    try {
      if (typeof comment == 'undefined') {
        comment = 'Nothing to say...!'
      }

      const issueComment = context.octokit.issues.createComment(        {
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        issue_number: context.payload.issue.number,
        body: comment
      })

      return issueComment
    } catch (err) {
      context.log.error('createIssueComment.execute() failed')
      context.log.error('err: ' + util.inspect(err))
      return Promise.resolve()
    }
  }
}

module.exports = issuesCreateComment