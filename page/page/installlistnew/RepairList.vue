<template>
<div class="cleanlist">
    <!-- <img src="//gfs1.gomein.net.cn/T1Pq_TBQWT1RCvBVdK" class="cleanImg"> -->
    <ul class="repairList clearfix">
<!--         <li class="r" :class="{yier:index == 0||index == 1}" class="float_l bdr-bottom bdr-r" v-for="(val,index) in body.cglist" @click="skip(val.cgcode)">
            <div class="float_l">
                <p class="text1">{{ val.cgname }}</p>
                <p v-show="index == 1 || index == 0" class="text2">{{ val.cgitrd }}</p>
                <p v-show="index != 1 && index != 0" class="text2">{{ val.cgitrd.replace(/\s+/,"").substring(0,4) }}&nbsp;{{ val.cgitrd.replace(/\s+/,"").substring(4,8) }}</p>
                <p class="text3"><span><i>￥</i><i>{{ val.micgp/100 }}</i></span>&nbsp;起</p>
            </div>
            <img :src="val.cgi" alt="" class="float_r">
        </li> -->
        <li  class="r float_l bdr-bottom bdr-r" v-for="(val,index) in body.cglist" @click="skip(val.cgcode)">
            <div class="float_l">
                <p class="text1">{{ val.cgname }}</p>
                <span class="s1">
                    <i>￥</i><span id="cgcp">{{ parseInt(val.micgp/100) }}<i v-show="parseInt(String(val.micgp).substring(String(val.micgp).length-2))">.{{ String(val.micgp).substring(String(val.micgp).length-2) }}</i></span>
                </span>
            </div>
            <img :src="val.cgi" alt="" class="float_r">
        </li>
    </ul>
</div>
</template>

<script>
export default {
    props:['body'],
    data () {
        return {
            eacnmDescribe:{
                0:'操作规范 专业安全',
                1:'安全可靠 诚实守信',
                2:'操作规范 专业安全',
                3:'安全可靠 诚实守信',
                4:'操作规范 专业安全',
                5:'安全可靠 诚实守信',
                6:'操作规范 专业安全',
                7:'安全可靠 诚实守信'
            }
        }
    },
    methods:{
        skip (cgcode) {
            util.href('installdetailnew.html',{
                cgcode:cgcode,
                ty: 'install',
                type: 1
            })
        }
    },
    // 组件更新完毕之后
    // updated () {
    //      ripple.init(['.repairList li']);
    // }
}
</script>

<style lang="less">
    @import '../../util/fs.less';
/*    .ripple{
        background: rgba(0,0,0,0.1);
        position: absolute;
        border-radius:50%;
        transform:scale(0);
        animation:ripple 0.55s ease-out;
    }
    @keyframes ripple{
        to{
            transform:scale(2);
            opacity: 0;
        }
    }*/
    .cleanlist{
        /*margin-top: 0.253333rem;*/
        .cleanImg{
            width: 100%;
            /*display: none;*/
        }
        .repairList{
            font-family: "Microsoft YaHei",Arial,Helvetica,sans-serif;
            background: #fff;
            li{
                box-sizing:border-box;
                width: 50%;
                height: 2.133333rem;
                div{
                    .text1{
                        width:2.533333rem;
                        color:#333;
                        font-size: 0.373333rem;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                        margin: 0.566667rem 0 0 0.346667rem;
                    };
                    .s1{
                    margin-left: 0.346667rem;
                    margin-top:0.066667rem;
                    display: inline-block;
                    font-size: 0.266667rem;
                    i{
                        font-size:0.266667rem;
                        color:#ff4b46;
                        /*font-weight:200;*/
                        /*line-height:0.32rem;*/
                    }
                    span{
                        font-size: 0.426667rem;
                        color: #ff4b46;
                        /*font-weight: 200;*/
                        /*line-height:0.426667rem;*/
                        i{
                            font-size:0.266667rem;
                            color:#ff4b46;
                            /*font-weight: 200;*/
                        }
                    }
                };
                }
                img{
                    width: 1.653333rem;
                    height: 1.653333rem;
                    margin:0.266667rem 0.15rem 0 0;
                };
            };
            .yier{
                width: 100%;
                div{
                    .text1{
                        width:5.866667rem;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                        margin: 0.2rem 0 0 0.3rem;
                    }
                    .text2{
                        width:5.866667rem;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                        margin: 0.05rem 0 0 0.3rem;
                    }
                    .text3{
                        margin-top: 0.1rem;
                    }
                }
                img{
                    width: 3.1rem;
                    height: 2.033333rem;
                    margin:0;
                }
            }
            li:nth-child(event){
                border-right: 0;
            }
        };
    }
</style>