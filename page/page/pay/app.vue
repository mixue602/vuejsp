<template>
	<div class="wapper" >
		<!-- 公共头部 -->
		<header-component :title="title" :direction="1"  @watchdirection="goBack"></header-component>
		<section class="pay-box">
			<div class="count-down-box bdr-bottom" v-show="countFlag">
				<div class="count-down-time"><span>00</span> : <span v-text="timeRemaining.minutes"></span> : <span v-text="timeRemaining.second"></span></div>
				<div class="count-down-tip">请您在30分钟内完成支付</div>
			</div>
			<div class="order-info">
				<div class="pub-flex"><p class="txt1 ">订单号</p><p class="txt2 pub-flex-auto" v-text="jkxId"></p></div>
				<div class="pub-flex"><p class="txt1">订单金额</p><p class="txt2 pub-flex-auto" v-html="orderInfo.orderAmount"></p></div>
				<div class="pub-flex" v-show="orderInfo.discountAmount != 0"><p class="txt1">优惠金额</p><p class="txt2 pub-flex-auto" v-html="orderInfo.discountAmount"></p></div>
				<div class="pub-flex"><p class="txt1">应付金额</p><p class="txt2 pub-flex-auto" v-html="orderInfo.amountPayable"></p></div>
				<div class="pub-flex"><p class="txt1">支付方式</p><p class="txt2 pub-flex-auto">在线支付</p></div>
			</div>
		</section>
		<section class="pay-box mg-top20">
			<div class="pay-coupon bdr-bottom" @click = "selectCoupon">
				<span class="tit">优惠券</span>
				<span class="tip" v-text="orderInfo.counponTip"></span>
			</div>
			<div class="pay-coupon">
				<span class="tit">请选择支付方式</span>
			</div>
			<div class="pay-way">
				<dl class="pub-flex" v-show="false" chaid = "22" ref="payItem" @click = "selectPayType($event)">
					<dt class=""><i class="icon icon-zfb"></i></dt>
					<dd class="pub-flex-auto bdr-top">
						<p class="txt1">支付宝支付</p>
						<p class="txt2">支付说明</p>
					</dd>
					<dd class="btn"></dd>
				</dl>
				<!--微信支付-->
				<dl class="pub-flex check" v-show="wxFlag"  chaid = "3"  ref="payItem" @click = "selectPayType($event)">
					<dt class=""><i class="icon icon-wx"></i></dt>
					<dd class="pub-flex-auto bdr-top">
						<p class="txt1">微信支付</p>
						<p class="txt2">推荐安装微信5.0及以上版本使用</p>
					</dd>
					<dd class="btn"></dd>
				</dl>
				<!--微信WAP支付-->
				<dl class="pub-flex check" v-show="wapFlag"  chaid = "9"  ref="payItem" @click = "selectPayType($event)">
					<dt class=""><i class="icon icon-wx"></i></dt>
					<dd class="pub-flex-auto bdr-top">
						<p class="txt1">微信支付</p>
						<p class="txt2">推荐安装微信5.0及以上版本使用</p>
					</dd>
					<dd class="btn"></dd>
				</dl>
				<dl class="pub-flex"  chaid = "11" v-show="appFlag"   ref="payItem" @click = "selectPayType($event)">
					<dt class=""><i class="icon icon-yl"></i></dt>
					<dd class="pub-flex-auto bdr-top">
						<p class="txt1">银行卡支付</p>
						<p class="txt2">支付服务由银联提供，无需开通网银</p>
					</dd>
					<dd class="btn"></dd>
				</dl>
			</div>
		</section>
		<footer id="toPay" @click = "payBtnClick">立即支付</footer>
	</div>

</template>

<script type="text/ecmascript-6">
import headerComponent from '../../components/HeaderComponent'
let root = window || {},
    util = root.util || {};
export default {
	data () {
		return {
			title:"支付订单",
			countFlag: false,
			zfbFlag: false,
			wapFlag:false,
			wxFlag:false,
			appFlag:false,
			jkxId:'',
			timeRemaining: {
				minutes: '00',
				second : '00'
			},
			orderInfo: {
				orderAmount : 0,
				amountPayable : 0,
				discountAmount:0,
				counponTip : '无可用优惠券'
			},
			options:{
				hrefParma: util.getHrefParma(),
				// 订单号
				otn: '',
				// 下单时间戳
				dodt: 0,
				//可用优惠券个数
				coucc:0,
				//可用优惠券最优价格
				couprice:0,
				// 微信支付参数
				wxpc: {
					// 公众号的唯一标识
					appId: '',
					// 支付签名时间戳
					timeStamp: '',
					// 支付签名随机串
					nonceStr: '',
					// 统一支付接口返回的prepay_id参数值
					package: '',
					// 签名方式
					signType: '',
					// 支付签名
					paySign: '',
					// 支付成功后的回调函数
					success: this.paySuccess
				},
				// 可选择优惠券
				canSelectCoupon: false,
				// 支付方式  3为微信支付 11为银联支付
				chaid:3,
				//应付金额
				pttl:0,
				mops: {
					1: '微信支付',
					2: '快捷支付'
				},
				// 优惠券
				coupon: {
					// 券编号
					counum: 0,
					// 券金额
					coumy: 0
				},
				msg: {
					m1: '订单信息错误',
					m2: '支付签名时间戳不能为空',
					m3: '支付签名随机串不能为空',
					m4: '统一支付值不能为空',
					m5: '签名方式不能为空',
					m6: '支付签名不能为空',
					m7: '无可用优惠券',
					m8: '支付单有误，不可继续操作',
					m9: '您确定要退出吗？'
				},
				// 请求状态，用于ajax请求
				requestState: {
					//createOrder: true
				}
			}
		}
	},
	created() {
	},

    computed: {

	},
    mounted: function() {
        this.$nextTick(function () {
            this.init();
        });
    },
	methods: {
		init: function() {
			var that = this,
				hrefParma = that.options.hrefParma;


			//如果不在微信浏览器显示支付宝支付
			if(!util.isWeiXin()){
				that.zfbFlag = true;
			}
			if(!util.isApp()){
				that.appFlag = true;
			}
			if(util.isWeiXin() || util.isApp()){
				that.wxFlag = true;
			}else {
				that.wapFlag = true;
				that.options.chaid = 9;
			}
			// 订单号
			that.options.otn = hrefParma.otn || '';
			if(hrefParma.jkxOid){
				that.jkxId = hrefParma.jkxOid;
			}else{
				that.jkxId = hrefParma.otn || '';
			}
			// 下单时间
			that.options.dodt = hrefParma.dodt || '';
			//如果是延保/虚拟充值订单
			if(that.options.hrefParma.odtype == 6291456){
				that.countFlag = true;
				//获取延保/虚拟充值订单详情
				that.getYbOrderDetail();
				return false;
			}
			// 记录券信息
			// 编号
			hrefParma.counum && (that.options.coupon.counum = hrefParma.counum);
			// 金额
			hrefParma.coumy && (that.options.coupon.coumy = hrefParma.coumy);
			//可使用优惠券个数
			that.getCouponsNum();
			// 获取订单详情
			// that.options.otn && that.getOrderDetail(that.options.otn);

			if(that.options.otn ){
				if(hrefParma.oddz){
					that.getOrderDetail(that.options.otn, root.GOODS_API_PATH+'orderPayment');
				}else{
					that.getOrderDetail(that.options.otn,root.ORDER_API_PATH + 'odpqd')
				};

			}
			// 放入微信参数
			if(util.isWeiXin()){
				that.options.wxpc.appId= wc.options.cfg.appId;
				that.options.wxpc.timestamp= wc.options.cfg.timestamp;
				that.options.wxpc.nonceStr= wc.options.cfg.nonceStr;
			}

		},
		goBack: function(){
			var that = this;
			util.alert(that.options.msg.m9,{
				justOk: false,
				okBtnText:'退出',
				cancelBtnText:'继续支付',
				okFn: function() {
					if(that.options.hrefParma.odtype == 10485760 || that.options.hrefParma.odtype == 10485761) {
						util.href('./orderall.html',{odcate:0});
					}else{
						util.href('./orderall.html',{odcate:2});
					}

				}
			});
		},
		/**
		 * 获取延保订单详情
		 */
		getYbOrderDetail: function() {
			var that = this;
			// 请求...
			util.api({
				surl: root.ORDER_API_PATH + 'etoddt',
				data: {
					otn: that.options.hrefParma.otn,
					dodt: that.options.hrefParma.dodt,
					odtype: that.options.hrefParma.odtype
				},
				type: 'get',
				success: function(response) {
					var rpco = response.rpco,
						body;

					// 处理
					switch(rpco) {
						case 200:
							body = response.body || {};
							// 记录下单时间
							that.timerRemaining(body.oprt/1000 || 0);
							body.dodt && (that.options.dodt = body.dodt);
							// 渲染订单详情
							body.gtam && (that.orderInfo.orderAmount = '&yen;'+parseFloat(body.gtam/100).toFixed(2));
							body.ramp && (that.orderInfo.amountPayable = '&yen;'+parseFloat(body.ramp/100).toFixed(2));
							body.ramp && (that.options.pttl = body.ramp);
							break;
						default:
							util.comShow({txt: that.options.msg.m8, icl: 'i-page'});
					}
				},
				complete: function() {
					// 移除提示
					util.remComShow();
				}
			});

		},
		/**
		 * 获取用户未使用优惠券数量
		 */
		getCouponsNum: function() {
			var that = this;
			// 请求数据
			util.api({
				surl: root.MB_API_PATH + 'canusecous',
				data: {
					otn: that.options.otn,
					dodt: that.options.dodt*1,
					odtype: that.options.hrefParma.odtype
				},
				async:false,
				type: 'get',
				success: function(response) {
					var rpco = response.rpco,
						body = response.body || {};
					// 处理
					switch (rpco) {
						// 正常
						case 200:
							if(body.coulst){
								that.options.coucc=body.coulst.length ;
								$.each(body.coulst,function(i,n){
									//获取最优优惠券价格
									if(i==0){
										that.options.couprice = n.coumy;
									}
								});
							};

							break;
						// 没有可用优惠券
						case 404:
							that.orderInfo.counponTip = '无可用优惠券';
							break;
						default:
						//util.tip('查询失败')
					}
				}
			});
		},
		/**
		 * 渲染订单详情
		 * @parma {object}{1} order 订单对象
		 */
		renderOrderDetail: function(order) {
			var that = this,
				// 订单金额
				odmy = order.prcttl || 0,
				// 应付金额
				amp = order.pttl || 0,
				// 使用优惠券金额
				couponMoney = 0,
				discountAm = 0;

			// 优惠券
			// 订单存在优惠券时，不可选择券
			if(order.cpsl) {
				// 优惠金额
				order.cpprc && (that.orderInfo.counponTip = '-¥' + (order.cpprc/100).toFixed(2));
			}
			// 存在可使用的优惠券
			else if(that.options.coucc >= 1) {
				// 可选择优惠券
				that.options.canSelectCoupon = true;
				// 存在选中优惠券
				if(that.options.coupon.counum) {
					// 优惠金额
					couponMoney = that.options.coupon.coumy*1;
					// 优惠金额
					couponMoney && (that.orderInfo.counponTip = '-¥' + (couponMoney/100).toFixed(2));
				}else{
					// 放入可使用张数
					//$('#coucc').html('(' + that.options.coucc + '张可用，');
					// 最高折扣
					that.orderInfo.counponTip = '最高可折扣' + (that.options.couprice/100) + '元';
				}

			}
			// 应付金额
			amp = amp - couponMoney;
			amp = amp < 0 ? 0 : amp;
			that.options.pttl = amp;
			discountAm = odmy - amp;
			amp =  '&yen; '+parseFloat(amp/100).toFixed(2);
			// 应付金额
			that.orderInfo.amountPayable = amp;

			// 订单金额
			odmy = '&yen; '+parseFloat(odmy/100).toFixed(2);
			that.orderInfo.orderAmount = odmy;
			//优惠金额
			if(order.cpsl || that.options.coupon.counum){
				if(discountAm != 0){
					that.orderInfo.discountAmount = '&yen; '+parseFloat(discountAm/100).toFixed(2);
				}
			}

			/*// 移除弹层
            util.remComShow();*/
		},
		/**
		 * 获取订单详情
		 * @parma {string}{1} otn 订单号
		 */
		getOrderDetail: function(otn,surl) {
			var that = this;
			// 请求...
			util.api({
				surl: surl,
				data: {
					otn: otn,
					timestamp: that.options.hrefParma.dodt,
					odtype:that.options.hrefParma.odtype
				},
				type: 'get',
				success: function(response) {
					var rpco = response.rpco,
						body;

					// 处理
					switch(rpco) {
						case 200:
							body = response.body || {};
							// 记录下单时间
							body.dodt && (that.options.dodt = body.dodt);
							//显示倒计时
							if(body.oprt){
								that.timerRemaining(body.oprt/1000 || 0);
								that.countFlag = true;
							}
							// 渲染订单详情
							that.renderOrderDetail(body);
							break;
						default:
							util.comShow({txt: that.options.msg.m8, icl: 'i-page'});
					}
				},
				complete: function() {
					// 移除提示
					util.remComShow();
				}
			});

		},
		/**
		 * 银联支付
		 * @parma {object}{1} body 银联支付需要的报文
		 */
		unionPay: function(body) {
			var that = this,
				html = '',
				unionpayHtml = '';
			$.each(body,function(key,val){
				html += '<input type="text" class="dn" name="'+key+'" value="'+val+'">'
			});
			unionpayHtml = '<form action="https://gateway.95516.com/gateway/api/frontTransReq.do" method="post" id="unionPay" >'+
				html +
				'</form>';
			//创建虚拟表单
			$('body').append(unionpayHtml);
			//请求银联支付接口
			$('#unionPay').submit();
			//删除form表单
			$('#unionPay').remove();
		},
		/**
		 * 微信支付
		 * @parma {object}{1} cfg 微信支付参数
		 */
		WeChatPay: function(cfg) {
			var that = this;

			// 支付签名时间戳
			// 数据有效性验证
			if(!cfg.timeStamp) {
				util.tip(that.options.msg.m2);
				return false;
			}
			// 支付签名随机串
			if(!cfg.nonceStr) {
				util.tip(that.options.msg.m3);
				return false;
			}
			// 统一支付接口返回的prepay_id参数值
			if(!cfg.package) {
				util.tip(that.options.msg.m4);
				return false;
			}
			// 签名方式
			if(!cfg.signType) {
				util.tip(that.options.msg.m5);
				return false;
			}
			// 支付签名
			if(!cfg.paySign) {
				util.tip(that.options.msg.m6);
				return false;
			}

			wx.chooseWXPay({
				timestamp: cfg.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
				nonceStr: cfg.nonceStr, // 支付签名随机串，不长于 32 位
				package: cfg.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
				signType: cfg.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
				paySign: cfg.paySign, // 支付签名
				success: function (res) {
					// 跳转订单详情页
					util.href('./paysuc.html',{
						otn: that.options.otn,
						dodt:that.options.dodt,
						odtype:that.options.hrefParma.odtype,
						pamt:that.options.pttl
					});
				},
				cancel: function() {
					// 启用按钮
					$('#toPay').removeAttr('disabled');
				},
				fail: function(msg) {
					util.tip('请求失败',{duration:3000})
				}
			});
		},
		/**
		 * H5微信支付
		 * @parma H5微信支付参数
		 */
		H5WeChatPay: function(MWEB_URL) {
			var that = this;
			setTimeout(function(){
				//var str_url = encodeURIComponent('http://wap.dev.gomegj.com/yf/paysuc.html?otn='+ that.options.otn +'&dodt=' + that.options.dodt +'&odtype=' + that.options.hrefParma.odtype + '&pamt=' + that.options.pttl);
				//window.location= MWEB_URL + '&redirect_url=' + str_url;
				window.location= MWEB_URL;

			},100);
		},
		/**
		 * _支付
		 * @parma {string}{1} otn 订单号
		 * srcid参考信息
		 * http://wiki.gomegjprivate.com/pages/viewpage.action?pageId=3440717
		 * srcid=1 管家订单(延保) srcid=4 虚拟充值 srcid=10极客修订单
		 */
		_pay: function(otn) {
			var that = this,data={},srcid=10;
			if(that.options.hrefParma.odtype == 10485760) {
				srcid = 4;
			}
			if(that.options.hrefParma.odtype == 10485761) {
				srcid = 5;
			}
			else if(that.options.hrefParma.odtype == 6291456){
				srcid = 1;
			}
			// 发送数据
			data = {
				od: otn,
				tsod: that.options.hrefParma.dodt,
				chaid:that.options.chaid,
				srcid:srcid,
			};
			// 请求...
			util.api({
				surl: root.CHR_API_PATH + 'payRequestWeb',
				data: data,
				type: 'post',
				beforeSend: function() {
					// 禁用按钮
					$('#toPay').attr('disabled', true);
				},
				success: function(response) {
					var rpco = response.rpco,
						body;

					// 处理
					switch(rpco) {
						case 200:
							body =  $.parseJSON(response.body) || {};
							// 生成签名的随机串
							that.options.wxpc.nonceStr = body.nonceStr;
							// 统一支付接口返回的prepay_id参数值
							that.options.wxpc.package = body.packAge;
							// 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
							that.options.wxpc.signType = body.signType;
							// 支付签名
							that.options.wxpc.paySign = body.paySign;
							// 支付签名时间戳
							that.options.wxpc.timeStamp = body.timeStamp;
							//如果是微信支付
							if(that.options.chaid == 3){
								// 微信支付
								that.WeChatPay(that.options.wxpc);
							}
							//如果是银联支付
							else if(that.options.chaid == 11){
								$('#toPay').removeAttr('disabled');
								that.unionPay(body);
							}else if(that.options.chaid == 9){
								//h5微信支付
								that.H5WeChatPay(body.mweb);
							}
							break;
						case 20001:
							util.tip('已支付成功，请勿重复支付');
							$('#toPay').css('background','#e0e0e0');
							break;
						case 20002:
							util.tip('服务器繁忙，请稍后再试');
							break;
						case 20003:
							util.tip('订单状态异常，无法支付');
							break;
						default:
							util.tip('请求失败',{duration:3000})
							// 启用按钮
							$('#toPay').removeAttr('disabled');
					}
				},
				error:function(){
					$('#toPay').removeAttr('disabled');
				}
			});
		},
		/**
		 * 锁定选中优惠券
		 */
		lockCoupon: function() {
			var that = this;
			// 请求数据
			util.api({
				surl: root.ORDER_API_PATH + 'odpyst',
				data: {
					otn: that.options.hrefParma.otn,
					timestamp: that.options.hrefParma.dodt,
					counum:that.options.coupon.counum,
					coumy:that.options.coupon.coumy*1,
					odtype:that.options.hrefParma.odtype
				},
				type: 'get',
				success: function(response) {
					var rpco = response.rpco,
						body = response.body || {};
					// 处理
					switch (rpco) {
						// 正常
						case 200:
							if(body.price == 0){
								util.href('./paysuc.html',{
									otn: that.options.otn,
									dodt:that.options.dodt,
									odtype:that.options.hrefParma.odtype
								});
							}else if(body.price > 0){
								// 支付
								that.pay();
							}else{
								util.tip('服务器繁忙，请稍后再试');
								// 启用按钮
								$('#toPay').removeAttr('disabled');
							}

							break;
						default:
							util.tip('服务器繁忙，请稍后再试');
							// 启用按钮
							$('#toPay').removeAttr('disabled');
					}
				},
				error:function(){
					$('#toPay').removeAttr('disabled');
				}
			});

		},
		/**
		 * 支付
		 */
		pay: function() {
			var that = this;

			// 数据有效性验证out_trade_no
			if(!that.options.otn) {
				util.tip(that.options.msg.m1);
				return false;
			}

			// _支付
			that._pay(that.options.otn, that.options.wxpc.timeStamp);
		},
		/**
		 * 倒计时计算
		 */
		timerRemaining: function(intDiff) {
			var that = this;
			if(intDiff <= 0){
				util.tip('该订单已超时');
				util.href('./me.html');
				return false;
			}
			window.setInterval(function(){
				var day=0,
					hour=0,
					minute=0,
					second=0;//时间默认值
				if(intDiff > 0){
					day = Math.floor(intDiff / (60 * 60 * 24));
					hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
					minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
					second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
				}
				if (day <= 9) day = '0' + day;
				if (hour <= 9) hour = '0' + hour;
				if (minute <= 9) minute = '0' + minute;
				if (second <= 9) second = '0' + second;

				that.timeRemaining.minutes = minute;
				that.timeRemaining.second = second;
				intDiff--;
				if(intDiff <= 0){
					util.href('./me.html');
				}
			}, 1000);
		},
		//去微信支付click
		payBtnClick : function() {
			var that = this;
			//如果是在app里面
			if(util.isApp()){
				var chaid = that.options.chaid*1;
				var odType = that.options.hrefParma.odtype*1;
				var orderType = 10;
				//微信2  支付宝21 银联 10
				var  payType = 2;
				switch (chaid) {
					//微信支付
					case 3:
						payType = 2;
						break;
					//银联支付
					case 11:
						payType = 10;
						break;
					//支付宝
					case 22:
						payType = 21;
						break;
				}
				if(odType == 4194305 || odType == 4194306 ){
					orderType = 10;
				}else if(odType == 10485760){
					orderType = 4;
				}else if(odType == 6291456){
					orderType = 1;
				}else if(odType == 8388608){
					orderType = 2;
				}
				var params = {
					"orderId":that.options.otn,
					"orderType":orderType,
					"payType":payType
				};
				GomeJSBridge.callGJPayComp(function(data){
					if(data.status == 0){
						util.href('./paysuc.html',{
							otn: that.options.otn,
							dodt:that.options.dodt,
							odtype:that.options.hrefParma.odtype,
							pamt:that.options.pttl
						});
					}else if(data.status == 1){
						util.tip('支付失败');
					}else{

					}
				},null,params)
				return false;
			}
			if(!util.isWeiXin()) {
				setTimeout(function(){
					util.alert('请确认支付是否完成',{
						justOk: false,
						okBtnText:'已完成',
						cancelBtnText:'未完成',
						okFn: function() {
							util.href('./paysuc.html',{
								otn: that.options.otn,
								dodt:that.options.dodt,
								odtype:that.options.hrefParma.odtype
							});

						}
					});
				},2000);
			}
			//存在优惠券的时候
			if(that.options.coupon.counum){
				//锁定优惠券
				that.lockCoupon();
			}else{
				that.pay();
			}
		},
		//选择优惠券
		selectCoupon : function() {
			var that = this;
			// 可选择
			if(that.options.canSelectCoupon) {
				// 打开省页面
				util.href('./couponsuse.html', {
					// 订单号
					otn: that.options.otn,
					// 下单时间戳
					dodt: that.options.dodt,
					//订单类型
					odtype: that.options.hrefParma.odtype
				});
			}
		},
		//选择支付方式
		selectPayType : function($event) {
			var that = this;
			that.options.chaid = $($event.currentTarget).attr('chaid');
			$($event.currentTarget).parent().find('dl').removeClass('check');
			$($event.currentTarget).addClass('check');
		}
	},
	components: {
		headerComponent
	}
}
</script>
<style lang="less">
	@import '../../util/fs.less';
	.pub-flex{
		display: -webkit-flex;
		display: flex;
		-webkit-flex-direction: row;
		flex-direction: row;
	}
	.pub-flex-auto{
		-webkit-flex: auto;
		flex: auto;
	}
	.mg-top20{
		.px2rem(margin-top,20);
	}
	.pay-box{
		background: #fff;
		.px2remall(padding,0,20);
		overflow: hidden;
	}
	.count-down-box{
		 .px2rem(padding-top,28);
		 .px2rem(padding-bottom,22);
	 }
	.count-down-tip{
		.px2rem(margin-top,22);
		.mixinfont(12px);
		color: #999;
	}
	.count-down-time{
		.px2rem(line-height,50);
		.mixinfont(18px);
		color: #333;
	}
	.order-info{
		.px2rem(padding-top,20);
		div{
			.px2rem(margin-bottom,20);
			.px2rem(line-height,40);
			.mixinfont(14px);
			clear: both;
			p.txt1{
				color: #333;
				.px2rem(width,160);
			}
			p.txt2{
				color: #666;
			}
		}
	}
	.pay-coupon{
		.px2rem(line-height,88);
		clear: both;
		.tit{
			.mixinfont(14px);
		}
		.tip{
			color: #999;
			.mixinfont(12px);
			float: right;
		}
	}
	.pay-way{
		dl{
			.px2rem(height,100);
			position: relative;
		}
		dt{
			.px2rem(width,120);
			position: relative;
		}
		.txt1{
			.mixinfont(14px);
			.px2rem(line-height,40);
			.px2rem(padding-top,18);
		}
		.txt2{
			.mixinfont(12px);
			.px2rem(line-height,32);
			color: #999;
		}
		.icon{
			.px2rem(width,60);
			.px2rem(height,60);
			position: absolute;
			top: 50%;
			left: 50%;
			.px2rem(margin-top,-30);
			.px2rem(margin-left,-30);
		}
		.icon-wx{
			background: url("//gfs11.gomein.net.cn/T1rL_vBThj1RCvBVdK.png");
			-webkit-background-size: 100%;
			background-size: 100%;
		}
		.icon-yl{
			background: url("//gfs11.gomein.net.cn/T1G_AvB5b_1RCvBVdK.png");
			-webkit-background-size: 100%;
			background-size: 100%;
		}
		.icon-zfb{
			background: url("//gfs12.gomein.net.cn/T1wDWvB5bv1RCvBVdK.png");
			-webkit-background-size: 100%;
			background-size: 100%;
		}
		.btn{
			.px2rem(width,28);
			.px2rem(height,28);
			position: absolute;
			right:0;
			top:50%;
			.px2rem(margin-top,-14);
			background: url("//gfs13.gomein.net.cn/T1FLKvBvd_1RCvBVdK.png");
			-webkit-background-size: 100%;
			background-size: 100%;
		}
		.check .btn{
			background: url("//gfs13.gomein.net.cn/T1qLKvBKdg1RCvBVdK.png");
			-webkit-background-size: 100%;
			background-size: 100%;
		}
	}
	footer{
		.px2rem(line-height,98);
		text-align: center;
		background: #FF4B41;
		color: #fff;
		.mixinfont(16px);
		position: fixed;
		left: 0;
		bottom: 0;
		width:100%;
	}

</style>
