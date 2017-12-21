<template>
	  <div id="couponsReadMe">
		<header-component :title='title'></header-component>
        <div class="container">
            <div class="article blk2">
                <div class="article-title2">一.国美管家优惠券</div>
                <div class="article-text">
                    会员用于服务订单时，享受折扣价格的优惠券，仅限为维修券和清洗券，每种券可分为两种：<br>
                    ①直降券：可用服务范围内，不受价格限制，可直接抵扣券面额<br>
                    ②满减券：可用服务范围内，订单金额满足一定条件时可以使用，（例如：满500减100元的，所下订单金额需要在500元以上才可以使用；）<br>
                    可用服务范围：分为无限制、区域专享、限品类等等，例如：一张面额5元的北京、天津专享清洗券，即为上门预约地址在北京、天津范围内的清洗服务，不限价格，均可抵扣；其他地区不在本次优惠券使用范畴。如一张满200-50元的清洗券，指您预约的清洗服务总金额需超过200元方可使用。
                </div>
                <div class="article-title2">二.如何获取优惠券</div>
                <div class="article-text">
                    1．赠券：<br>
                    ①推广活动会赠送优惠券，如从未享受过服务的新用户将会获取一定金额的直降券；另我们将不定期的赠送优惠券给多次支持我们的老顾客。<br>
                    ②随订单赠送，如您预约了参与返券活动的服务，在您的确认订单完成后24小时内对应优惠券将发送到您的账户中。<br>
                    2．活动领券：<br>
                    不定期向会员举办优惠领券活动，请您随时关注国美管家动态，以便了解更多最新的优惠信息。<br>
                </div>
                <div class="article-title2">三.优惠券在订单中的使用规则</div>
                <div class="article-text">
                    1.一个订单只能使用一张优惠券，多张优惠券不能同时使用。每张优惠券只能使用一次；<br>
                    备注：如您有多张优惠券的话， 在一个订单中也只能使用一张，无法在一个订单中使用多张优惠券。<br>
                    2.一键预约不可用。<br>
                    3.请在优惠券使用有效期内使用，过期将自动作废。<br>
                    4.取消订单：<br>
                    您在预约服务中，仅显示当前可使用订单，服务完成后点击支付才可选择使用某一优惠券使用，选择优惠券后如您点击支付进入付款流程后，无论该订单支付成功或支付失败，优惠券均不能返还；如支付失败，再次点击相关订单支付，该订单处于同优惠券锁定状态，不可选择其他优惠券。<br>
                    5.本规则由国美管家享有最终解释权。
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
				title:'优惠券使用说明'
			};
        },
        created(){
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

/* 公共内容区 */
.container {
    width: 10rem;
	min-width: 320px;
    background-color: #fff;
    overflow-x: hidden;
    overflow-y: auto;
    position: absolute;
    top: 1.173333rem;
    bottom: 0;
    -webkit-overflow-scrolling: touch;
    z-index:999;
}

/* 优惠券使用说明页 */
.article {
    word-break: break-all;
    padding-bottom: .373333rem /* 28/75 */;
}
.blk2 {
    background-color: #fff;
    padding-left: .32rem /* 24/75 */;
    padding-right: .32rem /* 24/75 */;
    overflow: hidden;
}
.article-title2 {
    color: #333;
		.mixinfont(16px);
    font-weight: 700;
    line-height: .64rem /* 48/75 */;
    margin-top: .24rem /* 18/75 */;
}
.article-text {
    color: #666;
    .mixinfont(16px);
    line-height:.64rem /* 48/75 */;
}
</style>