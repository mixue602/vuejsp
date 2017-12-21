<template>
	<div  class="wapper recycle-wapper" :class="{'appsubmit':isApp}" >
		<!-- 快速预约导航 -->
		<div class="quickNav" >
			{{pagetitle}}
      <li class="left"></li>
      <li class="right" @click="jumpUrl"></li>
		</div>
		<!-- 设备型号 -->
		<select-device @select-device="checkDevice" :model="brandObj"></select-device>
    <!-- 留言 -->
    <message @onmsg="msg" :msg="submitObj.mas"></message>
    <!-- 图片拍照上传 -->
    <upload @watchupload="uploadImg" ref="hximglist"></upload>
    <div class="servertype">
			<div class="text">服务类型</div>
			<div class="btn"><span class="border">上门服务</span></div>
		</div>
    <!-- 选择时间  -->
		<select-time @addtime="addtime" @choose="chooseaddr" :type="'repair'" :hxtime="{GmTime:submitObj.GmTime,SelectTime:submitObj.servertime}"></select-time>
		<div class="qnotes">
            <p class="qnote">提交订单后将有售后人员与您电话沟通，请保持手机畅通</p>
        </div>
		<footer  class="waves" :class="{'on':submitOn}"  @click="orderSubmit($event)">提交订单</footer>
		<foot-components :index="1"></foot-components>
		<!-- 选择设备 -->
		<quick-brand  :devicearr="deviceArr" :deviceshow="deviceShow" @goback="goback" @selectdevice="selectDevice"></quick-brand>
		<!-- 选择品牌 -->
		<select-brand  :modelshow="modelShow" :menuobj='menuObj' :goodsobj='goodsObj' :currentindex='currentindex'  @changebrand='_getModels' @goback="goback" @addpramas="setModels"></select-brand>
		<select-two  :modelshowtwo="modelShowTwo"  :menuobj='menuObj' :goodsobj='goodsObj' @changebrand='_getModels'  @goback="goback"  @addpramas="setModels"></select-two>
	</div>
</template>

<script type="ecma6.0">
import headerComponent from "../../components/HeaderComponent";
import serviceSteps from "../../components/ServiceSteps";
import footComponents from "../../components/FootComponents";
import quickBrand from "./quickbrand";
import selectBrand from "./selectbrand";
import selectTwo from "./selectbrand2";
import selectDevice from "../../components/selectDevice";
import selectTime from "../../components/selectTime";
import message from "../../components/message";
import upload from "../../components/upload"

let root = window || {},
  util = root.util || {};

export default {
  data() {
    return {
      hrefParma: {},
      title: "",
      wl:window.location,
      brandObj: {
        model:null,
        brand:null,
        device:null,
        logo:'//gfs13.gomein.net.cn/T1.ZYQBChT1RCvBVdK.png'
      },
      baseurl: "//img.gomein.net.cn/gomegj/wap/eacimg2/",
      deviceArr: [],
      deviceShow: false,
      baseurl1: "//img.gomein.net.cn/gomegj/wap/bdimg/",
      baseurl2: "//img.gomein.net.cn/gomegj/wap/bdimg2/",
      goodsObj: [],
      menuObj: [],
      brand: {},
      modelsObj: {},
      modelsObjTwo: {},
      currentindex: 0,
      modelShow: false,
      modelShowTwo: false,
      page: "quickrepair1",
      submitOn: false,
      submitObj: {
        GmTime:'请选择购买时间',
        addr:{
          addr:'',
          area:'',
          cname:'',
          cphone:'',
          hnum:'',
          region:'',
          tsup:''
        },
        attrsjson:{
          attrs:[
            {
              attrgrpid:'',
              attrid:''
            }
          ]
        },
        brdid:'',
        eacid:'',
        mas:'',
        mdld:'',
        servertime:{
          day:null,
          timeStr:null,
          week:null
        },
        devimgs:[]
      },
      saveQuickRepair: {
        deviceArr: [],
        render: {},
        submit: {},
        goodsObj: [],
        menuObj: [],
        brand: {},
        currentindex: null
      },
      origin: "",
      pagetitle:'快速预约',
      isApp:false,
      login:false
    };
  },
  created() {
    var _this = this;
    this.hrefParma = util.getHrefParma();
    this.hrefParma.arcode = this.hrefParma.arcode
      ? this.hrefParma.arcode
      : 110108;
    this.title = "快速预约";
    // 大数据区分渠道
    if (window.BPConfig.channel != undefined) {
      this.origin = window.BPConfig.channel;
    }
    let ss = window.sessionStorage;
    if (!!ss.getItem("repairorder")) {
      var savequickrepair = JSON.parse(ss.getItem("repairorder"));
      console.log(savequickrepair)
      this.brandObj=savequickrepair.brandObj;
      this.submitObj = savequickrepair || {};//回显
      ss.removeItem("repairorder");
    }
    this.$nextTick(()=>{
      _this.$refs.hximglist.getPic(_this.submitObj.devimgs);
    })
    if(util.isApp()){
      this.pagetitle = '';
      var u = navigator.userAgent;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if(isAndroid){
        this.isApp = true;
      }else{
        this.isApp = false;
      }
      util.deleteHeadBtn();
    }
    this.isLogin();
  },
  methods: {
    isLogin() {//判断是否登录，没有登录在app里选择地址吊起登录
      var _this = this;
      util.api({
        surl:root.LOGIN_API_PATH + 'userinfo',
        type:'get',
        success:function(res){
          switch(res.rpco){
            case 200:
            _this.login = true;
            break;
            case 401:
            _this.login = false;
            break;
            default:
            _this.login = false;
            util.tip('服务器繁忙，请稍后再试')
          }
        }
      })
    },
    //型号图片
    _getDeviesImg() {
      var _this = this;
      util.api({
        surl:root.CE_API_PATH + 'img?devid=' + _this.submitObj.mdld,
        type:'get',
        success:function(res) {
          if(res.rpco == 200){
            _this.brandObj.logo = res.body;
          }
          console.log(res)
        },
        error(err){
          util.tip('网络错误')
        }

      })
    },
    //图片上传
    uploadImg(ImgList) {
      console.log(ImgList)
      //this.submitObj.devimgs=ImgList[0];
    },
		msg(i) {
			this.submitObj.mas=i;
		},
    // 跳转到预约回收页面
    jumpUrl() {
      let ss = window.sessionStorage;
      this.submitObj.brandObj=this.brandObj;
      ss.setItem("repairorder", JSON.stringify(this.submitObj));
      util.href("quickrecycle.html");
    },
    // 获取设备列表数据
    _getDevice() {
      var that = this;
      // debugger:start
      // var body={"eacatgs":[{"eacid":12,"eacnm":"手机","logo":"http://c.jikexiu.com/sod/app_icon/wh/12.png"},{"eacid":13,"eacnm":"平板","logo":"http://c.jikexiu.com/sod/app_icon/wh/13.png"},{"eacid":36,"eacnm":"电脑","logo":"http://c.jikexiu.com/sod/app_icon/wh/36.png"},{"eacid":19,"eacnm":"电视","logo":"http://c.jikexiu.com/sod/app_icon/wh/19.png"},{"eacid":20,"eacnm":"空调","logo":"http://c.jikexiu.com/sod/app_icon/wh/20.png"},{"eacid":21,"eacnm":"洗衣机","logo":"http://c.jikexiu.com/sod/app_icon/wh/21.png"},{"eacid":25,"eacnm":"冰箱","logo":"http://c.jikexiu.com/sod/app_icon/wh/25.png"},{"eacid":26,"eacnm":"油烟机","logo":"http://c.jikexiu.com/sod/app_icon/wh/26.png"},{"eacid":27,"eacnm":"热水器","logo":"http://c.jikexiu.com/sod/app_icon/wh/27.png"},{"eacid":28,"eacnm":"燃气灶","logo":"http://c.jikexiu.com/sod/app_icon/wh/28.png"}]};
      // $.each(body.eacatgs,(i,item)=>{
      // 	item.logo = that.baseurl+String(item.eacid)+".png"
      // })
      // that.deviceArr = body.eacatgs;
      // this.deviceShow = true;
      // return;
      // debugger:end

      util.api({
        surl:
          root.REPAIR_API_PATH +
          "eacategory?arcode=" +
          this.hrefParma.arcode,
        type: "get",
        success: function(res) {
          var rpco = res.rpco,
            body = res.body;
          // 处理
          switch (rpco) {
            case 200:
              $.each(body.eacatgs, (i, item) => {
                item.logo = that.baseurl + String(item.eacid) + ".png";
              });
              that.deviceArr = body.eacatgs;
              //that.saveQuickRepair.deviceArr = body.eacatgs;
              that.deviceShow = true;
              // 禁止底层页面滑动
              $("html").addClass("noscroll");
              break;
            case 40401:
              util.tip("服务器繁忙，请稍后再试", 2000);
              break;
            default:
              util.tip("请求失败");
          }
        }
      });
    },
    //获取品牌列表数据
    _getBrand(item) {
      var that = this;
      that.menuObj = [];
      that.goodsObj = [];
      // debug:start
      // var res = {"rpco":200,"tsrp":1492406844675,"body":{"brands":[{"eacid":12,"eacatenm":"","brdid":8,"brdnm":"苹果","logo":""},{"eacid":12,"eacatenm":"","brdid":10,"brdnm":"小米","logo":""},{"eacid":12,"eacatenm":"","brdid":11,"brdnm":"三星","logo":""},{"eacid":12,"eacatenm":"","brdid":12,"brdnm":"华为","logo":""},{"eacid":12,"eacatenm":"","brdid":13,"brdnm":"努比亚","logo":""},{"eacid":12,"eacatenm":"","brdid":15,"brdnm":"魅族","logo":""},{"eacid":12,"eacatenm":"","brdid":16,"brdnm":"vivo","logo":""},{"eacid":12,"eacatenm":"","brdid":17,"brdnm":"OPPO","logo":""},{"eacid":12,"eacatenm":"","brdid":10,"brdnm":"小米","logo":""},{"eacid":12,"eacatenm":"","brdid":11,"brdnm":"三星","logo":""},{"eacid":12,"eacatenm":"","brdid":12,"brdnm":"华为","logo":""},{"eacid":12,"eacatenm":"","brdid":13,"brdnm":"努比亚","logo":""},{"eacid":12,"eacatenm":"","brdid":15,"brdnm":"魅族","logo":""},{"eacid":12,"eacatenm":"","brdid":16,"brdnm":"vivo","logo":""},{"eacid":12,"eacatenm":"","brdid":17,"brdnm":"OPPO","logo":""}]}}
      // if (res.rpco === 200) {
      //     that.menuObj = res.body.brands;
      //     that.hrefParma.eacid = item.eacid;
      //     this.submitObj.eacid = item.eacid;
      //     if(item.eacnm == "手机" || item.eacnm == "平板"){
      //     	// 样式1
      //     	$.each(res.body.brands,(index,item)=>{
      //             item.brdimg = that.baseurl1+item.brdid+'.png';
      //         })
      //     	that.modelShow = true;
      //     	that._getModels(res.body.brands[0].brdid,0,1);
      //     }else{
      //     	// 样式2
      //     	$.each(res.body.brands,(index,item)=>{
      //     		item.taf = false;
      //             item.brdimg = that.baseurl2+item.brdid+'.png';
      //         })
      //     	that.modelShowTwo = true;
      //     }
      // }

      // return;
      // debug:end
      util.api({
        surl:
          root.REPAIR_API_PATH +
          "brands?arcode=" +
          this.hrefParma.arcode +
          "&eacid=" +
          item.eacid,
        type: "get",
        success: function(res) {
          if (res.rpco === 200) {
            if (item.eacnm == "手机" || item.eacnm == "平板") {
              // 样式1
              $.each(res.body.brands, (index, item) => {
                item.brdimg = that.baseurl1 + item.brdid + ".png";
              });
              that.modelShow = true;
              $("html").addClass("noscroll");
              that._getModels(res.body.brands[0].brdid, 0, 1);
            } else {
              // 样式2
              $.each(res.body.brands, (index, item) => {
                item.taf = false;
                item.brdimg = that.baseurl2 + item.brdid + ".png";
              });
              that.modelShowTwo = true;
              $("html").addClass("noscroll");
            }
            that.menuObj = res.body.brands;
            //that.saveQuickRepair.menuObj = res.body.brands;
            that.hrefParma.eacid = item.eacid;
            that.submitObj.eacid = item.eacid;
          } else {
            util.tip("网络超时，请稍后再试");
          }
        },
        error: function() {}
      });
    },
    // 获取型号数据
    _getModels(brdid, currentindex, type) {
      var that = this,
        hrefParma = this.hrefParma;
      //         if(type===1){
      //         	if(!!that.modelsObj[brdid]){
      //          	that.goodsObj = that.modelsObj[brdid];
      //          	this.currentindex = currentindex || 0;
      //          	return;
      //          }
      //         }else if(type===2){
      // if(!!that.modelsObjTwo[brdid]){
      //          	that.goodsObj = that.modelsObjTwo[brdid];
      //          	console.log(that.goodsObj)
      //          	return;
      //          }

      //         }

      // debug start
      // var res = {"rpco":200,"tsrp":1493876230529,"body":{"models":[{"mdld":1131,"mdnm":"iphone 7","attrgrps":[{"attrgrpid":1,"attrgrpnm":"手机颜色","attrs":[{"attrid":4708,"attrnm":"银色"},{"attrid":4742,"attrnm":"金色"},{"attrid":4743,"attrnm":"玫瑰金色"},{"attrid":4766,"attrnm":"黑色"},{"attrid":4767,"attrnm":"亮黑色"}]}]},{"mdld":1132,"mdnm":"iphone 7 Plus","attrgrps":[{"attrgrpid":1,"attrgrpnm":"手机颜色","attrs":[{"attrid":4719,"attrnm":"银色"},{"attrid":4744,"attrnm":"金色"},{"attrid":4745,"attrnm":"红色"},{"attrid":4768,"attrnm":"玫瑰金色"},{"attrid":4769,"attrnm":"黑色"},{"attrid":4770,"attrnm":"亮黑色"}]}]},{"mdld":17,"mdnm":"iPhone 6","attrgrps":[{"attrgrpid":1,"attrgrpnm":"手机颜色","attrs":[{"attrid":103,"attrnm":"银(白色屏幕)"},{"attrid":104,"attrnm":"灰(黑色屏幕)"},{"attrid":105,"attrnm":"金(白色屏幕)"}]}]},{"mdld":18,"mdnm":"iPhone 6 Plus","attrgrps":[{"attrgrpid":1,"attrgrpnm":"手机颜色","attrs":[{"attrid":112,"attrnm":"银(白色屏幕)"},{"attrid":113,"attrnm":"灰(黑色屏幕)"},{"attrid":114,"attrnm":"金(白色屏幕)"}]}]},{"mdld":284,"mdnm":"iPhone 6S","attrgrps":[{"attrgrpid":1,"attrgrpnm":"手机颜色","attrs":[{"attrid":1289,"attrnm":"金(白色屏幕)"},{"attrid":1290,"attrnm":"粉(白色屏幕)"},{"attrid":1291,"attrnm":"灰(黑色屏幕)"},{"attrid":1292,"attrnm":"银(白色屏幕)"}]}]},{"mdld":283,"mdnm":"iPhone 6S Plus","attrgrps":[{"attrgrpid":1,"attrgrpnm":"手机颜色","attrs":[{"attrid":1275,"attrnm":"金(白色屏幕)"},{"attrid":1276,"attrnm":"粉(白色屏幕)"},{"attrid":1277,"attrnm":"灰(黑色屏幕)"},{"attrid":1278,"attrnm":"银(白色屏幕)"}]}]},{"mdld":15,"mdnm":"iPhone 5C","attrgrps":[{"attrgrpid":1,"attrgrpnm":"手机颜色","attrs":[{"attrid":83,"attrnm":"白"},{"attrid":84,"attrnm":"粉"},{"attrid":91,"attrnm":"黄"},{"attrid":92,"attrnm":"蓝"},{"attrid":93,"attrnm":"绿"}]}]},{"mdld":16,"mdnm":"iPhone 5S","attrgrps":[{"attrgrpid":1,"attrgrpnm":"手机颜色","attrs":[{"attrid":94,"attrnm":"银(白色屏幕)"},{"attrid":95,"attrnm":"灰(黑色屏幕)"},{"attrid":102,"attrnm":"金(白色屏幕)"},{"attrid":674,"attrnm":"玫瑰金(白色屏幕)"}]}]},{"mdld":11,"mdnm":"iPhone 4","attrgrps":[{"attrgrpid":1,"attrgrpnm":"手机颜色","attrs":[{"attrid":48,"attrnm":"黑"},{"attrid":49,"attrnm":"白"}]}]},{"mdld":12,"mdnm":"iPhone 4S","attrgrps":[{"attrgrpid":1,"attrgrpnm":"手机颜色","attrs":[{"attrid":57,"attrnm":"黑"},{"attrid":58,"attrnm":"白"}]}]},{"mdld":14,"mdnm":"iPhone 5","attrgrps":[{"attrgrpid":1,"attrgrpnm":"手机颜色","attrs":[{"attrid":75,"attrnm":"银(白色屏幕)"},{"attrid":76,"attrnm":"灰(黑色屏幕)"}]}]}]}}
      //  if(res.rpco === 200) {
      //  	that.submitObj.brdid = brdid;
      //  	if(type===1){
      //  		$.each(res.body.models, function(i,current) {
      //          current.taf = false;
      //      })
      //  		that.goodsObj = res.body.models;
      //            that.modelsObj[brdid]= res.body.models;
      //            that.currentindex = currentindex || 0;
      //            that.render = true;
      //  	}else if(type===2){
      //  		$.each(res.body.models, function(i,current) {
      //          current.taf = false;
      //          $.each(current.attrgrps[0].attrs, function(n,item) {
      //          	item.mdnm = current.mdnm;
      //          	item.on = false;
      //      	})
      //      })

      //      that.goodsObj = res.body.models;
      //  		that.modelsObjTwo[brdid] = res.body.models;
      //      that.render = true;
      //  	}
      //     }
      //     return;
      // debug end

      util.api({
        surl:
          root.REPAIR_API_PATH +
          "queryModelsByBrand?arcode=" +
          hrefParma.arcode +
          "&eacid=" +
          this.brand.eacid +
          "&brdid=" +
          brdid,
        type: "get",
        success: function(res) {
          if (res.rpco === 200) {
            that.submitObj.brdid = brdid;
            if (type === 1) {
              $.each(res.body.models, function(i, current) {
                current.taf = false;
                current.attrgrps =
                  current.attrgrps.length > 0
                    ? current.attrgrps
                    : [{ attrs: [] }];
                $.each(current.attrgrps[0].attrs, function(n, item) {
                  item.on = false;
                });
              });
              that.goodsObj = res.body.models;
              that.modelsObj[brdid] = res.body.models;
              that.currentindex = currentindex || 0;
              //that.saveQuickRepair.currentindex = currentindex;
            } else if (type === 2) {
              $.each(res.body.models, function(i, current) {
                current.taf = false;
                current.attrgrps =
                  current.attrgrps.length > 0
                    ? current.attrgrps
                    : [{ attrs: [] }];
                $.each(current.attrgrps[0].attrs, function(n, item) {
                  item.on = false;
                });
              });
              that.currentindex = currentindex || 0;
              //that.saveQuickRepair.currentindex = currentindex;
              that.goodsObj = res.body.models;
              that.modelsObjTwo[brdid] = res.body.models;
            }
          } else {
            util.tip("网络超时，请稍后再试");
          }
        },
        error: function() {}
      });
    },
    // 选择设备
    selectDevice(item) {
      // 关闭设备列表
      this.deviceShow = false;
      // 将选择的设备渲染到页面
      this.brandObj.device = item.eacnm;
      // 获取品牌列表
      this._getBrand(item);
      // 记录当前设备
      this.brand = item;
      //this.saveQuickRepair.brand = item;
      //this.submitObj.mdld = null;
      //this.saveQuickRepair.render.brandObj = this.brandObj;
      //this.saveQuickRepair.submit = this.submitObj;
      //this.saveQuickRepair.goodsObj = [];
    },
    // 切换设备
    checkDevice(item) {
      if (this.deviceArr.length > 0) {
        this.deviceShow = true;
        $("html").addClass("noscroll");
        return;
      }
      this._getDevice();
    },
    //选择型号
    setModels(index, index2, goodsRender, onIndex, type) {
      // let parent = this.menuObj[this.currentindex],
      let parent = this.menuObj[onIndex],
        good = this.goodsObj[index],
        attrgrpid = null,
        attrid = null,
        attrnm = "",
        attrsjson = {};
      this.goodsObj = goodsRender;
      //this.saveQuickRepair.goodsObj = goodsRender;
      if (index2 !== null) {
        attrgrpid = good.attrgrps[0].attrgrpid;
        attrid = good.attrgrps[0].attrs[index2].attrid;
        attrnm = "(" + good.attrgrps[0].attrs[index2].attrnm + ")";
      }
      attrsjson = {
        attrs: [
          {
            attrgrpid: attrgrpid,
            attrid: attrid
          }
        ]
      };
      this.brandObj.brand = parent.brdnm;
      this.brandObj.model = good.mdnm + attrnm;
      if (type === 1) {
        this.modelShow = false;
        $("html").removeClass("noscroll");
      } else if (type === 2) {
        this.modelShowTwo = false;
        $("html").removeClass("noscroll");
      }

      this.submitObj.attrsjson = attrsjson;
      this.submitObj.mdld = good.mdld;
      this._getDeviesImg();
    },
    goback(hideContainer, showContainer, obj, index) {
      var that = this;
      this[hideContainer] = false;
      $("html").removeClass("noscroll");
      if (showContainer != "app") {
        this.deviceShow = true;
        $("html").addClass("noscroll");
      }
      if (obj !== undefined) {
        this.goodsObj = obj;
      }
      if (index !== undefined) {
        if (this.brand.eacnm == "手机" || this.brand.eacnm == "平板") {
          this.currentindex = index;
        } else {
          $.each(that.menuObj, (i, val) => {
            val.taf = false;
          });
          that.menuObj[index].taf = true;
        }
      }
    },
    // 提交订单
    orderSubmit(event) {
      var _this = this;
      if (!this.submitOn) return;
      this.submitOn = false;
      ripple(event);
      // 表情符
      let reg = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
      // 特殊字符
      let patrn = /[`\\@#&$%^&*_\-\/\+\|=<>{}●△●'|~@#&￥%&*——\-\+={}|《》【】]/gi;
      // 验证留言
      if (reg.test(this.submitObj.mas) || patrn.test(this.submitObj.mas)) {
        util.tip("留言内容不允许输入特殊字符、emoji表情、html符号");
        return;
      }
      let that = this,
        hrefParma = this.hrefParma,
        ls = window.localStorage,
        surl,
        data,
        source;
      if (util.isWeiXin()) {
        source = 2;
      } else {
        source = 1;
      }
      // 起止時間
      let yuan = new Date(_this.submitObj.servertime.timeStr);
      let aptstart = yuan * 1;
      let aptend =
        new Date(yuan.getFullYear(), yuan.getMonth(), yuan.getDate() + 1) * 1;
      surl =root.REPAIR_API_PATH + "quickOrderd";
      let eacNm = _this.brand.eacnm,
        buytimeCc;
      if (eacNm == "手机" || eacNm == "平板" || eacNm == "电脑") {
        buytimeCc = "";
      } else {
        buytimeCc = that.submitObj.GmTime;
      }
      data = {
        addr: _this.submitObj.addr.tsup,
        aptstart: aptstart,
        aptend: aptend,
        attrsjson: _this.submitObj.attrsjson,
        msg: _this.submitObj.mas,
        brdid: _this.submitObj.brdid,
        eacid: _this.submitObj.eacid,
        mdld: _this.submitObj.mdld,
        buytime: buytimeCc,
        devimgs:_this.submitObj.devimgs,
        origin: _this.origin,
        source: source
      };
      util.api({
        surl: surl,
        data: data,
        type: "post",
        success(res) {
          // 处理
          let body = res.body || {};
          switch (res.rpco) {
            // 正常
            case 200:
              //跳转到下单成功页
              // if(util.isApp()){
              //   util.pushWindow(_this.wl.origin+'/yf/appointresult.html?oid='+body.oid+'&odtype='+body.odtype+'&dodt='+body.dodt+'&type=1&supplierPhone='+body.supplierPhone)
              //   return false
              // }
              util.href("appointresult.html", {
                oid: body.oid,
                odtype: body.odtype,
                dodt: body.dodt,
                supplierPhone: body.supplierPhone,
                type: 1
              });
              break;
            case 404:
              util.alert("服务器繁忙，请稍后再试", { justOk: true });
              break;
            case 500:
              util.alert("服务器繁忙，请稍后再试", { justOk: true });
              break;
            case 40001:
              util.alert("请选择品牌", { justOk: true });
              break;
            case 40002:
              util.alert("请选择型号", { justOk: true });
              break;
            case 40004:
              util.alert("请选择上门时间", { justOk: true });
              break;
            case 40005:
              util.alert("请选择服务地址", { justOk: true });
              break;
            case 40006:
              util.alert("留言至多100个字", { justOk: true });
              break;
            case 40007:
              util.alert("请选择设备", { justOk: true });
              break;
            case 40011:
              util.alert("很抱歉，该地区暂未开通此项服务", { justOk: true });
              break;
            case 40012:
              util.alert("服务器繁忙，请稍后再试", { justOk: true });
              break;
            case 40013:
              util.alert("服务器繁忙，请稍后再试", { justOk: true });
              break;
            case 40014:
              util.alert("服务器繁忙，请稍后再试", { justOk: true });
              break;
            case 40401:
              util.alert("服务器繁忙，请稍后再试", { justOk: true });
              break;
            case 40402:
              util.alert("留言只可输入汉字、数字、字母和符号", { justOk: true });
              break;
            default:
              util.alert("网络错误，请重新提交", { justOk: true });
          }
        }
      });
    },
		addtime(item) {
			this.submitObj.servertime=item[0];
      this.submitObj.GmTime=item[1];
      this.submitObj.addr=item[2];
		},
    chooseaddr() {
      var ss = window.sessionStorage;
      this.submitObj.brandObj=this.brandObj;
      ss.setItem('repairorder',JSON.stringify(this.submitObj));
      if(util.isApp()){
          //this.setHeaderBar();
          this.login ? util.href('./address.html',{page:'quickrepair',tsup:this.submitObj.addr.tsup}) : GomeJSBridge.login(null,null);
        }else{
          util.href('./address.html',{page:'quickrepair',tsup:this.submitObj.addr.tsup})
        }
    }
    // setHeaderBar() {
    //   let param = {
    //     title:'测试测试测试！！！',
    //     isTitle:'hahahaha'
    //   };
    //   util.setHeadBar(param);
    // }
  },
  watch:{
    submitObj:{//判断是否可提交
      handler(newval,val) {
        if(newval.addr.tsup==""){
          this.submitOn=false;
        }else if(newval.attrsjson.attrs[0].attrid==""){
          this.submitOn=false;
        }else if(newval.brdid=="") {
          this.submitOn=false;
        }else if(newval.eacid=="") {
          this.submitOn=false;
        }else if(newval.mdld==""){
          this.submitOn=false;
        }else if(newval.servertime.day==null) {
          this.submitOn=false;
        }else if(newval.GmTime=='请选择购买时间') {
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
    serviceSteps,
    quickBrand,
    selectBrand,
    selectTwo,
    footComponents,
    selectDevice,
    selectTime,
    message,
    upload
  }
};
</script>
<style lang="less">
@import "../../util/fs.less";
/*我的资产*/
.asset {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200000;
  .asset-content {
    width: 7.2rem;
    margin: 2rem auto;
    background: #fff;
    border-radius: 5px;
    h3 {
      font-size: 0.48rem;
      color: #333;
      line-height: 1.173333rem;
      text-indent: 0.426667rem;
      background: #f5f5f5;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      position: relative;
      span {
        position: absolute;
        top: 0;
        right: 0;
        width: 1.173333rem;
        height: 1.173333rem;
        background: url(../repairsubmit/img/close.png) center no-repeat;
        background-size: 0.4rem 0.4rem;
      }
    }
    .asset-content-list {
      height: 8.88rem;
      overflow-y: scroll;
      ul {
        padding-left: 0.32rem;
        li {
          /*height: 2.96rem;*/
          padding: 0.546667rem 0;
          border-bottom: 1px solid #e3e3e3;
          .asset-i {
            margin: 0.746667rem 0 0 0.093333rem;
            width: 0.426667rem;
            height: 0.426667rem;
            background: url(//gfs11.gomein.net.cn/T1H2xvBmxg1RCvBVdK.png)
              no-repeat;
            background-size: cover;
          }
          .asset-i_s {
            background-image: url(//gfs11.gomein.net.cn/T117xvBbWg1RCvBVdK.png);
          }
          img {
            width: 1.84rem;
            height: 1.84rem;
            border: 1px solid #e3e3e3;
            margin: 0 0 0 0.266667rem;
          }
          div {
            width: 3.5rem;
            margin-left: 0.24rem;
            color: #777;
            font-size: 0.32rem;
            p {
              line-height: 0.32rem;
            }
            .p1 {
              font-size: 0.373333rem;
              color: #333;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              width: 3.5rem;
              height: 0.373333rem;
              line-height: 0.373333rem;
            }
            .p2 {
              margin-top: 0.2rem;
            }
            .p3 {
              margin-top: 0.133333rem;
            }
            .p4 {
              width: 1.2rem;
              height: 0.426667rem;
              background: #55d1c9;
              color: #fff;
              line-height: 0.426667rem;
              text-align: center;
              border-radius: 0.053333rem;
              margin-top: 0.133333rem;
              font-size: 0.293333rem;
            }
            .set-gray {
              background-color: #ccc;
            }
          }
        }
        li:last-child {
          border: 0;
        }
      }
    }
    .asset-confirm {
      height: 0.973333rem;
      padding-top: 0.2rem;
      background: #f9f9f9;
      border-bottom-right-radius: 5px;
      border-bottom-left-radius: 5px;
      span {
        display: block;
        width: 1.786667rem;
        height: 0.746667rem;
        border: 1px solid #ff4b46;
        color: #ff4b46;
        line-height: 0.746667rem;
        text-align: center;
        font-size: 0.48rem;
        border-radius: 5px;
        margin: 0 auto;
      }
    }
  }
}
/*我的资产*/
.recycle-wapper {
  padding-bottom: 1.33333rem;
  padding-top: 0;
  background: #f6f6f6;
}
.appsubmit{
  padding-bottom: 0;
}
.list-labelvalue.mt20 {
  margin-top: 0.266667rem;
}
.quickNav {
  width: 100%;
  height: 3.733333rem;
  background-color: #ef3030;
  background: url(//gfs10.gomein.net.cn/T1koKgB5WT1RCvBVdK.png) no-repeat;
  background-size: cover;
  position: relative;
  text-align: center;
  line-height: 1.2rem;
  color: #fff;
  font-size: 0.4rem;
  li.left {
    left: 0;
    top: 0;
    width: 50%;
    height: 100%;
    position: absolute;
  }
  li.right{
    width: 50%;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
  }
}
.qnotes {
  width: 100%;
  padding: 0.24rem;
  .mixinfont(13px);
  color: #777777;
  box-sizing: border-box;
  p{
    text-align:center;
  }
}
.i1 .i-gt {
  width: 0.2rem;
  height: 0.373333rem;
  position: absolute;
  right: 0.32rem;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  background: url("//gfs6.gomein.net.cn/T15eYTBXhb1RCvBVdK") no-repeat;
  background-size: 0.2rem 0.373333rem;
}
footer {
  width: 100%;
  height: 1.30667rem;
  line-height: 1.30667rem;
  text-align: center;
  background-color: #e0e0e0;
  color: #fff;
  .mixinfont(18px);
  &.on {
    background-color: #ff4b46;
  }
}
.servertype {
  width: 100%;
  font-size: 0.32rem;
  background: #fff;
  margin-top:0.29333rem;
}
.servertype .text {
  width: 100%;
  height: 1.173rem;
  line-height: 1.173rem;
  text-indent: 0.4rem;
}
.servertype .btn {
  width: 100%;
  height: 1.92rem;
}
.servertype .btn span {
  display: inline-block;
  width: 3.14667rem;
  height: 1.17333rem;
  text-align: center;
  line-height: 1.173rem;
  background: #fff1f1;
  margin-left: 0.42rem;
}
.border{
  position: relative;
}
.border:before{
  content: "";
  position: absolute;
  width: 200%;
  height: 200%;
  border: 1px solid #ff9897;
  border-radius: 8px;
  top: 0;
  left: 0;
  -webkit-transform-origin:0 0;
  -ms-transform-origin:0 0;
  -moz-transform-origin:0 0;
  -o-transform-origin:0 0;
  transform-origin:0 0;
  -webkit-transform:scale(0.5,0.5);
  -ms-transform:scale(0.5,0.5);
  -o-transform:scale(0.5,0.5);
  transform:scale(0.5,0.5);
  -webkit-box-sizing:border-box;
  -moz-box-sizing:border-box;
  box-sizing: border-box;
}

</style>
