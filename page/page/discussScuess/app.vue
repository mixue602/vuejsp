<template>
    <div class="discuss-scuess-warp">
      <!-- 公共头部 -->
      <header-component :title="title"></header-component>
      <div class="discuss-scuess-notice">
        <div class="wxts wxtsup">感谢你的用心评价！</div>
        <div class="wxts">你的言评将帮助更多的人~</div>
        <div class="dismore">
          <a href="discussList.html" class="discuss-scuess-more">评价更多商品</a>
        </div>
      </div>
      <div class="discuss-scuess-title"><span>美豆</span>兑换服务</div>
      <ul class="discuss-scuess-list">
        <li class="clearfix" v-for="(cws,ind) in cwList" @click="todetail(ind)">
          <div class="discuss-scuess-kind"><span>{{cws.couponType}}</span></div>
          <div class="discuss-scuess-info">
            <div class="discuss-scuess-price"><span>￥</span>{{cws.couponAmount}}</div>
            <div class="discuss-scuess-convert">
              <div>满{{cws.fullAmount}}元可用</div>
              <div>仅限清洗服务使用</div>
            </div>
            <div class="discuss-scuess-icon"></div>
            
          </div>
          <div class="discuss-scuess-btnBox">
            <div>{{cws.needGomedo}}美豆兑换</div>
            <div>
              <a href="javascript:;" class="discuss-scuess-btn" @click.stop="cwexchg(ind)">立即兑换</a>
            </div>
          </div>
        </li>
      </ul>
    </div>
</template>
<script type="text/ecmascript-6">
    import headerComponent from '../../components/HeaderComponent'
    let root = window || {},
        util = root.util || {};
    export default {
        data () {
            return {
                title:"评价成功",
                body:{},
                cwList:[]
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
                that.getCWList();
            },
            //获取兑换券列表
            getCWList: function() {
                var that = this;
                util.api({
                    //  美豆总数接口 /gomedo/yf/info?
                    //本地
                    //surl: '/resources/json/gomedocoupon.json',
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
                        needGomedo:that.cwList[ind].needGomedo
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
                                    {res:1,meidou:that.cwList[ind].needGomedo}
                                );
                                break;
                            case 201:
                                util.tip('201');
                                //跳转到兑换结果页面
                                util.href('./clearweedresult.html',
                                    {res:0}
                                );
                                break;
                            case 40001:
                                util.tip('40001');
                                //跳转到兑换结果页面
                                util.href('./clearweedresult.html',
                                    {res:0}
                                );
                                break;
                            default:
                                util.tip('请求失败');
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
                $('.goBack').on('click',function () {
                    util.href('./discussList.html');
                })
            }
        },
        components: {
            headerComponent
        }
    }
</script>
<style lang="less" type="text/less">
  .mixinfont (@font){
    font-size: @font; 
    [data-dpr="2"] & { font-size: @font * 2; } 
    [data-dpr="3"] & { font-size: @font * 3; } 
  }
  html,body{
    background:#f5f5f5!important;
  }
  .discuss-scuess-warp{
    margin-top: (92/75)*1rem;
    font-family: 'PingFangSC-Regular', sans-serif;
    .mixinfont(14px);
    .discuss-scuess-notice{
      height:(185/75)*1rem;
      background:url(//gfs10.gomein.net.cn/T1ghCvBs_v1RCvBVdK.jpg) 0 0 no-repeat;
      background-size:100%;
      /*padding:(15/75)*1rem 0 0 (110/75)*1rem;
      line-height:(96/75)*1rem;*/
      color:#fff;
      .dismore {
        text-align: center;
        margin-top: .1rem;
        .discuss-scuess-more{
          display:inline-block;
          width:(240/75)*1rem;
          height:(44/75)*1rem;
          text-align:center;
          line-height:(44/75)*1rem;
          color:#ffed55;
          border:(1/75)*1rem #ffed55 solid;
          border-radius:18px;
          /*margin-left:(160/75)*1rem;*/
        }
      }

      .wxts {
        line-height: .6rem;
        text-align: center;
      }
      .wxts {
        padding-top: .1rem;
      }
    }
    .discuss-scuess-title{
      color:#333;
      .mixinfont(16px);
      line-height:(32/75)*1rem;
      text-align:center;
      padding-top:(60/75)*1rem;
      span{
        color:#ff4b46;
      }
    }
    .discuss-scuess-list{
      padding: 0 (24/75)*1rem;
      li{
        height:(192/75)*1rem;
        margin-top: (30/75)*1rem;
        background: #fff;
        .discuss-scuess-kind{
          float:left;
          width:(66/75)*1rem;
          height:100%;
          position:relative;
          background: url(//gfs13.gomein.net.cn/T1dQhvBXVv1RCvBVdK.png) 100% 0  no-repeat;
          background-size:(66/75)*1rem (192/75)*1rem; 
          span{
            .mixinfont(15px);
            color:#fff;
            position:absolute;
            width:(30/75)*1rem;
            left:(16/75)*1rem;
            top:50%;
            -webkit-transform:translateY(-50%);
          }
        }
        .discuss-scuess-info{
          float:left;
          padding: 0 0 0 (24/75)*1rem;
          position: relative;
          .discuss-scuess-price{
            float:left;
            margin-right:(20/75)*1rem;
            line-height:(140/75)*1rem;
            color:#00cfee;
            .mixinfont(36px);
            span{
              .mixinfont(15px);
              line-height:(162/75)*1rem;
            }
          }
          .discuss-scuess-convert{
            float:left;
            .mixinfont(15px);
            color:#00cfee;
            padding-top: (59/75)*1rem;
            line-height:(42/75)*1rem;
            position: relative;
            z-index:10;
            div:nth-child(2){
              color:#666;
              line-height:(38/75)*1rem;
              .mixinfont(12px);
            }
          }
          .discuss-scuess-icon{
            position:absolute;
            width:(116/75)*1rem;
            height:(102/75)*1rem;
            overflow:hidden;
            background:url(//gfs10.gomein.net.cn/T1.LdvBTKj1RCvBVdK.png) 0 0 no-repeat;
            background-size:(116/75)*1rem (102/75)*1rem;
            left:(333/75)*1rem;
            top: 0;
            z-index:0;
          }
        }
        .discuss-scuess-btnBox{
          float:right;
          width:(180/75)*1rem;
          padding-left:(14/75)*1rem;
          background:url(//gfs13.gomein.net.cn/T1aLKvBgbv1RCvBVdK.png) 0 0 no-repeat;
          background-size:(14/75)*1rem (192/75)*1rem;
          height:100%;
          line-height:(78/75)*1rem;
          color:#666;
          .mixinfont(12px);
          text-align:center;
          div:nth-child(1){
            padding-top:(22/75)*1rem;
          }
          a{
            display:block;
            width:(144/75)*1rem;
            height:(46/75)*1rem;
            border:(3/75)*1rem #5fd9eb solid;
            margin-left:(12/75)*1rem;
            background:#d2f9ff;
            color:#333;
            .mixinfont(14px);
            line-height:(44/75)*1rem;
            border-radius:18px;
            padding: 0 .05rem;

          }
        }
      }
    }
  }
</style>