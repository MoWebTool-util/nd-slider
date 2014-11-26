(function(window, seajs, undefined) {

  'use strict';

  if (!seajs) {
    return;
  }

  seajs.config({
    base: '/examples',
    alias: {
      'expect.js': '../spm_modules/expect.js/0.3.1/index.js',
      '$': 'static/lib/jquery/jquery'
    },
    map: [
      ['static/lib/jquery/jquery', 'lib/jquery/jquery']
    ]
  });

})(this, this.seajs);
