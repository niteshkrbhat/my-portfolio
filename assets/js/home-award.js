/* Home award: scroll-scrubbed scene. The stage pins while the trophy drops from the top of the
   section to the centre, then each point draws a connector out of the trophy and lands beside it.
   Only on large screens without reduced motion; otherwise the static layout in home.css is used. */
(function () {
    var sec = document.getElementById('award-section');
    if (!sec || !window.matchMedia) return;
    var stage = sec.querySelector('.hm-award-stage');
    var area = sec.querySelector('.hm-award-in');
    var trophy = sec.querySelector('.hm-award-trophy');
    var img = sec.querySelector('.hm-award-img');
    var svg = sec.querySelector('.hm-award-links');
    var cards = Array.prototype.slice.call(sec.querySelectorAll('.hm-award-in li'));
    if (!stage || !area || !trophy || !img || !svg || !cards.length) return;

    var NS = 'http://www.w3.org/2000/svg';
    var mq = window.matchMedia('(min-width: 1024px) and (min-height: 660px) and (prefers-reduced-motion: no-preference)');
    /* Where each connector meets the trophy, as fractions of the image box (left flame / blue flame edges). */
    var ANCHORS = [[.3, .37], [.69, .37], [.345, .64], [.69, .64]];
    var DROP_START = .04, DROP_END = .44;     // trophy fall; it lands after the stage has pinned
    var CARD_START = .48, CARD_STEP = .09, CARD_LEN = .16;

    var SMOOTH = .1;                          // share of the gap to the scroll position closed per 60fps frame

    var links = [], dropFrom = 0, on = false;
    var cur = 0, goal = 0, last = 0, running = false;

    function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function range(p, a, b) { return clamp((p - a) / (b - a)); }
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
    function easeInOut(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

    /* Layout position relative to .hm-award-in, ignoring the transforms we animate */
    function pos(el) {
        var x = 0, y = 0;
        while (el && el !== area) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
        return { x: x, y: y };
    }

    function el(name, attrs, parent) {
        var n = document.createElementNS(NS, name);
        for (var k in attrs) n.setAttribute(k, attrs[k]);
        parent.appendChild(n);
        return n;
    }

    function build() {
        svg.innerHTML = '';
        links = cards.map(function () {
            var g = el('g', {}, svg);
            return {
                g: g,
                line: el('path', { 'class': 'aw-line', pathLength: 1 }, g),
                flow: el('path', { 'class': 'aw-flow', pathLength: 1 }, g),
                start: el('circle', { 'class': 'aw-node', r: 4 }, g),
                end: el('circle', { r: 4.5 }, g)
            };
        });
    }

    function layout() {
        var ip = pos(img), iw = img.offsetWidth, ih = img.offsetHeight;
        /* start fully above the top edge of the section (the stage clips it) */
        dropFrom = -(area.offsetTop + ip.y + ih);
        cards.forEach(function (card, i) {
            var a = ANCHORS[i % ANCHORS.length];
            var ax = ip.x + iw * a[0], ay = ip.y + ih * a[1];
            var cp = pos(card), left = i % 2 === 0;
            var cx = left ? cp.x + card.offsetWidth : cp.x, cy = cp.y + card.offsetHeight / 2;
            var mx = (ax + cx) / 2;
            var d = 'M' + ax + ',' + ay + ' C' + mx + ',' + ay + ' ' + mx + ',' + cy + ' ' + cx + ',' + cy;
            var l = links[i];
            l.line.setAttribute('d', d);
            l.flow.setAttribute('d', d);
            l.start.setAttribute('cx', ax); l.start.setAttribute('cy', ay);
            l.end.setAttribute('cx', cx); l.end.setAttribute('cy', cy);
        });
        /* in-page links (#award-section) land on the finished scene */
        sec.style.scrollMarginTop = -(sec.offsetHeight - window.innerHeight) + 'px';
        cur = goal = progress();
        render(cur);
    }

    /* 0 when the section top is 40% into the viewport, 1 when the pin releases */
    function progress() {
        var vh = window.innerHeight;
        return clamp((vh * .6 - sec.getBoundingClientRect().top) / (sec.offsetHeight - vh + vh * .6));
    }

    function render(p) {
        var t = range(p, DROP_START, DROP_END);
        var y = easeInOut(t), e = easeOut(t);
        img.style.opacity = range(t, .1, .55).toFixed(3); // still faint while it passes the heading
        img.style.transform = 'translate3d(0,' + (dropFrom * (1 - y)).toFixed(2) + 'px,0) rotate(' + (-12 * (1 - e)).toFixed(3) + 'deg) scale(' + (.82 + .18 * e).toFixed(4) + ')';
        trophy.style.setProperty('--aw-land', range(t, .8, 1).toFixed(3));

        cards.forEach(function (card, i) {
            var a = CARD_START + i * CARD_STEP;
            var lp = easeOut(range(p, a, a + CARD_LEN * .55));          // connector draws out of the trophy
            var cp = easeOut(range(p, a + CARD_LEN * .4, a + CARD_LEN)); // then the card lands at its end
            var dir = i % 2 === 0 ? 1 : -1;                             // slide in from the trophy side
            var l = links[i];
            l.line.style.strokeDashoffset = (1 - lp).toFixed(4);
            l.start.style.transform = 'scale(' + clamp(lp * 5).toFixed(3) + ')';
            l.end.style.transform = 'scale(' + range(lp, .8, 1).toFixed(3) + ')';
            l.g.classList.toggle('is-live', cp > .98);
            card.style.opacity = cp.toFixed(3);
            card.style.transform = 'translate3d(' + (dir * 64 * (1 - cp)).toFixed(2) + 'px,0,0) scale(' + (.92 + .08 * cp).toFixed(4) + ')';
        });
    }

    /* Ease the scene toward the scroll position each frame, so wheel steps glide instead of jumping */
    function tick(now) {
        var dt = Math.min(64, now - last);
        last = now;
        cur += (goal - cur) * (1 - Math.pow(1 - SMOOTH, dt / 16.67));
        if (Math.abs(goal - cur) < .0003) cur = goal;
        render(cur);
        if (cur !== goal && on) requestAnimationFrame(tick); else running = false;
    }

    function queue() {
        if (!on) return;
        goal = progress();
        if (!running && goal !== cur) { running = true; last = performance.now(); requestAnimationFrame(tick); }
    }

    function reset() {
        sec.style.scrollMarginTop = '';
        img.style.opacity = img.style.transform = '';
        trophy.style.removeProperty('--aw-land');
        cards.forEach(function (c) { c.style.opacity = c.style.transform = ''; });
    }

    function sync() {
        if (mq.matches === on) return;
        on = mq.matches;
        sec.classList.toggle('is-pinned', on);
        if (on) {
            img.loading = 'eager'; // it starts clipped above the stage, so lazy loading would wait too long
            build();
            layout();
        } else {
            svg.innerHTML = '';
            reset();
        }
    }

    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', function () { if (on) layout(); });
    if (mq.addEventListener) mq.addEventListener('change', sync); else mq.addListener(sync);
    img.addEventListener('load', function () { if (on) layout(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (on) layout(); });
    sync();
})();
