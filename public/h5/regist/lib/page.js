(function () {

    // 创建命名空间，并暴露框架
    var namespace = 'EllaHome';
    window[namespace] = window[namespace] || {};

    /**
     * @param {object} _props
     * @param {string} id   必填，容器ID
     * @param {number} width    必填，容器宽度，像素
     * @param {number} height   必填，容器高度，像素
     * @param {number} duration 翻页过渡时间
     */
    var PageZone = function (_props) {

        this.id = _props.id;
        this.container = document.getElementById(_props.id);
        this.total = this.container.children.length;
        this.transitionDuration = _props.duration || 0;
        this.nowPage = 1;
        this.isMoving = false;
        this.callback = _props.callback || null;

        this.container.style.position = 'relative';
        this.container.style.overflow = 'hidden';
        this.container.style.width = _props.width;
        this.container.style.height = _props.height;

        addStyle(this.container.children, 0);
    }
    PageZone.prototype.continue = function () {
        this.total = this.container.children.length;
        addStyle(this.container.children, this.nowPage - 1);
    }
    PageZone.prototype.goto = function (page) {
        var ob = this;
        if (page >= 1 && page <= ob.total) {
            // 上一页大于等于1 ，则可以翻到上一页
            if (!ob.isMoving) {
                // 使用子容器个数作为页数
                var now = ob.container.children[ob.nowPage - 1]
                var next = ob.container.children[page - 1]
                window.test = now

                // 本页退出
                now.style.transform = 'translate3d(-100%,0,0)';
                now.style.opacity = '0';
                // next.style.borderRadius = '0 0 1000% 1000%';

                // 下一页带特效出现，历时见 transitionDuration
                next.style.display = 'block';
                setTimeout(function () {
                    next.style.transitionDuration = ob.transitionDuration + 'ms';
                    next.style.opacity = '1';
                    next.style.transform = 'translate3d(0,0,0)';
                    // next.style.borderRadius = '0';
                }, 1)

                ob.isMoving = true; // 动画开关量
                setTimeout(function () {
                    // 本页完全退出之后，本页隐藏，本页变成了目标页
                    now.style.display = 'none';
                    next.style.display = 'block'; // 这里是为了解决当前页跳转当前页的情况，由于每次都会最后把下一页本页隐藏了，但是这里，下一页也是本页，所以也隐藏了，这里再显示出来
                    ob.isMoving = false;
                    ob.nowPage = page;
                    ob.callback ? ob.callback(ob) : null;
                }, ob.transitionDuration)
            }
        } else {
            if (ob.nowPage == '1' && page * 1 < 1) {
                console.log('已经到第一页了')
            } else if (ob.nowPage == ob.total && page * 1 > ob.total) {
                console.log('已经到最后一页了')
            } else {
                console.log('你想去的那页不存在')
            }
        }
    }
    PageZone.prototype.pre = function () {
        this.goto(this.nowPage - 1)
    }
    PageZone.prototype.next = function () {
        this.goto(this.nowPage + 1)
    }
    window[namespace].PageZone = PageZone;

    var createStyleString = function (styleObj) {
        // console.log(styleObj)
        var _s = '';
        for (var key in styleObj) {
            _s += `${key}:${styleObj[key]};`
        }
        return _s;
    }

    /**
     * itemArr 子元素数组
     * now 遍历之后，默认显示页
     */
    var addStyle = function (itemArr, now) {
        for (var i = 0; i < itemArr.length; i++) {
            var item = itemArr[i];
            var style = {
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: '0',
                left: '0',
                opacity: '0',
                transform: 'translate3d(-100%,0,0)',
                // 'border-radius': '0',
                display: 'none'
            }
            if (i === now) {
                style.opacity = '1';
                style.transform = 'translate3d(0,0,0)';
                style.display = 'block';
                // style['border-radius'] = '0';
            }
            item.setAttribute('style', createStyleString(style));
        }
    }


})()
