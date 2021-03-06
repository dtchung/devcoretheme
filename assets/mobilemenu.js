jQuery(document).ready(function(a) {
    function c() {
        if (!a(".kt-clone-wrap").length) {
            a(".header").prepend('<div class="kt-clone-wrap"><div class="kt-panels-actions-wrap"><a class="kt-close-btn kt-close-panels" href="#">x</a></div><div class="kt-panels"></div></div>')
        }
        var e = 0;
        var f = Array();
        a(".clone-main-menu").each(function() {
            var g = a(this);
            var l = g;
            var i = l.attr("id");
            var h = "kt-clone-" + i;
            if (!a("#" + h).length) {
                var j = g.clone(true);
                j.find(".menu-item").addClass("clone-menu-item");
                j.find("[id]").each(function() {
                    j.find('.vc_tta-panel-heading a[href="#' + a(this).attr("id") + '"]').attr("href", "#" + b(a(this).attr("id"), "kt-clone-"));
                    a(this).attr("id", b(a(this).attr("id"), "kt-clone-"))
                });
                j.find(".kt-menu").addClass("kt-menu-clone");
                if (!a(".kt-clone-wrap .kt-panels #kt-panel-" + i).length) {
                    a(".kt-clone-wrap .kt-panels").append('<div id="kt-panel-' + i + '" class="kt-panel kt-main-panel"><ul class="depth-01"></ul></div>')
                }
                var k = a(".kt-clone-wrap .kt-panels #kt-panel-" + i + " ul");
                k.html(j.html());
                d(k, e)
            }
        })
    }
    c();

    function d(e, f) {
        if (e.find(".menu-item-has-children").length) {
            e.find(".menu-item-has-children").each(function() {
                var i = a(this);
                d(i, f);
                var g = "kt-panel-" + f;
                while (a("#" + g).length) {
                    f++;
                    g = "kt-panel-" + f
                }
                i.prepend('<a class="kt-next-panel" href="#' + g + '" data-target="#' + g + '"></a>');
                var h = a("<div>").append(i.find("> .submenu").clone()).html();
                i.find("> .submenu").remove();
                a(".kt-clone-wrap .kt-panels").append('<div id="' + g + '" class="kt-panel kt-sub-panel kt-hidden">' + h + "</div>")
            })
        }
    }

    function b(f, e) {
        return e + f
    }
    a(document).on("click", ".kt-next-panel", function(g) {
        var f = a(this);
        var j = f.closest(".menu-item-has-children");
        var k = f.closest(".kt-panel");
        var i = f.attr("href");
        if (a(i).length) {
            k.addClass("kt-sub-opened");
            a(i).addClass("kt-panel-opened").removeClass("kt-hidden").attr("data-parent-panel", k.attr("id"));
            var h = j.find(".kt-item-title").attr("title");
            if (typeof h != "undefined" && typeof h != false) {
                if (!a(".kt-panels-actions-wrap .kt-current-panel-title").length) {
                    a(".kt-panels-actions-wrap").prepend('<span class="kt-current-panel-title"></span>')
                }
                a(".kt-panels-actions-wrap .kt-current-panel-title").html(h)
            } else {
                a(".kt-panels-actions-wrap .kt-current-panel-title").remove()
            }
            a(".kt-panels-actions-wrap .kt-prev-panel").remove();
            a(".kt-panels-actions-wrap").prepend('<a class="kt-prev-panel" href="#' + k.attr("id") + '" data-cur-panel="' + i + '" data-target="#' + k.attr("id") + '"></a>')
        }
        g.preventDefault()
    });
    a(document).on("click", ".kt-prev-panel", function(h) {
        var f = a(this);
        var g = f.attr("data-cur-panel");
        var k = f.attr("href");
        a(g).removeClass("kt-panel-opened").addClass("kt-hidden");
        a(k).addClass("kt-panel-opened").removeClass("kt-sub-opened");
        var j = a(k).attr("data-parent-panel");
        if (typeof j == "undefined" || typeof j == false) {
            a(".kt-panels-actions-wrap .kt-prev-panel").remove();
            a(".kt-panels-actions-wrap .kt-current-panel-title").remove()
        } else {
            a(".kt-panels-actions-wrap .kt-prev-panel").attr("href", "#" + j).attr("data-cur-panel", k).attr("data-target", "#" + j);
            var i = a("#" + j).find('.kt-next-panel[data-target="' + k + '"]').closest(".menu-item").find(".kt-item-title").attr("data-title");
            if (typeof i != "undefined" && typeof i != false) {
                if (!a(".kt-panels-actions-wrap .kt-current-panel-title").length) {
                    a(".kt-panels-actions-wrap").prepend('<span class="kt-current-panel-title"></span>')
                }
                a(".kt-panels-actions-wrap .kt-current-panel-title").html(i)
            } else {
                a(".kt-panels-actions-wrap .kt-current-panel-title").remove()
            }
        }
        h.preventDefault()
    });
    a(document).on("click", ".mobile-navigation", function() {
        a(".kt-clone-wrap").addClass("open");
        return false
    });
    a(document).on("click", ".kt-clone-wrap .kt-close-panels", function() {
        a(".kt-clone-wrap").removeClass("open");
        return false
    })
});