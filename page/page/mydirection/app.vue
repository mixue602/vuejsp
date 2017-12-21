<template>
	<div class="wapper">
		<header-components :title="headeroptions.title"></header-components>
		<div class="nav">
			<div class="left" :class="{'select':index==0}" @click="selectNav(0)">设备说明书</div>
			<div class="right" :class="{'select':index==1}" @click="selectNav(1)">收藏夹</div>
		</div>
		<fav-direction @load-list="loadlist" v-show="!blank" :load="index"></fav-direction>
		<blank-page :blank="blank"></blank-page>
	</div>
</template>
<script>
	const root = window.root;
	const util = root.util;
	import headerComponents from '../../components/HeaderComponent';
	import blankPage from './blankpage'
	import favDirection from './favdirection'
	export default {
		data() {
			return {
				index:1,
				headeroptions:{
					title:'我的说明书'
				},
				blank:true
			}
		},
		created() {
			if(util.isApp()){
				util.deleteHeadBtn();
			}
		},
		methods:{
			selectNav(num) {
				this.index = num;
			},
			loadlist(o) {
				if(!o){
					this.blank=true;
					return false;
				}
				this.blank=false;
			}
		},
		components:{
			headerComponents,
			blankPage,
			favDirection
		}
	}
</script>
<style>
	body{
		background: #f5f5f5;
	}
	.nav{
		width: 100%;
		height: 1.06667rem;
		background: #fff;
		border-bottom: 1px solid #ddd;
	}
	.nav>div{
		width: 2.13333rem;
		height: 1.06667rem;
		border-bottom: 1px solid #ddd;
		text-align: center;
		line-height: 1.06667rem;
		font-size: 0.37333rem;
	}
	.nav>div.left{
		float: left;
		margin-left: 1.33333rem;
	}
	.nav>div.right{
		float: right;
		margin-right: 1.33333rem;
	}
	.nav>div.select{
		border-bottom: 1px solid #ff4b41;
		color: #ff4b41;
	}
</style>