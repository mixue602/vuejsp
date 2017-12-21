<template>
    <div class="wapper">
        <header-component :title="title"></header-component>
        <!-- <service-steps :active= 1 :sertype=1></service-steps> -->
        <server-flow :index="1"></server-flow>
        <equipment-list :body="body"></equipment-list>
    </div>
</template>
<script type='text/ecmascript-6'>
var root = window || {},
    util = root.util || {};

import headerComponent from '../../components/HeaderComponent'
import serviceSteps from '../../components/ServiceSteps'
import serverFlow from '../../components/ServeFlow'
import equipmentList from './EquipmentList'

export default {
    data() {
        return {
            title: '',
            body: [],
            imgUrl: "//img.gomein.net.cn/gomegj/wap/bdimg2/"
        }
    },
    components: {
        headerComponent,
        serviceSteps,
        equipmentList,
        serverFlow
    },
    created() {
        var hrefParma = util.getHrefParma();
        util.removeSession('recyclesaveasse');
        this.title = hrefParma.catenm + '回收';
        $('title').html(this.title)
        if(util.isApp()){
            util.deleteHeadBtn();
            util.setHeadBar({title:this.title})
        }
        this._getbrands()
        
    },
    methods:{
        _getbrands() {
            var that = this,
            hrefParma = util.getHrefParma();
            util.api({
                surl: root.RECYCLE_API_PATH + 'getBrand',
                data: {
                    arcode: hrefParma.arcode,
                    cateid: hrefParma.cateid
                },
                type: 'get',
                success: function(response) {
                    var rpco = response.rpco,
                        body = response.body,
                        brds = body.brds;

                    // 处理
                    switch (rpco) {
                        case 200:
                            // 处理数据
                            $.each(brds, function(index, current) {
                                current.taf = false;
                                current.brdimg = that.imgUrl + current.brdid + '.png';
                            });
                            that.body = brds;
                            break;
                        case 40401:
                            util.tip('服务器繁忙，请稍后再试', 2000)
                            break;
                        default:
                            util.tip('请求失败');

                    }

                }
            })
        }
    }
}
</script>
<style lang="less">
@import '../../util/fs.less';
</style>