<template>
	<div class="wapper" >
		<!-- 公共头部 -->
		<header-component :title="title" :isback="1"></header-component>
		<section>
			<div class="pay-result">
				<div class="suc bdr-bottom">
					<p class="order-price" v-show="price != null">&yen;{{ parseFloat(price/100).toFixed(2) }}</p>
					<p class="order-type">{{ orderType }}</p>
					<p class="order-tip">{{ orderTip }}</p>
				</div>
				<div class="order-box">
					<div class="order-item">
						<span class="order-tit">订单号</span>
						<span class="order-con">{{ otn }}</span>
					</div>
					<div class="order-item">
						<span class="order-tit">支付方式</span>
						<span class="order-con">在线支付</span>
					</div>
				</div>
			</div>
			<div class="order-all-tip">
				如有疑问，请拨打我们的客服电话：<a href="tel:400-000-0000">400-000-0000</a>
			</div>
			<div class="btn-box">
				<span class="btn btn-order" @click="goHome">返回首页</span>
				<span class="btn btn-home" @click="btnEvent">我的订单</span>
			</div>
		</section>
	</div>

</template>

<script type="text/ecmascript-6">
import headerComponent from '../../components/HeaderComponent'
let root = window || {},
    util = root.util || {};
export default {
	data () {
		return {
			title:"订单支付结果",
			price: null,
			otn:'',
			orderType:'支付结果查询中……',
			orderTip:''
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
				hrefParma = util.getHrefParma();
			util.getHrefParma().otn && (that.otn = util.getHrefParma().otn);
			setTimeout(function(){
				that.getOrderDetail();
			},2000);

		},
		btnEvent: function() {
			var that = this,
				hrefParma = util.getHrefParma();
			var parmas ={
				otn : hrefParma.otn,
				dodt : hrefParma.dodt,
				odtype : hrefParma.odtype
			};
			util.href('./ordersgjdetail.html',parmas);
		},
		goHome: function() {
			if(util.isApp()){
				window.location.href = 'http://wap.dev.gomegj.com/gjindex-1.html';
			}else{
				util.href('./index.html');
			}

		},
		/**
		 * 获取订单详情
		 * @parma {string}{1} otn 订单号
		 */
		getOrderDetail: function() {
			var that = this;
			// 请求...
			util.api({
				surl: root.ORDER_API_PATH + 'etoddt',
				data: {
					otn: util.getHrefParma().otn,
					dodt: util.getHrefParma().dodt,
					odtype:util.getHrefParma().odtype,
					isJkxOtn:0
				},
				type: 'get',
				success: function(response) {
					var rpco = response.rpco,
						body;

					// 处理
					switch(rpco) {
						case 200:
							body = response.body || {};
							if(body.odst && body.odst != 33){
								that.orderType = '支付成功';
								that.orderTip = '我们将尽快为您提供服务';
							}else{
								that.orderType = '支付失败';
								that.orderTip = '非常抱歉无法问您提供服务';
							}
							body.ramp && (that.price = body.ramp);
							break;
						default:
							util.tip('服务器繁忙，请稍后再试')
					}
				},
				error: function() {

				},
				complete: function() {

				}

			});

		}
	},
	components: {
		headerComponent
	}
}
</script>
<style lang="less">
	@import '../../util/fs.less';
	body{
		background: #f2f2f2;
	}
	.pay-result{
		.px2rem(padding-left,20);
		.px2rem(padding-right,20);
		.px2rem(padding-top,8);
		background: #fff;
	}
	.suc{
		.px2rem(padding-bottom,20);
		p{
			.px2rem(margin-top,20);
		}
		.order-price{
			.px2rem(line-height,50);
			.mixinfont(18px);
			color: #333;
		}
		.order-type{
			.px2rem(line-height,50);
			.mixinfont(18px);
			color: #ff4B41;
		}
		.order-tip{
			.px2rem(line-height,34);
			.mixinfont(12px);
			color: #999;
		}
	}
	.order-box{
		.px2rem(padding-bottom,20);
		.order-item{
			.px2rem(margin-top,20);
			span{
				.px2rem(line-height,40);
				.mixinfont(14px);
				display: inline-block;
			}
			.order-tit{
				color: #333;
				.px2rem(width,160);
			}
			.order-con{
				color: #666;
			}
		}
	}
	.order-all-tip{
		.px2rem(padding-left,20);
		.px2rem(padding-right,20);
		.px2rem(margin-top,20);
		.mixinfont(13px);
		color: #999;
		a{
			color: #4A90E2;
		}
	}
	.btn-box{
		.px2rem(padding-top,100);
		.btn{
			.px2rem(width,280);
			.px2rem(height,76);
			.px2rem(line-height,76);
			.mixinfont(16px);
			text-align: center;
			display: inline-block;
			border-radius: 4px;
		}
		.btn-order{
			color: #333;
			border: 1px solid #333;
			.px2rem(margin-right,40);
			.px2rem(margin-left,76);
		}
		.btn-home{
			border: 1px solid #ED5B5D;
			color: #ED5B5D;
		}
	}

</style>
