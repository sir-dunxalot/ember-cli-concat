var chai = require('chai');
var emberCliConcat = require('../helpers/ember-cli-concat');
var paths = require('../fixtures/paths');

/* Test helpers */

var assert = chai.assert;
var getOutputPath = emberCliConcat.getOutputPath;

describe('Acceptance - Asset Tags', function() {

  it('renders all asset tags', function() {
    var tags;

    emberCliConcat.resetDefaultOptions();

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

  it('renders asset tags with JS and CSS concatenation with custom content-for hooks', function() {
    var tags;

    emberCliConcat.resetDefaultOptions();
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

    emberCliConcat.resetDefaultOptions();

    tags = emberCliConcat.getAssetTagsAsString('css');

    assert.include(tags, '">');

    emberCliConcat.setOptions({
      useSelfClosingTags: true
    });

    tags = emberCliConcat.getAssetTagsAsString('css');

    assert.include(tags, '" />');
  });
});
