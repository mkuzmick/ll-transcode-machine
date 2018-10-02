global.__basedir = __dirname;
var transcoder = require('./modules/transcoder').transcode;

const transcode = async function (settings) {
  await transcode(settings);
}

module.exports.transcode = transcode;
