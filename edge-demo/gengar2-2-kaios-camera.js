
/* Copy and rename to 'config.js' to apply the setting */

// TODO: use camelCase for variables as they're more common in Node.js world.
let defaultConfigs = {
  httpListenPort: 3000,

  // in local dev env, change this path to your chrome binary
  chrome_executue_path: '/data/chrome-headless/headless_shell',
  chrome_launch_page: 'https://www.google.com/',
  chrome_viewport: {
    width: 240,
    height: 294,
  },
  chrome: {
    cpuOnly: false,
  },
  serverRtcConfPortRange: {
    min: 50000,
    max: 51000,
  },
  app: {
    webrtc: {
      framesPerSecond: 18,
      videoResizePercentage: 100/100,
      useArrowKeysToMoveMouse: true,
    },
  },
};

// Parse env variables at runtime
function parseEnvBool(envName, config, fieldName) {
  if (process.env[envName] !== undefined) {
    config[fieldName] = process.env[envName] === 'true';
  }
}

function parseEnvInt(envName, config, fieldName) {
  if (process.env[envName] !== undefined) {
    config[fieldName] = parseInt(process.env[envName], 10);
  }
}

parseEnvBool('GENGAR_CPU_ONLY', defaultConfigs.chrome, 'cpuOnly');
parseEnvInt('GENGAR_SERVER_RTC_CONF_PORT_RANGE_MIN', defaultConfigs.serverRtcConfPortRange, 'min');
parseEnvInt('GENGAR_SERVER_RTC_CONF_PORT_RANGE_MAX', defaultConfigs.serverRtcConfPortRange, 'max');
parseEnvInt('GENGAR_HTTP_LISTEN_PORT', defaultConfigs, 'httpListenPort');

module.exports = defaultConfigs;
