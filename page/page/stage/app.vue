<template>
    <div class="serviceInfo wapper">
        <Header-components :title="title" :isback="isback" :isgps="1"></Header-components>
        <div v-for="item in body.templetList">
            <Naver v-if="item.templetCode === 'tagShortcutTemplet'" :lists="item"></Naver>
        </div>
        <Notice v-if="messageList.length > 0" :message="messageList" :tsup="tsup"></Notice>
        <div v-for="item in body.templetList" style="overflow:hidden;">
            <Sale v-if="item.templetCode === 'bigSmallTemplet'" :lists="item"></Sale>
            <Info v-if="item.templetCode === 'imgTxtTemplet'" :lists="item"></Info>
            <Goods v-if="item.templetCode === 'imgTxtTemplet'" :lists="item"></Goods>
        </div>
        <Foot-components :index="0"></Foot-components>
    </div>
</template>
<script>
import HeaderComponents from '../../components/HeaderComponent.vue';
import FootComponents from '../../components/FootComponents.vue';

import Goods from './goods.vue';
import Naver from './naver.vue';
import Sale from './sale.vue';
import Info from './info.vue';
import Notice from './notice.vue';


let root = window || {};
let util = root.util || {};
export default {
    data() {
        return {
            title: '管家服务',
            isback: 1,
            body: {},
            messageList: [],
            tsup: null,
            arcode: 110101
        }
    },
    methods: {
        load() {
            //CMS请求
            var _this = this;
            util.api({
                surl: '/index/yf/areachange?areaCode=' + _this.arcode,
                type: 'get',
                dataType: 'json',
                success: function(res) {
                    if (res.rpco == 200) {
                        _this.body = res.body;
                    } else {
                        util.tip('网络错误')
                    }
                },
                error() {
                    util.tip('网络错误')
                }
            })
            //消息请求
            util.api({
                surl: '/message/yf/home/list?pageNo=1&pageSize=3',
                type: 'get',
                dataType: 'json',
                success: function(res) {
                    if (res.rpco == 200) {
                        _this.messageList = res.body.data || [];
                        _this.tsup = res.tsrp;
                    }
                }
            })
        }
    },
    created() {
        var ls = window.localStorage;
        this.arcode = ls.getItem('location') ? JSON.parse(ls.getItem('location')).arcode : 110101; //地区码
        this.load();
        if(util.isApp()){
            util.deleteHeadBtn();
        }
        // let res = {
        //   rpco: 200,
        //   tsrp: 1511158927175,
        //   body: {
        //       page: 1,
        //       total: 9,
        //       data: [
        //               {
        //                   id: "1_10000008",
        //                   msgSrc: 2,
        //                   userId: "1234567890",
        //                   orderNo: "xxxx",
        //                   orderType: 2097153,
        //                   orderTime: 1510730187561,
        //                   orderState: "2",
        //                   orderStateDesc: "已派工",
        //                   stateUpdateTime: 1511055240000,
        //                   serviceCompany: null,
        //                   goodsName: "海尔电视58寸",
        //                   goodsPic: "http://gfs17.gomein.net.cn/T1TSxTB7KT1RCvBVdK_210.jpg",
        //                   messageType: 1,
        //                   messageContent: "您的服务单#订单号#已分配至#xxx公司#，预计#xxx时间#为您上门维修。",
        //                   ifRead: 1,
        //                   ctime: 1510730187743,
        //                   utime: 1510730691713
        //               },
        //               {
        //                   id: "1_10000007",
        //                   msgSrc: 1,
        //                   userId: "1234567890",
        //                   orderNo: "xxxx",
        //                   orderType: 2097153,
        //                   orderTime: 1510730187441,
        //                   orderState: "2",
        //                   orderStateDesc: "已派工",
        //                   stateUpdateTime: 1511141640000,
        //                   serviceCompany: null,
        //                   goodsName: "海尔电视58寸",
        //                   goodsPic: "http://gfs17.gomein.net.cn/T1TSxTB7KT1RCvBVdK_210.jpg",
        //                   messageType: 1,
        //                   messageContent: "您的服务单#订单号#已分配至#xxx公司#，预计#xxx时间#为您上门维修。",
        //                   ifRead: 2,
        //                   ctime: 1510730187739,
        //                   utime: 1510730187739
        //               }
        //           ]
        //       }
        // }
    },
    watch:{
        arcode:{
            handler(newval) {
                console.log(newval)
            }
        }
    },
    components: {
        Goods,
        Naver,
        Sale,
        Info,
        Notice,
        HeaderComponents,
        FootComponents
    }
}
</script>
<style lang="less">
.serviceInfo{
    width: 100%;
    overflow: hidden;
    padding-bottom: 1.32rem;
}
</style>