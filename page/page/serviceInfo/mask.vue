<template>
    <div class="service-mask" v-show="goodshow" @click="hideGoods">
        <div class="service-maskList" @click.stop="return false">
            <a href="javascript:;" class="service-maskClose" @click.stop="hideGoods"></a>
            <div class="service-maskTitle">文中商品</div>
            <div class="service-maskContent">
                <ul class="clearfix" :style="{'width':ulwidth}">
                    <li v-for="(k,v) in cmsread.imgTxtTemplet.imgTxtList">
                        <a :href="k.imageLink">
                            <div>
                                <img :src="k.imageUrl" alt="" />
                            </div>
                            <div class="service-ltitle">{{k.txtTitle}}</div>
                            <div class="service-linfo">{{k.txtContent}}</div>
                            <div class="service-lprice">￥{{k.volatile1}}</div>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:['cmsread','goodshow'],
    data() {
        return {
            ulwidth:''
        }
    },
    created() {
        var length = this.cmsread.imgTxtTemplet.imgTxtList.length;
        this.ulwidth = (200*length)/75 + 'rem';
    },
    methods: {
        hideGoods: function() {
            this.$emit('click-hide');
        }
    }
}
</script>
<style lang="less">
@import '../../util/fs.less';
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
</style>