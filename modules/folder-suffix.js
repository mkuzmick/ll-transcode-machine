function folderSuffix(settings){
  var suffix = "";
  if (settings.codec == "H.264") {
    suffix += "_h264"
  }
  if (settings.crf) {
    suffix += ("_" + settings.crf)
  }
  if (settings.max1080) {
    suffix += ("_1080")
  }
  return suffix;
}

module.exports = folderSuffix;
