/**
 * description:
 * Notes:
 * @author YM10219
 * @date 2018/12/13
 */
import React from 'react';
import router from 'umi/router';
import {withRouter, Router, Link, Route} from "react-router-dom";

class Home extends React.Component {
    state = {
        link: [
            {
                title: '减免申请',
                route: '/minus/index'
            },
            {
                title: '分期申请',
                route: '/installment/index'
            },
            {
                title: '贷款申请',
                route: '/loan/index'
            }
        ]
    }

    componentDidMount() {
    }

    itemLink=(item)=>{
        console.log('点击了', item)
        // router.push(item.route);
        window.location.href= item.route
    }

    render() {
        const { link } = this.state;
        let item = link.map((res, index) => {
            return (
                <div style={{padding: '10px 0'}} key={index} onClick={this.itemLink.bind(this,res) }>点击跳转到：{res.title} </div>
            )
        })
        return (
            <div>
                <div style={{padding: '50px 0 0 50px'}}>
                    {item}
                </div>
                <div>
                    关于跳转的路由，需到  page/Index/index.js   进行修改
                </div>
            </div>
        );
    }
}

export default withRouter(Home);
