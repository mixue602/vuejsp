<template>
	  <div id="commentDetail">
        <header-component :title="title"></header-component>
        <div class="wapper">
            <!-- 内容明细区 -->
             <div class="goods-list pb5 iscrollpading-list" id="list">
                <goods-list @setotn="setOtn"></goods-list>
            </div>
            <div class="goods-show oh">
                <div class="goods-show-header bd-none">
                    <span>综合评分</span>
                    <span class="xingji" score="">
                        <span class="cur" v-for='item in commentcontent.goodcom'></span><span v-for='item in commentcontent.badcom'></span>
                    </span>
                    <span class="xingji-text">{{commentcontent.comtext}}</span>
                </div>
                <div class="mt10 comment-txt pr pb20">
                    <span class="comment-txt-text">{{commentcontent.content}}</span>
                </div>
            </div>
         </div>
    </div>
</template>

<script type="ecma6.0">
import headerComponent from '../../components/HeaderComponent';
import goodsList from '../../components/GoodsList';
let root = window || {},
    util = root.util || {};
export default {
	data () {
		return {
			title:'评价',
			hrefParma:{},
            commentcontent: {},
            otn:''
        }
	},
  	created() {
        this.hrefParma = util.getHrefParma();
    },
    methods:{
         // 得到即可修订单号
        setOtn(otn){
            this.otn = otn;
            this._getComment();
        },
        // 获取评价信息
        _getComment() {
            var that = this;

            // debugger:start
            // var res = { "rpco": 200, "msg": "", "body": {
            //     "userName":"测试",
            //     "appraise":3,
            //     "content":"测试评论内容测试评论内容测试评论内容测试评论内容测试评论内容测试评论内容测试评论内容",
            //     "appraiseTime":1474442686000,
            //     "isAppend":0,
            //     "type":0
            // } }
            // var rpco = res.rpco,
            //     body = res.body;


            //         // 处理
            //         switch(rpco) {
            //             case 200:
            //                 body.goodcom = [];
            //                 body.badcom = [];
            //                 that.commentcontent = body;
            //                 switch(body.appraise){
            //                     case 0:
            //                         that.commentcontent.comtext = "非常差";
            //                     break;
            //                     case 1:
            //                         that.commentcontent.comtext = "非常差";
            //                     break;
            //                     case 2:
            //                         that.commentcontent.comtext = "差";
            //                     break;
            //                     case 3:
            //                         that.commentcontent.comtext = "一般";
            //                     break;
            //                     case 4:
            //                         that.commentcontent.comtext = "好";
            //                     break;
            //                     case 5:
            //                         that.commentcontent.comtext = "非常好";
            //                     break;
            //                 }
            //                 that.commentcontent.goodcom.length = parseInt(body.appraise);
            //                 that.commentcontent.badcom.length = 5-parseInt(body.appraise);

            //             break;
            //             case 40401:
            //                 util.tip('服务器繁忙，请稍后再试',2000);
            //                 break;
            //             default:
            //                 util.tip('请求失败');
            //         }
            // return;
            // debugger:end
            util.api({
                surl:root.ORDER_API_PATH + 'getComment',
                type:'get',
                data:{
                    otn: that.otn,
                    odtype: that.hrefParma.odtype,
                    dodt: that.hrefParma.dodt
                },
                success:function(res) {
                    var rpco = res.rpco,
                        body = res.body;
                    // 处理
                    switch(rpco) {
                        case 200:
                            body.goodcom = [];
                            body.badcom = [];
                            that.commentcontent = body;
                            switch(body.appraise){
                                case 0:
                                    that.commentcontent.comtext = "非常差";
                                break;
                                case 1:
                                    that.commentcontent.comtext = "非常差";
                                break;
                                case 2:
                                    that.commentcontent.comtext = "差";
                                break;
                                case 3:
                                    that.commentcontent.comtext = "一般";
                                break;
                                case 4:
                                    that.commentcontent.comtext = "好";
                                break;
                                case 5:
                                    that.commentcontent.comtext = "非常好";
                                break;
                            }
                            that.commentcontent.goodcom.length = parseInt(body.appraise);
                            that.commentcontent.badcom.length = 5-parseInt(body.appraise);

                        break;
                        case 40401:
                            util.tip('服务器繁忙，请稍后再试',2000);
                            break;
                        default:
                            util.tip('请求失败');
                    }
                }
            })
        },
    },
	components: {
		headerComponent,
        goodsList
	}
}

</script>

<style lang="less">
@import '../../util/fs.less';
.fcorange{
    color: #ff4b46!important;
}
#commentSubmit .xingji,
#commentDetail .xingji{
    position: absolute;
    top: 0.08rem;
    margin-left: 0.266667rem;
}
#commentSubmit .xingji span,
#commentDetail .xingji span{
    width: 0.426667rem;
    height: 0.426667rem;
    background: url('./img/xing.png') center center no-repeat;
    background-size: 100%;
    display: inline-block;
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
    .mixinfont(14px);
    line-height: 1.173333rem;
    position: relative;
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
</style>