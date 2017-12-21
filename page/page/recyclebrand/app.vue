<template>
	<div class="wapper">
		<header-component :title ='title'></header-component>
		<server-flow :index="1"></server-flow>
		<brand-list v-if="render" :goodsobj='goodsObj' :currentindex="currentindex" @changebrand='_getModels' @addpramas='addPramas'></brand-list>
	</div>
</template>

<script type="ecma6.0">
import headerComponent from '../../components/HeaderComponent';
// import serviceSteps from '../../components/ServiceSteps';
import brandList from './brandList';
import serverFlow from '../../components/ServeFlow'
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
			imgUrl:"//img.gomein.net.cn/gomegj/wap/bdimg/",
			modelsObj:{},
			render: false,
			currentindex:0
		}
	},
  	created() {
  		let that = this;

  		util.removeSession('recyclesaveasse');
  		this.hrefParma = util.getHrefParma();
  		this.hrefParma.arcode = this.hrefParma.arcode ? this.hrefParma.arcode : 100000;
  		this.title = this.hrefParma.catenm + "回收";
  		$('title').html(this.title)
  		that._getBrand();
  		if(util.isApp()){
  			util.deleteHeadBtn();
  			util.setHeadBar({title:this.title})
  		}
    },
    methods:{
    	_getBrand() {

    		var that = this;
    		 // debug:start
	     //    var res = {
	     //    		"rpco":200,
			   //      "tsrp":1492228108838,
			   //      "body":{
		    //     	"brds":[
			   //      	{"brdid":8,"brdnm":"苹果","brdimg":""},
			   //      	{"brdid":10,"brdnm":"小米","brdimg":""},
			   //      	{"brdid":11,"brdnm":"三星","brdimg":""},
			   //      	{"brdid":12,"brdnm":"华为","brdimg":""},
			   //      	{"brdid":13,"brdnm":"努比亚","brdimg":""},
			   //      	{"brdid":15,"brdnm":"魅族","brdimg":""},
			   //      	{"brdid":17,"brdnm":"OPPO","brdimg":""},
			   //      	{"brdid":89,"brdnm":"谷歌","brdimg":""}
		    //     	]}
	     //    	}
	     //    if (res.rpco === 200) {
	     //    	console.log( that.goodsObj)
	     //        that.goodsObj.menus = res.body.brds;
	     //        console.log(that.goodsObj)
	     //        this._getModels(res.body.brds[0].brdid);
	     //    }

	     //    return;
	        // debug:end
    		util.api({
	            surl: root.RECYCLE_API_PATH + 'getBrand?arcode='+this.hrefParma.arcode+'&cateid='+this.hrefParma.cateid,
	            type: 'get',
	            success: function(res) {
	                if (res.rpco === 200) {
	                    $.each(res.body.brds,(index,item)=>{
	                    	item.brdimg = that.imgUrl+item.brdid+'.png';
	                    })
	                    //alert('success')
	                    that.goodsObj.menus = res.body.brds;
	                    that._getModels(res.body.brds[0].brdid,0);
	                }
	            },
	            error: function() {

	            }
	        });


    	},
    	_getModels(brdid,index) {
    		var that = this,
            hrefParma = this.hrefParma;

            if(!!that.modelsObj[brdid]){
            	that.goods = that.modelsObj[brdid];
            	that.goodsObj.goods = that.modelsObj[brdid];
            	that.currentindex = index || 0;
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
	            // surl: root.RECYCLE_API_PATH + 'getSPU?arcode=110108&cateid=1001&brdid=101',
	            surl:root.RECYCLE_API_PATH+'getSPU?arcode='+ hrefParma.arcode +'&cateid='+ hrefParma.cateid +'&brdid='+brdid,
	            type:'get',
	            success: function(res) {
	                if(res.rpco === 200) {
	                    that.goodsObj.goods=res.body.spus;
	                    that.modelsObj[brdid]= res.body.spus;
	                    that.currentindex = index || 0;
	                    that.render = true;
	                    // alert('success')
	                }
	            },
	            error: function() {}
	        });
    	},
    	addPramas(parentIndex,index) {
		  	let parent = this.goodsObj.menus[this.currentindex],
            	good = this.goodsObj.goods[index];
            var parmasObj = {
                //品类
                catename: encodeURIComponent(this.hrefParma.catenm),
                cateid: this.hrefParma.cateid,
                //品牌
                brdid: parent.brdid,
                brdnm: parent.brdnm,
                //型号
                proid: good.spuid,
                attrnm: good.spunm,
                arcode: this.hrefParma.arcode||100000,
                pageid: this.hrefParma.pageid,
                tsup: this.hrefParma.tsup,
                btime: this.hrefParma.btime,
                beizhu: this.hrefParma.beizhu
            }
            util.href("./recycleinfo.html",parmasObj)
    	}
    },
	components: {
		// serviceSteps,
		brandList,
		headerComponent,
		serverFlow
	}
}

</script>

<style lang="less">

</style>
