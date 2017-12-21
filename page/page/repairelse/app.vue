<template>
    <div class="wapper">
	    <header-component :title="title"></header-component>
		<!-- <service-steps :active= 1 :sertype=0></service-steps> -->
		<serve-flowrepair :active= 2 :sertype=0></serve-flowrepair>
		<equipment-list :body="body"></equipment-list>
    </div>
</template>

<script type='text/ecmascript-6'>
 var root = window || {},
     util = root.util || {};

import headerComponent from '../../components/HeaderComponent'
// import serviceSteps from '../../components/ServiceSteps'
import serveFlowrepair from '../../components/ServeFlowrepair'
import equipmentList from './EquipmentList'

export default {
	data () {
		return {
			title: '',
			body:[],
			imgUrl:"//img.gomein.net.cn/gomegj/wap/bdimg2/"
		}
	},
	components: {
		headerComponent,
		// serviceSteps,
		serveFlowrepair,
		equipmentList
	},
	created () {
		var that = this,
			hrefParma = util.getHrefParma();
  		util.removeSession('repairsaveasse');
		this.title = hrefParma.eacnm+'维修';
		util.api({
			surl:root.REPAIR_API_PATH + 'brands',
			data:{
				arcode:hrefParma.arcode,
				eacid:hrefParma.eacid
			},
			type:'get',
			success: function(response) {
				var rpco = response.rpco,
					body = response.body,
					brands = body.brands;

				// 处理
				switch(rpco) {
					case 200:
						// 处理数据
						$.each(brands, function(index,current) {
							current.taf = false;
	                    	current.logo = that.imgUrl+current.brdid+'.png';
						});
						that.body = brands;
						break;
					case 40401:
                    	util.tip('服务器繁忙，请稍后再试',2000)
                    	break;
                    default:
                        util.tip('请求失败');

				}

			}
		})
		if(util.isApp()){
          util.deleteHeadBtn();
        }
	}
}
</script>

<style lang="less">
    @import '../../util/fs.less';

</style>