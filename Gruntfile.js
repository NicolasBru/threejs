var LIVERELOAD_PORT = 35729;
var SERVER_PORT = 4000;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {

  'use strict';

  var gruntConfig = {};

  var pkg = 'package.json';

  gruntConfig.pkg = grunt.file.readJSON(pkg);

  gruntConfig.open = {
    options:{
      delay: 5 // seconds
    },
    dev: {
      path: 'http://localhost:4000/'
    }
  };

  gruntConfig.meta = {
    build: 'public',
    bower: 'bower_components'
  };

  gruntConfig.jade = {
    build: {
      options: {
        pretty: true,
        data: {
          appcache: null,
          title: '<%= pkg.title %>'
        }
      },
      files: [{
        expand: true,
        src: ["**/views/*.jade"],
        ext: ".html",
        cwd: "app/",
        dest: "<%= meta.build %>/"
      }]
    }
  };

  gruntConfig.compass = {
    options: {
      sassDir: 'app/assets/stylesheets',
      cssDir: 'public/stylesheets/',
      specify: '**/stylesheets/*.sass'
    },
    all: {}

  };

  gruntConfig.coffee = {
    options: {
      bare: true
    },
    compile: {
      expand: true,
      cwd: 'app/assets/coffee',
      src: ['{,**/}/*.coffee'],
      dest: '<%= meta.build %>/javascripts/',
      ext: '.js'
    }
  };

  gruntConfig.concat = {
    vendor: {
      src: [
        '<%= meta.bower %>/threejs/build/three.js'
      ],
      dest: '<%= meta.build %>/javascripts/libs/vendor.js'
    }
  };

  gruntConfig.copy = {
    modernizr: {
      files: [{
        src: ["modernizr.js"],
        expand: true,
        cwd: "<%= meta.bower %>/modernizr",
        dest: "<%= meta.build %>/javascripts/libs/"
      }]
    },
    fonts: {
      files: [{
        src: ["**/assets/fonts/{,**/}/*"],
        expand: true,
        cwd: "app/",
        dest: "<%= meta.build %>/"
      }]
    },
    images: {
      files: [{
        src: ["**/assets/images/{,**/}*"],
        expand: true,
        cwd: "app/",
        dest: "<%= meta.build %>/"
      }]
    },
    json: {
      files: [{
        src: ["**/data/{,**/}/*"],
        expand: true,
        cwd: "app/",
        dest: "<%= meta.build %>/"
      }]
    }
  };

  gruntConfig.watch = {
    options: {
      nospawn: true,
      livereload: true
    },
    jade: {
      files: ['app/**/views/{,**/}/*.jade'],
      tasks: ['jade']
    },
    coffee: {
      files: ['app/assets/coffee/{,**/}*.coffee'],
      tasks: ['coffee']
    },
    vendor: {
      files: ['<%= concat.vendor.src %>'],
      tasks: ['concat']
    },
    compass: {
      files: ['app/assets/stylesheets/{,**/}*.sass'],
      tasks: ['compass']
    },
    livereload: {
      options: {
        livereload: LIVERELOAD_PORT
      },
      files: [
        '<%= meta.build %>'
      ]
    }
  };

  gruntConfig.nodemon = {
    server: {
      script: 'app/server.js',
      options: {
        ignore: ['README.md', 'node_modules/**', 'assets/**'],
        watch: ['app/*.js', 'app/*.json']
      }
    }
  };

  gruntConfig.concurrent = {
    start: {
      tasks: ['nodemon', 'watch', 'open'],
      options: {
        logConcurrentOutput: true
      }
    }
  };

  gruntConfig.clean = {
    options: {
      force: true
    },
    build: {
      src: ['<%= meta.build %>']
    }
  };

  gruntConfig.notify = {
    options: {
      title: '<%= pkg.title %>'
    },
    build: {
      options: {
        message: 'Build Complete'
      }
    }
  };

  grunt.initConfig(gruntConfig);

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('build', ['clean', 'concat', 'compass', 'coffee', 'copy', 'jade', 'notify:build']);

  grunt.registerTask('start', ['build', 'server']);

  grunt.registerTask('server', ['concurrent:start']);

  grunt.registerTask('default', ['build']);

};