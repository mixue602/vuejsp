<template>
  <div class="wapper">
  <header-component :title="title"></header-component>
      <div class="container">
          <img src="http://10.103.11.42:8080/interfaceService/img/cost.png">
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
          title:"收费标准"
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
    .container{
        width: 100%;
        height: 100%;
        text-align: center;
        img{
            display: inline-block;
            width: 100%;
        }
    }
}
</style>



