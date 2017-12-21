<template>
<div class="clean">
    <img :src="body.iurl" class="cleanHead">
    <!-- 金额展示 -->
    <div class="text-box">
        <p id="cgname">{{ comCgname }}</p>
        <p v-show="comCgArea">【{{ comCgArea }}】</p>
        <p v-show="comCgcpTF" class="cleanCgcp clearfix">
            <span class="s1">
                <i>￥</i><span id="cgcp">{{ comCgcpInt}}.<i>{{ comCgcpFloat }}</i></span>
            </span>
        </p>
        <p v-show="!comCgcpTF" class="cleanCgcp clearfix">
            <span class="s1">
                <i>￥</i><span id="cgcp">{{ comCgcpInt }}.<i>{{ comCgcpFloat }}</i></span>
            </span>
            <span class="s2">
                <i>￥</i><span id="cgcp">{{ comCgopInt }}.<i>{{ comCgopFloat }}</i></span>
                <strong></strong>
            </span>
            <span class="s3">已省{{ comCgcpSave }}元</span>
        </p>
    </div>
    <!-- 金额展示 -->
    <!-- 产品展示 -->
    <ul class="clearfix combo-box">
        <li class="float_l r" :class="{checked:v.checked}" v-for="(v,n) in body.ctcl"  @click="fnToggle(n,v.cgcn,v.cgcd,v.cgcp,v.cgop)">{{ v.cgcn }}</li>
        <!-- <li class="float_l">立挂式空调清洗</li> -->
    </ul>
    <!-- 产品展示 -->
    <!-- 购买数量操作 -->
    <div class="clearfix count-box">
        <span class="float_l">购买数量</span>
        <div class="float_r count-item">
            <span class="remove float_l" :class="{remove2:comCountMixTF}" @click="fnRemove"></span>
            <input type="tel" maxlength="2" v-model="body.count"  @keyup="fnOnlyNumber" class="count float_l" @blur="fnBlur">
            <span class="add float_r" :class="{add2:comCountMaxTF}" @click="fnAdd"></span>
        </div>
    </div>
    <!-- 购买数量操作 -->
    <!-- 产品详情 -->
    <div class="productInfo">
        <p>产品详情</p>
        <img :src="body.cgpic" alt="">
    </div>
    <div class="productText">
        <h3>温馨提示:</h3>
        <p>1.每件清洗商品仅限对应一件家电清洗，清洗套餐仅限订购套餐中每种家电中的一件清洗。</p>
        <p>2.空调挂机保养暂时仅限3匹以下。</p>
        <p>3.保养后质保90天（限内机）。</p>
        <p>4.微信下单仅限家庭用户，商业及工程单用户请联系：4008-708-708</p>
        <p>5.若机器出现下列情况，不予保养。</p>
        <p>1）机器存在功能性故障，影响正常使用，建议体验维修服务。</p>
        <p>2）工程师可能会在辨明情况后，不予保养，建议听取工程师专业意见。</p>
    </div>
    <!-- 产品详情 -->
    <!-- 底部 -->
    <footer>
     <!--    <div id="orderList" @click="fnQd">
            <span v-show="qdCount">{{ qdCount }}</span>
            <img src="//gfs7.gomein.net.cn/T1SfxTBXEv1RCvBVdK">
            <p>清单</p>
        </div>
        <div id="addPay" class="r" @click="fnAddOrderInfo">加入清单</div> -->
        <div id="toPay" class="r" @click="fnSaveTempOrder">立即购买</div>
    </footer>
    <!-- 底部 -->
</div>

</template>

<script>
export default {
    // props:['body'],
    data () {
        return {
            body: {},
            // 清单数量
            qdCount:null,
            oldNum:1
        }
    },
    computed:{
        // 清洗名称截取
        comCgname () {
            let that = this,
                cgname = that.body.cgname,
                iy = cgname.indexOf('('),
                iz = cgname.indexOf('（'),
                cgnameStart = iy>0 ? iy : iz ;
            if (cgnameStart>0) {
                return cgname.substring(0,cgnameStart);
            }else{
                return cgname;
            };
        },
        // 清洗名称地区截取
        comCgArea () {
            let that = this,
                cgname = that.body.cgname,
                iy = cgname.indexOf('('),
                iz = cgname.indexOf('（'),
                cgnameStart = iy>0 ? iy : iz ;
            if (cgnameStart>0) {
                return cgname.substring(cgnameStart+1,cgname.length-1);
            }else{
                return false;
            };
        },
        // 数量等于1
        comCountMixTF () {
            let that = this,
                count = that.body.count;
            if (count == 1) {
                return true;
            };
        },
        // 数量等于99
        comCountMaxTF () {
            let that = this,
                count = that.body.count;
            if (count == 99) {
                return true;
            };
        },
        // 现价价格整数计算
        comCgcpInt () {
            // let that = this,
            //     cgcp = String(that.body.cgcp);
            // return cgcp.substring(0,cgcp.length-2);
            return parseInt(this.body.cgcp/100);
        },
        // 现价价格小数计算
        comCgcpFloat () {
            let that = this,
                cgcp = String((that.body.cgcp/100).toFixed(2));
            return cgcp.substring(cgcp.length-2);
        },
         // 原价价格整数计算
        comCgopInt () {
            // let that = this,
            //     cgop = String(that.body.cgop);
            // return cgop.substring(0,cgop.length-2);
            return parseInt(this.body.cgop/100);
        },
        // 原价价格小数计算
        comCgopFloat () {
            let that = this,
                cgop = String((that.body.cgop/100).toFixed(2));
            return cgop.substring(cgop.length-2);
        },
        // 优惠价格显示或隐藏
        comCgcpTF () {
            let that = this,
                cgcp = that.body.cgcp,
                cgop = that.body.cgop;
            if (cgcp - cgop >= 0 ) {
                return true;
            }else{
                return false;
            };
        },
        // 节省金额
        comCgcpSave () {
            let that = this,
                cgcp = that.body.cgcp,
                cgop = that.body.cgop;
            return (cgop - cgcp)/100;
        },
        // 数量
        comCount () {
            let that = this,
                count = that.body.count;
            return count;
        }
    },
    methods:{
        // 数量限制输入数字
        fnOnlyNumber: function() {
            let that = this,
                body = this.body;
            body.count = String(body.count).replace(/[^\d]/g,'');
        },
        // 点击清单
        fnQd: function() {
            let that = this,
                hrefParma = util.getHrefParma(),
                cgcode = hrefParma.cgcode;
            util.href('cleanorderlist.html',{
                cgcode: cgcode,
                ty: util.getHrefParma().ty
            });
        },
        // input失去焦点变化
        fnBlur: function() {
            let that = this,
                body = that.body;

            if (body.count == '' || body.count == 0) {
                body.count = 1;
            };
        },
        // 点击减号
        fnRemove: function() {
            let that = this,
                body = that.body;

            if (body.count>1) {
                body.count --;
            };
        },
        fnAdd: function() {
            let that = this,
                body = that.body;
            if (body.count<99) {
                body.count ++;
            };
        },
        // 类型选择切换
        fnToggle: function(index,cgcn,cgcd,cgcp,cgop) {
            let that = this,
                ctcl = that.body.ctcl;
            for (var i = 0; i < ctcl.length; i++) {
                if (i == index) {
                    ctcl[i].checked = true;
                }else{
                    ctcl[i].checked = false;
                };
            };
            // 点击时每个类型上带的属性
            $.extend(that.body,{
                cgcn:cgcn,
                cgcd:cgcd,
                cgcp:cgcp,
                cgop:cgop
            })
            // console.log(that.body)
        },
        // 渲染页面信息
        fnRanderPage: function(body) {
            let that = this,
                // 把body拆分
                cgcode = body.cgcode,
                cgpic = body.cgpic,
                cgname = body.cgname || '',
                cgilist = body.cgilist || [],
                iurl = cgilist[0].iurl || '',
                itag = cgilist[0].itag,
                cccl = body.cccl || [],
                cten = cccl[0].cten || '',
                ctid = cccl[0].ctid,
                ctcl = cccl[0].ctcl || [],
                cgcd = ctcl[0].cgcd,
                cgcp = ctcl[0].cgcp,
                cgcn = ctcl[0].cgcn || '',
                cgop = ctcl[0].cgop,
                count = 1,

                // 与数据关联
                objcet = {
                    cgcode: cgcode,
                    cgpic: cgpic,
                    cgname: cgname,
                    iurl: iurl,
                    cten: cten,
                    ctid: ctid,
                    ctcl: ctcl,
                    cgcd: cgcd,
                    cgcp: cgcp,
                    cgcn: cgcn,
                    cgop: cgop,
                    count: count
                };

                for (var i = 0; i < ctcl.length; i++) {
                    if (i==0) {
                        ctcl[i].checked = true;
                    }else{
                        ctcl[i].checked = false;
                    }
                };
                objcet.ctcl = ctcl;

            that.body = objcet;
        },
        //获取清单列表
        fnGetQdCount: function() {
            let that = this,
                body = this.body;

            util.api({
                surl: root.INSTALL_API_PATH + 'getWish',
                type: 'get',
                success: function(response) {
                    let rpco = response.rpco,
                        body = response.body;

                    switch(rpco) {
                        case 200:
                            that.qdCount = body.wishs.length;
                            // that.qdCount = body.qdCount;
                            // console.log(body.qdCount)
                            break;
                        default:
                            util.tip('请求失败');
                    }
                }
            })
        },
        // 加入清单
        fnAddOrderInfo: function() {
            // console.log(this.body.count)
            let that = this,
                body =  that.body,
                hrefParma = util.getHrefParma(),
                cgcode = hrefParma.cgcode,
                data = {
                    cgcode: cgcode,
                    count: body.count,
                    optp: 1,
                    cccl:[{
                        ctid: body.ctid,
                        ctcl:[{
                            cgcd: body.cgcd
                        }]
                    }]
                };
            // 加入清单
            util.api({
                surl: root.INSTALL_API_PATH + 'modWish',
                data: data,
                type: 'post',
                success: function(response) {
                    let rpco = response.rpco,
                        body = response.body;

                    switch(rpco) {
                        case 200:
                            util.tip('成功加入清单',{
                                duration: 2000
                            });
                            that.fnGetQdCount();
                            break;
                        case 40004:
                            util.tip('该服务至多可添加99件');
                            break;
                        case 40006:
                            util.tip('清单至多保存99种不同服务，可删除后继续添加');
                            break;
                        default:
                            util.tip('请求失败');
                    }
                }
            })
        },
        // 提交临时订单
        fnSaveTempOrder: function() {
            let that = this,
                body = that.body,
                data = {
                    cglist:[{
                        cgcd: body.cgcd,
                        cgnum: body.count,
                        price: body.cgcp
                    }]
                };

            util.api({
                surl: root.INSTALL_API_PATH + 'saveTempOrder',
                type: 'post',
                data: data,
                success: function(response) {
                    let rpco = response.rpco,
                        body = response.body;

                    switch(rpco) {
                        case 200:
                            util.href('cleansubmitorder.html',{
                                oid: body.oid,
                                ty:  util.getHrefParma().ty
                            });
                            break;
                        default:
                            util.tip('请求失败');
                    }
                }
            })
        }
    },
    created () {
        let that = this,
            hrefParma = util.getHrefParma();

        // 获取清单数量
        that.fnGetQdCount();
        // 加载页面信息
        util.api({
            // surl: 'categoryDetail.json',
            surl: root.INSTALL_API_PATH + 'categoryDetail',
            type: 'get',
            data:{
                cgcode: hrefParma.cgcode
            },
            success: function(response) {
                let rpco = response.rpco,
                    body = response.body;

                switch(rpco) {
                    case 200:
                    // 渲染页面信息
                    that.fnRanderPage(body);
                        break;
                }
            }
        })
    },
    // 组件更新完毕之后
    // updated () {
    //      ripple.init(['.combo-box li','#addPay','#toPay']);
    // }
}
</script>

<style lang="less">
    @import '../../util/fs.less';

    .clean{
        font-family: "Microsoft YaHei",Arial,Helvetica,sans-serif;
        /*height:30.666667rem;*/
        padding-bottom: 1.293333rem;
        .cleanHead{
            width: 100%;
            border-bottom: 1px solid #ccc;
        }
        .text-box{
            padding-left: 0.32rem;
            background: #fff;
            p:nth-child(1){
                color:#333;
                font-size:0.4rem;
                padding-top: 0.4rem;
                font-weight: 200;
            };
            p:nth-child(2){
                color:#ff4b46;
                font-size: 0.32rem;
                padding-top:0.186667rem;
                text-indent: -0.133333rem;
            }
            .cleanCgcp{
                padding: 0.4rem 0 0.533333rem 0;
                vertical-align:bottom;
                display: table-cell;
                .s1{
                    /*float: left;*/
                    display: inline-block;
                    i{
                        font-size:0.42rem;
                        color:#ff4b46;
                        font-weight:200;
                        /*line-height:0.32rem;*/
                    }
                    span{
                        font-size: 0.613333rem;
                        color: #ff4b46;
                        font-weight: 200;
                        /*line-height:0.426667rem;*/
                        i{
                            font-size:0.426667rem;
                            color:#ff4b46;
                            font-weight: 200;
                        }
                    }
                };
                .s2{
                    display: inline-block;
                    /*float: left;*/
                    /*margin-top: 0.266667rem;*/
                    margin-left: 0.133333rem;
                    /*text-decoration:line-through;*/
                    position: relative;
                    i{
                        font-size: 0.27rem;
                        color:#777;
                    }
                    span{
                        font-size: 0.373333rem;
                        color: #777;
                        i{
                            font-size:0.27rem;
                            color:#777;
                        }
                    }
                    strong{
                        position: absolute;
                        top: 50%;
                        left: 0;
                        width: 100%;
                        border-top: 1px solid #777;
                    }
                };
                .s3{
                    display: inline-block;
                    /*float: left;*/
                    /*margin-top: 0.2rem;*/
                    margin-left: 0.253333rem;
                    font-size: 0.293333rem;
                    color: #fff;
                    background: #ff4b46;
                    border-radius: 0.08rem;
                    line-height: 0.426667rem;
                    height: 0.426667rem;
                    /*width: 1.466667rem;*/
                    text-align: center;
                    padding: 0.066667rem 0.133333rem;
                }
            }
        }
        .combo-box{
            padding: 0.4rem 0.533333rem;
            background: #fff;
            margin-top:0.266667rem;
            border-bottom: 1px solid #e3e3e3;
            li{
                width: 4.2rem;
                border: 1px solid #ccc;
                height: 0.72rem;
                line-height: 0.72rem;
                color: #777;
                font-size: 0.373333rem;
                border-radius: 0.066667rem;
                text-align: center;
                margin-bottom: 0.373333rem;
                /*overflow: hidden;*/
                text-overflow:ellipsis;
                white-space:nowrap;
                /*position: relative;*/
                /*cursor: pointer;*/
            }
            .checked{
                color: #ff4b46;
                border: 1px solid #ff4b46;
            }
            li:nth-child(odd){
                float:left;
            }
            li:nth-child(even){
                float: right;
            }
        }
        .count-box{
            height: 1.2rem;
            line-height: 1.2rem;
            background: #fff;
            padding-left: 0.32rem;
            color: #333;
            font-size: 0.373333rem;
            .count-item{
                margin:0.253333rem 0.786667rem 0 0 ;
                box-sizing:border-box;
                /*width: 2.426667rem;*/
                height: 0.666667rem;
                line-height: 0.666667rem;
                border-radius: 0.066667rem;
                border:1px solid #999;
                text-align: center;
                span{
                   width:0.653333rem;
                   height: 100%;
                };
                .add{
                    background: url(img/addnum.png) no-repeat center center;
                    background-size: 0.24rem 0.24rem;
                }
                .remove{
                    background: url(img/remove.png) no-repeat center center;
                    background-size: 0.24rem 0.24rem;
                }
                .add2{
                    background: url(img/add_dis.png) no-repeat center center;
                    background-size: 0.24rem 0.24rem;
                }
                .remove2{
                    background: url(img/remove_dis.png) no-repeat center center;
                    background-size: 0.24rem 0.24rem;
                }
                .count{
                    width: 1.093333rem;
                    height: 100%;
                    border-left: 1px solid #999;
                    border-right: 1px solid #999;
                    text-align: center;
                    border-radius: 0;
                }
            }
        }
        .productInfo{
            p{
                height: 1.173333rem;
                line-height: 1.173333rem;
                text-indent:0.333333rem;
                color:#333;
                font-size: 0.373333rem;
                background: #fff;
                margin-top:0.266667rem;
            }
            img{
                width: 100%;
            }
        }
        .productText{
            background: #fff;
            padding:0.266667rem 0.266667rem 0.7rem 0.266667rem;
            h3{
                font-size: 0.426667rem;
                color: #333;
                padding-bottom: 0.1rem;
            }
            p{
                font-size: 0.373333rem;
                line-height: 0.56rem;
                color: #777;
            }
        }
        footer{
            border-top: 1px solid #e3e3e3;
            width: 100%;
            height: 1.293333rem;
            position: fixed;
            bottom: 0;
            left: 0;
            font-size: 0.453333rem;
            text-align: center;
            color: #fff;
            display:flex;
      /*      div:nth-child(1){
                flex:27;
                background: #fff;
                position: relative;
                span{
                    width: 0.55rem;
                    height: 0.55rem;
                    line-height: 0.55rem;
                    text-align: center;
                    position: absolute;
                    top:0;
                    right:34%;
                    background: #ff4b46;
                    border-radius: 50%;
                    color: #fff;
                    font-size: 0.38rem;
                }
                img{
                    width: 0.533333rem;
                    height: 0.626667rem;
                    display:block;
                    margin:0 auto;
                    margin-top: 0.2rem;
                }
                p{
                    font-size:0.266667rem;
                    color: #777;
                    margin-top: 0.066667rem;
                    line-height:0.333333rem;
                }
            }
            div:nth-child(2){
                line-height: 1.293333rem;
                flex:24;
                background: #ffbb19;
            }*/
            div{
                line-height: 1.293333rem;
                flex:1;
                background: #ff493f;
            }
        }
    }


</style>