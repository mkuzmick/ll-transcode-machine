#!/usr/bin/env node

var yargs = require('yargs').argv;
var defaults = require('./modules/defaults');
var transcodeMachine = require('./index');
var cliTools = require('./modules/cli-tools');

cliTools.printTitle('transcodeMachine');

if (yargs.config) {
  cliTools.setConfig(yargs, defaults);
} else {
  var jobSettings = cliTools.mergeSettings(yargs, defaults);
  console.log("Performing a job with the following settings:");
  // cliTools.printJson(jobSettings);
  console.log(JSON.stringify(jobSettings));
  transcodeMachine.transcode(jobSettings)
    .then(()=>console.log("done."));
}
