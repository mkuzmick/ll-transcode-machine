


function createJobArray(settings){

}

if (args.folder) {
    var argElements = args.folder.split('/');
    console.log(argElements);
    console.log(argElements.length);
    var shootId = args.folder.split('/')[(args.folder.split('/').length - 1)];
    console.log("is this the shootId? --- " + shootId);
    var destFolder = path.join(destRoot, shootId + '_h264_1080');
    if (!fs.existsSync(destFolder)){
        fs.mkdirSync(destFolder);
    }
    var camfoldersToTranscode = fs.readdirSync(args.folder);
    console.log(camfoldersToTranscode);
    for (var i = 0; i < camfoldersToTranscode.length; i++) {
      var subFolder = path.join(args.folder, camfoldersToTranscode[i]);
      if (fs.statSync(subFolder).isDirectory()) {
        console.log("this is a directory: " + subFolder);
        var filesToTranscode = fs.readdirSync(subFolder);
        console.log(JSON.stringify(filesToTranscode, null, 4));
        filesToTranscode.forEach(fileName=>{
          var videoFilePath = path.join(subFolder, fileName);
          var vfDestinationPath = path.join(destFolder, fileName);
          if ((/\.(mov|MOV|mp4|m4v|mts)$/i).test(videoFilePath)) {
            console.log("we think this is a video: " + videoFilePath);
            console.log("and it's destination will be " + vfDestinationPath);
            var dimensions = transcoder.getDesiredDimensions(videoFilePath);
            transcoder.transcode(videoFilePath, vfDestinationPath, crfVal, dimensions.outputWidth, dimensions.outputHeight);
          }
          else {
            console.log("we don't think this is a video: " + videoFilePath);
          }
        });
      }
      else {
        console.log("we don't think that this is a directory: " + path.join(args.folder, camfoldersToTranscode[i]));
      }
    }
  }
  else {
    console.log("didn't get expected input.  you have to add a folder with the --folder flag");
    // transcode(args.transcode, crfVal);
  }

module.exports.createJobArray = createJobArray;
