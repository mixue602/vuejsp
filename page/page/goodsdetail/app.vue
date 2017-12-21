<template>
  <div class="wapper">
   <header-component :title="title" ></header-component>
    <div class="container" id="goodsDetail">
        <!-- 头部轮播图 -->
        <div id="slideBox1" class="slideBox">
            <div class="bd">
                <ul>
                    <!--默认图片--> 
                    <li v-for="(v,i) in body.bigImgUrls" :key="i"><img :src="v" alt=""></li>
                </ul>
            </div>
            <!--索引点-->
        <div class="hd">
                <ul v-if="body.bigImgUrls.length>1">
                    <li v-for="(v,i) in body.bigImgUrls" :key="i"></li> 
                </ul>
            </div>
        </div>
        <!-- 商品信息 -->
        <div class="goodsInfo">
            <h2 class="goodsName" >{{orderInfo.goodsName}}</h2>
            <ul>
                <li class="goodsPrice">￥{{parseFloat(orderInfo.goodsPrice/100).toFixed(2)}}</li>
                <li class="count-item">
                    <span class="remove" :class="{remove2:comCountMixTF()}" @click="fnRemove()"></span>
                    <input type="tel" class="count" maxlength="2" v-model="orderInfo.count" @keyup="fnOnlyNumber()" @blur="fnBlur()">
                    <span class="add" :class="{add2:comCountMaxTF()}" @click="fnAdd()"></span>
                </li>
            </ul>
        </div>
        <div class="goodsInfoList" >
            <ul>
                <li>
                    <label>销售区域</label>
                    <span>{{orderInfo.sellAreaName?orderInfo.sellAreaName:'全国(除港澳台)'}}</span>
                </li>
                <li>
                    <label>剩余数量</label>
                    <span>{{Numhtml}}</span>
                </li>
                <li>
                    <label>商品规格</label>
                    <span>{{orderInfo.goodsSpecification?orderInfo.goodsSpecification:'-'}}</span>
                </li>
            </ul>
        </div>
        <!--详细信息-->
        <div class="goodsDes">
            <ul class="goodsDesTit">
                <li :class="[{'on': on === 0},'']" @click="tab(0)"><a href="javascript:;">商品详情</a></li>
                <li class="line"></li>
                <li :class="[{'on': on === 1},'']" @click="tab(1)"><a href="javascript:;">包装清单</a></li>
                <li class="line"></li>
                <li :class="[{'on': on === 2},'']" @click="tab(2)"><a href="javascript:;">售后服务</a></li>
                
            </ul>
            <div>
                <div class="goodsDesBox goodsImg" v-show="on === 0">
                    <img v-for="(v,i) in body.goodsImgUrl" :src="v" :key="i"/>
                </div>
                <div class="goodsDesBox goodsPackge" v-show="on === 1">{{body.goodsPackge}}</div>
                <div class="goodsDesBox goodsService" v-show="on === 2">{{body.goodsService}}</div>
            </div>
        </div>
        <div class="footer"  @click="savetempOrder">立即购买</div>      
    </div>
     
 </div>
        
</template>
<script  type="ecma6.0">

let root = window || {},
    util = root.util || {};  
    import headerComponent from '../../components/HeaderComponent'
export default {
  data() {
      return {
        body:{
            bigImgUrls:[],
            stockType:"",

        },
        title: "商品详情",
        on: 0,
        hrefParma: util.getHrefParma(),
        Numhtml:"",  //剩余数量
        orderInfo:{
            //商品编码
            goodsID : 0,
            // 商品名称
            goodsName:"",
            //商品价格
            goodsPrice:0,
            //商品数量
            count:1,
            // 商品图片
            thumbImgf:"",
            // 商品规格
            goodsAttr:{},
            goodsSpecification:"",
            // 限售区域
            sellArea:'',
            sellAreaName:'',
            // 商品库存
            goodsNum:"",
        }
      }
  },
  created () {
       this.init();
       if(util.isApp()){
            util.deleteHeadBtn();
        }
  },
  methods: {
    //点击减号
    fnRemove: function() {
        if (this.orderInfo.count > 1) {
            this.orderInfo.count--;
        } else if (this.orderInfo.count <= 1) {
            this.orderInfo.count = 1;
        }
    },
    
    //点击加号
    fnAdd: function() {
        if(this.orderInfo.count>=this.orderInfo.goodsNum){
            util.tip("选择商品数量大于库存数量");
            if(this.orderInfo.goodsNum>=1){
                this.orderInfo.count=this.orderInfo.goodsNum;
            }
            return;
        }else{
            if (this.orderInfo.count < 99) {
                this.orderInfo.count ++;
                if(this.orderInfo.count>this.body.goodsLimit){
                    util.tip("亲，闪购商品只能购买"+this.body.goodsLimit+"件哦！");
                    this.orderInfo.count=this.body.goodsLimit;
                    return;
                }
            } else if (this.orderInfo.count >= 99) {
                this.orderInfo.count = 99;
            }
        }
    },
    // input失去焦点变化
    fnBlur: function() {
        if (this.orderInfo.count == '' || this.orderInfo.count < 1) {
            this.orderInfo.count = 1;
        }
    },
    // 数量限制输入数字
    fnOnlyNumber: function() {
        if (this.orderInfo.count >= 99) {
            this.orderInfo.count = 99;
        }else if(this.orderInfo.count<1){
            this.orderInfo.count = 1;
        }else{
            if(this.orderInfo.count>this.body.goodsLimit){
                util.tip("亲，闪购商品只能购买"+this.body.goodsLimit+"件哦！");
                this.orderInfo.count=this.body.goodsLimit;
                return;
            }else if(this.orderInfo.count>=this.orderInfo.goodsNum){
                util.tip("选择商品数量大于库存数量");
                if(this.orderInfo.goodsNum>=1){
                    this.orderInfo.count=this.orderInfo.goodsNum;
                }
                return;
            }else{
                this.orderInfo.count = String(this.orderInfo.count).replace(/[^\d]/g, '');
            }
        }
    },
    // 数量等于1
    comCountMixTF: function() {
        if (this.orderInfo.count == 1) {
            return true;
        }
    },
    // 数量等于99
    comCountMaxTF: function() {
        if (this.orderInfo.count == 99 || this.orderInfo.count>=this.body.goodsLimit || this.orderInfo.count>=this.orderInfo.goodsNum) {
            return true;
        };
    },
    //商品库存
    stockType:function(){
        if(parseInt(this.body.stockType)===2){
            this.orderInfo.goodsNum = 1000;
            this.Numhtml='不限';
        }else{
            this.Numhtml=this.orderInfo.goodsNum;
        }
    },
    /**
     * 加载商品轮播图
     */
    loadSwiper: function() {
       TouchSlide({ 
            slideCell:"#slideBox1",
            titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
            mainCell:".bd ul", 
            effect:"leftLoop", //左滑动循环
            autoPage:true,//自动分页
            autoPlay:true, //自动播放
            interTime:4000
        });  
    },
    //tab 切换
    tab: function(index) {
        if (this.on !== index) {
        this.on = index;
        }
    },
    /**
     * 初始化
     */
    init: function() {
        var that = this;
        that.load();

    },
    /**
     * 加载基础数据
     */
    load: function() {
        var that = this;
        // 加载页面布局
        that.loadPageLayout();
        that.stockType();
    },
    /**
     * 加载页面信息
     */
    loadPageLayout: function() {
        var that = this;
        that.getPageInfo();
    },
    /**
     * 获取商品信息
     */
    getPageInfo: function(){
        let that = this;
        let hrefParma=util.getHrefParma();

        //请求
        util.api({
            surl: root.GOODS_API_PATH + 'goodsDetail',
            type: 'get',
            data:{
                goodsId:hrefParma.goodsID
            },
            success: function(response) {
                let code = response.rpco;
                    // goods = response.body.goodsList[that.options.hrefParma.goodsID] || {};
                    
                // 处理
                switch(code) {
                    case 200:
                        // 渲染
                        //图片预加载处理
                        //util.imgLazyload();
                        let goods = response.body || {};
                        that.body=goods;
                        that.orderInfo={
                            //商品编码
                            goodsID : goods.skuId,
                            // 商品名称
                            goodsName:goods.goodsName,
                            //商品价格
                            goodsPrice:goods.goodsPrice,
                            //商品数量
                            count:1,
                            // 商品图片
                            thumbImgf:goods.thumbImgf,
                            // 商品规格
                            goodsAttr:{},
                            goodsSpecification:goods.goodsSpecification,
                            // 限售区域
                            sellArea:goods.sellArea,
                            sellAreaName:goods.sellAreaName,
                            // 商品库存
                            goodsNum:goods.stock,
                        }
                        if(that.body.bigImgUrls.length>1){
                            that.$nextTick(function () {
                                that.loadSwiper();
                            })
                        }
                        that.stockType();
                        break;
                    default:
                        util.tip('服务器繁忙，请稍后再试')
                }  
            }
        });
     },

    /**
     * 创建临时订单id
     */
     savetempOrder: function(cur) {
        if (this.orderInfo.count>this.body.goodsLimit) {
            util.tip("亲，闪购商品只能购买"+this.body.goodsLimit+"件哦！");
            return 
        };
        if (this.orderInfo.count>this.orderInfo.goodsNum) {
            util.tip("选择商品数量大于库存数量,请重新选择！");
            return 
        };
        var that = this,
            ss = window.localStorage;
            //存储在sessionStorage里面信息
            if(ss.getItem('goodsOrederInfo')){
                ss.removeItem('goodsOrederInfo');
            }
            ss.setItem('goodsOrederInfo',JSON.stringify(new Array(that.orderInfo)));
            setTimeout(function(){
            //跳转到详情
            util.href('goodsorder.html',{
                "goodsID":that.orderInfo.goodsID*1,
                "count":that.orderInfo.count
            });
            },320);  
    },
  },
  components: {
	headerComponent,
  },
	

}
</script>
<style lang="less">
@import '../../util/fs.less';
.wapper{
    background:#f5f5f5;
    position: relative;
    padding-bottom: 1.346667rem;
    /*商品详情 s*/
    .slideBox{
        .bd{
            li{
                img{
                    height:10rem;
                }
            }
        }
        .hd{
            height: .346667rem;
            line-height: .346667rem;
            bottom: .5rem;
            li{
                width: .346667rem;
                height: .346667rem;
                border-radius: .173333rem;
                margin:0 .1rem;
            }
        }
    }
    .goodsInfo{
        background-color: #fff;
        padding:.266667rem .333333rem .333333rem;
        .goodsName{
            font-weight: normal;
            .mixinfont(14px);
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        ul{
            margin-top: .333333rem;
            overflow: hidden;
            display:flex;
            align-items:center;
            justify-content:space-between;
            .goodsPrice {
                color: #ff4b46;
                .mixinfont(14px);
            }
            .count-item{
                width: 2.4rem;
                height: .64rem;
                line-height: .64rem;
                border: 1px solid #999;
                border-radius: .08rem;
                display:flex;
                align-items:center;
                justify-content:center;
                .add{
                    width:.64rem;
                    height:.64rem;
                    background: url("//gfs13.gomein.net.cn/T1a_xvBvVg1RCvBVdK.png") center center no-repeat;
                    -webkit-background-size:45%;
                     background-size:45%;
                     text-indent:-999rem;
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                }
                .add2{
                    width:.64rem;
                    background: url("//gfs10.gomein.net.cn/T1NL_vB_Ev1RCvBVdK.png") center center no-repeat;
                    -webkit-background-size:45%;
                     background-size:45%;
                }
                .remove{
                    width:.64rem;
                    height:.64rem;
                     background: url("//gfs11.gomein.net.cn/T1ZDdvBXZ_1RCvBVdK.png") center center no-repeat;
                    -webkit-background-size:45%;
                    background-size:45%;
                    text-indent:-999rem;
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                }
                .remove2{
                    background: url("//gfs11.gomein.net.cn/T1tDbvByAv1RCvBVdK.png") center center no-repeat;
                    -webkit-background-size:45%;
                    background-size:45%;
                }
                .count{
                    border-left: 1px solid #999;
                    border-right: 1px solid #999;
                    width: 1.093333rem;
                    height: .64rem;
                    .mixinfont(14px);
                    text-align: center;
                    border-radius: 0;
                    -webkit-appearance : none ;  /*解决iphone safari上的圆角问题*/
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                }
                input::-webkit-outer-spin-button,  
                input::-webkit-inner-spin-button{  
                    -webkit-appearance: none !important;  
                    margin: 0;  
                }  
            }
        }
    }
    .goodsInfoList{
        background-color: #fff;
        height:1.666667rem;
        padding:.266667rem .333333rem;
        margin:.266667rem 0;
        li{
            height:.56rem;
            .mixinfont(14px);
            display:flex;
            align-items:center;
            justify-content:space-between;
            span{
                text-align: right;
                color: #333;
                width: 70%;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
    }
   
   .goodsDes{
       width: 100%;
       background-color: #fff;
       font-size: .14rem;
       .goodsDesTit{
            width: 100%;
            height: 1.35rem;  
            background-color: #fff;
            border-bottom: 1px solid #e9e9e9;
            display:flex;
            align-items:center;
            -webkit-justify-content:space-around;
            .line{
                width: 1px;
                height: .8rem;
                background: #e9e9e9;
                -webkit-flex:none;
            }
             li{
                height: 100%;
                text-align: center;
                line-height: .8rem;
                padding: .26rem 0;
                box-sizing: border-box;
                -webkit-flex:1;
                a{
                    display: block;
                    width: 100%;
                    height: 100%;
                    .mixinfont(14px);
                }
            }
            li.on{
                border-bottom: 2px solid #ff4b46;
                a{
                    color: #ff4b46;
                }
            }
            
        }
        .goodsImg {
            img{
                width: 100%;
                height: auto;
                display: block;
            }
        }
        .goodsDesBox{
			padding: .05rem;
			.mixinfont(14px);
        }
   }
   .footer{
        width: 100%;
        height: 1.346667rem;
        line-height: 1.346667rem;
        .mixinfont(16px);
        background-color: #ff4b46;
        text-align: center;
        color: #fff;
        position: fixed;
        left: 0;
        bottom: 0;
            
   }
}
</style>

