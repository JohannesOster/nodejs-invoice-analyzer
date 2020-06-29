"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.printerStates = void 0;
// https://tools.ietf.org/html/rfc8011#section-4.2.7
var printerStates = {
  PRINTER_IDLE: 3,
  PRINTER_PROCESSING: 4,
  PRINTER_STOPPED: 5
};
exports.printerStates = printerStates;