<template>
    <div class="stage-notice">
        <div class="stage-notice-title">
            <span>
                <dfn>管家提醒</dfn>
                <i>&nbsp;</i>
                <i>&nbsp;</i>
            </span>
        </div>
        <ul class="stage-notice-list">
            <li v-for="(list,index) in message" @click="goOrder(list)">
                <div class="stage-notice-imgbox">
                    <img :src="list.goodsPic||'http://gfs13.gomein.net.cn/T1.ZYQBChT1RCvBVdK.png'" alt="" />
                    <span>{{handlerOT(list.orderType)}}</span>
                </div>
                <div class="stage-notice-round"></div>
                <div class="stage-notice-info" :class="{'bdr-bottom':index !== message.length-1}">
                    <div class="clearfix stage-notice-state">
                        <span>{{list.orderStateDesc}}</span>
                        <span>{{list.stateUpdateTime}}</span>
                    </div>
                    <div>{{list.messageContent}}</div>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: ['message','tsup'],
    data() {
        return {

        }
    },
    created() {
        var _this=this;
        function handlerTime(time) {
            var mon,
                day,
                hh,
                mm,
                result,
                ss;
            mon = new Date(time).getMonth() + 1;
            day = new Date(time).getDate();
            hh = new Date(time).getHours();
            mm = new Date(time).getMinutes();
            ss = new Date(time).getSeconds();
            var Cmon,
                Cday;
            Cmon = new Date().getMonth() + 1;
            Cday = new Date().getDate();
            if(mon == Cmon&&Cday == day){
                result = '今天 '+gsh(hh)+':'+gsh(mm);
            }else if(mon == Cmon&&Cday-1 == day){
                result = '昨天 '+gsh(hh)+':'+gsh(mm);
            }else{
                result = gsh(mon)+'-'+gsh(day)+' '+gsh(hh)+':'+gsh(mm)
            }
            return result;
        }
        function gsh(o) {
            if(o < 10){
                return ('0'+o)
            }else{
                return o
            }
        }
        _this.message.forEach((v, i) => {
            _this.message[i].stateUpdateTime = handlerTime(_this.message[i].stateUpdateTime);
        })
        
    },
    methods:{
        goOrder(item) {
            if(item.ordertype == 10485760){
                return false;
            }
            if(item.msgSrc==3){
            	if(item.orderType == 4194305 || item.orderType == 4194306 || item.orderType == 4194307){
					util.href('./ordertrackgj.html',{otn:item.orderNo,dodt:item.orderTime,isJkxOtn:1,ordertype:item.ordertype});
                }else{
					util.href('./ordertrackgj.html',{otn:item.orderNo,dodt:item.orderTime,isJkxOtn:0,ordertype:item.ordertype});
                }

            }else{
                //在线订单
                var parama = {
                    oid:item.orderNo,
                    shippingGroupId:item.shippingGroupId || 0,
                    dodt:item.orderTime,
                    odtype:item.orderType,
                    resumeType:item.messageType
                };
                util.href('./ordertrack.html',parama)
            }
            //util.href('./ordertrackgj.html',{otn:item.orderNo,dodt:item.orderTime,isJkxOtn:0})
        },
        handlerOT(ordertype) {
            var type = '';
            switch(ordertype) {
                case 2097153:
                    type = '实物订单';
                    break;
                case 2097154:
                    type = '实物订单';
                    break;
                case 4194305:
                    type = '维修订单';
                    break;
                case 4194306:
                    type = '清洗订单';
                    break;
                case 4194307:
                    type = '回收订单';
                    break;
                case 4194308:
                    type = '安装订单';
                    break;
                case 6291456:
                    type = '延保订单';
                    break;
                case 8388608:
                    type = '实物订单';
                    break;
                case 10485760:
                    type = '虚拟订单';
                    break;
                case 10485761:
                    type = '平台订单';
                    break;
                case 201 :
                    type = '国美';
                case 202 :
                    type = '门店';
            }
            return type;
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

.stage-notice {
    background: #fff;
    margin-top: (20/75)*1rem;
    padding-bottom:0.4rem;
    padding-top: 0.37333rem;
    font-family: 'PingFangSC-Regular', sans-serif;
    .stage-notice-title {
        .mixinfont(15px);
        color: #333;
        line-height: (44/75px)*1rem;
        height: (44/75px)*1rem;
        overflow: hidden;
        text-align: center;
        position: relative;
        //padding: 0.26666667rem;
        span {

            position: absolute;
            padding: 0 (190/75)*1rem;
            min-width: (122/75)*1rem;
            max-width: (260/75)*1rem;
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
                height: 1px;
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
    .stage-notice-list {
        margin-top: 0.45333rem;
        padding-left: (32/75)*1rem;
        li{
            overflow: hidden;
            clear: both;
            float: none;
        }
        // li:last-child .stage-notice-info:after {
        //     display: none;
        //     overflow: hidden;
        // }
        .stage-notice-imgbox {
            float: left;
            width: (96/75)*1rem;
            padding-top: (27/75)*1rem;
            overflow: hidden;
            img {
                display: block;
                width: (80/75)*1rem;
                height: (80/75)*1rem;
                margin: 0 auto;
            }
            span {
                display: block;
                font-size: 0.32rem;
                color: #333;
                text-align: center;
                line-height: (42/75)*1rem;
            }
        }
        .stage-notice-round {
            float: left;
            height: (12/75)*1rem;
            width: (12/75)*1rem;
            overflow: hidden;
            border: (4/75)*1rem #bfddf6 solid;
            border-radius: 50%;
            position: relative;
            background: #298be0;
            margin: (73/75)*1rem (13/75)*1rem 0 (9/75)*1rem
        }
        .stage-notice-info {
            float: left;
            width: (542/75)*1rem;
            //padding: (20/75)*1rem (32/75)*1rem 0 (4/75)*1rem;
            .stage-notice-state {
                line-height: (50/75)*1rem;
                span:nth-child(1) {
                    float: left;
                    .mixinfont(14px);
                    color: #298BE0;
                }
                span:nth-child(2) {
                    float: right;
                    .mixinfont(12px);
                    color: #999;
                }
            }
            div:nth-child(2) {
                line-height: (32/75)*1rem;
                .mixinfont(12px);
                color: #999;
                height: (64/75)*1rem;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                margin-bottom: (26/75)*1rem;
            }
        }
    }
}
</style>