<template>
    <div class="nearbyStores">
        <header-component :title='title'></header-component>
        <div class="container" :class="containerBg">
            <div class="curlocation-box">
                <div class="curCity">当前城市：{{locationCityname}}{{locationArname}}</div>
                <div class="curIcon"  @click="citySelect">{{locationArname}}</div>
            </div>
            <ul class="stores-list" v-show="!isNoList">
                <template  v-for="(item, index) in list">
                    <li class="store-li" :key="index">
                        
                        <img v-if="item.brand==='guomeidianqi'" class="store-logo" src="//gfs13.gomein.net.cn/T1i4bjBX_T1RCvBVdK.png">
                        <img v-else-if="item.brand==='dazhongdianqi'" class="store-logo" src="//gfs12.gomein.net.cn/T1.jKgBXbT1RCvBVdK.png">
                        <img v-else-if="item.brand==='yongledianqi'" class="store-logo" src="//gfs12.gomein.net.cn/T1_nDjBX_T1RCvBVdK.png">
                        <img v-else class="store-logo" src="//gfs13.gomein.net.cn/T1clLvByWT1RCvBVdK.png">

                        <div class="store-desc">  
                            <div class="store-namebox">
                                <p class="store-name">{{item.name}}</p>
                                <!-- <p class="store-distance">
                                    <span class="icon"></span>3.15km
                                </p> -->
                            </div>
                            <a :href="'tel:'+item.storeZonePhone" class="store-phonenumber">{{item.storeZonePhone}}</a>
                            <p class="store-address">{{item.address}}</p>
                        </div>
                    </li>
                </template>
            </ul>
            <div class="tuwen" v-show="isNoList">
                <div class="tu">
                    <i class="i i-order"></i>
                </div>
                <p class="wen">暂无门店信息哦~</p>
            </div>
        </div> 
    </div>
</template>

<script type="ecma6.0">
import headerComponent from '../../components/HeaderComponent';
import loadMore from '../../components/loadmore';

let root = window || {},
    util = root.util || {};
   
export default {
    data () {
        return {
            title:'附近门店',
            isNoList:false,
            locationCityname:'北京市',
            locationArname:'东城',
            arCode:'110101', //默认北京
            locationCode:'11011400',//在线地区code
            containerBg:'containerBgGrey',
            list:[]
        }
    },
    methods:{
        /**
         * 获取门店信息
         */
        getStoreMessages(){
            let that = this;
            util.api({
                surl: root.CE_API_PATH + 'nearbystote',
                data: {
                    areaCode: that.locationCode,
                    nearbyType: 3 //区域查找
                },
                type: 'get',
                beforeSend: function() {
                    //加载提示
                    //util.comShow({txt: '正在努力加载中…', icl: 'i-load ro360'});
                    //util.tip('正在努力加载中…',{iconClass:'i-load ro360'});
                },
                success: function(response) {
                    let rpco = response.rpco,
                        body = response.body || [];
                    //处理
                    switch(rpco) {
                        case 200:
                            that.list = [...body];
                            // that.list = [];
                        break;
                        //没有找到对应数据
                        case 401:
                            util.tip('您当前网络异常，请稍后重试');
                            break;
                        default:
                            util.tip('您当前网络异常，请稍后重试');
                    }
                },
                complete: function() {
                    //移除提示
                    util.remComShow();
                }
            }); 
            
        },
        /**
         * 获取在线地区code码
         */
        getLocationCode(arCode,callback){
            let that = this;
            util.api({
                surl: root.Area_API_PATH + 'convertArcode',
                data: {
                    arcode: arCode
                },
                type: 'get',
                beforeSend: function() {
                    //加载提示
                    //util.comShow({txt: '正在努力加载中…', icl: 'i-load ro360'});
                    //util.tip('正在努力加载中…',{iconClass:'i-load ro360'});
                },
                success: function(response) {
                    let rpco = response.rpco,
                        body = response.body ||{};
                    //处理
                    switch(rpco) {
                        case 200:
                            that.locationCode = body.divisionCode;
                            callback&&callback();
                        break;
                        //没有找到对应数据
                        case 401:
                            util.tip('您当前网络异常，请稍后重试');
                            break;
                        default:
                            util.tip('您当前网络异常，请稍后重试');
                    }
                },
                complete: function() {
                    //移除提示
                    util.remComShow();
                }
            }); 
            
        },
        /*选择城市*/
        citySelect: function() {
            citySelect(function(result) {
                let that = this;
                that.arCode = result.arcode || 110101;//地区码
                that.locationCityname = result.cityname || '北京市';//城市名称
                that.locationArname =  result.arname || '东城';//城市名称
                //更新code 和对应的门店信息
                that.getLocationCode(that.arCode,that.getStoreMessages);
            });
        }
    },
    watch: {
        list(){
            let that =this;
            //不存在数据交互处理
            if(that.list.length === 0){
                that.isNoList = true;
                that.containerBg = 'containerBgWrite';
            }else{
                that.isNoList = false;
                that.containerBg = 'containerBgGrey';
            }
        }
    },
    created(){
        let that = this,
        ls = window.localStorage,
        location = JSON.parse(ls.getItem('location'));
        //初始化的时候判断有没有缓存
        if(location){
            that.arCode = location.arcode || 110101;//地区码
            that.locationCityname = location.cityname || '北京市';//城市名称
            that.locationArname =  location.arname || '东城';//城市名称
            //更新code 和对应的门店信息
            that.getLocationCode(that.arCode,that.getStoreMessages);
        }else{ //没缓存的时候走自动定位
            setTimeout(function() {
                getGps(function(result) {
                    that.arCode = result.arcode || 110101;//地区码
                    that.locationCityname = result.cityname || '北京市';//城市名称
                    that.locationArname =  result.arname || '东城';//城市名称
                    //更新code 和对应的门店信息
                    that.getLocationCode(that.arCode,that.getStoreMessages);
                });
            }, 200)
        }

        //监听hash变化，gps定位后回到当前页面
        $(window).on('hashchange', function(e) {
            if (e.newURL + "#hide" == e.oldURL) {
               
                let ls = window.localStorage,
                    location = JSON.parse(ls.getItem('location'));

                if(location){
                    that.arCode = location.arcode || 110101;//地区码
                    that.locationCityname = location.cityname || '北京市';//城市名称
                    that.locationArname =  location.arname || '东城';//城市名称
                    //更新code 和对应的门店信息
                    that.getLocationCode(that.arCode,that.getStoreMessages);
                }
            }
        });
        if(util.isApp()){
		    util.deleteHeadBtn();
        }
        
    },
    components: {
        headerComponent
    }
}

</script>
<style lang="less">
    @import '../../util/fs.less';
    body,html{
        font-family: 'PingFangSC-Regular',sans-serif;
        background: #f5f5f5;
    }

    /* 公共内容区 */
    .container {
        width: 10rem;
        min-width: 320px;
        overflow-x: hidden;
        overflow-y: auto;
        position: absolute;
        top: 1.173333rem;
        bottom: 0;
        -webkit-overflow-scrolling: touch;
        z-index:999;
    }
    .containerBgGrey{
        background-color: #f5f5f5;
    }
    .containerBgWrite{
        background-color: #fff;
    }

    .curlocation-box{
        padding: 0 .4rem /* 30/75 */;
        height:.826667rem /* 62/75 */;
        line-height: .826667rem /* 62/75 */;
        font-family: PingFangSC-Regular;
        .mixinfont(12px);
        color: #333333;
        background: #fff; 
        position: relative;
        &:after{
            height:1px;
            content: '';
            width: 100%;
            border-top: 1px solid #ddd;
            position: absolute;
            bottom: -1px;
            right: 0;
            z-index: 10;
        }
        .curCity{
            color: #333;
            display: inline-block;
        }
        .curIcon{
            position: relative;
            float:right;
            display: inline-block;
            padding-left: .08rem /* 6/75 */;
            color: #999;
            
            &:before{
                content: '';
                height: .293333rem /* 22/75 */;
                width: .293333rem /* 22/75 */;
                position: absolute;
                top: 50%;
                left: -1*.293333rem /* 22/75 */;
                margin-top:-1*.146667rem;
                z-index: 10;
                background-image: url('//gfs12.gomein.net.cn/T10uWgBXdT1RCvBVdK.png');
                background-size:100% 100%;
            }
        }
    }

    .stores-list{
        background: #fff; 
        .store-li{
            overflow: hidden;
            padding:.4rem /* 30/75 */;
            position: relative;
            display: flex;
            &:after{
                height:1px;
                content: '';
                width: 100%;
                border-top: 1px solid #f3f3f3;
                position: absolute;
                bottom: -1px;
                right: 0;
                z-index: 10;
            }

            .store-logo{
                width: 2rem /* 150/75 */;
                height:2rem /* 150/75 */;
                margin-right: .32rem /* 24/75 */;
                
            }
            .store-desc{
                font-family: PingFangSC-Regular;
                .store-namebox{
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    padding-top:.08rem /* 6/75 */;

                    .store-name{
                        width: 6.88rem /* 516/75 */ ;
                        height: .64rem /* 48/75 */;
                        float: left;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        line-height: .64rem /* 48/75 */;
                        .mixinfont(18px);
                        color: #333333;  
                    }
                    // .store-distance{
                    //     float: right;
                    //     position: relative;
                    //     padding-left: .32rem /* 24/75 */;
                    //     line-height: .64rem /* 48/75 */;
                    //     .icon{
                    //         position: absolute;
                    //         top:50%;
                    //         left: 0;
                    //         margin-top:-1*.146667rem;
                    //         height: .293333rem /* 22/75 */;
                    //         width: .24rem /* 18/75 */;
                    //         overflow: hidden;
                    //         background-image: url('//gfs12.gomein.net.cn/T10uWgBXdT1RCvBVdK.png');
                    //         background-size:100% 100%;  
                    //     }
                    // }
                }

                .store-phonenumber{
                    .mixinfont(12px);
                    color: #999999;
                    line-height: .453333rem /* 34/75 */;
                    padding-top: .266667rem /* 20/75 */;
                    display: inline-block;
                }
                .store-address{
                    width:6.88rem /* 516/75 */;
                    height: .453333rem /* 34/75 */;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    padding-top: .053333rem /* 4/75 */;
                    .mixinfont(12px);
                    color: #999999;
                    line-height: .453333rem /* 34/75 */;
                }
            }
        }  
    }

    .tuwen {
        .mixinfont(16px);
        line-height: .426667rem /* 32/75 */;
        width: 100%;
        background: #fff;
    }
    .tuwen .tu {
        width: 100rem;
        display: table-cell;
        padding-top: 1.866667rem /* 140/75 */;
        padding-bottom:.773333rem /* 58/75 */;
        vertical-align: middle;
        text-align: center;
    }
    .i {
        font-style: normal;
        position: absolute;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        border-radius: 2px;
    }
    .tuwen .tu .i {
        display: inline-block;
        position: static;
    }
    .tuwen .wen {
        line-height: .666667rem /* 50/75 */;
        text-align: center;
    }
    .i-order {
        width: 6.4rem /* 480/75 */;
        height: 5.813333rem /* 436/75 */;
        background-image: url(//gfs11.gomein.net.cn/T13nJbBXWT1RCvBVdK.png);
    }
    /*loading 加载*/
    // .loading{
    //     width: 100%;
    //     text-align: center;
    //     .mixinfont(12px);
    //     line-height:1.066667rem /* 80/75 */;
    // }

    

</style>