/*
 * grunt-cdndeps
 * https://github.com/cambridge-healthcare/grunt-cdndeps
 *
 * Copyright (c) 2014 Cambridge Healthcare
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    cdndeps: {
      main: {
        files: {
          "deps": ["example_deps.json"]
        }
      }
    }
  });

  grunt.loadTasks("tasks");
  grunt.registerTask("default", ["cdndeps"]);
};
