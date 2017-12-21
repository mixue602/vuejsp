<template>
  <div class="wapper">
  <header-component :title="title"></header-component>
      <!-- 头部轮播图 -->
      <div id="slideBox1" class="slideBox">
          <div class="bd">
              <ul>
                   <li v-for="(v,i) in banner" :key="i"><a :href="v.url"><img :src="v.image" alt=""></a></li>
              </ul>
          </div>
          <!--索引点-->
          <div class="hd">
              <ul v-if="banner.length>1">
                 <li v-for="(v,i) in banner" :key="i"></li> 
              </ul>
          </div>
      </div>
      <!-- 头部轮播图 -->
      <!--商品列表-->
      <div id="goodsList"  class="">                    
          <div class="goodsTitle">
          </div>
          <div class="goods">
              <ul>     
                <li v-for="(v,i) in goodsList" :key="i"  v-if="goodsList[i].stock!=0" @click="appointment(v.skuId)">
                    <img :src="v.thumbImgUrl" alt="">
                    <p class="name">{{v.goodsName}}</p>
                    <div class="goodsDes">
                      <span class="fcorange"><i>￥</i>{{(v.goodsPrice/100).toFixed(2)}}</span>
                      <button>立即抢购</button>
                    </div>
                </li>
              </ul>
          </div>
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
          title:"国美管家",
         //如果有多张banner图时，在banner图上添加图片即可，这样做为了减少请求
         banner:[
             {
                "title":"",
                "url":"",
                "goodsId" : "",
                "image":"//gfs13.gomein.net.cn/T1sHLsBvJT1RCvBVdK.png"
             }
         ],
         goodsList:[],
      }
  },
  created () {
       this.init();
       if(util.isApp()){
            util.deleteHeadBtn();
        }
  },
  methods: {
    init: function() {
        this.load();
    },
    // 加载基础数据
    load: function() {
        // 加载页面布局
        this.loadPageLayout();
        if(this.banner.length>1){
            this.$nextTick(function () {
                 this.loadSwiper();
            })
        }

    },
    /**
     * 加载页面布局
     */
    loadPageLayout: function() {
        let that = this;
        that.getHomeInfo();
    },
     /**
     * 获取首页商品信息
     */
     getHomeInfo: function(){
        let that = this;
        //请求
        util.api({
            surl:root.GOODS_API_PATH +'goodsList',
            type: 'get',
            success: function(response) {
                let code = response.rpco,
                    list;
                // 处理
                switch(code) {
                    case 200:
                        // 渲染
                        list= response.body || [];
                        that.goodsList=list;
                        // 渲染商品列表
                        util.imgLazyload();
                        break;
                    default:
                        util.tip('请求失败')
                }
                
            }
        });
     },
     /**
     * 加载页面轮播图
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
    appointment:function(goodsID){
      util.href('goodsdetail.html',{goodsID,goodsID});
    }
  },
  components: {
	 headerComponent	
  },

	

}
</script>
<style lang="less">
@import '../../util/fs.less';
.wapper{
  padding-top: 1.173333rem;
  background: #f5f5f5;
  .header{
      background: #ff4b46;
      .goBack{
          display: none;
      }
      .title{
          color: #fff;
      }
  }
  #goodsList{
    .goodsTitle{
      width: 100%;
      height:1.173333rem;
      background:url("//gfs10.gomein.net.cn/T1HdJgBCET1RCvBVdK.png") no-repeat;
      background-size: 100% 1.173333rem;
    }
    .goods ul{
        width:10rem;
        // display: -webkit-flex;
        // -webkit-flex-wrap:wrap;
        // -webkit-justify-content:space-between;
        // justify-content:space-between;
        li{
          float:left; 
          width: 4.986667rem;
          height: 6.386667rem;
          background-color: #fff;
         // margin-bottom: 2px solid #f5f5f5;
          margin-bottom: 2px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items:center;
          -webkit-justify-content:center;
          img{
            width:4.56rem;
            height:3.733333rem;
            display:inline-block;
            margin-top:.213333rem;
          }
          .name{
             .mixinfont(14px);
             color:#333;
             width:4.5rem;
             margin-top:.16rem;
             height:1.066667rem;
             line-height:.533333rem;
             display: -webkit-box;
             -webkit-line-clamp: 2;
             -webkit-box-orient: vertical;
             text-overflow: ellipsis;
             overflow: hidden;
          }
          .goodsDes{
            width:4.56rem;
            margin-top:.106667rem;
            display: -webkit-flex;
            align-items:flex-start;
            -webkit-justify-content:space-between;
            .fcorange{
              color:#ff4b46;
              .mixinfont(18px);
              i{
                .mixinfont(12px);
              }
            }
            button{
              width:2.08rem;
              height:.746667rem;
              border-radius:.373333rem;
              background: #fff;
              border:1px solid #ccc;
              color:#333;
            }
          }

        }
        li:nth-child(odd){
            margin-right: .026667rem;
        }
    }
  }
}
</style>



