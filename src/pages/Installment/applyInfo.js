import React from 'react';
import { connect } from 'dva';
import {
    Button,
    NavBar, 
    Icon,
    List, 
    Toast,
    TextareaItem
} from 'antd-mobile';
import router from 'umi/router';
import Link from 'umi/link';
import styles from './installment.less';
import { go, judgeTelExist, loadingText } from "../../utils/utils";

// 获取session 中的数据
let userInfo = sessionStorage.getItem('personalInfo');
userInfo = JSON.parse(userInfo);
let contact = sessionStorage.getItem('contactInfo');
contact = JSON.parse(contact);

@connect(({ installment }) => ({
    installment
}))
class ApplyInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            applyExplain: ''  //说明
        };
        document.title='申请说明';
    }

    componentWillMount() {  
        judgeTelExist('/installment/index');
    }

    //监听申请说明输入
    changeApplyExplain = (value) => {
        if (value.indexOf("'") != -1 || value.indexOf("\"") != -1) { 
            return
        } else {
            this.setState({
                applyExplain: value.trim().replace(/\'/g,"").replace(/\"/g,"")
            })
        }
    }
    
    //提交
    onSubmit = () => {
        const { applyExplain } = this.state;
        
        if('' == applyExplain){
            Toast.info('请输入申请说明', 2, null, false);
            this.applyExplain.focus();
            return false;
        }
        
        let params = {};
        params.customerName = userInfo.customerName;
        params.idCard = userInfo.idCard;
        params.phone = sessionStorage.getItem("phoneNumber");
        params.applyExplain = this.state.applyExplain;
        params.workUnit = userInfo.workUnit;
        params.unitTel = userInfo.unitTel;
        params.applyType = 2; //分期申请
        params.contact = contact;
        console.log(params);
        
        Toast.loading('数据提交中', 0);
        const { dispatch } = this.props;
        dispatch({
            type: 'installment/postInfo',
            payload: params,
            callback: response => {
                Toast.hide();
                if (response.success) {
                    router.push('/installment/success');
                } else{
                    Toast.info(response.message, 2, null, false);
                    return false;
                }
            }
        })
    }

    render(){
        const { applyExplain } = this.state;
        
        return (
            <div className={styles.installmentLayouts}>
                <div className={styles.wrapperW}>
                    <NavBar mode="light" icon={<Icon type="left" />} onLeftClick={() => go()}>申请说明</NavBar>
                    <div className={styles.infoBody}>                    
                        <List className={styles.infoList}>
                            <TextareaItem
                                rows={11}
                                count={200}
                                placeholder='请输入...'
                                clear={true}
                                value={applyExplain}
                                onChange={this.changeApplyExplain.bind(this)} 
                                ref={el => this.applyExplain = el}
                            />
                        </List>
                        <div className={styles.infoPs}>注：填写申请说明务必真实有效</div>
                    </div>
                    <div className={styles.personal}>
                        <div className={styles.btnBlue} onClick={() => this.onSubmit()}>提交</div>
                    </div> 
                </div>
            </div>
        )
    }
}

export default ApplyInfo;