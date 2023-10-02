(function(w, d, undefined) {
    'use strict';

    // mark the scroll position to global vars
    window.onscroll = function() {
        let scroll = document.body.scrollTop || document.documentElement.scrollTop;
        let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        let scrolled = (scroll / height) * 100;
        window.scrollpx = scroll; // px scrolled
        window.scrolled = scrolled; // % scrolled
    };

    // flow button click scroll to top
    $('#nav > a:nth-child(5)').click(function() {
        window.scrollTo(0,0);
    });

})(window, document);
