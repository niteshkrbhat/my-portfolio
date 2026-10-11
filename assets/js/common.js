( function( $ ) {
	'use strict';
/**
	Preloader
**/
/* No imagesLoaded wait here: on <body> it re-requests every image that isn't loaded yet,
   which force-downloads all lazy images. Window load already covers the eager ones. */
$(window).on("load", function() {
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
	if ($.fn.scrolla) {
		$('.elementor-widget-text-editor').attr('data-animate','active');
		$('.scroll-animate').scrolla({
			once: true,
			mobile: true
		});
	}
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
	if ($.fn.jarallax) {
		$('.js-parallax').jarallax({
			speed: 0.65,
			type: 'scroll'
		});
	}

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
	if (window.Splitting) {
		Splitting();
	}

	/**
		Skrollr
	**/
	if (window.skrollr && $(window).width() > 1200 ) {
	var s = skrollr.init();
	}

	/*
		Typed
	*/
	if ($.fn.typed) $('.subtitle.subtitle-typed').each(function(){
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
		var $header = $('.header'), $win = $(window);
		$win.on('scroll', function(event){
			var top = $win.scrollTop();

			if ( top > 100 ) {
				$header.addClass('sticky');
				if ( this.oldScroll < this.scrollY ) {
					$header.addClass('animate-in');
				} else {
					if ( top < 200 ) {
						$header.addClass('animate-out');
					}
				}
			} else {
				$header.removeClass('sticky animate-in animate-out');
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
	function syncSwitcher() {
		$('.header .switcher-btn').attr('aria-pressed', $('body').hasClass('dark-skin') ? 'true' : 'false');
	}
	syncSwitcher();
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
		syncSwitcher();
		return false;
	});
	/* the switcher and menu button are <a role="button">: Space should activate them too */
	$('.header').on('keydown', '.switcher-btn, .menu-btn', function(e){
		if (e.key === ' ') { e.preventDefault(); $(this).trigger('click'); }
	});

	/**
		Header Menu Button
	**/
	$('.header').on('click', '.menu-btn', function(){
		if($(this).hasClass('active')) {
			$(this).removeClass('active');
			$(this).attr({ 'aria-expanded': 'false', 'aria-label': 'Open menu' });
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
			$(this).attr({ 'aria-expanded': 'true', 'aria-label': 'Close menu' });
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
		$('.menu-btn').attr({ 'aria-expanded': 'false', 'aria-label': 'Open menu' });
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
	/* Escape closes the full-screen menu and returns focus to its button */
	$(document).on('keydown', function(e){
		if (e.key === 'Escape' && $('.header .menu-btn.active').length) {
			$('.header .menu-btn.active').trigger('click').trigger('focus');
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
			$(this).attr('aria-expanded', 'false');
		} else {
			$(this).closest('ul').find('> li').removeClass('closed').removeClass('opened');
			$(this).closest('ul').find('> li').find('> ul').slideUp();
			$(this).closest('ul').find('> li.has-children > a').attr('aria-expanded', 'false');
			$(this).closest('li').addClass('opened');
			$(this).closest('li').find('> ul').slideDown();
			$(this).attr('aria-expanded', 'true');
		}
		return false;
	});

	/*
		Carousel Services
	*/
  if (window.Swiper && $('.js-services').length) var swiperServices = new Swiper('.js-services', {
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
	if (window.Swiper && $('.js-testimonials').length) var swiperTestimonials = new Swiper('.js-testimonials', {
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
	if ($container.length && $.fn.imagesLoaded && $.fn.isotope) {
		$container.imagesLoaded(function() {
			$container.isotope({
				itemSelector: '.works-col',
				percentPosition: true,
			});
		});
	}

	var $gal_container = $('.m-gallery');
	if ($gal_container.length && $.fn.imagesLoaded && $.fn.isotope) {
		$gal_container.imagesLoaded(function() {
			$gal_container.isotope({
				itemSelector: '.col-lg-6',
				percentPosition: true,
			});
		});
	}

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

	if ($.fn.magnificPopup) {
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
	}

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
            moveImage(e, item);
        });
    });

    // 19. Work Pin Section
    if (window.gsap && document.querySelector('.sa-work-panel')) {
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
    }

function initCursor() {
	/* mouse-follow circle: only for a real mouse, and not when reduced motion is requested */
	var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
	var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (!fine || calm) { $('.cursor').hide(); return; }

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

	requestAnimationFrame(move);

	function move() {
		cursor.x = lerp (cursor.x, mouseX, 0.1);
		cursor.y = lerp (cursor.y, mouseY, 0.1);
		cursor.update();
		requestAnimationFrame(move);
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
