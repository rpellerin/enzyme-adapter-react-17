"use strict";

var _object = _interopRequireDefault(require("object.assign"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _server = _interopRequireDefault(require("react-dom/server"));

var _shallow = _interopRequireDefault(require("react-test-renderer/shallow"));

var _package = require("react-test-renderer/package.json");

var _testUtils = _interopRequireDefault(require("react-dom/test-utils"));

var _semver = _interopRequireDefault(require("semver"));

var _checkPropTypes2 = _interopRequireDefault(require("prop-types/checkPropTypes"));

var _has = _interopRequireDefault(require("has"));

var _reactIs = require("react-is");

var _enzyme = require("enzyme");

var _Utils = require("enzyme/build/Utils");

var _enzymeShallowEqual = _interopRequireDefault(require("enzyme-shallow-equal"));

var _enzymeAdapterUtils = require("enzyme-adapter-utils");

var _findCurrentFiberUsingSlowPath = _interopRequireDefault(require("./findCurrentFiberUsingSlowPath"));

var _detectFiberTags = _interopRequireDefault(require("./detectFiberTags"));

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

var is164 = !!_testUtils["default"].Simulate.touchStart; // 16.4+

var is165 = !!_testUtils["default"].Simulate.auxClick; // 16.5+

var is166 = is165 && !_react["default"].unstable_AsyncMode; // 16.6+

var is168 = is166 && typeof _testUtils["default"].act === 'function';

var hasShouldComponentUpdateBug = _semver["default"].satisfies(_package.version, '< 16.8'); // Lazily populated if DOM is available.


var FiberTags = null;

function nodeAndSiblingsArray(nodeWithSibling) {
  var array = [];
  var node = nodeWithSibling;

  while (node != null) {
    array.push(node);
    node = node.sibling;
  }

  return array;
}

function flatten(arr) {
  var result = [];
  var stack = [{
    i: 0,
    array: arr
  }];

  while (stack.length) {
    var n = stack.pop();

    while (n.i < n.array.length) {
      var el = n.array[n.i];
      n.i += 1;

      if (Array.isArray(el)) {
        stack.push(n);
        stack.push({
          i: 0,
          array: el
        });
        break;
      }

      result.push(el);
    }
  }

  return result;
}

function nodeTypeFromType(type) {
  if (type === _reactIs.Portal) {
    return 'portal';
  }

  return (0, _enzymeAdapterUtils.nodeTypeFromType)(type);
}

function isMemo(type) {
  return (0, _enzymeAdapterUtils.compareNodeTypeOf)(type, _reactIs.Memo);
}

function isLazy(type) {
  return (0, _enzymeAdapterUtils.compareNodeTypeOf)(type, _reactIs.Lazy);
}

function unmemoType(type) {
  return isMemo(type) ? type.type : type;
}

function transformSuspense(renderedEl, prerenderEl, _ref) {
  var suspenseFallback = _ref.suspenseFallback;

  if (!(0, _reactIs.isSuspense)(renderedEl)) {
    return renderedEl;
  }

  var children = renderedEl.props.children;

  if (suspenseFallback) {
    var fallback = renderedEl.props.fallback;
    children = replaceLazyWithFallback(children, fallback);
  }

  var _renderedEl$type = renderedEl.type,
      propTypes = _renderedEl$type.propTypes,
      defaultProps = _renderedEl$type.defaultProps,
      contextTypes = _renderedEl$type.contextTypes,
      contextType = _renderedEl$type.contextType,
      childContextTypes = _renderedEl$type.childContextTypes;
  var FakeSuspense = (0, _object["default"])(isStateful(prerenderEl.type) ? /*#__PURE__*/function (_prerenderEl$type) {
    _inherits(FakeSuspense, _prerenderEl$type);

    var _super = _createSuper(FakeSuspense);

    function FakeSuspense() {
      _classCallCheck(this, FakeSuspense);

      return _super.apply(this, arguments);
    }

    _createClass(FakeSuspense, [{
      key: "render",
      value: function render() {
        var type = prerenderEl.type,
            props = prerenderEl.props;
        return /*#__PURE__*/_react["default"].createElement(type, _objectSpread(_objectSpread({}, props), this.props), children);
      }
    }]);

    return FakeSuspense;
  }(prerenderEl.type) : function FakeSuspense(props) {
    // eslint-disable-line prefer-arrow-callback
    return /*#__PURE__*/_react["default"].createElement(renderedEl.type, _objectSpread(_objectSpread({}, renderedEl.props), props), children);
  }, {
    propTypes: propTypes,
    defaultProps: defaultProps,
    contextTypes: contextTypes,
    contextType: contextType,
    childContextTypes: childContextTypes
  });
  return /*#__PURE__*/_react["default"].createElement(FakeSuspense, null, children);
}

function elementToTree(el) {
  if (!(0, _reactIs.isPortal)(el)) {
    return (0, _enzymeAdapterUtils.elementToTree)(el, elementToTree);
  }

  var children = el.children,
      containerInfo = el.containerInfo;
  var props = {
    children: children,
    containerInfo: containerInfo
  };
  return {
    nodeType: 'portal',
    type: _reactIs.Portal,
    props: props,
    key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(el.key),
    ref: el.ref || null,
    instance: null,
    rendered: elementToTree(el.children)
  };
}

function _toTree(vnode) {
  if (vnode == null) {
    return null;
  } // TODO(lmr): I'm not really sure I understand whether or not this is what
  // i should be doing, or if this is a hack for something i'm doing wrong
  // somewhere else. Should talk to sebastian about this perhaps


  var node = (0, _findCurrentFiberUsingSlowPath["default"])(vnode);

  switch (node.tag) {
    case FiberTags.HostRoot:
      return childrenToTree(node.child);

    case FiberTags.HostPortal:
      {
        var containerInfo = node.stateNode.containerInfo,
            children = node.memoizedProps;
        var props = {
          containerInfo: containerInfo,
          children: children
        };
        return {
          nodeType: 'portal',
          type: _reactIs.Portal,
          props: props,
          key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(node.key),
          ref: node.ref,
          instance: null,
          rendered: childrenToTree(node.child)
        };
      }

    case FiberTags.ClassComponent:
      return {
        nodeType: 'class',
        type: node.type,
        props: _objectSpread({}, node.memoizedProps),
        key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(node.key),
        ref: node.ref,
        instance: node.stateNode,
        rendered: childrenToTree(node.child)
      };

    case FiberTags.FunctionalComponent:
      return {
        nodeType: 'function',
        type: node.type,
        props: _objectSpread({}, node.memoizedProps),
        key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(node.key),
        ref: node.ref,
        instance: null,
        rendered: childrenToTree(node.child)
      };

    case FiberTags.MemoClass:
      return {
        nodeType: 'class',
        type: node.elementType.type,
        props: _objectSpread({}, node.memoizedProps),
        key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(node.key),
        ref: node.ref,
        instance: node.stateNode,
        rendered: childrenToTree(node.child.child)
      };

    case FiberTags.MemoSFC:
      {
        var renderedNodes = flatten(nodeAndSiblingsArray(node.child).map(_toTree));

        if (renderedNodes.length === 0) {
          renderedNodes = [node.memoizedProps.children];
        }

        return {
          nodeType: 'function',
          type: node.elementType,
          props: _objectSpread({}, node.memoizedProps),
          key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(node.key),
          ref: node.ref,
          instance: null,
          rendered: renderedNodes
        };
      }

    case FiberTags.HostComponent:
      {
        var _renderedNodes = flatten(nodeAndSiblingsArray(node.child).map(_toTree));

        if (_renderedNodes.length === 0) {
          _renderedNodes = [node.memoizedProps.children];
        }

        return {
          nodeType: 'host',
          type: node.type,
          props: _objectSpread({}, node.memoizedProps),
          key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(node.key),
          ref: node.ref,
          instance: node.stateNode,
          rendered: _renderedNodes
        };
      }

    case FiberTags.HostText:
      return node.memoizedProps;

    case FiberTags.Fragment:
    case FiberTags.Mode:
    case FiberTags.ContextProvider:
    case FiberTags.ContextConsumer:
      return childrenToTree(node.child);

    case FiberTags.Profiler:
    case FiberTags.ForwardRef:
      {
        return {
          nodeType: 'function',
          type: node.type,
          props: _objectSpread({}, node.pendingProps),
          key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(node.key),
          ref: node.ref,
          instance: null,
          rendered: childrenToTree(node.child)
        };
      }

    case FiberTags.Suspense:
      {
        return {
          nodeType: 'function',
          type: _reactIs.Suspense,
          props: _objectSpread({}, node.memoizedProps),
          key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(node.key),
          ref: node.ref,
          instance: null,
          rendered: childrenToTree(node.child)
        };
      }

    case FiberTags.Lazy:
      return childrenToTree(node.child);

    default:
      throw new Error("Enzyme Internal Error: unknown node with tag ".concat(node.tag));
  }
}

function childrenToTree(node) {
  if (!node) {
    return null;
  }

  var children = nodeAndSiblingsArray(node);

  if (children.length === 0) {
    return null;
  }

  if (children.length === 1) {
    return _toTree(children[0]);
  }

  return flatten(children.map(_toTree));
}

function _nodeToHostNode(_node) {
  // NOTE(lmr): node could be a function component
  // which wont have an instance prop, but we can get the
  // host node associated with its return value at that point.
  // Although this breaks down if the return value is an array,
  // as is possible with React 16.
  var node = _node;

  while (node && !Array.isArray(node) && node.instance === null) {
    node = node.rendered;
  } // if the SFC returned null effectively, there is no host node.


  if (!node) {
    return null;
  }

  var mapper = function mapper(item) {
    if (item && item.instance) return _reactDom["default"].findDOMNode(item.instance);
    return null;
  };

  if (Array.isArray(node)) {
    return node.map(mapper);
  }

  if (Array.isArray(node.rendered) && node.nodeType === 'class') {
    return node.rendered.map(mapper);
  }

  return mapper(node);
}

function replaceLazyWithFallback(node, fallback) {
  if (!node) {
    return null;
  }

  if (Array.isArray(node)) {
    return node.map(function (el) {
      return replaceLazyWithFallback(el, fallback);
    });
  }

  if (isLazy(node.type)) {
    return fallback;
  }

  return _objectSpread(_objectSpread({}, node), {}, {
    props: _objectSpread(_objectSpread({}, node.props), {}, {
      children: replaceLazyWithFallback(node.props.children, fallback)
    })
  });
}

var eventOptions = {
  animation: true,
  pointerEvents: is164,
  auxClick: is165
};

function getEmptyStateValue() {
  // this handles a bug in React 16.0 - 16.2
  // see https://github.com/facebook/react/commit/39be83565c65f9c522150e52375167568a2a1459
  // also see https://github.com/facebook/react/pull/11965
  // eslint-disable-next-line react/prefer-stateless-function
  var EmptyState = /*#__PURE__*/function (_React$Component) {
    _inherits(EmptyState, _React$Component);

    var _super2 = _createSuper(EmptyState);

    function EmptyState() {
      _classCallCheck(this, EmptyState);

      return _super2.apply(this, arguments);
    }

    _createClass(EmptyState, [{
      key: "render",
      value: function render() {
        return null;
      }
    }]);

    return EmptyState;
  }(_react["default"].Component);

  var testRenderer = new _shallow["default"]();
  testRenderer.render( /*#__PURE__*/_react["default"].createElement(EmptyState));
  return testRenderer._instance.state;
}

function wrapAct(fn) {
  if (!is168) {
    return fn();
  }

  var returnVal;

  _testUtils["default"].act(function () {
    returnVal = fn();
  });

  return returnVal;
}

function getProviderDefaultValue(Provider) {
  // React stores references to the Provider's defaultValue differently across versions.
  if ('_defaultValue' in Provider._context) {
    return Provider._context._defaultValue;
  }

  if ('_currentValue' in Provider._context) {
    return Provider._context._currentValue;
  }

  throw new Error('Enzyme Internal Error: can’t figure out how to get Provider’s default value');
}

function makeFakeElement(type) {
  return {
    $$typeof: _reactIs.Element,
    type: type
  };
}

function isStateful(Component) {
  return Component.prototype && (Component.prototype.isReactComponent || Array.isArray(Component.__reactAutoBindPairs) // fallback for createClass components
  );
}

var ReactSixteenAdapter = /*#__PURE__*/function (_EnzymeAdapter) {
  _inherits(ReactSixteenAdapter, _EnzymeAdapter);

  var _super3 = _createSuper(ReactSixteenAdapter);

  function ReactSixteenAdapter() {
    var _this;

    _classCallCheck(this, ReactSixteenAdapter);

    _this = _super3.call(this);
    var lifecycles = _this.options.lifecycles;
    _this.options = _objectSpread(_objectSpread({}, _this.options), {}, {
      enableComponentDidUpdateOnSetState: true,
      // TODO: remove, semver-major
      legacyContextMode: 'parent',
      lifecycles: _objectSpread(_objectSpread({}, lifecycles), {}, {
        componentDidUpdate: {
          onSetState: true
        },
        getDerivedStateFromProps: {
          hasShouldComponentUpdateBug: hasShouldComponentUpdateBug
        },
        getSnapshotBeforeUpdate: true,
        setState: {
          skipsComponentDidUpdateOnNullish: true
        },
        getChildContext: {
          calledByRenderer: false
        },
        getDerivedStateFromError: is166
      })
    });
    return _this;
  }

  _createClass(ReactSixteenAdapter, [{
    key: "createMountRenderer",
    value: function createMountRenderer(options) {
      (0, _enzymeAdapterUtils.assertDomAvailable)('mount');

      if ((0, _has["default"])(options, 'suspenseFallback')) {
        throw new TypeError('`suspenseFallback` is not supported by the `mount` renderer');
      }

      if (FiberTags === null) {
        // Requires DOM.
        FiberTags = (0, _detectFiberTags["default"])();
      }

      var attachTo = options.attachTo,
          hydrateIn = options.hydrateIn,
          wrappingComponentProps = options.wrappingComponentProps;
      var domNode = hydrateIn || attachTo || global.document.createElement('div');
      var instance = null;
      var adapter = this;
      return _objectSpread({
        render: function render(el, context, callback) {
          return wrapAct(function () {
            if (instance === null) {
              var type = el.type,
                  props = el.props,
                  ref = el.ref;

              var wrapperProps = _objectSpread({
                Component: type,
                props: props,
                wrappingComponentProps: wrappingComponentProps,
                context: context
              }, ref && {
                refProp: ref
              });

              var ReactWrapperComponent = (0, _enzymeAdapterUtils.createMountWrapper)(el, _objectSpread(_objectSpread({}, options), {}, {
                adapter: adapter
              }));

              var wrappedEl = /*#__PURE__*/_react["default"].createElement(ReactWrapperComponent, wrapperProps);

              instance = hydrateIn ? _reactDom["default"].hydrate(wrappedEl, domNode) : _reactDom["default"].render(wrappedEl, domNode);

              if (typeof callback === 'function') {
                callback();
              }
            } else {
              instance.setChildProps(el.props, context, callback);
            }
          });
        },
        unmount: function unmount() {
          _reactDom["default"].unmountComponentAtNode(domNode);

          instance = null;
        },
        getNode: function getNode() {
          if (!instance) {
            return null;
          }

          return (0, _enzymeAdapterUtils.getNodeFromRootFinder)(adapter.isCustomComponent, _toTree(instance._reactInternals), options);
        },
        simulateError: function simulateError(nodeHierarchy, rootNode, error) {
          var isErrorBoundary = function isErrorBoundary(_ref2) {
            var elInstance = _ref2.instance,
                type = _ref2.type;

            if (is166 && type && type.getDerivedStateFromError) {
              return true;
            }

            return elInstance && elInstance.componentDidCatch;
          };

          var _ref3 = nodeHierarchy.find(isErrorBoundary) || {},
              catchingInstance = _ref3.instance,
              catchingType = _ref3.type;

          (0, _enzymeAdapterUtils.simulateError)(error, catchingInstance, rootNode, nodeHierarchy, nodeTypeFromType, adapter.displayNameOfNode, is166 ? catchingType : undefined);
        },
        simulateEvent: function simulateEvent(node, event, mock) {
          var mappedEvent = (0, _enzymeAdapterUtils.mapNativeEventNames)(event, eventOptions);
          var eventFn = _testUtils["default"].Simulate[mappedEvent];

          if (!eventFn) {
            throw new TypeError("ReactWrapper::simulate() event '".concat(event, "' does not exist"));
          }

          wrapAct(function () {
            eventFn(adapter.nodeToHostNode(node), mock);
          });
        },
        batchedUpdates: function batchedUpdates(fn) {
          return fn(); // return ReactDOM.unstable_batchedUpdates(fn);
        },
        getWrappingComponentRenderer: function getWrappingComponentRenderer() {
          return _objectSpread(_objectSpread({}, this), (0, _enzymeAdapterUtils.getWrappingComponentMountRenderer)({
            toTree: function toTree(inst) {
              return _toTree(inst._reactInternals);
            },
            getMountWrapperInstance: function getMountWrapperInstance() {
              return instance;
            }
          }));
        }
      }, is168 && {
        wrapInvoke: wrapAct
      });
    }
  }, {
    key: "createShallowRenderer",
    value: function createShallowRenderer() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var adapter = this;
      var renderer = new _shallow["default"]();
      var suspenseFallback = options.suspenseFallback;

      if (typeof suspenseFallback !== 'undefined' && typeof suspenseFallback !== 'boolean') {
        throw TypeError('`options.suspenseFallback` should be boolean or undefined');
      }

      var isDOM = false;
      var cachedNode = null;
      var lastComponent = null;
      var wrappedComponent = null;
      var sentinel = {}; // wrap memo components with a PureComponent, or a class component with sCU

      var wrapPureComponent = function wrapPureComponent(Component, compare) {
        if (!is166) {
          throw new RangeError('this function should not be called in React < 16.6. Please report this!');
        }

        if (lastComponent !== Component) {
          if (isStateful(Component)) {
            wrappedComponent = /*#__PURE__*/function (_Component) {
              _inherits(wrappedComponent, _Component);

              var _super4 = _createSuper(wrappedComponent);

              function wrappedComponent() {
                _classCallCheck(this, wrappedComponent);

                return _super4.apply(this, arguments);
              }

              return wrappedComponent;
            }(Component); // eslint-disable-line react/prefer-stateless-function


            if (compare) {
              wrappedComponent.prototype.shouldComponentUpdate = function (nextProps) {
                return !compare(_this2.props, nextProps);
              };
            } else {
              wrappedComponent.prototype.isPureReactComponent = true;
            }
          } else {
            var memoized = sentinel;
            var prevProps;

            wrappedComponent = function wrappedComponent(props) {
              var shouldUpdate = memoized === sentinel || (compare ? !compare(prevProps, props) : !(0, _enzymeShallowEqual["default"])(prevProps, props));

              if (shouldUpdate) {
                for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                  args[_key - 1] = arguments[_key];
                }

                memoized = Component.apply(void 0, [_objectSpread(_objectSpread({}, Component.defaultProps), props)].concat(args));
                prevProps = props;
              }

              return memoized;
            };
          }

          (0, _object["default"])(wrappedComponent, Component, {
            displayName: adapter.displayNameOfNode({
              type: Component
            })
          });
          lastComponent = Component;
        }

        return wrappedComponent;
      }; // Wrap functional components on versions prior to 16.5,
      // to avoid inadvertently pass a `this` instance to it.


      var wrapFunctionalComponent = function wrapFunctionalComponent(Component) {
        if (is166 && (0, _has["default"])(Component, 'defaultProps')) {
          if (lastComponent !== Component) {
            wrappedComponent = (0, _object["default"])( // eslint-disable-next-line new-cap
            function (props) {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }

              return Component.apply(void 0, [_objectSpread(_objectSpread({}, Component.defaultProps), props)].concat(args));
            }, Component, {
              displayName: adapter.displayNameOfNode({
                type: Component
              })
            });
            lastComponent = Component;
          }

          return wrappedComponent;
        }

        if (is165) {
          return Component;
        }

        if (lastComponent !== Component) {
          wrappedComponent = (0, _object["default"])(function () {
            return Component.apply(void 0, arguments);
          }, // eslint-disable-line new-cap
          Component);
          lastComponent = Component;
        }

        return wrappedComponent;
      };

      var renderElement = function renderElement(elConfig) {
        for (var _len3 = arguments.length, rest = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          rest[_key3 - 1] = arguments[_key3];
        }

        var renderedEl = renderer.render.apply(renderer, [elConfig].concat(rest));
        var typeIsExisted = !!(renderedEl && renderedEl.type);

        if (is166 && typeIsExisted) {
          var clonedEl = transformSuspense(renderedEl, elConfig, {
            suspenseFallback: suspenseFallback
          });
          var elementIsChanged = clonedEl.type !== renderedEl.type;

          if (elementIsChanged) {
            return renderer.render.apply(renderer, [_objectSpread(_objectSpread({}, elConfig), {}, {
              type: clonedEl.type
            })].concat(rest));
          }
        }

        return renderedEl;
      };

      return {
        render: function render(el, unmaskedContext) {
          var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
              _ref4$providerValues = _ref4.providerValues,
              providerValues = _ref4$providerValues === void 0 ? new Map() : _ref4$providerValues;

          cachedNode = el;
          /* eslint consistent-return: 0 */

          if (typeof el.type === 'string') {
            isDOM = true;
          } else if ((0, _reactIs.isContextProvider)(el)) {
            providerValues.set(el.type, el.props.value);
            var MockProvider = (0, _object["default"])(function (props) {
              return props.children;
            }, el.type);
            return (0, _enzymeAdapterUtils.withSetStateAllowed)(function () {
              return renderElement(_objectSpread(_objectSpread({}, el), {}, {
                type: MockProvider
              }));
            });
          } else if ((0, _reactIs.isContextConsumer)(el)) {
            var Provider = adapter.getProviderFromConsumer(el.type);
            var value = providerValues.has(Provider) ? providerValues.get(Provider) : getProviderDefaultValue(Provider);
            var MockConsumer = (0, _object["default"])(function (props) {
              return props.children(value);
            }, el.type);
            return (0, _enzymeAdapterUtils.withSetStateAllowed)(function () {
              return renderElement(_objectSpread(_objectSpread({}, el), {}, {
                type: MockConsumer
              }));
            });
          } else {
            isDOM = false;
            var renderedEl = el;

            if (isLazy(renderedEl)) {
              throw TypeError('`React.lazy` is not supported by shallow rendering.');
            }

            renderedEl = transformSuspense(renderedEl, renderedEl, {
              suspenseFallback: suspenseFallback
            });
            var _renderedEl = renderedEl,
                Component = _renderedEl.type;
            var context = (0, _enzymeAdapterUtils.getMaskedContext)(Component.contextTypes, unmaskedContext);

            if (isMemo(el.type)) {
              var _el$type = el.type,
                  InnerComp = _el$type.type,
                  compare = _el$type.compare;
              return (0, _enzymeAdapterUtils.withSetStateAllowed)(function () {
                return renderElement(_objectSpread(_objectSpread({}, el), {}, {
                  type: wrapPureComponent(InnerComp, compare)
                }), context);
              });
            }

            if (!isStateful(Component) && typeof Component === 'function') {
              return (0, _enzymeAdapterUtils.withSetStateAllowed)(function () {
                return renderElement(_objectSpread(_objectSpread({}, renderedEl), {}, {
                  type: wrapFunctionalComponent(Component)
                }), context);
              });
            }

            if (isStateful) {
              // fix react bug; see implementation of `getEmptyStateValue`
              var emptyStateValue = getEmptyStateValue();

              if (emptyStateValue) {
                Object.defineProperty(Component.prototype, 'state', {
                  configurable: true,
                  enumerable: true,
                  get: function get() {
                    return null;
                  },
                  set: function set(value) {
                    if (value !== emptyStateValue) {
                      Object.defineProperty(this, 'state', {
                        configurable: true,
                        enumerable: true,
                        value: value,
                        writable: true
                      });
                    }

                    return true;
                  }
                });
              }
            }

            return (0, _enzymeAdapterUtils.withSetStateAllowed)(function () {
              return renderElement(renderedEl, context);
            });
          }
        },
        unmount: function unmount() {
          renderer.unmount();
        },
        getNode: function getNode() {
          if (isDOM) {
            return elementToTree(cachedNode);
          }

          var output = renderer.getRenderOutput();
          return {
            nodeType: nodeTypeFromType(cachedNode.type),
            type: cachedNode.type,
            props: cachedNode.props,
            key: (0, _enzymeAdapterUtils.ensureKeyOrUndefined)(cachedNode.key),
            ref: cachedNode.ref,
            instance: renderer._instance,
            rendered: Array.isArray(output) ? flatten(output).map(function (el) {
              return elementToTree(el);
            }) : elementToTree(output)
          };
        },
        simulateError: function simulateError(nodeHierarchy, rootNode, error) {
          (0, _enzymeAdapterUtils.simulateError)(error, renderer._instance, cachedNode, nodeHierarchy.concat(cachedNode), nodeTypeFromType, adapter.displayNameOfNode, is166 ? cachedNode.type : undefined);
        },
        simulateEvent: function simulateEvent(node, event) {
          for (var _len4 = arguments.length, args = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
            args[_key4 - 2] = arguments[_key4];
          }

          var handler = node.props[(0, _enzymeAdapterUtils.propFromEvent)(event, eventOptions)];

          if (handler) {
            (0, _enzymeAdapterUtils.withSetStateAllowed)(function () {
              // TODO(lmr): create/use synthetic events
              // TODO(lmr): emulate React's event propagation
              // ReactDOM.unstable_batchedUpdates(() => {
              handler.apply(void 0, args); // });
            });
          }
        },
        batchedUpdates: function batchedUpdates(fn) {
          return fn(); // return ReactDOM.unstable_batchedUpdates(fn);
        },
        checkPropTypes: function checkPropTypes(typeSpecs, values, location, hierarchy) {
          return (0, _checkPropTypes2["default"])(typeSpecs, values, location, (0, _enzymeAdapterUtils.displayNameOfNode)(cachedNode), function () {
            return (0, _enzymeAdapterUtils.getComponentStack)(hierarchy.concat([cachedNode]));
          });
        }
      };
    }
  }, {
    key: "createStringRenderer",
    value: function createStringRenderer(options) {
      if ((0, _has["default"])(options, 'suspenseFallback')) {
        throw new TypeError('`suspenseFallback` should not be specified in options of string renderer');
      }

      return {
        render: function render(el, context) {
          if (options.context && (el.type.contextTypes || options.childContextTypes)) {
            var childContextTypes = _objectSpread(_objectSpread({}, el.type.contextTypes || {}), options.childContextTypes);

            var ContextWrapper = (0, _enzymeAdapterUtils.createRenderWrapper)(el, context, childContextTypes);
            return _server["default"].renderToStaticMarkup( /*#__PURE__*/_react["default"].createElement(ContextWrapper));
          }

          return _server["default"].renderToStaticMarkup(el);
        }
      };
    } // Provided a bag of options, return an `EnzymeRenderer`. Some options can be implementation
    // specific, like `attach` etc. for React, but not part of this interface explicitly.
    // eslint-disable-next-line class-methods-use-this

  }, {
    key: "createRenderer",
    value: function createRenderer(options) {
      switch (options.mode) {
        case _enzyme.EnzymeAdapter.MODES.MOUNT:
          return this.createMountRenderer(options);

        case _enzyme.EnzymeAdapter.MODES.SHALLOW:
          return this.createShallowRenderer(options);

        case _enzyme.EnzymeAdapter.MODES.STRING:
          return this.createStringRenderer(options);

        default:
          throw new Error("Enzyme Internal Error: Unrecognized mode: ".concat(options.mode));
      }
    }
  }, {
    key: "wrap",
    value: function wrap(element) {
      return (0, _enzymeAdapterUtils.wrap)(element);
    } // converts an RSTNode to the corresponding JSX Pragma Element. This will be needed
    // in order to implement the `Wrapper.mount()` and `Wrapper.shallow()` methods, but should
    // be pretty straightforward for people to implement.
    // eslint-disable-next-line class-methods-use-this

  }, {
    key: "nodeToElement",
    value: function nodeToElement(node) {
      if (!node || _typeof(node) !== 'object') return null;
      var type = node.type;
      return /*#__PURE__*/_react["default"].createElement(unmemoType(type), (0, _enzymeAdapterUtils.propsWithKeysAndRef)(node));
    } // eslint-disable-next-line class-methods-use-this

  }, {
    key: "matchesElementType",
    value: function matchesElementType(node, matchingType) {
      if (!node) {
        return node;
      }

      var type = node.type;
      return unmemoType(type) === unmemoType(matchingType);
    }
  }, {
    key: "elementToNode",
    value: function elementToNode(element) {
      return elementToTree(element);
    }
  }, {
    key: "nodeToHostNode",
    value: function nodeToHostNode(node) {
      var supportsArray = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var nodes = _nodeToHostNode(node);

      if (Array.isArray(nodes) && !supportsArray) {
        return nodes[0];
      }

      return nodes;
    }
  }, {
    key: "displayNameOfNode",
    value: function displayNameOfNode(node) {
      if (!node) return null;
      var type = node.type,
          $$typeof = node.$$typeof;
      var nodeType = type || $$typeof; // newer node types may be undefined, so only test if the nodeType exists

      if (nodeType) {
        switch (nodeType) {
          case (is166 ? _reactIs.ConcurrentMode : _reactIs.AsyncMode) || NaN:
            return is166 ? 'ConcurrentMode' : 'AsyncMode';

          case _reactIs.Fragment || NaN:
            return 'Fragment';

          case _reactIs.StrictMode || NaN:
            return 'StrictMode';

          case _reactIs.Profiler || NaN:
            return 'Profiler';

          case _reactIs.Portal || NaN:
            return 'Portal';

          case _reactIs.Suspense || NaN:
            return 'Suspense';

          default:
        }
      }

      var $$typeofType = type && type.$$typeof;

      switch ($$typeofType) {
        case _reactIs.ContextConsumer || NaN:
          return 'ContextConsumer';

        case _reactIs.ContextProvider || NaN:
          return 'ContextProvider';

        case _reactIs.Memo || NaN:
          {
            var nodeName = (0, _enzymeAdapterUtils.displayNameOfNode)(node);
            return typeof nodeName === 'string' ? nodeName : "Memo(".concat((0, _enzymeAdapterUtils.displayNameOfNode)(type), ")");
          }

        case _reactIs.ForwardRef || NaN:
          {
            if (type.displayName) {
              return type.displayName;
            }

            var name = (0, _enzymeAdapterUtils.displayNameOfNode)({
              type: type.render
            });
            return name ? "ForwardRef(".concat(name, ")") : 'ForwardRef';
          }

        case _reactIs.Lazy || NaN:
          {
            return 'lazy';
          }

        default:
          return (0, _enzymeAdapterUtils.displayNameOfNode)(node);
      }
    }
  }, {
    key: "isValidElement",
    value: function isValidElement(element) {
      return (0, _reactIs.isElement)(element);
    }
  }, {
    key: "isValidElementType",
    value: function isValidElementType(object) {
      return !!object && (0, _reactIs.isValidElementType)(object);
    }
  }, {
    key: "isFragment",
    value: function isFragment(fragment) {
      return (0, _Utils.typeOfNode)(fragment) === _reactIs.Fragment;
    }
  }, {
    key: "isCustomComponent",
    value: function isCustomComponent(type) {
      var fakeElement = makeFakeElement(type);
      return !!type && (typeof type === 'function' || (0, _reactIs.isForwardRef)(fakeElement) || (0, _reactIs.isContextProvider)(fakeElement) || (0, _reactIs.isContextConsumer)(fakeElement) || (0, _reactIs.isSuspense)(fakeElement));
    }
  }, {
    key: "isContextConsumer",
    value: function isContextConsumer(type) {
      return !!type && (0, _reactIs.isContextConsumer)(makeFakeElement(type));
    }
  }, {
    key: "isCustomComponentElement",
    value: function isCustomComponentElement(inst) {
      if (!inst || !this.isValidElement(inst)) {
        return false;
      }

      return this.isCustomComponent(inst.type);
    }
  }, {
    key: "getProviderFromConsumer",
    value: function getProviderFromConsumer(Consumer) {
      // React stores references to the Provider on a Consumer differently across versions.
      if (Consumer) {
        var Provider;

        if (Consumer._context) {
          // check this first, to avoid a deprecation warning
          Provider = Consumer._context.Provider;
        } else if (Consumer.Provider) {
          Provider = Consumer.Provider;
        }

        if (Provider) {
          return Provider;
        }
      }

      throw new Error('Enzyme Internal Error: can’t figure out how to get Provider from Consumer');
    }
  }, {
    key: "createElement",
    value: function createElement() {
      return /*#__PURE__*/_react["default"].createElement.apply(_react["default"], arguments);
    }
  }, {
    key: "wrapWithWrappingComponent",
    value: function wrapWithWrappingComponent(node, options) {
      return {
        RootFinder: _enzymeAdapterUtils.RootFinder,
        node: (0, _enzymeAdapterUtils.wrapWithWrappingComponent)(_react["default"].createElement, node, options)
      };
    }
  }]);

  return ReactSixteenAdapter;
}(_enzyme.EnzymeAdapter);

module.exports = ReactSixteenAdapter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9SZWFjdFNpeHRlZW5BZGFwdGVyLmpzIl0sIm5hbWVzIjpbImlzMTY0IiwiVGVzdFV0aWxzIiwiU2ltdWxhdGUiLCJ0b3VjaFN0YXJ0IiwiaXMxNjUiLCJhdXhDbGljayIsImlzMTY2IiwiUmVhY3QiLCJ1bnN0YWJsZV9Bc3luY01vZGUiLCJpczE2OCIsImFjdCIsImhhc1Nob3VsZENvbXBvbmVudFVwZGF0ZUJ1ZyIsInNlbXZlciIsInNhdGlzZmllcyIsInRlc3RSZW5kZXJlclZlcnNpb24iLCJGaWJlclRhZ3MiLCJub2RlQW5kU2libGluZ3NBcnJheSIsIm5vZGVXaXRoU2libGluZyIsImFycmF5Iiwibm9kZSIsInB1c2giLCJzaWJsaW5nIiwiZmxhdHRlbiIsImFyciIsInJlc3VsdCIsInN0YWNrIiwiaSIsImxlbmd0aCIsIm4iLCJwb3AiLCJlbCIsIkFycmF5IiwiaXNBcnJheSIsIm5vZGVUeXBlRnJvbVR5cGUiLCJ0eXBlIiwiUG9ydGFsIiwiaXNNZW1vIiwiTWVtbyIsImlzTGF6eSIsIkxhenkiLCJ1bm1lbW9UeXBlIiwidHJhbnNmb3JtU3VzcGVuc2UiLCJyZW5kZXJlZEVsIiwicHJlcmVuZGVyRWwiLCJzdXNwZW5zZUZhbGxiYWNrIiwiY2hpbGRyZW4iLCJwcm9wcyIsImZhbGxiYWNrIiwicmVwbGFjZUxhenlXaXRoRmFsbGJhY2siLCJwcm9wVHlwZXMiLCJkZWZhdWx0UHJvcHMiLCJjb250ZXh0VHlwZXMiLCJjb250ZXh0VHlwZSIsImNoaWxkQ29udGV4dFR5cGVzIiwiRmFrZVN1c3BlbnNlIiwiaXNTdGF0ZWZ1bCIsImNyZWF0ZUVsZW1lbnQiLCJlbGVtZW50VG9UcmVlIiwiY29udGFpbmVySW5mbyIsIm5vZGVUeXBlIiwia2V5IiwicmVmIiwiaW5zdGFuY2UiLCJyZW5kZXJlZCIsInRvVHJlZSIsInZub2RlIiwidGFnIiwiSG9zdFJvb3QiLCJjaGlsZHJlblRvVHJlZSIsImNoaWxkIiwiSG9zdFBvcnRhbCIsInN0YXRlTm9kZSIsIm1lbW9pemVkUHJvcHMiLCJDbGFzc0NvbXBvbmVudCIsIkZ1bmN0aW9uYWxDb21wb25lbnQiLCJNZW1vQ2xhc3MiLCJlbGVtZW50VHlwZSIsIk1lbW9TRkMiLCJyZW5kZXJlZE5vZGVzIiwibWFwIiwiSG9zdENvbXBvbmVudCIsIkhvc3RUZXh0IiwiRnJhZ21lbnQiLCJNb2RlIiwiQ29udGV4dFByb3ZpZGVyIiwiQ29udGV4dENvbnN1bWVyIiwiUHJvZmlsZXIiLCJGb3J3YXJkUmVmIiwicGVuZGluZ1Byb3BzIiwiU3VzcGVuc2UiLCJFcnJvciIsIm5vZGVUb0hvc3ROb2RlIiwiX25vZGUiLCJtYXBwZXIiLCJpdGVtIiwiUmVhY3RET00iLCJmaW5kRE9NTm9kZSIsImV2ZW50T3B0aW9ucyIsImFuaW1hdGlvbiIsInBvaW50ZXJFdmVudHMiLCJnZXRFbXB0eVN0YXRlVmFsdWUiLCJFbXB0eVN0YXRlIiwiQ29tcG9uZW50IiwidGVzdFJlbmRlcmVyIiwiU2hhbGxvd1JlbmRlcmVyIiwicmVuZGVyIiwiX2luc3RhbmNlIiwic3RhdGUiLCJ3cmFwQWN0IiwiZm4iLCJyZXR1cm5WYWwiLCJnZXRQcm92aWRlckRlZmF1bHRWYWx1ZSIsIlByb3ZpZGVyIiwiX2NvbnRleHQiLCJfZGVmYXVsdFZhbHVlIiwiX2N1cnJlbnRWYWx1ZSIsIm1ha2VGYWtlRWxlbWVudCIsIiQkdHlwZW9mIiwiRWxlbWVudCIsInByb3RvdHlwZSIsImlzUmVhY3RDb21wb25lbnQiLCJfX3JlYWN0QXV0b0JpbmRQYWlycyIsIlJlYWN0U2l4dGVlbkFkYXB0ZXIiLCJsaWZlY3ljbGVzIiwib3B0aW9ucyIsImVuYWJsZUNvbXBvbmVudERpZFVwZGF0ZU9uU2V0U3RhdGUiLCJsZWdhY3lDb250ZXh0TW9kZSIsImNvbXBvbmVudERpZFVwZGF0ZSIsIm9uU2V0U3RhdGUiLCJnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMiLCJnZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZSIsInNldFN0YXRlIiwic2tpcHNDb21wb25lbnREaWRVcGRhdGVPbk51bGxpc2giLCJnZXRDaGlsZENvbnRleHQiLCJjYWxsZWRCeVJlbmRlcmVyIiwiZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yIiwiVHlwZUVycm9yIiwiYXR0YWNoVG8iLCJoeWRyYXRlSW4iLCJ3cmFwcGluZ0NvbXBvbmVudFByb3BzIiwiZG9tTm9kZSIsImdsb2JhbCIsImRvY3VtZW50IiwiYWRhcHRlciIsImNvbnRleHQiLCJjYWxsYmFjayIsIndyYXBwZXJQcm9wcyIsInJlZlByb3AiLCJSZWFjdFdyYXBwZXJDb21wb25lbnQiLCJ3cmFwcGVkRWwiLCJoeWRyYXRlIiwic2V0Q2hpbGRQcm9wcyIsInVubW91bnQiLCJ1bm1vdW50Q29tcG9uZW50QXROb2RlIiwiZ2V0Tm9kZSIsImlzQ3VzdG9tQ29tcG9uZW50IiwiX3JlYWN0SW50ZXJuYWxzIiwic2ltdWxhdGVFcnJvciIsIm5vZGVIaWVyYXJjaHkiLCJyb290Tm9kZSIsImVycm9yIiwiaXNFcnJvckJvdW5kYXJ5IiwiZWxJbnN0YW5jZSIsImNvbXBvbmVudERpZENhdGNoIiwiZmluZCIsImNhdGNoaW5nSW5zdGFuY2UiLCJjYXRjaGluZ1R5cGUiLCJkaXNwbGF5TmFtZU9mTm9kZSIsInVuZGVmaW5lZCIsInNpbXVsYXRlRXZlbnQiLCJldmVudCIsIm1vY2siLCJtYXBwZWRFdmVudCIsImV2ZW50Rm4iLCJiYXRjaGVkVXBkYXRlcyIsImdldFdyYXBwaW5nQ29tcG9uZW50UmVuZGVyZXIiLCJpbnN0IiwiZ2V0TW91bnRXcmFwcGVySW5zdGFuY2UiLCJ3cmFwSW52b2tlIiwicmVuZGVyZXIiLCJpc0RPTSIsImNhY2hlZE5vZGUiLCJsYXN0Q29tcG9uZW50Iiwid3JhcHBlZENvbXBvbmVudCIsInNlbnRpbmVsIiwid3JhcFB1cmVDb21wb25lbnQiLCJjb21wYXJlIiwiUmFuZ2VFcnJvciIsInNob3VsZENvbXBvbmVudFVwZGF0ZSIsIm5leHRQcm9wcyIsImlzUHVyZVJlYWN0Q29tcG9uZW50IiwibWVtb2l6ZWQiLCJwcmV2UHJvcHMiLCJzaG91bGRVcGRhdGUiLCJhcmdzIiwiZGlzcGxheU5hbWUiLCJ3cmFwRnVuY3Rpb25hbENvbXBvbmVudCIsInJlbmRlckVsZW1lbnQiLCJlbENvbmZpZyIsInJlc3QiLCJ0eXBlSXNFeGlzdGVkIiwiY2xvbmVkRWwiLCJlbGVtZW50SXNDaGFuZ2VkIiwidW5tYXNrZWRDb250ZXh0IiwicHJvdmlkZXJWYWx1ZXMiLCJNYXAiLCJzZXQiLCJ2YWx1ZSIsIk1vY2tQcm92aWRlciIsImdldFByb3ZpZGVyRnJvbUNvbnN1bWVyIiwiaGFzIiwiZ2V0IiwiTW9ja0NvbnN1bWVyIiwiSW5uZXJDb21wIiwiZW1wdHlTdGF0ZVZhbHVlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJjb25maWd1cmFibGUiLCJlbnVtZXJhYmxlIiwid3JpdGFibGUiLCJvdXRwdXQiLCJnZXRSZW5kZXJPdXRwdXQiLCJjb25jYXQiLCJoYW5kbGVyIiwiY2hlY2tQcm9wVHlwZXMiLCJ0eXBlU3BlY3MiLCJ2YWx1ZXMiLCJsb2NhdGlvbiIsImhpZXJhcmNoeSIsIkNvbnRleHRXcmFwcGVyIiwiUmVhY3RET01TZXJ2ZXIiLCJyZW5kZXJUb1N0YXRpY01hcmt1cCIsIm1vZGUiLCJFbnp5bWVBZGFwdGVyIiwiTU9ERVMiLCJNT1VOVCIsImNyZWF0ZU1vdW50UmVuZGVyZXIiLCJTSEFMTE9XIiwiY3JlYXRlU2hhbGxvd1JlbmRlcmVyIiwiU1RSSU5HIiwiY3JlYXRlU3RyaW5nUmVuZGVyZXIiLCJlbGVtZW50IiwibWF0Y2hpbmdUeXBlIiwic3VwcG9ydHNBcnJheSIsIm5vZGVzIiwiQ29uY3VycmVudE1vZGUiLCJBc3luY01vZGUiLCJOYU4iLCJTdHJpY3RNb2RlIiwiJCR0eXBlb2ZUeXBlIiwibm9kZU5hbWUiLCJuYW1lIiwib2JqZWN0IiwiZnJhZ21lbnQiLCJmYWtlRWxlbWVudCIsImlzVmFsaWRFbGVtZW50IiwiQ29uc3VtZXIiLCJSb290RmluZGVyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7OztBQUNBOztBQUNBOztBQUVBOztBQUVB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QUNaLFlBQUloSixRQUFKOztBQUNBLFlBQUlnSixRQUFRLENBQUMvSSxRQUFiLEVBQXVCO0FBQUU7QUFDcEJELFVBQUFBLFFBRGtCLEdBQ0xnSixRQUFRLENBQUMvSSxRQURKLENBQ2xCRCxRQURrQjtBQUV0QixTQUZELE1BRU8sSUFBSWdKLFFBQVEsQ0FBQ2hKLFFBQWIsRUFBdUI7QUFDekJBLFVBQUFBLFFBRHlCLEdBQ1pnSixRQURZLENBQ3pCaEosUUFEeUI7QUFFN0I7O0FBQ0QsWUFBSUEsUUFBSixFQUFjO0FBQ1osaUJBQU9BLFFBQVA7QUFDRDtBQUNGOztBQUNELFlBQU0sSUFBSXRCLEtBQUosQ0FBVSwyRUFBVixDQUFOO0FBQ0Q7OztvQ0FFc0I7QUFDckIsMEJBQU9uRixrQkFBTWlELGFBQU4sb0NBQVA7QUFDRDs7OzhDQUV5QnJDLEksRUFBTXlHLE8sRUFBUztBQUN2QyxhQUFPO0FBQ0xxSSxRQUFBQSxVQUFVLEVBQVZBLDhCQURLO0FBRUw5TyxRQUFBQSxJQUFJLEVBQUUsbURBQTBCWixrQkFBTWlELGFBQWhDLEVBQStDckMsSUFBL0MsRUFBcUR5RyxPQUFyRDtBQUZELE9BQVA7QUFJRDs7OztFQXRoQitCNkcscUI7O0FBeWhCbEN5QixNQUFNLENBQUNDLE9BQVAsR0FBaUJ6SSxtQkFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQgbm8tdXNlLWJlZm9yZS1kZWZpbmU6IDAgKi9cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW5yZXNvbHZlZFxuaW1wb3J0IFJlYWN0RE9NU2VydmVyIGZyb20gJ3JlYWN0LWRvbS9zZXJ2ZXInO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnJlc29sdmVkXG5pbXBvcnQgU2hhbGxvd1JlbmRlcmVyIGZyb20gJ3JlYWN0LXRlc3QtcmVuZGVyZXIvc2hhbGxvdyc7XG5pbXBvcnQgeyB2ZXJzaW9uIGFzIHRlc3RSZW5kZXJlclZlcnNpb24gfSBmcm9tICdyZWFjdC10ZXN0LXJlbmRlcmVyL3BhY2thZ2UuanNvbic7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVucmVzb2x2ZWRcbmltcG9ydCBUZXN0VXRpbHMgZnJvbSAncmVhY3QtZG9tL3Rlc3QtdXRpbHMnO1xuaW1wb3J0IHNlbXZlciBmcm9tICdzZW12ZXInO1xuaW1wb3J0IGNoZWNrUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMvY2hlY2tQcm9wVHlwZXMnO1xuaW1wb3J0IGhhcyBmcm9tICdoYXMnO1xuaW1wb3J0IHtcbiAgQXN5bmNNb2RlLFxuICBDb25jdXJyZW50TW9kZSxcbiAgQ29udGV4dENvbnN1bWVyLFxuICBDb250ZXh0UHJvdmlkZXIsXG4gIEVsZW1lbnQsXG4gIEZvcndhcmRSZWYsXG4gIEZyYWdtZW50LFxuICBpc0NvbnRleHRDb25zdW1lcixcbiAgaXNDb250ZXh0UHJvdmlkZXIsXG4gIGlzRWxlbWVudCxcbiAgaXNGb3J3YXJkUmVmLFxuICBpc1BvcnRhbCxcbiAgaXNTdXNwZW5zZSxcbiAgaXNWYWxpZEVsZW1lbnRUeXBlLFxuICBMYXp5LFxuICBNZW1vLFxuICBQb3J0YWwsXG4gIFByb2ZpbGVyLFxuICBTdHJpY3RNb2RlLFxuICBTdXNwZW5zZSxcbn0gZnJvbSAncmVhY3QtaXMnO1xuaW1wb3J0IHsgRW56eW1lQWRhcHRlciB9IGZyb20gJ2VuenltZSc7XG5pbXBvcnQgeyB0eXBlT2ZOb2RlIH0gZnJvbSAnZW56eW1lL2J1aWxkL1V0aWxzJztcbmltcG9ydCBzaGFsbG93RXF1YWwgZnJvbSAnZW56eW1lLXNoYWxsb3ctZXF1YWwnO1xuaW1wb3J0IHtcbiAgZGlzcGxheU5hbWVPZk5vZGUsXG4gIGVsZW1lbnRUb1RyZWUgYXMgdXRpbEVsZW1lbnRUb1RyZWUsXG4gIG5vZGVUeXBlRnJvbVR5cGUgYXMgdXRpbE5vZGVUeXBlRnJvbVR5cGUsXG4gIG1hcE5hdGl2ZUV2ZW50TmFtZXMsXG4gIHByb3BGcm9tRXZlbnQsXG4gIGFzc2VydERvbUF2YWlsYWJsZSxcbiAgd2l0aFNldFN0YXRlQWxsb3dlZCxcbiAgY3JlYXRlUmVuZGVyV3JhcHBlcixcbiAgY3JlYXRlTW91bnRXcmFwcGVyLFxuICBwcm9wc1dpdGhLZXlzQW5kUmVmLFxuICBlbnN1cmVLZXlPclVuZGVmaW5lZCxcbiAgc2ltdWxhdGVFcnJvcixcbiAgd3JhcCxcbiAgZ2V0TWFza2VkQ29udGV4dCxcbiAgZ2V0Q29tcG9uZW50U3RhY2ssXG4gIFJvb3RGaW5kZXIsXG4gIGdldE5vZGVGcm9tUm9vdEZpbmRlcixcbiAgd3JhcFdpdGhXcmFwcGluZ0NvbXBvbmVudCxcbiAgZ2V0V3JhcHBpbmdDb21wb25lbnRNb3VudFJlbmRlcmVyLFxuICBjb21wYXJlTm9kZVR5cGVPZixcbn0gZnJvbSAnZW56eW1lLWFkYXB0ZXItdXRpbHMnO1xuaW1wb3J0IGZpbmRDdXJyZW50RmliZXJVc2luZ1Nsb3dQYXRoIGZyb20gJy4vZmluZEN1cnJlbnRGaWJlclVzaW5nU2xvd1BhdGgnO1xuaW1wb3J0IGRldGVjdEZpYmVyVGFncyBmcm9tICcuL2RldGVjdEZpYmVyVGFncyc7XG5cbmNvbnN0IGlzMTY0ID0gISFUZXN0VXRpbHMuU2ltdWxhdGUudG91Y2hTdGFydDsgLy8gMTYuNCtcbmNvbnN0IGlzMTY1ID0gISFUZXN0VXRpbHMuU2ltdWxhdGUuYXV4Q2xpY2s7IC8vIDE2LjUrXG5jb25zdCBpczE2NiA9IGlzMTY1ICYmICFSZWFjdC51bnN0YWJsZV9Bc3luY01vZGU7IC8vIDE2LjYrXG5jb25zdCBpczE2OCA9IGlzMTY2ICYmIHR5cGVvZiBUZXN0VXRpbHMuYWN0ID09PSAnZnVuY3Rpb24nO1xuXG5jb25zdCBoYXNTaG91bGRDb21wb25lbnRVcGRhdGVCdWcgPSBzZW12ZXIuc2F0aXNmaWVzKHRlc3RSZW5kZXJlclZlcnNpb24sICc8IDE2LjgnKTtcblxuLy8gTGF6aWx5IHBvcHVsYXRlZCBpZiBET00gaXMgYXZhaWxhYmxlLlxubGV0IEZpYmVyVGFncyA9IG51bGw7XG5cbmZ1bmN0aW9uIG5vZGVBbmRTaWJsaW5nc0FycmF5KG5vZGVXaXRoU2libGluZykge1xuICBjb25zdCBhcnJheSA9IFtdO1xuICBsZXQgbm9kZSA9IG5vZGVXaXRoU2libGluZztcbiAgd2hpbGUgKG5vZGUgIT0gbnVsbCkge1xuICAgIGFycmF5LnB1c2gobm9kZSk7XG4gICAgbm9kZSA9IG5vZGUuc2libGluZztcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbmZ1bmN0aW9uIGZsYXR0ZW4oYXJyKSB7XG4gIGNvbnN0IHJlc3VsdCA9IFtdO1xuICBjb25zdCBzdGFjayA9IFt7IGk6IDAsIGFycmF5OiBhcnIgfV07XG4gIHdoaWxlIChzdGFjay5sZW5ndGgpIHtcbiAgICBjb25zdCBuID0gc3RhY2sucG9wKCk7XG4gICAgd2hpbGUgKG4uaSA8IG4uYXJyYXkubGVuZ3RoKSB7XG4gICAgICBjb25zdCBlbCA9IG4uYXJyYXlbbi5pXTtcbiAgICAgIG4uaSArPSAxO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZWwpKSB7XG4gICAgICAgIHN0YWNrLnB1c2gobik7XG4gICAgICAgIHN0YWNrLnB1c2goeyBpOiAwLCBhcnJheTogZWwgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgcmVzdWx0LnB1c2goZWwpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBub2RlVHlwZUZyb21UeXBlKHR5cGUpIHtcbiAgaWYgKHR5cGUgPT09IFBvcnRhbCkge1xuICAgIHJldHVybiAncG9ydGFsJztcbiAgfVxuXG4gIHJldHVybiB1dGlsTm9kZVR5cGVGcm9tVHlwZSh0eXBlKTtcbn1cblxuZnVuY3Rpb24gaXNNZW1vKHR5cGUpIHtcbiAgcmV0dXJuIGNvbXBhcmVOb2RlVHlwZU9mKHR5cGUsIE1lbW8pO1xufVxuXG5mdW5jdGlvbiBpc0xhenkodHlwZSkge1xuICByZXR1cm4gY29tcGFyZU5vZGVUeXBlT2YodHlwZSwgTGF6eSk7XG59XG5cbmZ1bmN0aW9uIHVubWVtb1R5cGUodHlwZSkge1xuICByZXR1cm4gaXNNZW1vKHR5cGUpID8gdHlwZS50eXBlIDogdHlwZTtcbn1cblxuZnVuY3Rpb24gdHJhbnNmb3JtU3VzcGVuc2UocmVuZGVyZWRFbCwgcHJlcmVuZGVyRWwsIHsgc3VzcGVuc2VGYWxsYmFjayB9KSB7XG4gIGlmICghaXNTdXNwZW5zZShyZW5kZXJlZEVsKSkge1xuICAgIHJldHVybiByZW5kZXJlZEVsO1xuICB9XG5cbiAgbGV0IHsgY2hpbGRyZW4gfSA9IHJlbmRlcmVkRWwucHJvcHM7XG5cbiAgaWYgKHN1c3BlbnNlRmFsbGJhY2spIHtcbiAgICBjb25zdCB7IGZhbGxiYWNrIH0gPSByZW5kZXJlZEVsLnByb3BzO1xuICAgIGNoaWxkcmVuID0gcmVwbGFjZUxhenlXaXRoRmFsbGJhY2soY2hpbGRyZW4sIGZhbGxiYWNrKTtcbiAgfVxuXG4gIGNvbnN0IHtcbiAgICBwcm9wVHlwZXMsXG4gICAgZGVmYXVsdFByb3BzLFxuICAgIGNvbnRleHRUeXBlcyxcbiAgICBjb250ZXh0VHlwZSxcbiAgICBjaGlsZENvbnRleHRUeXBlcyxcbiAgfSA9IHJlbmRlcmVkRWwudHlwZTtcblxuICBjb25zdCBGYWtlU3VzcGVuc2UgPSBPYmplY3QuYXNzaWduKFxuICAgIGlzU3RhdGVmdWwocHJlcmVuZGVyRWwudHlwZSlcbiAgICAgID8gY2xhc3MgRmFrZVN1c3BlbnNlIGV4dGVuZHMgcHJlcmVuZGVyRWwudHlwZSB7XG4gICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICBjb25zdCB7IHR5cGUsIHByb3BzIH0gPSBwcmVyZW5kZXJFbDtcbiAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICB7IC4uLnByb3BzLCAuLi50aGlzLnByb3BzIH0sXG4gICAgICAgICAgICBjaGlsZHJlbixcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICA6IGZ1bmN0aW9uIEZha2VTdXNwZW5zZShwcm9wcykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIHByZWZlci1hcnJvdy1jYWxsYmFja1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICByZW5kZXJlZEVsLnR5cGUsXG4gICAgICAgICAgeyAuLi5yZW5kZXJlZEVsLnByb3BzLCAuLi5wcm9wcyB9LFxuICAgICAgICAgIGNoaWxkcmVuLFxuICAgICAgICApO1xuICAgICAgfSxcbiAgICB7XG4gICAgICBwcm9wVHlwZXMsXG4gICAgICBkZWZhdWx0UHJvcHMsXG4gICAgICBjb250ZXh0VHlwZXMsXG4gICAgICBjb250ZXh0VHlwZSxcbiAgICAgIGNoaWxkQ29udGV4dFR5cGVzLFxuICAgIH0sXG4gICk7XG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KEZha2VTdXNwZW5zZSwgbnVsbCwgY2hpbGRyZW4pO1xufVxuXG5mdW5jdGlvbiBlbGVtZW50VG9UcmVlKGVsKSB7XG4gIGlmICghaXNQb3J0YWwoZWwpKSB7XG4gICAgcmV0dXJuIHV0aWxFbGVtZW50VG9UcmVlKGVsLCBlbGVtZW50VG9UcmVlKTtcbiAgfVxuXG4gIGNvbnN0IHsgY2hpbGRyZW4sIGNvbnRhaW5lckluZm8gfSA9IGVsO1xuICBjb25zdCBwcm9wcyA9IHsgY2hpbGRyZW4sIGNvbnRhaW5lckluZm8gfTtcblxuICByZXR1cm4ge1xuICAgIG5vZGVUeXBlOiAncG9ydGFsJyxcbiAgICB0eXBlOiBQb3J0YWwsXG4gICAgcHJvcHMsXG4gICAga2V5OiBlbnN1cmVLZXlPclVuZGVmaW5lZChlbC5rZXkpLFxuICAgIHJlZjogZWwucmVmIHx8IG51bGwsXG4gICAgaW5zdGFuY2U6IG51bGwsXG4gICAgcmVuZGVyZWQ6IGVsZW1lbnRUb1RyZWUoZWwuY2hpbGRyZW4pLFxuICB9O1xufVxuXG5mdW5jdGlvbiB0b1RyZWUodm5vZGUpIHtcbiAgaWYgKHZub2RlID09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICAvLyBUT0RPKGxtcik6IEknbSBub3QgcmVhbGx5IHN1cmUgSSB1bmRlcnN0YW5kIHdoZXRoZXIgb3Igbm90IHRoaXMgaXMgd2hhdFxuICAvLyBpIHNob3VsZCBiZSBkb2luZywgb3IgaWYgdGhpcyBpcyBhIGhhY2sgZm9yIHNvbWV0aGluZyBpJ20gZG9pbmcgd3JvbmdcbiAgLy8gc29tZXdoZXJlIGVsc2UuIFNob3VsZCB0YWxrIHRvIHNlYmFzdGlhbiBhYm91dCB0aGlzIHBlcmhhcHNcbiAgY29uc3Qgbm9kZSA9IGZpbmRDdXJyZW50RmliZXJVc2luZ1Nsb3dQYXRoKHZub2RlKTtcbiAgc3dpdGNoIChub2RlLnRhZykge1xuICAgIGNhc2UgRmliZXJUYWdzLkhvc3RSb290OlxuICAgICAgcmV0dXJuIGNoaWxkcmVuVG9UcmVlKG5vZGUuY2hpbGQpO1xuICAgIGNhc2UgRmliZXJUYWdzLkhvc3RQb3J0YWw6IHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgc3RhdGVOb2RlOiB7IGNvbnRhaW5lckluZm8gfSxcbiAgICAgICAgbWVtb2l6ZWRQcm9wczogY2hpbGRyZW4sXG4gICAgICB9ID0gbm9kZTtcbiAgICAgIGNvbnN0IHByb3BzID0geyBjb250YWluZXJJbmZvLCBjaGlsZHJlbiB9O1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbm9kZVR5cGU6ICdwb3J0YWwnLFxuICAgICAgICB0eXBlOiBQb3J0YWwsXG4gICAgICAgIHByb3BzLFxuICAgICAgICBrZXk6IGVuc3VyZUtleU9yVW5kZWZpbmVkKG5vZGUua2V5KSxcbiAgICAgICAgcmVmOiBub2RlLnJlZixcbiAgICAgICAgaW5zdGFuY2U6IG51bGwsXG4gICAgICAgIHJlbmRlcmVkOiBjaGlsZHJlblRvVHJlZShub2RlLmNoaWxkKSxcbiAgICAgIH07XG4gICAgfVxuICAgIGNhc2UgRmliZXJUYWdzLkNsYXNzQ29tcG9uZW50OlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbm9kZVR5cGU6ICdjbGFzcycsXG4gICAgICAgIHR5cGU6IG5vZGUudHlwZSxcbiAgICAgICAgcHJvcHM6IHsgLi4ubm9kZS5tZW1vaXplZFByb3BzIH0sXG4gICAgICAgIGtleTogZW5zdXJlS2V5T3JVbmRlZmluZWQobm9kZS5rZXkpLFxuICAgICAgICByZWY6IG5vZGUucmVmLFxuICAgICAgICBpbnN0YW5jZTogbm9kZS5zdGF0ZU5vZGUsXG4gICAgICAgIHJlbmRlcmVkOiBjaGlsZHJlblRvVHJlZShub2RlLmNoaWxkKSxcbiAgICAgIH07XG4gICAgY2FzZSBGaWJlclRhZ3MuRnVuY3Rpb25hbENvbXBvbmVudDpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5vZGVUeXBlOiAnZnVuY3Rpb24nLFxuICAgICAgICB0eXBlOiBub2RlLnR5cGUsXG4gICAgICAgIHByb3BzOiB7IC4uLm5vZGUubWVtb2l6ZWRQcm9wcyB9LFxuICAgICAgICBrZXk6IGVuc3VyZUtleU9yVW5kZWZpbmVkKG5vZGUua2V5KSxcbiAgICAgICAgcmVmOiBub2RlLnJlZixcbiAgICAgICAgaW5zdGFuY2U6IG51bGwsXG4gICAgICAgIHJlbmRlcmVkOiBjaGlsZHJlblRvVHJlZShub2RlLmNoaWxkKSxcbiAgICAgIH07XG4gICAgY2FzZSBGaWJlclRhZ3MuTWVtb0NsYXNzOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbm9kZVR5cGU6ICdjbGFzcycsXG4gICAgICAgIHR5cGU6IG5vZGUuZWxlbWVudFR5cGUudHlwZSxcbiAgICAgICAgcHJvcHM6IHsgLi4ubm9kZS5tZW1vaXplZFByb3BzIH0sXG4gICAgICAgIGtleTogZW5zdXJlS2V5T3JVbmRlZmluZWQobm9kZS5rZXkpLFxuICAgICAgICByZWY6IG5vZGUucmVmLFxuICAgICAgICBpbnN0YW5jZTogbm9kZS5zdGF0ZU5vZGUsXG4gICAgICAgIHJlbmRlcmVkOiBjaGlsZHJlblRvVHJlZShub2RlLmNoaWxkLmNoaWxkKSxcbiAgICAgIH07XG4gICAgY2FzZSBGaWJlclRhZ3MuTWVtb1NGQzoge1xuICAgICAgbGV0IHJlbmRlcmVkTm9kZXMgPSBmbGF0dGVuKG5vZGVBbmRTaWJsaW5nc0FycmF5KG5vZGUuY2hpbGQpLm1hcCh0b1RyZWUpKTtcbiAgICAgIGlmIChyZW5kZXJlZE5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZW5kZXJlZE5vZGVzID0gW25vZGUubWVtb2l6ZWRQcm9wcy5jaGlsZHJlbl07XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBub2RlVHlwZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgdHlwZTogbm9kZS5lbGVtZW50VHlwZSxcbiAgICAgICAgcHJvcHM6IHsgLi4ubm9kZS5tZW1vaXplZFByb3BzIH0sXG4gICAgICAgIGtleTogZW5zdXJlS2V5T3JVbmRlZmluZWQobm9kZS5rZXkpLFxuICAgICAgICByZWY6IG5vZGUucmVmLFxuICAgICAgICBpbnN0YW5jZTogbnVsbCxcbiAgICAgICAgcmVuZGVyZWQ6IHJlbmRlcmVkTm9kZXMsXG4gICAgICB9O1xuICAgIH1cbiAgICBjYXNlIEZpYmVyVGFncy5Ib3N0Q29tcG9uZW50OiB7XG4gICAgICBsZXQgcmVuZGVyZWROb2RlcyA9IGZsYXR0ZW4obm9kZUFuZFNpYmxpbmdzQXJyYXkobm9kZS5jaGlsZCkubWFwKHRvVHJlZSkpO1xuICAgICAgaWYgKHJlbmRlcmVkTm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJlbmRlcmVkTm9kZXMgPSBbbm9kZS5tZW1vaXplZFByb3BzLmNoaWxkcmVuXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5vZGVUeXBlOiAnaG9zdCcsXG4gICAgICAgIHR5cGU6IG5vZGUudHlwZSxcbiAgICAgICAgcHJvcHM6IHsgLi4ubm9kZS5tZW1vaXplZFByb3BzIH0sXG4gICAgICAgIGtleTogZW5zdXJlS2V5T3JVbmRlZmluZWQobm9kZS5rZXkpLFxuICAgICAgICByZWY6IG5vZGUucmVmLFxuICAgICAgICBpbnN0YW5jZTogbm9kZS5zdGF0ZU5vZGUsXG4gICAgICAgIHJlbmRlcmVkOiByZW5kZXJlZE5vZGVzLFxuICAgICAgfTtcbiAgICB9XG4gICAgY2FzZSBGaWJlclRhZ3MuSG9zdFRleHQ6XG4gICAgICByZXR1cm4gbm9kZS5tZW1vaXplZFByb3BzO1xuICAgIGNhc2UgRmliZXJUYWdzLkZyYWdtZW50OlxuICAgIGNhc2UgRmliZXJUYWdzLk1vZGU6XG4gICAgY2FzZSBGaWJlclRhZ3MuQ29udGV4dFByb3ZpZGVyOlxuICAgIGNhc2UgRmliZXJUYWdzLkNvbnRleHRDb25zdW1lcjpcbiAgICAgIHJldHVybiBjaGlsZHJlblRvVHJlZShub2RlLmNoaWxkKTtcbiAgICBjYXNlIEZpYmVyVGFncy5Qcm9maWxlcjpcbiAgICBjYXNlIEZpYmVyVGFncy5Gb3J3YXJkUmVmOiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBub2RlVHlwZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgdHlwZTogbm9kZS50eXBlLFxuICAgICAgICBwcm9wczogeyAuLi5ub2RlLnBlbmRpbmdQcm9wcyB9LFxuICAgICAgICBrZXk6IGVuc3VyZUtleU9yVW5kZWZpbmVkKG5vZGUua2V5KSxcbiAgICAgICAgcmVmOiBub2RlLnJlZixcbiAgICAgICAgaW5zdGFuY2U6IG51bGwsXG4gICAgICAgIHJlbmRlcmVkOiBjaGlsZHJlblRvVHJlZShub2RlLmNoaWxkKSxcbiAgICAgIH07XG4gICAgfVxuICAgIGNhc2UgRmliZXJUYWdzLlN1c3BlbnNlOiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBub2RlVHlwZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgdHlwZTogU3VzcGVuc2UsXG4gICAgICAgIHByb3BzOiB7IC4uLm5vZGUubWVtb2l6ZWRQcm9wcyB9LFxuICAgICAgICBrZXk6IGVuc3VyZUtleU9yVW5kZWZpbmVkKG5vZGUua2V5KSxcbiAgICAgICAgcmVmOiBub2RlLnJlZixcbiAgICAgICAgaW5zdGFuY2U6IG51bGwsXG4gICAgICAgIHJlbmRlcmVkOiBjaGlsZHJlblRvVHJlZShub2RlLmNoaWxkKSxcbiAgICAgIH07XG4gICAgfVxuICAgIGNhc2UgRmliZXJUYWdzLkxhenk6XG4gICAgICByZXR1cm4gY2hpbGRyZW5Ub1RyZWUobm9kZS5jaGlsZCk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRW56eW1lIEludGVybmFsIEVycm9yOiB1bmtub3duIG5vZGUgd2l0aCB0YWcgJHtub2RlLnRhZ31gKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGlsZHJlblRvVHJlZShub2RlKSB7XG4gIGlmICghbm9kZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGNvbnN0IGNoaWxkcmVuID0gbm9kZUFuZFNpYmxpbmdzQXJyYXkobm9kZSk7XG4gIGlmIChjaGlsZHJlbi5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAoY2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIHRvVHJlZShjaGlsZHJlblswXSk7XG4gIH1cbiAgcmV0dXJuIGZsYXR0ZW4oY2hpbGRyZW4ubWFwKHRvVHJlZSkpO1xufVxuXG5mdW5jdGlvbiBub2RlVG9Ib3N0Tm9kZShfbm9kZSkge1xuICAvLyBOT1RFKGxtcik6IG5vZGUgY291bGQgYmUgYSBmdW5jdGlvbiBjb21wb25lbnRcbiAgLy8gd2hpY2ggd29udCBoYXZlIGFuIGluc3RhbmNlIHByb3AsIGJ1dCB3ZSBjYW4gZ2V0IHRoZVxuICAvLyBob3N0IG5vZGUgYXNzb2NpYXRlZCB3aXRoIGl0cyByZXR1cm4gdmFsdWUgYXQgdGhhdCBwb2ludC5cbiAgLy8gQWx0aG91Z2ggdGhpcyBicmVha3MgZG93biBpZiB0aGUgcmV0dXJuIHZhbHVlIGlzIGFuIGFycmF5LFxuICAvLyBhcyBpcyBwb3NzaWJsZSB3aXRoIFJlYWN0IDE2LlxuICBsZXQgbm9kZSA9IF9ub2RlO1xuICB3aGlsZSAobm9kZSAmJiAhQXJyYXkuaXNBcnJheShub2RlKSAmJiBub2RlLmluc3RhbmNlID09PSBudWxsKSB7XG4gICAgbm9kZSA9IG5vZGUucmVuZGVyZWQ7XG4gIH1cbiAgLy8gaWYgdGhlIFNGQyByZXR1cm5lZCBudWxsIGVmZmVjdGl2ZWx5LCB0aGVyZSBpcyBubyBob3N0IG5vZGUuXG4gIGlmICghbm9kZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgbWFwcGVyID0gKGl0ZW0pID0+IHtcbiAgICBpZiAoaXRlbSAmJiBpdGVtLmluc3RhbmNlKSByZXR1cm4gUmVhY3RET00uZmluZERPTU5vZGUoaXRlbS5pbnN0YW5jZSk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG4gIGlmIChBcnJheS5pc0FycmF5KG5vZGUpKSB7XG4gICAgcmV0dXJuIG5vZGUubWFwKG1hcHBlcik7XG4gIH1cbiAgaWYgKEFycmF5LmlzQXJyYXkobm9kZS5yZW5kZXJlZCkgJiYgbm9kZS5ub2RlVHlwZSA9PT0gJ2NsYXNzJykge1xuICAgIHJldHVybiBub2RlLnJlbmRlcmVkLm1hcChtYXBwZXIpO1xuICB9XG4gIHJldHVybiBtYXBwZXIobm9kZSk7XG59XG5cbmZ1bmN0aW9uIHJlcGxhY2VMYXp5V2l0aEZhbGxiYWNrKG5vZGUsIGZhbGxiYWNrKSB7XG4gIGlmICghbm9kZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KG5vZGUpKSB7XG4gICAgcmV0dXJuIG5vZGUubWFwKChlbCkgPT4gcmVwbGFjZUxhenlXaXRoRmFsbGJhY2soZWwsIGZhbGxiYWNrKSk7XG4gIH1cbiAgaWYgKGlzTGF6eShub2RlLnR5cGUpKSB7XG4gICAgcmV0dXJuIGZhbGxiYWNrO1xuICB9XG4gIHJldHVybiB7XG4gICAgLi4ubm9kZSxcbiAgICBwcm9wczoge1xuICAgICAgLi4ubm9kZS5wcm9wcyxcbiAgICAgIGNoaWxkcmVuOiByZXBsYWNlTGF6eVdpdGhGYWxsYmFjayhub2RlLnByb3BzLmNoaWxkcmVuLCBmYWxsYmFjayksXG4gICAgfSxcbiAgfTtcbn1cblxuY29uc3QgZXZlbnRPcHRpb25zID0ge1xuICBhbmltYXRpb246IHRydWUsXG4gIHBvaW50ZXJFdmVudHM6IGlzMTY0LFxuICBhdXhDbGljazogaXMxNjUsXG59O1xuXG5mdW5jdGlvbiBnZXRFbXB0eVN0YXRlVmFsdWUoKSB7XG4gIC8vIHRoaXMgaGFuZGxlcyBhIGJ1ZyBpbiBSZWFjdCAxNi4wIC0gMTYuMlxuICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2NvbW1pdC8zOWJlODM1NjVjNjVmOWM1MjIxNTBlNTIzNzUxNjc1NjhhMmExNDU5XG4gIC8vIGFsc28gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9wdWxsLzExOTY1XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0L3ByZWZlci1zdGF0ZWxlc3MtZnVuY3Rpb25cbiAgY2xhc3MgRW1wdHlTdGF0ZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gICAgcmVuZGVyKCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG4gIGNvbnN0IHRlc3RSZW5kZXJlciA9IG5ldyBTaGFsbG93UmVuZGVyZXIoKTtcbiAgdGVzdFJlbmRlcmVyLnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KEVtcHR5U3RhdGUpKTtcbiAgcmV0dXJuIHRlc3RSZW5kZXJlci5faW5zdGFuY2Uuc3RhdGU7XG59XG5cbmZ1bmN0aW9uIHdyYXBBY3QoZm4pIHtcbiAgaWYgKCFpczE2OCkge1xuICAgIHJldHVybiBmbigpO1xuICB9XG4gIGxldCByZXR1cm5WYWw7XG4gIFRlc3RVdGlscy5hY3QoKCkgPT4geyByZXR1cm5WYWwgPSBmbigpOyB9KTtcbiAgcmV0dXJuIHJldHVyblZhbDtcbn1cblxuZnVuY3Rpb24gZ2V0UHJvdmlkZXJEZWZhdWx0VmFsdWUoUHJvdmlkZXIpIHtcbiAgLy8gUmVhY3Qgc3RvcmVzIHJlZmVyZW5jZXMgdG8gdGhlIFByb3ZpZGVyJ3MgZGVmYXVsdFZhbHVlIGRpZmZlcmVudGx5IGFjcm9zcyB2ZXJzaW9ucy5cbiAgaWYgKCdfZGVmYXVsdFZhbHVlJyBpbiBQcm92aWRlci5fY29udGV4dCkge1xuICAgIHJldHVybiBQcm92aWRlci5fY29udGV4dC5fZGVmYXVsdFZhbHVlO1xuICB9XG4gIGlmICgnX2N1cnJlbnRWYWx1ZScgaW4gUHJvdmlkZXIuX2NvbnRleHQpIHtcbiAgICByZXR1cm4gUHJvdmlkZXIuX2NvbnRleHQuX2N1cnJlbnRWYWx1ZTtcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ0VuenltZSBJbnRlcm5hbCBFcnJvcjogY2Fu4oCZdCBmaWd1cmUgb3V0IGhvdyB0byBnZXQgUHJvdmlkZXLigJlzIGRlZmF1bHQgdmFsdWUnKTtcbn1cblxuZnVuY3Rpb24gbWFrZUZha2VFbGVtZW50KHR5cGUpIHtcbiAgcmV0dXJuIHsgJCR0eXBlb2Y6IEVsZW1lbnQsIHR5cGUgfTtcbn1cblxuZnVuY3Rpb24gaXNTdGF0ZWZ1bChDb21wb25lbnQpIHtcbiAgcmV0dXJuIENvbXBvbmVudC5wcm90b3R5cGUgJiYgKFxuICAgIENvbXBvbmVudC5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudFxuICAgIHx8IEFycmF5LmlzQXJyYXkoQ29tcG9uZW50Ll9fcmVhY3RBdXRvQmluZFBhaXJzKSAvLyBmYWxsYmFjayBmb3IgY3JlYXRlQ2xhc3MgY29tcG9uZW50c1xuICApO1xufVxuXG5jbGFzcyBSZWFjdFNpeHRlZW5BZGFwdGVyIGV4dGVuZHMgRW56eW1lQWRhcHRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgY29uc3QgeyBsaWZlY3ljbGVzIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgLi4udGhpcy5vcHRpb25zLFxuICAgICAgZW5hYmxlQ29tcG9uZW50RGlkVXBkYXRlT25TZXRTdGF0ZTogdHJ1ZSwgLy8gVE9ETzogcmVtb3ZlLCBzZW12ZXItbWFqb3JcbiAgICAgIGxlZ2FjeUNvbnRleHRNb2RlOiAncGFyZW50JyxcbiAgICAgIGxpZmVjeWNsZXM6IHtcbiAgICAgICAgLi4ubGlmZWN5Y2xlcyxcbiAgICAgICAgY29tcG9uZW50RGlkVXBkYXRlOiB7XG4gICAgICAgICAgb25TZXRTdGF0ZTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzOiB7XG4gICAgICAgICAgaGFzU2hvdWxkQ29tcG9uZW50VXBkYXRlQnVnLFxuICAgICAgICB9LFxuICAgICAgICBnZXRTbmFwc2hvdEJlZm9yZVVwZGF0ZTogdHJ1ZSxcbiAgICAgICAgc2V0U3RhdGU6IHtcbiAgICAgICAgICBza2lwc0NvbXBvbmVudERpZFVwZGF0ZU9uTnVsbGlzaDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Q2hpbGRDb250ZXh0OiB7XG4gICAgICAgICAgY2FsbGVkQnlSZW5kZXJlcjogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIGdldERlcml2ZWRTdGF0ZUZyb21FcnJvcjogaXMxNjYsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBjcmVhdGVNb3VudFJlbmRlcmVyKG9wdGlvbnMpIHtcbiAgICBhc3NlcnREb21BdmFpbGFibGUoJ21vdW50Jyk7XG4gICAgaWYgKGhhcyhvcHRpb25zLCAnc3VzcGVuc2VGYWxsYmFjaycpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdgc3VzcGVuc2VGYWxsYmFja2AgaXMgbm90IHN1cHBvcnRlZCBieSB0aGUgYG1vdW50YCByZW5kZXJlcicpO1xuICAgIH1cbiAgICBpZiAoRmliZXJUYWdzID09PSBudWxsKSB7XG4gICAgICAvLyBSZXF1aXJlcyBET00uXG4gICAgICBGaWJlclRhZ3MgPSBkZXRlY3RGaWJlclRhZ3MoKTtcbiAgICB9XG4gICAgY29uc3QgeyBhdHRhY2hUbywgaHlkcmF0ZUluLCB3cmFwcGluZ0NvbXBvbmVudFByb3BzIH0gPSBvcHRpb25zO1xuICAgIGNvbnN0IGRvbU5vZGUgPSBoeWRyYXRlSW4gfHwgYXR0YWNoVG8gfHwgZ2xvYmFsLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGxldCBpbnN0YW5jZSA9IG51bGw7XG4gICAgY29uc3QgYWRhcHRlciA9IHRoaXM7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlbmRlcihlbCwgY29udGV4dCwgY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIHdyYXBBY3QoKCkgPT4ge1xuICAgICAgICAgIGlmIChpbnN0YW5jZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgeyB0eXBlLCBwcm9wcywgcmVmIH0gPSBlbDtcbiAgICAgICAgICAgIGNvbnN0IHdyYXBwZXJQcm9wcyA9IHtcbiAgICAgICAgICAgICAgQ29tcG9uZW50OiB0eXBlLFxuICAgICAgICAgICAgICBwcm9wcyxcbiAgICAgICAgICAgICAgd3JhcHBpbmdDb21wb25lbnRQcm9wcyxcbiAgICAgICAgICAgICAgY29udGV4dCxcbiAgICAgICAgICAgICAgLi4uKHJlZiAmJiB7IHJlZlByb3A6IHJlZiB9KSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCBSZWFjdFdyYXBwZXJDb21wb25lbnQgPSBjcmVhdGVNb3VudFdyYXBwZXIoZWwsIHsgLi4ub3B0aW9ucywgYWRhcHRlciB9KTtcbiAgICAgICAgICAgIGNvbnN0IHdyYXBwZWRFbCA9IFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3RXcmFwcGVyQ29tcG9uZW50LCB3cmFwcGVyUHJvcHMpO1xuICAgICAgICAgICAgaW5zdGFuY2UgPSBoeWRyYXRlSW5cbiAgICAgICAgICAgICAgPyBSZWFjdERPTS5oeWRyYXRlKHdyYXBwZWRFbCwgZG9tTm9kZSlcbiAgICAgICAgICAgICAgOiBSZWFjdERPTS5yZW5kZXIod3JhcHBlZEVsLCBkb21Ob2RlKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5zdGFuY2Uuc2V0Q2hpbGRQcm9wcyhlbC5wcm9wcywgY29udGV4dCwgY2FsbGJhY2spO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgdW5tb3VudCgpIHtcbiAgICAgICAgUmVhY3RET00udW5tb3VudENvbXBvbmVudEF0Tm9kZShkb21Ob2RlKTtcbiAgICAgICAgaW5zdGFuY2UgPSBudWxsO1xuICAgICAgfSxcbiAgICAgIGdldE5vZGUoKSB7XG4gICAgICAgIGlmICghaW5zdGFuY2UpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZ2V0Tm9kZUZyb21Sb290RmluZGVyKFxuICAgICAgICAgIGFkYXB0ZXIuaXNDdXN0b21Db21wb25lbnQsXG4gICAgICAgICAgdG9UcmVlKGluc3RhbmNlLl9yZWFjdEludGVybmFscyksXG4gICAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgICBzaW11bGF0ZUVycm9yKG5vZGVIaWVyYXJjaHksIHJvb3ROb2RlLCBlcnJvcikge1xuICAgICAgICBjb25zdCBpc0Vycm9yQm91bmRhcnkgPSAoeyBpbnN0YW5jZTogZWxJbnN0YW5jZSwgdHlwZSB9KSA9PiB7XG4gICAgICAgICAgaWYgKGlzMTY2ICYmIHR5cGUgJiYgdHlwZS5nZXREZXJpdmVkU3RhdGVGcm9tRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZWxJbnN0YW5jZSAmJiBlbEluc3RhbmNlLmNvbXBvbmVudERpZENhdGNoO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICBpbnN0YW5jZTogY2F0Y2hpbmdJbnN0YW5jZSxcbiAgICAgICAgICB0eXBlOiBjYXRjaGluZ1R5cGUsXG4gICAgICAgIH0gPSBub2RlSGllcmFyY2h5LmZpbmQoaXNFcnJvckJvdW5kYXJ5KSB8fCB7fTtcblxuICAgICAgICBzaW11bGF0ZUVycm9yKFxuICAgICAgICAgIGVycm9yLFxuICAgICAgICAgIGNhdGNoaW5nSW5zdGFuY2UsXG4gICAgICAgICAgcm9vdE5vZGUsXG4gICAgICAgICAgbm9kZUhpZXJhcmNoeSxcbiAgICAgICAgICBub2RlVHlwZUZyb21UeXBlLFxuICAgICAgICAgIGFkYXB0ZXIuZGlzcGxheU5hbWVPZk5vZGUsXG4gICAgICAgICAgaXMxNjYgPyBjYXRjaGluZ1R5cGUgOiB1bmRlZmluZWQsXG4gICAgICAgICk7XG4gICAgICB9LFxuICAgICAgc2ltdWxhdGVFdmVudChub2RlLCBldmVudCwgbW9jaykge1xuICAgICAgICBjb25zdCBtYXBwZWRFdmVudCA9IG1hcE5hdGl2ZUV2ZW50TmFtZXMoZXZlbnQsIGV2ZW50T3B0aW9ucyk7XG4gICAgICAgIGNvbnN0IGV2ZW50Rm4gPSBUZXN0VXRpbHMuU2ltdWxhdGVbbWFwcGVkRXZlbnRdO1xuICAgICAgICBpZiAoIWV2ZW50Rm4pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBSZWFjdFdyYXBwZXI6OnNpbXVsYXRlKCkgZXZlbnQgJyR7ZXZlbnR9JyBkb2VzIG5vdCBleGlzdGApO1xuICAgICAgICB9XG4gICAgICAgIHdyYXBBY3QoKCkgPT4ge1xuICAgICAgICAgIGV2ZW50Rm4oYWRhcHRlci5ub2RlVG9Ib3N0Tm9kZShub2RlKSwgbW9jayk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGJhdGNoZWRVcGRhdGVzKGZuKSB7XG4gICAgICAgIHJldHVybiBmbigpO1xuICAgICAgICAvLyByZXR1cm4gUmVhY3RET00udW5zdGFibGVfYmF0Y2hlZFVwZGF0ZXMoZm4pO1xuICAgICAgfSxcbiAgICAgIGdldFdyYXBwaW5nQ29tcG9uZW50UmVuZGVyZXIoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4udGhpcyxcbiAgICAgICAgICAuLi5nZXRXcmFwcGluZ0NvbXBvbmVudE1vdW50UmVuZGVyZXIoe1xuICAgICAgICAgICAgdG9UcmVlOiAoaW5zdCkgPT4gdG9UcmVlKGluc3QuX3JlYWN0SW50ZXJuYWxzKSxcbiAgICAgICAgICAgIGdldE1vdW50V3JhcHBlckluc3RhbmNlOiAoKSA9PiBpbnN0YW5jZSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICAuLi4oaXMxNjggJiYgeyB3cmFwSW52b2tlOiB3cmFwQWN0IH0pLFxuICAgIH07XG4gIH1cblxuICBjcmVhdGVTaGFsbG93UmVuZGVyZXIob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgYWRhcHRlciA9IHRoaXM7XG4gICAgY29uc3QgcmVuZGVyZXIgPSBuZXcgU2hhbGxvd1JlbmRlcmVyKCk7XG4gICAgY29uc3QgeyBzdXNwZW5zZUZhbGxiYWNrIH0gPSBvcHRpb25zO1xuICAgIGlmICh0eXBlb2Ygc3VzcGVuc2VGYWxsYmFjayAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHN1c3BlbnNlRmFsbGJhY2sgIT09ICdib29sZWFuJykge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCdgb3B0aW9ucy5zdXNwZW5zZUZhbGxiYWNrYCBzaG91bGQgYmUgYm9vbGVhbiBvciB1bmRlZmluZWQnKTtcbiAgICB9XG4gICAgbGV0IGlzRE9NID0gZmFsc2U7XG4gICAgbGV0IGNhY2hlZE5vZGUgPSBudWxsO1xuXG4gICAgbGV0IGxhc3RDb21wb25lbnQgPSBudWxsO1xuICAgIGxldCB3cmFwcGVkQ29tcG9uZW50ID0gbnVsbDtcbiAgICBjb25zdCBzZW50aW5lbCA9IHt9O1xuXG4gICAgLy8gd3JhcCBtZW1vIGNvbXBvbmVudHMgd2l0aCBhIFB1cmVDb21wb25lbnQsIG9yIGEgY2xhc3MgY29tcG9uZW50IHdpdGggc0NVXG4gICAgY29uc3Qgd3JhcFB1cmVDb21wb25lbnQgPSAoQ29tcG9uZW50LCBjb21wYXJlKSA9PiB7XG4gICAgICBpZiAoIWlzMTY2KSB7XG4gICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCd0aGlzIGZ1bmN0aW9uIHNob3VsZCBub3QgYmUgY2FsbGVkIGluIFJlYWN0IDwgMTYuNi4gUGxlYXNlIHJlcG9ydCB0aGlzIScpO1xuICAgICAgfVxuICAgICAgaWYgKGxhc3RDb21wb25lbnQgIT09IENvbXBvbmVudCkge1xuICAgICAgICBpZiAoaXNTdGF0ZWZ1bChDb21wb25lbnQpKSB7XG4gICAgICAgICAgd3JhcHBlZENvbXBvbmVudCA9IGNsYXNzIGV4dGVuZHMgQ29tcG9uZW50IHt9OyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIHJlYWN0L3ByZWZlci1zdGF0ZWxlc3MtZnVuY3Rpb25cbiAgICAgICAgICBpZiAoY29tcGFyZSkge1xuICAgICAgICAgICAgd3JhcHBlZENvbXBvbmVudC5wcm90b3R5cGUuc2hvdWxkQ29tcG9uZW50VXBkYXRlID0gKG5leHRQcm9wcykgPT4gIWNvbXBhcmUodGhpcy5wcm9wcywgbmV4dFByb3BzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd3JhcHBlZENvbXBvbmVudC5wcm90b3R5cGUuaXNQdXJlUmVhY3RDb21wb25lbnQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsZXQgbWVtb2l6ZWQgPSBzZW50aW5lbDtcbiAgICAgICAgICBsZXQgcHJldlByb3BzO1xuICAgICAgICAgIHdyYXBwZWRDb21wb25lbnQgPSBmdW5jdGlvbiAocHJvcHMsIC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IG1lbW9pemVkID09PSBzZW50aW5lbCB8fCAoY29tcGFyZVxuICAgICAgICAgICAgICA/ICFjb21wYXJlKHByZXZQcm9wcywgcHJvcHMpXG4gICAgICAgICAgICAgIDogIXNoYWxsb3dFcXVhbChwcmV2UHJvcHMsIHByb3BzKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChzaG91bGRVcGRhdGUpIHtcbiAgICAgICAgICAgICAgbWVtb2l6ZWQgPSBDb21wb25lbnQoeyAuLi5Db21wb25lbnQuZGVmYXVsdFByb3BzLCAuLi5wcm9wcyB9LCAuLi5hcmdzKTtcbiAgICAgICAgICAgICAgcHJldlByb3BzID0gcHJvcHM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbWVtb2l6ZWQ7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBPYmplY3QuYXNzaWduKFxuICAgICAgICAgIHdyYXBwZWRDb21wb25lbnQsXG4gICAgICAgICAgQ29tcG9uZW50LFxuICAgICAgICAgIHsgZGlzcGxheU5hbWU6IGFkYXB0ZXIuZGlzcGxheU5hbWVPZk5vZGUoeyB0eXBlOiBDb21wb25lbnQgfSkgfSxcbiAgICAgICAgKTtcbiAgICAgICAgbGFzdENvbXBvbmVudCA9IENvbXBvbmVudDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB3cmFwcGVkQ29tcG9uZW50O1xuICAgIH07XG5cbiAgICAvLyBXcmFwIGZ1bmN0aW9uYWwgY29tcG9uZW50cyBvbiB2ZXJzaW9ucyBwcmlvciB0byAxNi41LFxuICAgIC8vIHRvIGF2b2lkIGluYWR2ZXJ0ZW50bHkgcGFzcyBhIGB0aGlzYCBpbnN0YW5jZSB0byBpdC5cbiAgICBjb25zdCB3cmFwRnVuY3Rpb25hbENvbXBvbmVudCA9IChDb21wb25lbnQpID0+IHtcbiAgICAgIGlmIChpczE2NiAmJiBoYXMoQ29tcG9uZW50LCAnZGVmYXVsdFByb3BzJykpIHtcbiAgICAgICAgaWYgKGxhc3RDb21wb25lbnQgIT09IENvbXBvbmVudCkge1xuICAgICAgICAgIHdyYXBwZWRDb21wb25lbnQgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5ldy1jYXBcbiAgICAgICAgICAgIChwcm9wcywgLi4uYXJncykgPT4gQ29tcG9uZW50KHsgLi4uQ29tcG9uZW50LmRlZmF1bHRQcm9wcywgLi4ucHJvcHMgfSwgLi4uYXJncyksXG4gICAgICAgICAgICBDb21wb25lbnQsXG4gICAgICAgICAgICB7IGRpc3BsYXlOYW1lOiBhZGFwdGVyLmRpc3BsYXlOYW1lT2ZOb2RlKHsgdHlwZTogQ29tcG9uZW50IH0pIH0sXG4gICAgICAgICAgKTtcbiAgICAgICAgICBsYXN0Q29tcG9uZW50ID0gQ29tcG9uZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB3cmFwcGVkQ29tcG9uZW50O1xuICAgICAgfVxuICAgICAgaWYgKGlzMTY1KSB7XG4gICAgICAgIHJldHVybiBDb21wb25lbnQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChsYXN0Q29tcG9uZW50ICE9PSBDb21wb25lbnQpIHtcbiAgICAgICAgd3JhcHBlZENvbXBvbmVudCA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgKC4uLmFyZ3MpID0+IENvbXBvbmVudCguLi5hcmdzKSwgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuZXctY2FwXG4gICAgICAgICAgQ29tcG9uZW50LFxuICAgICAgICApO1xuICAgICAgICBsYXN0Q29tcG9uZW50ID0gQ29tcG9uZW50O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHdyYXBwZWRDb21wb25lbnQ7XG4gICAgfTtcblxuICAgIGNvbnN0IHJlbmRlckVsZW1lbnQgPSAoZWxDb25maWcsIC4uLnJlc3QpID0+IHtcbiAgICAgIGNvbnN0IHJlbmRlcmVkRWwgPSByZW5kZXJlci5yZW5kZXIoZWxDb25maWcsIC4uLnJlc3QpO1xuXG4gICAgICBjb25zdCB0eXBlSXNFeGlzdGVkID0gISEocmVuZGVyZWRFbCAmJiByZW5kZXJlZEVsLnR5cGUpO1xuICAgICAgaWYgKGlzMTY2ICYmIHR5cGVJc0V4aXN0ZWQpIHtcbiAgICAgICAgY29uc3QgY2xvbmVkRWwgPSB0cmFuc2Zvcm1TdXNwZW5zZShyZW5kZXJlZEVsLCBlbENvbmZpZywgeyBzdXNwZW5zZUZhbGxiYWNrIH0pO1xuXG4gICAgICAgIGNvbnN0IGVsZW1lbnRJc0NoYW5nZWQgPSBjbG9uZWRFbC50eXBlICE9PSByZW5kZXJlZEVsLnR5cGU7XG4gICAgICAgIGlmIChlbGVtZW50SXNDaGFuZ2VkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlbmRlcmVyLnJlbmRlcih7IC4uLmVsQ29uZmlnLCB0eXBlOiBjbG9uZWRFbC50eXBlIH0sIC4uLnJlc3QpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZW5kZXJlZEVsO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgcmVuZGVyKGVsLCB1bm1hc2tlZENvbnRleHQsIHtcbiAgICAgICAgcHJvdmlkZXJWYWx1ZXMgPSBuZXcgTWFwKCksXG4gICAgICB9ID0ge30pIHtcbiAgICAgICAgY2FjaGVkTm9kZSA9IGVsO1xuICAgICAgICAvKiBlc2xpbnQgY29uc2lzdGVudC1yZXR1cm46IDAgKi9cbiAgICAgICAgaWYgKHR5cGVvZiBlbC50eXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGlzRE9NID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0NvbnRleHRQcm92aWRlcihlbCkpIHtcbiAgICAgICAgICBwcm92aWRlclZhbHVlcy5zZXQoZWwudHlwZSwgZWwucHJvcHMudmFsdWUpO1xuICAgICAgICAgIGNvbnN0IE1vY2tQcm92aWRlciA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgICAocHJvcHMpID0+IHByb3BzLmNoaWxkcmVuLFxuICAgICAgICAgICAgZWwudHlwZSxcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybiB3aXRoU2V0U3RhdGVBbGxvd2VkKCgpID0+IHJlbmRlckVsZW1lbnQoeyAuLi5lbCwgdHlwZTogTW9ja1Byb3ZpZGVyIH0pKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0NvbnRleHRDb25zdW1lcihlbCkpIHtcbiAgICAgICAgICBjb25zdCBQcm92aWRlciA9IGFkYXB0ZXIuZ2V0UHJvdmlkZXJGcm9tQ29uc3VtZXIoZWwudHlwZSk7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBwcm92aWRlclZhbHVlcy5oYXMoUHJvdmlkZXIpXG4gICAgICAgICAgICA/IHByb3ZpZGVyVmFsdWVzLmdldChQcm92aWRlcilcbiAgICAgICAgICAgIDogZ2V0UHJvdmlkZXJEZWZhdWx0VmFsdWUoUHJvdmlkZXIpO1xuICAgICAgICAgIGNvbnN0IE1vY2tDb25zdW1lciA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgICAocHJvcHMpID0+IHByb3BzLmNoaWxkcmVuKHZhbHVlKSxcbiAgICAgICAgICAgIGVsLnR5cGUsXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm4gd2l0aFNldFN0YXRlQWxsb3dlZCgoKSA9PiByZW5kZXJFbGVtZW50KHsgLi4uZWwsIHR5cGU6IE1vY2tDb25zdW1lciB9KSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXNET00gPSBmYWxzZTtcbiAgICAgICAgICBsZXQgcmVuZGVyZWRFbCA9IGVsO1xuICAgICAgICAgIGlmIChpc0xhenkocmVuZGVyZWRFbCkpIHtcbiAgICAgICAgICAgIHRocm93IFR5cGVFcnJvcignYFJlYWN0LmxhenlgIGlzIG5vdCBzdXBwb3J0ZWQgYnkgc2hhbGxvdyByZW5kZXJpbmcuJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVuZGVyZWRFbCA9IHRyYW5zZm9ybVN1c3BlbnNlKHJlbmRlcmVkRWwsIHJlbmRlcmVkRWwsIHsgc3VzcGVuc2VGYWxsYmFjayB9KTtcbiAgICAgICAgICBjb25zdCB7IHR5cGU6IENvbXBvbmVudCB9ID0gcmVuZGVyZWRFbDtcblxuICAgICAgICAgIGNvbnN0IGNvbnRleHQgPSBnZXRNYXNrZWRDb250ZXh0KENvbXBvbmVudC5jb250ZXh0VHlwZXMsIHVubWFza2VkQ29udGV4dCk7XG5cbiAgICAgICAgICBpZiAoaXNNZW1vKGVsLnR5cGUpKSB7XG4gICAgICAgICAgICBjb25zdCB7IHR5cGU6IElubmVyQ29tcCwgY29tcGFyZSB9ID0gZWwudHlwZTtcblxuICAgICAgICAgICAgcmV0dXJuIHdpdGhTZXRTdGF0ZUFsbG93ZWQoKCkgPT4gcmVuZGVyRWxlbWVudChcbiAgICAgICAgICAgICAgeyAuLi5lbCwgdHlwZTogd3JhcFB1cmVDb21wb25lbnQoSW5uZXJDb21wLCBjb21wYXJlKSB9LFxuICAgICAgICAgICAgICBjb250ZXh0LFxuICAgICAgICAgICAgKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFpc1N0YXRlZnVsKENvbXBvbmVudCkgJiYgdHlwZW9mIENvbXBvbmVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIHdpdGhTZXRTdGF0ZUFsbG93ZWQoKCkgPT4gcmVuZGVyRWxlbWVudChcbiAgICAgICAgICAgICAgeyAuLi5yZW5kZXJlZEVsLCB0eXBlOiB3cmFwRnVuY3Rpb25hbENvbXBvbmVudChDb21wb25lbnQpIH0sXG4gICAgICAgICAgICAgIGNvbnRleHQsXG4gICAgICAgICAgICApKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaXNTdGF0ZWZ1bCkge1xuICAgICAgICAgICAgLy8gZml4IHJlYWN0IGJ1Zzsgc2VlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRFbXB0eVN0YXRlVmFsdWVgXG4gICAgICAgICAgICBjb25zdCBlbXB0eVN0YXRlVmFsdWUgPSBnZXRFbXB0eVN0YXRlVmFsdWUoKTtcbiAgICAgICAgICAgIGlmIChlbXB0eVN0YXRlVmFsdWUpIHtcbiAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENvbXBvbmVudC5wcm90b3R5cGUsICdzdGF0ZScsIHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSBlbXB0eVN0YXRlVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdzdGF0ZScsIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHdpdGhTZXRTdGF0ZUFsbG93ZWQoKCkgPT4gcmVuZGVyRWxlbWVudChyZW5kZXJlZEVsLCBjb250ZXh0KSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB1bm1vdW50KCkge1xuICAgICAgICByZW5kZXJlci51bm1vdW50KCk7XG4gICAgICB9LFxuICAgICAgZ2V0Tm9kZSgpIHtcbiAgICAgICAgaWYgKGlzRE9NKSB7XG4gICAgICAgICAgcmV0dXJuIGVsZW1lbnRUb1RyZWUoY2FjaGVkTm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gcmVuZGVyZXIuZ2V0UmVuZGVyT3V0cHV0KCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbm9kZVR5cGU6IG5vZGVUeXBlRnJvbVR5cGUoY2FjaGVkTm9kZS50eXBlKSxcbiAgICAgICAgICB0eXBlOiBjYWNoZWROb2RlLnR5cGUsXG4gICAgICAgICAgcHJvcHM6IGNhY2hlZE5vZGUucHJvcHMsXG4gICAgICAgICAga2V5OiBlbnN1cmVLZXlPclVuZGVmaW5lZChjYWNoZWROb2RlLmtleSksXG4gICAgICAgICAgcmVmOiBjYWNoZWROb2RlLnJlZixcbiAgICAgICAgICBpbnN0YW5jZTogcmVuZGVyZXIuX2luc3RhbmNlLFxuICAgICAgICAgIHJlbmRlcmVkOiBBcnJheS5pc0FycmF5KG91dHB1dClcbiAgICAgICAgICAgID8gZmxhdHRlbihvdXRwdXQpLm1hcCgoZWwpID0+IGVsZW1lbnRUb1RyZWUoZWwpKVxuICAgICAgICAgICAgOiBlbGVtZW50VG9UcmVlKG91dHB1dCksXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgc2ltdWxhdGVFcnJvcihub2RlSGllcmFyY2h5LCByb290Tm9kZSwgZXJyb3IpIHtcbiAgICAgICAgc2ltdWxhdGVFcnJvcihcbiAgICAgICAgICBlcnJvcixcbiAgICAgICAgICByZW5kZXJlci5faW5zdGFuY2UsXG4gICAgICAgICAgY2FjaGVkTm9kZSxcbiAgICAgICAgICBub2RlSGllcmFyY2h5LmNvbmNhdChjYWNoZWROb2RlKSxcbiAgICAgICAgICBub2RlVHlwZUZyb21UeXBlLFxuICAgICAgICAgIGFkYXB0ZXIuZGlzcGxheU5hbWVPZk5vZGUsXG4gICAgICAgICAgaXMxNjYgPyBjYWNoZWROb2RlLnR5cGUgOiB1bmRlZmluZWQsXG4gICAgICAgICk7XG4gICAgICB9LFxuICAgICAgc2ltdWxhdGVFdmVudChub2RlLCBldmVudCwgLi4uYXJncykge1xuICAgICAgICBjb25zdCBoYW5kbGVyID0gbm9kZS5wcm9wc1twcm9wRnJvbUV2ZW50KGV2ZW50LCBldmVudE9wdGlvbnMpXTtcbiAgICAgICAgaWYgKGhhbmRsZXIpIHtcbiAgICAgICAgICB3aXRoU2V0U3RhdGVBbGxvd2VkKCgpID0+IHtcbiAgICAgICAgICAgIC8vIFRPRE8obG1yKTogY3JlYXRlL3VzZSBzeW50aGV0aWMgZXZlbnRzXG4gICAgICAgICAgICAvLyBUT0RPKGxtcik6IGVtdWxhdGUgUmVhY3QncyBldmVudCBwcm9wYWdhdGlvblxuICAgICAgICAgICAgLy8gUmVhY3RET00udW5zdGFibGVfYmF0Y2hlZFVwZGF0ZXMoKCkgPT4ge1xuICAgICAgICAgICAgaGFuZGxlciguLi5hcmdzKTtcbiAgICAgICAgICAgIC8vIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYmF0Y2hlZFVwZGF0ZXMoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZuKCk7XG4gICAgICAgIC8vIHJldHVybiBSZWFjdERPTS51bnN0YWJsZV9iYXRjaGVkVXBkYXRlcyhmbik7XG4gICAgICB9LFxuICAgICAgY2hlY2tQcm9wVHlwZXModHlwZVNwZWNzLCB2YWx1ZXMsIGxvY2F0aW9uLCBoaWVyYXJjaHkpIHtcbiAgICAgICAgcmV0dXJuIGNoZWNrUHJvcFR5cGVzKFxuICAgICAgICAgIHR5cGVTcGVjcyxcbiAgICAgICAgICB2YWx1ZXMsXG4gICAgICAgICAgbG9jYXRpb24sXG4gICAgICAgICAgZGlzcGxheU5hbWVPZk5vZGUoY2FjaGVkTm9kZSksXG4gICAgICAgICAgKCkgPT4gZ2V0Q29tcG9uZW50U3RhY2soaGllcmFyY2h5LmNvbmNhdChbY2FjaGVkTm9kZV0pKSxcbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZVN0cmluZ1JlbmRlcmVyKG9wdGlvbnMpIHtcbiAgICBpZiAoaGFzKG9wdGlvbnMsICdzdXNwZW5zZUZhbGxiYWNrJykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2BzdXNwZW5zZUZhbGxiYWNrYCBzaG91bGQgbm90IGJlIHNwZWNpZmllZCBpbiBvcHRpb25zIG9mIHN0cmluZyByZW5kZXJlcicpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgcmVuZGVyKGVsLCBjb250ZXh0KSB7XG4gICAgICAgIGlmIChvcHRpb25zLmNvbnRleHQgJiYgKGVsLnR5cGUuY29udGV4dFR5cGVzIHx8IG9wdGlvbnMuY2hpbGRDb250ZXh0VHlwZXMpKSB7XG4gICAgICAgICAgY29uc3QgY2hpbGRDb250ZXh0VHlwZXMgPSB7XG4gICAgICAgICAgICAuLi4oZWwudHlwZS5jb250ZXh0VHlwZXMgfHwge30pLFxuICAgICAgICAgICAgLi4ub3B0aW9ucy5jaGlsZENvbnRleHRUeXBlcyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGNvbnN0IENvbnRleHRXcmFwcGVyID0gY3JlYXRlUmVuZGVyV3JhcHBlcihlbCwgY29udGV4dCwgY2hpbGRDb250ZXh0VHlwZXMpO1xuICAgICAgICAgIHJldHVybiBSZWFjdERPTVNlcnZlci5yZW5kZXJUb1N0YXRpY01hcmt1cChSZWFjdC5jcmVhdGVFbGVtZW50KENvbnRleHRXcmFwcGVyKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFJlYWN0RE9NU2VydmVyLnJlbmRlclRvU3RhdGljTWFya3VwKGVsKTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIC8vIFByb3ZpZGVkIGEgYmFnIG9mIG9wdGlvbnMsIHJldHVybiBhbiBgRW56eW1lUmVuZGVyZXJgLiBTb21lIG9wdGlvbnMgY2FuIGJlIGltcGxlbWVudGF0aW9uXG4gIC8vIHNwZWNpZmljLCBsaWtlIGBhdHRhY2hgIGV0Yy4gZm9yIFJlYWN0LCBidXQgbm90IHBhcnQgb2YgdGhpcyBpbnRlcmZhY2UgZXhwbGljaXRseS5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXNcbiAgY3JlYXRlUmVuZGVyZXIob3B0aW9ucykge1xuICAgIHN3aXRjaCAob3B0aW9ucy5tb2RlKSB7XG4gICAgICBjYXNlIEVuenltZUFkYXB0ZXIuTU9ERVMuTU9VTlQ6IHJldHVybiB0aGlzLmNyZWF0ZU1vdW50UmVuZGVyZXIob3B0aW9ucyk7XG4gICAgICBjYXNlIEVuenltZUFkYXB0ZXIuTU9ERVMuU0hBTExPVzogcmV0dXJuIHRoaXMuY3JlYXRlU2hhbGxvd1JlbmRlcmVyKG9wdGlvbnMpO1xuICAgICAgY2FzZSBFbnp5bWVBZGFwdGVyLk1PREVTLlNUUklORzogcmV0dXJuIHRoaXMuY3JlYXRlU3RyaW5nUmVuZGVyZXIob3B0aW9ucyk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVuenltZSBJbnRlcm5hbCBFcnJvcjogVW5yZWNvZ25pemVkIG1vZGU6ICR7b3B0aW9ucy5tb2RlfWApO1xuICAgIH1cbiAgfVxuXG4gIHdyYXAoZWxlbWVudCkge1xuICAgIHJldHVybiB3cmFwKGVsZW1lbnQpO1xuICB9XG5cbiAgLy8gY29udmVydHMgYW4gUlNUTm9kZSB0byB0aGUgY29ycmVzcG9uZGluZyBKU1ggUHJhZ21hIEVsZW1lbnQuIFRoaXMgd2lsbCBiZSBuZWVkZWRcbiAgLy8gaW4gb3JkZXIgdG8gaW1wbGVtZW50IHRoZSBgV3JhcHBlci5tb3VudCgpYCBhbmQgYFdyYXBwZXIuc2hhbGxvdygpYCBtZXRob2RzLCBidXQgc2hvdWxkXG4gIC8vIGJlIHByZXR0eSBzdHJhaWdodGZvcndhcmQgZm9yIHBlb3BsZSB0byBpbXBsZW1lbnQuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzXG4gIG5vZGVUb0VsZW1lbnQobm9kZSkge1xuICAgIGlmICghbm9kZSB8fCB0eXBlb2Ygbm9kZSAhPT0gJ29iamVjdCcpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHsgdHlwZSB9ID0gbm9kZTtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudCh1bm1lbW9UeXBlKHR5cGUpLCBwcm9wc1dpdGhLZXlzQW5kUmVmKG5vZGUpKTtcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzXG4gIG1hdGNoZXNFbGVtZW50VHlwZShub2RlLCBtYXRjaGluZ1R5cGUpIHtcbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgICBjb25zdCB7IHR5cGUgfSA9IG5vZGU7XG4gICAgcmV0dXJuIHVubWVtb1R5cGUodHlwZSkgPT09IHVubWVtb1R5cGUobWF0Y2hpbmdUeXBlKTtcbiAgfVxuXG4gIGVsZW1lbnRUb05vZGUoZWxlbWVudCkge1xuICAgIHJldHVybiBlbGVtZW50VG9UcmVlKGVsZW1lbnQpO1xuICB9XG5cbiAgbm9kZVRvSG9zdE5vZGUobm9kZSwgc3VwcG9ydHNBcnJheSA9IGZhbHNlKSB7XG4gICAgY29uc3Qgbm9kZXMgPSBub2RlVG9Ib3N0Tm9kZShub2RlKTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShub2RlcykgJiYgIXN1cHBvcnRzQXJyYXkpIHtcbiAgICAgIHJldHVybiBub2Rlc1swXTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGVzO1xuICB9XG5cbiAgZGlzcGxheU5hbWVPZk5vZGUobm9kZSkge1xuICAgIGlmICghbm9kZSkgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgeyB0eXBlLCAkJHR5cGVvZiB9ID0gbm9kZTtcblxuICAgIGNvbnN0IG5vZGVUeXBlID0gdHlwZSB8fCAkJHR5cGVvZjtcblxuICAgIC8vIG5ld2VyIG5vZGUgdHlwZXMgbWF5IGJlIHVuZGVmaW5lZCwgc28gb25seSB0ZXN0IGlmIHRoZSBub2RlVHlwZSBleGlzdHNcbiAgICBpZiAobm9kZVR5cGUpIHtcbiAgICAgIHN3aXRjaCAobm9kZVR5cGUpIHtcbiAgICAgICAgY2FzZSAoaXMxNjYgPyBDb25jdXJyZW50TW9kZSA6IEFzeW5jTW9kZSkgfHwgTmFOOiByZXR1cm4gaXMxNjYgPyAnQ29uY3VycmVudE1vZGUnIDogJ0FzeW5jTW9kZSc7XG4gICAgICAgIGNhc2UgRnJhZ21lbnQgfHwgTmFOOiByZXR1cm4gJ0ZyYWdtZW50JztcbiAgICAgICAgY2FzZSBTdHJpY3RNb2RlIHx8IE5hTjogcmV0dXJuICdTdHJpY3RNb2RlJztcbiAgICAgICAgY2FzZSBQcm9maWxlciB8fCBOYU46IHJldHVybiAnUHJvZmlsZXInO1xuICAgICAgICBjYXNlIFBvcnRhbCB8fCBOYU46IHJldHVybiAnUG9ydGFsJztcbiAgICAgICAgY2FzZSBTdXNwZW5zZSB8fCBOYU46IHJldHVybiAnU3VzcGVuc2UnO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0ICQkdHlwZW9mVHlwZSA9IHR5cGUgJiYgdHlwZS4kJHR5cGVvZjtcblxuICAgIHN3aXRjaCAoJCR0eXBlb2ZUeXBlKSB7XG4gICAgICBjYXNlIENvbnRleHRDb25zdW1lciB8fCBOYU46IHJldHVybiAnQ29udGV4dENvbnN1bWVyJztcbiAgICAgIGNhc2UgQ29udGV4dFByb3ZpZGVyIHx8IE5hTjogcmV0dXJuICdDb250ZXh0UHJvdmlkZXInO1xuICAgICAgY2FzZSBNZW1vIHx8IE5hTjoge1xuICAgICAgICBjb25zdCBub2RlTmFtZSA9IGRpc3BsYXlOYW1lT2ZOb2RlKG5vZGUpO1xuICAgICAgICByZXR1cm4gdHlwZW9mIG5vZGVOYW1lID09PSAnc3RyaW5nJyA/IG5vZGVOYW1lIDogYE1lbW8oJHtkaXNwbGF5TmFtZU9mTm9kZSh0eXBlKX0pYDtcbiAgICAgIH1cbiAgICAgIGNhc2UgRm9yd2FyZFJlZiB8fCBOYU46IHtcbiAgICAgICAgaWYgKHR5cGUuZGlzcGxheU5hbWUpIHtcbiAgICAgICAgICByZXR1cm4gdHlwZS5kaXNwbGF5TmFtZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuYW1lID0gZGlzcGxheU5hbWVPZk5vZGUoeyB0eXBlOiB0eXBlLnJlbmRlciB9KTtcbiAgICAgICAgcmV0dXJuIG5hbWUgPyBgRm9yd2FyZFJlZigke25hbWV9KWAgOiAnRm9yd2FyZFJlZic7XG4gICAgICB9XG4gICAgICBjYXNlIExhenkgfHwgTmFOOiB7XG4gICAgICAgIHJldHVybiAnbGF6eSc7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OiByZXR1cm4gZGlzcGxheU5hbWVPZk5vZGUobm9kZSk7XG4gICAgfVxuICB9XG5cbiAgaXNWYWxpZEVsZW1lbnQoZWxlbWVudCkge1xuICAgIHJldHVybiBpc0VsZW1lbnQoZWxlbWVudCk7XG4gIH1cblxuICBpc1ZhbGlkRWxlbWVudFR5cGUob2JqZWN0KSB7XG4gICAgcmV0dXJuICEhb2JqZWN0ICYmIGlzVmFsaWRFbGVtZW50VHlwZShvYmplY3QpO1xuICB9XG5cbiAgaXNGcmFnbWVudChmcmFnbWVudCkge1xuICAgIHJldHVybiB0eXBlT2ZOb2RlKGZyYWdtZW50KSA9PT0gRnJhZ21lbnQ7XG4gIH1cblxuICBpc0N1c3RvbUNvbXBvbmVudCh0eXBlKSB7XG4gICAgY29uc3QgZmFrZUVsZW1lbnQgPSBtYWtlRmFrZUVsZW1lbnQodHlwZSk7XG4gICAgcmV0dXJuICEhdHlwZSAmJiAoXG4gICAgICB0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgfHwgaXNGb3J3YXJkUmVmKGZha2VFbGVtZW50KVxuICAgICAgfHwgaXNDb250ZXh0UHJvdmlkZXIoZmFrZUVsZW1lbnQpXG4gICAgICB8fCBpc0NvbnRleHRDb25zdW1lcihmYWtlRWxlbWVudClcbiAgICAgIHx8IGlzU3VzcGVuc2UoZmFrZUVsZW1lbnQpXG4gICAgKTtcbiAgfVxuXG4gIGlzQ29udGV4dENvbnN1bWVyKHR5cGUpIHtcbiAgICByZXR1cm4gISF0eXBlICYmIGlzQ29udGV4dENvbnN1bWVyKG1ha2VGYWtlRWxlbWVudCh0eXBlKSk7XG4gIH1cblxuICBpc0N1c3RvbUNvbXBvbmVudEVsZW1lbnQoaW5zdCkge1xuICAgIGlmICghaW5zdCB8fCAhdGhpcy5pc1ZhbGlkRWxlbWVudChpbnN0KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5pc0N1c3RvbUNvbXBvbmVudChpbnN0LnR5cGUpO1xuICB9XG5cbiAgZ2V0UHJvdmlkZXJGcm9tQ29uc3VtZXIoQ29uc3VtZXIpIHtcbiAgICAvLyBSZWFjdCBzdG9yZXMgcmVmZXJlbmNlcyB0byB0aGUgUHJvdmlkZXIgb24gYSBDb25zdW1lciBkaWZmZXJlbnRseSBhY3Jvc3MgdmVyc2lvbnMuXG4gICAgaWYgKENvbnN1bWVyKSB7XG4gICAgICBsZXQgUHJvdmlkZXI7XG4gICAgICBpZiAoQ29uc3VtZXIuX2NvbnRleHQpIHsgLy8gY2hlY2sgdGhpcyBmaXJzdCwgdG8gYXZvaWQgYSBkZXByZWNhdGlvbiB3YXJuaW5nXG4gICAgICAgICh7IFByb3ZpZGVyIH0gPSBDb25zdW1lci5fY29udGV4dCk7XG4gICAgICB9IGVsc2UgaWYgKENvbnN1bWVyLlByb3ZpZGVyKSB7XG4gICAgICAgICh7IFByb3ZpZGVyIH0gPSBDb25zdW1lcik7XG4gICAgICB9XG4gICAgICBpZiAoUHJvdmlkZXIpIHtcbiAgICAgICAgcmV0dXJuIFByb3ZpZGVyO1xuICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0VuenltZSBJbnRlcm5hbCBFcnJvcjogY2Fu4oCZdCBmaWd1cmUgb3V0IGhvdyB0byBnZXQgUHJvdmlkZXIgZnJvbSBDb25zdW1lcicpO1xuICB9XG5cbiAgY3JlYXRlRWxlbWVudCguLi5hcmdzKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoLi4uYXJncyk7XG4gIH1cblxuICB3cmFwV2l0aFdyYXBwaW5nQ29tcG9uZW50KG5vZGUsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgUm9vdEZpbmRlcixcbiAgICAgIG5vZGU6IHdyYXBXaXRoV3JhcHBpbmdDb21wb25lbnQoUmVhY3QuY3JlYXRlRWxlbWVudCwgbm9kZSwgb3B0aW9ucyksXG4gICAgfTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0U2l4dGVlbkFkYXB0ZXI7XG4iXX0=
//# sourceMappingURL=ReactSixteenAdapter.js.map