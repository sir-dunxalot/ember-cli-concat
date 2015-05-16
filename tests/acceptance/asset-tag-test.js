var emberCliConcat = require('../helpers/ember-cli-concat');
var defaultOptions = require('../fixtures/default-options');
var paths = require('../fixtures/paths');
var root = process.cwd();

/* Test helpers */

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

  it('compiles the correct files with default options', function() {
    var jsContentFor = defaultOptions.js.contentFor;
    var tags;

    emberCliConcat.setOptions();

    tags = emberCliConcat.module.contentFor(jsContentFor);

    console.log(tags);
  });
});
