"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIPAddress = exports.timeBetween = void 0;

var _os = require("os");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var timeBetween = function timeBetween(startTime, endTime) {
  if (!endTime) endTime = new Date().getTime();
  return Math.floor((endTime - startTime) / 1000);
}; // https://gist.github.com/sviatco/9054346#gistcomment-3275294


exports.timeBetween = timeBetween;

var getIPAddress = function getIPAddress() {
  var _ref;

  return (_ref = []).concat.apply(_ref, _toConsumableArray(Object.values((0, _os.networkInterfaces)()))).find(function (details) {
    return details.family === 'IPv4' && !details.internal;
  }).address;
};

exports.getIPAddress = getIPAddress;