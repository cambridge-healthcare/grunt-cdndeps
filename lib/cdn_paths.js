/*
 * This file provides a helper function to extract
 * the proper script paths from the specified dependencies
 * depending on whether minified or local versions should be
 * included the current build (commonly required in production
 * and development environments, respectively).
 *
 * Calling this module with the JSON that specifies the
 * CDN URLs will behave differently depending on whether
 * the 'production' argument is passed as true or false.
 *
 *   (1) If 'production' is set to true, it will return
 *       the list of URLs with '.min.js' appended. If
 *       a URL is defined as an object:
 *
 *         {
 *           "dev": "//some.url",
 *           "prod": "//other.url"
 *         }
 *
 *       instead of just a string, it will use the "prod"
 *       URL instead of appending '.min.js' to the "dev"
 *       URL.
 *
 *   (2) If 'production' is set to false, it will return
 *       a list of paths that match the download location
 *       of the CDN libraries as resulting from running
 *       the cdndeps Grunt plugin. If an object is defined
 *       instead of a string to represent a URL, the "dev"
 *       URL is used to extract the download location.
 *
 */

"use strict";

var _ = require("underscore");
var grunt = require("grunt");

module.exports = function (config) {

  var src_file   = config.cdndeps_src,
      dest_dir   = config.cdndeps_dest,
      production = config.production;

  var deps_object = grunt.file.readJSON(src_file).cdnDeps;

  return cdn_paths(deps_object);

  function cdn_paths (deps) {
    if (_.isArray(deps)) {
      return paths(deps);
    }
    else {
      return Object.keys(deps).reduce(function (result, group_name) {
        result[group_name] = paths(deps[group_name]);
        return result;
      }, {});
    }
  }

  // Convert a given list of urls to valid URIs suitable for use in script tags.
  // May also be local, depending on the build mode
  function paths (urls) {
    return urls ? urls.map(path) : [];
  }

  function path (url) {
    // If in production mode
    // only need to add .min and https
    if (production) {
      url = url.prod || url.replace(/^https?:/, '')
        .replace(/\.js$/, '.min.js')
        .replace(/\.min\.min\.js/, '.min.js');
    }
    // If in dev mode, serve local files from
    // the directory specified in grunt-cdndeps
    else {
      url = url.dev || url;
      url = dest_dir + (/\/$/.test(dest_dir) ? "" : "/") + rel_path(url);
    }
    return url;
  }

  // Given an url, return its relative path
  // (everything after the first slash)
  function rel_path (url) {
    return url.replace(/^([a-z]*:)?(\/\/[^\/]+)*\//, '');
  }
}

