<template>
    <div class="wapper wapper-bg">
        <header-component :title="title" class="bdr-bottom"></header-component>

        <div class="oTrack-con" v-if="showItemName=='order'">
            <div class="order-info">
                <img :src="gdiul" class="info-img" :onerror="defaultImg">
                <ul class="info-text">
                    <li v-show='serviceOrgName'><span>服务公司：<em>{{ serviceOrgName }}</em></span>
                        <!-- <a class="copy" @click="copy" href="javascript:;" v-bind:data-clipboard-text="detailResult.ordNm" class="copyBtn t15" id="copyBtn">复制</a> -->
                    </li>
                    <li v-show='serviceOrgPhone'><span>服务电话：<em>{{serviceOrgPhone}}</em></span></li>
                </ul>
            </div>
            <ul class="logis-detail">
                <li :class="{'logis-detail-first': index==0}" class="" v-for="(item,index) in sdfmclList" >
                    <div class="logis-detail-content bdr-bottom">
                        <div class="dispatching">
                            <div class="dispatching-con">
                                <p class="logis-detail-txt" v-html="item.orderState"></p>
                                <p class="logis-detail-txt" v-html="item.orderTip"></p>
                                <p class="logis-detail-time">{{item.sdfmtm |formatDate}}</p>
                                <!-- <p class="logis-detail-time" >{{item.servant.headIcon}}</p> -->
                            </div>
                            <div class="courier" v-show="item.orderState=='已派工'" v-if="headCanClick" @click="fnServant()"><img :src='servant.headIcon'></img></div>
                            <div class="courier" v-show="item.orderState=='已派工'" v-else ><img :src='servant.headIcon' :onerror="defaultHeadImg"></img></div>
                        </div>
                        <!--<div class="baidu-map" id="allmap" v-if='item.gps.gpsStart'></div>-->
                    </div>
                </li>

            </ul>
        </div>

</div>

    </div>
</template>
<script type='text/ecmascript-6'>
  var root = window || {},
    util = root.util || {};

  import headerComponent from "../../components/HeaderComponent";
  export default {
    data() {
        return {
            gdiul:'//gfs13.gomein.net.cn/T1.ZYQBChT1RCvBVdK.png',
            defaultImg: 'this.src="//gfs13.gomein.net.cn/T1.ZYQBChT1RCvBVdK.png"',
            defaultHeadImg:'this.src="//gfs13.gomein.net.cn/T1oLJvBsCT1RCvBVdK.png"',
            title: "订单轨迹",
            showItemName:'order',
            // hrefParma:{},
            orderInfo:{},
            serviceOrgName:'',
            serviceOrgPhone:'',
      			sdfmclList:[], //送装信息集合
            hrefParma:util.getHrefParma(),
            servant:{
              headIcon:"//gfs13.gomein.net.cn/T1oLJvBsCT1RCvBVdK.png",
              id:"",
              name:"",
              serviceCount:null,
              starRated:null,
              type:null
            },
            serotn:'',
            headCanClick:false,
            serviceOrgId:'',//服务商ID
      			orderstate: {
      				// 线上实物订单
      				sw:{
      					1:'待支付',
      					2:'待发货',
      					4:'已妥投',
      					5:'订单失败',
      					8:'申请退款',
      					9:'已发货',
      					10:'退款成功',
      					11:'退款失败',
      					12:'订单成功'
      				},
      				//延保订单状态
      				1:'待付款',
      				2:'投保成功',
      				4:'投保成功',
      				5:'已取消',
      				7:'投保失败',
      				//延保订单状态
      				33:'待付款',
      				34:'支付成功',
      				35:'待预约',
      				36:'预约成功',
      				37:'交易失败',
      				65:'审核通过',
      				66:'下单成功',
      				97:'待评论',
      				98:'ALREADY_COMMENT',
      				353:'',
      				354:'已派工',
      				355:'已完成',
      				356:'无法完成',
      				385:'已出库',
      				386:'预约无法执行',
      				387:'预约无法执行',
      				388:'已妥投',
      				389:'已拒收'
      			},
      			// 订单状态描述
      			orderstateMsg: {
      				//线上实物订单
      				sw:{
      					1:'您的订单已提交成功，请及时支付订单',
      					2:'您的订单已支付成功，正在安排发货中',
      					4:'您的订单已妥投，如非本人收货，请及时联系客服',
      					5:'您的订单未及时支付，已取消订单',
      					8:'您的订单已申请退款成功，等待审核中',
      					9:'您的订单已发货，请保持通话畅通',
      					10:'您的订单已退款成功',
      					11:'您的订单已退款失败'
      				},
      				//延保订单状态
      				1:'请支付费用',
      				2:'投保成功',
      				4:'投保成功',
      				5:'已取消',
      				7:'投保失败',
      				//延保订单状态
      				33:'{0}完成，{1}支付{2}费用。',
      				34:'已支付成功，希望能够再次为您服务。',
      				35:'您还未预约配送时间及地点，未开始配送。',
      				36:'已分配配送时间及地点，待确认。',
      				37:'交易失败，不能完成服务！',
      				65:'您的订单已经审核通过，我们将尽快安排工程师上门。',
      				66:'我们会尽快与您取得联系确认上门时间，请保持电话通畅。',
      				97:'待评论',
      				98:'ALREADY_COMMENT',
      				353:'',
      				354:'指派了工程师【{1}】上门，工程师电话{3}',
      				355:'已支付成功，希望能够再次为您服务。',
      				356:'该服务暂时无法完成！',
      				385:'您的订单已出库，配送员{1},电话{3}为您配送，请保持电话畅通。',
      				386:'您的预约由于当前服务能力受限，无法为您完成配送，非常抱歉。',
      				387:'您的预约由于当前服务能力受限，无法为您完成配送，非常抱歉。',
      				388:'您的订单已配送完成，感谢您对国美管家的支持，欢迎再次光临',
      				389:'订单配送失败，用户已拒收。'
      			}

        }
    },
    filters: {
        formatDate(time) {
            return util.formateDate(time, 'yyyy-MM-dd hh:mm:ss');
        }
    },
    created() {
        this.hrefParma = util.getHrefParma();//获取url参数
        this._getOrderProcess();
        if(util.isApp()){
          util.deleteHeadBtn();
        }
    },
    mounted(){
        // this._showMap();

    },
    updated(){
    },
     methods:{
         itemShow(name){
             this.showItemName = name;
         },
        // fnServant() {
        //       var that = this;
        //       if (!that.servant.id) return;
        //       util.href('discussPeople.html',{
        //           // 订单id
        //           otn:that.hrefParma.otn,
        //           // 服务人员id
        //           epnb:that.servant.id,
        //           // 订单类型
        //           svid:that.hrefParma.odtype,
        //           // 下单时间
        //           dodt:that.hrefParma.dodt,
        //           // 服务商id
        //           svpid:'',
        //           // 服务类型 1.配送 2.安装 3.服务
        //           svty:1
        //       })
        //   },
//这个是后来的
          // 管家服务人员评价
            fnServant() {
                var that = this;
                if (!that.servant.id) return;
                var that = this,
                    odtp;
                    // 订单类型
                    if (that.hrefParma.odtype == 201) {
                        odtp = 0;
                    }else if(that.hrefParma.odtype == 202){
                        odtp = 1;
                    }else{
                        odtp = 2;
                    };
                util.href('discussPeople.html',{
                    // 订单id
                    otn:that.hrefParma.otn,
                    // 服务人员id
                    epnb:that.servant.id,
                    // 订单类型
                    svid:odtp,
                    // 下单时间
                    dodt:that.hrefParma.dodt,
                    // 服务商id
                    svpid:that.serviceOrgId,
                    // 服务类型 1.配送 2.安装 3.服务
                    svty:3
                })
            },

            // 查询管家服务人员信息
            fnCxservant: function(epnb,dodt,serviceOrgId) {
                var that = this,
                    odtp;
                    // 订单类型
                    if (that.hrefParma.odtype == 201) {
                        odtp = 0;
                    }else if(that.hrefParma.odtype == 202){
                        odtp = 1;
                    }else{
                        odtp = 2;
                    };
                util.api({
                    surl:'/comment/yf/employee/getButlerComment',
                    data:{
                        // 订单id
                        otn:that.serotn,
                        // 服务人员id
                        epnb:that.servant.id,
                        // 订单类型
                        svid:3,
                        // 下单时间
                        dodt:that.hrefParma.dodt,
                        // 服务商id
                        svpid:that.serviceOrgId,
                        // 服务类型 1.配送 2.安装 3.服务
                        svty:3
                    },
                    type:'get',
                    success:function(response) {
                        var rpco = response.rpco,
                            body = response.body;

                        if (rpco == 200) {
                            that.headCanClick = true;
                            // 服务人员id
                            that.servant.id = body.epnb;
                            // 服务人员姓名
                            that.servant.name = body.epnm;
                            // 服务人员头像
                            that.servant.headIcon = body.epimg;
                            // 星星
                            that.servant.starRated = Math.round(body.tscore/body.tnum);
                        }
                     },
                    error:function(res){
                        util.tip('请求失败');
                    }
                })
            },


        // 请求配送进度，安装履历
        _getOrderProcess() {
            var that = this;
            util.api({
                surl:root.ORDER_API_PATH + 'etodsta',
                type:'get',
                data:{
                    otn:that.hrefParma.otn,
                    dodt:that.hrefParma.dodt,
					          isJkxOtn:that.hrefParma.isJkxOtn,
                    odtype:that.hrefParma.odtype

                },
                success:function(res) {
                    var rpco = res.rpco,//响应状态码
                        body = res.body || {};
                    // 处理
                    switch(rpco) {
                        case 200:
                            that.orderInfo = body;
                            that.serotn = body.ordNm;
                            that.serviceOrgName = body.serviceOrgName;
                            that.serviceOrgPhone = body.serviceOrgPhone;
                            that.sdfmclList = body.sdfmcl;
                            that.serviceOrgId = body.serviceOrgId;
                            if(body.servant){
                                that.servant = body.servant;
                                that.fnCxservant();

                            }

                			if(util.getHrefParma().odtype!=10485761){
                                   body.sobi && body.sobi.imgs.length>0 && (that.gdiul = body.sobi.imgs[0]);
      								that.sdfmclList.forEach(function(item,index){
      									var txtDesc = that.orderstateMsg[item.sdfmst];
                                        if(item.sdct){
          									item.sdct.forEach(function(v,i){
          										if(item.sdfmst == 354){
          											if(i == item.sdct.length-1){
                                                        if(v){
                              								txtDesc = txtDesc.replace('{'+i+'}','<a  href="tel:'+v+'" style="color:blue">'+v+'</a>')
                                                        } else{
                                                           txtDesc = '服务商应安排了工程师为您提供上门服务，请您保持手机畅通，工程师将和您取得联系。';
                                                        }
                									}
            									}
            									txtDesc = txtDesc.replace('{'+i+'}',v);
    								        });
          									that.$set(item,'orderTip',txtDesc);
          									that.$set(item,'orderState',that.orderstate[item.sdfmst]);
                                        }
      								});
                                }else{
                                    that.gdiul = body.gdiul;
      								that.sdfmclList.forEach(function(item,index){
      									that.$set(item,'orderTip',that.orderstateMsg.sw[item.sdfmst]);
      									that.$set(item,'orderState',that.orderstate.sw[item.sdfmst]);
      								});
                                   that.sdfmclList = that.sdfmclList.reverse();
                                }

                        break;
                        case 401:
                            util.tip('服务器繁忙，请稍后再试',2000);
                            break;
                        default:
                            util.tip('请求失败');
                    }
                },
                error:function(res){
                    util.tip('请求失败');
                }
            })
        }
    },
    components: {
      headerComponent
    }
  };
</script>
<style lang="less">
  @import "../../util/fs.less";
  .header{background:#fff; }
  .oTrack-nav{
      background: #fff;
      display:flex;
      display: -webkit-flex; /* Safari */
      li{
          height: 1.12rem;
          font-size: 14px;
          color: #666;
          text-align: center;
          flex:1;
          a{position:relative;margin-top: .16rem;display:inline-block;height: .96rem}
          a.bdr-bottom:after{bottom:0;left: .106667rem;width:1.28rem;background: #FF4B41;}
        }
      li.active a{
          color: #FF4B41;
      }

  }
  .oTrack-con{
      .order-info{
          background: #fff;
          padding:.293333rem .4rem;padding-bottom: .266667rem;display: flex;
          align-items:center;
          .info-img{width: 1.6rem;height: 1.626667rem;}
          .info-text{
              display: flex;
              display: -webkit-flex; /* Safari */
              flex-direction:column;
              justify-content:center;
              flex: 1;
              li{line-height: .453333rem;font-size:12px;color: #999;
              margin-left: .186667rem;
              position: relative;
                    em{color: #151515; }
                    .tel{color: #4A90E2}
                    .copy{border: .013333rem solid #999;text-align: center;width: 1.04rem;height: .506667rem;line-height: .533333rem;color: #999;position: absolute;bottom: 0;right: 0;}
               }
          }
      }
      .logis-detail{
          background: #fff;
          margin-top:.266667rem;
          padding-top: .266667rem;
          li{
            border-left: 1px solid #D8D8D8;position: relative;
            margin-left: .533333rem;
            padding:0 .43rem .266667rem .56rem;
            .logis-detail-content{
                padding-bottom:.266667rem;
                position: relative;
                top:-.08rem;
                line-height: .48rem;
                p{font-size: 13px;color: #999;}
                .dispatching{
                    display: flex;
                    align-items: flex-start;
                    .dispatching-con{flex: 1}
                    .courier{
                        width: 1.6rem;height: 1.6rem;
                        img{width:100%;height: 100%;border-radius: 50%;}
                    }
                }
                .baidu-map{margin-top: .18rem;width: 8.613333rem;height: 3.733333rem}
            }
            &:after{
                content: '';
                display: inline-block;
                position: absolute;
                left: -.2rem;
                top: 0;
                width: .266667rem;
                height: .266667rem;
                border-radius: 50%;
                background: #999;
                border: 2px solid #EEE;
            }
          }

          .logis-detail-first{
              .logis-detail-txt{
                  color:#3AA11A;
              }
              &:after{background: #3AA11A;}
          }
      }


  }
</style>


