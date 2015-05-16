var chai = require('chai');
var emberCliConcat = require('../helpers/ember-cli-concat');
var defaultOptions = require('../fixtures/default-options');
var paths = require('../fixtures/paths');
var root = process.cwd();

/* Test helpers */

var assert = chai.assert;
var getOutputPath = emberCliConcat.getOutputPath;

describe('Acceptance - Helper Functions', function() {

  it('can clean paths correctly', function() {
    var dirtyPaths = [
      'assets/',
      '/assets',
      '/assets/'
    ];

    dirtyPaths.forEach(function(path) {
      var cleanPath = emberCliConcat.module.cleanPath(path);

      assert.strictEqual(cleanPath, 'assets');
    });
  });
});
