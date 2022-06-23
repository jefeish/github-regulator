const eventHandlerTemplate = require('../../src/eventHandlers/eventHandlerTemplate');
const issueAddAssignees = require('../../src/eventHandlers/issuesAddAssignees');
const issueAddLabels = require('../../src/eventHandlers/issuesAddLabels');
const issueCreateComment = require('../../src/eventHandlers/issuesCreateComment');
const issueReplaceLabel = require('../../src/eventHandlers/issuesReplaceLabel');
const issueRemoveLabels = require('../../src/eventHandlers/issuesRemoveLabels');
const issueReplaceAllLabels = require('../../src/eventHandlers/issuesReplaceAllLabels');
const repositoryAddTeam = require('../../src/eventHandlers/repositoryAddTeam');
const repositoryBranchProtection = require('../../src/eventHandlers/repositoryBranchProtection');

const rulesEngineHandler = require('../../src/eventHandlers/rulesEngineHandler');

describe('Test the handler classes', function () {

    // describe('eventHandlerTemplate class', () => {
    //     it('test the eventHandlerTemplate', () => {
    //         const context = {}
    //         const params = ['test', 'test']
    //         const handler = eventHandlerTemplate.getInstance()
    //         expect(handler.execute(context, params)).toEqual(0);
    //         console.log('eventHandlerTemplate test passed');
    //     });
    // });

    // describe('issueAddAssignees class', () => {
    //     it('test the issueAddAssignees', () => {
    //         const context = {
    //             log: function () { return 'test' },
    //             payload: {
    //                 repository: {
    //                     owner: {
    //                         login: 'test'
    //                     },
    //                     name: 'test'
    //                 },
    //                 organization: {
    //                     login: 'test'
    //                 }
    //             }
    //         }

    //         const params = ['test', 'test']
    //         const handler = issueAddAssignees.getInstance()
    //         expect(handler.execute(context, params)).toEqual(0);
    //     });
    // });

    // describe('issueAddLabels class', () => {
    //     it('test the issueAddLabels', () => {
    //         const context = {
    //             log: function () { return 'test' },
    //             payload: {
    //                 repository: {
    //                     owner: {
    //                         login: 'test'
    //                     },
    //                     name: 'test'
    //                 },
    //                 organization: {
    //                     login: 'test'
    //                 }
    //             }
    //         }

    //         const params = ['test', 'test']
    //         const handler = issueAddLabels.getInstance()
    //         expect(handler.execute(context, params)).toEqual(0);
    //     });
    // });

    // describe('issueCreateComment class', () => {
    //     it('test the issueCreateComment', () => {
    //         const context = {
    //             log: function () { return 'test' },
    //             payload: {
    //                 repository: {
    //                     owner: {
    //                         login: 'test'
    //                     },
    //                     name: 'test'
    //                 },
    //                 organization: {
    //                     login: 'test'
    //                 }
    //             }
    //         }

    //         const params = ['test', 'test']
    //         const handler = issueCreateComment.getInstance()
    //         expect(handler.execute(context, params)).toEqual(0);
    //     });
    // });

    // describe('issueReplaceLabel class', () => {
    //     it('test the issueReplaceLabel', () => {
    //         const context = {
    //             log: function () { return 'test' },
    //             payload: {
    //                 repository: {
    //                     owner: {
    //                         login: 'test'
    //                     },
    //                     name: 'test'
    //                 },
    //                 organization: {
    //                     login: 'test'
    //                 }
    //             }
    //         }

    //         const params = ['test', 'test']
    //         const handler = issueReplaceLabel.getInstance()
    //         expect(handler.execute(context, params)).toEqual(0);
    //     });
    // });

    // describe('issueRemoveLabels class', () => {
    //     it('test the issueRemoveLabels', () => {
    //         const context = {
    //             log: function () { return 'test' },
    //             payload: {
    //                 repository: {
    //                     owner: {
    //                         login: 'test'
    //                     },
    //                     name: 'test'
    //                 },
    //                 organization: {
    //                     login: 'test'
    //                 }
    //             }
    //         }

    //         const params = ['test', 'test']
    //         const handler = repositoryBranchProtection.getInstance()
    //         expect(handler.execute(context, params)).toEqual(0);
    //     });
    // });

    // describe('issueRemoveLabels class', () => {
    //     it('test the issueRemoveLabels', () => {
    //         const context = {
    //             log: function () { return 'test' },
    //             payload: {
    //                 repository: {
    //                     owner: {
    //                         login: 'test'
    //                     },
    //                     name: 'test'
    //                 },
    //                 organization: {
    //                     login: 'test'
    //                 }
    //             }
    //         }

    //         const params = ['test', 'test']
    //         const handler = issueRemoveLabels.getInstance()
    //         expect(handler.execute(context, params)).toEqual(0);
    //     });
    // });

    // describe('issueReplaceAllLabels class', () => {
    //     it('test the issueReplaceAllLabels', () => {
    //         const context = {
    //             log: function () { return 'test' },
    //             payload: {
    //                 repository: {
    //                     owner: {
    //                         login: 'test'
    //                     },
    //                     name: 'test'
    //                 },
    //                 organization: {
    //                     login: 'test'
    //                 }
    //             }
    //         }

    //         const params = ['test', 'test']
    //         const handler = issueReplaceAllLabels.getInstance()
    //         expect(handler.execute(context, params)).toEqual(0);
    //     });
    // });

    // describe('repositoryAddTeam class', () => {
    //     it('test the repositoryAddTeam', () => {
    //         const context = {
    //             log: function () { return 'test' },
    //             payload: {
    //                 repository: {
    //                     owner: {
    //                         login: 'test'
    //                     },
    //                     name: 'test'
    //                 },
    //                 organization: {
    //                     login: 'test'
    //                 }
    //             }
    //         }

    //         const params = ['test', 'test']
    //         const handler = repositoryAddTeam.getInstance()
    //         expect(handler.execute(context, params)).toEqual(0);
    //     });
    // });

    describe('repositoryBranchProtection class', () => {
        it('test the repositoryBranchProtection', () => {
            const context = {
                log: {
                    info: (message) => { return message },
                    debug: (message) => { return message },
                    error: (message) => { return message }
                },
                octokit: {
                    users: {
                        getByUsername: function () { return 200 }
                    },
                    teams: {
                        getByName: function () { return 200 }
                    },
                    log: {},
                },
                payload: {
                    repository: {
                        owner: {
                            login: 'test'
                        },
                        name: 'test',
                        default_branch: 'main'
                    },
                    organization: {
                        login: 'test'
                    }
                }
            }

            const params = {
                branch_name: 'main',
                rules: {
                    allowsDeletions: true,
                    allowsForcePushes: true,
                    bypassForcePushActorIds: {
                        users: ['jester01248'],
                        teams: ['foo']
                    },
                    bypassPullRequestActorIds: {
                        users: ['jester01248'],
                        teams: ['foo']
                    },
                    clientMutationId: null,
                    dismissesStaleReviews: true,
                    isAdminEnforced: true,
                    pushActorIds: {
                        users: ['jester01248'],
                        teams: ['foo']
                    },
                    requiresApprovingReviews: true,
                    requiredApprovingReviewCount: 2,
                    requiredStatusCheckContexts: [],
                    requiresCodeOwnerReviews: true,
                    requiresCommitSignatures: true,
                    requiresConversationResolution: true,
                    requiresLinearHistory: true,
                    requiresStatusChecks: true,
                    requiresStrictStatusChecks: true,
                    restrictsPushes: true,
                    restrictsReviewDismissals: true,
                    reviewDismissalActorIds: {
                        users: ['jester01248'],
                        teams: ['foo']
                    },
                }
            }

            context.log.info('test')
            const handler = repositoryBranchProtection.getInstance()
            expect(handler.execute(context, params)).toEqual(new Promise((resolve, reject) => { }))
        });
    });
});