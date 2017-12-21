<template>
	<div class="wapper recycle-wapper" >
		<!-- 公共头部 -->
		<header-component :title="title"></header-component>
		<!-- 回收状态 -->
		<!-- <service-steps :active=2 :sertype=0></service-steps> -->
		<serve-flowrepair :active= 3 :sertype=0></serve-flowrepair>

		<!-- 属性 -->
		<recycle :assement= 'assement' :subobj="subObj" @select='parentSelect'></recycle>
		<!-- 故障 -->
		<recycle-checkbox :fault = 'fault' :subfault='subFault' @selectcheckbox="parentSelectCheckbox"></recycle-checkbox>
		<!-- 提交 -->
    	<footer :class="{'on': submitBtn}"><a @click="getSolution" href="javascript:;">确定</a></footer>
	</div>

</template>

<script type="ecma6.0">
import headerComponent from '../../components/HeaderComponent'
// import serviceSteps from '../../components/ServiceSteps'
import serveFlowrepair from '../../components/ServeFlowrepair'
import recycle from './recycleinfo.vue'
import recycleCheckbox from './recycleinfocheckbox.vue'
// import footerComponent from '../../components/FootPortion.vue'
let root = window || {},
    util = root.util || {};
export default {
	data () {
		return {
			hrefParma:{},
			title:"",
			assement: [],
			checkBtn:false,
			submitBtn:false,
			subProps:[],
			subObj:{},
			attrsjson:'',
			subFault:[],
			priceArr:[],
			fault:[],
			repairsaveasse:{
				attrs:[],
				faults:[]
			}
		}
	},
	created() {
		this.hrefParma = util.getHrefParma();
		this.title = this.hrefParma.brdnm +" "+ this.hrefParma.attrnm;
		let ss = window.sessionStorage;
		if(!!ss.getItem("repairsaveasse")){
			var repairdata = JSON.parse(ss.getItem("repairsaveasse"));
			this.assement = repairdata.attrs;
			this.fault = repairdata.faults;
			this.submitBtn = true;
			this.checkBtn = true;
			this.subObj = repairdata.subObj;
			this.subProps = [];
			for(var k in repairdata.subObj){
				this.subProps.push(repairdata.subObj[k]);
			}
			$.each(repairdata.faults,(i,item)=>{
	    		if(item.on){
	    			this.subFault.push(item.mlfid);
	    		}
	    	})
	    	console.log(repairdata)
	    	// console.log(this.subObj);
			// ss.removeItem("repairsaveasse");
			// console.log(repairdata);
			return;
		}
		this._getRecInfo();
		this._getFault();
	},
	methods: {
		// 获取属性信息
		_getRecInfo() {
			var that = this,
			hrefParma = this.hrefParma;
			util.api({
	            surl:root.REPAIR_API_PATH+'queryModelsByBrand?arcode='+ hrefParma.arcode +'&eacid='+ hrefParma.eacid +'&brdid='+hrefParma.brdid,
	            type: 'get',
	            success: function(res) {
	            	let assement=null;
	                if (res.rpco === 200) {
	                	console.log(res.body.models)
	                	$.each(res.body.models,(index,item)=>{
	                		console.log(item)
	                		if(item.mdld == that.hrefParma.mdld){
	                			assement = item.attrgrps;
	                		};
	                	})
	                	$.each(assement,(index,item)=>{
	                		// 故障标题内容
	                		item.tit = "";
	                		item.select = false;
	                		// 单个故障选中状态
	                		$.each(item.attrs,(i,val)=>{
	                				val.on = false;
	                		})
	                	})
	                    that.assement = assement;
	                }
	            },
	            error: function(res) {
	            }
	        });
		},
		// 获取故障信息
		_getFault() {
			let that = this,
				surl = root.REPAIR_API_PATH+'malfunction?brdid='+this.hrefParma.brdid+'&&eacid='+this.hrefParma.eacid +'&&mdld='+this.hrefParma.mdld;
			util.api({
	            surl: surl,
	            type: 'post',
	            data:{
	            	brdid:this.hrefParma.brdid,
	            	eacid:this.hrefParma.eacid,
	            	mdld:this.hrefParma.mdld,
	            	attrsjson:{"attrs":[{"attrgrpid":null,"attrid":null}]}
	            },
	            success: function(res) {
	            	console.log(res);
	            	if (res.rpco === 200) {
	                	$.each(res.body.mlfs,(index,item)=>{
	                		item.on = false;
	                		that.fault.push(item);
	                		// $.each(item.subs,(i,val)=>{
	                		// 	val.on = false;
	                		// 	that.fault.push(val);
	                		// })
	                	})
	                }
	            },
	            error: function(res) {
	            }
	        });
		},
		// 获取报价信息
		_getPrice() {
			let that = this;
			var res = {
			    "eacid": 12,
			    "eacnm": "手机",
			    "brands": [
			        {
			            "brdid": 8,
			            "brdnm": "苹果",
			            "catas": [
			                {
			                    "level": "大修",
			                    "price": 30,
			                    "attrs": [
			                        {
			                            "attrnm": "屏幕",
			                            "price": "299"
			                        },
			                        {
			                            "attrnm": "手机壳",
			                            "price": "89"
			                        }
			                    ]
			                },
			                {
			                    "level": "小修",
			                     "price": 100,
			                    "attrs": [
			                        {
			                            "attrnm": "屏保",
			                            "price": "59"
			                        },
			                        {
			                            "attrnm": "喷漆",
			                            "price": "39"
			                        }
			                    ]
			                }
			            ]
			        }
			    ]
			}
			that.priceArr = res.brands[0].catas;
			console.log(that.priceArr)
		},
		// 获取解决方案
		getSolution(){
			if(!this.submitBtn){return false};
			let that = this;
			let data = {
				mdld: that.hrefParma.mdld,
				eacid: that.hrefParma.eacid,
				brdid: that.hrefParma.brdid,
				attrsjson: {'attrs':that.subProps},
				mlfidsjson: that.subFault
			}

			let ss = window.sessionStorage;
            	ss.setItem("repairsaveasse",JSON.stringify(this.repairsaveasse));
			util.api({
				surl:root.REPAIR_API_PATH+'solution?mdld='+that.hrefParma.mdld+'&&eacid='+that.hrefParma.eacid+'&&brdid='+that.hrefParma.brdid,
				method:'post',
				data:data,
				success(res) {
					 switch(res.rpco) {
                        case 200:
                            // 渲染
                            that.tempOrderSubmit(res.body);
                            break;
                        default:
                            util.tip('服务器繁忙，请稍后再试')
                    }
				}
			})
		},
		// 处理单选数据
		parentSelect(len,subObj,repairsaveasse) {
			// 提交按钮
			this.checkBtn = len == this.assement.length ? true : false;
			if(this.checkBtn && this.subFault.length>0){
				this.submitBtn = true;
			}
			//获取提交信息
			this.subProps = [];
			for(var k in subObj){
				this.subProps.push(subObj[k]);
			}
			this.repairsaveasse.subObj = subObj;
			this.repairsaveasse.attrs = repairsaveasse;
			console.log(this.repairsaveasse)
		},
		// 处理多选数据
		parentSelectCheckbox(subObj,repairsaveasse) {
			this.subFault = subObj;
			if(this.checkBtn && !this.subFault.length<=0){
				this.submitBtn = true;
			}else{
				this.submitBtn = false;
			}
			this.repairsaveasse.faults = repairsaveasse;
			console.log(this.repairsaveasse)

		},
		// 提交临时订单
		tempOrderSubmit(res) {
			if(!this.submitBtn){return false};
        	var that = this,
            	hrefParma = this.hrefParma,
            	obj={},
            	saveobj=[];
            	if(res.solns.length!=1){
		            for(var i=0;i<res.solns.length;i++){
		                 obj={
		                    "gpid":res.solns[i].groupId,
		                    "solnid":res.solns[i].solnid,
		                    "mlfid":res.solns[i].mlfid
		                }
		                saveobj.push(obj)
		            }
		        }else{
		             obj={
		                    "gpid":res.solns[0].groupId,
		                    "solnid":res.solns[0].solnid,
		                    "mlfid":res.solns[0].mlfid
		                }
		           saveobj.push(obj)
		        }
        	util.api({
	            surl: root.REPAIR_API_PATH+'saveTempOrder',
	            data: {
	                mdld: that.hrefParma.mdld,
					eacid: that.hrefParma.eacid,
					brdid: that.hrefParma.brdid,
					attrsjson: {'attrs':that.subProps},
					solnjson: {'solnmap':saveobj}
	            },
	            success: function(res) {
	                if (res.rpco === 200) {
	                    that.hrefParma.oid = res.body.tempoid;
                        util.href('./repairsubmit.html',that.hrefParma);
	                }else{
	                	 util.tip('服务器繁忙，请稍后再试',2000)
	                }

	            }
	        });

    	}
	},
	components: {
		headerComponent,
		// serviceSteps,
		serveFlowrepair,
		recycle,
		recycleCheckbox
	}
}
</script>
<style lang="less">
	@import '../../util/fs.less';
	.progress{
		/*border-top: 1px solid #ccc;*/
	    border-bottom: 1px solid #ccc;
	    background-color: #F5F5F5;
	    .progress-bar {
		    position: relative;
		    width: 5%;
		    height: 0.266667rem;
		    text-align: right;
		    color: #fff;
		    border-radius: 0 0.266667rem 0.266667rem 0;
		    background-color: #ff4b46;
		    label {
			    position: absolute;
			    top: 0;
			    right: 0.2rem;
			    z-index: 101;
			    height: 0.266667rem;
			    line-height: 0.266667rem;
			    .mixinfont(11px);
			}

		}
	}
	footer{
		position: fixed;
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