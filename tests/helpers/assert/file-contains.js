var chai = require('chai');

module.exports = function(directory, assetPath, content, message) {
  var path = directory + assetPath;
  var regex = new RegExp(content);

  message = message || 'File should contain specified content';

  chai.assert.fileContentMatch(path, regex, message);
}
