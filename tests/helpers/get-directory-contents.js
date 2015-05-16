var fs = require('fs');

module.exports = function(directory) {
  return fs.readdirSync(directory);
}
