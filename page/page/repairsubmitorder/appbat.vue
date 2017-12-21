<template>
	<div  class="wapper recycle-wapper" >
		<header-component :title= "title"></header-component>
		<!-- <service-steps v-show="containerShow" :active=3 :sertype=0></service-steps> -->
        <serve-flowrepair v-show="containerShow" :active= 4 :sertype=0></serve-flowrepair>

		<ul class="list-labelvalue" v-show="containerShow">
            <li class="i1">
                <label>设备</label>
                <span class="value">{{decodeURIComponent(hrefParma.catename)}}</span>
            </li>
            <li class="i1" >
                <label>品牌</label>
                <span class="value">{{hrefParma.brdnm}}</span>
            </li>
            <li class="i1" >
                <label>型号</label>
                <span class="value">{{hrefParma.attrnm}}</span>
            </li>
        </ul>
        <div v-show="containerShow" class="fault-detail">
        	<h2>
        		<span>故障详情</span>
        		<a class="add-fault" @click="changeFault" href="javascript:;">添加故障</a>
        	</h2>
        	<ul class="list-labelvalue" v-show="containerShow">
	            <li class="i1" v-for="(item, index) in faults">
	                <label>故障{{index+1}}：{{item.mlfnm}}</label>
	                <span @click='delFault(index)' class="del"></span>
	            </li>
	            <li class="repairprice" v-show="priceShow" >
	                <label>合计：<span class="repprice">{{recycleResult.price}} </span><i>(服务完成后支付)</i></label>
	            </li>
	        </ul>
        </div>
        <cou-pon :couponinfo="couPonInfo"></cou-pon>
		<submitinfo :page="page"  @getaddr='getAssement' @changecontainer='changeContainer'  @changecon='changeCon' @setmas="setMas"></submitinfo>
		<footer v-show="containerShow" :class="{'on':submitOn}"  @click="orderSubmit">提交订单</footer>
		<recycle-info-checkbox  :fault='fault' :subfault='faultid' @closefault="closeFault" @submitfault="getSolution" v-if="faultsShow" ></recycle-info-checkbox>

	</div>
</template>

<script type="ecma6.0">
import headerComponent from '../../components/HeaderComponent'
// import serviceSteps from '../../components/ServiceSteps'
import serveFlowrepair from '../../components/ServeFlowrepair'
import couPon from './CouPon'
import submitinfo from '../../components/Submitinfo'
import recycleInfoCheckbox from './recycleinfocheckbox'
let root = window || {},
    util = root.util || {};
export default {
	data(){
		return{
            couPonInfo:{
                copp:"",
                copnum:"",
                enable:"",
                disable:"",
                conTF:false
            },
			hrefParma:{},
			title:"",
			containerShow:true,
			recycleResult:{
				brdnm:"",
				prodnm:"",
				price:"",
                area:""
			},
			page:'repair1',
			submitOn: false,
			submitObj:{},
			addr: false,
			attrgrps:[],
			fault:[],
			faults: [],
			faultsShow:false,
			faultid:[],
            copnum:'',
            copp:null,
            priceShow:false
		}
	},
	created() {
		this.hrefParma = util.getHrefParma();
		this.title = this.hrefParma.brdnm +" "+this.hrefParma.attrnm;
		if(window.decodeURIComponent(this.hrefParma.catename)=="手机"){
			this.priceShow = true;
		}
		this.submitObj.tsup = this.hrefParma.tsup;
		this._getTempOrder(this.hrefParma.oid);
		this._getFault();
		let ss = window.sessionStorage;
		if(!!ss.getItem("repairsaveasse")){
			ss.removeItem("repairsaveasse");
		}
	},
	methods:{
        // 获取优惠劵
        _getCouPon() {
            var that = this,
                hrefParma = util.getHrefParma(),
                data = {
                    macbl:[{
                        odTp:1,
                        cgcd:hrefParma.eacid,
                        dvcd:hrefParma.mdld,
                        rgcd:that.recycleResult.area,
                        sgpl:that.recycleResult.price
                    }]
                };

            util.api({
                surl:root.MB_API_PATH + 'getMaxAvailableCoupon',
                data:data,
                success:function(res) {
                    var rpco = res.rpco,
                        body = res.body;

                    switch(rpco) {
                        case 200:
                            body.disable = util.formateDate(parseInt(body.disable));
                            that.couPonInfo = body;
                            that.couPonInfo.conTF = true;
                        //     let price = (res.body.tprice/100).toFixed(2);
                       	// that.recycleResult.price = price > 0 ? '￥'+price : '待检测后报价'
                            if(that.recycleResult.price==-0.01){

					        }else{
					        }
                            break;
                        case 40002:
                            that.couPonInfo.conTF = false;
                            break;
                    }
                }
            });
        },
		// 获取临时订单
		_getTempOrder(oid) {
	        var that = this,
	        	hrefParma = this.hrefParma,
	        	surl = root.REPAIR_API_PATH+'getTempOrder?oid=' +oid;
	        	if(!hrefParma.oid){return false}

	        util.api({
	        	surl: surl,
	        	type: 'get',
	        	success(res) {
	        		if (res.rpco === 200) {
	        			console.log(res.body.mlfs)
	        			$.each(res.body.attrgrps,(i,item)=>{
	        				delete item.attrnm;
	        			})
	        			that.attrgrps = res.body.attrgrps;
	        			that.faults = res.body.mlfs;
                        let price = (res.body.tprice/100).toFixed(2);
                       	if(price>0){
                       		that.recycleResult.price = '￥'+price;
                       	}else if(price==0){
                       		that.recycleResult.price = "";
                       	}else{
                       		that.recycleResult.price = "待检测后报价";
                       	}
                        that._getCouPon();
		            }else if(res.rpco=== 404){
		                util.href('recycleindex.html',{type:1});
		            }else{
		            	util.tip("网络异常，请稍后再试");
		            }
	        	}

	        })
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
	                		$.each(item.subs,(i,val)=>{
		                		for(var k =0; k<that.faults.length;k++){
                					if(that.faults[k].mlfnm == val.mlfnm){
	                					val.on = true;
	                					that.faultid.push(val.mlfid);
	                					break;
	                				}else{
	                					val.on = false;
	                				}
		                		}
		                		that.fault.push(val);
	                		})
	                	})
	                	console.log(that.fault)
	                }
	            },
	            error: function(res) {
	            }
	        });
		},
		// 刷新故障
		_refreshFault() {
			let newFault = [],newFaultid = [],
				that = this;
			$.each(that.fault,(i,val)=>{
				if(that.faults.length>0){
					for(var k =0; k<that.faults.length;k++){
						if(that.faults[k].mlfnm == val.mlfnm){
	    					val.on = true;
	    					newFaultid.push(val.mlfid);
	    					break;
	    				}else{
	    					val.on = false;
	    				}
	        		}
				}else{
					val.on = false;
				}
        		newFault.push(val);
    		})
    		this.fault = newFault;
    		this.faultid = newFaultid;
    		if(this.submitObj.tsup && this.submitObj.timeStamp && this.addr && this.faults.length>0){
            	this.submitOn = true;
            }
		},
		// 获取解决方案
		getSolution(res){
			this.faultid = res || this.faultid;
			let that = this;
			let data = {
				mdld: that.hrefParma.mdld,
				eacid: that.hrefParma.eacid,
				brdid: that.hrefParma.brdid,
				attrsjson:{"attrs": that.attrgrps} ,
				mlfidsjson: that.faultid
			}
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
		// 提交临时订单
		tempOrderSubmit(res) {
        	var that = this,
            	hrefParma = this.hrefParma,
            	obj={},
            	saveobj=[];
            	if(res.length == 0){
            		saveobj=[];
            	}else{
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
            	}

        	util.api({
	            surl: root.REPAIR_API_PATH+'saveTempOrder',
	            data: {
	                mdld: that.hrefParma.mdld,
					eacid: that.hrefParma.eacid,
					brdid: that.hrefParma.brdid,
					attrsjson: {'attrs':that.attrgrps},
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

    	},
    	//选择完地址判断
    	getAssement(res) {
        	console.log(res)
            this.recycleResult.area = res.area;
            this._getCouPon();
        	if(res.area){this.addr = true}
        	if(this.submitObj.tsup && this.submitObj.timeStamp && this.addr && this.faults.length>0){
            	this.submitOn = true;
            }
    	},
    	// 选择时间页面切换
		changeContainer(flag,val) {
            this._getCouPon();
			this.containerShow = flag;
			this.submitObj.timeStamp = val.timeStamp;
			this.submitObj.isSaveTime = val.isSaveTime;
			if(this.submitObj.tsup && this.submitObj.timeStamp && this.addr && this.faults.length>0){
            	this.submitOn = true;
            }
			console.log(this.submitObj)
		},
		changeCon(flag){
			this.containerShow = flag;
		},
		//设置留言
		setMas(str){
			this.submitObj.mas = str;
			let EMJi_REG = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
            if(EMJi_REG.test(this.submitObj.mas)){
				this.submitOn = false;
			}else{
				if(this.submitObj.tsup && this.submitObj.timeStamp && this.addr && this.faults.length>0){
	            	this.submitOn = true;
	            }
			}
		},
		//删除故障
		delFault(index) {
			let that = this;
			util.alert('确定要删除么？', {
                justOk: false,
                okFn: function() {
                		that.faults.splice(index, 1)
						that.faultid.splice(index, 1)
						that._refreshFault();
                	if(that.faultid.length>0){
						that.getSolution();
                	}else{
                		that.tempOrderSubmit([]);
                		return false;
                	}

                }
            });
		},
		// 打开故障表
		changeFault() {
			this.faultsShow = true;
		},
		// 关闭故障列表
		closeFault() {
			this.faultsShow = false;
		},
 		// 提交订单
		orderSubmit() {
			if(!this.submitOn) return;
	        let that = this,
	            hrefParma = this.hrefParma,
	            ls=window.localStorage,
	            tempOrdId=[],
	            surl,
	            data;
	        // 起止時間
	       	let yuan = new Date(this.submitObj.isSaveTime.substr(0,10));
            let aptstart = yuan*1;
			let aptend = new Date(yuan.getFullYear(),yuan.getMonth(),(yuan.getDate()+1))*1;
	        surl = root.REPAIR_API_PATH + 'saveOrder';
	        tempOrdId.push(hrefParma.oid);
	        data = {
	        	addr: this.submitObj.tsup,
	        	aptstart: aptstart,
	        	aptend: aptend,
	        	msg: this.submitObj.mas,
	        	tempoids: tempOrdId,
                cop:{
                    copnum:that.copnum,
                    copp:that.copp
                }
	        };
	  	    util.api({
	        	surl: surl,
	        	data: data,
	        	success(res) {
	        		 if (res.rpco === 200) {
		                //订单提交成功页面
		                util.href('appointresult.html',{
		                    oid:res.body.oid,
		                    dodt:res.body.dodt,
		                    odtype:res.body.odtype,
		                    type:1
		                });
		            }else if(res.rpco === 40006){
		                util.tip('留言最多输入100字')
		            }else if(res.rpco === 40011){
                        util.tip('很抱歉，该地区暂未开通此项服务',2000)
		            }else{
		            	util.tip('服务器繁忙，请稍后再试',2000)
		            }
	        	}
	        })
	    }
	},
	components: {
		headerComponent,
		// serviceSteps,
        serveFlowrepair,
        couPon,
		submitinfo,
		recycleInfoCheckbox
	}
}
</script>
<style lang="less">
	@import '../../util/fs.less';
	.recycle-wapper{
		padding-bottom: 1.333333rem;
	}
	.fault-detail{
		margin-top: 0.266667rem;
		background-color: #fff;
		h2{
			position: relative;
			line-height: 1.173333rem;
        	padding:0  0.32rem;
        	.mixinfont(14px);
        	color:#333;
            border-bottom: 1px solid rgba(227,227,227,.4);
            .add-fault{
            	float: right;
            	width: 2.08rem;
            	height: 0.733333rem;
            	border: 1px solid #ff4b46;
            	border-radius: 0.08rem;
            	line-height: 0.733333rem;
            	text-align: center;
            	color: #ff4b46;
            	margin-top: 0.2rem;
            }
		};
		.list-labelvalue li {
			color: #777777;
			.mixinfont(12px);
			.del{
				float: right;
				width: 0.426667rem;
				height:  0.426667rem;
				background:url(img/error.png) no-repeat;
				background-size: 0.426667rem 0.426667rem;
				margin-top: 0.36rem;
			}
			&.repairprice{
				.mixinfont(14px);
				color:#333;
				i{
					color: #d0d0d0;
					.mixinfont(12px);
				};
				.repprice {
					color: #ff4b46;
				};
			}
		}

	}

	footer{
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 9999;
		width: 100%;
		height: 1.306667rem;
		line-height: 1.306667rem;
		text-align: center;
		background-color: #E0E0E0;
		color: #fff;
		.mixinfont(16px);
		&.on{
			background-color: #ff4b46;
		}
	}
</style>