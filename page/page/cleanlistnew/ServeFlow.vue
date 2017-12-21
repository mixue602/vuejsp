<template>
    <ul class="serveFlow clearfix">
        <li class="float_l">1.选择服务</li>
        <li class="float_l">2.提交订单</li>
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
        display:-webkit-flex;
        padding-bottom: 0.4rem;
        li{
            width: 20%;
            padding-top: 1.653333rem;
            text-align: center;
            color: #333;
            .mixinfont(10px);
        }
        li:nth-child(1){
            background:url("//gfs10.gomein.net.cn/T128Y_B4VT1RCvBVdK.png") no-repeat .71rem .64rem;
            background-size:45%;
        }
        li:nth-child(2){
            background:url("//gfs13.gomein.net.cn/T1HHZsB4bT1RCvBVdK.png") no-repeat .66rem .64rem;
            background-size:45%;
        }
        li:nth-child(3){
            background:url("//gfs11.gomein.net.cn/T1FyAsB5AT1RCvBVdK.png") no-repeat .64rem .64rem;
            background-size:45%;
        }
        li:nth-child(4){
            background:url("//gfs12.gomein.net.cn/T12yAbB5VT1RCvBVdK.png") no-repeat .65rem .64rem;
            background-size:45%;
        }
        li:nth-child(5){
            background:url("//gfs11.gomein.net.cn/T1SuC_B5AT1RCvBVdK.png") no-repeat center .64rem;
            background-size:45%;
        }
    }
</style>