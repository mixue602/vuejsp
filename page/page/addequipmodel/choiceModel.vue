<template>
		<div class="repairListBox">
        <ul class="repairList clearfix">
            <div class="moudel_tit">选择型号</div>

            <li  class="float_l waves bdr-bottom bdr-r" v-for="(val,index) in odlst" @click="skmo($event,val)">
                    <div class="float_l float_ltxt">
                        <p class="float_name">{{ val.cname }}</p>
                    </div>
                    <img :src="'http://'+val.goodsPic" alt="" class="float_r" onerror="onerror=null;src='//img.gomegj.com/guanjiaweb/pc/book_brand2/v.png'">
            </li>           
        </ul>  
    </div>
</template>

<script>
 var root = window || {},
     util = root.util || {};

export default {
	data () {
		return {
			title: "添加设备",
			baseurl: '//img.gomegj.com/guanjia/v2/brimg/',
      odlst:[],
      modelDatas:{}

		}
	},
  watch:{

  },
	created () {
       let that = this;
       that.parmas = util.getHrefParma();
       console.log(that.parmas)
       util.api({
                 surl:root.INSTRUCTION_API_PATH+"brandcategory?cateid="+that.parmas.bigcateid+"&brandId="+that.parmas.bdid+"&level="+that.parmas.biglvl+"&page=1",
                 type: 'get',
                 success: function(res) {
                      let rpco = res.rpco,
                          body = res.body;
                      switch(rpco){
                        case 200:
                           that.odlst = body.odlst;
                        break;
                        default:

                      }
                 },
                 error: function() {}
        })

	
	},
  updated() {

  },
	 methods: {

        // 点击型号
        skmo(event,value){
            let that = this;
            ripple(event);

            //向参数体中添加当前 品类名，品类id
            that.modelDatas.eacnm = that.parmas.eacnm ;
            that.modelDatas.eacid = that.parmas.eacid;
            
            // 向参数体中添加当前 大品牌名，大品牌id
            that.modelDatas.big_bdnm = that.parmas.bigName;
            that.modelDatas.big_bdid = that.parmas.bigcateid;

            //向参数体中添加当前 品牌名，品牌id
            that.modelDatas.bdnm = that.parmas.bdnm;
            that.modelDatas.bdid = that.parmas.bdid;

            // 向参数体中添加当前 分组编号(商品id)，文档id，商品图片,型号名,型号id为空
            that.modelDatas.gid = value.gdid;
            that.modelDatas.did = value.docid;
            that.modelDatas.goodsPic = value.goodsPic;
            that.modelDatas.mdnm = value.cname;
             

            util.href("addequipparams.html",that.modelDatas)
            // console.log(that.modelDatas)
        }
    },
    
    components: {

   },
}
</script>

<style lang="less">
    @import '../../util/fs.less';
  
  .repairListBox{
     width: 100%;
     height: 100%;
  }

	.repairList {
  		background: #fff;
  		height: 100%;
  		overflow-y: auto;
  		-webkit-overflow-scrolling: touch;

        .paramHeader {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            color: #333;
            .mixinfont(18px);
            text-align: center;
            height: 1.173333rem;
            line-height: 1.173333rem;
            border-bottom: 1px solid #ddd; 
            background-color: #fff;
            z-index: 1001;
        }
        .paramHeader .goBack {
            height: 100%;
            position: absolute;
            top: 0;
            left: 0.48rem;
        }
        .paramHeader .goBack i{
            position: absolute;
            top: 50%;
            margin-top: -0.213333rem; 
            border: 1px solid #666;
            border-right-color: transparent;
            border-top-color: transparent;
            -webkit-transform: rotate(45deg);
            transform: rotate(45deg);
            width: 0.373333rem;
            height: 0.373333rem;
        }
        .paramHeader .title {
            max-width: 70%;
            margin: 0 auto;
            display: block;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }

  		.moudel_tit{
  			padding: 0 0.266667rem;
  			height: 1.2rem;
  			line-height: 1.2rem;
  			color: #FF4B41 ;
  			font-size: 0.4rem;
        border-bottom: 1px solid #f0f0f0;
  		}
      .brandDebox{
        width: 100%;
      }
      .claTit{
          padding: 0 0.266667rem;
          height: 1.2rem;
          line-height: 1.2rem;
          color: #333 ;
          font-size: 0.4rem;
          border-bottom: 1px solid #f0f0f0;
       }
  		li {
  		  box-sizing: border-box;
  		  width: 50%;
  		  height: 2.133333rem;
  		  /*       border-bottom: 0.013333rem solid #e9e9e9;
  		          border-right: 0.013333rem solid #e9e9e9; */
  		  div {
  		    p:nth-child(1) {
  		      color: #333;
  		      .mixinfont(14px);
  		      margin: 0.8rem 0 0 0.4rem;
  		    }
  		    p:nth-child(2) {
  		      color: #999;
  		      .mixinfont(10px);
  		      margin: 0.186667rem 0 0 0.4rem;
  		    }
  		  }
  		  img {
  		    width: 1.653333rem;
  		    height: 1.653333rem;
  		    margin: 0.266667rem 0.15rem 0 0;
  		  }
        .float_ltxt{
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          max-width: 50%;
          p.float_name {
            color: #333;
            font-size: 12px;
            margin: 0rem 0 0 0.4rem;
            word-wrap: break-word;
            width: 100%;
          }
        }
  		}
      .brand_cla{
          img {
            width: 2.0rem;
            height: auto;
            margin: 0.79rem 0.15rem 0 0;
          }
      }
  		li:nth-child(event) {
  		  border-right: 0;
  		}
      .waves{
        position: relative;
      }
	}
</style>