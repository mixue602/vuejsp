<!-- huangyihai -->
<template>
	<div>
		<header-component :title="title"></header-component>
		<section class="user">
			<ul>
				<li @click="click_change_head('2')"><label>头像</label><span><img onerror="javascript:this.src='//gfs12.gomein.net.cn/T1B_CgB7CT1RCvBVdK.png'" :src="imgsrc"></span><i></i></li>
				<li class="mb20"><a class="clearfix" href="./nickname.html"><label>昵称</label><span v-text="info.nick"></span></a><i></i></li>
				<!-- <li><a class="clearfix" href="./papers.html">证件</a></li> -->
				<li class="noimg" @click="click_replace_phone(info.mobile)"><label>手机号</label><span v-text="replace_asterisk(info.mobile,3,4)"></span></li>
				<li class="mb20" @click="click_change_pwd(info.mobile)">修改密码<i></i></li>
				<li class="mb20"><a class="clearfix" href="./aboutus.html">关于我们</a><i></i></li>
				<li @click="click_logout" class="center noimg">退出登录</li>
			</ul>
		</section>
		<div class="head" @click="click_change_head('1')" style="display:none" v-show="showHead==='2'">
			<img onerror="javascript:this.src='//gfs12.gomein.net.cn/T1B_CgB7CT1RCvBVdK.png'" :src="imgsrc">
		</div>
	</div>
</template>
<script type="ecma6.0">
let root = window || {},
	util = root.util || {};
import headerComponent from '../../components/HeaderComponent';
export default {
	data() {
		return {
			title: "个人设置",
			nickName:"",
			info:"",
			showHead:"1", //1hide 2show
			imgsrc:""
		}
	},
	created() {
		var self = this;
		root.localStorage.removeItem("uvr");
		root.localStorage.removeItem("uvc");
		root.localStorage.removeItem("uvp");
		root.localStorage.removeItem("uvt");
		root.localStorage.removeItem("uvo");
		util.api({
			surl: root.USER_API_PATH + "userdtal",
			type: "get",
			success(data) {
				if(data.rpco === 200){
					self.info = data.body;
					self.imgsrc = root.MB_API_PATH + 'getheader?id='+data.body["hporturl"];
				}
				
			},
			error(data){
				console.log(data)
			}
		})
		/*var self = this;
		window.onpopstate = function(){
			var href = location.href.indexOf('?') > 0 ? location.hash.substr(1,location.hash.indexOf('?')-1) : location.hash.substr(1);
			self.view = href || "loginCon"; 	
		}*/
	},
	mounted() {

	},
	methods: {
		/*getImg(id){
			let self = this;
			let url = root.USER_API_PATH + 'getheader?id=' + id;
			let xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.responseType = "blob";
			xhr.setRequestHeader("client_type", "DESKTOP_WEB");
			xhr.setRequestHeader("desktop_web_access_key", "_desktop_web_access_key");
			xhr.onload = function() {
				let img = new Image();
				if (this.status == 200 && this.response.size != 0) {
					let val = this.response;
					img.onload = function(e) {
						window.URL.revokeObjectURL(img.src);
					};
					img.src = window.URL.createObjectURL(val);
					self.imgsrc = window.URL.createObjectURL(val)
				}
			}
			xhr.send();
		},*/
		change_name(key,val){
			this[key] = val;
		},
		replace_asterisk(str,start,len){
			let asterisk = "**********";
			if(typeof str === "string"){
				if(len){
					return str.slice(0,start)+asterisk.slice(0,len)+str.slice(start+len);
				}else{
					return str.slice(0,start)+"****";
				}
			}else{
				return "";
			}
		},
		click_logout(){
			util.alert("是否取消登录",{
				title: '提示',
				txtal: 'center',
				justOk: false,
				defBtnIndex: -1,
				okBtnText: '确定',
				cancelBtnText: '取消',
				okFn(){
					util.api({
						surl:root.LOGIN_API_PATH+"lgout",
						type:"get",
						success(data){
							if(data.rpco===200){
								location.href = "./login.html";
							}else{
								util.tip(data.msg)
							}
						}
					})
				}
			});
			
		},
		click_change_head(val){
			this.showHead = val;
		},
		click_replace_phone(val){
			//缺少判断是否已绑定手机
			root.localStorage.setItem("uctype","1");
			if(val){
				util.alert("是否更换绑定手机号",{
					content: '',
					title: '提示',
					txtal: 'center',
					justOk: false,
					defBtnIndex: -1,
					okBtnText: '确定',
					cancelBtnText: '取消',
					okFn: function() {
						location.href="./changephone.html";
					}
				})
			}else{
				location.href="./changephone.html?setnew=1";
			}
		},
		click_change_pwd(val){
			root.localStorage.setItem("uctype","2");
			if(!val){
				util.tip("您需绑定手机号后，才可设置密码");
				setTimeout(function(){
					location.href="./changephone.html?setnew=1";
				},500)
			}else{
				location.href="./changephone.html";
			}
		}
	},
	components: {
		headerComponent
	}
}
</script>
<style lang="less">
	@import '../../util/fs.less';
    html{
    	background: #f3f5f7;
    }
    .head{
    	width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,.5);
		display: table;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 9999980;
		img{
			position: absolute;
			top:50%;
			left:50%;
			transform:translate(-50%,-50%);
			.px2rem(border-radius,36);
		}
    }
	.user{
		.px2rem(margin-top,88);
		li{
			.px2rem(height,88);
			.px2rem(line-height,88);
			.mixinfont(14px);
			color: #333;
			position: relative;
			background:#fff;
			a{
				width:100%;
				height:100%;
				display: block;
			}
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
			i{
				background:url(//gfs10.gomein.net.cn/T1jn_jBXVT1RCvBVdK.png) center center no-repeat;
				display: block;
				position:absolute;
				.px2rem(right,30);
				.px2rem(top,31);
				 .px2rem(height,26);
			    .px2rem(width,26);
			    background-size:auto 100%;
			    -webkit-background-size:auto 100%;
			}
			.px2remall(padding,0,30);
			&.mb20{
				.px2rem(margin-bottom,20);
			}
			&.center{
				text-align: center;
				background:#fff;
			}
			&.noimg{
				&:after{
					border:none;
				}
				span{
					margin-right:0;
				}
			}
			span{
				float: right;	
				.px2rem(height,88);
				.px2rem(margin-right,34);	
				display: block;
				img{
					.px2rem(margin-top,8);
					.px2rem(width,72);
					.px2rem(height,72);
					.px2rem(border-radius,36);
				}
			}
		}
	}
</style>