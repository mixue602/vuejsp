<template>
<div>
  <div class="set-addr bdr-bottom" @click="getProvince">
      <label>所在地区：</label>
      <span class="value add-info" id="region" :pid="dstrict.p" :cid="dstrict.c" :did="dstrict.d" v-if="showaddinfo" :class="{'add-info':showaddinfo}">{{dstrict.pn}} {{dstrict.cn}} {{dstrict.dn}}</span>
      <span class="value" v-else>请选择</span>
      <i class="i i-gt"></i>
      <!-- <label class="an">所在地区：</label>
      <input class="js-number"> -->
  </div>
  <div class="area-dialog" v-if="addrListShow">
    <div class="area-main">
        <div class="title">
            <!-- cfg.title+ -->
            选择地址
            <div class="close" @click="close"></div>
        </div>
        <ul class="bar-list bdr-bottom">
            <li :class="{'cur': isShowProvince}" v-show="!isHideProvince" id="proName" @click="showProvince" >省</li>
            <li :class="{'cur': isShowCity}" v-show="!isHideCity" id="cityName" @click="showCity">市</li>
            <li :class="{'cur': isShowDistrict}" v-show="!isHideDistrict" id="disName" @click="showDistrict">区县</li>
        </ul>
        <div class="area-container">
            <ul class="list-textsingle" id="list" @click="getCity" v-show="isShowProvince">
              <li :val="item.arcode" v-if='provinceArea.arcode == item.arcode' class="on" v-for='item in provinceArea.chareas'>{{item.arname}}</li>
              <li :val="item.arcode" v-else v-for='item in provinceArea.chareas'>{{item.arname}}</li>
            </ul>
            <ul class="list-textsingle" id="cityList" @click="getDistrict" v-show="isShowCity">
              <li :val="item.arcode" v-if='cityArea.arcode == item.arcode' class="on" v-for='item in cityArea.chareas'>{{item.arname}}</li>
              <li :val="item.arcode" v-else v-for='item in cityArea.chareas'>{{item.arname}}</li>
            </ul>
            <ul class="list-textsingle" id="disList" @click="completeSelect"  v-show="isShowDistrict">
               <li :val="item.arcode" v-if='districtArea.arcode == item.arcode' class="on" v-for='item in districtArea.chareas'>{{item.arname}}</li>
              <li :val="item.arcode" v-else v-for='item in districtArea.chareas'>{{item.arname}}</li>
            </ul>
        </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
    data () {
        return {
          addrListShow:false,
          showaddinfo:false,
          provinceArea:{},
          cityArea:{},
          districtArea:{},
          isShowProvince:true,
          isShowCity:false,
          isShowDistrict:false,
          isHideProvince:false,
          isHideCity:true,
          isHideDistrict:true,
          hrefParma: util.getHrefParma(),
          sel: '',
          //已选地区服务是否支持
          issupport: true,
          //触发事件的元素Id/class
          elid: '',
          //要添加地址的元素Id/class
          elval: '',
          //业务id 清洗 回收 维修
          serviceId:'',
          //家电分类号（允许为空）。手机为12，其他家电类统一为15
          cateid:'',
          //行政区划代码。允许为空，表示查询所有省的信息
          arcode:'',
          // 默认选择地区
          dstrict: {
              p: '',
              pn: '',
              c: '',
              cn: '',
              d: '',
              dn: ''

          },
        }
    },
    methods:{
      setAddr:function(){
          this.addrListShow = true;
      },
      showProvince:function(){
        this.isShowProvince = true;
        this.isShowCity=false;
        this.isShowDistrict=false;


      },
      showCity:function(){
        this.isShowProvince = false;
        this.isShowCity=true;
        this.isShowDistrict=false;
        // this.isHideProvince = false;
        // this.isHideCity=false;
        // this.isHideDistrict=true;
      },
      showDistrict:function(){
        this.isShowProvince = false;
        this.isShowCity=false;
        this.isShowDistrict=true;
        // this.isHideProvince = false;
        // this.isHideCity=false;
        // this.isHideDistrict=false;
      },

      /**
       * DOM事件
       */
      addEvent: function() {
          var that = this,
              click = util.getClick(),
              frist=window.localStorage.getItem("frist");

          /*省份*/
          that.el.on(click, '#list li', function() {
              var proId = $(this).attr('val') || '',
                  proName = $(this).text() || '';
              $(this).siblings().css('color','#333');
              $(this).css('color','#ff4b46');
              $('#proName').text(proName).removeClass('cur');
              if(!frist){
                  $('#cityName').removeClass('dn').addClass('cur');
              }else{
                  $('#cityName').text('市').removeClass('dn').addClass('cur');
                  $('#disName').text('区县').addClass('dn');
              }
              // 省id
              that.options.dstrict.p = proId;
              // 省名称
              that.options.dstrict.pn = proName;
              //加载对应的城市
              that.getCity(proId);
          });
          /*城市*/
          that.el.on(click, '#cityList li', function() {
              // 市id
              var cityId = $(this).attr('val') || '',
                  // 市名称
                  cityName = $(this).text() || '';
              $(this).siblings().css('color','#333');
              $(this).css('color','#ff4b46');
              if(frist){
                  $('#disName').text('区县');
              }
              $('#cityName').text(cityName).removeClass('cur');
              $('#disName').removeClass('dn').addClass('cur');
              // 城市id
              that.options.dstrict.c = cityId;
              // 城市名称
              that.options.dstrict.cn = cityName;
              //加载对应的城市
              that.getDistrict(cityId);
          });
          /*选项单击事件区县*/
          that.el.on(click, '#disList li', function() {
              var areaCityName;//所选城市名字
              $(this).siblings().css('color','#333');
              $(this).css('color','#ff4b46');
              // 县id
              that.options.dstrict.d = $(this).attr('val') || '';
              // 县名称
              that.options.dstrict.dn = $(this).text() || '';
              //存储到localStorage
              window.localStorage.dstrict = JSON.stringify(that.options.dstrict);
              //关闭弹出层
               setTimeout(function(){$('.area-dialog').remove()},350);
               //设置地区
               areaCityName=that.options.dstrict.dn || '城区';
               if($('#selectArea')){
                  $('#selectArea').text(areaCityName);
               }
               $('.container').css('overflow-y','auto');
               //如果elval存在说明是点击了选择地址按钮
               if(that.options.elval){
                  $(that.options.elval).attr({pId:that.options.dstrict.p,cId:that.options.dstrict.c,dId:that.options.dstrict.d});
                  $(that.options.elval).html(that.options.dstrict.pn+' '+that.options.dstrict.cn+' '+that.options.dstrict.dn);
               }
              // 回调函数
              that.options.otherAction();
          });

          /*地址导航点击事件*/
          that.el.on(click, '.bar-list li', function() {
              var index = $(this).index();
              $(this).addClass('cur').siblings().removeClass('cur');
              $(".area-container > ul").eq(index).removeClass('dn').siblings().addClass('dn');
          });

          //选择地区
          that.el.on(click,'#selectArea',function(){
             that.renderAllArea();
          });

          /*选择地址事件*/
          if(that.options.elid){
              that.el.on(click, that.options.elid, function() {
                  $('input').blur();
                  var elVal = $(that.options.elval);
                  if(elVal.attr('pId')){
                      that.renderAllArea();
                  }else{
                      that.loadAreaInfo();
                  }
              });
          }


      },
      /**
       * 是否是第一次进入此页面
       */
      isFrist: function() {
          var that = this,
              frist=window.localStorage.getItem("frist");

          if(!frist){
              window.localStorage.frist='1';
              util.alert('“国美管家”需要您手动添加当前地区以便管家为您提供更好的服务',{
                  justOk: false,
                  okFn: function() {
                      //弹出层初始化省份
                      that.loadAreaInfo();
                  }
              });
          }else{
             //获取第一次选中的地区信息
             var areaStr = localStorage.getItem("dstrict");
             if(areaStr){
                  var areaJson = JSON.parse(areaStr),
                      cityName = areaJson.cn,
                      areaName = areaJson.dn,
                      areaCode = areaJson.d;
                  that.getArea(that.options.serviceId,that.options.cateid,areaCode);
                  //如果服务不支持地区
                  if(!that.options.issupport){
                      //如果不是从清洗提交订单页返回的
                      if(!that.options.hrefParma.type==1){
                          util.alert('很抱歉,'+cityName+areaName+'（已定位地区）暂不支持此服务',{justOk: true});
                      }

                      //删除之前已选的
                      localStorage.removeItem("dstrict");
                  }
             }


          }
      },
      close:function(){
        this.addrListShow = false;
      },
      /**
       * 获取地区
       * @parma {number}{1} serviceId 服务id
       * @parma {number}{1} cateid 加点分类编号
       * @parma {number}{1} arcode 地区编号
       * @parma {number}{1} ele 地区添加父元素
       */
      // getArea: function(item) {
      //   console.log(item);
      // },
     /**
     * 获取省
     */
    getProvince: function() {
        var that = this;
        that.isShowProvince = true;
        that.isShowCity = false;
        that.isShowDistrict = false;

        that.isHideProvince = false;
        that.isHideCity=true;
        that.isHideDistrict=true;

        that.getArea({'serviceId':'','cateid':'','arcode':'','sel':'provinceArea'})
    },
    /**
     * 获取市
     */
    getCity: function(e) {
      // pId
        var that = this;
        that.isShowProvince = false;
        that.isShowCity = true;
        that.isShowDistrict = false;

        that.isHideProvince = false;
        that.isHideCity=false;
        that.isHideDistrict=true;

        var targetEle = $(e.target);
        targetEle.addClass('on').siblings().removeClass('on');
        var arcode =targetEle.attr('val');
        that.dstrict.p = arcode;
        that.dstrict.pn = targetEle.text();
        //隐藏身份列表，显示城市列表
        // $('#list').addClass('dn');
        // $('#cityList').removeClass('dn');
        // //城市选项标红
        // $('.bar-list li').removeClass('cur');
        // $('#cityName').removeClass('dn').addClass('cur');

        // 获取市列表
        that.getArea({'serviceId':'','cateid':'','arcode':arcode,'sel':'cityArea'});
    },
    /**
     * 获取区县
     */
    getDistrict: function(e) {
        var that = this;
        that.isShowProvince = false;
        that.isShowCity = false;
        that.isShowDistrict = true;

        that.isHideProvince = false;
        that.isHideCity=false;
        that.isHideDistrict=false;

        var targetEle = $(e.target);
        targetEle.addClass('on').siblings().removeClass('on');
        var arcode =targetEle.attr('val');
        that.dstrict.c = arcode;
        that.dstrict.cn = targetEle.text();

        that.getArea({'serviceId':'','cateid':'','arcode':arcode,'sel':'districtArea'})
    },
    /**
     * [completeSelect description]
     */
    completeSelect: function(e){
      var that = this;
      var targetEle = $(e.target);
      targetEle.addClass('on').siblings().removeClass('on');
      var arcode =targetEle.attr('val');
      that.dstrict.d = arcode;
      that.dstrict.dn = targetEle.text();
      that.addrListShow = false;
      that.showaddinfo = true;
      window.localStorage.dstrict = JSON.stringify(that.dstrict);
      console.log(that.dstrict);
      that.$emit('areacode',arcode);
    },
    getArea: function(para) {
        var that = this;
        that.addrListShow = true;
        // 请求...
        util.api({
            surl: root.CE_API_PATH + 'coverageArea',
            type: 'get',
            data:{
              serviceId: para.serviceId,
              cateid: para.cateid,
              arcode: para.arcode
            },
            async: false,
            beforeSend: function() {
                // 加载提示
                util.comShow({txt: '正在努力加载中…', icl: 'i-load ro360'});
            },
            success: function(response) {
                var rpco = response.rpco,
                    body = response.body || {};
                // 处理
                switch(rpco) {
                    case 200:
                      that[para.sel] = body.area;
                        // 渲染
                        // if(body.area && ele){
                        //     // 渲染页面
                        //    body.area.chareas && that.renderItem(body.area.chareas,ele);
                        // }else{
                        //     if(body.area){
                        //         //设置应该显示的城市
                        //         body.area.arname && ($('#selectArea').html(body.area.arname) || '城区');
                        //     }else{
                        //        that.options.issupport = false;
                        //     }

                        // }
                        break;
                    default:
                        util.tip('请求失败')
                }

            },
            complete: function() {
                // 移除提示
                util.remComShow();
            }
        });
    },
  }

}

</script>

<style lang="less">
    @import '../../util/fs.less';
    /*.mixinfont(16px);*/
    .set-addr{
        display: flex;
        align-items: center;
        background: #fff;
        padding: 0.266667rem 0.32rem;
        height: 0.666667rem;
        line-height:0.666667rem;
        .mixinfont(14px);
        /*input{
            margin-left: 0.533333rem;
            width:3.466667rem;
        };*/
        .value{width: 6.8rem;text-align: right;color: #ccc;}
        .add-info{color: #333;text-align: left;}
        .i{background: url(//gfs12.gomein.net.cn/T1yQhvBTbg1RCvBVdK.png) no-repeat;width: 0.186667rem;height: 0.373333rem;background-size:100%;margin-left: 0.293333rem;}
      }
    /*选择地区弹出层样式 start*/
    .area-dialog{
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.5);
        display: table;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9999980;
    }
    .area-main{
       width:100%;
       height:54%;
       background:#fff;
       position:absolute;
       bottom:0;
       left:0;
    }
    .area-main .title{
        position:relative;
        width:100%;
        height:1.173333rem;
        line-height: 1.173333rem;
        text-align: center;
        .mixinfont(16px);
        color: #777;
        background: #f5f5f5;
    }
    .area-main .close{
        width:0.48rem;
        height:0.48rem;
        padding:0.346667rem;
        background: url(//gfs10.gomein.net.cn/T1JuEvBbCg1RCvBVdK.png) center center no-repeat;
        background-size: 45%;
        position: absolute;
        top: 0;
        right: 0;
    }
    .area-main .bar-list{
        width:100%;
        height:1.066667rem;
        line-height: 1.066667rem;
        overflow: hidden;
    }
    .area-main .bar-list li{
        margin-left:0.32rem;
        margin-right:0.853333rem;
        padding:0 0.066667rem;
        color:#333;
        .mixinfont(16px);
        float: left;
        position: relative;

    }
    .area-main .bar-list li.cur{
        color:#ff4b46;
    }
    .area-main .bar-list li.cur:after{
        content: '';
        width:100%;
        height:0.013333rem;
        background: #ff4b46;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1;
    }
    .area-container{
        width: 100%;
        /*min-width: 320px;*/
        /*min-width: 4.266667rem;*/
        background-color: #fff;
        overflow-x: hidden;
        overflow-y: auto;
        position: absolute;
        top: 2.24rem;
        bottom: 0;
    }
    .area-dialog .list-textsingle{
        line-height:1.066667rem;
    }
    .area-dialog .list-textsingle li,.area-dialog .list-textsingle{
        border:none;
    }
    .on{color: #ff323a}
    /*选择地区弹出层样式 end*/
</style>