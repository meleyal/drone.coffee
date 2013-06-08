// Karma configuration

// base path, that will be used to resolve files and exclude
basePath = '../';

// list of files / patterns to load in the browser
    files = [
      JASMINE,
      JASMINE_ADAPTER,

      // dependencies + brunch require function
      'public/scripts/vendor.js',
      'public/scripts/app.js',

      // test support
      'test/vendor/sinon.js',
      'test/vendor/jasmine-sinon.js',
      'test/vendor/jasmine-jquery.js',

      // tests
      'test/**/*-test.coffee'
    ];

// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress', 'growl'];

// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;

// compile coffee scripts
preprocessors = {
  '**/*.coffee': 'coffee'
};
