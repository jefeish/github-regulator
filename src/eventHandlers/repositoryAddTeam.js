/**
 * @description Event Handler Class to add a Team to a Repository
 * @param
 * teams:
 *   - name: B-Team
 *     permission: write
 *   - name: foo
 *     permission: read
 */

const Command = require('./common/command.js')
const util = require('util')
let instance = null

class repositoryAddTeam extends Command {

  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super()
  }

  /**
   * Singleton pattern
   */
  static getInstance() {
    if (!instance) {
      instance = new repositoryAddTeam()
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

    context.log.trace('context: ', context)
    context.log.trace('params: ', params)

    try {
      if (typeof params == 'undefined') {
        context.log('error: Incorrect parameters [' + params + ']')
        return 1
      }

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

module.exports = repositoryAddTeam