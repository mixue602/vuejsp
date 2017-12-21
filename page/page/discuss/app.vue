<template>
  <div class="wapper">
    <Headtop :title="title" :rightmenus="rightmenus" :direction="1" @watchlist="submit" @watchdirection="goback"></Headtop>
    <div class="discuss-good-list" v-if="orderType === 1" v-for="(list,index) in lists.body.svlt">
      <div class="discuss-good-top clearfix">
        <div class="f-l">
          <img :src="list.sviul" />
        </div>
        <div class="discuss-good-info">
          <div>{{list.svna}}</div>
          <div class="clearfix">
            <span v-for='(n, i) in 5' :class="[{active: i < score[index] },'']" @click="discussStart(index, i)"></span>
          </div>
        </div>
      </div>
      <div class="discuss-good-insert">
        <div>
          <textarea maxlength="500" placeholder="说点什么吧，可以获得美豆噢~~" v-model="content[index]"></textarea>
        </div>
        <Upload @watchupload="upload" :upnum="index"></Upload>
        <p class="tips">没图没真相，给小伙伴们晒一晒，晒单通过可以获得美豆~~</p>
        <!-- <div class="clearfix discuss-good-notice">
          <span :class="[{'discuss-people-showname': hide[index] === 0 , 'discuss-people-nsname': hide[index] === 1 },'']" @click="changeName(index,hide[index])">匿名评价</span>
          <span class="f-r">你写的评价会以匿名的形式展现</span>
        </div> -->
      </div>
    </div>
    <div class="discuss-good-list" v-if="orderType === 2" v-for="(list,index) in lists.body.glt">
      <div class="discuss-good-top clearfix">
        <div class="f-l">
          <img :src="list.gdiul" />
        </div>
        <div class="discuss-good-info">
          <div>{{list.gdna}}</div>
          <div class="clearfix">
            <span v-for='(n, i) in 5' :class="[{active: i < score[index] },'']" @click="discussStart(index, i)"></span>
          </div>
        </div>
      </div>
      <div class="discuss-good-insert">
        <div>
          <textarea maxlength="500" placeholder="说点什么吧，可以获得美豆噢~~" v-model="content[index]"></textarea>
        </div>
        <Upload @watchupload="upload" :upnum="index"></Upload>
        <p class="tips">没图没真相，给小伙伴们晒一晒，晒单通过可以获得美豆~~</p>
        <!-- <div class="clearfix discuss-good-notice">
          <span :class="[{'discuss-people-showname': hide[index] === 0 , 'discuss-people-nsname': hide[index] === 1 },'']" @click="changeName(index,hide[index])">匿名评价</span>
          <span class="f-r">你写的评价会以匿名的形式展现</span>
        </div> -->
      </div>
    </div>
    <div class="discuss-good-last" v-if="lists.body.mkits.length > 0 ">
      <div class="discuss-good-ltitle">服务评价</div>
      <div class="clearfix" v-for="item in lists.body.mkits">
        <dfn class="f-l" v-if="item==4">门店评分</dfn>
        <dfn class="f-l" v-if="item==1">配送评分</dfn>
        <dfn class="f-l" v-if="item==2">安装评分</dfn>
        <dfn class="f-l" v-if="item==3">服务评分</dfn>
        <span v-if="item == 4" v-for="(n, index) in 5" :class="[{active: index < scoreList.spscore },'']" @click="changeStart(index, item)"></span>
        <span v-if="item == 1" v-for="(n, index) in 5" :class="[{active: index < scoreList.drscore },'']" @click="changeStart(index, item)"></span>
        <span v-if="item == 2" v-for="(n, index) in 5" :class="[{active: index < scoreList.inscore },'']" @click="changeStart(index, item)"></span>
        <span v-if="item == 3" v-for="(n, index) in 5" :class="[{active: index < scoreList.brscore },'']" @click="changeStart(index, item)"></span>
      </div>
    </div>
  </div>
</template>
<script>
  import Headtop from '../../components/HeaderComponent.vue';
  import Upload from '../../components/upload.vue';
  var root = window || {},
      util = root.util;
  export default {
    data(){
      return {
        title: '评价晒单',
        rightmenus: {
          type:'text',
          content: '发布'
        },
        score : [],
        hide : [],
        content : [],
        scoreList: {
          brscore: 0,
          inscore: 0,
          drscore: 0,
          spscore: 0
        },
        photos: [],
        orderType: null,
        lists: {
          body: {
            svlt: [],
            glt: [],
            mkits: []
          }
        }
      }
    },
    created: function(){
      var that=this;
      var hrefParma = util.getHrefParma();
      that.orderType = parseInt(hrefParma.type);
      //1为服务 2为商品
      if (parseInt(hrefParma.type) === 1) {
        that.getService(hrefParma.svid, hrefParma.otn);
      } else {
        that.getGoods(hrefParma.gdsid, hrefParma.spgid);
      }
      //app 导航部分
      if(util.isApp()){
        this.setHeadBar();
      }
    },
    components: {
      Upload,
      Headtop
    },
    methods: {
      setHeadBar(){
        let that = this;
        GomeJSBridge.ready(function(){
            let param = {
                menus : {
                    rightMenus:[
                        {
                            type:'callback',
                            title:'发布',
                            data:{
                                id:'btn1',
                                name:'发布',
                                desc:'发布'
                            }
                        }
                    ]
                }
            };
            util.setHeadBar(param);
        },null);

        GomeJSBridge.onCallback(function(data){
            if(data.id == "btn1"){
                that.submit();
            }
            console.log(data)
        });

      },
      goback(){
        let contentList = $('.discuss-good-list textarea'),
              imgList = $('.img-list img'),
              hasImg = false,
              hasContent = false;
        //如果有未完成的评价内容    
        contentList.forEach((v,i)=>{
            if($(contentList[i]).val()!=''){
              hasContent = true;
            }
        });
    
        if(hasContent || imgList.length>0){ //有文字没有编写完成，或者有图片已经添加
          util.alert('您确认要放弃评价吗？',{
            justOk:false,
            okBtnText:'是',
            cancelBtnText:'否',
            okFn(){
                if(window.history.length<2){
                    util.href(util.getHrefParma().href)
                }else{
                    util.href("javascript:window.history.back(-1)");
                }
            }
          });
        }else{
            if(window.history.length<2){
                util.href(util.getHrefParma().href)
            }else{
                util.href("javascript:window.history.back(-1)");
            }
        }
      },
      /*商品*/
      getGoods: function(gdsid, spgid) {
        var that = this;
        util.api({
          surl: root.COMMENT_API_PATH + 'goods/getComment',
          // surl: '/comment/goods/getComment',
          data: {
            gdsid: gdsid,
            spgid: spgid
          },
          type: 'get',
          success: function(response) {
            var rpco = response.rpco;
            switch (rpco) {
              case 200:
                that.lists = response;
                for (var i = 0; i < response.body.glt.length; i++) {
                  that.score.push(5);
                  that.hide.push(0);
                  that.content.push("");
                }
                // $.each(response.body.mkits, (index, item) => {
                //   if (item == 3) {
                //     that.scoreList.brscore = 0
                //   } else if (item == 2) {
                //     that.scoreList.inscore = 0
                //   } else if (item == 4) {
                //     that.scoreList.spscore = 0
                //   } else if (item == 1) {
                //     that.scoreList.drscore = 0
                //   }
                // })
                break;
              default: 
                util.tip('服务器繁忙，请稍后再试')
            }
          }
        });
      },
      /*服务*/
      getService: function(svid, otn) {
        var that = this;
        util.api({
          surl: root.COMMENT_API_PATH + 'service/getComment',
          data: {
            svid: svid,
            otn: otn
          },
          type: 'get',
          success: function(response) {
            var rpco = response.rpco;
            switch (rpco) {
              case 200:
                that.lists = response;
                for (var i = 0; i < response.body.svlt.length; i++) {
                  that.score.push(5);
                  that.hide.push(0);
                  that.content.push("");
                }
                // $.each(response.body.mkits, (index, item) => {
                //   if (item == 3) {
                //     that.scoreList.brscore = 5
                //   } else if (item == 2) {
                //     that.scoreList.inscore = 5
                //   } else if (item == 4) {
                //     that.scoreList.spscore = 5
                //   } else if (item == 1) {
                //     that.scoreList.drscore = 5
                //   }
                // })
                break;
              default:
                util.tip('服务器繁忙，请稍后再试')
            }
          }
        });
      },
      upload: function (data) {
        Vue.set(this.photos, data[1] , data[0]);
      },
      /*判断输入字符length*/
      countCharacters: function(str) {
        var totalCount = 0;
        for (var i = 0; i < str.length; i++) {
          var c = str.charCodeAt(i);
          if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            totalCount++;
          } else {
            totalCount += 2;
          }
        }
        return totalCount;
      },
      submit: function(){
        let that = this,
            submitJson = {};
        if( this.orderType === 1 ){
          submitJson.svlt = [];
          this.hide.forEach((v,i) => {
            submitJson.svlt.push({
              score: this.score[i],
              cnt: this.content[i],
              hd: this.hide[i],
              photos: this.photos[i] || [],
              sviul:this.lists.body.svlt[i].sviul,
              otn: this.lists.body.svlt[i].otn,
              svpid: this.lists.body.svlt[i].svpid,
              svid: this.lists.body.svlt[i].svid,
              brscore: this.scoreList.brscore,
              epnb: this.lists.body.svlt[i].epnb || ''
            });
            submitJson.brscore = this.scoreList.brscore;
            submitJson.nknm = this.lists.body.svlt[i].nknm;
            submitJson.epnb = this.lists.body.svlt[i].epnb;
            submitJson.svid = this.lists.body.svlt[i].svid;
            submitJson.svpid = this.lists.body.svlt[i].svpid;
            submitJson.otn = this.lists.body.svlt[i].otn;
            submitJson.mkits = this.lists.body.mkits;
          });
        }else{
          submitJson.odtp = this.lists.body.odtp; 
          submitJson.glt = [];
          this.hide.forEach((v,i) => {
            submitJson.glt.push({
              gdsid: this.lists.body.glt[i].gdsid,
              proid: this.lists.body.glt[i].proId,
              price: this.lists.body.glt[i].price,
              gdiul: this.lists.body.glt[i].gdiul,
              score: this.score[i],
              cnt: this.content[i],
              hd: this.hide[i],
              photos: this.photos[i] || []
            });
          });
          for (var item in this.scoreList) {
            if( this.scoreList[item] !== null ){
              submitJson[item] = this.scoreList[item];
            }
          }
          submitJson.spgid = this.lists.body.spgid;
          submitJson.spguid = this.lists.body.spguid;
          submitJson.insuid = this.lists.body.insuid;
          submitJson.insid = this.lists.body.insid;
          submitJson.slrid = this.lists.body.slrid;
          submitJson.mkits = this.lists.body.mkits;
          submitJson.insflg = this.lists.body.insflg;
          submitJson.dlrflg = this.lists.body.dlrflg;
          submitJson.otn = this.lists.body.otn;
        }

        var wordMin = 0,
            numConut = 0;
        if (this.orderType === 1) {
          for (var i = 0; i < submitJson.svlt.length; i++) {
            numConut = this.countCharacters(submitJson.svlt[i].cnt);
            if (numConut < 20) {
              wordMin++;
            }
          }
        } else {
          for (var i = 0; i < submitJson.glt.length; i++) {
            numConut = this.countCharacters(submitJson.glt[i].cnt);
            if (numConut < 20) {
              wordMin++;
            }
          }
        }
        
        if (wordMin > 0) {
          util.tip("评价内容最少10个汉字(20个字符)");
          return false;
        }
        //判断服务是否已经评价过
        for (let i=0;i<submitJson.mkits.length;i++){
            let item = submitJson.mkits[i];
            if((item==1 && that.scoreList.drscore==0)||(item==2 && that.scoreList.inscore==0)||(item==3 && that.scoreList.brscore==0)||(item==4 && that.scoreList.spscore==0)){
                util.tip("您还没有选择服务评分！");
                return false;
            }
        }

        this.sendOrder(submitJson, this.orderType);
      },
      /*提交评价*/
      sendOrder: function(data, orderType) {
        var surl;
        if (orderType === 1) {
          surl = root.COMMENT_API_PATH + 'service/submitComment';
        } else {
          surl = root.COMMENT_API_PATH + 'goods/submitComment';
        }
        util.api({
          surl: surl,
          //surl: '/comment/goods/submitComment',
          data: data,
          type: 'post',
          success: function(response) {
            var rpco = response.rpco;
            switch (rpco) {
              case 200:
                util.href('./discussScuess.html');
                break;
              default:
                util.tip('服务器繁忙，请稍后再试')
            }
          }
        });
      },
      changeStart: function(index, type){
        var that = this;
        if (type == 3) {
          that.scoreList.brscore = index + 1;
        } else if (type == 2) {
          that.scoreList.inscore = index + 1;
        } else if (type == 4) {
          that.scoreList.spscore = index + 1;
        } else if (type == 1) {
          that.scoreList.drscore = index + 1;
        }
      },
      discussStart: function(index, i){
        Vue.set(this.score, index, i + 1);
      },
      // changeName: function(index, key){
      //   Vue.set(this.hide, index, (key === 0 ? 1 : 0));
      // }
    }
  }
</script>
<style lang="less">
  .mixinfont (@font){
    font-size: @font; 
    [data-dpr="2"] & { font-size: @font * 2; } 
    [data-dpr="3"] & { font-size: @font * 3; } 
  }
  html,body{
    background:#f3f5f8!important;
    font-family: 'PingFangSC-Regular',sans-serif;
  }
  .f-l{
    float:left;
  }
  .f-r{
    float:right;
  }
  .tips{
    .mixinfont(14px);
    line-height:(40/75)*1rem;
  }
  .header .right div{ 
    color: #ff4b46; 
    .mixinfont(16px);
  }
  .discuss-good-list{
    margin-top:(20/75)*1rem;
    .discuss-good-top{
      padding:(25/75)*1rem (30/75)*1rem (33/75)*1rem;
      .mixinfont(14px);
      line-height:(42/75)*1rem;
      color:#333;
      background:#fff;
      border-bottom:1px #ddd solid;
      img{
        float:left;
        width:(98/75)*1rem;
        height:(98/75)*1rem;
        overflow:hidden;
        margin:(12/75)*1rem (23/75)*1rem 0 0;
        border:1px #e3e3e3 solid;
        border-radius:4px;
      }
      .discuss-good-info{
        float:left;
        width:(560/75)*1rem;
        div:nth-child(1){
          max-height:(84/75)*1rem;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;  
        }
        div:nth-child(2){
          span{
            margin:(7/75)*1rem (7/75)*1rem 0 0;
              float:left;
              width:(32/75)*1rem;
              height:(30/75)*1rem;
              overflow:hidden;
              background:url(//gfs12.gomein.net.cn/T1IuJvB7L_1RCvBVdK.jpg) 0 0 no-repeat;
              background-size:100% 100%;
          }
          .active{
            background-image:url(//gfs12.gomein.net.cn/T1OixvBThv1RCvBVdK.jpg);
          }
        }
      }
    }
    .discuss-good-insert{
      padding:(22/75)*1rem 0 (22/75)*1rem (30/75)*1rem;
      background:#fff;
      line-height:(86/75)*1rem;
      .mixinfont(14px);
      color:#333;
      .picupload{
        .img-list{
          margin:0;
          padding:0;
          li{
            margin-bottom:0;
          }
        }
      }
      textarea{
        box-sizing:border-box;
        padding-right:(30/75)*1rem;
        line-height:(42/75)*1rem;
        width:100%;
        resize:none;
        height:(168/75)*1rem;
      }
      .discuss-good-notice{
        padding:0 (30/75)*1rem  (2/75)*1rem 0; 
        border-top:1px #ddd solid;
        .discuss-people-showname,.discuss-people-nsname{
          padding:0 0 0 (56/75)*1rem;
          background:url(//gfs11.gomein.net.cn/T1liJvBjWv1RCvBVdK.png) (6/75)*1rem 50% no-repeat;
          background-size: (32/75)*1rem (32/75)*1rem;
        }
        .discuss-people-nsname{
          background-image:url(//gfs11.gomein.net.cn/T1u_WvBTAg1RCvBVdK.png);
        }
        .f-r{
          color:#999;
        }
      }
    }
  }
  .discuss-good-list:nth-child(1){
    margin:0;
  }
  .discuss-good-last{
    margin-top:(20/75)*1rem;
    padding:(24/75)*1rem 0 (21/75)*1rem (30/75)*1rem;
    line-height:(56/75)*1rem;
    .mixinfont(16px);
    color:#666;
    background:#fff;
    .discuss-good-ltitle{
      padding-left:(50/75)*1rem;
      background:url(//gfs10.gomein.net.cn/T1GuxvBQVv1RCvBVdK.png) (1/75)*1rem 50% no-repeat; 
      background-size:(30/75)*1rem (32/75)*1rem;
      color:#333;
    }
    span{
      margin:(12/75)*1rem (7/75)*1rem 0 0;
      float:left;
      width:(32/75)*1rem;
      height:(30/75)*1rem;
      overflow:hidden;
      background:url(//gfs12.gomein.net.cn/T1IuJvB7L_1RCvBVdK.jpg) 0 0 no-repeat;
      background-size:100% 100%;
    }
    .active{
      background-image:url(//gfs12.gomein.net.cn/T1OixvBThv1RCvBVdK.jpg);
    }
    .f-l{
      margin-right:(21/75)*1rem;
    }
  }
</style>