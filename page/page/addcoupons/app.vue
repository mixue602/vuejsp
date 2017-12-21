<template>
	  <div id="addCoupon" class="wapper">
        <header-component 
        :title='title'
        :rightmenus = 'rightmenus'
        @watchlist='addCoupon'
        ></header-component>
        <div class="container">
            <ul class="list-labelvalue">
                <li class="bdr-bottom">
                    <input type="text" maxlength="18" ref="couponId" v-model.trim="counponValue" autofocus="true" placeholder="请输入优惠券号">
                </li>
                <li>
                    <input type="text" maxlength="18" ref="couponCode" v-model.trim="counponPassword" placeholder="请输入优惠券密码">
                </li>
            </ul>
            <p class="tips">若优惠券无密码，密码一处可不填。</p>
        </div>
       
    </div>
</template>

<script type="ecma6.0">
import headerComponent from '../../components/HeaderComponent';
let root = window || {},
    util = root.util || {};

   
export default {
	data () {
		return {
            title: '添加优惠券',
            rightmenus:{
                type:'text',
                content:'确定'
            },
            counponValue: '',
            counponPassword: '',
            requestState: {
                save: true
            },
           msg: {
                m1: '未使用',
                m2: '添加优惠券',
                m3: '请输入优惠券号',
                m4: '请输入优惠券密码',
                m5: '请输入正确的优惠券号',
                m6: '请输入正确的优惠券密码',
                m7: '该优惠券号已被添加，<br/>请重新输入',
                m8: '优惠券已过期',
                m9: '优惠券绑定操作频繁',
                m10: '添加成功',
                m11: '请输入正确的优惠券号',
                m12: '请输入优惠券密码',
                m13: '请输入正确的优惠劵号'
            },
            couponReg: /^[A-Za-z0-9]{1,18}$/,
            couponCodeReg: /^[A-Za-z0-9]{1,18}$/
        }
	},
    methods:{
        //添加优惠券
        addCoupon(){
            let that = this,
            //券号
            coupon = that.counponValue,
            // 密码
            code = that.counponPassword;
            // 有效性验证
            if (!that.requestState.save) {
                return true;
            }

            if (!coupon) {
                that.$refs.couponId.focus();
                util.tip(that.msg.m3, {
                    duration: 2000
                });
                return false; 
            }
            if (!that.couponReg.test(coupon)) {
                that.$refs.couponId.focus();
                util.tip(that.msg.m11,{
                    duration:2000
                });
                return false;
            }
            // 如果密码存在，验证密码
    /*		if (code) {
            if (!that.couponCodeReg.test(code)) {
                util.tip(that.msg.m13,{
                    duration:2000
                });
                return false;
            }
        }*/

            that._addCoupon(coupon, code);
        },
        _addCoupon(coupon,code){
            let that = this;
        
            // 请求...
            util.api({
                surl: root.MB_API_PATH + 'actcou',
                // surl:'/resources/json/addcoupons.json',
                data: {
                    counum: coupon,
                    coupw: code
                },
                // type: 'get',
                type: 'post',
                beforeSend: function() {
                    that.requestState.save = false;
                },
                success: function(response) {
                    var rpco = response.rpco;

                    // 处理
                    switch (rpco) {
                        // 绑定成功
                        case 200:
                            //
                            util.tip(that.msg.m10, {
                            },2000);
                            setTimeout(function(){util.href('coupons.html')},2000)
                            break;
                            // 优惠券不存在
                        case 40001:
                            util.tip(that.msg.m5, {
                                duration: 2000
                            });
                            break;
                            // 优惠券密码错误
                        case 40002:
                            util.tip(that.msg.m6, {
                                duration: 2000
                            });
                            break;
                            // 优惠券已绑定
                        case 40003:
                            util.tip(that.msg.m7, {
                                duration: 2000
                            });
                            break;
                            // 优惠券已过期
                        case 40004:
                            util.tip(that.msg.m8, {
                                duration: 2000
                            });
                            break;
                            // 优惠券绑定操作频繁
                        case 40005:
                            util.tip(that.msg.m9, {
                                duration: 2000
                            });
                            break;
                        default:
                            util.tip('添加失败');
                    }
                },
                error: function(){
                    util.tip('当前网络不可用，请检查网络。',{duration:3000});
                    that.requestState.save = true;
                },
                complete: function() {
                    that.requestState.save = true;
                }
            });
        },
        setHeadBar(){
            let that = this;
            GomeJSBridge.ready(function(){
                let param = {
                    title :'添加优惠券',
                    menus : {
                        rightMenus:[
                            {
                                type:'callback',
                                title:'确定',
                                data:{
                                    id:'btn1',
                                    name:'确定',
                                    desc:'确定'
                                }
                            }
                        ]
                    }
                };
                util.setHeadBar(param);
            },null);

            GomeJSBridge.onCallback(function(data){
                if(data.id == "btn1"){
                    that.addCoupon();
                }
                console.log(data)
            })

        }
    },
    created(){
        if(util.isApp()){
            this.setHeadBar();
        }
    },
    components: {
        headerComponent
	}
}

</script>

<style lang="less">
@import '../../util/fs.less';

#addCoupon .right {
   .mixinfont(16px);
    color: #FF4B41;
}

/* 公共内容区 */
.container {
    width: 10rem;
    min-width: 320px;
    overflow-x: hidden;
    overflow-y: auto;
    position: absolute;
    top: 1.173333rem;
    bottom: 0;
    background: #f5f5f5;
}

/* 文字列表 */
.list-labelvalue {
    line-height: 1.306667rem /* 98/75 */;
    background-color: #fff;
    overflow: hidden;
   
}
.list-labelvalue li {
    float: left;
    width: 100%;
    background:#fff;
}

.list-labelvalue input {
    .mixinfont(16px);
    height:.56rem /* 42/75 */;
    line-height: .56rem /* 42/75 */;
    float: left;
    border-style: none;
    padding:.373333rem /* 28/75 */ .32rem /* 24/75 */;
    text-align: left;
}
/* 文字列表 */

.tips{
  line-height:.533333rem /* 40/75 */;
  padding-top: .24rem /* 18/75 */;
  padding-left:.32rem; 
  .mixinfont(14px);
  color: #999999;
}

</style>