<template>
    <div class="wapper">
	    <header-component :title="title"></header-component>
	    <div class="bg">
			<serve-flowrepair :active= 1 :sertype=0></serve-flowrepair>
			<classify-h3 :index="0"></classify-h3>
			<repair-list :body="body"></repair-list>
			<classify-h3 :index="1"></classify-h3>
			<visit-serve></visit-serve>
			<classify-h3 :index="2"></classify-h3>
			<serve-commitment></serve-commitment>
			<classify-h3 :index="3"></classify-h3>
			<cost-explain></cost-explain>
			<foot-components></foot-components>
		</div>
    </div>
</template>

<script type='text/ecmascript-6'>
 var root = window || {},
     util = root.util || {};

import headerComponent from '../../components/HeaderComponent'
import serveFlowrepair from '../../components/ServeFlowrepair'
import classifyH3 from './ClassifyH3'
import repairList from './RepairList'
import visitServe from './VisitServe'
import serveCommitment from './ServeCommitment'
import costExplain from './CostExplain'
import footComponents from '../../components/FootComponents'

export default {
	data () {
		return {
			title: "维修服务",
			body:{},
			baseurl: '//img.gomein.net.cn/gomegj/wap/eacimg/'
		}
	},
	components: {
		headerComponent,
		serveFlowrepair,
		classifyH3,
		repairList,
		visitServe,
        serveCommitment,
        costExplain,
		footComponents
	},

	created () {
		var that = this,
            ls=window.localStorage,
            arcode;
        if(ls.getItem('dstrict') == null){
            arcode=110108
        }else{
            arcode=eval("("+ls.getItem('dstrict')+")").d
		}
        if(util.isApp()){
          util.deleteHeadBtn();
        }

		util.api({
			surl:root.REPAIR_API_PATH + 'eacategory?arcode='+arcode,
			type:'get',
			success:function(res) {
				var rpco = res.rpco,
					body = res.body;

				// 处理
				switch(rpco) {
					case 200:
						$.each(body.eacatgs,(i,item)=>{
							item.logo = that.baseurl+String(item.eacid)+".png"
						})
						that.body = body;
					break;
					case 40401:
                    	util.tip('服务器繁忙，请稍后再试',2000);
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
	.bg{
		background: #f5f5f5;
		position: relative;
		padding-bottom: 50px;
	}
</style>