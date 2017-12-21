<template>
    <ul class="visitServe clearfix">
        <li class="float_l">
            <img src="//gfs13.gomein.net.cn/T1jUCvB5Z_1RCvBVdK.png"  alt="">
            <span>1.确认时间</span>
            <p>与用户确定上门回收时间。</p>
        </li>
        <li class="float_l">
            <img src="//gfs13.gomein.net.cn/T156xvBQAj1RCvBVdK.png"  alt="">
            <span>2.人员上门</span>
            <p>指派回收人员上门回收。</p>
        </li>
        <li class="float_l">
            <img src="//gfs12.gomein.net.cn/T1tcdvB4LQ1RCvBVdK.png" alt="">
            <span>3.出示证件</span>
            <p>出示工作证，对商品进行实际评测。</p>
        </li>
        <li class="float_l">
            <img src="//gfs13.gomein.net.cn/T1McDvBgJj1RCvBVdK.png"  alt="">
            <span>4.协商价格</span>
            <p>与用户协商价格。</p>
        </li>
        <li class="float_l">
            <img src="//gfs11.gomein.net.cn/T1C6CvBXJ_1RCvBVdK.png"  alt="">
            <span>5.现场支付</span>
            <p>用户移交旧电器，现场支付给用户。</p>
        </li>
        <li class="float_l">
            <img src="//gfs13.gomein.net.cn/T1PUKvBjAv1RCvBVdK.png"  alt="">
            <span>6.完成回收</span>
            <p>完成回收。</p>
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