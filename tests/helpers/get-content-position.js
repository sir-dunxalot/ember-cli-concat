var fs = require('fs');

/**
The the position of a particular string of content within
a file at the specified path. Useful to check whether one
piece of content is before another in an already
concatenated file.

@method getContentPosition
*/


module.exports = function(directory, assetPath, content) {
  var path = directory + assetPath;
  var data = fs.readFileSync(path, 'utf8');

  return data.indexOf(content);
}
