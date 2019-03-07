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
import { go, judgeTelExist, singleCode, doubleCode, noCode, needIdCard, loadingText } from "../../utils/utils";
import styles from './minus.less';

import iconNChoice from '../../assets/minus/n-choice.png';
import iconYChoice from '../../assets/minus/y-choice.png';
import iconShield from '../../assets/minus/shield.png';
import iconPhone from '../../assets/minus/phone.png';
import iconLock from '../../assets/minus/lock.png';

// 获取session 中的数据
let userInfo = sessionStorage.getItem('personalInfoM');
userInfo = JSON.parse(userInfo); // 个人信息
let carrier = sessionStorage.getItem('carrierM');

@connect(({ minus }) => ({
    minus
}))
class CellPhone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tel: sessionStorage.getItem("phoneNumberM") ? sessionStorage.getItem("phoneNumberM") : '',
            checkStatus: true,   //协议勾选状态
            servicePassword: ''  // 手机服务密码
        };
        document.title='手机号认证';
    }

    componentWillMount() {  
        judgeTelExist('/minus/index', 1);
    }

    // 监听手机服务密码输入
    changeServicePassword(e){
        if (e.target.value.indexOf("'") != -1 || e.target.value.indexOf("\"") != -1) { 
            return
        } else {
            this.setState({
                servicePassword: e.target.value.trim().replace(/\'/g,"").replace(/\"/g,"")
            })
        }
    }

    // 勾选协议状态
    /* handleCheck = ()=>{
        const { checkStatus } = this.state;
        this.setState({
            checkStatus: !checkStatus
        })
    } */

    // 确认
    btnClick = () => {
        const { tel, checkStatus, servicePassword } = this.state;

        if (!servicePassword){
            this.servicePassword.focus()
            Toast.info('请输入手机服务密码', 2, null, false);
            return false;
        }
        /* if (!checkStatus) {
            Toast.info('请勾选协议', 2, null, false);
            return false;
        } */

        if (sessionStorage.getItem("carrierM") === '吉林电信') {
            router.push('/minus/cellphonecode')
            return
        }

        let params = {
            idCard: userInfo.idCard,
            name: userInfo.customerName,
            mobile: tel,
            servicePassword: servicePassword,
            verifyCode: null
        }

        this.getMInfo(params);
    }

    getMInfo = (params) => {
        Toast.loading(loadingText, 0);

        const { dispatch } = this.props;
        dispatch({
            type: 'minus/getMInfo',
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
                        this.postApplyInfo();
                } else {
                    let countCode = {
                        servicePassword: this.state.servicePassword,
                        token: response.data.token
                    }
                    if (response.data && response.data.code === '0001') {
                        router.push('/minus/cellphonecode')
                    } else if (response.data && response.data.code=='1109') {
                        Toast.info(response.message, 2, null, false);
                        return
                    } else {
                        Toast.info(response.message, 2, null, false);
                        return
                    }
                    sessionStorage.setItem('countCodeM', JSON.stringify(countCode));
                }
            }
        })
    }
    
    //提交申请信息
    postApplyInfo = () => {
        let params = {};
        params.customerName = userInfo.customerName;
        params.idCard = userInfo.idCard;
        params.phone = sessionStorage.getItem("phoneNumberM");
        params.applyExplain = this.state.info;
        params.applyType = 3; //减免申请
        console.log(params);
        
        Toast.loading('数据提交中', 0);
        const { dispatch } = this.props;
        dispatch({
            type: 'minus/postInfo',
            payload: params,
            callback: response => {
                Toast.hide();
                if (response && response.data) {
                    if (response.data.code === '000000') {
                        router.push('/minus/success');
                    }                     
                } else{
                    Toast.info(response.message, 2, null, false);
                    return false;
                }
            }
        })
    }

    render(){
        const { tel, checkStatus, servicePassword } = this.state;

        return (
            <div className={styles.minusLayouts}>
                <NavBar mode="light" icon={<Icon type="left" />} onLeftClick={() => go()}>手机号认证</NavBar>
                <div className={styles.infoPhone}>
                    <div className={styles.infoPhoneTitle}>
                        <img src={iconShield} className={styles.iconShield} />
                        <div className={styles.infoPhoneText}>国际安全认证</div>
                    </div>
                    <div className={styles.phoneNumber}>
                        <img src={iconPhone} className={styles.iconPhone} />
                        <div className={styles.phoneNumberText}>{tel}</div>
                    </div>
                    <div className={styles.psdNumber}>
                        <img src={iconLock} className={styles.iconLock} />
                        <input className={styles.input} style={{textAlign: 'left'}} type="text" ref={servicePassword => this.servicePassword = servicePassword} onChange={this.changeServicePassword.bind(this)} value={servicePassword} name="servicePassword" placeholder="请输入手机服务密码" autoFocus/>
                    </div>
                    {/* <div className={styles.agreementsPhone}>
                        <span onClick={() => this.handleCheck()}><img src={ checkStatus ? iconYChoice : iconNChoice } />同意</span>
                        <span><Link to="/minus/protocol" className={styles.purple}>《用户使用协议》</Link></span>
                    </div> */}
                    <div className={styles.CellPhonePs}>
                        <div>温馨提示：</div>
                        <div>根据网络信息安全相关条例规定，该申请需在线</div>
                        <div>进行手机号码实名认证，请正确输入实名验证码。</div>
                    </div>
                </div>
                <div className={styles.personal}>
                    <div className={styles.btnPurple} onClick={() => this.btnClick()}>确认</div>
                </div>                
            </div>
        )

    }
}

export default CellPhone;