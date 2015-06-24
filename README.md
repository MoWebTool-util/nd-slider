# nd-slider

[![spm version](http://spm.crossjs.com/badge/nd-slider)](http://spm.crossjs.com/package/nd-slider)

> 实现网页的全屏切换效果，多用于产品官网等展示型的网站。

## 安装

```
$ spm install nd-slider --save
```

## 使用

```js
var slider = require('nd-slider');

new Slider({
  paginator: '#paginator',
  activeClass: 'active',
  container: '#container',
  slides: '.slide',
  slideWrap: '.slide-wrap',
  speed: 1000,
  align: 'bottom',
  axis: 'x',
  threshold: 50,
  events: {
    animate: function() {
      console.log('animate', this.index, this.prevIndex);
    },
    complete: function() {
      console.log('complete', this.index, this.prevIndex);
    }
  }
});
```
