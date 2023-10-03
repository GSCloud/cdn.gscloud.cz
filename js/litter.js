(function() {
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

  // click the flow button
  $('#nav > a:nth-child(5)').click(function () { // not working?
    $('html').animate({scrollTop: 0}, 'slow').delay(50).queue(function () {
      location.reload();
    });
  });
  
  window.ontouchmove = onscroll;
  window.onscroll = onscroll;

  // scroll event
  function onscroll() {
    var scroll = d.body.scrollTop || d.documentElement.scrollTop;
    var height = d.documentElement.scrollHeight - d.documentElement.clientHeight;
    var scrolled = (scroll / height) * 100;
    if (d.getElementById(pbar)) {
      d.getElementById(pbar).style.width = scrolled + '%';
    }
    window.LIT.scrolled = scrolled;
    window.LIT.scrollpx = scroll;
  };

  // check network status
  function checkNetwork() {
    if ("onLine" in navigator) {
      if (navigator.onLine) {
        d.getElementsByTagName("html")[0].setAttribute("offline", false);
        d.getElementsByTagName("html")[0].setAttribute("online", true);
        if (d.getElementById("offline-message")) d.getElementById("offline-message").setAttribute("aria-hidden", true);
        if (w.GSC) {
          w.LIT.offline = false;
          w.LIT.online = true;
        }
      } else {
        d.getElementsByTagName("html")[0].setAttribute("offline", true);
        d.getElementsByTagName("html")[0].setAttribute("online", false);
        if (d.getElementById("offline-message")) d.getElementById("offline-message").setAttribute("aria-hidden", false);
        if (w.LIT) {
          w.LIT.offline = true;
          w.LIT.online = false;
        }
      }
    }
  }

  checkNetwork();

  console.log('LitterJS is on.');
})();
