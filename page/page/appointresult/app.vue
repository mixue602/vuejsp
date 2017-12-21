<template>
	<div class="wapper" >
		<!-- 公共头部 -->
		<header-component :title="title" :isback="1"></header-component>
		<section>
			<div class="tu">
				<i class="i-ordersuc"></i>
			</div>
			<div class="txt-box">
				<p class="wen">订单提交成功！</p>
				<p class="wen wen12" v-if="supplierPhone == null">我们的客服人员稍后将与您联系，请保持电话畅通~</p>
				<p class="wen wen12" v-else style="color:#ff4b46">由于您选择的商品在保修期内，保修期内的商品将有厂家直接为您提供服务，您可以直接拨打厂商电话：<span  style="font-size:.16rem;font-weight: bold;">{{ supplierPhone }}</span></p>
			</div>
			<div class="btn-box">
				<span class="btn btn-order" @click="btnEvent">查看订单</span>
				<span class="btn btn-home" @click="goHome">返回首页</span>
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
			title:"预约结果",
			countFlag: false,
			supplierPhone:null
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
				hrefParma = util.getHrefParma(),
				supplierPhone = hrefParma.supplierPhone || 'null';
			// 如果保内切未对应服务商，展示400电话
			supplierPhone != 'null' && (that.supplierPhone = supplierPhone);


		},
		btnEvent: function() {
			var that = this,
				hrefParma = util.getHrefParma();
			var parmas ={
				otn : hrefParma.oid,
				dodt : hrefParma.dodt,
				odtype : hrefParma.odtype,
				isJkxOtn:0
			};
			util.href('./ordersgjdetail.html',parmas);
		},
		goHome: function() {
			if(util.isApp()){
				window.location.href = 'http://wap.dev.gomegj.com/gjindex-1.html';
			}else{
				util.href('./index.html');
			}
		}
	},
	components: {
		headerComponent
	}
}
</script>
<style lang="less">
	@import '../../util/fs.less';
	.tu{
		.px2rem(padding-top,139);
		i{
			.px2rem(width,480);
			.px2rem(height,436);
			margin:0 auto;
			display: block;
		}
		.i-ordersuc{
			background: url("//gfs11.gomein.net.cn/T1UxZvBCZT1RCvBVdK.png");
			background-size: 100% 100%;
		}
	}
	.txt-box{
		.px2rem(padding-top,39);
	}
	.wen{
		width: 80%;
		margin: 0 auto;
		text-align: center;
		.mixinfont(16px);
		.px2rem(line-height,44);
	}
	.wen12{
		.mixinfont(12px);
		color: #666;
	}
	.btn-box{
		.px2rem(padding-top,100);
		.btn{
			.px2rem(width,280);
			.px2rem(height,68);
			.px2rem(line-height,68);
			.mixinfont(16px);
			border: 1px solid #FD5548;
			text-align: center;
			display: inline-block;
			border-radius: 100px;
		}
		.btn-order{
			color: #FD5548;
			.px2rem(margin-right,40);
			.px2rem(margin-left,76);
		}
		.btn-home{
			background-image: linear-gradient(-180deg, #FA6252 0%, #FF4B41 100%);
			color: #fff;
		}
	}


</style>
