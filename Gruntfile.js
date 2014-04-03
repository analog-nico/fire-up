'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    run: {
      jasmine_node_with_coverage: {
        cmd: 'node_modules/.bin/grunt',
        args: ['jasmine_node_with_coverage']
      }
    },
    clean: {
      all: 'coverage'
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'test/**/*.js',
        'lib/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    jasmine_node_with_coverage: {
      coverage: {
        excludes: ['test/**', 'coverage/**', 'Gruntfile.js']
      },
      options: {
        matchall: true,
        specFolders: ['test/'],
        isVerbose: true
      }
    },
    jasmine_node_no_coverage: {
      coverage: false,
      options: {
        matchall: true,
        specFolders: ['test/'],
        isVerbose: true
      }
    },
    watch: {
      js: {
        files: ['**/*.js', '!node_modules/**/*.js'],
        tasks: ['default'],
        options: {
          spawn: true // Since livereload seems not to be working we spawn to require the latest index.js
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jasmine-node-coverage');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('jasmine_node_with_coverage', 'Unit testing with coverage report', function () {
    grunt.config.set('jasmine_node', grunt.config.get('jasmine_node_with_coverage'));
    grunt.task.run('jasmine_node');
  });

  grunt.registerTask('jasmine_node_no_coverage', 'Just unit testing', function () {
    grunt.config.set('jasmine_node', grunt.config.get('jasmine_node_no_coverage'));
    grunt.task.run('jasmine_node');
  });

  // 'jasmine-node' needs to run in a separate task because the coverage report is created when grunt exits.
  // When we use watch grunt keeps running and no report would be generated if 'jasmine-node' would be executed directly.
  grunt.registerTask('test', ['clean', 'jshint', 'run:jasmine_node_with_coverage', 'watch']);
  grunt.registerTask('test_no_coverage', ['clean', 'jshint', 'jasmine_node_no_coverage', 'watch']);

  // 'jasmine-node' needs to run in a separate task the second time it is executed so that es-sequence freshly required.
  // The unit tests assume that es-sequence is not initialized in the beginning.
  grunt.registerTask('ci', ['clean', 'jshint', 'jasmine_node_no_coverage', 'run:jasmine_node_with_coverage']);

  grunt.registerTask('default', ['test']);
};
