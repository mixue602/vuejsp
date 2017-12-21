<template>
    <div class="wapper wapper-bg">
	    <header-component :title="title" class="bdr-bottom"></header-component>
        <div>

    	    <ul class="oTrack-nav bdr-bottom" >
    			<li v-bind:class="{'active': showItemName=='order'}" @click="itemShow('order')" >
    				<a href="javascript:;" v-bind:class="{'bdr-bottom': showItemName=='order'}">配送进度</a>
    			</li>
    			<li v-bind:class="{'active': showItemName=='install'}" @click="itemShow('install')">
    				<a href="javascript:;" v-bind:class="{'bdr-bottom': showItemName=='install'}">安装履历</a>
    			</li>
    		</ul>
            <div class="oTrack-con" v-show="showItemName=='order'">
                <div class="order-info">
                    <img :src="orderheadIcon" class="info-img" :onerror="defaultImg">

                    <ul class="info-text">
                       <!--  <li>
                            <div id="hello">hello</div>
                            <button class="btnn" data-clipboard-action="copy" data-clipboard-target="#hello" @click="copyy">Copy</button>
                        </li> -->
                        <li v-show="ordertbi.oid"><span>货运单号：<em id="oidtxt">{{ordertbi.oid}}</em></span>
                            <a v-show="ordertbi.oid" class="copy copybtn" @click="copyy" href="javascript:;" data-clipboard-action="copy" data-clipboard-target="#oidtxt"  class="copyBtn t15">复制</a>
                        </li>
                        <li v-show="ordertbi.delrComp"><span>承运商：<em>{{ordertbi.delrComp}}</em></span></li>
                        <li v-show="ordertbi.delrCompPhone"><span>承运商电话：<a href="tel:400482025" class="tel">{{ordertbi.delrCompPhone}}</a></span></li>
                        <li v-show="ordertbi.deliveryId"><span>订单配送单号：<em id="deliveryIdtxt">{{ordertbi.deliveryId}}</em></span>
                            <!-- <a class="copybtn" @click="copy" href="javascript:;" v-bind:data-clipboard-text="detailResult.ordNm" class="copyBtn t15" id="copyBtn">复制</a> -->
                             <a v-show="ordertbi.oid" class="copy copybtn" @click="copyy" href="javascript:;" data-clipboard-action="copy" data-clipboard-target="#deliveryIdtxt"  class="copyBtn t15">复制</a>
                        </li>
                    </ul>
                </div>
                <!-- <div id="allmap" class="baidu-map" v-show="gps&&gps.gpsStart" style="margin:0 auto"></div> -->
                <ul class="logis-detail">
                    <li :class="{'logis-detail-first': index==0}" class="" v-for="(item,index) in orderSdfmcl" >
                        <div class="logis-detail-content bdr-bottom">
                            <div class="dispatching">
                                <div class="dispatching-con">
                                    <p class="logis-detail-txt">{{item.sdfmwd}}</p>
                                    <p class="logis-detail-time">{{item.sdfmtm |formatDate}}</p>
                                    <!-- <p class="logis-detail-time" >{{item.servant.headIcon}}</p> -->
                                </div>
                                <div class="courier" v-show="item.sdfmst=='EX'" v-if="orderHeadClick" @click="fnServant(1,servant.id,ordertbi.deliveryId)"><img :src='servant.headIcon' ></img></div>
                                <div class="courier" v-show="item.sdfmst=='EX'" v-else @click="fnServant(1,servant.id,ordertbi.deliveryId)"><img :src='servant.headIcon' ></img></div>

                                <!-- <div class="courier" v-if="item.servant!=null"><img :src='item.servant.headIcon'></img></div> -->
                            </div>
                        <!-- DL时不显示 -->
                            <div id="allmap" class="baidu-map" v-if="gps&&gps.gpsStart&&item.sdfmst=='EX'&&!isDL"></div>
                            <!-- <div id="allmap" class="baidu-map" v-show="gps&&gps.gpsStart&&item.isshowMap"></div> -->
                        </div>
                    </li>
                </ul>
            </div>
            <div class="oTrack-con" v-show="showItemName == 'install'" >
                <div class="order-info" v-show="installShow" >
                    <img :src="installheadIcon" class="info-img" :onerror="defaultImg">
                    <ul class="info-text">
                        <li v-show="installtbi.installId"><span>安装单号：<em id="installIdtxt">{{installtbi.installId}}</em></span>
                            <!-- <a class="copybtn" @click="copy" href="javascript:;" v-bind:data-clipboard-text="detailResult.ordNm" class="copyBtn t15" id="copyBtn">复制</a> -->
                             <a v-show="ordertbi.oid" class="copy copybtn" @click="copyy" href="javascript:;" data-clipboard-action="copy" data-clipboard-target="#installIdtxt"  class="copyBtn t15">复制</a>
                        </li>
                        <li v-show="installtbi.insComp"><span>安装公司：<em>{{installtbi.insComp}}</em></span></li>
                        <li v-show="installtbi.insCompPhone"><span>安装电话：<em id="insCompPhonetxt">{{installtbi.insCompPhone}}</em></span>
                            <!-- <a class="copybtn" @click="copy" href="javascript:;" v-bind:data-clipboard-text="detailResult.ordNm" class="copyBtn t15" id="copyBtn">复制</a> -->
                             <a v-show="ordertbi.oid" class="copy copybtn" @click="copyy" href="javascript:;" data-clipboard-action="copy" data-clipboard-target="#insCompPhonetxt"  class="copyBtn t15">复制</a>
                        </li>
                    </ul>
                </div>
                <ul class="logis-detail" v-show="installShow">
                    <li :class="{'logis-detail-first': index==0}" class="" v-for="(item,index) in installSdfmcl" >
                        <div class="logis-detail-content bdr-bottom">
                            <div class="dispatching">
                                <div class="dispatching-con">
                                    <p class="logis-detail-txt">{{item.sdfmwd}}</p>
                                    <p class="logis-detail-time">{{item.sdfmtm |formatDate}}</p>
                                    <!-- <p class="logis-detail-time" >{{item.servant.headIcon}}</p> -->
                                </div>
                                <!-- <div class="courier" v-show="item.sdfmst=='EX'" @click="fnServant(2)"><img :src='servantIcon' :onerror="defaultHeadImg"></img></div> -->

                                <!-- <div class="courier" v-if="item.servant!=null"><img :src='item.servant.headIcon'></img></div> -->
                                <div class="courier" v-if="installHeadClick"  v-show="item.sdfmst=='INSTALLING'" @click="fnServant(2,installservant.id,installtbi.installId)"><img :src='installservant.headIcon' :onerror="defaultHeadImg"></img></div>
                                <div class="courier" v-else  v-show="item.sdfmst=='INSTALLING'"><img :src='installservant.headIcon' :onerror="defaultHeadImg"></img></div>
                            </div>
                        </div>
                    </li>
                </ul>

            </div>

        </div>


    </div>

    <!-- </div> -->
</template>
<script type='text/ecmascript-6'>
  var root = window || {},
    util = root.util || {};

  import headerComponent from "../../components/HeaderComponent";
  export default {
    data() {
        return {
            title: "订单轨迹",
            showItemName:'order',
            oid:util.getHrefParma().oid,
            orderInfo:{},
            tbi:{},//轨迹简要信息
            gdiul:"http://placehold.it/100x100",
            headIcon:'',

            gps:{gpsStart:''},
            servant:{
                id:"",
                name:"",
                headIcon:'//gfs13.gomein.net.cn/T1.ZYQBChT1RCvBVdK.png',
                phone:"",
                starRated:""
            },
            installservant:{
                id:"",
                name:"",
                headIcon:'//gfs13.gomein.net.cn/T1oLJvBsCT1RCvBVdK.png',
                phone:"",
                starRated:""
            },
            orderHeadClick:false,
            installHeadClick:false,
            isDL:false,
            orderSdfmcl:{}, //订单送装信息集合
            ordertbi:{},
            ordergdls:{},
            orderheadIcon:'//gfs13.gomein.net.cn/T1.ZYQBChT1RCvBVdK.png',
            defaultImg: 'this.src="//gfs13.gomein.net.cn/T1.ZYQBChT1RCvBVdK.png"',
            defaultHeadImg: 'this.src="//gfs13.gomein.net.cn/T1oLJvBsCT1RCvBVdK.png"',
            servantIcon:'//gfs13.gomein.net.cn/T1oLJvBsCT1RCvBVdK.png',

            installrpco:'',
            installSdfmcl:{}, //安装送装信息集合
            installtbi:{},
            installgdls:{},
            installheadIcon:'//gfs13.gomein.net.cn/T1.ZYQBChT1RCvBVdK.png',
            hrefParma:util.getHrefParma(),
            orderShow:true,
            installShow:false,
            address_detail: null, //详细地址
            isenlarge:true,
         userlocation:{lng:"",lat:""},
         // isShowMap: false;
		}
    },
    filters: {
        formatDate(time) {
            return util.formateDate(time, 'yyyy-MM-dd hh:mm:ss');
        }
    },
    created() {
        this.hrefParma = util.getHrefParma();//获取url参数
        if(this.hrefParma.resumeType==1){
            this.showItemName = 'order';
        } else if(this.hrefParma.resumeType==2){
            this.showItemName = 'install';
        }
        this._getOrderProcess();
        // this._getInstallProcess();
        if(util.isApp()){
          util.deleteHeadBtn();
        }
    },
    updated(){

    },
    mounted(){
        let that = this;
        that.baiduMap();
        // alert($('.BMap_pop').length)
        // $('.BMap_pop').css({'transform':'scale(0.5)'});
    },

     methods:{
        fnCxservant: function(svty,epnb,spgid,sel) {
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
                    surl:'/comment/yf/employee/getComment',
                    data:{
                        // 订单id
                        otn:that.hrefParma.oid,
                        // 服务人员id
                        epnb:epnb,
                        // 配送单号
                        // spgid:that.ordertbi.deliveryId,
                        spgid:spgid,
                        // 服务类型
                        svty:svty,
                        // 订单类型
                        odtp:odtp,
                        // 下单时间
                        dodt:that.hrefParma.dodt
                    },
                    type:'get',
                    success:function(response) {
                        var rpco = response.rpco,
                            body = response.body;

                        if (rpco == 200) {
                            if(sel=='servant'){
                                that.orderHeadClick = true;
                            } else if(sel=='installservant'){
                                that.installHeadClick = true;
                            }
                            // 服务人员id
                            that[sel].id = body.epnb;
                            // 服务人员姓名
                            that[sel].name = body.epnm;
                            // 服务人员头像
                            that[sel].headIcon = body.epimg;
                            that[sel].phone =body.epphe;
                            // 星星
                            that[sel].starRated = Math.round(body.tscore/body.tnum);
                            let ss=window.localStorage;
                            ss.setItem('servant',JSON.stringify(that.servant));
                        };
                    }
                })
            },
        /*快递员*/
         fnServant(svty,epnb,spgid) {
                var that = this,
                    odtp;
                if (that.hrefParma.odtype == 201) {
                    odtp = 0;
                }else if(that.hrefParma.odtype == 202){
                    odtp = 1;
                }else{
                    odtp = 2;
                };
                if (!that.servant.id) return;
                util.href('discussPeople.html',{
                    // 订单id
                    otn:that.hrefParma.oid,
                    // 服务人员id
                    epnb:epnb,
                    // epnb:that.servant.id,
                    // 配送单号
                    spgid:that.ordertbi.deliveryId,
                    // 服务类型
                    svty:svty,
                    // 订单类型
                    odtp:odtp,
                    dodt:that.hrefParma.dodt
                })
            },

        //请求gps接口，请求订单详情获取地址，
        baiduMap(){
            let that = this,
            oid = that.hrefParma.oid,
            odtype = that.hrefParma.odtype,
            dodt = that.hrefParma.dodt,
            shippingGroupId = that.hrefParma.shippingGroupId;
            util.api({
                surl:root.ORDER_API_PATH + 'currentGps',
                type:'get',
                data:{
                    oid:oid,
                    odtype:odtype*1,
                    dodt:dodt,
                    shippingGroupId:shippingGroupId
                },
                success:function(res) {
                    var rpco = res.rpco,//响应状态码
                        body = res.body;
                    // 处理
                    switch(rpco) {

                        case 200:
                        that.gps = body.gps;
                        that.servant = body.servant;

                         if(that.gps){
                            var starPos = that.gps.gpsStart;
                            var disPos = that.gps.gpsCurr;
                            var endPos = '';
                            util.api({
                        // surl: '/resources/json/detailsw.json',
                                surl: root.ORDER_API_PATH + 'gmOrder',
                                data: {
                                    oid: oid,
                                    odtype: odtype,
                                    dodt: dodt,
                                    shippingGroupId: shippingGroupId
                                },
                                type: 'get',
                                success: function(res) {
                                    var rpco = res.rpco,
                                        body = res.body || {};
                                    // 处理
                                    switch (rpco) {
                                        case 200:
                                            var faddr = body.faddr;
                                            if (faddr) {
                                                var myGeo = new BMap.Geocoder();
                                                myGeo.getPoint(faddr, function(point){
                                                    if (point) {
                                                       var endPos = point;
                                                       let ss=window.localStorage;
                                                       ss.setItem('lbs',JSON.stringify({'starPos':starPos,'endPos':endPos,'disPos':disPos,'time':that.orderSdfmcl[0].sdfmtm,'txt':that.orderSdfmcl[0].sdfmwd,'deliveryId':that.ordertbi.deliveryId}));

                                                      that.showMap(starPos,disPos,endPos);


                                                    }else{
                                                        util.tip("您选择地址没有解析到结果!");
                                                    }
                                                });
                                            }

                                            break;
                                            // 没有找到对应数据
                                        case 404:
                                            // 加载提示
                                            util.comShow({
                                                txt: '非常抱歉，您访问的订单不存在',
                                                icl: 'i-page'
                                            });
                                            break;
                                        default:
                                            util.tip('服务器繁忙，请稍后再试')
                                    }
                                }
                            });
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
                }
            })

        },

        //根据坐标，创建地图
        showMap(starPos,disPos,endPos){
            var that = this;

            var map = new BMap.Map("allmap");// 创建地图实例
            map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);// 初始化地图，设置中心点坐标和地图级别,越大地图越大
            /**************/
                // var point = new BMap.Point(116.312328,39.919141);
                // var infoWindow = new BMap.InfoWindow('阳阳');  // 创建信息窗口对象
                // map.openInfoWindow(infoWindow,point); //开启信息窗口
            // 百度地图API功能
/***********/
            that.enlargeControl(map);
            var startPoint = starPos.split(',').reverse(),
                disPoint = disPos.split(',').reverse();
            var startLBS = new BMap.Point(startPoint[0], startPoint[1]); //仓库
            var endLBS = endPos;
            var disLBS = new BMap.Point(disPoint[0], disPoint[1]); //配送员
            // let ss=window.localStorage;
            // ss.setItem('lbs',JSON.stringify({'startLBS':startLBS,'endLBS':endLBS,'disLBS':disLBS}));

            //设置起终点icon
            var starIcon = new BMap.Icon("//gfs13.gomein.net.cn/T1TKVQBmET1RCvBVdK.png", new BMap.Size(21, 24), {　
                anchor: new BMap.Size(10, 24)　　　　　　　　　　　　　　　　　
            });
            var endIcon = new BMap.Icon("//gfs11.gomein.net.cn/T1ijZvBmJT1RCvBVdK.png", new BMap.Size(21, 24), {
                anchor: new BMap.Size(10, 24)
            });
            var disIcon = new BMap.Icon("//gfs10.gomein.net.cn/T1aRE_B5WT1RCvBVdK.png", new BMap.Size(46, 51), {
                anchor: new BMap.Size(20, 51)
            });

            var headIcon=that.servant.headIcon||'//gfs13.gomein.net.cn/T1oLJvBsCT1RCvBVdK.png',
                name = that.servant.name,
                phone = that.servant.phone

            var driving = new BMap.DrivingRoute(map, {
                onSearchComplete: function(res) {
                    if (driving.getStatus() == BMAP_STATUS_SUCCESS) {
                        //获取配送员和收货地址之间的距离
                        var distance = res.getPlan(0).getDistance(true),
                            dishtml, n;
                        if (distance.indexOf('公里') > -1) {
                            n = distance.substring(distance.indexOf('公里'), -2)
                            dishtml = "据您" + n + "km"
                        } else {
                            n = distance.substring(distance.indexOf('米'), -1)
                            dishtml = "据您" + n + "m"
                        }

                        //起点icon
                        var starMarker = new BMap.Marker(startLBS, {
                            icon: starIcon
                        });
                        var starLabel = new BMap.Label("仓库", {
                            offset: new BMap.Size(36, 2)
                        });
                        starLabel.setStyle({
                            color: "#f5f5f5",
                            border: 0,
                            fontSize: "13px",
                            backgroundColor: ''
                        });
                        starMarker.setLabel(starLabel);
                        map.addOverlay(starMarker);
                        if (disPos) {
                            //配送员icon
                            var disMarker = new BMap.Marker(disLBS, {
                                icon: disIcon
                            });
                            map.addOverlay(disMarker);
                            disMarker.addEventListener("click",function(){
                                window.location.href = 'tel://150000000';
                            });
                        }
                        // var infoWindow = new BMap.InfoWindow("地址：北京市东城区王府井大街88号乐天银泰百货八层", opts);  // 创建信息窗口对象
                        // map.openInfoWindow(infoWindow,disLBS); //开启信息窗口

                        // 百度地图API功能
                        //  width: ;
                        // height: 0.853333rem;
                        // var sContent = '<div class="servantInfo"><a href="tel:'+phone+'" class="callImg"><img src="'+headIcon+'"></a><div class="infotxt bdr-r"><p>'+name+'</p><p><a href="tel:'+phone+'">'+phone+'</a></p></div><div class="distance">'+dishtml+'</div></div>';
                        // // var sContent =''+dishtml;
                        // var infoWindow = new BMap.InfoWindow(sContent,opts);  // 创建信息窗口对象
                        // map.openInfoWindow(infoWindow,disLBS); //开启信息窗口


/**标注**/
                        //终点icon
                        var endMarker = new BMap.Marker(endLBS, {
                            icon: endIcon
                        });
                        map.addOverlay(endMarker);
                        var endLabel = new BMap.Label("收货地址", {
                            offset: new BMap.Size(26, 2)
                        });
                        endLabel.setStyle({
                            color: "#f5f5f5",
                            border: 0,
                            fontSize: "13px",
                            backgroundColor: ''
                        });
                        endMarker.setLabel(endLabel);
                        //绘制路线
                        var arrPois = res.getPlan(0).getRoute(0).getPath();
                        var polyline = new BMap.Polyline(arrPois, {
                            strokeColor: '#ff0000',
                            strokeOpacity: 0.8
                        });
                        // if (orderstate != 4 && orderstate != 388) {
                        //     polyline.setStrokeStyle("dashed"); //收货以前虚线
                        // }
                        map.addOverlay(polyline);
                        map.setViewport(arrPois);
                        map.panTo(disLBS);
                    }
                }
            });
            driving.search(disLBS, endLBS);

        },

       //放大地图
       enlargeControl(map){
                var that = this;
                // 定义一个控件类,即function
                function ZoomControl(){
                  // 默认停靠位置和偏移量
                  this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
                  this.defaultOffset = new BMap.Size(10, 10);
                }

                // 通过JavaScript的prototype属性继承于BMap.Control
                ZoomControl.prototype = new BMap.Control();

                // 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
                // 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
                ZoomControl.prototype.initialize = function(map){
                  // 创建一个DOM元素
                  var div = document.createElement("div");
                  div.id = 'enlarge';
                  map.getContainer().appendChild(div);
                  // 添加文字说明
                  // div.appendChild(document.createTextNode("放大2级"));
                  // 设置样式
                  $('#enlarge').css({'cursor':'pointer','background':'url(//gfs10.gomein.net.cn/T19fAvBmKT1RCvBVdK.png) 0 0 no-repeat','background-size':'100%','width':'0.8rem','height':'0.8rem'});

                  // 绑定事件,点击一次放大两级
                  // div.onclick = function(e){
                  //   if(that.isenlarge){
                  //       // $('#allmap').css({'position':'absolute','width':'100%','height':'100%','top':0,'left':0})
                  //       $('#allmap').css({'position':'absolute','z-index':9999});
                  //       $('#allmap').addClass('enlarge')
                  //   } else{
                  //       $('#allmap').css({'position':'relative'});
                  //       $('#allmap').removeClass('enlarge')
                  //   }
                  //   that.isenlarge = !that.isenlarge;
                  // }

                  div.onclick = function(e){
                    let temp = util.getHrefParma();
                    temp.epnb = that.servant.id;//员工编号
                    temp.spgid=that.ordertbi.deliveryId;//配送订单号
                    util.href("enlargemap.html",temp);
                  }



                  // 添加DOM元素到地图中

                  // 将DOM元素返回
                  return div;
                }
                // 创建控件
                var myZoomCtrl = new ZoomControl();
                // 添加到地图当中
                map.addControl(myZoomCtrl);
                /***********/

       },
         itemShow(name){
             this.showItemName = name;
         },
         copyy(){
            var clipboard = new Clipboard('.copybtn');
            clipboard.on('success', function(e) {
                 util.tip('复制成功!');
            });

            clipboard.on('error', function(e) {
                util.tip('浏览器不支持自动复制,请手动复制!');
            });
         },
         copy(){
	        	// $(".copy-layer").addClass('dn');
	        	var clipboard = new Clipboard(".copyBtn");
				clipboard.on('success', function(e) {
				    util.tip('复制成功!');
				});
				clipboard.on('error', function(e) {
					util.tip('浏览器不支持自动复制,请手动复制!');
				});
	        },
        // 请求订单
        _getOrderProcess() {
            var that = this;
            util.api({
                surl:root.ORDER_API_PATH + 'gmOrderResume',
                // async: false,
                type:'get',
                data:{
                    oid:that.hrefParma.oid,
                    shippingGroupId:that.hrefParma.shippingGroupId,
                    dodt:that.hrefParma.dodt,
                    odtype:that.hrefParma.odtype*1,
                    resumeType:1  //履历类型。1配送，2安装
                },
                success:function(res) {
                    var rpco = res.rpco,//响应状态码
                        body = res.body;
                    // 处理
                    switch(rpco) {
                        case 200:
                            that.orderInfo = body;
                            that.ordertbi = body.tbi;
                            that.servant = body.servant;
                            that.orderSdfmcl = body.sdfmcl;
                            that.ordergdls = body.gdls;
                            that.orderheadIcon =  that.ordergdls[0].imgs[0];
                            if(body.servant.id){
                                that.fnCxservant(1,body.servant.id,that.ordertbi.deliveryId,'servant');
                            }
                            if(that.orderSdfmcl[0].sdfmst=="DL"){
                                that.isDL = true
                            }

                            that._getInstallProcess();

                            // var hrefParma =
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
        },
          // 请求安装
        _getInstallProcess() {
            var that = this;
            util.api({
                // surl:'/resources/json/ordertrack.json',
                surl:root.ORDER_API_PATH + 'gmOrderResume',
                type:'get',
                data:{
                    oid:that.hrefParma.oid,
                    shippingGroupId:that.hrefParma.shippingGroupId,
                    dodt:that.hrefParma.dodt,
                    odtype:that.hrefParma.odtype*1,
                    resumeType:2   //履历类型。1配送，2安装
                },
                success:function(res) {

                    let rpco = res.rpco,//响应状态码
                        body = res.body;
                    // 处理
                    that.installrpco = rpco;
                    if(rpco==200){
                        that.installShow = true;
                        that.installtbi = body.tbi;
                        that.installSdfmcl = body.sdfmcl;
                        that.installgdls = body.gdls;
                        that.installheadIcon = that.installgdls[0].imgs[0];
                        // var installServantId = body.servant.id;
                        if(body.servant.id){
                            that.fnCxservant(2,body.servant.id,that.ordertbi.deliveryId,'installservant');
                        }
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
    .baidu-map{margin-top: .18rem;width: 8.613333rem;height: 3.733333rem}
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
          /*a.bdr-bottom:after{bottom:0;left: .106667rem;width:1.28rem;background: #FF4B41;}*/
          a.bdr-bottom:after{bottom:0;left: 50%;margin-left:-0.64rem;width:1.28rem;background: #FF4B41;}
        }
      li.active a{
          color: #FF4B41;
      }

  }
  .enlarge{position:absolute;width:100%;height:100%;top:0;left:0;}
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
                    .copybtn{border: .013333rem solid #999;text-align: center;width: 1.04rem;height: .506667rem;line-height: .533333rem;color: #999;position: absolute;bottom: 0;right: 0;}
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

  .servantInfo{
    /*width: 3.973333rem;*/
    width: 5.333333rem;
    height: 0.853333rem;
    /*padding: 0.16rem;*/
    display: flex;
    border-radius: 0.053333rem;
    justify-content: center;
    align-items:center;
    .callImg{
        img{width: 0.853333rem;height: 0.853333rem;display: block;}
    }
    .infotxt{padding: 0 0.133333rem}
    .distance{width: 0.96rem;padding-left: 0.133333rem;}
  }
  .anchorBL {
    display: none;
  }
</style>


