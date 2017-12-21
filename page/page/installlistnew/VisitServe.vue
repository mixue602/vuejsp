<template>
    <ul class="visitServe clearfix">
        <li class="float_l">
            <img src="//gfs6.gomein.net.cn/T1.oYvB5Cv1RCvBVdK"  alt="">
            <span>1.确认信息</span>
            <p>与用户确认信息，指派专业工程师上门。</p>
        </li>
        <li class="float_l">
            <img src="//gfs5.gomein.net.cn/T1Z.EvByCQ1RCvBVdK"  alt="">
            <span>2.上门服务</span>
            <p>准备工具，工程师上门进行服务。</p>
        </li>
        <li class="float_l">
            <img src="//gfs2.gomein.net.cn/T13.YvBsAT1RCvBVdK" alt="">
            <span>3.准备工作</span>
            <p>安装前准备，穿鞋套保持地面清洁。</p>
        </li>
        <li style="clear: both;">
        <li class="float_l">
            <img src="//gfs7.gomein.net.cn/T1loEvB_Vj1RCvBVdK"  alt="">
            <span>4.安装工作</span>
            <p>进行专业的安装工作，安全第一为宗旨。</p>
        </li>
        <li class="float_l">
            <img src="//gfs9.gomein.net.cn/T1B5hvBjLg1RCvBVdK"  alt="">
            <span>5.测试机器</span>
            <p>测试机器运转，确保整体运转顺畅。</p>
        </li>
        <li class="float_l">
            <img src="//gfs.gomein.net.cn/T1AohvBKhg1RCvBVdK"  alt="">
            <span>6.清理现场</span>
            <p>询问服务质量，清理安装现场，离开。</p>
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