<template>
	<div class="wapper virtual-wapper" >
		<!-- 公共头部 -->
		<header-component :title="title"></header-component>
		<div class="wrap">
			<div class="wrap-top bdr-bottom">
				<span class="wrap-top-order">订单号 {{ orderId }}</span>
				<span class="wrap-top-odtype">{{ odst | fnOrderType }}</span>
			</div>
			<div class="wrap-content" v-for="(item,index) in orderList">
				<div class="wrap-content-item">
					<span class="tit">手机号码：</span><span class="con">{{ item.mob }}</span>
				</div>
				<div class="wrap-content-item">
					<span class="tit">归属地区：</span><span class="con">{{ item.homelocation }}</span>
				</div>
				<div class="wrap-content-item">
					<span class="tit">充值面额：</span><span class="con">{{ item.gdnm }}</span>
				</div>
			</div>
		</div>
		<div class="wrap">
			<div class="wrap-top bdr-bottom">
				<span class="line-left">支付方式</span>
				<span class="line-right">在线支付</span>
			</div>
			<div class="wrap-top bdr-bottom">
				<span class="line-left">付款信息</span>
				<span class="line-right">{{ payType | fnPayType }}</span>
			</div>
			<div class="wrap-top bdr-bottom">
				<span class="line-left">下单时间</span>
				<span class="line-right">{{ dodt | formatTime }}</span>
			</div>
		</div>
		<div class="wrap">
			<div class="wrap-top bdr-bottom">
				<span class="line-left">商品总额</span>
				<span class="line-right"><span class="price-fh">&yen</span> <span class="price">{{ comCgcpInt }}.<i>{{ comCgcpFloat }}</i></span></span>
			</div>
			<div class="wrap-top bdr-bottom" v-show="discount != 0">
				<span class="line-left">优惠金额</span>
				<span class="line-right"><span class="price-fh">&yen</span> <span class="price">{{ yhcomCgcpInt }}.<i>{{ yhcomCgcpFloat }}</i></span></span>
			</div>
		</div>
		<div class="wrap">
			<div class="wrap-top bdr-bottom">
				<span class="line-left">应付金额</span>
				<span class="line-right"><span class="price-fh">&yen</span> <span class="price">{{ ycomCgcpInt }}.<i>{{ ycomCgcpFloat }}</i></span></span>
			</div>
		</div>
		<div class="order-pay-btn" v-show="odst == 33" @click="toPay">立即支付</div>
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
			title:"订单详情",
			odst: '',
            payType: '',
            dodt: '',
			ordergtam: 0,
            orderramp: 0,
            discount: 0,
			orderId: '',
            pageInfo: {},
			orderList: []
		}
	},
	created() {

	},
	filters: {
	    //时间格式化
		formatTime: function(value) {
            if(value == '') {
                return '';
                return false;
            }
            return util.formateDate(value,'yyyy-MM-dd hh:mm');
        },
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
		},
        fnOrderType: function(value) {
            var str = '';
            if(value == 33) {
                str = '待付款';
            }
            else if(value == 700) {
                str = '支付成功';
            }
            else if(value == 1600 || value == 1500 || value == 1100) {
                str = '充值失败';
            }
            else if(value == 1400) {
                str = '充值成功';
            }
            else if(value == 1200 || value == 1300) {
                str = '充值中';
            }
            else if(value == 4600) {
                str = '退款失败';
            }
            else if(value == 5000) {
                str = '退款成功';
            }
            else if(value == 4000 || value == 4320 || value == 4400) {
                str = '退款中';
            }
            return str;
        }
	},
    computed: {
        // 价格整数计算
        comCgcpInt () {
            let that = this;
            return parseInt(that.ordergtam/100);
        },
        // 价格小数计算
        comCgcpFloat () {
            let that = this,
                cgcp = String((that.ordergtam/100).toFixed(2));
            return cgcp.substring(cgcp.length-2);
        },
        // 优惠金额整数计算
        yhcomCgcpInt () {
            let that = this;
            return parseInt(that.discount/100);
        },
        // 优惠金额小数计算
        yhcomCgcpFloat () {
            let that = this,
                cgcp = String((that.discount/100).toFixed(2));
            return cgcp.substring(cgcp.length-2);
        },
        // 应付价格整数计算
        ycomCgcpInt () {
            let that = this;
            return parseInt(that.orderramp/100);
        },
        // 应付价格小数计算
        ycomCgcpFloat () {
            let that = this,
                cgcp = String((that.orderramp/100).toFixed(2));
            return cgcp.substring(cgcp.length-2);
        }

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
			that.getPageInfo();
		},
		//获取订单详情
		getPageInfo: function() {
		    var that = this;
			//debug start

			//debug end
            util.api({
                surl:'/order/v2/etoddt',
				data: {
                    otn: that.hrefParma.otn,
					dodt: that.hrefParma.dodt,
					odtype: that.hrefParma.odtype
                },
                type:'get',
                success:function(res) {
					 var rpco = res.rpco,
					 body = res.body;

					 switch(rpco) {
						 case 200:
							 that.pageInfo = body;
							 that.ordergtam = body.gtam;
							 that.odst = body.odst;
							 that.dodt = body.dodt;
							 that.orderramp = body.ramp;
							 that.payType = body.payType;
							 that.orderList = body.gdls;
                             that.orderId = body.ordNm;
                             that.discount = body.discount || 0;
						 break;
						 default:
						 util.tip('请求失败');
					 }
                }
            })
		},
		toPay: function() {
			var that = this;
            util.href('./pay.html',{
                otn:that.hrefParma.otn,
                dodt:that.hrefParma.dodt,
                odtype:that.hrefParma.odtype
            });
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
		background: #f5f5f5;
	}
	.wrap{
		background: #fff;
		.px2rem(margin-bottom,20);
		overflow: hidden;
	}
	.wrap-top{
		.px2rem(height,87);
		.px2rem(line-height,87);
		position: relative;
	}
	.wrap-top-order{
		.mixinfont(12px);
		color: #333;
		.px2rem(padding-left,24);
	}
	.wrap-top-odtype{
		.mixinfont(14px);
		color: #ff4b46;
		position: absolute;
		.px2rem(right,24);

	}
	.wrap-content{
		.px2rem(padding-top,23);
		.px2rem(padding-bottom,21);
		.px2rem(padding-left,24);
		.px2rem(padding-right,24);
	}
	.wrap-content-item .tit,.wrap-content-item .con{
		.px2rem(line-height,44);
		.mixinfont(14px);
		display: inline-block;
	}
	.wrap-content-item .tit{
		color: #777;
	}
	.wrap-content-item .con{
		color: #333;
	}
	.line-left,.line-right{
		.mixinfont(14px);
		color: #333;
		.px2rem(line-height,87);
		.px2rem(padding-left,24);
	}
	.line-right{
		position: absolute;
		.px2rem(right,24);
	}
	.price-fh{
		.mixinfont(12px);
		color:#333;
	}
	.price{
		.mixinfont(18px);
			color: #333;
		i{
		.mixinfont(12px);
			color:#333;
		}
	}
	.order-pay-btn{
		.px2rem(margin-top,80);
		.px2rem(margin-left,40);
		.px2rem(margin-right,40);
		background: #ff4b46;
		color: #fff;
		.mixinfont(18px);
		text-align: center;
		.px2rem(line-height,88);
		border-radius: 5px;
	}
</style>