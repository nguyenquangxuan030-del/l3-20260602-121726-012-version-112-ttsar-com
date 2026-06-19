(function () {
  var body = document.body;
  var menuToggle = document.querySelector('[data-menu-toggle]');

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      body.classList.toggle('menu-open');
    });
  }

  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () {
      img.classList.add('is-missing');
    });
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var activeSlide = 0;
  var slideTimer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === activeSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === activeSlide);
    });
  }

  if (slides.length) {
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        window.clearInterval(slideTimer);
        slideTimer = window.setInterval(function () {
          showSlide(activeSlide + 1);
        }, 5200);
      });
    });

    slideTimer = window.setInterval(function () {
      showSlide(activeSlide + 1);
    }, 5200);
  }

  document.querySelectorAll('[data-filter-target]').forEach(function (scope) {
    var input = document.querySelector(scope.getAttribute('data-filter-target'));

    if (!input) {
      return;
    }

    input.addEventListener('input', function () {
      var value = input.value.trim().toLowerCase();
      scope.querySelectorAll('[data-card]').forEach(function (card) {
        var haystack = (card.getAttribute('data-search') || '').toLowerCase();
        card.hidden = value && haystack.indexOf(value) === -1;
      });
    });
  });

  var searchInput = document.querySelector('[data-global-search]');

  if (searchInput) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    searchInput.value = query;
    var list = document.querySelector('[data-search-list]');

    function filterGlobal() {
      var value = searchInput.value.trim().toLowerCase();
      if (!list) {
        return;
      }
      list.querySelectorAll('[data-card]').forEach(function (card) {
        var haystack = (card.getAttribute('data-search') || '').toLowerCase();
        card.hidden = value && haystack.indexOf(value) === -1;
      });
    }

    searchInput.addEventListener('input', filterGlobal);
    filterGlobal();
  }

  document.querySelectorAll('[data-player]').forEach(function (player) {
    var video = player.querySelector('video');
    var cover = player.querySelector('[data-play-cover]');
    var source = player.getAttribute('data-source');
    var loaded = false;

    function loadAndPlay() {
      if (!video || !source) {
        return;
      }

      if (!loaded) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hls.loadSource(source);
          hls.attachMedia(video);
        } else {
          video.src = source;
        }
        loaded = true;
      }

      if (cover) {
        cover.classList.add('hidden');
      }

      var playPromise = video.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {
          video.controls = true;
        });
      }
    }

    if (cover) {
      cover.addEventListener('click', loadAndPlay);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        loadAndPlay();
      } else {
        video.pause();
      }
    });
  });
})();
