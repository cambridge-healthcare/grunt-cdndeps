"use strict";

module.exports = rel_path;

// Given an url, return its relative path
// (everything after the first slash)
function rel_path (url) {
  return url.replace(/^([a-z]*:)?(\/\/[^\/]+)*\//, "");
}
