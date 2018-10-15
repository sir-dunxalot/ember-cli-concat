var chai = require('chai');
var emberCliConcat = require('./ember-cli-concat');
var getContentPosition = require('./get-content-position');
var paths = require('./fixtures/paths');
var root = process.cwd();

/* Test helpers */

var assert = chai.assert;
var assertFileContains = require('./assert/file-contains');
var assertFileExists = require('./assert/file-exists');
var assertFileDoesNotExist = require('./assert/file-does-not-exist');
var assertFileHasContent = require('./assert/file-has-content');
var getOutputPath = emberCliConcat.getOutputPath;

describe('Acceptance - Concatenation', function() {

  beforeEach(function() {
    process.chdir(root);
  });

  afterEach(function() {
    if (emberCliConcat.builder) {
      emberCliConcat.builder.cleanup();
    }
  });

  it('compiles the correct files with default options', function() {
    return emberCliConcat.buildWithOptions().then(function(results) {
      var directory = results.directory;

      /* Check each file in the default output paths exists */

      paths.all.forEach(function(path) {
        assertFileExists(directory, path);
      });

      /* Check original map files exist */

      assertFileExists(directory, getOutputPath('map', 'dummy'));
      assertFileExists(directory, getOutputPath('map', 'vendor'));
    });
  });

  it('concats JavaScript', function() {
    return emberCliConcat.buildWithOptions({
      js: {
        concat: true
      }
    }).then(function(results) {
      var directory = results.directory;

      /* We're not overwriting so the originals should
      all still exist */

      paths.all.forEach(function(path) {
        assertFileExists(directory, path);
      });

      /* But so should the new app.js file */

      assertFileExists(directory, getOutputPath('js'));

      /* Check previous map files exist with new map file */

      assertFileExists(directory, getOutputPath('map', 'dummy'));
      assertFileExists(directory, getOutputPath('map', 'vendor'));
      assertFileExists(directory, getOutputPath('map'));

    });
  });

  it('concats JavaScript and removes originals', function() {
    return emberCliConcat.buildWithOptions({
      js: {
        concat: true,
        preserveOriginal: false
      }
    }).then(function(results) {
      var directory = results.directory;

      /* The CSS files should still exist */

      paths.css.forEach(function(path) {
        assertFileExists(directory, path);
      });

      /* But the new app.js file should be the
      only js file */

      paths.js.forEach(function(path) {
        assertFileDoesNotExist(directory, path);
      });

      assertFileExists(directory, getOutputPath('js'));
      assertFileExists(directory, getOutputPath('map'));
    });
  });

  it('concats CSS', function() {
    return emberCliConcat.buildWithOptions({
      css: {
        concat: true
      }
    }).then(function(results) {
      var directory = results.directory;

      /* We're not overwriting so the originals should
      all still exist */

      paths.all.forEach(function(path) {
        assertFileExists(directory, path);
      });

      assertFileExists(directory, getOutputPath('map', 'dummy'));
      assertFileExists(directory, getOutputPath('map', 'vendor'));

      /* But so should the new app.css file */

      assertFileExists(directory, getOutputPath('css'));
      assertFileDoesNotExist(directory, getOutputPath('map'));
    });
  });

  it('concats CSS and removes originals', function() {
    return emberCliConcat.buildWithOptions({
      css: {
        concat: true,
        preserveOriginal: false
      }
    }).then(function(results) {
      var directory = results.directory;

      /* The JS files should still exist */

      paths.js.forEach(function(path) {
        assertFileExists(directory, path);
      });

      assertFileExists(directory, getOutputPath('map', 'dummy'));
      assertFileExists(directory, getOutputPath('map', 'vendor'));

      /* But the new app.css file should be the
      only CSS file */

      paths.css.forEach(function(path) {
        assertFileDoesNotExist(directory, path);
      });

      assertFileExists(directory, getOutputPath('css'));
      assertFileDoesNotExist(directory, getOutputPath('map'));
    });
  });

  it('concats JS and CSS', function() {
    return emberCliConcat.buildWithOptions({
      js: {
        concat: true
      },
      css: {
        concat: true
      }
    }).then(function(results) {
      var directory = results.directory;

      /* The original files should still exist */

      paths.all.forEach(function(path) {
        assertFileExists(directory, path);
      });

      /* But so should new app.js and app.css files */

      assertFileExists(directory, getOutputPath('js'));
      assertFileExists(directory, getOutputPath('css'));

      assertFileExists(directory, getOutputPath('map', 'dummy'));
      assertFileExists(directory, getOutputPath('map', 'vendor'));
      assertFileExists(directory, getOutputPath('map'));
    });
  });

  it('concats JS and CSS and removes originals', function() {
    return emberCliConcat.buildWithOptions({
      js: {
        concat: true,
        preserveOriginal: false
      },
      css: {
        concat: true,
        preserveOriginal: false
      }
    }).then(function(results) {
      var directory = results.directory;

      /* The original files should still exist */

      paths.all.forEach(function(path) {
        assertFileDoesNotExist(directory, path);
      });

      /* But so should new app.js and app.css files */

      assertFileExists(directory, getOutputPath('js'));
      assertFileExists(directory, getOutputPath('css'));
      assertFileExists(directory, getOutputPath('map'));
    });
  });

  it('concatenates content, not just file paths', function() {
    return emberCliConcat.buildWithOptions({
      js: {
        concat: true
      },
      css: {
        concat: true
      }
    }).then(function(results) {
      var appContent = 'dummy\/app';
      var directory = results.directory;
      var cssPath = getOutputPath('css');
      var jsPath = getOutputPath('js');
      var vendorContent = 'define = function';
      var vendorPosition, appPosition;

      assertFileHasContent(directory, cssPath);
      assertFileHasContent(directory, jsPath);

      /* Assert the JS contains vendor and app content */

      assertFileContains(directory, jsPath, vendorContent);
      assertFileContains(directory, jsPath, appContent);

      vendorPosition = getContentPosition(directory, jsPath, vendorContent);
      appPosition = getContentPosition(directory, jsPath, appContent);

      assert.isAbove(appPosition, vendorPosition,
        'Vendor JS should be before app JS in the concatenated JS');
    });
  });
});
