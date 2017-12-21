<template>
    <div class="brandMask" :class="{'on':modelshow}" @click="hideMask">
        <div class="brandBox"  @click.stop='stopper'>
            <h2 class="brandTit bdr-bottom">
                <a class="back" href="javascript:;"  @click="goback"><i></i></a>
                    请选择设备
                 <!-- <a class="float_r" href="javascript:;" @click="addPramas">确定</a> -->
             </h2>
            <div class="good" >
                <div class="menu-wrapper" ref='menuWrapper'>
                    <ul>
                        <li  v-for="( item, index) in menuobj" class="menu-item menu-item-hook " :class="{'current': index == currentindex,'prev':index == currentindex-1}"  @click.stop="selectMenu(index, item.brdid, $event)">
                            <img :src="item.brdimg" alt="" onerror="javascript:this.src='http://gfs13.gomein.net.cn/T1.ZYQBChT1RCvBVdK.png'"/>
                            <span>{{item.brdnm}}</span>
                            <!-- <span class="clickbox waves"  @click="selectMenu(index, item.brdid, $event)"></span> -->
                        </li>
                    </ul>
                </div> 
                <div class="goods-wrapper" ref='goodWrapper'>
                    <ul>
                        <li v-for="(item, index) in goodsobj"  class="good-item">
                            <a class="goodsLink" :class="{'bdr-top': index!==0}"  @click.stop='showAttr(item.taf,index)' href="javascript:;" >{{item.mdnm.length>14?item.mdnm.substr(0,14)+'...':item.mdnm}}<i :class="{i:item.taf}"></i></a>
                            <ul class="goods-attr" v-show="item.taf">
                                <li  v-for="(val,index2) in item.attrgrps[0].attrs" class="waves" :class="{'on':val.on}" @click.stop="selectAttr(index,index2,val,$event)" >{{val.attrnm}}</li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div class="liner"></div>
            </div>
        </div>
      
    </div> 
</template>

<script type='text/ecmascript-6'>
    import BScroll from 'better-scroll';
    let root = window || {},
        util = root.util || {};
    const ERR_OK = 0;
    let num = 1;
    let goodsRender = null,currentindex=null, parentIndex = null,childIndex=null;
    export default {
        props:["modelshow","goodsobj","currentindex","menuobj"],
        data () {
            return {
                hrefParma: {},
                attrindex:null,
                parentIndex:null,
                childIndex:null,
                goodsRender:[],
                onIndex:null
            };
        },
        created() {
            var that = this;
            this.hrefParma = util.getHrefParma();
            $.each(this.goodsobj,(index,val)=>{
                if(val.taf){
                    that.parentIndex = index;
                    $.each(val.attrgrps[0].attrs,(n,item)=>{
                        if(item.on){
                            that.childIndex = n;
                        }
                    })
                }
            })
           
        },
        updated() { 
            if(this.modelshow&&num){
                this.$nextTick(()=>{
                    this._initScroll();         
                });
                num = 0;
            } 
        },
        methods: {
            // 注册滚动事件
             _initScroll() {
                this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                    click: true
                });
            },
            // 销毁滚动
            _destroyScroll(){
                num = 1;
                this.menuScroll.destroy();
                $(".menu-wrapper ul").css({'transform': 'translate(0, 0)'});
                $(".goods-wrapper").scrollTop(0);
            },
            hideMask(){
                if(this.onIndex===null){this.onIndex = this.currentindex};
                if(this.goodsRender.length<=0){this.goodsRender=this.goodsobj};
                this.$emit('goback','modelShow','app',this.goodsRender,this.onIndex);
                this._destroyScroll();
            },
            // 切换品牌
            selectMenu(index,brdid,event) {
                if (!event._constructed) {
                    // 去掉自带click事件的点击
                    return;
                } 
                ripple(event);  
                let menuList = this.$refs.menuWrapper.getElementsByClassName('menu-item-hook');
                let el = menuList[index];
                this.menuScroll.scrollToElement(el, 300);
                $(".goods-wrapper").scrollTop(0);
                this.$emit("changebrand",brdid,index,1);
                return false;
            },
            // 显示属性信息
            showAttr(flag,index){
                if(this.goodsobj[index].attrgrps[0].attrs.length>0){
                    $.each(this.goodsobj, function(i,current) {
                        current.taf = false;
                    })
                    this.goodsobj[index].taf = !flag;
                    this.attrindex = null;
                }else{
                    this.parentIndex = index;
                    this.childIndex = null;
                    this.$emit("addpramas",this.parentIndex,this.childIndex,1)  
                    this._destroyScroll();
                }
                return false;
                
            },
            // 选择属性
            selectAttr(index,index2,val,event) {
                let that = this;
                ripple(event);
                setTimeout(function(){
                    $.each(that.goodsobj, function(i,current) {
                        $.each(current.attrgrps[0].attrs, function(n,item) {
                            item.on = false;
                        })
                    })
                     val.on = true;
                    // this.attrindex = index2;
                    that.parentIndex = index;
                    that.childIndex = index2;
                    that.goodsRender = that.goodsobj;
                    that.onIndex = that.currentindex;
                    that.$emit("addpramas",that.parentIndex,that.childIndex,that.goodsRender,that.onIndex,1);
                    that._destroyScroll();
                }, 200)
                
                return false;
            },
            goback() {
                if(this.onIndex===null){this.onIndex = this.currentindex};
                if(this.goodsRender.length<=0){this.goodsRender=this.goodsobj};
                this.$emit("goback","modelShow","deviceShow",this.goodsRender,this.onIndex);
                this._destroyScroll();
            },
            // 阻止冒泡
            stopper(){
                return false;
            },
            // 确定信息
            addPramas() {
                if(this.parentIndex !== null){
                    this.$emit("addpramas",this.parentIndex,this.childIndex,this.goodsRender,1)
                    this._destroyScroll();
                }  
            }
        }
    };
</script>

<style lang='less'>
    @import '../../util/fs.less';
    .brandMask{
        position: fixed;
        top:0;
        bottom:0;
        left: 66.666667rem;
        right:0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.3);
        z-index: 999999;
        /* display: none; */
        opacity: 0;
        -webkit-transition: all .25s linear;
        &.on{
            /* display: block; */
            opacity: 1;
            left: 0;
        };
        .brandBox{
            position: absolute;
            top: 0;
            left:  1.2rem;
            /* left:  0; */
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
                .mixinfont(16px);
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
            .good{
                display: flex;
                position: absolute;
                top: 1.173333rem;
                bottom:0;
                width: 100%;
                /* max-width: 10rem; */
                overflow: hidden;
                background-color: #fff;
                .liner{
                    content:"";
                    position: absolute;
                    top: 0;
                    left: 2.2rem;
                    bottom: 0;
                    width: 4px;
                    background-color: #fff;
                    z-index: 99999;
                };
                .menu-wrapper{
                    flex: 0 0 2.266667rem;
                    width: 2.266667rem;
                    overflow-y: auto;
                    background: #fff;
                    .menu-item{
                        /* position: relative; */
                        display: table;
                        width: 100%;
                        height: 1.866667rem;
                        line-height: 0px;
                        background:url(//gfs6.gomein.net.cn/T1pwbTBTCg1RCvBVdK) no-repeat; 
                        background-size: cover;
                        padding-right: 2px;
                        img{
                            display: block;
                            width: 2.133333rem;
                            height: 0.666667rem;
                            margin: 0.32rem auto 0.133333rem;
                        };
                        span{
                            display: block;
                            width: 100%;
                            height: 0.666667rem;
                            line-height: 0.533333rem;
                            .mixinfont(14px);
                            text-align: center;
                        };
                        .clickbox{
                            position: absolute;
                            top:0;
                            right:0;
                            top:0;
                            bottom:0;
                            width: 100%;
                            height: 100%;
                            background-color: transparent;
                        }
                        &.current{
                            background: #fff;
                            color: #FF493F;
                            border-left: 0.053333rem solid #FF493F;
                            background-image: none;
                            background:#fff;
                        };
                        &.prev{
                            background-image: url(//gfs3.gomein.net.cn/T1WwYTBmhb1RCvBVdK);
                        };
                        &.current+.menu-item{
                            background-image: url(//gfs2.gomein.net.cn/T1ewVTBXC_1RCvBVdK);
                        }
                    }
                }
                .goods-wrapper{
                    flex: 1;
                    overflow-y: auto;
                    .good-item{
                        width: 100%;
                        display: block;
                        color: rgb(147, 153, 159);
                        background: #fff;
                        padding-left: 0.24rem;
                        box-sizing:border-box;
                        .mixinfont(14px);
                        .goodsLink {
                            text-indent: 0.266667rem;
                            color: #333;
                            display: block;
                            /* border-top: 0.013333rem solid #e9e9e9; */
                            height: 1.866667rem;
                            line-height: 1.866667rem;
                            position: relative;
                            box-sizing:border-box;
                            i{
                                position: absolute;
                                top:0;
                                right:0.32rem;
                                height: 100%;
                                width: 0.36rem;
                                background: url(./img/day.png) no-repeat right center;
                                background-size: 0.2rem 0.36rem;
                            }
                            .i{
                                background-image: url(./img/xay.png);
                                background-size:0.36rem 0.2rem ;
                            }
                        };
                        &:first-child .goodsLink{
                            border-top:none;
                        };
                        .goods-attr{
                            width: 100%;
                            li{
                                width: 46%;
                                margin-left: 4%;
                                margin-bottom: 0.213333rem;
                                height: 1.2rem;
                                line-height: 1.2rem;
                                text-align: center;
                                border-radius: 0.106667rem;
                                background-color: #F6F6F6;
                                box-sizing: border-box;
                                &:nth-child(odd){
                                   margin-left:0.066667rem;
                                };
                                &.on{
                                   background-color: #FFF1F1;
                                   border: 1px solid #FF9897; 
                                }
                            }
                        }
                    }
                } 
            }
        }
        
    }
   
    
    
</style>