// LIT library
(function() {
  'use strict';
  
  // LIT object
  window.LIT = {};
  window.LIT.offline = null;
  window.LIT.online = null;
  window.LIT.scrolled = 0;
  window.LIT.scrollpx = 0;
  window.LIT.version = 'LitterJS v4.0.0 ❤️';

  // feature detection: mobile device
  if ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch) {

    // feature detection: share
    if (navigator.share) {
      if (typeof window.WebShare !== "function") window.WebShare = function (text, url, title) {
        url = url || (document.querySelector("link[rel=canonical]") ?
          document.querySelector("link[rel=canonical]").href : document.location.href);
        title = title || document.title;
        text = text || document.title;
        navigator.share({
          title: title,
          text: text,
          url: url,
        }).catch(console.error);
      }
    }
  }

  // setCookie()
  if (typeof window.setCookie !== "function") window.setCookie = function(key, value, days) {
    if (key === undefined) return false;
    if (value === undefined) return false;
    if (days === undefined) days = 31;
    if (days == 0) { // session cookie      
      document.cookie = key + "=" + value + ";path=/";
    } else {
      var d1 = new Date().getTime();
      var d2 = d1 + (parseInt(days) * 86400 * 1000); // time is in miliseconds!
      document.cookie = key + "=" + value + ";path=/" + ";expires=" + new Date(d2).toGMTString();
    }
  }

  // getCookie()
  if (typeof window.getCookie !== "function") window.getCookie = function(key) {
    if (key === undefined) return false;
    var v = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return v ? v[2] : null;
  }

  // delCookie()
  if (typeof window.delCookie !== "function") window.delCookie = function(key) {
    if (key === undefined) return false;
    var date = new Date();
    date.setTime(0);
    document.cookie = key + "=;path=/" + ";expires=" + date.toGMTString();
  }

  // scroll event handler
  function onscroll() {
    var scroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (scroll / height) * 100;
    window.LIT.scrolled = scrolled;
    window.LIT.scrollpx = scroll;
  };
  window.ontouchmove = onscroll;
  window.onscroll = onscroll;
  
  // feature detection: online/offline
  if ('onLine' in navigator) {
    window.addEventListener('load', function() {
      window.addEventListener('online', checkNetwork);
      window.addEventListener('offline', checkNetwork);
    });
  }

  // network status handler
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

  // fix image zoom
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

  // check login password 4 autofill
  window.LIT.checkPassword = function() {
    if ($('input[type=text]').length && $('input[type=password]').length) {
      LIT.usernameOld = null;
      LIT.usernameTime = null;
      LIT.passwordOld = null;
      LIT.passwordTime = null;

      $('input[type=text]').click(function() {
        LIT.usernameOld = $('input[type=text]').val();
        LIT.passwordOld = $('input[type=password]').val();

        $('input[type=text]').change(function() {
          LIT.usernameTime = Date.now();
          console.log('username changed');
        });

        $('input[type=password]').change(function() {
          LIT.passwordTime = Date.now();
          console.log('password changed');
          console.log('time difference: ' + Math.abs(LIT.passwordTime - LIT.usernameTime));
          if (LIT.usernameOld == $('input[type=text]').val()) return false;

          // submit login form
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

  // fix anchors
  window.LIT.fixLinks = function() {
    if ($('#table-flow article span:not(.ff)').length) {
      $('#table-flow article span').each(function() {
        $(this).html($(this).html().replace(/((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g,
          '<a class="bold red-text" target=_blank href="$1">$1</a> ')).addClass("ff");
      });
    }
  }

  // fix UI glitches
  window.LIT.fixUI = function() {
    // fix image zoom
    LIT.imageZoom();

    // fix colors
    LIT.fixColors();
    
    // fix links
    LIT.fixLinks();

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
  var x = document.createElement('script');
  x.setAttribute('src', 'https://umami.gscloud.cz/script.js');
  x.setAttribute('data-website-id', '9c3bf149-ca5c-4e90-af79-1e228ec4cf4b');
  document.body.appendChild(x);
})();

// add Sortable tables - https://www.cssscript.com/fast-html-table-sorting/
(function() {
  var x = document.createElement('script');
  x.setAttribute('src', 'https://cdn.gscloud.cz/js/sortable.min.js');
  document.body.appendChild(x);
})();
