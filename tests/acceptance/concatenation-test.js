var assertFileExists = require('../helpers/assert-file-exists');
var ember = require('../helpers/ember');
var tmp = require('tmp-sync');
var path = require('path');
var root = process.cwd();
var tmproot = path.join(root, 'tmp');
// var MockProject = require('ember-cli/tests/helpers/mock-project');
var Project = require('ember-cli/lib/models/project');
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
var MockUI        = require('../helpers/mock-ui');
var App;

describe('Acceptance - Concatenation', function() {
  var tmpdir, project, projectPath;

  this.timeout(10000);

  beforeEach(function() {
    tmpdir = tmp.in(tmproot);
    process.chdir(tmpdir);
  });

  function initApp(options) {
    var app = ember(['build'], options);

    return app;
  }

  it('compiles the correct files with default options', function() {
    var projectRoot = path.resolve(__dirname, '../fixtures')
    var packageContents = require(path.join(projectRoot, 'package.json'));
    var app = new EmberApp({
      // name: 'dummy',
      project: new Project(projectRoot, packageContents, new MockUI()),
    });

    return initApp({

      /* These arguments are not affecting anything */

      fingerprint: {
        enabled: true,
      },
      emberCliConcat: {
        js: {
          concat: true,
          preserveOriginal: false
        }
      }
    }).then(function() {
      var outputPaths = app.options.outputPaths;

      for (var treeName in outputPaths) {
        var assets = outputPaths[treeName];

        ['css', 'js'].forEach(function(extension) {
          var paths = assets[extension];

          if (typeof paths === 'string') {
            assertFileExists(paths);
          } else {
            for (var type in paths) {
              assertFileExists(paths[type]);
            }
          }
        });
      }
    });
  });
});
