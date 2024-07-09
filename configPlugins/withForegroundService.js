const { withAndroidManifest, AndroidConfig } = require("@expo/config-plugins");

function addFGS(manifest) {
  const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(manifest)

  // set the services
  mainApplication.service = []
  mainApplication.service.push({
    $: {
      'android:name': 'app.notifee.core.ForegroundService',
      'android:foregroundServiceType': 'dataSync',
    },
  });

  return manifest;
}

module.exports = function withForegroundService(config, attributes) {
  return withAndroidManifest(config, (config) => {
    config.modResults = addFGS(config.modResults);
    return config;
  });
};
