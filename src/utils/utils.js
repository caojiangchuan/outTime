import moment from 'moment';
import React from 'react';
import router from 'umi/router';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';

export function fixedZero(val) {
    return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
    const now = new Date();
    const oneDay = 1000 * 60 * 60 * 24;

    if (type === 'today') {
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        return [moment(now), moment(now.getTime() + (oneDay - 1000))];
    }

    if (type === 'week') {
        let day = now.getDay();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);

        if (day === 0) {
            day = 6;
        } else {
            day -= 1;
        }

        const beginTime = now.getTime() - day * oneDay;

        return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
    }

    if (type === 'month') {
        const year = now.getFullYear();
        const month = now.getMonth();
        const nextDate = moment(now).add(1, 'months');
        const nextYear = nextDate.year();
        const nextMonth = nextDate.month();

        return [
            moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
            moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
        ];
    }

    const year = now.getFullYear();
    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
    const arr = [];
    nodeList.forEach(node => {
        const item = node;
        item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
        item.exact = true;
        if (item.children && !item.component) {
            arr.push(...getPlainNode(item.children, item.path));
        } else {
            if (item.children && item.component) {
                item.exact = false;
            }
            arr.push(item);
        }
    });
    return arr;
}

export function digitUppercase(n) {
    return nzh.toMoney(n);
}

function getRelation(str1, str2) {
    if (str1 === str2) {
        console.warn('Two path are equal!'); // eslint-disable-line
    }
    const arr1 = str1.split('/');
    const arr2 = str2.split('/');
    if (arr2.every((item, index) => item === arr1[index])) {
        return 1;
    }
    if (arr1.every((item, index) => item === arr2[index])) {
        return 2;
    }
    return 3;
}

function getRenderArr(routes) {
    let renderArr = [];
    renderArr.push(routes[0]);
    for (let i = 1; i < routes.length; i += 1) {
        // 去重
        renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
        // 是否包含
        const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
        if (isAdd) {
            renderArr.push(routes[i]);
        }
    }
    return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
    let routes = Object.keys(routerData).filter(
        routePath => routePath.indexOf(path) === 0 && routePath !== path
    );
    // Replace path to '' eg. path='user' /user/name => name
    routes = routes.map(item => item.replace(path, ''));
    // Get the route to be rendered to remove the deep rendering
    const renderArr = getRenderArr(routes);
    // Conversion and stitching parameters
    const renderRoutes = renderArr.map(item => {
        const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
        return {
            exact,
            ...routerData[`${path}${item}`],
            key: `${path}${item}`,
            path: `${path}${item}`,
        };
    });
    return renderRoutes;
}

export function getPageQuery() {
    return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
    const search = stringify(query);
    if (search.length) {
        return `${path}?${search}`;
    }
    return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
    return reg.test(path);
}

export function formatWan(val) {
    const v = val * 1;
    if (!v || Number.isNaN(v)) return '';

    let result = val;
    if (val > 10000) {
        result = Math.floor(val / 10000);
        result = (
            <span>
        {result}
                <span
                    styles={{
                        position: 'relative',
                        top: -2,
                        fontSize: 14,
                        fontStyle: 'normal',
                        lineHeight: 20,
                        marginLeft: 2,
                    }}
                >
          万
        </span>
      </span>
        );
    }
    return result;
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
    return window.location.hostname === 'preview.pro.ant.design';
}

export const defaultKeys ={
    userId:'userId',
    code:'code',
    token:'token',
    mobile:'mobile',
    wxName:'wxName',
    face:'face',
    status:'status',
    role:'role',
    authorities:'authokrities',
};
// return ture if the value is empty,otherwise return false
export function isEmpty(value){
    if(value === undefined ||
        value === null ||
        value === '' ||
        value.length === 0 ||
        value.size === 0){
        return true;
    }else{
        return false;
    }
}
// hold all of the information of this application
export function setItem(key, value) {
    if(!isEmpty(defaultKeys[key])){
        sessionStorage.setItem(key,value);
    }else{
        localStorage.setItem(key,value);
    }
}

// return the stored data
export function getItem(key) {
    if(!isEmpty(defaultKeys[key])){
        if(key === 'userId'){
            return parseInt(sessionStorage.getItem('userId'), 0);
        }
        return sessionStorage.getItem(key);

    }
    return localStorage.getItem(key);

}

export function clearItem(key) {
    if(!isEmpty(defaultKeys[key])){
        sessionStorage.removeItem(key);
    }else{
        localStorage.removeItem(key);
    }
}

// 校验银行卡号 test 未测试
export function bankCardNumber(bankno) {
    var lastNum=bankno.substr(bankno.length-1,1);//取出最后一位（与luhn进行比较）

    var first15Num=bankno.substr(0,bankno.length-1);//前15或18位
    var newArr=new Array();
    for(var i=first15Num.length-1;i>-1;i--){    //前15或18位倒序存进数组
        newArr.push(first15Num.substr(i,1));
    }
    var arrJiShu=new Array();  //奇数位*2的积 <9
    var arrJiShu2=new Array(); //奇数位*2的积 >9
    
    var arrOuShu=new Array();  //偶数位数组
    for(var j=0;j<newArr.length;j++){
        if((j+1)%2==1){//奇数位
            if(parseInt(newArr[j])*2<9)
            arrJiShu.push(parseInt(newArr[j])*2);
            else
            arrJiShu2.push(parseInt(newArr[j])*2);
        }
        else //偶数位
        arrOuShu.push(newArr[j]);
    }
    
    var jishu_child1=new Array();//奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2=new Array();//奇数位*2 >9 的分割之后的数组十位数
    for(var h=0;h<arrJiShu2.length;h++){
        jishu_child1.push(parseInt(arrJiShu2[h])%10);
        jishu_child2.push(parseInt(arrJiShu2[h])/10);
    }        
    
    var sumJiShu=0; //奇数位*2 < 9 的数组之和
    var sumOuShu=0; //偶数位数组之和
    var sumJiShuChild1=0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2=0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal=0;
    for(var m=0;m<arrJiShu.length;m++){
        sumJiShu=sumJiShu+parseInt(arrJiShu[m]);
    }
    
    for(var n=0;n<arrOuShu.length;n++){
        sumOuShu=sumOuShu+parseInt(arrOuShu[n]);
    }
    
    for(var p=0;p<jishu_child1.length;p++){
        sumJiShuChild1=sumJiShuChild1+parseInt(jishu_child1[p]);
        sumJiShuChild2=sumJiShuChild2+parseInt(jishu_child2[p]);
    }      
    //计算总和
    sumTotal=parseInt(sumJiShu)+parseInt(sumOuShu)+parseInt(sumJiShuChild1)+parseInt(sumJiShuChild2);
    
    //计算luhn值
    var k= parseInt(sumTotal)%10==0?10:parseInt(sumTotal)%10;        
    var luhn= 10-k;
    
    if(lastNum==luhn){
        // console.log('校验通过')
        return true;
    }
    else{
        // console.log('校验不通过')
        return false;
    }        
}

// 返回上一页
export function go() {
    history.go(-1);
}

// 亲属联系人关系
export const contactParent = [
    { value: 1, label: '父母'},
    { value: 2, label: '配偶'},
    { value: 3, label: '子女'}
];

//联系人关系
export const contactAll = [
    { value: 1, label: '父母'},
    { value: 2, label: '配偶'},
    { value: 3, label: '子女'},
    { value: 4, label: '兄弟姐妹'},
    { value: 5, label: '亲属'},
    { value: 6, label: '朋友'},
    { value: 7, label: '同学'},
    { value: 8, label: '同事'}
];

// 借款金额
export const loanPrice = [
    { value: 5000, label: 5000},
    { value: 8000, label: 8000},
    { value: 10000, label: 10000},
    { value: 15000, label: 15000},
    { value: 20000, label: 20000},
    { value: 30000, label: 30000}
];

// 借款金额
export const loanDateLine = [
    { value: 6, label: '6个月'},
    { value: 12, label: '12个月'},
    { value: 24, label: '24个月'},
    { value: 36, label: '36个月'}
];

// 借款金额 Marital status
export const maritalStatus = [
    { value: 0, label: '未婚'},
    { value: 1, label: '已婚'},
    { value: 2, label: '离异'},
    { value: 3, label: '其他'}
];

// 银行名称
export const bankNames = [
    { value: '中国工商银行', label: '中国工商银行'},
    { value: '中国银行', label: '中国银行'},
    { value: '中国建设银行', label: '中国建设银行'},
    { value: '中国农业银行', label: '中国农业银行'},
    { value: '中国交通银行', label: '中国交通银行'},
    { value: '中国邮政银行', label: '中国邮政银行'},
    { value: '中国人民银行', label: '中国人民银行'},
    { value: '中国招商银行', label: '中国招商银行'},
    { value: '中国兴业银行', label: '中国兴业银行'},
    { value: '中国中信银行', label: '中国中信银行'},
    { value: '中国光大银行', label: '中国光大银行'},
    { value: '中国民生银行', label: '中国民生银行'},
    { value: '中国广发银行', label: '中国广发银行'},
    { value: '中国华夏银行', label: '中国华夏银行'},
    { value: '中国浦发银行', label: '中国浦发银行'}
]

// 单次验证码
export const singleCode = [
    '陕西电信', '山东移动', '河南移动', '河南电信', '江苏移动', '浙江移动', '浙江电信', '江西移动', '江西电信', '福建移动', '福建电信', '湖北移动', '湖北电信',
    '湖南移动', '湖南电信', '广东移动', '青海移动', '青海电信', '广西移动', '上海移动', '上海电信', '天津电信', '河北移动', '黑龙江移动', '黑龙江电信', '安徽移动',
    '四川电信', '贵州移动', '贵州电信', '甘肃移动', '北京移动'
]

// 两次验证码
export const doubleCode = [
    '重庆移动', '山西移动', '山东电信', '云南移动', '吉林移动', '四川移动'
]

// 不需要验证码
export const noCode = [
    '北京电信', '重庆电信', '陕西移动', '江苏电信', '云南电信', '广东电信', '天津移动', '河北电信', '安徽电信', '甘肃电信'
]

// 需要身份证号
export const needIdCard = [
    '山西电信', '广西电信'
]

// 缓存中不存在手机号，跳转首页
export function judgeTelExist(routerPage, type) {
    let tel;
    if(type == 1){
        tel = sessionStorage.getItem('phoneNumberM');
    }else{
        tel = sessionStorage.getItem('phoneNumber');    
    }
    if(null == tel){
        router.push(routerPage);
    }
}

// 中文姓名校验格式
export const nameReg = new RegExp(/^[\u4E00-\u9FA5\xb7]{1,20}$/);

// 身份证号校验格式
export const idCardReg = new RegExp(/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[X])$)$/)

// 手机号校验格式
export const phoneReg = new RegExp(/^1[34578]\d{9}$/);

// 座机校验格式
export const workTelReg = new RegExp(/^(\d{3}-)([1-9]\d{7})$|^(\d{3}-)([1-9]\d{6})$|^(\d{4}-)([1-9]\d{6})$|^(\d{4}-)([1-9]\d{7})$/); // 座机

// loading动画显示文字
export const loadingText = '加载中...';