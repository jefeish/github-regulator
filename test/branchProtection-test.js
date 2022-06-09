const repositoryBranchProtection = require('../src/eventHandlers/repositoryBranchProtection');

describe('Test the handler classes', function () {

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
});