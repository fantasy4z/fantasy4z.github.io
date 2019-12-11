const {
  ConnectionClient,
  helper: { Camera, ConnectionStats },
} = window.alakazam;

function fetchConfig() {
  return new Promise(function (resolve, reject) {
    window.appRuntime.config = {
      "client": {
          "additionalIceServers": [
              {
                  "credential": "kaiedge2019stage",
                  "urls": [
                    "turn:52.207.162.9:80"
                  ],
                  "username": "kaios"
              }
          ],
          "disableMouseEvent": true,
          "host": "http://ad875a13f14d111ea9a9b022ad6490ee-bec30292ccbe2b76.elb.us-east-1.amazonaws.com/blastoise",
          "turnServer": {
              "credential": "kaiedge2019stage",
              "url": "turn:52.207.162.9:80",
              "username": "kaios"
          },
          "useBlastoise": true,
          "user_params": {
              "framesPerSecond": 30,
              "height": 746,
              "width": 480
          }
      },
      "pageUrl": "http://svc-museum-map:3000"
    };
    resolve();
  });
  // return fetch('/api/app-runtime/config')
  //   .then(function (res) {
  //     if (!res.ok) {
  //       throw new Error('Failed to fetch config.');
  //     }
  //     return res.json();
  //   })
  //   .then(function(config) {
  //     window.appRuntime.config = config;
  //   });
}

function initClient() {
  const mediaEl = document.querySelector('video');
  const logEl = document.querySelector('#log');
  let client;

  if (!mediaEl) {
    throw new Error('Video element not found.');
  }

  window.appRuntime.client = client = ConnectionClient.createClient(
    Object.assign({}, window.appRuntime.config.client, {
      mediaElement: document.querySelector('video'),
    })
  );

  // Hooks
  Camera.hookConnection({ connectionClient: client });
  if (logEl) {
    ConnectionStats.hookConnection({
      connectionClient: client,
      logFunction: function(msg) { logEl.innerHTML = msg; },
    });
  }

  // Handler for resizing
  client.resizeSmall = function() { client.resize(426, 570) };
  client.resizeLarge = function() { client.resize(480, 746) };

  // Handle the edge events
  client.addEventListener('edgefullscreen', function(isFullscreen) {
    if (isFullscreen) {
      client.resizeLarge();
    } else {
      client.resizeSmall();
    }
  });

  return client.connect({
    onReady: function() {
      client.resizeLarge();
      client.goto(window.appRuntime.config.pageUrl);
    },
  });
}

function main() {
  window.appRuntime = window.appRuntime || {};

  // Function injected by puppeteer to return result or errors. Mainly for test purpose.
  // Refer to integration tests for details.
  const puppeteerRet = function(ret) {
    if (window.puppeteerRet) {
      window.puppeteerRet(ret);
    }
  }

  // Global event handler to catch errors e.g. errors thrown by event handlers.
  window.addEventListener('error', (event) => {
    console.error(`window error:${event.error}`);
    puppeteerRet(`${event.error}`);
  });

  return fetchConfig()
    .then(initClient)
    .catch(function(err) {
      // Catch errors from client.connect() e.g. fetch() failures.
      console.error(`connect() error:${err}`);
      puppeteerRet(`${err}`);
    });
}

main();
