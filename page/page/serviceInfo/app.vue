<template>
    <div class="serviceInfo wapper">
        <div class="header">
            <i @click="goback"></i>
            <img class="close" @click="goindex" src="//gfs10.gomein.net.cn/T1vNL_B5JT1RCvBVdK.png" />
            服务咨询
            <span @click="gogoodslist">更多</span>
        </div>
        <div class="service-info-top">
            <div>{{art.title}}</div>
            <div class="service-info-time">{{art.update_time}}</div>
            <div class="service-info-img">
                <img :src="art.img_url" alt="" />
            </div>
            <div v-html="art.content"></div>
        </div>
        <list v-for="(k,v) in cmsdata.templetList" :cmsread="k" v-if="k.imgTxtTemplet.displayType=='list'"></list>
        <goods v-for="(k,v) in cmsdata.templetList" @click-hide="hideMask" :goodshow="showGoods" :cmsread="k" v-if="k.imgTxtTemplet.displayType=='carousel'"></goods>
        <a href="javascript:;" class="service-info-goods"  v-for="(k,v) in cmsdata.templetList" v-if="k.imgTxtTemplet.displayType=='carousel'" @click="showMask">文中商品</a>
    </div>
</template>
<script>
var root = window.root || {},
    util = root.util || {};


import list from './list.vue'
import goods from './mask.vue'

export default {
    data() {
        return {
            showGoods: false,
            cmsdata: {},
            artid: '1', //文章ID
            art: {

            }
        }
    },
    created() {
        if(util.isApp()){
            $('.header').hide();
        };
        var _this = this;
        util.api({ //cms接口
            surl: 'http://prom.mobile.atguat.com.cn/wap/promotion/promscms/' + util.getHrefParma().key + '.jsp',
            type: 'get',
            dataType: 'jsonp',
            success: function(res) {
                var res = JSON.parse(res);
                console.log(res)
                if (res.isSuccess == 'Y') {
                    _this.cmsdata = res;
                    _this.artid = res.pageInfo.documentId;
                    gcc();
                }
            }
        })

        function gcc() {
            util.api({ //gcc文章接口
                surl: "http://ss.atguat.com.cn/item/v1/channel/setsail/getstreetArticleById/" + _this.artid + "/flag/channel/test",
                type: "get",
                dataType: "jsonp",
                jsonpCallback: "test",
                success: function(res) {
                    _this.art = res.article;
                    _this.art.update_time = util.formateDate(_this.art.update_time,'yyyy-MM-dd')
                }
            })
        }
    },
    methods: {
        showMask: function() {
            this.showGoods = true;
        },
        hideMask() {
            this.showGoods = false;
        },
        gogoodslist() {
            util.href('./serviceList.html')
        },
        goback() {
            window.history.go(-1)
        },
        goindex() {
            util.href('./index.html')
        }
    },
    components: {
        list,
        goods
    }
}
</script>
<style lang="less">
@import '../../util/fs.less';
.header {
    width: 100%;
    height: 1.173333rem;
    position: fixed;
    top: 0;
    left: 0;
    text-align: center;
    line-height: 1.173333rem;
    color: #333;
    font-size: 18px;
    background: #fff;
    border-bottom: 1px solid #ddd;
}

.header i {
    position: absolute;
    top: 50%;
    margin-top: -0.3rem;
    background: url(//gfs13.gomein.net.cn/T1w8Z_B4JT1RCvBVdK.png) center center;
    width: 0.58667rem;
    height: 0.58667rem;
    left: 0.48rem;
    background-size:0.58667rem 0.58667rem;
}
.header .close{
    width: 0.58667rem;
    height: 0.58667rem;
    position: absolute;
    top: 50%;
    margin-top:-(0.58667/2)*1rem;
    left: 1.2rem; 
}
.header span{
    position: absolute;
    right: 0.5rem;
}
.service-info-goods {
    .mixinfont(15px);
    color: #fff;
    position: fixed;
    right: 0;
    top: 50%;
    margin-top: -(30/75)*1rem;
    width: (136/75)*1rem;
    height: (60/75)*1rem;
    line-height: (60/75)*1rem;
    padding-left: (26/75)*1rem;
    border-radius: (30/75)*1rem 0 0 (30/75)*1rem;
    background-image: -webkit-linear-gradient(-90deg, #F54B4B 0%, #FE7D7D 77%);
    z-index: 10;
}




/* 文章标题 */

.service-info-top {
    padding: (32/75)*1rem (30/75)*1rem 0.37333rem 0;
    font-family: 'PingFangSC-Regular', sans-serif;
    .mixinfont(23px);
    line-height: (60/75)*1rem;
    color: #333;
    text-align: center;
    .service-info-time {
        .mixinfont(12px);
        line-height: (56/75)*1rem;
        color: #999;
    }
    .service-info-img {
        padding: 0.13333rem 0;
        img {
            display: block;
            width: 100%;
        }
    }
}




/* 文中商品 */

.service-mask {
    position: fixed;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: rgba(0, 0, 0, .4);
    top: 0;
    left: 0;
    z-index: 14;
    font-family: 'PingFangSC-Regular', sans-serif;
    .service-maskList {
        position: absolute;
        height: (446/75)*1rem;
        width: 100%;
        left: 0;
        bottom: 0;
        background: #fff;
        .service-maskClose {
            position: absolute;
            width: (30/75)*1rem;
            height: (30/75)*1rem;
            overflow: hidden;
            right: (20/75)*1rem;
            top: (20/75)*1rem;
            background: url(//gfs13.gomein.net.cn/T1SDDvB5Kg1RCvBVdK.png) 0 0 no-repeat;
            background-size: (30/75)*1rem (30/75)*1rem;
        }
        .service-maskTitle {
            .mixinfont(16px);
            color: #333;
            text-align: center;
            line-height: (94/75)*1rem;
        }
        .service-maskContent {
            width: 100%;
            height: (350/75)*1rem;
            overflow-x: auto;
            overflow-y: hidden;
            ul {
                padding-left: (30/75)*1rem;
                width: (800/75)*1rem;
                height: (330/75)*1rem;
                overflow: hidden;
                li {
                    float: left;
                    width: (170/75)*1rem;
                    margin-right: (30/75)*1rem;
                    .mixinfont(13px);
                    color: #999;
                    line-height: (28/75)*1rem;
                    img {
                        width: (160/75)*1rem;
                        height: (160/75)*1rem;
                        overflow: hidden;
                    }
                    .service-ltitle {
                        font-family: PingFangSC-Regular;
                        line-height: (40/75)*1rem;
                        padding-top: (12/75)*1rem;
                        color: #000;
                        height: (40/75)*1rem;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                    .service-linfo {
                        height: (56/75)*1rem;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                        .mixinfont(12px);
                        color: #999;
                    }
                    .service-lprice {
                        line-height: (60/75)*1rem;
                        color: #FF4B41;
                    }
                }
            }
        }
    }
}




/* 文章列表 */

html,
body {
    background: #fff!important;
}

.serviceInfo {
    //padding: 0 (26/75)*1rem 0 (28/75)*1rem;
    font-family: 'PingFangSC-Regular', sans-serif;

    .serviceInfo-title {
        .mixinfont(15px);
        color: #333;
        line-height: (44/75px)*1rem;
        height: (44/75px)*1rem;
        overflow: hidden;
        text-align: center;
        position: relative;

        span {

            position: absolute;
            padding: 0 (190/75)*1rem;
            min-width: (122/75)*1rem;
            max-width: (222/75)*1rem;
            white-space: nowrap;
            left: 50%;
            top: 0;
            overflow: hidden;
            -webkit-transform: translateX(-50%);
            dfn {
                display: block;
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
            i {
                position: absolute;
                font-size: 0;
                height: 2px;
                width: (168/75)*1rem;
                background: #efefef;
                overflow: hidden;
                left: 0;
                top: (22/75)*1rem;
            }
            i:nth-child(2) {
                right: 0;
                left: auto;
            }
        }
    }
}
</style>