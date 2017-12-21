<!-- huangyihai -->
<template>
	<div>
		<header-component :title="title"></header-component>
		<section class="about" ref="about">
			<div class="logo">
				<p style="display: none" v-show="isApp" v-text="time"></p>
			</div>
			<ul class="items">
				<li ><a href="./notice.html">关于国美管家</a><i></i></li>
				<li><a href="./directiondetail.html?docid=2496&did=1&pid=0&tmid=1&log=1&cname=常见问题">常见问题</a><i></i></li>
				<li class="mb20"><a href="./directiondetail.html?docid=2495&did=1&pid=0&tmid=1&log=1&cname=操作说明">操作说明</a><i></i></li>
				<li><a href="tel:4008113333">联系客服</a><i></i></li>
				<li @click="click_update" style="display: none" v-show="isAndroid">检测更新<i></i></li>
			</ul>		
		</section>
	</div>
</template>
<script type="ecma6.0">
let root = window || {},
	util = root.util || {};
import headerComponent from '../../components/HeaderComponent';
export default {
	data() {
		return {
			title:"关于我们",
			isAndroid:false,//util.isApp(),
			time:"",
			isApp:util.isApp()
		}
	},
	created() {
		let ua = navigator.userAgent;
			if(this.isApp){
				this.time = GomeJSBridge.appVersion;
				if(/(Android)/i.test(ua) ){
					this.isAndroid = true;
				}
			}
	},
	mounted() {
		var self = this;
		self.$nextTick(function () {
		    if(util.isApp()){
				self.$refs.about.style.marginTop = 0+"px";
			}
	    })
	    // this.$emit("change","title","关于我们");
	},
	methods: {
		click_update(){
			GomeJSBridge.plugin.extend(null,null,'GJUtils','update')
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
    	background: #f3f5f7;
    }
	.about{
		.px2rem(margin-top,88);
		.logo{
			.px2rem(height,342);
			background:#fff url(//gfs10.gomein.net.cn/T1CfZvB5VT1RCvBVdK.png) no-repeat center center;
			.px2remall(background-size,160,160);
			p{
				.px2rem(padding-top,262);
				text-align: center;
			}
		}
		.items{
			li{
				.px2rem(height,88);
				.px2rem(line-height,88);
				.mixinfont(14px);
				color: #333;
				position: relative;
				background:#fff;
				i{
					background:url(//gfs10.gomein.net.cn/T1jn_jBXVT1RCvBVdK.png) center center no-repeat;
					display: block;
					position:absolute;
					.px2rem(right,30);
					.px2rem(top,31);
					 .px2rem(height,26);
				    .px2rem(width,26);
				    background-size:auto 100%;
				    -webkit-background-size:auto 100%;
				}
				&:before {
				    content: '';
				    position: absolute;
				    right: 0;
				    bottom: 0;
				    height: 1px;
				    width: 100%;
				    background-color: #ddd;
				    transform: scaleY(0.5); 
				}
				.px2remall(padding,0,30);
				&.mb20{
					.px2rem(margin-bottom,20);
				}
				a{
					display: block;
					width:100%;
					height:100%;
				}
			}
		}
	}	
</style>