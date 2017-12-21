<template>
    <div class="good" >
        <div class="menu-wrapper" ref='menuWrapper'>
            <ul>
                <li  v-for="( item, index) in goodsobj.menus" class="menu-item menu-item-hook waves" :class="{'current': index == currentindex,'prev':index == currentindex-1}"  @click="selectMenu(index, item.brdid, $event)">
                    <img :src="item.brdimg" alt="">
                    <span>{{item.brdnm}}</span>
                </li>
            </ul>
        </div>
        <div class="goods-wrapper" ref='goodWrapper'>
            <ul>
                <li data-ripple  v-for="(item, index) in goodsobj.goods" class="good-item waves" @click="addPramas(index,$event)">
                    <a class="goodsLink" :class="{'bdr-top': index!==0}" href="javascript:;" >{{item.mdnm}}</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script type='text/ecmascript-6'>
    import BScroll from 'better-scroll';
    let root = window || {},
        util = root.util || {};
    const ERR_OK = 0;
    export default {
        props: {
            goodsobj:{
                type: Object
            },
            currentindex:{
                 type: Number
            }
        },
        data () {
            return {
                hrefParma: {}
            };
        },
        created() {
            this.hrefParma = util.getHrefParma();

        },
        mounted() {
            this.$nextTick(()=>{
                this._initScroll();
                if (util.isApp()) {
                    $(".wapper .good").addClass("apponly");
                }
            });
        },
        methods: {
            _initScroll() {
                this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                    click: true
                });
            },
            selectMenu(index,brdid,event) {
                 if (!event._constructed) {
                    // 去掉自带click事件的点击
                    return;
                }
                ripple(event);
                // this.currentIndex = index;
                let menuList = this.$refs.menuWrapper.getElementsByClassName('menu-item-hook');
                let el = menuList[index];

                this.menuScroll.scrollToElement(el, 300);
                $(".goods-wrapper").scrollTop(0);
                this.$emit("changebrand",brdid,index);
                // let prov = index-1,next = index+1;
                // console.log(prov)

                //  $(menuList).css("background-image","url(//gfs6.gomein.net.cn/T1pwbTBTCg1RCvBVdK)")
                // if(prov>=0){
                //     $(menuList[prov]).css("background-image","url(//gfs3.gomein.net.cn/T1WwYTBmhb1RCvBVdK)");
                //     $(menuList[next]).css("background-image","url(//gfs2.gomein.net.cn/T1ewVTBXC_1RCvBVdK)");
                // }


            },
            addPramas(index,event) {
                util.removeSession('repairsaveasse');
                ripple(event);
                this.$emit("addpramas",this.currentindex,index)
            }
        }
    };
</script>

<style lang='less'>
    @import '../../util/fs.less';
    .good{
        display: flex;
        position: absolute;
        top: 3.6rem;
        bottom:0;
        width: 100%;
        max-width: 10rem;
        overflow: hidden;
        .menu-wrapper{
            flex: 0 0 2.266667rem;
            width: 2.266667rem;
            overflow-y: auto;
            background: #fff;
            .menu-item{
                display: table;
                width: 100%;
                height: 1.866667rem;
                line-height: 0px;
                /* padding: 0 0.32rem; */
                /* border-top: 1px solid #e3e3e3; */
                /* background-color: #f3f3f3; */
                background:url(//gfs6.gomein.net.cn/T1pwbTBTCg1RCvBVdK) no-repeat;
                background-size: cover;
                box-sizing: border-box;
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
                padding-left: 0.533333rem;
                height: 1.866667rem;
                line-height: 1.866667rem;
                box-sizing:border-box;
                margin-top: -1px;
                .mixinfont(14px);
                .goodsLink {
                    text-indent: 0.266667rem;
                    color: #333;
                    display: block;
                    /* border-top: 0.013333rem solid #e9e9e9; */
                };
               /*  &:first-child .goodsLink{
                    border-top:none;
                }; */
            }
        }
    }
    .apponly{
        top: 2.4rem;
    }


</style>