<template>
	  <div id="acclistnew">
        <!--<div class="header">
            <a class="goBack" @click="fnHref"><i></i></a>
            <span class="title">{{ title }}</span>
            &lt;!&ndash;<span class='btnMore' v-show='!nolist' @click='showMore'>
                <b v-show='!moreIconShow'>取消</b>
                <i v-show='moreIconShow' class='i i-moreyuandian'></i>
            </span>&ndash.header .goBack;&gt;
            <ul v-show='moreOn && !nolist' class="menu">
                <i class="i i-menu-sj"></i>
                <li class="js-addBind bdr-bottom" @click='addcard'>绑定账号<i class="i i-bindcard"></i></li>
                <li @click='removeCard'  class="js-unBind">解绑账号<i class="i i-unbindcard"></i></li>
            </ul>
        </div>-->
         <header-component :title='title'></header-component>
        <check-card v-show='nolist'></check-card>  
        <div @click='moreOn=false' class="wapper aclist" v-if='!nolist'>
            <div class="bgfff"></div>
            <ul class="aclistUl">
                <li class="accImg" @click.stop='jumpDetail(item)' v-for="item in aclist" >
                    <img :src="item.imgSrc" alt="">
                    <ul class="acnumWrite">
                        <li v-for='val in item.acnumArr'>{{val}}</li>
                    </ul>
                    <span v-show='delShow' class='delCard' @click.stop='delAccount(item)'></span>
                </li>
            </ul>
            <!--美豆数量显示+一次性支付-->
            <div class="infolist">
                <p>美豆<span>{{meidou}}个</span></p>
            </div>
            <div class="infolist">
                <p>申请临时支付密码<span id="pwdapply" :class="['sqbtn',!pwdapply ? '' : 'togray']" @click="applyTmp">申请</span></p>
            </div>
            <!-- <footer class="subBtn on" @click='addcard'>绑定</footer> -->
        </div>   
    </div>
</template>

<script type="ecma6.0">
import headerComponent from '../../components/HeaderComponent';
import checkCard from './checkCard';

let root = window || {},
    util = root.util || {},
    actypeObj= {
        '1':{   actype: '1',
            name:'国美会员卡',
            imgSrc:'//gfs10.gomein.net.cn/T1IcbvBy_s1RCvBVdK.png'
        },
        '3':{   actype: '3',
            name:'大中会员卡',
            imgSrc:'//gfs13.gomein.net.cn/T1EUAvBCxQ1RCvBVdK.png'
        },
        '2':{   actype: '2',
            name:'永乐会员卡',
            imgSrc:'//gfs10.gomein.net.cn/T1C6VvBjxQ1RCvBVdK.png'
        },
        '6':{   actype: '6',
            name:'极信国美卡',
            imgSrc:'//gfs12.gomein.net.cn/T12cAvBXAQ1RCvBVdK.png'
        },
        '7':{   actype: '7',
            name:'极信大中卡',
            imgSrc:'//gfs13.gomein.net.cn/T1WmLvBCZj1RCvBVdK.png'
        },
        '8':{   actype: '8',
            name:'极信永乐卡',
            imgSrc:'//gfs13.gomein.net.cn/T1dcbvB5bs1RCvBVdK.png'
        }
    },
    msg = {
            m1: '账户删除成功',
            m2: '解绑后将无法获取该会员卡下的资产，确定要解绑吗？'
        },
    requestState= {
            delAccount: true
        };

export default {
	data () {
		return {
			title:'会员卡',
            moreOn:false,
            moreIconShow:true,
            phoneNum:'',
            vcode:'',
            vcodeOn:false,
            subBtn:false,
            aclist:[],
            nolist:false,
            delShow:false,
            meidou:0,
            pwdapply:false
        }
	},
  	created() {
        this.hrefParma = util.getHrefParma();
        if(util.isApp()){
            util.deleteHeadBtn();
        }
        this._getAccountList();
    },
    mounted(){
        
    },
    methods:{
        //申请临时支付密码
        applyTmp(){
            let that = this;
            // 请求 测试用 ，先用sendcode模拟
            util.api({
                //http://wap.dev.gomegj.com/virtualAccount/yf/sendMessage
                surl: root.BASE_PATH+'virtualAccount/yf/sendMessage',
                data: {

                },
                type: 'get',
                beforeSend: function() {
                },
                success: function(response) {
                    var body,
                            rpco = response.rpco;

                    // 处理
                    switch(rpco) {
                            // 正常
                        case 200:
                            body = response.body || {};
                            if(body.resultCode == '000') {
                                util.tip('发送短信成功');
                                that.pwdapply =  true;
                                // 倒计时
                                that.countDown();
                            }else if(body.resultCode == '020') {
                                util.tip('验签失败');
                                that.pwdapply =  false;
                            }
                            break;
                        default:
                            util.tip('申请失败');
                    }
                },
                complete: function(response) {
                    // 启用按钮
                },
                error:function() {
                }
            });
        },
        // 倒计时
        countDown() {
            var that = this;
            this.vcodeOn = false;

            util.countDown({
                elem: $('#pwdapply'),
                downTime: 60,
                formate: '已发送countS',
                callback: function() {
                    $('#pwdapply').text("重新申请");
                    that.pwdapply =  false;

                }
            });
        },
        // 返回
        fnHref(){
            if(this.nolist && this.aclist.length>0){
                window.location.reload(true);
            }else{
                //判断参数 astype是资产页面跳转过来的 2 是待收货页面 3是电子发票页面 
                if (this.hrefParma.page == 'astype' || this.hrefParma.page == 2 || this.hrefParma.page == 3) {
                    util.href("javascript:window.history.back(-1)");
                }else{
                    util.href("me.html");
                }
                // if(this.hrefParma.cbu){
                //     util.href(this.hrefParma.cbu);
                // }
            }
        },
        showMore(){
            if(this.moreIconShow){
                this.moreOn = !this.moreOn;
            }else{
                this.moreIconShow = true;
                this.moreOn = false;
                this.delShow = false;
            }
        },
        //显示查询绑定会员卡页面
        addcard(){
            this.nolist = true;
        },
        removeCard(){
            this.moreOn = false;
            this.moreIconShow = false;
            this.delShow = true;
        },
        // 获取会员卡列表
        _getAccountList(){
            let that = this;

            // 请求...
            util.api({
                surl: root.MB_API_PATH + 'acclist',
                type: 'get',
                success: function(response) {
                    var rpco = response.rpco,
                        body;

                    // 处理
                    switch(rpco) {
                        case 200:
                            body = response.body || {};
                            
                            $.each(body.aclist,(index,item)=>{
                                let acnum = item.acnum.replace(/(.{4})/g, "$1 ");
                                let acnumArr = acnum.split(" ");

                                $.each(acnumArr,(i,val)=>{
                                    if(i!=0 && val.length<4){
                                        acnumArr[i-1] += acnumArr[i];
                                        acnumArr.splice(i,1);
                                    }
                                })

                                item.acnumArr = acnumArr;
                                item.imgSrc = actypeObj[item.actype].imgSrc;
                            })

                            that.aclist = body.aclist;
                            that.meidou = that.aclist[0].gomedo;
                            that.nolist = false;
                            break;      
                        // 没有找到对应数据
                        case 404:
                            that.nolist = true;
                            break;
                        default:
                            util.tip('查询失败')
                    }
                }
            }); 
        },
        // 跳转会员卡详情
        jumpDetail(item){
            if(this.moreOn){
                this.moreOn=false
                return false;
            };
            if(this.delShow )return;
            util.href('accdetail.html',{
                acnum:  item.acnum,
                actype: item.actype
            })
        },
        /**
         * 删除会员卡
         * @parma {string}{1} acnum 会员账户账号
         * @parma {number}{1} actype 会员账户类型
         */
        _delAccount(acnum, actype) {
            var that = this;
            // 请求...
            util.api({
                surl: root.MB_API_PATH + 'modacc',
                data: {
                    acnum: acnum,
                    actype: actype,
                    state: util.OPT_STATE.DELETE
                },
                type: 'post',
                beforeSend: function() {
                    requestState.delAccount = false;
                },
                success: function(response) {
                    //response = response || {};
                    var rpco = response.rpco,
                        body = response.body || {};
                    // 处理
                    switch(rpco) {
                        // 正常
                        case 200:
                            //重新加载
                            util.tip('解绑成功',{duration:2000})
                            window.location.reload(true);
                            break;
                        default:
                            util.tip('删除失败')
                    }
                },
                complete: function() {
                    requestState.delAccount = true; 
                }
            });
        },
        
        /**
         * 删除会员卡提示
         * @parma {string}{1} acnum 会员账户账号
         * @parma {number}{1} actype 会员账户类型
         */
        delAccount(item) {
            let that = this,
                acnum=item.acnum,
                actype=item.actype;

            // 删除确认
            util.alert(msg.m2, {
                justOk: false,
                defBtnIndex: 1,
                okFn: function() {

                    that._delAccount(acnum, actype);
                }
            });
        }
        

    },
    computed:{

    },
	components: {
        headerComponent,
		checkCard
	}
}

</script>

<style lang="less" type="text/less">
@import '../../util/fs.less';
.wapper{
    position: absolute;
    top: 1.12rem;
    bottom:0;
    padding-top:0;
    width: 100%;
    max-width: 10rem;
}
  .header {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        color: #333;
        .mixinfont(18px);
        text-align: center;
        height: 1.12rem;
        line-height: 1.12rem;
        /* border-bottom: 1px solid #e3e3e3; */
        background-color: #f8f8f8;
        z-index: 1000;
        .goBack {
            /*width: 1.066667rem;*/
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            /*i{
                position: absolute;
                top: 0.306667rem;
                left: 0.32rem;
                width: 0.333333rem;
                height: 0.573333rem;
                background:url(//gfs6.gomein.net.cn/T1hTDTBKWQ1RCvBVdK) no-repeat;
                background-size: 0.333333rem 0.573333rem;
            }*/
        }
        .title {
            max-width: 70%;
            margin: 0 auto;
            display: block;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        .btnMore{
            position: absolute;
            top: 0;
            right: 0;
            width: 1.213333rem;
            height: 1.12rem;
            line-height: 1.12rem;
            text-align: center;
            .mixinfont(14px);
            b{
                font-weight: normal;
                
            }
            .i-moreyuandian{
                position: absolute;
                top: 0;
                right: 0;
                color: #777;
                font-style: normal;
                background: url(//img.dev.gomegj.com/guanjia/v2/moreyuandian.png) no-repeat center;
                background-size: 0.573333rem  0.133333rem;
                width: 1.213333rem;
                height: 1.12rem;
            }
        }  
      
        .menu {
            .mixinfont(14px);
            line-height: 1.12rem;
            text-align: center;
            background-color: #49484b;
            padding: 0 0.4rem;
            position: absolute;
            top: 1.29rem;
            right: 0.133333rem;
            z-index: 9999;
            border-radius: 0.08rem;
            color: #fff;
            .i-menu-sj {
                border-color: #49484b transparent;
                border-style: solid;
                border-width: 0 0.16rem 0.186667rem 0.16rem;
                position: absolute;
                top: -0.16rem;
                right: 0.426667rem;
            }
            li {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                padding: 0 0.72rem;
                i{
                    font-style: normal;
                    position: absolute;
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: contain;
                    border-radius: 2px;
                    &.i-bindcard {
                        width: 0.426667rem;
                        height: 0.426667rem;
                        background-image: url(//img.dev.gomegj.com/guanjia/v2/bindcard.png);
                        top: 0.346667rem;
                        left: 0;
                    }
                    &.i-unbindcard {
                        width: 0.426667rem;
                        height: 0.426667rem;
                        background-image: url(//img.dev.gomegj.com/guanjia/v2/unbindcard.png);
                        top: 1.493333rem;
                        left: 0.426667rem;
                    }
                }
                
            }
        }
       
    }
#acclistnew{
    .aclist{
        .bgfff{
            width: 100%;
            height: 0.56rem;
            background-color: #fff;
            position: absolute;
            top: 0;
            z-index: 99;
        }
        .aclistUl{
            width: 100%;
            /* padding: .533333rem 0.266667rem 0; */
            padding-top:0.53333rem;
            height: 5.5rem;
            .accImg{
                width: 100%;
                height: 3.2rem;
                position: relative;
                img{
                    position: absolute;
                    top:-0.773333rem;
                    width:100%;
                    height: auto;
                }
                a{
                    color:#fff;
                }
                .acnumWrite{
                    position: absolute;
                    left:2.326667rem;
                    bottom:0.186667rem;
                    z-index: 99;
                    li{
                        float: left;
                        color: #fff!important;
                        .mixinfont(21px);
                        margin-left: 0.3rem;
                        a{
                            color:#fff;
                        }
                    }
                }
                .delCard{
                    position: absolute;
                    top: 0;
                    right: 0.266667rem;
                    width: 1.066667rem;
                    height: 1.066667rem;
                    background:url(//gfs11.gomein.net.cn/T1BULvBybs1RCvBVdK.png) no-repeat center; 
                    background-size: 0.426667rem 0.426667rem;
                }
            }
        }

    }
   
    footer{
        position: fixed!important;
        left: 0;
        bottom: 0;
        z-index: 9999;
        width: 100%;
        height: 1.306667rem;
        line-height: 1.306667rem;
        text-align: center;
        background-color: #E0E0E0;
        color: #fff;
        .mixinfont(16px);
        &.on{
            background-color: #ff4b46;
        }
    }
}

.infolist {
    .px2rem(height,88);
    .px2rem(line-height,88);
    .mixinfont(14px);
    color: #333333;
    .px2rem(margin-left,36);
    .px2rem(padding-right,36);
    border-bottom: 1px solid #e3e3e3;
    p span {
        float:right;
    }
}
.sqbtn {
    float: right;
    display: block;
    .px2rem(height,56);
    .px2rem(line-height,56);
    text-align: center;
    .px2rem(width,180);
    color: #ffffff;
    .mixinfont(14px);
    background-color: #ff4b42;
    .px2rem(border-radius,30);
    .px2rem(margin-top,12);
}

.togray {
    background-color: #dddddd;
}
</style>