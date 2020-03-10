/**
 *  Obj
 * @type {Object}
 */

let Obj = {};

(function($) {
    "use strict";

    /************************************************************
     * Predefined letiables
     *************************************************************/
    let $window = $(window),
    $body       = $('body'),
    $html       = $('html'),
    $document   = $(document),
    screen      = $window.outerWidth();

    /**
     * exists - TuanNA
     * @return true
     */
    $.fn.exists = function() {
        return this.length > 0;
    };

    /**
     * isMobile - Check mobile screen - TuanNA
     * @return void
     */
    $.fn.isMobile = function() {
        let $screen = $window.outerWidth();

        if ( $screen < 769 ) {
            return true;
        }
        return false;
    };

    /**
     * uaSetting - TuanNA
     * @return void
     */
    Obj.uaSetting = function() {
        let _ua = (function(u) {
            return {
                Tablet: (u.indexOf('windows') !== -1 && u.indexOf('touch') !== -1 && u.indexOf('tablet pc') === -1) ||
                    u.indexOf('ipad') !== -1 ||
                    (u.indexOf('android') !== -1 && u.indexOf('mobile') === -1) ||
                    (u.indexOf('firefox') !== -1 && u.indexOf('tablet') !== -1) ||
                    u.indexOf('kindle') !== -1 ||
                    u.indexOf('silk') !== -1 ||
                    u.indexOf('playbook') !== -1,
                Mobile: (u.indexOf('windows') !== -1 && u.indexOf('phone') !== -1) ||
                    u.indexOf('iphone') !== -1 ||
                    u.indexOf('ipod') !== -1 ||
                    (u.indexOf('android') !== -1 && u.indexOf('mobile') !== -1) ||
                    (u.indexOf('firefox') !== -1 && u.indexOf('mobile') !== -1) ||
                    u.indexOf('blackberry') !== -1,
            }
        })(window.navigator.userAgent.toLowerCase());
        if (_ua.Tablet || _ua.Mobile) {
            $body.addClass('sp');
        }
    }

    /**
     * common
     * @return {[type]}
     */
    Obj.common = function() {
        $("input[placeholder]").each(function () {
            $(this).attr("data-placeholder", this.placeholder);

            $(this).bind("focus", function () {
                this.placeholder = '';
            });
            $(this).bind("blur", function () {
                this.placeholder = $(this).attr("data-placeholder");
            });
        });
    }

    /**
     * initBtnGoTop
     * @return {void}
     */
    Obj.initBtnGoTop = function() {
        let elGoTop = $('.btn__gotop');
        if (elGoTop.exists() && !elGoTop.isMobile()) {
            checkOffsetEL($window);

            $window.scroll(function() {
                checkOffsetEL($(this));
            });
            clickBtn();
        } else {
            clickBtn();
        }

        function checkOffsetEL($obj) {
            if ($obj.scrollTop() > $body.height() / 3) {
                elGoTop.fadeIn(300);
            } else {
                elGoTop.fadeOut(300);
            }
        }

        function clickBtn() {
            elGoTop.click(function() {
                $('body, html').animate({ scrollTop: 0 }, 500);
            });
        }
    }

    /**
     * initAniScroll
     * @return {[type]}
     */
    Obj.initAniScroll = function() {
        let scrollOff = $('.scrollToggle'),
            windowsTop = $window.scrollTop(),
            wh = $window.height();
        if (scrollOff.exists()) {
            scrollOff.each(function() {
                let scrollOffTop = $(this).offset().top;
                $(this).addClass('ani--scrollOff');
                if (windowsTop + wh - 20 > scrollOffTop && $(this).hasClass('ani--scrollOff')) {
                    $(this).removeClass('ani--scrollOff').addClass('ani--scrollOn');
                } else {
                    $(this).removeClass('ani--scrollOn').addClass('ani--scrollOff');
                }
            });
        }
    }

    /**
     * handleMenuClick
     * @return {[type]}
     */
    Obj.handleMenuClick = function() {
        let el   = $('#menu-button');
        if (el.exists()) {
            el.bind('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if ($(this).hasClass('open')) {
                    $(this).removeClass('open').next().stop(true, true).slideUp(150).removeClass('open');
                    $body.removeClass('hidden');
                } else {
                    $(this).addClass('open').next().stop(true, true).slideDown(150).addClass('open');
                    $body.addClass('hidden');
                }
            });
        }
    }

    /**
     * handleMenuDropdown
     * @return {void}
     */
    Obj.handleMenuDropdown = function() {
        let el = $('.navbar__dropdown');
        if (el.exists() && window.matchMedia("(max-width: 992px)").matches) {
            el.each(function() {
                let elClick = $(this).find('.navbar__dropdown__link');
                elClick.on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if ($(this).parent().hasClass('active')) {
                        $(this).parent().removeClass('active').find('.navbar__dropdown__content').stop(true, true).slideUp(150);
                    } else {
                        $(this).parent().addClass('active').find('.navbar__dropdown__content').stop(true, true).slideDown(150);
                    }
                });
            });
        }
    }

    /**
     * handleDeviceResize
     * @return {[type]}
     */
    Obj.handleDeviceResize = function() {
        $body.removeClass('hidden').find('.backdrop').remove();
        $('#menu-button').removeClass('open');
        $('.header__menu__wrap').removeClass('open').removeAttr('style');
        $('.navbar__dropdown').removeClass('active');
        $('.navbar__dropdown__content').removeAttr('style');
    }


    /**
     * handleFixImgIE
     * @param  {string} el
     * @return {void}
     */
    Obj.handleFixImgIE = function(el) {
        let userAgent,
            ieReg,
            ie;
        userAgent = window.navigator.userAgent;
        ieReg = /msie|Trident.*rv[ :]*11\./gi;
        ie = ieReg.test(userAgent);
        if (ie) {
            $(el).each(function() {
                let $container = $(this),
                    imgUrl = $container.find('img').prop('src');
                $container.find('img').hide();
                if (imgUrl) {
                    $container.css('background', 'url(' + imgUrl + ') no-repeat center / cover;');
                }
            });
        }
    }

    /**
     * initSlider
     * @return {void}
     */
    Obj.initSlider = function() {
        // Slider Main
        initSliderData( $('.slider'), 1, 1, false, true, 0, true );

        // Slider Project
        let elProject = $('.section__project .post__list');
        if (elProject.exists()) {
            elProject.each(function() {
                let el = $(this).find('.post__list__item__thumb');
                initSliderData(el, 1, 1, true, true);
            });
        }

        // Slider Service
        let $res = [
            { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 2 } },
            { breakpoint: 575, settings: { slidesToShow: 1, slidesToScroll: 1 } }
        ];
        initSliderData($('.section__service .post__list'), 3, 3, true, false, 20, false, $res);

        // Slider New
        initSliderData($('.section__new .post__list'), 3, 3, true, false, 20, false, $res);

        // Slider Partner
        let $res1 = [
            { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 4 } },
            { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 3 } },
            { breakpoint: 575, settings: { slidesToShow: 2, slidesToScroll: 2 } }
        ];
        initSliderData($('.section__partner .post__list'), 5, 5, true, false, 0, false, $res1);

        // Setting Slick slider
        function initSliderData($el, $num_show = 1, $num_scroll = 1, $dot = false, $arrow = true, $padding = 0, $autoplay = false, $res = []) {
            if ($el.exists()) {
                $el.slick({
                    slidesToShow: $num_show,
                    slidesToScroll: $num_scroll,
                    arrows: $arrow,
                    dots: $dot,
                    centerPadding: $padding,
                    draggable: false,
                    autoplay: $autoplay,
                    prevArrow: '<button type="button" class="slider__nav slider__nav--prev"></button>',
                    nextArrow: '<button type="button" class="slider__nav slider__nav--next"></button>',
                    responsive: $res
                });
            }
        }

        // Slide Project Detail
        let elSlider = $('.post__slider'),
            elSliderMain = '.post__slider__main',
            elSliderThumb = '.post__slider__thumb';
        if (elSlider.exists()) {

            $(elSliderMain).slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: true,
                draggable: false,
                prevArrow: '<button type="button" class="slider__nav slider__nav--prev"></button>',
                nextArrow: '<button type="button" class="slider__nav slider__nav--next"></button>',
                asNavFor: elSliderThumb,
            });

            $(elSliderThumb).slick({
                slidesToShow: 5,
                slidesToScroll: 1,
                arrows: false,
                focusOnSelect: true,
                draggable: false,
                asNavFor: elSliderMain,
                responsive: [
                    { breakpoint: 992, settings: { slidesToShow: 4 } },
                    { breakpoint: 575, settings: { slidesToShow: 3 } }
                ]
            });
        }
    }

    /**
     * handleHeightObj
     * @param  {string} $obj
     * @param  {string} $el
     * @return {height obj}
     */
    Obj.handleHeightObj = function($obj, $el) {
        let el = '.post__list__item__content',
            arr = [
                '.section__project',
                '.section__service',
                '.section__new'
            ];

        handelLoopEl(arr, el);

        function handelLoopEl(arr, el) {
            $.each( arr, function(index, val) {
                let $obj = $(val),
                    $el = $(el);

                if ( $obj.exists() ) {
                    $obj.each(function() {
                        startListMaxHeight( $obj.find($el), this);
                    });
                }
            });
            return false;
        }

        function startListMaxHeight(s) {
            let max = 0;
            s.each(function() {
                $(this).css('height', 'auto');
                let h = $(this).height();
                max = Math.max(max, h);
            }).height('').height(max);
            return false;
        }
    }

    /************************************************************
     * Obj Window load, ready, scroll, resize and functions
     *************************************************************/
    //Window load functions
    //
    $window.on('load', function() {
        Obj.uaSetting();
        Obj.handleFixImgIE('.thumbnail');
        Obj.initSlider();
        Obj.initAniScroll();
    });
    //Document ready functions
    $document.ready(function() {
        Obj.common();
        Obj.handleMenuClick();
        Obj.handleDeviceResize();
        Obj.handleMenuDropdown();
        Obj.handleHeightObj();
        Obj.initBtnGoTop();
    });

    //Window scroll functions
    $window.on('scroll', function() {
        Obj.initAniScroll();
    });

    //Window resize functions
    $window.on('resize', function() {
        Obj.handleDeviceResize();
        Obj.handleFixImgIE('.thumbnail');
        Obj.handleHeightObj();
    });

})(jQuery);