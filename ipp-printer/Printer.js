"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Printer = void 0;

var _utils = require("./utils.js");

var _IppServer2 = require("./IppServer.js");

var _Job = require("./Job.js");

var _crypto = _interopRequireDefault(require("crypto"));

var _ipp = require("./ipp");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Printer = /*#__PURE__*/function (_IppServer) {
  _inherits(Printer, _IppServer);

  var _super = _createSuper(Printer);

  function Printer() {
    var _this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$port = _ref.port,
        port = _ref$port === void 0 ? 3000 : _ref$port,
        _ref$printerName = _ref.printerName,
        printerName = _ref$printerName === void 0 ? 'node.js-printer' : _ref$printerName;

    _classCallCheck(this, Printer);

    _this = _super.call(this, port);
    _this.name = printerName;
    _this.started = Date.now(); // to calculate required printer-up-time attribute

    _this.uri = 'ipp://' + (0, _utils.getIPAddress)() + ':' + port + '/';
    _this.state = _ipp.printerStates.PRINTER_IDLE;
    _this.jobs = [];
    return _this;
  }
  /** routes different ipp operations to suitable handler */


  _createClass(Printer, [{
    key: "router",
    value: function router(req, res) {
      switch (req._body.operationId) {
        case _ipp.operationIds.GET_PRINTER_ATTRIBUTES:
          return this.getPrinterAttributes(req._body, res);

        case _ipp.operationIds.PRINT_JOB:
          return this.printJob(req, res);

        default:
          console.error("Unspported operation\n          ".concat(_ipp.operationIds.lookup(req._body.operationId), "\n          #").concat(req._body.operationId));
          return this.send(req._body, res, _ipp.statusCodes.SERVER_ERROR_OPERATION_NOT_SUPPORTED);
      }
    }
  }, {
    key: "getPrinterAttributes",
    value: function getPrinterAttributes(reqBody, res) {
      /**
       * This are all required attributes.
       * For easier access it is an object, in the actual response it will be mapped to an array
       * where the current key will be converted to the name property
       *
       * For futher information checkout https://tools.ietf.org/html/rfc8011#section-5.4
       * */
      var attributes = {
        'printer-uri-supported': {
          tag: _ipp.tags.URI,
          value: this.uri
        },
        'uri-authentication-supported': {
          tag: _ipp.tags.KEYWORD,
          value: 'none'
        },
        'uri-security-supported': {
          tag: _ipp.tags.KEYWORD,
          value: 'none'
        },
        'printer-name': {
          tag: _ipp.tags.NAME_WITHOUT_LANGUAGE,
          value: this.name
        },
        'printer-state': {
          tag: _ipp.tags.ENUM,
          value: this.state
        },
        'printer-state-reasons': {
          tag: _ipp.tags.KEYWORD,
          value: 'none'
        },
        'ipp-versions-supported': {
          tag: _ipp.tags.KEYWORD,
          value: '1.1'
        },
        'operations-supported': {
          tag: _ipp.tags.ENUM,
          value: [_ipp.operationIds.PRINT_JOB, _ipp.operationIds.GET_PRINTER_ATTRIBUTES]
        },
        'charset-configured': {
          tag: _ipp.tags.CHARSET,
          value: 'utf-8'
        },
        'charset-supported': {
          tag: _ipp.tags.CHARSET,
          value: 'utf-8'
        },
        'natural-language-configured': {
          tag: _ipp.tags.NATURAL_LANGUAGE,
          value: 'en-us'
        },
        'generated-natural-language-supported': {
          tag: _ipp.tags.NATURAL_LANGUAGE,
          value: 'en-us'
        },
        'document-format-default': {
          tag: _ipp.tags.MIME_MEDIA_TYPE,
          value: 'application/postscript'
        },
        'document-format-supported': {
          tag: _ipp.tags.MIME_MEDIA_TYPE,
          value: ['application/postscript']
        },
        'printer-is-accepting-jobs': {
          tag: _ipp.tags.BOOLEAN,
          value: true
        },
        'queued-job-count': {
          tag: _ipp.tags.INTEGER,
          value: this.jobs.length
        },
        'pdl-override-supported': {
          tag: _ipp.tags.KEYWORD,
          value: 'not-attempted'
        },
        'printer-up-time': {
          tag: _ipp.tags.INTEGER,
          value: (0, _utils.timeBetween)(this.started, new Date().getTime())
        },
        'compression-supported': {
          tag: _ipp.tags.KEYWORD,
          value: ['none']
        }
      };
      var requestedAttributes;
      var groups = reqBody.groups;
      if (!groups) throw new Error('Missing groups in get printer attributes request.');
      groups.some(function (group) {
        if (group.tag === _ipp.tags.OPERATION_ATTRIBUTES_TAG) {
          group.attributes.some(function (attr) {
            if (attr.name === 'requested-attributes') {
              requestedAttributes = attr.value;
              return true;
            }
          });
        }
      }); // if nothing is requested return all attributes

      if (!requestedAttributes) requestedAttributes.concat(Object.keys(attributes));
      var group = {
        tag: _ipp.tags.PRINTER_ATTRIBUTES_TAG,
        attributes: requestedAttributes.map(function (key) {
          var val = attributes[key];
          return !!val ? _objectSpread(_objectSpread({}, val), {}, {
            name: key
          }) : null;
        }).filter(function (val) {
          return !!val;
        }) // filter out null values

      };
      this.send(reqBody, res, _ipp.statusCodes.SUCCESSFULL_OK, group);
    }
  }, {
    key: "printJob",
    value: function printJob(req, res) {
      var jobId = _crypto["default"].randomBytes(20).toString('hex');

      var job = new _Job.Job(jobId, this, req);
      this.jobs.push(job);
      this.emit('job', job);
      this.send(req._body, res);
    }
  }, {
    key: "getJobs",
    value: function getJobs(req, res) {
      this.send(req._body, res);
    }
  }]);

  return Printer;
}(_IppServer2.IppServer);

exports.Printer = Printer;