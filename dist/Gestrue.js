(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Gestrue"] = factory();
	else
		root["Gestrue"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @author LYZ .
 */


/**
 * @desc 找到两个结点共同的最小根结点
 * 如果跟结点不存在，则返回null
 *
 * @param  {Element} el1 第一个结点
 * @param  {Element} el2 第二个结点
 * @return {Element}     根结点
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getCommonAncestor(el1, el2) {
    var el = el1;
    while (el) {
        if (el.contains(el2) || el === el2) {
            return el;
        }
        el = el.parentNode;
    }
    return null;
}

/**
 * 计算变换效果
 * 假设坐标系上有4个点ABCD
 * > 旋转：从AB旋转到CD的角度
 * > 缩放：从AB长度变换到CD长度的比例
 * > 位移：从A点位移到C点的横纵位移
 *
 * @param  {number} x1 上述第1个点的横坐标
 * @param  {number} y1 上述第1个点的纵坐标
 * @param  {number} x2 上述第2个点的横坐标
 * @param  {number} y2 上述第2个点的纵坐标
 * @param  {number} x3 上述第3个点的横坐标
 * @param  {number} y3 上述第3个点的纵坐标
 * @param  {number} x4 上述第4个点的横坐标
 * @param  {number} y4 上述第4个点的纵坐标
 * @return {object}    变换效果，形如{rotate, scale, translate[2], matrix[3][3]}
 */
function calc(x1, y1, x2, y2, x3, y3, x4, y4) {
    var rotate = Math.atan2(y4 - y3, x4 - x3) - Math.atan2(y2 - y1, x2 - x1);
    var scale = Math.sqrt((Math.pow(y4 - y3, 2) + Math.pow(x4 - x3, 2)) / (Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2)));
    var translate = [x3 - scale * x1 * Math.cos(rotate) + scale * y1 * Math.sin(rotate), y3 - scale * y1 * Math.cos(rotate) - scale * x1 * Math.sin(rotate)];

    return {
        rotate: rotate,
        scale: scale,
        translate: translate,
        matrix: [[scale * Math.cos(rotate), -scale * Math.sin(rotate), translate[0]], [scale * Math.sin(rotate), scale * Math.cos(rotate), translate[1]], [0, 0, 1]]
    };
}

var Gesture = function () {
    function Gesture(container) {
        var _this = this;

        var eventList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [
        // 轻击事件
        'tap',
        // 快速双击
        'doubletap',
        // panstart
        'panstart',
        // 开始水平平移
        'horizontalpanstart',
        // 开始垂直平移
        'verticalpanstart',
        // 平移中
        'pan',
        // 水平平移中
        'horizontalpan',
        // 垂直平移中
        'verticalpan',
        // 平移结束
        'panend',
        // 轻弹
        'flick',
        // 水平轻弹
        'horizontalflick',
        // 垂直轻弹
        'verticalflick',
        // 长按
        'press',
        // 长按结束
        'pressend'];

        _classCallCheck(this, Gesture);

        this.gestures = {};
        this.lastTap = null;

        this.touchstartHandler = function (event) {
            // event.preventDefault()
            // event.stopPropagation()
            if (Object.keys(_this.gestures).length === 0) {
                _this.addEvent();
            }

            // 记录每一个点

            var _loop = function _loop(i, l) {
                var touch = event.changedTouches[i];
                var touchRecord = {};

                for (var _p in touch) {
                    touchRecord[_p] = touch[_p];
                }
                var self = _this;
                var gesture = {
                    startTouch: touchRecord,
                    startTime: Date.now(),
                    status: 'tapping',
                    element: event.srcElement || event.target,
                    pressingHandler: setTimeout(function (element) {
                        return function () {
                            if (gesture.status === 'tapping') {
                                gesture.status = 'pressing';

                                self.fireEvent(element, 'press', {
                                    touchEvent: event
                                });
                            }

                            clearTimeout(gesture.pressingHandler);
                            gesture.pressingHandler = null;
                        };
                    }(event.srcElement || event.target), 500)
                };
                _this.gestures[touch.identifier] = gesture;
            };

            for (var i = 0, l = event.changedTouches.length; i < l; i++) {
                _loop(i, l);
            }

            if (Object.keys(_this.gestures).length === 2) {
                var elements = [];

                for (var p in _this.gestures) {
                    elements.push(_this.gestures[p].element);
                }

                _this.fireEvent(getCommonAncestor(elements[0], elements[1]), 'dualtouchstart', {
                    touches: [].concat(_toConsumableArray(event.touches)),
                    touchEvent: event
                });
            }
        };

        this.touchmoveHandler = function (event) {
            // event.preventDefault()
            // 遍历每个触点:
            // 1.如果触点之前处于tapping状态,且位移超过10像素,则认为进入panning状态
            // 先触发panstart手势，然后根据移动的方向选择性触发horizontalpanstart或verticalpanstart手势
            // 2. 如果触点之前处于panning状态，则根据pan的初始方向触发horizontalpan或verticalpan手势
            for (var i = 0, l = event.changedTouches.length; i < l; i++) {
                var _touch = event.changedTouches[i];
                var _gesture = _this.gestures[_touch.identifier];

                if (!_gesture) {
                    return;
                }

                if (!_gesture.lastTouch) {
                    _gesture.lastTouch = _gesture.startTouch;
                }
                if (!_gesture.lastTime) {
                    _gesture.lastTime = _gesture.startTime;
                }
                if (!_gesture.velocityX) {
                    _gesture.velocityX = 0;
                }
                if (!_gesture.velocityY) {
                    _gesture.velocityY = 0;
                }
                if (!_gesture.duration) {
                    _gesture.duration = 0;
                }

                var time = Date.now() - _gesture.lastTime;
                var vx = (_touch.clientX - _gesture.lastTouch.clientX) / time;
                var vy = (_touch.clientY - _gesture.lastTouch.clientY) / time;

                // 涉及大量计算,所以记录时间为70毫秒/次
                var RECORD_DURATION = 70;
                if (time > RECORD_DURATION) {
                    time = RECORD_DURATION;
                }
                if (_gesture.duration + time > RECORD_DURATION) {
                    _gesture.duration = RECORD_DURATION - time;
                }

                _gesture.velocityX = (_gesture.velocityX * _gesture.duration + vx * time) / (_gesture.duration + time);
                _gesture.velocityY = (_gesture.velocityY * _gesture.duration + vy * time) / (_gesture.duration + time);
                _gesture.duration += time;

                _gesture.lastTouch = {};

                for (var p in _touch) {
                    _gesture.lastTouch[p] = _touch[p];
                }
                _gesture.lastTime = Date.now();

                var displacementX = _touch.clientX - _gesture.startTouch.clientX;
                var displacementY = _touch.clientY - _gesture.startTouch.clientY;
                var distance = Math.sqrt(Math.pow(displacementX, 2) + Math.pow(displacementY, 2));

                // 如果位移超过10px则认为是移动了
                if ((_gesture.status === 'tapping' || _gesture.status === 'pressing') && distance > 10) {
                    _gesture.status = 'panning';
                    _gesture.isVertical = !(Math.abs(displacementX) > Math.abs(displacementY));
                    // 判断具体方向
                    _gesture.isLeft = displacementX < 0;
                    _gesture.isTop = displacementY < 0;

                    _this.fireEvent(_gesture.element, 'panstart', {
                        touch: _touch,
                        touchEvent: event,
                        isVertical: _gesture.isVertical,
                        isLeft: _gesture.isLeft,
                        isTop: _gesture.isTop
                    });

                    _this.fireEvent(_gesture.element, (_gesture.isVertical ? 'vertical' : 'horizontal') + 'panstart', {
                        touch: _touch,
                        touchEvent: event
                    });
                }

                // 说明,关于手势是水平还是垂直,这点计算方式存在争议,目前采用的方式滑动前10像素的行为来决定,并在之后的过程中不在做改变
                // PS,上面的注释白话是,不管SB用户怎么滑动,我只通过滑动的前10像素来判断用户的行为.
                // 这已经能满足通常要求了,如果有特殊要求,请自行计算pan事件中的{displacementX, displacementY}
                if (_gesture.status === 'panning') {
                    _gesture.panTime = Date.now();
                    _this.fireEvent(_gesture.element, 'pan', {
                        displacementX: displacementX,
                        displacementY: displacementY,
                        touch: _touch,
                        touchEvent: event,
                        isVertical: _gesture.isVertical,
                        isLeft: _gesture.isLeft,
                        isTop: _gesture.isTop
                    });

                    if (_gesture.isVertical) {
                        _this.fireEvent(_gesture.element, 'verticalpan', {
                            displacementY: displacementY,
                            touch: _touch,
                            touchEvent: event
                        });
                    } else {
                        _this.fireEvent(_gesture.element, 'horizontalpan', {
                            displacementX: displacementX,
                            touch: _touch,
                            touchEvent: event
                        });
                    }
                }
            }

            if (Object.keys(_this.gestures).length === 2) {
                var position = [];
                var current = [];
                var elements = [];
                var transform = void 0;

                for (var _i = 0, _l = event.touches.length; _i < _l; _i++) {
                    var _touch2 = event.touches[_i];
                    var _gesture2 = _this.gestures[_touch2.identifier];
                    position.push([_gesture2.startTouch.clientX, _gesture2.startTouch.clientY]);
                    current.push([_touch2.clientX, _touch2.clientY]);
                }

                for (var _p2 in _this.gestures) {
                    elements.push(_this.gestures[_p2].element);
                }

                transform = calc(position[0][0], position[0][1], position[1][0], position[1][1], current[0][0], current[0][1], current[1][0], current[1][1]);

                _this.fireEvent(getCommonAncestor(elements[0], elements[1]), 'dualtouch', {
                    transform: transform,
                    touches: event.touches,
                    touchEvent: event
                });
            }
        };

        this.touchendHandler = function (event) {
            if (Object.keys(_this.gestures).length === 2) {
                var elements = [];
                for (var p in _this.gestures) {
                    elements.push(_this.gestures[p].element);
                }
                _this.fireEvent(getCommonAncestor(elements[0], elements[1]), 'dualtouchend', {
                    touches: [].concat(_toConsumableArray(event.touches)),
                    touchEvent: event
                });
            }

            for (var i = 0, l = event.changedTouches.length; i < l; i++) {
                var _touch3 = event.changedTouches[i];
                var id = _touch3.identifier;
                var _gesture3 = _this.gestures[id];

                if (!_gesture3) {
                    continue;
                }

                if (_gesture3.pressingHandler) {
                    clearTimeout(_gesture3.pressingHandler);
                    _gesture3.pressingHandler = null;
                }

                if (_gesture3.status === 'tapping') {
                    _gesture3.timestamp = Date.now();
                    _this.fireEvent(_gesture3.element, 'tap', {
                        touch: _touch3,
                        touchEvent: event
                    });

                    if (_this.lastTap && _gesture3.timestamp - _this.lastTap.timestamp < 300) {
                        _this.fireEvent(_gesture3.element, 'doubletap', {
                            touch: _touch3,
                            touchEvent: event
                        });
                    }

                    _this.lastTap = _gesture3;
                }

                if (_gesture3.status === 'panning') {
                    var now = Date.now();
                    var duration = now - _gesture3.startTime;
                    // let velocityX = (touch.clientX - gesture.startTouch.clientX) / duration
                    // let velocityY = (touch.clientY - gesture.startTouch.clientY) / duration
                    var displacementX = _touch3.clientX - _gesture3.startTouch.clientX;
                    var displacementY = _touch3.clientY - _gesture3.startTouch.clientY;

                    var velocity = Math.sqrt(_gesture3.velocityY * _gesture3.velocityY + _gesture3.velocityX * _gesture3.velocityX);
                    var isflick = velocity > 0.5 && now - _gesture3.lastTime < 100;
                    var extra = {
                        duration: duration,
                        isflick: isflick,
                        displacementX: displacementX,
                        displacementY: displacementY,
                        touch: _touch3,
                        velocityX: _gesture3.velocityX,
                        velocityY: _gesture3.velocityY,
                        touchEvent: event,
                        isVertical: _gesture3.isVertical,
                        isLeft: _gesture3.isLeft,
                        isTop: _gesture3.isTop
                    };

                    _this.fireEvent(_gesture3.element, 'panend', extra);
                    if (isflick) {
                        _this.fireEvent(_gesture3.element, 'flick', extra);
                        if (_gesture3.isVertical) {
                            _this.fireEvent(_gesture3.element, 'verticalflick', extra);
                        } else {
                            _this.fireEvent(_gesture3.element, 'horizontalflick', extra);
                        }
                    }
                }

                if (_gesture3.status === 'pressing') {
                    _this.fireEvent(_gesture3.element, 'pressend', {
                        touch: _touch3,
                        touchEvent: event
                    });
                }

                delete _this.gestures[id];
            }

            if (Object.keys(_this.gestures).length === 0) {
                _this.removeEvent();
            }
        };

        this.container = document.querySelector(container);
        if (!this.container) {
            return;
        }
        this.evnetList = eventList;
        this.container.addEventListener('touchstart', this.touchstartHandler, false);
    }

    _createClass(Gesture, [{
        key: 'destory',
        value: function destory() {
            this.removeEvent();
            this.container.removeEventListener('touchstart', this.touchstartHandler, false);
        }
    }, {
        key: 'removeEvent',
        value: function removeEvent() {
            this.container.removeEventListener('touchmove', this.touchmoveHandler, false);
            this.container.removeEventListener('touchend', this.touchendHandler, false);
            this.container.removeEventListener('touchcancel', this.touchendHandler, false);
        }
    }, {
        key: 'addEvent',
        value: function addEvent() {
            this.container.addEventListener('touchmove', this.touchmoveHandler, false);
            this.container.addEventListener('touchend', this.touchendHandler, false);
            this.container.addEventListener('touchcancel', this.touchendHandler, false);
        }

        /**
         * @desc 触发一个时间
         *
         * @param  {Element} element 目标结点
         * @param  {string}  type    事件类型
         * @param  {object}  extra   对事件对象的扩展
         */

    }, {
        key: 'fireEvent',
        value: function fireEvent(element, type, extra) {
            if (!element || this.evnetList.indexOf(type) === -1) {
                return;
            }

            var event = document.createEvent('HTMLEvents');
            event.initEvent(type, true, true);

            if ((typeof extra === 'undefined' ? 'undefined' : _typeof(extra)) === 'object') {
                for (var p in extra) {
                    event[p] = extra[p];
                }
            }

            element.dispatchEvent(event);
        }
    }]);

    return Gesture;
}();

module.exports = Gesture;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
});