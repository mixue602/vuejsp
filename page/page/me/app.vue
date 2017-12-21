<template>
  <div class="wapper">
    <!-- 头部 -->
    <div class="userhead">
      <div class="userwrap" @click="addevent('user')">
        <div class="userheadimg">
          <img onerror="javascript:this.src='//gfs12.gomein.net.cn/T1B_CgB7CT1RCvBVdK.png'" :src="imgsrc"/>
        </div>
        <h3>{{body.nick}}</h3>
        <div class="usergrade"><span>{{body.memberLevel}}</span><a href="#">查看会员</a></div>
      </div>
      <div class="setup" @click="addevent('user')"></div>
    </div>
    <!-- 我的订单 -->
    <div class="myorder">
        <h3>我的订单</h3>
        <p @click="addevent(0)">查看全部订单<span></span></p>
    </div>
    <div class="myorderlist">
       <ul class="bdr-top">
         <li>
           <a @click="addevent(2)">
           <div class="orderimg">
             <span v-if="body.noPaymentNum>0" :class="{w:body.noPaymentNum>99}">{{maxNum(body.noPaymentNum)}}</span>
             <img src="//gfs11.gomein.net.cn/T1IhZvBgCT1RCvBVdK.png" />
           </div>
             <p>去支付</p>
           </a>
         </li>
         <li>
           <a @click="addevent(302)">
            <div class="orderimg">
             <span v-if="body.reminderNum>0" :class="{w:body.reminderNum>99}">{{maxNum(body.reminderNum)}}</span>
             <img src="//gfs13.gomein.net.cn/T1dDxvB4b_1RCvBVdK.png" />
            </div>
             <p>去催单</p>
           </a>
         </li>
         <li>
           <a @click="addevent('qupingjia')">
           <div class="orderimg">
             <span v-if="body.appraiseNum>0" :class="{w:body.appraiseNum>99}">{{maxNum(body.appraiseNum)}}</span>
             <img src="//gfs11.gomein.net.cn/T10DdvBXJT1RCvBVdK.png" />
           </div>
             <p>去评价</p>
           </a>
         </li>
         <li>
           <a @click="addevent('tuikuanshouhou')">
             <div class="orderimg">
                <span v-if="body.refundOrderNum>0" :class="{w:body.refundOrderNum>99}">{{maxNum(body.refundOrderNum)}}</span>
                <img src="//gfs12.gomein.net.cn/T1kLJvB_C_1RCvBVdK.png" />
             </div>
             <p>退款/售后</p>
           </a>
         </li>
         </ul>
         <ul class="bdr-top">
         <li>
           <a @click="addevent(11)">
           <div class="orderimg">
             <span v-if="body.logisticsNum>0" :class="{w:body.logisticsNum>99}">{{maxNum(body.logisticsNum)}}</span>
             <img src="//gfs10.gomein.net.cn/T1ILxvByx_1RCvBVdK.png" />
           </div>
             <p>查物流安装</p>
           </a>
         </li>
         <li>
           <a @click="addevent(301)">
           <div class="orderimg">
             <span v-if="body.installNum>0" :class="{w:body.installNum>99}">{{maxNum(body.installNum)}}</span>
             <img src="//gfs13.gomein.net.cn/T1WhhvB5K_1RCvBVdK.png" />
           </div>
             <p>预约安装</p>
           </a>
         </li>
        <li>
           <a @click="addevent(303)">
           <div class="orderimg">
             <span v-if="body.maintainNum>0" :class="{w:body.maintainNum>99}">{{maxNum(body.maintainNum)}}</span>
             <img src="//gfs12.gomein.net.cn/T1yhxvBjxv1RCvBVdK.png" />
           </div>
             <p>售后维修申请</p>
           </a>
         </li>
         <li>
           <a @click="addevent('wodeshebei')">
           <div class="orderimg">
             <span v-if="body.deviceNum>0" :class="{w:body.deviceNum>99}">{{maxNum(body.deviceNum)}}</span>
             <img src="//gfs10.gomein.net.cn/T11DJvB_V_1RCvBVdK.png" />
           </div>
             <p>我的设备</p>
           </a>
         </li>
       </ul>
    </div>
    <!-- 虚拟 -->
    <div class="fictitious">
      <ul>
        <li>
          <a @click="addevent('wodemeidou')">
            <span>{{compeasNum}}</span>
            <p>我的美豆</p>
          </a>
        </li>
        <li>
          <a @click="addevent('youhuiquan')">
            <span>{{comcouponNum}}</span>
            <p>优惠券</p>
          </a>
        </li>
        <li>
          <a @click="addevent('huiyuanka')">
            <span>{{commemberCardNum}}</span>
            <p>会员卡</p>
          </a>
        </li>
        <li>
          <a @click="addevent('dianzifapiao')">
            <span>{{comnvoiceNum}}</span>
            <p>电子发票</p>
          </a>
        </li>
      </ul>
    </div>
    <!-- 待评价商品 -->
    <div class="commoditygoods">
      <div class="goods-title bdr-bottom">
        <h3 @click="addevent('qupingjia')">待评价商品</h3>
        <p v-if="body.commentGoodNum>0">您有<a @click="addevent('qupingjia')">{{body.commentGoodNum}}件</a>待评价商品，评价完成最高可获得<a @click="addevent('wodemeidou')">{{body.getPeasNum}}</a>美豆</p>
      </div>
      <div class="goods">
        <ul v-if="body.commentGoodsItem && body.commentGoodsItem.length>0">
          <li v-for="(v,i) in body.commentGoodsItem" :key="i">
            <img v-if="v.gdiul" :src="v.gdiul" />
            <img v-else src="//gfs12.gomein.net.cn/T1vtYjBChT1RCvBVdK" />
            <a @click="goodsevent(v.gdsid,v.spgid)">写评价</a>
          </li>
        </ul>
        <p v-else>您目前没有待评价的商品！</p>
      </div>
    </div>
    <div class="service">
         <li class="bdr-bottom item">
           <a  @click="addevent('kefuzhongxin')">
             <img src="//gfs12.gomein.net.cn/T1m_hvBgE_1RCvBVdK.png" />
             <p>客服中心</p>
           </a>
         </li>
         <li class="bdr-bottom item">
           <a @click="addevent('wodeshuomingshu')">
             <img src="//gfs12.gomein.net.cn/T1wLEvB7Zj1RCvBVdK.png" />
             <p>我的说明书</p>
           </a>
         </li>
         <li class="bdr-bottom item">
           <a @click="addevent('fujinmendian')">
             <img src="//gfs10.gomein.net.cn/T1I9LvBsdg1RCvBVdK.png" />
             <p>附近门店</p>
           </a>
         </li>
         <li class="bdr-bottom item">
           <a @click="addevent('dizhiguanli')">
             <img src="//gfs11.gomein.net.cn/T1rhJvBs_g1RCvBVdK.png" />
             <p>地址管理</p>
           </a>
         </li>
         <li class="bdr-bottom item">
           <a @click="addevent('huiyuanka')">
             <img src="//gfs11.gomein.net.cn/T1whJvBjLg1RCvBVdK.png" />
             <p>卡号绑定</p>
           </a>
         </li>
         <li class="bdr-bottom item">
           <a @click="addevent('zhanghuanquan')">
             <img src="//gfs11.gomein.net.cn/T1h_ZvB__v1RCvBVdK.png" />
             <p>账户安全</p>
           </a>
         </li>
         <li class="bdr-bottom item">
           <a @click="addevent('shoufeibiaozhun')">
             <img src="//gfs11.gomein.net.cn/T1uyW_BmbT1RCvBVdK.png" />
             <p>收费标准</p>
           </a>
         </li>
         <li class="bdr-bottom item"></li>
    </div>
    <foot-components :index="3"></foot-components>
  </div>
</template>
<script   type="text/ecmascript-6">

let root = window || {},
    util = root.util || {};  
    import FootComponents from "../../components/FootComponents"
export default {
  data() {
      return {
          info:{},
          body:{
            commentGoodsItem:[],
            peasNum:"",
          },
          mobile:'',  //用户手机号
          imgsrc:'',
          dirkf: false,//默认不显示在线客服
          wxuserinfo:'', //用户信息
      }
  },
  computed: {
    //我的美豆数量
    compeasNum (){
      let that=this,
          count=String(that.body.peasNum);
          if(count>10000){
           return count.substring(0,count.length-4)+'万'
          }else{
            return count
          }
    },
    //优惠券数量大于100
    comcouponNum (){
      let that=this,
          count=that.body.couponNum;
          if(count>100){
            return '100+'
          }else{
            return count
          }
    },
    //会员卡数量大于100
    commemberCardNum (){
      let that=this,
          count=that.body.memberCardNum;
          if(count>100){
            return '100+'
          }else{
            return count
          }
    },
    //电子发票数量大于100
    comnvoiceNum (){
      let that=this,
          count=that.body.nvoiceNum;
          if(count>100){
            return '100+'
          }else{
            return count
          }
    }
  },
  methods: {
    //我的订单99以上
    maxNum(str){
      if(str<=99){
        return str;
      }else if(str>99){
        return "99+"
      }
    },
    init: function() {
        let that = this;
        that.load();
    },
    //加载
    load: function() {
        // 加载用户详情
        this.getUserDetail();
    },
    //获取用户详情
    getUserDetail: function() {
        let that = this;
        // 请求数据
        util.api({
            surl: root.MB_API_PATH + 'userdtal',
            type: 'get',
            success: function(response) {
                var rpco = response.rpco;
                // 处理
                switch (rpco) {
                    // 正常
                    case 200:
                        let body = response.body || {};
                        that.mobile=body.mobile;
                        that.imgsrc = root.MB_API_PATH + 'getheader?id='+body["hporturl"];
                    break;
                    default:
                    break;     
                }
            }
        });
    },
    //点击写评价
    goodsevent:function(k,n){
      util.href('discuss.html',{gdsid:k,spgid:n,type:2});
    },
    //点击我的订单等，跳转页面
    addevent:function(value){
      switch(value) {
          //个人设置
          case "user":
            util.href('user.html');
          break;
          //查看全部订单
          case 0:
            util.href('orderall.html',{odcate:0});
          break;
          //去支付
          case 2:
            util.href('orderall.html',{odcate:2});
          break;
          //去催单
          case 302:
            util.href('orderall.html',{odcate:302});
          break;
          //去评价
          case "qupingjia":
            util.href('discussList.html');
          break;
          //退款/售后
          case "tuikuanshouhou":
            util.href('orderrefundall.html');
          break;
          //查物流安装
          case 11:
            util.href('orderall.html',{odcate:11});
          break;
          //预约安装
          case 301:
            util.href('orderall.html',{odcate:301});
          break;
          //售后维修申请
          case 303:
            util.href('orderall.html',{odcate:303});
          break;
          //我的设备
          case "wodeshebei":
            util.href('myequipment.html',{curpg:1,len:10});
          break;
          //电子发票
          case "dianzifapiao":
            util.href('electronicInvoice.html');
          break;
          //我的美豆
          case "wodemeidou":
            util.href('clearweed.html');
          break;
          //优惠券
          case "youhuiquan":
            util.href('coupons.html');
          break;
          //会员卡
          case "huiyuanka":
            util.href('acclist.html');
          break;
           //我的说明书
          case "wodeshuomingshu":
            util.href('mydirection.html');
          break;
          //客服中心
          case "kefuzhongxin":
            util.href('custservice.html');
          break;
          //附近门店
          case "fujinmendian":
            util.href('nearbystores.html');
          break;
          //地址管理
          case "dizhiguanli":
            util.href('address.html');
          break;
          //账户安全
          case "zhanghuanquan":
            root.localStorage.setItem("uctype","2");
            if(!this.mobile){
              util.tip("您需绑定手机号后，才可设置密码");
              setTimeout(function(){
                util.href('changephone.html',{setnew:1});
              },500)
            }else{
              util.href('changephone.html');
            }
          break;
          //收费标准
          case "shoufeibiaozhun":
            util.href('feescale.html');
          break;
      }
    }
  },
  created () {
      let that = this;
      that.init();
      //加载页面信息
      util.api({
          surl: root.USER_API_PATH  +'mine',
          type: 'get',
          data:'',
          success: function(response) {
              let rpco = response.rpco,
                  objcet = response.body || []; 
              switch(rpco) {
                  case 200:
                  //渲染页面信息
                  that.body=objcet;
                  break;
              }
          }
      });
  },
  components: {
    FootComponents
  }
}
</script>
<style lang="less">
@import '../../util/fs.less';
.wapper{
  background: #f3f5f7;
  padding-top:0;
  .userhead{
    width: 100%;
    height:5.2rem;
    background: url("//gfs11.gomein.net.cn/T1MhEvBCYg1RCvBVdK.png") no-repeat;
		-webkit-background-size: 100%;
    background-size: 100%;
    position: relative;
    .setup{
      width: .586667rem;
      height: .586667rem;
      background: url("//gfs12.gomein.net.cn/T1hDZvBTLv1RCvBVdK.png") no-repeat;
      -webkit-background-size: 100%;
      background-size: 100%;
      position: absolute;
      top: .266667rem;
      right: .266667rem;
    }
    .userwrap{
      width:2.506667rem;
      height: 3.413333rem;
      position: absolute;
      top:50%;
      left: 50%;
      margin: -1.553333rem 0 0 -1.706667rem;
      .userheadimg{
        width: 1.946667rem;
        height: 1.946667rem;
        background: rgba(255, 255, 255, 0.2);
        border-radius: .973333rem;
        margin-left: .72rem;
        img{
          display: inline-block;
          width: 1.733333rem;
          height: 1.733333rem;
          margin: .106667rem 0 0 .106667rem;
          border-radius: .973333rem;
        }
      }
      h3{
          .mixinfont(14px);
          color: #fff;
          margin: .25rem 0 .25rem 0;
          width: 3rem;
          margin-left: .24rem;
          text-align: center;
          white-space:nowrap;          /* 不换行 */
          overflow:hidden;               /* 内容超出宽度时隐藏超出部分的内容 */
          text-overflow:ellipsis;         /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
      }
      .usergrade{
        width: 1.653333rem;
        height: .453333rem;
        background: rgba(255, 255, 255, 0.2);
        margin-left: .813333rem;
        .mixinfont(9px);
        border-radius: .666667rem;
        line-height: .453333rem;
        text-align: center;
        white-space:nowrap;          /* 不换行 */
        overflow:hidden;
        span{
          display: inline-block;
          width: .453333rem;
          height: .453333rem;
          text-align: center;
          line-height: .453333rem;
          border-radius: .666667rem;
          background: #FCD355;
          color: #fff;
        }
        a{
          display:inline-block;
          width:1.2rem;
          text-align:center;
          color: #fff;
        }
      }
      }

  }
 
  .myorder{
    height:.88rem;
    line-height:.88rem;
    background: #fff;
    h3{
      float: left;
      color: #333;
      .mixinfont(14px);
      padding-left:.4rem;
    }
    p{
      float: right;
      color: #999;
      .mixinfont(12px);
      span{
        margin-left: .066667rem;
        margin-right: .4rem;
        display: inline-block;
        width: .133333rem/* 12/75 */;
        height: .266667rem /* 22/75 */;
        background: url("//gfs12.gomein.net.cn/T1RMLvBjhg1RCvBVdK.png") no-repeat;
        -webkit-background-size: 100%;
        background-size: 100%;
        vertical-align: middle;
      }
    }
  }
  .myorderlist{
    height: 3.733333rem;
    width: 100%;
    background: #fff;
    ul{
      height: 1.866667rem;
      display: flex;
      align-items:center;
      li{
        width: 25%;
        text-align: center;
        
        a{
          display: flex;
          flex-direction: column;
          align-items:center;
          justify-content:center;
          .orderimg{
            display: flex;
            flex-direction: column;
            align-items:center;
            justify-content:center;
            position: relative;
            width:.8rem;
            img{
              display: inline-block;
              width: .586667rem;
              margin-bottom: .093333rem;
            }
            span{
              display: inline-block;
              position: absolute;
              width:.373333rem;
              height:.373333rem;
              line-height:.373333rem;
              text-align: center;
              top: -.08rem;
              right: -0.1rem;
              border-radius: .666667rem;
              background: #ff4b41;
              color: #fff;
              .mixinfont(10px);
              z-index: 10;
            }
            span.w{
              width: .506667rem;
            }
          }
          p{
            .mixinfont(11px);
            color: #666; 
          }
        }
        
      }
    }
  }
  .fictitious{
    width: 100%;
    height: 1.866667rem;
    background: #fff;
    margin-top: .133333rem;
    ul{
      display: flex;
      align-items:center;
      li{
        width: 25%;
        height: 1.866667rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items:center;
        justify-content:center;
        span{
          .mixinfont(18px);
          color: #333;
        }
        p{
          .mixinfont(11px);
          color: #666; 
          margin-top: .2rem;
        }
      }
    }
  }
  .commoditygoods{
    width: 100%;
    height: 4.4rem;
    background: #fff;
    margin-top: .133333rem;
    .goods-title{
      height: .88rem;
      display: flex;
      align-items:center;
      justify-content:flex-start;
      h3{
        color: #333;
        .mixinfont(14px);
        padding-left: .4rem;
        width: 2.3rem;
      }
      p{
        .mixinfont(11px);
        width: 7.333333rem;
        color: #999999;
        white-space:nowrap;          /* 不换行 */
        overflow:hidden;               /* 内容超出宽度时隐藏超出部分的内容 */
        text-overflow:ellipsis;         /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
        a{
            color: #3AA11A;
          }
      }
    }
    .goods{
      height: 3.6rem;
      text-align: center;
      overflow: hidden;
      P{
        line-height: 3.6rem;
      }
      ul{
        li{
          width: 25%;
          height: 3.6rem;
          float: left;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items:center;
          img{
            display: inline-block;
            width: 1.733333rem;
            height:1.733333rem;
            margin: .386667rem 0 .08rem 0;
          }
          a{
            display: inline-block;
            width: 1.92rem;
            height: .746667rem;
            line-height: .746667rem;
            border: 1px solid #FF5C5C;
            border-radius: .666667rem;
            .mixinfont(13px);
            color: #ff5c5c;
            margin-top: .2rem;
          }
        }
      }
    }
    
  }
  .service{
    width: 100%;
    height: 3.626667rem;
    background: #fff;
    margin-top: .133333rem;
    padding-bottom:1.333333rem;
      .item{
          width: 25%;
          height: 1.813333rem;
          text-align: center;
          float:left;
          img{
            display: inline-block;
            width: .586667rem;
            height: .586667rem;
            margin-top:.266667rem;
            margin-bottom: .133333rem;
          }
          p{
            .mixinfont(12px);
            color: #666; 
          }
        }
  }
};
</style>

