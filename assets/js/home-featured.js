/* Home featured work: full-bleed slider with a project rail, prev / next, pause, keyboard and swipe.
   The active rail item's progress bar is a CSS animation (home.css, hm-fs-fill); its animationend
   advances the slide, so pausing the animation pauses the slideshow. Autoplay pauses on hover,
   keyboard focus, while off-screen or in a background tab, and is off for reduced motion. */
(function () {
    var root = document.querySelector('[data-fs]');
    if (!root) return;
    var slides = Array.prototype.slice.call(root.querySelectorAll('.hm-fs-slide'));
    var tabs = Array.prototype.slice.call(root.querySelectorAll('.hm-fs-tabs button'));
    var track = root.querySelector('.hm-fs-track');
    var pauseBtn = root.querySelector('.hm-fs-pause');
    if (slides.length < 2) return;

    var delay = parseInt(root.getAttribute('data-fs-delay'), 10) || 7000;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var idx = 0;
    var stopped = reduce;
    var reasons = { hover: false, focus: false, offscreen: true, hidden: document.hidden };
    root.style.setProperty('--fs-delay', delay + 'ms');

    function go(i) {
        idx = (i + slides.length) % slides.length;
        slides.forEach(function (s, k) {
            var on = k === idx;
            s.classList.toggle('is-active', on);
            s.setAttribute('aria-hidden', on ? 'false' : 'true');
            s.inert = !on;
        });
        tabs.forEach(function (t, k) {
            if (k === idx) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
        });
        /* start loading the next slide's images so the crossfade never shows a blank */
        slides[(idx + 1) % slides.length].querySelectorAll('img[loading="lazy"]').forEach(function (img) { img.loading = 'eager'; });
    }

    function sync() {
        root.classList.toggle('is-playing', !stopped);
        root.classList.toggle('is-stopped', stopped);
        root.classList.toggle('is-paused', reasons.hover || reasons.focus || reasons.offscreen || reasons.hidden);
        if (pauseBtn) pauseBtn.setAttribute('aria-label', stopped ? 'Play slideshow' : 'Pause slideshow');
    }
    function set(reason, on) { reasons[reason] = on; sync(); }

    tabs.forEach(function (t, k) {
        var name = t.querySelector('.t');
        if (name) t.setAttribute('aria-label', 'Show ' + name.textContent);
        t.addEventListener('click', function () { go(k); });
    });
    root.querySelector('.hm-fs-prev').addEventListener('click', function () { go(idx - 1); });
    root.querySelector('.hm-fs-next').addEventListener('click', function () { go(idx + 1); });
    if (pauseBtn && !reduce) {
        pauseBtn.hidden = false;
        pauseBtn.addEventListener('click', function () { stopped = !stopped; sync(); });
    }

    root.addEventListener('animationend', function (e) {
        if (e.animationName === 'hm-fs-fill') go(idx + 1);
    });

    root.addEventListener('mouseenter', function () { set('hover', true); });
    root.addEventListener('mouseleave', function () { set('hover', false); });
    /* only keyboard focus pauses — a mouse click on prev / next shouldn't stop the slideshow */
    root.addEventListener('focusin', function () {
        var kb = false;
        try { kb = !!root.querySelector(':focus-visible'); } catch (err) { kb = true; }
        set('focus', kb);
    });
    root.addEventListener('focusout', function (e) { if (!root.contains(e.relatedTarget)) set('focus', false); });
    document.addEventListener('visibilitychange', function () { set('hidden', document.hidden); });
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) { set('offscreen', !entries[0].isIntersecting); }, { threshold: 0.4 }).observe(root);
    } else {
        reasons.offscreen = false;
    }

    root.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); go(idx + 1); }
    });

    var sx = null, sy = null;
    track.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    track.addEventListener('touchend', function (e) {
        if (sx === null) return;
        var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
        sx = sy = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(idx + (dx < 0 ? 1 : -1));
    }, { passive: true });

    go(0);
    sync();
})();
