import Em from 'ember';
import { test } from 'ember-qunit';
import { module } from 'qunit';
import startApp from '../helpers/start-app';
import config from 'dummy/config/environment';

var App, assert;

module('Ember CLI Concat', {

  setup: function() {
    App = startApp();
  },

  teardown: function() {
    Em.run(App, 'reset');
  }

});

var checkTagExists = function(fileName) {
  var isCSS = fileName.indexOf('.css') > -1;
  var attribute = isCSS ? 'href' : 'src';
  var element = isCSS ? 'link' : 'script';
  var tagExists = $(element + '[' + attribute + '="/assets/' + fileName + '"]').length === 1;

  assert.ok(tagExists, fileName + ' ' + element + ' tag should be written to to the index.html file');
};

test('Assets added to index.html file', function(_assert) {
  assert = _assert; // Hack

  andThen(function() {
    var env = config.environment;
    var appFiles, vendorFiles, testFiles;

    if (env === 'development') {
      checkTagExists('dummy.css');
      checkTagExists('vendor.css');
      checkTagExists('dummy.js');
      checkTagExists('vendor.js');

      if (App.testing) {
        checkTagExists('test-support.css');
        checkTagExists('test-support.js');
      }
    } else if (env === 'production') {

      /* TODO - Currently can't run tests in production environment */

      checkTagExists('app.css');
      checkTagExists('app.js');
    } else {
      assert.expect(0);
    }

  });

});
