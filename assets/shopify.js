if(Shopify && typeof Shopify === 'object') {
    Shopify.formatMoney = function (e, t) {
        function o(e, t) {
            return "undefined" == typeof e ? t : e;
        }
        function i(e, t, i, n) {
            if (((t = o(t, 2)), (i = o(i, ",")), (n = o(n, ".")), isNaN(e) || null == e)) return 0;
            e = (e / 100).toFixed(t);
            var s = e.split("."),
                r = s[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + i),
                a = s[1] ? n + s[1] : "";
            return r + a;
        }
        "string" == typeof e && (e = e.replace(".", ""));
        var n = "",
            s = /\{\{\s*(\w+)\s*\}\}/,
            r = t || this.money_format;
        switch (r.match(s)[1]) {
            case "amount":
                n = i(e, 2);
                break;
            case "amount_no_decimals":
                n = i(e, 0);
                break;
            case "amount_with_comma_separator":
                n = i(e, 2, ".", ",");
                break;
            case "amount_no_decimals_with_comma_separator":
                n = i(e, 0, ".", ",");
        }
        return r.replace(s, n);
    };
    Shopify.resizeImage = function (e, t) {
        try {
            if ("original" == t) return e;
            var o = e.match(/(.*\/[\w\-\_\.]+)\.(\w{2,4})/);
            return o[1] + "_" + t + "." + o[2];
        } catch (t) {
            return e;
        }
    };                                           
    Shopify.addItemObj = function (obj, n, onerror) {
        var r = {
            type: "POST",
            url: "/cart/add.js",
            data: $.extend({
                quantity: 1
            }, obj),
            dataType: "json",
            success: function (e) {
                "function" == typeof n ? n(e) : Shopify.onItemAdded(e);
            },
            error: function (e, t) {
                Shopify.onError(e, t);

                if(onerror) {
                    onerror();
                }
            }
        };

        jQuery.ajax(r);
    };
    Shopify.changeItemObj = function (obj, n) {
        var r = {
            type: "POST",
            url: "/cart/change.js",
            data: $.extend({
                quantity: 1
            }, obj),
            dataType: "json",
            success: function (e) {
                "function" == typeof n ? n(e) : Shopify.onCartUpdate(e);
            },
            error: function (e, t) {
                Shopify.onError(e, t);
            }
        };

        jQuery.ajax(r);
    };
    Shopify.onItemAdded = function (e) {
        theme.Popups.cartItemAdded(e.title);
    };
    Shopify.addValueToString = function(str, obj) {
        $.each(obj, function(i) {
          var key = '{{ ' + i + ' }}';          
          str = str.replace(key, this);
        });

        return str;
    };
    Shopify.handleize = function (str) {
        return str.replace(/[-+!"#$€₹%&'* ,./:;<=>?@[\\\]_`{|}~()°^]+/g, "");
    };
    Shopify.handleizeArray = function (arr) {
        var newArr = [],
            i = 0;

        for(; i < arr.length; i++) {
            newArr[i] = Shopify.handleize(arr[i]);
        }

        return newArr;
    };
}