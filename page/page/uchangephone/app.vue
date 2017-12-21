<!-- huangyihai -->
<template>
	<div>
		<header-component :title="title"></header-component>
		<section class="change-phone" ref="changephone">
			<div class="user"> 
				<input v-if="isNewPhone" maxlength="11" @blur="blur_check_phone" placeholder="请输入手机号" v-model="phone" type="tel" name="user">
				<input v-else readonly="readonly" maxlength="11" placeholder="请输入手机号" v-model="phone" type="tel" name="user">
				
			</div>
			<p class="tip">更换手机号后，下次登录可使用新手机号</p>
			<div @click="click_next" :class="['btn',phone.length>10?'':'disable']">下一步</div>
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
			title:"输入手机号",
			phone:"",
			isNewPhone:false,
			entry:""
		}
	},
	created() {
		let params = util.getHrefParma(),
			self = this;
		//缺少一个在app里面的判断入口
		root.localStorage.removeItem("uvt");
		if(params.entry){
			this.entry = params.entry;
			root.localStorage.setItem("uctype",params.entry);
		}else{
			this.entry = root.localStorage.getItem("uctype");
		}
		// this.title = this.entry === "2"?"修改密码":"";
		if(params.setnew){
			this.isNewPhone = true;
		}
		if(!this.isNewPhone){
			util.api({
				surl:root.USER_API_PATH+"userdtal",
				type:"get",
				success(data){
					if(data.rpco === 200){
						self.phone = data.body["mobile"];
					}
				}
			})
		}
	},
	mounted() {
		var self = this;
		self.$nextTick(function () {
		    if(util.isApp()){
				self.$refs.changephone.style.marginTop = 0+"px";
			}
	    })	
	},
	methods:{
		click_phone_null(){
			this.phone = "";
		},
		blur_check_phone(){
			if(!this.checkPhone(this.phone)){
				util.tip("手机号格式不正确");
			}
		},
		click_next(){
			let self = this,
				str = "./uvercode.html?phone="+this.phone;
			if(this.phone.length<11){
				return ;
			}
			if(self.isNewPhone){
				util.api({
					surl:root.USER_API_PATH+"isBian?acnum="+self.phone,
					type:"get",
					success(data){
						if(data.rpco === 200){
							self.location_next(str);	
						}else if(data.rpco === 40003){
							util.tip("当前手机号已被绑定，请解绑后尝试");
						}else{
							util.tip(data.msg);
						}
					}
				})
			}else{
				self.location_next(str);	
			}
		},
		location_next(str){
			if(this.entry==="1"){
				if(this.isNewPhone){
					location.href = str+"&next=user";
				}else{
					location.href = str;
				}
			}else{
				location.href = str+"&next=pwd";
			}
		},
		checkPhone(mobile) {
			return /^1[3578][0-9]{9}$/.test(mobile);
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
		background: #fff;
	}
	.change-phone{
		.px2rem(margin-top,88);
		.px2rem(padding-top,151);
		.px2rem(padding-left,80);
		.px2rem(padding-right,80);
		.user{
			.px2rem(height,74);
			.px2rem(line-height,74);
			width:100%;
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
			.px2rem(padding-left,68);
			box-sizing: border-box;
			background: url(//gfs11.gomein.net.cn/T1bDDvBmC_1RCvBVdK.png) (6/75)*1rem center no-repeat;
			background-size: auto (34/75)*1rem;
			position: relative;
			input{
				width: 100%;
				.mixinfont(15px);
				.px2rem(height,42);
				.px2rem(line-height,42);
				color:#333;
			}
		}
		.tip{
			.mixinfont(12px);
			color: #999;
			.px2rem(margin-top,12);
		}
		.btn{
			.px2rem(height,88);
			.px2rem(line-height,88);
			text-align: center;
			background:#FF4B41;
			color:#fff;
			width: 100%;
			.px2rem(margin-top,80);
			.px2rem(border-radius, 27.5);
			&.disable{
				opacity: .5;
			}
		}
	}
	
</style>