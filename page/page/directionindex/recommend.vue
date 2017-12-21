<template>
    <div class="recommend" v-if="templateOn">
        <div class="line bdr-bottom">
            <span ref="span" :style="{'marginLeft':offwidth+'rem','backgroundColor':cmsnew.displayBackColor,'color':cmsnew.displayColor}">{{cmsnew.displayName}}</span>
        </div>
        <div class="recommendlist">
            <ul>
                <li v-for="(k,v) in cmsnew.imgTxtTemplet.imgTxtList" @click="golist(k)">
                    <img :src="k.imageUrl">
                    <div>
                        <span class="brandname">{{k.txtTitle}}</span>
                        <span class="time">{{k.txtContent}}</span>
                        <span class="collec">{{k.volatile2>999999?(k.volatile2/10000).toFixed(2)+'万':k.volatile2}}人收藏</span>
                        <div class="line bdr-bottom"></div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    props: ['cmsnew'],
    data() {
        return {
            offwidth: 0,
            templateOn: true
        };
    },
    created() {
        var _this = this;

        //_this.cmsnl =newval || {};
        // if (this.cmsnew == undefined) {
        //     this.templateOn = false;
        //     return false;
        // }
        //模板有效显示时间
        var time = loop(this.cmsnew);
        var currentTime = new Date().getTime();
        if (time.backImgEndTime != null && time.backImgStartTime != null) {
            (time.backImgStartTime < currentTime && currentTime < time.backImgStartTime) ? this.templateOn = true: this.templateOn = false;
        }

        function loop(lists) {
            var timeobj = {

            };
            for (var item in lists) {
                if (item != undefined) {
                    if (item == 'backImgEndTime' || item == 'backImgStartTime') {
                        timeobj = {
                            backImgEndTime: lists['backImgEndTime'],
                            backImgStartTime: lists['backImgEndTime']
                        };
                        break;
                    }
                    if (typeof lists[item] == 'object') {
                        loop(lists[item])
                    }
                } else {
                    timeobj = {
                        backImgEndTime: null,
                        backImgStartTime: null
                    }
                }

            }
            return timeobj;
        }
        setTimeout(() => {
            _this.offwidth = -_this.$refs.span.offsetWidth / 75;
        })
        //_this.recommendlist = _this.cmsnl.imgTxtTemplet.imgTxtList;
    },
    mounted() {

    },
    methods: {
        golist(item) {
            util.href(item.imageLink)
        }
    },
    watch: {
        'cmsnew': {
            handler(newval) {

            }
        }
    }
};
</script>
<style lang="less" scoped>
@import "../../util/fs.less";
.recommend {
    width: 100%;
    padding: 0.5067rem 0;
    background: #fff;
    font-size: 0.4rem;
    color: #333;
    margin-top: 0.2667rem;
    .line {
        width: 80%;
        height: 0px;
        background: #ddd;
        margin: 0 auto;
        text-align: center;
        position: relative;
        span {
            position: absolute;
            padding: 0 0.17867rem;
            display: inline-block;
            font-size: 0.4rem;
            color: #333;
            top: 50%;
            left: 50%;
            margin-top: -0.28rem;
            background: #fff;
            z-index: 999;
        }
    }
    div.recommendlist {
        width: 100%;
        background: #fff;
        margin-top: 0.5rem;
        ul {
            width: inherit;
            li {
                width: inherit;
                height: 3.493rem;
                margin-bottom: 4px;
                img {
                    width: 3.333rem;
                    height: 3.333rem;
                    margin: 0.08rem;
                    float: left;
                }
                div {
                    float: right;
                    position: relative;
                    height: 3.493rem;
                    .brandname {
                        width: 6rem;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        word-break: break-all;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        margin: 0.346rem 0 0 0.2667rem;
                    }
                    .time {
                        width: 3rem;
                        display: block;
                        margin-top: 0.1867rem;
                        margin-left: 0.2667rem;
                        color: #999;
                        font-size: 0.32rem;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                    .collec {
                        width: 6rem;
                        height: 0.42667rem;
                        line-height: 0.42667rem;
                        position: absolute;
                        bottom: 0.32rem;
                        left: 0.2667rem;
                        background: url(//gfs11.gomein.net.cn/T1Czx_BmCT1RCvBVdK.png) no-repeat left center;
                        text-indent: 0.5rem;
                        background-size: 0.42667rem 0.42667rem;
                        font-size: 0.32rem;
                        color: #999;
                    }
                    div.line{
                        position: absolute;
                        width: 100%;
                        height: 0px;
                        background: #ddd;
                        bottom: 0;
                        right: 0;
                        z-index: 999;
                    }
                }
            }
        }
    }
}
</style>