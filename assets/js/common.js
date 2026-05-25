( function( $ ) {
	'use strict';

(function () {
      /* TAB FILTER */
      const tabs   = document.querySelectorAll('.g-tab');
      const groups = document.querySelectorAll('.gallery-group');
     
      function applyFilter(filter) {
        groups.forEach(g => {
          g.classList.toggle('hidden', g.dataset.category !== filter);
        });
        buildIndex();
      }
     
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          applyFilter(tab.dataset.filter);
        });
      });
     
      /* activate first tab on load */
      const firstTab = document.querySelector('.g-tab.active');
      if (firstTab) applyFilter(firstTab.dataset.filter);
     
      /* LIGHTBOX */
      const lb      = document.getElementById('g-lightbox');
      const lbImg   = document.getElementById('g-lightbox-img');
      const lbStage = document.getElementById('g-lightbox-stage');
      const lbCount = document.getElementById('lb-counter');
      const lbLabel = document.getElementById('lb-zoom-label');
     
      let items = [], cur = 0, scale = 1, tx = 0, ty = 0;
      let drag = false, sx = 0, sy = 0, ox = 0, oy = 0;
     
      function buildIndex(items) {
        items = Array.from(document.querySelectorAll('.gallery-group:not(.hidden) .g-item'));
      }
     
      function applyT(anim) {
        lbImg.style.transition = anim ? 'transform 0.2s ease' : 'none';
        lbImg.style.transform  = `translate(${tx}px,${ty}px) scale(${scale})`;
        lbLabel.textContent    = Math.round(scale * 100) + '%';
      }
     
      function resetZ(anim) { scale=1; tx=0; ty=0; applyT(anim); }
     
      function zoom(d) { scale = Math.min(5, Math.max(0.5, scale + d)); applyT(false); }
     
      function open(i) {
        cur = i;
        lbImg.src = items[cur].dataset.src;
        lbImg.style.opacity = '1';
        lbCount.textContent = (cur+1) + ' / ' + items.length;
        resetZ(false);
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
     
      function close() {
        lb.classList.remove('open');
        document.body.style.overflow = '';
        lbImg.src = '';
      }
     
      function nav(d) {
        cur = (cur + d + items.length) % items.length;
        lbImg.style.opacity = '0';
        setTimeout(() => {
          lbImg.src = items[cur].dataset.src;
          lbCount.textContent = (cur+1) + ' / ' + items.length;
          resetZ(false);
          lbImg.style.opacity = '1';
        }, 150);
      }
     
      document.querySelector('.m-gallery').addEventListener('click', e => {
        const item = e.target.closest('.g-item');
        if (!item) return;
        buildIndex();
        open(items.indexOf(item));
      });
     
      document.getElementById('lb-close').addEventListener('click', close);
      lb.addEventListener('click', e => { if (e.target === lb) close(); });
      document.getElementById('lb-prev').addEventListener('click', e => { e.stopPropagation(); nav(-1); });
      document.getElementById('lb-next').addEventListener('click', e => { e.stopPropagation(); nav(1); });
      document.getElementById('lb-zoom-in').addEventListener('click',  e => { e.stopPropagation(); zoom(0.3); });
      document.getElementById('lb-zoom-out').addEventListener('click', e => { e.stopPropagation(); zoom(-0.3); });
      document.getElementById('lb-reset').addEventListener('click',    e => { e.stopPropagation(); resetZ(true); });
     
      document.addEventListener('keydown', e => {
        if (!lb.classList.contains('open')) return;
        if (e.key==='Escape') close();
        else if (e.key==='ArrowLeft') nav(-1);
        else if (e.key==='ArrowRight') nav(1);
        else if (e.key==='+'||e.key==='=') zoom(0.2);
        else if (e.key==='-') zoom(-0.2);
      });
     
      lbStage.addEventListener('wheel', e => { e.preventDefault(); zoom(e.deltaY<0?0.15:-0.15); }, {passive:false});
     
      lbStage.addEventListener('mousedown', e => {
        if (scale<=1) return;
        drag=true; lbStage.classList.add('dragging');
        sx=e.clientX; sy=e.clientY; ox=tx; oy=ty;
      });
      document.addEventListener('mousemove', e => {
        if (!drag) return;
        tx=ox+(e.clientX-sx); ty=oy+(e.clientY-sy); applyT(false);
      });
      document.addEventListener('mouseup', () => { drag=false; lbStage.classList.remove('dragging'); });
     
      let lastD=0;
      lbStage.addEventListener('touchstart', e => {
        if (e.touches.length===2) lastD=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
        else if (e.touches.length===1&&scale>1){drag=true;sx=e.touches[0].clientX;sy=e.touches[0].clientY;ox=tx;oy=ty;}
      },{passive:true});
      lbStage.addEventListener('touchmove', e => {
        if (e.touches.length===2){const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);zoom((d-lastD)*0.01);lastD=d;}
        else if(drag&&e.touches.length===1){tx=ox+(e.touches[0].clientX-sx);ty=oy+(e.touches[0].clientY-sy);applyT(false);}
      },{passive:true});
      lbStage.addEventListener('touchend',()=>{drag=false;});
     
      lbStage.addEventListener('dblclick', e => {
        e.stopPropagation();
        scale>1?resetZ(true):(scale=2.5,applyT(true));
      });
     
      buildIndex();
    })();

/**
	Preloader
**/
$(window).on("load", function() {
	$('body').imagesLoaded( {}, function() {
		var preload = $('.preloader');
		preload.addClass('loaded');
		preload.find('.centrize').fadeOut();

		/**
			init Cursor
		**/
		initCursor();

		/**
			init Scrolla
		**/
		$('.elementor-widget-text-editor').attr('data-animate','active');
		$('.scroll-animate').scrolla({
			once: true,
			mobile: true
		});

	});
});

$(function() {
$('.tp-header-dropdown nav ul li').each(function() {
	if ($(this).find('.mega-menu').length > 0) {
		$(this).addClass('p-static');
	}
});
});


$(document).ready(function () {
    $("#arunModalOpen").click(function () {
       $("#arunkumar").modal("show");
    });
      
    $("#arunModalClose").click(function () {
       $("#arunkumar").modal("hide");
    });
    $("#preetamModalOpen").click(function () {
       $("#preetamrao").modal("show");
    }); 
    $("#preetamModalClose").click(function () {
       $("#preetamrao").modal("hide");
    });
    $("#anuragModalOpen").click(function () {
       $("#anuragyadav").modal("show");
    });
    $("#anuragModalClose").click(function () {
       $("#anuragyadav").modal("hide");
    });
    $("#abhiModalOpen").click(function () {
       $("#abhisheksharma").modal("show");
    });
    $("#abhiModalClose").click(function () {
       $("#abhisheksharma").modal("hide");
    });
    $("#ankitModalOpen").click(function () {
       $("#ankitjoshi").modal("show");
    });
      
    $("#ankitModalClose").click(function () {
       $("#ankitjoshi").modal("hide");
    });
    $("#pavanModalOpen").click(function () {
       $("#pavanverma").modal("show");
    });
    $("#pavanModalClose").click(function () {
       $("#pavanverma").modal("hide");
    });

    $("#harshModalOpen").click(function () {
       $("#harshkumar").modal("show");
    });
    $("#harshModalClose").click(function () {
       $("#harshkumar").modal("hide");
    });
    $("#karanModalOpen").click(function () {
       $("#karanasthana").modal("show");
    });
    $("#karanModalClose").click(function () {
       $("#karanasthana").modal("hide");
    });
    $("#rajeshModalOpen").click(function () {
       $("#rajeshkumar").modal("show");
    });
      
    $("#rajeshModalClose").click(function () {
       $("#rajeshkumar").modal("hide");
    });
    $("#abhishekModalOpen").click(function () {
       $("#abhishekdutta").modal("show");
    });
      
    $("#abhishekModalClose").click(function () {
       $("#abhishekdutta").modal("hide");
    });
});

$(function() {
	'use strict';

	/**
		Sections full height
	**/
	setHeightFullSection();
	$(window).resize(function() {
		setHeightFullSection();
	});

	/**
		Parallax
	**/
	$('.js-parallax').jarallax({
		speed: 0.65,
		type: 'scroll'
	});

	/**
		Block Line
	**/
	if ($('.v-line').length) {
		$('.v-line .container').append('<div class="v-line-block"><span></span></div>');
		$('.v-line .hero-started').append('<div class="v-line-block"><span></span></div>');
	}

	/**
		Splitting
	**/
	Splitting();

	/**
		Skrollr
	**/
	if ($(window).width() > 1200 ) {
	var s = skrollr.init();
	}

	/*
		Typed
	*/
	$('.subtitle.subtitle-typed').each(function(){
		var subtitleContainer = $(this);

		subtitleContainer.typed({
			stringsElement: subtitleContainer.find('.typing-title'),
			backDelay: 3500, /* Delay in text change */
			typeSpeed: 0, /* Typing speed */
			loop: true
		});
	});

	/**
		Header Sticky
	**/
	if($('.header').length) {
		$(window).on('scroll', function(event){

			if ( $(window).scrollTop() > 100 ) {
				$('.header').addClass('sticky');
				if ( this.oldScroll < this.scrollY ) {
					$('.header').addClass('animate-in');
				} else {
					if ( $(window).scrollTop() < 200 ) {
						$('.header').addClass('animate-out');
					}
				}
			} else {
				$('.header').removeClass('sticky');
				$('.header').removeClass('animate-in');
				$('.header').removeClass('animate-out');
			}

			this.oldScroll = this.scrollY;
		});
	}

	function checkScrollDirectionIsUp(event) {
		if (event.wheelDelta) {
			return event.wheelDelta > 0;
		}
		return event.deltaY < 0;
	}

	/**
		Header Switcher Button
	**/
	var skin = $.cookie('skin');
	if ( skin == 'light' ) {
		$('body').removeClass('dark-skin');
		$('body').addClass('light-skin');
	}
	if ( skin == 'dark' ) {
		$('body').removeClass('light-skin');
		$('body').addClass('dark-skin');
	}

	if ( $('body').hasClass('dark-skin') ) {
		$('.header .switcher-btn').addClass('active');
	}
	$('.header').on('click', '.switcher-btn', function(){
		if($(this).hasClass('active')) {
			$(this).removeClass('active');
			$('body').removeClass('dark-skin');
			$('body').addClass('light-skin');
			$.cookie('skin', 'light', { expires: 7, path: '/' });
		}
		else {
			$(this).addClass('active');
			$('body').removeClass('light-skin');
			$('body').addClass('dark-skin');
			$.cookie('skin', 'dark', { expires: 7, path: '/' });
		}
		return false;
	});

	/**
		Header Menu Button
	**/
	$('.header').on('click', '.menu-btn', function(){
		if($(this).hasClass('active')) {
			$(this).removeClass('active');
			$(this).addClass('no-touch');
			$('.menu-overlay').addClass('no-touch');
			$('body').removeClass('no-scroll');
			$('.menu-full-overlay').removeClass('is-open');
			$('.menu-full-overlay').removeClass('has-scroll');
			$('.menu-full-overlay').removeClass('animate-active');
			setTimeout(function(){
				$('.menu-full-overlay').removeClass('visible');
				$('.menu-btn').removeClass('no-touch');
				$('.menu-overlay').removeClass('no-touch');
			}, 1000);
		}
		else {
			$(this).addClass('active no-touch');
			$('.menu-overlay').addClass('no-touch');
			var height = $(window).height();
			$('.menu-full-overlay').css({'height': height});
			$('body').addClass('no-scroll');
			$('.menu-full-overlay').addClass('is-open visible');
			setTimeout(function(){
				$('.menu-full-overlay').addClass('has-scroll animate-active');
				$('.menu-btn').removeClass('no-touch');
				$('.menu-overlay').removeClass('no-touch');
			}, 1000);
		}
		return false;
	});
	$('.menu-full-overlay').on('click', '.menu-overlay', function(){
		$('.menu-btn').removeClass('active');
		$('.menu-btn').addClass('no-touch');
		$('.menu-overlay').addClass('no-touch');
		$('body').removeClass('no-scroll');
		$('.menu-full-overlay').removeClass('is-open');
		$('.menu-full-overlay').removeClass('has-scroll');
		$('.menu-full-overlay').removeClass('animate-active');
		setTimeout(function(){
			$('.menu-full-overlay').removeClass('visible');
			$('.menu-btn').removeClass('no-touch');
			$('.menu-overlay').removeClass('no-touch');
		}, 1000);
		return false;
	});

	/*
		Top Menu
	*/
	$('.menu-full').on('click', 'a', function(){
		if (!$(this).parent().hasClass('has-children')){
			$('.header .menu-btn.active').trigger('click');
		}
	});

	/*
		Header Menu Dropdown
	*/
	$('.menu-full .has-children > a').append('<i class="fas fa-chevron-down"></i>');
	$('.menu-full').on('click', '.has-children > a', function(){
		if($(this).closest('li').hasClass('opened')) {
			$(this).closest('li').removeClass('opened');
			$(this).closest('li').addClass('closed');
			$(this).closest('li').find('> ul').slideUp();
		} else {
			$(this).closest('ul').find('> li').removeClass('closed').removeClass('opened');
			$(this).closest('ul').find('> li').find('> ul').slideUp();
			$(this).closest('li').addClass('opened');
			$(this).closest('li').find('> ul').slideDown();
		}
		return false;
	});

	/*
		Carousel Services
	*/
  var swiperServices = new Swiper('.js-services', {
    slidesPerView: 3,
	  spaceBetween: 40,
		watchSlidesVisibility: true,
		noSwipingSelector: 'a',
		loop: false,
		speed: 1000,
		pagination: {
			el: '.swiper-pagination',
			type: 'bullets',
			clickable: true,
		},
		navigation: false,
		breakpoints: {
			// when window width is >= 320px
			0: {
				slidesPerView: 1,
				spaceBetween: 20
			},
			// when window width is >= 480px
			767: {
				slidesPerView: 2,
				spaceBetween: 30
			},
			// when window width is >= 640px
			1024: {
				slidesPerView: 3,
				spaceBetween: 40
			}
		}
	});

	/*
		Carousel Testimonials
	*/
	var swiperTestimonials = new Swiper('.js-testimonials', {
    slidesPerView: 3,
	  spaceBetween: 40,
		watchSlidesVisibility: true,
		noSwipingSelector: 'a',
		loop: false,
		speed: 1000,
		pagination: {
			el: '.swiper-pagination',
			type: 'bullets',
			clickable: true,
		},
		navigation: false,
		breakpoints: {
			// when window width is >= 320px
			0: {
				slidesPerView: 1,
				spaceBetween: 20
			},
			// when window width is >= 480px
			767: {
				slidesPerView: 2,
				spaceBetween: 30
			},
			// when window width is >= 640px
			1024: {
				slidesPerView: 3,
				spaceBetween: 40
			}
		}
	});

	/*
		Initialize portfolio items
	*/
	var $container = $('.works-items');
	$container.imagesLoaded(function() {
		$container.isotope({
			itemSelector: '.works-col',
			percentPosition: true,
		});
	});

	var $gal_container = $('.m-gallery');
	$gal_container.imagesLoaded(function() {
		$gal_container.isotope({
			itemSelector: '.col-lg-6',
			percentPosition: true,
		});
	});

	/*
		Filter items on button click
	*/
	$('.filter-links').on( 'click', 'a', function() {
		var filterValue = $(this).attr('data-href');
		$container.isotope({ filter: filterValue });

		$('.filter-links a').removeClass('active');
		$(this).addClass('active');

		if (!$(filterValue).find('.scroll-animate').hasClass('animate__active')) {
			$(filterValue).find('.scroll-animate').addClass('animate__active');
		}

		return false;
	});

	$('.has-popup-image').magnificPopup({
		type: 'image',
		closeOnContentClick: true,
		mainClass: 'mfp-img-mobile',
		image: {
			verticalFit: true
		}
	});

	/*
		Video popup
	*/
	$('.has-popup-video').magnificPopup({
		disableOn: 700,
		type: 'iframe',
		iframe: {
            patterns: {
                youtube_short: {
                  index: 'youtu.be/',
                  id: 'youtu.be/',
                  src: 'https://www.youtube.com/embed/%id%?autoplay=1'
                }
            }
        },
		removalDelay: 160,
		preloader: false,
		fixedContentPos: false,
		mainClass: 'mfp-fade',
		callbacks: {
			markupParse: function(template, values, item) {
				template.find('iframe').attr('allow', 'autoplay');
			}
		}
	});

	/*
		Music popup
	*/
	$('.has-popup-audio').magnificPopup({
		disableOn: 700,
		type: 'iframe',
		removalDelay: 160,
		preloader: false,
		fixedContentPos: false,
		mainClass: 'mfp-fade'
	});

	/**
		Tabs
	**/
	$('.tab-menu').on('click', '.tab-btn', function(){
		var tab_bl = $(this).attr('href');

		$(this).closest('.tab-menu').find('li').removeClass('active');
		$(this).closest('li').addClass('active');

		$(this).closest('.tabs').find('> .tab-item').hide();
		$(tab_bl).fadeIn();

		return false;
	});

	/**
		Collapse
	**/
	$('.lui-collapse-item').on('click', '.lui-collapse-btn', function(){
		if($(this).closest('.lui-collapse-item').hasClass('opened')) {
			$(this).closest('.lui-collapse-item').removeClass('opened');
			$(this).removeClass('active');
		}
		else {
			$(this).closest('.lui-collapse-item').addClass('opened');
			$(this).addClass('active');
		}
	});

	/**
		Video
	**/
	$('.m-video-large .video').on('click', '.play, .img', function(){
		$(this).closest('.video').addClass('active');
		var iframe = $(this).closest('.video').find('.js-video-iframe');
		largeVideoPlay(iframe);
		return false;
	});
	function largeVideoPlay( iframe ) {
		var src = iframe.data('src');
		iframe.attr('src', src);
	}

	/**
		Cart Popup
	**/
	$('.header .cart-btn .cart-icon').on('click', function(){
		if($(this).closest('.cart-btn').hasClass('opened')){
			$(this).closest('.cart-btn').removeClass('opened');
			$(this).closest('.cart-btn').find('.cart-widget').hide();
		} else {
			$(this).closest('.cart-btn').addClass('opened');
			$(this).closest('.cart-btn').find('.cart-widget').fadeIn();
		}
		return false;
	});

});

const hoverItem = document.querySelectorAll(".hover-reveal-item");
    function moveImage(e, hoverItem) {
        const item = hoverItem.getBoundingClientRect();
        const x = e.clientX - item.x;
        const y = e.clientY - item.y;
        if (hoverItem.children[1]) {
            hoverItem.children[1].style.transform = `translate(${x}px, ${y}px)`;
        }
    }
    hoverItem.forEach((item, i) => {
        item.addEventListener("mousemove", (e) => {
            setInterval(moveImage(e, item), 100);
        });
    });

    // 19. Work Pin Section
    let tl = gsap.timeline();
    let pr = gsap.matchMedia();
    pr.add("(min-width: 767px)", () => {
    let otherSections = document.querySelectorAll('.sa-work-panel')
        otherSections.forEach((section, index) => {
            gsap.set(otherSections, {
                scale: 1,
            });
            tl.to(section, {
                scale: .8,
                scrollTrigger: {
                    trigger: section,
                    pin: section,
                    scrub: 1,
                    start: 'top 0',
                    end: "bottom 60%",
                    endTrigger: '.sa-work-wrap',
                    pinSpacing: false,
                    markers: false,
                },
            })
        })
    });   

function initCursor() {
	var mouseX=window.innerWidth/2, mouseY=window.innerHeight/2;

	var cursor = {
		el: $('.cursor'),
		x: window.innerWidth/2,
		y: window.innerHeight/2,
		w: 30,
		h: 30,
		update:function() {
			var l = this.x-this.w/2;
			var t = this.y-this.h/2;
			this.el.css({ 'transform':'translate3d('+l+'px,'+t+'px, 0)' });
		}
	}

	$(window).mousemove (function(e) {
		mouseX = e.clientX;
		mouseY = e.clientY;
	});

	$('a, .swiper-pagination, .swiper-button-prev, .swiper-button-next, button, .button, .btn, .lnk').hover(function() {
		$('.cursor').addClass("cursor-zoom");
	}, function(){
		$('.cursor').removeClass("cursor-zoom");
	});

	setInterval(move,1000/60);

	function move() {
		cursor.x = lerp (cursor.x, mouseX, 0.1);
		cursor.y = lerp (cursor.y, mouseY, 0.1);
		cursor.update()
	}

	function lerp (start, end, amt) {
		return (1-amt)*start+amt*end
	}
}

function setHeightFullSection() {
	var width = $(window).width();
	var height = $(window).height();

	/* Set full height in started blocks */
	$('.error-page, .menu-full-overlay, .preloader .centrize').css({'height': height});
}

} )( jQuery );
