<template>
    <div :class="{'bdr-top':lists.imgTxtTemplet.borderDisplay==3,'margin':lists.imgTxtTemplet.templateMargin==0}" >
        <div class="stage-foryou-warp" v-if="lists.imgTxtTemplet.displayType==='threeColumn'&&templateShow">
            <div class="stage-notice-title">
                <span>
                    <dfn v-if="lists.displayName">{{lists.displayName.length>8?lists.displayName.substr(0,8):lists.displayName}}</dfn>
                    <i>&nbsp;</i>
                    <i>&nbsp;</i>
                </span>
            </div>
            <div class="stage-foryou">
                <div class="list" @click="fnHref(item)" v-for="item in lists.imgTxtTemplet.imgTxtList">
                    <div>
                        <img :src="item.imageUrl" alt="" />
                    </div>
                    <div class="stage-foryou-title">{{item.txtTitle}}</div>
                    <div class="stage-foryou-info">{{item.txtContent}}</div>
                </div>
            </div>
        </div>

        <div class="clearfix stage-foryou-last" v-if="lists.imgTxtTemplet.displayType==='list' && lists.imgTxtTemplet.imgTxtList.length === 1&&templateShow">
            <a :href="lists.imgTxtTemplet.imgTxtList[0].imageLink">
                <div class="f-l">
                    <img :src="lists.imgTxtTemplet.imgTxtList[0].imageUrl" alt="" />
                </div>
                <div class="stage-foryou-lInfo">
                    <div>{{lists.imgTxtTemplet.imgTxtList[0].txtTitle}}</div>
                    <div>{{lists.imgTxtTemplet.imgTxtList[0].txtContent}}</div>
                    <div>{{lists.imgTxtTemplet.imgTxtList[0].volatile2}}</div>
                </div>
            </a>
        </div>
    </div>

</template>
<script> 
  export default {
    props:['lists'],
    data() {
        return {
            templateShow:true
        }
    },
    created() {
        var time =loop(this.lists);
        var currentTime = new Date().getTime();
        //console.log(time)
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
    },
    methods:{
        fnHref(item){
            util.href(item.imageLink)
        }
    }
}
</script>
<style lang="less">
    .border{
        border-top: 1px solid #ccc;
    }
    .margin{
        margin-top: 0.26667rem;
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
    .stage-foryou-warp{
        overflow: hidden;
        background:#fff;
        margin-top:(20/75)*1rem;
        padding-bottom: 0.4rem;
        .stage-notice-title{
            .mixinfont(15px);
            color: #333;
            line-height:(44/75px)*1rem;
            height: (44/75px)*1rem;
            overflow:hidden;
            text-align:center;
            position: relative;
                
            margin: (20/75)*1rem 0 0;
            span{
                
                position: absolute;
                padding:0 (190/75)*1rem;
                min-width: (122/75)*1rem;
                max-width: (300/75)*1rem;
                white-space:nowrap;
                left: 50%;
                top:0;
                overflow:hidden;
                -webkit-transform: translateX(-50%);
                dfn{
                    display:block;
                    width:100%;
                    height:100%;
                    overflow:hidden;
                }
                i{
                    position: absolute;
                    font-size: 0;
                    height: 1px;
                    width:(168/75)*1rem;
                    background: #efefef;
                    overflow:hidden;
                    left: 0;
                    top: (22/75)*1rem;
                }
                i:nth-child(2){
                    right: 0;
                    left: auto;
                }
            }
        }
    }
    .stage-foryou{
        display: flex;
        display: -ms-box;
        display: -webkit-box;
        display: -webkit-flex;
        flex-direction:row;
        position:relative;
        font-family: 'PingFangSC-Regular',sans-serif;
        margin-top:0.45333rem; 
        padding:  0 0.37333rem;
        .list{
            width: 2.96rem;
            overflow: hidden;
            flex:1;
            -webkit-flex:1;
            -webkit-box-flex: 1;
            -ms-flex: 1;
            .mixinfont(12px);
            color:#000;
            img{
                width:(222/75)*1rem;
                height:(222/75)*1rem;
            }
            .stage-foryou-title{
                font-size:0.34667rem;
                line-height:(46/75)*1rem;
                padding-top: (16/75)*1rem;
                width: inherit;
                height:(46/75)*1rem;
                white-space:nowrap;
                text-overflow:ellipsis;
                overflow:hidden;
            }
            .stage-foryou-info{
                color:#999;
                font-size: 0.32rem;
                width: inherit;
                display: flex;
                display: -ms-box;
                display: -webkit-box;
                display: -webkit-flex;
                line-height:(32/75)*1rem;
                height:(64/75)*1rem;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;  
            }
        }
    }

    .stage-foryou-last{
        padding: (28/75)*1rem 0 (32/75)*1rem (28/75)*1rem;
        background:#fff;
        .f-l{
            float: left;
        }
        img{
            width:(196/75)*1rem;
            height:(196/75)*1rem;
        }
        .stage-foryou-lInfo{
            float:right;
            padding: 0 (50/75)*1rem 0 0;
            width: (456/75)*1rem;
            color:#999;
            div:nth-child(1){
                color:#333;
                .mixinfont(16px);
                line-height:(42/75)*1rem;
                height:(42/75)*1rem;
                white-space:nowrap;
                text-overflow:ellipsis;
                overflow:hidden;
            }
            div:nth-child(2){
                font-size: 0.32rem;
                display: -webkit-box;
                line-height:(30/75)*1rem;
                height:(60/75)*1rem;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;  
                padding: (10/75)*1rem 0 (50/75)*1rem 0;
            }

        }
    }
    .stage-foryou:after{
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 1px;
        background: #f3f5f7;
        left:0;
        bottom: -2px;
    }

</style>