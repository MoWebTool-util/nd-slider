// instrument by jscoverage, do not modifly this file
(function () {
  var BASE;
  if (typeof global === 'object') {
    BASE = global;
  } else if (typeof window === 'object') {
    BASE = window;
  } else {
    throw new Error('[jscoverage] unknow ENV!');
  }
  if (!BASE._$jscoverage) {
    BASE._$jscoverage = {};
    BASE._$jscoverage_cond = {};
    BASE._$jscoverage_done = function (file, line, express) {
      if (arguments.length === 2) {
        BASE._$jscoverage[file][line] ++;
      } else {
        BASE._$jscoverage_cond[file][line] ++;
        return express;
      }
    };
    BASE._$jscoverage_init = function (base, file, lines) {
      var tmp = [];
      for (var i = 0; i < lines.length; i ++) {
        tmp[lines[i]] = 0;
      }
      base[file] = tmp;
    };
  }
})();
_$jscoverage_init(_$jscoverage, "E:/codes/nd-slider/index.js",[8,10,11,12,13,21,22,30,31,32,33,34,35,36,37,39,40,41,43,44,46,48,51,53,60,61,65,66,69,70,71,75,76,79,82,83,84,87,88,89,92,95,96,99,100,110,111,113,114,117,118,119,120,124,126,127,130,141,142,144,145,148,150,151,154,155,158,159,161,167,169,170,176,177,186,187,195,196,197,200,208,209,210,213,215,216,219,227,228,230,232,233,236,238,239,242,244,245,248,256,257,258,260,261,263,267]);
_$jscoverage_init(_$jscoverage_cond, "E:/codes/nd-slider/index.js",[65,113,118,144,150,154,196,209,232,238,260]);
_$jscoverage["E:/codes/nd-slider/index.js"].source = ["/**"," * @module nd-slider"," * @author crossjs <liwenfu@crossjs.com> - 2014-11-25 00:00:00"," */","","'use strict';","","var $ = require('jquery');","","var KEY_LEFT  = 37;","var KEY_UP    = 38;","var KEY_RIGHT = 39;","var KEY_DOWN  = 40;","","/**"," * 全屏切换"," * @class"," * @constructor"," * @param  {Object} options 参数配置"," */","var Slider = function(options) {","  return this.init(options);","};","","/**"," * 初始化"," * @param  {Object} options 参数配置"," * @return                  当前实例"," */","Slider.prototype.init = function(options) {","  this.activeClass = options.activeClass;","  this.container = $(options.container);","  this.events = options.events;","  this.paginator = options.paginator;","  this.slides = $(options.slides, this.container);","  this.slideWrap = options.slideWrap;","  this.speed = options.speed || 1000;","","  this.index = 0;","  this.maxIndex = this.slides.length - 1;","  this.height = $(window).height();","","  this._initDomEvents();","  this._initPaginator();","","  this._initEvents();","","  this.ready = true;","","  // 初始化到第一屏","  this._scroll(0, 1);","","  return this;","};","","/**"," * 初始化 DOM 事件绑定"," * @private"," */","Slider.prototype._initDomEvents = function() {","  var self = this,","    resizeTimeout;","","  function resize() {","    if (resizeTimeout) {","      clearTimeout(resizeTimeout);","    }","","    resizeTimeout = setTimeout(function() {","      self.height = $(window).height();","      self._scroll(0, 1);","    }, 50);","  }","","  $(window).on('resize.nd-slider', function() {","    resize();","  });","","  $(document).on({","    // for firefox","    'DOMMouseScroll.nd-slider': function(e) {","      e.preventDefault();","      e.stopPropagation();","      self._scroll(e.originalEvent.detail > 0 ? 1 : -1);","    },","    'mousewheel.nd-slider': function(e) {","      e.preventDefault();","      e.stopPropagation();","      self._scroll(e.originalEvent.wheelDelta < 0 ? 1 : -1);","    },","    'keydown.nd-slider': function(e) {","      switch (e.keyCode) {","        case KEY_UP:","        case KEY_LEFT:","          self._scroll(-1);","          break;","        case KEY_DOWN:","        case KEY_RIGHT:","          self._scroll(1);","          break;","      }","    }","  });","};","","/**"," * 初始化分页符"," * @private"," */","Slider.prototype._initPaginator = function() {","  var self = this;","","  if (!self.paginator) {","    return;","  }","","  self.paginator = $(self.paginator).on('click.nd-slider', function(e) {","    if (e.target.tagName === 'I') {","      self.ready = true;","      self._scroll(+e.target.getAttribute('data-index') - self.index);","    }","  });","","  var i, n = self.maxIndex, html = [];","","  for (i = 0; i <= n; i++) {","    html.push('<i data-index=\"' + i + '\"></i>');","  }","","  self.paginator.html(html.join(''));","};","","/**"," * 滚屏"," * @private"," * @param  {Number} step  移动的页数，负数为向前页移动"," * @param  {Number} speed 动画速度"," * @fires module:nd-slider#animate"," * @fires module:nd-slider#complete"," */","Slider.prototype._scroll = function(step, speed) {","  var self = this;","","  if (!self.ready) {","    return;","  }","","  var toIndex = self.index + step;","","  if (toIndex < 0) {","    return;","  }","","  if (toIndex > self.maxIndex) {","    return;","  }","","  self.prevIndex = self.index;","  self.index = toIndex;","","  self.ready = false;","","  /**","   * 通知动画开始","   * @event module:nd-slider#animate","   */","  self.fire('animate');","","  self.animate(speed || self.speed, function() {","    self.ready = true;","","    /**","     * 通知动画完毕","     * @event module:nd-slider#complete","     */","    self.fire('complete');","    self.paginate();","  });","};","","/**"," * 滚屏动画"," * @param  {Number}   speed    动画速度"," * @param  {Function} callback 动画回调函数"," */","Slider.prototype.animate = function(speed, callback) {","  this.container.stop(true).animate({","    top: '-' + (this.index * this.height) + 'px'","  }, speed, callback);","};","","/**"," * 处理分页符状态"," */","Slider.prototype.paginate = function() {","  if (!this.paginator) {","    return;","  }","","  this.paginator.children().eq(this.index).addClass(this.activeClass)","      .siblings('.' + this.activeClass).removeClass(this.activeClass);","};","","/**"," * 初始化事件订阅"," * @private"," */","Slider.prototype._initEvents = function() {","  if (!this.events) {","    return;","  }","","  var p;","","  for (p in this.events) {","    this.on(p, this.events[p]);","  }","","  this.events = null;","};","","/**"," * 事件触发"," * @param  {String} evt 事件名"," * @return {Boolean}    如果回调列表中至少有一项返回 `false`，返回 `false`"," */","Slider.prototype.fire = function(evt) {","  var result = true;","","  var events = this.__events;","","  if (!events) {","    return result;","  }","","  var list = events[evt];","","  if (!list) {","    return result;","  }","","  var i, n = list.length, args = Array.prototype.slice.call(arguments, 1);","","  for (i = 0; i < n; i++) {","    result = list[i].apply(this, args) !== false && result;","  }","","  return result;","};","","/**"," * 事件订阅"," * @param  {String}   evt  事件名"," * @param  {Function} func 事件回调"," */","Slider.prototype.on = function(evt, func) {","  var events = this.__events || (this.__events = {});","  var list = events[evt];","","  if (list) {","    list.push(func);","  } else {","    events[evt] = [func];","  }","};","","module.exports = Slider;",""];
"use strict";

_$jscoverage_done("E:/codes/nd-slider/index.js", 8);
var $ = require("jquery");

_$jscoverage_done("E:/codes/nd-slider/index.js", 10);
var KEY_LEFT = 37;

_$jscoverage_done("E:/codes/nd-slider/index.js", 11);
var KEY_UP = 38;

_$jscoverage_done("E:/codes/nd-slider/index.js", 12);
var KEY_RIGHT = 39;

_$jscoverage_done("E:/codes/nd-slider/index.js", 13);
var KEY_DOWN = 40;

_$jscoverage_done("E:/codes/nd-slider/index.js", 21);
var Slider = function(options) {
    _$jscoverage_done("E:/codes/nd-slider/index.js", 22);
    return this.init(options);
};

_$jscoverage_done("E:/codes/nd-slider/index.js", 30);
Slider.prototype.init = function(options) {
    _$jscoverage_done("E:/codes/nd-slider/index.js", 31);
    this.activeClass = options.activeClass;
    _$jscoverage_done("E:/codes/nd-slider/index.js", 32);
    this.container = $(options.container);
    _$jscoverage_done("E:/codes/nd-slider/index.js", 33);
    this.events = options.events;
    _$jscoverage_done("E:/codes/nd-slider/index.js", 34);
    this.paginator = options.paginator;
    _$jscoverage_done("E:/codes/nd-slider/index.js", 35);
    this.slides = $(options.slides, this.container);
    _$jscoverage_done("E:/codes/nd-slider/index.js", 36);
    this.slideWrap = options.slideWrap;
    _$jscoverage_done("E:/codes/nd-slider/index.js", 37);
    this.speed = options.speed || 1e3;
    _$jscoverage_done("E:/codes/nd-slider/index.js", 39);
    this.index = 0;
    _$jscoverage_done("E:/codes/nd-slider/index.js", 40);
    this.maxIndex = this.slides.length - 1;
    _$jscoverage_done("E:/codes/nd-slider/index.js", 41);
    this.height = $(window).height();
    _$jscoverage_done("E:/codes/nd-slider/index.js", 43);
    this._initDomEvents();
    _$jscoverage_done("E:/codes/nd-slider/index.js", 44);
    this._initPaginator();
    _$jscoverage_done("E:/codes/nd-slider/index.js", 46);
    this._initEvents();
    _$jscoverage_done("E:/codes/nd-slider/index.js", 48);
    this.ready = true;
    _$jscoverage_done("E:/codes/nd-slider/index.js", 51);
    this._scroll(0, 1);
    _$jscoverage_done("E:/codes/nd-slider/index.js", 53);
    return this;
};

_$jscoverage_done("E:/codes/nd-slider/index.js", 60);
Slider.prototype._initDomEvents = function() {
    _$jscoverage_done("E:/codes/nd-slider/index.js", 61);
    var self = this, resizeTimeout;
    function resize() {
        _$jscoverage_done("E:/codes/nd-slider/index.js", 65);
        if (_$jscoverage_done("E:/codes/nd-slider/index.js", 65, resizeTimeout)) {
            _$jscoverage_done("E:/codes/nd-slider/index.js", 66);
            clearTimeout(resizeTimeout);
        }
        _$jscoverage_done("E:/codes/nd-slider/index.js", 69);
        resizeTimeout = setTimeout(function() {
            _$jscoverage_done("E:/codes/nd-slider/index.js", 70);
            self.height = $(window).height();
            _$jscoverage_done("E:/codes/nd-slider/index.js", 71);
            self._scroll(0, 1);
        }, 50);
    }
    _$jscoverage_done("E:/codes/nd-slider/index.js", 75);
    $(window).on("resize.nd-slider", function() {
        _$jscoverage_done("E:/codes/nd-slider/index.js", 76);
        resize();
    });
    _$jscoverage_done("E:/codes/nd-slider/index.js", 79);
    $(document).on({
        "DOMMouseScroll.nd-slider": function(e) {
            _$jscoverage_done("E:/codes/nd-slider/index.js", 82);
            e.preventDefault();
            _$jscoverage_done("E:/codes/nd-slider/index.js", 83);
            e.stopPropagation();
            _$jscoverage_done("E:/codes/nd-slider/index.js", 84);
            self._scroll(e.originalEvent.detail > 0 ? 1 : -1);
        },
        "mousewheel.nd-slider": function(e) {
            _$jscoverage_done("E:/codes/nd-slider/index.js", 87);
            e.preventDefault();
            _$jscoverage_done("E:/codes/nd-slider/index.js", 88);
            e.stopPropagation();
            _$jscoverage_done("E:/codes/nd-slider/index.js", 89);
            self._scroll(e.originalEvent.wheelDelta < 0 ? 1 : -1);
        },
        "keydown.nd-slider": function(e) {
            _$jscoverage_done("E:/codes/nd-slider/index.js", 92);
            switch (e.keyCode) {
              case KEY_UP:
              case KEY_LEFT:
                _$jscoverage_done("E:/codes/nd-slider/index.js", 95);
                self._scroll(-1);
                _$jscoverage_done("E:/codes/nd-slider/index.js", 96);
                break;
              case KEY_DOWN:
              case KEY_RIGHT:
                _$jscoverage_done("E:/codes/nd-slider/index.js", 99);
                self._scroll(1);
                _$jscoverage_done("E:/codes/nd-slider/index.js", 100);
                break;
            }
        }
    });
};

_$jscoverage_done("E:/codes/nd-slider/index.js", 110);
Slider.prototype._initPaginator = function() {
    _$jscoverage_done("E:/codes/nd-slider/index.js", 111);
    var self = this;
    _$jscoverage_done("E:/codes/nd-slider/index.js", 113);
    if (_$jscoverage_done("E:/codes/nd-slider/index.js", 113, !self.paginator)) {
        _$jscoverage_done("E:/codes/nd-slider/index.js", 114);
        return;
    }
    _$jscoverage_done("E:/codes/nd-slider/index.js", 117);
    self.paginator = $(self.paginator).on("click.nd-slider", function(e) {
        _$jscoverage_done("E:/codes/nd-slider/index.js", 118);
        if (_$jscoverage_done("E:/codes/nd-slider/index.js", 118, e.target.tagName === "I")) {
            _$jscoverage_done("E:/codes/nd-slider/index.js", 119);
            self.ready = true;
            _$jscoverage_done("E:/codes/nd-slider/index.js", 120);
            self._scroll(+e.target.getAttribute("data-index") - self.index);
        }
    });
    _$jscoverage_done("E:/codes/nd-slider/index.js", 124);
    var i, n = self.maxIndex, html = [];
    _$jscoverage_done("E:/codes/nd-slider/index.js", 126);
    for (i = 0; i <= n; i++) {
        _$jscoverage_done("E:/codes/nd-slider/index.js", 127);
        html.push('<i data-index="' + i + '"></i>');
    }
    _$jscoverage_done("E:/codes/nd-slider/index.js", 130);
    self.paginator.html(html.join(""));
};

_$jscoverage_done("E:/codes/nd-slider/index.js", 141);
Slider.prototype._scroll = function(step, speed) {
    _$jscoverage_done("E:/codes/nd-slider/index.js", 142);
    var self = this;
    _$jscoverage_done("E:/codes/nd-slider/index.js", 144);
    if (_$jscoverage_done("E:/codes/nd-slider/index.js", 144, !self.ready)) {
        _$jscoverage_done("E:/codes/nd-slider/index.js", 145);
        return;
    }
    _$jscoverage_done("E:/codes/nd-slider/index.js", 148);
    var toIndex = self.index + step;
    _$jscoverage_done("E:/codes/nd-slider/index.js", 150);
    if (_$jscoverage_done("E:/codes/nd-slider/index.js", 150, toIndex < 0)) {
        _$jscoverage_done("E:/codes/nd-slider/index.js", 151);
        return;
    }
    _$jscoverage_done("E:/codes/nd-slider/index.js", 154);
    if (_$jscoverage_done("E:/codes/nd-slider/index.js", 154, toIndex > self.maxIndex)) {
        _$jscoverage_done("E:/codes/nd-slider/index.js", 155);
        return;
    }
    _$jscoverage_done("E:/codes/nd-slider/index.js", 158);
    self.prevIndex = self.index;
    _$jscoverage_done("E:/codes/nd-slider/index.js", 159);
    self.index = toIndex;
    _$jscoverage_done("E:/codes/nd-slider/index.js", 161);
    self.ready = false;
    _$jscoverage_done("E:/codes/nd-slider/index.js", 167);
    self.fire("animate");
    _$jscoverage_done("E:/codes/nd-slider/index.js", 169);
    self.animate(speed || self.speed, function() {
        _$jscoverage_done("E:/codes/nd-slider/index.js", 170);
        self.ready = true;
        _$jscoverage_done("E:/codes/nd-slider/index.js", 176);
        self.fire("complete");
        _$jscoverage_done("E:/codes/nd-slider/index.js", 177);
        self.paginate();
    });
};

_$jscoverage_done("E:/codes/nd-slider/index.js", 186);
Slider.prototype.animate = function(speed, callback) {
    _$jscoverage_done("E:/codes/nd-slider/index.js", 187);
    this.container.stop(true).animate({
        top: "-" + this.index * this.height + "px"
    }, speed, callback);
};

_$jscoverage_done("E:/codes/nd-slider/index.js", 195);
Slider.prototype.paginate = function() {
    _$jscoverage_done("E:/codes/nd-slider/index.js", 196);
    if (_$jscoverage_done("E:/codes/nd-slider/index.js", 196, !this.paginator)) {
        _$jscoverage_done("E:/codes/nd-slider/index.js", 197);
        return;
    }
    _$jscoverage_done("E:/codes/nd-slider/index.js", 200);
    this.paginator.children().eq(this.index).addClass(this.activeClass).siblings("." + this.activeClass).removeClass(this.activeClass);
};

_$jscoverage_done("E:/codes/nd-slider/index.js", 208);
Slider.prototype._initEvents = function() {
    _$jscoverage_done("E:/codes/nd-slider/index.js", 209);
    if (_$jscoverage_done("E:/codes/nd-slider/index.js", 209, !this.events)) {
        _$jscoverage_done("E:/codes/nd-slider/index.js", 210);
        return;
    }
    _$jscoverage_done("E:/codes/nd-slider/index.js", 213);
    var p;
    _$jscoverage_done("E:/codes/nd-slider/index.js", 215);
    for (p in this.events) {
        _$jscoverage_done("E:/codes/nd-slider/index.js", 216);
        this.on(p, this.events[p]);
    }
    _$jscoverage_done("E:/codes/nd-slider/index.js", 219);
    this.events = null;
};

_$jscoverage_done("E:/codes/nd-slider/index.js", 227);
Slider.prototype.fire = function(evt) {
    _$jscoverage_done("E:/codes/nd-slider/index.js", 228);
    var result = true;
    _$jscoverage_done("E:/codes/nd-slider/index.js", 230);
    var events = this.__events;
    _$jscoverage_done("E:/codes/nd-slider/index.js", 232);
    if (_$jscoverage_done("E:/codes/nd-slider/index.js", 232, !events)) {
        _$jscoverage_done("E:/codes/nd-slider/index.js", 233);
        return result;
    }
    _$jscoverage_done("E:/codes/nd-slider/index.js", 236);
    var list = events[evt];
    _$jscoverage_done("E:/codes/nd-slider/index.js", 238);
    if (_$jscoverage_done("E:/codes/nd-slider/index.js", 238, !list)) {
        _$jscoverage_done("E:/codes/nd-slider/index.js", 239);
        return result;
    }
    _$jscoverage_done("E:/codes/nd-slider/index.js", 242);
    var i, n = list.length, args = Array.prototype.slice.call(arguments, 1);
    _$jscoverage_done("E:/codes/nd-slider/index.js", 244);
    for (i = 0; i < n; i++) {
        _$jscoverage_done("E:/codes/nd-slider/index.js", 245);
        result = list[i].apply(this, args) !== false && result;
    }
    _$jscoverage_done("E:/codes/nd-slider/index.js", 248);
    return result;
};

_$jscoverage_done("E:/codes/nd-slider/index.js", 256);
Slider.prototype.on = function(evt, func) {
    _$jscoverage_done("E:/codes/nd-slider/index.js", 257);
    var events = this.__events || (this.__events = {});
    _$jscoverage_done("E:/codes/nd-slider/index.js", 258);
    var list = events[evt];
    _$jscoverage_done("E:/codes/nd-slider/index.js", 260);
    if (_$jscoverage_done("E:/codes/nd-slider/index.js", 260, list)) {
        _$jscoverage_done("E:/codes/nd-slider/index.js", 261);
        list.push(func);
    } else {
        _$jscoverage_done("E:/codes/nd-slider/index.js", 263);
        events[evt] = [ func ];
    }
};

_$jscoverage_done("E:/codes/nd-slider/index.js", 267);
module.exports = Slider;