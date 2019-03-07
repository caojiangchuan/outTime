export default [
    // 贷款申请首页
    {
        path: '/loan/index',
        routes: [
            { path: '/loan/index', component: './Loan/index' }
        ],
    },
    // Protocol
    {
        path: '/loan/protocol',
        routes: [
            { path: '/loan/protocol', component: './Loan/protocol' }
        ],
    },
    // 个人信息认证
    {
        path: '/loan/personal',
        routes: [
            { path: '/loan/personal', component: './Loan/Personal/personal' }
        ],
    },
    // 联系人信息
    {
        path: '/loan/contact',
        routes: [
            { path: '/loan/contact', component: './Loan/Contact/contact' }
        ],
    },
    // 手机号认证
    {
        path: '/loan/cellphone',
        routes: [
            { path: '/loan/cellphone', component: './Loan/cellPhone' }
        ],
    },
    // 手机号认证2
    {
        path: '/loan/cellphonecode',
        routes: [

            { path: '/loan/cellphonecode', component: './Loan/cellPhoneCode' }
        ],
    },
    // 银行卡认证 BankCard
    {
        path: '/loan/bankcard',
        routes: [

            { path: '/loan/bankcard', component: './Loan/BankCard/bankcard' }
        ],
    },
    // 注册成功
    {
        path: '/loan/success',
        routes: [
            { path: '/loan/success', component: './Loan/success' }
        ],
    },
    // 注册失败
    {
        path: '/loan/error',
        routes: [
            { path: '/loan/error', component: './Loan/error' }
        ],
    },    
    // 分期申请首页
    {
        path: '/installment/index',
        routes: [
            { path: '/installment/index', component: './Installment/index' }
        ],
    },
    // 分期申请协议
    {
        path: '/installment/protocol',
        routes: [
            { path: '/installment/protocol', component: './Installment/protocol' }
        ],
    },
    //  分期申请信息认证
    {
        path: '/installment/personal',
        routes: [
            { path: '/installment/personal', component: './Installment/personal' }
        ],
    },
    // 分期申请联系人信息
    {
        path: '/installment/contact',
        routes: [
            { path: '/installment/contact', component: './Installment/contact' }
        ],
    },
    // 分期申请手机号认证
    {
        path: '/installment/cellphone',
        routes: [
            { path: '/installment/cellphone', component: './Installment/cellPhone' }
        ],
    },
    // 分期申请手机号认证验证
    {
        path: '/installment/cellphonecode',
        routes: [

            { path: '/installment/cellphonecode', component: './Installment/cellPhoneCode' }
        ],
    },
    // 分期申请说明
    {
        path: '/installment/applyInfo',
        routes: [

            { path: '/installment/applyInfo', component: './Installment/applyInfo' }
        ],
    },
    // 分期申请申请成功
    {
        path: '/installment/success',
        routes: [
            { path: '/installment/success', component: './Installment/success' }
        ],
    },
    // 减免申请首页
    {
        path: '/minus/index',
        routes: [
            { path: '/minus/index', component: './Minus/index' }
        ],
    },
    // 减免申请协议
    {
        path: '/minus/protocol',
        routes: [
            { path: '/minus/protocol', component: './Minus/protocol' }
        ],
    },
    //  减免申请信息认证
    {
        path: '/minus/personal',
        routes: [
            { path: '/minus/personal', component: './Minus/personal' }
        ],
    },
    // 减免申请手机号认证
    {
        path: '/minus/cellphone',
        routes: [
            { path: '/minus/cellphone', component: './Minus/cellPhone' }
        ],
    },
    // 减免申请手机号认证验证
    {
        path: '/minus/cellphonecode',
        routes: [

            { path: '/minus/cellphonecode', component: './Minus/cellPhoneCode' }
        ],
    },
    // 减免申请申请成功
    {
        path: '/minus/success',
        routes: [
            { path: '/minus/success', component: './Minus/success' }
        ],
    },
    // user
    {
        path: '/exception',
        routes: [
            // exception
            {
                path: '/exception/403',
                component: './Exception/403',
            },
            {
                path: '/exception/404',
                component: './Exception/404',
            },
            {
                path: '/exception/500',
                component: './Exception/500',
            },
        ],
    },
    // 目录页
    /* {
        path: '/',
        component: './Index/index',
        routes: [
            { path: '/', redirect: '/index' }
        ],
    }, */
    {
        component: './Exception/404',
    },
];
