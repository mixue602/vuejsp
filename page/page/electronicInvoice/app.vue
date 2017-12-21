<template>
	<div  class="wapper" :class="{'recycle-wapper':(isband && isbanded)}">
		<header-component :title= "title" :isband='isband && isbanded' @showtip="showtip"></header-component>
            <div class="scroll-box" ref="J_Scroll" v-show="containerShow"> 
            <div class="xs-container">
				<div class="xs-content">
                     <div class="lists-box" v-show="isband && isbanded" >
						<div class="lists" v-for="item in jdatalists" >
						    <div class="pub_bor liImgt">
						    	<div  class="liPic"><img :src="item.img" onerror="onerror=null;src='//img.gomegj.com/guanjiaweb/pc/book_brand2/v.png'"></div>
						    	<div class="liTit">{{ item.kpxm }}</div>
						    	<div class="liPri">
						    	    价税合计：<span class="liPri_right"><span>￥{{ parseFloat(item.invoiceAmount).toFixed(2) }}</span>
						    	</div>
						    </div>
						    <div class="pub_bor liItems">
						    	<div class="liItem">
						    		发票抬头<span>{{ item.invoiceHead }}</span>
						    	</div>
						    	<div class="liItem">
						    		开票日期<span>{{ item.invoiceDate }}</span>
						    	</div>
						    	<div class="liItem">
						    		发票号码<span>{{ item.invoiceNo }}</span>
						    	</div>
						    </div>
        			        <div class="pub_bor liBtn">
            			    	<button class="btn-right" v-show="isziCan" @click="invoiceHref(item.invoiceNo,item.orderType,item.source,item.orderId)">发票详情</button>
							    <!-- <span class="new-icon" v-show="!parseInt(item.status)"></span> -->
        			        </div>
							<!-- <li @click="invoiceHref(item.invoiceId,item.companybillLodingNo)">商品名称：<span></span></li> -->
							<img v-if='item.invoiceState==3' class="batInvoice" src="//gfs13.gomein.net.cn/T1DUKvB4Ag1RCvBVdK.png" alt="" onerror="onerror=null;src='' ">
						</div>
					</div>
					<div class="wxtip" v-show="mes">
							<p>温馨提示：</p>
							<p>点击“领取电子发票”，领取开票时预留手机号关联的电子发票；</p>
							<p>绑定会员卡后可自动获取与会员卡关联的已购商品电子发票。立即<a href="./acclist.html">绑定会员卡</a></p>
					</div>
				</div>
		    </div>
		    </div>
		<footer v-show="containerShow" class="waves" @click="goDrawInvoice($event)">领取电子发票</footer>

		<div class="noband" v-show="!isband">
			<div class="noband-box">
				<div></div>
				<h3>暂无绑定的会员卡哦~</h3>
				<p class="txtcen">亲，您还未绑定会员卡，绑定后<br/>可查看相关信息</p>
				<a href="./accinput.html?page=3">+绑定会员卡</a>
				<p>温馨提示：绑定会员卡后可自动获取全部与会员卡关联的已购商品电子发票。</p>
			</div>
		</div>
		<div class="noband" v-show="!isbanded">
			<div class="noband-box">
				<div></div>
				<h3>您暂时还没有电子发票哦~</h3>
				<a href="./invoicedraw.html">领取电子发票</a>
				<!-- <p><a href="./accinput.html?page=10">绑定会员卡</a>后可自动获取全部与会员卡关联的已购商品电子发票。</p> -->
				<p>温馨提示：</p>
				<p>点击“领取电子发票”，领取开票时预留手机号关联的电子发票；</p>
				<p>绑定会员卡后可自动获取与会员卡关联的已购商品电子发票。立即<a href="./acclist.html">绑定会员卡</a></p>
			</div>
		</div>
		<!-- <yeser-tip v-show="ifshowtip" @closetip="closetip" @closetip2="closetip2"></yeser-tip> -->
		
	</div>
</template>

<script type="ecma6.0">
import headerComponent from '../../components/HeaderComponent';
// import yeserTip from './yeserTip'
let root = window || {},
    util = root.util || {};
 
export default {
	data(){
		return{
			title:"电子发票",
			containerShow:true,
			isziCan:true,
			isNew:true,
			isband:true,
			isbanded:true,
			ifshowtip:false,
			jdatalists:[],
			imgUrl: './img/icon-fapiao.png',
			mes: false,
			 //总页数
            tpage:1,
            //当前分页,默认第一分页
            curpg:1,
            //每页的分页数量
            len:10,
		}
	},
	 watch: {
        jdatalists () {
            let that = this;
            that.$nextTick(()=>{
                
                //不存在数据交互处理
                if(that.jdatalists.length === 0){
                    that.isbanded=false;
	            	that.containerShow=false;
                    that.xscroll.unplug(that.pullup);
                    $('.xs-plugin-pullup-container').hide();
                }
                else if(that.jdatalists.length > 0 && that.jdatalists.length < 10){
                	that.mes = true;
                	//重新渲染滚动插件
                    that.xscroll.render();
                    //loading complete
                    that.pullup.complete();
                	// that.xscroll.unplug(that.pullup);
                	$('.xs-plugin-pullup-container').hide();
                	$.each(that.jdatalists,(index,val)=>{
		            				//开票日期
		            				val.invoiceDate = util.formateDate(val.invoiceDate,'yyyy-MM-dd');
                                    //多个商品时 对名称进行拼接
                                    val.kpxm = '';
                                    // 多个商品时对价格进行累加
		            				// val.jshj = null;
		            				$.each(val.invoiceItems,(key,value)=>{
		            					//防止页面显示null
		            					if(!value.mainName){
		            						value.mainName = '';
		            					}else if(!value.name){
		            						value.name = '';
		            					}
                                        val.kpxm = val.kpxm+ ' ' + value.mainName+ ' ' +value.name ;
                                        // val.jshj = val.jshj + value.salePrice ;
                                        //图片地址，默认显示第一张
                                        if(key==0&&value.img){
                                        	val.img = value.img
                                        }
                                        else if(key==0&&!value.img){
                                        	val.img = '//img.gomegj.com/guanjiaweb/pc/book_brand2/v.png';
                                        }
		            				});
		            })

                }
                else{
                	//重新渲染滚动插件
                    that.xscroll.render();
                    //loading complete
                    that.pullup.complete();
                    that.xscroll.plug(that.pullup);
                    that.isband=true;
                    $.each(that.jdatalists,(index,val)=>{
		            				//开票日期
		            				val.invoiceDate = util.formateDate(val.invoiceDate,'yyyy-MM-dd');
                                    //多个商品时 对名称进行拼接
                                    val.kpxm = '';
                                    // 多个商品时对价格进行累加
		            				// val.jshj = null;
		            				$.each(val.invoiceItems,(key,value)=>{
		            					//防止页面显示null
		            					if(!value.mainName){
		            						value.mainName = '';
		            					}else if(!value.name){
		            						value.name = '';
		            					}
                                        val.kpxm = val.kpxm+ ' ' + value.mainName+ ' ' +value.name ;
                                        // val.jshj = val.jshj + value.salePrice ;
                                        //图片地址，默认显示第一张
                                        if(key==0&&value.img){
                                        	val.img = value.img
                                        }
                                        else if(key==0&&!value.img){
                                        	val.img = '//img.gomegj.com/guanjiaweb/pc/book_brand2/v.png';
                                        }
                                        console.log(that.jdatalists)
		            				});
		            })

                }
            });
        }
	},
	created(){
		if(util.isApp()){
     	    util.deleteHeadBtn();
     	}
        let that = this;
        this.$nextTick(() =>  {
            that.xscroll = new XScroll({
                renderTo: that.$refs.J_Scroll,
                lockY:false
            });
            that.pullup = new XScroll.Plugins.PullUp({
                upContent:"上拉加载更多...",
                downContent:"释放加载...",
                loadingContent:"加载中...",
                bufferHeight:0
            });
            that.xscroll.plug(that.pullup);
            //加载触底
            that.pullup.on("loading",function(){
                that.curpg++;
                if(that.curpg<= that.tpage){
                    that.getlists({
                        'curpg':that.curpg,
                        'size':that.len,
                        'succFn':(body)=>{
                            //优惠券列表
                            body.eilist.forEach(eilist=>{
                                that.jdatalists.push(eilist);
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
                    that.mes = true;
                    $('.xs-plugin-pullup-container').remove();

                }

            });
            that.getlists({
                'curpg':that.curpg,
                'succFn':(body)=>{
                    //列表
                    that.jdatalists = body.eilist;
                    //总页数 totalPageNum
                    that.tpage = body.pager.totalPage;
                },
                'falseFn':()=>{
                    //更迭加载的页数
                    that.curpg -= 1;
                    util.tip('您当前网络异常，请稍后重试');
                }
            });
        });
    },
	methods:{
		/*初始化页面显示列表*/
		getlists(obj){
			let that = this;

            // debug start
            // var res = {"rpco":200,
       				 //   "tsrp":1511513216675,
       				 //   "body":{
       				 //       "pager":{"currentPage":1,"pageSize":10,"totalPage":10,"totalSize":100},
       				 //       "eilist":[
       				 //             {
       				 //              // 用户id
       				 //              "userId":"1111",
				   
       				 //              "cardNo":"2222222",
       				 //              "mobile":"12345678",
       				 //              "pullType":null,
       				 //              "orderType":1,
       				 //              "orderId":"123456789",
       				 //              "shippingGroupId":"09876543",
       				 //              "invoiceNo":"123322321312323",
       				 //              "taxpayerIdNum":"88888888",
       				 //              "invoiceType":2,
       				 //              "invoiceMediaType":null,
       				 //              "invoiceHeadType":null,
       				 //              "invoiceHead":"国美电器有限公司",
       				 //              "invoiceContent":null,
       				 //              "invoiceState":"3",
       				 //              "invoiceDate":1511513216675,
       				 //              "invoiceAmount":5000.0,
       				 //              "invoiceURL":"http://123.pdf",
       				 //              "invoiceImgUrl":"http://123.jpg",
       				 //              "invoiceItems":[{
       				 //                    "num":null,
       				 //                    "type":null,
       				 //                    "img":"http://123.jpg",
       				 //                    "name":"商品名称1",
       				 //                    "salePrice":5000.0,
       				 //                    "skuId":null,
       				 //                    "skuNo":null,
       				 //                    "categoryId":null,
       				 //                    "brandId":null,
       				 //                    "model":null,
       				 //                    "mainName":"主商品名称1"},
       				 //                    {
       				 //                    "num":null,
       				 //                    "type":null,
       				 //                    "img":"http://123.jpg",
       				 //                    "name":"商品名称2",
       				 //                    "salePrice":5000.0,
       				 //                    "skuId":null,
       				 //                    "skuNo":null,
       				 //                    "categoryId":null,
       				 //                    "brandId":null,
       				 //                    "model":null,
       				 //                    "mainName":"副的商品名称"}]
       				 //              }]
       				 //          }
       				 //    };
            //         let rpco=res.rpco;
	           //  	let body=res.body;
	           //  	switch(rpco){
	           //  		case 200:
	            			
	           //  			if(body.eilist.length>0){
	           //  				that.isband=true;
	           //  				$.each(body.eilist,(index,val)=>{
		          //   				//开票日期
		          //   				val.invoiceDate = util.formateDate(val.invoiceDate,'yyyy-MM-dd');
            //                         //多个商品时 对名称进行拼接
            //                         val.kpxm = '';
            //                         // 多个商品时对价格进行累加
		          //   				val.jshj = null;
		          //   				$.each(val.invoiceItems,(key,value)=>{
            //                             val.kpxm = val.kpxm+ ' ' + value.mainName ;
            //                             val.jshj = val.jshj + value.salePrice ;
		          //   				});
		            				

		          //   				console.log(val.kpxm)
		          //   			})
		          //   			that.jdatalists=body.eilist;
	           //  			}else{
	           //  				that.isbanded=false;
	           //  				that.containerShow=false;
	           //  			}
	            			
	           //  		break;
	           //  		case 404:
	           //  			that.isbanded=false;
	           //  			that.containerShow=false;
	           //  		default:
	           //  			that.isbanded=false;
	           //  			that.containerShow=false;
	           //  	}
            // debug end
            

			util.api({
				surl:root.EINVOICE_API_PATH +"list?tt=",
	            data:{
                    curpg:that.curpg
				},
                type:'get',
	            success: function(res) {
	            	let rpco=res.rpco;
	            	switch(rpco) {
						 case 200:
                             if(obj.succFn&&res.body){
                             	obj.succFn(res.body)
                             }else{
                             	that.isbanded=false;
	            				that.containerShow=false;
                             }
						 break;
                         case 404:
							 that.isbanded=false;
	            			 that.containerShow=false;
                             break;
						 default:
						     that.isbanded=false;
	            			 that.containerShow=false;
						 util.tip('请求失败');
					 }
	            },
	            error: function(res) {
	            }
	        });
		},
		_getAcclist(){
			let that = this;
			util.api({
	            surl:root.MB_API_PATH + 'acclist',
	            type: 'get',
	            success: function(res) {
	            	let rpco=res.rpco;
	            	let body=res.body;
	            	switch(rpco){
	            		case 200:
	            			if(body.aclist.length>0){
	            				// that.isbanded = false;
	            				
	            			}else{
	            				that.nobind = true;
	            			}
	            		break;
	            		case 404:
	            			that.nobind = true;
	            		default:
	            			that.nobind = true;
	            	}
	            },
	            error: function(res) {
	            }
	        });
		},
		/*查看详情*/
		invoiceHref(invoiceNo,orderType,orderSource,orderId){	
			util.href("./invoicedetail.html",{
				invoiceId:invoiceNo,
				orderType:orderType,
				orderSource:orderSource,
				orderId: orderId,
				epage:1
			})
		},
		// 显示筛选弹层
		showtip(flag){
		    this.ifshowtip=flag;
		    if(this.ifshowtip){
		    	// 禁止底层页面滑动
				$("html").addClass("noscroll");
		    }else{
		    	$("html").removeClass("noscroll");
		    }
		},
		// 关闭筛选弹层并且重新请求
		// closetip(flag,val){
		// 	this.ifshowtip=flag;
		// 	let tt="";
		// 	switch(val){
		// 		case "3个月内":
		// 			tt=1
		// 		break;
		// 		case "6个月内":
		// 			tt=2
		// 		break;
		// 		case "2017年":
		// 			tt=3
		// 		break;
		// 	}
		// 	this.getlists(tt)
		// 	$("html").removeClass("noscroll");
		// },
		// closetip2(flag){
		// 	this.ifshowtip=flag;
		// 	if(this.ifshowtip){
		//     	// 禁止底层页面滑动
		// 		$("html").addClass("noscroll");
		//     }else{
		//     	$("html").removeClass("noscroll");
		//     }

		// },
		//跳转到领取电子发票页面
		goDrawInvoice(ev){
			util.href('invoicedraw.html')
		}
	},
	components: {
		headerComponent,
		// yeserTip
	}
}
</script>
<style lang="less">
	@import '../../util/fs.less';
	html,body,.wapper,.scroll-box{
		width: 100%;
		height: 100%;
		box-sizing: border-box;
	}
	body{
		background-color: #F3F5F7;
	}
	.wapper{
        width: 10rem;
	}
	.recycle-wapper{
		padding-bottom: 1.306667rem;
	}
	.lists-box{
		overflow-x: hidden;
		background-color: #F3F5F7;
	}
	
	.lists{
		width:100%;
		min-height:5.626667rem;
		background:#ffffff;
		padding:0 0.36rem;
		position: relative;
		margin-bottom:0.266667rem;
		box-sizing: border-box;
		.pub_bor{
			padding:0.266667rem 0;
		}
		.pub_bor:not(:last-of-type){
			width:100%;
			border-bottom: 1px solid rgba(227,227,227,.4);
		}
		.liImgt{
			min-height:2.266667rem;
			padding:0.266667rem 0 0.266667rem 1.733333rem;
			position:relative;
			box-sizing: border-box;
			.liPic{
				width:1.733333rem;
				height:1.733333rem;
				border: 1px solid rgba(227,227,227,.5);
				position:absolute;
				left:0;
				top:0.266667rem;
				overflow: hidden;
				img{
					width:100%;
					height: 100%;
				}
			}
			.liTit{
				padding:0 0.36rem;
				color:#000;
				line-height:0.48rem;
				font-size: 0.426667rem;
				/*overflow: hidden;*/
			    /*text-overflow: ellipsis;*/
			    /*white-space: nowrap;*/
			    vertical-align: bottom;
			    /*超出两行显示省略号*/
                overflow : hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
			}
			.liPri{
				padding:0 0.36rem;
                line-height:0.48rem;
                font-size:0.346667rem;
                color:#666666;
                position: absolute;
    			bottom: .26rem;
			}
			.liPri_right{
				color:#FF4B41;
			}

		}
		.liItems{
            .liItem{
            	color:#999999 ;
            	font-size:0.346667rem;
            	text-align:left;
            	line-height:0.533333rem;
            }
            span{
            	float:right;
            	color:#000;
            }
		}
		.liBtn{
			height: 1.266667rem;
			box-sizing: border-box;
            button{
				width:1.933333rem;
				height:0.733333rem;
				background:#fff;
				border:1px solid #ff4b46;
				border-radius:5px;
				color:#ff4b46;
				font-size:.32rem;
				float:right;
				&.bat{
					color:#ccc;
					border:1px solid #ccc;
				}
			}
		}

		.new-icon{
			position: absolute;
			width:.66666666rem;
			height:.37333333rem;
			top: .35rem;
            right: .5rem;
			background:url(./img/new.png) no-repeat;
			background-size:100% 100%;
		};
		.batInvoice{
			position: absolute;
			top: 0.7rem;
			right: 0.64rem;
			width:2.213333rem;
			height: 2.08rem;
		}
	}
	.noband{
		width:100%;
		height:100%;
		background:#fff;
		padding-top:2.18666666rem;
		box-sizing:border-box;
		.noband-box{
			width: 100%;
			max-width: 10rem;
			margin: 0 auto;
			div{
				margin-left:4.16rem;
				width:1.69333rem;
				height:1.333333rem;
				background: url('./img/icon-fapiao.png') no-repeat;
				background-size:100% 100%;
			}
			h3{
				color:#333333;
				text-align:center;
				font-weight: normal;
				.mixinfont(14px);
				margin-top:.5866666rem;
			}
			&>a{
				display: block;
				line-height: 1.173333333rem;
				text-align: center;
				width:7.866667rem;
				height:1.173333333rem;
				border-radius:0.8rem;
				background:#ff4b46;
				color:#fff;
				margin:1.06666666rem 0 0.533333333rem 1.066667rem;
				.mixinfont(16px);
			}
			p{
				a {
					color:#6593DB;
					text-decoration:underline !important;
				};
				&.txtcen{
					text-align: center;
				};
				width: 8.64rem;
				line-height: .57333333rem;
				color: #777777;
				margin-left: 0.533333333rem;
				margin-top: 0.1333333rem;
			}
		}
		
	}
	.wxtip{
		color:#777777;
		font-size:.30666666rem;
		line-height:.6133333rem;
		margin-left:.30666666rem;
		a{
			color:#4A90E2;
			text-decoration: underline!important;
		}

	}
	footer{
		position: fixed!important;
		left: 0;
		bottom: 0;
		z-index: 9999;
		width: 100%;
		height: 1.306667rem;
		line-height: 1.306667rem;
		text-align: center;
		background-color: #E0E0E0;
		color: #fff;
		.mixinfont(16px);
		background-color: #ff4b46;
	}
	/*loading 加载*/
	.xs-plugin-pullup-container{
	    width: 100%;
	    text-align: center;
			.mixinfont(12px);
	    line-height:1.066667rem /* 80/75 */;
	}
</style>