<template>
	<div id="equipmentdetail" class="wapper recycle-wapper">
	    <!-- <header-component :title="instrData.headTxt"></header-component>
        <button class="right" v-if="eqType==2" @click="edit" v-show="editBtn">编辑</button>
        <button class="right" v-if="eqType==2" @click="_complete" v-show="completeBtn">完成</button> -->
        <header-component :title="instrData.headTxt" :rightmenus="rightmenus"  @watchlist="addrAdd"></header-component>

        <div class="container">
            <div class="picBox">
                <img :src="asimgu">
                <uploadone @watchupload="loadAssetPic" v-show="completeBtn"></uploadone>
            </div>

            <ul class="serItembox">
                <li class="serItem" @click="jumpElectrcard(editing)" v-show="entryType.card">
                    <div class="leftpc">
                        <img src="//gfs12.gomein.net.cn/T19udvBbxv1RCvBVdK.png">
                    </div>
                    <p>电子保修卡</p>
                    <p>实时管理产品保修信息及期限</p> 
                    <i v-show="!editing"></i>
                </li>
                <li class="serItem" @click="jumpInvoicedetail(editing)" v-show="isInvoiceNum">
                    <div class="leftpc">
                        <img src="//gfs10.gomein.net.cn/T1BidvByb_1RCvBVdK.png">
                    </div>
                    <p>电子发票</p>
                    <p>查看电子发票详情</p> 
                    <i class="editI" :class="{'bor-col':editing}"></i>
                    <uploadtwo @watchupload="loadInvoicPic" v-show="completeBtn"></uploadtwo>
                </li>
                <li class="serItem" @click="jumpInstruction(editing)" v-show="entryType.struction">
                    <div class="leftpc">
                        <img src="//gfs12.gomein.net.cn/T1eQdvBQbv1RCvBVdK.png">
                    </div>
                    <p>产品说明书</p>
                    <p>快速了解产品使用</p> 
                    <i v-show="!editing"></i>
                </li>
                <!-- 本期不做此功能 -->
                <li class="serItem" v-show="false">
                    <div class="leftpc">
                        <img src="//gfs10.gomein.net.cn/T1CfdvB_Cv1RCvBVdK.png">
                    </div>
                    <p>服务记录</p>
                    <p>监控您当前的智能设备</p> 
                    <i v-show="!editing"></i>
                </li>
            </ul>

            <ul class="">
                <li class="assetMessage">
                    品牌<span>{{ brandTitle }}</span>
                </li>
                <li class="assetMessage">
                    型号<span>{{ model }}</span>
                </li>
                <li class="assetMessage">
                    购买日期
                    <!-- <span>{{ phtm }}</span> -->
                    <!-- <input type="text" name="" :class='{"inpShow": editBtn,"inpChange": completeBtn}' :value='phtm' v-model='phtm' @change='primte(phtm,"date")' :readonly='editBtn'>  -->
                    <div id="GMtime" class="input" :class='{"inpShow": editBtn,"inpChange": completeBtn,"clickCan":editBtn}'>{{ phtm }}</div>
                </li>
                <li class="assetMessage">
                    商品序列码 
                    <!-- <span>{{ slnum }}</span> -->
                    <input type="text" name="" :class='{"inpShow": editBtn,"inpChange": completeBtn}' :value='slnum' v-model='slnum' @change='primte(slnum,"num")' :readonly='editBtn'> 
                </li>
            </ul>
        </div>

        <div class="bot_footer">
                <a href="javascript:;" @click="jumpCleanlistnew()">
                    <div class="nav-bar"><i class="i_clean"></i> <span class="txt">清洗保养</span></div>
                </a>
                <!-- <a href="">
                    <div class="nav-bar"><i class="i_pei"></i> <span class="txt">配件</span></div>
                </a> -->
                <a href="javascript:;" @click="jumpRepairindexnew()">
                    <div class="nav-bar"><i class="i_repair"></i> <span class="txt">维修</span></div>
                </a>
                <a href="javascript:;" @click="jumpRecycleindexnew()">
                    <div class="nav-bar"><i class="i_recyle"></i> <span class="txt">回收</span></div>
                </a>
        </div>
    </div>
</template>

<script type="ecma6.0">
import headerComponent from '../../components/HeaderComponent';
import uploadone from './uploadone';//上传商品图片组件（内部对 图片数量进行控制）
import uploadtwo from './uploadtwo'//上传电子发票组件（内部对 图片数量进行控制，上传按钮文案 进行控制）

let root = window || {},
    util = root.util || {};
 
export default {
	data(){
		return{
            asimgu:'',//商品图片
            tempasimgu:'',//临时存储图片地址
            einvoiceUrl: '',//发票图片图
            invicemgu:'',//电子发票图片
            editBtn:true,
            completeBtn:false,

            editing:false,
            // 电子说明书数据
            instrData: {
                // 分组编号
                gid: 0,
                // 文档编号
                did: 0,
                // 终端类型
                tmid: 536940544,
                // 文档标题
                headTxt: ''
            },
            //服务入口列表
            entryType:{
                 card:false,
                 ele:false,
                 struction:false
            },
            isInvoiceNum:true,
            // 可支持服务功能 1:电子保修卡  2:产品说明书  3:电子发票
            asmus:[],
            //品牌
            brandTitle: '',
            //设备来源，是否为用户添加,默认不是
            eqType: 1,
            //型号名
            model:'',
            //唯一序列码
            slnum:'',
            //原始序列码
            oriSlnum:'',
            //购买时间
            phtm:'',
            //原始时间
            oriPhtm:'',
            //订单来源
            source:null,
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
	created() {
        let that =this;
		this.hrefParma = util.getHrefParma();
        // 请求设备详情
        that.getAssetDetail(this.hrefParma.id);
		
	},
     mounted(){
        let that = this;
        // that.rightmenus={
        //     type: "text",
        //     content: "编辑",
        // };
        
        
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
                  that.addrAdd();   
                  setTimeout(function(){
                     that.setHeadBarOk();
                  },300)         
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
                  that.addrAdd();   
                  setTimeout(function(){
                     that.setHeadBarEdit();
                  },300)          
                }
              })

     },
     addrAdd(){
           var that = this;
           if(!that.btnState){
                that.edit();
                that.btnState = 1;
                that.rightmenus={
                    type: "text",
                    content: "完成"
                };
           }
           else if(that.btnState){
                that._complete();
                that.btnState = 0;
                that.rightmenus={
                    type: "text",
                    content: "编辑"
                };
           }
      },
        /**
       * 加载资产详情
       * @parma {number}{1} asnum 资产编号
       */
        getAssetDetail: function(id) {
        let that = this;

        // debug start
            // var response = {
            //         "rpco": 200,
            //         "msg": "",
            //         "body": {
            //                 "gid": 10,
            //                 "did": 100,
            //                 "asname": "三星note4",
            //                 //显示的资产名
            //                 "ashname": "三星note4",
            //                 //资产图片路径
            //                 "asimgus": ["http://img.gomein.net.cn/images/ui/gomelogo.png"],
            //                 "asdmlist": [1, 2, 3, 4],
            //                 "spid":1,
            //                 "spnm":"安贞店",
            //                 "spepnb":"1223455",
            //                 "spepnm":"张三",
            //                 "svtplst": [1,2,3,4,5],
            //                 //电子发票
            //                 "einvoice":"",
            //                 //发票id
            //                 "einvoiceNO": 23123213213,
            //                 "einvoicePdf":"mm/ee.pdf",
            //                 "einvoiceNO":"3334",
            //                 "brandTitle":"三星",
            //                 "model":"5s",
            //                 "phtm":1222233,
            //                 "slnum":"",
            //                 "id":"32323",
            //                 "source ":2,
            //                 "asmus": [1,2,3],
            //                 //类型,1订单中台推送数据,2用户创建数据.
            //                 "type": 1
            //         }
            // }
            // var rpco = response.rpco,
            //     body = response.body || {};
            // // 处理
            // switch(rpco) {
            //     // 正常
            //     case 200:
            //         // 重新加载地址列表
            //         that.asimgu = body.asimgus[0];
            //         that.originUrl = body.asimgus[0];

            //         that.instrData.gid = body.gid;
            //         // 文档编号
            //         that.instrData.did = body.did;
            //         // 文档标题
            //         that.instrData.headTxt = body.ashname;
            //         // 发票id
            //         that.invoiceId = body.einvoiceNO;
            //         // 发票图片
            //         that.einvoiceUrl = body.einvoice;
            //         // 支持的服务功能列表
            //         // that.asmus = body.asmus;
            //         for(var i=0;i<body.asmus.length;i++){
            //             switch(body.asmus[i]){
            //                 case 1:
            //                   that.entryType.card = true;
            //                 break;
            //                 case 2:
            //                   that.entryType.struction = true;
            //                 break;
            //                 case 3:
            //                   that.entryType.ele = true;
            //                 break;
            //             }
            //         }
            //         //品牌名
            //         that.brandTitle = body.brandTitle;
            //         //类型,1订单中台推送数据,2用户创建数据.
            //         that.eqType = body.type;
            //         //点歌单来源
            //         that.source = body.source;
            //         //品牌名
            //         //
            //         //型号
            //         //
            //         //购买日期
            //         //
            //         //序列码
            //         //
            //         break;
            //     default:
            //         util.tip('查询失败');
            //         util.href('myequipment.html');
            // }
            // return;
        // debug end



        // 请求...
        util.api({
            surl: root.AS_API_PATH + 'assdtal',
            data: {
                id: id
            },
            type: 'get',
            success: function(response) {
                //response = response || {};
                var rpco = response.rpco,
                    body = response.body || {};
                // 处理
                switch(rpco) {
                    // 正常
                    case 200:
                            // 重新加载地址列表
                            that.asimgu = body.asimgus[0];
                            that.originUrl = body.asimgus[0];
        
                            that.instrData.gid = body.gid;
                            // 文档编号
                            that.instrData.did = body.did;
                            // 文档标题
                            that.instrData.headTxt = body.ashname;
                            // 发票id
                            that.invoiceId = body.einvoiceNO;
                            // 发票图片
                            that.einvoiceUrl = body.einvoice;
                            // 支持的服务功能列表
                            // that.asmus = body.asmus;
                            for(var i=0;i<body.asmus.length;i++){
                                switch(body.asmus[i]){
                                    case 1:
                                      that.entryType.card = true;
                                    break;
                                    case 2:
                                      that.entryType.struction = true;
                                    break;
                                    // case 3:
                                    //   that.entryType.ele = true;
                                    // break;
                                }
                            }
                            //品牌名
                            that.brandTitle = body.brandTitle;
                            // 型号名
                            that.model = body.model;
                            //唯一序列码
                            that.slnum = body.slnum;
                            that.oriSlnum = body.slnum;
                            //购买时间
                            that.phtm = util.formateDate(body.phtm, 'yyyy-MM-dd');
                            console.log(that.phtm)
                            that.oriPhtm = util.formateDate(body.phtm, 'yyyy-MM-dd');
                            //类型,1订单中台推送数据,2用户创建数据.
                            that.eqType = body.type;
                            //点歌单来源
                            that.source = body.source;
                            //订单号
                            that.otn = body.otn;
                            //品牌名
                            //
                            //型号
                            //
                            //购买日期
                            //
                            //序列码
                            // 判断是否为用户添加的设备 若是 显示发票入口
                            if(that.eqType == 2){
                                that.isInvoiceNum = true;
                                that.rightmenus.content = '编辑';
                                if(util.isApp()){
                                    that.setHeadBarEdit();
                                }
                            }else{
                                // 判断获取的设备是否有发票号,若无发票号  入口隐藏
                                if(!that.invoiceId&&!that.otn){
                                    that.isInvoiceNum = false;
                                }
                                that.rightmenus.content = '';
                            }

                        break;
                    default:
                        util.tip('查询失败');
                        setTimeout(function() {
                            util.href('myequipment.html');
                        },500)
                }
            }
        });

       },

        /**
         * 进入编辑状态
         */
        edit(){
           let that =this;
           that.editBtn = false;
           that.completeBtn = true;
           // 编辑中  所有页面跳转不可点
           that.editing = true;
        },  
        //存储用户即将上传的商品图片地址
        loadAssetPic(mes){
            let that = this;
            that.assetPicUrl=mes;
            //将商品图片替换
            that.asimgu = that.assetPicUrl[0];
            // 临时存储，用于提交
            that.tempasimgu = that.assetPicUrl[0];
        },
        //存储用户即将上传的电子发票图片地址
        loadInvoicPic(mes){
            let that = this;
            that.invoicPicUrl=mes;
            //发票地址
            that.invicemgu = that.invoicPicUrl[0];
        },
        // 更改日期
        primte(value,type){
            let that = this;
            switch(type){
                case 'date':
                that.phtm = value;
                break;
                case 'num':
                that.slnum = value;
                break; 
            }
        },
        /**
         * 点击完成按钮 校验
         */
        _complete(){
           let that =this,
               // 日期正则
               DATE_REG = /^(19[7-9][0-9]|2\d{3})-([1-9]|0[1-9]|1[0-2])-([1-9]|[0-2][0-9]|3[0-1])$/,
               Num_Reg = /[0-9A-Z]{10,20}$/;

           //日期校验
           // if( that.phtm&&!DATE_REG.test(that.phtm) ){
           //     util.tip('日期支持格式为“xxxx-xx-xx”');
           //     return false;
           // };
           //序列码
           // if( that.slnum&&!Num_Reg.test(that.slnum) ){
           //     util.tip('序列码格式不正确');
           //     return false;
           // };
            
           that.editBtn = true;
           that.completeBtn = false;
           // 编辑完成  所有页面跳转恢复
           that.editing = false;


           let dataBoudy = {
                  //资产编号
                  id: that.hrefParma.id,
                  //商品图片地址             
                  gdiul: that.asimgu,
                  //发票图片地址
                  ivimg: that.invicemgu,
                  // 购买日期
                  phtm: $("#GMtime").html(),
                  // 商品序列码
                  slnum: that.slnum,
                  // 更改信息状态
                  state: util.OPT_STATE.UPDATE,

           };
           //转时间戳
           dataBoudy.phtm = new Date(dataBoudy.phtm.replace(/-/g, '/')).getTime()+'';
           console.log(dataBoudy);
           if( that.tempasimgu || that.invicemgu || that.oriSlnum!=$("#GMtime").html() || that.oriPhtm!=that.phtm){
                that.complete(dataBoudy);
           }
                
        },
        complete(dataBoudy){
           let that =this;

           // 请求...
            util.api({
             surl: root.AS_API_PATH + 'modass',
             data: dataBoudy,
             type: 'post',
             success: function(response) {
                 var rpco = response.rpco,
                     body;
                 // 处理
                 switch(rpco) {
                     case 200:
                         util.tip('保存成功');
                         that.getAssetDetail(that.hrefParma.id);
                         break;
                     default:
                         util.tip('保存失败');
                 }
             }
           });
           
        },
        /**
         * 跳转电子保修卡
         */
        jumpElectrcard(editState){
            let that=this;
            if(editState){return false};
            util.href('electrcard.html', {id: that.hrefParma.id});
        },
        
        /**
         * 跳转电子发票详情
         */
        jumpInvoicedetail(editState){
            let that=this;
            if(editState){return false};
            
            if(that.eqType==2&&!that.einvoiceUrl){
                util.tip('您还没有上传发票哦~');
            }
            else if(that.eqType==2&&that.einvoiceUrl){
                setTimeout(function(){
                    util.href('invoicedetail.html', {
                        einvoiceUrl: that.einvoiceUrl,
                        gd: 1
                    });
                }, 200)
            }
            else{
                
                /***检测非用户添加的设备是否已开票***/
                let dataBody = {
                        //发票号码
                        'invoiceNo': that.invoiceId,
                        //订单类型
                        'orderType': that.source,
                        //订单来源
                        'ordersource': that.source,
                        //订单号
                        'orderId': that.otn
                };
                // 订单类型或订单来源不存在时，不传
                if(dataBody.orderType==null){
                    delete dataBody.orderType;
                }else{
                    String(dataBody.orderType);
                }
    
                if(dataBody.ordersource==null){
                    delete dataBody.ordersource;
                }else{
                    String(dataBody.ordersource);
                }

                if(dataBody.invoiceNo==null){
                    delete dataBody.invoiceNo;
                }else{
                    String(dataBody.invoiceNo);
                }

                if(dataBody.orderId==null){
                    delete dataBody.orderId;
                }else{
                    String(dataBody.orderId);
                }

                util.api({
                    surl:root.EINVOICE_API_PATH + 'detail',
                    type:'get',
                    data:dataBody,
                    success:function(res) {
                        var rpco = res.rpco,
                            body = res.body;
                        // 处理
                        switch(rpco) {
                            case 200:
                                if(body.invoiceImgUrl){
                                     setTimeout(function(){
                                        util.href('invoicedetail.html', {
                                            invoiceId: that.invoiceId,
                                            orderSource: that.source,
                                            orderType: that.source,
                                            orderId: that.otn
                                        });
                                    }, 200)
                                } else{
                                    util.tip('正在为您打印电子发票，请稍后查看~');
                                }
                            break;
                            default:
                                util.tip('正在为您打印电子发票，请稍后查看~');
                            break;
                        }
                    }
                })
                /***  ***/
                
            }
    
        },

        /**
         * 跳转电子说明书
         */
        jumpInstruction(editState){
            let that=this;
            if(editState){return false};
            that.instrData.gid && util.href('directiondetail.html', {
                isFav: 0, 
                gdid: 0, 
                docid: that.instrData.gid, 
                did: that.instrData.did, 
                cname: encodeURI(that.instrData.headTxt), 
                isAsset:2
            });
        },

        /**
         * 跳转清洗
         */
        jumpCleanlistnew(){
            let that=this;
            util.href('cleanlistnew.html');
        },

        /**
         * 跳转维修
         */
        jumpRepairindexnew(){
            let that=this;
            util.href('repairindexnew.html');
        },
        /**
         * 跳转回收
         */
        jumpRecycleindexnew(){
            let that=this;
            util.href('recycleindexnew.html');
        },

		
	},
	components: {
		headerComponent,
        uploadone,
        uploadtwo
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

    #equipmentdetail .right {
        display: inline-block;
        height: 1.173333rem;
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

	#equipmentdetail{
		width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding-top: 1.173333rem;
        background-color: #fff;
	}

	#equipmentdetail .container {
        min-width: 320px;
        background-color: #f5f5f5;
        overflow-x: hidden;
        overflow-y: auto;
        // height: 100%;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 50px;
    }

    #equipmentdetail {
        .picBox{
             margin-bottom: 0.266667rem;
             height: 10.0rem;
             position: relative;
             img{
                 width: 100%;
                 height: 100%;
             }
        }    

        .serItembox{
            margin-bottom: 0.266667rem;
        } 

        .serItem{
            height: 2.133333rem;
            background-color: #fff;
            margin-bottom: 1px;
            padding:0.4rem 0.4rem 0.4rem 2.133333rem;
            position: relative;
            box-sizing: border-box;
            .leftpc{
                position: absolute;
                left: 0.4rem;
                top: 0;
                height: 100%;
                padding: 0.4rem 0;
                box-sizing: border-box;
                img{
                    width: 1.333333rem;
                    height: 1.333333rem;
                }
            }
            p{
                line-height: 0.64rem;
                color: #777;  
                font-size: 0.373333rem;
            }
            p:first-of-type{
                color: #333;
                font-size: 0.426667rem;
            }
              .editI{
                width: 0.22rem;
                height: 0.22rem;
                position: absolute;
                right: 0.4rem;
                top: 50%;
                transform: translateY(-30%);
                // transform: rotate(45deg) translateY(-50%);
                // -webkit-transform: rotate(45deg) translateY(-50%);
                // border: .01rem solid #FF4B41;
                //  border-left-color: transparent;
                // border-bottom-color: transparent;
            }
            .editI:before{
                content:"";
                position: absolute;
                width: 100%;
                height: 100%;
                border: 1px solid #333;
                // border-radius: 5px;
                -webkit-transform-origin: 0 0; 
                -moz-transform-origin: 0 0; 
                -ms-transform-origin: 0 0; 
                transform-origin: 0 0; 
                -webkit-transform: scale(0.5 0.5); 
                -ms-transform: scale(0.5 0.5); 
                -o-transform: scale(0.5 0.5); 
                transform: scale(0.5 0.5); 
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                transform: rotate(45deg) translateY(-50%);
                -webkit-transform: rotate(45deg) translateY(-50%);
                border-left-color: transparent;
                border-bottom-color: transparent;
            }
            .bor-col:before{
                content:"";
                position: absolute;
                width: 100%;
                height: 100%;
                border: 1px solid #ff0000;
                // border-radius: 5px;
                -webkit-transform-origin: 0 0; 
                -moz-transform-origin: 0 0; 
                -ms-transform-origin: 0 0; 
                transform-origin: 0 0; 
                -webkit-transform: scale(0.5 0.5); 
                -ms-transform: scale(0.5 0.5); 
                -o-transform: scale(0.5 0.5); 
                transform: scale(0.5 0.5); 
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                transform: rotate(45deg) translateY(-50%);
                -webkit-transform: rotate(45deg) translateY(-50%);
                border-left-color: transparent;
                border-bottom-color: transparent;
            }
            .editSpan{
                color: #FF4B41;
                font-size: 0.4rem;
                line-height: 0.56rem;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: .75rem;
            }
        }

        .assetMessage{
            margin-bottom: 1px;
            height: 1.2rem;
            padding: 0.32rem 0.4rem;
            box-sizing: border-box;
            font-size: 0.4rem;
            line-height: 0.56rem;
            background-color: #fff;
            span{
                float: right;
                max-width: 65%;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                color: #333;
            }
            input{
                float: right;
                max-width: 65%;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                text-align: right;
            }
            .input{
                float: right;
                max-width: 65%;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                text-align: right;
            }
            .clickCan{
                 pointer-events: none;
            }
            .inpShow{
                color: #333;
            }
            .inpChange{
                color: #666;
            }
        }

        .bot_footer{
            position: fixed;
            left: 0;
            bottom: 0;
            z-index: 9899;
            background: #f8f8f8;
            overflow: hidden;
            border-top: 1px solid #DFE0E0;
            width: 100%;
            height: 50px;
            a{
               text-align: center;
               width: 33.333%;
               height: 100%;
               float: left;
               color: #999;
               .nav-bar{
                  padding-top: 6px;
                  height: 100%;
               }
               .i_clean{
                  background: url(//gfs10.gomein.net.cn/T1NfhvB7xg1RCvBVdK.png) no-repeat center 0;
                  background-size: 100%;
               }
               /*.i_pei{
                  background: url(//gfs10.gomein.net.cn/T1_fhvB5Lg1RCvBVdK.png) no-repeat center 0;
                  background-size: 100%;
               }*/
               .i_repair{
                background: url(//gfs13.gomein.net.cn/T1QfhvB5hg1RCvBVdK.png) no-repeat center 0;
                background-size: 100%;
               }
               .i_recyle{
                background: url(//gfs12.gomein.net.cn/T1vfxvBjA_1RCvBVdK.png) no-repeat center 0;
                background-size: 100%;
               }
                 i{
                display: block;
                margin: 0 auto;
                width: 23px;
                height: 23px;
               }
               span{
                font-size: 11px;
                line-height: 20px;
               }
            }
        }


    }
    
    

</style>


                          


                