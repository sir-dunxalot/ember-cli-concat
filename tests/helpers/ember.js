'use strict';

var MockUI        = require('./mock-ui');
var MockAnalytics = require('./mock-analytics');
var Cli           = require('ember-cli/lib/cli');
var merge         = require('lodash').merge;

module.exports = function ember(args, options) {
  var cli = new Cli(merge(options, {
    inputStream: [],
    outputStream: [],
    cliArgs: args,
    Leek: MockAnalytics,
    UI: MockUI,
    testing: true
  }));

  return cli;
};
