<template>
	<div id="warp">
		<div class="header">{{headmsg}}</div>
		<div class="topbg"></div>
		<coupon></coupon>
		<div class="foot"><span @click="coupondetail">优惠券使用说明</span><br/><span @click="aboutgome" >关于国美管家</span></div>
		<aboutgome @changestatus="change" :newdisplay="newdisplay" :newdisplaygome="newdisplaygome" :newdisplaycoupon="newdisplaycoupon"></aboutgome>
	</div>
</template>

<script>
	let root = window || {},
    	util = root.util || {};
	import Coupon from './coupon.vue'
	import aboutgome from './aboutgome.vue'
	export default {
		data() {
			return {
				headmsg:"领券",
				newdisplay:false,
				newdisplaygome:false,
				newdisplaycoupon:false
			}
		},
		methods:{
			aboutgome() {
				var that=this;
				that.newdisplay=true;
				that.newdisplaygome=true;
				that.newdisplaycoupon=false;
			},
			coupondetail() {
				var that=this;
				that.newdisplay=true;
				that.newdisplaygome=false;
				that.newdisplaycoupon=true;
			},
			change(val){
				var that=this;
				that.newdisplay=val;
				that.newdisplaygome=val;
				that.newdisplaycoupon=val;
			}
		},
		components:{Coupon,aboutgome}
	}
</script>

<style>
	body{
		background: #FFFFFF;
	}
	.header{
		width: 100%;
		height: 1.17rem;
		color: #FFF1F1;
		line-height: 1.17rem;
		background: #ff4b46;
		text-align: center;
		font-size: 0.48rem;
	}
	.topbg{
		width: 100%;
		height: 16.61rem;
		position: absolute;
		top: 1.17rem;
		background: url(//gfs11.gomein.net.cn/T1PUJvBbAj1RCvBVdK.png)no-repeat top center;
		background-size:100% 16.61rem;
	}
	.foot{
		width: 100%;
		height: 1.64rem;
		position: absolute;
		bottom: 0rem;
		line-height: 0.82rem;
		color: #007aff;
		font-size: 0.4rem;
		text-align: center;
	}
</style>
