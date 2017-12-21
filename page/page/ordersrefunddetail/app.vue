<template>
	<div id="ordersDetail" class="wapper">
		<!-- 公共头部 -->
		<header-component :title="title"></header-component>
		<!-- 实物订单 -->
		<div class="container" style="width:10rem;left:initial;">
            <!-- 待支付 -->
            <div class="delivery-state unpay clearfix">
                <img src="" alt="" class="delivery-state-img float_l">
                <div class="staff-info t20 white float_l ml32">国美管家</div>
            </div>
            <!-- 退款状态，金额 -->
            <div class="refund_sotp">
                <p class="refund_sotp_p1">{{ objNumber.k }}</p>
                <p class="refund_sotp_p2">退款金额<span>￥{{ (gdls[0].gdpr / 100).toFixed(2) }}</span></p>
                <p class="refund_sotp_p3">预计2-3天到账，具体到账时间以银行为准</p>
            </div>
            <!-- 退款状态，金额 -->
            <!-- 退款图案 -->
            <div class="refund_design_z">
                <div class="refund_design">
                    <div class="refund_design1">
                        <span :class="{ac:objNumber.n >= 0}">
                            <i :class="{aci:objNumber.n >= 0}">1</i>
                        </span>
                        <p :class="{acp:objNumber.n >= 0}">申请退款</p>
                    </div>
                    <div class="refund_design1 refund_design2">
                        <span :class="{ac:objNumber.n >= 1}">
                            <i :class="{aci:objNumber.n >= 1}">2</i>
                        </span>
                        <p :class="{acp:objNumber.n >= 1}">审核中</p>
                    </div>
                    <div class="refund_design1 refund_design3">
                        <span :class="{ac:objNumber.n >= 2}">
                            <i :class="{aci:objNumber.n >= 2}">3</i>
                        </span>
                        <p :class="{acp:objNumber.n >= 2}" v-if="objNumber.k == '退款失败'">退款失败</p>
                        <p :class="{acp:objNumber.n >= 2}" v-else>退款成功</p>
                    </div>
                </div>
            </div>
            <!-- 退款图案 -->
            <!-- 退款履历 -->
            <transition name="slide-fade">
                <div class="refund_lvl_z bdr-top" v-show="refundLvTF">
                    <div class="refund_lvl clearfix">
                        <div class="refund_lvl_l"></div>
                        <div v-for="(item,index) in sdfmclList" class="refund_lvl_r bdr-bottom float_r">
                            <i></i>
                            <p :class="(index == 0)?'p':''">{{ item.tip }}</p>
                            <span>{{ item.sdfmtm | gvTime }}</span>
                        </div>
                    </div>
                </div>
            </transition>
            <!-- 退款履历 -->
            <!-- 收起履历 -->
            <div class="refund_TF_z bdr-top" @click="fnRefund_TF">
                <div class="refund_TF" v-if="!refundLvTF">点击查看退款履历<span :class="{s:refundLvTF}"></span></div>
                <div class="refund_TF" v-else>点击收起退款履历<span class="s"></span></div>
            </div>
            <!-- 收起履历 -->
		    <!-- 商品列表 -->
		    <div class="orderInfo">
                <div class="clearfix order-info-d1">
                    <div class="float_l orderImg">
                        <img :src="gdls[0].gdiul" alt="">
                    </div>
                    <div class="float_l order-info-d2">
                        <div class="clearfix">
                            <p class="order-info_t float_l">{{ gdls[0].gdnm }}</p>
                            <span class="float_r">{{ (gdls[0].gdpr / 100).toFixed(2) }}</span>
                        </div>
                        <p class="order-info_pp">{{ gdls[0].gdnu }}</p>
                    </div>
                </div>
            </div>
		    <ul class="list-labelvalue t13">
		        <li class="bdr-top">
		        	<div>
		       		    <label>退款金额</label>
		                <span class="value" id="otn" @click="showCopy">{{ (gdls[0].gdpr / 100).toFixed(2) }}元</span>
		            </div>
		        </li>
		        <li class="bdr-top">
		        	<div>
		                <label>详细商家</label>
		                <span class="value" id="sdodt">国美管家</span>
		            </div>
		        </li>
	           <li class="bdr-top">
                    <div>
                        <label>退款方式</label>
                        <span class="value" id="sdodt">原路返回</span>
                    </div>
                </li>
                <li class="bdr-top">
                    <div>
                        <label>退款状态</label>
                        <span class="value" id="sdodt">{{ objNumber.k }}</span>
                    </div>
                </li>
                <li class="bdr-top">
                    <div>
                        <label>退款时间</label>
                        <span class="value" id="sdodt">{{ detailResult.refundCreateDate | gvTime }}</span>
                    </div>
                </li>
                <li class="bdr-top">
                    <div>
                        <label>交易单号</label>
                        <span class="value" id="sdodt">{{ gdls[0].otn }}</span>
                    </div>
                </li>
		    </ul>
	       <div class="dzzq"><a href="https://u.m.gomeplus.com/exchange_arrivalNote.html">到账周期说明</a></div>
		</div>
	</div>
</template>
<script type='text/ecmascript-6'>
	import headerComponent from '../../components/HeaderComponent'
	let root = window || {},
	    util = root.util || {};
	export default {
    	data() {
            return {
                title:'退款详情',
	            hrefParma: {},
	            detailResult: {

                },
                gdls:[{
                    gdpr:null,
                    gdnm:null,
                    gdnu:null,
                    otn:null
                }],
                objNumber:{
                    n:null,
                    k:null
                },
                // 退款履历显示隐藏
                refundLvTF:false,
                sotp:null,
				//线上实物订单
				sdfmclList:[],
				swTip:{
					1:'您的订单已提交成功，请及时支付订单',
					2:'您的订单已支付成功，正在安排发货中',
					4:'您的订单已妥投，如非本人收货，请及时联系客服',
					5:'您的订单未及时支付，已取消订单',
					8:'您的订单已申请退款成功，等待审核中',
					9:'您的订单已发货，请保持通话畅通',
					10:'您的订单已退款成功',
					11:'您的订单已退款失败'
				},
                yb:{

                },
	            // 实物订单状态描述
		        orderstateMsg: {
		            33: '{0}完成，{1}支付{2}费用。',
		            34: '已支付成功，希望能够再次为您服务。',
		            35: '已付款—您的订单已提交成功，正在库房准备出库，请您保持手机畅通，司机会与您联系。',
		            36: '已自提—您购买的商品已提货完成，感谢您的信任与支持。',
		            37: '交易失败，不能完成服务！',
		            65: '您的订单已经审核通过，我们将尽快安排工程师上门。',
		            66: '我们会尽快与您取得联系确认上门时间，请保持电话通畅。',
		            97: '待评论',
		            98: '已评论',
		            353: '您已成功预约了安装服务，请等待工程师上门。',
		            354: '已指派了工程师【{1}】上门，工程师电话{3}',
		            355: '您的订单已安装完成，期待能够再次为您服务',
		            356: '该服务暂时无法完成！',
		            385: '您的订单已出库，配送员{1},电话{3}为您配送，请保持电话畅通。',
		            386: '您的订单已变更派送时间，到时将由配送员为您配送，请耐心等待。',
		            387: '您的预约由于当前服务能力受限，无法为您完成配送，非常抱歉。',
		            388: '配送完成 您的订单已完成送货，感谢您对国美管家的支持，欢迎再次光临。',
		            389: '订单配送失败，用户已拒收。'
		        },
		        // 订单状态描述
		        orderMsg: {
		            33:'{0}完成，{1}支付{2}费用。',
		            34:'已支付成功，希望能够再次为您服务。',
		            35:'您还未预约配送时间及地点，未开始配送。',
		            36:'已分配配送时间及地点，待确认。',
		            37:'交易失败，不能完成服务！',
		            65:'您的订单已经审核通过，我们将尽快安排工程师上门。',
		            66:'我们会尽快与您取得联系确认上门时间，请保持电话通畅。',
		            97:'待评论',
		            98:'ALREADY_COMMENT',
		            353:'',
		            354:'指派了工程师【{1}】上门，工程师电话{3}',
		            355:'已支付成功，希望能够再次为您服务。',
		            356:'该服务暂时无法完成！',
		            385:'您的订单已出库，配送员{1},电话{3}为您配送，请保持电话畅通。',
		            386:'您的预约由于当前服务能力受限，无法为您完成配送，非常抱歉。',
		            387:'您的预约由于当前服务能力受限，无法为您完成配送，非常抱歉。',
		            388:'您的订单已配送完成，感谢您对国美管家的支持，欢迎再次光临',
		            389:'订单配送失败，用户已拒收。',
		            390:'服务商已安排了工程师为您提供上门服务，请您保持手机畅通，工程师将和您取得联系。'
		        }
            }
        },
        created() {
	        this.hrefParma = util.getHrefParma();
            this.sotp = this.hrefParma.odtype;
	        this.getOrderDetail(this.hrefParma.otn, this.hrefParma.dodt, this.hrefParma.odtype);
        },
        filters: {
	        //时间格式化
	        gvTime: function(el) {
                return util.formateDate(el, 'yyyy-MM-dd hh:mm');
            },
			//退款履历提示语
			getTip: function(el) {
				return sw[el];
			},
            //整数
	        numInt: function(value) {
	            return parseInt(value/100)+'.';
	        },
	        //小数
	        numFloat: function(value) {
	            var result = String((value / 100).toFixed(2));
	            return result.substring(result.length - 2);
	        }
    	},
        methods: {
            // 点击退款履历
            fnRefund_TF() {
                this.refundLvTF = !this.refundLvTF;
            },
            // 退款状态
            gvState(sotp,el,late) {
                var stateInfo={};

                if (sotp == 10485761) {
                    if (el == 0 && late) {
                        stateInfo = {
                            n:0,
                            k:'申请退款'
                        };
                    }else if(el == 1){
                        stateInfo = {
                            n:2,
                            k:'退款失败'
                        };
                    }else if(el == 2){
                        stateInfo = {
                            n:2,
                            k:'退款完成'
                        };
                    }else if(el == 3){
                        stateInfo = {
                            n:1,
                            k:'退款中'
                        };
                    };
                }else{
                    if (el == 0 && late) {
                        stateInfo = {
                            n:0,
                            k:'申请退款'
                        };
                    }else if(el == 1 || el == 3){
                        stateInfo = {
                            n:1,
                            k:'退款中'
                        };
                    }else if(el == 2){
                        stateInfo = {
                            n:2,
                            k:'退款完成'
                        };
                    };
                };

                return stateInfo;
            },
            /**
             * 获取订单详情
             */
            getOrderDetail: function(otn, dodt, odtype) {
                var _this = this;
                // 请求
                util.api({
                    // surl: '/resources/json/tkxq.json',
                    surl: root.ORDER_API_PATH + 'getYFrefundDetail',
                    data: {
                        otn: otn,
                        dodt: dodt,
                        odtype: odtype
                    },
                    type: 'get',
                    success: function(res) {
                        var rpco = res.rpco,
                            body = res.body || {};
                        // 处理
                        switch (rpco) {
                            case 200:
                                _this.detailResult = body;
                                _this.gdls = body.gdls;
                                _this.objNumber = _this.gvState(_this.sotp,body.gdls[0].rfdSta,body.gdls[0].late);
                                // 获取退款履历
                                _this.fnLv(body.gdls[0].otn,body.dodt,_this.sotp);
                                break;
                                // 没有找到对应数据
                            case 404:
                                // 加载提示
                                util.comShow({
                                    txt: '非常抱歉，您访问的订单不存在',
                                    icl: 'i-page'
                                });
                                break;
                            default:
                                util.tip('服务器繁忙，请稍后再试')
                        }
                    }
                });
            },
            // 获取退款履历
            fnLv(otn, dodt, odtype) {
            	var _this = this;
                util.api({
                    surl: root.ORDER_API_PATH + 'etodsta',
                    data: {
                        otn: otn,
                        dodt: dodt,
                        odtype: odtype
                    },
                    type: 'get',
                    success: function(res) {
                        var rpco = res.rpco,
                            body = res.body || {};
                        // 处理
                        switch (rpco) {
                            case 200:
								_this.sdfmclList = body.sdfmcl;
								$.each(_this.sdfmclList,function(k,v){
									_this.$set(v,'tip',_this.swTip[v.sdfmst]);
								});
								_this.sdfmclList.reverse();
                                break;
                        }
                    }
                });
            },
        	//调相册
	        callPhotoComp:function() {
	            GomeJSBridge.callPhotoComp(function(data) {
	                console.log(data)
	                switch (data.result) {
	                    case '0': //成功
	                        if (data.images) {
	                            data.images.forEach(function(item) {
	                                if (item.imageData) {
	                                    document.getElementById('showImg').setAttribute('src', 'data:image/jpeg;base64,' + item.imageData)
	                                        // cordova.exec(null, null, "View", "toast", [item.imageData]);
	                                }
	                            })
	                        }
	                        break;
	                    case '1': //取消
	                        GomeJSBridge.toast(null, null, '用户取消啦啦啦啦啦');
	                        break;
	                    case '2': //失败
	                        GomeJSBridge.toast(null, null, '调起失败');
	                        break;
	                }
	            }, function(err) {
	                GomeJSBridge.toast(null, null, '调起失败，错误回调中');
	            })
	        },
        	//掉分享
        	callShareComp:function(){
			    var param = {
			                        title:'李易峰李易峰',
			                        shareDesc:'好帅好帅好帅哦好帅哦好帅哦好帅哦好帅哦好帅哦好帅哦好帅哦好帅哦好帅哦好帅哦好帅哦好帅哦好帅哦好帅哦',
			                        shareImageUrl:'http://gfs5.gomein.net.cn/T140xvB5L_1RCvBVdK.jpg',
			                        shareUrl:'http://m.gome.com.cn',
			                        channel :'link',
			                        platform: ['WeiBo','Wechat','WechatMoments','QQ','QZone']
			                    }
			    GomeJSBridge.callShareComp(function(data){
			        console.log(data)
			        // alert()
			        GomeJSBridge.toast(null,null,'分享状态+'+data.shareResult+'分享平台'+data.platform)
			    },function(err){
			        console.log(err)
			    },param)
			},
        	//设置关闭按钮 和分享按钮
        	setHeadBar2:function() {
			    var param = {
			        menus : {
			            isShowCloseMenu:'Y',
			            rightMenus:[
			                {
			                    type:'share',
			                    title:'分享',
			                    // icon:'',
			                    icon:'file://share',
			                    action:'http://u.m.atguat.com.cn/my_evaluate-0.html',
			                    shareInfo:{
			                        title:'这里是TitleBar设置的分享信息',
			                        shareDesc:'这里是TitleBar设置的分享信息',
			                        shareImageUrl:' http://gfs11.atguat.net.cn/T1athTBXAv1RCvBVdK.jpg'.trim(),
			                        shareUrl:'http://m.gome.com.cn',
			                        // channel : 'shop',   ///分享的频道类型，支持的类型link，product，shop，topic、group
			                        // productInfo : /// 商品信息，如果分享的频道是商品（product），必须传
			                        //   {
			                        //       uid :'100036410102',  //线上会员id
			                        //       stid :'',  //门店id
			                        //       mid :'',   //美店id
			                        //       kid :'' ,  //返利id
			                        //       skuid:'pop8001008856',   // 商品skuid
			                        //       shopid:'80007111',//
			                        //       productName:'自营影音指定商品200元优惠券',// 商品名称
			                        //       productId :''//商品id
			                        // },
			                        // shopInfo : /// 店铺信息，如果分享的频道是店铺（shop），必须传
			                        //   {
			                        //       shopID:'80001231',  ///店铺ID
			                        //       shopType:'0',  //普通店铺(0)，美店(1)
			                        //   },
			                        // platform:['WeiBo','Wechat','WechatMoments','QQ','QZone','GomeMyFriends','GomeMoments','CopyLink']

			                        // platform:['WeiBo','Wechat','WechatMoments','QQ','QZone','GomeMyFriends']
			                        // platform:['WeiBo','Wechat','WechatMoments','QQ','QZone','GomeMyFriends','GomeMyCircle','GomeMoments','ScanQRCode','MyContacts','CopyLink','ProductQRCode']
			                    }
			                }
			            ]
			        }
			    }
			    GomeJSBridge.setHeadBar(function(data){
			        // GomeJSBridge.toast(null,null,'分享成功是上海市刷刷刷')
			        console.log(data)
			    },function(err){
			        console.log(err)
			    },param)
			},
			//设置右侧按钮
			setHeadBar3:function(){
			    var param = {
			        title :'保护我方诸葛亮',
			        titleColor :'ff5c5c',
			        bgColor :'ffffff',
			        menus : {
			            isShowCloseMenu:'Y',
			            rightMenus:[
			                    {
			                        type:'share',
			                        title:'帮助',
			                        // icon:'file://share',
			                        // icon:'https://i-pre.meixincdn.com/v1/img/T1PRYTBsYT1RXrhCrK.jpg',
			                        action:'http://u.m.atguat.com.cn/my_evaluate-0.html',
			                        shareInfo:{
			                            title:'分享标题 鹿晗鹿晗',
			                            shareDesc:'帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅帅',
			                            shareImageUrl:'http://gfs5.gomein.net.cn/T140xvB5L_1RCvBVdK.jpg',
			                            shareUrl:'http://m.gome.com.cn',
			                            platform:['WeiBo','Wechat','WechatMoments','QQ','QZone','GomeMyFriends']
			                            // platform:['WeiBo','Wechat','WechatMoments','QQ','QZone','GomeMyFriends','GomeMyCircle','GomeMoments','ScanQRCode','MyContacts','CopyLink','ProductQRCode']
			                        }
			                    },
			                    {
			                        type:'search',
			                        title:'搜索',
			                        icon:'https://i-pre.meixincdn.com/v1/img/T1PRYTBsYT1RXrhCrK.jpg',
			                        //icon:'file://search',
			                        action:'http://h5.m.gome.com.cn/mshop_search.html?shopId=123123123'
			                    },
			                    {
			                        type:'scheme',
			                        title:'我的评价',
			                        icon:'https://i-pre.meixincdn.com/v1/img/T1PRYTBsYT1RXrhCrK.jpg',
			                        action:'http://u.m.atguat.com.cn/my_evaluate-0.html'
			                    }
			                ]
			        }
			    }
			    GomeJSBridge.setHeadBar(function(data){
			        console.log(data)
			    },function(err){
			        console.log(err)
			    },param)
			},
			//设置标题
			setHeadBar:function(){
			    // var param = {
			    //     title :'这是黑化后的标题',
			    //     titleColor :'ff5c5c',
			    //     bgColor :'000000',
			    //     menus:{
			    //         rightMenus:[
			    //             {
			    //                 type:'scheme',
			    //                 title:'帮助',
			    //                 icon:'',
			    //                 // icon:'https://i-pre.meixincdn.com/v1/img/T1PRYTBsYT1RXrhCrK.jpg',
			    //                 action:'http://u.m.atguat.com.cn/my_evaluate-0.html'
			    //             }
			    //         ]
			    //     }
			    // }
			    var param = {
			        menus: {
			            rightMenus: [{
			                type: 'scheme',
			                title: '帮助',
			                icon: 'http://css.gomein.net.cn/plus/plus-h5/help-6x.png',
			                action: 'http://www.baidu.com',
			            }]
			        }
			    }
			    GomeJSBridge.setHeadBar(function(data){
			        console.log(data)
			    },function(err){
			        console.log(err)
			    },param)
			},
	        /**
	         * 点击显示复制层
	         */
	        showCopy: function() {
	        	$(".copy-layer").toggleClass('dn');
	        },
	        /**
	         *复制订单号
	         */
	        copy: function() {
	        	$(".copy-layer").addClass('dn');
	        	var clipboard = new Clipboard("#copyBtn");
				clipboard.on('success', function(e) {
				    util.tip('复制成功!');
				});
				clipboard.on('error', function(e) {
					util.tip('浏览器不支持自动复制,请手动复制!');
				});
	        }
        },
        components: {
            headerComponent
        }
	}
</script>
<style lang="less">
.container .list-labelvalue li:not(:last-child){
    border-bottom:0;
}
/*过渡显示隐藏*/
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s
}
.fade-enter,.fade-leave-to,.fade-leave-active {
  opacity: 0
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to, .slide-fade-leave-active  {
  transform: translateX(10px);
  opacity: 0;
}
/*订单信息*/
.orderInfo{
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
                width: 5.026667rem;
                font-size: 0.32rem;
                color: #333;
                margin: 0.186667rem 0 0 0.266667rem;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
            }
            .order-info_pp{
                text-align: right;
                margin-top: 0.266667rem;
            }
            .order-info_b{
                width: 100%;
                margin: 0.72rem 0 0 0.266667rem;
                color: #999;
                font-size: 0.266667rem;
                line-height:0.426667rem;
            }
        }
        /*延保*/
        .order-info-yb{
            width: 7.44rem;
            .order-info-yb-p1{
                margin-top:0.186667rem;
                color: #333;
                font-size: 0.346667rem;
                line-height: 0.426667rem;
                width: 6.4rem;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            .order-info-yb-p2{
                margin-top:0.133333rem;
                color: #999;
                font-size: 0.32rem;
                line-height: 0.426667rem;
                .s1{
                    width: 6.4rem;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
                .s2{
                    margin-right: 0.266667rem;
                }
            }
            .order-info-yb-p3{
                margin-top:0.08rem;
                color: #999;
                font-size: 0.32rem;
                line-height: 0.426667rem;
                width: 6.4rem;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
        }
        /*延保*/
    }
}
</style>