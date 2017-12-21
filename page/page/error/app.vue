<template>
	<div class="wapper" >
		<!-- 公共头部 -->
		<header-component :title="title" :isback="1"></header-component>
		<section>
			<div class="tu">
				<i class="i-ordersuc"></i>
			</div>
			<div class="txt-box">
				<p class="wen">亲，没有找到您要查看的页面，<br>请稍后重新尝试</p>
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
			title:"错误页"
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
			var that = this;


		},
		btnEvent: function() {

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
		background: #fff;
	}
	.tu{
		.px2rem(padding-top,139);
		i{
			.px2rem(width,480);
			.px2rem(height,436);
			margin:0 auto;
			display: block;
		}
		.i-ordersuc{
			background: url("http://gfs11.gomein.net.cn/T1_pJ_BCdT1RCvBVdK.png");
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


</style>
