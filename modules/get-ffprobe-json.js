const cp = require('child_process');
const chalk = require('chalk');

function getFfprobeJson(filePath, ffprobePath){
  console.log("about to grab json for " + JSON.stringify(filePath));
  var options = ['-v', 'quiet', '-print_format', 'json', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', filePath];
  var ffProbeOutput = cp.spawnSync(ffprobePath, options, { encoding : 'utf8' });
  var theJson = JSON.parse(ffProbeOutput.stdout);
  console.log(chalk.blue(JSON.stringify(theJson, null, 4)));
  return theJson;
}

module.exports = getFfprobeJson;
