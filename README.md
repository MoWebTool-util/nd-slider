# nd-slider

[![spm version](http://spmjs.io/badge/nd-slider)](http://spmjs.io/package/nd-slider)

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

## 提示

每个分页，应铺满全屏，采用样式控制。详见 `examples`。

## 开发

### 本地 Web 服务

```bash
grunt
```

浏览器中访问 http://127.0.0.1:8851

### 生成/查看 API 文档

```bash
grunt doc
grunt
```

浏览器中访问 http://127.0.0.1:8851/doc

### 代码检查与单元测试

```bash
grunt test
```

### 发布组件到 SPM 源

```bash
grunt publish
```
