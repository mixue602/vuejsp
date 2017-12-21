<template>
	<div id="electrcard" :class="{'hsft':bdhsft}" class="wapper">
        <header-component :title="title"></header-component>
        <div class="wapper" >
            <div class="topbg">
                <span class="btn" id="bxkxz" @click="openDialog">保修须知</span>
                <div class="txt-ct" id="have" v-show="have">
                    
                    <span class="txt-big" ><span>{{ dotw }}</span>天</span>
                    <span class="txt-small">主体保修天数</span>

                </div>
                <div class="txt-ct-tuwen" id="nohave" v-show="nohave">
                    <span class="txt-big i2"><!--<i class="i i-bao4"></i>-->已过保</span>
                    <div class="txt-small">您的产品已过保，请注意保养设备</div>
                </div>
                <div class="txt-ct-tuwen" id="unknow" v-show="unknow">
                    <span class="txt-big i3"><i class="i i-shijian"></i>暂无时间</span>
                    <div class="txt-small">管家未能获取到保修时间</div>
                </div>
                <div class="txt-ct-tuwen" id="erroTip" v-show="erroTip">
                    <span class="txt-big i2">以发票为准</span>
                    <div class="txt-small">您购买的商品保修时间及保修期限以发票提示为准</div>
                </div>
                <div class="gray-layer" id="gdna">{{ gdna }}</div>
            </div>
            <div id="wcbic">
                <ul class="list-labelvalue" v-for="wcbic in wcbics">

                    <li v-for="wcc in wcbic.wcbicc" :lbid="wcc.lbid" :optp="wcc.optp" :dttp="wcc.dttp" v-if="wcc.optp==0" >
                        <label> {{wcc.lbttl}} </label>
                        <span class="value"> {{ innerText(wcc.lbvl,wcc.dttp) }} </span>
                    <li>

                    <li v-for="(wcc,index) in wcbic.wcbicc" :lbid="wcc.lbid" :optp="wcc.optp" :dttp="wcc.dttp" v-if="wcc.optp==10">
                        <label class="rd-st">{{wcc.lbttl}} </label>
                        <input type="text" class="value" :placeholder="'请输入'+wcc.lbttl" :maxlength="maxlength10" @click="maxLennum1(wcc.lbid)" :key="index" :value="wcc.lbvl" v-model="wcc.lbvl"  @change="print(wcc.lbvl,wcc.lbid,wcc.dttp,wcc.lbttl,wcc.lbvl)" :orival="wcc.lbvl"/>
                    <li>
<!-- wcc[index] -->
                    <li v-for="(wcc,index) in wcbic.wcbicc" :lbid="wcc.lbid" :optp="wcc.optp" :dttp="wcc.dttp" v-if="wcc.optp==11">
                        <label class="rd-st"> {{wcc.lbttl}} </label>
                        <span class="btn-opct js-saoma" @click="saoma(wcc.lbid)"><i class="i i-saoma"></i></span>
                        <input type="text" class="value valueSaoma" :id="wcc.lbid" :placeholder="'请输入'+wcc.lbttl" :maxlength="maxlength11" @click="maxLennum2(wcc.lbid)" :key="index" v-model="wcc.lbvl"  @change="print(wcc.lbvl,wcc.lbid,wcc.dttp,wcc.lbttl)" :orival="wcc.lbvl" :value="wcc.lbvl"/>
                    <li>
                </ul>
            </div>
            <div class="tip">厂家客服电话：<a class="cl-yl" href="tel:400-811-3333">400-811-3333</a><a class="link" href="warranty.html">保修条款</a></div>
        </div>

        <div class="footer" v-show="footer" @click="saveCard()">
            <span class="btn btn-footer" id="save" >保存</span>
        </div>

        <div class="dialog dn" v-show="nodialog">
            <div class="tablecell">
                <div class="dialog-context no-txtidt">
                    <div class="ttl">保修卡须知<span class="opctbig" id="dialogClose" @click="dialogClose"><i class="i i-delete2"></i></span></div>
                    <div class="txt">
                        <span class="clred">保修卡展示</span>
                        仅展示用户使用会员卡在国美电器门店购买电子类商品保修信息，如展示信息有误请及时联系会员卡所属门店。
                        <span class="clred">保修时间</span>
                        根据用户购买商品时间及产品保修期限计算展示当前剩余保修时间，仅展示商品主设备保修时间，不展示商品延保、配件保修时间，目前保修时间主要以用户购买时间与相关类型商品标准保修期计算剩余保修时间，如出现保修时间错误，请以商品实际保修期为主。
                        <span class="clred">保修效用</span>
                        国美管家保修卡信息仅作为帮助用户实时提醒保修剩余时间及相关发票、商品条码管理展示，不作为最终保修凭证，最终解释权归产品厂家所有。
                    </div>
                </div>
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
			title:'电子保修卡',
			hrefParma:{},
            nodialog:false,//保修须知
            gdna:'',//商品名称
            dotw:null,// 保修剩余天数
            sctm:null,
            unknow:false,//时间未知框
            have:false,
            nohave:false,
            erroTip:false,
            body:{},
            wcbics:[],
            maxlength10:64,
            maxlength11:64,
            footer:false,
            bdhsft:false,
            userDate: '',
            userName: '',
            userNum: '',
            //用户修改信息集合，用于提交
            datas:{},
            //校验结果结合
            regResult:{},
            // 微信加载成功状态
            wcSuccess: false,
            msg: {
                m1: '保存成功',
                m2: '请核对扫码内容'
            },
            // 请求状态，用于ajax
            requestState: {
                wcSuccess: false,
                delAccount: true
            }



            
        }
	},
  	created() {
        if(util.isApp()){
            util.deleteHeadBtn();
        }
        this.hrefParma = util.getHrefParma();
        let that = this;
        that.getElectrCard(that.hrefParma.id);
        that.datas.wcbic=[];
        // 资产编号
        that.datas.id = that.hrefParma.id;
        that.dotwSctm();

    },
    computed: {
        
        
    },
    methods:{
      //显示保修天数
        dotwSctm:function(){
            let that = this;
           
        },
        
        /**
     * 获取电子保修卡详情
     * @parma {number}{1} id 唯一编号
     */
        getElectrCard(id) {
        let that = this;

            // debug start
            //  var response = {"rpco":200,"tsrp":1511920985428,"body":{"gdna":"格力空调KFR-72LW/(72579)FNCa-A3(含管)(红)","sctm":1511920985518,"dotw":1543327484000,"ddl":0,"mfpn":"400-836-5315","wcbic":[{"gid":3,"lbttl":"渠道信息","wcbicc":[{"lbid":304,"lbttl":"销售地址","lbvl":"北京国美四季青桥店","optp":0,"dttp":33}]},{"gid":4,"lbttl":"订单信息","wcbicc":[{"lbid":404,"lbttl":"购买日期","lbvl":"1448633084000","optp":0,"dttp":93},{"lbid":407,"lbttl":"购买价格","lbvl":"1060000","optp":0,"dttp":94}]},{"gid":5,"lbttl":"销售信息","wcbicc":[{"lbid":501,"lbttl":"发票代码","lbvl":"111001274001","optp":0,"dttp":33},{"lbid":502,"lbttl":"发票号码","lbvl":"56691882","optp":0,"dttp":33},{"lbid":503,"lbttl":"付款单位","lbvl":"宋根生","optp":0,"dttp":33},{"lbid":504,"lbttl":"收款单位","lbvl":"国美电器有限公司","optp":0,"dttp":33},{"lbid":505,"lbttl":"发票日期","lbvl":"1448633084000","optp":0,"dttp":93}]},{"gid":6,"lbttl":"商品信息","wcbicc":[{"lbid":603,"lbttl":"商品品牌","lbvl":"格力(GrE)","optp":0,"dttp":33},{"lbid":604,"lbttl":"商品型号","lbvl":"","optp":0,"dttp":33},{"lbid":605,"lbttl":"商品名称","lbvl":"格力空调KFR-72LW/(72579)FNCa-A3(含管)(红)","optp":0,"dttp":33},{"lbid":606,"lbttl":"生产日期","lbvl":"","optp":10,"dttp":93}]},{"gid":8,"lbttl":"用户信息","wcbicc":[{"lbid":802,"lbttl":"会员卡号","lbvl":"0013621127827","optp":0,"dttp":33},{"lbid":803,"lbttl":"用户姓名","lbvl":"","optp":10,"dttp":33},{"lbid":804,"lbttl":"用户电话","lbvl":"","optp":10,"dttp":33}]},{"gid":102,"lbttl":"空调","wcbicc":[{"lbid":10201,"lbttl":"室内机条形码","lbvl":"","optp":11,"dttp":33},{"lbid":10202,"lbttl":"室内机条形码","lbvl":"","optp":11,"dttp":33},{"lbid":10203,"lbttl":"室外机条形码","lbvl":"","optp":11,"dttp":33}]}]}};
            // var rpco = response.rpco,
            //     body = response.body;
            
            //     // 处理
            //     switch(rpco) {
            //         case 200:
            //             body = response.body || {};
            //             // 渲染
            //             that.renderElectrCard(body);
            //             break;
            //         default:
            //             util.tip('查询失败')
            //     }
            //     return;
            // debug end


            // 请求...
            util.api({
                surl: root.AS_API_PATH + 'awwcdtl',
                data: {
                    id: id
                },
                type: 'get',
                success: function(response) {
                    var rpco = response.rpco,
                        body = response.body;

                    // 处理
                    switch(rpco) {
                        case 200:
                            body = response.body || {};
                            // 渲染
                            that.renderElectrCard(body);
                            that.dotw = body.dotw;
                            that.sctm = body.sctm;
                             // 保修剩余天数
            that.dotw = body.dotw - body.sctm;
            console.log(that.sctm)
            that.dotw = isNaN(that.dotw) ? 0 : that.dotw;
             console.log(that.dotw)
            // 未知
            if(!that.dotw) {
                that.unknow = true;
                console.log(that.dotw)
            }
            if(body.ddl == 0){
                // 在保
                if(that.dotw > 0) {
                    that.have = true;
                    // 转为天，并渲染
                    that.dotw = parseInt(that.dotw / 1000 / 60 / 60 / 24) + 1;
                }
                // 过保
                else if(that.dotw < 0) {
                    that.nohave = true;
                }
            }else{
                //数据异常
                that.erroTip = true;
            }  
                            break;
                        default:
                            util.tip('查询失败')
                    }
                }
            });  
        },
             /**
         * 渲染电子保修卡
         * @parma {object}{1} body 电子保修卡对象
         */
        renderElectrCard(body) {
            let that = this;
                // 保修截止时间
                // dotw,
                // // 
                // html = '',
                // // 
                // item,
                // //
                // val;
    
            // 商品名称
            that.gdna = body.gdna || '';
            // 保修剩余天数
            that.dotw = body.dotw;
            that.sctm = body.sctm;
            //数据body
            that.body = body;

            // 渲染数据项
            that.wcbics = body.wcbic || [];
            $.each(that.wcbics,(index,val)=>{
               // console.log(val.gid==6){

               // }
               if(val.gid==6){
                    $.each(val.wcbicc,(ind,v)=>{
                       if(v.lbid==606){
                           v.lbvl = util.formateDate(v.lbvl/1,'yyyy-MM-dd');
                       }
                    })
               }
            })
       },
       // 文本编辑控制器
        maxLennum1(lbid){
            let that = this;
            //如果是用户姓名
            if(lbid == 803){
                that.maxlength10 = 15;
            }
            //如果是用户电话
            else if(lbid == 804){
                that.maxlength10 = 11;
            }
            //如果是日期
            else if(lbid == 606){
                that.maxlength10 = 64;
            }
            that.showSaveButton();

        },
        // 文本编辑控制器，辅助二维码扫描
        maxLennum2(lbid){
             let that = this;
            //如果是唯一标示码
            if(lbid == 607){
                that.maxlength10 = 16;
            }
            that.showSaveButton();
        },
         /**
         * 扫码
         * @parma {object}{1} ipt 目标文本框
         */
        saoma: function(value,lbid,dttp,lbttl) {
            let that = this;
            // 扫码
            that.wcSuccess && wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    var code = res.resultStr || '';
                    // 去除无用前缀
                    code = code.replace(/.*,/, '');
                    // 放入目标元素
                    $("input[id='"+lbid+"']").val(code); // 当needResult 为 1 时，扫码返回的结果
                     //输入信息更改时，去重替换，防止多次存储同一lbid的值
                    for(var i=0;i<that.datas.wcbic.length;i++){
                        if(that.datas.wcbic[i].lbid==lbid){
                            that.datas.wcbic.splice(i,1);
                        }
                    }
                    if(value!=''){
                         //进行数据推入
                         that.datas.wcbic.push({
                                'lbid': lbid,
                                'value': value,
                                'dttp': dttp,
                                'labTxt': lbttl
                            });
                    }
                    util.tip(that.msg.m2);
                    // 显示保存按钮
                    that.showSaveButton();
                }
            });
        },
        //项目内容类型转化
        innerText(ibvl,dttp){
            var val = ibvl || '';
            // TIMESTAMP
            if(dttp == 93){
               // 转为number
               val = parseInt(val);
               // 有效性验证，大于1
               if(val > 1) {
                   val = util.formateDate(val, 'yyyy-MM-dd');
               } 
               // 数据为空，内容显示为空
               else {
                   val = '';
               }
               return val;
            }
            // MONEY
            else if(dttp == 94){
               val && (val = parseFloat(val / 100).toFixed(2));
               return val;
            }
            //非时间和money
            else{
               return val;
            }
        },
        // 获取用户input输入框的值,校验用户输入信息
        print(value,lbid,dttp,lbttl){
            
           let that = this;
           let labTxt = lbttl;

           //存储用户输入信息
           //输入信息更改时，去重替换，防止多次存储同一lbid的值
           for(var i=0;i<that.datas.wcbic.length;i++){
               if(that.datas.wcbic[i].lbid==lbid){
                   that.datas.wcbic.splice(i,1);
               }
           };
           if(value!=''){
                //进行数据推入
                that.datas.wcbic.push({
                       'lbid': lbid,
                       'lbvl': value,
                       'dttp': dttp,
                       'labTxt': lbttl
                   });
           }
           
        },
        //显示保存按钮
        showSaveButton() {
          let that = this;
          // 控制与保存按钮的距离与显示
          that.bdhsft = true;
          that.footer = true;
        },
        //隐藏保存按钮
        hideSaveButton() {
          let that = this;
          // 控制与保存按钮的距离与显示
          that.bdhsft = false;
          that.footer = false;
        },
        // 显示保修须知弹层
        openDialog(){
            let that = this;
            that.nodialog = true;
        },

        // 关闭保修须知弹层
        dialogClose(){
            let that = this;
            that.nodialog = false;
        },
    
        //保存
        saveCard:function(){
            let that = this;
            let result = null;
            // 校验是否有未填项
            let flag = true;
            $("input").each(function(){
                var value = $(this).val();
                if(!value){
                   util.tip('您还有未填写的必填项');
                   flag = false;
                }
            });

            // 校验所填项是否有效
            that.regAll = {
                     // 数字正则
                     INT_REG: /^\d+$/,
                     // 小数正则
                     FLOAT_REG: /^\d+(\.\d+)?$/,
                     // 日期正则
                     DATE_REG: /^(19[7-9][0-9]|2\d{3})-([1-9]|0[1-9]|1[0-2])-([1-9]|[0-2][0-9]|3[0-1])$/,
                     //用户姓名正则
                     NAME_REG:/^[\u4e00-\u9fa5a-zA-Z\D]+$/,
                     //过滤表情符号
                     EMJi_REG:/[\uD800-\uDBFF][\uDC00-\uDFFF]/,
                     //手机号正则
                     PHONE_REG: /^(((1[3|8][0-9])|(14[5|7])|(15[^4,\D])|(17[6|7|8])|(198))\d{8}|(170[0|5|9])\d{7})$/,
                  };

            $.each(that.datas.wcbic,function(index, el) {
                  
                  // //用户输入日期
                  // if(lbid==606){
                  //   that.userDate = value;
                  //   that.userDate
                  // }
                  // //用户输入姓名
                  // else if(lbid==803){
                  //   that.userName = value;
                  // }
                  // //用户输入电话
                  // else if(lbid==804){
                  //   that.userNum = value;
                  // }
       
                  // 数据类型判断
                   switch(el.dttp) {
                       // OBJECT
                       case 0:
                           break;
                       // BYTE
                       case 21:
                           break;
                       // SHORT
                       case 22:
                           break;
                       // INTEGER
                       case 23:// 省略break
                       // LONG
                       case 24:
                           // 整数正则
                           if(el.lbvl && !that.regAll.INT_REG.test(el.lbvl)) { 
                               util.tip('“' + el.labTxt + '”只能为整数哦~');
                               flag = false;
                               // 跳出循环
                               return false;
                           }
                           break;
                       // FLOAT
                       case 25:// 省略break
                       // DOUBLE
                       case 26:
                       // MONEY
                       case 94:
                           // 整数正则
                           if(el.lbvl && !that.regAll.FLOAT_REG.test(el.lbvl)) {
                               util.tip('“' + el.labTxt + '”只能为小数哦~');
                               flag = false;
                               return false;
                           }
                           break;
                       // STRING
                       case 33:
                           //用户姓名
                           if(el.lbvl && (el.lbid == 803) && !that.regAll.NAME_REG.test(el.lbvl)){
                               util.tip( el.labTxt + '格式不正确');
                               flag = false;
                               return false;
                           }
                           else if(el.lbvl && (el.lbid == 803) && that.regAll.EMJi_REG.test(el.lbvl)){
                               util.tip( labTxt + '格式不正确');
                               flag = false;
                               return false;
                           }
                           //用户电话
                           else if(el.lbvl && (el.lbid == 804) && !that.regAll.PHONE_REG.test(el.lbvl)){
                               util.tip( el.labTxt + '格式不正确');
                               flag = false;
                               return false;
                           }
                           //唯一序列号
                           else if(el.lbvl && (el.lbid == 607) &&　that.regAll.EMJi_REG.test(el.lbvl)){
                               util.tip( el.labTxt + '格式不正确');
                               flag = false;
                               return false;
                           }
                           break;
                       // BYTES
                       case 54:
                           break;
                       // TIMESTAMP
                       case 93:
                           // 日期正则
                           if(el.lbvl && !that.regAll.DATE_REG.test(el.lbvl)) { 
                               util.tip('“' + el.labTxt + '”支持格式为“xxxx-xx-xx”');
                               flag = false;
                               return false;
                           }
                           break;
                       // 未知
                       default:
                   }

                   // 数据类型转换
                    switch(el.dttp) {
                        // TIMESTAMP
                        case 93:
                            el.lbvl && (el.lbvl = new Date(el.lbvl.replace(/-/g, '/')).getTime());
                            break;
                    }
            });
            //若校验失败，终止请求
            if(!flag){
              return false;
            }

            // 未进行修改，不提交后台
            if(that.datas.wcbic.length === 0) {
                // 隐藏保存按钮
                that.hideSaveButton();
            } 
            //  去除多与参数，请求后台
            else {
                $.each(that.datas.wcbic,function(index, el) {
                    delete el.dttp;
                    delete el.labTxt;
                });
                that._save(that.datas);
            }
        },
            /**
         * _保存
         * @parma {object} data 修改内容对象
         *        {long} id weiyi编号
         *        {array} wcbic 保修卡基本信息集合
         *          {number} lbid 标签编号
         *          {string} lbvl 标签内容
         */
        _save: function(data) {
            var that = this;
            // debug start
            // console.log(data);
            // var response = {
            //     rpco: 200
            // };
            // var rpco = response.rpco,
            //     body;
            // // 处理
            // switch(rpco) {
            //     case 200:
            //         util.tip(that.msg.m1);
            //         // 隐藏保存按钮
            //         that.hideSaveButton();
            //         break;
            //     default:
            //         util.tip('保存失败')
            // }
            // return;
            // debug end
            
            // 请求...
            util.api({
                surl: root.AS_API_PATH + 'modawwc',
                data: data,
                type: 'post',
                success: function(response) {
                    var rpco = response.rpco,
                        body;
                    // 处理
                    switch(rpco) {
                        case 200:
                            util.tip(that.msg.m1);
                            // 隐藏保存按钮
                            that.hideSaveButton();
                            break;
                        default:
                            util.tip('保存失败')
                    }
                }
            });  
        },
        

       
    	
    },
	components: {
		headerComponent
	}
}

</script>

<style lang="less">
@import '../../util/fs.less';

html,body,#electrcard{
    height:100%;
}
.hsft {
      padding-bottom: 1.173333rem; 
}
#electrcard{
    position:relative;
    height:100%;
    box-sizing: border-box;
    padding-top:1.12rem;
    .i-delete2 {
        width: 0.453333rem;
       height: 0.453333rem;
        background-image: url(//img.dev.gomegj.com/guanjia/v2/delyuan.png);
    }
    .i {
        font-style: normal;
        position: absolute;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        border-radius: 2px;
    }
    
    .wapper{
        padding-top:0;
        width: 100%;
        height:100%;
        min-width: 320px;
        background-color: #f5f5f5;
        overflow-x: hidden;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;


        .topbg {
            color: #fff;
            text-align: center;
            /*height: 3.733333rem;*/
            border-bottom: 1px solid rgba(227,227,227,.4);
            background: #fd4c4c;
            position: relative;
            background-size: contain;
            #bxkxz {
                position: absolute;
                top: 0.266667rem;
                right: 0.32rem;
                font-size: 0.373333rem;
                color: #fff;
                display: inline-block;
            }

            .txt-ct {
                font-size: 0.373333rem;
                padding-top: 0.5rem;
                span {
                    text-indent: 0;
                }
                .txt-big {
                    font-size: 0.933333rem;
                    position: relative;
                }
                .txt-small {
                    display: block;
                }
            }

            .txt-ct-tuwen {
                padding-top: 0.56rem;
                .i{
                    left:0;
                    font-style: normal;
                    position: absolute;
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: contain;
                    border-radius: 2px;
                }
                .txt-big {
                    position:relative;
                    font-size: 0.8rem;
                    display: inline-block;
                }
                .i3 {
                    padding-left: 1.333333rem;
                    .i {
                        top: 0.08rem;
                    }
                    .i-shijian {
                        width: 1.066667rem;
                        height: 1.066667rem;
                        background-image: url(//img.dev.gomegj.com/guanjia/v2/shijian.png);
                    }
                }
                .txt-small {
                    font-size: 0.346667rem;
                    padding-top: 0.16rem;
                    top: 0;
                    left: 0;
                    display: block;
                }
            }

            .gray-layer {
                font-size: 0.426667rem;
                width: 100%;
                margin-bottom: .8rem;
                line-height: .9rem;
            }
        }
        
        ul {
            list-style: none;
            font-size: 0.373333rem;
            line-height:1.173333rem;

            .list-labelvalue li {
                position: relative;
                overflow: hidden;
                label {
                    display: inline-block;
                    position: relative;
                }
            }
            li:not(:last-child) {
                border-bottom: 1px solid rgba(227,227,227,.4);
                position: relative;
            }
            .value {
                color: #333;
                text-align: right;
                max-width: 69%;
                padding-right: 0;
                box-sizing: border-box;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                float: right;
                font-size: 0.373333rem;
            }
            .valueSaoma{
                padding-right: 40px;
            }
        }
        ul:not(:last-of-type) {
            margin-bottom: 0.266667rem;
        }
        .list-labelvalue {
            font-size: 0.373333rem;
            line-height: 1.173333rem;
            background-color: #fff;
            padding-left: 0.32rem;
            padding-right: 0.32rem;
            .rd-st:after {
                content: '*';
                color: #ff4b46;
                position: relative;
                top: .1rem;
                right: -0.1rem;
            }

            .btn-opct {
                width: 1.173333rem;
                height: 1.173333rem;
                position: absolute;
                top: 0;
                right: -0.213333rem;
                .i-saoma {
                    width: 0.613333rem;
                    height: 0.613333rem;
                    background-image: url(//img.dev.gomegj.com/guanjia/v2/saoma.png);
                    font-style: normal;
                    position: absolute;
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: contain;
                    border-radius: 2px;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                     margin: auto;
                }
            }
        }

        .tip {
            color: #666;
            font-size: 0.373333rem;
            padding: 0.133333rem 0.32rem 0.746667rem;
            text-align: left;
            line-height: 1.3;

            .cl-yl {
                color: #ff4b46;
                font-size: 0.48rem;
            }
            .link {
                color: #4986f7;
                margin-top: 0.16rem;
                float: right;
                font-size: 0.373333rem;
            }
        }

    }

    .footer {
        width: 100%;
        background-color: #ff4b46;
        position: fixed;
        left: 0;
        bottom: 0;

        .btn {
             margin-top: 0.08rem;
        }
        .btn-footer {
            background: #ff4a4b;
            color: #fff;
            text-align: center;
            line-height: 1.173333rem;
            display: block;
            margin: 0 0.32rem;
        }
    }

    .dialog{
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.5);
        display: table;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9999980;
        .tablecell {
            text-align: center;
            vertical-align: middle;
            display: table-cell;

            .dialog-context {
                color: #666;
                font-size: 0.32rem;
                text-align: left;
                width: 7.2rem;
                line-height: 0.48rem;
                background-color: #fff;
                display: inline-block;
                border-radius: 15px;

                .ttl {
                    color: #333;
                    font-size: 0.48rem;
                    line-height: 0.506667rem;
                    padding: 0.346667rem 0.933333rem 0.346667rem 0.666667rem;
                    background-color: #eee;
                    position: relative;
                    border-radius: 15px 15px 0 0;
                }
                .opctbig {
                    width: 1.173333rem;
                    height: 1.173333rem;
                    position: absolute;
                    top: 0;
                    right: 0;
                    .i {
                        top: 0.346667rem;
                        right: 0.346667rem;
                    }
                }

                .txt {
                    text-indent: 0;
                    padding: 0.293333rem 0.4rem 0.72rem;
                    text-indent: 0;

                    .clred {
                        color: #c00;
                        font-size: 0.373333rem;
                        line-height: 0.48rem;
                        padding: 0.266667rem 0 0.186667rem;
                        display: block;
                    }
                }

            }
        }
    }
    
   
}


</style>