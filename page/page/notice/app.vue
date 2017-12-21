<template>
	  <div id="notice">
		<header-component :title='title'></header-component>
        <div class="container">
            <div class="article blk2">
                 “国美管家”是国美电器旗下的一家综合性“互联网+服务”平台，平台提供家电维修、手机换屏维修、家电清洗、家电回收、手机回收五大核心服务。作为国内品类丰富的服务平台，我们致力为您提供更专业、更便捷、更贴心的服务！
            </div>
        </div>
	  </div>	
</template>

<script type="ecma6.0">
import headerComponent from '../../components/HeaderComponent';

let root = window || {},
    util = root.util || {};

   
export default {
    data () {
        return {
            title:'关于国美管家'
        };
    },
    created(){
        if(util.isApp()){
			util.deleteHeadBtn();
        }
    },
    components: {
        headerComponent
    }
}

</script>

<style lang="less">
@import '../../util/fs.less';

/* 公共内容区 */
.container {
    width: 10rem;
	min-width: 320px;
    background-color: #fff;
    overflow-x: hidden;
    overflow-y: auto;
    position: absolute;
    top: 1.173333rem;
    bottom:0;
    -webkit-overflow-scrolling: touch;
    z-index:999;
}

/* 优惠券使用说明页 */
.article {
    word-break: break-all;
    padding-bottom: .373333rem /* 28/75 */;
}
.blk2 {
    background-color: #fff;
    padding: .373333rem /* 28/75 */ .32rem /* 24/75 */;
    overflow: hidden;
    color: #666;
    .mixinfont(16px);
    line-height:.64rem /* 48/75 */;
}
</style>