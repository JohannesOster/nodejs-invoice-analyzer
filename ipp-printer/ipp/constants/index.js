"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _operationIds = require("./operationIds");

Object.keys(_operationIds).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _operationIds[key];
    }
  });
});

var _statusCodes = require("./statusCodes");

Object.keys(_statusCodes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _statusCodes[key];
    }
  });
});

var _tags = require("./tags");

Object.keys(_tags).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _tags[key];
    }
  });
});

var _jobStates = require("./jobStates");

Object.keys(_jobStates).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _jobStates[key];
    }
  });
});

var _printerState = require("./printerState");

Object.keys(_printerState).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _printerState[key];
    }
  });
});