<template>
    <div class="header" id="header" v-show="isShow">
        <a href="javascript:;" class="goBack" @click="fnHref"><img src="//gfs10.gomein.net.cn/T1oUA_BmZT1RCvBVdK.png"></a>
        {{title}}
        <a class="show-more" v-if="showmore" @click="showMore" href="javascript:;"><img src="//gfs10.gomein.net.cn/T1vNL_B5JT1RCvBVdK.png"></a>
    </div>
</template>
<script type="ecma6.0">
    export default {
        props:["title","direction","showmore"],
        data(){
            return {
                isShow: true
            }
        },
        mounted(){
        },
        methods:{
            showMore:function () {
                 this.$emit("watchdirection");
            },
            fnHref: function () {
                let that = this,
                    i = util.getHrefParma(),
                    ct = new Date().getTime();
                if(this.direction){
                    this.$emit("watchdirection")
                    return false;
                }
                // 点击返回按钮判断跳转的问题
                if (1 == i.type) {
                    if (that.h) {
                        util.href(that.h,{type:1,ct:ct});
                    }else{
                        util.href("./index.html");
                    };
                }else{
                    util.href("javascript:window.history.back(-1)");
                };
            }
        }
    }
</script>
<style lang='less'>
    @import '../../../util/fs.less';
    .header {
        width: 100%;
        color: #333;
        .mixinfont(18px);
        text-align: center;
        height: 1.173333rem;
        line-height: 1.173333rem;
        background-color: #fff;
        overflow:hidden;
    }
    .header .goBack {
        height: 100%;
        .px2rem(margin-left,44);
        position: relative;
        float: left;
        .px2rem(width,44);
        img{
            width:100%;
            .px2rem(margin-top,22);
        }
    }
    .show-more{
        float: right;
        .px2rem(width,44);
        .px2rem(width,44);
        .px2rem(padding,22);
        img{
            display: block;
            width:100%;
            height:100%;
        }
    }
</style>