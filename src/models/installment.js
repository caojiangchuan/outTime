import { getCustomerInfo, sendSms, validMobileCode, postApplyInfo, getMobileInfo, sendMSG, getMobileInfoList, getCarrier } from '../services/installment';

export default {
    namespace: 'installment',

    state: {
        data: [],
        loading: true
    },
    effects: {
        // 获取用户状态信息
        *info({payload, callback}, { call, put }) {
            const response = yield call(getCustomerInfo, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if(callback) callback(response);
        },
        // 发送验证码 sendSms
        *sendms({payload, callback}, { call, put }) {
            const response = yield call(sendSms, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if(callback) callback(response);
        },
        // 校验验证码
        *validms({payload, callback}, { call, put }) {
            const response = yield call(validMobileCode, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if(callback) callback(response);
        },
        // 手机通话详单任务查询
        *getMInfo({payload, callback}, { call, put }) {
            const response = yield call(getMobileInfo, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if(callback) callback(response);
        },
        // 查询手机号是否查询过通话详单 getCarrier
        *getMCarrier({payload, callback}, { call, put }) {
            const response = yield call(getCarrier, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if(callback) callback(response);
        },
        // postApplyInfo 提交申请信息
        *postInfo({payload, callback}, { call, put }) {
            const response = yield call(postApplyInfo, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if(callback) callback(response);
        },
        // 二次校验 sendMSG
        *sendMSGTwo({payload, callback}, { call, put }) {
            const response = yield call(sendMSG, payload);
            yield put({
                type: 'save',
                payload: response,
            });
            if(callback) callback(response);
        }
    },
    reducers: {
        save(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        }
    },
};
