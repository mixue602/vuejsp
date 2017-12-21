<template>
    <div class="direction wapper">
        <search-input></search-input>
        <hot :cmshot="cmsdata[0]" v-if="cmsdata[0]"></hot>
        <read :cmsread="cmsdata[1]" v-if="cmsdata[1]"></read>
        <recommend :cmsnew="cmsdata[2]"  v-if="cmsdata[1]"></recommend>
        <header-components :title="headeroptions.title" :direction="headeroptions.direction" :rightmenus="headeroptions.rightmenus" @watchdirection="goBack" @watchlist="golist"></header-components>
    </div>
</template>
<script>
import searchInput from "./searchInput";
import hot from "./hot";
import read from "./read";
import recommend from "./recommend";
import headerComponents from '../../components/HeaderComponent.vue'

export default {
    data() {
        return {
            cmsdata:{
                templetList:[]
            },
            headeroptions: {
                title: '电子说明书',
                rightmenus: {
                    type: 'icon',
                    content: '//gfs11.gomein.net.cn/T1eLDvBbKg1RCvBVdK.png'
                }
            }
        };
    },
    created:function() {
        var _this=this;
        _this.load();
    },
    methods: {
        load() {
            var _this=this;
             util.api({
                 surl: '/index/yf/promscms?promscmsKey=homeNg7Ar1YpEL5nn',/*http://prom.mobile.atguat.com.cn/wap/promotion/promscms/homeNg7Ar1YpEL5nn.jsp',*/
                 type: 'get',
                 // jsonpCallback: "showdata",
                 success: function(res) {
                     if(res.rpco == 200){
                        _this.cmsdata = res.body.templetList;
                     }
                 }
             });
             if(util.isApp()){
				 _this.setHeadBar4();
             }
        },
		setHeadBar4(){
			GomeJSBridge.ready(function(){
				let param = {
					menus : {
						rightMenus:[
							{
								type:'callback',
								title:'分类',
                                icon:'http://gfs11.gomein.net.cn/T1eLDvBbKg1RCvBVdK.png',
								data:{
									id:'btn1',
									name:'分类',
									desc:'分类'
								}
							}
						]
					}
				};
				util.setHeadBar(param);
			},null);

			GomeJSBridge.onCallback(function(data){
				if(data.id == "btn1"){
					util.href('./directionlist.html');
				}
				console.log(data)

			});

		},
        goBack() {
            this.model = false;
            this.headeroptions = {
                title: '电子说明书',
                rightmenus: {
                    type: 'icon',
                    content: '//gfs11.gomein.net.cn/T1eLDvBbKg1RCvBVdK.png'
                },
                direction: false
            }
        },
        golist() {
            util.href('./directionlist.html')
        }
    },
    components: {
        searchInput,
        hot,
        read,
        recommend,
        headerComponents
    }
};
</script>
<style lang="less">
@import "../../util/fs.less";
body {
    background: #f3f5f7;
}

.iscrollpading {
    height: 100%;
    height: 100%;
    overflow: hidden;
}
</style>