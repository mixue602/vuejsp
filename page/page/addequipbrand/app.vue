<template>
    <div class="wapper-box wapper">
	    <header-component :title="title"></header-component>
      <!-- <choice-brand></choice-brand> -->
      <div class="repairListBox">
          <div class="bg">
               <li class="selectClass">
                  <p>1.选择品类</p>
               </li> 
               <li class="selectBrand active">
                  <p>2.选择品牌</p>
               </li>
               <li class="selectDetail">
                  <p>3.选择参数</p>
               </li>
               <li class="selectComplete">
                  <p>4.添加成功</p>
               </li>
          </div>
          <ul class="repairList clearfix">
              <div v-for="(valBig,index) in children" class="brandDebox clearfix">
                  <p class="claTit">{{ valBig.name }}</p>
                  <li  class="float_l waves bdr-bottom bdr-r brand_cla" v-for="(val,index) in valBig.brands" @click="skpa($event,val,val.id,valBig.cateid,valBig.lvl,valBig.name)">
                      <div class="float_l">
                          <p>{{ val.name }}</p>
                      </div>
                      <img :src="baseurl+val.id+'.png'" alt="" class="float_r" onerror="onerror=null;src='//img.gomegj.com/guanjiaweb/pc/book_brand2/v.png'">
                  </li>
              </div>            
          </ul>  
      </div>
    </div>
    
    
</template>

<script>
 var root = window || {},
     util = root.util || {};

import headerComponent from '../../components/HeaderComponent';
// import choiceBrand from './choiceBrand';

export default {
	data () {
		return {
			title: "选择品牌",
      baseurl: '//img.gomegj.com/guanjia/v2/brimg/',
      children:[],
      branDatas:{}
		}
	},
	components: {
		headerComponent,
    // choiceBrand,
	},

	created () {
     if(util.isApp()){
         util.deleteHeadBtn();
     }
     let that = this,
         parmas = util.getHrefParma();
     util.api({
      // surl: './resources/json/addequipment.json',
      surl: '/yf/json/addequipment.json', 
      type:'get',
      success:function(res) {
        var body = res.data;
        $.each(body,(i,item)=>{
            switch(item.cateid){
                case parmas.eacid:
                that.children = item.children;
                break;
            }
        });

        that.branDatas.eacnm = parmas.eacnm;
        that.branDatas.eacid = parmas.eacid;
      }
    })
	},
	updated() {
    
  },
	methods: {
        // 点击品牌
        skpa(event,value,id,bigcateid,biglvl,bigName){
            let that = this;
            ripple(event);
            
            that.branDatas.bigcateid = bigcateid;
            that.branDatas.biglvl = biglvl;
            that.branDatas.bigName = bigName;
            that.branDatas.bdnm = value.name;
            that.branDatas.bdid = value.id;
            
            util.href("addequipmodel.html",that.branDatas)

            // console.log(that.branDatas)
        },
  }
}
</script>

<style lang="less">
    @import '../../util/fs.less';
    body,html{
    	height: 100%;
    }

    .wapper-box{
    	height: 100%;
    	width: 100%;
    	box-sizing: border-box;
    	padding-top: 1.173333rem;
      background: #f5f5f5;
    }
	.bg{
		height: 2.666667rem;
		width: 100%;
		box-sizing: border-box;
		padding: 0 0.266667rem;
		background-color: #fff;
    position: absolute;
    top: 0;
    left: 0;
		li{
			width: 25%;
			height: 100%;
			text-align: center;
			position: relative;
            float: left;
			p{
				width: 100%;
				position: absolute;
				bottom: 0.4rem;
				font-size: 0.293333rem;
				line-height: 0.48rem;
			}
		}
		.selectClass{
			background: url(//gfs11.gomein.net.cn/T11JYgBCET1RCvBVdK.png) no-repeat;
			background-position: center 0.666667rem;
			background-size: 0.826667rem 0.853333rem;
		}
    .selectClass.active{
      background: url(//gfs10.gomein.net.cn/T1dmAbBCET1RCvBVdK.png) no-repeat;
      background-position: center 0.666667rem;
      background-size: 0.826667rem 0.853333rem;
      color: #FF4B41; 
    }
		.selectBrand{
      background: url(//gfs10.gomein.net.cn/T1SPJgBChT1RCvBVdK.png) no-repeat;
      background-position: center 0.666667rem;
			background-size: 0.9rem 0.853333rem;
		}
    .selectBrand.active{
      background: url(//gfs12.gomein.net.cn/T1i9K_BCJT1RCvBVdK.png) no-repeat;
      background-position: center 0.666667rem;
      background-size: 0.9rem 0.853333rem;
      color: #FF4B41; 
    }
		.selectDetail {
      background: url(//gfs10.gomein.net.cn/T1vO_bByAT1RCvBVdK.png) no-repeat;
			background-position: center 0.666667rem;
			background-size: 1rem 0.853333rem;
		}
    .selectDetail.active{
       background: url(//gfs12.gomein.net.cn/T1e2EbBChT1RCvBVdK.png) no-repeat;
       background-position: center 0.666667rem;
      background-size: 1rem 0.853333rem;
      color: #FF4B41; 
    }
		.selectComplete{
			background: url(//gfs12.gomein.net.cn/T1hbJvByLT1RCvBVdK.png) no-repeat;
			background-position: center 0.666667rem;
			background-size: 0.826667rem 0.853333rem;
		}
    .selectComplete.active{
       background: url(//gfs13.gomein.net.cn/T1TqYvBCJT1RCvBVdK.png) no-repeat;
       background-position: center 0.666667rem;
      background-size: 0.826667rem 0.853333rem;
      color: #FF4B41; 
    }
	}

	
  .repairListBox{
     width: 100%;
     height: 100%;
     padding-top: 2.93rem;
    box-sizing: border-box;
    position: relative;
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