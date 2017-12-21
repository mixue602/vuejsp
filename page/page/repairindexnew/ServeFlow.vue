<template>
    <ul class="serveFlow clearfix">
        <li class="float_l active">1.选择品类</li>
        <li class="float_l">2.选择品牌</li>
        <li class="float_l">3.选择故障</li>
        <li class="float_l">4.提交订单</li>
        <li class="float_l">5.服务付款</li>
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
       /* li:nth-child(1){
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
        }*/

        li:nth-child(1){
            background:url(//gfs10.gomein.net.cn/T12mJQBTVT1RCvBVdK.png) no-repeat center 0.573333rem;
            background-size:0.64rem;
        }
        li:nth-child(2){
            background:url(//gfs12.gomein.net.cn/T1GHKgBT_T1RCvBVdK.png) no-repeat center 0.613333rem;
            background-size:0.72rem;
        }
        li:nth-child(3){
            background:url(//gfs12.gomein.net.cn/T1HMA_BTDT1RCvBVdK.png) no-repeat center 0.573333rem;
            background-size:0.733333rem;
        }
        li:nth-child(4){
            background:url(//gfs11.gomein.net.cn/T17DZjBgET1RCvBVdK.png) no-repeat center 0.586667rem;
            background-size: 0.586667rem;
        }
        li:nth-child(5){
            background:url(//gfs11.gomein.net.cn/T11sJvBTDT1RCvBVdK.png) no-repeat center 0.586667rem;
            background-size:0.68rem;
        }

        li:nth-child(1).active{
            background:url(//gfs10.gomein.net.cn/T1BQYbBmET1RCvBVdK.png) no-repeat center 0.573333rem;
            background-size:0.64rem;
        }
        li:nth-child(2).active{
            background:url(//gfs11.gomein.net.cn/T1UCd_BmJT1RCvBVdK.png) no-repeat center 0.613333rem;
            background-size:0.72rem;
        }
        li:nth-child(3).active{
            background:url(//gfs12.gomein.net.cn/T1SzJsBmET1RCvBVdK.png) no-repeat center 0.573333rem;
            background-size:0.733333rem;
        }
        li:nth-child(4).active{
            background:url(//gfs13.gomein.net.cn/T1bVAjBmhT1RCvBVdK.png) no-repeat center 0.586667rem;
            background-size: 0.586667rem;
        }
        li:nth-child(5).active{
            background:url(//gfs12.gomein.net.cn/T10ZhsBmhT1RCvBVdK.png) no-repeat center 0.586667rem;
            background-size:0.68rem;
        }
    }
</style>