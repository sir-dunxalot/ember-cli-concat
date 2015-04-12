/* jshint node: true */
/* global require, module */

var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
var environment = process.env.EMBER_ENV;

var options = {
  storeConfigInMeta: false,
  fingerprint: {
    enabled: true,
  },
  emberCliConcat: {
    /* Test custom options here */
  }
};

if (environment === 'development') {

}

var app = new EmberAddon(options);

module.exports = app.toTree();
