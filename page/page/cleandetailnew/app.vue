<template>
    <div class="wapper">
	    <header-component :title="title" :h="h"></header-component>
	    <clean-detail></clean-detail>
    </div>
</template>

<script type='text/ecmascript-6'>
 var root = window || {},
     util = root.util || {};

import headerComponent from '../../components/HeaderComponent'
import cleanDetail from  './CleanDetail'

export default {
	data () {
		return {
			title: '服务详情',
            h: 'cleanlistnew.html'
		}
	},
	components: {
		headerComponent,
		cleanDetail
	}

}
</script>

<style lang="less">
    @import '../../util/fs.less';
</style>