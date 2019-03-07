import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import styles from './bankcard.less'
import { Toast, Picker, List, WhiteSpace } from 'antd-mobile';
import { bankCardNumber, go, bankNames, judgeTelExist, loadingText, idCardReg, phoneReg, nameReg } from '../../../utils/utils';

import {connect} from 'dva';

// 获取session 中的数据
let userInfo = sessionStorage.getItem('personalInfo');
let contactInfo = sessionStorage.getItem('contactInfo');
userInfo = JSON.parse(userInfo);
contactInfo = JSON.parse(contactInfo);
@connect(({ loan }) => ({
    loan
}))
export default class BankCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bankName: null,
            bankCard: '',
            name: (userInfo && userInfo.userName) ? userInfo.userName : '',
            idCard: (userInfo && userInfo.userIdCard) ? userInfo.userIdCard : '',
            phoneNumber: sessionStorage.getItem("phoneNumber") ? sessionStorage.getItem("phoneNumber") : '',
            isChangeOne: false,
        };
        document.title='银行卡认证'
    }

    componentWillMount() {  
        judgeTelExist('/loan/index');
    }

    sure = () => {
        if (!this.state.bankName && this.state.bankName != 0) {
            Toast.info('请选择银行名称', 2, null, false);
            return
        }
        // 校验银行卡号
        if (this.state.bankCard) {
            if (!bankCardNumber(this.state.bankCard)) {
                this.bankCard.focus()
                Toast.info('银行卡号有误，请重新输入', 2, null, false);
                return
            }
        } else {
            this.bankCard.focus()
            Toast.info('请输入银行卡号', 2, null, false);
            return
        }
        // 姓名
        if (!this.state.name) {
            this.name.focus()
            Toast.info('请输入姓名', 2, null, false);
            return
        } else {
            // phoneReg nameReg
            // if('·' == this.state.name.substr(0, 1) || !nameReg.test(this.state.name)){
            //     this.name.focus()
            //     Toast.info('姓名有误，请重新输入', 2, null, false);
            //     return
            // }
            let obj = {}
            this.state.name.replace(/(\xb7)/g,function (val, key) {
                obj[key]?obj[key]++:obj[key]=1
            })
            if (obj['·'] == this.state.name.length) {
                this.name.focus()
                Toast.info('姓名有误，请重新输入', 2, null, false);
                return
            } else if(!nameReg.test(this.state.name)){
                this.name.focus()
                Toast.info('姓名有误，请重新输入', 2, null, false);
                return
            }
        }
        // 身份证号
        if (this.state.idCard) {
            // 校验身份证号
            if(!idCardReg.test(this.state.idCard)){ //正则验证不通过，格式不对
                this.idCard.focus()
                Toast.info('身份证号有误，请重新输入', 2, null, false);
                return
            }
        } else {
            this.idCard.focus()
            Toast.info('请输入身份证号', 2, null, false);
            return
        }
        // 手机号
        if (this.state.phoneNumber) {
            // 校验姓名
            if (!phoneReg.test(this.state.phoneNumber)) { // 正则验证不通过，格式不对
                this.phoneNumber.focus()
                Toast.info('手机号有误，请重新输入', 2, null, false);
                return
			}
        } else {
            this.phoneNumber.focus()
            Toast.info('请输入手机号', 2, null, false);
            return
        }
        Toast.loading('数据提交中', 0);
        const { dispatch } = this.props;
        dispatch({
            type: 'loan/postInfo',
            payload: {
                customerName: this.state.name,
                idCard: this.state.idCard,
                phone: this.state.phoneNumber,
                applyAmount: userInfo.price,
                applyPeriod: userInfo.date,
                applyExplain: '',
                bankcard: this.state.bankCard,
                bankName: this.state.bankName,
                workUnit: userInfo.workplace,
                unitTel: userInfo.workTel,
                hyzk: userInfo.marriage,
                address: userInfo.userArea,
                applyType: '1',
                contact: [
                    {
                        relation: contactInfo.rRelation,
                        contactName: contactInfo.rName,
                        contactPhone: contactInfo.rTel
                    },
                    {
                        relation: contactInfo.sRelation,
                        contactName: contactInfo.sName,
                        contactPhone: contactInfo.sTel
                    }
                ]
            },
            callback: response => {
                // console.log('关于返回信息', response)
                Toast.hide();
                if (response.success) {
                    router.push('/loan/success');
                }
            }
        })
    }

    /**
     * 银行卡号 changeBankCard
     */
    changeBankCard(e){
        let invalidChars = ['-', '+', 'e', '.', 'E'];
        if(invalidChars.indexOf(e.target.value.trim()) !== -1){
            return
        }
        this.setState({
            bankCard: e.target.value.trim()
        })
    }

    /**
     * 改变姓名 changeName
     */
    changeName(e){
        // let invalidChars = [`'`, `"`];
        // if(invalidChars.indexOf(e.target.value.trim()) == -1){
        //     return
        // }
        this.setState({
            name: e.target.value.trim()
        })
    }

    /**
     * 改变身份证号 changeIdCard
     */
    changeIdCard(e){
        // let invalidChars = ['-', '+', 'e', '.', 'E'];
        // if(invalidChars.indexOf(e.target.value.trim()) !== -1){
        //     return
        // }
		this.setState({
			idCard: e.target.value.trim()
		})
    }

    /**
     * 改变手机号 changePhoneNumber phoneNumber
     */
    changePhoneNumber(e){
		this.setState({
			phoneNumber: e.target.value.trim()
		})
    }

    render(){
        
        return (
            <Fragment>
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
                        <img src={require('../../../assets/loan/arrowLift.png')} style={{
                            display: 'block', width: '14.5px', height: '21px', margin: 'auto', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'
                            }} />
                    </div>
                    <div style={{
                        flex: 1, textAlign: 'center', lineHeight: '44px', fontSize:'18px', color: '#FFFFFF'
                    }}>
                        银行卡认证
                    </div>
                    <div style={{height: '44px', width: '44px'}}></div>
                </div>
                {/* 内容部分 */}
                <div className={styles.content}>
                    {/* 银行名称 */}
                    <div style={{borderBottom: '1px solid #F5F5F5'}} className={this.state.isChangeOne?styles.Col1:""}>
                        <Picker
                            title="请选择银行名称"
                            extra="请选择银行名称"
                            data={bankNames}
                            cols={1}
                            value={[this.state.bankName]}
                            onChange={
                                (val) => {
                                    this.setState({
                                        isChangeOne: true
                                    })
                                }
                            }
                            onOk={(val) => {
                                this.setState({
                                    bankName: val[0]
                                })
                            }}>
                            <List.Item arrow="horizontal">银行名称</List.Item>
                        </Picker>
                    </div>
                    <div className={styles.flex} style={{marginBottom: '6.5px'}}>
                        <div className={styles.left}>银行卡号</div>
                        <input className={styles.input} type="text" ref={bankCard => this.bankCard = bankCard} onChange={this.changeBankCard.bind(this)} value={this.state.bankCard} name="bankCard" placeholder="请输入银行卡号"/>
                    </div>
                    <div className={styles.flex}>
                        <div className={styles.left}>姓名</div>
                        <input maxLength="20" className={styles.input} type="text" ref={name => this.name = name} onChange={this.changeName.bind(this)} value={this.state.name} name="name" placeholder="请输入姓名" readOnly={true}/>
                    </div>
                    {/* idCard */}
                    <div className={styles.flex} style={{marginBottom: '6.5px'}}>
                        <div className={styles.left}>身份证号</div>
                        <input className={styles.input} type="text" ref={idCard => this.idCard = idCard} onChange={this.changeIdCard.bind(this)} value={this.state.idCard} name="idCard" placeholder="请输入身份证号" readOnly={true}/>
                    </div>
                    {/* changePhoneNumber phoneNumber */}
                    <div className={styles.flex}>
                        <div className={styles.left}>手机号</div>
                        <input className={styles.input} type="text" ref={phoneNumber => this.phoneNumber = phoneNumber} onChange={this.changePhoneNumber.bind(this)} value={this.state.phoneNumber} name="phoneNumber" placeholder="请输入手机号" readOnly={true}/>
                    </div>
                </div>
                {/* 确认按钮 */}
                <div className={styles.sure_btn} onClick={this.sure}>确认</div>
            </Fragment>
        )

    }
}
