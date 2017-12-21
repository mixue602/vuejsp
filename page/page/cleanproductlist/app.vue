<template>
  <div class="wapper">
    <header-component :title="title"></header-component>
    <div class="container">
      <ul>
        <li v-for="(v,n) in body" :key="n">
          <div class="img">
            <img  v-if="v.cgilist" :src="v.cgilist[0]" />
            <img  v-else src="//gfs12.gomein.net.cn/T1.RKjBChT1RCvBVdK.png"/>
          </div>
          <div class="text-con">
              <div class="title">{{v.cgname}}</div>
              <div class="decs">{{v.cgcn}}</div>
              <div class="price">￥<span class="item-price">{{parseFloat(v.price/100).toFixed(2)}}</span></div>
          </div>
          <div class="num"><i>x</i>{{v.cgnum}}</div>
        </li>
      </ul>
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
          body:[],
          title: '商品列表'
      }
  },
  created () {
        let that = this,
            parmas = util.getHrefParma();

        // 加载页面信息
        util.api({
            //surl:"/resources/json/getTempOrder.json",
            surl: root.CLEAN_API_PATH + 'getTempOrder',
            type: 'get',
            data:{
                    oid:parmas.oid*1
                },
            success: function(response) {
                let rpco = response.rpco,
                    body = response.body || {};

                // 处理
                switch(rpco) {
                    case 200:
                        //渲染页面信息
                        that.body=body.cglist || [];
                        break;
                    default:

                    break;

                }

            }
        });

        if(util.isApp()){
            util.deleteHeadBtn();
        }

    },
  components: {
      headerComponent
    }
}
</script>
<style lang="less">
@import '../../util/fs.less';
body{background:#f5f5f5;}
.wapper{
  
  .container{
    ul{
      li{
        height: 3.466667rem;
        width: 100%;
        background: #fff;
        display: flex;
        align-items:flex-start;
        justify-content:flex-start;
        margin-top: .266667rem;
        .img{
          width: 2.666667rem;
          height: 2.666667rem;
          margin: .4rem 0 0 .4rem;
          img{
            display: inline-block;
            width: 2.666667rem;
            height: 2.666667rem;
          }
        }
        .text-con{
          width: 5.466667rem;
          margin: .4rem 0 0 .4rem;
          .title{
            color:#333;
            .mixinfont(14px);
            width: 5.466667rem;
            white-space:nowrap;          /* 不换行 */
            overflow:hidden;               /* 内容超出宽度时隐藏超出部分的内容 */
            text-overflow:ellipsis;         /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
          }
          .decs{
            .mixinfont(12px);
            color:#777;
            white-space:nowrap;          /* 不换行 */
            overflow:hidden;               /* 内容超出宽度时隐藏超出部分的内容 */
            text-overflow:ellipsis;         /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
          }
          .price{
            color: #ff4b41;
            .mixinfont(14px);
            margin-top: .4rem;
          }
        }
        .num{
          i{
            .mixinfont(16px);
            margin-left: .026667rem;
          }
          .mixinfont(13px);
          color: #999;
          margin: .4rem 0 0 .4rem;
        }
      }
    }
  }
};


</style>

