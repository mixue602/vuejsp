<template>
  <div class="wapper">
        <header-component :title="title" :rightmenus="rightmenus" :direction="1" @watchlist="addrAdd" @watchdirection="goBack"></header-component>

        <!-- <span class="icon-addradd" @click="addrAdd"><img src="http://gfs11.gomein.net.cn/T1QQJvB7AT1RCvBVdK.png" v-show="showadd"></span> -->
        <div class="container">
            <ul v-if="rpco==200" id="addr-list" class="addr-list">
                <li v-for="(item,index) in addlist">
                  <div class="addr-info-con">
                    <div class="addr-info bdr-bottom">
                        <p class="addr-tit">
                          <span class="name">{{item.cname}}</span>
                          <span class="tel">{{item.cphone|phonereg}}</span>
                        </p>
                        <p class="addr-detail">{{item.region}} {{item.addr}}</p>
                    </div>
                    <p class="set" v-show='page' @click="chooseAddr" :tsup="item.tsup"  :class='{"setcheck":item.tsup==hrefParma.tsup}' ></p>
                  </div>
                  <div class="addr-opera" @click="addrOprea" :tsup="item.tsup">
                  <p class="default"  :class='{"check":item.default}' ><span v-show='!page'>设为默认地址</span></p>
                      <p class="addr-opera-btn">
                        <a href="javascript:;" class="edit">编辑</a>
                        <a href="javascript:;" class="del">删除</a>
                      </p>
                  </div>
                </li>
            </ul>
            <div v-if="rpco==404 || rpco==20011" class="tuwen">
                <div class="tu">
                  <i class="i i-noaddr"></i>
                </div>
                <p class="wen">哇！您还没有地址哦</p>
                <p class="tip">赶快添加吧！</p>
            </div>
        </div>

</template>
<script type='text/ecmascript-6'>
  var root = window || {},
    util = root.util || {};

  import headerComponent from "../../components/HeaderComponent";
  export default {
  data() {
      return {
        showadd:true,
        rpco:'',
        title:"常用地址",
        daddr:'',//常用默认地址主键
        addlist:[], //地址集合，
        hrefParma:util.getHrefParma(),
        page:util.getHrefParma().page || 0,
        rightmenus:{      //删除按钮
              type: "text",
              content: "",
        }

      }
  },
  created() {
    let that = this;
    //   util.removeSession('repairsaveasse');
    // this.hrefParma = util.getHrefParma();
    // this.hrefParma.arcode = this.hrefParma.arcode ? this.hrefParma.arcode : 100000;
    // this.title = this.hrefParma.eacnm + "维修";
    that._getAddressList();
    if(util.isApp()){
      util.deleteHeadBtn();
    }
  },
  filters: {
        phonereg(phone) {
            return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        }
  },
  mounted(){
    let that = this;
    that.rightmenus={
        type: "img",
        content: "//gfs11.gomein.net.cn/T1QQJvB7AT1RCvBVdK.png",
    };
    if(util.isApp()){
        that.setHeadBar();
    }
    // that.$nextTick(function () {
    //    if(util.isApp()){
    //       that.setHeadBar();
    //   }
    // })
  },
  methods:{
    goBack: function(){
      let that = this;
      if(that.page){
        that.jump();
      } else{
        util.href('me.html');
      }

    },
    setHeadBar(){
      var that = this;
        GomeJSBridge.ready(function(){
          let param = {
            title :'常用地址',
            menus : {
              rightMenus:[
                {
                  type:'callback',
                  title:'常用地址',
                  icon:'http://gfs13.gomein.net.cn/T1Q8hQB7ZT1RCvBVdK.png',
                  data:{
                    id:'btn1',
                    name:'常用地址',
                    desc:'常用地址'
                  }
                }
              ]
            }
          };
          util.setHeadBar(param);
        },null);

        GomeJSBridge.onCallback(function(data){
          if(data.id == "btn1"){
            // $('.icon-addradd').remove();
            that.addrAdd();
            // util.href('./addressadd.html');
          }
        })

    },
    /*从其他页面跳转来，选择地址*/
    chooseAddr(e){
        var that = this;
        var targetEle = $(e.target);
        $('li .addr-info').removeClass('active');
        $('.setcheck').removeClass('setcheck')
        targetEle.addClass('setcheck');
        targetEle.closest('.addr-info').addClass('active');
        var tsup = targetEle.attr('tsup');
        that.hrefParma.tsup=tsup;
        that.jump();

    },

    jump(){
      var that = this;
      var jumpUrl;

       switch(that.page){
            case 'repair':
                jumpUrl = 'repairappoint.html';
                break;
             case 'repair1':
                jumpUrl = 'repairsubmit.html';
                break;
             case 'repairorder':
                jumpUrl = 'repairsubmitorder.html';
                break;
            case 'tclrepair':
                jumpUrl = 'tclrepairsubmit.html';
                break;
            case 'tclsa':
                jumpUrl = 'tclsasubmit.html';
                break;
            case 'recycle':
                jumpUrl = 'recyclesubmit.html';
                break;
            case 'recycle1':
                jumpUrl = 'recyclesubmit.html';
                break;
            case 'clean':
                jumpUrl = 'cleansubmitorder.html';
                break;
            case 'install':
                jumpUrl = 'cleansubmitorder.html';
                break;
            case 'clean1':
                jumpUrl = 'cleansubmit.html';
                break;

            case 'quickrepair':
                jumpUrl = 'quickrepair.html';
                //that.options.pageid=1;
                break;
            case 'quickrecycle':
                jumpUrl = 'quickrecycle.html';
                //that.options.pageid=1;
                break;
            case 'cleansubmitorder':
                jumpUrl = 'cleansubmitorder.html';
                //that.options.pageid=1;
                break;
            case 'goodsorder':
                jumpUrl = 'goodsorder.html';
                //that.options.pageid=1;
                break;
            // case 'quickrecycle':
            //     jumpUrl = 'quickappoint.html';
            //     that.options.pageid=2;
            //     break;
            // case 'quickrecycle1':
            //     jumpUrl = 'quickrecycle.html';
            //     that.options.pageid=2;
            //     break;
            // case "goods":
            //     jumpUrl = "goodsorder.html";
            //     break;
        }
        setTimeout(function() {

            util.href(jumpUrl, that.hrefParma);
        }, 300);

    },
    addrAdd(){
      var that = this;
      if($('#addr-list li').length>=20){
        that.showadd = false;
        util.tip('最多添加20条地址');
        return  false;
      }
      that.showadd = true;
      var that = this;
      that.hrefParma.tsup = 0 //0新增，1修改
      util.href("addressadd.html",that.hrefParma);
    },
     /**
     * 获取常用地址列表
     */
    _getAddressList(){
        var that = this;
        util.api({
             surl:root.MB_API_PATH  + 'addrlist',
             data:{len: 60},
            //surl: '/member/addrlist',
            type: 'get',
            beforeSend: function() {
                // 加载提示
                // util.comShow({
                //     txt: '正在努力加载中…',
                //     icl: 'i-load ro360'
                // });
                // debugger;
            },
            success: function(res) {
               that.rpco = res.rpco;
               if(res.rpco==200||res.rpco==20011){
                  var body = res.body || {};
                  that.daddr = body.daddr || '';
                  that.addlist = body.addlist || [];
                  if(that.addlist.length==1){
                      that._setDefault(that.addlist[0].tsup);
                  }
               }else{
                  util.tip('获取地址列表失败');
               }

            }
            // complete: function() {
            //     // 移除提示
            //     util.remComShow();
            // }
        });
    },

    addrOprea(e){
      var that = this;
      var targetEle = $(e.target);
      var tsup = $(targetEle).closest('.addr-opera').attr('tsup');
      if(targetEle.hasClass('edit')){
        // util.setHrefParma(window.location.href,{tsup:tsup})
        let temp = util.getHrefParma();
        temp.tsup = tsup;
        // util.href('addressadd.html',{'tsup':tsup});
        util.href('addressadd.html',temp);
        // util.href('addressadd.html',temp);


      }else if(targetEle.hasClass('del')){
        util.alert('确定删除该地址？', {
            justOk: false,
            okFn: function() {
              //删除
               util.api({
                  surl: root.MB_API_PATH + 'modaddr',
                  data: {'tsup':tsup,'state':3},
                  type: 'post',
                  success: function (response) {
                      var rpco = response.rpco;
                      if(rpco==200){
                        $(targetEle).closest('li').remove();
                        util.tip('删除成功');
                        setTimeout(function(){
                          let temp = util.getHrefParma();
                          temp.tsup = tsup;
                          that._getAddressList();
                          util.setHrefParma(window.location.href,{tsup:tsup})
                          // util.href("address.html",temp);
                        },500)
                      } else{
                        util.tip('删除失败');
                      }
                  }
              });

            }
        });


      }else if(targetEle.hasClass('default')){
        //设为默认
        that._setDefault(tsup,targetEle);
      }
    },

    _setDefault(tsup,targetEle){
      var that = this;
      util.api({
            surl:root.MB_API_PATH  + 'setDef?tsup='+tsup,
            // surl:root.MB_API_PATH  + 'setDef?tsup=200000760109',
            // data:{'tsup': '200000760109'},
            type: 'post',
            success: function(res) {
               // that.rpco = res.rpco;
               if(res.rpco==200){
                if(targetEle){
                    let temp = util.getHrefParma();
                    temp.tsup = tsup;
                    that._getAddressList();
                    util.setHrefParma(window.location.href,{tsup:tsup})
                   // util.href("address.html");
                }else{
                  if(!$('.default').hasClass('check')){
                    $('.default').addClass('check');
                  }
                }

                // if(targetEle){
                //   $('.addr-opera .check').removeClass('check');
                //   targetEle.addClass('check');

                // } else{
                //   if(!$('.default').hasClass('check')){
                //     $('.default').addClass('check');
                //   }
                // }
               } else{
                  util.tip('设置默认地址失败')
               }
            }
        });
    },

    _getModels(brdid,currentindex) {
      var that = this,
          hrefParma = this.hrefParma;
          if(!!that.modelsObj[brdid]){
            that.goodsObj.goods = that.modelsObj[brdid];
            this.currentindex = currentindex || 0;
            return;
          }
        util.api({
            surl:root.REPAIR_API_PATH+'queryModelsByBrand?arcode='+ hrefParma.arcode +'&eacid='+ hrefParma.eacid +'&brdid='+brdid,
            type:'get',
            success: function(res) {
                if(res.rpco === 200) {
                    that.goodsObj.goods=res.body.models;
                    that.modelsObj[brdid]= res.body.models;
                    that.currentindex = currentindex || 0;
                    that.render = true;
                }
            },
            error: function() {}
        });
    },

  },
  components: {
    headerComponent
  }
}
</script>
<style lang="less">
  @import "../../util/fs.less";
    .wrap img{
        width: 100%;
    }
    .icon-addradd{
      width: 0.56rem;height: 1.173333rem;display: block;position: fixed;top:0;right:0.4rem;z-index: 9999;display: flex;justify-content: center;align-items: center;
      img{width: 100%;}
    }
    .addr-list{
      li{
        background: #fff;margin-bottom: 0.266667rem;color: #333;
        .active{color:#ff4a4b;}
        .addr-info-con{
          display: flex;
          justify-content: space-between;
          align-items: center;
          .addr-info{
            padding: 0.32rem;
            .addr-tit{
              color: #666;.mixinfont(16px);
              .name{margin-right: 1.2rem}
            }
            .addr-detail{.mixinfont(13px);line-height: 0.506667rem;}
          }
          .set{width:0.426667rem;height: 0.426667rem;background: url(img/uncheck.png) no-repeat;background-size:auto 100%; padding-right:0.32rem; }
          .setcheck{background: url(img/check.png) no-repeat;background-size:auto 100%;}

        }
        .addr-opera{
          padding: 0.32rem;color: #777;display: flex;justify-content:space-between;align-items: center;
          .default{align-self: flex-start;padding-left: 0.693333rem;background: url(img/uncheck.png) no-repeat;background-size:auto 100%;}
          .default.check{background: url(img/check.png) no-repeat;background-size:auto 100%;}
          /*.uncheck{}*/
          .addr-opera-btn{
             align-self: flex-end;
            .edit{background: url(img/edit.png) no-repeat;background-size:auto 100%;padding-left: 0.56rem;padding-right: 0.48rem;}
            .del{background: url(img/delete.png) no-repeat;background-size:0.426667rem 0.426667rem;padding-left: 0.56rem;}

          }
        }
      }
    }
/*无地址样式*/
.tuwen{
  .mixinfont(16px);
  background: #fff;
  text-align: center;
  padding: 1.333333rem 0;
  .tu {
          text-align: center;

          padding-bottom: 0.4rem;
          text-align: center;
          .i {
              display: inline-block;
              position: static;
          }
          .i-noaddr {
              background: url(//gfs10.gomein.net.cn/T1PQJvBgA_1RCvBVdK.png) no-repeat;
              background-size: 100%;
             /* width: 0.706667rem;
              height: 0.866667rem;*/
              display: inline-block;
              width: 1.4rem;
              height: 1.733333rem
          }
        }
  .wen {
    /*padding-top: 0.2rem;*/
  }
  .tip {
    line-height: 0.24rem;
    text-align: center;
    color: #999;
    .mixinfont(12px);
    padding-top: 0.266667rem;

  }
}

  /*加载样式*/

   /* .tuwen {
      font-size: .16rem;
      line-height: .18rem;
      width: 100%;
      height: 100%;
      background: #fff;
      .tu {
          width: 100rem;
          display: table-cell;
          padding-top: .6rem;
          padding-bottom: .16rem;
          vertical-align: middle;
          text-align: center;
          .i {
              display: inline-block;
              position: static;
          }
        }
    }
    .ro360 {
      -webkit-animation: aniro360 .8s linear infinite;
    }
    .i-load {
      width: .92rem;
      height: .89rem;
      background-image: url(//img.dev.gomegj.com/guanjia/v2/load.png);
    }
    .i {
        font-style: normal;
        position: absolute;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        border-radius: 2px;
    }
    .maxtop
    {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1000;
    }*/

</style>


