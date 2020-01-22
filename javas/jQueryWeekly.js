! function (e) {
    e.fn.weekly_schedule = function (t) {
        function o() {
            for (var t = e(".day"), o = {}, r = 0; r < t.length; r++) {
                for (var n = e(t[r]).children(), a = [], i = 0; i < n.length; i++) e(n[i]).hasClass("selected") && a.push(n[i]);
                o[r] = a
            }
            return o
        }

        function r(e) {
            var t = [],
                o = e.toUpperCase().split("-"),
                r = parseInt(o[0].split(":")[0]),
                n = parseInt(o[1].split(":")[0]),
                a = o[0].includes("PM") ? r + 12 : r,
                i = o[1].includes("PM") ? n + 12 : n,
                s = a;
            for (s; i >= s; s++) {
                var d = "";
                d += s > 12 ? "" + (s - 12) + " PM" : 12 == s ? "" + s + " PM" : "" + s + " AM", t.push(d)
            }
            return t
        }

        function n(e) {
            return e.charAt(0).toUpperCase() + e.slice(1)
        }

        function a(t) {
            for (var o = e(t).attr("class").split(" ")[1], r = e(".day"), n = 0; n < r.length; n++)
                if (!e(r[n]).hasClass(o))
                    for (var a = e(r[n]).children(), s = 0; s < a.length; s++) e(a[s]).addClass("disabled");
            e(t).on("mouseleave", function () {
                i(), d = !1, l = !1
            })
        }

        function i() {
            for (var t = e(".day"), o = 0; o < t.length; o++)
                for (var r = e(t[o]).children(), n = 0; n < r.length; n++) e(r[n]).removeClass("disabled")
        }
        var s = e.extend({
            days: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
            hours: "7:00AM-10:00PM",
            fontFamily: "Montserrat",
            fontColor: "black",
            fontWeight: "100",
            fontSize: "0.8em",
            hoverColor: "#727bad",
            selectionColor: "#9aa7ee",
            headerBackgroundColor: "transparent",
            onSelected: function () {},
            onRemoved: function () {}
        }, t || {});
        s.hoursParsed = r(s.hours);
        var d = !1,
            l = !1,
            h = this;
        if ("string" == typeof t) switch (t) {
            case "getSelectedHour":
                return o();
            default:
                throw "Weekly schedule method unrecognized!"
        } else {
            var c = s.days,
                u = s.hoursParsed;
            e(h).addClass("schedule");
            var p = e("<div></div>", {
                    "class": "header"
                }),
                f = e("<div></div>", {
                    "class": "align-block"
                });
            p.append(f);
            for (var g = 0; g < c.length; ++g) {
                var v = e("<div></div>", {
                        "class": "header-item " + c[g] + "-header"
                    }),
                    m = e("<h3>" + n(c[g]) + "</h3>");
                v.append(m), p.append(v)
            }
            var y = e("<div></div>", {
                    "class": "days-wrapper"
                }),
                C = e("<div></div>", {
                    "class": "hour-header"
                });
            y.append(C);
            for (var g = 0; g < u.length; g++) {
                var x = e("<div></div>", {
                        "class": "hour-header-item " + u[g]
                    }),
                    m = e("<h5>" + u[g] + "</h5>");
                x.append(m), C.append(x)
            }
            for (var g = 0; g < c.length; g++) {
                for (var b = e("<div></div>", {
                        "class": "day " + c[g]
                    }), w = 0; w < u.length; w++) {
                    var k = e("<div></div>", {
                        'id': "day_" + c[g] + '_hour_' + u[w],
                        "class": "hour " + u[w]
                    });
                    b.append(k)
                }
                y.append(b)
            }
            e(h).append(p), e(h).append(y), e(".schedule").css({
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start"
            }), e(".header").css({
                height: "30px",
                width: "100%",
                background: s.headerBackgroundColor,
                marginBottom: "5px",
                display: "flex",
                flexDirection: "row"
            }), e(".align-block").css({
                width: "100%",
                height: "100%",
                background: s.headerBackgroundColor,
                margin: "3px"
            }), e(".header-item").css({
                width: "100%",
                height: "100%",
                margin: "2px"
            }), e(".header-item h3").css({
                margin: 0,
                textAlign: "center",
                verticalAlign: "middle",
                position: "relative",
                top: "50%",
                color: s.fontColor,
                fontFamily: s.fontFamily,
                fontSize: s.fontSize,
                fontWeight: s.fontWeight,
                transform: "translateY(-50%)",
                userSelect: "none"
            }), e(".hour-header").css({
                display: "flex",
                flexDirection: "column",
                margin: "2px",
                marginRight: "1px",
                background: s.headerBackgroundColor,
                width: "100%"
            }), e(".days-wrapper").css({
                width: "100%",
                height: "100%",
                background: "transparent",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                position: "relative"
            }), e(".hour-header-item").css({
                width: "100%",
                height: "100%",
                border: "none",
                borderColor: "none",
                borderStyle: "none"
            }), e(".hour-header-item h5").css({
                color: s.fontColor,
                margin: "0",
                textAlign: "right",
                verticalAlign: "middle",
                position: "relative",
                fontFamily: s.fontFamily,
                fontSize: s.fontSize,
                fontWeight: s.fontWeight,
                paddingRight: "10%",
                userSelect: "none"
            }), e(".day").css({
                display: "flex",
                flexDirection: "column",
                marginRight: "1px",
                marginBottom: "1px",
                background: "transparent",
                width: "100%"
            }), e(".hour").css({
                background: "#dddddd",
                marginBottom: "1px",
                width: "100%",
                height: "100%",
                userSelect: "none"
            }), e("<style type='text/css' scoped> .hover { background: " + s.hoverColor + " !important;} .selected { background: " + s.selectionColor + " !important; } .disabled { pointer-events: none !important; opacity: 0.3 !important; box-shadow: none !important; }</style>").appendTo(h), e(".schedule").on("contextmenu", function () {
                return !1
            }), e(".hour").on("mouseenter", function () {
                d ? l ? e(this).removeClass("selected") : e(this).addClass("selected") : e(this).addClass("hover")
            }).on("mousedown", function () {
                d = !0, a(e(this).parent()), e(this).hasClass("selected") ? (h.trigger("selectionremoved"), e(this).removeClass("selected"), l = !0) : (h.trigger("selectionmade"), e(this).addClass("selected")), e(this).removeClass("hover")
            }).on("mouseup", function () {
                l = !1, d = !1, i()
            }).on("mouseleave", function () {
                d || e(this).removeClass("hover")
            })
        }
    }
}(jQuery);