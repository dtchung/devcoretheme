jQuery(document).ready(function ($) {
  "use strict";
   
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

  
    $(".chosen-select").chosen({disable_search_threshold: 10});
    kt_countdown();
    kt_tab_effect();
    kt_resizeMegamenu();
    kt_verticalMegamenu();
    sticky_menu();    
    better_equal_elems();
  
    $(window).scroll(function() {
      sticky_menu_run();
    });
     
    $(window).resize(function() {
      kt_resizeMegamenu();
      kt_verticalMegamenu();      
      better_equal_elems();      
    });
    $(window).load(function(){      
      better_equal_elems();
    });
    window.onresize = function(event) {
     
    };
});
