<template>
  <div class="wapper">
    <Headtop :title="title"></Headtop>
    <div class="discuss-people-top">
      <div class="clearfix">
        <div class="discuss-people-imgBox">
          <img :src="peopleInfo.epimg" :alt="peopleInfo.epnm">
        </div>
        <div class="discuss-people-notice">
          <div>{{peopleInfo.epnm}}</div>
          <div>{{peopleInfo.epphe}}</div>
          <div>员工编号：{{peopleInfo.epnb}}</div>
          <div v-if="ssite">服务地点：{{ssite}}</div>
          <div class="clearfix discuss-people-starts">
            <template v-for="(n,i) in 5">
              <span :class="[{active: i < Math.round(peopleInfo.tscore/peopleInfo.tnum)},'']" :key="i" ></span>
            </template>
          </div>
        </div>
      </div>
      <div v-if="tplbids.length>0" class="clearfix discuss-people-hasTag">
        <template v-for="(item,index) in tplbids">
          <span :key="index">{{item.name}}{{item.total}}</span>
        </template>
      </div>
      <p v-else class="clearfix notips">
          小哥还没有收到任何评价~
      </p>
    </div>
    <div class="discuss-people-middle">
      <div class="discuss-people-title">我要评价</div>
      <div class="discuss-people-mtags clearfix">
        <!-- 未评论星级 -->
        <template v-if="peopleInfo.evd === 0">
            <span v-for="(n,i) in 5" :class="[{active: i < score },'']" @click="changeStars(i)" :key="i"></span>
        </template>
          <!-- 已评论星级 -->
          <template v-else>
            <span v-for="(n,i) in 5" :class="[{active: i < score },'']" :key="i" ></span>
        </template>
      </div>
      <!-- 未评论星级对应标签 -->
      <div class="discuss-people-tag clearfix" v-if="peopleInfo.evd === 0">
        <template  v-for="(item,index) in Tags['score' + score]" >
          <a href="javascript:;" @click="changeTag(item)" :class="[{active:changeTags.indexOf(item.id) !== -1}]" :key="index">{{item.name}}</a>
        </template>
      </div>
      <!-- 已评论星级对应标签 -->
      <div class="discuss-people-tag clearfix" v-else>
        <template  v-for="(item,index) in Tags['score' + score]" >
          <a href="javascript:;" :class="[{'active':item.isSelected},'']" :key="index">{{item.name}}</a>
        </template>
      </div>
      <div>
        <a href="javascript:;" class="discuss-people-submit" v-if="peopleInfo.evd === 0" @click="submit">提交评价</a>
        <a href="javascript:;" class="discuss-people-submit active" v-if="peopleInfo.evd === 1">已评价</a>
        <a href="javascript:;" class="discuss-people-submit active" v-if="peopleInfo.evd === -1">此订单还未完成不可评价</a>
      </div>
    </div>
    <div class="discuss-people-last" v-if="peopleInfo.isrwd === 1">
      <div class="clearfix discuss-people-ltitle">
        <span>打赏小哥</span>
        <span>他已收到<span>{{ rewardObj.num }}</span>份礼物</span>
      </div>
      <div class="discuss-people-gift">
        <ul class="clearfix ">
          <li v-for="item in rewardGoods">
            <div>
              <img :src="item.imgUrl" alt="">
            </div>
            <div class="discuss-people-giftName">{{ item.name }}</div>
            <div><span>{{ item.num }}</span>美豆</div>
            <div>
              <a href="javascript:;" @click="showReward(item)">赠送</a>
            </div>
          </li>
        </ul>
      </div>
      <ul class="discuss-people-list">
        <template  v-for="(item,index) in rewardObj.list">
          <li :key="index">
            <div class="clearfix" >
              <span class="f-l">{{ item.userName }}</span>
              <span class="f-r">{{ item.createTime | formatMsgTime }}</span>
            </div>
            <div class="discuss-people-lnotice">{{ item.content }}</div>
            <div class="discuss-people-gnotice">打赏{{ item.giftName }}</div>
          </li>
        </template>
      </ul>
    </div>
    <!-- <div class="discuss-people-reward">
      <div>小哥已收到您的心意，感谢您的打赏~</div>
    </div> -->
    <div class="discuss-people-giftmask" v-show="ifReward">
      <div class="discuss-people-gContent">
        <a href="javascript:;" class="discuss-people-gmclose" @click="hideReward"></a>
        <div class="discuss-people-gmtitle">打赏小哥</div>
        <div class="discuss-people-gminfo">
          <div>
            <img :src="rewardImg" alt="">
          </div>
          <div>送出{{ rewardInfo.giftName }}（虚拟）需消耗{{ rewardInfo.beanNum }}美豆，<br/>该美豆会转给服务人员作为奖励</div>
          <div>
            <input type="text" placeholder="服务态度很好，业务熟练！" v-model="rewardInfo.content" class="discuss-people-insert"/>
          </div>
          <div class="textLeft">
            <a href="javascript:void(0);" class="discuss-people-nsname" :class="{'active':rewardInfo.isAnonymous}" @click="toggleCheck()">匿名评价</a>
          </div>
          <div>
            <a href="javascript:void(0);" class="discuss-people-gsubmit" @click="rewardWrite">提交</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>  

  import Headtop from '../../components/HeaderComponent.vue';
  let root = window || {},
	  util = root.util || {};
  export default {
    data(){
      return {
        title: 'TA的印象',
        searchList:util.getHrefParma(), //url 参数对象
        score: 5, //默认打分 5星好评
        peopleInfo:{}, //用户信息
        hasTags:[], //已评价过的用户选中的标签
        Tags: {},  //对应星级对应所有标签
        changeTags: [], //选择过程中的标签数组
        tplbids:[], //所有评价标签
        ssite:'',//服务站点默认值
		    rewardObj:{},
        ifReward: false, //是否显示送礼物弹框
        rewardImg:'', //赠送礼物的图片
		    rewardInfo  : {
            orderType:this.type, //订单类型 1：配送订单 2：安装订单 3：服务订单 
            orderId:'', //订单id。
            serviceProviderId:'', //服务提供商id。
            serviceId:'', //服务Id
            shippingGroupId:'',  //配送单id。(服务订单时 shippingGroupId没有 不需要 提供)
            receiverId:'', //被打赏人国美id
            beanNum:0, //打赏美豆数量
            giftId:1, //打赏礼物id
            giftName:'', //打赏礼物名称
            content:'', //评价内容
            isAnonymous:1, //是否匿名送出。(0 不匿名； 1 匿名)
            orderTime:0 //下单时间
        },
        rewardGoods: [
          {
              id:1,
              imgUrl:'//gfs12.gomein.net.cn/T1aQhvBXbv1RCvBVdK.png',
              name:'鲜花',
              num:20
          },
          {
              id:2,
              imgUrl:'//gfs12.gomein.net.cn/T1kfEvBb_v1RCvBVdK.png',
              name:'蛋糕',
              num:40
          },
          {
              id:3,
              imgUrl:'//gfs11.gomein.net.cn/T1jQhvBvYT1RCvBVdK.png',
              name:'玩偶',
              num:60
          },
          {
              id:4,
              imgUrl:'//gfs11.gomein.net.cn/T1SfhvByWv1RCvBVdK.png',
              name:'礼品',
              num:100
          }
        ],
      }
    },
    created: function(){
      let that = this;
      that.init();
      if(util.isApp()){
			  util.deleteHeadBtn();
      }
    },
    components :{
      Headtop
    },
    methods: {
      //初始化加载服务人员信息
      init(){
        let that = this,
            dataParam ={},
            url ='';

        //配送类型
        that.type = Number(that.searchList.svty);//1表示配送 2 表示安装 3表示的管家服务
        that.searchList.svty = that.searchList.svty;
        that.searchList.epnb = that.searchList.epnb;
        //下单时间
        that.rewardInfo.orderTime = that.searchList.dodt||0;
        if(that.type==1||that.type==2){
        //配送 和 安装
            dataParam = {
              'otn':that.searchList.otn, //商户订单号
              'epnb':that.searchList.epnb, //员工编号
              'spgid':that.searchList.spgid, //配送单号/安装单号
              'svty':that.searchList.svty,  //服务类型
              'odtp':this.searchList.odtp //订单类型 0线上 1线下 2管家
            }
            url = root.COMMENT_API_PATH + 'employee/getComment';
        }else{
        //服务人员
            dataParam = {
              'otn':that.searchList.otn, //商户订单号
              'epnb':that.searchList.epnb, //员工编号 第三方没有
              'svid':that.searchList.svid, //设备ID（商品ID）
              'svpid':that.searchList.svpid, //服务提供商ID非必填
              'svty':that.searchList.svty  //服务类型
            }
            url = root.COMMENT_API_PATH + 'employee/getButlerComment';
        }
          
        //人员形象待评价页
        that.getPeopleInfo({
          'url':url,
          'data':dataParam,
          'succFn':(body)=>{
            that.peopleInfo = body;
            that.hasTags =  body.lbids||[]; //当前用户选中的标签
            that.tplbids = body.tplbids || []; //小哥的所有评价标签
            that.ssite = body.ssite||'';
            //打赏美豆的参数
            that.rewardInfo.orderType = that.type;
            that.rewardInfo.orderId = this.peopleInfo.otn;
            that.rewardInfo.serviceProviderId = this.peopleInfo.svpid||'';
            that.rewardInfo.serviceId = this.peopleInfo.svid;
            that.rewardInfo.shippingGroupId = this.peopleInfo.spgid||'';
            that.rewardInfo.receiverId = this.peopleInfo.gmid;
            
            if(body.evd === 0){ //未评分，默认星级5分
              that.score = 5;
              Vue.set(this.Tags, ('score' + that.score), body.lbidcg['score' + that.score] || []);
              
            }else{
              that.score =  body.score || 1; //已评论的分级
              Vue.set(this.Tags, ('score' + that.score), body.lbidcg['score' + that.score] || []);
              
              //对已评分的标签做选中标识
              this.Tags['score'+that.score].forEach((item)=>{
                this.hasTags.forEach((hasTagItem)=>{
                  if(hasTagItem.id == item.id ){
                    item['isSelected'] = true;
                  }
                })
              });
            }
            //获取服务小哥打赏列表
            that.getRewardList();
          },
          'falseFn':()=>{
            util.tip('您当前网络异常，请稍后重试');
          }
        }); 
       
      },
      //切换匿名选择
      toggleCheck(){
         this.rewardInfo.isAnonymous =Number(!this.rewardInfo.isAnonymous);
      },
       /**
       * 提交评价
       * @parma {obj} 参数集合
       * @parma {string} obj.url 访问接口地址
       * @parma {string} obj.data 接口需要的参数
       */
      submitEvaluation(obj){
        //{domain}/comment/yf/employee/submitButlerComment
        //{domain}/comment/yf/employee/submitComment
         let that = this;
        util.api({
            surl: obj.url,
            type: 'post',
            data:obj.data,
            success: function(response) {
                let rpco = response.rpco,
                    body = response.body || {};
                
                //处理
                switch(rpco) {
                    case 200:
                        
                        //更新小哥服务信息
                        that.init();
                        util.tip('小哥已经收到您的服务评价，感谢您的建议~'); //点击知道后，更新数据
                    break;
                    //没有找到对应数据
                    case 404:
                         util.tip('您当前网络异常，请稍后重试');
                        break;
                    default:
                         util.tip('您当前网络异常，请稍后重试');
                }
            },
            complete: function() {
                //移除提示
                util.remComShow();
            }
        });
      },
      /**
       * 服务小哥打赏美豆
       */
      rewardWrite(){
        let that = this;

        util.api({
            surl: root.CLWEED_API_PATH + 'rewardwrite',
            type: 'post',
            data:that.rewardInfo,
            success: function(response) {
                let rpco = response.rpco,
                    body = response.body || {};
                
                //处理
                switch(rpco) {
                    case 200:
                          //更新服务小哥打赏列表
                          that.getRewardList();
                          util.tip('小哥已收到您的心意，谢谢打赏~');                          
                          that.ifReward = false;
                          that.rewardInfo.content = '';
                    break;
                    //没有找到对应数据
                    case 40002:
                        util.tip('哎呀~钱包看的还挺紧！');
                        break;
                    case 40005: 
                        util.tip('您已打赏的够多了~');
                        break;   
                    default:
                        util.tip('哎呀~钱包看的还挺紧！');
                }
            },
            complete: function() {
                //移除提示
                util.remComShow();
            }
        });
      },
      /**
       * 人员形象待评价页 管家服务 配送安装
       * @parma {obj} 参数集合
       * @parma {fucntion}{()=>{}} obj.succFn 成功后的回调函数
       * @parma {fucntion}{()=>{}} obj.falseFn 失败后的回调函数
       */
      getPeopleInfo(obj){
         let that = this;
          util.api({
              //surl:'/resources/json/getButlerComment.json',
              surl:obj.url,
              type: 'get', 
              data:obj.data,
              success: function(response) {
                  let rpco = response.rpco,
                      body = response.body || {};
                  
                  //处理
                  switch(rpco) {
                      case 200:
                           obj.succFn&&obj.succFn(body);
                      break;
                      //没有找到对应数据
                      case 404:
                          obj.falseFn&&obj.falseFn();
                          break;
                      default:
                          obj.falseFn&&obj.falseFn();  
                  }
              },
              complete: function() {
                  //移除提示
                  util.remComShow();
              }
          });
      },
      /**
       * 获取服务小哥打赏列表
       */
      getRewardList(){
          let that = this;
          util.api({
              //surl:'/resources/json/custservice.json',
              surl: root.CLWEED_API_PATH + 'rewardlist',
              type: 'get', 
              data:{
                serverGomeId:that.peopleInfo.gmid, //服务人员gome会员ID
                num:'10'
              },
              success: function(response) {
                  let rpco = response.rpco,
                      body = response.body || {};
                  
                  //处理
                  switch(rpco) {
                      case 200:
                           that.rewardObj = body;
                      break;
                      //没有找到对应数据
                      case 404:
                          util.tip('您当前网络异常，请稍后重试');
                          break;
                      default:
                          util.tip('您当前网络异常，请稍后重试');
                  }
              },
              complete: function() {
                  //移除提示
                  util.remComShow();
              }
          }); 
      },
      showReward: function(item) {
        this.ifReward = true;
        this.rewardInfo.beanNum = item.num;
        this.rewardImg = item.imgUrl;
        this.rewardInfo.giftName = item.name;
        this.rewardInfo.giftId = item.id;
      },
      hideReward: function() {
        this.ifReward = false;
        this.rewardInfo.content = '';
      },
      changeStars: function(index){
        let currentKey = 'score'+ ( index + 1);
        if( index + 1 !== this.score ){
          if(!this.Tags[currentKey]){
            Vue.set(this.Tags, currentKey, this.peopleInfo.lbidcg[currentKey]);
          }
          this.score = index+1;
          Vue.set(this, 'changeTags', []);
        }
      },
      changeTag: function(item){
        let id = item.id;
        if( this.changeTags.indexOf(id) === -1 ){
          this.changeTags.push(id);
        }else{
          let index =  this.changeTags.indexOf(id);
          this.changeTags.splice(index,1);
        }
      },
      //提交评价
      submit: function(){
        let that = this,
            submitList = {};
      
        //配送 和安装
        if( this.type === 1 || this.type === 2 ){
          submitList = {
            score: this.score,
            otn: this.searchList.otn,
            epnb: this.peopleInfo.epnb,
            spgid: this.peopleInfo.spgid
          }
          if( this.changeTags.length > 0 ){
            submitList.lbid = this.changeTags;
          }
          if( this.searchList.svty ){
            submitList.svty = this.searchList.svty;
          }
         //提交配送安装人员评价 
         that.submitEvaluation({
           url:root.COMMENT_API_PATH+'employee/submitComment',
           data:submitList
         });
        }else{ //管家服务
          submitList = {
            score: this.score,
            otn: this.searchList.otn,
            epnb: this.peopleInfo.epnb,
            svid: this.searchList.svid,
            svpid: this.searchList.svpid
          }
          if( this.changeTags.length > 0 ){
            submitList.lbid = this.changeTags;
          }
          if( this.searchList.svty ){
            submitList.svty = this.searchList.svty;
          }
          //提交管家服务人员评价 
         that.submitEvaluation({
           url:root.COMMENT_API_PATH+'employee/submitButlerComment',
           data:submitList
         });
        }
      }
    },
    filters:{
		//时间戳转换成几分钟前，几小时前，几天前
		formatMsgTime: function(timespan) {

			var dateTime = new Date(timespan);

			var year = dateTime.getFullYear();
			var month = dateTime.getMonth() + 1;
			var day = dateTime.getDate();
			var hour = dateTime.getHours();
			var minute = dateTime.getMinutes();
			var second = dateTime.getSeconds();
			var now = new Date();
			var now_new = Date.parse(now.toDateString());  //typescript转换写法

			var milliseconds = 0;
			var timeSpanStr;

			milliseconds = now_new - timespan;

			if (milliseconds <= 1000 * 60 * 1) {
				timeSpanStr = '刚刚';
			}
			else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
				timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
			}
			else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
				timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
			}
			else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
				timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
			}
			else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year == now.getFullYear()) {
				timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
			} else {
				timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
			}
			return timeSpanStr;
		}
    }
  }
</script>
<style lang="less">
  .textLeft{
    text-align: left;
  }
  .mixinfont (@font){
    font-size: @font; 
    [data-dpr="2"] & { font-size: @font * 2; } 
    [data-dpr="3"] & { font-size: @font * 3; } 
  }
  html,body{
    background:#f5f5f5!important;
    font-family: 'PingFangSC-Regular',sans-serif;
    .notips{
      .mixinfont(14px);
      width: (670/75)*1rem;
      color: #fff;
      line-height: (32/75)*1rem;
      padding-top:(70/75)*1rem;
      text-align: center;
    } 
    .discuss-people-top{
      height:(396/75)*1rem;
      background:url(//gfs12.gomein.net.cn/T1AL_vBQAv1RCvBVdK.jpg) 0 0 no-repeat;
      background-size:100%;
      padding:(50/75)*1rem  0 0 (40/75)*1rem;    
      .discuss-people-imgBox{
        float:left;
        img{
          float:left;
          width:(190/75)*1rem;
          height:(190/75)*1rem;
          overflow:hidden;
          border:(9/75)*1rem rgba(255,255,255,.5) solid;
          border-radius:50%;
        }
      }
      .discuss-people-notice{
        float:left;
        width:(450/75)*1rem;
        padding: (5/75)*1rem 0 0 (24/75)*1rem;
        .mixinfont(16px);
        line-height:(42/75)*1rem;
        color:#fff;
        div:nth-child(3){
          padding-top:(7/75)*1rem;
        }
        div:nth-child(3),div:nth-child(4){
          .mixinfont(12px);
          line-height:(32/75)*1rem;
        }
        .discuss-people-starts{
          padding-top:(9/75)*1rem;
          span{
            float:left;
            width:(32/75)*1rem;
            height:(30/75)*1rem;
            overflow:hidden;
            background:url(//gfs12.gomein.net.cn/T1J_bvBCdv1RCvBVdK.png) 0 0 no-repeat;
            background-size:100% 100%;
            margin-right:(7/75)*1rem;
          }
          .active{
            background-image:url(//gfs11.gomein.net.cn/T1oDVvBmhT1RCvBVdK.png);
          }
        }
      }
      .discuss-people-hasTag{
        padding-top:(16/75)*1rem;
        span{
          float:left;
          width:(208/75)*1rem;
          height:(44/75)*1rem;
          text-align:center;
          line-height:(44/75)*1rem;
          color:#fff778;
          border:1px #fff778 solid;
          .mixinfont(12px);
          border-radius:20px;
          margin:(20/75)*1rem (20/75)*1rem 0 0;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
    .discuss-people-middle{
      padding:(12/75)*1rem 0 (50/75)*1rem (40/75)*1rem ;
      background:#fff;
      text-align:center;
      .discuss-people-title{
        padding-right: (40/75)*1rem;
        .mixinfont(18px);
        color:#333;
        line-height:(88/75)*1rem;
      }
      .discuss-people-mtags{
        padding:0 0 (3/75)*1rem (195/75)*1rem;
        span{
          float:left;
          width:(48/75)*1rem;
          height:(45/75)*1rem;
          overflow:hidden;
          background:url(//gfs13.gomein.net.cn/T1ifhvB_CT1RCvBVdK.png) 0 0 no-repeat;
          background-size:100%;
          margin-right:(11/75)*1rem;
        }
        .active{
          background-image:url(//gfs13.gomein.net.cn/T1PhAvBgdg1RCvBVdK.png);
        }

      }
      .discuss-people-tag{
        a{
          float:left;
          width:(194/75)*1rem;
          height:(50/75)*1rem;
          overflow:hidden;
          text-align:center;
          line-height:(50/75)*1rem;
          .mixinfont(14px);
          color:#666;
          border:1px #ccc solid;
          background:#fff;
          margin: (30/75)*1rem (28/75)*1rem 0 0;
          border-radius:4px;
        }
        .active{
          border-color:#ff4b46;
          background:#ffeceb;
        }
      }
      .discuss-people-submit{
        display:block;
        width:(590/75)*1rem;
        height:(88/75)*1rem;
        line-height:(88/75)*1rem;
        margin:(60/75)*1rem 0 0 (40/75)*1rem;
        text-align:center;
        color:#fff;
        background:#ff4b41;
        .mixinfont(18px);
        border-radius:(40/75)*1rem;
      }
      .discuss-people-submit.active{
        background:#e0e0e0;
      }
    }
    .discuss-people-last{
      margin-top:(20/75)*1rem;
      background:#fff;
      .discuss-people-ltitle{
        padding: 0 (40/75)*1rem 0 (37/75)*1rem;
        line-height:(90/75)*1rem;
        color:#333;
        .mixinfont(16px);
        span:nth-child(1){
          // float:left;
        }
        span:nth-child(2){
          float:right;
          color:#666;
          .mixinfont(12px);
          span{
            color:#ff4b46;
          }
        }
      }
      .discuss-people-gift{
        padding:(10/75)*1rem 0 (40/75)*1rem 0;
        overflow:hidden;
        ul{
          margin: 0 -(5/75)*1rem;
        }
        li{
          float:left;
          width:(190/75)*1rem;
          overflow:hidden;
          text-align:center; 
          .mixinfont(12px);
          color:#666; 
          line-height:(34/75)*1rem;
          img{
            display:block;
            width:(100/75)*1rem;
            height:(100/75)*1rem;
            margin: 0 auto;
          }
          .discuss-people-giftName{
            .mixinfont(16px);
            color:#333; 
            line-height:(42/75)*1rem;
            padding-top:(15/75)*1rem;
          }
          span{
            color:#ff4b46;
          }
          a{
            display:block;
            width:(118/75)*1rem;
            height:(50/75)*1rem;
            line-height:(50/75)*1rem;
            margin:(12/75)*1rem auto 0;
            .mixinfont(14px);
            color:#666;
            border:1px #ccc solid;
            border-radius:(25/75)*1rem;
          }
        }
      }
      .discuss-people-list{
        padding:(10/75)*1rem 0 0 (40/75)*1rem;
        border-top:1px #e3e3e3 solid;
        li{
          border-bottom: 1px #e3e3e3 solid;
          padding:(26/75)*1rem (40/75)*1rem (19/75)*1rem 0;
          line-height:(46/75)*1rem;
          .mixinfont(14px);
          color:#666;
          .f-l{
            float:left;
          }
          .f-r{
            float:right;
          }
          .discuss-people-lnotice{
            line-height:(36/75)*1rem;
            .mixinfont(14px);
            color:#333;
          }
          .discuss-people-gnotice{
            color:#999;
          }
        }
      }
    }
    .discuss-people-reward{
      position: fixed;
      width:100%;
      height:100%;
      overflow:hidden;
      background:rgba(0,0,0,0);
      z-index:10;
      left:0;
      top:0;
      div{
        padding:(18/75)*1rem (34/75)*1rem (18/75)*1rem (39/75)*1rem;
        .mixinfont(18px);
        width:(466/75)*1rem;
        color:#fff;
        border-radius:(18/75)*1rem;
        background:rgba(0,0,0,.65);
        position:absolute;
        left:50%;
        top:50%;
        -webkit-transform:translate(-50%,-50%);
      }
    }
    .discuss-people-giftmask{
      position: fixed;
      width:100%;
      height:100%;
      oveflow:hidden;
      background:rgba(0,0,0,.5);
      left:0;
      top:0;
      z-index:10;
      .discuss-people-gContent{
        position: absolute;
        width:100%;
        left:0;
        bottom:0;
        background:#fff;
        .discuss-people-gmtitle{
          line-height:(88/75)*1rem;
          text-align:center;
          .mixinfont(16px);
          color:#333;
          border-bottom:1px #e3e3e3 solid;
        }
        .discuss-people-gminfo{
          padding:(61/75)*1rem (80/75)*1rem (103/75)*1rem;
          line-height:(36/75)*1rem;
          text-align:center;
          .mixinfont(14px);
          color:#666;
          img{
            display:block;
            width:(100/75)*1rem;
            height:(100/75)*1rem;
            margin:0 auto (28/75)*1rem;
          }
          .discuss-people-insert{
            box-sizing:border-box;
            border:1px #e3e3e3 solid;
            background:#f3f4f5;
            line-height:(86/75)*1rem;
            padding-left:(20/75)*1rem;
            width:100%;
            margin-top:(38/75)*1rem;
            border-radius:5px;
          }
          .discuss-people-showname,.discuss-people-nsname{
            text-align:left;
            padding-left:(51/75)*1rem;
            line-height:(72/75)*1rem;
            .mixinfont(14px);
            color:#333;
            background:url(//gfs11.gomein.net.cn/T1liJvBjWv1RCvBVdK.png) (1/75)*1rem 50% no-repeat;
            background-size: (32/75)*1rem (32/75)*1rem;
          }
          .discuss-people-nsname.active{
            background-image:url(//gfs11.gomein.net.cn/T1u_WvBTAg1RCvBVdK.png);
          }
          .discuss-people-gsubmit{
            display:block;
            margin-top:(40/75)*1rem;
            line-height:(88/75)*1rem;
            .mixinfont(18px);
            color:#fff;
            background:#ff4b46;
            border-radius:(40/75)*1rem;
            text-align: center;
          }
        }
      }
      .discuss-people-gmclose{
        position:absolute;
        width:(30/75)*1rem;
        height:(30/75)*1rem;
        overflow:hidden;
        background:url(//gfs13.gomein.net.cn/T1SDDvB5Kg1RCvBVdK.png) 0 0 no-repeat;
        background-size:(30/75)*1rem (30/75)*1rem;
        right:(30/75)*1rem;
        top:(30/75)*1rem;
        z-index:10;
      }
    }
  }
</style>