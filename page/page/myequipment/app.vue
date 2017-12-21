<template>
	<div id="myequipment" class="wapper recycle-wapper" >
	   <!--  <header-component :title="title"></header-component>
        <button class="right" @click="edit" v-show="startBtn">编辑</button>
        <button class="right" @click="complete" v-show="closeBtn">完成</button> -->
        <header-component :title="title" :rightmenus="rightmenus"  @watchlist="addrAdd"></header-component>

        <div class="container">
            <div id="list" v-show="list">
            	<div v-for="(item,numIndex) in assetlists" class="outder">
            		<!-- <ul class="list-text"> -->
                    <ul class="list-text" >
                        <li class="pic" @click="jumpAssetdetail(item.id,item.asnum,jumpPosibble)">
                            <img :src="item.asimgu" onerror="onerror=null;src='//img.gomegj.com/guanjiaweb/pc/book_brand2/v.png'">
                            <div class="inpicState" v-show="(item.aswaew==1||item.aswaew==2)"></div>
                            <div class="outpicState" v-show="(item.aswaew==3||item.aswaew==4)"></div>
                        </li>
                        <li class="txt_tit liri">
                           <p class="txt-ipt" @click="jumpAssetdetail(item.id,item.asnum,jumpPosibble)" v-show="!(changeNameInx==numIndex)">{{ item.ashname }}</p>
                           <textarea class="txt-ipting" :id="numIndex"  :value="item.ashname" v-model="item.ashname" v-show="changeNameInx==numIndex" v-focus="focusStatus"> </textarea>

                           <!-- <textarea class="txt-ipt" :class="{'txt-ipting':changeNameInx==numIndex}" @click="jumpAssetdetail(item.id,item.asnum,jumpPosibble)" :value="item.ashname"  v-model="item.ashname" :readonly="!(changeNameInx==numIndex)" rows="2">   -->    <!--  </textarea> -->
                           <span v-show="serviceBtn" @click="lisBox(numIndex,item.wbrdno,item.wcatno,item.wgoodsId,item.ashname,item.mdnm)">售后服务</span>
                           <div class="boxer" v-show="serviceInx==numIndex" v-if="isRepair">
                               <span class="sanjiao"></span>
                               <ul class="fuwu-box">
                                  <li @click="jumpRepairinfo(item.wbrdno,item.wcatno,item.wgoodsId,item.ashname,item.buyTime,item.price,item.num)">维修</li>
                                 <!--  <li v-for="ser in item.svtplst" v-if="ser==2" @click="jumpRecycleindexnew()">回收</li>
                                  <li v-for="ser in item.svtplst" v-if="ser==3" @click="jumpCleanlistnew()">清洗保养</li> -->
                                  <!-- <li>说明书</li>
                                  <li>电子发票</li> -->
                               </ul>
                           </div> 
                        </li>
                        <li class="txt-itm liri" @click="jumpAssetdetail(item.id,item.asnum,jumpPosibble)" v-if="item.brdnm">
                            品牌：{{ item.brdnm }}
                        </li>
                        <li class="txt-itm liri" @click="jumpAssetdetail(item.id,item.asnum,jumpPosibble)" v-if="item.mdnm">
                            型号：{{ item.mdnm }}
                        </li>
                    </ul>
                    <div v-if="(item.aswaew==2||item.aswaew==4||item.aswaew==6)" v-show="buybox" class="buyBox" >           
                         <span v-show="item.extDetail.disPrice">延长保修最高优惠{{ parseFloat(item.extDetail.disPrice/100).toFixed(2) }}元</span>
                         <span v-show="!item.extDetail.disPrice&&item.extDetail.price">延长保修低至{{ parseFloat(item.extDetail.price/100).toFixed(2) }}元</span>
                         <span class="buyBtn" @click="openTip(item.asnum,item.brdnm,item.id)">购买延保</span>
                    </div>
                    <div class="edit-box" v-if="editBox">
                        <span class="dele-btn" :class="{'noclick':btnNoclick}" @click="deleteAsset(item.id)">删除设备</span>
                        <span class="chname-btn" :class="{'noclick':btnNoclick}" @click="changeName(numIndex,item.ashname)" v-show="!(changeNameInx==numIndex)">修改名称</span>
                        <span class="success-btn" @click="editok(item.id,item.ashname)" v-show="changeNameInx==numIndex">保存</span>
                    </div>
            	</div>

                <div class="addBtn" @click="jumpAddequipment()" v-show="startBtn">添加设备</div>
            </div>

            <div class="closeserbox" @click="closeserBox" v-show="serviceBox"></div>

            <div class="nolist" id="noList" v-show="noList">
                <p class="wenTop">您的设备管理</p>
                <p class="wen">电子设备保修卡、说明书、售后服务一步到位</p>
                <div class="tu">
                    <i class="i i-noassets"></i>
                </div>
                <div class="btn-box">
                    <button class="btn" @click="jumpAcclist" v-show="hascard">绑定会员卡</button>
                    <button class="btn" @click="jumpAddequipment()">自定义添加设备</button>
                </div>
            </div>
        </div>
        
        <div class="area-dialog" v-show="dialog">
            <div class="area-main">
                <div class="title">
                    <span class="tod wp70 dib" id="dialogTit">
                    	{{ tipTitle }}
                    </span>
                    <div class="close" @click="closeTip"></div>
                </div>
                <div id="yanbaoList" class="yanbao-wrap">
                    
                    <div class="yanbao-item" v-for="item in spulists">
                        <div class="yanbao-item-title">
                            <div class="text">{{ item.title }}</div>
                            <a class="desc" :href="item.introurl">服务介绍</a>
                        </div>
                        <div class="yanbao-itme-con">
                            <div class="yanbao-sublist">
                                     <!-- skulists -->
                                <div v-for="(sku,index) in item.skulist" class="yanbao-subitem" :skuid="sku.skuid" :providerid="sku.providerId"  @click="skuCheck(sku.skuid,sku.providerId,index)" :class="{'checked':index==qwer}">
                                    <div class="yanbao-subitem-innerbox">
                                        <span class="text">{{ sku.name }}</span>
                                        <span class="price">
                                           ￥<span class="yb-detailMoney">{{ parseFloat(sku.price/100) }}</span>
                                           <span class="yb-th" v-if="sku.disPrice>0">支付立减￥{{ parseFloat(sku.disPrice/100) }}</span>
                                        </span>
                                        <span class="hot dn" v-if="sku.disPrice>0"></span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div class="ybEnd-Message" v-show="messageDis">温馨提示：此优惠仅限国美管家网络渠道销售。</div>

                </div>
                <div class="yanbao-buy-box">
                    <div class="yanbao-buy-btn" :class="{'checked':itemChe}" @click="buyYanbao()">立即购买</div>
                </div>
            </div>
        </div>
         
        
        <!-- <yeser-tip v-show="ifshowtip" @closetip="closetip" @closetip2="closetip2"></yeser-tip> -->
    </div>
</template>

<script type="ecma6.0">
import headerComponent from '../../components/HeaderComponent';
// import yeserTip from './yeserTip'
let root = window || {},
    util = root.util || {};
 
export default {
	data(){
		return{
            focusStatus:false,
			title:"我的设备",
            list:false,
            noList:false,
			assetlists:[],
            asnumchecked:null,
            skuidchecked:null,
            providerIdchecked:null,
			spulists: [],
			skulists:[],
			tipTitle:'',
            hascard:false,
            isRepair: null,

			dialog:false,//sku列表弹层
            qwer:null,
            itemChe:false,
            messageDis:false,

            startBtn:true,//右上角 编辑按钮
            closeBtn:false,//右上角 完成按钮

            serviceBtn:true,//售后服务按钮
            serviceBox:false,//服务弹框

            editBox:false,//编辑按钮框
            buybox:true,//购买延保按钮框
    
            requestState: {
                deleteAsset: true
            },// 请求状态，用于ajax请求

            jumpPosibble:0,//是否可以跳转页面 0能 1不能
            btnNoclick:false,//按钮是否可点击状态

            txt_p:true,//商品名
            orivalName:'',//文本框原始内容
            serviceInx:null,//点击售后服务按钮记录该商品index值
            changeNameInx:-1,//点击修改名称按钮记录该商品index值
            len:999,
            curpg:1,
            rightmenus:{  
                  type: "text",
                  content: "",
            },
            btnState: 0

		}
	},
    computed: {
      cls: function () {
          let that = this;
                         
      }
    },
    mounted(){
        let that = this;
        
        
    },
	created() {
		this.hrefParma = util.getHrefParma();
		this.getAssetList();
	},
    directives: {
        focus: {
          update: function (el, {value}) {
            if (value) {
              el.focus()
            }
          }
        }
    },
	methods:{
      setHeadBarEdit(){
            var that = this;
              GomeJSBridge.ready(function(){
                let param = {
                  menus : {
                    rightMenus:[
                      {
                        type:'callback',
                        title:'编辑',
                        // icon:'http://gfs13.gomein.net.cn/T1Q8hQB7ZT1RCvBVdK.png',
                        data:{
                          id: 'btn1',
                          name: '编辑',
                          desc: '编辑'
                        }
                      }
                    ]
                  }
                };
                util.setHeadBar(param);
              },null);
        
              GomeJSBridge.onCallback(function(data){
                if(data.id == "btn1"){
                  that.setHeadBarOk();
                  that.addrAdd();          
                }
              })

     },
     setHeadBarOk(){
            var that = this;
              GomeJSBridge.ready(function(){
                let param = {
                  menus : {
                    rightMenus:[
                      {
                        type:'callback',
                        title:'完成',
                        // icon:'http://gfs13.gomein.net.cn/T1Q8hQB7ZT1RCvBVdK.png',
                        data:{
                          id: 'btn2',
                          name: '完成',
                          desc: '完成'
                        }
                      }
                    ]
                  }
                };
                util.setHeadBar(param);
              },null);
        
              GomeJSBridge.onCallback(function(data){
                if(data.id == "btn2"){
                  that.setHeadBarEdit();
                  that.addrAdd();             
                }
              })

     },
     addrAdd(){
           var that = this;
           if(!that.btnState){
                that.rightmenus={
                    type: "text",
                    content: "完成"
                };
                that.edit();
                that.btnState = 1;
           }
           else if(that.btnState){
                that.rightmenus={
                    type: "text",
                    content: "编辑"
                };
                that.complete();
                that.btnState = 0;
           }
      },
	/*初始化页面显示列表*/
	getAssetList(){
			let that=this;
			util.api({
	            surl:root.AS_API_PATH + 'asslist?len='+that.len+'&curpg='+that.curpg+'',
                 // surl: '/asset/asslist', 
	            type: 'get',
	            success: function(res) {
         
	            	let rpco=res.rpco;
	            	let body=res.body;

	            	switch(rpco){
	            		 case 200:
                            let aslist = body.aslist;
                            //判断列表是否显示
                            if(aslist.length>0){
                                        that.list=true;
                                        if(util.isApp()){
                                            that.setHeadBarEdit();
                                        }
                                        that.assetlists = aslist;

                                        that.rightmenus={
                                            type: "text",
                                            content: "编辑",
                                        };
                                  
                                    }else{
                                        that.list=false;
                                        that.noList=true;
                                        //右上角按钮
                                        that.startBtn = false;
                                        that.closeBtn = false;
                                    }  
                          break;
                          // 没有找到对应数据
                          case 404:
                              that.list=false;
                              that.noList=true;
                              //右上角按钮
                              that.startBtn = false;
                              that.closeBtn = false;
                              // 请求...
                                util.api({
                                    surl: root.MB_API_PATH + 'acclist',
                                    type: 'get',
                                    success: function(response) {
                                        var rpco = response.rpco,
                                            body;
                                        // 处理
                                        switch(rpco) {
                                            case 200:
                                                that.hascard = false;
                                                break;
                                            // 没有找到对应数据
                                            case 404:
                                                that.hascard = true;
                                                break;
                                            default:
                                                util.tip('查询失败')
                                        }
                                    }
                                });
                              break;
                          default:
                              util.tip('查询失败');
	                      	}
	            },
	            error: function(res) {
	            }
	        });
	},
	 /**
    * 获取延保SKU列表
    * @parma assetid 资产id
    */
    getAssetSku(assetid){
    	// console.log(assetid)
        var that = this;

        // debug start
        // var response = {
        //                     "rpco": 200,
        //                     "msg": "",
        //                     "body": {
        //                         "spulist": [{
        //                             "title": "延长保修",
        //                             "introurl": 'http://wap.dev.gomegj.com/v2/ybservice.html',
        //                             "skulist": [{
        //                                 "skuid":"123",
        //                                 "providerid":"123",
        //                                 "name":"延长保1年",
        //                                 "price":"6900",
        //                                 "promotion":1,
        //                                 "zhekou":5,
        //                                 "payPrice":1800,
        //                                 "disPrice":0,
        //                                 "providerId":11,
        //                                 "skuid":11
        //                             },{
        //                                 "skuid":"123",
        //                                 "providerid":"123",
        //                                 "name":"延长保2年",
        //                                 "price":"6900",
        //                                 "promotion":0,
        //                                 "zhekou":5,
        //                                 "payPrice":1800,
        //                                 "disPrice":7000,
        //                                 "providerId":22,
        //                                 "skuid":22
        //                             },{
        //                                 "skuid":"123",
        //                                 "providerid":"123",
        //                                 "name":"延长保3年",
        //                                 "price":"2690",
        //                                 "disPrice":null,
        //                                 "promotion":0,
        //                                 "zhekou":5,
        //                                 "payPrice":0,
        //                                 "providerId":33,
        //                                 "skuid":33
        //                             }]
        //                         }]
        //                     }
        //                 };
        // var rpco = response.rpco,
        //     body = response.body;
        // // 处理
        // switch (rpco) {
        //     case 200:
        //             if(body.spulist.length>0){
		      //       	that.spulists = body.spulist;
        //                 that.skulists = body.spulist[0].skulist;
                        
        //                 for(var n=0;n<that.skulists.length;n++){
        //                      // console.log(that.skulists.length);
        //                      if(that.skulists[n].disPrice/100>0){
        //                         // console.log(that.messageDis);
        //                          that.messageDis = true;
        //                     }
        //                 }
	       //      	}
        //             break;
        //     default:
        //         util.tip('服务器繁忙，请稍后再试');
        // }
        //debug end

        // 请求...skuid列表
        util.api({
            surl: root.AS_API_PATH + 'yb/getskus',
            data: {
                // assetid: '5001,3220124801'
                assetid: assetid
            },
            type: 'get',
            success: function (response) {
                var rpco = response.rpco,
                    body = response.body;
                // 处理
                switch (rpco) {
                    case 200:
                        if(body.spulist.length>0){
                            that.spulists = body.spulist;
                            that.skulists = body.spulist[0].skulist;
                        
                            for(var n=0;n<that.skulists.length;n++){
                                 console.log(that.skulists.length);
                                 if(that.skulists[n].disPrice/100>0){
                                    // console.log(that.messageDis)
                                     that.messageDis = true;
                                }
                            }
                        }
                        break;
                    default:
                        util.tip('服务器繁忙，请稍后再试');
                }
            }
        });
    },

    /**
     * 点击编辑
     */
    edit(){
        let that = this;
        //售后服务按钮
        that.serviceBtn = false;
        //编辑选钮框
        that.editBox = true;
        //右上角按钮
        that.startBtn = false;
        that.closeBtn = true;
        //购买延保按钮栏消失
        that.buybox = false;
        // 是否可以跳转页面
        that.jumpPosibble = 1;//不能
    },
    /**
     * 点击完成
     */
    complete(){
        let that = this;
        //售后服务按钮
        that.serviceBtn = true;
        //编辑按钮选框
        that.editBox = false;

        //右上角按钮
        that.startBtn = true;
        that.closeBtn = false;

        //购买延保按钮栏复现
        that.buybox = true;
        // 是否可以跳转页面
        that.jumpPosibble = 0;//能

        // 商品名展示框
        that.txt_p = true;
        //还原修改名称按钮index值为null，隐藏商品名修改框
        that.changeNameInx = -1;
        //其他编辑按钮是否可点击
        that.btnNoclick = false;
       //刷新设备列表
        that.getAssetList();
    },
    /**
     * 点击编辑名称
     */
    changeName(value,orivalName){
        let that = this;
        if(that.btnNoclick == true){
           return false;
        }
        // 商品名展示框
        that.txt_p = false;
        //初始化修改名称按钮index值，显示商品名修改框
        that.changeNameInx = value;
        //原始名
        that.orivalName = orivalName;
        //其他编辑按钮是否可点击 true不可以 false可以
        that.btnNoclick = true;
        //设置聚焦
        that.focusStatus = true;
    },
    /**
     * 点击完成 校验设备名称
     */
    editok(id,ashname){
        let that = this;
        
        // console.log(id);
        // console.log(ashname);
        // console.log(that.orivalName);
        // 有效性验证
        // 资产编号
        if(!id) {
            util.tip('设备编号有误');
            return false;
        }
        // 资产名称
        if(!id) {
            util.tip('资产名称不能为空');
            return false;
        }
        // 未发生变更
        if(ashname === that.orivalName) {
            //右上角按钮出现
            that.closeBtn = true;
            // 商品名展示框
            that.txt_p = true;
            //还原修改名称按钮index值为null，隐藏商品名修改框
            that.changeNameInx = -1;
            //其他编辑按钮是否可点击
            that.btnNoclick = false;
            util.tip('保存成功');
            return false;
        }

        //保存资产名称
        that._editok(id, ashname);
    },
    /**
    * 
    * 保存设备名称
    */
    _editok(id,ashname){
        let that = this;
        // 请求...
        util.api({
            surl: root.AS_API_PATH + 'modass',
            data: {
                id: id,
                ashname: ashname,
                state: util.OPT_STATE.UPDATE
            },
            type: 'post',
            success: function(response) {
                var rpco = response.rpco,
                    body;
                // 处理
                switch(rpco) {
                    case 200:
                        //右上角按钮
                        that.closeBtn = true;
                        // 商品名展示框
                        that.txt_p = true;
                        //还原修改名称按钮index值为null，隐藏商品名修改框
                        that.changeNameInx = -1;
                        //其他编辑按钮是否可点击
                        that.btnNoclick = false;
                        util.tip('保存成功');
                        break;
                    default:
                        //右上角按钮
                        that.closeBtn = true;
                        // 商品名展示框
                        that.txt_p = true;
                        //还原修改名称按钮index值为null，隐藏商品名修改框
                        that.changeNameInx = -1;
                        //其他编辑按钮是否可点击
                        that.btnNoclick = false;
                        util.tip('保存失败');
                }
            }
        });

    },
    /**
     * 删除设备
     * @parma {number}{1} id 资产编号
     */
    deleteAsset(id) {
        let that = this;
        if(that.btnNoclick == true){
           return false;
        }
        // 删除确认
        util.alert('确定要删除此设备吗？', {
            justOk: false,
            defBtnIndex: 1,
            okFn: function() {
                that._deleteAsset(id);
            }
        });
    },
    /**
     * 删除地址
     * @parma {number}{1} id 资产编号
     */
    _deleteAsset(id) {
        // console.log(id)
        let that = this;
        // 请求...
        util.api({
            surl: root.AS_API_PATH + 'modass',
            data: {
                id: id,
                state: util.OPT_STATE.DELETE
            },
            type: 'post',
            beforeSend: function() {
                that.requestState.deleteAsset = false;
            },
            success: function(response) {
                //response = response || {};
                var rpco = response.rpco,
                    body = response.body || {};
                // 处理
                switch(rpco) {
                    // 正常
                    case 200:
                        util.tip('删除设备成功');
                        that.getAssetList();
                        break;
                    default:
                        util.tip('删除失败')
                }
            },
            complete: function() {
                that.requestState.deleteAsset = true; 
            }
        });
    },
   
    /**
    *点击售后服务弹出选框
    **/
    lisBox(index,gdBrandId,gdCateId,gdId,gdnm,gdModel){
        let that = this;
        //初始化服务按钮index值，显示弹框
        that.serviceInx = index;

         // 获取维修能力查询参数
        util.api({
            surl:'/orderaftersales/yf/butJudge',
            type:'get',
            async: false,
            data:{
                gdBrandId:gdBrandId,
                gdCateId:gdCateId,
                gdId:gdId,
                gdnm:gdnm,
                gdModel:gdModel
            },
            success: function(response) {
                var rpco = response.rpco,
                    body = response.body;

                    that.isRepair = body.isRepair;
                    if(!body.isRepair){
                    	util.tip('该设备暂不支持维修')
                    }else{
                    	//出现关闭层（用来点击关闭弹框）
                        that.serviceBox = true;
                    }
            }
        });

    },
    /**
    *点击其他区域选框关闭
    **/
    closeserBox(){
        let that = this;
        //将服务按钮重设为null,关闭弹框
        that.serviceInx = null;
        //弹层关闭，关闭层消失
        that.serviceBox = false;
    },

    /**
      * 跳转会员卡列表
      */
     jumpAcclist(){
         util.href('./acclist.html');
     },

    /**
     * 跳转维修订单页
     */
    jumpRepairinfo(gdBrandId,gdCateId,gdid,gdnm,dodt,price,num){
        let that=this;
        util.href('repairsubmitorder.html',{
            //品牌id
            gdBrandId: gdBrandId,
            //分类
            gdCateId: gdCateId,
            //商品skuid
            gdid: gdid,
            //商品名称
            gdnm: gdnm,
            //购买时间
            dodt: dodt,
            //设备名称(可不传)
            gdModel: '',
            //三级区域code(可不传)
            code: null,
            //商品数量
            gdnu: num,
            //商品金额
            amount: price
        });
    },
    /**
     * 跳转维修主页
     */
    jumpIndex(){
        let that = this;
        util.href('repairindexnew.html')
    },
    /**
     * 跳转回收
     */
    // jumpRecycleindexnew(){
    //     let that=this;
    //     util.href('recycleindexnew.html');
    // },
 
    /**
     * 点击自定义添加设备按钮 跳转页面
     */
    jumpAddequipment(){
        let that = this;
        util.href('addequipment.html');
    },
    /**
    * 点击列表栏某一条目，跳转商品详情
    */
    jumpAssetdetail(id,asnum,changeNameInx){
        let that =this;
        if(that.jumpPosibble>0){return false};
        util.href('equipmentdetail.html', {id: id,asnum: asnum});
    },
     /**
    * 点击购买维修。跳转维修页面
    */
    // tclrepairsubmit(goodsid,asnum){
    //     let that = this;

    //     util.href('tclrepairsubmit.html',{
    //                     assetid:goodsid,
    //                     serial:asnum
    //                 })
    // },
    /**
    * 点击购买延保。弹出遮罩层
    */
    openTip(assetid,brdnm,id){
        let that = this;
        that.id = id;
        that.dialog = true;
        that.tipTitle = brdnm;
        that.asnumchecked = assetid;
        that.getAssetSku(assetid)
    },
    /**
    * 关闭弹出遮罩层
    */
    closeTip(){
        let that = this;
        that.dialog = false;
        that.skuidchecked = '';
        // 关闭弹层是取消弹层中服务及按钮选中状态
        that.qwer = null;
        that.itemChe = false;
    },
    /**
    * 选择延保类型，并记录编号 skuid providerId
    */
    skuCheck(skuid,providerId,index){
        let that = this;
        that.qwer = index;
        that.itemChe = true;
        that.skuidchecked = skuid;
        that.providerIdchecked = providerId;
        // console.log(that.asnumchecked);
        // console.log(that.skuidchecked);
        // console.log(that.providerIdchecked);
    },
    /**
    * 点击购买按钮，跳转提交页面
    */
    buyYanbao(){
        let that = this;
        if(!that.skuidchecked){
           return false;
        }
        util.href('./assybsubmit.html',{
                    id :that.id,
                    assetid: that.asnumchecked,
                    skuid: that.skuidchecked,
                    providerid: that.providerIdchecked
        });
    },
		
	},
	components: {
		headerComponent,
		// yeserTip
	}
}
</script>
<style lang="less">
	@import '../../util/fs.less';

	html,body{
		width: 100%;
        height: 100%;
	}
    #myequipment{
        padding-top: 1.173333rem;
    }

    #myequipment .right {
        display: inline-block;
        height: 1.17rem;
        line-height: 1.173333rem;
        position: fixed;
        top: 0;
        right: 0;
        color: #FF4B41;
        .mixinfont(15px);
        text-align: center;
        min-width: .4rem;
        font-size: 0.426667rem;
        padding: 0 0.4rem;
        z-index: 1001;
        background-color: #fff;
    }

	#myequipment{
		width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding-top: 1.173333rem;
        background-color: #fff;
	}

	#myequipment .container {
        min-width: 320px;
        background-color: #fff;
        overflow-x: hidden;
        overflow-y: auto;
        height: 100%;
        -webkit-overflow-scrolling: touch;
        box-sizing: border-box;
        padding-bottom: 1.333333rem;
    }

    #myequipment .outder{
        width: 100%;
        background-color: #F8F8F8;
        .list-text{
            box-sizing: border-box;
            height: 2.346667rem;
            padding: 0.16rem 0.266667rem 0.16rem 2.293333rem;  
            position: relative;
            .pic{
                width: 2.026667rem;
                height: 2.026667rem;
                position: absolute;
                top: 0.16rem;
                left: 0.266667rem;
                img{
                    width: 100%;
                    height: 100%;
                }
                .inpicState{
                    width: 1.2rem;
                    height: 1.2rem;
                    position: absolute;
                    background: url(//gfs10.gomein.net.cn/T17pJ_B5hT1RCvBVdK.png) no-repeat;
                    top: 0;
                    left: 0;
                    background-size: 100%;
                    background-position: -.25rem -.25rem;
                }
                .outpicState{
                    width: 1.2rem;
                    height: 1.2rem;
                    position: absolute;
                    background: url(//gfs13.gomein.net.cn/T1O5JQByAT1RCvBVdK.png) no-repeat;
                    top: 0;
                    left: 0;
                    background-size: 100%;
                    background-position: -.25rem -.25rem;
                }
            }
            .liri{
                width: 100%;
                box-sizing: border-box;
                padding-left: 0.266667rem;
            } 
            .txt_tit{
                box-sizing: border-box;
                height: 1.15rem;
                .txt-ipt{
                    width: 5.04rem;
                    /*height: 0.853333rem;*/
                    /*line-height: 0.426667rem;*/
                    padding:0;
                    color: #333;
                    font-size: 0.346667rem;
                    resize: none;
                    background-color: #F8F8F8;
                    margin-bottom:0.2rem;
                    word-wrap: break-word;
                    /*超出两行显示省略号*/
                    overflow : hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
                .txt-ipting{
                    width: 7.04rem;
                    /*height: 0.9rem;*/
                    /*line-height: 0.45rem;*/
                    background-color: #fff;
                    box-sizing: border-box;
                    padding: 0 0.213333rem;
                    font-size: 0.346667rem;
                    resize: none;
                    border-radius: 0.14rem;
                    margin-bottom: 0.1rem;
                }
                span{
                    color: #FF4B41;
                    font-size: 0.346667rem;
                    line-height: 0.48rem;
                    position: absolute;
                    top: 0.16rem;
                    right: 0.266667rem;
                    margin-bottom:1.706667rem;
                }
            }   
            .boxer{
                position: absolute;
                top: 0.8rem;
                right: 0.533333rem;
                z-index: 1003;
            }
            .fuwu-box{
                border-radius: 5px;
                overflow: hidden;
                box-sizing: border-box;
                background-color: #4A4848;
                padding: 0 .15rem;
                li{
                    width: 2.666667rem;
                    height: 1.066667rem;
                    background-color: #4A4848;
                    font-size: 0.4rem;
                    line-height: 1.066667rem;
                    color:#F7F7F7 ;
                    text-align: center;     
                }
                li:not(:last-of-type){
                    border-bottom:1px solid #5B5A5D;
                }
            }
            span.sanjiao{
                display: inline-block;
                width: 0.266667rem;
                height: 0.266667rem;
                background-color: #4A4848;
                position: absolute;
                top: -0.133333rem;
                right: 0.333333rem;
                transform:rotate(45deg);
            }
            .txt-itm{
                font-size: 0.32rem;
                line-height: 0.426667rem;
                color: #999;
                width: 5.04rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-bottom: 0.026667rem;
            }     

        }

        .buyBox{
            height: 1.386667rem;
            background-color: #fff;
            box-sizing: border-box;
            padding: 0 0.266667rem;
            position: relative;
            span{
                color: #FF4B41;
                font-size: 0.346667rem;
                line-height: 1.386667rem;
            }
            .buyBtn{
                display: inline-block;
                width: 1.92rem;
                height: 0.746667rem;
                line-height: 0.746667rem;
                text-align: center;
                border-radius: .9rem;
                position: absolute;
                border: 1px solid #FF4B41;
                top: 0.333333rem;
                right: 0.266667rem;
            }
        }

        .edit-box{
            height: 1.386667rem;
            background-color: #fff;
            text-align: right;
            box-sizing: border-box;
            padding: 0 0.266667rem;
            span{
                display: inline-block;
                width: 1.92rem;
                height: 0.746667rem;
                line-height: 0.746667rem;
                text-align: center;
                border-radius: .9rem;
                border: 1px solid #DDD;
                color: #666;
                font-size: 0.346667rem;
                margin-top: 0.333333rem;
                margin-left: 0.16rem
            }
            .noclick{
                color: #DDD;
            }
            .success-btn{
                border: 1px solid #FF4B41;
                color: #FF4B41;
            }

        }
    } 

    #myequipment .addBtn{
        width: 100%;
        height: 1.306667rem;
        line-height: 1.306667rem;
        background-color: #FF4B41;
        text-align: center;
        font-size: 0.48rem;
        color: #fff;
        position: fixed;
        bottom: 0;
        left: 0;
    }
    
    #myequipment .closeserbox{
        width:100%;
        height:100%;
        position:fixed;
        top: 0;
        right:0;
        z-index:1002;
     }


    #myequipment .nolist{
        width: 100%;
        height: 100%;
        background-color: #fff;
        padding-top: 1.066667rem;
        box-sizing: border-box;
        .tu{
            width: 4.6rem;
            height: 5.2rem;
            margin: 0 auto;
            .i{
                display: inline-block;
                width: 100%;
                height: 100%;
                background: url(//gfs13.gomein.net.cn/T1PCA_ByAT1RCvBVdK.png) no-repeat;
                background-size: contain;
            }
        }
        .wenTop{
            text-align: center;
            font-size: 0.48rem;
            line-height: 0.666667rem;
            color: #333;
        }
        .wen{
            text-align: center;
            font-size: 0.373333rem;
            line-height: 0.533333rem;
            color: #666;
            margin-bottom: 0.533333rem;
            margin-top: .1rem;
        }
        .btn-box{
            padding-top: 1.733333rem;
            box-sizing: border-box;
            .btn{
                width: 7.866667rem;
                height: 1.066667rem;
                line-height: 1.066667rem;
                text-align: center;
                color: #FF4B41;
                font-size: 0.426667rem;
                border-radius: 0.95rem;
                margin-left: 1.066667rem;
                border: 1px solid #FF4B41;
                background-color: #fff;
                margin-bottom: 0.666667rem;
            }
        }
    }

    
    #myequipment .area-dialog{
         .tod {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        .dib {
            display: inline-block;
        }
        .wp70 {
            width: 70%;
            color: #333;
        }
    	.yanbao-wrap {
            position: absolute;
            top: 1.2rem;
            bottom: 1.733333rem;
            overflow-y: scroll;
            width: 100%;

            .yanbao-item {
                padding-top: 0.133333rem;
                overflow: hidden;

                .yanbao-item-title {
                    height: 0.933333rem;
                    line-height: 0.933333rem;
                    padding: 0 0.32rem;
                    border-bottom: 1px solid #e9e9e9;
                    position: relative;
                      .text {
                         font-size: 0.426667rem;
                      }
                      .desc {
                         font-size: 0.373333rem;
                         color: #777;
                         position: absolute;
                         right: 0.32rem;
                         top: 0;
                         display: block;
                      }
                      .desc:after {
                         content: '';
                         margin-left: .08rem;
                         background: url(//img.dev.gomegj.com/guanjia/v2/ybjt.png) no-repeat right center;
                         width: .186666rem;
                         height: 0.346667rem;
                         background-size: 100%;
                         display: inline-block;
                      }
                }

                .yanbao-itme-con .yanbao-sublist {
                     padding-top: 0.266667rem;

                     .yanbao-subitem {
                          margin-bottom: 0.266667rem;
                          width: 45%;
                          line-height: 0.8rem;
                          text-align: center;
                          position: relative;
                          background-color: #f3f3f3;
                          border: 1px solid #f3f3f3;
                          box-sizing: border-box;
                          border-radius: 0.133333rem;
                          float: left;
                          display: inline-block;
                          margin-left: 3%;
                          display: table-cell;
            
                            .yanbao-subitem-innerbox{
                                width: 90%;
                                height: 100%;
                                margin-left: 7%;
                                span {
                                  display: block;
                                }
                               .text {
                                  font-size: .0.003733rem;
                                  text-align: left;
                                }
                               .price {
                                  color: #ff4b46;
                                  font-size: 0.32rem;
                                  text-align: -webkit-left;
                                  text-align: left;
                                  span {
                                      font-size: 0.133333rem;
                                      display:inline-block;
                                      padding: .026666rem;
                                      line-height: 100%;
                                      vertical-align: middle;
                                  }
                                  .yb-detailMoney {
                                      display: inline-block;
                                      margin-right: 0.16rem;
                                      font-size: 0.32rem;
                                   }
                                  .yb-th {
                                       font-size: 0.293333rem;
                                       padding: 0.03rem 0.16rem;
                                       background-color: #ff4b46;
                                       vertical-align: middle;
                                       color: #fff;
                                       display: inline-block;
                                       line-height: 100%;
                                       border-radius: 3px;
                                   }
                                }
                                .hot {
                                    width: 0.56rem;
                                    height: 0.373333rem;
                                    background: url(//img.dev.gomegj.com/guanjia/v2/ybhot.png) no-repeat;
                                    background-size: 100%;
                                    display: block;
                                    position: absolute;
                                    right: -0.186667rem;
                                    top: -0.186667rem;
                                }
                            }
                              
                          
                    }
                    .checked {
                       border: 1px solid #ff4b46;
                    }
                    .checked:after {
                       content: '';
                       background: url(//img.dev.gomegj.com/guanjia/v2/ybcheck.png) no-repeat;
                       width: 0.533333rem;
                       height: 0.533333rem;
                       background-size: 100%;
                       position: absolute;
                       top: 0;
                       left: 0;
                    }
                }
            }

            .ybEnd-Message {
                font-size: 0.32rem;
                color: #818181;
                padding: 0 0.533333rem;
            }

            
        }

        .yanbao-buy-box {
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 1.733333rem;

                .yanbao-buy-btn {
                    margin-top: 0.266667rem;
                    margin-left: auto;
                    margin-right: auto;
                    width: 90%;
                    height: 1.2rem;
                    line-height: 1.2rem;
                    text-align: center;
                    font-size: 0.48rem;
                    color: #fff;
                    background: #f3f3f3;
                    border-radius: 3px;
                }
                .checked {
                    background: #ff4b46;
                }
         }
    }
    

</style>