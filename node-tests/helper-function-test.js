var chai = require('chai');
var emberCliConcat = require('./ember-cli-concat');

/* Test helpers */

var assert = chai.assert;

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
