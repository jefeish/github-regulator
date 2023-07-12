/**
 * @description Event Handler Class to control Team assignment for a Repo.
 *              Example: Prevent team assignment, if user is not a memeber of the team that is being assigned. 
 * @author: Juergen Efeish @jefeish
 * @param
 * 
 */

const util = require('util')
const Command = require('./common/command.js')
let instance = null


class teamPermissionController extends Command {

  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super()
  }

  /**
   * Singleton pattern
   */
  static getInstance() {
    if (!instance) {
      instance = new teamPermissionController()
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

    context.log.info('teamPermissionController.execute')
    const teamMembership = {}
    let sender = ''
    try {

      if (typeof params == 'undefined') {
        params = 'NA'
      }

      sender = context.payload.sender.login
      context.log.debug('sender: '+ context.payload.sender.login)
      // context.log.debug('teamPermissionController.execute: params: ' + params)
      // context.log.debug('teamPermissionController.execute: context: ' + util.inspect(context))
      // context.log.debug('teamPermissionController.execute: context.payload: ' + util.inspect(context.payload))


      // // List teams for the authenticated user
      // const teams = (await context.octokit.teams.listForAuthenticatedUser()).data
      // context.log.debug('teamPermissionController.execute: listForAuthenticatedUser: ' + util.inspect(teams))

      // // Get a team by name
      // const team1 = (await context.octokit.teams.getByName({
      //   org: context.payload.repository.owner.login,
      //   team_slug: context.payload.team.slug
      // })).data

      // context.log.debug('teamPermissionController.execute: teams.getByName: ' + util.inspect(team1))
      context.log.debug('111')

      // Check if user is a member of the team
      teamMembership = (await context.octokit.teams.getMembershipForUserInOrg({
        org: context.payload.repository.owner.login,
        team_slug: context.payload.team.slug,
        username: sender
      }))
      context.log.debug('222')

      if (teamMembership.status == 200) {
        context.log.debug('user is a member of team: ' + context.payload.team.slug)
        context.log.debug('teamPermissionController.execute: teams.getMembershipForUserInOrg: ' + util.inspect(teamMembership))

      }

    } catch (err) {
      if(err.status == 404) {
        context.log.debug('user is not a member of team: ' + context.payload.team.slug)
        
        // Remove the team from the repository, since the user is not a member of the team
        context.octokit.teams.removeRepoInOrg({
          org: context.payload.repository.owner.login,
          team_slug: context.payload.team.name,
          owner: sender,
          repo: context.payload.repository.name
        })
      }
      context.log.error(err)
    }
  }
}

module.exports = teamPermissionController