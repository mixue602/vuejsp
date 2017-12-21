<template>
	<div  class="wapper recycle-wapper wrap" :class="{'appsubmit':isApp}" >
		<!-- 快速预约导航 -->
		<div class="quickNav" >
			{{pagetitle}}
	      <li class="left" @click="jumpUrl"></li>
	      <li class="right"></li>
		</div>
		<!-- 设备型号 -->
		<select-device @select-device="checkDevice" :model="brandObj"></select-device>
	    <!-- 留言 -->
	    <message @onmsg="msg" :msg="submitObj.mas"></message>
	    <!-- 图片上传 -->
	    <upload @watchupload="uploadImg" ref="hximglist"></upload>
		<div class="servertype">
			<div class="text">服务类型</div>
			<div class="btn"><span class="border">上门服务</span></div>
		</div>
    	<!-- 选择时间  -->
		<select-time @addtime="addtime" :type="'recycle'" @choose="chooseaddr" :hxtime="{GmTime:submitObj.GmTime,SelectTime:submitObj.servertime}"></select-time>
		<div class="qnotes">
            <p class="qnote">提交订单后将有售后人员与您电话沟通，请保持手机畅通</p>
        </div>
		<footer class="waves" :class="{'on':submitOn}"  @click="orderSubmit($event)">提交订单</footer>
		<Foot-components :index="1"></Foot-components>
		<!-- 选择设备 -->
		<quick-brand  :devicearr="deviceArr" :deviceshow="deviceShow" @goback="goback" @selectdevice="selectDevice"></quick-brand>
		<!-- 选择品牌 -->
		<select-brand  :modelshow="modelShow" :menuobj='menuObj' :goodsobj='goodsObj' :currentindex='currentindex'  @changebrand='_getModels' @goback="goback" @addpramas="setModels"></select-brand>
		<select-two  :modelshowtwo="modelShowTwo"  :menuobj='menuObj' :goodsobj='goodsObj' @changebrand='_getModels'  @goback="goback"  @addpramas="setModels"></select-two>
	</div>
</template>

<script type="ecma6.0">
import headerComponent from '../../components/HeaderComponent'
import serviceSteps from '../../components/ServiceSteps'
import FootComponents from '../../components/FootComponents'
import quickBrand from './quickbrand'
import selectBrand from './selectbrand'
import selectTwo from './selectbrand2'
import selectDevice from "../../components/selectDevice";
import selectTime from "../../components/selectTime";
import message from "../../components/message";
import upload from "../../components/upload"
let root = window || {},
    util = root.util || {};

export default {
	data(){
		return{
			hrefParma:{},
			title:"",
			wl:window.location,
			brandObj:{
				model:null,
		        brand:null,
		        device:null,
		        logo:'//gfs13.gomein.net.cn/T1.ZYQBChT1RCvBVdK.png'
			},
			baseurl: '//img.gomein.net.cn/gomegj/wap/eacimg2/',
			deviceArr:[],
			deviceShow:false,
			baseurl1: '//img.gomein.net.cn/gomegj/wap/bdimg/',
			baseurl2: '//img.gomein.net.cn/gomegj/wap/bdimg2/',
			goodsObj:[],
			menuObj:[],
			brand:{},
			modelsObj:{},
			modelsObjTwo:{},
			currentindex:0,
			modelShow:false,
			modelShowTwo:false,
			page:'quickrecycle1',
			submitOn: false,
			submitObj: {
		        GmTime:'请选择购买时间',
		        addr:{
		          addr:'',
		          area:'',
		          cname:'',
		          cphone:'',
		          hnum:'',
		          region:'',
		          tsup:''
		        },
		        attrsjson:{
		          attrs:[
		            {
		              attrgrpid:'',
		              attrid:''
		            }
		          ]
		        },
		        brdid:'',
		        eacid:'',
		        mas:'',
		        mdld:'',
		        dimgl:[],
		        servertime:{
		          day:null,
		          timeStr:null,
		          week:null
		        }
		      },
			saveQuickRecycle:{
				deviceArr:[],
				render:{},
				submit:{},
				goodsObj: [],
				menuObj:[],
				brand:{},
				currentindex:null
			},
			origin:"",
			pagetitle:'快速预约',
			isApp:false,
			login:false
		}
	},
	created() {
		const _this = this;
		this.hrefParma = util.getHrefParma();
		this.hrefParma.arcode  = this.hrefParma.arcode ? this.hrefParma.arcode : 110108;
		this.title = "快速预约";
		// 大数据区分渠道
		if(window.BPConfig.channel!=undefined){
            this.origin=window.BPConfig.channel
        }
		let ss = window.sessionStorage;
		if(!!ss.getItem("recycleorder")){
			var savequickrecycle = JSON.parse(ss.getItem("recycleorder"));
			console.log(savequickrecycle)
			this.brandObj = savequickrecycle.brandObj;
			this.submitObj = savequickrecycle || {};
			ss.removeItem("recycleorder");
		}
		this.$nextTick(()=>{
			_this.$refs.hximglist.getPic(this.submitObj.dimgl);
		})
		if(util.isApp()){
	      this.pagetitle = '';
	      var u = navigator.userAgent;
	      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	      if(isAndroid){
	        this.isApp = true;
	      }else{
	        this.isApp = false;
	      }
	      util.deleteHeadBtn();
	    }
	    this.isLogin();
	},
	methods:{
		isLogin() {//判断是否登录，没有登录在app里选择地址吊起登录
			var _this = this;
			util.api({
				surl:root.LOGIN_API_PATH + 'userinfo',
				type:'get',
				success:function(res){
					switch(res.rpco){
		            case 200:
		            _this.login = true;
		            break;
		            case 401:
		            _this.login = false;
		            break;
		            default:
		            _this.login = false;
		            util.tip('服务器繁忙，请稍后再试')
		          }
				}
			})
		},
		_getDeviesImg() {
			var _this = this;
			util.api({
				surl:root.CE_API_PATH + 'img?devid=' + _this.submitObj.dvcd,
				type:'get',
				success:function(res) {
					if(res.rpco == 200){
						_this.brandObj.logo = res.body;
					}
					console.log(res)
				},
				error(err){
					util.tip('网络错误')
				}

			})
		},
		uploadImg(ImgList) {
			console.log(ImgList)
			this.submitObj.dimgl=ImgList[0];
		},
		msg(i) {
			this.submitObj.mas=i;
		},
		// 跳转到预约回收页面
		jumpUrl() {
			let ss = window.sessionStorage;
			this.submitObj.brandObj=this.brandObj;
            ss.setItem('recycleorder',JSON.stringify(this.submitObj));
            util.href("quickrepair.html");
		},
		// 获取设备列表数据
		_getDevice(){
			var that = this;
			// debugger:start
			// var body={"eacatgs":[{"eacid":12,"eacnm":"手机","logo":"http://c.jikexiu.com/sod/app_icon/wh/12.png"},{"eacid":13,"eacnm":"平板","logo":"http://c.jikexiu.com/sod/app_icon/wh/13.png"},{"eacid":36,"eacnm":"电脑","logo":"http://c.jikexiu.com/sod/app_icon/wh/36.png"},{"eacid":19,"eacnm":"电视","logo":"http://c.jikexiu.com/sod/app_icon/wh/19.png"},{"eacid":20,"eacnm":"空调","logo":"http://c.jikexiu.com/sod/app_icon/wh/20.png"},{"eacid":21,"eacnm":"洗衣机","logo":"http://c.jikexiu.com/sod/app_icon/wh/21.png"},{"eacid":25,"eacnm":"冰箱","logo":"http://c.jikexiu.com/sod/app_icon/wh/25.png"},{"eacid":26,"eacnm":"油烟机","logo":"http://c.jikexiu.com/sod/app_icon/wh/26.png"},{"eacid":27,"eacnm":"热水器","logo":"http://c.jikexiu.com/sod/app_icon/wh/27.png"},{"eacid":28,"eacnm":"燃气灶","logo":"http://c.jikexiu.com/sod/app_icon/wh/28.png"}]};
			// $.each(body.eacatgs,(i,item)=>{
			// 	item.logo = that.baseurl+String(item.eacid)+".png"
			// })
			// that.deviceArr = body.eacatgs;
			// this.deviceShow = true;
			// return;
			// debugger:end

			util.api({
				surl:root.RECYCLE_API_PATH + 'getCategory?arcode='+this.hrefParma.arcode,
				type:'get',
				success:function(res) {
					var rpco = res.rpco,
						body = res.body;
					// 处理
					switch(rpco) {
						case 200:
							$.each(body.cates,(i,item)=>{
								item.cateimg = that.baseurl+String(item.cateid)+".png";
							})
							that.deviceArr = body.cates;
							that.saveQuickRecycle.deviceArr = body.cates;
							that.deviceShow = true;
							// 禁止底层页面滑动
							$("html").addClass("noscroll");
						break;
						case 40401:
	                    	util.tip('服务器繁忙，请稍后再试',2000);
	                    	break;
	                    default:
	                        util.tip('请求失败');
					}
				}
			})

		},
		//获取品牌列表数据
		_getBrand(item) {
    		var that = this;
    		that.menuObj=[];
    		that.goodsObj =[];
    			  // debug:start
	        // var res = {"rpco":200,"tsrp":1492406844675,"body":{"brands":[{"eacid":12,"eacatenm":"","brdid":8,"brdnm":"苹果","logo":""},{"eacid":12,"eacatenm":"","brdid":10,"brdnm":"小米","logo":""},{"eacid":12,"eacatenm":"","brdid":11,"brdnm":"三星","logo":""},{"eacid":12,"eacatenm":"","brdid":12,"brdnm":"华为","logo":""},{"eacid":12,"eacatenm":"","brdid":13,"brdnm":"努比亚","logo":""},{"eacid":12,"eacatenm":"","brdid":15,"brdnm":"魅族","logo":""},{"eacid":12,"eacatenm":"","brdid":16,"brdnm":"vivo","logo":""},{"eacid":12,"eacatenm":"","brdid":17,"brdnm":"OPPO","logo":""},{"eacid":12,"eacatenm":"","brdid":10,"brdnm":"小米","logo":""},{"eacid":12,"eacatenm":"","brdid":11,"brdnm":"三星","logo":""},{"eacid":12,"eacatenm":"","brdid":12,"brdnm":"华为","logo":""},{"eacid":12,"eacatenm":"","brdid":13,"brdnm":"努比亚","logo":""},{"eacid":12,"eacatenm":"","brdid":15,"brdnm":"魅族","logo":""},{"eacid":12,"eacatenm":"","brdid":16,"brdnm":"vivo","logo":""},{"eacid":12,"eacatenm":"","brdid":17,"brdnm":"OPPO","logo":""}]}}
	        // if (res.rpco === 200) {
	        //     that.menuObj = res.body.brands;
	        //     that.hrefParma.eacid = item.eacid;
	        //     this.submitObj.eacid = item.eacid;
	        //     if(item.eacnm == "手机" || item.eacnm == "平板"){
	        //     	// 样式1
	        //     	$.each(res.body.brands,(index,item)=>{
	        //             item.brdimg = that.baseurl1+item.brdid+'.png';
	        //         })
	        //     	that.modelShow = true;
	        //     	that._getModels(res.body.brands[0].brdid,0,1);
	        //     }else{
	        //     	// 样式2
	        //     	$.each(res.body.brands,(index,item)=>{
	        //     		item.taf = false;
	        //             item.brdimg = that.baseurl2+item.brdid+'.png';
	        //         })
	        //     	that.modelShowTwo = true;
	        //     }
	        // }

	        // return;
	        // debug:end
    		util.api({
	            surl:root.RECYCLE_API_PATH + 'getBrand?arcode='+this.hrefParma.arcode+'&cateid='+item.cateid,
	            type: 'get',
	            success: function(res) {
	                 if (res.rpco === 200) {
			            if(item.catenm == "手机" || item.catenm == "平板"){
			            	// 样式1
			            	$.each(res.body.brds,(index,item)=>{
			                    item.brdimg = that.baseurl1+item.brdid+'.png';
			                })
			            	that.modelShow = true;
			            	$("html").addClass("noscroll");;
			            	that._getModels(res.body.brds[0].brdid,0,1);
			            }else{
			            	// 样式2
			            	$.each(res.body.brds,(index,item)=>{
			            		item.taf = false;
			                    item.brdimg = that.baseurl2+item.brdid+'.png';
			                })
			            	that.modelShowTwo = true;
			            	$("html").addClass("noscroll");
			            }
			            that.menuObj = res.body.brds;
			            that.saveQuickRecycle.menuObj = res.body.brds;
			            that.hrefParma.cateid = item.cateid;
			            that.submitObj.cateid = item.cateid;
			        }else{
			        	util.tip("网络超时，请稍后再试");
			        }

	            },
	            error: function() {

	            }
	        });
    	},
    	// 获取型号数据
		_getModels(brdid,currentindex,type) {
    		var that = this,
            hrefParma = this.hrefParma;
            // that.goodsObj = {};
    //         if(type===1){
    //         	if(!!that.modelsObj[brdid]){
	   //          	that.goodsObj = that.modelsObj[brdid];
	   //          	this.currentindex = currentindex || 0;
	   //          	return;
	   //          }
    //         }else if(type===2){
				// if(!!that.modelsObjTwo[brdid]){
	   //          	that.goodsObj = that.modelsObjTwo[brdid];
	   //          	console.log(that.goodsObj)
	   //          	return;
	   //          }

    //         }

	        // debug start
	        	// var res = {"rpco":200,"tsrp":1493876230529,"body":{"models":[{"mdld":1131,"mdnm":"iphone 7","attrgrps":[{"attrgrpid":1,"attrgrpnm":"手机颜色","attrs":[{"attrid":4708,"attrnm":"银色"},{"attrid":4742,"attrnm":"金色"},{"attrid":4743,"attrnm":"玫瑰金色"},{"attrid":4766,"attrnm":"黑色"},{"attrid":4767,"attrnm":"亮黑色"}]}]},{"mdld":1132,"mdnm":"iphone 7 Plus","attrgrps":[{"attrgrpid":1,"attrgrpnm":"手机颜色","attrs":[{"attrid":4719,"attrnm":"银色"},{"attrid":4744,"attrnm":"金色"},{"attrid":4745,"attrnm":"红色"},{"attrid":4768,"attrnm":"玫瑰金色"},{"attrid":4769,"attrnm":"黑色"},{"attrid":4770,"attrnm":"亮黑色"}]}]},{"mdld":17,"mdnm":"iPhone 6","attrgrps":[{"attrgrpid":1,"attrgrpnm":"手机颜色","attrs":[{"attrid":103,"attrnm":"银(白色屏幕)"},{"attrid":104,"attrnm":"灰(黑色屏幕)"},{"attrid":105,"attrnm":"金(白色屏幕)"}]}]},{"mdld":18,"mdnm":"iPhone 6 Plus","attrgrps":[{"attrgrpid":1,"attrgrpnm":"手机颜色","attrs":[{"attrid":112,"attrnm":"银(白色屏幕)"},{"attrid":113,"attrnm":"灰(黑色屏幕)"},{"attrid":114,"attrnm":"金(白色屏幕)"}]}]},{"mdld":284,"mdnm":"iPhone 6S","attrgrps":[{"attrgrpid":1,"attrgrpnm":"手机颜色","attrs":[{"attrid":1289,"attrnm":"金(白色屏幕)"},{"attrid":1290,"attrnm":"粉(白色屏幕)"},{"attrid":1291,"attrnm":"灰(黑色屏幕)"},{"attrid":1292,"attrnm":"银(白色屏幕)"}]}]},{"mdld":283,"mdnm":"iPhone 6S Plus","attrgrps":[{"attrgrpid":1,"attrgrpnm":"手机颜色","attrs":[{"attrid":1275,"attrnm":"金(白色屏幕)"},{"attrid":1276,"attrnm":"粉(白色屏幕)"},{"attrid":1277,"attrnm":"灰(黑色屏幕)"},{"attrid":1278,"attrnm":"银(白色屏幕)"}]}]},{"mdld":15,"mdnm":"iPhone 5C","attrgrps":[{"attrgrpid":1,"attrgrpnm":"手机颜色","attrs":[{"attrid":83,"attrnm":"白"},{"attrid":84,"attrnm":"粉"},{"attrid":91,"attrnm":"黄"},{"attrid":92,"attrnm":"蓝"},{"attrid":93,"attrnm":"绿"}]}]},{"mdld":16,"mdnm":"iPhone 5S","attrgrps":[{"attrgrpid":1,"attrgrpnm":"手机颜色","attrs":[{"attrid":94,"attrnm":"银(白色屏幕)"},{"attrid":95,"attrnm":"灰(黑色屏幕)"},{"attrid":102,"attrnm":"金(白色屏幕)"},{"attrid":674,"attrnm":"玫瑰金(白色屏幕)"}]}]},{"mdld":11,"mdnm":"iPhone 4","attrgrps":[{"attrgrpid":1,"attrgrpnm":"手机颜色","attrs":[{"attrid":48,"attrnm":"黑"},{"attrid":49,"attrnm":"白"}]}]},{"mdld":12,"mdnm":"iPhone 4S","attrgrps":[{"attrgrpid":1,"attrgrpnm":"手机颜色","attrs":[{"attrid":57,"attrnm":"黑"},{"attrid":58,"attrnm":"白"}]}]},{"mdld":14,"mdnm":"iPhone 5","attrgrps":[{"attrgrpid":1,"attrgrpnm":"手机颜色","attrs":[{"attrid":75,"attrnm":"银(白色屏幕)"},{"attrid":76,"attrnm":"灰(黑色屏幕)"}]}]}]}}
	        	//  if(res.rpco === 200) {
	        	//  	that.submitObj.brdid = brdid;
	        	//  	if(type===1){
	        	//  		$.each(res.body.models, function(i,current) {
			       //          current.taf = false;
			       //      })
	        	//  		that.goodsObj = res.body.models;
	         //            that.modelsObj[brdid]= res.body.models;
	         //            that.currentindex = currentindex || 0;
	         //            that.render = true;
	        	//  	}else if(type===2){
	        	//  		$.each(res.body.models, function(i,current) {
			       //          current.taf = false;
			       //          $.each(current.attrgrps[0].attrs, function(n,item) {
			       //          	item.mdnm = current.mdnm;
			       //          	item.on = false;
			       //      	})
			       //      })

			       //      that.goodsObj = res.body.models;
	        	//  		that.modelsObjTwo[brdid] = res.body.models;
			       //      that.render = true;
	        	//  	}
	         //     }
	         //     return;
	        // debug end


	        util.api({
	            surl:root.RECYCLE_API_PATH+'getSPU?arcode='+ hrefParma.arcode +'&cateid='+ this.brand.cateid +'&brdid='+brdid,
	            type:'get',
	            success: function(res) {
		            if(res.rpco === 200) {
		        	 	that.submitObj.brdid = brdid;
		        	 	if(type===1){
		        	 		// $.each(res.body.spus, function(i,current) {
				          //       current.taf = false;
				          //   })
		        	 		that.goodsObj = res.body.spus;
		                    that.modelsObj[brdid]= res.body.spus;
		                    that.currentindex = currentindex || 0;
		                    that.saveQuickRecycle.currentindex = currentindex || 0;
		        	 	}else if(type===2){
		        	 		$.each(res.body.spus, function(i,current) {
				                current.taf = false;
				             //    $.each(current.attrgrps[0].attrs, function(n,item) {
				             //    	item.on = false;
				            	// })
				            })
				            that.currentindex = currentindex || 0;
				            that.saveQuickRecycle.currentindex = currentindex || 0;
				            that.goodsObj = res.body.spus;
		        	 		that.modelsObjTwo[brdid] = res.body.spus;
		        	 	}
		            }else{
		            	util.tip("网络超时，请稍后再试")
		            }
	            },
	            error: function() {}
	        });
    	},
		// 选择设备
		selectDevice(item){
			// 关闭设备列表
			this.deviceShow = false;
			// 将选择的设备渲染到页面
			this.brandObj.device = item.catenm;
			// 获取品牌列表
			this._getBrand(item);
			// 记录当前设备
			this.brand = item;
			this.saveQuickRecycle.brand = item;
			
			this.submitObj.dvcd = null;
			this.saveQuickRecycle.goodsObj = [];
			this.saveQuickRecycle.render.brandObj = this.brandObj;
            this.saveQuickRecycle.submit = this.submitObj;
            //this._isSubmit();
		},
		// 切换设备
		checkDevice(){
			if(this.deviceArr.length>0){
				this.deviceShow = true;
				$("html").addClass("noscroll");
				return;
			}
			this._getDevice();
		},
		// 展示品牌列表
		// checkBrand(){
		// 	if(this.brandObj.device == "请选择"){
		// 		util.tip("请选择设备");
		// 	}else{
		// 		// this._getBrand(this.brand);
		// 		if(this.saveQuickRecycle.goodsObj.length<=0 || this.goodsObj.length<=0){
		// 			this._getBrand(this.brand);
		// 			return;
		// 		}
		// 		if(this.brand.catenm == "手机" || this.brand.catenm == "平板"){
		// 			this.modelShow = true;
		// 			$("html").addClass("noscroll");
		// 		}else{
		// 			this.modelShowTwo = true;
		// 			$("html").addClass("noscroll");
		// 		}
		// 	}
		// },
		// checkModel() {
		// 	if(this.brandObj.device == "请选择"){
		// 		util.tip("请选择设备");
		// 	}else{
		// 		// this._getBrand(this.brand);
		// 		if(this.saveQuickRecycle.goodsObj.length<=0){
		// 			this._getBrand(this.brand);
		// 			return;
		// 		}
		// 		if(this.brand.catenm == "手机" || this.brand.catenm == "平板"){
		// 			this.modelShow = true;
		// 			$("html").addClass("noscroll");
		// 		}else{
		// 			this.modelShowTwo = true;
		// 			$("html").addClass("noscroll");
		// 		}
		// 	}
		// },
		//选择型号
		setModels(index,goodsRender,onIndex,type) {
			let parent = this.menuObj[this.currentindex],
			// let parent = this.menuObj[onIndex],
            	good = this.goodsObj[index];
            	this.goodsObj = goodsRender;
            	this.saveQuickRecycle.goodsObj = goodsRender;
            this.brandObj.brand = parent.brdnm;
            this.brandObj.model = good.spunm;
            if(type===1){
            	this.modelShow = false;
            	$("html").removeClass("noscroll");
            }else if(type===2){
            	this.modelShowTwo = false;
            	$("html").removeClass("noscroll");
            }

            this.submitObj.dvcd = good.spuid;
            this.submitObj.method = 1;
            // 存储session数据
            this.saveQuickRecycle.render.brandObj = this.brandObj;
            this.saveQuickRecycle.submit = this.submitObj;
            this._getDeviesImg();

		},
		goback(hideContainer,showContainer,obj,index) {
			var that = this;
			this[hideContainer] = false;
			$("html").removeClass("noscroll");
			if(showContainer!="app"){
				this.deviceShow = true;
				$("html").addClass("noscroll");
			}
			if(obj!==undefined){
				this.goodsObj = obj;
			}
			if(index!==undefined){
				if(this.brand.catenm == "手机" || this.brand.catenm == "平板"){
					this.currentindex = index;
				}else{
					$.each(that.menuObj,(i,val)=>{
						val.taf = false;
					})
					that.menuObj[index].taf = true;
				}
			}
		},
 		// 提交订单
		orderSubmit(event) {

			if(!this.submitOn) return;
			this.submitOn = false;
			ripple(event);
			// 表情符
            let reg = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
            // 特殊字符
            let patrn = /[`\\@#&$%^&*_\-\/\+\|=<>{}●△●'|~@#&￥%&*——\-\+={}|《》【】]/ig;
            console.log(this.submitObj.mas)
            // 验证留言
            if(reg.test(this.submitObj.mas.trim()) || patrn.test(this.submitObj.mas.trim())){
                util.tip('留言内容不允许输入特殊字符、emoji表情、html符号');
                return;
            }
	        var that = this,
	            hrefParma = this.hrefParma,
	            ls=window.localStorage,
	            surl,
	            data,
	            source;
	            if(util.isWeiXin()){
		            source=2;
		        }else{
		            source=1;
		        }
	        // 起止時間
	       	var yuan = new Date(that.submitObj.servertime.timeStr);
	       	console.log(yuan)
            var aptstart = yuan*1;
            //console.log(aptstart)
			//var aptend = new Date(yuan.getFullYear(),yuan.getMonth(),(yuan.getDate()+1))*1;
	        surl = root.RECYCLE_API_PATH + 'quickOrderd';
	        data = {
	        	method: this.submitObj.method,
	        	dvcd: this.submitObj.dvcd,
	        	aprt:aptstart,
	        	daddr: this.submitObj.addr.tsup,
	        	msg: this.submitObj.mas,
	        	origin:this.origin,
	        	devimgs:this.submitObj.dimgl,
	        	source:source
	        };
	  	    util.api({
	        	surl: surl,
	        	data: data,
	        	type:'post',
	        	success: function (response) {
	                var rpco = response.rpco,
	                    body = response.body || {};
	                // 处理
	                switch (rpco) {
	                    // 正常
	                    case 200:
	                        //跳转到下单成功页
	      //                   if(util.isApp()){
							// 	util.pushWindow(that.wl.origin+'/yf/appointresult.html?oid='+body.oid+'&odtype='+body.odtype+'&dodt='+body.dodt+'&type=1')
							// 	return false
							// }
	                        util.href('appointresult.html', {
	                            oid:body.oid,
	                            odtype:body.odtype,
	                            dodt:body.dodt,
	                            type:1
	                        });
	                        break;
	                    case 404:
	                        util.alert('服务器繁忙，请稍后再试',{justOk:true});
	                        break;
	                    case 500:
	                        util.alert('服务器繁忙，请稍后再试',{justOk:true});
	                        break;
	                    case 40007:
	                        util.alert('请选择型号',{justOk:true});
	                        break;
	                    case 40009:
	                        util.alert('很抱歉，该地区暂未开通此项服务',{justOk:true});
	                        break;
	                    case 40010:
	                        util.alert('服务器繁忙，请稍后再试',{justOk:true});
	                        break;
	                    case 40012:
	                        util.alert('请选择服务地址',{justOk:true});
	                        break;
	                    case 40013:
	                        util.alert('请选择上门时间',{justOk:true});
	                        break;
	                    case 40015:
	                        util.alert('留言至多100个字',{justOk:true});
	                        break;
	                    default:
	                        util.alert('网络错误，请重新提交', {justOk:true});
	                }
	            }
	        })
	    },
		addtime(item) {
	        this.submitObj.servertime=item[0];
            this.submitObj.GmTime=item[1];
            this.submitObj.addr=item[2]
		},
		chooseaddr() {
	      var ss=window.sessionStorage;
	      this.submitObj.brandObj=this.brandObj;
	      ss.setItem('recycleorder',JSON.stringify(this.submitObj));
	      if(util.isApp()){
	          // this.setHeaderBar();
	          this.login ? util.href('./address.html',{page:'quickrepair',tsup:this.submitObj.addr.tsup}) : GomeJSBridge.login(null,null);
        	}else{
        		util.href('./address.html',{page:'quickrepair',tsup:this.submitObj.addr.tsup})
        	}
        	
    	}
	},
	watch:{
		submitObj:{
	      handler(newval,val) {//判断是否可提交
	      	//console.log(newval)
	        if(newval.addr.tsup==""){
	          this.submitOn=false;
	        }else if(newval.brdid=="") {
	          this.submitOn=false;
	        }else if(newval.dvcd==""){
	          this.submitOn=false;
	        }else if(newval.servertime.day==null) {
	          this.submitOn=false;
	        }else{
	          this.submitOn=true;
	        }
	      },
	      deep:true
	    }
	},
	components: {
		headerComponent,
		serviceSteps,
		quickBrand,
		selectBrand,
		selectTwo,
		FootComponents,
		selectDevice,
	  	selectTime,
	   	message,
	   	upload
	}
}
</script>
<style lang="less">
	@import '../../util/fs.less';
	.recycle-wapper{
		padding-bottom: 1.33333rem;
		padding-top: 0;
		background: #f6f6f6;
	}
	.appsubmit{
		padding-bottom: 0;
	}
	.list-labelvalue.mt20{
		margin-top: 0.266667rem;
	}
	.quickNav{
	  width: 100%;
	  height: 3.733333rem;
	  background-color: #ef3030;
	  background: url(//gfs10.gomein.net.cn/T1NyEgBmhT1RCvBVdK.png) no-repeat;
	  background-size: cover;
	  position: relative;
	  text-align: center;
	  line-height: 1.2rem;
	  color: #fff;
	  font-size: 0.4rem;
	  li.left {
	    left: 0;
	    top: 0;
	    width: 50%;
	    height: 100%;
	    position: absolute;
	  }
	  li.right{
	    width: 50%;
	    height: 100%;
	    position: absolute;
	    top: 0;
	    right: 0;
	  }
	}
	.qnotes{
		width: 100%;
		padding: 0.24rem;
		.mixinfont(13px);
		color:#777777;
		box-sizing: border-box;
		p{
			text-align:center;
		}
	}
	.i1 .i-gt {
	    width: 0.2rem;
	    height:  0.373333rem;
	    position: absolute;
	    right: 0.32rem;
	    top: 50%;
	    -webkit-transform: translateY(-50%);
	    transform: translateY(-50%);
	    background: url('//gfs6.gomein.net.cn/T15eYTBXhb1RCvBVdK') no-repeat;
	    background-size: 0.2rem 0.373333rem;
	}
	footer{
		width: 100%;
		height: 1.30667rem;
		line-height: 1.30667rem;
		text-align: center;
		background-color: #E0E0E0;
		color: #fff;
		.mixinfont(18px);
		&.on{
			background-color: #ff4b46;
		}
	}
.servertype {
  width: 100%;
  font-size: 0.32rem;
  background: #fff;
  margin-top:0.29333rem;
}
.servertype .text {
  width: 100%;
  height: 1.173rem;
  line-height: 1.173rem;
  text-indent: 0.4rem;
}
.servertype .btn {
  width: 100%;
  height: 1.92rem;
}
.servertype .btn span {
  display: inline-block;
  width: 3.14667rem;
  height: 1.173rem;
  text-align: center;
  line-height: 1.173rem;
  background: #fff1f1;
  margin-left: 0.42rem;
}
.border{
  position: relative;
}
.border:before{
  content: "";
  position: absolute;
  width: 200%;
  height: 200%;
  border: 1px solid #ff9897;
  border-radius: 8px;
  top: 0;
  left: 0;
  -webkit-transform-origin:0 0;
  -ms-transform-origin:0 0;
  -moz-transform-origin:0 0;
  -o-transform-origin:0 0;
  transform-origin:0 0;
  -webkit-transform:scale(0.5,0.5);
  -ms-transform:scale(0.5,0.5);
  -o-transform:scale(0.5,0.5);
  transform:scale(0.5,0.5);
  -webkit-box-sizing:border-box;
  -moz-box-sizing:border-box;
  box-sizing: border-box;
}
</style>
