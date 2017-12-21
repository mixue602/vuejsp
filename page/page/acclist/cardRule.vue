<template>
	<div class="rule">
        <div class="header">
            <a class="goBack" @click="fnHref"><i></i></a>
            <span class="title">{{ title }}</span>
        </div>
        <div class="rule-tu">
            <img src="//img.dev.gomegj.com/guanjia/v2/accbg.png">
        </div>
        <p class="rule-con">
            &nbsp; &nbsp;&nbsp; &nbsp; 指绑定国美旗下公司给予用户注册的会员卡，包含国美电器、大中电器、永乐电器等不同国美旗下品牌公司会员卡，目前仅支持绑定线下会员卡。<br>
            &nbsp; &nbsp;&nbsp; &nbsp; 为了您的账户信息安全，只能绑定本人持有的会员卡，如绑定非本人会员卡，国美管家接收到用户申述后有权单方面解绑会员卡绑定。<br>
            &nbsp; &nbsp;&nbsp; &nbsp; 国美管家将获取您通过会员卡关联的用户、订单、商品等相关信息，国美管家提供对会员卡信息转化为资产、保修管理、电子说明书等服务，并为用户提供根据会员卡信息进行针对性服务。对于用户会员卡信息是否存在缺失及会员卡找回国美管家不承担相关责任与义务。<br>
            &nbsp; &nbsp;&nbsp; &nbsp; 会员卡如解绑，会员卡所关联信息将同步移除，由于解绑会员卡造成的损失国美管家不承担相关责任。国美管家不提供会员卡信息找回、密码找回等功能，如遇会员卡遗失等问题请联系办卡单位进行处理，国美管家仅提供会员卡绑定必要验证程序，如由于用户自行丢失会员卡造成会员卡被其它用户绑定，国美管家不承担相关责任，如遇会员卡已被绑定，请及时联系客服进行处理。<br>
        </p>
    </div>
</template>

<script type="ecma6.0">
let root = window || {},
    util = root.util || {};
export default {
	data(){
        return {
            title:'会员卡'
        }
    },
    methods:{
        fnHref(){
            this.$emit("back")
        }
    }
}

</script>

<style lang="less">
@import '../../util/fs.less';
.rule{
    background-color: #fff;
    position: absolute;
    top: 0;
    bottom: 0;
    .rule-tu{
        padding:0.4rem 0.533333rem 0.333333rem;
        img{
            display: block;
            width: 100%;
            height: auto;
        }

    }
    .rule-con{
        color: #777;
        .mixinfont(14px);
        background-color: #fff;
        padding: 0 0.533333rem 0.4rem;
    }
}




</style>