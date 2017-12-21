<template lang="html">
  <div class="wrap">
    <div class="direction" @click="go('http://wap.gomegj.com/wxcommon/v1/wxrc?furl=http://wap.gomegj.com/v2/direction.html')">
      <div class="top">
        <div class="redblock"></div>
        <p>商品从购买之日起已进入试用阶段，<br/>
          当时不太注意，过段时间后就突然想发票去哪了，<br/>
          明明放在了那里却偏偏找不到。<br/>
          家电说明书要看，保修卡也要有<br/>
          <span>其实查看家电信息很简单</span>
        </p>
      </div>
      <div class="center auto"></div>
      <div class="direction_text"></div>
    </div>
    <div class="electronicInvoice" @click="go('http://wap.gomegj.com/wxcommon/v1/wxrc?furl=http://wap.gomegj.com/v2/electronicInvoice.html')">
      <div class="center auto"></div>
      <div class="electronicInvoice_text"></div>
    </div>
    <div class="EWC" @click="go('http://wap.gomegj.com/wxcommon/v1/wxrc?furl=http://wap.gomegj.com/v2/myorder.html')">
      <div class="center auto"></div>
      <div class="EWC_text"></div>
    </div>
    <p><span class="red">国美管家围绕“家电”的事,</span><br/>
      不仅提供家电信息的电子化功能，<br/>
      而且切实解决家电送货丶安装“最后一公里”的问题，<br/>
      <span class="bold">送货安装可视化，</span><br/>
      买完家电直接回家，一切尽在你掌握。
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods:{
    go(html) {
      util.href(html)
    }
  }
}
</script>

<style lang="css">
  .wrap{
    background: #fff;
    padding-top: 0.933rem;
  }
  .direction{
    width: 100%;
    height: 20.147rem;
    background: #fff;
  }
  .direction .top{
    width: 100%;
    height: 2.773rem;
    position: relative;
  }
  .redblock{
    width: 0.293rem;
    height: 2.307rem;
    position: absolute;
    left: 0;
    background:#e95a52;
  }
  .direction p{
    float: left;
    width: 100%;
    margin-left: 0.693rem;
    font-size: 0.347rem;
    text-align: center;
    color: #000;
  }
  .direction p span{
    font-weight: bold;
    line-height: 0.4rem;
  }
  .auto{
    width: 100%;
    background-size: cover!important;
  }
  .direction .center{
    height: 8.7rem;
    background: url(//gfs13.gomein.net.cn/T13GEvBsEQ1RCvBVdK.png) no-repeat top center;
    margin-top: 1.6rem;
  }
  .direction_text{
    width: 7.03rem;
    height: 6.373rem;
    margin-left:0.44rem;
    background: url(//gfs12.gomein.net.cn/T1RvEvBmxQ1RCvBVdK.png) no-repeat top center;
    background-size: cover;
  }
  .electronicInvoice{
    width: 100%;
    height: 16.373rem;
    background: #fff;
  }
  .electronicInvoice .center{
    background: url(//gfs12.gomein.net.cn/T1NPEvBbhQ1RCvBVdK.png) no-repeat top center;
    height: 10.6rem;
    margin-top: 1.6rem;
  }
  .electronicInvoice_text{
    width: 6.413rem;
    height: 4.853rem;
    background: url(//gfs11.gomein.net.cn/T1HvJvBKAj1RCvBVdK.png) no-repeat top center;
    float: right;
    margin-right: 0.44rem;
    background-size:cover;
  }
  .EWC{
    width: 100%;
    height: 16.293rem;
    background: #fff;
  }
  .EWC .center{
    background: url(//gfs13.gomein.net.cn/T1WvdvBKbT1RCvBVdK.png) no-repeat top center;
    height: 9.547rem;
  }
  .EWC_text{
    width: 6.987rem;
    height: 5.133rem;
    margin-left: 0.44rem;
    background: url(//gfs10.gomein.net.cn/T1lIdvBKYT1RCvBVdK.png) no-repeat top center;
    background-size: cover;
  }
  .wrap>p{
    margin-left: 0.32rem;
    color: #333;
    line-height: 0.6rem;
    font-size: 0.347rem;
    padding-bottom: 1.2rem;
  }
  .wrap>p span.red{
    color: #f55c5f;
  }
  .wrap>p span.bold{
    font-weight: bold;
  }
</style>
