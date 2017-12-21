<!-- huangyihai -->
<template>
	<div>
		<header-component :title="title"></header-component>
		<section class="setpwd-content" ref="content">
			<h2>设置密码</h2>
			<h3>密码格式应为6-20位数字、字母或符号，不允许有空格</h3>
			<div class="pwd">
				<input @blur="blur_input" ref="pwd" data-bor="pwdBor" @click="click_bor_active('pwdBor')" type="password" maxlength="20" v-if="visibleType" v-model="pwd" name="pwd" placeholder="请输入密码">
				<input @blur="blur_input" ref="pwd" data-bor="pwdBor" maxlength="20" v-else type="text" v-model="pwd" name="pwd" placeholder="请输入密码">
				<span data-bor="pwdBor" @click="click_change_visible" :class="['visible',visibleType ? '' : 'active']"></span>
			</div>
			<div @click="click_next"  :class="['btn',(pwd.length>=6&&!pwdError)?'':'disable']">完成并登录</div>
		</section>
	</div>
	
</template>
<script type="ecma6.0">
let root = window || {},
	util = root.util || {};
export default {
	data () {
		return {
			title:"设置密码",
			pwd:"",
			visibleType:true,
			uiqcd:"",
			pwdError:false
        }
	},
  	created() {
  		let rand = root.localStorage.getItem("uvr");
  		this.uiqcd = rand;
  		document.onclick = function(e) {
			e = event || e;
			var name = e.target.getAttribute("data-bor");
			//getAttribute("data-bor")
			if (name !== "pwdBor") {
				self.pwdBor = false;
			}
		}
    },
    mounted(){
        var self = this;
		self.$nextTick(function () {
		    if(util.isApp()){
				self.$refs.content.style.marginTop = 0+"px";
			}
	    })	
    },
    methods:{
    	blur_input(){
    		let self = this,
    			tip = self.checkPwd(self.pwd);
			this.$refs.pwd.setAttribute("placeholder","请输入密码");
			if(tip!==""){
    			util.tip(tip);
    			this.pwdError = true;
    		}else{
    			setTimeout(function(){
    				self.pwdError = false;
    			},500)
    		}
    	},
    	click_bor_active(key){
			if(!this[key]){
				this[key] = true;
			}
			this.$refs.pwd.setAttribute("placeholder","");
		},
    	click_change_visible() {
			this.visibleType = !this.visibleType;
		},
    	click_next(){
    		let self = this,
    			params = util.getHrefParma();
    		if(self.pwd.length<6){
    			return ;
    		}
    		util.api({
    			surl:root.USER_API_PATH+"modupwd",
    			type:"post",
    			data:{npwd:self.pwd,uiqcd:self.uiqcd},
    			success(data){
    				if(data.rpco === 200){
    					root.localStorage.removeItem("uvr");
    					util.tip("密码设置成功");
    					if(util.isApp()){
							GomeJSBridge.popWindow();
						}else{
	    					location.href = "./user.html";
	    				}
    				}else{
    					util.tip(data.msg);
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
				return str;
			}
		}
	}
}
</script>
<style lang="less">
	@import '../../util/fs.less';
	@import './../login/components/border.less';
	html{
		background:#fff;
	}
	.setpwd-content{
		.px2rem(margin-top,88);
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
			position: relative;
			background: url(//gfs11.gomein.net.cn/T1yLCvBCKv1RCvBVdK.png) (10/75)*1rem center no-repeat;
			background-size: auto (34/75)*1rem;
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
			.px2rem(border-radius, 27.5);
			&.disable{
				opacity: .5;
			}
		}
	}	
</style>