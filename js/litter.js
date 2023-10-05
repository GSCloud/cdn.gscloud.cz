(function() {
  'use strict';
  
  // LIT object
  window.LIT = {};
  window.LIT.scrolled = 0;
  window.LIT.scrollpx = 0;

  // compute SHA-256 hash of a string
  async function sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hash;
  }
 
  // scroll event listener
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

  // toggle dark/light UI mode
  window.LIT.toggleMode = function() {
    $('body').toggleClass('dark');
    window.LIT.fixColors();
  }

  // fix various colors
  window.LIT.fixColors = function() {
    if ($('body').attr('class') === 'dark') {
      $('textarea,input').css('color', 'white');
      $('.sun,.arrowtop').css('background-color', '#000');
    } else {
      $('textarea,input').css('color', 'black');
      $('.sun,.arrowtop').css('background-color', '#fff');
    }
    $('nav.bottom').removeClass('deep-orange5').addClass('deep-orange8');
  }

  // scroll to top
  window.LIT.scrollTop = function() {
    $('html,body').animate({scrollTop: 0}, 'fast');
  }

  // image zoom
  window.LIT.imageZoom = function() {
    $('#table-flow img:not(.ff)').on('click', function() {
      if ($(this).css('max-height') !== '100%') {
        $('#table-flow img.ff').css('max-height', '100%').css('z-index', '0');
      } else {
        $('#table-flow img.ff').css('max-height', '100%').css('z-index', '0');
        $(this).css('max-height', '75vh').css('z-index', '999');
      }
    }).addClass('ff').css('cursor', 'pointer');
    $('nav').css('z-index', '99999');
  }

  // fix various UI glitches
  window.LIT.fixUI = function() {
    // fix figs
    window.LIT.imageZoom();
    // test UI render 4 refresh
    if ($('main').data('fixedUI')) return false;
    $('main').data('fixedUI', true);
    
    // toggle dark/light UI mode button
    $('body > div > main').prepend('<span class="sun" onclick="LIT.toggleMode();" style="background-color:#000;font-size:1.5rem;cursor:pointer;position:fixed;right:1rem;z-index:999999;padding:0.5rem">🌞</span>');
    
    // STATS tab
    if ($('#table-stats') && $('#table-stats').length) {
      // scroll to top button
      $('body > div > main').prepend('<span class="arrowtop" onclick="LIT.scrollTop();" style="background-color:#000;font-size:2rem;cursor:pointer;position:fixed;bottom:5rem;right:1rem;z-index:999999">🔺</span>');
    }
    
    // USERS tab
    if ($('#table-users') && $('#table-users').length) {
      // fix cursor for usernames
      $('#table-users p.bold').css('cursor', 'pointer');
      // scroll to top button
      $('body > div > main').prepend('<span class="arrowtop" onclick="LIT.scrollTop();" style="background-color:#000;font-size:2rem;cursor:pointer;position:fixed;bottom:5rem;right:1rem;z-index:999999">🔺</span>');
    }
    
    // POLLS tab
    if ($('#table-poll') && $('#table-poll').length) {
      // scroll to top button
      $('body > div > main').prepend('<span class="arrowtop" onclick="LIT.scrollTop();" style="background-color:#000;font-size:2rem;cursor:pointer;position:fixed;bottom:5rem;right:1rem;z-index:999999">🔺</span>');
    }
    
    // FLOW tab
    if ($('#table-flow') && $('#table-flow').length) {
      // scroll to top button
      $('body > div > main').prepend('<span class="arrowtop" onclick="LIT.scrollTop();" style="background-color:#000;font-size:2rem;cursor:pointer;position:fixed;bottom:5rem;right:1rem;z-index:999999">🔺</span>');
    }

    // fix various colors
    window.LIT.fixColors();
  }

  // onload event listener
  addEventListener('load', (event) => {
    console.log('LitterJS v0.1.1 is ON ❤️');
    setInterval(window.LIT.fixUI, 250);
  });

})();
