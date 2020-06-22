"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tags = void 0;
var tags = {
  /* Delimiter Tags
   * https://tools.ietf.org/html/rfc2910#section-3.5.1 */
  OPERATION_ATTRIBUTES_TAG: 0x01,
  END_OF_ATTRIBUTES_TAG: 0x03,
  PRINTER_ATTRIBUTES_TAG: 0x04,

  /* Value Tags
   * https://tools.ietf.org/html/rfc2910#section-3.5.2 */
  // - integer values
  INTEGER: 0x21,
  BOOLEAN: 0x22,
  ENUM: 0x23,
  // - octetString values
  OCTET_STRING: 0x30,
  // with unspecified format
  DATE_TIME: 0x31,
  RESOLUTION: 0x32,
  RANGE_OF_INTEGER: 0x33,
  TEXT_WITH_LANGUAGE: 0x35,
  NAME_WITH_LANGUAGE: 0x36,
  // - character-string values
  TEXT_WITHOUT_LANGUAGE: 0x41,
  NAME_WITHOUT_LANGUAGE: 0x42,
  KEYWORD: 0x44,
  URI: 0x45,
  URI_SCHEME: 0x46,
  CHARSET: 0x47,
  NATURAL_LANGUAGE: 0x48,
  MIME_MEDIA_TYPE: 0x49
};
exports.tags = tags;