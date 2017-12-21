<template>
    <div :class="className" v-if="templateShow" :style="{'backgroundColor':lists.templateBgColor,'color':lists.templateContentFontColor}">
        <ul class="stage-top-list clearfix">
            <li v-for="list in lists.tagShortcutTemplet.shortcutList">
                <a :href="list.menuLink">
                    <img :src="list.menuImg" alt="" />
                </a>
                <a :href="list.menuLink">{{list.menuName}}</a>
            </li>
        </ul>
    </div>
</template>
<script> 
  export default {
    props:['lists'],
    data () {
        return {
            className: '',
            templateShow:true
        }
        
    },
    created() {
        var length = this.lists.tagShortcutTemplet.shortcutList.length;
        var time =loop(this.lists);
        var currentTime = new Date().getTime();
        if(time.backImgEndTime!=null&&time.backImgStartTime!=null){
            (time.backImgStartTime<currentTime&&currentTime<time.backImgStartTime&&length>0) ? this.templateShow = true : this.templateShow=false;
        }
        function loop(lists) {
            var timeobj={

            };
            for (var item in lists) {
                if (item != undefined) {
                    if (item == 'backImgEndTime' || item == 'backImgStartTime') {
                        timeobj = {
                            backImgEndTime: lists['backImgEndTime'],
                            backImgStartTime: lists['backImgEndTime']
                        };
                        break;
                    }
                    if (typeof lists[item] == 'object') {
                        loop(lists[item])
                    }
                }else{
                    timeobj = {
                        backImgEndTime: null,
                        backImgStartTime: null
                    }
                }

            }
            return timeobj;
        }
        this.className = 'bdr-bottom';
        if( length <= 6){
            this.className = 'bdr-bottom stage-top-three';
        }else if(length > 4 && length <= 8){
            this.className = 'bdr-bottom stage-top-four';
        }else if(length > 10){
            this.className = 'bdr-bottom';
            this.lists.tagShortcutTemplet.shortcutList = this.lists.tagShortcutTemplet.shortcutList.splice(0,10)
        }else{
            this.className = 'bdr-bottom';
            
        }
    }
}
</script>
<style lang="less">


    .mixinfont (@font){
        font-size: @font; 
        [data-dpr="2"] & { font-size: @font * 2; } 
        [data-dpr="3"] & { font-size: @font * 3; } 
     }

     .px2rem(@name,@px){
        @{name}: (@px/75)*1rem;
     }
    .px2remall(@name,@px1,@px2){
            @{name}: (@px1/75)*1rem (@px2/75)*1rem;
    }

    
    /* 顶部导航 */
    .stage-top-list{
        background:#fff;
        padding: (23/75)*1rem 0 (23/75)*1rem (13/75)*1rem;
        li{
            float:left;
            width: (144/75)*1rem;
            margin: (19/75)*1rem 0 0;
            text-align:center;
            overflow:hidden;
            a:nth-child(1){
                width: (100/75)*1rem;
                height: (100/75)*1rem;
                display:block;
                margin: 0 auto;
                img{
                    width:100%;
                }
            }
            a{
                font-family: 'PingFangSC-Regular', sans-serif;
                .mixinfont(13px);
                color: #333;
                line-height: (63/75)*1rem;
            }   
        }
    }
    .stage-top-three{
        .stage-top-list{
            padding-left:(29/75)*1rem;
        }
        li{
            margin: (19/75)*1rem (43/75)*1rem 0;
        }
    }
    .stage-top-four{
        .stage-top-list{
            padding-left:(29/75)*1rem;
        }
        li{
            margin: (19/75)*1rem (13/75)*1rem 0;
        }
    }
</style>