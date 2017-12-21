<template>
    <ul class="el">
        <li v-for="(val,index) in body" class="elLi">
            <label @click="onAn(index,val.taf,val.brdid)">{{ val.brdnm }}<i :class="{i:val.taf}"></i></label>
             <transition name="slide-fade">
                 <ul class="elUl clearfix" >
                    <li class="float_l" v-for="(val2,index2) in bodyData[index].spus">{{ val2.spunm }}</li>
                </ul>
            </transition>

        </li>
    </ul>
</template>

<script>
export default {
    props:['body','bodyData'],
    data () {
        return {
        }
    },
    methods:{
        onAn (index,parameter,brdid) {
            var that = this;
            util.api({
            surl:'recycleModel.json',
            type:'get',
            success: function(response) {
                var rpco = response.rpco,
                    body = response.body;

                // 处理
                switch(rpco) {
                    case 200:
                        // 把每次获取的数据存到bodyData里
                        that.bodyData[index] = body;
                        console.log(that.bodyData)
                        break;
                    case 40401:
                        util.tip('服务器繁忙，请稍后再试',2000)
                        break;
                    default:
                        util.tip('请求失败');

                }

            }
        })
            // $.each(Eq, function(i,current) {
            //     current.taf = false;
            // })
            // Eq[index].taf = !parameter;

        },
        // 点击单选时

    },
    created () {
        var that = this,
            hrefParma = util.getHrefParma();
        this.cateid = hrefParma.cateid;
        this.catenm = hrefParma.catenm;
    }

}
</script>

<style lang="less">
    @import '../../util/fs.less';
    .slide-fade-enter-active {
      transition: all .1s ease;
    }
    .slide-fade-leave-active {
      transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-active {
      transform: translateX(10px);
      opacity: 0;
    }
    .el{
        background: #fff;
    }
    .el .elLi{
        margin-left: 0.32rem;
        border-bottom:1px solid #e9e9e9;
        padding-bottom: 0.173333rem;
    }
    .el .elLi:last-child{
        border: 0;
    }
    .el label{
        position: relative;
        display: block;
        height: 1.453333rem;
        background-size:2.133333rem;
    }
    .el label img{
        margin: auto 0;
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
    .elUl .obvious{
        border: 1px solid #ff9999;
        background: #fff1f1;
    }
</style>