<template>
	  <div id="accDetail">
        <header-component :title='title'></header-component>
        <div class="wapper">
            <div class="accImg">
                <img :src="imgSrc" alt="">
                <ul class="acnumWrite">
                    <li v-for='item in acnum'>{{item}}</li>
                </ul>
            </div>
            <div class="codeImg"><img src="//gfs12.gomein.net.cn/T17UVvB5KQ1RCvBVdK.png" alt=""></div>
            <ul class="accDetail">
                <li class="accNum bdr-bottom">
                    <label>会员卡号：</label>
                    <span class="accVal">
                        <i v-for='item in acnum'>{{item}}</i>
                    </span>
                </li>
            </ul>
        </div>   
    </div>
</template>

<script type="ecma6.0">
import headerComponent from '../../components/HeaderComponent';

let root = window || {},
    util = root.util || {};
let  actypeObj= {
        '1':{   actype: '1',
            name:'国美会员卡',
            imgSrc:'//gfs10.gomein.net.cn/T1u0EvBgbQ1RCvBVdK.png'
        },
        '2':{   actype: '2',
            name:'永乐会员卡',
            imgSrc:'//gfs10.gomein.net.cn/T1K0_vBXhT1RCvBVdK.png'
        },
        '3':{   actype: '3',
            name:'大中会员卡',
            imgSrc:'//gfs13.gomein.net.cn/T1z6AvBmYs1RCvBVdK.png'
        },
        '6':{   actype: '6',
            name:'极信国美卡',
            imgSrc:'//gfs12.gomein.net.cn/T1i7KvBjxT1RCvBVdK.png'
        },
        '7':{   actype: '7',
            name:'极信大中卡',
            imgSrc:'//gfs10.gomein.net.cn/T1M2xvB5Ag1RCvBVdK.png'
        },
        '8':{   actype: '8',
            name:'极信永乐卡',
            imgSrc:'//gfs11.gomein.net.cn/T16OJvB5CQ1RCvBVdK.png'
        }
    };

export default {
	data () {
		return {
			title:'会员卡',
            imgSrc:null,
            acnum:null
        }
	},
  	created() {
        this.hrefParma =util.getHrefParma();
        this.imgSrc = actypeObj[this.hrefParma.actype].imgSrc;
        let acnum = this.hrefParma.acnum.replace(/(.{4})/g, "$1 ");
        let acnumArr = acnum.split(" ");
        $.each(acnumArr,(i,val)=>{
            if(i!=0 && val.length<4){
                acnumArr[i-1] += acnumArr[i];
                acnumArr.splice(i,1);
            }
        })
        this.acnum = acnumArr;
    },
    mounted(){
        
    },
    methods:{

    },
	components: {
        headerComponent
	}
}

</script>

<style lang="less">
@import '../../util/fs.less';
.wapper{
    position: absolute;
    top: 1.12rem;
    bottom:0;
    padding-top:0;
    width: 100%;
    max-width: 10rem;
    background-color: #fff;
    .accImg{
        a{
            color:#fff;
        }
        position: relative;
        padding: 0.333333rem 0.466667rem 0.266667rem;
        img{
            width: 100%;
            height: auto;
        }
        .acnumWrite{
            position: absolute;
            left:2.373333rem;
            top: 2.733333rem;
            li{
                float: left;
                color: #fff;
                .mixinfont(21px);
                margin-left: 0.3rem;
                a{
                    color:#fff;
                }
            }
        }
    };
    .codeImg{
        img{
            width: 1.066667rem;
            height: 1.066667rem;
            margin:0 auto;
            display: block;
        }
    }
    .accDetail{
        padding-top:0.8rem;
        padding-left:0.32rem;
        li{
            line-height: 1.066667rem;
            .mixinfont(14px);
            .accVal{
                float: right;
                margin-right: 0.32rem; 
                i{
                    margin-left: 0.213333rem; 
                }
            }
        }


    }
}

</style>