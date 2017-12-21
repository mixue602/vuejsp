<template>
	<div class="wapper" id="">
		<!-- 公共头部 -->
		<header-component :title="title"></header-component>
		<!--关闭当前页面返回首页-->
		<a class="cwclose" href="./index.html"><img src="//gfs11.gomein.net.cn/T13iZvBbJT1RCvBVdK.png" alt=""></a>
		<div class="">
			<div class="topban">
				<p class="cwtype">{{cwinfo.couponType}}</p>
				<p class="cwprc">&yen;{{cwinfo.couponAmount}}</p>
				<p class="cwuse">满{{cwinfo.fullAmount}}可用</p>
			</div>
			<div class="desinfo bdr-top"><p class="destype">&nbsp;【国美管家】{{cwinfo.couponType}}{{cwinfo.couponAmount}}元<span>{{cwinfo.exchangeNotes}}</span></p>
				<p class="descw">{{cwinfo.needGomedo}}美豆</p>
				<p class="despin"><span>{{body.pno}}</span>人已参与</p>
				<p class="destm">兑换时间：{{body.coucut | formatDt}} 至 {{body.coucute | formatDt}}</p>
			</div>
		</div>
		<div class="fotinfo clearfix">
			<p class="overtm">距结束：<span class="overday">{{body.date | fmtPno}}</span>天</p><a @click="cwexchg(cwinfo)"  class="cgbtn" href="javascript:;">立即兑换</a>
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
			title:"美豆兑换",
			body:{},
			cwinfo:{}
		}
	},
	created() {

	},
	filters: {
        formatDt:function (val) {
            if (val == '') {
                return '';
                return false;
            }
            return util.formateDate(parseInt(val),'yyyy-MM-dd');
        },
        fmtPno:function (val) {
            if (val == '') {
                return '';
                return false;
            }
            return  val > 999 ? '999+' : val;
        }
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
            let that = this,
                hrefpm = util.getHrefParma(),
                cid = hrefpm.cid;
            if(util.isApp()){
                util.deleteHeadBtn();
            }
			that.getResult(cid);
			that.getSessionInfo();
		},
		//获取seession页面信息
		getSessionInfo:function () {
		    var that = this,
			ss = window.sessionStorage;
		    /*{"couponId":162,"couponType":"维修券","couponAmount":45,"fullAmount":450,"exchangeNotes":"兑换说明","needGomedo":7500}*/
            that.cwinfo = JSON.parse(ss.getItem("clweedsinfo"));
        },
		//获取美豆列表
        getResult: function(cid) {
            var that = this;
            //debug
			/*var res = {
                "rpco": 200,
                "msg": "",
                "body":{
                    "cid": 0, //兑换券ID
                    "ct": "清洗券", //兑换卷类别
                    "ca": 30, //兑换卷金额
                    "fa": 330, //使用兑换卷需满金额
                    "en": '兑换说明', //兑换说明
                    "encno": 880, //兑换券所需美豆数量
                    "pno": 36, //参与人数
                    "coucut": 847293, //有效期开始时间。单位：毫秒
                    "coucute": 7483748, //有效期结束时间。单位：毫秒
                    "date":3 //距离兑换卷券池截止时间剩余天数
                }
            }
            var rpco = res.rpco,
                body = res.body;
            that.body = body;*/
			//debug
            util.api({
				// /gomedo/yf/changedetail
                surl:root.CLWEED_API_PATH + 'changedetail',
                data:{
			        cid :cid
                },
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
        //兑换弹出框
        cwexchg: function (cwinfo) {
            var that = this;
            util.alert('兑换此商品将消耗您'+cwinfo.needGomedo+'美豆<br>您确认要兑换吗？', {
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
                    that.changeCW(cwinfo);

                }
            });
        },
        //兑换美豆
        changeCW: function(cwinfo) {
            var that = this, ss = window.sessionStorage;
            //debug
            /*var res = {
                "rpco": 200,
                "msg": "",
                "body":{
                    //待定
                }
            };
            //清除session
            /!*if (ss.getItem("clweedsinfo")) {
                ss.removeItem("clweedsinfo");
            }*!/
            util.href('./clearweedresult.html',
                {res: 1, cwds: cwinfo.needGomedo}
            );*/
            //debug
            util.api({
                // /gomedo/yf/change
                surl: root.CLWEED_API_PATH + 'change',
                data: {
                    cid: cwinfo.couponId,
                    usableGomedo: cwinfo.needGomedo
                },
                type: 'get',
                beforeSend: function () {

                },
                success: function (res) {
                    //清除session
                   /* if (ss.getItem("clweedsinfo")) {
                        ss.removeItem("clweedsinfo");
                    }*/
                    var rpco = res.rpco;
                    switch (rpco) {
                        case 200:
                            //跳转到兑换结果页面
                            util.href('./clearweedresult.html',
                                {res: 1, cwds: cwinfo.needGomedo}
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
							/*setTimeout(function () {
                                util.href('./clearweedresult.html',
                                    {res: 0}
                                );
                            },2000);*/
                            break;
                        case 40002:
                            util.tip('打赏失败',2000);
                            //跳转到兑换结果页面
                            /*setTimeout(function () {
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
                            /*setTimeout(function () {
                                util.href('./clearweedresult.html',
                                    {res: 0}
                                );
                            },2000);*/
                            break;
                        default:
                    }
                },
                complete: function (jqXHR, textStatus) {

                }
            })
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
		background: #FFFFFF;
		letter-spacing: 0;
	}
	.wapper {
		.px2rem(padding-bottom,100);
	}
	.cwclose {
		.px2rem(height,88);
		.px2rem(line-height,88);
		text-align: center;
		position: fixed;
		top:0;
		.px2rem(left,90);
		z-index: 9999;
	}
	.cwclose img{
		.px2rem(width,36);
		.px2rem(height,36);
		.px2rem(margin-top,28);
	}
	.topban {
		.px2rem(width,718);
		.px2rem(height,832);
		background: url("//gfs11.gomein.net.cn/T1IidvBsET1RCvBVdK.png") no-repeat 0px 0px;
		background-size: cover;
		.px2remall(margin,12,18);
		.px2rem(margin-bottom,22);
	}
	.topban .cwtype {
		.mixinfont(30px);
		color: #FFFFFF;
		.px2rem(line-height,84);
		.px2rem(padding-top,72);
		.px2rem(margin-left,54);
	}
	.topban .cwprc {
		.px2rem(margin-top,46);
		.px2rem(height,364);
		.px2rem(line-height,364);
		text-align: center;
		.mixinfont(130px);
		color: #FFFFFF;
	}
	.topban .cwuse{
		.px2rem(margin-top,114);
		.px2rem(line-height,140);
		text-align: center;
		.mixinfont(50px);
		color: #FFFFFF;
	}
	.desinfo {
		.px2rem(padding,12);
		.px2rem(padding-bottom,0);
		/*border-top: 1px solid #E6E6E6;*/
	}
	.desinfo .destype {
		.mixinfont(16.5px);
		color: #031324;
	}
	.desinfo .destype span{
		.mixinfont(12px);
		color: #999999;
		.px2rem(margin-left,10);
	}
	.desinfo .descw {
		.mixinfont(20px);
		color: #FF4B41;
		.px2rem(margin-left,22);
		.px2rem(margin-top,20);
		.px2rem(line-height,56);
	}
	.desinfo .despin,
	.desinfo .destm {
		.mixinfont(12px);
		color: #999999;
		.px2rem(margin-left,22);
		.px2rem(line-height,34);
	}
	.desinfo .despin {
		color: #999999;
		.px2rem(margin-top,10);
	}
	.desinfo .despin span {
		color: #FF4B41;
	}
	.fotinfo {
		width: 100%;
		position: fixed;
		bottom: 0;
		left:0;
		background: #EFEFEF;
		.px2rem(height,100);
		overflow: hidden;
	}
	.fotinfo .overtm {
		float: left;
		.px2rem(height,28);
		.px2rem(line-height,28);
		.mixinfont(10px);
		color: #666666;
		.px2rem(margin-left,24);
		text-align: center;
		.px2rem(margin-top,34);
	}
	.fotinfo .overtm .overday {
		display: inline-block;
		.px2rem(height,30);
		.px2rem(line-height,30);
		background: #666666;
		color: #FFFFFF;
		.px2remall(margin,0,4);
		.px2rem(padding,8);
	}
	.fotinfo .cgbtn {
		float: right;
		.px2rem(width,180);
		.px2rem(height,72);
		.px2rem(line-height,72);
		text-align: center;
		.px2rem(margin-top,14);
		.px2rem(margin-right,24);
		.mixinfont(16px);
		color: #FFFFFF;
		background: #FF4B41;
		.px2rem(border-radius,46);
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
	.alert-btn span {
		.mixinfont(18px);
		color: #666666;
		letter-spacing: 0;
	}
	.alert-btn #alert-cancel {
		color: #ED5B5D;
	}

	/*一像素问题*/
	.bdr-top:after {
		border-top: 1px solid #E6E6E6;
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
