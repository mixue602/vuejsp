<template>
	<div id="commentSubmit">
        <div class="header">
            <a class="goBack" @click="fnHref"><i></i></a>
            <span class="title">{{ title }}</span>
        </div>
        <div class="wapper">
            <!-- 内容明细区 -->
            <div class="goods-list pb5 iscrollpading-list" id="list">
                <goods-list @setotn="setOtn"></goods-list>
            </div>
            <!-- 评价主体 -->
            <div class="goods-show oh">
                <div class="goods-show-header bd-none">
                    <span>综合评分</span>
                    <span class="xingji">
                        <span v-for="(val,index) in starts" :class="{'cur': val.cur}" @click="setStar(index,val,1)"></span> 
                    </span>
                    <span class="xingji-text">{{starLeval}}</span>
                </div>
                <div class="mt10 comment-txt pr">
                    <textarea @input='isSubmit' v-model="submitObj.commentMas"  maxlength="300" name="" id="" placeholder='主人，请写下对本次服务的感受吧，您的评价对于我们完善服务很重要哦~'></textarea> <span class="txt-tip">300字以内~</span>      
                </div>
                <!-- 收费标准 -->
                <a class='install-charge' href="javascript:;" @click='changeContain'>彩电安装收费标准</a>
            </div>
            <!-- 安装方式 -->
            <tv-tab @setinstallmethods='setInstallMethods'></tv-tab>
            <!-- 问卷调查 -->
            <tv-question @tvques='tvques'></tv-question>

        </div>
        <footer v-show='!tvchargeShow' class="waves" :class = '{"on":submitBtn}'  @click="commentSumit($event)">提交</footer>
        <!-- 收费标准 -->
        <tv-charge v-show='tvchargeShow'></tv-charge>
    </div>
</template>

<script type="ecma6.0">
// import headerComponent from '../../components/HeaderComponent';
import goodsList from '../../components/GoodsList';
import tvTab from './tvtab';
import tvQuestion from './tvquestion';
import tvCharge from './tvcharge';
let root = window || {},
    util = root.util || {};
export default {
	data () {
		return {
			title:'评价',
			hrefParma:{},
            orderDetail:{},
            iconUrl:'',
            submitObj:{
                otn:'',
                commentMas:'',
                grade: 5,
                installType:null,
                installItem:null,
                isOnce:null,
                isExplain:null,
                isDebug:null
            },
            submitBtn: false,
            starts:[{cur:true},{cur:true},{cur:true},{cur:true},{cur:true}],
            attitudeStars:[{cur:true},{cur:true},{cur:true},{cur:true},{cur:true}],
            majorStars:[{cur:true},{cur:true},{cur:true},{cur:true},{cur:true}],
            starLeval:'非常好',
            attitudeStarLeval:'非常好',
            majorStarLeval:'非常专业',
            tvchargeShow:false
        }
	},
  	created() {
        this.hrefParma = util.getHrefParma();
        this.submitObj.otn = this.hrefParma.otn;
    },
    methods:{
        fnHref(){
            if(this.tvchargeShow){
                this.tvchargeShow = !this.tvchargeShow;
                this.title = '评价';
            }else{
                util.href("javascript:window.history.back(-1)");
            }
        },
        changeContain(){
            $("body").scrollTop(0);
            this.tvchargeShow = !this.tvchargeShow;
            this.title = '配件收费标准'; 

        },
        // 得到即可修订单号
        setOtn(otn,gdsid){
            this.submitObj.goodsId = gdsid;
        },
        // 星级评分
        setStar(index,val,flag) {
            let star = null,starStr = null,grade=null;
            switch(flag) {
                case 1:
                    star = 'starts';
                    starStr = 'starLeval';
                    grade = 'grade';
                    break;
                case 2:
                    star = 'attitudeStars';
                    starStr = 'attitudeStarLeval';
                     grade = 'attitudeGrade';
                    break;
                case 3:
                    star = 'majorStars';
                    starStr = 'majorStarLeval';
                    grade = 'majorGrade';
                    break;
            }
            for(var i=0;i<this[star].length;i++){
                if(i<=index){
                    this[star][i].cur = true;
                }else{
                    this[star][i].cur = false;
                }
            }
            switch(index) {
                case 0:
                    this[starStr]= flag === 3 ? '非常不专业' : '非常差';
                    break;
                case 1:
                    this[starStr]= flag === 3 ? '不专业' : '差';
                    break;
                case 2:
                    this[starStr]="一般";
                    break;
                case 3:
                    this[starStr]= flag === 3 ? '专业' : '好';
                    break;
                case 4:
                    this[starStr]= flag === 3 ? '非常专业' : '非常好';
                    break;
            }
            this.submitObj[grade] = index+1;
            this.isSubmit();
            
        },
        //安装方式
        setInstallMethods(installType,installItem){
            this.submitObj.installType = installType;
            this.submitObj.installItem = installItem;
            this.isSubmit();
        },
        // 问卷调查     
        tvques(flag,quesId){
            this.submitObj[flag] = quesId;
            this.isSubmit();
        },
        //判断是否可提交
        isSubmit(){
            if( this.submitObj.otn && 
                this.submitObj.commentMas.trim() && 
                this.submitObj.installType &&
                this.submitObj.installItem!==null &&
                this.submitObj.isOnce!==null &&
                this.submitObj.isExplain!==null &&
                this.submitObj.isDebug!==null 
            ){
                this.submitBtn = true;
            }else{
                this.submitBtn = false;
            }
        },
        // 提交评价
        commentSumit(event) {
            if(!this.submitBtn){return}
            // 表情符
            let reg = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
            // 特殊字符
            let patrn = /[`\\@#&$%^&*_\-\/\+\|=<>{}●△●'|~@#&￥%&*——\-\+={}|《》【】]/ig;  
            if(!this.submitObj.commentMas.trim()){
                util.tip('请输入评价内容'); 
                return;
            }else if(reg.test(this.submitObj.commentMas) || patrn.test(this.submitObj.commentMas)){
                util.tip('评价内容不允许输入特殊字符、emoji表情、html符号'); 
                return;
            }
            ripple(event);
            let data = {
                'orderCode':this.submitObj.otn,
                'goodsId':this.submitObj.goodsId,
                "totalScore": this.submitObj.grade,
                "content": this.submitObj.commentMas,
                'installType':this.submitObj.installType,
                'installItem':this.submitObj.installItem,
                'isOnce':this.submitObj.isOnce,
                'isExplain':this.submitObj.isExplain,
                'isDebug':this.submitObj.isDebug
            }
            util.api({
                surl:root.COMMENT_API_PATH + 'add',
                // surl:'http://10.123.134.140:8088/physicalOrder/apprise/add.do',
                type:'post',
                data:data,
                success:function(res) {
                    var rpco = res.rpco,
                        body = res.body;
                    // 处理
                    switch(rpco) {
                        case 200:
                            util.tip("评价成功",2000);
                            util.href("orderall.html");
                        break;
                        case 40401:
                            util.tip('服务器繁忙，请稍后再试',2000);
                            break;
                        default:
                            util.tip('请求失败');
                    }
                }
            }) 
        }
    },
	components: {
        goodsList,
        tvTab,
        tvQuestion,
        tvCharge
	}
}

</script>

<style lang="less">
@import '../../util/fs.less';
.fcorange{
    color: #ff4b46!important;
}
input::-webkit-input-placeholder, textarea::-webkit-input-placeholder { 
color: #ccc; 
} 
input:-moz-placeholder, textarea:-moz-placeholder { 
color: #ccc; 
} 
input::-moz-placeholder, textarea::-moz-placeholder { 
color: #ccc; 
} 
input:-ms-input-placeholder, textarea:-ms-input-placeholder { 
color: #ccc; 
} 
.wapper{
    padding-bottom: 1.333333rem;
}
.header {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        color: #333;
        .mixinfont(18px);
        text-align: center;
        height: 1.12rem;
        line-height: 1.12rem;
        /* border-bottom: 1px solid #e3e3e3; */
        background-color: #f8f8f8;
        z-index: 1000;
    }
    .header .goBack {
        width: 1.066667rem;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
    .header .title {
        max-width: 70%;
        margin: 0 auto;
        display: block;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .header .goBack i{
        position: absolute;
        top: 0.306667rem;
        left: 0.32rem;
        width: 0.333333rem;
        height: 0.573333rem;
        background:url(//gfs6.gomein.net.cn/T1hTDTBKWQ1RCvBVdK) no-repeat;
        background-size: 0.333333rem 0.573333rem;
    }
/*commentsubmit提交评价 start*/
#commentSubmit .comment-txt{
    position: relative;
    padding: 0.333333rem 0.373333rem 0.8rem;
    margin-bottom: 0.266667rem; 
    border: 1px solid #E3E3E3;
    width: 100%;
    height: 3.146667rem;
    border-radius: 0.08rem;
    -webkit-box-sizing: border-box;
    box-sizing: border-box; 
}
#commentSubmit .comment-txt textarea{
    width: 100%;
    height: 100%;
    .mixinfont(12px);
    resize: none;
}
#commentSubmit .service-comment{
    background-color: #fff;
}
#commentSubmit .comment-txt .txt-tip{
    .mixinfont(12px);
    color: #ccc;
    position: absolute;
    bottom: 0.373333rem;
    right: 0.373333rem;
}
#commentSubmit .xingji,
#commentDetail .xingji{
    position: absolute;
    top: 0.08rem;
    /* left: 1.733333rem; */
    margin-left: 0.266667rem;
}
#commentSubmit .xingji span,
#commentDetail .xingji span{
    width: 0.426667rem;
    height: 0.426667rem;
    background: url('./img/xing.png') center center no-repeat;
    background-size: 100%;
    display: inline-block;
    margin-left:0.133333rem;
}
#commentSubmit .xingji span.cur,
#commentDetail .xingji span.cur{
    background: url('./img/xing_active.png') no-repeat;
    background-size: 100%;
}
#commentSubmit .xingji-text,
#commentDetail .xingji-text{
    position: absolute;
    left: 5rem;
    color: #ff4b46

}
#commentSubmit .goods-show-header.bd-none,
#commentDetail .goods-show-header.bd-none{
    border: none;
}
#commentDetail .pb20{
    padding-bottom: 0.533333rem;
}
/*commentsubmit提交评价 end*/
.goods-list .goods-show {
    margin-bottom: 0.266667rem;
}
.goods-show {
    padding: 0 0.32rem;
    background-color: #fff;
    overflow: hidden;
}
#commentSubmit .goods-show {
    padding-bottom: 0.266667rem;
}
.goods-show .mt24{
    margin-top: 0.533333rem;
}
.goods-show .mt15{
    margin-top: 0.266667rem;
}
.goods-show .mt5{
    margin-top: 0.133333rem;
}
.goods-show .fs16{
	.mixinfont(16px)!important;
}
.goods-show .price-actual{
    color: #777;
    text-decoration: line-through;
}
.goods-show-header {
    .mixinfont(16px);
    line-height: 0.96rem;
    position: relative;
    &:first-child{
        margin: 0.106667rem 0;
    };
    &:last-child{
        margin-top: -0.266667rem;
    };
}
.goods-show-date {
    color: #777;
}
.goods-show-type{
    position: absolute;
    right: 0;
}
.goods-show .list-text.icon {
    padding: 0;
}
.goods-show .list-text.icon li {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    min-height: 2.4rem;
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
    padding-right: 0.96rem;
    padding-left: 1.6rem;
}
.goods-show .list-text.icon .text-icon {
    top: 0.533333rem;
    width: 1.333333rem;
    height: 1.333333rem;
    margin-top: 0;
    display:block;
    -webkit-border-radius: 2px;
    border-radius: 2px;
}

.goods-show .list-text.icon .text-detail {
    /* font-size: .12rem; */
    .mixinfont(12px);
    line-height: 0.506667rem;
    color: #333;
}

.goods-show .list-text.icon .text-tit{
    /* font-size:.14rem; */
    .mixinfont(14px);
    line-height: 0.586667rem;
}
.goods-show .list-text.icon .text-desc{
    /* font-size:.12rem; */
    .mixinfont(12px);
    color: #777777;
    line-height: 0.506667rem;
}

.goods-show .list-text.icon .right-top-txt {
    /* font-size: .12rem; */
    .mixinfont(12px);
    position: absolute;
    top: .15rem;
    right: .1rem;
}

.goods-show .list-text.icon .right-center-txt {
    /* font-size: .12rem; */
    .mixinfont(12px);
    position: absolute;
    top: 1.04rem;
    right: 0.266667rem;
    color: #999;
}

.goods-show .i-gt {
    width: 0.266667rem;
    height: 0.266667rem;
    top: 50%;
    right: 0.453333rem;
    margin-top: -0.133333rem;
}

.goods-show-footer {
    .mixinfont(14px);
    line-height: 1.173333rem;
    position: relative;
    .endtime{
        float: right;
        .mixinfont(12px);
        color: #777;
    }
}

.goods-show-footer .hightlight-text {
    .mixinfont(18px);
    padding-right: 0.266667rem;
    padding-left: 0.053333rem;
}

.goods-show-imglist {
    position: relative;
    overflow: hidden;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    height: 0.24rem;
    padding: 0.4rem 0.88rem 0.4rem 0;
    border-bottom: 1px solid #e3e3e3;
}

.goods-show-imglist-img {
    float: left;
    width: 1.6rem;
    height: 1.6rem;
    margin-right: 0.186667rem;
    margin-bottom: 0.533333rem;
    -webkit-border-radius: 2px;
    border-radius: 2px;
}
.goods-show .comment-txt-text{
    color: #777;
}

/* 文字列表 */
.list-text {
    line-height: 100%;
    background-color: #fff;
    padding: 0 0.32rem;
}
.list-text li {
    padding: 0.32rem 0 0.213333rem;
    position: relative;
}
.list-text li:not(:last-of-type) {
    border-bottom: 1px solid rgba(227, 227, 227, .4);
}
.list-text li a {
    color: #333;
}
.list-text .text-detail {
    color: #666;
    .mixinfont(13px);
    line-height: 0.853333rem;
}
.list-text.icon li {
    padding-left: 1.466667rem;
}
.list-text .text-icon  {
    width: 1.2rem;
    height: 1.2rem;
    margin-top: -0.613333rem;
    position: absolute;
    top: 50%;
    left: 0;
}
.list-text .text-smallgray {
    color: #999;
    .mixinfont(12px);
    line-height: 0.586667rem;   
}
.list-text .i-delete1 {
    top: 0.293333rem;
    right: 0;
    z-index: 10;
}
.list-text .btn-del,
.list-text .btn-edt,
.list-text .btn-operate {
    width: 1.066667rem;
    height: 1.066667rem;
    position: absolute;
    top: 0;
    right: -0.32rem;
    z-index: 20;
}
.list-text .btn-del:after,
.list-text .btn-edt:after,
.list-text .btn-operate:after {
    content: ' ';
    width: 100%;
    height: 100%;
    background-color: transparent;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 20;
}
.list-text .btn-del .i-delete1,
.list-text .btn-edt .i-edit2,
.list-text .btn-operate .i {
    top: 0.586667rem;
    right: 0.32rem;
}
.list-text .i-del {
    top: -0.293333rem;
    right: -0.213333rem;
    z-index: 10;
}
.btn-linear {
    color: #ff4b46;
    .mixinfont(14px);
    border: 1px solid #ff4b46;
    padding: 0.16rem  0.373333rem;
    display: inline-block;
    line-height: 100%;
    -webkit-border-radius: 2px;
    border-radius: 2px;
}
.install-charge{
    display: block;
    width: 100%;
    .mixinfont(16px);
    line-height: 0.88rem;
    margin-bottom: 0.733333rem;
    text-decoration: underline!important;
    color:#0063CF;
    text-align: center;
}
footer{
    position: fixed!important;
    left: 0;
    bottom: 0;
    z-index: 9999;
    width: 100%;
    height: 1.306667rem;
    line-height: 1.306667rem;
    text-align: center;
    background-color: #E0E0E0;
    color: #fff;
    .mixinfont(16px);
    &.on{
        background-color: #ff4b46;
    }
}
</style>