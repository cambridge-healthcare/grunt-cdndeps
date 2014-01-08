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

module.exports = function (production, deps_dir, cdns_json) {
  return cdn_paths(cdns_json);

  function cdn_paths (dep_groups) {
    if (_.isArray(dep_groups)) {
      return paths(dep_groups);
    }
    else {
      return Object.keys(dep_groups).reduce(function (result, group_name) {
        result[group_name] = paths(dep_groups[group_name]);
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
      url = deps_dir + (/\/$/.test(deps_dir) ? "" : "/") + rel_path(url);
    }
    return url;
  }

  // Given an url, return its relative path
  // (everything after the first slash)
  function rel_path (url) {
    return url.replace(/^([a-z]*:)?(\/\/[^\/]+)*\//, '');
  }
}

