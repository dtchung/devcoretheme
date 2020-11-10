jQuery(document).ready(function ($) {
  "use strict";
    //menu onepage
    $(".each-section .next-section").on( "click", function(e) {
      var url = $(this).attr("href");
      var target = $(url).offset().top; 
      $('html,body').animate({scrollTop:target}, 'slow');
      return false;
    });

    
     
    function kt_tab_effect(){
      // effect click
      $(document).on('click','.kt-tab a[data-toggle="pill"]',function(){
        var item = '.product-item';
        var tab_id = $(this).attr('href');
        var tab_animated = $(this).data('animated');
        tab_animated = ( tab_animated == undefined ) ? 'fadeInUp' : tab_animated;

        if( $(tab_id).find('.owl-carousel').length > 0 ){
          item = '.owl-item.active';
        }
        $(tab_id).find(item).each(function(i){
          var t = $(this);
          var style = $(this).attr("style");
          style = ( style == undefined ) ? '' : style;
          var delay  = i * 200;
          t.attr("style", style +
                    ";-webkit-animation-delay:" + delay + "ms;"
                  + "-moz-animation-delay:" + delay + "ms;"
                  + "-o-animation-delay:" + delay + "ms;"
                  + "animation-delay:" + delay + "ms;"
          ).addClass(tab_animated+' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
              t.removeClass(tab_animated+' animated');
              t.attr("style", style);
          });
        })
      })
    }

    function kt_get_scrollbar_width() {
      var $inner = $('<div style="width: 100%; height:200px;">test</div>'),
          $outer = $('<div style="width:200px;height:150px; position: absolute; top: 0; left: 0; visibility: hidden; overflow:hidden;"></div>').append($inner),
          inner = $inner[0],
          outer = $outer[0];
      $('body').append(outer);
      var width1 = parseFloat(inner.offsetWidth);
      $outer.css('overflow', 'scroll');
      var width2 = parseFloat(outer.clientWidth);
      $outer.remove();
      return (width1 - width2);
    }

    function kt_resizeMegamenu(){
      var window_size = parseFloat($('body').innerWidth());
      window_size += kt_get_scrollbar_width();
      if( window_size > 1024 ){
        if( $('.container-wapper .main-menu').length > 0){
          var container = $('.main-menu-wapper');
          if( container!= 'undefined'){
            var container_width = 0;
            container_width = parseFloat(container.innerWidth());
            var container_offset = 0;
            container_offset = container.offset();
            setTimeout(function(){
              $('.main-menu .menu-item-has-children').each(function(index,element){
                $(element).children('.mega-menu').css({'width':container_width+'px'});
                var sub_menu_width = parseFloat($(element).children('.mega-menu').outerWidth());
                var item_width = parseFloat($(element).outerWidth());
                $(element).children('.mega-menu').css({'left':'-'+(sub_menu_width/2 - item_width/2)+'px'});
                var container_left = container_offset.left;
                var container_right = (container_left + container_width);
                var item_left = $(element).offset().left;
                var overflow_left = (sub_menu_width/2 > (item_left - container_left));
                var overflow_right = ((sub_menu_width/2 + item_left) > container_right);
                if( overflow_left ){
                  var left = (item_left - container_left);
                  $(element).children('.mega-menu').css({'left':-left+'px'});
                }
                if( overflow_right && !overflow_left ){
                  var left = (item_left - container_left);
                  left = left - ( container_width - sub_menu_width );
                  $(element).children('.mega-menu').css({'left':-left+'px'});
                }
              })
            },100);
          }
        }
      }
    }

    function sticky_menu(){
      if(!$('.header').hasClass('no-sticky')) {
        if(!$('.header').hasClass('no-prepend-box-sticky')){
          if (!$('.header .box-sticky').length) {
              $('.header').prepend('<div class="box-sticky"><div class="container"><div class="row"><div class="col-md-2 col-lg-2"><div class="logo-prepend"></div></div><div class="col-md-9 col-lg-8"><div class="main-menu-prepend"></div></div><div class="col-md-1 col-lg-2"><div class="top-links-prepend"><div class="wishlist-prepend prepend-icon"></div><div class="cart-prepend prepend-icon"></div></div></div></div></div></div>');
          }
        }
        $('.header').find('.logo').clone().appendTo('.header .logo-prepend');
        $('.header').find('.main-menu').clone().appendTo('.header .main-menu-prepend');
        $('.header').find('.wishlist-icon').clone().appendTo('.header .top-links-prepend .wishlist-prepend');
        $('.header').find('.box-minicart').clone().appendTo('.header .top-links-prepend .cart-prepend');  
      }
    }

     function sticky_menu_run(){
        if($(window).width() > 1024) {
            if ($(window).scrollTop() > 650) {
                $('.header .box-sticky').addClass('is-sticky');
                $('.header .this-sticky').addClass('box-sticky');
            } 
            else {
                $('.header .box-sticky').removeClass('is-sticky');
                $('.header .this-sticky').removeClass('box-sticky');
            }
        }
    }

    function kt_innit_carousel(){
        //owl has thumbs 
        $('.owl-carousel.has-thumbs').owlCarousel({
            loop: true,
            items: 1,
            thumbs: true,
            thumbImage: true,
            thumbContainerClass: 'owl-thumbs',
            thumbItemClass: 'owl-thumb-item'
        });
        // owl config
        $(".owl-carousel").each(function(index, el) {
            var config = $(this).data();
            config.navText = ['<i class="fa fa-angle-left" aria-hidden="true"></i>','<i class="fa fa-angle-right" aria-hidden="true"></i>'];
            var animateOut = $(this).data('animateout');
            var animateIn  = $(this).data('animatein');
            var slidespeed = parseFloat($(this).data('slidespeed'));
           
            if(typeof animateOut != 'undefined' ){
                config.animateOut = animateOut;
            }
            if(typeof animateIn != 'undefined' ){
                config.animateIn = animateIn;
            }
            if(typeof (slidespeed) != 'undefined' ){
                config.smartSpeed = slidespeed;
            }

            if( $('body').hasClass('rtl')){
                config.rtl = true;
            }

            var owl = $(this);
            owl.on('initialized.owl.carousel',function(event){
                var total_active = parseInt(owl.find('.owl-item.active').length);
                var i            = 0;
                owl.find('.owl-item').removeClass('item-first item-last');
                setTimeout(function(){
                    owl.find('.owl-item.active').each(function () {
                        i++;
                        if (i == 1) {
                            $(this).addClass('item-first');
                        }
                        if (i == total_active) {
                            $(this).addClass('item-last');
                        }
                    });

                }, 100);
            })
            owl.on('refreshed.owl.carousel',function(event){
                var total_active = parseInt(owl.find('.owl-item.active').length);
                var i            = 0;
                owl.find('.owl-item').removeClass('item-first item-last');
                setTimeout(function(){
                    owl.find('.owl-item.active').each(function () {
                        i++;
                        if (i == 1) {
                            $(this).addClass('item-first');
                        }
                        if (i == total_active) {
                            $(this).addClass('item-last');
                        }
                    });

                }, 100);
            })
            owl.on('change.owl.carousel',function(event){
                var total_active = parseInt(owl.find('.owl-item.active').length);
                var i            = 0;
                owl.find('.owl-item').removeClass('item-first item-last');
                setTimeout(function(){
                    owl.find('.owl-item.active').each(function () {
                        i++;
                        if (i == 1) {
                            $(this).addClass('item-first');
                        }
                        if (i == total_active) {
                            $(this).addClass('item-last');
                        }
                    });

                }, 100);
                owl.addClass('owl-changed');
                setTimeout(function () {
                    owl.removeClass('owl-changed');
                },config.smartSpeed)
            })
            owl.on('drag.owl.carousel',function(event){
                owl.addClass('owl-changed');
                setTimeout(function () {
                    owl.removeClass('owl-changed');
                },config.smartSpeed)
            })
            owl.owlCarousel(config);
            // Sections backgrounds
            if($(window).width() < 992)  {
                var itembackground = $(".item-background");
                    itembackground.each(function(index){
                    if ($('.item-background').attr("data-background")){
                      $(this).css("background-image", "url(" + $(this).data("background") + ")");
                      $(this).css("height", $(this).closest('.owl-carousel').data("height") + 'px');
                      $('.slide-img').css("display",'none');
                    }
                });
            } 
        });
    }
    function better_equal_elems() {
        if($(window).width() + kt_get_scrollbar_width() > 0){
            $('.equal-container').each(function () {
                var $this = $(this);
                if ($this.find('.equal-elem').length) {
                    $this.find('.equal-elem').css({
                        'height': 'auto'
                    });
                    var elem_height = 0;
                    $this.find('.equal-elem').each(function () {
                        var this_elem_h = 0;
                        this_elem_h = parseFloat($(this).height());
                        if (elem_height < this_elem_h) {
                            elem_height = this_elem_h;
                        }
                    });
                    $this.find('.equal-elem').height(elem_height);
                }
            });
            if($(window).width() > 991 ) {
                $('.equal-container2').each(function () {
                    var $this = $(this);
                    if ($this.find('.equal-elem2').length) {
                        $this.find('.equal-elem2').css({
                            'height': 'auto'
                        });
                        var elem_height = 0;
                        $this.find('.equal-elem2').each(function () {
                            var this_elem_h = 0;
                            this_elem_h = parseFloat($(this).height());
                            if (elem_height < this_elem_h) {
                                elem_height = this_elem_h;
                            }
                        });
                        $this.find('.equal-elem2').height(elem_height);
                    }
                });
            }
        }
    }
    function kt_verticalMegamenu(){
        var window_size = parseFloat($('body').innerWidth());
        window_size += kt_get_scrollbar_width();
        if( window_size > 991 ){
            if( parseFloat($('.vertical-menu').length) >0){
                var container = $('.container-vertical-wapper');
                if( container!= 'undefined'){
                    var container_width = 0;
                    container_width = parseFloat(container.innerWidth());
                    var container_offset = 0;
                    container_offset = container.offset();
                    var content_width = 0;
                    content_width = parseFloat($('.vertical-wapper ').outerWidth());
                    setTimeout(function(){
                        $('.vertical-menu .menu-item-has-children').each(function(index,element){
                             $(element).children('.mega-menu').css({'width':container_width + 'px'});
                        })
                    },100);
                }
            }
        
        }

    }
    $(document).on('click',' .toggle-submenu',function(){
       $(this).closest('.menu-item-has-children').toggleClass('show-submenu');
       return false;
    });

    function kt_countdown(){
      if($('.kt-countdown').length >0){
        var labels = ['Years', 'Months', 'Weeks', 'Days', 'Hrs', 'Mins', 'Secs'];
        var layout = '<span class="box-count day"><ul><li class="number">{dnn}</li> <li class="text">Days</li></ul></span><span class="box-count hrs"><ul><li class="number">{hnn}</li> <li class="text">Hours</li></ul></span><span class="box-count min"><ul><li class="number">{mnn}</li> <li class="text">Mins</li></ul></span><span class="box-count secs"><ul><li class="number">{snn}</li> <li class="text">Secs</li></ul></span>';
        $('.kt-countdown').each(function() {
          var austDay = new Date($(this).data('y'),$(this).data('m') - 1,$(this).data('d'),$(this).data('h'),$(this).data('i'),$(this).data('s'));
          $(this).countdown({
            until: austDay,
            labels: labels, 
            layout: layout
          });
        });
      }
    };


    //Woocommerce plus and minius
    /*$(document).on('click', '.js-quantity .js_minus, .js-quantity .js_plus', function (e) {
        // Get values
        var $qty = $(this).closest('.js-quantity').find('.js_qty'),
            currentVal = parseFloat($qty.val()),
            max = parseFloat($qty.attr('max')),
            min = parseFloat($qty.attr('min')),
            step = $qty.attr('step');
        // Format values
        if (!currentVal || currentVal === '' || currentVal === 'NaN') currentVal = 0;
        if (max === '' || max === 'NaN') max = '';
        if (min === '' || min === 'NaN') min = 0;
        if (step === 'any' || step === '' || step === undefined || parseFloat(step) === 'NaN') step = 1;
        // Change the value
        if ($(this).is('.js_plus')) {
            if (max && ( max == currentVal || currentVal > max )) {
                $qty.val(max);
            } else {
                $qty.val(currentVal + parseFloat(step));
            }
        } else {
            if (min && ( min == currentVal || currentVal < min )) {
                $qty.val(min);
            } else if (currentVal > 0) {
                $qty.val(currentVal - parseFloat(step));
            }
        }
        // Trigger change event
        $qty.trigger('change');
        e.preventDefault();
    });*/

    $(document).on('click','.show-content',function(){
      $(this).closest('.parent-content').toggleClass('active');
      $(this).closest('.parent-content').find('.hidden-content').toggleClass('show-up');
      return false;
    });

   
    $(document).on('click','.view-all-categori .button',function(){
      $(this).toggleClass('active')
      $('.view-all-categori .button').closest('.vertical-content').find('.hidden-item').toggleClass('show-more');
      return false;
    });

    $(document).on('click','.changed-button',function(){
        
        $(this).closest('.changed-item').find('.info .des-changed').toggleClass('show-content');
        $(this).toggleClass('active');
        return false;
    });
    function newletter_popup(){
      var window_size = parseFloat($('body').innerWidth());
      window_size += kt_get_scrollbar_width();
      if(window_size > 767){
        if($('body').hasClass('home')){
              $.magnificPopup.open({
                 items: {
                  src: '<div class="kt-popup-newsletter "><div class="popup-content"><h4 class="sub-title">Sign up <br> our <span>newsletter</span><br>And get</h4><h5 class="title">25 <span>%</span> Off</h5><h5 class="small-title">first purchase On all online store items.</h5><div class="input-block inner-content"><div class="input-inner"><input type="text" class="input-info" placeholder="Enter your email" name="input-info"><a href="#" class="submit">Subscribe</a></div></div><div class="dontshow"><input type="checkbox" class="checkbox" id="check-email"><label for="check-email" class="text-label">Don’t show this popup again</span></div></div></div></div>',
                  type: 'inline'
               }
               });
           }
      }
    }

    function quickview_popup(){
      var window_size = parseFloat($('body').innerWidth());
      window_size += kt_get_scrollbar_width();
      if(window_size > 992){
         /*$(document).on('click','.quickview-button',function(){
              $.magnificPopup.open({
                 items: {
                  src: '<div class="kt-popup-quickview "><div class="details-thumb col-xs-12 col-sm-6"><div class="owl-carousel nav-style4 has-thumbs" data-autoplay="false" data-nav="true" data-dots="false" data-loop="false" data-slidespeed="800"><div class="details-item"><img src="images/product25.jpg" alt=""></div><div class="details-item"><img src="images/product25.jpg" alt=""></div><div class="details-item"><img src="images/product25.jpg" alt=""></div></div></div><div class="details-info col-xs-12 col-sm-6"><a href="detail.html" class="product-name">DSLR Cameras Mirrorless System.</a><div class="rating"><ul class="list-star"><li><a href="#"><i class="fa fa-star" aria-hidden="true"></i></a></li><li><a href="#"><i class="fa fa-star" aria-hidden="true"></i></a></li><li><a href="#"><i class="fa fa-star" aria-hidden="true"></i></a></li><li><a href="#"><i class="fa fa-star" aria-hidden="true"></i></a></li><li><a href="#"><i class="fa fa-star-half-o" aria-hidden="true"></i></a></li></ul><span class="count">5 Review(s)</span></div><p class="description">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 making it over 2000 years old. Richard McClintock, a Latin at Hampden-Sydney College in Virginia.</p><div class="price"><span >$450.00</span></div><div class="availability">Availability: <a href="#">in Stock</a></div><div class="group-button"><div class="inner"><a href="#" class="add-to-cart"><span class="text">ADD TO CART</span><span class="icon"><i class="fa fa-cart-arrow-down" aria-hidden="true"></i></span></a><a href="#" class="compare-button"><i class="fa fa-exchange" aria-hidden="true"></i></a><a href="#" class="wishlist-button"><i class="fa fa-heart-o" aria-hidden="true"></i></a></div></div></div></div>',
                  type: 'inline'
               }
               });
              kt_innit_carousel();
              return false;
           });*/
      }
    }


    $(".chosen-select").chosen({disable_search_threshold: 10});
    kt_countdown();
    kt_tab_effect();
    kt_resizeMegamenu();
    kt_verticalMegamenu();
    sticky_menu();
    //kt_innit_carousel();
    better_equal_elems();
    quickview_popup();
    
    $(window).scroll(function() {
      sticky_menu_run();
    });
     
    $(window).resize(function() {
      kt_resizeMegamenu();
      kt_verticalMegamenu();
      //kt_innit_carousel();
      better_equal_elems();
      quickview_popup();
    });
    $(window).load(function(){
      //newletter_popup()
      better_equal_elems();
      //kt_innit_carousel();
      //quickview_popup();
    });
    window.onresize = function(event) {
      //kt_innit_carousel();
    };
});
