<template>
    <ul class="repairList clearfix">
        <li   class=" float_l waves bdr-bottom bdr-r" v-for="(val,index) in body.cates" @click="skip($event,val.cateid,val.catenm,index)">
            <div class="float_l">
                <p>{{ val.catenm }}</p>
                <p>{{ eacnmDescribe[val.cateid] }}</p>
            </div>
            <img :src="val.cateimg" onerror="javascript:this.src='http://gfs12.gomein.net.cn/T1.RKjBChT1RCvBVdK.png'" alt="" class="float_r" />
        </li>
    </ul>
</template>

<script>
export default {
    props:['body'],
    data () {
        return {
            eacnmDescribe:{
                12:'操作规范 专业安全',
                36:'安全可靠 诚实守信',
                19:'免费上门 价格合理',
                20:'足不出户 快速出售',
                25:'专业回收 信誉保障',
                21:'随时上门 现场支付'
            }
        }
    },
    methods:{
        skip (ev,cateid,catenm,index) {
            ripple(ev);
            var that = this,
                ls=window.localStorage,
                arcode;
            // var els = document.querySelectorAll('[data-ripple]');
            // new RippleEffect(els[index],event);

            if(ls.getItem('dstrict') == null){
                arcode=110108
            }else{
                arcode=eval("("+ls.getItem('dstrict')+")").d
            }
            if (catenm.indexOf('手机') != -1) {
                util.href('recyclebrand.html',{
                    cateid:cateid,
                    catenm:catenm,
                    arcode:arcode
                })
            }else{
                util.href('recycleelse.html',{
                    cateid:cateid,
                    catenm:catenm,
                    arcode:arcode
                })
            };
        }
    }
}
</script>

<style lang="less">
    @import '../../util/fs.less';
    .repairList{
        background: #fff;
        li{
            box-sizing:border-box;
            width: 50%;
            height: 2.133333rem;
            /* border-bottom: 0.013333rem solid #e9e9e9; */
            /* border-right: 0.013333rem solid #e9e9e9; */
            div{
                p:nth-child(1){
                    color:#333;
                    .mixinfont(14px);
                    margin: 0.533333rem 0 0 0.4rem;
                };
                p:nth-child(2){
                    color:#999;
                    .mixinfont(10px);
                    margin: 0.186667rem 0 0 0.4rem;
                };
            }
            img{
                width: 1.653333rem;
                height: 1.653333rem;
                margin:0.266667rem 0.15rem 0 0;
            };
        };
        li:nth-child(event){
            border-right: 0;
        }
    };
</style>