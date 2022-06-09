const eventHandlerTemplate = require('../../src/eventHandlers/eventHandlerTemplate');
const issueAddAssignees = require('../../src/eventHandlers/issuesAddAssignees');
const issueAddLabels = require('../../src/eventHandlers/issuesAddLabels');
const issueCreateComment = require('../../src/eventHandlers/issuesCreateComment');
const issueOverrideLabel = require('../../src/eventHandlers/issuesOverrideLabel');
const issueRemoveLabels = require('../../src/eventHandlers/issuesRemoveLabels');
const issueReplaceLabels = require('../../src/eventHandlers/issuesReplaceLabels');
const repositoryAddTeam = require('../../src/eventHandlers/repositoryAddTeam');
const repositoryAssignTeam = require('../../src/eventHandlers/repositoryAssignTeam');
const repositoryAssignTeamChildren = require('../../src/eventHandlers/repositoryAssignTeamChildren');
const repositoryBranchProtection = require('../../src/eventHandlers/repositoryBranchProtection');

const rulesEngineHandler = require('../../src/eventHandlers/rulesEngineHandler');

describe('Test the handler classes', function () {

    describe('eventHandlerTemplate class', () => {
        it('test the eventHandlerTemplate', () => {
            const context = {}
            const params = ['test', 'test']
            const handler = eventHandlerTemplate.getInstance()
            expect(handler.execute(context, params)).toEqual(0);
            console.log('eventHandlerTemplate test passed');
        });
    });

    describe('repositoryBranchProtection class', () => {
        it('test the repositoryBranchProtection', () => {
            const context = {
                log: function () { return 'test' },
                payload: {
                    repository: {
                        owner: {
                            login: 'test'
                        },
                        name: 'test'
                    },
                    organization: {
                        login: 'test'
                    }
                }
              }
              
            const params = ['test', 'test']
            const handler = repositoryBranchProtection.getInstance()
            expect(handler.execute(context, params)).toEqual(0);
        });
    });

    describe('repositoryAddTeam class', () => {
        it('test the repositoryAddTeam', () => {
            const context = {
                log: function () { return 'test' },
                payload: {
                    repository: {
                        owner: {
                            login: 'test'
                        },
                        name: 'test'
                    },
                    organization: {
                        login: 'test'
                    }
                }
              }
              
            const params = ['test', 'test']
            const handler = repositoryAddTeam.getInstance()
            expect(handler.execute(context, params)).toEqual(0);
        });
    });

    describe('repositoryAddTeam class', () => {
        it('test the repositoryAddTeam', () => {
            const context = {
                log: function () { return 'test' },
                payload: {
                    repository: {
                        owner: {
                            login: 'test'
                        },
                        name: 'test'
                    },
                    organization: {
                        login: 'test'
                    }
                }
              }
              
            const params = ['test', 'test']
            const handler = repositoryAddTeam.getInstance()
            expect(handler.execute(context, params)).toEqual(0);
        });
    });

    describe('repositoryAddTeam class', () => {
        it('test the repositoryAddTeam', () => {
            const context = {
                log: function () { return 'test' },
                payload: {
                    repository: {
                        owner: {
                            login: 'test'
                        },
                        name: 'test'
                    },
                    organization: {
                        login: 'test'
                    }
                }
              }
              
            const params = ['test', 'test']
            const handler = repositoryAddTeam.getInstance()
            expect(handler.execute(context, params)).toEqual(0);
        });
    });

    describe('repositoryAddTeam class', () => {
        it('test the repositoryAddTeam', () => {
            const context = {
                log: function () { return 'test' },
                payload: {
                    repository: {
                        owner: {
                            login: 'test'
                        },
                        name: 'test'
                    },
                    organization: {
                        login: 'test'
                    }
                }
              }
              
            const params = ['test', 'test']
            const handler = repositoryAddTeam.getInstance()
            expect(handler.execute(context, params)).toEqual(0);
        });
    });

    describe('repositoryAddTeam class', () => {
        it('test the repositoryAddTeam', () => {
            const context = {
                log: function () { return 'test' },
                payload: {
                    repository: {
                        owner: {
                            login: 'test'
                        },
                        name: 'test'
                    },
                    organization: {
                        login: 'test'
                    }
                }
              }
              
            const params = ['test', 'test']
            const handler = repositoryAddTeam.getInstance()
            expect(handler.execute(context, params)).toEqual(0);
        });
    });

    describe('repositoryAddTeam class', () => {
        it('test the repositoryAddTeam', () => {
            const context = {
                log: function () { return 'test' },
                payload: {
                    repository: {
                        owner: {
                            login: 'test'
                        },
                        name: 'test'
                    },
                    organization: {
                        login: 'test'
                    }
                }
              }
              
            const params = ['test', 'test']
            const handler = repositoryAddTeam.getInstance()
            expect(handler.execute(context, params)).toEqual(0);
        });
    });

    describe('repositoryAddTeam class', () => {
        it('test the repositoryAddTeam', () => {
            const context = {
                log: function () { return 'test' },
                payload: {
                    repository: {
                        owner: {
                            login: 'test'
                        },
                        name: 'test'
                    },
                    organization: {
                        login: 'test'
                    }
                }
              }
              
            const params = ['test', 'test']
            const handler = repositoryAddTeam.getInstance()
            expect(handler.execute(context, params)).toEqual(0);
        });
    });

    describe('repositoryAddTeam class', () => {
        it('test the repositoryAddTeam', () => {
            const context = {
                log: function () { return 'test' },
                payload: {
                    repository: {
                        owner: {
                            login: 'test'
                        },
                        name: 'test'
                    },
                    organization: {
                        login: 'test'
                    }
                }
              }
              
            const params = ['test', 'test']
            const handler = repositoryAddTeam.getInstance()
            expect(handler.execute(context, params)).toEqual(0);
        });
    });
});