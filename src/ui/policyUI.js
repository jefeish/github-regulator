/**
 * @description A very simple UI interface, nothing is optimized.
 */

const fs = require('fs')
const hbs = require('handlebars')
const yaml = require('js-yaml')
const util = require('util')
const favicon = require('serve-favicon');

let path = require('path');
const express = require('express')

class policyUI {

    // eslint-disable-next-line no-useless-constructor
    constructor(router, webPath) {
        // Get an express router to expose new HTTP endpoints
        this.router = router;
        this.webPath = webPath
    }
    
    start() {
        // Use any middleware 
        this.router.use('/public', express.static(path.join(__dirname, 'public')))
        this.router.use('/js', express.static(path.join(__dirname, '../../node_modules/jquery/dist')))
        this.router.use('/js', express.static(path.join(__dirname, '../../node_modules/bootstrap/dist/js')))
        this.router.use('/js', express.static(path.join(__dirname, '../../node_modules/bootstrap/fonts')))
        this.router.use('/js', express.static(path.join(__dirname, '../../node_modules/bootstrap-autocomplete/dist/latest')))
        this.router.use('/css', express.static(path.join(__dirname, '../../node_modules/bootstrap/dist/css')))
        this.router.use(favicon(__dirname + '/public/favicon.ico'));

        // Add a new route
        this.router.get("/", (req, res) => {
            fs.readFile(__dirname + '/templates/index.hbs', 'utf8', (err, tpl) => {
                if (err) {
                    console.error(err)
                    return
                }

                var header = fs.readFileSync(__dirname + '/templates/header.html', 'utf8');
                var template = hbs.compile(tpl);
                var data = {
                    "header": header
                };
                var result = template(data);
                res.send(result)
            });
        })

        // Add a new route
        this.router.get("/policies", (req, res) => {
            fs.readFile(__dirname + '/templates/policies.hbs', 'utf8', (err, tpl) => {
                if (err) {
                    console.error(err)
                    return
                }

                var policyGrid = []
                let conditionGrid = []
                var header = fs.readFileSync(__dirname + '/templates/header.html', 'utf8');
                var policies = fs.readdirSync(__dirname + '/../rules/')
                // PROCESS EACH POLICY IN '../rules'
                policies.forEach(function (file) {
                    if (file.endsWith('.yml')) {
                        const policy = fs.readFileSync(__dirname + '/../rules/' + file, 'utf8')
                        let policyData = yaml.safeLoad(policy);
                        let policyName = policyData.name
                        let policyDescription = policyData.description || '-'
                        let policyConditions = policyData.conditions
                        let policyHandler = policyData.event.type
                        conditionGrid = []
                        policyConditions.all.forEach(function (condition) {
                            let conditionRow = {}
                            conditionRow['Event Data'] = condition.fact
                            conditionRow['Operator'] = condition.operator
                            conditionRow['Value'] = condition.value
                            conditionRow['Description'] = condition.description
                            conditionGrid.push(conditionRow)
                        })
                        
                        let row = {}
                        row['Name'] = policyName
                        row['Description'] = policyDescription
                        row['Source'] = yaml.safeDump(policyData)
                        row['Handler'] = policyHandler
                        row['Condition'] = conditionGrid
                        row['Params'] = '<pre>'+ yaml.safeDump(policyData.event.params) + '</pre>'
                        policyGrid.push(row)
                    }
                })
                var template = hbs.compile(tpl)
                var data = {
                    "header": header,
                    "policies": policyGrid,
                    "conditions": conditionGrid
                }
                res.send(template(data))
            })
        })

        // Add a new route
        this.router.get("/samples", (req, res) => {
            fs.readFile(__dirname + '/templates/samples.hbs', 'utf8', (err, tpl) => {
                if (err) {
                    console.error(err)
                    return
                }

                var policyGrid = []
                let conditionGrid = []
                var header = fs.readFileSync(__dirname + '/templates/header.html', 'utf8');
                var samples = fs.readdirSync(__dirname + '/../rules/samples/')

                // PROCESS EACH POLICY IN '../rules/samples'
                samples.forEach(function (file) {
                    if (file.endsWith('.yml')) {
                        const policy = fs.readFileSync(__dirname + '/../rules/samples/' + file, 'utf8')
                        let policyData = yaml.safeLoad(policy);
                        let policyName = policyData.name
                        let policyDescription = policyData.description || '-'
                        let policyConditions = policyData.conditions
                        let policyHandler = policyData.event.type
                        conditionGrid = []
                        policyConditions.all.forEach(function (condition) {
                            let conditionRow = {}
                            conditionRow['Event Data'] = condition.fact
                            conditionRow['Operator'] = condition.operator
                            conditionRow['Value'] = condition.value
                            conditionRow['Description'] = condition.description
                            conditionGrid.push(conditionRow)
                        })
                        
                        let row = {}
                        row['Name'] = policyName
                        row['Description'] = policyDescription
                        row['Source'] = yaml.safeDump(policyData)
                        row['Handler'] = policyHandler
                        row['Condition'] = conditionGrid
                        row['Params'] = '<pre>'+ yaml.safeDump(policyData.event.params) + '</pre>'
                        policyGrid.push(row)
                    }
                })
                var template = hbs.compile(tpl)
                var data = {
                    "header": header,
                    "samples": policyGrid,
                    "conditions": conditionGrid
                }
                res.send(template(data))
            })
        })

        // Add a new route
        this.router.get("/handlers", (req, res) => {
            fs.readFile(__dirname + '/templates/handlers.hbs', 'utf8', (err, tpl) => {
                if (err) {
                    console.error(err)
                    return
                }

                var handlerNames = []
                var descriptions = []
                var params = []
                var handlerClasses = []
                var header = fs.readFileSync(__dirname + '/templates/header.html', 'utf8')
                var handlers = fs.readdirSync(__dirname + '/../eventHandlers/')
                handlers.forEach(function (file) {
                    if (file.endsWith('.js') && !(file.startsWith('rulesEngineHandler') || file.startsWith('eventHandlerTemplate'))) {

                        const handlerClass = fs.readFileSync(__dirname + '/../eventHandlers/' + file, 'utf8');
                        const idx1 = handlerClass.indexOf('@description')
                        const idx2 = handlerClass.indexOf('@param')
                        const idx3 = handlerClass.indexOf('*/')
                        const name = file.replace('.js', '')
                        handlerNames.push(name);
                        const description = handlerClass.substring(idx1, idx2).replace('@description', '').replaceAll('*', '')
                        descriptions.push(description);
                        const param = handlerClass.substring(idx2, idx3).replace('@param', '').replaceAll('*', '')
                        params.push(param);

                        let row = {}
                        row['Name'] = name
                        row['Description'] = description
                        row['Params'] = '<details><summary>Click to expand</summary><pre>' + param + '</pre></details>'
                        handlerClasses.push(row)
                    }
                })
                var template = hbs.compile(tpl);
                var data = {
                    "header": header,
                    "handlerNames": handlerNames,
                    "descriptions": descriptions,
                    "params": params,
                    "handlers": handlerClasses
                }
                res.send(template(data))
            })
        })

        // Add a new route
        this.router.get("/builder", (req, res) => {
            fs.readFile(__dirname + '/templates/builder.hbs', 'utf8', (err, tpl) => {
                if (err) {
                    console.error(err)
                    return
                }

                var handlerNames = []
                var descriptions = []
                var params = []
                var handlerClasses = []
                var facts_list = []
                var header = fs.readFileSync(__dirname + '/templates/header.html', 'utf8')
                var sample = fs.readFileSync(__dirname + '/../rules/samples/repo-branch-protection-sample.yml', 'utf8')
                var handlers = fs.readdirSync(__dirname + '/../eventHandlers/')
                var facts = fs.readFileSync(__dirname + '/templates/facts.txt', 'utf8')
                
                const lines = facts.split(/\r?\n/);
                
                lines.forEach((line) => { 
                    let row = {}                  
                    row['Fact'] = line
                    facts_list.push(row)
                });
                
                handlers.forEach(function (file) {
                    if (file.endsWith('.js') && !(file.startsWith('rulesEngineHandler') || file.startsWith('eventHandlerTemplate'))) {

                        const handlerClass = fs.readFileSync(__dirname + '/../eventHandlers/' + file, 'utf8');
                        const idx1 = handlerClass.indexOf('@description')
                        const idx2 = handlerClass.indexOf('@param')
                        const idx3 = handlerClass.indexOf('*/')
                        const name = file.replace('.js', '')
                        handlerNames.push(name);
                        const description = handlerClass.substring(idx1, idx2).replace('@description', '').replaceAll('*', '')
                        descriptions.push(description);
                        const param = handlerClass.substring(idx2, idx3).replace('@param', '').replaceAll('*', '  ')
                        params.push(param);

                        let row = {}
                        row['Name'] = name
                        row['Description'] = description
                        row['Params'] = param 
                        handlerClasses.push(row)
                    }
                })

                var template = hbs.compile(tpl);
                var data = {
                    "header": header,
                    "sample": sample,
                    "handlers": handlerClasses,
                    "facts_list": facts_list
                }
                res.send(template(data))
            })
        })
    }
}

module.exports = policyUI
