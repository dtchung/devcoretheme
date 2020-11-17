(function($) {
    'use strict';
    jQuery(document).ready(function($) {   
                                                                                                                               
            if (cookieCurrency != null) {        
              $("."+cookieCurrency).addClass('active');
              $('.lang-currency').empty();        
              $('.lang-currency').append($(".currency-lists ."+cookieCurrency).text());  
            };
              
    })
})(jQuery);

