<!-- huangyihai -->
<template>
	<section class="setver-content">
		<h2>填写验证码</h2>
		<div :class="['user clearfix',userBor ?'bor-active':'']">
			<input ref="code"  @click="click_bor_active($event)" data-bor="userBor" @input="input_next" type="tel" name="user" maxlength="6" v-model="code" placeholder="输入验证码">
			<span @click="click_code_null" style="display:none" v-show="code.length>0" data-bor="userBor" class="del"></span>
			<span @click.stop="click_send_code" class="get-code" id="sendCode">重新获取</span>
		</div>
		<div style="display: none" v-show="error" class="error">
			<p>您输入的验证码不正确，请重新输入</p>
		</div>
		<div class="message">
			<p>若无法收到验证码，请拨打客服电话</p>
			<p>400-811-3333</p>
		</div>
	</section>
</template>
<script type="ecma6.0">
let root = window || {},
	util = root.util || {};
export default {
	props:["verphone","verentry","fmemberuser"],
	data () {
		return {
			phone:"",
			sendCode:true,
			code:"",
			error:false,
			validRand:"",
			userBor:false
        }
	},
  	created() {
  		var self = this;
  		if(!this.verphone){
  			let verPhone = root.localStorage.getItem("lvp"),
			    verlEntry = root.localStorage.getItem("lve"),
			    validRand = root.localStorage.getItem("lvr"),
			    forgetmemberUser = root.localStorage.getItem("lvf");
			this.$emit("change","verEntry",verlEntry);
			this.$emit("change","verPhone",verPhone);
			this.$emit("change","validRand",validRand);
			this.$emit("change","forgetmemberUser",forgetmemberUser);    
  		}
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
    mounted(){
    	var self = this;
        self.$nextTick(function () {
		    self.isSendCode();
	    })
    },
    methods:{
    	click_bor_active(dom){
    		if(!this.userBor){
				this.userBor = true;
    		}
    		var scTop = parseInt($('h2').position().top);	
    		setTimeout(function(){
				$('body').scrollTop(scTop);
			},500)	
		},
		click_code_null(){
			this.code = "";
			this.$refs.code.value = "";
			this.$refs.code.focus();
		},
    	input_next:function () {
    		var self = this;
    		if(self.code.length<6){
    			return ;
    		}
    		if(self.verentry === "verlogin"){
    			self.checkcode("validmobLogin");
    		}else if(self.verentry === "regist" || self.verentry === "forgetpwd"){
    			root.localStorage.removeItem("lvt");
	    		self.$emit("change","view","setpwd");
    		}else if(self.verentry === "forgetmemberpwd"){
    			self.forgetmember();
    		}
			self.$emit("change","setVerCode",self.code);	
    		/**/
    	},
    	forgetmember(){
    		var self = this;
    		util.api({
				surl:root.LOGIN_API_PATH+"membercard/reset",
				type:"post",
				data:{
					validrand:self.validRand,
					bindmob:self.verphone,
					code:self.code,
					account:self.fmemberuser
				},
				success:function(data){
					if(data.rpco === 200){
						util.tip("重置会员卡密码成功");
						setTimeout(function(){
							location.href="./login.html";
						},500)
					}else{
						util.tip(data.msg);
					}
				}
			})
    	},
    	checkcode(val){
    		let url = val || "validmob",
    			self = this,
    			params = util.getHrefParma();
    		util.api({
				surl:root.LOGIN_API_PATH+url,
				type:"post",
				data:{
					validrand:self.validRand,
					mob:self.verphone,
					code:self.code
				},
				success:function(data){
					if(data.rpco === 200){
						self.error = false;
						if(data.body["logResult"]){
							if(params.ou){
								location.href = params.ou;
							}else{
								location.href = "./index.html";
							}
						}else{
							util.tip("登录失败");
						}
					}else if(data.rpco === 40051){
						self.error = true;
						util.tip("验证码错误")
					}else{
						util.tip(data.msg);
					}
				}
			})
    	},
    	click_send_code(){
    		if(!this.sendCode){
    			return ;
    		}
    		this.countAjax();
    	},
    	countAjax(){
			let self = this; 
	      	util.api({
				surl:root.LOGIN_API_PATH+"sendcode",
				data:{mob:self.verphone},
				type:"get",
				success:function(data){
					if(data.rpco === 200){
						self.countDown();
						root.localStorage.setItem("lvt",new Date()*1);
						self.validRand = data.body["validrand"];
						self.$emit("change","validRand",data.body["validrand"]);
						root.localStorage.setItem("lvr",data.body["validrand"]);
					}else if(data.rpco === 20003){
						util.tip("您当前的请求过于频繁，休息一下30分钟后再试吧");
					}else{
						util.tip(data.msg);
					}
				}
			})
    	},
    	isSendCode(){
    		let time = root.localStorage.getItem("lvt");
    		if(time){
    			if(this.sendCode){
    				let nowTime = parseInt((new Date()*1 - parseInt(time))/1000);
    				if(nowTime>1&&nowTime<60){
    					this.countDown(60-nowTime);
    				}else{
    					this.countAjax();
    					root.localStorage.removeItem("lvt");
    				}
    			}
    		}else{
    			this.countAjax();
    		}
    	},
    	// 倒计时
        countDown(val) {
            let self = this;
            this.sendCode = false;
            util.countDown({
                elem: $('#sendCode'),
                downTime: val || 60,
                formate: '重新发送(count)',
                callback: function() {
                    $('#sendCode').text("重新发送");
                    self.sendCode = true;
                    root.localStorage.removeItem("lvt");
                    // self.changeVcode();
                }
            });
        }, 
    },
	components: {
	}
}
</script>
<style lang="less">
@import '../../util/fs.less';
html{
	background: #fff;
}
.setver-content{
	.px2rem(padding-top,62);
	.px2rem(padding-left,80);
	.px2rem(padding-right,80);
	h2{
		.mixinfont(30px);
		.px2rem(height,84);
		.px2rem(line-height,84);
		color: #333;
		font-weight: bold; 
	}
	.user{
		.px2rem(height,42);
		.px2rem(line-height,42);
		.px2rem(margin-top,149);
		.px2remall(padding,18,0);
		position:relative;
		width:100%;
		input{
			.px2rem(width,260);
			.px2rem(height,34);
			.px2rem(line-height,34);
			color:#333;
			.mixinfont(15px);
			float: left;
		}
		.get-code{
			display: block;
			float: right;
			.mixinfont(15px);
			.px2rem(width,220);
			.px2rem(height,42);
			text-align: center;
			color:#FF4B41;
			&.countdown{
				color:#bfbfbf;
			}
		}
		.del{
			position:absolute;
			.px2rem(left,230);
			top: 0;		
			display: block;
			background: url(//gfs11.gomein.net.cn/T1c_xvBsZj1RCvBVdK.png) center center no-repeat;
			background-size: (28/75)*1rem auto;
			.px2rem(width,40);
			.px2rem(height,70);
			&.active{
				background: url(//gfs11.gomein.net.cn/T1.LYvBTKj1RCvBVdK.png) center center no-repeat;
				background-size: (28/75)*1rem auto;
			}
		}
	}
	.error{
		.px2rem(margin-top,14);
		p{
			.mixinfont(14px);
			color:#ff4b41;
		}
	}
	.message{
		.px2rem(margin-top,450);
		p{
			text-align: center;
			.mixinfont(14px);
			color:#666;
			.px2rem(line-height,40);
		}
	}
}	
</style>