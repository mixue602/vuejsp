<template>
    <div class="wapper checkCard">
        <!-- 查询会员卡 -->
        <div class='checkbox' v-show= '!ruleOn'>
            <!--<h2><img src="//gfs12.gomein.net.cn/T1KOhvBmhT1RCvBVdK.png"></h2>
            <ul class="actype clearfix">
                <li v-for='item in actypeArr' :class='{"on":item.actype == actype}' @click='selActype(item)'>
                    <img :src="item.imgUrl" alt="">
                    <span class='acmask'></span>
                </li>
            </ul>-->
            <div class="sctp2">
                <img src="//gfs10.gomein.net.cn/T1ieJgBX_T1RCvBVdK.png" alt="">
            </div>
            <ul class="securelist">
                <li id="phoneNum" class="bdr-bottom">
                    <label class="an">手机号</label>
                    <input id="mobNum" :class='{"off":grayTxt}' @input='changeVcode' v-model='phoneNum' type="tel" placeholder="请输入手机号"  maxlength="11" v-bind:readonly="isReadOnly">
                    <span class='bdr-l' id="sendCode" :class='{"on":vcodeOn}' @click='getVcode'>获取验证码</span>
                </li>
                <li id="papersNum" class="bdr-bottom">
                    <label class="an">验证码</label>
                    <input class="js-number"  @input='isSubmit'  id="vcode"  v-model='vcode' :placeholder="vholder" @focus="clearholder" @blur="backholder" maxlength="6">
                </li>
            </ul>
            <p class='drawTip'>
            <i class='i-selquangou' :class='{"on":selOn}' @click='changeSel'></i>
            同意会员卡 <a href="javascript:;" @click='showRule'> 绑定规则</a></p>
            <div class="subBtn"><a class="subBtnLink"  :class='{"on":subBtn}' @click='isbind'  href="javascript:;">绑定</a></div>
        </div>
        <!-- 会员卡规则 -->
         <card-rule v-show='ruleOn' @back='showRule'></card-rule>
    </div>
</template>

<script type="text/ecmascript-6">
import cardRule from './cardRule';
let root = window || {},
    util = root.util || {},iScrollZoom,
    regex = /^1[34578]\d{9}$/;
let  ACTYPE={
            '1': '国美会员卡',
            '2': '永乐会员卡',
            '3': '大中会员卡',
            /*'4': '蜂星会员卡',*/
            '5': '库巴卡',
            '6': '极信国美卡',
            '7': '极信大中卡',
            '8': '极信永乐卡'
        },
        msg = {
            m1: '请选择会员卡类型',
            m2: '会员卡类型有误，请重新选择',
            m3: '请输入手机号',
            m4: '验证码发送频繁',
            m5: '验证码发送量已达今日上限',
            m6: '请选择会员卡类型',
            m7: '会员卡类型有误，请重新选择',
            m8: '请获取验证码进行短信验证',
            m9: '请输入短信验证码',
            m10: '请输入正确的手机号',
            m11: '短信验证码有误，请重新获取',
            m12: '短信验证码已超时，请重新获取',
            m13: '手机号有误，请重新尝试',
            m14: '会员卡已被绑定，不能重复绑定'
        },
        requestState= {
            getSendCodePhone: true,
            sendCode: true,
            checkCode: true,
            save: true
        };
export default {
	data () {
		return {
			title:'会员卡',
            actype:1,
           /* actypeArr:[
                {   actype: '1',
                    name:'国美会员卡',
                    imgUrl:'//gfs10.gomein.net.cn/T1BmVvByCb1RCvBVdK.png'
                },
                {   actype: '2',
                    name:'永乐会员卡',
                    imgUrl:'//gfs10.gomein.net.cn/T1X7hvBKYv1RCvBVdK.png'
                },
                {   actype: '3',
                    name:'大中会员卡',
                    imgUrl:'//gfs10.gomein.net.cn/T1J0EvBTEg1RCvBVdK.png'
                },
                {   actype: '6',
                    name:'极信国美卡',
                    imgUrl:'//gfs10.gomein.net.cn/T1A6_vB5xb1RCvBVdK.png'
                },
                {   actype: '7',
                    name:'极信大中卡',
                    imgUrl:'//gfs11.gomein.net.cn/T1C7hvBXdv1RCvBVdK.png'
                },
                {   actype: '8',
                    name:'极信永乐卡',
                    imgUrl:'//gfs10.gomein.net.cn/T1b2hvBjZT1RCvBVdK.png'
                }
            ],*/
            phoneNum:'',
            subPhone:'',
            //auto 记录手机号是自动获取还是手工输入，0代表手动输入的，1代表自动获取的
            auto:0,
            //验证码
            vcode:'',
            vcodeOn:false,
            grayTxt:false,
            subBtn:false,
            selOn:true,
            ruleOn:false,
            //全局唯一编码
            uiqcd:'',
            isReadOnly:false,
            vholder:'请输入验证码'
        }
	},
  	created() {
        this.hrefParma = util.getHrefParma();
        //获取手机号接口
       this.getMobil();
    },
    mounted(){

    },
    methods:{
        //清除holder内容
        clearholder(){
            this.vholder = '';
        },
        //还原holder内容
        backholder(){
            this.vholder = '请输入验证码';
        },
        //获取手机号
        getMobil(){
            let that = this;
            // 请求
            util.api({
                surl: root.MB_API_PATH + 'gmb',
                type: 'get',
                beforeSend: function() {
                },
                success: function(response) {
                    var body,
                            rpco = response.rpco;

                    // 处理
                    switch(rpco) {
                            // 正常
                        case 200:
                            body = response.body || {};
                            //已经绑定的手机号
                             that.phoneNum = body.mb;
                            that.isReadOnly = true;
                            that.vcodeOn = true;
                            that.grayTxt = true;
                            //自动获取手机号
                            that.auto = 1;
                            break;
                        case 20001:
                            that.isReadOnly = false;
                           // util.tip("没有绑定的手机号");
                            break;
                        default:
                    }
                },
                complete: function(response) {
                    // 启用按钮
                },
                error:function() {
                }
            });
        },
       /* // 选择卡类型
        selActype(item){
            this.actype = item.actype;
        },*/
        // 验证码是否可点击
        changeVcode(){
            if(this.phoneNum.toString().length==11 && !/[0-9]+/g.test($("#sendCode").text())){
                this.vcodeOn = true;
            }else{
                this.vcodeOn = false;
            }
            this.isSubmit();
        },
        // 获取验证码
        getVcode(){
            let that = this;
            if(!requestState.sendCode) return;
            if(this.phoneNum.toString().length!=11 || !this.vcodeOn){
                return;
            }
            // 账号类型
            if(!this.actype) {
                util.tip(msg.m1);
                return false;
            }
            // 账号类型有效性
            if(!ACTYPE[this.actype]) {
                util.tip(msg.m2);
                return false;
            }
            // 手机号
            if(!this.phoneNum) {
                util.tip(msg.m3);
                return false;
            }
            // 手机号规则
            if(!regex.test(this.phoneNum)){
                util.tip(msg.m10);
                return;
            }

            // 请求
            util.api({
                //wap.dev.gomegj.com/login/yf/sendcode?mob=18618106087
                surl: root.LOGIN_API_PATH + 'sendcode',
                data: {
                    mob: this.phoneNum
                },
                type: 'get',
                beforeSend: function() {
                    requestState.sendCode = false;
                },
                success: function(response) {
                    var body,
                    rpco = response.rpco;

                    // 处理
                    switch(rpco) {
                        // 正常
                        case 200:
                            body = response.body || {};
                            // 倒计时
                            that.countDown();
                            // 验证码生成时间戳
                            that.uiqcd = body.validrand;
                            that.subPhone = that.phoneNum;
                            break;
                        case 400:
                            util.tip("请输入正确的手机号");
                            break;
                        case 404:
                            util.tip("服务器繁忙，请稍后再试");
                            break;
                        case 500:
                            util.tip("验证码发送失败，请稍后重试");
                            break;
                        case 20001:
                            util.tip("验证码发送失败，请稍后重试");
                            break;
                        case 40002:
                            util.tip("已为您发送短信验证码，请耐心等待，1分钟内只可获取一次");
                            break;
                        case 40003:
                            util.tip("您获取验证码次数过于频繁，请稍后重新尝试");
                            break;
                        case 20003:
                            util.tip("您获取验证码次数过于频繁，请稍后重新尝试");
                            break;
                        default:
                            util.tip('验证码发送失败');
                    }
                },
                complete: function(response) {
                    // 启用按钮
                    (response.rpco !== 200) && (requestState.sendCode = true);
                },
                error:function() {
                    requestState.sendCode = true;
                }
            });
        },
        // 倒计时
        countDown() {
            var that = this;
            this.vcodeOn = false;
            util.countDown({
                elem: $('#sendCode'),
                downTime: 60,
                formate: 'countS后重试',
                callback: function() {
                    $('#sendCode').text("重新发送")
                    that.changeVcode();
                }
            });
        },
        //切换绑卡规则选中状态
        changeSel(){
            this.selOn = !this.selOn;
            this.isSubmit();
        },
        // 绑定按钮点击状态
        isSubmit(){
            // 提交按钮是否可点
            if(this.phoneNum.toString().length==11 && this.vcode && this.selOn){
                this.subBtn = true;
            }else{
                this.subBtn = false;
            }
        },
        //判断该手机号否被其他用户绑定过
        isbind(){
            let that = this;
            //手机号自动获取
            if (that.auto == 1) {
                that.getInvoice();
            }else {
                //手机号手动输入
                util.api({
                    surl: root.MB_API_PATH + 'ckmb',
                    data: {
                        mb:that.phoneNum
                    },
                    type: 'post',
                    beforeSend: function() {
                    },
                    success: function(response) {
                        var rpco = response.rpco,
                            body;

                        // 处理
                        switch(rpco) {
                            case 200:
                                that.getInvoice();
                                break;
                            case 40006:
                                util.tip("该手机号已经被绑定过");
                                break;
                            case 40007:
                                util.tip("激活并修改手机号失败");
                                break;
                            case 40005:
                                util.tip("当前账户渠道优先级不是最高");
                                break;
                            case 404:
                                util.tip("当前账户未查询到会员卡");
                                break;
                            case 20001:
                                util.tip("当前账户未绑定手机号");
                                break;
                            default:

                        }
                    },
                    complete: function() {

                    },
                    error:function() {

                    }
                });
            }

        },
        //查询会员卡列表
        getInvoice(){
            let that = this;
            if(!this.subBtn) return;
            // 手机号
            if(!regex.test(this.phoneNum)){
                util.tip(msg.m10);
                return;
            }
            //
            if(this.phoneNum != this.subPhone){
                util.tip("手机号与验证码不匹配，请重新输入");
                return false;
            }

            // 账号类型
            if(!this.actype) {
                util.tip(msg.m1);
                return false;
            }
            // 账号类型有效性
            if(!ACTYPE[this.actype]) {
                util.tip(msg.m2);
                return false;
            }
            // 是否发送过验证码
            if(!this.uiqcd) {
                util.tip(msg.m8);
                return false;
            }
            // 验证码
            if(!this.vcode) {
                util.tip(msg.m9);
                return false;
            }
            if(!requestState.checkCode){
                return false;
            }
            //
            var params = {
                actype: that.actype,
                acphone: that.phoneNum,
                mac: that.vcode,
                uiqcd: that.uiqcd
            };
            var sendData = {
                // 会员类型
                actype:that.actype,
                // 会员手机号
                acphone: that.phoneNum,
                // 全局唯一编码
                uiqcd:that.uiqcd,
                //增加参数验证码
                mac:that.vcode,
                // int auto ,0代表手动输入的，1代表自动获取的
                auto:that.auto
            };
            that.getAcclist(sendData,params);
            //请求  这期去掉
           /* util.api({
                surl: root.LOGIN_API_PATH + 'validmob',
                data: {
                    code: this.vcode,
                    validrand: this.uiqcd,
                    mob:this.phoneNum
                },
                type: 'post',
                beforeSend: function() {
                    // 禁用按钮
                    requestState.checkCode = false;
                },
                success: function(response) {
                    var rpco = response.rpco,
                        body;

                    // 处理
                    switch(rpco) {
                        case 200:
                            body = response.body || {};
                            var params = {
                                actype: that.actype,
                                acphone: that.phoneNum,
                                mac: that.vcode,
                                uiqcd: that.uiqcd
                            };
                            if(that.hrefParma.page == 3){
                                params.cbu = 'electronicInvoice.html';
                            }
                            var sendData = {
                                // 会员类型
                                actype:that.actype,
                                // 会员手机号
                                acphone: that.phoneNum,
                                // 全局唯一编码
                                uiqcd:that.uiqcd,
                                //测试 增加参数验证码(原本没有)
                                 mac:that.vcode,
                                // int auto ,0代表手动输入的，1代表自动获取的
                                auto:that.auto
                            };
                            that.getAcclist(sendData,params);
                            break;
                        case 400:
                            util.tip("验证码错误或已失效，请重新输入");
                            break;
                        case 404:
                            util.tip("服务器繁忙，请稍后再试");
                            break;
                        case 500:
                            util.tip("验证码已过期");
                            break;
                        // 短信验证码错误
                        case 40001:
                            util.tip(msg.m11);
                            break;
                        // 短信验证码已超时
                        case 40002:
                            util.tip(msg.m12);
                            break;
                        case 40003:
                            util.tip('该手机号已经被绑定');
                            break;
                        case 40051:
                            util.tip('验证码错误');
                            break;
                        default:
                    }
                },
                complete: function() {
                    // 启用按钮
                    requestState.checkCode = true;
                },
                error:function() {
                    requestState.checkCode = true;
                }
            });*/

        },

        // 获取账户列表
        getAcclist(sendData,params){
            let that = this;

            // 请求...
            util.api({
                surl: root.MB_API_PATH + 'cordlist',
                data: sendData,
                type: 'get',
                success: function (response) {
                    var rpco = response.rpco,
                        body;

                    // 处理
                    switch (rpco) {
                        case 200:
                            body = response.body || {};
                            // 渲染
                            //只查询到一张会员卡且未绑定
                            if(body.aclist.length===1&&parseInt(body.aclist[0].isBinding) === 2){
                                that.bindCard({
                                    actype: that.actype,
                                    acnum: body.aclist[0].acnum,
                                    acrdm: body.aclist[0].acrdm,
                                    state: util.OPT_STATE.UPDATE
                                })
                            }
                            //只查询到一张会员卡且已经绑定
                            else if(body.aclist.length===1&&parseInt(body.aclist[0].isBinding)===1){
                                util.tip(msg.m14);
                            }
                            // 查询到多张会员卡
                            else if(body.aclist.length>1){
                                var num = 0;
                                $.each(body.aclist,(index,val)=>{
                                    //多张卡中有未绑定的卡
                                    if(parseInt(val.isBinding)=== 2){
                                        // 跳转查询会员卡列表页
                                        num++;
                                    }
                                })
                                //多张卡有未绑定的卡
                                if(num>0){
                                    let ss = window.sessionStorage;
                                    ss.setItem("aclist",JSON.stringify(body.aclist));
                                    util.href('./accsearchresultnew.html', params, true);
                                }else{
                                    // 多张卡均已绑定
                                    util.tip(msg.m14);
                                }

                            }
                            break;
                        // 没有找到对应数据 当前账户未查询到会员卡
                        case 404:
                            util.tip('该手机号暂未绑定会员卡',2000);
                            break;
                        case 500:
                            util.tip('服务器繁忙，请稍后再试');
                            break;
                        case 40001:
                            util.tip('只支持一次查询，请重复上一页面操作');
                            break;
                        case 40003:
                            util.tip('验证码错误，请重新输入');
                            break;
                        case 40006:
                            util.tip('该手机号已经被绑定过');
                            break;
                        case 40007:
                            util.tip('激活并修改手机号失败');
                            break;
                        case 40005:
                            util.tip('该手机号已被其他渠道使用，请解绑后重新尝试');
                            break;
                        case 40010:
                            util.tip('该手机号已被其他渠道使用，请解绑后重新尝试');
                            break;
                        case 20001:
                            util.tip('当前账户未绑定手机号');
                            break;
                        case 40009:
                            util.tip('仅有的门店会员卡是门店老用户的');
                            break;
                        default:
                            util.tip('服务器繁忙，请稍后再试');
                    }
                }
            });
        },
        //绑定会员卡
        bindCard(account){
            // 请求...
            util.api({
                surl: root.MB_API_PATH + 'modacc',
                data: account,
                type: 'post',
                beforeSend: function () {
                    // 禁用按钮
                    requestState.save = false;
                    //
                },
                success: function (response) {
                    var rpco = response.rpco;

                    // 处理
                    switch (rpco) {
                        case 200:
                            util.tip('绑定成功',2000);
                            setTimeout(function(){
                                window.location.reload(true);
                            },1000)
                            break;
                        // 短信验证码错误
                        case 40001:
                            util.tip(msg.m11);
                            break;
                        // 短信验证码已超时
                        case 40002:
                            util.tip(msg.m12);
                            break;
                        // 手机号错误
                        // case 40003:
                        //     util.tip(that.options.msg.m13);
                        //     break;
                        // 会员卡已绑定
                        case 40004:
                            util.tip(msg.m14);
                            break;
                        case 40009:
                            util.tip(msg.m14);
                            break;
                        default:
                            //util.tip('保存失败');
                    }
                },
                complete: function () {
                    // 启用按钮
                    requestState.save = true;
                }
            });
        },
        //切换绑卡规则展示状态
        showRule(){
            this.ruleOn = !this.ruleOn;
        }


    },
    components:{
        cardRule
    }
}

</script>

<style lang="less" type="text/less">
@import '../../util/fs.less';
.wapper{
    position: absolute;
    top: 1.12rem;
    bottom:0;
    padding-top:0;
    width: 100%;
    background-color: #fff;
}
#acclistnew{
    .checkCard{
        .checkbox{
            background-color: #fff;
            padding-bottom:1.066667rem;
        }
        h2{
            background-color: #fff;
            padding: 0.4rem 0;
            img{
                width: 2.666667rem;
                height: 0.706667rem;
                margin:0 auto;
                display: block;
            }
        }
        .sctp2 {
            background: #fff;
            text-align: center;
            .px2rem(margin-top,40);
            img {
                .px2rem(width,671);
                .px2rem(height,320);
                display: inline-block;
            }
        }
        /*.actype{
            background: #fff;
            padding-left: 0.28rem;
            li{
                width: 4.533333rem;
                height: 2.2rem;
                float: left;
                margin:0 0.093333rem 0.16rem;
                position: relative;
                img{
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top:0;
                    left:0;
                }
                &.on{
                    .acmask{
                       position: absolute;
                       width: 4.32rem;
                       height: 1.826667rem;
                       top:0.08rem;
                       left:0.106667rem;
                       border-radius: 0.24rem;
                       background-color: rgba(0,0,0,.5);
                       background-image: url(//gfs12.gomein.net.cn/T1.6VvBmbb1RCvBVdK.png);
                       background-repeat: no-repeat;
                       background-position: center;
                       background-size: 0.666667rem 0.666667rem;
                    }
                }
            }

        };*/
        .securelist{
            padding-left: 0.32rem;
            padding-top:0.466667rem;
            background-color: #fff;
            li{
                width: 100%;
                padding: 0.266667rem 0;
                height: 0.666667rem;
                line-height:0.666667rem;
                .mixinfont(14px);
                input{
                    margin-left: 0.533333rem;
                    width:3.466667rem;
                    &.off {
                        color: #E0E0E0;
                    }
                };
                #sendCode{
                    width: 2.666667rem;
                    float: right;
                    text-align: center;
                    color: #FFB7B5;
                    &.on{
                        color:rgb(255, 75, 70);
                    }
                }
            }
        };
        .drawTip{
            margin-top: 0.266667rem;
            text-indent: 0.32rem;
            color: #777777;
            .mixinfont(14px);
            a{
                text-decoration: underline!important;
                color: #007aff;
            }
            .i-selquangou {
                display: inline-block;
                width: 0.426667rem;
                height: 0.426667rem;
                background: url(//img.dev.gomegj.com/guanjia/v2/radio.png) no-repeat;
                background-size: contain;
                vertical-align: middle;
                &.on{
                    background-image: url(//img.dev.gomegj.com/guanjia/v2/quangou.png);
                }
            }
        };
        .subBtn{
            padding: 0 0.533333rem;
            .subBtnLink{
                display: block;
                margin-top: 1.066667rem;
                height: 1.173333rem;
                line-height: 1.173333rem;
                color: #fff;
                text-align: center;
                background-color: #E0E0E0;
                border-radius:0.106667rem;
                .mixinfont(16px);
                &.on{
                    background-color: #FF493F;
                }
            }

        };
    };
}
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #d6d6d6; opacity:1;
}

::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #d6d6d6;opacity:1;
}

input:-ms-input-placeholder{
    color: #d6d6d6;opacity:1;
}

input::-webkit-input-placeholder{
    color: #d6d6d6;opacity:1;
}



</style>