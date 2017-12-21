<template>
	<div id="commentSubmit">
        <div class="header">
            <a class="goBack" @click="fnHref"><i></i></a>
            <span class="title">{{ title }}</span>
        </div>

        <!-- 收费标准 -->
        <div id="tvcharge">
            <img class="tvcharge" src="http://gfs13.gomein.net.cn/T1xoLvBKW_1RCvBVdK.png" alt="">
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
			 title:'配件收费标准'
        }
	},
  	created() {
        this.hrefParma = util.getHrefParma();
    },
    methods:{
        fnHref(){
            util.href("javascript:window.history.back(-1)");
        }
    },
	components: {
		headerComponent
	}
}
</script>

<style lang="less">
@import '../../util/fs.less';
.header {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        color: #333;
        .mixinfont(18px);
        text-align: center;
        height: 1.12rem;
        line-height: 1.12rem;
        /* border-bottom: 1px solid #e3e3e3; */
        background-color: #f8f8f8;
        z-index: 1000;
    }
    .header .goBack {
        width: 1.066667rem;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
    .header .title {
        max-width: 70%;
        margin: 0 auto;
        display: block;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .header .goBack i{
        position: absolute;
        top: 0.306667rem;
        left: 0.32rem;
        width: 0.333333rem;
        height: 0.573333rem;
        background:url(//gfs6.gomein.net.cn/T1hTDTBKWQ1RCvBVdK) no-repeat;
        background-size: 0.333333rem 0.573333rem;
    }
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