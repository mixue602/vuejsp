<template>
    
    <div class="stage-sale clearfix" :class="{'bdr-top':lists.bigSmallTemplet.borderDisplay==3,'margin':lists.bigSmallTemplet.templateMargin==0}" v-if="templateShow" :style="{'backgroundColor':lists.templateBgColor,'color':lists.templateContentFontColor}">
        <a :href="item.promsUrl" v-for="item in lists.bigSmallTemplet.bigImgList">
            <img :src="item.imageUrl" alt="">
        </a>
        <a :href="item.promsUrl" v-for="item in lists.bigSmallTemplet.smallImgList">
            <img :src="item.imageUrl" alt="">
        </a>
    </div>

</template>
<script>
    
  export default {
    props:['lists'],
    data () {
        //let sumNumber = this.lists.bigImgList.length + this.lists.smallImgList.length;
        return {
            templateShow:true
        }
    },
    created() {
        var time =loop(this.lists);
        var currentTime = new Date().getTime();
        if(time.backImgEndTime!=null&&time.backImgStartTime!=null){
            (time.backImgStartTime<currentTime&&currentTime<time.backImgStartTime) ? this.templateShow = true : this.templateShow=false;
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
    }
}
</script>
<style lang="less">
    .margin{
        margin-top: 0.26667rem;
    }
    .border{
        border-top: 1px solid #ccc;
    }
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

    /*商品*/
    .stage-sale{
        width: 100%;
        height: 6.66667rem;
        background: #fff;
        a{
            float:left;
            width: 50%;
            height: (250/75)*1rem;
            img{
                width: 100%;
                height:100%;
            }
        }
        a:nth-child(1){
            height: (500/75)*1rem;
        }
    }
</style>