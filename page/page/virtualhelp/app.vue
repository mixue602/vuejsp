<template>
	<div class="wapper virtualhelp-wapper" >
		<!-- 公共头部 -->
		<header-component :title="title"></header-component>
		<div class="wrap">
			<dl>
				<dt>Q：支付了就会充值成功吗？</dt>
				<dd>A：不是的，是否充值成功需要根据运营商（移动、联通、电信、极信通信）反馈的缴费状态来判定。如遇充值高峰或运营商系统升级等特殊情况，有可能会充值失败，支付款也会退还给您。</dd>
			</dl>
			<dl>
				<dt>Q：为何有时充值到账慢？</dt>
				<dd>A：1.由于月初月末充值高峰，移动、联通、电信、极信通信官方系统充值量压力非常大，会出现订单排队或者到账延迟现象，建议避开月初充值高峰。</dd>
				<dd>2.月初运营商官方系统出帐日，也容易出现订单排队或延迟。<br>
					出账期：是指运营商整理账单。移动出帐期每月1号至5号；联通出帐期1号至3号；电信出帐期1号至2号；极信通信出账期1号至3号。</dd>
				<dd>3.若遇官方系统升级维护，也容易出现订单排队或延迟。（各地区的官方系统维护时间不固定，经常出现在夜间，但白天也出现）</dd>
				<dd>温馨提示：月末月初充值高峰，部分地区的大面额充值卡缺货，如遇此情况，请您优先选择较小面额的充值卡进行多次充值，不便之处，敬请谅解！</dd>
			</dl>
			<dl>
				<dt>Q：为何只有部分话费到账？</dt>
				<dd>A：出现部分到账的情况，一般是因为运营商分次充值导致的，但最终到账总额与充值面值相等。</dd>
				<dd>例如：充100时可能话费到账为98+2的形式，200元的为100+100的形式，等等。</dd>
				<dd>这是运营商的规则，不影响充值总额。实际到账情况不以短信通知为准，需运营商官方缴费记录为准。</dd>
			</dl>
			<dl>
				<dt>Q：充值失败怎么办？退款多久到账？</dt>
				<dd>A：如果遇到充值高峰或系统升级，会有个别订单出现充值失败，我们会及时为用户办理退款，款项会原路返回用户支付时所用的银行账户里，一般15个工作日到账，遇节假日后延，用户需及时查询账户信息，如有问题请及时与客服4008-708-708联系，可帮助解决。</dd>
			</dl>
			<dl>
				<dt>Q：充值时充错号码怎么办？</dt>
				<dd>A：非常抱歉，充错号无法办理退款。因充错号码所造成的损失请用户自行承担。<br>
					由于用户之间代充行为客观存在，我们无法判断您的充值号码是否正确，也无从判断发起充值用户与被充值用户之间的约定关系，我们不适宜介入用户之间的潜在纠纷，请予以谅解。
				</dd>
			</dl>
			<dl>
				<dt>Q：携号转网能网上充值么？</dt>
				<dd>A：携号转网用户请到指定线下营业厅充值，否则充到原运营商账户无法退回。</dd>
			</dl>
			<dl>
				<dt>Q：话费充值可否开具发票？</dt>
				<dd>A：国美管家不对手机充值业务提供发票。移动、联通、电信号码充值后，建议用户可尝试去营业厅咨询，有些地方的营业厅可以给发票，有些地方政策不同给不了发票，这个不是国美管家所规定的；极信通信号码充值后，如顾客需要充值发票，可去当地国美门店打印上月实际消费金额的发票。</dd>
			</dl>
		</div>

	</div>

</template>

<script type="text/ecmascript-6">
import headerComponent from '../../components/HeaderComponent'
let root = window || {},
    util = root.util || {};
export default {
	data () {
		return {
			hrefParma:util.getHrefParma(),
			title:"帮助"
		}
	},
	created() {

	},
	filters: {

	},
    computed: {

	},
    mounted: function() {
        this.$nextTick(function () {
            this.init();
           	this.addEvent();
        });
    },
	methods: {
		init: function() {
			var that = this;
            if(util.isApp()){
                util.deleteHeadBtn();
            }
		},
		addEvent: function() {
		    var that = this;

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
		background: #ffffff;
	}
	.wrap{
		background: #fff;
		.px2rem(margin-bottom,20);
		overflow: hidden;
		width: 100%;
	}
	.virtualhelp-wapper{
		.px2rem(padding-top,112);
		.px2rem(padding-bottom,24);
		.px2rem(padding-left,24);
		.px2rem(padding-right,24);
	}
	.virtualhelp-wapper dl{
		.px2rem(padding-bottom,20);
		.px2rem(line-height,40);
		.mixinfont(14px);
	}
	.virtualhelp-wapper dt{
		font-weight: 700;
	}
</style>