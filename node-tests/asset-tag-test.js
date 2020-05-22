var chai = require('chai');
var emberCliConcat = require('./ember-cli-concat');
var paths = require('./fixtures/paths');
var { join: joinPaths } = require('path');

/* Test helpers */

var assert = chai.assert;
var getOutputPath = emberCliConcat.getOutputPath;

describe('Acceptance - Asset Tags', function() {

  beforeEach(function() {
    emberCliConcat.resetDefaultConfig();
    emberCliConcat.resetDefaultOptions();
  });

  afterEach(function() {
    emberCliConcat.resetDefaultConfig();
  });

  it('renders all asset tags', function() {
    var tags;

    /* Check JS content-for tags */

    tags = emberCliConcat.getAssetTagsAsString('js');

    paths.js.forEach(function(path) {
      var tag = '<script src="' + path +'"></script>';

      assert.include(tags, path);
      assert.include(tags, tag);
    });

    /* Check CSS content-for tags */

    tags = emberCliConcat.getAssetTagsAsString('css');

    paths.css.forEach(function(path) {
      var tag = '<link rel="stylesheet" href="' + path +'">';

      assert.include(tags, path);
      assert.include(tags, tag);
    });
  });

  it('renders asset tags with JS concatenation', function() {
    var tags;

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
    var tags;

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
    var tags;

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

  it('renders asset tags with JS and CSS concatenation with custom content-for hooks', function() {
    var tags;

    emberCliConcat.setOptions({
      js: {
        contentFor: 'fish',
        concat: true
      },
      css: {
        contentFor: 'and-chips',
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

  it('renders style tags with and without closing tags', function() {
    var tags;

    tags = emberCliConcat.getAssetTagsAsString('css');

    assert.include(tags, '">');

    emberCliConcat.setOptions({
      useSelfClosingTags: true
    });

    tags = emberCliConcat.getAssetTagsAsString('css');

    assert.include(tags, '" />');
  });

  it('renders asset tags with JS and CSS concatenation with application environment configured rootURL', function() {
    var tags;
    var rootURL = '/config-root-url/';

    emberCliConcat.config({ rootURL: rootURL });
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

    assert.include(tags, joinPaths(rootURL, getOutputPath('js')));

    /* Check CSS content-for tags */

    tags = emberCliConcat.getAssetTagsAsString('css');

    assert.include(tags, joinPaths(rootURL, getOutputPath('css')));
  });

  it('renders asset tags with JS and CSS concatenation with build configuration overridden rootURL', function() {
    var tags;
    var configRootURL = '/config-root-url/';
    var buildRootURL = '/build-root-url/';

    emberCliConcat.config({ rootURL: configRootURL });
    emberCliConcat.setOptions({
      rootURL: buildRootURL,
      js: {
        concat: true
      },
      css: {
        concat: true
      }
    });

    /* Check JS content-for tags */

    tags = emberCliConcat.getAssetTagsAsString('js');

    assert.include(tags, joinPaths(buildRootURL, getOutputPath('js')));

    /* Check CSS content-for tags */

    tags = emberCliConcat.getAssetTagsAsString('css');

    assert.include(tags, joinPaths(buildRootURL, getOutputPath('css')));
  });
});
