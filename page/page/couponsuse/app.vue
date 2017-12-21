<template>
    <div id="couponsuse" class="wapper">
        <header-component 
        :title='title'
        :rightmenus = 'rightmenus'
        @watchlist='instructions'
        >
		</header-component>
        <div class="container" :class="containerBg">
            <ul class="content" id="list" v-show="!isNoList">
                <template v-for="(coupon, index) in coulst">
                    <li class="coupon red" :key="index"  @click="hrefToUrl(coupon.counum,coupon.coumy)">
                        <div class="coupon-left">
                            <div class="coupon-main">
                                <img class="coupon-img" src="//gfs10.gomein.net.cn/T1f_xvBbVj1RCvBVdK.png">
                                <span v-if="coupon.coutp==1" class="coupon-type">管家券</span>
								<span v-else-if="coupon.coutp==2" class="coupon-type">商家劵</span>
                            </div>
                            <p class="coupon-tips">
                                使用期限：{{coupon.coucut |formatDate }}-{{coupon.coucute |formatDate}}
                            </p>
                        </div>    
                        <div class="coupon-right">
                            <div class="coupon-price">
                                <span class="txt">¥</span>
                                <span class="big-txt">{{coupon.coumy/100}}</span>
                            </div>
                            <p v-if="Number(coupon.coumat)>0" class="counpon-tips">满{{coupon.coumat}}元可用</p>
                        </div>
                        <span class="coupon-icon" :class="{
                        'coupon-qx':coupon.couat=='清洗',
                        'coupon-wx':coupon.couat=='维修',
                        'coupon-xn':coupon.couat=='虚拟',
                        }"></span>
                    </li>
                </template>
            </ul>
            <div class="tuwen" v-show="isNoList">
                <div class="tu">
                    <i class="i i-order"></i>
                </div>
                <p class="wen">暂无可用优惠券哦~</p>
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
            title:'优惠券',
            rightmenus:{
                type:'text',
                content:'使用说明'
            },
            //选中的值 1-未使用
            curCouponType: 1,
            //是否没有优惠券提示，默认否
            isNoList:false,
            containerBg:'',
            hrefParma:util.getHrefParma(),
            // 优惠券列表
            coulst: []
        }
    },
    methods:{
        //使用说明
        instructions(){
            util.href('./couponsreadme.html');
        },
        //服务消息跳转到订单详情页
        hrefToUrl(counum,coumy){
            let that = this;
            let params ={
                otn:that.hrefParma.otn,
                dodt:that.hrefParma.dodt,
                odtype:that.hrefParma.odtype,
                counum:counum,
                coumy:coumy
            };
            //跳转订单详情页,
             util.href('./pay.html',params);
        },
        /**
         * 获取可用优惠券
         * @parma {object} 参数集合
         */
          getCoupons(){
            let that = this;
            util.api({
                // surl:'/resources/json/couponsuse.json',
                surl: root.MB_API_PATH + 'canusecous',
                data: {
                    otn: that.hrefParma.otn,
                    dodt: that.hrefParma.dodt,
                    odtype:that.hrefParma.odtype
                },
                type: 'get',
                success: function(response) {
                    let rpco = response.rpco,
                        body = response.body || {};
                    
                    //处理
                    switch(rpco) {
                        case 200:
                            that.coulst = body.coulst;
                        break;
                        //没有找到对应数据
                        case 404:
                            that.isNoList = true;
                            break;
                        default:
                           // util.tip('查询失败')
                            util.tip('您当前网络异常，请稍后重试');
                    }
                },
                complete: function() {
                    //移除提示
                    util.remComShow();
                }
            }); 
        },
        setHeadBar4(){
            GomeJSBridge.ready(function(){
                let param = {
                    menus : {
                        rightMenus:[
                            {
                                type:'callback',
                                title:'使用说明',
                                data:{
                                    id:'btn1',
                                    name:'使用说明',
                                    desc:'使用说明'
                                }
                            }
                        ]
                    }
                };
                util.setHeadBar(param);
            },null);

            GomeJSBridge.onCallback(function(data){
                if(data.id == "btn1"){
                    util.href('./couponsreadme.html');
                }
            });
        }
    },
    filters: {
        formatDate(time) {
            return util.formateDate(time, "yyyy.MM.dd");
        }
    },
    watch: {
        coulst(){
            let that = this;
            //不存在数据交互处理
            if(that.coulst.length === 0){
                that.isNoList = true;
                that.containerBg = 'containerBgWrite';
            }else{
                that.isNoList = false;
                that.containerBg = 'containerBgGrey';
            }
        }
    },
    created(){
        let that = this;
        //初始化加载;
        that.getCoupons();
        if(util.isApp()){
            that.setHeadBar4();
        }
    },
    components: {
        headerComponent
    }
}

</script>
<style lang="less">
    @import '../../util/fs.less';
    .header .right div {
        .mixinfont(16px);
        color: #666666;
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
    .content{
        overflow: hidden;
        padding-bottom:.346667rem /* 26/75 */;
    }
    
    .coupon{
        display:flex;
        justify-content: center;
        position: relative;
        width: 9.2rem /* 690/75 */;
        height: 2.666667rem /* 200/75 */;
        background-color: #fff;
        border-radius: .133333rem /* 10/75 */;
        margin:.266667rem /* 20/75 */ auto 0;
        padding: .346667rem /* 26/75 */ 0 .293333rem /* 22/75 */ .266667rem /* 20/75 */;
        box-sizing:border-box;      
        -moz-box-sizing:border-box; /* Firefox */
        -webkit-box-sizing:border-box; /* Safari */                         
    }

    .red .coupon-type{
        color: #333;
    }
    .grey .coupon-type{
        color: #999;
    }

    .red .coupon-price{
        color: #FF4B41;
    }
    .grey .coupon-price{
        color: #999;
    }
    .red .counpon-tips{
        color: #FF4B41;
    }
    .grey .counpon-tips{
        color: #999;
    }

    /* 券的角标start */
    .coupon-icon{
        position: absolute;
        top:0;
        right:0;
        width: 1.093333rem /* 82/75 */;
        height: 1.12rem /* 84/75 */;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        overflow: hidden;
    }
    .red .coupon-qx{
        background-image: url('//gfs12.gomein.net.cn/T16DLvBgbT1RCvBVdK.png');
    }
    .grey .coupon-qx{
        background-image: url('//gfs11.gomein.net.cn/T1k__vBmEg1RCvBVdK.png');
    }
    .red .coupon-wx{
        background-image: url('//gfs13.gomein.net.cn/T1L_CvB7Eg1RCvBVdK.png');
    }
    .grey .coupon-wx{
        background-image: url('//gfs10.gomein.net.cn/T1BhbvByKg1RCvBVdK.png');
    }
    .red .coupon-xn{
        background-image: url('//gfs10.gomein.net.cn/T1uLWvBC_T1RCvBVdK.png');
    }
    .grey .coupon-xn{
        background-image: url('//gfs10.gomein.net.cn/T1Q_bvBmA_1RCvBVdK.png');
    }
    /* 券的角标end */

    .coupon-left{
        flex:1;
        .coupon-main{
            display: flex;

            .coupon-img{
                width: 1.333333rem /* 100/75 */;
                height: 1.333333rem /* 100/75 */;
                display: inline-block;
            }
            .coupon-type{
                flex: 1;
                display: inline-block;
                .mixinfont(14px);
                line-height: 1.333333rem /* 100/75 */;
                padding-left: .293333rem /* 22/75 */;
            }
        }
        
        .coupon-tips{
            margin-top:.213333rem /* 16/75 */;
            .mixinfont(12px);
            line-height:.453333rem /* 34/75 */;
            color: #999999;
        }
    }
    .coupon-right{
		width:2.733333rem /* 205/75 */;
        position: relative;
        .coupon-price{
            display: flex;
            justify-content: center;
            align-items:flex-end;
            width: 100%;
            height: 1.066667rem /* 80/75 */;
            margin:.28rem 0 0.1rem 0;
            .txt{
                .mixinfont(18px);
                line-height: .666667rem /* 50/75 */;
            }
            .big-txt{
                    margin-left: .093333rem /* 7/75 */;
                    .mixinfont(28px);
            }
        }
        .counpon-tips{
            width:100%;
            height: .453333rem /* 34/75 */;
            line-height:.453333rem /* 34/75 */;
            text-align: center;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            .mixinfont(12px);
        }
        &:before{
			height: 100%;
			content: '';
			width: 1px;
			border-left: 1px solid #ddd;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 10;
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
        background-image: url(//gfs10.gomein.net.cn/T1.cbgBXWT1RCvBVdK.png);
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
    .order-box .title-box:after,.coupon-right:before{
        -webkit-transform : scaleY(0.7);
        transform : scaleY(0.7);
    }
}
@media (-webkit-min-device-pixel-ratio: 2),(min-device-aspect-ratio: 2){
    .order-box .title-box:after{
        -webkit-transform : scaleY(0.5);
        transform : scaleY(0.5);
    }
    .coupon-right:before{
        -webkit-transform : scaleX(0.7);
        transform : scaleX(0.7);
    }
}

    

</style>