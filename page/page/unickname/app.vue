<!-- huangyihai -->
<template>
	<div>
		<header-component @watchlist="watchlist" :title="title" :rightmenus="rightmenus"></header-component>
		<section class="setname" ref="setname">
			<div class="name">
				<input ref="name" @blur="blur_input" @focus="focus_input" type="text" maxlength="20" name="name" placeholder="请输入您的昵称" v-model="name">
				<span @click="click_phone_null" :class="['del',phoneError?'active':'']" style="display:none" v-show="name.length>0"></span>
			</div>
			<p>4-20字符，可由汉字、字母、数字或“_”、“-”组成</p>
		</section>
	</div>
</template>
<script type="ecma6.0">
let root = window || {},
	util = root.util || {};
import headerComponent from '../../components/HeaderComponent';
export default {
	data() {
		return {
			title:"设置昵称",
			name:"",
			phoneError:false,
			rightmenus:{type:"text",content:"保存"}
		}
	},
	created() {
	},
	mounted() {
		var self = this;
		self.$nextTick(function () {
		    if(util.isApp()){
				GomeJSBridge.ready(function(){
			        var param = {
			            title :'设置昵称',
			            menus : {
			                rightMenus:[
			                    {
			                        type:'callback',
			                        title:'保存',
			                        icon:'',
			                        data:{
			                            id:'submit',
			                            name:'保存按钮',
			                            desc:'保存按钮'
			                        }
			                    }               
			                ]
			            }
			        } 
			        GomeJSBridge.setHeadBar(function(data){
			            console.log(data)
			        },function(err){
			            console.log(err)
			        },param)
			    },null)
			    GomeJSBridge.onCallback(function(data){
			        if(data.id == "submit"){
			            self.watchlist();
			        }
			        console.log(data)
			    })
				self.$refs.setname.style.marginTop = "10px";
			}
	    })
	},
	methods: {
		click_phone_null(){
			this.name = "";
		},
		focus_input(){
			this.$refs.name.setAttribute("placeholder","");
		},
		blur_input(){
			this.$refs.name.setAttribute("placeholder","请输入您的昵称");
		},
		watchlist(){
			var self = this;
			if(self.name===""){
				util.tip("请录入信息后重新提交");
				return ;
			}
			if(util.getStrLength(self.name)<4||util.getStrLength(self.name)>20){
				util.tip("您的昵称格式不正确");
				return ;
			}
			util.api({
				surl:root.USER_API_PATH+"modudtal",
				type:"post",
				data:{mod:1,nick:self.name},
				success(data){
					if(data.rpco === 200){
						if(util.isApp()){
							GomeJSBridge.popWindow();
						}else{
							location.href="./user.html";
						}
					}else if(data.rpco === 40012){
						util.tip("您的昵称格式不正确");
					}else{
						util.tip(data.msg);
					}
				}
			})
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
	.setname{
		.px2rem(margin-top,108);
		.name{
			.px2rem(height,89);
			.px2rem(line-height,89);
			background: #fff;
			width:100%;
			.px2rem(padding-left,29);
			.px2rem(padding-right,64);
			.px2rem(margin-bottom,20);
			box-sizing: border-box;
			position: relative;
			input{
				width: 100%;
				.mixinfont(14px);
				.px2rem(height,42);
				.px2rem(line-height,42);
				color:#333;
			}
			span{
				position:absolute;
				right:0;
				top: 0;		
				display: block;
				background: url(//gfs11.gomein.net.cn/T1c_xvBsZj1RCvBVdK.png) center center no-repeat;
				background-size: (32/75)*1rem auto;
				.px2rem(width,64);
				.px2rem(height,89);
				&.active{
					background: url(//gfs11.gomein.net.cn/T1.LYvBTKj1RCvBVdK.png) center center no-repeat;
					background-size: (32/75)*1rem auto;
				}
			}
		}	
		p{
			.px2rem(padding-left,29);
			color:#777777;
			.mixinfont(12px);
		}
	}	
</style>