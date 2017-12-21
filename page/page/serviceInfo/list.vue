<template>
    <div v-if="templateShow" :style="{'backgroundColor':cmsread.displayBackColor,'color':cmsread.displayColor}">
        <div class="serviceInfo-title">
            <span>
              <dfn>{{cmsread.displayName}}</dfn>
              <i>&nbsp;</i>
              <i>&nbsp;</i>
            </span>
        </div>
        <ul class="serviceList">
            <li v-for="(k,v) in cmsread.imgTxtTemplet.imgTxtList" @click="goGoodsUrl(k)"  class="clearfix">
                <a href="javascript:;">
                    <div class="serviceList-imgbox">
                        <img :src="k.imageUrl" />
                    </div>
                    <div class="serviceList-info">
                        <div>{{k.txtContent}}</div>
                        <div>{{k.volatile3}}</div>
                    </div>
                </a>
                <div class="bdr-bottom line" v-show="v!==0"></div>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: ['cmsread'],
    data() {
        return {
            templateShow: true
        }
    },
    created() {
        var list = this.cmsread.imgTxtTemplet.imgTxtList;
        if(list.length > 3){
            this.cmsread.imgTxtTemplet.imgTxtList=list.splice(0,3);
        }

    },
    methods:{
        goGoodsUrl(item) {
            util.href(item.imageLink)
        }
    }
}
</script>
<style lang="less">
@import '../../util/fs.less';
html,
body {
    background: #fff!important;
}

.serviceInfo {
    

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
                height: 0.5px;
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

    .serviceList {
        li {
            a {
                display: block;
            }
            .serviceList-imgbox {
                float: left;
                width: (196/75)*1rem;
                height: (196/75)*1rem;
                overflow: hidden;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .serviceList-info {
                float: left;
                margin: (1/75)*1rem 0 0 (20/75)*1rem;
                width: (463/75)*1rem;
                font-family: PingFangSC-Regular;
                .mixinfont(19px);
                color: #333;
                line-height: (56/75)*1rem;
                div:nth-child(1) {
                    height: (112/75)*1rem;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                }
                div:nth-child(2) {
                    padding: (50/75)*1rem 0 (30/75)*1rem 0;
                    .mixinfont(12px);
                    color: #999;
                    line-height: (34/75)*1rem;
                }
            }
            div.line{
                width: 94%;
                height: 0;
                margin: 0 auto;
                z-index: 1;
            }
        }
    }
}
</style>