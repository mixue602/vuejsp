<template>
    <div class="header" id="header" v-show="isShow">
        <a class="goBack" @click="fnHref"><i></i></a>
        <span class="title">{{ title }}</span>
    </div>
</template>

<script type="ecma6.0">
    export default {
        props: ['title', 'h', 'rightmenus','direction'],
        data(){
            return {
                name: '国美管家',
                isShow: true
            }
        },
        mounted(){
            //app隐藏标题栏
            if (util.isApp()) {
                this.isShow = false;
                $(".container").css("top", 0)
            }
        },
        methods:{
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
            },
            toPage: function() {
                this.$emit("watchlist")
            }
        }
    }
</script>
<style lang='less'>
    @import '../../util/fs.less';
    .header {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        color: #333;
        .mixinfont(18px);
        text-align: center;
        height: 1.173333rem;
        line-height: 1.173333rem;
        border-bottom: 1px solid #ddd; 
        background-color: #fff;
        z-index: 1000;
    }
    .header .goBack {
        height: 100%;
        position: absolute;
        top: 0;
        left: 0.48rem;
    }
    .header .title {
        max-width: 70%;
        margin: 0 auto;
        display: block;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .header .goBack i{
        position: absolute;
        top: 50%;
        margin-top: -0.213333rem; 
        border: 1px solid #666;
        border-right-color: transparent;
        border-top-color: transparent;
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
        width: 0.373333rem;
        height: 0.373333rem;
    }
 
</style>