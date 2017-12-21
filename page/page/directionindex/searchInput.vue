<template>
    <div class="search_wrap">
        <div class="search" @click="clickSearch">
            <input>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    mounted() {
        
    },
    methods:{
        clickSearch() {
            util.href('./directionsearch.html')
        }
        
    }
}
</script>

<style lang="less" scoped>
@import '../../util/fs.less';
.search{
    width: 100%;
    height: 0.96rem;
    background: #f3f5f7;
    padding-top: 0.24rem;
    position: relative;
    input{
        width: 92%;
        height: 0.72rem;
        display: block;
        margin: 0 auto;
        background:#fff url(http://gfs13.gomein.net.cn/T1rzE_B4AT1RCvBVdK.png) no-repeat center center;
        background-size: 1.093rem 0.32rem;
        border-radius: 0.4rem;
        font-size: 0.37333rem;
        text-indent: 0.29333rem;
    }
    input.focus{
        background: #fff;
    }
    img{
        width: 0.4rem;
        height: 0.4rem;
        right: 0.69333rem;
        top: 0.4rem;
        position: absolute;
    }
}
.searchModel{
    width: 100%;
    height: 100%;
    background: #fff;
}
</style>


