<template>
    <div id="orderall">
        <!-- 头部导航 -->
      <!--   <div class="header">
            <header>
                <a @click="fnGetBack"></a>
                <span>退款订单</span>
            </header>
        </div> -->
        <!-- 头部导航 -->
        <!-- 公共头部 -->
        <header-component :title="title"></header-component>
        <!-- 订单列表 -->
        <div class="container iscrollpading" v-show="orderAll.length">
            <div class="orderlist iscrollpading-list">
                <div class="li" v-for="(v,i) in orderAll">
                    <!-- 门店信息、状态 -->
                    <div class="shop-info clearfix">
                        <span class="shop-info_l float_l">国美管家</span>
                        <span class="shop-info_r float_r">退款单</span>
                    </div>
                    <!-- 门店信息、状态 -->
                    <div v-for="(v2,i2) in v.subOrderList" @click="fnDetail(v.orderid,v.sotp)">
                        <!-- 中台推送线上，门店订单信息 -->
                        <div class="order-info">
                            <div class="clearfix order-info-d1">
                                <div class="float_l orderImg">
                                    <img :src="v2.picurl" alt="">
                                </div>
                                <div class="float_l order-info-d2">
                                    <p class="order-info_t">{{ v2.title }}</p>
                                    <p class="order-info_b">退款金额：￥{{ v2.price }}</p>
                                </div>
                            </div>
                        </div>
                        <!-- 中台推送线上，门店订单信息 -->
                        <!-- 退款状态，描述 -->
                        <div class="orderrefundinfo clearfix">
                            <span class="float_l">{{ v2.refundstatus | gvState(v.sotp,v2.late,true) }}</span>
                            <p class="float_l">{{ v2.refundstatus | gvState(v.sotp,v2.late) }}</p>
                        </div>
                        <!-- 退款状态，描述 -->
                    </div>

                </div>
                <!-- <span class="iscrollpading-pulltext"></span> -->
            </div>
        </div>
        <!-- 订单列表 -->
        <!-- 没有订单 -->
        <div class="noOrder" v-show="noOrderTF">
            <img src="//gfs12.gomein.net.cn/T1R3Z_BmbT1RCvBVdK.png" alt="">
            <p>您还没有相关订单哦~</p>
        </div>
        <!-- 没有订单 -->

    </div>
</template>

<script type='text/ecmascript-6'>
    import headerComponent from '../../components/HeaderComponent'
    var root = window || {},
         util = root.util || {};

    export default {
        data() {
            return {
                noOrderTF:null,
                title:'退款/售后进度查询',
                // 当前页码
                curpg:1,
                // 每一页展示多少条数据
                len:30,
                // 订单类型
                odtype:0,
                // 总条目数
                tpage:0,
                // 分页对象
                iscrollPaging:null,
                // 全部订单集合
                orderAll:[],
                // 订单状态
                 orderstate: {
                     // 线上实物订单状态
                     sw: {
                         1: '待支付',
                         2: '待发货',
                         4: '已妥投',
                         5: '订单失败',
                         8: '申请退款',
                         9: '已发货',
                         10: '退款成功',
                         11: '退款失败',
                         12: '订单成功'
                     },
                     //延保订单状态
                     1: '待付款',
                     2: '投保成功',
                     3: '投保成功',
                     4: '投保成功',
                     5: '已取消',
                     6: '投保成功',
                     7: '投保失败',
                     //延保订单已支付不显示状态
                     99: '',
                     //延保订单状态
                     33: '待付款',
                     34: '支付成功',
                     35: '待预约',
                     36: '预约成功',
                     37: '交易失败',
                     65: '审核通过',
                     66: '下单成功',
                     97: '待评论',
                     98: '',
                     353: '待派工',
                     354: '已派工',
                     355: '已完成',
                     356: '无法完成',
                     385: '已出库',
                     386: '延迟派送',
                     387: '预约无法执行',
                     388: '已妥投',
                     389: '已拒收',
                     //虚拟充值
                     1600: '订单失败',
                     1500: '订单失败',
                     1100: '订单失败',
                     1200: '充值中',
                     1300: '充值中',
                     1400: '订单成功',
                     700: '支付成功',
                     4600: '退款失败',
                     5000: '退款成功',
                     4000: '退款中',
                     4320: '退款中', //退款审核不通过
                     4400: '退款中' //退款审核通过
                         //虚拟充值
                 },
                 msg: {
                     m1: '订单取消后，本单可享用的优惠可能会一并取消，是否继续？'
                 }
            }
        },
        methods:{
            // 跳转退款详情页
            fnDetail(orderid,sotp){
                var _this = this;
                util.href('ordersrefunddetail.html',{
                    // 订单id
                    otn:orderid,
                    // 订单类型
                    odtype:sotp
                });
            },
            // 获取订单列表
            fnGetOrderList(curpg,len,odtype){
                let _this = this,
                    data = {
                        curpg:_this.curpg,
                        len:_this.len,
                        odtype:_this.odtype
                    };
                util.api({
                    // surl:'/resources/json/orderrefundall.json',
                    surl:root.ORDER_API_PATH + 'getrefundlist',
                    data:data,
                    type:'get',
                    success:function(response) {
                        // console.log(response)
                        let rpco = response.rpco,
                            body = response.body;

                        switch(rpco) {
                            case 200:
                                // 控制售后服务显示隐藏
                                $.each(body.orderlist, function(index,current) {
                                    $.each(current.gdls, function(indexs,currents) {
                                        currents.shTF = false;
                                    });
                                    _this.orderAll.push(current);
                                });
                                _this.noOrderTF = !_this.orderAll.length;
                                 // 创建分页对象
                                 if (!_this.iscrollPaging) {
                                     // 创建
                                     _this.iscrollPaging = new IscrollPaging({
                                         // 总页数
                                         totalPage: body.total/30,
                                         // 每页条数
                                         pageDataCount: _this.len,
                                         // 加载数据方法
                                         loadDataFun: function() {
                                            //
                                            _this.curpg++;
                                            // 查询数据
                                            _this.fnGetOrderList(_this.curpg,_this.len,_this.odtype,_this.rodcate);
                                         }
                                     });
                                     _this.$nextTick(function(){
                                         _this.iscrollPaging.init();
                                     })
                                 }
                                 // 加载分页
                                 else {
                                     //
                                     _this.$nextTick(function(){
                                         _this.iscrollPaging.reLoadPagingOption({
                                             // 当前页码
                                             currentPage: _this.curpg,
                                             // 总页数
                                             totalPage: 6
                                         });
                                     })
                                 }
                                break;
                            default:
                        }
                    }
                })
            },
            // 返回上一页
            fnGetBack() {
                util.href("javascript:window.history.back(-1)");
            }
        },
        created() {
            // 获取订单列表
            this.fnGetOrderList(this.curpg,this.len,this.odtype);
        },
        filters:{
            gvTime: function(el) {
                return util.formateDate(el, 'yyyy-MM-dd hh:mm');
            },
            // 退款状态
            gvState: function(el,sotp,late,n) {
                var stateInfo,
                    stateInfoMs;
                if (sotp == 10485761) {
                    if (el == 0 && late) {
                        stateInfo = '申请退款';
                        stateInfoMs = '您的退款正在申请中';
                    }else if(el == 1){
                        stateInfo = '退款失败';
                        stateInfoMs = '您的订单已退款失败';
                    }else if(el == 2){
                        stateInfo = '退款完成';
                        stateInfoMs = '您的订单已退款成功';
                    }else if(el == 3){
                        stateInfo = '退款中';
                        stateInfoMs = '您的退款正在退款中';
                    };
                }else{
                    if (el == 0 && late) {
                        stateInfo = '申请退款';
                        stateInfoMs = '您的退款正在申请中';
                    }else if(el == 1 || el == 3){
                        stateInfo = '退款中';
                        stateInfoMs = '您的退款正在退款中';
                    }else if(el == 2){
                        stateInfo = '退款完成';
                        stateInfoMs = '您的订单已退款成功';
                    };
                };
                if (n) {
                    return stateInfo;
                }else{
                    return stateInfoMs;
                };
            }
        },
        components: {
            headerComponent
        }
    }
</script>

<style lang="less">
    @import '../../util/fs.less';
    body,html{height: 100%};
    #orderall{
        .noOrder{
            padding-top: 2.933333rem;
            img{
                width: 6.4rem;
                margin: 0 auto;
            }
            p{
                font-size:0.426667rem;
                line-height: 0.586667rem;
                color: #333;
                margin-top: 0.773333rem;
                text-align: center;
            }
        }
        /*加载更多插件*/
        .iscrollpading {
            overflow: hidden;
        }
        .iscrollpading-pulltext {
            font-size: .12rem;
            text-align: center;
            width: 100%;
            line-height: 1.173333rem;
            display: block;
        }
        .container {
            width: 10rem;
            background-color: #f5f5f5;
            overflow: hidden;
            position: absolute;
            top: 0;
            bottom: 0;
            -webkit-overflow-scrolling: touch;
        }
        /*加载更多插件*/
        /*头部*/
        .header{
            width: 100%;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 888;
            header{
                height: 1.173333rem;
                border-bottom: 1px solid #ddd;
                position: relative;
                text-align: center;
                background:#fff;
                a{
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 1.173333rem;
                    height: 100%;
                    background: url(//gfs11.gomein.net.cn/T16MZvBjET1RCvBVdK.png) no-repeat 0.346667rem center;
                    background-size: 0.306667rem 0.573333rem;
                }
                span{
                    display: inline-block;
                    height: 100%;
                    font-size: 0.48rem;
                    line-height: 1.173333rem;
                    color:#333;
                    position: relative;
                    i{
                        width:0.213333rem;
                        height: 0.173333rem;
                        position: absolute;
                        right:-0.493333rem;
                        top:0.493333rem;
                        background: url(//gfs11.gomein.net.cn/T1ZnDvB4YT1RCvBVdK.png) no-repeat;
                        background-size: 100%;
                    }
                }
            }
        }
        /*头部*/
        /*订单列表*/
        .container{
            padding-top: 1.333333rem;
            .orderlist{
                padding-bottom: 1.333333rem;
                .li{
                    margin-bottom:0.266667rem;
                    /*门店信息、状态*/
                    .shop-info{
                        font-size: 0.346667rem;
                        height:1.066667rem;
                        line-height: 1.066667rem;
                        background-color:#fff;
                        .shop-info_l{
                            text-indent: 0.96rem;
                            color: #333;
                            background: url(//gfs13.gomein.net.cn/T1_9WvBgDv1RCvBVdK.png) no-repeat 0.266667rem center;
                            background-size: 0.48rem 0.48rem;
                            width: 8.0rem;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                        }
                        .shop-info_r{
                            color:#FF4B41;
                            margin-right: 0.266667rem;
                        }
                    }
                    /*配送信息*/
                    .logistics{
                        background:url(//gfs12.gomein.net.cn/T1i9YvBKWQ1RCvBVdK.png) no-repeat 97% center  #fff;
                        background-size: 0.32rem 0.32rem;
                        img{
                            width: 0.48rem;
                            height: 0.48rem;
                            margin:0.533333rem 0 0 0.266667rem;
                        }
                        div{
                            padding-top: 0.32rem;
                            width: 90%;
                            font-size: 0.346667rem;
                            color: #3AA11A;
                            line-height:0.48rem;
                            border-top: 1px solid #ddd;
                            .logistics_t{
                                width:8.36rem;
                                display: -webkit-box;
                                -webkit-box-orient: vertical;
                                -webkit-line-clamp: 2;
                                overflow: hidden;
                            }
                            .logistics_b{
                                font-size:0.293333rem;
                                color:#999;
                                line-height: 0.32rem;
                                padding:0.053333rem 0 0.24rem 0;
                            }
                        }
                    }
                    /*订单信息*/
                    .order-info{
                        background:#f8f8f8;
                        .order-info-d1{
                            position: relative;
                            .order-sale{
                                position: absolute;
                                top:0.12rem;
                                right:0.266667rem;
                                color: #FF4B41;
                                font-size: 0.346667rem;
                                line-height:0.48rem;
                                div{
                                    position: absolute;
                                    top: 0.7rem;
                                    right: 0;
                                    z-index: 10;
                                    i{
                                        position: absolute;
                                        right: 0.266667rem;
                                        width: 0;
                                        height: 0;
                                        color: #fff;
                                        text-align: center;
                                        border-left: 0.16rem solid transparent;
                                        border-right: 0.16rem solid transparent;
                                        border-bottom: 0.16rem solid #4A4848;
                                        margin-top: -0.16rem;
                                    }
                                    ul{
                                        li{
                                            width: 2.666667rem;
                                            height: 1.066667rem;
                                            line-height: 1.066667rem;
                                            color: #f7f7f7;
                                            text-align: center;
                                            background:#4A4848;
                                            span{
                                                width:2.133333rem;
                                                height: 100%;
                                                display: block;
                                                margin:0 auto;
                                                border-bottom: 1px solid #5B5A5D;
                                                /*border-bottom: 1px solid red;*/
                                                box-sizing:border-box;
                                            }
                                            .bn{
                                                border: 0;
                                            }
                                        }

                                        .action{
                                            background: #3B3939;
                                        }
                                        li:first-child{
                                            border-top-left-radius: 0.096667rem;
                                            border-top-right-radius: 0.096667rem;
                                        }
                                        li:last-child{
                                           border-bottom-left-radius: 0.096667rem;
                                           border-bottom-right-radius: 0.096667rem;
                                        }
                                    }
                                }
                            }
                            .order-time{
                                position:absolute;
                                right: 0.266667rem;
                                bottom: 0.16rem;
                                color: #999;
                                font-size: 0.266667rem;
                                padding-right: 0.373333rem;
                                background: url(//gfs12.gomein.net.cn/T1i9YvBKWQ1RCvBVdK.png) no-repeat right center;
                                background-size: 0.32rem 0.32rem;
                            }
                            .orderImg{
                                width: 2.026667rem;
                                height: 2.026667rem;
                                margin:0.16rem 0 0.16rem 0.266667rem;
                                position: relative;
                                img{
                                    width: 100%;
                                    height: 100%;
                                }
                                span{
                                    width: 1.093333rem;
                                    height: 1.093333rem;
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    background:url(//gfs12.gomein.net.cn/T1abEvBCJT1RCvBVdK.png) no-repeat;
                                    background-size: cover;
                                }
                            }
                            .order-info-d2{
                                .order-info_t{
                                    width: 6.666667rem;
                                    font-size: 0.32rem;
                                    color: #333;
                                    margin: 0.186667rem 0 0 0.266667rem;
                                    display: -webkit-box;
                                    -webkit-box-orient: vertical;
                                    -webkit-line-clamp: 2;
                                    overflow: hidden;
                                }
                                .order-info_b{
                                    position: absolute;
                                    bottom: 0.16rem;
                                    right: 0.266667rem;
                                    font-size: 0.32rem;
                                    line-height:0.426667rem;
                                    color: #333;
                                }
                            }
                        }
                    }
                    /*退款状态，描述*/
                    .orderrefundinfo{
                        height: 1.386667rem;
                        line-height: 1.386667rem;
                        background: #fff;
                        span{
                            height: 100%;
                            background: url(//gfs10.gomein.net.cn/T14DZvBmb_1RCvBVdK.png) no-repeat 0.266667rem center;
                            background-size: 0.42rem 0.42rem;
                            text-indent: 0.933333rem;
                            font-size: 0.32rem;
                            color:#333;
                        }
                        p{
                            width: 7.36rem;
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 2;
                            overflow: hidden;
                            font-size: 0.32rem;
                            line-height:1.386667rem;
                            color: #666;
                            margin-left:0.38rem;
                        }
                    }
                }
                .li:nth-last-child(2){
                  margin: 0;
                }
            }
        }
        /*订单列表*/
    }
</style>