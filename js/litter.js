(function() {
  'use strict';
  
  // LIT object
  window.LIT = {};
  window.LIT.scrolled = 0;
  window.LIT.scrollpx = 0;
  window.LIT.fixedUI = false;

  // compute SHA-256 hash of a string
  async function sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hash;
  }
 
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
    if ('onLine' in navigator) {
      if (navigator.onLine) {
        document.getElementsByTagName('html')[0].setAttribute('offline', false);
        document.getElementsByTagName('html')[0].setAttribute('online', true);
        if (window.LIT) {
          window.LIT.offline = false;
          window.LIT.online = true;
        }
      } else {
        document.getElementsByTagName('html')[0].setAttribute('offline', true);
        document.getElementsByTagName('html')[0].setAttribute('online', false);
        if (window.LIT) {
          window.LIT.offline = true;
          window.LIT.online = false;
        }
      }
    }
  }

  // feature detection: 'online'
  if ('onLine' in navigator) {
    window.addEventListener('load', function() {
      window.addEventListener('online', checkNetwork);
      window.addEventListener('offline', checkNetwork);
    });
  }
  checkNetwork();

  // deregister the service worker
  window.LIT.clearCache = function() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations()
      .then(function(registrations) {
         for (let registration of registrations) {
            registration.unregister();
         }
      });
   }
  }

  // switch dark/light mode
  window.LIT.toggleMode = function() {
    $('body').toggleClass('dark');
  }

  // fix various UI glitches
  window.LIT.fixUI = function() {
    if (window.LIT.fixedUI) return false;

    // toggle mode button
    $('body > div > main').prepend('<span onclick="LIT.toggleMode()" style="font-size:2rem;float:right;cursor:pointer">☀️</span>');
    window.LIT.fixedUI = true;
  }

  // onload event listener
  addEventListener('load', (event) => {
    console.log('LIT is on.');
    setInterval(window.LIT.fixUI, 500);
  });

})();
