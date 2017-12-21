<template>
	<div class="wapper virtual-wapper" >
		<!-- 公共头部 -->
		<header-component :title="title"></header-component>
		<!--<div class="header-right" @click="helpInfo">帮助</div>-->
		<!--<div class="banner"><a href="http://wap.gomegj.com/v2/couponsactive.html?tle=gm"><img src="//gfs12.gomein.net.cn/T1C9EvBXxg1RCvBVdK.jpg" alt=""></a></div>-->
		<!--virbrd-bot-->
		<div class="wrap-box bdr-bottom">
			<input type="tel" @focus="fotsta" @blur="fotabs" class="moblie" id="number" v-model="moblie" maxlength="13" placeholder="请输入充值号码">
			<!--<span class="moblie-bg"></span>-->
		</div>
		<div class="wrap-box list-box">
			<ul class="price-list">
				<li v-for="(item,index) in priceList" :class="['bdr-all',item.flag ? 'checked' : '']" v-show="item.goodsStandardPrice != 0 ">
					<div class="price-item waves" @click="checkPrice($event,item)">
						<p class="show">{{ item.goodsStandardPrice/100  }}元</p>
						<p class="practical">{{ item.goodsSellPrice | formatMoney }}</p>
					</div>
				</li>
			</ul>
			<div class="virtual-tip">手快速充值1-10分钟到账<a href="javascript:;" class="help-rig" @click="helpInfo">帮助</a></div>
		</div>
		<div class="virfooter">
			<a href="./orderall.html?odcate=0" class="bdr-r"><span>我的订单</span></a><a class="bdr-r" href="./recyclebrand.html?cateid=12&catenm=%E6%89%8B%E6%9C%BA&arcode=110108"><span>手机换钱</span></a><a class="bdr-r" href="./repairindexnew.html"><span>家电维修</span></a><a href="./index.html"><span>更多服务</span></a>
		</div>
		<!--<div class="virtual-footer-nav">
            <a href="./orderall.html"><i class=""></i><span>我的订单</span></a>
            <a href="./recyclebrand.html?cateid=12&catenm=%E6%89%8B%E6%9C%BA&arcode=110108"><span>手机换钱</span></a>
            <a href="./repairindexnew.html"><span>家电维修</span></a>
            <a href="./index.html"><span>更多服务</span></a>
        </div>
		<div class="virtual-footer">
			<div class="virtual-footer-left" v-show="params.orderAmount != 0">
				<span class="price-1">应付：</span>
				<span class="price-2">&yen</span>
				<span class="price-3">{{ comCgcpInt }}.<i>{{ comCgcpFloat }}</i></span>
			</div>
			<div class="virtual-footer-right" :class="params.orderAmount == 0 ? 'vir-opacity':''" @click="save">去支付</div>
		</div>-->
	</div>
</template>

<script type="text/ecmascript-6">
import headerComponent from '../../components/HeaderComponent'
/*import recycle from './virtual.vue'*/
let root = window || {},
    util = root.util || {};
export default {
	data () {
		return {
			hrefParma:{},
			title:"手机充值",
			body: {},
			moblie: '',
			cgcp: 0,
			priceList: [],
			params: {
                "goodsId": "",
                "goodsNum": 1,
                "mob": '',
                "orderAmount": 0,
                "subType": 71,
                "type": 7,
				"orderOriginId": ''
            },
            // 请求状态，用于ajax请求
            requestState: {
                createOrder: true
            }
		}
	},
	created() {

	},
	filters: {
		formatMoney: function(value) {
		    if(value == '') {
		        return '';
		        return false;
			}
		    return '售价：' + (value/100).toFixed(2);
		}
	},
    computed: {
        // 现价价格整数计算
        comCgcpInt () {
            let that = this;
            return parseInt(that.params.orderAmount/100);
        },
        // 现价价格小数计算
        comCgcpFloat () {
            let that = this,
                cgcp = String((that.params.orderAmount/100).toFixed(2));
            return cgcp.substring(cgcp.length-2);
        }
	},
    mounted: function() {
        this.$nextTick(function () {
            this.init();
           	this.addEvent();
        });
    },
	methods: {
		init: function() {
			var that = this;
            if(util.isApp()){
                util.deleteHeadBtn();
            }
			that.priceList = [
				{
                    'goodsStandardPrice': 1000,
                    'goodsSellPrice': ''
                },
                {
                    'goodsStandardPrice': 2000,
                    'goodsSellPrice': ''
                },
                {
                    'goodsStandardPrice': 3000,
                    'goodsSellPrice': ''
                },
                {
                    'goodsStandardPrice': 5000,
                    'goodsSellPrice': '',
                    'flag': false
                },
                {
                    'goodsStandardPrice': 10000,
                    'goodsSellPrice': ''
                },
                {
                    'goodsStandardPrice': 20000,
                    'goodsSellPrice': ''
                },
                {
                    'goodsStandardPrice': 30000,
                    'goodsSellPrice': ''
                },
                {
                    'goodsStandardPrice': 50000,
                    'goodsSellPrice': ''
                }
			]
		},
		checkPrice: function(event,item) {
			var that = this;
            var iphone = that.trimAll(that.moblie,'g');
            if(!(/^1[34578]\d{9}$/.test(iphone))){
                util.tip('请输入正确的手机号');
                return false;
            }
            ripple(event);
            $.each(that.priceList,function(k,v){
                that.$set(v,'flag',false);
            });
            //参数赋值
            that.params.goodsId = item.goodsCategoryCode;
            that.params.mob = iphone;
            that.params.orderAmount = item.goodsSellPrice;

            that.save();
            //item.flag = !item.flag;
		},
		//获取实际价格
		getPrice: function() {
            var that = this, iphone;
            var str = that.moblie;
            that.moblie = str.replace(/-/g,' ');
            iphone = that.trimAll(that.moblie,'g');
            if(iphone.length != 11) {
                return false;
			}
            if(!(/^1[34578]\d{9}$/.test(iphone))){
               	util.tip('手机号码有误，请重新填写');
                return false;
            }
			//debug start
				/*var res={ "body":{
								"brandId": "string",
								"brandName": "string",
								"homeLocalCode": 0,
								"homeLocalName": "string",
								"items": [
									{
										"costPriceUnit": 0,
										"goodsCategoryCode": "string",
										"goodsCategoryName": "string",
										"goodsCostPrice": 1000,
										"goodsSellPrice": 0,
										"goodsStandardPrice": 1000,
										"goodsSupplyCount": 0,
										"isDefault": 0
									},
									{
										"costPriceUnit": 0,
										"goodsCategoryCode": "string",
										"goodsCategoryName": "string",
										"goodsCostPrice": 2000,
										"goodsSellPrice": 0,
										"goodsStandardPrice": 2000,
										"goodsSupplyCount": 0,
										"isDefault": 0
									},
									{
										"costPriceUnit": 0,
										"goodsCategoryCode": "string",
										"goodsCategoryName": "string",
										"goodsCostPrice": 3000,
										"goodsSellPrice": 0,
										"goodsStandardPrice": 3000,
										"goodsSupplyCount": 0,
										"isDefault": 0
									},
									{
										"costPriceUnit": 0,
										"goodsCategoryCode": "string",
										"goodsCategoryName": "string",
										"goodsCostPrice": 4980,
										"goodsSellPrice": 0,
										"goodsStandardPrice": 5000,
										"goodsSupplyCount": 0,
										"isDefault": 0
									},
									{
										"costPriceUnit": 0,
										"goodsCategoryCode": "string",
										"goodsCategoryName": "string",
										"goodsCostPrice": 1000,
										"goodsSellPrice": 0,
										"goodsStandardPrice": 1000,
										"goodsSupplyCount": 0,
										"isDefault": 0
									},
									{
										"costPriceUnit": 0,
										"goodsCategoryCode": "string",
										"goodsCategoryName": "string",
										"goodsCostPrice": 1000,
										"goodsSellPrice": 0,
										"goodsStandardPrice": 1000,
										"goodsSupplyCount": 0,
										"isDefault": 0
									},
									{
										"costPriceUnit": 0,
										"goodsCategoryCode": "string",
										"goodsCategoryName": "string",
										"goodsCostPrice": 1000,
										"goodsSellPrice": 0,
										"goodsStandardPrice": 1000,
										"goodsSupplyCount": 0,
										"isDefault": 0
									},
									{
										"costPriceUnit": 0,
										"goodsCategoryCode": "string",
										"goodsCategoryName": "string",
										"goodsCostPrice": 1000,
										"goodsSellPrice": 0,
										"goodsStandardPrice": 1000,
										"goodsSupplyCount": 0,
										"isDefault": 0
									}
								],
								"mobile": "string",
								"operatorCode": "string"
							},
						"msg": "string",
						"rpco": 200,
						"tsrp": 0
				}
            var rpco = res.rpco,
                body = res.body;
				switch(rpco) {
					case 200:
					that.body = body;
					that.priceList = body.items;
					$('.price-item').css('color','#333');
					break;
					default:
					util.tip('请求失败');
				}*/
			//debug end
            util.api({
                surl:root.VIRTUAL_API_PATH + 'goodslist?mob='+iphone,
                type:'get',
                success:function(res) {
					 var rpco = res.rpco,
					 body = res.body;
			 		 //$('.price-item').css('color','#333');
					 switch(rpco) {
						 case 200:
						 that.body = body;
						 that.priceList = body.items;
						 break;
                         case 40001:
							 util.tip('该手机号暂不支持充值');
                             break;
						 default:
						 util.tip('请求失败');
					 }
                }
            })
		},
		//去除字符串中所有空格
		trimAll: function(str,is_global) {
            var result;
            result = str.replace(/(^\s+)|(\s+$)/g, "");
            if (is_global.toLowerCase() == "g") {
                result = result.replace(/\s/g, "");
            }
            return result;
        },
        helpInfo: function() {
			util.href('./virtualhelp.html')
		},
		save: function() {
			var that = this, iphone;
			var str = that.moblie;
			    that.moblie = str.replace(/-/g,' ');
                iphone = that.trimAll(that.moblie,'g');

			if(that.params.orderAmount == 0 ) {
				return false;
			}
			if(that.params.orderAmount != 0) {
                if(!(/^1[34578]\d{9}$/.test(iphone))){
                    util.tip('请输入正确的手机号');
                    return false;
                }
			}
			//禁止多次点击
			if(that.requestState.createOrder) {
                that._save();
			}
		},
		_save: function() {
			var that = this;
			if(window.BPConfig.channel!=undefined){
				that.params.orderOriginId = window.BPConfig.channel;
			}
			util.api({
				 surl:VIRTUAL_API_PATH + 'saveOrder',
				 data: that.params,
				 type:'post',
				 beforeSend: function() {
					// 禁用按钮
					//that.requestState.createOrder = false;
                     util.comShow({txt: '正在努力加载中…', icl: 'i-load ro360'});
				 },
				 success:function(res) {
					 var rpco = res.rpco,
					 body = res.body;

					 switch(rpco) {
						 case 200:
						     setTimeout(function(){
                                 // 启用按钮
                                 //that.requestState.createOrder = true;
                                 util.remComShow();
							 },2000);
                             util.href('./pay.html',{
                                 otn:body.orderId,
                                 dodt:body.createTime,
                                 odtype:body.orderType
                             });
						 break;
						 default:
						 util.tip('请求失败');
						 util.remComShow();
				 	}
				 },
                error:function(){
                    // 启用按钮
                    //that.requestState.createOrder = true;
                    util.remComShow();
            	}
			 })
		},
		addEvent: function() {
		    var that = this;
            var kflag = false;
            var ele = document.getElementById('number');
            ele.addEventListener('keypress', function(e){
                if( kflag ){
                    e.preventDefault();
                }else{
                    kflag = true;
                }
            }, false);
            ele.addEventListener('keyup', function(e){
                kflag = false;
            }, false);
		    //输入手机号事件
            document.getElementById("number").onkeyup = function(event) {
                var text_len = this.value.length;
                if(event.keyCode == 8) {
					//TODO

                    that.params.orderAmount = 0;
                    that.init();
                    if(text_len === 9 || text_len === 4) {
                        var str = this.value;
                        var val = str.replace(/(^\s*)|(\s*$)/g,'')
                        that.moblie = val;
                    }

				}else{
                    if (text_len === 3 || text_len === 8) {
                        this.value += " ";
                    }
                    if(text_len === 4 || text_len === 9) {
						var str = this.value;
						var newstr = str.substring(0,str.length-1);
						var laststr = str.substr(str.length-1,1);
						that.moblie = newstr + ' ' + laststr;
					}

				}
            };
            document.getElementById("number").oninput = function() {
                var text_len = this.value.length;
                if(text_len === 13 || text_len == 11) {
                    that.getPrice();
                }
			}
		},

		//底部样式
        fotsta: function () {
			$('.virfooter').css({'position':'static','margin-top':'55%'});

        },
        fotabs: function () {
            $('.virfooter').css('position','absolute');
        }
	},
	components: {
		headerComponent
	}
}
</script>
<style lang="less" type="text/less">
	@import '../../util/fs.less';
	html{
		background: #f5f5f5;
	}
	input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
		color: #BFBFBF;
		.mixinfont(15px);
		line-height: normal;
		letter-spacing: 0;
	}
	.banner img{
		width: 100%;
	}
	.virtual-wapper{
		position: relative;
		height: 93%;
		//.px2rem(padding-bottom,140);
	}
	.header-right{
		line-height: 1.12rem;
		position: fixed;
		top: 0;
		right: 0;
		padding: 0 .32rem;
		z-index: 10000;
		color: #777;
	   .mixinfont(14px);
	}
	.help-rig{
		color: #68BFFE;
		.mixinfont(15px);
	}
	.wrap-box{
		position: relative;
		background: #fff;
		overflow: hidden;
		.px2rem(padding-top,40);
		.px2rem(padding-bottom,40);
		.px2rem(padding-left,38);
		.px2rem(padding-right,38);
	}
	.list-box {
		.px2rem(padding-left,24);
		.px2rem(padding-right,29);
	}
	.moblie{
		.px2rem(padding-right,0);
		.px2rem(line-height,66);
	    .mixinfont(32px);
		.px2rem(letter-spacing,3.2);
		color: #333333;
	}
	.moblie-bg{
		display: block;
		position: absolute;
		.px2rem(top,45);
	    .px2rem(right,24);
		.px2rem(width,60);
		.px2rem(height,60);
		background: url("img/czicon.png") no-repeat;
		-webkit-background-size: 100%;
		background-size: 100%;
	}
	.price-list{
		/*.px2rem(margin-left,-20);*/
		overflow: hidden;
	    .px2rem(padding-bottom,10);
	}
	.price-list li{
		/*width:33.33%;*/
		width: 2.93333rem;
		height: 1.62667rem;
		float: left;
		box-sizing:border-box;
		-moz-box-sizing:border-box; /* Firefox */
		-webkit-box-sizing:border-box; /* Safari */
		margin-left: 5px;
		margin-bottom: 7px;
	}
	.price-item{
		.px2rem(width,220);
		.px2rem(height,122);
		/*border: 1px solid #108EE9;
		-webkit-border-radius: 4px;
		-moz-border-radius: 4px;
		border-radius: 4px;*/
		text-align: center;
		color: #108EE9;
		display: block;
		/*position: relative;
		.px2rem(top,2);*/
	/*.px2rem(margin-bottom,20);
	.px2rem(padding-top,30);
	.px2rem(padding-bottom,20);*/
	}
	.price-list li.checked .price-item {
		background: #fff5f5;
		border: 1px solid #ff4b46;
	}
	.price-item .show{
		.px2rem(height,68);
		.px2rem(line-height,68);
		.px2rem(margin-top,10);
		.mixinfont(26px);
		color: #108EE9;
		letter-spacing: 0;
	}
	.price-item .practical{
		display: inline-block;
		.mixinfont(12px);
		.px2rem(height,33);
	    .px2rem(line-height,33);
		color: #68BFFE;
		letter-spacing: 0;
	}
	.virtual-tip{
		.mixinfont(15px);
		.px2rem(margin-top,30);
		color: #333333;
		text-align: center;
	}
	.virfooter{
		width: 100%;
		position: fixed;
		left:0;
		bottom: 0;
		text-align: center;
		.mixinfont(13px);
		.px2rem(margin-bottom,40);
	}
	.virfooter i{
		position: relative;
		.px2rem(top,-2);
	}
	.virfooter a{
		display: inline-block;
		.px2rem(width,132);
		.px2rem(height,33);
		.px2rem(line-height,33);
		color: #566B96;
		.px2remall(padding,0,10);
	}
	.virtual-footer{
		width: 100%;
		.px2rem(height,98);
		box-shadow: 10px 0px 10px rgba(0,0,0,0.1);
		position: fixed;
		left: 0;
		bottom: 0;
		background: #fff;
		z-index: 10000;
	}
	.virtual-footer-left{
		.px2rem(margin-right,220);
		.px2rem(line-height,98);
		.px2rem(padding-left,24);
	}
	.virtual-footer-right{
		.px2rem(width,220);
		.px2rem(line-height,98);
		background: #ff4b46;
		.mixinfont(18px);
		color: #fff;

		position: absolute;
		right: 0;
		bottom: 0;
		text-align: center;
	}
	.vir-opacity{
		opacity: .2;
	}
	.virtual-footer-left .price-1{
		.mixinfont(14px);
		color: #333;
	}
	.virtual-footer-left .price-2{
		.mixinfont(14px);
		color: #ff4b46;
	}
	.virtual-footer-left .price-3{
		.mixinfont(21px);
		color: #ff4b46;
		i{
			.mixinfont(16px);
			color:#ff4b46;
		}
	}
	.virtual-footer-nav{
		text-align: center;
		.px2rem(margin-top,40);
		.px2rem(margin-left,24);
		.px2rem(margin-right,24);
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content:space-around;
		a{
			display:block;
		};
		i{
			.px2rem(width,60);
			.px2rem(height,60);
			display: block;
			margin:0 auto;
			.px2rem(margin-bottom,15);
		}
		.icon-1{
			background: url("//gfs11.gomein.net.cn/T1ggdvB4ZT1RCvBVdK.png");
			-webkit-background-size: 100%;
			background-size: 100%;
		}
		.icon-2{
			background: url("//gfs13.gomein.net.cn/T1u9DvB7Yv1RCvBVdK.png");
			-webkit-background-size: 100%;
			background-size: 100%;
		}
		.icon-3{
			background: url("//gfs10.gomein.net.cn/T1zMYvBs_T1RCvBVdK.png");
			-webkit-background-size: 100%;
			background-size: 100%;
		}
		.icon-4{
			background: url("//gfs11.gomein.net.cn/T1UnDvB4Kv1RCvBVdK.png");
			-webkit-background-size: 100%;
			background-size: 100%;
		}
	}

	/* 一像素颜色问题 */
	.bdr-bottom:after {
		border-top: 1px solid #DDDDDD;
	}
	.bdr-r:before {
		border-right: 1px solid #566B96;
		height: 92%;
		top: 10%;
	}
	.bdr-all:before {
		width: 98%;
		border: 1px solid #108EE9;
		-webkit-border-radius: 4px;
		-moz-border-radius: 4px;
		border-radius: 4px;
	}
</style>
