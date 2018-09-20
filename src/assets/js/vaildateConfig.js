export var verifyMsg = {
    'phone': {
        'pattern': '^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9])|(17[0-9]))\\d{8}$',
        'verifyMsg': '必须是11位手机号码',
        'requireMsg': '手机号不能为空!'
    },
    'pw': {
        'pattern': '^\\w{6,16}$',
        'verifyMsg': '密码格式不正确!',
        'requireMsg': '密码不能为空!'
    },
    'verifycode': {
        'pattern': '^\\w{6}$',
        'verifyMsg': '验证码格式不正确!',
        'requireMsg': '验证码不能为空!'
    },
    'nickname': {
        'pattern': '.+',
        'verifyMsg': '昵称格式不正确!',
        'requireMsg': '昵称不能为空!'
    }
};

export const validateRules = {
    required: {
        messages: {
            zh_CN: field => '请输入' + field
        }
    },
    confirmed: {
        messages: {
            zh_CN: '两次密码输入不一致'
        }
    },
    phone: {
        messages: {
            zh_CN: (field, args) => field + '必须是11位手机号码'
        },
        validate(value) {
            return value.length === 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value);
        }
    },
    pw: {
        messages: {
            zh_CN: (field, args) => field + '格式不正确！'
        },
        validate(value) {
            return /^\w{6,16}$/.test(value);
        }
    },
    verifycode: {
        messages: {
            zh_CN: (field, args) => field + '格式不正确！'
        },
        validate(value) {
            return /^\w{6,16}$/.test(value);
        }
    },
    nickname: {
        messages: {
            zh_CN: (field, args) => field + '格式不正确！'
        },
        validate(value) {
            return /\S+/.test(value);
        }
    }
};
export const validateAttributes = {
    zh_CN: {
        email: '邮箱',
        password: '密码',
        phone: '手机号',
        nickname: '昵称',
        confirmPW: '密码',
        verifycode: '验证码'
    }
};

export const validateCustom = {
    zh_CN: {
      payWay: {
        required: field => '请勾选' + field
      },
      protocol: {
        required: field => '请勾选' + field
      }
    }
};
