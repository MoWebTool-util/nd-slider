/**
 * @module nd-slider
 * @author crossjs <liwenfu@crossjs.com> - 2014-11-25 00:00:00
 */

'use strict';

var $ = require('jquery');

var KEY_LEFT  = 37;
var KEY_UP    = 38;
var KEY_RIGHT = 39;
var KEY_DOWN  = 40;

/**
 * 全屏切换
 * @class
 * @constructor
 * @param  {Object} options 参数配置
 */
var Slider = function(options) {
  return this.init(options);
};

/**
 * 初始化
 * @param  {Object} options 参数配置
 * @return                  当前实例
 */
Slider.prototype.init = function(options) {
  this.activeClass = options.activeClass;
  this.container = $(options.container);
  this.events = options.events;
  this.paginator = options.paginator;
  this.slides = $(options.slides, this.container);
  this.slideWrap = options.slideWrap;
  this.speed = options.speed || 1000;

  this.index = 0;
  this.maxIndex = this.slides.length - 1;
  this.height = $(window).height();

  this._initDomEvents();
  this._initPaginator();

  this._initEvents();

  this.ready = true;

  // 初始化到第一屏
  this._scroll(0, 1);

  return this;
};

/**
 * 初始化 DOM 事件绑定
 * @private
 */
Slider.prototype._initDomEvents = function() {
  var self = this,
    resizeTimeout;

  function resize() {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }

    resizeTimeout = setTimeout(function() {
      self.height = $(window).height();
      self._scroll(0, 1);
    }, 50);
  }

  $(window).on('resize.nd-slider', function() {
    resize();
  });

  $(document).on({
    // for firefox
    'DOMMouseScroll.nd-slider': function(e) {
      e.preventDefault();
      e.stopPropagation();
      self._scroll(e.originalEvent.detail > 0 ? 1 : -1);
    },
    'mousewheel.nd-slider': function(e) {
      e.preventDefault();
      e.stopPropagation();
      self._scroll(e.originalEvent.wheelDelta < 0 ? 1 : -1);
    },
    'keydown.nd-slider': function(e) {
      switch (e.keyCode) {
        case KEY_UP:
        case KEY_LEFT:
          self._scroll(-1);
          break;
        case KEY_DOWN:
        case KEY_RIGHT:
          self._scroll(1);
          break;
      }
    }
  });
};

/**
 * 初始化分页符
 * @private
 */
Slider.prototype._initPaginator = function() {
  var self = this;

  if (!self.paginator) {
    return;
  }

  self.paginator = $(self.paginator).on('click.nd-slider', function(e) {
    if (e.target.tagName === 'I') {
      self.ready = true;
      self._scroll(+e.target.getAttribute('data-index') - self.index);
    }
  });

  var i, n = self.maxIndex, html = [];

  for (i = 0; i <= n; i++) {
    html.push('<i data-index="' + i + '"></i>');
  }

  self.paginator.html(html.join(''));
};

/**
 * 滚屏
 * @private
 * @param  {Number} step  移动的页数，负数为向前页移动
 * @param  {Number} speed 动画速度
 * @fires module:nd-slider#animate
 * @fires module:nd-slider#complete
 */
Slider.prototype._scroll = function(step, speed) {
  var self = this;

  if (!self.ready) {
    return;
  }

  var toIndex = self.index + step;

  if (toIndex < 0) {
    return;
  }

  if (toIndex > self.maxIndex) {
    return;
  }

  self.prevIndex = self.index;
  self.index = toIndex;

  self.ready = false;

  /**
   * 通知动画开始
   * @event module:nd-slider#animate
   */
  self.fire('animate');

  self.animate(speed || self.speed, function() {
    self.ready = true;

    /**
     * 通知动画完毕
     * @event module:nd-slider#complete
     */
    self.fire('complete');
    self.paginate();
  });
};

/**
 * 滚屏动画
 * @param  {Number}   speed    动画速度
 * @param  {Function} callback 动画回调函数
 */
Slider.prototype.animate = function(speed, callback) {
  this.container.stop(true).animate({
    top: '-' + (this.index * this.height) + 'px'
  }, speed, callback);
};

/**
 * 处理分页符状态
 */
Slider.prototype.paginate = function() {
  if (!this.paginator) {
    return;
  }

  this.paginator.children().eq(this.index).addClass(this.activeClass)
      .siblings('.' + this.activeClass).removeClass(this.activeClass);
};

/**
 * 初始化事件订阅
 * @private
 */
Slider.prototype._initEvents = function() {
  if (!this.events) {
    return;
  }

  var p;

  for (p in this.events) {
    this.on(p, this.events[p]);
  }

  this.events = null;
};

/**
 * 事件触发
 * @param  {String} evt 事件名
 * @return {Boolean}    如果回调列表中至少有一项返回 `false`，返回 `false`
 */
Slider.prototype.fire = function(evt) {
  var result = true;

  var events = this.__events;

  if (!events) {
    return result;
  }

  var list = events[evt];

  if (!list) {
    return result;
  }

  var i, n = list.length, args = Array.prototype.slice.call(arguments, 1);

  for (i = 0; i < n; i++) {
    result = list[i].apply(this, args) !== false && result;
  }

  return result;
};

/**
 * 事件订阅
 * @param  {String}   evt  事件名
 * @param  {Function} func 事件回调
 */
Slider.prototype.on = function(evt, func) {
  var events = this.__events || (this.__events = {});
  var list = events[evt];

  if (list) {
    list.push(func);
  } else {
    events[evt] = [func];
  }
};

module.exports = Slider;
