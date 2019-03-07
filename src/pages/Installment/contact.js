import React from 'react';
import { connect } from 'dva';
import {
    Button,
    NavBar, 
    Icon,
    Toast,
    List,
    InputItem,
    Picker,
} from 'antd-mobile';
import router from 'umi/router';
import Link from 'umi/link';
import { go, contactParent, contactAll, judgeTelExist, loadingText, nameReg, phoneReg } from "../../utils/utils";
import styles from './installment.less';

// 获取session 中的数据
let userInfo = sessionStorage.getItem('personalInfo');
userInfo = JSON.parse(userInfo);

@connect(({ installment }) => ({
    installment
}))
class Contact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contactRelationParent: '',  // 亲属联系人-关系
            contactNameParent: '',  // 亲属联系人-姓名
            contactPhoneParent: '',  // 亲属联系人-手机号
            contactRelation: '',  // 联系人-关系
            contactName: '',   // 联系人-姓名
            contactPhone: '',  // 联系人-手机号
            showUp: false,
            isValueParent: false,   // 亲属联系人有选中值
            isValue: false,  // 联系人有选中值
            carrier: null  // 手机归属地
        };
        document.title='联系人信息';
    }
 
    componentWillMount() {  
        judgeTelExist('/installment/index');
    }
    
    componentDidMount(){
        if(null!= userInfo){
            this.getMCarrier();
        }
    }

    // 查询手机号是否查询过通话详单
    getMCarrier = () => {
        Toast.loading(loadingText, 0);

        const { dispatch } = this.props;
        dispatch({
            type: 'installment/getMCarrier',
            payload: {
                idCard: userInfo.idCard,
                name: userInfo.customerName,
                mobile: sessionStorage.getItem("phoneNumber")
            },
            callback: response => {
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

    //监听亲属联系人姓名输入
    changeNameParent = (e) => {
        this.setState({
            contactNameParent: e.target.value.trim()
        });
    }
    //监听亲属联系人手机号输入
    changePhoneParent = (e) => {
        this.setState({
            contactPhoneParent: e.target.value.trim()
        });
    }
    //监听联系人姓名输入
    changeName = (e) => {
        this.setState({
            contactName: e.target.value.trim()
        });
    }
    //监听联系人手机号输入
    changePhone = (e) => {
        this.setState({
            contactPhone: e.target.value.trim()
        });
    }

    //下一步
    handleNextStep = () => {
        const {contactRelationParent, contactNameParent, contactPhoneParent, contactRelation, contactName, contactPhone, carrier} = this.state;     

        if('' == contactRelationParent){
            Toast.info('请选择亲属联系人关系', 2, null, false);
            return false;
        }        
        
        if (contactNameParent) {
            /* if('·' == contactNameParent.substr(0, 1) || !nameReg.test(contactNameParent)){
                Toast.info('亲属联系人姓名有误，请重新输入', 2, null, false);
                this.contactNameParent.focus();
                return false;
            } */
            let obj = {}
            contactNameParent.replace(/(\xb7)/g,function (val, key) {
                obj[key]?obj[key]++:obj[key]=1
            })
            if (obj['·'] == contactNameParent.length) {
                Toast.info('亲属联系人姓名有误，请重新输入', 2, null, false);
                this.contactNameParent.focus();
                return false;
            } else if(!nameReg.test(contactNameParent)){
                Toast.info('亲属联系人姓名有误，请重新输入', 2, null, false);
                this.contactNameParent.focus();
                return false;
            }
        } else {
            this.contactNameParent.focus();
            Toast.info('请输入亲属联系人姓名', 2, null, false);
            return false;
        }

        if (contactPhoneParent) {
            if(!phoneReg.test(contactPhoneParent)){
                Toast.info('亲属联系人手机号有误，请重新输入', 2, null, false);
                this.contactPhoneParent.focus();
                return false;
            }   
        } else {
            this.contactPhoneParent.focus();
            Toast.info('请输入亲属联系人手机号', 2, null, false);
            return false;
        }

        if('' == contactRelation){
            Toast.info('请选择联系人关系', 2, null, false);
            return false;
        }    
        
        if (contactName) {
            /* if('·' == contactName.substr(0, 1) || !nameReg.test(contactName)){
                Toast.info('联系人姓名有误，请重新输入', 2, null, false);
                this.contactName.focus();
                return false;
            } */
            let obj = {}
            contactName.replace(/(\xb7)/g,function (val, key) {
                obj[key]?obj[key]++:obj[key]=1
            })
            if (obj['·'] == contactName.length) {
                Toast.info('联系人姓名有误，请重新输入', 2, null, false);
                this.contactName.focus();
                return false;
            } else if(!nameReg.test(contactName)){
                Toast.info('联系人姓名有误，请重新输入', 2, null, false);
                this.contactName.focus();
                return false;
            }
        } else {
            this.contactName.focus();
            Toast.info('请输入联系人姓名', 2, null, false);
            return false;
        }

        if (contactPhone) {
            if(!phoneReg.test(contactPhone)){
                Toast.info('联系人手机号有误，请重新输入', 2, null, false);
                this.contactPhone.focus();
                return false;
            }
        } else {
            this.contactPhone.focus();
            Toast.info('请输入联系人手机号', 2, null, false);
            return false;
        }    
        
        //验证通过操作
        console.log(this.state);
        let contact = [
            { relation: contactRelationParent, contactName: contactNameParent, contactPhone: contactPhoneParent },
            { relation: contactRelation, contactName: contactName, contactPhone: contactPhone }
        ];
        console.log(contact);
        sessionStorage.setItem('contactInfo', JSON.stringify(contact));
        sessionStorage.setItem('carrier', carrier);
        // 根据手机号归属地跳转页面
        if (carrier) {
            router.push('/installment/cellphone');
        } else {
            router.push('/installment/applyInfo');
        }
    }

    render(){
        const {contactRelationParent, contactNameParent, contactPhoneParent, contactRelation, contactName, contactPhone, showUp, isValueParent, isValue} = this.state;
        return (
            <div className={styles.installmentLayouts}>
                <NavBar mode="light" icon={<Icon type="left" />} onLeftClick={() => go()}>联系人信息</NavBar>
                <div className={styles.content}>  
                    <div className={styles.listTitle}>亲属联系人</div>
                    <div className={isValueParent? styles.upPicker : ''} style={{borderBottom: '1px solid #F5F5F5'}}>
                        <Picker
                            extra='请选择联系人关系'
                            title='请选择联系人关系'
                            data={contactParent}
                            cols={1}
                            value={[contactRelationParent]}
                            onChange={(val) => {
                                this.setState({
                                    isValueParent: true
                                })
                            }}
                            onOk={(val) => {
                                this.setState({
                                    contactRelationParent: val[0]
                                })
                            }}>
                            <List.Item arrow="horizontal"><div style={{fontSize: '15px'}}>关系</div></List.Item>
                        </Picker>
                    </div>
                    <div className={styles.flex}>
                        <div className={styles.left}>姓名</div>
                        <input className={styles.input} type="text" name="contactNameps" placeholder="请输入联系人姓名" maxLength="20" value={contactNameParent} onChange={this.changeNameParent.bind(this)} ref={el => this.contactNameParent = el}/>
                    </div>
                    <div className={styles.flex} style={{marginBottom: 6}}>
                        <div className={styles.left}>手机号</div>
                        <input className={styles.input} type="text" name="contactPhoneps" placeholder="请输入联系人手机号" value={contactPhoneParent} onChange={this.changePhoneParent.bind(this)} ref={el => this.contactPhoneParent= el}/>
                    </div>

                    <div className={styles.listTitle}>联系人</div>
                    <div className={isValue? styles.upPicker : ''} style={{borderBottom: '1px solid #F5F5F5'}}>
                        <Picker
                            extra='请选择联系人关系'
                            title='请选择联系人关系'
                            data={contactAll}
                            cols={1}
                            value={[contactRelation]}
                            onChange={(val) => {
                                this.setState({
                                    isValue: true
                                })
                            }}
                            onOk={(val) => {
                                this.setState({
                                    contactRelation: val[0]
                                })
                            }}> 
                            <List.Item arrow="horizontal"><div style={{fontSize: '15px'}}>关系</div></List.Item>
                        </Picker>
                    </div>
                    <div className={styles.flex}>
                        <div className={styles.left}>姓名</div>
                        <input className={styles.input} type="text" name="contactName" placeholder="请输入联系人姓名" maxLength="20" value={contactName} onChange={this.changeName.bind(this)} ref={el => this.contactName = el}/>
                    </div>
                    <div className={styles.flex} style={{marginBottom: 6}}>
                        <div className={styles.left}>手机号</div>
                        <input className={styles.input} type="text" name="contactPhone" placeholder="请输入联系人手机号" value={contactPhone} onChange={this.changePhone.bind(this)} ref={el => this.contactPhone = el}/>
                    </div>
                    <div className={styles.line}></div>
                </div>
                <div className={styles.personal}>
                    <div className={styles.btnBlue} onClick={() => this.handleNextStep()}>下一步</div>
                </div>            
            </div>
        )

    }
}

export default Contact;