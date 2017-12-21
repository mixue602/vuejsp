<template>
    <ul class="costExplain clearfix">
        <li>
            <h3>1.检测费</h3>
            <p>a) 工程师上面进行检测，检测出故障后用户如果维修则不收取检测费。</p>
            <p>b) 检测出故障后如果用户不维修，则将收取检测费用；</p>
        </li>
        <li>
            <h3>2.维修费</h3>
            <p>a) 维修费根据不同级别的类型来收取，如需更换配件需另外收取配件费；</p>
            <p>b) 如涉及到多个配件更换，根据实际发生的更换配件难度最高级只收取一次维修费；</p>
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

    .costExplain{
        padding:0.413333rem 0.293333rem;
        background: #fff;
        h3{
            .mixinfont(16px);
            color: #333;
            line-height: 0.64rem;
        }
        p{
            color:#999;
            .mixinfont(14px);
            line-height:0.533333rem;
        }
    }
</style>