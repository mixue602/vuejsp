<!-- huangyihai -->
<template>
	<div>
		<section v-show="showCon===0" style="display:none" class="register-content">
			<h2>手机号注册</h2>
			<div :class="['user',userBor ?'bor-active':'',phoneError&&phone.length>0?'active':'']">
				<input id="mobile" @click="click_bor_active($event)" @blur="blur_input" data-bor="userBor" type="tel" v-model="phone" maxlength="11" name="user" placeholder="请输入手机号">
				<span  data-bor="userBor" @click="click_phone_null($event)" style="display: none" v-show="phone.length>0"></span>
			</div>
			<div class="sign_up" style="display: none">
				<div class="testing">
					<p class="hint">请按住滑块，拖动至最右边</p>
					<p data-drag="bg-color" class="bg-color" style="width: 0px;"></p>
					<span id="slider" data-drag="testing" class="sliding_block" data-icon="¥" style="margin-left: 0px;"></span>
				</div>
			</div>
			<div @click.self="click_agreement" :class="['agreement',agreementType?'':'active']">我已阅读并同意以下协议，接受免除或限制责任，诉讼管辖约定等条款，愿意同步账户。《<a @click.self="click_gome" href="javascript:;">国美平台服务协议</a>》《<a @click.self="click_mei" href="javascript:;">美付宝用户服务协议</a>》</div>
			<div @click="click_next" ref="btn" class="btn disable">下一步</div>
			<div class="message">
				<p>已有账号？<a @click="change" href="javascript:;">登录</a></p>
			</div>
		</section>
		<div v-show="showCon===1" style="display:none">
			<div class="fixed">
				<header-component :title="'国美平台服务协议'" :direction="'1'" @watchdirection="back" :showmore="'1'"></header-component>
			</div>
			<gome-agreement></gome-agreement>
		</div>
		<div style="display:none" v-show="showCon===2">
			<div class="fixed">
				<header-component :title="'美付宝服务协议'" :direction="'1'" @watchdirection="back" :showmore="'1'"></header-component>
			</div>
			<mei-agreement></mei-agreement>
		</div>
	</div>
</template>
<script type="ecma6.0">
let root = window || {},
	util = root.util || {};
import headerComponent from './components/HeaderComponent';
import gomeAgreement from './gomeagreement';
import meiAgreement from './meiagreement';
export default {
	data () {
		return {
			phone:"",
			phoneError:false,
			userBor:false,
			agreementType:true,
			showCon:0//1国美协议2美付宝协议
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
		/*util.api({
			surl:root.LOGIN_API_PATH+"tk2",
			type:"post",
			success(data){
				console.log(data);
			}	
		})*/
    },
    mounted(){
        
    },
    methods:{
    	click_agreement(){
    		this.agreementType = !this.agreementType;
    		if(!this.agreementType){
    			this.$refs.btn.className = "btn disable";
    		}else{
    			if(this.checkPhone(this.phone)){
    				this.$refs.btn.className = "btn";
    			}
    		}
    	},
    	click_gome(){
			this.showCon = 1;
			this.$emit("change","isAgreement",false);
    	},
    	click_mei(){
			this.showCon = 2;
			this.$emit("change","isAgreement",false);
    	},
    	back(){
    		this.showCon = 0;
    		this.$emit("change","isAgreement",true);
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
    	click_next:function () {
    		let self = this;
    		if(self.phone === ""){
    			util.tip("请输入手机号");
    			return ;
    		}
    		if(!self.agreementType){
    			util.tip("请勾选注册协议后提交");
    			return;
    		}
    		if(self.$refs.btn.className === "btn disable" || self.pwdError){
    			return;
    		}
    		//发送消息
    		util.api({
    			surl:root.LOGIN_API_PATH+"checkExist",
    			data:{account:self.phone},
    			type:"get",
    			success:function(data){
    				if(data.rpco === 200){
    					if(data.body.exist){
    						self.$refs.btn.className = "btn disable";
    						util.tip("当前手机号已被使用，请重新尝试");
    						return ;
    					}
						self.$emit("change","view","verification");
						self.$emit("change","verEntry","regist");
						self.$emit("change","verPhone",self.phone);
						root.localStorage.setItem("lvp",self.phone);
						root.localStorage.setItem("lve","regist");
    				}else{
    					data.msg && util.tip(data.msg);
    				}
    			}
    		})
    	},
    	blur_input(){
    		var self = this;
    		if(this.checkPhone(this.phone)){
    			setTimeout(function(){
    				self.phoneError = false;
    			},500)
    			this.$refs.btn.className = "btn";
    		}else{
    			this.phoneError = true;
    			this.$refs.btn.className = "btn disable";
    			util.tip("手机号格式不正确");
    			return;
    		}
    	},
    	click_phone_null(dom){
    		this.phone = "";
    		this.phoneError = false;
    		this.$refs.btn.className = "btn disable";
    		$(dom.currentTarget).prev('input').val("").focus();
    	},	
    	change(){
    		this.$emit("change","view","login")
    	},
    	checkPhone(mobile) {
			return /^1[3578][0-9]{9}$/.test(mobile);
		}
		// checkEmail(email) {
		// 	return /w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+).test(email);
		// }
    },
	components: {
		headerComponent,
		gomeAgreement,
		meiAgreement
	}
}
</script>
<style lang="less">
@import '../../util/fs.less';
.fixed{
	position: fixed;
	top:0;
	left: 0;
	width:100%;
	right:0;
	border-bottom: 1px solid #ddd;
}
.gome_text{
	.px2rem(padding,30);
	.px2rem(margin-top,88);
 	.mixinfont(13px);
    color: #333;
    .px2rem(line-height,50);
    .px2rem(text-indent,60);
	h4{
	    .mixinfont(15px);
	    font-weight: 600;
	    color: #333;
	}
	span{
	    font-weight: 700;
	}
}
.register-content{
	z-index: 10;
	background:#fff;
	.px2rem(padding-top,62);
	.px2rem(padding-left,80);
	.px2rem(padding-right,80);
	h2{
		.mixinfont(30px);
		.px2rem(height,84);
		.px2rem(line-height,84);
		.px2rem(margin-bottom,100);
		color: #333;
		font-weight: bold; 
	}
	.user{
		.px2rem(height,74);
		.px2rem(line-height,74);
		width:100%;
		.px2rem(padding-left,68);
		box-sizing: border-box;
		.px2rem(margin-top,40);
		.px2rem(padding-right,40);
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
		}
		span{
			position:absolute;
			right: 0;
			top: 0;		
			display: block;
			background: url(//gfs11.gomein.net.cn/T1c_xvBsZj1RCvBVdK.png) center center no-repeat;
			background-size: (28/75)*1rem (28/75)*1rem;
			.px2rem(width,40);
			.px2rem(height,72);		
		}
	}
	.agreement{
		.px2rem(padding-left,55);
		.px2rem(margin-top,35);
		.px2rem(margin-bottom,56);
		background:url(//gfs10.gomein.net.cn/T1fqWvB4YT1RCvBVdK.png) no-repeat (19/75)*1rem top;
		background-size:(30/75)*1rem (30/75)*1rem;
		-webkit-background-size:(30/75)*1rem (30/75)*1rem;
		.mixinfont(13px);
		color:#999;
		&.active{
			background:url(//gfs10.gomein.net.cn/T150bjB4ZT1RCvBVdK.png) no-repeat (19/75)*1rem top;
			background-size:(30/75)*1rem (30/75)*1rem;
			-webkit-background-size:(30/75)*1rem (30/75)*1rem;	
		}
		a{
			color: #ff4b41;
		}
	}
	.btn{
		.px2rem(height,88);
		.px2rem(line-height,88);
		text-align: center;
		background:#FF4B41;
		color:#fff;
		width: 100%;
		.px2rem(margin-bottom,38);
		border-radius:27.5px;
		.mixinfont(16px);
		&.disable{
			opacity: .5;
		}
	}
	.message{
		.mixinfont(15px);
		a{
			color:#78BEE9;
		}
	}
	.sign_up{
		.px2rem(margin-top,40);
		.testing{
			position: relative;
		    width: 100%;
		    .px2rem(height,98);
		    .px2rem(line-height,98);
		    background: #eaebec;
		    .mixinfont(13px);
		    color: #6c6d70;
		    border: 1px solid #e5e7e8;
		    border-radius:8px;
		    text-align: center;
		    .sliding_block {
			    position: absolute;
			    left: 0;
			    top: 0;
			    display: block;
			    background: #fff;
			    .px2rem(width,100);
			    .px2rem(height,100);
			    .px2rem(border-radius,5);
			    color: #c3c4c7;
			    .mixinfont(16px);
			    -webkit-box-shadow: -1px 1px 12px -3px #ccc;
			    background: url(//gfs10.gomein.net.cn/T1n8D_B5_T1RCvBVdK.png) center center no-repeat;
			    background-size:auto 100%;
			    -webkit-background-size:auto 100%;
			    &.active{
			    	background: url(//gfs13.gomein.net.cn/T1BAW_B5KT1RCvBVdK.png) center center no-repeat;
				    background-size:auto 100%;
				    -webkit-background-size:auto 100%;
			    }
			}
			.bg-color {
			    height: 100%;
			    position: absolute;
			    top: 0;
			    text-align: center;
			    color: #fff;
			    background: #3BCBD1;
			    border-radius:8px;
			}
		}
	}
}
@media all and (-webkit-min-device-pixel-ratio: 0) and (min-resolution:.001dpcm) {
    .sign_up .testing p.hint {
        background-image:-webkit-linear-gradient(left,#6c6d70,#e9e9e9 25%,#6c6d70 50%,#e9e9e9 75%,#818285);
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
        -webkit-background-size: 200% 100%;
        -webkit-animation: masked-animation 4s infinite linear
    }
}

@-webkit-keyframes masked-animation {
    0% {
        background-position: 0 0
    }

    100% {
        background-position: -100% 0
    }
}	
</style>