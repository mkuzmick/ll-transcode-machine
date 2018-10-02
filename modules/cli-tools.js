// performs the operations required in all LL cliTools
// title
// take yargs and config and create settings for job
// handle congiguration

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const fse = require('fs-extra');
var pkg = require('../package.json');
// var configurator = require('../modules/configurator');
var Configstore = require('configstore');
var conf = new Configstore(pkg.name);
var cp = require("child_process");

exports.mergeSettings = function(yargs, defaults){
  return ({...defaults, ...conf.all, ...yargs});
}

exports.printTitle = function(title){
  clear();
  console.log('\n' +
    chalk.bold.magenta(
      figlet.textSync(title, { horizontalLayout: 'full'})
    ) + '\n\n'
  );
}

exports.getConfig = function(){
  var config = conf.all
  return config;
}

exports.printJson = function(obj){
  console.log(JSON.stringify(obj, null, 4));
}

exports.setConfig = function(yargs, defaults){
  for (var i = 0; i < defaults.configOptions.length; i++) {
    if (yargs[defaults.configOptions[i]]) {
      if (yargs[defaults.configOptions[i]]=="delete") {
        console.log("found a delete request for " + defaults.configOptions[i]);
        conf.delete(defaults.configOptions[i]);
      } else if (yargs[defaults.configOptions[i]]=="false") {
        console.log("found a false request for " + defaults.configOptions[i]);
        conf.set(defaults.configOptions[i], false);
      } else if (yargs[defaults.configOptions[i]]=="true") {
        console.log("found a true request for " + defaults.configOptions[i]);
        conf.set(defaults.configOptions[i], true);
      } else {
        conf.set(defaults.configOptions[i], yargs[defaults.configOptions[i]])
      }
    }
  };
  console.log("set your configuration to");
  console.log(JSON.stringify(conf.all, null, 4));
}
