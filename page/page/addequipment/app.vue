<template>
    <div class="wapper-box wapper">
	    <header-component :title="title"></header-component>
      <!-- <choice-category></choice-category> -->
      <div class="repairListBox">
          <div class="bg">
               <li class="selectClass active">
                  <p>1.选择品类</p>
               </li>
               <li class="selectBrand">
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
              <div class="moudel_tit">选择品类</div>
              <li  class="float_l waves bdr-bottom bdr-r" v-for="(val,index) in bodys" @click="skip($event,val)">
                  <div class="float_l">
                    <p>{{ val.name }}</p>
                  </div>
                  <img :src="val.logo" alt="" class="float_r" onerror="onerror=null;src='//img.gomegj.com/guanjiaweb/pc/book_brand2/v.png'">
              </li>
          </ul>
      </div>
    </div>
    
    
</template>

<script>
 var root = window || {},
     util = root.util || {};

import headerComponent from '../../components/HeaderComponent';
// import choiceCategory from './choiceCategory';

export default {
	data () {
		return {
			title: "添加设备",
      baseurl: '//img.gomegj.com/guanjia/v2/brimg/',
      bodys:[],
      cateDatas:{}
		}
	},
	components: {
		headerComponent,
        // choiceCategory
	},

	created () {
		 if(util.isApp()){
         util.deleteHeadBtn();
     }

    let that = this;
    util.api({
      // surl: './resources/json/addequipment.json',
      surl: '/yf/json/addequipment.json', 
      type:'get',
      success:function(res) {
        var body = res.data;
                var assetArr = [];
            $.each(body,(i,item)=>{
               switch(item.cateid){
                   // 手机
                   case '424275157469626368':
                   item.logo = '//img.gomein.net.cn/gomegj/wap/eacimg/12.png';
                   assetArr.push(item);
                   break;
                   // 平板
                   case '424275218672910336':
                   item.logo = '//img.gomein.net.cn/gomegj/wap/eacimg/13.png';
                   assetArr.push(item);
                   break;
                   // 电脑
                   case '424275222967877632':
                   item.logo = '//img.gomein.net.cn/gomegj/wap/eacimg/36.png';
                   assetArr.push(item);
                   break;
                   // 电视
                   case '424275149953433600':
                   item.logo = '//img.gomein.net.cn/gomegj/wap/eacimg/19.png';
                   assetArr.push(item);
                   break;
                   // 空调
                   case '424275151027175424':
                   item.logo = '//img.gomein.net.cn/gomegj/wap/eacimg/20.png';
                   assetArr.push(item);
                   break;
                   // 洗衣机
                   case '424275153174659072':
                   item.logo = '//img.gomein.net.cn/gomegj/wap/eacimg/21.png';
                   assetArr.push(item);
                   break;
                   // 冰箱
                   case '424275152100917248':
                   item.logo = '//img.gomein.net.cn/gomegj/wap/eacimg/25.png';
                   assetArr.push(item);
                   break;
                   // 油烟机
                   case '424275288466128896':
                   item.logo = '//img.gomein.net.cn/gomegj/wap/eacimg/26.png';
                   assetArr.push(item);
                   break;
                   // 热水器
                   case '424275289539870720':
                   item.logo = '//img.gomein.net.cn/gomegj/wap/eacimg/27.png';
                   assetArr.push(item);
                   break;
                   // 燃气灶
                   case '424275294908579840':
                   item.logo = '//img.gomein.net.cn/gomegj/wap/eacimg/28.png';
                   assetArr.push(item);
                   break;
               }
            })
            that.bodys = assetArr;
  
      }
    })
	},
	updated() {
    
    },
	 methods: {
         skip(event, val) {
          let that = this;
          ripple(event);
          that.cateDatas.eacnm = val.name; 
          that.cateDatas.eacid = val.cateid; 
          util.href('./addequipbrand.html',that.cateDatas)
          
         }
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