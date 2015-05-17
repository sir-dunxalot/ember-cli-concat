var chai = require('chai');

/**
Assert a file does exist at a specified path using
Chai-fs, and check it's actually a file

@method fileExists
*/

module.exports = function(directory, assetPath, message) {
  var path = directory + assetPath;

  message = message || 'File should exist';

  chai.assert.isFile(path, message);
}
