/**
 * @description Event Handler Class that uses a Rules-Engine
 * @param
 */

const Command = require('./common/command.js')
const Engine = require('json-rules-engine').Engine
const Rule = require('json-rules-engine').Rule
const flatten = require('flat')
const fs = require('fs')
const yaml = require('js-yaml')
const path = require('path')
const util = require('util')
var handlerMap = {}
let instance = null
let lastRefeshTime = 0
let refreshInterval = 5 // in Minutes (default)
let rules_repo = ''
let config = null
let rulesList = []

/** -------------------------------------------------------------------------
 * @description A basic Rules Engine Handler Class that loads Rules
 *              and applies them to facts from a GitHub event context JSON.
 * 
 * @todo This needs to be a 'Singleton' !!!
 ------------------------------------------------------------------------- */
class rulesEngineHandler extends Command {
  constructor(rulesPath, eventHandlersPath) {
    super()
    this.rulesPath = process.cwd() + '/src/rules'
    this.eventHandlersPath = process.cwd() + '/src/eventHandlers'
    // make all Classes available, that can process an Event.
    this.loadEventHandlers(this.eventHandlersPath, handlerMap)
    // Create a Rules-Engine instance
    const options = { allowUndefinedFacts: true }
    this.engine = new Engine([], options)
    // Prepare the Rules-Engine
    this.loadCustomOperators()
    this.getServerRules('')
    this.config = this.loadRulesEngineConfiguration()
  }

  /** -------------------------------------------------------------------------
   * Singleton pattern
   ------------------------------------------------------------------------- */
  static getInstance() {
    if (!instance) {
      instance = new rulesEngineHandler()
    }

    return instance
  }

  /** -------------------------------------------------------------------------
   * @description Load custom configurations.
   *  Eg.: client rules repo, rules reload-interval etc.
   ------------------------------------------------------------------------- */
  loadRulesEngineConfiguration() {
    try {
      // eslint-disable-next-line no-path-concat
      const tmp_config = fs.readFileSync(process.cwd() + '/.github/config.yml')
      config = JSON.parse(JSON.stringify(yaml.safeLoad(tmp_config), null, 4))
      refreshInterval = config.rules_refreshInterval
      rules_repo = config.rules_repo
      // Debug
      console.log('loadRulesEngineConfiguration() \n\t' + util.inspect(config))
    }
    catch (err) {
      console.error(err)
      console.error("\n Please provide a '.github/config.yml' file. Terminating!")
      console.exit(1)
    }
  }

  /** -------------------------------------------------------------------------
   * @description Load all the Event Handler Classes that the Rules-Engine 
   *              might need to invoke on a successful Rule match.
   * @param {*} modulesPath 
   * @param {*} handlerMap 
   ------------------------------------------------------------------------- */
  loadEventHandlers(modulesPath, handlerMap) {
    fs.readdir(modulesPath, function (err, files) {
      files.forEach(file => {
        if (file.endsWith('.js')) {
          handlerMap[file.split('.')[0]] = require(modulesPath + '/' + file)
        }
      });
    });
  }

  /** -------------------------------------------------------------------------
   * Add custom operators to the engine
   * These operators support `Regular Expressions` or
   * `Date Time check` (in case something needs to 'expired') 
   ------------------------------------------------------------------------- */
  loadCustomOperators() {

    this.engine.addOperator('doesNotInclude', (factValue, jsonValue) => {
      return !(factValue).includes(jsonValue)
    })

    this.engine.addOperator('includes', (factValue, jsonValue) => {
      return (factValue).includes(jsonValue)
    })

    this.engine.addOperator('includesAny', (factValue, jsonValue) => {
      if (factValue !== undefined) {
        return (factValue).every(function () { (factValue).includes(jsonValue) })
      }
      else {
        return false
      }
    })

    this.engine.addOperator('doesNotIncludeAny', (factValue, jsonValue) => {
      if (factValue === undefined) {
        return true
      } else {
        return !(factValue).every(function () { (factValue).includes(jsonValue) })
      }
    })

    this.engine.addOperator('regex', (factValue, jsonValue) => {
      if (factValue === undefined) {
        return false
      }
      return (factValue).search(jsonValue) >= 0
    })

    this.engine.addOperator('isEmpty', (factValue, jsonValue) => {
      if (factValue === undefined || factValue.length == 0) {
        return true
      }
    })

    this.engine.addOperator('notEmpty', (factValue, jsonValue) => {
      if (factValue !== undefined && factValue.length != 0) {
        return true
      }
    })

    this.engine.addOperator('dateLessThan', (factValue, jsonValue) => {
      const nowTimeMs = (new Date()).getTime()
      const orgTimeMs = (new Date(factValue)).getTime()
      const days = Math.floor((nowTimeMs - orgTimeMs) / (1000 * 60 * 60 * 24))
      return days <= jsonValue
    })

    this.engine.addOperator('dateGreaterThan', (factValue, jsonValue) => {
      const nowTimeMs = (new Date()).getTime()
      const orgTimeMs = (new Date(factValue)).getTime()
      const days = Math.floor((nowTimeMs - orgTimeMs) / (1000 * 60 * 60 * 24))
      return days >= jsonValue
    })
  }

  /** -------------------------------------------------------------------------
   * @description Utility function
   * @param {*} element 
   ------------------------------------------------------------------------- */
  extension(element) {
    var extName = path.extname(element)
    return extName === '.yml'
  }

  /** -------------------------------------------------------------------------
   * @description Load and add all Rules to the Rules engine, 
   *              these come from files that start with the 'prefix'.
   * 
   * @param {*} prefix - Group Rules based on file name prefix
   ------------------------------------------------------------------------- */
  getServerRules(prefix) {
    if (typeof prefix == 'undefined') {
      prefix = ''
    }

    try {
      let rulesFiles = ''
      let jsonRule
      const files = fs.readdirSync(this.rulesPath)
      // Filter '.yml' files only
      files.filter(this.extension).forEach(rulesFile => {

        if (!prefix) { prefix = '' }
        if (rulesFile.startsWith(prefix)) {
          rulesFiles += ' ' + rulesFile
          // eslint-disable-next-line no-path-concat
          const ruleData = fs.readFileSync(this.rulesPath + '/' + rulesFile)

          if (path.extname(rulesFile) === '.json') {
            jsonRule = JSON.parse(ruleData)
          } else if (path.extname(rulesFile) === '.yml') {
            jsonRule = JSON.parse(JSON.stringify(yaml.safeLoad(ruleData), null, 4))
          }
          // console.log('jsonRule: ' + util.inspect(jsonRule))
          this.engine.addRule(jsonRule)
        } else {
          console.log('Ignoring rules file(s), [' + rulesFile + ']')
        }
      })
      console.log('Loading server rules file(s), [' + rulesFiles + ' ]')

    } catch (err) {
      console.error('error reading rules from, [' + process.cwd() + '/src/' + this.rulesPath + ']')
      console.error(err)
    }
  }

  /** -------------------------------------------------------------------------
   * Load all the Rules files from the Repository '.github/rules' folder
   * (Client-Side)
   * 
   * Note: 'getConfig' does not support reading multiple files from a folder.
   *       We use a workaround to read all files.
   * 
   * @param {*} context 
   ------------------------------------------------------------------------- */
  async getClientRules(context) {
    let files = []
    context.log.info('getClientRules()')

    // Reduce the overhead of loading Repo Rules for every request
    // If the 'refreshInterval' (in min) has not been exceeded, use the 'old' Rules
    const rightNow = Date.now();

    // check if the 'interval' was exceeded and we need to reload the rules
    if (lastRefeshTime !== 0 && (rightNow - lastRefeshTime) < (refreshInterval * 60000)) {
      context.log.info('NO repository rules refresh required, last refresh ' + ((rightNow - lastRefeshTime) / 60000).toFixed(2) + ' minutes ago (set refresh time = ' + refreshInterval + ' min)')
    }
    else {
      // clean up the client-side rules from the engine and reload the rules 
      // DO NOT touch the server - side rules
      // ----------------------------------------------------------------------
      context.log.info('Repository rules refresh REQUIRED, last refresh ' + ((rightNow - lastRefeshTime) / 60000).toFixed(2) + ' minutes ago (set refresh time = ' + refreshInterval + ' min)')
      // Clean up - Remove all rules from the engine.
      rulesList.forEach(rule => {
        const ret = this.engine.removeRule(rule)
        context.log.info('successfully removed rule? ' + ret)
      })
      // store the time of the last reload
      lastRefeshTime = Date.now();

      // set the client-side rules location
      let rules_repo = context.payload.repository.name

      if (typeof config.rules_repo !== 'undefined' && config.rules_repo !== '.') {
        rules_repo = config.rules_repo
      }
      context.log.info('rules_repo: ' + rules_repo)

      // get a list of Rules files from the Repository config
      const response = await context.octokit.repos.getContent(
        {
          owner: context.payload.repository.owner.login,
          repo: rules_repo,
          path: '.github/rules'
        }
      );

      // load the file names into an Array
      response.data.forEach(data => {
        files.push(data.name)
      })

      // "One File One Rule" - load them all
      for (let i = 0; i < files.length; i++) {
        context.log('reading client-side (' + rules_repo + ') rules file: ' + files[i])
        // Read the Rules from the Repository
        const ruleData = await context.octokit.repos.getContent(
          {
            owner: context.payload.repository.owner.login,
            repo: rules_repo,
            path: '.github/rules/' + files[i]
          }
        );

        const rule = new Rule(JSON.stringify(yaml.safeLoad(Buffer.from(ruleData.data.content, 'base64'))))

        // Store the rules, so that we can remove them on Rules reload
        rulesList.push(rule)

        try {
          await this.engine.addRule(rule)
        } catch (err) {
          context.log.error('error reading rules from, [.github/rules/]')
          context.log.error('error: ' + err)
        }
      }
    }
  }

  /** -------------------------------------------------------------------------
   * @description Transform GitHub context (JSON) into RulesEngine Facts.
   *              This is a little 'workaround' method.
   * 
   *              A sample RulesEngine Fact:
   *              {key: value}
   * 
   *              Sample JSON context (dummy array 'a[]'):
   *              {
   *                d: {
   *                  e: 'foo2'
   *                },
   *                a: [
   *                  {
   *                    b: 'x1',
   *                    c: 'y1'
   *                  },
   *                  {
   *                    b: 'x2',
   *                    c: 'y2'
   *                  },
   *                ]
   *              } 
   * 
   *              Flatten the JSON context (array result of 'flatten()')
   *              {
   *                 d.e: 'foo2',
   *                 a.1.b: 'x1',
   *                 a.1.c: 'y1',
   *                 a.2.b: 'x2', 
   *                 a.2.c: 'y2',
   *              }
   * 
   *              translate to...
   *              {
   *                 d.e: 'foo2',                
   *                 a.b: [x1,x2],
   *                 a.c: [y1,y2]
   *              }
   * 
   * @param {*} context 
   ------------------------------------------------------------------------- */
  translateToRulesFacts(context) {
    var facts = flatten(context)
    var newFacts = {}

    context.log.debug('translateToRulesFacts(context)')

    // Let's turn an Array into a fact
    // Regex to identify an Array, the key contains a sequence number (eg: .1. )
    const regex = /\.\d{1}\.|\d{2}\./;

    for (const [key, value] of Object.entries(facts)) {
      if (key.startsWith('payload.') && key.match(regex)) {
        var newKey = key.replace(regex, '.')
        if (!newFacts.hasOwnProperty(newKey)) {
          newFacts[newKey] = []
        }
        newFacts[newKey].push(value)
        // remove the 'old' key
        delete facts[key]
      }
    }

    return facts
  }

  /** -------------------------------------------------------------------------
   * @description Execute the Rule process and load (or reload) the rules
   *              for every event invocation.
   *              This creates some 'loading' overhead but also allows us to
   *              update the rules without having to restart the App.
   *              (TODO: optimize the rule loading)
   * @param context
   ------------------------------------------------------------------------- */
  async execute(context) {
    context.log.info('rulesEngineHandler.execute()')
    context.log.trace('context: ' + util.inspect(context.log))


    // check if client-side rules need to be reloaded, if yes, do so
    //  if (!rules_repo.match('^none$')) {
    //   context.log.info('rules_repo: ' + rules_repo)
    //   await this.getClientRules(context)
    //  }

    const facts = await this.translateToRulesFacts(context)

    if (context.log.level === 'trace') {
      // This section (if enabled) produces a data file with flattened facts that can be used in the UI Builder page
      for (const key in facts) {
        if (key.startsWith("payload") || key.startsWith("name")) {
          context.log.trace('FACT: ' + key + ":" + util.inspect(facts[key]))
          fs.appendFile('src/ui/templates/facts.txt', key + '\n', function (err) {
            if (err) return context.log.error(err)
          });
        }
      }
    }
    
    let e
    const eventName = context.name + '.' + context.payload.action
    context.log.info('eventName: ' + eventName)
    context.log.debug('context.payload.sender.type: ' + util.inspect(context.payload.sender.type))

    try {
      if (context.payload.sender.type != 'Bot') {
        context.log.debug('SENDER IS NOT A BOT - CONTINUE !')
        // Run the engine to evaluate the facts and conditions
        this.engine
          .run(facts, { cache: false })
          .then(results => {
            results.events.map(event => {
              const m = new handlerMap[event.type]()
              context.log.info('Routing to rulesHandler: ' + event.type + '(' + context + ',' + event.params + ')')
              m.execute(context, event.params)
            })
          })
          .catch(function (err) {
            console.log('error: ', err)
          })
      }
      else {
        context.log.debug('SENDER IS A BOT - SKIP !')
      }
    } catch (err) {
      context.log.error('error: ', util.inspect(err))
    }
  }
}

module.exports = rulesEngineHandler;