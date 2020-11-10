var SortingCollections = function() {

    function SortingCollections(container) {
        this.$container = $(container);
    
        this.namespace = '.sorting-collections';

        this.onLoad();
    };

    SortingCollections.prototype = $.extend({}, SortingCollections.prototype, {
        onLoad: function() {
            var $control = this.$container.find('[data-sorting-collections-control]'),
                $collections = this.$container.find('[data-sorting-collections-ajax] [data-collection]'),
                $products = this.$container.find('[data-sorting-collections-items]'),
                xhr = null;

            this.$control = $control;           
            function loadProducts($button, loader) {
                if(xhr) {
                    xhr.abort();
                }

                if(loader) {
                    theme.Loader.set($products);
                }

                var collection = $button.attr('data-collection'),
                    count_limit = $products.attr('data-limit'),
                    grid_classes = $products.attr('data-grid');

                xhr = $.ajax({
                    type: 'GET',
                    url: '/collections/' + collection,
                    cache: false,
                    data: {
                        view: 'sorting',
                        count_limit: count_limit,
                        grid_classes: encodeURIComponent(grid_classes)
                    },
                    dataType: 'html',
                    success: function (data) {
                        var $childern;

                        $products.html(data);

                        if($products[0].hasAttribute('data-is-design-mode')) {
                            $childern = $products.children();

                            $childern.addClass(grid_classes);

                            if($childern.length > count_limit) {
                                for(var i = count_limit; i < $childern.length; i++) {
                                    $childern.eq(i).remove();
                                }
                            }
                        }
						theme.Tooltip.reinit();
                        /*theme.ImagesLazyLoad.update();
                        theme.ProductCurrency.update();
                        theme.ProductCountdown.init($products.find('.js-countdown'));
                        theme.ProductReview.update();*/

                        $control.find('a').removeClass('active');
                        $button.addClass('active');

                        if(loader) {
                            theme.Loader.unset($products);
                        }

                        xhr = null;
                    }
                });
            };

            if($collections.length) {
                //loadProducts($collections.first());
            }

            $control.on('click', 'a', function (e) {
                var $this = $(this);

                if(!$this.hasClass('active')) {
                    loadProducts($this, true);
                }

                e.preventDefault();
                return false;
            });
        },
        onUnload: function() {
            this.$container.off(this.namespace);

            this.$control.off();
        }
    });
	theme.SortingCollections = new SortingCollections('.type_tab_collection');
};

$(document).ready(function() {
   var sc = new SortingCollections();
   
})