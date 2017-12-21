<template>
    <div class="wapper wapper-bg">
	    <header-component :title="title" class="bdr-bottom"></header-component>
        <div class="wapper" >
            <div id="allmap" class="baidu-map"  ></div>
        </div>

        <div class="serviceinfo">
            <div class="headIcon bdr-r" @click="fnServant"><img :src="servant.headIcon" ></img></div>
            <div class="info">
                <div class="xing">
                    <span class="tit">{{servant.name}}</span>
                    <div class="discuss-people-starts">
                        <template v-for="(n,i) in 5">
                            <span :class="[{active: i < servant.starRated},'']" :key="i" ></span>
                        </template>
                    </div>
                </div>
                <p class="txt">{{sdfmwd}}</p>
                <p class="time">{{time|formatDate}}</p>
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
            starPos:{},
            endPos:{},
            disPos:{},
            defaultImg: 'this.src="//gfs13.gomein.net.cn/T1oLJvBsCT1RCvBVdK.png"',
            deliveryId:'',

               // starPos,disPos,endPos
            hrefParma:util.getHrefParma(),
            time:'',
            sdfmwd:'',

            peopleInfo:{}, //用户信息
            score:5,
            servant:{
                id:"",
                name:"",
                headIcon:'//gfs13.gomein.net.cn/T1.ZYQBChT1RCvBVdK.png',
                phone:"",
                starRated:""
            },
            Tags: {},  //对应星级对应所有标签

		}
    },

    filters: {
        formatDate(time) {
            return util.formateDate(time, 'yyyy-MM-dd hh:mm:ss');
        }
    },

    created() {
        let that = this;
        let ss=window.localStorage;
        if(!!ss.getItem("servant")){
          that.servant = JSON.parse(ss.getItem("servant"));
        }
    },
    updated(){

    },
    mounted(){
        let that = this;
         // let ss=window.localStorage;
         //  if (!!ss.getItem("repair")) {
         //    var savecleanrepair = JSON.parse(ss.getItem("repair"));
         //    this.submitObj = savecleanrepair || {};//回显
         //    this.$nextTick(function(){
         //        this.$refs.hximglist.getPic(this.submitObj.devimgs);
         //    })

         //    ss.removeItem("repair");
         //  }

        let ss=window.localStorage;
        if(!!ss.getItem("lbs")){
          var lbs = JSON.parse(ss.getItem("lbs"));
          that.sdfmwd = lbs.txt;
          that.time = lbs.time;
          that.starPos=lbs.starPos;
          that.endPos=lbs.endPos;
          that.disPos=lbs.disPos;
          that.showMap(that.starPos,that.disPos,that.endPos);
          that.deliveryId = lbs.deliveryId
          // ss.removeItem("lbs");

        }
        // if(!!ss.getItem("servant")){
        //   that.servant = JSON.parse(ss.getItem("servant"));

        // }



    },

     methods:{

       showMap(starPos,disPos,endPos){
            var that = this;

            var map = new BMap.Map("allmap");// 创建地图实例
            map.centerAndZoom(new BMap.Point(disPos), 11);// 初始化地图，设置中心点坐标和地图级别,越大地图越大
            /**************/
            /*地图上显示备注信息*/
            // var point = new BMap.Point(116.312328,39.919141);
            var infoWindow = new BMap.InfoWindow('阳阳');  // 创建信息窗口对象
            map.openInfoWindow(infoWindow,disPos); //开启信息窗口
            // 百度地图API功能
/***********/
            that.enlargeControl(map);
            //添加显示缩放按钮
            map.addControl(new BMap.NavigationControl({
                offset: new BMap.Size(5, 80)
            }));
            // 添加定位控件
            var geolocationControl = new BMap.GeolocationControl();
            map.addControl(geolocationControl);
            var startPoint = starPos.split(',').reverse(),
                disPoint = disPos.split(',').reverse();
            var startLBS = new BMap.Point(startPoint[0], startPoint[1]); //仓库
            var endLBS = new BMap.Point( endPos.lng,endPos.lat);
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

            // var phone = that.servant.phone,
            //     name = that.servant.name,
            //     headIcon = that.servant.headIcon;
            //     console.log(headIcon);
            //  // var head = "http://lbsyun.baidu.com/jsdemo/img/fox.gif";
            // var myIcon = new BMap.Icon(headIcon, new BMap.Size(300,157));
            // var theadIcon = new BMap.Icon(headIcon, new BMap.Size(40, 40), {
            //     anchor: new BMap.Size(40, 51)
            // });
            var driving = new BMap.DrivingRoute(map, {
                onSearchComplete: function(res) {
                    if (driving.getStatus() == BMAP_STATUS_SUCCESS) {
                        //获取配送员和收货地址之间的距离
                        var distance = res.getPlan(0).getDistance(true),
                            dishtml, n;
                        if (distance.indexOf('公里') > -1) {
                            n = distance.substring(distance.indexOf('公里'), -2)
                            dishtml = "距您" + n + "km"
                        } else {
                            n = distance.substring(distance.indexOf('米'), -1)
                            dishtml = "距您" + n + "m"
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
                            //配送员头像icon
                            // var heaMarker = new BMap.Marker(disLBS, {
                            //     icon: myIcon
                            // });
                            // map.addOverlay(heaMarker);
                        }

                        var opts = {
                          width : 0,     // 信息窗口宽度
                          height: 0,
                          top:0,    // 信息窗口高度
                          offset:{width:-12,height:-45}
                        }
                        var phone = that.servant.phone,
                            name = that.servant.name,
                            headIcon = that.servant.headIcon
                        var sContent = '<div class="servantInfo"><a onclick="fnServant()" class="callImg"><img src="'+headIcon+'"></a><div class="infotxt bdr-r"><p>'+name+'</p><p><a href="tel:'+phone+'" class="call">'+phone+'</a></p></div><div class="distance">'+dishtml+'</div></div>';
                        // var sContent =''+dishtml;
                        var infoWindow = new BMap.InfoWindow(sContent,opts);  // 创建信息窗口对象
                        map.openInfoWindow(infoWindow,disLBS); //开启信息窗口
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
                  $('#enlarge').css({'cursor':'pointer','background':'url(//gfs10.gomein.net.cn/T1KBKvBmdT1RCvBVdK.png) 0 0 no-repeat','background-size':'100%','width':'0.8rem','height':'0.8rem'});

                  // 绑定事件,点击一次放大两级
                  div.onclick = function(e){
                     window.location.reload();
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
      fnServant(){
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
                    epnb:that.servant.id,
                    // 配送单号
                    spgid:that.deliveryId,
                    // 服务类型
                    svty:1,
                    // 订单类型
                    odtp:odtp,
                    dodt:that.hrefParma.dodt
                })
        },

    },
    components: {
      headerComponent
    }
  };
</script>
<style lang="less">
  @import "../../util/fs.less";
  .header{background:#fff; }
  .baidu-map{position: absolute;width: 100%;height: 100%;left: 0;bottom:2.186667rem; }
  .enlarge{position:absolute;width:100%;height:100%;top:0;left:0;}
  .serviceinfo{
    height: 1.866667rem;position: absolute;width: 100%;bottom: 0;left: 0;display: flex;background: #fff;
    padding: 0.16rem;
    .headIcon{padding:0 0.333333rem;
        img{width: 1.6rem;height: 1.6rem;display: inline-block;border-radius: 50%;}
    }
    .info{flex:1;padding: 0 0.333333rem;
        .xing{display: flex;align-items:center;
            .tit{.mixinfont(16px);padding-right: 0.16rem;}
            .discuss-people-starts{
              span{
                float:left;
                width:(32/75)*1rem;
                height:(30/75)*1rem;
                overflow:hidden;
                background:url(//gfs12.gomein.net.cn/T1J_bvBCdv1RCvBVdK.png) 0 0 no-repeat;
                background-size:100% 100%;
                margin-right:(7/75)*1rem;
              }
              .active{
                background-image:url(//gfs11.gomein.net.cn/T1oDVvBmhT1RCvBVdK.png);
              }
            }
        }
        .txt{padding-top: 0.18rem}
        .time{padding-top: 0.12rem;color: #aaa;}
    }
  }
  .servantInfo{
    /*width: 3.973333rem;*/
   /* width: 5.333333rem;
    height: 1rem;*/
    /*padding: 0.16rem;*/
    display: flex;
    border-radius: 0.053333rem;
    justify-content: center;
    align-items:center;
    .callImg{display: block;img{width: 1.2rem;height: 1.2rem;display: block;border-radius: 50%;}}
    .infotxt{padding: 0 0.3rem;.mixinfont(15px); }
    .distance{width: 0.96rem;padding-left: 0.3rem;color: #FF5C5C}
  }
  .anchorBL {
  display: none;
  }
</style>


