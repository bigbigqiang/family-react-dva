(function () {

    /**
     * 测试连接 http://localhost:23333/regist.html?classCode=HC20180516154152775468
     * http://ellabook.cn/ellabook-family-test/h5/regist/rejoin.html?classCode=HC2018103014174233255777&uid=U201810301417423246888
     * http://ellabook.cn/ellabook-family-test/h5/regist/rejoin.html?classCode=HC20180516154152775468&uid=HT20180517145459065171
     *
     */
    var host = window.ellaHomeApi || " ";
    // host = host.replace('http://', 'https://');

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

    /**
     * 存储页面信息
     */
    var info = {
        target: {
            classCode: urlHandle.getParameter('classCode') || urlHandle.getParameter('c')
        },
        my: {},
        teacher: {
            uid: urlHandle.getParameter('uid') || urlHandle.getParameter('t'),
            userType: (urlHandle.getParameter('userType') || 'teacher').toUpperCase()
        },
        getInfo: function (uid, type, callback) {
            $.ajax({
                type: "POST",
                url: host + "/rest/api/service",
                data: {
                    method: 'ella.home.getMyselfInfo',
                    content: JSON.stringify({
                        uid: uid,
                        userType: type,
                    })
                },
                dataType: "json",
                success: function (response) {
                    callback(response)
                },
                error: function (err) {
                    console.log(err)
                }
            })
        }
    }
    /**
     * @description 页面打开之后，取url中的  {classCode} c
     *              并根据 classCode 查询后台借口，获取当前幼儿园名称和班级名称
     *              填充三个页面的班级名，和幼儿园名
     *
     *              根据teacherCode获取教师信息
     *              填充第二页，第四页的教师名和手机号
     *              第二页：加入按钮
     *              第四页：你已加入过，显示班级信息
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
                        info.target['garden'] = response.data.kindergartenName;
                        info.target['class'] = response.data.className;

                        $('#rejoin_confirm .garden').text(info.target.garden)
                        $('#rejoin_confirm .class').text(info.target.class)
                        $('#rejoin_result .garden').text(info.target.garden)
                        $('#rejoin_result .class').text(info.target.class)
                        $('#already_in .garden').text(info.target.garden)
                        $('#already_in .class').text(info.target.class)
                    } else {
                        document.querySelector('.sub_title').innerHTML = '该链接已经失效';
                        document.querySelector('#LoginForm').style.display = 'none';
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
            document.querySelector('#LoginForm').style.display = 'none';
        }

        info.getInfo(info.teacher.uid, info.teacher.userType, function (teacherInfo) {
            if (teacherInfo.status === '1') {
                info.teacher['mobile'] = teacherInfo.data.mobile
                info.teacher['name'] = teacherInfo.data.name

                $('#rejoin_confirm .teacherName').text(info.teacher.name)
                $('#rejoin_confirm .mobileNumber').text(info.teacher.mobile)
                $('#already_in .teacherName').text(info.teacher.name)
                $('#already_in .mobileNumber').text(info.teacher.mobile)
            } else {
                // 链接没有带classcode
                document.querySelector('.sub_title').innerHTML = '该链接为非法链接';
                document.querySelector('#LoginForm').style.display = 'none';
            }
        })
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
    var registBtn = document.getElementById('Regist');
    registBtn.onclick = function () {
        // window.location.href = './'
        console.log(window.location)
        window.location.href = './regist.html' + window.location.search
    }


    // 第一页，登录，暂存数据
    $('#LoginForm').on('submit', function (e) {
        e.preventDefault();
        // console.log(this.phone.value, md5(this.pw.value))
        $.ajax({
            type: "POST",
            url: host + "/rest/api/service",
            data: {
                v: '0.1',
                method: 'ella.home.login',
                content: JSON.stringify({
                    customerName: this.phone.value,
                    password: md5(this.pw.value),
                    loginType: 'H5'
                })
            },
            dataType: "json",
            success: function (response) {
                // 登录失败
                if (response.status !== '1') {
                    alert(response.message);
                    return false;
                }

                // 登录成功，存储登录后信息
                info.my = {
                    uid: response.data.uid,
                    mobile: response.data.mobile,
                    classCode: response.data.classCode,
                    name: response.data.name
                }

                // 填充三个页面的用户名
                $('#rejoin_confirm .parent').text(info.my.name)
                $('#rejoin_result .parent').text(info.my.name)
                $('#already_in .parent').text(info.my.name)

                // 如果已经在当前班级，填充第三页，并跳转
                if (info.my.classCode === info.target.classCode) {
                    // 填充第二页
                    pageController.goto(4)
                } else {
                    pageController.goto(2)
                }

            },
            error: function (err) {
                alert(err)
            }
        })
    })
    // 第二页，显示班级信息，确认加入班级
    $('#JoinClass').on('click', function (e) {
        $.ajax({
            type: "POST",
            url: host + "/rest/api/service",
            data: {
                method: 'ella.home.reEntryClass',
                content: JSON.stringify({
                    classCode: info.target.classCode,
                    customerName: info.my.mobile
                })
            },
            dataType: "json",
            success: function (response) {
                if (response.status == '1') {
                    pageController.goto(3)
                } else {
                    alert(response.message)
                }
            },
            error: function (err) {
                console.log(err)
            }
        });
    })
    // 第三页，显示加入结果

})()
