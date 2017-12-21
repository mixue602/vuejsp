<template>
	<div class="wapper">
		<!-- 公共头部 -->
		<header-component :title="title"></header-component>
		<div class="cldtop clearfix">
			<a href="" class="bdr-r"><p>赚美豆</p><img src="//gfs12.gomein.net.cn/T10cxTBXLT1RCvBVdK.png" alt=""></a><a href="./clearweed.html"><p>花美豆</p><img src="//gfs13.gomein.net.cn/T1WWZ_BXLT1RCvBVdK.png" alt=""></a>
		</div>
		<div class="listcon" ref="J_Scroll" id="list">

			<div class="xs-container">
				<div class="xs-content">

					<div class="nolist" v-if="cwdList.length == 0">
						<img src="//gfs11.gomein.net.cn/T1_pJ_BCdT1RCvBVdK.png" alt="">
						<p class="nocwd">暂无美豆</p>
					</div>

		             <ul class="mycwlist" v-else>
			             <li v-for="ls in cwdList" class="bdr-top">
				            <p class="cwtype">{{ls.cwt}}({{ls.remark}})</p>
				            <p class="cwtime">{{ls.date | formatDt}}</p>
				            <span :class="['cwnum',ls.cwno > 0 ? 'numplus' : '']">{{ls.cwno | formatnum}}</span>
			             </li>
		             </ul>

				</div>
			</div>
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
			title:"我的美豆",
			body:{},
            cwdList:[],
            isNoList:false,
            //总页数
            tpage:1,
            //当前分页,默认第一分页
            curpg:1,
            //每页的分页数量
            len:10,

		}
	},
    created(){
        let that = this;
        if(util.isApp()){
            util.deleteHeadBtn();
        }
        this.$nextTick(() =>  {
            that.xscroll = new XScroll({
                renderTo: that.$refs.J_Scroll,
                lockY:false,
                // fixedElements:$('.footer')
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
                    that.getCWDList({
                        'curpg':that.curpg,
                        'succFn':(body)=>{
                            //优惠券列表
                            body.gclist.forEach(gclist=>{
                                that.cwdList.push(gclist);
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
                    $('.xs-plugin-pullup-container').html('最后一页');

                }

            });
            that.getCWDList({
                'curpg':that.curpg,
                'succFn':(body)=>{
                    //列表
                    that.cwdList = body.gclist;
                    //总页数 totalPageNum
                    that.tpage = body.totalPageNum;
                },
                'falseFn':()=>{
                    //更迭加载的页数
                    that.curpg -= 1;
                    util.tip('您当前网络异常，请稍后重试');
                }
            });
        });
    },
	filters: {
        formatDt:function (val) {
			if (val == '') {
				return '';
				return false;
			}
			return util.formateDate(parseInt(val),'yyyy-MM-dd hh:mm:ss');
        },
        formatnum:function (val) {
            if (val > 0) {
                return '+'+ val;
            }else {
                return val;
			}
        }
	},
    watch: {
        cwdList () {
            let that = this;
            that.$nextTick(()=>{
                //重新渲染滚动插件
                that.xscroll.render();
                //loading complete
                that.pullup.complete();

                //不存在数据交互处理
                if(that.cwdList.length === 0){
                    that.isNoList = true;
                    that.xscroll.unplug(that.pullup);
                    $('.xs-plugin-pullup-container').hide();
                }else{
                    that.xscroll.plug(that.pullup);
                    that.isNoList = false;
                }
            });
        }
	},
	methods: {
		//获取美豆列表
		getCWDList: function(obj) {
            var that = this;
            //debug
			/*var res = {
                "rpco": 200,
                "msg": "",
                "body":{
                    "gclist":[{
                        "date": '3727874837',
                        "cwno": -4,
                        "cwt": '获取/消费',//美豆类型
                        "remark": '签到奖励/消耗/参加活动' //文案
                    },{
                        "date": '3727874837',
                        "cwno": 4,
                        "cwt": '获取/消费',//美豆类型
                        "remark": '签到奖励/消耗/参加活动' //文案
                    },{
                        "date": '3727874837',
                        "cwno": -4,
                        "cwt": '获取/消费',//美豆类型
                        "remark": '签到奖励/消耗/参加活动' //文案
                    },{
                        "date": '3727874837',
                        "cwno": 4,
                        "cwt": '获取/消费',//美豆类型
                        "remark": '签到奖励/消耗/参加活动' //文案
                    },{
                        "date": '3727874837',
                        "cwno": 4,
                        "cwt": '获取/消费',//美豆类型
                        "remark": '签到奖励/消耗/参加活动' //文案
                    },{
                        "date": '3727874837',
                        "cwno": 4,
                        "cwt": '获取/消费',//美豆类型
                        "remark": '签到奖励/消耗/参加活动' //文案
                    },{
                        "date": '3727874837',
                        "cwno": 4,
                        "cwt": '获取/消费',//美豆类型
                        "remark": '签到奖励/消耗/参加活动' //文案
                    },{
                        "date": '3727874837',
                        "cwno": 4,
                        "cwt": '获取/消费',//美豆类型
                        "remark": '签到奖励/消耗/参加活动' //文案
                    },{
                        "date": '3727874837',
                        "cwno": 4,
                        "cwt": '获取/消费',//美豆类型
                        "remark": '签到奖励/消耗/参加活动' //文案
                    },{
                        "date": '3727874837',
                        "cwno": 4,
                        "cwt": '获取/消费',//美豆类型
                        "remark": '签到奖励/消耗/参加活动' //文案
                    },{
                        "date": '3727874837',
                        "cwno": 4,
                        "cwt": '获取/消费',//美豆类型
                        "remark": '签到奖励/消耗/参加活动' //文案
                    },{
                        "date": '3727874837',
                        "cwno": 4,
                        "cwt": '获取/消费',//美豆类型
                        "remark": '签到奖励/消耗/参加活动' //文案
                    },{
                        "date": '3727874837',
                        "cwno": 4,
                        "cwt": '获取/消费',//美豆类型
                        "remark": '签到奖励/消耗/参加活动' //文案
                    },{
                        "date": '3727874837',
                        "cwno": 4,
                        "cwt": '获取/消费',//美豆类型
                        "remark": '签到奖励/消耗/参加活动' //文案
                    },{
                        "date": '3727874837',
                        "cwno": 4,
                        "cwt": '获取/消费',//美豆类型
                        "remark": '签到奖励/消耗/参加活动' //文案
                    },{
                        "date": '3727874837',
                        "cwno": 4,
                        "cwt": '获取/消费',//美豆类型
                        "remark": '签到奖励/消耗/参加活动' //文案
                    },{
                        "date": '3727874837',
                        "cwno": 4,
                        "cwt": '获取/消费',//美豆类型
                        "remark": '签到奖励/消耗/参加活动' //文案
                    },{
                        "date": '3727874837',
                        "cwno": 4,
                        "cwt": '获取/消费',//美豆类型
                        "remark": '签到奖励/消耗/参加活动' //文案
                    }],
			 "currPageNum": 1,//当前页码
			 "totalPageNum": 3,//总页数
			 "totalRecord": 100 //总记录数

                },

            }
            var rpco = res.rpco,
                body = res.body;
            obj.succFn&&obj.succFn(body);*/
			//debug
            util.api({
				// 	/gomedo/yf/hstlist
                surl: root.CLWEED_API_PATH + 'hstlist',
				data:{
                    curpg:that.curpg
				},
                type:'get',
                success:function(res) {
					 var rpco = res.rpco,
					 body = res.body;
					 switch(rpco) {
						 case 200:
                             obj.succFn&&obj.succFn(body);
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
	},
	components: {
		headerComponent,
	}
}
</script>
<style lang="less" type="text/less">
	@import '../../util/fs.less';
	html{
		background: #f5f5f5;
	}
	/*loading 加载*/
	.xs-plugin-pullup-container{
		width: 100%;
		text-align: center;
		.mixinfont(12px);
		line-height:1.066667rem /* 80/75 */;
	}
	.nolist {
		text-align: center;
	}
	.nocwd {
		.mixinfont(16px);
		color: #333333;
		letter-spacing: 0;
		.px2rem(margin-top,58);
	}
	.nolist img {
		.px2rem(margin-top,138);
		display: inline-block;
		.px2rem(width,480);
		.px2rem(height,436);
	}
	.listcon {
		.px2rem(min-width,320);
		width: 100%;
		background-color: #f5f5f5;
		overflow-x: hidden;
		overflow-y: auto;
		position: absolute;
		.px2rem(top,238);
		.px2rem(bottom,0);
		left: 0;
		-webkit-overflow-scrolling: touch;
	}
	.cldtop {
		position: fixed;
		width: 100%;
		top:1.173333rem;
		overflow: hidden;
		.px2rem(margin-bottom,20);
		z-index: 999;
	}
	.cldtop a{
		display: inline-block;
		width: 50%;
		.px2rem(height,128);
		background: #FFFFFF;
		color: #333333;
		.mixinfont(16px);
		position: relative;
	}
	.cldtop a img {
		position: absolute;
		.px2rem(width,74);
		.px2rem(height,70);
		.px2rem(left,92);
		.px2rem(top,26);
	}
	.cldtop a p{
		position: absolute;
		.px2rem(left,184);
		.px2rem(top,42);
	}
	.mycwlist li{
		position: relative;
		/*border-top: 1px solid #E6E6E6;*/
		.px2rem(height,100);
		background: #FFFFFF;
		letter-spacing: 0;
		.px2rem(padding-left,30);
	}
	.mycwlist li:first-of-type{
		/*border-top: 1px solid #FFFFFF;*/
	}
	.mycwlist .cwtype{
		.px2rem(line-height,40);
		.px2rem(padding-top,12);
		.mixinfont(14px);
		color: #333333;
	}
	.mycwlist .cwtime{
		.px2rem(line-height,34);
		.mixinfont(12px);
		color: #666666;
	}
	.mycwlist .cwnum{
		.mixinfont(14px);
		color: #FF4B41;
		position: absolute;
		.px2rem(right,30);
		.px2rem(top,30);
	}
	.mycwlist .numplus {
		color: #3AA11A;
	}
	.mycwlist .bdr-top:first-of-type:after{
		border-top: 1px solid #ffffff;
	}
/*一像素颜色*/
	.bdr-r:before {
		border-right: 1px solid #E6E6E6;
		top:12.5%;
		height: 75%;
	}
</style>
