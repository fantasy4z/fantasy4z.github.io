module.exports = {
  webrtc: {
    common: {
      /**
       * Additional ICE servers to be used.
       * Ref: https://developer.mozilla.org/en-US/docs/Web/API/RTCIceServer/urls
       */
      additionalIceServers: [/*
        {
          urls: ['turn:3.114.87.93:80'],
          username: 'kaios',
          credential: 'kaiedge2019',
        },
      */],
      /**
       * ICE transport policy. Change this value to 'relay' to force TURN relay.
       */
      iceTransportPolicy: 'all',
    },
    server: {
      portRange: {
        min: 50000,
        max: 51000,
      },
    },
  },
};

