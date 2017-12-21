<template>
    <div class="serMessage">
        <header-component :title='title'></header-component>
        <div class="container" :class="containerBg" ref="J_Scroll">
            <div class="xs-container">
				<div class="xs-content">
                    <ul class="message-list" v-show="!isNoList">
                        <template  v-for="(item, index) in list">
                            <li class="message-li" :key="index">
                            <p class="time">{{item.stateUpdateTime | formatDate }}</p> 
                            <div class="order-box" @click="hrefToUrl(item)">
                                    <div class="title-box">
                                        <h2>{{item.orderStateDesc}}</h2>
                                        <span class="express">国美管家</span>
                                    </div>
                                    <div class="order-content">
                                        <img class="img" src="" v-lazy="item.goodsPic">
                                        <div class="order-desc">  
                                            <p class="order-type">{{item.businessTypeName}}服务</p>  
                                            <p class="order-name">{{item.goodsName}}</p>
                                            <p class="order-number">订单编号：{{item.orderNo}}</p>
                                        </div>
                                    </div>
                            </div>
                            </li>
                        </template>
                    </ul>
                    <div class="tuwen" v-show="isNoList">
                        <div class="tu">
                            <i class="i i-order"></i>
                        </div>
                        <p class="wen">暂无服务消息哦~</p>
                    </div>
				</div>
            </div>
        </div> 
    </div>
</template>

<script type="ecma6.0">
import headerComponent from '../../components/HeaderComponent';

let root = window || {},
    util = root.util || {};
   
export default {
    data () {
        return {
            title:'服务消息',
            isNoList:false,
            containerBg:'containerBgGrey',
            //总页数
            tpage:1,
            //当前分页,默认第一分页
            curpg:1,
            //每页的分页数量
            len:10,
            list:[],
            readType:2, //用户标记已读 1:物流安装消息，2：服务消息
        }
    },
    methods:{
        //服务消息跳转到订单详情页
        hrefToUrl(obj){
         
            if(obj.orderType==10485760){ //虚拟订单
                let params ={
                    otn:obj.orderNo,
                    dodt:obj.orderTime,
                    odtype:obj.orderType,
                    isJkxOtn:1
                };
                //跳转订单详情页
                util.href('./ordersgjdetail.html',params);
            }else if(obj.orderType==4194305||obj.orderType==4194306||obj.orderType==4194307){
                let params ={
                    otn:obj.orderNo,
                    dodt:obj.orderTime,
                    odtype:obj.orderType,
                    isJkxOtn:1
                };
                util.href('./ordertrackgj.html',params);
            }else{
                let params ={
                    otn:obj.orderNo,
                    dodt:obj.orderTime,
                    odtype:obj.orderType,
                    isJkxOtn:0
                };
                util.href('./ordertrackgj.html',params);
            }
           
        },
        //服务消息列表已读接口
        readFn(){
            let that = this;
            util.api({
                surl: root.ME_API_PATH + 'mark/read',
                data: {
                    msgCate: that.readType
                },
                type: 'get',
                success: function(response) {
                    let rpco = response.rpco,
                        body = response.body || {};
                    //处理
                    switch(rpco) {
                        case 200:

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
        },
        /**
         * 获取服务消息
         * @parma {object} 参数集合
         * @parma {number}{1} object.curpg 当前页码
         * @parma {number}{10} object.len 分页每次条数
         * @parma {fucntion}{()=>{}} obj.succFn 成功后的回调函数
         * @parma {fucntion}{()=>{}} obj.falseFn 失败后的回调函数
         */
          getSerMessages(obj){
                let that = this;
                util.api({
                    //surl:'/resources/json/sermessage.json',
                    surl: root.ME_API_PATH + 'service/list',
                    data: {
                        pageNo: obj.curpg,
                        pageSize: obj.len
                    },
                    type: 'get',
                    success: function(response) {
                        let rpco = response.rpco,
                            body = response.body || {};
                        //处理
                        switch(rpco) {
                            case 200:
                                obj.succFn&&obj.succFn(body);
                            break;
                            //没有找到对应数据
                            case 404:
                                obj.falseFn&&obj.falseFn();
                                break;
                            default:
                                obj.falseFn&&obj.falseFn();
                        }
                    },
                    complete: function() {
                        //移除提示
                        util.remComShow();
                    }
                }); 
                
            },
            /* 上拉加载更多 */
            loadMore: function() {
                let that = this;

                this.$nextTick(() => {
                    //初始化
                    that.xscroll = new XScroll({
                        renderTo: that.$refs.J_Scroll,
                        lockY:false
                    });

                    that.pullup = new XScroll.Plugins.PullUp({
                        upContent:"上拉加载更多...",
                        downContent:"释放加载...",
                        loadingContent:"努力加载中...",
                        bufferHeight:0
                    });
                        
                    //加载触底
                    that.pullup.on("loading",function(){
                        that.curpg++;
                        if(that.curpg<= that.tpage){
                            that.getSerMessages({
                                'curpg':that.curpg,
                                'len':that.len,
                                'succFn':(body)=>{
                                    //优惠券列表
                                    body.data.forEach(list=>{
                                        that.list.push(list);
                                    });
                                },
                                'falseFn':()=>{
                                    //更迭加载的页数
                                    that.curpg -= 1;
                                    util.tip('您当前网络异常，请稍后重试');
                                }
                            });
                        }else{
                            that.xscroll.render();
                            that.pullup.complete();
                            // that.xscroll.unplug(that.pullup);
                            //底部加载文字处理
                            $('.xs-plugin-pullup-container').html('没有更多了');
                            
                        }
                        
                    });
                });
            
            }
    },
    filters: {
        formatDate(time) {
           let times = Number(time);
            return util.formateDate(times, "yyyy年MM月dd日 hh:mm");
        }
    },
    watch: {
        list(){
            let that = this;
            that.$nextTick(()=>{
                //重新渲染滚动插件
                that.xscroll.render();
                
                //不存在数据交互处理
                if(that.list.length === 0){
                    that.isNoList = true;
                    that.containerBg = 'containerBgWrite';

                }else{
                    that.isNoList = false;
                    that.containerBg = 'containerBgGrey';
                }
            
                //分页数小于1的时候
                if(that.tpage<=1){
                    that.xscroll.unplug(that.pullup);
                }else{
                    that.xscroll.plug(that.pullup);
                    //loading complete
                    that.pullup.complete();
                }
            }); 
        }
    },
    created(){
        let that = this;
        //上拉加载更多
        that.loadMore();
        //初始化加载;
        that.getSerMessages({
            'curpg':that.curpg,
            'len':that.len,
            'succFn':(body)=>{
                that.list = body.data;
                //总页数
                that.tpage = body.tpage;
            },
            'falseFn':()=>{
                util.tip('您当前网络异常，请稍后重试');
            }
        });
        that.readFn();
        if(util.isApp()){
           util.deleteHeadBtn();
        }
    },
    components: {
        headerComponent
    }
}

</script>
<style lang="less">
    @import '../../util/fs.less';
    body,html{
        font-family: 'PingFangSC-Regular',sans-serif;
        background: #f5f5f5;
    }

    /* 公共内容区 */
    .container {
        width: 10rem;
        min-width: 320px;
        overflow-x: hidden;
        overflow-y: auto;
        position: absolute;
        top: 1.173333rem;
        bottom: 0;
        -webkit-overflow-scrolling: touch;
        z-index:999;
    }
    .containerBgGrey{
        background-color: #f5f5f5;
    }
    .containerBgWrite{
        background-color: #fff;
    }
    .message-list{
        margin: 0.133333rem 0;
        .message-li{
            overflow: hidden;
            .time{
                min-width:3.36rem;
                height: 0.64rem;
                margin:0.266667rem auto;
                line-height: 0.64rem;
                background: #D0D0D0;
                border-radius: 4px;
                color: #FFFFFF;
                text-align: center;
                .mixinfont(12px);
            }

            .order-box{
                width: 9.226667rem;
                margin:0 0.4rem;
                background: #FFFFFF;
                border: 1px solid #D8D8D8;
                border-radius: 0.133333rem;

                .title-box{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-sizing: border-box;
                    position: relative;
                    height: 1.013333rem;
                    line-height: 1.013333rem;
                    &:after{
                        height:1px;
                        content: '';
                        width: 100%;
                        border-top: 1px solid #d8d8d8;
                        position: absolute;
                        bottom: -1px;
                        right: 0;
                        z-index: 10;
                    }
                    
                    h2{
                        margin-left:0.346667rem;
                        .mixinfont(15px);
                        color: #333333;
                    }
                    .express{
                        margin-right:0.453333rem;
                        .mixinfont(12px);
                        color: #999999;
                    }
                }
                .order-content{
                    width: 100%;
                    box-sizing: border-box;
                    padding: 0.266667rem 0.346667rem 0.4rem 0.346667rem;
                    overflow: hidden;
                    .img{
                        width: 1.92rem;
                        height: 1.92rem;
                        float: left;
                        overflow: hidden;
                        margin-right: 0.213333rem;
                    }
                    .order-desc{
                        width:(480/75)*1rem;
                        float: left;

                        .order-name,.order-type{
                            width:(480/75)*1rem;
                            height: 0.426667rem;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            line-height: 0.44rem;
                            .mixinfont(14px);
                            color: #333333;
                        }
                        .order-type{
                            margin-top: 0.066667rem;
                        }
                        .order-name{
                            margin-top: 0.133333rem;
                        }
                        .order-number{
                            padding-top: 0.38rem;
                            .mixinfont(12px);
                            color: #999999;
                        }  
                    }
                }
            }
        }
        
    }

    .tuwen {
        .mixinfont(16px);
        line-height: .426667rem /* 32/75 */;
        width: 100%;
        background: #fff;
    }
    .tuwen .tu {
        width: 100rem;
        display: table-cell;
        padding-top: 1.866667rem /* 140/75 */;
        padding-bottom:.773333rem /* 58/75 */;
        vertical-align: middle;
        text-align: center;
    }
    .i {
        font-style: normal;
        position: absolute;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        border-radius: 2px;
    }
    .tuwen .tu .i {
        display: inline-block;
        position: static;
    }
    .tuwen .wen {
        line-height: .666667rem /* 50/75 */;
        text-align: center;
    }
    .i-order {
        width: 6.4rem /* 480/75 */;
        height: 5.813333rem /* 436/75 */;
        background-image: url(//gfs11.gomein.net.cn/T13nJbBXWT1RCvBVdK.png);
    }
    /*loading 加载*/
    .xs-plugin-pullup-container{
        width: 100%;
        text-align: center;
            .mixinfont(12px);
        line-height:1.066667rem /* 80/75 */;
    }

@media screen and (width:320px){
    .time{
        width: 4.36rem;
    }
}
@media screen and (min-width:375px){
    .time{
        width: 3.76rem;
    }
}

@media (-webkit-min-device-pixel-ratio: 1.5),(min-device-aspect-ratio: 1.5){
    .order-box .title-box:after{
        -webkit-transform : scaleY(0.7);
        transform : scaleY(0.7);
    }
}
@media (-webkit-min-device-pixel-ratio: 2),(min-device-aspect-ratio: 2){
    .order-box .title-box:after{
        -webkit-transform : scaleY(0.5);
        transform : scaleY(0.5);
    }
}

    

</style>