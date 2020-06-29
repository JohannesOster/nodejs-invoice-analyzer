"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Printer = require("./Printer");

Object.keys(_Printer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Printer[key];
    }
  });
});