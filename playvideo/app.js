window.addEventListener("load", function() {
  console.log("window loaded.");
});

var VIDEO_BBB = {
  file: 'test-fragmented.mp4',
  mime: 'video/mp4',
  codecs: 'codecs="avc1.4d401f"'
};
var VIDEO_TINY = {
  file: 'car-20120827-85.mp4',
  mime: 'video/mp4',
  codecs: 'codecs="avc1.4d4015"'
};
var VIDEO_NORMAL = {
  file: 'car-20120827-86.mp4',
  mime: 'video/mp4',
  codecs: 'codecs="avc1.4d401e"'
};
var VIDEO_VP9_TINY = {
  file: 'feelings_vp9-20130806-242.webm',
  mime: 'video/webm',
  codecs: 'codecs="vp9"'
};
var VIDEO_VP9_NORMAL = {
  file: 'feelings_vp9-20130806-243.webm',
  mime: 'video/webm',
  codecs: 'codecs="vp9"'
};
var VIDEO_OUT8 = {
  file: 'out8.webm',
  mime: 'video/webm',
  codecs: 'codecs="vp8"'
};
var VIDEO_OUT9 = {
  file: 'out9.webm',
  mime: 'video/webm',
  codecs: 'codecs="vp9"'
};

var TEST_MSE = false;
var TEST_SEEK = false;
var AUTO_START = true;
var NUM_CHUNKS = 1;
var targetFile = VIDEO_VP9_NORMAL;
var mediaElement;
var mediaSource;

function onBodyLoad() {
  if (AUTO_START) {
    start();
  }
}

function start(file) {
  mediaElement = document.getElementsByTagName('video')[0];
  mediaElement.src = null;

  if (file) {
    targetFile = file;
  }

  if (TEST_SEEK) {
    mediaElement.addEventListener('timeupdate', function(e) {
      if (mediaElement.currentTime > 2 && mediaElement.currentTime < 3) {
        mediaElement.currentTime += 5;
      }
    });
  }
  
  if (TEST_MSE) {
    mediaSource = new MediaSource();
    mediaSource.addEventListener('sourceopen', onMSESourceOpen, false);
    mediaElement.src = window.URL.createObjectURL(mediaSource);
  } else {
    mediaElement.src = targetFile.file;
  }
}

function reset() {
  mediaElement.src = null;
}

function onMSESourceOpen(e) {
  var mime = targetFile.mime;
  try {
    mediaSource.addSourceBuffer(mime + '; ' + targetFile.codecs);
  } catch (err) {
    console.log('Failed to add source buffer.');
    return;
  }

  GET(targetFile.file, function (uInt8Array) {
    var file = new Blob([uInt8Array], {type: mime});
    var chunkSize = Math.ceil(file.size / NUM_CHUNKS);
    var chunkCnt = 0;

    (function readChunk_(chunkCnt) {
      var reader = new FileReader();

      reader.onload = function(e) {
        var sourceBuffer = mediaSource.sourceBuffers[0];
        if (!sourceBuffer) {
          console.log('Failed to get source buffer.');
          return;
        }

        sourceBuffer.addEventListener('updateend', function __updateend() {
          sourceBuffer.removeEventListener('updateend', __updateend);

          if ('open' !== mediaSource.readyState) {
            console.log('Readystate of mediaSouce is not open as expected.');
            return;
          }

          chunkCnt++;
          if (chunkCnt < NUM_CHUNKS) {
            readChunk_(chunkCnt);
          } else {
            mediaSource.endOfStream();
          }
        }, false);

        sourceBuffer.appendBuffer(new Uint8Array(e.target.result));
      };

      var startByte = chunkSize * chunkCnt;
      var chunk = file.slice(startByte, startByte + chunkSize);

      reader.readAsArrayBuffer(chunk);
    })(chunkCnt);
  });
}

function GET(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.send();

  xhr.onload = function(e) {
    if (xhr.status != 200) {
      alert("Unexpected status code " + xhr.status + " for " + url);
      return false;
    }
    callback(new Uint8Array(xhr.response));
  };
}
