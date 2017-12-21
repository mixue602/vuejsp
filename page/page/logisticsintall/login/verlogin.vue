<!-- huangyihai -->
<template>
	<section class="verlogin-content">
		<h2>验证码登录</h2>
		<div :class="['user',userBor ?'bor-active':'',userError&&user.length>0?'active':'']">
			<input @blur="blur_input" @click="click_bor_active($event)" placeholder="请输入手机号码" data-bor="userBor" maxlength="11" v-model="user" type="tel" name="user">
			<span data-bor="userBor" @click="click_user_null($event)" style="display: none" v-show="user.length>0"></span>
		</div>
		<div @click="click_next" :class="['btn',(user.length>10&&!userError)?'':'disable']">获取验证码</div>
	</section>
</template>
<script type="ecma6.0">
let root = window || {},
	util = root.util || {};
export default {
	data () {
		return {
			userError:false,
			user:"",
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
    mounted(){
        
    },
    // watch(){
    // 	user:function(){
    // 		if(user.length===0){
    // 			this.userError = false;
    // 		} 
    // 	}
    // },	
    methods:{
    	click_user_null(dom){
    		this.user = "";
    		this.userError = false;
    		$(dom.currentTarget).prev('input').val("").focus();
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
		blur_input(){
    		var self = this;
    		if(!this.checkPhone(this.user)){
    			util.tip("手机号格式不正确");
    			this.userError = true;
    		}else{
    			setTimeout(function(){
    				self.userError = false;
    			},500)
    		}
    	},
    	click_next(){
    		var self = this;
    		if(self.userError||self.user.length<11){
    			return ;
    		}
    		//发送消息
    		util.api({
    			surl:root.LOGIN_API_PATH+"checkExist",
    			data:{account:self.user},
    			type:"get",
    			success:function(data){
    				if(data.rpco === 200){
    					if(!data.body.exist){
    						self.userError = true;
    						util.tip("当前手机号不存在，请重新尝试");
    						return ;
    					}
    					self.$emit("change","view","verification");
						self.$emit("change","verEntry","verlogin");
						self.$emit("change","verPhone",self.user);
						root.localStorage.setItem("lvp",self.user);
			    		root.localStorage.setItem("lve","verlogin");
    				}else{
    					data.msg && util.tip(data.msg);
    				}
    			}
    		})
    	},
    	checkPhone(mobile) {
			return /^1[3578][0-9]{9}$/.test(mobile);
		}
    },
	components: {
	}
}
</script>
<style lang="less">
@import '../../util/fs.less';
.verlogin-content{
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
		.px2rem(line-height,20);
		.mixinfont(14px);
		color:#666;
	}
	.user{		
		.px2rem(height,74);
		.px2rem(line-height,74);
		width:100%;
		.px2rem(padding-left,68);
		.px2rem(padding-right,40);
		box-sizing: border-box;
		.px2rem(margin-top,123);
		background: url(//gfs11.gomein.net.cn/T1bDDvBmC_1RCvBVdK.png) .25rem center no-repeat;
		background-size: (34/75)*1rem (34/75)*1rem;
		&.active{
			input{
				color:#FF4B41;
			}
			span{
				background: url(//gfs11.gomein.net.cn/T1.LYvBTKj1RCvBVdK.png) center center no-repeat;
				background-size: (28/75)*1rem auto;
			}
		}
		input{
			width: 100%;
			.mixinfont(15px);
			.px2rem(height,64);
			.px2rem(line-height,64);
			color:#333;
		}
		span{
			position:absolute;
			right: 0;
			top: 0;		
			display: block;
			background: url(//gfs11.gomein.net.cn/T1c_xvBsZj1RCvBVdK.png) center center no-repeat;
			background-size: (28/75)*1rem auto;
			.px2rem(width,40);
			.px2rem(height,72);
		}
		
	}
	.btn{
		.px2rem(height,88);
		.px2rem(line-height,88);
		text-align: center;
		background:#FF4B41;
		color:#fff;
		width: 100%;
		.px2rem(margin-top,80);
		border-radius:27.5px;
		.mixinfont(16px);
		&.disable{
			opacity: .5;
		}
	}
}	
</style>