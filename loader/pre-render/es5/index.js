'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var promiseLimit = require('promise-limit');
var puppeteer = require('puppeteer');
var path = require('path');

var waitForRender = function waitForRender(options) {
  options = options || {};

  return new _promise2.default(function (resolve, reject) {
    // Render when an event fires on the document.
    if (options.renderAfterDocumentEvent) {
      if (window['__PRERENDER_STATUS'] && window['__PRERENDER_STATUS'].__DOCUMENT_EVENT_RESOLVED) resolve();
      document.addEventListener(options.renderAfterDocumentEvent, function () {
        return resolve();
      });

      // Render after a certain number of milliseconds.
    } else if (options.renderAfterTime) {
      setTimeout(function () {
        return resolve();
      }, options.renderAfterTime);

      // Default: Render immediately after page content loads.
    } else {
      resolve();
    }
  });
};

var PuppeteerRenderer = function () {
  function PuppeteerRenderer(rendererOptions) {
    (0, _classCallCheck3.default)(this, PuppeteerRenderer);

    this._puppeteer = null;
    this._rendererOptions = rendererOptions || {};

    if (this._rendererOptions.maxConcurrentRoutes == null) this._rendererOptions.maxConcurrentRoutes = 0;

    if (this._rendererOptions.inject && !this._rendererOptions.injectProperty) {
      this._rendererOptions.injectProperty = '__PRERENDER_INJECTED';
    }
  }

  (0, _createClass3.default)(PuppeteerRenderer, [{
    key: 'initialize',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;

                // Workaround for Linux SUID Sandbox issues.
                if (process.platform === 'linux') {
                  if (!this._rendererOptions.args) this._rendererOptions.args = [];

                  if (this._rendererOptions.args.indexOf('--no-sandbox') === -1) {
                    this._rendererOptions.args.push('--no-sandbox');
                    this._rendererOptions.args.push('--disable-setuid-sandbox');
                  }
                }

                _context.next = 4;
                return puppeteer.launch(this._rendererOptions);

              case 4:
                this._puppeteer = _context.sent;
                _context.next = 12;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context['catch'](0);

                console.error(_context.t0);
                console.error('[Prerenderer - PuppeteerRenderer] Unable to start Puppeteer');
                // Re-throw the error so it can be handled further up the chain. Good idea or not?
                throw _context.t0;

              case 12:
                return _context.abrupt('return', this._puppeteer);

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 7]]);
      }));

      function initialize() {
        return _ref.apply(this, arguments);
      }

      return initialize;
    }()
  }, {
    key: 'handleRequestInterception',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(page, baseURL) {
        var _this = this;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return page.setRequestInterception(true);

              case 2:

                page.on('request', function (req) {
                  // Skip third party requests if needed.
                  if (_this._rendererOptions.skipThirdPartyRequests) {
                    if (!req.url().startsWith(baseURL)) {
                      req.abort();
                      return;
                    }
                  }

                  if (typeof _this._rendererOptions.dealWithRequest === 'function') {
                    req.continue(_this._rendererOptions.dealWithRequest(req, baseURL));
                  } else {
                    req.continue();
                  }
                });

              case 3:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function handleRequestInterception(_x, _x2) {
        return _ref2.apply(this, arguments);
      }

      return handleRequestInterception;
    }()
  }, {
    key: 'renderRoutes',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(routes, Prerenderer) {
        var _this2 = this;

        var rootOptions, options, limiter, pagePromises;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                rootOptions = Prerenderer.getOptions();
                options = this._rendererOptions;
                limiter = promiseLimit(this._rendererOptions.maxConcurrentRoutes);
                pagePromises = _promise2.default.all(routes.map(function (route, index) {
                  return limiter((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                    var page, baseURL, navigationOptions, renderAfterElementExists, result;
                    return _regenerator2.default.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            _context3.next = 2;
                            return _this2._puppeteer.newPage();

                          case 2:
                            page = _context3.sent;


                            if (options.consoleHandler) {
                              page.on('console', function (message) {
                                return options.consoleHandler(route, message);
                              });
                            }

                            if (!options.inject) {
                              _context3.next = 7;
                              break;
                            }

                            _context3.next = 7;
                            return page.evaluateOnNewDocument(`(function () { window['${ options.injectProperty }'] = ${ (0, _stringify2.default)(options.inject) }; })();`);

                          case 7:
                            baseURL = `http://localhost:${ rootOptions.server.port }`;

                            // Allow setting viewport widths and such.

                            if (!options.viewport) {
                              _context3.next = 11;
                              break;
                            }

                            _context3.next = 11;
                            return page.setViewport(options.viewport);

                          case 11:
                            _context3.next = 13;
                            return _this2.handleRequestInterception(page, baseURL);

                          case 13:

                            // Hack just in-case the document event fires before our main listener is added.
                            if (options.renderAfterDocumentEvent) {
                              page.evaluateOnNewDocument(function (options) {
                                window['__PRERENDER_STATUS'] = {};
                                document.addEventListener(options.renderAfterDocumentEvent, function () {
                                  window['__PRERENDER_STATUS'].__DOCUMENT_EVENT_RESOLVED = true;
                                });
                              }, _this2._rendererOptions);
                            }

                            navigationOptions = options.navigationOptions ? (0, _extends3.default)({ waituntil: 'networkidle0' }, options.navigationOptions) : { waituntil: 'networkidle0' };
                            _context3.next = 17;
                            return page.goto(`${ baseURL }/${ route }`, navigationOptions);

                          case 17:

                            // Wait for some specific element exists
                            renderAfterElementExists = _this2._rendererOptions.renderAfterElementExists;

                            if (!(renderAfterElementExists && typeof renderAfterElementExists === 'string')) {
                              _context3.next = 21;
                              break;
                            }

                            _context3.next = 21;
                            return page.waitForSelector(renderAfterElementExists);

                          case 21:
                            _context3.next = 23;
                            return page.evaluate(waitForRender, _this2._rendererOptions);

                          case 23:
                            _context3.next = 25;
                            return page.content();

                          case 25:
                            _context3.t0 = _context3.sent;
                            _context3.t1 = path.join(rootOptions.outputPath, route);
                            result = {
                              html: _context3.t0,
                              outputPath: _context3.t1
                            };
                            _context3.next = 30;
                            return page.close();

                          case 30:
                            return _context3.abrupt('return', result);

                          case 31:
                          case 'end':
                            return _context3.stop();
                        }
                      }
                    }, _callee3, _this2);
                  })));
                }));
                return _context4.abrupt('return', pagePromises);

              case 5:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function renderRoutes(_x3, _x4) {
        return _ref3.apply(this, arguments);
      }

      return renderRoutes;
    }()
  }, {
    key: 'destroy',
    value: function destroy() {
      this._puppeteer.close();
    }
  }]);
  return PuppeteerRenderer;
}();

module.exports = PuppeteerRenderer;