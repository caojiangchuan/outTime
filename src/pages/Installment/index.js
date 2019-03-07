/**
 * description:
 * Notes:
 * @author YM10219
 * @date 2018/12/24
 */
import React from 'react';
import { connect } from 'dva';
import {
    Button,
    Toast
} from 'antd-mobile';
import router from 'umi/router';
import Link from 'umi/link';
import { loadingText, phoneReg } from "../../utils/utils";
import styles from './installment.less';

import iconNChoice from '../../assets/installment/n-choice.png';
import iconYChoice from '../../assets/installment/y-choice.png';

@connect(({ installment }) => ({
    installment
}))
class Installment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tel: sessionStorage.getItem("phoneNumber") ? sessionStorage.getItem("phoneNumber") : '',  //手机号码
            checkStatus: false,   //协议勾选状态
            modelShow: false,   //验证码模态框显示状态
            isShow: false,   //验证码模态框按钮显示状态
            isCode: false,   //验证码模态框获取验证码按钮显示状态
            timer: 60,   //验证码倒计时时间
            code: '',   //验证码
            message: '获取验证码',  //验证码获取按钮文字
            userState: null, // 用户是否注册状态 1.已提交 2.未注册 3.超过7/30天
            userIsValid: null, // 是否超过72小时 1.未超过 2.超过
            isClickGetCode: false, // 是否点击获取验证码
            count: 0 // 点击注册领取次数
        }
        document.title='分期申请';
    }

    componentDidMount() {        
    }

    componentWillUnmount () {
        this.setState = (state,callback)=>{
            return;
        };
    }

    //监听手机号输入
    changeTel(e){
		this.setState({
			tel: e.target.value.trim()
		})
    }
    //监听验证码输入
	changeCode(e){
        this.setState({
            code: e.target.value.trim()
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

    // 勾选协议状态
    handleCheck = ()=>{
        const { checkStatus } = this.state;
        this.setState({
            checkStatus: !checkStatus
        })
    }

    // 马上分期
    handleInstallment = ()=>{
        const { tel, checkStatus } = this.state;

		if (tel) {
			if (!phoneReg.test(tel)) {
                this.telPhone.focus();
				Toast.info('手机号有误，请重新输入', 2, null, false);
			} else {
                // 协议已勾选
                if(checkStatus){
                    // 获取用户状态信息
					this.getCustomerInfo();                    
                }else{
                    Toast.info('请先勾选同意注册协议', 2, null, false);
                    return false;
                }
			}
		} else {
			this.telPhone.focus();
			Toast.info('请先输入手机号', 2, null, false);
		}
    }

	//点击获取验证码按钮
	codeBtn() {
        //发送验证码
        // this.getCode();
        this.setState({
            isCode: true,
            isClickGetCode: true
        })
        let timer = this.state.timer
		let siv = setInterval(() => {
			this.setState({
				timer: --timer
			}, () => {
				if (timer === -1) {
					clearInterval(siv);
					this.setState({
						isCode: false,
						timer: 60,
						message: '重新获取'
					})
				}
			});
		}, 1000);
        const { dispatch } = this.props;
        const { tel } = this.state;

        dispatch({
            type: 'installment/sendms',
            payload: {
				phone: tel,
				type: '0'  //0---24小时可获取
            },
            callback: response => {
                if (response.success) {
					// console.log('发送验证码', response)
					// this.setState({
					// 	isCode: true,
					// 	isClickGetCode: true
					// })
				} else {
					if (response.message == '请不要频繁点击') {
						Toast.info(response.message, 2, null, false);
						setTimeout(
							() => { 
								window.location.href= '/installment/index'
							},
							2000
                        );
                        clearInterval(siv);
						this.setState({
							isCode: false,
							isClickGetCode: false,
							timer: 60
						}, () => {
							clearInterval(siv);
							return
						})
					} else {
                        Toast.info(response.message, 2, null, false);
                        this.setState({
							isCode: false,
							isClickGetCode: false,
							timer: 60
						}, () => {
                            clearInterval(siv);
							return
                        })
					}
				}
            }
        })
    }

    //注册分期
	register() {
        const { isShow, code, tel } = this.state;
        
        if (isShow) {
            if (code) {
                if (!this.state.isClickGetCode) {
					Toast.info('请先获取验证码', 2, null, false);
					return
				}
                //存储手机号
                sessionStorage.setItem('phoneNumber', tel);
                Toast.loading(loadingText, 0);
                // 在此处调取接口 校验验证码 validms
                const { dispatch } = this.props;
                dispatch({
                    type: 'installment/validms',
                    payload: {
                        code: code,
                        type: '0',  //0---24小时可获取
                        phone: tel
                    },
                    callback: response => {
                        console.log('发送验证码', response)
                        Toast.hide();
                        if (response) {
							if (response.success) {
								router.push('/installment/personal');
							} else {
								if (response.message == '验证码尝试次数已超过3次，不能再次尝试') {
									Toast.info(response.message, 2, null, false);
									setTimeout(
										() => { 
											window.location.href= '/installment/index'
										},
										2000
									);
								} else if(response.message == '验证码错误') {
									Toast.info('验证码尝试次数已超过3次，不能再次尝试', 2, null, false);
									this.setState({
										count: this.state.count + 1
									}, () => {
										if (this.state.count >= 4) {
											setTimeout(
												() => { 
													window.location.href= '/installment/index'
												},
												2000
											);
										} else {
											Toast.info(response.message, 2, null, false);
										}
									})
								}else{
                                    Toast.info(response.message, 2, null, false);
                                }
							}
						} else {
							Toast.info('接口未响应，请重新操作', 2, null, false);
                        }
                    }
                })
            } else {
                Toast.info('请输入验证码', 2, null, false);
            }
        }    
	}

    //获取用户状态信息
    getCustomerInfo = () => {
        Toast.loading(loadingText, 0);

        const { dispatch } = this.props;
        const { tel } = this.state;

        dispatch({
            type: 'installment/info',
            payload: {
                phone: tel,
                type: '2'
            },
            callback: response => {
                console.log(response, '用户状态信息')
                Toast.hide();
				if (response && response.data) {
                    //客户状态
                    const state = response.data.state;        
                    //是否超过72小时                 
                    const isvalid = response.data.isvalid;            
                    //2-未注册, 3-超过7天
					if(state == 2 || state == 3) {
						this.setState({
							modelShow: true
						}, () => {
                            window.scrollTo(0, 0)
                        })
					} else if(state == 1 && isvalid == 1){
						Toast.info('您已提交申请，请勿重复提交', 2, null, false);
					} else if(state == 1 && isvalid == 3){
						Toast.info('您已提交申请，请勿重复提交', 2, null, false);
					}
				}
            }
        })
    }

    /**
	 * 失去焦点事件
	 */
	inputOnBlur(){
		// this.setState({ focus: false });
		window.scrollTo(0, 0)
		// console.log('失去焦点了')
	}

    render() {
        const { checkStatus, isCode, timer, message, modelShow, tel, code, isShow } = this.state;

        /**
		 * 弹窗
		 */
		let model;
		let codeHtml;
		if (isCode) {
			codeHtml = (
				<div className={styles.code_right} style={{background: 'gray'}}>{timer}s</div>
			)
		} else {
			codeHtml = (
				<div className={styles.code_right} onClick={() => this.codeBtn()}>{message}</div>
			)
		}
		if (modelShow) {
			model = (
				<div className={styles.model}>
					<div className={styles.center_box}>
						<div className={styles.font}>
                        {/* 已向{tel}发送短信 */}
                        请点击获取验证码发送短信
                        </div>
						<div className={styles.font}>输入验证码注册领取</div>
						<div className={styles.code}>       
                            <input className={styles.code_input} type="tel" onChange={this.changeCode.bind(this)} value={code} name="code" placeholder="" onBlur={ ::this.inputOnBlur } ref="code"/>                    
                            {codeHtml}
						</div>
						<div className={`${styles.code_bottom} ${ isShow?'' : `${styles.btn_active}`}`} onClick={() => this.register()} >注册分期</div>
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
                <div className={styles.wrapper}>
                    <div className={styles.title}>
                        <div className={styles.tf}>我要分期</div>
                        <div className={styles.ts}>还款太多怎么办？</div>
                        <div className={styles.tt}>我要来分期</div>
                    </div>
                    <div className={styles.infoBlock}>
                        <div className={styles.infoBlockf}></div>
                        <div className={styles.infoBlocks}></div>
                        <div className={styles.infoIn}>
                            <div className={styles.infoInt}>快速申请通道</div>
                            <div className={styles.inputBox}>
                                <input type="tel" onChange={this.changeTel.bind(this)} value={this.state.tel} ref={telPhone => this.telPhone = telPhone} placeholder="请输入您的手机号" maxLength="11" autoFocus/>
                            </div>
                        </div>
                        <div className={styles.agreements}>
                            <span onClick={() => this.handleCheck()}><img src={ checkStatus ? iconYChoice : iconNChoice } />阅读并同意</span>
                            <span><Link 
                                onClick={()=>{
                                    sessionStorage.setItem('phoneNumber', tel);
                                }}
                                to="/installment/protocol">《分期申请协议》</Link></span>
                        </div>
                        <div className={styles.btnBlue} onClick={() => this.handleInstallment()}>马上分期</div>
                    </div>
                    
                    <div className={styles.intro}>
                        <h2>特别说明</h2>
                        <p>a、填写本人身份信息务必真实有效<br/>
                            b、填写资料信息务必完整有效<br/>
                            c、填写分期申请，请详细说明<br/>
                            d、最终解释权归上海证大投资咨询有限公司所有</p>
                    </div>
                </div>
                {/* 模态框 */}
				{model}
            </div>
        );
    }
}

export default Installment;
