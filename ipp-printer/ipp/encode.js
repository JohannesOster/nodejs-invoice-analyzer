"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encode = void 0;

var _constants = require("./constants");

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

var encode = function encode(obj) {
  // initialize buffer with some more or less arbitrary number since final size is unknown
  var buffer = Buffer.alloc(10000);
  var currPos = 0;
  var encoding = 'utf-8'; // double the size of buffer if it isn't big enough to write a value of given length

  var checkBufferSize = function checkBufferSize(length) {
    if (currPos + length > buffer.length) {
      buffer = (_readOnlyError("buffer"), Buffer.concat([buffer], 2 * buffer.length));
    }
  }; // helper functions for convenient buffer writing


  var write1 = function write1(value) {
    checkBufferSize(1);
    buffer.writeUInt8(value, currPos);
    currPos += 1;
  };

  var write2 = function write2(value) {
    checkBufferSize(2);
    buffer.writeUInt16BE(value, currPos);
    currPos += 2;
  };

  var write4 = function write4(value) {
    checkBufferSize(4);
    buffer.writeUInt32BE(value, currPos);
    currPos += 4;
  };

  var writeStr = function writeStr(str) {
    var length = Buffer.byteLength(str);
    write2(length); // prefix string with its length

    checkBufferSize(length);
    buffer.write(str, currPos, length, encoding);
    currPos += length;
  }; // - write version


  write1(obj.version.major);
  write1(obj.version.minor); // - write statusCode or operationId
  // must check for undefined since 0 is a possible value

  if (obj.statusCode !== undefined) write2(obj.statusCode);else if (obj.operationId !== undefined) write2(obj.operationId);else throw new Error('Missing statusCode or operationId'); // - write requestId

  write4(obj.requestId);

  if (obj.groups) {
    obj.groups.forEach(function (group) {
      // - delimiter-tag
      write1(group.tag);
      group.attributes.forEach(function (attribute) {
        // turn value intro array to avoid code duplication
        var values = Array.isArray(attribute.value) ? attribute.value : [attribute.value];
        values.forEach(function (value, index) {
          // - value-tag
          write1(attribute.tag); // - write attribute name for first value only

          writeStr(index === 0 ? attribute.name : ''); // write actual value prefixed by its size

          switch (attribute.tag) {
            case _constants.tags.INTEGER:
            case _constants.tags.ENUM:
              write2(4);
              write4(value);
              break;

            case _constants.tags.BOOLEAN:
              write2(1);
              write1(Number(value)); // convert boolean to number

              break;

            case _constants.tags.RESOLUTION:
              // https://tools.ietf.org/html/rfc2911#section-4.1.15
              write2(9);
              write4(value[0]); // cross feed direction

              write4(value[1]); // feed direction

              write1(value[2] === 'dpi' ? 0x03 : 0x04); // unit

              break;

            case _constants.tags.RANGE_OF_INTEGER:
              write2(8);
              write4(value[0]); // lower bound

              write4(value[1]); // upper bound

              break;

            case _constants.tags.DATE_TIME:
              write2(11);
              write2(value.getFullYear());
              write1(value.getMonth() + 1);
              write1(value.getDate());
              write1(value.getHours());
              write1(value.getMinutes());
              write1(value.getSeconds());
              write1(Math.floor(value.getMilliseconds() / 100));
              tz = timezone(value); // direction + or -

              writeStr(tz[0]); // hours from UTC

              write1(tz[1]); // minutes from UTC

              write1(tz[2]);
              break;

            case _constants.tags.TEXT_WITH_LANGUAGE:
            case _constants.tags.NAME_WITH_LANGUAGE:
              writeStr(value.lang); // write language

              writeStr(value.value); // write actual value

              break;

            case _constants.tags.OCTET_STRING:
            case _constants.tags.TEXT_WITHOUT_LANGUAGE:
            case _constants.tags.NAME_WITHOUT_LANGUAGE:
            case _constants.tags.KEYWORD:
            case _constants.tags.URI:
            case _constants.tags.URI_SCHEME:
            case _constants.tags.CHARSET:
            case _constants.tags.NATURAL_LANGUAGE:
            case _constants.tags.MIME_MEDIA_TYPE:
              writeStr(value);
              break;

            default:
              throw new Error('Unsupported Tag: ', tag);
          }
        });
      });
    });
  }

  write1(_constants.tags.END_OF_ATTRIBUTES_TAG);
  var bufferSize = currPos + (obj.data ? obj.data.length : 0);
  var resultBuffer = Buffer.alloc(bufferSize);
  buffer.copy(resultBuffer, 0, 0, currPos);
  if (obj.data) obj.data.copy(resultBuffer, currPos, 0);
  return resultBuffer;
};

exports.encode = encode;