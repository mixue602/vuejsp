<template lang="html">
  <div class="wrap">
    <div class="part_one part" @click="go('http://q.m.gome.com.cn/?from=1.html&cmpid=bd_guanjia_20161220')"></div>
    <div class="part_two part" @click="go('http://prom.m.gome.com.cn/html/prodhtml/topics/201709/8/saleP0rgMkzIgbA.html?intcmp=prom-1908530-2?cmpid=snm_weixin_public_gj_sjtm_0912')"></div>
    <div class="part_three part"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods:{
    go(html){
      util.href(html)
    }
  }
}
</script>

<style lang="css">
  .wrap{
    width: 100%;
  }
  .part{
    background-size: cover!important;
    width: 100%;
  }
  .part_one{
    height: 16.16rem;
    background: url(//gfs11.gomein.net.cn/T1tGEvBsDQ1RCvBVdK.png) no-repeat top center;
  }
  .part_two{
    height: 15.12rem;
    background: url(//gfs13.gomein.net.cn/T1hKWvB_Vb1RCvBVdK.png) no-repeat top center;
  }
  .part_three{
    height: 18.987rem;
    margin-top: 0.4rem;
    background: url(//gfs12.gomein.net.cn/T13GdvBvZT1RCvBVdK.png) no-repeat top center;
  }
</style>
