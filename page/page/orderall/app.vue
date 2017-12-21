<template>
    <div id="orderall" class="wapper">
        <!-- 遮罩层 -->
        <transition name="slide-fade">
            <div class="orderzz" @click="fnOrderzz" v-show="orderzzTF">
                <ul class="clearfix" @click.stop>
                    <li class="float_l" :class="{action:i == odtypeIndex}" v-for="(v,i) in orderClass" @click="fnOdtype(v.odtype,i,v.orderName)">{{ v.orderName }}</li>
                </ul>
            </div>
        </transition>
        <!-- 遮罩层 -->
        <!-- 预约时间 -->
        <transition name="slide-fade">
            <div class="date-time" @click="fnDateTimeTF" v-show="dateTimeTF">
                <div class="date-time-vessel" @click.stop>
                    <span class="date-time-x" @click="fnDateTimeTF"></span>
                    <h3>预约安装</h3>
                    <div class="date-time-week">
                        <ul class="clearfix" v-slide>
                            <li class="float_l " :class="{action : i == weekIndex,disabled : v.date == '约满'}" v-for="(v,i) in dateTimeSlotAll[0].aznlVoList" @click="fnWeek(i,v.date)">
                                <p>{{ v.azsj | gvDateToUnix(true) }}</p>
                                <p>{{ v.azsj | gvDateToUnix(false) }}</p>
                                <span v-show="i == weekIndex"></span>
                            </li>
                        </ul>
                    </div>
                    <ul class="clearfix date-time-timeSlot">
                        <li class="float_l" v-for="(v,i) in nlsdVoAll.nlsdVoList" @click="fnDateTimeSlot(i,v.nlsdqs,v.nlsdjz,v.wdnlid)">{{ v.nlsdqs }}-{{ v.nlsdjz }}<span v-show="dateTimeSlotIndex == i"></span></li>
                    </ul>
                    <p class="date-time-phone">也可拨打预约安装电话：400-265-7895&nbsp;010-87456321</p>
                    <div class="date-time-save" @click="fnDateTimeSave">确认</div>
                </div>
            </div>
        </transition>
        <!-- 预约时间 -->
        <!-- 头部导航 -->
        <!-- <div class="header">
            <header>
                <a @click="fnGetBack"></a>
                <span @click="fnTitle">{{ title }}<i v-show="odcate == 0"></i></span>
            </header>
        </div> -->
        <!-- 头部导航 -->
        <!-- 公共头部 -->
        <header-component :title="title"></header-component>
        <div class="discuss-list-tab" v-show="odcate == 0">
          <a  :class="{active:i == odtypeIndex}" v-for="(v,i) in orderClass" @click="fnOdtype(v.odtype,i,v.orderName)"><span>{{ v.orderName }}</span></a>
        </div>
        <!-- 订单列表 -->
        <div class="container iscrollpading" @click="fnBody" :class="{container2:odcate != 0}" v-show="orderAll.length">
            <div class="orderlist iscrollpading-list">
                <div class="li" v-for="(v,i) in orderAll" @click="fnOrderDetail(v.oid,v.sotp,v.ocrt,v.shippingGroupId)">
                    <!-- 保内外标识 -->
                    <div class="inWarranty bdr-bottom" v-show="odcate == 303">
                        <span class="float_l" :class="{s1:v.gdls[0].inWarranty}">{{ v.gdls[0].inWarranty | gvInWarranty2 }}</span>
                        <span class="float_r s2">购买时间：{{ v.ocrt | gvTim }}</span>
                    </div>
                    <!-- 保内外标识 -->
                    <!-- 门店信息、状态 -->
                    <div class="shop-info clearfix">
                        <span class="shop-info_l float_l" v-if="v.soName">{{ v.soName }}</span>
                        <span class="shop-info_l float_l" v-else>国美管家</span>
                        <span class="shop-info_r float_r" v-if="v.sotp == 201 || v.sotp == 202">{{ orderstate.zt[v.ostid] }}</span>
                        <span class="shop-info_r float_r" v-else-if="v.sotp == 10485761">{{ orderstate.sw[v.ostid] }}</span>
                        <span class="shop-info_r float_r" v-else-if="v.sotp == 8388608">{{ orderstate.dzsg[v.ostid] }}</span>
                        <span class="shop-info_r float_r" v-else>{{ orderstate[v.ostid] }}</span>
                    </div>
                    <!-- 门店信息、状态 -->
                    <!-- 配送信息 -->
                    <div class="logistics clearfix" v-show="v.stInfo"  @click.stop="fnOrderLv(v.oid,v.shippingGroupId,v.ocrt,v.sotp,v.servant)">
                        <img src="//gfs11.gomein.net.cn/T1rgLvB7Dv1RCvBVdK.png" alt="" class="float_l">
                        <div class="float_r bdr-top">
                            <p class="logistics_t">{{ v.stInfo }}</p>
                            <p class="logistics_b">{{ v.ocrt | gvTime }}</p>
                        </div>
                        <span></span>
                    </div>
                    <!-- 配送信息 -->
                    <!-- 中台推送线上，门店订单信息 -->
                    <div class="order-info" v-if="v.sotp == 201 || v.sotp == 202">
                        <div class="clearfix order-info-d1" v-for="(v2,i2) in v.gdls">
                            <div class="float_l orderImg">
                                <img :src="v2.imgs" alt="">
                                <span v-show="v2.gdType == 0"></span>
                            </div>
                            <div class="float_l order-info-d2">
                                <p class="order-info_t">{{ v2.gdnm }}</p>
                                <p class="order-info_b" v-show="v2.canBookInst == 1 || v2.canBookInst == 2">安装: {{ v2.atitcts | gvWeek }}</p>
                            </div>
                            <!-- 售后服务 -->
                            <span class="order-sale" v-show="v.ostid == 'NO_PENDING_ACTION' || v.ostid == 'PENDING_INSTALL' ||  v.ostid == 'INSTALLING' || v.ostid == 'COMPLETE_INSTALL' || v.ostid == 'COMPLETE_DELIVERY'  && i2 == 0 " @click.stop="fnOrderSale(i,i2,v.oid,v.shippingGroupId,v.sotp,v2.gdid,v2.gdBrandId,v2.gdCateId,v2.gdnm,v2.gdModel)">
                                售后服务
                                 <transition name="slide-fade">
                                    <div v-show="v2.shTF">
                                        <i></i>
                                        <ul>
                                            <!-- 等待配送，已出库，等待配送 -->
                                            <!-- <li @click.stop="fnCd(v.oid,v.sotp)" v-show="v2.canRemindOrd"><span>催单</span></li> -->
                                            <!-- 报维修 -->
                                            <li @click.stop="fnRepair(v.ocrt,v2.gdid,v2.gdBrandId,v2.gdCateId,v2.gdModel,v2.gdnm,v2.gdnu,v.amount)" v-show="butJudge.isRepair"><span class="">维修</span></li>
                                            <!-- 报回收 -->
                                            <li @click.stop="fnRecycle(v2.gdid,v2.gdBrandId,v2.gdCateId,v2.gdModel,v2.gdnm)" v-show="butJudge.isRecovery"><span>回收</span></li>
                                            <!-- 说明书 -->
                                            <li @click.stop="fnDirection(v2.gdnm)" v-show="butJudge.isInstructions"><span>说明书</span></li>
                                            <!-- 电子发票 -->
                                            <li @click.stop="fnDzfp" v-show="invoiceNoData.invoiceNo"><span>电子发票</span></li>
                                            <!-- 报清洗 -->
                                            <li @click.stop="fnClean(v2.gdCateId)" v-show="butJudge.isClean"><span>清洗</span></li>
                                        </ul>
                                    </div>
                                </transition>
                            </span>
                            <!-- 售后服务 -->
                            <!-- 修改预约安装时间 -->
                            <span class="order-time" @click.stop="fnGetTimed(i,i2,v2.canBookInst,v.oid,v.shippingGroupId,v.sotp,v2.gdid,v2.gdBrandId,v2.gdCateId,v2.gdnm,v2.gdModel,v.ocrt)" v-show="v2.canBookInst != 0">{{ v2.canBookInst | gvAnText }}</span>
                            <!-- 修改预约安装时间 -->
                        </div>
                    </div>
                    <!-- 中台推送线上，门店订单信息 -->
                    <!-- 充值订单信息 -->
                    <div class="order-info" v-else-if="v.sotp == 10485760">
                        <div class="clearfix order-info-d1" v-for="(v2,i2) in v.gdls">
                            <div class="float_l orderImg">
                                <img src="//gfs13.gomein.net.cn/T1wIL_BCAT1RCvBVdK.png" alt="">
                            </div>
                            <div class="float_r order-info-yb">
                                <p class="order-info-yb-p1">{{ orderTypeName[v.sotp] }}</p>
                                <p class="clearfix order-info-yb-p2">
                                    <span class="float_l s1">手机号码:&nbsp;{{ v2.serviceDesc }}</span>
                                </p>
                                <p class="clearfix order-info-yb-p3">充值面额:&nbsp;{{ v.amount/100 }}元</p>
                            </div>
                        </div>
                    </div>
                    <!-- 充值订单信息 -->
                    <!-- 维修订单信息 -->
                    <div class="order-info" v-else-if="v.sotp == 4194305">
                        <div class="clearfix order-info-d1" v-for="(v2,i2) in v.gdls">
                            <div class="float_l orderImg">
                                <img :src="v2.imgs" alt="">
                            </div>
                            <div class="float_r order-info-yb">
                                <p class="order-info-yb-p1">{{ orderTypeName[v.sotp] }}</p>
                                <p class="clearfix order-info-yb-p2">
                                    <span class="float_l s1">{{ v2.servcieTitle }}</span>
                                </p>
                                <p class="clearfix order-info-yb-p3">{{ v2.serviceDesc }}</p>
                            </div>
                        </div>
                    </div>
                    <!-- 维修订单信息 -->
                    <!-- 延保清洗订单信息 -->
                    <div class="order-info" v-else>
                        <div class="clearfix order-info-d1" v-for="(v2,i2) in v.gdls">
                            <div class="float_l orderImg">
                                <img src="//gfs10.gomein.net.cn/T1FZDgB5xT1RCvBVdK.png" alt="" v-if="v.sotp == 6291456">
                                <img :src="v2.imgs" alt="" v-else>
                            </div>
                            <div class="float_r order-info-yb">
                                <p class="order-info-yb-p1">{{ orderTypeName[v.sotp] }}</p>
                                <p class="clearfix order-info-yb-p2">
                                    <span class="float_l s1">{{ v2.servcieTitle }}</span>
                                    <span class="float_r s2">x{{ v2.gdnu }}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <!-- 延保清洗订单信息 -->
                    <!-- 等按钮 -->
                    <ul class="order-button clearfix">
                        <!-- 确认收货 -->
                        <li class="float_r action" @click.stop="fnQrsh(v.oid,v.sotp,v.shippingGroupId,i)" v-show="v.confirmFlag == 1">{{ v.confirmFlag | gvConfirmFlag }}</li>
                        <!-- 支付 -->
                        <li class="float_r action" v-show="v.ostid == 1 || v.ostid == 33 && v.sotp != 201 && v.sotp != 202 && v.sotp != 4194307" @click.stop="fnPay(v.oid,v.ocrt,v.sotp)">支付</li>
                        <!-- 评论 -->
                        <li class="float_r action" v-show="v.gdls[0].canApprise || v.ostid == 4 || v.ostid == 34 || v.ostid == 355 || v.ostid == 388" @click.stop="fnComment(v.oid,v.sotp,v.gdls[0].gdid,v.shippingGroupId)">评论</li>
                        <!-- 查看物流 -->
                        <li class="float_r"  v-show="v.ostid == 'PROCESSING' || v.ostid == 'PENDING_SHIPMENT' || v.ostid == 'PENDING_MERCHANT_ACTION' || v.ostid == 'FAILED' || v.ostid == 'NO_PENDING_ACTION' || v.ostid == 'DELIVERY' || v.ostid == 'PENDING_ORDER_CONFIRM'" @click.stop="fnOrderLv(v.oid,v.shippingGroupId,v.ocrt,v.sotp,v.servant)">查看物流</li>
                        <!-- 取消 -->
                        <li class="float_r" v-show="v.stop == 6291456" @click.stop="fnCancel">取消</li>
                        <!-- 催单 -->
                        <li class="float_r"  @click.stop="fnCd(v.oid,v.sotp,i)" v-show="v.gdls[0].canRemindOrd && odcate == 302">{{ v.gdls[0].canRemindOrd | gvCd }}</li>
                        <!-- 申请维修 -->
                        <li class="float_r" @click.stop="fnSqwx(v.oid,v.shippingGroupId,v.sotp,v.ocrt,v.gdls[0].gdid,v.gdls[0].gdBrandId,v.gdls[0].gdCateId,v.gdls[0].gdnm,v.gdls[0].gdModel,v.gdls[0].gdnu,v.amount)" v-show="odcate == 303">{{ v.gdls[0].inWarranty | gvInWarranty }}</li>
                    </ul>
                    <!-- 等按钮 -->
                </div>
                <!-- <span class="iscrollpading-pulltext"></span> -->
            </div>
        </div>
        <!-- 没有订单 -->
        <div class="noOrder" v-show="noOrderTF">
            <img src="//gfs12.gomein.net.cn/T1R3Z_BmbT1RCvBVdK.png" alt="">
            <p>您还没有相关订单哦~</p>
        </div>
        <!-- 没有订单 -->
        <!-- 订单列表 -->
    </div>
</template>

<script type='text/ecmascript-6'>
    import headerComponent from '../../components/HeaderComponent'
    var root = window || {},
         util = root.util || {};

    export default {
        data() {
            return {
                yytime:null,
                // 判断是否有订单
                noOrderTF:null,
                butJudge: {
                    "isRepair": null,
                    "isRecovery": null,
                    "isClean": null,
                    "isInstructions": null,
                    "repairType": null,
                    "gid": null,
                    "did": null,
                    "goods": {
                        "dqGoodsId": null,
                        "dqGoodsName": null,
                        "gjGoodsId": null,
                        "gjGoodsName": null,
                        "zxGoodsId": null,
                        "zxGoodsName": null,
                        "model": null,
                        "dqBrandId": null,
                        "dqCateId": null,
                        "gjBrandId": null,
                        "gjCateId": null,
                        "zxBrandId": null,
                        "zxCateId": null
                    },
                    "scope": null
                },
                // 电子发票id
                invoiceNoData:{
                    orderId:null,
                    orderType:null,
                    ordersource:null,
                    invoiceNo:null
                },
                // 选择预约时间遮罩层
                dateTimeTF:false,
                // 选择预约时间传递的index
                dateTimeIndex:{
                    i:null,
                    i2:null
                },
                // 初始化预约时间日期
                dateTimeWeek:[],
                // 预约时间段集合
                dateTimeSlotAll:[{
                    aznlVoList:[{
                        nlsdVoList:[{
                            nlsdqs:null,
                            nlsdjz:null
                        }]
                    }]
                }],
                // 可预约时间段
                nlsdVoAll:{
                    azsj:null,
                    nlsdVoList:[{
                        nlsdqs:null,
                        nlsdjz:null
                    }]
                },
                // 储存选择的时间段
                nlsdqs:'',
                nlsdjz:'',
                // 预约时间段选中状态
                dateTimeSlotIndex:0,
                // 安装能力查询参数
                queryAznlListDate:{
                    // 四级地址代码
                    "dzqydm":null,
                    "goodsInfoList":[{
                        // 安装时间
                        "azsj":null,
                        // 配送单号
                        "itemId":null,
                        // 商品品牌id
                        "ppb01":null,
                        // 商品数量
                        "quantity":null,
                        // 商品id
                        "spbm":null,
                        // 商品品类id
                        "spfl01":null
                    }],
                    // 外部系统编号
                    "wbxtbh":null,
                    // 销售公司类型
                    "xslx":null
                },
                // 查询安装参数接口返回
                queryAznlListParam:{
                    "dzqydm":null,
                    "azwd":null,
                    "queryType":null,
                    "wbxtbh":null,
                    "xsgsdm":null,
                    "xslx":null,
                    "items":[
                        {
                            "shippingGroupId":null,
                            "quantity":null,
                            "partNum":null,
                            "categoryId":null,
                            "brandId":null
                        }
                    ]
                },
                // 安装能力解锁
                azLockDate:{
                    // 订单类型
                    "orderTypeCode":null,
                    "requestModel":{
                        // 订单号
                        "orderId":null,
                        // 配送单号
                        "shippingGroupId":null,
                        // 销售公司类型
                        "xslx":null,
                        // 四级地址代码
                        "dzqydm":null,
                        // 安装网点
                        "azwd":null,
                        // 外部系统编号
                        "wbxtbh":null,
                        // 商品数量
                        "quantity":null,
                        // 网点能力id
                        "wdnlid":null,
                        // 集团商品编码
                        "partNum":null,
                        // 售后公司
                        "gsxx":null,
                        // 商品品类
                        "categoryId":null,
                        // 商品品牌
                        "brandId":null,
                        // 安装区域
                        "khdq":null,
                        // 预约安装类型
                        "appointmentInstallType":null,
                        // 预约安装时间
                        "appointmentInstallTime":null,
                        //  预约安装开始时间
                        "appointmentInstallStartTime":null,
                        // 预约安装结束时间
                        "appointmentInstallEndTime":null
                    }
                },
                // 当前页码
                curpg:1,
                // 每一页展示多少条数据
                len:30,
                // 总条目数
                tpage:0,
                // 分页对象
                iscrollPaging:null,
                // 修改日期选中状态
                weekIndex:0,
                title:'全部订单',
                // 订单分类标识
                odcate:0,
                // 订单类型
                odtype:0,
                // 订单类型
                odtype:0,
                orderzzTF:false,
                odtypeIndex:0,
                // 全部订单集合
                orderAll:[],
                rodNameArr:{
                    0:'全部订单',
                    2:'待支付订单',
                    302:'可催单订单',
                    11:'查物流订单',
                    301:'查安装订单',
                    303:'维修申请订单'
                },
                // 订单类型分类
                orderClass:[{
                    'orderName':'全部订单',
                    'odtype':0
                },{
                    'orderName':'服务订单',
                    'odtype':100
                },{
                    'orderName':'实物订单',
                    'odtype':200
                }],
                // 管家订单订单服务名称
                orderTypeName:{
                    4194305:'维修服务',
                    4194307:'回收服务',
                    4194306:'清洗服务',
                    4194308:'安装服务',
                    6291456:'延保售后',
                    8388608:'大中闪购',
                    10485760:'话费充值',
                    10485761:'标准化平台'
                },
                // 订单状态
                 orderstate: {
                    // 中台订单状态
                    zt:{
                        "INITIAL": "待付款",
                        "PROCESSING": "待出库",
                        "PENDING_SHIPMENT": "待出库",
                        "PENDING_MERCHANT_ACTION": "待出库",
                        "FAILED": "待出库",
                        "PENDING_REMOVE": "等待取消",
                        "REMOVED": "已取消",
                        "NO_PENDING_ACTION":"已妥投",
                        "DELIVERY": "配送中",
                        "PENDING_ORDER_CONFIRM": "配送中",
                        "REJECT_BACK": "已拒收",
                        "REJECT": "已拒收",
                        "PAUSED": "",
                        "ERROR": "",
                        "PENDING_GIFT_BACK": "等待赠品收回",
                        "PENDING_POST_PROCESS": "待付款",
                        "PENDING_FINAL_PAYMENT": "待支付尾款",
                        "DEPOSIT_PAYMENT": "定金已支付",
                        "PENDING_SPELL_GROUP": "等待拼团",
                        "PENDING_DEPOSIT_PAYMENT": "待支付定金",
                        "PENDING_PAYMENT":"待付款",
                        "PENDING_SUBMITTED":"待出库",
                        "PENDING_GOODS_IN_STORAGE":"等待商品入库",
                        // 安装相关状态
                        "PENDING_INSTALL": "待派工",
                        "INSTALLING": "安装中",
                        "COMPLETE_INSTALL": "安装完成",
                        "COMPLETE_DELIVERY": "已完成",
                        "CHANGE_PROFILE_ID": "代客下单"
                    },
                     // 线上实物订单状态
                     sw: {
                         1: '待支付',
                         2: '待发货',
                         4: '已妥投',
                         5: '订单失败',
                         8: '申请退款',
                         9: '已发货',
                         10: '退款成功',
                         11: '退款失败',
                         12: '订单成功'
                     },
                     // 大中闪购订单
                     dzsg:{
                        1: "待付款",
                        2: "下单成功",
                        4: "妥投完成",
                        5: "已取消",
                        6: "妥投失败",
                        7: "妥投失败",
                        8: "退款",
                        9: "已发货",
                        10: "退款完成",
                        11: "退款失败",
                        12: "退款中",
                        13: "退款失败",
                        14: "退款成功",
                        15: "退款中"
                     },
                     //延保订单状态
                     1: '待付款',
                     2: '投保成功',
                     3: '投保成功',
                     4: '投保成功',
                     5: '已取消',
                     6: '投保成功',
                     7: '投保失败',
                     //延保订单已支付不显示状态
                     99: '',
                     //延保订单状态
                     33: '待付款',
                     34: '支付成功',
                     35: '待预约',
                     36: '预约成功',
                     37: '交易失败',
                     65: '审核通过',
                     66: '下单成功',
                     97: '待评论',
                     98: '',
                     353: '待派工',
                     354: '已派工',
                     355: '已完成',
                     356: '无法完成',
                     385: '已出库',
                     386: '延迟派送',
                     387: '预约无法执行',
                     388: '已妥投',
                     389: '已拒收',
                     //虚拟充值
                     1600: '订单失败',
                     1500: '订单失败',
                     1100: '订单失败',
                     1200: '充值中',
                     1300: '充值中',
                     1400: '订单成功',
                     700: '支付成功',
                     4600: '退款失败',
                     5000: '退款成功',
                     4000: '退款中',
                     4320: '退款中', //退款审核不通过
                     4400: '退款中' //退款审核通过
                    //虚拟充值
                 },
                 msg: {
                     m1: '订单取消后，本单可享用的优惠可能会一并取消，是否继续？'
                 }
            }
        },
        methods:{
            // 跳转订单履历页
            fnOrderLv(oid,shippingGroupId,ocrt,sotp) {
                if (sotp == 201 || sotp == 202) {
                    // 跳中台轨迹
                    util.href('ordertrack.html',{
                        oid:oid,
                        shippingGroupId:shippingGroupId,
                        dodt:ocrt,
                        odtype:sotp,
                        resumeType:1
                    })
                }else{
                    // 跳管家轨迹
                    util.href('ordertrackgj.html',{
                        oid:oid,
                        odtype:odtype,
                        dodt:ocrt,
                    })
                };
            },
            // 跳转订单详情页
            fnOrderDetail(oid,sotp,ocrt,shippingGroupId) {
                if (sotp == 201 || sotp == 202) {
                    // 中台订单
                    util.href('ordersztdetail.html',{
                        // 订单id
                        oid:oid,
                        // 订单类型
                        odtype:sotp,
                        // 下单时间
                        dodt:ocrt,
                        // 配送单号
                        shippingGroupId:shippingGroupId
                    });
                }else{
                    // 管家订单
                    util.href('ordersgjdetail.html',{
                        // 订单id
                        otn:oid,
                        // 下单时间
                        dodt:ocrt,
                        // 订单类型
                        odtype:sotp,
                        isJkxOtn:1
                    });
                };
            },
            // 点击body时
            fnBody() {
                // 关闭所以售后服务选项
                $.each(this.orderAll, function(index,current) {
                    $.each(current.gdls, function(indexs,currents) {
                        currents.shTF = false;
                    });
                })
            },
            // 点击售后服务
            fnOrderSale(i,i2,oid,shippingGroupId,sotp,gdId,gdBrandId,gdCateId,gdnm,gdModel) {
                var _this = this;
                // 判断维修，清洗，回收，电子说明书是否支持
                _this.fnParam(gdId,gdBrandId,gdCateId,gdnm,gdModel);
                // 判断电子发票是否支持
                _this.fnInvoicedetail(oid,sotp);

                $.each(this.orderAll, function(index,current) {
                    $.each(current.gdls, function(indexs,currents) {
                        if (index != i) {
                            currents.shTF = false;
                        };
                    });
                })
                _this.orderAll[i].gdls[i2].shTF = !_this.orderAll[i].gdls[i2].shTF;
            },
            // 点击催单
            fnCd(orderId,orderType,index) {
                var _this = this;
                util.api({
                    surl:'/orderaftersales/yf/reminder',
                    data:{
                        oId:orderId,
                        orType:orderType
                    },
                    type:'get',
                    success:function(response) {
                        var rpco = response.rpco,
                            body = response.body;

                        switch(rpco) {
                            case 200:
                                util.tip(body);
                                // 催单成功，文字变成已催单
                                _this.orderAll[index].gdls[0].canRemindOrd = 2;
                        };
                    }
                })
            },
            //点击维修，跳转到维修选择故障页
            fnRepair(dodt,gdid,gdBrandId,gdCateId,gdModel,gdnm,gdnu,amount) {
                var _this = this;
                util.href('repairsubmitorder.html',{
                    dodt:dodt,
                    gdid:gdid,
                    gdBrandId:gdBrandId,
                    gdCateId:gdCateId,
                    gdModel:gdModel,
                    gdnm:gdnm,
                    gdnu:gdnu,
                    amount:amount
                });
            },
            // 申请维修
            fnSqwx(oid,shippingGroupId,sotp,dodt,gdId,gdBrandId,gdCateId,gdnm,gdModel,gdnu,amount) {
                var _this = this;
                // 判断维修，清洗，回收，电子说明书是否支持
                _this.fnParam(gdId,gdBrandId,gdCateId,gdnm,gdModel);
                if (_this.butJudge.isRepair) {
                    _this.fnRepair(dodt,gdId,gdBrandId,gdCateId,gdModel,gdnm,gdnu,amount);
                }else{
                    util.href('repairindexnew.html');
                };
            },
            //点击回收，跳转到回收选择估计页
            fnRecycle(skuId,brandId,categoryId,model,goodName) {
                var ls = window.localStorage,
                    arcode;

                if(ls.getItem('dstrict') == null){
                    arcode = 110108
                }else{
                    arcode = eval("("+ls.getItem('dstrict')+")").d
                }
                util.api({
                    surl:'/orderaftersales/yf/recovery',
                    data:{
                        skuId:skuId,
                        brandId:brandId,
                        categoryId:categoryId,
                        model:model,
                        goodName:goodName
                    },
                    type:'get',
                    success:function(response) {
                        var rpco = response.rpco,
                            body = response.body;

                        if (rpco == 200 && body.jkxCateId) {
                            util.href('recycleinfo.html',{
                                catename:body.jkxCateName,
                                cateid:body.jkxCateId,
                                brdid:body.jkxBrandId,
                                brdnm:body.jkxBrand,
                                proid:body.jkxRelationId,
                                attrnm:body.jkxRelationName,
                                arcode:arcode
                            });
                        }else{
                            util.href('recycleindexnew.html');
                        };
                    }
                });
            },
            //点击清洗，跳转到清洗商品详情页
            fnClean(categoryId) {
                util.api({
                    surl:'/orderaftersales/yf/clean',
                    data:{
                        categoryId:categoryId
                    },
                    type:'get',
                    success:function(response) {
                        var rpco = response.rpco,
                            body = response.body;
                        if (rpco == 200 && body.jkxParentId) {
                            util.href('cleandetailnew.html',{
                                // 清洗商品编码
                                cgcode:body.jkxParentId
                            });
                        }else{
                            util.href('cleanlistnew.html');
                        };
                    }
                })
            },
            //点击说明书，跳转到说明书首页
            fnDirection(cname) {
                var _this = this;
                util.href('directiondetail.html',{
                    page:1,
                    cateid:null,
                    level:4,
                    docid:_this.butJudge.gid,
                    gdid:_this.butJudge.did,
                    cname:cname
                });
            },
            //点击电子发票，跳转到详情页
            fnInvoicedetail(oid,sotp) {
                var _this = this,
                    ordersource;
                // 订单来源
                if (sotp == 201) {
                    ordersource = 2;
                }else{
                    ordersource = 1;
                };

                util.api({
                    surl:'/einvoice/yf/detail',
                    data:{
                        orderId:oid,
                        orderType:null,
                        ordersource:ordersource,
                        invoiceNo:null
                    },
                    type:'get',
                    success:function(response) {
                        var rpco = response.rpco,
                            body = response.body;

                        if (rpco == 200) {
                            _this.invoiceNoData = {
                                orderId:oid,
                                orderType:sotp,
                                ordersource:ordersource,
                                invoiceNo:body.invoiceNo
                            };
                        };
                    }
                });
            },
            // 售后服务跳电子发票页
            fnDzfp(){
                var _this = this;
                if (_this.invoiceNoData) {
                    util.href('invoicedetail.html',{
                        orderId:_this.invoiceNoData.orderId,
                        orderType:_this.invoiceNoData.orderType,
                        ordersource:_this.invoiceNoData.ordersource,
                        invoiceId:_this.invoiceNoData.invoiceNo
                    });
                };
            },
            // 确认收货
            // orderId 订单id
            // orderType 订单类型
            // shippingGroupId 配送单号
            fnQrsh(orderId,orderTypeCode,shippingGroupId,index) {
                var _this = this;
                util.alert('确认收货',{
                    okBtnText: '确认',
                    cancelBtnText: '取消',
                    justOk: false,
                    okFn: function() {
                        util.api({
                            surl:'/orderaftersales/yf/confirmation',
                            data:{
                                orderId:orderId,
                                orderTypeCode:orderTypeCode,
                                shippingGroupId:shippingGroupId
                            },
                            type:'get',
                            success:function(response) {
                                var rpco = response.rpco,
                                    body = response.body;

                                switch(rpco) {
                                    case 200:
                                        if (body.success) {
                                            util.tip('确认成功');
                                            _this.orderAll[index].confirmFlag = 0;
                                            // window.location.reload();
                                        }else{
                                            util.tip('确认失败');
                                        };
                                }
                            }
                        });
                    }
                })
            },
            // 支付
            fnPay(otn,dodt,odtype) {
                var _this = this;
                // 如果是JKX订单需要转换一下订单id
                if (odtype == 4194305 || odtype == 4194306 || odtype == 4194307) {
                    util.api({
                        surl: root.ORDER_API_PATH + 'jkxGjOid',
                        data:{
                            jkxOid:otn
                        },
                        type:'get',
                        success:function(response) {
                            var rpco = response.rpco,
                                body = response.body;
                            // 请求成功
                            if (rpco == 200) {
                                // 延保订单
                                if (odtype == 10485761) {
                                    util.href('pay.html',{
                                        otn:body,
                                        dodt:dodt,
                                        odtype:odtype,
                                        oddz:1,
                                        isJkxOtn:0,
                                        jkxOid:otn
                                    });
                                // 其他管家订单
                                }else{
                                    util.href('pay.html',{
                                        otn:body,
                                        dodt:dodt,
                                        odtype:odtype,
                                        isJkxOtn:0,
                                        jkxOid:otn
                                    });
                                };
                            };
                        }
                    })
                }else{
                    // 延保订单
                    if (odtype == 10485761) {
                        util.href('pay.html',{
                            otn:otn,
                            dodt:dodt,
                            odtype:odtype,
                            oddz:1,
                            isJkxOtn:0
                        });
                    // 其他管家订单
                    }else{
                        util.href('pay.html',{
                            otn:otn,
                            dodt:dodt,
                            odtype:odtype,
                            isJkxOtn:0
                        });
                    };
                };
            },
            // 评论
            fnComment(otn,odtype,gdsid,spgid) {
                if (odtype == 201 || odtype == 202 || odtype == 8388608 || odtype == 10485761) {
                    util.href('discuss.html',{
                        gdsid:gdsid,
                        spgid:spgid,
                        type:2
                    })
                }else{
                    util.href('discuss.html',{
                        svid:null,
                        otn:otn,
                        type:1
                    })
                };
            },
            // 查看物流
            fnCkwl() {

            },
            // 取消
            fnCancel() {

            },
            // 查询设备参数
            fnParam(gdId,gdBrandId,gdCateId,gdnm,gdModel) {
                var _this = this;

                // 获取安装能力查询参数
                util.api({
                    // surl:'/resources/json/butJudge.json',
                    surl:'/orderaftersales/yf/butJudge',
                    type:'get',
                    async: false,
                    data:{
                        gdId:gdId,
                        gdBrandId:gdBrandId,
                        gdCateId:gdCateId,
                        gdnm:gdnm,
                        gdModel:gdModel
                    },
                    success: function(response) {
                        var rpco = response.rpco,
                            body = response.body;

                        if (!body.resultObj) {
                            _this.butJudge = body;
                        };
                    }
                });
            },
            // 查询安装能力参数
            fnDateWeek(orderId,shippingGroupId,orderTypeCode) {
                var _this = this;
                // 初始化
                _this.queryAznlListDate = {
                    "dzqydm":null,
                    "goodsInfoList":[{
                        "azsj":null,
                        "itemId":null,
                        "ppb01":null,
                        "quantity":null,
                        "spbm":null,
                        "spfl01":null
                    }],
                    "wbxtbh":null,
                    "xslx":null
                };
                // 获取安装能力查询参数
                util.api({
                    // surl:'/resources/json/aznlqueryparam.json',
                    surl:'/orderaftersales/yf/aznlqueryparam',
                    type:'get',
                    async: false,
                    data:{
                        orderId:orderId,
                        shippingGroupId:shippingGroupId,
                        orderTypeCode:orderTypeCode
                    },
                    success: function(response) {
                        var rpco = response.rpco,
                            body = response.body;
                        _this.queryAznlListParam = body.resultObj;
                        // 赋值
                        _this.queryAznlListDate = {
                            "dzqydm":body.resultObj.dzqydm,
                            "goodsInfoList":[{
                                "azsj":_this.yytime,
                                "itemId":shippingGroupId,
                                "ppb01":body.resultObj.items[0].brandId,
                                "quantity":body.resultObj.items[0].quantity,
                                "spbm":body.resultObj.items[0].partNum,
                                "spfl01":body.resultObj.items[0].categoryId
                            }],
                            "wbxtbh":body.resultObj.wbxtbh,
                            "xslx":body.resultObj.xslx
                        };
                    }
                });
            },
            // 日期转时间戳
            fnDateToUnix(el) {
                var str = String(el),
                    arr = str.split('-'),
                    vgetTime = new Date(arr[0],arr[1]-1,arr[2]).getTime();
                // 返回时间
                return vgetTime;
            },
            // 获取预约时间段
            fnGetTimed(i,i2,canBookInst,orderId,shippingGroupId,orderTypeCode,gdId,gdBrandId,gdCateId,gdnm,gdModel,ocrt) {
                var _this = this;

                if (canBookInst == 2){
                    util.href('ordertrack.html',{
                        oid:orderId,
                        shippingGroupId:shippingGroupId,
                        dodt:ocrt,
                        odtype:orderTypeCode,
                        resumeType:1
                    })
                    return;
                }else if( canBookInst == 3){
                    return;
                };
                // 显示预约时间弹出层
                _this.dateTimeTF = true;
                _this.dateTimeIndex = {
                    i:i,
                    i2:i2
                };
                // 查询设备参数
                // _this.fnParam(gdId,gdBrandId,gdCateId,gdnm,gdModel);
                // 查询安装能力参数
                _this.fnDateWeek(orderId,shippingGroupId,orderTypeCode);

                util.api({
                    // surl:'/resources/json/queryAznlList.json',
                    surl:'/orderaftersales/yf/queryAznlList',
                    data:_this.queryAznlListDate,
                    async: false,
                    type:'post',
                    success: function(response) {
                        var rpco = response.rpco,
                            body = response.body;
                        //
                        _this.dateTimeSlotAll = body;
                        // 当天可预约的时间段
                        _this.nlsdVoAll = body[0].aznlVoList[0];
                        // 储蓄初始化的时间段
                        _this.azLockDate = {
                            // 订单类型
                            "orderTypeCode":orderTypeCode,
                            "requestModel":{
                            // 订单号
                            "orderId":orderId,
                            // 配送单号
                            "shippingGroupId":shippingGroupId,
                            // 销售公司类型
                            "xslx":_this.queryAznlListParam.xslx,
                            // 四级地址代码
                            "dzqydm":_this.queryAznlListParam.dzqydm,
                            // 安装网点
                            "azwd":body[0].azwd01,
                            // 外部系统编号
                            "wbxtbh":_this.queryAznlListParam.wbxtbh,
                            // 商品数量
                            "quantity":_this.queryAznlListParam.items[0].quantity,
                            // 网点能力id
                            "wdnlid":_this.nlsdVoAll.nlsdVoList[0].wdnlid,
                            // 集团商品编码
                            "partNum":_this.queryAznlListParam.items[0].partNum,
                            // 售后公司
                            "gsxx":body[0].gsxx01,
                            // 商品品类
                            "categoryId":_this.queryAznlListParam.items[0].categoryId,
                            // 商品品牌
                            "brandId":_this.queryAznlListParam.items[0].brandId,
                            // 安装区域
                            "khdq":body[0].khdq01,
                            // 预约安装类型
                            "appointmentInstallType":0,
                            // 预约安装时间
                            "appointmentInstallTime":_this.fnDateToUnix(_this.nlsdVoAll.azsj),
                            //  预约安装开始时间
                            "appointmentInstallStartTime":_this.nlsdVoAll.nlsdVoList[0].nlsdqs,
                            // 预约安装结束时间
                            "appointmentInstallEndTime":_this.nlsdVoAll.nlsdVoList[0].nlsdjz
                            }
                        };
                        console.log(_this.azLockDate)
                    }
                });
            },
            // 预约时间段选择
            fnDateTimeSlot(index,nlsdqs,nlsdjz,wdnlid) {
                var _this = this;
                _this.dateTimeSlotIndex = index;
                // 储蓄选中的时间段
                _this.azLockDate.requestModel.appointmentInstallStartTime = nlsdqs;
                _this.azLockDate.requestModel.appointmentInstallEndTime = nlsdjz;
                _this.azLockDate.wdnlid = wdnlid;
                console.log(_this.azLockDate.requestModel.appointmentInstallTime)
                // _this.azLockDate.appointmentInstallTime = _this.fnDateToUnix(azsj);
            },
            // 保存修改预约安装时间
            fnDateTimeSave() {
                var _this = this,
                    i = _this.dateTimeIndex.i,
                    i2 = _this.dateTimeIndex.i2;
                util.api({
                    // surl:'/resources/json/azLock.json',
                    surl:'/orderaftersales/yf/azLock',
                    data:_this.azLockDate,
                    type:'post',
                    success:function(response) {
                        var rpco = response.rpco,
                            body = response.body;
                        if (rpco == 200) {
                            if (body.success) {
                                _this.orderAll[i].gdls[i2].atitcts = _this.azLockDate.requestModel.appointmentInstallTime;
                                _this.orderAll[i].gdls[i2].canBookInst = 2;
                                util.tip('预约成功');
                            };
                        };
                    }
                })
                _this.dateTimeTF = false;
            },
            // 关闭预约时间
            fnDateTimeTF() {
                this.dateTimeTF = false;
            },
            // 选择购买日期
            fnWeek(index,date) {
                var _this = this;
                // 初始化预约安装时间段
                if (_this.weekIndex != index) {
                    // 日期选择时，保存第一个时间段
                    _this.nlsdVoAll = _this.dateTimeSlotAll[0].aznlVoList[index];
                    _this.azLockDate.wdnlid = _this.nlsdVoAll.nlsdVoList[0].wdnlid;
                    _this.azLockDate.appointmentInstallStartTime = _this.nlsdVoAll.nlsdVoList[0].nlsdqs;
                    _this.azLockDate.appointmentInstallEndTime = _this.nlsdVoAll.nlsdVoList[0].nlsdjz;
                    _this.azLockDate.requestModel.appointmentInstallTime = _this.fnDateToUnix(_this.nlsdVoAll.azsj);
                    console.log(_this.azLockDate.requestModel.appointmentInstallTime)
                };
                if (date!='约满') {
                    _this.weekIndex = index;
                };
            },
            // 实物、服务订单类型切换
            fnTitle() {
                var orderzzTF = this.orderzzTF;
                // 不是全部订单，没有弹出层
                if(this.odcate != 0) return;
                if (orderzzTF) {
                    this.orderzzTF = false;
                }else{
                    this.orderzzTF = true;
                };
            },
            // 点击遮罩层
            fnOrderzz() {
                this.orderzzTF = false;
            },
            // 点击订单分类
            fnOdtype(odtype,index,orderName,odcate) {
                this.orderzzTF = false;
                if (this.odtypeIndex == index) return;
                this.odtype = odtype;
                this.odtypeIndex = index;
                this.title = orderName;
                // 获取订单列表
                this.orderAll = [];
                this.noOrderTF = null;
                this.fnGetOrderList(this.curpg,this.len,this.odtype,this.odcate);
            },
            // 获取订单列表
            fnGetOrderList(curpg,len,odtype,odcate){
                let _this = this,
                    data = {
                        curpg:_this.curpg,
                        len:_this.len,
                        odtype:_this.odtype,
                        odcate:_this.odcate
                    };
                util.api({
                    // surl:'/resources/json/fuodls.json',
                    surl:root.ORDER_API_PATH + 'fuodls',
                    data:data,
                    type:'get',
                    success:function(response) {
                        // console.log(response)
                        let rpco = response.rpco,
                            body = response.body;

                        switch(rpco) {
                            case 200:
                                // 控制售后服务显示隐藏
                                $.each(body.odlst, function(index,current) {
                                    $.each(current.gdls, function(indexs,currents) {
                                        currents.shTF = false;
                                    });
                                    _this.orderAll.push(current);
                                });
                                _this.noOrderTF = !_this.orderAll.length;
                                 // 创建分页对象
                                 if (!_this.iscrollPaging) {
                                     // 创建
                                     _this.iscrollPaging = new IscrollPaging({
                                         // 总页数
                                         totalPage: body.total/30,
                                         // 每页条数
                                         pageDataCount: _this.len,
                                         // 加载数据方法
                                         loadDataFun: function() {
                                            //
                                            _this.curpg++;
                                            // 查询数据
                                            _this.fnGetOrderList(_this.curpg,_this.len,_this.odtype,_this.odcate);
                                         }
                                     });
                                     _this.$nextTick(function(){
                                         _this.iscrollPaging.init();
                                     })
                                 }
                                 // 加载分页
                                 else {
                                     //
                                     _this.$nextTick(function(){
                                         _this.iscrollPaging.reLoadPagingOption({
                                             // 当前页码
                                             currentPage: _this.curpg,
                                             // 总页数
                                             totalPage: 6
                                         });
                                     })
                                 }
                                break;
                            default:
                                _this.noOrderTF = null;
                        }
                    }
                })
            },
            // 返回上一页
            fnGetBack() {
                util.href("javascript:window.history.back(-1)");
            },

        },
        created() {
            let _this = this,
                odcate = util.getHrefParma().odcate,
                weekNum = {
                    0:'日',
                    1:'一',
                    2:'二',
                    3:'三',
                    4:'四',
                    5:'五',
                    6:'六'
                };
            // 订单分类标识
            this.odcate = odcate;
            // 订单分类名称
            this.title = this.rodNameArr[odcate];
            if (util.isApp()) {
                var param = {
                    title: decodeURI(this.rodNameArr[odcate])
                }
                util.setHeadBar(param);
            };
            // 获取订单列表
            this.fnGetOrderList(this.curpg,this.len,this.odtype,this.odcate);
            // 初始化预约时间日期
            for (var i = 0; i < 7; i++) {
                var time = new Date().getTime(),
                    time = time + (24 * 60 * 60 * 1000) * (i+1),
                    day = util.formateDate(time,'MM月dd日'),
                    week = util.formatWeek(time),
                    timGjson = {
                    week:week,
                    date:day
                };
                this.dateTimeWeek.push(timGjson);
            };
            this.yytime = util.formateDate(new Date().getTime(),'yyyy-MM-dd');
        },
        mounted() {
            this.$nextTick(()=>{
                if (util.isApp()) {
                    $(".wapper .container").addClass("apponly");
                    $(".wapper .discuss-list-tab").css("top", 0);
                }
            });
        },
        filters:{
            // 过滤确认收货
            gvConfirmFlag: function(el) {
                var v;
                if (el == 1) {
                    v = '确认收货';
                };
                return v;
            },
            // 日期转时间戳
            gvDateToUnix: function(el,TF) {
                var v,
                    str = String(el),
                    arr = str.split('-'),
                    vgetTime = new Date(arr[0],arr[1]-1,arr[2]).getTime(),
                    vgetDay = new Date(arr[0],arr[1]-1,arr[2]).getDay(),
                    weekNum = {
                        0:'日',
                        1:'一',
                        2:'二',
                        3:'三',
                        4:'四',
                        5:'五',
                        6:'六'
                    };

                if (!TF) {
                    v = util.formateDate(vgetTime,'MM月dd日');
                }else{
                    v = '周' + weekNum[vgetDay] + ''
                };
                return v;
            },
            // 过滤文案是否免费维修
            gvInWarranty: function(el) {
                var v;
                switch(el) {
                    case 0:
                        v = '申请维修';
                        break;
                    case 1:
                        v= '免费维修';
                        break;
                };
                return v;
            },
            // 过滤文案是否保内外维修
            gvInWarranty2: function(el) {
                var v;
                switch(el) {
                    case 0:
                        v = '保修期外';
                        break;
                    case 1:
                        v= '保修期内';
                        break;
                };
                return v;
            },
            // 过滤催单
            gvCd: function(el) {
                var v;
                switch(el) {
                    case 1:
                        v = '我要催单';
                        break;
                    case 2:
                        v = '已催单';
                        break;
                };
                return v;
            },
            gvTime: function(el) {
                return util.formateDate(el, 'yyyy-MM-dd hh:mm');
            },
            gvTim: function(el) {
                return util.formateDate(el, 'yyyy-MM-dd');
            },
            gvWeek: function(el) {
                var dataTime,
                    weekNum = {
                        0:'日',
                        1:'一',
                        2:'二',
                        3:'三',
                        4:'四',
                        5:'五',
                        6:'六'
                    };
                if (el) {
                    dataTime = util.formateDate(el,'MM月dd日') + ' 周[' + weekNum[new Date(el).getDay()] + ']';
                }else{
                    dataTime = '您还未选择安装时间';
                };
                return dataTime;
            },
            gvAnText: function(el) {
                var gvAnTime;
                if (el == 1) {
                    gvAnTime = '选择时间';
                }else if(el == 2){
                    gvAnTime = '查看';
                }else{
                    gvAnTime = '已预约待确认';
                };
                return gvAnTime;
            }
        },
        directives: {
          slide: {
            // 指令的定义
            inserted: function (el) {
                // 元素left
                var initLeft = 0;
                // 手指按下时
                $(el).on('touchstart',function(e) {
                    // 获取手机在屏幕上的x坐标
                    var startX =e.touches[0].pageX;
                    // 手指滑动时
                    $(el).on('touchmove',function(e) {
                        var startXmove = e.touches[0].pageX,
                            // 元素移动left
                            elementLeft = initLeft + startXmove - startX,
                            // 差值
                            elW = $(el).parent().width() - $(el).width();
                        // 如果元素left > 0，左侧禁止滑动
                        if (elementLeft > 0) {
                            $(this).css({
                                'left':0
                            });
                        // 如果元素left < 差值，右侧禁止滑动
                        }else if(elementLeft < elW){
                             $(this).css({
                                'left': elW
                            });
                        // 正常情况
                        }else{
                             $(this).css({
                                'left': elementLeft
                            });
                        };
                    });
                    // 手指抬起时
                    $(el).on('touchend',function(e) {
                        initLeft = parseInt($(this).css('left'));
                    })
                })
            }
          }
        },
        components: {
            headerComponent
        }
    }
</script>

<style lang="less">
    @import '../../util/fs.less';

    .discuss-list-tab{
        /*margin-top: 1.173333rem;*/
        height:(87/75)*1rem;
        background:#f3f5f7;
        .mixinfont(15px);
        position:fixed;
        top: 1.173333rem;
        left: 0;
        width: 100%;
        z-index: 111;
        a{
            float:left;
            width: 33.3%;
            display: inline-block;
            text-align: center;
            line-height:(82/75)*1rem;
            span{
                padding: 0 .08rem;
                display: inline-block;
            }
        }
    }
    .discuss-list-tab .active span{
      color: #ff4b46;
      border-bottom: (4/75)*1rem solid #ff4b46;
    }
    .discuss-list-tab:after,.discuss-list-top:after{
      position:absolute;
      font-size: 0;
      content: " ";
      clear: both;
      height: 1px;
      width:100%;
      background: #e0e0e0;
      left:0;
      bottom:0;
    }
    body,html{height: 100%};
    #orderall{
        .noOrder{
            padding-top: 2.933333rem;
            img{
                width: 6.4rem;
                margin: 0 auto;
            }
            p{
                font-size:0.426667rem;
                line-height: 0.586667rem;
                color: #333;
                margin-top: 0.773333rem;
                text-align: center;
            }
        }
        /*加载更多插件*/
        .iscrollpading {
            overflow: hidden;
        }
        .iscrollpading-pulltext {
            font-size: .12rem;
            text-align: center;
            width: 100%;
            line-height: 1.173333rem;
            display: block;
        }
        .container {
            width: 10rem;
            background-color: #f5f5f5;
            overflow: hidden;
            position: absolute;
            top: 0;
            bottom: 0;
            -webkit-overflow-scrolling: touch;
        }
        /*加载更多插件*/
        /*过渡显示隐藏*/
        .fade-enter-active, .fade-leave-active {
          transition: opacity .3s
        }
        .fade-enter,.fade-leave-to,.fade-leave-active {
          opacity: 0
        }
        .slide-fade-enter-active {
          transition: all .3s ease;
        }
        .slide-fade-leave-active {
          transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
        }
        .slide-fade-enter, .slide-fade-leave-to, .slide-fade-leave-active  {
          transform: translateX(10px);
          opacity: 0;
        }
        /*遮罩层*/
        .orderzz{
            position: fixed;
            top: 1.173333rem;
            width: 100%;
            height: 100%;
            background:rgba(0,0,0,0.7);
            z-index: 999;
            ul{
                background:#fff;
                padding:0.8rem 0 1.72rem 0.04rem;
                li{
                    width: 2.933333rem;
                    height: 0.933333rem;
                    background: #f3f3f3;
                    border-radius: 0.066667rem;
                    text-align: center;
                    line-height: 0.933333rem;
                    font-size: 0.373333rem;
                    color: #333;
                    margin:0.266667rem 0 0 0.28rem;
                    box-sizing:border-box;
                    cursor: pointer;
                }
                .action{
                    border:1px solid #ff4b46;
                    background:#fff;
                    color: #ff4b46;
                }
            }
        }
        /*遮罩层*/
        /*预约时间*/
        .date-time{
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background:rgba(0,0,0,0.7);
            z-index: 999;
            .date-time-vessel{
                width: 100%;
                background: #fff;
                position: absolute;
                bottom: 0;
                left: 0;
                h3{
                    height: 1.36rem;
                    line-height: 1.36rem;
                    text-align: center;
                    color: #333;
                    font-size: 0.48rem;
                }
                .date-time-x{
                    width: 0.48rem;
                    height: 0.48rem;
                    background:url(//gfs13.gomein.net.cn/T1jhZvBvLT1RCvBVdK.png) no-repeat;
                    background-size:100%;
                    position: absolute;
                    top: 0.133333rem;
                    right: 0.266667rem;
                }
                .date-time-week{
                    overflow: hidden;
                    position: relative;
                    height: 1.566667rem;
                    ul{
                        width: 14.933333rem;
                        height: 1.566667rem;
                        display: flex;
                        text-align: center;
                        color: #333;
                        font-size: 0.32rem;
                        position: absolute;
                        top: 0;
                        left: 0;
                        li{
                            background:#f5f5f5;
                            position: relative;
                            flex:1;
                            height:1.333333rem;
                            p:nth-child(1){
                                margin-top:0.213333rem;
                                line-height: 0.453333rem;
                            };
                            p:nth-child(2){
                                line-height:0.453333rem;
                            }
                            span{
                                position: absolute;
                                left: 0.1rem;
                                bottom: -0.16rem;
                                width: 0;
                                height: 0;
                                color: #fff;
                                text-align: center;
                                border-left: 0.16rem solid transparent;
                                border-right: 0.16rem solid transparent;
                                border-top: 0.16rem solid #FF4B41;
                            }
                        }
                        .action{
                            background: #FF4B41;
                            color: #fff;
                        }
                        .disabled{
                            color: #999;
                        }
                    }
                }
                .date-time-timeSlot{
                    /*width:9.453rem;*/
                    display: inline-block;
                    margin: 0.266667rem 0 0 0.266667rem;
                    text-align: center;
                    line-height: 1.333333rem;
                    border-left: 1px solid #999;
                    li{
                        width: 3.12rem;
                        height: 1.306667rem;
                        border-right: 1px solid #999;
                        border-bottom: 1px solid #999;
                        position: relative;
                        color: #666;
                        span{
                            color: #666;
                            border:1px solid #FF4B41;
                            width: 3.12rem;
                            height: 1.306667rem;
                            position: absolute;
                            top: -1px;
                            left: -1px;
                            z-index: 9999;
                        }
                        .ff9897{
                            border: 1px solid #FF9897;
                        }
                    }
                    li:nth-child(1){
                        border-top: 1px solid #999;
                    }
                    li:nth-child(2){
                        border-top: 1px solid #999;
                    }
                    li:nth-child(3){
                        border-top: 1px solid #999;
                    }
                    .disabled{
                        background: #FFF1F1;
                    }
                }
                .date-time-phone{
                    font-size: 0.32rem;
                    line-height: 0.453333rem;
                    color: #999;
                    text-align: center;
                    margin-top:1.866667rem;
                }
                .date-time-save{
                    text-align: center;
                    height: 1.306667rem;
                    line-height:1.306667rem;
                    color: #fff;
                    font-size: 0.48rem;
                    background: #FF4B41;
                    margin: 0.266667rem 0 0.8rem 0;
                }
            }
        }
        /*预约时间*/
        /*头部*/
        .header{
            width: 100%;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 888;
            header{
                height: 1.173333rem;
                border-bottom: 1px solid #ddd;
                position: relative;
                text-align: center;
                background:#fff;
                a{
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 1.173333rem;
                    height: 100%;
                    background: url(//gfs11.gomein.net.cn/T16MZvBjET1RCvBVdK.png) no-repeat 0.346667rem center;
                    background-size: 0.306667rem 0.573333rem;
                }
                span{
                    display: inline-block;
                    height: 100%;
                    font-size: 0.48rem;
                    line-height: 1.173333rem;
                    color:#333;
                    position: relative;
                    i{
                        width:0.213333rem;
                        height: 0.173333rem;
                        position: absolute;
                        right:-0.493333rem;
                        top:0.493333rem;
                        background: url(//gfs11.gomein.net.cn/T1ZnDvB4YT1RCvBVdK.png) no-repeat;
                        background-size: 100%;
                    }
                }
            }
        }
        /*头部*/
        /*订单列表*/
        .container{
            padding-top: 2.566667rem;
            .orderlist{
                padding-bottom: 1.333333rem;
                .li{
                    margin-bottom:0.266667rem;
                    /*门店信息、状态*/
                    .shop-info{
                        font-size: 0.346667rem;
                        height:1.066667rem;
                        line-height: 1.066667rem;
                        background-color:#fff;
                        .shop-info_l{
                            text-indent: 0.96rem;
                            color: #333;
                            background: url(//gfs13.gomein.net.cn/T1_9WvBgDv1RCvBVdK.png) no-repeat 0.266667rem center;
                            background-size: 0.48rem 0.48rem;
                            width: 8.0rem;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                        }
                        .shop-info_r{
                            color:#FF4B41;
                            margin-right: 0.266667rem;
                        }
                    }
                    /*保内外标识*/
                    .inWarranty{
                        height: 1.173333rem;
                        line-height: 1.173333rem;
                        background: #fff;
                        color: #999;
                        font-size:0.373333rem;
                        padding:0 0.4rem;
                        .s2{
                            color:#FF4B41;
                            font-size: 0.346667rem;
                        }
                        .s1{
                            color:#3AA11A;
                        }
                    }
                    /*配送信息*/
                    .logistics{
                        background:url(//gfs12.gomein.net.cn/T1i9YvBKWQ1RCvBVdK.png) no-repeat 97% center  #fff;
                        background-size: 0.32rem 0.32rem;
                        img{
                            width: 0.48rem;
                            height: 0.48rem;
                            margin:0.533333rem 0 0 0.266667rem;
                        }
                        div{
                            padding-top: 0.32rem;
                            width: 90%;
                            font-size: 0.346667rem;
                            color: #3AA11A;
                            line-height:0.48rem;
                            .logistics_t{
                                width:8.36rem;
                                display: -webkit-box;
                                -webkit-box-orient: vertical;
                                -webkit-line-clamp: 2;
                                overflow: hidden;
                            }
                            .logistics_b{
                                font-size:0.293333rem;
                                color:#999;
                                line-height: 0.32rem;
                                padding:0.053333rem 0 0.24rem 0;
                            }
                        }
                    }
                    /*订单信息*/
                    .order-info{
                        background:#f8f8f8;
                        .order-info-d1{
                            position: relative;
                            .order-sale{
                                position: absolute;
                                top:0.12rem;
                                right:0.266667rem;
                                color: #FF4B41;
                                font-size: 0.346667rem;
                                line-height:0.48rem;
                                div{
                                    position: absolute;
                                    top: 0.7rem;
                                    right: 0;
                                    z-index: 1000;
                                    i{
                                        position: absolute;
                                        right: 0.266667rem;
                                        top: 1px;
                                        width: 0;
                                        height: 0;
                                        color: #fff;
                                        text-align: center;
                                        border-left: 0.16rem solid transparent;
                                        border-right: 0.16rem solid transparent;
                                        border-bottom: 0.16rem solid #4A4848;
                                        margin-top: -0.16rem;
                                    }
                                    ul{
                                        background: #4A4848;
                                        border-radius: 0.096667rem;
                                        li{
                                            width: 2.666667rem;
                                            height: 1.066667rem;
                                            line-height: 1.066667rem;
                                            border-radius: 0.096667rem;
                                            color: #f7f7f7;
                                            text-align: center;
                                            background:#4A4848;
                                            span{
                                                width:2.133333rem;
                                                height: 100%;
                                                display: block;
                                                margin:0 auto;
                                                border-bottom: 1px solid #5B5A5D;
                                                /*border-bottom: 1px solid red;*/
                                                box-sizing:border-box;
                                            }
                                            .bn{
                                                border: 0;
                                            }
                                        }

                                        .action{
                                            background: #3B3939;
                                        }
                                    }
                                }
                            }
                            .order-time{
                                position:absolute;
                                right: 0.266667rem;
                                bottom: 0.16rem;
                                color: #999;
                                font-size: 0.32rem;
                                padding-right: 0.373333rem;
                                background: url(//gfs12.gomein.net.cn/T1i9YvBKWQ1RCvBVdK.png) no-repeat right center;
                                background-size: 0.32rem 0.32rem;
                            }
                            .orderImg{
                                width: 2.026667rem;
                                height: 2.026667rem;
                                margin:0.16rem 0 0.16rem 0.266667rem;
                                position: relative;
                                img{
                                    width: 100%;
                                    height: 100%;
                                }
                                span{
                                    width: 1.093333rem;
                                    height: 1.093333rem;
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    background:url(//gfs12.gomein.net.cn/T1abEvBCJT1RCvBVdK.png) no-repeat;
                                    background-size: cover;
                                }
                            }
                            .order-info-d2{
                                .order-info_t{
                                    width: 5.026667rem;
                                    font-size: 0.32rem;
                                    color: #333;
                                    margin: 0.186667rem 0 0 0.266667rem;
                                    display: -webkit-box;
                                    -webkit-box-orient: vertical;
                                    -webkit-line-clamp: 2;
                                    overflow: hidden;
                                }
                                .order-info_b{
                                    width: 100%;
                                    margin: 0.72rem 0 0 0.266667rem;
                                    color: #999;
                                    font-size: 0.266667rem;
                                    line-height:0.426667rem;
                                }
                            }
                            /*延保*/
                            .order-info-yb{
                                width: 7.32rem;
                                .order-info-yb-p1{
                                    margin-top:0.186667rem;
                                    color: #333;
                                    font-size: 0.346667rem;
                                    line-height: 0.426667rem;
                                    width: 6.4rem;
                                    overflow: hidden;
                                    text-overflow:ellipsis;
                                    white-space: nowrap;
                                }
                                .order-info-yb-p2{
                                    margin-top:0.133333rem;
                                    color: #999;
                                    font-size: 0.32rem;
                                    line-height: 0.426667rem;
                                    .s1{
                                        width: 6.4rem;
                                        overflow: hidden;
                                        text-overflow:ellipsis;
                                        white-space: nowrap;
                                    }
                                    .s2{
                                        margin-right: 0.266667rem;
                                    }
                                }
                                .order-info-yb-p3{
                                    margin-top:0.08rem;
                                    color: #999;
                                    font-size: 0.32rem;
                                    line-height: 0.426667rem;
                                    width: 6.4rem;
                                    overflow: hidden;
                                    text-overflow:ellipsis;
                                    white-space: nowrap;
                                }
                            }
                            /*延保*/
                        }
                    }
                    /*等按钮*/
                    .order-button{
                        background:#fff;
                        padding: 0.32rem 0.053333rem 0.32rem 0;
                        li{
                            width: 1.92rem;
                            height: 0.746667rem;
                            line-height: 0.746667rem;
                            text-align: center;
                            font-size: 0.346667rem;
                            color: #999;
                            border: 1px solid #ddd;
                            border-radius: 50px;
                            margin-right: 0.213333rem;
                            margin-bottom: 0;
                        }
                        .action{
                            border: 1px solid #FF4B41;
                            color:#FF4B41;
                        }
                    }
                }
                .li:nth-last-child(2){
                  margin: 0;
                }
            }
        }
        .container2{
            padding-top: 1.433333rem;
        }
        .apponly{
            padding-top: 1.366667rem;
        }
        /*订单列表*/
    }
</style>