<template>
    <ul class="el">
        <li v-for="(val,index) in body" class="elLi"  :class="{'bdr-bottom': index !== body.length-1}">
            <label @click="onAn(index,val.taf,val.brdid,val.brdnm)"><img :src="val.brdimg" onerror="javascript:this.src='http://gfs13.gomein.net.cn/T1.ZYQBChT1RCvBVdK.png'"  alt="" /><i :class="{i:val.taf}"></i></label>
             <transition name="slide-fade">
                 <ul class="elUl clearfix" v-show="body[index].taf">
                    <li class="float_l waves" @click="onshow($event,bodydata.spus,index2)" v-for="(val2,index2) in bodydata.spus">{{ val2.spunm }}</li>
                </ul>
            </transition>
        </li>
    </ul>
</template>

<script>
export default {
    props:['body'],
    data () {
        return {
            bodydata:{},
            hrefParma: util.getHrefParma(),
            brdid:'',
            brdnm:''
        }
    },
    methods:{
        onAn (index,parameter,brdid,brdnm) {
            var that = this;
            that.brdid = brdid;
            that.brdnm = brdnm;
            util.api({
                surl:root.RECYCLE_API_PATH+'getSPU',
                data:{
                    arcode: that.hrefParma.arcode,
                    cateid: that.hrefParma.cateid,
                    brdid: that.brdid
                },
                type:'get',
                success: function(response) {
                    var rpco = response.rpco,
                        body = response.body;

                    // 处理
                    switch(rpco) {
                        case 200:
                            // 把每次获取的数据存到bodyData里
                            that.bodydata = body;
                            break;
                        case 40401:
                            util.tip('服务器繁忙，请稍后再试',2000)
                            break;
                        default:
                            util.tip('请求失败');

                    }

                }
            })
            $.each(this.body, function(i,current) {
                current.taf = false;
            })
            this.body[index].taf = !parameter;
        },
        onshow (ev,spus,index) {
            ripple(ev);
            util.removeSession('recyclesaveasse');
            var parmasObj = {
                //品类
                catename: this.hrefParma.catenm,
                cateid: this.hrefParma.cateid,
                //品牌
                brdid: this.brdid,
                brdnm: this.brdnm,
                //型号
                proid: spus[index].spuid,
                attrnm: spus[index].spunm,
                arcode: this.hrefParma.arcode||100000,
                pageid: this.hrefParma.pageid,
                tsup: this.hrefParma.tsup,
                btime: this.hrefParma.btime,
                beizhu: this.hrefParma.beizhu
            }
            var that = this;
            util.href('./recycleinfo.html',parmasObj)
        }

    }

}
</script>

<style lang="less">
    @import '../../util/fs.less';
    .slide-fade-enter-active {
      transition: all .1s ease;
    }
    .slide-fade-leave-active {
      transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-active {
      transform: translateX(10px);
      opacity: 0;
    }
    .el{
        background: #fff;
        margin-top: 0.266667rem;
    }
    .el .elLi{
        margin-left: 0.32rem;
        /* border-bottom:1px solid #e9e9e9; */
    }
   /*  .el .elLi:last-child{
        border: 0;
    } */
    .el label{
        position: relative;
        display: block;
        height: 1.466667rem;
    }
    .el label img{
      width: 2.533333rem;
      height: 1.466667rem;
    }
    .el label i{
        position: absolute;
        top:0;
        right:0.32rem;
        height: 100%;
        width: 0.36rem;
        background: url(./img/day.png) no-repeat right center;
        background-size: 0.2rem 0.36rem;
    }
    .el label .i{
        background-image: url(./img/xay.png);
        background-size:0.36rem 0.2rem ;
    }
    .elUl li{
        width: 4.466667rem;
        height:1.173333rem;
        line-height: 1.173333rem;
        text-align: center;
        background:#f6f6f6;
        border-radius: 3px;
        margin-bottom: 0.213333rem;
        margin-left: 0.266667rem;
        color: #333;
        box-sizing:border-box;
        .mixinfont(14px);
    }
    .elUl li:nth-child(odd){
        margin-left: 0.08rem;
     }
    .elUl li:last-child{
        margin-bottom:0.4rem;
     }
    .elUl .obvious{
        border: 1px solid #ff9999;
        background: #fff1f1;
    }
</style>