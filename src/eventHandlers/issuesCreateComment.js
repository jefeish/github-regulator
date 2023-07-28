/**
 * @description Event Handler Class to add a comment to an Issue
 *              Note: Please use this with an Issue-Event
 * @param
 * comment: text of the comment
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
    context.log.info('createIssueComment.execute()')
    const comment = params.comment
    context.log.debug('params: ' + util.inspect(params))
    context.log.debug('comment: ' + comment)

    // Check if the event is an Issue-Event
    if (!context.payload.issue) {
      context.log.error('issuesAddAssignees.execute() - Incorrect Event')
      context.log.error('This Event Handler can only be used with an Issue-Event [issue.created, issue.updated, issue.closed, etc]')
      return Promise.resolve()
    }
    
    try {
      if (typeof comment !== 'undefined') {

        context.octokit.issues.createComment({
          owner: context.payload.repository.owner.login,
          repo: context.payload.repository.name,
          issue_number: context.payload.issue.number,
          body: comment
        })

        return 200
      }
      else {
        context.log.info('No comment to add')
        return Promise.resolve()
      }
    } catch (err) {
      context.log.error('createIssueComment.execute() failed')
      context.log.error('err: ' + util.inspect(err))
      return 500
    }
  }
}

module.exports = issuesCreateComment