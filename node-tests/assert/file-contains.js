var chai = require('chai');
chai.use(require('chai-fs'));

/**
Assert whether a file contains particular content
somewhere within it using Chai-fs

@method fileContains
*/

module.exports = function(directory, assetPath, content, message) {
  var path = directory + assetPath;
  var regex = new RegExp(content);

  message = message || 'File should contain specified content';

  chai.assert.fileContentMatch(path, regex, message);
};
