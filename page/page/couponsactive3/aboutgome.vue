<template>
	<div class="couponslog" v-show="display">
		<div class="aboutgome" v-show="displaygome">
			<h1>关于国美管家<span @click="close"></span></h1>
			<p>
			<i>国美管家:</i><br>
			国美管家是国美集团在2016年集合集团线上、线下资源，倾注核心技术积累，大力打造的综合性"互联网+服务"平台。国美管家平台为用户提供家电维修、手机维修、家电清洗、家电回收、手机回收五大核心服务<br>
			同时借助移动互联网的东风，作为生态体系的服务入口，以国美会员为基础渗透周边消费者，以家电垂直服务为核心拉动家庭服务需求，聚集专业的维修人员，提升服务体验，形成“购买—清洗—维修—回收—再次购买”的家电生命周期的闭环；标准化、可视化的售后服务，通过五大服务、四大能力，快速抢占家电后服务市场，为消费者提供全方位的家电售后服务。作为独立研发的平台，国美管家深挖用户痛点，形成了五大品牌优势：<br>
			1、上门服务：足不出户，只要在线预约，管家就可上门服务，方便快捷。<br>
			2、服务内容全面：空调、冰箱、洗衣机、热水器等各类家电设备均可维修。<br>
			3、安全保证：所有管家均为实名认证，入户安全可靠。<br>
			4、现场打款：完成回收立刻打款，分分钟拿到钱。<br>
			5、覆盖区域广：包括北京、上海、天津、西安、厦门等全国30多个城市。<br>

			“电子保修卡”、“电子说明书”功能为行业首创，纸质信息可通过国美管家进行电子化，消费者仅需轻轻点击，便可查看电器的使用、维护、保修等详细信息，从此摆脱保修卡、说明书找不到的烦恼，方便透明。此外，国美管家通过向消费者开放部分后台数据，实时推送商品配送、安装、工程师等信息，实现“送安同步-送安可视化“，增强用户体验。同时，国美管家支持预约服务，消费者仅需在微信中填写产品型号、故障问题、家庭住址等基本信息，国美管家即可精准匹配合适的工程师，并按时上门服务，缩短服务响应时间，提升运营效率。<br>

			除提供基本的家电服务外，国美管家更囊括了一系列的“贴心管家“服务：随时查看、贴心提示、新奇玩法、创意生活，为消费者提供家电保养、娱乐互动、生活咨询等全方位生活信息服务。<br>
			“国美管家”打通家电售前市场和售后市场的最后一层屏障，通过服务体系的融合贯通，为消费者提供了透明、安心的家电售后服务，也推动了家电销售、消费、售后服务的全流程协同创新。破解行业乱象，打破售后“潜规则”，推动了家电后服务市场的规范和进步；


		</p>
		</div>
		<div class="coupondeatil" v-show="displaycoupon">
			<h1>优惠券使用说明<span @click="close"></span></h1>
			<p>
			<i>一.国美管家优惠券</i><br>
			会员用于服务订单时，享受折扣价格的优惠券，仅限为维修券和清洗券，每种券可分为两种：<br>
			①直降券：可用服务范围内，不受价格限制，可直接抵扣券面额<br>
			②满减券：可用服务范围内，订单金额满足一定条件时可以使用，（例如：满500减100元的，所下订单金额需要在500元以上才可以使用；<br>
			可用服务范围：分为无限制、区域专享、限品类等等，例如：一张面额5元的北京、天津专享清洗券，即为上门预约地址在北京、天津范围内的清洗服务，不限价格，均可抵扣；其他地区不在本次优惠券使用范畴。如一张满200-50元的清洗券，指您预约的清洗服务总金额需超过200元方可使用。<br>

			<i>二.如何获取优惠券</i><br>
			1．赠券：<br>
			①推广活动会赠送优惠券，如从未享受过服务的新用户将会获取一定金额的直降券；另我们将不定期的赠送优惠券给多次支持我们的老顾客。<br>
			②随订单赠送，如您预约了参与返券活动的服务，在您的确认订单完成后24小时内对应优惠券将发送到您的账户中。<br>
			2．活动领券：<br>
			不定期向会员举办优惠领券活动，请您随时关注国美管家动态，以便了解更多最新的优惠信息。<br>

			<i>三.优惠券在订单中的使用规则</i><br>
			1.一个订单只能使用一张优惠券，多张优惠券不能同时使用。每张优惠券只能使用一次；
			备注：如您有多张优惠券的话， 在一个订单中也只能使用一张，无法在一个订单中使用多张优惠券。<br>
			2.一键预约不可用。<br>
			3.请在优惠券使用有效期内使用，过期将自动作废。<br>
			4.取消订单：<br>
			您在预约服务中，仅显示当前可使用订单，服务完成后点击支付才可选择使用某一优惠券使用，选择优惠券后如您点击支付进入付款流程后，无论该订单支付成功或支付失败，优惠券均不能返还；如支付失败，再次点击相关订单支付，该订单处于同优惠券锁定状态，不可选择其他优惠券。<br>
			5.本规则由国美管家享有最终解释权。
		</p>
		</div>
	</div>
</template>

<script>
	export default{
		props:[
			'newdisplay','newdisplaygome','newdisplaycoupon'
		],
		data() {
			return {
				display:false,
				displaygome:false,
				displaycoupon:false
			}
		},
		methods:{
			close() {
				var that=this;
				that.display=false;
				that.displaygome=false;
				that.displaycoupon=false;
				that.$emit('changestatus',that.display,that.displaygome,that.displaycoupon)
			}
		},
		watch:{
			newdisplay(val) {
				this.display=val;
			},
			newdisplaygome(val) {
				this.displaygome=val;
			},
			newdisplaycoupon(val) {
				this.displaycoupon=val;
			}
		}
	}
</script>

<style>
	.couponslog{
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 11111111;
		background: rgba(0,0,0,.5);
	}
	.coupondeatil,.aboutgome{
		width: 8rem;
		height: 14.72rem;
		position: absolute;
		top: 0.7rem;
		left: 0.99rem;
		border-radius: 0.53rem;
		background: #fff;
		overflow: hidden;
	}
	h1{
		background: #f5f5f5;
		height: 1.17rem;
		line-height: 1.17rem;
		padding-left: 0.4rem;
		font-size: 0.43rem;
		color: #333333;
		font-weight: 400;
	}
	h1>span{
		width: 0.48rem;
		height: 0.43rem;
		position: absolute;
		display: inline-block;
		right:0.4rem;
		top: 0.2rem;
		background: url(//img.gomegj.com/guanjia/v2/coupons-del.png);
		background-size: 100%;
	}
	p{
		height: 13rem;
		overflow-x: hidden;
		padding: 0.53rem 0.53rem 0 0.53rem;
		font-size: 0.35rem;
		color: #777777;
	}
	.coupondeatil i{
		color: #333;
	}
</style>