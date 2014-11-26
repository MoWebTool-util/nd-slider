module.exports = function(grunt) {

  'use strict';

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    connect: {
      server: {
        options: {
          // protocol: 'http',
          port: 8080,
          hostname: '127.0.0.1',
          // base: '.',
          // directory: null,
          keepalive: true,
          debug: true,
          livereload: false,
          // open: true,
          useAvailablePort: true,
          middleware:  function (connect, options, middlewares) {
            // inject a custom middleware into the array of default middlewares
            middlewares.unshift(function(req, res, next) {
              if (req.url !== '/index.js' &&
                  req.url !== '/spm_modules/jquery/1.11.1/jquery.js') {
                return next();
              }

              var fs = require('fs');
              var path = require('path');
              var body = fs.readFileSync(path.join(process.cwd(), req.url));

              res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
              res.end('define(function(require, exports, module) {' + body + '});');
            });

            return middlewares;
          }
        }
      }
    },

    jshint: {
      files: ['index.js', 'src/**/*.js'],
      options: {
        jshintrc: true
      }
    },

    exec: {
      'spm-publish': 'spm publish',
      'spm-test': 'spm test'
    }

  });

  grunt.registerTask('test', [
    'jshint',
    'exec:spm-test'
  ]);

  grunt.registerTask('develop', [
    'connect'
  ]);

  grunt.registerTask('publish', [
    'test',
    'exec:spm-publish'
  ]);

  grunt.registerTask('default', [
    'develop'
  ]);

};
