import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { Toast } from 'antd-mobile';

export default class Success extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        document.title='审核失败'
    }

    go = () => {
        // console.log('点击了')
        history.go(-1);
        // router.push('/loan/index');
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
                    right: 0
                    }}>
                    <div style={{height: '44px', width: '44px', position: 'relative'}} onClick={this.go}>
                        <img src={require('../../assets/loan/arrowLift.png')} style={{
                            display: 'block', width: '14.5px', height: '21px', margin: 'auto', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'
                            }} />
                    </div>
                    <div style={{
                        flex: 1, textAlign: 'center', lineHeight: '44px', fontSize:'18px', color: '#FFFFFF'
                    }}>
                        审核失败
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
                        <img src={require('../../assets/loan/error.png')} style={{
                            display: 'block', width: '64px', height: '64px', margin: 'auto'
                            }} />
                        <div style={{paddingTop: '22.5px'}}>很遗憾审核失败！</div>
                    </div>
                </div>
                {/* 提示 */}
                <div style={{background: '#F5F5F5', color: '#707070', fontSize: '15px', padding: '23px 20px'}}>
                    <div>如有疑问请联系客服QQ：414419651</div>
                </div>
            </div>
        )
    }
}
