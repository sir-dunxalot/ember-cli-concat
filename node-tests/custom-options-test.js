var chai = require('chai');
var defaultOptions = require('./fixtures/default-options');
var emberCliConcat = require('./ember-cli-concat');
var root = process.cwd();

/* Test helpers */

var assert = chai.assert;
var assertFileContains = require('./assert/file-contains');
var assertFileExists = require('./assert/file-exists');
var assertFileDoesNotExist = require('./assert/file-does-not-exist');
var getOutputPath = emberCliConcat.getOutputPath;

describe('Acceptance - Custom Options', function() {

  beforeEach(function() {
    process.chdir(root);
  });

  afterEach(function() {
    if (emberCliConcat.builder) {
      emberCliConcat.builder.cleanup();
    }
  });

  it('can add a header and footer to concatinated files', function() {
    var footer = 'Fried chicken';
    var header = 'Potato salad';

    return emberCliConcat.buildWithOptions({
      js: {
        concat: true,
        footer: footer,
        header: header
      },
      css: {
        concat: true,
        footer: footer,
        header: header
      }
    }).then(function(results) {
      var directory = results.directory;
      var cssPath = getOutputPath('css');
      var jsPath = getOutputPath('js');

      /* Check header and footer are present in CSS file */

      assertFileContains(directory, cssPath, header);
      assertFileContains(directory, cssPath, footer);

      /* Check header and footer are present in JS file */

      assertFileContains(directory, jsPath, header);
      assertFileContains(directory, jsPath, footer);
    });
  });

  it('can place concatenated files at a custom path', function() {
    var outputDir = 'ice';
    var outputFileName = 'cream';

    return emberCliConcat.buildWithOptions({
      js: {
        concat: true
      },
      css: {
        concat: true
      },
      outputDir: outputDir,
      outputFileName: outputFileName
    }).then(function(results) {
      var directory = results.directory;
      var cssPath = getOutputPath('css');
      var jsPath = getOutputPath('js');
      var tags;

      /* Check the correct asset tags are returned */

      tags = emberCliConcat.getAssetTagsAsString('css');

      assert.include(tags, cssPath);
      assertFileExists(directory, cssPath);
      assertFileDoesNotExist(directory, defaultOptions._outputPath + 'css');

      tags = emberCliConcat.getAssetTagsAsString('js');

      assert.include(tags, jsPath);
      assertFileExists(directory, jsPath);
      assertFileDoesNotExist(directory, defaultOptions._outputPath + 'js');

      assertFileExists(directory, getOutputPath('map'));
    });
  });
});
