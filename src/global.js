import '@babel/polyfill';
/* eslint-disable no-unused-vars */
/* import VConsole from 'vconsole';
const vConsole = new VConsole(); */

global.Intl = require('intl'); 
window.Intl = require('intl');

var str= navigator.userAgent.toLowerCase(); 
var ver=str.match(/cpu iphone os (.*?) like mac os/);
if(ver){
    let result = ver[1].replace(/_/g,".");
    let root = document.getElementById('root');
    if(9 > result){
        setTimeout(function () { 
            root.innerHTML=`<div style='text-align:center; margin-top:100px; font-size:16px;'>您当前的IOS系统版本为：${result} <br/>此系统版本过低<br/>请升级手机系统，或使用其他手机进行访问</div>`;
        }, 100);
    }
}else{
    //console.log("请在Ios系统中打开");
}

