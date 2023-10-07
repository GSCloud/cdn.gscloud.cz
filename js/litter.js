// LIT library
(function() {
  'use strict';
  
  // LIT object
  window.LIT = {};
  window.LIT.offline = null;
  window.LIT.online = null;
  window.LIT.scrolled = 0;
  window.LIT.scrollpx = 0;
  window.LIT.version = 'LitterJS v0.3.3 ❤️';

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
  
  // feature detection: 'online/offline'
  if ('onLine' in navigator) {
    window.addEventListener('load', function() {
      window.addEventListener('online', checkNetwork);
      window.addEventListener('offline', checkNetwork);
    });
  }

  // check network status
  function checkNetwork() {
    if ('onLine' in navigator) {
      $('#offline').remove();
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
        $('body > div > main').prepend('<span id=offline style="font-size:2.5rem;position:fixed;left:1px;bottom:5rem;z-index:999999">📵</span>');
        if (window.LIT) {
          window.LIT.offline = true;
          window.LIT.online = false;
        }
      }
    }
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
    if ($('body').attr('class') === 'dark') {
      delete localStorage['lightmode'];
    } else {
      localStorage['lightmode'] = 1;
    }
    window.LIT.fixColors();
  }

  // fix colors
  window.LIT.fixColors = function() {
    if ($('body').attr('class') === 'dark') {
      $('.sun').css('background-color', '#000');
      $('textarea,input').css('color', '#888');
      $('dialog > table').css('color', '#fff')
    } else {
      $('.sun').css('background-color', '#fff');
      $('textarea,input').css('color', '#888');
      $('dialog > table').css('color', '#fff')
    }
    $('nav.bottom').removeClass('deep-orange5').addClass('deep-orange8');
  }

  // scroll to top
  window.LIT.scrollTop = function() {
    $('html,body').animate({scrollTop: 0}, 'fast');
  }

  // dynamic image zoom
  window.LIT.imageZoom = function() {
    $('#table-flow img:not(.ff)').on('click', function() {
      if ($(this).css('max-height') !== '100%') {
        $('#table-flow img.ff').css('max-height', '100%').css('z-index', '0');
      } else {
        $('#table-flow img.ff').css('max-height', '100%').css('z-index', '0');
        $(this).css('max-height', '90vh').css('transition', 'max-height 0.1s').css('z-index', '999');
      }
    }).addClass('ff').css('cursor', 'pointer');
    $('nav').css('z-index', '99999');
  }

  // check login password autofill
  window.LIT.checkPassword = function() {
    if ($('input[type=text]').length && $('input[type=password]').length) {
      LIT.usernameOld = null;
      LIT.usernameTime = null;
      LIT.passwordOld = null;
      LIT.passwordTime = null;

      $('input[type=text]').click(function() {
        //console.log('click!');
        LIT.usernameOld = $('input[type=text]').val();
        LIT.passwordOld = $('input[type=password]').val();

        $('input[type=text]').change(function() {
          LIT.usernameTime = Date.now();
          //console.log('username changed');
        });

        $('input[type=password]').change(function() {
          LIT.passwordTime = Date.now();
          //console.log('password changed');
          if (LIT.usernameOld == $('input[type=text]').val()) return false;
          //console.log('time difference: ' + Math.abs(LIT.passwordTime - LIT.usernameTime));

          // submit
          if (Math.abs(LIT.passwordTime - LIT.usernameTime) < 10) {
            delete LIT.usernameOld;
            delete LIT.usernameTime;
            delete LIT.passwordOld;
            delete LIT.passwordTime;      
            $('body > div > main > button:nth-child(8)').click();
          }
        });
      });

    }
  }

  // fix UI
  window.LIT.fixUI = function() {
    // set image zoom
    LIT.imageZoom();

    // fix colors
    LIT.fixColors();

    // fix cursor pointer
    $('#table-users p.bold').css('cursor', 'pointer');

    // set some tables sortable
    $('#table-stats-flow,#table-users,#table-poll').addClass('sortable');

    // !!! test 4 UI fix already done !!!
    if ($('main').data('fixedUI')) return false;
    $('main').data('fixedUI', true);

    // offline button
    $('body > div > main').prepend('<span class="offline" style="visibility:hidden;background-color:#000;font-size:2.5rem;position:fixed;left:1px;bottom:5rem;z-index:999999">📵</span>').css('[offline="true"] #offline-message{visibility:visible}');
    LIT.checkPassword();

    // fix tables bottom padding
    $('table').css('padding-bottom', '2rem');
    
    // toggle dark/light UI mode button
    if ($('main h5').html() === 'littr settings') {
      $('body > div > main').prepend('<span class="sun" onclick="LIT.toggleMode();" style="background-color:#000;font-size:1.5rem;cursor:pointer;position:fixed;right:1px;z-index:999999;padding:0.5rem">🌞</span>');
      $('body > div > main').prepend('<br>' + LIT.version);
    }
    
    // STATS tab
    if ($('#table-stats-flow') && $('#table-stats-flow').length) {
      $('#nav-bottom > a:nth-child(1)').click(function() {
        LIT.scrollTop();
      });
      
    }
    
    // USERS tab
    if ($('#table-users') && $('#table-users').length) {
      $('#nav-bottom > a:nth-child(2)').click(function() {
        LIT.scrollTop();
      });
    }
    
    // POLLS tab
    if ($('#table-poll') && $('#table-poll').length) {
      $('#nav-bottom > a:nth-child(4)').click(function() {
        LIT.scrollTop();
      });
    }
    
    // FLOW tab
    if ($('#table-flow') && $('#table-flow').length) {
      $('#nav-bottom > a:nth-child(5)').click(function() {
        location.reload();
      });
    }

    // fix colors
    LIT.fixColors();
  }

  // onload event listener
  addEventListener('load', (event) => {
    console.log(LIT.version);

    // set UI mode defined by localStorage
    if (localStorage && localStorage['lightmode']) {
      $('body').removeClass('dark');
    } else {
      $('body').addClass('dark');
    }

    // Sortable tables - https://www.cssscript.com/fast-html-table-sorting/
    $('head').append('<link rel="stylesheet" type="text/css" href="https://cdn.gscloud.cz/css/sortable.min.css">');

    // set fix UI action interval
    setInterval(LIT.fixUI, 250);
  });

})();

// add Umami analytics - https://umami.is
(function() {
  var el = document.createElement('script');
  el.setAttribute('src', 'https://umami.gscloud.cz/script.js');
  el.setAttribute('data-website-id', '9c3bf149-ca5c-4e90-af79-1e228ec4cf4b');
  document.body.appendChild(el);
})();

// add Sortable tables - https://www.cssscript.com/fast-html-table-sorting/
(function() {
  var el = document.createElement('script');
  el.setAttribute('src', 'https://cdn.gscloud.cz/js/sortable.min.js');
  document.body.appendChild(el);
})();
