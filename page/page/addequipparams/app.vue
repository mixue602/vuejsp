<template>
    <div class="wapper-box wapper">
	    <header-component :title="title"></header-component>
	    <choice-params></choice-params>
    </div>
    
    
</template>

<script>
 var root = window || {},
     util = root.util || {};

import headerComponent from '../../components/HeaderComponent';
import choiceParams from './choiceParams';


export default {
	data () {
		return {
        title: '其他参数'
		}
	},
	components: {
		headerComponent,
    choiceParams

	},

	created () {
		if(util.isApp()){
         util.deleteHeadBtn();
        }
	},
	updated() {
    
    },
	 methods: {

    }
}
</script>

<style lang="less">
    @import '../../util/fs.less';
    body,html{
    	height: 100%;
    }

    .wapper-box{
    	height: 100%;
    	width: 100%;
    	box-sizing: border-box;
    	padding-top: 1.173333rem;
    }
	
	
</style>