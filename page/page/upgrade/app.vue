<template>
  <div class="wapper">
  <header-component :title="title"></header-component>
      <div class="container">
          <img src="//gfs10.gomein.net.cn/T1T4Z_B7xT1RCvBVdK.png">
          <b>系统升级中...</b>
          <p>亲爱的用户：</br> 我们正在对平台进行升级，升级期间暂时无法访问。给您带来的不变，敬请谅解！</p>
      </div>
  </div>
</template>
<script  type="ecma6.0">

let root = window || {},
    util = root.util || {};  
    import headerComponent from '../../components/HeaderComponent'
export default {
  data() {
      return {
          title:"系统升级"
      }
  },
  created () {
       if(util.isApp()){
            util.deleteHeadBtn();
        }
  },
  methods: {
  },
  components: {
	 headerComponent	
  },

	

}
</script>
<style lang="less">
@import '../../util/fs.less';
html{
    background: #fff;
}
.wapper{
    .goBack{
        display: none;
    }
    .container{
        width: 100%;
        height: 100%;
        img{
            display: inline-block;
            width: 5.333333rem;
            height: 5.333333rem;
            margin-left:2.346667rem;
        }
        b{
            display: block;
            .mixinfont(16px);
            color: #FF4B46;
            letter-spacing: 0;
            margin-left: 3.786667rem;
            margin-top: -.4rem;
        }
        p{
            .mixinfont(12px);
            color: #777777;
            letter-spacing: 0;
            line-height: 18px;
            width: 7.493333rem;
            margin-left: 1.333333rem;
            margin-top: .346667rem;
        }
    }
}
</style>



