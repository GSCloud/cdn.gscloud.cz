(function(w, d, undefined) {
  'use strict';

  w.scrollpx = 0;
  w.scrolled = 0;

  w.addEventListener("load", function() {

    // mark the scroll position to globals
    w.onscroll = function() {
      let scroll = d.body.scrollTop || d.documentElement.scrollTop;
      let height = d.documentElement.scrollHeight - d.documentElement.clientHeight;
      let scrolled = (scroll / height) * 100;

      w.scrollpx = scroll; // px scrolled
      w.scrolled = scrolled; // % scrolled
    };

    // flow button click scroll to top
    $('#nav > a:nth-child(5)').click(function() {
      $('html').animate({scrollTop: 0}, 'slow').delay(50).queue(function () {
        location.reload()
      });
    });

  }); // end event handler

})(window, document);
