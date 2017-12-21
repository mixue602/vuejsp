<template>
    <div class="read" v-if="templateOn">
        <div class="line bdr-bottom">
            <span ref="span" :style="{'marginLeft':offwidth+'rem','bakcgroundColor':cmsread.displayBackColor,'color':cmsread.displayColor}">分类阅读</span>
        </div>
        <div class="readlis">
            <ul>
                <li v-for="(k,v) in cmsread.imgTxtTemplet.imgTxtList" :class="{'left':v%2==0}" @click="golist(k)">
                    <div class="top">
                        <img :src="k.imageUrl">
                        <span class="cname">{{k.txtTitle}}</span>
                    </div>
                    <div class="center">
                        <span v-for="(m,n) in k.txtContent.split('|')">{{n+1+'.'+m}}</span>
                    </div>
                    <div class="bottom">
                        {{k.volatile3>999999?(k.volatile3/10000).toFixed(2)+'万':k.volatile3}}收藏
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    props: ['cmsread'],
    data() {
        return {
            offwidth: 0,
            brandlist: [],
            templateOn: true
        };
    },
    created() {
        var _this = this;
        // _this.cmsrl = newval || {};
        // if (this.cmsread == undefined) {
        //     this.templateOn = false;
        //     return false;
        // }
        //模板有效显示时间
        var time = loop(this.cmsread);
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
        //_this.readlist = _this.cmsrl.imgTxtTemplet.imgTxtList;
    },
    mounted() {

    },
    methods: {
        golist(item) {
            //console.log(item.imageLink)
            util.href(item.imageLink)
        }
    },
    watch: {
        'cmsread': {
            handler(newval) {

            }
        }
    }
};
</script>
<style lang="less" scoped>
@import "../../util/fs.less";
.read {
    width: 100%;
    padding: 0.6667rem 0;
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
            z-index: 99999;
        }
    }
    .readlis:after {
        content: ".";
        clear: both;
        display: block;
        height: 0;
        overflow: hidden;
        visibility: hidden;
    }
    .readlis {
        width: 100%;
        margin-top: 0.5rem;
        ul {
            float: left;
            li {
                float: right;
                width: 4.53333rem;
                margin-right: 0.4rem;
                margin-bottom: 0.26667rem;
                box-shadow: 0 0.0667rem 0.2rem 0 rgba(224, 226, 230, 0.68);
                border-radius: 1.5px;
                padding-bottom: 0.453rem;
                div.top {
                    width: inherit;
                    height: 1.413333rem;
                    line-height: 1.413333rem;
                    text-indent: 0.4rem;
                    position: relative;
                    background: #fafafc;
                    img {
                        width: 1.4667rem;
                        height: 1.146rem;
                        position: absolute;
                        top: 0.16rem;
                        right: 0.7467rem;
                    }
                }
                div.center {
                    width: inherit;
                    margin-top: 0.26667rem;
                    span {
                        width: 3.44rem;
                        display: inline-block;
                        margin-bottom: 0.4rem;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        font-size: 0.32rem;
                        text-indent: 0.4rem;
                    }
                }
                div.bottom {
                    margin-top: 0.37333rem;
                    color: #999;
                    font-size: 0.32rem;
                    text-indent: 0.4rem;
                }
            }
            li.left {
                float: left;
                margin-left: 0.4rem;
                margin-right: 0;
            }
        }
    }
}
</style>