<template>
    <div class="wapper">
        <header-component ref="Header" :title="headeroptions.title" :rightmenus="headeroptions.rightmenus"></header-component>
        <ul :style="{'height':screen}">
            <div class="serviceList">
                <li v-for="(k,v) in list" @click="gonext(k)" class="bdr-bottom">
                    <a href="javascript:;" class="clearfix">
                        <div class="serviceList-imgbox">
                            <img :src="k.imageUrl" alt="" />
                        </div>
                        <div class="serviceList-info">
                            <div>{{k.txtTitle}}</div>
                            <div>{{k.txtContent}}</div>
                            <div>{{k.volatile3}}</div>
                        </div>
                    </a>
                </li>
            </div>
        </ul>
    </div>
</template>
<script>
import headerComponent from '../../components/HeaderComponent.vue'

export default {
    data() {
        return {
            headeroptions: {
                title: '服务咨询',
                rightmenus: {
                    type: 'text',
                    content: ''
                }
            },
            list:null,
            len:10,
            screen:null,
            page:1,
            iscroll:null
        }
    },
    created() {
        if(util.isApp()){
            util.deleteHeadBtn();
        }
    },
    mounted() {
        var _this = this;
        _this.screen = window.innerHeight-parseInt($('.header').css('height')) + 'px';
        util.api({
            surl:'http://prom.mobile.atguat.com.cn/wap/promotion/promscms/channelNgMyqdoBO0dBX.jsp',
            type:'get',
            dataType:'jsonp',
            success:function(res) {
                console.log(JSON.parse(res))
                var res=JSON.parse(res);
                if(res.isSuccess=='Y'){
                    _this.list = res.templetList[0].imgTxtTemplet.imgTxtList;
                }
            }
        })
        
    },
    methods:{
        gonext(item) {
            //console.log(item)
            util.href(item.imageLink)
        }
    },
    components: {
        headerComponent
    }
}
</script>
<style lang="less">
@import '../../util/fs.less';
.iscrollpading{
    width: 100%;
    overflow: hidden;
}
.iscrollpading-pulltext{
    width: 100%;
    text-align: center;
    line-height: 1rem;
    height: 1rem;
    display: block;
    font-size: 0.4rem;
}
body,
html {
    background: #fff!important;
}

.serviceList {
    li {
        a {
            display: block;
        }
        padding: (30/75)*1rem (16/75)*1rem 0 (28/75)*1rem;
        .serviceList-imgbox {
            float: left;
            width: (196/75)*1rem;
            height: (196/75)*1rem;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .serviceList-info {
            float: left;
            margin: (1/75)*1rem 0 0 (20/75)*1rem;
            width: (490/75)*1rem;
            font-family: PingFangSC-Regular;
            .mixinfont(19px);
            color: #333;
            line-height: (56/75)*1rem;
            div:nth-child(1) {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
            }
            div:nth-child(2),div:nth-child(3) {
                .mixinfont(12px);
                color: #999;
                margin-top: 0.2rem;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                line-height: (34/75)*1rem;
            }
            div:nth-child(3){
                margin-top: 0.6rem;
            }
        }
    }
}
</style>