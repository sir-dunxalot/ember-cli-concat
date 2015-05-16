var chai = require('chai');
var assert = chai.assert;

chai.use(require('chai-fs'));

module.exports = function(directory, assetPath, message) {
  var path = directory + assetPath;

  message = message || assetPath + ' should be a file';

  assert.isFile(path, message);
}
