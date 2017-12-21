<template>
    <div id="assybsubmit" class="wapper">
        <div class="box-out">
            <header-component :title="title"></header-component>
            <div class="asset-detail-box">
                <img class="asset-detail-img js-zc-img" :src="assetImg" alt="">
                <span class="tod asset-detail-tit js-zc-title">{{ assetName }}</span>
                <span class="asset-detail-pp">品牌：<span class="js-zc-pp">{{ assetBrand }}</span></span>
                <span class="asset-detail-xh">型号：<span class="js-zc-xh">{{ assetModel }}</span></span>
                <span class="asset-detail-zb">在保</span>
            </div>
            <div class="mt10 yanbao-info">
                <div class="asset-detail-box">
                    <img class="asset-detail-img" :src="skuBody.picurl" alt="">
                    <span class="tod asset-detail-tit">{{ skuBody.title }}</span>
                    <span class="asset-detail-pp">
                        价格：
                        <span class="original-price">
                           {{ parseFloat(skuBody.price/100).toFixed(2) }}
                        </span>
                        <span class="highest-offer-box" v-show="haveDown">
                           支付立减
                           <span class="highest-offer">
                              {{ parseFloat(skuBody.disPrice/100).toFixed(2) }}
                           </span>
                           元
                        </span>
                    </span>
                    <span class="yanbao-guarantee">支持39天无理由退货</span>
                    <span class="yanbao-s-num">X1</span>
                </div>
            </div>
            <div class="mt10 yanbao-other-info">
                <div class="yanbao-pay-type">
                    <span class="tit">支付方式</span>
                    <span class="type">在线支付</span>
                </div>
                <div class="yanbao-invoice-info">
                    <div class="tit">发票信息</div>
                    <ul class="invoice-check-list">
                        <!--<li class="checked js-noinvoice">不需要发票</li>-->
                        <!--<li class="js-invoice">纸质发票</li>-->
                        <li class="checked js-eleinvoice" @click="invoice_dp">电子发票</li>
                    </ul>
                    <div class="invoice-info mt10" v-show='invoiceDetail'>
                        <p>发票抬头：<span id="iName">{{ saveInvoice.title }}</span></p>
                        <p class="" v-show="taxHave">纳税人识别号：<span id="iNumber">{{ saveInvoice.taxpayerRegNo }}</span></p>
                        <p>发票内容：<span id="iMingxi">{{ saveInvoice.content }}</span></p>
                        <!--<p>收票人信息：<span id="iIphone"></span> <span id="iAddress"></span></p>-->
                        <p>收票人手机：<span id="iIphone">{{ saveInvoice.mobile }}</span></p>
                    </div>
                </div>
            </div>
            <div class="contract-item">
                <p class="invoice-ele-msg">提示：家安保服务，只能提供增值税普通电子发票，后期凭借电子发票进行延保保修。</p>
                <i class="contract-icon dline checked" id="contractCheck"></i>
                <a class="contract-link dline" href="javascript:;" id="payTip" @click="payContract_dp">购买协议</a>
            </div>
        </div>

        <div class="yanbao-footer" v-show='!invoice'>
            <span class="yanbao-total-price">
                <span class="text">应付金额：</span>
                <span class="icon">￥</span><span class="price">{{ parseFloat(skuBody.payPrice/100).toFixed(2) }}</span>
                <span class="delePrice" v-show="haveDown">￥<span class="original-price">{{ parseFloat(skuBody.price/100).toFixed(2) }}</span></span>
            </span>
            <span class="yanbao-submit-order" id="saveOrder" @click="saveOrder">提交订单</span>
        </div>

        <div id="invoice" v-show="invoice">
            <div class="header1">
                <!-- 标题 -->
                <a class="goBack" target="_self" href="javascript:;" @click="goBack('invoice')">&nbsp;<i class="i i-return"></i></a>
                <span class="title">电子发票信息</span>
            </div>
            <div class="container">
                <div class="blk2">
                    <div class="invoice-tit">发票抬头</div>
                    <div class="info-check-box">
                        <div class="info-check-item" :class="{'checked':checkState==1}" @click="checkedIpn(1)">
                            <p class="info-check-left">
                                <span class="info-check-icon"></span>
                                <span class="info-check-text">个人</span>
                            </p>
                            <label class="info-check-input-box">
                                <input class="info-check-input js-invoice-input1" type="text" maxlength="30" v-model="all_Val.inpVal.inpVal1" @change="prime(all_Val.inpVal.inpVal1,1)">
                                <!--<span class="info-check-input-del"></span>-->
                            </label>
                        </div>
                        <div class="info-check-item" data-v="3" :class="{'checked':checkState==3}" @click="checkedIpn(3)">
                            <p class="info-check-left">
                                <span class="info-check-icon"></span>
                                <span class="info-check-text">企业</span>
                            </p>
                            <label class="info-check-input-box">
                                <input class="info-check-input js-invoice-input2" type="text" maxlength="60" v-model="all_Val.inpVal.inpVal3" @change="prime(all_Val.inpVal.inpVal3,3)">
                               <!-- <span class="info-check-input-del"></span>-->
                            </label>
                        </div>
                        <div class="info-check-item" data-v="5" :class="{'checked':checkState==5}" @click="checkedIpn(5)">
                            <p class="info-check-left">
                                <span class="info-check-icon"></span>
                                <span class="info-check-text">非企业性单位</span>
                            </p>
                            <label class="info-check-input-box">
                                <input class="info-check-input js-invoice-input3" type="text" maxlength="60" v-model="all_Val.inpVal.inpVal5" @change="prime(all_Val.inpVal.inpVal5,5) ">
                                <!-- <span class="info-check-input-del"></span>-->
                            </label>
                        </div>
                    </div>
                </div>
                <div class="bcf mt10">
                    <ul class="list-labelvalue" >
                        <li id="taxNumber" class="" v-show="faxNum">
                            <label>纳税人识别号：</label>
                            <input type="text" maxlength="20" minlength="10" oninput="if(value.length>20)value=value.slice(0,20)"  v-model="all_Val.faxVal" @change="prime(all_Val.faxVal,20)" :placeholder="xuan" @input="valChange(all_Val.faxVal)">
                        </li>
                        <li id="iphone">
                            <label>收票人手机：</label>
                            <input type="tel" oninput="if(value.length>11)value=value.slice(0,11)" v-model="all_Val.phoneNum" @change="prime(all_Val.phoneNum,11)">
                        </li>
                        <!--<li id="selregion">-->
                            <!--<label>收票人地址：</label>-->
                            <!--<span class="value" id="region">请选择</span>-->
                            <!--<i class="i i-gt"></i>-->
                        <!--</li>-->
                        <!--<li id="addressDetail">-->
                            <!--<label>详细地址：</label>-->
                            <!--<input type="text" placeholder="请输入详细地址" maxlength="100">-->
                        <!--</li>-->
                    </ul>
                </div>
                <div class="blk2 mt10">
                    <div class="invoice-tit">发票内容</div>
                    <div class="oh">
                        <div class="invoice-type">明细<span class="check-icon"></span></div>
                        <p class="invoice-msg">声明：建议你发票的内容开为产品明细，否则你将无法正常享受厂商或国美管家的正常质保。延保商品只开具普通发票。</p>
                    </div>
                </div>
            </div>
            <div class="invoice-footer" :class="{'disabled':allFill_in==1}" id="confirm" @click="confirmBtn">确认</div>
        </div>

        <div id="payContract" v-show="payContract">
            <div class="header">
                <a class="js-t-close" target="_self"  @click="goBack('payContract')">&nbsp;<i class="i i-return"></i></a>
                <!-- 标题 -->
                <span class="title">购买协议</span>
            </div>
            <div class="container">
                <div >
                    <br>【名词定义】<br>
                    您---购买人     我们---北京国美管家信息技术有限公司<br>
                    就您在我司购买的      产品的家安保服务具体事项见如下约定：<br>
                    <strong>一、家安保服务期限</strong><br>
                    1、延保<br>
                    1.1电器整机：自电器的厂家整机保修期届满之日开始计算，直至您购买的延保期限届满之日终止（电器整机保修延长，针对所有购买“家安保”的电器）。<br>
                    1.2电器主要零部件：自电器的厂家主要部件保修期届满之日开始计算，直至您购买的延保期限届满之日终止。<br>
                    例如：您2016年5月1日购买的电器整体保修1年，主要部件保修三年，您购买了3年的延保服务，那么您所购买电器的整机延保期自2017年5月1日开始，至2018年4月30日截至，主要部件自2019年5月1日开始，至2022年4月30日截至。<br>
                    <strong>二、家安保服务范围</strong><br>
                    2.1延保<br>
                    2.1．1电器生产厂家保修范围内涵盖的电器自身性能故障。由于灰尘、受热、内部潮湿/冷凝、正常磨损、动力高峰/电压不稳引起的故障。<br>
                    2. 1.2延保期内，遥控器性能故障（非外观、进水故障）免费置换一次（仅限彩电、空调、音响、碟机四类商品）。<br>
                    2.1.3冰箱或冰柜在延保服务期内，因故障而引发的食物腐坏变质，我们将为您提供一次最高100元的食物补偿，仅限一次。<br>
                    <strong>三、以下内容不属于延保服务范围：</strong><br>
                    3.1无延保协议或者无有效销售发票。<br>
                    3.2产品型号、产品身份标识等在延保合同中记载的产品相关信息与实际修理的产品不符或者涂改的。<br>
                    3.3提出维修要求时不在延保期内。<br>
                    3.4经国家质量技术监督检验机构或第三方专业技术机构鉴定，产品存在由于设计、制造等方面的原因而在某一批次、型号或类别的产品中普遍存在的具有同一性能的质量问题。<br>
                    3.5电器的附加配件，诸如电池、耳机、充电器、打印机墨盒、硒鼓、光盘和磁盘等。<br>
                    3.6由地震、洪水、泥石流、火山、台风或沙尘暴等形成的不可抗力、故意损坏、意外损坏、火灾、病毒、原装基础上添加的储存数据或电脑硬件的丢失或损坏、液体泼溅导致的损坏。<br>
                    3.7外部受潮/冷凝、昆虫破坏、动物啃咬、误用、滥用、产品序列的涂改或缺失、由非授权维修人员维修导致的损坏。<br>
                    3.8因厂家召回导致的故障或因此产生的损失。<br>
                    3.9电脑软件或与电脑软件相关的故障。<br>
                    3.10产品使用不当、产品遗失、产品被盗、屏幕破裂或物理损坏（意外延保、碎屏延保除外）。<br>
                    3.11参加本服务之前产品的既有故障、图像滞屏。<br>
                    3.12在中华人民共和国大陆领域外发生的故障。<br>
                    3.13不影响功能的外观损坏。因电器故障导致的任何信息或数据丢失。<br>
                    3.14其他不属于本延保服务范围内的损失、费用和责任。<br>
                    <strong>四、延保服务流程</strong><br>
                    4.1当您的电器在延保服务期内出现问题，请通过服务号进行报修，我们的服务人员将根据您购买电器产品的具体情况将为您安排上门服务或者指定地点自送服务。<br>
                    4.2对于需要上门安装、调试或者厂家提供上门维修服务的电器，我们将派技术人员至现场维修，或取送至授权服务中心维修，待维修或替换完成后，免费送回您家中。除以上情况外的其他电器产品，需要您根据我们服务人员提供的授权维修中心地址自行送修。<br>
                    <strong>五、更换新机服务</strong><br>
                    <p>符合如下条件的，我们将类似原商品规格和功能的全新电器进行更换（自然灾害、火灾、人为因素以及不可抗力因素导致空调故障的除外），所更换电器的价格需低于您购买的电器产品的发票金额。</p>
                    5.1对于延保期内经过三（3）次修理的电器（碎屏保及意外保除外），经我们判断仍需要进行第四（4）次修理时。<br>
                    5.2如您购买的是售价1000元（含）以内的电器（手机、摄像机、照相机、电脑、医疗器械产品除外），在延保服务期内出现性能故障时。<br>
                    <strong>六、注意事项</strong><br>
                    6.1 对于手机、摄像机、照相机，您需在购买产品的同时购买本服务，同时提供商品序列号、手机进网许可号；对于其他产品，您需在产品厂家整机保修内购买本服务。我们不接受上述期限之外的延保服务的购买申请。<br>
                    6.2请您将该服务条款和相关收据或发票妥善保管，在您需要延保服务时必须提供本协议和相关收据或发票，否则您将无法获得延保服务。<br>
                    6.3送修前清理电器内个人物品，我们仅对电器自身承担维修责任。<br>
                    6.4维修服务时请您自行备份所有软件和数据，并于维修后自行恢复所有软件和数据，我们不负责重装或恢复软件。<br>
                    6.5如果您购买的是成套电器（如烟机+灶具），您需就整套电器购买延保服务，尽管如此，我们将视同您已就单件电器购买独立的延保服务，并按单件电器分别延保服务。<br>
                    6.6对于更换新机，一旦更换完毕，您所购买的本次延保服务即视为终止。<br>
                    6.7进行换机服务时，原电器及购买发票必须连同授权服务的三（3）次维修单据一同返还我们。请妥善保留您的服务单据，遗失不补。预防性质的保养检查、清洁、故障诊断、顾客培训和附加配件维修/更换；电脑键盘、音箱、电池以及鼠标的维修/更换和电脑软件相关问题的服务均不计入换机时所指的维修次数。<br>

                    <strong>七、服务转让</strong><br>
                    <p>在延保服务的有效期内，您可以在转让电器时将延保服务一并转让给新的所有权人，而无需支付额外手续费。购买凭证以及所有的修理服务收据必须同时转移给新的所有权人。</p>
                    <strong>八、责任及免责</strong><br>
                    <p>本服务的最高责任是您为电器支付的购买价款，如果所有的授权修理总费用超出电器购买价款或者电器已经得到更换的，我们即已经履行完毕本服务项下的所有的责任。对任何间接损失或附带损失（包括但不限于：无法使用、业务损失、利润损失、数据损失、故障时间损失及误工费）不承担任何责任。</p>
                    <strong>九、本服务终止事项</strong><br>
                    <p>我们有权针对欺诈或重大不实陈述（包括但不限于将保修电器租赁使用）终止本服务。对保修电器进行未经授权的修理的，我们也有权终止本服务。如果终止本服务，我们会在终止前不少于六十（60）天将终止服务的书面通知邮寄给您。如果在本服务的有效期内，您的保修电器已经得到更换，本服务将自动终止。自本服务购买之日起三十九（39）天之内您可以以任何理由通知我们的延保服务部门终止本协议，并获得退款。但在上述期间之后本服务有效期剩余时间内，您不得要求终止本协议或退款。</p>
                    <strong>十、本协议一式两联，双方各执一联。</strong>
                </div><br>
            </div>
        </div>
    </div>
</template>

<script type="ecma6.0">
import headerComponent from '../../components/HeaderComponent';
let root = window || {},
    util = root.util || {};
export default {
	data () {
		return {
			title:'延保信息',
			hrefParma:{},
            invoice:false,
            payContract:false,
            assetdelBody:{},

            assetImg:'',//资产图片
            assetName:'',//资产名称
            assetBrand:'',//资产品牌名
            assetModel:'',//资产型号名

            skuBody:{},
            haveDown:false,
            checkState:1,
            faxHavemain:false,
            xuan:'',
            
            titletype:1,            
            faxNum:false,
            
            'all_Val':{
                //发票抬头
                'inpVal':{
                   'inpVal1':'',
                   'inpVal3':'',
                   'inpVal5':''
                },
                'faxVal':'',
                'phoneNum':'',
            },
            //填写信息栏确认按钮
            allFill_in:1,

            saveInvoice:{},//请求回来的保存信息
            invoiceDetail:false,
            taxHave:false,
            //是否开发票 0 不开  1开
            invoicetype: 0,
            //发票id
            invoiceid: ''

            
        }
	},
  	created() {
        this.hrefParma = util.getHrefParma();
        let that = this;
        if(util.isApp()){
            util.deleteHeadBtn();
        }
        //获取资产详情
        that.getAssetdel();

        /**
        *获取sku详情
        */
        that.getSKUDetail();
    },
    //实时监测input值 
    watch:{
        all_Val:{
            handler(curVal,oldVal){
                let that =this;

                 switch(that.checkState){
                        //如果选中个人，只判断个人与号码
                        case 1:
                           if(curVal.inpVal.inpVal1!=''&&curVal.phoneNum!=''){
                                that.allFill_in=0;//点亮，非0即可 
                           }else{
                                that.allFill_in=1;//置灰按钮 
                           }
                           break;
                        //如果选中企业，判断企业，识别号与号码
                        case 3:
                            if(curVal.inpVal.inpVal3!=''&&curVal.faxVal!=''&&curVal.phoneNum!=''){
                                 that.allFill_in=0;
                            }else{
                                 that.allFill_in=1;
                            }
                            break;
                        //如果选中非企业单位，判断非企业单位与号码
                        case 5:
                            if(curVal.inpVal.inpVal5!=''&&curVal.phoneNum!=''){
                                 that.allFill_in=0;
                            }else{
                                 that.allFill_in=1;
                            }
                            break;
                }

　　　　　},
　　　　　deep:true
        }
    },
    computed: {
     
    },
    methods:{
        /**
        *获取资产详情
        **/
        getAssetdel(){
          var that = this;
            //debugger start
            // var response = {
            //     "rpco": 200,
            //     "msg": "",
            //     "body": {
            //         "asname": "小米手机最新款",
            //         "brandTitle":"小米",
            //         "model":"NOTE4",
            //         "status":1,
            //         "asimgus":["http://img.dev.gomegj.com/guanjia/v2/yb-icon.jpg"]
            //     }
            // };
            // var rpco = response.rpco,
            //     body = response.body;
            // // 处理
            // switch(rpco) {
            //     case 200:
            //         that.assetdelBody = body;
            //         break;
            //     default:
            //         util.tip('请求失败')
            // }
            // return false;
            //debugger end
    
            // 请求...
            util.api({
                surl: root.AS_API_PATH + 'assdtal',
                // data: {asnum:that.hrefParma.assetid},
                data: {id:that.hrefParma.id},
                type: 'get',
                success: function(response) {
                    var rpco = response.rpco;
                    // 处理
                    switch(rpco) {
                        case 200:
                            let body = response.body;
                            that.assetImg = body.asimgus[0];
                            that.assetName = body.asname;
                            that.assetBrand = body.brandTitle;
                            that.assetModel = body.model;
                            break;
                        default:
                            util.tip('请求失败')
                    }
                }
            });
        },

         /**
         *获取sku详情
         */
        getSKUDetail: function() {
            let that = this;
            // debugger start
            // var response = {
            //     "rpco": 200,
            //     "msg": "",
            //     "body": {
            //         "title": "家安保手机iphone4000-4999延保1年",
            //         "price":"65000",
            //         "picurl":"http://img.dev.gomegj.com/guanjia/v2/yb-icon.jpg",
            //         "disPrice":5000,
            //         "payPrice":"60000"
            //     }
            // };
            // var rpco = response.rpco,
            //     body = response.body;
            // // 处理
            // switch(rpco) {
            //     case 200:
            //         that.skuBody = body;
            //         if(that.skuBody.disPrice/100 > 0){
            //             that.haveDown = true;
            //         }
            //         break;
            //     default:
            //         util.tip('请求失败')
            // }
            // return false;
            //debugger end
            // 请求...
            util.api({
                surl: root.AS_API_PATH + 'yb/getskudetail',
                data: {
                    skuid:that.hrefParma.skuid,
                    providerid:that.hrefParma.providerid,
                    assetid:that.hrefParma.assetid
                },
                type: 'get',
                success: function(response) {
                    var rpco = response.rpco,
                        body = response.body;
                    // 处理
                    switch(rpco) {
                        case 200:
                            that.skuBody = body;
                            if(that.skuBody.disPrice/100 > 0){
                                that.haveDown = true;
                            }
                            break;
                        default:
                            util.tip('请求失败')
                    }
                }
            });
        },
        /**
        *pinut框选中状态
        **/
        checkedIpn(num){
           let that =this;
           if(num == 1){
              that.checkState = 1;
              that.titletype =1;
              //清空其他两个抬头及识别号
              that.all_Val.inpVal.inpVal3 = '';  
              that.all_Val.inpVal.inpVal5 = ''; 
              that.all_Val.faxVal = '';
              //纳税人识别号placeHolder
              that.xuan = '';
              //纳税人识别号
              that.faxNum = false;
           }else if(num == 3){
              that.checkState = 3;
              that.titletype = 3;
              //清空其他两个抬头
              that.all_Val.inpVal.inpVal1 = '';  
              that.all_Val.inpVal.inpVal5 = ''; 
              that.xuan = '';
              //纳税人识别号
              that.faxNum = true;
           }else if(num == 5){
              that.checkState = 5; 
              that.titletype =5;
              //清空其他两个抬头
              that.all_Val.inpVal.inpVal3 = '';  
              that.all_Val.inpVal.inpVal1 = ''; 
              that.xuan = '(选填)';
              //纳税人识别号
              that.faxNum = true;
           }

           
        },
        /**
        *val 输入框焦点离开时的值
        *ipnIp 哪一个输入框
        **/
        prime(val,ipnIp){
            let that=this;
        },
        valChange(val){
            this.all_Val.faxVal = val.toUpperCase()
        },
        confirmBtn(){
             let that=this;
             //若置灰则点击无效
             if(that.allFill_in==1){return false;}

             let phoneReg = /^(((1[3|8][0-9])|(14[5|7])|(15[^4,\D])|(17[6|7|8])|(198))\d{8}|(170[0|5|9])\d{7})$/; // 手机号正则
             let taxReg = /[0-9A-Z]{10,20}$/;
             let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
             let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
             let msg = {
                 m1:'抬头名称不能为空',
                 m2:'手机号码格式错误，请重新输入',
                 m3:'请输入正确的手机号',
                 m4:'请输入详细地址',
                 m5:'请选择地区',
                 m6:'发票抬头不可输入表情符号，请重新输入',
                 m7:'识别码不能为空',
                 m8:'识别码格式不正确，请重新输入', 
                 m9:'抬头不可输入特殊字符，请重新输入'
             };

             switch(that.checkState){
                        //如果选中个人，校验个人与号码
                        case 1:
                           //抬头为空
                           if(that.all_Val.inpVal.inpVal1 ==''){
                               util.tip(msg.m1);
                               return false; 
                           }
                           //抬头含有特殊字符
                           else if( regCn.test(that.all_Val.inpVal.inpVal1)||regEn.test(that.all_Val.inpVal.inpVal1) ){
                               util.tip(msg.m9);
                               return false;
                           }
                           //抬头输入表情
                            else if( that.isEmojiCharacter(that.all_Val.inpVal.inpVal1) ){
                                util.tip(msg.m6);
                                return false;
                            }
                            //电话为空
                           else if( that.all_Val.phoneNum=='' ){
                               util.tip(msg.m3);
                               return false;
                           }
                           //电话格式不正确
                           else if( !phoneReg.test(that.all_Val.phoneNum) ){
                               util.tip(msg.m3);
                               return false;
                           }
                           break;
                        //如果选中企业，判断企业，识别号与号码
                        case 3:
                            //抬头为空
                            if(that.all_Val.inpVal.inpVal3 ==''){
                               util.tip(msg.m1);
                               return false; 
                            }
                            //抬头含有特殊字符
                            else if( regCn.test(that.all_Val.inpVal.inpVal3)||regEn.test(that.all_Val.inpVal.inpVal3) ){
                                util.tip(msg.m9);
                                return false;
                            }
                            //抬头输入表情
                            else if( that.isEmojiCharacter(that.all_Val.inpVal.inpVal3) ){
                                util.tip(msg.m6);
                                return false;
                            }
                            //识别号为空
                            else if( that.all_Val.faxVal=='' ){
                                util.tip(msg.m7);
                                return false;
                            }
                            //识别号格式不正确
                            else if( !taxReg.test(that.all_Val.faxVal) ){
                                util.tip(msg.m8);
                                return false;
                            }
                            //电话为空
                            else if( that.all_Val.phoneNum=='' ){
                                util.tip(msg.m3);
                                return false;
                            }
                            //电话格式不正确
                            else if( !phoneReg.test(that.all_Val.phoneNum) ){
                                util.tip(msg.m3);
                                return false;
                            }
                            break;
                        //如果选中非企业单位，判断非企业单位与号码
                        case 5:
                             //抬头为空
                            if(that.all_Val.inpVal.inpVal5 ==''){
                               util.tip(msg.m1);
                               return false; 
                            }
                            //抬头含有特殊字符
                            else if( regCn.test(that.all_Val.inpVal.inpVal5)||regEn.test(that.all_Val.inpVal.inpVal5) ){
                                util.tip(msg.m9);
                                return false;
                            }
                            //抬头输入表情
                            else if( that.isEmojiCharacter(that.all_Val.inpVal.inpVal5) ){
                                util.tip(msg.m6);
                                return false;
                            }
                            //识别号不为空，进行校验
                            else if( that.all_Val.faxVal!='' ){
                                //识别号格式不正确
                                if( !taxReg.test(that.all_Val.faxVal) ){
                                    util.tip(msg.m8);
                                    return false;
                                }
                            }
                            //电话为空
                            else if( that.all_Val.phoneNum=='' ){
                                util.tip(msg.m3);
                                return false;
                            }
                            //电话格式不正确
                            else if( !phoneReg.test(that.all_Val.phoneNum) ){
                                util.tip(msg.m3);
                                return false;
                            }
                            break;
              }

              //校验成功，提交信息
              that._save();

             // console.log(that.all_Val.inpVal.inpVal1)
             // console.log(that.all_Val.inpVal.inpVal3)
             // console.log(that.all_Val.inpVal.inpVal5)
             // console.log(that.all_Val.faxVal)
             // console.log(that.all_Val.phoneNum)
        },
        //校验表情
        isEmojiCharacter(substring) {
             for (var i = 0; i < substring.length; i++) {
                 var hs = substring.charCodeAt(i);
                 if (0xd800 <= hs && hs <= 0xdbff) {
                     if (substring.length > 1) {
                         var ls = substring.charCodeAt(i + 1);
                         var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                         if (0x1d000 <= uc && uc <= 0x1f77f) {
                             return true;
                         }
                     }
                 } else if (substring.length > 1) {
                     var ls = substring.charCodeAt(i + 1);
                     if (ls == 0x20e3) {
                         return true;
                     }
                 } else {
                     if (0x2100 <= hs && hs <= 0x27ff) {
                         return true;
                     } else if (0x2B05 <= hs && hs <= 0x2b07) {
                         return true;
                     } else if (0x2934 <= hs && hs <= 0x2935) {
                         return true;
                     } else if (0x3297 <= hs && hs <= 0x3299) {
                         return true;
                     } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
                             || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
                             || hs == 0x2b50) {
                         return true;
                     }
                 }
                }
         },
         /**
         *保存
         */
        _save: function() {
            let that = this,
                title = '',
                data = {};
                if(that.all_Val.inpVal.inpVal1){
                    title = that.all_Val.inpVal.inpVal1;
                } else if(that.all_Val.inpVal.inpVal3){
                    title = that.all_Val.inpVal.inpVal3;
                } else if(that.all_Val.inpVal.inpVal5){
                    title = that.all_Val.inpVal.inpVal5;
                }
            that.titletype = String(that.titletype);
            //titletype发票类型 1个人 3为企业 5为非企业性单位
            data = {
                titletype: that.titletype,
                title: title,
                mobile: that.all_Val.phoneNum,
                taxpayerRegNo: that.all_Val.faxVal,
                content: '明细',
                asnum: that.hrefParma.assetid
            };
            // console.log(data)
            // 请求...
            util.api({
                surl: root.ORDER_API_PATH + 'modinvoice',
                data: data,
                type: 'post',
                success: function(response) {
                    var rpco = response.rpco,
                        body = response.body;
                    // 处理
                    switch(rpco) {
                        case 200:
                            body.invoiceid && (that.invoiceid = body.invoiceid) && (that.invoicetype = 1);
                            that.invoice = false;
                            that.getInvoice();
                            break;
                        default:
                            util.tip('保存失败')
                    }
                }
            });
        },
        /**
         *获取发票信息
         */
        getInvoice: function() {
            let that = this;
            // 请求...
            util.api({
               surl: root.ORDER_API_PATH + 'invlidedetail',
               data: {id:that.invoiceid},
               type: 'get',
               success: function(response) {
                   var rpco = response.rpco,
                       body = response.body;
                   // 处理
                   switch(rpco) {
                       case 200:
                           that.saveInvoice = body;
                           that.invoiceDetail = true;
                           if(body.taxpayerRegNo){
                              that.taxHave = true;
                           }else{
                              that.taxHave = false;
                           }
                           break;
                       default:
                           util.tip('保存失败')
                   }
               }
            });
        },

        /**
         *提交订单
         */
        saveOrder: function() {
            var that = this,
                data = {};
            //debugger start
            /*var response = {
                "rpco": 200,
                "msg": "",
                "body": {
                    "orderid": "GJD123",
                    "createtime":1474537398175
                }
            };
            var rpco = response.rpco,
                body = response.body;
            // 处理
            switch(rpco) {
                case 200:
                    util.href('./pay.html',{
                        otn : body.orderid,
                        dodt : body.createtime,
                        odtype : 1
                    })
                    break;
                default:
                    util.tip('请求失败')
            }
            return false;*/
            //debugger end
            // 请求...
    
            data = {
                       "assetid":that.hrefParma.assetid,
                       "skulist":[{
                           "skuid":that.hrefParma.skuid,
                           "providerid":that.hrefParma.providerid,
                           "price":that.skuBody.payPrice,
                           "num":1
                       }],
                       "paymethod":1,
                       "invoicetype":that.invoicetype
                    }
            if(that.invoiceid){
                data.invoiceid = that.invoiceid;
            }else{
                util.tip('请填写发票信息');
                return false;
            }
    
            util.api({
                surl: root.AS_API_PATH + 'yb/saveorder',
                data: data,
                type: 'post',
                success: function(response) {
                    var rpco = response.rpco,
                        body = response.body;
                    // 处理
                    switch(rpco) {
                        case 200:
                            util.href('./pay.html',{
                                otn : body.orderid,
                                dodt : response.tsrp,
                                odtype : 6291456
                            })
                            break;
                        // 用户有未支付的延保订单
                        case 40001:
                            util.tip('额，您还有未支付的延保订单，无法重复购买')
                            break;
                        // 用户已购买过此资产的延保产品
                        case 40002:
                            util.tip('该商品已经购买过延保服务了哦')
                            break;
                        default:
                            util.tip('哎呀，延保单提交失败，请稍后再试')
                    }
                }
            });
        },

        
        //点击电子发票按钮弹出信息栏
       invoice_dp(){
          let that =this;
          that.invoice = true;
       },
       //点击购买协议
       payContract_dp(){
          let that =this;
          that.payContract = true;
       },
       //返回列表页
       goBack(nowPosition){
          let that =this;
          if(nowPosition == 'invoice'){
             that.invoice = false;
          }else if(nowPosition == 'payContract'){
             that.payContract = false;
          }
          
       },
    	
    },
	components: {
		headerComponent
	}
}

</script>

<style lang="less">
@import '../../util/fs.less';

html,body,#assybsubmit{
    height:100%;
}
#assybsubmit{
    position:relative;
    box-sizing: border-box;
}
    .box-out{
        box-sizing: border-box;
        width: 100%;
        min-width: 320px;
        background-color: #f5f5f5;
        position: absolute;
        /*top: 1.146667rem;*/
        /*bottom: 1.333333rem;*/

        .asset-detail-box {
            min-height: 2.266667rem;
            padding: 0.4rem 0.32rem 0.4rem 2.933333rem;
            background: #fff;
            position: relative;
            .asset-detail-img {
                width: 2.346667rem;
                height: 2.346667rem;
                border: 1px solid #e3e3e3;
                position: absolute;
                left: 0.32rem;
                top: 0.346667rem;
                border-radius: 0.133333rem;
            }
            .asset-detail-tit {
                font-size: 0.426667rem;
                display: block;
            }
            .tod {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .asset-detail-pp, .asset-detail-xh {
                font-size: 0.346667rem;
                color: #777;
                display: block;
            }
            .asset-detail-xh span {
                font-size: 0.373333rem;
            }
            .asset-detail-zb {
                font-size: 0.293333rem;
                height: 0.426667rem;
                line-height: 0.426667rem;
                text-align: center;
                vertical-align: middle;
                background: #1ac6bc;
                color: #fff;
                width: 1.173333rem;
                display: block;
                margin-top: 0.133333rem;
                border-radius: 0.08rem;
            }
        }

        .mt10 {
            margin-top: 0.266667rem;
        }

        .yanbao-info{
            .asset-detail-tit {
                margin-top: 0.24rem;
            }
            .asset-detail-pp {
                color: #ff4b46;
                margin-top: 0.133333rem;
            }
            .highest-offer-box {
                font-size: 0.293333rem;
                height: 0.426667rem;
                line-height: 0.426667rem;
                text-align: center;
                background: #ff4b46;
                color: #fff;
                display: inline-block;
                border-radius: 0.08rem;
                padding: 0.026667rem 0.16rem;
                margin-left: 0.133333rem;
            }
            .yanbao-guarantee {
                font-size: 0.346667rem;
                color: #777;
                display: inline-block;
                margin-top: 0.08rem;
            }
            .yanbao-guarantee:before {
                content: '';
                width: 0.32rem;
                height: 0.32rem;
                background: url(//img.dev.gomegj.com/guanjia/v2/ybb.png) no-repeat left .01rem;
                background-size: 100%;
                display: inline-block;
                margin-right: 0.08rem;
                margin-top: 0.08rem;
            }
            .yanbao-s-num {
                font-size: 0.346667rem;
                color: #777;
                position: absolute;
                right: 0.32rem;
                top: 1.386667rem;
            }
            
        } 
        .yanbao-other-info {
            background: #fff;
            .yanbao-pay-type {
                line-height: 1.173333rem;
                border-bottom: 1px solid #e9e9e9;
                font-size: 0.373333rem;
                overflow: hidden;
                padding: 0 0.32rem;
                .tit {
                    color: #777;
                }
                .type {
                    float: right;
                }
            }
            .yanbao-invoice-info {
                padding: 0 0.32rem 0.426667rem;
                margin-bottom: 0.266667rem;
                .tit {
                    font-size: 0.373333rem;
                    margin-top: 0.133333rem;
                    line-height: 0.986667rem;
                }
                .invoice-check-list {
                    overflow: hidden;
                    li {
                        width: 2.8rem;
                        height: 0.72rem;
                        line-height: 0.72rem;
                        text-align: center;
                        font-size: 0.373333rem;
                        border: 1px solid #e3e3e3;
                        float: left;
                        margin-right: 0.266667rem;
                        border-radius: 0.08rem;
                    }
                    li.checked {
                        color: #ff4b46;
                        border: 1px solid #ff4b46;
                    }
                }
                .mt10 {
                    margin-top: 0.266667rem;
                     p {
                        font-size: 0.32rem;
                        line-height: 0.533333rem;
                        color: #777;
                    }
                }
            }
        }
        .contract-item {
                margin-top: 0.4rem;
                margin-bottom: 0.4rem;
                font-size: 0;
                padding: 0 0.32rem;
                .invoice-ele-msg {
                    font-size: 0.266667rem;
                    color: #b1b1b1;
                    padding-bottom: 0.266667rem;
                }
                .contract-icon {
                    width: 0.426667rem;
                    height: 0.426667rem;
                    margin-right: 0.266667rem;
                    background: url(//img.dev.gomegj.com/guanjia/v2/choose1.png) no-repeat center center;
                    background-size: 100%;
                }
                .contract-icon.checked {
                    background: url(//img.dev.gomegj.com/guanjia/v2/choose1_active.png) no-repeat center center;
                    background-size: 100%;
                }
                .contract-link {
                    font-size: 0.32rem;
                    color: #337bf6;
                    text-decoration: underline;
                }
                .dline {
                    display: inline-block;
                    vertical-align: middle;
                }
            }
       

    }

    .yanbao-footer {
        width: 100%;
        height: 1.306667rem;
        line-height: 1.306667rem;
        background: #fff;
        border-top: 1px solid #e3e3e3;
        position: fixed;
        left: 0;
        bottom: 0;
        overflow: hidden;
        .yanbao-total-price {
            display: inline-block;
            padding-left: 0.32rem;
            .text {
                font-size: 0.373333rem;
            }
            .delePrice {
                font-size: 0.266667rem;
                color: #888;
                vertical-align: middle;
                text-decoration: line-through;
            }
            .icon {
                font-size: 0.32rem;
                color: #ff4b46;
                vertical-align: middle;
            }
            .price {
                font-size: 0.48rem;
                color: #ff4b46;
                font-weight: 600;
            }
        }
        .yanbao-submit-order {
            width: 32%;
            height: 1.306667rem;
            background: #ff4b46;
            line-height: 1.306667rem;
            text-align: center;
            font-size: 0.48rem;
            color: #fff;
            display: inline-block;
            float: right;
        }
    }

    #invoice {
        z-index:1001;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        .header1 {
            color: #333;
            font-size: 0.48rem;
            text-align: center;
            line-height: 1.12rem;
            border-bottom: 1px solid #e3e3e3;
            background-color: #f8f8f8;
            position: relative;
            display:block;
            .goBack {
                width: 1.066667rem;
                height:100%;
                position: absolute;
                top: 0;
                left: 0;
                .i-return {
                    position: absolute;
                    top: 50%;
                    margin-top: -0.213333rem;
                    border: 1px solid #666;
                    border-right-color: transparent;
                    border-top-color: transparent;
                    -webkit-transform: rotate(45deg);
                    transform: rotate(45deg);
                    width: 0.373333rem;
                    height: 0.373333rem;
                }
            }
            .title {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                max-width: 70%;
                margin: 0 auto;
                display: block;
            }
        }
        .container {
            width: 100%;
            min-width: 320px;
            background-color: #f5f5f5;
            overflow-x: hidden;
            overflow-y: auto;
            position: absolute;
            top: 1.12rem;
            -webkit-overflow-scrolling: touch;
            bottom: 1.333333rem;
            .blk2 {
                background-color: #fff;
                padding-left: 0.32rem;
                padding-right: 0.32rem;
                overflow: hidden;
                .invoice-tit {
                    height: 1.12rem;
                    line-height: 1.12rem;
                    font-size: 0.373333rem;
                    color: #777;
                }
                .oh {
                    overflow: hidden;
                    .invoice-type {
                        position: relative;
                        height: 0.906667rem;
                        line-height: 0.906667rem;
                        text-align: center;
                        font-size: 0.373333rem;
                        padding: 0 0.666667rem;
                        border: 1px solid #ff4b46;
                        border-radius: 0.133333rem;
                        float: left;
                        .check-icon {
                            width: 0.533333rem;
                            height: 0.533333rem;
                            background: url(//img.dev.gomegj.com/guanjia/v2/ybcheck.png) no-repeat;
                            background-size: 100%;
                            position: absolute;
                            left: 0;
                            top: 0;
                        }
                    }
                    .invoice-msg {
                        padding: 0.4rem 0;
                        color: #ccc;
                        font-size: 0.32rem;
                        clear: both;
                    }
                }
                
                .info-check-box {
                    padding: 0.16rem 0 0.133333rem;
                    .info-check-item {
                        margin-bottom: 0.266667rem;
                        height: 0.933333rem;
                        position: relative;
                        display: -webkit-box;
                        display: -ms-flexbox;
                        display: flex;
                        cursor: pointer;
                        .info-check-left {
                            height: 0.933333rem;
                            line-height: 0.933333rem;
                            font-size: 0;
                            position: relative;
                            left: 0;
                            top: 0;
                            display: inline-block;
                            -webkit-box-flex: 0;
                            -ms-flex: none;
                            flex: none;
                            
                        }
                        .info-check-input-box {
                            display: inline-block;
                            position: relative;
                            -webkit-box-flex: 1;
                            -ms-flex: 1;
                            flex: 1;
                            margin-left: 0.266667rem;
                            .info-check-input {
                                width: 88%;
                                height: 0.88rem;
                                line-height: .88rem;
                                border: 1px solid #e3e3e3;
                                padding: 0 10% 0 2%;
                                border-radius: 0.08rem;
                                font-family: "Microsoft YaHei",Arial,Helvetica,sans-serif;
                                -webkit-appearance: none;
                                outline: 0;
                                resize: none;
                                font-size: .373333rem;
                            }
                        }
                        .info-check-icon {
                                width: 0.426667rem;
                                height: 0.426667rem;
                                background: url(//img.dev.gomegj.com/guanjia/v2/check.png) no-repeat;
                                background-size: 100%;
                                display: inline-block;
                                vertical-align: middle;
                                margin-right: 0.266667rem;
                        }
                            
                        .info-check-text {
                            font-size: 0.373333rem;
                            display: inline-block;
                            vertical-align: middle;
                        }
                    }
                    .checked .info-check-icon {
                        background: url(//img.dev.gomegj.com/guanjia/v2/checked.png) no-repeat;
                        background-size: 100%;
                    }
                }
                
            }
            .bcf {
                background-color: #fff;
                .list-labelvalue {
                    line-height: 1.173333rem;
                    background-color: #fff;
                    padding-left: 0.32rem;
                    padding-right: 0.32rem;
                    li:not(:last-child) {
                        border-bottom: 1px solid rgba(227,227,227,.4);
                    }
                    li {
                        display: -webkit-box;
                        display: -ms-flexbox;
                        display: flex;
                        position: relative;
                        overflow: hidden;
                    }
                    label {
                        font-size: 0.373333rem;
                        color: #777;
                        -webkit-box-flex: 0;
                        -ms-flex: none;
                        flex: none;
                        display: inline-block;
                        position: relative;
                    }
                    input {
                        font-size: .373333rem;
                      
                        height: 1.173333rem;
                        line-height: 1.173333rem;
                   
                        border-style: none;
                        width: auto;
                        float: none;
                        text-align: left;
                        -webkit-box-flex: 1;
                        -ms-flex: 1;
                        flex: 1;
                    }
                }
            }
            .mt10 {
                margin-top: 0.266667rem;
            }
        }
        .invoice-footer {
            width: 100%;
            height: 1.333333rem;
            line-height: 1.333333rem;
            text-align: center;
            color: #fff;
            background: #ff4b46;
            font-size: 0.48rem;
            position: absolute;
            left: 0;
            bottom: 0;
        }
        .invoice-footer.disabled {
            background: #e0e0e0;
        }
    }

    #payContract {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1001;
        width: 100%;
        height: 100%;
        background: #f5f5f5;
        .header {
            color: #333;
            font-size: 0.48rem;
            text-align: center;
            line-height: 1.12rem;
            border-bottom: 1px solid #e3e3e3;
            background-color: #f8f8f8;
            position: relative;
            display:block;
            .js-t-close {
                width: 1.066667rem;
                height:100%;
                position: absolute;
                top: 0;
                left: 0;
                .i-return {
                    position: absolute;
                    top: 50%;
                    margin-top: -0.213333rem;
                    border: 1px solid #666;
                    border-right-color: transparent;
                    border-top-color: transparent;
                    -webkit-transform: rotate(45deg);
                    transform: rotate(45deg);
                    width: 0.373333rem;
                    height: 0.373333rem;
                }
            }
            .title {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                max-width: 70%;
                margin: 0 auto;
                display: block;
            }
        }
        .container {
            width: 100%;
            min-width: 320px;
            background-color: #f5f5f5;
            overflow-x: hidden;
            overflow-y: auto;
            position: absolute;
            top: 1.146667rem;
            bottom: 0;
            -webkit-overflow-scrolling: touch;
            div{
                padding: 0 0.32rem;
                font-size: 0.373333rem;
                line-height: 0.533333rem;
            }
        }
    }



</style>