<template>
    <div class="wapper" ref="custService">
        <header-component :title='title'></header-component>
        <div class="container">
            <div class="notice-box bottom2">
                <span class="icon">公告</span>
                <ul class="notice-list">
                    <li><a href="javascript:util.href('./notice.html');">关于国美管家服务地区开通公告关于国美管家服务地区开通公告关于国美管家服务地区开通公告</a></li>
                </ul>
            </div>
            <div class="service-box bottom2">
                <h2 class="title">自助服务</h2>
                <div class="service-list">
                    <li class="service-li" v-if="dirkf">
                        <a @click="kefuHref" href="javascript:;" title="在线客服">
                            <img class="service-img" src="//gfs12.gomein.net.cn/T1sL_vBmDg1RCvBVdK.png" alt="在线客服">
                        </a>
                        <p class="service-name">在线客服</p>
                    </li>
                    <li class="service-li">
                        <a href="tel:4008708708" title="电话客服">
                            <img class="service-img" src="//gfs10.gomein.net.cn/T19DKvB7Jj1RCvBVdK.png" alt="电话客服">
                        </a>
                        <p class="service-name">电话客服</p>
                    </li>
                    <!-- <li class="service-li">
                        <a href="javascript:void(0);" title="账户服务">    
                            <img class="service-img" src="//gfs13.gomein.net.cn/T15iJvBjDg1RCvBVdK.png" alt="账户服务">
                        </a>
                        <p class="service-name">账户服务</p>
                    </li>-->
                    <li class="service-li">
                        <a href="javascript:util.href('./nearbystores.html');" title="附近门店"> 
                            <img class="service-img" src="//gfs11.gomein.net.cn/T1XihvBKDg1RCvBVdK.png" alt="附近门店">
                        </a>
                        <p class="service-name">附近门店</p>
                    </li> 
                </div>
            </div>
            <h2 class="help-box-title">帮助中心</h2>
            <div class="help-box" ref="helpBox">
                <div class="firstwrapper bottom2" ref="firstwrapper">
                    <ul class="first-nav">
                        <template v-for="(item,index) in navList">
                            <li class="first-li" :class="{'cur':currentIndex === index}" @click="selectFristMenu(index,item.id,$event)" :key='index'>
                                <a href="javascript:void(0);">{{item.name}}</a>
                            </li>
                        </template>
                    </ul>
                </div>
                <div class="secondWrap" ref="secondWrap">
                    <div v-show="secondList.length>0" class="help-list">
                        <template v-for="(item,index) in secondList">
                            <a class="help-li" :class="{'cur':subCurIndex === index}" href="javascript:void(0);"  @click="selectSecondMenu(index,item.id,$event)" :key='index' title="item.name">
                            {{item.name}}
                            </a>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div ref="J_Scroll" id="J_Scroll">
            <div class="xs-container">
                <div class="xs-content">
                    <ul class="problemList" ref="problemList">
                        <template v-for="(item,index) in helpList">
                            <li class="problem-li bottom2" :key='index'>
                                <a :href="'./solution.html?id='+item.id" class="problem-title">
                                    {{item.title}}
                                </a>
                            </li>
                        </template>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="ecma6.0">
import headerComponent from '../../components/HeaderComponent';
import BScroll from 'better-scroll';


let root = window || {},
    util = root.util || {};
   
export default {
    data () {
        return {
            title:'客户服务',
            currentIndex:0,//默认选中的是第一个
            subCurIndex:0, //子列表选中的索引
            navList:[], //分类列表
            secondList:[], //子集列表
            fristNavWidth:'auto',//计算获得第一个导航的宽度
            secondNavWidth:'auto',//计算获得第二个导航的宽度
            helpList:[], //帮助列表
            curPg:1,// 帮助列表分页数
            tPage:1, //总页数，默认1
            pageSize:10,//帮助列表默认一页展示10条数据
            cateId:'',//分类ID
            firstwrapperOffsetTop:0,//获取初始位置
            dirkf: false,//默认不显示在线客服
            wxuserinfo : '' //用户信息
        };
    },
    watch:{
        helpList(){
           let that = this;
            that.$nextTick(()=>{
                //重新渲染滚动插件
                that.xscroll.render();
                
                //分页数小于1页的，不显示加载中语句
                if(that.tPage<=1){
                    that.xscroll.unplug(that.pullup);
                }else{
                    that.xscroll.plug(that.pullup);
                    that.pullup.complete();
                }
            });
        }
    },
    methods:{
        //判断浏览器类型
        operator() {
            //如果是微信浏览器
            if(util.isWeiXin()){
                this.dirkf = true;
                this._getUserInvoice();
            }else{ //如果是网页或者app端
               this.dirkf = false; 
            }
        },
        /**
         * 计算外层宽度
         * @parma {obj} 参数集合
         * @parma {string} obj.wrap 最外层元素
         * @parma {string} obj.liClass li列表class
         * @parma {string} obj.navClass 导航样式
         * @parma {boolean} obj.isSecond 第二个导航加一个margin-left\margin-right:10 的值
         */
        computedWidth(obj){
            let liList= this.$refs[obj.wrap].getElementsByClassName(obj.liClass),
                nav = this.$refs[obj.wrap].getElementsByClassName(obj.navClass)[0],
                liListArray= [...liList],
                wrapWidth =  this.$refs[obj.wrap].offsetWidth,
                //初始化值为0
                _computedWidth = 0;
            
            liListArray.map(li=>{
                if(obj.isSecond){ //第二个导航有margin 左右值
                    _computedWidth += 2*(10/75)*this.styleFontSize;
                }
                _computedWidth += (li.clientWidth+1);
            });

            //判断ul宽度是否小于屏幕宽度
            if(_computedWidth< wrapWidth){
                _computedWidth = wrapWidth;
             }
 
            nav.style.width = _computedWidth+'px';
            return _computedWidth;
        },
        /**
         * 点击滑动特效
         * @parma {obj} 参数集合
         * @parma {string} obj.wrap 最外层元素
         * @parma {string} obj.liClass li列表class
         * @parma {number} obj.curIndex 当前选中的索引值
         * @parma {number|string} obj.navWidth 导航全长
         * @parma {string} obj.scrollElment 滚动元素
         * @parma {boolean} obj.isSecond 是第二个导航需要加上margin:0 10px 的值
         * 
         */
        clickSlideEffects(obj){
            let liList= this.$refs[obj.wrap].getElementsByClassName(obj.liClass),
                wrapperWidth = this.$refs[obj.wrap].clientWidth,
                //nav导航允许的最小posX值
                minPosX = wrapperWidth-obj.navWidth,
                //索引距离
                indexDistance = 0;
                
            for(let i=0;i<obj.curIndex;i++){
                //针对第二个导航多算的margin值
                if(obj.isSecond){
                    indexDistance += 2*(10/75)*this.styleFontSize;
                }
                indexDistance += liList[i].offsetWidth;
            }

            
            //导航的位移值
            let wrapperPosX= -1* Math.floor(indexDistance+liList[obj.curIndex].offsetWidth/2-wrapperWidth/2);
            //针对第二个导航多算的margin值
            if(obj.isSecond){
                wrapperPosX -= (10/75)*this.styleFontSize;
            }

            //滑动的范围
            if(wrapperPosX > 0 || wrapperPosX == 0){
                wrapperPosX = 0
            }else if(wrapperPosX < minPosX || wrapperPosX == minPosX){
                wrapperPosX = minPosX;
            }

            //当前问题分类大于外层宽度时才进行滑动
            if(wrapperWidth<obj.navWidth){
                obj.scrollElment.scrollTo(wrapperPosX, 0, 300, 'easing');
            }
        },
        /**
         * 微信端请求客服时所需的数据
         */      
        _getUserInvoice() {
           let that = this;
           // 请求数据
           util.api({
               surl: root.MB_API_PATH + 'wxuserinfo',
               type: 'get',
               success: function (response) {
                   var rpco = response.rpco,
                       body = response.body || {};
                   // 处理
                   switch (rpco) {
                       // 正常
                       case 200:
                            that.wxuserinfo = body;                                            
                           break;
                       // default:
                       // util.tip('服务器繁忙，请稍后再试');
                       // alert('微信获取返回状态吗有问题')
                       // that.dirkf = false;
                   }
               }
           });
        },
        //跳转客服聊天界面 
        kefuHref(){ 
            window.location.href = 'http://jn.corp.gome.com.cn:8080/EliteWebChat/jsp/gome/gomeMiddlePage.jsp?queue=52&urlFrom=wechat&wechatUserInfo=' + this.wxuserinfo;
        },
        /**
         * 获取分类
         * @parma {obj} 参数集合
         * @parma {fucntion}{()=>{}} obj.succFn 成功后的回调函数
         * @parma {fucntion}{()=>{}} obj.falseFn 失败后的回调函数
         */
        getCatalog(obj){
            let that = this;
            util.api({
                //surl:'/resources/json/custservice.json',
                surl: root.ME_API_PATH + 'help/cate',
                type: 'get', 
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
         * 获取帮助列表
         * @parma {obj} 参数集合
         * @parma {fucntion}{()=>{}} obj.succFn 成功后的回调函数
         * @parma {fucntion}{()=>{}} obj.falseFn 失败后的回调函数
         */
        getHelpList(obj){
            let that = this;
            util.api({
                //surl:'/resources/json/custservicehelplist.json',
                surl: root.ME_API_PATH + 'help/list',
                data: {
                    secondCatalogId: obj.secondCatalogId,
                    pageNo: obj.pageNo,
                    pageSize: obj.pageSize
                },
                type: 'get', 
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
         * 初始化帮助列表数据
         */
        _initHelpList(){
            this.getHelpList({
                'secondCatalogId':this.cateId,
                //当前分页数
                'pageNo':this.curPg,
                'pageSize':this.pageSize,
                'succFn':(body)=>{
                    //帮助列表
                    this.helpList = body.data.page.list ||[];
                    //总页数
                    this.tPage = body.data.page.totalPage;
                },
                'falseFn':()=>{
                    util.tip('您当前网络异常，请稍后重试'); 
                }
            });
        },
        //点击第一个分类的操作
        selectFristMenu(index,fristId,ev){ 
            //自己默认派发事件时候(BScroll),_constructed被置为true,但是浏览器原生并没有这个属性
            if (!ev._constructed){
                return;
            }
            //当前索引值
            this.currentIndex = index;
            //二级分类默认选第一个
            this.subCurIndex = 0;
            this.curPg = 1;
            this.$nextTick(() => {
                //计算滚动区域高度
                this.computeTop();
                //滚动到最顶部
                this.xscroll.scrollTop(0,0,'ease');
                //隐藏加载提示文字
                this.xscroll.unplug(this.pullup);
            });
          
            //点击滑动效果
            this.clickSlideEffects({
                'wrap':'firstwrapper',
                'liClass':'first-li',
                'curIndex':this.currentIndex,
                'navWidth':this.fristNavWidth,
                'scrollElment':this.firstScroll
            });
       
            //二级菜单渲染
            this.secondList = this.navList[this.currentIndex].subList || [];
            //初始化为空
            this.helpList = [];
            //如果没有二级分类,请求接口获取帮助列表数据
            if(!this.secondList.length){
                //请求一级分类下的帮助列表数据
                this.cateId = fristId;
                //列表渲染完成后，执行滚动回调
                this._initHelpList();
            }else{
                this.$nextTick(() => {
                    //计算二级菜单的宽度
                    this.secondNavWidth = this.computedWidth({
                        'wrap':'secondWrap',
                        'liClass':'help-li',
                        'navClass':'help-list',
                        'isSecond':true
                    });
                    //二级菜单默认滑到位置0
                    this._initScroll();
                    this.secondScroll.scrollTo(0, 0, 0, 'easing');
                    //请求帮助列表第一个子分类的数据
                    this.cateId = this.secondList[0].id;
                    this._initHelpList();
                }); 
            }
        },
        //点击第二个分类的操作
        selectSecondMenu(index,secondId,ev){
            //自己默认派发事件时候(BScroll),_constructed被置为true,但是浏览器原生并没有这个属性
            if (!ev._constructed){
                return;
            }
            //当前索引值
            this.subCurIndex = index;
            //初始化分页数为1
            this.curPg = 1;
            //初始化
            this.helpList = [];
            //点击滑动效果
            this.clickSlideEffects({
                'wrap':'secondWrap',
                'liClass':'help-li',
                'curIndex':this.subCurIndex,
                'navWidth':this.secondNavWidth,
                'scrollElment':this.secondScroll,
                'isSecond':true
            });
            this.cateId = secondId;
            //请求帮助列表数据
            this._initHelpList();
            
        },
        _initScroll() {
            if(!this.firstScroll){
                 this.firstScroll = new BScroll(this.$refs.firstwrapper, {
                    click: true,
                    scrollX: true,
                    probeType: 3
                });
                // //设置监听滚动位置
                // this.firstScroll.on('scroll', (pos) => {
                //     //firstScroll接收变量
                //     this.firstScrollX = Math.abs(Math.round(pos.x));
                // });
            }else{
                this.firstScroll.refresh();
            }

            if(!this.secondScroll){
                 this.secondScroll = new BScroll(this.$refs.secondWrap, {
                    click: true,
                    scrollX: true,
                    probeType: 3
                });
                //设置监听滚动位置
                // this.secondScroll.on('scroll', (pos) => {
                //     //firstScroll接收变量
                //     this.secondScrollX = Math.abs(Math.round(pos.x));
                // });
            }else{
                this.secondScroll.refresh();
            }
          
        },
        //计算滚动区域高度
        computeTop(){
            let content=$('.container'),
                topPos = parseInt(content.height())+parseInt(content.offset().top);

           $('#J_Scroll').css({'top':topPos,'bottom':0});
        },
        loadingMore(){
            let that = this;
            //计算滚动区域高度
            that.computeTop();
            //初始化
            that.xscroll = new XScroll({
                renderTo: that.$refs.J_Scroll,
                lockY:false
            });

            that.pullup = new XScroll.Plugins.PullUp({
                upContent:"上拉加载更多...",
                downContent:"释放加载...",
                loadingContent:"努力加载中...",
                bufferHeight:0
            });
            //加载触底
            that.pullup.on("loading",function(){

                that.curPg += 1;   // 每次更迭加载的页数

                if(that.curPg<= that.tPage){
                    that.getHelpList({
                        'secondCatalogId':that.cateId,
                        //当前分页数
                        'pageNo':that.curPg,
                        'pageSize':that.pageSize,
                        'succFn':(body)=>{
                            //帮助列表
                            body.data.page.list.forEach(list=>{
                                that.helpList.push(list);
                            })
                            //总页数
                            that.tPage = body.data.page.totalPage;
                        },
                        'falseFn':()=>{
                            //更迭加载的页数
                            that.curPg -= 1;
                            util.tip('您当前网络异常，请稍后重试');
                        }
                    });
                }else{
                    that.xscroll.render();
                    that.pullup.complete();
                    // that.xscroll.unplug(that.pullup);
                    //底部加载文字处理
                    $('.xs-plugin-pullup-container').html('没有更多了');
                    
                }
                
            });
        }
        
    },
    created(){
            
        //获取分类信息
        this.getCatalog({
            'succFn':(body)=>{
                //优惠券列表
                //设置列表数据
                this.navList = body.data&&body.data.catalog || [];

                this.$nextTick(() => {
                    this.firstwrapperOffsetTop = $(this.$refs.firstwrapper).offset().top;
                    //获取html font-size大小
                    this.styleFontSize = getComputedStyle(window.document.documentElement)['font-size'].split('px')[0];
                    //设置第一分类的宽度
                    this.fristNavWidth = this.computedWidth({
                        'wrap':'firstwrapper',
                        'liClass':'first-li',
                        'navClass':'first-nav'
                    });
                    //初始化滚动事件
                    this._initScroll();
                    //二级菜单渲染
                    this.secondList = this.navList[this.currentIndex]&& this.navList[this.currentIndex].subList || [];
                    
                    //如果没有二级分类,请求接口获取帮助列表数据
                    if(!this.secondList.length){
                        //请求一级分类下第一个问题的帮助列表数据
                        this.cateId = this.navList[0].id;
                    }else{
                        //请求帮助列表二级分类下第一的数据
                        this.cateId = this.secondList[0].id;
                    }
                    //加载更多
                    this.loadingMore();
                    //获取帮助列表信息及初始化滚动位置
                    this._initHelpList();
                    
                });
            },
            'falseFn':()=>{
                util.tip('您当前网络异常，请稍后重试');
            }
        });
        
        //执行客服逻辑
        this.operator();
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
    body,html{
        font-family: 'PingFangSC-Regular',sans-serif;
        background: #f5f5f5;
    }
    .xs-plugin-pullup-container{
        width: 100%;
        text-align: center;
        font-size: 12px;
        line-height: 1.066667rem;
    }
    #J_Scroll{
        width: 10rem;
        min-width: 320px;
        position: absolute;
    }
    /* 公共内容区 */
    .container {
        width: 10rem;
        min-width: 320px;
        overflow-x: hidden;
        overflow-y: auto;
        position: relative;
        -webkit-overflow-scrolling: touch;
        z-index:999;
        background: #f5f5f5;
    }
    .service-box .title{
        font-family: PingFangSC-Medium;
        padding-top:.186667rem /* 14/75 */;
        margin-left:.426667rem /* 32/75 */;
        line-height: .586667rem /* 44/75 */;
        .mixinfont(14px);
        color: #333333;
    }
    .help-box-title{
        font-family: PingFangSC-Medium;
        padding-top:.186667rem /* 14/75 */;
        padding-left:.426667rem /* 32/75 */;
        line-height: .586667rem /* 44/75 */;
        .mixinfont(14px);
        color: #333333;
        background: #fff;
    }
    .notice-box{
        width: 100%;
        height: .853333rem /* 64/75 */;
        padding-left:.4rem /* 30/75 */;
        overflow: hidden;
        position: relative;
        background: #fff;
      
        .icon{
            display: inline-block;
            width: .853333rem /* 64/75 */;
            height: .453333rem /* 34/75 */;
            line-height: .453333rem /* 34/75 */;
            float: left;
            overflow: hidden;
            text-align: center;
            background: #FF4B41;
            border-radius: 2px;
            .mixinfont(12px);
            color: #FFFFFF;
            margin: .186667rem /* 14/75 */ .133333rem /* 10/75 */ 0 0 ;
        }
        .notice-list{
            width: 8.133333rem /* 610/75 */;
            height: .453333rem /* 34/75 */;
            line-height: .453333rem /* 34/75 */;
            margin-top: .186667rem;
            float: left;
            overflow: hidden;

            li{
                width: 8.133333rem /* 610/75 */;
                float: left;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                a{
                   color: #999999;  
                   .mixinfont(12px);
                }

            }
        }

    }
    
    .service-box{
         background: #fff;
        .service-list{
            overflow: hidden;
            padding-top: .213333rem;
            padding-bottom: 0.373333rem;
            .service-li{
                width: 2.493333rem /* 187/75 */;
                display: block;
                text-align: center;
                float: left;
                a{
                    display: block;
                    width: 1.333333rem /* 100/75 */;
                    height:  1.333333rem /* 100/75 */;
                    margin: 0 auto;
                    .service-img{
                        display: block;
                        width: 1.333333rem /* 100/75 */;
                        height:  1.333333rem /* 100/75 */;
                    }
                }
                .service-name{
                    margin-top:.186667rem /* 14/75 */;
                    .mixinfont(12px);
                    color: #333333;
                    letter-spacing: 0;
                }
            }
        }
    }

    .help-box{
        overflow: hidden;
        background: #fff;
        min-width:320px;
        width:100%;

        .firstwrapper{
            position: relative;
            .first-nav{
                padding-top:.213333rem /* 16/75 */;
                overflow: hidden;
                height:.933333rem /* 70/75 */;
                .first-li{
                    float: left;
                    text-align: center;
                    overflow: hidden;
                    font-size:0;
                    
                    a{
                        display: inline-block;
                        .mixinfont(14px);
                        height:.933333rem /* 70/75 */;
                        line-height:.933333rem /* 70/75 */;
                        padding: 0 .293333rem /* 22/75 */;
                        color: #666666;
                    }
                }
                .cur{
                    position: relative;

                    &:after{
                        height: 2px;
                        content: '';
                        width: 100%;
                        border-top: 2px solid #FF4B41;
                        position: absolute;
                        bottom: -2px;
                        right: 0;
                        z-index: 10
                    }
                    a{
                        color:#FF4B41;
                    }
                }
            }
        }
        .secondWrap{
            position: relative;
            background: #f5f5f5;
            .help-list{
                overflow: hidden;
                height:1.173333rem /* 88/75 */;

                .title{
                    padding-top: .426667rem /* 32/75 */;
                }
            
                .help-li{
                    &.cur{
                        color: #FF4B41;
                    }
                    
                    float: left;
                    background: #fff;
                    margin:.266667rem /* 20/75 */ .133333rem /* 10/75 */;
                    padding:0 .32rem /* 24/75 */;
                    display: block;
                    height: 0.64rem /* 48/75 */;
                    line-height: 0.64rem /* 48/75 */;
                    text-align: center;
                    border-radius: 0.366667rem /* 20/75 */;
                    .mixinfont(12px);
                    color: #999;
                }
            }
        }
    }
    

    .bottom2{
        position: relative;
        &:after{
            height: 0.026667rem;
            content: '';
            width: 100%;
            border-top: 0.026667rem solid #ddd;
            position: absolute;
            bottom: -.026667rem /* 2/75 */;
            right: 0;
            z-index: 10;
        }
    }
    .problemList{
        overflow: hidden;
        .problem-li{
            position: relative;
            width: 100%;
            height: 1.2rem;
            float: left;
            background: #fff;
            
            .problem-title{
                display: block;
                width: 8.72rem;
                height: 1.2rem;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                margin-left:0.426667rem;
                .mixinfont(15px);
                line-height: 1.2rem;
                color: #333333;

                &:after{
                    content:'';
                    position: absolute;
                    width: 0.32rem;
                    height: 0.32rem;
                    top:0.46rem;
                    right:0.373333rem;
                    background-image:url('//gfs13.gomein.net.cn/T1euEvBsDT1RCvBVdK.png');
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                }
            }
        }
        .bottom2:last-child{
            &:after{
                height: .026667rem /* 2/75 */;
                content: '';
                width: 100%;
                border-top: .026667rem solid #fff;
                position: absolute;
                bottom: -1*.026667rem;
                right: 0;
                z-index: 10
            }
        }
    }
@media (-webkit-min-device-pixel-ratio: 1.5),(min-device-aspect-ratio: 1.5){
    .bottom2:last-child{
        &:after{
            -webkit-transform : scaleY(0.7);
            transform : scaleY(0.7);
         }
    }
    .problem-title:after,.cur:after{
         -webkit-transform : scaleY(0.7);
        transform : scaleY(0.7); 
    }
}
@media (-webkit-min-device-pixel-ratio: 2),(min-device-aspect-ratio: 2){
     .bottom2:last-child{
         &:after{
            -webkit-transform : scaleY(0.5);
            transform : scaleY(0.5);
         }
    }
    .problem-title:after,.cur:after{
         -webkit-transform : scaleY(0.5);
        transform : scaleY(0.5); 
    }
}

</style>