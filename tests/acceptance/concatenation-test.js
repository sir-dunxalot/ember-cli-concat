var ember = require('../helpers/ember');
var tmp = require('tmp-sync');
var path = require('path');
var root = process.cwd();
var tmproot = path.join(root, 'tmp');
var Project = require('ember-cli/lib/models/project');
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var App;

describe('Acceptance - Concatenation', function() {
  var tmpdir, project, projectPath;
  this.timeout(10000);
  // beforeEach(function() {
  //   App = startApp();
  // });

  beforeEach(function() {
    tmpdir = tmp.in(tmproot);
    process.chdir(tmpdir);
  });

  function initApp(options) {
    var app = ember(['build'], options);
    // app.options.test= true;
    return app;
  }

  // afterEach(function() {
  //   Ember.run(App, 'destroy');
  // });

  it('can visit Index', function() {

    var app = new EmberApp({
      project: project
    });


    return initApp({
      emberCliConcat: {
        js: { concat: true }
      }
    }).then(function() {
      console.log('HERE');
    });
    // andThen(function() {
      // expect(currentPath()).to.equal('index');
    // });
  });
});
