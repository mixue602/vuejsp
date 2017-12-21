<template>
	<div class="nodata">
		<div>
			<img src="http://gfs11.gomein.net.cn/T1_pJ_BCdT1RCvBVdK.png" />
		</div>
		<p>亲，没有找到您要搜索的内容</p>
	</div>
</template>
<script>
export default {
	data() {
		return {

		}
	}
}
</script>
<style>
	.nodata{
		width: 100%;
	}
	.nodata>div{
		width: 6.4rem;
		height: 6.4rem;
		margin: 1.84rem auto;
		overflow: hidden;
	}
	.nodata>div img{
		width: 100%;
		height: 100%;
	}
	.nodata>p{
		font-size: 0.42667rem;
		text-align: center;
		color:#333;
	}
</style>