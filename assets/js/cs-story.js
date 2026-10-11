/* Case study story: reveal on scroll, reading progress, chapter scrollspy,
   before/after slider, gallery tabs and screenshot lightbox. */
(function () {
    var root = document.getElementById('cs');
    if (!root) return;

    /* ── Reveal on scroll ── */
    if ('IntersectionObserver' in window) {
        root.classList.add('js');
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
        root.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });
    }

    /* ── Reading progress + chapter scrollspy ── */
    var bar = root.querySelector('.cs-progress');
    var links = Array.prototype.slice.call(root.querySelectorAll('.cs-toc a'));
    var chapters = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    var ticking = false;
    function onScroll() {
        var h = document.documentElement;
        var max = h.scrollHeight - h.clientHeight;
        if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, h.scrollTop / max) : 0) + ')';
        var current = -1;
        chapters.forEach(function (c, i) { if (c && c.getBoundingClientRect().top < window.innerHeight * 0.35) current = i; });
        links.forEach(function (a, i) { a.classList.toggle('is-active', i === current); });
        ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();

    /* ── Before / after slider ── */
    root.querySelectorAll('.ba').forEach(function (ba) {
        var range = ba.querySelector('input');
        if (!range) return;
        range.addEventListener('input', function () { ba.style.setProperty('--pos', range.value + '%'); });
        range.addEventListener('dblclick', function () { range.value = 50; ba.style.setProperty('--pos', '50%'); });
    });

    /* ── Tabs (gallery categories, persona switcher) — each tablist works independently ── */
    root.querySelectorAll('[role="tablist"]').forEach(function (list) {
        var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
        function selectTab(tab) {
            tabs.forEach(function (t) {
                var on = t === tab;
                t.setAttribute('aria-selected', on);
                t.tabIndex = on ? 0 : -1;
                document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
            });
            /* keep the chosen tab visible when the tab row scrolls sideways (phones) */
            if (list.scrollWidth > list.clientWidth) {
                list.scrollTo({ left: tab.offsetLeft - list.offsetLeft - 16, behavior: 'smooth' });
            }
        }
        var auto = autoplay(list, tabs, selectTab);
        tabs.forEach(function (t, i) {
            t.addEventListener('click', function () { auto.stop(); selectTab(t); });
            t.addEventListener('keydown', function (e) {
                var d = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ? -1 : 0;
                if (!d) return;
                e.preventDefault();
                auto.stop();
                var next = tabs[(i + d + tabs.length) % tabs.length];
                selectTab(next); next.focus();
            });
        });
    });

    /* Auto-advance a tablist marked data-autoplay="ms" until the visitor picks a tab.
       Pauses on hover/focus, while off-screen or in a background tab; off for reduced motion.
       The progress bar duration in home.css must match the data-autoplay value. */
    function autoplay(list, tabs, selectTab) {
        var noop = { stop: function () {} };
        var ms = parseInt(list.getAttribute('data-autoplay'), 10);
        if (!ms || tabs.length < 2) return noop;
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return noop;

        var area = list.parentElement, timer = null, started = 0, remaining = ms, stopped = false;
        var reasons = { offscreen: true, hover: false, focus: false, hidden: document.hidden };
        function paused() { return reasons.offscreen || reasons.hover || reasons.focus || reasons.hidden; }
        function current() { for (var k = 0; k < tabs.length; k++) { if (tabs[k].getAttribute('aria-selected') === 'true') return k; } return 0; }
        function advance() { remaining = ms; selectTab(tabs[(current() + 1) % tabs.length]); run(); }
        function run() { clearTimeout(timer); started = Date.now(); timer = setTimeout(advance, remaining); }
        function update() {
            if (stopped) return;
            var p = paused();
            if (p && timer) { clearTimeout(timer); timer = null; remaining = Math.max(0, remaining - (Date.now() - started)); }
            else if (!p && !timer) { run(); }
            list.classList.toggle('is-paused', p);
        }
        function set(reason, on) { reasons[reason] = on; update(); }

        list.classList.add('is-playing');
        area.addEventListener('mouseenter', function () { set('hover', true); });
        area.addEventListener('mouseleave', function () { set('hover', false); });
        area.addEventListener('focusin', function () { set('focus', true); });
        area.addEventListener('focusout', function (e) { if (!area.contains(e.relatedTarget)) set('focus', false); });
        document.addEventListener('visibilitychange', function () { set('hidden', document.hidden); });
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) { set('offscreen', !entries[0].isIntersecting); }, { threshold: 0.35 }).observe(area);
        } else { set('offscreen', false); }
        update();

        return { stop: function () {
            if (stopped) return;
            stopped = true; clearTimeout(timer); timer = null;
            list.classList.remove('is-playing', 'is-paused');
        } };
    }

    /* ── Filter chips (work pages): show cards whose data-cat matches ── */
    root.querySelectorAll('.wk-filters').forEach(function (bar) {
        var chips = Array.prototype.slice.call(bar.querySelectorAll('[data-filter]'));
        var cards = Array.prototype.slice.call(document.querySelectorAll(bar.getAttribute('data-target') + ' [data-cat]'));
        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                var f = chip.getAttribute('data-filter');
                chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip); });
                cards.forEach(function (card) { card.hidden = f !== 'all' && card.getAttribute('data-cat') !== f; });
            });
        });
    });

    /* ── "Read more" on clamped descriptions ── */
    root.querySelectorAll('[data-more]').forEach(function (btn) {
        var text = document.getElementById(btn.getAttribute('aria-controls'));
        if (!text) return;
        function fits() { return text.scrollHeight <= text.clientHeight + 2; }
        if (fits()) { btn.hidden = true; }
        btn.addEventListener('click', function () {
            var open = text.classList.toggle('is-open');
            btn.setAttribute('aria-expanded', open);
            btn.textContent = open ? 'Show less' : 'Read more';
        });
    });

    /* ── Carousel (testimonials): prev/next, dots, swipe, auto-advance ── */
    root.querySelectorAll('[data-carousel]').forEach(function (car) {
        var track = car.querySelector('.tm-car-track');
        var slides = Array.prototype.slice.call(car.querySelectorAll('.tm-slide'));
        var dots = Array.prototype.slice.call(car.querySelectorAll('[data-car-dot]'));
        var count = car.querySelector('.tm-car-count');
        if (!track || slides.length < 2) return;
        var idx = 0, timer = null, paused = false;
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        function go(i) {
            idx = (i + slides.length) % slides.length;
            track.style.transform = 'translateX(' + (-idx * 100) + '%)';
            slides.forEach(function (s, k) { s.setAttribute('aria-hidden', k !== idx); s.inert = k !== idx; });
            dots.forEach(function (d, k) { if (k === idx) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
            if (count) count.textContent = (idx + 1) + ' / ' + slides.length;
        }
        function start() { if (reduce || timer) return; timer = setInterval(function () { if (!paused && !document.hidden) go(idx + 1); }, 8000); }
        car.querySelector('[data-car-prev]').addEventListener('click', function () { go(idx - 1); });
        car.querySelector('[data-car-next]').addEventListener('click', function () { go(idx + 1); });
        dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); }); });
        car.addEventListener('mouseenter', function () { paused = true; });
        car.addEventListener('mouseleave', function () { paused = false; });
        car.addEventListener('focusin', function () { paused = true; });
        car.addEventListener('focusout', function () { paused = false; });
        car.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') go(idx - 1);
            else if (e.key === 'ArrowRight') go(idx + 1);
        });
        var sx = null;
        track.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', function (e) {
            if (sx === null) return;
            var dx = e.changedTouches[0].clientX - sx; sx = null;
            if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
        });
        go(0); start();
    });

    /* ── Horizontal screen rails with prev/next buttons ── */
    root.querySelectorAll('[data-rail]').forEach(function (wrap) {
        var rail = wrap.querySelector('.wk-rail');
        var prev = wrap.querySelector('[data-rail-prev]');
        var next = wrap.querySelector('[data-rail-next]');
        if (!rail) return;
        function step(dir) { rail.scrollBy({ left: dir * rail.clientWidth * 0.8, behavior: 'smooth' }); }
        function sync() {
            if (prev) prev.disabled = rail.scrollLeft <= 2;
            if (next) next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
        }
        if (prev) prev.addEventListener('click', function () { step(-1); });
        if (next) next.addEventListener('click', function () { step(1); });
        rail.addEventListener('scroll', function () { requestAnimationFrame(sync); }, { passive: true });
        window.addEventListener('resize', sync);
        sync();
    });

    /* ── Experience timeline: scroll-linked rail fill, passed nodes, live tenure ── */
    root.querySelectorAll('[data-since]').forEach(function (el) {
        var p = el.getAttribute('data-since').split('-');
        var now = new Date();
        var m = (now.getFullYear() - +p[0]) * 12 + now.getMonth() + 1 - +p[1];
        var y = Math.floor(m / 12), mo = m % 12;
        if (m < 1) return;
        el.textContent = (y ? y + (y > 1 ? ' yrs' : ' yr') : '') + (y && mo ? ' ' : '') + (mo ? mo + (mo > 1 ? ' mos' : ' mo') : '');
    });
    root.querySelectorAll('.hm-timeline').forEach(function (tl) {
        var jobs = Array.prototype.slice.call(tl.querySelectorAll('.hm-job'));
        var queued = false;
        function fill() {
            var r = tl.getBoundingClientRect();
            var mark = window.innerHeight * 0.6;
            tl.style.setProperty('--tl-p', Math.max(0, Math.min(1, (mark - r.top) / r.height)).toFixed(4));
            jobs.forEach(function (j) { j.classList.toggle('is-passed', j.getBoundingClientRect().top + 44 < mark); });
            queued = false;
        }
        window.addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(fill); } }, { passive: true });
        window.addEventListener('resize', fill);
        fill();
    });

    /* ── Lightbox ── */
    var lb = document.getElementById('lb');
    if (!lb) return;
    var lbImg = document.getElementById('lbImg');
    var lbCap = document.getElementById('lbCap');
    var lbCount = document.getElementById('lbCount');
    var lbStage = document.getElementById('lbStage');
    var items = [], cur = 0, opener = null;

    function show(i) {
        cur = (i + items.length) % items.length;
        var it = items[cur];
        lbStage.classList.remove('zoomed');
        lbImg.style.transform = '';
        lbImg.src = it.dataset.src;
        lbImg.alt = it.dataset.cap || '';
        lbCap.textContent = it.dataset.cap || '';
        lbCount.textContent = (cur + 1) + ' / ' + items.length;
    }
    function open(btn) {
        items = Array.prototype.slice.call(root.querySelectorAll('.shot-btn[data-group="' + btn.dataset.group + '"]'));
        opener = btn;
        show(items.indexOf(btn));
        lb.hidden = false;
        document.body.style.overflow = 'hidden';
        document.getElementById('lbClose').focus();
    }
    function close() {
        lb.hidden = true;
        lbImg.removeAttribute('src');
        document.body.style.overflow = '';
        if (opener) opener.focus();
    }
    root.addEventListener('click', function (e) {
        var trigger = e.target.closest('[data-open-group]');
        if (trigger) {
            var first = root.querySelector('.shot-btn[data-group="' + trigger.getAttribute('data-open-group') + '"]');
            if (first) { open(first); opener = trigger; }
            return;
        }
        var btn = e.target.closest('.shot-btn');
        if (btn) open(btn);
    });
    document.getElementById('lbClose').addEventListener('click', close);
    document.getElementById('lbPrev').addEventListener('click', function () { show(cur - 1); });
    document.getElementById('lbNext').addEventListener('click', function () { show(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target === lbStage) close(); });
    lbImg.addEventListener('click', function (e) {
        var zoomed = lbStage.classList.toggle('zoomed');
        if (zoomed) {
            var r = lbImg.getBoundingClientRect();
            lbImg.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + '% ' + ((e.clientY - r.top) / r.height * 100) + '%';
            lbImg.style.transform = 'scale(2.2)';
        } else {
            lbImg.style.transform = '';
        }
    });
    document.addEventListener('keydown', function (e) {
        if (lb.hidden) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') show(cur - 1);
        else if (e.key === 'ArrowRight') show(cur + 1);
        else if (e.key === 'Tab') {
            /* keep focus inside the viewer while it is open */
            var f = Array.prototype.slice.call(lb.querySelectorAll('button:not([disabled])'));
            var i = f.indexOf(document.activeElement);
            if (e.shiftKey ? i <= 0 : i === f.length - 1) { e.preventDefault(); f[e.shiftKey ? f.length - 1 : 0].focus(); }
        }
    });
})();
