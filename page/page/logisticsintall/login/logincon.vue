<!-- huangyihai -->
<template>
	<section class="login-content">
		<h2>你好,</h2>
		<h3>欢迎来到国美管家，立即<a @click="change_name('view','regist')" href="javascript:;">注册</a></h3>
		<div :class="['user',userBor ?'bor-active':'']">
			<input @click="click_bor_active('userBor','user')" ref="user" data-bor="userBor"  type="text" name="user" placeholder="手机号/邮箱/用户名/门店会员卡号" v-model="phone">
			<span data-bor="userBor" @click="click_phone_null" :class="['del']" style="display:none" v-show="phone.length>0"></span>
		</div>
		<div :class="['pwd',pwdBor ?'bor-active':'']">
			<input @click="click_bor_active('pwdBor','pwd')" ref="pwd" data-bor="pwdBor" v-if="visibleType" type="password" name="pwd" placeholder="请输入密码" v-model="pwd">
			<input ref="pwd" data-bor="pwdBor" v-else type="text" name="pwd" placeholder="请输入密码" v-model="pwd">
			<span data-bor="pwdBor" @click="click_change_visible" :class="['visible',visibleType ? '' : 'active']"></span>
		</div>
		<div class="vercode" style="display: none">
			<input ref="code" type="text" name="code" placeholder="请输入图片验证码" v-model="vercode">
			<span>
				<img src="//gfs10.gomein.net.cn/T1OVAjBXVT1RCvBVdK.png">
			</span>	
		</div>
		<div @click="click_submit_login" :class="['btn',pwd.length>0&&phone.length>0 ? '' : 'disable']">登录</div>
		<div class="qk_login">
			<a @click="change_name('view','quick')" href="javascript:;">手机号快捷登录</a>
			<a class="float_r" @click="change_name('view','forget')" href="javascript:;">忘记密码?</a>
		</div>
		<div class="three-login" style="display:none" v-show="isWeiXin">
			<p>使用以下账号登录</p>
			<ul>
				<li @click="click_weixin_login" class="weixin">微信</li>
			</ul>
		</div>
	</section>	
</template>
<script type="ecma6.0">
let root = window || {},
	util = root.util || {},
	ua = navigator.userAgent.toLowerCase();
export default {
	data() {
		return {
			phone: "",
			phoneError:false,
			pwd: "",
			visibleType: true,
			isWeiXin:ua.indexOf('micromessenger')>-1,
			userBor:false,
			pwdBor:false,
			vercode:"",
			clickNum:0
		}
	},
	created() {
		var self = this;
		document.onclick = function(e) {
			e = event || e;
			self.clickNum++;
			var name = e.target.getAttribute("data-bor");
			//getAttribute("data-bor")
			if (name !== "userBor") {
				self.userBor = false;
			}
			if (name !== "pwdBor") {
				self.pwdBor = false;
			}
			if(name !== "pwdBor" && name !== "userBor"){
				document.body.scrollTop = 0;
			}
		}
		/*util.api({
			surl:root.LOGIN_API_PATH+"tk1",
			type:"post",
			success(data){
				console.log(data);
			}	
		})*/
	},
	mounted() {

	},
	methods: {
		click_change_visible() {
			this.visibleType = !this.visibleType;
		},
		click_phone_null() {
			this.phone = "";
			this.$refs.user.value = "";
			this.$refs.user.focus();
		},
		click_submit_login() {
			let self = this,
				params = util.getHrefParma();
			if(!(self.phone.length>0&&self.pwd.length>0)){
				return;
			}
			util.api({
				surl: root.LOGIN_API_PATH+"lg",
				data: {
					account: self.phone,
					pwd: self.pwd,
					clickTime:self.clickNum
				},
				type: "post",
				success(data) {
					if(data.rpco === 200){
						util.tip("登录成功");
						if(params.ou){
							location.href = params.ou;
						}else{
							location.href = "./index.html";
						}
					}else if(data.rpco === 40100){
						util.tip("请到原渠道升级后在登录");
					}else{
						data.msg && util.tip(data.msg);
					}
				}
			})
		},
		click_bor_active(key,ref){
			if(!this[key]){
				this[key] = true;
			}
			var scTop = parseInt($('h2').position().top);
			setTimeout(function(){
				$('body').scrollTop(scTop);
			},500)
		},
		click_weixin_login() {
			var isHttps =location.href.indexOf("https://")>=0,
				furl = root.WXCM_API_PATH + 'wxrc?furl=' + encodeURIComponent("http"+(isHttps?"s":"")+"://"+location.hostname+"/yf/index.html");
                util.href(furl);
		},
		change_name(key,val){
			this.$emit("change",key,val)
		}
	}
}
</script>
<style lang="less">
	@import '../../util/fs.less';
	html{
		background: #fff;
	}
	.component-fade-enter-active{
	    animation-duration: .5s;
	  	animation-name: slideInRight;
	}
	.animated.infinite {
	  animation-iteration-count: infinite;
	}

	.animated.hinge {
	  animation-duration: 2s;
	}
	@keyframes slideInRight {
	  from {
	    transform: translate3d(100%, 0, 0);
	    visibility: visible;
	  }

	  to {
	    transform: translate3d(0, 0, 0);
	  }
	}

	.slideInRight {
	  animation-name: slideInRight;
	}
	.login-content{
		.px2rem(padding-top,62);
		.px2rem(padding-left,80);
		.px2rem(padding-right,80);
		h2{
			.mixinfont(30px);
			.px2rem(height,84);
			.px2rem(line-height,84);
			.px2rem(margin-bottom,8);
			color: #333;
			font-weight: bold; 
		}
		h3{
			color: #333;
			.mixinfont(14px);
			.px2rem(height,40);
			.px2rem(line-height,40);
			a{
				color: #78BEE9
			}
		}
		.user,.pwd,.vercode{
			.px2rem(height,74);
			.px2rem(line-height,74);
			width:100%;
			.px2rem(padding-left,68);
			box-sizing: border-box;
			input{
				width: 100%;
				.mixinfont(15px);
				.px2rem(height,42);
				.px2rem(line-height,42);
				color:#333;
			}
			span{
				position:absolute;
				right: 0;
				top: 0;		
				display: block;
			}
		}
		.user{
			.px2rem(margin-top,40);
			.px2rem(margin-bottom,48);
			.px2rem(padding-right,30);
			background: url(//gfs11.gomein.net.cn/T1bDDvBmC_1RCvBVdK.png) .25rem center no-repeat;
			background-size: (34/75)*1rem (34/75)*1rem;
			&.active{
				input{
					color:#FF4B41;
				}
				.del{
					background: url(//gfs11.gomein.net.cn/T1.LYvBTKj1RCvBVdK.png) center center no-repeat;
					background-size: (28/75)*1rem (28/75)*1rem;
				}
			}
			.del{
				background: url(//gfs11.gomein.net.cn/T1c_xvBsZj1RCvBVdK.png) center center no-repeat;
				background-size: (28/75)*1rem (28/75)*1rem;
				.px2rem(width,40);
				.px2rem(height,72);
				
			}
		}
		.pwd{
			background: url(//gfs13.gomein.net.cn/T1N_DvB_Y_1RCvBVdK.png) .25rem center no-repeat;
			background-size: (34/75)*1rem (34/75)*1rem;
			.px2rem(padding-right,40);
			.visible{
				.px2rem(width,40);
				.px2rem(height,72);
				background: url(//gfs12.gomein.net.cn/T1IL_vB5xT1RCvBVdK.png) center center no-repeat;
				background-size: (34/75)*1rem auto;
				&.active{
					background: url(//gfs12.gomein.net.cn/T15LDvB7L_1RCvBVdK.png) center center no-repeat;
					background-size: (34/75)*1rem auto;
				}
			}
		}
		.vercode{
			.px2rem(margin-top,32);
			background: url(//gfs10.gomein.net.cn/T1OVAjBXVT1RCvBVdK.png) .25rem center no-repeat;
			background-size: (34/75)*1rem (34/75)*1rem;
			.px2rem(padding-right,40);
			.px2rem(padding-right,90);
			span{
				.px2rem(width,80);
				.px2rem(height,34);
				.px2rem(top,15);
				img{
					width:100%;	
				}
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
			.px2rem(margin-bottom,209);
			a{
				.mixinfont(15px);
				color: #78BEE9;
			}
		}
		.three-login{
			p{
				.mixinfont(14px);
				color: #999999;
				position: relative;
				text-align:center;
				&:before,&:after{
					position: absolute;
					content: "";
					.px2rem(width,160);
					.px2rem(height,1);
					.px2rem(top,14);
					background: #ddd;
				}
				&:before{
					left: 0;
				}
				&:after{
					right:0;
				}
			}
			ul{
				.px2rem(margin-top,53);
				.px2rem(margin-bottom,63);
				li{
					margin: 0 auto;
					height: 100%;
					text-align:center;
					.px2rem(padding-top,109);
					.px2rem(width,84);
					.mixinfont(14px);
					color:#666;
					&.weixin{
						background: url(//gfs11.gomein.net.cn/T1VDYvBbJT1RCvBVdK.png) top center no-repeat;
						background-size:(84/75)*1rem auto;
					}
				}

			}
		}
	}	
</style>