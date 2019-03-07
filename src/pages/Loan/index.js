import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import styles from './index.less';
import {connect} from 'dva';
import { InputItem, Toast, Modal, WingBlank, Carousel } from 'antd-mobile';
import Link from 'umi/link';
import { loadingText, phoneReg } from "../../utils/utils";

// 图片资源
import bannerImage from '../../assets/loan/indexBanner.png'
import fourAdvantages from '../../assets/loan/fourAdvantages.png'
import review from '../../assets/loan/tabs1.png'
import highPass from '../../assets/loan/tabs2.png'
import freeMortgage from '../../assets/loan/tabs3.png'
import quick from '../../assets/loan/tabs4.png'
import yChoice from '../../assets/loan/y-choice.png'
import nChoice from '../../assets/loan/n-choice.png'

@connect(({ loan, loading }) => ({
    loan
}))
export default class Loan extends Component{
	constructor(props) {
		super(props);
		this.state = {
			list: ['恭喜132***2676成功借款9000元','恭喜158***0445成功借款7000元'], // 数组长度必须不为空
			tel: sessionStorage.getItem('phoneNumber') ? sessionStorage.getItem("phoneNumber") : '',
			isCheck: false,
			tabs: [
				{
					title: '审核简单',
					icon: review
				},
				{
					title: '通过率高',
					icon: highPass
				},
				{
					title: '免抵押',
					icon: freeMortgage
				},
				{
					title: '到账快',
					icon: quick
				}
			],
			modelShow: false,
			isShow: false,
			isCode: false,
			timer: 60,
			code: '',
			message: '获取验证码',
			userState: null, // 用户是否注册状态 1.已提交 2.未注册 3.超过7/30天
			userIsValid: null, // 是否超过72小时 1.未超过 2.超过
			isClickGetCode: false, // 是否点击获取验证码
			count: 0 // 点击注册领取次数
		};
		document.title='贷款申请'
	}

	componentDidMount () {
        this.getCarouselList()
	}
	
	componentWillUnmount () {
        this.setState = (state,callback)=>{
            return;
        };
    }

	/**
	 * 获取轮播条数据
	 */
    getCarouselList = ()=> {
        const { dispatch } = this.props;
        dispatch({
            type: 'loan/fetch',
            payload: {
                sysCode: 'H5'
            },
            callback: response => {
				if (response && response.data) {
					if (response.data && response.data.params && response.data.params.length) {
						this.setState({
							list: response.data.params
						})
					}
				} else {
					console.log('暂无数据')
				}
            }
        })
	}
	
	/**
	 * 获取用户状态信息
	 */
	getCustomerInfo = ()=> {
        Toast.loading(loadingText, 0);
        const { dispatch } = this.props;
        dispatch({
            type: 'loan/info',
            payload: {
				phone: this.state.tel,
				type: '1'
            },
            callback: response => {
                Toast.hide();
				if (response && response.data) {
					this.setState({
						userState: response.data.state,
						userIsValid: response.data.isvalid
					})
					if (response.data.state == 1) {
						if (response.data.isvalid == 1) {
							router.push('/loan/success');
						}
						if (response.data.isvalid == 3) {
							router.push('/loan/error');
						}
					}
					if (response.data.state == 2 || response.data.state == 3) {
						this.setState({
							modelShow: true
						}, () => {
							window.scrollTo(0, 0)
						})
					}
				}
            }
        })
    }

	/**
	 * 点击马上领取按钮
	 */
	btnClick() {
		if (this.state.tel) {
			if (!phoneReg.test(this.state.tel)) { // 正则验证不通过，格式不对
				this.telPhone.focus()
				Toast.info('手机号有误，请重新输入', 2, null, false);
			} else {
				if (this.state.isCheck) {
					// 在此处调接口   获取验证码
                    this.getCustomerInfo()
				} else {
					Toast.info('请先勾选同意注册协议', 2, null, false);
				}
			}
		} else {
			this.telPhone.focus()
			Toast.info('请先输入手机号', 2, null, false);
		}
	}
	
	/**
	 * 点击注册领取按钮
	 */
	register() {
		if (this.state.isShow) {
			if (this.state.code) {
				if (!this.state.isClickGetCode) {
					Toast.info('请先获取验证码', 2, null, false);
					return
				}
				console.log('点击了注册领取按钮', this.state.code)
				// 在此处调取接口 校验验证码 validms
                sessionStorage.setItem('phoneNumber', this.state.tel);
                
                Toast.loading(loadingText, 0);
				const { dispatch } = this.props;
				dispatch({
					type: 'loan/validms',
					payload: {
						code: this.state.code,
						type: '0',  //0---24小时可获取
						phone: this.state.tel
					},
					callback: response => {
                        Toast.hide();
						if (response) {
							if (response.success) {
								router.push('/loan/personal');
							} else {
								if (response.message == '验证码尝试次数已超过3次，不能再次尝试') {
									Toast.info(response.message, 2, null, false);
									setTimeout(
										() => { 
											window.location.href= '/loan/index'
										},
										2000
									);
								} else if(response.message == '验证码错误') {
									Toast.info('验证码尝试次数已超过3次，不能再次尝试', 2, null, false);
									this.setState({
										count: this.state.count + 1
									}, () => {
										if (this.state.count >= 4) {
											setTimeout(
												() => { 
													window.location.href= '/loan/index'
												},
												2000
											);
										} else {
											Toast.info(response.message, 2, null, false);
										}
									})
								}else{
                                    Toast.info(response.message, 2, null, false);
                                }
							}
						} else {
							Toast.info('接口未响应，请重新操作', 2, null, false);
						}
					}
				})
			} else {
				Toast.info('请输入验证码', 2, null, false);
			}
		} else {
			// console.log('走else', this.state.isShow)
		}
	}

	/**
	 * 点击获取验证码按钮
	 */
	codeBtn() {
		// console.log('发送验证码')
		this.setState({
			isCode: true,
			isClickGetCode: true
		})
		let timer = this.state.timer - 0
		let siv = setInterval(() => {
			this.setState({
				timer: --timer
			}, () => {
				if (timer === -1) {
					clearInterval(siv);
					this.setState({
						isCode: false,
						timer: 60,
						message: '重新获取'
					})
				}
			});
		}, 1000);
		const { dispatch } = this.props;
        dispatch({
            type: 'loan/sendms',
            payload: {
				phone: this.state.tel,
				type: '0'
            },
            callback: response => {
				if (response) {
					if (response.success) {
						// console.log('发送验证码', response)
						// this.setState({
						// 	isCode: true,
						// 	isClickGetCode: true
						// })
					} else {
						if (response.message == '请不要频繁点击') {
							Toast.info(response.message, 2, null, false);
							setTimeout(
								() => { 
									window.location.href= '/loan/index'
								},
								2000
							);
							clearInterval(siv);
							this.setState({
								isCode: false,
								isClickGetCode: false,
								timer: 60
							}, () => {
								clearInterval(siv);
								return
							})
						} else {
							Toast.info(response.message, 2, null, false);
							clearInterval(siv);
							this.setState({
								isCode: false,
								isClickGetCode: false,
								timer: 60
							}, () => {
								clearInterval(siv);
								return
							})
						}
					}
				} else {
					Toast.info('该手机号获取失败', 2, null, false);
					setTimeout(
						() => { 
							window.location.href= '/loan/index'
						},
						2000
					);
					clearInterval(siv);
					this.setState({
						isCode: false,
						isClickGetCode: false,
						timer: 60
					}, () => {
						clearInterval(siv);
						return
					})
				}
            }
		}) 
	}

	/**
	 * 点击是否选中
	 */
	// 是否选中
    isChecked(item) {
        this.setState({
            isCheck: !item
        })
	}
	
	/**
	 * 监控验证码的输入
	 */
	changeCode(e){
		this.setState({
            code: e.target.value.trim()
        })
        if(e.target.value.length > 0){
            this.setState({
                isShow: true
            })
        }else{
            this.setState({
                isShow: false
            })
        }
	}

	/**
	 * 失去焦点事件
	 */
	inputOnBlur(){
		// this.setState({ focus: false });
		window.scrollTo(0, 0)
		// console.log('失去焦点了')
	}	

	/**
	 * changeTel
	 */
	changeTel(e){
		this.setState({
			tel: e.target.value.trim()
		})
	}

    render(){
		const { list, price, tel, modelShow } = this.state;
		let tabBottom = this.state.tabs.map((res, index) => {
			return (
				<div key={index} style={{width: '25%'}}>
					<div className={styles.bottom_title}>{res.title}</div>
					<img src={res.icon} className={styles.bottom_img}/>
				</div>
			)
		})
		/**
		 * 弹窗
		 */
		let model;
        let code;
		if (this.state.isCode) {
			code = (
				<div className={styles.code_right} style={{background: 'gray'}}>{this.state.timer}s</div>
			)
		} else {
			code = (
				<div className={styles.code_right} onClick={this.codeBtn.bind(this)}>{this.state.message}</div>
			)
		}
		if (this.state.modelShow) {
			model = (
				<div className={styles.model}>
					<div className={styles.center_box}>
						<div className={styles.font}>
							{/* 已向{this.state.tel}发送短信 */}
							请点击获取验证码发送短信
						</div>
						<div className={styles.font}>输入验证码注册领取</div>
						<div className={styles.code}>
                            <input style={{textAlign: 'center', color: '#000'}} className={styles.code_input} type="tel" onChange={this.changeCode.bind(this)} value={this.state.code} name="code" placeholder="" ref="code" onBlur={ ::this.inputOnBlur } autoFocus />
							{code}
						</div>
						<div className={`${styles.code_bottom} ${ this.state.isShow?'' : `${styles.btn_active}`}`} onClick={this.register.bind(this)} >注册领取</div>
					</div>
				</div>
            )
            
		} else {
			model = (
				<div style={{display: 'none'}}></div>
			)
		}
        return (
            <div style={{height:'100vh', overflow: (this.state.modelShow? 'hidden' : 'auto')}}>
				{/* <div>贷款申请页面</div> */}
				<img src={bannerImage} className={styles.top_banner} />
				{/* 轮播数据 */}
				<div className={styles.top_scroll}>
					<div className={styles.scroll_notice}></div>
					<WingBlank style={{flex: '1'}}>
						<Carousel className="my-carousel"
							vertical
							dots={false}
							dragging={false}
							swiping={false}
							autoplay
							infinite
						>
							{list.map((val, index) => (
								<div style={{
									color:'rgba(36,36,36,1)',
									fontSize:'12px',
									overflow: 'hidden',
									whiteSpace: 'nowrap',
									textOverflow: 'ellipsis'
									}} key={index}>{val}</div>
							))}
						</Carousel>
					</WingBlank>
				</div>
				{/* 输入框 */}
				<div className={styles.comment}>
					<div className={styles.input_box}>
						<input type="tel" onChange={this.changeTel.bind(this)} value={this.state.tel} ref={telPhone => this.telPhone = telPhone} placeholder="请输入您的手机号" autoFocus/>
					</div>
					<div className={styles.btn} onClick={this.btnClick.bind(this) }>马上领取</div>
					{/* 关于协议 yChoice nChoice */}
					<div className={styles.Agreement}>
						<div className={styles.agreeLeft} onClick={this.isChecked.bind(this,this.state.isCheck)}>
							<img onClick={this.isChecked.bind(this,this.state.isCheck)} src={this.state.isCheck ? yChoice : nChoice} alt="" />
							<div>阅读并同意</div>
						</div>
							<Link onClick={()=>{
								sessionStorage.setItem('phoneNumber', this.state.tel);
							}} style={{color: '#FF3D3D', fontSize: '12px'}} to="/loan/protocol">《新钱袋隐私授权及协议》</Link>
					</div>
				</div>
				{/* 四大优势 */}
				<div className={styles.footer}>
					<img src={fourAdvantages} style={{display: 'block', width: '235.5px', margin: 'auto'}} />
					<div className={styles.bottom}>
						{tabBottom}
					</div>
				</div>
				{/* 模态框 */}
				{model}
            </div>
            )
        }
    }
