<!-- huangyihai -->
<template>
	<div>
		<header-component :title="title"></header-component>
		<section class="getver-content" ref="content">
			<div class="user clearfix">
				<input ref="code" @input="input_next" type="tel" name="user" maxlength="6" v-model="code" placeholder="输入验证码">
				<span @click="click_code_null" style="display:none" v-show="code.length>0" data-bor="userBor" class="del"></span>
				<span @click="click_send_code" class="get-code " id="sendCode">重新获取</span>
			</div>
			<div class="message">
				<p>若无法收到验证码，请拨打客服电话</p>
				<p>400-811-3333</p>
			</div>
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
			title:"填写验证码",
			phone:"",
			sendCode:true,
			code:"",
			error:false,
			validRand:"",
			params:""
        }
	},
  	created() {
  		var self = this;
  		
  		this.params = util.getHrefParma();
  		if(this.params["phone"]){
  			this.phone = this.params["phone"];
			this.$nextTick(function () {
			    self.isSendCode();
		    })
  		}
    },
    mounted(){
		var self = this;
		self.$nextTick(function () {
		    if(true){
				self.$refs.content.style.marginTop = 0+"px";
			}
	    })	
    },
    methods:{
    	click_code_null(){
			this.code = "";
			this.$refs.code.value = "";
			this.$refs.code.focus();
		},
    	input_next:function () {
    		var self = this,
    			obj = {};
    		if(self.code.length<6){
    			return ;
    		}
    		let path = "checkOldMobile",
    			nextUrl = "./changephone.html?setnew=1";

				if(this.params["next"] === "user"){
	    			path = "checkNewMobile";
	    			nextUrl = "./user.html";
	    		}else if(this.params["next"] === "pwd"){
					//验证码返回的code
					nextUrl = "./changepwd.html";
				}	
				util.api({
					surl:root.USER_API_PATH+path,
					data:{
						uiqcd:self.validRand,
						mac:self.code
					},
					type:"get",
					success:function(data){
						if(data.rpco === 200){
							root.localStorage.removeItem("uvt");
							root.localStorage.setItem("uvr",self.validRand);
							root.localStorage.setItem("uvc",self.code);
							if(data.body && data.body["opt"]){
								root.localStorage.setItem("uvo",data.body["opt"]);
							}
							if(self.params["next"] === "pwd"){
								self.isSetPwd(nextUrl);
							}else if(self.params["next"] === "user"){
								self.setNewPhone(nextUrl);
							}else{
								location.href = nextUrl;
							}
						}else{
							util.tip(data.msg)
						}
					}
				})
    	},
    	setNewPhone(nextUrl){
    		let self = this,
    			opt = root.localStorage.getItem("uvo"),
    			obj={
					mobile:self.phone,
    				mac:self.code,
    				uiqcd:self.validRand
    			};
    			if(opt){
    				obj.opt = opt;
    			}
    		util.api({
    			surl:root.USER_API_PATH+"modmobile",
    			type:"post",
    			data:obj,
    			success(data){
    				if(data.rpco === 200){
    					root.localStorage.removeItem("uvo");
    					util.tip("手机号修改成功");
    					if(util.isApp()){
							GomeJSBridge.popWindow();
							root.localStorage.removeItem("uvr");
							root.localStorage.removeItem("uvc");
							root.localStorage.removeItem("uvp");
							root.localStorage.removeItem("uvt");
							root.localStorage.removeItem("uvo");
						}else{
							location.href = nextUrl;
						}
    				}else{
    					util.tip(data.msg);
    				}
    			}
    		})
    	},
    	isSetPwd(nextUrl){
    		var self = this;
    		util.api({
				surl:root.USER_API_PATH+"checkpwd",
				type:"get",
				success(data){
					if(data.rpco === 200){
						if(data.body["ispwd"]===2){
							root.localStorage.removeItem("uvr");
							root.localStorage.removeItem("uvc");
							root.localStorage.removeItem("uvp");
							root.localStorage.removeItem("uvt");
							root.localStorage.removeItem("uvo");
							location.href = "./setpwd.html?next=user"; 
							return ;
						}else{
							location.href = nextUrl;
						}
					}else{
						util.api(data.msg);
					}	
				}
			})
    	},
    	click_send_code:function(){
    		if(!this.sendCode){
    			return ;
    		}
    		this.countAjax();
    	},
    	isSendCode(){
    		let time = root.localStorage.getItem("uvt");
    		if(time){
    			if(this.sendCode){
    				let nowTime = parseInt((new Date()*1 - parseInt(time))/1000);
    				if(nowTime>1&&nowTime<60){
    					this.countDown(60-nowTime);
    				}else{
    					this.countAjax();
    					root.localStorage.removeItem("uvt");
    				}
    			}
    		}else{
    			this.countAjax();
    		}
    	},
    	countAjax(){
			let self = this; 
	      	util.api({
				surl:root.USER_API_PATH+"sendCheckCode",
				data:{acnum:self.phone},
				type:"get",
				success:function(data){
					if(data.rpco === 200){
						self.countDown();
						root.localStorage.setItem("uvt",new Date()*1);
						self.validRand = data.body["uiqcd"];
					}else{
						util.api(data.msg);
					}
				}
			})
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
                    root.localStorage.removeItem("uvt");
                }
            });
        }, 
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
.getver-content{
	.px2rem(margin-top,88);
	.px2rem(padding-top,179);
	.px2rem(padding-left,80);
	.px2rem(padding-right,80);
	.user{
		.px2rem(margin-top,149);
		.px2remall(padding,19,0);
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
		position:relative;
		input{
			.px2rem(width,260);
			.px2rem(height,34);
			.px2rem(height,42);
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
			.px2rem(height,72);
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