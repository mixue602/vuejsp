<template>
	<div class="wapper recycle-wapper" >
		<!-- 公共头部 -->
		<header-component :title="title"></header-component>
		<!-- 进度条 -->
		<div class="progress">
			<div class="progress-bar" :class="{'progressFix':true}" :style="{width:progressWidth/10
		+'rem'}">
		        <label>{{progressWidth}}%</label>
		        <span></span>
    		</div>
		</div>
		<server-flow :index="2"></server-flow>
		<recycle :assement= 'assement' :subobj="subobj" @select='parentSelect' @selectcheckbox='parentSelectCheckbox'></recycle>
    	<footer  class="waves" :class="{'on': submitBtn}"><a @click="getAssement($event)" href="javascript:;">马上估价</a></footer>
	</div>

</template>

<script type="text/ecmascript-6">
import headerComponent from '../../components/HeaderComponent'
import serviceSteps from '../../components/ServiceSteps'
import recycle from './recycleinfo.vue'
import serverFlow from '../../components/ServeFlow'
// import footerComponent from '../../components/FootPortion.vue'
let root = window || {},
    util = root.util || {};
export default {
	data () {
		return {
			hrefParma:{},
			title:"",
			assement: [],
			activeNum: 0,
			progressWidth:0,
			chtpNum: 0,
			assementdata:{},
			submitBtn:false,
			progressWidth:2,
			subobj:{},
			subProps:[],
			arcode:11011400,
			recyclesaveasse:{
				assement:[],
				subObj:{}
			}
		}
	},
	created() {

		this.hrefParma = util.getHrefParma();
		this.title = this.hrefParma.brdnm +" "+ this.hrefParma.attrnm+'回收';
		if(util.isApp()){
			util.deleteHeadBtn();
		}
		let ss = window.sessionStorage;
		if(!!ss.getItem("recyclesaveasse")){
			var recycledata = JSON.parse(ss.getItem("recyclesaveasse")),chtpNum=0;
			$.each(recycledata.assement,(index,item)=>{
				if(item.chtp == 1||item.chtp == 3){
        			chtpNum++;
        		}
			})
			this.recyclesaveasse = recycledata;
			this.assement = recycledata.assement;
			this.chtpNum = chtpNum;
			this.progressWidth = 100;
			this.submitBtn = true;
			this.subobj = recycledata.subObj;
			this.subProps = [];
			for(var k in recycledata.subObj){
				this.subProps.push(recycledata.subObj[k]);
			}
	    	// console.log(this.subobj);
			// ss.removeItem("recyclesaveasse");
			// console.log(recycledata);
			return;
		}
		this._getRecInfo();
		this.getDivisionCode();
	},
	methods: {
		_getRecInfo() {
			var that = this;
			 util.api({
	            surl: root.RECYCLE_API_PATH + 'getAssement?prodid='+this.hrefParma.proid,
	            // surl: 'data2.json',
	            type: 'get',
	            success: function(res) {
	                if (res.rpco === 200) {
	                	let assement = res.body.props;
	                	// 数据处理
	                	let chtpNum = 0;
	                	$.each(assement,(index,item)=>{
	                		// 故障标题内容
	                		item.tit = "";
	                		// 故障标题显示
	                		item.titShow = false;
	                		// 故障列表显示
	                		item.ulShow = index==0 ? true : false;
	                		// 故障父盒子显示
	                		item.parentShow = index==0 ? true : false;
	                		//是否处于修改状态
	                		item.modify = false;
	                		//用户是否已经选择过
	                		item.select = false;
	                		// 单个故障选中状态
	                		$.each(item.vals,(i,val)=>{
	                				val.on = false;
	                		})
	                		// 非必选选项个数
	                		if(item.chtp == 1||item.chtp == 3){
	                			chtpNum++;
	                		}

	                	})
	                	that.chtpNum  = chtpNum;
	                    that.assement = assement;
	                }
	            },
	            error: function(res) {
	            }
	        });
		},
		parentSelect(len,subObj,saveasse) {
			// 控制进度条及提交按钮
			this.progressWidth = (100*parseFloat(len/(this.assement.length-this.chtpNum))).toFixed(0);
			if(len == (this.assement.length-this.chtpNum)){
				this.submitBtn = true;
			}

			//获取提交信息
			this.subProps = [];
			for(var k in subObj){
				var flag = true;
				for(var i=0;i<this.subProps.length;i++){
					if(this.subProps[i].propid == subObj[k].propid){
						flag = false;
					}
				}
				if(flag){
					this.subProps.push(subObj[k]);
				}
			}
			this.recyclesaveasse.assement = saveasse;
			this.recyclesaveasse.subObj = subObj;
		},
		parentSelectCheckbox(subObj,saveasse) {
			this.subProps = [];
			for(var k in subObj){
				var flag = true;
				for(var i=0;i<this.subProps.length;i++){
					if(this.subProps[i].propid == subObj[k].propid){
						flag = false;
					}
				}
				if(flag){
					this.subProps.push(subObj[k]);
				}
			}
			this.recyclesaveasse.assement = saveasse;
			this.recyclesaveasse.subObj = subObj;
		},
		//获取在线地区码
		getDivisionCode() {
			let that = this,arcode = null;
			let ls = window.localStorage;
			arcode = ls.getItem('location') ? JSON.parse(ls.getItem('location')).arcode : 110101; //地区码
			util.api({
				surl: root.Area_API_PATH + 'convertArcode',
				data: {
					arcode: arcode
				},
				type: 'get',
				success: function(res) {
					switch(res.rpco) {
						case 200:
							var body = res.body || {};
							// 渲染
							body.divisionCode && (that.arcode = body.divisionCode);
							break;
						default:
							util.tip('服务器繁忙，请稍后再试')
					}
				},
				error: function() {}
			});


		},
		//估值信息
	    getAssement(ev) {
            ripple(ev);
	    	if(!this.submitBtn){
	    		util.tip('选择手机基本估价信息后可提交',2000);
	    		return false;
	    	}

	        let that = this,
	        	hrefParma = this.hrefParma,
	        	opt = this.subProps;

            // debugger
            // let res ={"rpco":200,"tsrp":1492229249414,"body":{"arcode":110114,"prodid":16,"prodnm":"iPhone 5S","brdnm":"苹果","price":0}}
            //  that.tempOrderSubmit(opt,res);
            //  return;
	        util.api({
	            surl: root.RECYCLE_API_PATH +'quotation'/*'/recycle/yf2/quotation'*/,
	            data: {
	                arcode: that.arcode,
	                prodid: hrefParma.proid,
	                props: opt
	            },
	            success: function(res) {
	            	console.log(opt)
	            	console.log(res)
	                switch(res.rpco) {
	                        case 200:
	                            // 渲染
	                            that.tempOrderSubmit(opt, res);
	                            break;
	                        case 404:
	                            util.tip('服务器繁忙，请稍后再试',2000)
	                            break;
	                        case 500:
	                            util.tip('服务器繁忙，请稍后再试',2000)
	                            break;
	                        case 40003:
	                            util.tip('留言至多100个字',2000)
	                            break;
	                        case 40004:
	                            util.tip('服务器繁忙，请稍后再试',2000)
	                            break;
	                        case 40005:
	                            util.tip('很抱歉，该地区暂未开通此项服务',2000)
	                            break;
	                        case 40008:
	                            that.tempOrderSubmit(opt, res);
	                            break;
	                        case 40009:
	                            that.tempOrderSubmit(opt, res);
	                            break;
	                        default:
	                            util.tip('请求失败')
	                    }
	            },
	            error: function() {}
	        });
	    },
		tempOrderSubmit(opt, res) {
        	var that = this,
            	hrefParma = this.hrefParma,
            	price,
            	ss = window.sessionStorage;
            	opt.catename = encodeURI(that.hrefParma.catename);
            	ss.setItem("recyclesaveasse",JSON.stringify(this.recyclesaveasse));


            if(res.rpco===40009||res.rpco===40008){price=0}else{price=res.body.price}
            	// debugger start
            	// opt=$.extend({},that.hrefParma);
            	// util.href('./recyclesubmit.html', opt);
            	// return;
				// debugger end

        	util.api({
	            surl: root.RECYCLE_API_PATH +'saveTempOrder',
	            data: {
	                arcode: hrefParma.arcode,
	                prodid: hrefParma.proid,
	                props:opt,
	                price: price
	            },
	            success: function(res) {
	                let oid = res.body.oid;
	                let obj= that.hrefParma;
	                let opt=$.extend({oid: oid},obj);
	                if (res.rpco === 200) {
	                    if(hrefParma.pageid==2){
	                        util.href('./quickappoint.html', {
	                            pageid:hrefParma.pageid
	                        });
	                    }
	                    util.href('./recyclesubmit.html', opt);
	                }
	            }
	        });

    	}
	},
	components: {
		headerComponent,
		serviceSteps,
		recycle,
		serverFlow
	}
}
</script>
<style lang="less">
	@import '../../util/fs.less';
	.recycle-wapper{
		padding-bottom: 1.306667rem;
	}
	.progress{
		width:100%;
		height: 0.266667rem;
		overflow: hidden;
	    background-color: #F5F5F5;
	    .progress-bar {
		    position: fixed;
		    z-index: 99999;
		    width: 5%;
		    height: 0.266667rem;
		    text-align: right;
		    /*color: #fff;*/
		    border-radius: 0 0.266667rem 0.266667rem 0;
		    background-color: #ffea00;
		    label {
			    position: absolute;
			    top: 0;
			    right: 0.2rem;
			    z-index: 101;
			    height: 0.266667rem;
			    line-height: 0.293333rem;
			    .mixinfont(10px);
			    color:#333;
			}

		}
	}
	footer{
		position: fixed!important;
		left: 0;
		bottom: 0;
		z-index: 1000;
		width: 100%;
		height: 1.306667rem;
		line-height: 1.306667rem;
		text-align: center;
		background-color: #E0E0E0;

		.mixinfont(16px);
		a {
			display: block;
			color: #fff;
		}
		&.on{
			background-color: #ff4b46;
		}
	}



</style>