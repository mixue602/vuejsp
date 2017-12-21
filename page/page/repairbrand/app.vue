<template>
	<div class="wapper">
		<header-component :title ='title'></header-component>
		<!-- <service-steps :active= 1 :sertype=0></service-steps> -->
        <serve-flowrepair :active=2 :sertype=0></serve-flowrepair>
		<brand-list v-if="render" :goodsobj='goodsObj' :currentindex='currentindex' @changebrand='_getModels' @addpramas='addPramas'></brand-list>
	</div>
</template>

<script type="ecma6.0">
import headerComponent from '../../components/HeaderComponent';
import serveFlowrepair from '../../components/ServeFlowrepair'
// import serviceSteps from '../../components/ServiceSteps';
import brandList from './brandList';
let root = window || {},
    util = root.util || {};
export default {
	data () {
		return {
			hrefParma:{},
			goodsObj:{
				menus:[],
				goods:[]　
			},
			currentindex:0,
			imgUrl:"//img.gomein.net.cn/gomegj/wap/bdimg/",
			modelsObj:{},
			render: false
		}
	},
  	created() {
  		let that = this;
        util.removeSession('repairsaveasse');
  		this.hrefParma = util.getHrefParma();
  		this.hrefParma.arcode = this.hrefParma.arcode ? this.hrefParma.arcode : 100000;
  		this.title = this.hrefParma.eacnm + "维修";
  		that._getBrand();
        if(util.isApp()){
          util.deleteHeadBtn();
        }
    },
    methods:{
    	_getBrand() {

    		var that = this;
    			  // debug:start
	     //    var res = {"rpco":200,"tsrp":1492406844675,"body":{"brands":[{"eacid":12,"eacatenm":"","brdid":8,"brdnm":"苹果","logo":""},{"eacid":12,"eacatenm":"","brdid":10,"brdnm":"小米","logo":""},{"eacid":12,"eacatenm":"","brdid":11,"brdnm":"三星","logo":""},{"eacid":12,"eacatenm":"","brdid":12,"brdnm":"华为","logo":""},{"eacid":12,"eacatenm":"","brdid":13,"brdnm":"努比亚","logo":""},{"eacid":12,"eacatenm":"","brdid":15,"brdnm":"魅族","logo":""},{"eacid":12,"eacatenm":"","brdid":16,"brdnm":"vivo","logo":""},{"eacid":12,"eacatenm":"","brdid":17,"brdnm":"OPPO","logo":""}]}}
	     //    if (res.rpco === 200) {
	     //        that.goodsObj.menus = res.body.brands;
	     //        console.log(that.goodsObj)
	     //        this._getModels(res.body.brands[0].brdid);
	     //    }

	     //    return;
	        // debug:end
    		util.api({
	            surl:root.REPAIR_API_PATH + 'brands?arcode='+this.hrefParma.arcode+'&eacid='+this.hrefParma.eacid,
	            type: 'get',
	            success: function(res) {
	                if (res.rpco === 200) {
	                    $.each(res.body.brands,(index,item)=>{
	                    	item.brdimg = that.imgUrl+item.brdid+'.png';
	                    })
	                    that.goodsObj.menus = res.body.brands;
	                    that._getModels(res.body.brands[0].brdid);
	                }
	            },
	            error: function() {

	            }
	        });


    	},
    	_getModels(brdid,currentindex) {
    		var that = this,
            hrefParma = this.hrefParma;
            if(!!that.modelsObj[brdid]){
            	that.goodsObj.goods = that.modelsObj[brdid];
            	this.currentindex = currentindex || 0;
            	return;
            }

	        // debug start
	        	// var res = {"rpco":200,"tsrp":1492162013047,"body":{"spus":[{"spuid":16,"spunm":"iPhone 5S","spuimg":null,"props":null},{"spuid":17,"spunm":"iPhone 6","spuimg":null,"props":null},{"spuid":284,"spunm":"iPhone 6S","spuimg":null,"props":null},{"spuid":283,"spunm":"iPhone 6S Plus","spuimg":null,"props":null},{"spuid":18,"spunm":"iPhone 6 Plus","spuimg":null,"props":null},{"spuid":15,"spunm":"iPhone 5C","spuimg":null,"props":null},{"spuid":14,"spunm":"iPhone 5","spuimg":null,"props":null},{"spuid":12,"spunm":"iPhone 4S","spuimg":null,"props":null},{"spuid":11,"spunm":"iPhone 4","spuimg":null,"props":null},{"spuid":16,"spunm":"iPhone 5S","spuimg":null,"props":null},{"spuid":17,"spunm":"iPhone 6","spuimg":null,"props":null},{"spuid":284,"spunm":"iPhone 6S","spuimg":null,"props":null},{"spuid":283,"spunm":"iPhone 6S Plus","spuimg":null,"props":null},{"spuid":18,"spunm":"iPhone 6 Plus","spuimg":null,"props":null},{"spuid":15,"spunm":"iPhone 5C","spuimg":null,"props":null},{"spuid":14,"spunm":"iPhone 5","spuimg":null,"props":null},{"spuid":12,"spunm":"iPhone 4S","spuimg":null,"props":null},{"spuid":11,"spunm":"iPhone 4","spuimg":null,"props":null}]}}
	        	//  if(res.rpco === 200) {
	         //        that.goodsObj.goods=res.body.spus;
	         //        that.modelsObj[brdid]= res.body.spus;
	         //     }
	         //     return;
	        // debug end


	        util.api({
	            surl:root.REPAIR_API_PATH+'queryModelsByBrand?arcode='+ hrefParma.arcode +'&eacid='+ hrefParma.eacid +'&brdid='+brdid,
	            type:'get',
	            success: function(res) {
	                if(res.rpco === 200) {
	                    that.goodsObj.goods=res.body.models;
	                    that.modelsObj[brdid]= res.body.models;
	                    that.currentindex = currentindex || 0;
	                    that.render = true;
	                }
	            },
	            error: function() {}
	        });
    	},
    	addPramas(parentIndex,index) {
		  	let parent = this.goodsObj.menus[parentIndex],
            	good = this.goodsObj.goods[index];
            var parmasObj = {
                //品类
                catename: encodeURIComponent(this.hrefParma.eacnm),
                eacid: this.hrefParma.eacid,
                //品牌
                brdid: parent.brdid,
                brdnm: parent.brdnm,
                //型号
                mdld: good.mdld,
                attrnm: good.mdnm,
                arcode: this.hrefParma.arcode||100000,
                pageid: this.hrefParma.pageid,
                tsup: this.hrefParma.tsup,
                btime: this.hrefParma.btime,
                beizhu: this.hrefParma.beizhu
            }
            util.href("./repairinfo.html",parmasObj)
    	}
    },
	components: {
		// serviceSteps,
        serveFlowrepair,
		brandList,
		headerComponent
	}
}

</script>

<style lang="less">

</style>