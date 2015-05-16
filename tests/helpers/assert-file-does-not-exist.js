var chai = require('chai');

module.exports = function(directory, assetPath, message) {
  var path = directory + assetPath;

  message = message || assetPath + ' should not be a file';

  chai.assert.notIsFile(path, message);
}
