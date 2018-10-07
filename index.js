global.__basedir = __dirname;
var transcoder = require('./modules/transcoder');

const transcode = async function (settings) {
  console.log("starting transcode");
  await transcoder.transcode(settings);
}

module.exports.transcode = transcode;
