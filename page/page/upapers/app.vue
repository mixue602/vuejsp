<template>
	<div>
		<header-component :rightmenus="rightmenus" @watchlist="watchlist($event)" :title="title"></header-component>
		<transition name="component-fade">
		    <section v-bind:key="view" v-if="view==='papers'" class="papers-content">
				<ul class="papers-list">
					<li v-for="item in items" class="idcard" >
						<dl>
							<dt class="clearfix">
								<span class="user">户口本</span>
								<span style="display:none" v-show="delStatus" class="del clearfix"><i></i></span>
							</dt>
							<dd class="clearfix">
								<span class="name">身份证</span>
								<span class="text">14****asdasdsadas</span>
							</dd>
						</dl>
					</li>
				</ul>
				<ul class="add" v-show="addShow===1" style="display:none">
					<li class="add-list" @click="click_add_papers">添加证件</li>
					<li class="add-list" @click="click_show_del">删除证件</li>
				</ul>
				<div style="display: none" v-show="items.length<1" class="no-papers">
					<p class="mesage">您尚未添加任何证件！</p>	
					<p class="tip">系统会对您上传的证件信息加密保存</p>
					<div class="add-papers">
						<p @click="click_add_papers"><span><i>+</i>添加证件</span></p>
					</div>
				</div>
			</section>
		</transition>
		<transition name="component-fade">
			<add-papers :existList="existList" @change="change" v-bind:key="view" v-if="view==='addpapers'"></add-papers>
		</transition>
	</div>
</template>
<script type="ecma6.0">
let root = window || {},
	util = root.util || {};
import headerComponent from '../../components/HeaderComponent';
import addPapers from './addpapers';
export default {
	data() {
		return {
			title: "证件",
			rightmenus: {
				content: "//gfs11.gomein.net.cn/T1pQhvBTY_1RCvBVdK.png"
			},
			addShow: 0,
			items: [],
			delStatus: 0,
			view: "papers",
			papersType: 0,
			existList: [] //证件列表已存在的证件
		}
	},
	created() {
		var self = this;
		self.getList();
		
		document.onclick = function(e) {
			e = event || e;
			var classname = e.target.classame;
			if (self.addShow === 1) {
				if (classname != "add" && classname != "add-list") {
					self.addShow = 0;
				}
			}
		}
		window.onpopstate = function() {
			self.change_view();
		}
		this.change_view();
	},
	mounted() {},
	methods: {
		change_view() {
			var href = location.href.indexOf('?') > 0 ? location.hash.substr(1, location.hash.indexOf('?') - 1) : location.hash.substr(1);
			this.view = href || "papers";
			if(this.view === "papers"){
				this.change_header(true);
			}			
		},
		watchlist() {
			event.cancelBubble = true;
			this.addShow = 1;
			this.papersType = 0;
		},
		getList() {
			var self = this;
			util.api({
				surl: root.USER_API_PATH + "certifilist",
				type: "get",
				success(data) {
					if(data.rpco === 200){
						self.items = data.body["celist"];
					}
					console.log(data)
				}
			})
		},
		handleExistList(arr){
			var self = this;
			if(arr.length>0){
				for(var i=0,len =arr.length;i<len;i++){
					self.existList.push(arr[i].cetp)
				}
			}
		},
		change(key, val) {
			if (key === "view") {
				history.pushState({}, "","#"+val);
			}
			this[key] = val;
		},
		click_add_papers() {
			this.change("view", "addpapers");
			this.change_header(false);
			this.addShow = 0;
		},
		change_header(val){
			if(!val){
				this.title = "添加证件";
				this.rightmenus = "";
			}else{
				this.title = "证件";
				this.rightmenus = {
					content: "//gfs11.gomein.net.cn/T1pQhvBTY_1RCvBVdK.png"
				};
			}
		},
		click_show_del() {
			this.addShow = 0;
			this.delStatus = 1;
			/*util.api({
				surl:root.USER_API_PATH+"modcertifi",
				type:"post",
				success(data){
					console.log(data)
				}
			})*/
		}
	},
	components: {
		headerComponent,
		addPapers
	}
}
</script>
<style lang="less">
	@import '../../util/fs.less';
	html{
    	background: #f5f5f5;
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
	.papers-content{
		.px2rem(margin-top,88);
		position: relative;
		background:#fff;
		.papers-list{
			.px2rem(margin-left,24);
			li{
				.px2rem(padding-top,30);
				.px2rem(padding-bottom,30);
				.px2rem(height,74);
				.px2rem(padding-left,104);
				position: relative;
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
				&:last-child{
					border-bottom:none;
				}
				&.idcard{
					background: url(//gfs13.gomein.net.cn/T1PDWvB4Dj1RCvBVdK.png) no-repeat left center;
					.px2remall(background-size,80,80);
				}
				&.resident{
					background: url(//gfs12.gomein.net.cn/T1L_WvBTCg1RCvBVdK.png) no-repeat left center;
					.px2remall(background-size,80,80);
				}
				&.passport{
					background: url(//gfs12.gomein.net.cn/T1nQDvBCJT1RCvBVdK.png) no-repeat left center;
					.px2remall(background-size,80,80);
				}
				&.Officer{
					background: url(//gfs10.gomein.net.cn/T1m_WvBThg1RCvBVdK.png) no-repeat left center;
					.px2remall(background-size,80,80);
				}
				&.soldiers{
					background: url(//gfs11.gomein.net.cn/T1XiJvBsCv1RCvBVdK.png) no-repeat left center;
					.px2remall(background-size,80,80);
				}
				&.gang{
					background: url(//gfs11.gomein.net.cn/T1IfEvB7Yg1RCvBVdK.png) no-repeat left center;
					.px2remall(background-size,80,80);
				}
				&.tai{
					background: url(//gfs13.gomein.net.cn/T1MiZvBg_v1RCvBVdK.png) no-repeat left center;
					.px2remall(background-size,80,80);
				}
				&.temporary{
					background: url(//gfs13.gomein.net.cn/T1aQZvBvdv1RCvBVdK.png) no-repeat left center;
					.px2remall(background-size,80,80);
				}
				&.police{
					background: url(//gfs12.gomein.net.cn/T1LfhvBmY_1RCvBVdK.png) no-repeat left center;
					.px2remall(background-size,80,80);
				}
				&.foreign{
					background: url(//gfs11.gomein.net.cn/T1pDWvBKCj1RCvBVdK.png) no-repeat left center;
					.px2remall(background-size,80,80);
				}
				span{
					float: left;
				}
				.user{
					.mixinfont(16px);
					.px2rem(width,244);
					color: #333;	
				}
				.name{
					.mixinfont(14px);
					.px2rem(width,244);
					color: #777;	
				}
				.del{
					.px2rem(width,350);
					i{
						display:block;
						float:right;
						.px2rem(width,32);
						.px2rem(height,32);
						background: url(//gfs11.gomein.net.cn/T1c_xvBsZj1RCvBVdK.png) no-repeat right center;
						.px2remall(background-size,32,32)
					}
				}
				.text{
					text-align: right;
					.px2rem(width,350);
					.mixinfont(14px);
					color: #333;
				}
			}
		}
		.add{
			position:absolute;
			.px2rem(top,16);
			.px2rem(right,10);
			.px2rem(width,276);
			.px2rem(height,176);
			background:rgba(51,51,51,.9);
			.px2rem(border-radius,10);
			z-index: 2;
			&:before{
				content: "";
				z-index: 1;
				position: absolute;
				.px2rem(width,0);
				.px2rem(height,0);
				.px2rem(top,-10);
				.px2rem(right,24);
			    border: (10/75)*1rem solid rgba(51,51,51,.9);
			    border-right-color: transparent;
			    border-bottom-color: transparent;
				-webkit-transform: rotate(45deg);
		   		transform: rotate(45deg);
			}
			li{
				.px2remall(margin,0,24);
				.px2rem(height,82);
				.px2rem(line-height,82);
				color: #fff;
				.px2rem(padding-left,52);
				.mixinfont(13px);
				&:first-child{
					background:url(//gfs10.gomein.net.cn/T13QEvBmWj1RCvBVdK.png) (5/75)*1rem center no-repeat;
					.px2remall(background-size,27,32);
					.px2remall(-webkit-background-size,27,32);
				}
				&:last-child{
					background:url(//gfs12.gomein.net.cn/T1_QhvB4bg1RCvBVdK.png) left center no-repeat;
					.px2remall(background-size,32,32);
					.px2remall(-webkit-background-size,32,32);
				}
			} 	
		}
		.no-papers{
			.px2rem(padding-top,172);
			.mesage{
				.px2rem(padding-top,138);
				background: url(//gfs10.gomein.net.cn/T11uhvBm__1RCvBVdK.png) no-repeat top center;
				.px2remall(background-size,130,92);
				.px2remall(-webkit-background-size,130,92);
				color: #333;
				.mixinfont(16px);
				.px2rem(margin-bottom,20);
				text-align: center;
			}
			.tip{
				.mixinfont(12px);
				color:#777;
				text-align: center;
			}
		}
		.add-papers{
			.px2rem(margin-top,60);
			.px2remall(padding,0,40);
			.px2rem(height,128);
			box-sizing: border-box;
			background:#fff;
			p{
				.px2rem(height,88);
				.px2rem(line-height,88);
				text-align: center;
				background:#FF4B41;
				color:#fff;
				width: 100%;
				.px2rem(margin-top,20);
				.px2rem(border-radius, 10);
				text-align: center;
				i{
					.mixinfont(18px);
				}
			}
		}
	}	
</style>