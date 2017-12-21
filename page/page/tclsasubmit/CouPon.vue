<template>
    <div class="coupon" :class="{show:couponinfo.conTF}">
        <div class="clearfix">
            <label class="float_l">优惠券</label>
            <span class="float_r">当前订单最高可抵用:¥<i>{{ parseFloat(couponinfo.copp/100).toFixed(2) }}</i></span>
        </div>
        <p>您的优惠券将于 {{ couponinfo.disable }} 过期，请于服务完成后付款的时候使用</p>
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
    .coupon{
        line-height: 0.586667rem;
        padding: 0.2rem 0.16rem;
        margin-bottom: 0.32rem;
        background:#fff;
        display: none;
        .mixinfont(14px);
        label{
            color: #333;
        }
        span{
            color:#000;
        }
        p{
            color: #999;
            .mixinfont(12px);
        }
    }
    .show{
        display: block;
    }
</style>