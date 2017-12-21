<template>
    <div class="good">
        <div class="menu-wrapper" ref='menuWrapper'>
            <ul>
                <li v-for="( item, index) in goodsobj.menus" class="menu-item menu-item-hook waves" :class="{'current': index == currentindex,'prev':index == currentindex-1}"  @click="selectMenu(index, item.brdid, $event)">
                    <img :src="item.brdimg" alt="" onerror="javascript:this.src='http://gfs13.gomein.net.cn/T1.ZYQBChT1RCvBVdK.png'" />
                    <span>{{item.brdnm}}</span>
                </li>
            </ul>
        </div>
        <div class="goods-wrapper" ref='goodWrapper'>
            <ul>
                <li   v-for="(item, index) in goodsobj.goods" class="good-item waves">
                    <a class="goodsLink" :class="{'bdr-top': index!==0}"  href="javascript:;" @click="addPramas(index,$event)">{{item.spunm}}</a>
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
                hrefParma: {},
                goodheight:{
                    'height':0
                }
            };
        },
        created() {
            this.hrefParma = util.getHrefParma();
            // alert(JSON.stringify(this.goodsobj))
        },
        mounted() {
            var _this = this;
            // _this.$nextTick(()=>{
            //     if(util.isApp()){
            //         _this.goodheight['height'] = (window.innerHeight-$('.serveFlow')[0].clientHeight)+'px';
            //     }else{
            //         _this.goodheight['height'] = (window.innerHeight-$('.serveFlow')[0].clientHeight-$('.header')[0].clientHeight)+'px';
            //     }
                
            // })
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
                var that = this;
                if (!event._constructed) {
                    // 去掉自带click事件的点击
                    return;
                }
                ripple(event);
                let menuList = this.$refs.menuWrapper.getElementsByClassName('menu-item-hook');
                let el = menuList[index];
                this.menuScroll.scrollToElement(el, 300);
                this.$emit("changebrand",brdid,index);
                $(".goods-wrapper").scrollTop(0);
            },

            addPramas(index,ev) {
                ripple(ev);
                util.removeSession('recyclesaveasse');
                this.$emit("addpramas",this.currentIndex,index)
            }
        }
    };
</script>

<style lang='less'>
    @import '../../util/fs.less';
    .apponly{
        top: 2.4rem!important;
    }
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


</style>