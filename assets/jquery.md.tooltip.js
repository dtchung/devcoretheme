var Tooltip = function() {

    function Tooltip() {
        this.params = {
            size: 'small',
            arrow: true,
            animation: 'fade',
            inertia: false,
            duration: [200, 0],
            delay: 0,
            theme: 'cms'
        };

        this.load();
    };

    Tooltip.prototype = $.extend({}, Tooltip.prototype, {
        load: function () {
            this.params = $.extend(this.params, {
                animation: 'scale',
                inertia: false,               
                touch: false
            });

            this.init();
        },
        init: function (obj) {
            this.params = $.extend(this.params, {
                duration: [275, 250]
            });

            if(obj) {
                this.params = $.extend(this.params, obj); 
            }

            this.api = tippy('[data-js-tooltip]', this.params);
        },
        reinit: function (obj) {
            this.destroy();
            this.init(obj);
        },
        destroy: function () {
            if(this.api) {
                this.api.destroyAll();
                this.api = null;
            }
        }
    });

    theme.Tooltip = new Tooltip;
};

$(function() {
    var tt = new Tooltip();
});