<template>
    <ul class="visitServe clearfix">
        <li class="float_l">
            <img src="//gfs13.gomein.net.cn/T1vThTBXxb1RCvBVdK"  alt="">
            <span>1.确认时间</span>
            <p>工程师出示证件，确认清洗方案。</p>
        </li>
        <li class="float_l">
            <img src="//gfs4.gomein.net.cn/T1RVKvBg_v1RCvBVdK"  alt="">
            <span>2.铺防尘垫</span>
            <p>铺设尘垫，避免二次污染。</p>
        </li>
        <li class="float_l">
            <img src="//gfs.gomein.net.cn/T1BZYvByY_1RCvBVdK" alt="">
            <span>3.深度清洗</span>
            <p>常规清洗加关键部件深度清洗。</p>
        </li>
        <li style="clear: both;">
        <li class="float_l">
            <img src="//gfs7.gomein.net.cn/T1VZbvB5_v1RCvBVdK"  alt="">
            <span>4.安装拆件</span>
            <p>安装所有拆卸部件，回归原样。</p>
        </li>
        <li class="float_l">
            <img src="//gfs3.gomein.net.cn/T19EKvBgJv1RCvBVdK"  alt="">
            <span>5.测试机器</span>
            <p>测试机器运转，确保整体运转顺畅。</p>
        </li>
        <li class="float_l">
            <img src="//gfs1.gomein.net.cn/T1zCWvB7AT1RCvBVdK"  alt="">
            <span>6.清理现场</span>
            <p>清理环境，还原清洗现场。</p>
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