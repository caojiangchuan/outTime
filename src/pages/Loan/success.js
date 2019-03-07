import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { Toast } from 'antd-mobile';
import { go } from '../../utils/utils';

export default class Success extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        document.title='注册成功'
    }

    componentDidMount () {
        Toast.info('注册成功', 1, null, false);
    }
    
    render(){
        
        return (
            <div style={{background: '#fff'}}>
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
                        <img src={require('../../assets/loan/arrowLift.png')} style={{
                            display: 'block', width: '14.5px', height: '21px', margin: 'auto', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'
                            }} />
                    </div>
                    <div style={{
                        flex: 1, textAlign: 'center', lineHeight: '44px', fontSize:'18px', color: '#FFFFFF'
                    }}>
                        注册成功
                    </div>
                    <div style={{height: '44px', width: '44px'}}></div>
                </div>
                {/* 内容部分 */}
                <div style={{
                        padding: '123.5px 0 70px 0',
                        background: '#fff',
                        fontSize: '18px',
                        lineHeight: '25px',
                        color: '#242424',
                        textAlign: 'center'
                }}>
                    <div>
                        <img src={require('../../assets/loan/success.png')} style={{
                            display: 'block', width: '64px', height: '64px', margin: 'auto'
                            }} />
                        <div style={{paddingTop: '22.5px'}}>恭喜您，注册成功！</div>
                        <div style={{fontSize: '15px'}}>加速审核中...</div>
                    </div>
                </div>
                {/* 提示 */}
                <div style={{background: '#F5F5F5', color: '#707070', fontSize: '15px', padding: '23px 20px'}}>
                    <div>温馨提示：</div>
                    <div>审核时间为1-3天请耐心等待，祝您审核通过！</div>
                </div>
            </div>
        )
    }
}
