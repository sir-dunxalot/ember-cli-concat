var chai = require('chai');

module.exports = function(directory, assetPath, message) {
  var path = directory + assetPath;

  message = message || assetPath + ' should be a file';

  chai.assert.isFile(path, message);
}
