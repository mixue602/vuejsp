<template>
    <div class="hot" v-if="templateOn">
        <div class="line bdr-bottom">
            <span ref="span" :style="{'marginLeft':offwidth+'rem'}">{{cmshot.displayName}}</span>
        </div>
        <div class="hotgoods">
            <ul>
                <li v-for="(k,v) in cmshot.imgTxtTemplet.imgTxtList" @click="selectHot(k)">
                    <img :src="k.imageUrl">
                    <p class="des">{{k.txtTitle}}</p>
                    <span class="collec">{{k.volatile3>999999?(k.volatile3/10000).toFixed(2)+'万':k.volatile3}}人收藏</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    props: ['cmshot'],
    data() {
        return {
            offwidth: 0,
            brandlist: [],
            templateOn: true
        };
    },
    created() {
        // this.cmshl = this.cmshot;
        // this.hotlist = this.cmshot.imgTxtTemplet.imgTxtList;
        var _this = this;
        //模板有效显示时间
        var time = loop(this.cmshot);
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
    },
    mounted() {
        var _this = this;
        setTimeout(() => {
            _this.offwidth = -_this.$refs.span.offsetWidth / 75;
        })

    },
    methods: {
        selectHot(item) {
            util.href(item.imageLink)
        }
    },
    watch: {
        'cmshot': {
            handler(newval) {

            }
        }
    }
};
</script>
<style lang="less" scoped>
@import "../../util/fs.less";
.hot {
    width: 100%;
    background: #fff;
    font-size: 0.32rem;
    padding: 0.5067rem 0 0.5067rem 0;
    .line {
        width: 80%;
        height: 0;
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
    .hotgoods:after {
        content: ".";
        clear: both;
        display: block;
        height: 0;
        overflow: hidden;
        visibility: hidden;
    }
    .hotgoods {
        width: 100%;
        ul {
            float: left;
            margin-top: 0.5333rem;
            li {
                float: left;
                width: 2.4rem;
                margin-left: 0.7467rem;
                img {
                    width: 2.1333rem;
                    height: 2.1333rem;
                }
                p.des {
                    width: inherit;
                    height: 0.9rem;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    word-break: break-all;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    margin-top: 5px;
                }
                span.collec {
                    width: inherit;
                    display: inline-block;
                    height: 0.32rem;
                    color: #999;
                    margin-top: 0.26667rem;
                }
            }
        }
    }
}
</style>