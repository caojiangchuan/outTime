import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import styles from './personal.less'
import { Toast, Picker, List, WhiteSpace, TextareaItem } from 'antd-mobile';
import { go, loanPrice, loanDateLine, maritalStatus, judgeTelExist, workTelReg, nameReg, idCardReg } from "../../../utils/utils";

export default class Protocol extends Component {
    constructor(props) {
        super(props);
        this.state = {
            price: null, // 借款金额,目前标识为0 1 2 3
            date: null, // 借款期限 标识同金额
            userName: '', // 姓名
            userIdCard: '', // 身份证号
            userArea: '', // 所在地区
            workplace: '', // 工作单位
            workTel: '', // 单位电话
            unitTelF: '', //区号
            unitTelL: '',  //固定电话
            marriage: null, // 婚姻状况 标识同金额
            isChangeOne: false,
            isChangeTwo: false,
            isChangeThree: false
        };
        document.title='个人信息认证'
    }

    componentWillMount() {  
        judgeTelExist('/loan/index');
    }

    /**
	 * 监控姓名的输入
	 */
	changeUserName(e){
        this.setState({
            userName: e.target.value.trim()
        })
    }

    /**
	 * 监控身份证号的输入 userIdCard
	 */
	changeIdCard(e){
		this.setState({
			userIdCard: e.target.value.trim().toUpperCase()
		})
    }

    /**
     * 所在地区 userArea changeArea workplace
     */
    changeArea(e){
        if (e.indexOf("'") != -1 || e.indexOf("\"") != -1) { 
            return
        } else {
            this.setState({
                userArea: e.trim().replace(/\'/g,"").replace(/\"/g,"")
            })
        }
    }

    /**
     * 工作单位 workplace
     */
    changePlace(e){
        if (e.target.value.indexOf("'") != -1 || e.target.value.indexOf("\"") != -1) { 
            return
        } else {
            this.setState({
                workplace: e.target.value.trim().replace(/\'/g,"").replace(/\"/g,"")
            })
        }
    }

    //监听单位电话区号输入
    changeUnitTelF = (e) => {
        this.setState({
            unitTelF: e.target.value.trim()
        })
    }

    //监听单位电话输入
    changeUnitTelL = (e) => {
        this.setState({
            unitTelL: e.target.value.trim()
        })
    }

    sure = () => {
        // 借款金额
        if (!this.state.price && this.state.price != 0) {
            Toast.info('请选择借款金额', 2, null, false);
            return
        }
        // 借款期限
        if (!this.state.date && this.state.date != 0) {
            Toast.info('请选择借款期限', 2, null, false);
            return
        }
        // 姓名 nameReg
        if (this.state.userName) {
            // if('·' == this.state.userName.substr(0, 1) || !nameReg.test(this.state.userName)){
            //     this.userName.focus()
            //     Toast.info('姓名有误，请重新输入', 2, null, false);
            //     return
            // }
            let obj = {}
            this.state.userName.replace(/(\xb7)/g,function (val, key) {
                obj[key]?obj[key]++:obj[key]=1
            })
            if (obj['·'] == this.state.userName.length) {
                this.userName.focus()
                Toast.info('姓名有误，请重新输入', 2, null, false);
                return
            } else if(!nameReg.test(this.state.userName)){
                this.userName.focus()
                Toast.info('姓名有误，请重新输入', 2, null, false);
                return
            }
        } else {
            this.userName.focus()
            Toast.info('请输入姓名', 2, null, false);
            return
        }
        // 身份证号 idCardReg
        if (this.state.userIdCard) {
            if (!idCardReg.test(this.state.userIdCard)) {
                this.userIdCard.focus()
                Toast.info('身份证号有误，请重新输入', 2, null, false);
                return
            }
        } else {
            this.userIdCard.focus()
            Toast.info('请输入身份证号', 2, null, false);
            return
        }
        // 所在地区
        if (!this.state.userArea) {
            this.userArea.focus()
            Toast.info('请输入所在地区', 2, null, false);
            return
        }
        // 工作单位 workplace
        if (!this.state.workplace) {
            this.workplace.focus()
            Toast.info('请输入工作单位', 2, null, false);
            return
        }

        this.setState({
            workTel: this.state.unitTelF + '-' + this.state.unitTelL
        }, () => {
            console.log(this.state.workTel);

            if (this.state.workTel) {
                let one = this.state.workTel.substring(0,1)
                if (one != '0') {
                    Toast.info('申请人单位电话有误，请重新输入', 2, null, false);
                    return
                }
                if (this.state.workTel.indexOf("-") != -1 ) {
                    let first = this.state.workTel.substring(0,1)
                    let second = this.state.workTel.substring(5,6)
                    let str_before = this.state.workTel.split('-')[0]
                    let str_after = this.state.workTel.split('-')[1]
        
                    let obj = {}
                    var str1 = str_before.split('').sort().join('');
                    for(var i = 0, len = str1.length; i < len; i++){
                        obj[str1[i]] = str1.lastIndexOf(str1[i])-i+1;
                        i = str1.lastIndexOf(str1[i]);
                    }
                    let obj1 = {}
                    var str2 = str_after.split('').sort().join('');
                    for(var i = 0, len = str2.length; i < len; i++){
                        obj1[str2[i]] = str2.lastIndexOf(str2[i])-i+1;
                        i = str2.lastIndexOf(str2[i]);
                    }
                    if (!workTelReg.test(this.state.workTel)) {
                        if (obj[first] == str_before.length) {
                            Toast.info('申请人单位电话有误，请重新输入', 2, null, false);
                            return
                        } else if (obj1[second] == str_after.length) {
                            Toast.info('申请人单位电话有误，请重新输入', 2, null, false);
                            return
                        } else if (obj[first] == str_before.length && obj1[second] == str_after.length) {
                            Toast.info('申请人单位电话有误，请重新输入', 2, null, false);
                            return
                        } else {
                            Toast.info('申请人单位电话有误，请重新输入', 2, null, false);
                            return
                        }
                    } else {
                        if (obj[first] == str_before.length) {
                            Toast.info('申请人单位电话有误，请重新输入', 2, null, false);
                            return
                        } else if (obj1[second] == str_after.length) {
                            Toast.info('申请人单位电话有误，请重新输入', 2, null, false);
                            return
                        } else if (obj[first] == str_before.length && obj1[second] == str_after.length) {
                            Toast.info('申请人单位电话有误，请重新输入', 2, null, false);
                            return
                        } else {
                        }
                    }
                } else {
                    Toast.info('申请人单位电话有误，请重新输入', 2, null, false);
                    return
                }
            }

            // 借款金额
            if (!this.state.marriage && this.state.marriage != 0) {
                Toast.info('请选择婚姻状况', 2, null, false);
                return
            }
            sessionStorage.setItem('personalInfo', JSON.stringify(this.state));
            router.push('/loan/contact');
        });

        
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
                    zIndex: 1
                    }}>
                    <div style={{height: '44px', width: '44px', position: 'relative'}} onClick={() => go()}>
                        <img src={require('../../../assets/loan/arrowLift.png')} style={{
                            display: 'block', width: '14.5px', height: '21px', margin: 'auto', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'
                            }} />
                    </div>
                    <div style={{
                        flex: 1, textAlign: 'center', lineHeight: '44px', fontSize:'18px', color: '#FFFFFF'
                    }}>
                        个人信息认证
                    </div>
                    <div style={{height: '44px', width: '44px'}}></div>
                </div>
                {/* 内容部分 */}
                {/* 借款金额 */}
                <div className={styles.content}>
                    {/* 借款金额 */}
                    <div style={{borderBottom: '1px solid #F5F5F5'}} className={this.state.isChangeOne?styles.Col1:""}>
                        <Picker
                            extra="请选择借款金额"
                            title="请选择借款金额"
                            data={loanPrice}
                            cols={1}
                            value={[this.state.price]}
                            onChange={
                                (val) => {
                                    this.setState({
                                        isChangeOne: true
                                    })
                                }
                            }
                            onOk={(val) => {
                                this.setState({
                                    price: val[0]
                                })
                            }}>
                            <List.Item arrow="horizontal">借款金额</List.Item>
                        </Picker>
                    </div>
                    {/* 借款期限 */}
                    <div style={{marginBottom: '6.5px'}} className={this.state.isChangeTwo?styles.Col2:""}>
                        <Picker
                            extra="请选择借款期限"
                            title="请选择借款期限"
                            data={loanDateLine}
                            cols={1}
                            value={[this.state.date]}
                            onChange={
                                (val) => {
                                    this.setState({
                                        isChangeTwo: true
                                    })
                                }
                            }
                            onOk={(val) => {
                                this.setState({
                                    date: val[0]
                                })
                            }}>
                            <List.Item arrow="horizontal">借款期限</List.Item>
                        </Picker>
                    </div>
                    {/*  */}
                    <div className={styles.flex}>
                        <div className={styles.left}>姓名</div>
                        <input maxLength="20" className={styles.input} ref={userName => this.userName = userName} type="text" onChange={this.changeUserName.bind(this)} value={this.state.userName} name="userName" placeholder="请输入姓名"/>
                    </div>
                    <div className={styles.flex}>
                        <div className={styles.left}>身份证号</div>
                        <input className={styles.input} type="text" ref={userIdCard => this.userIdCard = userIdCard} onChange={this.changeIdCard.bind(this)} value={this.state.userIdCard} name="userIdCard" placeholder="请输入身份证号"/>
                    </div>
                    <TextareaItem
                        title="所在地区"
                        placeholder="请输入所在地区"
                        data-seed="logId"
                        ref={userArea => this.userArea = userArea}
                        autoHeight
                        count={50}
                        value={this.state.userArea}
                        onChange={this.changeArea.bind(this)}
                    />
                    {/*  */}
                    <div className={styles.flex} style={{marginTop: '6.5px'}}>
                        <div className={styles.left}>工作单位</div>
                        <input maxLength="20" className={styles.input} type="text" ref={workplace => this.workplace = workplace} onChange={this.changePlace.bind(this)} value={this.state.workplace} name="workplace" placeholder="请输入工作单位"/>
                    </div>
                    <div className={styles.flex} style={{overflow:'hidden'}}>
                        <div className={styles.left} style={{width:110}} >单位电话</div>
                        <div style={{color:'rgba(153, 153, 153, 0.65)'}}>
                            <span>(</span>
                            <input type="text" className={styles.input} style={{width:48, textAlign:'center', paddingLeft:0, paddingRight:0}} name="unitTelF" placeholder="区号" value={this.state.unitTelF} onChange={this.changeUnitTelF.bind(this)} ref={el => this.unitTelF = el} maxLength={4}/>
                            <span>)</span>
                            <span>-</span>
                            <span>(</span>
                            <input type="text" className={styles.input} style={{width:80, textAlign:'center', paddingLeft:0, paddingRight:0}} name="unitTelL" placeholder="固定电话" value={this.state.unitTelL} onChange={this.changeUnitTelL.bind(this)} ref={el => this.unitTelL = el} maxLength={8}/>
                            <span>)</span>
                        </div>   
                    </div>    
                    {/* 婚姻状况 */}
                    <div style={{marginBottom: '6.5px'}} className={this.state.isChangeThree?styles.Col3:""}>
                        <Picker
                            title="请选择婚姻状况"
                            extra="请选择婚姻状况"
                            data={maritalStatus}
                            cols={1}
                            value={[this.state.marriage]}
                            onChange={
                                (val) => {
                                    this.setState({
                                        isChangeThree: true
                                    })
                                }
                            }
                            onOk={(val) => {
                                this.setState({
                                    marriage: val[0]
                                })
                            }}>
                            <List.Item arrow="horizontal">婚姻状况</List.Item>
                        </Picker>
                    </div>
                </div>
                {/* 确认按钮 */}
                <div className={styles.sure_btn} onClick={this.sure}>确认</div>
            </Fragment>
        )

    }
}
