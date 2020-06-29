"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IppServer = void 0;

var _http = _interopRequireDefault(require("http"));

var _ipp = require("./ipp");

var _util = require("util");

var _events = require("events");

var _debug = require("debug");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var IppServer = /*#__PURE__*/function (_EventEmitter) {
  _inherits(IppServer, _EventEmitter);

  var _super = _createSuper(IppServer);

  function IppServer(port) {
    var _this;

    _classCallCheck(this, IppServer);

    _this = _super.call(this);
    _this.port = port;
    _this.server = _http["default"].createServer(_this.onRequest.bind(_assertThisInitialized(_this)));

    _this.server.listen(port, function () {
      _debug.debug.log("Server listening on ".concat(_this.uri));
    });

    return _this;
  }
  /**
   * Request handler for incoming http requests.
   * It decodes ipp data and writes the result into req._body for later access.
   * After that, it hands over the req, res objects to this.router for the actual
   * request handling. Therefore onRequest is like a middleware for decoding ipp.
   *
   * @param req the http request object
   * @param res the http response object
   */


  _createClass(IppServer, [{
    key: "onRequest",
    value: function onRequest(req, res) {
      var _this2 = this;

      // accumulate raw data stream
      var chunks = [];
      req.on('data', function (chunk) {
        chunks.push(chunk);
      });
      /* Ater receiving the all data chunks, parse the concatenated buffer
       * and pass it down to the router. */

      req.on('end', function () {
        var buffer = Buffer.concat(chunks);
        req._body = (0, _ipp.decode)(buffer);
        req._body.operationId = req._body.statusCodeOrOperationId;
        delete req._body.statusCodeOrOperationId;

        _debug.debug.log("IPP/".concat(req._body.version, "\n        operation: ").concat(_ipp.operationIds.lookup(req._body.operationId), "\n        request: #").concat(req._body.requestId, "\n"), (0, _util.inspect)(req._body.groups, {
          depth: null
        }));

        _this2.router(req, res);
      });
    }
  }, {
    key: "router",
    value: function router(req, res) {
      // to be overridden
      throw new Error('Router must be overridden by subclass');
    }
    /**
     * Send an ipp response
     *
     * @params body:          a request body
     * @params res:           a res object
     * @params status_code:   an ipp status_code
     * @params groups:        additional attribute groups
     */

  }, {
    key: "send",
    value: function send(body, res) {
      var statusCode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _ipp.statusCodes.SUCCESSFUL_OK;
      var groups = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
      var respObj = {
        version: {
          major: 2,
          minor: 0
        },
        statusCode: statusCode,
        requestId: body.requestId,
        groups: [
        /* Required attributes for every response */
        {
          tag: _ipp.tags.OPERATION_ATTRIBUTES_TAG,
          attributes: [{
            tag: _ipp.tags.CHARSET,
            name: 'attributes-charset',
            value: 'utf-8'
          }, {
            tag: _ipp.tags.NATURAL_LANGUAGE,
            name: 'attributes-natural-language',
            value: 'en-us'
          }]
        }]
      };
      if (groups) respObj.groups = respObj.groups.concat(groups);

      _debug.debug.log("Response to #".concat(body.requestId, ": \n"), (0, _util.inspect)(respObj, {
        depth: null
      }));

      var resp = (0, _ipp.encode)(respObj);
      res.writeHead(200, {
        'Content-Length': resp.length,
        'Content-Type': 'application/ipp'
      });
      res.end(resp);
    }
  }]);

  return IppServer;
}(_events.EventEmitter);

exports.IppServer = IppServer;