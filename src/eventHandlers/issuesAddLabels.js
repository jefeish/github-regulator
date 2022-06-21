/**
 * @description Event Handler Class to assign one or more labels to an Issue
 *              Note: Please use this with an Issue-Event
 * @param
 * labels:
 *   - label
 */

const util = require('util')

//  issuesAddLabels
const Command = require('./common/command.js')

class issuesAddLabels extends Command {
    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super()
    }

    /**
     * Singleton pattern
     */
    static getInstance() {
        if (!instance) {
            instance = new issuesAddLabels()
        }

        return instance
    }

    execute(context, params) {
        const labels = params.labels
        context.log.info('issuesAddLabels.execute')

        // Check if the event is an Issue-Event
        if (!context.payload.issue) {
            context.log.error('issuesAddAssignees.execute() - Incorrect Event')
            context.log.error('This Event Handler can only be used with an Issue-Event [issue.created, issue.updated, issue.closed, etc]')
            return Promise.resolve()
        }

        try {
            if (typeof labels !== 'undefined') {

                context.log.debug('labels: ' + util.inspect(labels))

                const issueLabels = context.octokit.issues.addLabels(
                {
                    owner: context.payload.repository.owner.login,
                    repo: context.payload.repository.name,
                    issue_number: context.payload.issue.number,
                    labels: labels
                })
                return issueLabels
            }
            else {
                context.log.info('No labels to add')
                return Promise.resolve()
            }
        } catch (err) {
            context.log.error('issuesAddLabels.execute() failed')
            context.log.error('err: ' + util.inspect(err))
            return Promise.resolve()
        }
    }
}

module.exports = issuesAddLabels