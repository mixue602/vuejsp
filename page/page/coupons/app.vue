<template>
	  <div id="coupons" class="wapper">
			 <header-component 
        :title='title'
        :rightmenus = 'rightmenus'
        @watchlist='instructions'
        >
				</header-component>
				<!-- 导航 -->
				<div class="nav-tab bdr-bottom" id="navTab">
						<template v-for="(nav, index) in navs">
								<a :class="{'cur':curCouponType==(index+1)}" :href="nav.href" :value="nav.value" :key="nav.value" @click="tabFn(nav.value)"><span>{{nav.name}}</span></a>
						</template>
				</div>
				<div class="container" :class="containerBg" ref="J_Scroll">
           	<div class="xs-container">
							<div class="xs-content">
								<!-- 内容区 -->
								<div class="iscrollpading-list">
									<ul class="content" id="list" v-show="!isNoList">
										<template v-for="(coupon, index) in coulst">
										<li class="coupon" :key="index"  @click="hrefToUrl(coupon.couat)" :class="{'red':Number(curCouponType)==1,'grey':Number(curCouponType)!=1}">
												<div class="coupon-left">
														<div class="coupon-main">
																<img class="coupon-img" src="//gfs10.gomein.net.cn/T1f_xvBbVj1RCvBVdK.png">
																<span v-if="coupon.coutp==1" class="coupon-type">管家券</span>
																<span v-else-if="coupon.coutp==2" class="coupon-type">商家劵</span>
														</div>
														<p class="coupon-tips">
																使用期限：{{coupon.coucut |formatDate }}-{{coupon.coucute |formatDate}}
														</p>
												</div>    
												<div class="coupon-right">
														<div class="coupon-price">
															<span class="txt">¥</span>
															<span class="big-txt">{{coupon.coumy/100}}</span>
														</div>
														<p v-if="Number(coupon.coumat)>0" class="counpon-tips">满{{coupon.coumat}}元可用</p>
												</div>
												<span class="coupon-icon" :class="{
													'coupon-qx':coupon.couat=='清洗',
													'coupon-wx':coupon.couat=='维修',
													'coupon-xn':coupon.couat=='虚拟',
													}"></span>
										</li>
										</template>
									</ul>
								</div>
								<div class="tuwen" v-show="isNoList">
										<div class="tu">
												<i class="i i-order"></i>
										</div>
										<p class="wen" ref="wen">暂无可用优惠券哦~</p>
								</div>
							</div>
						</div>
        </div>
        <div class="footer">
            <a href="javascript:util.href('./addcoupons.html');" class="footer-btn" alt="添加优惠券">添加优惠券</a>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import headerComponent from '../../components/HeaderComponent';

let root = window || {},
    util = root.util || {};

   
export default {
	data () {
		return {
						title: '优惠券',
					  rightmenus:{
							type:'text',
							content:'使用说明'
            },
            //选中的值 1-未使用，2-已使用，3-已过期
						curCouponType: 1,
						//是否没有优惠券提示，默认否
						isNoList:false,
						containerBg:'containerBgGrey',
						//总页数
						tpage:1,
						//当前分页,默认第一分页
						curpg:1,
						//每页的分页数量
						len:10,
            // 导航列表
            navs : [
								{name: '未使用', href: 'javascript:;', value: 1},
								{name: '已过期', href: 'javascript:;', value: 2},
                {name: '已使用', href: 'javascript:;', value: 3}
						],
            // 优惠券列表
           "coulst": []
        }
    },
    methods:{
			//使用说明
			instructions(){
					util.href('./couponsreadme.html');
			},
			//优惠券业务类型对应的跳转地址
				hrefToUrl(typeName){
					let that = this;
					//只有未使用的优惠券才能跳转
					if(Number(that.curCouponType)==1){
							switch (typeName){
								case '清洗':
										util.href('./cleanlistnew.html');
									break;
								case '维修':
										util.href('./repairindexnew.html');
									break;
								case '虚拟':
										util.href('./virtual.html');
									break;	
								default:
						}
					}
				},
				/**
				 * 获取优惠券
				 * @parma {object} 参数集合
				 * @parma {number}{1} object.coust 优惠券状态
				 * @parma {number}{1} object.curpg 当前页码
				 * @parma {number}{10} object.len 分页每次条数
				 * @parma {fucntion}{()=>{}} obj.succFn 成功后的回调函数
				 * @parma {fucntion}{()=>{}} obj.falseFn 失败后的回调函数
				 */
				getCoupons(obj){
					let that = this;
					util.api({
						//surl:'/resources/json/coupons.json',
						surl: root.MB_API_PATH + 'coupons',
						data: {
							coust: obj.coust,
							curpg: obj.curpg,
							len: obj.len
						},
						type: 'get', 
						success: function(response) {
							let rpco = response.rpco,
								body = response.body || {};
							
							//处理
							switch(rpco) {
								case 200:
									obj.succFn&&obj.succFn(body);
								break;
								//没有找到对应数据
								case 404:
									obj.falseFn&&obj.falseFn();
									break;
								default:
									obj.falseFn&&obj.falseFn();
							}
						},
						complete: function() {
							//移除提示
							util.remComShow();
						}
					}); 
				},
				/**
				 * tab切换优惠券
				 * @parma {number}{1} coust 优惠券状态
				 * 默认第一页数据
				 */
				tabFn(coust){
					let that = this;
					that.curCouponType = coust;

					//重置分页数据
					that.curpg = 1;

					//滚动到最顶部
					that.xscroll.scrollTop(0,0,'ease');

					//过去优惠券列表数据	
					that.getCoupons({
						'coust':coust,
						'curpg':that.curpg,
						'len':that.len,
						'succFn':(body)=>{
								//优惠券列表
								that.coulst = body.coulst;
								//总页数
								that.tpage = body.tpage;
								that.$nextTick(()=>{
									//重新渲染滚动插件
									that.xscroll.render();
								});
						},
						'falseFn':()=>{
							util.tip('您当前网络异常，请稍后重试');
						}
					});
				},
		    setHeadBar4(){
					GomeJSBridge.ready(function(){
						let param = {
							menus : {
								rightMenus:[
									{
										type:'callback',
										title:'使用说明',
										data:{
											id:'btn1',
											name:'使用说明',
											desc:'使用说明'
										}
									}
								]
							}
						};
						util.setHeadBar(param);
					},null);

					GomeJSBridge.onCallback(function(data){
						if(data.id == "btn1"){
							util.href('./couponsreadme.html');
						}
					});
				}
    	},
		filters: {
			  formatDate(time) {
            return util.formateDate(time, "yyyy.MM.dd");
        }
		},
		watch: {
			coulst(){
					let that = this;
					that.$nextTick(()=>{
						//重新渲染滚动插件
						that.xscroll.render();
						
						//不存在数据交互处理
						if(that.coulst.length === 0){
							that.isNoList = true;
							that.containerBg = 'containerBgWrite';

							if(that.curCouponType==1){
								$(that.$refs.wen).html('暂无可用优惠券哦~');
							}else if(that.curCouponType==2){
								$(that.$refs.wen).html('暂无已过期优惠券哦~');
							}else if(that.curCouponType==3){
								$(that.$refs.wen).html('暂无已使用优惠券哦~');
							}

						}else{
							that.isNoList = false;
							that.containerBg = 'containerBgGrey';
						}
						//分页数小于1的时候
						if(that.tpage<=1){
							that.xscroll.unplug(that.pullup);
						}else{
							that.xscroll.plug(that.pullup);
							//loading complete
							that.pullup.complete();
						}
				});
			}
		},
		created(){
			let that = this;
			this.$nextTick(() => {
				let navbar =$('.nav-tab'),
						topPos = Number(navbar.offset().top)+Number(navbar.height());
				$('.container').css({'top':topPos});
				//初始化
				that.xscroll = new XScroll({
					renderTo: that.$refs.J_Scroll,
					lockY:false
				});

				that.pullup = new XScroll.Plugins.PullUp({
						upContent:"上拉加载更多...",
						downContent:"释放加载...",
						loadingContent:"努力加载中...",
						bufferHeight:0
				});
					
				//加载触底
				that.pullup.on("loading",function(){
					that.curpg++;
		
					if(that.curpg<= that.tpage){
						that.getCoupons({
							'coust':that.curCouponType,
							'curpg':that.curpg,
							'len':that.len,
							'succFn':(body)=>{
									//优惠券列表
									body.coulst.forEach(coulst=>{
										that.coulst.push(coulst);
									})	
							},
							'falseFn':()=>{
								//更迭加载的页数
								that.curpg -= 1;
								util.tip('您当前网络异常，请稍后重试');
							}
						});
					}else{
						that.xscroll.render();
						that.pullup.complete();
						// that.xscroll.unplug(that.pullup);
						//底部加载文字处理
						$('.xs-plugin-pullup-container').html('没有更多了');
						
					}
					
				});

				//初始化加载;
				that.getCoupons({
					'coust':that.curCouponType,
					'curpg':that.curpg,
					'len':that.len,
					'succFn':(body)=>{
							//优惠券列表
							that.coulst = body.coulst;
							//总页数
							that.tpage = body.tpage;
							that.$nextTick(()=>{
								//重新渲染滚动插件
								that.xscroll.render();
							});
					},
					'falseFn':()=>{
						util.tip('您当前网络异常，请稍后重试');
					}
				});
			});
			if(util.isApp()){
				that.setHeadBar4();
			}
		},
		components:{
			headerComponent
		}
}

</script>

<style lang="less">
@import '../../util/fs.less';

.header .right div {
    .mixinfont(16px);
    color: #666666;
}
/* 公共内容区 */
.container {
    width: 10rem;
		min-width: 320px;
    background-color: #f5f5f5;
    overflow-x: hidden;
    overflow-y: auto;
    position: absolute;
		bottom: 1.306667rem /* 98/75 */;
    -webkit-overflow-scrolling: touch;
}

.containerBgGrey{
		background-color: #f5f5f5;
}
.containerBgWrite{
	background-color: #fff;
}
.nav-tab{
    height: 1.066667rem;
    line-height: 1.066667rem;
    background-color: #fff;
    text-align: center;
  
}
.nav-tab a {
    width: 33.3%;
    display: inline-block;
    color: #666;
    .mixinfont(14px);
}
.nav-tab .cur span {
    color: #FF4B41;
    position: relative;
}
.nav-tab .cur span:after {
    content: "";
    width: 100%;
    height: .026667rem /* 2/75 */;
    background-color: #FF4B41;
    position: absolute;
    left: 0;
    bottom: 0;
}
.nav-tab span {
    padding:0px .56rem /* 42/75 */;
    display: inline-block;
}

.content{
		overflow: hidden;
}
.coupon{
    display:flex;
    justify-content: center;
    position: relative;
    width: 9.2rem /* 690/75 */;
    height: 2.666667rem /* 200/75 */;
    background-color: #fff;
    border-radius: .133333rem /* 10/75 */;
    margin:.266667rem /* 20/75 */ auto 0;
    padding: .346667rem /* 26/75 */ 0 .293333rem /* 22/75 */ .266667rem /* 20/75 */;
    box-sizing:border-box;      
    -moz-box-sizing:border-box; /* Firefox */
    -webkit-box-sizing:border-box; /* Safari */                         
}

.red .coupon-type{
	color: #333;
}
.grey .coupon-type{
	color: #999;
}

.red .coupon-price{
	color: #FF4B41;
}
.grey .coupon-price{
	color: #999;
}
.red .counpon-tips{
	color: #FF4B41;
}
.grey .counpon-tips{
	color: #999;
}

/* 券的角标start */
.coupon-icon{
    position: absolute;
    top:0;
    right:0;
    width: 1.093333rem /* 82/75 */;
    height: 1.12rem /* 84/75 */;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
}
// .coupon-wmk{
//     background-image: url('http://gfs10.gomein.net.cn/T16hdvBQVj1RCvBVdK.png');
// }
// .coupon-plq{
//     background-image: url('http://gfs11.gomein.net.cn/T1pDKvB7E_1RCvBVdK.png');
// }
// .coupon-wmk-grey{
//     background-image: url('http://gfs10.gomein.net.cn/T1QLYvBbA_1RCvBVdK.png');

// }
// .coupon-plq-grey{
//  background-image: url('http://gfs12.gomein.net.cn/T18hVvB4KT1RCvBVdK.png');
// }

.red .coupon-qx{
	background-image: url('//gfs12.gomein.net.cn/T16DLvBgbT1RCvBVdK.png');
}
.grey .coupon-qx{
	background-image: url('//gfs11.gomein.net.cn/T1k__vBmEg1RCvBVdK.png');
}
.red .coupon-wx{
	background-image: url('//gfs13.gomein.net.cn/T1L_CvB7Eg1RCvBVdK.png');
}
.grey .coupon-wx{
	background-image: url('//gfs10.gomein.net.cn/T1BhbvByKg1RCvBVdK.png');
}
.red .coupon-xn{
	background-image: url('//gfs10.gomein.net.cn/T1uLWvBC_T1RCvBVdK.png');
}
.grey .coupon-xn{
	background-image: url('//gfs10.gomein.net.cn/T1Q_bvBmA_1RCvBVdK.png');
}

/* 券的角标end */


.coupon-left{
    flex:1;
    .coupon-main{
        display: flex;

        .coupon-img{
            width: 1.333333rem /* 100/75 */;
            height: 1.333333rem /* 100/75 */;
            display: inline-block;
        }
        .coupon-type{
					flex: 1;
					display: inline-block;
					.mixinfont(14px);
					line-height: 1.333333rem /* 100/75 */;
					padding-left: .293333rem /* 22/75 */;
				}
    }
    
    .coupon-tips{
			margin-top:.213333rem /* 16/75 */;
			.mixinfont(12px);
			line-height:.453333rem /* 34/75 */;
			color: #999999;
    }
}



.coupon-right{
		width:2.733333rem /* 205/75 */;
		position: relative;
    .coupon-price{
			display: flex;
			justify-content: center;
			align-items:flex-end;
			width: 100%;
			height: 1.066667rem /* 80/75 */;
			margin:.28rem 0 0.1rem 0;
			.txt{
				.mixinfont(18px);
				line-height: .666667rem /* 50/75 */;
			}
			.big-txt{
					margin-left: .093333rem /* 7/75 */;
					.mixinfont(28px);
			}
    }
    .counpon-tips{
			width:100%;
			height: .453333rem /* 34/75 */;
			line-height:.453333rem /* 34/75 */;
			text-align: center;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
			.mixinfont(12px);
		}
		&:before{
			height: 100%;
			content: '';
			width: 1px;
			border-left: 1px solid #ddd;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 10;
		}
}

.tuwen {
		.mixinfont(16px);
    line-height: .426667rem /* 32/75 */;
    width: 100%;
    background: #fff;
}
.tuwen .tu {
    width: 100rem;
    display: table-cell;
    padding-top: 1.866667rem /* 140/75 */;
    padding-bottom:.773333rem /* 58/75 */;
    vertical-align: middle;
    text-align: center;
}
.i {
    font-style: normal;
    position: absolute;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    border-radius: 2px;
}
.tuwen .tu .i {
    display: inline-block;
    position: static;
}
.tuwen .wen {
    line-height: .666667rem /* 50/75 */;
    text-align: center;
}
.i-order {
    width: 6.4rem /* 480/75 */;
    height: 5.813333rem /* 436/75 */;
    background-image: url(//gfs10.gomein.net.cn/T1.cbgBXWT1RCvBVdK.png);
}
/*loading 加载*/
.xs-plugin-pullup-container{
    width: 100%;
    text-align: center;
		.mixinfont(12px);
    line-height:1.066667rem /* 80/75 */;
}

.footer {
    width: 100%;
    height: 1.306667rem /* 98/75 */;
    background-color: #FF4B41;
    position: absolute;
    left: 0;
    bottom: 0;
}
.footer-btn {
		display: inline-block;
		width:100%;
		height: 1.306667rem /* 98/75 */;
		line-height: 1.306667rem /* 98/75 */;
		text-align: center;
		color: #FFFFFF;
		.mixinfont(18px);
}
.iscrollpading-list{
	-webkit-overflow-scrolling:touch;
}
@media (-webkit-min-device-pixel-ratio: 1.5),(min-device-aspect-ratio: 1.5){
    .coupon-right:before{
        -webkit-transform : scaleX(0.7);
        transform : scaleX(0.7);
    }
}
@media (-webkit-min-device-pixel-ratio: 2),(min-device-aspect-ratio: 2){
    .coupon-right:before{
        -webkit-transform : scaleX(0.7);
        transform : scaleX(0.7);
    }
}
</style>