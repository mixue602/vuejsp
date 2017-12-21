<template lang="html">
  <div class="wrap">
    <div class="partOne"></div>
    <div class="weixin"></div>
    <div class="line">
      <p>
        一张图看懂您的商品到哪了
      </p>
    </div>
    <h1 class="title">
      <span>1</span>&nbsp;&nbsp;微信添加界面，搜索国美管家
    </h1>
    <div class="first_step auto"></div>
    <h1 class="title last">
      <span>2</span>&nbsp;&nbsp;微信添加界面，搜索国美管家
    </h1>
    <div class="second_step auto"></div>
    <h1 class="title last">
      <span>3</span>&nbsp;&nbsp;打开个人中心-绑定会员-输入手机号，示图：
    </h1>
    <div class="third_step auto">
      <div class="bindCard auto"></div>
      <div class="card auto"></div>
    </div>
    <h1 class="title last">
      <span>4</span>&nbsp;&nbsp;打开订单 查看送货
    </h1>
    <div class="four_step auto"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  }
}
</script>

<style lang="css">
  .wrap{
    background: #dcd9d1;
    width: 100%;
    padding-bottom: 0.72rem;
  }
  .partOne{
    width: 100%;
    height: 12.04rem;
    background: url(//gfs11.gomein.net.cn/T1RGEvBgEb1RCvBVdK.png) no-repeat top center;
    background-size: cover;
  }
  .weixin{
    width: 9.227rem;
    height: 1.467rem;
    margin: 0 auto;
    background: url(//gfs13.gomein.net.cn/T1LKbvBghQ1RCvBVdK.png) no-repeat top center;
    background-size: cover;
  }
  .line{
    width: 100%;
    height: 2px;
    background: #333;
    position: relative;
    margin-top: 1.2rem;
  }
  .line p{
    width: 5.787rem;
    height: 0.64rem;
    background: #333;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -0.32rem 0 0 -2.8935rem;
    border-radius: 3px;
    color: #fff;
    line-height: 0.64rem;
    text-align: center;
    font-weight: bold;
    font-size: 0.373rem;
  }
  .title{
    width: 100%;
    height: 0.48rem;
    margin-top: 1.173rem;
    color: #333;
    text-align: center;
    font-weight: bold;
    margin-bottom: 0.56rem;
  }
  .title span{
    width: 0.48rem;
    height: 0.48rem;
    border-radius: 50%;
    display: inline-block;
    background: #333;
    text-align: center;
    line-height: 0.48rem;
    color: #fff;
  }
  .auto{
    width: 7.333rem;
    margin: 0 auto;
    background-size: cover!important;
  }
  .first_step{
    height: 5.133rem;
    background: url(//gfs13.gomein.net.cn/T1RGEvBgbb1RCvBVdK.png) no-repeat top center;

  }
  .second_step{
    height: 11.4rem;
    background: url(//gfs13.gomein.net.cn/T1GGdvBgCT1RCvBVdK.png) no-repeat top center;
  }
  .bindCard{
    height: 5.187rem;
    background: url(//gfs10.gomein.net.cn/T1ovhvByVg1RCvBVdK.png) no-repeat top center;
  }
  .card{
    height: 11.88rem;
    margin-top: 7px;
    background: url(//gfs13.gomein.net.cn/T12GxvBCE_1RCvBVdK.png) no-repeat top center;
  }
  .four_step{
    height: 13.72rem;
    background: url(//gfs13.gomein.net.cn/T1CAAvBsZb1RCvBVdK.png) no-repeat top center;
  }
  .last{
    margin-top: 0.56rem;
  }
</style>
