<template>
<div class="cleanlist">
    <ul class="repairList clearfix">
        <li :class="{yier:index == 0||index == 1,last:(body.cglist.length%2==1 && index==body.cglist.length-1)}" class="float_l bdr-bottom bdr-r r" v-for="(val,index) in body.cglist" :key="index"@click="skip(val.cgcode)">
            <div class="float_l">
                <p class="text1">{{ val.cgname }}</p>
                <p v-show="index == 1 || index == 0" class="text2">{{ val.cgitrd }}</p>
                <p v-show="index != 1 && index != 0" class="text2">{{ val.cgitrd.replace(/\s+/,"").substring(0,4) }}&nbsp;{{ val.cgitrd.replace(/\s+/,"").substring(4,8) }}</p>
                <p class="text3"><span><i>￥</i><i>{{ val.micgp/100 }}</i></span>&nbsp;起</p>
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
            util.href('cleandetailnew.html',{
                cgcode:cgcode,
                ty: 'clean'
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
        margin-top: 0.253333rem;
        .cleanImg{
            width: 100%;
            /*display: none;*/
        }
        .repairList{
            font-family: "Microsoft YaHei",Arial,Helvetica,sans-serif;
            background: #fff;
            li{
                	box-sizing: border-box;
                    width: 50%;
                    height: 2.133333rem;
                /* border-bottom: 0.013333rem solid #e9e9e9; */
                /* border-right: 0.013333rem solid #e9e9e9; */
                div{
                    .text1{
                        width:2.533333rem;
                        color:#333;
                        .mixinfont(14px);
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                        margin: 0.2rem 0 0 0.3rem;
                    };
                    .text2{
                        margin-left:0.4rem;
                        .mixinfont(11px);
                        color: #777;
                        height: 0.423333rem;
                        margin: 0 0 0 0.3rem;
                    }
                    .text3{
                        color:#999;
                        .mixinfont(10px);
                        margin: 0.1rem 0 0 0.3rem;
                        span{
                            i:nth-child(1){
                                color:#ff4b46;
                                font-size: 0.293333rem;
                            }
                            i:nth-child(2){
                                color: #ff4b46;
                                font-weight: 200;
                                font-size:0.426667rem;
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
             .last{width: 100%;}
            li:nth-child(event){
                border-right: 0;
            }
        };
    }
    .cleanlist {
	margin-top: .253333rem
}

</style>