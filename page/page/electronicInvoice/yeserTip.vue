<template>
	<div  class="tip" @click="soletip($event)">
		<div class="timebox">
			<div>开票时间</div>
			<ul>
				<li v-for="item in timeArr" @click="closetip(item)">{{ item }}</li>
			</ul>
		</div>
	</div>
		<!-- <footer v-show="containerShow" class="waves" @click="orderSubmit($event)">领取电子发票</footer> -->
</template>

<script type="ecma6.0">
import headerComponent from './electronicHeader'
let root = window || {},
    util = root.util || {};
export default {
	data(){
		return{
			timeArr:[
				"3个月内",
				"6个月内"
			],
		}
	},
	created() {
		// let assid=util.getHrefParma().assetid;
		// this.submitObj.addId = this.hrefParma.tsup;
		// this.getmessage(assid);
		// 生成年
		this.careYeaer()
	},
	methods:{
		careYeaer:function(){
			var newYeser=new Date().getFullYear(),
				cnumber=newYeser-2017;
			if(cnumber!=-1){
				for(var i=0;i<cnumber+1;i++){
					this.timeArr.push(newYeser-i+"年")
				}
			}else{
				this.timeArr.push(newYeser+"年")
			}
			 console.log(this.timeArr)
		},
		closetip: function(val){
			// console.log(val.innerHTML)
			  this.$emit("closetip",false,val)
		},
		soletip:function(event){
			if(event.target.className=="tip"){
				this.$emit("closetip2",false)
			}
		}
	},
	components: {
	}
}
</script>
<style lang="less">
	@import '../../util/fs.less';
	.tip{
		position: fixed;
		left:0;
		bottom:0;
		width: 100%;
		height:100%;
		background:rgba(0,0,0,.5);
		z-index:10000000;
		.timebox{
			width:100%;
			height:6.30666666rem;
			background:#fff;
			position: absolute;
			bottom:0;
			left:0;
			div{
				height:1.16rem;
				text-align:center;
				line-height:1.16rem;
				background:#f5f5f5;
				color:#777777;
				font-size:.4rem;
			}
			ul{
				width:100%;
				height:5.133333rem;
				overflow-x: hidden;
			}
			li{
				width:90%;
				background:#f5f5f5;
				height:1.14666666rem;
				border:0.01333333rem solid #e3e3e3;
				margin-bottom:.4rem;
				color:#333333;
				font-size:.4rem;
				margin-left:5%;
				border-radius:5px;
				text-align:center;
				line-height:1.14666666rem;
			}
			li:first-child{
					margin-top:.4rem;
				}
		}
	}
</style>