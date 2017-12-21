<template>
	  <div id="invoicedetail" class="wapper">
        <header-component :title="title"></header-component>
        <div>
            <!-- 内容明细区 -->
            <div class="imgSmall">
                <img class="imgSmallDetail"  @click="dealImg" :src="imgUrl" alt="">
                <img v-if='invoiceState==3' class="batInvoice" src="//gfs10.gomein.net.cn/T1PUAvBXJQ1RCvBVdK.png" alt="">
            </div>
            <div class="em_message" v-show='jumpOrigin'>发票发送到邮箱后，可下载打印发票</div>
            <ul class="btn">
               <!--  <li v-show='detailYbShow'><a href="javascript:;" @click='jumpYbDetail'>订单详情</a></li>
                <li v-show='detailShow'><a href="javascript:;" @click='jumpDetail'>商品详情</a></li> -->
                <li v-show='emailShow'><a :class='{"bat":invoiceState==3}' href="javascript:;" @click="setMailNum">将发票发送到邮箱</a></li>
            </ul>
            <div v-if="imgShow" @click.stop='closeImg' class="dialog-img"><div class="tablecell"><img :src="imgUrl"></div></div>
            <div class="dialog" v-if='dialogShow'>
                <div class="tablecell">
                    <div class="alert">
                        <div class="alert-title">发送到邮箱</div>
                        <div class="alert-input"><input class="wl100" v-model='mailNum' id="lgtk" type="text" placeholder="请输入邮箱地址" maxlength="32"></div>
                        <div class="alert-btn bdr-top">
                            <span class='bdr-r' id="alert-cancel" @click='closeMail'>取消</span>
                            <span @click='sendMail' id="alert-ok" class="light">发送</span>
                            
                        </div>
                    </div>
                </div>
            </div>
         </div>
    </div>
</template>

<script type="ecma6.0">
import headerComponent from '../../components/HeaderComponent';
let root = window || {},
    util = root.util || {},iScrollZoom,
    regex = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
export default {
	data () {
		return {
			title:'发票票样详情',
            imgShow:false,
            imgUrl:'',
            mailNum:'',
            dialogShow:false,
            iScrollZoom:null,
            jumpOrigin:true,
            emailShow:true,
            invoiceState:2,
            baseUrl:'http://img.gomein.net.cn/',
            // baseUrl:'http://wap.dev.gomegj.com/'
        }
	},
  	created() {
        if(util.isApp()){
            util.deleteHeadBtn();
        }
        this.hrefParma = util.getHrefParma();
        if(this.hrefParma.gd){
            this.imgUrl = this.hrefParma.einvoiceUrl;
            this.emailShow = false;
            this.jumpOrigin = false;
        }else{
            this._getInvoice();
        }
        
    },
    mounted(){
         
    },
    methods:{
        fnHref() {
            if(this.hrefParma.epage){
                util.href("./electronicInvoice.html",{
                    ct: new Date().getTime(),
                    epage:1
                })
            }else{
                util.href("javascript:window.history.back(-1)");
            }
        },
        // 请求发票信息
        _getInvoice(){
            let that = this;
            // debugger
               // var res = {"rpco":200,"tsrp":1511837247702,"body":{"userId":"1111","cardNo":"2222222","mobile":"12345678","pullType":null,"orderType":1,"source":null,"orderId":"123456789","shippingGroupId":"09876543","invoiceNo":"999999999","taxpayerIdNum":"88888888","invoiceType":2,"invoiceMediaType":null,"invoiceHeadType":null,"invoiceHead":"国美电器有限公司","invoiceContent":null,"invoiceState":"3","invoiceDate":1511837247702,"invoiceAmount":5000.0,"invoiceURL":"http://123.pdf","invoiceImgUrl":"http://gfs15.atguat.net.cn/T1iyYTBbh_1RCvBVdK.jpg","invoiceItems":[{"num":null,"type":null,"img":"http://123.jpg","name":"商品名称","salePrice":5000.0,"skuId":null,"skuNo":null,"categoryId":null,"brandId":null,"model":null,"mainName":"主商品名称"}]}};
               // that.imgUrl = res.body.invoiceImgUrl;
               // that.invoiceState = res.body.invoiceState;
               // return;
            // debugger
            
            let dataBody = {
                    //发票号码
                    'invoiceNo': String(that.hrefParma.invoiceId),
                    //订单类型
                    'orderType': that.hrefParma.orderType,
                    //订单来源
                    'ordersource': that.hrefParma.orderSource,
                    //订单号
                    'orderId': that.hrefParma.orderId
                };

            if(that.hrefParma.orderType=='null'){
                delete dataBody.orderType;
            }else{
                String(dataBody.orderType);
            }

            if(that.hrefParma.orderSource=='null'){
                delete dataBody.ordersource;
            }else{
                String(dataBody.ordersource);
            }

            if(dataBody.invoiceNo=='null'){
                delete dataBody.invoiceNo;
            }else{
                String(dataBody.invoiceNo);
            }

            if(dataBody.orderId=='null'){
                delete dataBody.orderId;
            }else{
                String(dataBody.orderId);
            }

            console.log(dataBody);

            util.api({
                surl:root.EINVOICE_API_PATH + 'detail',
                type:'get',
                data:dataBody,
                success:function(res) {
                    var rpco = res.rpco,
                        body = res.body;
                    // 处理
                    switch(rpco) {
                        case 200:
                            // if(!!body){
                            //    body = body.replace('\/app\/weblogic', '\/gomegj') 
                            // }
                            // that.imgUrl = that.baseUrl+body;
                            that.imgUrl = body.invoiceImgUrl; 
                            that.invoiceState = body.invoiceState;
                            //从发票列表页跳转过来时
                            // if(!that.hrefParma.gd){  
                            //     if(body.businessType == 6291456){
                            //         that.detailShow = false;
                            //         that.detailYbShow = true;
                            //     }else{
                            //         that.detailYbShow = false;
                            //         that.detailShow = (parseInt(body.showAsset)) ? true : false;
                            //     }
                            // }                           
                            //发票作废时，订单详情按钮隐藏
                            // if(body.invoiceState==3){
                            //     that.detailShow = false;
                            //     that.detailYbShow = false;
                            // }  
                        break;
                        case 404:
                            util.tip('服务器繁忙，请稍后再试',2000);
                            break;
                        default:
                            util.tip('请求失败');
                    }
                }
            })

        },
        // 查看发票大图
        dealImg(){
            if(this.invoiceState == 3)return;
            let that = this;
            this.imgShow= true;
            this.$nextTick(function(){
                that.iScrollZoom = new IScroll('.dialog-img', {
                    click:true,
                    zoom: true,
                    scrollX: true
                });
            })
            
        },
        // 关闭发票大图
        closeImg(){
            let that = this;
            setTimeout(function(){
                that.imgShow=false;
                that.iScrollZoom.destroy();
            }, 100)
            
        },
        // 跳转到实物资产订单详情页面
        // jumpDetail(){
        //     let that = this,dodt = new Date().getTime();
        //     util.href("./assetdetail.html",{
        //         asnum:that.hrefParma.otn
        //     })
        // },
        // 跳转到延保订单详情页面(在其他微信号上输入自己手机号领取发票后，点击电子发票按钮时报错)
        // jumpYbDetail(){
        //     let that = this,dodt = new Date().getTime(),otn='',otnAll=that.hrefParma.otn;
        //     otnAll = otnAll.split(',')[1];
        //     otn = otnAll.substring(0,otnAll.length-2);
        //     util.api({
        //        surl: root.ORDER_API_PATH + 'etoddt',
        //        data: {
        //            otn: otn,
        //            dodt: dodt,
        //            odtype: 6291456
        //        },
        //        type: 'get',
        //        success: function(response) {
        //            var rpco = response.rpco,
        //                body = response.body || {};
        //            // 处理
        //            switch(rpco) {
        //                case 200:
        //                     util.href('./ordersybdetety.html',{
        //                         otn: otn,
        //                         odtype: 6291456,
        //                         dodt: dodt,
        //                         gjd:1//订单详情页面通过此参数控制“电子发票”按钮是否显示
        //                     });
        //                    break;
        //                // 非本微信号的手机号点击按钮时不跳转，并提示
        //                default:
        //                    util.tip('对不起，找不到您的订单记录，请登录您下单时的微信账号进行查询')
        //             }
        //        }
        //     }); 
        // },
        // 显示输入邮箱对话框
        setMailNum(){
            if(this.invoiceState == 3)return;
            this.dialogShow = true;
        },
        // 发送邮件
        sendMail(){
            let that = this;
            if(!regex.test(this.mailNum)){
                util.tip('请输入正确的邮箱地址');
                return false;
            }
            util.api({
                surl:root.EINVOICE_API_PATH + 'sendemail',
                type:'get',
                data:{
                    mailaddres: that.mailNum,
                    einvoiceid: that.hrefParma.invoiceId  
                },
                success:function(res) {
                    var rpco = res.rpco;
                    // 处理
                    switch(rpco) {
                        case 200:
                            that.dialogShow = false;
                            util.tip('发送成功');
                        break;
                        case 404:
                            util.tip('服务器繁忙，请稍后再试',2000);
                            break;
                        default:
                            util.tip('请求失败');
                    }
                }
            })
        },
        // 关闭对话框
        closeMail(){
            this.mailNum = '';
            this.dialogShow = false;
        }  

    },
    computed:{

    },
	components: {
		headerComponent
	}
}

</script>

<style lang="less">
@import '../../util/fs.less';
#invoicedetail{
    .imgSmall{
        padding:0.533333rem 0.32rem 0;
        position: relative;
        .imgSmallDetail{
            width: 100%;
            height: auto;
            &.bat{
                opacity: 0.4;
            }
        };
        .batInvoice{
            width: 2.933333rem;
            height:2.933333rem;
            position: absolute;
            left: 50%;
            top:50%;
            margin-left:-1.466667rem;
            margin-top:-1.466667rem;
        }
    }

    .em_message{
        color:#999999;
        font-size:0.32rem;
        line-height:0.453333rem;
        padding:0.233333rem 0.32rem 0;
    }
   
    .btn{
        padding: 0.813333rem 0.533333rem 0;
        a{
            display: block;
            width: 100%;
            height: 1.173333rem;
            line-height: 1.173333rem;
            text-align: center;
            color:#fff;
            background-color: #FF4B41;
            border-radius: 0.7rem;
            border:0.013333rem solid #e3e3e3;
            margin-top: 0.4rem;
            .mixinfont(16px);
            &.bat{
                opacity:.5;
            }
            span{
                color:#777;
            }
        }
    }
}
.alert-tip {
    color: #fff;
    font-size: 0.426667rem;
    line-height: 0.533333rem;
    width: 80%;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top:-15%;
    margin-left: -40%;
    z-index: 9999990;
    .msg {
        display: inline-block;
        background-color: rgba(0, 0, 0, .8);
        padding: 0.4rem;
        position: relative;
        -webkit-border-radius: 10px;
                border-radius: 10px;
    }
}
.alert {
    width: 7.2rem;
    background-color: rgba(255,255,255,.95);
    display: inline-block;
    padding-top: 0.133333rem;
    text-align: center;
    opacity: 1;
    -webkit-border-radius: 10px;
            border-radius: 10px;
}
.alert-title {
    font-weight: 700;
    line-height: 1.28rem;
    .mixinfont(18px);
}
.alert-input {
    color: #666;
    .mixinfont(16px);
    line-height: 1.066667rem;
    width: 5.893333rem;
    border:none;
    margin: 0 auto 0.533333rem;
    padding-left: 0.266667rem;
    background-color: #fff;
    text-align: left;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
}
.alert-input input {
    color: #333;
    width: 100%;
    border-style: none;
    background-color: transparent;
}

:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #d6d6d6; opacity:1; 
}

::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #d6d6d6;opacity:1;
}

input:-ms-input-placeholder{
    color: #d6d6d6;opacity:1;
}

input::-webkit-input-placeholder{
    color: #d6d6d6;opacity:1;
}
.alert-btn {
    color: #999;
    white-space: nowrap;
    overflow: hidden;
    border-top:none;
    .light{
        color:#FF4B41;
    }
}
.alert-btn span {
    width: 50%;
    line-height: 1.173333rem;
    display: inline-block;
}
.alert-btn span:not(:last-of-type) {
    border-right: none;
}
</style>