<template>
	<div class="mask" :class= "{'on':deviceshow}"  @click="hideMask" >
		<div class="quickBrand" @click.stop='stopper'>
			<h2 class="quickBrandTit bdr-bottom">请选择设备</h2>
			<ul class="deviceList">
				<li  class="waves" v-for="(item,index) in devicearr">
					<a href="javascript:;">
						<img :src="item.cateimg" alt="">
						<span>{{item.catenm}}</span>
						<span @click.stop='selectDevice($event,item)' class="clickbox"></span>
					</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script type="ecma6.0">
export default {
	props:['deviceshow','devicearr'],
	data(){
		return{
			title:"选择品牌"
		}
	},
	methods:{
		selectDevice(event,item){
			ripple(event);
			this.$emit("selectdevice",item)
		},
		hideMask() {
			this.$emit('goback','deviceShow','app')
		},
		 // 阻止冒泡
        stopper(){
            return false;
        },
	},
	components:{
	}
}
</script>
<style lang="less">
	@import '../../util/fs.less';
	.mask{
		position: fixed;
		top:0;
		bottom:0;
		left: 33.333333rem;
		right:0;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.3);
		z-index: 999999;
		/* display: none; */
		-webkit-transition: all .25s linear;
		&.on{
			/* display: block; */
			left: 0;
		};
		.quickBrand{
			position: absolute;
			top: 0;
			left: 1.2rem;
			right:0;
			bottom:0;
			background-color: #fff;
			box-shadow: 0 0 10 rgba(255,255,255,0.5);
			.quickBrandTit{
				width: 100%;
				height: 1.173333rem;
				line-height: 1.173333rem;
				text-align: center;
				.mixinfont(16px);
			}
			.deviceList{
				width: 100%;
				li{
					float: left;
					width: 33.33%;
					height: 2.4rem;
					.mixinfont(14px);
					a{

						position: relative;
						display: block;
						width: 100%;
						height: 100%;
						overflow: hidden;
						text-align: center;
						img{
							width: 1.066667rem;
							height: 1.066667rem;
							margin: 0.533333rem auto 0.266667rem;
						};
						.clickbox{
							position: absolute;
							top:0;
							right:0;
							top:0;
							bottom:0;
							width: 100%;
							height: 100%;
							background-color: transparent;
						}
					}
				}

			}
		}
	}
</style>

