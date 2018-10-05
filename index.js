global.__basedir = __dirname;
var transcodeIt = require('./modules/transcoder').transcodeIt;

const transcode = async function (settings) {
  console.log("starting transcode");
  await transcodeIt(settings);
}

module.exports.transcode = transcode;
