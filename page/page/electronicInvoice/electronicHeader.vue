<template>
    <div class="header bdr-bottom">
        <a class="goBack" @click="fnHref"><i></i></a>
        <span class="title">{{ title }}</span>
        <!-- <span class="btn" @click="showtip" v-show='isband'>筛选</span> -->
    </div>
</template>

<script type='text/ecmascript-6'>
    export default {
        props: {
            title:{
                type:String
            },
            h:{
                type:String
            },
            isband:{
                type:Boolean
            }
        },
        data(){
            return {
                name: 'hello'
            }
        },
        methods:{
            fnHref: function () {
                let that = this,
                    i = util.getHrefParma();

                // 点击返回按钮判断跳转的问题
                // if (i.epage) {
                //     util.href("myorder.html");
                // }else{
                //     util.href("javascript:window.history.back(-1)");
                // };
                util.href("me.html");
            },
            showtip: function(){
                this.$emit("showtip",true)
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
        height: 1.12rem;
        line-height: 1.12rem;
        /* border-bottom: 1px solid #e3e3e3; */
        background-color: #f8f8f8;
        z-index: 1000;
        /*border-bottom: 0.0133333333rem solid #cccccc;*/
    }
    .header .goBack {
        width: 1.066667rem;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
    .btn{
        color: #777;
        font-size: .16rem;
        text-align: right;
        width: 1.066667rem;
        height:100%;
        font-size: .4rem;
        padding-right: .3rem;
        position: absolute;
        top: 0;
        right: 0;
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
        top: 0.306667rem;
        left: 0.32rem;
        width: 0.333333rem;
        height: 0.573333rem;
        background:url(//gfs6.gomein.net.cn/T1hTDTBKWQ1RCvBVdK) no-repeat;
        background-size: 0.333333rem 0.573333rem;
    }
</style>