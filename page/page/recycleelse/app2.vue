<template>
    <div>
	    <header-component :title="title"></header-component>
		<service-steps></service-steps>
		<equipment-list :body="body" :bodyData="bodyData"></equipment-list>
		<foot-portion></foot-portion>
    </div>
</template>

<script type='text/ecmascript-6'>
 var root = window || {},
     util = root.util || {};

import headerComponent from '../../components/HeaderComponent'
import serviceSteps from '../../components/ServiceSteps'
import equipmentList from './EquipmentList'
import footPortion from '../../components/FootPortion'

export default {
	data () {
		return {
            a:{
                "spus":[{
                    "spuid":0,
                    "spunm":''
                }]
            },
			title: '',
			body:[],
			bodyData:{}
		}
	},
	components: {
		headerComponent,
		serviceSteps,
		equipmentList,
		footPortion
	},
	created () {
		var that = this,
			hrefParma = util.getHrefParma();
		this.title = hrefParma.catenm+'回收';
		util.api({
			surl:'recycleelse.json',
			data:{
				cateid:hrefParma.cateid
			},
			type:'get',
			success: function(response) {
				var rpco = response.rpco,
					body = response.body,
					brds = body.brds;

				// 处理
				switch(rpco) {
					case 200:
						// 处理数据，给每一个models对象下添加一个obvious属性;
						$.each(brds, function(index,current) {
							current.taf = false;
						});
						that.body = brds;
						$.each(brds,function(index,current) {
							that.bodyData[index] = that.a;
						})
						console.log(that.bodyData)
						break;
					case 40401:
                    	util.tip('服务器繁忙，请稍后再试',2000)
                    	break;
                    default:
                        util.tip('请求失败');

				}

			}
		})
	}
}
</script>

<style lang="less">
    @import '../../util/fs.less';

</style>