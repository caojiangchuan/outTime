import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import Link from 'umi/link';
import { Toast } from 'antd-mobile';
import styles from './Contact/contact.less'
import {connect} from 'dva';
import { go, singleCode, doubleCode, noCode, needIdCard, judgeTelExist, loadingText } from "../../utils/utils";
// 静态图片
import yChoice from '../../assets/loan/y-choice.png'
import nChoice from '../../assets/loan/n-choice.png'
// 获取session 中的数据
let userInfo = sessionStorage.getItem('personalInfo');
let contInfo = sessionStorage.getItem('contactInfo');
userInfo = JSON.parse(userInfo); // 个人信息
contInfo = JSON.parse(contInfo); // 亲属
// console.log(userInfo, 'session中的数据', contInfo, '亲属')
@connect(({ loan }) => ({
    loan
}))

export default class Protocol extends Component {
    constructor(props) {
        super(props);
        this.state = {
            telPhone: sessionStorage.getItem("phoneNumber") ? sessionStorage.getItem("phoneNumber") : '',
            isChoice: true,
            psd: ''
        };
        document.title='手机号认证'
    }

    componentDidMount () {
        
    }

    componentWillMount() {  
        judgeTelExist('/loan/index');
    }

    // choice = (item) => {
    //     this.setState({
    //         isChoice: !item
    //     }, () => {
    //         console.log(this.state.isChoice, '显示')
    //     })
    // }

    getMInfo = (params) => {
        Toast.loading(loadingText, 0);
        const { dispatch } = this.props;
        dispatch({
            type: 'loan/getMInfo',
            payload: {
                idCard: params.idCard,
                name: params.name,
                mobile: params.mobile,
                servicePassword: params.servicePassword,
                verifyCode: params.verifyCode
            },
            callback: response => {
                Toast.hide();
                if (response && response.success) {
                    Toast.info('获取中', 2, null, false);
                    setTimeout(
                        () => { 
                            router.push('/loan/bankcard');
                        },
                        2000
                    );
                } else {
                    let countCode = {
                        psd: this.state.psd,
                        token: response.data.token
                    }
                    if (response.data && response.data.code === '0001') {
                        router.push('/loan/cellphonecode')
                    } else if (response.data && response.data.code=='1109') {
                        Toast.info(response.message, 2, null, false);
                        return
                    } else {
                        Toast.info(response.message, 2, null, false);
                        return
                    }
                    sessionStorage.setItem('countCode', JSON.stringify(countCode));
                }
            }
        })
    }

    btnClick = () => {
        // 1.单条 2.两条 3.吉林电信 4.不需要验证码 5.身份证号码
        // console.log(this.state, '数据')
        let params = {
            idCard: userInfo.userIdCard,
            name: userInfo.userName,
            mobile: this.state.telPhone,
            servicePassword: this.state.psd,
            verifyCode: null
        }
        if (this.state.psd) {
            // 调取接口   校验密码
        } else {
            this.psd.focus()
            Toast.info('请输入手机服务密码', 2, null, false);
            return
        }
        // if (!this.state.isChoice) {
        //     Toast.info('请先勾选用户使用协议', 2, null, false);
        //     return
        // }
        if (contInfo.carrier === '吉林电信') {
            Toast.info('获取中', 2, null, false);
            setTimeout(
                () => { 
                    router.push('/loan/bankcard');
                },
                2000
            );
            return
        }
        console.log('走到这里了吗', contInfo.carrier)
        this.getMInfo(params)
    }

    /**
     * 校验 changePsd
     */
    changePsd(e){
        if (e.target.value.indexOf("'") != -1 || e.target.value.indexOf("\"") != -1) { 
            return
        } else {
            this.setState({
                psd: e.target.value.trim().replace(/\'/g,"").replace(/\"/g,"")
            })
        }
		// this.setState({
		// 	psd: e.target.value
		// })
    }

    render(){
        return (
            <div style={{background: '#F5F5F5', height: '100%'}}>
                {/* 协议头部 */}
                <div style={{
                    display: 'flex',
                    background: '#FF3D3D',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0
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
                        padding: '44px 0 70px 0',
                        fontSize: '15px',
                        lineHeight: '52px',
                        color: '#444444'
                }}>
                    {/* 国际安全认证 */}
                    <div style={{background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #F5F5F5'}}>
                        <img src={require('../../assets/loan/shield.png')} style={{
                                display: 'block', width: '17.5px', height: '20px'
                            }} />
                        <div style={{color: '#242424', paddingLeft: '13px'}}>国际安全认证</div>
                    </div>
                    {/* 手机号 */}
                    <div style={{background: '#fff', display: 'flex', alignItems: 'center', borderBottom: '1px solid #F5F5F5', paddingLeft: '17px', height: '52px'}}>
                        <img src={require('../../assets/loan/phone.png')} style={{
                                display: 'block', width: '15px', height: '22px'
                            }} />
                        <div style={{color: '#999999', paddingLeft: '13px'}}>{this.state.telPhone}</div>
                    </div>
                    {/* 手机服务密码 */}
                    <div style={{background: '#fff', display: 'flex', alignItems: 'center', borderBottom: '1px solid #F5F5F5', padding: '0 17px', height: '52px'}}>
                        <img src={require('../../assets/loan/lock.png')} style={{
                                display: 'block', width: '15px', height: '22px'
                            }} />
                        {/* <div style={{color: '#999999', paddingLeft: '13px'}}>请输入手机服务密码</div> */}
                        <input className={styles.input} style={{textAlign: 'left'}} type="text" ref={psd => this.psd = psd} onChange={this.changePsd.bind(this)} value={this.state.psd} name="psd" placeholder="请输入手机服务密码" autoFocus/>
                    </div>
                    {/* 协议 */}
                    {/* <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px'}}>
                        <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '17px'}} onClick={this.choice.bind(this, this.state.isChoice)}>
                            <img src={ this.state.isChoice ? yChoice : nChoice} style={{
                                display: 'block', width: '13px', height: '13px'
                            }} />
                            <div style={{color: '#999999', paddingLeft: '13px'}}>同意</div>
                        </div>
                        <Link style={{color: '#FF3D3D'}} to="/loan/protocol">《用户使用协议》</Link>
                    </div> */}
                    {/* 温馨提示 */}
                    <div style={{color: '#707070', fontSize: '15px', lineHeight: '24px', padding: '0 25.5px'}}>
                        <div style={{paddingTop: '200px'}}>温馨提示：</div>
                        <div>根据网络信息安全相关条例规定，该申请需在线进行手机号码实名认证，请正确输入实名验证码。</div>
                    </div>
                </div>
                <div style={{
                    color: '#FFFFFF',
                    lineHeight: '46px',
                    textAlign: 'center',
                    background: '#F5F5F5',
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                }} onClick={this.btnClick}>
                    <div style={{
                        background: '#FF3D3D',
                        borderRadius: '23px',
                        margin: '0 17px 19.5px',
                    }}>确认</div>
                </div>
            </div>
        )

    }
}
