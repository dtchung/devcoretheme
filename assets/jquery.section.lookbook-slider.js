$(document).ready(function() {  
	//Init slick for carousel product section
    if($("[data-js-slider-lookbook]").length > 0){
      $("[data-js-slider-lookbook]").not('.slick-initialized').slick({
        lazyLoad: 'ondemand',
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,       
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              dots: false,
              arrows: true,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 992,
            settings: {
              dots: false,
              arrows: true,  
              infinite: true,
              slidesToShow: 1,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 767,
            settings: {
              arrows: true,  
              infinite: true,
              slidesToShow: 1,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 480,
            settings: {
              arrows: true,  
              infinite: true,
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]

      }) 
    }
})