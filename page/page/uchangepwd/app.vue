<!-- huangyihai -->
<template>
	<div>
		<header-component :title="title"></header-component>
		<section class="modifypwd-content" ref="content">
			<div class="pwd">
				<input ref="pwd" @blur="blur_input(0)" @click="click_input" maxlength="20" v-if="oldVisibleType" type="password" v-model="oldpwd" name="pwd" placeholder="请输入旧密码">
				<input ref="pwd" @blur="blur_input(0)" @click="click_input" maxlength="20"  v-else type="text" v-model="oldpwd" name="pwd" placeholder="请输入旧密码">
				<span @click="click_change_visible('oldVisibleType')" :class="['visible',oldVisibleType ? '' : 'active']"></span>
			</div>
			<div class="pwd">
				<input @blur="blur_input(1)" maxlength="20" v-if="newVisibleType" type="password" v-model="newpwd" name="pwd" placeholder="请输入新密码">
				<input @blur="blur_input(1)" maxlength="20" v-else type="text" v-model="newpwd" name="pwd" placeholder="请输入新密码">
				<span @click="click_change_visible('newVisibleType')" :class="['visible',newVisibleType ? '' : 'active']"></span>
			</div>
			<p class="tip">密码格式为6~20位数字、字母或符号，不允许有空格</p>
			<div @click="click_next"  :class="['btn',(oldpwd.length>=6 && newpwd.length>=6&&!pwdError)?'':'disable']">完成</div>
		</section>
	</div>
</template>
<script type="ecma6.0">
let root = window || {},
	util = root.util || {};
import headerComponent from '../../components/HeaderComponent';
export default {
	data () {
		return {
			title:"重置密码",
			oldpwd:"",
			newpwd:"",
			code:"",
			uiqcd:"",
			oldVisibleType:true,
			newVisibleType:true,
			pwdError:false
        }
	},
  	created() {
  		this.uiqcd = root.localStorage.getItem("uvr");
  		this.code = root.localStorage.getItem("uvc");
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
    	click_input(){
    		this.$refs.pwd.setAttribute("placeholder","");
    	},
    	blur_input(type){
    		let self = this;
    		this.$refs.pwd.setAttribute("placeholder","请输入"+type===0?"旧":"新"+"密码");
    		if(type === 1){
    			let tip = this.checkPwd(this.newpwd);
	    		if(tip!==""){
	    			util.tip(tip);
    				this.pwdError = true;
	    		}else{
	    			setTimeout(function(){
	    				self.pwdError = false;
	    			},500)
	    		}
    		}
    	},
    	click_change_visible(key) {
			this[key] = !this[key];
		},
    	click_next(){
    		let self = this;
    		if((this.oldpwd.length<6 && this.newpwd.length<6)||this.pwdError){
    			return ;
    		}
    		util.api({
    			surl:root.USER_API_PATH+"modupwd",
    			type:"post",
    			data:{opwd:self.oldpwd,npwd:self.newpwd,vcode:self.code,uiqcd:self.uiqcd},
    			success(data){
    				if(data.rpco === 200){
    					root.localStorage.removeItem("uvr");
  						root.localStorage.removeItem("uvc");
    					util.tip("密码修改成功");
    					if(util.isApp()){
							GomeJSBridge.popWindow();
						}else{
	    					location.href = "./user.html";
	    				}
    				}else if(data.rpco === 2001){
    					util.tip("旧密码输入错误");
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
				str = "";
			}
			return str;
		}
	},
	components:{
		headerComponent
	}
}
</script>
<style lang="less">
	@import '../../util/fs.less';
	html{
		background:#fff;
	}
	.modifypwd-content{
		.px2rem(margin-top,88);
		.px2rem(padding-top,62);
		.px2rem(padding-left,80);
		.px2rem(padding-right,80);
		.pwd{
			.px2rem(height,80);
			.px2rem(line-height,80);
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
			span{
				position:absolute;
				right: 0;
				top: 0;		
				display: block;
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
				.px2rem(height,50);
				.px2rem(line-height,50);
				color:#333;
				.mixinfont(18px);
			}
		}
		.tip{
			.mixinfont(12px);
			color: #999;
			.px2rem(margin-top,18);
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