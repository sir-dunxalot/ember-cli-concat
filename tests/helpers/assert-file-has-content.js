var chai = require('chai');

module.exports = function(directory, assetPath, message) {
  var path = directory + assetPath;

  message = message || assetPath + ' should not be empty';

  chai.assert.notIsEmptyFile(path, message);
}
