'use strict';

/**
  * Description: 全屏切换
  * Author: crossjs <liwenfu@crossjs.com>
  * Date: 2014-11-25 00:00:00
  */

var $ = require('jquery');

var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_LEFT = 37;
var KEY_RIGHT = 39;

var Slider = function(options) {
  return this.init(options);
};

Slider.prototype.init = function(options) {
  this.paginator = options.paginator;
  this.activeClass = options.activeClass;
  this.container = $(options.container);
  this.slides = $(options.slides, this.container);
  this.slideWrap = options.slideWrap;
  this.speed = options.speed || 1000;

  this.index = 0;
  this.maxIndex = this.slides.length - 1;
  this.height = $(window).height();

  this.initEvent();

  this.initPaginator();

  this.ready = true;

  this.scroll(0, 1);

  return this;
};

Slider.prototype.fire = function(evt) {
  var evts = this.__events;

  if (!evts) {
    return;
  }

  var list = evts[evt];

  if (!list) {
    return;
  }

  var result;
  var args = Array.prototype.slice.call(arguments, 1);

  var i, n = list.length;

  for (i = 0; i < n; i++) {
    result = list[i].apply(this, args);
    if (result === false) {
      break;
    }
  }

  return result;
};

Slider.prototype.on = function(evt, func) {
  var self = this;

  var evts = self.__events || (self.__events = {});

  var list = evts[evt];

  if (list) {
    list.push(func);
  } else {
    evts[evt] = [func];
  }
};

Slider.prototype.scroll = function(step, speed) {
  if (!this.ready) {
    return;
  }

  var toIndex = this.index + step;

  if (toIndex < 0) {
    return;
  }

  if (toIndex > this.maxIndex) {
    return;
  }

  this.prevIndex = this.index;
  this.index = toIndex;

  this.animate(speed);
};

Slider.prototype.animate = function(speed) {
  var self = this;

  self.ready = false;

  self.fire('animate');

  self.container.stop(true).animate({
    top: '-' + (self.index * self.height) + 'px'
  }, speed || self.speed, function() {
    self.ready = true;
    self.paginate();
  });
};

Slider.prototype.paginate = function() {
  if (!this.paginator) {
    return;
  }

  this.paginator.children().eq(this.index).addClass(this.activeClass)
      .siblings('.' + this.activeClass).removeClass(this.activeClass);
};

Slider.prototype.initEvent = function() {
  var self = this,
    resizeTimeout;

  function resize() {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }

    resizeTimeout = setTimeout(function() {
      self.height = $(window).height();
      self.scroll(0, 500);
    }, 50);
  }

  $(window).on('resize', function() {
    resize();
  });

  $(document).on({
    // for firefox
    DOMMouseScroll: function(e) {
      e.preventDefault();
      e.stopPropagation();
      self.scroll(e.originalEvent.detail > 0 ? 1 : -1);
    },
    mousewheel: function(e) {
      e.preventDefault();
      e.stopPropagation();
      self.scroll(e.originalEvent.wheelDelta < 0 ? 1 : -1);
    },
    keydown: function(e) {
      switch (e.keyCode) {
        case KEY_UP:
        case KEY_LEFT:
          self.scroll(-1);
          break;
        case KEY_DOWN:
        case KEY_RIGHT:
          self.scroll(1);
          break;
      }
    }
  });
};

Slider.prototype.initPaginator = function() {
  var self = this;

  var i, html;

  if (!self.paginator) {
    return;
  }

  self.paginator = $(self.paginator).on('click', function(e) {
    if (e.target.tagName === 'I') {
      self.ready = true;
      console.log(e.target.getAttribute('data-index'));
      self.scroll(+e.target.getAttribute('data-index') - self.index);
    }
  });

  html = [];

  for (i = 0; i <= self.maxIndex; i++) {
    html.push('<i data-index="' + i + '"></i>');
  }

  self.paginator.html(html.join(''));
};

module.exports = Slider;
