import React from 'react';
import {connect} from 'dva';
import {
    Button,
    NavBar, 
    Icon,
    Toast
} from 'antd-mobile';
import router from 'umi/router';
import Link from 'umi/link';
import { go, judgeTelExist, loadingText } from "../../utils/utils";
import styles from './installment.less';

// 获取session 中的数据
let countCode = sessionStorage.getItem('countCode');
let userInfo = sessionStorage.getItem('personalInfo');
countCode = JSON.parse(countCode);
console.log(countCode, '这是session中的数据')
userInfo = JSON.parse(userInfo); // 个人信息

@connect(({ installment }) => ({
    installment
}))
class CellPhoneCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tel: sessionStorage.getItem("phoneNumber") ? sessionStorage.getItem("phoneNumber") : '',  //手机号码
            code: '',  //短信验证码
            modelShow: false,  //二次验证码弹窗
            modelCode: '',  //二次验证码
            isShow: false  //二次验证码按钮状态
        };
        document.title='手机号认证';
    }

    componentWillMount() {  
        judgeTelExist('/installment/index');
    }

    componentDidMount () {
    }
    
    // 监听验证码输入
    changeCode(e){
		this.setState({
			code: e.target.value.trim()
		})
    }
    // 监听二次验证码输入
    changeModelCode(e){
		this.setState({
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
    
    // 同意并授权
    btnClick = () => {
        const { code } = this.state;

        if (code) {
             // 二次验证参数
             let params = {
                idCard: userInfo.idCard,
                name: userInfo.customerName,
                mobile: this.state.tel,
                servicePassword: countCode.psd,
                verifyCode: this.state.code,
                token: countCode.token
            }
            this.msgTwoGet(params);
        } else {
            this.code.focus()
            Toast.info('请输入短信验证码', 2, null, false);
        }        
    }

    // 二次验证接口
    msgTwoGet = (params) => {
        Toast.loading(loadingText, 0);

        const { dispatch } = this.props;
        dispatch({
            type: 'installment/sendMSGTwo',
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
                                router.push('/installment/applyInfo');
                            },
                            2000
                        );
                    } else {
                        if (response.data && response.data.code == '0001') {
                            this.setState({
                                modelShow: true
                            })
                        } else {
                            router.push('/installment/cellphone');
                            Toast.info(response.message, 2, null, false);
                        }
                    }
                } else {
                    Toast.info('网络超时，请稍后再试', 2, null, false);
                }
            }
        })
    }

    // 二次验证码确认
    register = () => {
        const { isShow, modelCode } = this.state;

        if(isShow){
            if (modelCode) {
                //console.log('点击了确认按钮-----验证码', this.state.modelCode)
                let params = {
                    idCard: userInfo.idCard,
                    name: userInfo.customerName,
                    mobile: this.state.tel,
                    servicePassword: countCode.servicePassword,
                    verifyCode: this.state.modelCode,
                    token: countCode.token
                }
                Toast.loading(loadingText, 0);
                
                const { dispatch } = this.props;
                dispatch({
                    type: 'installment/sendMSGTwo',
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
                                    router.push('/installment/applyInfo');
                                },
                                2000
                            );                        
                        } else {
                            console.log('走这里6', item)
                            if (response.data && response.data.code == '0001') {
                                // 再次调用二次接口进行校验
                                this.setState({
                                    modelShow: true
                                })
                            } else {
                                router.push('/installment/cellphone');
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
        const { tel, code, modelShow, isShow, modelCode } = this.state;

        let model;
        if (modelShow) {
			model = (
                <div className={styles.model}>
					<div className={styles.center_box}>
						<div className={styles.font}>已向{tel}发送短信</div>
						<div className={styles.font}>请输入验证码</div>
                        <div className={styles.modelCode}>
                            <input className={styles.input} type="tel" ref={modelCode => this.modelCode = modelCode} onChange={this.changeModelCode.bind(this)} value={modelCode} name="modelCode" placeholder="" autoFocus/>
						</div>
                        <div className={`${styles.code_bottom} ${ isShow?'' : `${styles.btn_active}`}`} onClick={this.register.bind(this)} >确认</div>
					</div>
				</div>
			)
		} else {
			model = (
				<div style={{display: 'none'}}></div>
			)
		}
        return (
            <div className={styles.installmentLayouts} style={{height:'100vh', overflow: (modelShow? 'hidden' : 'auto')}}>
                <NavBar mode="light" icon={<Icon type="left" />} onLeftClick={() => go()}>手机号认证</NavBar>
                <div className={styles.infoPhone}>
                    <div className={styles.codePhoneNumber}>
                        <div style={{color: '#242424'}}>请输入手机号</div>
                        <div style={{color: '#329DF2'}}>{tel}</div>
                        <div style={{color: '#707070'}}>收到的验证码</div>
                    </div>
                    <div className={styles.codePhoneNumber}>
                        <div className={styles.codePhoneLabel}>短信验证码</div>
                        <div className={styles.codePhoneMessage}>
                            <input className={styles.input} type="tel" ref={code => this.code = code} onChange={this.changeCode.bind(this)} value={code} name="code" placeholder="请输入短信验证码" autoFocus/>
                        </div>
                    </div>
                    <div className={styles.CellPhonePs}>
                        <div>温馨提示：</div>
                        <div>如果出现5分钟内未获取到短信验证码，可能是运营商网络拥挤造成，请点击返回按钮重新获取</div>
                    </div>
                </div>
                <div className={styles.personal}>
                    <div className={styles.btnBlue} onClick={() => this.btnClick()}>确认</div>
                </div> 
                {model}
            </div>
        )

    }
}

export default CellPhoneCode;