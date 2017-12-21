<template>

  <div class="wapper">
      <header-component :title="title" :direction="1"  @watchdirection="goBack"></header-component>
     <ul class="newaddrlist">
          <!-- <li class="bdr-bottom">
            <label class="an">联系人：</label>
            <input class="js-number" v-model='cname' type="text">
          </li> -->
          <li class="bdr-bottom" @click="click_bor_active('userBor')" :class="[userBor ?'bor-active':'']">
            <label class="an">联系人：</label>
            <input class="js-phone" v-model='cname' type="text"  placeholder="请输入联系人">
            <span class="del" @click="clear_input('cname')" style="display:none" v-show="cname.length>0"></span>
          </li>
          <li class="bdr-bottom" @click="click_bor_active('phoneBor')" :class="[phoneBor ?'bor-active':'']">
            <label class="an">联系电话：</label>
            <input class="js-phone" @input='changeVcode' v-model='cphone' type="tel" placeholder="请输入手机号"  maxlength="11" >
            <span class="del" @click="clear_input('cphone')" style="display:none" v-show="cphone.length>0"></span>
          </li>
          <li id="papersNum" class="bdr-bottom" v-if="firsbindtel&&cphone">
              <label class="an">验证码：</label>
              <input class="js-number" id="vcode" v-model='code' placeholder="请输入验证码" maxlength="6">
              <input class="js-number" v-mode='validrand' type="hidden">
              <input class="js-number" v-mode='mob' type="hidden">
              <span class='bdr-l' id="sendCode" @click='getVcode' :class='{"on":vcodeOn}'>获取验证码</span>
          </li>
      </ul>
      <select-addr :region="region" :province="province" :city="city" :area="area" :town="town" @areacode = "areacode" @iscomplete='iscomplete'></select-addr>
      <ul class="newaddrlist" >
          <li class="bdr-bottom" @click="click_bor_active('detailBor')" :class="[detailBor ?'bor-active':'']">
            <label class="an">详细地址：</label>
            <input class="js-phone" v-model='addr' type="text"  placeholder="请输入详细地址">
            <span class="del" @click="clear_input('addr')" style="display:none" v-show="addr.length>0"></span>
          </li>
      </ul>
      <p class="remarks">未绑定手机号用户首次下单需验证手机号</p>
      <a href="javascript:;" class="save" :class='{"activebtn":cname&&cphone&&mark&&addr}'  @click='saveAddr'>保存</a>

  </div>
</template>
<script type='text/ecmascript-6'>
  var root = window || {},
    util = root.util || {};

  import headerComponent from "../../components/HeaderComponent";
  import selectAddr from "../../components/SelectAddr";
  export default {
  data() {
      return {
        // isActive:false,
        userBor:false,
        phoneBor:false,
        detailBor:false,
        title:"新增地址",
        firsbindtel:false,
        vcodeOn:false,
        addressinfo:{// 区县编码
            area: '',
            // 联系人姓名
            cname: '',
            // 联系电话
            cphone: '',
            // 社区地址
            addr: '',
            // 门牌号
            hnum: '',
            // 变更时间戳
            tsup: '',
            state: 1,
            mod: 55
        },
        mark:false,
        area:'', //区县编码。
        cname:'',//联系人姓名
        cphone:'',//联系电话
        addr:'',//社区地址
        hnum:'',//门牌号
        tsup:'',//变更时间戳
        mod:55, //AREA = 1     CNAME = 2   CPHONE = 4     ADDR = 16    HNUM = 32,
        code:'',
        validrand:'',
        mob:'',
        province:'',//地址一级
        city:'',//地址二级
        area:'',//地址三级
        town:'',//地址四级
        hrefParma: util.getHrefParma(),
        phoneReg: /^(((1[3|4|5|7|8][0-9]))\d{8})$/, // 手机号正则
        // 联系人正则 汉字 字母
        cnameReg: /^[\u4e00-\u9fa5a-zA-Z]{1,30}$/,
        // 社区地址正则  汉字 字母 数字 或 _ -:/^[\u4e00-\u9fa5a-zA-Z0-9\-\_]{0,20}$/
        //汉字、字母、数字或符号
        addrReg:/^[\u4e00-\u9fa5a-zA-Z0-9\D]{6,28}$/,
        // addrOReg:/[`~!！@$%^&*_-——+<《》>?？；;"\/']/,
        addrOReg:new RegExp("[`~!@$^&*=':;'\\[\\]<>/?~！@￥……&*——【】‘；：”“'、？%+_]"),
        //匹配空格
        konggeReg:/\s+/,
        //emoji 表情
        emojiReg:/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g,
        //门牌号正则 汉字、字母、数字或符号
        // hnumReg:/^[\u4e00-\u9fa5a-zA-Z0-9\D]{1,32}$/,
        // 常用住址详情
        //判断是哪个页面跳转过来的
        district: '',
        requestState:{
            getSendCodePhone: true,
            sendCode: true,
            checkCode: true,
            save: true
        },
        msg: {
            m1: '联系人不能为空',
            m2: '联系电话不能为空',
            m3: '请选择所在地区',
            m4: '社区地址不能为空',
            m5: '门牌号不能为空',
            m6: '跳转页面，将失去当前录入的信息',
            m7: '请输入正确的手机号',
            m8: '联系人只能输入1-30个汉字或字母',
            m9: '社区地址不能包含空格',
            m10: '社区地址只支持6~28个字符',
            m11: '常用地址超限，请删除部分地址后添加',
            m12: '已编辑信息尚未保存，确定要返回吗？',
            m13: '门牌号不能包含空格',
            m14: '门牌号只支持1~32个字符',
            m15: '社区地址不能包含emoji表情',
            m16: '联系人只支持1~32个字符',
            m17: '门牌号不能包含emoji表情'
        },
        // 请求状态，用于ajax请求
        // requestState: {
        //     save: true
        // }

      }
  },
  created() {
    let that = this;
    that.init();
    if(util.isApp()){
      util.deleteHeadBtn();
    }

  },
  methods:{
    init(){
      var that = this;
      var hrefParma = util.getHrefParma();
      that.tsup = hrefParma.tsup; //地址
      if(that.tsup>0){
        that.mark = true;
        that.title = "修改地址";
        util.api({
            surl: root.MB_API_PATH + 'getAddr?tsup='+that.tsup,
            type: 'get',
            beforeSend: function () {
                // that.options.requestState.save = false;
            },
            success: function (response) {
                var rpco = response.rpco;
                var body = response.body;
                if (rpco==200) {

                  that.tsup=body.tsup;   //地址id
                  that.cname=body.cname;   //联系人姓名。
                  that.cphone =body.cphone; //联系电话。
                  that.area=body.area;    //第三级编码
                  that.region =body.region; //常用地址三级地址。注：省+市+区。
                  that.addr =body.addr;   //社区地址。例：霄云路鹏润大厦B座5层。
                  that.hnum =body.hnum;   //门牌号。
                  that.province =body.province;   //第一级编码
                  that.city =body.city;   //第二级编码
                  that.town =body.town ;  //第四级编码

                };
            },
            complete: function () {
                // that.options.requestState.save = true;
            }
        });
      }
    },
    //点击返回按钮
   goBack: function(){
      let that = this;
      util.alert('您确定要放弃添加地址吗吗？',{
          justOk: false,
          okBtnText:'确定',
          cancelBtnText:'取消',
          okFn: function() {
            document.activeElement.blur();
             let temp = util.getHrefParma();
             util.href('./address.html',temp);
              // util.href('goodsindex.html');
          }
      });

    },
    iscomplete(mark){
      this.mark = mark;
    },
    click_bor_active(key){
      var self = this;
      this[key] = true;
      setTimeout(function(){
        self[key] = false;
      },1000)
    },
    clear_input(val) {
      this[val] = "";
    },


    changeVcode(){

      var that = this;
      // this.isactive();
      if(this.cphone.length==11 && !/[0-9]+/g.test($("#sendCode").text())){
          util.api({
              surl: root.LOGIN_API_PATH + 'validmodbind',
              type: 'post',
              beforeSend: function () {
                  // that.options.requestState.save = false;
              },
              success: function (response) {
                  var rpco = response.rpco,
                      isbind = response.body;
                  if (rpco==200&&isbind) {
                     that.firsbindtel = true;
                     that.vcodeOn = true;
                     // that.getVcode();
                  };
              },
              complete: function () {
                  // that.options.requestState.save = true;
              }
          });

      }
    },
     // 获取验证码
    getVcode(){
        let that = this;
        if(!that.requestState.sendCode) return;
        if(that.cphone.length!=11 || !that.vcodeOn){
            return;
        }
        // 请求
        util.api({
            surl: root.LOGIN_API_PATH + 'sendcode?mob='+that.cphone,
            type: 'get',
            beforeSend: function() {
                that.requestState.sendCode = false;
            },
            success: function(response) {
                var body,
                rpco = response.rpco;
                switch(rpco) {
                    // 正常
                    case 200:
                        body = response.body || {};
                        // 倒计时
                        that.countDown();
                        // 验证码生成时间戳
                        that.validrand = body.validrand;
                        that.mob = body.mob

                        // that.uiqcd = body.uiqcd;
                        // that.subPhone = that.phoneNum;
                        break;
                    case 20002:
                        util.tip("验证码发送频繁。");
                        break;
                    case 20003:
                        util.tip("验证码达到每小时上限。");
                        break;
                    default:
                        break;

                }
            },
            complete: function(response) {
                // 启用按钮
                (response.rpco !== 200) && (that.requestState.sendCode = true);
            },
            error:function() {
                that.requestState.sendCode = true;
            }
        });
    },
    // 倒计时
    countDown() {
        var that = this;
        that.vcodeOn = false;
        util.countDown({
            elem: $('#sendCode'),
            downTime: 60,
            formate: 'countS后重试',
            callback: function() {
                $('#sendCode').text("重新发送")
                that.changeVcode();
            }
        });
    },
    region(){

    },
    areacode(code){
      // this.area = code;

    },
      /**
     * _保存
     * @parma {object}{1, 0} address 地址详情
     */
    _save: function(addressinfo) {
        var that = this;
        util.api({
            surl: root.MB_API_PATH + 'modaddr',
            data: addressinfo,
            type: 'post',
            beforeSend: function () {
                // that.options.requestState.save = false;
            },
            success: function (response) {
                var rpco = response.rpco,
                    body = response.body || {};
                // 处理
                switch (rpco) {
                    // 正常
                    case 200:
                        util.tip('保存成功');
                        setTimeout(function(){
                          let temp = util.getHrefParma();
                          util.href('./address.html',temp);

                        },50);
                        break;
                    case 20001:
                        util.tip('地址至多60个，请先删除已有地址再添加');
                        break;
                    case 40004:
                        util.tip('请输入正确的手机号');
                        break;
                    case 40005:
                        util.tip('门牌号仅支持输入6~28个字符，格式支持汉字、字母、数字或符号，不可使用emoji表情或空格');
                        break;
                    case 40001:
                        util.tip('输入格式不正确');
                        break;
                    case 40009:
                        util.tip('您输入的地址已存在，请重新输入');
                        break;
                    case 40021:
                        util.tip('请输入验证码');
                        break;
                    case 40020:
                        util.tip('验证码输入错误');
                        break;
                    case 1013:
                        util.tip('该手机号已经被使用，请重新输入');
                        break;
                    default:
                        util.tip('服务器繁忙，请稍后再试');
                }
            },
            error : function(){
              util.tip('服务器繁忙，请稍后再试');
            },
            complete: function () {
                // that.options.requestState.save = true;
            }
        });

    },
    /**
     * 保存
     */
    saveAddr: function() {
       document.activeElement.blur();
        var that = this;
        //     //tsup = that.options.hrefParma.tsup1 || '',
        //     area = $("#region").attr("did"),
        //     cname = $('#cname').val(),
        //     cphone = $('#cphone').val(),
        //     addr = $('#addr').val();
        //     // hnum = $('#hnum').val();
        // that.options.address.tsup = that.options.hrefParma.tsup;
        // // 允许请求
        // if(!that.options.requestState.save) { return false; }
        var regionId = $('#region')
        that.province = regionId.attr('pid');//地址一级
        that.city = regionId.attr('cid');//地址二级
        that.area = regionId.attr('did');//地址三级
        that.town = regionId.attr('tid');//地址四级
        // 联系人有效性验证
        if(!that.cname) {
            util.tip(that.msg.m1);
            return false;
        }
        // if(that.code){
        //   if(that.code!=that.validrand) {
        //       util.tip("验证码输入不正确");
        //       return false;
        //   }
        // }

        if(!that.cnameReg.test(that.cname)) {
            util.tip(that.msg.m8);
            return false;
        }
        if(!that.cphone) {
            util.tip(that.msg.m2);
            return false;
        }
        if(!that.phoneReg.test(that.cphone)) {
            util.tip(that.msg.m7);
            return false;
        }
        if(!that.area&&!that.province&&!that.city&&!that.town) {
            util.tip(that.msg.m3);
            return false;
        }
        //社区地址校验
        if(!that.addr.trim()) {
            util.tip(that.msg.m4);
            return false;
        }

        if(that.emojiReg.test(that.addr)){
            //util.tip(that.options.msg.m15);
            util.tip('输入格式不正确');
            return false;
        }
        if(!that.addrReg.test(that.addr.trim())) {
            util.tip('输入格式不正确');
            return false;
        }
        if(that.addrOReg.test(that.addr.trim())) {
            util.tip('输入格式不正确');
            return false;
        }

        // 常用地址详情
        // $.extend(that.addressinfo, );

        // 事件戳为空时为新增操作
        // that.addressinfo.tsup || (delete that.addressinfo.tsup);
        // 保存
        var jsondata = {
            province:that.province,//地址一级
            city:that.city,//地址二级
            area:that.area,//地址三级
            town:that.town,//地址四级
            cname: that.cname,
            cphone: that.cphone,
            addr: that.addr,
            hnum: '',
            tsup:that.tsup,
            state: 1,
            mod:that.mod,
            validrand:that.validrand,
            code:that.code,
            mob:that.mob

        }
        that._save(jsondata);
    }

  },
  components: {
    headerComponent,
    selectAddr
  }
}
</script>
<style lang="less">
  @import "../../util/fs.less";

    .newaddrlist{
        background-color: #fff;
        #papersNum{
          input{width: 4.266667rem;}
        }
        li{
          box-shadow: inset 0 -1px 1px -1px #ddd;
            position: relative;
            &.bor-active:before{
              -webkit-transition: -webkit-transform 1s;
                transition: transform 1s;
                -webkit-transform: scale3d(1, 1, 1);
                transform: scale3d(1, 1, 1);
            }
            &:before{
              box-sizing: border-box;
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              height: 100%;
              width: 100%;
              -webkit-transform-origin: center;
                -ms-transform-origin: center;
                transform-origin: center;
                border-bottom: 1px solid #666;
                -webkit-transform: scale3d(0, 1, 1);
                transform: scale3d(0, 1, 1);
            }
            /*width: 100%;*/
            padding: 0.266667rem 0.32rem;
            height: 0.666667rem;
            line-height:0.666667rem;
            .mixinfont(14px);
            input{
                /*margin-left: 0.533333rem;*/
                width:6.266667rem;
            };
            #sendCode{
                width: 2.666667rem;
                float: right;
                text-align: right;
                color: #FFB7B5;
                &.on{
                    color:rgb(255, 75, 70);
                }
            }
            .del{
              position: absolute;
              top: 0rem;
              right: 0.32rem;
              background: url(//gfs11.gomein.net.cn/T1c_xvBsZj1RCvBVdK.png) center center no-repeat;
              background-size: (28/75)*1rem auto;
              width: 0.533333rem;
              height: 100%;
              /*.px2rem(width,40);
              .px2rem(height,72);*/
              &.active{
                background: url(//gfs11.gomein.net.cn/T1.LYvBTKj1RCvBVdK.png) center center no-repeat;
                background-size: (28/75)*1rem auto;
              }
            }
        }
    }
    .remarks{color: #999;.mixinfont(12px);padding:0.266667rem 0.32rem;}
    .save{width: 7.866667rem;height: 1.2rem;border-radius: 1.066667rem;text-align: center;line-height:1.2rem;.mixinfont(18px); background: #e0e0e0; margin:0.933333rem auto;display: block;color: #fff;}
    .activebtn{background: #ff4b41;}
</style>


