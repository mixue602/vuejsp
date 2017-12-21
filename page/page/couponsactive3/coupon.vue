<template>
	<div class="coupon">
		<div class="partone" @click="Fnhrefclean"><img src="//gfs12.gomein.net.cn/T13UhvBghg1RCvBVdK.png"></div>
		<!--<div class="parttwo" @click="Fnhrefrepair"><img src="//gfs13.gomein.net.cn/T10cEvBmJj1RCvBVdK.png"></div>-->
	</div>
</template>

<script>
	export default {
		methods:{
			Fnhrefclean() {
				var that=this;
				var parmars={
					tle:"gm",
					pagetype:"clean"
				};
				util.href("./broughtTheVolume.html",parmars)
			},
			Fnhrefrepair() {
				var that=this;
				var parmars={
					tle:"gm",
					pagetype:"repair"
				};
				util.href("./broughtTheVolume.html",parmars)
			}
		}
	}
</script>

<style>
	.coupon{
		width: 100%;
		position: absolute;
		top: 5.24rem;
		z-index: 1111;
	}
	.coupon img{
		width: 100%;
	}
	.partone{
		width: 8.84rem;
		height: 3.38rem;
		margin: 3rem auto;
	}
	.parttwo{
		width: 8.84rem;
		height: 3.38rem;
		margin: 0 auto;
	}
</style>