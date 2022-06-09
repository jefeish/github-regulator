/**
 * @description Event Handler Class to apply BranchProtection to a Repo (GH version 3.4)
 * @param
 * # If the `branch_name` is omitted, the name of the default branch will be used.
 * branch_name: feature*
 * # If set to 'true', this will replace an existing branch protection.
 * overwrite: true
 * # The branch protection settings to apply.
 * rules:
 *    allowsDeletions: true
 *    allowsForcePushes: true
 *    bypassForcePushActorIds:
 *      users: 
 *      - jester01248
 *      teams:
 *      - foo
 *    bypassPullRequestActorIds:
 *      users: 
 *      - jester01248
 *      teams:
 *      - foo
 *    clientMutationId: null
 *    dismissesStaleReviews: true
 *    isAdminEnforced: true
 *    pushActorIds:
 *      users: 
 *      - jester01248
 *      teams:
 *      - foo
 *    requiresApprovingReviews: true
 *    requiredApprovingReviewCount: 2
 *    requiredStatusCheckContexts: []
 *    requiresCodeOwnerReviews: true
 *    requiresCommitSignatures: true
 *    requiresConversationResolution: true
 *    requiresLinearHistory: true
 *    requiresStatusChecks: true
 *    requiresStrictStatusChecks: true
 *    restrictsPushes: true
 *    restrictsReviewDismissals: true
 *    reviewDismissalActorIds:  
 *      users: 
 *      - jester01248
 *      teams:
 *      - foo
 */

 const Command = require('./common/command.js')
 const yaml = require('js-yaml')
 const util = require('util')
 let instance = null
 
 class repositoryBranchProtection extends Command {
 
   // eslint-disable-next-line no-useless-constructor
   constructor() {
     super()
   }
 
   /**
    * Singleton pattern
    */
   static getInstance() {
     if (!instance) {
       instance = new repositoryBranchProtection()
     }
     return instance
   }
 
   /**
    * @description Get the node_id of a user or team
    * @param {*} actors 
    */
   async getNodeIdByName(context, actors) {
     context.log.debug('getNodeIdByName()')
     context.log.debug('actors: ', actors)
 
     let node_id_list = []
   
     if (actors.users) {
       for (let i = 0; i < actors.users.length; i++) {
         let data
         const name = actors.users[i]
         context.log.debug('getByUserName: ', name)
 
         data = await context.octokit.users.getByUsername({
           username: name
         });
 
         if (data.status === 200) {
           node_id_list.push(data.data.node_id)
         }
       }
     }
 
     if (actors.teams) {
       for (let i = 0; i < actors.teams.length; i++) {
         let data
         const name = actors.teams[i]
 
         context.log.debug('getByTeamName: ', name)
         data = await context.octokit.teams.getByName({
           org: context.payload.organization.login,
           team_slug: name,
         });
 
         if (data.status === 200) {
           node_id_list.push(data.data.node_id)
         }
       }
     }
 
     context.log.debug('node_id_list: ' + util.inspect(node_id_list))
     return node_id_list
   }
 
   /**
    * @description Main entry point for invocation from client
    * 
    * @param {*} context 
    * @param {*} params 
    */
   async execute(context, params) {
 
     context.log.info(' \'repositoryBranchProtection.execute()\'')
     context.log.debug(`\nAdding Branch Protection:\n    repository.owner: ${context.payload.repository.owner.login} \n    repository.name: ${context.payload.repository.name}\n    repository.default_branch: ${context.payload.repository.default_branch}\n    params: ${util.inspect(params)}`)
 
     const data = params.rules
     const branch_name = params.branch_name || context.payload.repository.default_branch
 
     if (typeof data == 'undefined') {
       context.log.error(' \'repositoryBranchProtection\' did not receive the correct \'parameters\'')
       context.log.debug(' params:' + util.inspect(params))
       return 1
     }
 
     if (params.overwrite) {
       context.log.info(' \'repositoryBranchProtection\' will overwrite an existing branch protection')
      }
     // Get the node_id of the users and teams
     const bypassForcePushActorNames = await this.getNodeIdByName(context, params.rules.bypassForcePushActorIds)
     const bypassPullRequestActorNames = await this.getNodeIdByName(context, params.rules.bypassPullRequestActorIds)
     const pushActorNames = await this.getNodeIdByName(context, params.rules.pushActorIds)
     const reviewDismissalActorNames = await this.getNodeIdByName(context, params.rules.reviewDismissalActorIds)
 
     // Branch Protection Rules (GH version 3.4)
     // -----------------------------------------
     // allowsDeletions                 (Boolean)   - Can this branch be deleted.
     // allowsForcePushes               (Boolean)   - Are force pushes allowed on this branch.
     // bypassForcePushActorIds         ([ID!])     - A list of User or Team IDs allowed to bypass force push targeting matching branches.
     // bypassPullRequestActorIds       ([ID!])     - A list of User or Team IDs allowed to bypass pull requests targeting matching branches.
     // clientMutationId                (String)    - A unique identifier for the client performing the mutation.
     // dismissesStaleReviews           (Boolean)   - Will new commits pushed to matching branches dismiss pull request review approvals.
     // isAdminEnforced                 (Boolean)   - Can admins overwrite branch protection.
     // pattern                         (String!)   - The glob-like pattern used to determine matching branches.
     // pushActorIds                    ([ID!])     - A list of User, Team or App IDs allowed to push to matching branches.
     // repositoryId                    (ID!)       - The global relay id of the repository in which a new branch protection rule should be created in.
     // requiredApprovingReviewCount    (Int)       - Number of approving reviews required to update matching branches.
     // requiredStatusCheckContexts     ([String!]) - List of required status check contexts that must pass for commits to be accepted to matching branches.
     // requiresApprovingReviews        (Boolean)   - Are approving reviews required to update matching branches.
     // requiresCodeOwnerReviews        (Boolean)   - Are reviews from code owners required to update matching branches.
     // requiresCommitSignatures        (Boolean)   - Are commits required to be signed.
     // requiresConversationResolution  (Boolean)   - Are conversations required to be resolved before merging.
     // requiresLinearHistory           (Boolean)   - Are merge commits prohibited from being pushed to this branch.
     // requiresStatusChecks            (Boolean)   - Are status checks required to update matching branches.
     // requiresStrictStatusChecks      (Boolean)   - Are branches required to be up to date before merging.
     // restrictsPushes                 (Boolean)   - Is pushing to matching branches restricted.
     // restrictsReviewDismissals       (Boolean)   - Is dismissal of pull request reviews restricted.
     // reviewDismissalActorIds         ([ID!])     - A list of User or Team IDs allowed to dismiss reviews on pull requests targeting matching branches.
 
     // Create a new branch protection via GraphQL
     try {
       const response = await context.octokit.graphql(
         `mutation createBranchProtectionRule( 
           $repositoryId: ID!, 
           $allowsDeletions:Boolean, 
           $allowsForcePushes:Boolean, 
           $bypassForcePushActorIds:[ID!],
           $bypassPullRequestActorIds:[ID!],
           $clientMutationId:String, 
           $dismissesStaleReviews:Boolean, 
           $isAdminEnforced:Boolean, 
           $pattern:String!, 
           $pushActorIds:[ID!], 
           $requiredApprovingReviewCount:Int, 
           $requiredStatusCheckContexts:[String!], 
           $requiresApprovingReviews:Boolean, 
           $requiresCodeOwnerReviews:Boolean, 
           $requiresCommitSignatures:Boolean, 
           $requiresConversationResolution:Boolean, 
           $requiresLinearHistory:Boolean, 
           $requiresStatusChecks:Boolean, 
           $requiresStrictStatusChecks:Boolean, 
           $restrictsPushes:Boolean, 
           $restrictsReviewDismissals:Boolean, 
           $reviewDismissalActorIds:[ID!]
         ) 
         {
           createBranchProtectionRule(
               input: {
                 repositoryId: $repositoryId,
                 allowsDeletions: $allowsDeletions, 
                 allowsForcePushes: $allowsForcePushes, 
                 bypassForcePushActorIds: $bypassForcePushActorIds,
                 bypassPullRequestActorIds: $bypassPullRequestActorIds,
                 clientMutationId: $clientMutationId, 
                 dismissesStaleReviews: $dismissesStaleReviews, 
                 isAdminEnforced: $isAdminEnforced, 
                 pattern: $pattern, 
                 pushActorIds: $pushActorIds,
                 requiredApprovingReviewCount: $requiredApprovingReviewCount, 
                 requiredStatusCheckContexts: $requiredStatusCheckContexts, 
                 requiresApprovingReviews: $requiresApprovingReviews, 
                 requiresCodeOwnerReviews: $requiresCodeOwnerReviews, 
                 requiresCommitSignatures: $requiresCommitSignatures, 
                 requiresConversationResolution: $requiresConversationResolution, 
                 requiresLinearHistory: $requiresLinearHistory, 
                 requiresStatusChecks: $requiresStatusChecks, 
                 requiresStrictStatusChecks: $requiresStrictStatusChecks, 
                 restrictsPushes: $restrictsPushes, 
                 restrictsReviewDismissals: $restrictsReviewDismissals,
                 reviewDismissalActorIds: $reviewDismissalActorIds 
               }
             )
           {
             clientMutationId
           }
         }`,
         {
           "repositoryId": context.payload.repository.node_id,
           "allowsDeletions": params.rules.allowsDeletions, 
           "allowsForcePushes": params.rules.allowsForcePushes, 
           "bypassForcePushActorIds": bypassForcePushActorNames,
           "bypassPullRequestActorIds": bypassPullRequestActorNames,
           "clientMutationId": "", 
           "dismissesStaleReviews": params.rules.dismissesStaleReviews, 
           "isAdminEnforced": params.rules.isAdminEnforced, 
           "pattern": branch_name, 
           "pushActorIds": pushActorNames,
           "requiredApprovingReviewCount": params.rules.requiredApprovingReviewCount, 
           "requiredStatusCheckContexts": params.rules.requiredStatusCheckContexts, 
           "requiresApprovingReviews": params.rules.requiresApprovingReviews, 
           "requiresCodeOwnerReviews": params.rules.requiresCodeOwnerReviews, 
           "requiresCommitSignatures": params.rules.requiresCommitSignatures, 
           "requiresConversationResolution": params.rules.requiresConversationResolution, 
           "requiresLinearHistory": params.rules.requiresLinearHistory, 
           "requiresStatusChecks": params.rules.requiresStatusChecks, 
           "requiresStrictStatusChecks": params.rules.requiresStrictStatusChecks, 
           "restrictsPushes": params.rules.restrictsPushes, 
           "restrictsReviewDismissals": params.rules.restrictsReviewDismissals,
           "reviewDismissalActorIds": reviewDismissalActorNames
         }
       )
     }
     catch (err) {
       context.log.error(' \'repositoryBranchProtection\' failed to create a new Branch Protection Rule')
       context.log.error(util.inspect(err))
       return 1
     }
   }
 }
 
 module.exports = repositoryBranchProtection