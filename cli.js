#!/usr/bin/env node

var yargs = require('yargs').argv;
var defaults = require('./modules/defaults');
var transcodeMachine = require('./index');
var cliTools = require('./modules/cli-tools');

cliTools.printTitle('transcode\nmachine');

if (yargs.config) {
  cliTools.setConfig(yargs, defaults);
} else {
  if (yargs.folder) {
    yargs.file=false;
  }
  if (yargs.file) {
    yargs.folder=false;
  }
  var jobSettings = cliTools.mergeSettings(yargs, defaults);
  console.log("Performing a job with the following settings:");
  if (jobSettings.folder===true) {
    jobSettings.folderPath = jobSettings._[0];
    console.log("folder prop is true and folder name is " + jobSettings._[0]);
  } else if (jobSettings.folder) {
    console.log("folder prop is 'true' and folder name is " + jobSettings.folder);
    jobSettings.folderPath = jobSettings.folder;
  }
  transcodeMachine.transcode(jobSettings);
    // .then(()=>console.log("done."));
}
