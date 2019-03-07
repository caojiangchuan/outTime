import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import styles from './contact.less'
import { Toast, Picker, List, WhiteSpace } from 'antd-mobile';
import { go, contactParent, contactAll, judgeTelExist, loadingText, nameReg, phoneReg } from "../../../utils/utils";
import {connect} from 'dva';
// 获取session 中的数据
let userInfo = sessionStorage.getItem('personalInfo');
userInfo = JSON.parse(userInfo);
@connect(({ loan }) => ({
    loan
}))
export default class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rRelation: null,
            rName: '',
            rTel: '',
            sRelation: null,
            sName: '',
            sTel: '',
            isChangeOne: false,
            isChangeTwo: false,
            carrier: null
        };
        document.title='联系人信息'
    }

    componentDidMount () {
        if(null!= userInfo){
            Toast.loading(loadingText, 0);
            const { dispatch } = this.props;
            dispatch({
                type: 'loan/getMCarrier',
                payload: {
                    idCard: userInfo.userIdCard,
                    name: userInfo.userName,
                    mobile: sessionStorage.getItem("phoneNumber")
                },
                callback: response => {
                    // console.log('关于返回信息', response)
                    Toast.hide();
                    if (response && response.data) {
                        if (response.data.code === '000000') {
                            this.setState({
                                carrier: response.data.carrier
                            })
                        }
                    } else{
                        if(response.message != '征信库已存在华征手机通话详单数据且没有过期'){
                            Toast.info(response.message, 2, null, false);
                            return false;
                        }
                    }
                }
            })
        }
    }

    componentWillMount() {  
        judgeTelExist('/loan/index');
    }

    sure = () => {
        // Toast.info('请填写', 2, null, false);
        if (!this.state.rRelation && this.state.rRelation != 0) {
            Toast.info('请选择亲属联系人关系', 2, null, false);
            return
        }
        // 亲属联系人姓名 nameReg
        if (this.state.rName) {
            let obj = {}
            this.state.rName.replace(/(\xb7)/g,function (val, key) {
                obj[key]?obj[key]++:obj[key]=1
            })
            if (obj['·'] == this.state.rName.length) {
                this.rName.focus()
                Toast.info('亲属联系人姓名有误，请重新输入', 2, null, false);
                return
            } else if(!nameReg.test(this.state.rName)){
                this.rName.focus()
                Toast.info('亲属联系人姓名有误，请重新输入', 2, null, false);
                return
            }
        } else {
            this.rName.focus()
            Toast.info('请输入亲属联系人姓名', 2, null, false);
            return
        }
        // 亲属联系人手机号 phoneReg
        if (this.state.rTel) {
            if (!phoneReg.test(this.state.rTel)) {
                this.rTel.focus()
                Toast.info('亲属联系人手机号有误，请重新输入', 2, null, false);
                return
            }
        } else {
            this.rTel.focus()
            Toast.info('请输入亲属联系人手机号', 2, null, false);
            return
        }

        /**
         * 选填组
         */
        // 选择了关系
        if (this.state.sRelation) {
            if (this.state.sName) {
                let obj = {}
                this.state.sName.replace(/(\xb7)/g,function (val, key) {
                    obj[key]?obj[key]++:obj[key]=1
                })
                if (obj['·'] == this.state.sName.length) {
                    this.sName.focus()
                    Toast.info('选填联系人姓名有误，请重新输入', 2, null, false);
                    return
                } else if(!nameReg.test(this.state.sName)){
                    this.sName.focus()
                    Toast.info('选填联系人姓名有误，请重新输入', 2, null, false);
                    return
                }
            } else {
                this.sName.focus()
                Toast.info('请输入选填联系人姓名', 2, null, false);
                return
            }
            // 联系人手机号 phoneReg
            if (this.state.sTel) {
                if (!phoneReg.test(this.state.sTel)) {
                    this.sTel.focus()
                    Toast.info('选填联系人手机号有误，请重新输入', 2, null, false);
                    return
                }
            } else {
                this.sTel.focus()
                Toast.info('请输入选填联系人手机号', 2, null, false);
                return
            }
        }
        // 选填姓名 -- 填写姓名
        if (this.state.sName) {
            if (!this.state.sRelation && this.state.sRelation != 0) {
                Toast.info('请选择选填联系人关系', 2, null, false);
                return
            }
            let obj = {}
            this.state.sName.replace(/(\xb7)/g,function (val, key) {
                obj[key]?obj[key]++:obj[key]=1
            })
            if (obj['·'] == this.state.sName.length) {
                this.sName.focus()
                Toast.info('选填联系人姓名有误，请重新输入', 2, null, false);
                return
            } else if(!nameReg.test(this.state.sName)){
                this.sName.focus()
                Toast.info('选填联系人姓名有误，请重新输入', 2, null, false);
                return
            }
            // 联系人手机号 phoneReg
            if (this.state.sTel) {
                if (!phoneReg.test(this.state.sTel)) {
                    this.sTel.focus()
                    Toast.info('选填联系人手机号有误，请重新输入', 2, null, false);
                    return
                }
            } else {
                this.sTel.focus()
                Toast.info('请输入选填联系人手机号', 2, null, false);
                return
            }
        }
        // 选填手机号
        if (this.state.sTel) {
            if (!this.state.sRelation && this.state.sRelation != 0) {
                Toast.info('请选择选填联系人关系', 2, null, false);
                return
            }
            if (this.state.sName) {
                let obj = {}
                this.state.sName.replace(/(\xb7)/g,function (val, key) {
                    obj[key]?obj[key]++:obj[key]=1
                })
                if (obj['·'] == this.state.sName.length) {
                    this.sName.focus()
                    Toast.info('选填联系人姓名有误，请重新输入', 2, null, false);
                    return
                } else if(!nameReg.test(this.state.sName)){
                    this.sName.focus()
                    Toast.info('选填联系人姓名有误，请重新输入', 2, null, false);
                    return
                }
            } else {
                this.sName.focus()
                Toast.info('请输入选填联系人姓名', 2, null, false);
                return
            }
            if (!phoneReg.test(this.state.sTel)) {
                this.sTel.focus()
                Toast.info('选填联系人手机号有误，请重新输入', 2, null, false);
                return
            }
        }
        // 跳转到下个页面
        if (this.state.carrier) {
            router.push('/loan/cellphone');
        } else {
            router.push('/loan/bankcard');
        }
        // 选填
        console.log(this.state, '所有数据')
        sessionStorage.setItem('contactInfo', JSON.stringify(this.state));
    }

    /**
     * 亲属联系人 changeRName
     */
    changeRName(e){
        this.setState({
            rName: e.target.value.trim()
        })
    }

    changeSName(e){
        this.setState({
            sName: e.target.value.trim()
        })
    }
    // 手机号
    changeRTel(e){
		this.setState({
			rTel: e.target.value.trim()
		})
    }

    changeSTel(e){
		this.setState({
			sTel: e.target.value.trim()
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
                        联系人信息
                    </div>
                    <div style={{height: '44px', width: '44px'}}></div>
                </div>
                {/* 内容部分 */}
                {/* 借款金额 */}
                <div className={styles.content}>
                    <div className={styles.top_flex}>
                        <div style={{
                            width: '4px',
                            height: '16.5px',
                            background: 'rgba(255,61,61,1)',
                            margin: 'auto 0'
                        }}></div>
                        <div style={{textIndent: '5.5px'}}>亲属联系人</div>
                    </div>
                    {/* 关系 */}
                    <div style={{borderBottom: '1px solid #F5F5F5'}} className={this.state.isChangeOne?styles.Col1:""}>
                        <Picker
                            extra="请选择联系人关系"
                            title="请选择联系人关系"
                            data={contactParent}
                            cols={1}
                            value={[this.state.rRelation]}
                            onChange={
                                (val) => {
                                    this.setState({
                                        isChangeOne: true
                                    })
                                }
                            }
                            onOk={(val) => {
                                this.setState({
                                    rRelation: val[0]
                                }, () => {
                                    console.log('点击了确定按钮', val, this.state)
                                })
                            }}>
                            <List.Item arrow="horizontal">关系</List.Item>
                        </Picker>
                    </div>
                    <div className={styles.flex}>
                        <div className={styles.left}>姓名</div>
                        <input maxLength="20" className={styles.input} type="text" ref={rName => this.rName = rName} onChange={this.changeRName.bind(this)} value={this.state.rName} name="rName" placeholder="请输入联系人姓名"/>
                    </div>
                    <div className={styles.flex} style={{marginBottom: '6.5px'}}>
                        <div className={styles.left}>手机号</div>
                        <input className={styles.input} type="tel" ref={rTel => this.rTel = rTel} onChange={this.changeRTel.bind(this)} value={this.state.rTel} name="rTel" placeholder="请输入联系人手机号"/>
                    </div>
                    {/*  */}
                    <div className={styles.top_flex}>
                        <div style={{
                            width: '4px',
                            height: '16.5px',
                            background: 'rgba(255,61,61,1)',
                            margin: 'auto 0'
                        }}></div>
                        <div style={{textIndent: '5.5px'}}>选填联系人（填写越多通过率越高哦~）</div>
                    </div>
                    {/* <div className={styles.flex}>
                        <div className={styles.left}>关系</div>
                        <div className={styles.right}>请输入姓名</div>
                    </div> */}
                    <div style={{borderBottom: '1px solid #F5F5F5'}} className={this.state.isChangeTwo?styles.Col2:""}>
                        <Picker
                            extra="请选择联系人关系"
                            title="请选择联系人关系"
                            data={contactAll}
                            cols={1}
                            value={[this.state.sRelation]}
                            onChange={
                                (val) => {
                                    this.setState({
                                        isChangeTwo: true
                                    })
                                }
                            }
                            onOk={(val) => {
                                this.setState({
                                    sRelation: val[0]
                                }, () => {
                                    console.log('点击了确定按钮', val, this.state)
                                })
                            }}>
                            <List.Item arrow="horizontal">关系</List.Item>
                        </Picker>
                    </div>
                    <div className={styles.flex}>
                        <div className={styles.left}>姓名</div>
                        {/* <div className={styles.right}>请输入联系人姓名</div> */}
                        <input maxLength="20" className={styles.input} type="text" ref={sName => this.sName = sName} onChange={this.changeSName.bind(this)} value={this.state.sName} name="sName" placeholder="请输入联系人姓名"/>
                    </div>
                    <div className={styles.flex} style={{marginBottom: '6.5px'}}>
                        <div className={styles.left}>手机号</div>
                        {/* <div className={styles.right}>请输入联系人手机号</div> */}
                        <input className={styles.input} type="tel" ref={sTel => this.sTel = sTel} onChange={this.changeSTel.bind(this)} value={this.state.sTel} name="sTel" placeholder="请输入联系人手机号"/>
                    </div>
                </div>
                {/* 确认按钮 */}
                <div className={styles.sure_btn} onClick={this.sure}>确认</div>
            </Fragment>
        )

    }
}
