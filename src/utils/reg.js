export const RegSet = {
    // 身份证号码
    idCard: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,

    // 邮箱格式
    email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,

    // 手机号码 粗放 1 开头的11位数字
    mobilePhone: /^1[0-9]{1}[0-9]{9}$/,

    // 版本号校验
    version: /^\d{1,2}\.\d{1,2}\.\d{1,2}$/,
}