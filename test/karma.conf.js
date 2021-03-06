// Karma configuration
// Generated on Wed Mar 04 2015 00:21:23 GMT+0200 (Греция, Турция (зима))

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '..',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'sinon'],


    // list of files / patterns to load in the browser
    files: [
      'public/bower_components/angular/angular.js',
      'public/bower_components/angular-mocks/angular-mocks.js',
      'public/bower_components/jquery/dist/jquery.js',
      'public/bower_components/oauth-js/dist/oauth.js',
      'public/bower_components/jasmine-sinon/lib/jasmine-sinon.js',
      'public/bower_components/angular-ui-router/release/angular-ui-router.js',
      'public/js/app/**/*.js',
      'test/unit/customMatchers.js',
      'test/unit/**/*Spec.js',
      'views/**/*.jade'
    ],
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },

    preprocessors: {
      'public/js/app/**/*.js' : ['coverage'],
      'views/**/*.jade': ['ng-jade2js']
    },

    ngJade2JsPreprocessor: {
      cacheIdFromPath: function(filepath) {
        filepath = filepath.replace(/\.jade$/, '');
        filepath = filepath.replace(/^views\//, '');
        return filepath;
      },
      moduleName: 'anguLearn.templates'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
