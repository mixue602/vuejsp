<template>
	<div id="tvcharge">
        <img class="tvcharge" src="http://gfs13.gomein.net.cn/T1xoLvBKW_1RCvBVdK.png" alt="">
    </div>
</template>

<script type="ecma6.0">
import headerComponent from '../../components/HeaderComponent';
let root = window || {},
    util = root.util || {};
export default {
	data () {
		return {
			// title:'配件收费标准'
        }
	},
  	created() {
        this.hrefParma = util.getHrefParma();
    },
    methods:{
        
    },
	components: {
		headerComponent
	}
}

</script>

<style lang="less">
@import '../../util/fs.less';
#tvcharge{
    padding: 0.133333rem;
    position: absolute;
    top: 1.12rem;
    left:0;
    z-index: 999;
    background-color: #fff;
    img{
        width: 100%;
        height:auto;
    }
}
</style>