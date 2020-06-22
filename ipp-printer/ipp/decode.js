"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decode = void 0;

var _constants = require("./constants");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**  A custom error to indicate out of bounds buffer access */
var ReadError = /*#__PURE__*/function (_Error) {
  _inherits(ReadError, _Error);

  var _super = _createSuper(ReadError);

  function ReadError() {
    var _this;

    _classCallCheck(this, ReadError);

    _this.message = 'Not enough Data to read.';
    return _possibleConstructorReturn(_this);
  }

  return ReadError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
/* For more information about the general structure of an ipp request
 * visit https://tools.ietf.org/html/rfc2910#section-3.1 */


var decode = function decode(buffer) {
  var result = {};
  var currPos = 0;
  var encoding = 'utf-8'; // helper functions for easier buffer access

  var read1 = function read1() {
    if (currPos + 1 > buffer.length) throw new ReadError();
    var value = buffer.readInt8(currPos++);
    return value;
  };

  var read2 = function read2() {
    if (currPos + 2 > buffer.length) throw new ReadError();
    var value = buffer.readInt16BE(currPos);
    currPos += 2;
    return value;
  };

  var read4 = function read4() {
    if (currPos + 4 > buffer.length) throw new ReadError();
    var value = buffer.readInt32BE(currPos);
    currPos += 4;
    return value;
  }; // - get ipp version number


  var vMajor = read1();
  var vMinor = read1();
  result.version = vMajor + '.' + vMinor;
  /* buffer[2] and byte[3] represent the operaion id for requests
   * and the status code for responses.
   * */

  result.statusCodeOrOperationId = read2(); // - get requestId

  result.requestId = read4();
  /*
   * - Get attribute groups
   *
   * For more information about the structure of an attribute group
   * visit https://tools.ietf.org/html/rfc8010#section-3.1.2 */

  var tag = read1(); // begin-attribute-group-tag delimiter-tag

  while (tag !== _constants.tags.END_OF_ATTRIBUTES_TAG && currPos < buffer.length) {
    var group = {
      tag: tag,
      attributes: []
    };
    /*
     * - Get attributes of group
     *
     * For more information about the structure of an attribute
     * visit https://tools.ietf.org/html/rfc2910#section-3.1.3
     * */

    tag = read1(); // value tag of attribute

    /* Until the tag is a delimiter-tag (0x00 - 0x0f)
     * https://tools.ietf.org/html/rfc2910#section-3.5.1 */

    result.groups = [];
    var attribute = void 0;

    while (tag > 0x0f) {
      // - Get length of the name
      var nameLength = read2();
      var name = buffer.toString('utf-8', currPos, currPos + nameLength);
      currPos += nameLength;
      var value = void 0;
      var valueLength = read2();

      switch (tag) {
        case _constants.tags.INTEGER:
        case _constants.tags.ENUM:
          value = read4();
          break;

        case _constants.tags.BOOLEAN:
          value = read1();
          break;

        case _constants.tags.RESOLUTION:
          // https://tools.ietf.org/html/rfc2911#section-4.1.15
          var crossFeedDirection = read4();
          var feedDirection = read4();
          var unit = read1();
          value = [crossFeedDirection, feedDirection, unit === 0x03 ? 'dpi' : 'dpcm'];
          break;

        case _constants.tags.RANGE_OF_INTEGER:
          var lowerBound = read4();
          var upperBound = read4();
          value = [lowerBound, upperBound];
          break;

        case _constants.tags.DATE_TIME:
          var year = read2();
          var month = read1();
          var day = read1();
          var hour = read1();
          var minutes = read1();
          var seconds = read1();
          var deciSeconds = read1();
          var date = new Date(year, month, day, hour, minutes, seconds, deciSeconds);
          var directionFromUTC = buffer.toString(encoding, currPos, currPos + 1);
          currPos += 1;
          var hoursFromUTC = buffer.toString(encoding, currPos, currPos + 1);
          currPos += 1;
          var minutesFromUTC = buffer.toString(encoding, currPos, currPos + 1);
          currPos += 1;
          value = new Date("".concat(date.toISOString().substr(0, 23).replace('T', ','), ",").concat(String.fromCharCode(directionFromUTC)).concat(hoursFromUTC, ":").concat(minutesFromUTC));
          break;

        case _constants.tags.TEXT_WITH_LANGUAGE:
        case _constants.tags.NAME_WITH_LANGUAGE:
          var langLength = read2();
          var lang = buffer.toString(encoding, currPos, currPos + langLength);
          currPos += length;
          var valLength = read2();
          var val = buffer.toString(encoding, currPos, currPos + valLength);
          currPos += length2;
          value = {
            language: lang,
            value: val
          };
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
          value = buffer.toString(encoding, currPos, currPos + valueLength);
          currPos += valueLength;
          break;

        default:
          throw new Error('Unsupported Tag: ', tag);
      }

      if (name) {
        attribute = {
          tag: tag,
          name: name,
          value: value
        };
        group.attributes.push(attribute);
      } else {
        // append additional values to existing one
        if (Array.isArray(attribute.value)) {
          attribute.value.push(value);
        } else {
          attribute.value = [attribute.value, value];
        }
      }

      tag = read1();
    }

    result.groups.push(group);
  } // add additional non ipp encoded data (like files) as it is


  if (currPos < buffer.length) result.data = buffer.slice(currPos);
  return result;
};

exports.decode = decode;