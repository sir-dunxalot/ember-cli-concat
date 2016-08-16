var fs = require('fs');

/**
Lists the contents of a given directory as an array.
Not currently used in tests, but useful for debugging.

@method getDirectoryContents
*/

module.exports = function(directory) {
  return fs.readdirSync(directory);
};
