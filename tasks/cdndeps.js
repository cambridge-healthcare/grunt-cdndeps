/*
 * Go through cdns listed in source file
 * and make local copies of each to the output directory,
 * if it is not there already.
 *
 * The generated deps directory will imitate the folder
 * structure defined in the dependency urls,
 * for better version comparisons.
 */

"use strict";

var _ = require("underscore");

module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-curl");

  grunt.registerMultiTask("cdndeps",
                          "Local CDN dependency manager.",
                          function() {

    this.files.forEach(function(mapping) {

      validate_mapping(mapping);

      var deps     = grunt.file.readJSON(mapping.src).cdnDeps,
          dep_urls = extract_paths(deps);

      // Define a mapping between required cdn url
      // and the file path it is supposed to populate
      var required_map = get_required_map(mapping.dest, dep_urls);

      var existing_files   = get_existing(mapping.dest),
          required_files   = Object.keys(required_map),
          missing_files    = _.difference(required_files, existing_files),
          unrequired_files = _.difference(existing_files, required_files);

      if (missing_files.length) {
        download(_.pick(required_map, missing_files));
      }

      if (unrequired_files.length) {
        remove(unrequired_files);
      }

      // Finally clean any directories that might have become empty
      configure_clean(mapping.dest);
      grunt.task.run("clean:cdndeps");
    });
  });

  function validate_mapping (mapping) {
    if (grunt.file.isFile(mapping.dest)) {
      grunt.warn("Destination for CDN dependencies needs to be a directory");
    }

    if (mapping.src.length > 1) {
      grunt.warn("Please specify only one source file for cdndeps that lists all required libraries");
    }
  }

  function extract_paths (deps_obj) {
    var all_deps;

    if (_.isArray(deps_obj)) {
      all_deps = deps_obj;
    }
    else {
      all_deps = Object.keys(deps_obj).reduce(function (all, group_name) {
        return all.concat(deps_obj[group_name]);
      }, []);
    }

    // Choose "dev" url if available,
    // (because we don't want .min files in dev mode)
    var flat_valid_deps = all_deps.map(function(url) {
      url = url.dev || url;
      url = url.replace(/^\/\//, "https://");
      return url;
    });

    return flat_valid_deps;
  }

  function get_existing (dir) {
    var existing_deps_paths = grunt.file.expand(dir + "/**/*.js");

    // Filter out directories that match *.js (like moment.js)
    return existing_deps_paths.filter(function (path) {
      return grunt.file.isFile(path);
    });
  }

  function get_required_map (dir, urls) {
    return urls.reduce(function (result, path) {
      result[dir + "/" + rel_path(path)] = path;
      return result;
    }, {});
  }

  function download (file_map) {
    grunt.log.writeln("Downloading the following dependencies:\n" +
                      pretty_list(new_files_style, _.values(file_map)));

    grunt.config("curl", file_map);
    grunt.task.run("curl");
  }

  function remove (list) {
    grunt.log.writeln("Deleting unrequired dependencies:\n" +
                      pretty_list(unrequired_files_style, list));

    list.forEach(function (path) {
      grunt.file.delete(path);
    });
  }

  function configure_clean (dir) {
    grunt.config("clean.cdndeps", {
      src: [dir + "/**/*"],
      filter: function(filepath) {
        var no_files_in_dir = true;
        grunt.file.recurse(filepath, function(abs, root, subdir, filename) {
          // If this callback is executed,
          // it means that there was a file somewhere in this path,
          // so should return false.
          no_files_in_dir = false;
        });
        return no_files_in_dir;
      }
    });
  }

  // Given an url, return its relative path
  // (everything after the first slash)
  function rel_path (url) {
    return url.replace(/^([a-z]*:)?(\/\/[^\/]+)*\//, "");
  }

  function pretty_list (style, list) {
    return "  " + list.map(style).join('\n  ');
  }

  // Define styling functions for output
  function new_files_style        (path) { return path.cyan; }
  function unrequired_files_style (path) { return path.black.cyanBG; }
};
