$(document).ready(function() {  
	//Init slick for carousel product section
    if($("[data-js-slick-brand]").length > 0){
      $("[data-js-slick-brand]").slick({
        lazyLoad: 'ondemand',
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: true,     
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 4,
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
              slidesToShow: 4,
              slidesToScroll: 1
            }
          },
          {
            breakpoint: 767,
            settings: {
              arrows: true,  
              infinite: true,
              slidesToShow: 3,
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