import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { Toast } from 'antd-mobile';
import styleR from './index.less'
import styles from './Contact/contact.less'
import {connect} from 'dva';
import { go, judgeTelExist, loadingText } from "../../utils/utils";

// 获取session 中的数据
let countCode = sessionStorage.getItem('countCode');
let userInfo = sessionStorage.getItem('personalInfo');
countCode = JSON.parse(countCode);
console.log(countCode, '这是session中的数据')
userInfo = JSON.parse(userInfo); // 个人信息
@connect(({ loan }) => ({
    loan
}))
export default class Protocol extends Component {
    constructor(props) {
        super(props);
        this.state = {
            telPhone: sessionStorage.getItem("phoneNumber") ? sessionStorage.getItem("phoneNumber") : '',
            code: '',
            timer: 7,
            message: null,
            timeOut: false,
            modelShow: false,
            modelCode: '',
            isShow: false
        };
        document.title='手机号认证'
    }

    componentDidMount () {
        // this.countDown()
    }

    componentWillMount() {  
        judgeTelExist('/loan/index');
    }

    componentWillUnmount () {
        this.setState = (state,callback)=>{
            return;
        };
    }

    msgTwoGet = (params) => {
        Toast.loading(loadingText, 0);
        const { dispatch } = this.props;
        dispatch({
            type: 'loan/sendMSGTwo',
            payload: {
                idCard: params.idCard,
                name: params.name,
                mobile: params.mobile,
                servicePassword: params.servicePassword,
                verifyCode: params.verifyCode,
                token: params.token
            },
            callback: response => {
                Toast.hide();
                if (response) {
                    if (response.success) {
                        Toast.info('获取中', 2, null, false);
                        setTimeout(
                            () => { 
                                router.push('/loan/bankcard');
                            },
                            2000
                        );
                    } else {
                        if (response.data && response.data.code == '0001') {
                            this.setState({
                                modelShow: true
                            })
                        } else {
                            router.push('/loan/cellphone');
                            Toast.info(response.message, 2, null, false);
                        }
                    }
                } else {
                    Toast.info('网络超时，请稍后再试', 2, null, false);
                }
            }
        })
    }


    /**
     * 同意并授权
     */
    btnClick = () => {
        if (this.state.code) {
            // 二次验证参数
            let params = {
                idCard: userInfo.userIdCard,
                name: userInfo.userName,
                mobile: this.state.telPhone,
                servicePassword: countCode.psd,
                verifyCode: this.state.code,
                token: countCode.token
            }
            this.msgTwoGet(params)
        } else {
            this.code.focus()
            Toast.info('请输入短信验证码', 2, null, false);
        }
        
    }

    /**
     * 校验 code
     */
    changeCode(e){
        if (e.target.value.indexOf("'") != -1 || e.target.value.indexOf("\"") != -1) { 
            return
        } else {
            this.setState({
                code: e.target.value.trim().replace(/\'/g,"").replace(/\"/g,"")
            })
        }
		// this.setState({
		// 	code: e.target.value.trim()
		// })
    }

    /**
     * 校验 modelCode
     */
    changeModelCode(e){
        this.setState({
            isShow: true,
            modelCode: e.target.value.trim()
        })
        if(e.target.value.length > 0){
            this.setState({
                isShow: true
            })
        }else{
            this.setState({
                isShow: false
            })
        }
    }

    /**
     * 点击验证码 -- 确认
     */
    register() {
        if (this.state.isShow) {
            if (this.state.modelCode) {
                let params = {
                    idCard: userInfo.userIdCard,
                    name: userInfo.userName,
                    mobile: this.state.telPhone,
                    servicePassword: countCode.psd,
                    verifyCode: this.state.modelCode,
                    token: countCode.token
                }
                Toast.loading(loadingText, 0);
                const { dispatch } = this.props;
                dispatch({
                    type: 'loan/sendMSGTwo',
                    payload: {
                        idCard: params.idCard,
                        name: params.name,
                        mobile: params.mobile,
                        servicePassword: params.servicePassword,
                        verifyCode: params.verifyCode,
                        token: params.token
                    },
                    callback: response => {
                        Toast.hide();
                        if (response.success) {
                            Toast.info('获取中', 2, null, false);
                            setTimeout(
                                () => { 
                                    router.push('/loan/bankcard');
                                },
                                2000
                            );
                        } else {
                            if (response.data && response.data.code == '0001') {
                                // 再次调用二次接口进行校验
                                this.setState({
                                    modelShow: true
                                })
                            } else {
                                router.push('/loan/cellphone');
                                Toast.info(response.message, 2, null, false);
                            }
                        }
                    }
                })
            } else {
                Toast.info('请输入验证码', 2, null, false);
            }
        }
    }

    render(){
        let model;
        if (this.state.modelShow) {
			model = (
                <div className={styleR.model}>
					<div className={styleR.center_box}>
						<div className={styleR.font}>已向{this.state.telPhone}发送短信</div>
						<div className={styleR.font}>请输入验证码</div>
                        <input className={styles.input} 
                            style={{textAlign:'center', height: '39px', padding: '0px', border: '1px solid #CFCFCF', borderRadius: '5px', margin: '21.5px 0px'}}
                            type="tel" ref={modelCode => this.modelCode = modelCode} onChange={this.changeModelCode.bind(this)} value={this.state.modelCode} name="modelCode" placeholder="" autoFocus/>
						<div className={`${styleR.code_bottom} ${ this.state.isShow?'' : `${styleR.btn_active}`}`} onClick={this.register.bind(this)} >确认</div>
					</div>
				</div>
			)
		} else {
			model = (
				<div style={{display: 'none'}}></div>
			)
		}
        return (
            <div style={{background: '#F5F5F5', height:'100vh', overflow: (this.state.modelShow? 'hidden' : 'auto')}}>
                {/* 协议头部 */}
                <div style={{
                    display: 'flex',
                    background: '#FF3D3D',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: '1'
                    }}>
                    <div style={{height: '44px', width: '44px', position: 'relative'}} onClick={() => go()}>
                        <img src={require('../../assets/loan/arrowLift.png')} style={{
                            display: 'block', width: '14.5px', height: '21px', margin: 'auto', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'
                            }} />
                    </div>
                    <div style={{
                        flex: 1, textAlign: 'center', lineHeight: '44px', fontSize:'18px', color: '#FFFFFF'
                    }}>
                        手机号认证
                    </div>
                    <div style={{height: '44px', width: '44px'}}></div>
                </div>
                {/* 内容部分 */}
                <div style={{
                        padding: '44px 0 0 0',
                        fontSize: '15px',
                        lineHeight: '52px',
                        color: '#444444'
                }}>
                    {/* 手机号 */}
                    <div style={{background: '#fff', display: 'flex', alignItems: 'center', borderBottom: '1px solid #F5F5F5', padding: '0 15px', height: '52px', justifyContent: 'space-between'}}>
                        <div style={{color: '#242424'}}>请输入手机号</div>
                        <div style={{color: '#FF3D3D'}}>{this.state.telPhone}</div>
                        <div style={{color: '#707070'}}>收到的验证码</div>
                    </div>
                    {/* 短信验证码 */}
                    <div style={{background: '#fff', display: 'flex', alignItems: 'center', borderBottom: '1px solid #F5F5F5', padding: '0 17px', height: '52px', justifyContent: 'flex-start'}}>
                        <div style={{color: '#242424', width: '100px'}}>短信验证码</div>
                        <div style={{color: '#FF3D3D', height: '100%', flex: '1'}}>
                            <input className={styles.input} style={{
                                textAlign: 'left', textAlign: 'left', height: '100%', width: '100%', padding: '0px', textIndent: '5px'
                                }} type="text" ref={code => this.code = code} onChange={this.changeCode.bind(this)} value={this.state.code} name="code" placeholder="请输入短信验证码" autoFocus/>
                        </div>
                    </div>
                </div>
                <div style={{
                    color: '#FFFFFF',
                    lineHeight: '46px',
                    textAlign: 'center',
                    background: '#F5F5F5',
                    marginTop: '100px'
                }} onClick={this.btnClick}>
                    <div style={{
                        background: '#FF3D3D',
                        borderRadius: '23px',
                        margin: '0 17px 19.5px',
                    }}>同意并授权</div>
                </div>
                {/* 温馨提示 */}
                <div style={{color: '#707070', fontSize: '15px', lineHeight: '24px', padding: '0 25.5px'}}>
                    <div>温馨提示：</div>
                    <div>如果出现5分钟内未获取到短信验证码，可能是运营商网络拥挤造成，请点击返回按钮重新获取</div>
                </div>
                {model}
            </div>
        )

    }
}
