var cmsheroShopify ,designMode =  false;
window.theme = window.theme || {};


var Global = function() {

    function Global() {
        this.settings = {
            set_offset_with_fixed_body: {
                padding: [
                    '.header__content--sticky',
                    '.header--transparent',
                    '.footbar',
                    '#admin_bar_iframe',
                    '#preview-bar-iframe'
                ],
                margin: [
                    '.footer--fixed'
                ]
            }
        };

        this.dom = {};

        this.load();
    };

    Global.prototype = $.extend({}, Global.prototype, {
        load: function() {
            var current_bp,
                $scroll_example = $('.scroll-offset-example');

            window.$window = $(window);
            window.$document = $(document);
            window.$html = $('html');
            window.$body = $html.find('body');

            this.dom.$icons = $('#theme-icons');

            theme.rtl = $html.attr('dir') === 'rtl' ? true : false;

            theme.breakpoints = {
                values: {
                    xs: 0,
                    sm: 541,
                    md: 778,
                    lg: 1025,
                    xl: 1260
                }
            };
            theme.breakpoints.main = theme.breakpoints.values.lg;
            theme.current = {};

            function checkWindow() {
                theme.current.width = window.innerWidth;
                theme.current.height = window.innerHeight;
            };

            function checkBreakpoint() {
                theme.current.is_mobile = theme.current.width < theme.breakpoints.main;
                theme.current.is_desktop = !theme.current.is_mobile;

                $.each(theme.breakpoints.values, function(k, v) {
                    if(v > theme.current.width) {
                        return false;
                    }
                    theme.current.bp = k;
                });

                if(current_bp && current_bp != theme.current.bp) {
                    $window.trigger('theme.changed.breakpoint');
                }
                current_bp = theme.current.bp;
            };
            checkWindow();
            checkBreakpoint();          

            $window.on('load', function () {
                theme.is_loaded = true;
            });          
        },
        bodyHasScroll: function(prop) {
            var d = document,
                e = d.documentElement,
                b = d.body,
                client = "client" + prop,
                scroll = "scroll" + prop;

            return /CSS/.test(d.compatMode) ? (e[client] < e[scroll]) : (b[client] < b[scroll]);
        },
        fixBody: function() {
            if (this.bodyHasScroll('Height')) {
                $body.addClass('offset-scroll');

                $.each(this.settings.set_offset_with_fixed_body.padding, function() {
                    $(this).addClass('offset-scroll-padding fixed-elem');
                });
                $.each(this.settings.set_offset_with_fixed_body.margin, function() {
                    $(this).addClass('offset-scroll-margin fixed-elem');
                });
            }

            this._fixed_scroll_top = pageYOffset;

            $body.css({ top: pageYOffset * -1 });
            $body.addClass('overflow-hidden position-fixed left-0 w-100');

            if(theme.StickySidebar) {
                theme.StickySidebar.update($('.js-sticky-sidebar'));
            }
        },
        unfixBody: function() {
            $body.removeClass('offset-scroll overflow-hidden position-fixed left-0 w-100');

            $body.add($html).scrollTop(this._fixed_scroll_top);
            this._fixed_scroll_top = null;

            $body.css({ top: '' });

            $.each(this.settings.set_offset_with_fixed_body.padding, function() {
                $(this).removeClass('fixed-elem offset-scroll-padding');
            });

            $.each(this.settings.set_offset_with_fixed_body.margin, function() {
                $(this).removeClass('fixed-elem offset-scroll-margin');
            });

            if(theme.StickySidebar) {
                theme.StickySidebar.update($('.js-sticky-sidebar'));
            }
        },
        responsiveHandler: function(obj) {
            var namespace = obj.namespace ? obj.namespace : '.widthHandler',
                current_bp;
            
            function bind() {
                $.each(obj.events, function(event, func) {
                    if(obj.delegate) {
                        $(obj.element).on(event + namespace, obj.delegate, func);
                    } else {
                        $(obj.element).on(event + namespace, func);
                    }
                });
            };

            function unbind() {
                $.each(obj.events, function(event) {
                    $(obj.element).unbind(event + namespace);
                });

                obj.was_first_load = false;
            };

            function on_resize() {
                if(theme.current.is_mobile !== current_bp) {
                    current_bp = theme.current.is_mobile;

                    if((obj.on_desktop && theme.current.is_desktop) || (obj.on_mobile && theme.current.is_mobile)) {
                        bind();

                        setTimeout(function () {
                            if(obj.onbindtrigger) {
                                if(!obj.was_first_load) {
                                    $.each(obj.events, function() {
                                        $(obj.element).trigger(obj.onbindtrigger);
                                    });

                                    obj.was_first_load = true;
                                }
                            }
                        }, 0);
                    } else {
                        unbind();
                    }
                }
            };

            $window.on('theme.resize' + namespace, function() {
                on_resize();
            });

            on_resize();

            return {
                unbind: function() {
                    $window.unbind('theme.resize' + namespace);
                    unbind();
                }
            }
        },
        getIcon: function(numb, html) {
            var $icon = this.dom.$icons.find('.icon-theme-' + numb);
            
            return html ? $icon.parent().html() : $icon.clone();
        }
    });

    theme.Global = new Global;
};
var ProductImagesHover = function() {

    function ProductImagesHover() {
        this.selectors = {
            images_hover: '.js-product-images-hover',
            images_hovered_end: '.js-product-images-hovered-end'
        };

        this.load();
    };

    ProductImagesHover.prototype = $.extend({}, ProductImagesHover.prototype, {
        load: function() {
            function changeImage($wrap, $image, url, id) {
                $wrap.attr('data-js-product-image-hover-id', $image.attr('data-image-id'));
                theme.ProductImagesNavigation.changeSrc($image, url, id);            
              
            };
            jQuery('body').on('mouseenter', this.selectors.images_hover, function (e) {
                var $this = $(this),
                    $image = $this.find('.pr_lazy_img'),
                    url = $this.attr('data-js-product-image-hover'),
                    id = $this.attr('data-js-product-image-hover-id');
              if(url) {
                  changeImage($this, $image, url, id);
                  $this.one('mouseleave', function () {
                    var url = $image.attr('data-url-img'),
                        id = $this.attr('data-js-product-image-hover-id');
                    changeImage($this, $image, url, id);
                  });
                }              
            })
        },
        disable: function ($image) {
            $image.parents(this.selectors.images_hover).removeClass('js-product-images-hover').unbind('mouseleave');
        }
    });

    theme.ProductImagesHover = new ProductImagesHover;
};
var ProductImagesNavigation = function() {

    function ProductImagesNavigation() {
        this.selectors = {
            images_nav: '.js-product-images-navigation'
        };

        this.load();
    };

    ProductImagesNavigation.prototype = $.extend({}, ProductImagesNavigation.prototype, {
        load: function() {
            var _ = this;

            $body.on('click', '[data-js-product-images-navigation]:not([data-disabled])', function() {
                var $this = $(this),
                    $product = $this.parents('[data-js-product]'),
                    direction = $this.attr('data-js-product-images-navigation');

                theme.ProductImagesHover.disable($product.find('.pr_lazy_img'));

                var data = theme.ProductOptions.switchByImage($product, direction, null, function (data) {
                    _._updateButtons($product, data.is_first, data.is_last);
                });
            });
        },
        switch: function($product, data) {
            var $image_container = $product.find('[data-js-product-image]'),
                $image,
                image,
                src,
                master_src;

            if($image_container.length) {
                $image = $image_container.find('.pr_lazy_img');
                image = data.update_variant.featured_image;

                theme.ProductImagesHover.disable($image);

                if(!image || !image.src) {
                    if(data.json.images[0]) {
                        image = data.json.images[0];
                    }
                }

                if(image && image.src && +image.id !== +$image.attr('data-image-id')) {
                    src = Shopify.resizeImage(image.src, Math.ceil($image_container.width()) + 'x') + ' 1x, ' + Shopify.resizeImage(image.src, Math.ceil($image_container.width()) * 2 + 'x') + ' 2x';
                    master_src = Shopify.resizeImage(image.src, '{width}x');

                    this.changeSrc($image, image.src, image.id, master_src);

                    if($image.parents(this.selectors.images_nav).length) {
                        this._updateButtons($product, +data.json.images[0].id === +image.id, +data.json.images[data.json.images.length - 1].id === +image.id);
                    }
                }
            }
        },      	
        changeSrc: function ($image, url, id, master_src) {
            var $parent = $image.parent();

            id = id || 'null';
			
            theme.Loader.set($parent);
            $image.css('background-image', 'url('+url+')').attr('data-image-id', id);
			theme.Loader.unset($parent);
            if(master_src) {
                $image.attr('data-master', master_src);
            }
        },
        _updateButtons: function($product, is_first, is_last) {
            $product.find('[data-js-product-images-navigation="prev"]')[is_first ? 'attr' : 'removeAttr']('data-disabled', 'disabled');
            $product.find('[data-js-product-images-navigation="next"]')[is_last ? 'attr' : 'removeAttr']('data-disabled', 'disabled');
        }
    });

    theme.ProductImagesNavigation = new ProductImagesNavigation;
};
var ProductCurrency = function() {

    function ProductCurrency() {

    };

    ProductCurrency.prototype = $.extend({}, ProductCurrency.prototype, {
        load: function() {
            if(theme.multipleСurrencies) {
                var cookieCurrency;
                
                try {
                    cookieCurrency = Currency.cookie.read();
                } catch(err) {}
                
                $('span.money span.money').each(function () {
                    $(this).parents('span.money').removeClass('money');
                });

                $('span.money').each(function () {
                    $(this).attr('data-currency-' + Currency.shopCurrency, $(this).html());
                });

                if (cookieCurrency == null) {
                    if (Currency.shopCurrency !== Currency.defaultCurrency) {
                        Currency.convertAll(Currency.shopCurrency, Currency.defaultCurrency);
                    } else {
                        Currency.currentCurrency = Currency.defaultCurrency;
                    }
                } else if (cookieCurrency === Currency.shopCurrency) {
                    Currency.currentCurrency = Currency.shopCurrency;
                } else {
                    Currency.convertAll(Currency.shopCurrency, cookieCurrency);
                }
            }
        },
        setCurrency: function(newCurrency) {
            if(theme.multipleСurrencies) {
                if (newCurrency == Currency.currentCurrency) {
                    Currency.convertAll(Currency.shopCurrency, newCurrency);
                } else {
                    Currency.convertAll(Currency.currentCurrency, newCurrency);
                }
            }
        },
        setPrice: function($price, price, compare_at_price) {
            price = +price;
            compare_at_price = +compare_at_price;

            var html = '',
                sale = compare_at_price && compare_at_price > price;

            $price[sale ? 'addClass' : 'removeClass']('price--sale');

            if(sale) {
                html += '<span>';
                html += Shopify.formatMoney(compare_at_price, theme.moneyFormat);
                html += '</span>';

            }

            html += '<span>';
            html += Shopify.formatMoney(price, theme.moneyFormat);
            html += '</span>';

            $price.html(html);
        },
        update: function() {
            if(theme.multipleСurrencies) {
                Currency.convertAll(Currency.shopCurrency, Currency.currentCurrency);
            }
        }
    });

    theme.ProductCurrency = new ProductCurrency;
};    
var Loader = function() {

    function Loader() {
        var _ = this;

        this.$loader = $('#theme-loader .js-loader');

        _.load();
    };

    Loader.prototype = $.extend({}, Loader.prototype, {
        load: function () {
          
        },
        set: function($elem, obj) {         
            /*if($elem.length && $elem.find('.nt_bg_lz').length > 0) { 
                setTimeout(function () {
                   jQuery("body").addClass('ajax_loading');
                }, 0);
            }*/
          	 $elem.addClass('loading-element');
        },
        unset: function ($elem) {            
          	//jQuery("body").removeClass('ajax_loading');    
          	 $elem.removeClass('loading-element');
        }
    });

    theme.Loader = new Loader;
};
var ProductOptions = function() {

        function ProductOptions() {
            this.selectors = {
                options: '.js-product-options',
                options_attr: '[data-js-product-options]'
            };

            this.afterChange = [];

            this.load();
        };

        ProductOptions.prototype = $.extend({}, ProductOptions.prototype, {
            load: function() {
                var _ = this,
                    timeout,
                    xhr;
				window.$body = jQuery("html").find('body');
                function onProcess(e) {
                    var $this = $(this),
                        $options = $this.parents(_.selectors.options),
                        $section = $this.parents('[data-property]');

                    if ($this.hasClass('disabled') || ($this.hasClass('active') && !$section[0].hasAttribute('data-disable-auto-select'))) {
                        return;
                    }

                    var $values = $section.find('[data-js-option-value]'),
                        $product = $this.parents('[data-js-product]'),
                        json = $product.attr('data-json-product'),
                        current_values = [],
                        update_variant = null;

                    $values.removeClass('active');
                    $this.addClass('active');

                    $section.removeAttr('data-disable-auto-select');

                    _._loadJSON($product, json, function (json) {
                        var $active_values = $options.find('[data-js-option-value].active').add($options.find('option[data-value]:selected'));

                        $.each($active_values, function() {
                            var $this = $(this);

                            current_values.push($this.attr('data-value'));
                        });

                        $options.find('[data-js-option-value]').removeClass('active');

                        $.each(json.variants, function() {
                            if(current_values.join(' / ') === Shopify.handleizeArray(this.options).join(' / ')) {
                             
                                if(!this.available) {
                                    return false;
                                }

                                update_variant = this;

                                return false;
                            }
                        });

                        if(!update_variant && current_values.length > 1) {
                            $.each(json.variants, function() {
                                if(current_values[0] === Shopify.handleize(this.options[0]) && current_values[1] === Shopify.handleize(this.options[1])) {
                                    if(!this.available) {
                                      	 
                                        if(update_variant) {
                                            return;
                                        }
                                    }

                                    update_variant = this;

                                    if(this.available) {
                                        return false;
                                    }
                                }
                            });
                        }

                        if(!update_variant) {
                            $.each(json.variants, function() {
                                if(current_values[0] === Shopify.handleize(this.options[0])) {
                                    if(!this.available) {
                                        if(update_variant) {
                                            return;
                                        }
                                    }

                                    update_variant = this;

                                    if(this.available) {
                                        return false;
                                    }
                                }
                            });
                        }

                        if(!update_variant) {
                            update_variant = _._getDefaultVariant(json);
                        }

                        _._updatePossibleVariants($product, {
                            update_variant: update_variant,
                            json: json
                        });

                        $.each(update_variant.options, function(i, k) {
                            var $prop = $options.find('[data-property]').eq(i);

                            $prop.find('[data-js-option-value][data-value="' + Shopify.handleize(k) + '"]').addClass('active');
                            $prop.filter('[data-js-option-select]').val(Shopify.handleize(k)).trigger('change', [ true ]);
                        });

                        _._switchVariant($product, {
                            update_variant: update_variant,
                            json: json,
                            has_unselected_options: $product.find('[data-property][data-disable-auto-select]').length ? true : false
                        });
                    });
                };

                $body.on('click', this.selectors.options + ' [data-js-option-value]', onProcess);

                $body.on('mouseenter', this.selectors.options + '[data-js-options-onhover] [data-js-option-value]', onProcess);

                $body.on('change', '[data-js-product] [data-js-option-select]', function (e, onupdate) {
                    if(onupdate) {
                        return;
                    }

                    var $this = $(this).find('option[data-value]:selected');

                    $(this).parents('.select').find('[data-js-select-dropdown]').removeAttr('data-dropdown-unselected');

                    onProcess.call($this, e);
                });

                $body.on('change', '[data-js-product-variants="control"]', function () {
                    var $this = $(this),
                        $product = $this.parents('[data-js-product]'),
                        id = $this.find('option:selected').attr('value'),
                        json = $product.attr('data-json-product'),
                        update_variant = null;

                    _._loadJSON($product, json, function (json) {
                        $.each(json.variants, function() {
                            if(+this.id === +id) {
                                update_variant = this;
                                return false;
                            }
                        });

                        _._switchVariant($product, {
                            update_variant: update_variant,
                            json: json,
                            dontUpdateVariantsSelect: true
                        });
                    });
                });
                
            },
            _loadJSON: function ($product, json, callback, animate) {
                if($product[0].hasAttribute('data-js-process-ajax-loading-json')) {
                    $product.one('json-loaded', function () {
                        if(callback) {
                            callback(JSON.parse($product.attr('data-json-product')));
                        }
                    });

                    return;
                }

                animate = animate === undefined ? true : animate;

                if(json) {
                    if(callback) {
                        callback(typeof json == 'object' ? json : JSON.parse(json));
                    }
                } else {
                    $product.attr('data-js-process-ajax-loading-json', true);

                    if(animate) {
                        theme.Loader.set($product);
                    }

                    var handle = $product.attr('data-product-handle');

                    var xhr = $.ajax({
                        type: 'GET',
                        url: theme.routes.root_url + 'products/' + handle,
                        data: {
                            view: 'get_json'
                        },
                        cache: false,
                        dataType: 'html',
                        success: function (data) {
                            json = JSON.parse(data);
                            $product.attr('data-json-product', JSON.stringify(json));

                            if(animate) {
                                theme.Loader.unset($product);
                            }

                            if(callback) {
                                callback(json);
                            }

                            $product.trigger('json-loaded');
                        },
                        complete: function () {
                            $product.removeAttr('data-js-process-ajax-loading-json');
                        }
                    });

                    return xhr;
                }
            },
            switchByImage: function($product, get_image, id, callback) {
                var _ = this,
                    $image = $product.find('[data-js-product-image] .pr_lazy_img'),
                    json = $product.attr('data-json-product'),
                    data = false;
				
                this._loadJSON($product, json, function (json) {
                    var json_images = json.images,
                        current_image_id = (get_image === 'by_id') ? +id : +$image.attr('data-image-id'),
                        image_index,
                        update_variant;

                    $.each(json_images, function(i) {
                        if(+this.id === current_image_id) {
                            image_index = i;
                            return false;
                        }
                    });
					
                    if(image_index || image_index === 0) {
                        if(get_image === 'prev' && image_index !== 0) {
                            image_index--;
                        } else if(get_image === 'next' && image_index !== json_images.length - 1) {
                            image_index++;
                        }

                        $.each(json.variants, function() {
                            if(this.featured_image && +this.featured_image.id === +json_images[image_index].id) {
                                update_variant = this;
                                return false;
                            }
                        });

                        if(!update_variant) {
                            update_variant = _._getDefaultVariant(json);
                            update_variant.featured_image = json_images[image_index];
                        }

                        _._updateOptions($product, {
                            update_variant: update_variant,
                            json: json
                        });

                        _._switchVariant($product, {
                            update_variant: update_variant,
                            json: json
                        });

                        data = {
                            index: image_index,
                            image: json_images[image_index],
                            is_first: image_index === 0,
                            is_last: image_index === json_images.length - 1
                        };
                      
                     
                    }

                    callback(data);
                });
            },
            _updatePossibleVariants: function ($product, data) {
                var $options = $product.find(this.selectors.options_attr),
                    $section_eq_values,
                    $section_eq_select_options,
                    possible_variants = [];

                if(data.update_variant.options.length > 1) {
                    $.each(data.json.variants, function() {
                        if(Shopify.handleize(this.options[0]) !== Shopify.handleize(data.update_variant.options[0])) {
                            return;
                        } else if(!this.available && this.id !== data.update_variant.id) {
                            return;
                        }

                        possible_variants.push(this);
                    });

                    $section_eq_values = $options.find('[data-property]').eq(1).find('[data-js-option-value]');
                    $section_eq_select_options = $options.find('[data-property]').eq(1).filter('[data-js-option-select]').parents('.select').find('[data-value]');

                    $section_eq_values.addClass('disabled');
                    $section_eq_select_options.attr('disabled', 'disabled');

                    $.each(possible_variants, function () {
                        $section_eq_values.filter('[data-js-option-value][data-value="' + Shopify.handleize(this.options[1]) + '"]').removeClass('disabled');
                        $section_eq_select_options.filter('[data-value="' + Shopify.handleize(this.options[1]) + '"]').removeAttr('disabled');
                    });

                    if(data.update_variant.options.length > 2) {
                        possible_variants = [];

                        $.each(data.json.variants, function() {
                            if(Shopify.handleize(this.options[0]) !== Shopify.handleize(data.update_variant.options[0]) || Shopify.handleize(this.options[1]) !== Shopify.handleize(data.update_variant.options[1])) {
                                return;
                            } else if(!this.available && this.id !== data.update_variant.id) {
                                return;
                            }

                            possible_variants.push(this);
                        });

                        $section_eq_values = $options.find('[data-property]').eq(2).find('[data-js-option-value]');
                        $section_eq_select_options = $options.find('[data-property]').eq(2).filter('[data-js-option-select]').parents('.select').find('[data-value]');

                        $section_eq_values.addClass('disabled');
                        $section_eq_select_options.attr('disabled', 'disabled');

                        $.each(possible_variants, function () {
                            $section_eq_values.filter('[data-js-option-value][data-value="' + Shopify.handleize(this.options[2]) + '"]').removeClass('disabled');
                            $section_eq_select_options.filter('[data-value="' + Shopify.handleize(this.options[2]) + '"]').removeAttr('disabled');
                        });
                    }
                }
            },
            _switchVariant: function($product, data) {
                data.update_variant.metafields = $.extend({}, data.json.metafields);

                $.each(data.json.variants_metafields, function() {
                    if(+this.variant_id === +data.update_variant.id) {
                        data.update_variant.metafields = $.extend(true, data.update_variant.metafields, this.metafields);
                    }
                });

                this._updateContent($product, data);
            },
            _getDefaultVariant: function(json) {
                var default_variant = {};

                $.each(json.variants, function() {
                    if(+this.id === +json.default_variant_id) {
                        Object.assign(default_variant, this);
                        return false;
                    }
                });

                return default_variant;
            },
            checkProductStatus: function($products) {
                $products = $products || $('[data-js-product]');

                var _ = this,
                    storage = localStorage.getItem(this.current_storage),
                    items = storage ? JSON.parse(storage) : [],
                    $active_products = $();

                $.each(items, function () {
                    $.each(this, function (k, v) {
                        var $selected_product = $products.filter('[data-product-handle="' + v + '"][data-product-variant-id="' + k + '"]');

                        if ($selected_product.length) {
                            $active_products = $active_products.add($selected_product);
                        }
                    });
                });

                $products.not($active_products).find(_.selectors.button).removeAttr('data-button-status');
                $active_products.find(_.selectors.button).attr('data-button-status', 'added');
            },
            _updateContent: function($product, data) {
                var clone_id = $product.attr('data-js-product-clone-id'),
                    $clone_product = $('[data-js-product-clone="' + clone_id + '"]');

                $product.attr('data-product-variant-id', data.update_variant.id);
                $product.add($clone_product).find('[data-js-product-options]').attr('data-variant-was-chanched', true);

                this._updateFormVariantInput($product, data);
                this._updatePrice($product, $clone_product, data);
                this._updateLabelSale($product, data);
                this._updateLabelInStock($product, data);
                this._updateLabelOutStock($product, data);
                this._updateLabelHot($product, data);
                this._updateLabelNew($product, data);
                this._updateCountdown($product, data);
                this._updateAddToCart($product, $clone_product, data);
                this._updateDynamicCheckout($product, data);
                this._updateSKU($product, data);
                this._updateBarcode($product, data);
                this._updateAvailability($product, data);
                this._updateStockCountdown($product, data);
                this._updateGallery($product, data);
                this._updateLinks($product, data);
                this._updateHistory($product, data);

                this.checkProductStatus($product);
                theme.ProductImagesNavigation.switch($product, data);

                if(!data.dontUpdateVariantsSelect) {
                    this._updateVariantsSelect($product, data);
                }

                if($clone_product.length) {
                    this._updateOptions($clone_product, data, $product);
                    theme.ProductImagesNavigation.switch($clone_product, data);
                }
            },
            _updateOptions: function($product, data, $product_origin) {
                var _ = this;

                $product.each(function () {
                    var $this = $(this),
                        $options = $this.find(_.selectors.options_attr),
                        $sections;

                    if($options.length) {
                        $options.find('[data-js-option-value]').removeClass('active');

                        _._updatePossibleVariants($this, data);

                        $.each(data.update_variant.options, function(i, k) {
                            var $prop = $options.find('[data-property]').eq(i);

                            $prop.find('[data-js-option-value][data-value="' + Shopify.handleize(k) + '"]').addClass('active');
                            $prop.filter('[data-js-option-select]').val(Shopify.handleize(k)).trigger('change', [ true ]);
                        });
                    }

                    if($product_origin && theme.product.variant_auto_select !== 'enable') {
                        $sections = $product.find('[data-property]');

                        $sections.attr('data-disable-auto-select');

                        $product_origin.find('[data-property]').each(function (i, v) {
                            if(!this.hasAttribute('data-disable-auto-select')) {
                                $sections.eq(i).removeAttr('data-disable-auto-select');
                            }
                        });
                    }
                });
            },
            _updateFormVariantInput: function ($product, data) {
                var $input = $product.find('[data-js-product-variant-input]');

                $input.attr('value', data.update_variant.id);
            },
            _updateVariantsSelect: function($product, data) {
                var $select = $product.find('[data-js-product-variants]');

                if($select.length) {
                    $select.val(data.update_variant.id).change();
                }
            },          
            _updateAddToCart: function($product, $clone_product, data) {
                var $button = $product.add($clone_product).find('[data-js-product-button-add-to-cart]');                
                $button.data('pid', data.update_variant.id);
                if($button.length && !data.has_unselected_options) {
                    data.update_variant.available ? $button.removeAttr('disabled data-button-status') : $button.attr('disabled', 'disabled').attr('data-button-status', 'sold-out');
                }
            },
            _updateDynamicCheckout: function($product, data) {
                var $button = $product.find('[data-js-product-button-dynamic-checkout]');

                if($button.length && !data.has_unselected_options) {
                    data.update_variant.available ? $button.removeClass('d-none') : $button.addClass('d-none');
                }
            },
            _updatePrice: function($product, $clone_product, data) {
                var $price = $product.add($clone_product).find('[data-js-product-price]'),
                    $details = $product.find('[data-js-product-price-sale-details]'),
                    details;

                if($price.length) {
                    theme.ProductCurrency.setPrice($price, data.update_variant.price, data.update_variant.compare_at_price);
                }

                if($details.length) {
                    $.each(data.json.variants_price_sale_details, function () {
                        if(+this.id === +data.update_variant.id) {
                            details = this.details;
                        }
                    });

                    $details.html(details ? details : '')[details ? 'removeClass' : 'addClass']('d-none-important');
                }

                if($price.length || $details.length) {
                    theme.ProductCurrency.update();
                }
            },
            _updateLabelSale: function($product, data) {
                var $label = $product.find('[data-js-product-label-sale]');

                if($label.length) {
                    var html = '',
                        sale = (data.update_variant.compare_at_price && data.update_variant.compare_at_price > data.update_variant.price);

                    $label[!sale ? 'addClass' : 'removeClass']('d-none-important');

                    if(sale) {
                        var percent = Math.ceil(100 - data.update_variant.price * 100 / data.update_variant.compare_at_price);

                      html += "-{{ percent }}%";
                        html = Shopify.addValueToString(html, {
                            'percent': percent
                        });
                    }

                    $label.html(html);
                }
            },
            _updateLabelInStock: function($product, data) {
                var $label = $product.find('[data-js-product-label-in-stock]');

                if($label.length) {
                    $label[!data.update_variant.available ? 'addClass' : 'removeClass']('d-none-important');
                }
            },
            _updateLabelOutStock: function($product, data) {
                var $label = $product.find('[data-js-product-label-out-stock]');

                if($label.length) {
                    $label[data.update_variant.available ? 'addClass' : 'removeClass']('d-none-important');
                }
            },
            _updateLabelHot: function($product, data) {
                var $label = $product.find('[data-js-product-label-hot]');

                if($label.length) {
                    $label[data.update_variant.metafields.labels && data.update_variant.metafields.labels.hot ? 'removeClass' : 'addClass']('d-none-important');
                }
            },
            _updateLabelNew: function($product, data) {
                var $label = $product.find('[data-js-product-label-new]');

                if($label.length) {
                    $label[data.update_variant.metafields.labels && data.update_variant.metafields.labels.new ? 'removeClass' : 'addClass']('d-none-important');
                }
            },
            _updateCountdown: function($product, data) {
                var $countdown = $product.find('[data-js-product-countdown]'),
                    date = data.update_variant.metafields.countdown && data.update_variant.metafields.countdown.date ? data.update_variant.metafields.countdown.date : false,
                    $countdown_init,
                    need_coundown;

                if($countdown.length) {
                    $countdown_init = $countdown.find('.js-countdown');
                    need_coundown = date && data.update_variant.compare_at_price && data.update_variant.compare_at_price > data.update_variant.price;

                    if(need_coundown && $countdown_init.attr('data-date') !== date) {
                        theme.ProductCountdown.reinit($countdown_init, date);
                    }

                    if(!need_coundown) {
                        $countdown.addClass('d-none-important');
                    }
                }
            },
            _updateSKU: function($product, data) {
                var $sku = $product.find('[data-js-product-sku]');

                if($sku.length) {
                    $sku[data.update_variant.sku ? 'removeClass' : 'addClass']('d-none-important');

                    $sku.find('span').html(data.update_variant.sku);
                }
            },
            _updateBarcode: function($product, data) {
                var $barcode = $product.find('[data-js-product-barcode]');

                if($barcode.length) {
                    $barcode[data.update_variant.barcode ? 'removeClass' : 'addClass']('d-none-important');

                    $barcode.find('span').html(data.update_variant.barcode);
                }
            },
            _updateAvailability: function($product, data) {
                var $availability = $product.find('[data-js-product-availability]');

                if($availability.length) {
                    var html = '',
                        quantity = 0;

                    $.each(data.json.variants_quantity, function() {
                        if(+this.id === +data.update_variant.id) {
                            quantity = +this.quantity;
                        }
                    });

                    if(data.update_variant.available) {
                        html += "In stock ({{ count }} {{ item }})";
                        html = Shopify.addValueToString(html, {
                            'count': quantity,
                            'item': quantity === 1 ? item : items
                        });
                    } else {
                      html += "Out of stock";
                    }

                    $availability.attr('data-availability', data.update_variant.available).find('span').html(html);
                }
            },
            _updateStockCountdown: function ($product, data) {
                var $stock_countdown = $product.find('[data-js-product-stock-countdown]'),
                    $title = $stock_countdown.find('[data-js-product-stock-countdown-title]'),
                    $progress = $stock_countdown.find('[data-js-product-stock-countdown-progress]'),
                    min = +$stock_countdown.attr('data-min'),
                    quantity = 0;

                $.each(data.json.variants_quantity, function () {
                    if(+this.id === +data.update_variant.id) quantity = +this.quantity;
                });

                if($title) {
                  $title.html(Shopify.addValueToString("Hurry! Only {{ quantity }} Left in Stock!", {
                        'quantity': '<span class="stock-countdown__counter">' + quantity + '</span>'
                    }));
                }

                if($progress) {
                    $progress.width(quantity / (min / 100) + '%');
                }

                if($stock_countdown.length) {
                    $stock_countdown[quantity > 0 && quantity < min ? 'removeClass' : 'addClass']('d-none-important');
                }
            },
            _updateGallery: function ($product, data) {
                var $gallery = $product.find('[data-js-product-gallery]'),
                    $for_option = $gallery.find('[data-js-for-option]'),
                    image;

                if(data.update_variant.option1) {
                    $for_option.each(function () {
                        var $this = $(this);

                        $this[$this.attr('data-js-for-option') === Shopify.handleize(data.update_variant.option1) ? 'removeClass' : 'addClass']('d-none');
                    });

                    if(!$for_option.filter(':not(.d-none)').length) {
                        $for_option.removeClass('d-none');
                    }
                }

                if($gallery.find('.fotorama').length) {
                    if(data.update_variant.featured_media) {
                        image = data.update_variant.featured_media;
                    } else if(data.json.media[0]) {
                        image = data.json.media[0];
                    }

                    $gallery.productGallery('switchImageById', image.id);
                }
            },
            _updateLinks: function ($product, data) {
                var url = decodeURIComponent(window.location.origin) + '/products/' + data.json.handle + '?variant=' + data.update_variant.id;

                $product.find('a[href*="products/' + data.json.handle + '"]').attr('href', url);
            },
            _updateHistory: function ($product, data) {
                var $options = $product.find(this.selectors.options);

                if(!data.has_unselected_options && $options.length && $options[0].hasAttribute('data-js-change-history')) {
                    var url = window.location.href.split('?')[0] + '?variant=' + data.update_variant.id;

                    history.replaceState({foo: 'product'}, url, url);
                }
            }
        });

        theme.ProductOptions = new ProductOptions();
    };  
var ProductVisitors = function() {

    function ProductVisitors() {
        this.selectors = {

        };

        this.load();
    };

    ProductVisitors.prototype = $.extend({}, ProductVisitors.prototype, {
        load: function() {
            this.init($('.js-visitors').not('.visitors--init'));
        },
        init: function($elems) {
            var $countdown = $elems.not('.visitors--init');

            function randomInteger(min, max) {
                return Math.round(min - 0.5 + Math.random() * (max - min + 1));
            };

            $countdown.each(function () {
                var $this = $(this),
                    $counter = $this.find('[data-js-counter]'),
                    min = $this.attr('data-min'),
                    max = $this.attr('data-max'),
                    interval_min = $this.attr('data-interval-min'),
                    interval_max = $this.attr('data-interval-max'),
                    stroke = +$this.attr('data-stroke'),
                    current_value,
                    new_value;

                $this.addClass('visitors--processing');

                function update() {
                    setTimeout(function() {
                        if(!$this.hasClass('visitors--processing')) {
                            return;
                        }

                        current_value = +$counter.text();
                        new_value = randomInteger(min, max);

                        if(Math.abs(current_value - new_value) > stroke) {
                            new_value = new_value > current_value ? current_value + stroke : current_value - stroke;
                            new_value = randomInteger(current_value, new_value);
                        }

                        $counter.text(new_value);

                        update();
                    }, randomInteger(interval_min, interval_max) * 1000);
                };

                update();

                $this.addClass('visitors--init');
            });
        },
        destroy: function($countdown) {
            if($countdown.hasClass('visitors--init')) {
                $countdown.off().removeClass('visitors--processing visitors--init').html('');
            }
        }
    });

    theme.ProductVisitors = new ProductVisitors;
};

var ProductTextCountdown = function() {

    function ProductTextCountdown() {
        this.selectors = {

        };

        this.load();
    };

    ProductTextCountdown.prototype = $.extend({}, ProductTextCountdown.prototype, {
        load: function() {
            this.init($('.js-text-countdown').not('.text-countdown--init'));
        },
        init: function($elems) {
            var $countdown = $elems.not('.text-countdown--init');

            $countdown.each(function () {
                var $this = $(this),
                    $counter = $this.find('[data-js-text-countdown-counter]'),
                    $date = $this.find('[data-js-text-countdown-delivery]'),
                    reset_time = +$this.attr('data-reset-time'),
                    delivery_time = +$this.attr('data-delivery-time'),
                    delivery_format = $this.attr('data-delivery-format'),
                    delivery_excludes = $this.attr('data-delivery-excludes').replace(/ /gi, '').toLowerCase().split(','),
                    date_counter = new Date();                 
                    

                date_counter.setDate(date_counter.getDate() + 1);
                date_counter.setHours(reset_time, 0, 0, 0);
				
                var labels = ['hours', 'minutes', 'second'];
                var layout = '<span class="box-count hrs"><span class="number">{hnn}</span> <span class="text">hours</span></span><span class="dot"> </span><span class="box-count min"><span class="number">{mnn}</span> <span class="text">minutes</span></span><span class="dot"> </span><span class="box-count secs"><span class="number">{snn}</span> <span class="text">second</span></span>';
               
                var t = $counter.countdown({
                        until: date_counter,
                        labels: labels, 
                        layout: layout
                    });

                $this.addClass('text-countdown--init');
            });
        },
        destroy: function($countdown) {
            if($countdown.hasClass('text-countdown--init')) {
                $countdown.countdown('remove').off().removeClass('text-countdown--init').html('');
            }
        }
    });

    theme.ProductTextCountdown = new ProductTextCountdown;
};
var ProductGallery = function(){
  
  	function ProductGallery() {
        this.selectors = {
			 main: '[data-zoom-image]',
          	 nav: '[data-thumb-id]'
        };
        /*var zoomConfig1 = {
              gallery: 'slider-nav', 
              galleryActiveClass: "slick-current",
              zoomType: 'lens',
              lensShape: 'round',
              lensSize: 200}; */
      	this.zoomConfig = {
             gallery: 'slider-nav', 
             galleryActiveClass: "slick-current"
          }; 

        this.load();
    };
    ProductGallery.prototype = $.extend({}, ProductGallery.prototype, {
        load: function() {
            this.init();
        },
        init: function() { 
          
          var zoomImage = $(this.selectors.main);
          if($("[data-thumb-id]").length > 0){
             $("[data-thumb-id]").on('click',function(){
               // Remove old instance od EZ
               $('.zoomContainer').remove();
               zoomImage.removeData('elevateZoom');
               // Update source for images
               zoomImage.attr('src', $(this).data('image'));
               zoomImage.data('zoom-image', $(this).data('z-image'));
               // Reinitialize EZ
               zoomImage.ezPlus(this.zoomConfig);
             })
             
             if($("#js-product-selectors").length == 0){
             	$("[data-thumb-id]").first().trigger("click");
             }
           }else{
               if(zoomImage.length > 0){
                 zoomImage.ezPlus(this.zoomConfig);
               }
           }
        },
        create: function($src, $zoom_img){
            var zoomImage = $(this.selectors.main);
            // Remove old instance od EZ
            $('.zoomContainer').remove();
            zoomImage.removeData('elevateZoom');
            // Update source for images
            zoomImage.attr('src', $src);
            zoomImage.data('zoom-image', $zoom_img);
            // Reinitialize EZ
            zoomImage.ezPlus(this.zoomConfig);
        },
        destroy: function(){
            var zoomImage = $(this.selectors.main);
            // Remove old instance od EZ
            $('.zoomContainer').remove();
            zoomImage.removeData('elevateZoom');
        }
    });

    theme.ProductGallery = new ProductGallery; 
 };                  
var StoreLists = function() {

    function Engine(namespace, callback) {
        this.namespace = namespace;

        this.selectors = {
            button: '.js-store-lists-add-' + namespace,
            button_remove: '.js-store-lists-remove-' + namespace,
            button_clear: '.js-store-lists-clear-' + namespace,
            has_items: '[data-js-store-lists-has-items-' + namespace + ']',
            dhas_items: '[data-js-store-lists-dhas-items-' + namespace + ']'
        };

        if(theme.customer) {
            this.current_storage = namespace + '-customer-' + theme.customer_id;

            this.app_obj = {
                namespace: namespace,
                customerid: theme.customer_id,
                shop: theme.permanent_domain,
                domain: theme.host,
                iid: theme.lists_app.iid
            };
        } else {
            this.current_storage = namespace + '-guest';
        }

        this.load(callback);
    };

    Engine.prototype = $.extend({}, Engine.prototype, {
        load: function(callback) {
            var _ = this;
            window.$body = jQuery("html").find('body');
            if(theme.customer) {
                var customer_storage = localStorage.getItem(this.current_storage),
                    customer_storage_arr = customer_storage ? JSON.parse(customer_storage) : [],
                    guest_storage = localStorage.getItem(this.namespace + '-guest'),
                    guest_storage_arr = guest_storage ? JSON.parse(guest_storage) : [],
                    sort_data_arr = [],
                    sort_customer_storage_arr,
                    sort_concat_arr,
                    sort_concat_arr_json;

                var sortObjectsArray = function(arr) {
                    var obj = {},
                        new_arr = [],
                        i = 0;

                    for(i = 0; i < arr.length; i++) {
                        $.each(arr[i], function (k, v) {
                            obj[k + ''] = v;
                        });
                    }

                    $.each(obj, function (k, v) {
                        var obj = {};

                        obj[k] = v;
                        new_arr.push(obj);
                    });

                    return new_arr;
                };

                var loadData = function() {
                    _.getCustomerList(function (data) {
                        if(data.status !== 200) {
                            return;
                        }

                        sort_customer_storage_arr = sortObjectsArray(customer_storage_arr);

                        if(data.items && data.items.length) {
                            sort_data_arr = sortObjectsArray(data.items);
                        }

                        sort_concat_arr = sortObjectsArray(sort_customer_storage_arr.concat(sort_data_arr));

                        sort_concat_arr_json = JSON.stringify(sort_concat_arr);

                        if(sort_concat_arr_json !== JSON.stringify(sort_customer_storage_arr) || sort_concat_arr_json !== JSON.stringify(sort_data_arr)) {
                            localStorage.setItem(_.current_storage, sort_concat_arr_json);

                            _.setCustomerList(sort_concat_arr_json);
                        }

                        _.updateHeaderCount();
                        _.checkProductStatus();
					    
                        localStorage.removeItem(_.namespace + '-guest');
                    });
                };

                if(guest_storage_arr.length) {
                    callback({
                        trigger: function (is_active) {
                            if(is_active) {
                                customer_storage_arr = customer_storage_arr.concat(guest_storage_arr);
                            }

                            loadData();
                        },
                        info: {
                            namespace: _.namespace,
                            count: guest_storage_arr.length
                        }
                    });
                } else {
                    loadData();
                }
            } else {
                this.checkProductStatus();
            }
			$body.on('click', "[data-id='#nt_wishlist_canvas']", function(e) {
               var $popup = $('[data-js-popup-ajax]');
               _.update($popup);
            })
            $body.on('click', "[data-js-popup-button='wishlist-full']", function(e) {
               e.preventDefault();
              
               var $popup = $('[data-js-popup-ajax]');
               _. updateFull($popup);
            })
          
            $body.on('click', this.selectors.button, function(e) {
                var $this = $(this);
                
                $this.attr('disabled', 'disabled');

                var $product = $this.parents('[data-js-product]'),
                    handle = $product.attr('data-product-handle'),
                    id = +$product.attr('data-product-variant-id');

                if($this.attr('data-button-status') === 'added') {
                    _.removeItem(id, handle, function(data) {
                        $this.removeAttr('data-button-status');
                        $this.removeAttr('disabled');
                    });
                } else {
                  	
                    _.addItem(id, handle, function(data) {
                        $this.attr('data-button-status', 'added');
                        $this.removeAttr('disabled');
                    });
                }

                e.preventDefault();
                return false;
            });

            function removeCallback($product, handle) {
                var find = '[data-js-store-lists-product-' + _.namespace + ']',
                    $popup = theme.Popups.getByName(_.namespace);

                if(handle) find += '[data-product-handle="' + handle + '"]';

                $(find).each(function () {
                    var $this = $(this);

                    $($this.parent('[class*="col"]').length ? $this.parent() : $this).remove();
                });

                if($product && typeof $product !== undefined && $product.length) $product.remove();

                if(!$popup.hasClass('d-none-important')) {
                    theme.StoreLists.popups[_.namespace].update($popup);
                }
            };

            $body.on('click', this.selectors.button_remove, function() {
                var $this = $(this),
                    $product = $this.parents('[data-js-product]'),
                    handle = $product.attr('data-product-handle'),
                    id = +$product.attr('data-product-variant-id');

                _.removeItem(id, handle, function() {
                    removeCallback($product, handle);
                });
            });

            $body.on('click', this.selectors.button_clear, function() {
                _.clear(function() {
                    removeCallback();
                });
            });
        },
        setCustomerList: function(items, callback) {
            if(theme.customer) {
                $.ajax({
                    type: "POST",
                    url: "https://" + theme.lists_app.url + "/api/massadd",
                    data: $.extend({}, this.app_obj, {
                        purge: 'yes',
                        items: items
                    }),
                    cache: false,
                    success: function(data) {
                        if(callback) callback(data);
                    }
                });
            }
        },
        getCustomerList: function(callback) {
            if(theme.customer) {
                $.ajax({
                    type: 'POST',
                    url: 'https://' + theme.lists_app.url + '/api/getlist',
                    data: this.app_obj,
                    cache: false,
                    success: function(data) {
                        if(callback) callback(data);
                    }
                });
            }
        },
        addCustomerItem: function(id, handle, callback) {
            if(theme.customer) {
                $.ajax({
                    type: 'POST',
                    url: 'https://' + theme.lists_app.url + '/api/add',
                    data: $.extend({}, this.app_obj, {
                        key: id,
                        value: handle
                    }),
                    cache: false,
                    success: function(data) {
                        if(callback) callback(data);
                    }
                });
            }
        },
        removeCustomerItem: function(id, callback) {
            if(theme.customer) {
                $.ajax({
                    type: 'POST',
                    url: 'https://' + theme.lists_app.url + '/api/delete',
                    data: $.extend({}, this.app_obj, {
                        key: id,
                        _method: 'DELETE'
                    }),
                    cache: false,
                    success: function(data) {
                        if(callback) callback(data);
                    }
                });
            }
        },
        clearCustomerItem: function(callback) {
            if(theme.customer) {
                $.ajax({
                    type: 'POST',
                    url: 'https://' + theme.lists_app.url + '/api/massdelete',
                    data: $.extend({}, this.app_obj, {
                        _method: 'DELETE'
                    }),
                    cache: false,
                    success: function(data) {
                        if(callback) callback(data);
                    }
                });
            }
        },
        addItem: function(id, handle, callback) {
            var storage = localStorage.getItem(this.current_storage),
                items = storage ? JSON.parse(storage) : [],
                obj = {};

            obj[id] = handle;

            items.push(obj);
			
            localStorage.setItem(this.current_storage, JSON.stringify(items));

            this.checkProductStatus();
            this.updateHeaderCount();
            var $popup = $('[data-js-popup-ajax]');
		    this.update($popup);
            this.addCustomerItem(id, handle);

            if(callback) callback();
        },
        removeItem: function(id, handle, callback) {
            var storage = localStorage.getItem(this.current_storage),
                items = storage ? JSON.parse(storage) : [];

            $.each(items, function (i) {
                if(this[id] && this[id] === handle) {
                    items.splice(i, 1);
                    return false;
                }
            });

            localStorage.setItem(this.current_storage, JSON.stringify(items));

            this.checkProductStatus();

            $(this.selectors.has_items)[items.length > 0 ? 'removeClass' : 'addClass']('d-none-important');
            $(this.selectors.dhas_items)[items.length > 0 ? 'addClass' : 'removeClass']('d-none-important');

            this.updateHeaderCount();
			var $popup = $('[data-js-popup-ajax]');
		    this.update($popup);
            this.removeCustomerItem(id);

            if (callback) callback();
        },
        clear: function (callback) {
            localStorage.removeItem(this.current_storage);

            this.checkProductStatus();

            $(this.selectors.has_items).addClass('d-none-important');
            $(this.selectors.dhas_items).removeClass('d-none-important');

            this.updateHeaderCount();

            this.clearCustomerItem();

            if (callback) callback();
        },
        checkProductStatus: function($products) {
            $products = $products || $('[data-js-product]');

            var _ = this,
                storage = localStorage.getItem(this.current_storage),
                items = storage ? JSON.parse(storage) : [],
                $active_products = $();

            $.each(items, function () {
                $.each(this, function (k, v) {
                    var $selected_product = $products.filter('[data-product-handle="' + v + '"][data-product-variant-id="' + k + '"]');

                    if ($selected_product.length) {
                        $active_products = $active_products.add($selected_product);
                    }
                });
            });

            $products.not($active_products).find(_.selectors.button).removeAttr('data-button-status');
            $active_products.find(_.selectors.button).attr('data-button-status', 'added');
        },
        updateHeaderCount: function(callback) {
            var storage = localStorage.getItem(this.current_storage),
                count = storage ? JSON.parse(storage).length : 0;

            $('[data-js-' + this.namespace + '-count]').attr('data-js-' + this.namespace + '-count', count).html(count);

            if (callback) callback();
        },
      	_resultToHTML: function($items, data, callback) {
            var $template = $($('#template-' + this.namespace + '-ajax')[0].content),
                $fragment = $(document.createDocumentFragment());

            for(var i = 0; i < data.params.length; i++) {
                $.each(data.params[i], function (k, v) {
                    var product = null,
                        variant = null;

                    $.each(data.products, function () {
                        if(this.handle === v) {
                            product = this;
                        }
                    });

                    if(!product) return;

                    $.each(product.variants, function() {
                        if(+this.id === +k) {
                            variant = this;
                            return false;
                        }
                    });

                    var image = variant.featured_image ? variant.featured_image.src : product.featured_image;

                    var $item = $template.clone(),
                        $product = $item.find('.product-store-lists'),
                        $image = $item.find('.product-store-lists__image img'),
                        $title = $item.find('.product-store-lists__title a'),
                        $variant = $item.find('.product-store-lists__variant'),
                        $price = $item.find('.product-store-lists__price .price'),
                        $links = $item.find('a').not('.product-store-lists__remove');

                    $product.attr('data-product-variant-id', k);
                    $product.attr('data-product-handle', v);
                    $links.attr('href', '/products/' + v + '?variant=' + k);
                    $title.html(product.title);
                    $image.attr('srcset', Shopify.resizeImage(image, '120x') + ' 1x, ' + Shopify.resizeImage(image, '240x') + ' 2x');

                    if(variant.title !== 'Default Title') {
                        $variant.html(variant.title).removeClass('d-none-important');
                    }

                    theme.ProductCurrency.setPrice($price, variant.price, variant.compare_at_price);

                    $fragment.append($item);
                });
            }
			
            $items.html('');
            $items.append($fragment);

            if(callback) {
                callback();
            }
        },
        _getProducts: function(items, callback) {
            var _ = this,
                handles = [],
                cycles = 1,
                data_items = [],
                i = 0;

            if (this.xhr) {
                this.xhr.abort();
            }

            for(; i < items.length; i++) {
                $.each(items[i], function () {
                    handles.push(this)
                });
            }

            i = 0;
            cycles = Math.max(1, Math.ceil(handles.length/20));

            function recurcionRequests(i) {
                var request_handles = handles.slice(i * 20, (i + 1) * 20);
				
                _.xhr = $.ajax({
                    type: 'GET',
                    url: '/collections/all',
                    cache: false,
                    data: {
                        view: 'products_by_handle',
                        constraint: request_handles.join('+')
                    },
                    dataType: 'html',
                    success: function (data) {                                   
                        $.each(JSON.parse(data), function() {
                            data_items.push(this);
                        });

                        i++;

                        if(i < cycles) {
                            recurcionRequests(i);
                        } else {
                            callback({
                                params: items,
                                products: data_items
                            });
                        }
                    }
                });
            };

            recurcionRequests(i);
        },
        update: function($popup, callback) {
            var _ = this,
                storage = localStorage.getItem(this.current_storage),
                items = storage ? JSON.parse(storage) : [],
                $content = $popup.find('.popup-' + this.namespace + '_content'),
                $empty = $popup.find('.popup-' + this.namespace + '_empty'),
                $items = $popup.find('.popup-' + this.namespace + '_items'),
                $count = $popup.find('[data-js-popup-' + this.namespace + '-count]');

            
            $content[items.length > 0 ? 'removeClass' : 'addClass']('d-none-important');
            $empty[items.length > 0 ? 'addClass' : 'removeClass']('d-none-important');
			
          	
            if(items.length > 0) {
                var data = this._getProducts(items, function(data) {
                    _._resultToHTML($items, data, callback);

                    theme.ProductCurrency.update();
                });
            } else {
                $items.html('');

                if(callback) {
                    callback();
                }
            }
        },
        updateFull: function ($popup, callback) {
            var _ = this,
                $content = $popup.find('.popup-' + this.namespace + '-full__content');

            $content.html('');

            var obj = {
                type: 'GET',
                data: {
                    view: _.namespace
                },
                cache: false,
                success: function(data) {
                    $content.html(data);                   
                    theme.ProductCurrency.update();

                    if(callback) {
                        callback();
                    }
                }
            };

            if(theme.customer) {
                $.extend(obj, {
                    url: '/cart'
                });
            } else {
                var storage = localStorage.getItem(this.current_storage),
                    items = storage ? JSON.parse(storage) : [],
                    constraint = [];

                for(var i = 0; i < items.length; i++) {
                    $.each(items[i], function (v, k) {
                        constraint.push(k + '=' + v);
                    });
                }

                constraint.join('+');

                $.extend(true, obj, {
                    url: '/collections/all',
                    data: {
                        constraint: constraint
                    }
                });
            }

            $.ajax(obj);
        }       
    });
    function StoreLists() {
        this.namespaces = [
            /*'wishlist',
            'compare'*/
          	'wishlist'
        ];

        this.load();
    };
    function Popup(namespace) {
        this.namespace = namespace;

        this.load();
    };

   
    StoreLists.prototype = $.extend({}, StoreLists.prototype, {
        lists: {},
        popups: {},
        load: function () {
            var triggers_array = [];

            for(var i = 0; i < this.namespaces.length; i++) {
                this.lists[this.namespaces[i]] = new Engine(this.namespaces[i], function (obj) {
                    triggers_array.push(obj);
                });               
            }

            if(triggers_array.length) {
                var $button_confirm = $('[data-js-button-transfer-data]');
                $button_confirm.one('click', function () {
                    $button_confirm.attr('data-js-active', true);                    
                });
            }
          	this.updateHeaderCount();
        },
        checkProductStatus: function () {
            $.each(this.lists, function () {
                this.checkProductStatus();
            });
        },
        updateHeaderCount: function () {
            $.each(this.lists, function () {
                this.updateHeaderCount();
            });
        }
    });
  theme.StoreLists = new StoreLists;
};
(function( $ ) {
   "use strict";
  
  	  var body = jQuery('body'),
          $ld = jQuery('#ld_cl_bar'),
      	  $ld_cart = jQuery('.ld_cart_bar'),      
          rtl = body.hasClass('rtl_true'), 
          sp_notices = '#sp_notices_wrapper',     
          window_w = jQuery(window).width();
      var change = false;  
  	  var interact_main_product = true;
  	  var id_new ="";
      var ajaxSelector= '.nt_filter_block a,.js_ajaxsortby a, .js_paginate_ajax a, a.js_ajax_filter, a.clear_filter_js';
  
  	  function convert_currency_andy(value, type) {
        var newCurrency = Currency.currentCurrency;
        if(Currency.currentCurrency=== undefined) newCurrency= 'USD';
        var oldCurrency = shopCurrency;
        if (isNaN(value)) {
          value = 0.0;
        }
        
        var cents = 0.0;
        var oldFormat = Currency.moneyFormats['USD'][Currency.format] || '';
        var newFormat = Currency.moneyFormats[Currency.currentCurrency][Currency.format] || '';
        if(Currency.currentCurrency=== undefined) {
            var newFormat = Currency.moneyFormats['USD'][Currency.format] || '';
        }
                                                     
        if (oldFormat.indexOf('amount_no_decimals') !== -1) {
             cents = Currency.convert(parseInt(value, 10) * 100, oldCurrency, newCurrency);
        } else if (oldCurrency === 'JOD' || oldCurrency == 'KWD' || oldCurrency == 'BHD') {
             cents = Currency.convert(parseInt(value, 10) / 10, oldCurrency, newCurrency);
        } else {
             cents = Currency.convert(parseInt(value, 10), oldCurrency, newCurrency);
        }
        if (type == 'nosymbol') {
          return cents; 
        }    
                                          
        var my_data = Currency.formatMoney(cents, newFormat);
        return my_data;

      };
      /* ---------------------------------------------
     Currency Choose
--------------------------------------------- */
    
      $(document).on('click','.currency-lists li',function(e){
        $('.currency-lists li').removeClass("active");        
        $(this).addClass("active");
        var name_currency = $(this).attr('data-value');
        $('.currency-picker__wrapper .chosen-single span').text(name_currency);
        $('.currency-picker').val(name_currency);
        $('.currency-picker').val(name_currency).change();
        Currency.cookie.write(name_currency);
        $('.lang-currency').empty();
        var id = $(this).attr("data-value");       
        $('.lang-currency').append($(".currency-lists ."+id).text());
        
        $(".close-account-control").trigger("click");
      });

      

/* ---------------------------------------------
     Quantity Product Page
--------------------------------------------- */       
               
      if($("#Quantity").attr("data-max") == 0){
        $("#Quantity").val($("#Quantity").attr("data-max"));
      }
   
      $('.clear-cart').on('click',function(e){
        e.preventDefault();
        $.ajax({
          type: "POST",
          url: '/cart/clear.js',
          success: function(){
            location.reload();
          },
          dataType: 'json'
        });
      }) 
                                           
      function searchURL(url) {        
        try{
          var arr = url.split('&product_type='),
              arr_q = arr[1].split('&q=');
          return arr[0]+'&q='+arr_q[1]+'*'+'+product_type:'+arr_q[0];
        } catch(e){
          return url+'*';
        }       
      };
  	  
  	  function ShowCart(){       
            $.ajax({
              url: ' /cart.js',
              type: 'GET', 
              dataType: 'json',
              success: function(data) {
                //$(".cartCount").text(data.item_count);                                                  
                $(".js-cart-inner").empty();   
                $(".js-total-price").empty();                                      
                var html = '';                                      
                if (data.item_count > 0) {      
                      $(".js-cart-inner").removeClass("cart-empty");                            
                      var index_item = 0;

                      html = html + '<h5 class="title">You have <span class="count-item">'+data.item_count+ '</span> item(s) in your cart</h5>';
                        html = html + '<ul class="list-item">'; 

                            $.each(data.items, function(index, el) {
                            html = html + '<li class="product-item" id="item-'+el.id+'">';
                              html = html + '<a href="'+el.url+'" class="thumb"><img width="93" src="'+el.image +'" alt="'+el.title+'"></a>';
                              html = html + '<div class="info">';
                                html = html + '<a href="'+el.url+'" class="product-name">'+el.title+'</a>';
                                html = html + '<div class="product-item-qty">';
                                  html = html + '<span class="number price">';
                                    html = html + '<span class="qty">' + el.quantity+ '</span> x <span ><span class="amount"><span class="money" data-currency-'+Currency.currentCurrency+'="'+convert_currency_andy(el.price,'xx')+'">'+convert_currency_andy(el.price,'xx')+'</span></span></span>';
                                  html = html + '</span>';
                                html = html + '</div>';
                              	html = html + '<a class="js-remove-item remove" href="#" data-id="' + el.id +'" title="Remove this item">';
                  					html = html + '<i class="fa fa-trash-o"></i>';
                				html = html + '</a>';
                              html = html + '</div>';
                            html = html + '</li>';   
                            })  

                        html = html + '</ul>';
                        html = html + '<div class="subtotal">';
                          html = html + '<span class="text">SubTotal : </span>';
                          html = html + '<span class="js-total-price"><span class="amount"><span class="money" data-currency-'+Currency.currentCurrency+'="'+convert_currency_andy(data.price,'11')+'" data-currency-'+Currency.currentCurrency+'="'+convert_currency_andy(data.price,'11')+'" data-currency="'+Currency.currentCurrency+'"></span></span></span>';
                        html = html + '</div>';
                        html = html + '<div class="group-button-checkout">';
                          html = html + '<a href="/cart">Cart</a>';
                          html = html + '<a href="/checkout">Checkout</a>';
                        html = html + '</div>';  


                  }else{ 
                       html = html + '<div class="js-cart-inner cart-empty">';
                              html = html + '<i class="fa fa-shopping-bag"></i><p>Your cart is currently empty.</p> ';
                       html = html + '</div>';                               
                  }

                  $(".js-cart-inner").html(html);
                  //$(".cartCost").html(convert_currency_andy(data.total_price )); 
                  $(".js-cart-inner .js-total-price").html(convert_currency_andy(data.total_price ));                                    
                }

              })       
          };
     
      function get_pid_variant(option){
            var js_product_selectors = $("#js-product-selectors");                                      
      		var result  = js_product_selectors.val();
            js_product_selectors.find("option").each(function(){
                                               
                var str = $(this).text();
                var arr = str.split(' - ');
                arr[arr.length] = $(this).val();
          	    //console.log($(this).val());
                var ok = true;
                var count = 0;
              for(var i = 0; i < option.length; i++){
                for(var j = 0; j< arr.length; j++){
                  if(option.length > 1){
                    var tg = arr[j].replace(/ /g,'');
                  }else{
                    var tg = arr[j]; 
                  }
                  var val = tg.split('/');
                  for(var k=0; k < val.length; k++){
                    if(option[i] == val[k]){
                      count++;
                    }
                  }              
                }
              }
              if(count != option.length){
                ok = false;
              }
              if (ok==true){
                result =  arr[arr.length - 1];  
                //console.log("Tìm thấy");
                return false;
              }          
            });
        	
        return result;
      }
  	  function TriggerSidebarDropdown() {
        if (body.hasClass('pside_opened')) return;
        // Show hidden sidebar/dropdown             
        jQuery('.push_side[data-id="#js_nt_cart_canvas"]').trigger('click');             
      };
      function TriggerAfterATC(bl,id) {            
        TriggerSidebarDropdown();            
      };
  	  function addItem(item,_this) {         
          //jQuery(_this).attr('disabled','disabled').css('pointer-events', 'none');        
          var $this = jQuery(_this);  
          $this.css({'opacity':'.5'});
          
          var params = {
              type: 'POST',
              url: '/cart/add.js',
              data:{
               "items": item
              },
              dataType: 'json',
              success: function(response) { 
               	ShowCart();   
                $('.js_add_to_cart_button').removeAttr("disabled").css('pointer-events', 'auto');  
                $this.css({'opacity':'1'}); 
                TriggerSidebarDropdown(); 
              },
              error: function(XMLHttpRequest, textStatus) {
                cmsheroShopify.onError(XMLHttpRequest, textStatus);
              }
            };
            $.ajax(params);
        };

        function addItemFrom(form_id, _this) {
            var params = {
              type: 'POST',
              url: '/cart/add.js',
              data: form_id.serialize(),
              dataType: 'json',
              success: function(line_item) { 
                if (line_item.id == undefined) {
                     var id = 19041994;
                } else {
                  var id = line_item.product_id;
                }               
                 cmsheroShopify.onCartUpdate(1,1,id);                  
                 
              },
              error: function(XMLHttpRequest, textStatus) {
                cmsheroShopify.onError(XMLHttpRequest, textStatus);
              }
            };
            $.ajax(params);
        };

        function changeItem(vid, qty, _item) {
          var params = {
            type: 'POST',
            url: '/cart/change.js',
            data:  'quantity='+qty+'&id='+vid,
            dataType: 'json',
            success: function(cart) {              
              if (qty == 0) { 
                _item.slideUp("250", function() { $(this).remove(); } );
              } else { 
                  var price = _item.find('.qty_cart_js').attr('data-price')*qty;
                  _item.find('.js_tt_price_it').html(cmsheroShopify.formatMoney(price));
              }
              cmsheroShopify.onCartUpdate(0,0);

            },
            error: function(XMLHttpRequest, textStatus) {
              cmsheroShopify.onError(XMLHttpRequest, textStatus);
            },
            complete: function() {             
             _item.find('.ld_cart_bar').addClass('on_end');
             setTimeout(function(){ 
                _item.find('.ld_cart_bar').attr('class', '').addClass('ld_cart_bar');               
               nt_js_cart.removeClass('ld_nt_cl'); 
             }, 280);
            }
          };
          $.ajax(params);
        };
  	    
      
      
   cmsheroShopify = (function() {
     	var 
          cmsheroTheme = {
            popupAnimation: 'mfp-move-horizontal',            
            money_format : '$'
      	};
        return {
           init: function() {
             
			 if ( $('#js_recently_wrapper').length > 0 ) {
               $('#js_recently_wrapper').addClass('lazyload').one('lazyloaded', function(e) {
                 cmsheroShopify.recently_viewed();
                 
               });
             }
            
             $('.js_lz_slpr.dn').removeClass('dn').addClass('lazyload').one('lazyincluded', function(e) {       
                  cmsheroShopify.SalesPopup();
             });
           },
           formatMoney: function(cents, format) {
              if (typeof cents == 'string') { cents = cents.replace('.', ''); }
              var value = '',
                  placeholderRegex = /\{\{\s*(\w+)\s*\}\}/,
                  formatString = (format || t_moneyFormat || '$');

              var defaultOption = function(opt, def) {
                 return (typeof opt == 'undefined' ? def : opt);
              }

              var formatWithDelimiters = function(number, precision, thousands, decimal) {
                 precision = defaultOption(precision, 2);
                 thousands = defaultOption(thousands, ',');
                 decimal = defaultOption(decimal, '.');

                 if (isNaN(number) || number == null) {
                    return 0;
                 };

                 number = (number / 100.0).toFixed(precision);

                 var parts = number.split('.');
                 var dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
                 var cents = parts[1] ? (decimal + parts[1]) : '';

                 return dollars + cents;
              }

              switch (formatString.match(placeholderRegex)[1]) {
                 case 'amount':
                    value = formatWithDelimiters(cents, 2);
                    break;
                 case 'amount_no_decimals':
                    value = formatWithDelimiters(cents, 0);
                    break;
                 case 'amount_with_comma_separator':
                    value = formatWithDelimiters(cents, 2, '.', ',');
                    break;
                 case 'amount_no_decimals_with_comma_separator':
                    value = formatWithDelimiters(cents, 0, '.', ',');
                    break;
              }

              return formatString.replace(placeholderRegex, value);
           },
           consoleTheme: function(e, t, n, r) {
               console.log("%c ".concat(e, " %c ").concat(t, " %c"), "background:".concat(n || "#35495f", " ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff"), "background:".concat(r || "#41b883", " ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff"), "background:transparent")
           },
           getRandomInt : function (min, max) {
         		return Math.floor(Math.random() * (max - min + 1)) + min;
    	   },
           SalesPopup : function () {
              if ($('.popup_slpr_wrap').length == 0  || $(window).width() < 768) return;
				
                var popup = $('.popup_slpr_wrap'),
                    stt = popup.data('stt'),
                    show = stt.show,
                    limit = stt.limit - 1,
                    pp_type = stt.pp_type, 
                    catLink = stt.catlink,
                    arrId = JSON.parse($('#id_sale_pp').html()),
                    arrTitle = JSON.parse($('#title_sale_pp').html()),
                    arrUrl = stt.url,
                    arrImage = stt.image,
                    arrID = stt.id,
                    arrLocation = JSON.parse($('#location_sale_pp').html()),
                    arrTime = JSON.parse($('#time_sale_pp').html()),
                    ClassUp = stt.ClassUp,
                    ClassDown = stt.classDown[ClassUp],
                    StarTimeout,StayTimeout,

                    slpr_img = $('.js_slpr_img'),
                    slpr_a = $('.js_slpr_a'),
                    slpr_tt = $('.js_slpr_tt'),
                    slpr_location = $('.js_slpr_location'),
                    slpr_ago = $('.js_slpr_ago'),
                    slpr_qv = $('.pp_slpr_qv'),

                    index = 0,
                    min = 0,
                    max = arrUrl.length - 1,
                    max2 = arrLocation.length - 1,
                    max3 = arrTime.length - 1,
                    StarTime = stt.StarTime * stt.StarTime_unit,
                    StayTime = stt.StayTime * stt.StayTime_unit;

              
                  var Updatedata = function (index) {

                    // update img 
                    var img = arrImage[index],
                         img_url = img.replace(".jpg?v=", "_65x.jpg?v=").replace(".png?v=", "_65x.png?v=").replace(".gif?v=", "_65x.gif?v="),
                         img_url2 = img.replace(".jpg?v=", "_130x.jpg?v=").replace(".png?v=", "_130x.png?v=").replace(".gif?v=", "_130x.gif?v=");
                    slpr_img.attr('src',img_url).attr('srcset',img_url+' 1x,'+img_url2+' 2x');

                    // update title
                    slpr_tt.text(arrTitle[index]);
					slpr_tt.attr("data-pid",arrId[index]);
                    // update link
                    slpr_a.attr('href',arrUrl[index]);
				    
                    // update id quick view
                    slpr_qv.attr('data-id',arrID[index]);

                    // update location
                    slpr_location.text(arrLocation[cmsheroShopify.getRandomInt(min, max2)]);

                    // update time
                    slpr_ago.text(arrTime[cmsheroShopify.getRandomInt(min, max3)]);

                    showSalesPopUp();
                  };

                // Load sales popup
                var loadSalesPopup = function () {
                  //if (nt_check) return;
                    if (pp_type == '1') {
                      Updatedata(index);
                      ++index;
                      if (index > limit || index > max) {index = 0} 

                    } else {
                     Updatedata(cmsheroShopify.getRandomInt(min, max));
                    }

                    StayTimeout = setTimeout(function() {
                        unloadSalesPopup();
                    }, StayTime);
               };

               // unLoad sales popup
               var unloadSalesPopup = function () {
                  hideSalesPopUp();
                  StarTimeout = setTimeout(function(){                    
                     loadSalesPopup();
                  }, StarTime);
               };
               //slideOutDown, fadeOut

               var showSalesPopUp = function () {
                 popup.removeClass('hide').addClass(ClassUp).removeClass(ClassDown); 
               };

               var hideSalesPopUp = function () {
                  popup.removeClass(ClassUp).addClass(ClassDown); 
               };

               $(".pp_slpr_close").on("click", function(e){
                   e.preventDefault();
                  hideSalesPopUp();
                  clearTimeout(StayTimeout);
                  clearTimeout(StarTimeout);
               });

               popup.on('open_slpr_pp', function () {
                  unloadSalesPopup();
               });
               //$('.popup_slpr_wrap').trigger('open_slpr_pp');

               if (designMode ) return;

               // Run unloadSalesPopup 
               unloadSalesPopup();

            },
            back_to_top: function(){
              $(window).scroll(function(){
                  if ($(this).scrollTop() > 300) {
                      $('.back-to-top').fadeIn();
                      $('.back-to-top').addClass('show');
                  } else {
                      $('.back-to-top').fadeOut();
                      $('.back-to-top').removeClass('show');
                  }
              });
              $(document).on('click','.back-to-top',function(){
                  $('html, body').animate({scrollTop : 0},800);
                  return false;
              });

            },          
            clone_main_menu: function(){ 
              var b = function (f, e) {
                    return e + f
              }
              var d = function (e, f) {
                    if (e.find(".menu-item-has-children").length) {
                        e.find(".menu-item-has-children").each(function() {
                            var i = jQuery(this);
                            d(i, f);
                            var g = "kt-panel-" + f;
                            while (jQuery("#" + g).length) {
                                f++;
                                g = "kt-panel-" + f
                            }
                            i.prepend('<a class="kt-next-panel" href="#' + g + '" data-target="#' + g + '"></a>');
                            var h = jQuery("<div>").append(i.find("> .submenu").clone()).html();
                            i.find("> .submenu").remove();
                            jQuery(".kt-clone-wrap .kt-panels").append('<div id="' + g + '" class="kt-panel kt-sub-panel kt-hidden">' + h + "</div>")
                        })
                    }
              }
              var c = function () {
                if (!jQuery(".kt-clone-wrap").length) {
                    jQuery(".header").prepend('<div class="kt-clone-wrap"><div class="kt-panels-actions-wrap"><a class="kt-close-btn kt-close-panels" href="#">x</a></div><div class="kt-panels"></div></div>')
                }
                var e = 0;
                var f = Array();
                jQuery(".clone-main-menu").each(function() {
                    var g = jQuery(this);
                    var l = g;
                    var i = l.attr("id");
                    var h = "kt-clone-" + i;
                    if (!$("#" + h).length) {
                        var j = g.clone(true);
                        j.find(".menu-item").addClass("clone-menu-item");
                        j.find("[id]").each(function() {
                            j.find('.vc_tta-panel-heading a[href="#' + jQuery(this).attr("id") + '"]').attr("href", "#" + b(jQuery(this).attr("id"), "kt-clone-"));
                            jQuery(this).attr("id", b(jQuery(this).attr("id"), "kt-clone-"))
                        });
                        j.find(".kt-menu").addClass("kt-menu-clone");
                        if (!jQuery(".kt-clone-wrap .kt-panels #kt-panel-" + i).length) {
                            jQuery(".kt-clone-wrap .kt-panels").append('<div id="kt-panel-' + i + '" class="kt-panel kt-main-panel"><ul class="depth-01"></ul></div>')
                        }
                        var k = jQuery(".kt-clone-wrap .kt-panels #kt-panel-" + i + " ul");
                        k.html(j.html());
                        d(k, e)
                    }
                })
              }
              c();   
              
              
			  jQuery(document).on("click", ".kt-next-panel", function(g) {
                  var f = jQuery(this);
                  var j = f.closest(".menu-item-has-children");
                  var k = f.closest(".kt-panel");
                  var i = f.attr("href");                
                //find id parent of li
                  var parent_id = f.parent().attr("id");
                  var _pos = parent_id.indexOf("_");
                  var id_num = parent_id.substring(_pos+1);
                  var lazy_id = "kt-clone-bk_"+id_num;
                  
                  if (jQuery(i).length) {
                      k.addClass("kt-sub-opened");
                      jQuery(i).addClass("kt-panel-opened").removeClass("kt-hidden").attr("data-parent-panel", k.attr("id"));
                      var h = j.find(".kt-item-title").attr("title");
                      if (typeof h != "undefined" && typeof h != false) {
                          if (!jQuery(".kt-panels-actions-wrap .kt-current-panel-title").length) {
                              jQuery(".kt-panels-actions-wrap").prepend('<span class="kt-current-panel-title"></span>')
                          }
                          jQuery(".kt-panels-actions-wrap .kt-current-panel-title").html(h)
                      } else {
                          jQuery(".kt-panels-actions-wrap .kt-current-panel-title").remove()
                      }
                      jQuery(".kt-panels-actions-wrap .kt-prev-panel").remove();
                      jQuery(".kt-panels-actions-wrap").prepend('<a class="kt-prev-panel" href="#' + k.attr("id") + '" data-cur-panel="' + i + '" data-target="#' + k.attr("id") + '"></a>')
                  }
                 
                  
                  g.preventDefault()
              });
              jQuery(document).on("click", ".kt-prev-panel", function(h) {
                  var f = jQuery(this);
                  var g = f.attr("data-cur-panel");
                  var k = f.attr("href");
                  jQuery(g).removeClass("kt-panel-opened").addClass("kt-hidden");
                  jQuery(k).addClass("kt-panel-opened").removeClass("kt-sub-opened");
                  var j = jQuery(k).attr("data-parent-panel");
                  if (typeof j == "undefined" || typeof j == false) {
                      jQuery(".kt-panels-actions-wrap .kt-prev-panel").remove();
                      jQuery(".kt-panels-actions-wrap .kt-current-panel-title").remove()
                  } else {
                      jQuery(".kt-panels-actions-wrap .kt-prev-panel").attr("href", "#" + j).attr("data-cur-panel", k).attr("data-target", "#" + j);
                      var i = jQuery("#" + j).find('.kt-next-panel[data-target="' + k + '"]').closest(".menu-item").find(".kt-item-title").attr("data-title");
                      if (typeof i != "undefined" && typeof i != false) {
                          if (!jQuery(".kt-panels-actions-wrap .kt-current-panel-title").length) {
                              jQuery(".kt-panels-actions-wrap").prepend('<span class="kt-current-panel-title"></span>')
                          }
                          jQuery(".kt-panels-actions-wrap .kt-current-panel-title").html(i)
                      } else {
                          jQuery(".kt-panels-actions-wrap .kt-current-panel-title").remove()
                      }
                  }
                  h.preventDefault()
              });
              jQuery(document).on("click", ".mobile-navigation", function() {
                  jQuery(".kt-clone-wrap").addClass("open");
                  return false
              });
              jQuery(document).on("click", ".kt-clone-wrap .kt-close-panels", function() {
                  jQuery(".kt-clone-wrap").removeClass("open");
                  return false
              })
            },
            sidePopup : function() {
                var mask = $('.mask-overlay'),
                    classActive = 'act_current',
                    html = $('html');

                jQuery(document).on("click", ".push_side", function (e) {                   
                   var _this = $(this),
                       _id = _this.data('id'), 
                       $id = $(_id);
				   
                   if ( $id.length == 0 ) return;
                   e.preventDefault();
                
                   closeMenu();
                   if (!_this.hasClass(classActive)) { openMenu(_this,_id,$id) }

                });
                // click touchstart
                jQuery(document).on("click touchstart", ".mask-overlay", function (e) {                  
                   closeMenu();
                });
                jQuery(document).on('click', '.act_opened .close_popup_ajax', function () {
                   closeMenu();
                });

                function openMenu(_this,_id,$id) {                
                   _this.addClass(classActive);
                   html.addClass('hside_opened');
                   body.addClass('pside_opened');
                   $id.addClass('act_opened');
                   mask.addClass('mask_opened');                
                }

                function closeMenu() {
                   jQuery('.push_side.act_current').removeClass(classActive);
                   html.removeClass('hside_opened');
                   body.removeClass('pside_opened');
                   jQuery('.hero_canvas.act_opened').removeClass('act_opened');
                   mask.removeClass('mask_opened');                 
                }
             },            
          	searchAjax : function () {
                 if (body.hasClass('js_search_false')) return;

                  var slug_js = '&view=js', timer = 0, data,_this,frm,btn,$result,ld_bar,skeleto,val_old,val_currect;
                  var $ntSearch = $('#nt_search_canvas');
                  jQuery(document).on('keyup', '.js_iput_search', function(e,bl) {
                     _this = $(this);
                     frm = _this.closest("form");
                     btn = frm.find('.js_btn_search');
                     _this.attr('autocomplete', 'off');
                     $result = $('.js_prs_search');
                     ld_bar = $('.ld_bar_search');
                     skeleto = $('.skeleton_js');
                     val_currect = _this.val();
                    if ( (val_old == val_currect || val_currect == "") && bl != '1' ) return;
                    ld_bar.addClass('on_star');
                    $result.hide();
                    skeleto.removeClass('dn');
                    btn.addClass('pe_none');
                    $('.cl_h_search').addClass('atc_show_rs');
                    if (btn.hasClass('use_jsfull') && $(window).width() > 1024) {
                        slug_js = '&view=js_full'
                    } else { 
                        slug_js = '&view=js';
                    }

                    
                    clearTimeout(timer);
                    timer = setTimeout(function () {                     
                    data = searchURL(frm.serialize());
                   
                    $.ajax({
                      url: frm.attr('action'), 
                      data : data+slug_js,
                      success: function(result){
                        var arr = result.split('||')
                         $('.search_header__prs>span').hide();                        
                         $(arr[0]).show();
                          $result.html(arr[1]);
                          val_old = val_currect;
                          body.trigger('refresh_currency');
                       },
                      error: function(xhr,status,error){
                        console.log(error)
                       },
                      complete: function(){
                        btn.removeClass('pe_none');
                        ld_bar.addClass('on_end');
                         setTimeout(function(){ 
                            ld_bar.attr('class', '').addClass('ld_bar_search');
                            skeleto.addClass('dn');
                            $result.show();
                         }, 280);
                       }
                    });
                  }, 400);

                  });

                jQuery(document).on('click', function (e) {
                  var target = e.target;
                  if (!$(target).is('.cl_h_search') && !$(target).parents().is('.cl_h_search')) {
                      $('.cl_h_search').removeClass('atc_show_rs');
                      val_old = '';
                  }
                });

                  $ntSearch.on('change', 'select', function() { 
                    $('#nt_search_canvas .js_iput_search').trigger('keyup',1);
                  });

                  $('.h_search_frm').on('change', 'select', function() { 
                    $('.h_search_frm .js_iput_search').trigger('keyup',1);
                  });

                $ntSearch.addClass('lazyload').one('lazyincluded', function(e) {
                   //console.log('search ajax')
                  body.trigger('refresh_currency');                
                  val_old = '';
                  
                });      
            },
          	onCartUpdate : function(bl,blUp_items,id) {
              //console.log(blUp_items)
              if (body.hasClass('template-cart')) {
                $.get('/cart?view=pagejs', function(data) {
                  var arrCat = data.split("<!--split-->");

                  if (arrCat[0] != $('.jsccount').first().html() ) {
                   if ( parseInt(arrCat[0]) == 0 ) {
                       $('.nt_js_cart, .js_cart_cd').hide();
                       $('.shipping_calc_page').addClass('dn');
                       $('.empty_cart_page').show();
                    } else {
                       $('.empty_cart_page').hide();
                       $('.nt_js_cart, .js_cart_cd').show();
                       $('.shipping_calc_page').removeClass('dn');
                    }

                    $('.jsccount').html(arrCat[0])
                    var aar1 = arrCat[1].split(',]'),
                        this_thres = $('.cart_thres_'+aar1[0]);
                    if (aar1 != 'spt4') {
                         this_thres.find('.mn_thres_js').html( aar1[1] );
                      if (this_thres.is(":hidden")) {
                        $('.cart_thres_1,.cart_thres_2,.cart_thres_3').slideUp(200);
                           this_thres.slideDown(250);
                      }
                    }
                    if (blUp_items) {$('.js_cat_items').html(arrCat[2]);}
                    $('.js_cat_dics').html(arrCat[3]);
                    $('.js_cat_ttprice').html(arrCat[4]);

                       //console.log(arrCat[5])
                    if (arrCat[5] == '1') {
                         $('.js_gift_wrap').addClass('dn');
                    } else {
                         $('.js_gift_wrap').removeClass('dn');
                    }

                    body.trigger('refresh_currency');
                  }
                  $('.nt_js_cart.loading, .js_addtc.loading, .js_frm_cart.loading, .js_add_group.loading, .sticky_atc_js.loading').removeClass('loading');
                  $ld.trigger( "ld_bar_end" );
                  if (blUp_items) {
                     $('html, body').animate({
                          scrollTop: $('#shopify-section-cart-template').offset().top - 40
                     }, 400);
                  }
                });

              } else {

                $.get('/cart?view=js', function(data) {
                  var arrCat = data.split("<!--split-->");

                  if (arrCat[0] != $('.jsccount').first().html() ) {
                    if ( parseInt(arrCat[0]) == 0 ) {
                       $('.nt_js_cart .js_cart_note,.nt_js_cart .js_cart_footer,.nt_js_cart .js_cart_tool,.js_cat_items,.js_cart_cd').hide();
                       $('.nt_js_cart .empty').show();
                    } else {
                       $('.nt_js_cart .empty').hide();
                       $('.nt_js_cart .js_cart_note,.nt_js_cart .js_cart_footer,.nt_js_cart .js_cart_tool,.js_cat_items,.js_cart_cd').show();
                    }

                    $('.jsccount').html(arrCat[0])
                    var aar1 = arrCat[1].split(',]'),
                        this_thres = $('.cart_thres_'+aar1[0]);
                    if (aar1 != 'spt4') {
                         this_thres.find('.mn_thres_js').html( aar1[1] );
                      if (this_thres.is(":hidden")) {
                        $('.cart_thres_1,.cart_thres_2,.cart_thres_3').slideUp(200);
                           this_thres.slideDown(250);
                      }
                    }
                    if (blUp_items) {$('.js_cat_items').html(arrCat[2]);}
                    $('.js_cat_dics').html(arrCat[3]);
                    $('.js_cat_ttprice').html(arrCat[4]);

                    if (arrCat[5] == '1') {
                      $('.js_cart_tls_back').trigger('click')
                         $('.js_gift_wrap').addClass('dn');
                    } else {
                         $('.js_gift_wrap').removeClass('dn');
                    }

                       if ( $('.popup_uppr_wrap').length > 0 ) {
                         id = 19041994;
                         TriggerAfterATC(bl,id);
                       } else if ($.magnificPopup.instance.isOpen){
                      $.magnificPopup.close();
                      setTimeout(function(){ TriggerAfterATC(bl,id); }, 505);
                    } else {
                      TriggerAfterATC(bl,id);
                    }
                       //cmsheroShopify.WidgetCartUpdateMobile(); 
                       body.trigger('refresh_currency');
                      // open hidden sidebar cart
                  }
                  $('.nt_js_cart.loading, .js_addtc.loading, .js_frm_cart.loading, .js_add_group.loading, .sticky_atc_js.loading').removeClass('loading');
                  $ld.trigger( "ld_bar_end" );
                });
              }
            },
            CreatNotices : function(txt) {
               $(sp_notices).html('<p class="shopify-info sp_notice"><i class="facl facl-attention"></i>'+txt+'<i class="pegk pe-7s-close"></i></p>');
               setTimeout(function(){ $(sp_notices+' .sp_notice').addClass('show_notice'); }, 200);
            },
          	HideNotices : function() {
                $(sp_notices+' .show_notice').removeClass('show_notice');
            },
            onError : function(XMLHttpRequest, textStatus) {              
              var data = eval('(' + XMLHttpRequest.responseText + ')');
              cmsheroShopify.CreatNotices(data.description);
            },
            ajaxSwatch : function(){              	
				jQuery(document).on('click', '.swatch .swatch-element', function(e) {                   
                   var 	val = $(this).data('value'),
                   	   	val_option_index =  $(this).closest(".swatch").data("option-index"),
                    	js_handle_product = $("#js-handle-product"),  
                    	js_product_price = $("#js-product-price"),
                    	handle_product  = js_handle_product.val(),
                    	js_product_selectors = $("#js-product-selectors"),
                    	js_swatch = $('.swatch'),
                        js_atc_product = $(".js_sticky_sl"),
                        sticky_atc_a = $(".sticky_atc_a"),
                        sticky_atc_price = $(".sticky_atc_price"),
                    	arr_variants = new Array(),  
                    	option = [],
                    	index = 0;
                  
                   if(val_option_index == 0){
                       e.preventDefault();
                       js_swatch.find(':radio').removeAttr('checked');
                       js_swatch.find('.swatch-element').removeClass('checked');
                       $(this).addClass("checked").find(':radio').attr("checked", "checked");
                       option[index] = val;

                       $.getJSON('/products/'+handle_product+'.js', function(response) { 
                         for (var i = 0; i < response.variants.length;i++){
                           var arr_item_options = response.variants[i].options;
                           if(arr_item_options.includes(val)){  
                             for (var j = 0; j < arr_item_options.length;j++){
                               if(!arr_variants.includes(arr_item_options[j])&&(arr_item_options[j] != val)){ 
                                 arr_variants.push(arr_item_options[j]);
                               }
                             }
                           }
                         }                     
                         js_swatch.find(".swatch-element").removeClass('active');
                         for(var i = 0; i < arr_variants.length; i++){
                           var n_item = arr_variants[i];
                           $("[data-value='"+n_item+"']").closest(".swatch").addClass('dp-none');
                           js_swatch.find("[data-value='"+n_item+"']").addClass('active');
                           index++;
                           if(index < response.variants[0].options.length){ 
                             jQuery("[data-option-index='"+index+"']").find("[data-value='"+n_item+"']").addClass('checked');
                             jQuery("[data-option-index='"+index+"']").find("[data-value='"+n_item+"']").find(':radio').attr('checked','checked');
                                option[index] = n_item;
                           }
                         }

                         id_new = get_pid_variant(option); 
                         js_product_selectors.val(id_new).change(); 
                         js_atc_product.val(id_new).change();                   
                    	 sticky_atc_a.text(js_atc_product.find("option:selected").text());
                         js_product_selectors.closest(".js_product_single").find("#js_id_product").val(id_new).change();
						 var text_option_id  = js_product_selectors.find("option[value='"+id_new+"']").text();
                         var arr = text_option_id.split(' - ');
                         var new_price = arr[arr.length-1];                     
                         js_product_price.text(new_price); 
                         sticky_atc_price.text(new_price);
                         
                          $.getJSON('/products/'+handle_product+'.js', function(response) {
                            
                            var variant_img_id = "";
                            for (var i = 0; i < response.variants.length;i++){
                              if(response.variants[i].id == id_new){                          
                                variant_img_id = response.variants[i].featured_image.id;
                                if(!response.variants[i].available){
                              		$("#js-pr-available").hide();
                                  	$("#js-pr-unavailable").css('display','inline-block');
                                    $(".js_add_to_cart_button").hide();
                                    $(".js-compare").hide();
                                    $(".js-quantity").hide();
                                  	$(".js-btn-sold-out").css('display','inline-block');
                                   
                                  	
                                }else{
                                  	$("#js-pr-available").css('display','inline-block');
                                  	$("#js-pr-unavailable").hide();
                                  	$(".js_add_to_cart_button").css('display','inline-block');
                                  	$(".js-compare").css('display','inline-block');
                                    $(".js-quantity").css('display','inline-block');
                                  	$(".js-btn-sold-out").hide();
                                }
                                break;
                              }
                            }                                       
                            if(variant_img_id !=""){    
                              interact_main_product =false;
                              $("#thumb_img_"+variant_img_id).trigger("click");  
                              var data_image = $("#thumb_img_"+variant_img_id).attr("data-image");
                              var data_z_image = $("#thumb_img_"+variant_img_id).attr("data-z-image");
                              theme.ProductGallery.create(data_image,data_z_image);
                            }                             
                          });         
                       })
                   	}
                 }) 
              	 jQuery('.swatch :radio').change(function() {
                   
                    var option = [],
                     	index = 0,
                     	js_product_selectors = jQuery("#js-product-selectors"),
                     	js_product_price = $("#js-product-price"),
                     	js_handle_product = $("#js-handle-product"),
                        js_atc_product = $(".js_sticky_sl"),
                        sticky_atc_a = $(".sticky_atc_a"),
                        sticky_atc_price = $(".sticky_atc_price"),
                    	handle_product  = js_handle_product.val();
                   		
                    $(this).closest('.swatch').find(".swatch-element").removeClass('checked');                    
                    $(this).closest('.swatch-element').addClass('checked');                   
                   
                    $(".swatch-element.checked input").each(function(){
                     option[index] = $(this).attr("value");  
                     index++;
                    });     
                   
                    id_new = get_pid_variant(option);                     
                    js_product_selectors.val(id_new).change();   
                    js_atc_product.val(id_new).change();                   
                    sticky_atc_a.text(js_atc_product.find("option:selected").text());
                    js_product_selectors.closest(".js_product_single").find("#js_id_product").val(id_new).change();
                    
                   
                     var text_option_id  = js_product_selectors.find("option[value='"+id_new+"']").text();
                     var arr = text_option_id.split(' - ');
                     var new_price = arr[arr.length-1];                     
                     js_product_price.text(new_price);                    
                     sticky_atc_price.text(new_price);
                   
                     $.getJSON('/products/'+handle_product+'.js', function(response) {                       
                       var variant_img_id = "";
                       for (var i = 0; i < response.variants.length;i++){
                         if(response.variants[i].id == id_new){                          
                           variant_img_id = response.variants[i].featured_image.id;
                           break;
                         }
                       }
                       //Change main product image and zoom image                       
                       if(variant_img_id !=""){   
                         interact_main_product =false;
                         $("#thumb_img_"+variant_img_id).trigger("click");              
                       }           
                     });         

                  });  
              
            
            },
            check_slide: function(){
              $(".slider-for").on("mouseover",function(){
                interact_main_product = true;              	
              })
              $(".slider-nav").on("mouseover",function(){
                interact_main_product = true;
              })
              $('.slider-for').on('init', function(event, slick){
                $(this).hide();
              });

              $('.slider-for').on('reInit', function(event, slick){
                $(this).hide();
              });
              $('.slider-for').on('beforeChange', function(event, slick, currentSlide, nextSlide){

              });
              $('.slider-for').on('afterChange', function(event, slick, currentSlide){
                event.preventDefault();
                $(this).show();                
                if(interact_main_product==true && $(this).closest('.js_product_single').find("#js-product-selectors").length > 0){
                  var pr_id,
                      img_id,
                      js_handle_product = $("#js-handle-product"), 
                      arr_variants = new Array(),
                      js_product_selectors = $("#js-product-selectors"), 
                      js_product_price = $("#js-product-price"),
                      js_swatch = $('.swatch'),
                      js_atc_product = $(".js_sticky_sl"),
                      sticky_atc_a = $(".sticky_atc_a"),
                      sticky_atc_price = $(".sticky_atc_price"),
                      handle_product  = js_handle_product.val();

                  img_id = $(this).find('.slick-active').data("image-id");
                  var data_image = $("#thumb_img_"+img_id).attr("data-image");
                  var data_z_image = $("#thumb_img_"+img_id).attr("data-z-image");
                  theme.ProductGallery.create(data_image,data_z_image);
                  
                  $.getJSON('/products/'+handle_product+'.js', function(response) {
                    for (var i = 0; i < response.variants.length;i++){
                      if(response.variants[i].featured_image.id == img_id){                          
                        pr_id = response.variants[i].id;
                        arr_variants =  response.variants[i].options;
                        if(!response.variants[i].available){
                          $("#js-pr-available").hide();
                          $("#js-pr-unavailable").css('display','inline-block');
                          $(".js_add_to_cart_button").hide();
                          $(".js-compare").hide();
                          $(".js-quantity").hide();
                          $(".js-btn-sold-out").css('display','inline-block');
                        }else{
                          $("#js-pr-available").css('display','inline-block');
                          $("#js-pr-unavailable").hide();
                          $(".js_add_to_cart_button").css('display','inline-block');
                          $(".js-compare").css('display','inline-block');
                          $(".js-quantity").css('display','inline-block');
                          $(".js-btn-sold-out").hide();
                        }
                        break;
                      }
                    }                  
                    var val = arr_variants[0];
                    for (var i = 0; i < response.variants.length;i++){
                      var arr_item_options = response.variants[i].options;
                      if(arr_item_options.includes(val)){  
                        for (var j = 0; j < arr_item_options.length;j++){
                          if(!arr_variants.includes(arr_item_options[j])&&(arr_item_options[j] != val)){ 
                            arr_variants.push(arr_item_options[j]);
                          }
                        }
                      }
                    } 

                    if(arr_variants.length > 0){
                      var number_variant_style = response.variants[0].options.length;                    
                      js_swatch.find(".swatch-element").removeClass('checked');                            
                      js_swatch.find(':radio').removeAttr('checked');
                      var index = 0;
                      $("[data-option-index='"+index+"']").find(".swatch-element").addClass('active');
                      for(var i = 0; i < arr_variants.length; i++){
                        var n_item = arr_variants[i];                      
                        index++;
                        if(index < number_variant_style) $("[data-option-index='"+index+"']").find(".swatch-element").removeClass('active');
                        js_swatch.find("[data-value='"+n_item+"']").addClass('active');                      
                        $("[data-option-index='"+i+"']").find("[data-value='"+n_item+"']").addClass('checked');
                        $("[data-option-index='"+i+"']").find("[data-value='"+n_item+"']").find(':radio').attr('checked','checked'); 
                      } 
					  id_new = pr_id;
                      js_product_selectors.val(id_new).change();
                      js_atc_product.val(id_new).change();                   
                      sticky_atc_a.text(js_atc_product.find("option:selected").text());
                      js_product_selectors.closest(".js_product_single").find("#js_id_product").val(id_new).change();
                      var text_option_id  = js_product_selectors.find("option[value='"+pr_id+"']").text();
                      var arr = text_option_id.split(' - ');
                      var new_price = arr[arr.length-1];                     
                      js_product_price.text(new_price); 
                      sticky_atc_price.text(new_price);
                    }

                  });
                }
              });            
            },
            quantity: function(){
              jQuery(document).on('click', '.js-quantity .js_minus, .js-quantity .js_plus', function (e) {
                // Get values
                var $qty = $(".js-quantity").find('.js_qty'),
                    currentVal = parseFloat($qty.val()),
                    max = parseFloat($qty.data('max')),
                    min = parseFloat($qty.data('min')),
                    step = $qty.data('step');
                
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
              });
            },
          	ajaxAddItem : function() {              
                  jQuery(document).on('click', '.js_add_to_cart_button', function(e) {
                      e.preventDefault();                      
                      var id= jQuery(this).data('pid'); 
                      if(jQuery("#Quantity").length){
                        var quantity= jQuery("#Quantity").val();
                      }else{
                        var quantity= 1;             
                      }
                      if ($(this).closest(".js_product_single").find("#js_id_product").length > 0){
                        id = $(this).closest(".js_product_single").find("#js_id_product").val();
                      }
                    
                      var arr_items= [];                        
                      arr_items.push({
                            id: id,
                            quantity: quantity
                         });      
                      addItem(arr_items,this);
                  });

              	  jQuery(document).on('click', '.sticky_atc_js', function(e) {                 
                    e.preventDefault();
					  var _this = $(this),
                        vid = parseInt($('.js_sticky_sl').val()),
                        qty = parseInt($('.js_sticky_qty').val()) || 1,
                        arr_items= [];                        
                       arr_items.push({
                          id: vid,
                          quantity: qty
                       });                      

                       addItem(arr_items,this);
                  });

                  /*jQuery(document).on('click', '.add-to-cart-form', function(e) {
                    e.preventDefault();
                    var _this = $(this),
                       frmId = _this.closest('form');
                       addItemFrom(frmId);
                  });

                  jQuery(document).on('click', '.js_add_group', function(e) {
                    e.preventDefault();
                    var _this = $(this),
                       frmId = _this.closest('form');                       
                       addItemFrom(frmId);
                  });*/
              	 jQuery(document).on('click',".js-remove-item",function(event){
                    event.preventDefault();
                    var id = $(this).data('id');
                    $.ajax({
                      url:'/cart/update.js',
                      type: 'POST', 
                      dataType: 'json',
                      data:"updates["+id+"]=0",
                      success: function(data) {
            			//$(".cartCount").text(data.item_count);
                        //$("#item-"+id).remove();
                        ShowCart();
                        $(".js-total-price").text(convert_currency_andy(data.total_price));
                      }
                    });     
                 });
              	 jQuery(document).on('change',"[id^='updates_']",function(event){
                    event.preventDefault();
                    var id = $(this).attr('id');
                    var first_pos = id.indexOf('_')+1;
                    var last_pos  = id.length;
                    var val_id 	=	id.substr(first_pos, last_pos);
                    var quanlity =	$(this).val();

                   $.ajax({
                      url:'/cart/update.js',
                      type: 'POST', 
                      dataType: 'json',
                      data:"updates["+val_id+"]="+quanlity+"", 
                      success: function(data) {
                        $(".js-total-price").html(convert_currency_andy(data.total_price));
                        //$(".cartCount").text(data.item_count);
                        ShowCart();
                      }
                    });
                  });
            },
          	stickyAddToCart : function() {
              var $trigger = $('.details-info .group-button');
              var $stickyBtn = $('.js_sticky_atc_wrapper');

              if ($stickyBtn.length <= 0 || $trigger.length <= 0 || (window_w < 768 && $stickyBtn.hasClass('mobile_false'))) return;

              var summaryOffset = $trigger.offset().top + $trigger.outerHeight(),
                  $selector = $('.js_sticky_atc_wrapper, #nt_backtop'),
                  slpr_wrap = $('.popup_slpr_wrap'),
                  _footer = $('.footer'),
                  off_footer = 0,
                  ck_footer = _footer.length > 0;

              var stickyAddToCartToggle = function () {
                var windowScroll = $(window).scrollTop(),
                    windowHeight = $(window).height(),
                    documentHeight = $(document).height();
                if (ck_footer) {
                  off_footer = _footer.offset().top - _footer.height();
                } else {
                  off_footer = windowScroll;
                }
               
               if (windowScroll + windowHeight == documentHeight || summaryOffset > windowScroll || windowScroll > off_footer ) {
                  $selector.removeClass('sticky_atc_shown');
                  slpr_wrap.removeClass('sticky_atc_shown');
                } else if (summaryOffset < windowScroll && windowScroll + windowHeight != documentHeight) {
                  $selector.addClass('sticky_atc_shown');
                  slpr_wrap.addClass('sticky_atc_shown');
                }
              };

              stickyAddToCartToggle();

              $(window).scroll(stickyAddToCartToggle);

             
              // Quantity.
              $('.js_sticky_atc_wrapper .js_sticky_qty').on('change', function(){
                $('#Quantity .js_qty').val($(this).val())
                //.trigger('change');
              });

              $('#Quantity .js_sticky_qty').on('change', function(){
                $('.js_sticky_atc_wrapper .js_qty').val($(this).val());
              });
            },
          recently_viewed : function (sl) {
            var el = sl || $('#js_recently_wrapper');
            if (el.length == 0 ) return;

            var ls = localStorage.getItem('product_recent'),
                id = (type_name == "product") ? el.data('id') : '19041994',
                get = el.data('get'),
                unpr = el.data('unpr'), 
                limit = el.data('limit');

            if (ls != null) { 
               var arrls = ls.split(','),
               index = arrls.indexOf(id);
               
               if (index > -1) { 
                  arrls = arrls.splice(0,limit+1); 
                  arrls.splice(index, 1); 
               } else {
                  arrls = arrls.splice(0,limit);
               }              

               if(arrls.length == 0) {
                el.slideUp();
                return false;
               }

               var arr_list = arrls.toString(),
                  uri = arr_list.replace(/,/g, ' OR '),
                  res = encodeURI(uri);
                
                  $.ajax({
                    url: get+'?view=recently_viewed&type=product&options[unavailable_products]='+unpr+'&q='+res,
                    dataType: 'html',
                    type: 'GET',
                    success: function(section) {
                      
                     var recentlyMarkup = $(section).html();
                     if (recentlyMarkup.trim() !== '') {
                        //console.log(responsive);
                        el.html(recentlyMarkup);
                        
                       $(".js-recently-viewed-slider").slick({
                         infinite: true,
                         slidesToShow: limit,
                         vertical: false,
                         slidesToScroll: 1
                       })
                     }
                    },
                    error: function() {},
                    complete: function() {}
                  }); 

            } else {
              el.html('');
              var arrls = new Array();
            }

            if ( arrls.indexOf(id) < 0 && id != '19041994' ) {         
               if ( arrls.length > limit){ arrls = arrls.splice(0,limit) }        
               arrls.unshift(id);
               localStorage.setItem('product_recent', arrls.toString());
            }
            
            
          },
          initSlick: function(){
            if(type_name == "product"){ 
                  $(".slider-for").slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    fade: true,
                    lazyLoad: 'ondemand',
                    asNavFor: '.slider-nav'
                  })       
                 
                  $(".slider-nav").slick({
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    asNavFor: '.slider-for',
                    dots: false,
                    centerMode: false,
                    lazyLoad: 'ondemand',
                    focusOnSelect: true,
                    responsive: [
                      {
                        breakpoint: 1200,
                        settings: {
                          slidesToShow: 3,
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
                          slidesToShow: 3,
                          slidesToScroll: 1
                        }
                      },
                      {
                        breakpoint: 767,
                        settings: {
                          arrows: true,  
                          infinite: true,
                          slidesToShow: 2,
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
                  }); 
              
              $(".js-related-product").slick({
                    slidesToShow: 5,
                    slidesToScroll: 1,
                    asNavFor: '.slider-for',
                    dots: false,
                    centerMode: false,
                    lazyLoad: 'ondemand',
                    focusOnSelect: true,
                    responsive: [
                      {
                        breakpoint: 1200,
                        settings: {
                          slidesToShow: 5,
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
                        breakpoint: 650,
                        settings: {
                          arrows: true,  
                          infinite: true,
                          slidesToShow: 2,
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
            //short-code slider
            if($(".blog-post-slider").length > 0){
             $(".blog-post-slider").slick({
               lazyLoad: 'ondemand',
               slidesToShow: 2,
               slidesToScroll: 1,
               infinite: true,              
               responsive: [
                  {
                    breakpoint: 1200,
                    settings: {
                      slidesToShow: 2,
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
                      slidesToShow: 2,
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
            // Blog section slider
            if($(".blog-slider")){
              $(".blog-slider").slick({
               lazyLoad: 'ondemand',
               slidesToShow: 3,
               slidesToScroll: 3,
               infinite: true,               
               responsive: [
                  {
                    breakpoint: 1200,
                    settings: {
                      slidesToShow: 3,
                      slidesToScroll: 3,
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
                      slidesToShow: 3,
                      slidesToScroll: 3
                    }
                  },
                  {
                    breakpoint: 767,
                    settings: {
                      arrows: true,  
                      infinite: true,
                      slidesToShow: 2,
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
            if($(".js_instagram_lookbook").length > 0){
              
              var number = $(".js_instagram_lookbook").data('slide-to-show');              
              $(".js_instagram_lookbook").slick({
               lazyLoad: 'ondemand',
               slidesToShow: number,
               slidesToScroll: 2,
               infinite: true,               
               responsive: [
                  {
                    breakpoint: 1200,
                    settings: {
                      slidesToShow: number,
                      slidesToScroll: 2,
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
                      slidesToShow: number,
                      slidesToScroll: 2
                    }
                  },
                  {
                    breakpoint: 767,
                    settings: {
                      arrows: true,  
                      infinite: true,
                      slidesToShow: 2,
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
           
          },
          back_to_top: function(){
            $(window).scroll(function(){
                if ($(this).scrollTop() > 300) {
                    $('.back-to-top').fadeIn();
                    $('.back-to-top').addClass('show');
                } else {
                    $('.back-to-top').fadeOut();
                    $('.back-to-top').removeClass('show');
                }
            });
            $(document).on('click','.back-to-top',function(){
                $('html, body').animate({scrollTop : 0},800);
                return false;
            });
          },
          
          ajaxFilters : function () {            
            
            if ( $('.js_container_cat').length == 0 || typeof ($.fn.pjax) == 'undefined' ) return;
            var area_filter_size = '.widget_filter_size',
                area_filter_color = '.widget_filter_color', 
                area_filter_brand = '.widget-brand', 
                area_filter_sortby = '.js_cat_sortby', 
                area_filter_container = '.js_container_cat ';

            
            jQuery(document).pjax(ajaxSelector, '.js_container_cat', {
              fragment: '.js_container_cat',
              timeout: 650,
              scrollTo: false
            });
            
            jQuery(document).on('pjax:clicked', function(options) { 
              if ( $(area_filter_size).length != 0 ) {
                $.pjax.reload(area_filter_size, {		    	 
                   fragment: area_filter_size,
                   timeout: 100,
                   scrollTo: false,
                   async:false
                })
              }
              if ( $(area_filter_color).length != 0 ) {
                $.pjax.reload(area_filter_color, {		    	 
                   fragment: area_filter_color,
                   timeout: 100,
                   async:false                   
                })
              }
              if ( $(area_filter_container).length != 0 ) {
                $.pjax.reload(area_filter_container, {		    	 
                   fragment: area_filter_container,
                   timeout: 100                  
                })
              }
              /*if ( $(area_filter_brand).length != 0 ) {
                $.pjax.reload(area_filter_brand, {		    	 
                   fragment: area_filter_brand,
                   timeout: 2000,
                   scrollTo: false,
                   async:false
                })
              }
              if ( $(area_filter_sortby).length != 0 ) {
                $.pjax.reload(area_filter_sortby, {		    	 
                   fragment: area_filter_sortby,
                   timeout: 2000,
                   scrollTo: false,
                   async:false
                })
              }
              */
            });
            jQuery(document).on('pjax:beforeSend', function(xhr,options) { });
            jQuery(document).on('pjax:timeout', function(e) {
              // Prevent default timeout redirection behavior
              e.preventDefault()
            });

            jQuery(document).on('pjax:error', function (xhr, textStatus, error, options) {           
               //console.log('pjax error ' + error);               
            });

            jQuery(document).on('pjax:start', function (xhr, textStatus, options) {			  
              jQuery("body").addClass('ajax_loading');
              //jQuery(".back-to-top").trigger("click");
              jQuery.magnificPopup.close();                         
            });

            jQuery(document).on('pjax:beforeReplace', function (contents, options) { });

            jQuery(document).on('pjax:complete', function (xhr, textStatus, options) { });

            jQuery(document).on('pjax:end', function (xhr, textStatus, options) {           
              var holder = jQuery('.js_container_cat .js_products_holder'),
                  fragment = options.fragment;              
              if ( holder.hasClass('nt_packery') ) {
                //cmsheroShopify.refresh_packery(holder);
              } else if ( holder.hasClass('js_isotope') ) {
                cmsheroShopify.refresh_masonry(holder);               
              }                      
              jQuery("body").removeClass('ajax_loading');

            })
          },
          refresh_masonry: function (el) {            
             var option = el.attr("data-isotope") || '{}';
             el.isotope(JSON.parse(option));
          },
          pin_lookbook : function () {
            if ( window_w < 1024 ) return;

            jQuery("body").on('click', '.pin_tt_js', function (e) {
               e.preventDefault();
               e.stopPropagation();

                 var ck = 0,
                     cl = 'pin__opened',
                     _this = $( this ).parent('.pin__type');
                 if (_this.hasClass('pin__opened')) { ck = 1}
                 $('.pin__type.pin__opened').removeClass('pin__opened');
                 $('.pin__slider.pin_slider_opened').removeClass('pin_slider_opened');              
                 if ( ck ) return;

                 var sp_section = $( this ).closest('.shopify-section');
                 _this.addClass('pin__opened');
                 sp_section.find('.pin__slider').addClass('pin_slider_opened');

                 if ( _this.hasClass('has_calc_pos') ) return;

                 var pos = _this.offset(),
                     pin_pp = _this.find('.pin__popup'),
                     pin_parent = _this.find('.pin_lazy_js');

                  if (pin_parent.length == 0) {pin_parent = pin_pp;}
                  if (pin_parent.hasClass('pin__popup--left')) {
                     var w_popup = pin_pp.width() + 20;
                     if ( pos.left < w_popup ) {                      
                        var mrRight = w_popup - pos.left + 10;
                        pin_pp.css("margin-right", '-' + mrRight + 'px');
                     }
                  } else if (pin_parent.hasClass('pin__popup--right')) {
                     var w_popup = pin_pp.width() + 20,
                         posRight = $(window).width() - pos.left - _this.width();
                     if ( posRight < w_popup ) {                        
                        var mrLeft = w_popup - posRight + 10;
                        pin_pp.css("margin-left", '-' + mrLeft + 'px');
                     }
                  }

            });
            jQuery("body").on('click', function (e) {
              var target = $(e.target);
              if (target.closest('.pin__type').length > 0 || target.closest('.mfp-wrap').length > 0) return;
              $('.pin__type.pin__opened').removeClass('pin__opened');
              $('.pin__slider.pin_slider_opened').removeClass('pin_slider_opened');
            });

          },
          sc_lazy : function () {
            var $inc_lz = $('.inc_lz');

            if ( $inc_lz.length == 0 && $('.inl_cnt_js').length > 0 ) return;
           
            // collection
            $('.inc_pr_laz').each(function() {
                $(this).addClass('lazyload').one('lazyincluded', function (e) {
                  if (e.detail.content) {
                       var el = $(e.target).find('.js_carousel');
                       if ( el.length == 0 ) return;
                       //cmsheroShopify.refresh_flickity(el);
                   } else {
                         $(e.target).hide().remove();
                   }

                });
            });

            // lookbook
             $('.inc_lb_laz, .inc_cat_laz, .inc_gl_laz, .inc_ins_laz').each(function() {
                 $(this).addClass('lazyload').one('lazyincluded', function (e) {
                       if (e.detail.content) {
                           //cmsheroShopify.popupMFP();
                           var _target = $(e.target),
                               el = _target.find('.js_carousel'),
                               el2 = _target.find('.js_packery');

                           if ( el.length > 0 ) {
                              //cmsheroShopify.refresh_flickity(el);
                           } else if ( el2.length > 0 ) {
                              //cmsheroShopify.refresh_packery(el2);
                           }
                       } else {
                             $(e.target).hide().remove();
                       }
                 });
             })
          },
          init_popup : function () {
              jQuery("body").on('click', '[data-opennt]', function (e) {             
              var $this = $(e.currentTarget),
              html = $("html"),
              datas = $this.data(),
              id = datas.opennt,
              color = datas.color,
              bg = datas.bg,
              position = datas.pos,
              ani = datas.ani || 'has_ntcanvas',
              remove = datas.remove,
              cl = datas.class,
              close = datas.close || false,
              focuslast = datas.focuslast || false,
              focus = $this.attr("data-focus"),
              YOffset = window.pageYOffset,
              height = window.height - $('#shopify-section-header_banner').outerHeight() - $('.ntheader_wrapper').outerHeight();              

              var nt_scroll = function () {
                    if( !YOffset) return; 
                    $('html, body').scrollTop(YOffset);
              }
              $this.addClass("current_clicked");
               $.magnificPopup.open({
                 items: {
                   src: id,
                   type: "inline",
                   tLoading: '<div class="loading-spin dark"></div>'
                 },
                 tClose: "Close (Esc)",
                 removalDelay: 300,
                 closeBtnInside: close,
                 focus: focus,
                 autoFocusLast: focuslast,
                 callbacks: {
                   beforeOpen: function() {
                     this.st.mainClass = ani + " " + color + " " + ani+"_" + position;                     
                   },
                   open: function() {                     
                     html.addClass(ani); 
                     html.addClass(ani+"_" + position); 
                     cl && $(".mfp-content").addClass(cl); 
                     bg && $(".mfp-bg").addClass(bg); 
                   
                     jQuery("body").on('click', '.close_pp', function(e) {
                       e.preventDefault();
                       $.magnificPopup.close();
                     });
                     nt_scroll();
                   },
                   beforeClose: function() {
                     html.removeClass(ani);  
                   },
                   afterClose: function() {
                     html.removeClass(ani+"_" + position);                      
                     $(".current_clicked").removeClass("current_clicked"); 
                     remove && $(id).removeClass("mfp-hide");
                   }
                 }
               });
               e.preventDefault()
             })
          },
          quickView: function(){
            function kt_get_scrollbar_width() {
              var $inner = jQuery('<div style="width: 100%; height:200px;">test</div>'),
                  $outer = jQuery('<div style="width:200px;height:150px; position: absolute; top: 0; left: 0; visibility: hidden; overflow:hidden;"></div>').append($inner),
                  inner = $inner[0],
                  outer = $outer[0];
              jQuery('body').append(outer);
              var width1 = parseFloat(inner.offsetWidth);
              $outer.css('overflow', 'scroll');
              var width2 = parseFloat(outer.clientWidth);
              $outer.remove();
              return (width1 - width2);
            }
             jQuery(document).on('click','.quick-view, .js_quick_view' , function(event) {
                event.preventDefault();
                var url = $(this).attr('href');
                jQuery("#quick-view-modal").show();
                jQuery("#quick-view-modal").load(url + " #product-single", function() {
                  var window_size = parseFloat(jQuery('body').innerWidth());
                  window_size += kt_get_scrollbar_width();
                  if(window_size > 992){                  
                      jQuery.magnificPopup.open({
                        items: {
                          src: '#quick-view-modal',
                          type: 'inline'
                        }
                      });
                    $("#quick-view-modal .slider-for").slick({
                      slidesToShow: 1,
                      slidesToScroll: 1,
                      arrows: false,
                      fade: true,
                      lazyLoad: 'ondemand',
                      asNavFor: '.slider-nav'
                    })       

                    $("#quick-view-modal .slider-nav").slick({
                      slidesToShow: 3,
                      slidesToScroll: 1,
                      asNavFor: '.slider-for',
                      dots: false,
                      centerMode: false,
                      lazyLoad: 'ondemand',
                      focusOnSelect: true
                    }); 
                    
                    cmsheroShopify.check_slide();
                    
                    $("#quick-view-modal").find("[data-js-gallery]").click(function () {                	
                      var fotorama = $('[data-fotorama]')
                      .fotorama({allowfullscreen: true})
                      .data('fotorama');

                      fotorama.requestFullScreen();
                  	});  
				   
                    $("#quick-view-modal").find('[data-page-open-popup]').magnificPopup({
                      type:'inline',
                      midClick: true
                    });
                  }
                  
                });
            });
          },
          Sortby : function () {     
             if ($('.js_cat_sortby').length == 0) return;

              jQuery("body").on('click', 'a.js_sortby_pick', function(e) {
                e.preventDefault();
                e.stopPropagation();

                var $this = $(this),
                    pr = $this.closest('.js_cat_sortby');
                	

                 if ($(pr).hasClass('opended')) {
                    $(pr).removeClass('opended');
                 } else {                    
                    $(pr).addClass('opended');
                 }
              });
			  
              jQuery("body").click(function (e) {                
                 if ($(e.target).hasClass('js_sortby_pick')) return;
                 $('.js_cat_sortby.opended').removeClass('opended');
              });
              jQuery("body").on("click",".js_ajaxsortby a", function(e){
				var val = $(this).text();
                $(".js_cat_sortby .js_sr_txt").text(val);
              })
		  },
          Numberby : function () {     
             if ($('.js_num_pagination').length == 0) return;

              jQuery("body").on('click', 'a.js_number_pick', function(e) {
                e.preventDefault();
                e.stopPropagation();

                var $this = $(this),
                    pr = $this.closest('.js_num_pagination');
                	

                 if ($(pr).hasClass('opended')) {
                    $(pr).removeClass('opended');
                 } else {                    
                    $(pr).addClass('opended');
                 }
              });
			  
              jQuery("body").click(function (e) {                
                 if ($(e.target).hasClass('js_number_pick')) return;
                 $('.js_num_pagination.opended').removeClass('opended');
              });
              jQuery("body").on("click",".js_ajaxnumby a", function(e){
				var val = $(this).text();
                $(".js_num_pagination .js_sr_txt").text(val);
              })
		  },
          changeTagFilter: function(){
          	if($(".js_filter").length == 0) return;
            
            jQuery("body").on('click', '.js_filter li a', function(e) {
                //e.preventDefault();
                //e.stopPropagation();
                var $this = $(this),
                    pr = $this.closest('li');
                	
				 $(pr).find('a').addClass('active');
                 $this.removeClass('active');
                 if ($(pr).hasClass('current')) {
                    $(pr).removeClass('current');
                 } else {                    
                    $(pr).addClass('current');
                 }
              });
            
          },
          changeView: function(){           	 
            var _current_col = $(".js_products_holder .product-item").data('col');
            jQuery(document).on('click', '.js_cat_view:not(.active)', function (e) {
               e.preventDefault();
               var _this = $( this ),
                  _col  = _this.data( 'col' ),                  
                  _parent = _this.closest('div'),
                  _products = $('.js_categories_content .product-item'),
                  holder = $('.js_categories_content .js_container_cat');
            
			    
               _parent.find('a').removeClass('active');
               _this.addClass('active');

              if(_col > 0){                
                _products.removeClass('col-lg-'+_current_col+' col-md-'+_current_col).addClass('col-lg-'+_col+' col-md-'+_col);
                holder.removeClass("list-style").addClass('grid-style');
                _products.attr('data-col',_col);
                _current_col = _col;
              }else{
                holder.removeClass("grid-style").addClass('list-style');
              }
               if (holder.hasClass('js_isotope')) {
                  holder.isotope('layout');
               }
            })
          },
          compare_product: function(){
         
          	/* Compare Product*/
             var storage = $.localStorage;
             var compare = {};
     		 var total_compare =  4 ;
             if (storage.isSet('compare')) {
               compare = storage.get('compare');
             } else {
               storage.set('compare', {});
             }
            
             /* ---------------------------------------------
             Slipt Text
        	 --------------------------------------------- */
              function readMore(string, maxWords) {       
                var strippedString = $("<p>" + string + "</p>").text().trim();      
                var array = strippedString.split(" ");
                var string = array.splice(0, maxWords).join(" ");

                if(array.length > maxWords) {
                  string += "...";
                }

                return string ;
              }
             function compare_to_table(data) {
               if (Object.keys(data).length <= 0) {
                 return '';
               }
               var html = '';
               var i = 0;

               var end_check = (Object.keys(data).length - 1);
               var width_tr = (end_check > 0) ? (90 / (Object.keys(data).length)) : 90;
               var data_html = '';
               for (i = 0; i <= end_check; i++) {
                 var el = data[i];
                 var is_sale = false;
                 if (el.compare_at_price > el.price) {
                   is_sale = true
                 }
                 data_html = data_html + '<th class=" ' + el.handle + '"><button type="button" class="close remove-compare center-block" aria-label="Close" data-handle="' + el.handle + '"><span aria-hidden="true" class="remove-compare-x" title="Delete" style="font-size: 13px;"></span></button></th>';
                 //Start title 
                 if (i == 0) {
                   html = html + '<tr >';
                   html = html + '<th width="10%" > Title </th>';
                 }
                 html = html + '<td width="' + width_tr + '%"  class="' + el.handle + '"> ' + el.title + '  </td>';
                 if (i >= end_check) {
                   html = html + '</tr>';
                 }
                 // End Title 
               }
               for (i = 0; i <= end_check; i++) {
                 var el = data[i];
                 var is_sale = false;
                 if (el.compare_at_price > el.price) {
                   is_sale = true
                 }
                 if (i == 0) {
                   html = html + '<tr>';
                   html = html + '<th width="10%" > Image </th>';

                 }
                 // start product image
                 html = html + '<td width="' + width_tr + '%" class="' + el.handle + '"> <div style="width:150px; height:auto; margin:0 auto;"><img style="float:left;" src="' + el.featured_image + '"  width="150"/> ' + '<div class="product-price" style="width: 150px; margin: 0;text-align:center;  clear:left; float: left;" > ';
                 if (is_sale) {
                   html = html + '<strong style="display:block;">On Sale</strong>' + '<span class="price-sale"><span class="money" data-currency-'+Currency.currentCurrency+'="'+convert_currency_andy(el.price,'11')+'">'+convert_currency_andy(el.price,'11')+'</span></span>';
                 } else {
                   html = html + '<span class="price-sale"><span class="money" data-currency-'+Currency.currentCurrency+'="'+convert_currency_andy(el.price,'11')+'">'+convert_currency_andy(el.price,'11')+'</span></span>';
                 }

                 html = html + '</div>';
                 //convert_currency_andy(el.price,'3');
                 if (el.variants.length > 1) {
                   html = html + '<div style="width: 150px; margin: 0;text-align:center; clear:left; float: left;"><a style="cursor:pointer; padding: 15px;" onclick="location.href=\'/products/' + el.handle + '\'">Select Options</a></div>';
                 } else {
                   html = html + '<div style="width: 150px; margin: 0;text-align:center; clear:left; float: left;"><a style="cursor:pointer; padding: 15px;" href="#" title="ADD TO CART" data-pid="' + el.variants[0].id + '" class="boutique__add-to-cart button add_to_cart_button ">ADD TO CART</a></div>';
                 }
                 html = html + ' </div></td>';

                 if (i >= end_check) {
                   html = html + '</tr>';
                 }
                 // End product image
               }
               for (i = 0; i <= end_check; i++) {
                 var el = data[i];
                 var is_sale = false;
                 if (el.compare_at_price > el.price) {
                   is_sale = true
                 }
                 if (i == 0) {
                   html = html + '<tr>';
                   html = html + '<th width="10%" > Description </th>';

                 }
                 html = html + '<td width="' + width_tr + '%" class="' + el.handle + ' "> <p class="description-compare" style="text-align:justify;"> '+readMore(el.description,25)+'... </p> </td>';
                 if (i >= end_check) {
                   html = html + '<tr>';
                 }

               }
               for (i = 0; i <= end_check; i++) {
                 var el = data[i];
                 var is_sale = false;
                 if (el.compare_at_price > el.price) {
                   is_sale = true
                 }
                 if (i == 0) {
                   html = html + '<tr>';
                   html = html + '<th width="10%" > Available </th>';

                 }

                 var avai_stock = (el.available) ? 'Available In stock' : 'Unavailable In stock';
                 html = html + '<td   width="' + width_tr + '%" class="available-stock ' + el.handle + '"> <p> ' + avai_stock + ' </p> </td>';
                 if (i >= end_check) {
                   html = html + '<tr>';
                 }

               }
               $(".th-compare").html('<th></th>'+data_html);
               $("#table-compare").html(html);
             }

             function countProperties(obj) {
               var count = 0;

               for(var prop in obj) {
                 if(obj.hasOwnProperty(prop))
                   ++count;
               }

               return count;
             } 
             if (!$.isEmptyObject(compare)) {
               //compare = {};
               var list_id = '';
               var json_compare = [];
               var check_end = 0;
               var compare_size = (Object.keys(compare).length - 1);
               $.each(compare, function(index, el) {
                 $("[data-pid='"+el+"']").addClass('added');
                 var json_url = "/products/" + el + ".js";
                 if ($.trim(el) != "") {
                   jQuery.getJSON(json_url, function(product) {
                     json_compare[check_end] = product;
                     if (check_end >= compare_size) {
                       $("#compare-sidebar .no-compare").hide();
                       compare_to_table(json_compare);
                     }
                     check_end += 1;
                   });

                 }

               });
               $(".compare_count").text("0");  
               $(".compare_count").text(countProperties(compare)); 
               $(".compare_show_count").text(countProperties(compare)); 
               $("#compare_value").val(countProperties(compare));
             } else {
               compare = {};
               $(".error-compare").show();
             }

             /* ---------------------------------------------
                 Compare Modal
            --------------------------------------------- */        
             function modal_compare(){
               if (!$.isEmptyObject(compare)) {
                
                 var list_id = '';
                 var json_compare = [];
                 var check_end = 0;
                 var compare_size = (Object.keys(compare).length - 1);
                 $.each(compare, function(index, el) {
                   var json_url = "/products/" + el + ".js";
                   if ($.trim(el) != "") {
                     jQuery.getJSON(json_url, function(product) {
                       json_compare[check_end] = product;
                       if (check_end >= compare_size) {
                         compare_to_table(json_compare);
                       }
                       check_end += 1;
                     });

                   }

                 });
                 $("#moda-compare").modal('show');
               }

             }
             /* ---------------------------------------------
                 Compare action
            --------------------------------------------- */     
             $(document).on('click','.show_compare', function(event) {
               if (!$.isEmptyObject(compare)) {
                 modal_compare(compare);
               } else {
                 compare = {};
                 modal_compare(compare);
               }

             })
             $(document).on('click','.js-compare', function(event) {

               event.preventDefault();
               $("#loading").show();
               /* Act on the event */
               var $this = $(this);
               var pid = $(this).data('pid');

               compare = storage.get('compare');	
               //compare = {};
               if ($.isEmptyObject(compare)) {
                 compare = {};
               }
               var check_compare = true;
               if (Object.keys(compare).length >= total_compare) {
                 swal({
                   title: "info",
                   text: "Product Added over 4 product !. Do you want to compare 4 added product ?",
                   type: "warning",
                   showCancelButton: true,
                   confirmButtonColor: "#4cae4c",
                   confirmButtonText: "Yes,I want view it!",
                   timer: 3000,
                   cancelButtonText: "Continue",
                   closeOnConfirm: true
                 },
                      function() {

                   modal_compare(compare);

                 });
               } else {
                 for (var i = 1; i <= total_compare; i++) {
                   if (compare['p' + i] == "" || compare['p' + i] == undefined) {
                     compare['p' + i] = pid;
                     break;
                   } else if (compare['p' + i] == pid) {
                     $this.addClass('added');
                     check_compare = false;
                     modal_compare(compare);
                     break;
                   }
                 }


                 if (check_compare) {
                   storage.set('compare', compare);
                   modal_compare(compare);
                   $this.addClass('add-success');
                   $("[data-pid='"+pid+"']").addClass('added');

                   var count = parseInt($("#compare_value").val());   
                   $(".compare_count").text("");          
                   count++;          
                   $(".compare_count").text(count);  
                   $("#compare_value").val(count);
                 }
               }
               $("#loading").hide(500);
             });

             /* ---------------------------------------------
                 Remove compare
            --------------------------------------------- */  
             $(document).on('click', '.remove-compare', function(event) {
               event.preventDefault();
               /* Act on the event */

               var id = $(this).data('handle');
               $("." + id).fadeOut(600).remove();
               $("[data-pid='"+id+"']").removeClass('added add-success');
               $.each(compare, function(index, el) {
                 if (el == id) {
                   compare[index] = "";
                   delete compare[index];
                 }
               });
               storage.set('compare', compare);
               var count = parseInt($("#compare_value").val());  
               count--;
               $(".compare_count").text(count); 
               $(".compare_show_count").text(count);
               $("#compare_value").val(count);

             });
             /** End compare */

             /* ---------------------------------------------
                 Click compare setting
            --------------------------------------------- */  
             $(document).on('click', '.compare_setting', function(event) {
               event.preventDefault();
               if (!$.isEmptyObject(compare)) {
                 modal_compare(compare);
               } else {
                 compare = {};
                 modal_compare(compare);
               }
               $(".close-account-control").trigger("click");
             });
             /** End compare */

          },
          countdownProduct: function(){
			if($('.kt-countdown').length >0){
                var labels = ['Years', 'Months', 'Weeks', 'Days', 'Hrs', 'Mins', 'Secs'];
                var layout = '<span class="box-count day"><span class="number">{dnn}</span> <span class="text">Days</span></span><span class="dot">:</span><span class="box-count hrs"><span class="number">{hnn}</span> <span class="text">Hrs</span></span><span class="dot">:</span><span class="box-count min"><span class="number">{mnn}</span> <span class="text">Mins</span></span><span class="dot">:</span><span class="box-count secs"><span class="number">{snn}</span> <span class="text">Secs</span></span>';
                $('.kt-countdown').each(function() {
                    var austDay = new Date($(this).data('y'),$(this).data('m') - 1,$(this).data('d'),$(this).data('h'),$(this).data('i'),$(this).data('s'));
                    $(this).countdown({
                        until: austDay,
                        labels: labels, 
                        layout: layout
                    });
                });
              }

          },
          InitPopupVideo : function () {
            if ($('[data_js_mfp_video]').length == 0) return;

            $('[data_js_mfp_video]').magnificPopup({
               disableOn: 0,
               type: 'iframe',
               tClose: 'Close',
               iframe: {
                  markup: '<div class="mfp-iframe-scaler pr">'+
                        '<div class="mfp-close"></div>'+
                        '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
                      '</div>', // HTML markup of popup, `mfp-close` will be replaced by the close button

                  patterns: {
                      youtube: {
                        index: 'youtube.com/', // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).
                        id: 'v=',
                        src: '//www.youtube.com/embed/%id%?autoplay=1' // URL that will be set as a source for iframe.
                      },
                      vimeo: {
                        index: 'vimeo.com/',
                        id: '/',
                        src: '//player.vimeo.com/video/%id%?autoplay=1'
                      }
                  },
                  srcAction: 'iframe_src', // Templating object key. First part defines CSS selector, second attribute. "iframe_src" means: find "iframe" and set attribute "src".
               }
            });
          },
          tab_heading :  function () {

            if ( $('.sp-tabs .tab-heading').length == 0 ) return;

            $('.sp-tabs .tab-heading').click(function (e) {
               e.preventDefault();

               var _this = $(this),
                  parent = _this.closest('.sp-tab'),
                  parent_top = _this.closest('.sp-tabs'),
                  el = _this.closest('.nt_section'),
                  time = 300,
                  time2 = time+50;

                  if ( el.length == 0) {
                    el = _this.closest('.shopify-section')
                  }      
               if (parent.hasClass('active')) {
                  parent.removeClass('active');
                  parent.find('.sp-tab-content').stop(true, true).slideUp(time);
               } else {
                  parent_top.find('.sp-tab').removeClass('active');
                  parent.addClass('active');
                  parent_top.find('.sp-tab-content').stop(true, true).slideUp(time);
                  parent.find('.sp-tab-content').stop(true, true).slideDown(time);

               }
            });
          },
          PromotionPopup : function () {
            var pp_version = 1;
           // if ($('[data-js-lazy-popup]').length == 0 || window_w < 1025 || $.cookie('core_theme_' + pp_version) == 'shown') return;

              var popup = $('[data-js-lazy-popup]');
              var showPopup = function () {
                var stt = $('[data-js-lazy-popup]').data('stt');
                $.magnificPopup.open({
                  items: {
                    src: '.type_promotion_popup .js_popup_prpr_wrap'
                  },
                  type: 'inline',
                  removalDelay: 500, //delay removal by X to allow out-animation
                  tClose: "Close",
                  callbacks: {
                    beforeOpen: function () {
                      this.st.mainClass ='mfp-move-horizontal prpr_pp_wrapper';
                    },
                    open:function () {   
                      body.trigger('refresh_currency');
                      $(document).off('mouseleave.registerexit');
                     
                    },
                    close:function () {
                        $.cookie('core_theme_' + pp_version, 'shown', { expires: stt.day_next, path: '/' });
                    }
                   
                  }
                });
              };
          },
          PagePopup: function(){          
            $('[data-page-open-popup]').magnificPopup({
              type:'inline',
              midClick: true
            });
          },
         
          fotorama:function(){
            $("[data-js-gallery]").click(function () {                	
                var fotorama = $('[data-fotorama]')
                .fotorama({allowfullscreen: true})
                .data('fotorama');

              	fotorama.requestFullScreen();
            });  
            $('[data-fotorama]').on('click', function (e, fotorama) {
                if ($(e.target).hasClass("fotorama__stage__frame")) {
                    $('[data-fotorama]').data('fotorama').cancelFullScreen();
                }
            });
          },
          checkEmail: function(){
            var initialsubj="Hay buddy, take a look at this"
            var initialmsg="Hi:\n You may want to check out this site: "+window.location
            var good;
            function checkEmailAddress(field) {

              var goodEmail = field.value.match(/\b(^(\S+@).+((\.com)|(\.net)|(\.edu)|(\.mil)|(\.gov)|(\.org)|(\.info)|(\.sex)|(\.biz)|(\.aero)|(\.coop)|(\.museum)|(\.name)|(\.pro)|(\..{2,2}))$)\b/gi);
              if (goodEmail) {
                good = true;
              }
              else {
                alert('Please enter a valid address.');
                field.focus();
                field.select();
                good = false;
              }
            }
            var u = window.location;
            function mailThisUrl() {
              good = false
              checkEmailAddress(document.eMailer.email);
              if (good) {
                window.location = "mailto:"+document.eMailer.email.value+"?subject="+initialsubj+"&body="+initialmsg
              }
            }   
          }
     	}
   }());   
})( jQuery );
$(document).ready(function() {
   cmsheroShopify.init(); 
   cmsheroShopify.clone_main_menu();
   cmsheroShopify.sidePopup();
   cmsheroShopify.searchAjax();
   cmsheroShopify.ajaxSwatch();
   cmsheroShopify.ajaxAddItem();
   cmsheroShopify.stickyAddToCart(); 
   cmsheroShopify.initSlick();
   cmsheroShopify.init_popup();
   cmsheroShopify.check_slide();
   cmsheroShopify.ajaxFilters();   
   cmsheroShopify.sc_lazy();
   cmsheroShopify.pin_lookbook();
   cmsheroShopify.back_to_top();
   cmsheroShopify.quickView();
   cmsheroShopify.Sortby();
   cmsheroShopify.quantity();
   cmsheroShopify.Numberby();
   cmsheroShopify.changeTagFilter();
   cmsheroShopify.changeView(); 
   cmsheroShopify.compare_product();
   cmsheroShopify.countdownProduct();
   cmsheroShopify.InitPopupVideo();
   cmsheroShopify.PromotionPopup();
   cmsheroShopify.tab_heading();
   cmsheroShopify.PagePopup();   
   cmsheroShopify.fotorama();
   var pg = new ProductGallery();   
   var t = new ProductOptions();
   var l = new Loader();
   var prc = new ProductCurrency();
   var pin = new ProductImagesNavigation();
   var pih = new ProductImagesHover();
   var g = new Global();
   var v = new ProductVisitors();
   var pct = new ProductTextCountdown();
   var sl = new StoreLists();
   $(".swatch .swatch-element").first().trigger("click");
    
})