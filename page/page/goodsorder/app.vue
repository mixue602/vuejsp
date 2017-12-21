<template>
  <div class="wapper">
  <header-component :title="title" :direction="1"  @watchdirection="goBack"></header-component>
  <div class="container" id="setInfo">
        <!-- 商品详情 -->
        <div class="goodsDetail">
            <!-- <img src="img/default.png" alt=""> -->
            <img :src="renderPageInfo.thumbImgf" alt="" />
            <div class="goodsDes">
                <h2>{{renderPageInfo.goodsName}}</h2>
                <p>{{renderPageInfo.goodsSpecification}}</p>
            </div>
            <span class="goodsPri">￥{{parseFloat(renderPageInfo.goodsPrice/100).toFixed(2)}}</span>
            <span class="goodsNum">×{{renderPageInfo.count}}</span>
            
        </div>
    </div>
     <!-- 上门时间 -->
     <message  @onmsg="setMas" :msg="submitObj.mas" :mestitle="mestitle"></message>
     <select-time @addtime="addtime" @choose="chooseaddr" :type="'clean'" :hxtime="{GmTime:submitObj.GmTime,SelectTime:submitObj.servertime}"></select-time>
     <div class="totalPrice">
         <span>共{{num}}件商品&nbsp;&nbsp;</span>
         <span>合计:<i class="fcorange">￥{{totalPrice.toFixed(2)}}</i></span>
     </div>
    <div class="footer" :class="{'on':submitOn}"  @click="orderSubmit($event)">立即购买</div>
      
  </div>
</template>
<script  type="ecma6.0">

let root = window || {},
    util = root.util || {};  
    import headerComponent from '../../components/HeaderComponent';
    import message from "../../components/message";
    import selectTime from "../../components/selectTime";
export default {
  data() {
      return {
        title: '提交订单',
        mestitle:"留言（选填）",
        submitObj: {
          GmTime:'',
          mas:'',
          addr:{
            addr:'',
            area:'',
            cname:'',
            cphone:'',
            hnum:'',
            region:'',
            tsup:''
          },
          servertime:{
            day: null,
            week: null,
            timeStr: null,
          },
          
        },
        msg:{
            m1:"库存不足",
            m2:"该商品不存在",
            m3:"商品数量达到购买上限",
            m4:"留言最多输入500字",
        },
        submitOn: false,
        renderPageInfo:{},
        hrefParma: util.getHrefParma(),
        areaCode: '',
        limitArea:'',
        limitAreaName:'',
        totalPrice:"",
        num:""
      }
  },
  created () {
      this.load();
      if(util.isApp()){
        util.deleteHeadBtn();
      }
      let ss = window.localStorage;
      if (!!ss.getItem("goodsorder")) {
        let savecleanrepair = JSON.parse(ss.getItem("goodsorder"));
        this.submitObj = savecleanrepair || {};//回显
        ss.removeItem("goodsorder");
      }
  },
  methods: {
      //点击返回按钮
       goBack: function(){
          let that = this;
          //如果服务地址 上门时间已选 弹出提示
            if(that.submitOn){
                util.alert('您确定要放弃本次购买吗？',{
                    justOk: false,
                    okBtnText:'去意已决',
                    cancelBtnText:'继续预约',
                    okFn: function() {
                        util.href('goodsindex.html');
                    }
                });
            }else{
                window.history.back();
            }
        },
        //问题描述
        msg:function(i) {
          this.submitObj.mas=i;
        },
        //选择地址
        chooseaddr:function() {
          let ss=window.localStorage;
          ss.setItem('goodsorder',JSON.stringify(this.submitObj));
          util.href('./address.html',{page:'goodsorder',goodsID:this.hrefParma.goodsID*1,count:this.hrefParma.count*1})
        },
        addtime:function(item) {
          this.submitObj.servertime=item[0];
          this.submitObj.GmTime=item[1];
          this.submitObj.addr=item[2]
        },
        //设置留言
        setMas:function(str){
          this.submitObj.mas = str;
          let EMJi_REG = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
          if(EMJi_REG.test(this.submitObj.mas)){
            this.submitOn = false;
          }
        },
        load: function() {
            let that = this;
            // 处理URL
            that.getTempOrder();
        },
        /**
         *  获取临时订单信息
         * @return {[type]} [description]
         */
        getTempOrder: function() {
            let that = this;
            let orderInfo = JSON.parse(window.localStorage.getItem("goodsOrederInfo")) || [];
            //let orderInfo=[{"goodsID":541,"goodsName":"Apple苹果iPhoneX全面屏手机银色全网通256GB","goodsPrice":994800,"count":1,"thumbImgf":"//gfs12.atguat.net.cn/T1gFDTBbET1RCvBVdK.jpg","goodsAttr":{},"goodsSpecification":"主体\n品牌\n苹果（Apple）\n型号\niphoneX\n入网型号\n以官网为准\n上市年份\n2017年\n上市月份\n以官网信息为准\n基本信息\n机身颜色\n其他\n机身长度（mm）\n143.6毫米\n机身宽度（mm）\n70.9毫米\n机身厚度（mm）\n7.7毫米\n机身重量（g）\n174\n输入方式\n触控\n运营商标志或内容\n其他\n机身材质分类\n玻璃后盖；其他\n操作系统\n操作系统\nios\n主芯片\nCPU品牌\n其他\nCPU频率\n以官网信息为准\nCPU核数\n其他\nCPU型号\n其他\n网络支持\n双卡机类型\n单卡\n最大支持SIM卡数量\n1个\nSIM卡类型\nNanoSIM\n4G网络\n4G：移动（TD-LTE)；4G：联通(TD-LTE)；4G：电信(FDD-LTE)\n网络频率（2G/3G）\n其他\n存储\nROM\n其他\nRAM\n其他\n存储卡\n其他\n屏幕\n主屏幕尺寸（英寸）\n其他\n分辨率\n其他\n屏幕材质类型\n其他\n前置摄像头\n前置摄像头\n其他\n前摄光圈大小\n其他\n后置摄像头\n摄像头数量\n2个\n后置摄像头\n1200万像素\n拍照特点\n光学变焦；自动对焦；防抖；连拍；微距；全景\n电池信息\n电池容量（mAh）\n其他\n电池是否可拆卸\n否","sellArea":"北京","sellAreaName":"北京"}]
            that.limitArea = orderInfo[0].sellArea;
            that.limitAreaName = orderInfo[0].sellAreaName;
            that.renderPageInfo=orderInfo[0] || [];
            that.rendertotalPrice(orderInfo);
        },
        rendertotalPrice: function(body) {
         let that = this,
             num=0,
             totalPrice = 0;
             for(var i=0;i<body.length;i++){
                 totalPrice += parseInt(body[i].count) * parseFloat(body[i].goodsPrice/100).toFixed(2);
                 num += parseInt(body[i].count);
             }
             that.totalPrice=totalPrice;
             that.num=num;
        },
         orderSubmit: function() {
            
            let that = this,
                data = {},
                parma = that.hrefParma,
                source;

            if(!that.submitObj.servertime.day){
                util.tip("请选择服务时间",{duration:2000});
                return false;
            }
            if(!that.submitObj.addr.tsup){
                util.tip("请选择服务地址",{duration:2000});
                return false;
            }

            
            // 表情符
            let reg = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
            // 特殊字符
            let patrn = /[`\\@#&$%^&*_\-\/\+\|=<>{}●△●'|~@#&￥%&*——\-\+={}|《》【】]/ig;
          

            if(this.submitObj.mas){
                that.submitObj.msg = util.filteremoji(this.submitObj.mas);
                // 验证留言 
                if(reg.test(this.submitObj.mas) || patrn.test(this.submitObj.mas)){
                    util.tip('留言内容不允许输入特殊字符、emoji表情、html符号'); 
                    return;
                }
            }
            
            
    
            data = {
                name: that.submitObj.addr.cname,
                phone: that.submitObj.addr.cphone,
                addressId: that.submitObj.addr.tsup,
                detailAddress:that.submitObj.addr.region + that.submitObj.addr.addr,
                // sendDate: that.options.isSaveTime,
                sendDate:  util.formateDate(that.submitObj.servertime.timeStr,'yyyy-MM-dd hh:mm:ss'),
                msg: that.submitObj.mas,
                goods: [{
                    sku: parma.goodsID*1,
                    // sku: 5,
                    num: parma.count*1
                }]
            };
            //请求
            util.api({
                surl: root.GOODS_API_PATH + 'saveOrder',
                type: 'post',
                data:data,
                success: function(response) {
                    var rpco = response.rpco,
                        body = response.body || {};

                    switch(rpco) {
                        case 200:
                            //去支付
                            util.href('pay.html',{
                                otn : body.oid,
                                dodt : body.tsod,
                                odtype : 10485761,
                                oddz: 1
                            });
                            break;
                        // 没有找到对应数据
                        case 401:
                            // 加载提示
                            util.tip(that.msg.m3);
                            break;
                        case 402:
                            // 加载提示
                            util.tip(that.msg.m3);
                            break;
                        case 403:
                            // 加载提示
                            util.tip(that.msg.m3);
                            break;
                        case 40015:
                            // 加载提示
                            util.tip(that.msg.m4);
                            break;
                        case 40004:
                            if(that.limitAreaName){
                                util.tip("非"+ that.limitAreaName +"地区无法配送，请重新选择");
                            }else{
                                util.tip("很抱歉，该地区暂未开通此项服务");
                            }
                            break;
                        default:
                            util.tip('服务器繁忙，请稍后再试')
                    }
                }
            });

        }, 
  },
  watch:{
      submitObj:{//判断是否可提交
        handler(newval,val) {
          if(newval.addr.tsup==null){
            this.submitOn=false;
          }else if(newval.servertime.day==null) {
            this.submitOn=false;
          }else{
            this.submitOn=true;
          }
        },
        deep:true
      }
  },
  components: {
      headerComponent,
      message,
      selectTime,
  }
	
}
</script>
<style lang="less">
@import '../../util/fs.less';
html{height:100%;background: #f5f5f5}
#message{padding-bottom: .266667rem}
.wapper{
    background: #f5f5f5;
    /*订单详情 start*/
#goodsOrder .result-header {
    font-size: .14rem;
    width: 100%;
    height: 1rem;
    margin-bottom: .1rem;
    padding: .2rem .12rem;
    //background: center center url('../img/bg_result.jpg') no-repeat;
    background-size: cover;
}

#goodsOrder .result-header div {
    color: #fff;
}
#goodsOrder .result-header a {
    line-height: .28rem;
    position: absolute;
    top: .56rem;
    right: .12rem;
    width: .78rem;
    text-align: center;
    color: #fff;
    border: 1px solid #fff;
    border-radius: 2px;
}

 .goodsDetail{
    width: 100%;
    height: 2.666667rem;
    position: relative;
    background-color: #fff;
    margin-bottom: .1rem;
    .mixinfont(14px);
    overflow: hidden;

}
 .goodsDetail img{
    width: 1.866667rem;
    height: 1.866667rem;
    position: absolute;
    top: .4rem;
    left:  .266667rem;
    border: 1px solid #e3e3e3;
    box-sizing: border-box;

}
 .goodsDes{
    width:100%;
    padding: 0 2.4rem 0 2.4rem;
    box-sizing: border-box;
}
.goodsDes h2{
    width: 100%;
    font-weight: normal;
    .mixinfont(13px);
    margin-top: .45rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow: hidden;
}
 .goodsDes p{
    margin-top: .05rem;
    color: #ccc;
    .mixinfont(12px);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow: hidden;

}
.goodsDetail .goodsPri{
    position: absolute;
    top: .45rem;
    right:  .32rem;
}
.goodsDetail .goodsNum{
    position: absolute;
    top: 1rem;
    right:  .32rem;
}

.totalPrice{
    margin-top: 2px;
    line-height: 1.17333rem;
    height: 1.173333rem;
    position: relative;
    background: #fff;
    display: flex;
    align-items:center;
    justify-content:flex-end;
    .mixinfont(14px);
    padding-right: 0.53333rem;
    .fcorange{
        color: #ff4b46;
    }
    
}

.footer{
    position: fixed !important;
        left: 0;
        bottom: 0;
        z-index: 9999;
        width: 100%;
        height: 1.306667rem;
        line-height: 1.306667rem;
        text-align: center;
        background-color: #e0e0e0;
        color: #fff;
        .mixinfont(18px);
        &.on {
          background-color: #ff4b46;
        }
}
// .footer{
//     width: 100%;
//     height: 1.346667rem;
//     line-height: 1.346667rem;
//     .mixinfont(16px);
//     background-color: #ff4b46;
//     text-align: center;
//     color: #fff;
//     position: fixed;
//     left: 0;
//     bottom: 0;
            
//  }

// .footer .dib{
//     display: block;
//     width: 100%;
//     text-align: center;
//     color: #fff;
// }
}
</style>

