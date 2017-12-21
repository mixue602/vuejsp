<template>
    <div class="directionlist wapper" :style="{'height':screen}">
        <div class="list" :style="{'height':screen}">
            <ul class="directionlist_left">
                <li v-for="(k,v) in categorylist" @click="selectc(k,v)" :class="{'select':v==index}">
                    <span>{{k.name}}</span>
                    <div class="redblock" v-if="index==v"></div>
                </li>
            </ul>
            <ol class="directionlist_right">
                <li v-for="(m,n) in brandlist">
                    <p>{{m.name}}</p>
                    <div v-for="(j,l) in m.brands" @click="selectb(m,j)">
                        <img :src="'http://img.dev.gomegj.com/guanjia/v2/brimg/'+j.id+'.png'">
                        <span>{{j.name}}</span>
                    </div>
                </li>
            </ol>
        </div>
        <header-components :title="headeroptions.title" :rightmenus="headeroptions.rightmenus"></header-components>
    </div>
</template>
<script>
import headerComponents from '../../components/HeaderComponent'
var root = window || {},
    util = root.util;
export default {
    data() {
        return {
            categorylist: {}, //品类列表
            brandlist: {}, //品牌列表
            screen: "", //屏幕高
            headeroptions: { //头部组件参数
                title: '分类',
                rightmenus: {
                    type: 'text',
                    content: ''
                }
            },
            hrefParama: {}, //链接参数
            index: 0,
            option:{
                
            }
        };
    },
    created() {
        this.load();
        this.hrefParama = util.getHrefParma();
        if(util.isApp()){
            util.deleteHeadBtn();
        }
    },
    mounted() {
        this.screen = window.innerHeight - parseInt($('.header').css('height')) + "px";
    },
    methods: {
        //加载数据
        load() {
            let _this = this;
            util.api({
                surl: "/yf/json/disctionlist.json",
                type: "get",
                success: function(res) {
                    console.log(res);
                    _this.categorylist = res.data;
                    _this.brandlist = res.data[0].children;
                },
                error: function() {}
            });
        },
        //选中品类
        selectc(item, index) {
            this.index = index;
            this.brandlist = item.children;
        },
        //选中品牌
        selectb(...item) {
            console.log(item)
            let _this = this;
            _this.option.cateid = item[0].cateid; //品类id
            _this.option.brandId = item[1].id; //品牌id
            _this.option.level = item[0].lvl; //层级
            _this.option.page = 1;
            _this.option.cname = encodeURI(item[1].ename);
            _this.headeroptions.title = encodeURI(item[1].ename);
            util.href('./directionml.html',_this.option)

        }
    },
    components: {
        headerComponents
    }
};
</script>
<style scoped="less">
/* @import '../../util/fs.less'; */

body {
    background: #fff;
}

.directionlist {
    width: 100%;
    background: #fff;
}

.list {
    width: 100%;
}

.iscrollpading {
    height: 100%;
    overflow: hidden;
}


/*.list:after{
  content:"";
  clear:both;
  display:block;
  height:0;
  overflow:hidden;
  visibility:hidden;

}*/

.directionlist_left {
    width: 2.4rem;
    height: 100%;
    float: left;
    background: #f3f5f7;
    overflow-x: hidden;
    overflow-y: auto;
}

.directionlist_left li {
    width: 100%;
    height: 1.22667rem;
    line-height: 1.173333rem;
    text-align: center;
    font-size: 0.373333rem;
    position: relative;
}

.directionlist_left li .redblock {
    width: 0.10667rem;
    height: 0.4533rem;
    background: #ef3133;
    left: 0;
    top: 0.4rem;
    position: absolute;
}

.directionlist_left li.select {
    background: #fff;
}

.directionlist_right {
    width: 7.2rem;
    height: 100%;
    float: right;
    background: #fff;
    padding-bottom: 0;
    padding-right: 0;
    overflow-y: scroll;
}

.directionlist_right li {
    width: 100%;
    float: left;
}

.directionlist_right li p {
    width: 100%;
    height: 1.04rem;
    font-size: 0.373rem;
    line-height: 1.04rem;
}

.directionlist_right li div {
    width: 2.08rem;
    height: 2.08rem;
    margin: 0.32rem 0.32rem 0 0;
    float: left;
    background: #f9f9f9;
    background-size: cover;
}

.directionlist_right li div img {
    width: 100%;
    height: 0.666667rem;
    display: block;
    margin-top: 0.53333rem;
}

.directionlist_right li div span {
    display: block;
    width: 100%;
    line-height: 0.93333rem;
    text-align: center;
    color: #333;
    font-size: 0.346667rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>