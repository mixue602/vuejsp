<template>
	  <div id="acclistnew">
       <!--  <div class="header">
            <a class="goBack" @click="fnHref"><i></i></a>
            <span class="title">{{ title }}</span>
        </div> -->
        <header-component :title='title'></header-component>
        <div class="wapper">
             <ul class="list-text">
                <li v-for='(item,index) in aclist' @click='changeSel(index)'>
                    <i class="i i-radio js-radio" :class='{"on":index==currentIndex,"binded":parseInt(item.isBinding)===1}'></i>
                    <i class="accicon i" :class='parseInt(item.isBinding)!==1?actypeObj.classnm : actypeObj.wxclass'></i>
                    <p class="acctype">{{actypeObj.name}}</p>
                    <p class="acccode">卡号</p>
                    <p class="accnum">{{item.acnum}}</p>
                </li>
            </ul>
            <div class="tishi">仅允许绑定一张会员卡，请谨慎选择</div>
            <footer class="subBtn" @click='bindCard' :class='{"on": currentIndex!==null}'>绑定</footer>
        </div>
       
    </div>
</template>

<script type="ecma6.0">
import headerComponent from '../../components/HeaderComponent';

let root = window || {},
    util = root.util || {};
    let  actypeObj= {
            '1':{   actype: '1',
                name:'国美会员卡',
                classnm:'i-gomecard',
                wxclass:'i-wxgomecard'
            },
            '2':{   actype: '2',
                name:'永乐会员卡',
                classnm:'i-yonglecard',
                wxclass:'i-wxyonglecard'
            },
            '3':{   actype: '3',
                name:'大中会员卡',
                classnm:'i-dazhongcard',
                wxclass:'i-wxdazhongcard'
            },
            '6':{   actype: '6',
                name:'极信国美卡',
                classnm:'i-gomecardjx',
                wxclass:'i-wxcardjx'
            },
            '7':{   actype: '7',
                name:'极信大中卡',
                classnm:'i-dazhongcardjx',
                wxclass:'i-wxcardjx'
            },
            '8':{   actype: '8',
                name:'极信永乐卡',
                classnm:'i-yonglecardjx',
                wxclass:'i-wxcardjx'
            }
        },
        msg= {
            m11: '短信验证码有误，请重新获取',
            m12: '短信验证码已超时，请重新获取',
            m13: '手机号有误，请重新尝试',
            m14: '会员卡已被绑定，不能重复绑定'
        },
        requestState={
            save:true
        }
export default {
	data () {
		return {
			title:'卡号绑定',
            aclist:[],
            actypeObj:{},
            currentIndex:null,
        }
	},
  	created() {
        this.hrefParma = util.getHrefParma();
        if(util.isApp()){
            util.deleteHeadBtn();
        }
        this.actypeObj = actypeObj[this.hrefParma.actype]; 
        let ss = window.sessionStorage;
        this.aclist = ss.getItem("aclist");
        if(!!ss.getItem("aclist")){
            this.aclist = JSON.parse(ss.getItem("aclist"));
            return;
        }
    },
    methods:{
        // 获取账户列表
        getAcclist(sendData){
            let that = this;
            // 请求...
            util.api({
                surl: root.MB_API_PATH + 'unacclist',
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
                             that.aclist = body.aclist;
                            break;
                        // 没有找到对应数据
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
                            util.tip('手机号错误，请重新输入');
                            break;
                        case 40004:
                            util.tip('会员卡已被绑定，不能重复绑定');
                            break;
                        case 40009:
                            util.tip('会员卡已被绑定，不能重复绑定');
                            break;
                        default:
                            util.tip('服务器繁忙，请稍后再试');
                    }
                }
            });
        },
        // 切换要绑定的会员卡
        changeSel(index){
            if(parseInt(this.aclist[index].isBinding)===1){
                return;
            }
            this.currentIndex = index;
        },
        //绑定会员卡
        bindCard(){
            let that=this,currentIndex = this.currentIndex;
            if(parseInt(this.aclist[currentIndex].isBinding)===1){
                return;
            }
            let account= {
                actype: this.hrefParma.actype,
                acnum: this.aclist[currentIndex].acnum,
                acrdm: this.aclist[currentIndex].acrdm,
                state: util.OPT_STATE.UPDATE
            }

            // 请求...
            util.api({
                surl: root.MB_API_PATH + 'modacc',
                data: account,
                type: 'post',
                beforeSend: function () {
                    // 禁用按钮
                    requestState.save = false;
                },
                success: function (response) {
                    var rpco = response.rpco;

                    // 处理
                    switch (rpco) {
                        case 200:
                            util.tip('绑定成功');
                            if(that.hrefParma.cbu){
                                var params = {
                                    cbu: that.hrefParma.cbu
                                }
                            }
                            setTimeout(function(){
                                util.href('acclist.html',params)
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
                            util.tip('绑定失败');
                    }
                },
                complete: function () {
                    // 启用按钮
                    requestState.save = true;
                }
            });
        }
    },
	components: {
        headerComponent
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
    max-width: 10rem;
}
.tishi {
    color: #666666;
    .mixinfont(14px);
    .px2rem(margin-top,20);
    text-align: center;
}
.list-text {
    padding-left: 0;
    background-color: #f5f5f5;
    li {
        padding: 0.373333rem 0.213333rem 0.373333rem 1.066667rem;
        background: #fff;
        margin-top: 0.266667rem;
        height: 1.333333rem;
        position: relative;
        &.binded{
            /* background-color: #fcfcfc; */
        }
        i{
            font-style: normal;
            position: absolute;
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            border-radius: 2px;
            &.i-radio {
                width: 0.426667rem;
                height: 0.426667rem;
                background-image: url(//img.gomegj.com/guanjia/v2/radio.png);
                top: 0.8rem;
                left: 0.373333rem;
                z-index: 100;
                &.on{
                    background-image: url(//gfs12.gomein.net.cn/T1P7dvBCbv1RCvBVdK.png);
                }
                &.binded{
                    background-image: url(//gfs13.gomein.net.cn/T1u0KvBv_T1RCvBVdK.png);
                }
            }
            &.i-gomecard {
                width: 1.2rem;
                height: 1.2rem;
                background-image: url(//img.gomegj.com/guanjia/v2/gomecard.png);
            }
            &.i-wxgomecard {
                width: 1.2rem;
                height: 1.2rem;
                background-image: url(//gfs11.gomein.net.cn/T1r0ZvBKW_1RCvBVdK.png);
            }
            &.i-yonglecard {
                width: 1.2rem;
                height: 1.2rem;
                background-image: url(//img.gomegj.com/guanjia/v2/yonglecard.png);
            }
            &.i-wxyonglecard {
                width: 1.2rem;
                height: 1.2rem;
                background-image: url(//gfs12.gomein.net.cn/T1H0hvBybj1RCvBVdK.png);
            }
            &.i-dazhongcard {
                width: 1.2rem;
                height: 1.2rem;
                background-image: url(//img.gomegj.com/guanjia/v2/dazhongcard.png);
            }
            &.i-wxdazhongcard {
                width: 1.2rem;
                height: 1.2rem;
                background-image: url(//gfs12.gomein.net.cn/T1w7dvB_xv1RCvBVdK.png);
            }
            &.i-gomecardjx {
                width: 1.2rem;
                height: 1.2rem;
                background-image: url(//img.gomegj.com/guanjia/v2/gomecardjx.png);
            }
            &.i-wxcardjx {
                width: 1.2rem;
                height: 1.2rem;
                background-image: url(//gfs10.gomein.net.cn/T196WvBKAb1RCvBVdK.png);
            }
            &.i-dazhongcardjx {
                width: 1.2rem;
                height: 1.2rem;
                background-image: url(//img.gomegj.com/guanjia/v2/dazhongcardjx.png);
            }
            &.i-yonglecardjx {
                width: 1.2rem;
                height: 1.2rem;
                background-image: url(//img.gomegj.com/guanjia/v2/yonglecardjx.png);
            }
        }
        
        .acctype {
            color: #333;
            .mixinfont(16px);
            padding-left: 1.6rem;
            padding-top:0.08rem;
        }
        .acccode {
            color: #777;
            .mixinfont(14px);
            padding-left: 1.6rem;
            padding-top: 0.08rem;
            float: left;
        }
        .accnum {
            color: #333;
            .mixinfont(14px);
            padding-top: 0.08rem;
            float: right;
        }
    }
}
footer{
    position: fixed!important;
    left: 0;
    bottom: 0;
    z-index: 9999;
    width: 100%;
    height: 1.306667rem;
    line-height: 1.306667rem;
    text-align: center;
    background-color: #E0E0E0;
    color: #fff;
    .mixinfont(16px);
    &.on{
        background-color: #ff4b46;
    }
}



</style>