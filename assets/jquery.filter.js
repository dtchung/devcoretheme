(function(){
       'use strict'; 
    jQuery(document).ready(function($) {
      
      	var is_customers = false ;
      
      function check_compare(value){
              for (var i = 1; i <=8; i++) {
                if (compare_list['p' + i] == value ) {
                    return true
                  break;
                } 
              }
              return false;
          }
      function readMore(string, maxWords) {       
              var strippedString = $("<p>" + string + "</p>").text().trim();      
              var array = strippedString.split(" ");
              var string = array.splice(0, maxWords).join(" ");

              if(array.length > maxWords) {
                string += "...";
              }

              return string ;
            }
      function roadtip(element) { 
              var tipText = element.html();
              element.bind('mouseover', function() {
                if (jQuery('.roadtip').length == 0) {
                  element.before('<span class="roadtip">' + tipText + '</span>');

                  var tipWidth = jQuery('.roadtip').outerWidth();
                  var tipPush = -(tipWidth / 2 - element.outerWidth() / 2);
                  jQuery('.roadtip').css('margin-left', tipPush);
                }
              });
              element.bind('mouseleave', function() { 
                jQuery('.roadtip').remove();
              });
            }
      function convert_currency(value,type){

                try{
                  var newCurrency = Currency.currentCurrency;
                }catch(ex){
                  var newCurrency = '';
                }
                try{
                  var oldCurrency = shopCurrency;
                }catch(ex){
                  var oldCurrency = '';
                }
                if(isNaN(value)){
                    value =  0.0; 
                }
 
                var cents = 0.0;
                var oldFormat = Currency.moneyFormats['USD'][ Currency.format] || '';
                var newFormat = Currency.moneyFormats[newCurrency][Currency.format] || '';
             
                if(type == 'format'){
                  return  Currency.formatMoney(value, newFormat);
                }
                if (oldFormat.indexOf('amount_no_decimals') !== -1) {
                    cents = Currency.convert(parseInt(value, 10)*100, oldCurrency, newCurrency);
                }
                else if (oldCurrency === 'JOD' || oldCurrency == 'KWD' || oldCurrency == 'BHD') {
                    cents = Currency.convert(parseInt(value, 10)/10, oldCurrency, newCurrency);
                }
                else { 
                    cents = Currency.convert(parseInt(value, 10), oldCurrency, newCurrency);
                }
                if(type  == 'nosymbol'){
                    return cents;
                }
                var my_data =  Currency.formatMoney(cents, newFormat);
                return my_data;
       
      }
      function get_symbol(value){
          var str = value.split("");
          var sym = '';
          for(var i=0;i<str.length;i++){
            if(isNaN(str[i])){
                sym+=str[i];
            }else{
              return sym; 
            }
          }
          return sym;
      }
      function get_price_only(price){
        var price_convert= price.toString();
        var get_currencies = 0;
        var $split = price_convert.split(';');
            if($split.length > 1){
              get_currencies = (isNaN(parseInt( price_convert.substring(1,0)))) ?  $split[1]:  $split[0];
            }else{
              get_currencies =price_convert.replace(/[^0-9.]/g, '');
            }
            get_currencies = $.trim(get_currencies); 
            var check = get_currencies.substring(1,0);
            if(isNaN((check))){
              get_currencies =   get_currencies.replace(check,'');
            }
        return parseFloat(get_currencies);

      }
      
      
      
      

        var max_price_slide = convert_currency(500000,'');
        var get_currencies = convert_currency(500000,'');
        var min_price_slide = convert_currency(1000,'');
      	var limit_product 	=	3;
      	
         
        var $split = get_currencies.split(';');
        if($split.length > 1){
           get_currencies = (isNaN(parseInt( get_currencies.substring(1,0)))) ?  $split[0]+';':  $split[1]+';';

        }else{
           get_currencies = (isNaN(parseInt( get_currencies.substring(1,0)))) ? get_symbol( get_currencies):   get_currencies.substring(1,-1);
        }

      
       $('.slider-range-price').slider({
            range: true,
            min: 0,
            max: get_price_only(max_price_slide),
            values: [get_price_only(min_price_slide), get_price_only(max_price_slide)],
            slide: function(event, ui) {
                var max_price_slide = convert_currency(500000,'');
                var get_currencies = convert_currency(500000,'');
                var min_price_slide = convert_currency(1000,'');              
              
                var $split = get_currencies.split(';');
                if($split.length > 1){
                   get_currencies = (isNaN(parseInt( get_currencies.substring(1,0)))) ?  $split[0]+';':  $split[1]+';';

                }else{
                   get_currencies = (isNaN(parseInt( get_currencies.substring(1,0)))) ? get_symbol( get_currencies):   get_currencies.substring(1,-1);
                }
                var max_pr = get_currencies + ' ' + ui.values[1];
                var min_pr =  get_currencies +' ' + ui.values[0];

                $(".amount-range-price .from").html(min_pr);
                $(".amount-range-price .to").html(max_pr);
              
            },
            change: function(event, ui) {
                jQuery("body").addClass('ajax_loading');
              
                var max_price = ui.values[1];
                var min_price =ui.values[0];
                 
                var check = 0;
                var sum_product   = 0;
                var page = 1;
                var count=0;              
                
                var html = '';
              	var view =$(".js_cat_view.active").data('col') > 0 ? 'grid' : 'list' ;
                var has_product = false;   
              
                $("#collection-product").empty(); 
                $("#collection-product").closest('.js_container_cat').addClass("js_product_ajax");
              	$(".products-result-count").empty();
                $(".js_paginate_ajax").empty();
                 
                $.each(json_collection_filter,function(index, elem) {
                	var current_price =  convert_currency(elem.variants[0].price,'');                  	
                    current_price = get_price_only(current_price);                  	
                    if (current_price <= max_price && current_price >= min_price) {  
                      has_product = true;     
                     
                      html = html + json_to_html(elem,view,check,page);  
                      sum_product++;                      
                      count++;
                    }                   
                  	if (count >= limit_product){ 
                      	page++;                        
                        count = 0;
                    }                            
                    check++;
                });                            
              	html	=	html + "<input type='hidden' id='sum_for_pagination' value='"+sum_product+"'>";
             	html	=	html + "<input type='hidden' id='limit_for_pagination' value='"+limit_product+"'>";
              	             
                if(! has_product){
                  html +='<p class="text-center"> No products were found matching your selection.</p>';
                }          
              	
                //showing results                
                $("#collection-product").append(html);                

              	if (sum_product >= limit_product){
                  $(".products-result-count").append(" Showing 1–"+limit_product+" of "+sum_product);                  
                  $(".js_paginate_ajax").append(pagination_html(limit_product, sum_product));
                }
                else{
                  $(".products-result-count").append(" Showing 1–"+sum_product+" of "+sum_product);                                                
                  $(".product-"+view+"-filter").show();
                  $(".product-"+view+"-filter").addClass('view-'+view);  
                }  
        
                $(".page-number.current").trigger('click');
              
                window.setTimeout(function() {
                     jQuery("body").removeClass('ajax_loading');
                }, 1000);
                
            } 

        }); 
      $(document).on('click','.js_product_ajax .page-number', function(event){
        if($('.slider-range-price').length > 0){
       		var val = $(this).text();        
        	var view = $(".js_cat_view.active").data('col') > 0 ? 'grid' : 'list'; 
       
        	$(".product-"+view+"-filter").hide();
        	$(".product-"+view+"-filter").removeClass('view-'+view);
        	console.log(val+"/"+view);
        	$(".page-"+val+"-"+view).addClass('view-'+view);
        	$(".page-"+val+"-"+view).show();
        	
        	$(".page-number").removeClass("current");
                   
        	$(this).addClass("current");
        
        	var limit 	=	$("#limit_for_pagination").val();
        	var limitstart = (val - 1)*limit + 1;
        	var limitend = val*limit;        	
        	var sum 	=	$("#sum_for_pagination").val();
        	if(limitend>sum) limitend = sum;
        	$(".products-result-count").empty();
        	$(".products-result-count").append(" Showing "+limitstart+"–"+limitend+" of "+sum); 
        }
           
      })
        function pagination_html(limit, total){
          var i;
          var sum_page = Math.ceil(total/limit);
          var $html = '';
          
           	$html += '<nav class="pagination js_paginate_ajax"> ';
              $html += '<ul class="page-numbers list-page">';
                for(i=1; i<= sum_page; i++ ){
                  if(i==1) {
                    $html += '<li><a href="#primary" id="pagination_'+i+'" class="page-number current">'+i+'</a></li>';                       
                  }else{                     
                    $html += '<li><a href="#primary" id="pagination_'+i+'" class="page-number">'+i+'</a></li>';                       
                  }
                }                
              $html += '</ul>';
           $html += '</nav>';
           return $html ;

        }
        function json_to_html(product,view,check,page){
         // shop-products
         var  is_sale = false;
          if (product.compare_at_price > product.price){
          	is_sale = true;
          }

         var $html = '';
          $html += '<div class="product-item page-'+page+'-'+view+' product-'+view+'-filter layout1 col-ts-12 col-xs-6 col-sm-6 col-md-3 col-lg-3 no-padding" data-col="3" style="display:none;">';
            $html += '<div class="product-inner equal-elem">';
              $html += '<ul class="group-flash">';                
                  
                  var date_published = new Date(product.published_at);
                  var myDate = new Date();
           
                  var timeDiff = Math.abs(date_published.getTime() - myDate.getTime());
                  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
          		  
          		  if (diffDays < 30){
                      $html += '<li><span class="new flash">New</span></li>';
          		  }
          
                  if (is_sale == true){
                    $html += '<li><span class="sale flash">Hot</span></li>';
                    $html += '<li><span class="best flash">Bestseller</span></li>';  	
                  }
                 $html += '</ul>';
                 
              	$html += '<div class="thumb">';
                	$html += '<a href="/products/'+product.handle+'" data-pid="'+product.variants[0].id+'" class="quickview-button quick-view"><span class="icon"><i class="fa fa-eye" aria-hidden="true"></i></span> Quick View</a>';
                	$html += '<a href="/products/'+product.handle+'" class="thumb-link"><img src="'+product.featured_image+'" alt=""></a>';
                $html += '</div>';
          
          		$html += '<div class="info">';
                 
                  $html += '<div class="star-rating">';
                    $html += '<span class="spr-badge" id="spr_badge_11372324244" data-rating="0.0"><span class="spr-starrating spr-badge-starrating"><i class="spr-icon spr-icon-star-empty" style=""></i><i class="spr-icon spr-icon-star-empty" style=""></i><i class="spr-icon spr-icon-star-empty" style=""></i><i class="spr-icon spr-icon-star-empty" style=""></i><i class="spr-icon spr-icon-star-empty" style=""></i></span><span class="spr-badge-caption">No reviews</span>';
           			$html += '</span>';
                  $html += '</div>';
                  
                  
                  $html += '<a href="/products/'+product.handle+'" class="product-name">'+product.title+'</a>';
                  $html += '<p class="description"></p>';
                  $html += '<div class="price">';
                        $html += '<span><span class="money" data-currency-'+Currency.currentCurrency+'="'+convert_currency(product.variants[0].price,'xx')+'">'+convert_currency(product.variants[0].price,'xx')+'</span></span>';
                  $html += '</div>';
          		  if (product.available == true){
                  	$html += '<div class="availability">Availability: <a href="#">  in Stock </a></div>';
                  }else{
                    $html += '<div class="availability">Availability: <a href="#">  Unavailable </a></div>';
                  }
                $html += '</div>';
                 
          
          
                   if (product.available == true){
                     $html += '<div class="group-button">';
                        $html += '<div class="inner">';
                        if ((product.variants).length> 1 ){
                            $html += '<a class="button select-option" onclick="location.href='+product.handle+'">PRODUCT OPTION</a>';
                        }else{
                          if (product.variants[0].id){
                              $html +='<a href="\'/products/'+product.handle+'\'" class="add-to-cart js_add_to_cart_button" data-pid="'+product.variants[0].id+'" title="Add to cart"><span class="text">ADD TO CART</span><span class="icon"><i class="fa fa-cart-arrow-down" aria-hidden="true"></i></span></a>';                             
                              
                              /*Wishlist*/	
                              if(is_customers){
                                if(jQuery.inArray(product.id, json_wishlist ) >= 0){
                                  $html +='<a class="wishlist-button view-added-wishlist " title="View my Wishlist" href="/collections/wishlist"><span class="icon"><i class="fa fa-heart-o" aria-hidden="true"></i></span><span class="text">View Wishlist</span></a>';
                                }else{
                                  if(json_product_tag[check].indexOf("x")>=0){
                                    $html +='<a class="wishlist-button " title="Add to my wishlist" href="javascript:void(0)" data-form="x'+json_product_tag[check]+'"><span class="icon"><i class="fa fa-heart-o" aria-hidden="true"></i></span><span class="text">Add to Wishlist</span></a>';
                                    $html +='<a href="/collections/wishlist" class="wishlist-button added-wishlist"  data-toggle="tooltip" data-placement="top" ><span class="icon"><i class="fa fa-heart-o" aria-hidden="true"></i></span><span class="text">Addded Wishlist</span></a>';
                                  }else{
                                    $html +='<a class="wishlist-button " title="Add to my wishlist" href="javascript:void(0)" data-form="'+json_product_tag[check]+'"><span class="icon"><i class="fa fa-heart-o" aria-hidden="true"></i></span><span class="text">Add to Wishlist</span></a>';
                                    $html +='<a href="/collections/wishlist" class="wishlist-button added-wishlist"  data-toggle="tooltip" data-placement="top" ><span class="icon"><i class="fa fa-heart-o" aria-hidden="true"></i></span><span class="text">Addded Wishlist</span></a>';
                                  }
                                }
                              }else {
                                $html += '<a class="wishlist-button wishlist-login"   href="javascript:void(0)" title="Login to use wishlist"><span class="icon"><i class="fa fa-heart-o" aria-hidden="true"></i></span><span class="text">Login to use Wishlist</span></a>';
                              }
                              
                              /*Compare*/
                              var storage = $.localStorage;
                              if (storage.isSet('compare')) {
                                var compare = storage.get('compare');
                              } else {
                                storage.set('compare', {});
                              }	

                              //compare = {};
                              if ($.isEmptyObject(compare)) {
                                $html +='<a href="#" class="compare" data-pid="'+product.handle+'" title="Compare product"><span class="ti-reload"></span></a>';
                              }else{
                                var arr = $.map(compare, function(el) { return el });
                                if(jQuery.inArray(product.handle, arr ) >= 0){
                                  $html +='<a href="#" class="js-compare compare-button added" data-pid="'+product.handle+'" title="Compare product"><span class="icon"><i class="fa fa-exchange" aria-hidden="true"></i></span><span class="text">Add to Compare</span></a>';
                                }else{
                                  $html +='<a href="#" class="js-compare compare-button" data-pid="'+product.handle+'" title="Compare product"><span class="icon"><i class="fa fa-exchange" aria-hidden="true"></i></span><span class="text">Add to Compare</span></a>';
                                }
                              }
                            
                              $html += '<form method="post" action="/contact#contact_form" id="contact_form" class="contact-form" accept-charset="UTF-8">';
                              $html += '<input type="hidden" value="customer" name="form_type">';
                              $html += '<input type="hidden" name="utf8" value="✓">';
                              $html += '<input type="hidden" name="contact[email]" value="'+json_email[0]+'">';

                              if(json_product_tag.length > 0){
                                if(json_product_tag[check].indexOf("x")>=0){
                                  $html += '<input type="hidden" name="contact[tags]" value="x'+json_product_tag[check]+'"> ';
                                }else{
                                  $html += '<input type="hidden" name="contact[tags]" value="'+json_product_tag[check]+'"> ';
                                }
                              }else{
                                $html += '<input type="hidden" name="contact[tags]" value=""> ';
                              }
                              $html += '</form>';
                          }
                        }
                        $html += '</div>';
                      $html += '</div>';
                   }else{
                      $html += '<div class="group-button">';
                     	$html +='<a class="button btn-sold-out" onclick="location.href=\'/products/'+product.handle+'\'">OUT OF STOCK</a>';                        
                      $html += '</div>';
                   }

                 $html += '</div>';
				$html += '</div>';

          
          return $html ;
        }
      
        function makeid()
        {
          var text = "";
          var possible = "abcdefghijklmnopqrstuvwxyz";

          for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

          return text;
        }

        
      
    });
})(jQuery);