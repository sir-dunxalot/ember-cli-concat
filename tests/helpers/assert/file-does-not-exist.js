var chai = require('chai');

/**
Assert a file does not exist at a specified path using
Chai-fs

@method fileDoesNotExist
*/

module.exports = function(directory, assetPath, message) {
  var path = directory + assetPath;

  message = message || 'File should not exist';

  chai.assert.notPathExists(path, message);
}
