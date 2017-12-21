<template>
	<div class="wapper" id="">
		<!-- 公共头部 -->
		<header-component :title="title"></header-component>
		<!--关闭当前页面返回首页-->
		<a class="cwclose" href="me.html"><img src="//gfs11.gomein.net.cn/T13iZvBbJT1RCvBVdK.png" alt=""></a>
		<div class="cwrscon">
			<div class="resicon">
				<!--成功-->
				<img v-if="restp" src="//gfs10.gomein.net.cn/T11uZvByhv1RCvBVdK.png" alt="">
				<!--失败-->
				<img v-else src="//gfs11.gomein.net.cn/T1LiJvB4Z_1RCvBVdK.png" alt="">
			</div>
			<p class="resdes" v-if="restp">您的商品兑换成功！</p>
			<p class="resdes" v-else>您的商品兑换失败</p>
			<p class="rescw" v-if="restp">扣除美豆：<span class="kccw">{{ckmd}}美豆</span></p>
			<div class="fotbtn">
				<a v-if="restp" href="clearweed.html" class="resfoot bdr-all">去看看其他商品</a>
				<a v-else href="clearweed.html" class="resfoot bdr-all">关闭</a>
			</div>
		</div>
		<!--提示信息-->
		<div v-if="restp" class="fothint"><p>请您尽快到门店完成兑换，客服电话：<span>4008708708</span></p></div>
	</div>

</template>

<script type="text/ecmascript-6">
import headerComponent from '../../components/HeaderComponent'
let root = window || {},
    util = root.util || {};
export default {
	data () {
		return {
			title:"美豆兑换",
			restp:false,
			ckmd:24
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
			//根据参数判断是成功还是失败
			that.getRes();
		},
		//结果页面  res:1，成功 res:0失败
		getRes:function () {
            var that = this,
                 hrefpm = util.getHrefParma();
            //0 :失败，1：成功
            hrefpm.res == 1 ? that.restp = true : that.restp = false;
            that.ckmd = hrefpm.cwds;
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
<style lang="less" type="text/less">
	@import '../../util/fs.less';
	html{
		background: #FFFFFF;
		letter-spacing: 0;
	}
	.wapper {
		height: 93%;
	}
	.fothint {
		width: 100%;
		text-align: center;
		position: absolute;
		.px2rem(height,34);
		.px2rem(bottom,100);
		.mixinfont(12px);
		color: #999999;
		span {
			color: #4A90E2;
		}
	}
	.cwclose {
		.px2rem(height,88);
		.px2rem(line-height,88);
		text-align: center;
		position: fixed;
		top:0;
		.px2rem(left,90);
		z-index: 9999;
	}
	.cwclose img{
		.px2rem(width,36);
		.px2rem(height,36);
		.px2rem(margin-top,28);
	}
	.resicon {
		text-align: center;
		.px2rem(margin-top,140);
		.px2rem(margin-bottom,60);
	}
	.resicon  img {
		display: inline-block;
		.px2rem(width,106);
		.px2rem(height,106);
	}
	.resdes {
		.mixinfont(22px);
		color: #333333;
		.px2rem(line-height,60);
		text-align: center;
	}
	.rescw {
		.mixinfont(15px);
		color: #333333;
		letter-spacing: 0;
		.px2rem(line-height,42);
		text-align: center;
		.px2rem(margin-top,28);
	}
	.rescw .kccw {
		color: #ED5B5D;
	}
	.fotbtn {
		text-align: center;
		.px2rem(margin-top,40);
	}
	.resfoot {
		display: inline-block;
		.px2rem(width,274);
		.px2rem(height,76);
		.px2rem(line-height,76);
		/*border: 1px solid #ED5B5D;*/
		/*border-radius: 4px;*/
		.mixinfont(16px);
		color: #ED5B5D;
	}
	.bdr-all:before {
		border: 1px solid #ED5B5D;
		.px2rem(border-radius,4);
	}

</style>
