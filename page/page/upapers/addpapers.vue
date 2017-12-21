<!-- huangyihai -->
<template>
	<section class="add-papers">
		<div class="papers-con">
			<ul>
				<li @click="click_focus($event)">
					<span>姓名</span>
					<input type="text" v-model="name" name="" placeholder="请输入姓名">
				</li>
				<li @click="click_get_type">
					<span>证件类型</span>
					<p v-text="typeList[type]||'请选择'"></p>
				</li>
				<li @click="click_focus($event)">
					<span>证件号码</span>
					<input type="tel" v-if="type===0" v-model="num" name="" placeholder="请输入证件">
					<input type="text" maxlength="18" v-else-if="type === 1||type===8" v-model="num" name=""  placeholder="请输入证件">
					<input type="text" maxlength="9" v-else-if="type === 2" v-model="num" name="" placeholder="请输入证件">
					<input type="text" maxlength="8" v-else-if="type === 3" v-model="num" name="" placeholder="请输入证件">
					<input type="text" maxlength="16" v-else-if="type === 4" v-model="num" name="" placeholder="请输入证件">
					<input type="text" maxlength="14" v-else-if="type === 5" v-model="num" name="" placeholder="请输入证件">
					<input type="text" maxlength="12" v-else-if="type === 6" v-model="num" name="" placeholder="请输入证件">
					<input type="text" maxlength="8" v-else-if="type === 7" v-model="num" name="" placeholder="请输入证件">
					<input type="text" maxlength="15" v-else-if="type === 9" v-model="num" name="" placeholder="请输入证件">
					<input type="text" maxlength="13" v-else-if="type === 10" v-model="num" name="" placeholder="请输入证件">
				</li>
			</ul>
		</div>
		<div class="tip">
			<p>同类型证件仅能添加一次系统会对您上传的证件号码加密保存</p>
		</div>
		<div @click="click_submit" :class="['btn',isDis?'':'disable']">
			<p>保存</p>
		</div>
		<div class="add-papers-list" v-show="getType" style="display: none">
			<ul>
				<li @click="click_change_type(1)">身份证</li>
				<li @click="click_change_type(2)">户口簿</li>
				<li @click="click_change_type(3)">护照</li>
				<li @click="click_change_type(4)">军官证</li>
				<li @click="click_change_type(5)">士兵证</li>
				<li @click="click_change_type(10)">警官证</li>
				<li @click="click_change_type(8)">临时身份证</li>
				<li @click="click_change_type(9)">外国人居留证</li>
				<li @click="click_change_type(6)">港澳居民来往内地通行证</li>
				<li @click="click_change_type(7)">台湾同胞来往内地通行证</li>
			</ul>
		</div>
	</section>
</template>
<script type="ecma6.0">
let root = window || {},
	util = root.util || {};
export default {
	props:["existList"],
	data() {
		return {
			typeList:["","身份证","户口簿","护照","军官证","士兵证","港澳居民来往内地通行证","台湾同胞来往内地通行证","临时身份证","外国人居留证","警官证"],
			name:"",
			num:'',
			type:0,
			getType:false
		}
	},
	created() {
		
	},
	mounted() {
		
	},
	computed:{
		isDis(){
			return this.type!=''&&this.num.length>0&&this.name.length>0
		}
	},
	methods: {
		click_phone_null(){
		},
		click_get_type(){
			this.getType = true;	
		},
		click_focus(el){
			el.stopPropagation();
			var $this = $(el.currentTarget);
			$this.children('input').focus();
		},
		click_submit(){
			var self = this;
			if(!self.isDis){
				return ;
			}
			util.api({
				surl:root.USER_API_PATH+"modcertifi",
				type:"post",
				data:{
					cetp:self.type,
					oname:self.name,
					ceno:self.num,
					state:1
				},
				success(data){
					if(data.rpco ===200){
						self.$emit("change",'papersType',0);
						location.href = "./papers.html";
					}else{
						util.tip(data.msg);
					}
					
				}
			})
		},
		click_change_type(val){
			if(this.checkArrIndex(this.existList,val)){
				util.tip("当前证件已添加，请解绑后重新添加");
				return ;
			}
			this.type = val;
			this.getType = false;
		},
		checkArrIndex(arr,val){
			for(var i = 0,len = arr.length;i<len;i++){
				if(arr[i] === val){
					return true;
					continue;
				}
			}
			return false;
		},
		checkCard(val){
			return /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/.test(val);
		},
		checkHuKou(val){
			return /\d{9}/.test(val);
		},
		checkHuzhao(val){
			return /[0-9a-zA-Z]{9}/.test(val);
		},
	},
	components: {
	}
}
</script>
<style lang="less">
	@import '../../util/fs.less';
	.add-papers{
		.px2rem(margin-top,88);
		background:#fff;
		position: relative;
		.papers-con{
			ul{
				.px2rem(margin-left,24);
				li{
					.px2rem(height,86);
					.px2rem(line-height,86);
					.px2rem(padding-right,24);
					border-bottom: (1/75)*1rem solid #e3e3e3;
					p,input{
						float: right;
						.mixinfont(14px);
					}
					p{
						position:relative;
						.px2rem(padding-right,34);
						&:before{
							position:absolute;
							content: "";
							right: 0;
							.px2rem(top,30);
						    border: 1px solid #999;
						    border-left-color: transparent;
						    border-bottom-color: transparent;
						    -webkit-transform: rotate(45deg);
						    transform: rotate(45deg);
						    .px2rem(height,26);
						    .px2rem(width,26);
						}
					}
					input{
						.px2rem(width,356);
						text-align: right;
						.px2rem(height,30);
						.px2rem(margin-top,28);
					}
				}
			}
		}
		.tip{
			.px2remall(padding,0,24);
			.px2rem(margin-top,20);
			.px2rem(margin-bottom,80);
			p{
				.mixinfont(12px);
				color: #777;
			}
		}
		.add-papers-list{
			position: fixed;
			.px2rem(top,88);
			left:0;
			right: 0;
			bottom:0;	
			background:#f5f5f5;
			ul{
				background:#fff;
				overflow: hidden;
				li{
					.px2rem(height,86);
					.px2rem(margin-left,24);
					border-bottom:(1/75)*1rem solid #e3e3e3;
					.mixinfont(14px);
					color: #333;
					.px2rem(line-height,86);
				}
			}
		}	
		.btn{
			.px2rem(margin-top,60);
			.px2remall(padding,0,40);
			.px2rem(height,128);
			box-sizing: border-box;
			background:#fff;
			&.disable{
				p{
					background:#e0e0e0;
				}
			}
			p{
				.px2rem(height,88);
				.px2rem(line-height,88);
				text-align: center;
				background:#FF4B41;
				color:#fff;
				width: 100%;
				.px2rem(margin-top,20);
				.px2rem(border-radius, 10);
				text-align: center;
			}
		}
	}	
</style>