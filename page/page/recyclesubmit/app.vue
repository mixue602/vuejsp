<template>
	<div  class="wapper recycle-wapper" v-if="render"  >
		<header-component v-show="containerShow" :title= "title"></header-component>
		<server-flow :index="3"></server-flow>
		<div class="recycleResult" v-show="containerShow">
			<span class="hsgj">回收估价</span>
			<p class="price" :class="{'noprice':recycleResult.price=='暂无报价'}">{{recycleResult.price}}</p>
			</p>
			<span class="btn" @click="setParams($event)">重新评估</span>
		</div>
		<div class="brand" @click="goRecycleIndex">
			<img :src="devImg" :onerror="defaultImg" />
			<span class="bname">{{decodeURI(hrefParma.catename) +' '+ recycleResult.brdnm +' '+ recycleResult.prodnm}}</span>
			<span class="num">X1</span>
		</div>
		<!-- 留言 -->
		<message @onmsg="setMas" :msg="submitObj.mas"></message>
		<!-- 图片上传 -->
		<upload @watchupload="uploadImg"></upload>
		<div class="servertype">
			<div class="text">服务类型</div>
			<div class="btn"><span class="border">上门回收</span></div>
		</div>
		<select-time :type="'recycle'" @addtime="addtime" @choose="chooseaddr"></select-time>
		<p class="recycleTip"  v-show="containerShow">提交订单后将有售后人员与您电话沟通，请保存手机顺畅</p>
		<footer class="waves"  v-show="containerShow" :class="{'on':submitOn}"  @click="orderSubmit($event)">提交订单</footer>
	</div>
</template>

<script type="ecma6.0">
import headerComponent from '../../components/HeaderComponent'
// import recycle from './recycleinfo.vue'
import serverFlow from '../../components/ServeFlow'
import submitinfo from '../../components/Submitinfo'
import message from '../../components/message'
import selectTime from '../../components/selectTime'
import upload from '../../components/upload'
let root = window || {},
    util = root.util || {};
let saveOd = true;
export default {
	data(){
		return{
			hrefParma:{},
			title:"",
			containerShow:true,
			devImg:'',
			defaultImg:'this.src="//gfs13.gomein.net.cn/T1.ZYQBChT1RCvBVdK.png"',
			recycleResult:{
				brdnm:"",
				prodnm:"",
				price:""
			},
			page:'recycle1',
			submitOn: false,
			submitObj:{
				addr:{
					addr:'',
					area:'',
					cname:'',
					cphone:'',
					hnum:'',
					region:'',
					tsup:null
				},
				submit:null,
				mas:'',
				devimgs:[],
				serverTime:{
					day:null
				}
			},
			addr: false,
			render: false,
			origin:""
		}
	},
	created() {
		var _this = this;
		if(window.BPConfig.channel!=undefined){
            this.origin=window.BPConfig.channel
        }
		this.hrefParma = util.getHrefParma();
		this.title = this.hrefParma.brdnm +" "+this.hrefParma.attrnm;
		this.submitObj.tsup = this.hrefParma.tsup;
		if(this.submitObj.addr.tsup!=undefined){
			this.submitObj.submit = this.getAssement({area:this.submitObj.addr.area})
		}
		this._getTempOrder();
		this._getDeviesImg();
		let ss = window.sessionStorage;
		if(!!ss.getItem("recycleorder")){
			this.submitObj = JSON.parse(ss.getItem("recycleorder"));
			ss.removeItem("recycleorder");
		}
		// this.$nextTick(()=>{
		// 	console.log(_this.$refs)
  //     		_this.$refs.hximglist.getPic(_this.submitObj.devimgs);

  //   	})

	},
	methods:{
		_getDeviesImg() {
			var _this = this;
			util.api({
				surl:root.CE_API_PATH + 'img?devid=' + _this.hrefParma.proid,
				type:'get',
				success:function(res) {
					if(res.rpco == 200){
						_this.devImg = res.body;
					}
					console.log(res)
				},
				error(err){
					util.tip('网络错误')
				}

			})
		},
		uploadImg(ImgList){
			this.submitObj.devimgs=ImgList[0];
		},
		goRecycleIndex() {
			util.href('./recycleindexnew.html')
		},
		// 获取临时订单
		_getTempOrder() {
	        var that = this,
	        	surl = root.RECYCLE_API_PATH+'getTempOrder?oid=' + this.hrefParma.oid;
	        	// var res = {"rpco":200,"tsrp":1492149609881,"body":{"arcode":110108,"prodid":862,"prodnm":"台式机","brdnm":"惠普","price":280000}}
	        	// if (res.rpco === 200) {
	        	// 	console.log(11111)
	        	// 		res=res.body;
	        	// 		let  price = parseInt(res.price);
          //   			price = price ?  parseFloat(price / 100).toFixed(2) : '暂无报价';
	         //        	that.recycleResult.arcode = res.arcode;
	         //        	that.recycleResult.prodid = res.prodid;
	         //        	that.recycleResult.brdnm = res.brdnm;
	         //        	that.recycleResult.prodnm = res.prodnm;
	         //        	that.recycleResult.price = price;
		        //     }else if(res.rpco=== 404){
		        //         util.href('recycleindex.html',{type:1});
		        //     }
		        //     return;
	        util.api({
	        	surl: surl,
	        	type: 'get',
	        	success(res) {
	        		if (res.rpco === 200) {
	        			res=res.body;
	        			let  price = parseInt(res.price);
            			price = price>0 ?  parseFloat(price / 100).toFixed(2) : '暂无报价';
	                	that.recycleResult.arcode = res.arcode;
	                	that.recycleResult.prodid = res.prodid;
	                	that.recycleResult.brdnm = res.brdnm;
	                	that.recycleResult.prodnm = res.prodnm;
	                	that.recycleResult.price = price;
	                	that.recycleResult.link = './recycleinfo.html?arcode=' + that.recycleResult.arcode + '&prodid=' + that.recycleResult.prodid + '&catename=' + that.recycleResult.brdnm+'&attrnm=' +that.recycleResult.prodnm+'&tsup=' + that.hrefParma.tsup+'&btime=' + that.submitObj.timeStamp;
	                	that.title=res.brdnm+' '+res.prodnm;
	                	// console.log(that.recycleResult);
	                	that.render = true;
		            }else if(res.rpco=== 404){
		                util.href('recycleindex.html',{type:1});
		            }else{
		            	util.tip("网络异常，请稍后再试");
		            }
	        	}

	        })
    	},
    	//选择完地址判断
    	getAssement(res) {
        	var _this = this,
            hrefParma = this.hrefParma;
            this.addr = false;
	        util.api({
	            surl: root.RECYCLE_API_PATH +'updateQuotation?arcode='+res.area+'&toid='+hrefParma.oid,/*'/recycle/yf2/updateQuotation?arcode='+res.area+'&toid='+hrefParma.oid,*/
	            type:'get',
	            success: function(res) {
	                switch(res.rpco) {
	                        case 200:
	                            if(res.body.price==0){
	                                // util.tip('亲爱的用户，该地区暂不支持回收业务，您可以选择其它地区体验回收服务',3000);
	                                _this.recycleResult.price = '以旧换新';
	                                _this.submitObj.submit = true;
	                            };
	                            if(res.body.price<0){
	                                util.tip('亲爱的用户，该地区暂不支持回收业务，您可以选择其它地区体验回收服务',3000);
	                                _this.recycleResult.price = '暂无报价';
	                                _this.submitObj.submit = true;
	                            };
	                            _this.recycleResult.price = (res.body.price/100).toFixed(2);
	                            _this.submitObj.submit = true;
	                            break;
	                        case 404:
	                            util.tip('服务器繁忙，请稍后再试',2000)
	                            _this.submitObj.submit = false;;
	                            break;
	                        case 500:
	                            util.tip('亲爱的用户，该地区暂不支持回收业务，您可以选择其它地区体验回收服务',3000)
	                            _this.recycleResult.price = '暂无报价';
	                            _this.submitObj.submit = false;
	                            break;
	                        case 40003:
	                            util.tip('留言至多100个字',2000)
	                            _this.submitObj.submit = false;
	                            break;
	                        case 40004:
	                            util.tip('服务器繁忙，请稍后再试',2000)
	                            _this.submitObj.submit = false;
	                            break;
	                        case 40005:
	                            util.tip('亲爱的用户，该地区暂不支持回收业务，您可以选择其它地区体验回收服务',3000)
	                            _this.recycleResult.price = '暂无报价';
	                            _this.submitObj.submit = false;
	                            break;
	                        case 40009:
	                            util.tip('亲爱的用户，该地区暂不支持回收业务，您可以选择其它地区体验回收服务',3000)
	                            _this.recycleResult.price = '暂无报价';
	                            _this.submitObj.submit = false;
	                            break;
	                        default:
	                            util.tip('请求失败')
	                            _this.submitObj.submit = false;
	                    }
	            },
	            error: function() {}
	        });
	    },
    	//添加时间地址
    	addtime(item) {
    		console.log(item)
    		this.submitObj.addr=item[2];
    		this.submitObj.serverTime = item[0];
    		//this.submitObj.submit = this.getAssement({area:item[2].area})
    		this.getAssement({area:item[2].area})
    	},
    	chooseaddr() {
    		var ss=window.sessionStorage;
    		ss.setItem('recycleorder',JSON.stringify(this.submitObj));
    		util.href('./address.html',{page:'recycle',tsup:this.submitObj.addr.tsup,oid:util.getHrefParma().oid,catename:util.getHrefParma().catename})
    	},
		setMas(str){
			this.submitObj.mas = str;
		},
		//重新评估
		setParams(ev) {
			ripple(ev);
			let that = this;
			let parmasObj = {
				arcode: that.recycleResult.arcode||100000,
				//型号
                proid: that.recycleResult.prodid,
                //品类
                brdnm: that.recycleResult.brdnm,
                attrnm:that.recycleResult.prodnm,
                tsup:  that.hrefParma.tsup,
                btime: that.submitObj.timeStamp
            }
            util.href("./recycleinfo.html",parmasObj)
			// that.recycleResult.link = './recycleinfo.html?arcode=' + that.recycleResult.arcode + '&proid=' + that.recycleResult.prodid + '&catename=' + that.recycleResult.brdnm+'&attrnm=' +that.recycleResult.prodnm+'&tsup=' + that.hrefParma.tsup+'&btime=' + this.submitObj.timeStamp;
		},
 		// 提交订单
		orderSubmit(ev) {
			
			if(!this.submitOn || !saveOd) return;
			ripple(ev);
			// 表情符
            let reg = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
            // 特殊字符
            let patrn = /[`\\@#&$%^&*_\-\/\+\|=<>{}●△●'|~@#&￥%&*——\-\+={}|《》【】]/ig;
            // 验证留言 
            if(reg.test(this.submitObj.mas) || patrn.test(this.submitObj.mas)){
                util.tip('留言内容不允许输入特殊字符、emoji表情、html符号'); 
                return;
            }
	        var that = this,
	            hrefParma = this.hrefParma,
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
	        surl = root.RECYCLE_API_PATH+'saveOrderd';
	        tempOrdId.push(hrefParma.oid);
	        data = {
	        	stp: 1,
	        	daddr: this.submitObj.addr.tsup,
	        	aptm: this.submitObj.serverTime.timeStr,
	        	umsg: this.submitObj.mas,
	        	devimgs: this.submitObj.devimgs,
	        	toids: tempOrdId,
	        	source:source,
            	origin:that.origin
	        };
	  	    util.api({
	        	surl: surl,
	        	data: data,
	        	beforeSend(){
	        		saveOd = false;
	        	},
	        	success(res) {
	        		 if (res.rpco === 200) {
		                //订单提交成功页面
		                util.href('appointresult.html',{
		                    oid:res.body.odnu,
		                    dodt:res.body.crtm,
		                    odtype:4194307,
		                    type:1
		                });
		            }else if(res.rpco === 40015){
		                util.tip('最多输入100字')
		            }
	        	},
	            complete(){
	            	saveOd = true;
	            }
	        })
	    }
	},
	watch:{
		submitObj:{
			handler(newval,oldval) {
				console.log(newval)
				if(newval.addr.tsup==null||newval.serverTime.day==null||!this.submitObj.submit){
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
		serverFlow,
		submitinfo,
		message,
		selectTime,
		upload
	}
}
</script>
<style lang="less">
	@import '../../util/fs.less';
	.recycle-wapper{
		padding-bottom: 1.333333rem;
	}
	.recycleResult{
		position: relative;
		width: 100%;
		height: 3.73333rem;
		margin-top: 0.2rem;
		background: #fff;
		color: #333;
		.mixinfont(14px);
		box-sizing:border-box;
		span.btn{
			display: block;
			height: 0.74667rem;
			width: 2.66667rem;
			border: 1px solid #ed5b5d;
			border-radius: 4px;
			margin: 0 auto;
			text-align: center;
			line-height: 0.74677rem;
			color: #ed5b5d;
			margin-top: 0.26667rem;
		}
		span.hsgj{
			display: inline-block;
			width: 100%;
			text-align: center;
			margin-top:0.66667rem; 
			color: #999;
			font-size: 0.37333rem;
		}
		p.price{
			font-size: 0.74667rem;
			width: 100%;
			text-align: center;
			color: #ff4b41;
		}
		p.noprice{
			color: #999;
		}
	}
	.brand{
		width: 100%;
		height: 2.08rem;
		background: #fff;
		margin-top: 0.26667rem;
		position: relative;
		overflow: hidden;
		img{
			position: absolute;
			width: 1.65333rem;
			height: 1.65333rem;
			margin: 0.21333rem 0.26667rem;
		}
		.bname{
			width: 3.44rem;
			height: 0.42667rem;
			position: absolute;
			left: 2.16rem;
			top: 0.4rem;
			color: #333;
			overflow: hidden;
			text-overflow:ellipsis; 
			white-space: nowrap;
		}
		.num{
			position: absolute;
			color: #999;
			font-size: 0.34667rem;
			right: 0.26667rem;
			top: 0.4rem;
		}
	}
	.recycleTip{
		color: #777777;
		padding:0 0.32rem;
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
  height: 1.973rem;
}
.servertype .btn span {
  display: inline-block;
  width: 3.14667rem;
  height: 1.173rem;
  text-align: center;
  line-height: 1.173rem;
  background: #fff1f1;
  margin-left: 0.4rem;
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