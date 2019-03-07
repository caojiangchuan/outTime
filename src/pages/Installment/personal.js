import React from 'react';
import {
    Button,
    NavBar, 
    Icon,
    Toast,
    WhiteSpace,
    List,
    InputItem,
} from 'antd-mobile';
import router from 'umi/router';
import Link from 'umi/link';
import { go, judgeTelExist, nameReg, idCardReg, workTelReg } from "../../utils/utils";
import styles from './installment.less';


class Personal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customerName: '', // 姓名
            idCard: '', // 身份证号
            workUnit: '', // 工作单位
            unitTel: '', // 单位电话
            unitTelF: '', //区号
            unitTelL: '',  //固定电话
        };
        document.title='申请人信息';
    }

    componentWillMount() {  
        judgeTelExist('/installment/index');
    }

    //监听姓名输入
    changeName = (e) => {
        this.setState({
            customerName: e.target.value.trim()
        })
    }
    //监听身份证号输入
    changeIdCard = (e) => {
        this.setState({
            idCard: e.target.value.trim().toUpperCase()
        })
    }
    //监听工作单位输入
    changeWorkUnit = (e) => {     
        if (e.target.value.indexOf("'") != -1 || e.target.value.indexOf("\"") != -1) { 
            return
        } else {
            this.setState({
                workUnit: e.target.value.trim().replace(/\'/g,"").replace(/\"/g,"")
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

    //下一步
    handleNextStep = () => {
        const {customerName, idCard, workUnit, unitTel} = this.state;        
        
        if (customerName) {
            /* if('·' == customerName.substr(0, 1) || !nameReg.test(customerName)){
                Toast.info('申请人姓名有误，请重新输入', 2, null, false);
                this.customerName.focus();
                return false;
            } */
            let obj = {}
            customerName.replace(/(\xb7)/g,function (val, key) {
                obj[key]?obj[key]++:obj[key]=1
            })
            if (obj['·'] == customerName.length) {
                Toast.info('申请人姓名有误，请重新输入', 2, null, false);
                this.customerName.focus();
                return false;
            } else if(!nameReg.test(customerName)){
                Toast.info('申请人姓名有误，请重新输入', 2, null, false);
                this.customerName.focus();
                return false;
            }
        } else {
            this.customerName.focus();
            Toast.info('请输入申请人姓名', 2, null, false);
            return false;
        }

        if (idCard) {
            if(!idCardReg.test(idCard)){
                Toast.info('申请人身份证号有误，请重新输入', 2, null, false);
                this.idCard.focus();
                return false;
            }
        } else {
            this.idCard.focus()
            Toast.info('请输入申请人身份证号', 2, null, false);
            return
        }

        if('' == workUnit){
            Toast.info('请输入申请人工作单位', 2, null, false);
            this.workUnit.focus();
            return false;
        }
         

        this.setState({
            unitTel: this.state.unitTelF + '-' + this.state.unitTelL
        }, () => {
            console.log(this.state.unitTel);

            if (this.state.unitTel) {
                let one = this.state.unitTel.substring(0,1)
                if (one != '0') {
                    Toast.info('申请人单位电话有误，请重新输入', 2, null, false);
                    return
                }
                if (this.state.unitTel.indexOf("-") != -1 ) {
                    let first = this.state.unitTel.substring(0,1)
                    let second = this.state.unitTel.substring(5,6)
                    let str_before = this.state.unitTel.split('-')[0]
                    let str_after = this.state.unitTel.split('-')[1]
        
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
                    if (!workTelReg.test(this.state.unitTel)) {
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

                //验证通过操作
                sessionStorage.setItem('personalInfo', JSON.stringify(this.state));
                router.push('/installment/contact');
        });
    }

    render(){
        const {customerName, idCard, workUnit, unitTel, unitTelF, unitTelL} = this.state;
        return (
            <div className={styles.installmentLayouts}>
                <NavBar mode="light" icon={<Icon type="left" />} onLeftClick={() => go()}>申请人信息</NavBar>
                <div className={styles.content}>  
                    <div className={styles.flex}>
                        <div className={styles.left}>申请人姓名</div>
                        <input className={styles.input} type="text" name="customerName" placeholder="请输入申请人姓名" maxLength="20" value={customerName} onChange={this.changeName.bind(this)} ref={el => this.customerName = el}/>
                    </div>
                    <div className={styles.flex} style={{marginBottom: 6}}>
                        <div className={styles.left}>申请人身份证号</div>
                        <input className={styles.input} type="text" name="idCard" placeholder="请输入申请人身份证号" value={idCard} onChange={this.changeIdCard.bind(this)} ref={el => this.idCard = el}/>
                    </div>
                    <div className={styles.flex}>
                        <div className={styles.left}>申请人工作单位</div>
                        <input className={styles.input} type="text" name="workUnit" placeholder="请输入申请人工作单位" maxLength="20" value={workUnit} onChange={this.changeWorkUnit.bind(this)} ref={el => this.workUnit = el}/>
                    </div>
                    <div className={styles.flex} style={{overflow:'hidden'}}>
                        <div className={styles.left} style={{width:110}} >申请人单位电话</div>
                        <div style={{color:'rgba(153, 153, 153, 0.65)'}}>
                            <span>(</span>
                            <input type="text" className={styles.input} style={{width:48, textAlign:'center', paddingLeft:0, paddingRight:0}} name="unitTelF" placeholder="区号" value={unitTelF} onChange={this.changeUnitTelF.bind(this)} ref={el => this.unitTelF = el} maxLength={4}/>
                            <span>)</span>
                            <span>-</span>
                            <span>(</span>
                            <input type="text" className={styles.input} style={{width:80, textAlign:'center', paddingLeft:0, paddingRight:0}} name="unitTelL" placeholder="固定电话" value={unitTelL} onChange={this.changeUnitTelL.bind(this)} ref={el => this.unitTelL = el} maxLength={8}/>
                            <span>)</span>
                        </div>    
                    </div>
                </div>  
                <div className={styles.personal}>
                    <div className={styles.btnBlue} onClick={() => this.handleNextStep()}>下一步</div>
                </div>             
            </div>
        )

    }
}

export default Personal;