var chai = require('chai');

module.exports = function(directory, assetPath, message) {
  var path = directory + assetPath;

  message = message || 'File should not exist';

  chai.assert.notPathExists(path, message);
}
