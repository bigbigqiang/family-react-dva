(function () {

    /**
     * anchor=about 关于我们
     * anchor=book  动画书是什么
     * anchor=join  如何加入班级
     */
    var urlHandle = {
        getParameter: function (name) {
            var url = document.location.href;
            var start = url.indexOf("?") + 1;
            if (start == 0) {
                return "";
            }
            var value = "";
            var queryString = url.substring(start);
            var paraNames = queryString.split("&");
            for (var i = 0; i < paraNames.length; i++) {
                if (name == urlHandle.getParameterName(paraNames[i])) {
                    value = urlHandle.getParameterValue(paraNames[i])
                }
            }
            return value;
        },
        getParameterName: function (str) {
            var start = str.indexOf("=");
            if (start == -1) {
                return str;
            }
            return str.substring(0, start);
        },
        getParameterValue: function (str) {
            var start = str.indexOf("=");
            if (start == -1) {
                return "";
            }
            return str.substring(start + 1);
        }
    }

    window.onload = function () {
        var anchor = urlHandle.getParameter('anchor')
        var bodyHeight = $('body').height();
        var windowHeight = $(window).height();
        if (anchor) {
            var anchorTop = $('#' + anchor).offset().top;
        } else {
            anchorTop = 0;
        }
        console.log(bodyHeight >= anchorTop + windowHeight)
        if (bodyHeight >= anchorTop + windowHeight) {
            window.scrollTo(0, anchorTop)
        } else {
            window.scrollTo(0, bodyHeight)
        }

    }
})()
