(function(w, d) {
  'use strict';
  
  // LIT object
  w.LIT = {};
  w.LIT.scrolled = 0;
  w.LIT.scrollpx = 0;

  // compute SHA-256 hash of a string
  async function sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hash;
  }

  // TODO: fix! - click the flow button
  $('#nav > a:nth-child(5)').click(function () {
    $('html').animate({scrollTop: 0}, 'slow').delay(50).queue(function () {
      location.reload();
    });
  });
  
  // scroll event
  function onscroll() {
    var scroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (scroll / height) * 100;
    window.LIT.scrolled = scrolled;
    window.LIT.scrollpx = scroll;
  };
  window.ontouchmove = onscroll;
  window.onscroll = onscroll;
  
  // check network status
  function checkNetwork() {
    if ("onLine" in navigator) {
      if (navigator.onLine) {
        document.getElementsByTagName("html")[0].setAttribute("offline", false);
        document.getElementsByTagName("html")[0].setAttribute("online", true);
        if (window.LIT) {
          window.LIT.offline = false;
          window.LIT.online = true;
        }
      } else {
        document.getElementsByTagName("html")[0].setAttribute("offline", true);
        document.getElementsByTagName("html")[0].setAttribute("online", false);
        if (window.LIT) {
          window.LIT.offline = true;
          window.LIT.online = false;
        }
      }
    }
  }

  // feature detection and binding: "online"
  if ("onLine" in navigator) {
    window.addEventListener("load", function() {
      window.addEventListener("online", checkNetwork);
      window.addEventListener("offline", checkNetwork);
    });
  }
  checkNetwork();

  console.log('LitterJS is on.');
})(window, document);
