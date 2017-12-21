<template>
    <ul class="serveFlow clearfix">
        <li class="float_l">1.提交订单</li>
        <li class="float_l">2.确定时间</li>
        <li class="float_l">3.工程师上门</li>
        <li class="float_l">4.服务完成</li>
        <li class="float_l">5.评价付款</li>
    </ul>
</template>

<script>
export default {
    data () {
        return {
        }
    },
    methods:{

    }
}
</script>

<style lang="less">
    @import '../../util/fs.less';
    .w48{
        width: 0.64rem;
    }
    .w54{
        width: 0.72rem;
    }
    .w55{
        width: 0.733333rem;
    }
    .w44{
        width: 0.586667rem;
    }
    .w51{
        width: 0.68rem;
    }
    .serveFlow{
        background: #fff;
        display:flex;
        padding-bottom: 0.4rem;
        li{
            flex:1;
            padding-top: 1.653333rem;
            text-align: center;
            color: #333;
            .mixinfont(10px);
        }
        li:nth-child(1){
            background:url(img/serveFlow.png) no-repeat center 0.573333rem;
            background-size:0.64rem;
        }
        li:nth-child(2){
            background:url(img/serveFlow2.png) no-repeat center 0.613333rem;
            background-size:0.72rem;
        }
        li:nth-child(3){
            background:url(img/serveFlow3.png) no-repeat center 0.573333rem;
            background-size:0.733333rem;
        }
        li:nth-child(4){
            background:url(img/serveFlow4.png) no-repeat center 0.586667rem;
            background-size: 0.586667rem;
        }
        li:nth-child(5){
            background:url(img/serveFlow5.png) no-repeat center 0.586667rem;
            background-size:0.68rem;
        }
    }
</style>