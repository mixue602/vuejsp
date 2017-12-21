<template>
	<div id="invoicedraw" class="wapper">
        <header-component :title='title'></header-component>
        <div class="wapper_tip">
            <ul class="securelist">
                <span class="code_message" v-show="code_message">验证码</span>
                <li id="papersNum" :class="{'inpCha2':bigInp2}">
                    <input class="js-number"  @input='isSubmit'  id="vcode"  v-model='vcode' placeholder="请输入验证码" maxlength="6">
                    <span class='bdr-l' id="sendCode" @click='getVcode' :class='{"on":vcodeOn}'>重新获取</span>
                </li>
            </ul>
            <p class="codeErr" v-show="codeerror">您输入的验证码不正确，请重新输入</p>
            <div class="mes_p">
                <p>若无法收到验证码，请拨打客服电话</p>
                <p>400-811-3333</p>
            </div>
        </div>
    </div>
</template>

<script type="ecma6.0">
import headerComponent from '../../components/HeaderComponent';
let root = window || {},
    util = root.util || {},
    requestState={
        sendcode:true,
        save:true
    },
    regex = /^1[345789]\d{9}$/;
export default {
	data () {
		return {
			title:'填写验证码',
            phoneNum:'',
            subPhone:'',
            vcode:'',
            validrand:'',
            vcodeOn:false,
            // subBtn:false,
            code_message:false,
            codeerror:false,
            bigInp1:false,//输入框有内容输入后字体样式变化
            bigInp2:false
        }
	},
  	created() {
        if(util.isApp()){
            util.deleteHeadBtn();
        }
        this.hrefParma = util.getHrefParma();   
        this.validrand = this.hrefParma.validrand;
        this.$nextTick(function () {
            this.countDown()
        }); 
        
    },
    mounted(){
        
    },
    methods:{
        // 是否提交
        isSubmit(){
            let that = this;
            if(that.vcode.length>0){
                that.bigInp2 = true;
                that.code_message = true;
            }else{
                that.code_message = false;
                that.bigInp2 = false;
            }
            // 提交按钮是否可点
            if(that.vcode.length==6){
                if(/[0-9]+/g.test(that.vcode)){
                    that.getInvoice();
                }else{
                    that.codeerror = false;
                }
            }else{
                that.codeerror = false;
            }
        },
        // 获取验证码
        getVcode(){
            let that = this;
            // debug start
                // if(!regex.test(this.phoneNum)){
                //     util.tip('请输入正确的手机号码');
                //     return;
                // }
                // that.phonebox = false;
                // that.codebox = true;
                // // that.validrand = body.validrand;
                // that.subPhone = that.phoneNum;
                // that.sendcode = false;
                // that.countDown();
            // debug end

            // if(this.phoneNum.length!=11 || !this.vcodeOn){
            //     return false;
            // }
            // if(!regex.test(this.phoneNum)){
            //     util.tip('请输入正确的手机号码');
            //     return false;
            // } 
            if(!requestState.sendcode){
                return false;
            }
            util.api({
                surl:root.EINVOICE_API_PATH + 'sendcode',
                type:'get',
                data:{
                    mob: that.hrefParma.mob
                },
                beforeSend(){
                    requestState.sendcode = false;
                },
                success(res) {
                    var rpco = res.rpco,
                        body = res.body;
                    // 处理
                    switch(rpco) {
                        case 200:
                            that.validrand = body.validrand;
                            that.countDown();
                        break;
                        case 20002:
                            util.tip('已为您发送短信验证码，请耐心等待，1分钟内只可获取一次',2000);
                            break;
                        case 20003:
                            util.tip('您获取验证码次数过于频繁，请稍后重新尝试',2000);
                            break;
                        case 404:
                            util.tip('服务器繁忙，请稍后再试',2000);
                            break;
                        default:
                            util.tip('请求失败');
                    }
                },
                complete(res){
                    if(res.rpco!==200){
                        requestState.sendcode = true;
                    } 
                }
            })
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
                    // that.changeVcode();
                    that.vcodeOn = true;
                }
            });
        }, 
        getInvoice(){
            let that = this;
            // if(!this.subBtn) return;
            if(!requestState.save){
                return false;
            }
            // if(!regex.test(this.phoneNum)){
            //     util.tip('请输入正确的手机号码');
            //     return false;
            // }
            // if(this.phoneNum != this.subPhone){
            //     that.codeerror = true;
            //     util.tip("手机号和验证码不匹配");
            //     return false;
            // }
            util.api({
                surl:root.EINVOICE_API_PATH + 'validmob',
                type:'post',
                data:{
                    validrand: that.hrefParma.validrand,
                    code: that.vcode,
                    mob: that.hrefParma.mob
                },
                beforeSend(){
                    requestState.save=false;
                },
                success(res) {
                    var rpco = res.rpco,
                        body = res.body;
                    // 处理
                    switch(rpco) {
                        case 200:
                            that.codeerror = false;
                            // 跳转到发票列表页
                            if(body){
                                setTimeout(function(){
                                    util.href('electronicInvoice.html');
                                }, 300)
                            }else{
                                util.tip('您暂无尚未被领取的电子发票',{duration:3000})
                                setTimeout(function(){
                                    util.href('electronicInvoice.html');
                                }, 1000)
                            } 
                        break;
                        case 40001:
                            that.codeerror = true;
                            util.tip('验证码有误，请重新输入',{duration:2000});
                            break;
                        case 500:
                            util.tip('服务器繁忙，请稍后再试',{duration:2000});
                            break;
                        default:
                            util.tip('请求失败');
                    }
                },
                complete(){
                    requestState.save=true;
                }
            })

        }

    },
	components: {
		headerComponent
	}
}

</script>

<style lang="less">
@import '../../util/fs.less';
html{
    background-color:#fff;
}
#invoicedraw{
    .wapper{
        box-sizing: border-box;
        padding:3.186667rem 1.066667rem 0;
         .securelist{
            padding-left: 1rem;
            box-sizing: border-box;
            background-color: #fff;
            background: url(//gfs11.gomein.net.cn/T1bDDvBmC_1RCvBVdK.png) 0.25rem center no-repeat;
            background-size: auto 0.45333333rem;
            border-bottom: 1px solid #ddd;
            li{
                width: 100%;
                padding: 0.266667rem 0;
                height: 0.8rem;
                line-height:0.8rem;
                .mixinfont(14px);
                input{
                    width:100%;
                };
            }
            .inpCha1{
                height: 0.8rem;
                line-height:0.8rem;
                font-size: .7rem;
            }
        }
    }
    .wapper_tip{
        width:100%;
        box-sizing: border-box;
        padding:3.186667rem 1.066667rem 0;
        .securelist{
            box-sizing: border-box;
            background-color: #fff;
            border-bottom: 1px solid #ddd;
            position: relative;
            .code_message{
                position:absolute;
                top: -.5rem;
                color:#BFBFBF;
            }
            li{
                width: 100%;
                padding: 0.266667rem 0;
                height: 0.8rem;
                line-height:0.8rem;
                .mixinfont(14px);
                input{
                    width:60%;
                }
            }
            .inpCha2{
                height: 0.8rem;
                line-height:0.8rem;
                font-size: .7rem;
                span{
                   height: 0.8rem;
                   line-height:0.8rem;
                   .mixinfont(14px); 
                }
            }
        }
        .codeErr{
               font-size: 0.373333rem;
               line-height:1rem;
               color:#FF4B41;
               text-align:left;
        }
        #sendCode{
             width: 2.666667rem;
             float: right;
             text-align: center;
             color:#BFBFBF;
             &.on{
                 color: #FF4B41;
             }
        }
        .mes_p{
            width:7.866667rem;
            position:fixed;
            bottom: 0;
        }
        p{
            font-size: 0.373333rem;
            line-height:0.533333rem;
            color:#666;
            text-align:center;
        }
    }

    .drawTip{
        margin-top: 0.266667rem;
        text-indent: 0.32rem;
        color: #777777;
        .mixinfont(12px);
    }
    .subBtn{
        display: block;
        .subBtnLink{
            display: block;
            margin-top: 1.066667rem;
            height: 1.173333rem;
            line-height: 1.173333rem;
            color: #fff;
            text-align: center;
            background-color: #E0E0E0;
            border-radius: .9rem;
            .mixinfont(16px);
            &.on{
                background-color: #FF493F;
            }
        }

    }

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