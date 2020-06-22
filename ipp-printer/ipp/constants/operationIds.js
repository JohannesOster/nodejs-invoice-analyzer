"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.operationIds = void 0;

var _utils = require("../utils.js");

var operationIds = {
  PRINT_JOB: 0x02,
  PRINT_URI: 0x03,
  VALIDATE_JOB: 0x04,
  CREATE_JOB: 0x05,
  SEND_DOCUMENT: 0x06,
  SEND_URI: 0x07,
  CANCEL_JOB: 0x08,
  GET_JOB_ATTRIBUTES: 0x09,
  GET_JOBS: 0x0a,
  GET_PRINTER_ATTRIBUTES: 0x0b,
  HOLD_JOB: 0x0c,
  RELEASE_JOB: 0x0d,
  RESTART_JOB: 0x0e,
  PAUSE_PRINTER: 0x10,
  RESUME_PRINTER: 0x11,
  PURGE_JOBS: 0x12
};
exports.operationIds = operationIds;

operationIds.lookup = function (value) {
  return (0, _utils.lookup)(this, value).toLowerCase().replace(/\_/g, '-');
};