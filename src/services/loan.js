import request from "../utils/request";

// 轮播条
export async function getCarousel(params) {
    return request('/h5Gateway/customer/getCarousel', {
        method: 'POST',
        body: {
            ...params
        }
    });
}

// 获取用户状态信息
export async function getCustomerInfo(params) {
    return request('/h5Gateway/customer/getCustomerInfo', {
        method: 'POST',
        body: {
            ...params
        }
    });
}

// 发送验证码
export async function sendSms(params) {
    return request('/h5Gateway/sms/sendSms', {
        method: 'POST',
        body: {
            ...params
        }
    });
}

// 校验验证码
export async function validMobileCode(params) {
    return request('/h5Gateway/sms/validMobileCode', {
        method: 'POST',
        body: {
            ...params
        }
    });
}

// 提交申请信息
export async function postApplyInfo(params) {
    return request('/h5Gateway/customer/postApplyInfo', {
        method: 'POST',
        body: {
            ...params
        }
    });
}

// 手机通话详单任务查询
export async function getMobileInfo(params) {
    return request('/h5Gateway/carrier/getMobileInfo', {
        method: 'POST',
        body: {
            ...params
        }
    });
}

// 通话详单验证码二次校验
export async function sendMSG(params) {
    return request('/h5Gateway/carrier/sendMSG', {
        method: 'POST',
        body: {
            ...params
        }
    });
}

// 查询通话详单列表
export async function getMobileInfoList(params) {
    return request('/h5Gateway/carrier/getMobileInfoList', {
        method: 'POST',
        body: {
            ...params
        }
    });
}

// 查询手机号是否查询过通话详单
export async function getCarrier(params) {
    return request('/h5Gateway/carrier/getCarrier', {
        method: 'POST',
        body: {
            ...params
        }
    });
}
