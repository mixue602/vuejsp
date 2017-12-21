<template>
  <div class="wapper">
    <header-component :title="title" :direction="1"  @watchdirection="goBack"></header-component>
    <div class="container" id="setInfo">
      <div class="cleanproducts bdr-top" @click="more">
        <ul>
          <li v-for="(v,n) in renderPageInfo" v-if="n<4" :key="n" >
              <img  v-if="v.cgilist" :src="v.cgilist[0]"/>
              <img  v-else src="//gfs12.gomein.net.cn/T1.RKjBChT1RCvBVdK.png"/>
          </li>
          <p class="pname" v-if="renderPageInfo.length==1">{{renderPageInfo[0].cgname}}</p>
          <div class="num" v-if="renderPageInfo.length>=1 && renderPageInfo.length<5"><i>x</i>{{num}}</div>
          <li v-if="renderPageInfo.length>4">
               <a @click="more" >更多<i></i></a>
               <span>(共{{num}}项)</span>
          </li>
        </ul> 
      </div>
      <div class="total-box bdr-top">
         <label>合计金额：</label>
         <span class="value">￥<span>{{totalPrice}}</span></span>
      </div>
      <div class="coupon-box bdr-top" v-show="couPonInfo.conTF">
        <div class="coupontitle">
          <label>优惠券</label>
          <span>当前订单最高可抵扣：<span class="couponprice">￥{{ parseFloat(couPonInfo.copp/100) }}</span></span>
        </div>
        <div class="couponcontent">
            <div class="coupon">
              <div class="triangletop"></div>
              <div class="trianglebottom"></div>
              <div class="coupon-left">
                 <span>￥</span>
                 <i>{{ parseFloat(couPonInfo.copp/100)}}</i>
              </div>
              <div class="coupon-right">
                 <span>仅限{{couPonInfo.couat}}使用<a v-if="couPonInfo.coumat">,满{{couPonInfo.coumat}}减{{ parseFloat(couPonInfo.copp/100) }}</a></span>
                 <i>使用期限：{{couPonInfo.enable}}-{{couPonInfo.disable}}</i>
              </div>
            </div>
        </div>
      </div>
      <message  @onmsg="setMas" :msg="submitObj.mas"></message>
      <upload @watchupload="upload" ref="loadimg"></upload>
      
      <div class="servicetype-box">
        <p>服务类型</p>
        <div class="servicetype bdr-top">
          <ul>
            <li class="select">上门清洗</li>
          </ul>
        </div>
      </div>
      <select-time @addtime="addtime" @choose="chooseaddr" :type="'clean'" :hxtime="{GmTime:submitObj.GmTime,SelectTime:submitObj.servertime}"></select-time>
		  <div class="qnotes">
          <p class="qnote">提交订单后将有售后人员与您电话沟通，请保持手机畅通</p>
      </div>
		<footer  class="waves" :class="{'on':submitOn}"  @click="orderSubmit($event)">提交订单</footer>
  </div>
</template>
<script type="ecma6.0">
  let root = window || {},
      util = root.util || {};
      import headerComponent from '../../components/HeaderComponent';
      import message from "../../components/message";
      import selectTime from "../../components/selectTime";
      import upload from "../../components/upload";

  
  export default {
  
    data() {
  
      return {
        title: '预约清洗服务',
        renderPageInfo:[
        ],
        num:0,
        totalPrice:'',
        couPonInfo:{
          copp:'',
          copnum:'',
          couat:'',
          coumat:'',
          enable:'',
          disable:'',
          conTF:false
        },
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
          ImgList:[],
        },
        submitOn: false,
        rgcd:'',
        origin:'',
        parmas:'',
        tipmsg:{
            m1:'很抱歉，该地区暂未开通此项服务',
            m2:'很抱歉，您订单中的商品价格发生变化，请重新选择商品',
            m3:'留言至多500个字',
            m4:'服务器繁忙，请稍后再试吧。我们的客服也可以帮您下单哦',
            m5:'您确定要放弃本次预约么？'
        }
      }
    },
    created () {
       let that=this;
       that.load();
       if(util.isApp()){
          util.deleteHeadBtn();
       }
       // 大数据区分渠道
      if (window.BPConfig.channel != undefined) {
        that.origin = window.BPConfig.channel;
      }
      let ss = window.localStorage;
      if (!!ss.getItem("clean")) {
        var savecleanrepair = JSON.parse(ss.getItem("clean"));
        this.submitObj = savecleanrepair || {};//回显
        this.$nextTick(function(){
            that.$refs.loadimg.getPic(this.submitObj.ImgList);
        })
        ss.removeItem("clean");
      }

      
    },
  	methods:{
      //点击返回按钮
       goBack: function(){
          let that = this;
          //如果服务地址 上门时间已选 弹出提示
            if(that.submitOn){
                util.alert(that.tipmsg.m5,{
                    justOk: false,
                    okBtnText:'去意已决',
                    cancelBtnText:'继续预约',
                    okFn: function() {
                        util.href('cleanlistnew.html');
                    }
                });
            }else{
                window.history.back();
            }
        },
        //点击更多 进入商品列表
        more:function(){
          util.href('cleanproductlist.html',{oid:this.parmas.oid*1});
        },

        //用户上传图片
        upload:function(ImgList){
          this.submitObj.ImgList=ImgList[0];
          //console.log(ImgList)
        },
        //问题描述
        msg:function(i) {
          this.submitObj.mas=i;
        },
        //选择地址
        chooseaddr:function() {
          let ss=window.localStorage;
          ss.setItem('clean',JSON.stringify(this.submitObj));
          util.href('./address.html',{page:'cleansubmitorder',tsup:this.submitObj.addr.tsup,oid:this.parmas.oid*1})
        },
        load:function(){
          let that=this;
          //加载页面布局
          that.loadPageLayout();
          
        },
        addtime:function(item) {
          this.submitObj.servertime=item[0];
          this.submitObj.GmTime=item[1];
          this.submitObj.addr=item[2]
        },
        loadPageLayout:function(){
            let that = this;
            that.getPageInfo();
            //that.getAddress()
        },
        getPageInfo:function(){
            let that = this,
                day,
                date;

         //请求
            that.parmas = util.getHrefParma(),
            util.api({
                surl: root.CLEAN_API_PATH + 'getTempOrder',
                type: 'get',
                data:{
                    oid:that.parmas.oid*1
                },
                success: function(response) {
                    let rpco = response.rpco,
                        body = response.body || {};

                    // 处理
                    switch(rpco) {
                        case 200:
                            // 渲染
                            let cglist = body.cglist || [];
                            that.renderPageInfo=cglist;
                            // //渲染总价格
                            that.prices(cglist);
                            //查询最大优惠券
                            that.getCoupons(cglist);
                            break;
                        case 404:
                            util.href(root.ORDER_API_PATH+'listnew.html',{ty:1})
                        default:
                            //util.tip('请求失败')
                    }

                }
            });
        },
        // 渲染总价格 数量
        prices:function(body) {
            let that = this,
                price = 0,
                length=body.length,
                num=0;
            for(var i=0;i<length;i++) {
                price += parseInt(body[i].cgnum)*parseFloat(body[i].price/100);
                num+=body[i].cgnum;
            } 
            //总价格 数量
            that.totalPrice=price.toFixed(2);
            that.num=num;
        },
        //获取最大优惠券
        getCoupons: function(body) {
            let that = this,
                macbl = [];
              
            $.each(body,function(i,n){
                let macblItem={
                    odTp : 2,
                    cgcd : n.cgcd*1,
                    dvcd : 0,
                    sgpl : n.price*1,
                    rgcd : that.rgcd
                } 
                macbl.push(macblItem);
            });
            
            //请求
            util.api({
                surl: root.MB_API_PATH + 'getMaxAvailableCoupon',
                type: 'post',
                data:{
                    macbl:macbl
                },
                async:false,
                success: function(response) {
                    var rpco = response.rpco,
                        body = response.body || {};

                    // 处理
                    switch(rpco) {
                        case 200:
                            // 渲染
                          body.enable = util.formateDate(parseInt(body.enable), 'yyyy.MM.dd');
                          body.disable = util.formateDate(parseInt(body.disable), 'yyyy.MM.dd');
                          that.couPonInfo = body;
                          that.couPonInfo.conTF = true;
                        break;
                        case 40002:
                            // nothing
                        that.couPonInfo.conTF=false;
                        break;
                        default:
                        that.couPonInfo.conTF=false;
                            //util.tip('请求失败')
                    }

                }
            });
        },
        
        //设置留言
        setMas:function(str){
          this.submitObj.mas = str;
        },
            //提交订单
        orderSubmit: function() {
            
            let that = this,
                data = {},
                parmas = that.parmas,
                source;
            
            // 表情符
            let reg = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
            // 特殊字符
            let patrn = /[`\\@#&$%^&*_\-\/\+\|=<>{}●△●'|~@#&￥%&*——\-\+={}|《》【】]/ig;
          
            if(this.submitObj.mas){
                // 验证留言 
                if(reg.test(this.submitObj.mas) || patrn.test(this.submitObj.mas)){
                    util.tip('留言内容不允许输入特殊字符、emoji表情、html符号'); 
                    return;
                }
            }

            if(!that.submitObj.servertime.day){
                util.tip("请选择服务时间",{duration:2000});
                return false;
            }
            if(!that.submitObj.addr.tsup){
                util.tip("请选择服务地址",{duration:2000});
                return false;
            }
            
            if(util.isWeiXin()){
                source=2;
            }else{
                source=1;
            }
            data = {
                "oids":parmas.oid,      //订单号
                "daddr":that.submitObj.addr.tsup,  // 服务地址
                //"daddr":"200000770131",
                "apct":that.submitObj.servertime.timeStr,   //服务时间
                "msg":that.submitObj.mas,  //问题描述
                "dimgl":that.submitObj.ImgList,  //设备图片(用户上传)
                "source":source*1,         //订单来源
                "origin":that.origin*1     //订单渠道
            };
            //请求
            util.api({
                surl: root.CLEAN_API_PATH + 'saveOrderd',
                type: 'post',
                data:data,
                success: function(response) {
                    var rpco = response.rpco,
                        body = response.body || {};

                    // 处理
                    switch(rpco) {
                        case 200:
                            //删除下单成功项
                            if(parmas.inventory){
                                that.cleanListEidt();
                            }
                            // //下单成功
                            util.href('appointresult.html',{
                                oid:body.oid,
                                dodt:body.dodt,
                                odtype:body.odtype,
                                type:1
                            });
                            break;
                        case 40008:
                            util.tip(that.tipmsg.m1,{'duration':2000});
                            break;
                        case 40009:
                            util.tip(that.tipmsg.m2,{'duration':2000});
                            break;
                        case 40010:
                            util.tip(that.tipmsg.m3,{'duration':2000});
                            break;
                        case 40401:
                            util.tip(that.tipmsg.m4,{'duration':2000});
                            break;
                        default:
                            //下单失败
                            util.tip('请求失败',{duration:3000})

                    }
                }
            });

        }, 
        cleanListEidt: function(){

          let that = this,
              wishs = that.renderPageInfo || [],
              cglist = [];
              for (var i = 0; i < wishs.length; i++) {
                  let cgcode = wishs[i].cgcode,
                      ctid = wishs[i].ctid,
                      cgcd = wishs[i].cgcd;
                  let   obj = {
                          //服务编码
                          "cgcode": cgcode,
                          "cccl": [{
                              //服务内容分类id
                              "ctid": ctid,
                              "ctcl": [{
                                  //服务内容编号
                                  "cgcd": cgcd
                              }]

                          }]

                      };
                  cglist.push(obj);
              };

              util.api({
                  surl: root.CLEAN_API_PATH + 'delWish',
                  data: cglist,
                  type: 'post',
                  success: function(response) {
                      var rpco = response.rpco,
                          body = response.body || {};
                      // 处理
                      switch (rpco) {
                          case 200:
                              break;
                          case 40004:
                              break;
                          default:
                              // util.tip('服务器繁忙，请稍后再试');
                              break;
                      }

                  },
                  error:function(){
                      util.tip('',{noShow:true});
                  }
              });
     },
    },
    watch:{
      submitObj:{//判断是否可提交
        handler(newval,val) {
          if(!newval.addr.tsup){
            this.submitOn=false;
          }else if(!newval.servertime.day) {
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
      upload
    }
  
  }
</script>
<style lang="less">
  @import '../../util/fs.less';
  .wapper{
    padding-bottom: 1.306667rem;
    background:#f5f5f5;
    position: relative;
    .cleanproducts{
      ul{
      padding: 0 .266667rem;
      height: 2.08rem;
      display: flex;
      align-items:center;
      justify-content:flex-start;
      background: #fff;
      position: relative;
      .pname{
        align-self:flex-start;
        margin-top: .4rem;
        color: #333;
        .mixinfont(14px);
        width: 7rem;
        white-space: nowrap;
    
        /* 不换行 */

        overflow: hidden;

        /* 内容超出宽度时隐藏超出部分的内容 */

        text-overflow: ellipsis;

        /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
      }
      .num{
        .mixinfont(13px);
        color: #999;
        align-self:flex-start;
        position: absolute;
        top:.4rem;
        right: .266667rem;
        i{
          .mixinfont(16px);
          margin-left: .026667rem;
        }
      }    
      li{
        width: 1.653333rem;
        height: 1.653333rem;
        display: flex;
        align-items:center;
        justify-content:center;
        margin-right: .266667rem;
        img{
          width:1.653333rem;
          height: 1.653333rem;
          display: inline-block;

        }
        
      }
      li:nth-child(5){
          flex-direction: column;
          align-items:flex-start;
          padding-left: .133333rem;
          a{
            width: 1.653333rem;
            color: #333;
            .mixinfont(14px);
            display: flex;
            align-items:center;
            justify-content:space-between;
          }
          i{
            display: inline-block;
            vertical-align: -.04rem;
            width: .426667rem;
            height: .426667rem;
            color: #333;
            .mixinfont(14px);
            background: url("//gfs10.gomein.net.cn/T1uLCvB_Ev1RCvBVdK.png")  no-repeat;
            -webkit-background-size: 100%;
            background-size: 100%;
            
          }
          span{
            color: #999;
            .mixinfont(12px);
          }
        }
      }
      
    }
    .total-box{
      height: 1.173333rem;
      background: #fff;
      display: flex;
      align-items:center;
      justify-content:space-between;
      .mixinfont(14px);
      label{
        color: #333;
        margin-left: .4rem;
      }
      span{
        margin-right: .266667rem;
        color: #FF4B41;
      }
    }
    .coupontitle{
      height: 1.173333rem;
      background: #fff;
      display: flex;
      align-items:center;
      justify-content:space-between;
      margin-bottom: .266667rem;
      label{
        color: #333;
        margin-left: .4rem;
        .mixinfont(14px);
      }
      span{
        color: #999;
        margin-right: .266667rem;
        .mixinfont(12px);
      }
    }
    .couponcontent{
      width: 100%;
      height: 2.666667rem;
      display: flex;
      justify-content:center;
      .coupon{
        width: 9.2rem;
        height: 2.666667rem;
        border-radius: .186667rem;
         background: #fff;
        display: flex;
        align-items:center;
        justify-content:center;
        position: relative;
        .coupon-left{
          width: 3.546667rem;
          height: 2.666667rem;
          position: relative;
          color: #FF4B41;
          display: flex;
          align-items:center;
          justify-content:center;
          span{
            .mixinfont(28px);
          }
          i{
            .mixinfont(38px);
          }
        }
        .coupon-left:before {
          height: 100%;
          content: '';
          width: 1px;
          border-right: 1px dashed #f0f0f0;
          position: absolute;
          top: 0;
          right: 0;
          z-index: 10;
      }
        .coupon-right{
          width: 5.653333rem;
          height: 2.666667rem;
          display: flex;
          flex-direction: column;
          align-items:flex-start;
          justify-content:center;
          span{
            color:rgba(255,152,151,1);
            .mixinfont(12px);
            margin-left: .4rem;
            a{
              color:rgba(255,152,151,1);
            }
          }
          i{
            color:#999;
            .mixinfont(12px);
            display: inline-block;
            margin-left: .4rem;
            margin-top: .026667rem;

          }
        }
        .triangletop{
          position: absolute;
          top: 0;
          left: 3.34rem;
          width: 0;
          height: 0;
          border-left: .173333rem solid transparent;
          border-right: .173333rem solid transparent;
          border-top: .173333rem solid #f0f0f0;
        }
        .trianglebottom{
          position: absolute;
          bottom: 0;
          left: 3.34rem;
          width: 0;
          height: 0;
          border-left: .173333rem solid transparent;
          border-right: .173333rem solid transparent;
          border-bottom: .173333rem solid #f0f0f0;
        }
        
      }
      
      
    }
    .problem{
      height: 4.986667rem;
      background: #fff;
      p{
        color: #333;
        height: 1.146667rem;
        line-height: 1.146667rem;
        margin-left: .4rem;
        .mixinfont(14px);
      }
      textarea{
        .mixinfont(14px);
        line-height: 20px;
        width: 9.146667rem;
        height: 2.666667rem;
        background: #f2f2f2;
        margin-left: .4rem;
        overflow-x:hidden;
        resize:none;
        scrollbar-base-color:lightsalmon;  
      }
    }
    .servicetype-box{
      width: 100%;
      height: 3.44rem;
      background: #fff;
      margin-top: .266667rem;
      p{
        color: #333;
        height: 1.146667rem;
        line-height: 1.146667rem;
        margin-left: .4rem;
        .mixinfont(14px);
      }
      .servicetype{
        
        ul{
          height: 2.24rem;
          display: flex;
          align-items:center;
          justify-content:flex-start;
          padding-left: .133333rem;
          li{
            width: 3.146667rem;
            height: 1.173333rem;
            background: #f2f2f2;
            border-radius: .106667rem;
            display: flex;
            align-items:center;
            justify-content:center;
            margin-left: .266667rem;
          }
          li.select{
            background: #FFF1F1;
            border: 1px solid #FF9897;
          }
        }
      }
    
    }
    .servicetime-box{
        width: 100%;
        height: 1.173333rem;
        margin-top: .266667rem;
        display: flex;
        align-items:center;
        justify-content:space-between;
        background: #fff;
        p{
          color: #333;
          margin-left: .4rem;
          .mixinfont(14px);
        }
        span{
          color: #999;
          margin-right: .346667rem;
          .mixinfont(14px)
        }
      }
      .selecttime{
        .servertime{
          margin-bottom: .266667rem;
        }
        .serveraddr{
          margin-bottom: 1px;
        }
      }
      footer {
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
      .qnotes{
        P{
          height: .986667rem;
          text-align: center;
          line-height: .986667rem;
          color: #999;
          .mixinfont(12px);
        }
        
      }
  }
</style>

