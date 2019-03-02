(function () {

    /**
     * 测试连接 http://localhost:8080/regist.html?classCode=C0000000001
     * 测试手机 13083965205
     * 快速进入某一页 window.pageController.goto(3) 需要解开本文件68行的注释
     */
    // var host = "http://192.168.96.17:9000";
    var host = window.ellaHomeApi || " ";
    // host = host.replace('http://', 'https://');

    var page1Data = {};
    var page2Data = {};
    var page3Data = {};

    var fixedHeight = '';
    var fixedWidth = '';

    // 倒计时记录
    var nowLastTime;

    // 注释不要删，这段代码会压缩后放到html上执行
    // var screenController = {
    //     fixedWidth: '',
    //     fixedHeight: '',
    //     reset: function () {
    //         document.documentElement.style.width = screenController.fixedWidth + 'px';
    //         document.documentElement.style.height = screenController.fixedHeight + 'px';
    //         document.body.style.width = screenController.fixedWidth + 'px';
    //         document.body.style.height = screenController.fixedHeight + 'px';
    //     },
    //     getInit: function () {
    //         var w = window.innerWidth;
    //         var h = window.innerHeight;
    //         if (h >= w) {
    //             screenController.fixedWidth = w;
    //             screenController.fixedHeight = h;
    //         } else {
    //             screenController.fixedWidth = h;
    //             screenController.fixedHeight = w;
    //         }
    //         document.documentElement.style.width = screenController.fixedWidth + 'px';
    //         document.documentElement.style.height = screenController.fixedHeight + 'px';
    //         document.body.style.width = screenController.fixedWidth + 'px';
    //         document.body.style.height = screenController.fixedHeight + 'px';
    //     }
    // };
    // window.addEventListener("orientationchange", screenController.reset, false);
    // window.addEventListener("resize", screenController.reset, false);

    /**
     * @description 页面打开之后，取url中的  {classCode} c
     *              并根据 classCode 查询后台借口，获取当前幼儿园名称和班级名称
     */
    window.onload = function () {
        var classCode = urlHandle.getParameter('classCode') || urlHandle.getParameter('c');
        if (classCode) {
            $.ajax({
                type: "POST",
                url: host + "/rest/api/service",
                data: {
                    method: 'ella.home.getKindergartenAndClass',
                    content: JSON.stringify({
                        'classCode': classCode
                    })
                },
                dataType: "json",
                success: function (response) {
                    if (response.status == '1' && response.data) {
                        document.querySelector('#Garden').innerHTML = response.data.kindergartenName;
                        document.querySelector('#Class').innerHTML = response.data.className;
                    } else {
                        document.querySelector('.sub_title').innerHTML = '该链接已经失效';
                        document.querySelector('#RegistForm').style.display = 'none';
                    }
                    $('#Loading').remove()
                },
                error: function (err) {
                    console.log(err)
                }
            });
        } else {
            // 链接没有带classcode
            document.querySelector('.sub_title').innerHTML = '该链接为非法链接';
            document.querySelector('#RegistForm').style.display = 'none';
        }
    }

    /**
     * @description url处理方法
     * @method getParameter 传参  {string} key，取 {string} ·value
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

    /**
     * @description 表单验证正则
     */
    var reg = {
        phone: /^1[0-9]{10}$/,
        phoneMsg: '请正确输入手机号',
        code: /^[0-9]{6}$/, //,
        codeMsg: '验证码格式不正确',
        pw: /^[\w\d]{6,12}$/,
        pwMsg: '请输入6-12位的数字、字母组合',
        childname: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
        childnameMsg: '支持中英文，最多10个字符，不允许有非法字符'
    }

    // 翻页控制，页码从1开始计数
    /**
     * @author Gaven
     * @description 页码控制方法
     */
    var pageController = new EllaHome.PageZone({
        id: 'pageZone',
        width: '100%',
        height: '100%',
        duration: 500
    });
    $('.pre_btn').on('click', function () {
        pageController.pre()
    })
    window.pageController = pageController; // TODO: 暂时是为了方便调试，项目上线前需要关掉

    //
    var reJoinBtn = document.getElementById('Rejoin');
    reJoinBtn.onclick = function () {
        // window.location.href = './'
        console.log(window.location)
        window.location.href = './rejoin.html' + window.location.search
    }

    // 发送验证码
    var codeBtn = document.querySelector('#RegistForm .get_code_btn');
    // var preLastTime = localStorage.getItem('codeRequestTime'); // 页面刚打开，检测是否存在一个倒计时
    codeBtn.onclick = function () {

        // 点击之后，先做前端校验，如果手机号格式不对，则停止执行
        var phone = registForm.phone.value;

        if (!phone) {

            EllaHome.alert({
                content: '请先输入手机号',
                style: {
                    //'text-align': 'center'
                },
                timeout: 1000
            })
            return false;

        }

        if (!reg.phone.test(phone)) {

            EllaHome.alert({
                content: reg.phoneMsg,
                style: {
                    //'text-align': 'center'
                },
                timeout: 1000
            })
            return false;

        }

        // 13957160181

        // 上一步校验没问题，则数据发往后端
        $.ajax({
            type: "POST",
            url: host + "/rest/api/service?method=ella.home.sendMessage",
            data: {
                content: JSON.stringify({
                    'mobile': phone,
                    'type': 2
                })
            },
            dataType: "json",
            success: function (response) {
                EllaHome.alert({
                    content: response.message,
                    style: {
                        //'text-align': 'center'
                    },
                    timeout: 1000
                })

                if (response.status == '0') {

                    // return false;

                } else {

                    nowLastTime = 60;
                    var timmer = setInterval(function () {

                        if (nowLastTime > 0) {
                            // 倒计时中
                            codeBtn.innerHTML = nowLastTime + 's'
                            nowLastTime--;
                        } else {
                            codeBtn.innerHTML = "获取验证码";
                            nowLastTime = 60
                            clearInterval(timmer)
                        }

                    }, 1000)

                }
            },
            error: function (err) {
                console.error(err)
            },
            complete: function (data) {
                console.log(data)
            }
        });
    }

    // 第一页，暂存数据，进入下一页
    var registForm = document.querySelector('#RegistForm');

    registForm.addEventListener('submit', function (e) {


        e.preventDefault();

        var phone = registForm.phone.value,
            code = registForm.code.value,
            pw = registForm.pw.value;

        if (!reg.phone.test(phone)) {
            EllaHome.alert({
                content: reg.phoneMsg,
                style: {
                    //'text-align': 'center'
                },
                timeout: 1000
            })
            return false;
        }

        if (!reg.code.test(code)) {
            EllaHome.alert({
                content: reg.codeMsg,
                style: {
                    //'text-align': 'center'
                },
                timeout: 1000
            })
            return false;
        }

        if (!reg.pw.test(pw)) {
            EllaHome.alert({
                content: reg.pwMsg,
                style: {
                    //'text-align': 'center'
                },
                timeout: 1000
            })
            return false;
        }

        // if (localStorage.getItem('ellahome_h5_code') !== code) {
        //     document.querySelector('.pw_container .message').style.display = 'block';
        //     document.querySelector('.pw_container .message').innerHTML = '验证码输入有误';
        //     setTimeout(function () {
        //         document.querySelector('.pw_container .message').style.display = 'none';
        //         document.querySelector('.pw_container .message').innerHTML = '';
        //     }, 2000)

        //     EllaHome.alert({
        //         content: reg.codeMsg,
        //         style: {
        //             //'text-align': 'center'
        //         },
        //         timeout: 1000
        //     })
        //     return false;
        // }

        page1Data = {
            'customerName': phone,
            'checkCode': code,
            'password': md5(pw)
        }


        pageController.next()
        // TODO: 如果要做重新加入班级，这里应该做一个判断
    })

    var childForm = document.querySelector('#ChildForm');
    childForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var childname = childForm.childName.value;
        if (!reg.childname.test(childname)) {

            EllaHome.alert({
                content: reg.childnameMsg,
                style: {
                    //'text-align': 'center'
                },
                timeout: 1000
            })
            return false;
        }

        page2Data = {
            'childName': childname
        }

        pageController.next();

    })
    //13957160181
    var roleForm = document.querySelector('#RoleForm');
    roleForm.addEventListener('submit', function (e) {
        e.preventDefault();
        page3Data = {
            roleName: this.role.value
        }
        $.ajax({
            type: "POST",
            url: host + "/rest/api/service?method=ella.home.registerParent",
            data: {
                content: JSON.stringify({
                    'customerName': page1Data['customerName'],
                    'checkCode': page1Data['checkCode'],
                    'password': page1Data['password'],
                    'childName': page2Data['childName'],
                    'roleName': page3Data['roleName'],
                    'classCode': urlHandle.getParameter('classCode') || urlHandle.getParameter('c'),
                })
            },
            dataType: "json",
            success: function (response) {
                if (response.status == '1') {
                    pageController.next()
                } else {
                    EllaHome.alert({
                        content: response.message,
                        style: {
                            //'text-align': 'center'
                        },
                        timeout: 1000
                    })
                    return false;
                }
            }
        });
        // TODO: 发起注册请求
        // 如果成功，next到 page 4
        // 如果失败，根据具体错误，goto 到指定的 page
    })

    // 点选效果控制
    var roleArr = document.querySelectorAll('#RoleForm input[name=role]');
    // console.log(roleArr)
    roleArr.forEach(function (item, index) {
        item.addEventListener('click', function () {
            roleArr.forEach(function (item) {
                item.parentNode.style = '';
            })
            this.parentNode.style.backgroundColor = '#40d8b0';
            this.parentNode.style.color = '#fff';
            this.parentNode.style.border = '1px solid #40d8b0';
        })
    })

})()
