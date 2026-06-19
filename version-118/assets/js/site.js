(function () {
  var navButton = document.querySelector('[data-toggle-nav]');
  var nav = document.querySelector('.main-nav');
  if (navButton && nav) {
    navButton.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  if (slides.length > 1) {
    var current = 0;
    var showSlide = function (index) {
      current = index % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    };
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });
    setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var searchInput = document.querySelector('[data-search-input]');
  var typeFilter = document.querySelector('[data-filter-type]');
  var yearFilter = document.querySelector('[data-filter-year]');
  var resetButton = document.querySelector('[data-filter-reset]');
  var list = document.querySelector('[data-card-list]');
  var count = document.querySelector('[data-filter-count]');

  if (list) {
    var cards = Array.prototype.slice.call(list.querySelectorAll('[data-card]'));
    var applyFilters = function () {
      var q = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var t = typeFilter ? typeFilter.value : '';
      var y = yearFilter ? yearFilter.value : '';
      var visible = 0;
      cards.forEach(function (card) {
        var hay = [
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-type'),
          card.getAttribute('data-region'),
          card.getAttribute('data-category'),
          card.getAttribute('data-genre')
        ].join(' ').toLowerCase();
        var okText = !q || hay.indexOf(q) !== -1;
        var okType = !t || (card.getAttribute('data-type') || '').indexOf(t) !== -1;
        var okYear = !y || card.getAttribute('data-year') === y;
        var ok = okText && okType && okYear;
        card.hidden = !ok;
        if (ok) {
          visible += 1;
        }
      });
      if (count) {
        count.textContent = '当前显示 ' + visible + ' 部影片';
      }
    };
    [searchInput, typeFilter, yearFilter].forEach(function (el) {
      if (el) {
        el.addEventListener('input', applyFilters);
        el.addEventListener('change', applyFilters);
      }
    });
    if (resetButton) {
      resetButton.addEventListener('click', function () {
        if (searchInput) searchInput.value = '';
        if (typeFilter) typeFilter.value = '';
        if (yearFilter) yearFilter.value = '';
        applyFilters();
      });
    }
    applyFilters();
  }

  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
  players.forEach(function (box) {
    var video = box.querySelector('video');
    var button = box.querySelector('[data-play-button]');
    var src = box.getAttribute('data-stream');
    var started = false;
    var start = function () {
      if (!video || !src) return;
      if (!started) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls();
          hls.loadSource(src);
          hls.attachMedia(video);
        } else {
          video.src = src;
        }
        started = true;
      }
      box.classList.add('playing');
      var playResult = video.play();
      if (playResult && typeof playResult.catch === 'function') {
        playResult.catch(function () {});
      }
    };
    if (button) {
      button.addEventListener('click', start);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (!started) start();
      });
    }
  });
})();
