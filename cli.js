#!/usr/bin/env node

var yargs = require('yargs').argv;
var defaults = require('./modules/defaults');
var transcodeMachine = require('./index');
var cliTools = require('./modules/cli-tools');
var chalk = require('chalk');
var path = require('path');


cliTools.printTitle(['transcode\nmachine']);

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
  if (jobSettings.folder) {
    console.log("folder request");
    // var sourceFolder = jobSettings.folder===true ? jobSettings._[0] : jobSettings.folder;
    // console.log(sourceFolder);
    // jobSettings.folder = sourceFolder;
    jobSettings.folder = cliTools.getTarget(jobSettings, "folder");
    if (!jobSettings.outputFolder) {
      jobSettings.outputFolder=path.dirname(jobSettings.folder);
    }
  }
  if (jobSettings.file) {
    console.log("file request");
    jobSettings.file = cliTools.getTarget(jobSettings, "file");
    if (!jobSettings.outputFolder) {
      jobSettings.outputFolder=path.dirname(jobSettings.file  );
    }
  }
  // console.log("Performing a job with the following settings:");
  // console.log(chalk.red(JSON.stringify(jobSettings, null, 4)));


  transcodeMachine.transcode(jobSettings)
    .then(()=>console.log("done."));
}
