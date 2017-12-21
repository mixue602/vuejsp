<template>
	<div id="ordersDetail" class="wapper">
		<!-- 预约时间 -->
        <transition name="slide-fade">
            <div class="date-time" @click="" v-show="dateTimeTF">
                <div class="date-time-vessel" @click.stop>
                    <span class="date-time-x" @click="fnDateTimeTF"></span>
                    <h3>预约安装</h3>
                    <div class="date-time-week">
                        <ul class="clearfix" v-slide>
                            <li class="float_l " :class="" v-for="(v,i) in dateTimeWeek" @click="">
                                <p>{{ v.week }}</p>
                                <p>{{ v.date }}</p>
                                <span v-show=""></span>
                            </li>
                        </ul>
                    </div>
                    <ul class="clearfix date-time-timeSlot">
                        <li class="float_l" v-for="(v,i) in dateTimeSlotAll" @click=""><span v-show="dateTimeSlotIndex == i"></span></li>
                    </ul>
                    <p class="date-time-phone">也可拨打预约安装电话：400-265-7895&nbsp;010-87456321</p>
                    <div class="date-time-save" @click="">确认</div>
                </div>
            </div>
        </transition>
        <!-- 预约时间 -->
		<!-- 公共头部 -->
		<header-component :title="title"></header-component>
		<!-- 实物订单 -->
		<div class="container" style="width:10rem;left:initial;">
			<!-- 配送状态 -->
			<div class="delivery-state t14" @click.stop="fnOrderLv(detailResult.oid,detailResult.shippingGroupId,detailResult.dodt,detailResult.sotp,detailResult.servant.type)">
				<div class="staff-info">
                    <div class="staff-info-profile" @click.stop="fnServant(detailResult.oid,detailResult.servant.id,detailResult.shippingGroupId,detailResult.servant.type,detailResult.dodt,detailResult.odst)" v-if="detailResult.servant.headIcon"><img :src="detailResult.servant.headIcon"/></div>
				    <!-- <div class="staff-info-profile" @click.stop="fnServant(detailResult.oid,detailResult.servant.id,detailResult.shippingGroupId,detailResult.servant.type,detailResult.dodt,detailResult.odst)" v-else><img src="//gfs13.gomein.net.cn/T1oLJvBsCT1RCvBVdK.png"/></div> -->
				    <div class="staff-info-desc">
				        <p class="staff-info-name" v-if="detailResult.servant.name">{{ workertype[detailResult.servant.type] }}：{{ detailResult.servant.name }}</p>
				        <p class="staff-info-name"><span class="star-five t12" v-for="n in detailResult.servant.starRated">★</span></p>
				        <p class="staff-info-num" v-if="detailResult.servant.serviceCount">已服务{{detailResult.servant.serviceCount}}人</p>
				    </div>
				</div>
			    <div class="state-right">
			        {{orderstate.zt[detailResult.odst]}}
			    </div>
			</div>
			<!-- 订单状态 -->
			<div class="order-info" v-if="detailResult.odstDesc" @click.stop="fnOrderLv(detailResult.oid,detailResult.shippingGroupId,detailResult.dodt,detailResult.sotp,detailResult.servant.type)">
			    <i class="bg" :class="{bg2:detailResult.servant.type == 2}"></i>
			    <div class="desc green t13 bTn bdr-top":class="{desc2:detailResult.servant.type == 2}">{{detailResult.odstDesc}}</div>
			    <div class="color999 t11 bdr-bottom pd10">{{ detailResult.otut | gvTime }}</div>
			    <i class="i i-gt"></i>
			</div>
			<!-- 配送地址 -->
		    <ul class="list-line">
		    	<li v-show="detailResult.cname&&detailResult.faddr">
		    		<div class="area-info t13">
                        <i class="bg"></i>
                        <div class="info-box">
                        	收货地址
                            <span class="name">{{detailResult.cname}}</span>
                            <span class="phone">{{detailResult.cphone}}</span>
                        </div>
                        <div class="color999 bdr-bottom pd10">{{detailResult.faddr}}</div>
                    </div>
		    	</li>
		    </ul>
		    <!-- 商品列表 -->
		    <div class="order-shopBar t13">{{detailResult.spnm}}</div>
		    <div class="orderInfo">
                <div class="clearfix order-info-d1" v-for="(v2,i2) in detailResult.gdls" >
                    <div class="float_l orderImg">
                        <img :src="detailResult.gdls[0].imgs" alt="">
                        <!-- <span v-show="i2 != 0"></span> -->
                    </div>
                    <div class="float_l order-info-d2">
                        <p class="order-info_t">{{ v2.gdnm }}</p>
                        <p class="order-info_gdnu">x{{ v2.gdnu }}</p>
                        <!-- <p class="order-info_b"  v-show="i2 == 0">安装: {{ v2.installTime | gvWeek}}</p> -->
                    </div>
                    <!-- 修改预约安装时间 -->
                    <!-- <span class="order-time" v-show="i2 == 0" @click="fnOrderTimeZz">查看</span> -->
                    <!-- 修改预约安装时间 -->
                </div>
            </div>
		    <!-- 售后 -->
		    <div class="order-bg">
		    	<div class="after-service t13 bdr-bottom" v-show="detailResult.odst == 'NO_PENDING_ACTION' || detailResult.odst == 'PENDING_INSTALL' ||  detailResult.odst == 'INSTALLING' || detailResult.odst == 'COMPLETE_INSTALL' || detailResult.odst == 'COMPLETE_DELIVERY'">
                    <!-- 申请售后 -->
		    		<span class="btn btn-linear mr" v-show="detailResult.odst == 'NO_PENDING_ACTION' || detailResult.odst == 'PENDING_INSTALL' ||  detailResult.odst == 'INSTALLING' || detailResult.odst == 'COMPLETE_INSTALL' || detailResult.odst == 'COMPLETE_DELIVERY'" @click="fnOrderSale(detailResult.oid,detailResult.shippingGroupId,detailResult.sotp,detailResult.gdls[0].gdid,detailResult.gdls[0].gdBrandId,detailResult.gdls[0].gdCateId,detailResult.gdls[0].gdnm,detailResult.gdls[0].gdModel)">申请售后</span>
		    		<!-- 售后浮层 -->
		    		<div class="after-layer" v-show="orderSaleTF">
		    			<span class="triangle-up"></span>
		    			<ul class="t15">
			                <!-- 等待配送，已出库，等待配送 -->
                            <!-- <li @click.stop="fnCd(v.oid,v.sotp)" v-show="v2.canRemindOrd"><span>催单</span></li> -->
                            <!-- 报维修 -->
                            <li @click.stop="fnRepair(detailResult.dodt,detailResult.gdls[0].gdid,detailResult.gdls[0].gdBrandId,detailResult.gdls[0].gdCateId,detailResult.gdls[0].gdModel,detailResult.gdls[0].gdnm,detailResult.gdls[0].gdnu,detailResult.ramp)" v-show="butJudge.isRepair"><span class="">维修</span></li>
                            <!-- 报回收 -->
                            <li @click.stop="fnRecycle(detailResult.gdls[0].gdid,detailResult.gdls[0].gdBrandId,detailResult.gdls[0].gdCateId,detailResult.gdls[0].gdModel,detailResult.gdls[0].gdnm)" v-show="butJudge.isRecovery"><span>回收</span></li>
                            <!-- 说明书 -->
                            <li @click.stop="fnDirection(detailResult.gdls[0].gdnm)" v-show="butJudge.isInstructions"><span>说明书</span></li>
                            <!-- 电子发票 -->
                            <li @click.stop="fnDzfp" v-show="invoiceNoData.invoiceNo"><span>电子发票</span></li>
                            <!-- 报清洗 -->
                            <li @click.stop="fnClean(detailResult.gdls[0].gdCateId)" v-show="butJudge.isClean"><span>清洗</span></li>
		    			</ul>
		    		</div>
		    	</div>
		    </div>
		    <!-- 客服 -->
		    <div class="order-bg">
			    <ul class="custom-service t14 bdr-bottom">
			    	<li><a :href="'tel:'+detailResult.spphone"><span class="icon seller-tel"></span>商家电话</a></li>
			    	<!-- <li><a href="tel:4008113333"><span class="icon service-tel"></span>在线客服</a></li> -->
			    </ul>
			</div>
		    <ul class="list-labelvalue t13">
		        <!-- <li class="t14" v-if="">
		            <label>供货商家</label>
		            <span class="value t14" id="spsr">{{detailResult.spsr}}</span>
		        </li> -->
		       <!--  <li class="t14 dn">
		            <div>
		                <label>预约送货</label>
		                <span class="value" id="atdvt">2015-10-22 00:00~10-22 00:00</span>
		            </div>
		            <div class="">
		                <label>供货安装</label>
		                <span class="value" id="atitct">2016-06-09  15:00-22:00</span>
		            </div>
		        </li> -->
		        <li class="bdr-bottom" v-if="detailResult.oid">
		        	<div>
		       		    <label>订单编号</label>
		                <span class="value" id="otn" @click="showCopy">{{detailResult.oid}}</span>

		            </div>
		            <!-- 复制浮层 -->
		    		<dl class="copy-layer dn">
		    			<a  @click="copyy" href="javascript:;" data-clipboard-action="copy" data-clipboard-target="#oidtxt"  class="copyBtn t15" id="copyBtn">复制</a>
		    			<span class="triangle-down"></span>
		    		</dl>
		        </li>
		        <li class="bdr-bottom" v-if="detailResult.dodt">
		        	<div>
		                <label>下单时间</label>
		                <span class="value" id="sdodt">{{ detailResult.dodt | gvTime }}</span>
		            </div>
		        </li>
		        <li class="bdr-bottom" v-if="detailResult.gdls[0].deliveryTypeNm">
		        	<div>
		                <label>配送方式</label>
		                <span class="value" id="dtway">{{ dtwayAll[ detailResult.gdls[0].deliveryTypeNm ] }}</span>
		            </div>
		        </li>
		        <li class="bdr-bottom" v-if="detailResult.gdls[0].deliveryTime">
		        	<div>
		                <label>配送日期</label>
		                <span class="value" id="sdodt">{{ detailResult.gdls[0].deliveryTime }}</span>
		            </div>
		        </li>
		        <li class="bdr-bottom" v-if="detailResult.gdls[0].installTypeNm">
		        	<div>
		                <label>安装方式</label>
		                <span class="value" id="sdodt">{{ detailResult.gdls[0].installTypeNm }}</span>
		            </div>
		        </li>
		        <li class="bdr-bottom" v-if="detailResult.gdls[0].atitcts">
		        	<div>
		                <label>安装日期</label>
		                <span class="value" id="sdodt">{{ detailResult.gdls[0].atitcts | gvTime }} - {{ detailResult.gdls[0].atitcte | gvTimeend }}</span>
		            </div>
		        </li>
                <li class="bdr-bottom" v-if="detailResult.payMethod">
                    <div>
                        <label>支付方式</label>
                        <span class="value" id="sdodt">{{ detailResult.payMethod }}</span>
                    </div>
                </li>
		        <li class="bdr-bottom" v-if="detailResult.invoiceId">
		        	<div>
		                <label>发票类型</label>
		                <span class="value" id="sdodt">{{ detailResult.invoiceTpNm }}</span>
		            </div>
		        </li>
		        <li class="bdr-bottom" v-if="detailResult.invoiceId">
		        	<div>
		                <label>发票名称</label>
		                <span class="value" id="sdodt">{{ detailResult.invoiceTitle }}</span>
		            </div>
		        </li>
		        <li class="bdr-bottom" v-if="detailResult.invoiceId">
		        	<div>
		                <label>发票信息</label>
		                <span class="value" style="color:#ff4b46" id="ivifm" @click="fnInvo(detailResult.oid,detailResult.invoiceId,detailResult.sotp)">明细&nbsp;></span>
		            </div>
		        </li>
		    </ul>
	    	<ul class="list-labelvalue t13 mt10 mbottom140">
		        <li>
		           <!--  <div>
		                <label>商品总价</label>
		                <span class="value" id="gtam"><i class="t12">¥</i> {{ detailResult.gtam | numInt }}<i class="t12">{{ detailResult.gtam | numFloat }}</i></span>
		            </div>
                    <div v-if="detailResult.frgt != null && detailResult.frgt != 0">
                        <label>运费</label>
                        <span class="value" id="frgt">+ <i class="t12">¥</i> {{ detailResult.frgt | numInt }}<i class="t12">{{ detailResult.frgt | numFloat }}</i></span>
                    </div> -->
                    <div>
                        <label>实付款</label>
                        <span class="value">¥ <i>{{ detailResult.ramp | numInt }}</i>{{ detailResult.ramp | numFloat }}</span>
                    </div>
		        </li>
		    </ul>
		</div>
		<!-- <div class="order-btn t18" v-if="detailResult.odst == 33 && hrefParma.odtype != 4194307" @click="toPay">立即支付</div> -->
		<div class="footer t13">
            <span></span>
	        <span class="btn btn-linear mr" v-show="detailResult.gdls[0].canApprise" @click.stop="fnComment(detailResult.oid,detailResult.sotp,detailResult.gdls[0].gdid,detailResult.shippingGroupId)">评价</span>
	        <span class="btn btn-linear mr" v-show="detailResult.odst == 1 || detailResult.odst == 33 && detailResult.odst != 201 && detailResult.odst != 202" @click.stop="fnPay(detailResult.oid,detailResult.ocrt)">支付</span>
	    </div>
	</div>
</template>
<script type="ecma6.0">
	import headerComponent from '../../components/HeaderComponent'
	let root = window || {},
	    util = root.util || {};
	export default {
    	data() {
            return {
	            hrefParma: {},
                odtype:null,
                // 查询设备参数
                butJudge: {
                    "isRepair": null,
                    "isRecovery": null,
                    "isClean": null,
                    "isInstructions": null,
                    "repairType": null,
                    "gid": null,
                    "did": null,
                    "goods": {
                        "dqGoodsId": null,
                        "dqGoodsName": null,
                        "gjGoodsId": null,
                        "gjGoodsName": null,
                        "zxGoodsId": null,
                        "zxGoodsName": null,
                        "model": null,
                        "dqBrandId": null,
                        "dqCateId": null,
                        "gjBrandId": null,
                        "gjCateId": null,
                        "zxBrandId": null,
                        "zxCateId": null
                    },
                    "scope": null
                },
                // 电子发票id
                invoiceNoData:{
                    orderId:null,
                    orderType:null,
                    ordersource:null,
                    invoiceNo:null
                },
                // 订单详情集合
	            detailResult: {
                    servant:{
                        id:null,
                        type:null,
                        name:null,
                        headIcon:'//gfs13.gomein.net.cn/T1oLJvBsCT1RCvBVdK.png',
                        starRated:null,
                        serviceCount:null
                    },
                    gdls:[{
                        gdnu:null,
                        gdNm:null,
                        gdId:null,
                        gdCateId:null,
                        gdBrandId:null,
                        gdModel :null
                    }]
                },
	            // 时间遮罩层
	            dateTimeTF:false,
	            // 初始化预约时间日期
	            dateTimeWeek:[],
	            // 预约时间段集合
                dateTimeSlotAll:[],
                // 售后服务列表TF
                orderSaleTF:false,
	            title: "订单详情",
	            // 发票信息
	            ivifm: {
	                1: '已开',
	                2: '未开'
	            },
	            einvoice: null,
	            // 订单状态
	            orderstate: {
	            	// 中台订单状态
	            	zt:{
                        "INITIAL": "待付款",
                        "PROCESSING": "待出库",
                        "PENDING_SHIPMENT": "待出库",
                        "PENDING_MERCHANT_ACTION": "待出库",
                        "FAILED": "待出库",
                        "PENDING_REMOVE": "等待取消",
                        "REMOVED": "已取消",
                        "NO_PENDING_ACTION":"已妥投",
                        "DELIVERY": "配送中",
                        "PENDING_ORDER_CONFIRM": "配送中",
                        "REJECT_BACK": "已拒收",
                        "REJECT": "已拒收",
                        "PAUSED": "",
                        "ERROR": "",
                        "PENDING_GIFT_BACK": "等待赠品收回",
                        "PENDING_POST_PROCESS": "待付款",
                        "PENDING_FINAL_PAYMENT": "待支付尾款",
                        "DEPOSIT_PAYMENT": "定金已支付",
                        "PENDING_SPELL_GROUP": "等待拼团",
                        "PENDING_DEPOSIT_PAYMENT": "待支付定金",
                        "PENDING_PAYMENT":"待付款",
                        // 安装相关状态
                        "PENDING_INSTALL": "待派工",
                        "INSTALLING": "安装中",
                        "COMPLETE_INSTALL": "安装完成",
                        "COMPLETE_DELIVERY": "已完成",
                        "CHANGE_PROFILE_ID": "代客下单"
                    },
	            	// 标准平台实物订单状态
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
                    // 大中闪购订单
                    dzsg:{
                        1: "待付款",
                        2: "下单成功",
                        4: "妥投完成",
                        5: "已取消",
                        6: "妥投失败",
                        7: "妥投失败",
                        8: "退款",
                        9: "已发货",
                        10: "退款完成",
                        11: "退款失败",
                        12: "退款中",
                        13: "退款失败",
                        14: "退款成功",
                        15: "退款中"
                    },
	                //延保订单状态
	                1: '待支付',
	                2: '投保成功',
	                3: '投保成功',
	                4: '投保成功',
	                5: '已取消',
	                6: '投保成功',
	                7: '投保失败',
	                //延保订单已支付不显示状态
	                99: '',
	                33: '待支付',
	                34: '支付成功',
	                35: '待配送',
	                36: '已自提',
	                37: '交易失败',
	                65: '审核通过',
	                66: '下单成功',
	                353: '已预约',
	                354: '已派工',
	                355: '已完成',
	                356: '无法完成',
	                385: '已出库',
	                386: '延迟派送',
	                387: '预约无法执行',
	                388: '已妥投',
	                389: '已拒收',
	                //虚拟充值
	                700: '支付成功',
	                1100: '充值失败',
	                1500: '充值失败',
	                1600: '充值失败',
	                1200: '充值中',
	                1300: '充值中',
	                1400: '充值成功',
	                4600: '退款失败',
	                5000: '退款成功',
	                4000: '退款中',
	                4320: '退款中',
	                4400: '退款中',
	            },
	            //服务人员类型
	            workertype: {
	                1: "配送员",
	                2: "安装员"
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
		        },
	            // 全部配送方式
	            dtwayAll: {
	                1: '用户自提',
	                2: '集中配送',
	                3: '安装带货',
	                4: '配送自提',
	                5: '门店配送',
	                6: '厂家安装带货',
	                7: '待预约配送'
	            }
            }
        },
        created() {
        	var weekNum = {
                    0:'日',
                    1:'一',
                    2:'二',
                    3:'三',
                    4:'四',
                    5:'五',
                    6:'六'
                };
	        this.hrefParma = util.getHrefParma();
            this.odtype = this.hrefParma.odtype;
	        this.getOrderDetail(this.hrefParma.oid, this.hrefParma.odtype, this.hrefParma.dodt, this.hrefParma.shippingGroupId);
	        // 初始化预约时间日期
            for (var i = 0; i < 7; i++) {
                var time = new Date().getTime(),
                    time = time + (24 * 60 * 60 * 1000) * (i+1),
                    day = util.formateDate(time,'MM月dd日'),
                    week = util.formatWeek(time),
                    timGjson = {
                    week:week,
                    date:day
                };
                this.dateTimeWeek.push(timGjson);
            };
        },
        filters: {
	        //时间格式化
	        gvTime: function(el) {
                return util.formateDate(el, 'yyyy-MM-dd hh:mm');
            },
            gvTimeend: function(el) {
                return util.formateDate(el, 'hh:mm');
            },
            gvWeek: function(el) {
                var dataTime,
                    weekNum = {
                        0:'日',
                        1:'一',
                        2:'二',
                        3:'三',
                        4:'四',
                        5:'五',
                        6:'六'
                    };
                if (typeof el == 'number') {
                    dataTime = util.formateDate(el,'MM月dd日') + ' 周[' + weekNum[new Date(el).getDay()] + ']';
                }else if(typeof el == 'string' && el != ''){
                    dataTime = el;
                }else{
                    dataTime = '暂未选择';
                };
                return dataTime;
            },
            gvAnText: function(el) {
                var gvAnTime;
                if (el) {
                    gvAnTime = '查看';
                }else{
                    gvAnTime = '选择时间';
                };
                return gvAnTime;
            },	        //整数
	        numInt: function(value) {
	            return parseInt(value/100)+'.';
	        },
	        //小数
	        numFloat: function(value) {
	            var result = String((value / 100).toFixed(2));
	            return result.substring(result.length - 2);
	        },
	        //支付方式
	        fnPayType: function(value) {
			    var str = '';
			    if(value == 1) {
			        str = '支付宝';
				}
				else if(value == 2) {
	                str = '微信支付';
	            }
				else if(value == 3) {
	                str = '银联支付';
				}
				return str;
			}
    	},
        methods: {
            // 支付
            fnPay(otn,dodt) {
                var _this = this;
                if (_this.odtype == 10485761) {
                    util.href('pay.html',{
                        otn:otn,
                        dodt:dodt,
                        odtype:_this.odtype,
                        oddz:1
                    });
                }else{
                    util.href('pay.html',{
                        otn:otn,
                        dodt:dodt,
                        odtype:_this.odtype
                    });
                };
            },
            // 评论
            fnComment(otn,odtype,gdsid,spgid) {
                util.href('discuss.html',{
                    gdsid:gdsid,
                    spgid:spgid,
                    type:2
                })
            },
            // 中台服务人员评价
            fnServant(otn,epnb,spgid,svty,dodt,odst) {
                var _this = this,
                    odtp;
                    if (_this.odtype == 201) {
                        odtp = 0;
                    }else if(_this.odtype == 202){
                        odtp = 1;
                    }else{
                        odtp = 2;
                    };
                if (!epnb || epnb == 'null') return;
                util.href('discussPeople.html',{
                    // 订单id
                    otn:otn,
                    // 服务人员id
                    epnb:epnb,
                    // 配送单号
                    spgid:spgid,
                    // 服务类型
                    svty:svty,
                    // 订单类型
                    odtp:odtp,
                    // 下单时间
                    dodt:dodt
                })
            },
            // 确认收货
            // orderId 订单id
            // orderType 订单类型
            // shippingGroupId 配送单号
            fnQrsh(orderId,orderTypeCode,shippingGroupId) {
                util.alert('确认收货',{
                    okBtnText: '确认',
                    cancelBtnText: '取消',
                    justOk: false,
                    okFn: function() {
                        util.api({
                            surl:'/orderaftersales/yf/confirmation',
                            data:{
                                orderId:orderId,
                                orderTypeCode:orderTypeCode,
                                shippingGroupId:shippingGroupId
                            },
                            type:'get',
                            success:function(response) {
                                var rpco = response.rpco,
                                    body = response.body;

                                switch(rpco) {
                                    case 200:
                                        if (body) {
                                            window.location.reload();
                                        };
                                }
                            }
                        });
                    }
                })
            },
             // 跳转订单履历页
            fnOrderLv(oid,shippingGroupId,dodt,sotp,resumeType) {
                // 跳中台轨迹
                util.href('ordertrack.html',{
                    oid:oid,
                    shippingGroupId:shippingGroupId,
                    dodt:dodt,
                    odtype:sotp,
                    resumeType:resumeType
                })
            },
        	// 售后服务列表TF
        	fnOrderSale(oid,shippingGroupId,sotp,gdId,gdBrandId,gdCateId,gdnm,gdModel) {
                var _this = this;
                _this.orderSaleTF = !_this.orderSaleTF;
                // 判断维修，清洗，回收，电子说明书是否支持
                _this.fnParam(gdId,gdBrandId,gdCateId,gdnm,gdModel);
        		// 判断电子发票是否支持
                _this.fnInvoicedetail(oid,sotp);
        	},
            // 查询设备参数
            fnParam(gdId,gdBrandId,gdCateId,gdnm,gdModel) {
                var _this = this;

                // 获取安装能力查询参数
                util.api({
                    // surl:'/resources/json/butJudge.json',
                    surl:'/orderaftersales/yf/butJudge',
                    type:'get',
                    async: false,
                    data:{
                        gdId:gdId,
                        gdBrandId:gdBrandId,
                        gdCateId:gdCateId,
                        gdnm:gdnm,
                        gdModel:gdModel
                    },
                    success: function(response) {
                        var rpco = response.rpco,
                            body = response.body;

                        if (!body.resultObj) {
                            _this.butJudge = body;
                        };
                    }
                });
            },
            //点击维修，跳转到维修选择故障页
            fnRepair(dodt,gdid,gdBrandId,gdCateId,gdModel,gdnm,gdnu,amount) {
                var _this = this;
                util.href('repairsubmitorder.html',{
                    dodt:dodt,
                    gdid:gdid,
                    gdBrandId:gdBrandId,
                    gdCateId:gdCateId,
                    gdModel:gdModel,
                    gdnm:gdnm,
                    gdnu:gdnu,
                    amount:amount
                });
            },
            //点击回收，跳转到回收选择估计页
            fnRecycle(skuId,brandId,categoryId,model,goodName) {
                var ls = window.localStorage,
                    arcode;

                if(ls.getItem('dstrict') == null){
                    arcode = 110108
                }else{
                    arcode = eval("("+ls.getItem('dstrict')+")").d
                }
                util.api({
                    surl:'/orderaftersales/yf/recovery',
                    data:{
                        skuId:skuId,
                        brandId:brandId,
                        categoryId:categoryId,
                        model:model,
                        goodName:goodName
                    },
                    type:'get',
                    success:function(response) {
                        var rpco = response.rpco,
                            body = response.body;

                        if (rpco == 200 && body.jkxCateId) {
                            util.href('recycleinfo.html',{
                                catename:body.jkxCateName,
                                cateid:body.jkxCateId,
                                brdid:body.jkxBrandId,
                                brdnm:body.jkxBrand,
                                proid:body.jkxRelationId,
                                attrnm:body.jkxRelationName,
                                arcode:arcode
                            });
                        }else{
                            util.href('recycleindexnew.html');
                        };
                    }
                });
            },
            //点击清洗，跳转到清洗商品详情页
            fnClean(categoryId) {
                util.api({
                    surl:'/orderaftersales/yf/clean',
                    data:{
                        categoryId:categoryId
                    },
                    type:'get',
                    success:function(response) {
                        var rpco = response.rpco,
                            body = response.body;
                        if (rpco == 200 && body.jkxParentId) {
                            util.href('cleandetailnew.html',{
                                // 清洗商品编码
                                cgcode:body.jkxParentId
                            });
                        }else{
                            util.href('cleanlistnew.html');
                        };
                    }
                })
            },
            //点击说明书，跳转到说明书首页
            fnDirection(cname) {
                var _this = this;
                util.href('directiondetail.html',{
                    page:1,
                    cateid:null,
                    level:4,
                    docid:_this.butJudge.gid,
                    gdid:_this.butJudge.did,
                    cname:cname
                });
            },
            //点击电子发票，跳转到详情页
            fnInvoicedetail(oid,sotp) {
                var _this = this,
                    ordersource;
                // 订单来源
                if (sotp == 201) {
                    ordersource = 2;
                }else{
                    ordersource = 1;
                };

                util.api({
                    surl:'/einvoice/yf/detail',
                    data:{
                        orderId:oid,
                        orderType:null,
                        ordersource:ordersource,
                        invoiceNo:null
                    },
                    type:'get',
                    success:function(response) {
                        var rpco = response.rpco,
                            body = response.body;

                        if (rpco == 200) {
                            _this.invoiceNoData = {
                                orderId:oid,
                                orderType:sotp,
                                ordersource:ordersource,
                                invoiceNo:body.invoiceNo
                            };
                        };
                    }
                });
            },
            fnInvo(oid,invoiceNo,sotp){
                var _this = this,
                    ordersource;
                // 订单来源
                if (sotp == 201) {
                    ordersource = 2;
                }else{
                    ordersource = 1;
                };
                util.href('invoicedetail.html',{
                    invoiceId:invoiceNo,
                    orderType:sotp,
                    orderSource:ordersource,
                    orderId:oid,
                })
            },
            // 售后服务跳电子发票页
            fnDzfp(){
                var _this = this;
                if (_this.invoiceNoData) {
                    util.href('invoicedetail.html',{
                        orderId:_this.invoiceNoData.orderId,
                        orderType:_this.invoiceNoData.orderType,
                        ordersource:_this.invoiceNoData.ordersource,
                        invoiceId:_this.invoiceNoData.invoiceNo
                    });
                };
            },
        	// 选择预约安装时间
        	fnOrderTimeZz() {
        		var _this = this;
        		_this.dateTimeTF = true;
        	},
        	// 关闭预约时间
            fnDateTimeTF() {
                this.dateTimeTF = false;
            },
            // 查询中台服务人员信息
            fnCxservant: function(otn,epnb,spgid,svty,dodt,) {
                var _this = this,
                    odtp;
                    // 订单类型
                    if (_this.odtype == 201) {
                        odtp = 0;
                    }else if(_this.odtype == 202){
                        odtp = 1;
                    }else{
                        odtp = 2;
                    };
                util.api({
                    surl:'/comment/yf/employee/getComment',
                    data:{
                        // 订单id
                        otn:otn,
                        // 服务人员id
                        epnb:epnb,
                        // 配送单号
                        spgid:spgid,
                        // 服务类型
                        svty:svty,
                        // 订单类型 1 2 3
                        odtp:odtp,
                        // 下单时间
                        dodt:dodt
                    },
                    type:'get',
                    success:function(response) {
                        var rpco = response.rpco,
                            body = response.body;

                        if (rpco == 200) {
                            // 服务人员id
                            _this.detailResult.servant.id = body.epnb;
                            // 服务人员姓名
                            _this.detailResult.servant.name = body.epnm;
                            // 服务人员头像
                            _this.detailResult.servant.headIcon = body.epimg;
                            // 星星
                            _this.detailResult.servant.starRated = Math.round(body.tscore/body.tnum);
                        }else{
                            _this.detailResult.servant = {
                                id:null,
                                type:null,
                                name:null,
                                headIcon:'//gfs13.gomein.net.cn/T1oLJvBsCT1RCvBVdK.png',
                                starRated:null,
                                serviceCount:null
                            };
                        };
                    }
                })
            },
            /**
             * 获取订单详情
             */
            getOrderDetail: function(oid, odtype, dodt, shippingGroupId) {
                var _this = this;
                // 请求
                util.api({
                    // surl: '/resources/json/detailsw.json',
                    surl: root.ORDER_API_PATH + 'gmOrder',
                    data: {
                        oid: oid,
                        odtype: odtype,
                        dodt: dodt,
                        shippingGroupId: shippingGroupId
                    },
                    type: 'get',
                    success: function(res) {
                        var rpco = res.rpco,
                            body = res.body || {};
                        // 处理
                        switch (rpco) {
                            case 200:
                                _this.detailResult = body;
                                // 商家电话
                                if(!_this.detailResult.spphone) {
                                    // 如果是线上订单
                                    if (_this.detailResult.sotp == 201) {
                                        // 如果是国美自营订单
                                        if (_this.detailResult.spnm.indexOf('国美自营') > 0) {
                                            _this.detailResult.spphone = 4008113333;
                                        }else{
                                            _this.detailResult.spphone = 4008708708;
                                        };
                                    // 如果是线下订单
                                    }else{
                                        _this.detailResult.spphone = 4008113333;
                                    };
                                };
                                // 存在服务人员信息， 调评价接口
                                if (_this.detailResult.servant) {
                                    _this.fnCxservant(_this.detailResult.oid,_this.detailResult.servant.id,_this.detailResult.shippingGroupId,_this.detailResult.servant.type,_this.detailResult.dodt);
                                }else{
                                    // 如果没有服务人员信息，servant里字段保持有值
                                    _this.detailResult.servant = {
                                        id:null,
                                        type:null,
                                        name:null,
                                        headIcon:'//gfs13.gomein.net.cn/T1oLJvBsCT1RCvBVdK.png',
                                        starRated:null,
                                        serviceCount:null
                                    };
                                };
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
            copyy(){
                var clipboard = new Clipboard('.copybtn');
                clipboard.on('success', function(e) {
                     util.tip('复制成功!');
                });

                clipboard.on('error', function(e) {
                    console.log(e);
                });
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
        directives: {
          slide: {
            // 指令的定义
            inserted: function (el) {
                // 元素left
                var initLeft = 0;
                // 手指按下时
                $(el).on('touchstart',function(e) {
                    // 获取手机在屏幕上的x坐标
                    var startX =e.touches[0].pageX;
                    // 手指滑动时
                    $(el).on('touchmove',function(e) {
                        var startXmove = e.touches[0].pageX,
                            // 元素移动left
                            elementLeft = initLeft + startXmove - startX,
                            // 差值
                            elW = $(el).parent().width() - $(el).width();
                        // 如果元素left > 0，左侧禁止滑动
                        if (elementLeft > 0) {
                            $(this).css({
                                'left':0
                            });
                        // 如果元素left < 差值，右侧禁止滑动
                        }else if(elementLeft < elW){
                             $(this).css({
                                'left': elW
                            });
                        // 正常情况
                        }else{
                             $(this).css({
                                'left': elementLeft
                            });
                        };
                    });
                    // 手指抬起时
                    $(el).on('touchend',function(e) {
                        initLeft = parseInt($(this).css('left'));
                    })
                })
            }
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
        background: #f8f8f8;
        margin-top: 0;
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
                    top: 1px;
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
            width:6.666667rem;
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
            .order-info_gdnu{
                text-align: right;
                color: #666;
                font-size: 0.326667rem;
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
/*预约时间*/
.date-time{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:rgba(0,0,0,0.7);
    z-index: 999;
    .date-time-vessel{
        width: 100%;
        background: #fff;
        position: absolute;
        bottom: 0;
        left: 0;
        h3{
            height: 1.36rem;
            line-height: 1.36rem;
            text-align: center;
            color: #333;
            font-size: 0.48rem;
        }
        .date-time-x{
            width: 0.48rem;
            height: 0.48rem;
            background:url(//gfs13.gomein.net.cn/T1jhZvBvLT1RCvBVdK.png) no-repeat;
            background-size:100%;
            position: absolute;
            top: 0.133333rem;
            right: 0.266667rem;
        }
        .date-time-week{
            overflow: hidden;
            position: relative;
            height: 1.566667rem;
            ul{
                width: 14.933333rem;
                height: 1.566667rem;
                display: flex;
                text-align: center;
                color: #333;
                font-size: 0.32rem;
                position: absolute;
                top: 0;
                left: 0;
                li{
                    background:#f5f5f5;
                    position: relative;
                    flex:1;
                    height:1.333333rem;
                    p:nth-child(1){
                        margin-top:0.213333rem;
                        line-height: 0.453333rem;
                    };
                    p:nth-child(2){
                        line-height:0.453333rem;
                    }
                    span{
                        position: absolute;
                        left: 0.1rem;
                        bottom: -0.16rem;
                        width: 0;
                        height: 0;
                        color: #fff;
                        text-align: center;
                        border-left: 0.16rem solid transparent;
                        border-right: 0.16rem solid transparent;
                        border-top: 0.16rem solid #FF4B41;
                    }
                }
                .action{
                    background: #FF4B41;
                    color: #fff;
                }
                .disabled{
                    color: #999;
                }
            }
        }
        .date-time-timeSlot{
            /*width:9.453rem;*/
            display: inline-block;
            margin: 0.266667rem 0 0 0.266667rem;
            text-align: center;
            line-height: 1.333333rem;
            border-left: 1px solid #666;
            li{
                width: 3.12rem;
                height: 1.306667rem;
                border-right: 1px solid #666;
                border-bottom: 1px solid #666;
                position: relative;
                span{
                    border:1px solid #FF4B41;
                    width: 3.12rem;
                    height: 1.306667rem;
                    position: absolute;
                    top: -1px;
                    left: -1px;
                    z-index: 9999;
                }
                .ff9897{
                    border: 1px solid #FF9897;
                }
            }
            li:nth-child(1){
                border-top: 1px solid #666;
            }
            li:nth-child(2){
                border-top: 1px solid #666;
            }
            li:nth-child(3){
                border-top: 1px solid #666;
            }
            .disabled{
                background: #FFF1F1;
            }
        }
        .date-time-phone{
            font-size: 0.32rem;
            line-height: 0.453333rem;
            color: #999;
            text-align: center;
            margin-top:1.866667rem;
        }
        .date-time-save{
            text-align: center;
            height: 1.306667rem;
            line-height:1.306667rem;
            color: #fff;
            font-size: 0.48rem;
            background: #FF4B41;
            margin: 0.266667rem 0 0.8rem 0;
        }
    }
}
/*预约时间*/
</style>