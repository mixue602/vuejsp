<template>
	<div class="blank">
		<div class="blankicon" v-show="blank">
			<img src="http://img.dev.gomegj.com/guanjia/v2/norderbg.png" />
		</div>
		<p v-show="blank">您暂时没有产品说明书</p>
		<div class="search-btn" @click="hrefindex">查找说明书</div>
		<div class="tip">温馨提示：<a href="acclist.html">绑定会员卡</a>后可以自动获取所有与会员卡关联的事物资产产品说明书；或点击“查找说明书”，搜索您需要的产品说明书。</div>
	</div>
</template>

<script>
	export default {
		props:['blank'],
		data () {
			return {

			}
		},
		created() {

		},
		methods:{
			hrefindex() {
				util.href('./directionindex.html')
			}
		}
	}
</script>
<style>
	.blank{
		width: 100%;
	}
	.blankicon{
		width: 1.46667rem;
		height: 1.73333rem;
		margin: 0 auto;
		margin-top: 2.69333rem;
	}
	.blankicon img{
		width: 100%;
		height: 100%;
	}
	.blank>p {
		width: 100%;
		line-height: 0.53333rem;
		color: #333;
		font-size: 0.45333rem;
		text-align: center;
		margin-top: 0.90667rem;
	}
	.search-btn{
		width: 6.53333rem;
		height: 1.17333rem;
		margin: 0 auto;
		border-radius: 0.58667rem;
		background: #ff4b41;
		color: #fff;
		line-height: 1.17333rem;
		font-size: 0.42667rem;
		text-align: center;
		margin-top: 0.98667rem;
	}
	.tip{
		margin: 0.26667rem;
		font-size: 0.32rem;
	}
	.tip a{
		color: rgb(51, 103, 214);
		text-decoration: underline!important;
	}

</style>