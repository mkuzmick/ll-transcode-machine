var cp = require('child_process');
var fse = require('fs-extra');
var path = require('path');
var makeHtml = require('./makeHtml');
var analyzePng = require('./visual-analysis').analyzePng;

module.exports.makeTheGif = async function(settings){
  // console.log("these are the arguments hitting makeTheGif " + JSON.stringify(settings));
  var filePath;
  if (settings.inputFile) {
    filePath = settings.inputFile;
  } else {
    filePath = settings._[0]
  }
  var normFilePath = filePath.replace(/ /g,"_");
  if (!settings.outputFolder) {
    settings.outputFolder=path.dirname(filePath)
  };
  var gifBasename = path.basename(normFilePath, path.extname(filePath));
  var palettePath = path.join(settings.outputFolder,
    (gifBasename + "_palette.png"));
  var gifPath = path.join(settings.outputFolder,
    (gifBasename + '_' + settings.height
    + ".gif"));
  var htmlPath = path.join(settings.outputFolder,
    (gifBasename + "_index.html"));
  cp.spawnSync(settings.ffmpegPath, ['-i', filePath, '-vf',
    'palettegen', palettePath]);
  cp.spawnSync(settings.ffmpegPath, ['-i', filePath, '-i',
    palettePath, '-vf', ('scale=' + settings.width + ":"
    + settings.height), '-y', gifPath]);
  if (settings.html) {
    fse.writeFileSync(htmlPath, makeHtml(gifPath, palettePath, (JSON.stringify(settings, null, 4))), 'utf-8');
    cp.spawnSync('open', [htmlPath]);
  }
  var pixelDataArray = await analyzePng(palettePath);
  console.log(JSON.stringify(pixelDataArray));
  console.log("htmlPath: " + htmlPath);
  return
};
