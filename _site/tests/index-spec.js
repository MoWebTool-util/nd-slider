'use strict';

var expect = require('expect.js');
var $ = require('jquery');
var Slider = require('../index');

/*globals describe, it, beforeEach, afterEach*/

describe('Slider', function() {

  this.timeout(3000);

  var KEY_LEFT  = 37;
  var KEY_UP    = 38;
  var KEY_RIGHT = 39;
  var KEY_DOWN  = 40;

  var slider;
  var count = 0;

  beforeEach(function() {
    $(document.body).append('<div id="paginator"></div>' +
    '  <div id="container">' +
    '    <!-- slide 1 begin -->' +
    '    <div class="slide slide-1">' +
    '      <div class="slide-wrap">' +
    '        <div class="content-wrap">' +
    '          Slide 1' +
    '        </div>' +
    '      </div>' +
    '    </div>' +
    '    <!-- // slide 1 end -->' +
    '    <!-- slide 2 begin -->' +
    '    <div class="slide slide-2">' +
    '      <div class="slide-wrap">' +
    '        <div class="content-wrap">' +
    '          Slide 2' +
    '        </div>' +
    '      </div>' +
    '    </div>' +
    '    <!-- // slide 2 end -->' +
    '    <!-- slide 3 begin -->' +
    '    <div class="slide slide-3">' +
    '      <div class="slide-wrap">' +
    '        <div class="content-wrap">' +
    '          Slide 3' +
    '        </div>' +
    '      </div>' +
    '    </div>' +
    '    <!-- // slide 3 end -->' +
    '    <!-- slide 4 begin -->' +
    '    <div class="slide slide-4">' +
    '      <div class="slide-wrap">' +
    '        <div class="content-wrap">' +
    '          Slide 4' +
    '        </div>' +
    '      </div>' +
    '    </div>' +
    '    <!-- // slide 4 end -->' +
    '    <!-- slide 5 begin -->' +
    '    <div class="slide slide-5">' +
    '      <div class="slide-wrap">' +
    '        <div class="content-wrap">' +
    '          Slide 5' +
    '        </div>' +
    '      </div>' +
    '    </div>' +
    '    <!-- // slide 5 end -->' +
    '    <!-- slide 6 begin -->' +
    '    <div class="slide slide-6">' +
    '      <div class="slide-wrap">' +
    '        <div class="content-wrap">' +
    '          Slide 6' +
    '        </div>' +
    '      </div>' +
    '    </div>' +
    '    <!-- // slide 6 end -->' +
    '  </div>');

    slider = new Slider({
      paginator: '#paginator',
      activeClass: 'active',
      container: '#container',
      slides: '.slide',
      slideWrap: '.slide-wrap',
      speed: 1,
      events: {
        animate: function() {
          count++;
        },
        complete: function() {
          count++;
        }
      }
    });
  });

  afterEach(function() {
    $('#paginator').off('.nd-slider');
    $(document).off('.nd-slider');
    $(window).off('.nd-slider');
    $('#paginator, #container').remove();
    slider = null;
    count = 0;
  });

  it('mousewheel', function(done) {
    var data = [{
      index: 1,
      prevIndex: 0,
      count: 4
    }, {
      index: 0,
      prevIndex: 1,
      count: 6
    }];

    var current = data[0];

    // wheel down
    var wheelDown = $.Event('mousewheel', {
      originalEvent: {
        wheelDelta: -1
      }
    });

    // wheel up
    var wheelUp = $.Event('mousewheel', {
      originalEvent: {
        wheelDelta: 1
      }
    });

    setTimeout(function() {

      slider.on('animate', function() {
        expect(this.index).to.be(current.index);
        expect(this.prevIndex).to.be(current.prevIndex);
      });

      slider.on('complete', function() {
        expect(this.index).to.be(current.index);
        expect(this.prevIndex).to.be(current.prevIndex);

        // because init call will fired animate and complete
        expect(count).to.be(current.count);
      });

      $(document).trigger(wheelDown);

      setTimeout(function() {
        current = data[1];

        setTimeout(done, 50);

        $(document).trigger(wheelUp);
      }, 50);
    }, 50);
  });

  it('keydown', function(done) {
    var data = [{
      index: 1,
      prevIndex: 0,
      count: 4
    }, {
      index: 0,
      prevIndex: 1,
      count: 6
    }];

    var current = data[0];

    var keyLeft = $.Event('keydown', {
      keyCode: KEY_LEFT
    });

    var keyUp = $.Event('keydown', {
      keyCode: KEY_UP
    });

    var keyRight = $.Event('keydown', {
      keyCode: KEY_RIGHT
    });

    var keyDown = $.Event('keydown', {
      keyCode: KEY_DOWN
    });

    setTimeout(function() {
      expect(slider.ready).to.be(true);
      expect(slider.index).to.be(0);
      expect(slider.prevIndex).to.be(0);

      $(document).trigger(keyLeft);

      expect(slider.ready).to.be(true);
      expect(slider.index).to.be(0);
      expect(slider.prevIndex).to.be(0);

      expect(count).to.be(2);

      setTimeout(function() {
        slider.on('animate', function() {
          expect(this.ready).to.be(false);
          expect(this.index).to.be(current.index);
          expect(this.prevIndex).to.be(current.prevIndex);
        });

        slider.on('complete', function() {
          expect(this.ready).to.be(true);
          expect(this.index).to.be(current.index);
          expect(this.prevIndex).to.be(current.prevIndex);

          expect(count).to.be(current.count);
        });

        $(document).trigger(keyRight);

        setTimeout(function() {
          current = data[1];

          $(document).trigger(keyUp);

          setTimeout(function() {
            current = data[0];
            current.count = 8;

            setTimeout(done, 50);

            $(document).trigger(keyDown);
          }, 50);
        }, 50);
      }, 50);
    }, 50);
  });

  it('paginator', function(done) {
    var data = [{
      index: 2,
      prevIndex: 0,
      count: 4
    }, {
      index: 1,
      prevIndex: 2,
      count: 6
    }];

    var current = data[0];
    // wheel down
    var click3 = $.Event('click', {
      target: $('#paginator').children().get(2)
    });

    // wheel up
    var click2 = $.Event('click', {
      target: $('#paginator').children().get(1)
    });

    setTimeout(function() {

      slider.on('animate', function() {
        expect(this.index).to.be(current.index);
        expect(this.prevIndex).to.be(current.prevIndex);
      });

      slider.on('complete', function() {
        expect(this.index).to.be(current.index);
        expect(this.prevIndex).to.be(current.prevIndex);

        // because init call will fired animate and complete
        expect(count).to.be(current.count);
      });

      $('#paginator').trigger(click3);

      setTimeout(function() {
        current = data[1];

        setTimeout(done, 50);

        $('#paginator').trigger(click2);
      }, 50);
    }, 50);
  });

});
