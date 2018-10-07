const cp = require('child_process');
const path = require('path');

function slackIt(settings){
  var thePayload = '{"text":"<@' + settings.slackName + '> finished transcoding ' + settings.outputPath + '"}'
  cp.spawnSync("curl", ['-X', 'POST', 'H', 'Content-type: application/json', '--data', thePayload, process.env.SLACK_WEBHOOK_URL]);
  console.log("\n\n");
}

module.exports = slackIt;
