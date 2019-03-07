import React from 'react';
import {
    NavBar, 
    Icon,
} from 'antd-mobile';
import router from 'umi/router';
import styles from './minus.less';
import { go } from '../../utils/utils';
import iconSuccess from '../../assets/minus/success.png';

class Success extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        document.title='提交成功';
    }

    render(){        
        return (
            <div className={styles.minusLayouts}>
                <NavBar mode="light" icon={<Icon type="left" />} onLeftClick={() => go()}>提交成功</NavBar>
                <div className={styles.successBody}> 
                    <div>
                        <img src={iconSuccess} className={styles.iconSuccess} />
                        <div className={styles.textSuccess}>提交成功！</div>
                    </div>
                </div>
                <div className={styles.successPs}>
                    <div>温馨提示：</div>
                    <div>审核时间为1-3天，在此期间请保持电话畅通，审核结果客服人员会与您取得联系，敬请等待，谢谢配合！</div>
                </div>
            </div>
        )
    }
}

export default Success;