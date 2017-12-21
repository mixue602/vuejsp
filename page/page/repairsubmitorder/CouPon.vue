<template>
    <div class="coupon-box bdr-top" >
        <div class="coupontitle">
          <label>优惠券</label>
          <span>当前订单最高可抵扣：<span class="couponprice">￥{{ parseFloat(couponinfo.copp/100) }}</span></span>
        </div>
        <div class="couponcontent">
            <div class="coupon">
              <div class="triangletop"></div>
              <div class="trianglebottom"></div>
              <div class="coupon-left">
                 <span>￥</span>
                 <i>{{ parseFloat(couponinfo.copp/100)}}</i>
              </div>
              <div class="coupon-right">
                 <span>仅限{{couponinfo.couat}}使用<a v-if="couponinfo.coumat">,满{{couponinfo.coumat}}减{{ parseFloat(couponinfo.copp/100) }}</a></span>
                 <i>使用期限：{{couponinfo.enable}}-{{couponinfo.disable}}</i>
              </div>
            </div>
        </div>
      </div>
</template>

<script>
    export default {
        props:['couponinfo'],
        data ()　{
            return {
               
            }
        },
        created () {
            console.log(this.title)
        }
    }
</script>

<style lang="less">
    @import '../../util/fs.less';
    .coupontitle{
      height: 1.173333rem;
      background: #fff;
      display: flex;
      align-items:center;
      justify-content:space-between;
      margin-bottom: .266667rem;
      label{
        color: #333;
        margin-left: .4rem;
        .mixinfont(14px);
      }
      span{
        color: #999;
        margin-right: .266667rem;
        .mixinfont(12px);
      }
    }
    .couponcontent{
      width: 100%;
      height: 2.666667rem;
      display: flex;
      justify-content:center;
      .coupon{
        width: 9.2rem;
        height: 2.666667rem;
        border-radius: .186667rem;
         background: #fff;
        display: flex;
        align-items:center;
        justify-content:center;
        position: relative;
        .coupon-left{
          width: 3.546667rem;
          height: 2.666667rem;
          position: relative;
          color: #FF4B41;
          display: flex;
          align-items:center;
          justify-content:center;
          span{
            .mixinfont(28px);
          }
          i{
            .mixinfont(38px);
          }
        }
        .coupon-left:before {
          height: 100%;
          content: '';
          width: 1px;
          border-right: 1px dashed #f0f0f0;
          position: absolute;
          top: 0;
          right: 0;
          z-index: 10;
      }
        .coupon-right{
          width: 5.653333rem;
          height: 2.666667rem;
          display: flex;
          flex-direction: column;
          align-items:flex-start;
          justify-content:center;
          span{
            color:rgba(255,152,151,1);
            .mixinfont(12px);
            margin-left: .4rem;
            a{
              color:rgba(255,152,151,1);
            }
          }
          i{
            color:#999;
            .mixinfont(12px);
            display: inline-block;
            margin-left: .4rem;
            margin-top: .026667rem;

          }
        }
        .triangletop{
          position: absolute;
          top: 0;
          left: 3.34rem;
          width: 0;
          height: 0;
          border-left: .173333rem solid transparent;
          border-right: .173333rem solid transparent;
          border-top: .173333rem solid #f0f0f0;
        }
        .trianglebottom{
          position: absolute;
          bottom: 0;
          left: 3.34rem;
          width: 0;
          height: 0;
          border-left: .173333rem solid transparent;
          border-right: .173333rem solid transparent;
          border-bottom: .173333rem solid #f0f0f0;
        }
        
      }
    }
</style>