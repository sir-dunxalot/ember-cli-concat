var chai = require('chai');
var assert = chai.assert;

chai.use(require('chai-fs'));

module.exports = function(assetPath) {
  var path = 'dist' + assetPath;

  assert.isFile(path, path + ' should be a file');
}
