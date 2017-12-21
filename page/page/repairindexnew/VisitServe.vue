<template>
    <ul class="visitServe clearfix">
        <li class="float_l">
            <img src="//gfs13.gomein.net.cn/T1vThTBXxb1RCvBVdK"  alt="">
            <span>1.出示证件</span>
            <p>出示证件，确定维修方案，提供报价。</p>
        </li>
        <li class="float_l">
            <img src="//gfs6.gomein.net.cn/T1rTDTBKZQ1RCvBVdK"  alt="">
            <span>2.现场作业</span>
            <p>现场作业，经验丰富，专业放心。</p>
        </li>
        <li class="float_l">
            <img src="//gfs11.gomein.net.cn/T1GSbTB4Dv1RCvBVdK" alt="">
            <span>3.维修完成</span>
            <p>维修完成，用户现场检测机器。</p>
        </li>
        <li style="clear: both;">
        <li class="float_l">
            <img src="//gfs12.gomein.net.cn/T1eS_TBjLv1RCvBVdK"  alt="">
            <span>4.拍照记录</span>
            <p>验机完成，拍照记录，出具保修。</p>
        </li>
        <li class="float_l">
            <img src="//gfs6.gomein.net.cn/T1aT_TBj_v1RCvBVdK"  alt="">
            <span>5.清理现场</span>
            <p>用户交付完成，清理维修现场。</p>
        </li>
        <li class="float_l">
            <img src="//gfs12.gomein.net.cn/T1nSDTBXJQ1RCvBVdK"  alt="">
            <span>6.维修评价</span>
            <p>完成维修评价，维修服务完成。</p>
        </li>
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
    .visitServe{
        background: #fff;
        padding-top: 0.533333rem;
        padding-bottom: 0.133333rem;
        overflow: hidden;
        li{
            width: 33.3%;
            text-align: center;
            margin-bottom:0.32rem;
            img{
                width: 2.4rem;
                height:1.466667rem;
                margin:0 auto;
            }
            span{
                display: block;
                .mixinfont(14px);
                color:#333;
                margin-top:0.266667rem;
            }
            p{
                margin-top:0.106667rem;
                line-height: 0.48rem;
                text-align: left;
                width: 2.4rem;
                margin: 0 auto;
                .mixinfont(10px);
                color: #999;
            }
        }
    }
</style>