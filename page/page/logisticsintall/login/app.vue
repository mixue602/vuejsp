<!-- huangyihai -->
<template>
	<div>
		<header-component v-if="isAgreement" :title="title"></header-component>
		<transition-group name="component-fade">
			<login-con :key="view" v-if="view==='login'"  @change="change_name"></login-con>
			<login-regist :key="view" v-if="view==='regist'"  @change="change_name"></login-regist>
   			<forget-pwd :key="view" @change="change_name" v-if="view==='forget'"></forget-pwd>
			<set-verification :fmemberuser="forgetmemberUser" :verphone="verPhone" :verentry="verEntry" :key="view" @change="change_name" v-if="view==='verification'"></set-verification>
			<set-pwd :verphone="verPhone" :verentry="verEntry" :vercode="setVerCode" :validrand="validRand" :key="view" @change="change_name" v-if="view==='setpwd'"></set-pwd>
			<forget-memberpwd :key="view" @change="change_name" v-if="view==='forgetmember'"></forget-memberpwd>
			<ver-login :key="view" v-if="view==='quick'"  @change="change_name"></ver-login>
  		</transition-group>		
<!-- 		<transition name="" mode="out-in">
		  <component v-bind:is=""></component>
		</transition> -->
	</div>
</template>
<script type="ecma6.0">
let root = window || {},
	util = root.util || {};
import headerComponent from './components/HeaderComponent';
import loginCon from './logincon';
import loginRegist from './loginregist';
import forgetPwd from './forgetpwd';
import forgetMemberpwd from './forgetmemberpwd';
import setVerification from './setverification';
import setPwd from './setpwd';
import verLogin from './verlogin';
export default {
	data() {
		return {
			title: "",
			view:'login',
			docState: '',
			verEntry:'',
			setpwdEntry:'',
			verPhone: '',
			validRand:'',//验证码返回
			setPhone:'',
			setVerCode:'',
			isAgreement:true,
			forgetmemberUser:""				
		}
	},
	created() {
		var self = this;
		window.onpopstate = function(){
			self.change_view(); 	
		}
		this.change_view();
	},
	mounted() {
	},
	methods: {
		change_view(){
			var href = location.hash.substr(1);
			this.view = href || "login"; 
		},
		/*change_ver_phone(phone) {
			this.verPhone = phone;
		},
		change_valid_rand(val){
			this.validRand = val;
		},
		change_setpwd_phone(phone){
			this.setPhone = phone;
		},
		change_setpwd_vercode(code){
			this.setVerCode = code;
		},
		change_ver_entry(entry){
			this.verEntry = entry;
		},
		change_setpwd_entry(entry){
			this.setpwdEntry = entry;
		},*/
		change_name(key,val){
			if(key === "view"){
				history.pushState({}, "","#"+val);
			}
			this[key] = val;
		}
	},
	components: {
		headerComponent,
		loginCon,
		loginRegist,
		forgetPwd,
		forgetMemberpwd,
		setVerification,
		setPwd,
		verLogin
	}
}
</script>
<style lang="less">
	@import './components/border.less';
	*{
		-webkit-tap-highlight-color:#000;
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
</style>