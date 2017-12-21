<template>
    <div class="wapper">
        <header-component :title='title'></header-component>
        <div class="container">
            <ul class="message-list-now">
                <li class="bdr-bottom">
                    <a href="javascript:void(0);" class="clearfix" @click="hrefToUrl({'type':'1'})">
                        <div class="message-list-icon"></div>
                        <div class="message-list-info">
                            <div>客户服务</div>
                            <div>实时联系客服查询订单</div>
                        </div>
                        <span class="message-list-next"></span>
                    </a>
                </li>
                <li class="bdr-bottom">
                    <a href="javascript:void(0);" class="clearfix" @click="hrefToUrl({'type':'2'})">
                        <div class="message-list-icon1">
                            <span v-if="logisticsUnReadNum>0"></span>
                        </div>
                        <div class="message-list-info">
                            <div class="clearfix">
                                <span class="f-l">物流安装通知</span>
                                <span class="message-time" v-if="logisticsInstall.newDateTime<logisticsInstall.stateUpdateTime">{{logisticsInstall.stateUpdateTime | formatDate1}}</span>
                                <span class="message-time" v-else>{{logisticsInstall.stateUpdateTime | formatDate2}}</span>
                            </div>
                            <div class="more-desc">{{logisticsInstall.messageContent}}</div>
                        </div>
                    </a>
                </li>
                <li class="bdr-bottom">
                    <a href="javascript:void(0);" class="clearfix" @click="hrefToUrl({'type':'3'})">
                        <div class="message-list-icon2">
                            <span v-if="serviceNoteUnReadNum>0"></span>
                        </div>
                        <div class="message-list-info">
                            <div class="clearfix">
                                <span class="f-l">服务通知</span>
                                <span class="message-time" v-if="serviceNote.newDateTime<serviceNote.stateUpdateTime">{{serviceNote.stateUpdateTime | formatDate1}}</span>
                                <span class="message-time" v-else>{{serviceNote.stateUpdateTime | formatDate2}}</span>
                            </div>
                            <div class="more-desc">{{serviceNote.messageContent}}</div>
                        </div>
                    </a>
                </li>
                <!-- <li class="bdr-bottom">
                    <a href="javascript:;" class="clearfix">
                        <div class="message-list-icon3">
                            <span></span>
                        </div>
                        <div class="message-list-info">
                            <div class="clearfix">
                                <span class="f-l">优惠促销</span>
                                <span class="message-time">9:34</span>
                            </div>
                            <div class="more-desc">您有一批优惠券等待领取</div>
                        </div>
                    </a>
                </li> -->
            </ul>
            <!-- <div class="message-title">历史消息</div>
            <ul class="message-list-history">
                <li class="bdr-bottom">
                    <a href="javascript:" class="clearfix">
                        <div class="message-list-icon">
                            <img src="//gfs12.gomein.net.cn/T18_JvBvZg1RCvBVdK.jpg" alt="">
                            <span></span>
                        </div>
                        <div class="message-list-info message-list-next">
                            <div>客户服务</div>
                            <div>试试联系客服查询订单</div>
                        </div>
                    </a>
                </li>
                <li class="bdr-bottom">
                    <a href="javascript:;" class="clearfix">
                        <div class="message-list-icon1">
                            <img src="//gfs12.gomein.net.cn/T18_JvBvZg1RCvBVdK.jpg" alt="">
                            <span></span>
                        </div>
                        <div class="message-list-info">
                            <div class="clearfix">
                                <span class="f-l">物流安装信息</span>
                                <span class="message-time">9:34</span>
                            </div>
                            <div class="more-desc">试试联系客服查询订单试试联系客服查询订单试试联系客服查询订单</div>
                        </div>
                    </a>
                </li>
                <li class="bdr-bottom">
                    <a href="javascript:;" class="clearfix">
                        <div class="message-list-icon2">
                            <img src="//gfs12.gomein.net.cn/T18_JvBvZg1RCvBVdK.jpg" alt="">
                            <span></span>
                        </div>
                        <div class="message-list-info">
                            <div class="clearfix">
                                <span class="f-l">物流安装信息</span>
                                <span class="message-time">9:34</span>
                            </div>
                            <div class="more-desc">试试联系客服查询订单试试联系客服查询订单试试联系客服查询订单</div>
                        </div>
                    </a>
                </li>
                <li class="bdr-bottom">
                    <a href="javascript:;" class="clearfix">
                        <div class="message-list-icon3">
                            <img src="//gfs12.gomein.net.cn/T18_JvBvZg1RCvBVdK.jpg" alt="">
                            <span></span>
                        </div>
                        <div class="message-list-info">
                            <div class="clearfix">
                                <span class="f-l">物流安装信息</span>
                                <span class="message-time">9:34</span>
                            </div>
                            <div class="more-desc">试试联系客服查询订单试试联系客服查询订单试试联系客服查询订单</div>
                        </div>
                    </a>
                </li>
            </ul> -->
        </div>
        <foot-component :index="2"></foot-component>
    </div>
</template>
<script>
import headerComponent from '../../components/HeaderComponent';
import footComponent from '../../components/FootComponents';
   
export default {
    data () {
        return {
            title:'消息中心',
            //物流安装数据
            logisticsInstall:{},
            //初始化物流安装信息未读消息为0条
            logisticsUnReadNum:0,
            //服务通知数据
            serviceNote:{},
            //服务通知未读消息为0
            serviceNoteUnReadNum:0,
           
        };
    },
    methods:{
        //判断用户是否登录
        isLogin(){
            util.api({
                surl: root.LOGIN_API_PATH + 'userinfo',
                type: 'get',
                success: function(response) {
                    let rpco = response.rpco,
                        body = response.body || [];
                    //处理
                    switch(rpco) {
                        case 200:
                           //正常登录
                        break;
                        //未登录
                        case 401:
                            GomeJSBridge.login(null,null);
                            break;
                        //其他异常情况
                        default:
                            util.tip('服务器繁忙，请稍后再试');
                    }
                },
                complete: function() {
                    //移除提示
                    util.remComShow();
                }
            }); 
        },
        //点击跳转到对应列表页
        hrefToUrl(obj){
            let that = this,
                host = window.location.host;
            switch(obj.type){
                 case '1': //客户服务
                    if(util.isApp()){
                        util.pushWindow('http://'+host+'/yf/custservice.html');
                    }else{
                        util.href('./custservice.html');
                    }
                    break;
                 case '2':  //物流安装
                    that.logisticsUnReadNum=0;
                    if(util.isApp()){
                        util.pushWindow('http://'+host+'/yf/logisticsintall.html');
                    }else{
                        util.href('./logisticsintall.html');
                    }
                    break;
                 case '3': //服务
                    that.serviceNoteUnReadNum=0;
                    if(util.isApp()){
                        util.pushWindow('http://'+host+'/yf/sermessage.html');
                    }else{
                        util.href('./sermessage.html');
                    }
                    break;
                 default:
            }
        },
        /**
         * 获取物流安装消息\服务最新消息，未读已读消息
         */
        getInfo(){
            let that = this;
            util.api({
                //surl:'/resources/json/message.json',
                surl: root.ME_API_PATH + 'center/home',
                type: 'get',
                success: function(response) {
                    let rpco = response.rpco,
                        body = response.body || [];
                    //处理
                    switch(rpco) {
                        case 200:
                            //处理服务器0点时间戳
                           let oDate = new Date(response.tsrp) || new Date(),
                            year = oDate.getFullYear(),
                            month = oDate.getMonth(),
                            day = oDate.getDate(),
                            newDate = new Date(year,month,day,0,0,0),
                            //服务器0点时间戳
                            newDateTime = newDate.getTime();
                        for(let i=0;i<body.length;i++){
                            if(Number(body[i].msgType)==1){
                                that.logisticsInstall = body[i].data[0] || {};
                                that.logisticsInstall.newDateTime = newDateTime;
                                that.logisticsUnReadNum = body[i].unReadNum;

                            }else if(Number(body[i].msgType)==2){
                                that.serviceNote = body[i].data[0] || {};
                                that.serviceNoteUnReadNum = body[i].unReadNum;
                                that.serviceNote.newDateTime = newDateTime;
                            }
                        }
                       
                        break;
                        //没有找到对应数据
                        case 401:
                            util.tip('您当前网络异常，请稍后重试');
                            break;
                        default:
                            util.tip('您当前网络异常，请稍后重试');
                    }
                },
                complete: function() {
                    //移除提示
                    util.remComShow();
                }
            }); 
            
        }
    },
    filters: {
        formatDate1(time) { //等于今天的过滤器
            let times = Number(time);
            return util.formateDate(times, "hh:mm");
        },
        formatDate2(time) { //昨天的过滤器
            let times = Number(time);
            return util.formateDate(times, "yyyy-MM-dd");
        }
    },
    created(){
        if(util.isApp()){
            util.deleteHeadBtn();
            //判断用户是否登录
            this.isLogin();
        }
        this.getInfo();
    },
    components: {
        headerComponent,
        footComponent
    }
}
</script>
<style lang="less">
    /* @import './css/reset.css'; */
    .mixinfont (@font){
        font-size: @font; 
        [data-dpr="2"] & { font-size: @font * 2; } 
        [data-dpr="3"] & { font-size: @font * 3; } 
     }

     .px2rem(@name,@px){
        @{name}: (@px/75)*1rem;
     }
    .px2remall(@name,@px1,@px2){
            @{name}: (@px1/75)*1rem (@px2/75)*1rem;
    }
    /* 公共头部 */
    
    body,html{
        background:#fff!important;
    }

    /* 公共内容区 */
    .container {
        min-width: 320px;
        background-color: #f5f5f5;
        overflow-x: hidden;
        overflow-y: auto;
        position: absolute;
        top: 1.173333rem;
        bottom: 0;
        -webkit-overflow-scrolling: touch;
        z-index:999;
    }
    .message-list-now,.message-list-history{
        font-family: 'PingFangSC-Regular',sans-serif;
        .mixinfont(14px);
        background:#fff;
        li{
            display: flex;
            position: relative;
            margin-left:(20/75)*1rem;
            padding:(20/75px)*1rem 0 (20/75px)*1rem 0;
            &:after{
                height: 1px;
                content: '';
                width: 100%;
                border-top: 1px solid #D1D3D3;
                position: absolute;
                bottom: -1px;
                right: 0;
                z-index: 10
            }
            &:last-child{
                 &:after{
                   display: none;
                }
            }
            .message-list-icon,.message-list-icon1,.message-list-icon2,.message-list-icon3{
                float:left;
                width:(98/75)*1rem;
                height:(98/75)*1rem;
                background:url('//gfs13.gomein.net.cn/T1RLWvB_Jg1RCvBVdK.png') 0 0 no-repeat;
                background-size: 100%;
                margin-right:(20/75px)*1rem;
                position:relative;
                span{
                    position: absolute;
                    width:(15/75)*1rem;
                    height:(15/75)*1rem;
                    overflow:hidden;
                    background:#FF5061;
                    border:2px  #fff solid;
                    border-radius:50%;
                    top: -(5/75)*1rem;
                    right: -0.14rem;
                }
            }
            .message-list-icon1{
                background-image:url('//gfs10.gomein.net.cn/T1nihvBKLv1RCvBVdK.png');
            }
            .message-list-icon2{
                background-image:url('//gfs12.gomein.net.cn/T1dQJvBCb_1RCvBVdK.png');
            }
            .message-list-icon3{
                background-image:url('//gfs13.gomein.net.cn/T1QuJvBshv1RCvBVdK.png');
            }
            .message-list-info{
                float:left;
                width:(612/75)*1rem;
                line-height:(44/75)*1rem;
                color:#999;
                padding-top: (4/75)*1rem;

                div:nth-child(1){
                    line-height:(48/75)*1rem;
                    color:#333;
                    .mixinfont(17px);
                }
                div:nth-child(2){
                    height:(42/75)*1rem;
                    line-height: (42/75)*1rem;
                    white-space:nowrap;
                    text-overflow:ellipsis;
                    overflow:hidden;
                    .mixinfont(15px);
                }
                .message-time{
                    float:right;
                    .mixinfont(12px);
                    color:#999;
                    margin-right: (26/75)*1rem;
                }
                .f-l{
                    float:left;
                }
                .more-desc{
                    width: (548/75)*1rem;
                    height: (42/75)*1rem;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            .message-list-next{
                width: (24/75)*1rem;
                height:(24/75)*1rem;
                position: absolute;
                top: 50%;
                right:(32/75)*1rem;
                margin-top:-(12/75)*1rem;
                background-image:url(./img/message-next.png);
                background-size: (24/75px)*1rem (24/75px)*1rem;
            }
            
        }
    }
    .message-title{
        padding-left:(20/75)*1rem;
        .mixinfont(14px);
        color:#999;
        height:(52/75)*1rem;
        line-height:(52/75)*1rem;
        background: #F3F5F7;
    }
    .message-list-history{
        li{ 
            &:last-child{
                 &:after{
                     display: none;
                }
            }
            .message-list-icon,.message-list-icon1,.message-list-icon2,.message-list-icon3{
                background:none;
                img{
                    width:100%;
                    height:100%;
                    border-radius:4px;
                }
            }
              
            .message-list-info div:nth-child(1){
                color: #000;
            }
            .message-list-info div:nth-child(2){
                color: #9F9F9F;
            }
        }
    }
    @media (-webkit-min-device-pixel-ratio: 1.5),(min-device-aspect-ratio: 1.5){
        .bdr-bottom:after{
            -webkit-transform : scaleY(0.7);
            transform : scaleY(0.7);
        }
    }
    @media (-webkit-min-device-pixel-ratio: 2),(min-device-aspect-ratio: 2){
        .bdr-bottom:after{
            -webkit-transform : scaleY(0.5);
            transform : scaleY(0.5);
        }
    }



</style>