<template>
    <div class="good">
        <div class="menu-wrapper" ref='menuWrapper'>
            <ul>
                <li  data-ripple v-for="( item, index) in goods" class="menu-item menu-item-hook" :class="{'current': index == currentIndex}"  @click="selectMenu(index, $event)">
                    <img src="" alt="">
                    <span>{{item.brdnm}}</span>
                </li>
            </ul>
        </div>
        <div class="goods-wrapper" ref='goodWrapper'>
            <ul>
                <li v-for="item in goods" class="good-list good-list-hook">
                    <ul>
                        <li v-for="good in item.sup" class="good-item">
                                <!-- <h2 class="name">{{food.name}}</h2> -->
                            <a class="goodsLink" href="javascript:;" @click="addPramas(item, good)">{{good.supnm}}</a>
                        </li>
                    </ul>
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
        },
        data () {
            return {
                listHeight: [],
                scrolly: 0,
                goods:[]
            };
        },
        created() {
            console.log(this.goods)
            let that = this;
            $.ajax({
                url: 'data.json',
                method: 'get',
                data:{},
                success(res) {
                    that.goods = res.goods;
                    that.$nextTick(()=>{
                        that._initScroll();
                        that._calculateHeight();
                    });

                }
            })
            // this.$nextTick(()=>{
            //     this._initScroll();
            //     this._calculateHeight();
            // });
        },
        computed: {
            currentIndex() {
                for (let i = 0; i < this.listHeight.length; i++) {
                    let height = this.listHeight[i];
                    let height2 = this.listHeight[i + 1];
                    if (!height2 || (this.scrolly >= height && this.scrolly < height2)) {
                        let menuList = this.$refs.menuWrapper.getElementsByClassName('menu-item-hook');
                        let el = menuList[i];
                        this.menuScroll.scrollToElement(el, 300);
                        return i;
                    }
                }
                return 0;
            }
        },
        methods: {
            _initScroll() {
                console.log(this.$refs)
                this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                    click: true
                });
                this.goodScroll = new BScroll(this.$refs.goodWrapper, {
                    probeType: 3,
                    click: true
                });
                this.goodScroll.on('scroll', (pos)=>{
                    this.scrolly = Math.abs(Math.round(pos.y));

                });
            },
            _calculateHeight() {
                let goodList = this.$refs.goodWrapper.getElementsByClassName('good-list-hook');
                let height = 0;
                this.listHeight.push(height);
                for (let i = 0; i < goodList.length; i++) {
                    let item = goodList[i];
                    height += item.clientHeight;
                    this.listHeight.push(height);
                }
            },
            selectMenu(index, event) {
                if (!event._constructed) {
                    // 去掉自带click事件的点击
                    return;
                }
                let goodList = this.$refs.goodWrapper.getElementsByClassName('good-list-hook');
                let menuList = this.$refs.menuWrapper.getElementsByClassName('menu-item-hook');
                let el = goodList[index];
                this.goodScroll.scrollToElement(el, 300);
                if(this.currentIndex!=index){
                    console.log(this.currentIndex,index)
//                    this.currentIndex = index
                    $.each(menuList,function(i,el){
                        $(el).removeClass('current');
                    });
                   $(menuList[index]).addClass('current');
                }
            },
            addPramas(parent, good) {
                console.log(parent, good)
            }
        },
        components: {}
    };
</script>

<style lang='less'>
    @import '../../util/fs.less';
    .good{
        display: flex;
        position: absolute;
        width: 100%;
        top: 3.04rem;
        bottom: 0;
        overflow: hidden;
    }
    .menu-wrapper{
        flex: 0 0 2.266667rem;
        width: 2.266667rem;
        background: #fff;
        .menu-item{
            display: table;
            width: 100%;
            height: 1.466667rem;
            line-height: 0px;
            /* padding: 0 0.32rem; */
            border-top: 1px solid #f5f5f5;
            box-sizing: border-box;
            img{
                display: block;
                width: 100%;
                height: 0.853333rem;
            };
            span{
                display: block;
                width: 100%;
                height: 100%;
                line-height: 0.613333rem;
                .mixinfont(14px);
                text-align: center;
            };
            &.current{
                background: #F5F5F5;
                color: #FF493F;
                border-left: 0.053333rem solid #FF493F;
                border-top: none;
            }
            &.current+.menu-item{
                border-top: none;
            }
        }
    }
   
    .goods-wrapper{
        flex: 1;
        .good-list{
            font-size: 12px;
            color: rgb(147, 153, 159);
            background: #f5f5f5;
            .good-item{
                padding-left: 0.186667rem;
                height: 1.466667rem;
                line-height: 1.466667rem;
                border-top: 1px solid #e9e9e9;
                .mixinfont(14px);
                .goodsLink {
                    color: #333;
                    display: block;
                }
            }
        }
    }
</style>