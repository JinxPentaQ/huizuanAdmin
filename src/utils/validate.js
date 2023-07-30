/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'admin1', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * 邮箱校验
 * */
export var checkEmail = (rule, value, callback) => {
    const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
    if (!value) {
        return callback(new Error('邮箱不能为空'))
    }
    setTimeout(() => {
        if (mailReg.test(value.trim())) {
        callback()
    } else {
        callback(new Error('请输入正确的邮箱格式'))
    }
}, 100)
}
