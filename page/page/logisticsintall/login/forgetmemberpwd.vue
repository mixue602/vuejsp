<!-- huangyihai -->
<template>
	<section class="forget-content">
		<h2>忘记会员密码</h2>
		<div class="message">
			<p>忘记门店会员卡号？请拨打客服电话</p>
			<p>400-811-3333</p>
		</div>
		<div :class="['user',userBor ?'bor-active':'']">
			<input  @click="click_bor_active('userBor',$event)" type="text" data-bor="userBor" v-model="user" name="user" placeholder="请输入会员卡号">
			<span data-bor="userBor" class="del" @click="click_input_null(0,$event)" style="display: none" v-show="user.length>0"></span>
		</div>
		<div :class="['phone',phoneBor ?'bor-active':'',phoneError&&phone.length>0?'active':'']">
			<input @blur="blur_input" @click="click_bor_active('phoneBor',$event)" maxlength="11" data-bor="phoneBor" type="tel" v-model="phone" name="phone" placeholder="请输入门店存留手机号">
			<span data-bor="phoneBor" class="del"  style="display: none" v-show="phone.length>0" @click="click_input_null(1,$event)"></span>
		</div>
		<div :class="['btn',(user.length>0&&phone>=11)&&!phoneError?'':'disable']" @click="click_next">下一步</div>
		<div class="forget">
			<a @click="change_view" href="javascript:;">忘记国美账号密码</a>
		</div>
	</section>
</template>
<script type="ecma6.0">
let root = window || {},
	util = root.util || {};
export default {
	data () {
		return {
			user:"",
			phone:"",
			visibleType:true,
			phoneError:false,
			userBor:false,
			phoneBor:false
        }
	},
  	created() {
  		var self = this;
		root.localStorage.removeItem("lvp"),
		root.localStorage.removeItem("lve"),
		root.localStorage.removeItem("lvr");
		root.localStorage.removeItem("lvt");
		root.localStorage.removeItem("lvf");
		document.onclick = function(e) {
			e = event || e;
			var name = e.target.getAttribute("data-bor");
			//getAttribute("data-bor")
			if (name !== "userBor") {
				self.userBor = false;
			}
			if (name !== "phoneBor") {
				self.phoneBor = false;
			}
			if(name !== "userBor" && name !== "phoneBor"){
				document.body.scrollTop = 0;
			}
		}
    },
    mounted(){
        
    },
    methods:{
    	click_bor_active(key,dom){
    		if(!this[key]){
				this[key] = true;
			}
			var scTop = parseInt($('h2').position().top);	
			setTimeout(function(){
				$('body').scrollTop(scTop);
			},500)
		},
		blur_input(){
			var self = this;
    		if(this.checkPhone(this.phone)){
    			setTimeout(function(){
    				self.phoneError = false;
    			},500)
    		}else{
    			this.phoneError = true;
    			util.tip("手机号格式不正确");
    		}
		},
    	click_input_null:function (num,dom) {
    		if(num === 0){
    			this.user = "";
    		}else{
    			this.phoneError = false;
    			this.phone = "";
    		}
    		$(dom.currentTarget).prev('input').val("").focus();
    	},
    	change_view(){
    		this.$emit("change","view","forget");
    	},
    	click_next(){
			let self = this;
			if(self.user.length===0 || self.phone.length===0){
				util.tip("请输入手机号、会员卡信息后提交");
    			return ;
			}
    		if(self.phoneError||self.user.length<10){
    			return ;
    		}
	      	util.api({
				surl:root.LOGIN_API_PATH+"membercard/check",
				type:"post",
				data:{account:self.user,bindmob:self.phone},
				success:function(data){
					if(data.rpco === 200){
						if(!data.body){
							util.tip("当前手机号系统不存在");
							return ;
						}
						//填写验证码
						self.$emit("change","view","verification");
						self.$emit("change","verEntry","forgetmemberpwd");
			    		self.$emit("change","verPhone",self.phone);
			    		self.$emit("change","forgetmemberUser",self.user);
						root.localStorage.setItem("lvp",self.phone);
						root.localStorage.setItem("lvf",self.user);
			    		root.localStorage.setItem("lve","forgetmemberpwd");
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
	.forget-content{
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
		.message{
			.px2rem(margin-bottom,31);
			p{
				.px2rem(line-height,40);
				.mixinfont(14px);
				color:#666;
				a{
					width:100%;
					height:100%;
					display: block;
				}
				&:last-child{
					color:#FF4B41;
				}
			}
		}
		.user,.phone{
			.px2rem(height,74);
			.px2rem(line-height,74);
			width:100%;
			.px2rem(padding-left,68);
			box-sizing: border-box;
			color:#333;
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
				&.active{
					background: url(//gfs11.gomein.net.cn/T1.LYvBTKj1RCvBVdK.png) center center no-repeat;
					background-size: (28/75)*1rem (28/75)*1rem;
				}
			}
		}
		.user{
			.px2rem(margin-top,40);
			.px2rem(margin-bottom,48);
			background: url(//gfs13.gomein.net.cn/T13DdvB4hg1RCvBVdK.png) .25rem center no-repeat;
			background-size: (34/75)*1rem (34/75)*1rem;

		}
		.phone{
			background: url(//gfs11.gomein.net.cn/T1bDDvBmC_1RCvBVdK.png) (20/75)*1rem center no-repeat;
			background-size: (34/75)*1rem (34/75)*1rem;
		}
		.btn{
			.px2rem(height,88);
			.px2rem(line-height,88);
			text-align: center;
			background:#FF4B41;
			color:#fff;
			width: 100%;
			.px2rem(margin-top,79);
			.px2rem(margin-bottom,38);
			border-radius:27.5px;
			.mixinfont(16px);
			&.disable{
				opacity: .5;
			}
		}
		.forget{
			a{
				color:#78BEE9;
				.mixinfont(15px);
			}
		}
	}	
</style>