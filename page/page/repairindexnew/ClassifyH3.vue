<template>
    <h3 class="classifyH3 bdr-bottom">
        <img  :src="classifyimg[index]" alt="">
    </h3>
</template>

<script>
export default {
    props:['index'],
    data () {
        return {
            classifyimg:['//gfs11.gomein.net.cn/T1iTLTBmKT1RCvBVdK','//gfs6.gomein.net.cn/T15wYTBbKg1RCvBVdK','//gfs13.gomein.net.cn/T1ywCTB4_g1RCvBVdK','//gfs13.gomein.net.cn/T1oSbTBXhv1RCvBVdK']
        }
    },
    methods:{

    }
}
</script>

<style lang="less">
    @import '../../util/fs.less';
    .classifyH3{
        background: #fff;
        margin-top: 0.253333rem;
        /* border: 0.013333rem solid #e9e9e9; */
        border-top: none;
        img{
            width: 6.666667rem;
            height: 1.173333rem;
        }
    }
</style>