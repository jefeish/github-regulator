/**
 * @description Event Handler Class to assign one or more members to an Issue
 *              Note: Please use this with an Issue-Event
 * @param
 * assignees: 
 *   - jefeish
 */

const Command = require('./common/command.js')
let instance = null

class issuesAddAssignees extends Command {
    // eslint-disable-next-line no-useless-constructor
    constructor() {
        super()
    }

    /**
     * @description Singleton pattern
     */
    static getInstance() {
        if (!instance) {
            instance = new issuesAddAssignees()
        }

        return instance
    }
    
    /** 
     * @param {*} context 
     * @param {*} params 
     */
    execute(context, params) {
        const assignees = params.assignees
        context.log.info('issuesAddAssignees.execute()')

        // Check if the event is an Issue-Event
        if (!context.payload.issue) {
            context.log.error('issuesAddAssignees.execute() - Incorrect Event')
            context.log.error('This Event Handler can only be used with an Issue-Event [issue.created, issue.updated, issue.closed, etc]')
            return null
        } 
            
        if (typeof assignees == 'undefined') {
            assignees = []
        }

        const issue = context.issue(
            {
                owner: context.payload.repository.owner.login,
                repo: context.payload.repository.name,
                issue_number: context.payload.issue.number,
                assignees: assignees
            }
        )

        return context.github.issues.addAssignees(issue)
    }
}

module.exports = issuesAddAssignees