var fs = require('fs');

module.exports = function(directory, assetPath, content) {
  var path = directory + assetPath;
  var data = fs.readFileSync(path, 'utf8');

  return data.indexOf(content);
}
