/* ============================================
   PERFORMANCE.JS — Add to all pages
   ============================================ */

(function () {
    "use strict";

    // --- Fade in lazy images when they load ---
    document.addEventListener("DOMContentLoaded", function () {
        var lazyImgs = document.querySelectorAll('img[loading="lazy"]');
        lazyImgs.forEach(function (img) {
            if (img.complete) {
                img.classList.add("loaded");
            } else {
                img.addEventListener("load", function () {
                    img.classList.add("loaded");
                });
            }
        });
    });

    // --- Fallback IntersectionObserver for browsers that don't support loading="lazy" ---
    if (!("loading" in HTMLImageElement.prototype)) {
        var lazyImages = document.querySelectorAll('img[loading="lazy"]');
        var imageObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    img.classList.add("loaded");
                    imageObserver.unobserve(img);
                }
            });
        });
        lazyImages.forEach(function (img) {
            imageObserver.observe(img);
        });
    }
})();