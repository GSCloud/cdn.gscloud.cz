(function() {
  'use strict';
  
  // delayed fn
  $('#nav > a:nth-child(5)').click(function () {
    $('html').animate({scrollTop: 0}, 'slow').delay(50).queue(function () {
      location.reload();
    });
  });


  window.scrollpx = 0;
  window.scrolled = 0;

  // mark the scroll position to globals
  window.onscroll = function() {
    let scroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (scroll / height) * 100;
    window.scrollpx = scroll; // px scrolled
    window.scrolled = scrolled; // % scrolled
  };

})();
