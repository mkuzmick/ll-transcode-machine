const fs = require("fs");
const path = require("path");
const cp = require('child_process');
const chalk = require("chalk");
const videoRegEx = /\.(mov|mp4|m4v|mts)$/i;
const buildJobArray = require('./build-job-array');
const transcodeFile = require('./transcode-file');
const folderSuffix = require('./folder-suffix');
const slackIt = require('./slack-it');
require('dotenv').config();

function transcode (settings) {
  console.log(chalk.blue(JSON.stringify(settings, null, 4)));
  if (settings.file) {
    try {
      var stats = fs.statSync(settings.file);
      if (stats.isFile()) {
        // create outputDirectory, like
        // /path/to/shootfolder_h264_23_1080
        settings.inputPath = settings.file;
        var outputDirectory = path.join(
          settings.outputFolder,
          (path.basename(settings.file, path.extname(settings.file))
            + folderSuffix(settings))
        );
        if (!fs.existsSync(outputDirectory)){
          fs.mkdirSync(outputDirectory);
        }
        settings.outputPath = path.join(
            outputDirectory,
            (path.basename(settings.file))
        );
        transcodeFile(settings);
        if (settings.slack==true) {
          console.log("going to try to slackIt");
          slackIt(settings)
        }
      } else {
        console.log("this doesn't seem to really be a file:" + settings.file);
      }
    }
    catch(err) {
        console.log("job failed");
        console.log(err);
    }
  } else if (settings.folder) {
    settings.inputFolder = settings.folder
    try {
      var stats = fs.statSync(settings.inputFolder);
      if (stats.isDirectory()) {
        settings.targetFolder = path.join(
          settings.outputFolder,
          (path.basename(settings.inputFolder) + folderSuffix(settings))
        )
        if (!fs.existsSync(settings.targetFolder)){
            fs.mkdirSync(settings.targetFolder);
        }
        var jobArray = buildJobArray(settings);
        for (var i = 0; i < jobArray.length; i++) {
          transcodeFile(jobArray[i]);
          if (jobArray[i].slack==true) {
            slackIt(jobArray[i]);
          }
        }
      } else {
        console.log("doesn't look like this is really a folder:" + settings.inputFolder);
      }
    }
    catch(err) {
        console.log('problem transcoding folder');
        console.log(err);
    }

  } else {
    console.log("not sure whether you want to transcode a file or folder or anything--set this in the commands or in defaults?");
  }
}

module.exports.transcode = transcode;
