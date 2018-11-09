'use strict';

const chai = require('chai');
const glob = require('glob');
const Mocha = require('mocha');
if (process.env.EOLNEWLINE) {
  require('os').EOL = '\n';
}

const mocha = new Mocha({
  timeout: 10000,
  reporter: 'spec'
});

const arg = process.argv[2];
const root = 'tests/{unit,acceptance}';

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
