<template>
    <!-- <div  class="wapper recycle-wapper" v-if="isshow"> -->

    <div  class="wapper recycle-wapper" v-if="repairType==2&&isService==0">
        <header-component v-show="containerShow" :title= "title"></header-component>
        <div class="proInfo" v-show="containerShow">
            <div class="proImg"><img :src="headIcon" :onerror="defaultImg"></div>
            <div class="proCon">
                <p>{{hrefParma.gdnm}}</p>
                <p class="ptxt"><span>¥</span><i>{{hrefParma.amount?hrefParma.amount:0}}</i></p>
                <p class="ptxt">购买时间：{{hrefParma.dodt | formatDt}}</p>
            </div>
            <div class="proNum">X{{hrefParma.gdnu?hrefParma.gdnu:0}}</div>
        </div>
        <div class="noServiceWapper">
            <div class="noServiceContent">
                <div class="imgWrapper"><img src="//gfs11.gomein.net.cn/T1xwx_BmVT1RCvBVdK.png"></div>
                <p>订单无法提供服务</p>
                <a :href="phone">联系厂家</a>
            </div>
            <div class="info">商品暂时无法提供预约服务，建议您拨打400电话，联系厂商沟通相关服务</div>
        </div>

    </div>
	<div  class="wapper recycle-wapper" v-else>
		<header-component v-show="containerShow" :title= "title"></header-component>
		<!-- <service-steps v-show="containerShow" :active=3 :sertype=0></service-steps> -->
        <serve-flowrepair v-show="containerShow" :active= 4 :sertype=0></serve-flowrepair>
        <div class="proInfo" v-show="containerShow">
            <div class="proImg"><img :src="headIcon" :onerror="defaultImg"></div>
            <div class="proCon">
                <p>{{hrefParma.gdnm}}</p>
                <p class="ptxt"><span>¥</span><i>{{hrefParma.amount?hrefParma.amount:0}}</i></p>
                <p class="ptxt">购买时间：{{hrefParma.dodt | formatDt}}</p>
            </div>
            <div class="proNum">X{{hrefParma.gdnu?hrefParma.gdnu:0}}</div>
        </div>
		<ul class="list-labelvalue  mt20" id="list-brand" heh='1' v-show="containerShow" v-if="repairType==1&&isService==1">
            <li class="i1 bdr-bottom" >
                <div class="liCon">
                    <label>服务类型</label>
                    <span class="value">保修期内</span>
                </div>
                <p class="conTxt">
                    此次服务为保修期内维修服务，如您的设备非人为损坏等问题，此次服务为免费服务
                </p>
            </li>
        </ul>
        <ul class="list-labelvalue  mt20" id="list-brand" heh='2' v-show="containerShow" v-else-if="repairType==1&&isService==0">
            <li class="i1 bdr-bottom" >
                <div class="liCon">
                    <label>服务类型</label>
                    <span class="value">服务商维修</span>
                </div>
                <p class="conTxt">
                    当前订单暂未对接厂家，如继续维修将由服务商提供，会导致无法继续保内维修，或您可以选择拨打厂家电话
                </p>
            </li>
            <li class="i1 bdr-bottom">
                <div class="liCon">
                    <label>厂家电话</label>
                    <a :href="'tel:'+phone" class="tel value">{{phone}}</span>
                </div>
            </li>
        </ul>
        <ul class="list-labelvalue  mt20" id="list-brand" heh='3' v-show="containerShow" v-else-if="repairType==2&&isService==1">
            <li class="i1 bdr-bottom" >
                <div class="liCon">
                    <label>服务类型</label>
                    <span class="value">服务商维修</span>
                </div>
                <p class="conTxt">
                    当前订单超出保修期，将由服务商为您提供上门维修服务，此次维修为付费维修服务
                </p>
            </li>
        </ul>
        <div v-show="containerShow" class="fault-detail bdr-top">
        	<h2 class="bdr-bottom">
        		<span>故障类型</span>
        		<a class="add-fault" v-if="faults.length!=0"  @click="changeFault" href="javascript:;">修改</a>
                <a class="add-fault" v-if="faults.length==0"  @click="changeFault" href="javascript:;">请选择故障</a>
        	</h2>
        	<ul class="list-labelvalue" v-show="containerShow">
                <li class="i1 bdr-bottom" v-for="(item, index) in faults">
                    <label>故障{{index+1}}：{{item.mlfnm}}</label>
                    <span @click='delFault(index)' class="del"></span>
                </li>
                <li class="repairprice" v-show="priceShow" >
                    <label>合计：<span class="repprice">{{recycleResult.price}} </span><i>(服务完成后支付)</i></label>
                </li>
	        </ul>
        </div>

        <message v-show="containerShow" @onmsg="setMas" :msg="submitObj.mas"></message>
        <Upload v-show="containerShow" @watchupload="uploadImg" ref="hximglist"></Upload>
        <div class="fault-detail mt20" v-show="containerShow">
            <h2 class="bdr-bottom">
                <span>服务类型</span>
            </h2>
            <ul class="service-type bdr-bottom">
                <li class="active">上门维修</li>
            </ul>
        </div>
        <cou-pon :couponinfo="couPonInfo" v-show="containerShow && couPonInfo.conTF"></cou-pon>
		<repair-submitinfo :page="page"  @getaddr='getAssement' @changecontainer='changeContainer'  @changecon='changeCon' @choose='chooseaddr' :tsup="submitObj.tsup"></repair-submitinfo>

		<footer v-show="containerShow" v-if="isMdevice" class="waves" :class="{'on':submitObj.tsup && submitObj.timeStamp && faults.length>0}"  @click="orderSubmit($event)">提交订单</footer>
        <footer v-show="containerShow"  v-else class="waves" :class="{'on':submitObj.tsup && submitObj.timeStamp && faults.length>0}"  @click="orderSubmit($event)">提交订单</footer>
		<recycle-info-checkbox  :fault='fault' :subfault='faultid' @closefault="closeFault" @submitfault="getSolution" v-if="faultsShow" ></recycle-info-checkbox>
        <p class="remarks" v-show="containerShow">提交订单后将有售后人员与您电话沟通，请保持手机畅通</p>
	</div>
</template>

<script  type="text/ecmascript-6">
import headerComponent from '../../components/HeaderComponent'
// import serviceSteps from '../../components/ServiceSteps'
import serveFlowrepair from '../../components/ServeFlowrepair'
import couPon from './CouPon'
import repairSubmitinfo from '../../components/repairSubmitinfo'
import message from "../../components/message";
import Upload from '../../components/upload.vue';

import recycleInfoCheckbox from './recycleinfocheckbox'
let root = window || {},
    util = root.util || {};
let saveOd = true;
export default {
	data(){
		return{
            isshow:true,
            headIcon:'//gfs13.gomein.net.cn/T1.ZYQBChT1RCvBVdK.png',
            defaultImg: 'this.src="//gfs13.gomein.net.cn/T1.ZYQBChT1RCvBVdK.png"',
            couPonInfo:{
                copp:'',
                copnum:'',
                couat:'',
                coumat:'',
                enable:'',
                disable:'',
                conTF:false
            },
            oid:'',
            hrefParma: util.getHrefParma(),
			title:"",
			containerShow:true,
			recycleResult:{
				brdnm:"",
				prodnm:"",
				price:"",
                area:"",
                countPrice:""

			},
            brdnm:"",
            prodnm:"",
            price:"",
            area:"",
            countPrice:"",

			page:'repairorder',
			submitOn:true,
			submitObj:{
                mas:'',
                devimgs:[]
            },
			addr: false,
			attrgrps:[],
			fault:[],
			faults: [],
			faultsShow:false,
			faultid:[],
            priceShow:false,
            origin:"",
            mdld: '',
            eacid: '',
            brdid: '',
            repairType:'',
            isService:'',
            phone:'',
            tel:'tel:'+this.phone,
	                isMdevice:true,

		}
	},
	created() {
        let ss = window.localStorage;
        if (!!ss.getItem("repair")) {
            var savecleanrepair = JSON.parse(ss.getItem("repair"));
            this.submitObj = savecleanrepair || {};//回显
            this.$nextTick(function(){
                this.$refs.hximglist.getPic(this.submitObj.devimgs);
            })
            this.faults=this.submitObj.faults;
            this.oid = this.submitObj.oid;
            ss.removeItem("repair");
          }
        if(this.catename== '手机' || this.catename == '平板' || this.catename == '电脑'){
            this.isMdevice = true

        }else{
            this.isMdevice = false

        }
		this.hrefParma = util.getHrefParma();
		this.title = this.hrefParma.brdnm +" "+this.hrefParma.attrnm;
		if(window.BPConfig.channel!=undefined){
            this.origin=window.BPConfig.channel
        }
		if(window.decodeURIComponent(this.hrefParma.catename)=="手机"){
			this.priceShow = true;
		}
		 if(this.hrefParma.tsup){
	            this.submitObj.tsup = this.hrefParma.tsup
	        } else{
	            this._setaddr()
	        }
		this._getProductInfo();
        // this._getTempOrder(this.hrefParma.oid);
		if(!!ss.getItem("repairsaveasse")){
			ss.removeItem("repairsaveasse");
		}

        let _this = this,
            catename = decodeURI(_this.hrefParma.catename);
        this._getHeadIcon();
        if(util.isApp()){
          util.deleteHeadBtn();
        }
	},
    filters: {
        formatDt:function (val) {
            if (val == '') {
                return '';
                return false;
            }
            return util.formateDate(parseInt(val),'yyyy-MM-dd');
        }
    },
	methods:{

        _formatDt:function (val) {
            if (val == '') {
                return '';
                return false;
            }
            return util.formateDate(parseInt(val),'yyyy-MM-dd');
        },

        _setaddr(){
            var that = this,
            hrefParma = util.getHrefParma();
            util.api({
                surl:root.USER_API_PATH + 'getDefAddr',
                type: 'get',
                success:function(res) {
                    var rpco = res.rpco,
                        body = res.body;
                    if(rpco==200){
                        that.submitObj.tsup = body.tsup;
                        // that.tsup = body.tsup;
                        // util.setHrefParma(window.location.href,{tsup:body.tsup});
                    }

                }
            });
        },
        //跳转品牌选择页
        repairelse(){
            let catename = decodeURI(this.catename);
            if (catename== '手机' || catename == '平板' || catename == '电脑') {
                util.href("repairbrand.html", {
                  eacid: this.eacid,
                  eacnm: decodeURIComponent(this.catename),
                  arcode:this.hrefParma.arcode
                });
            } else{
                util.href("repairelse.html", {
                  eacid: this.eacid,
                  eacnm: this.catename,
                  arcode:this.hrefParma.arcode
                });
            }
        },
        chooseaddr(tsup){
            this.submitObj.tsup = tsup;
            this.submitObj.faults = this.faults;
            let ss=window.localStorage;
            ss.setItem('repair',JSON.stringify(this.submitObj));
        },
        uploadImg(ImgList) {
          this.submitObj.devimgs=ImgList[0];
          // let ss=window.localStorage;
          // ss.setItem('devimgs',this.submitObj.devimgs);

        },
        // 点击资产列表
        fnAslist(catno,brdno,mdno,goodsId) {
            // 点击储存
            if (goodsId == this.asParameter.goodsId) {
                this.asParameter = {
                    catno:'',
                    brdno:'',
                    mdno:'',
                    goodsId:''
                };
            }else{
                this.asParameter = {
                    catno:catno,
                    brdno:brdno,
                    mdno:mdno,
                    goodsId:goodsId
                };
            };
        },
        // 点击资产按钮关闭
        fnClose() {
            this.aslistTF = false;
        },
        // 我的资产确定按钮
        fnConfirm(ev) {
            let _this = this;
            _this.aslistTF = false;
            _this.asParameter_ = _this.asParameter;
            _this._save();
        },
        // 点击遮罩层
        fnAsset() {
            this.aslistTF = false;
        },
        // 获取头像
        _getHeadIcon() {
            var that = this,
            hrefParma = util.getHrefParma();
            util.api({
                surl:root.CE_API_PATH + 'img',
                 //surl:root.CE_API_PATH + 'img?devid='+hrefParma.mdld,
                data:{devid:hrefParma.mdld},
                type: 'get',
                success:function(res) {
                    var rpco = res.rpco,
                        body = res.body;
                    if(rpco==200){
                        that.headIcon = body;
                    }


                }
            });
        },
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
                        sgpl:that.recycleResult.countPrice
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
                            // 渲染
                          body.enable = util.formateDate(parseInt(body.enable), 'yyyy.MM.dd');
                          body.disable = util.formateDate(parseInt(body.disable), 'yyyy.MM.dd');
                          that.couPonInfo = body;
                          that.couPonInfo.conTF = true;
                          that.containerShow = true;
                          break;
                          case 40002:
                            // nothing
                          that.couPonInfo.conTF=false;
                          that.containerShow=true
                          break;
                          default:
                          that.couPonInfo.conTF=false;
                            //util.tip('请求失败')
                    }
                }
            });
        },
        // 获取临时订单
        _getProductInfo() {
            let that = this,
                hrefParma = util.getHrefParma(),
                brandId = hrefParma.gdBrandId||'',
                categoryId = hrefParma.gdCateId||'',
                skuId = hrefParma.gdid||'' ,
                goodName = hrefParma.gdnm||'' ,
                buyDate = hrefParma.dodt||'' ,
                model = hrefParma.gdModel ||'',
                code = hrefParma.code||'' ,
                // surl = root.DATAMAP_API_PATH+'repair?brandId=10000062&categoryId=cat10000206&skuId=123&goodName=阳阳测试&model=&code=110000'
                surl = root.DATAMAP_API_PATH+'repair?brandId='+brandId+'&categoryId='+categoryId+'&skuId='+skuId+'&goodName='+goodName+'&model='+model+'&code='+code+'&buyDate='+buyDate;

            util.api({
                surl: surl,
                type: 'get',
                success(res) {
                    if (res.rpco === 200) {
                        let body = res.body;
                        that.title = body.jkxBrand+body.jkxRelationName;
                        var jkxBrandId = body.jkxBrandId;
                        var jkxCateId = body.jkxCateId;
                        var jkxRelationId = body.jkxRelationId;
                        that.brdid = jkxBrandId;
                        that.eacid = jkxCateId;
                        that.mdld = jkxRelationId;
                        that.repairType = body.repairType;
                        that.isService = body.isService;
                        that.phone = body.phone;
                        $.each(body.attrs,(i,item)=>{
                            delete item.value;
                            item.attrgrpid = item.attrId;
                            item.attrid = item.attrValueId;
                        })
                        that.attrgrps = body.attrs;
                        // _getFault(brdid,eacid,mdld)
                        that._getFault(that.brdid,that.eacid,that.mdld);
                        that._getCouPon();
                    }else{

                        util.href('./index.html');
                    }
                }

            })
        },
		// // 获取临时订单
		_getTempOrder(oid) {
	        var that = this,
	        	hrefParma = this.hrefParma,
	        	surl = root.REPAIR_API_PATH+'getTempOrder?oid=' +oid;
	        	if(!oid){return false}
	        util.api({
	        	surl: surl,
	        	type: 'get',
	        	success(res) {
	        		if (res.rpco === 200) {
	        			$.each(res.body.attrgrps,(i,item)=>{
	        				delete item.attrnm;
	        			})
	        			that.attrgrps = res.body.attrgrps;
	        			that.faults = res.body.mlfs;
                        let price = (res.body.tprice/100).toFixed(2);
                        that.recycleResult.countPrice = res.body.tprice;
                       	if(price>0){
                       		that.recycleResult.price = '￥'+price;

                       	}else if(price==0){
                       		that.recycleResult.price = "";
                       	}else{
                       		that.recycleResult.price = "待检测后报价";
                       	}

		            }else if(res.rpco=== 404){
		                util.href('recycleindex.html',{type:1});
		            }else{
		            	util.tip("网络异常，请稍后再试");
		            }
	        	}

	        })
    	},
		// 获取故障信息
		_getFault(brdid,eacid,mdld) {
			let that = this,
				surl = root.REPAIR_API_PATH+'malfunction?brdid='+brdid+'&&eacid='+eacid +'&&mdld='+mdld;
			util.api({
	            surl: surl,
	            type: 'post',
	            data:{
	            	brdid:brdid,
	            	eacid:eacid,
	            	mdld:mdld,
	            	attrsjson:{"attrs":[{"attrgrpid":null,"attrid":null}]}
	            },
	            success: function(res) {
	            	if (res.rpco === 200) {
	                	$.each(res.body.mlfs,(index,item)=>{
	                		$.each(item.subs,(i,val)=>{
		                		for(var k =0; k<that.faults.length;k++){
                					if(that.faults[k].mlfid == val.mlfid){
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
						if(that.faults[k].mlfid == val.mlfid){
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
    		// if(this.submitObj.tsup && this.submitObj.timeStamp && this.addr && this.faults.length>0){
      //       	this.submitOn = true;
      //       }
		},
		// 获取解决方案
		getSolution(res){
             let ss=window.localStorage;
            ss.setItem('repair',JSON.stringify(this.submitObj));
            this.faultid = res || this.faultid;
            let that = this;
			let data = {
				mdld: that.mdld,
				eacid: that.eacid,
				brdid: that.brdid,
				attrsjson:{"attrs": that.attrgrps} ,
				mlfidsjson: that.faultid
			}
			util.api({
				surl:root.REPAIR_API_PATH+'solution?mdld='+that.mdld+'&&eacid='+that.eacid+'&&brdid='+that.brdid,
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
	                mdld: that.mdld,
					eacid: that.eacid,
					brdid: that.brdid,
					attrsjson: {'attrs':that.attrgrps},
					solnjson: {'solnmap':saveobj}
	            },
	            success: function(res) {
	                if (res.rpco === 200) {
	                    that.oid = res.body.tempoid;
                        that.submitObj.oid = res.body.tempoid;
                        that._getTempOrder(that.oid);
                        // util.href('./repairsubmitorder.html',that.hrefParma);
	                }else{
	                	 util.tip('服务器繁忙，请稍后再试',2000)
	                }

	            }
	        });

    	},
    	//选择完地址判断
    	getAssement(res) {
            this.recycleResult.area = res.area;
        	if(res.area){this.addr = true}
    	},
    	// 选择时间页面切换
		changeContainer(flag,val) {
			this.containerShow = flag;
			if(val==undefined){
				return false
			};
			this.submitObj.timeStamp = val.timeStamp;
			this.submitObj.isSaveTime = val.isSaveTime;
			// if(this.submitObj.tsup && this.submitObj.timeStamp && this.addr && this.faults.length>0){
   //          	this.submitOn = true;
   //          }
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
			}
		},
		//删除故障
		delFault(index) {
			let that = this;
			util.alert('确定删除该故障描述？', {
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
			this._refreshFault();
		},
 		// 提交订单
		orderSubmit(event) {
            var _this = this;
			if(!this.submitOn || !saveOd) return;
			ripple(event);
			// 表情符
            let reg = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
            // 特殊字符
            let patrn = /[`\\@#&$%^&*_\-\/\+\|=<>{}●△●'|~@#&￥%&*——\-\+={}|《》【】]/ig;
            // 验证留言
            if(reg.test(this.submitObj.mas) || patrn.test(this.submitObj.mas)){
                util.tip('留言内容不允许输入特殊字符、emoji表情、html符号');
                return;
            }

                let that = this,
                    hrefParma = _this.hrefParma,
                    ls=window.localStorage,
                    tempOrdId=[],
                    surl,
                    data,
                    source;
                    if(util.isWeiXin()){
                        source=2;
                    }else{
                        source=1;
                    }
                // window.localStorage.removeItem('GMtime');
                // 起止時間
                let yuan = new Date(_this.submitObj.isSaveTime.substr(0,10));
                let aptstart = yuan*1;
                let aptend = new Date(yuan.getFullYear(),yuan.getMonth(),(yuan.getDate()+1))*1;
                surl = root.REPAIR_API_PATH + 'saveOrderd';
                tempOrdId.push(that.oid);
                data = {
                    addr: _this.submitObj.tsup,
                    aptstart: aptstart,
                    aptend: aptend,
                    msg: _this.submitObj.mas,
                    tempoids: tempOrdId,
                    cop:{
                        copnum:_this.couPonInfo.copnum,
                        copp:_this.couPonInfo.copp
                    },
                    devimgs:_this.submitObj.devimgs,
                    buytime:that._formatDt(that.hrefParma.dodt),
                    // devimgs:_this.submitObj.devimgs,
                    // catno: _this.asParameter_.catno,
                    // brdno: _this.asParameter_.brdno,
                    // mdno: _this.asParameter_.mdno,
                    source:source,
                    origin:_this.origin
                };
                util.api({
                    surl: surl,
                    data: data,
                    async: false,
                    beforeSend(){
                        saveOd = false;
                    },
                    success(res) {
                         if (res.rpco === 200) {
                            //订单提交成功页面
                            let supplierPhone=res.body.supplierPhone?res.body.supplierPhone:'';
                            util.href('appointresult.html',{
                                oid:res.body.oid,
                                dodt:res.body.dodt,
                                odtype:res.body.odtype,
                                supplierPhone:supplierPhone
                                // supplierPhone:res.body.supplierPhone,
                                // type:1
                            });
                        }else if(res.rpco === 40006){
                            util.tip('留言最多输入100字')
                        }else if(res.rpco === 40011){
                            util.tip('很抱歉，该地区暂未开通此项服务',2000)
                        }else{
                            util.tip('服务器繁忙，请稍后再试',2000)
                        }
                    },
                    complete(){
                        saveOd = true;
                    }
                })
	    }
	},
	components: {
		headerComponent,
		// serviceSteps,
        serveFlowrepair,
        couPon,
		repairSubmitinfo,
        message,
        Upload,
		recycleInfoCheckbox
	}
}
</script>
<style lang="less">
	@import '../../util/fs.less';
    .recycle-wapper{
        #message{padding-bottom: 0;}
    }
    /*我的资产*/
    .asset{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 10000;
        .asset-content{
            width:7.2rem;
            margin:2rem auto;
            background: #fff;
            border-radius:5px;
            h3{
                font-size:0.48rem;
                color: #333;
                line-height: 1.173333rem;
                text-indent: 0.426667rem;
                background: #f5f5f5;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
                position: relative;
                span{
                    position: absolute;
                    top:0;
                    right: 0;
                    width:1.173333rem;
                    height: 1.173333rem;
                    background: url(../repairsubmit/img/close.png) center no-repeat;
                    background-size: 0.4rem 0.4rem;
                }
            }
            .asset-content-list{
                height: 8.88rem;
                overflow-y: scroll;
                ul{
                    padding-left: 0.32rem;
                    li{
                        /*height: 2.96rem;*/
                        padding: 0.546667rem 0;
                        border-bottom: 1px solid #e3e3e3;
                        .asset-i{
                            margin:0.746667rem 0 0 0.093333rem;
                            width:0.426667rem;
                            height: 0.426667rem;
                            background:url("//gfs11.gomein.net.cn/T1H2xvBmxg1RCvBVdK.png") no-repeat;
                            background-size: cover;
                        }
                        .asset-i_s{
                            background-image: url("//gfs11.gomein.net.cn/T117xvBbWg1RCvBVdK.png");
                        };
                        img{
                            width: 1.84rem;
                            height: 1.84rem;
                            border: 1px solid #e3e3e3;
                            margin:0 0 0 0.266667rem;
                        };
                        div{
                            width: 3.5rem;
                            margin-left: 0.24rem;
                            color: #777;
                            font-size: 0.32rem;
                            p{line-height: 0.32rem;}
                            .p1{
                                font-size: 0.373333rem;
                                color: #333;
                                overflow: hidden;
                                text-overflow:ellipsis;
                                white-space: nowrap;
                                width: 3.5rem;
                                height: 0.373333rem;
                                line-height: 0.373333rem;
                            }
                            .p2{margin-top: 0.2rem;}
                            .p3{margin-top: 0.133333rem;}
                            .p4{
                                width: 1.2rem;
                                height: 0.426667rem;
                                background:#55d1c9;
                                color: #fff;
                                line-height: 0.426667rem;
                                text-align: center;
                                border-radius: 0.053333rem;
                                margin-top: 0.133333rem;
                                font-size: 0.293333rem;
                            }
                            .set-gray{
                                background-color: #ccc;
                            }
                        };
                    }
                    li:last-child{
                        border:0;
                    }
                };
            }
         .asset-confirm{
                height: 0.973333rem;
                padding-top: 0.2rem;
                background:#f9f9f9;
                border-bottom-right-radius: 5px;
                border-bottom-left-radius: 5px;
                span{
                    display: block;
                    width:1.786667rem;
                    height:0.746667rem;
                    border:1px solid #ff4b46;
                    color: #ff4b46;
                    line-height: 0.746667rem;
                    text-align: center;
                    font-size: 0.48rem;
                    border-radius: 5px;
                    margin:0 auto;
                }
            }
        }
    }
    /*我的资产*/
	.recycle-wapper{
		padding-bottom: 1.333333rem;
	}
    ul.list-labelvalue {
        padding-left:0;
        padding-right: 0;
        margin-bottom: 0;
        li{
            padding-left: 0.32rem;
            .liCon{
                .tel{color: #4a90e2;}
            }
            .conTxt{.mixinfont(12px);color: #777;line-height: 0.453333rem;padding-bottom: 0.213333rem;}
        }
    }
    .mt20{
        margin-top: 0.266667rem;
    }
	.list-labelvalue.mt20{
		margin-top: 0.266667rem;
	}
	#list-brand li .value{
		padding-right: 0;
	}
	.fault-detail{
		/*margin-top: 0.266667rem;*/
		background-color: #fff;
		h2{
			position: relative;
			line-height: 1.173333rem;
        	padding:0  0.32rem;
        	.mixinfont(14px);
        	color:#333;
            /* border-bottom: 1px solid rgba(227,227,227,.4); */
            .add-fault{
            	float: right;
            	height: 0.733333rem;
            	/* border: 1px solid #ff4b46; */
            	/* border-radius: 0.08rem; */
            	line-height: 0.733333rem;
            	text-align: right;
            	color: #333;
            	margin-top: 0.2rem;
            }
		};
        /*.que{width: 9.146667rem;height: 2.666667rem;background: #F6F6F6; margin-left: 0.4rem;    resize: none;}*/
		.service-type{padding: 0.533333rem 0.4rem;display: flex;
            li{width: 3.146667rem;height: 1.173333rem;line-height: 1.173333rem;border-radius: 0.106667rem;background:#F6F6F6;border: 1px solid #ccc;text-align: center;}
            li+li{margin-left: 0.266667rem;}
            li.active{background: #FFF1F1;border: 1px solid #FF9897;}
        }
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
		position: fixed!important;
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
    .proInfo{

        height: 1.493333rem;padding: .333333rem .266667rem;display: flex;align-items: center;justify-content:space-between;background:#fff;margin-bottom: 0.29333rem;
        .proImg{width: 1.493333rem;height: 1.493333rem;text-align: center;
            img{width: 100%;height: 100%;}
        }
        .proCon{width: 6.346667rem;margin-left: 0.453333rem;
            p{
                line-height:.426667rem;.mixinfont(14px);
                overflow:hidden;
                text-overflow:ellipsis;
                display:-webkit-box;
                -webkit-box-orient:vertical;
                -webkit-line-clamp:2;

            }
            .ptxt{color: #999;.mixinfont(12px);}
        }
        .proNum{
            text-align: right;width: .933333rem;
            .i-gt {
                display: inline-block;;
                width: 0.2rem;
                height:  0.373333rem;
                position: relative;
                top:0.18666rem;
                -webkit-transform: translateY(-50%);
                transform: translateY(-50%);
                background: url('//gfs6.gomein.net.cn/T15eYTBXhb1RCvBVdK') no-repeat;
                background-size: 0.2rem 0.373333rem;
            }
        }

    }

    .remarks{margin: 0.266667rem 0;text-align: center;.mixinfont(12px);color: #999999;}
    .noServiceWapper{
        background: #fff;position: absolute;width: 100%;height: 100%;
        .noServiceContent{
            position: relative;
            top: 14%;
            text-align: center;
            .imgWrapper{
                text-align: center;margin-bottom: 0.88rem;
                img{width: 1.653333rem;height: 1.44rem;display: block;margin: 0 auto;}
            }
            p{.mixinfont(22px);margin-bottom: 0.533333rem;}
            a{.mixinfont(16px);width: 3.653333rem;height: 1.013333rem;border: 1px solid #ED5B5D;border-radius: 0.053333rem;display: inline-block;line-height:1.013333rem;text-align: center;color:#ED5B5D;  }
        }
        .info{.mixinfont(12px);color: #999999;position: fixed;padding: 0 0.986667rem;bottom: 1.6rem;}
    }
</style>