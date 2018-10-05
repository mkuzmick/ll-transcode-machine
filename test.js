var cp = require("child_process");
var chalk = require("chalk");

  var options = ['-v', 'quiet', '-print_format', 'json', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '/Volumes/mk2/Capture0001.mov'];
  var ffProbeOutput = cp.spawnSync('ffprobe', options, { encoding : 'utf8' });
  var theJson = JSON.parse(ffProbeOutput.stdout);
  console.log(chalk.blue(JSON.stringify(theJson, null, 4)));
