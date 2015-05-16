module.exports = {
  js: {
    concat: false,
    contentFor: 'concat-js',
    footer: null,
    header: null,
    preserveOriginal: true
  },

  css: {
    concat: false,
    contentFor: 'concat-css',
    footer: null,
    header: null,
    preserveOriginal: true
  },

  enabled: true,
  outputDir: 'assets',
  outputFileName: 'app',
  useSelfClosingTags: false,
  wrapScriptsInFunction: false,

  _outputPath: '/assets/app.' // Added for convenience
};
