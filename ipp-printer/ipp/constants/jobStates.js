"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jobStates = void 0;
// https://tools.ietf.org/html/rfc8011#section-4.3.3
var jobStates = {
  JOB_PENDING: 3,
  JOB_PENDING_HELD: 4,
  JOB_PROCESSING: 5,
  JOB_PROCESSING_STOPPED: 6,
  JOB_CANCELED: 7,
  JOB_ABORTED: 8,
  JOB_COMPLETED: 9
};
exports.jobStates = jobStates;