<!-- huangyihai -->
<template>
	<section class="ver-content">
		<h2>忘记密码</h2>
		<h3>仅限手机号已验或手机号注册用户找回密码</h3>
		<div :class="['user',userBor ?'bor-active':'',phoneError&&phone.length>0?'active':'']">
			<input @blur="blur_check" @click="click_bor_active($event)" maxlength="11" type="tel" data-bor="userBor" v-model="phone" name="user" placeholder="请输入手机号">
			<span data-bor="userBor" style="display: none" v-show="phone.length>1" @click="click_phone_null($event)"></span>
		</div>
		<div :class="['btn',(phone.length>10&&!phoneError) ? '': 'disable']" @click="click_next" >下一步</div>
		<div class="qk_login">
			<a href="javascript:;" @click="click_view">忘记门店会员密码</a>
		</div>
	</section>
</template>
<script type="ecma6.0">
export default {
	data() {
		return {
			phone:'',
			phoneError:false,
			userBor:false
		}
	},
	created() {
		var self = this;
		root.localStorage.removeItem("lvp"),
		root.localStorage.removeItem("lve"),
		root.localStorage.removeItem("lvr");
		root.localStorage.removeItem("lvt");
		document.onclick = function(e) {
			e = event || e;
			var name = e.target.getAttribute("data-bor");
			//getAttribute("data-bor")
			if (name !== "userBor") {
				self.userBor = false;
				document.body.scrollTop = 0;
			}
		}
	},
	mounted() {

	},
	methods: {
		blur_check(){
			var self = this;
			if(!self.checkPhone(self.phone)){
    			self.phoneError = true;
    			util.tip("手机号格式不正确");
    			return ;
    		}else{
    			setTimeout(function(){
    				self.phoneError = false;
    			},500)
    		}
		},
		click_bor_active(dom){
    		if(!this.userBor){
				this.userBor = true;
    		}	
    		var scTop = parseInt($('h2').position().top);	
			setTimeout(function(){
				$('body').scrollTop(scTop);
			},500)
		},
		click_next(){
			var self = this;
			if(!self.phone){
				util.tip("请输入手机号");
    			return;
    		}
    		if(self.phoneError){
    			return;
    		}
    		//发送消息
    		util.api({
    			surl:root.LOGIN_API_PATH+"checkExist",
    			data:{account:self.phone},
    			type:"get",
    			success:function(data){
    				if(!data.body.exist){
						util.tip("当前手机号系统不存在");
						return ;
					}
    				if(data.rpco === 200){
    					self.$emit("change","view","verification");
						self.$emit("change","verEntry","forgetpwd");
			    		self.$emit("change","verPhone",self.phone);
			    		root.localStorage.setItem("lvp",self.phone);
			    		root.localStorage.setItem("lve","forgetpwd");
    				}else{
    					data.msg && util.tip(data.msg);
    				}
    			}
    		})
		},
    	checkPhone(mobile) {
			return /^1[3578][0-9]{9}$/.test(mobile);
		},
		click_view(){
			this.$emit("change","view","forgetmember")
		},
		click_phone_null(dom) {
			this.phoneError = false;	
			this.phone = "";
			$(dom.currentTarget).prev('input').val("").focus();
		},
		click_change_visible() {
			this.visibleType = !this.visibleType;
		}
	}
}
</script>
<style lang="less">
@import '../../util/fs.less';
.ver-content{
	.px2rem(padding-top,62);
	.px2rem(padding-left,80);
	.px2rem(padding-right,80);
	h2{
		.mixinfont(30px);
		.px2rem(height,84);
		.px2rem(line-height,84);
		.px2rem(margin-bottom,18);
		color: #333;
		font-weight: bold; 
	}
	h3{
		color:#FF9A19;
		.mixinfont(14px);
		.px2rem(height,40);
		.px2rem(line-height,40);
	}
	.user{		
		.px2rem(height,84);
		.px2rem(line-height,84);
		.px2rem(margin-top,149);
		.px2rem(margin-bottom,80);
		width:100%;
		.px2rem(padding-left,68);
		box-sizing: border-box;
		background: url(//gfs11.gomein.net.cn/T1bDDvBmC_1RCvBVdK.png) .25rem center no-repeat;
		background-size: (34/75)*1rem (34/75)*1rem;
		&.active{
			input{
				color:#FF4B41;
			}
			span{
				background: url(//gfs11.gomein.net.cn/T1.LYvBTKj1RCvBVdK.png) center center no-repeat;
				background-size: (28/75)*1rem (28/75)*1rem;
			}
		}
		input{
			width: 100%;
			.px2rem(height,42);
			.px2rem(line-height,42);
			color:#333;
			.mixinfont(15px);
		}
		span{
			position:absolute;
			right: 0;
			top: 0;		
			display: block;
			background: url(//gfs11.gomein.net.cn/T1c_xvBsZj1RCvBVdK.png) center center no-repeat;
			background-size: (28/75)*1rem (28/75)*1rem;
			.px2rem(width,40);
			.px2rem(height,84);
			
		}
	}
	.btn{
		.px2rem(height,88);
		.px2rem(line-height,88);
		text-align: center;
		background:#FF4B41;
		color:#fff;
		width: 100%;
		.px2rem(margin-top,115);
		.px2rem(margin-bottom,38);
		border-radius:27.5px;
		.mixinfont(16px);
		&.disable{
			opacity: .5;
		}
	}
	.qk_login{
		a{
			.mixinfont(15px);
			color: #78BEE9;
		}
	}
}	
</style>