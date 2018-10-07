const fs = require("fs");
const path = require("path");
const cp = require('child_process');
const chalk = require("chalk");
const videoRegEx = /\.(mov|mp4|m4v|mts)$/i;

function buildJobArray(settings) {
  var result = [];
  var camfoldersToTranscode=fs.readdirSync(settings.inputFolder);
  for (var i = 0; i < camfoldersToTranscode.length; i++) {
    var subFolder = path.join(settings.inputFolder, camfoldersToTranscode[i]);
    if (fs.statSync(subFolder).isDirectory()) {
      console.log("this is a directory: " + subFolder);
      var filesToTranscode = fs.readdirSync(subFolder);
      console.log(JSON.stringify(filesToTranscode, null, 4));
      filesToTranscode.forEach(videoFile=>{
          if(videoRegEx.test(videoFile)) {
            console.log("we're going to transcode: " + videoFile);
            var jobSettings = {
              ...settings,
              inputPath: path.join(subFolder, videoFile),
              outputPath: path.join(settings.targetFolder, videoFile)
            };
            // console.log(chalk.red(JSON.stringify(jobSettings, null, 4)));
            result.push(jobSettings);
          }
      })
    }
    else {
      console.log("we don't think that this is a directory: " + path.join(settings.folder, camfoldersToTranscode[i]));
    }
  }
  return result;
}

module.exports = buildJobArray;
