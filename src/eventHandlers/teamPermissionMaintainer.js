/**
 * @description Event Handler Class to maintain Team permissions for a Repo.
 * @param
 * 
 */

const util = require('util')
const Command = require('./common/command.js')
let instance = null


class teamPermissionMaintainer extends Command {

  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super()
  }

  /**
   * Singleton pattern
   */
  static getInstance() {
    if (!instance) {
      instance = new teamPermissionMaintainer()
    }

    return instance
  }

  /**
   * @description Main entry point for invocation from client
   * 
   * @param {*} context 
   * @param {*} data 
   */
  async execute(context, data) {

    context.log.info('teamPermissionMaintainer.execute')
    
    // pull - team members can pull, but not push to or administer this repository.
    // push - team members can pull and push, but not administer this repository.
    // admin - team members can pull, push and administer this repository.
    // maintain - team members can manage the repository without access to sensitive or destructive actions. Recommended for project managers. Only applies to repositories owned by organizations.
    // triage - team members can proactively manage issues and pull requests without write access. Recommended for contributors who triage a repository. Only applies to repositories owned by organizations.
    //
    // If no permission is specified, the team's permission attribute will be used to determine what permission to grant the team on this repository.
    
    try {

      if (typeof data == 'undefined') {
        data = 'NA'
      }

      context.log.debug('changes.repository.permissions.from: '+ util.inspect(context.payload.changes.repository.permissions.from))
      const original_role_name = context.payload.changes.repository.permissions.from
      const role_name = context.payload.repository.role_name
      let role = ''

      if (original_role_name.admin === true) {
        role = 'admin'
      } else if (original_role_name.push === true) {
        role = 'push'
      } else if (original_role_name.pull === true) {
        role = 'pull'
      } else {
        role = 'pull'
      }

      return await context.octokit.teams.addOrUpdateRepoPermissionsInOrg({
        org: context.payload.repository.owner.login,
        team_slug: context.payload.team.slug,
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        permission: role
      });

    } catch (err) {
      context.log(err)
      return -1
    }
  }
}

module.exports = teamPermissionMaintainer