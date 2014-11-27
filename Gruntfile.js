module.exports = function(grunt) {

  'use strict';

  function parseAlias(prefix) {
    var fs = require('fs');
    var path = require('path');

    var root = 'spm_modules';

    var alias = [];

    fs.readdirSync(root).forEach(function(dest) {
      var version = fs.readdirSync(path.join(root, dest))[0];
      var spmmain = fs.readFileSync(path.join(root, dest, version, 'package.json'));

      // 移除多余的 `./`
      spmmain = JSON.parse(spmmain).spm.main.replace(/^\.\//, '');

      alias.push('\'' + dest + '\': \'' + prefix + '/' + root + '/' + dest + '/' + version + '/' + spmmain + '\'');
    });

    return alias.join(',\n      ');
  }

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({

    pkg: pkg,

    'cmd-wrap': {
      proxy: {
        dest: '.',
        port: 8080,
        rule: /^index\.js$/
      }
    },

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

    copy: {
      config: {
        options: {
          process: function(content /*, srcpath*/ ) {
            return content.replace(/@APPNAME/g, pkg.name)
              .replace(/@VERSION/g, pkg.version)
              .replace(/@ALIAS/g, parseAlias(pkg.name));
          }
        },
        files: [{
          expand: true,
          cwd: 'examples/lib',
          src: ['config.js.tpl'],
          dest: 'examples/lib',
          ext: '.js'
        }]
      }
    },

    exec: {
      'spm-publish': 'spm publish',
      'spm-test': 'spm test'
    }

  });

  grunt.registerTask('test', ['jshint','exec:spm-test']);

  grunt.registerTask('develop', ['connect']);

  grunt.registerTask('publish', ['test', 'exec:spm-publish']);

  grunt.registerTask('proxy', ['cmd-wrap']);
  grunt.registerTask('default', ['develop']);

};
