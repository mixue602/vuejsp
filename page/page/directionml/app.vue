<template>
    <div class="wapper directionml">
        <header-components :title="headeroptions.title" :rightmenus="headeroptions.rightmenus" @watchlist="hotbrand"></header-components>
        <model-list :listmsg="option" :hboptions="request"></model-list>
    </div>
</template>
<script>
var root = window.root || {},
    util = root.util || {};
import headerComponents from '../../components/HeaderComponent.vue'
import modelList from '../../components/modelList.vue'

export default {
    data() {
        return {
            hrefParma: util.getHrefParma(),
            headeroptions: {
                rightmenus: {
                    type: 'text',
                    content: ''
                },
                title: ''
            },
            option: {

            },
            request: {
                hotbrand: false,
                url: root.INSTRUCTION_API_PATH + 'brandcategory'
            }
        }
    },
    created() {
        this.headeroptions.title = decodeURI(this.hrefParma.cname);
        if (this.hrefParma.cateid && !this.hrefParma.brandId) {
            this.headeroptions.rightmenus = {
                type: 'text',
                content: '热门品牌'
            };
            this.headeroptions.title = decodeURI(this.hrefParma.cname);
            this.option = {
                page: 1,
                cateid: this.hrefParma.cateid,
                level: 4
            }
            return;
        }
        if (this.hrefParma.cateid && this.hrefParma.brandId) {
            this.headeroptions.rightmenus = {
                type: 'text',
                content: ''
            }
            this.headeroptions.title = this.hrefParma.cname;
            this.option.cateid = this.hrefParma.cateid;
            this.option.brandId = this.hrefParma.brandId;
            this.option.level = 5
            return;
        }
    },
    methods: {
        hotbrand() {
            var _this = this;
            util.api({
                surl: '/yf/json/disctionlist.json',
                type: 'get',
                success: function(res) {
                    _this.request.hotbrand = true;
                    for (var i = 0; i < res.data.length; i++) {
                        if (res.data[i].cateid == _this.hrefParma.cateid) {
                            var HBL = res.data[i].children;
                            for (var l = 0; l < HBL.length; l++) {
                                for (var j = 0; j < HBL[l].brands.length; j++) {
                                    HBL[l].brands[j].cateid = HBL[l].cateid;
                                }
                            }
                            var arr = [];
                            for (var b = 0; b < HBL.length; b++) {
                                arr = arr.concat(HBL[b].brands)
                            }
                            _this.request.hotbrandlist = _this.Dremoval(arr);
                        }
                    }
                }
            })
        },
        //去重
        Dremoval(arr) {
            var hash = {};
            return arr = arr.reduce(function(item, next) {
                hash[next.id] ? '' : hash[next.id] = true && item.push(next);
                return item
            }, [])
        }
    },
    components: {
        headerComponents,
        modelList
    }
}
</script>
<style>
</style>