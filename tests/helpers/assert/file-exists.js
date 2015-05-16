var chai = require('chai');

module.exports = function(directory, assetPath, message) {
  var path = directory + assetPath;

  message = message || 'File should exist';

  chai.assert.isFile(path, message);
}
