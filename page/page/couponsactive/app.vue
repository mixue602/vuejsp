<template>
	<div id="warp">
		<div class="top">
			<img :src="body.topbg">
		</div>
		<div class="top" v-for="(k,v) in body.coupons">
			<img :src="k.bg" @click="goto(k)" />
		</div>
		<div class="foot" id="foot"><span @click="coupondetail">优惠券使用说明</span><br/><span @click="aboutgome" >关于国美管家</span></div>
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
				newdisplaycoupon:false,
				body:{}
			}
		},
		created(){
			this.load();
		},
		methods:{
			load() {
				var _this=this;
				util.api({
					//surl:'./resources/json/coupon.json',
					surl:root.BASE_PATH + 'diamond/index?group=COUPON_GROUP&dataId=COUPON_DATA&propCacheKey=couponindex',
					type:'get',
					success:function(data){
						if(data.rpco==200){
							_this.body=JSON.parse(data.body);
							document.getElementById('foot').style.backgroundColor=_this.body.color
						}
					},
					error:function(){

					}
				})
			},
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
			},
			goto(url){
				console.log(url)
				window.sessionStorage.setItem('couponType',JSON.stringify(url))
				if(window.sessionStorage.getItem('couponType')){
					window.location.href="./broughtTheVolume.html"
				}
				
			}
		},
		components:{Coupon,aboutgome}
	}
</script>

<style>
body {
  background: #fdf4e5;
}
.top {
  width: 100%;
}
.top img {
  width: 100%;
  background-size: cover;
}
.header {
  width: 100%;
  height: 1.17rem;
  color: #fff1f1;
  line-height: 1.17rem;
  background: #000000;
  text-align: center;
  font-size: 0.48rem;
}
.topbg {
  width: 100%;
  height: 16.61rem;
  position: absolute;
  top: 1.17rem;
  background: url(//gfs11.gomein.net.cn/T1PUJvBbAj1RCvBVdK.png)no-repeat top center;
  background-size: 100% 16.61rem;
}
.foot {
  width: 100%;
  height: 1.64rem;
  line-height: 0.82rem;
  color: #007aff;
  font-size: 0.4rem;
  text-align: center;
  padding-bottom: 2rem;
}
</style>
