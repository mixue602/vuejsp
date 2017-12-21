<!-- huangyihai -->
<template>
	<section class="setpwd-content">
		<h2>设置密码</h2>
		<h3>密码格式应为6-20位数字、字母或符号，不允许有空格</h3>
		<div :class="['pwd',pwdBor ?'bor-active':'']">
			<input @blur="blur_input"  @click="click_bor_active($event)" maxlength="20" data-bor="pwdBor" type="password" v-if="visibleType" v-model="pwd" name="pwd" placeholder="请输入密码">
			<input @blur="blur_input" maxlength="20" @click="click_bor_active($event)" data-bor="pwdBor" v-else type="text" v-model="pwd" name="pwd" placeholder="请输入密码">
			<span data-bor="pwdBor" class="visible" @click="click_change_visible" :class="['visible',visibleType ? '' : 'active']"></span>
		</div>
		<div @click="click_next"  :class="['btn',(pwd.length>=6&&!pwdError)?'':'disable']">完成并登录</div>
	</section>
</template>
<script type="ecma6.0">
export default {
	props:['verphone',"vercode","validrand","verentry"],
	data () {
		return {
			pwd:"",
			visibleType:true,
			url:"regLogin",
			tip:"注册成功",
			pwdBor:false,
			pwdError:false
        }
	},
  	created() {
  		let self = this;
  		if(!this.verphone){
  			let verPhone = root.localStorage.getItem("lvp"),
			    verlEntry = root.localStorage.getItem("lve"),
			    validRand = root.localStorage.getItem("lvr");
			this.$emit("change","verEntry",verlEntry);
			this.$emit("change","verPhone",verPhone);
			this.$emit("change","validRand",validRand);    
  		}
  		if(this.verentry === "forgetpwd"){
  			this.url = "modpwd";
  			this.tip = "重置密码成功";	
  		}
  		document.onclick = function(e) {
			e = event || e;
			let name = e.target.getAttribute("data-bor");
			//getAttribute("data-bor")
			if (name !== "pwdBor") {
				self.pwdBor = false;
				document.body.scrollTop = 0;
			}
		}
    },
    mounted(){
        
    },
    methods:{
    	blur_input(){
    		let self = this,
    			tip = this.checkPwd(this.pwd);
    		if(tip!==""){
    			util.tip(tip);
    			this.pwdError = true;
    		}else{
    			setTimeout(function(){
    				self.pwdError = false;
    			},500)
    		}
    		if(self.pwd.indexOf(self.verphone)>=0){
    			util.tip("您的密码与账户过于一致，存在风险");
    			return ;
    		}
    	},
    	click_bor_active(dom){
    		if(!this.pwdBor){
				this.pwdBor = true;
    		}	
			let scTop = parseInt($('h2').position().top);
			setTimeout(function(){
				$('body').scrollTop(scTop);
			},500)
		},
    	click_change_visible() {
			this.visibleType = !this.visibleType;
		},
    	click_next(){
    		let self = this,
    			params = util.getHrefParma();
    		if(self.pwdError){
    			return;
    		}	
    		if(self.pwd.indexOf(self.verphone)>=0){
    			util.tip("您的密码与账户过于一致，存在风险");
    			return ;
    		}
    		util.api({
				surl:root.LOGIN_API_PATH+self.url,
				data:{
					validrand:self.validrand,
					code:self.vercode,
					account:self.verphone,
					pwd:self.pwd
				},
				type:"post",
				success:function(data){
					if(data.rpco === 200){
						util.tip(self.tip);
						root.localStorage.removeItem("lvp"),
						root.localStorage.removeItem("lve"),
						root.localStorage.removeItem("lvr");
						setTimeout(function(){
							if(this.verentry === "forgetpwd"){
								self.$emit("change","view","login");
							}else{
								if(params.ou){
									location.href = params.ou;
								}else{
									location.href="./index.html";
								}
							}
						},300)
					}else if(data.rpco === 40001){
						util.tip("验证码错误");
						setTimeout(function(){
							self.$emit("change","view","verification");
						},300)
					}else if(data.rpco === 1003){
						util.tip("该IP48小时注册次数超过限制");
					}else{
						data.msg && util.tip(data.msg);
					}
				}
			})
    	},
    	checkPwd(pwd){
			let test = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,20}$/.test(pwd),
				isNum = /^\d{6,20}$/.test(pwd),
				one =  /^(.)\1+$/.test(pwd),
				str = "",
				space = /\s/.test(pwd);
			if(!test || space){
				if(pwd.length<6 || pwd.length>20){
					str = "密码长度应为6-20个字符";
				}else{
					str = "请使用字母加数字或符号的组合，6~20个字符";
					if(one){
						str = "密码不能为同一字符";
					}
					if(isNum){
						str = "密码不得全为数字";
					}
				}
			}else{
				str = "";
			}
			return str;
		}
	}
}
</script>
<style lang="less">
	@import '../../util/fs.less';
	.setpwd-content{
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
			color: #ff9a19;
			.mixinfont(14px);
			.px2rem(line-height,40);
		}
		.pwd{
			.px2rem(height,74);
			.px2rem(line-height,74);
			width:100%;
			.px2rem(padding-left,68);
			box-sizing: border-box;
			background: url(//gfs11.gomein.net.cn/T1yLCvBCKv1RCvBVdK.png) (10/75)*1rem center no-repeat;
			background-size: (34/75)*1rem (34/75)*1rem;
			.px2rem(padding-right,40);
			.px2rem(margin-top,25);
			.visible{
				.px2rem(width,40);
				.px2rem(height,72);
				background: url(//gfs12.gomein.net.cn/T1IL_vB5xT1RCvBVdK.png) right center no-repeat;
				background-size: (34/75)*1rem auto;
				&.active{
					background: url(//gfs12.gomein.net.cn/T15LDvB7L_1RCvBVdK.png) right center no-repeat;
					background-size: (34/75)*1rem auto;
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
			}
		}
		.btn{
			.px2rem(height,88);
			.px2rem(line-height,88);
			text-align: center;
			background:#FF4B41;
			color:#fff;
			width: 100%;
			.px2rem(margin-top,152);
			border-radius:27.5px;
			.mixinfont(16px);
			&.disable{
				opacity: .5;
			}
		}
	}	
</style>