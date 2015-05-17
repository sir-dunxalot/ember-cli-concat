var chai = require('chai');

/**
Assert a file is not empty, regardless of it's content,
using Chai-fs

@method fileHasContent
*/

module.exports = function(directory, assetPath, message) {
  var path = directory + assetPath;

  message = message || assetPath + ' should not be empty';

  chai.assert.notIsEmptyFile(path, message);
}
