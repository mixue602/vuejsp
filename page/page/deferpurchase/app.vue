<template>
	<div id="deferpurchase" class="wapper recycle-wapper">
	    <header-component :title="title"></header-component>

        <div class="container">
            <div class="list" v-show="list">
                <ul class="actitem" v-for="item in assetlists">
                    <li class="txt_pic">
                        <div class="imgbox">
                           <img :src="item.asimgu" onerror=" onerror=null;src='//img.gomegj.com/guanjiaweb/pc/book_brand2/v.png' ">
                        </div>
                        <p>{{ item.asname }}</p>
                    </li>
                    <li class="txt_itm">
                        <div class="itm">
                            购买门店<span>{{ item.buyStore }}</span>
                        </div>
                        <div class="itm">
                            购买时间<span>{{ item.buyTime_1 }}</span>
                        </div>
                    </li>
                    <li class="txt_btn">
                        <span class="btn_buy" @click="openTip(item.asnum,item.brdnm,item.id)" v-show="( (item.aswaew==2||item.aswaew==4||item.aswaew==6)&&item.subs.length==0 )">补购延保</span>
               <!--          <span class="btn_buy" @click="openTip()">补购延保</span> -->
                        <span class="btn_detail" @click="jumpOrdersyb(item.otn,item.buyTime,item.source,item.shippingGroupId,item.orderId)" v-show="item.subs.length>0">延保详情</span>
                    </li>
                </ul>     
            </div>

            <div class="nolist" id="bandnolist" v-show="bandnolist">
                <div class="tu">
                    <i class="i i-noassets"></i>
                </div>
                <p class="wen">您暂时还没有可以购买延保的商品哦～</p>
            </div>

            <div class="nolist" id="nolist" v-show="nolist">
                <div class="tu">
                    <i class="i i-noassets"></i>
                </div>
                <p class="wen">您暂时还没有可以购买延保的商品哦～</p>
                <div class="btn-box">
                    <button class="btn" @click="jumpAcclist">绑定会员卡</button>
                    <p>延保商品不支持单独购买，绑定国美会员卡，可为所有国美门店购买的商品补购延保。</p>
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
import headerComponent from '../../components/HeaderComponent'
// import yeserTip from './yeserTip'
let root = window || {},
    util = root.util || {};
 
export default {
	data(){
		return{
			title:"延保补购",
            list:false,
            bandnolist:false,
            nolist:false,
            assetlists:[],
            dialog:false,//sku弹层
            tipTitle:'',
            spulists:[],
            messageDis:false,
            itemChe:false,
            qwer:null,
            asnumchecked:null,
			

		}
	},
    computed: {
      cls: function () {
          let that = this;
                         
      }
    },
	created() {
    if(util.isApp()){
         util.deleteHeadBtn();
     }
		this.hrefParma = util.getHrefParma();
    let that = this;

        /**
        * 获取会员账户列表
        */
           // debug start
           // var response = {
           //     rpco: 200,
           //     body: {
           //         aclist: [{
           //             tsup: 1452652341201,
           //             actype: 1,
           //             acnum: '111111111111'
           //         },{
           //             tsup: 1452652341202,
           //             actype: 2,
           //             acnum: '222222222222'
           //         }]
           //     } 
           // };
           // var rpco = response.rpco,
           //     body;
           
           // // 处理
           // switch(rpco) {
           //     case 200:
           //         that.nolist = false;
           //         that.list = true;
           //         that.getAssetList();
           //         break;
           //     // 没有找到对应数据
           //     case 404:
           //         that.nolist = true;
           //         that.list = false;
           //         break;
           //     default:
           //         util.tip('查询失败')
           // }
           // return;
           // debug end
   
   
           // 请求...
           util.api({
               surl: root.MB_API_PATH + 'acclist',
               type: 'get',
               success: function(response) {
                   var rpco = response.rpco,
                       body;
                       console.log(response);
                   // 处理
                   switch(rpco) {
                       case 200:
                           that.nolist = false;
                           that.list = true;
                           that.getAssetList();
                           break;
                       // 没有找到对应数据
                       case 404:
                           that.nolist = true;
                           that.list = false;
                           break;
                       default:
                           util.tip('查询失败')
                   }
               }
        });

		
	},
	methods:{
		/*初始化页面显示列表*/
		getAssetList(){
			let that=this;

            // debug start
            // var response = {"rpco":200,"tsrp":1512197294694,
            //                "body":{
            //                    "aslist":[
            //                             {"id":"5a1e8ce744db9315d4bc688e","asnum":"deli,veryId_0.27356433868408203","ashname":"海尔（Haier）BCD-401W冰箱","asname":"海尔（Haier）BCD-401W冰箱","brdnm":"brandName_0.27356433868408203","mdnm":"modelName_0.27356433868408203","asimgu":"http://img.gomegj.com/guanjia/assetImageUrl","aswaew":1,"svtplst":[],"repairType":1,"goodsId":"1000010017","disPrice":null,"distime":null,"disnm":null,"catno":"cat10000054","brdno":"10000009","mdno":null,"buyTime":1511951589000,"buyStore":null},
            //                             {"id":"5a1e8ce744db9315d4bc688e","asnum":"deli,veryId_0.27356433868408203","ashname":"海尔（Haier）BCD-401W冰箱","asname":"海尔（Haier）BCD-401W冰箱","brdnm":"brandName_0.27356433868408203","mdnm":"modelName_0.27356433868408203","asimgu":"http://img.gomegj.com/guanjia/assetImageUrl","aswaew":2,"svtplst":[],"repairType":1,"goodsId":"1000010017","disPrice":null,"distime":null,"disnm":null,"catno":"cat10000054","brdno":"10000009","mdno":null,"buyTime":1511951589000,"buyStore":null}
            //                             ]
            //                       }
            //                };
            // let rpco = response.rpco,
            //     body = response.body || {};
            // let aslist = body.aslist || [];
            // // 处理
            // switch(rpco) {
            //     case 200:
            //                 //判断列表是否显示
            //                 if(aslist.length>0){
            //                             that.list=true;
            //                             $.each(body.aslist,(index,val)=>{
            //                                   // console.log(val.kprq)
            //                                   val.buyTime = util.formateDate(val.buyTime,'yyyy-MM-dd');
            //                                })
            //                             that.assetlists = aslist;
            //                         }else{
            //                             that.list=false;
            //                             that.bandnolist=true;
            //                         }  
            //               break;
            //               // 没有找到对应数据
            //               case 404:
            //                   that.list=false;
            //                   that.bandnolist=true;
            //                   break;
            //               default:
            //                   util.tip('查询失败');
            // }
            // return;
            // debug end

			util.api({
	            surl:root.AS_API_PATH + 'ybsupply',
	            type: 'get',
	            success: function(res) {
	            	let rpco=res.rpco;
	            	switch(rpco){
	            		 case 200:
	            		    let body=res.body;
                            let aslist = body.aslist;
                            //判断列表是否显示
                            if(aslist.length>0){
                                        that.list=true;
                                        $.each(body.aslist,(index,val)=>{
                                              // console.log(val.kprq)
                                              val.buyTime_1 = util.formateDate(val.buyTime,'yyyy-MM-dd');
                                           })
                                        that.assetlists = aslist;
                                    }else{
                                        that.list=false;
                                        that.bandnolist=true;
                                    }  
                          break;
                          // 没有找到对应数据
                          case 404:
                              that.list=false;
                              that.bandnolist=true;
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
      * 跳转会员卡列表
      */
     jumpAcclist(){
         util.href('./acclist.html');
     },

     /**
     * 跳转到延保订单详情
     */
    jumpOrdersyb(id,time,source,shippingGroupId,orderId){
        //管家延保订单
        if(source==3){
        	util.href('./ordersgjdetail.html',{
        	        //订单编号
        	        otn: orderId,
        	        //下单时间
        	        dodt: time,
        	        //订单类型
        	        odtype: 6291456,
        	        isJkxOtn :0
        	});
        }
        //线下延保订单
        else if(source==1){
        	util.href('./ordersztdetail.html',{
        	        //订单编号
        	        oid: id,
        	        //下单时间
        	        dodt: time,
        	        //订单类型
        	        odtype: 202,
        	        shippingGroupId : shippingGroupId
        	});
        }
        //线下延保订单
        else if(source==2){
        	util.href('./ordersztdetail.html',{
        	        //订单编号
        	        oid: id,
        	        //下单时间
        	        dodt: time,
        	        //订单类型
        	        odtype: 201,
        	        shippingGroupId : shippingGroupId
        	});
        }
        
    },

     /**
     * 获取延保SKU列表
     * @parma assetid 资产id
     */
    getAssetSku(assetid){
      console.log(assetid)
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
        //                                 "disPrice":0,
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
        //          that.spulists = body.spulist;
        //                 that.skulists = body.spulist[0].skulist;
                        
        //                 for(var n=0;n<that.skulists.length;n++){
        //                      console.log(that.skulists.length);
        //                      if(that.skulists[n].disPrice/100>0){
        //                         console.log(that.messageDis)
        //                          that.messageDis = true;
        //                     }
        //                 }
        //        }
        //             break;
        //     default:
        //         util.tip('服务器繁忙，请稍后再试');
        // }
        //debug end

        // 请求...skuid列表
        util.api({
            surl: root.AS_API_PATH + 'yb/getskus',
            data: {
                assetid: assetid
                // assetid: '5001,3220124801'
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
    * 点击购买延保。弹出遮罩层
    */
    openTip(assetid,tipTitle,id){
        let that = this;
        that.id = id;
        that.dialog = true;
        that.tipTitle = tipTitle;
        that.asnumchecked = assetid;
        that.getAssetSku(assetid)
    },
   
    /**
    * 关闭弹出遮罩层
    */
    closeTip(){
        let that = this;
        that.dialog = false;
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
        console.log(that.asnumchecked);
        console.log(that.skuidchecked);
        console.log(that.providerIdchecked);
    },
    /**
    * 点击购买按钮，跳转提交页面
    */
    buyYanbao(){
        let that = this;
        util.href('./assybsubmit.html',{
                    id: that.id,
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

	#deferpurchase{
		width: 100%;
        height: 100%;
        box-sizing: border-box;
        background-color: #F3F5F7;
        padding-top: 1.173333rem;
	}
    
	#deferpurchase .container {
        min-width: 320px;
        background-color: #f5f5f5;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    #deferpurchase .list{
        width: 100%;
        height: 100%;
        background-color: #F3F5F7;
        .actitem{
            padding: 0 0.373333rem;
            height: 5.2rem;
            background-color: #fff;
            margin-bottom: 0.266667rem;
            li{
                border-bottom: 1px solid #eee;
                box-sizing: border-box;
            }
            li:last-of-type{
                border-bottom: 0 none;
            }
        }
        .txt_pic{
            height: 2.266667rem;
            padding:0.266667rem 0 0 1.973333rem;
            position: relative;
            .imgbox{
               width: 1.733333rem;
               height: 1.733333rem;
               position: absolute;
               top: 0.266667rem;
               left: 0;
               border: 1px solid #eee;
            }
            img{
               width: 100%;
               height: 100%;
            }
            p{
                color: #151515;
                font-size: 0.4rem;
                line-height: 0.56rem;
            }
        }

        .txt_itm{
            height: 1.666667rem;
            padding:0.266667rem 0;
            font-size: 0.346667rem;
            .itm{
                line-height: 0.533333rem;
                color: #999;
                span{
                    float: right;
                    color: #151515;
                }
            }
        }

        .txt_btn{
            height: 1.266667rem;
            line-height: 1.266667rem;
            text-align: right;
            span{
               min-width: 1.933333rem;
               line-height: 0.733333rem;
               border-radius: .95rem;
               text-align: center;
               display: inline-block;
               border: 1px solid #FC746D;
               font-size: 0.346667rem;
            }
            .btn_buy{
               background-color: #FC746D;
               color: #fff;
            }
            .btn_detail{
               background-color: #fff;
               color: #FC746D;
            }
        }

    }

    #deferpurchase .nolist{
        width: 100%;
        height: 100%;
        background-color: #F3F5F7;
        padding-top: 2.0rem;
        box-sizing: border-box;
        .tu{
            width: 1.733333rem;
            height: 1.733333rem;
            margin: 0 auto;
            .i{
                display: inline-block;
                width: 100%;
                height: 100%;
                background: url(//gfs13.gomein.net.cn/T1LuxvBmKv1RCvBVdK.png) no-repeat;
                background-size: contain;
            }
        }
        .wen{
            text-align: center;
            font-size: 0.426667rem;
            line-height: 0.586667rem;
            color: #333;
            margin: 0.533333rem 0;
        }
        .btn-box{
            padding-top: 0.533333rem;
            box-sizing: border-box;
            .btn{
                width: 7.866667rem;
                height: 1.173333rem;
                line-height: 1.173333rem;
                text-align: center;
                background-color: #FF4B41;
                font-size: 0.426667rem;
                color: #fff;
                border-radius: 0.95rem;
                margin-left: 1.066667rem;
            }
            p{
                margin-top: 0.533333rem;
                font-size: 0.32rem;
                color: #999;
                line-height: 0.5rem;
                padding: 0 0.4rem;
            }
        }
    }
    

    #deferpurchase .area-dialog{
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


                          


                