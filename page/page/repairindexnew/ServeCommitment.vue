<template>
    <ul class="serveCommitment clearfix">
        <li class="float_l">
            <img src="//gfs10.gomein.net.cn/T1vebTBgAT1RCvBVdK" alt="">
            <p>价格公开透明</p>
        </li>
         <li class="float_l">
            <img src="//gfs6.gomein.net.cn/T1DSZTB_WQ1RCvBVdK" alt="">
            <p>额外质保三个月</p>
        </li>
         <li class="float_l">
            <img src="//gfs11.gomein.net.cn/T1VS_TB5Ev1RCvBVdK" alt="">
            <p>修不好不收费</p>
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

    .serveCommitment{
        padding-bottom: 0.346667rem;
        background: #fff;
        text-align: center;
        display:flex;
        li{
            flex:1;
            .mixinfont(14px);
            color:#333;
            img{
                margin: 0.4rem auto;
                width: 1.72rem;
                height: 1.72rem;
            }
        }

    }
</style>