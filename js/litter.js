(function(w, d, undefined) {
    'use strict';

    window.onscroll = function() {
        let scroll = document.body.scrollTop || document.documentElement.scrollTop;
        let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        let scrolled = (scroll / height) * 100;
        window.scrollpx = scroll;
        window.scrolled = scrolled;
    };

})(window, document);
