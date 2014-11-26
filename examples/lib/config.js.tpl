(function(window, seajs, undefined) {

  'use strict';

  if (!seajs) {
    return;
  }

  seajs.config({
    base: '/examples',
    alias: {
      @ALIAS
      '$': 'lib/jquery/jquery'
    },
    map: []
  });

})(this, this.seajs);
