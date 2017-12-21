<template>
    <div class="brandMaskTwo" :class="{'on':modelshowtwo}"  @click="hideMask">
        <div class="brandBox"  @click.stop='stopper'>
            <h2 class="brandTit bdr-bottom">
                <a class="back" href="javascript:;"  @click="goback"><i></i></a>
                    请选择设备
                 <!-- <a class="float_r" href="javascript:;" @click="addPramas">确定</a> -->
             </h2>
            <ul class="el">
                <li v-for="(val,index) in menuobj" class="elLi waves bdr-bottom">
                    <label  @click.stop="onAn(index,val,val.taf)"><img :src="val.brdimg"  alt=""><i :class="{i:val.taf}"></i></label>
                     <transition name="slide-fade">
                        <ul class="elUl clearfix" v-show="menuobj[index].taf">
                            <li  v-for="(val2,index2) in goodsobj">
                                <a class="ellipsis waves" href="javascript:;" v-for="(val3,index3) in val2.attrgrps[0].attrs"
                                :class="{'on':val3.on}" @click.stop="onshow(index,index2,index3,val3,$event)" >{{ val2.mdnm+val3.attrnm }}</a>
                            </li>
                        </ul>
                    </transition>
                </li>
            </ul>
        </div>
    </div> 
</template>

<script>
export default {
    props:['menuobj','goodsobj','modelshowtwo'],
    data () {
        return {
            bodydata:{},
            hrefParma: util.getHrefParma(),
            brdid:'',
            brdnm:'',
            attrindex: null,
            parentIndex: null,
            childIndex: null,
            goodsRender: {},
            onIndex: null
        }
    },
    created() {
        var that = this;
        this.hrefParma = util.getHrefParma();
        this.goodsRender = this.goodsobj;
        $.each(this.goodsobj,(index,val)=>{
            $.each(val.attrgrps[0].attrs,(n,item)=>{
                if(item.on){
                    that.parentIndex = index;
                    that.childIndex = n;
                }
            })
        })  
    },
    methods:{
        hideMask(){
            if(this.onIndex===null){this.onIndex = this.currentindex}
            if(this.goodsRender.length<=0){this.goodsRender=this.goodsobj}
            this.$emit('goback','modelShowTwo','app',this.goodsRender,this.onIndex)
        },
        onAn (index,val,flag) {
            var that = this;
            that.brdid = val.brdid;
            that.brdnm = val.brdnm;
            $.each(that.menuobj, function(i,current) {
                current.taf = false;
            })
            val.taf = !flag;
            this.attrindex = null;
            this.$emit("changebrand",val.brdid,index,2);  
        },
        onshow (index,index2,index3,val3,$event) {
            let that = this;
            ripple(event);
            setTimeout(function(){
                if(that.goodsobj[index2].attrgrps[0].attrs.length>0){
                    that.parentIndex = index2;
                    that.childIndex = index3;
                    $.each(that.goodsobj, function(i,current) {
                        $.each(current.attrgrps[0].attrs, function(n,item) {
                            item.on = false;
                        })
                    })
                    val3.on = true;
                    that.onIndex = index;
                    that.goodsRender = that.goodsobj;
                    that.$emit("addpramas",that.parentIndex,that.childIndex,that.goodsRender,that.onIndex,2); 
                 }else{
                    that.parentIndex = index2;
                    that.childIndex = null;
                    that.$emit("addpramas",that.parentIndex,that.childIndex,2) 
                 }
            }, 200)
            
           

        },
        goback() {
            if(this.onIndex===null){this.onIndex = this.currentindex}
            if(this.goodsRender.length<=0){this.goodsRender=this.goodsobj}
            this.$emit("goback","modelShowTwo",'deviceShow',this.goodsRender,this.onIndex);
        },

        //  goback() {
        //     if(this.onIndex===null){this.onIndex = this.currentindex}
        //     if(this.goodsRender.length<=0){this.goodsRender=this.goodsobj}
        //     this.$emit("goback","modelShowTwo",'deviceShow',this.goodsRender,this.onIndex);
        // },
        // 阻止冒泡
        stopper(){
            return false;
        },
        addPramas() {
            if(this.parentIndex !==null){
                this.$emit("addpramas",this.parentIndex,this.childIndex,this.goodsRender,2); 
            }      
        }

    }

}
</script>

<style lang="less">
    @import '../../util/fs.less';
    .brandMaskTwo{
        position: fixed;
        top:0;
        bottom:0;
        left:30.666667rem;
        right:0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.3);
        z-index: 999999;
        opacity: 0;
        -webkit-transition: all .25s linear;
        &.on{
            left: 0;
            opacity: 1;
        };
        .brandBox{
            position: absolute;
            top: 0;
            left: 1.2rem;
            right:0;
            bottom:0;
            background-color: #fff;
            box-shadow: 0 0 10 rgba(255,255,255,0.5);
            .brandTit{
                position: relative;
                z-index: 99999;
                width: 100%;
                height: 1.173333rem;
                line-height: 1.173333rem;
                text-align: center;
                padding: 0 0.32rem;
                .mixinfont(16px);/* 
                border-bottom: 0.013333rem solid #e9e9e9; */
                box-sizing:border-box;
                .back{
                    width: 1.066667rem;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    i{
                        position: absolute;
                        top: 0.306667rem;
                        left: 0.32rem;
                        width: 0.333333rem;
                        height: 0.573333rem;
                        background:url(//gfs6.gomein.net.cn/T1hTDTBKWQ1RCvBVdK) no-repeat;
                        background-size: 0.333333rem 0.573333rem;  
                    }
                }
            }
        }
    }
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
        position: absolute;
        top: 1.173333rem;
        bottom:0;
        width: 100%;
        /* max-width: 10rem; */
        overflow: auto;
    }
    .el .elLi{
        display: block;
        margin-left: 0.32rem;
        /* border-bottom:0.013333rem solid #e9e9e9; */
    }
    .el .elLi:last-child{
        border: 0;
    }
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
    .elUl li a{
        display: inline-block;
        width: 46%;
        height:1.173333rem;
        line-height: 1.173333rem;
        text-align: center;
        background:#f6f6f6;
        border-radius: 3px;
        margin-bottom: 0.213333rem;
        margin-left: 4%;
        color: #333;
        box-sizing:border-box;
        .mixinfont(14px);
        &.on{
            background-color: #FFF1F1;
            border: 1px solid #FF9897; 
        }
    }
    .elUl li a:nth-child(odd) {
        margin-left: 0;
     }
   /*  .elUl li a:last-child{
        margin-bottom:0.4rem;
     } */
    .elUl .obvious{
        border: 1px solid #ff9999;
        background: #fff1f1;
    }
</style>