"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lookup = void 0;

var lookup = function lookup(object, value) {
  return Object.keys(object).find(function (key) {
    return object[key] === value;
  });
};

exports.lookup = lookup;