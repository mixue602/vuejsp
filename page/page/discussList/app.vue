<template>
  <div class="wapper">
    <Headtop :title="title"></Headtop>
    <div class="discuss-list-tab">
      <a href="javascript:;" :class="[{'active': active === 0},'']" @click="tab(0)"><span>待评价商品</span></a>
      <a href="javascript:;" :class="[{'active': active === 1},'']" @click="tab(1)"><span>待评价服务</span></a>
      <a href="javascript:;" :class="[{'active': active === 2},'']" @click="tab(2)"><span>已评价</span></a>
    </div>
    <div ref="J_Scroll" id="J_Scroll">
      	<div class="xs-container">
          	<div class="xs-content">
                 <!-- 待评价商品 -->
                <ul class="discuss-list-list" v-show="active === 0">
                  <li v-for="item in goods">
                    <div class="discuss-list-top">
                      <div class="clearfix">
                        <img v-if="item.odtp===0&&item.spno!=null" src="//gfs10.gomein.net.cn/T1Rj__BKET1RCvBVdK.png">
                        <img v-else-if="item.odtp===0&&item.spno==null" src="//gfs10.gomein.net.cn/T1F6V_B7WT1RCvBVdK.png">
                        <img v-else-if="item.odtp===1" src="//gfs11.gomein.net.cn/T1HMD_B7LT1RCvBVdK.png">
                        <img v-else-if="item.odtp===2" src="//gfs11.gomein.net.cn/T1kOYjB7bT1RCvBVdK.png">

                        <span>{{item.spnm}}</span>
                      </div>
                    </div>
                    <div class="discuss-list-info" @click="goodsHrefToUrl(item)">
                      <div class="f-l">
                        <img :src="item.gdiul" alt="">
                      </div>
                      <div class="discuss-list-goods">
                        <div>{{item.gdna}}</div>
                      </div>
                    </div>
                    <div class="clearfix">
                      <a :href="item.href" class="discuss-list-btn">评价</a>
                    </div>
                  </li>
                </ul>
                <!-- 待评价服务 -->
                <ul class="discuss-list-list" v-show="active === 1">
                  <li v-for="item in service">
                    <div class=" discuss-list-top">
                      <div class="clearfix">
                        <img src="//gfs11.gomein.net.cn/T1kOYjB7bT1RCvBVdK.png" />
                        <span>{{item.svpnm}}</span>
                      </div>
                    </div>
                    <div class="discuss-list-info" @click="serviceHrefToUrl(item)">
                      <div class="f-l">
                        <img :src="item.sviul" alt="">
                      </div>
                      <div class="discuss-list-goods">
                        <div>{{item.svna}}</div>
                        <div>{{item.svdesc}}</div>
                      </div>
                    </div>
                    <div class="clearfix">
                      <a :href="item.href" class="discuss-list-btn">评价</a>
                    </div>
                  </li>
                </ul>
                <!-- 已评价 -->
                <ul class="discuss-list-list" v-show="active === 2">
                  <li v-for="item in donefinish">
                    <div class="discuss-good-top clearfix">
                        <div><img :src="item.gdiul" /></div>
                        <div class="discuss-good-info">
                            <div><span class="active" v-for="n in item.score"></span><span v-for="n in (5-item.score)"></span></div>
                        </div>
                    </div>
                    <div class="discuss-con">
                      <div>{{ item.date | formatTime }}</div>
                      <div>{{ item.cnt?item.cnt:'用户未及时评价，显示为默认评价。' }}</div>
                      <ul class="img-list clearfix" v-if="item.photos&&item.photos.length > 0">
                          <li v-for="items in item.photos"><img :src="items"></li>
                      </ul>
                    </div>
                  </li>
                </ul>
                <!-- 暂无数据 -->
                <div class="nodata" v-if="goodsNoshow&&active === 0"><i></i>您还没有待评价商品~</div>
                <div class="nodata" v-if="serviceNoshow&&active === 1"><i></i>您还没有待评价的服务订单~</div>
                <div class="nodata" v-if="donefinishNoshow&&active === 2"><i></i>您还没有评价过商品~~</div>
          	</div>
      	</div>
    </div>
   </div>
</template>
<script type="ecma6.0">
  import Headtop from '../../components/HeaderComponent.vue';
  export default {
      data() {
          return {
            title: '去评价',
            active: 0,
            goodsNoshow: false, //默认有数据
            serviceNoshow: false,
            donefinishNoshow: false,
            goodsCurp: 1, //商品当前分页数
            serviceCurp: 1,//服务当前分页数
            donefinishCurp: 1,//已完成当前分页数
            goodsTotalp: 1, //商品总分页数
            serviceTotalp: 1,//服务总分页数
            donefinishTotalp: 1,//已完成当前总页数
            len:5,//每次分页加载条数
            goods: [],
            service: [],
            donefinish: []
          }
      },
      created: function() {
        let that = this;
			  this.$nextTick(() => {
            let listEle= $('.discuss-list-tab'),
            topPos = Number(listEle.offset().top) + Number(listEle.height());

          $('#J_Scroll').css({'top':topPos,'bottom':0});
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
            if(that.active===0){
                that.goodsCurp++;
                if(that.goodsCurp<= that.goodsTotalp){
                  //商品待评价
                  that.getList({
                    'url':root.COMMENT_API_PATH + 'goods/getCommentList',
                    'curpg':that.goodsCurp,
                    'len':that.len,
                    'succFn':(body)=>{
                        $.each(body.ctn, function(i, v) {
                          body.ctn[i].href = 'discuss.html?gdsid=' + v.gdsid + '&spgid=' + v.spgid + '&type=2';
                            that.goods.push(body.ctn[i]);
                        });
                    },
                    'falseFn':()=>{
                      //更迭加载的页数
                      that.goodsCurp -= 1;
                      util.tip('您当前网络异常，请稍后重试');
                    }
                  });
                }else{
                  that.xscroll.render();
                  that.pullup.complete();
                  //底部加载文字处理
                  $('.xs-plugin-pullup-container').html('没有更多了');
                }
            }else if(that.active===1){
                that.serviceCurp++;
                if(that.serviceCurp<= that.serviceTotalp){
                  //服务待评价
                  that.getList({
                    'url':root.COMMENT_API_PATH + 'service/getCommentList',
                    'curpg':that.serviceCurp,
                    'len':that.len,
                    'succFn':(body)=>{
                        $.each(body.ctn, function(i, v) {
                          body.ctn[i].href = 'discuss.html?svid=' + v.svid + '&otn=' + v.otn + '&type=1';
                            that.service.push(body.ctn[i]);
                        });
                    },
                    'falseFn':()=>{
                      that.serviceCurp-=1;
                      util.tip('您当前网络异常，请稍后重试');
                    }
                  });
                }else{
                  that.xscroll.render();
                  that.pullup.complete();
                  //底部加载文字处理
                  $('.xs-plugin-pullup-container').html('没有更多了');
                }
            }else if(that.active===2){
                that.donefinishCurp++;
                if(that.donefinishCurp<= that.donefinishTotalp){
                    //已完成评价
                    that.getList({
                      'url':root.COMMENT_API_PATH + 'goods/getCommentFinishList',
                      'curpg':that.donefinishCurp,
                      'len':that.len,
                      'succFn':(body)=>{
                          $.each(body.ctn, function(i, v) {
                              that.donefinish.push(body.ctn[i]);
                          });
                      },
                      'falseFn':()=>{
                        donefinishCurp-=1;
                        util.tip('您当前网络异常，请稍后重试');
                      }
                    });
                }else{
                  that.xscroll.render();
                  that.pullup.complete();
                  //底部加载文字处理
                  $('.xs-plugin-pullup-container').html('没有更多了');
                }
            }
          });

          //商品待评价
          that.getList({
            'url':root.COMMENT_API_PATH + 'goods/getCommentList',
            'curpg':that.goodsCurp,
            'len':that.len,
            'succFn':(body)=>{
                //没有数据的时候
                if (body.tim == 0) {
                  that.goodsNoshow = true;
                } else {
                  $.each(body.ctn, function(i, v) {
                    body.ctn[i].href = 'discuss.html?gdsid=' + v.gdsid + '&spgid=' + v.spgid + '&type=2';
                  })
                  that.goods = body.ctn;
                  if(body.tpg>0){
                     that.goodsTotalp = body.tpg;
                  }
                }
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
			    util.deleteHeadBtn();
        }
      },
      components: {
        Headtop
      },
      filters: {
        //时间格式化
        formatTime: function(value) {
          if (value == '') {
            return false;
          }
          return util.formateDate(value, 'yyyy-MM-dd hh:mm:ss');
        }
      },
      methods: {
        /**
				 * 商品列表点击跳转
				 */
        goodsHrefToUrl(item){
          let type = item.odtp;
          if(type===2){ //如果是管家，跳转到管家服务详情页
            let param = {
              //订单id
              otn:item.otn,
              //下单时间
              dodt:item.otntm,
              //订单类型
              odtype:item.subodtp,
              isJkxOtn:1
            }
            util.href('ordersgjdetail.html',param);
          }else{ //如果是线上线下,跳转到中台订单详情页
            let odtype=null;
            if(item.odtp===0){
              odtype = 201;
            }else if(item.odtp===1){
              odtype = 202;
            }
            let param = {
              //订单id
              oid:item.otn,
              //下单时间
              dodt:item.otntm,
              //订单类型
              odtype:odtype,
              //配送单号
              shippingGroupId:item.spgid
            }
            util.href('ordersztdetail.html',param);
          }
        },
        /**
				 * 待评价服务列表点击跳转
				 */
        serviceHrefToUrl(item){ //服务的跳转到管家详情页
          let param = {
              //订单id
              otn:item.otn,
              //订单类型
              odtype:item.subodtp,
              //下单时间
              dodt:item.otntm,
              isJkxOtn:1
            }
            util.href('ordersgjdetail.html',param);
        },
        /**
				 * 获取待评价信息
				 * @parma {object} 参数集合
         * @parma {number}{1} object.url 请求接口的地址
				 * @parma {number}{1} object.curpg 当前页码
				 * @parma {number}{10} object.len 分页每次条数
				 * @parma {fucntion}{()=>{}} obj.succFn 成功后的回调函数
				 * @parma {fucntion}{()=>{}} obj.falseFn 失败后的回调函数
				 */
        //商品
        //surl: root.COMMENT_API_PATH + 'goods/getCommentList',
        //服务
        //surl: root.COMMENT_API_PATH + 'service/getCommentList',
        //已评价
        //surl: root.COMMENT_API_PATH + 'goods/getCommentFinishList',
        getList: function(data) {
          var that = this;
          // 请求...
          util.api({
            surl: data.url,
            data: {
              curpg: data.curpg,
              len: data.len
            },
            type: 'get',
            success: function(response) {
              var rpco = response.rpco,
                body = response.body || {};
                // 处理
                switch (rpco) {
                  case 200:
                    data.succFn&&data.succFn(body);
                    break;
                  default:
                    data.falseFn&&data.falseFn();
                }
            }
          });
        },
        tab: function(index) {
          let that = this;
          if (that.active !== index) {
            that.active = index;
          }
          //重置分页数据
          that.goodsCurp = 1;
          that.serviceCurp = 1;
          that.donefinishCurp = 1;

          //滚动到最顶部
          that.xscroll.scrollTop(0,0,'ease');
          //隐藏加载提示文字
          that.xscroll.unplug(that.pullup);
          // //重新渲染滚动插件
          // that.xscroll.render();
          // //loading complete
          // that.pullup.complete();

          if(that.active===0){
            //商品待评价
            that.getList({
              'url':root.COMMENT_API_PATH + 'goods/getCommentList',
              'curpg':that.goodsCurp,
              'len':that.len,
              'succFn':(body)=>{
                  //没有数据的时候
                  if (body.tim == 0) {
                    that.goodsNoshow = true;
                  } else {
                    $.each(body.ctn, function(i, v) {
                      body.ctn[i].href = 'discuss.html?gdsid=' + v.gdsid + '&spgid=' + v.spgid + '&type=2';
                    })
                    that.goods = body.ctn;
                    if(body.tpg>0){
                      that.goodsTotalp = body.tpg;
                    }
                  }
                  this.$nextTick(()=>{
                    //重新渲染滚动插件
                    that.xscroll.render();
                  });
              },
              'falseFn':()=>{
                util.tip('您当前网络异常，请稍后重试');
              }
            });
          }else if(that.active===1){
             //服务待评价
            that.getList({
              'url':root.COMMENT_API_PATH + 'service/getCommentList',
              'curpg':that.serviceCurp,
              'len':that.len,
              'succFn':(body)=>{
                  //没有数据的时候
                  if (body.tim == 0) {
                    that.serviceNoshow = true;
                  } else {
                    $.each(body.ctn, function(i, v) {
                      body.ctn[i].href = 'discuss.html?svid=' + v.svid + '&otn=' + v.otn + '&type=1';
                    });
                    that.service = body.ctn;
                    if(body.tpg>0){
                      that.serviceTotalp = body.tpg;
                    }
                  }
                  this.$nextTick(()=>{
                    //重新渲染滚动插件
                    that.xscroll.render();
                  });
              },
              'falseFn':()=>{
                util.tip('您当前网络异常，请稍后重试');
              }
            });
          }else if(that.active===2){
            //已完成评价
            that.getList({
              'url':root.COMMENT_API_PATH + 'goods/getCommentFinishList',
              'curpg':that.donefinishCurp,
              'len':that.len,
              'succFn':(body)=>{
                  //没有数据的时候
                  if (body.tim == 0) {
                    that.donefinishNoshow = true;
                  } else {
                    that.donefinish = [...body.ctn];
                    if(body.tpg>0){
                      that.donefinishTotalp = body.tpg;
                    }
                  }
                  this.$nextTick(()=>{
                    //重新渲染滚动插件
                    that.xscroll.render();
                  });
              },
              'falseFn':()=>{
                util.tip('您当前网络异常，请稍后重试');
              }
            });
          }
        }
      },
      watch:{
        goods(){
          let that = this;
          that.$nextTick(()=>{
              //重新渲染滚动插件
              that.xscroll.render();
							//不存在数据交互处理
							if(that.goods.length === 0){
                that.goodsNoshow = true;
							}else{
								that.goodsNoshow = false;
              }
              //分页数小于1页的，不显示加载中语句
              if(that.goodsTotalp<=1){
                that.xscroll.unplug(that.pullup);
              }else{
                that.xscroll.plug(that.pullup);
                that.pullup.complete();
              }
					});
        },
        service(){
          let that = this;
          that.$nextTick(()=>{
              //重新渲染滚动插件
              that.xscroll.render();
							//不存在数据交互处理
							if(that.service.length === 0){
                that.serviceNoshow = true;
							}else{
								that.serviceNoshow = false;
              }
               //分页数小于1页的，不显示加载语句
              if(that.serviceTotalp<=1){
                that.xscroll.unplug(that.pullup);
              }else{
                that.xscroll.plug(that.pullup);
                that.pullup.complete();
              }
					});
        },
        donefinish(){
          let that = this;
          that.$nextTick(()=>{
              //重新渲染滚动插件
              that.xscroll.render();
							//不存在数据交互处理
							if(that.donefinish.length === 0){
                that.donefinishNoshow = true;
							}else{
								that.donefinishNoshow = false;
              }
               //分页数小于1页的，不显示加载语句
              if(that.donefinishTotalp<=1){
                that.xscroll.unplug(that.pullup);
              }else{
                that.xscroll.plug(that.pullup);
                that.pullup.complete();
              }
					});
        }
      }
  }
</script>
<style lang="less">
  .mixinfont (@font){
    font-size: @font;
    [data-dpr="2"] & { font-size: @font * 2; }
    [data-dpr="3"] & { font-size: @font * 3; }
  }
  #J_Scroll{
    width: 10rem;
    min-width: 320px;
    position: absolute;
  }
  /*加载中的文字*/
  .xs-plugin-pullup-container{
      width: 100%;
      text-align: center;
      .mixinfont(12px);
      line-height:1.066667rem /* 80/75 */;
  }
  html,body{
    background:#f3f5f7!important;
    font-family: 'PingFangSC-Regular',sans-serif;
    .discuss-list-tab{
      height:(88/75)*1rem;
      background:#ffffff;
      .mixinfont(15px);
      position:relative;
      a{
        float:left;
        width: 33.3%;
        display:inline-block;
        position: relative;
        text-align: center;
        height: (82/75)*1rem;
        line-height:(82/75)*1rem;
        top:.026667rem /* 2/75 */;

        span{
          padding: 0 .08rem;
          display: inline-block;
          height: (82/75)*1rem;
          overflow: hidden;
          border-bottom: (4/75)*1rem solid #fff;
        }
      }
    }
    .discuss-list-tab .active span{
      color: #ff4b46;
      border-bottom: (4/75)*1rem solid #ff4b46;
    }
    .discuss-list-tab:after,.discuss-list-top:after{
      position:absolute;
      font-size: 0;
      content: " ";
      clear: both;
      height: 1px;
      width:100%;
      background: #e0e0e0;
      left:0;
      bottom:0;
    }
    .discuss-list-list{
      li{
        margin-bottom:(20/75)*1rem;
        background:#fff;
        .discuss-good-top{
          padding:(20/75)*1rem 0 (20/75)*1rem 0;
          margin-left: (32/75)*1rem;
          .mixinfont(14px);
          line-height:(42/75)*1rem;
          color:#333;
          background:#fff;
          border-bottom:1px #ddd solid;
          img{
            float:left;
            width:(88/75)*1rem;
            height:(88/75)*1rem;
            overflow:hidden;
            margin:0 (28/75)*1rem 0 0;
          }
          .discuss-good-info{
            float:left;
            width:(560/75)*1rem;
            div{
              margin-top: (20/75)*1rem;
              span{
                margin:(7/75)*1rem (7/75)*1rem 0 0;
                  float:left;
                  width:(32/75)*1rem;
                  height:(30/75)*1rem;
                  overflow:hidden;
                  background:url(//gfs12.gomein.net.cn/T1IuJvB7L_1RCvBVdK.jpg) 0 0 no-repeat;
                  background-size:100% 100%;
              }
              .active{
                background-image:url(//gfs12.gomein.net.cn/T1OixvBThv1RCvBVdK.jpg);
              }
            }
          }
        }
        .discuss-con{
          .mixinfont(14px);
          margin-left:(32/75)*1rem;
          line-height: (44/75)*1rem;
          padding:(20/75)*1rem 0;
          color:#333;
          div:nth-child(1){
            .mixinfont(11px);
            color:#999;
          }
          .img-list{
              margin-top: 0.266667rem;
              li{
                float: left;
                margin-right:(20/75)*1rem;
                img{
                  width: (156/75)*1rem;
                  height: (156/75)*1rem;
                }
              }
            }
        }
        .discuss-list-top{
          .mixinfont(14px);
          padding: (8/75)*1rem (30/75)*1rem 0 (24/75)*1rem;
          line-height:(80/75)*1rem;
          color:#666;
          position: relative;
          img{
            float:left;
            width:(42/75)*1rem;
            height:(34/75)*1rem;
            overflow:hidden;
            margin:(24/75)*1rem (16/75)*1rem 0 0;
          }
          span{
            float:left;
          }
          span:nth-child(3){
            color:#ffa800;
            float:right;
          }
        }
        .discuss-list-info{
          padding: (40/75)*1rem 0 0 0;
          margin-left:(30/75)*1rem;
          .f-l{
            float:left;
          }
          img{
            float:left;
            width:(100/75)*1rem;
            height:(96/75)*1rem;
            border: (1/75)*1rem #e3e3e3 solid;
            margin:0 (20/75)*1rem (42/75)*1rem 0;
          }
          .discuss-list-goods{
            float:left;
            width:(567/75)*1rem;
            color:#666;
            .mixinfont(12px);
            line-height:(38/75)*1rem;
            div:nth-child(1){
              font-weight:bold;
              color:#333;
              .mixinfont(14px);
              line-height:(36/75)*1rem;
              max-height:(72/75)*1rem;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
            div:nth-child(2){
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
        }
        .discuss-list-btn{
          float:right;
          margin:(15/75)*1rem (30/75)*1rem (16/75)*1rem 0;
          width:(154/75)*1rem;
          height:(54/75)*1rem;
          line-height:(54/75)*1rem;
          text-align:center;
          border:1px #ff4b46 solid;
          border-radius:22px;
          color: #ff4b46;
          .mixinfont(14px);
        }
        .discuss-list-info:after{
          display: block;
          font-size: 0;
          clear:both;
          content: " ";
          height: 1px;
          background: #e3e3e3;
        }
      }
    }
    .nodata{
      width: 100%;
      text-align: center;
      padding-top: (138/75)*1rem;
      .mixinfont(16px);
      i {
        float: left;
        width: 100%;
        height: (494/75)*1rem;
        background: url(//gfs11.gomein.net.cn/T1QsDvBX_T1RCvBVdK.png) no-repeat center top;
        background-size:6.4rem 5.813333rem;
      }
    }
  }
</style>