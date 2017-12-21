<template>
    <div class="wapper">
        <header-component :title="title"  :rightmenus="rightmenus" @watchlist="delAllWish"></header-component>
        <div class="cleanorder"  v-show="tuwenisshow">
            <!-- 没有清单时显示 我要预约按钮 -->
            <div class="tuwen">
                <div class="tu"></div>
                <p class="wen">清单为空~</p>
                <a class="btn btn-footer bdr-r bdr-t bdr-b bdr-l" @click="appointment">我要预约</a>
            </div>
        </div>
         <!-- 清单有内容时显示加入清单的商品 -->
        <div class="container" v-show="containerisShow">
            <!-- 商品 -->
            <div class="clean-order-list">
                <div class="mx-item bdr-bottom" v-for="(v,n) in body" :key="n">
                    <div class="text-box">
                        <div class="check" :class="{checked:v.checked}" @click="select(n)"></div>
                        <div class="text-con">
                            <div class="title">{{v.cgname}}</div>
                            <div class="decs">{{v.cccl[0].ctcl[0].cgcn}}</div>
                        </div>
                    </div>
                    <div class="pricebox">
                        <div class="price">￥<span class="item-price">{{parseFloat(v.price/100).toFixed(2)}}</span></div>
                        <div class="count-item">
                            <span class="remove" :class="{remove2:comCountMixTF(n)}" @click="fnRemove(n,v.cgcode,v.count,v.cccl[0].ctid,v.cccl[0].ctcl[0].cgcd)"></span>
                            <input type="tel" class="count" maxlength="2" v-model="v.count" @keyup="fnOnlyNumber(n)" @blur="fnBlur(n,v.cgcode,v.count,v.cccl[0].ctid,v.cccl[0].ctcl[0].cgcd)">
                            <span class="add" :class="{add2:comCountMaxTF(n)}" @click="fnAdd(n,v.cgcode,v.count,v.cccl[0].ctid,v.cccl[0].ctcl[0].cgcd)"></span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 尾部 -->
            <div class="c-footer" id="footer">
                <div class="check-box">
                    <span class="check-all" :class="{checked:all}" @click="selectall()"></span>
                    <span class="check-text">全选</span>
                </div>
                <div class="total_fl">
                    <span>合计：</span>
                    <span class="fcorange">￥<span id="totalPrice" >{{parseFloat(total/100).toFixed(2)}}</span></span>
                </div>
                <div class="topay" @click="getTemporaryOrder">结算</div>
            </div>
        </div>
    </div>
</template>
<script type="ecma6.0">
    let root = window || {},   
        util = root.util || {};  
    import headerComponent from '../../components/HeaderComponent'
    export default {
        data() {
            return {  
                title: '我的清单',    
                h: 'cleandetailnew.html',  //返回按钮跳转的页面  
                rightmenus:{      //删除按钮
                    type: "text",                    
                    content: "",                    
	            },    
                body: [],    
                all: false, //全选按钮   
                total: 0,   //总金额    
                tuwenisshow: false, //当商品为空时显示，显示我要预约按钮
                containerisShow: true, //有商品时是true    
                hrefParma: util.getHrefParma(), //获取地址链接
            }
    
        },
        methods: {
            //点击预约按钮
            appointment: function() {
                util.href('cleanlistnew.html');
            },
            // 渲染页面信息
            fnRanderPage: function(body) {
                let that = this,
                    wishs = body.wishs || [];
                for (var i = 0; i < wishs.length; i++) {
                    wishs[i].checked = false;
                    wishs[i].subTotal = wishs[i].count * wishs[i].price;
                };
                that.body = wishs;
            },
            //获取总价格
            getTotal: function() {
                let that = this,
                    wishs = that.body || [],
                    flag = true, //flag为true，则全选按钮高亮，否则反之
                    clean = false;//clean为true，删除按钮显示，否则反之
                that.total = 0;
                for (var i = 0; i < wishs.length; i++) {
                    if (wishs[i].checked == true) {
                        that.total += wishs[i].count * wishs[i].price;
                        clean = true;
                    } else {
                        flag = false
                    }
                };
                //判断全选按钮是否选中
                if (flag == true) {
                    that.all = true;
                } else {
                    that.all = false;
                }
                //判断删除按钮是否显示
                if(clean==true){
                    //wap删除按钮显示
                    that.rightmenus={
                        type: "img",
                        content: "//gfs10.gomein.net.cn/T1qXC_B4xT1RCvBVdK.png",
                    };
                    //app删除按钮
                    if(util.isApp()){
                        that.setHeadBar4();
                    }
                }else{
                    that.rightmenus={
                        type:"text",
                        content:"",
                    };
                    //app删除按钮显示
                    if(util.isApp()){
                        util.deleteHeadBtn();
                    }
                }
            },
            //每个清单价格
            getsubtotal: function(index) {
                let that = this,
                    wishs = that.body || [];
                wishs[index].subTotal = wishs[index].price * wishs[index].count;
            },
            //删除数据
            deleteInfo: function(index) {
                this.todos.splice(index, 1);
            },
            //点击减号
            fnRemove: function(i, cgcode, count, ctid, cgcd) {
                let that = this,
                    wishs = that.body || [];
                if (wishs[i].count > 1) {
                    wishs[i].count--;
                    count = wishs[i].count;
                    that.getsubtotal(i);
                    that.getTotal();
                    that.cleanListEidt(cgcode, count, ctid, cgcd);
                } else if (wishs[i].count <= 1) {
                    count = 0;
                    util.alert("确定要删除该商品吗？", {
                        justOk: false,
                        okFn: function() {
                            //删除
                            that.cleanListEidt(cgcode, count, ctid, cgcd, function() {
                                wishs.splice(i, 1);
                                //计算总价
                                that.getTotal();
                                //点击减号为1并且只有1条商品重新渲染页面
                                that.getPageInfo(true);
                            });
                            return false;
                        }
                    })
                }
            },
            //点击加号
            fnAdd: function(i, cgcode, count, ctid, cgcd) {
                let that = this,
                    wishs = that.body || [];
                if (wishs[i].count < 99) {
                    wishs[i].count += 1;
                    count = wishs[i].count;
                    that.getsubtotal(i);
                    that.getTotal();
                    that.cleanListEidt(cgcode, count, ctid, cgcd);
                } else if (wishs[i].count = 99) {
                    count = 99;
                    that.getsubtotal(i);
                    that.getTotal();
                    that.cleanListEidt(cgcode, count, ctid, cgcd);
                }
            },
            // input失去焦点变化
            fnBlur: function(i, cgcode, count, ctid, cgcd) {
                let that = this,
                    wishs = that.body || [];
                if (wishs[i].count == '' || wishs[i].count <1) {
                    wishs[i].count = 1;
                }
                that.cleanListEidt(cgcode, count, ctid, cgcd);
            },
            // 数量限制输入数字
            fnOnlyNumber: function(i) {
                let that = this,
                    wishs = that.body || [];
                if (wishs[i].count >= 99) {
                    wishs[i].count = 99;
                } else {
                    wishs[i].count = String(wishs[i].count).replace(/[^\d]/g, '');
                }
                that.getsubtotal(i);
                that.getTotal();
            },
            // 类型选择切换
            select: function(i) {
                let that = this,
                    wishs = that.body || [];
                if (wishs[i].checked == false) {
                    wishs[i].checked = true;
                    wishs[i].subTotal = wishs[i].price * wishs[i].count;
                    that.getTotal();
                } else {
                    wishs[i].checked = false;
                    wishs[i].subTotal = -wishs[i].price * wishs[i].count;
                    that.getTotal();
                }
            },
            // 数量等于1
            comCountMixTF: function(i) {
                let that = this,
                    wishs = that.body || [];
                if (wishs[i].count <=1) {
                    return true;
                }
            },
            // 数量等于99
            comCountMaxTF: function(i) {
                let that = this,
                    wishs = that.body || [];
                if (wishs[i].count == 99) {
                    return true;
                };
            },
            //全选按钮
            selectall: function() {
                let that = this,
                    wishs = that.body || [];
                if (that.all == false) {
                    that.all = true;
                    for (var i = 0; i < wishs.length; i++) {
                        wishs[i].checked = true;
                    };
                    that.getTotal();
                } else {    
                    that.all = false;    
                    for (var i = 0; i < wishs.length; i++) {   
                        wishs[i].checked = false;    
                    };    
                    that.total = 0;                    
                    that.rightmenus={
                        type:"text",
                        content:"",
                    };  
                    //app删除按钮显示
                    if(util.isApp()){
                        util.deleteHeadBtn();
                    }
                }    
            },
            //清单列表单个变更
            cleanListEidt: function(cgcode, count, ctid, cgcd, okFn) {
                let that = this,   
                    wishs = that.body || [],    
                    //需要提交的参数    
                    data = {    
                        //服务编码    
                        "cgcode": cgcode,    
                        //加入数量    
                        "count": count,   
                        //修改数量    
                        "optp": 2,    
                        "cccl": [{    
                            //服务内容分类id    
                            "ctid": ctid,    
                            "ctcl": [{    
                                //服务内容编号   
                                "cgcd": cgcd   
                            }]    
                        }]    
                    };  
                //请求    
                util.api({      
                    surl: root.CLEAN_API_PATH + 'modWish',   
                    data: data,   
                    type: 'post', 
                    success: function(response) { 
                        let rpco = response.rpco, 
                            body = response.body || {};
                        // 处理
                        switch (rpco) {
                            case 200:
                                okFn && okFn();
                                break;
                            case 40003:
                                util.tip('清单列表中的项目数量已到最大值', {duration: 2000});
                            case 40004:
                                util.tip('清单项的内容数量已到最大值');
                            case 40005:
                                util.tip('请求数据格式错误');
                                break;
                            case 40006:
                                util.tip('数量格式错误');
                                break;
                            case 40007:
                                util.tip('操作类型格式错误');
                                break;
                            default:
                                util.tip('服务器繁忙，请稍后再试', {duration: 2000});
                        }
                    }
                });
            },
            delAllWish: function() {   
                let that = this,
                    wishs = that.body || [];
                let cglist = [],
                    flag = false;
                for (var i = 0; i < wishs.length; i++) {
                    if (wishs[i].checked == true) {
                        flag = true;
                        let cgcode = wishs[i].cgcode,
                            ctid = wishs[i].cccl[0].ctid,
                            cgcd = wishs[i].cccl[0].ctcl[0].cgcd,
                            obj = {
                                //服务编码
                                "cgcode": cgcode,
                                "cccl": [{
                                    //服务内容分类id
                                    "ctid": ctid,
                                    "ctcl": [{
                                        //服务内容编号
                                        "cgcd": cgcd
                                    }]
                                }]
                            };
                        cglist.push(obj);
                    }
                };
                if (flag == false) {
                    util.tip('请选择您要删除的商品', {
                        duration: 2000
                    });
                } else {
                    util.alert("确定要删除选定的商品吗?", {
                        justOk: false,
                        cancelBtnText: '保留',
                        okFn: function() {
                            //删除
                            util.api({
                                surl: root.CLEAN_API_PATH + 'delWish',
                                data: cglist,
                                type: 'post',
                                success: function(response) {
                                    var rpco = response.rpco,
                                        body = response.body || {};
                                    // 处理
                                    switch (rpco) {
                                        case 200:
                                            that.getPageInfo();
                                            break;
                                        default:
                                            util.tip('服务器繁忙，请稍后再试');
                                    }
                                }
                            });
                            return false;
                        }
                    })
                }
            },
            /** 获取临时订单id*/
            getTemporaryOrder: function() {
                let that = this,
                    wishs = that.body || [];
                let flag = false,
                    cglist = [];
                for (var i = 0; i < wishs.length; i++) {
                    if (wishs[i].checked == true) {
                        let cgcd = wishs[i].cccl[0].ctcl[0].cgcd,
                            cgnum = wishs[i].count,
                            price = wishs[i].price,
                            list = wishs[i].cgilist;
                        let obj={
                                "cgcd":cgcd,
                                "cgnum":cgnum,
                                "price":price,
                                "cgilist":list
                            }
                        cglist.push(obj);
                        flag = true;
                    }
                };
                //判断是否有清单被选中
                if (flag == false) {
                    util.tip('请选择需要购买的商品', {
                        duration: 2000
                    });
                    return false;
                }else{
                    util.api({
                    surl: root.CLEAN_API_PATH + 'saveTempOrder',
                    type: 'post',
                    data: {
                        "cglist": cglist
                    },
                    success: function(response) {
                        let rpco = response.rpco,
                            body = response.body || {};
                        // 处理
                        switch (rpco) {
                            case 200:
                                let oid = body.oid;
                                util.href('cleansubmitorder.html', {
                                    oid: oid,
                                    ty: that.hrefParma.ty,
                                    inventory: 'v'
                                });
                                break;
                            default:
                                util.tip('服务器繁忙，请稍后再试')
                        }
                    }
                });
                }
            },
            getPageInfo: function(isLast) {
                let that = this;
                // 加载页面信息
                util.api({
                    surl: root.CLEAN_API_PATH + 'getWish',
                    type: 'get',
                    success: function(response) {
                        let rpco = response.rpco,
                            body = response.body || {};
                        // 处理
                        switch (rpco) {
                            case 200:
                                //击减号列表数量为1的时候
                                if (that.isLast || !body.wishs) {
                                    // 渲染
                                    that.tuwenisshow = true;
                                    that.containerisShow = false;
                                    that.rightmenus = {
                                        type:"text",
                                        content:"",
                                    };
                                    //app删除按钮显示
                                    if(util.isApp()){
                                        util.deleteHeadBtn();
                                    }
                                    return false;
                                }
                                //渲染页面信息
                                that.fnRanderPage(body);
                                break;
                            default:
                                util.tip('服务器繁忙，请稍后再试')
                        }
                    }
                });
            },
            //显示按钮
            setHeadBar4:function(){
                let that=this;
                GomeJSBridge.ready(function(){
                    let param = {
                        menus : {
                            rightMenus:[
                                {
                                    type:'callback',
                                    title:'删除',
                                    icon:'http://gfs10.gomein.net.cn/T11a__B4YT1RCvBVdK.png',
                                    data:{
                                        id:'btn1',
                                        name:'删除',
                                        desc:'删除'
                                    }
                                }
                            ]
                        }
                    };
                    util.setHeadBar(param);
                },null);

                GomeJSBridge.onCallback(function(data){
                    if(data.id == "btn1"){
                        that.delAllWish();
                    }
                })
			}
        },
        created() {
            this.getPageInfo();
            if(util.isApp()){
                util.deleteHeadBtn();
            }
        },
        components: {
            headerComponent
        }
    }
</script>
<style lang="less">
    @import '../../util/fs.less';
    .wapper{
        padding-bottom: 1.253333rem;
        .header .right img{
            width: auto;
        }
    }
    .cleanorder {
        min-width: 320px;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height:100%;
        background: #fff;
        .tuwen {
            text-align: center;
            .mixinfont(16px);
            .tu {
                display: inline-block;
                width: 1.6rem;
                height: 1.6rem;
                background: url("//gfs11.gomein.net.cn/T1yLCvBXCv1RCvBVdK.png") no-repeat center center;
                -webkit-background-size: 100%;
                background-size: 100%;
                margin-top: 4.12rem;
            }
            .wen {
                margin: .506667rem 0 .586667rem 0;
            }
            .btn-footer {
                height: 1.013333rem;
                width: 3.653333rem;
                color: #fff;
                text-align: center;
                line-height: 1.013333rem;
                display: inline-block;
                color: #ED5B5D;
                position: relative;
            }
            .btn-footer:before{
                content: "";/* 注意这里为双引号 */
                position: absolute;
                width: 200%;
                height: 200%;
                border: 1px solid #ED5B5D;
                border-radius:4px;/* 也可以设置圆角 */
                -webkit-transform-origin: 0 0;
                -moz-transform-origin: 0 0;
                -ms-transform-origin: 0 0;
                -o-transform-origin: 0 0;
                transform-origin: 0 0;
                -webkit-transform: scale(0.5, 0.5);
                -ms-transform: scale(0.5, 0.5);
                -o-transform: scale(0.5, 0.5);
                transform: scale(0.5, 0.5);
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
             }
        }
    }
    .container{
         .clean-order-list {
            .mx-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                height: 2.346667rem;
                background: #fff;
                overflow: hidden;
                .check {
                    width: .533333rem;
                    height: .533333rem;
                    background: url("//gfs12.gomein.net.cn/T1UIYgB4YT1RCvBVdK.png") no-repeat;
                    -webkit-background-size: 100%;
                    background-size: 100%;
                    margin: 0 .16rem 0 .32rem;
                }
                .check.checked {
                    background: url("//gfs10.gomein.net.cn/T1tyY_BCdT1RCvBVdK.png") center center no-repeat;
                    -webkit-background-size: 100%;
                    background-size: 100%;
                }
                .text-box {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    .title {
                        .mixinfont(14px);
                        width: 3.8rem;
                        white-space: nowrap;
                        /* 不换行 */
                        overflow: hidden;
                        /* 内容超出宽度时隐藏超出部分的内容 */
                        text-overflow: ellipsis;
                        /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
                        font-family: PingFangSC-Regular;
                        color: #333333;
                        letter-spacing: 0;
                    }
                    .decs {
                        .mixinfont(12px);
                        color: #777;
                        width: 3.8rem;
                        white-space: nowrap;
                        /* 不换行 */
                        overflow: hidden;
                        /* 内容超出宽度时隐藏超出部分的内容 */
                        text-overflow: ellipsis;
                        /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
                    }
                }
                .pricebox {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    .price {
                        color: #ff4b46;
                        .mixinfont(16px);
                    }
                    .count-item {
                        width: 2.32rem;
                        height: .586667rem;
                        margin: 0 .32rem 0 .4rem;
                        border: 1px solid #ccc;
                        border-radius: .08rem;
                        overflow: hidden;
                        text-align: center;
                        display: flex;
                        align-items: center;
                        justify-content: flex-start;
                        .remove {
                            width: .693333rem;
                            height: .586667rem;
                            display: inline-block;
                            .mixinfont(36px);
                            background-image: url("//gfs11.gomein.net.cn/T1ZDdvBXZ_1RCvBVdK.png");
                            background-repeat: no-repeat;
                            background-position: center center;
                            background-size: 49%;
                        }
                        .add {
                            width: .693333rem;
                            height: .586667rem;
                            text-indent: -999rem;
                            display: inline-block;
                            .mixinfont(36px);
                            background-image: url("//gfs13.gomein.net.cn/T1a_xvBvVg1RCvBVdK.png");
                            background-repeat: no-repeat;
                            background-position: center center;
                            background-size: 49%;
                        }
                        .add2 {
                            background-image: url("//gfs10.gomein.net.cn/T1NL_vB_Ev1RCvBVdK.png");
                            background-repeat: no-repeat;
                            background-position: center center;
                            background-size: 49%;
                            background-color: #f6f6f6;
                            
                        }
                        .remove2 {
                            background-image: url("//gfs11.gomein.net.cn/T1tDbvByAv1RCvBVdK.png");
                            background-repeat: no-repeat;
                            background-position: center center;
                            background-size: 49%;
                            background-color: #f6f6f6;
                        }
                        .count {
                            border-left: 1px solid #ccc;
                            border-right: 1px solid #ccc;
                            width: .933333rem;
                            height: .586667rem;
                            .mixinfont(14px);
                            text-align: center;
                            -webkit-appearance : none ;  /*解决iphone safari上的圆角问题*/
                            border-radius: 0;
                            -webkit-box-sizing: border-box;
                            box-sizing: border-box;
                        }
                        input::-webkit-outer-spin-button,  
                        input::-webkit-inner-spin-button{  
                            -webkit-appearance: none !important;  
                            margin: 0;  
                        }  
                    }
                }
            }
        }
        .c-footer {
            width: 100%;
            position: fixed;
            left: 0;
            bottom: 0;
            height: 1.253333rem;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 10;
            border-top:0.5px solid #f0f0f0;
            .mixinfont(14px);
            .check-box {
                flex: 2;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                color: #777;
                .check-all {
                    width: .533333rem;
                    height: .533333rem;
                    background: url("//gfs12.gomein.net.cn/T1UIYgB4YT1RCvBVdK.png") no-repeat;
                    -webkit-background-size: 100%;
                    background-size: 100%;
                    margin: 0 .16rem 0 .32rem;
                }
                .check-all.checked {
                    background: url("//gfs10.gomein.net.cn/T1tyY_BCdT1RCvBVdK.png") center center no-repeat;
                    -webkit-background-size: 100%;
                    background-size: 100%;
                }
            }
            .total_fl {
                display: flex;
                justify-content: flex-end;
                .mixinfont(15px);
                color: #333;
                margin-right: .213333rem;
                flex: 5;
            }
            .topay {
                flex: 3;
                width: 30%;
                height: 1.253333rem;
                line-height: 1.333333rem;
                background: #ff4b46;
                text-align: center;
                .mixinfont(18px);
                color: #fff;
            }
        }
        
    }
</style>

