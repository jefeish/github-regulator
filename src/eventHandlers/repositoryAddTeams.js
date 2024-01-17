/**
 * @description Event Handler Class to add a Team to a Repository
 * @param
 * teams:
 *   - name: A-Team
 *     permission: admin
 *   - name: B-Team
 *     permission: triage
 *   - name: C-Team
 *     permission: maintain
 *   - name: D-Team
 *     permission: push
 *   - name: foo
 *     permission: pull
 */

const Command = require('./common/command.js')
const util = require('util')
let instance = null

class repositoryAddTeams extends Command {

  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super()
  }

  /**
   * Singleton pattern
   */
  static getInstance() {
    if (!instance) {
      instance = new repositoryAddTeams()
    }

    return instance
  }

  /**
   * @description Main entry point for invocation from client
   * 
   * @param {*} context 
   * @param {*} params 
   */
  async execute(context, params) {

    context.log.info('repositoryAddTeams.execute()')
    context.log.trace('context: ', context)
    context.log.trace('params: ', params)
    context.log.info('info 1')

    // Check if the event is a Repo-Event
    if (!context.payload.repository) {
      context.log.error('repositoryAddTeams.execute() - Incorrect Event')
      context.log.error('This Event Handler can only be used with an Repo-Event [issue.created, issue.updated, issue.closed, etc]')
      return null
    }

    try {
      if (typeof params == 'undefined') {
        context.log('error: Incorrect or missing parameters [' + params + ']')
        return 1
      }
      context.log.info('info 2')
      const teams = params.teams
  
      for (let i = 0; i < teams.length; i++) {

        // FOR REFERENCE SEE: https://octokit.github.io/rest.js

        const org = context.payload.repository.owner.login
        const owner = context.payload.repository.owner.login
        const repo = context.payload.repository.name
        const teamSlug = teams[i].name
        const teamPermission = teams[i].permission
        
        context.log.debug('\nAdding team to repository\n    ORG:        ' + org + '\n    OWNER:      ' + owner + '\n    REPO:       ' + repo + '\n    TEAM_SLUG:  ' + teamSlug + '\n    PERMISSION: ' + teamPermission + '\n')
        
        context.octokit.teams.addOrUpdateRepoPermissionsInOrg({
          org: org,
          owner: owner,
          repo: repo,
          team_slug: teamSlug,
          permission: teamPermission
        })

      }
    }
    catch (err) {
      context.log(err)
    }
  }
}

module.exports = repositoryAddTeams