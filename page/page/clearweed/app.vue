<template>
	<div class="wapper" id="clearWeed">
		<!-- 公共头部 -->
		<header-component :title="title"></header-component>
		<!--banner-->
		<div class="cwban">
			<a href="./clearweedlist.html">
			   <img class="meidou" src="//gfs11.gomein.net.cn/T1ghAvB7hg1RCvBVdK.png" alt="">
			   <p class="cwdes"><span>{{body.allGomedo}}</span><i>(查看详情)</i></p>
				<img class="cwxq" src="//gfs10.gomein.net.cn/T1ZDWvByJg1RCvBVdK.png" alt="">
			</a>
		</div>
		<!--list-->
		<div class="cwcon">
			<p class="lstit">美豆可兑换商品</p>
			<ul class="cwlist">
				<li v-for="(cws,ind) in cwList" @click="todetail(ind)">
					<!--bord-r-->
					<div class="lsleft bdr-r">
						<p><i class="lsfon">￥</i>{{cws.couponAmount}}</p>
					</div>
					<div class="lsright">
						<p class="lsrup">满{{cws.fullAmount}}可用，仅限清洗使用</p>
						<p class="lsrdn">{{cws.needGomedo}}美豆兑换<span class="dhbtn bdr-all" @click.stop="cwexchg(ind)">兑换</span></p>
					</div>
					<div class="lsrquan">
						<img :src="imgsrc[cws.couponTypeId]" alt="">
						<!--<p class="qname">{{cws.couponType}}</p>-->
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
import headerComponent from '../../components/HeaderComponent'
let root = window || {},
    util = root.util || {};
export default {
	data () {
		return {
			title:"美豆",
			body:{},
            cwList:[],
            imgsrc:[
                "//gfs13.gomein.net.cn/T1kadgBCdT1RCvBVdK.png",
                "//gfs10.gomein.net.cn/T19VV_BCDT1RCvBVdK.png",
                "//gfs10.gomein.net.cn/T1rJdQBCdT1RCvBVdK.png"
			]
		}
	},
	created() {

	},
	filters: {

	},
    computed: {

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
			that.getCWAll();
			that.getCWList();
		},
		//获取美豆值
        getCWAll: function() {
            var that = this;
            //debug
			/*var res = {
                "rpco": 200,
                "msg": "",
                "body":{
                    "allGomedo":255, //美豆总数
                    "clist": []
                }
            };
            var rpco = res.rpco,
                body = res.body;
            that.body = body;*/
			//debug
            util.api({
				//  美豆总数接口 /gomedo/yf/info?
                surl: root.CLWEED_API_PATH + 'info',
                type:'get',
                success:function(res) {
					 var rpco = res.rpco,
					 body = res.body;
					 switch(rpco) {
						 case 200:
						 that.body = body;
						 break;
                         case 40001:
							 util.tip('');
                             break;
						 default:
						 util.tip('请求失败');
					 }
                }
            })
		},
        //获取兑换券列表
        getCWList: function() {
            var that = this;
            //图片链接
			/*
			 回收：//gfs10.gomein.net.cn/T1rJdQBCdT1RCvBVdK.png
			 维修：//gfs10.gomein.net.cn/T19VV_BCDT1RCvBVdK.png
			 清洗：//gfs13.gomein.net.cn/T1kadgBCdT1RCvBVdK.png
			 */
            util.api({
                //  美豆总数接口 /gomedo/yf/info?
				//本地
                //surl: 'resources/json/gomedocoupon.json',
                surl: 'json/gomedocoupon.json',
                type:'get',
                success:function(res) {
                    console.log("===========")
                    console.log(res)
                    var rpco = res.rpco,
                        body = res.body;
                    switch(rpco) {
                        case 200:
                            that.cwList = body.clist;
                            break;
                        default:
                            util.tip('请求失败');
                    }
                }
            })
        },
		//兑换
        cwexchg: function (ind) {
		    var that = this;
            util.alert('兑换此商品将消耗您'+that.cwList[ind].needGomedo+'美豆<br>您确认要兑换吗？', {
                content: '',
                title: '',
                txtal: 'center',
                justOk: false,
                defBtnIndex: -1,
                okBtnText: '在想想',
                cancelBtnText: '确认兑换',
				/*取消*/
                okFn: function() {
				},
				/*确认兑换*/
                cancelFn: function() {
                    /*调用兑换接口*/
                    that.changeCW(ind);

				}
            });
        },
        //兑换美豆
        changeCW: function(ind) {
            var that = this;
            //debug
           /* var res = {
                "rpco": 200,
                "msg": "",
                "body":{
                   //待定
                }
            }
            var rpco = res.rpco,
                body = res.body;
            that.body = body;
            util.href('./clearweedresult.html',
                {res:0,meidou:8}
            );*/
            //debug
            util.api({
                // /gomedo/yf/change
                surl:root.CLWEED_API_PATH + 'change',
                data:{
                    cid:that.cwList[ind].couponId,
                    usableGomedo:that.cwList[ind].needGomedo
                },
                type:'get',
                beforeSend: function() {

                },
                success:function(res) {
                    var rpco = res.rpco,
                        body = res.body;
                    switch(rpco) {
                        case 200:
                            that.body = body;
                            //跳转到兑换结果页面
                            util.href('./clearweedresult.html',
                                {res:1,cwds:that.cwList[ind].needGomedo}
                            );
                            break;
                        case 201:
                            util.tip('兑换失败，退还美豆',2000);
                            //跳转到兑换结果页面
                            setTimeout(function () {
                                util.href('./clearweedresult.html',
                                    {res: 0}
                                );
                            },2000);
                            break;
                        case 40001:
                            util.tip('已领完，无法继续兑换该优惠券',2000);
                            //跳转到兑换结果页面
                           /* setTimeout(function () {
                                util.href('./clearweedresult.html',
                                    {res: 0}
                                );
                            },2000);*/
                            break;
                        case 40002:
                            util.tip('打赏失败',2000);
                            //跳转到兑换结果页面
                           /* setTimeout(function () {
                                util.href('./clearweedresult.html',
                                    {res: 0}
                                );
                            },2000);*/
                            break;
                        case 40003:
                            util.tip('由于您的美豆不足，无法继续兑换该优惠券',2000);
                            //跳转到兑换结果页面
                           /* setTimeout(function () {
                                util.href('./clearweedresult.html',
                                    {res: 0}
                                );
                            },2000);*/
                            break;
                        case 40004:
                           util.tip('当前兑换券已超出兑换时间，兑换失败',2000);
                            //跳转到兑换结果页面
							/*  setTimeout(function () {
                                util.href('./clearweedresult.html',
                                    {res: 0}
                                );
                            },2000);*/
                            break;
                        default:
                    }
                },
                complete: function(jqXHR, textStatus) {

                }
            })
        },
		/*跳转到详情页面*/
        todetail:function (ind) {
			var that = this,
                ss = window.sessionStorage;
			if (ss.getItem("clweedsinfo")) {
                ss.removeItem("clweedsinfo");
			}
            ss.setItem("clweedsinfo",JSON.stringify(that.cwList[ind]));
			setTimeout(function () {
                util.href('./clearweeddetail.html',{
                    cid:that.cwList[ind].couponId
                })
            },320);
        },
		addEvent: function() {
		    var that = this;
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

	.cwban {
		background-image: linear-gradient(-90deg, #FF574C 2%, #FB3836 97%);
		text-align: center;
		.px2remall(padding,62,30);
		position: relative;
	}
	.cwban .meidou {
		.px2rem(width,166);
		.px2rem(height,166);
		position: absolute;
		bottom: 0;
	}
	.cwban .cwxq {
		.px2rem(width,36);
		.px2rem(height,36);
		position: absolute;
		.px2rem(right,30);
		top:50%;
		.px2rem(margin-top,-18);
	}
	.cwdes {
		color: #FFFFFF;
		.px2rem(height,90);
		.px2rem(line-height,90);
		text-align: left;
		.px2rem(padding-left,160);
	}
	.cwdes span {
		.mixinfont(32px);
		letter-spacing: 0;
	}
	.cwdes i {
		display: inline-block;
		.px2rem(width,168);
		.px2rem(height,40);
		.px2rem(line-height,40);
		text-align: center;
		.mixinfont(14px);
		letter-spacing: 0;
	}
	.cwcon {
		.px2remall(padding,42,30);
	}
	.cwcon .lstit {
		font-size: 13px;
		color: #999999;
		letter-spacing: 0;
	}
	.cwlist {
		.px2rem(padding-top,22);
	}
	.cwlist li {
		.px2rem(height,200);
		background: #FFFFFF;
		border-radius: 7px;
		.px2rem(margin-bottom,22);
		overflow: hidden;
		position: relative;
	}
	.cwlist li div {
		float: left;
	}
	.lsleft {
		.px2rem(height,200);
		.px2rem(line-height,200);
		text-align: left;
		.px2rem(width,250);
		.mixinfont(28px);
		color: #FF4B41;
		letter-spacing: 0;
		position: relative;
	}
	.lsleft .lsfon {
		.mixinfont(18px);
		.px2rem(margin-left,32);
	}
	.lsright {
		.px2rem(width,439);
		color: #FF9897;
		letter-spacing: 0;
	}
	.lsright p {
		.px2rem(height,34);
		.px2rem(line-height,34);
		text-align: left;
		.px2rem(margin-left,40);
		.mixinfont(12px);
	}
	.lsright .lsrup {
		.px2rem(margin-top,62);
		color: #FF9897;
	}
	.lsright .lsrdn {
		.px2rem(margin-top,10);
		color: #F5A623;
	}
	.lsright .lsrdn .dhbtn {
		display: inline-block;
		.px2rem(width,64);
		.px2rem(height,26);
		.px2rem(line-height,30);
		text-align: center;
		.px2rem(margin-left,10);
		.px2rem(padding-right,6);
		.mixinfont(10px);
		/*border: 1px solid #4A90E2;*/
		/*.px2rem(border-radius,4);*/
		color: #4A90E2;
		transform:scale(0.875);
		-webkit-transform: scale(0.875);
	}
	.lsrquan img{
		.px2rem(width,82);
		.px2rem(height,82);
		position: absolute;
		right: 0;
		top:0;
	}
	.lsrquan .qname {
		transform: rotate(45deg);
		.mixinfont(11px);
		color: #FFFFFF;
		letter-spacing: 0;
		position: absolute;
		.px2rem(right,-7);
		.px2rem(top,15);
	}
	.alert {
		.px2rem(width,568);
		.px2rem(padding-top,0);
	}
	.alert-content {
		.mixinfont(19px);
		color: #333333;
		letter-spacing: 0;
		.px2remall(padding,44,30);
		.px2rem(line-height,52);
	}
	.alert-btn {
		border-top: 1px solid #dadada;
	}
	.alert-btn span {
		.mixinfont(18px);
		color: #666666;
		letter-spacing: 0;
	}
	.alert-btn #alert-cancel {
		color: #ED5B5D;
	}
	/*一像素问题*/
	.bdr-r:before {
		height: 75%;
		top:12.5%;
		border-right: 1px solid #DDDDDD;
	}
	.bdr-all:before {
		border: 1px solid #4A90E2;
		.px2rem(border-radius,4);
	}
	.alert-btn {
		position: relative;
		border-top:none;
	}
	.alert-btn:before {
		height: 1px;
		content: '';
		width: 100%;
		border-top: 1px solid #f0f0f0;
		position: absolute;
		top: 0px;
		right: 0;
		z-index: 10
	}
	.alert-btn span:not(:last-of-type){
		position: relative;
		border-right: none;
	}
	.alert-btn span:not(:last-of-type):after {
		height: 100%;
		content: '';
		width: 1px;
		border-right: 1px solid #f0f0f0;
		position: absolute;
		top: 0;
		right: 0;
		z-index: 10;
	}
	@media (-webkit-min-device-pixel-ratio: 1.5),(min-device-aspect-ratio: 1.5){
		.alert-btn:before {
			-webkit-transform : scaleY(0.7);
			transform : scaleY(0.7);
		}
		.alert-btn span:not(:last-of-type):after{
			-webkit-transform : scaleX(0.7);
			transform : scaleX(0.7);
		}
	}
	@media (-webkit-min-device-pixel-ratio: 2),(min-device-aspect-ratio: 2){
		.alert-btn:before {
			-webkit-transform : scaleY(0.7);
			transform : scaleY(0.7);
		}
		.alert-btn span:not(:last-of-type):after{
			-webkit-transform : scaleX(0.7);
			transform : scaleX(0.7);
		}
	}
</style>
