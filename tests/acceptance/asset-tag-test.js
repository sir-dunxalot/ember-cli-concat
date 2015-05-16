var chai = require('chai');
var emberCliConcat = require('../helpers/ember-cli-concat');
var defaultOptions = require('../fixtures/default-options');
var paths = require('../fixtures/paths');
var root = process.cwd();

/* Test helpers */

var assert = chai.assert;
var getOutputPath = emberCliConcat.getOutputPath;

describe('Acceptance - Asset Tags', function() {
  this.timeout(10000);

  beforeEach(function() {
    process.chdir(root);
  });

  afterEach(function() {
    if (emberCliConcat.builder) {
      emberCliConcat.builder.cleanup();
    }
  });

  it('renders all asset tags', function() {
    var jsContentFor = defaultOptions.js.contentFor;
    var tags;

    emberCliConcat.resetDefaultOptions();

    /* Check JS content-for tags */

    tags = emberCliConcat.getAssetTagsAsString('js');

    paths.js.forEach(function(path) {
      assert.include(tags, path);
    });

    /* Check CSS content-for tags */

    tags = emberCliConcat.getAssetTagsAsString('css');

    paths.css.forEach(function(path) {
      assert.include(tags, path);
    });
  });

  it('renders asset tags with JS concatenation', function() {
    var jsContentFor = defaultOptions.js.contentFor;
    var tags;

    emberCliConcat.resetDefaultOptions();
    emberCliConcat.setOptions({
      js: {
        concat: true
      }
    });

    /* Check JS content-for tags */

    tags = emberCliConcat.getAssetTagsAsString('js');

    assert.include(tags, getOutputPath('js'));

    /* Check CSS content-for tags */

    tags = emberCliConcat.getAssetTagsAsString('css');

    paths.css.forEach(function(path) {
      assert.include(tags, path);
    });
  });

  it('renders asset tags with CSS concatenation', function() {
    var jsContentFor = defaultOptions.js.contentFor;
    var tags;

    emberCliConcat.resetDefaultOptions();
    emberCliConcat.setOptions({
      css: {
        concat: true
      }
    });

    /* Check JS content-for tags */

    tags = emberCliConcat.getAssetTagsAsString('js');

    paths.js.forEach(function(path) {
      assert.include(tags, path);
    });

    /* Check CSS content-for tags */

    tags = emberCliConcat.getAssetTagsAsString('css');

    assert.include(tags, getOutputPath('css'));
  });

  it('renders asset tags with JS and CSS concatenation', function() {
    var jsContentFor = defaultOptions.js.contentFor;
    var tags;

    emberCliConcat.resetDefaultOptions();
    emberCliConcat.setOptions({
      js: {
        concat: true
      },
      css: {
        concat: true
      }
    });

    /* Check JS content-for tags */

    tags = emberCliConcat.getAssetTagsAsString('js');

    assert.include(tags, getOutputPath('js'));

    /* Check CSS content-for tags */

    tags = emberCliConcat.getAssetTagsAsString('css');

    assert.include(tags, getOutputPath('css'));
  });
});
