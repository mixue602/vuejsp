<template>
	<div  class="wapper recycle-wapper" >
		<header-component v-show="containerShow" :title= "title"></header-component>
		<ul class="list-labelvalue  mt20" id="list-brand" v-show="containerShow">
            <li class="i1 bdr-bottom">
                <label>设备</label>
                <span class="value">{{moren.catename}}</span>
            </li>
            <li class="i1 bdr-bottom" >
                <label>品牌</label>
                <span class="value">{{moren.brdnm}}</span>
            </li>
            <li class="i1" >
                <label>型号</label>
                <span class="value">{{moren.attrnm}}</span>
            </li>
        </ul>
		<div>
		    <div class="subinfo" v-show="!time.timeShow">
		        <ul class="list-labelvalue">
		            <li class="i1 bdr-bottom" id="serviceWay">
		                <label>服务方式</label>
		                <span class="value">上门服务</span>
		            </li>
		            <li id="serviceAddr" class="bdr-bottom" @click="chooseAddr">
		                <label v-show="resAddr3">服务地址</label>
		                <span v-show="resAddr3" class="value col777">请选择</span>
		                <span class="name" v-show="resAddr">{{resTree.cname}}&nbsp;&nbsp;&nbsp;&nbsp;{{resTree.cphone}}</span>
		                <span class="addr-detail" v-show="resAddr">{{resTree.addr}}</span>
		                <span class="name" v-show="resAddr2">{{resTree2.cname}}&nbsp;&nbsp;&nbsp;&nbsp;{{resTree2.cphone}}</span>
		                <span class="addr-detail" v-show="resAddr2">{{resTree2.region}}&nbsp;&nbsp;{{resTree2.addr}}&nbsp;&nbsp;{{resTree2.hnum}}</span>
		                <i class="i i-gt"></i>
		            </li>
		            <li id="serviceTime" @click="chooseTime">
		                <label>上门日期</label>
		                <span class="value" :class="{'col777':!(time.isSaveTime!='请选择')}" >{{time.isSaveTime}}</span>
		                <i class="i i-gt"></i>
		            </li>
		        </ul>
		        <!-- 留言 -->
		        <ul class="list-labelvalue">
		            <li id="serviceMes" >
		                <label>留言（选填）</label>
		                <textarea placeholder="请输入其他要求(100字以内)" maxlength="100" v-model="mas" @blur="setMas1"></textarea>
		            </li>
		        </ul>
		    </div>
		    <timer v-show="time.timeShow" @changetime="changeTime"></timer>
		</div>
		<footer v-show="containerShow" class="waves" :class="{'on':submitOn}"  @click="orderSubmit($event)">提交订单</footer>

	</div>
</template>

<script type="ecma6.0">
import headerComponent from '../../components/HeaderComponent'
import timer from '../../components/ChooseTime';
let root = window || {},
    util = root.util || {};
export default {
	// props:{
 //            page:{
 //                type: String
 //            }
 //        },
	data(){
		return{
			moren:{
				catename:"",
				brdnm:"",
				attrnm:""
			},
			hrefparma:{

			},
			title:"订单提交",
			containerShow:true,
			page:'tclsa',
			submitOn2: true,
			submitOn: false,
			submitObj:{},
			addr: false,
			mas:"",
			resAddr: false,
			resAddr2: false,
			resAddr3: true,
			resTree: {},
			resTree2: {},
			time:{
			    timeShow:false,
			    timeStamp:"",
			    isSaveTime: "请选择"
			}
		}
	},
	created() {
		let otn=util.getHrefParma().otn;
		 // 获取地址信息
            this.hrefparma = util.getHrefParma();
         if(this.hrefparma.tsup!=undefined){
         	this.submitObj.addId = this.hrefparma.tsup;
         }
		 
		 this.submitObj.thirdCode =otn;
		this.getmessage(otn);
        this._setParmasToPage();
	},
	methods:{
		// 获取资产信息
		getmessage(otn){
			var that=this;
			util.api({
	        	surl: './asc/ioif?serial='+otn,
	        	type:'get',
	        	success(res) {
	        		//this.hrefParma.catename=
	        		var body=res.body;
	        		console.log(body)
	        		switch (res.rpco){
	        		    //维修
	        		    case 200:
	        		        that.moren.catename=body.cateTitle;
	        		        that.moren.brdnm=body.brandTitle;
	        		        that.moren.attrnm=body.title;
	        		        //地址
	        		        that.resTree.addr = body.address;
	        		        that.resTree.cname = body.cname;
	        		        that.resTree.cphone = body.nphone;
	        		        // 提交参数
	        		        that.submitObj.phone = body.cphone;
	        		        that.submitObj.goodsId = body.goodsId;
	        		        that.submitObj.outTime = body.outTime;
	        		        // that.resTree.region = resTree.region;
	        		        
	        		        that.submitObj.addId=true;
	        		        that.addr=true
	        		        that.resAddr = true;
	        		        that.resAddr3 = false;
	        		        that._getAddr();
	        		        // that.submitObj.goodId=body.id;
	        		        // that.submitObj.tsup=assid
	        		        break;
	        		    util.tip('服务器繁忙，请稍后再试',2000)
	        		}
	        	}
	        })
		},
    	//选择完地址判断
    	getAssement(res) {
        	console.log(res)
            this.submitObj.addId = res.tsup;
        	if(res.area){this.addr = true}
        	if(this.submitObj.addId && this.submitObj.appointTime && this.addr){
            	this.submitOn = true;
            }
    	},
    	// 选择时间页面切换
		changeContainer(flag,val) {
			// var day,
			// 	date;

			this.containerShow = flag;
			//console.log(this.containerShow)
			if(val==undefined){
				return false
			}
			// day = util.formateDate(parseInt(parmas.btime), 'yyyy-MM-dd');
			// date = util.formatWeek(parseInt(parmas.btime));
			// this.time.isSaveTime = day+" "+date;
			this.submitObj.appointTime = val.isSaveTime;
			//this.submitObj.isSaveTime = val.isSaveTime;
			if(this.submitObj.addId && this.submitObj.appointTime && this.addr){
            	this.submitOn = true;
            }
			console.log(this.submitObj)
		},
		changeCon(flag){
			this.containerShow = flag;
		},
		//设置留言
		setMas(str){
			this.submitObj.note = str;
			let EMJi_REG = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
            if(EMJi_REG.test(this.submitObj.note)){
				this.submitOn = false;
			}else{
				if(this.submitObj.addId && this.submitObj.appointTime && this.addr ){
	            	this.submitOn = true;
	            }
			}
		},
 		// 提交订单
		orderSubmit(event) {
			if(!this.submitOn2) return;
			if(!this.submitOn) return;
			// 表情符
            let reg = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
            // 特殊字符
            let patrn = /[`\\@#&$%^&*_\-\/\+\|=<>{}●△●'|~@#&￥%&*——\-\+={}|《》【】]/ig;
            // 验证留言 
            if(reg.test(this.submitObj.note) || patrn.test(this.submitObj.note)){
                util.tip('留言内容不允许输入特殊字符、emoji表情、html符号'); 
                return;
            }
			let that = this,
	            surl,
	            data,
	            dodt=new Date()*1;
			if(this.hrefparma.tsup==undefined){
				data={
					thirdCode:this.submitObj.thirdCode,
					username:this.resTree.cname,
					phone:this.submitObj.phone,
					address:this.resTree.addr,
					goodId:this.submitObj.goodsId,
					outTime:this.submitObj.outTime,
					appointTime:this.submitObj.appointTime,
					note:this.submitObj.note
				}
			}else{
				data={
					thirdCode:this.submitObj.thirdCode,
					addId:this.submitObj.addId,
					goodId:this.submitObj.goodsId,
					outTime:this.submitObj.outTime,
					appointTime:this.submitObj.appointTime,
					note:this.submitObj.note
				}
			}
	        // 起止時間
	        surl = './asc/install';
	  	    util.api({
	        	surl: surl,
	        	data: data,
	        	success(res) {
	        		 if (res.rpco === 200) {
		                //订单提交成功页面
		                that.submitOn2=false;
		                util.href('appointresult.html',{
		                    oid:that.submitObj.thirdCode,
		                    dodt:dodt,
		                    odtype:2097153,
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
	    },
	 //原公共组件
	 // 处理URL参数到页面
	 _setParmasToPage() {
	     let parmas = this.hrefparma,
	     day,
	     date;
	     if (parmas.btime) {
	         this.time.timeStamp = parmas.btime;
	         day = util.formateDate(parseInt(parmas.btime), 'yyyy-MM-dd');
	         date = util.formatWeek(parseInt(parmas.btime));
	         this.time.isSaveTime = day+" "+date;
	         // this.$emit("changecontainer",true, this.time)
	         this.changeContainer(true,this.time);
	    }
	 },
	 // 获取地址信息
	 _getAddr() {
	     let that = this,
	         parmas = this.hrefparma,
	         requestPramas = {},
	         surl;
	     // tsup时间戳
	     if(!parmas.tsup){
	         return false
	     }
	     // 渲染留言
	     let ss=window.sessionStorage,
	         mas=ss.getItem('mas');
	     if(mas!=null){
	         this.mas = mas;
	         // this.$emit("setmas",this.mas)
	         this.setMas(this.mas)
	     };
	     // 请求地址数据
	     surl = root.MB_API_PATH+'getAddr?tsup=' + parmas.tsup;
	     util.api({
	         surl:surl,
	         type:'get',
	         success(res) {
	              if (res.rpco === 200) {
	                 let resTree = res.body || {};
	                 that.resTree2.areaCode = resTree.areaCode;
	                 that.resTree2.cname = resTree.cname;
	                 that.resTree2.cphone = resTree.cphone;
	                 that.resTree2.region = resTree.region;
	                 that.resTree2.addr = resTree.addr;
	                 that.resTree2.hnum = resTree.hnum || "";
	                 console.log(that.resTree)
	                 that.resAddr = false;
	                 that.resAddr2 = true;
	                 that.resAddr3 = false;
	                 //that.$emit("getaddr",res.body)
	                 that.getAssement(res.body)
	             }
	         }
	     })
	 },
	 // 选择地址
	 chooseAddr() {
	     let temp = this.hrefparma,
	     tsup = this.hrefparma.tsup ? this.hrefparma.tsup : '',
	     ss = window.sessionStorage;
	         temp.tsup= tsup;
	         // temp.oid=this.hrefparma.oid;	
	         //跳转回来的页面
	         temp.page = this.page;
	         console.log(this.page)
	         temp.btime = this.time.timeStamp;
	     ss.setItem('mas',this.mas)
	     util.href('./oftenaddress.html', temp);
	 },
	 // 选择时间
	 chooseTime() {
	     this.time.timeShow = true;
	     // 隐藏父级页面的部分组件,并改变头部内容
	     // this.$emit("changecon",false,"选择上门时间")
	     this.changeCon(false,"选择上门时间")
	 },
	 // 处理时间
	 changeTime(val) {
	     if(typeof val!="object"){
	         // this.$emit("changecontainer",true)
	         this.changeContainer(true);
	         this.time.timeShow = false;
	         return  false;
	     }
	     this.time.timeShow = false;
	     this.time.isSaveTime = val.day+" "+val.week;
	     this.time.timeStamp = val.timeStr;
	     this.changeContainer(true,this.time);
	 },
	 setMas1() {

	     // let EMJi_REG = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
	     let EMJi_REG = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
	     if(EMJi_REG.test(this.mas)){
	         this.mas = this.mas.replace(EMJi_REG, '')
	     }
	     // this.$emit("setmas",this.mas)
	     this.setMas(this.mas)
	 }
	},
	components: {
		headerComponent,
		timer
		// submitinfo
	}
}
</script>
<style lang="less">
	@import '../../util/fs.less';
	.recycle-wapper{
		padding-bottom: 1.333333rem;
	}
	.list-labelvalue.mt20{
		margin-top: 0.266667rem;
	}
	#list-brand li .value{
		padding-right: 0;
		width: 80%;
    	height: 100%;
    	text-align: right;
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
            	/* border: 1px solid #ff4b46; */
            	/* border-radius: 0.08rem; */
            	line-height: 0.733333rem;
            	text-align: right;
            	color: #333;
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
	.list-labelvalue {
	    margin-top: 0.266667rem;
	    margin-bottom: 0.266667rem;
	    padding-right: 0;
	    line-height: 1.173333rem;
	    background-color: #fff;
	    padding-left: 0.32rem;
	    .mixinfont(14px);
	    li {
	        position: relative;
	        padding-right: 0.32rem;
	       /*  &:not(:last-child) {
	            border-bottom: 1px solid rgba(227,227,227,.4);
	        }; */
	        .value{
	            white-space: nowrap;
	            text-overflow: ellipsis;
	            overflow: hidden;
	            float: right;
	            padding-right: 0.32rem;
	            color: #333333;
	            &.col777{
	                color:#d0d0d0;
	            }
	        };
	        textarea {
	            overflow-y: hidden;
	            box-sizing: border-box;
	            width: 65%;
	            height: 1.173333rem;
	            line-height: 1;
	            resize: none;
	            padding: 0.45rem 0;
	            overflow-y: auto;
	            color: #333333;
	            .mixinfont(14px);
	        };
	        ::-webkit-input-placeholder{
	            color:#d0d0d0;
	        }
	    }
	    #serviceMes{
	        position: relative;
	    }
	    #serviceMes textarea{
	        position: absolute;
	        left:2.586667rem;
	    }
	}
	#serviceWay .value {
	    padding-right: 0;
	}

	#serviceAddr {
	    padding-top: 0.373333rem;
	    padding-bottom: 0.373333rem;
	    line-height: 1;
	}
	#serviceAddr .name,
	#serviceAddr .addr-detail {
	    display: inline-block;
	    width: 92%;
	}
	#serviceAddr .name {
	    line-height: 0.693333rem;
	    font-weight: bold;
	}

	#serviceAddr .addr-detail {
	    line-height: 1.3;
	}

	#device .i-gt,
	#deviceBrand .i-gt,
	#deviceModel .i-gt,
	#serviceTime .i-gt,
	#serviceAddr .i-gt {
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
</style>