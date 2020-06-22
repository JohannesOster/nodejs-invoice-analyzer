"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Job = void 0;

var _utils = require("./utils.js");

var _ipp = require("./ipp");

var _stream = require("stream");

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

var Job = /*#__PURE__*/function (_PassThrough) {
  _inherits(Job, _PassThrough);

  var _super = _createSuper(Job);

  function Job(jobId, printer, req) {
    var _this;

    _classCallCheck(this, Job);

    _this = _super.call(this);
    _this.printer = printer;
    _this.jobId = jobId;
    _this.uri = printer.uri + jobId;
    _this.createdAt = new Date();
    _this.state = _ipp.jobStates.PENGIND;

    _this.write(req._body.data);

    _this.end();

    return _this;
  }

  _createClass(Job, [{
    key: "getJobAttributesGroup",
    value: function getJobAttributesGroup() {
      var attributes = [{
        tag: _ipp.tags.INTEGER,
        name: 'job-id',
        value: this.jobId
      }, {
        tag: _ipp.tags.URI,
        name: 'job-uri',
        value: this.uri
      }, {
        tag: _ipp.tags.ENUM,
        name: 'job-state',
        value: this.state
      }, {
        tag: _ipp.tags.URI,
        name: 'job-printer-uri',
        value: this.printer.uri
      }, {
        tag: _ipp.tags.INTEGER,
        name: 'job-printer-up-time',
        value: (0, _utils.timeBetween)(this.printer.started)
      }, {
        name: 'job-name',
        value: this.name
      }, {
        name: 'job-originating-user-name',
        value: this.userName
      }, {
        tag: _ipp.tags.KEYWORD,
        name: 'job-state-reasons',
        value: 'none'
      }, {
        tag: _ipp.tags.INTEGER,
        name: 'time-at-creation',
        value: (0, _utils.timeBetween)(this.printer.started, this.createdAt)
      }, {
        tag: _ipp.tags.DATE_TIME,
        name: 'date-time-at-creation',
        value: this.createdAt
      }, {
        tag: _ipp.tags.CHARSET,
        name: 'attributes-charset',
        value: 'utf-8'
      }, {
        tag: _ipp.tags.NATURAL_LANGUAGE,
        name: 'attributes-natural-language',
        value: 'en-us'
      }];
      var attrGroup = {
        tag: _ipp.tags['job-attributes-tag'],
        attributes: attributes
      };
      return attrGroup;
    }
  }]);

  return Job;
}(_stream.PassThrough);

exports.Job = Job;