/* Defaults from https://github.com/ember-cli/ember-cli/blob/master/lib/broccoli/ember-app.js */

var appCssPath = '/assets/dummy.css';
var appJsPath = '/assets/dummy.js';
var vendorCssPath = '/assets/vendor.css';
var vendorJsPath = '/assets/vendor.js';

module.exports = {
  appCss: appCssPath,
  appJs: appJsPath,
  vendorCss: vendorCssPath,
  vendorJs: vendorJsPath,

  css: [appCssPath, vendorCssPath],
  js: [appJsPath, vendorJsPath],
  all: [appCssPath, vendorCssPath, appJsPath, vendorJsPath],

  outputPaths: {
    app: {
      html: 'index.html',
      css: {
        'app': appCssPath
      },
      js: appJsPath
    },
    vendor: {
      css: vendorCssPath,
      js: vendorJsPath
    },
    testSupport: {
      css: '/assets/test-support.css',
      js: {
        testSupport: '/assets/test-support.js',
        testLoader: '/assets/test-loader.js'
      }
    }
  }
}
