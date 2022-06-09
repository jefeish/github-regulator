/**
 * @description Event Handler Class to assign one or more members to an Issue
 * @param
 */

const Command = require('./common/command.js')
let instance = null

class issuesAddAssignees extends Command {
    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super()
    }

    /**
     * Singleton pattern
     */
    static getInstance() {
        if (!instance) {
            instance = new issuesAddAssignees()
        }

        return instance
    }

    /**
     * 
     * @param {*} context 
     * @param {*} data 
     */
    execute(context, data) {
        context.log('issuesAddAssignees.execute()')

        if (typeof data == 'undefined') {
            data = []
        }

        const issue = context.issue(
            {
                owner: context.payload.repository.owner.login,
                repo: context.payload.repository.name,
                issue_number: context.payload.issue.number,
                assignees: data
            }
        )

        return context.github.issues.addAssignees(issue)
    }
}

module.exports = issuesAddAssignees