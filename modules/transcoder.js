const fs = require("fs");
const path = require("path");
const cp = require('child_process');
const chalk = require("chalk");
const videoRegEx = /\.(mov|mp4|m4v)$/i

function transcodeIt (settings) {
  console.log(chalk.blue(JSON.stringify(settings, null, 4)));
  if (settings.file) {
    console.log("going to transcode a file");
    transcodeFile(file, settings);
  } else if (settings.folder) {
    console.log("going to transcode a folder");
    var theFiles=fs.readdirSync(settings.folderPath);
    for (var i = 0; i < theFiles.length; i++) {
      if(videoRegEx.test(theFiles[i])){
        var thisPath = path.join(settings.folderPath, theFiles[i]);
        console.log(thisPath + " is a video file");
        var theseSettings = {
          ffmpegPath:settings.ffmpegPath,
          sourcePath:thisPath,
          destinationPath:(path.join(settings.outputFolder, theFiles[i])),
          outputWidth:1920,
          outputHeight:1080,
          crfVal: 23,
        }
        // sourcePath, destinationPath, crfVal,
          // outputWidth, outputHeight
        transcodeFile(thisPath, theseSettings);
      }
    }
  } else {
    console.log("not sure whether you want to transcode a file or folder or anything--set this in the commands or in defaults?");
  }
}

function transcodeFile(file, settings){
    console.log("about to transcode ");
    console.log(JSON.stringify(settings, null, 4));
    var theJson = getFfprobeJson(file, settings.ffmpegPath);
    var dimensions = getDesiredDimensions(theJson);
    var output = cp.spawnSync(settings.ffmpegPath, [
      '-i', settings.sourcePath,
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-vf', ('scale='+ dimensions.outputWidth +':'+dimensions.outputHeight ),
      '-vf', ('scale=1920:1080' ),
      '-preset', 'slow',
      '-crf', settings.crfVal,
      '-c:a', 'aac', '-b:a', '128k',
      '-map_channel', '0.2.0',
      '-map_channel', '0.2.1',
      settings.destinationPath]
      , {
        stdio: [
          0, // Use parent's stdin for child
          'pipe', // Pipe child's stdout to parent
          2 // Direct child's stderr to a file
        ]
      }
    );
}


function slackIt(settings){
  var thePayload = 'payload={"channel": "#ll-workflow-alerts", "username": "theworkflow-bot", "text": "<@marlon>: just transcoded ' + path.basename(sourcePath) + ' and put it here: ' + destinationPath + ' .", "icon_emoji": ":desktop_computer:"}';
  cp.spawnSync("curl", ['-X', 'POST', '--data-urlencode', thePayload, process.env.SLACK_WEBHOOK_URL]);
  console.log("\n\n");
}

function getFfprobeJson(filePath){
  console.log("about to grab json for " + JSON.stringify(filePath));
  var options = ['-v', 'quiet', '-print_format', 'json', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', filePath];
  var ffProbeOutput = cp.spawnSync('ffprobe', options, { encoding : 'utf8' });
  var theJson = JSON.parse(ffProbeOutput.stdout);
  console.log(chalk.blue(JSON.stringify(theJson, null, 4)));
  return theJson;
}

function getDesiredDimensions(ffprobeJson, videoFilePath){
  var outputWidth=1920;
  var outputHeight=1080;
  console.log(ffprobeJson.streams[0].width + " is the width");
  if (ffprobeJson.streams[0].height && (ffprobeJson.streams[0].height>1080)) {
    console.log(videoFilePath + " has height larger than 1080: " + ffprobeJson.streams[0].height);
    outputWidth=ffprobeJson.streams[0].width/(ffprobeJson.streams[0].height/1080);
    console.log("making outputWidth " + outputWidth);
  }
  else if (ffprobeJson.streams[0].height && (ffprobeJson.streams[0].height==1080)) {
    console.log(videoFilePath + " has height of exactly 1080: " + ffprobeJson.streams[0].height);
  }
  else if (ffprobeJson.streams[0].height && (ffprobeJson.streams[0].height<1080)) {
    console.log(videoFilePath + " has height of less than 1080: " + ffprobeJson.streams[0].height);
    outputWidth=ffprobeJson.streams[0].width;
    outputHeight=ffprobeJson.streams[0].height;
  }
  else {
    console.log("something went wrong--perhaps this is not a video file");
  }
  return {outputWidth: outputWidth, outputHeight: outputHeight};
}



module.exports.transcodeIt = transcodeIt;
