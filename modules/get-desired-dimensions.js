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

module.exports = getDesiredDimensions;
