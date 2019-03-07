import React from 'react';
import { connect } from 'dva';
import {
    Button,
    NavBar, 
    Icon,
    Toast,
    WhiteSpace,
    List,
    InputItem,
    TextareaItem
} from 'antd-mobile';
import router from 'umi/router';
import Link from 'umi/link';
import { go, judgeTelExist, loadingText, nameReg, idCardReg } from "../../utils/utils";
import styles from './minus.less';

@connect(({ minus }) => ({
    minus
}))
class Personal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customerName: '', // 姓名
            idCard: '', // 身份证号
            applyExplain: '', // 申请说明
            carrier: null  // 手机归属地
        }
        document.title='减免申请';
    }

    componentWillMount() {  
        judgeTelExist('/minus/index', 1);
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
    //监听减免说明输入
    changeApplyExplain = (value) => {
        if (value.indexOf("'") != -1 || value.indexOf("\"") != -1) { 
            return
        } else {
            this.setState({
                applyExplain: value.trim().replace(/\'/g,"").replace(/\"/g,"")
            })
        }
    }

    //下一步
    handleNextStep = () => {
        const {customerName, idCard, applyExplain, carrier} = this.state;        
        
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
            return false;
        }
        
        if('' == applyExplain){
            Toast.info('请输入减免说明', 2, null, false);
            this.applyExplain.focus();
            return false;
        }
        
        //验证通过操作
        let personal = {
            customerName: customerName, idCard: idCard, applyExplain: applyExplain
        }
        sessionStorage.setItem('personalInfoM', JSON.stringify(personal));

        Toast.loading(loadingText, 0);
        // 查询手机号是否查询过通话详单
        const { dispatch } = this.props;

        dispatch({
            type: 'minus/getMCarrier',
            payload: {
                idCard: idCard,
                name: customerName,
                mobile: sessionStorage.getItem("phoneNumberM")
            },
            callback: response => {
                Toast.hide();
                if (response && response.data) {
                    if (response.data.code === '000000') {
                        console.log(response.data.carrier);
                        this.setState({
                            carrier: response.data.carrier
                        },() =>{
                            sessionStorage.setItem('carrierM', this.state.carrier);
                            // 根据手机号归属地跳转页面
                            if (this.state.carrier) {
                                router.push('/minus/cellphone');
                            } else {
                                this.postApplyInfo();
                            }
                        }) 
                    }                     
                } else{
                    if(response.message != '征信库已存在华征手机通话详单数据且没有过期'){
                        Toast.info(response.message, 2, null, false);
                        setTimeout(
                            () => { 
                                this.postApplyInfo();
                            },
                            2000
                        );
                        return false;
                    }else{
                        this.postApplyInfo();
                    }
                }
            }
        })
    }

    //提交申请信息
    postApplyInfo = () => {
        let params = {};
        params.customerName = this.state.customerName;
        params.idCard = this.state.idCard;
        params.phone = sessionStorage.getItem("phoneNumberM");
        params.applyExplain = this.state.applyExplain;
        params.applyType = 3; //减免申请
        console.log(params);
        
        Toast.loading('数据提交中', 0);
        const { dispatch } = this.props;
        dispatch({
            type: 'minus/postInfo',
            payload: params,
            callback: response => {
                Toast.hide();
                if (response.success) {
                        router.push('/minus/success');                  
                } else{
                    Toast.info(response.message, 2, null, false);
                    return false;
                }
            }
        })
    }

    render(){
        const {customerName, idCard, applyExplain} = this.state;
        return (
            <div className={styles.minusLayouts}>
                <div className={styles.wrapperW}>
                    <NavBar mode="light" icon={<Icon type="left" />} onLeftClick={() => go()}>减免申请</NavBar>
                    <div className={styles.content}>  
                        <div className={styles.listTitle}>申请人信息</div>
                        <div className={styles.flex}>
                            <div className={styles.left}>申请人姓名</div>
                            <input className={styles.input} type="text" name="customerName" placeholder="请输入申请人姓名" maxLength="20" value={customerName} onChange={this.changeName.bind(this)} ref={el => this.customerName = el}/>
                        </div>
                        <div className={styles.flex} style={{marginBottom: 6}}>
                            <div className={styles.left}>申请人身份证号</div>
                            <input className={styles.input} type="text" name="idCard" placeholder="请输入申请人身份证号" value={idCard} onChange={this.changeIdCard.bind(this)} ref={el => this.idCard = el}/>
                        </div>

                        <div className={styles.listTitle}>减免说明</div>
                        <div className={styles.infoBody}>                    
                            <List className={styles.infoList}>
                                <TextareaItem
                                    rows={8}
                                    count={200}
                                    placeholder='请输入...'
                                    clear={true}
                                    value={applyExplain}
                                    onChange={this.changeApplyExplain.bind(this)} 
                                    ref={el => this.applyExplain = el}
                                />
                            </List>
                        </div>
                        <div className={styles.line}></div>
                    </div>
                    <div className={styles.personal}>
                        <div className={styles.btnPurple} onClick={() => this.handleNextStep()}>下一步</div>
                    </div>                
                </div>
            </div>
        )

    }
}

export default Personal;