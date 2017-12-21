<template>
    <div class="stage-goods-warp" :class="{'bdr-top':lists.imgTxtTemplet.borderDisplay==3,'margin':lists.imgTxtTemplet.templateMargin==0}" v-if="lists.imgTxtTemplet.displayType==='list'&&lists.imgTxtTemplet.imgTxtList[0].volatile1&&templateShow">
        <div class="stage-notice-title">
            <span>
                <dfn v-if="lists.displayName">{{lists.displayName.length>8?lists.displayName.substr(0,8):lists.displayName}}</dfn>
                <i>&nbsp;</i>
                <i>&nbsp;</i>
            </span>
        </div>
        <ul class="stage-goods-list">
            <li class="clearfix" v-for="item in lists.imgTxtTemplet.imgTxtList">
                <a :href="item.imageLink">
                    <div class="stage-goods-img">
                        <img :src="item.imageUrl" alt="" />
                    </div>
                    <div class="stage-goods-info">
                        <div>{{item.txtTitle}}</div>
                        <div>{{item.txtContent}}</div>
                        <div>{{item.volatile1}}</div>
                    </div>
                </a>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: ['lists'],
    data() {
        return {
            templateShow: true
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
.mixinfont (@font) {
    font-size: @font;
    [data-dpr="2"] & {
        font-size: @font * 2;
    }
    [data-dpr="3"] & {
        font-size: @font * 3;
    }
}

.px2rem(@name, @px) {
    @{name}: (@px/75)*1rem;
}

.px2remall(@name, @px1, @px2) {
    @{name}: (@px1/75)*1rem (@px2/75)*1rem;
}



/* 新品推荐 */

.stage-goods-warp {
    background: #fff;
    padding-top: (3/75)*1rem;
    .stage-notice-title {
        .mixinfont(15px);
        color: #333;
        line-height: (44/75px)*1rem;
        height: (44/75px)*1rem;
        overflow: hidden;
        text-align: center;
        position: relative;
        margin-top: (20/75)*1rem;
        span {

            position: absolute;
            padding: 0 (190/75)*1rem;
            min-width: (122/75)*1rem;
            max-width: (300/75)*1rem;
            white-space: nowrap;
            left: 50%;
            top: 0;
            overflow: hidden;
            -webkit-transform: translateX(-50%);
            dfn {
                display: block;
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
            i {
                position: absolute;
                font-size: 0;
                height: 0.6px;
                width: (168/75)*1rem;
                background: #efefef;
                overflow: hidden;
                left: 0;
                top: (22/75)*1rem;
            }
            i:nth-child(2) {
                right: 0;
                left: auto;
            }
        }
    }
}

.stage-goods-list {
    padding: (27/75)*1rem 0 0 (30/75)*1rem;
    li {
        padding-bottom: (30/75)*1rem;
    }
    .stage-goods-img {
        float: left;
        width: (198/75)*1rem;
        height: (200/75)*1rem;
        img {
            height: 100%;
            width: 100%;
        }
    }
    .stage-goods-info {
        float: right;
        width: (458/75)*1rem;
        line-height: (34/75)*1rem;
        padding: 0 (34/75)*1rem 0 0;
        font-family: 'PingFangSC-Regular', sans-serif;
        color: #333333;
        position: relative;
        div:nth-child(1) {
            line-height: (38/75)*1rem;
            font-size: 0.34667rem;
            padding-bottom: (9/75)*1rem;
            height: (38/75)*1rem;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        div:nth-child(2) {
            color: #999;
            height: (68/75)*1rem;
            font-size: 0.32rem;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
        div:nth-child(3) {
            padding-top: (46/75)*1rem;
            color: #FF4B41;
            .mixinfont(16px);
            line-height: (40/75)*1rem;
            padding-bottom: (28/75)*1rem;
        }
    }
    .stage-goods-info:after {
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 1px;
        background: #f3f3f3;
        left: 0;
        bottom: -1px;
    }
}

.border {
    border-top: 1px solid #ccc;
}

.margin {
    margin-top: 0.26667rem;
}
</style>