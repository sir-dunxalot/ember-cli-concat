'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const environment = process.env.EMBER_ENV;

const options = {
  storeConfigInMeta: false,
  fingerprint: {
    enabled: false,
  },
  emberCliConcat: {
    /* Test custom options here */
  }
};

if (environment === 'production') {
  options.emberCliConcat = {
    css: {
      concat: true
    },
    js: {
      concat: true
    }
  }
}

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, options);

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};
