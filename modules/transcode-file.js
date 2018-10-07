const getFfprobeJson = require('./get-ffprobe-json');
const getDesiredDimensions = require('./get-desired-dimensions');
const chalk = require('chalk');
const cp = require('child_process');
const hyperRegex = /(hyper|_SS_|_Pgm1_|_Pgm2_|_Pgm3_|Capture0)/i;

function transcodeFile(settings){
    console.log("\n\n________________\nabout to transcode " + settings.inputPath);
    console.log("and put it here: " + settings.outputPath);
    console.log("with these settigns:");
    console.log(JSON.stringify(settings, null, 4));
    var options = buildOptions(settings);
    var output = cp.spawnSync(settings.ffmpegPath, options, {
        stdio: [
            0, // Use parent's stdin for child
            'pipe', // Pipe child's stdout to parent
            2 // Direct child's stderr to a file
            ]
        }
    );
}

function buildOptions(settings) {
  var options = [];
  options.push('-i', settings.inputPath);
  if (settings.overwrite == true) {
    options.push('-y');
  }
  options.push('-c:v', 'libx264');
  options.push('-pix_fmt', 'yuv420p');
  if (settings.max1080) {
    var theJson = getFfprobeJson(settings.inputPath, settings.ffprobePath);
    var dimensions = getDesiredDimensions(theJson);
    options.push('-vf', ('scale='+ dimensions.outputWidth +':'+dimensions.outputHeight ))
  }
  options.push('-preset', 'slow');
  options.push('-crf', settings.crf);
  options.push('-c:a', 'aac', '-b:a', '128k');
  // TODO: probe for channels and handle this more elegantly
  // right now just a regex check for specific input names
  if (hyperRegex.test(settings.inputPath)) {
    options.push('-map_channel', '0.2.0', '-map_channel', '0.2.1')
  }
  options.push(settings.outputPath);
  console.log("options built:");
  console.log(chalk.red(JSON.stringify(options, null, 4)));
  return options;
}

module.exports = transcodeFile;
