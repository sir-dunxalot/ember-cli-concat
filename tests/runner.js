'use strict';

var chai = require('chai');
var glob = require('glob');
var Mocha = require('mocha');
if (process.env.EOLNEWLINE) {
  require('os').EOL = '\n';
}

var mocha = new Mocha({
  timeout: 10000,
  reporter: 'spec'
});

var arg = process.argv[2];
var root = 'tests/{unit,acceptance}';

function addFiles(mocha, files) {
  glob.sync(root + files).forEach(mocha.addFile.bind(mocha));
}

if (arg === 'all') {
  addFiles(mocha, '/**/*-test.js');
  addFiles(mocha, '/**/*-slow.js');
} else if (arg)  {
  mocha.addFile(arg);
} else {
  addFiles(mocha, '/**/*-test.js');
}

chai.use(require('chai-fs')); // Add Node fs tests

mocha.run(function(failures) {
  process.on('exit', function() {
    process.exit(failures);
  });
});
