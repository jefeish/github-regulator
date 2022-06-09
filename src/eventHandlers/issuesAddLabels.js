/**
 * @description Event Handler Class to add one or more Labels to an Issue
 * @param
 */

const util = require('util')

//  issuesAddLabels
const Command = require('./common/command.js')

class issuesAddLabels extends Command {

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
        context.log.info('issuesAddLabels.execute')
        try {
            if (typeof params == 'undefined') {
                params = ''
            }
            context.log.debug('params: ' + util.inspect(params))

            if (params.length > 0) {
                const issueLabels = context.issue(
                    {
                        owner: context.payload.repository.owner.login,
                        repo: context.payload.repository.name,
                        issue_number: context.payload.issue.number,
                        labels: bug
                    }
                )

                return context.github.issues.addLabels(issueLabels)
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